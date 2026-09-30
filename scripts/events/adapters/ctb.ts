// Brescia (ring 2, interests only): CTB — Centro Teatrale Bresciano, the
// city's teatro stabile (Teatro Sociale, Teatro Mina Mezzadri). The season
// is one static listing, `/spettacoli/` (custom CMS, no feed or JSON-LD):
// one request a day. robots.txt: `User-agent: *` + empty `Disallow:`
// (checked 2026-09-30).
//
// One card per production (not per night):
//   <div class="col-sm-4 m_bot"><a href="…/spettacoli/2026/<slug>"> … <img …>
//     <h3>Fedra</h3></a>
//     <p><b>MARTEDÌ 24 NOVEMBRE 2026 - 20:30 <br><small>FINO AL 29 NOVEMBRE 2026</small></b></p>
// Other date forms: "LUNEDÌ 8 MARZO 2027 - 11:00 E 20:30 SOLO IL 08 MARZO 2027",
// "08 GIUGNO 2026", "DAL 13 GIUGNO 2026 AL 14 GIUGNO 2026". A run of nightly
// shows ("FINO AL") becomes one all-day range with the first night's time in
// the summary (the listing has no per-night times); a single date with a
// time is a timed event.
//
// School matinées are not wanted: they also sit under
// /spettacoli/spettacoli-per-le-scuole (not fetched), and on this listing
// they are exactly the productions whose only time is in the morning
// ("- 11:00"), so those are dropped. A day with "11:00 E 20:30" keeps the
// evening show. No descriptions or venues on the listing.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { dateToIso, localToIso } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, normalize } from '../text.ts'

const BASE = 'https://www.centroteatralebresciano.it'
const PAGE = `${BASE}/spettacoli/`
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

function ymd(day: string, month: string, year: string): string | null {
  const m = MONTHS.indexOf(month)
  return m < 0 ? null : `${year}-${String(m + 1).padStart(2, '0')}-${day.padStart(2, '0')}`
}

/** The card's date text → first day, last day and the evening (or only) time. */
export function parseCtbDate(text: string): { first: string; last: string; time: string | null } | null {
  const t = normalize(text) // "martedi 24 novembre 2026 20 30 fino al 29 novembre 2026"
  const dates = [...t.matchAll(/(\d{1,2}) ([a-z]+) (\d{4})/g)]
    .map((m) => ymd(m[1] ?? '', m[2] ?? '', m[3] ?? ''))
    .filter((d): d is string => Boolean(d))
  const first = dates[0]
  if (!first) return null
  const last = dates.length > 1 && (dates[dates.length - 1] as string) > first ? (dates[dates.length - 1] as string) : first
  // Times follow the first date: "20 30", or "11 00 e 20 30".
  const after = t.slice(t.indexOf(first.slice(0, 4)) + 4)
  const times = [...after.matchAll(/(?:^|\s)(\d{1,2}) (\d{2})(?=\s|$)/g)]
    .map((m) => `${(m[1] ?? '').padStart(2, '0')}:${m[2]}`)
    .filter((hm) => Number(hm.slice(0, 2)) < 24)
  return { first, last, time: times[times.length - 1] ?? null }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(PAGE)
  const out: RawEvent[] = []
  for (const card of text.split('<div class="col-sm-4 m_bot">').slice(1)) {
    const link = card.match(/<a href="([^"]*\/spettacoli\/\d{4}\/[^"]+)"/)
    const title = htmlToText(card.match(/<h3>([\s\S]*?)<\/h3>/)?.[1])
    const when = htmlToText(card.match(/<p>([\s\S]*?)<\/p>/)?.[1])
    const date = parseCtbDate(when)
    if (!link || !title || !date) continue
    // School matinée (see the header): every listed time is before noon.
    if (date.time && Number(date.time.slice(0, 2)) < 13) continue
    const url = absUrl(decodeEntities(link[1] ?? ''), BASE) ?? PAGE
    const img = card.match(/<img[^>]*src="([^"]+)"/)?.[1]
    const single = date.first === date.last
    out.push({
      nativeId: url,
      title,
      start: single && date.time ? localToIso(date.first, date.time) : dateToIso(date.first),
      end: single && date.time ? null : dateToIso(date.last),
      allDay: !(single && date.time),
      venue: null,
      city: 'Brescia',
      url,
      description: '',
      // "Martedì 24 novembre 2026 - 20:30 · fino al 29 novembre 2026"
      summary: when.toLowerCase().replace(/\s+(fino al|solo il)\s+/i, ' · $1 ').replace(/^./, (c) => c.toUpperCase()),
      image: absUrl(img ? decodeEntities(img) : null, BASE),
      ...(/concert/i.test(title) ? {} : { categoryHint: 'theatre' as const }),
      tagText: /produzione ctb/i.test(card) ? 'teatro prosa · Produzione CTB' : 'teatro prosa',
    })
  }
  if (!out.length && !/spettacoli\/\d{4}\//.test(text)) throw new Error('no production cards (markup changed?)')
  return out
}

export const ctb: Adapter = {
  id: 'ctb',
  name: 'CTB — Centro Teatrale Bresciano',
  // 'other' so a "… - Concerto" title can fall to keywords; every other
  // production gets the `theatre` hint above.
  defaultCategory: 'other',
  area: 'lombardia',
  ring: 'near',
  maxRequests: 2,
  run,
}
