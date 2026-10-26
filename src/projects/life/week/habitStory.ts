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

/** How a week counts for a streak: held, broken, or still open (the current
 * week with a target not yet reached: neither counts nor breaks). */
function weekOutcome(w: HabitWeek, currentWeek: string): 'held' | 'broken' | 'open' | 'none' {
  const held = w.target !== null ? w.total >= w.target : w.max !== null ? w.total <= w.max : null
  if (held === null) return 'none'
  if (held) return 'held'
  return w.week === currentWeek && w.target !== null ? 'open' : 'broken'
}

export interface WeekStreak {
  /** Weeks in a row that held, up to now. */
  current: number
  /** Longest such run in the history. */
  best: number
}

/** Streak of a habit in weeks (a target reached, or a cap not exceeded), from
 * its weeks newest first. Habits with neither goal have none (0/0). An open
 * current week never breaks it; an exceeded cap breaks it at once. */
export function weekStreak(weeks: readonly HabitWeek[], currentWeek: string): WeekStreak {
  if (weeks.some((w) => weekOutcome(w, currentWeek) === 'none')) return { current: 0, best: 0 }
  let current = 0
  let stillCurrent = true
  let run = 0
  let best = 0
  for (const w of weeks) {
    const o = weekOutcome(w, currentWeek)
    if (o === 'held') {
      run++
      if (stillCurrent) current++
      best = Math.max(best, run)
    } else if (o === 'broken') {
      stillCurrent = false
      run = 0
    }
  }
  return { current, best }
}
