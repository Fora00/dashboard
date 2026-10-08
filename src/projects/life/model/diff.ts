import type { LifeCheckin, LifeEntry, LifeFocus, LifePlan, LifeQuestion, LifeTask, LifeTracker } from '../../../lib/db'
import { withCheckinIds } from './checkinIds.ts'

// --- Import preview diff -------------------------------------------------------

export interface ListDiff<T> {
  added: T[]
  removed: T[]
  /** Same id, different content: [old, new]. */
  changed: [T, T][]
}

export interface PlanDiff {
  /** True when there is no previous plan for this week. */
  firstImport: boolean
  focus: ListDiff<LifeFocus>
  tasks: ListDiff<LifeTask>
  trackers: ListDiff<LifeTracker>
  sundayCheck: ListDiff<LifeQuestion>
  rules: { added: string[]; removed: string[] }
  checkins: { added: LifeCheckin[]; removed: LifeCheckin[] }
  /** Human lines for the preview, e.g. "1 tracker removed", "2 tasks added". */
  summary: string[]
  /** True when the new plan is identical to the old one. */
  unchanged: boolean
}

function diffById<T extends { id: string }>(oldList: readonly T[], newList: readonly T[]): ListDiff<T> {
  const oldById = new Map(oldList.map((x) => [x.id, x]))
  const newIds = new Set(newList.map((x) => x.id))
  const added: T[] = []
  const changed: [T, T][] = []
  for (const n of newList) {
    const o = oldById.get(n.id)
    if (!o) added.push(n)
    else if (JSON.stringify(o) !== JSON.stringify(n)) changed.push([o, n])
  }
  return { added, removed: oldList.filter((o) => !newIds.has(o.id)), changed }
}

function diffBy<T>(oldList: readonly T[], newList: readonly T[], key: (x: T) => string) {
  const oldKeys = new Set(oldList.map(key))
  const newKeys = new Set(newList.map(key))
  return {
    added: newList.filter((x) => !oldKeys.has(key(x))),
    removed: oldList.filter((x) => !newKeys.has(key(x))),
  }
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`
}

/** What re-importing `next` over `prev` changes (prev null = first import). */
export function diffPlans(prev: LifePlan | null, next: LifePlan): PlanDiff {
  const empty: LifePlan = { ...next, focus: [], rules: [], tasks: [], trackers: [], sundayCheck: [], checkins: [] }
  // A plan stored before check-in ids existed gets the same derived ids the
  // new one got, so an identical re-import still reads as "unchanged".
  const old = prev ? withCheckinIds(prev) : empty
  const d = {
    focus: diffById(old.focus, next.focus),
    tasks: diffById(old.tasks, next.tasks),
    trackers: diffById(old.trackers, next.trackers),
    sundayCheck: diffById(old.sundayCheck, next.sundayCheck),
    rules: diffBy(old.rules, next.rules, (r) => r),
    checkins: diffBy(old.checkins, next.checkins, (c) => `${c.date} ${c.label}`),
  }
  const summary: string[] = []
  const sections: [keyof typeof d, string, string][] = [
    ['focus', 'focus item', 'focus items'],
    ['tasks', 'task', 'tasks'],
    ['trackers', 'tracker', 'trackers'],
    ['sundayCheck', 'Sunday question', 'Sunday questions'],
    ['rules', 'rule', 'rules'],
    ['checkins', 'check-in', 'check-ins'],
  ]
  for (const [key, one, many] of sections) {
    const s = d[key]
    if (s.added.length) summary.push(`${plural(s.added.length, one, many)} added`)
    if (s.removed.length) summary.push(`${plural(s.removed.length, one, many)} removed`)
    if ('changed' in s && s.changed.length) summary.push(`${plural(s.changed.length, one, many)} changed`)
  }
  const unchanged = prev !== null && JSON.stringify(old) === JSON.stringify(next)
  // Same items, different order: still worth saying before the owner saves.
  if (!unchanged && summary.length === 0) summary.push('order changed')
  return { firstImport: prev === null, ...d, summary: unchanged ? [] : summary, unchanged }
}

/** Removed trackers that already have logged entries in `week`: re-importing
 *  hides those entries (they stay stored but leave the plan). */
export function hiddenTrackerEntries(
  removed: readonly LifeTracker[],
  entries: readonly LifeEntry[],
  week: string,
): { tracker: LifeTracker; count: number }[] {
  const counts = new Map<string, number>()
  for (const e of entries) {
    if (e.kind === 'tracker' && e.week === week) counts.set(e.ref, (counts.get(e.ref) ?? 0) + 1)
  }
  return removed.flatMap((tracker) => {
    const count = counts.get(tracker.id) ?? 0
    return count > 0 ? [{ tracker, count }] : []
  })
}
