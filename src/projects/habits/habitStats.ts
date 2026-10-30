// Pure stats for a habit cycle. Days are 'YYYY-MM-DD'; weeks start on Monday.
// `target` = times per week (7 = daily). A conscious skip is neither done nor
// a miss: it lowers what a week expects. 'floor' (only the minimum) counts as
// done; 'fail' and an empty past day are misses. Streaks: consecutive done days
// (daily habits) or hit weeks (weekly ones); skips are neutral.

import type { Habit, HabitDayState } from '../../lib/db'
import { dayKey } from './habitStore'

export interface WeekStat {
  start: string // Monday
  done: number
  skipped: number
  expected: number // target, minus skips, never below 0
  hit: boolean
}

export interface HabitStats {
  target: number
  week: WeekStat // the current (partial) week
  lastWeeks: WeekStat[] // complete weeks before this one, oldest first (up to 8)
  /** Days done in the last 30 days (or since the habit started, if newer). */
  done30: number
  skipped30: number
  /** Share of the window's expected days that were done, 0..1 (null if too young). */
  rate30: number | null
  /** Times a habit came back after a miss: a done day after 2+ empty days
   *  (daily) or a hit week after a missed week (weekly). */
  returns: number
  /** Current and longest streak, in `streakUnit`. */
  streak: number
  bestStreak: number
  streakUnit: 'days' | 'weeks'
  /** Of the 30-day window's done days, how many were only the floor. */
  floor30: number
  /** Longest run of empty days (daily habits) in the window. */
  longestGap: number
  /** Done days per weekday over the whole history, Mon..Sun. */
  byWeekday: number[]
  doneTotal: number
  /** Slips tolerated per week (avoid habits), the slips that used it, and this week's use. */
  grace: number
  gracedDays: ReadonlySet<string>
  graceUsedWeek: number
  /** Rest days this week so far, and rest days in a row up to today. */
  restWeek: number
  restRun: number
  /** Empty or missed days in a row up to yesterday (daily habits only; a skip or a done day resets it). */
  gap: number
  cycle: { day: number; length: number } | null
}

function parse(day: string): Date {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  return new Date(y, m - 1, d)
}
function shift(day: string, n: number): string {
  const d = parse(day)
  d.setDate(d.getDate() + n)
  return dayKey(d)
}
export const shiftDayKey = shift

/** The Monday of the week containing `day`. */
export function weekStart(day: string): string {
  const dow = (parse(day).getDay() + 6) % 7
  return shift(day, -dow)
}
export function daysBetween(a: string, b: string): number {
  return Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000)
}

export function habitTarget(habit: Pick<Habit, 'target'>): number {
  return habit.target ?? 7
}

export function weekStat(
  start: string,
  done: ReadonlySet<string>,
  skip: ReadonlySet<string>,
  target: number,
  today: string,
): WeekStat {
  let d = 0
  let s = 0
  for (let i = 0; i < 7; i++) {
    const day = shift(start, i)
    if (day > today) break
    if (done.has(day)) d++
    else if (skip.has(day)) s++
  }
  const expected = Math.max(0, Math.min(target, 7 - s))
  return { start, done: d, skipped: s, expected, hit: d >= expected }
}

export function habitStats(
  habit: Pick<Habit, 'target' | 'createdAt' | 'cycleStart' | 'cycleEnd' | 'direction' | 'grace' | 'graceScope'>,
  states: ReadonlyMap<string, HabitDayState>,
  today: string,
): HabitStats {
  const doneDays = new Set<string>()
  const skipDays = new Set<string>()
  for (const [day, st] of states) {
    if (st === 'done' || st === 'floor') doneDays.add(day)
    else if (st === 'skip') skipDays.add(day)
  }
  // Grace: a "don't" habit tolerates this many slips a week; those count as kept.
  const grace = habit.direction === 'avoid' && habit.graceScope !== 'day' ? (habit.grace ?? 0) : 0
  const gracedDays = gracedSlips(states, grace)
  for (const day of gracedDays) doneDays.add(day)
  const target = habitTarget(habit)
  const created = dayKey(new Date(habit.createdAt))
  const firstEver = [...doneDays, ...skipDays, created].sort()[0]!
  const started = habit.cycleStart && habit.cycleStart < firstEver ? habit.cycleStart : firstEver
  const thisWeek = weekStart(today)
  const week_ = weekStat(thisWeek, doneDays, skipDays, target, today)

  const lastWeeks: WeekStat[] = []
  for (let i = 8; i >= 1; i--) {
    const start = shift(thisWeek, -7 * i)
    if (shift(start, 6) < started) continue // the habit didn't exist yet
    lastWeeks.push(weekStat(start, doneDays, skipDays, target, today))
  }

  const windowStart = shift(today, -29) < started ? started : shift(today, -29)
  let done30 = 0
  let floor30 = 0
  let skipped30 = 0
  let longestGap = 0
  let run = 0
  let returns = 0
  const windowDays = daysBetween(windowStart, today) + 1
  for (let i = 0; i < windowDays; i++) {
    const day = shift(windowStart, i)
    if (doneDays.has(day)) {
      done30++
      if (states.get(day) === 'floor') floor30++
      if (target === 7 && run >= 2) returns++
      run = 0
    } else if (skipDays.has(day)) {
      skipped30++
      run = 0
    } else if (day < today) {
      run++
      longestGap = Math.max(longestGap, run)
    }
  }
  if (target < 7) {
    for (let i = 1; i < lastWeeks.length; i++) if (lastWeeks[i]!.hit && !lastWeeks[i - 1]!.hit) returns++
    longestGap = 0
  }
  const expected30 = target === 7 ? windowDays - skipped30 : Math.round((windowDays / 7) * target)
  const rate30 = windowDays >= 7 && expected30 > 0 ? Math.min(1, done30 / expected30) : null

  const daily = target === 7
  let cur = 0
  let best = 0
  if (daily) {
    for (let day = started; day <= today; day = shift(day, 1)) {
      if (doneDays.has(day)) best = Math.max(best, ++cur)
      else if (skipDays.has(day) || day === today) continue
      else cur = 0
    }
  } else {
    for (let start = weekStart(started); start <= thisWeek; start = shift(start, 7)) {
      const w = weekStat(start, doneDays, skipDays, target, today)
      if (w.hit && (w.done > 0 || w.expected === 0)) best = Math.max(best, ++cur)
      else if (start !== thisWeek) cur = 0
    }
  }

  const restWeek = week_.skipped
  let restRun = 0
  for (let day = skipDays.has(today) ? today : shift(today, -1); skipDays.has(day); day = shift(day, -1)) restRun++
  let gap = 0
  if (daily) {
    for (let day = shift(today, -1); day >= started; day = shift(day, -1)) {
      if (doneDays.has(day) || skipDays.has(day)) break
      gap++
    }
  }

  const byWeekday = [0, 0, 0, 0, 0, 0, 0]
  for (const day of doneDays) byWeekday[(parse(day).getDay() + 6) % 7]!++

  const cycle =
    habit.cycleStart && habit.cycleEnd
      ? {
          day: Math.min(
            daysBetween(habit.cycleStart, habit.cycleEnd) + 1,
            Math.max(0, daysBetween(habit.cycleStart, today) + 1),
          ),
          length: daysBetween(habit.cycleStart, habit.cycleEnd) + 1,
        }
      : null

  return {
    target,
    week: week_,
    lastWeeks,
    done30,
    skipped30,
    rate30,
    returns,
    streak: cur,
    bestStreak: best,
    streakUnit: daily ? 'days' : 'weeks',
    floor30,
    longestGap,
    byWeekday,
    doneTotal: doneDays.size - gracedDays.size,
    grace,
    gracedDays,
    graceUsedWeek: [...gracedDays].filter((d) => weekStart(d) === thisWeek).length,
    restWeek,
    restRun,
    gap,
    cycle,
  }
}

/** Month grid for the calendar: rows of 7 (Mon..Sun), null = outside the month. */
export function monthGrid(month: string, today: string): ({ day: string; future: boolean } | null)[][] {
  const first = `${month}-01`
  const lead = (parse(first).getDay() + 6) % 7
  const cells: ({ day: string; future: boolean } | null)[] = Array(lead).fill(null)
  for (let d = parse(first); dayKey(d).startsWith(month); d.setDate(d.getDate() + 1)) {
    const day = dayKey(d)
    cells.push({ day, future: day > today })
  }
  while (cells.length % 7) cells.push(null)
  const rows: (typeof cells)[] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
}

/** Warnings to show before marking a rest day: rest is neutral, but a lot of
 *  it can be avoidance. Pure on the stats read before the tap. */
export function restWarnings(stats: Pick<HabitStats, 'restWeek' | 'restRun' | 'gap'>, todayIsRest: boolean): string[] {
  if (todayIsRest) return []
  const out: string[] = []
  if (stats.restWeek + 1 >= 3) out.push(`That would be rest day number ${stats.restWeek + 1} this week.`)
  if (stats.restRun + 1 >= 2) out.push(`That would be ${stats.restRun + 1} rest days in a row.`)
  if (stats.gap >= 1 && stats.restRun === 0) out.push('Yesterday had nothing marked: today is the one that counts.')
  if (out.length > 0)
    out.push('A break, or avoiding something? If it is a break, take it. If it is avoidance, the floor is enough.')
  return out
}

/** The slips that fall inside the weekly grace: in each Monday-based week the
 *  first `grace` marked slips are tolerated, later ones are real. */
export function gracedSlips(states: ReadonlyMap<string, HabitDayState>, grace: number): Set<string> {
  const graced = new Set<string>()
  if (grace <= 0) return graced
  const byWeek = new Map<string, string[]>()
  for (const [day, st] of states) {
    if (st !== 'fail') continue
    const w = weekStart(day)
    const list = byWeek.get(w)
    if (list) list.push(day)
    else byWeek.set(w, [day])
  }
  for (const days of byWeek.values()) for (const d of days.sort().slice(0, grace)) graced.add(d)
  return graced
}
