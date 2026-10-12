import type { LifeEntry, LifeWeek } from '../../../lib/db'
import { parseApps, summarizeWeek, type AppUsage } from '../model'

export interface DurationSeries {
  /** The question label, shared across weeks (ids may differ week to week). */
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
  const byLabel = new Map<string, { label: string; byWeek: Map<string, number> }>()
  const appWeeks: { week: string; rows: AppUsage[] }[] = []
  for (const w of shown) {
    const answers = summarizeWeek(w.plan, entries).answers
    for (const q of w.plan.sundayCheck) {
      const a = answers.get(q.id) ?? null
      if (q.type === 'duration' && typeof a === 'number') {
        const key = q.label.trim().toLowerCase()
        const s = byLabel.get(key) ?? { label: q.label.trim(), byWeek: new Map() }
        s.byWeek.set(w.week, a)
        byLabel.set(key, s)
      } else if (q.type === 'apps') {
        const rows = parseApps(a)
        if (rows.length) appWeeks.push({ week: w.week, rows })
      }
    }
  }
  const used = shown.filter((w) => [...byLabel.values()].some((s) => s.byWeek.has(w.week))).map((w) => w.week)
  const series = [...byLabel.values()].map((s) => ({
    label: s.label,
    values: used.map((wk) => s.byWeek.get(wk) ?? null),
  }))
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
