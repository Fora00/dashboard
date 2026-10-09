// Engine-level checks for the owner's interest profile (seed + pins):
// local-first writes (signed out), the remote row shape, clearing as a delete
// tombstone, the seed REPLACING the previous one while pins stay, owner-only
// rejection, pull as source of truth and the row guards. Keys and values are
// obviously fake.
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

const { eventInterestProfileTable, saveSeed, setPin, sync } = await import('./eventInterestProfileSync')

const settle = () =>
  drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${sync.getStatus().syncing}`)
const pushed = () => fake.calls.filter((c) => c.op !== 'select' && c.table === 'event_interest_profile')
const remote = () =>
  (fake.remote.event_interest_profile ?? []) as { id: string; seed: number | null; pin: string | null }[]
const local = async () =>
  (await db.eventInterestProfile.orderBy('id').toArray()).map((r) => [r.id, r.seed, r.pin] as const)

beforeEach(async () => {
  await resetDb()
  fake.reset()
})
afterEach(settle)

describe('event interest profile sync', () => {
  it('signed out: a pin is kept in Dexie and queued, nothing is sent', async () => {
    fake.signOut()
    await setPin('tag:fake-a', 'up')
    await settle()
    expect(await local()).toEqual([['tag:fake-a', null, 'up']])
    expect(await db.outbox.count()).toBe(1)
    expect(pushed()).toHaveLength(0)
  })

  it('signed in: pushes the snake_case row', async () => {
    await setPin('tag:fake-a', 'mute')
    await settle()
    expect(pushed()[0]?.arg).toEqual({ id: 'tag:fake-a', seed: null, pin: 'mute', updated_at: expect.any(Number) })
    expect(await db.outbox.count()).toBe(0)
  })

  it('clearing the last pin of a row without seed deletes it everywhere; with a seed the seed stays', async () => {
    await setPin('tag:fake-a', 'down')
    await saveSeed({ 'tag:fake-b': 0.25 })
    await setPin('tag:fake-b', 'up')
    await settle()
    await setPin('tag:fake-a', null)
    await setPin('tag:fake-b', null)
    await settle()
    expect(await local()).toEqual([['tag:fake-b', 0.25, null]])
    expect(remote()).toEqual([expect.objectContaining({ id: 'tag:fake-b', seed: 0.25, pin: null })])
    expect(pushed().filter((c) => c.op === 'delete')).toHaveLength(1)
  })

  it('a new seed replaces the old one; pins are kept; unchanged rows are not rewritten', async () => {
    await saveSeed({ 'tag:keep': 0.5, 'tag:drop': -0.5, 'tag:drop-pinned': 0.1 })
    await setPin('tag:drop-pinned', 'mute')
    await setPin('tag:new', 'up')
    await settle()
    const before = (await db.eventInterestProfile.get('tag:keep'))!.updatedAt
    fake.calls.length = 0
    await saveSeed({ 'tag:keep': 0.5, 'tag:new': -1 })
    await settle()
    expect(await local()).toEqual([
      ['tag:drop-pinned', null, 'mute'],
      ['tag:keep', 0.5, null],
      ['tag:new', -1, 'up'],
    ])
    expect((await db.eventInterestProfile.get('tag:keep'))!.updatedAt).toBe(before)
    expect(
      pushed()
        .map((c) => `${c.op}`)
        .sort(),
    ).toEqual(['delete', 'upsert', 'upsert'])
    expect(
      remote()
        .map((r) => r.id)
        .sort(),
    ).toEqual(['tag:drop-pinned', 'tag:keep', 'tag:new'])
  })

  it('removing the seed keeps the pins', async () => {
    await saveSeed({ 'tag:a': 0.5, 'tag:b': 0.5 })
    await setPin('tag:b', 'down')
    await saveSeed({})
    await settle()
    expect(await local()).toEqual([['tag:b', null, 'down']])
  })

  it('keys the server would reject are never written', async () => {
    await setPin('City:Fake', 'up')
    await setPin('zz:fake', 'up')
    await saveSeed({ 'not a key': 0.5, 'tag:ok': 0.5, 'tag:big': 3 })
    expect(await local()).toEqual([['tag:ok', 0.5, null]])
    expect(() => eventInterestProfileTable.toRow({ id: 'tag:x', seed: 2, pin: null, updatedAt: 1 })).toThrow()
    expect(() => eventInterestProfileTable.toRow({ id: 'bad', seed: null, pin: 'up', updatedAt: 1 })).toThrow()
  })

  it('a non-owner (RLS 42501) keeps the profile locally as a dead-letter', async () => {
    fake.rejectWith(() => ({ code: '42501', message: 'rls', status: 403 }))
    await setPin('tag:fake-a', 'up')
    await settle()
    expect(sync.getStatus().dead).toBe(1)
    await sync.syncNow()
    await settle()
    expect(await db.eventInterestProfile.count()).toBe(1)
  })

  it('pull: remote is the source of truth; malformed rows are skipped', async () => {
    const rows = [
      { id: 'tag:r1', seed: 0.3, pin: null, updated_at: 5 },
      { id: 'tag:r2', seed: null, pin: 'sideways', updated_at: 5 },
      { id: 'tag:r3', seed: 7, pin: null, updated_at: 5 },
    ]
    fake.remote.event_interest_profile = rows
    await sync.syncNow()
    await settle()
    expect(await local()).toEqual([['tag:r1', 0.3, null]])
    expect(sync.getStatus().skipped).toBe(2)
    fake.remote.event_interest_profile = []
    await sync.syncNow()
    await settle()
    expect(await db.eventInterestProfile.count()).toBe(0)
  })

  it('realtime: a newer pin applies, a stale one loses, a delete removes', async () => {
    await setPin('tag:fake-a', 'up')
    await settle()
    vi.stubGlobal('window', { addEventListener() {}, removeEventListener() {} })
    vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {}, visibilityState: 'hidden' })
    const stop = sync.start()
    await settle()
    const cur = (await db.eventInterestProfile.get('tag:fake-a'))!
    fake.emit('event_interest_profile', {
      eventType: 'UPDATE',
      new: { id: 'tag:fake-a', seed: null, pin: 'down', updated_at: cur.updatedAt - 1 },
      old: null,
    })
    await settle()
    expect((await db.eventInterestProfile.get('tag:fake-a'))?.pin).toBe('up')
    fake.emit('event_interest_profile', {
      eventType: 'UPDATE',
      new: { id: 'tag:fake-a', seed: null, pin: 'down', updated_at: cur.updatedAt + 1000 },
      old: null,
    })
    await until(async () => (await db.eventInterestProfile.get('tag:fake-a'))?.pin === 'down')
    fake.emit('event_interest_profile', { eventType: 'DELETE', new: null, old: { id: 'tag:fake-a' } })
    await until(async () => (await db.eventInterestProfile.get('tag:fake-a')) === undefined)
    stop()
    vi.unstubAllGlobals()
  })
})
