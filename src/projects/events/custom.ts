import type { CustomEvent } from '../../lib/db'
import type { EventItem } from './types'
import { CATEGORIES, TZ, safeHttpUrl } from './model'
import { normalizeText } from './filters'

// Pure helpers for the owner's hand-added events ("Manual events" in
// docs/EVENTS.md): form <-> row, Rome-local ISO building, the hash-query
// prefill and the merge into the events.json list. No React, no Dexie.

// --- Caps (mirrored by CHECK constraints in the custom_events migration) ----
// The client is always the stricter side (UTF-16 units vs code points).
export const MAX_TITLE_LENGTH = 300
export const MAX_VENUE_LENGTH = 300
export const MAX_CITY_LENGTH = 100
export const MAX_URL_LENGTH = 2000
export const MAX_NOTE_LENGTH = 2000
/** Whole data URL, in characters: ~150 KB of JPEG is ~205,000 base64 chars. */
export const MAX_IMAGE_LENGTH = 210_000
export const DEFAULT_CITY = 'Trento'
export const MANUAL_SOURCE = 'manual'

/** What the add/edit sheet edits. Every field is a plain string (input values). */
export interface CustomEventForm {
  title: string
  /** 'YYYY-MM-DD' (local Rome day). */
  date: string
  /** 'YYYY-MM-DD' or '' (single day). */
  endDate: string
  /** 'HH:MM' or '' (all day). */
  time: string
  /** 'HH:MM' or ''; only used with a start time. */
  endTime: string
  venue: string
  city: string
  url: string
  category: string
  note: string
  /** JPEG data URL or null. */
  image: string | null
}

export function emptyForm(): CustomEventForm {
  return {
    title: '',
    date: '',
    endDate: '',
    time: '',
    endTime: '',
    venue: '',
    city: DEFAULT_CITY,
    url: '',
    category: 'other',
    note: '',
    image: null,
  }
}

// --- Dates -------------------------------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

/** A real calendar day 'YYYY-MM-DD' (rejects 2026-02-30). */
export function isValidDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false
  const d = new Date(`${s}T12:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

export function isValidTime(s: string): boolean {
  return TIME_RE.test(s)
}

const offsetFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })

/** Rome's UTC offset in minutes at an instant ("GMT+02:00" -> 120). */
function offsetAt(ms: number): number {
  const name = offsetFmt.formatToParts(new Date(ms)).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT'
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(name)
  if (!m) return 0
  const mins = Number(m[2]) * 60 + Number(m[3])
  return m[1] === '-' ? -mins : mins
}

function fmtOffset(mins: number): string {
  const sign = mins < 0 ? '-' : '+'
  const a = Math.abs(mins)
  return `${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`
}

/**
 * ISO 8601 for a Rome wall-clock time, with the offset valid on that date,
 * like events.json: `2026-10-04T20:30:00+02:00`. The rare wall times that
 * are ambiguous or skipped at a DST switch (02:00–03:00 on two nights a year)
 * still get one of the two real offsets, so Date.parse stays sane.
 */
export function romeIso(date: string, time = '00:00'): string {
  const wall = Date.parse(`${date}T${time}:00Z`)
  // Two passes: the offset at the guessed instant, then at the corrected one.
  let off = offsetAt(wall - 60 * 60000)
  off = offsetAt(wall - off * 60000)
  return `${date}T${time}:00${fmtOffset(off)}`
}

// --- Form <-> row --------------------------------------------------------------

/** Trim, collapse runs of spaces/tabs (keeps newlines), cap. */
function clean(s: string, max: number): string {
  return s
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max)
}

/** http(s) URL, a scheme added when missing; '' when empty or unusable. */
export function normalizeEventUrl(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`
  const url = safeHttpUrl(withScheme)
  return url && url.length <= MAX_URL_LENGTH ? url : ''
}

export function isKnownCategory(id: string): boolean {
  return CATEGORIES.some((c) => c.id === id)
}

/** Only JPEG/PNG/WebP base64 data URLs within the cap are kept. */
export function isSafeImageDataUrl(s: unknown): s is string {
  return (
    typeof s === 'string' &&
    s.length <= MAX_IMAGE_LENGTH &&
    /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(s)
  )
}

export type FormResult = { ok: true; row: CustomEvent } | { ok: false; error: string }

/**
 * Validate the form and build the row. `existing` keeps id/createdAt on edit.
 * Times are Rome-local:
 *   no time  -> all day: start = first day 00:00, end = last day 00:00 (inclusive) or null
 *   time     -> start at that time; end = (endDate || date) at endTime, or
 *               end of the end day (23:59) when only an end date is given.
 */
export function formToRow(
  f: CustomEventForm,
  now: number,
  existing?: Pick<CustomEvent, 'id' | 'createdAt'>,
  newId: () => string = () => crypto.randomUUID(),
): FormResult {
  const title = clean(f.title, MAX_TITLE_LENGTH)
  if (!title) return { ok: false, error: 'Add a title.' }
  if (!isValidDate(f.date)) return { ok: false, error: 'Pick a date.' }
  const endDate = f.endDate && f.endDate !== f.date ? f.endDate : ''
  if (endDate && !isValidDate(endDate)) return { ok: false, error: 'The end date is not valid.' }
  if (endDate && endDate < f.date) return { ok: false, error: 'The end date is before the start.' }
  const time = f.time.trim()
  if (time && !isValidTime(time)) return { ok: false, error: 'The time is not valid.' }
  const endTime = time ? f.endTime.trim() : ''
  if (endTime && !isValidTime(endTime)) return { ok: false, error: 'The end time is not valid.' }

  const allDay = !time
  const start = romeIso(f.date, allDay ? '00:00' : time)
  let end: string | null = null
  if (allDay) {
    if (endDate) end = romeIso(endDate)
  } else if (endTime) {
    end = romeIso(endDate || f.date, endTime)
  } else if (endDate) {
    end = romeIso(endDate, '23:59')
  }
  if (end && Date.parse(end) < Date.parse(start)) {
    return { ok: false, error: 'The end is before the start.' }
  }

  const rawImage = f.image
  if (rawImage !== null && !isSafeImageDataUrl(rawImage)) {
    return { ok: false, error: 'The image is too large or not a JPEG/PNG.' }
  }

  return {
    ok: true,
    row: {
      id: existing?.id ?? newId(),
      title,
      start,
      end,
      allDay,
      venue: clean(f.venue, MAX_VENUE_LENGTH) || null,
      city: clean(f.city, MAX_CITY_LENGTH) || DEFAULT_CITY,
      url: normalizeEventUrl(f.url),
      note: f.note.trim().slice(0, MAX_NOTE_LENGTH),
      category: isKnownCategory(f.category) ? f.category : 'other',
      image: rawImage,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    },
  }
}

/** The edit form for an existing row (inverse of formToRow). */
export function rowToForm(r: CustomEvent): CustomEventForm {
  const date = r.start.slice(0, 10)
  const endDay = r.end ? r.end.slice(0, 10) : ''
  return {
    title: r.title,
    date,
    endDate: endDay && endDay !== date ? endDay : '',
    time: r.allDay ? '' : r.start.slice(11, 16),
    endTime: !r.allDay && r.end ? r.end.slice(11, 16) : '',
    venue: r.venue ?? '',
    city: r.city,
    url: r.url,
    category: r.category,
    note: r.note,
    image: r.image,
  }
}

// --- Into the events list ------------------------------------------------------

/**
 * Towns -> area for hand-added events. A small client mirror of the town map
 * in scripts/events/areas.ts (only the towns the owner is likely to type);
 * unknown towns fall back to Trentino, like areaOf() in model.ts.
 */
const TOWN_AREA: Record<string, string> = {}
const TOWNS: Record<string, string[]> = {
  'alto-adige': [
    'Bolzano',
    'Bozen',
    'Merano',
    'Meran',
    'Bressanone',
    'Brixen',
    'Brunico',
    'Bruneck',
    'Laives',
    'Lana',
    'Vipiteno',
    'Chiusa',
    'Egna',
    'Appiano',
    'Caldaro',
  ],
  'verona-garda': [
    'Verona',
    'Malcesine',
    'Bardolino',
    'Lazise',
    'Garda',
    'Peschiera del Garda',
    'Torri del Benaco',
    'Bussolengo',
    'Villafranca di Verona',
  ],
  veneto: [
    'Vicenza',
    'Padova',
    'Bassano del Grappa',
    'Venezia',
    'Treviso',
    'Belluno',
    'Rovigo',
    'Schio',
    'Thiene',
    'Asiago',
  ],
  lombardia: [
    'Brescia',
    'Mantova',
    'Milano',
    'Bergamo',
    'Cremona',
    'Sirmione',
    'Desenzano del Garda',
    'Salò',
    'Limone sul Garda',
    'Monza',
  ],
  'emilia-romagna': ['Bologna', 'Modena', 'Parma', 'Reggio Emilia', 'Ferrara', 'Rimini', 'Ravenna'],
  piemonte: ['Torino'],
  toscana: ['Lucca', 'Firenze', 'Pisa'],
  abroad: ['Essen', 'Innsbruck', 'München', 'Munich', 'Wien', 'Vienna'],
}
for (const [area, towns] of Object.entries(TOWNS)) {
  for (const t of towns) TOWN_AREA[normalizeText(t)] = area
}

export function cityArea(city: string): string {
  return TOWN_AREA[normalizeText(city)] ?? 'trentino'
}

/** First line of the note, at most ~300 chars (the card's one-line summary). */
function summaryOf(note: string): string {
  const first =
    note
      .split('\n')
      .find((l) => l.trim())
      ?.trim() ?? ''
  return first.length <= 300 ? first : `${first.slice(0, 299).trimEnd()}…`
}

export function isManual(e: Pick<EventItem, 'source'>): boolean {
  return e.source === MANUAL_SOURCE
}

/** A hand-added event as an events.json record (source 'manual', ring home). */
export function customToEventItem(r: CustomEvent): EventItem {
  const category = isKnownCategory(r.category) ? r.category : 'other'
  return {
    id: r.id,
    title: r.title,
    start: r.start,
    end: r.end,
    allDay: r.allDay,
    ongoing: false,
    venue: r.venue,
    city: r.city,
    area: cityArea(r.city),
    ring: 'home',
    url: r.url,
    source: MANUAL_SOURCE,
    sources: [MANUAL_SOURCE],
    category,
    tags: [category],
    description: r.note,
    summary: summaryOf(r.note),
    image: isSafeImageDataUrl(r.image) ? r.image : null,
    occurrences: 1,
    fetchedAt: new Date(r.updatedAt).toISOString(),
  }
}

/**
 * The page's list: events.json minus the kids rule, plus every hand-added
 * event (never dropped by the kids rule). An id clash (impossible in practice:
 * crawler ids are 16 hex chars, ours are uuids) keeps the hand-added one.
 */
export function mergeEvents(
  fileEvents: readonly EventItem[],
  custom: readonly CustomEvent[],
  isKids: (e: EventItem) => boolean,
): EventItem[] {
  const mine = custom.map(customToEventItem)
  const ids = new Set(mine.map((e) => e.id))
  return [...fileEvents.filter((e) => !isKids(e) && !ids.has(e.id)), ...mine]
}

// --- Hash-query prefill (#/events?add=1&url=…&title=…) -------------------------

/** Query keys the prefill reads; they are stripped from the URL after use. */
export const PREFILL_KEYS = [
  'add',
  'title',
  'url',
  'date',
  'time',
  'venue',
  'city',
  'note',
  'text',
  'category',
] as const

/**
 * Parse an "add event" deep link (e.g. from an iOS Shortcut). Returns null
 * unless `add=1`. Every value is validated and capped; anything unusable is
 * dropped, never trusted. `text` is an alias of `note` (what a share sheet sends).
 */
export function parsePrefill(params: URLSearchParams): Partial<CustomEventForm> | null {
  if (params.get('add') !== '1') return null
  const out: Partial<CustomEventForm> = {}
  const get = (k: string) => (params.get(k) ?? '').trim()

  const title = clean(get('title'), MAX_TITLE_LENGTH)
  if (title) out.title = title
  let url = normalizeEventUrl(get('url'))
  const note = (get('note') || get('text')).slice(0, MAX_NOTE_LENGTH)
  // A share sheet often sends the link inside the text only.
  if (!url && note) {
    const m = /https?:\/\/\S+/.exec(note)
    if (m) url = normalizeEventUrl(m[0])
  }
  if (url) out.url = url
  if (note) out.note = note
  const date = get('date')
  if (isValidDate(date)) out.date = date
  const time = get('time')
  if (isValidTime(time)) out.time = time
  const venue = clean(get('venue'), MAX_VENUE_LENGTH)
  if (venue) out.venue = venue
  const city = clean(get('city'), MAX_CITY_LENGTH)
  if (city) out.city = city
  const category = get('category')
  if (isKnownCategory(category)) out.category = category
  return out
}

// --- Image sizing --------------------------------------------------------------

/** Scale (w, h) down so the long side is at most `max`; never upscales. */
export function fitWithin(w: number, h: number, max: number): { width: number; height: number } {
  const long = Math.max(w, h)
  if (long <= max || long <= 0) return { width: Math.round(w), height: Math.round(h) }
  const k = max / long
  return { width: Math.max(1, Math.round(w * k)), height: Math.max(1, Math.round(h * k)) }
}

/** Hand-added events are deleted this many days after their last day. */
export const PRUNE_AFTER_DAYS = 14

/**
 * Has the event's last day (end, else start; the Rome date in the ISO string)
 * been over for more than PRUNE_AFTER_DAYS? Compared as calendar dates in
 * local time, so a few hours of timezone drift never matters at 14 days.
 */
export function isExpiredCustomEvent(r: Pick<CustomEvent, 'start' | 'end'>, now: number): boolean {
  const last = (r.end ?? r.start).slice(0, 10)
  const cut = new Date(now)
  cut.setDate(cut.getDate() - PRUNE_AFTER_DAYS)
  const cutoff = `${cut.getFullYear()}-${String(cut.getMonth() + 1).padStart(2, '0')}-${String(cut.getDate()).padStart(2, '0')}`
  return isValidDate(last) && last < cutoff
}
