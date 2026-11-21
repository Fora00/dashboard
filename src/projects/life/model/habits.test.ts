import { describe, expect, it } from 'vitest'
import type { LifePlan } from '../../../lib/db'
import { buildExportMarkdown } from './export'
import {
  habitTag,
  isoWeek,
  isoWeekLabel,
  mondaysOf,
  toLifeHabit,
  weekHabitLine,
  weekHabitTotal,
  type HabitRecapLike,
  type LifeHabit,
} from './habits'
import { buildMonthMarkdown, buildMonthReport } from './month'

const plan: LifePlan = {
  version: 1,
  week: '2026-11-16',
  focus: [],
  rules: [],
  tasks: [],
  trackers: [],
  sundayCheck: [],
  checkins: [],
}

const row = (over: Partial<HabitRecapLike> = {}, habit: Partial<HabitRecapLike['habit']> = {}): HabitRecapLike => ({
  habit: { id: 'h1', emoji: '📖', name: 'Habit A', engine: 'mind', target: 5, ...habit },
  cells: [
    { state: 'done' },
    { state: 'done' },
    { state: 'floor' },
    { state: 'skip' },
    { state: 'empty' },
    { state: 'future' },
    { state: 'future' },
  ],
  done: 3,
  floor: 1,
  skip: 1,
  fail: 0,
  empty: 1,
  expected: 3,
  hit: true,
  graceUsed: 0,
  extra: 0,
  reasons: { tired: 1 },
  ...over,
})

describe('ISO week', () => {
  it('numbers weeks, ISO year included', () => {
    expect(isoWeek('2026-11-16')).toEqual({ year: 2026, week: 47 })
    expect(isoWeek('2026-12-28')).toEqual({ year: 2026, week: 53 })
    expect(isoWeek('2024-12-30')).toEqual({ year: 2025, week: 1 })
    expect(isoWeekLabel('2026-11-16')).toBe('2026-W47 (16/11)')
    expect(isoWeekLabel('2026-01-05')).toBe('2026-W02 (05/01)')
  })

  it('lists the Mondays starting in a month, up to a day', () => {
    expect(mondaysOf('2026-11')).toEqual(['2026-11-02', '2026-11-09', '2026-11-16', '2026-11-23', '2026-11-30'])
    expect(mondaysOf('2026-11', '2026-11-22')).toEqual(['2026-11-02', '2026-11-09', '2026-11-16'])
  })
})

describe('toLifeHabit', () => {
  it('carries the engine, target, days to come and labelled reasons', () => {
    const h = toLifeHabit(row(), (r) => r.toUpperCase())
    expect(h).toMatchObject({ id: 'h1', engine: 'mind', target: 5, future: 2, reasons: { TIRED: 1 } })
    expect(h.experiment).toBeUndefined()
  })

  it('marks experiments with their month and drops unknown engines', () => {
    const h = toLifeHabit(row({}, { kind: 'experiment', cycleStart: '2026-11-02', engine: undefined }))
    expect(h.engine).toBeNull()
    expect(h.experiment).toEqual({ month: '2026-11', start: '2026-11-02', end: null, verdict: null })
    expect(habitTag(h)).toBe('[no engine · experiment for 2026-11]')
  })
})

describe('week export: Habits', () => {
  const habits: LifeHabit[] = [
    toLifeHabit(row()),
    toLifeHabit(
      row(
        { done: 0, floor: 0, skip: 0, fail: 2, graceUsed: 1, hit: false, reasons: {}, empty: 3 },
        {
          id: 'h2',
          emoji: '🚭',
          name: 'Habit B',
          direction: 'avoid',
          grace: 1,
          engine: 'physical-health',
        },
      ),
    ),
  ]

  it('writes one line per habit with engine, days of 7, target and verdict', () => {
    expect(weekHabitLine(habits[0]!)).toBe(
      '- 📖 Habit A [Mind]: 3 done (1 floor), 1 rest, 0 missed, 1 unmarked, 2 to come of 7 days; target 5/week (3 expected): hit; reasons: tired x1',
    )
    expect(weekHabitLine(habits[1]!)).toBe(
      "- 🚭 Habit B (don't) [Physical Health]: 0 done, 0 rest, 2 slipped (1 within grace), 3 unmarked, 2 to come of 7 days; limit 1 slip/week (3 expected): missed",
    )
  })

  it('puts the ISO week in the header and the habits in Markdown and JSON', () => {
    const md = buildExportMarkdown(plan, [], '2026-11-20', [], undefined, null, habits)
    expect(md.split('\n')[0]).toBe('# Life week 2026-W47 (16/11) · Week of 2026-11-16')
    expect(md).toContain('## Habits (live, from the Habits page)')
    expect(md).toContain('"habits": [')
    expect(md).toContain('"engine": "physical-health"')
  })

  it('leaves Habits out when there are none', () => {
    const md = buildExportMarkdown(plan, [], '2026-11-20')
    expect(md).not.toContain('## Habits')
    expect(md).not.toContain('"habits"')
  })
})

describe('month export: Weeks', () => {
  it('writes one totals line per week', () => {
    const h = toLifeHabit(row({ done: 5, hit: true }))
    expect(weekHabitTotal(h, false)).toBe('📖 Habit A 5/5 hit')
    expect(weekHabitTotal(h, true)).toBe('📖 Habit A 5/5 so far')
    const report = buildMonthReport('2026-11', [], [], '2026-11-20')
    const md = buildMonthMarkdown(
      report,
      [],
      [h],
      [
        { week: '2026-11-09', partial: false, habits: [h] },
        { week: '2026-11-16', partial: true, habits: [h] },
      ],
    )
    expect(md).toContain('- 📖 Habit A [Mind]: 5 done (1 floor) of 3 expected')
    expect(md).toContain('## Weeks (Habits-page totals per week starting in the month)')
    expect(md).toContain('- 2026-W46 (09/11): 📖 Habit A 5/5 hit')
    expect(md).toContain('- 2026-W47 (16/11) (week not over): 📖 Habit A 5/5 so far')
  })

  it('leaves Weeks out when none are given', () => {
    expect(buildMonthMarkdown(buildMonthReport('2026-11', [], [], '2026-11-20'), [])).not.toContain('## Weeks')
  })
})
