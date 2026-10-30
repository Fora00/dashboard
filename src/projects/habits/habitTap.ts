// What one tap on a habit does today, shared by the Habits tiles and the Life
// list so both behave the same. A tap is always "done": the floor and a rest day
// are offered next to it, never instead of it. Returns 'sheet' when the tap needs a choice
// the caller must ask for (a slip on a "don't" habit: why?).

import type { Habit, HabitDayState } from '../../lib/db'
import { setDayCount, setDayState, setSlipCount } from '../../lib/habitSync'

export interface TapContext {
  state: HabitDayState | 'open'
  /** Taps so far today (multi-tap) and slips so far today (daily grace). */
  count: number
  slips: number
  today: string
}

export async function tapHabit(habit: Habit, ctx: TapContext): Promise<'sheet' | void> {
  const { state, count, slips, today } = ctx
  const avoid = habit.direction === 'avoid'
  if (avoid && habit.graceScope === 'day' && (habit.grace ?? 0) > 0) {
    await setSlipCount(habit.id, today, slips + 1) // each tap is one more slip today
    return
  }
  if (avoid) {
    if (state === 'fail' || state === 'floor') await setDayState(habit.id, today, null)
    else return 'sheet'
    return
  }
  const perDay = habit.perDay ?? 1
  if (perDay > 1) {
    await setDayCount(habit.id, today, count >= perDay ? 0 : count + 1)
    return
  }
  await setDayState(habit.id, today, state === 'done' ? null : 'done')
}
