// Brescia (ring 2, interests only): Teatro Grande — opera, ballet, dance and
// concert seasons. Kirby CMS; the calendar is one static page, so one
// request a day. robots.txt disallows /content /kirby /site /media /archive
// only (checked 2026-09-30); www.teatrogrande.it redirects to the bare host,
// which is requested directly. Images under /media are hot-linked, never
// fetched.
//
// One <li> per performance, under a month heading ("ottobre 2026"):
//   <li class="js-entry cal-entries-item main-show sub-danza" data-date="2026-10-02">
//     <div class="entry-category">Danza</div>
//     <div class="entry-title"><span>Sonoma</span><span>La Veronal</span></div>
//     <time class="entry-datetime">ven. 02 ott<br>20:00</time>
//     <div class="entry-text">blurb…</div> <a href="…/it/stagioni/2026/sonoma">Scopri di più</a>
//     <img class="entry-image" src="…">
// `data-date` carries the full date (the census expected to take the year
// from the heading; not needed). Times: "20:00", "18:30, 21:00" (several
// shows: the first is the start), "10:00 — 20:00" (a start and an end).
// `main-caffe` rows are the theatre café's opening hours (dropped), except
// "Aperitivo in Jazz" (live music, kept). Audience filters exist on the page
// ("Per under 11 e famiglie", "Educational"): a row carrying one is kids.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { localToIso } from '../time.ts'
import { absUrl, decodeEntities, htmlToText } from '../text.ts'

const BASE = 'https://teatrogrande.it'
const PAGE = `${BASE}/it/calendario`

const HINT: Record<string, CategoryId> = {
  danza: 'theatre',
  opera: 'theatre',
  concerti: 'concerts',
  'aperitivo-in-jazz': 'concerts',
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(PAGE)
  const out: RawEvent[] = []
  for (const li of text.match(/<li class="js-entry[\s\S]*?<\/li>/g) ?? []) {
    const cls = li.match(/class="([^"]*)"/)?.[1] ?? ''
    const day = li.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
    const main = cls.match(/\bmain-([\w-]+)/)?.[1] ?? ''
    const sub = cls.match(/\bsub-([\w-]+)/)?.[1] ?? ''
    if (!day || (main === 'caffe' && sub !== 'aperitivo-in-jazz')) continue
    const spans = [...(li.match(/entry-title">([\s\S]*?)<\/div>/)?.[1] ?? '').matchAll(/<span>([\s\S]*?)<\/span>/g)]
      .map((m) => htmlToText((m[1] ?? '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<br\s*\/?>/gi, ', ')))
      .filter(Boolean)
    const [title, subtitle] = spans
    const when = htmlToText((li.match(/entry-datetime">([\s\S]*?)<\/time>/)?.[1] ?? '').replace(/<br\s*\/?>/gi, ' | '))
    const times = [...when.matchAll(/(\d{1,2}):(\d{2})/g)].map((m) => `${(m[1] ?? '').padStart(2, '0')}:${m[2]}`)
    if (!title || !times[0]) continue
    const start = localToIso(day, times[0])
    const end = /—|–/.test(when) && times[1] ? localToIso(day, times[1]) : null
    const link = li.match(/<a href="(https:\/\/teatrogrande\.it\/it\/(?!calendario)[^"]+)"/)?.[1]
    const url = link ? decodeEntities(link) : `${PAGE}#${day}`
    const blurb = htmlToText(li.match(/entry-text">([\s\S]*?)<\/div>/)?.[1])
    const category = htmlToText(li.match(/entry-category">([\s\S]*?)<\/div>/)?.[1])
    const kids = /under11|educational/.test(cls)
    const hint = HINT[sub]
    out.push({
      nativeId: `${url}@${start}`,
      seriesKey: url,
      title,
      start,
      end,
      allDay: false,
      venue: main === 'caffe' ? 'Caffè del Teatro Grande' : 'Teatro Grande',
      city: 'Brescia',
      url,
      description: blurb,
      summary: [subtitle, times.length > 1 && !end ? `ore ${times.join(', ')}` : '', blurb].filter(Boolean).join(' · '),
      image: absUrl(decodeEntities(li.match(/<img class="entry-image" src="([^"]+)"/)?.[1] ?? ''), BASE),
      ...(hint ? { categoryHint: hint } : {}),
      tagText: [category, sub.replace(/-/g, ' '), kids ? 'per famiglie' : ''].filter(Boolean).join(' · '),
    })
  }
  if (!out.length && !/cal-entries/.test(text)) throw new Error('no calendar entries (markup changed?)')
  return out
}

export const teatrogrande: Adapter = {
  id: 'teatrogrande',
  name: 'Teatro Grande di Brescia',
  defaultCategory: 'other',
  area: 'lombardia',
  ring: 'near',
  maxRequests: 2,
  run,
}
