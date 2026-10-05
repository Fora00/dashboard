import { describe, expect, it } from 'vitest'
import { NUTRITION_MAX, dayTotals, parseAmount, sanitizeNutrition } from './nutrition'

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
