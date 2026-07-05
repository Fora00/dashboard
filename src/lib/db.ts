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

// A generic todo. Cloud-syncable via the generic engine (src/lib/cloudSync.ts).
export interface Todo {
  id: string
  text: string
  done: 0 | 1
  createdAt: number
  // Last local mutation time — the engine uses it for last-writer-wins on
  // realtime/pull. Backfilled from createdAt for pre-v5 rows.
  updatedAt: number
}

// A book-writing idea: a title plus optional free-text notes.
// Cloud-syncable via the generic engine (src/lib/cloudSync.ts).
export interface BookIdea {
  id: string
  text: string
  notes: string
  createdAt: number
  updatedAt: number
}

// A board game design idea: a title plus optional free-text notes. Same
// shape as BookIdea — cloud-syncable via the generic engine.
export interface BoardgameIdea {
  id: string
  text: string
  notes: string
  createdAt: number
  updatedAt: number
}

// Remote table names that the generic sync engine can push to. Each is also
// the discriminator on an outbox entry. Mirrors the Supabase tables.
export type OutboxTable =
  | 'shop_items'
  | 'shop_areas'
  | 'todos'
  | 'climb_sessions'
  | 'climbs'
  | 'habits'
  | 'habit_checks'
  | 'book_ideas'
  | 'boardgame_ideas'

// Local rows that may travel through the outbox (any synced project's shape).
export type OutboxPayload =
  | ShopItem
  | ShopArea
  | Todo
  | ClimbSession
  | Climb
  | Habit
  | HabitCheck
  | BookIdea
  | BoardgameIdea

// Queue of local mutations not yet pushed to the cloud. Written alongside
// every local write so changes made offline sync on reconnect (see cloudSync.ts).
export interface OutboxEntry {
  seq?: number
  table: OutboxTable
  op: 'upsert' | 'delete'
  rowId: string
  payload?: OutboxPayload
  ts: number
  // Number of push attempts so far — used to dead-letter a stuck entry.
  tries?: number
  // 1 once the entry is a permanent dead-letter (RLS/constraint denial or
  // retry cap hit). Dead entries are NEVER re-pushed and NEVER deleted: they
  // stay as a tombstone so pull() keeps shielding the local row from deletion.
  // This is what prevents a guest sign-in from wiping local-only data.
  dead?: 0 | 1
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
  bookIdeas: EntityTable<BookIdea, 'id'>
  boardgameIdeas: EntityTable<BoardgameIdea, 'id'>
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

// v5: todos gain an `updatedAt` for the generic sync engine's last-writer-wins.
// Indexes are unchanged (updatedAt isn't indexed); the upgrade only backfills
// existing rows so every todo has a valid updatedAt before it can be pushed.
// This upgrade never deletes data.
db.version(5)
  .stores({
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
  .upgrade(async (tx) => {
    await tx
      .table('todos')
      .toCollection()
      .modify((t: Todo) => {
        if (t.updatedAt === undefined) t.updatedAt = t.createdAt ?? Date.now()
      })
  })

// v6: adds bookIdeas — a brand-new empty table, so no backfill upgrade needed.
db.version(6).stores({
  files: 'id, name, createdAt, synced',
  shopItems: 'id, done, createdAt, areaId',
  shopAreas: 'id, createdAt',
  outbox: '++seq, rowId',
  climbSessions: 'id, date',
  climbs: 'id, sessionId, date',
  habits: 'id, createdAt',
  habitChecks: 'id, habitId, day, [habitId+day]',
  todos: 'id, done, createdAt',
  bookIdeas: 'id, createdAt',
})

// v7: adds boardgameIdeas — a brand-new empty table, so no backfill upgrade needed.
db.version(7).stores({
  files: 'id, name, createdAt, synced',
  shopItems: 'id, done, createdAt, areaId',
  shopAreas: 'id, createdAt',
  outbox: '++seq, rowId',
  climbSessions: 'id, date',
  climbs: 'id, sessionId, date',
  habits: 'id, createdAt',
  habitChecks: 'id, habitId, day, [habitId+day]',
  todos: 'id, done, createdAt',
  bookIdeas: 'id, createdAt',
  boardgameIdeas: 'id, createdAt',
})

// Ask the browser not to evict our data under storage pressure (important on iOS).
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage?.persist) {
    return navigator.storage.persist()
  }
  return false
}
