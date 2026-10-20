// Cinema screenings: the regular film programme of a hall, kept out of the
// event list and shown by day in the Cinema tab. Events that merely involve
// film (festivals, cineforums, talks, exhibitions, library evenings) stay events.
import type { EventItem } from './types'
import { isOver, localDay, romeDate } from './model'

/** Sources whose `cinema` records are a hall's programme; the rest (mart, libraries…) are events. */
const HALL_SOURCES = new Set(['supercinema', 'trentinospettacoli', 'cultura-trentino', 'pergine', 'mymovies'])
/** Tags that mark a film-related event rather than a plain screening. */
const EVENT_TAGS = ['talks', 'festivals', 'exhibitions']

/** A normal screening of the film programme (not a festival, talk or exhibition). */
export function isScreening(e: EventItem): boolean {
  if (e.category !== 'cinema' || !HALL_SOURCES.has(e.source) || e.allDay) return false
  // Supercinema titles pick up a spurious `talks` tag from synopses: it is always a hall.
  if (e.source === 'supercinema') return true
  return !e.tags.some((t) => EVENT_TAGS.includes(t))
}

/** Lowercase, accent-free, "Hen – Storia di una Gallina" → "hen": the same film across sources. */
export function filmKey(title: string): string {
  const head = title.split(/\s+[–—-]\s+/)[0] ?? title
  return head
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** The hall as shown: "Borgo Valsugana – Cineteatro…" → "Cineteatro…"; no venue → the city. */
export function hallName(e: Pick<EventItem, 'venue' | 'city'>): string {
  const v = (e.venue ?? '')
    .split(/\s+[–—]\s+/)
    .pop()
    ?.trim()
  return v || e.city
}

export interface Showing {
  city: string
  hall: string
  /** "HH:MM" local times, ascending; empty when the source gives only the day. */
  times: string[]
}

export interface Film {
  key: string
  title: string
  url: string | null
  /** The fullest description across sources (may carry stray markup: strip before showing). */
  description: string
  image: string | null
  /** The first record of the day: the one marks and likes attach to. */
  event: EventItem
  showings: Showing[]
}

const timeOf = (iso: string): string | null => {
  const t = iso.slice(11, 16)
  return t && t !== '00:00' ? t : null
}

/** The upcoming screenings of a list, ordered by start. */
export function upcomingScreenings(events: readonly EventItem[], now: number): EventItem[] {
  return events
    .filter((e) => isScreening(e) && !isOver(e, now))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
}

/** Local days (YYYY-MM-DD) that have at least one screening, ascending. */
export function screeningDays(screenings: readonly EventItem[]): string[] {
  return [...new Set(screenings.map((e) => localDay(e.start)))].sort()
}

/**
 * The films of one day: one entry per film (title shortest across sources),
 * with one showing per town. Duplicates across sources collapse; a day-only
 * record is dropped when the same film and town has timed ones that day.
 * Showings already over (today) are left out.
 */
export function filmsOn(
  screenings: readonly EventItem[],
  day: string,
  now: number,
  city: string | null = null,
): Film[] {
  const today = romeDate(now)
  const films = new Map<string, Film & { rows: Map<string, Showing> }>()
  // Film + town pairs with a timed record that day (even one already over).
  const timed = new Set(
    screenings
      .filter((e) => localDay(e.start) === day && timeOf(e.start))
      .map((e) => `${filmKey(e.title)}|${e.city}|${e.city === 'Trento' ? hallName(e) : ''}`),
  )
  for (const e of screenings) {
    if (localDay(e.start) !== day || (city && e.city !== city)) continue
    const t = timeOf(e.start)
    if (!t && timed.has(`${filmKey(e.title)}|${e.city}|${e.city === 'Trento' ? hallName(e) : ''}`)) continue
    if (day === today && t && Date.parse(e.start) + 3 * 3_600_000 < now) continue
    const key = filmKey(e.title)
    if (!key) continue
    let film = films.get(key)
    if (!film) {
      film = { key, title: e.title, url: null, description: '', image: null, event: e, showings: [], rows: new Map() }
      films.set(key, film)
    }
    if (e.title.length < film.title.length) film.title = e.title
    film.url ??= e.url
    const text = e.description || e.summary
    if (text.length > film.description.length) film.description = text
    // Supercinema's picture is its logo, not the film.
    if (e.source !== 'supercinema') film.image ??= e.image
    // One row per town; Trento has several halls (Modena, Vittoria, HarpoLab), each its own row.
    const rowKey = e.city === 'Trento' ? `${e.city}|${hallName(e)}` : e.city
    const row = film.rows.get(rowKey) ?? {
      city: e.city,
      hall: hallName(e),
      times: [],
    }
    if (t && !row.times.includes(t)) row.times.push(t)
    film.rows.set(rowKey, row)
  }
  return [...films.values()]
    .map(({ rows, ...film }) => ({
      ...film,
      showings: [...rows.values()]
        .map((s) => ({ ...s, times: [...s.times].sort() }))
        .sort((a, b) => (a.times[0] ?? '99').localeCompare(b.times[0] ?? '99') || a.city.localeCompare(b.city)),
    }))
    .filter((f) => f.showings.length > 0)
    .sort(
      (a, b) =>
        (a.showings[0]?.times[0] ?? '99').localeCompare(b.showings[0]?.times[0] ?? '99') ||
        a.title.localeCompare(b.title),
    )
}
