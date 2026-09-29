// Ludimus (board-game association, Trentino). Static site, robots.txt allows
// everything. The listing https://ludimus.it/events.html links every upcoming
// event as /events/YYYY-MM-DD-<slug>.html (the date is in the URL).
//
// Event pages add the time ("🕰 dalle 19:30 alle 23:00") and venue ("📍 …").
// To stay light on a volunteer site, detail pages are fetched only for events
// in the next DETAIL_DAYS; later ones are published as all-day from the
// listing and gain times as they come closer. The id is the URL either way.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { addDays, localToIso, dateToIso, romeDate } from '../time.ts'
import { absUrl, decodeEntities, htmlToText } from '../text.ts'

const BASE = 'https://ludimus.it'
const DETAIL_DAYS = 30

// Slug fragment → town, for the regular venues. Unknown venues fall back to
// "(Town)" / "- Town" in the venue line, then to Trentino.
const SLUG_CITY: [string, string][] = [
  ['cantiere26', 'Arco'],
  ['savot-ala', 'Ala'],
  ['crv-ala', 'Ala'],
  ['smartlab', 'Rovereto'],
  ['laciacera', 'Rovereto'],
  ['bibliotecabaselgadipine', 'Baselga di Piné'],
  ['luogo-comune-riva', 'Riva del Garda'],
  ['doppiomalto', 'Trento'],
  ['gattogordo', 'Trento'],
  ['contromossa', 'Trento'],
  ['biblioteca-trento', 'Trento'],
]

function cityFor(slug: string, venue: string | null): string {
  const bySlug = SLUG_CITY.find(([frag]) => slug.includes(frag))?.[1]
  if (bySlug) return bySlug
  const m = venue?.match(/\(([^)]+)\)\s*$/) ?? venue?.match(/\s[-–]\s*([^-–]+)$/)
  return m?.[1]?.trim() ?? 'Trentino'
}

interface Detail { startTime: string | null; endTime: string | null; venue: string | null; description: string; summary: string; image: string | null }

function parseDetail(html: string): Detail {
  const time = html.match(/🕰️?\s*dalle\s+(\d{1,2})[:.](\d{2})(?:\s+alle\s+(\d{1,2})[:.](\d{2}))?/u)
  const venueRaw = html.match(/📍️?\s*([\s\S]*?)<\/p>/u)?.[1]
  const og = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i)?.[1]
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)?.[1]
  // Body: the <section class="event"> minus its <h1> (the title) and the
  // 📅/🕰/📍 line (already in start/venue).
  const section = html.match(/<section\s+class="event"[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? ''
  const body = section.replace(/<h1[\s\S]*?<\/h1>/i, '').replace(/<p>\s*📅[\s\S]*?<\/p>/u, '')
  return {
    startTime: time ? `${time[1]}:${time[2]}` : null,
    endTime: time?.[3] ? `${time[3]}:${time[4]}` : null,
    venue: venueRaw ? htmlToText(venueRaw) || null : null,
    description: body,
    summary: og ? decodeEntities(og) : '',
    image: absUrl(ogImage ? decodeEntities(ogImage) : null, BASE),
  }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const listing = await ctx.fetchText(`${BASE}/events.html`)
  const today = romeDate(ctx.now)
  const lastDay = addDays(today, ctx.horizonDays)
  const detailUntil = addDays(today, DETAIL_DAYS)
  const re = /<a\s+href="(\/events\/(\d{4}-\d{2}-\d{2})-([^"]+?)\.html)"[^>]*>\s*<span>[^<]*<\/span>\s*<span>([^<]+)<\/span>/g
  const out: RawEvent[] = []
  const seen = new Set<string>()
  for (const m of listing.text.matchAll(re)) {
    const [, path = '', date = '', slug = '', rawTitle = ''] = m
    if (seen.has(path) || date < addDays(today, -1) || date > lastDay) continue
    seen.add(path)
    const url = `${BASE}${path}`
    let detail: Detail | null = null
    if (date <= detailUntil) {
      try {
        detail = parseDetail((await ctx.fetchText(url)).text)
      } catch {
        detail = null // listing data is still a valid all-day event
      }
    }
    const timed = Boolean(detail?.startTime)
    const venue = detail?.venue ?? null
    out.push({
      nativeId: url,
      title: decodeEntities(rawTitle).trim(),
      start: timed ? localToIso(date, detail?.startTime ?? '00:00') : dateToIso(date),
      end: timed
        ? detail?.endTime ? localToIso(date, detail.endTime) : null
        : dateToIso(date),
      allDay: !timed,
      venue,
      city: cityFor(slug, venue),
      url,
      description: detail?.description ?? '',
      summary: detail?.summary ?? '',
      image: detail?.image ?? null,
      categoryHint: 'boardgames',
    })
  }
  return out
}

export const ludimus: Adapter = {
  id: 'ludimus',
  name: 'Ludimus',
  defaultCategory: 'boardgames',
  run,
}
