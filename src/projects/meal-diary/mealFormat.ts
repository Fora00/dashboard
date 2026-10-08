import type { MealEntry } from '../../lib/db'
import { MACRO_EMOJI, parseAmount, type Nutrition, type NutritionForm } from './nutrition'

export function toNutrition(f: NutritionForm): Nutrition {
  return {
    grams: parseAmount(f.grams, 'grams'),
    kcal: parseAmount(f.kcal, 'kcal'),
    proteinG: parseAmount(f.proteinG, 'proteinG'),
    carbsG: parseAmount(f.carbsG, 'carbsG'),
    fatG: parseAmount(f.fatG, 'fatG'),
    estimated: f.estimated,
  }
}

export function toForm(e: MealEntry): NutritionForm {
  const s = (n: number | null) => (n === null ? '' : String(n))
  return {
    grams: s(e.grams),
    kcal: s(e.kcal),
    proteinG: s(e.proteinG),
    carbsG: s(e.carbsG),
    fatG: s(e.fatG),
    estimated: e.estimated,
  }
}

export function macros(e: Pick<MealEntry, 'grams' | 'kcal' | 'proteinG' | 'carbsG' | 'fatG' | 'estimated'>): {
  text: string
  hint: string
} {
  const parts: string[] = []
  const hints: string[] = []
  if (e.grams !== null) {
    parts.push(`${e.grams} g`)
    hints.push(`${e.grams} g total`)
  }
  if (e.kcal !== null) {
    parts.push(`${MACRO_EMOJI.kcal} ${e.estimated ? '≈ ' : ''}${e.kcal}`)
    hints.push(`${e.kcal} kcal${e.estimated ? ' (AI estimate)' : ''}`)
  }
  if (e.proteinG !== null) {
    parts.push(`${MACRO_EMOJI.proteinG} ${e.proteinG}`)
    hints.push(`${e.proteinG} g protein`)
  }
  if (e.carbsG !== null) {
    parts.push(`${MACRO_EMOJI.carbsG} ${e.carbsG}`)
    hints.push(`${e.carbsG} g carbs`)
  }
  if (e.fatG !== null) {
    parts.push(`${MACRO_EMOJI.fatG} ${e.fatG}`)
    hints.push(`${e.fatG} g fat`)
  }
  return { text: parts.join(' · '), hint: hints.join(' · ') }
}
