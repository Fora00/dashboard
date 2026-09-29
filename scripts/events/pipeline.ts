// Pure post-processing shared by fresh and carried-over events: window,
// series folding, ids/tags, cross-source dedup, `ongoing`, sorting.
import type { Adapter, Event, RawEvent } from './types.ts'
import { classify, sortTags } from './tags.ts'
import { DAY, addDays, dateToIso } from './time.ts'
import { clip, htmlToBlocks, normalize, snippet, stableId } from './text.ts'

export const HORIZON_DAYS = 180
const GRACE_MS = DAY
/** A series with more dates than this inside the window becomes one span record. */
export const MAX_OCCURRENCES = 8

/**
 * Instant after which the event is over: allDay → midnight after the last
 * day; timed → end, or start when there is no end.
 */
export function effectiveEnd(e: Pick<Event, 'start' | 'end' | 'allDay'>): number {
  if (e.allDay) return Date.parse(dateToIso(addDays((e.end ?? e.start).slice(0, 10), 1)))
  return Date.parse(e.end ?? e.start)
}

export function inWindow(e: Pick<Event, 'start' | 'end' | 'allDay'>, now: number): boolean {
  return effectiveEnd(e) >= now - GRACE_MS && Date.parse(e.start) <= now + HORIZON_DAYS * DAY
}

export function isOngoing(e: Pick<Event, 'start' | 'end' | 'allDay'>, now: number): boolean {
  return Date.parse(e.start) <= now && effectiveEnd(e) > now
}

/** Fold series with more than MAX_OCCURRENCES dates into one all-day span. */
function foldSeries(raws: RawEvent[]): (RawEvent & { occurrences: number })[] {
  const groups = new Map<string, RawEvent[]>()
  const out: (RawEvent & { occurrences: number })[] = []
  for (const r of raws) {
    if (!r.seriesKey) { out.push({ ...r, occurrences: 1 }); continue }
    const g = groups.get(r.seriesKey)
    if (g) g.push(r)
    else groups.set(r.seriesKey, [r])
  }
  for (const [key, g] of groups) {
    if (g.length <= MAX_OCCURRENCES) { for (const r of g) out.push({ ...r, occurrences: 1 }); continue }
    g.sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
    const first = g[0] as RawEvent
    const lastDay = g.reduce((max, r) => {
      const d = (r.end ?? r.start).slice(0, 10)
      return d > max ? d : max
    }, first.start.slice(0, 10))
    out.push({
      ...first,
      nativeId: `series:${key}`,
      start: dateToIso(first.start.slice(0, 10)),
      end: dateToIso(lastDay),
      allDay: true,
      occurrences: g.length,
    })
  }
  return out
}

/** Adapter output → published events (window applied, ids and tags derived). */
export function toEvents(adapter: Adapter, raws: RawEvent[], now: number, fetchedAt: string): Event[] {
  const seen = new Set<string>()
  const events: Event[] = []
  // Some sources publish an end before the start (seen on bibcom and mart):
  // drop that end rather than emit a backwards range.
  const sane = raws.map((r) => (r.end && Date.parse(r.end) < Date.parse(r.start) ? { ...r, end: null } : r))
  for (const r of foldSeries(sane.filter((r) => r.title && inWindow(r, now)))) {
    const id = stableId(adapter.id, r.nativeId)
    if (seen.has(id)) continue
    seen.add(id)
    const description = clip(htmlToBlocks(r.description))
    const summary = snippet(htmlToBlocks(r.summary || description).replace(/\s+/g, ' '))
    const { category, tags } = classify(r.categoryHint, adapter.defaultCategory, [r.title, summary, description, r.tagText])
    events.push({
      id,
      title: r.title.replace(/\s+/g, ' ').trim(),
      start: r.start,
      end: r.end,
      allDay: r.allDay,
      ongoing: isOngoing(r, now),
      venue: r.venue?.replace(/\s+/g, ' ').trim() || null,
      city: r.city.trim() || 'Trentino',
      url: r.url,
      source: adapter.id,
      sources: [adapter.id],
      category,
      tags,
      description,
      summary,
      image: r.image ?? null,
      occurrences: r.occurrences,
      fetchedAt,
    })
  }
  return events
}

function dedupKey(e: Event): string {
  return `${normalize(e.title)}|${e.start.slice(0, 10)}|${normalize(e.city)}`
}

function richness(e: Event): number {
  return (e.end ? 1 : 0) + (e.venue ? 1 : 0) + (e.image ? 1 : 0) + (e.allDay ? 0 : 1) + Math.min(e.description.length, 600) / 200
}

/** Same normalised title + local start date + city = same event; keep the richer record. */
export function dedup(events: Event[]): Event[] {
  const byKey = new Map<string, Event>()
  for (const e of events) {
    const key = dedupKey(e)
    const prev = byKey.get(key)
    if (!prev) { byKey.set(key, e); continue }
    const [keep, drop] = richness(e) > richness(prev) ? [e, prev] : [prev, e]
    const category = keep.category === 'other' ? drop.category : keep.category
    byKey.set(key, {
      ...keep,
      // Fill what the kept record lacks from the duplicate.
      end: keep.end ?? (keep.allDay === drop.allDay ? drop.end : null),
      venue: keep.venue ?? drop.venue,
      image: keep.image ?? drop.image,
      description: keep.description || drop.description,
      summary: keep.summary || drop.summary,
      category,
      tags: sortTags([category, ...keep.tags, ...drop.tags].filter((t) => t !== 'other' || category === 'other')),
      sources: [...new Set([...keep.sources, ...drop.sources])].sort(),
    })
  }
  return [...byKey.values()]
}

export function sortEvents(events: Event[]): Event[] {
  return events.sort((a, b) =>
    Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title, 'it') || a.id.localeCompare(b.id),
  )
}
