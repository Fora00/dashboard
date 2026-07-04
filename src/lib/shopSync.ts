import type { RealtimeChannel } from '@supabase/supabase-js'
import { db, type ShopItem } from './db'
import { supabase } from './sync'

// Local-first sync for shop-list.
//
// The UI only ever talks to Dexie. Every local mutation (below) also appends
// to db.outbox. While signed in, the engine flushes the outbox to Supabase,
// pulls the remote table as source of truth, and subscribes to realtime
// changes. Offline edits queue up and flush on reconnect.

interface ShopRow {
  id: string
  text: string
  done: boolean
  created_at: number
  updated_at: number
}

const toRow = (i: ShopItem): ShopRow => ({
  id: i.id,
  text: i.text,
  done: i.done === 1,
  created_at: i.createdAt,
  updated_at: i.updatedAt,
})

const toItem = (r: ShopRow): ShopItem => ({
  id: r.id,
  text: r.text,
  done: r.done ? 1 : 0,
  createdAt: Number(r.created_at),
  updatedAt: Number(r.updated_at),
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addShopItem(text: string): Promise<void> {
  const item: ShopItem = {
    id: crypto.randomUUID(),
    text,
    done: 0,
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

export async function clearBoughtItems(): Promise<void> {
  await db.transaction('rw', db.shopItems, db.outbox, async () => {
    const bought = await db.shopItems.where('done').equals(1).toArray()
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
      if (entry.op === 'upsert' && entry.payload) {
        const { error } = await supabase.from('shop_items').upsert(toRow(entry.payload))
        if (error) throw error
      } else if (entry.op === 'delete') {
        const { error } = await supabase.from('shop_items').delete().eq('id', entry.rowId)
        if (error) throw error
      }
      await db.outbox.delete(entry.seq!)
    }
  } catch {
    // Offline or server error — keep the outbox, retry on next flush.
  } finally {
    flushing = false
  }
}

/** Pull the remote table and make local match it (outbox-pending rows win). */
async function pull(): Promise<void> {
  if (!supabase) return
  const { data, error } = await supabase.from('shop_items').select('*')
  if (error || !data) return
  const remote = (data as ShopRow[]).map(toItem)
  await db.transaction('rw', db.shopItems, db.outbox, async () => {
    const pendingIds = new Set((await db.outbox.toArray()).map((e) => e.rowId))
    const remoteIds = new Set(remote.map((i) => i.id))
    const localIds = (await db.shopItems.toCollection().primaryKeys()) as string[]
    await db.shopItems.bulkPut(remote.filter((i) => !pendingIds.has(i.id)))
    const stale = localIds.filter((id) => !remoteIds.has(id) && !pendingIds.has(id))
    await db.shopItems.bulkDelete(stale)
  })
}

async function syncNow(): Promise<void> {
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
        const id = (payload.old as Partial<ShopRow>).id
        if (id) void db.shopItems.delete(id)
      } else {
        void db.shopItems.put(toItem(payload.new as ShopRow))
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
