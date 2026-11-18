// Local-time day keys: 'YYYY-MM-DD' in the device's time zone, so a day
// belongs to the calendar day the user actually saw (no UTC drift around
// midnight). THE date module: every day/week/month helper lives here. Kept
// dependency-free (no Vite-only code) so Node scripts can import it too.
//
// Two families, on purpose:
//  - local-time helpers (dayKey, addDays, weekStart, ...): the device's day.
//  - Rome / UTC-noon helpers (romeDayKey, addDaysUtc, ...): Events works on
//    calendar days of Europe/Rome, independent of the device's zone.

export function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/** True for a real calendar date written as 'YYYY-MM-DD' (rejects 2026-02-30). */
export function isDateKey(s: unknown): s is string {
  if (typeof s !== 'string') return false
  const m = DATE_RE.exec(s)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const t = new Date(Date.UTC(y, mo - 1, d))
  return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d
}

/** A 'YYYY-MM-DD' key as a local-midnight Date (never UTC-parsed). */
export function parseDayKey(key: string): Date {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** True if the date key falls on a Monday (calendar-only, timezone-free). */
export function isMondayKey(key: string): boolean {
  if (!isDateKey(key)) return false
  const [y = 0, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 1
}

/** Shift a day key by n days (local calendar arithmetic, DST-safe). */
export function addDays(key: string, n: number): string {
  const date = parseDayKey(key)
  date.setDate(date.getDate() + n)
  return dayKey(date)
}

/** The week key (its Monday, local time) of the week containing `date`. */
export function weekKey(date: Date = new Date()): string {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const sinceMonday = (copy.getDay() + 6) % 7 // Sun=0 → 6, Mon=1 → 0
  copy.setDate(copy.getDate() - sinceMonday)
  return dayKey(copy)
}

/** The Monday (local) of the week containing the day key `key`. */
export function weekStart(key: string): string {
  return weekKey(parseDayKey(key))
}

/** The seven day keys (Mon..Sun) of a week key. */
export function weekDays(week: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(week, i))
}

/** Whole days from day key `from` to day key `to` (DST-safe). */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDayKey(to).getTime() - parseDayKey(from).getTime()) / 86_400_000)
}

/** 'YYYY-MM' of a date (local time). */
export function monthKey(date: Date): string {
  return dayKey(date).slice(0, 7)
}

/** 'YYYY-MM' shifted by n months. */
export function shiftMonth(month: string, n: number): string {
  const d = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1 + n, 1)
  return monthKey(d)
}

// --- Rome / UTC-noon variants (Events) ---------------------------------------

const romeDayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Rome',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Europe/Rome calendar day 'YYYY-MM-DD' of an instant (epoch ms). */
export function romeDayKey(ms: number): string {
  return romeDayFmt.format(new Date(ms))
}

/** UTC-noon parse of a 'YYYY-MM-DD' (or longer ISO) string; noon keeps DST out of the way. */
function utcNoon(day: string): Date {
  return new Date(`${day.slice(0, 10)}T12:00:00Z`)
}

/** Shift a 'YYYY-MM-DD' by n days as pure calendar arithmetic (UTC noon, no device zone). */
export function addDaysUtc(day: string, n: number): string {
  const d = utcNoon(day)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Whole days from `a` to `b` ('YYYY-MM-DD'), UTC-noon arithmetic. */
export function daysBetweenUtc(a: string, b: string): number {
  return Math.round((utcNoon(b).getTime() - utcNoon(a).getTime()) / 86_400_000)
}

/** Monday of the week containing `day` ('YYYY-MM-DD'), UTC-noon arithmetic. */
export function weekStartUtc(day: string): string {
  const dow = (utcNoon(day).getUTCDay() + 6) % 7
  return addDaysUtc(day, -dow)
}

/**
 * Locale date string. A 'YYYY-MM-DD' or 'YYYY-MM' string is read as local
 * midnight (no UTC drift); a number is an epoch in ms. `locale` undefined =
 * the device locale.
 */
export function formatDate(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  let d: Date
  if (typeof value === 'string') {
    d = new Date(/^\d{4}-\d{2}$/.test(value) ? `${value}-01T00:00:00` : `${value}T00:00:00`)
  } else {
    d = new Date(value)
  }
  return d.toLocaleDateString(locale, options)
}
