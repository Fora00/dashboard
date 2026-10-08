import { shareFile } from '../../lib/share'
import type { EventItem } from './types'
import { TZ, localDay, safeHttpUrl } from './model'

// RFC 5545 export of one event. Timed events use TZID=Europe/Rome plus an
// embedded VTIMEZONE (Apple Calendar and Google Calendar both honour it, and
// the event keeps its Rome wall-clock time whatever the device timezone is).

const CRLF = '\r\n'
const DOMAIN = 'events.dashboard.local'
const TWO_HOURS = 2 * 3600 * 1000

/** Escapes a TEXT value: backslash, semicolon, comma and newlines. */
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n')
}

/** Folds a content line at 75 octets (UTF-8), never splitting a character. */
function fold(line: string): string {
  const enc = new TextEncoder()
  if (enc.encode(line).length <= 75) return line
  const out: string[] = []
  let cur = ''
  let curBytes = 0
  let limit = 75 // continuation lines start with a space, leaving 74 for content
  for (const ch of line) {
    const n = enc.encode(ch).length
    if (curBytes + n > limit) {
      out.push(cur)
      cur = ''
      curBytes = 0
      limit = 74
    }
    cur += ch
    curBytes += n
  }
  out.push(cur)
  return out.join(CRLF + ' ')
}

const partsFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

/** Rome wall clock of an instant as `YYYYMMDDTHHMMSS`. */
function romeLocal(ms: number): string {
  const p: Record<string, string> = {}
  for (const part of partsFmt.formatToParts(new Date(ms))) p[part.type] = part.value
  return `${p.year}${p.month}${p.day}T${p.hour}${p.minute}${p.second}`
}

function utcStamp(ms: number): string {
  return new Date(ms)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

function compactDay(day: string): string {
  return day.replace(/-/g, '')
}

function addDay(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Rome',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

/** Builds a single-event VCALENDAR document (CRLF line endings, folded). */
export function buildIcs(e: EventItem, now: number = Date.now()): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dashboard//Events//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  const startMs = Date.parse(e.start)
  const endMs = e.end ? Date.parse(e.end) : NaN
  // Folded series and all-day/ongoing exhibitions: one multi-day all-day span.
  const asDays = e.allDay || e.occurrences > 1

  const body: string[] = []
  body.push(`UID:${e.id.replace(/[^A-Za-z0-9._-]/g, '-')}@${DOMAIN}`)
  body.push(`DTSTAMP:${utcStamp(now)}`)

  if (asDays) {
    const first = localDay(e.start)
    let last = localDay(e.end ?? e.start)
    if (last < first) last = first
    body.push(`DTSTART;VALUE=DATE:${compactDay(first)}`)
    body.push(`DTEND;VALUE=DATE:${compactDay(addDay(last, 1))}`) // exclusive
  } else {
    const end = Number.isFinite(endMs) && endMs > startMs ? endMs : startMs + TWO_HOURS
    body.push(`DTSTART;TZID=${TZ}:${romeLocal(startMs)}`)
    body.push(`DTEND;TZID=${TZ}:${romeLocal(end)}`)
  }

  body.push(`SUMMARY:${esc(e.title)}`)
  const place = [e.venue, e.city].filter(Boolean).join(' · ')
  if (place) body.push(`LOCATION:${esc(place)}`)
  const url = safeHttpUrl(e.url)
  const desc = [e.summary, url].filter(Boolean).join('\n\n')
  if (desc) body.push(`DESCRIPTION:${esc(desc)}`)
  if (url) body.push(`URL:${url}`)

  if (!asDays) lines.push(...VTIMEZONE)
  lines.push('BEGIN:VEVENT', ...body, 'END:VEVENT', 'END:VCALENDAR')
  return lines.map(fold).join(CRLF) + CRLF
}

/** File-name safe slug of the title (ASCII, max 60 chars). */
export function icsFileName(e: EventItem): string {
  const slug = e.title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
  return `${slug || 'evento'}.ics`
}

/**
 * Hands the .ics to the OS: share sheet with a file where supported (iOS),
 * otherwise a download. Every browser API is guarded; never throws.
 */
export async function addToCalendar(e: EventItem): Promise<void> {
  try {
    if (typeof Blob === 'undefined') return
    const name = icsFileName(e)
    const blob = new Blob([buildIcs(e)], { type: 'text/calendar;charset=utf-8' })

    if (typeof File !== 'undefined') {
      const file = new File([blob], name, { type: 'text/calendar' })
      const outcome = await shareFile(file, e.title)
      if (outcome !== 'unsupported') return // shared, or the user dismissed the sheet
    }

    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function' || typeof document === 'undefined')
      return
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = name
    a.rel = 'noopener'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(href), 1000)
  } catch {
    // Blocked or unsupported: nothing to recover.
  }
}
