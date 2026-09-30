import type { EventItem, EventsFile } from './types'

// Pure helpers for the events page (project 12). No React, no Dexie.
// Times: events.json carries Europe/Rome offsets; the first 10 chars of
// start/end are the local (Rome) date.

export const TZ = 'Europe/Rome'
const LOCALE = 'it-IT'

export const CATEGORIES: { id: string; label: string }[] = [
  { id: 'boardgames', label: 'Board games' },
  { id: 'nerd', label: 'Comics & games' },
  { id: 'creative', label: 'Creative' },
  { id: 'theatre', label: 'Theatre' },
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

/**
 * Children's / family events (the crawler's `kids` tag). The owner never
 * wants them, so the page leaves them out entirely; the tag stays in
 * events.json for other consumers.
 */
export function isKidsEvent(e: EventItem): boolean {
  return Array.isArray(e.tags) && e.tags.includes('kids')
}

/**
 * A category chip matches the event's primary category or any of its tags,
 * so e.g. a workshop filed under Talks with a `creative` tag shows under
 * Creative too.
 */
export function inCategory(e: EventItem, id: string): boolean {
  return categoryOf(e) === id || (Array.isArray(e.tags) && e.tags.includes(id))
}

/** Mirrors AREAS in scripts/events/areas.ts (display order: nearest first). */
export const AREAS: { id: string; label: string }[] = [
  { id: 'trentino', label: 'Trentino' },
  { id: 'alto-adige', label: 'Alto Adige' },
  { id: 'verona-garda', label: 'Verona & Garda' },
  { id: 'veneto', label: 'Veneto' },
  { id: 'lombardia', label: 'Lombardia' },
  { id: 'emilia-romagna', label: 'Emilia-Romagna' },
  { id: 'piemonte', label: 'Piemonte' },
  { id: 'toscana', label: 'Toscana' },
  { id: 'abroad', label: 'Estero' },
]
const AREA_RANK = new Map(AREAS.map((a, i) => [a.id, i]))

/** Files from before `area` existed only had these non-Trentino cities. */
const LEGACY_CITY_AREA: Record<string, string> = { Bolzano: 'alto-adige', Verona: 'verona-garda' }

/** The event's area; older files without `area` → derived from the city, else Trentino. */
export function areaOf(e: EventItem): string {
  return e.area || LEGACY_CITY_AREA[e.city] || 'trentino'
}

/** Unknown ids (a newer crawler) are shown as-is. */
export function areaLabel(id: string): string {
  return AREAS.find((a) => a.id === id)?.label ?? id
}

/** Sort key for area ids: known ones nearest first, unknown ones last. */
export function areaRank(id: string): number {
  return AREA_RANK.get(id) ?? AREAS.length
}

/** Hand-curated big event in a far city (spot.json). */
export function isSpot(e: EventItem): boolean {
  return e.ring === 'spot'
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

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000)
}

/**
 * A folded, sparse series (weekly game night, monthly tasting): `occurrences`
 * dates spread over its span, fewer than one date every two days. A folded
 * record that is near-daily (a museum's opening days) is really a long
 * exhibition and is not a series here.
 */
export function isSparseSeries(e: EventItem): boolean {
  if (!(e.occurrences > 1)) return false
  const span = daysBetween(localDay(e.start), lastDay(e)) + 1
  return e.occurrences / span < 0.5
}

/**
 * Best-guess next date (local day key) of a sparse series. events.json has
 * no per-date data for folded series, only first/last date + count, so the
 * cadence is estimated as span / (N-1) days from the first date. Exact for
 * regular weekly/daily series, approximate otherwise.
 */
export function nextSeriesDay(e: EventItem, now: number): string {
  const first = localDay(e.start)
  const last = lastDay(e)
  const today = romeDate(now)
  if (first >= today) return first
  const step = Math.max(1, Math.round(daysBetween(first, last) / Math.max(1, e.occurrences - 1)))
  const next = addDays(first, Math.ceil(daysBetween(first, today) / step) * step)
  return next > last ? last : next
}

/** Started before today and not over: goes in the "Open now" group. */
export function isLongRunning(e: EventItem, now: number): boolean {
  return localDay(e.start) < romeDate(now) && isOngoingNow(e, now) && !isSparseSeries(e)
}

function fmt(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, ...opts }).format(new Date(iso))
}

const DATE_SHORT: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }

/** "gio 2 ott" -> "Gio 2 ott": only the weekday's first letter is capitalised. */
function capFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
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
  return capFirst(fmt(`${day}T12:00:00Z`, DATE_SHORT))
}

export interface DayGroup {
  key: string // local day, or 'open-now'
  label: string
  events: EventItem[]
}

/** The day an event is listed under: its start, or a series' next date. */
export function listingDay(e: EventItem, now: number): string {
  return isSparseSeries(e) && localDay(e.start) < romeDate(now) ? nextSeriesDay(e, now) : localDay(e.start)
}

/** "gio 2 ott" for a local day key (no Oggi/Domani), for the series hint. */
export function shortDay(day: string): string {
  return fmt(`${day}T12:00:00Z`, DATE_SHORT)
}

/** Groups by listing day (start, or next date for series); order within a day is kept. */
export function groupByDay(events: EventItem[], now: number): DayGroup[] {
  const keyed = events.map((e, i) => ({ e, i, day: listingDay(e, now) }))
  keyed.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.i - b.i))
  const groups: DayGroup[] = []
  for (const { e, day } of keyed) {
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
