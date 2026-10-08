// MUSE – Museo delle Scienze di Trento (www.muse.it). WordPress with a custom
// post type `events`. robots.txt allows everything (checked 2026-10-03).
//
// The REST type has no dates (ACF is empty), and the calendar page only lists
// what is "In corso" (about 25 cards) with no dates: the date lives in the
// sidebar of each event page, as an `ico-calendar` line in Italian prose
// ("Dal 22 ottobre all'1 novembre 2026", "Sabato 10 ottobre 2026"), next to a
// `map-pin` line (the venue, "Palazzo Reale, Genova"). So: candidates = the
// calendar's "In corso" cards + the newest events by REST publish date (an
// upcoming event is published weeks before it starts), then one page each for
// the dates, capped. Dates are all-day (the times are free text).
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { addDays, dateToIso, romeDate } from '../time.ts'
import { absUrl, decodeEntities, htmlToText } from '../text.ts'

const SITE = 'https://www.muse.it'
const CALENDAR = `${SITE}/calendario-eventi/`
const REST = `${SITE}/wp-json/wp/v2/events?per_page=60&orderby=date&order=desc&_fields=link,title,yoast_head_json`
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
const MONTH = MONTHS.join('|')
const MAX_PAGES = 70

const pad = (n: number | string) => String(n).padStart(2, '0')

interface Candidate {
  url: string
  title: string
  summary: string
  image: string | null
  kind: string
}

/** One date mention before years are filled in. */
interface Mention {
  day: number
  month: number
  year: number | null
}

/**
 * Dates in an Italian phrase, as [first, last] days (YYYY-MM-DD) or null.
 * "Dal 22 ottobre all'1 novembre 2026", "Dal 22 al 25 ottobre 2026", "Sabato 10
 * ottobre", "10 ottobre 2026". A missing year is the nearest one on or after
 * `today` (or, in a range, the year of the other end).
 */
export function parseDates(phrase: string, today: string): [string, string] | null {
  const text = decodeEntities(phrase).replace(/\s+/g, ' ').toLowerCase()
  const found: Mention[] = []
  // "dal 22 al 25 ottobre 2026": the first day has no month of its own.
  const shared = new RegExp(
    `(\\d{1,2})\\s*(?:al|a|e|-|–)\\s*(?:l[’']\\s*)?(\\d{1,2})\\s+(${MONTH})(?:\\s+(\\d{4}))?`,
  ).exec(text)
  if (shared) {
    const month = MONTHS.indexOf(shared[3] as string)
    const year = shared[4] ? Number(shared[4]) : null
    found.push({ day: Number(shared[1]), month, year }, { day: Number(shared[2]), month, year })
  } else {
    const re = new RegExp(`(?:l[’']\\s*)?(\\d{1,2})°?\\s+(${MONTH})(?:\\s+(\\d{4}))?`, 'g')
    for (const m of text.matchAll(re))
      found.push({ day: Number(m[1]), month: MONTHS.indexOf(m[2] as string), year: m[3] ? Number(m[3]) : null })
  }
  if (found.length === 0) return null
  const known = found.find((f) => f.year !== null)?.year ?? null
  const ymd = (f: Mention, year: number) => `${year}-${pad(f.month + 1)}-${pad(f.day)}`
  const y0 = Number(today.slice(0, 4))
  const days = found.map((f) => {
    if (f.year !== null) return ymd(f, f.year)
    if (known !== null) return ymd(f, known)
    // No year anywhere: this year, or next when it already went by.
    const d = ymd(f, y0)
    return d < addDays(today, -30) ? ymd(f, y0 + 1) : d
  })
  // A range written across a new year ("dal 20 dicembre al 6 gennaio 2027").
  if (days.length > 1 && (days[0] as string) > (days[days.length - 1] as string)) {
    days[0] = `${Number((days[0] as string).slice(0, 4)) - 1}${(days[0] as string).slice(4)}`
  }
  const sorted = [...days].sort()
  return [sorted[0] as string, sorted[sorted.length - 1] as string]
}

/** `venue` and `city` from the sidebar's map-pin line ("Palazzo Reale, Genova"; "MUSE" = the museum). */
export function parsePlace(pin: string | null): { venue: string; city: string } {
  const text = (pin ?? '').trim()
  if (!text || /^muse\b/i.test(text)) return { venue: 'MUSE', city: 'Trento' }
  const parts = text.split(/\s*,\s*/)
  if (parts.length > 1) return { venue: text, city: parts[parts.length - 1] as string }
  // "Museo Geologico delle Dolomiti a Predazzo", "Castello San Giovanni di Bondone".
  const town = /\s(?:a|di)\s+([A-ZÀ-Ý][\wà-ÿ']+(?:\s+[A-ZÀ-Ý][\wà-ÿ']+)?)$/.exec(text)?.[1]
  return { venue: text, city: town ?? 'Trento' }
}

/** The text of the `<p>` that follows an icon in the event page's sidebar. */
function sidebarLines(html: string, icon: string): string[] {
  const aside = html.slice(html.indexOf('<aside>'), html.indexOf('</aside>') + 8)
  const out: string[] = []
  const re = new RegExp(`#${icon}"[\\s\\S]*?</div>\\s*(?:<p>([\\s\\S]*?)</p>|([^<]+)</a>)`, 'g')
  for (const m of aside.matchAll(re)) {
    const t = htmlToText(m[1] ?? m[2] ?? '')
      .replace(/\s+/g, ' ')
      .trim()
    if (t) out.push(t)
  }
  return out
}

async function candidates(ctx: AdapterContext): Promise<Candidate[]> {
  const byUrl = new Map<string, Candidate>()
  // Calendar "In corso" cards: title attribute + the small label ("Mostra", "Laboratorio").
  const { text } = await ctx.fetchText(CALENDAR)
  for (const card of text.split(/<article\b/).slice(1)) {
    const link = /<a href="(https:\/\/www\.muse\.it\/eventi\/[^"]+)"[^>]*title="([^"]*)"/.exec(card)
    if (!link) continue
    const url = link[1] as string
    const kind = htmlToText(/class="eyelet">([^<]*)</.exec(card)?.[1] ?? '')
    byUrl.set(url, { url, title: htmlToText(link[2]), summary: '', image: null, kind })
  }
  type Rest = {
    link?: string
    title?: { rendered?: string }
    yoast_head_json?: { description?: string; og_image?: { url?: string }[] }
  }
  const rest = await ctx.fetchJson<Rest[]>(REST)
  for (const r of rest) {
    if (!r.link) continue
    const prev = byUrl.get(r.link)
    byUrl.set(r.link, {
      url: r.link,
      title: htmlToText(r.title?.rendered) || prev?.title || '',
      summary: r.yoast_head_json?.description ?? '',
      image: absUrl(r.yoast_head_json?.og_image?.[0]?.url, SITE),
      kind: prev?.kind ?? '',
    })
  }
  return [...byUrl.values()].filter((c) => c.title).slice(0, MAX_PAGES)
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const today = romeDate(ctx.now)
  const horizon = addDays(today, ctx.horizonDays)
  const out: RawEvent[] = []
  const cands = await candidates(ctx)
  let failed = 0
  let attempted = 0
  for (const c of cands) {
    let html: string
    try {
      attempted++
      html = (await ctx.fetchText(c.url)).text
    } catch (e) {
      // The request cap is the end of the run; one bad page is just skipped.
      if (/request cap/.test((e as Error).message)) {
        attempted--
        break
      }
      failed++
      continue
    }
    const place = parsePlace(sidebarLines(html, 'map-pin')[0] ?? null)
    const lines = sidebarLines(html, 'ico-calendar').filter((l) => !/inaugurazione|anteprima/i.test(l))
    lines.forEach((line, i) => {
      const range = parseDates(line, today)
      if (!range) return
      const [from, to] = range
      if (to < addDays(today, -1) || from > horizon) return
      out.push({
        nativeId: `${c.url}#${i}`,
        title: c.title,
        start: dateToIso(from),
        end: dateToIso(to),
        allDay: true,
        venue: place.venue,
        city: place.city,
        url: c.url,
        description: c.summary,
        summary: c.summary,
        image: c.image,
        tagText: [c.kind, c.title].filter(Boolean).join(' · '),
        ...(/mostra|esposizione/i.test(`${c.kind} ${c.title}`) ? { categoryHint: 'exhibitions' as const } : {}),
      })
    })
  }
  // Skipping one bad page is fine; every page failing is a broken source.
  if (attempted > 0 && failed === attempted) throw new Error(`all ${failed} event pages failed to load`)
  return out
}

export const muse: Adapter = {
  id: 'muse',
  name: 'MUSE – Museo delle Scienze',
  defaultCategory: 'talks',
  mayBeEmpty: true,
  maxRequests: MAX_PAGES + 4,
  run,
}
