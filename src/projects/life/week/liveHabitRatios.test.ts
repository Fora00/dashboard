import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck } from '../../../lib/db'
import { habitWeekRows, liveHabitRatiosByWeek } from './liveHabitRatios'

const habit: Habit = {
  id: 'h',
  name: 'Read',
  emoji: '📖',
  createdAt: new Date('2026-10-01T12:00:00').getTime(),
}
const check = (day: string): HabitCheck => ({ id: day, habitId: 'h', day, createdAt: 1 })

describe('liveHabitRatiosByWeek', () => {
  it('is the share of expected days done, per week', () => {
    const checks = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29'].map(check)
    const r = liveHabitRatiosByWeek([habit], checks, ['2026-10-26'], '2026-11-01')
    expect(r.get('2026-10-26')).toEqual([4 / 7])
  })

  it('skips archived habits and weeks with nothing expected', () => {
    expect(liveHabitRatiosByWeek([{ ...habit, archivedAt: 1 }], [], ['2026-10-26'], '2026-11-01').size).toBe(0)
    expect(liveHabitRatiosByWeek([habit], [], ['2026-12-07'], '2026-11-01').size).toBe(0)
  })

  it('leaves out a habit that overshot its weekly target', () => {
    const weekly = { ...habit, target: 3 }
    const checks = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29'].map(check)
    expect(liveHabitRatiosByWeek([weekly], checks, ['2026-10-26'], '2026-11-01').size).toBe(0)
    // exactly on target still counts as 100%
    const exact = liveHabitRatiosByWeek([weekly], checks.slice(0, 3), ['2026-10-26'], '2026-11-01')
    expect(exact.get('2026-10-26')).toEqual([1])
  })
})

describe('habitWeekRows', () => {
  it('counts done days against the weekly target', () => {
    const weekly = { ...habit, target: 3 }
    const checks = ['2026-10-26', '2026-10-28'].map(check)
    const r = habitWeekRows([weekly], checks, ['2026-10-26'], '2026-11-01')
    expect(r.get('2026-10-26')).toEqual([
      { id: 'h', emoji: '📖', name: 'Read', done: 2, target: 3, avoid: false, slips: 0, hit: false },
    ])
  })

  it('leaves out habits not created yet and archived ones with nothing done', () => {
    expect(habitWeekRows([habit], [], ['2026-09-21'], '2026-11-01').size).toBe(0)
    expect(habitWeekRows([{ ...habit, archivedAt: 1 }], [], ['2026-10-26'], '2026-11-01').size).toBe(0)
    const kept = habitWeekRows([{ ...habit, archivedAt: 1 }], [check('2026-10-27')], ['2026-10-26'], '2026-11-01')
    expect(kept.get('2026-10-26')?.[0]?.done).toBe(1)
  })
})
