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
  areaId: string
  createdAt: number
  updatedAt: number
}

// A sub-area of the shop list ("Groceries", "Pharmacy", …). Sharing with
// guests happens per-area, never for the whole list.
export interface ShopArea {
  id: string
  name: string
  createdAt: number
}

// Fixed id for the area that pre-area local items are migrated into; the
// server migration uses the same id so local and remote merge cleanly.
export const DEFAULT_AREA_ID = '00000000-0000-0000-0000-000000000001'

// A climbing session at a gym or crag. Local-only for now (no cloud sync).
export type Discipline = 'boulder' | 'lead'

export interface ClimbSession {
  id: string
  // 'YYYY-MM-DD' — sortable as a string, month key is date.slice(0, 7).
  date: string
  location: string
  discipline: Discipline
  notes?: string
  createdAt: number
}

// A single climb logged inside a session. `date` and `discipline` are
// denormalized from the session so progress stats don't need a join.
export interface Climb {
  id: string
  sessionId: string
  date: string
  discipline: Discipline
  grade: string
  sent: 0 | 1
  createdAt: number
}

// A daily habit ("Stretch", "Read", …). Local-only for now — no cloud sync.
export interface Habit {
  id: string
  name: string
  emoji: string
  createdAt: number
  // Set when the habit is archived; archived habits keep their history but
  // are hidden from the daily check-off list.
  archivedAt?: number
}

// One check-off of a habit on one local calendar day.
export interface HabitCheck {
  id: string
  habitId: string
  // Local-date string 'YYYY-MM-DD' so a check belongs to the day the user saw.
  day: string
  createdAt: number
}

// A generic todo. Local-only for now — no cloud sync.
export interface Todo {
  id: string
  text: string
  done: 0 | 1
  createdAt: number
}

// Queue of local mutations not yet pushed to the cloud. Written alongside
// every local write so changes made offline sync on reconnect (see shopSync.ts).
export interface OutboxEntry {
  seq?: number
  table: 'shop_items' | 'shop_areas'
  op: 'upsert' | 'delete'
  rowId: string
  payload?: ShopItem | ShopArea
  ts: number
}

export const db = new Dexie('dashboard') as Dexie & {
  files: EntityTable<TransferFile, 'id'>
  shopItems: EntityTable<ShopItem, 'id'>
  shopAreas: EntityTable<ShopArea, 'id'>
  outbox: EntityTable<OutboxEntry, 'seq'>
  climbSessions: EntityTable<ClimbSession, 'id'>
  climbs: EntityTable<Climb, 'id'>
  habits: EntityTable<Habit, 'id'>
  habitChecks: EntityTable<HabitCheck, 'id'>
  todos: EntityTable<Todo, 'id'>
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

db.version(3)
  .stores({
    files: 'id, name, createdAt, synced',
    shopItems: 'id, done, createdAt, areaId',
    shopAreas: 'id, createdAt',
    outbox: '++seq, rowId',
  })
  .upgrade(async (tx) => {
    await tx.table('shopAreas').add({
      id: DEFAULT_AREA_ID,
      name: 'Groceries',
      createdAt: Date.now(),
    })
    await tx.table('shopItems').toCollection().modify({ areaId: DEFAULT_AREA_ID })
  })

db.version(4).stores({
  files: 'id, name, createdAt, synced',
  shopItems: 'id, done, createdAt, areaId',
  shopAreas: 'id, createdAt',
  outbox: '++seq, rowId',
  climbSessions: 'id, date',
  climbs: 'id, sessionId, date',
  habits: 'id, createdAt',
  habitChecks: 'id, habitId, day, [habitId+day]',
  todos: 'id, done, createdAt',
})

// Ask the browser not to evict our data under storage pressure (important on iOS).
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage?.persist) {
    return navigator.storage.persist()
  }
  return false
}
