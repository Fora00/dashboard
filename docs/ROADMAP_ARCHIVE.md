# Dashboard — Roadmap archive

> Sections of `ROADMAP.md` with **no open tasks**, moved here on 2026-10-05 so
> the live roadmap stays short. Nothing was rewritten. History and rationale
> only: if you reopen one, move it back into `ROADMAP.md`.

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

## Project 9 — yt-declutter — built, then removed (2026-08-08)

Built as a bookmarklet (opus wrote the DOM-hiding script, sonnet wired a
dashboard page around it) to hide YouTube mobile web's Home tab. Abandoned
same day: recent iOS Safari/Chrome silently strip `javascript:`-scheme text
pasted into a bookmark's URL field, so the bookmarklet couldn't actually be
installed on-device. A mature, actively-maintained Safari Web Extension
("UnTrap for YouTube", App Store) already does this properly — persistent,
no re-tapping, 177+ options — for a few dollars. Never worth re-fighting the
iOS bookmark-field restriction to rebuild a worse version of that. Chrome on
iOS has no extension mechanism at all (Apple platform restriction, not a gap
in the build) — no solution, ours or a paid App Store one, covers it.
Registry entry, route, and `src/projects/yt-declutter/` deleted; nothing was
ever pushed to `main`, so GitHub Pages never served it.

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

## Infrastructure maintenance

- [x] **CI actions target the deprecated Node 20 runtime** [sonnet] — bumped 2026-09-30 to checkout@v7, setup-node@v7, configure-pages@v6, upload-pages-artifact@v5, deploy-pages@v5; confirm the first run is green and the warning is gone. Original: — every
      deploy since 2026-09-10 emits: "Node.js 20 is deprecated. The following
      actions target Node.js 20 but are being forced to run on Node.js 24:
      actions/checkout@v4, actions/configure-pages@v5, actions/deploy-pages@v4,
      actions/setup-node@v4, actions/upload-artifact@v4." Deploys still
      SUCCEED — GitHub is force-running them on Node 24 — so this is a
      warning, not a breakage, and there is no rush. It becomes a real
      failure whenever GitHub drops the compatibility shim. Fix: bump the
      five action majors in `.github/workflows/deploy.yml` (currently
      `checkout@v4`, `setup-node@v4`, `configure-pages@v5`,
      `upload-pages-artifact@v3`, `deploy-pages@v4`) to their current
      releases, then push and confirm the run stays green — the workflow is
      the only thing standing between a commit and the live site, so verify
      the deploy rather than just the diff. `node-version: 22` in the
      workflow is unrelated and already fine. Effort XS.
      Ref: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
