// Infinity Boulder (Mattarello, Trento): the gym's own events (contests,
// Babbo Blocco, Climb Till Death…). WordPress custom post type `evento`: the
// REST list gives title, link and a Yoast image; the date exists only in the
// page ("Data evento: dd/mm/yyyy"), so each event costs one page fetch.
// robots.txt allows everything (checked 2026-10-01). Few events a year, and
// often none upcoming, hence mayBeEmpty. Dates only, no time of day: all-day.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { decodeEntities } from '../text.ts'
import { dateToIso } from '../time.ts'

const BASE = 'https://infinityboulder.it'

interface IbPost {
  id: number
  link: string
  title?: { rendered?: string }
  yoast_head_json?: { og_image?: { url?: string }[] }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const posts = await ctx.fetchJson<IbPost[]>(
    `${BASE}/wp-json/wp/v2/evento?per_page=100&_fields=id,link,title,yoast_head_json`,
  )
  const out: RawEvent[] = []
  for (const p of posts) {
    const title = decodeEntities(p.title?.rendered ?? '').trim()
    if (!title) continue
    const { text: html } = await ctx.fetchText(p.link)
    const m = /Data evento:\s*(\d{2})\/(\d{2})\/(\d{4})/.exec(html)
    if (!m) continue
    const date = `${m[3]}-${m[2]}-${m[1]}`
    const body = /<div class="paragraph">\s*<h1>[\s\S]*?<\/h1>([\s\S]*?)<div class="gallery/.exec(html)?.[1] ?? ''
    out.push({
      nativeId: String(p.id),
      title,
      start: dateToIso(date),
      end: null,
      allDay: true,
      venue: 'Infinity Boulder',
      city: 'Mattarello',
      url: p.link,
      description: body,
      image: p.yoast_head_json?.og_image?.[0]?.url ?? null,
      categoryHint: 'outdoor',
    })
  }
  return out
}

export const infinityboulder: Adapter = {
  id: 'infinityboulder',
  name: 'Infinity Boulder',
  defaultCategory: 'outdoor',
  mayBeEmpty: true,
  maxRequests: 40,
  run,
}
