import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck, LifeEntry, LifePlan } from './db'
import type { EventItem } from '../projects/events/types'
import { eventWhen, habitProgress, lifeToday, nextEvents } from './homeToday'

const habit = (id: string, archivedAt?: number): Habit => ({
  id,
  name: id,
  emoji: '•',
  createdAt: 0,
  archivedAt,
})
const check = (habitId: string, day: string): HabitCheck => ({
  id: `${habitId}:${day}`,
  habitId,
  day,
  createdAt: 0,
})

describe('habitProgress', () => {
  const T = '2026-10-08'
  const withCheck = (habitId: string, day: string, extra: Partial<HabitCheck> = {}): HabitCheck => ({
    ...check(habitId, day),
    ...extra,
  })
  it('counts done habits, not other days', () => {
    const p = habitProgress([habit('a'), habit('b')], [check('a', T), check('b', '2026-10-07')], T)
    expect(p).toEqual({ done: 1, total: 2, remaining: 1 })
  })
  it('a rest day is not remaining and not done', () => {
    const p = habitProgress([habit('a'), habit('b')], [withCheck('a', T, { status: 'skip' })], T)
    expect(p).toEqual({ done: 0, total: 1, remaining: 1 })
  })
  it('a missed day is not done', () => {
    const p = habitProgress([habit('a')], [withCheck('a', T, { status: 'fail' })], T)
    expect(p).toEqual({ done: 0, total: 1, remaining: 1 })
  })
  it('a partial multi-tap is not done until it reaches perDay', () => {
    const h = { ...habit('a'), perDay: 3 }
    expect(habitProgress([h], [withCheck('a', T, { count: 2 })], T).done).toBe(0)
    expect(habitProgress([h], [withCheck('a', T, { count: 3 })], T).done).toBe(1)
  })
  it('a floor day is done', () => {
    expect(habitProgress([habit('a')], [withCheck('a', T, { status: 'floor' })], T).done).toBe(1)
  })
  it("never counts a don't habit as remaining", () => {
    const avoid = { ...habit('n'), direction: 'avoid' as const }
    expect(habitProgress([avoid, habit('a')], [check('a', T)], T)).toEqual({ done: 1, total: 1, remaining: 0 })
  })
  it('ignores archived, not-yet-started and ended habits', () => {
    const p = habitProgress(
      [
        habit('arch', 5),
        { ...habit('future'), cycleStart: '2026-11-01' },
        { ...habit('ended'), cycleEnd: '2026-10-01', verdict: 'closed' as const },
        habit('a'),
      ],
      [],
      T,
    )
    expect(p).toEqual({ done: 0, total: 1, remaining: 1 })
  })
  it('is 0/0 without habits', () => {
    expect(habitProgress([], [], T)).toEqual({ done: 0, total: 0, remaining: 0 })
  })
})

const ev = (id: string, start: string, end: string | null = null, allDay = false): EventItem =>
  ({
    id,
    title: id,
    start,
    end,
    allDay,
    ongoing: false,
    venue: null,
    city: 'Milano',
    occurrences: 1,
    tags: [],
  }) as unknown as EventItem

describe('nextEvents', () => {
  const now = Date.parse('2026-10-08T12:00:00+02:00')
  it('skips finished and long-running events, sorts by start, limits', () => {
    const list = [
      ev('late', '2026-10-10T20:00:00+02:00', '2026-10-10T22:00:00+02:00'),
      ev('past', '2026-10-08T09:00:00+02:00', '2026-10-08T10:00:00+02:00'),
      ev('expo', '2026-09-01T00:00:00+02:00', '2026-12-01T00:00:00+01:00', true),
      ev('soon', '2026-10-08T19:00:00+02:00', '2026-10-08T21:00:00+02:00'),
      ev('mid', '2026-10-09T10:00:00+02:00', '2026-10-09T11:00:00+02:00'),
      ev('far', '2026-11-01T10:00:00+01:00', '2026-11-01T11:00:00+01:00'),
    ]
    expect(nextEvents(list, now, 3).map((e) => e.id)).toEqual(['soon', 'mid', 'late'])
  })
  it('is empty for no events', () => {
    expect(nextEvents([], now)).toEqual([])
  })
})

describe('eventWhen', () => {
  const now = Date.parse('2026-10-08T12:00:00+02:00')
  it('labels today, tomorrow and later dates', () => {
    expect(eventWhen(ev('a', '2026-10-08T19:30:00+02:00'), now)).toBe('Today 19:30')
    expect(eventWhen(ev('b', '2026-10-09T00:00:00+02:00', null, true), now)).toBe('Tomorrow')
    expect(eventWhen(ev('c', '2026-10-17T10:00:00+02:00'), now)).toBe('Sat 17 Oct 10:00')
  })
})

describe('lifeToday', () => {
  const plan = {
    version: 1,
    week: '2026-10-05',
    focus: [
      { id: 'f1', title: 'One' },
      { id: 'f2', title: 'Two' },
    ],
    rules: [],
    tasks: [],
    trackers: [
      {
        id: 't1',
        emoji: '🧗',
        label: 'Climb',
        target: 3,
        max: null,
        energy: false,
      },
      {
        id: 't2',
        emoji: '📖',
        label: 'Free',
        target: null,
        max: null,
        energy: false,
      },
    ],
    sundayCheck: [],
    checkins: [],
  } as unknown as LifePlan
  const entries: LifeEntry[] = [
    {
      id: 'w:focus:f1',
      week: '2026-10-05',
      ref: 'f1',
      day: '2026-10-06',
      createdAt: 1,
      updatedAt: 1,
      kind: 'focus',
      value: { done: true },
    },
    {
      id: 'x',
      week: '2026-10-05',
      ref: 't1',
      day: '2026-10-07',
      createdAt: 2,
      updatedAt: 2,
      kind: 'tracker',
      value: {},
    },
  ]
  it('summarises focus', () => {
    const r = lifeToday(plan, entries, '2026-10-08')
    expect(r.focusDone).toBe(1)
    expect(r.focusTotal).toBe(2)
    expect(r.focusOpen).toEqual(['Two'])
  })
})
