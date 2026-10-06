// Wrapper cascades: deleting a parent (shop area, climb session, habit) queues
// ONE outbox tombstone and removes the children locally only (the server's FK
// cascade removes them remotely). Runs the real wrapper modules on fake-indexeddb.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import * as shop from './shopSync'
import * as climb from './climbSync'
import * as habit from './habitSync'

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

const settle = () => drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}`)
const pushed = () => fake.calls.filter((c) => c.op !== 'select').map((c) => `${c.op} ${c.table}`)
const outboxOps = async () => (await db.outbox.orderBy('seq').toArray()).map((e) => `${e.op} ${e.table}`)

beforeEach(async () => {
  await resetDb()
  fake.reset()
  vi.unstubAllGlobals()
  vi.stubGlobal('navigator', { onLine: false }) // queue only, deliver on demand
})
afterEach(async () => {
  await settle()
  vi.unstubAllGlobals()
})

describe('removeCascade via the wrappers', () => {
  it('shop deleteArea: outbox order, local children gone, pending count, push order', async () => {
    const area = await shop.addArea('A')
    await shop.addShopItem('milk', area.id)
    await shop.addShopItem('eggs', area.id)
    await shop.deleteArea(area.id)
    await settle()

    expect(await db.shopAreas.get(area.id)).toBeUndefined()
    expect(await db.shopItems.where('areaId').equals(area.id).count()).toBe(0)
    const want = ['upsert shop_areas', 'upsert shop_items', 'upsert shop_items', 'delete shop_areas']
    expect(await outboxOps()).toEqual(want)
    expect(shop.sync.getStatus().pending).toBe(4)

    vi.stubGlobal('navigator', { onLine: true })
    await shop.flush()
    await settle()
    expect(pushed()).toEqual(want)
    expect(shop.sync.getStatus().pending).toBe(0)
  })

  it('climb deleteSession: one tombstone, climbs removed locally only', async () => {
    const s = await climb.addSession({ date: '2026-09-30', location: 'gym', discipline: 'boulder' })
    await climb.addClimb(s, '6a', true)
    await climb.deleteSession(s.id)
    await settle()
    expect(await db.climbs.count()).toBe(0)
    expect(await db.climbSessions.count()).toBe(0)
    const dels = (await db.outbox.toArray()).filter((e) => e.op === 'delete')
    expect(dels.map((e) => e.table)).toEqual(['climb_sessions'])
  })

  it('habit deleteHabit: one tombstone, checks removed locally only', async () => {
    const h = await habit.addHabit('read', 'B')
    await habit.toggleCheck(h.id, '2026-09-30')
    await habit.deleteHabit(h)
    await settle()
    expect(await db.habitChecks.count()).toBe(0)
    expect(await db.habits.count()).toBe(0)
    const dels = (await db.outbox.toArray()).filter((e) => e.op === 'delete')
    expect(dels.map((e) => e.table)).toEqual(['habits'])
  })

  it('a cascade leaves unrelated rows of the same child table alone', async () => {
    const a = await shop.addArea('A')
    const b = await shop.addArea('B')
    await shop.addShopItem('x', a.id)
    await shop.addShopItem('y', b.id)
    await shop.deleteArea(a.id)
    await settle()
    expect((await db.shopItems.toArray()).map((i) => i.text)).toEqual(['y'])
  })
})
