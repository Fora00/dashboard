// Engine-level checks for the owner's saved/hidden marks and favourite
// categories: local-first writes (signed out), the remote row shape, un-save
// as a delete tombstone, undo, owner-only rejection, the realtime guard that
// keeps a TOAST-less update from wiping the snapshot, LWW, and the Dexie v15
// upgrade that queues pre-sync marks so the first pull can't wipe them.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// fakeDb first: it installs fake-indexeddb before Dexie loads.
import { db, resetDb } from '../test/fakeDb'
import Dexie from 'dexie'
import { drain, until } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import type { EventMark } from './db'
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

const { eventMarksTable, pruneEventMarks, restoreEventMark, setFavouriteCategories, sync, toggleEventMark } =
  await import('./eventMarksSync')
const { deleteCustomEvent, saveCustomEvent, sync: customSync } = await import('./customEventsSync')

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
  image: 'https://example.org/i.jpg',
  occurrences: 1,
  fetchedAt: '2026-10-01T04:23:00Z',
  ...over,
})

const settle = () =>
  drain(
    async () =>
      `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${sync.getStatus().syncing}|${customSync.getStatus().syncing}`,
  )
const pushed = () => fake.calls.filter((c) => c.op !== 'select')

beforeEach(async () => {
  await resetDb()
  fake.reset()
})
afterEach(settle)

describe('event marks sync', () => {
  it('signed out: the mark is saved in Dexie and queued, nothing is sent', async () => {
    fake.signOut()
    await toggleEventMark(ev(), 'saved')
    await settle()
    expect(await db.eventMarks.get(ev().id)).toMatchObject({ state: 'saved', event: { title: 'Serata giochi' } })
    expect(await db.outbox.count()).toBe(1)
    expect(pushed()).toHaveLength(0)
  })

  it('signed in: pushes the snake_case row with the snapshot', async () => {
    await toggleEventMark(ev(), 'saved')
    await settle()
    expect(pushed()).toHaveLength(1)
    expect(pushed()[0]?.arg).toEqual({
      id: ev().id,
      state: 'saved',
      event: ev(),
      updated_at: expect.any(Number),
    })
    expect(await db.outbox.count()).toBe(0)
  })

  it('the snapshot is sanitised: data-URL image dropped, long text capped, junk fields gone', async () => {
    const dirty = {
      ...ev(),
      image: 'data:image/jpeg;base64,/9j/4AAQ',
      url: 'javascript:alert(1)',
      description: 'x'.repeat(10_000),
      tags: Array.from({ length: 50 }, (_, i) => `t${i}`),
      extra: 'not in the schema',
    } as EventItem
    await toggleEventMark(dirty, 'saved')
    await settle()
    const sent = (pushed()[0]!.arg as { event: Record<string, unknown> }).event
    expect(sent.image).toBeNull()
    expect(sent.url).toBe('')
    expect((sent.description as string).length).toBe(4000)
    expect(sent.tags).toHaveLength(20)
    expect(sent).not.toHaveProperty('extra')
    expect(new TextEncoder().encode(JSON.stringify(sent)).length).toBeLessThan(32_768)
  })

  it('un-saving deletes the row locally and remotely (tombstone)', async () => {
    await toggleEventMark(ev(), 'saved')
    await settle()
    expect(fake.remote.event_marks).toHaveLength(1)
    await toggleEventMark(ev(), 'saved')
    await settle()
    expect(await db.eventMarks.get(ev().id)).toBeUndefined()
    expect(fake.remote.event_marks).toHaveLength(0)
    expect(pushed().map((c) => c.op)).toEqual(['upsert', 'delete'])
  })

  it('prune deletes marks of events that are over, locally and remotely, and keeps the rest', async () => {
    await toggleEventMark(ev({ id: 'aaaaaaaaaaaaaaaa', start: '2026-10-01T20:00:00+02:00' }), 'saved')
    await toggleEventMark(ev({ id: 'bbbbbbbbbbbbbbbb', start: '2026-10-01T20:00:00+02:00' }), 'hidden')
    await toggleEventMark(
      ev({ id: 'cccccccccccccccc', start: '2026-10-01T20:00:00+02:00', end: '2026-10-12T22:00:00+02:00' }),
      'saved',
    )
    await toggleEventMark(ev({ id: 'dddddddddddddddd', start: '2026-10-10T20:00:00+02:00' }), 'saved')
    await settle()
    expect(fake.remote.event_marks).toHaveLength(4)
    expect(await pruneEventMarks(new Date(2026, 9, 10, 12).getTime())).toBe(2)
    await settle()
    expect((await db.eventMarks.toArray()).map((m) => m.id).sort()).toEqual(['cccccccccccccccc', 'dddddddddddddddd'])
    expect(fake.remote.event_marks).toHaveLength(2)
  })

  it('hide replaces save; undo restores the old mark with a newer stamp', async () => {
    await toggleEventMark(ev(), 'saved')
    await settle()
    const before = (await db.eventMarks.get(ev().id))!
    const prev = await toggleEventMark(ev(), 'hidden')
    await settle()
    expect(prev?.state).toBe('saved')
    expect((await db.eventMarks.get(ev().id))?.state).toBe('hidden')
    await restoreEventMark(ev().id, prev)
    await settle()
    const after = (await db.eventMarks.get(ev().id))!
    expect(after.state).toBe('saved')
    expect(after.updatedAt).toBeGreaterThan(before.updatedAt)
    expect(fake.remote.event_marks).toEqual([expect.objectContaining({ state: 'saved' })])
  })

  it('undo of a first hide clears the mark everywhere', async () => {
    const prev = await toggleEventMark(ev(), 'hidden')
    await settle()
    expect(prev).toBeUndefined()
    await restoreEventMark(ev().id, prev)
    await settle()
    expect(await db.eventMarks.count()).toBe(0)
    expect(fake.remote.event_marks ?? []).toHaveLength(0)
  })

  it('a non-owner (RLS 42501) keeps the mark locally as a dead-letter', async () => {
    fake.rejectWith(() => ({ code: '42501', message: 'rls', status: 403 }))
    await toggleEventMark(ev(), 'saved')
    await settle()
    expect(await db.eventMarks.count()).toBe(1)
    expect(sync.getStatus().dead).toBe(1)
    // A pull (the server shows a non-owner nothing) must not wipe it either.
    await sync.syncNow()
    await settle()
    expect(await db.eventMarks.count()).toBe(1)
  })

  it('pull: remote is the source of truth for rows with nothing queued', async () => {
    const remoteOnly = eventMarksTable.toRow({ id: 'r1', state: 'hidden', event: ev({ id: 'r1' }), updatedAt: 5 })
    fake.remote.event_marks = [remoteOnly]
    await sync.syncNow()
    await settle()
    expect((await db.eventMarks.get('r1'))?.state).toBe('hidden')
    fake.remote.event_marks = []
    await sync.syncNow()
    await settle()
    expect(await db.eventMarks.get('r1')).toBeUndefined()
  })

  it('a realtime update without the snapshot never wipes the local one; stale updates lose', async () => {
    await toggleEventMark(ev(), 'saved')
    await settle()
    vi.stubGlobal('window', { addEventListener() {}, removeEventListener() {} })
    vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {}, visibilityState: 'hidden' })
    const stop = sync.start()
    await settle()
    const local = (await db.eventMarks.get(ev().id))!
    const row = { ...eventMarksTable.toRow(local), state: 'hidden', updated_at: local.updatedAt + 1000 }
    const { event: _drop, ...noEvent } = row
    fake.emit('event_marks', { eventType: 'UPDATE', new: noEvent, old: null })
    fake.emit('event_marks', { eventType: 'UPDATE', new: { ...row, event: 'unchanged_toast' }, old: null })
    fake.emit('event_marks', { eventType: 'UPDATE', new: { ...row, updated_at: local.updatedAt - 1 }, old: null })
    await settle()
    expect(await db.eventMarks.get(ev().id)).toMatchObject({ state: 'saved', event: { title: 'Serata giochi' } })
    // A complete, newer row does apply; a DELETE removes it.
    fake.emit('event_marks', { eventType: 'UPDATE', new: row, old: null })
    await until(async () => (await db.eventMarks.get(ev().id))?.state === 'hidden')
    fake.emit('event_marks', { eventType: 'DELETE', new: null, old: { id: ev().id } })
    await until(async () => (await db.eventMarks.get(ev().id)) === undefined)
    stop()
    vi.unstubAllGlobals()
  })

  it('deleting a hand-added event also deletes its mark through the outbox; undo restores both', async () => {
    const id = '11111111-1111-4111-8111-111111111111'
    await saveCustomEvent({
      id,
      title: 'Gara sociale',
      start: '2026-10-09T20:30:00+02:00',
      end: null,
      allDay: false,
      venue: null,
      city: 'Trento',
      url: '',
      note: '',
      category: 'outdoor',
      image: null,
      createdAt: 1,
      updatedAt: 1,
    })
    await toggleEventMark(ev({ id, source: 'manual', sources: ['manual'] }), 'saved')
    await settle()
    expect(fake.remote.event_marks).toHaveLength(1)
    const undo = await deleteCustomEvent(id)
    await settle()
    expect(await db.eventMarks.get(id)).toBeUndefined()
    expect(fake.remote.event_marks).toHaveLength(0)
    await undo()
    await settle()
    expect((await db.eventMarks.get(id))?.state).toBe('saved')
    expect(fake.remote.event_marks).toHaveLength(1)
  })
})

describe('event prefs sync', () => {
  it('favourites go through the outbox as the single prefs row', async () => {
    fake.signOut()
    await setFavouriteCategories(['theatre', 'Bad Id', 'theatre', 'boardgames'])
    await settle()
    expect(await db.eventPrefs.get('prefs')).toMatchObject({ favouriteCategories: ['theatre', 'boardgames'] })
    expect(pushed()).toHaveLength(0)
    fake.signIn()
    await sync.flush()
    await settle()
    expect(pushed()[0]).toMatchObject({
      table: 'event_prefs',
      arg: { id: 'prefs', favourite_categories: ['theatre', 'boardgames'], updated_at: expect.any(Number) },
    })
  })

  it('each write is stamped after the previous one, even with a clock behind it', async () => {
    await db.eventPrefs.put({ id: 'prefs', favouriteCategories: [], updatedAt: Date.now() + 60_000 })
    await setFavouriteCategories(['cinema'])
    expect((await db.eventPrefs.get('prefs'))!.updatedAt).toBeGreaterThan(Date.now() + 59_000)
  })

  it('pull brings the remote favourites in', async () => {
    fake.remote.event_prefs = [{ id: 'prefs', favourite_categories: ['nerd'], updated_at: 9 } as never]
    await sync.syncNow()
    await settle()
    expect(await db.eventPrefs.get('prefs')).toEqual({ id: 'prefs', favouriteCategories: ['nerd'], updatedAt: 9 })
  })
})

describe('Dexie v15 upgrade', () => {
  it('queues every pre-sync mark and the prefs row (updatedAt 0) exactly once', async () => {
    db.close()
    await db.delete()
    // A device still on v14 with marks and favourites made before sync.
    const old = new Dexie('dashboard')
    old.version(14).stores({
      outbox: '++seq, rowId',
      eventMarks: 'id, state, updatedAt',
      eventPrefs: 'id',
      customEvents: 'id, start, updatedAt',
    })
    const marks: EventMark[] = [
      { id: 'a1', state: 'saved', event: ev({ id: 'a1' }), updatedAt: 3 },
      { id: 'a2', state: 'hidden', event: ev({ id: 'a2' }), updatedAt: 4 },
    ]
    await old.table('eventMarks').bulkPut(marks)
    await old.table('eventPrefs').put({ id: 'prefs', favouriteCategories: ['theatre'] })
    old.close()

    fake.signOut()
    await db.open()
    const out = await db.outbox.toArray()
    expect(out.map((e) => [e.table, e.op, e.rowId])).toEqual([
      ['event_marks', 'upsert', 'a1'],
      ['event_marks', 'upsert', 'a2'],
      ['event_prefs', 'upsert', 'prefs'],
    ])
    expect(await db.eventPrefs.get('prefs')).toEqual({ id: 'prefs', favouriteCategories: ['theatre'], updatedAt: 0 })

    // First signed-in sync with another device's marks on the server: a union.
    fake.signIn()
    fake.remote.event_marks = [
      eventMarksTable.toRow({ id: 'b1', state: 'saved', event: ev({ id: 'b1' }), updatedAt: 7 }),
    ]
    await sync.syncNow()
    await settle()
    expect((await db.eventMarks.toCollection().primaryKeys()).sort()).toEqual(['a1', 'a2', 'b1'])
    expect(fake.remote.event_marks?.map((r) => r.id).sort()).toEqual(['a1', 'a2', 'b1'])
    expect(pushed().find((c) => c.table === 'event_prefs')?.arg).toMatchObject({ updated_at: 0 })
  })
})
