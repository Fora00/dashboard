// Tebe APS (Teatro comunale di Bedollo, altopiano di Piné): shows, theatre
// labs and creative afternoons. A small Next.js one-page site; robots.txt
// allows everything. There is no feed or structured data, so the #eventi
// cards are read from the static HTML (one request a day):
//   <p …uppercase…>Series</p><h3>Title</h3><p>Blurb</p>
//   <div><p>Sabato 10 ottobre 2026 · ore 20:30</p><p>Venue</p></div>
// No per-event pages: every event links to the #eventi section.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { dateToIso, localToIso } from '../time.ts'
import { htmlToText, normalize } from '../text.ts'

const SITE = 'https://www.apstebe.org/'
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

function ymd(day: string, month: string, year: string): string | null {
  const m = MONTHS.indexOf(month)
  if (m < 0) return null
  return `${year}-${String(m + 1).padStart(2, '0')}-${day.padStart(2, '0')}`
}

/** "Sabato 10 ottobre 2026 · ore 20:30", "26 settembre 2026", "2 marzo - 29 agosto 2026". */
export function parseTebeDate(text: string): { start: string; end: string | null; allDay: boolean } | null {
  const t = normalize(text)
  const range = t.match(/(\d{1,2}) ([a-z]+)(?: (\d{4}))? (\d{1,2}) ([a-z]+) (\d{4})/)
  if (range) {
    const last = ymd(range[4] ?? '', range[5] ?? '', range[6] ?? '')
    const first = ymd(range[1] ?? '', range[2] ?? '', range[3] ?? range[6] ?? '')
    if (first && last) return { start: dateToIso(first), end: dateToIso(last), allDay: true }
  }
  const one = t.match(/(\d{1,2}) ([a-z]+) (\d{4})(?: ore (\d{1,2}) (\d{2}))?/)
  if (!one) return null
  const day = ymd(one[1] ?? '', one[2] ?? '', one[3] ?? '')
  if (!day) return null
  if (one[4]) return { start: localToIso(day, `${one[4]}:${one[5]}`), end: null, allDay: false }
  return { start: dateToIso(day), end: dateToIso(day), allDay: true }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(SITE)
  const out: RawEvent[] = []
  for (const h3 of text.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)) {
    const before = text.slice(Math.max(0, (h3.index ?? 0) - 400), h3.index)
    const after = text.slice((h3.index ?? 0) + h3[0].length, (h3.index ?? 0) + h3[0].length + 1200)
    const paras = [...after.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].slice(0, 3).map((m) => htmlToText(m[1]))
    const [blurb = '', when = '', venue = ''] = paras
    const date = parseTebeDate(when)
    if (!date) continue // board members, headings
    const title = htmlToText(h3[1])
    const series = [...before.matchAll(/<p class="[^"]*uppercase[^"]*">([\s\S]*?)<\/p>/g)].pop()?.[1]
    out.push({
      nativeId: `${normalize(title)}@${date.start.slice(0, 10)}`,
      title,
      ...date,
      venue: venue || 'Teatro Comunale di Bedollo',
      city: 'Bedollo',
      url: `${SITE}#eventi`,
      description: blurb,
      tagText: htmlToText(series),
    })
  }
  if (!out.length && !/eventi/i.test(text)) throw new Error('no #eventi section (markup changed?)')
  return out
}

export const tebe: Adapter = {
  id: 'tebe',
  name: 'Tebe APS — Teatro di Bedollo',
  defaultCategory: 'other',
  mayBeEmpty: true,
  maxRequests: 2,
  run,
}
