// Smoke tests for the shared fakes in src/test, so a broken helper fails here
// and not as a confusing cloudSync failure later.
import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from './fakeDb'
import { createFakeSupabase } from './fakeSupabase'

describe('fakeDb', () => {
  beforeEach(resetDb)

  it('opens the real schema on fake-indexeddb', async () => {
    await db.todos.clear()
    expect(await db.todos.count()).toBe(0)
    expect(db.tables.map((t) => t.name)).toContain('outbox')
  })

  it('resetDb gives every test an empty database', async () => {
    await db.todos.add({ id: 'a', text: 'x', done: 0, createdAt: 1, updatedAt: 1 } as never)
    expect(await db.todos.count()).toBe(1)
    await resetDb()
    expect(await db.todos.count()).toBe(0)
  })
})

describe('fakeSupabase', () => {
  it('records calls and applies upserts/deletes to `remote`', async () => {
    const fake = createFakeSupabase()
    await fake.client.from('links').upsert({ id: 'a' })
    await fake.client.from('links').upsert({ id: 'a', v: 2 } as { id: string })
    await fake.client.from('links').upsert({ id: 'b' })
    await fake.client.from('links').delete().eq('id', 'b')
    expect(fake.remote.links).toEqual([{ id: 'a', v: 2 }])
    expect(fake.calls.map((c) => c.op)).toEqual(['upsert', 'upsert', 'upsert', 'delete'])
    const { data } = await fake.client.from('links').select('id')
    expect(data).toEqual([{ id: 'a', v: 2 }])
  })

  it('failNext fails exactly one matching call', async () => {
    const fake = createFakeSupabase()
    fake.failNext('upsert', { code: '42501', message: 'rls' })
    expect((await fake.client.from('t').upsert({ id: '1' })).error?.code).toBe('42501')
    expect((await fake.client.from('t').upsert({ id: '1' })).error).toBeNull()
    expect(fake.remote.t).toEqual([{ id: '1' }])
  })

  it('failNext can target one table', async () => {
    const fake = createFakeSupabase()
    fake.failNext('select', { message: 'down' }, 'b')
    expect((await fake.client.from('a').select('id')).error).toBeNull()
    expect((await fake.client.from('b').select('id')).error?.message).toBe('down')
  })

  it('select honours order/range and caps a response at maxRows', async () => {
    const fake = createFakeSupabase()
    fake.remote.t = [{ id: 'c' }, { id: 'a' }, { id: 'b' }]
    expect((await fake.client.from('t').select('id').order('id').range(1, 5)).data).toEqual([{ id: 'b' }, { id: 'c' }])
    fake.limits.maxRows = 2
    expect((await fake.client.from('t').select('id')).data).toHaveLength(2)
  })

  it('session can be absent or throw', async () => {
    const fake = createFakeSupabase()
    expect((await fake.client.auth.getSession()).data.session).not.toBeNull()
    fake.signOut()
    expect((await fake.client.auth.getSession()).data.session).toBeNull()
    fake.setSessionThrows(true)
    await expect(fake.client.auth.getSession()).rejects.toThrow()
  })
})
