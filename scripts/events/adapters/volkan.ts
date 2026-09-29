// Volkan TDG (board games / RPG association, Trento). WordPress + The Events
// Calendar; robots.txt allows everything. The site-wide iCal export
// https://volkantdg.it/events/?ical=1 lists the upcoming events (each
// occurrence is its own VEVENT). The calendar is often stale: when nothing
// is scheduled the export is an empty body, which is a valid "0 events".
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import { icalDate, parseIcal, unescapeText } from '../ical.ts'
import { addDays, dateToIso } from '../time.ts'
import { absUrl } from '../text.ts'

const FEED = 'https://volkantdg.it/events/?ical=1'
const REGION = /trentino|alto adige|veneto|italy|italia|^\d{5}$/i

/** "Magman, 9 Via San Bernardino, Trento, Trentino-Alto Adige, 38122, Italy" → venue + town. */
function place(location: string): { venue: string | null; city: string } {
  const parts = location.split(/\s*,\s*/).filter(Boolean)
  const regionAt = parts.findIndex((p) => REGION.test(p))
  const city = regionAt > 0 ? parts[regionAt - 1] : undefined
  return { venue: parts[0] ?? null, city: city && !/^\d/.test(city) ? city : 'Trento' }
}

async function run(ctx: AdapterContext): Promise<RawEvent[]> {
  const { text } = await ctx.fetchText(FEED)
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
    const url = ev.URL?.value.trim() || 'https://volkantdg.it/'
    const loc = ev.LOCATION ? place(unescapeText(ev.LOCATION.value)) : { venue: null, city: 'Trento' }
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
      tagText: unescapeText(ev.CATEGORIES?.value ?? ''),
    })
  }
  return out
}

export const volkan: Adapter = {
  id: 'volkan',
  name: 'Volkan TDG',
  defaultCategory: 'other',
  mayBeEmpty: true,
  run,
}
