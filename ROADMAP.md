# Dashboard — Roadmap

> **For any AI model or human continuing this project:** this file is the single
> source of truth for project status. Read it fully before working. When you
> finish (or start) a task, update the checkboxes and the notes below, and keep
> the conventions intact. Commits must **never** list an AI as author or
> co-author.

## What this is

A personal dashboard (PWA) published on GitHub Pages, entry point for
subprojects. Local-first: all data lives in IndexedDB on each device and works
offline; cloud sync (Supabase) will make it cross-device.

Owner: franzmito@gmail.com. Access model: **email whitelist** — the owner plus
guest emails invitable per project (e.g. share shop-list with one guest).
GitHub Pages itself is public but holds no data; auth protects the synced data.

## Workflow — model delegation

Full playbook (briefs, parallelism rules, human guidelines): **`WORKFLOW.md`**.
Agent-facing hard rules: **`CLAUDE.md`**. Short version — work is orchestrated
by a top-tier model that reads this roadmap, thinks, and delegates
implementation to cheaper workers defined in `.claude/agents/`:

- **`opus-builder`** takes tasks tagged **[opus]**: sync logic, Supabase
  migrations/RLS, auth, cross-project refactors, anything with tricky state.
- **`sonnet-builder`** takes tasks tagged **[sonnet]**: well-specified work
  with an existing pattern to copy (new CRUD page, replicating a sync
  integration, UI, docs). Its brief must name the reference implementation.

Rules for writing tasks here: every unchecked task carries a model tag; a task
must be self-contained (goal, files to touch, pattern to copy, acceptance
criteria live in or next to the checkbox). The orchestrator reviews worker
output, runs `npm run build`, and owns commits and anything touching the hosted
Supabase project (`db push` / `config push` are never done by workers).

## Conventions (do not break)

- **Stack:** Vite + React + TypeScript, Tailwind v4 (via `@tailwindcss/vite`),
  React Router (**HashRouter** — required for GitHub Pages), Dexie (IndexedDB),
  `vite-plugin-pwa`.
- **Shared components** go in `src/components/` — dump anything reusable there.
- **Each project** is a folder in `src/projects/<id>/` with its own route in
  `src/App.tsx` and an entry in the registry `src/lib/projects.ts` (the home
  page renders the registry).
- **Shared data:** one Dexie db in `src/lib/db.ts`. All projects read/write it,
  so projects can use each other's data (see `Home.tsx` reading file stats).
- **Mobile-first:** everything must be usable on iPhone/iPad; min touch target
  ~40px; respects safe-area insets (see `index.css`).
- `base: '/dashboard/'` in `vite.config.ts` must match the GitHub repo name.
- Verify with `npm run build` before committing.

## Urgent bugs (audit 2026-07-04, ranked)

Full failure scenarios in the audit; fix top-down. Blockers for extending sync:

- [x] **CRITICAL — guest sign-in wipes local shop list** — fixed 2026-07-04
      in `src/lib/cloudSync.ts`: permanently rejected outbox entries are
      dead-lettered (`dead: 1`) and kept as tombstones that shield local rows
      from pull-deletion and realtime clobber. Offline data survives sign-in;
      it just stays local-only.
- [x] **HIGH — `isPermanent()` drops transient errors** — fixed: explicit
      `classify()` (network/PGRST301 → retry; 42501/23xxx → dead-letter;
      otherwise retry up to 8 tries), transient failure stops the flush to
      preserve per-row ordering.
- [x] **HIGH — guest removal doesn't revoke access** — fixed 2026-07-04
      (`20260704170000_sharing_hardening.sql`): `revoke_area_guest` RPC
      removes membership + rotates `share_token` (old links die); manual
      "♻️ Reset link" in AreaManager. *Backend applied 2026-07-05.*
- [x] **MED-HIGH — `redeem_invite` whitelists arbitrary emails forever** —
      fixed: email normalized/validated, auto-created whitelist rows are
      flagged `auto_whitelisted` and cleaned up on revoke when the guest has
      no memberships left. *Backend applied 2026-07-05.*
- [x] **MED — transfer bucket free-for-all** — fixed: uploads go to
      `<uid>/…`, write/delete policies scoped to own folder (owner keeps
      full control incl. legacy flat paths); guests can no longer touch
      others' files. *Backend applied 2026-07-05.*
- [x] **MED — realtime handler ignores `updatedAt` + pending outbox** —
      fixed in the engine: events for rows with outbox entries are skipped,
      LWW by `updatedAt` where configured; `shop_areas` added to the
      realtime publication (sync_parity migration).
- [x] **MED — `pull()`/`syncNow()` unguarded reentrancy** — fixed: `running`
      guard around the whole flush+pull cycle; pull aborts entirely on any
      failed select (never partial-deletes).
- [x] **LOW — sync effect keys on session object identity** — fixed in
      `App.tsx`: keyed on `session?.user?.id`.
- [x] **LOW — `shop_areas` UPDATE policy missing `WITH CHECK`** — fixed in
      the hardening migration. *Backend applied 2026-07-05.*
- [x] **HIGH (user-reported 2026-07-04) — invited guest can't complete/add
      shop items** — root cause: the two sharing systems were disjoint
      (/sharing wrote only `project_members`; `shop_items` RLS checks
      `shop_area_members`). Fixed in `Sharing.tsx` (client-only, no SQL):
      invite has a 🛒 Shop List toggle that grants the default Groceries
      area; per-area toggles per guest; disabling shop access or removing
      the guest deletes their `shop_area_members` rows; an amber hint
      self-heals guests with shop access but zero areas; all mutations
      surface errors loudly. Existing broken guests: open /sharing and tap
      an area for them (or just re-toggle Shop List).

## Sync parity — every project cloud-syncable

Goal: todo, climbing and habits get the same optional cloud sync as shop-list,
via ONE generic outbox engine instead of three copies of `shopSync.ts`.

- [x] Generic sync engine `src/lib/cloudSync.ts` — done 2026-07-04:
      `createCloudSync({ projectId, tables })`, per-table config (Dexie
      table, remote name, mappers, explicit columns — never `select('*')`,
      optional realtime/updatedAt), dead-letter outbox, guarded cycle, LWW.
      `shopSync.ts` ported onto it (same nine exports, UI unchanged).
- [x] Supabase migration `20260704160000_sync_parity.sql`: `todos`,
      `climb_sessions`, `climbs`, `habits`, `habit_checks`, RLS by
      `is_member()`, realtime incl. `shop_areas`. *Applied 2026-07-05.*
- [x] Wire todo page to the engine (`src/lib/todoSync.ts` — THE reference
      integration; Dexie v5 adds `todos.updatedAt`, backfill-only upgrade)
- [x] Wire climbing to the engine (`src/lib/climbSync.ts`; `data.ts`
      superseded; session delete = one tombstone + local cascade)
- [x] Wire habits to the engine (`src/lib/habitSync.ts`; `habitStore.ts`
      keeps only pure date helpers)
- [x] Owner applied backend 2026-07-05: `npx supabase db push` — verified via
      `migration list`, all five migrations (init, owner_sharing, shop_areas,
      sync_parity, sharing_hardening) live on the hosted project.

## DX — new project in minutes (goal: add a project without doing a lot)

Target: creating a new subproject (with optional cloud sync) takes ONE small
config + one page component, no bespoke sync code. Concretely:

- [x] **Project scaffold recipe** — done 2026-07-04 as `docs/NEW_PROJECT.md`:
      the 7-step kit (registry, route, Dexie table + versioned upgrade,
      `<id>Sync.ts` config, SQL template with `is_member()` RLS + realtime,
      SyncCard mount, owner-only `db push`). Engine-debt principle stated
      in the doc.
- [x] **`docs/NEW_PROJECT.md` checklist** — same deliverable as above;
      linked from CLAUDE.md and WORKFLOW.md.
- [x] **SyncCard/empty-state as drop-ins** — `SyncCard` now takes an
      optional `sync` engine prop (drop-in status UI); `EmptyState` was
      already shared. Every synced page mounts `<SyncCard sync={sync} />`.
- [x] Stretch: `npm run new-project <id> [--synced]` — done 2026-07-04:
      `scripts/new-project.mjs` stamps the page (+ sync wrapper + SQL
      migration with --synced) and PRINTS paste-ready snippets for the three
      manual edits (registry, route, db.ts with auto-detected next version)
      instead of rewriting source files. Generated files compile standalone
      via `db.table()` + two commented casts that the printed TODOs say to
      remove after the real db.ts edit. Verified with a probe project
      (generated, typechecked, removed).

## Project 1 — Dashboard shell (entry point)

- [x] Scaffold Vite + React + TS + Tailwind v4
- [x] Hash routing with shared `Layout` (header, online/offline badge)
- [x] Home page rendering the project registry with live cross-project stats
- [x] Shared components: `Button`, `Card`, `PageHeader`, `EmptyState`, `OnlineBadge`
- [x] PWA: manifest, icons, offline precache (`vite-plugin-pwa`, autoUpdate)
- [x] Placeholder app icons (solid rounded square)
- [x] App icons: dashboard tile motif (generated via ImageMagick from SVG)
- [x] Settings page (`/settings`): storage usage/persistence, sync status, wipe device data

## Project 2 — local-transfer (offline file stash)

- [x] Add files via tap or drag&drop, stored as Blobs in IndexedDB (`db.files`)
- [x] List with size/date, download, delete
- [x] Native share sheet (`navigator.share`) — AirDrop/apps on iOS/macOS
- [x] Persistent-storage request so iOS doesn't evict data
- [x] Online/offline awareness (badge + copy)
- [x] Auto-upload to Supabase Storage when signed in (`src/lib/transferSync.ts`, bucket `transfer`, flat `<uuid>_<name>` paths; `remoteUrl` stores the object path)
- [x] Shareable download links (7-day signed URLs, 🔗 Link button)
- [x] Auto-sync on reconnect + cloud file list with per-device download ("Get on this device")

## Project 3 — shop-list (sharable groceries)

- [x] Route + page; `db.shopItems` schema exists
- [x] Add/check/uncheck items, clear bought (local-first against `db.shopItems`)
- [x] Sync via Supabase table + realtime (`src/lib/shopSync.ts`: Dexie outbox →
      flush on reconnect/foreground, pull remote as source of truth, realtime
      channel; UI unchanged, still local-first)
- [x] **Areas**: the list is split into sub-areas (`shop_areas`, items carry
      `area_id`); sharing is per-area only. Owner sees all areas implicitly;
      guests need a `shop_area_members` row. Invite ways: (1) per-area member
      management in the list (AreaManager), (2) invite link `#/join/<token>` —
      the token is the area's `share_token` (owner-only via `area_share_token`
      RPC); `redeem_invite` lets a new guest self-whitelist for that one area
      (the link IS the invitation — revoke by removing the guest). Migration
      `20260704150000_shop_areas.sql`; local data migrated into a fixed-id
      "Groceries" area that matches the server default.
- [x] Guest sharing: **Sharing** project (`/sharing`, owner-only card on home) —
      invite a guest email, toggle per-project access, remove guests, share the
      app link. Backed by owner-only RLS policies on `allowed_emails` +
      `project_members` (migration `20260704120000_owner_sharing.sql`). The
      owner bypasses membership checks (`is_member()` returns true for owner on
      every project); only guests are granular.

## Infrastructure

- [x] GitHub Actions workflow to deploy `dist/` to GitHub Pages on push to `main`
- [x] Local git repository with initial commit
- [x] GitHub repo: https://github.com/Fora00/dashboard (public — free plan doesn't allow Pages on private repos; owner approved)
- [x] Pages enabled, live at https://fora00.github.io/dashboard/
- [x] **Supabase project**: `undeyznqkmnhgdetpbdk` (https://undeyznqkmnhgdetpbdk.supabase.co),
      CLI as dev dependency (`npx supabase`), config in `supabase/`
  - [x] Auth: email **OTP code** login (not link-click — links open Safari, not
        the installed PWA, on iOS); `allowed_emails` whitelist enforced by a
        `before insert on auth.users` trigger (migration `20260704000000_init_sync.sql`)
  - [x] `project_members(project_id, email)` + `is_member()`/`is_owner()` RLS helpers
  - [x] Storage bucket `transfer` + member-only policies (client upload not wired yet)
  - [x] `shop_items` table with realtime + RLS by membership
  - [x] `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local` and repo Actions secrets
  - [x] Client: `src/lib/sync.ts` (client + OTP auth), `src/lib/useAuth.ts`,
        `src/components/SyncCard.tsx` (sign-in card on shop-list; local mode always works)
  - [x] Backend applied to hosted project (2026-07-04): migration + config
        pushed, whitelist trigger verified live via the auth API.
        To re-apply after changes: `npx supabase db push` (migrations) and
        `SMTP_PASS=<gmail app password> npx supabase config push` (config).
  - [x] Sign-in emails via **Gmail SMTP** (franzmito@gmail.com, app password —
        revocable at myaccount.google.com/apppasswords). Needed because the
        free tier can't customize email templates with the default mailer, and
        the OTP-code flow needs `{{ .Token }}` in the template
        (`supabase/templates/magic_link.html`). Free-tier gotcha: keep
        `[storage.vector] enabled = false` in config.toml or `config push` 402s.

## Project 4 — todo (generic list)

- [x] Local-first generic todo list (`/todo`, `db.todos`): add, toggle, delete, clear done
- [x] Cloud sync via `src/lib/todoSync.ts` on the generic engine (2026-07-04)

## Project 5 — climbing (progress tracker)

- [x] Sessions (date, location, boulder/lead, notes) + climbs with French/Font grades, sent/attempted (`db.climbSessions`, `db.climbs`)
- [x] Progress: hardest send per month as grade-scaled bars, session/send totals
- [x] Cloud sync via `src/lib/climbSync.ts` on the generic engine (2026-07-04)

## Project 6 — habits (daily tracker)

- [x] Habits with emoji, daily check-off, streak + 14-day dot row, archive/restore/delete (`db.habits`, `db.habitChecks`)
- [x] Cloud sync via `src/lib/habitSync.ts` on the generic engine (2026-07-04)

## Project 7 — book-ideas · Project 8 — boardgame-ideas (idea capture)

Both added 2026-07-05 via the NEW_PROJECT.md kit + generator (first real use):

- [x] `book-ideas` 📖 and `boardgame-ideas` 🎲: title + optional notes per
      idea (tap row to expand, textarea saves on blur), swipe-left delete
      with undo, skeletons, guest-aware empty states, theme-aware. Dexie v6
      (`bookIdeas`) + v7 (`boardgameIdeas`); wrappers
      `bookIdeasSync.ts`/`boardgameIdeasSync.ts` on the generic engine.
- [x] Migrations `20260705100000_book_ideas.sql`,
      `20260705110000_boardgame_ideas.sql` (RLS `is_member()` with
      WITH CHECK, realtime). *Applied 2026-07-05.*
- [x] Generator hardening found by dogfooding: `npm run new-project`
      requires `--` before args (npm swallows flags otherwise — usage +
      docs now say so); double-pluralization of already-plural ids fixed
      (`book_ideass` → `book_ideas`); wrapper filenames now camelCase
      (`bookIdeasSync.ts`, not `book-ideasSync.ts`).
- [x] Owner applied backend 2026-07-05: `npx supabase db push` — verified via
      `migration list`, all seven migrations live on the hosted project.

## UI & UX improvements

- [x] **Visible sync state** — done 2026-07-04: engine exposes observable
      `SyncStatus` (`getStatus`/`subscribe` + `useSyncStatus` hook; each
      `*Sync.ts` exports `sync` and `useStatus`). SyncCard shows pending
      pill, "Synced Nm ago", and a persistent rose error line derived from
      the dead-letter count (a rejected change can't be un-rejected, so the
      message stays until the tombstone count drops). Wired into shop-list,
      todo, climbing, habits. Nit for later: "Nm ago" doesn't tick on a
      timer, it refreshes on status changes.
- [x] **Guest-aware empty states** — done: signed-in non-owner with an empty
      list sees "ask Francesco to invite you" copy (shop-list: only on the
      no-areas state — an empty shared area is legitimately empty).
- [x] **Undo snackbar** — done 2026-07-04: `Snackbar.tsx` + `useUndoSnackbar`
      (delete runs immediately, in-memory snapshot, Undo re-upserts the same
      ids through the engine — sync flow untouched, works offline). Wired:
      todo delete/clear-done, shop item delete (new — swipe is the only
      per-item delete), clear bought, area delete (area + items), local file
      delete (re-enters upload path). Deliberate exceptions: Settings wipe
      keeps its confirm (no sane snapshot); cloud-only file delete has no
      undo. Known gap: undo is lost if the deleted area was the last one
      (AreaManager unmounts with its snackbar).
- [x] **Swipe-to-delete / swipe-to-complete** — done: `SwipeableRow.tsx`
      (pointer events, 10px horizontal-intent gate, 72px threshold,
      touch-action pan-y so scrolling wins) on shop + todo rows; right =
      toggle, left = delete with undo; buttons kept.
- [x] **OTP sign-in polish** — done: autofocus on email and (on stage flip)
      code inputs, `maxLength`/`pattern` on the code, pasted codes stripped
      of non-digits; `inputmode` + `one-time-code` were already in.
- [x] **SW update toast** — done: `UpdateToast.tsx` hooks `onNeedReload`
      (real API in this vite-plugin-pwa version — verified in
      node_modules), sets a localStorage breadcrumb before the auto-reload,
      shows a passive "App updated ✓" toast after it. Mounted in Layout.
- [x] **Home grid live badges** — done: pill counts on Shop List (unchecked
      items), Todo (open todos), Habits (unchecked today); hidden at zero.
- [x] **iOS install hint** — done: `IosInstallHint.tsx` on Home, iOS-Safari
      + not-standalone detection, dismissal persisted in localStorage.
- [x] **Dark mode** — done 2026-07-05 (really: added a light theme — the
      old dark look is now the `dark:` variant, pixel-identical for dark-
      scheme users; light users get white/slate-50 surfaces, darkened
      accents for AA contrast). Media-query only, no toggle. `color-scheme:
      light dark` + pre-paint background in index.css, dual `theme-color`
      metas. Known accepted gap: PWA manifest splash stays dark (manifests
      can't do media queries).
- [x] **Skeleton loading + consistent offline banner** — done:
      `Skeleton.tsx`/`SkeletonList` on todo, shop-list, habits, climbing,
      local-transfer load states (row-height matched, no layout shift);
      `OfflineBanner.tsx` mounted once in Layout — amber "Offline — changes
      are saved on this device and sync when you're back."

## Ideas / later

Candidate new subprojects (brainstormed 2026-07-04, not committed to):

- [ ] **💰 Expenses / shared budget** [opus] — couple-shared ledger with
      who-paid and running balance (mini Splitwise). Reuses the shop-list
      area-sharing + outbox pattern almost exactly. Effort L. *Top pick.*
- [ ] **🍲 Meal planner + recipe box** [sonnet CRUD, opus for shop-list
      integration] — plan the week, "add ingredients to shop list" button
      writing into `db.shopItems`. Effort M–L. *Top pick.*
- [ ] **📚 Reading / watch list** [sonnet] — `todos`-shaped table with a
      status field + "pick something random" button; couple-shareable.
      Effort S. *Top pick, best value/effort.*
- [ ] **📔 Daily journal** [sonnet] — mood + free text per day; pairs with
      habits. Local-only (private). Effort S.
- [ ] **⚖️ Weight / body metrics** [sonnet] — daily weight log + line chart;
      synergy with climbing. Effort S.
- [ ] **🔁 Subscriptions tracker** [sonnet] — recurring bills with next-due
      and monthly-total rollup. Effort S.
- [ ] **🎒 Gear tracker** [sonnet] — climbing gear wear/retire dates,
      cross-referencing `climbSessions` counts. Effort M.
- [ ] **🎯 Climbing wishlist** [sonnet] — "want to climb" list that links to a
      `climbs` entry when sent. Effort S–M.
- [ ] **📈 Habit insights** [sonnet] — read-only cross-project charts
      (habits × climbing × metrics); no new tables. Effort M.
- [ ] **🧳 Packing list templates** [sonnet] — reusable trip checklists,
      shareable. Effort S–M.
- [ ] **🔐 Info vault** [opus if encrypted] — local-only private store
      (documents, emergency contacts); never sync in cleartext. Effort S–M.
- [ ] **🎙️ Voice memos / camera capture** [opus] — capture media straight
      into `db.files`, reusing `transferSync`. iOS media APIs are fiddly.
      Effort M.

Second batch (brainstormed 2026-07-04, later the same day):

- [ ] **🥫 Pantry inventory** [opus for the shop-list bridge] — what's in the
      house, optional expiry dates, one-tap "running low → add to shop list"
      writing into `db.shopItems`. Third leg of the shop-list + meal-planner
      triangle. Effort M. *Top pick of this batch.*
- [ ] **🎁 Gift ideas** [sonnet] — per-person gift jottings year-round, mark
      bought/given. Deliberately NOT shared (the giftee must never see it):
      local-only or owner-only sync. Simplest possible table. Effort S.
      *Top pick of this batch.*
- [ ] **🗺️ Places wishlist** [sonnet] — restaurants/trips/spots to try, with
      visited flag and a "pick one at random" date-night button;
      `todos`-shaped, couple-shareable. Pairs with the reading list idea.
      Effort S.
- [ ] **🗓️ Countdowns & dates** [sonnet] — birthdays, renewals, trips; home
      grid badge shows the nearest one ("Trip in 12d"), reusing the live
      badge pattern. Effort S.
- [ ] **🧾 Warranties & receipts** [sonnet] — snap the receipt (Blob into
      `db.files`, reusing `transferSync`), purchase + warranty-end dates,
      "expiring soon" view. Effort M.
- [ ] **🌱 Plant care** [sonnet] — per-plant watering/feeding interval,
      "due today" list, streak-style dot row copied from habits. Effort S–M.
- [ ] **🧹 Chores rotation** [sonnet] — recurring household tasks that
      alternate between partners ("whose turn is the bathroom"); shared and
      assignable, unlike habits; reuses `project_members` sharing as-is.
      Effort M.
- [ ] **🚗 Vehicle log** [sonnet] — fuel fill-ups, maintenance, Italian
      paperwork deadlines (bollo, revisione, insurance) with next-due
      rollup — the subscriptions tracker idea, but for the car. Effort S–M.

Infrastructure ideas:

- [ ] Export/import all local data as a backup file [sonnet]
- [ ] E2E encryption for synced files [opus]
