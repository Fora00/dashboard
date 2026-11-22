// The month calendar of the habit detail page (M2), as data: one row per
// Monday-start week (the Life week key), each day's cell, and, for a measured
// habit (habitMeasure.ts), the week's verdict chip. Pure: no React, no Dexie.
//
// Why a measured habit needs its own mapping: a "don't" habit fills every
// unticked day with a derived "kept" (habitDayStates). For a habit checked
// against the Sunday apps answer that green is a lie until the data says so,
// and proven extensions can't be pinned to a day. So a derived "kept" day
// renders 'unverified' (neutral) while its week has no apps answer, and stays
// neutral when the answer proves more extensions than were ticked; only when
// the data proves no more than the ticks does the normal rendering apply.

import type { Habit, HabitDayState } from '../../lib/db'
import { displayCell, habitBounds, type DisplayCell } from './habitDayStates'
import { isAppLimits, weeklyAllowance, type AppsByWeek } from './habitMeasure'
import { buildRecap, recapPeriod, type MeasuredWeek, type RecapRow } from './habitRecapData'
import { habitTarget, monthGrid, shiftDayKey, weekStart } from './habitStats'

/** How a day cell looks: a state, a drawn miss, blank, or "da verificare". */
export type CalendarLook = HabitDayState | 'missed' | 'empty' | 'unverified'

export interface CalendarDay {
  day: string
  future: boolean
  cell: DisplayCell
  look: CalendarLook
}

/** A week still running and not yet decided, or decided. */
export type WeekStatus = 'hit' | 'miss' | 'progress'

/** The week's result at the end of its calendar row. Measured habits: ✓,
 *  "≥N ✕" (N = slips counted) or ? (no apps answer). Habits to do: done/target.
 *  Habits to avoid: slips/limit. */
export type WeekChip =
  | { kind: 'hit'; slips: number; verified: number }
  | { kind: 'miss'; slips: number; verified: number | null }
  | { kind: 'unverified'; manual: number }
  | { kind: 'count'; done: number; of: number; status: WeekStatus }
  /** `perDay`: a daily grace; `slips` then counts the days past it and `limit` is 0. */
  | { kind: 'slips'; slips: number; limit: number; status: WeekStatus; perDay?: boolean }

export interface CalendarWeek {
  /** Monday of the row (Life week key). */
  week: string
  /** Seven slots, null outside the month. */
  days: (CalendarDay | null)[]
  /** null when the week expected nothing (before the start, not begun, after the end). */
  chip: WeekChip | null
}

export interface CalendarInput {
  habit: Habit
  /** This habit's day states (habitDayStates: avoid habits carry derived "kept" days). */
  states: ReadonlyMap<string, HabitDayState>
  /** Days with a stored check: anything else in `states` is derived. */
  storedDays: ReadonlySet<string>
  /** Slips per day (measured habits). */
  slips?: ReadonlyMap<string, number> | undefined
  apps?: AppsByWeek | undefined
  /** 'YYYY-MM'. */
  month: string
  today: string
}

const baseLook = (cell: DisplayCell): CalendarLook =>
  cell === 'future' || cell === 'before' || cell === 'after' ? 'empty' : cell

/** One week judged like the Week recap does (for a measured habit: ticks + Sunday apps answer). */
export function weekRow(
  habit: Habit,
  states: ReadonlyMap<string, HabitDayState>,
  slips: ReadonlyMap<string, number> | undefined,
  apps: AppsByWeek | undefined,
  monday: string,
  today: string,
): RecapRow | null {
  const [row] = buildRecap(
    [habit],
    new Map([[habit.id, states]]),
    new Map(),
    recapPeriod('week', monday),
    today,
    undefined,
    slips ? new Map([[habit.id, slips]]) : undefined,
    apps ?? new Map(),
  )
  return row ?? null
}

/** One measured week (see weekRow). */
export function measuredWeek(
  habit: Habit,
  states: ReadonlyMap<string, HabitDayState>,
  slips: ReadonlyMap<string, number> | undefined,
  apps: AppsByWeek | undefined,
  monday: string,
  today: string,
): MeasuredWeek | null {
  return weekRow(habit, states, slips, apps, monday, today)?.measured?.weeks[0] ?? null
}

/** Slips ticked in a week, up to today (a plain miss counts 1; a tapped day its count). */
function weekSlipCount(row: RecapRow, slips: ReadonlyMap<string, number> | undefined, today: string): number {
  let n = 0
  for (const c of row.cells) {
    if (c.day > today) continue
    n += slips?.get(c.day) ?? (c.state === 'fail' ? 1 : 0)
  }
  return n
}

/** The chip of a habit that is not measured: done/target or slips/limit. A
 *  week still running shows 'progress' until it is decided (target reached,
 *  or slips past the limit). */
export function plainWeekChip(
  habit: Habit,
  row: RecapRow | null,
  slips: ReadonlyMap<string, number> | undefined,
  today: string,
): WeekChip | null {
  if (!row || row.hit === null) return null
  const running = shiftDayKey(row.cells[0]!.day, 6) > today
  if (habit.direction === 'avoid') {
    const status: WeekStatus = row.hit === false ? 'miss' : running ? 'progress' : 'hit'
    // A daily grace is a per-day limit: a weekly "6/14" would read as fine while two days broke it.
    if (habit.graceScope === 'day' && (habit.grace ?? 0) > 0)
      return { kind: 'slips', slips: row.fail, limit: 0, status, perDay: true }
    return { kind: 'slips', slips: weekSlipCount(row, slips, today), limit: weeklyAllowance(habit), status }
  }
  // A finished week owes what it expected (rest days lower it); a running one shows the target.
  const of = running ? habitTarget(habit) : row.expected
  const status: WeekStatus = row.done >= of ? 'hit' : running ? 'progress' : 'miss'
  return { kind: 'count', done: row.done, of, status }
}

/** The chip of a measured week; null when nothing was expected yet. */
export function weekChip(w: MeasuredWeek | null): WeekChip | null {
  if (!w || w.manualHit === null) return null
  if (w.hit === null) return { kind: 'unverified', manual: w.manual }
  const slips = w.slips ?? w.manual
  if (w.hit) return { kind: 'hit', slips, verified: w.evidence?.verified ?? 0 }
  return { kind: 'miss', slips, verified: w.evidence?.verified ?? null }
}

/** True when a derived "kept" day of this week must not render green. */
function hideDerivedKept(w: MeasuredWeek | null): boolean {
  if (!w || !w.evidence) return true
  return w.evidence.verified > w.manual
}

/** The month as week rows, each with its result chip. Only a measured habit's cells differ (see top). */
export function calendarMonth({ habit, states, storedDays, slips, apps, month, today }: CalendarInput): CalendarWeek[] {
  const bounds = habitBounds(habit, states)
  const measured = isAppLimits(habit)
  return monthGrid(month, today).map((row) => {
    const first = row.find((c) => c !== null)!
    const week = weekStart(first.day)
    const wr = weekRow(habit, states, slips, apps, week, today)
    const mw = measured ? (wr?.measured?.weeks[0] ?? null) : null
    const hide = measured && hideDerivedKept(mw)
    const days = row.map((c): CalendarDay | null => {
      if (c === null) return null
      const stored = states.get(c.day)
      const cell = displayCell(habit, c.day, stored, today, bounds)
      const derivedKept = stored === 'done' && !storedDays.has(c.day)
      const look: CalendarLook = hide && derivedKept ? 'unverified' : baseLook(cell)
      return { day: c.day, future: c.future, cell, look }
    })
    return { week, days, chip: measured ? weekChip(mw) : plainWeekChip(habit, wr, slips, today) }
  })
}

/** Short text of a chip: "✓", "≥3 ✕", "?", "5/7", "1/2". */
export function chipText(chip: WeekChip): string {
  if (chip.kind === 'count') return `${chip.done}/${chip.of}`
  if (chip.kind === 'slips')
    return chip.limit > 0 ? `${chip.slips}/${chip.limit}` : chip.slips > 0 ? `${chip.slips} ✕` : '✓'
  if (chip.kind === 'hit') return '✓'
  if (chip.kind === 'miss') return `≥${chip.slips} ✕`
  return '?'
}

/** Spoken / hover text of a chip, Italian like M1's views. */
export function chipLabel(chip: WeekChip): string {
  if (chip.kind === 'count' || chip.kind === 'slips') {
    const what =
      chip.kind === 'count' ? `fatte ${chip.done} su ${chip.of}` : `sgarri ${chip.slips}, tollerati ${chip.limit}`
    const verdict = chip.status === 'hit' ? 'rispettata' : chip.status === 'miss' ? 'mancata' : 'in corso'
    return `Settimana ${verdict}: ${what}`
  }
  if (chip.kind === 'unverified')
    return `Settimana da verificare: nessuna “App più usate” inserita (spuntate ${chip.manual})`
  if (chip.kind === 'hit')
    return chip.verified > 0
      ? `Settimana ok: verificate ≥${chip.verified} estensioni, entro la tolleranza`
      : 'Settimana ok: verificata'
  return `Settimana mancata: almeno ${chip.slips} estension${chip.slips === 1 ? 'e' : 'i'}`
}

/** The colour family of a chip. */
export function chipTone(chip: WeekChip): 'hit' | 'miss' | 'progress' | 'unverified' {
  if (chip.kind === 'count' || chip.kind === 'slips') return chip.status
  return chip.kind
}
