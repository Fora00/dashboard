// Libreria Arcadia Ubik (Rovereto): an independent bookshop that runs about 160
// author evenings a year. WordPress; every event is a post in the "Eventi"
// category (id 4) whose TITLE carries the schedule and no year:
//   "VENERDÌ 2 OTTOBRE, ORE 19:00 ANDREA GENZONE PRESENTA “TITOLO”"
// The post's own publish date is unreliable (posts for Oct 2026 are dated
// 2024-25), so the year comes from the weekday: the one date in
// [today, horizon] that is really a Friday. robots.txt allows all (checked
// 2026-10-01). One REST request, no scraping.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { addDays, dateToIso, localToIso, parseYmd, romeDate } from '../time.ts'
import { absUrl, decodeEntities, htmlToText, titleCase } from '../text.ts'

const SITE = 'https://www.libreriarcadia.com'
const REST = `${SITE}/wp-json/wp/v2/posts?categories=4&per_page=100&orderby=date&order=desc&_fields=id,link,title,content`
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']
const WEEKDAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato']
const SHOP = { venue: 'Libreria Arcadia', city: 'Rovereto' }

const pad = (n: number | string) => String(n).padStart(2, '0')
const weekday = (ymd: string): number => {
  const [y, m, d] = parseYmd(ymd)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** The date in [from, to] with this day, month and weekday, or null. */
export function resolveDate(day: number, month: number, wd: number, from: string, to: string): string | null {
  const y0 = Number(from.slice(0, 4))
  for (const y of [y0, y0 + 1]) {
    const ymd = `${y}-${pad(month + 1)}-${pad(day)}`
    if (ymd >= from && ymd <= to && weekday(ymd) === wd) return ymd
  }
  return null
}

/**
 * "VENERDÌ 2 OTTOBRE, ORE 19:00 ANDREA … PRESENTA “X”" → date, time and the
 * rest. The comma and the "ORE" position vary ("VENERDÌ 25 SETTEMBRE ORE 19:00,").
 */
export function parseTitle(raw: string): { wd: number; day: number; month: number; time: string | null; rest: string } | null {
  const t = decodeEntities(raw).replace(/\s+/g, ' ').trim()
  const m = /^([A-Za-zÀ-ÿ]+)\s+(\d{1,2})\s+([A-Za-z]+)\s*,?\s*(?:ORE\s+(\d{1,2})[:.](\d{2}))?\s*,?\s*(.*)$/i.exec(t)
  const wd = WEEKDAYS.indexOf((m?.[1] ?? '').toLowerCase())
  const month = MONTHS.indexOf((m?.[3] ?? '').toLowerCase())
  if (!m || wd < 0 || month < 0) return null
  return { wd, day: Number(m[2]), month, time: m[4] ? `${pad(m[4])}:${m[5]}` : null, rest: m[6] ?? '' }
}

/** titleCase leaves "Presenta" and "Dell'Arrivederci"; undo both. */
const tidyCaps = (s: string): string =>
  s.replace(/\bPresenta\b/, 'presenta').replace(/(['’])([A-Z])/g, (_, q: string, c: string) => q + c.toLowerCase())

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const from = romeDate(ctx.now)
  const to = addDays(from, ctx.horizonDays)
  const posts = await ctx.fetchJson<{ id: number; link?: string; title?: { rendered?: string }; content?: { rendered?: string } }[]>(REST)
  const out: RawEvent[] = []
  for (const p of posts) {
    const t = parseTitle(p.title?.rendered ?? '')
    const day = t && resolveDate(t.day, t.month, t.wd, from, to)
    if (!t || !day || !p.link) continue
    // "… – ALLA SALA KENNEDY DELL'URBAN CENTER" / "ALLA SALA ZENI DEL MUSEO CIVICO": off-site evenings.
    const where = /\b(?:ALLA|NELLA|AL)\s+(SALA\s+[A-Z]+)\s+(?:DELL['’]|DEL\s+)(URBAN CENTER|MUSEO CIVICO)/i.exec(t.rest)
    const venue = where ? titleCase(`${where[1]} · ${where[2]}`) : SHOP.venue
    const title = t.rest
      .replace(/\s*[–—-]?\s*\b(?:ALLA|NELLA|AL)\s+SALA\s+[A-Z]+\s+(?:DELL['’]|DEL\s+)(?:URBAN CENTER|MUSEO CIVICO)\s*[–—-]?\s*$/i, '')
      .trim()
    const html = p.content?.rendered ?? ''
    const img = /<img[^>]*\ssrc="([^"]+)"/.exec(html)?.[1]
    out.push({
      nativeId: `${p.id}@${day}`,
      title: title === title.toUpperCase() ? tidyCaps(titleCase(title)) : title,
      start: t.time ? localToIso(day, t.time) : dateToIso(day),
      end: null,
      allDay: !t.time,
      venue,
      city: SHOP.city,
      url: absUrl(p.link, SITE) ?? SITE,
      description: htmlToText(html.replace(/<figure[\s\S]*?<\/figure>/gi, ' ')),
      image: absUrl(img ? decodeEntities(img) : null, SITE),
      // Author evenings and book presentations are talks, not "other".
      tagText: 'presentazione libro incontro con l’autore',
    })
  }
  return out
}

export const arcadia: Adapter = {
  id: 'arcadia',
  name: 'Libreria Arcadia (Rovereto)',
  defaultCategory: 'talks',
  mayBeEmpty: true,
  maxRequests: 2,
  run,
}
