# Stamp out a new (optionally synced) project

> **Shortcut:** `npm run new-project -- <id> [--synced]` stamps out steps 4-6
> below (the page, the sync wrapper, the SQL migration) from these exact
> templates, and prints the remaining manual edits (steps 1, 2, 3) as
> paste-ready snippets — it never rewrites an existing file. This checklist
> stays the source of truth for what "correct" looks like; run
> `node scripts/new-project.mjs` with no args for usage.
>
> **The `--` before `<id>` is required.** Without it, `npm run` swallows
> `--synced`/`--name`/`--emoji`/`--area`/`--icon`/`--color` as npm's own (unknown) config flags instead of
> forwarding them to the script — you silently get a local-only page with the
> default 📦 emoji and only an easy-to-miss `npm warn` as a clue.
>
> The script also naively pluralizes `<id>` for table/column names (e.g.
> `reading` → `readings`); for an id whose last word is already plural (e.g.
> `book-ideas`), it detects the trailing "s" and does not double-pluralize
> (`book_ideas`, not `book_ideass`).

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
  area: 'svago',        // home section: utility | casa | organizzazione | sport | svago
  icon: 'book-open',    // Lucide name, must exist in src/components/projectIcons.ts
  color: '#6366f1',     // sub-colour: the small dot on the icon tile
  description: 'One line shown on the home card.',
  path: '/<id>',
  status: 'live',
  layout: 'narrow',     // content width from 1024px up: 'narrow' (max-w-3xl) or 'wide' (max-w-6xl)
  // ownerOnly: true,   // only if the whole project is owner-only
  // public: true,      // local-only public data: no login, no invite link
},
```

**Picking the look.** `area` decides the home section and the tile colour (see
`src/lib/areas.ts`); `color` is only the small dot, so pick one distinct from
the area colour. `icon` is a [Lucide](https://lucide.dev) name (ISC licence).
Icons are bundled as data, not imported from a package: if the name is not in
`src/components/projectIcons.ts`, copy the SVG's `<path>/<circle>/<line>/<rect>`
elements there as `[tag, { attrs }]` entries (same shape as the others). An
unknown name just shows the emoji until you do. `emoji` stays as the text
fallback (share messages). The scaffolder takes `--area`, `--icon`, `--color`.

Every live project that isn't `ownerOnly`/`public` is offered on /sharing and
gets a per-project invite link (`isInvitable()` in the same file). If the
project has no cloud data at all (like `settings`), add its id to
`NOT_INVITABLE` there.

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

**b. Outbox map (only if the table syncs).** Add ONE line to `OutboxMap`:
remote table name → row type. `OutboxTable` and `OutboxPayload` are derived
from it, and it's what makes `engine.upsert('<things>', row)` accept only a
`<Thing>`:

```ts
export interface OutboxMap {
  shop_items: ShopItem
  // …existing…
  <things>: <Thing>     // remote table name → local row type
}
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

## 4. Sync wrapper — `src/lib/<idCamel>Sync.ts`

The filename is the **camelCase** id + `Sync.ts` — hyphenated ids flatten
(`shop-list` → `shopSync.ts`, `book-ideas` → `bookIdeasSync.ts`); the generator
does this for you.

Idea-list style projects (a list of items with expandable notes) need no page
component of their own: pass a config object to `<IdeaList>` (see
`src/projects/book-ideas/BookIdeas.tsx`), including the `maxTextLength` /
`maxNotesLength` caps imported from the project's `*Sync.ts`.

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

**Optional engine options.** `TableSync.uniqueViolationIsDone: true` — when a
push hits a unique violation (23505) another device already created the same
logical row (e.g. one habit check per habit and day), so the outbox entry is
dropped as delivered instead of dead-lettered; the next pull brings the
server's copy and removes the local duplicate. `SyncConfig.afterPull` — an
async callback run inside the engine lock after every complete pull (e.g. a
local dedupe); it must only touch Dexie, and an error is logged, never fatal.

**Two-table projects (parent + child).** When a parent row's server-side
`on delete cascade` also removes children, delete the parent with
`engine.removeCascade`: ONE outbox tombstone for the parent plus a local-only
delete of its children (the server removes those itself), in one transaction —
the engine can't know about the FK, so you name the child table and its
parent-id field. Both tables must be in this engine's `tables`. Never hand-roll
`db.outbox.add` — it skips the engine's pending-count refresh. Same as
`deleteSession` in `climbSync.ts` / `deleteArea` in `shopSync.ts`:

```ts
export async function delete<Parent>(id: string): Promise<void> {
  await engine.removeCascade('<parents>', id, [{ remote: '<children>', key: '<parentId>' }])
}
```

Wrappers MAY wrap several engine calls in their own
`db.transaction('rw', …tables, db.outbox, …)` for atomic multi-row changes
(see `deleteCompanion` in `tripsSync.ts`); the engine defers its flush until
that transaction commits.

`TableSync` options recap:
- `remote` — Supabase table name; also the outbox discriminator. Must be the
  `OutboxMap` key whose row type is the table's row type.
- `columns` — explicit select list. **Never `select('*')`** (it leaks capability
  columns like `share_token`).
- `realtime: true` — subscribe to live changes for this table.
- `updatedAt: (row) => number` — omit for insert/delete-only tables with no
  `updated_at` column; include it for last-writer-wins on edited rows.

## 5. SQL migration — `supabase/migrations/`

Create a **new datestamped file** `supabase/migrations/<YYYYMMDDHHMMSS>_<id>.sql`
(placeholder: `<YYYYMMDDHHMMSS>_<id>.sql`, where the timestamp is the current
UTC time and `<id>` is your project id; pick a timestamp later than the newest
file in `supabase/migrations/`). Copy the shape from
`20260704160000_sync_parity.sql`. Timestamps are `bigint` (epoch ms) to match
the client. RLS is per-project via `is_member('<id>')`, with a `with check` so
guests can't write rows they can't read.

```sql
-- <id>: <one-line description>. Columns mirror the Dexie shape in src/lib/db.ts;
-- timestamps are epoch milliseconds (bigint) to match the client.
-- Length caps: text 300 (notes-style columns: 2000). MUST match MAX_TEXT_LENGTH
-- in src/projects/<id>/<Name>.tsx (the input's maxLength).

create table public.<things> (
  id uuid primary key,
  text text not null check (char_length(text) <= 300),
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

-- Server-side last-writer-wins: an update carrying an OLDER updated_at than
-- the stored row is silently ignored (a phone flushing a days-old outbox
-- can't clobber newer edits). One per table that has an updated_at column.
create trigger ignore_stale_update before update on public.<things>
  for each row execute function public.ignore_stale_update();

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

-- Let /sharing hand out a per-project invite link (#/join/p/<token>).
-- Omit for owner-only projects.
insert into public.shareable_projects (id) values ('<id>') on conflict do nothing;
```

Notes:
- `projectId` in step 4, the registry `id` in step 1, and the string in
  `is_member('<id>')` here **must all be identical.**
- A guest only gains access once the owner adds a `project_members` row for them
  (the /sharing page), or once they redeem the project's invite link. The owner
  bypasses `is_member` for every project. The `shareable_projects` row is the
  server-side allowlist for invite links and must match `isInvitable()`.
- `id uuid primary key` matches the client's `crypto.randomUUID()`.
- **Cap every free-text column** with `check (char_length(col) <= N)` (title
  300, notes 2000, as in `20260910120000_links.sql`). Without it a guest or a
  buggy client can push unbounded text into the shared table. The client must
  mirror each cap as a named constant (`MAX_TEXT_LENGTH`) used for the input's
  `maxLength`, and the two numbers must match, or the input accepts text the
  server then rejects (a stuck outbox entry). The generator stamps both.
- **LWW trigger.** Every table with an `updated_at` column gets the
  `ignore_stale_update` trigger (`20260930160000_sync_hardening.sql`). The
  client must bump `updatedAt` on every mutation (including Undo re-upserts of
  an edit), or its write can lose to the row already stored. Insert/delete-only
  tables without `updated_at` skip it.
- **New SQL functions are authenticated-only by default.** Default privileges
  revoke EXECUTE from `public`/`anon` for functions created in migrations. An
  RPC that must work **signed out** (like `get_project_invite` /
  `redeem_project_invite`) needs an explicit
  `grant execute on function public.<fn>(<argtypes>) to anon;` in its
  migration. Owner-only RPCs still check `is_owner()` in the body — the grant
  is defence in depth, not a replacement.

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

The migration file is committed like any code. Applying it to the hosted
Supabase project is the owner's job or the orchestrating session's (owner
authorization 2026-10-05: run `npx supabase db push --dry-run` first and check
only your migration is pending), never a worker's:

```
npx supabase db push          # owner only — applies migrations to the hosted DB
```

**Workers must NEVER run `npx supabase db push` or `config push`.** Creating the
migration file (step 5) is the whole job; the owner reviews and applies it.

Then **regenerate the typed client**, in this order — never before the push:

```
npm run db:types              # owner only — reads the hosted schema
```

`src/lib/database.types.ts` types the Supabase client, so a new synced table
must appear there or `tsc` fails. The generator reads the **hosted** schema, so
running it before `db push` writes a types file that doesn't know about your new
table — which deletes the block you need and breaks the build. Order is: create
the migration → owner pushes → regenerate types.

A worker who can't run either command (the normal case) hand-writes the new
table's `Row`/`Insert`/`Update` block into `database.types.ts` by copying an
existing one, so the build stays green until the owner pushes and regenerates.

---

## Checklist

- [ ] 1. Registry entry in `src/lib/projects.ts`
- [ ] 2. Route (+ `start<Name>Sync()` if synced) in `src/App.tsx`
- [ ] 3. Row interface, one `OutboxMap` line, table + bumped
       `db.version(N)` (with a backfill `.upgrade()` if adding a field) in
       `src/lib/db.ts`
- [ ] 4. `src/lib/<id>Sync.ts` — `TableSync` config, engine, mutation helpers,
       `sync` / `useStatus` / `start<Name>Sync` exports
- [ ] 5. `supabase/migrations/<datestamp>_<id>.sql` — table, RLS via
       `is_member('<id>')` with `with check`, `ignore_stale_update` trigger
       (tables with `updated_at`), realtime publication, `shareable_projects`
       row
- [ ] 6. Page component reads Dexie via `useLiveQuery`, mounts `<SyncCard sync={sync} />`
- [ ] 7. Owner runs `npx supabase db push`, then `npm run db:types` — in that
       order (workers never do either; they hand-write the types block instead)

Build green before you call it done:

```
npm run build
```

If you found yourself writing sync logic that isn't one of these steps, stop:
that belongs in `src/lib/cloudSync.ts` so every future project inherits it.
