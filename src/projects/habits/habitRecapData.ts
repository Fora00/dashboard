// Pure recap of all habits over a week or a month: counts per state, what the
// period expected, whether the target was reached, and the reasons given for
// rest days and misses. Feeds the Week and Month views and, later, /settimana.

import type { Habit, HabitDayState } from '../../lib/db'
import { dayKey } from './habitStore'
import { daysBetween, gracedSlips, habitTarget, shiftDayKey, weekStart } from './habitStats'

export type RecapKind = 'week' | 'month'

export interface RecapPeriod {
  kind: RecapKind
  from: string
  to: string
  days: string[]
}

export function recapPeriod(kind: RecapKind, anchor: string): RecapPeriod {
  if (kind === 'week') {
    const from = weekStart(anchor)
    return { kind, from, to: shiftDayKey(from, 6), days: Array.from({ length: 7 }, (_, i) => shiftDayKey(from, i)) }
  }
  const month = anchor.slice(0, 7)
  const days: string[] = []
  const [y, m] = month.split('-').map(Number) as [number, number]
  for (let d = new Date(y, m - 1, 1); dayKey(d).startsWith(month); d.setDate(d.getDate() + 1)) days.push(dayKey(d))
  return { kind, from: days[0]!, to: days.at(-1)!, days }
}

/** The period before or after (n = -1 / +1). */
export function shiftPeriod(p: RecapPeriod, n: number): RecapPeriod {
  if (p.kind === 'week') return recapPeriod('week', shiftDayKey(p.from, 7 * n))
  const [y, m] = p.from.split('-').map(Number) as [number, number]
  return recapPeriod('month', dayKey(new Date(y, m - 1 + n, 1)))
}

export interface RecapRow {
  habit: Habit
  /** One entry per day of the period; 'future' / 'before' = not countable. */
  cells: { day: string; state: HabitDayState | 'empty' | 'future' | 'before'; note?: string | undefined }[]
  done: number // done + floor days
  floor: number
  skip: number
  fail: number
  empty: number // past, unmarked days
  expected: number
  /** null when nothing was expected yet (period not started, or habit too new). */
  hit: boolean | null
  /** Slips tolerated by the habit's grace in this period (avoid habits). */
  graceUsed: number
  /** reason -> times, over rest days and misses. */
  reasons: Record<string, number>
  /** Overshoot: taps above the goal, summed over the period's days. */
  extra: number
}

export function buildRecap(
  habits: readonly Habit[],
  states: ReadonlyMap<string, ReadonlyMap<string, HabitDayState>>,
  notes: ReadonlyMap<string, ReadonlyMap<string, string>>,
  period: RecapPeriod,
  today: string,
  counts?: ReadonlyMap<string, ReadonlyMap<string, number>>,
): RecapRow[] {
  return habits.map((habit) => {
    const st = states.get(habit.id)
    const nt = notes.get(habit.id)
    const firstMarked = st ? [...st.keys()].sort()[0] : undefined
    const created = dayKey(new Date(habit.createdAt))
    let started = firstMarked && firstMarked < created ? firstMarked : created
    if (habit.cycleStart && habit.cycleStart < started) started = habit.cycleStart

    let done = 0
    let floor = 0
    let skip = 0
    let fail = 0
    let empty = 0
    const reasons: Record<string, number> = {}
    const cells: RecapRow['cells'] = period.days.map((day) => {
      const state = st?.get(day)
      const note = nt?.get(day)
      if (state === 'done' || state === 'floor') {
        done++
        if (state === 'floor') floor++
      } else if (state === 'skip') skip++
      else if (state === 'fail') fail++
      if ((state === 'skip' || state === 'fail') && note) reasons[note] = (reasons[note] ?? 0) + 1
      if (state) return { day, state, note }
      if (day > today) return { day, state: 'future' as const }
      if (day < started) return { day, state: 'before' as const }
      empty++
      return { day, state: 'empty' as const }
    })

    const elapsed = period.days.filter((d) => d >= started && d <= today).length
    const target = habitTarget(habit)
    const available = Math.max(0, elapsed - skip)
    const expected = target === 7 ? available : Math.min(available, Math.round((elapsed / 7) * target))
    // A "don't" habit with grace: slips inside the weekly grace do not fail the period.
    const avoid = habit.direction === 'avoid'
    const graced =
      avoid && habit.graceScope !== 'day' && st
        ? [...gracedSlips(st, habit.grace ?? 0)].filter((d) => period.days.includes(d)).length
        : 0
    const hit = avoid ? (expected > 0 ? fail - graced <= 0 : null) : expected > 0 ? done >= expected : null
    const goal = habit.perDay ?? 1
    const extra =
      habit.direction === 'avoid'
        ? 0
        : period.days.reduce((n, day) => n + Math.max(0, (counts?.get(habit.id)?.get(day) ?? 0) - goal), 0)
    return { habit, cells, done, floor, skip, fail, empty, expected, hit, graceUsed: graced, reasons, extra }
  })
}

export function periodDays(period: RecapPeriod, today: string): number {
  return Math.max(0, Math.min(daysBetween(period.from, today), daysBetween(period.from, period.to)) + 1)
}

export function tallyReasons(rows: readonly RecapRow[]): [string, number][] {
  const all: Record<string, number> = {}
  for (const r of rows) for (const [k, n] of Object.entries(r.reasons)) all[k] = (all[k] ?? 0) + n
  return Object.entries(all).sort((a, b) => b[1] - a[1])
}
