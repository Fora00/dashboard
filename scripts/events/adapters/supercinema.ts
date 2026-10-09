// Supercinema Rovereto (Multisala, Piazza Rosmini 18/a): the film programme.
// WordPress without feed/REST (wp-json 404), so: the home lists the current
// films (and the "prossimamente" series) as `<h3 class="cmsmasters_post_title">`
// links to `/?p=NNNNN`; every film page repeats "SABATO 10 OTTOBRE" / "20.40"
// heading lines (one date line, then one or more times), then Genere / Paese /
// Anno / Durata, a synopsis and "Regia" / "Attori". One event PER SCREENING
// (film + day + time). Dates carry no year: it is the one (previous, current
// or next) nearest to today, which handles the Dec → Jan rollover.
// robots.txt (checked 2026-10-09): only file types disallowed, Crawl-delay 2,
// both enforced by http.ts. Requests: the home + one per film, in programme
// order, stopping at the cap with a warning.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { instantToIso, localToIso, parseYmd, romeDate } from '../time.ts'
import { absUrl, decodeEntities, htmlToBlocks, htmlToText, snippet, titleCase } from '../text.ts'

const SITE = 'https://www.supercinemarovereto.it/'
const VENUE = 'Supercinema'
const CITY = 'Rovereto'
const MAX_REQUESTS = 25
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
const pad = (n: number | string) => String(n).padStart(2, '0')

export interface ProgrammeEntry {
  id: string
  url: string
  title: string
  /** The H4 under the title (series: "GIOVEDI' 15 OTTOBRE ORE 18.00 - 21.00"), '' for plain films. */
  note: string
}

/** The films listed on the home, in page order, each once. */
export function parseProgramme(html: string): ProgrammeEntry[] {
  const out: ProgrammeEntry[] = []
  const seen = new Set<string>()
  const re =
    /<h3[^>]*class="[^"]*cmsmasters_post_title[^"]*"[^>]*>\s*<a[^>]*href="([^"]*[?&]p=(\d+)[^"]*)"[^>]*>([\s\S]*?)<\/a>\s*<\/h3>(?:\s*<h4[^>]*>([\s\S]*?)<\/h4>)?/gi
  for (const m of html.matchAll(re)) {
    const id = m[2] as string
    const url = absUrl(decodeEntities(m[1] as string), SITE)
    const title = htmlToText(m[3])
    if (!url || !title || seen.has(id)) continue
    seen.add(id)
    out.push({ id, url, title, note: htmlToText(m[4]) })
  }
  return out
}

/** "18.00", "20.40", "9:05" → "18:00"; null when it is not a time. */
function clock(s: string): string | null {
  const m = /^(\d{1,2})[.:](\d{2})$/.exec(s)
  return m && Number(m[1]) < 24 && Number(m[2]) < 60 ? `${pad(m[1] as string)}:${m[2]}` : null
}

/** "GIOVEDI' 15 OTTOBRE" → [15, month index 0-11]; null otherwise. */
export function parseDateLine(line: string): [number, number] | null {
  const m = /^\p{L}+['’`´]?\s+(\d{1,2})\s+(\p{L}+)\.?$/u.exec(line.trim())
  const month = MONTHS.indexOf((m?.[2] ?? '').toLowerCase())
  const day = Number(m?.[1])
  return m && month >= 0 && day >= 1 && day <= 31 ? [day, month] : null
}

/** "20.40" → ["20:40"]; "18.00 – 21.00" or "ORE 18.00 - 21.00" → ["18:00", "21:00"]; null if not a time line. */
export function parseTimeLine(line: string): string[] | null {
  const t = line
    .replace(/^ore\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return null
  const parts = t.split(/\s*(?:[–—-]|\be\b|,|\/)\s*/i)
  const times = parts.map((p) => clock(p.trim()))
  return times.every((x): x is string => x !== null) ? (times as string[]) : null
}

/**
 * The year (previous, current or next) that puts day/month closest to today:
 * a programme runs a few days to weeks ahead, so "GENNAIO" in late December is
 * next year and "DICEMBRE" in early January is last year.
 */
export function resolveYmd(day: number, month: number, today: string): string | null {
  const y0 = parseYmd(today)[0]
  let best: string | null = null
  let bestGap = Infinity
  for (const y of [y0 - 1, y0, y0 + 1]) {
    const ymd = `${y}-${pad(month + 1)}-${pad(day)}`
    const d = new Date(`${ymd}T00:00:00Z`)
    // Reject rolled-over dates such as 31 NOVEMBRE.
    if (Number.isNaN(d.getTime()) || d.getUTCDate() !== day) continue
    const gap = Math.abs(d.getTime() - new Date(`${today}T00:00:00Z`).getTime())
    if (gap < bestGap) {
      best = ymd
      bestGap = gap
    }
  }
  return best
}

/** Date and time lines of the film page, in order → local screenings. */
export function parseScreenings(lines: string[], today: string): { date: string; time: string }[] {
  const out: { date: string; time: string }[] = []
  let date: string | null = null
  for (const line of lines) {
    const dm = parseDateLine(line)
    if (dm) {
      date = resolveYmd(dm[0], dm[1], today)
      continue
    }
    const times = date ? parseTimeLine(line) : null
    if (date && times) for (const time of times) out.push({ date, time })
  }
  return out
}

export interface Film {
  title: string
  lines: string[]
  genre: string
  year: string
  minutes: number | null
  director: string
  synopsis: string
  image: string | null
}

/** One film page → its heading lines and details; null when the page has no title. */
export function parseFilm(html: string): Film | null {
  const heads = [...html.matchAll(/<h([1-3])[^>]*class="cmsmasters_heading"[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: m[1],
    text: htmlToText(m[2]),
  }))
  const rawTitle = heads.find((h) => h.level === '1')?.text ?? ''
  if (!rawTitle) return null
  const lines = heads.filter((h) => h.level !== '1').map((h) => h.text)
  const field = (name: string) =>
    lines
      .find((l) => l.toLowerCase().startsWith(`${name.toLowerCase()}:`))
      ?.slice(name.length + 1)
      .trim() ?? ''
  const minutes = /(\d{2,3})/.exec(field('Durata'))?.[1]
  const start = html.indexOf('cmsmasters_text')
  const block =
    start < 0
      ? ''
      : html.slice(start, html.indexOf('button_wrap', start) < 0 ? undefined : html.indexOf('button_wrap', start))
  const paragraphs = htmlToBlocks(block.replace(/^[^>]*>/, ''))
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  const credit = (name: string) =>
    paragraphs
      .find((p) => new RegExp(`^${name}\\s*:`, 'i').test(p))
      ?.replace(/^[^:]+:\s*/, '')
      .trim() ?? ''
  const synopsis = paragraphs.filter((p) => !/^(regia|attori)\s*:/i.test(p)).join('\n\n')
  const poster = /<img[^>]*\ssrc="([^"]+)"/i.exec(html)?.[1]
  return {
    title: rawTitle === rawTitle.toUpperCase() ? titleCase(rawTitle) : rawTitle,
    lines,
    genre: field('Genere'),
    year: field('Anno'),
    minutes: minutes ? Number(minutes) : null,
    director: credit('Regia'),
    synopsis,
    image: absUrl(poster ? decodeEntities(poster) : null, SITE),
  }
}

/** Screenings of one film as events (start/end local Rome, end from Durata). */
export function filmEvents(entry: ProgrammeEntry, film: Film, today: string): RawEvent[] {
  // A series page may list no date lines: fall back to the home's H4 ("GIOVEDI' 15 OTTOBRE ORE 18.00 - 21.00").
  let screenings = parseScreenings(film.lines, today)
  if (!screenings.length) screenings = parseScreenings(entry.note.split(/\s+(?=ORE\b)/i), today)
  const facts = [
    film.genre,
    film.year,
    film.minutes ? `${film.minutes} min` : '',
    film.director && `regia di ${film.director}`,
  ]
    .filter(Boolean)
    .join(' · ')
  const description = [facts, snippet(film.synopsis, 700)].filter(Boolean).join('\n\n')
  const seen = new Set<string>()
  const out: RawEvent[] = []
  for (const s of screenings) {
    const start = localToIso(s.date, s.time)
    const nativeId = `${entry.id}-${s.date}-${s.time.replace(':', '')}`
    if (seen.has(nativeId)) continue
    seen.add(nativeId)
    const end = film.minutes ? instantToIso(Date.parse(start) + film.minutes * 60_000) : null
    out.push({
      nativeId,
      seriesKey: entry.id,
      title: film.title,
      start,
      end,
      allDay: false,
      venue: VENUE,
      city: CITY,
      url: entry.url,
      description,
      summary: snippet(film.synopsis || facts, 300),
      image: film.image,
      categoryHint: 'cinema',
      tagText: `cinema film ${film.genre}`,
    })
  }
  return out
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const today = romeDate(ctx.now)
  const home = await ctx.fetchText(SITE)
  const programme = parseProgramme(home.text)
  if (!programme.length) throw new Error('supercinema: no film links on the home page (markup changed?)')
  const out: RawEvent[] = []
  let fetched = 0
  for (const entry of programme) {
    if (fetched >= MAX_REQUESTS - 1) {
      console.warn(`supercinema: request cap reached, ${programme.length - fetched} film page(s) skipped`)
      break
    }
    fetched++
    try {
      const page = await ctx.fetchText(entry.url)
      const film = parseFilm(page.text)
      const events = film ? filmEvents(entry, film, today) : []
      if (!events.length) console.warn(`supercinema: no screenings parsed for ${entry.url} (${entry.title})`)
      out.push(...events)
    } catch (e) {
      console.warn(`supercinema: ${entry.url} failed: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  if (!out.length)
    throw new Error(`supercinema: ${programme.length} films listed but no screening parsed (markup changed?)`)
  return out
}

export const supercinema: Adapter = {
  id: 'supercinema',
  name: 'Supercinema Rovereto',
  defaultCategory: 'cinema',
  maxRequests: MAX_REQUESTS,
  run,
}
