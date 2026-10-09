// Trentino Spettacoli (www.trentinospettacoli.it): the shared box office and
// listing of the Trentino theatre circuit — shows, "teatro ragazzi" and film
// screenings in small-town theatres. WordPress; robots.txt allows all.
//
// The /eventi/ page lists every upcoming event as schema.org Event microdata
// (itemprop name / url / startDate / location / image) in one request. The
// custom post type `eventi` in the REST API has no dates, but it gives each
// event's categories (Spettacoli / Teatro ragazzi / Cinema), read in 2–3 more
// requests to tag children's shows and screenings.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { matchCategories } from '../tags.ts'
import { normalizeIso } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, normalize } from '../text.ts'

const SITE = 'https://www.trentinospettacoli.it'
const LISTING = `${SITE}/eventi/`
const REST = `${SITE}/wp-json/wp/v2`

interface WpEvent {
  link?: string
  categorie_eventi?: number[]
}
interface WpTerm {
  id: number
  name: string
  slug: string
}

function attr(block: string, re: RegExp): string | null {
  const m = block.match(re)
  return m?.[1] ? decodeEntities(m[1]).trim() : null
}

export async function categoriesByLink(ctx: AdapterContext): Promise<Map<string, string[]>> {
  const terms = await ctx.fetchJson<WpTerm[]>(`${REST}/categorie_eventi?per_page=100&_fields=id,name,slug`)
  const name = new Map(terms.map((t) => [t.id, t.name]))
  const out = new Map<string, string[]>()
  for (let page = 1; page <= 5; page++) {
    let items: WpEvent[]
    try {
      items = await ctx.fetchJson<WpEvent[]>(`${REST}/eventi?per_page=100&page=${page}&_fields=link,categorie_eventi`)
    } catch (err) {
      // WordPress answers a page past the end with HTTP 400 (rest_post_invalid_page_number):
      // when the last full page held exactly N*100 events that is the normal end, not a failure.
      if (page > 1 && err instanceof Error && /^HTTP 400\b/.test(err.message)) break
      throw err
    }
    for (const it of items) {
      if (it.link) out.set(it.link, (it.categorie_eventi ?? []).map((id) => name.get(id) ?? '').filter(Boolean))
    }
    if (items.length < 100) break
  }
  return out
}

const WHEN = new Intl.DateTimeFormat('it-IT', {
  timeZone: 'Europe/Rome',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * The same film is listed once per screening and per town ("Coyote vs. Acme"
 * ×10, "The Invite" with and without its subtitle). One record per film and
 * town instead: the next screening as start, all of them in the description,
 * the count in `occurrences`. The daily crawl moves "next" along.
 */
export function foldScreenings(events: RawEvent[]): RawEvent[] {
  const groups = new Map<string, RawEvent[]>()
  const out: RawEvent[] = []
  for (const e of events) {
    if (e.categoryHint !== 'cinema') {
      out.push(e)
      continue
    }
    // "The Invite – Il Piacere è tutto nostro" and "The Invite" are one film.
    const film = normalize(e.title.split(/\s+[–-]\s+/)[0] ?? e.title)
    const key = `${film}|${normalize(e.city)}`
    const g = groups.get(key)
    if (g) g.push(e)
    else groups.set(key, [e])
  }
  for (const [key, g] of groups) {
    g.sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
    const first = g[0] as RawEvent
    // The longer title carries the subtitle ("Tony – Diario di un Giovane Cuoco").
    const title = g.reduce((t, e) => (e.title.length > t.length ? e.title : t), first.title)
    out.push({
      ...first,
      nativeId: `film:${key}`,
      title,
      description:
        g.length > 1 ? `Proiezioni: ${g.map((e) => WHEN.format(new Date(e.start))).join(' · ')}` : first.description,
      occurrences: g.length,
    })
  }
  return out
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(LISTING)
  const cards = text
    .split(/<article\b/)
    .slice(1)
    .filter((c) => c.includes('schema.org/Event'))
  if (!cards.length) throw new Error('no schema.org Event cards on /eventi/ (markup changed?)')
  const cats = await categoriesByLink(ctx)
  const out: RawEvent[] = []
  for (const card of cards) {
    const url = absUrl(attr(card, /class="event-card__title"[\s\S]*?href="([^"]+)"/), SITE)
    const title = htmlToText(attr(card, /class="event-card__title"[\s\S]*?itemprop="name">([\s\S]*?)<\/span>/))
    const start = normalizeIso(attr(card, /itemprop="startDate"\s+datetime="([^"]+)"/))
    if (!url || !title || !start) continue
    const venue = htmlToText(attr(card, /event-card__location[\s\S]*?itemprop="name">([\s\S]*?)<\/span>/)) || null
    // Tags: "comune-…" / "teatro-…" are venue tags; the rest are series ("paesaggi sonori").
    const tags = [...card.matchAll(/href="[^"]*\/tag_eventi\/([^/"]+)\/?"[^>]*>([^<]*)</g)]
    const town = tags.find((t) => t[1]?.startsWith('comune-'))?.[2]?.trim()
    const series = tags
      .filter((t) => !/^(comune|teatro)-/.test(t[1] ?? ''))
      .map((t) => decodeEntities(t[2] ?? '').trim())
    const categories = cats.get(url) ?? []
    const tagText = [...categories, ...series].join(' · ')
    // "Vallelaghi – Teatro Valle dei Laghi": the town leads the venue name.
    const city = town || venue?.split(/\s+[–-]\s+/)[0]?.trim() || 'Trentino'
    const isCinema = categories.includes('Cinema')
    // "Spettacoli" with no keyword in the title (a name, a band) is a stage show.
    const hint = isCinema ? 'cinema' : matchCategories(title, series.join(' ')).length ? undefined : 'theatre'
    out.push({
      nativeId: url,
      title,
      start,
      end: null,
      allDay: false,
      venue,
      city,
      url,
      description: '',
      image: absUrl(
        attr(card, /data-src="([^"]+)"[^>]*itemprop="image"/) ?? attr(card, /itemprop="image"[^>]*data-src="([^"]+)"/),
        SITE,
      ),
      tagText,
      ...(hint ? { categoryHint: hint } : {}),
    })
  }
  return foldScreenings(out)
}

export const trentinospettacoli: Adapter = {
  id: 'trentinospettacoli',
  name: 'Trentino Spettacoli',
  defaultCategory: 'other',
  maxRequests: 10,
  run,
}
