// Backup restore against the sync engine (fake Supabase, signed in): restored
// rows are queued, so the next pull (remote = source of truth) keeps them
// instead of deleting what the server has never seen. A row the server
// refuses (a guest restoring data she cannot write) is dead-lettered and kept.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// fakeDb first: it installs fake-indexeddb before Dexie loads.
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import type { Todo } from './db'

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

const { restoreBackup } = await import('./backup')
const { sync: todos } = await import('./todoSync')

const settle = () =>
  drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${todos.getStatus().syncing}`)
const todo = (id: string): Todo => ({ id, text: id, done: 0, createdAt: 1, updatedAt: 1 })
const backup = (rows: unknown[]) => ({
  format: 'dashboard-backup' as const,
  version: 25,
  exportedAt: '',
  tables: { todos: rows },
})

beforeEach(async () => {
  await resetDb()
  fake.reset()
})
afterEach(settle)

describe('restore while signed in', () => {
  it('pushes restored rows, and the pull after it keeps them', async () => {
    fake.setNetwork('down')
    await restoreBackup(backup([todo('r1'), todo('r2')]))
    await settle()
    fake.setNetwork('up')
    await todos.syncNow()
    await settle()
    expect((fake.remote.todos ?? []).map((r) => r.id).sort()).toEqual(['r1', 'r2'])
    expect((await db.todos.toArray()).map((t) => t.id).sort()).toEqual(['r1', 'r2'])
    expect(await db.outbox.count()).toBe(0)
  })
  it('a row put without the outbox would be deleted by that pull (why restore queues)', async () => {
    await db.todos.put(todo('bare'))
    await todos.syncNow()
    await settle()
    expect(await db.todos.get('bare')).toBeUndefined()
  })
  it('rows the server refuses (guest, RLS) are dead-lettered and survive the pull', async () => {
    fake.rejectWith(() => ({ code: '42501', message: 'rls', status: 403 }))
    await restoreBackup(backup([todo('g1')]))
    await settle()
    await todos.syncNow()
    await settle()
    expect(await db.todos.get('g1')).toBeDefined()
    expect(todos.getStatus().dead).toBe(1)
  })
})
