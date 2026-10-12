import type { LifeAnswer, LifeEntry, LifeWeek } from '../../../lib/db'
import { parseApps, SCREEN_QUESTIONS, summarizeWeek, type AppUsage } from '../model'

export interface DurationSeries {
  /** The fixed question label. */
  label: string
  /** Minutes per week, aligned with `weeks`; null when not answered. */
  values: (number | null)[]
}

export interface ScreenTimeData {
  /** Week keys oldest to newest. */
  weeks: string[]
  series: DurationSeries[]
  /** Newest week with an apps answer, with the previous such week for deltas. */
  apps: { week: string; rows: AppUsage[]; previous: Map<string, number> } | null
}

/**
 * Duration answers grouped by question label, and the latest "top apps" answer.
 * Only weeks <= currentWeek, newest `max`.
 */
export function buildScreenTime(
  weeks: readonly LifeWeek[],
  entries: readonly LifeEntry[],
  currentWeek: string,
  max: number,
): ScreenTimeData {
  const shown = weeks
    .filter((w) => w.week <= currentWeek)
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-max)
  const durations = SCREEN_QUESTIONS.filter((q) => q.type === 'duration')
  const byWeek = new Map<string, Map<string, LifeAnswer>>()
  const appWeeks: { week: string; rows: AppUsage[] }[] = []
  for (const w of shown) {
    const screen = summarizeWeek(w.plan, entries).screen
    byWeek.set(w.week, screen)
    const rows = parseApps(screen.get('screen-apps'))
    if (rows.length) appWeeks.push({ week: w.week, rows })
  }
  const used = shown
    .filter((w) => durations.some((q) => typeof byWeek.get(w.week)?.get(q.id) === 'number'))
    .map((w) => w.week)
  const series = durations
    .map((q) => ({
      label: q.label,
      values: used.map((wk) => {
        const v = byWeek.get(wk)?.get(q.id)
        return typeof v === 'number' ? v : null
      }),
    }))
    .filter((s) => s.values.some((v) => v !== null))
  const last = appWeeks[appWeeks.length - 1]
  const prev = appWeeks[appWeeks.length - 2]
  return {
    weeks: used,
    series,
    apps: last
      ? {
          week: last.week,
          rows: [...last.rows].sort((a, b) => b.minutes - a.minutes),
          previous: new Map((prev?.rows ?? []).map((r) => [r.app.toLowerCase(), r.minutes])),
        }
      : null,
  }
}
