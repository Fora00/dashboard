import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck } from '../../../lib/db'
import { liveHabitRatiosByWeek } from './liveHabitRatios'

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
})
