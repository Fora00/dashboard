import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../../test/fakeDb'
import { drain } from '../../test/drain'
import { addHabit, setDayState } from '../../lib/habitSync'
import { parseHabitsPlanJson, planHabitsImport, type HabitsPlan } from './habitsPlan'
import { applyHabitsImport } from './habitsPlanApply'
import { FIXTURE } from './habitsPlan.fixture'

// Habits import link (EN4), applying: local-first (Dexie + outbox, signed
// out), merge onto the existing habit, idempotent, never archives, deletes or
// touches checks. Made-up habits only.

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

function plan(json: unknown = FIXTURE): HabitsPlan {
  const r = parseHabitsPlanJson(JSON.stringify(json))
  if (!r.ok) throw new Error(r.errors.join('\n'))
  return r.plan
}

async function seed() {
  const h = await addHabit('Habit test existing', '📓', { anchor: 'test anchor old', why: 'test why kept', target: 7 })
  await addHabit('Habit test other', '💧')
  await setDayState(h.id, '2026-11-01', 'done')
  return h
}

describe('applyHabitsImport', () => {
  it('creates three, updates one in place, and a second run changes nothing', async () => {
    const h = await seed()
    const checksBefore = await db.habitChecks.toArray()

    expect(await applyHabitsImport(plan())).toEqual({ created: 3, updated: 1 })
    const all = await db.habits.toArray()
    expect(all).toHaveLength(5)
    const a = all.find((x) => x.name === 'Habit test A')!
    expect(a).toMatchObject({ emoji: '🧪', engine: 'relationships', kind: 'experiment', target: 1, perDay: 1 })
    expect(a.cycleEnd).toBe('2026-12-06')

    const updated = await db.habits.get(h.id)
    expect(updated).toMatchObject({
      id: h.id,
      createdAt: h.createdAt,
      emoji: '📓',
      engine: 'emotions',
      anchor: 'test anchor new',
      floor: 'test floor new',
      why: 'test why kept',
      target: 7,
    })
    expect(updated?.archivedAt).toBeUndefined()
    expect(await db.habitChecks.toArray()).toEqual(checksBefore)
    expect((await db.outbox.toArray()).filter((o) => o.table === 'habits').length).toBeGreaterThanOrEqual(4)

    // Second open of the same link: every row is "no change", nothing written.
    expect(planHabitsImport(plan(), await db.habits.toArray()).map((r) => r.kind)).toEqual([
      'same',
      'same',
      'same',
      'same',
    ])
    expect(await applyHabitsImport(plan())).toEqual({ created: 0, updated: 0 })
    expect(await db.habits.count()).toBe(5)
  })

  it('only the ticked rows are applied', async () => {
    await seed()
    expect(await applyHabitsImport(plan(), new Set(['habit test b']))).toEqual({ created: 1, updated: 0 })
    expect((await db.habits.toArray()).map((h) => h.name).sort()).toEqual([
      'Habit test B',
      'Habit test existing',
      'Habit test other',
    ])
  })

  it('invalid rows are skipped, the rest applies', async () => {
    const r = await applyHabitsImport(
      plan({ habits: [{ name: 'Habit test no emoji' }, { name: 'Habit test ok', emoji: '✅' }] }),
    )
    expect(r).toEqual({ created: 1, updated: 0 })
    expect((await db.habits.toArray()).map((h) => h.name)).toEqual(['Habit test ok'])
  })
})
