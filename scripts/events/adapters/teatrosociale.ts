// Mantova (ring 2, interests only): Teatro Sociale di Mantova — prose,
// comedy, dance, concerts. ASP.NET site, no feed or Event JSON-LD; the
// spettacoli page carries a "band" with every upcoming show, so one request
// a day. robots.txt has only a Sitemap line = allow all (checked 2026-09-30).
//
// Band markup, one slide per day:
//   <div class="swiper-slide"> … numeric-day">17</div> … swiper-month">ottobre</div>
//     … swiper-day">sabato</div>
//     <a href="/it-it/<slug>.aspx?event=<GUID>" class="calendar-band-swiper-event">
//       <img alt="…" data-src="/public/img/….jpg"> [content-category">Danza</span>]
//       <span class="…-content-title">MONET - UNA VITA A COLORI</span> … <span>21:00</span>
// The band has NO YEAR. The year is the one (this year or next) whose date
// falls on the given weekday and is not in the past — the weekday pins it
// unambiguously within a two-year span. The calendar block below the band
// (current month only) has "sab 17 ott 2026" and an abstract ("DI E CON
// MARCO GOLDIN"): used as a cross-check and for the summary where present.
// Titles are in capitals; "- SPOSTATO"/"ANNULLATO" (moved/cancelled) rows
// are dropped. Every show here is on stage: `theatre` unless the title or
// the card's category says music.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { matchCategories } from '../tags.ts'
import { localToIso, romeDate } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, titleCase } from '../text.ts'

const BASE = 'https://www.teatrosocialemantova.it'
const PAGE = `${BASE}/it-it/spettacoli.aspx`
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
const WEEKDAYS = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato']

const CATEGORY_HINT: Record<string, CategoryId> = {
  danza: 'theatre',
  prosa: 'theatre',
  teatro: 'theatre',
  musica: 'concerts',
  concerti: 'concerts',
}

/** Day + month + weekday → the date in this year or next that matches, not before `today`. */
export function inferDate(day: number, month: number, weekday: number, today: string): string | null {
  const year = Number(today.slice(0, 4))
  for (const y of [year, year + 1]) {
    const d = new Date(Date.UTC(y, month - 1, day, 12))
    const iso = d.toISOString().slice(0, 10)
    if (d.getUTCDate() === day && d.getUTCDay() === weekday && iso >= today) return iso
  }
  return null
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(PAGE)
  const today = romeDate(ctx.now)
  // Abstracts and full dates from the month calendar, by event GUID.
  const extra = new Map<string, { abstract: string; date: string }>()
  for (const a of text.match(/<a class="calendar-app-event"[\s\S]*?<\/a>/g) ?? []) {
    const guid = a.match(/event=([0-9A-F-]{36})/i)?.[1]?.toUpperCase()
    if (guid) {
      extra.set(guid, {
        abstract: htmlToText(a.match(/content-abstract">([\s\S]*?)<\/span>/)?.[1]),
        date: htmlToText(a.match(/content-time">\s*<span><span>([^<]*)<\/span>/)?.[1]),
      })
    }
  }
  const out: RawEvent[] = []
  for (const slide of text.split('<div class="swiper-slide">').slice(1)) {
    const day = Number(slide.match(/numeric-day">\s*(\d{1,2})/)?.[1])
    const month = MONTHS.indexOf(htmlToText(slide.match(/swiper-month">([^<]*)/)?.[1]).toLowerCase()) + 1
    const weekday = WEEKDAYS.indexOf(
      htmlToText(slide.match(/swiper-day">([^<]*)/)?.[1])
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, ''),
    )
    if (!day || month < 1 || weekday < 0) continue
    const date = inferDate(day, month, weekday, today)
    if (!date) continue
    for (const a of slide.match(/<a href="[^"]*event=[\s\S]*?<\/a>/g) ?? []) {
      const href = decodeEntities(a.match(/href="([^"]+)"/)?.[1] ?? '')
      const guid = href.match(/event=([0-9A-F-]{36})/i)?.[1]?.toUpperCase()
      const raw = htmlToText(a.match(/content-title">([\s\S]*?)<\/span>/)?.[1])
      const time = a.match(/event-time">\s*<span>\s*(\d{1,2}):(\d{2})/)
      if (!guid || !raw || !time || /\b(spostato|annullato|rinviato)\b/i.test(raw)) continue
      const more = extra.get(guid)
      // Cross-check: the calendar block's "sab 17 ott 2026" must agree.
      const shownYear = more?.date.match(/\b(\d{4})\b/)?.[1]
      if (shownYear && shownYear !== date.slice(0, 4)) continue
      const title = titleCase(raw)
      const label = htmlToText(a.match(/content-category">([\s\S]*?)<\/span>/)?.[1])
      const hint =
        CATEGORY_HINT[label.toLowerCase()] ?? (matchCategories(title).includes('concerts') ? undefined : 'theatre')
      const url = absUrl(href, BASE) ?? PAGE
      const img = a.match(/data-src="([^"]+)"/)?.[1]
      const start = localToIso(date, `${(time[1] ?? '').padStart(2, '0')}:${time[2]}`)
      out.push({
        nativeId: `${guid}@${start}`,
        seriesKey: guid,
        title,
        start,
        end: null,
        allDay: false,
        venue: 'Teatro Sociale',
        city: 'Mantova',
        url,
        description: more?.abstract ? titleCase(more.abstract) : '',
        image: absUrl(img ? decodeEntities(img) : null, BASE),
        ...(hint ? { categoryHint: hint } : {}),
        tagText: label,
      })
    }
  }
  if (!out.length && !/swiper-slide/.test(text)) throw new Error('no calendar band (markup changed?)')
  return out
}

export const teatrosociale: Adapter = {
  id: 'teatrosociale-mantova',
  name: 'Teatro Sociale di Mantova',
  defaultCategory: 'other',
  area: 'lombardia',
  ring: 'near',
  mayBeEmpty: true,
  maxRequests: 2,
  run,
}
