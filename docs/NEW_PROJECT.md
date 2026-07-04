# Stamp out a new (optionally synced) project

> **Shortcut:** `npm run new-project <id> [--synced]` stamps out steps 4-6
> below (the page, the sync wrapper, the SQL migration) from these exact
> templates, and prints the remaining manual edits (steps 1, 2, 3) as
> paste-ready snippets — it never rewrites an existing file. This checklist
> stays the source of truth for what "correct" looks like; run
> `node scripts/new-project.mjs` with no args for usage.

This is the copy-paste checklist for adding a subproject to the dashboard. A new
project that syncs across devices is **seven small steps** and no bespoke sync
code — the generic engine (`src/lib/cloudSync.ts`) does the hard part once.

> **Engine-debt principle (from ROADMAP.md):** if a new project needs *more*
> than the steps below, that is a bug in the engine, not in the project. Fix
> `src/lib/cloudSync.ts` (or the shared components) so the next project stays a
> pattern-copy. Never fork the sync logic per project.

The **reference integration is `src/lib/todoSync.ts`** — a single-table synced
project. `shopSync.ts` / `climbSync.ts` / `habitSync.ts` show the two-table
shape (parent + child with a cascade delete). When in doubt, copy `todoSync.ts`
and rename.

Local-first is non-negotiable: **every step below must leave the page fully
usable signed out, against Dexie only.** Cloud sync is a layer on top, never a
requirement to use the page. A local-only project simply skips steps 4, 5, 6
and 7 (no `*Sync.ts`, no SQL, no `SyncCard`).

Throughout, replace `<id>` with your project id (kebab-case, e.g. `reading`),
`<Name>` with the component name (PascalCase, e.g. `Reading`), and
`<thing>`/`<things>` with your row noun.

---

## 1. Registry entry — `src/lib/projects.ts`

Add an object to the `projects` array. The home grid renders this list.

```ts
{
  id: '<id>',
  name: '<Name>',
  emoji: '📖',
  description: 'One line shown on the home card.',
  path: '/<id>',
  status: 'live',
  // ownerOnly: true,   // only if the whole project is owner-only
},
```

## 2. Route — `src/App.tsx`

Add the page component import and a route inside the `<Layout />` route:

```tsx
import { <Name> } from './projects/<id>/<Name>'

// …inside <Routes> / <Route element={<Layout />}> …
<Route path="/<id>" element={<<Name> />} />
```

If the project syncs, also start its engine in the app-wide sync effect (see the
`stops` array in `App.tsx`), alongside the existing `startTodoSync()` etc.:

```tsx
import { start<Name>Sync } from './lib/<id>Sync'
// …
const stops = [
  startShopSync(),
  startTodoSync(),
  start<Name>Sync(),   // add this
  // …
]
```

## 3. Dexie table — `src/lib/db.ts`

Local-first storage lives in the one shared Dexie db. Three edits:

**a. Row interface.** CamelCase fields; timestamps are epoch ms (`number`). If
the table syncs and you want last-writer-wins on concurrent edits, include an
`updatedAt` you bump on every mutation.

```ts
export interface <Thing> {
  id: string          // crypto.randomUUID()
  text: string
  done: 0 | 1         // Dexie can't index booleans — store 0/1
  createdAt: number
  updatedAt: number   // include for LWW; bump on every write
}
```

**b. Union types (only if the table syncs).** Add the remote table name to
`OutboxTable` and the row type to `OutboxPayload`:

```ts
export type OutboxTable =
  | 'shop_items'
  // …existing…
  | '<things>'          // add your remote table name

export type OutboxPayload =
  | ShopItem
  // …existing…
  | <Thing>             // add your row type
```

**c. Table declaration + a versioned upgrade.** Add the table to the typed `db`
handle **and** bump `db.version(N)`. Dexie upgrades are append-only: keep every
prior `db.version(...)` block untouched and add a **new, higher** version that
lists the full store set including your new table.

```ts
export const db = new Dexie('dashboard') as Dexie & {
  // …existing…
  <things>: EntityTable<<Thing>, 'id'>
}

// Bump to the next version number. Copy the previous version's stores block
// verbatim and add your table. Index only what you query on (id is implicit as
// the primary key; add secondary indexes like `done, createdAt` as needed).
db.version(6).stores({
  // …every existing store, copied from version(5)…
  <things>: 'id, done, createdAt',
})
```

**The upgrade/backfill pattern** (see the `todos.updatedAt` v5 upgrade in
`db.ts`): if you add a *field* to an *existing* table that must be non-null
before it can sync (e.g. a new `updatedAt`), attach a `.upgrade()` that
backfills existing rows. It runs once per device. Never delete data in an
upgrade.

```ts
db.version(6)
  .stores({ /* full store set */ })
  .upgrade(async (tx) => {
    await tx.table('<things>').toCollection().modify((t: <Thing>) => {
      if (t.updatedAt === undefined) t.updatedAt = t.createdAt ?? Date.now()
    })
  })
```

Adding a brand-new empty table needs no `.upgrade()` — just the new
`db.version(N).stores({...})`.

## 4. Sync wrapper — `src/lib/<id>Sync.ts`

One file. Define the remote row shape, one `TableSync` per table, create the
engine, and export mutation helpers the UI calls **instead of raw Dexie
writes**. This is `todoSync.ts` verbatim — the canonical single-table example:

```ts
import { db, type Todo } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'

// The remote (Supabase) row shape — snake_case columns, booleans as booleans.
interface TodoRow {
  id: string
  text: string
  done: boolean
  created_at: number
  updated_at: number
}

const todosTable: TableSync<Todo, TodoRow> = {
  remote: 'todos',                                  // == OutboxTable name == SQL table
  table: () => db.todos,                            // lazy: db must be built first
  columns: 'id, text, done, created_at, updated_at', // explicit — never select('*')
  realtime: true,                                   // live cross-device updates
  updatedAt: (t) => t.updatedAt,                    // enables last-writer-wins
  toRow: (t) => ({                                  // local → remote
    id: t.id,
    text: t.text,
    done: t.done === 1,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }),
  fromRow: (r) => ({                                // remote → local
    id: r.id,
    text: r.text,
    done: r.done ? 1 : 0,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const engine = createCloudSync({
  projectId: 'todo',        // MUST match the registry id AND is_member('<id>') in SQL
  tables: [todosTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------
// Always go through engine.upsert / engine.remove / engine.removeMany: they
// write Dexie + enqueue the outbox in ONE transaction, then flush if online.

export async function addTodo(text: string): Promise<void> {
  const now = Date.now()
  await engine.upsert('todos', {
    id: crypto.randomUUID(),
    text,
    done: 0,
    createdAt: now,
    updatedAt: now,
  })
}

export async function toggleTodo(todo: Todo): Promise<void> {
  await engine.upsert('todos', { ...todo, done: todo.done === 0 ? 1 : 0, updatedAt: Date.now() })
}

export async function deleteTodo(id: string): Promise<void> {
  await engine.remove('todos', id)
}

export async function clearDoneTodos(): Promise<void> {
  const done = await db.todos.where('done').equals(1).toArray()
  await engine.removeMany('todos', done.map((t) => t.id))
}

// --- Sync engine ------------------------------------------------------------
export const flush = engine.flush
export const syncNow = engine.syncNow

/** The engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine
/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)
/** Start syncing (call when a session exists). Returns a stop function. */
export const startTodoSync = engine.start
```

**Two-table projects (parent + child).** When a parent row's server-side
`on delete cascade` also removes children, delete the parent with ONE outbox
tombstone plus a local cascade in the same transaction — the engine can't know
about the FK. Copy `deleteSession` from `climbSync.ts` / `deleteArea` from
`shopSync.ts`:

```ts
export async function delete<Parent>(id: string): Promise<void> {
  await db.transaction('rw', db.<parents>, db.<children>, db.outbox, async () => {
    await db.<children>.where('<parentId>').equals(id).delete()
    await db.<parents>.delete(id)
    await db.outbox.add({ table: '<parents>', op: 'delete', rowId: id, ts: Date.now() })
  })
  void engine.flush()
}
```

`TableSync` options recap:
- `remote` — Supabase table name; also the outbox discriminator. Must be in
  `OutboxTable`.
- `columns` — explicit select list. **Never `select('*')`** (it leaks capability
  columns like `share_token`).
- `realtime: true` — subscribe to live changes for this table.
- `updatedAt: (row) => number` — omit for insert/delete-only tables with no
  `updated_at` column; include it for last-writer-wins on edited rows.

## 5. SQL migration — `supabase/migrations/`

Create a **new datestamped file** `supabase/migrations/<YYYYMMDDHHMMSS>_<id>.sql`
(e.g. `20260705093000_reading.sql`). Copy the shape from
`20260704160000_sync_parity.sql`. Timestamps are `bigint` (epoch ms) to match
the client. RLS is per-project via `is_member('<id>')`, with a `with check` so
guests can't write rows they can't read.

```sql
-- <id>: <one-line description>. Columns mirror the Dexie shape in src/lib/db.ts;
-- timestamps are epoch milliseconds (bigint) to match the client.

create table public.<things> (
  id uuid primary key,
  text text not null,
  done boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null
);

alter table public.<things> enable row level security;

-- One policy for all ops. WITH CHECK on the write side is required so a guest
-- can't insert/update rows for a project she isn't a member of.
create policy "members full access" on public.<things>
  for all
  using (public.is_member('<id>'))
  with check (public.is_member('<id>'));

-- Child table with a cascade (two-table projects only):
-- create table public.<children> (
--   id uuid primary key,
--   <parent>_id uuid not null references public.<parents>(id) on delete cascade,
--   created_at bigint not null
-- );
-- alter table public.<children> enable row level security;
-- create policy "members full access" on public.<children>
--   for all using (public.is_member('<id>')) with check (public.is_member('<id>'));

-- Realtime, so edits reach other devices live. One line per synced table.
alter publication supabase_realtime add table public.<things>;
```

Notes:
- `projectId` in step 4, the registry `id` in step 1, and the string in
  `is_member('<id>')` here **must all be identical.**
- A guest only gains access once the owner adds a `project_members` row for them
  (the /sharing page). The owner bypasses `is_member` for every project.
- `id uuid primary key` matches the client's `crypto.randomUUID()`.

## 6. Page component — mount `SyncCard`

In `src/projects/<id>/<Name>.tsx`, render the shared sign-in / status card near
the top. Pass the engine you exported in step 4 so the card shows pending count,
last-synced time, and a visible error when a push is rejected:

```tsx
import { SyncCard } from '../../components/SyncCard'
import { sync } from '../../lib/<id>Sync'

// …inside the page…
<SyncCard sync={sync} />
```

`SyncCard` is a drop-in: it renders local-only messaging when sync isn't
configured, the OTP sign-in form when signed out, and the synced status when
signed in — all without any per-project code. A **local-only project** either
omits `SyncCard` entirely or mounts `<SyncCard />` with no prop.

The page itself stays local-first: read with Dexie's `useLiveQuery(() =>
db.<things>.toArray())` and mutate only through the helpers from step 4. It must
work fully signed out.

## 7. Apply the backend — **owner only**

The migration file is committed like any code, but applying it to the hosted
Supabase project is the owner's job, never a worker's:

```
npx supabase db push          # owner only — applies migrations to the hosted DB
```

**Workers must NEVER run `npx supabase db push` or `config push`.** Creating the
migration file (step 5) is the whole job; the owner reviews and applies it.

---

## Checklist

- [ ] 1. Registry entry in `src/lib/projects.ts`
- [ ] 2. Route (+ `start<Name>Sync()` if synced) in `src/App.tsx`
- [ ] 3. Row interface, `OutboxTable`/`OutboxPayload` union, table + bumped
       `db.version(N)` (with a backfill `.upgrade()` if adding a field) in
       `src/lib/db.ts`
- [ ] 4. `src/lib/<id>Sync.ts` — `TableSync` config, engine, mutation helpers,
       `sync` / `useStatus` / `start<Name>Sync` exports
- [ ] 5. `supabase/migrations/<datestamp>_<id>.sql` — table, RLS via
       `is_member('<id>')` with `with check`, realtime publication
- [ ] 6. Page component reads Dexie via `useLiveQuery`, mounts `<SyncCard sync={sync} />`
- [ ] 7. Owner runs `npx supabase db push` (workers never do)

Build green before you call it done:

```
npm run build
```

If you found yourself writing sync logic that isn't one of these steps, stop:
that belongs in `src/lib/cloudSync.ts` so every future project inherits it.
