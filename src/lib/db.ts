import Dexie, { type EntityTable } from 'dexie'

// One shared local-first database for the whole dashboard.
// Every project reads/writes here, so any project can use another project's data.

export interface TransferFile {
  id: string
  name: string
  type: string
  size: number
  blob: Blob
  createdAt: number
  // 0 = local only, 1 = uploaded to cloud (once sync is configured)
  synced: 0 | 1
  remoteUrl?: string
}

export interface ShopItem {
  id: string
  text: string
  done: 0 | 1
  createdAt: number
  updatedAt: number
}

// Queue of local mutations not yet pushed to the cloud. Written alongside
// every local write so changes made offline sync on reconnect (see shopSync.ts).
export interface OutboxEntry {
  seq?: number
  table: 'shop_items'
  op: 'upsert' | 'delete'
  rowId: string
  payload?: ShopItem
  ts: number
}

export const db = new Dexie('dashboard') as Dexie & {
  files: EntityTable<TransferFile, 'id'>
  shopItems: EntityTable<ShopItem, 'id'>
  outbox: EntityTable<OutboxEntry, 'seq'>
}

db.version(1).stores({
  files: 'id, name, createdAt, synced',
  shopItems: 'id, done, createdAt',
})

db.version(2).stores({
  files: 'id, name, createdAt, synced',
  shopItems: 'id, done, createdAt',
  outbox: '++seq, rowId',
})

// Ask the browser not to evict our data under storage pressure (important on iOS).
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage?.persist) {
    return navigator.storage.persist()
  }
  return false
}
