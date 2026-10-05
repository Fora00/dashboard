import type { MealEntry } from '../../../lib/db'
import { dayTotals, type DayTotals } from '../../meal-diary/nutrition.ts'
import { weekDays } from './dates.ts'

// What the week's meal-diary entries add up to, for the Life week screen and
// the /settimana export. Pure: callers pass the entries (any days; only the
// week's seven are used).

export interface MealsDay {
  day: string
  entries: MealEntry[]
  totals: DayTotals
}

export interface MealsWeek {
  /** Days that have at least one entry, Monday first. */
  days: MealsDay[]
  /** Days with at least one entry that carries nutrition: the denominator of the averages. */
  loggedDays: number
  /** Average per logged day, rounded; null when no day has nutrition. */
  average: { kcal: number; proteinG: number; carbsG: number; fatG: number } | null
  /** Some counted value is an estimate. */
  approximate: boolean
}

const MEAL_ORDER = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 } as const

export function summarizeMealsWeek(meals: readonly MealEntry[], week: string): MealsWeek {
  const days: MealsDay[] = []
  for (const day of weekDays(week)) {
    const entries = meals
      .filter((m) => m.day === day)
      .sort((a, b) => MEAL_ORDER[a.meal] - MEAL_ORDER[b.meal] || a.createdAt - b.createdAt)
    if (entries.length) days.push({ day, entries, totals: dayTotals(entries) })
  }
  const counted = days.filter((d) => d.totals.counted > 0)
  const n = counted.length
  const avg = (pick: (t: DayTotals) => number) => Math.round(counted.reduce((s, d) => s + pick(d.totals), 0) / n)
  return {
    days,
    loggedDays: n,
    average: n === 0 ? null : { kcal: avg((t) => t.kcal), proteinG: avg((t) => t.proteinG), carbsG: avg((t) => t.carbsG), fatG: avg((t) => t.fatG) },
    approximate: counted.some((d) => d.totals.approximate),
  }
}
