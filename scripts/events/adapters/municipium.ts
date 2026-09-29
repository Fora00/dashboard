// Municipium (Maggioli) comune sites, AGID "bootstrap-italia" templates
// (Brescia, Mantova; also Bardolino, Garda, Peschiera). No API, feed or
// Event JSON-LD (the RSS has only the last 5 items, without dates), so the
// HTML listing `/it/eventi?page=N` is read: 15 cards per page, only current
// and future events, stop at the first page without cards. robots.txt:
// `Allow: /` on the sites checked 2026-09-29.
//
// Card: `<span class="card-pretitle">1 ottobre 2026</span>` or
// "Da 28 settembre 2026 <br/> a 2 ottobre 2026"; the comune's typology in
// `.category` ("Spettacolo teatrale", "Mostra", "Manifestazione musicale"…);
// title + link in `a[data-element=event-link]`; `.card-text` short text;
// topic chips; a protocol-relative image. No times on the listing: events
// are all-day.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import type { AreaId, Ring } from '../areas.ts'
import { dateToIso } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, normalize } from '../text.ts'

export interface MunicipiumConfig {
  id: string
  name: string
  /** e.g. 'www.comune.mantova.it' */
  host: string
  city: string
  area?: AreaId
  ring?: Ring
  maxPages?: number
}

const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

/** Typology label (normalised) → category, where it is unambiguous. */
const TYPE_HINT: [RegExp, CategoryId][] = [
  [/^spettacolo teatrale|^spettacolo di danza|^teatro/, 'theatre'],
  [/^mostra|^esposizione/, 'exhibitions'],
  [/^manifestazione musicale|^concerto/, 'concerts'],
  [/^proiezione/, 'cinema'],
  [/^dibattito|^conferenza|^presentazione/, 'talks'],
  [/^festival|^fiera|^sagra/, 'festivals'],
]

function parseDate(text: string): string | null {
  const m = normalize(text).match(/(\d{1,2}) ([a-z]+) (\d{4})/)
  const month = m ? MONTHS.indexOf(m[2] ?? '') : -1
  if (!m || month < 0) return null
  return `${m[3]}-${String(month + 1).padStart(2, '0')}-${(m[1] ?? '').padStart(2, '0')}`
}

export function municipium(cfg: MunicipiumConfig): Adapter {
  const base = `https://${cfg.host}`
  async function run(ctx: AdapterContext): Promise<RawEvent[]> {
    const out = new Map<string, RawEvent>()
    for (let page = 1; page <= (cfg.maxPages ?? 10); page++) {
      const { text } = await ctx.fetchText(`${base}/it/eventi?page=${page}`)
      const cards = text.split('<article class="card-wrapper').slice(1)
      let fresh = 0
      for (const card of cards) {
        const link = card.match(/<a[^>]*data-element="event-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
        const pre = card.match(/card-pretitle">([\s\S]*?)<\/span>/)?.[1] ?? ''
        if (!link) continue
        const url = absUrl(decodeEntities(link[1] ?? ''), base)
        const title = htmlToText(link[2] ?? '')
        if (!url || !title || out.has(url)) continue
        const [fromText = '', toText = ''] = pre.split(/<br\s*\/?>/i)
        const first = parseDate(fromText)
        if (!first) continue
        const last = (toText && parseDate(toText)) || first
        const type = htmlToText(card.match(/<div class="category[^"]*">([\s\S]*?)<\/div>/)?.[1] ?? '')
        const topics = [...card.matchAll(/chip-label">([^<]*)</g)].map((m) => htmlToText(m[1] ?? ''))
        const summary = htmlToText(card.match(/<p class="card-text">([\s\S]*?)<\/p>/)?.[1] ?? '')
        const img = card.match(/<img[^>]*src="([^"]+)"/)?.[1]
        const hint = TYPE_HINT.find(([re]) => re.test(normalize(type)))?.[1]
        out.set(url, {
          nativeId: url,
          title,
          start: dateToIso(first),
          end: dateToIso(last < first ? first : last),
          allDay: true,
          venue: null,
          city: cfg.city,
          url,
          description: summary,
          summary,
          image: img ? absUrl(decodeEntities(img.startsWith('//') ? `https:${img}` : img), base) : null,
          ...(hint ? { categoryHint: hint } : {}),
          tagText: [type, ...topics].filter(Boolean).join(' · '),
        })
        fresh++
      }
      if (fresh === 0) break
    }
    return [...out.values()]
  }
  const adapter: Adapter = { id: cfg.id, name: cfg.name, defaultCategory: 'other', run }
  if (cfg.area) adapter.area = cfg.area
  if (cfg.ring) adapter.ring = cfg.ring
  return adapter
}
