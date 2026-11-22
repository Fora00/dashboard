import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import { calendarMonth, chipText, chipTone, weekChip, type CalendarWeek } from './habitCalendarData'
import { shiftDayKey } from './habitStats'

const TODAY = '2026-11-22' // a Sunday
const LIMITS = [{ app: 'App A', minutes: 40 }] // 280 min a week allowed

const measured = (over: Partial<Habit> = {}): Habit => ({
  id: 'm',
  name: 'Habit M',
  emoji: '📱',
  createdAt: new Date('2026-10-01T12:00:00').getTime(),
  direction: 'avoid',
  measure: 'app-limits',
  measureLimits: LIMITS,
  ...over,
})

/** Like habitDayStates for a "don't" habit: every day from the start kept (derived) unless stored. */
function avoidStates(stored: Record<string, HabitDayState>): Map<string, HabitDayState> {
  const out = new Map<string, HabitDayState>()
  for (let d = '2026-10-01'; d <= TODAY; d = shiftDayKey(d, 1)) out.set(d, stored[d] ?? 'done')
  return out
}

const row = (weeks: CalendarWeek[], monday: string) => weeks.find((w) => w.week === monday)!
const looks = (w: CalendarWeek) => w.days.map((d) => d?.look ?? null)

describe('calendarMonth: a measured habit', () => {
  const stored = { '2026-11-18': 'fail' as const }
  const states = avoidStates(stored)
  const weeks = calendarMonth({
    habit: measured(),
    states,
    storedDays: new Set(Object.keys(stored)),
    apps: new Map([
      ['2026-11-02', [{ app: 'App A', minutes: 100 }]], // under the limit: verified, hit
      ['2026-11-09', [{ app: 'App A', minutes: 400 }]], // 120 over: 8 proven, 0 ticked
    ]),
    month: '2026-11',
    today: TODAY,
  })

  it('rows are Monday-start Life week keys', () => {
    expect(weeks.map((w) => w.week)).toEqual([
      '2026-10-26',
      '2026-11-02',
      '2026-11-09',
      '2026-11-16',
      '2026-11-23',
      '2026-11-30',
    ])
  })

  it('verified and hit: unticked days render as kept, chip ✓', () => {
    const w = row(weeks, '2026-11-02')
    expect(looks(w)).toEqual(Array(7).fill('done'))
    expect(w.chip).toMatchObject({ kind: 'hit' })
    expect(chipText(w.chip!)).toBe('✓')
  })

  it('verified with more proven than ticked: unticked days stay neutral, chip ≥N ✕', () => {
    const w = row(weeks, '2026-11-09')
    expect(looks(w)).toEqual(Array(7).fill('unverified'))
    expect(w.chip).toMatchObject({ kind: 'miss', slips: 8 })
    expect(chipText(w.chip!)).toBe('≥8 ✕')
  })

  it('no Sunday apps answer: unticked days neutral, a marked slip still shows, chip ?', () => {
    const w = row(weeks, '2026-11-16')
    expect(looks(w)).toEqual([
      'unverified',
      'unverified',
      'fail',
      'unverified',
      'unverified',
      'unverified',
      'unverified',
    ])
    expect(w.chip).toMatchObject({ kind: 'unverified', manual: 1 })
    expect(chipText(w.chip!)).toBe('?')
  })

  it('a week not begun has no chip', () => {
    expect(row(weeks, '2026-11-23').chip).toBeNull()
    expect(row(weeks, '2026-11-30').chip).toBeNull()
  })
})

describe('calendarMonth: proven no more than ticked keeps the normal rendering', () => {
  it('1 slip ticked, 1 extension proven, grace 1: kept days green, chip ✓', () => {
    const stored = { '2026-11-04': 'fail' as const }
    const weeks = calendarMonth({
      habit: measured({ grace: 1 }),
      states: avoidStates(stored),
      storedDays: new Set(Object.keys(stored)),
      apps: new Map([['2026-11-02', [{ app: 'App A', minutes: 290 }]]]),
      month: '2026-11',
      today: TODAY,
    })
    const w = row(weeks, '2026-11-02')
    expect(looks(w)).toEqual(['done', 'done', 'fail', 'done', 'done', 'done', 'done'])
    expect(w.chip).toMatchObject({ kind: 'hit', slips: 1, verified: 1 })
  })

  it('an explicitly marked kept day stays green even unverified', () => {
    const stored = { '2026-11-17': 'done' as const }
    const weeks = calendarMonth({
      habit: measured(),
      states: avoidStates(stored),
      storedDays: new Set(Object.keys(stored)),
      apps: new Map(),
      month: '2026-11',
      today: TODAY,
    })
    expect(looks(row(weeks, '2026-11-16'))[1]).toBe('done')
    expect(looks(row(weeks, '2026-11-16'))[0]).toBe('unverified')
  })
})

describe('calendarMonth: a simple habit keeps its cells and gets a plain week chip', () => {
  it('no neutral days, derived kept days green', () => {
    const habit: Habit = { id: 's', name: 'S', emoji: '🙂', createdAt: measured().createdAt, direction: 'avoid' }
    const weeks = calendarMonth({
      habit,
      states: avoidStates({}),
      storedDays: new Set(),
      month: '2026-11',
      today: TODAY,
    })
    expect(weeks.flatMap(looks)).not.toContain('unverified')
    expect(looks(row(weeks, '2026-11-16'))).toEqual(Array(7).fill('done'))
    expect(row(weeks, '2026-11-23').chip).toBeNull()
  })

  it('a habit to do: done/target, hit or miss once the week is over, in progress while it runs', () => {
    const habit: Habit = { id: 'd', name: 'D', emoji: '🏃', createdAt: measured().createdAt, target: 3 }
    const states = new Map<string, HabitDayState>([
      ['2026-11-03', 'done'],
      ['2026-11-05', 'floor'],
      ['2026-11-07', 'done'],
      ['2026-11-10', 'done'],
      ['2026-11-17', 'done'],
    ])
    const input = { habit, states, storedDays: new Set(states.keys()), month: '2026-11' }
    const weeks = calendarMonth({ ...input, today: '2026-11-20' })
    expect(row(weeks, '2026-11-02').chip).toEqual({ kind: 'count', done: 3, of: 3, status: 'hit' })
    expect(row(weeks, '2026-11-09').chip).toEqual({ kind: 'count', done: 1, of: 3, status: 'miss' })
    expect(row(weeks, '2026-11-16').chip).toEqual({ kind: 'count', done: 1, of: 3, status: 'progress' })
    expect(chipText(row(weeks, '2026-11-09').chip!)).toBe('1/3')
    expect(chipTone(row(weeks, '2026-11-16').chip!)).toBe('progress')
  })

  it('a habit to avoid: slips/limit', () => {
    const habit: Habit = {
      id: 'a',
      name: 'A',
      emoji: '🚭',
      createdAt: measured().createdAt,
      direction: 'avoid',
      grace: 1,
    }
    const stored = { '2026-11-04': 'fail' as const, '2026-11-10': 'fail' as const, '2026-11-12': 'fail' as const }
    const weeks = calendarMonth({
      habit,
      states: avoidStates(stored),
      storedDays: new Set(Object.keys(stored)),
      month: '2026-11',
      today: '2026-11-20',
    })
    expect(row(weeks, '2026-11-02').chip).toEqual({ kind: 'slips', slips: 1, limit: 1, status: 'hit' })
    expect(row(weeks, '2026-11-09').chip).toEqual({ kind: 'slips', slips: 2, limit: 1, status: 'miss' })
    expect(row(weeks, '2026-11-16').chip).toEqual({ kind: 'slips', slips: 0, limit: 1, status: 'progress' })
    expect(chipText(row(weeks, '2026-11-09').chip!)).toBe('2/1')
  })

  it('a daily grace: days past the daily limit, ✓ when none', () => {
    const habit: Habit = {
      id: 'g',
      name: 'G',
      emoji: '📵',
      createdAt: measured().createdAt,
      direction: 'avoid',
      grace: 2,
      graceScope: 'day',
    }
    const stored = { '2026-11-10': 'fail' as const, '2026-11-11': 'floor' as const }
    const weeks = calendarMonth({
      habit,
      states: avoidStates(stored),
      storedDays: new Set(Object.keys(stored)),
      month: '2026-11',
      today: '2026-11-20',
    })
    expect(row(weeks, '2026-11-09').chip).toMatchObject({ kind: 'slips', slips: 1, limit: 0, status: 'miss' })
    expect(chipText(row(weeks, '2026-11-09').chip!)).toBe('1 ✕')
    expect(chipText(row(weeks, '2026-11-02').chip!)).toBe('✓')
  })
})

describe('weekChip', () => {
  it('nothing expected = no chip', () => {
    expect(weekChip(null)).toBeNull()
    expect(
      weekChip({ week: '2026-11-23', manual: 0, evidence: null, slips: null, manualHit: null, hit: null }),
    ).toBeNull()
  })
})
