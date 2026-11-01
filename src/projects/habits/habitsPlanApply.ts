import { db } from '../../lib/db'
import { addHabit, updateHabit } from '../../lib/habitSync'
import { planHabitsImport, type HabitsPlan } from './habitsPlan'

// Apply a habits import (EN4) on an explicit tap. Re-plans against the habits
// in Dexie right now (so a merge never starts from a stale preview), then runs
// the normal mutations, one habit at a time, so the outbox/sync carries them.
// Never archives, deletes or touches checks. Local-first: works signed out.

export interface HabitsImportResult {
  created: number
  updated: number
}

/** Apply the rows whose name key is in `selected` (all applicable rows when omitted). */
export async function applyHabitsImport(plan: HabitsPlan, selected?: ReadonlySet<string>): Promise<HabitsImportResult> {
  const rows = planHabitsImport(plan, await db.habits.toArray())
  const result: HabitsImportResult = { created: 0, updated: 0 }
  for (const row of rows) {
    if (selected && !selected.has(row.key)) continue
    if (row.kind === 'create') {
      await addHabit(row.name, row.emoji, row.details)
      result.created++
    } else if (row.kind === 'update') {
      await updateHabit(row.habit, row.name, row.emoji, row.details)
      result.updated++
    }
  }
  return result
}
