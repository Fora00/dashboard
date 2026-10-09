// Regression suite for the generic sync engine (src/lib/cloudSync.ts): offline
// edits never dead-letter, poison entries do, pull vs concurrent writes,
// retry/discard semantics, malformed rows, LWW realtime, signed-out safety.
// Dexie runs on fake-indexeddb; Supabase is the scriptable fake in src/test.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain, until } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import { createCloudSync, type CloudSync, type TableSync } from './cloudSync'
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

interface TodoRow {
  id: string
  text: string
  done: boolean
  created_at: number
  updated_at: number
}
const todosTable: TableSync<Todo, TodoRow> = {
  remote: 'todos',
  table: () => db.todos,
  columns: 'id, text, done, created_at, updated_at',
  realtime: true,
  updatedAt: (t) => t.updatedAt,
  toRow: (t) => ({
    id: t.id,
    text: t.text,
    done: t.done === 1,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }),
  fromRow: (r) => {
    if (typeof r.text !== 'string') throw new Error('bad row')
    return {
      id: r.id,
      text: r.text,
      done: r.done ? 1 : 0,
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }
  },
}

const todo = (id: string, text = id, updatedAt = 1): Todo => ({
  id,
  text,
  done: 0,
  createdAt: 1,
  updatedAt,
})
const row = (t: Todo) => todosTable.toRow(t)
const serverRows = () => (fake.remote.todos ?? []) as unknown as TodoRow[]
const pushed = () => fake.calls.filter((c) => c.op !== 'select')

let eng: CloudSync
const settle = () =>
  drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${eng.getStatus().syncing}`)
const offline = (v: boolean) => vi.stubGlobal('navigator', { onLine: !v })

beforeEach(async () => {
  await resetDb()
  fake.reset()
  vi.unstubAllGlobals()
  eng = createCloudSync({ projectId: 'todo', tables: [todosTable] })
})
afterEach(async () => {
  await settle()
  vi.unstubAllGlobals()
})

describe('offline edits are never dead-lettered', () => {
  it('network down (onLine lies): 10 edits stay pending, then deliver in order', async () => {
    fake.setNetwork('down')
    for (let i = 0; i < 10; i++) {
      await eng.upsert('todos', todo(`t${i}`))
      await settle()
    }
    expect((await db.outbox.toArray()).filter((e) => e.dead)).toHaveLength(0)
    expect(eng.getStatus().dead).toBe(0)
    expect(eng.getStatus().pending).toBe(10)

    fake.setNetwork('up')
    fake.calls.length = 0
    await eng.flush()
    await settle()
    expect(pushed().map((c) => `${c.op} ${(c.arg as { id: string }).id}`)).toEqual(
      Array.from({ length: 10 }, (_, i) => `upsert t${i}`),
    )
    expect(await db.outbox.count()).toBe(0)
    expect(eng.getStatus().pending).toBe(0)
  })

  it('navigator.onLine === false: no request is attempted; online delivers', async () => {
    offline(true)
    for (let i = 0; i < 3; i++) await eng.upsert('todos', todo(`o${i}`))
    await settle()
    expect(fake.calls).toHaveLength(0)
    expect(eng.getStatus().pending).toBe(3)

    offline(false)
    await eng.flush()
    await settle()
    expect(pushed()).toHaveLength(3)
    expect(eng.getStatus().pending).toBe(0)
  })
})

describe('server-answered failures', () => {
  it('RLS denial (42501) dead-letters at once while later entries still push', async () => {
    fake.rejectWith((_t, _op, id) => (id === 'bad' ? { code: '42501', message: 'rls', status: 403 } : null))
    await eng.upsert('todos', todo('good1'))
    await eng.upsert('todos', todo('bad'))
    await eng.upsert('todos', todo('good2'))
    await settle()
    await eng.flush()
    await settle()
    const bad = await db.outbox.where('rowId').equals('bad').first()
    expect(bad?.dead).toBe(1)
    expect(eng.getStatus().dead).toBe(1)
    expect(eng.getStatus().lastError).toMatch(/rejected/)
    expect(
      serverRows()
        .map((r) => r.id)
        .sort(),
    ).toEqual(['good1', 'good2'])
    expect(await db.todos.get('bad')).toBeDefined()
  })

  it('a 500 is counted and goes dead exactly at try 8', async () => {
    fake.rejectWith(() => ({ code: 'XX000', message: 'boom', status: 500 }))
    await eng.upsert('todos', todo('flaky'))
    await settle() // try 1
    for (let i = 0; i < 6; i++) {
      await eng.flush()
      await settle()
    }
    const e7 = await db.outbox.where('rowId').equals('flaky').first()
    expect(e7?.tries).toBe(7)
    expect(e7?.dead ?? 0).toBe(0)
    await eng.flush()
    await settle()
    expect((await db.outbox.where('rowId').equals('flaky').first())?.dead).toBe(1)
  })

  it('a transient 500 shows as retrying until it goes through', async () => {
    fake.rejectWith(() => ({ code: 'XX000', message: 'boom', status: 500 }))
    await eng.upsert('todos', todo('flaky2'))
    await settle()
    expect(eng.getStatus()).toMatchObject({ pending: 1, retrying: 1, dead: 0 })
    fake.rejectWith(() => null)
    await eng.flush()
    await settle()
    expect(eng.getStatus()).toMatchObject({ pending: 0, retrying: 0 })
  })

  it('an expired JWT (PGRST301 / 401) is never counted and never dead', async () => {
    fake.rejectWith(() => ({ code: 'PGRST301', message: 'jwt expired', status: 401 }))
    await eng.upsert('todos', todo('jwt'))
    for (let i = 0; i < 10; i++) {
      await eng.flush()
      await settle()
    }
    const e = await db.outbox.where('rowId').equals('jwt').first()
    expect(e?.dead ?? 0).toBe(0)
    expect(e?.tries ?? 0).toBe(0)
  })

  it.each([
    ['22P02', 'invalid uuid'],
    ['22007', 'invalid date'],
    ['42703', 'column does not exist'],
    ['PGRST204', 'column not in schema cache'],
  ])('a data/schema error (%s) dead-letters at once, never retried', async (code, message) => {
    fake.rejectWith((_t, _op, id) => (id === 'bad' ? { code, message, status: 400 } : null))
    await eng.upsert('todos', todo('bad'))
    await eng.upsert('todos', todo('good'))
    await settle()
    const bad = await db.outbox.where('rowId').equals('bad').first()
    expect(bad?.dead).toBe(1)
    expect(bad?.tries).toBe(1)
    expect(serverRows().map((r) => r.id)).toEqual(['good'])
  })

  it('uniqueViolationIsDone: a 23505 drops the entry as delivered, not dead', async () => {
    const eng2 = createCloudSync({ projectId: 'todo', tables: [{ ...todosTable, uniqueViolationIsDone: true }] })
    fake.rejectWith((_t, _op, id) => (id === 'dup' ? { code: '23505', message: 'duplicate key', status: 409 } : null))
    await eng2.upsert('todos', todo('dup'))
    await eng2.upsert('todos', todo('after'))
    await drain(async () => `${fake.calls.length}|${await db.outbox.count()}`)
    expect(await db.outbox.count()).toBe(0)
    expect(eng2.getStatus().dead).toBe(0)
    expect(serverRows().map((r) => r.id)).toEqual(['after'])
  })

  it('without the flag a 23505 still dead-letters', async () => {
    fake.rejectWith(() => ({ code: '23505', message: 'duplicate key', status: 409 }))
    await eng.upsert('todos', todo('dup'))
    await settle()
    expect((await db.outbox.toArray())[0]?.dead).toBe(1)
  })

  it('a bare 401 without a code is also an auth wait, not a try', async () => {
    fake.rejectWith(() => ({ message: 'unauthorized', status: 401 }))
    await eng.upsert('todos', todo('u401'))
    await settle()
    expect((await db.outbox.toArray())[0]?.tries ?? 0).toBe(0)
  })
})

describe('pull racing local writes', () => {
  it('a row created during a pull survives locally and reaches the server', async () => {
    const release = fake.holdSelects()
    const cycle = eng.syncNow()
    await until(() => fake.calls.some((c) => c.op === 'select'))
    await eng.upsert('todos', todo('X'))
    release()
    await cycle
    await settle()
    await eng.flush()
    await settle()
    expect(await db.todos.get('X')).toBeDefined()
    expect(serverRows().map((r) => r.id)).toContain('X')
  })

  it('a row edited during a pull is not clobbered by the stale select', async () => {
    const v1 = todo('Y', 'v1')
    await db.todos.put(v1)
    fake.remote.todos = [row(v1)]
    const release = fake.holdSelects()
    const cycle = eng.syncNow()
    await until(() => fake.calls.some((c) => c.op === 'select'))
    await eng.upsert('todos', { ...v1, text: 'v2', updatedAt: 2 })
    release()
    await cycle
    await settle()
    expect((await db.todos.get('Y'))?.text).toBe('v2')
  })

  it('a row deleted during a pull is not resurrected', async () => {
    const z = todo('Z')
    await db.todos.put(z)
    fake.remote.todos = [row(z)]
    const release = fake.holdSelects()
    const cycle = eng.syncNow()
    await until(() => fake.calls.some((c) => c.op === 'select'))
    await eng.remove('todos', 'Z')
    release()
    await cycle
    await settle()
    expect(await db.todos.get('Z')).toBeUndefined()
  })
})

describe('retryDead / discardDead', () => {
  it('retryDead: two dead edits of one row requeue as ONE push of the current state', async () => {
    let deny = true
    fake.rejectWith((_t, _op, id) => (deny && id === 'R' ? { code: '42501', message: 'rls', status: 403 } : null))
    await eng.upsert('todos', todo('R', 'v1'))
    await settle()
    await eng.upsert('todos', todo('R', 'v2'))
    await settle()
    expect(eng.getStatus().dead).toBe(2)

    deny = false
    fake.calls.length = 0
    await eng.retryDead()
    await settle()
    expect(await db.outbox.count()).toBe(0)
    expect(serverRows().find((r) => r.id === 'R')?.text).toBe('v2')
    expect(pushed().filter((c) => (c.arg as { id: string }).id === 'R')).toHaveLength(1)
    expect(eng.getStatus().dead).toBe(0)
    expect(eng.getStatus().lastError).toBeNull()
  })

  it('retryDead never rolls the server back to a stale dead payload', async () => {
    let deny = true
    fake.rejectWith((_t, _op, id) => (deny && id === 'R2' ? { code: '23505', message: 'dup', status: 409 } : null))
    await eng.upsert('todos', todo('R2', 'v1'))
    await settle()
    deny = false
    await eng.upsert('todos', todo('R2', 'v2'))
    await settle()
    await eng.retryDead()
    await settle()
    expect(serverRows().find((r) => r.id === 'R2')?.text).toBe('v2')
    expect((await db.todos.get('R2'))?.text).toBe('v2')
  })

  it('retryDead requeues at the end in original relative order; a vanished row becomes a delete', async () => {
    fake.rejectWith((_t, _op, id) => (id !== 'ok' ? { code: '42501', message: 'rls', status: 403 } : null))
    await eng.upsert('todos', todo('a'))
    await eng.upsert('todos', todo('b'))
    await eng.upsert('todos', todo('ok'))
    await eng.remove('todos', 'b')
    await settle()
    fake.rejectWith(null)
    fake.calls.length = 0
    await eng.retryDead()
    await settle()
    // a: still local -> upsert. b: gone locally -> delete. Original order a, b.
    expect(pushed().map((c) => `${c.op} ${c.op === 'delete' ? String(c.arg) : (c.arg as { id: string }).id}`)).toEqual([
      'upsert a',
      'delete b',
    ])
  })

  it('discardDead drops the tombstones; the next pull takes the server version', async () => {
    fake.remote.todos = [row(todo('D', 'server'))]
    fake.rejectWith((_t, op, id) =>
      op === 'upsert' && (id === 'D' || id === 'E') ? { code: '42501', message: 'rls', status: 403 } : null,
    )
    await eng.upsert('todos', todo('D', 'local'))
    await eng.upsert('todos', todo('E', 'local-only'))
    await settle()
    expect(eng.getStatus().dead).toBe(2)

    await eng.discardDead()
    await settle()
    expect(await db.outbox.count()).toBe(0)
    expect(eng.getStatus().dead).toBe(0)
    expect(eng.getStatus().lastError).toBeNull()
    expect((await db.todos.get('D'))?.text).toBe('server')
    expect(await db.todos.get('E')).toBeUndefined()
  })
})

describe('pull shield and remote rows', () => {
  it('a dead-lettered row is shielded from pull deletion', async () => {
    fake.rejectWith(() => ({ code: '42501', message: 'rls', status: 403 }))
    await eng.upsert('todos', todo('mine', 'local only'))
    await settle()
    expect((await db.outbox.toArray())[0]?.dead).toBe(1)
    fake.rejectWith(null)
    await eng.syncNow() // remote has no 'mine'
    await settle()
    expect((await db.todos.get('mine'))?.text).toBe('local only')
  })

  it('a pull removes local rows the server no longer has (when not shielded)', async () => {
    await db.todos.put(todo('gone'))
    fake.remote.todos = [row(todo('kept'))]
    await eng.syncNow()
    await settle()
    expect(await db.todos.get('gone')).toBeUndefined()
    expect(await db.todos.get('kept')).toBeDefined()
    expect(eng.getStatus().lastSyncedAt).not.toBeNull()
  })

  it('malformed remote rows are skipped and counted; pull does not crash', async () => {
    await db.todos.put(todo('m1', 'keep me'))
    fake.selectOverride.todos = [row(todo('ok')), null, { foo: 1 }, { id: 'm1', text: 42 }]
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(eng.syncNow()).resolves.toBeUndefined()
    await settle()
    expect(await db.todos.get('ok')).toBeDefined()
    // remote copy unreadable: the local row must NOT be deleted
    expect((await db.todos.get('m1'))?.text).toBe('keep me')
    expect(eng.getStatus().skipped).toBe(3)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('a failed select aborts the whole pull (no partial delete)', async () => {
    await db.todos.put(todo('local1'))
    fake.failNext('select', { message: 'down', status: 500 })
    await eng.syncNow()
    await settle()
    expect(await db.todos.get('local1')).toBeDefined()
    expect(eng.getStatus().lastSyncedAt).toBeNull()
    expect(eng.getStatus().pullFailed).toBe(true)
    await eng.syncNow() // the next complete pull clears it
    await settle()
    expect(eng.getStatus().pullFailed).toBe(false)
  })

  it('a table past the 1000-row cap is fully pulled and no local row is deleted', async () => {
    const ids = Array.from({ length: 2500 }, (_, i) => `p${String(i).padStart(4, '0')}`)
    // Local copies on both sides of the 1000-row cap: an unpaged select would
    // only return p0000..p0999 and pull would delete the other three. (Few
    // local rows on purpose: overwriting thousands is slow on fake-indexeddb.)
    const atRisk = ['p1000', 'p1999', 'p2499']
    await db.todos.bulkPut(['p0000', ...atRisk].map((id) => todo(id, 'local')))
    fake.remote.todos = ids.map((id) => row(todo(id, 'server')))
    await eng.syncNow()
    await settle()
    expect(await db.todos.count()).toBe(2500)
    for (const id of atRisk) expect((await db.todos.get(id))?.text).toBe('server')
    expect(fake.calls.filter((c) => c.op === 'select')).toHaveLength(3)
    expect(eng.getStatus().lastSyncedAt).not.toBeNull()
  })

  it('a page error mid-way aborts the pull without deleting anything', async () => {
    const ids = Array.from({ length: 2500 }, (_, i) => `q${String(i).padStart(4, '0')}`)
    await db.todos.bulkPut(ids.map((id) => todo(id, 'local')))
    await db.todos.put(todo('zz-local-only'))
    fake.remote.todos = ids.map((id) => row(todo(id, 'server')))
    let selects = 0
    fake.rejectWith((_t, op) => (op === 'select' && ++selects === 2 ? { message: 'down', status: 500 } : null))
    await eng.syncNow()
    await settle()
    expect(await db.todos.count()).toBe(2501)
    expect((await db.todos.get('q0000'))?.text).toBe('local')
    expect(eng.getStatus().lastSyncedAt).toBeNull()
  })

  it('keyset paging: a row deleted on the server between two pages skips nothing', async () => {
    const ids = Array.from({ length: 2500 }, (_, i) => `k${String(i).padStart(4, '0')}`)
    // k1000 is the first row of page 2. With offset paging (range 1000..1999)
    // deleting a page-1 row before page 2 shifts k1000 into offset 999 and it
    // is never returned: pull would then delete the local copy.
    await db.todos.bulkPut(['k1000', 'k2000'].map((id) => todo(id, 'local')))
    fake.remote.todos = ids.map((id) => row(todo(id, 'server')))
    let selects = 0
    fake.rejectWith((_t, op) => {
      if (op === 'select' && ++selects === 2)
        fake.remote.todos = (fake.remote.todos ?? []).filter((r) => r.id !== 'k0005')
      return null
    })
    await eng.syncNow()
    await settle()
    expect((await db.todos.get('k1000'))?.text).toBe('server')
    expect((await db.todos.get('k2000'))?.text).toBe('server')
    expect(await db.todos.count()).toBe(2500) // k0005 was read on page 1; the next pull drops it
    const pages = fake.calls.filter((c) => c.op === 'select')
    expect(pages).toHaveLength(3)
  })

  it('afterPull runs after a complete pull only', async () => {
    let runs = 0
    const eng2 = createCloudSync({
      projectId: 'todo',
      tables: [todosTable],
      afterPull: async () => {
        runs++
      },
    })
    await eng2.syncNow()
    expect(runs).toBe(1)
    fake.failNext('select', { message: 'down', status: 500 })
    await eng2.syncNow()
    expect(runs).toBe(1)
  })

  it('sign-out during the selects aborts the pull without touching local rows', async () => {
    await db.todos.put(todo('local1'))
    const release = fake.holdSelects()
    const cycle = eng.syncNow()
    await until(() => fake.calls.some((c) => c.op === 'select'))
    fake.signOut()
    release()
    await cycle
    await settle()
    expect(await db.todos.get('local1')).toBeDefined()
    expect(eng.getStatus().lastSyncedAt).toBeNull()
  })

  it('a user switch during the selects aborts the pull without touching local rows', async () => {
    await db.todos.put(todo('local1', 'mine'))
    fake.remote.todos = [row(todo('other'))]
    const release = fake.holdSelects()
    const cycle = eng.syncNow()
    await until(() => fake.calls.some((c) => c.op === 'select'))
    fake.signIn('someone-else')
    release()
    await cycle
    await settle()
    expect((await db.todos.get('local1'))?.text).toBe('mine')
    expect(await db.todos.get('other')).toBeUndefined()
    expect(eng.getStatus().lastSyncedAt).toBeNull()
  })

  it('signed-out syncNow never deletes local rows and makes no request', async () => {
    await db.todos.put(todo('local1'))
    fake.signOut()
    await eng.syncNow()
    await settle()
    expect(await db.todos.get('local1')).toBeDefined()
    expect(fake.calls).toHaveLength(0)
  })
})

describe('nested transaction', () => {
  it('engine.upsert inside a wrapper db.transaction still flushes cleanly', async () => {
    await db.transaction('rw', db.todos, db.outbox, async () => {
      await eng.upsert('todos', todo('n1'))
      await eng.upsert('todos', todo('n2'))
    })
    await settle()
    expect(
      serverRows()
        .map((r) => r.id)
        .sort(),
    ).toEqual(['n1', 'n2'])
    expect(await db.outbox.count()).toBe(0)
  })
})

describe('realtime (last-writer-wins)', () => {
  let stop: () => void
  beforeEach(async () => {
    vi.stubGlobal('window', { addEventListener() {}, removeEventListener() {} })
    vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {}, visibilityState: 'hidden' })
    await db.todos.put(todo('r', 'local', 10))
    fake.remote.todos = [row(todo('r', 'local', 10))]
    stop = eng.start()
    await settle()
    expect(fake.channels).toEqual(['todo:todos'])
  })
  afterEach(() => stop())

  const event = (eventType: string, t: Todo | null, old: { id: string } | null = null) =>
    fake.emit('todos', { eventType, new: t ? row(t) : null, old })
  const realtimeSettle = () => drain(async () => JSON.stringify(await db.todos.toArray()))

  it('a newer event wins, a stale event is dropped', async () => {
    event('UPDATE', todo('r', 'newer', 20))
    await realtimeSettle()
    expect((await db.todos.get('r'))?.text).toBe('newer')
    event('UPDATE', todo('r', 'stale', 5))
    await realtimeSettle()
    expect((await db.todos.get('r'))?.text).toBe('newer')
  })

  it('an insert and a delete event apply', async () => {
    event('INSERT', todo('fresh', 'hello', 3))
    await realtimeSettle()
    expect(await db.todos.get('fresh')).toBeDefined()
    event('DELETE', null, { id: 'fresh' })
    await realtimeSettle()
    expect(await db.todos.get('fresh')).toBeUndefined()
  })

  it('events for a row with a pending outbox entry are ignored', async () => {
    fake.setNetwork('down')
    await eng.upsert('todos', todo('r', 'mine', 30))
    await settle()
    event('UPDATE', todo('r', 'theirs', 99))
    event('DELETE', null, { id: 'r' })
    await realtimeSettle()
    expect((await db.todos.get('r'))?.text).toBe('mine')
  })

  it('an event arriving during a pull is applied after it, not overwritten by its stale snapshot', async () => {
    const release = fake.holdSelects()
    const cycle = eng.syncNow()
    await until(() => fake.calls.filter((c) => c.op === 'select').length >= 2)
    // The pull's snapshot still says 'local' @10; the event is newer.
    event('UPDATE', todo('r', 'newer', 20))
    await realtimeSettle()
    expect((await db.todos.get('r'))?.text).toBe('local') // queued behind the pull
    release()
    await cycle
    await realtimeSettle()
    expect((await db.todos.get('r'))?.text).toBe('newer')
  })

  it('a malformed event is ignored', async () => {
    fake.emit('todos', { eventType: 'UPDATE', new: { id: 'r', text: 7 }, old: null })
    await realtimeSettle()
    expect((await db.todos.get('r'))?.text).toBe('local')
  })
})
