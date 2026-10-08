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

## Archived sections

Fully-done sections live in `docs/ROADMAP_ARCHIVE.md` (not needed to start work): Urgent bugs (audit 2026-07-04), Sync parity, DX — new project in minutes, Projects 1–9 (shell, local-transfer, shop-list, Infrastructure, todo, climbing, habits, book/boardgame ideas, yt-declutter), UI & UX improvements, Infrastructure maintenance.

## Project 10 — links (shared link stash)

Added 2026-09-10 via the NEW_PROJECT.md kit (hand-written from the
`book-ideas` reference rather than the generator — the read flag and the URL
helpers made a copy cleaner than a stamp-and-edit).

- [x] `links` 🔗 (`/links`): paste a URL, it saves with an editable title
      (defaulted to hostname + path) and optional notes; tap a row to expand
      (title input + notes textarea, save-on-blur-if-changed, 🔗 Copy and
      ✕ Delete), ↗ opens in a new tab, ○/● toggles read. Swipe right =
      toggle read, swipe left = delete with undo. Unread sorts first,
      newest-first within each group. Home grid shows an unread badge.
      Dexie v8 (`links`), wrapper `src/lib/linksSync.ts` on the generic
      engine; shared with guests through /sharing + `project_members`.
- [x] URL handling is deliberately offline-only: `normalizeUrl()` in
      `linksSync.ts` trims, prepends `https://` when there's no scheme, and
      validates via `new URL()` + an http(s)-only protocol check — it never
      fetches the page for a real title (must work offline, and cross-origin
      fetches are CORS-blocked anyway). The protocol check is load-bearing:
      the URL is rendered straight into an `<a href>`, and it rejects
      `javascript:` (all casings, with and without `//`), `data:`, `file:`
      and `ftp:` — verified against those cases 2026-09-10.
- [x] First project to ship the roadmap's parked "no length limits on
      user-entered text" fix as a *new-project default* rather than a
      retrofit: `maxLength` on url/title/notes (2000/300/2000) mirrored as
      `check (char_length(...) <= N)` constraints in the migration, so a
      client bypass can't blow past it server-side. Worth copying into
      `docs/NEW_PROJECT.md`'s SQL template — see the follow-up below.
- [x] Migration `20260910120000_links.sql` (RLS `is_member('links')` with
      WITH CHECK, realtime publication, length checks). *Applied by the
      owner 2026-09-10* — verified via `migration list` (local+remote) and
      by reading the hosted schema back, which returns the `links` table
      with all seven columns.
- [x] `src/lib/database.types.ts` hand-edited with the `links` block (the
      typed client won't compile without it), then replaced 2026-09-10 by
      the real generated file via `npm run db:types` after the push — the
      generated `links` block matched the hand-written one exactly. The
      same run also picked up a codegen change from a newer CLI (added
      parentheses in the `Tables<>`/`TablesInsert<>` helper generics),
      unrelated to this project. Build + lint green after.

### Tags (added 2026-09-10, same day)

- [x] Per-link tags + a tag filter bar. `LinkItem.tags: string[]`, Dexie v9
      with `links: 'id, read, createdAt, *tags'` — the **first multiEntry
      index in this db** — plus a backfill `.upgrade()` setting `tags = []`
      on the v8 rows that already existed. Tags normalize to lowercase,
      whitespace-collapsed, deduped via `normalizeTag()` in `linksSync.ts`
      (single source of truth for UI and mutations); caps are 10 tags x 30
      chars, mirrored in SQL.
- [x] UI: tag chips with a 40px ✕ in the expanded panel, an add-tag input
      committing on Enter *and* blur backed by a `<datalist>` of tags
      already in use (kills near-duplicate drift), up to 3 dim chips + `+N`
      on collapsed rows, and a frequency-sorted horizontal filter bar.
      **Filter semantics are AND** (a link needs every selected tag) — a
      one-line change to OR if that turns out wrong in use. Selected chips
      are distinguished by fill *and* a ✓ glyph, never colour alone;
      `border-2` on both states so toggling causes no layout shift.
      "✕ Clear" sits FIRST in the scroll row so it can't scroll out of
      reach on a phone, and the bar renders while a selection exists even
      if its tags are gone — otherwise the filter could get stuck on with
      no way out. Filter state is component-only, never persisted.
- [x] Two data-loss guards worth keeping (both in `linksSync.ts`):
      `toRow` sends `l.tags ?? []` because a row queued in the outbox under
      v8 has no `tags` — the Dexie upgrade rewrites the `links` table, not
      queued outbox payloads, so the first flush after upgrading would
      otherwise push `undefined` into a NOT NULL column and dead-letter the
      entry. `fromRow` uses `r.tags ?? []` so a null from the server never
      reaches the multiEntry index.
- [x] The v9 backfill was **executed, not assumed**: the builder drove the
      real `db.ts` against `fake-indexeddb` (installed `--no-save`, removed
      after; `package.json` untouched), created a genuine v8 database with
      an untagged row, reopened at v9 and asserted the backfill, the
      normalizer cases, the caps, the `*tags` index and the AND filter.
- [x] Migration `20260910140000_links_tags.sql` — *applied 2026-09-10*
      (owner explicitly authorised the orchestrator to run `db push` +
      `npm run db:types` for this one; the CLAUDE.md rule still stands as
      the default). `migration list` shows all nine local+remote, and the
      regenerated types carry `tags: string[]`. Adds the column
      plus `links_tags_max_count` and `links_tags_max_length`. The
      per-element check calls an IMMUTABLE helper
      (`public.links_tags_within_length`) because a CHECK can't contain the
      `unnest` subquery it needs. The orchestrator briefly replaced this
      with `char_length(array_to_string(tags, ','))` to avoid the extra
      schema object, then reverted: **array_to_string is only STABLE**
      (it calls the element type's output function), which is exactly why
      indexing it errors, so it has no business inside a CHECK. Known minor
      wrinkle, accepted: a CHECK calling a user-defined function is a
      `pg_dump`/`pg_restore` ordering hazard if data is restored before the
      function exists — not a concern on Supabase's schema-then-data path.
- [x] **Tag rename/merge** [sonnet] — done 2026-09-30: `renameTag` in `linksSync.ts` (one Dexie transaction, `upsertMany`, merge by dedupe), `ManageTagsSheet.tsx`, Undo, the selected filter follows the rename; 21 headless checks + browser at 390px. Original: — `normalizeTag` + the datalist prevent
      most drift, but there's no way to fix `readng` → `reading` once it's
      on several links. Effort S.

Follow-ups this project surfaced:

- [x] **Bake length caps into the new-project templates** [sonnet] — already done (found 2026-10-07): `scripts/new-project.mjs` and `docs/NEW_PROJECT.md` carry `maxLength` + `char_length <= 300`. Original: — the
      `links` migration and page carry `maxLength` + `char_length` checks,
      but `docs/NEW_PROJECT.md`'s SQL template and
      `scripts/new-project.mjs` still stamp uncapped `text` columns and
      uncapped inputs, so project 11 will start unprotected again. Copy the
      pattern from `20260910120000_links.sql` + `src/projects/links/Links.tsx`
      into both. Effort XS. Partially retires the parked "No length limits
      on user-entered text" item for *future* projects; existing projects
      still need the retrofit.
- [ ] **IDN links display as punycode** [sonnet] — `defaultTitle()` and the
      page's `hostname()` helper both show `new URL().hostname`, which is
      punycode for non-ASCII domains (`https://例え.jp/パス` titles as
      `xn--r8jz45g.jp/%E3%83%91%E3%82%B9`). Cosmetic only, and the title is
      user-editable, so it's a papercut not a bug. Fix would be
      `decodeURIComponent` on the path plus an IDN-aware host display.
      Effort XS. Low priority.

## Home grid — stars, usage ordering, sort selector

**Shipped live 2026-09-10** (commits `849857a` localStorage fix, `6497466`
links tags, `eb03216` home ordering; Pages deploy run 34451623653 green,
https://fora00.github.io/dashboard/ serving the new bundle).

Added 2026-09-10. **Local-only by design** — no Supabase table, no migration,
no `*Sync.ts`: open counts are inherently per-device. Accepted tradeoff: stars
do NOT carry across devices (see the follow-up below).

- [x] `ProjectStat` in `db.ts` (`id`, `opens`, `starred`, `lastOpenedAt`),
      Dexie v10 `projectStats: 'id, starred, opens'` — new empty table, no
      backfill needed. Deliberately absent from `OutboxTable`/`OutboxPayload`.
      Writes live only in `src/lib/projectStats.ts` (`recordOpen`,
      `toggleStar`), both transactional read-then-put upserts so two fast
      navigations can't lose a count, and `toggleStar` works with no
      pre-existing row (starring a never-opened project).
- [x] Opens are counted in `Layout.tsx` on `location.pathname` change, not on
      card tap — so deep links, back/forward and the PWA start URL all count.
      A `useRef` guards StrictMode's dev double-invoke without blocking a real
      re-visit.
- [x] ★ toggle per card, rendered as a SIBLING of the `<Link>`, never nested
      inside it: a `<button>` inside an `<a>` is invalid HTML and the tap
      would navigate instead of starring. Card header got `pr-10` so the live
      badge never sits under the star.
- [x] Sort selector (native `<select>`, four modes: Most used / Recently
      opened / Name / Default order) + a reverse toggle, both persisted in
      `localStorage` (`dashboard:home-order`, `dashboard:home-order-reversed`)
      rather than Dexie — a per-device UI preference doesn't warrant a schema
      version. Starred projects stay pinned on top in every mode and in both
      directions.
- [x] **Reversal reverses the OUTPUT, not the comparator's sign.** The two
      groups (starred, unstarred) are sorted independently, then each is
      `.reverse()`d. Negating the comparator would have been a silent no-op
      for 'Default order' (its comparator returns 0 for every pair and lets
      the stable sort do the work — and `-0 === 0`) and would also have left
      tied entries unmoved, e.g. the all-zero fresh-device case. If anyone
      "simplifies" this back to a sign flip, that's the regression.
- [x] Verified by driving the real dev server headlessly with a `localStorage`
      whose `getItem`/`setItem`/`removeItem` all throw, plus fixture scripts
      over all four modes x reversed, ties, never-opened rows, and
      starred-stays-on-top.

- [ ] **Sync the starred flag across devices** [opus] — stars are currently
      per-device because `projectStats` is local-only. Open counts should
      stay local (they're per-device by nature), so this is NOT a
      straight "add it to the engine" job: it needs a split between a synced
      `starred` and a local `opens`/`lastOpenedAt`, or a synced
      preferences table keyed by user. Decide the shape before building.
      Effort M.

### Show / hide per project (added 2026-09-28)

Hiding is a per-device **view preference**, not deletion or permission:
data, routes and sync are untouched, and a hidden project's URL still opens.

- [x] **Hide projects from the home grid** — done 2026-09-28 (build + lint
      green; not yet spot-checked on a phone). A code-level `disabled` flag
      that also removes the route was considered and rejected: it adds no
      privacy (repo and bundle are public, data is behind RLS or on-device)
      and would be a second, deploy-only hide mechanism. A project that stays
      hidden for months and isn't missed gets deleted instead, like
      yt-declutter. Original spec: [sonnet, pattern: `toggleStar` in
      `src/lib/projectStats.ts` + the star button in `Home.tsx`] —
      `ProjectStat.hidden?: 0 | 1`, **not indexed, so no Dexie bump**.
      Unset means "use the default": `DEFAULT_HIDDEN` = todo, habits,
      climbing, shop-list, boardgame-ideas, book-ideas (the owner's choice
      2026-09-28). Everything else, including future projects, defaults to
      visible. Nothing is written until the owner toggles, so an explicit
      choice is never overwritten. Never hideable: `settings`, `sharing`.
      **Defaults apply only to the owner and to signed-out users.** A
      signed-in guest gets no default hides, so a guest's phone never loses
      Shop List. `recordOpen`/`toggleStar` must preserve `hidden` (both
      currently `put` a fresh object, which would drop it). UI: a "Projects"
      section in Settings with one 40px switch per hideable project; Home
      filters hidden projects after `ownerOnly`, with a "N hidden · manage"
      link to `/settings` at the bottom. Effort S.
- [ ] **Life 🧭** — spec in `docs/HANDOFF-life.md`, design agreed with the
      owner 2026-09-28: synced with `is_owner()` RLS, plan (`life_weeks`)
      split from the log (`life_entries`), stable ids, Things via
      `things:///json` (Inbox fallback verified), import link
      `#/life/import?d=…` opened on the Mac.
  - [x] Phase 1 [opus], done 2026-09-28:
        - migration `20260928120000_life.sql` (`life_weeks` + `life_entries`,
          all eight policies `is_owner()`, CHECKs mirrored by `LIFE_CAPS`,
          realtime);
        - Dexie v11 and `src/lib/lifeSync.ts`;
        - engine `upsertMany`;
        - pure `src/projects/life/model.ts`: validator, diff, `summarizeWeek`,
          Things URL, export, import link.

        Verified with throwaway scripts: model over three timezones, a
        v10→v11 upgrade on fake-indexeddb, the migration on PGlite with a
        guest denied at every operation. Design notes:
        - `life_weeks` has `id` = the week's ISO date, because the engine
          addresses rows by `id`.
        - Keyed toggles are never deleted, only set false, so a delete can't
          lose to a stale update.
        - The export's JSON block is `{ plan, entries }`.

        *Applied 2026-09-28* by the owner, after restoring the project
        from a free-tier auto-pause (`status: INACTIVE`, which makes
        `db push` fail with "login role status 544 … connection timeout").
        `migration list` shows all ten migrations local and remote, and
        `npm run db:types` regenerated a file identical to the hand-written
        blocks.
  - [x] `/settimana` command: `.claude/commands/settimana.md` (canonical;
        `.claude/` is gitignored, so it lives only on the owner's Mac) and
        the committed `scripts/life-link.ts`, which validates with the real
        `parseWeekJson` and prints the import link. `~/life` has a
        same-named pointer command. `~/life` itself never leaves the Mac.
  - [x] Phase 2, done 2026-09-28: `Life.tsx` + `LifeImport.tsx`, driven
        end-to-end in headless Chromium with fake data (21 assertions, no
        console errors, 375px without horizontal scroll). The orchestrator
        reordered the Things send so tasks are marked sent *before*
        navigating: iOS may suspend the PWA the moment Things opens.
  - [x] Logged tracker entries editable, done 2026-09-28 (owner-reported):
        a "N logged · edit" list per tracker to fix energy or delete with
        undo. Browser-verified (10 checks).
  - [x] **Plan editor, "By hand"** — done 2026-09-28: `LifeEditor.tsx` at
        `/life/edit?week=…`, plus `PlanPreview.tsx` shared with the import.
        Browser-verified with 18 checks: a renamed tracker keeps its +1s,
        and "Copy last week" keeps the ids. Original spec: [sonnet] a form that
        builds the same `LifePlan` as the JSON import and saves through
        `validatePlan` → diff preview → `importWeek`. It covers focus
        (≤3), rules, trackers (emoji/label/target|max/energy), Sunday
        questions (label/type), check-ins and tasks (title,
        when/deadline, free-text area/project). Ids are generated on add
        and kept on rename, never shown. It is reachable three ways: an
        "Edit week" button (prefilled), a "By hand" option next to
        "Paste JSON", and "Copy last week" for a new week (trackers, rules
        and questions keep their ids). UI only: no schema or sync change.
  - [x] **Things status back into `/settimana`**, done 2026-09-28:
        `scripts/life-things-status.ts` reads a Life export from stdin and
        asks Things, read-only via AppleScript, for to-dos created around
        each send. How matching works:
        - Every send is timestamped in `value.sends` of the sent entry
          (last 10, no schema change). "Resend selected" now records its
          time too, before navigating.
        - Things never changes a to-do's creation time, so a batch is found
          even after renames. Within a batch: exact title first; a single
          leftover pairs for certain; more leftovers pair by shared words
          only when the best candidate is unique. Anything else is
          reported, never guessed.
        - Things gotchas found on first real use (2026-09-28):
          - The app-level `to dos` **excludes the Logbook**, so completed
            items were "NOT FOUND". The Logbook is now its own pass,
            filtered by completion date with a window of at least 14 days.
          - `repeat with t in (… whose …)` re-runs the query on every
            step, which took 2m16s. Five bulk property gets per list take
            8s.
          - The title fallback only considers to-dos created from the
            week's Monday on.
        - [ ] **Canceled to-dos unverified** [opus, XS]: the Logbook pass
              filters on `completion date`. If Things stores cancellations
              in a separate `cancellation date`, canceled to-dos show as
              NOT FOUND instead of canceled. Check with a real canceled
              to-do and extend the filter if needed. Parked by the owner
              until the next week's run.
        - AppleScript gotchas: `st` is a reserved word, and Things terms
          inside a handler need their own `tell` block. Dates are read as
          "seconds ago", because date↔epoch conversion is
          locale-fragile.

        Verified against real Things with fake to-dos: exact match, a
        single rename, two renames in one batch, NOT FOUND, not sent.
        The "completed" path is untested, because it would need ticking a
        real to-do.
  - [ ] **Life layout pass** (owner-requested 2026-09-28):
        - [x] Done 2026-09-28, verified on PGlite and with a throwaway
              script. Check-ins without an id get a deterministic one,
              `c-<date>-<label slug>`, derived when read; `setCheckin`;
              `canReturnFromThings()`/`isIosLike()`/`lifeReturnUrl()`.
              *Migration applied by the owner 2026-09-28*, before the
              UI shipped: until then the server would reject check-in
              entries and the engine would dead-letter them.
              `migration list` shows it local and remote.
              Original spec: [opus] Actionable check-ins, data side: new entry kind
              `checkin`, mark done + optional note, plus migration
              `20260928150000_life_checkins.sql`; check-ins get stable ids;
              the export includes them. Also `buildThingsUrl` gets an
              optional `x-success` return URL, used on the Mac only (iOS
              can't route a link into an installed PWA).
        - [x] Done 2026-09-28, browser-verified with 35 checks plus an
              iPhone emulation for the hint and the missing x-success.
              Collapsible state is in guarded localStorage
              `dashboard:life-sections`. Original spec: [sonnet] UI:
              collapsible sections (state kept per device);
              one-line explanations for Sunday check and Export; a
              check-in list with done/note and overdue highlight; sent
              tasks tappable (`things:///search`); a "Sent N at HH:MM"
              confirmation; the iOS "◀ Dashboard" hint.
  - [x] **Life simplification pass**, done 2026-09-29 (owner-requested).
        Browser-verified in headless Chromium at 375px with a faked clock.
        - Trackers are shown as **Habits**: one tap toggles "done today".
          The day strip, energy and per-entry edit sit behind a ▸, and
          energy is no longer prompted on log. Past days of the week can be
          toggled from the strip. On Monday a dashed cell marks last
          Sunday, written to last week's entries (tracker matched by id,
          else by label). UI only, same entries.
        - Check-ins use the same row as Focus/Habits: the whole row toggles
          done, the note is behind ✎, and overdue only tints the date.
        - Sunday check is compact: a "This week" recap (focus, check-ins,
          Things sent, habit counts), the answers on one line, and the form
          behind Answer/Edit answers.
        - A Sunday question can link to a tracker (`tracker`,
          number/boolean only) and is then answered from the log (count /
          target reached), never typed. The editor has an "Auto from…"
          picker. The export marks these "(from tracker)".
        - Tasks can carry `listId`, the Things area/project id, which
          `scripts/life-things-lists.ts` resolves on the Mac (read-only,
          loose name match like `~/life/_sync/things-add.sh`). Send uses
          `list-id`, so it survives renames. Checked against real Things
          read-only.
        - Plan fields only, no migration: the server doesn't validate the
          plan's inner shape.
        - [ ] **Owner:** on the next send, confirm `list-id` lands to-dos
              in the right area (untested; it would create real to-dos).
  - [ ] **Owner, on the iPhone:** tap "Send to Things" from the installed
        PWA and confirm Things opens with the to-dos. That's the last
        unverified piece.
  - Original phase 2 spec [sonnet] — UI on the phase-1 API:
        - registry entry (`ownerOnly`, 🧭; ownerOnly already keeps it off
          `/sharing`);
        - `/life` and `/life/import` routes;
        - Week screen, Import with preview/diff, Things button with
          "Resend selected", Export (clipboard + share), History, SyncCard.

        Then test the Things link from the installed iOS PWA.
- [x] **Engine flush race** [opus], done 2026-09-30. `flush()` in
      `cloudSync.ts` now takes the lock before its first await (released in
      `finally`), and a `rerun` flag makes a running flush do one more ordered
      pass for entries queued mid-flush. Verified with a throwaway harness
      (bundled real `db.ts` + `cloudSync.ts`, fake Supabase client,
      fake-indexeddb): concurrent flushes, upsert-then-delete order,
      mid-flush entry, getSession throw, transient stop, dead-letter — 3 of 6
      failed before the fix, all pass after. Unverified: real Supabase and iOS
      timing. Turning the harness into a real test needs a test runner.

### Pre-existing bug found while verifying the above (2026-09-10)

- [x] **Unguarded `localStorage` white-screened the whole app under Safari
      private mode / "block all cookies"** — in those modes `localStorage`
      access THROWS rather than returning null. `IosInstallHint.tsx` called
      `getItem` inside a `useState` initializer (killing the home page) and
      `UpdateToast.tsx` called `getItem`/`setItem`/`removeItem` unguarded
      while being mounted in `Layout` on EVERY route (killing every page).
      With no error boundary in the tree (see the parked "No top-level React
      error boundary" item, still open — it would have contained this), the
      result was a blank screen with no recovery affordance on an installed
      PWA. Both wrapped in try/catch; caught by headless verification, not by
      review or by `tsc`. **Any future `localStorage` use must be guarded** —
      the three call sites in the codebase now all follow the same
      read-guarded / write-guarded helper pattern.

## ▶ Resume here (session paused 2026-09-30, usage limit)

State: everything up to the "Come" filter is committed; the last push to
`main` was `229d77b` (error boundary, events polish). Commits after it are
LOCAL until the owner pushes: quick actions on the card, template caps,
`.ics`, links tag rename, filters/search, format tags, "Come" section.
Then, in order:

1. **Categories done 2026-09-30** [opus]: `food` (Cibo e vino, 196), `tours`
   (Visite, 112), `outdoor` (47); `other` 537 -> 173; crawl-time drops
   (professional training 26, civic notices 6, spectator sport 7, listed in
   the crawl summary); concerts/theatre keyword gaps; the `kids` false
   positive on garda-veneto typologies fixed. Follow-ups [sonnet]: rename
   "Festivals & food" (now confusing next to "Cibo e vino"); pick one label
   language (new labels Italian, old English); title-beats-typology for
   concerts typed "Teatro" (Michielin); wellness/community courses in
   `other` could get social tags; page not re-checked in a browser after the
   category change.
2. **Push** (owner asked for one push at the end of the batch) — done at the
   end of 2026-09-30 if the next line says so; then watch the Deploy run.
3. **Spot pass + visitrovereto** — queue item 10 in Project 12. Festa della
   Castagna, Castione di Brentonico is DONE (Sun 18 Oct 2026, in spot.json,
   area trentino, Spot badge; only one day verified). Still to do: other
   autumn festivals,
   Bologna/Torino/Milano/Ferrara big events, Milan Games Week / Miart if
   the dates can be verified, then a visitrovereto.it adapter only if the
   markup is reliable.
4. **After ~10 Oct 2026:** check the Zandonai and Filarmonica seasons
   arrived (Project 12, "Watch after ~10 Oct").
5. **Owner on the iPhone:** "Send to Things" from the installed PWA, the
   `.ics` share sheet, the collapsed-card Save/Hide/Share, error boundary in
   dark mode.
6. Rest of the events queue (Project 12): "new since last visit" badge, group
   repeats with the same title, sorting inside a day, travel time, owner-only
   sync of saved/hidden, saved events in the Sunday Life plan.
7. Unchanged backlog: canceled to-dos in Things, sync of `starred`, code
   splitting, `cloudSync` tests, dead-letter recovery UI, IDN links,
   accessibility pass.

Session conventions worth keeping:
- The owner works **one thing at a time**: ask one question per turn,
  about the current feature only.
- `~/life` never leaves the Mac. Life data may sync owner-only.
- `.claude/` is gitignored. `/settimana` lives only on the owner's Mac.
- The Supabase free tier auto-pauses after about a week idle
  (`status: INACTIVE`). The owner restores it, then runs `db push`.

## Project 12 — events 📍 (Trentino event collector)

Added 2026-09-28. Public events from many sources in one list, tagged by
interest. The site is static, so crawling can't run in the browser (CORS):
a **GitHub Actions** job crawls daily and publishes `events.json` with the
site. Events are public data, so they can live in the public build. The
owner's saved/hidden events and favourite tags stay on the device (owner-only
sync can come later).

- [x] **Phase 1: crawler** [opus] — done 2026-09-29, not yet pushed.
      `scripts/events/` (zero deps, run by Node's type stripping:
      `npm run events:crawl`), schema + how to add a source/category in
      **`docs/EVENTS.md`** (schemaVersion 1, additive changes only: a local
      tool outside this repo reads it). Categories/keywords: one file,
      `scripts/events/tags.ts`. Deploy workflow: daily cron `23 4 * * *`
      plus a crawl step with `continue-on-error`. `public/events.json` is
      gitignored (built in CI, about 1 MB raw, 215 KB gzipped, not precached by the SW).
      A failing source keeps its events from the deployed `events.json`.
      Each event has `image` (a URL or null), a full `description` and a short `summary`.
      First run: 861 events after dedup, 62 requests, about 90 s.
      Per source (first run):
      - ludimus: 67, all board games. Detail pages (time, venue,
        image) fetched only for the next 30 days.
      - bibcom-trento: 94 (61 after dedup with comune-trento).
        OpenPA `/opendata/api/content/search`. No images (the API
        gives only an object id). Branch prefix stripped from titles.
      - trentogiovani: 3. OpenPA `/opendata/api/calendar`, the only
        opendata path its robots.txt allows (`/api/` and `/opendata`
        are disallowed). The brief's `/api/opendata/v2` is off-limits
        here and on comune-trento and Verona.
      - volkan: 0, stale. Whole-site iCal `?ical=1`, flagged `mayBeEmpty`.
      - rovereto (eventi.comune.rovereto.tn.it): 11, content/search
        filtered to future dates (the archive of about 1,900 is never paged).
      - comune-trento: 213, OpenPA calendar, 30-day chunks.
      - mart: 71 (exhibitions and events). Umbraco JSON API on
        media.mart.tn.it, found via `__NEXT_DATA__`.
      - bolzano: 292 from Open Data Hub. Mostly no text, venue or
        image; URL `mysuedtirol.info/it/eventi?eventid=…`.
      - verona: 152 from `www.comune.verona.it/opendata/api/calendar`,
        which robots.txt explicitly allows (unlike `/api/` and
        `/content/search`). No images. Heavy: about 5 MB per 30-day chunk,
        about 30 MB per run.
      - **Skipped: visitrovereto.it.** Events Manager REST
        `wp-json/events-manager/v1/events` returns 401, `/events.ics` is
        empty, there is no event type in `wp/v2`, and no JSON-LD. Only
        scraping rendered markup is left.
      Known data quirks: a few sources publish end < start (the pipeline
      drops that end); series with more than 8 dates are folded into one
      all-day record (`occurrences`); keyword noise ("mostra" also means
      "shows"); fuzzy near-duplicates across sources not merged.
- [ ] **Watch the first scheduled Actions run** [orchestrator] — after
      push: check the crawl step's summary table in the log and that
      `https://fora00.github.io/dashboard/events.json` is served.
- [x] **Phase 2: `/events` page** [sonnet] — done 2026-09-29, local-only
      (no sync). `src/projects/events/` (`Events.tsx`, `EventCard.tsx`,
      pure `model.ts`, `types.ts` mirroring docs/EVENTS.md). Dexie v12:
      `eventsCache` (last events.json, renders offline), `eventMarks`
      (saved/hidden with an event snapshot, so saved events outlive the
      file), `eventPrefs` (favourite categories, ☆ chip to edit, listed
      first and used as the default filter). Views: All (with an "Open now"
      group for events that started before today) · Open now · Saved; category + city
      chips; show hidden; 60 cards, then "Show more". Card: image, range, venue ·
      city, summary; tap for the full description, the event page, Save/Hide, and
      "To Things" (`things:///add`, `when` = event day or today).
      Scraped `url`/`image` are rendered only if http(s) (`safeHttpUrl`).
      Verified in headless Chrome at 390 px: no horizontal overflow, no
      console errors, filter → save → reload keeps the save.
- [x] **Creative + theatre, no kids, more sources** [opus] — done
      2026-09-29. `tags.ts`: new categories `creative` (hands-on adult
      workshops; art media count only next to laboratorio/corso/workshop)
      and `theatre` (opera included), chosen in tiers (title first, then
      typology, summary, full text); fixed `comic*` matching "comicità".
      New `kids` tag (conservative; the long description can only veto).
      The page NEVER shows kids events (owner: "no kids and family stuff";
      no toggle), but the tag stays in events.json for other consumers.
      Category chips match the primary category OR a tag (`inCategory`).
      `http.ts` honours robots `Crawl-delay` (capped at 30 s).
      Six new sources, all ok on the first run (1,401 events, 86 requests, about 170 s):
      - cultura-trentino (cultura.trentino.it, OpenPA search, Crawl-delay
        10): 467, the whole province. Images are object-id only.
      - rovereto-comune (ViviRovereto, OpenPA calendar): 9. Carries the
        **RAM film festival** (7–11 Oct 2026, category Cinema).
      - zandonai (teatro-zandonai.it, OpenPA class `spettacolo`): 1 for now,
        `mayBeEmpty`. The existing `rovereto` source is really the library
        agenda on the same install; rename its label some day.
      - buonconsiglio (Events Manager `/events.ics`): 12; its
        Adulti/Famiglie categories feed the kids tag.
      - trentinospettacoli (schema.org microdata on the listing): 97, no
        descriptions.
      - tebe (apstebe.org, Teatro comunale di Bedollo; static HTML of a
        Next.js page): 8. Confirmed by the owner as the association they meant.
      Skipped, with reasons in docs/EVENTS.md: visittrentino.info (paging and
      iCal disallowed by robots), muse.it, fondazionemcr.it,
      centrosantachiara.it, artesella.it, museion.it, eventi.unitn.it
      (empty RSS), fablab.unitn.it (Eventbrite), small ceramics studios (no
      feed, or Wix, or robots 500). Facebook and Instagram are never scraped
      (ToS and robots); the alternatives are organisers' own feeds or a manual "add event".
- [x] **Filter modal on /events** [sonnet] — done 2026-09-29. Category and
      city chips and "Show hidden" moved into a bottom sheet
      (`src/projects/events/FilterSheet.tsx`). Page shows only the "Filters · N"
      button plus removable pills. ★ per category sets favourites (the old edit
      mode is gone). New shared **`src/components/Sheet.tsx`**, the repo's
      first modal: native `<dialog>`, bottom sheet on phones, centred from
      `sm:`, closes on Esc, backdrop or ✕, safe-area padded. Reuse it for any future modal.
      Verified in headless Chrome at 390 px.
- [ ] **Coverage plan: rings around the owner** [orchestrator, decided
      2026-09-29] — not "all of Italy" (no national source exists, and
      the upkeep isn't worth it). The owner leaves from Trento or Rovereto, by train or car.
      Three rings:
      - **Full** (about an hour; every category): Trento, Rovereto, Riva/Arco,
        Bolzano, Verona (all already covered), plus Lake Garda Veneto
        (Malcesine, Bardolino, Lazise), Merano, Bressanone.
      - **Interests only** (1–1.5 h; creative, theatre, boardgames, festivals, nerd):
        Vicenza, Brescia, Bassano del Grappa, Mantova, Padova.
      - **Spot** (big, specific events only; a hand-curated list is fine):
        Bologna, Torino, Milano, Modena (Play), Lucca (Comics & Games).
      **Progress 2026-09-29 (session stopped at the limit; resume here):**
      - Step 3 DONE: `scripts/events/spot.json` + `adapters/spot.ts`. It has 8
        hand-verified entries: Lucca C&G, Artissima, Portici di Carta, Combo
        (Milano, first board-game fest), SPIEL Essen, Arte Fiera, Fa' la cosa
        giusta, and Play (moved to **Bologna**, 23–25 Apr 2027). Milan Games Week and Miart
        were left out because their sites bot-block us, so their dates are unverified.
      - Step 1 DONE: census notes per town in **`docs/EVENTS_CENSUS.md`**
        (endpoints, robots lines, counts, verdicts). Only the optional
        board-game/nerd associations check was not done.
      - Step 2 PARTLY DONE: `area` + `ring` on every event
        (`scripts/events/areas.ts`), ring-2 interest filter in the pipeline,
        and the Area section in FilterSheet with a Spot badge. Sources added and verified:
        bolzano widened to Merano and Bressanone (ODH, 650 events), `gardaveneto` (71),
        `padova` Comune JSON:API (near, 103), `tcvi` Teatro Comunale Vicenza
        (near, 84).
      - [x] Ring-2 sources, done 2026-09-30 [opus], not yet committed.
        Municipium factory registered and verified; new adapters `ctb.ts`,
        `teatrogrande.ts`, `arteven.ts`, `stabileveneto.ts`, `teatrosociale.ts`.
        Full crawl: 26 sources all ok, 2,187 events after dedup, 125 requests,
        213 s. Published (after 180-day window + ring-2 interest filter):
        mantova 19 (of 57), brescia 14 (of 19), teatrosociale-mantova 15,
        ctb 29, teatrogrande 29, arteven 81 (21 merged with tcvi),
        stabileveneto 33 (Padova). Crawler gained `ctx.postJson`, one retry on
        dropped connections, shared `titleCase`. Area filter checked at 390px
        (Veneto 270, Lombardia 106, Spot badge intact). Details in
        docs/EVENTS.md and docs/EVENTS_CENSUS.md.
        Unverified: Stabile del Veneto images, Teatro Grande kids rule on live
        data; some family shows may slip past the keyword kids tag.
        Follow-ups [sonnet]: per-night dates for CTB/Stabile from detail pages;
        Garda/Peschiera as Municipium config lines only if garda-veneto
        misses things; Operaestate in spot.json next summer. Deferred:
        Comune di Vicenza OpenCity (21 MB per 30 days).
      - [x] **Rovereto: Zandonai + Filarmonica** [opus], done 2026-09-30, not
        committed. `zandonai` was never misconfigured: the theatre's own site
        lists 1 show too. Last season's whole prose/dance programme went up in
        one batch on 2025-10-07, so it arrives by itself in early/mid October.
        Improved: venue set, caps title-cased, "ANNULLATO" dropped, kids tag
        for "Festival dei piccoli". New source `filarmonica-rovereto`
        (`adapters/filarmonica.ts`: RSS + WP REST + per-event iCal, max 40 iCal
        + 8 venue pages per run; 5 events now). New dedup passes in
        `pipeline.ts`: natural-case title wins, and subtitled copies merge
        (same start + town, one title starts with the other). Full crawl:
        27 sources ok, 2,201 events, 133 requests, 225 s.
        Unverified: the fill-in path on a real season's volume; a Filarmonica
        concert at the Zandonai merging with the `zandonai` record; the iCal
        4 h end-time guess.
      - [ ] **Watch after ~10 Oct 2026** [orchestrator]: the Zandonai season
        (~40 shows) and the Filarmonica season arrive, and
        `filarmonica-rovereto` stays under its 60-request cap.
      - [ ] Tag follow-ups [sonnet, XS]: `fantasy` in `nerd` fires on music
        (limit to title/summary); Zandonai opera ("Progetto Opera") lands in
        `concerts`; `titleCase` should keep "ci/vi/ne" lowercase; check
        "Apprendista Musicista" target age for the kids tag.
      Next steps, in order:
      1. [opus, research only, no code] Source census for the new ring-1 and
         ring-2 towns: do they have an allowed structured calendar? Check
         OpenPA/OpenCity (`/opendata/api/calendar` allowed?), iCal, WP
         events plugins, regional open data (Veneto, Lombardia, Alto Adige
         ODH already in use for Bolzano: widen its filter to Merano and
         Bressanone?). Output: a table town → source → verdict.
      2. [opus] `ring` field on events (or a region/area field), the page's "Area"
         filter replacing the long city list, ring-2 sources filtered to
         interest categories at crawl time.
      3. [sonnet] Spot events: `scripts/events/spot.json`, hand-curated
         (title, dates, city, url, tags), merged by the crawler.
      4. Parked: first-visit onboarding / personas, `sources.json` +
         "test this source" tool, national topic calendars (running,
         conventions). Revisit only if the owner shares the page more widely.
- [ ] Events tagging/source follow-ups [sonnet, each XS–S]: images for
      cultura-trentino (capped object reads, like bibcom); Trentino Spettacoli
      descriptions via detail-page JSON-LD for the next 30 days (the Ludimus
      pattern); creative recall is limited by the sources, so check Spazio
      Piera and Hortus Artieri for feeds; "Halloween al Castello"
      (a family Halloween at the castle, Bondone) is tagged creative but not kids, a known miss.
- [x] Events page polish [sonnet, XS] — done 2026-09-30: sparse folded series (occurrences/span < 0.5, threshold in `isSparseSeries`) leave "Open now" and are listed under an estimated next date ("N dates · next ≈ ven 2 ott"; events.json has no per-date data, exact dates would need a schema change); 80px thumbnail in the collapsed card, big image only when expanded; day headings capitalise only the first letter ("Mer 30 set"). Verified at 390px light+dark. Original: folded
      series (`occurrences > 1`, e.g. weekly game nights) show in "Open
      now" next to real exhibitions; consider listing them per next date
      instead. Full-width 16:9 images make the list long on iPhone, so
      consider a thumbnail layout. `capitalize` on the day headings also
      capitalizes month names ("Mer 30 Set").
- [ ] Crawler follow-ups [sonnet, each XS–S]: images for bibcom,
      trentogiovani and Verona (capped extra object reads); fuzzier dedup
      (e.g. "Pietre di pane" on mart and comune-trento); more keywords
      per category; shorter horizon for Verona if its roughly 30 MB per run is too heavy;
      a visitrovereto source if it ever exposes a feed.
- [ ] **Events improvement queue** (owner, 2026-09-30, all wanted; do ONE at a
      time, in this order). Save/Hide/Share on the collapsed card is done.
      1. [x] DONE 2026-09-30 (tags `social-friend` 199, `social-girl` 164, `solo-ok` 1,108 of 2,081; Come section in the filter sheet, OR between the social chips, AND for solo-ok) — Tagging: cluster "other" (536 of 2,199) and pick
         categories with the owner; new tags `social-friend` ("Nuovi amici"),
         `social-girl` ("Conoscere ragazze", a format proxy, never a claim
         about who attends) and `solo-ok` ("Da solo va bene", must exclude
         family/couple/booking events); fix `fantasy`/opera/titleCase. Then a
         "Come" section in FilterSheet [sonnet].
      2. [x] DONE 2026-09-30 (date chips, search, collapsible sheet, city checklist, remembered filters in `dashboard:events-filters`; caveat: a remembered "Oggi" chip survives across days, consider not persisting the date chip) — Filter and search UX, one pass over `FilterSheet.tsx` /
         `Events.tsx` (before the "Come" section, so that lands on the new
         structure): quick date chips (Oggi / Domani / Weekend) and a text
         search above the list; in the sheet a live "Show N events" button,
         a Reset always visible, collapsible sections with a summary
         ("Area · 2"), zero-count chips last, the last selection remembered
         per device (guarded localStorage); the cities list becomes a
         checklist with a search box (chips stay for Area/Category/Come:
         native `<select multiple>` is worse on iPhone).
      3. [sonnet] "New since last visit" badge (last-visit timestamp in
         guarded localStorage or Dexie).
      4. [sonnet] Group repeats with the same title across records into one
         expandable row ("17 serate, next ≈ …"); optional venue filter.
      5. [sonnet] Sorting inside a day: ring proximity, then favourite
         categories; Saved view by date, past last.
      6. [sonnet] Travel time from Trento/Rovereto per city (from rings).
      7. [x] DONE 2026-09-30 (`ics.ts`, "📅 Calendar" in the expanded card, TZID Europe/Rome; iOS share-sheet path and a real Apple/Google Calendar import unverified) — Export an event as .ics.
      8. [x] DONE 2026-10-01, not committed: saved/hidden (`eventMarks`) and favourite
         categories (`eventPrefs`) sync, owner-only. `src/lib/eventMarksSync.ts`,
         `src/projects/events/marks.ts`, Dexie v15 (queues existing marks once).
         **Owner must apply `supabase/migrations/20261001130000_event_marks.sql`
         BEFORE shipping the client, then `npm run db:types`.** Known gap: an
         un-save is a hard delete, so an offline device pushing an older save
         later brings it back. Marks of past events are auto-deleted (`pruneEventMarks`, local + server). /events SyncCard shows only the custom-events engine.
      9. [sonnet] Saved/favourite events in the Sunday Life plan.
      10. [opus] Spot pass (after the categories/food builder finishes; owner
         OK'd 2026-09-30): hand-verified `spot.json` entries for Festa della
         Castagna, Castione di Brentonico (18 Oct 2026, from visitrovereto.it)
         and other autumn festivals around Rovereto/Vallagarina; more
         interesting big events for Bologna, Torino, Milano, plus Ferrara
         (spot ring, roughly 2.5-3 h, distance not verified); check whether
         Milan Games Week / Miart dates can be verified. Then try a
         visitrovereto.it adapter (WordPress, no feed; robots + structure
         first, skip if only fragile markup is left).
      Parked: map view (only events with a venue), price/free filter (needs a
      crawler field per source), real `organizer` field.
- [ ] Later: more categories, one at a time (SAT/hikes, climbing,
      art/ceramics, the owner's Sunday sources: ViviRovereto, Visit
      Rovereto, Roveretogiovani).

## Full audit (2026-10-07: opus security/sync, sonnet quality, haiku docs)

Baseline: `npm run check` green (464 tests), `npm run build` green. Findings
verified by reading code; C1 re-verified by the orchestrator. Ranked; do in
order. Tag = who implements. `db push` stays orchestrator-only.

### Critical / High (data loss, security)

- [x] **C1 Pull deletes local rows once a table passes 1000 rows** [opus, S] — done 2026-10-08: `selectAll()` pages every table (`.order('id').range()`), any page error aborts the pull; 4 engine tests + fake supabase honours order/range/maxRows. Original:
      `cloudSync.ts` `pull()` selects with no `.range()`/order; PostgREST caps
      at `max_rows = 1000` and `bulkDelete` then removes every local id the
      server "didn't return". Hits `habit_checks` (~1800/yr), `life_entries`,
      `meal_entries` (~1000 in 200 days) first. Fix: page each table with
      `.order('id').range(i, i+999)` until a short page; abort pull on any page
      error; test with >1000 rows. Do this first.
- [x] **C1b Pull paging by offset can skip a row if another row is deleted between pages** [sonnet, XS] — switch `selectAll` to keyset paging (`.gt('id', lastId).order('id').limit(1000)`) + a test that deletes a row between pages; also make `flush()` use `sessionUserId()` and drop `signedIn()`. Low risk: a skipped row is re-pulled next time.
      → done 2026-10-08: keyset paging (`.gt(id).order.limit`), flush uses `sessionUserId()`.
- [x] **H1 Shop-area guests can read `shop_areas.share_token`** [opus, M] —
      → done 2026-10-08: `shop_area_tokens` owner-only table, RPCs rewritten, column dropped; migration `20261008100000_area_tokens.sql` pushed. Owner reads the token via `area_share_token`; areas created after have no link until first Share/Reset.
      column-level revoke is ineffective while table SELECT is granted, and
      realtime broadcasts the full row. A guest can re-share the invite.
      Fix: move token to an owner-only table (like `project_invites`).
      First confirm on the hosted project. Needs migration + `db push`.
- [x] **H2 Same habit checked offline on two devices → stuck error + duplicates** [opus, S] —
      → done 2026-10-08: deterministic UUIDv5 ids (`uuidV5.ts`), `uniqueViolationIsDone` + `afterPull` engine options, `dedupeChecks()`.
      random uuid vs `unique (habit_id, day)` → 23505 dead-letter, then
      duplicate local rows. Fix: deterministic id from habitId+day; treat 23505
      as already done.
- [x] **H3 Offline, the owner is treated as a guest** [sonnet, S] —
      → done 2026-10-08: `ownerCache.ts` + `useOwner.ts` (cache per user id, never on error). Not exercised offline in a browser.
      `useOwner.ts` `Boolean(null)`; Life/Meal/Sharing tiles vanish offline.
      Fix: cache last `is_owner` per user id in `safeStorage`, use on error.
      Violates local-first.

### Medium

- [x] **M1 Removing a guest from a shop area doesn't rotate the area token** [sonnet, S] —
      → done 2026-10-08: `revoke_area_guest` RPC per area.
      `Sharing.tsx` `toggleArea`/`revokeAllShop` delete rows directly; call
      `revoke_area_guest` RPC instead.
- [x] **M2 Removed guests can still sign in and rejoin** [opus, S] — join RPCs
      → done 2026-10-08: join RPCs require an `allowed_emails` row; pushed (`20261008110000`).
      (`join_project`, `join_area`) don't require an `allowed_emails` row.
- [x] **M3 Sign-out mid-pull can wipe local data** [opus, XS] — done 2026-10-08 together with C1 (`sessionUserId()` re-checked after the selects). Original: re-check
      session user id after the selects, abort if changed.
- [x] **M4 Sign-out leaves owner-only data readable on device** [opus, S] —
      → done 2026-10-08: `privateData.ts` + SyncCard offer after sign-out (manual, warns on unsynced).
      offer "remove private data from this device" (warn on unsynced outbox).
- [x] **M5 Unhandled rejections in fire-and-forget handlers** [sonnet, S] —
      → done 2026-10-08: `runSafe.ts` + `ErrorFlash` toast applied to the listed handlers.
      `void fn()` without catch: `Sharing.tsx` 400-524, `Settings.tsx` (incl.
      destructive `wipeLocal`), `Habits.tsx`, `Home.tsx:216`, life/week/*,
      `JoinProject.tsx:161`. Add a shared `runSafe()` helper → Snackbar error.
- [x] **M6 Test gaps on risky code** — [opus, M] `db.ts` upgrade-path tests
      → partly done 2026-10-08: db upgrade-path tests (v2/v4/v14), tests for todo/climb/shop/life sync, projectInvites, format, safeStorage, habit, uuidV5, privateData. Still no tests for Sharing actions (needs mocked supabase) [opus, M] and component-level tests.
      (fake-indexeddb); [opus, M] Sharing actions with mocked supabase;
      [sonnet, S] `dates.ts`, `projectInvites.ts`, `shopSync.ts`, `lifeSync.ts`,
      pure logic of climbing grades / habit streaks. Zero-test projects:
      sharing, shop-list, trips, links, climbing, habits, todo, home, settings.
- [x] **M7 Duplicated share/copy logic** [sonnet, S] — move
      → done 2026-10-08 except `shop-list/AreaManager.tsx` (two copies of share/clipboard left): new small [sonnet] task below.
      `projectInvites.shareOrCopy` to `lib/share.ts`; replace the copies in
      `AreaManager.tsx` (swallows errors), `LocalTransfer.tsx`, `EventCard.tsx`,
      `events/ics.ts`, `life/week/ExportSection.tsx`.
- [x] **M8 Split oversized files** [sonnet, M each] — `Sharing.tsx` (530, one
      → done 2026-10-08 for Sharing, Events, Links, Trips, MealDiary, `events/custom.ts` (towns split). Not split: `events/model.ts`, `db.ts` (no clean seam).
      component), `Events.tsx` (535), `Links.tsx`, `Trips.tsx`, `MealDiary.tsx`,
      `db.ts` (776: row types vs schema versions), `events/custom.ts`.
- [x] **M9 Contrast: ~138 `text-slate-400`** [sonnet, S] — fails AA for
      → done 2026-10-08: ~25 weak `text-slate-400` fixed (the rest were already 500/dark:400), bar legends, grade label no longer clips. SVG axis labels in NutritionTrends have no dark variant (open, XS).
      informative text; bump to slate-500/600. Add legend text to colour-only
      bars (`NutritionTrends.tsx:150`, `Climbing.tsx:181`).

- [ ] **M7b AreaManager still has its own share/clipboard code** [sonnet, XS] — use `lib/share.ts` (`shareOrCopy`); the current `.catch(() => {})` swallows failed shares.
- [ ] **F1 Follow-ups from the 2026-10-08 fixes** [sonnet, S] — SyncCard render test (no React test setup yet); "Remove private data" entry in Settings while signed out; show the new "not invited any more" error clearly in JoinArea/JoinProject; reword the `cloudSync.ts` `share_token` comment; `docs/NEW_PROJECT.md` mention `uniqueViolationIsDone` / `afterPull`.
- [ ] **F2 Verify on the hosted project** [orchestrator] — as a guest: `select share_token from shop_areas` fails, `shop_area_tokens` returns 0 rows; an old `#/join/<token>` link still resolves; phone check offline (owner tiles stay, habit toggles sync). L9 stays open (typing the two `any` in `cloudSync.ts` breaks ~18 `TableSync` declarations because Dexie `Table` is invariant).

### Low

- [x] **L1 Un-retryable errors retried 8×** [sonnet, XS] — classify 22xxx and
      → done 2026-10-08.
      42703/PGRST204 as poison (`cloudSync.ts:158`).
- [x] **L2 Realtime handler doesn't take the engine lock** [opus, XS].
      → done 2026-10-08.
- [x] **L3 Guest's first sign-in pushes pre-sign-in local rows into the
      → done 2026-10-08: documented in ARCHITECTURE "Known behaviours".
      owner's shared table** [haiku, XS] — document, or confirm before push.
- [x] **L4 Date columns lack format check** [sonnet, XS] — `climb_sessions.date`,
      → done 2026-10-08 (pushed).
      `climbs.date`, `habit_checks.day`; `NOT VALID` regex, new migration.
- [x] **L5 `jwt_email()` search_path not pinned** [haiku, XS] — new migration.
      → done 2026-10-08 (pushed).
- [x] **L6 `join_area` adds owner as member; stale `db.ts:744` comment** [haiku, XS].
      → done 2026-10-08 (db.ts comment + join_area owner skip).
- [x] **L7 Bundle: `Card-*.js` 359 KB is supabase+dexie vendor chunk** [sonnet, S] —
      → done 2026-10-08: `vendor-supabase` 204 KB + `vendor-dexie` 104 KB; lazy supabase import not done.
      `manualChunks` for supabase/dexie; lazy supabase import [opus, M] optional.
- [x] **L8 Date formatting duplicated** (`toLocaleDateString('it-IT')` in
      → done 2026-10-08.
      Climbing/SessionCard/Events) [haiku, XS] → helper in `lib/dates.ts`.
- [ ] **L9 `cloudSync.ts:48,66` `no-explicit-any`** [opus, S, optional].
- [ ] **L10 Spot-checks** [haiku, XS] — empty/loading states in `LifeImport`,
      `TrackersSection`; `w-8` grade label clipping; try `npx knip` for dead exports.
- [x] **L11 Docs hygiene** [haiku, XS] — README (19 lines) lacks Supabase
      → mostly done 2026-10-08: README + scripts table + NEW_PROJECT placeholder; `.claude/` tracking is still an owner decision.
      setup + events crawler; document `format`, `preview`, `prepare`,
      `life:*`, `db:types`; `.claude/` is git-ignored (agents/commands exist
      only on the owner's Mac): decide whether to track `.claude/agents` and
      `.claude/commands` so a fresh clone works (owner decision).

Done in this audit: `docs/ARCHITECTURE.md` brought in sync (meal-diary,
`projectInvites`, `trip_*`/`habit_checks` tables, owner-only list, db-push policy).

## Full audit, round 2 (2026-10-08: events crawler + CI, Life, config/deps)

Opus audited the crawler/CI and Life, Haiku the config and dependencies. Not
yet fixed; ranked. One Opus finding was **rejected as a false positive**: Life
sync already ignores stale updates (`ignore_stale_update` triggers on
`life_weeks`/`life_entries`, migration `20260930160000_sync_hardening.sql:73-78`).

### Crawler / CI

- [x] **E1 Good events lost for good when the previous file can't be fetched** [opus, S] —
      → done 2026-10-08: `scripts/events/previous.ts` (3 tries with backoff, 404 = first run), exit 1 without writing when the previous file is unreadable and a source has nothing to fall back on, or the total falls under 50% (`EVENTS_FORCE=1` / workflow `force` input overrides); `_site.yml` gate rejects invalid or 0-event files. E2 can reuse `unprotectedSources`.
      `crawl.ts` `loadPrevious` is one 20 s fetch, null on any error; a failing
      source then publishes 0 events and the next run accepts 0 (`prevCount` 0).
      Only gate is `test -s` (`_site.yml:67`). Fix: retry `loadPrevious`; exit 1
      (no deploy) when no previous file AND a non-`mayBeEmpty` source failed;
      refuse to publish below ~50% of the previous total unless `EVENTS_FORCE=1`.
- [x] **E2 A broken source can publish 0 and look healthy** [sonnet S + opus S] —
      → done 2026-10-08: markup checks throw in tcvi/padova/muse/filarmonica; `zeroSince`/`lastNonZero` in source status and a `suspiciousZeros` warning for sources that drop from >=5 events to 0.
      ~18 adapters are `mayBeEmpty`; `tcvi.ts:99`/`padova.ts:135` claim a markup
      throw that doesn't exist; `muse.ts:153` and `filarmonica.ts:142` return
      `[]` on a bad response. Add markup checks like `teatrogrande.ts:77` [sonnet];
      health warning when an ok source drops from >=5 events to 0 (persist
      `zeroSince`) [opus].
- [x] **E3 Dedup merges different showings on the same day** [opus, S] —
      → done 2026-10-08: timed events dedupe on title + exact start + city; an all-day record joins a timed one only when that day has exactly one showing. Follow-up: compare event counts after the next crawl (showings that used to merge are now separate).
      key = title + date + city (`pipeline.ts:148`); 17:00 and 21:00 collapse.
      Key timed events on the instant, keep the day key for all-day; add test.
- [x] **E4 Offset-less times depend on the runner's time zone** [sonnet, XS] —
      → done 2026-10-08: offset-less times read as Europe/Rome via `localToIso`; tests pass under TZ=UTC and TZ=Europe/Rome.
      `time.ts:86` `normalizeIso` uses `Date.parse` (UTC in CI, 2 h shift) for
      openpa, trentinospettacoli, padova. Use `localToIso`; set `TZ` in the script; test.
- [ ] **E5 Deploy job holds Pages-write for the whole job** [opus, S] — split
      build (`contents: read`) from deploy; pin actions by SHA; Dependabot is on.
- [x] **E6 One bad carried-over record blocks every crawl** [sonnet, S] —
      → done 2026-10-08: `validPreviousEvents()` drops bad carried-over records with one warning.
      previous records aren't schema-checked (`schemas.ts:33`); a record without
      a title throws in `dedup` outside the per-source try. Validate and drop.
- [x] **E7 Degraded crawls are silent** [sonnet, S] — more than 1/3 sources failing
      → done 2026-10-08: `health` job in `crawl.yml` keeps one open issue "Events crawl needs attention" (needs Issues enabled on the repo; if not, that job goes red after the deploy, nothing else breaks). Per-job permissions.
      only prints `::error::`; open an issue or fail a separate step; also on
      sources stale for over 7 days.
- [ ] **E8 Hardening, low** [sonnet, S each] — response size cap (~5 MB) in
      → PARTLY done 2026-10-08: 5 MB body cap, refusal of non-http(s) and private/loopback/link-local hosts on every redirect hop (literal host only, no DNS), `absUrl` on url/image. Still open: client-side `model.ts:140` / `Events.tsx:80` (drop malformed events, never replace the offline cache with an empty file) [sonnet, S].
      `http.ts`; block private/link-local redirect targets and non-https in
      fetched URLs (`ogimage.ts:99`, filarmonica, muse); `absUrl` on url/image
      in `toEvents` (`pipeline.ts:132`); client: drop malformed events and don't
      overwrite the offline cache with an empty file (`model.ts:140`,
      `Events.tsx:80`).
- [ ] **E9 Small** [haiku, XS] — retry image fetch network errors next run
      → PARTLY done 2026-10-08: image network errors retried next run, `timeout-minutes: 30`, spot.json unique ids + known categories. Still open: warn when the reused `events.json` is over 3 days old [haiku, XS].
      (`ogimage.ts:107`); `timeout-minutes: 30` on workflows; warn when reused
      `events.json` is over 3 days old; `spot.json` unique ids + known categories
      (`pipeline.ts:101`, `spot.ts:39`).
- [ ] **E10 Adapter tests** [sonnet, M] — fixtures for openpa, filarmonica,
      arteven, padova, `adapters/ical.ts` (only muse/trentinospettacoli tested).

### Life

- [x] **LF1 Import link leaves the whole plan in browser history** [sonnet, XS] —
      → done 2026-10-08: `?d=` stripped with a replace navigation after decoding, save uses replace, 200 KB input cap, `settimana.md` says to use a non-syncing browser or paste. Limit: a syncing browser may have recorded the URL at first load, so the settimana instruction is the real protection.
      `LifeImport.tsx:27-54` reads `?d=` and never strips it; `/settimana` opens
      it in the default browser, and a syncing browser carries the plan off the
      Mac, against the owner's rule. Strip with `replace: true` after decoding;
      `settimana.md`: use a non-syncing browser or a paste-only fallback.
- [x] **LF2 Stale day after midnight** [sonnet, S] — `weekKey()`, tracker
      → done 2026-10-08: `useToday()` (visibility/focus + midnight timer).
      `today`, `isMonday` computed at render only; an app left open overnight
      logs onto yesterday. `useToday()` hook (visibility + midnight timer).
- [x] **LF3 Re-import hides logged history silently** [sonnet, S] — warn "N
      → done 2026-10-08: preview lists "N logged entries will be hidden" per removed tracker.
      logged entries will be hidden" per removed tracker id in the preview.
- [x] **LF4 History chart misreads future/missing weeks** [sonnet, S] —
      → done 2026-10-08: `chartPoints.ts` (weeks <= current, x by elapsed weeks).
      `ProgressChart.tsx:38-60`: filter `week <= current`, x by weeks elapsed.
- [ ] **LF5 Sunday answers can't be given late** [opus, S] — previous week is
      read-only; allow Sunday/check-in edits until exported or Tuesday.
- [x] **LF6 Parsing/export robustness** [sonnet, XS] — triple backticks in text
      → done 2026-10-08: longer export fence + robust parser, control characters rejected, over-cap arrays short-circuit, 200 KB input cap.
      break the export fence/status script (`export.ts:152`,
      `life-things-status.ts:51`; use a longer fence); over-cap arrays still map
      every item (`validate.ts:218`, freeze); cap input before `JSON.parse`.
- [x] **LF7 Small** [haiku, XS] — Share button hands the food-included week to
      → done 2026-10-08.
      any share target (warn or remove, `ExportSection.tsx:46`); unknown
      `meal` value gives a NaN sort (`meals.ts:33`).
- [ ] **LF8 Life tests** [sonnet, S] — export round-trip incl. backticks,
      `life-things-*` matchers (extract pure fns), `ProgressChart` point
      builder, midnight rollover.

### Dependencies / config

- [x] **D1 `npm audit`: 9 vulns (8 high)** [sonnet, XS] — transitive build-time
      → done 2026-10-08: `npm update` + `npm audit fix` (0 vulnerabilities, 960 KiB precache, 557 tests). `oxlint` is pinned to 1.72.0: 1.87 adds React-compiler rules (`set-state-in-effect`, `purity`) that fail in ~15 existing places (see D4).
      (postcss, source-map-js, browserslist, nanoid, brace-expansion, fast-uri)
      plus `react-router-dom` (RSC-mode CSRF; this SPA doesn't use RSC mode).
      `npm audit fix` + `npm outdated` bumps (supabase-js 2.117, react 19.3,
      vite 8.3, dexie 4.4.6); run check/build; no majors (ts 7, pwa 2).
- [ ] **D4 Adopt the newer oxlint React rules** [sonnet, M] — bump oxlint past 1.72 and fix the ~15 `react/set-state-in-effect` and `react/purity` (Date during render) findings in UpdateToast, useOwner, InstallHint, LifeEditor, JoinProject, LocalTransfer, AreaManager, Sharing, Events, TrackersSection, MealDiary, useSections, Habits, TrackerRow; then unpin. Combine with LF2 (`useToday()`), which removes several `Date` calls from render.
- [ ] **D2 Hosted Supabase settings unverified** [orchestrator/owner] —
      `config.toml` is local only (`config push` is forbidden). In the
      dashboard check: OTP expiry (local 3600 s; 600 s is tighter), email rate
      limit, signup + whitelist trigger live, MFA for the owner account,
      `additional_redirect_urls` localhost entries.
- [x] **D3 PWA polish** [haiku, XS] — add apple-touch-icon to the manifest,
      → done 2026-10-08 except a dedicated maskable icon (needs a designed asset): apple-touch-icon in the manifest, `engines` node >=22, `.nvmrc`.
      a dedicated maskable icon, `engines`/`.nvmrc` (CI uses Node 22, Mac 24).

## Adaptive layout: phone / iPad / Mac (analysis 2026-10-08)

Analysis only, nothing built. Rule of thumb: **capture on the phone stays
simple; planning and reading on iPad/Mac earns complexity.**

State today: every page lives in one centred column (`max-w-3xl`, 768 px) on
every device; only five `sm:` breakpoints exist (Home 2-col grid, Sheet turns
from bottom sheet to centred panel); no `md`/`lg`/`xl`; keyboard handling in 4
files; no hover/pointer-specific styling. On a Mac window or iPad landscape
(1180 px+) that is a narrow strip with dead space, and every project is a
round trip through Home.

Principles: layout driven by **width, not device** (iPad Stage Manager and Mac
windows resize; breakpoints md 768 / lg 1024 / xl 1280, container queries for
components); one component adapts, no per-device forks; `hover: hover` /
`pointer: fine` for hover and shortcuts; touch targets stay 40 px; local-first
and offline unaffected; test at 375 / 820 / 1180 / 1440 px. Layout prefs
(sidebar collapsed, view mode) persist per device like `dashboard:home-order`.

### Worth it, in order of value per effort

- [ ] **UI1 App shell** [sonnet, M] — from `lg`: persistent left sidebar
      (starred projects first, then the rest, plus sync/online status), wider
      content area; below `lg` the current header. Per-page max width: read /
      capture pages (todo, shop-list, habits, climbing) stay narrow; dense
      pages (events, life, meal-diary, sharing) use the full width. Phone: a
      bottom tab bar with the starred projects so you stop going via Home
      (decide with the owner). Benefits every project at once.
- [ ] **UI2 Events master-detail** [sonnet, M-L] — the densest, most-used
      list. `lg`+: filters as a permanent left rail (no sheet), list in the
      middle, selected event detail (image, map link, add-to-calendar, marks)
      on the right; optional week/month grid view. Phone: unchanged (list +
      filter sheet). Reuse `EventsList`/`FilterSheet` content.
- [ ] **UI3 Life week dashboard** [sonnet, M] — the owner's weekly ritual and
      the richest data. `lg`+: 2-3 columns (focus + trackers | tasks + check-ins
      | recap + History chart with hover readout); import screen shows plan
      JSON and preview side by side. Phone stays one column (daily taps).
- [ ] **UI4 Home "Today" panel** [sonnet, M] — a live summary above the grid:
      habits due, next events, Life focus of the day (owner only), pending
      sync state; from `lg` the project grid goes to 3-4 columns. Pure Dexie
      reads, works offline.
- [ ] **UI5 Mac pointer + keyboard** [sonnet, M] — `⌘K` jump to project /
      search events, `/` focus search, `n` new item, `j`/`k` list navigation,
      `Esc` closes (native `<dialog>` already does), hover affordances behind
      `hover: hover`; drag-and-drop files onto Local Transfer; shift-click
      multi-select in Events; drag to reorder Life tasks.
- [ ] **UI6 Cheap grids** [sonnet, S] — Links, Trips, Book/Boardgame ideas:
      `grid-cols-2/3` on `md`/`lg`; Sharing: guests | projects two columns;
      Meal diary: day list beside the trends chart.

### Not worth it

shop-list, todo, habits, climbing logging and local-transfer are used one-
handed on the phone, in a shop or at a crag: keep them single-column with big
targets; at most centre them in the wider shell. No per-device code paths, no
iPad-only gestures, no separate "desktop app".

### Device view

- **Phone:** capture and check, one hand, bottom sheets, FAB, safe areas.
  Only change worth making: bottom tab bar (UI1).
- **iPad:** portrait ≈ phone with more width (2-col grids), landscape = the
  Mac layout. Keep 40 px touch targets because it is often touch-only; allow
  Stage Manager window resizing (width-driven layout covers it).
- **Mac:** installed from Safari (Add to Dock) or a browser tab; sidebar,
  master-detail, keyboard, hover, drag and drop. Highest ceiling, lowest risk
  to phone use because it sits behind `lg:`.

Risk: more states to test and no React component-test setup exists. Add a
Playwright/screenshot smoke at the four widths with UI1, or verify manually
with the browser tooling. Order: UI1 -> UI2 -> UI4 -> UI3 -> UI5 -> UI6.
Needs an owner answer first: which devices do you really use for Events
and Life (desk Mac, iPad on the sofa)? That decides UI2/UI3 priority.

## Engineering quality (audit 2026-07-05)

Not new features — gaps found while auditing the current codebase against
what's already shipped. Ranked by how cheap + how load-bearing.

> **Parked — not being worked on right now.** Logged so the findings aren't
> lost, not dispatched to any builder. Pick items up explicitly when ready.

- [x] **Stale "local-only" copy on todo/habits** [sonnet] — already done (found 2026-10-05): no such copy left in `src/lib/projects.ts`. Original: — `src/lib/projects.ts`
      still describes `todo` as "Local-only on this device for now" and
      `habits` as "Local-only on this device," but both have synced via the
      generic engine since 2026-07-04 (Projects 5/6, `App.tsx` starts
      `startTodoSync()`/`startHabitSync()`). The home grid is telling users
      the wrong thing about their own data. Effort XS — one-line copy fix
      each, no code paths touched.
- [x] **No automated tests for `cloudSync.ts`** [opus] — already done (found 2026-10-05, roadmap was stale): `src/lib/cloudSync.test.ts` (406 lines, commit 312ad46) covers offline edits never dead-lettered, server-answered failures (RLS 42501, 500 dead at try 8, expired JWT), pull racing local writes, retryDead/discardDead, pull shield, nested transactions and realtime last-writer-wins. Original: — this one file is the
      shared engine behind every synced project, and its entire content is a
      list of manually-audited-and-fixed concurrency/data-loss bugs (dead-
      letter classification via `classify()`, last-writer-wins by
      `updatedAt`, the `running` reentrancy guard, ordered flush that stops
      on first transient failure). None of it has regression coverage — a
      future refactor could silently reintroduce the guest-sign-in-wipes-
      data bug this engine exists to prevent. Needs a test harness that can
      fake the Supabase client + Dexie (or run against a local Supabase);
      scope that decision to the brief. Effort M.
- [x] **CI never runs `npm run lint`** [sonnet] — done 2026-09-30 (step before build; the old warning in new-project.mjs does not fail it). Original: — `.github/workflows/*.yml`
      only runs `npm run build` (tsc + vite build); the `lint` script
      (`oxlint`) exists but nothing invokes it in CI, so lint regressions on
      `main` go unnoticed until someone runs it locally. Add a step (or fold
      into the existing build step) before `npm run build`. Effort XS.
- [x] **No top-level React error boundary** [sonnet] — done 2026-09-30: `ErrorBoundary.tsx` around the `<Outlet />` in `Layout.tsx` (header stays), Reload + Back to home, resets on route change; browser-verified at 375px, dark mode not eyeballed. Original: — no `ErrorBoundary`
      exists in `src/components/`. An uncaught render error in any one
      subproject page currently white-screens the whole PWA with no
      recovery affordance, worse on an installed home-screen app than a
      browser tab (no obvious "reload" chrome). Wrap the routed `<Layout />`
      content with a small boundary that shows an EmptyState-style fallback
      + a reload button. Effort S.
- [x] **No route-level code splitting — confirmed 617 KB single JS bundle**
      [sonnet] — done 2026-10-05: every page except Home is `React.lazy` in `App.tsx` (`page()` helper), `Suspense` + `SkeletonList` inside Layout's ErrorBoundary; PWA precaches all chunks so pages work offline. Entry chunk 796 → 259 KB; a shared ~359 KB vendor chunk (supabase/dexie, named `Card-*.js`) still loads up front, so the saving is the page code, not the libraries. Not eyeballed in a browser (offline cold load, chunk-failure fallback). Original: — `src/App.tsx` eagerly imports all nine project pages; a
      throwaway `npm run build` on 2026-07-05 shipped one
      `index-*.js` at 617 KB (176 KB gzip), and Vite's own build output
      flags it ("Some chunks are larger than 500 kB"). Every visitor
      downloads climbing, habits, book-ideas, etc. even if they only ever
      open shop-list. Fix: `React.lazy()` + `<Suspense>` per `<Route>` in
      `App.tsx`, one shared loading fallback (reuse `Skeleton`-style UI).
      Effort S–M.
- [ ] **Whitelist-rejection detection is a message-text regex** [sonnet] —
      `requestLoginCode` in `src/lib/sync.ts` detects "this email isn't
      invited" by matching `/database error/i` against the raw Supabase
      error message string. This is exactly the kind of check that breaks
      silently after a Supabase SDK/API wording change — the whitelist
      rejection would then fall through to a generic error and the nice
      "This email isn't invited to this dashboard" UX would quietly regress
      to something less clear. Prefer a structured check (error code/status,
      or a custom SQLSTATE raised by the trigger) over message matching.
      Effort XS–S.
      **Analysis 2026-10-05:** not fixable client-side with a real gain. GoTrue
      wraps any trigger exception in the same opaque "Database error saving new
      user" (HTTP 500, code `unexpected_failure`), so even a custom SQLSTATE in
      the whitelist trigger would not reach the client. Options: keep the regex
      (add a test that pins it) or move the check server-side (an RPC
      `is_email_invited(email)` called before `signInWithOtp`: needs a migration
      and exposes whitelist membership to anyone, so probably not worth it).
- [x] **`database.types.ts` regeneration is undocumented** [sonnet] — DONE
      2026-09-10 while adding `links`: `npm run db:types` added to
      package.json (writes to a temp file first, so a failed/offline run
      can't truncate the real one), and `docs/NEW_PROJECT.md` step 7 now
      documents it as an explicit owner step. The doc calls out the ordering
      trap the `links` build hit: the generator reads the **hosted** schema,
      so running it *before* `db push` silently deletes the new table's block
      and breaks `tsc`. Original finding follows.

      Original: the
      typed Supabase client (`src/lib/database.types.ts`, added in "ts:
      strict mode + typed supabase client") is currently up to date, but
      nothing in `docs/NEW_PROJECT.md`'s 7-step recipe, `package.json`
      scripts, or CI mentions regenerating it. The next new synced
      subproject can easily add a migration (step 5) and forget the types
      never got refreshed, since nothing points at that step or fails
      loudly if it's skipped. Add an `npm run db:types` script wrapping
      `npx supabase gen types typescript --linked > src/lib/database.types.ts`
      and reference it as an explicit step in `docs/NEW_PROJECT.md`. Effort
      XS.
- [x] **No automated dependency/security-update tooling** [sonnet] — done 2026-09-30 (`.github/dependabot.yml`, weekly npm + github-actions, limit 3; no `npm audit` step). Original: — no
      Dependabot or Renovate config exists in the repo, and CI never runs
      `npm audit`. `npm audit` is clean today (0 vulnerabilities, checked
      2026-07-05), but nothing keeps that true — a future CVE in
      `@supabase/supabase-js` or a transitive dep would go unnoticed until
      someone happens to run it locally. Add a `.github/dependabot.yml`
      (weekly, npm ecosystem) and/or an `npm audit --audit-level=high` CI
      step. Effort XS.
- [x] **Dead-lettered outbox entries have no recovery path except a full
      device wipe** [sonnet] — already done (found 2026-10-05): `SyncCard` has Retry/Discard buttons backed by `engine.retryDead()` / `discardDead()` (tested in `cloudSync.test.ts`). Original: — a permanently-rejected sync entry is (by
      design, see `cloudSync.ts`) never deleted, so it keeps shielding its
      local row from `pull()` forever — see `SyncCard`'s persistent "⚠️ N
      changes were rejected" line. Right now the *only* way to clear that
      state is Settings' nuclear "Wipe device data" (deletes every local
      table). If access is later restored (guest re-invited, RLS bug fixed)
      there's no way to retry or discard just the stuck entries — the row
      stays shielded indefinitely. Settings could list dead-lettered entries
      per project with per-entry "Discard" (drop the tombstone, let the next
      pull take the remote version) and/or "Retry" (clear `dead`, requeue).
      Effort S.
- [x] **No length limits on user-entered text** [sonnet] — already done (found 2026-10-05): per-field caps in the `*Sync.ts` add functions mirrored by `supabase/migrations/20260930160100_text_caps.sql`, inputs use `maxLength`, `src/lib/textCaps.test.ts` pins client/server parity. Original: — todo text, shop
      item names, book-idea/boardgame-idea title + notes, etc. have no
      `maxLength` on their inputs (checked all `src/projects/*` — the only
      `maxLength` in the codebase is the 6-digit OTP code field in
      `SyncCard.tsx`). A pathologically long paste can bloat an IndexedDB
      row, a synced Postgres row, and break list-row layout on mobile.
      Add a sane cap (e.g. 500-2000 chars depending on field) at the input
      level, mirrored as a `check` constraint in the matching migration so
      a client bypass can't blow past it server-side either. Effort XS–S
      per field; do it once as a shared pattern, not per project.

Low-confidence — flagged for completeness, not verified as real problems:

- [x] **`apple-touch-icon` uses the 192px icon, Apple recommends 180px**
      [sonnet] — done 2026-10-05: `public/icons/apple-touch-icon.png` (180px, downscaled from icon-512 with `sips`, fully opaque so iOS draws no black corners); the favicon still uses icon-192. Original: `index.html` links `icons/icon-192.png` for
      `apple-touch-icon`; iOS scales it down fine in practice, this is
      cosmetic at best. Only worth doing if a 180px asset is trivial to
      generate alongside the existing 192/512 set. Effort XS.
- [x] **Accessibility pass unverified** [sonnet] — static pass done 2026-10-05 (no screen reader or browser run): 10 fields without an accessible name got `aria-label` (placeholder is not a label: Sharing, SyncCard x2, Life import/check-in/focus/rules/Sunday questions/export), the two `✕` cancel buttons (ShopList, PeoplePicker) and the energy scale numbers got `aria-label`, the Local Transfer drop zone (`role=button`) now also opens on Space. Checked by script: no `<img>` without alt, no clickable div/span except that drop zone, no `outline-none` without a focus style. Still manual: real VoiceOver pass per screen, colour contrast, focus order in sheets. Original: 10 of 28 `.tsx` files use
      `aria-`/`role` attributes; that ratio alone doesn't establish a real
      gap (most files may not need any), so this isn't a confirmed finding.
      Would need an actual manual pass (keyboard-only nav, screen reader)
      per screen before treating it as a bug list. Effort to scope: S just
      to figure out if there's anything real here.

## Ideas / later

Candidate new subprojects (brainstormed 2026-07-04, not committed to):

- [ ] **💰 Expenses / shared budget** [opus] — couple-shared ledger with
      who-paid and running balance (mini Splitwise). Reuses the shop-list
      area-sharing + outbox pattern almost exactly. Effort L. *Top pick.*
- [x] **🍽️ Meal diary** [sonnet] — built 2026-10-05, owner-only and synced across the owner's devices (same model as Life: `is_owner()` RLS, `ownerOnly` in the registry). Log what you ate per day and meal (breakfast/lunch/dinner/snack), edit text, backdate, delete with Undo. Files: `src/projects/meal-diary/`, `src/lib/mealDiarySync.ts`, `supabase/migrations/20261005140000_meal_diary.sql`, hand-written `meal_entries` block in `database.types.ts`. Migration applied and types regenerated 2026-10-05. Optional per-entry grams, kcal, protein, carbs, fat (+ an `estimated` flag), day header shows totals only (no goals). **Simplified later the same day (owner: "entry super simple"):** no numeric fields, food table, Open Food Facts lookup or barcode scan (all removed); an entry is one line of text with the quantity ("100g pasta al pesto rosso"). Numbers come from the AI estimate, with or without photos, and can be corrected by hand when editing an entry. AI estimate without a server: the local command `/meal-reconcile` (`.claude/commands/`, git-ignored) reads entries with no nutrition via `supabase db query --linked`, estimates them in the session, asks for confirmation, then writes them back marked as estimates; SQL tested in a rolled-back transaction; it now also takes photos, merges with stored estimates as a diff + average and uses optimistic concurrency (`updated_at`). Life/settimana link (2026-10-05): read-only Food section on the Life week screen + `## Food` and `meals` in "Export week" (see `docs/HANDOFF-life.md`). Not a planner: no plans, recipes or shop-list link.
- [ ] **🍲 Meal planner + recipe box** [sonnet CRUD, opus for shop-list
      integration] — (the diary above covers logging only) plan the week, "add ingredients to shop list" button
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

- [ ] **🔍 On-device data view in Settings** [sonnet] — *to evaluate
      (2026-09-30)*. Owner asked how to see what's in the db; on Mac the
      Supabase Table Editor and Chrome DevTools (IndexedDB → `dashboard`)
      already cover it, so a generic row browser is NOT worth building. What
      might be: on the phone, where DevTools is awkward, a Settings section
      with the local row count per table, the pending outbox per project and
      the dead-lettered entries. Overlaps the parked "Dead-letter outbox
      entries have no recovery path" item (Engineering quality): do them
      together, with per-entry Retry/Discard. Decide after the per-project
      invite work lands. Effort S.

Infrastructure ideas:

- [ ] Export/import all local data as a backup file [sonnet]
- [ ] E2E encryption for synced files [opus]
