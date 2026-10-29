import type { LifeChoreEntry, LifeChoreValue, LifeEntry } from '../../../lib/db'
import { streakRef } from './streaks.ts'

// --- Household chores (Things project "Casa catia") ----------------------------
// A Mac script reads the project (and the completion history of its recurring
// to-dos) and puts a snapshot in the /oggi link. The dashboard shows it under
// "Casa", where a chore can also be ticked: that flips `done` and, for a
// recurring chore, bumps `count`. Like Streaks they live across weeks and never
// count in a week summary. Pure.

export function isChore(e: LifeEntry): e is LifeChoreEntry {
  return e.kind === 'chore'
}

/** Stable ref of a chore: the same slug as a Streaks habit name. */
export const choreRef = streakRef

export function choreEntryId(ref: string): string {
  return `chore:${ref}`
}

/** A clean value: `last` only when set (so equality and the SQL check agree). */
function normalize(v: LifeChoreValue): LifeChoreValue {
  return {
    name: v.name,
    repeat: v.repeat,
    done: v.done,
    count: v.count,
    ...(v.last ? { last: v.last } : {}),
    ...(v.wk ? { wk: v.wk } : {}),
    asOf: v.asOf,
  }
}

function sameValue(a: LifeChoreValue, b: LifeChoreValue): boolean {
  return (
    a.name === b.name &&
    a.repeat === b.repeat &&
    a.done === b.done &&
    a.count === b.count &&
    a.last === b.last &&
    a.wk === b.wk &&
    a.asOf === b.asOf
  )
}

export interface ChoreImportPlan {
  upserts: LifeChoreEntry[]
  /** Ids of rows to delete: chores no longer in the snapshot. */
  deletes: string[]
}

/**
 * What importing a `chores` snapshot does to the existing chore rows: upsert
 * each chore by ref, delete the ones missing from it. Never goes backwards: a
 * row whose `asOf` is newer than the incoming one keeps its value, a snapshot
 * older than the newest stored one deletes nothing, and a chore ticked here
 * today stays ticked when the same-day snapshot (read before Things caught up)
 * still says open. `incoming` is validated (parseChoresJson), refs unique.
 */
export function planChoreImport(
  existing: readonly LifeChoreEntry[],
  incoming: readonly LifeChoreValue[],
  week: string,
  today: string,
  now: number,
): ChoreImportPlan {
  const byRef = new Map<string, LifeChoreEntry>()
  const deletes: string[] = []
  for (const e of [...existing].sort((a, b) => a.createdAt - b.createdAt)) {
    if (byRef.has(e.ref)) deletes.push(e.id)
    else byRef.set(e.ref, e)
  }
  const newestStored = [...byRef.values()].reduce((m, e) => (e.value.asOf > m ? e.value.asOf : m), '')
  const newestIncoming = incoming.reduce((m, v) => (v.asOf > m ? v.asOf : m), '')

  const upserts: LifeChoreEntry[] = []
  const seen = new Set<string>()
  for (const raw of incoming) {
    const value = normalize(raw)
    const ref = choreRef(value.name)
    seen.add(ref)
    const prev = byRef.get(ref)
    if (prev) {
      const keepTick = prev.value.asOf === value.asOf && prev.value.done && !value.done
      if (prev.value.asOf > value.asOf || keepTick || sameValue(normalize(prev.value), value)) continue
      upserts.push({ ...prev, value, updatedAt: now })
    } else {
      upserts.push({
        id: choreEntryId(ref),
        week,
        kind: 'chore',
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

/** The chore after a tick (or untick): `done` flips, a recurring chore's counter follows. */
export function toggleChoreValue(v: LifeChoreValue, today: string): LifeChoreValue {
  const done = !v.done
  const count = v.repeat ? Math.max(0, v.count + (done ? 1 : -1)) : v.count
  const last = done ? today : v.last === today ? undefined : v.last
  return normalize({
    name: v.name,
    repeat: v.repeat,
    done,
    count,
    ...(last ? { last } : {}),
    ...(v.wk ? { wk: v.wk } : {}),
    asOf: today,
  })
}

/** Open chores first, then by name. */
export function sortChores(entries: readonly LifeEntry[]): LifeChoreEntry[] {
  return entries
    .filter(isChore)
    .sort((a, b) => Number(a.value.done) - Number(b.value.done) || a.value.name.localeCompare(b.value.name))
}

/**
 * What "Casa" lists today: the open chores plus the ones done today. A chore
 * done on an earlier day drops off the list each morning, like the Oggi focus
 * (its history still feeds the progress chart).
 */
export function visibleChores(chores: readonly LifeChoreEntry[], today: string): LifeChoreEntry[] {
  return chores.filter((c) => !c.value.done || c.value.last === today)
}

export interface ChoresSummary {
  total: number
  done: number
  repeating: number
}

export function summarizeChores(chores: readonly LifeChoreEntry[]): ChoresSummary {
  return {
    total: chores.length,
    done: chores.filter((c) => c.value.done).length,
    repeating: chores.filter((c) => c.value.repeat).length,
  }
}

/**
 * Share of the chores done per week, keyed by week (Monday) for the weeks the
 * snapshot's strips cover: a chore counts in a week when its strip has a '1'
 * there (the current week also counts a chore ticked today). Empty when there
 * is no history. `weekOf` is the Monday of a day key.
 */
export function choresByWeek(
  chores: readonly LifeChoreEntry[],
  weekOf: (day: string) => string,
  addDays: (day: string, n: number) => string,
): Map<string, number> {
  const out = new Map<string, number>()
  if (chores.length === 0) return out
  const newest = chores.reduce((m, c) => (c.value.asOf > m ? c.value.asOf : m), '')
  const thisWeek = weekOf(newest)
  const n = chores[0]?.value.wk?.length ?? 0
  // Weeks before the first completion on record are unknown, not 0%.
  const firstOne = (c: LifeChoreEntry) => {
    const at = c.value.wk?.indexOf('1') ?? -1
    return at >= 0 ? at : c.value.done ? n - 1 : n
  }
  const first = Math.min(...chores.map(firstOne))
  for (let i = first; i < n; i++) {
    const done = chores.filter((c) => {
      const wk = c.value.wk
      if (!wk || wk.length !== n) return false
      return wk[i] === '1' || (i === n - 1 && c.value.done)
    }).length
    out.set(addDays(thisWeek, -7 * (n - 1 - i)), Math.round((done / chores.length) * 100))
  }
  return out
}
