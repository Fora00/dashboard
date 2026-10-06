// Fills in missing event images from the event page's `og:image`.
//
// OpenPA sites (Verona, Pergine, Riva, Arco, Mori, Ala, Rovereto, Trentogiovani,
// Trentino Cultura) return an event's image only as a relation (an object id),
// and their robots.txt forbids the endpoints that would resolve it. The public
// event page, which robots allows, carries the image as <meta og:image>.
//
// One request per event, so it is bounded: a per-run request cap and time
// budget, soonest events first, images carried over from the previous
// events.json (never re-fetched) and pages with no usable image remembered in
// `ogMisses` for a week. A full backlog is therefore worked off over a few
// daily runs. The image is hot-linked, never re-hosted.
import type { AdapterContext, Event } from './types.ts'
import { absUrl, decodeEntities } from './text.ts'

/** Sources whose pages carry a real per-event og:image. */
export const OG_SOURCES = new Set([
  'verona',
  'pergine',
  'riva-del-garda',
  'arco',
  'mori',
  'ala',
  'rovereto-comune',
  'trentogiovani',
  'cultura-trentino',
])

export const OG_MAX_REQUESTS = 150
export const OG_MAX_MS = 8 * 60_000
const MISS_TTL_MS = 7 * 86_400_000

/** Site-wide placeholders and logos the CMSs use when an event has no picture. */
const GENERIC = /logo|sfondo|placeholder|default|no[-_]?image|nophoto|favicon|social/i

/** The og:image URL of an HTML page (absolute https), or null when missing or generic. */
export function extractOgImage(html: string, pageUrl: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  for (const tag of tags) {
    if (!/\b(?:property|name)\s*=\s*["']og:image(?::url)?["']/i.test(tag)) continue
    const content = /\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i.exec(tag)
    const value = decodeEntities(content?.[1] ?? content?.[2] ?? '').trim()
    const url = absUrl(value, pageUrl)
    if (url && !GENERIC.test(url)) return url
  }
  return null
}

export interface OgResult {
  /** Images found this run, plus those carried over. */
  filled: number
  fetched: number
  misses: Record<string, number>
}

/**
 * Mutates `events` (the final, sorted list). `previous` supplies images found
 * on earlier runs and the miss list. Never throws: a page that fails is a miss.
 */
export async function enrichImages(
  events: Event[],
  previous: { events: Event[]; ogMisses?: Record<string, number> } | null,
  ctx: AdapterContext,
  now: number,
  limits: { maxMs?: number } = {},
): Promise<OgResult> {
  const prevImage = new Map<string, string>()
  for (const e of previous?.events ?? []) if (e?.image && OG_SOURCES.has(e.source)) prevImage.set(e.id, e.image)
  const misses: Record<string, number> = {}
  for (const [id, at] of Object.entries(previous?.ogMisses ?? {})) if (now - at < MISS_TTL_MS) misses[id] = at

  const live = new Set(events.map((e) => e.id))
  let filled = 0
  let fetched = 0
  const started = Date.now()
  const maxMs = limits.maxMs ?? OG_MAX_MS
  // Carry over what earlier runs found, then queue the rest per source (soonest
  // first) and take them round-robin, so a slow host (Trentino Cultura asks for
  // a 10 s delay) cannot use up the whole budget before the others get a turn.
  const queues = new Map<string, Event[]>()
  for (const e of events) {
    if (e.image || !OG_SOURCES.has(e.source)) continue
    const known = prevImage.get(e.id)
    if (known) {
      e.image = known
      filled++
    } else if (misses[e.id] === undefined && e.url) {
      queues.set(e.source, [...(queues.get(e.source) ?? []), e])
    }
  }
  const order: Event[] = []
  for (let i = 0; [...queues.values()].some((q) => i < q.length); i++) {
    for (const q of queues.values()) if (i < q.length) order.push(q[i] as Event)
  }
  for (const e of order) {
    if (fetched >= OG_MAX_REQUESTS || Date.now() - started > maxMs) break
    fetched++
    try {
      const page = await ctx.fetchText(e.url)
      const image = extractOgImage(page.text, page.url)
      if (image) {
        e.image = image
        filled++
      } else {
        misses[e.id] = now
      }
    } catch (err) {
      // Request cap reached: stop quietly; any other failure is a (retried-in-a-week) miss.
      if (/request cap/.test((err as Error).message)) break
      misses[e.id] = now
    }
  }
  // Forget misses of events that left the file.
  for (const id of Object.keys(misses)) if (!live.has(id)) delete misses[id]
  return { filled, fetched, misses }
}
