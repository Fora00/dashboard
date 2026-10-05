// Pure helpers for the meal diary (no Dexie, no React): meal kinds, which one
// to preselect, grouping entries by day, day labels.
import type { MealEntry, MealKind } from '../../lib/db'
import { dayKey } from '../../lib/dates'

export const MEALS: { id: MealKind; label: string; emoji: string }[] = [
  { id: 'breakfast', label: 'Breakfast', emoji: '☕' },
  { id: 'lunch', label: 'Lunch', emoji: '🍝' },
  { id: 'dinner', label: 'Dinner', emoji: '🍽️' },
  { id: 'snack', label: 'Snack', emoji: '🍎' },
]

const ORDER: Record<MealKind, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }

export const mealMeta = (id: MealKind) => MEALS.find((m) => m.id === id) ?? MEALS[3]!

/** The meal you are most likely logging at this hour (local time). */
export function defaultMeal(hour: number): MealKind {
  if (hour < 10) return 'breakfast'
  if (hour < 15) return 'lunch'
  if (hour < 18) return 'snack'
  return 'dinner'
}

export interface DayGroup {
  day: string
  entries: MealEntry[]
}

/** Newest day first; inside a day breakfast → lunch → dinner → snack, then by creation time. */
export function groupByDay(entries: readonly MealEntry[]): DayGroup[] {
  const byDay = new Map<string, MealEntry[]>()
  for (const e of entries) {
    const list = byDay.get(e.day)
    if (list) list.push(e)
    else byDay.set(e.day, [e])
  }
  return [...byDay]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .map(([day, list]) => ({
      day,
      entries: list.sort((a, b) => ORDER[a.meal] - ORDER[b.meal] || a.createdAt - b.createdAt),
    }))
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Today", "Yesterday", else "Mon 5 Oct" (with the year when it is not the current one). */
export function dayLabel(day: string, now: Date): string {
  const today = dayKey(now)
  const yesterday = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
  if (day === today) return 'Today'
  if (day === yesterday) return 'Yesterday'
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  const date = new Date(y, m - 1, d)
  const base = `${WEEKDAYS[date.getDay()]} ${d} ${MONTHS[m - 1]}`
  return y === now.getFullYear() ? base : `${base} ${y}`
}
