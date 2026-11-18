import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck } from '../../lib/db'
import { activeDaysOf, habitDayStates } from './habitDayStates'
import { deriveHabitDays } from './habitDaysData'
import { buildLifeboard } from './lifeboardData'
import { habitSheetReducer, NO_SHEET } from './useHabitSheets'

const created = new Date('2026-10-20T12:00:00').getTime()
const habits: Habit[] = [
  { id: 'a', name: 'Read', emoji: '📖', createdAt: created },
  { id: 'b', name: 'Steps', emoji: '👟', createdAt: created + 1, perDay: 3 },
  { id: 'c', name: 'No phone', emoji: '📵', createdAt: created + 2, direction: 'avoid', grace: 1 },
  { id: 'd', name: 'Old', emoji: '🗄', createdAt: created + 3, archivedAt: created + 86_400_000 },
  { id: 'e', name: 'Later', emoji: '⏳', createdAt: created + 4, cycleStart: '2026-11-01' },
]
const check = (habitId: string, day: string, extra: Partial<HabitCheck> = {}): HabitCheck => ({
  id: `${habitId}-${day}`,
  habitId,
  day,
  createdAt: 1,
  ...extra,
})
const checks: HabitCheck[] = [
  check('a', '2026-10-21'),
  check('a', '2026-10-22', { status: 'skip', note: 'sick' }),
  check('a', '2026-10-23'),
  check('b', '2026-10-22', { count: 2 }),
  check('b', '2026-10-23', { count: 3 }),
  check('c', '2026-10-22', { status: 'fail', note: 'forgot' }),
  check('d', '2026-10-21'),
]
const today = '2026-10-23'

describe('deriveHabitDays', () => {
  const data = deriveHabitDays(habits, checks, today)

  it('gives the same per-habit maps as habitDayStates did inline on each page', () => {
    const activeDays = activeDaysOf(checks)
    for (const h of habits) {
      const d = habitDayStates(h, checks, activeDays, today)
      expect(data.states.get(h.id)).toEqual(d.states)
      expect(data.notes.get(h.id)).toEqual(d.notes)
      expect(data.counts.get(h.id)).toEqual(d.counts)
      expect(data.slips.get(h.id)).toEqual(d.slips)
    }
  })

  it('splits active, archived and not-yet-started habits, and counts today', () => {
    expect(data.active.map((h) => h.id)).toEqual(['a', 'b', 'c'])
    expect(data.archived.map((h) => h.id)).toEqual(['d'])
    expect(data.doneToday).toBe(3) // a done, b 3/3, c kept (avoid, no slip today)
  })

  it('wins match the lifeboard built from the same data', () => {
    const board = buildLifeboard(habits, data.boardData)
    for (const l of board.legend) expect(data.wins.get(l.habit.id)).toBe(l.total)
  })
})

describe('habitSheetReducer', () => {
  it('one sheet at a time; the reason step only applies to the pick sheet', () => {
    let s = habitSheetReducer(NO_SHEET, { kind: 'pick', id: 'a', reasonFor: null })
    s = habitSheetReducer(s, { kind: 'reason', reasonFor: 'skip' })
    expect(s).toEqual({ kind: 'pick', id: 'a', reasonFor: 'skip' })
    s = habitSheetReducer(s, { kind: 'detail', id: 'a' })
    expect(habitSheetReducer(s, { kind: 'reason', reasonFor: 'fail' })).toEqual({ kind: 'detail', id: 'a' })
    expect(habitSheetReducer(s, NO_SHEET)).toEqual(NO_SHEET)
  })
})
