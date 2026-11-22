// Pure recap of all habits over a week or a month: counts per state, what the
// period expected, whether the target was reached, and the reasons given for
// rest days and misses. Feeds the Week and Month views and, later, /settimana.

import type { Habit, HabitAppLimit, HabitDayState } from '../../lib/db'
import {
  isAppLimits,
  measuredHit,
  weeklyAllowance,
  weekEvidence,
  weekSlips,
  type AppsByWeek,
  type WeekEvidence,
} from './habitMeasure'
import { dayKey } from './habitStore'
import { overshootOf } from './habitStates'
import { displayCell, habitBounds, type DisplayCell } from './habitDayStates'
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
  /** One entry per day of the period (see displayCell); 'future' / 'before' / 'after' = not countable. */
  cells: { day: string; state: DisplayCell; note?: string | undefined }[]
  done: number // done + floor days
  floor: number
  skip: number
  fail: number
  empty: number // past (and today's) unmarked days, 'missed' cells included
  expected: number
  /** null when nothing was expected yet (period not started, or habit too new). */
  hit: boolean | null
  /** Slips tolerated by the habit's grace in this period (avoid habits). */
  graceUsed: number
  /** reason -> times, over rest days and misses. */
  reasons: Record<string, number>
  /** Overshoot: taps above the goal (or slips above the limit), summed over the period's days. */
  extra: number
  /** Measured habits only (habitMeasure.ts): the weeks judged on data. `hit` above is then the measured verdict. */
  measured?: MeasuredRecap
}

/** One week of a measured habit. */
export interface MeasuredWeek {
  week: string
  /** Slips ticked by hand that week. */
  manual: number
  /** null = no apps answer that week: unverified. */
  evidence: WeekEvidence | null
  /** max(manual, verified); null when unverified. */
  slips: number | null
  /** The ticks alone, judged by the normal rule (null = nothing expected yet). */
  manualHit: boolean | null
  hit: boolean | null
}

export interface MeasuredRecap {
  kind: 'app-limits'
  limits: HabitAppLimit[]
  /** Week: the one week. Month: the weeks starting in the month, up to today, while the habit ran. */
  weeks: MeasuredWeek[]
  /** Slips ticked over those weeks, and the minimum proven over the verified ones. */
  manual: number
  verified: number
  verifiedWeeks: number
  hitWeeks: number
  /** Weeks that expected something but have no apps answer. */
  unverifiedWeeks: number
}

export function buildRecap(
  habits: readonly Habit[],
  states: ReadonlyMap<string, ReadonlyMap<string, HabitDayState>>,
  notes: ReadonlyMap<string, ReadonlyMap<string, string>>,
  period: RecapPeriod,
  today: string,
  counts?: ReadonlyMap<string, ReadonlyMap<string, number>>,
  slips?: ReadonlyMap<string, ReadonlyMap<string, number>>,
  /** Sunday apps answers by week, for app-limits habits; missing = every week unverified. */
  apps?: AppsByWeek,
): RecapRow[] {
  return habits.map((habit): RecapRow => {
    const st = states.get(habit.id)
    const nt = notes.get(habit.id)
    const bounds = habitBounds(habit, st)
    const started = bounds.start

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
      } else if (state === 'skip') {
        // A planned future rest day (vacation) must not lower what the period expects yet.
        if (day <= today) skip++
      } else if (state === 'fail') fail++
      if ((state === 'skip' || state === 'fail') && note) reasons[note] = (reasons[note] ?? 0) + 1
      const cell = displayCell(habit, day, state, today, bounds)
      if (cell === 'empty' || cell === 'missed') empty++
      return state ? { day, state: cell, note } : { day, state: cell }
    })

    // Days after the habit ended (archived) expect nothing, like days before it started.
    const elapsed = period.days.filter(
      (d) => d >= started && d <= today && (bounds.end === undefined || d <= bounds.end),
    ).length
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
    const extra = period.days.reduce(
      (n, day) => n + overshootOf(habit, counts?.get(habit.id)?.get(day) ?? 0, slips?.get(habit.id)?.get(day) ?? 0),
      0,
    )
    const row: RecapRow = {
      habit,
      cells,
      done,
      floor,
      skip,
      fail,
      empty,
      expected,
      hit,
      graceUsed: graced,
      reasons,
      extra,
    }
    if (!isAppLimits(habit)) return row
    const measured = measuredRecap(
      row,
      period,
      today,
      bounds,
      st,
      slips?.get(habit.id),
      (week) => buildRecap([habit], states, notes, recapPeriod('week', week), today, counts, slips, apps)[0]!,
      apps,
    )
    return { ...row, hit: measured.hit, measured: measured.recap }
  })
}

function measuredRecap(
  row: RecapRow,
  period: RecapPeriod,
  today: string,
  bounds: { start: string; end: string | undefined },
  states: ReadonlyMap<string, HabitDayState> | undefined,
  daySlips: ReadonlyMap<string, number> | undefined,
  weekRow: (monday: string) => RecapRow,
  apps: AppsByWeek | undefined,
): { hit: boolean | null; recap: MeasuredRecap } {
  const habit = row.habit
  const limits = habit.measureLimits ?? []
  let weeks: MeasuredWeek[]
  if (period.kind === 'week') {
    let manual = 0
    for (const day of period.days) {
      if (day > today || day < bounds.start || (bounds.end !== undefined && day > bounds.end)) continue
      manual += daySlips?.get(day) ?? (states?.get(day) === 'fail' ? 1 : 0)
    }
    const evidence = weekEvidence(limits, apps?.get(period.from))
    weeks = [
      {
        week: period.from,
        manual,
        evidence,
        slips: evidence ? weekSlips(manual, evidence.verified) : null,
        manualHit: row.hit,
        hit: measuredHit(row.hit, manual, evidence, weeklyAllowance(habit)),
      },
    ]
  } else {
    weeks = period.days
      .filter((d) => weekStart(d) === d && d <= today && shiftDayKey(d, 6) >= bounds.start)
      .filter((d) => bounds.end === undefined || d <= bounds.end)
      .map((monday) => weekRow(monday).measured!.weeks[0]!)
  }
  const verifiedWeeks = weeks.filter((w) => w.evidence !== null && w.manualHit !== null)
  const recap: MeasuredRecap = {
    kind: 'app-limits',
    limits,
    weeks,
    manual: weeks.reduce((n, w) => n + w.manual, 0),
    verified: verifiedWeeks.reduce((n, w) => n + (w.evidence?.verified ?? 0), 0),
    verifiedWeeks: verifiedWeeks.length,
    hitWeeks: verifiedWeeks.filter((w) => w.hit).length,
    unverifiedWeeks: weeks.filter((w) => w.evidence === null && w.manualHit !== null).length,
  }
  let hit: boolean | null
  if (period.kind === 'week') hit = weeks[0]!.hit
  else if (recap.verifiedWeeks === 0) hit = null
  else hit = row.hit !== false && verifiedWeeks.every((w) => w.hit !== false)
  return { hit, recap }
}

export function periodDays(period: RecapPeriod, today: string): number {
  return Math.max(0, Math.min(daysBetween(period.from, today), daysBetween(period.from, period.to)) + 1)
}

export function tallyReasons(rows: readonly RecapRow[]): [string, number][] {
  const all: Record<string, number> = {}
  for (const r of rows) for (const [k, n] of Object.entries(r.reasons)) all[k] = (all[k] ?? 0) + n
  return Object.entries(all).sort((a, b) => b[1] - a[1])
}
