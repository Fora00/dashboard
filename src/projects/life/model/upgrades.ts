import type { LifeEntry, LifeUpgradeEntry } from '../../../lib/db'
import { addDays, dayKey } from './dates.ts'

// --- Upgrade list (spec: docs/HANDOFF-life.md) ---------------------------------
// A list of small annoyances to fix that lives across weeks, like the habit
// ideas: it never counts in a week summary. Pure: the hook and the export feed it.

export interface UpgradeSummary {
  /** Open quick items, oldest first (what has annoyed the longest comes first). */
  quick: LifeUpgradeEntry[]
  /** Open big items, oldest first. */
  big: LifeUpgradeEntry[]
  /** Every done item, most recently done first. */
  done: LifeUpgradeEntry[]
  /** Done with `doneAt` inside the week. */
  doneThisWeek: LifeUpgradeEntry[]
  /** Dropped, last changed inside the week. */
  droppedThisWeek: LifeUpgradeEntry[]
  openCount: number
  /** A quiet "1-2 this week?": a quick item is open and none was done this week. */
  nudge: boolean
}

export function isUpgrade(e: LifeEntry): e is LifeUpgradeEntry {
  return e.kind === 'upgrade'
}

/** The day an upgrade was done on (older rows without doneAt fall back to their day). */
function doneDay(e: LifeUpgradeEntry): string {
  return e.value.doneAt ?? e.day
}

export function summarizeUpgrades(entries: readonly LifeEntry[], week: string): UpgradeSummary {
  const end = addDays(week, 6)
  const inWeek = (day: string) => day >= week && day <= end
  const all = entries.filter(isUpgrade)
  const open = all.filter((e) => e.value.status === 'open').sort((a, b) => a.createdAt - b.createdAt)
  const done = all
    .filter((e) => e.value.status === 'done')
    .sort((a, b) => doneDay(b).localeCompare(doneDay(a)) || b.updatedAt - a.updatedAt)
  const doneThisWeek = done.filter((e) => inWeek(doneDay(e)))
  const droppedThisWeek = all
    .filter((e) => e.value.status === 'dropped' && inWeek(dayKey(new Date(e.updatedAt))))
    .sort((a, b) => a.updatedAt - b.updatedAt)
  const quick = open.filter((e) => e.value.size === 'quick')
  return {
    quick,
    big: open.filter((e) => e.value.size === 'big'),
    done,
    doneThisWeek,
    droppedThisWeek,
    openCount: open.length,
    nudge: quick.length >= 1 && doneThisWeek.length === 0,
  }
}

/** The `upgrades` array of the export JSON: open items and what changed this week. */
export function upgradesForExport(u: UpgradeSummary) {
  return [...u.quick, ...u.big, ...u.doneThisWeek, ...u.droppedThisWeek].map(({ id, week, value }) => ({
    id,
    text: value.text,
    size: value.size,
    status: value.status,
    week,
    ...(value.status === 'done' && value.doneAt ? { doneAt: value.doneAt } : {}),
  }))
}
