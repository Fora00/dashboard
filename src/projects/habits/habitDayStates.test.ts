import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck } from '../../lib/db'
import { activeDaysOf, habitDayStates } from './habitDayStates'

const habit = (extra: Partial<Habit> = {}): Habit => ({
  id: 'h',
  name: 'h',
  emoji: '✅',
  createdAt: new Date('2026-10-20T12:00:00').getTime(),
  ...extra,
})
const check = (day: string, extra: Partial<HabitCheck> = {}): HabitCheck => ({
  id: day,
  habitId: 'h',
  day,
  createdAt: 1,
  ...extra,
})

describe('multi-tap habits', () => {
  it('is done only when the taps reach perDay; partial is progress', () => {
    const h = habit({ perDay: 4 })
    const d = habitDayStates(
      h,
      [check('2026-10-21', { count: 3 }), check('2026-10-22', { count: 4 })],
      new Set(),
      '2026-10-23',
    )
    expect(d.states.has('2026-10-21')).toBe(false)
    expect(d.counts.get('2026-10-21')).toBe(3)
    expect(d.states.get('2026-10-22')).toBe('done')
  })

  it('a floor day counts whatever the taps', () => {
    const d = habitDayStates(habit({ perDay: 4 }), [check('2026-10-21', { status: 'floor' })], new Set(), '2026-10-23')
    expect(d.states.get('2026-10-21')).toBe('floor')
  })
})

describe("don't habits", () => {
  const avoid = habit({ direction: 'avoid' })

  it('a day is kept unless a slip is marked, but only on days the app was used', () => {
    const others = [check('2026-10-20'), check('2026-10-22'), check('2026-10-23')] // 21 unused
    const slip = check('2026-10-22', { status: 'fail', note: 'anchor' })
    const d = habitDayStates(avoid, [slip], activeDaysOf(others), '2026-10-23')
    expect(d.states.get('2026-10-20')).toBe('done')
    expect(d.states.has('2026-10-21')).toBe(false) // the app wasn't used: not proof of anything
    expect(d.states.get('2026-10-22')).toBe('fail')
    expect(d.notes.get('2026-10-22')).toBe('anchor')
    expect(d.states.get('2026-10-23')).toBe('done')
  })

  it('today counts as kept so far even before anything is logged', () => {
    expect(habitDayStates(avoid, [], new Set(), '2026-10-23').states.get('2026-10-23')).toBe('done')
  })

  it('a normal habit gets no default days', () => {
    expect(habitDayStates(habit(), [], new Set(['2026-10-21']), '2026-10-23').states.size).toBe(0)
  })
})

describe('daily grace for habits to avoid', () => {
  const phone = habit({ direction: 'avoid', grace: 2, graceScope: 'day' })

  it('each tap is a slip: within the grace the day is kept, past it it is a slip', () => {
    const d = habitDayStates(
      phone,
      [
        check('2026-10-21', { status: 'fail', count: 1 }),
        check('2026-10-22', { status: 'fail', count: 2 }),
        check('2026-10-23', { status: 'fail', count: 3 }),
      ],
      new Set(),
      '2026-10-23',
    )
    expect(d.states.get('2026-10-21')).toBe('floor')
    expect(d.states.get('2026-10-22')).toBe('floor')
    expect(d.states.get('2026-10-23')).toBe('fail')
    expect(d.slips.get('2026-10-23')).toBe(3)
    expect(d.counts.size).toBe(0) // slips are not wins on the lifeboard
  })

  it('a miss marked by hand (no count) is a full slip, never within the grace', () => {
    const d = habitDayStates(phone, [check('2026-10-21', { status: 'fail' })], new Set(), '2026-10-23')
    expect(d.states.get('2026-10-21')).toBe('fail')
    expect(d.slips.get('2026-10-21')).toBe(3)
  })

  it('without a day scope a fail stays a fail', () => {
    const d = habitDayStates(
      habit({ direction: 'avoid', grace: 2 }),
      [check('2026-10-21', { status: 'fail', count: 1 })],
      new Set(),
      '2026-10-23',
    )
    expect(d.states.get('2026-10-21')).toBe('fail')
  })
})
