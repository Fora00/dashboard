import type { EventItem } from './types'
import { cleanFormats } from './format'
import { readJSON, writeJSON } from '../../lib/safeStorage'
import { listingDay, localDay, romeDate, isSparseSeries } from './model'

// Pure helpers for the events quick filters (date chips, text search) and the
// per-device memory of the last selection. No React.

// --- Text search -----------------------------------------------------------------

/** Lowercase, accent-free, trimmed: "Caffè " -> "caffe". */
export function normalizeText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

const HAYSTACK = new WeakMap<EventItem, string>()

function haystack(e: EventItem): string {
  let h = HAYSTACK.get(e)
  if (h === undefined) {
    h = normalizeText([e.title, e.venue, e.city, e.summary].filter(Boolean).join(' \n '))
    HAYSTACK.set(e, h)
  }
  return h
}

/** Every word of the (already normalised) query must appear in title/venue/city/summary. */
export function matchesQuery(e: EventItem, query: string): boolean {
  if (!query) return true
  const h = haystack(e)
  return query.split(/\s+/).every((w) => h.includes(w))
}

// --- Date chips ------------------------------------------------------------------

export type DateChip = 'today' | 'tomorrow' | 'weekend' | 'ending'
/** "In scadenza": a multi-day event already running whose last day is within this many days. */
export const ENDING_DAYS = 10
export const DATE_CHIPS: { id: DateChip; label: string }[] = [
  { id: 'today', label: 'Oggi' },
  { id: 'tomorrow', label: 'Domani' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'ending', label: 'In scadenza' },
]

function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Inclusive local-day range [from, to] of a chip. Weekend = Sat+Sun, or what is left of it. */
export function chipRange(chip: DateChip, now: number): [string, string] {
  const today = romeDate(now)
  if (chip === 'today') return [today, today]
  if (chip === 'tomorrow') {
    const t = addDays(today, 1)
    return [t, t]
  }
  if (chip === 'ending') return [today, addDays(today, ENDING_DAYS)]
  const dow = new Date(`${today}T12:00:00Z`).getUTCDay() // 0 = Sun
  if (dow === 0) return [today, today]
  if (dow === 6) return [today, addDays(today, 1)]
  return [addDays(today, 6 - dow), addDays(today, 7 - dow)]
}

/**
 * An event matches when it covers any day of the range. A sparse series
 * (weekly game night over months) would match everything, so it is judged
 * by its listing day (its next date) instead.
 */
export function matchesRange(e: EventItem, [from, to]: [string, string], now: number): boolean {
  if (isSparseSeries(e)) {
    const d = listingDay(e, now)
    return d >= from && d <= to
  }
  const last = localDay(e.end ?? e.start)
  return localDay(e.start) <= to && last >= from
}

/**
 * Days left (0 = last day is today) for a multi-day event that is already
 * running and ends within ENDING_DAYS; null otherwise. Single-day events and
 * sparse series (whose end is just the end of the run) are never "ending".
 */
export function endingInDays(e: EventItem, now: number): number | null {
  if (!e.end || isSparseSeries(e)) return null
  const [today, limit] = chipRange('ending', now)
  const first = localDay(e.start)
  const last = localDay(e.end)
  if (!(first < last && first <= today && last >= today && last <= limit)) return null
  return Math.round((Date.parse(`${last}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86400000)
}

/** Does the event belong under this chip? Day chips use the range; "ending" is its own rule. */
export function matchesChip(e: EventItem, chip: DateChip, now: number): boolean {
  if (chip !== 'ending') return matchesRange(e, chipRange(chip, now), now)
  return endingInDays(e, now) !== null
}

// --- Remembered selection --------------------------------------------------------

const KEY = 'dashboard:events-filters'

export interface StoredFilters {
  /** null = "not touched": favourites are the default. */
  cats: string[] | null
  areas: string[]
  cities: string[]
  chip: DateChip | null
  /** "Come" tags (format.ts); missing in older stored values = none. */
  formats: string[]
  showHidden: boolean
}

export const EMPTY_FILTERS: StoredFilters = { cats: null, areas: [], cities: [], chip: null, formats: [], showHidden: false }

function strings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

function sanitizeFilters(v: unknown): StoredFilters {
  if (!v || typeof v !== 'object') return EMPTY_FILTERS
  const o = v as Record<string, unknown>
  return {
    cats: Array.isArray(o.cats) ? strings(o.cats) : null,
    areas: strings(o.areas),
    cities: strings(o.cities),
    chip: DATE_CHIPS.some((c) => c.id === o.chip) ? (o.chip as DateChip) : null,
    formats: cleanFormats(strings(o.formats)),
    showHidden: o.showHidden === true,
  }
}

/** Never throws: storage may be blocked, or the value malformed. */
export function loadFilters(): StoredFilters {
  return readJSON(KEY, sanitizeFilters, EMPTY_FILTERS)
}

export function saveFilters(f: StoredFilters): void {
  writeJSON(KEY, f)
}
