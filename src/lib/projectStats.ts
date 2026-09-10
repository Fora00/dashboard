import { db } from './db'

// Per-device usage stats for the home grid's ordering (see db.ts's
// ProjectStat). This is the only place that writes db.projectStats — plain
// Dexie writes are correct here, there is no sync engine for a local-only
// table.

// Called on every arrival at a project's route (see Layout.tsx). Upserts the
// row's open count; wrapped in a transaction so two fast navigations can't
// race and lose a count.
export async function recordOpen(projectId: string): Promise<void> {
  await db.transaction('rw', db.projectStats, async () => {
    const existing = await db.projectStats.get(projectId)
    await db.projectStats.put({
      id: projectId,
      opens: (existing?.opens ?? 0) + 1,
      starred: existing?.starred ?? 0,
      lastOpenedAt: Date.now(),
    })
  })
}

// Toggles the starred flag, preserving opens. Must work for a project that
// has never been opened (no pre-existing row).
export async function toggleStar(projectId: string): Promise<void> {
  await db.transaction('rw', db.projectStats, async () => {
    const existing = await db.projectStats.get(projectId)
    await db.projectStats.put({
      id: projectId,
      opens: existing?.opens ?? 0,
      starred: existing?.starred === 1 ? 0 : 1,
      lastOpenedAt: existing?.lastOpenedAt ?? Date.now(),
    })
  })
}
