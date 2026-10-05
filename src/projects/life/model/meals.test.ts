import { describe, expect, it } from 'vitest'
import type { LifePlan, MealEntry } from '../../../lib/db'
import { buildExportMarkdown } from './export.ts'
import { summarizeMealsWeek } from './meals.ts'

// Fake data only (this repo is public): "Food A" etc.
const WEEK = '2026-10-05' // a Monday
const plan: LifePlan = { version: 1, week: WEEK, focus: [], rules: [], tasks: [], trackers: [], sundayCheck: [], checkins: [] }
const m = (day: string, meal: MealEntry['meal'], text: string, kcal: number | null, o: Partial<MealEntry> = {}): MealEntry => ({
  id: `${day}-${meal}-${text}`, day, meal, text, weighed: false, grams: null, kcal, proteinG: kcal === null ? null : 10, carbsG: kcal === null ? null : 20, fatG: kcal === null ? null : 5,
  estimated: false, createdAt: 0, updatedAt: 0, ...o,
})

describe('summarizeMealsWeek', () => {
  it('keeps only the week, orders meals, averages over days that have values', () => {
    const w = summarizeMealsWeek(
      [
        m('2026-10-06', 'dinner', 'Food B', 600),
        m('2026-10-06', 'breakfast', 'Food A', 200),
        m('2026-10-07', 'lunch', 'Food C', 1000, { estimated: true }),
        m('2026-10-08', 'snack', 'Food D', null), // logged, no values: not in the averages
        m('2026-09-30', 'lunch', 'Other week', 9999),
        m('2026-10-12', 'lunch', 'Next week', 9999),
      ],
      WEEK,
    )
    expect(w.days.map((d) => d.day)).toEqual(['2026-10-06', '2026-10-07', '2026-10-08'])
    expect(w.days[0]?.entries.map((e) => e.text)).toEqual(['Food A', 'Food B'])
    expect(w.loggedDays).toBe(2)
    expect(w.average).toEqual({ kcal: 900, proteinG: 15, carbsG: 30, fatG: 8 })
    expect(w.approximate).toBe(true)
  })
  it('is empty with no entries, and has no average when nothing has values', () => {
    expect(summarizeMealsWeek([], WEEK)).toEqual({ days: [], loggedDays: 0, average: null, approximate: false })
    expect(summarizeMealsWeek([m('2026-10-06', 'lunch', 'Food A', null)], WEEK).average).toBeNull()
  })
})

describe('export with meals', () => {
  it('adds a Food section and the entries to the JSON; nothing without meals', () => {
    const md = buildExportMarkdown(plan, [], '2026-10-09', [m('2026-10-06', 'lunch', 'Food A', 500, { estimated: true })])
    expect(md).toContain('## Food')
    expect(md).toContain('- Average over 1 logged day: ≈ 500 kcal · P 10 · C 20 · F 5')
    expect(md).toContain('- Tue 2026-10-06: ≈ 500 kcal · P 10 · C 20 · F 5')
    expect(md).toContain('  - lunch: Food A — ≈ 500 kcal')
    expect(buildExportMarkdown(plan, [], '2026-10-09', [m('2026-10-06', 'lunch', 'Food A', 500, { weighed: true })])).toContain('  - lunch: Food A (weighed) — 500 kcal')
    expect(md).toContain('"meals"')
    const plain = buildExportMarkdown(plan, [], '2026-10-09')
    expect(plain).not.toContain('## Food')
    expect(plain).not.toContain('"meals"')
  })
  it('flags entries without values and keeps the export parseable', () => {
    const md = buildExportMarkdown(plan, [], '2026-10-09', [m('2026-10-06', 'lunch', 'Food A', null)])
    expect(md).toContain('- Entries logged, no calories or macros entered')
    expect(md).toContain('- Tue 2026-10-06: no values')
    const json = md.match(/```json\n([\s\S]*?)\n```/)?.[1]
    expect(() => JSON.parse(json ?? '')).not.toThrow()
  })
})
