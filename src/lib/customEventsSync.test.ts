// Engine-level checks for the owner's hand-added events: local-first writes
// (signed out), the remote row shape, delete + undo, owner-only rejection,
// and the realtime guard that keeps a TOAST-less update from wiping the image.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain, until } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import type { CustomEvent } from './db'

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

const { customEventsTable, deleteCustomEvent, saveCustomEvent, sync } = await import('./customEventsSync')

const JPEG = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ=='
const ev = (over: Partial<CustomEvent> = {}): CustomEvent => ({
  id: '11111111-1111-4111-8111-111111111111',
  title: 'Gara sociale',
  start: '2026-10-09T20:30:00+02:00',
  end: null,
  allDay: false,
  venue: 'Block3',
  city: 'Trento',
  url: 'https://www.instagram.com/p/abc/',
  note: 'Iscrizioni in palestra',
  category: 'outdoor',
  image: JPEG,
  createdAt: 1,
  updatedAt: 1,
  ...over,
})

const settle = () =>
  drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}|${sync.getStatus().syncing}`)
const pushed = () => fake.calls.filter((c) => c.op !== 'select')

beforeEach(async () => {
  await resetDb()
  fake.reset()
})
afterEach(settle)

describe('custom events sync', () => {
  it('signed out: the event is saved in Dexie and queued, nothing is sent', async () => {
    fake.signOut()
    await saveCustomEvent(ev())
    await settle()
    expect(await db.customEvents.get(ev().id)).toMatchObject({ title: 'Gara sociale', image: JPEG })
    expect(await db.outbox.count()).toBe(1)
    expect(pushed()).toHaveLength(0)
  })

  it('signed in: pushes the snake_case row', async () => {
    await saveCustomEvent(ev())
    await settle()
    expect(pushed()).toHaveLength(1)
    expect(pushed()[0]?.arg).toEqual({
      id: ev().id,
      title: 'Gara sociale',
      start_at: '2026-10-09T20:30:00+02:00',
      end_at: null,
      all_day: false,
      venue: 'Block3',
      city: 'Trento',
      url: 'https://www.instagram.com/p/abc/',
      note: 'Iscrizioni in palestra',
      category: 'outdoor',
      image: JPEG,
      created_at: 1,
      updated_at: expect.any(Number),
    })
    expect(await db.outbox.count()).toBe(0)
  })

  it('delete removes the row and its mark; undo restores both', async () => {
    const e = ev()
    await saveCustomEvent(e)
    await db.eventMarks.put({ id: e.id, state: 'saved', event: {} as never, updatedAt: 1 })
    await settle()
    const undo = await deleteCustomEvent(e.id)
    await settle()
    expect(await db.customEvents.get(e.id)).toBeUndefined()
    expect(await db.eventMarks.get(e.id)).toBeUndefined()
    expect(fake.remote.custom_events ?? []).toHaveLength(0)
    await undo()
    await settle()
    expect(await db.customEvents.get(e.id)).toMatchObject({ title: 'Gara sociale' })
    expect((await db.eventMarks.get(e.id))?.state).toBe('saved')
    expect(fake.remote.custom_events).toHaveLength(1)
  })

  it('a non-owner (RLS 42501) keeps the event locally as a dead-letter', async () => {
    fake.rejectWith(() => ({ code: '42501', message: 'rls', status: 403 }))
    await saveCustomEvent(ev())
    await settle()
    expect(await db.customEvents.count()).toBe(1)
    expect(sync.getStatus().dead).toBe(1)
  })

  it('a realtime update without the image never wipes the local image', async () => {
    const e = ev()
    await saveCustomEvent(e)
    await settle()
    vi.stubGlobal('window', { addEventListener() {}, removeEventListener() {} })
    vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {}, visibilityState: 'hidden' })
    const stop = sync.start()
    await settle()
    const row = { ...customEventsTable.toRow(e), title: 'Renamed', updated_at: Date.now() + 1000 }
    fake.emit('custom_events', { eventType: 'UPDATE', new: { ...row, image: 'unchanged_toast' }, old: null })
    const { image: _drop, ...noImage } = row
    fake.emit('custom_events', { eventType: 'UPDATE', new: noImage, old: null })
    await settle()
    expect(await db.customEvents.get(e.id)).toMatchObject({ title: 'Gara sociale', image: JPEG })
    // A complete row does apply.
    fake.emit('custom_events', { eventType: 'UPDATE', new: row, old: null })
    await until(async () => (await db.customEvents.get(e.id))?.title === 'Renamed')
    expect((await db.customEvents.get(e.id))?.image).toBe(JPEG)
    stop()
    vi.unstubAllGlobals()
  })
})
