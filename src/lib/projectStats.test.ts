// The home grid's two stores: per-device usage (projectStats, local-only) and
// per-user choices (projectPrefs, synced). Checks the split holds — opening a
// project never touches prefs, starring/hiding never touches usage — and the
// tri-state hidden semantics (unset = defaults, explicit beats defaults).
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

vi.mock('./sync', () => ({ supabase: null, syncEnabled: false }))

const { DEFAULT_HIDDEN, isHidden, recordOpen, setHidden, toggleStar } = await import('./projectStats')

beforeEach(resetDb)

describe('isHidden', () => {
  it('unset (no row, or hidden null) follows the defaults only when they apply', () => {
    const id = [...DEFAULT_HIDDEN][0]!
    expect(isHidden(id, undefined, true)).toBe(true)
    expect(isHidden(id, { id, starred: 1, hidden: null, updatedAt: 1 }, true)).toBe(true)
    expect(isHidden(id, undefined, false)).toBe(false)
    expect(isHidden('links', undefined, true)).toBe(false)
  })

  it('an explicit choice beats the defaults either way', () => {
    expect(isHidden('todo', { id: 'todo', starred: 0, hidden: 0, updatedAt: 1 }, true)).toBe(false)
    expect(isHidden('links', { id: 'links', starred: 0, hidden: 1, updatedAt: 1 }, false)).toBe(true)
  })

  it('settings and sharing can never be hidden', () => {
    expect(isHidden('settings', { id: 'settings', starred: 0, hidden: 1, updatedAt: 1 }, true)).toBe(false)
    expect(isHidden('sharing', { id: 'sharing', starred: 0, hidden: 1, updatedAt: 1 }, true)).toBe(false)
  })
})

describe('projectStats / projectPrefs split', () => {
  it('recordOpen counts opens locally and never creates prefs or outbox entries', async () => {
    await recordOpen('links')
    await recordOpen('links')
    expect(await db.projectStats.get('links')).toEqual({ id: 'links', opens: 2, lastOpenedAt: expect.any(Number) })
    expect(await db.projectPrefs.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
  })

  it('toggleStar works on a never-opened project, keeps hidden, and leaves usage alone', async () => {
    await setHidden('todo', false)
    await toggleStar('todo')
    expect(await db.projectPrefs.get('todo')).toMatchObject({ starred: 1, hidden: 0 })
    expect(await db.projectStats.get('todo')).toBeUndefined()
    await recordOpen('todo')
    await toggleStar('todo')
    expect(await db.projectPrefs.get('todo')).toMatchObject({ starred: 0, hidden: 0 })
    expect((await db.projectStats.get('todo'))?.opens).toBe(1)
    // Every choice is queued for sync (even with sync off it waits there).
    expect(await db.outbox.where('rowId').equals('todo').count()).toBe(3)
    await drain(async () => String(await db.outbox.count()))
  })
})
