import type { EventItem } from './types'

/** Events per day shown before "altri N" (owner, 2026-11-02). */
export const DAY_CAP = 8

/**
 * The events of a day within the cap: the first `cap` in list order (already
 * ranked: ring, favourites, time), plus the ones that always stay (saved or
 * going, hand-added), which do not count. `hidden` is how many are left out.
 */
export function capDay(
  events: readonly EventItem[],
  cap: number,
  keep: (e: EventItem) => boolean,
): { shown: EventItem[]; hidden: number } {
  let used = 0
  const shown = events.filter((e) => {
    if (keep(e)) return true
    used += 1
    return used <= cap
  })
  return { shown, hidden: events.length - shown.length }
}
