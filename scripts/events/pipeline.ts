// Pure post-processing shared by fresh and carried-over events: window,
// series folding, ids/tags, cross-source dedup, `ongoing`, sorting.
import type { Adapter, Event, RawEvent } from './types.ts'
import type { DropRule, TagId } from './tags.ts'
import { CATEGORIES, classify, dropRule, finishTags } from './tags.ts'
import { areaFor, closerRing, keepForRing } from './areas.ts'
import { DAY, addDays, dateToIso } from './time.ts'
import { clip, htmlToBlocks, normalize, snippet, stableId } from './text.ts'

/** How far ahead events are kept (owner: nothing beyond 3 months, 2026-10-03), unless the adapter says otherwise. */
export const HORIZON_DAYS = 90
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

export function inWindow(e: Pick<Event, 'start' | 'end' | 'allDay'>, now: number, horizonDays = HORIZON_DAYS): boolean {
  return effectiveEnd(e) >= now - GRACE_MS && Date.parse(e.start) <= now + horizonDays * DAY
}

export function isOngoing(e: Pick<Event, 'start' | 'end' | 'allDay'>, now: number): boolean {
  return Date.parse(e.start) <= now && effectiveEnd(e) > now
}

/** Fold series with more than MAX_OCCURRENCES dates into one all-day span. */
function foldSeries(raws: RawEvent[]): (RawEvent & { occurrences: number })[] {
  const groups = new Map<string, RawEvent[]>()
  const out: (RawEvent & { occurrences: number })[] = []
  for (const r of raws) {
    if (!r.seriesKey) { out.push({ ...r, occurrences: r.occurrences ?? 1 }); continue }
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

/** Events dropped by DROP RULES (tags.ts), per rule: logged in the crawl summary. */
export type DropCounts = Map<DropRule, number>

function countDrop(drops: DropCounts | undefined, rule: DropRule): void {
  drops?.set(rule, (drops.get(rule) ?? 0) + 1)
}

/** A folded series with at least this many dates may take the adapter's `longSeriesCategory`. */
export const LONG_SERIES = 10

/**
 * Adapter output → published events (window applied, ids and tags derived,
 * DROP RULES applied and counted in `drops`).
 */
export function toEvents(adapter: Adapter, raws: RawEvent[], now: number, fetchedAt: string, drops?: DropCounts): Event[] {
  const seen = new Set<string>()
  const events: Event[] = []
  const ring = adapter.ring ?? 'home'
  // Some sources publish an end before the start (seen on bibcom and mart):
  // drop that end rather than emit a backwards range.
  const sane = raws.map((r) => (r.end && Date.parse(r.end) < Date.parse(r.start) ? { ...r, end: null } : r))
  for (const r of foldSeries(sane.filter((r) => r.title && inWindow(r, now, adapter.horizonDays)))) {
    const id = stableId(adapter.id, r.nativeId)
    if (seen.has(id)) continue
    seen.add(id)
    const description = clip(htmlToBlocks(r.description))
    const summary = snippet(htmlToBlocks(r.summary || description).replace(/\s+/g, ' '))
    const text = { title: r.title, summary, description, tagText: r.tagText ?? null }
    let { category, tags } = classify(r.categoryHint, adapter.defaultCategory, text)
    const dropped = dropRule(text, category)
    if (dropped) { countDrop(drops, dropped); continue }
    // A long series nothing else classified (Open Data Hub: exhibitions sold
    // as daily tickets) takes the adapter's fallback.
    if (category === 'other' && adapter.longSeriesCategory && r.occurrences >= LONG_SERIES) {
      category = adapter.longSeriesCategory
      tags = finishTags(category, tags, tags.includes('kids'))
    }
    // Ring 2 sources: interests only (NEAR_INTERESTS), never kids.
    if (!keepForRing(ring, tags)) continue
    const city = r.city.trim() || 'Trentino'
    events.push({
      id,
      title: r.title.replace(/\s+/g, ' ').trim(),
      start: r.start,
      end: r.end,
      allDay: r.allDay,
      ongoing: isOngoing(r, now),
      venue: r.venue?.replace(/\s+/g, ' ').trim() || null,
      city,
      area: areaFor(city, adapter.area ?? 'trentino'),
      ring,
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

/**
 * Of two titles that normalise alike, the one in natural case: it has
 * lowercase letters and fewer capitals ("Il segreto di Francesco" over
 * "Il Segreto di Francesco" over "IL SEGRETO DI FRANCESCO"). Ties keep `a`.
 */
function naturalTitle(a: string, b: string): string {
  const score = (t: string) => (/\p{Ll}/u.test(t) ? (t.match(/\p{Lu}/gu)?.length ?? 0) : Infinity)
  return score(b) < score(a) ? b : a
}

/**
 * Events carried over from an older events.json (before `area`/`ring`
 * existed) get them from their adapter; a `near` source's old events are
 * re-filtered by its interests and every carried event by DROP RULES.
 */
export function withPlace(adapter: Adapter, events: Event[], drops?: DropCounts): Event[] {
  const ring = adapter.ring ?? 'home'
  return events
    .filter((e) => keepForRing(ring, e.tags ?? []))
    .filter((e) => {
      // Records from before a drop rule existed are dropped the same way.
      const rule = dropRule({ title: e.title ?? '', summary: e.summary }, e.category)
      if (rule) countDrop(drops, rule)
      return !rule
    })
    .map((e) => ({ ...e, area: e.area ?? areaFor(e.city ?? '', adapter.area ?? 'trentino'), ring: e.ring ?? ring }))
}

/** Same normalised title + local start date + city = same event; keep the richer record. */
/** Two records of one event → the richer one, its gaps filled from the other. */
function merge(a: Event, b: Event): Event {
  const [keep, drop] = richness(b) > richness(a) ? [b, a] : [a, b]
  const kids = keep.tags.includes('kids') || drop.tags.includes('kids')
  const merged: TagId[] = [...keep.tags, ...drop.tags].filter((t) => t !== 'kids' && t !== 'other' && !(kids && t === 'creative'))
  let category = keep.category === 'other' ? drop.category : keep.category
  if (kids && category === 'creative') category = CATEGORIES.find((c) => merged.includes(c.id))?.id ?? 'other'
  return {
    ...keep,
    title: normalize(keep.title) === normalize(drop.title) ? naturalTitle(keep.title, drop.title) : keep.title,
    // Fill what the kept record lacks from the duplicate.
    end: keep.end ?? (keep.allDay === drop.allDay ? drop.end : null),
    venue: keep.venue ?? drop.venue,
    image: keep.image ?? drop.image,
    description: keep.description || drop.description,
    summary: keep.summary || drop.summary,
    category,
    tags: finishTags(category, merged, kids),
    sources: [...new Set([...keep.sources, ...drop.sources])].sort(),
    ring: closerRing(keep.ring, drop.ring),
  }
}

/**
 * Second, narrow pass: timed events at the SAME instant in the same city,
 * from different sources, where one normalised title (3+ words) is a word
 * prefix of the other — "Il segreto di Francesco" (Trentino Cultura) and
 * "Il segreto di Francesco. Lo spirito del Santo di Assisi, oggi" (Rovereto).
 */
function mergeSubtitled(events: Event[]): Event[] {
  const groups = new Map<string, Event[]>()
  const out: Event[] = []
  for (const e of events) {
    if (e.allDay) { out.push(e); continue }
    const key = `${Date.parse(e.start)}|${normalize(e.city)}`
    groups.set(key, [...(groups.get(key) ?? []), e])
  }
  for (const group of groups.values()) {
    // Shortest title first, so each longer one folds into its prefix.
    const rest = group.sort((a, b) => normalize(a.title).length - normalize(b.title).length)
    const kept: Event[] = []
    for (const e of rest) {
      const t = normalize(e.title)
      const i = kept.findIndex((k) => {
        const p = normalize(k.title)
        return p.split(' ').length >= 3 && t.startsWith(`${p} `) && !k.sources.some((s) => e.sources.includes(s))
      })
      if (i < 0) kept.push(e)
      else kept[i] = merge(kept[i] as Event, e)
    }
    out.push(...kept)
  }
  return out
}

export function dedup(events: Event[]): Event[] {
  const byKey = new Map<string, Event>()
  for (const e of events) {
    const key = dedupKey(e)
    const prev = byKey.get(key)
    byKey.set(key, prev ? merge(prev, e) : e)
  }
  return mergeSubtitled([...byKey.values()])
}

export function sortEvents(events: Event[]): Event[] {
  return events.sort((a, b) =>
    Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title, 'it') || a.id.localeCompare(b.id),
  )
}
