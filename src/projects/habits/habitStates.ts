import type { HabitDayState } from '../../lib/db'

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
