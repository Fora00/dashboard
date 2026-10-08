// Local-time day keys: 'YYYY-MM-DD' in the device's time zone, so a day
// belongs to the calendar day the user actually saw (no UTC drift around
// midnight). Shared by Habits and Life. Kept dependency-free so Node scripts
// can import it too.

export function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
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
