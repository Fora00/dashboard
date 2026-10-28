import type { LifeChoreEntry, LifeDayFocus, LifeEntry, LifeWeek } from '../../../lib/db'
import { addDays, choresByWeek, daysBetween, summarizeWeek, weekDays, weekKey, parseDayKey } from '../model'

export interface ChartPoint {
  week: string
  current: boolean
  /** Position along the x axis, 0 (oldest shown week) to 1 (newest). Weeks with gaps between them sit proportionally apart. */
  at: number
  focus: number | null
  habits: number | null
  /** Share of the week's Oggi lines (up to 3 a day) marked done; null when none were set. */
  oggi: number | null
  /** Share of the household chores (Things project Casa catia) done in the week; null without a history. */
  casa: number | null
}

const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : null)

/** Mean of min(count / target, 1) over trackers with a target; null when none has one. */
function habitsPct(trackers: readonly { tracker: { target: number | null }; total: number }[]): number | null {
  const targeted = trackers.filter((t) => t.tracker.target !== null && t.tracker.target > 0)
  if (targeted.length === 0) return null
  const sum = targeted.reduce((acc, t) => acc + Math.min(t.total / t.tracker.target!, 1), 0)
  return Math.round((sum / targeted.length) * 100)
}

/**
 * Chart points oldest to newest for the latest `max` weeks that are not in the
 * future (week <= currentWeek), x proportional to weeks elapsed rather than
 * the index. A week with nothing to measure yields null values; a lone point
 * sits at 0.
 */
export function buildChartPoints(
  weeks: readonly LifeWeek[],
  entries: readonly LifeEntry[],
  currentWeek: string,
  max: number,
  dayFocus: readonly LifeDayFocus[] = [],
): ChartPoint[] {
  const shown = weeks
    .filter((w) => w.week <= currentWeek)
    .sort((a, b) => (a.week < b.week ? 1 : a.week > b.week ? -1 : 0)) // newest first
    .slice(0, max)
    .reverse()
  if (shown.length === 0) return []
  const casa = choresByWeek(
    entries.filter((e): e is LifeChoreEntry => e.kind === 'chore'),
    (d) => weekKey(parseDayKey(d)),
    addDays,
  )
  const first = shown[0]!.week
  const span = daysBetween(first, shown[shown.length - 1]!.week)
  return shown.map((w) => {
    const s = summarizeWeek(w.plan, entries)
    const days = new Set(weekDays(w.week))
    const lines = dayFocus.filter((f) => days.has(f.day))
    return {
      week: w.week,
      current: w.week === currentWeek,
      at: span > 0 ? daysBetween(first, w.week) / span : 0,
      focus: pct(s.focusDone.size, w.plan.focus.length),
      // habits = average progress towards each target, capped at 100% per habit
      habits: habitsPct(s.trackers),
      oggi: pct(lines.filter((f) => f.done).length, lines.length),
      casa: casa.get(w.week) ?? null,
    }
  })
}
