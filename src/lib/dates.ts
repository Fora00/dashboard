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
