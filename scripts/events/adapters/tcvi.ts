// Vicenza (ring 2, interests only): Fondazione Teatro Comunale Città di
// Vicenza — Teatro Comunale, Ridotto, Teatro Olimpico (Ciclo Classici), Sala
// Maggiore. The whole season is one static page (ProcessWire + UIkit, month
// filtering is client-side), so one request per run. robots.txt allows all
// (checked 2026-09-29). No descriptions on the listing.
//
// One card per performance:
//   <div data-month="ottobre-2026" data-type="prosa" class="uk-event …">
//     … <span class="date-mobile"><span class="day-mobile">mer</span> 30 settembre
//       <span class="hour-mobile">ore 21:00</span></span>
//     … <span class="uk-label">Prosa</span><h3><a href="/it/…/">Title</a></h3>
//     … <div class="… calendar-location …">Teatro Olimpico di Vicenza</div>
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { dateToIso, localToIso } from '../time.ts'
import { absUrl, decodeEntities, htmlToText } from '../text.ts'

const BASE = 'https://www.tcvi.it'
const PAGE = `${BASE}/it/eventi/calendario-eventi/`

const MONTHS = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
]

// Children's / school programmes: never wanted in ring 2, dropped here.
const SKIP_TYPES = /^(spettacoli-per-le-scuole|family-show|famiglie-in-dolce-attesa)$/

function hintFor(type: string): CategoryId | undefined {
  if (
    /^(prosa|danza|circo|musical|operetta|cabaret|show|spettacoli-\d+-ciclo-classici|luoghi-del-contemporaneo-danza)/.test(
      type,
    )
  )
    return 'theatre'
  if (/^(concertistica|sinfonica|live|gospel)/.test(type)) return 'concerts'
  if (/^(talk|conferenze)/.test(type)) return 'talks'
  return undefined
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(PAGE)
  const out: RawEvent[] = []
  for (const card of text.split(/(?=<div data-month=")/).slice(1)) {
    const month = card.match(/^<div data-month="([a-z]+)-(\d{4})"/)
    const type = card.match(/data-type="([^"]*)"/)?.[1] ?? ''
    if (!month || SKIP_TYPES.test(type)) continue
    const date = card.match(/class="[^"]*date-mobile"><span class="day-mobile">[^<]*<\/span>\s*(\d{1,2})\s+([a-z]+)/i)
    const link = card.match(/<h3[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i)
    if (!date || !link) continue
    const m = MONTHS.indexOf((date[2] ?? '').toLowerCase())
    if (m < 0) continue
    // The card's day/month; the year comes from data-month (same month).
    const day = `${month[2]}-${String(m + 1).padStart(2, '0')}-${(date[1] ?? '').padStart(2, '0')}`
    const hour = card.match(/hour-mobile">\s*ore\s+(\d{1,2})[:.](\d{2})/i)
    const url = absUrl(decodeEntities(link[1] ?? ''), BASE) ?? PAGE
    const label = htmlToText(card.match(/<span class="uk-label[^"]*">([\s\S]*?)<\/span>/)?.[1] ?? '')
    const venue = htmlToText(card.match(/calendar-location[^"]*">([\s\S]*?)<\/div>/)?.[1] ?? '') || null
    // Thumbnails are "<name>.150x100.png"; the original sits next to it.
    const img = card.match(/<img[^>]*src="([^"]+)"/)?.[1]?.replace(/\.\d+x\d+(\.\w+)$/, '$1')
    const start = hour ? localToIso(day, `${hour[1]?.padStart(2, '0')}:${hour[2]}`) : dateToIso(day)
    const hint = hintFor(type)
    out.push({
      nativeId: `${url}@${start}`,
      seriesKey: url,
      title: htmlToText(link[2] ?? ''),
      start,
      end: hour ? null : dateToIso(day),
      allDay: !hour,
      venue,
      city: 'Vicenza',
      url,
      description: '',
      image: absUrl(img, BASE),
      ...(hint ? { categoryHint: hint } : {}),
      tagText: [label, type.replace(/-/g, ' ')].filter(Boolean).join(' · '),
    })
  }
  return out
}

export const tcvi: Adapter = {
  id: 'tcvi',
  name: 'Teatro Comunale di Vicenza',
  defaultCategory: 'other',
  area: 'veneto',
  ring: 'near',
  // Theatre is out of the near ring, so a quiet stretch with no concerts/talks is normal.
  // A changed markup still throws inside run().
  mayBeEmpty: true,
  run,
}
