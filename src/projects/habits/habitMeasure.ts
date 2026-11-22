// Measured habits (M1): a "don't" habit checked against data the owner enters
// anyway, so a forgotten slip can't read as kept. One kind for now,
// 'app-limits': the habit is "don't press 'extend 15 min' on the iOS app
// limits"; the Sunday "App più usate" answer of the Life week (ref
// 'screen-apps', weekly minutes per app) proves the minimum number of
// extensions: an app used W minutes in the week with a daily limit L was
// extended at least ceil((W - 7L) / 15) times. The week counts
// max(manual slips, verified minimum); no apps answer = unverified (never a
// success). Pure: no React, no Dexie. Keyed on Habit.measure so other kinds
// (steps, weight) can be added next to it.

import type { Habit, HabitAppLimit, LifeEntry, LifeWeek } from '../../lib/db'
import { MAX_MEASURE_LIMITS } from '../../lib/habitCaps'
import { parseApps, type AppUsage } from '../life/model/apps'
import { summarizeWeek } from '../life/model/summary'

/** Minutes one "extend" on an iOS app limit adds. */
export const EXTENSION_MINUTES = 15

/** Sunday apps answers by week (Monday key), only weeks with at least one row. */
export type AppsByWeek = ReadonlyMap<string, readonly AppUsage[]>

/** True for a habit checked against the Sunday apps answer. */
export function isAppLimits(h: Pick<Habit, 'measure' | 'measureLimits'>): boolean {
  return h.measure === 'app-limits' && (h.measureLimits?.length ?? 0) > 0
}

/** Short label of a measure kind, for tags: "app limits". */
export function measureLabel(h: Pick<Habit, 'measure'>): string | null {
  return h.measure === 'app-limits' ? 'app limits' : null
}

/** Every Life week's apps answer (read through summarizeWeek, like the screen-time chart). */
export function appsByWeek(weeks: readonly LifeWeek[], entries: readonly LifeEntry[]): Map<string, AppUsage[]> {
  const byWeek = new Map<string, LifeEntry[]>()
  for (const e of entries) {
    if (e.kind !== 'sunday') continue
    const list = byWeek.get(e.week)
    if (list) list.push(e)
    else byWeek.set(e.week, [e])
  }
  const out = new Map<string, AppUsage[]>()
  for (const w of weeks) {
    const mine = byWeek.get(w.week)
    if (!mine) continue
    const rows = parseApps(summarizeWeek(w.plan, mine).screen.get('screen-apps'))
    if (rows.length) out.set(w.week, rows)
  }
  return out
}

/** The apps every live app-limits habit limits, each once (case-insensitive), in habit order. */
export function limitedApps(habits: readonly Habit[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const h of habits) {
    if (h.archivedAt !== undefined || !isAppLimits(h)) continue
    for (const l of h.measureLimits ?? []) {
      const key = l.app.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push(l.app)
    }
  }
  return out.slice(0, MAX_MEASURE_LIMITS)
}

/** Minimum extensions behind `weekly` minutes on an app limited to `daily` minutes a day. */
export function extensionsFor(weekly: number, daily: number): number {
  return Math.max(0, Math.ceil((weekly - 7 * daily) / EXTENSION_MINUTES))
}

/** One limited app in one week. `weekly` null = not in that week's answer (no evidence). */
export interface AppWeek {
  app: string
  /** Daily limit, minutes. */
  limit: number
  weekly: number | null
  /** 7 x limit. */
  allowed: number
  extensions: number
}

/** What a week's apps answer proves for a habit's limits. */
export interface WeekEvidence {
  /** Minimum extensions over the apps found. */
  verified: number
  apps: AppWeek[]
  /** Limited apps missing from the answer: no evidence, not 0. */
  missing: string[]
}

/** The evidence of one week; null when the week has no apps answer (unverified). */
export function weekEvidence(
  limits: readonly HabitAppLimit[],
  rows: readonly AppUsage[] | undefined,
): WeekEvidence | null {
  if (!rows || rows.length === 0) return null
  const byName = new Map<string, number>()
  for (const r of rows) {
    const key = r.app.trim().toLowerCase()
    if (!byName.has(key)) byName.set(key, r.minutes)
  }
  const apps = limits.map((l): AppWeek => {
    const weekly = byName.get(l.app.trim().toLowerCase())
    const allowed = 7 * l.minutes
    return weekly === undefined
      ? { app: l.app, limit: l.minutes, weekly: null, allowed, extensions: 0 }
      : { app: l.app, limit: l.minutes, weekly, allowed, extensions: extensionsFor(weekly, l.minutes) }
  })
  return {
    verified: apps.reduce((n, a) => n + a.extensions, 0),
    apps,
    missing: apps.filter((a) => a.weekly === null).map((a) => a.app),
  }
}

/** The slips a week counts: the higher of what was ticked and what the data proves. */
export function weekSlips(manual: number, verified: number): number {
  return Math.max(manual, verified)
}

/** Slips a week tolerates: the weekly grace, or 7 x the daily one. */
export function weeklyAllowance(h: Pick<Habit, 'grace' | 'graceScope'>): number {
  const g = h.grace ?? 0
  return h.graceScope === 'day' ? 7 * g : g
}

/**
 * The verdict of a measured week. `manualHit` is the week judged on the ticks
 * alone (the normal avoid/grace rule). When the data proves no more slips than
 * were ticked, that verdict stands; when it proves more, the week also needs
 * the proven count within the week's allowance. Unverified (no evidence) or
 * nothing expected yet = null.
 */
export function measuredHit(
  manualHit: boolean | null,
  manual: number,
  evidence: WeekEvidence | null,
  allowance: number,
): boolean | null {
  if (manualHit === null || evidence === null) return null
  if (!manualHit) return false
  return evidence.verified <= manual || evidence.verified <= allowance
}

/** "2h 05m"-free short minutes: "45 min" / "1h 10". */
export function shortMinutes(m: number): string {
  const h = Math.floor(m / 60)
  const r = Math.round(m % 60)
  return h ? `${h}h${r ? ` ${String(r).padStart(2, '0')}` : ''}` : `${r} min`
}

/** One line for the tile and the detail: "verificate ≥3 estensioni (YouTube +45 min)". */
export function evidenceLine(e: WeekEvidence): string {
  const over = e.apps.filter((a) => a.extensions > 0)
  if (e.verified === 0) return 'verificato: nessuna estensione'
  return `verificate ≥${e.verified} estension${e.verified === 1 ? 'e' : 'i'} (${over
    .map((a) => `${a.app} +${shortMinutes((a.weekly ?? 0) - a.allowed)}`)
    .join(', ')})`
}

/** The newest of this week and last week with an apps answer, for the tile. */
export function latestEvidence(
  h: Pick<Habit, 'measure' | 'measureLimits'>,
  apps: AppsByWeek,
  thisWeek: string,
  lastWeek: string,
): { week: string; evidence: WeekEvidence } | null {
  if (!isAppLimits(h)) return null
  for (const week of [thisWeek, lastWeek]) {
    const evidence = weekEvidence(h.measureLimits ?? [], apps.get(week))
    if (evidence) return { week, evidence }
  }
  return null
}
