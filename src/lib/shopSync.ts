import type { RealtimeChannel } from '@supabase/supabase-js'
import { db, DEFAULT_AREA_ID, type ShopArea, type ShopItem } from './db'
import { supabase } from './sync'

// Local-first sync for shop-list (areas + items).
//
// The UI only ever talks to Dexie. Every local mutation (below) also appends
// to db.outbox. While signed in, the engine flushes the outbox to Supabase,
// pulls the remote tables as source of truth, and subscribes to realtime
// changes on items. Offline edits queue up and flush on reconnect.

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

const toItemRow = (i: ShopItem): ShopItemRow => ({
  id: i.id,
  text: i.text,
  done: i.done === 1,
  area_id: i.areaId,
  created_at: i.createdAt,
  updated_at: i.updatedAt,
})

const toItem = (r: ShopItemRow): ShopItem => ({
  id: r.id,
  text: r.text,
  done: r.done ? 1 : 0,
  areaId: r.area_id,
  createdAt: Number(r.created_at),
  updatedAt: Number(r.updated_at),
})

const toAreaRow = (a: ShopArea): ShopAreaRow => ({
  id: a.id,
  name: a.name,
  created_at: a.createdAt,
})

const toArea = (r: ShopAreaRow): ShopArea => ({
  id: r.id,
  name: r.name,
  createdAt: Number(r.created_at),
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addArea(name: string): Promise<ShopArea> {
  const area: ShopArea = { id: crypto.randomUUID(), name, createdAt: Date.now() }
  await db.transaction('rw', db.shopAreas, db.outbox, async () => {
    await db.shopAreas.add(area)
    await db.outbox.add({ table: 'shop_areas', op: 'upsert', rowId: area.id, payload: area, ts: Date.now() })
  })
  void flush()
  return area
}

/** Create the default local area if the db has none (local mode / owner). */
export async function ensureDefaultArea(): Promise<void> {
  await db.transaction('rw', db.shopAreas, db.outbox, async () => {
    if ((await db.shopAreas.count()) > 0) return
    const area: ShopArea = { id: DEFAULT_AREA_ID, name: 'Groceries', createdAt: Date.now() }
    await db.shopAreas.add(area)
    await db.outbox.add({ table: 'shop_areas', op: 'upsert', rowId: area.id, payload: area, ts: Date.now() })
  })
  void flush()
}

export async function deleteArea(areaId: string): Promise<void> {
  await db.transaction('rw', db.shopAreas, db.shopItems, db.outbox, async () => {
    await db.shopAreas.delete(areaId)
    await db.shopItems.where('areaId').equals(areaId).delete()
    // Server cascades items on area delete, so one tombstone is enough.
    await db.outbox.add({ table: 'shop_areas', op: 'delete', rowId: areaId, ts: Date.now() })
  })
  void flush()
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
  await db.transaction('rw', db.shopItems, db.outbox, async () => {
    await db.shopItems.add(item)
    await db.outbox.add({ table: 'shop_items', op: 'upsert', rowId: item.id, payload: item, ts: Date.now() })
  })
  void flush()
}

export async function toggleShopItem(item: ShopItem): Promise<void> {
  const updated: ShopItem = {
    ...item,
    done: item.done === 0 ? 1 : 0,
    updatedAt: Date.now(),
  }
  await db.transaction('rw', db.shopItems, db.outbox, async () => {
    await db.shopItems.put(updated)
    await db.outbox.add({ table: 'shop_items', op: 'upsert', rowId: updated.id, payload: updated, ts: Date.now() })
  })
  void flush()
}

export async function clearBoughtItems(areaId: string): Promise<void> {
  await db.transaction('rw', db.shopItems, db.outbox, async () => {
    const bought = await db.shopItems
      .where('areaId')
      .equals(areaId)
      .filter((i) => i.done === 1)
      .toArray()
    await db.shopItems.bulkDelete(bought.map((i) => i.id))
    await db.outbox.bulkAdd(
      bought.map((i) => ({ table: 'shop_items' as const, op: 'delete' as const, rowId: i.id, ts: Date.now() })),
    )
  })
  void flush()
}

// --- Sync engine ------------------------------------------------------------

let channel: RealtimeChannel | null = null
let flushing = false

/** True for errors the server will never accept (RLS denial, constraint…). */
function isPermanent(err: unknown): boolean {
  const code = (err as { code?: unknown })?.code
  // PostgREST/SQLSTATE codes are short strings; network failures have none.
  return typeof code === 'string' && code.length > 0 && code.length <= 8
}

/** Push queued local mutations to Supabase. No-op when signed out/offline. */
export async function flush(): Promise<void> {
  if (!supabase || flushing) return
  const { data } = await supabase.auth.getSession()
  if (!data.session) return
  flushing = true
  try {
    for (;;) {
      const entry = await db.outbox.orderBy('seq').first()
      if (!entry) break
      try {
        if (entry.op === 'upsert' && entry.payload) {
          const { error } =
            entry.table === 'shop_items'
              ? await supabase.from('shop_items').upsert(toItemRow(entry.payload as ShopItem))
              : await supabase.from('shop_areas').upsert(toAreaRow(entry.payload as ShopArea))
          if (error) throw error
        } else if (entry.op === 'delete') {
          const { error } = await supabase.from(entry.table).delete().eq('id', entry.rowId)
          if (error) throw error
        }
      } catch (err) {
        // Entries the server rejects outright (e.g. a guest pushing an area
        // she may not create) can never succeed — drop them so they don't
        // block the queue forever. Network errors keep the entry for retry.
        if (isPermanent(err)) {
          await db.outbox.delete(entry.seq!)
          continue
        }
        throw err
      }
      await db.outbox.delete(entry.seq!)
    }
  } catch {
    // Offline or transient server error — keep the outbox, retry later.
  } finally {
    flushing = false
  }
}

/** Pull remote areas+items and make local match (outbox-pending rows win). */
async function pull(): Promise<void> {
  if (!supabase) return
  const [areasRes, itemsRes] = await Promise.all([
    // share_token is deliberately not selectable — never use select('*') here.
    supabase.from('shop_areas').select('id, name, created_at'),
    supabase.from('shop_items').select('id, text, done, area_id, created_at, updated_at'),
  ])
  if (areasRes.error || itemsRes.error || !areasRes.data || !itemsRes.data) return
  const remoteAreas = (areasRes.data as ShopAreaRow[]).map(toArea)
  const remoteItems = (itemsRes.data as ShopItemRow[]).map(toItem)
  await db.transaction('rw', db.shopAreas, db.shopItems, db.outbox, async () => {
    const pending = new Set((await db.outbox.toArray()).map((e) => e.rowId))

    const remoteAreaIds = new Set(remoteAreas.map((a) => a.id))
    const localAreaIds = (await db.shopAreas.toCollection().primaryKeys()) as string[]
    await db.shopAreas.bulkPut(remoteAreas.filter((a) => !pending.has(a.id)))
    await db.shopAreas.bulkDelete(
      localAreaIds.filter((id) => !remoteAreaIds.has(id) && !pending.has(id)),
    )

    const remoteItemIds = new Set(remoteItems.map((i) => i.id))
    const localItemIds = (await db.shopItems.toCollection().primaryKeys()) as string[]
    await db.shopItems.bulkPut(remoteItems.filter((i) => !pending.has(i.id)))
    await db.shopItems.bulkDelete(
      localItemIds.filter((id) => !remoteItemIds.has(id) && !pending.has(id)),
    )
  })
}

export async function syncNow(): Promise<void> {
  await flush()
  await pull()
}

const onOnline = () => void syncNow()
const onVisible = () => {
  if (document.visibilityState === 'visible') void syncNow()
}

/** Start syncing (call when a session exists). Returns a stop function. */
export function startShopSync(): () => void {
  const client = supabase
  if (!client) return () => {}

  void syncNow()

  channel = client
    .channel('shop_items')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shop_items' }, (payload) => {
      if (payload.eventType === 'DELETE') {
        const id = (payload.old as Partial<ShopItemRow>).id
        if (id) void db.shopItems.delete(id)
      } else {
        void db.shopItems.put(toItem(payload.new as ShopItemRow))
      }
    })
    .subscribe()

  window.addEventListener('online', onOnline)
  document.addEventListener('visibilitychange', onVisible)

  return () => {
    window.removeEventListener('online', onOnline)
    document.removeEventListener('visibilitychange', onVisible)
    if (channel) {
      void client.removeChannel(channel)
      channel = null
    }
  }
}
