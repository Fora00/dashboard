// Padova (ring 2, interests only): Teatro Stabile del Veneto — Teatro Verdi
// (+ Ridotto, Foyer) and Teatro Maddalene; its Treviso and Venezia theatres
// are outside the rings and dropped. The HubSpot site's Vue list reads a
// POST-only JSON API, api.teatrostabileveneto.it/api/Public/eventslist, so
// this is the one adapter using ctx.postJson. The whole season fits one page
// (pageSize 100): one request a day, ≈150 KB. robots.txt on the api host is
// 404 = allow all; www disallows only /spettacoli-per-tipologia/ (the HTML
// list, not needed). Checked 2026-09-30.
//
// One record per production, not per night: `startDate`/`endDate` are local
// dates without times ("30 settembre - 3 ottobre 2026" in `datePeriod`), so
// every production is an all-day range. `title`, `shortDescription`,
// `companyName`, `locationCity` and each `;`-separated `genres` item are
// JSON strings of {"it","en"}. Public page: www…/spettacolo/<hsUrl> (the
// site's own links); image: the site's `_mediaUrl` + `blobLinkIds`.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { z } from 'zod'
import { dateToIso } from '../time.ts'
import { parseList, parseOrThrow } from '../schemas.ts'
import { titleCase } from '../text.ts'

const API = 'https://api.teatrostabileveneto.it/api/Public/eventslist'
const SITE = 'https://www.teatrostabileveneto.it'
const MEDIA = 'https://media.teatrostabileveneto.it/uploadedmedia/'
const BODY = {
  new: false, filterOnly: false, lang: 'it', listType: 0, search: '', cities: [], genres: [],
  productions: false, firstDate: null, page: 0, pageSize: 100, giftCard: null,
}

const TsvEventSchema = z.looseObject({
  mainEventId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  datePeriod: z.string().optional(),
  locationName: z.string().optional(),
  locationCity: z.string().nullish(),
  title: z.string().optional(),
  shortDescription: z.string().nullish(),
  genres: z.string().nullish(),
  companyName: z.string().nullish(),
  hsUrl: z.string().optional(),
  blobLinkIds: z.string().nullish(),
})
const TsvPageSchema = z.looseObject({ Events: z.array(z.unknown()).optional(), HasNextPage: z.boolean().optional() })
type TsvEvent = z.infer<typeof TsvEventSchema>

/** '{"it":"Padova","en":"Padua"}' → 'Padova'; plain text passes through. */
function it(value: string | null | undefined): string {
  if (!value) return ''
  try {
    const v = JSON.parse(value) as { it?: string } | string
    return (typeof v === 'string' ? v : v.it ?? '').trim()
  } catch {
    return value.trim()
  }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const events: TsvEvent[] = []
  // One page today; follow HasNextPage just in case the season grows.
  for (let page = 0; page < 3; page++) {
    const res = parseOrThrow(TsvPageSchema, await ctx.postJson(API, { ...BODY, page }), 'stabile-veneto')
    events.push(...parseList(TsvEventSchema, res.Events ?? [], 'stabile-veneto'))
    if (!res.HasNextPage) break
  }
  const out: RawEvent[] = []
  for (const e of events) {
    if (it(e.locationCity) !== 'Padova') continue
    const first = e.startDate?.slice(0, 10)
    const last = e.endDate?.slice(0, 10) ?? first
    const raw = it(e.title)
    if (!first || !last || !raw || !e.mainEventId) continue
    const genres = (e.genres ?? '').split(';').map(it).filter(Boolean)
    // Prosa, Danza, Lirica, Contemporaneo, Letture… or none: a stage show.
    const hint: CategoryId = genres.includes('Concertistica') ? 'concerts' : 'theatre'
    const company = it(e.companyName)
    out.push({
      nativeId: String(e.mainEventId),
      // Concert titles come in capitals ("KURT ELLING AND THE YELLOWJACKETS").
      title: /\p{Ll}/u.test(raw) ? raw : titleCase(raw),
      start: dateToIso(first),
      end: dateToIso(last < first ? first : last),
      allDay: true,
      venue: e.locationName?.trim() || null,
      city: 'Padova',
      url: e.hsUrl ? `${SITE}/spettacolo/${encodeURIComponent(e.hsUrl)}` : SITE,
      description: it(e.shortDescription),
      ...(e.blobLinkIds ? { image: MEDIA + encodeURIComponent(e.blobLinkIds.split(/[;,]/)[0] ?? '') } : {}),
      categoryHint: hint,
      tagText: [...genres, company].filter(Boolean).join(' · '),
    })
  }
  return out
}

// Everything on its stages is a show: `theatre` unless the genre says
// Concertistica (many Maddalene productions carry no genre at all).
export const stabileveneto: Adapter = {
  id: 'stabileveneto',
  name: 'Teatro Stabile del Veneto (Padova)',
  defaultCategory: 'other',
  area: 'veneto',
  ring: 'near',
  maxRequests: 3,
  run,
}
