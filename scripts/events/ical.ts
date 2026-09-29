// Minimal iCalendar (RFC 5545) reader: enough for public event feeds.
// Handles line unfolding, parameters, text unescaping, DATE / DATE-TIME in
// UTC, with TZID (any IANA zone, via Intl) or floating (taken as Rome).
// RRULE/RDATE/EXDATE are NOT expanded — WordPress calendar plugins export
// each occurrence as its own VEVENT, which is the case we need. If a feed
// relies on RRULE, only the first occurrence (DTSTART) is seen.
import { instantToIso, wallToIso, TZ } from './time.ts'

export interface IcalProp {
  value: string
  params: Record<string, string>
}

export type IcalEvent = Record<string, IcalProp>

export function unfold(text: string): string[] {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n')
}

export function unescapeText(v: string): string {
  return v.replace(/\\([\\;,nN])/g, (_, c: string) => (c === 'n' || c === 'N' ? '\n' : c))
}

function parseLine(line: string): [string, IcalProp] | null {
  // NAME;P1=V1;P2="V:2":VALUE — the first ':' outside quotes ends the params.
  let inQuote = false
  let colon = -1
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') inQuote = !inQuote
    else if (ch === ':' && !inQuote) { colon = i; break }
  }
  if (colon < 0) return null
  const [name = '', ...paramParts] = line.slice(0, colon).split(';')
  const params: Record<string, string> = {}
  for (const p of paramParts) {
    const eq = p.indexOf('=')
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, '')
  }
  return [name.toUpperCase(), { value: line.slice(colon + 1), params }]
}

/** Every VEVENT as a map of property name → first occurrence of that property. */
export function parseIcal(text: string): IcalEvent[] {
  const events: IcalEvent[] = []
  let current: IcalEvent | null = null
  let depth = 0 // nested components inside a VEVENT (VALARM) are skipped
  for (const line of unfold(text)) {
    if (!line) continue
    const parsed = parseLine(line)
    if (!parsed) continue
    const [name, prop] = parsed
    if (name === 'BEGIN') {
      if (prop.value.toUpperCase() === 'VEVENT' && !current) { current = {}; depth = 0 }
      else if (current) depth++
      continue
    }
    if (name === 'END') {
      if (current && depth > 0) depth--
      else if (current && prop.value.toUpperCase() === 'VEVENT') { events.push(current); current = null }
      continue
    }
    if (current && depth === 0 && !(name in current)) current[name] = prop
  }
  return events
}

/** DTSTART/DTEND → { iso (Rome offset), allDay, date (local YYYY-MM-DD) }. */
export function icalDate(prop: IcalProp | undefined): { iso: string; allDay: boolean; date: string } | null {
  if (!prop) return null
  const v = prop.value.trim()
  const d = v.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (d || prop.params.VALUE === 'DATE') {
    if (!d) return null
    const iso = wallToIso(Number(d[1]), Number(d[2]), Number(d[3]))
    return { iso, allDay: true, date: iso.slice(0, 10) }
  }
  const t = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/)
  if (!t) return null
  const [y, mo, day, h, mi, s] = [t[1], t[2], t[3], t[4], t[5], t[6] ?? '0'].map(Number) as [number, number, number, number, number, number]
  let iso: string
  if (t[7]) {
    iso = instantToIso(Date.UTC(y, mo - 1, day, h, mi, s))
  } else {
    const zone = prop.params.TZID ?? TZ
    let instantIso: string
    try {
      instantIso = wallToIso(y, mo, day, h, mi, s, zone)
    } catch {
      instantIso = wallToIso(y, mo, day, h, mi, s) // unknown TZID: assume Rome
    }
    iso = instantToIso(Date.parse(instantIso))
  }
  return { iso, allDay: false, date: iso.slice(0, 10) }
}
