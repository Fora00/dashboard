import { describe, expect, it } from 'vitest'
import { FOODS } from './foods'
import { NUTRITION_MAX, dayTotals, estimate, parseAmount, sanitizeNutrition } from './nutrition'

describe('parseAmount', () => {
  it('treats empty and junk as null, rounds, accepts a decimal comma, clamps to the server bounds', () => {
    expect(parseAmount('', 'kcal')).toBeNull()
    expect(parseAmount('abc', 'kcal')).toBeNull()
    expect(parseAmount('12,6', 'proteinG')).toBe(13)
    expect(parseAmount('-5', 'kcal')).toBe(0)
    expect(parseAmount('99999', 'kcal')).toBe(NUTRITION_MAX.kcal)
    expect(parseAmount('5000', 'carbsG')).toBe(NUTRITION_MAX.carbsG)
    expect(parseAmount(0, 'kcal')).toBe(0)
  })
})

describe('sanitizeNutrition', () => {
  it('drops the estimated flag when there is nothing to be an estimate of', () => {
    expect(sanitizeNutrition({ grams: 80, estimated: true }).estimated).toBe(false)
    expect(sanitizeNutrition({ kcal: 280, estimated: true }).estimated).toBe(true)
  })
})

describe('estimate', () => {
  it('scales per-100g values to the entered grams', () => {
    const e = estimate('Pasta al pomodoro', 100)
    expect(e?.food.name).toBe('pasta (dry)')
    expect(e).toMatchObject({ grams: 100, typicalPortion: false, kcal: 350, proteinG: 12, carbsG: 72 })
  })
  it('uses the typical portion when no grams, and says so', () => {
    const e = estimate('una mela', null)
    expect(e).toMatchObject({ grams: 150, typicalPortion: true, kcal: 78 })
    expect(estimate('una mela', 0)?.typicalPortion).toBe(true)
  })
  it('ignores accents and case, matches whole words only', () => {
    expect(estimate('PURÈ di patate', null)?.food.name).toBe('potatoes')
    expect(estimate('spaghettata', null)).toBeNull()
    expect(estimate('qualcosa di buono', null)).toBeNull()
  })
  it('picks the earliest mentioned food', () => {
    expect(estimate('mela e pasta', null)?.food.name).toBe('apple')
    expect(estimate('pasta e mela', null)?.food.name).toBe('pasta (dry)')
  })
  it('matches multi-word triggers', () => {
    expect(estimate('prosciutto cotto e pane', null)?.food.name).toBe('cooked ham')
  })
})

describe('food table sanity', () => {
  it('has plausible values (macro energy within ~25% of kcal, except alcohol)', () => {
    for (const f of FOODS) {
      expect(f.words.length, f.name).toBeGreaterThan(0)
      expect(f.portion, f.name).toBeGreaterThan(0)
      if (f.kcal >= 100 && !['beer', 'wine'].includes(f.name)) {
        const fromMacros = f.proteinG * 4 + f.carbsG * 4 + f.fatG * 9
        expect(Math.abs(fromMacros - f.kcal) / f.kcal, f.name).toBeLessThan(0.25)
      }
    }
  })
})

describe('dayTotals', () => {
  const base = { kcal: null, proteinG: null, carbsG: null, fatG: null, estimated: false }
  it('sums what is there, counts entries without values, flags estimates', () => {
    const t = dayTotals([
      { ...base, kcal: 300, proteinG: 10 },
      { ...base, kcal: 200, carbsG: 30, estimated: true },
      { ...base },
    ])
    expect(t).toEqual({ kcal: 500, proteinG: 10, carbsG: 30, fatG: 0, counted: 2, uncounted: 1, approximate: true })
  })
  it('is all zero for no entries', () => {
    expect(dayTotals([])).toMatchObject({ kcal: 0, counted: 0, uncounted: 0, approximate: false })
  })
})
