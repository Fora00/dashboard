import type { LifeEntry, LifeIdeaEntry, LifeTracker, LifeWeek } from '../../../lib/db'

// One habit across weeks: how each week went, why it missed (Spock test) and
// the ideas to make it work. Pure: the hook in useHabitHistory.ts feeds it.

export interface HabitWeek {
  week: string
  total: number
  target: number | null
  max: number | null
  /** null when that week had no target for the habit. */
  reached: boolean | null
  reason: string | null
}

export interface HabitHistory {
  /** The habit as it is in the latest week that has it. */
  tracker: LifeTracker | null
  /** Newest first, only weeks whose plan has the habit. */
  weeks: HabitWeek[]
  /** Open and trying first, then done and dropped; newest first inside each. */
  ideas: LifeIdeaEntry[]
}

const IDEA_ORDER = { open: 0, trying: 0, done: 1, dropped: 2 } as const
export const HISTORY_WEEKS = 12

export function buildHabitHistory(
  trackerId: string,
  weeksIn: readonly LifeWeek[],
  entries: readonly LifeEntry[],
  limit: number = HISTORY_WEEKS,
): HabitHistory {
  const mine = entries.filter((e) => e.ref === trackerId)
  const sorted = [...weeksIn].sort((a, b) => b.id.localeCompare(a.id))
  const weeks: HabitWeek[] = []
  let tracker: LifeTracker | null = null
  for (const w of sorted) {
    const t = w.plan.trackers.find((x) => x.id === trackerId)
    if (!t) continue
    tracker ??= t
    const total = mine.filter((e) => e.kind === 'tracker' && e.week === w.id).length
    const why = mine.find((e) => e.kind === 'why' && e.week === w.id)
    const reason = why && why.kind === 'why' && why.value.reason.trim() ? why.value.reason.trim() : null
    weeks.push({
      week: w.id,
      total,
      target: t.target,
      max: t.max,
      reached: t.target === null ? null : total >= t.target,
      reason,
    })
    if (weeks.length >= limit) break
  }
  const ideas = mine
    .filter((e): e is LifeIdeaEntry => e.kind === 'idea')
    .sort((a, b) => IDEA_ORDER[a.value.status] - IDEA_ORDER[b.value.status] || b.createdAt - a.createdAt)
  return { tracker, weeks, ideas }
}

/** Consecutive weeks a habit held, newest first in `weeks`: a target reached,
 * or a cap (max) not exceeded. Habits with neither have no streak (0). The
 * current week never breaks it while still open (a target not yet reached); an
 * exceeded cap does break it at once. */
export function weekStreak(weeks: readonly HabitWeek[], currentWeek: string): number {
  let run = 0
  for (const w of weeks) {
    const held = w.target !== null ? w.total >= w.target : w.max !== null ? w.total <= w.max : null
    if (held === null) return 0
    if (held) run++
    else if (w.week === currentWeek && w.target !== null) continue
    else break
  }
  return run
}
