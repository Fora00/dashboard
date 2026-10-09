// Engine-level checks for the home grid's per-user starred/hidden prefs:
// local-first writes (signed out), the remote row shape (no user_id, nullable
// hidden), only upserts (never a delete), pull as source of truth, realtime
// LWW with DELETEs ignored (ids collide across users), malformed rows skipped,
// and the Dexie v17 rows reaching the server instead of being wiped by the
// first pull.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// fakeDb first: it installs fake-indexeddb before Dexie loads.
import { db, resetDb } from '../test/fakeDb'
import { drain, until } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'

const fake = await vi.hoisted(async () => {
  const { createFakeSupabase } = await import('../test/fakeSupabase')
  return createFakeSupabase() as FakeSupabase
})
vi.mock('./sync', () => ({
  get supabase() {
    return fake.client
  },
  syncEnabled: true,
}))

const { projectPrefsTable, setHiddenPref, sync, toggleStarPref } = await import('./projectPrefsSync')

const settle = () =>
  drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${sync.getStatus().syncing}`)
const pushed = () => fake.calls.filter((c) => c.op !== 'select')

beforeEach(async () => {
  await resetDb()
  fake.reset()
})
afterEach(settle)

describe('project prefs sync', () => {
  it('signed out: a star is saved in Dexie and queued, nothing is sent', async () => {
    fake.signOut()
    await toggleStarPref('links')
    await settle()
    expect(await db.projectPrefs.get('links')).toMatchObject({ id: 'links', starred: 1, hidden: null })
    expect(await db.outbox.count()).toBe(1)
    expect(pushed()).toHaveLength(0)
  })

  it('signed in: pushes the snake_case row, hidden null when unset, never a user_id', async () => {
    await toggleStarPref('links')
    await settle()
    expect(pushed()).toEqual([
      {
        table: 'project_prefs',
        op: 'upsert',
        arg: { id: 'links', starred: true, hidden: null, updated_at: expect.any(Number) },
      },
    ])
    expect(pushed()[0]!.arg).not.toHaveProperty('user_id')
    expect(await db.outbox.count()).toBe(0)
  })

  it('star and hidden are independent fields of one row; unstar is an upsert, not a delete', async () => {
    await setHiddenPref('todo', false)
    await toggleStarPref('todo')
    await toggleStarPref('todo')
    await setHiddenPref('todo', true)
    await settle()
    expect(await db.projectPrefs.get('todo')).toMatchObject({ starred: 0, hidden: 1 })
    expect(pushed().every((c) => c.op === 'upsert')).toBe(true)
    expect(fake.remote.project_prefs).toEqual([
      { id: 'todo', starred: false, hidden: true, updated_at: expect.any(Number) },
    ])
  })

  it('each write is stamped after the previous one, even with a clock behind it', async () => {
    await db.projectPrefs.put({ id: 'links', starred: 0, hidden: null, updatedAt: Date.now() + 60_000 })
    await toggleStarPref('links')
    expect((await db.projectPrefs.get('links'))!.updatedAt).toBeGreaterThan(Date.now() + 59_000)
  })

  it('pull: the server is the source of truth for rows with nothing queued', async () => {
    fake.remote.project_prefs = [
      { id: 'links', starred: true, hidden: null, updated_at: 5 },
      { id: 'todo', starred: false, hidden: false, updated_at: 6 },
    ] as never
    await sync.syncNow()
    await settle()
    expect(await db.projectPrefs.orderBy('id').toArray()).toEqual([
      { id: 'links', starred: 1, hidden: null, updatedAt: 5 },
      { id: 'todo', starred: 0, hidden: 0, updatedAt: 6 },
    ])
    fake.remote.project_prefs = []
    await sync.syncNow()
    await settle()
    expect(await db.projectPrefs.count()).toBe(0)
  })

  it('a malformed remote row is skipped, never written', async () => {
    fake.remote.project_prefs = [
      { id: 'links', starred: 'yes', hidden: null, updated_at: 5 },
      { id: 'todo', starred: true, hidden: 1, updated_at: 5 },
      { id: 'trips', starred: true, hidden: null, updated_at: 5 },
    ] as never
    await sync.syncNow()
    await settle()
    expect(await db.projectPrefs.toCollection().primaryKeys()).toEqual(['trips'])
    expect(sync.getStatus().skipped).toBe(2)
  })

  it('works the same for a guest: nothing owner-gated, the row is pushed', async () => {
    fake.signIn('guest-user')
    await setHiddenPref('shop-list', false)
    await settle()
    expect(fake.remote.project_prefs).toEqual([expect.objectContaining({ id: 'shop-list', hidden: false })])
    expect(sync.getStatus().dead).toBe(0)
  })

  it('realtime: newer updates apply, stale ones lose, DELETEs are ignored', async () => {
    await toggleStarPref('links')
    await settle()
    vi.stubGlobal('window', { addEventListener() {}, removeEventListener() {} })
    vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {}, visibilityState: 'hidden' })
    const stop = sync.start()
    await settle()
    const local = (await db.projectPrefs.get('links'))!
    // Another user's row with the same project id going away (account
    // deletion cascade): Realtime broadcasts it to us with just the old key.
    fake.emit('project_prefs', { eventType: 'DELETE', new: null, old: { id: 'links', user_id: 'someone-else' } })
    fake.emit('project_prefs', {
      eventType: 'UPDATE',
      new: { id: 'links', starred: false, hidden: true, updated_at: local.updatedAt - 1 },
      old: null,
    })
    await settle()
    expect(await db.projectPrefs.get('links')).toMatchObject({ starred: 1, hidden: null })
    fake.emit('project_prefs', {
      eventType: 'UPDATE',
      new: { id: 'links', starred: false, hidden: true, updated_at: local.updatedAt + 1000 },
      old: null,
    })
    await until(async () => (await db.projectPrefs.get('links'))?.hidden === 1)
    expect((await db.projectPrefs.get('links'))?.starred).toBe(0)
    stop()
    vi.unstubAllGlobals()
  })

  it('toRow/fromRow round-trip all three hidden states', () => {
    for (const hidden of [null, 0, 1] as const) {
      const local = { id: 'links', starred: 1 as const, hidden, updatedAt: 9 }
      expect(projectPrefsTable.fromRow(projectPrefsTable.toRow(local))).toEqual(local)
    }
  })

  it('choices migrated by the v17 upgrade are pushed (updated_at 0), not wiped by the first pull', async () => {
    fake.signOut()
    // What the v17 upgrade leaves behind: the row plus its queued upsert.
    const legacy = { id: 'todo', starred: 1 as const, hidden: 0 as const, updatedAt: 0 }
    await db.projectPrefs.put(legacy)
    await db.outbox.add({ table: 'project_prefs', op: 'upsert', rowId: 'todo', payload: legacy, ts: 1 })
    fake.signIn()
    // Another device already has a different project's prefs on the server.
    fake.remote.project_prefs = [{ id: 'links', starred: true, hidden: null, updated_at: 7 }] as never
    await sync.syncNow()
    await settle()
    expect(pushed()[0]?.arg).toEqual({ id: 'todo', starred: true, hidden: false, updated_at: 0 })
    expect((await db.projectPrefs.toCollection().primaryKeys()).sort()).toEqual(['links', 'todo'])
  })
})
