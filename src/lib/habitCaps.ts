// Habit caps and the emoji clip, free of Dexie/Supabase imports so the
// habits import link (src/projects/habits/habitsPlan.ts) and the script that
// prints it (scripts/life-habits-link.ts, run by plain node) share them with
// habitSync.ts, which re-exports them.

// Caps — MUST match the CHECK constraints in
// supabase/migrations/20260930160100_text_caps.sql and the inputs' maxLength.
export const MAX_NAME_LENGTH = 300
export const MAX_EMOJI_LENGTH = 8
export const MAX_TEXT_LENGTH = 300 // anchor, normal, floor, why
export const MAX_NOTE_LENGTH = 100
export const MAX_PER_DAY = 20
export const MAX_GRACE = 7
export const MAX_TARGET = 7 // times per week

/** Cap an emoji without leaving half a surrogate pair at the cut. */
export function clipEmoji(raw: string): string {
  return Array.from(raw.trim().slice(0, MAX_EMOJI_LENGTH))
    .filter((c) => c.length === 2 || !/[\ud800-\udfff]/.test(c))
    .join('')
}

// App limits of a measured habit (Habit.measureLimits, M1). MUST match
// habits_measure_limits_check in supabase/migrations/20261122120000_habit_measure.sql.
export const MAX_MEASURE_LIMITS = 12
export const MAX_LIMIT_APP_LENGTH = 60 // same as an app name in the Sunday apps answer
export const MAX_LIMIT_MINUTES = 1440 // a day

/** Daily limit per app, in minutes. Mirrors HabitAppLimit in db.ts (kept free of imports here). */
export interface AppLimitLike {
  app: string
  minutes: number
}

/**
 * Clean a stored or typed app-limits list: names trimmed and clipped, minutes
 * rounded and capped at MAX_LIMIT_MINUTES, blank, under-1-minute or malformed rows dropped, the same
 * app (case-insensitive) kept once, at most MAX_MEASURE_LIMITS rows. Anything
 * that isn't an array gives []. Pure.
 */
export function cleanLimits(raw: unknown): AppLimitLike[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<string>()
  const out: AppLimitLike[] = []
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue
    const { app, minutes } = r as { app?: unknown; minutes?: unknown }
    if (typeof app !== 'string' || typeof minutes !== 'number' || !Number.isFinite(minutes)) continue
    const name = app.trim().slice(0, MAX_LIMIT_APP_LENGTH)
    const key = name.toLowerCase()
    const mins = Math.min(MAX_LIMIT_MINUTES, Math.round(minutes))
    if (!name || mins < 1 || seen.has(key)) continue
    seen.add(key)
    out.push({ app: name, minutes: mins })
    if (out.length === MAX_MEASURE_LIMITS) break
  }
  return out
}
