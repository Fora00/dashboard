// Recurring activities: the same title in the same town on several dates is
// ONE proposal ("Serata giochi, every Thursday"), not N evenings. Pure,
// runs after dedup on the final list, so cross-source copies are already one.
import type { Event, EventSeries, SeriesCadence } from './types.ts'
import type { CategoryId, TagId } from './tags.ts'
import { DAY } from './time.ts'
import { normalize, stableId } from './text.ts'

/** Fewer dates than this is a pair of events, not a series. */
export const MIN_SERIES_DATES = 3
/** How many upcoming dates a series lists. */
export const SERIES_NEXT = 4
/** Categories where every date is a performance (a run of a play, a screening), not a standing activity. */
const PERFORMANCES: readonly CategoryId[] = ['cinema', 'theatre', 'concerts']

function dayNumber(iso: string): number {
  return Math.floor(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / DAY)
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  const mid = s.length >> 1
  return s.length % 2 ? (s[mid] as number) : ((s[mid - 1] as number) + (s[mid] as number)) / 2
}

/** Cadence for a typical gap in days; null for daily runs and anything irregular. */
export function cadenceOf(gapDays: number): SeriesCadence | null {
  if (gapDays >= 6 && gapDays <= 8) return 'weekly'
  if (gapDays >= 13 && gapDays <= 15) return 'biweekly'
  if (gapDays >= 26 && gapDays <= 35) return 'monthly'
  return null
}

/** Monday = 0 … Sunday = 6, of a local date. */
function weekdayOf(iso: string): number {
  return (new Date(dayNumber(iso) * DAY).getUTCDay() + 6) % 7
}

function modeOf(xs: number[]): number {
  const n = new Map<number, number>()
  for (const x of xs) n.set(x, (n.get(x) ?? 0) + 1)
  return [...n].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? 0
}

function strip(e: Event): Event {
  const { series: _s, recurring: _r, ...rest } = e
  return { ...rest, tags: rest.tags.filter((t) => t !== 'recurring') }
}

function mark(e: Event, series: EventSeries): Event {
  return { ...e, tags: [...e.tags, 'recurring' as TagId], recurring: true, series }
}

/**
 * Flags recurring events. Separate records sharing a normalised title and
 * city, on 3+ distinct local days with a weekly, fortnightly or monthly
 * rhythm, all get `recurring`, the `recurring` tag and the same `series`
 * (stable id, cadence, weekday, count, next dates). A record the crawler
 * already folded (`occurrences` > 3, one all-day span) is judged by its
 * average gap; its dates are gone, so `next` is empty. Idempotent: a previous
 * run's flags are cleared first (events carried over from an older file).
 */
export function markSeries(events: readonly Event[], now: number): Event[] {
  const clean = events.map(strip)
  const groups = new Map<string, number[]>()
  clean.forEach((e, i) => {
    if (PERFORMANCES.includes(e.category) || e.occurrences > 1) return
    const key = `${normalize(e.title)}|${normalize(e.city)}`
    groups.set(key, [...(groups.get(key) ?? []), i])
  })
  const out = [...clean]
  for (const [key, idx] of groups) {
    const days = [...new Set(idx.map((i) => (clean[i] as Event).start.slice(0, 10)))].sort()
    if (days.length < MIN_SERIES_DATES) continue
    const nums = days.map(dayNumber)
    const gaps = nums.slice(1).map((n, i) => n - (nums[i] as number))
    const cadence = cadenceOf(median(gaps))
    if (!cadence) continue
    const next = idx
      .map((i) => clean[i] as Event)
      .filter((e) => Date.parse(e.start) >= now)
      .map((e) => e.start)
      .sort()
    const series: EventSeries = {
      id: stableId('series', key),
      cadence,
      weekday: modeOf(days.map(weekdayOf)),
      count: days.length,
      next: [...new Set(next)].slice(0, SERIES_NEXT),
    }
    for (const i of idx) out[i] = mark(clean[i] as Event, series)
  }
  clean.forEach((e, i) => {
    if (PERFORMANCES.includes(e.category) || e.occurrences < MIN_SERIES_DATES || !e.allDay) return
    const span = dayNumber((e.end ?? e.start).slice(0, 10)) - dayNumber(e.start.slice(0, 10))
    const cadence = cadenceOf(span / (e.occurrences - 1))
    if (!cadence) return
    out[i] = mark(e, {
      id: stableId('series', `${normalize(e.title)}|${normalize(e.city)}`),
      cadence,
      weekday: null,
      count: e.occurrences,
      next: [],
    })
  })
  return out
}
