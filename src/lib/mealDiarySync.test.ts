import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import { addMeal, deleteMeal, MAX_TEXT_LENGTH, restoreMeal, updateMeal } from './mealDiarySync'

beforeEach(resetDb)
// Let the engine's background flush go quiet before the next resetDb closes the db.
afterEach(() => drain(async () => String(await db.outbox.count())))

describe('meal diary local mutations', () => {
  it('adds a trimmed, capped entry and queues it for the outbox; blank is ignored', async () => {
    expect(await addMeal('2026-10-05', 'lunch', `  ${'x'.repeat(MAX_TEXT_LENGTH + 50)}  `)).toBe(true)
    expect(await addMeal('2026-10-05', 'lunch', '   ')).toBe(false)
    const all = await db.meals.toArray()
    expect(all).toHaveLength(1)
    expect(all[0]?.text).toHaveLength(MAX_TEXT_LENGTH)
    expect(all[0]?.meal).toBe('lunch')
    expect((await db.outbox.toArray()).some((o) => o.table === 'meal_entries' && o.op === 'upsert')).toBe(true)
  })

  it('update bumps updatedAt (last-writer-wins) and refuses a blank text', async () => {
    await addMeal('2026-10-05', 'dinner', 'pasta')
    const before = (await db.meals.toArray())[0]!
    await new Promise((r) => setTimeout(r, 5))
    await updateMeal(before, { text: ' pasta al pesto ' })
    const after = (await db.meals.get(before.id))!
    expect(after.text).toBe('pasta al pesto')
    expect(after.updatedAt).toBeGreaterThan(before.updatedAt)
    await updateMeal(after, { text: '   ' })
    expect((await db.meals.get(before.id))?.text).toBe('pasta al pesto')
  })

  it('delete then restore brings back the same row with a newer updatedAt', async () => {
    await addMeal('2026-10-05', 'snack', 'apple')
    const row = (await db.meals.toArray())[0]!
    await deleteMeal(row.id)
    expect(await db.meals.count()).toBe(0)
    await new Promise((r) => setTimeout(r, 5))
    await restoreMeal(row)
    const back = (await db.meals.get(row.id))!
    expect(back.text).toBe('apple')
    expect(back.updatedAt).toBeGreaterThan(row.updatedAt)
  })
})

describe('meal diary nutrition', () => {
  it('stores optional nutrition clamped to the server bounds; absent stays null', async () => {
    await addMeal('2026-10-05', 'lunch', 'pasta', {
      nutrition: { grams: 80, kcal: 99_999, proteinG: 10, estimated: true },
    })
    await addMeal('2026-10-05', 'lunch', 'caffè')
    const all = await db.meals.toArray()
    const a = all.find((m) => m.text === 'pasta')
    const b = all.find((m) => m.text === 'caffè')
    expect(a).toMatchObject({ grams: 80, kcal: 10_000, proteinG: 10, carbsG: null, fatG: null, estimated: true })
    expect(b).toMatchObject({ grams: null, kcal: null, proteinG: null, carbsG: null, fatG: null, estimated: false })
  })

  it('an update can clear nutrition and replace it', async () => {
    await addMeal('2026-10-05', 'dinner', 'riso', { nutrition: { kcal: 300, estimated: true } })
    const row = (await db.meals.toArray())[0]!
    await updateMeal(row, { nutrition: { kcal: null, fatG: 7, estimated: false } })
    expect(await db.meals.get(row.id)).toMatchObject({ kcal: null, fatG: 7, estimated: false })
  })
})

describe('meal diary weighed flag', () => {
  it('defaults to by eye, stores weighed when asked, and can be toggled by an update', async () => {
    await addMeal('2026-10-05', 'lunch', 'riso')
    await addMeal('2026-10-05', 'lunch', 'pasta', { weighed: true })
    const all = await db.meals.toArray()
    const riso = all.find((m) => m.text === 'riso')!
    expect(riso.weighed).toBe(false)
    expect(all.find((m) => m.text === 'pasta')?.weighed).toBe(true)
    await new Promise((r) => setTimeout(r, 5))
    await updateMeal(riso, { weighed: true })
    expect((await db.meals.get(riso.id))?.weighed).toBe(true)
    await updateMeal((await db.meals.get(riso.id))!, { text: 'riso basmati' })
    expect((await db.meals.get(riso.id))?.weighed).toBe(true) // an unrelated edit keeps it
  })
})

describe('meal diary mood', () => {
  it('is empty by default, keeps a 1-5 value, ignores anything else and survives unrelated edits', async () => {
    await db.meals.clear()
    await addMeal('2026-10-14', 'snack', 'biscotti')
    await addMeal('2026-10-14', 'lunch', 'pasta', { mood: 4 })
    await addMeal('2026-10-14', 'dinner', 'zuppa', { mood: 9 })
    const all = await db.meals.toArray()
    expect(all.find((m) => m.text === 'biscotti')?.mood).toBeNull()
    expect(all.find((m) => m.text === 'pasta')?.mood).toBe(4)
    expect(all.find((m) => m.text === 'zuppa')?.mood).toBeNull()

    const pasta = all.find((m) => m.text === 'pasta')!
    await updateMeal(pasta, { text: 'pasta al pesto' })
    expect((await db.meals.get(pasta.id))?.mood).toBe(4) // an unrelated edit keeps it
    await updateMeal(pasta, { mood: 2 })
    expect((await db.meals.get(pasta.id))?.mood).toBe(2)
    await updateMeal(pasta, { mood: null })
    expect((await db.meals.get(pasta.id))?.mood).toBeNull() // tapping the face again clears it
  })
})
