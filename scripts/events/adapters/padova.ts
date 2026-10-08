// Padova (ring 2, interests only): the municipal agenda of www.comune.padova.it,
// a decoupled Drupal whose Angular front end reads JSON:API at /api/events.
// robots.txt only disallows /page-not-found (checked 2026-09-29).
//
// Date filters take UNIX SECONDS (ISO values are silently mis-compared; the
// site's own getEvents() does the same). Each event lists its dates in
// `event_date` (UTC); an all-day date is stored as local midnight → 23:59
// (local 00:00 → 23:59). Every date in the window is one occurrence;
// long series fold in the pipeline. `event_type` (Mostre, Musica, Teatro e
// danza…) feeds tags; images are media relations only (not fetched).
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { dateToIso, instantToIso } from '../time.ts'

const BASE = 'https://www.comune.padova.it'
const PAGE = 50

interface DateDelta {
  value?: string
  end_value?: string
  duration?: number
}
interface Term {
  name?: string
}
interface Place {
  title?: string
}
interface PdEvent {
  drupal_internal__nid?: number
  title?: string
  path?: { alias?: string }
  event_date?: DateDelta[]
  field_text_date?: string | null
  event_short_description?: string | null
  event_description?: { value?: string } | null
  event_type?: Term | Term[] | null
  event_place?: Place[] | Place | null
}
interface PdPage {
  data?: PdEvent[]
  links?: { next?: { href?: string } }
}

const TYPE_HINT: Record<string, CategoryId> = {
  Mostre: 'exhibitions',
  'Teatro e danza': 'theatre',
  Musica: 'concerts',
}

const list = <T>(v: T | T[] | null | undefined): T[] => (Array.isArray(v) ? v : v ? [v] : [])

function occurrence(d: DateDelta): { start: string; end: string | null; allDay: boolean } | null {
  const from = d.value ? Date.parse(d.value) : NaN
  if (Number.isNaN(from)) return null
  const to = d.end_value ? Date.parse(d.end_value) : NaN
  const start = instantToIso(from)
  const stop = Number.isNaN(to) ? null : instantToIso(to)
  // Local 00:00 → 23:59 (compared on the wall clock: a span across a DST
  // change is an hour off in `duration`).
  const allDay = start.slice(11, 16) === '00:00' && (!stop || stop.slice(11, 16) === '23:59')
  if (allDay) {
    return { start: dateToIso(start.slice(0, 10)), end: dateToIso((stop ?? start).slice(0, 10)), allDay }
  }
  return { start, end: stop && to > from ? stop : null, allDay }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const now = Math.floor(ctx.now / 1000)
  const until = now + ctx.horizonDays * 86_400
  const q = new URLSearchParams({
    'filter[status][value]': '1',
    'filter[a][condition][path]': 'event_date.value',
    'filter[a][condition][operator]': '<=',
    'filter[a][condition][value]': String(until),
    'filter[b][condition][path]': 'event_date.end_value',
    'filter[b][condition][operator]': '>=',
    'filter[b][condition][value]': String(now),
    sort: 'event_date.value',
    'page[limit]': String(PAGE),
    include: 'event_type,event_place',
    jsonapi_include: '1',
    'fields[event]':
      'drupal_internal__nid,title,path,event_date,field_text_date,event_short_description,event_description,event_type,event_place',
  })
  let url: string | null = `${BASE}/api/events?${q}`
  const out: RawEvent[] = []
  for (let i = 0; url && i < 10; i++) {
    const res: PdPage = await ctx.fetchJson<PdPage>(url)
    if (!res || !Array.isArray(res.data)) throw new Error('no data array in the events API response (API changed?)')
    for (const ev of res.data ?? []) {
      const title = ev.title?.trim()
      if (!title || !ev.drupal_internal__nid) continue
      const types = list(ev.event_type)
        .map((t) => t.name)
        .filter((n): n is string => Boolean(n))
      const venue =
        list(ev.event_place)
          .map((p) => p.title)
          .find((t) => t && t !== 'Città di Padova') ?? null
      const hint = types.map((t) => TYPE_HINT[t]).find(Boolean)
      const short = ev.event_short_description?.trim() ?? ''
      const summary = [ev.field_text_date?.trim(), short].filter(Boolean).join(' · ')
      for (const d of ev.event_date ?? []) {
        const o = occurrence(d)
        if (!o) continue
        out.push({
          nativeId: `${ev.drupal_internal__nid}@${o.start}`,
          seriesKey: String(ev.drupal_internal__nid),
          title,
          ...o,
          venue,
          city: 'Padova',
          url: ev.path?.alias ? `${BASE}${ev.path.alias}` : `${BASE}/node/${ev.drupal_internal__nid}`,
          description: ev.event_description?.value || short,
          summary,
          ...(hint ? { categoryHint: hint } : {}),
          tagText: types.join(' · '),
        })
      }
    }
    // `links.next` comes back as http://; stay on https.
    const next = res.links?.next?.href
    url = next ? next.replace(/^http:\/\//, 'https://') : null
  }
  return out
}

export const padova: Adapter = {
  id: 'padova',
  name: 'Comune di Padova',
  defaultCategory: 'other',
  area: 'veneto',
  ring: 'near',
  // Theatre is out of the near ring, so a quiet stretch with no concerts/talks is normal.
  // A changed markup still throws inside run().
  mayBeEmpty: true,
  run,
}
