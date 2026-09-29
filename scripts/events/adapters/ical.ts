// iCalendar feed adapter factory, for WordPress calendar plugins that export
// every occurrence as its own VEVENT (The Events Calendar `?ical=1`, Events
// Manager `/events.ics`). An empty body is a valid "0 events" (a stale
// calendar); anything else that is not iCalendar is an error.
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import type { AreaId, Ring } from '../areas.ts'
import { icalDate, parseIcal, unescapeText } from '../ical.ts'
import { addDays, dateToIso } from '../time.ts'
import { absUrl } from '../text.ts'

export interface IcalConfig {
  id: string
  name: string
  feed: string
  /** Town used when LOCATION has none. */
  city: string
  /** Fallback link when a VEVENT has no URL (the calendar page). */
  home: string
  defaultCategory?: CategoryId
  mayBeEmpty?: boolean
  maxRequests?: number
  /** Area for towns areas.ts does not know (default 'trentino'). */
  area?: AreaId
  /** Coverage ring (default 'home'). */
  ring?: Ring
}

const REGION = /^(trentino|alto adige|s[üu]dtirol|veneto|italy|italia|tn|bz|vr)$|trentino-alto adige/i

/**
 * "Magman, 9 Via San Bernardino, Trento, Trentino-Alto Adige, 38122, Italy" →
 * venue "Magman", town "Trento": the last non-numeric part before the region
 * / country / postcode tail.
 */
export function place(location: string, fallbackCity: string): { venue: string | null; city: string } {
  const parts = location.split(/\s*,\s*/).map((p) => p.trim()).filter(Boolean)
  let i = parts.length - 1
  while (i > 0 && (REGION.test(parts[i] ?? '') || /^\d/.test(parts[i] ?? ''))) i--
  const city = i > 0 ? parts[i] : undefined
  // A street ("via …", "piazza …") is not a town.
  const town = city && !/^(via|viale|piazza|piazzale|corso|largo|vicolo|loc\.?|localit)/i.test(city) ? city : fallbackCity
  return { venue: parts[0] ?? null, city: town }
}

export function ical(cfg: IcalConfig): Adapter {
  async function run(ctx: AdapterContext): Promise<RawEvent[]> {
    const { text } = await ctx.fetchText(cfg.feed)
    if (!text.trim()) return []
    if (!text.includes('BEGIN:VCALENDAR')) throw new Error('feed is not iCalendar')
    const out: RawEvent[] = []
    for (const ev of parseIcal(text)) {
      const start = icalDate(ev.DTSTART)
      if (!start) continue
      const endRaw = icalDate(ev.DTEND)
      let end: string | null = endRaw?.iso ?? null
      if (start.allDay) {
        // iCal all-day DTEND is exclusive → our inclusive last day.
        const last = endRaw ? addDays(endRaw.date, -1) : start.date
        end = dateToIso(last < start.date ? start.date : last)
      }
      const url = ev.URL?.value.trim() || cfg.home
      const loc = ev.LOCATION ? place(unescapeText(ev.LOCATION.value), cfg.city) : { venue: null, city: cfg.city }
      out.push({
        nativeId: ev.UID?.value ?? `${url}@${start.iso}`,
        title: unescapeText(ev.SUMMARY?.value ?? '').trim(),
        start: start.iso,
        end,
        allDay: start.allDay,
        venue: loc.venue,
        city: loc.city,
        url,
        description: unescapeText(ev.DESCRIPTION?.value ?? ''),
        image: ev.ATTACH && /^image\//i.test(ev.ATTACH.params.FMTTYPE ?? '') ? absUrl(ev.ATTACH.value, url) : null,
        tagText: unescapeText(ev.CATEGORIES?.value ?? '').replace(/,/g, ' · '),
      })
    }
    return out
  }
  const adapter: Adapter = { id: cfg.id, name: cfg.name, defaultCategory: cfg.defaultCategory ?? 'other', run }
  if (cfg.mayBeEmpty) adapter.mayBeEmpty = true
  if (cfg.maxRequests) adapter.maxRequests = cfg.maxRequests
  if (cfg.area) adapter.area = cfg.area
  if (cfg.ring) adapter.ring = cfg.ring
  return adapter
}
