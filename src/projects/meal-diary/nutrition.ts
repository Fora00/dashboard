// Pure nutrition helpers for the meal diary: input parsing/clamping and daily
// totals. The numbers themselves usually come from /meal-reconcile (an AI
// estimate written back as `estimated`), or are typed when editing an entry.
// No React, no Dexie.
import type { MealEntry } from '../../lib/db'

/** Upper bounds. MUST match the CHECK constraints in supabase/migrations/20261005140000_meal_diary.sql. */
export const NUTRITION_MAX = { grams: 10_000, kcal: 10_000, proteinG: 1000, carbsG: 1000, fatG: 1000 } as const

export type NutritionField = keyof typeof NUTRITION_MAX

export interface Nutrition {
  grams: number | null
  kcal: number | null
  proteinG: number | null
  carbsG: number | null
  fatG: number | null
  estimated: boolean
}

/** The form's raw strings: an empty field stays empty (= null). */
export interface NutritionForm {
  grams: string
  kcal: string
  proteinG: string
  carbsG: string
  fatG: string
  estimated: boolean
}

export const EMPTY_FORM: NutritionForm = { grams: '', kcal: '', proteinG: '', carbsG: '', fatG: '', estimated: false }

export const NO_NUTRITION: Nutrition = {
  grams: null,
  kcal: null,
  proteinG: null,
  carbsG: null,
  fatG: null,
  estimated: false,
}

/** "" / junk → null; otherwise rounded and clamped to 0..max (the same bounds the server enforces). */
export function parseAmount(raw: string | number | null | undefined, field: NutritionField): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim().replace(',', '.'))
  if (!Number.isFinite(n)) return null
  return Math.min(NUTRITION_MAX[field], Math.max(0, Math.round(n)))
}

/** Clamp a possibly dirty Nutrition; `estimated` only counts when there is a value to be an estimate of. */
export function sanitizeNutrition(n: Partial<Nutrition> | undefined): Nutrition {
  const grams = parseAmount(n?.grams, 'grams')
  const kcal = parseAmount(n?.kcal, 'kcal')
  const proteinG = parseAmount(n?.proteinG, 'proteinG')
  const carbsG = parseAmount(n?.carbsG, 'carbsG')
  const fatG = parseAmount(n?.fatG, 'fatG')
  const hasValue = kcal !== null || proteinG !== null || carbsG !== null || fatG !== null
  return { grams, kcal, proteinG, carbsG, fatG, estimated: Boolean(n?.estimated) && hasValue }
}

export interface DayTotals {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
  /** Entries that contributed at least one value. */
  counted: number
  /** Entries with no nutrition at all (not in the totals). */
  uncounted: number
  /** Some counted value was an estimate. */
  approximate: boolean
}

export function dayTotals(
  entries: readonly Pick<MealEntry, 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'estimated'>[],
): DayTotals {
  const t: DayTotals = { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, counted: 0, uncounted: 0, approximate: false }
  for (const e of entries) {
    if (e.kcal === null && e.proteinG === null && e.carbsG === null && e.fatG === null) {
      t.uncounted++
      continue
    }
    t.counted++
    t.kcal += e.kcal ?? 0
    t.proteinG += e.proteinG ?? 0
    t.carbsG += e.carbsG ?? 0
    t.fatG += e.fatG ?? 0
    if (e.estimated) t.approximate = true
  }
  return t
}

export const MACRO_EMOJI = { kcal: '🔥', proteinG: '🥩', carbsG: '🍞', fatG: '🥑' } as const
export const MACRO_LABEL = { kcal: 'Calories', proteinG: 'Protein', carbsG: 'Carbs', fatG: 'Fat' } as const

export interface DayPoint extends DayTotals {
  day: string
}

/** The last `n` days ending at `today` (oldest first), empty days included so gaps show in a chart. */
export function lastDays(
  entries: readonly Pick<MealEntry, 'day' | 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'estimated'>[],
  today: Date,
  n: number,
  keyOf: (d: Date) => string,
): DayPoint[] {
  const byDay = new Map<string, (typeof entries)[number][]>()
  for (const e of entries) {
    const list = byDay.get(e.day)
    if (list) list.push(e)
    else byDay.set(e.day, [e])
  }
  const out: DayPoint[] = []
  for (let i = n - 1; i >= 0; i--) {
    const day = keyOf(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i))
    out.push({ day, ...dayTotals(byDay.get(day) ?? []) })
  }
  return out
}

/** Average over the days that have at least one counted entry (logged days only); null when none. */
export function averageOfLogged(
  points: readonly DayPoint[],
): { kcal: number; proteinG: number; carbsG: number; fatG: number; days: number } | null {
  const logged = points.filter((p) => p.counted > 0)
  if (logged.length === 0) return null
  const avg = (f: (p: DayPoint) => number) => Math.round(logged.reduce((s, p) => s + f(p), 0) / logged.length)
  return {
    kcal: avg((p) => p.kcal),
    proteinG: avg((p) => p.proteinG),
    carbsG: avg((p) => p.carbsG),
    fatG: avg((p) => p.fatG),
    days: logged.length,
  }
}

/** Share of calories from each macro (4/4/9 kcal per g), in percent summing to ~100; zeros when there are no macros. */
export function macroSplit(t: Pick<DayTotals, 'proteinG' | 'carbsG' | 'fatG'>): {
  protein: number
  carbs: number
  fat: number
} {
  const p = t.proteinG * 4
  const c = t.carbsG * 4
  const f = t.fatG * 9
  const sum = p + c + f
  if (sum === 0) return { protein: 0, carbs: 0, fat: 0 }
  return { protein: Math.round((p / sum) * 100), carbs: Math.round((c / sum) * 100), fat: Math.round((f / sum) * 100) }
}
