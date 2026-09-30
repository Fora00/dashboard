import type { EventItem } from './types'
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

export type DateChip = 'today' | 'tomorrow' | 'weekend'
export const DATE_CHIPS: { id: DateChip; label: string }[] = [
  { id: 'today', label: 'Oggi' },
  { id: 'tomorrow', label: 'Domani' },
  { id: 'weekend', label: 'Weekend' },
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

// --- Remembered selection --------------------------------------------------------

const KEY = 'dashboard:events-filters'

export interface StoredFilters {
  /** null = "not touched": favourites are the default. */
  cats: string[] | null
  areas: string[]
  cities: string[]
  chip: DateChip | null
  showHidden: boolean
}

export const EMPTY_FILTERS: StoredFilters = { cats: null, areas: [], cities: [], chip: null, showHidden: false }

function strings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

/** Never throws: storage may be blocked, or the value malformed. */
export function loadFilters(): StoredFilters {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY_FILTERS
    const v: unknown = JSON.parse(raw)
    if (!v || typeof v !== 'object') return EMPTY_FILTERS
    const o = v as Record<string, unknown>
    return {
      cats: Array.isArray(o.cats) ? strings(o.cats) : null,
      areas: strings(o.areas),
      cities: strings(o.cities),
      chip: DATE_CHIPS.some((c) => c.id === o.chip) ? (o.chip as DateChip) : null,
      showHidden: o.showHidden === true,
    }
  } catch {
    return EMPTY_FILTERS
  }
}

export function saveFilters(f: StoredFilters): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(f))
  } catch {
    // Storage blocked or full: the selection just isn't remembered.
  }
}
