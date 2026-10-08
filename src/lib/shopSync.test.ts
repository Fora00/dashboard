import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

import { DEFAULT_AREA_ID } from './db'
import {
  addArea,
  addShopItem,
  clearBoughtItems,
  deleteArea,
  ensureDefaultArea,
  MAX_AREA_NAME_LENGTH,
  MAX_ITEM_LENGTH,
  toggleShopItem,
} from './shopSync'

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

describe('shop areas', () => {
  it('addArea trims and caps the name and queues an upsert', async () => {
    const a = await addArea(`  ${'x'.repeat(MAX_AREA_NAME_LENGTH + 4)} `)
    expect((await db.shopAreas.get(a.id))?.name).toHaveLength(MAX_AREA_NAME_LENGTH)
    expect(
      (await db.outbox.toArray()).some((o) => o.table === 'shop_areas' && o.op === 'upsert' && o.rowId === a.id),
    ).toBe(true)
  })

  it('ensureDefaultArea creates Groceries once and is a no-op when any area exists', async () => {
    await ensureDefaultArea()
    await ensureDefaultArea()
    const all = await db.shopAreas.toArray()
    expect(all).toHaveLength(1)
    expect(all[0]).toMatchObject({ id: DEFAULT_AREA_ID, name: 'Groceries' })
  })

  it('ensureDefaultArea does nothing when another area already exists', async () => {
    await addArea('Pharmacy')
    await ensureDefaultArea()
    expect(await db.shopAreas.count()).toBe(1)
  })

  it('deleteArea cascades its items locally, keeps other areas, and queues one tombstone', async () => {
    const a = await addArea('A')
    const b = await addArea('B')
    await addShopItem('milk', a.id)
    await addShopItem('eggs', a.id)
    await addShopItem('soap', b.id)
    await deleteArea(a.id)
    expect(await db.shopAreas.get(a.id)).toBeUndefined()
    expect((await db.shopItems.toArray()).map((i) => i.text)).toEqual(['soap'])
    const deletes = (await db.outbox.toArray()).filter((o) => o.op === 'delete')
    expect(deletes).toHaveLength(1)
    expect(deletes[0]).toMatchObject({ table: 'shop_areas', rowId: a.id })
  })
})

describe('shop items', () => {
  it('addShopItem trims, caps and starts not done', async () => {
    const a = await addArea('A')
    await addShopItem(`  ${'y'.repeat(MAX_ITEM_LENGTH + 9)} `, a.id)
    const i = (await db.shopItems.toArray())[0]!
    expect(i.text).toHaveLength(MAX_ITEM_LENGTH)
    expect(i).toMatchObject({ done: 0, areaId: a.id })
  })

  it('toggleShopItem flips done and bumps updatedAt', async () => {
    const a = await addArea('A')
    await addShopItem('milk', a.id)
    const i = (await db.shopItems.toArray())[0]!
    await new Promise((r) => setTimeout(r, 5))
    await toggleShopItem(i)
    const on = (await db.shopItems.get(i.id))!
    expect(on.done).toBe(1)
    expect(on.updatedAt).toBeGreaterThan(i.updatedAt)
    await toggleShopItem(on)
    expect((await db.shopItems.get(i.id))?.done).toBe(0)
  })

  it('clearBoughtItems removes only bought items of that area', async () => {
    const a = await addArea('A')
    const b = await addArea('B')
    await addShopItem('milk', a.id)
    await addShopItem('eggs', a.id)
    await addShopItem('soap', b.id)
    const all = await db.shopItems.toArray()
    await toggleShopItem(all.find((i) => i.text === 'milk')!)
    await toggleShopItem(all.find((i) => i.text === 'soap')!)
    await clearBoughtItems(a.id)
    expect((await db.shopItems.toArray()).map((i) => i.text).sort()).toEqual(['eggs', 'soap'])
    const deletes = (await db.outbox.toArray()).filter((o) => o.table === 'shop_items' && o.op === 'delete')
    expect(deletes).toHaveLength(1)
  })
})
