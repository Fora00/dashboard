import type { LifeEntry, LifeStreakEntry, LifeStreakValue } from '../../../lib/db'
import { daysBetween } from './dates.ts'

// --- Streaks (iOS app) snapshot (spec: docs/HANDOFF-life.md) -------------------
// The owner's Streaks habits can't be written from here: a Mac script reads the
// app's iCloud backup and puts a snapshot in the week's JSON (`streaks`). The
// dashboard only shows them, read-only, under the Habits. Like the Upgrade
// list they live across weeks and never count in a week summary. Pure.

export type StreakDay = 'd' | 'm' | '-'

/** How many days old a snapshot may be before it's shown as stale. */
export const STREAK_STALE_DAYS = 3

export function isStreak(e: LifeEntry): e is LifeStreakEntry {
  return e.kind === 'streak'
}

/** 32-bit FNV-1a, hex: a stable fallback ref for names with no letters/digits. */
function fnv1a(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * Stable ref of a Streaks habit, from its name: lowercase ASCII slug, accents
 * folded ("Leggere 10′ è ok" → "leggere-10-e-ok"), ≤ 40 chars (the ref
 * pattern). A name with no letter or digit gets `h-<hash>`. Renaming the habit
 * in Streaks gives it a new ref (the old row is deleted on the next import).
 */
export function streakRef(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '')
  return slug || `h-${fnv1a(name.trim())}`
}

export function streakEntryId(ref: string): string {
  return `streak:${ref}`
}

function sameValue(a: LifeStreakValue, b: LifeStreakValue): boolean {
  return (
    a.name === b.name &&
    a.emoji === b.emoji &&
    a.days === b.days &&
    a.streak === b.streak &&
    a.best === b.best &&
    a.asOf === b.asOf
  )
}

/** A clean value: optional fields only when set (so equality and the SQL check agree). */
function normalize(v: LifeStreakValue): LifeStreakValue {
  return {
    name: v.name,
    ...(v.emoji ? { emoji: v.emoji } : {}),
    days: v.days,
    streak: v.streak,
    ...(v.best !== undefined ? { best: v.best } : {}),
    asOf: v.asOf,
  }
}

export interface StreakImportPlan {
  /** Rows to write (new or changed); unchanged habits are left alone. */
  upserts: LifeStreakEntry[]
  /** Ids of rows to delete: habits no longer in the snapshot (archived in Streaks). */
  deletes: string[]
}

/**
 * What importing a `streaks` snapshot does to the existing streak rows:
 * upsert each habit by ref (replace the value, keep the id/week/createdAt),
 * delete rows whose habit isn't in the snapshot. Never goes backwards: a habit
 * whose stored `asOf` is newer than the incoming one keeps its value, and a
 * snapshot older than the newest stored one deletes nothing (re-importing an
 * old week's JSON must not undo a newer import). `incoming` is validated
 * (parseWeekJson), refs unique.
 */
export function planStreakImport(
  existing: readonly LifeStreakEntry[],
  incoming: readonly LifeStreakValue[],
  week: string,
  today: string,
  now: number,
): StreakImportPlan {
  const byRef = new Map<string, LifeStreakEntry>()
  const deletes: string[] = []
  // Oldest first: a duplicate ref (shouldn't happen with deterministic ids) keeps the first row.
  for (const e of [...existing].sort((a, b) => a.createdAt - b.createdAt)) {
    if (byRef.has(e.ref)) deletes.push(e.id)
    else byRef.set(e.ref, e)
  }
  const newestStored = [...byRef.values()].reduce((m, e) => (e.value.asOf > m ? e.value.asOf : m), '')
  const newestIncoming = incoming.reduce((m, v) => (v.asOf > m ? v.asOf : m), '')

  const upserts: LifeStreakEntry[] = []
  const seen = new Set<string>()
  for (const raw of incoming) {
    const value = normalize(raw)
    const ref = streakRef(value.name)
    seen.add(ref)
    const prev = byRef.get(ref)
    if (prev) {
      if (prev.value.asOf > value.asOf || sameValue(normalize(prev.value), value)) continue
      upserts.push({ ...prev, value, updatedAt: now })
    } else {
      upserts.push({
        id: streakEntryId(ref),
        week,
        kind: 'streak',
        ref,
        day: today,
        value,
        createdAt: now,
        updatedAt: now,
      })
    }
  }
  const older = incoming.length > 0 && newestIncoming < newestStored
  if (!older) for (const [ref, e] of byRef) if (!seen.has(ref)) deletes.push(e.id)
  return { upserts, deletes }
}

/** The streak rows to show, by name. */
export function sortStreaks(entries: readonly LifeEntry[]): LifeStreakEntry[] {
  return entries.filter(isStreak).sort((a, b) => a.value.name.localeCompare(b.value.name))
}

/** The last 7 days of the strip (oldest → newest), padded with '-' if shorter. */
export function last7(days: string): StreakDay[] {
  const tail = days.slice(-7).padStart(7, '-')
  return tail.split('').map((c) => (c === 'd' || c === 'm' ? c : '-'))
}

/** Done days among the last 7. */
export function doneLast7(days: string): number {
  return last7(days).filter((c) => c === 'd').length
}

/** Days between the snapshot and today (0 = today; negative if asOf is ahead). */
export function streakAge(asOf: string, today: string): number {
  return daysBetween(asOf, today)
}

/** True when the snapshot is older than STREAK_STALE_DAYS. */
export function isStaleStreak(asOf: string, today: string): boolean {
  return streakAge(asOf, today) > STREAK_STALE_DAYS
}

/** The `streaks` array of the export JSON: the same shape the import takes. */
export function streaksForExport(entries: readonly LifeEntry[]): LifeStreakValue[] {
  return sortStreaks(entries).map((e) => normalize(e.value))
}

/** A Streaks habit counts as "not completed" (asks the Spock why) below this many done days of the last 7. */
export const STREAK_MISSED_BELOW = 4

export function isMissedStreak(e: LifeStreakEntry): boolean {
  return doneLast7(e.value.days) < STREAK_MISSED_BELOW
}
