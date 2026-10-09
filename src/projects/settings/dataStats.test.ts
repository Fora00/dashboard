import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../../test/fakeDb'
import { deadEntries, groupOutbox, tableCounts } from './dataStats'

beforeEach(resetDb)

const entry = (table: string, rowId: string, dead?: 0 | 1, tries?: number) =>
  ({ table, op: 'upsert', rowId, ts: 1, dead, tries }) as never

describe('dataView', () => {
  it('counts rows per table, outbox included, sorted', async () => {
    await db.table('meals').put({ id: 'm1', day: '2026-10-09', createdAt: 1 })
    await db.outbox.add(entry('meals', 'm1'))
    const counts = await tableCounts()
    expect(counts.find((c) => c.name === 'meals')?.rows).toBe(1)
    expect(counts.find((c) => c.name === 'outbox')?.rows).toBe(1)
    expect(counts.map((c) => c.name)).toEqual([...counts.map((c) => c.name)].sort((a, b) => a.localeCompare(b)))
  })
  it('groups outbox entries by table into pending and dead', async () => {
    await db.outbox.bulkAdd([entry('meals', 'a'), entry('meals', 'b', 1, 5), entry('todos', 'c', 0)])
    const all = await db.outbox.toArray()
    expect(groupOutbox(all)).toEqual([
      { table: 'meals', pending: 1, dead: 1 },
      { table: 'todos', pending: 1, dead: 0 },
    ])
    expect(deadEntries(all).map((e) => [e.rowId, e.tries])).toEqual([['b', 5]])
  })
})
