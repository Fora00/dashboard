// MyMovies cinema programmes for the Trentino halls other than Supercinema
// Rovereto (which has its own, fuller adapter): Trento (Multisala Modena,
// Supercinema Vittoria, HarpoLab), Cles, Pergine Valsugana, Tesero.
// The city pages list, per film, one block per hall ("OGGI A TRENTO") with the
// hall link, the show times as `<span class="mm-weight-700">19:00</span>` and
// `GetMappa(hallId, filmId)`. Only TODAY is published (no day parameter, the
// RSS feed answers "in manutenzione", checked 2026-10-20): each daily crawl
// therefore adds that day's screenings, and the days already crawled age out.
// robots.txt allows everything but PetalBot. Requests: one per city page.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { localToIso, romeDate } from '../time.ts'
import { decodeEntities, htmlToText, titleCase } from '../text.ts'

const BASE = 'https://www.mymovies.it/cinema/trento/'
const PAGES = ['', 'cles/', 'perginevalsugana/', 'tesero/']

export interface HallShowing {
  hallId: string
  hall: string
  city: string
  filmId: string
  title: string
  url: string
  times: string[]
}

/** film id → title, from the list of films at the top of every page. */
function filmTitles(html: string): Map<string, string> {
  const titles = new Map<string, string>()
  for (const m of html.matchAll(/provincia\/\?f=(\d+)"[^>]*>([^<]+)<\/a>/g)) {
    const title = htmlToText(m[2])
    if (title && !titles.has(m[1] as string)) titles.set(m[1] as string, title)
  }
  return titles
}

/** One city page → the screenings of today, one entry per film and hall. */
export function parsePage(html: string): HallShowing[] {
  const titles = filmTitles(html)
  const parts = html.split(/<strong>OGGI\s+A\s+/i)
  const out: HallShowing[] = []
  for (const part of parts.slice(1)) {
    const city = titleCase(
      decodeEntities(part.slice(0, part.indexOf('<')))
        .replace(/\s*\(.*$/, '')
        .trim(),
    )
    const hall = /title="Programmazione del cinema ([^"]+) di [^"]+"/.exec(part)
    const map = /GetMappa\((\d+),\s*(\d+)\)/.exec(part)
    const hallLink = /href="[^"]*\/cinema\/trento\/[^"/]+\/(\d+)\/"/.exec(part)
    if (!hall || !map || !city) continue
    const filmId = map[2] as string
    // The top list misses some films: the review link of the block names it too.
    const title = titles.get(filmId) ?? htmlToText(/title="Recensione del film ([^"]+)"/.exec(part)?.[1])
    if (!title) continue
    // The block ends where the next film starts: its times come before the next "OGGI A".
    const times = [...part.matchAll(/mm-weight-700">\s*(\d{1,2}):(\d{2})\s*</g)]
      .map((m) => `${String(m[1]).padStart(2, '0')}:${m[2]}`)
      .filter((t, i, all) => all.indexOf(t) === i)
    if (!times.length) continue
    const film = /href="(https:\/\/www\.mymovies\.it\/film\/\d{4}\/[^/"]+\/)"/.exec(part)?.[1]
    out.push({
      hallId: (hallLink?.[1] ?? map[1]) as string,
      hall: htmlToText(hall[1]).replace(/^cinema\s+/i, ''),
      city,
      filmId,
      title,
      url: film ?? `${BASE}provincia/?f=${filmId}`,
      times,
    })
  }
  return out
}

/** Today's screenings as events (no end time: MyMovies gives none here). */
export function toEvents(showings: HallShowing[], today: string): RawEvent[] {
  const seen = new Set<string>()
  const out: RawEvent[] = []
  for (const s of showings) {
    for (const time of s.times) {
      const nativeId = `${s.hallId}-${s.filmId}-${today}-${time.replace(':', '')}`
      if (seen.has(nativeId)) continue
      seen.add(nativeId)
      out.push({
        nativeId,
        seriesKey: `${s.hallId}-${s.filmId}`,
        title: s.title,
        start: localToIso(today, time),
        end: null,
        allDay: false,
        venue: s.hall,
        city: s.city,
        url: s.url,
        description: '',
        categoryHint: 'cinema',
        tagText: 'cinema film',
      })
    }
  }
  return out
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const today = romeDate(ctx.now)
  const out: RawEvent[] = []
  let parsed = 0
  for (const page of PAGES) {
    try {
      const res = await ctx.fetchText(`${BASE}${page}`)
      const showings = parsePage(res.text)
      parsed += showings.length
      out.push(...toEvents(showings, today))
    } catch (e) {
      console.warn(`mymovies: ${BASE}${page} failed: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  // A city with no film today is normal; nothing anywhere means the markup changed.
  if (!parsed) throw new Error('mymovies: no screening parsed on any page (markup changed?)')
  return out
}

export const mymovies: Adapter = {
  id: 'mymovies',
  name: 'MyMovies cinema Trentino',
  defaultCategory: 'cinema',
  maxRequests: PAGES.length + 2,
  mayBeEmpty: true,
  run,
}
