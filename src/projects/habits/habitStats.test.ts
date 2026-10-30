import { describe, expect, it } from 'vitest'
import { habitStats, monthGrid, weekStart } from './habitStats'

import type { HabitDayState } from '../../lib/db'

const set = (...d: string[]) => new Map<string, HabitDayState>(d.map((x) => [x, 'done']))
const withState = (m: Map<string, HabitDayState>, state: HabitDayState, ...d: string[]) => {
  for (const x of d) m.set(x, state)
  return m
}
// 2026-11-01 is a Sunday; the Monday of its week is 2026-10-26.
const habit = (target: number | undefined, extra = {}) => ({
  target,
  createdAt: new Date(2026, 9, 1).getTime(),
  cycleStart: undefined,
  cycleEnd: undefined,
  ...extra,
})

describe('weekStart', () => {
  it('is the Monday of the week', () => {
    expect(weekStart('2026-11-01')).toBe('2026-10-26')
    expect(weekStart('2026-10-26')).toBe('2026-10-26')
  })
})

describe('habitStats', () => {
  it('counts the current week against the weekly target', () => {
    const s = habitStats(habit(3), set('2026-10-27', '2026-10-30'), '2026-10-31')
    expect(s.week).toMatchObject({ start: '2026-10-26', done: 2, expected: 3, hit: false })
  })

  it('a skip lowers what the week expects, and is not a miss', () => {
    const s = habitStats(
      habit(7, { createdAt: new Date(2026, 9, 26).getTime() }),
      withState(set('2026-10-26', '2026-10-27'), 'skip', '2026-10-28'),
      '2026-10-28',
    )
    expect(s.week).toMatchObject({ done: 2, skipped: 1, expected: 6 })
    expect(s.longestGap).toBe(0)
  })

  it('counts a return after 2+ empty days (daily) and the longest gap', () => {
    const done = set('2026-10-20', '2026-10-21', '2026-10-25', '2026-10-26')
    const s = habitStats(habit(7, { createdAt: new Date(2026, 9, 20).getTime() }), done, '2026-10-26')
    expect(s.returns).toBe(1)
    expect(s.longestGap).toBe(3)
  })

  it('weekly habits: a hit week after a missed week is a return', () => {
    const done = set('2026-10-20', '2026-10-22')
    const s = habitStats(habit(2, { createdAt: new Date(2026, 9, 5).getTime() }), done, '2026-10-28')
    expect(s.returns).toBe(1)
    expect(s.lastWeeks.at(-1)).toMatchObject({ start: '2026-10-19', hit: true })
  })

  it('a young habit has no rate yet and no weeks before it existed', () => {
    const s = habitStats(habit(7, { createdAt: new Date(2026, 9, 28).getTime() }), set('2026-10-28'), '2026-10-29')
    expect(s.rate30).toBeNull()
    expect(s.lastWeeks).toHaveLength(0)
  })

  it('reports the cycle day and length', () => {
    const s = habitStats(habit(7, { cycleStart: '2026-11-01', cycleEnd: '2026-11-28' }), set(), '2026-11-10')
    expect(s.cycle).toEqual({ day: 10, length: 28 })
  })

  it('splits done days by weekday, Monday first', () => {
    const s = habitStats(habit(7), set('2026-10-26', '2026-11-01'), '2026-11-01')
    expect(s.byWeekday).toEqual([1, 0, 0, 0, 0, 0, 1])
  })
})

describe('streaks and floor', () => {
  const young = (d: string) => habit(7, { createdAt: new Date(`${d}T12:00:00`).getTime() })

  it('floor counts as done; the current and best streak follow', () => {
    const m = withState(set('2026-10-20', '2026-10-21', '2026-10-22'), 'floor', '2026-10-23')
    set('2026-10-25').forEach((v, k) => m.set(k, v))
    const s = habitStats(young('2026-10-20'), m, '2026-10-26')
    expect(s.bestStreak).toBe(4)
    expect(s.streak).toBe(1) // 24 empty broke it; 25 done; 26 (today) empty is neutral
  })

  it('today empty does not break the streak, a skip is neutral, a fail breaks', () => {
    const m = withState(set('2026-10-20', '2026-10-22', '2026-10-23'), 'skip', '2026-10-21')
    expect(habitStats(young('2026-10-20'), m, '2026-10-24').streak).toBe(3)
    withState(m, 'fail', '2026-10-23')
    expect(habitStats(young('2026-10-20'), m, '2026-10-24').streak).toBe(0)
  })

  it('counts floor days in the 30-day window', () => {
    const m = withState(set('2026-10-20'), 'floor', '2026-10-21', '2026-10-22')
    const s = habitStats(young('2026-10-20'), m, '2026-10-22')
    expect(s.floor30).toBe(2)
    expect(s.done30).toBe(3)
  })

  it('weekly habits: streak counts hit weeks', () => {
    const m = set('2026-10-12', '2026-10-14', '2026-10-19', '2026-10-21', '2026-10-27')
    const s = habitStats(habit(2, { createdAt: new Date(2026, 9, 12).getTime() }), m, '2026-10-28')
    expect(s.streakUnit).toBe('weeks')
    expect(s.bestStreak).toBe(2)
    expect(s.streak).toBe(2) // this week (1/2) isn't hit yet but doesn't break it
  })
})

describe('two-day rule gap', () => {
  const young = (d: string) => habit(7, { createdAt: new Date(`${d}T12:00:00`).getTime() })

  it('counts empty or missed days up to yesterday; today does not count', () => {
    const m = withState(set('2026-10-20'), 'fail', '2026-10-22')
    expect(habitStats(young('2026-10-20'), m, '2026-10-23').gap).toBe(2) // 21 empty, 22 fail
    expect(habitStats(young('2026-10-20'), m, '2026-10-22').gap).toBe(1)
  })

  it('a skip or a done day resets it; a new habit has no gap; weekly habits never have one', () => {
    const m = withState(set('2026-10-20'), 'skip', '2026-10-22')
    expect(habitStats(young('2026-10-20'), m, '2026-10-23').gap).toBe(0)
    expect(habitStats(young('2026-10-23'), new Map(), '2026-10-23').gap).toBe(0)
    expect(habitStats(habit(3, { createdAt: new Date(2026, 9, 1).getTime() }), new Map(), '2026-10-23').gap).toBe(0)
  })
})

describe('monthGrid', () => {
  it('pads to full Monday-first weeks', () => {
    const rows = monthGrid('2026-11', '2026-11-10')
    expect(rows.every((r) => r.length === 7)).toBe(true)
    expect(rows[0]![6]?.day).toBe('2026-11-01') // Sunday
    expect(rows[0]![0]).toBeNull()
    expect(rows.flat().find((c) => c?.day === '2026-11-11')?.future).toBe(true)
  })
})

describe('restWarnings', () => {
  it('stays quiet for the first rest day, warns at the third in a week, in a row, or after a gap', async () => {
    const { restWarnings } = await import('./habitStats')
    expect(restWarnings({ restWeek: 0, restRun: 0, gap: 0 }, false)).toEqual([])
    expect(restWarnings({ restWeek: 2, restRun: 0, gap: 0 }, false)[0]).toMatch(/number 3 this week/)
    expect(restWarnings({ restWeek: 1, restRun: 1, gap: 0 }, false).join(' ')).toMatch(/2 rest days in a row/)
    expect(restWarnings({ restWeek: 0, restRun: 0, gap: 1 }, false).join(' ')).toMatch(/Yesterday had nothing marked/)
    expect(restWarnings({ restWeek: 5, restRun: 5, gap: 0 }, true)).toEqual([])
  })
})

describe('grace for habits to avoid', () => {
  const avoid = (grace: number) => ({
    ...habit(7, { createdAt: new Date('2026-10-26T12:00:00').getTime() }),
    direction: 'avoid' as const,
    grace,
  })
  // 26 Oct is a Monday: week = 26 Oct .. 1 Nov
  const week = (...fails: string[]) => {
    const m = new Map<string, HabitDayState>()
    for (let d = 26; d <= 30; d++) m.set(`2026-10-${d}`, 'done')
    for (const f of fails) m.set(f, 'fail')
    return m
  }

  it('slips inside the grace do not break the streak; the one past it does', () => {
    expect(habitStats(avoid(2), week('2026-10-27', '2026-10-28'), '2026-10-30').streak).toBe(5)
    expect(habitStats(avoid(1), week('2026-10-27', '2026-10-28'), '2026-10-30').streak).toBe(2)
    expect(habitStats(avoid(0), week('2026-10-27'), '2026-10-30').streak).toBe(3)
  })

  it('reports the grace used this week, and the grace resets every week', () => {
    const s = habitStats(avoid(2), week('2026-10-27'), '2026-10-30')
    expect(s).toMatchObject({ grace: 2, graceUsedWeek: 1 })
    const next = week('2026-10-27')
    next.set('2026-11-02', 'fail')
    expect(habitStats(avoid(1), next, '2026-11-03').gracedDays).toEqual(new Set(['2026-10-27', '2026-11-02']))
  })

  it('a normal habit ignores grace; graced slips are not counted as done days', () => {
    expect(habitStats({ ...habit(7), grace: 3 }, week('2026-10-27'), '2026-10-30').grace).toBe(0)
    expect(habitStats(avoid(2), week('2026-10-27'), '2026-10-30').doneTotal).toBe(4)
  })
})
