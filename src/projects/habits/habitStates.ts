import type { Habit, HabitDayState } from '../../lib/db'

export const STATE_ICON: Record<HabitDayState | 'open' | 'missed', string | undefined> = {
  done: '✓',
  floor: '◐',
  skip: '⏸',
  fail: '✕',
  // A past empty day of a daily habit: drawn as a miss, lighter than a marked one.
  missed: '✕',
  open: undefined,
}

/** Day-cell colours, shared by the month calendar and the legend. */
export const STATE_CELL: Record<HabitDayState | 'missed' | 'empty', string> = {
  done: 'bg-emerald-400 text-slate-900',
  floor: 'bg-lime-300 text-slate-900',
  skip: 'bg-sky-400/40',
  fail: 'bg-rose-400/50',
  missed: 'bg-rose-400/20 text-rose-700 dark:text-rose-300',
  empty: 'bg-slate-100 dark:bg-slate-800',
}

/** "Da verificare": a neutral dashed day cell, never the kept green. Shared by the calendar and the legend. */
export const UNVERIFIED_CELL =
  'border border-dashed border-slate-400 text-slate-500 dark:border-slate-500 dark:text-slate-400'

/** The week chip at the end of a calendar row (habitCalendarData.ts chipTone): shape and tones, shared with the legend. */
export const CHIP_BASE =
  'flex min-h-8 items-center justify-center self-center rounded-full px-1 text-[11px] font-medium whitespace-nowrap tabular-nums'
export const CHIP_TONE: Record<'hit' | 'miss' | 'progress' | 'unverified', string> = {
  hit: 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300',
  miss: 'bg-rose-400/20 text-rose-700 dark:text-rose-300',
  progress: 'bg-amber-400/20 text-amber-700 dark:text-amber-300',
  unverified: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

/** More open forever habits than this and none gets finished. */
export const MAX_OPEN = 3

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
/** A habit whose cycle starts in the future stays out of sight until that day
 *  (e.g. a planned experiment imported ahead of time). No cycleStart = started. */
export function hasStarted(habit: Pick<Habit, 'cycleStart'>, today: string): boolean {
  return !habit.cycleStart || habit.cycleStart <= today
}

export function slipLimit(habit: Habit): number {
  return habit.graceScope === 'day' && (habit.grace ?? 0) > 0 ? (habit.grace ?? 0) + 1 : 1
}

/** Overshoot of one day: taps above the goal, or slips above the limit. */
export function overshootOf(habit: Habit, count: number, slips: number): number {
  return habit.direction === 'avoid' ? Math.max(0, slips - slipLimit(habit)) : Math.max(0, count - (habit.perDay ?? 1))
}

/** Why a day was a rest day or missed: one tap, saved as the check's note. */
export const REST_REASONS = [
  ['tired', '😴 Stanco'],
  ['sick', '🤒 Malato'],
  ['vacation', '🏖 Vacanza'],
  ['away', '🧳 Fuori'],
  ['planned', '🌿 Riposo pianificato'],
  ['other', '… Altro'],
] as const
export const MISS_REASONS = [
  ['anchor', '⚓ L’ancora'],
  ['energy', '🔋 Energia'],
  ['plan', '🗓 Il piano'],
  ['forgot', '🫥 Dimenticato'],
  ['other', '… Altro'],
] as const

export function reasonLabel(note: string): string {
  const all = [...REST_REASONS, ...MISS_REASONS] as readonly (readonly [string, string])[]
  return all.find(([k]) => k === note)?.[1] ?? note
}
