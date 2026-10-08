import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

import {
  addClimb,
  addSession,
  deleteClimb,
  deleteSession,
  MAX_GRADE_LENGTH,
  MAX_LOCATION_LENGTH,
  MAX_NOTES_LENGTH,
  toggleClimbSent,
} from './climbSync'

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

describe('climbing local mutations', () => {
  it('adds a session with trimmed/capped location and notes; empty notes become undefined', async () => {
    const s = await addSession({
      date: '2026-10-05',
      location: `  ${'x'.repeat(MAX_LOCATION_LENGTH + 5)} `,
      discipline: 'boulder',
      notes: 'n'.repeat(MAX_NOTES_LENGTH + 5),
    })
    const row = (await db.climbSessions.get(s.id))!
    expect(row.location).toHaveLength(MAX_LOCATION_LENGTH)
    expect(row.notes).toHaveLength(MAX_NOTES_LENGTH)
    const s2 = await addSession({
      date: '2026-10-05',
      location: 'Gym',
      discipline: 'boulder',
      notes: '',
    })
    expect((await db.climbSessions.get(s2.id))?.notes).toBeUndefined()
    const queued = (await db.outbox.toArray()).filter((o) => o.table === 'climb_sessions' && o.op === 'upsert')
    expect(queued).toHaveLength(2)
  })

  it('a climb copies date/discipline from its session, caps the grade and stores sent as 0/1', async () => {
    const s = await addSession({
      date: '2026-10-05',
      location: 'Gym',
      discipline: 'lead',
    })
    const c = await addClimb(s, '7a'.repeat(MAX_GRADE_LENGTH), true)
    const row = (await db.climbs.get(c.id))!
    expect(row).toMatchObject({
      sessionId: s.id,
      date: '2026-10-05',
      discipline: 'lead',
      sent: 1,
    })
    expect(row.grade).toHaveLength(MAX_GRADE_LENGTH)
    const c2 = await addClimb(s, '6a', false)
    expect((await db.climbs.get(c2.id))?.sent).toBe(0)
  })

  it('toggleClimbSent flips sent', async () => {
    const s = await addSession({
      date: '2026-10-05',
      location: 'Gym',
      discipline: 'boulder',
    })
    const c = await addClimb(s, '6a', false)
    await toggleClimbSent(c)
    const on = (await db.climbs.get(c.id))!
    expect(on.sent).toBe(1)
    await toggleClimbSent(on)
    expect((await db.climbs.get(c.id))?.sent).toBe(0)
  })

  it('deleteClimb removes one climb and queues a delete', async () => {
    const s = await addSession({
      date: '2026-10-05',
      location: 'Gym',
      discipline: 'boulder',
    })
    const c = await addClimb(s, '6a', false)
    await deleteClimb(c.id)
    expect(await db.climbs.count()).toBe(0)
    expect((await db.outbox.toArray()).some((o) => o.table === 'climbs' && o.op === 'delete' && o.rowId === c.id)).toBe(
      true,
    )
  })

  it('deleteSession cascades local climbs of that session only, with a single tombstone', async () => {
    const s1 = await addSession({
      date: '2026-10-05',
      location: 'A',
      discipline: 'boulder',
    })
    const s2 = await addSession({
      date: '2026-10-06',
      location: 'B',
      discipline: 'boulder',
    })
    await addClimb(s1, '6a', true)
    await addClimb(s1, '6b', true)
    const keep = await addClimb(s2, '5c', true)
    await deleteSession(s1.id)
    expect(await db.climbSessions.get(s1.id)).toBeUndefined()
    expect((await db.climbs.toArray()).map((c) => c.id)).toEqual([keep.id])
    const deletes = (await db.outbox.toArray()).filter((o) => o.op === 'delete')
    expect(deletes).toHaveLength(1)
    expect(deletes[0]).toMatchObject({ table: 'climb_sessions', rowId: s1.id })
  })
})
