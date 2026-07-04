import { db, DEFAULT_AREA_ID, type ShopArea, type ShopItem } from './db'
import { createCloudSync, type TableSync } from './cloudSync'

// Local-first sync for shop-list (areas + items), built on the generic engine
// in cloudSync.ts. The UI only ever talks to Dexie via the mutation helpers
// below; the engine handles outbox flush, guarded pull, and LWW realtime.

interface ShopItemRow {
  id: string
  text: string
  done: boolean
  area_id: string
  created_at: number
  updated_at: number
}

interface ShopAreaRow {
  id: string
  name: string
  created_at: number
}

const itemsTable: TableSync<ShopItem, ShopItemRow> = {
  remote: 'shop_items',
  table: () => db.shopItems,
  columns: 'id, text, done, area_id, created_at, updated_at',
  realtime: true,
  updatedAt: (i) => i.updatedAt,
  toRow: (i) => ({
    id: i.id,
    text: i.text,
    done: i.done === 1,
    area_id: i.areaId,
    created_at: i.createdAt,
    updated_at: i.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    text: r.text,
    done: r.done ? 1 : 0,
    areaId: r.area_id,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const areasTable: TableSync<ShopArea, ShopAreaRow> = {
  remote: 'shop_areas',
  table: () => db.shopAreas,
  // share_token is deliberately not selectable — never use select('*') here.
  columns: 'id, name, created_at',
  realtime: true,
  toRow: (a) => ({ id: a.id, name: a.name, created_at: a.createdAt }),
  fromRow: (r) => ({ id: r.id, name: r.name, createdAt: Number(r.created_at) }),
}

const engine = createCloudSync({
  projectId: 'shop-list',
  tables: [areasTable, itemsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addArea(name: string): Promise<ShopArea> {
  const area: ShopArea = { id: crypto.randomUUID(), name, createdAt: Date.now() }
  await engine.upsert('shop_areas', area)
  return area
}

/** Create the default local area if the db has none (local mode / owner). */
export async function ensureDefaultArea(): Promise<void> {
  if ((await db.shopAreas.count()) > 0) return
  const area: ShopArea = { id: DEFAULT_AREA_ID, name: 'Groceries', createdAt: Date.now() }
  await engine.upsert('shop_areas', area)
}

export async function deleteArea(areaId: string): Promise<void> {
  // Server cascades items on area delete, so one tombstone is enough — but
  // the local item rows must go too, in the same transaction.
  await db.transaction('rw', db.shopAreas, db.shopItems, db.outbox, async () => {
    await db.shopItems.where('areaId').equals(areaId).delete()
    await db.shopAreas.delete(areaId)
    await db.outbox.add({ table: 'shop_areas', op: 'delete', rowId: areaId, ts: Date.now() })
  })
  void engine.flush()
}

export async function addShopItem(text: string, areaId: string): Promise<void> {
  const item: ShopItem = {
    id: crypto.randomUUID(),
    text,
    done: 0,
    areaId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await engine.upsert('shop_items', item)
}

export async function toggleShopItem(item: ShopItem): Promise<void> {
  const updated: ShopItem = {
    ...item,
    done: item.done === 0 ? 1 : 0,
    updatedAt: Date.now(),
  }
  await engine.upsert('shop_items', updated)
}

export async function clearBoughtItems(areaId: string): Promise<void> {
  const bought = await db.shopItems
    .where('areaId')
    .equals(areaId)
    .filter((i) => i.done === 1)
    .toArray()
  await engine.removeMany('shop_items', bought.map((i) => i.id))
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** Start syncing (call when a session exists). Returns a stop function. */
export const startShopSync = engine.start
