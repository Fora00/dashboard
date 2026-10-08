import type { LifeEntry, LifeWeek } from '../../../lib/db'
import { daysBetween, summarizeWeek } from '../model'

export interface ChartPoint {
  week: string
  current: boolean
  /** Position along the x axis, 0 (oldest shown week) to 1 (newest). Weeks with gaps between them sit proportionally apart. */
  at: number
  focus: number | null
  checkins: number | null
  habits: number | null
  tasks: number | null
}

const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : null)

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
): ChartPoint[] {
  const shown = weeks
    .filter((w) => w.week <= currentWeek)
    .sort((a, b) => (a.week < b.week ? 1 : a.week > b.week ? -1 : 0)) // newest first
    .slice(0, max)
    .reverse()
  if (shown.length === 0) return []
  const first = shown[0]!.week
  const span = daysBetween(first, shown[shown.length - 1]!.week)
  return shown.map((w) => {
    const s = summarizeWeek(w.plan, entries)
    return {
      week: w.week,
      current: w.week === currentWeek,
      at: span > 0 ? daysBetween(first, w.week) / span : 0,
      focus: pct(s.focusDone.size, w.plan.focus.length),
      checkins: pct(s.checkins.filter((c) => c.done).length, s.checkins.length),
      // habits = trackers with a target that reached it
      habits: pct(
        s.trackers.filter((t) => t.reachedTarget === true).length,
        s.trackers.filter((t) => t.reachedTarget !== null).length,
      ),
      tasks: pct(w.plan.tasks.filter((t) => s.sentTaskIds.has(t.id)).length, w.plan.tasks.length),
    }
  })
}
