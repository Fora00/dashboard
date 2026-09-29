// OpenPA (eZ Publish "opendata") adapter factory. Two endpoints, chosen per
// host by what its robots.txt allows (checked 2026-09-29):
//
// - mode 'search':   /opendata/api/content/search/<query>
//   Legacy `event` class with from_time/to_time. The query filters the future
//   server-side (`to_time range [now,*]`), so the big archives (Rovereto has
//   ~1,900 events) are never paginated. Used where the calendar environment
//   is not configured: bibcom.trento.it, eventi.comune.rovereto.tn.it.
//
// - mode 'calendar': /opendata/api/calendar/search/<query>?start=…&end=…
//   The only opendata path `Allow`ed on hosts that disallow /api/ and
//   /opendata (www.comune.trento.it, trentogiovani.it, www.comune.verona.it).
//   It returns one item per OCCURRENCE (recurrences expanded server-side) in
//   FullCalendar shape; all-day `end` is exclusive. Requested in 30-day chunks.
//   The nested time_interval.recurrences carry wrong offsets on some hosts,
//   so only the top-level start/end are used.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { addDays, normalizeIso, romeDate } from '../time.ts'
import { absUrl, cityFromAddress, firstNonEmpty, htmlToText } from '../text.ts'

export interface OpenPaConfig {
  id: string
  name: string
  /** Host serving the API, e.g. 'bibcom.trento.it'. */
  host: string
  mode: 'search' | 'calendar'
  /** OpenPA class list, e.g. '[event]' or '[event_link]'. */
  classes: string
  city: string
  /** Always use `city` (e.g. a library system whose branches are all in one municipality). */
  fixedCity?: boolean
  /** Source-specific title noise to strip, so dedup can match other sources. */
  titlePrefix?: RegExp
  defaultCategory?: CategoryId
  mayBeEmpty?: boolean
  maxRequests?: number
}

const PAGE = 100
const CHUNK_DAYS = 30

type Json = Record<string, unknown>

function asObj(v: unknown): Json | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : null
}

/** Localised field: { 'ita-IT': x } → x; plain values pass through. */
function loc(v: unknown): unknown {
  const o = asObj(v)
  if (o && ('ita-IT' in o || 'eng-GB' in o || 'ger-DE' in o)) return o['ita-IT'] ?? Object.values(o)[0]
  return v
}

/** Names out of relation lists / tag lists / plain strings. */
function names(v: unknown): string[] {
  if (typeof v === 'string') return v.trim() ? [v.trim()] : []
  if (Array.isArray(v)) return v.flatMap(names)
  const o = asObj(v)
  if (!o) return []
  const n = loc(o.name)
  return typeof n === 'string' && n.trim() ? [n.trim()] : []
}

function addresses(v: unknown): string[] {
  if (Array.isArray(v)) return v.flatMap(addresses)
  const o = asObj(v)
  if (!o) return []
  return typeof o.address === 'string' && o.address ? [o.address] : []
}

function langData(content: unknown): Json {
  const data = asObj(asObj(content)?.data)
  if (!data) return {}
  return asObj(data['ita-IT']) ?? asObj(Object.values(data)[0]) ?? {}
}

/** Direct image URLs (`{ url }` objects); relation-only images (just an object id) are skipped. */
function imageUrl(d: Json, host: string): string | null {
  for (const k of ['image', 'virtual_image', 'images']) {
    const v = d[k]
    for (const cand of Array.isArray(v) ? v : [v]) {
      const url = asObj(cand)?.url
      if (typeof url === 'string') {
        const abs = absUrl(url, `https://${host}/`)
        if (abs) return abs
      }
    }
  }
  return null
}

/** Venue, city, texts, image and tag text from an OpenPA data block (any class). */
function extract(d: Json, cfg: OpenPaConfig) {
  const places = ['takes_place_in', 'virtual_takes_place_in', 'site', 'luogo', 'luogo_svolgimento']
  const venue = places.flatMap((k) => names(d[k]))[0] ?? (typeof d.presso === 'string' ? d.presso : null) ?? null
  const addr = [...places.flatMap((k) => addresses(d[k])), ...addresses(d.geo), ...addresses(d.gps)]
  const city = cfg.fixedCity ? cfg.city : addr.map(cityFromAddress).find(Boolean) ?? cfg.city
  const abstract = firstNonEmpty(d.event_abstract as string, d.abstract as string)
  const full = firstNonEmpty(d.description as string, d.text as string)
  const tagText = [
    'has_public_event_typology', 'virtual_has_public_event_typology', 'tipo_evento', 'tipologia',
    'topics', 'virtual_topic', 'materia', 'argomento',
  ].flatMap((k) => names(d[k])).join(' · ')
  return {
    venue,
    city,
    // Full text when there is one; else the abstract serves as both.
    description: full || abstract,
    summary: htmlToText(abstract || full),
    image: imageUrl(d, cfg.host),
    tagText,
  }
}

function cleanTitle(title: string, cfg: OpenPaConfig): string {
  const t = title.replace(/\s+/g, ' ').trim()
  return cfg.titlePrefix ? t.replace(cfg.titlePrefix, '').trim() || t : t
}

/** A legacy event whose times are both local midnight is treated as all-day. */
function isMidnight(iso: string): boolean {
  return iso.slice(11, 19) === '00:00:00'
}

async function runSearch(cfg: OpenPaConfig, ctx: AdapterContext): Promise<RawEvent[]> {
  const horizon = addDays(romeDate(ctx.now), ctx.horizonDays)
  const out: RawEvent[] = []
  for (let offset = 0; ; offset += PAGE) {
    const q = `classes ${cfg.classes} and to_time range [now,*] and from_time range [*,${horizon}] sort [from_time=>asc] limit ${PAGE} offset ${offset}`
    const res = await ctx.fetchJson<{ totalCount?: number; searchHits?: Json[]; error_message?: string }>(
      `https://${cfg.host}/opendata/api/content/search/${encodeURIComponent(q)}`,
    )
    if (res.error_message) throw new Error(`OpenPA: ${res.error_message}`)
    const hits = res.searchHits ?? []
    for (const hit of hits) {
      const meta = asObj(hit.metadata) ?? {}
      const d = langData(hit)
      const start = normalizeIso(d.from_time as string)
      if (!start) continue
      let end = normalizeIso(d.to_time as string)
      const allDay = isMidnight(start) && (!end || isMidnight(end) || end.slice(11, 16) === '23:59')
      if (allDay && end) end = normalizeIso(end.slice(0, 10))
      const title = cleanTitle(firstNonEmpty(d.titolo as string, loc(meta.name) as string), cfg)
      const x = extract(d, cfg)
      out.push({
        nativeId: String(meta.id),
        title,
        start,
        end,
        allDay,
        venue: x.venue,
        city: x.city,
        url: `https://${cfg.host}/content/view/full/${String(meta.mainNodeId)}`,
        description: x.description,
        summary: x.summary,
        image: x.image,
        tagText: x.tagText,
      })
    }
    const total = res.totalCount ?? 0
    if (hits.length < PAGE || offset + PAGE >= total) break
  }
  return out
}

interface CalendarItem {
  id?: number | string
  title?: string
  allDay?: boolean
  start?: string
  end?: string | null
  extendedProps?: { location?: string }
  content?: Json
}

async function runCalendar(cfg: OpenPaConfig, ctx: AdapterContext): Promise<RawEvent[]> {
  const today = romeDate(ctx.now)
  const byKey = new Map<string, RawEvent>()
  const q = encodeURIComponent(`classes ${cfg.classes}`)
  for (let from = 0; from < ctx.horizonDays; from += CHUNK_DAYS) {
    const start = addDays(today, from)
    const end = addDays(today, Math.min(from + CHUNK_DAYS, ctx.horizonDays))
    const res = await ctx.fetchJson<CalendarItem[] | { error_message?: string }>(
      `https://${cfg.host}/opendata/api/calendar/search/${q}?start=${start}&end=${end}`,
    )
    if (!Array.isArray(res)) throw new Error(`OpenPA calendar: ${res.error_message ?? 'unexpected response'}`)
    for (const item of res) {
      if (!item.start || item.id === undefined) continue
      const allDay = item.allDay === true || /^\d{4}-\d{2}-\d{2}$/.test(item.start)
      let startIso: string | null
      let endIso: string | null
      if (allDay) {
        const s = item.start.slice(0, 10)
        startIso = normalizeIso(s)
        // FullCalendar all-day ends are exclusive → our inclusive last day.
        const e = item.end ? addDays(item.end.slice(0, 10), -1) : s
        endIso = normalizeIso(e < s ? s : e)
      } else {
        startIso = normalizeIso(item.start)
        endIso = normalizeIso(item.end ?? null)
      }
      if (!startIso) continue
      const key = `${String(item.id)}@${startIso}`
      if (byKey.has(key)) continue // chunk boundaries repeat spanning events
      const content = asObj(item.content) ?? {}
      const d = langData(content)
      const extradata = asObj(asObj(content.extradata)?.['ita-IT']) ?? {}
      const path = item.extendedProps?.location ?? (extradata.urlAlias as string | undefined)
      const x = extract(d, cfg)
      byKey.set(key, {
        nativeId: key,
        seriesKey: String(item.id),
        title: cleanTitle(item.title ?? firstNonEmpty(d.event_title as string), cfg),
        start: startIso,
        end: endIso,
        allDay,
        venue: x.venue,
        city: x.city,
        url: path ? `https://${cfg.host}${path}` : `https://${cfg.host}/openpa/object/${String(item.id)}`,
        description: x.description,
        summary: x.summary,
        image: x.image,
        tagText: x.tagText,
      })
    }
  }
  return [...byKey.values()]
}

export function openpa(cfg: OpenPaConfig): Adapter {
  const adapter: Adapter = {
    id: cfg.id,
    name: cfg.name,
    defaultCategory: cfg.defaultCategory ?? 'other',
    run: (ctx) => (cfg.mode === 'search' ? runSearch(cfg, ctx) : runCalendar(cfg, ctx)),
  }
  if (cfg.mayBeEmpty) adapter.mayBeEmpty = true
  if (cfg.maxRequests) adapter.maxRequests = cfg.maxRequests
  return adapter
}
