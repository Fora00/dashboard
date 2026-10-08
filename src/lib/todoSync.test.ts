import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

import { addTodo, clearDoneTodos, deleteTodo, MAX_TEXT_LENGTH, toggleTodo } from './todoSync'

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

const ops = async () => (await db.outbox.toArray()).filter((o) => o.table === 'todos').map((o) => o.op)

describe('todo local mutations', () => {
  it('adds a trimmed, capped todo and queues an upsert; blank is ignored', async () => {
    await addTodo('   ')
    expect(await db.todos.count()).toBe(0)
    await addTodo(`  ${'x'.repeat(MAX_TEXT_LENGTH + 10)}  `)
    const all = await db.todos.toArray()
    expect(all).toHaveLength(1)
    expect(all[0]?.text).toHaveLength(MAX_TEXT_LENGTH)
    expect(all[0]?.done).toBe(0)
    expect(await ops()).toEqual(['upsert'])
  })

  it('toggle flips done both ways and bumps updatedAt', async () => {
    await addTodo('a')
    const t = (await db.todos.toArray())[0]!
    await new Promise((r) => setTimeout(r, 5))
    await toggleTodo(t)
    const on = (await db.todos.get(t.id))!
    expect(on.done).toBe(1)
    expect(on.updatedAt).toBeGreaterThan(t.updatedAt)
    await toggleTodo(on)
    expect((await db.todos.get(t.id))?.done).toBe(0)
  })

  it('delete removes the row and queues a delete', async () => {
    await addTodo('a')
    const t = (await db.todos.toArray())[0]!
    await deleteTodo(t.id)
    expect(await db.todos.count()).toBe(0)
    expect(await ops()).toContain('delete')
  })

  it('clearDoneTodos removes only done todos, one tombstone each', async () => {
    await addTodo('a')
    await addTodo('b')
    await addTodo('c')
    const [a, b] = await db.todos.toArray()
    await toggleTodo(a!)
    await toggleTodo(b!)
    await clearDoneTodos()
    const left = await db.todos.toArray()
    expect(left).toHaveLength(1)
    expect(left[0]?.done).toBe(0)
    const deletes = (await db.outbox.toArray()).filter((o) => o.op === 'delete')
    expect(deletes.map((d) => d.rowId).sort()).toEqual([a!.id, b!.id].sort())
  })

  it('clearDoneTodos with nothing done queues nothing', async () => {
    await addTodo('a')
    await clearDoneTodos()
    expect(await db.todos.count()).toBe(1)
    expect((await db.outbox.toArray()).filter((o) => o.op === 'delete')).toHaveLength(0)
  })
})
