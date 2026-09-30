import { dayKey } from '../../../lib/dates.ts'

export { dayKey }

// --- Dates ------------------------------------------------------------------
// Day keys are local-time 'YYYY-MM-DD' (Habits' dayKey); weeks run Monday to
// Sunday and are keyed by their Monday.

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

/** The seven day keys (Mon..Sun) of a week key. */
export function weekDays(week: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(week, i))
}

/** Whole days from day key `from` to day key `to` (DST-safe). */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDayKey(to).getTime() - parseDayKey(from).getTime()) / 86_400_000)
}
