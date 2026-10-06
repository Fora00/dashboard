import { describe, expect, it } from 'vitest'
import {
  NUTRITION_MAX,
  averageOfLogged,
  dayTotals,
  lastDays,
  macroSplit,
  parseAmount,
  sanitizeNutrition,
} from './nutrition'

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

describe('charts helpers', () => {
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const e = (day: string, kcal: number | null, p = 0, c = 0, f = 0) => ({
    day,
    kcal,
    proteinG: p,
    carbsG: c,
    fatG: f,
    estimated: false,
  })

  it('lastDays covers empty days, oldest first, across a month boundary', () => {
    const pts = lastDays([e('2026-10-05', 500, 30, 50, 10)], new Date(2026, 9, 6), 7, key)
    expect(pts.map((p) => p.day)).toEqual([
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
      '2026-10-05',
      '2026-10-06',
    ])
    expect(pts[5]!.kcal).toBe(500)
    expect(pts[6]!.counted).toBe(0)
  })

  it('averageOfLogged ignores unlogged days', () => {
    const pts = lastDays([e('2026-10-05', 600), e('2026-10-06', 400)], new Date(2026, 9, 6), 7, key)
    expect(averageOfLogged(pts)).toMatchObject({ kcal: 500, days: 2 })
    expect(averageOfLogged(lastDays([], new Date(2026, 9, 6), 7, key))).toBeNull()
  })

  it('macroSplit is by calories', () => {
    expect(macroSplit({ proteinG: 25, carbsG: 25, fatG: 0 })).toEqual({ protein: 50, carbs: 50, fat: 0 })
    expect(macroSplit({ proteinG: 0, carbsG: 0, fatG: 0 })).toEqual({ protein: 0, carbs: 0, fat: 0 })
  })
})
