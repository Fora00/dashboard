// The habit detail route (M2): `/habits/:id`. Pure helpers, tested apart from
// the page so the param handling (loading / unknown id) has no React in it.

import type { Habit, HabitCheck, HabitDayState } from '../../lib/db'

/** The detail page path of a habit. */
export function habitPath(id: string): string {
  return `/habits/${encodeURIComponent(id)}`
}

/** Where the page's back control goes: the page it was opened from (state.from,
 *  same-app paths only), else /habits. */
export function backTarget(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/habits'
}

/** The habit a route param names: undefined while loading, null when unknown
 *  (the page then goes back to /habits). Archived habits still resolve. */
export function habitForRoute(habits: readonly Habit[] | undefined, id: string | undefined): Habit | null | undefined {
  if (habits === undefined) return undefined
  if (!id) return null
  return habits.find((h) => h.id === id) ?? null
}

/** Days with a stored check for one habit (anything else in its states is derived). */
export function storedDaysOf(checks: readonly HabitCheck[], habitId: string): Set<string> {
  const out = new Set<string>()
  for (const c of checks) if (c.habitId === habitId) out.add(c.day)
  return out
}

/** The state a day was explicitly given, ignoring derived "kept" days. */
export function storedState(
  states: ReadonlyMap<string, HabitDayState>,
  storedDays: ReadonlySet<string>,
  day: string,
): HabitDayState | undefined {
  return storedDays.has(day) ? states.get(day) : undefined
}
