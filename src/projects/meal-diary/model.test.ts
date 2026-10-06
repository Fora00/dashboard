import { describe, expect, it } from 'vitest'
import type { MealEntry } from '../../lib/db'
import { dayLabel, defaultMeal, groupByDay } from './model'

const e = (id: string, day: string, meal: MealEntry['meal'], createdAt = 0): MealEntry => ({
  id,
  day,
  meal,
  text: id,
  weighed: false,
  grams: null,
  kcal: null,
  proteinG: null,
  carbsG: null,
  fatG: null,
  estimated: false,
  createdAt,
  updatedAt: createdAt,
})

describe('defaultMeal', () => {
  it('follows the hour of day', () => {
    expect([7, 12, 16, 21].map(defaultMeal)).toEqual(['breakfast', 'lunch', 'snack', 'dinner'])
  })
})

describe('groupByDay', () => {
  it('puts the newest day first and orders meals inside a day', () => {
    const groups = groupByDay([
      e('s', '2026-10-04', 'snack', 1),
      e('d', '2026-10-04', 'dinner', 2),
      e('b', '2026-10-04', 'breakfast', 3),
      e('old', '2026-10-01', 'lunch', 4),
      e('new', '2026-10-05', 'lunch', 5),
    ])
    expect(groups.map((g) => g.day)).toEqual(['2026-10-05', '2026-10-04', '2026-10-01'])
    expect(groups[1]?.entries.map((x) => x.id)).toEqual(['b', 'd', 's'])
  })
  it('keeps several entries of the same meal in creation order', () => {
    const g = groupByDay([e('b2', '2026-10-04', 'lunch', 9), e('b1', '2026-10-04', 'lunch', 3)])
    expect(g[0]?.entries.map((x) => x.id)).toEqual(['b1', 'b2'])
  })
  it('is empty for no entries', () => {
    expect(groupByDay([])).toEqual([])
  })
})

describe('dayLabel', () => {
  const now = new Date(2026, 9, 5, 14, 0) // Mon 5 Oct 2026
  it('names today and yesterday, dates the rest', () => {
    expect(dayLabel('2026-10-05', now)).toBe('Today')
    expect(dayLabel('2026-10-04', now)).toBe('Yesterday')
    expect(dayLabel('2026-10-02', now)).toBe('Fri 2 Oct')
    expect(dayLabel('2025-12-31', now)).toBe('Wed 31 Dec 2025')
  })
})
