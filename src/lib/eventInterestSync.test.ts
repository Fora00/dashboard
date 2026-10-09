// Engine-level checks for the owner's 👍 / 👎 on events: local-first writes
// (signed out), the remote row shape, un-doing as a delete tombstone, the 👎 ->
// hidden mark link and its undo rule, the snackbar undo, owner-only rejection,
// pull as source of truth, no pruning with the events, and the realtime guard
// that keeps an update without the jsonb from wiping the snapshot.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// fakeDb first: it installs fake-indexeddb before Dexie loads.
import { db, resetDb } from '../test/fakeDb'
import { drain, until } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import { interestFeatures } from '../projects/events/interest'
import type { EventItem } from '../projects/events/types'

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

const { eventInterestTable, isOwnHide, sync, toggleInterest } = await import('./eventInterestSync')
const { pruneEventMarks, sync: marksSync, toggleEventMark } = await import('./eventMarksSync')

const ev = (over: Partial<EventItem> = {}): EventItem => ({
  id: 'abcdef0123456789',
  title: 'Serata giochi',
  start: '2026-10-09T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: 'Ludimus',
  city: 'Trento',
  area: 'trentino',
  ring: 'home',
  url: 'https://example.org/e/1',
  source: 'ludimus',
  sources: ['ludimus'],
  category: 'boardgames',
  tags: ['boardgames'],
  description: 'Giochi da tavolo',
  summary: 'Giochi da tavolo',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-01T04:23:00Z',
  ...over,
})
const ID = ev().id

const settle = () =>
  drain(
    async () =>
      `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${sync.getStatus().syncing}|${marksSync.getStatus().syncing}`,
  )
const pushed = (table: string) => fake.calls.filter((c) => c.op !== 'select' && c.table === table)
const markState = async () => (await db.eventMarks.get(ID))?.state
const signal = async () => (await db.eventInterest.get(ID))?.value

beforeEach(async () => {
  await resetDb()
  fake.reset()
})
afterEach(settle)

describe('event interest sync', () => {
  it('signed out: the 👍 is kept in Dexie and queued, nothing is sent, marks untouched', async () => {
    fake.signOut()
    const res = await toggleInterest(ev(), 1)
    await settle()
    expect(res.hid).toBe(false)
    expect(await db.eventInterest.get(ID)).toMatchObject({ value: 1, features: { category: 'boardgames', hour: 20 } })
    expect(await db.eventMarks.count()).toBe(0)
    expect(await db.outbox.count()).toBe(1)
    expect(fake.calls.filter((c) => c.op !== 'select')).toHaveLength(0)
  })

  it('signed in: pushes the snake_case row with the feature snapshot', async () => {
    await toggleInterest(ev(), 1)
    await settle()
    expect(pushed('event_interest')).toHaveLength(1)
    expect(pushed('event_interest')[0]?.arg).toEqual({
      id: ID,
      value: 1,
      features: {
        v: 1,
        category: 'boardgames',
        tags: ['boardgames'],
        city: 'Trento',
        source: 'ludimus',
        sources: ['ludimus'],
        ring: 'home',
        area: 'trentino',
        weekday: 5,
        hour: 20,
      },
      updated_at: expect.any(Number),
    })
    expect(await db.outbox.count()).toBe(0)
  })

  it('tapping 👍 again deletes the signal locally and remotely (tombstone)', async () => {
    await toggleInterest(ev(), 1)
    await settle()
    expect(fake.remote.event_interest).toHaveLength(1)
    await toggleInterest(ev(), 1)
    await settle()
    expect(await db.eventInterest.get(ID)).toBeUndefined()
    expect(fake.remote.event_interest).toHaveLength(0)
    expect(pushed('event_interest').map((c) => c.op)).toEqual(['upsert', 'delete'])
  })

  it('👍 never saves or changes a mark', async () => {
    await toggleEventMark(ev(), 'saved')
    const before = await db.eventMarks.get(ID)
    await toggleInterest(ev(), 1)
    await toggleInterest(ev(), 1)
    await settle()
    expect(await db.eventMarks.get(ID)).toEqual(before)
  })

  it('👎 hides the event (linked by one stamp); tapping it again un-hides it', async () => {
    const res = await toggleInterest(ev(), -1)
    await settle()
    expect(res.hid).toBe(true)
    const sig = (await db.eventInterest.get(ID))!
    const mark = (await db.eventMarks.get(ID))!
    expect(mark.state).toBe('hidden')
    expect(mark.updatedAt).toBe(sig.updatedAt)
    expect(isOwnHide(sig, mark)).toBe(true)
    expect(fake.remote.event_marks).toEqual([expect.objectContaining({ state: 'hidden' })])
    expect(fake.remote.event_interest).toEqual([expect.objectContaining({ value: -1 })])

    await toggleInterest(ev(), -1)
    await settle()
    expect(await signal()).toBeUndefined()
    expect(await markState()).toBeUndefined()
    expect(fake.remote.event_marks).toHaveLength(0)
    expect(fake.remote.event_interest).toHaveLength(0)
  })

  it('👎 on an event already hidden with Hide leaves that hide alone, also on undo', async () => {
    await toggleEventMark(ev(), 'hidden')
    const hide = (await db.eventMarks.get(ID))!
    const res = await toggleInterest(ev(), -1)
    expect(res.hid).toBe(false)
    expect(await db.eventMarks.get(ID)).toEqual(hide)
    await toggleInterest(ev(), -1)
    await settle()
    expect(await signal()).toBeUndefined()
    expect(await db.eventMarks.get(ID)).toEqual(hide)
  })

  it('a hide redone with Hide after the 👎 belongs to the owner and survives undoing the 👎', async () => {
    await toggleInterest(ev(), -1)
    await toggleEventMark(ev(), 'hidden') // Unhide
    expect(await markState()).toBeUndefined()
    await toggleEventMark(ev(), 'hidden') // Hide again
    await toggleInterest(ev(), -1) // undo the 👎
    await settle()
    expect(await signal()).toBeUndefined()
    expect(await markState()).toBe('hidden')
  })

  it('👎 on a saved event hides it like Hide; switching to 👍 un-hides it', async () => {
    await toggleEventMark(ev(), 'saved')
    await toggleInterest(ev(), -1)
    expect(await markState()).toBe('hidden')
    const res = await toggleInterest(ev(), 1)
    await settle()
    expect(res.hid).toBe(false)
    expect(await signal()).toBe(1)
    // The save was replaced by the 👎's hide, exactly as Hide would have.
    expect(await markState()).toBeUndefined()
    expect(fake.remote.event_marks ?? []).toHaveLength(0)
    expect(fake.remote.event_interest).toEqual([expect.objectContaining({ value: 1 })])
  })

  it('switching 👍 -> 👎 hides; the snackbar undo puts back the 👍 and the saved mark', async () => {
    await toggleEventMark(ev(), 'saved')
    await toggleInterest(ev(), 1)
    const before = (await db.eventInterest.get(ID))!
    const res = await toggleInterest(ev(), -1)
    expect(res.hid).toBe(true)
    expect(await markState()).toBe('hidden')
    await res.undo()
    await settle()
    expect(await signal()).toBe(1)
    expect((await db.eventInterest.get(ID))!.updatedAt).toBeGreaterThan(before.updatedAt)
    expect(await markState()).toBe('saved')
    expect(fake.remote.event_marks).toEqual([expect.objectContaining({ state: 'saved' })])
    expect(fake.remote.event_interest).toEqual([expect.objectContaining({ value: 1 })])
  })

  it('the snackbar undo of a first 👎 clears both everywhere', async () => {
    const res = await toggleInterest(ev(), -1)
    await settle()
    await res.undo()
    await settle()
    expect(await db.eventInterest.count()).toBe(0)
    expect(await db.eventMarks.count()).toBe(0)
    expect(fake.remote.event_interest).toHaveLength(0)
    expect(fake.remote.event_marks).toHaveLength(0)
  })

  it('undoing a 👎 -> 👍 switch restores the 👎 still linked to its hide', async () => {
    await toggleInterest(ev(), -1)
    const res = await toggleInterest(ev(), 1)
    expect(await markState()).toBeUndefined()
    await res.undo()
    await settle()
    const sig = (await db.eventInterest.get(ID))!
    expect(sig.value).toBe(-1)
    expect(isOwnHide(sig, await db.eventMarks.get(ID))).toBe(true)
  })

  it('an id the server would reject is ignored', async () => {
    const res = await toggleInterest(ev({ id: 'bad id/with spaces' }), -1)
    expect(res.hid).toBe(false)
    expect(await db.eventInterest.count()).toBe(0)
    expect(await db.eventMarks.count()).toBe(0)
  })

  it('a non-owner (RLS 42501) keeps the signal locally as a dead-letter', async () => {
    fake.rejectWith(() => ({ code: '42501', message: 'rls', status: 403 }))
    await toggleInterest(ev(), 1)
    await settle()
    expect(await db.eventInterest.count()).toBe(1)
    expect(sync.getStatus().dead).toBe(1)
    // A pull (the server shows a non-owner nothing) must not wipe it either.
    await sync.syncNow()
    await settle()
    expect(await db.eventInterest.count()).toBe(1)
  })

  it('pull: remote is the source of truth for rows with nothing queued', async () => {
    const row = eventInterestTable.toRow({
      id: 'r1',
      value: -1,
      features: interestFeatures(ev({ id: 'r1' })),
      updatedAt: 5,
    })
    fake.remote.event_interest = [row]
    await sync.syncNow()
    await settle()
    expect((await db.eventInterest.get('r1'))?.value).toBe(-1)
    fake.remote.event_interest = []
    await sync.syncNow()
    await settle()
    expect(await db.eventInterest.get('r1')).toBeUndefined()
  })

  it('signals outlive their events: pruning the marks of past events leaves them', async () => {
    const past = ev({ start: '2026-10-01T20:00:00+02:00' })
    await toggleInterest(past, -1)
    await settle()
    expect(await pruneEventMarks(new Date(2026, 9, 10, 12).getTime())).toBe(1)
    await settle()
    expect(await db.eventMarks.count()).toBe(0)
    expect(await signal()).toBe(-1)
    expect(fake.remote.event_interest).toHaveLength(1)
  })

  it('a realtime update without the features never wipes the local snapshot; stale updates lose', async () => {
    await toggleInterest(ev(), 1)
    await settle()
    vi.stubGlobal('window', { addEventListener() {}, removeEventListener() {} })
    vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {}, visibilityState: 'hidden' })
    const stop = sync.start()
    await settle()
    const local = (await db.eventInterest.get(ID))!
    const row = { ...eventInterestTable.toRow(local), value: -1, updated_at: local.updatedAt + 1000 }
    const { features: _drop, ...noFeatures } = row
    fake.emit('event_interest', { eventType: 'UPDATE', new: noFeatures, old: null })
    fake.emit('event_interest', { eventType: 'UPDATE', new: { ...row, features: 'unchanged_toast' }, old: null })
    fake.emit('event_interest', { eventType: 'UPDATE', new: { ...row, updated_at: local.updatedAt - 1 }, old: null })
    await settle()
    expect(await db.eventInterest.get(ID)).toMatchObject({ value: 1, features: { category: 'boardgames' } })
    fake.emit('event_interest', { eventType: 'UPDATE', new: row, old: null })
    await until(async () => (await signal()) === -1)
    fake.emit('event_interest', { eventType: 'DELETE', new: null, old: { id: ID } })
    await until(async () => (await db.eventInterest.get(ID)) === undefined)
    stop()
    vi.unstubAllGlobals()
  })
})
