import type { Habit, HabitDayState } from '../../lib/db'

export const STATE_ICON: Record<HabitDayState | 'open', string | undefined> = {
  done: '✓',
  floor: '◐',
  skip: '⏸',
  fail: '✕',
  open: undefined,
}

/** Day-cell colours, shared by the month calendar and the legend. */
export const STATE_CELL: Record<HabitDayState | 'empty', string> = {
  done: 'bg-emerald-400 text-slate-900',
  floor: 'bg-lime-300 text-slate-900',
  skip: 'bg-sky-400/40',
  fail: 'bg-rose-400/50',
  empty: 'bg-slate-100 dark:bg-slate-800',
}

/** Overshoot (more than the goal): its own icon and colour, never the done green. */
export const OVERSHOOT_ICON = '⚡'
export const OVERSHOOT_CELL = 'bg-violet-400 text-slate-900'
export const OVERSHOOT_TEXT = 'text-violet-600 dark:text-violet-300'

/** Negative overshoot (a "don't" habit slipped past its limit): a red of its own, never the good violet. */
export const NEG_OVERSHOOT_ICON = '💥'
export const NEG_OVERSHOOT_CELL = 'bg-rose-600 text-white'
export const NEG_OVERSHOOT_TEXT = 'text-rose-600 dark:text-rose-400'

/** The slips at which a "don't" habit's day already counts as a slip: past the
 *  daily grace, or the first one without it. Slips beyond it are overshoot. */
export function slipLimit(habit: Habit): number {
  return habit.graceScope === 'day' && (habit.grace ?? 0) > 0 ? (habit.grace ?? 0) + 1 : 1
}

/** Overshoot of one day: taps above the goal, or slips above the limit. */
export function overshootOf(habit: Habit, count: number, slips: number): number {
  return habit.direction === 'avoid' ? Math.max(0, slips - slipLimit(habit)) : Math.max(0, count - (habit.perDay ?? 1))
}

/** Why a day was a rest day or missed: one tap, saved as the check's note. */
export const REST_REASONS = [
  ['tired', '😴 Tired'],
  ['sick', '🤒 Sick'],
  ['away', '🧳 Away'],
  ['planned', '🌿 Planned rest'],
  ['other', '… Other'],
] as const
export const MISS_REASONS = [
  ['anchor', '⚓ The anchor'],
  ['energy', '🔋 Energy'],
  ['plan', '🗓 The plan'],
  ['forgot', '🫥 Forgot'],
  ['other', '… Other'],
] as const

export function reasonLabel(note: string): string {
  const all = [...REST_REASONS, ...MISS_REASONS] as readonly (readonly [string, string])[]
  return all.find(([k]) => k === note)?.[1] ?? note
}
