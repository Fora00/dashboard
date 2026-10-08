// Associazione Filarmonica di Rovereto (www.filarmonicarovereto.it): the
// city's chamber-music society — Stagione dei Concerti, Stagione Sinfonica,
// Preludio di Stagione, Musica in Biblioteca, family concerts. WordPress with
// Modern Events Calendar (MEC); robots.txt allows all (checked 2026-09-30).
// Not the Fondazione Filarmonica di Trento (that one comes via comune-trento).
//
// Three structured endpoints, no markup scraping:
// 1. `/events/feed/` — MEC's RSS: every UPCOMING occurrence with
//    mec:startDate/startHour/endDate/endHour/location/category, the full
//    content and the image. One request. It ignores `?paged=` and is probably
//    capped by WordPress's "posts per feed" (10 by default), which a freshly
//    published season (about 45 posts in 2025) would exceed. So:
// 2. `/wp-json/wp/v2/mec-events` (dates only in the title, "… | 03.10.2026")
//    lists recent posts; the upcoming ones the RSS left out are read one by
//    one from:
// 3. `/?method=ical&id=<post id>` — MEC's per-event iCal (DTSTART/DTEND with
//    TZID, LOCATION, CATEGORIES, URL, ATTACH image).
// The feeds give only a street address; the venue name ("Auditorium Fausto
// Melotti") is in the MEC JSON-LD of the event page, read once per distinct
// address.
//
// School concerts ("Concerti per le scuole", weekday mornings) are dropped;
// "Concerti per le famiglie" goes to tagText and so to the `kids` tag.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { icalDate, parseIcal, unescapeText } from '../ical.ts'
import { addDays, dateToIso, localToIso, romeDate } from '../time.ts'
import { absUrl, cityFromAddress, decodeEntities, htmlToText } from '../text.ts'

const SITE = 'https://www.filarmonicarovereto.it'
const FEED = `${SITE}/events/feed/`
const REST = `${SITE}/wp-json/wp/v2/mec-events?per_page=100&orderby=date&order=desc&_fields=id,date,link,title`
const MAX_ICAL = 40
const MAX_VENUE_PAGES = 8

// Towns the Filarmonica plays in (Vallagarina, Brentonico, the odd Verona
// date); the address is "…, 38068 Rovereto TN" or just "piazzetta Scrinzi - Villa Lagarina".
const TOWNS = [
  'Rovereto',
  'Villa Lagarina',
  'Isera',
  'Calliano',
  'Volano',
  'Brentonico',
  'Mori',
  'Ala',
  'Avio',
  'Nomi',
  'Pomarolo',
  'Nogaredo',
  'Besenello',
  'Trento',
  'Riva del Garda',
  'Arco',
  'Verona',
]
const TOWN_RE = new RegExp(`\\b(${TOWNS.join('|')})\\b`, 'i')

function townOf(address: string): string {
  const hit = cityFromAddress(address) ?? address.match(TOWN_RE)?.[1]
  if (!hit) return 'Rovereto'
  return TOWNS.find((t) => t.toLowerCase() === hit.toLowerCase()) ?? hit
}

/**
 * "Preludio di Stagione – Camera 02 | 03.10.2026" → "Camera 02" (how Trentino
 * Cultura lists it, so dedup merges); "Risonanze – Villa Lagarina| 03.10.2026"
 * → "Risonanze – Villa Lagarina". The date suffix is only the post's label.
 */
export function cleanTitle(raw: string): string {
  return decodeEntities(raw)
    .replace(/\s*\|[^|]*\d{1,2}(?:\s*-\s*\d{1,2})?\.\d{1,2}\.\d{4}\s*$/, '')
    .replace(/^Preludio di Stagione\s*[–—-]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Last date in a post title ("| 29-30.01.2026" → 2026-01-30), or null. */
function titleDate(raw: string): string | null {
  const all = [...decodeEntities(raw).matchAll(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g)]
  const m = all[all.length - 1]
  return m ? `${m[3]}-${(m[2] ?? '').padStart(2, '0')}-${(m[1] ?? '').padStart(2, '0')}` : null
}

const isSchool = (cats: string) => /concerti per le scuole/i.test(cats) && !/stagione/i.test(cats)

/** Page builder / WPBakery noise: shortcodes and the "INFO BIGLIETTI" button. */
function cleanBody(html: string): string {
  return html.replace(/<a[^>]*vc_btn3[\s\S]*?<\/a>/gi, ' ').replace(/\[\/?[a-z_]+(?:\s[^\]]*)?\]/gi, ' ')
}

function tag(item: string, name: string): string {
  const m = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))
  return m?.[1]?.trim() ?? ''
}

interface Draft extends Omit<RawEvent, 'venue'> {
  address: string
  page: string
}

function fromFeed(xml: string): Map<string, Draft[]> {
  const byPost = new Map<string, Draft[]>()
  for (const item of xml.split('<item>').slice(1)) {
    const post = tag(item, 'guid').match(/[?&](?:amp;|#038;)?p=(\d+)/)?.[1]
    const day = tag(item, 'mec:startDate')
    const cats = decodeEntities(tag(item, 'mec:category'))
    if (!post || !/^\d{4}-\d{2}-\d{2}$/.test(day) || isSchool(cats)) continue
    const hour = tag(item, 'mec:startHour')
    const endDay = tag(item, 'mec:endDate') || day
    const endHour = tag(item, 'mec:endHour')
    const timed = /^\d{1,2}:\d{2}$/.test(hour)
    const start = timed ? localToIso(day, hour) : dateToIso(day)
    const end = timed
      ? /^\d{1,2}:\d{2}$/.test(endHour)
        ? localToIso(endDay, endHour)
        : null
      : dateToIso(endDay < day ? day : endDay)
    const link = decodeEntities(tag(item, 'link'))
    const address = decodeEntities(tag(item, 'mec:location'))
    const d: Draft = {
      nativeId: `${post}@${day}`,
      seriesKey: post,
      title: cleanTitle(tag(item, 'title')),
      start,
      end,
      allDay: !timed,
      city: townOf(address),
      url: absUrl(link, SITE) ?? `${SITE}/events/`,
      description: cleanBody(tag(item, 'content:encoded')),
      image: absUrl(tag(item, 'description').match(/<img[^>]*src="([^"]+)"/)?.[1], SITE),
      tagText: cats.replace(/,\s*/g, ' · '),
      address,
      page: link.replace(/\?.*$/, ''),
    }
    byPost.set(post, [...(byPost.get(post) ?? []), d])
  }
  return byPost
}

async function fromIcal(ctx: AdapterContext, post: string, link: string): Promise<Draft[]> {
  const { text } = await ctx.fetchText(`${SITE}/?method=ical&id=${post}`)
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error(`iCal export for post ${post} is not iCal (markup changed?)`)
  const out: Draft[] = []
  for (const ev of parseIcal(text)) {
    const s = icalDate(ev.DTSTART)
    if (!s) continue
    const cats = unescapeText(ev.CATEGORIES?.value ?? '')
    if (isSchool(cats)) continue
    const dtEnd = icalDate(ev.DTEND)
    // MEC fills a default end when none was entered (a 09:30 family concert
    // "ending" at 22:00); the RSS leaves those empty. Trust at most 4 hours.
    const e = dtEnd && (s.allDay || Date.parse(dtEnd.iso) - Date.parse(s.iso) <= 4 * 3_600_000) ? dtEnd : null
    const address = unescapeText(ev.LOCATION?.value ?? '')
    const url = absUrl(ev.URL?.value, SITE) ?? link
    out.push({
      nativeId: `${post}@${s.date}`,
      seriesKey: post,
      title: cleanTitle(unescapeText(ev.SUMMARY?.value ?? '')),
      start: s.iso,
      // All-day DTEND is exclusive in iCal → our inclusive last day.
      end: s.allDay
        ? dateToIso(e ? (addDays(e.date, -1) < s.date ? s.date : addDays(e.date, -1)) : s.date)
        : (e?.iso ?? null),
      allDay: s.allDay,
      city: townOf(address),
      url,
      description: cleanBody(unescapeText(ev.DESCRIPTION?.value ?? '')),
      image: ev.ATTACH && /^image\//i.test(ev.ATTACH.params.FMTTYPE ?? '') ? absUrl(ev.ATTACH.value, SITE) : null,
      tagText: cats.replace(/,\s*/g, ' · '),
      address,
      page: url.replace(/\?.*$/, ''),
    })
  }
  return out
}

/** MEC's own JSON-LD on the event page: `"location": { "@type": "Place", "name": "…" }`. */
async function venueName(ctx: AdapterContext, page: string): Promise<string | null> {
  const { text } = await ctx.fetchText(page)
  const m = text.match(/"@type"\s*:\s*"Place"\s*,\s*"name"\s*:\s*"([^"]*)"/)
  return m?.[1] ? htmlToText(decodeEntities(m[1])) || null : null
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const today = romeDate(ctx.now)
  const horizon = addDays(today, ctx.horizonDays)
  const { text: xml } = await ctx.fetchText(FEED)
  if (!xml.includes('<rss')) throw new Error('events feed is not RSS')
  const byPost = fromFeed(xml)

  // Upcoming posts the RSS did not carry (its item cap).
  const posts = await ctx.fetchJson<{ id: number; date?: string; link?: string; title?: { rendered?: string } }[]>(REST)
  const missing = posts.filter((p) => {
    if (byPost.has(String(p.id))) return false
    const d = titleDate(p.title?.rendered ?? '')
    // A post without a date in its title: only if published in the last ~10 months.
    if (!d) return !!p.date && p.date.slice(0, 10) >= addDays(today, -300)
    return d >= today && d <= horizon
  })
  for (const p of missing.slice(0, MAX_ICAL)) {
    const drafts = await fromIcal(ctx, String(p.id), p.link ?? `${SITE}/events/`)
    if (drafts.length) byPost.set(String(p.id), drafts)
  }

  const drafts = [...byPost.values()].flat()
  const venues = new Map<string, string | null>()
  for (const d of drafts) {
    if (!d.address || venues.has(d.address) || venues.size >= MAX_VENUE_PAGES) continue
    venues.set(d.address, await venueName(ctx, d.page).catch(() => null))
  }
  return drafts.map((d): RawEvent => ({
    nativeId: d.nativeId,
    ...(d.seriesKey ? { seriesKey: d.seriesKey } : {}),
    title: d.title,
    start: d.start,
    end: d.end,
    allDay: d.allDay,
    venue: venues.get(d.address) ?? null,
    city: d.city,
    url: d.url,
    description: d.description,
    image: d.image ?? null,
    ...(d.tagText ? { tagText: d.tagText } : {}),
  }))
}

export const filarmonica: Adapter = {
  id: 'filarmonica-rovereto',
  name: 'Filarmonica di Rovereto',
  defaultCategory: 'concerts',
  // Quiet between seasons (summer): 0 upcoming events is normal.
  mayBeEmpty: true,
  run,
}
