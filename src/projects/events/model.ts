import type { EventItem, EventsFile } from './types'

// Pure helpers for the events page (project 12). No React, no Dexie.
// Times: events.json carries Europe/Rome offsets; the first 10 chars of
// start/end are the local (Rome) date.

export const TZ = 'Europe/Rome'
const LOCALE = 'it-IT'

export const CATEGORIES: { id: string; label: string }[] = [
  { id: 'boardgames', label: 'Board games' },
  { id: 'nerd', label: 'Comics & games' },
  { id: 'exhibitions', label: 'Exhibitions' },
  { id: 'concerts', label: 'Concerts & music' },
  { id: 'cinema', label: 'Cinema' },
  { id: 'talks', label: 'Talks' },
  { id: 'festivals', label: 'Festivals & food' },
  { id: 'other', label: 'Other' },
]
const KNOWN = new Set(CATEGORIES.map((c) => c.id))

/** Unknown category ids (a newer crawler) are treated like `other`. */
export function categoryOf(e: EventItem): string {
  return KNOWN.has(e.category) ? e.category : 'other'
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Other'
}

/**
 * Links and images come from third-party sites via the crawler: only http(s)
 * URLs are rendered, so a `javascript:` URL in scraped data can never run.
 */
export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null
  } catch {
    return null
  }
}

// --- Loading ---------------------------------------------------------------------

export type FetchOutcome =
  | { kind: 'ok'; file: EventsFile }
  | { kind: 'missing' } // 404 or not JSON (dev server SPA fallback)
  | { kind: 'offline' } // network failure / bad schema

/** Fetches events.json; never throws. Only schemaVersion 1 is accepted. */
export async function fetchEventsFile(base: string = import.meta.env.BASE_URL): Promise<FetchOutcome> {
  let res: Response
  try {
    res = await fetch(`${base}events.json`, { cache: 'no-store' })
  } catch {
    return { kind: 'offline' }
  }
  if (res.status === 404) return { kind: 'missing' }
  if (!res.ok) return { kind: 'offline' }
  try {
    const file = (await res.json()) as Partial<EventsFile>
    if (file.schemaVersion !== 1 || !Array.isArray(file.events) || !Array.isArray(file.sources)) {
      return { kind: 'offline' }
    }
    return { kind: 'ok', file: file as EventsFile }
  } catch {
    return { kind: 'missing' }
  }
}

// --- Dates -----------------------------------------------------------------------

const dayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Local Rome date `YYYY-MM-DD` of an instant. */
export function romeDate(ms: number): string {
  return dayFmt.format(new Date(ms))
}

/** Local date `YYYY-MM-DD` of an event ISO string (its own offset is Rome's). */
export function localDay(iso: string): string {
  return iso.slice(0, 10)
}

function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** The last local day the event covers (inclusive). */
function lastDay(e: EventItem): string {
  return localDay(e.end ?? e.start)
}

/**
 * Has the event fully finished at `now`? All-day: after its last day. Timed:
 * after `end`; without an end it stays until the end of its start day (a
 * source with no end time would otherwise vanish the minute it starts).
 */
export function isOver(e: EventItem, now: number): boolean {
  if (e.allDay || !e.end) return romeDate(now) > lastDay(e)
  return now >= Date.parse(e.end)
}

/** Recomputed with the device clock; the file's `ongoing` is ignored. */
export function isOngoingNow(e: EventItem, now: number): boolean {
  if (e.allDay) {
    const today = romeDate(now)
    return localDay(e.start) <= today && today <= lastDay(e)
  }
  const start = Date.parse(e.start)
  const end = e.end ? Date.parse(e.end) : start
  return start <= now && now < end
}

/** Started before today and not over: goes in the "Open now" group. */
export function isLongRunning(e: EventItem, now: number): boolean {
  return localDay(e.start) < romeDate(now) && isOngoingNow(e, now)
}

function fmt(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, ...opts }).format(new Date(iso))
}

const DATE_SHORT: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }
const TIME: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }

/** "gio 2 ott" / "gio 2 ott, 20:30–23:00" / "16 mag – 18 ott" (all-day end inclusive). */
export function formatRange(e: EventItem): string {
  const startDay = localDay(e.start)
  if (e.allDay) {
    const endDay = lastDay(e)
    if (endDay === startDay) return fmt(e.start, DATE_SHORT)
    const sameYear = startDay.slice(0, 4) === endDay.slice(0, 4)
    const o: Intl.DateTimeFormatOptions = sameYear
      ? { day: 'numeric', month: 'short' }
      : { day: 'numeric', month: 'short', year: 'numeric' }
    return `${fmt(e.start, o)} – ${fmt(e.end ?? e.start, o)}`
  }
  const head = `${fmt(e.start, DATE_SHORT)}, ${fmt(e.start, TIME)}`
  if (!e.end) return head
  if (localDay(e.end) === startDay) return `${head}–${fmt(e.end, TIME)}`
  return `${head} – ${fmt(e.end, DATE_SHORT)}, ${fmt(e.end, TIME)}`
}

/** "Oggi", "Domani", else "gio 2 ott" for a local day key. */
export function dayLabel(day: string, now: number): string {
  const today = romeDate(now)
  if (day === today) return 'Oggi'
  if (day === addDays(today, 1)) return 'Domani'
  return fmt(`${day}T12:00:00Z`, DATE_SHORT)
}

export interface DayGroup {
  key: string // local day, or 'open-now'
  label: string
  events: EventItem[]
}

/** Groups by local start day. Events are assumed already sorted by start. */
export function groupByDay(events: EventItem[], now: number): DayGroup[] {
  const groups: DayGroup[] = []
  for (const e of events) {
    const day = localDay(e.start)
    const last = groups[groups.length - 1]
    if (last && last.key === day) last.events.push(e)
    else groups.push({ key: day, label: dayLabel(day, now), events: [e] })
  }
  return groups
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** "3 hours ago" style age of an ISO timestamp. */
export function relativeTime(iso: string, now: number): string {
  const diff = Date.parse(iso) - now
  const mins = Math.round(diff / 60000)
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute')
  const hours = Math.round(mins / 60)
  if (Math.abs(hours) < 48) return rtf.format(hours, 'hour')
  return rtf.format(Math.round(hours / 24), 'day')
}

// --- Things ----------------------------------------------------------------------

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
}

/**
 * A single to-do: `things:///add?title=…&notes=…&when=YYYY-MM-DD`. `when` is
 * the start date if it is still in the future, else today (ongoing events).
 */
export function buildThingsAddUrl(e: EventItem, now: number = Date.now()): string {
  const today = romeDate(now)
  const start = localDay(e.start)
  const when = start > today ? start : today
  const place = [e.venue, e.city].filter(Boolean).join(' · ')
  const notes = [formatRange(e), place, e.summary ? clip(e.summary, 200) : '', safeHttpUrl(e.url) ?? '']
    .filter(Boolean)
    .join('\n')
  return `things:///add?title=${encodeURIComponent(e.title)}&notes=${encodeURIComponent(notes)}&when=${when}`
}
