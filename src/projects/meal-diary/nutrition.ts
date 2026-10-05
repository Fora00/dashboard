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

export const NO_NUTRITION: Nutrition = { grams: null, kcal: null, proteinG: null, carbsG: null, fatG: null, estimated: false }

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

export function dayTotals(entries: readonly Pick<MealEntry, 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'estimated'>[]): DayTotals {
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
