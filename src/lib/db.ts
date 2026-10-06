import Dexie, { type EntityTable } from 'dexie'

import type { EventsFile, EventItem } from '../projects/events/types'

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
  remoteUrl?: string | undefined
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
  notes?: string | undefined
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
  archivedAt?: number | undefined
}

// One check-off of a habit on one local calendar day.
export interface HabitCheck {
  id: string
  habitId: string
  // Local-date string 'YYYY-MM-DD' so a check belongs to the day the user saw.
  day: string
  createdAt: number
}

// One line of the meal diary. Cloud-syncable via the generic engine, owner-only
// (src/lib/mealDiarySync.ts).
export type MealKind = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export interface MealEntry {
  id: string
  // Local-date string 'YYYY-MM-DD' so an entry belongs to the day the user saw.
  day: string
  meal: MealKind
  text: string
  // Weighed on a scale (true) or eyeballed (false, the default): tells the AI
  // estimate how far to trust a quantity written in the text.
  weighed: boolean
  // Optional nutrition (whole numbers, null = not entered). `estimated` = the
  // values came from the built-in food table, not typed by the owner.
  grams: number | null
  kcal: number | null
  proteinG: number | null
  carbsG: number | null
  fatG: number | null
  estimated: boolean
  createdAt: number
  updatedAt: number
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

// A saved link to read later: a URL plus an editable title and optional
// notes. Cloud-syncable via the generic engine.
export interface LinkItem {
  id: string
  url: string // absolute, always has a scheme (normalized on add)
  title: string // user-editable; defaults to the URL's hostname + path
  notes: string
  read: 0 | 1 // Dexie can't index booleans — store 0/1
  // Free-form tags. Always normalized to lowercase and deduped on write (see
  // normalizeTag/addTag in linksSync.ts), and indexed multi-entry (`*tags`) so
  // Dexie can query by a single tag. Never undefined — v9 backfills [].
  tags: string[]
  createdAt: number
  updatedAt: number
}

// A travel idea. companionIds is the list of TripCompanion ids it is shared
// with: an EMPTY array means Solo. Always an array (never undefined) and
// indexed multi-entry (`*companionIds`). Cloud-syncable via the generic engine.
export interface TripIdea {
  id: string
  title: string
  notes: string
  companionIds: string[]
  done: 0 | 1 // been there; Dexie can't index booleans
  createdAt: number
  updatedAt: number
}

// A person one can travel with. Names are unique case-insensitively
// (enforced by addCompanion/renameCompanion in tripsSync.ts).
export interface TripCompanion {
  id: string
  name: string
  emoji: string
  createdAt: number
  updatedAt: number
}

// Per-device usage stats for a dashboard project, keyed by ProjectMeta.id.
// Drives the home grid's ordering. Deliberately local-only — open counts
// are per-device, so this never syncs and has no remote table.
export interface ProjectStat {
  id: string // matches ProjectMeta.id in src/lib/projects.ts
  opens: number
  starred: 0 | 1 // Dexie can't index booleans — store 0/1
  lastOpenedAt: number
  // Hidden from the home grid. Unset = use DEFAULT_HIDDEN (projectStats.ts),
  // so an explicit choice is never overwritten by the defaults. Not indexed,
  // hence no schema version bump.
  hidden?: 0 | 1
}

// --- Life (owner-only weekly plan + log; spec in docs/HANDOFF-life.md) ------
// The plan is imported as JSON and validated by parseWeekJson() in
// src/projects/life/model.ts, which also normalizes it into exactly these
// shapes (every array present, absent task fields as null). Every item has a
// stable `id`; log entries link to it by id, never by text or position.

export interface LifeFocus {
  id: string
  title: string
}

export interface LifeTask {
  id: string
  title: string
  // 'YYYY-MM-DD' or a Things keyword ('today', 'evening', …); null = unset.
  when: string | null
  deadline: string | null // 'YYYY-MM-DD'
  area: string | null
  project: string | null
  // Things id of the area/project the to-do goes into, resolved on the Mac
  // by /settimana (scripts/life-things-lists.ts). Sent as `list-id`, so it
  // keeps working after the area is renamed. Absent = matched by name.
  listId?: string
  tags: string[]
  notes: string
}

export interface LifeTracker {
  id: string
  emoji: string
  label: string
  target: number | null // weekly goal, shown as n / target
  max: number | null // soft weekly ceiling (warns, never blocks)
  energy: boolean // ask energy before/after (1–5) on log
}

export type LifeQuestionType = 'number' | 'boolean' | 'text' | 'scale5'

export interface LifeQuestion {
  id: string
  label: string
  type: LifeQuestionType
  // Optional link to a tracker of the same plan: the answer is then computed
  // from the week's habit log, never typed (number → count, boolean →
  // target reached, or done at least once without a target). Only for
  // 'number' and 'boolean' questions. Absent on unlinked questions.
  tracker?: string
}

export interface LifeCheckin {
  // Stable id like every other plan item. Plans written before 2026-09-28
  // have none: validatePlan()/withCheckinIds() in model.ts derive a
  // deterministic one from date + label, so old plans keep working.
  id: string
  date: string // 'YYYY-MM-DD'
  label: string
}

export interface LifePlan {
  version: 1
  week: string // Monday, 'YYYY-MM-DD'
  focus: LifeFocus[]
  rules: string[]
  tasks: LifeTask[]
  trackers: LifeTracker[]
  sundayCheck: LifeQuestion[]
  checkins: LifeCheckin[]
}

// One row per week. `id` IS the week (the engine addresses rows by id); the
// `week` field duplicates it for readability. Replaced wholesale on import.
export interface LifeWeek {
  id: string
  week: string
  plan: LifePlan
  importedAt: number
  updatedAt: number
}

export type LifeEntryKind = 'focus' | 'tracker' | 'sunday' | 'sent' | 'checkin'

export type LifeAnswer = number | boolean | string | null

interface LifeEntryBase {
  // tracker: random uuid (append-only); others: `${week}:${kind}:${ref}`.
  id: string
  week: string // Monday 'YYYY-MM-DD' of the week the entry belongs to
  ref: string // the plan item's id
  day: string // local 'YYYY-MM-DD' the entry was logged on
  createdAt: number
  updatedAt: number
}

export interface LifeTrackerEntry extends LifeEntryBase {
  kind: 'tracker'
  value: { energyBefore?: number; energyAfter?: number }
}
export interface LifeFocusEntry extends LifeEntryBase {
  kind: 'focus'
  value: { done: boolean }
}
export interface LifeSundayEntry extends LifeEntryBase {
  kind: 'sunday'
  value: { answer: LifeAnswer }
}
export interface LifeSentEntry extends LifeEntryBase {
  kind: 'sent'
  // `sends`: epoch ms of every "Send/Resend to Things" for this task. Things
  // stamps each created to-do with its creation time and never changes it,
  // so scripts/life-things-status.ts finds the batch by time even after the
  // to-do is renamed in Things. Optional: rows written before 2026-09-28
  // have none.
  value: { sent: boolean; sends?: number[] }
}

export interface LifeCheckinEntry extends LifeEntryBase {
  kind: 'checkin'
  // `note`: optional free text, trimmed, ≤ LIFE_CAPS.checkinNote chars
  // (mirrored in SQL); absent when empty.
  value: { done: boolean; note?: string }
}

// One row per logged thing. Keyed toggles (focus/sunday/sent/checkin) are
// never deleted, only flipped, so last-writer-wins by updatedAt resolves them.
export type LifeEntry = LifeTrackerEntry | LifeFocusEntry | LifeSundayEntry | LifeSentEntry | LifeCheckinEntry

// Remote (Supabase) table name → the LOCAL row shape that travels through the
// outbox for it. The single source of truth for what the generic sync engine
// can push: `engine.upsert('todos', row)` only accepts a Todo, so a payload
// can't drift onto the wrong table. Add one line here per new synced table.
export interface OutboxMap {
  shop_items: ShopItem
  shop_areas: ShopArea
  todos: Todo
  climb_sessions: ClimbSession
  climbs: Climb
  habits: Habit
  habit_checks: HabitCheck
  book_ideas: BookIdea
  boardgame_ideas: BoardgameIdea
  links: LinkItem
  life_weeks: LifeWeek
  life_entries: LifeEntry
  meal_entries: MealEntry
  trip_ideas: TripIdea
  trip_companions: TripCompanion
  custom_events: CustomEvent
  event_marks: EventMark
  event_prefs: EventPrefs
}

// Remote table names the engine can push to — also the discriminator on an
// outbox entry. Derived from OutboxMap, never listed by hand.
export type OutboxTable = keyof OutboxMap

// Local rows that may travel through the outbox (any synced project's shape).
export type OutboxPayload = OutboxMap[OutboxTable]

// Queue of local mutations not yet pushed to the cloud. Written alongside
// every local write so changes made offline sync on reconnect (see cloudSync.ts).
export interface OutboxEntry {
  seq?: number
  table: OutboxTable
  op: 'upsert' | 'delete'
  rowId: string
  payload?: OutboxPayload
  ts: number
  // Push attempts the SERVER answered and refused — used to dead-letter a
  // stuck entry. Network failures (offline, no response) never count.
  tries?: number
  // 1 once the entry is a permanent dead-letter (RLS/constraint denial or
  // retry cap hit). Dead entries are never re-pushed automatically and never
  // deleted automatically: they stay as a tombstone so pull() keeps shielding
  // the local row from deletion. This is what prevents a guest sign-in from
  // wiping local-only data. Only the user's explicit Retry / Discard
  // (engine.retryDead / engine.discardDead, via SyncCard) clears them.
  dead?: 0 | 1
}

// Events (project 12). eventsCache holds the last events.json (single row
// 'latest', local-only); eventMarks the owner's saved/hidden events with a
// snapshot so saved ones outlive the file; eventPrefs the favourite categories.
// Marks and prefs sync owner-only (src/lib/eventMarksSync.ts) since v15.
export interface EventsCacheRow {
  id: 'latest'
  file: EventsFile
  fetchedAt: number
}
export interface EventMark {
  id: string
  state: 'saved' | 'hidden'
  event: EventItem
  updatedAt: number
}
export interface EventPrefs {
  id: 'prefs'
  favouriteCategories: string[]
  // ms; 0 (or absent, on rows written before v15) = "never edited since sync
  // existed": the server MERGES such a row into its own instead of letting it
  // win or lose (see event_prefs_merge in the event_marks migration).
  updatedAt?: number
}

// An event the owner added by hand (e.g. from a climbing gym's Instagram
// post). Owner-only synced table `custom_events`; merged into the events list
// as source 'manual' by src/projects/events/custom.ts. Times follow
// events.json: ISO with the Europe/Rome offset, all-day end inclusive.
export interface CustomEvent {
  id: string // crypto.randomUUID()
  title: string
  start: string
  end: string | null
  allDay: boolean
  venue: string | null
  city: string
  url: string // http(s) or ''
  note: string // shown as description; first line = summary
  category: string // a CATEGORIES id from events/model.ts, default 'other'
  image: string | null // compressed JPEG data URL (≤ MAX_IMAGE_LENGTH chars)
  createdAt: number
  updatedAt: number
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
  links: EntityTable<LinkItem, 'id'>
  projectStats: EntityTable<ProjectStat, 'id'>
  lifeWeeks: EntityTable<LifeWeek, 'id'>
  lifeEntries: EntityTable<LifeEntry, 'id'>
  eventsCache: EntityTable<EventsCacheRow, 'id'>
  eventMarks: EntityTable<EventMark, 'id'>
  eventPrefs: EntityTable<EventPrefs, 'id'>
  tripIdeas: EntityTable<TripIdea, 'id'>
  tripCompanions: EntityTable<TripCompanion, 'id'>
  customEvents: EntityTable<CustomEvent, 'id'>
  meals: EntityTable<MealEntry, 'id'>
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

// v8: adds links — a brand-new empty table, so no backfill upgrade needed.
db.version(8).stores({
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
  links: 'id, read, createdAt',
})

// v9: links gain `tags: string[]`, indexed multi-entry (`*tags` — the first
// multiEntry index in this db) so `db.links.where('tags').anyOf([...])` works.
// Links already exist on devices from v8, and a row with `tags === undefined`
// would both break the multiEntry index and push `undefined` into a NOT NULL
// column, so existing rows are backfilled with []. Same shape as the v5
// todos.updatedAt backfill; this upgrade never deletes data.
db.version(9)
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
    bookIdeas: 'id, createdAt',
    boardgameIdeas: 'id, createdAt',
    links: 'id, read, createdAt, *tags',
  })
  .upgrade(async (tx) => {
    await tx
      .table('links')
      .toCollection()
      .modify((l: LinkItem) => {
        if (l.tags === undefined) l.tags = []
      })
  })

// v10: adds projectStats — a brand-new empty table, so no backfill upgrade
// needed. Deliberately local-only: never added to OutboxTable/OutboxPayload.
db.version(10).stores({
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
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
})

// v11: adds lifeWeeks + lifeEntries — brand-new empty tables, so no backfill
// upgrade needed. lifeEntries is read per week (and per kind within a week).
db.version(11).stores({
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
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
  lifeWeeks: 'id, importedAt',
  lifeEntries: 'id, week, [week+kind]',
})

// v12: events (project 12) — brand-new empty tables, no upgrade needed.
db.version(12).stores({
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
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
  lifeWeeks: 'id, importedAt',
  lifeEntries: 'id, week, [week+kind]',
  eventsCache: 'id',
  eventMarks: 'id, state, updatedAt',
  eventPrefs: 'id',
})

// v13: trips (travel ideas + companions) — two brand-new empty tables, so no
// upgrade callback is needed. `*companionIds` is a multiEntry index.
db.version(13).stores({
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
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
  lifeWeeks: 'id, importedAt',
  lifeEntries: 'id, week, [week+kind]',
  eventsCache: 'id',
  eventMarks: 'id, state, updatedAt',
  eventPrefs: 'id',
  tripIdeas: 'id, done, createdAt, *companionIds',
  tripCompanions: 'id, createdAt',
})

// v14: events — customEvents (hand-added events, owner-only sync). A brand-new
// empty table, so no upgrade callback is needed.
db.version(14).stores({
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
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
  lifeWeeks: 'id, importedAt',
  lifeEntries: 'id, week, [week+kind]',
  eventsCache: 'id',
  eventMarks: 'id, state, updatedAt',
  eventPrefs: 'id',
  tripIdeas: 'id, done, createdAt, *companionIds',
  tripCompanions: 'id, createdAt',
  customEvents: 'id, start, updatedAt',
})

// v15: eventMarks + eventPrefs start syncing (owner-only, eventMarksSync.ts).
// Same stores; the upgrade queues every mark and the prefs row that already
// exist on this device into the outbox, ONCE. Without it the first signed-in
// pull would treat them as deleted remotely (the engine's pull is source of
// truth for rows with no outbox entry). Queued, they are pushed first and the
// server merges: marks are a union by id with newer updated_at winning (the
// ignore_stale_update trigger), prefs a union of the favourite lists
// (updatedAt 0, see EventPrefs). On a device that never signs in as the owner
// the entries just stay queued or dead-lettered, and the local rows stay.
db.version(15)
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
    bookIdeas: 'id, createdAt',
    boardgameIdeas: 'id, createdAt',
    links: 'id, read, createdAt, *tags',
    projectStats: 'id, starred, opens',
    lifeWeeks: 'id, importedAt',
    lifeEntries: 'id, week, [week+kind]',
    eventsCache: 'id',
    eventMarks: 'id, state, updatedAt',
    eventPrefs: 'id',
    tripIdeas: 'id, done, createdAt, *companionIds',
    tripCompanions: 'id, createdAt',
    customEvents: 'id, start, updatedAt',
  })
  .upgrade(async (tx) => {
    const ts = Date.now()
    const marks = (await tx.table('eventMarks').toArray()) as EventMark[]
    const entries: OutboxEntry[] = marks.map((m) => ({
      table: 'event_marks',
      op: 'upsert',
      rowId: m.id,
      payload: m,
      ts,
    }))
    const prefs = (await tx.table('eventPrefs').get('prefs')) as EventPrefs | undefined
    if (prefs) {
      const row: EventPrefs = { ...prefs, updatedAt: prefs.updatedAt ?? 0 }
      await tx.table('eventPrefs').put(row)
      entries.push({ table: 'event_prefs', op: 'upsert', rowId: row.id, payload: row, ts })
    }
    if (entries.length > 0) await tx.table('outbox').bulkAdd(entries)
  })

// v16: meal diary (local-only). New table only; nothing is migrated or removed.
db.version(16).stores({
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
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
  lifeWeeks: 'id, importedAt',
  lifeEntries: 'id, week, [week+kind]',
  eventsCache: 'id',
  eventMarks: 'id, state, updatedAt',
  eventPrefs: 'id',
  tripIdeas: 'id, done, createdAt, *companionIds',
  tripCompanions: 'id, createdAt',
  customEvents: 'id, start, updatedAt',
  meals: 'id, day, createdAt',
})

// Ask the browser not to evict our data under storage pressure (important on iOS).
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage?.persist) {
    return navigator.storage.persist()
  }
  return false
}
