import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck } from '../../lib/db'
import { activeDaysOf, displayCell, habitBounds, habitDayStates, habitStartDay } from './habitDayStates'
import { overshootOf, slipLimit } from './habitStates'

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

describe('overshoot', () => {
  it('a once-a-day habit logged twice is done with count 2', () => {
    const d = habitDayStates(habit(), [check('2026-10-21', { count: 2 }), check('2026-10-22')], new Set(), '2026-10-23')
    expect(d.states.get('2026-10-21')).toBe('done')
    expect(d.counts.get('2026-10-21')).toBe(2)
    expect(d.counts.get('2026-10-22')).toBe(1) // by hand = the goal exactly
  })

  it('a multi-tap habit keeps counting past perDay', () => {
    const d = habitDayStates(habit({ perDay: 2 }), [check('2026-10-21', { count: 5 })], new Set(), '2026-10-23')
    expect(d.states.get('2026-10-21')).toBe('done')
    expect(d.counts.get('2026-10-21')).toBe(5)
  })
})

describe("overshoot of a don't habit", () => {
  it('a plain slip counts 1, extra slips are logged as a count', () => {
    const h = habit({ direction: 'avoid' })
    const d = habitDayStates(
      h,
      [check('2026-10-21', { status: 'fail' }), check('2026-10-22', { status: 'fail', count: 4 })],
      new Set(),
      '2026-10-23',
    )
    expect(d.states.get('2026-10-22')).toBe('fail')
    expect(d.slips.get('2026-10-21')).toBe(1)
    expect(d.slips.get('2026-10-22')).toBe(4)
    expect(overshootOf(h, 0, 4)).toBe(3)
    expect(overshootOf(h, 0, 1)).toBe(0)
  })

  it('with a daily grace the limit is grace + 1', () => {
    const h = habit({ direction: 'avoid', grace: 2, graceScope: 'day' })
    expect(slipLimit(h)).toBe(3)
    expect(overshootOf(h, 0, 3)).toBe(0)
    expect(overshootOf(h, 0, 5)).toBe(2)
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

describe('displayCell (TH1: every past day of a daily habit shows its state)', () => {
  const today = '2026-10-23'
  const daily = habit() // created 2026-10-20, target 7 (default), direction do
  const bounds = habitBounds(daily)

  it('a stored state always wins, even in the future (planned rest)', () => {
    expect(displayCell(daily, '2026-10-21', 'skip', today, bounds)).toBe('skip')
    expect(displayCell(daily, '2026-10-30', 'skip', today, bounds)).toBe('skip')
    expect(displayCell(daily, '2026-10-10', 'done', today, bounds)).toBe('done')
  })

  it('an empty past day of a daily habit is missed; today stays blank; later days are future', () => {
    expect(displayCell(daily, '2026-10-22', undefined, today, bounds)).toBe('missed')
    expect(displayCell(daily, '2026-10-20', undefined, today, bounds)).toBe('missed')
    expect(displayCell(daily, today, undefined, today, bounds)).toBe('empty')
    expect(displayCell(daily, '2026-10-24', undefined, today, bounds)).toBe('future')
  })

  it('nothing before the habit started, nor after it was archived', () => {
    expect(displayCell(daily, '2026-10-19', undefined, today, bounds)).toBe('before')
    const archived = habit({ archivedAt: new Date('2026-10-21T18:00:00').getTime() })
    const b = habitBounds(archived)
    expect(b.end).toBe('2026-10-21')
    expect(displayCell(archived, '2026-10-21', undefined, today, b)).toBe('missed')
    expect(displayCell(archived, '2026-10-22', undefined, today, b)).toBe('after')
  })

  it('a cycle end counts only once the cycle is closed', () => {
    const running = habit({ cycleEnd: '2026-10-21' })
    expect(displayCell(running, '2026-10-22', undefined, today, habitBounds(running))).toBe('missed')
    const closed = habit({ cycleEnd: '2026-10-21', verdict: 'closed' })
    expect(displayCell(closed, '2026-10-22', undefined, today, habitBounds(closed))).toBe('after')
  })

  it('weekly habits and habits to avoid keep empty days blank', () => {
    const weekly = habit({ target: 3 })
    expect(displayCell(weekly, '2026-10-22', undefined, today, habitBounds(weekly))).toBe('empty')
    const avoid = habit({ direction: 'avoid' })
    expect(displayCell(avoid, '2026-10-22', undefined, today, habitBounds(avoid))).toBe('empty')
  })

  it('the start is the earliest of creation, cycle start and the first marked day', () => {
    expect(habitStartDay(daily)).toBe('2026-10-20')
    expect(habitStartDay(habit({ cycleStart: '2026-10-18' }))).toBe('2026-10-18')
    expect(habitStartDay(daily, ['2026-10-15', '2026-10-22'])).toBe('2026-10-15')
    expect(habitBounds(daily, new Map([['2026-10-17', 'fail']])).start).toBe('2026-10-17')
  })

  it('a habit to avoid gets no kept days after it was archived', () => {
    const avoid = habit({ direction: 'avoid', archivedAt: new Date('2026-10-21T18:00:00').getTime() })
    const d = habitDayStates(avoid, [], new Set(['2026-10-20', '2026-10-21', '2026-10-22']), today)
    expect([...d.states.keys()].sort()).toEqual(['2026-10-20', '2026-10-21'])
  })
})
