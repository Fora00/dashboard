// Lake Garda, Veneto shore (ring 1): www.lagodigardaveneto.com, the
// Destination Verona & Garda portal (Pimcore "destisuite"). The only
// lake-wide source: Malcesine, Brenzone, Torri, Garda, Bardolino, Lazise,
// Peschiera and the hinterland. robots.txt allows all (checked 2026-09-29).
//
// The listing `?page=N` (9 cards, ~280 KB each) is paged until a page has no
// cards (about 11 pages; it only reaches a few weeks ahead plus long-running
// items). Each card carries:
//   - the event link `/it/eventi/<slug>_<id>` and a `data-gtm-el` JSON with
//     title, locations and categories (used as tag text);
//   - `DD.MM - DD.MM.YYYY` or `DD.MM.YYYY`, an optional "(Ogni Lunedì…)"
//     recurrence, "TOWN - address" and a start time.
// A range becomes one all-day span (its weekly days are in the summary); a
// single day with a time is a timed event. Detail pages (JSON-LD with the
// venue and a larger image, ~200 KB each) are not fetched; the listing
// thumbnail is used as the image.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { z } from 'zod'
import { dateToIso, localToIso } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, normalize } from '../text.ts'

const BASE = 'https://www.lagodigardaveneto.com'
const LISTING = `${BASE}/it/cosa-fare/eventi-lago-di-garda-veneto`
const MAX_PAGES = 20

/** Year-round weekly markets (listed with an end in 2068) and bus services: noise here. */
const SKIP_TITLE = /^bus\b|\bnavetta\b|\bmercat(o|ini) settimanal|\bmercato (del|di) (lunedi|martedi|mercoledi|giovedi|venerdi|sabato|domenica)/i

const GtmSchema = z.looseObject({
  title: z.string().optional(),
  locations: z.array(z.looseObject({ name: z.string().optional() })).optional(),
  categories: z.array(z.looseObject({ name: z.string().optional() })).optional(),
})
type Gtm = z.infer<typeof GtmSchema>

function ymd(d: string, m: string, y: string): string {
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

/** A title-cased town from "BARDOLINO" / "Peschiera del Garda". */
function town(raw: string): string {
  const t = raw.trim()
  return t === t.toUpperCase() ? t.toLowerCase().replace(/(^|[\s'-])\p{L}/gu, (c) => c.toUpperCase()).replace(/\b(Del|Di|Sul|Della)\b/g, (w) => w.toLowerCase()) : t
}

// Children's typologies ("manifestazioni per famiglie e bambini", "teatro
// bambini", "animazioni per bambini") mark a children's event only when they
// are all it has (besides catch-alls like "eventi diversi", "gite/escursioni
// varie"): the chestnut fair or a band concert that also lists "per famiglie
// e bambini" is for everyone.
const KIDS_TYPE = /bambin|famigli/i
const GENERIC_TYPE = /\b(?:vari|varie|diversi|diverse)$/i

function familyTypes(categories: string[]): string[] {
  const other = categories.filter((c) => !KIDS_TYPE.test(c) && !GENERIC_TYPE.test(c))
  return other.length ? categories.filter((c) => !KIDS_TYPE.test(c)) : categories
}

function parseCard(card: string): RawEvent | null {
  const link = card.match(/href="(https:\/\/www\.lagodigardaveneto\.com\/it\/eventi\/[^"]+_(\d+))"/)
  if (!link) return null
  const [, url = '', id = ''] = link
  let gtm: Gtm = {}
  const rawGtm = card.match(/data-gtm-el="([^"]*)"/)?.[1]
  try {
    if (rawGtm) gtm = GtmSchema.parse(JSON.parse(decodeEntities(rawGtm)))
  } catch {
    gtm = {}
  }
  const titleHtml = card.match(/class="ds-h3">\s*<a[^>]*>([\s\S]*?)<\/a>/)?.[1]
  const title = (titleHtml ? htmlToText(titleHtml) : '') || gtm.title?.trim() || ''
  if (!title || SKIP_TITLE.test(normalize(title))) return null
  const period = card.match(/class="ds-item-period-info">([\s\S]*?)<\/ul>/)?.[1] ?? ''
  const items = [...period.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1] ?? '')
  const dateLi = items.find((li) => /calendar/.test(li)) ?? ''
  const placeLi = items.find((li) => /map-marker/.test(li)) ?? ''
  const timeLi = items.find((li) => /clock/.test(li)) ?? ''
  const dates = htmlToText(dateLi)
  const range = dates.match(/(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?\s*-\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  const single = dates.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  let first: string
  let last: string
  if (range) {
    const [, d1 = '', m1 = '', y1, d2 = '', m2 = '', y2 = ''] = range
    last = ymd(d2, m2, y2)
    const y = y1 ?? (Number(m1) > Number(m2) ? String(Number(y2) - 1) : y2)
    first = ymd(d1, m1, y)
  } else if (single) {
    first = last = ymd(single[1] ?? '', single[2] ?? '', single[3] ?? '')
  } else {
    return null
  }
  const recurrence = dates.match(/\(([^)]+)\)/)?.[1]?.trim()
  const placeText = htmlToText(placeLi)
  const [townRaw = '', ...addr] = placeText.split(/\s+-\s+/)
  const city = town(townRaw) || gtm.locations?.[0]?.name?.trim() || 'Lago di Garda'
  const at = htmlToText(timeLi).match(/\b(\d{1,2}):(\d{2})\b/)
  const time = at && !(at[1] === '00' && at[2] === '00') ? `${at[1]?.padStart(2, '0')}:${at[2]}` : null
  const timed = Boolean(time) && first === last
  const categories = familyTypes((gtm.categories ?? []).map((c) => c.name?.replace(/\\\//g, '/').trim()).filter((c): c is string => Boolean(c)))
  const img = card.match(/data-srcset="([^"\s]+)/)?.[1]
  const summary = [recurrence, time && !timed ? `ore ${time}` : ''].filter(Boolean).join(', ')
  return {
    nativeId: id,
    title,
    start: timed ? localToIso(first, time ?? '00:00') : dateToIso(first),
    end: timed ? null : dateToIso(last),
    allDay: !timed,
    venue: addr.join(' - ').trim() || null,
    city,
    url,
    description: summary,
    summary,
    image: absUrl(img ? decodeEntities(img) : null, BASE),
    tagText: categories.join(' · '),
  }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const out = new Map<string, RawEvent>()
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { text } = await ctx.fetchText(`${LISTING}?page=${page}`)
    const cards = text.split('class="ds-item-image"').slice(1)
    if (cards.length === 0) break
    let fresh = 0
    for (const card of cards) {
      const ev = parseCard(card)
      if (ev && !out.has(ev.nativeId)) {
        out.set(ev.nativeId, ev)
        fresh++
      }
    }
    // A page past the end may repeat the last one instead of being empty.
    if (fresh === 0 && cards.length > 0 && page > 1) break
  }
  return [...out.values()]
}

export const gardaveneto: Adapter = {
  id: 'garda-veneto',
  name: 'Lago di Garda Veneto',
  defaultCategory: 'other',
  area: 'verona-garda',
  run,
}
