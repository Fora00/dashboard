// Centro Santa Chiara (Trento, Rovereto): Teatro Sociale, Auditorium, Cuminetti,
// SanbàPolis, Auditorium Melotti, plus Musicantica and Cinemart. The calendar
// page loads its list with a jQuery `$.post('/csc_shows', {'date-range':
// 'dd/mm/yyyy - dd/mm/yyyy'})` that answers `{correct: <html cards>}`, so one
// urlencoded POST covers the whole window. robots.txt allows /spettacoli
// (checked 2026-10-01; Crawl-delay 10 is honoured by http.ts).
//
// One card per performance:
//   <div class="single_next_event color_rassegna rosso_cardinale">
//     <p class="sne_day">01</p><p>Ottobre, 2026</p><p>20.00</p> …
//     <a href="/spettacoli/calendariospettacoli/slug"><img src=…> …
//     <p class="sne_title">TITLE</p><p class="sne_location">Trento - Chiesa …</p>
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { addDays, dateToIso, localToIso, romeDate } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, titleCase } from '../text.ts'

const BASE = 'https://www.centrosantachiara.it'
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

const dmy = (ymd: string): string => ymd.split('-').reverse().join('/')

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const from = romeDate(ctx.now)
  const to = addDays(from, ctx.horizonDays)
  const res = await ctx.postForm<{ correct?: string }>(`${BASE}/csc_shows`, { 'date-range': `${dmy(from)} - ${dmy(to)}` })
  const out: RawEvent[] = []
  for (const card of (res.correct ?? '').split(/(?=<div class="single_next_event)/).slice(1)) {
    const date = /sne_day">(\d{1,2})<\/p>\s*<p>([A-Za-zì]+),\s*(\d{4})<\/p>\s*(?:<p>(\d{1,2})[.:](\d{2})<\/p>)?/.exec(card)
    const link = /<a href="(\/spettacoli\/[^"]+)"/.exec(card)
    const title = htmlToText(/sne_title">([\s\S]*?)<\/p>/.exec(card)?.[1] ?? '')
    const m = MONTHS.indexOf((date?.[2] ?? '').toLowerCase())
    if (!date || !link || !title || m < 0) continue
    const day = `${date[3]}-${String(m + 1).padStart(2, '0')}-${(date[1] ?? '').padStart(2, '0')}`
    const start = date[4] ? localToIso(day, `${date[4].padStart(2, '0')}:${date[5]}`) : dateToIso(day)
    const location = htmlToText(/sne_location">([\s\S]*?)<\/p>/.exec(card)?.[1] ?? '')
    // "Town - Venue" (Trento - Chiesa…, Riva del Garda - Forte Garda) or "Venue Town" (Auditorium … Rovereto).
    const prefix = /^([^-]+?)\s+-\s+(.+)$/.exec(location)
    const city = prefix?.[1] ?? (/rovereto/i.test(location) ? 'Rovereto' : 'Trento')
    const venue = (prefix?.[2] ?? location) || null
    const url = absUrl(decodeEntities(link[1] ?? ''), BASE) ?? BASE
    const img = /<img src="([^"]+)"/.exec(card)?.[1]
    const note = htmlToText(/she_adv">([\s\S]*?)<\/div>\s*<\/div>/.exec(card)?.[1] ?? '')
    const slug = url.split('/').pop() ?? ''
    out.push({
      nativeId: `${url}@${start}`,
      seriesKey: url,
      title: title === title.toUpperCase() ? titleCase(title) : title,
      start,
      end: null,
      allDay: !date[4],
      venue,
      city,
      url,
      description: note,
      ...(note ? { summary: note } : {}),
      image: absUrl(img ? encodeURI(decodeEntities(img)).replace(/%25/g, '%') : null, BASE),
      // The slug carries the programme ("scappo-famiglie", "cinemart", "musicantica").
      tagText: slug.replace(/[-.]/g, ' '),
    })
  }
  return out
}

export const santachiara: Adapter = {
  id: 'santachiara',
  name: 'Centro Santa Chiara',
  defaultCategory: 'theatre',
  mayBeEmpty: true,
  maxRequests: 4,
  run,
}
