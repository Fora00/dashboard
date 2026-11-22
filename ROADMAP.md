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
- [x] **IDN links display as punycode** [sonnet] — DONE 2026-10-09 (`src/lib/idn.ts`, display only; stored URL unchanged). — `defaultTitle()` and the
      page's `hostname()` helper both show `new URL().hostname`, which is
      punycode for non-ASCII domains (`https://例え.jp/パス` titles as
      `xn--r8jz45g.jp/%E3%83%91%E3%82%B9`). Cosmetic only, and the title is
      user-editable, so it's a papercut not a bug. Fix would be
      `decodeURIComponent` on the path plus an IDN-aware host display.
      Effort XS. Low priority.

## Project 13 — Learning 🎓 (courses engine; courses: Full Stack Interview Lab, Python, Database, API, Disegno, Spagnolo, Francese, Tedesco)

Handoff 2026-10-22. Generic course engine in `src/projects/learning/`: content
is static bundle data (`courses/<id>/index.ts` + one line in `courses/index.ts`),
only the learner's state is in Dexie (`learningQuiz`, `learningCards`,
`learningPractice`, Dexie v21, keyed `courseId:moduleId:itemId`). Synced owner-only
(`learningSync.ts`, `learning_*` tables, `is_owner()` RLS, Dexie keys use stable
per-item ids from the course data, never positions). Course HTML is rendered through an allowlist
parser (`html.ts` + `HtmlText.tsx`), never `dangerouslySetInnerHTML`.

- [x] L1 Extract the prototype's 19 modules into
      `courses/backend-interview-lab/modules.ts` (generated by
      `scripts/learning/extract-bil.mjs`; the prototype HTML stays read-only).
- [x] L2 Dexie tables + v21; registry entry, route `/learning/*`, icon tile.
- [x] L3 Course page (grouped modules, per-module + overall progress, open
      vault note as plain text, GCP "da verificare").
- [x] L4b Hand-written modules from Farina's chat (2026-10-22): `langs` (Go, Rust, Python, Java) and `gaps` (what to say about Mongo/Fastify/RabbitMQ/Helm), in `courses/backend-interview-lab/extra.ts`.
- [x] L4 Module page: Lesson / Quiz / Flashcards / Practice tabs.
- [x] L5 Tests: progress, store (Dexie), HTML allowlist, course data counts;
      e2e `e2e/learning.spec.ts` (answer persists across reload).
- [x] L6 Sync progress through Supabase, owner-only (2026-10-22, needed for
      iPhone + iPad + Mac): migration `20261022120000_learning.sql` pushed,
      types regenerated, `SyncCard` on /learning, SyncHealth + privateData wired.
      Not yet exercised against the hosted DB from two real devices.
- [x] L10 Extension 2026-10-23 (course now "Full Stack Interview Lab", same id): 16 modules in
      groups `fe` (JS/TS, React, state, rendering, performance, browser security, CSS/a11y, tests,
      frontend system design, UI mini-project), `mob` (React Native/Expo, mobile concepts, Flutter),
      `lg` (live coding method, 20 coding exercises, full-stack story). Generated by the same
      extractor (now provides `esc` to the prototype); quiz options are permuted per question
      (fixed seed) in the prototype so answers are not always option 2; `col` has the 14-day plan.
      Test counts relaxed for the new ids only. Not committed.
- [ ] L7 JS/TS versions of the Python (Celery/Django) examples in the generic
      modules [sonnet, optional].
- [ ] L8 Verify the GCP module against what Open Move really uses, then drop
      its `verify` marker in `courses/backend-interview-lab/index.ts` [owner].
- [ ] L9 Real-device pass (iPhone/iPad, dark mode) [owner]; not done in-session.
- [x] L11 **Python path** (2026-11-05, `courses/python-path/`, id `python-path`): 47 modules in
      6 groups (basics, objects/types, idiomatic, backend, expert, drills), Italian, for a JS/TS dev
      going to backend Python, readable offline in Milan. Covers language, data model, memory/GC,
      CPython internals, typing, async, testing, FastAPI/Django internals, SQL/Redis/security/
      observability, system design, architecture, deploy, 30 drills, 30 interview questions, 3
      capstones. Extra lesson text lives in `python-path.deep.ts` keyed by module id. Matching vault
      notes (all under `knowledge/programming/backend/`, never in this repo): `python/python-data-model`,
      `memory-model-and-gc`, `python-idioms`, `modern-python-syntax`, `cpython-internals`,
      `python-native-extensions`, `python-packaging-publishing`, `python-task-queue-patterns`,
      `python-learning-path`, `django/django-internals`.
- [x] L12 **Database course** (`courses/databases-path/`, id `databases-path`): 20 modules in 6
      groups (schema/SQL, SQL+performance, transactions/locks, Postgres ops incl. security/RLS,
      scaling, migrations, cache/outbox/CDC, NoSQL/workloads/ORM/testing, 15 SQL drills, 25
      interview questions). Vault: `databases_index` got a Learning Path section.
- [x] L13 **API course** (`courses/api-path/`, id `api-path`): 20 modules in 6 groups (HTTP, REST,
      formats, curl/HTTPie, Bruno, Postman, `.http` files, runner/CI, auth, API security, OpenAPI,
      GraphQL, gRPC/webhook/SSE, async APIs, testing, observability, debug, resilient clients, 12
      drills on public APIs, 20 interview questions). Vault: new `rest-api-design` and
      `tooling/testing/api-clients-bruno-postman-curl`, linked from `backend_index`.
- [x] L14 **Course review ("technical council")** (2026-11-05): four independent reviewers for the
      Python course, three for Database+API (accuracy by running the code on Python 3.14 / PGlite
      Postgres 18 / curl+jq, completeness against the goal, rendering/offline/pedagogy). Fixed: stale
      free-threading claims (supported since 3.14), ctypes on macOS, Bruno CLI (`-r`,
      `--reporter-junit`), `generate_series` cast, PgBouncer prepared statements, `<token>` lost by
      the HTML allowlist, quiz answers always in slot 1-2 (now `q()` shuffles options with a PRNG
      seeded by the question, `python-path.helpers.ts`), code blocks in practice answers unstyled
      (`PracticeTab.tsx`). Tests: `python-path.test.ts`, `new-courses.test.ts` (counts, answer
      spread, HTML scan of every field). Estimated coverage after the fixes: about 85-90% of the goal.
- [x] L15 Disegno course ("Disegno da zero", 19 modules, SVG figures, local photo diary, checklist
      progress) was added by a parallel session in commit `768ec56`; its notes belong to that session.
- [ ] L16 **Content debt** [sonnet, each S]: the correct quiz option is the longest in ~85% of the
      new questions and ~43/70 explanations are under 6 words (pad the wrong options, explain why
      the tempting distractor is wrong); wrap commands in `<code>` on cards; shorten `<pre>` lines
      over ~45 chars (iPhone width) by putting comments on their own line; examples never run:
      HTTPie, Newman, grpcurl, Schemathesis, `.bru`, FastAPI/Django/Celery snippets. Known content
      gaps: DRF in depth, WebSocket/GraphQL server side, behavioural interview, MySQL/SQLite
      differences, API gateway/CDN, designing a whole API end to end, file uploads.
- [ ] L17 **Learning refactor** [opus, see the plan below].
- [x] L18 **Language courses** (2026-11-06): `spagnolo` (29 modules), `francese` (31), `tedesco` (30), A1 -> B2
      for an Italian speaker, `courses/<lang>/*.ts`, groups a1/a2/b1/b2/voc/drill, text only, offline.
      Pronunciation is an Italian-based respelling in `[ ]` (no IPA, stressed syllable in CAPS) with one legend
      per language: `spagnolo.pron.ts`, `francese.b.pron.ts`, `tedesco.pron.ts` (also the `vsec` vocab-table
      helper). Test: `languages.test.ts` (module counts, content minimums, answer spread, HTML scan).
      Council round 1 reports, briefs and rubric are in `docs/learning-drafts/council/`.
      Round-1 scores (BEFORE the fix round): accuracy es 93/100, fr 8.5/10; phonetics es 6.5/10, fr 7/10 (two
      halves written by different authors used different notations, then unified); completeness es 70%, fr 78.8%.
      Fix round applied to es and fr (accuracy, phonetics, pedagogy findings); never re-verified.
      `tedesco` was only partly reviewed: accuracy 16/30 modules ~8.5/10, phonetics ~6.5/10 provisional.
- [x] L18b Lazy course content = R3 below (commit `adfa26b`): Learning chunk 1.7 MB -> one chunk per course.
- [ ] L19 **Language courses: reach >= 90% accuracy and phonetics** [sonnet builders + sonnet reviewers],
      PRIORITY (owner, 2026-11-14): first make A1-A2 solid in all three languages (accuracy and phonetics
      >= 9/10 on the A1/A2 modules, A1-A2 completeness against the CEFR A1-A2 syllabus >= 90%), B1-B2 after.
      Plan: de A1-A2 fixes + course-wide notation sweep (DONE 2026-11-14, not committed: ng never split, É:/È: kept and applied to B,
      j = J, CAPS = stress, glottal stop ʼ, `tedesco/respell.test.ts`; log `council/de-a1a2-fixes.md`) ->
      de A1-A2 re-review (DONE: accuracy 96/100, phonetics 9/10, completeness 89%, B 2, C 14; report
      `council/de-a1a2-review-r2.md`) -> round-2 fixes + gaps (DONE, log appended to `de-a1a2-fixes.md`) -> delta review r3 (DONE: de A1-A2 accuracy 97/100,
      phonetics 9/10, completeness 99%; its B/C fixes applied by the orchestrator; `council/de-a1a2-review-r3.md`) -> fr A1-A2 review r2 (DONE: accuracy 95/100, phonetics 9/10,
      completeness 83%, 93% with drafts; `council/fr-a1a2-review-r2.md`) -> fr fixes + drafts wired as `franceseC`
      + gaps (DONE, francese now 36 modules, log `council/fr-a1a2-fixes.md`) -> fr delta review r3 (DONE: fr A1-A2 accuracy 95/100,
      phonetics 9.5/10, completeness 99%; its 2 B fixed by the orchestrator, C items open in `council/fr-a1a2-review-r3.md`) -> fr A1-A2 re-verify + gaps (feminine rules, irregular presents, pronominals,
      geography prepositions, quantifiers, liaison/e muet/intonation = drafts fr-pron2/determinants/geo-reggenze)
      -> A1-A2 completeness check for all three. es A1-A2 already passed (round 2).
      A1-A2 GOAL MET 2026-11-15 (not committed): de 97/100, 9/10, 99%; fr 95/100, 9.5/10, 99%. Open C items in
      `de-a1a2-review-r3.md`, `fr-a1a2-review-r3.md`. B1-B2 work below (a-f) continues from here.
- [ ] L20 **Russian A1** (owner, 2026-11-14): course `russo` BUILT 2026-11-14 (not committed, check + build green),
      15 modules, groups a1/voc/drill; review r1 DONE (accuracy 88/100, phonetics 8/10,
      completeness 74%, A 4 B 13 C 20; `council/ru-a1-review-r1.md`); fixes DONE (log `council/ru-a1-fixes.md`,
      all A/B, 19/20 C, gaps closed inside the 15 modules); review r2 DONE (accuracy 95/100,
      phonetics 9/10, completeness 99%, B 2, C 22; `council/ru-a1-review-r2.md`); polish of its B/C DONE
      (log `ru-a1-fixes.md` Round 2). Open: real-device look [owner]; A2 later if wanted. Gaps left by the builder:
      ordinals/dates, genitive/dative/instrumental beyond chunks, imperative only as chunks.
      Spec: Cyrillic with stress marks + Italian-based respelling (reduction
      shown), `russo/respell.test.ts` (stress mark + syllable/CAPS check). Then accuracy + phonetics review
      to >= 9/10 as in L19.
- [ ] L21 **Shared vocabulary across languages** (owner, 2026-11-14; decided 2026-11-15): inside Learning,
      route `/learning/vocabolario`; dictionary (Italian word -> es/fr/de/ru side by side with the course
      notation, gender, example; search + theme/level filter) + flashcards per theme choosing the languages.
      Words: a NEW curated list, ~600-1000 frequent A1-A2 words by theme, same respelling legends as the
      courses, reviewed. Progress reuses `learningCards` (courseId `vocabolario`, moduleId = theme, itemId =
      `<wordId>.<lang>`): no migration, already synced owner-only.
      - V1 DONE 2026-11-15 (not committed): `learning/vocab/` (types, index, progress, store, VocabPage,
        vocab.test.ts), themes persone-famiglia 40 + cibo-bevande 41, Learning home card, route
        `vocabolario/*`. Then (owner) a simple search (`vocab/search.ts`, accent/stress-insensitive,
        Italian + selected languages) + part-of-speech chips + "Pronuncia" screen
        (`/learning/vocabolario/pronuncia`, the courses' PRON_SHORT + PRON_FULL). No level filter.
      - V2/V3 replaced by the atomic queue below (one theme per task).
- [ ] L22 **Languages: atomic queue** (owner, 2026-11-15; REPLACES the big rounds of L19 a-f, L20 next steps,
      L21 V2/V3, which burned too many tokens). Rules:
      1. One task = one module (or one vocab theme, or one fix list), one language, done interactively in the
         main session: no reviewer fan-out, at most one worker. Stop after each task; the owner picks the next.
      2. Nothing breaks: only that module's file(s) change; `npm run check` + `npm run build` green and the
         language's respell test passing BEFORE the task is ticked. If it can't be made green, revert it.
      3. The >= 90% rule: on the touched module, accuracy >= 9/10 and phonetics >= 9/10 (one inline review
         against `council/rubric.md` and the course legend, score written down), and nothing the owner
         asked for is lost (local-first, mobile-first, course notation, no IPA in the UI).
      4. Log: one line per task appended to `council/<lang>-atomic.md` (module, score before/after,
         fixes); tick the task here with the score. Commit only when the owner says so.
      Per language (in order; ids are module ids):
      - **de** (B1-B2 accuracy review was never finished): DE1 C items of `de-a1a2-review-r3.md`; then one task
        per module: DE2 de-plusquam, DE3 de-konj2, DE4 de-passiv, DE5 de-konj1, DE6 de-konnektoren,
        DE7 de-registri, DE8 de-nebensaetze2, DE9 de-relativ, DE10 de-aggettivi, DE11 de-varianti,
        DE12 de-falsiamici, DE13 de-esame, DE14 de-voc-lavoro, DE15 de-drills (open B list in L19 a).
      - **fr** (A1-A2 met, B modules fixed in round 1 but never re-verified): FR1 C items of
        `fr-a1a2-review-r3.md`; then FR2 fr-subj1, FR3 fr-subj2, FR4 fr-trapas, FR5 fr-cond, FR6 fr-passiva,
        FR7 fr-relatifs, FR8 fr-connecteurs, FR9 fr-registres, FR10 fr-variantes, FR11 fr-falsiamici +
        fr-falsiamici2, FR12 fr-esame, FR13 fr-voc-lavoro, FR14 fr-drills.
      - **es** (met: 96/100, 9/10, 91%; only margin work): ES1 owner choice on the `dr` cluster; ES2-ES4 thin vocab
        themes to >= 40 words, one module each (es-voc-vita, es-voc-viaggi, es-voc-lavoro); ES5 lenition drill;
        ES6 b/v + g/j spelling rules + abbreviations.
      - **ru** (A1 met: 95/100, 9/10, 99%): RU1 C items of `ru-a1-review-r2.md`; RU2 ordinals/dates inside
        an existing module; A2 only if the owner asks, one module per task.
      - **vocab** (L21): VO1 review persone-famiglia, VO2 review cibo-bevande (each: 4 languages, >= 9/10);
        then one new theme per task (~40 words, same format, `vocab.test.ts` green), owner picks the theme.
      - **all**: the Wiktionary IPA cross-check (L19 f) in batches of 50 words per language per task.
      5. Vocabulary is ONE source (owner, 2026-11-15): every language keeps its words in
         `courses/<lang>/words.ts`; course tables are built from it and Vocabolario reads it, so a course
         task that adds words updates Vocabolario automatically (no script). Words are linked across
         languages by a shared id; a word missing in some languages still shows, with "—" for the gaps,
         and a test lists the gaps (not a failure) so filling them becomes a task.
      - **words** (do first, then the language queues): WS0 [opus, M] engine: the `words.ts` format (id, it,
        w, pron, g, pl, theme, note, ex), `vsecW(heading, ids)` that renders a course table from it,
        Vocabolario merging the four lists by id (one lazy chunk per language, theme files become metas
        only), the two existing themes converted, gap report test; check + build green, the page looks
        the same. Then one task per course vocab file, moving its `vsec` rows into `words.ts` with ids
        (de: a, a.2, b.1, b.4, b.5; es: b.4, c.4, c.5; fr: b.4; ru: its voc modules get rows first). Each
        move keeps the rendered course table identical (test compares the HTML before/after).
        WS0 DONE 2026-11-15 (not committed): `courses/<lang>/words.ts` + `vsecw.ts`, `courses/vocabTable.ts`
        (`vtable`, `tableRow`, `groupRow`), `vocab/merge.ts`; theme files removed (metas in `vocab/index.ts`,
        counts derived); 81 words moved with ids unchanged; gap report printed by `vocab.test.ts`.
        Move rules learned on the first move: list rows ("null, eins, zwei, drei", "Deutschland, Deutscher")
        are SPLIT into one entry per real word and rendered as a group row (`vsecW` row = id | id[], joined
        with ", "); every word gets a real theme (`dai-corsi` only as a last resort); `t` only where the table
        form differs; run `npm run format` before check.
        - [x] de `a.ts` (2026-11-15): 3 tables, 55 new de-only ids, themes `saluti`/`numeri`/`paesi` added.
          Gap report: es/fr/ru 81/136, de 136/136.
        - [x] de `a.2.ts` (2026-11-15): 4 group rows, 10 new ids, theme `domande`; gap es/fr/ru 81/146.
        - [x] de `b.1.ts` (2026-11-15): 2/8 tables moved (6 are sentences/phrases, stay `vsec`), 17 new ids,
          2 reused, themes `connettivi`, `aggettivi`; gap es/fr/ru 81/164. Rule: sentence tables stay `vsec`.
        - [ ] de `b.4.ts` (12) - [ ] de `b.5.ts` (24): PAUSED (owner, 2026-11-15: "too deep on German").
          The b.4 attempt was stopped and fully reverted (b.4.ts restored byte-identical from the pre-move
          snapshot, its words.ts entries and themes removed). Next: other languages, not more German.
          Workers must never use `git stash`/`checkout` on files with uncommitted work.
        - [x] Gaps filled (owner: "fill for all languages the vocabulary we have until here", 2026-11-15):
          es, fr, ru each +83 entries -> all four languages 164/164, 0 missing. Course respellings copied
          where the course has the word. Fixes by the orchestrator: unstressed one-syllable pos 'x' words
          may stay lowercase (que [ke]/[kë]) instead of fake CAPS; ru `respell.ts` learned что -> што and
          мно́го (so что = [SHTO] like the course, molto = мно́го). Not yet reviewed (VO-review tasks).
        - [ ] es `b.4.ts`, `c.4.ts`, `c.5.ts` - [ ] fr `b.4.ts` - [ ] ru voc modules (rows first)
      Session notes (owner chat, 2026-11-15), the decisions behind L21/L22:
      - Vocabolario V1 had to "just work": search dropped, then brought back simple (accent-insensitive
        search, part-of-speech chips) with a Pronuncia recap reusing the courses' legends.
      - Big multi-reviewer rounds cost too many tokens -> atomic per-language tasks, interactive, each one
        green and >= 9/10 on what it touches (rules 1-4 above).
      - Every language updates its own vocabulary and the cross-language Vocabolario follows automatically
        -> one source per language (`words.ts`, rule 5), chosen over a generator script; words missing in
        some languages are shown with "—", never hidden.
      - Owner asked whether languages should become their own project. Answer: not now. The course engine,
        progress tables and sync belong to Learning; splitting means a cross-project refactor mid-migration.
        Cheaper: a "Lingue" group on the Learning home (4 languages + Vocabolario), optionally a home tile
        deep-linking to it. Revisit when languages get their own features (audio, conjugation tables, one
        review schedule across vocabulary), after moving the engine to `src/lib` (Learning refactor).
        DONE 2026-11-17 (not committed), generalised for all of Learning: `courseGroups` + `group` per
        meta in `courses/registry.ts` (Sviluppo, Creatività, Lingue; Vocabolario is a group extra in
        `Learning.tsx`), collapsible sections remembered per device, test: every course in a known
        group, no empty group. Home tile deep-linking to Lingue: not done (optional).
      - Lost in WS0: the comments inside the two old theme files (untracked, deleted after conversion);
        data verified identical against the morning build.
      do in this order, one language at a time, reviewers write their report incrementally:
      - a) `tedesco` accuracy: finish the review from `de-plusquam` on (14 modules, status header and line
        numbers in `docs/learning-drafts/council/de-accuracy-r1.md` + `de-dump.txt`), then fix. Open B findings:
        numbers skip 15, noun-gender exceptions, am-Progressiv, dative prepositions list, sein verbs in Perfekt,
        "am größten" vs -esten rule, `damit` wording, `ich käme` note;
      - b) `tedesco` phonetics: fix the "ng" rule (legend says no g, ~90 transcriptions spell it), unify
        `È:`/`É:`/`E:` and `J`/`I` between `tedesco.a*` and `tedesco.b*`, stress-mark case, the listed wrong
        respellings (Dusche, gehabt, Hähnchen, Gymnasium, Städte, Metzger, England, des, Ihrer, Billett), add
        intonation, rhythm, glottal stop and separable-verb stress to `de-pron`; then re-review;
      - c) `spagnolo` DONE 2026-11-07 (round 2: accuracy 96/100, phonetics 9/10, reports `es-*-r2.md`, A/B fixed;
        open choice: `dr` cluster written plain `d`); `francese` still to do. `spagnolo` and `francese`: re-verify accuracy and phonetics on the fixed text (only changed modules),
        fix, repeat until both >= 9/10;
      - d2) `spagnolo` DONE 2026-11-07: +2 modules (es-tempolibero, es-cultura; `spagnolo.c.5.ts`, 37 total) and gap fixes in
        es-trapas (futuro/condicional perfecto), es-porpara (a personal, reggenze), es-drills (L2->IT), es-esame
        (DELE scoring, indicative); review `es-new-review.md` (accuracy 95/100, phonetics 9/10, A/B fixed). Completeness
        MEASURED 2026-11-07 (`es-completeness-r2.md`): 73/80 = 91.3% (A+B 54/60 = 90.0%; R1 70.0%); thin margin, with the
        R1 denominator error (28 B lines) it is 90.1%; below 1: 14 vocab themes (0.5 each), lenition drill, b/v g/j rules, abbreviations;
        NEXT for es (margin is thin, optional): expand the 14 thin vocab themes of es-voc-vita/viaggi/lavoro to >= 40 words
        + mini-dialogue + exercises (6 themes = +3 points); lenition drill (b/d/g, final and aspirated s); b/v and g/j
        spelling rules + abbreviations; more idioms/proverbs exercises (quiz); then fr and de as in a)-d);
      - d) `spagnolo` DONE 2026-11-07: 6 modules reviewed twice and wired as `spagnoloC` (35 modules, incl. new
        es-natura; reviews `es-drafts-review*.md`); es completeness not re-measured. fr/de still to do.
        Original text: measure completeness again (all three) and write the missing modules; drafts (es now moved) in
        `docs/learning-drafts/` (`spagnolo.c.*.ts`, `francese.c.*.ts`; es indefiniti/relativi/cambi/numeri/
        funciones/natura, fr determinants/ortho-lecture/geo-reggenze/natura); wire in as `<lang>C` after review.
        German completeness never measured;
      - e) automated test that the respelling convention is uniform across a language's halves;
        `spagnolo` DONE 2026-11-07: `spagnolo.respell.ts` (+ test) derives the respelling from the spelling and
        checks `word [pron]` pairs; found and fixed `CU` for k (c = ch in the legend) and initial `r` without `rr`;
      - f) no native speaker available, so check pronunciation mechanically [sonnet, M]: for the ~300 most
        frequent words per language take the IPA from Wiktionary, convert it to the expected respelling by the
        language legend, and diff it against the course `[ ]` (stress, vowel length, sounds); fix the
        discrepancies. Optional [owner]: listen with macOS `say -v <voice> "<word>"` (voices installed in System
        Settings) and compare. Exam data (DELE, DELF, Goethe/ÖSD durations and points) stays "indicative": check
        it on the official sites;
      Known content gaps: es -mente adverbs beyond nomi, dequeísmo, idioms; fr proverbs, ordinals in their own
      module; de see a).

### Learning tidy-up (owner, 2026-11-17: "un po' esplosa"; all three asked)
- [x] T1 Code layout: engine/ ui/ figures/ home/ course/ module/ review/, `Learning.tsx` routes only,
      `docs/COURSES.md` (commit `725021f`).
- [x] T2 Home: "Oggi" block (Continua = last module across courses and devices + Ripasso count), search,
      groups as compact rows (name, detail, %), Lingue first, sync box moved to the bottom (as in Life),
      Italian copy. SyncCard lost its email `autoFocus` (it scrolled the page to the bottom when signed out).
      Checked at 390px, light and dark.
- [x] T3 Module page: sticky tabs (under the phone header, measured; 2px on wide screens), "Lo so -> Ripasso"
      hint on Flashcard and on the finished deck, Ripasso link when the quiz has wrong answers. Checked 390px + 1280px.
- [x] T4 Two taps (owner, 2026-11-17): the home lists the AREAS (Lingue, Sviluppo, Creatività), each opens
      `/learning/<groupId>` with its courses (`home/GroupPage.tsx`); course page and Vocabolario go back to their
      area. Collapsible groups removed. Test: course ids never equal an area id, `ripasso` or `vocabolario`.
      Bug caught on the way: relative links from the area page (`/learning/lingue/tedesco`); all home links
      are absolute now.
- Left as is: shared app chrome in English ("All projects", SyncCard texts) is used by every project.

### Learning refactor (proposal 2026-11-05; R3 done 2026-11-06, the rest not built)

Why: the engine was written for one course; there are now five, with different needs (quiz
and cards, drills, checklists and photos). Pain points seen in this session: the course helpers
live in a file named `python-path.helpers.ts` yet serve three courses; invariants are checked by
three separate test files; all courses ship in one 645 KB chunk (`ProgressBar-*.js`); the quiz
locks after the first answer and "Rifai" wipes the correct answers too; cards have no review
schedule; authoring means HTML inside TS strings (escaping `\\`, `&lt;`, `${`).
Order: R1, R2 first (cheap, safe), then R5a/c/d (quick wins), R3, R5b, R6, R7, R8.

- [x] R0 **Courses in one folder each + progress on every device** (2026-11-07): `courses/<id>/` per
      course (shared helpers in `courses/kit.ts`); checklist ticks (`learning_checks`) now sync
      owner-only, and `learning_position` remembers the last module/tab per course, shown as
      "Riprendi da…" on the course page and list. Migration `20261107120000_learning_checks_position`
      (pushed). The photo diary stays local on purpose. To check on a device [owner]: tick on one
      device, see it on another.
- [x] R1 **Neutral course kit** [sonnet, XS] (DONE 2026-11-17: `kit.test.ts`, shuffle deterministic + answer remapped): move `q`/`card`/`prac`/`mod` and the seeded shuffle from
      `courses/python-path.helpers.ts` to `courses/kit.ts` (file move done 2026-11-07, shuffle test still open); keep the exports, update imports; unit
      test that the shuffle is deterministic and remaps `answer`.
- [x] R2 **One lint suite for all courses** [sonnet, S] (DONE 2026-11-17: `courses.test.ts` = universal
      invariants + a PROFILES table per course; `languages`, `new-courses`, `python-path` tests folded in and
      removed; a new course fails until it gets a profile. FINDING: the right quiz option is the longest in
      71-92% of the tech/disegno questions (guessable by length; languages 25-47%); ratchets set at today's
      values; follow-up: rework those distractors, one course per task, then tighten `maxLongest` to 0.6).
      Original brief: fold `python-path.test.ts` and
      `new-courses.test.ts` into `courses.test.ts` as invariants over every course: ids contain no
      `:` and fit the SQL checks (`course_id` ≤ 60, `courseId:moduleId:itemId` ≤ 200, see
      `learning_*` migration), HTML scan of every field (no dropped tag, no unescaped `<` in `<pre>`),
      4 options and no duplicates, answer slots spread (< 45%), correct option the longest in
      ≤ 70%, minimum cards/practice per module, explanation length (warning level).
- [x] R3 **Registry meta + lazy content** (2026-11-06, commit `adfa26b`; `courses/registry.ts`,
      `useCourse.ts`, `CourseLoading.tsx`; each course is its own chunk 55-327 KB, precache 3.29 MiB, no chunk
      over 500 KB; the home lists metas and fills the % as chunks load, one per idle tick; `index.ts` stays the
      eager list for tests only; test `lazy registry` keeps metas equal to the content. Offline open of a
      not-yet-visited course after an update still to be checked on a device [owner]). Original brief: `courses/registry.ts` holds `{id, title, emoji,
      summary, moduleCount}` and a `load()` doing `import('./<course>')`; the Learning home lists
      metas, Course/Module pages load content with a skeleton. Acceptance: first Learning load drops
      from one 645 KB chunk to the page code only; every course chunk still matches the workbox
      precache (`vite.config.ts` globPatterns, 5 MiB cap) and a course opens offline after the
      update prompt (check with Playwright `setOffline`). Risk: a course not yet precached when
      offline; mitigate by listing the course chunks in the precache manifest.
- [ ] R4 **Unified item model** [opus, M, optional]: `PracticeItem` and `QuizQuestion` carry optional
      bolt-ons for drawing (`checklist`, `modelFig`, `fig`, `optionFigs`, `minutes`). Replace with a
      discriminated union of item kinds and a per-course `progressModel` (single bar vs "Sapere/Saper
      fare") so `progress.ts`, `CoursePage` and `ModulePage` stop special-casing. Needs a Dexie
      read-compat check: row keys `courseId:moduleId:itemId` must not change.
- [ ] R5 **Engine features** (owner, 2026-11-17: do R5 a/c/d, then R1+R2 (+R6 asked when reached),
      then R5e search, then R5b Ripasso; one at a time). a/c/d DONE 2026-11-17 (not committed):
      `resetWrongQuiz` ("Rifai le sbagliate (n)" + "Rifai tutto"), prev/next module nav under every tab
      (scroll to top on open), "In questa lezione" jump list from the `<h3>`s (`headingsOf`, anchors via
      `HtmlText anchorPrefix`, buttons not #hash because of HashRouter), checked at 390px:
      - a [sonnet, S] "Rifai" resets only the wrong answers (keep correct ones);
      - b DONE 2026-11-17 **Ripasso** (owner choices: course cards + Vocabolario words + wrong quiz answers;
        3 grades Di nuovo/Difficile/Facile = tomorrow / same interval / next step of 1-3-7-21-60-120 days;
        existing known items spread over 18-24 Nov; 15 a day). `review.ts` (pure, tested), `ReviewPage.tsx`
        (`/learning/ripasso` + home card), table `learning_reviews` (migration `20261117120000`, PUSHED, types
        regenerated, Dexie v25). Rows are written only on grading; ungraded items get a computed due date, so a
        fresh device never overwrites another device's schedule. A wrong quiz answered right in Ripasso becomes
        right in the module. Checked at 390px with a faked clock (course cards + quiz); Vocabolario words in
        Ripasso not yet seen in a browser [owner: check on the phone].
        Original brief: [opus, M] **review queue** ("Ripasso") across courses: intervals 1/3/7/21 days with
        again/good grades per card; needs a `dueAt` + `ease` column on `learning_cards` (migration,
        Dexie version, sync) and a Today-style entry on the Learning home;
      - c [sonnet, S] "Modulo successivo" link at the end of a lesson and "continua da dove eri"
        (last module per course, guarded localStorage);
      - d [sonnet, S] in-lesson jump list built from the `<h3>`s;
      - e [sonnet, M] search across module titles, lessons and cards. DONE 2026-11-17: `courseSearch.ts` (+ test),
        box on the Learning home (loads every course at once while searching), accent-insensitive, ranked title >
        section heading > lesson text > quiz/cards/practice, 60 shown with a highlighted snippet; lesson hits open
        `?tab=lesson&sec=n` and scroll to that `<h3>`. Checked at 390px.
- [ ] R6 **Authoring in Markdown** [opus, L, optional] (owner, 2026-11-17: skipped for now; content is AI-written): `scripts/learning/md2course.mjs` turns
      `content/<course>/<module>.md` (front matter + sections for lesson, quiz, cards, practice) into
      the TS data using the same allowlist, so no escaping and diffs are readable; the existing TS
      courses stay valid. Do only if more courses are planned.
- [ ] R7 **Vault links as data** [sonnet, S]: replace the free-text `vault` HTML by `notes: string[]`
      (vault-relative paths, shown as plain text) and add `npm run courses:vault-check` that verifies
      the notes exist; runs on the owner's Mac only, never in CI (the vault never leaves the Mac).
- [x] R8 **Docs** [sonnet, S] (DONE 2026-11-17: `docs/COURSES.md`, with the new folder map: engine/ ui/ figures/ course/ module/ review/ home/; `Learning.tsx` = routes only): `docs/COURSES.md` (how to write a course, authoring rules, the review
      checklist used by the council) and a Learning section in `docs/ARCHITECTURE.md`.

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

- [x] **Sync the starred flag across devices** [opus] — DONE 2026-10-09: `project_prefs` (per user, starred + hidden; opens stay local), migration `20261009120000` pushed. TO CHECK on a device: star while signed in, confirm the upsert works and the row has your `user_id`; two devices with old stars merge. Follow-up [sonnet]: map pre-v17 backups' starred/hidden into `projectPrefs` on restore. Original note: — stars are currently
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
  - [x] Recap card [sonnet-sized, done 2026-10-15]: optional `plan.recap`
        (validated, diffed, exported, kept on hand-edit), read-only
        `RecapSection` under Trackers: bars per week for the minimum, a step
        line for a metric, criterion pips, calm single hue. Plus a
        read-only Month view (owner asked 2026-10-15), no stored decision. Spec in
        `docs/HANDOFF-life.md`.
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
- [x] **Watch the first scheduled Actions run** [orchestrator] — DONE 2026-10-09: scheduled runs succeed daily (~15 min), `events.json` served (200). Warnings seen in the 2026-10-08 crawl: `trentinospettacoli` HTTP 400 on page 3 (FIXED 2026-10-09: a WordPress page past the end is now the normal end); `rovereto` is disallowed by robots.txt (respected, keeps its 17 old events); `infinityboulder` and `santachiara` answer the Actions runner with a SiteGround captcha instead of JSON (not worked around on purpose; the first has never produced an event); TriO Desenzano 2026-10-10 still unverified (the official site lists no date; only aggregators do). — after
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
- [ ] Crawler follow-ups [sonnet, each XS–S] (2026-10-09: fuzzier dedup DONE via `mergeCore`, one extra merge on live data; images already covered by OG_SOURCES for cultura-trentino/verona/trentogiovani, capped by politeness, bibcom pages have no og:image; keywords not started, no named misses): images for bibcom,
      trentogiovani and Verona (capped extra object reads); fuzzier dedup
      (e.g. "Pietre di pane" on mart and comune-trento); more keywords
      per category; shorter horizon for Verona if its roughly 30 MB per run is too heavy;
      a visitrovereto source if it ever exposes a feed.
- [ ] **Events: Cinema tab** (owner, 2026-10-20). Phase 1 [x] DONE 2026-10-20
      (`screenings.ts` + `Cinema.tsx`, own page `/events/shows` ("Spettacoli": cinema + theatre + concerts, kind chips; theatre and concerts also stay in Events) with an Events | Spettacoli nav (`EventsNav`), `showList.ts`, the same `EventCard` as the list (Save, Go, Hide, Like, Nope, Things, Calendar, Share; `useEventActions`), a film is one card on its first screening of the day (card UI to be refined with the owner): the 100 hall
      screenings of supercinema / trentinospettacoli / cultura-trentino /
      pergine leave the event list and show by day, one card per film with
      town + times, town filter; festivals, talks, cineforums, Mart and
      library evenings stay events; unverified on a phone). Phase 2 [x] DONE 2026-10-20 (`scripts/events/adapters/mymovies.ts`: Trento
      Modena / Vittoria / HarpoLab, Cles, Pergine, Tesero, 16 screenings on the first run; Rovereto stays
      `supercinema`; MyMovies publishes only TODAY, no day parameter, so Trento
      shows just the crawl day: look for the halls' own sites for a full week
      (Cineworld Trento, Nuovo Astra); unverified on a phone). Small leftover: a day-only
      duplicate (e.g. "Taddeo", Tione) stays an event.
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
      3. [x] DONE 2026-10-09 (`firstSeen` stamped by the crawler, `visit.ts` baseline with a 30-minute same-visit window, "New" chip + filter; no badge shows until the first crawl with this change has run; unverified on a phone) — "New since last visit" badge (last-visit timestamp in
         guarded localStorage or Dexie).
      4. [x] DONE 2026-10-09 (`groups.ts`: 3+ records with the same title and city collapse in the All view, group = next occurrence's card + expandable dates; saved/hidden/hand-added never join; unverified on a phone) — Group repeats with the same title across records into one
         expandable row ("17 serate, next ≈ …"); optional venue filter.
      5. [x] DONE 2026-10-09 (in a day: ring home/near/spot, then favourite categories, start, title; Saved by date, finished ones last in one "Past" group, most recent first) — Sorting inside a day: ring proximity, then favourite
         categories; Saved view by date, past last.
      6. [x] DONE 2026-10-09 (`travel.ts`, nearer origin only, hidden for Trento/Rovereto/online; the Trento column is the agent's own estimate, check it by eye; far spot cities left out) — Travel time from Trento/Rovereto per city (from rings).
      7. [x] DONE 2026-09-30 (`ics.ts`, "📅 Calendar" in the expanded card, TZID Europe/Rome; iOS share-sheet path and a real Apple/Google Calendar import unverified) — Export an event as .ics.
      8. [x] DONE 2026-10-01, not committed: saved/hidden (`eventMarks`) and favourite
         categories (`eventPrefs`) sync, owner-only. `src/lib/eventMarksSync.ts`,
         `src/projects/events/marks.ts`, Dexie v15 (queues existing marks once).
         **Owner must apply `supabase/migrations/20261001130000_event_marks.sql`
         BEFORE shipping the client, then `npm run db:types`.** Known gap: an
         un-save is a hard delete, so an offline device pushing an older save
         later brings it back. Marks of past events are auto-deleted (`pruneEventMarks`, local + server). /events SyncCard shows only the custom-events engine.
      9. [x] DONE 2026-10-09 (`## Saved events next week` + `savedEvents` in the Life export, `/settimana` proposes where they fit; unverified on a device) — Saved/favourite events in the Sunday Life plan.
      10. [~] PARTLY DONE 2026-10-09: 14 hand-verified spot entries added (3 flagged unverified: Avio date conflict, Luci d'Artista, Artigiano in Fiera). Open: add Vallarsa/Villa Lagarina/Besenello to the trentino list in `areas.ts` then add Fiera di San Luca (17-18 Oct), Foliage Lago di Cei (18 Oct), Autunno DiVino Besenello (9-11 Oct); re-check Luci d'Artista + Avio in late October; Miart 2027 and Milan Games Week unverifiable (Incapsula); owner decides on `verified:false` for Milan Games Week; visitrovereto adapter not started. Original brief: Spot pass (after the categories/food builder finishes; owner
         OK'd 2026-09-30): hand-verified `spot.json` entries for Festa della
         Castagna, Castione di Brentonico (18 Oct 2026, from visitrovereto.it)
         and other autumn festivals around Rovereto/Vallagarina; more
         interesting big events for Bologna, Torino, Milano, plus Ferrara
         (spot ring, roughly 2.5-3 h, distance not verified); check whether
         Milan Games Week / Miart dates can be verified. Then try a
         visitrovereto.it adapter (WordPress, no feed; robots + structure
         first, skip if only fragile markup is left).
      11. [~] Interest signal (owner, 2026-10-09). Step 1 DONE: 👍/👎 on each card
         (👎 also hides; `event_interest` owner-only, features snapshot, migration
         `20261009150000` pushed). Subcategories (theatre/concerts/exhibitions/talks)
         assigned by the crawler, coverage about half. Open: UI for subcategories
         (second chip row, favourites at subcategory level, add `subcategory` to the
         feature snapshot); step 2 scoring + "your interests" page (reorder off until
         ~30 signals); seed from `~/life` only through a local path; check the card
         footer at 375 px; hand-added events as implicit 👍.
      12. [x] Interest signal step 2 DONE 2026-10-09: scoring (`interestScore.ts`), `/events/interests` page with pins, owner-only `event_interest_profile` (migration `20261009170000`), seed import (paste or `scripts/events-seed-link.ts` link), opt-in "Ordina per te" (off, needs 30 signals). Follow-ups [sonnet]: mark snapshots drop `subcategory` (sanitizeSnapshot) so saves/hides never teach `sub:*`; saved/hidden marks are pruned a day after the event so implicit evidence vanishes (keep a snapshot when pruning); zod to `dependencies`; npm alias for the seed script; pins on seed-only rows; check the filter-sheet switch on a phone.
      13. [x] DONE 2026-10-09: `supercinema` adapter (one event per film/day/time, 28 screenings of 7 films on the first dry run; one of the 8 films on the home gave none, not investigated: probably a rassegna entry), 4 ghost venue records of `cultura-trentino` dropped, cinema never collapsed in the list. Owner: Minicami October workshops added to spot.json by hand (the spot adapter gives every entry ring `spot`, so local Rovereto entries sort last in a day and show the Spot badge: a per-entry ring would need a schema + pipeline change). Cineworld Trento, Nuovo Astra, Harpo Lab: no source checked yet.
      Parked: map view (only events with a venue), price/free filter (needs a
      crawler field per source), real `organizer` field.
- [~] **Recurring activities and courses** (owner brief, 2026-10-14). DONE: (1) `rovereto`
      (eventi.comune.rovereto.tn.it) removed: its robots.txt is `Disallow: /` for everyone; Verona in
      15-day chunks (`chunkDays`), under the 5 MB cap; visitrovereto.it re-checked and still skipped
      (dates in prose). (2) `scripts/events/series.ts`: `recurring` tag + `series` field
      (id, cadence weekly/biweekly/monthly, weekday, count, next dates) on 3+ dates of one
      title+city; never for cinema/theatre/concerts. (4) category `courses`, tag `cycle` (+ `meetings`),
      view "Si ripete" in /events (one card per `series.id`, next start first; visits, tastings,
      markets, exhibitions and performances left out). Cleanup with the owner's OK: Verona 30 days and
      Bolzano/Merano/Bressanone keep only boardgames/nerd/creative/courses (`ringInterests`),
      exhibitions off by default. Signals read 2026-10-14: 5 👍, 12 👎, 5 saved, 91 hidden (too few
      for "Ordina per te"). Open: [sonnet/opus] **`recurring.json`**, hand-curated weekly
      timetables expanded to dated events (the Trento/Rovereto clubs, climbing gyms, CAI SAT sezioni
      publish a timetable, not a calendar; needs the owner's list of places); per-source HTML
      adapters (Università popolare, UPT, Caritro, Centri giovani, Muse/Mart adult workshops,
      Block3/Pietra/Salewa Cube) only for places the owner names: probed 2026-10-14, sat.tn.it,
      roveretogiovani.it and fondazionecaritro.it expose WP news feeds without dates, block3.it has a
      feed to inspect; Infinity and Santa Chiara are behind a captcha on the runner. Crawl in CI is
      about 11 minutes (was 4): watch it after the Verona cut. The owner's fixed-timetable places
      are not scraped from Instagram/Facebook (ToS).
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

- [x] **M7b AreaManager still has its own share/clipboard code** [sonnet, XS] — use `lib/share.ts` (`shareOrCopy`); the current `.catch(() => {})` swallows failed shares.
      → done 2026-10-08 (also fixed JoinArea showing "[object Object]" for Supabase errors).
- [x] **F1 Follow-ups from the 2026-10-08 fixes** [sonnet, S] — SyncCard render test (no React test setup yet); "Remove private data" entry in Settings while signed out; show the new "not invited any more" error clearly in JoinArea/JoinProject; reword the `cloudSync.ts` `share_token` comment; `docs/NEW_PROJECT.md` mention `uniqueViolationIsDone` / `afterPull`.
      → mostly done 2026-10-08: not-invited message, comment, NEW_PROJECT docs, Settings "Remove private data". Still open: SyncCard render test (no React test setup).
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
- [x] **L10 Spot-checks** [haiku, XS] — PARTLY DONE 2026-10-09: `npx knip` run (88 unused exports, nearly all deliberate: the `*Sync.ts` wrapper surface and constants the tests use; only `scripts/icons/build-icons.mjs` is unreferenced; nothing removed). The empty/loading-state and `w-8` checks still need a look on a phone. Original: — empty/loading states in `LifeImport`,
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
- [x] **E5 Deploy job holds Pages-write for the whole job** [opus, S] — split
      → done 2026-10-08, FIRST REAL RUN OK (push 07f65ad, run 37771240842: build 46 s, deploy 10 s; deploy found the artifact, `configure-pages` worked with only pages/id-token, the reuse path and the events.json gate passed, live site/manifest/icons verified). Still to observe: the next scheduled crawl (04:23 UTC) or a manual `crawl.yml` run, which exercises the new crawler guards and the `health` job (summary only, no issues). Original: `_site.yml` split into `build` (contents: read) and `deploy` (pages/id-token), actions pinned by SHA (setup-node v7.1.0 is from today). First-run watch list in docs/CI.md: deploy finds the artifact, `configure-pages` permissions, `github-pages` environment rules, health job still gets `crawl_health`.
      build (`contents: read`) from deploy; pin actions by SHA; Dependabot is on.
- [x] **E6 One bad carried-over record blocks every crawl** [sonnet, S] —
      → done 2026-10-08: `validPreviousEvents()` drops bad carried-over records with one warning.
      previous records aren't schema-checked (`schemas.ts:33`); a record without
      a title throws in `dedup` outside the per-source try. Validate and drop.
- [x] **E7 Degraded crawls are silent** [sonnet, S] — more than 1/3 sources failing
      → done 2026-10-08, changed the same day on the owner's rule that everything stays local: the `health` job in `crawl.yml` only writes a `::warning::` and a run summary (no permissions, no GitHub issues). Per-job permissions.
      only prints `::error::`; open an issue or fail a separate step; also on
      sources stale for over 7 days.
- [x] **E8 Hardening, low** [sonnet, S each] — response size cap (~5 MB) in
      → client part done 2026-10-08: `isValidEvent` drops malformed events, a 0-event file never overwrites the Dexie cache.
      → PARTLY done 2026-10-08: 5 MB body cap, refusal of non-http(s) and private/loopback/link-local hosts on every redirect hop (literal host only, no DNS), `absUrl` on url/image. Still open: client-side `model.ts:140` / `Events.tsx:80` (drop malformed events, never replace the offline cache with an empty file) [sonnet, S].
      `http.ts`; block private/link-local redirect targets and non-https in
      fetched URLs (`ogimage.ts:99`, filarmonica, muse); `absUrl` on url/image
      in `toEvents` (`pipeline.ts:132`); client: drop malformed events and don't
      overwrite the offline cache with an empty file (`model.ts:140`,
      `Events.tsx:80`).
- [x] **E9 Small** [haiku, XS] — retry image fetch network errors next run
      → all done 2026-10-08: reused `events.json` older than 3 days emits a warning (never fails the deploy).
      → PARTLY done 2026-10-08: image network errors retried next run, `timeout-minutes: 30`, spot.json unique ids + known categories. Still open: warn when the reused `events.json` is over 3 days old [haiku, XS].
      (`ogimage.ts:107`); `timeout-minutes: 30` on workflows; warn when reused
      `events.json` is over 3 days old; `spot.json` unique ids + known categories
      (`pipeline.ts:101`, `spot.ts:39`).
- [x] **E10 Adapter tests** [sonnet, M] — fixtures for openpa, filarmonica,
      → done 2026-10-08: fixture tests for openpa, filarmonica, arteven, padova, ical (30 tests, pass under TZ=UTC and Europe/Rome); no adapter bugs found.
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
- [x] **LF5 Sunday answers can't be given late** [opus, S] — previous week is
      → done 2026-10-08: last week takes Sunday answers/check-ins until Tuesday 23:59 or until exported. "Exported" is a per-device mark in localStorage (`dashboard:life-exported`) set by Export/Share; it does not sync (other device uses the Tuesday cutoff). Follow-ups: label History "until Tuesday", `docs/HANDOFF-life.md` §2.2.
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
- [x] **LF8 Life tests** [sonnet, S] — export round-trip incl. backticks,
      → done 2026-10-08: `life-things-match.ts` extracted, `matchBatch` pure, 10 tests; export round-trip, chart and midnight tests were added earlier.
      `life-things-*` matchers (extract pure fns), `ProgressChart` point
      builder, midnight rollover.

### Dependencies / config

- [x] **D1 `npm audit`: 9 vulns (8 high)** [sonnet, XS] — transitive build-time
      → done 2026-10-08: `npm update` + `npm audit fix` (0 vulnerabilities, 960 KiB precache, 557 tests). `oxlint` is pinned to 1.72.0: 1.87 adds React-compiler rules (`set-state-in-effect`, `purity`) that fail in ~15 existing places (see D4).
      (postcss, source-map-js, browserslist, nanoid, brace-expansion, fast-uri)
      plus `react-router-dom` (RSC-mode CSRF; this SPA doesn't use RSC mode).
      `npm audit fix` + `npm outdated` bumps (supabase-js 2.117, react 19.3,
      vite 8.3, dexie 4.4.6); run check/build; no majors (ts 7, pwa 2).
- [x] **D4 Adopt the newer oxlint React rules** [sonnet, M] — bump oxlint past 1.72 and fix the ~15 `react/set-state-in-effect` and `react/purity` (Date during render) findings in UpdateToast, useOwner, InstallHint, LifeEditor, JoinProject, LocalTransfer, AreaManager, Sharing, Events, TrackersSection, MealDiary, useSections, Habits, TrackerRow; then unpin. Combine with LF2 (`useToday()`), which removes several `Date` calls from render.
      → done 2026-10-08: oxlint 1.87.0 pinned exact. 3 findings fixed properly (InstallHint, useOwner, AreaManager), 8 suppressed with a reason each (false positives for fetch-on-mount and wall-clock effects, or risky rewrites). `useOwner` and `AreaManager` changed logic and have no tests: add a render-test setup (UI1 smoke) when possible.
- [~] **D2 Hosted Supabase settings** [orchestrator/owner] — verified 2026-10-08 (read-only, no secrets
      printed): all 21 migrations applied remotely; every public table has RLS; no write
      policy without WITH CHECK; no SECURITY DEFINER function without a pinned search_path;
      the realtime publication excludes `shop_area_tokens`, `project_invites`, `allowed_emails`;
      as the anon key: every data table answers `[]`/401, `get_invite(random)` = null,
      owner RPCs (`revoke_area_guest`, `rotate_area_token`, `area_share_token`) = permission
      denied; `shop_areas` has no token column; trigger `before_user_created` active; 1 owner +
      1 guest, both with an account (0 whitelisted emails without one). Public auth settings:
      email provider only, signups open (gated by the whitelist trigger).
      STILL UNVERIFIED (needs the dashboard, or the owner's OK to read the CLI token from the
      macOS keychain): OTP expiry (local config says 3600 s, 600 s is tighter), email rate
      limit, MFA on the owner account, redirect URLs.
- [ ] **S1 Turn on "Confirm email" in the hosted Supabase Auth** [owner, dashboard, 1 click] — the public
      auth settings report `mailer_autoconfirm = true`, so an email/password sign-up is confirmed
      instantly and returns a session. With open signups gated only by the whitelist trigger, someone
      who knows an invitee's email could sign up with a password before the invitee's first OTP login
      and get that account (no hijack window is open today: every whitelisted email already has an
      account). Fix: Authentication > Sign In / Providers > Email > Confirm email ON. The OTP-code login
      keeps working. Do NOT use `config push` (project rule). Optional second layer: disable signups
      once the people you want have accounts; re-enable only while inviting.
- [x] **D3 PWA polish** [haiku, XS] — add apple-touch-icon to the manifest,
      → done 2026-10-08 except a dedicated maskable icon (needs a designed asset): apple-touch-icon in the manifest, `engines` node >=22, `.nvmrc`.
      a dedicated maskable icon, `engines`/`.nvmrc` (CI uses Node 22, Mac 24).

## Icons: app icon and per-project icons (proposal 2026-10-08)

The owner uses the app on iPhone, iPad and Mac for every project, wants a
better app icon and a small custom icon per project (projects get created
over time, so it must be part of the registry, not hand work). Preview page
with the options was built locally (not published).

- [x] **IC1 Per-project icon + colour in the registry** [sonnet, S] — add
      → done 2026-10-08 from the owner's picker choice (`scripts/icons/choice.json`): 5 areas with a base colour (utility grey, casa red, organizzazione green, sport sky, svago amber), per-project Lucide icon + sub-colour, `ProjectIcon` solid tile with the sub-colour dot, Home grouped by area (toggle `dashboard:home-grouped`, default on; starred in their own section on top), `new-project --area --icon --color`. Not yet looked at in a browser.
      `icon` (Lucide name, inlined SVG, ISC licence, no CDN, works offline) and
      `color` to `ProjectMeta`; `emoji` stays as the fallback and for shared
      text. A small `ProjectIcon` component (tinted tile) used by Home,
      Settings, Sharing; `scripts/new-project.mjs` + `docs/NEW_PROJECT.md` ask
      for the icon and colour so new projects get one. Recommended style:
      coloured icon on a light tile (b); solid tile with a white icon (c) for
      per-project install icons. Mapping proposed: local-transfer folder-sync,
      shop-list shopping-cart, todo list-checks, climbing mountain-snow, habits
      circle-check, book-ideas book-open, boardgame-ideas dice-5, links link,
      trips plane, events map-pin, meal-diary utensils, life compass, settings
      settings, sharing users.
- [x] **IC2 New app icon** [owner decision, then sonnet XS] — pick one of the
      → done 2026-10-08: owner picked B (Hub). SVG favicon, 192/512, dedicated maskable 512, full-bleed apple-touch-icon, 14 project tiles, manifest shortcuts (Events, Life, Todo, Shop List). Regenerate with `scripts/icons/build-icons.mjs` (README there).
      four drawn directions (A bento, B hub, C 3x3 grid with one lit tile, D
      tile monogram "D") or keep the current 2x2; export 192/512, maskable
      (dedicated safe-zone version), 180 apple-touch-icon, add to the manifest.
- [x] **IC3 Project colour as accent** [sonnet, M] — the project colour tints
      → done 2026-10-08: `--accent` (area) / `--accent-2` (project) from Layout per route; header line, title marker, primary Button, selected Chip, focus rings; AA text colour per area colour (tested). Open follow-ups: inputs and Life/Events selected states still hardcode indigo; `--accent-soft` unused; sidebar tint waits for UI1.
      the header, primary buttons and the sidebar/tab entry (ties into UI1).
- [ ] **IC4 Experiment: one home-screen icon per project** [opus, S] — iOS lets
      → code done 2026-10-08, STILL AN EXPERIMENT until tested on a device: apple-touch-icon and app title follow the current project. Test on iPhone/iPad Safari: open `#/climbing`, Share > Add to Home Screen, check (1) icon = Climbing tile, (2) name = Climbing, (3) it opens Climbing not Home; repeat with `#/todo`; Home must still add as Dashboard. Record each result separately (icon, name and start page can fail independently). If Safari ignores it, delete `homeScreenMeta.ts` and its hook call (see ARCHITECTURE).
      a single page be added to the Home Screen; set `apple-touch-icon` per
      route and test with HashRouter (Safari may ignore it). Manifest
      `shortcuts` for Mac Chrome/Android long-press (iOS does not support them).

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

- [x] **UI1 App shell** [sonnet, M] — from `lg`: persistent left sidebar
      → done 2026-10-08: sidebar from lg (1024px), collapsible rail (`dashboard:sidebar-collapsed`), narrow/wide content per project, skip link, nav landmark; seen in screenshots at 375/820/1180/1440. Owner choices still open: sidebar keeps the fixed registry order (not "most used"), and a hidden project you open shows no sidebar entry. Not built: phone bottom tab bar (not requested). Follow-ups: `new-project` should emit `layout`/`--layout`; sidebar sync-pending indicator.
      (starred projects first, then the rest, plus sync/online status), wider
      content area; below `lg` the current header. Per-page max width: read /
      capture pages (todo, shop-list, habits, climbing) stay narrow; dense
      pages (events, life, meal-diary, sharing) use the full width. Phone: a
      bottom tab bar with the starred projects so you stop going via Home
      (decide with the owner). Benefits every project at once.
- [x] **UI2 Events master-detail** [sonnet, M-L] — the densest, most-used
      → done 2026-10-08: lg+ filter rail | list | sticky detail panel, keyboard Arrow/Home/End/Esc, shared FilterPanel/EventActions/EventBadges; below lg unchanged. Screenshot-checked with a real crawl fixture at 375/820/1180/1440 + dark; not tested on a real iPad/Safari. Open: week/month grid view, `/` to focus search and shift-click multi-select (UI5), some rail labels truncate at 1180.
      list. `lg`+: filters as a permanent left rail (no sheet), list in the
      middle, selected event detail (image, map link, add-to-calendar, marks)
      on the right; optional week/month grid view. Phone: unchanged (list +
      filter sheet). Reuse `EventsList`/`FilterSheet` content.
- [x] **UI3 Life week dashboard** [sonnet, M] — the owner's weekly ritual and
      → done 2026-10-08: week 2 cols at lg / 3 at xl, chart aside, import side by side, History chart beside list. Not seen: the Food section with meals, narrow widths of Import/History at 820/1440 only generated. No separate recap card (WeekRecap stays in Sunday/History).
      the richest data. `lg`+: 2-3 columns (focus + trackers | tasks + check-ins
      | recap + History chart with hover readout); import screen shows plan
      JSON and preview side by side. Phone stays one column (daily taps).
- [x] **UI4 Home "Today" panel** [sonnet, M] — a live summary above the grid:
      → done 2026-10-08: `TodayPanel` (habits, todos, next 3 cached events, Life for the owner, pending sync from `db.outbox`), toggle `dashboard:home-today`, grid 2/3/4 columns. Not seen on screen: the owner-only Life card and the Sync card (no session).
      habits due, next events, Life focus of the day (owner only), pending
      sync state; from `lg` the project grid goes to 3-4 columns. Pure Dexie
      reads, works offline.
- [x] **UI5 Mac pointer + keyboard** [sonnet, M] — `⌘K` jump to project /
      → done 2026-10-08: `useHotkey` + one list `shortcuts.ts`; `⌘K`/`Ctrl K` command palette (fuzzy, accent-aware, also a header button below lg), `?` help sheet, `[` collapses the sidebar, a hidden project you open shows in the sidebar; `/` focuses search and `n` adds on Events/Links/Todo/Shop List/Habits; Events `j`/`k` and shift-click range select; Local Transfer drops files anywhere on the page. Scripted browser checks at 1440 passed. Not done: drag-to-reorder Life tasks (they come from the imported plan: reordering would rewrite the plan, needs a decision), dark-mode shots of the page hints. Known nit: on `/todo` signed-out the email input autofocuses, so plain `?`/`[` are ignored there (`⌘K` still works); consider not autofocusing it. Follow-up: component tests need a render setup (UI palette, sidebar, Today panel).
      search events, `/` focus search, `n` new item, `j`/`k` list navigation,
      `Esc` closes (native `<dialog>` already does), hover affordances behind
      `hover: hover`; drag-and-drop files onto Local Transfer; shift-click
      multi-select in Events; drag to reorder Life tasks.
- [x] **UI6 Cheap grids** [sonnet, S] — Links, Trips, Book/Boardgame ideas:
      → done 2026-10-08: Links/Trips/ideas 2-3 columns, Meal Diary sticky trends beside the list, Sharing two columns. Not seen: the Sharing owner layout (needs a session), an expanded row inside a grid cell, ragged idea-card heights.
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
- [x] **Whitelist-rejection detection is a message-text regex** [sonnet] — DONE 2026-10-09: `isWhitelistRejection` also accepts 500 + `unexpected_failure`, pinned by `sync.test.ts`. —
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

## Life Engines (owner, 2026-11-01, handoff from ~/life)

Monthly audit of seven life areas (physical-health, emotions, mind,
relationships, career, money, environment), scored 1-10, one lead engine per
month, iceberg sheet per engine. Lives in Life → Month only; Habits, Today,
Week, Board and the habit model are NOT touched. Defaults for the open
questions (owner may override): (a) Month view only; (b) scores stay editable
after the month ends; (c) whys show in the sheet only, never in the export.

- [x] **EN1 Engines audit in Life → Month** [opus, M] DONE 2026-11-01 (migration
  pushed, types regenerated; not committed) — Dexie table
  `lifeEngines` keyed `${month}:${engineKey}` (version bump + upgrade test),
  synced via `lifeSync.ts` + owner-only `life_engines` migration, seven cards
  (score stepper, previous score + trend, lead toggle), iceberg sheet, `##
  Engines` in the month export (counts + lever only), documented in
  `.claude/commands/month.md`. Unit tests + one e2e smoke. No personal text.
- [x] **EN2 Engine tag on habits** DONE 2026-11-01 (single tag = one of the 7
  engines; migration pushed, types regenerated; not committed) —
  (owner, 2026-11-01) every habit, existing and new, can carry one engine key
  (optional field `engine` on `habits`, nullable column + migration, picker in
  HabitForm, existing habits untagged until he tags them). Engines audit shows
  the habits of each engine; export gets per-engine habit counts. Questions for
  the owner first: one tag or several? tag = the 7 engines or free labels?

- [x] **EN3 Board: two lifeboards** DONE 2026-11-01 (forever + experiments by
  `kind`, lifetime, legend grouped by engine; not committed) — (owner,
  2026-11-01) in Board, two categories of view: a "lifetime board" with squares
  (one square per period, per habit/engine) and the same for experiments.
  Open questions for the owner when we reach it: what is one square (day, week,
  month)? lifetime = from first log, or a fixed span? experiments = the habit
  cycles, or a new thing? grouped by engine?

- [x] **EN4 Habits import link** DONE 2026-11-01 [opus, M] — (owner, 2026-11-01; freeze of
  30/10 on Habits features lifted by the owner for THIS feature only) a script
  reads `~/life/_sync/habits-plan.json`, prints a `#/habits/import?d=…` link;
  the page previews creates (`+ new`) and updates (before → after, merged onto
  the existing habit by name), applies only on tap via `addHabit`/`updateHabit`,
  idempotent, never archives/deletes, never touches checks. Copy the streaks
  link (`scripts/life-streaks-link.ts`, `streaksLink.ts`, `LifeStreaks`). Spec:
  `~/life/_sync/handoff-dashboard-habits-import.md`. No schema change.

## Phone-first week and home (owner, 2026-11-05)

Context: the owner travels to Milan 9-13 Nov with no Mac. Needs: add focus lines from the phone,
run a week without `/settimana`, rearrange the home, study offline.

- [x] Life: add lines from the phone, done 2026-11-05 (`1babba1`). `AddLine` under Daily focus
      (`!` prefix = Urgenze, appends via `addDayFocus`) and under Weekly focus (`addFocus`, max 3);
      the weekly block shows on an empty week; on a week with no plan the button **Inizia la
      settimana** (`startQuickWeek`) builds a plan from last week's rules and Sunday questions
      (no trackers, tasks or check-ins: habits are live from the Habits page).
- [x] Home: **Riordina** mode, done 2026-11-05 (`6dae66b`, `f6aede9`). ▲▼ moves a section,
      ◀▶ moves a card inside its section, sort option "Mio ordine"; per device in localStorage
      (`dashboard:home-area-order`, `dashboard:home-project-order`).
- [ ] Home follow-ups [owner to decide]: sync stars and order across iPhone/iPad/Mac (needs a synced
      table, migration, owner-only is fine); move a card to another section (the area is a registry
      field today, would need a per-device override).
- [ ] Weekly recap [owner]: the recap for week 2-8 Nov is skipped; plan is a **double recap** when
      back (export weeks 2-8 and 9-15 from History, run `/settimana` over both). The week of 9 Nov
      has no plan until then (the quick week covers it).
- [ ] Milan 9-13 Nov [owner]: no verified board-game/creative event found; Milan is a spot area
      (hand-curated). If the owner finds one, add it with `/add-spot-event`. Frecciarossa times
      were not confirmed (no November timetable found); check Trenitalia.
- [ ] Learning offline before leaving [owner]: after the deploy open the app online on iPhone and
      iPad, accept the update prompt, open one module of each course, test one in airplane mode.
      iOS keeps the Home Screen icon from install time: a new icon needs remove + re-add (sync first).

## From Things: project "Dashboard roadmap" (imported 2026-11-18)

Owner's capture list in Things (id `8XD9VzRW5mZaKzQGpCdzXe`). Things is the inbox; once a to-do
is here it is tracked here. Re-read Things before the next import (owner reorganizes it often).

- [x] TH1 **Daily habits: every past day shows its state** [sonnet, S] (Things: "Abitudini **DONE 2026-11-18** inside HB2 (`displayCell`; missed = light rose ✕; legend row "Missed, not marked").
      automaticamente skippate se non fatte e sono giornaliere"; decided 2026-11-18).
      Owner: a past day of a daily (`target` 7, direction `do`) habit is never blank: missed
      shows as missed (✗), skip shows as skip; **blank only for today**. Stats do NOT change
      (`habitStats.ts` already counts an empty past day as a miss, skip as neutral): this is
      display only, derived, no schema/sync change. Not before the habit started (`createdAt` /
      `cycleStart`) nor after `cycleEnd`/archive. Apply everywhere day cells are drawn: Habits
      page week view + calendar, Life → Habits (`HabitsLiveSection`, `HabitRecap`), Life month
      view. Accept: a test on the derived state (empty past day → 'fail'-looking, today → blank),
      screenshots iPhone width light/dark, `npm run check` + build green.
- [x] HB1 **Vacation for one habit** DONE 2026-11-18 (not committed). Owner: from day X to day Y
      the habit is always a rest day ('skip') with a reason (default 🏖 Vacation, any rest reason),
      whatever the days held before (confirm if some had a state). Future days allowed; "Clear
      these days" empties the range. `setRestRange` / `daysInRange` in `src/lib/habitSync.ts`
      (max 92 days, one upsertMany, synced like any check), `VacationForm` in `HabitDetail.tsx`,
      reason `vacation` in `REST_REASONS`, 4 tests in `habitSync.test.ts`. Audit fixes: planned future
      rest days don't lower the current period yet (`habitRecapData.ts`), the overwrite warning
      counts stored checks only, the calendar browses up to 3 months ahead.
- [x] HB2 **Life → Habits identical to the Habits page** [opus, M] (owner, 2026-11-18). Plan (audit **DONE 2026-11-18** (useHabitDays/deriveHabitDays, HabitsPanel + HabitSheets, Habits.tsx 570→105 lines; Life shows the same panel, defaults to the week tab; reasons kept on re-pick; e2e `habits-panel.spec.ts`). End day = archive day, or cycleEnd only when the verdict is closed.
      2026-11-18, habits + life agents agree), in order:
      a. `habits/useHabitDays(today)` hook: habits, checks, states/notes/counts/slips, boardData,
         wins. Replaces 6 copies of the derivation (Habits.tsx:56-79, HabitsLiveSection:25-36,
         MonthView:163-189 and 259-261, liveHabitRatios x2) and the extra live queries. [sonnet, S]
      b. `HabitsPanel` (tabs today/week/month/board, tiles, legend, archived) + `HabitSheets`
         (slip, pick-reason, reset, detail; one `useHabitSheets` reducer) moved out of Habits.tsx.
         Habits.tsx keeps header, SyncCard, New/Rules, hotkeys (~120 lines). Life =
         `<CollapsibleSection><HabitsPanel viewKey="life:habits-view"/></CollapsibleSection>`.
         Week/month tabs interactive on BOTH pages (today the Habits page week tab shows no counts
         or slips). No more `navigate('/habits')` from Life (a slip tapped in Life is lost today).
         `useToday()` on both (Habits.tsx:51 goes stale after midnight).
      c. `onSetDay` carries a reason; re-picking a day keeps its note (today `setDayState` wipes
         it: a 🏖 Vacation day changed from the picker loses "vacation").
      d. TH1 inside it: pure `displayCell` in habitDayStates.ts (stored state / future / today
         blank / before start / after end / daily `do` habit past empty → `missed`), one
         `habitStartDay`/`habitEndDay` (3 versions disagree today), `missed` in STATE_CELL,
         CELL_STROKE, HabitLegend; used by buildRecap, HabitRecap, tile weekCells, HabitDetail.
      e. MonthView's habits card reuses the panel read-only. Accept: same e2e flow on `#/habits`
         and `#/life` (tap, hold → reason, open detail); check + build; iPhone screenshots.
- [x] TH2 **Refactor: general audit** DONE 2026-11-18 (7 read-only agents). Result: the section
      "Audit 2026-11-18" below. Step 2 (owner picks, one at a time) lives there.

## Audit 2026-11-18 — overlaps, bugs, refactors (from TH2)

Seven read-only audits (Learning, Life, Events, Habits+Meal diary, list projects, app shell,
src/lib+sync). Order: data-correctness bugs first, then the shared foundations the projects keep
re-implementing, then per-project refactors. Do ONE at a time; owner picks.

### A. Bugs that lose or corrupt data
- [x] A1 **Saved quiz answers can point at the wrong option** [opus, S–M]: `learning/courses/kit.ts:29` **DONE 2026-11-18** (author-order index +10 in `selected`, no migration; `engine/quizAnswer.ts`; old rows read safely, not rewritten).
      seeds the shuffle with `id|text`, rows store `selected` as a shuffled index, so any wording
      edit (L16/L22 do this constantly) moves old answers; QuizTab shows ✗ next to "Esatto.".
      Seed by id or store the author-order index; guard old rows; test.
- [x] A2 **Vocabolario progress keyed by theme** [opus, M]: `vocab/progress.ts`, `vocab/store.ts:15` **DONE 2026-11-18** (key `vocabolario:_words:<wordId>.<lang>`; rewrite of old rows through the engine whenever found, idempotent; batched writes; WS0 word moves are now safe).
      key `vocabolario:<themeId>:<wordId>.<lang>`; WS0 word moves orphan known-marks and Ripasso
      drops them. Key by word id + one-time rewrite through the engine. Before more WS0 moves.
- [x] A3 **Outbox shield not scoped to the table** [opus, S]: `cloudSync.ts:536` (and pull shield **DONE 2026-11-18** (`shieldKey(table,rowId)` in pull + realtime; 2 regression tests).
      :473) match `rowId` across tables; `event_marks`/`event_interest` share the event id, learning
      ids repeat across 4 tables. Key by `table\0rowId`.
- [x] A4 **Backup restore bypasses the outbox** [opus, M]: `backup.ts:78-85` bulkPuts without **DONE 2026-11-18** (restore through each engine's `upsertMany` in one transaction; `rowShapeUpgrades` shared with db.ts upgrades; newer local row wins; guests queued too — dead-letter keeps the row, a local-only restore would be wiped by the pull; `files` Blobs left out of backups like sketches).
      queueing → signed in, the next pull deletes restored rows; old backups skip shape upgrades
      (db.ts v3/v5/v9/v15). Route synced tables through `upsertMany`, normalise old shapes.
- [x] A5 **Home habit counts wrong** [sonnet, S]: `homeToday.ts:16-23`, `Home.tsx:188-195` count **DONE 2026-11-18** (`habitProgress` on `deriveHabitDays`, one helper for Home badge + TodayPanel; 12 tests).
      any check as done (rest/missed/partial) and "don't" habits / ended cycles as remaining;
      TodayPanel disagrees. Use the HB2a hook.
- [x] A6 **Wipe device data** [sonnet, S]: `Settings.tsx:151-159` no unsynced warning, unguarded **DONE 2026-11-18** (outbox warning, Dexie first then `clearKeysExcept` keeping the Supabase session, armed resets after 5 s/blur).
      `localStorage.clear()` (signs out, half wipe if storage blocked), armed state never resets.

### B. Small bugs, one batch per project [sonnet, S each]
- [x] B1 Events: date chip remembered across days (`useEventFilters.ts:100,124`, don't store **DONE 2026-11-18** (chip not stored, Rome day in marks, Shows merges custom events, comments).
      `chip`); `marks.ts:140` isPastEvent uses device day not Rome; Spettacoli ignores hand-added
      events (`Shows.tsx:76`); stale comments Events.tsx:61,125.
- [x] B2 Learning: Ripasso count home vs page (`TodayBlock.tsx:68` no `keep` filter); Today frozen **DONE 2026-11-18** (`review/content.tsx` useReviewQueue shared by home and page; useToday; resets remove Ripasso rows; `resetWrongQuiz` still leaves them — follow-up).
      (`TodayBlock.tsx:67`, `ReviewPage.tsx:186`); Vocab deck end links to Ripasso; `setWordKnown`
      writes per language outside a transaction; per-module resets leave `learning_reviews` rows.
- [x] B3 Shell: page opens of sub-pages not counted (`Layout.tsx:40` exact match); sidebar **DONE 2026-11-18** (`activeProjectId` in Layout, `useAreaOrder` shared by Home + Sidebar, `PRIVATE_DATA_LABEL`, shared Chip in Sharing, `downloadBlob`, accent tokens on Home).
      ignores Home area order (`navModel.ts:23`); reverse no-op in "Mio ordine" (`Home.tsx:154`);
      private-data texts omit Learning (Settings.tsx:91,103, SyncCard.tsx:138); Sharing chips
      without aria-pressed/✓; downloads revoke the URL right after click (Safari) →
      `downloadBlob()`; Home dead `planned` branch + hard-coded indigo.
- [x] B4 Lists: shop items deletable only by swipe (`ShopList.tsx:97`); climbing delete without **DONE 2026-11-18** (shop ✕ button, climbing Undo + `restoreSession`, hotkeys, idea titles editable via `updateText`, subtitles).
      Undo / with confirm (`SessionCard.tsx:56,134`); hotkeys missing on IdeaList/Trips/Climbing;
      idea titles not editable (`IdeaList.tsx:111`); "Saved on this device" copy on synced pages.
- [x] B5 Habits: experiments past `cycleEnd` but not archived still count misses; `habitStats` **DONE 2026-11-18** (tile "Cycle ended Nd ago: judge it"; habitStats already once per tile; MealDiary on useToday).
      twice per tile (Habits.tsx:184,188). Meal diary: `new Date()` in render (MealDiary.tsx:28).

### C. Shared foundations (each removes N copies)
- [x] C1 **`src/lib/dates.ts` is the one date module** [sonnet, S–M]: move `life/model/dates.ts` **DONE 2026-11-18** (`adb8bf5`; relativeTime x2 kept: different wording; backup filename keeps UTC date).
      in (re-export), add `monthKey`, keep events' Rome/UTC variants as named exports; replace
      addDays x7, weekStart x4, daysBetween x3, inline YYYY-MM-DD x5 (incl. `habitSync.ts` daysInRange),
      the two `formatDate` (rename `format.ts` one to `formatDateTime`), relativeTime x2. Move
      `useToday` to `src/lib`. Reference: `life/model/dates.ts` + its tests.
- [x] C2 **UI kit** [sonnet, S each]: `SegmentedTabs` (roving focus; 7 copies: Habits, ModulePage, **DONE 2026-11-18** (`35c1575`, `e07d8a7`, last commit: SegmentedTabs on 5 of 7 (Home and WeighedToggle are not single-choice), CollapsibleSection, BackLink, field.ts, SectionTitle, Switch, Stat, useLongPress, useModalDialog, Learning FlipCard (not Ripasso); events FilterPanel keeps its own Section; inputs now 16px on phones).
      VocabPage, Events, PeoplePicker, MealParts, Home), `CollapsibleSection` (Life + events
      FilterPanel), `field.ts` input/select/date classes (10 constants, 48 inline), `SectionTitle`
      (18), `Switch` (4), `Stat` (2), `useLongPress` (2), `FlipDeck` (3, learning), `PageHeader`
      `back` prop (6 learning pages), `useModalDialog` (Sheet + CommandPalette).
- [x] C3 **`useConfirm()` dialog** [sonnet, M]: replaces 13 `window.confirm` + 3 two-tap buttons; **DONE 2026-11-18** (`289c667`, `confirm()` + ConfirmHost).
      duplicated confirm texts move to `privateData.ts` / `syncHealth.ts`.
- [ ] C4 **One engine registry `lib/engines.ts`** [opus, M]: App.tsx start list, `syncHealth`
      watchedEngines, `privateData` local/remote lists derive from it; test vs registry `ownerOnly`;
      NEW_PROJECT gains the step. Trim the unused `flush`/`useStatus` exports of the 16 wrappers.
- [x] C5 Text helpers [sonnet, XS]: accent fold (10 copies → `fuzzy.normalize`), FNV hash (3), **DONE 2026-11-18** (`4102c60`).
      `useLazyChunk`, image downscale (learning `photo.ts` = events `image.ts`), Things URL (2),
      `useLinkImport` for the 4 "?d= link → preview → Save" screens (caps differ).
- [ ] C6 Shared auth/owner store [opus, M]: 26 `useAuth` subscriptions; `useOwner` refires the
      `is_owner` RPC on every token refresh per mounted user. One `useSyncExternalStore`.
- [ ] C7 Shared OTP login form + `friendlyError` [opus, M]: JoinProject, JoinArea, SyncCard;
      email normalised differently (SyncCard trims only).

### D. Per-project refactors
- [ ] D1 **`ListPage<T>`** [opus API, sonnet ports, M]: generalise `IdeaList` with optional done
      sections, notes, editable title, tags (from links), people (from trips), groups, random pick;
      `useGuestViewer()` + list empty state (7 copies). Then Todo, book/boardgame, later Shop.
      Makes gift ideas / places / climbing wishlist config-only. Then update the scaffolder
      (`scripts/new-project.mjs:135+`, dark-only classes).
- [ ] D2 **Events vocabulary single source** [opus, M]: categories, areas, subcategories and one
      `places.ts` row per town in `src/projects/events/shared/`, imported by `scripts/events/*`
      (5 town tables today). Then split `model.ts` (513) and slim `Events.tsx` (700; reuse
      `useInterestRows`); move the `_site.yml:86-98` inline validator to a script.
- [ ] D3 **Life** [sonnet]: ~~lazy the `courses` import in `WeekBody.tsx:5`~~ DONE 2026-11-18 (registry +
      `useLoadCourses`; precache 3825 → 1684 KiB, 13 course chunks runtime-cached; e2e Life offline); delete unused `week/ChoresSection.tsx` [XS]; split `lifeSync.ts` (906) after C4 [M].
- [ ] D4 **db.ts version blocks** [opus, S]: 690 lines repeat every table per version; keep only
      changed tables, `db.upgrade.test.ts` as net.
- [ ] D5 `transferSync` [opus, S–M]: offline delete leaves Storage objects, errors swallowed,
      not in sync health.
- [ ] D6 DX [sonnet, S]: vitest `include` without `*.test.tsx` (blocks render tests, F1);
      pre-commit could run `vitest related`; lazy supabase client (L7 half); e2e not in CI.

### E. Owner decisions (asked one at a time when reached)
- [x] E1 Streaks app import → **owner 2026-11-18: retire it.** Task E1a below.
- [x] E1a **Retire the Streaks import** [sonnet, S, after HB2]: drop streaks from the `/oggi` link **DONE 2026-11-18** (route, skill, `/oggi` part, "Old habits" removed; parser kept for `/settimana` import + History; Sunday "why" no longer counts Streaks misses). Then (owner, same day) removed from `/settimana` round trip, Month view and `/month` too; old week JSON with `streaks` still imports (field ignored); stored rows kept, no longer rendered (History chart fallback dropped).
      (`scripts/life-oggi-link.ts`, `LifeToday.tsx`), the `/streaks` skill and route, "Old habits"
      on the live week (`WeekBody.tsx` ~189-213: TrackerRow live branch, StreakRow,
      useStreakList); History keeps its read-only branch; update HANDOFF-life + docs.
- [x] E2 Learning L7/L8 tied to the Open Move interview → **owner 2026-11-18: keep both.**
- [x] E3 "Ideas / later" → **owner 2026-11-18: regroup as proposed** (done: keep as list configs,
      folded, real projects; dropped ones archived).
- [x] E4 PWA precache of course chunks → **owner 2026-11-18: opened courses + a button.**
- [x] E4a **Courses cached when opened, plus "Scarica per offline"** [opus, S–M, after A2]: in **DONE 2026-11-18** (`learn-course-*`/`learn-vocab-*` chunks runtime-cached CacheFirst unless statically imported; `home/OfflineDownload.tsx`; 2 e2e). Saving only lands with D3 (WeekBody static `courses` import pins 10 chunks): 3.8 MB → ~1.7 MB.
      `vite.config.ts` (vite-plugin-pwa/workbox) keep course content chunks out of the precache
      (globIgnores by chunk name) and serve them CacheFirst via runtimeCaching; a course opened
      online once works offline. Learning home gets a "Scarica per offline" button that loads
      every course chunk (call each registry loader) so the runtime cache fills, with a done
      state. App shell, engine and Ripasso stay precached. Note: deliberate exception to "every
      page fully offline" for courses never opened (owner choice). Verify with a build: precache
      count/size before vs after; offline test of an opened vs unopened course.

### F. Roadmap/doc hygiene [orchestrator, S]
- [ ] F1 Tick/compact stale items: Learning R5, L17 → R4/R6/R7, refactor-plan header :428, all
      "not committed" notes, title +Russo, archive L19 a–f, L18b; Life :682, :585 → one [owner]
      line, LF5 "Tuesday"; Home :1645 (stars sync done), :550 backup follow-up, IC3 notes, L9 →
      won't-fix; F1/L10 reopen-or-split; Milan items past; Events section ~290 → ~25 lines
      (archive [x] blocks, facts to docs/EVENTS.md; open: recurring places [owner], spot.json
      cleanup (local entries → curated, ~20 past), source follow-ups, interest follow-ups
      (snapshot subcategory, zod to deps, seed alias)). Delete `docs/learning-drafts/francese.c.{1,2}.ts`.
- [ ] F2 Docs: CLAUDE.md "cloudSync (once landed)"; ARCHITECTURE.md `.claude/` + sync.ts;
      HANDOFF-life.md (decision 6, §2.2, Streaks, nothing on HabitsLive/Engines/ScreenTime);
      COURSES.md "locked until Rifai"; db.ts:41 climbing "local-only"; learning store comments.

## Strumenti 🧰 (owner, 2026-11-20)

Owner wants small self-contained tools in their own section: one home tile **Strumenti** opens
`/strumenti`, a picker listing the tools (Local Transfer, Zine, future ones). Hard requirements:
every tool works **offline** and **signed out**, and is **shareable with friends by plain link**
(no login, no invite, like Events `public: true`). Tools keep their own paths (`/local-transfer`,
`/zine`); a tool is a registry entry with `tool: true`, hidden from the home grid and sidebar,
listed in the picker. Local Transfer keeps id, path and its cloud sharing (project_members): its
local part already works for anyone with the link; the cloud part still needs an invite.

- [x] T1 Strumenti section [sonnet, S], done 2026-11-20 (build + 1507 tests green; tool routes
      highlight Strumenti and count its opens; Strumenti also listed as public on /sharing): `tool?: boolean` in `ProjectMeta`; registry entry
      `strumenti` (area utility, path `/strumenti`, `public: true`); `local-transfer` gets
      `tool: true`; Home and sidebar skip tools; picker page `src/projects/strumenti/` with one
      card per tool (Local Transfer card shows the file stats Home showed) and a **Condividi
      link** button (Web Share, copy fallback) giving the plain `#/<path>` link.
- [x] T2 Zine in the dashboard [opus, M], done 2026-11-20 (Playwright: 8-page booklet = 4 A4 PDF
      pages 8|1 2|7 6|3 4|5, works offline from the SW; own ~70-line PDF writer instead of jsPDF;
      modern-screenshot at 250 dpi; @fontsource woff2; fixed white-as-transparent over paper and
      tape handles; Chromium only, Safari unverified): port `public/tools/zine/` (vanilla editor, untracked)
      to `src/projects/zine/` as a module mounted by a React page `Zine.tsx` (no iframe); fonts
      self-hosted (no Google Fonts) so it works offline; keep its own IndexedDB store; **Scarica
      PDF** button: imposed sheets rendered client-side to a PDF file (iOS: share sheet with the
      file, else download); keeps the print path too. `public/tools/` deleted 2026-11-20 (owner OK).
- [x] T3 Wire Zine [orchestrator, XS], done 2026-11-20 (also restored the /strumenti route lost
      when T2 reverted its temp route; tile PNGs for strumenti + zine via choice.json): registry entry `zine` (`tool: true`, `public: true`,
      path `/zine`), route in `App.tsx`, build, offline check.
- [ ] T4 Real-device pass [owner]: iPhone/iPad open a tool link signed out, airplane mode,
      Scarica PDF.
- [x] T7 Zine on iPhone/iPad [opus, M] (owner, 2026-11-20), done 2026-11-20 (WebKit iPhone 13/15 +
      iPad 11 portrait/landscape flows green, PDF in WebKit 4 A4 pages; iOS keyboard untested -> T4): phone = compact top bar +
      bottom toolbar, one page fitted with swipe, properties and pages as bottom sheets; iPad portrait
      roomy, landscape three columns; pinch/rotate on the selected element; verified in WebKit.
- [ ] T8 Zine touch follow-ups [sonnet, each XS-S, optional]: drag-to-reorder thumbnails in the
      pages sheet; bigger page in iPhone landscape (hide the dashboard header on /zine there);
      text glyph instead of the trash emoji in the sheet header.
- [x] T9 Zine images, every format (owner, 2026-11-20) [orchestrator], done 2026-11-20: native decode, then
      HEIC via heic-to (3 MB chunk `zine-heic`, runtime-cached, not precached), TIFF via utif2, PSD composite
      (own decoder), camera RAW via embedded JPEG preview; drop anywhere in the editor, window swallows near
      misses; error alert by file name. Not supported: JPEG 2000.
- [x] T10 Zine draggable margins [opus, M] (owner, 2026-11-20), done 2026-11-20 (`margins.ts`, Chromium +
      WebKit iPhone/iPad flows; follow-ups: reset button, page numbers follow margins): four margins (top, bottom,
      outer, spine) dragged on the page guides, mirrored per side, four inputs in settings.
- [ ] T11 Zine text manipulation (owner, 2026-11-20, all four wanted; ONE builder at a time, in order,
      after T10 since all touch editor.ts):
  - [ ] a [opus, S] (stopped by owner 2026-11-20; the half-done work was removed from the tree, restart from
        scratch) Spacing and lines: letter spacing, line height, uppercase, outline, shadow.
  - [ ] b [opus, M] Deform by hand: stretch/squash (scaleX/scaleY) and skew with handles and fingers.
  - [ ] c [opus, L] Per-word style: select part of the text and change font, colour, size, bold,
        underline (rich runs in the doc; ransom mode, print and PDF must still work).
  - [ ] d [opus, M] Zine effects: text on a curve/circle, vertical text, smudged/crooked photocopy letters.
- [ ] T5 Zine e2e [sonnet, S]: test in `e2e/` that clicks Scarica PDF and checks page count and
      MediaBox; adapt the T2 Playwright scripts (session scratchpad, may be gone: rewrite).
- [ ] T6 Zine "Qualità" option [sonnet, XS, optional]: 200 / 300 dpi in the PDF dialog.

## Measured habits 📏 (owner, 2026-11-22)

"Non estendere telefono" (avoid habit) reads as kept whenever the owner forgets to mark a slip,
which is exactly the days they scroll. Owner wants the habit **verified from data**: the screen
time entered in the Sunday check (Life week, `screen-avg` / `screen-total`, `model/screenTime.ts`)
gives a daily average for the week; over the limit = the week failed. Phone only for now (steps,
weight later, same field). Unentered = **unverified**, never counted as a success.

- [x] M1 App-limits-verified habit [opus, M], done 2026-11-22 (migration 20261122120000_habit_measure pushed + db:types; 1558 tests, build green; UI not browser-checked; Lifeboard and tile streak stay ticks-only on purpose; limits plan in ~/life/_sync/habits-plan-app-limits.json, apply by link after deploy) (redesigned 2026-11-22: the habit is "don't press
      extend 15 min" on iOS app limits — Tinder 10, YouTube 40, Reddit 20, Instagram 15, Hinge 10,
      Baba Is You 30 min/day): `Habit.measure?: 'app-limits'` + `measureLimits?: {app, minutes}[]`;
      migration `measure text` + `measure_limits jsonb`, `habitSync.ts` mapping. From the Sunday
      top-apps answer (`parseApps`, weekly minutes): per limited app, min extensions =
      max(0, ceil((weekly - 7×limit) / 15)); week slips = max(manual ticks, verified sum), then the
      normal grace rule. No top-apps answer = unverified (never a success). Manual ticks stay.
      HabitForm: "Verifica: a mano / limiti app" + app/minutes rows. Recap, tile, week + month
      exports show manual vs verified and which apps went over. Offline/signed out (Dexie only).
      Also: the Sunday top-apps question always shows a locked row per limited app (minutes
      required, 0 ok; apps cap 7 + limited apps), and the habits plan import accepts `measure` +
      `measureLimits` so the orchestrator can set limits by link (owner added Bumble 10 min).
      Habits with `measure` carry a "complessa" tag (tile, list, detail, export bracket) and
      HabitDetail gets a per-app view (limit, weekly minutes vs 7×limit, min extensions, recent weeks).
- [ ] M2 Habit detail route [opus, M] (after M1; owner 2026-11-22): every habit, simple or
      complex, gets a page `/habits/:id` (route in App.tsx, HashRouter, works offline/signed out,
      unknown id → back to /habits). The page = overview (stats, month calendar with day states,
      suggestions, recap) + granular management (rest ranges, archive/delete, per-measure view and
      editors such as M1's AppLimitsView / limits editor, keyed on `measure`). The sheet opened
      from a tile shrinks to the basics (name, emoji, target/grace, quick day state) plus an
      "Apri dettaglio" link. Today's `HabitDetail` sheet (via `HabitSheets.tsx`) is the source to
      split. Back button returns to /habits; 40px targets, safe areas.

## Ideas / later

- [ ] **🤝 Sharing review: what can be shared, and better ways to do it** [opus]
      (noted 2026-10-27). Today sharing is two systems (`project_members` per
      project on `/sharing`, `shop_area_members` per shop area) plus the
      owner-only tables. Gaps seen: `/events` is public but your own marks, 👍/👎,
      interest profile and custom events are owner-only (`is_owner()`), with no
      way to hand someone a read-only list or give a guest their own marks.
      Goal: an analysis first, no code: (1) a table of every project and table
      → private / owner-only / per-project members / public; (2) which should
      be shareable and how (read-only link, per-user rows like `project_prefs`,
      per-project invite); (3) a proposal in the order of value per effort.
      Decide with the owner before building anything.
      Analysis written 2026-10-29 in `docs/SHARING_REVIEW.md`; awaiting the
      owner's decision on which proposal to build.
- [ ] **🕸️ People graph: who brings whom, who to invite** [opus] (noted
      2026-11-18, parked: decide at the owner's monthly review, 2026-12-06 or
      later; no code before that). A view, not a new place to type: nodes =
      people, groups by origin (school, places, work, family), edges = "met
      through" + "seen together" counted from the owner's meetings log,
      plus who organised (🙋‍♂️ / 📩) and "not seen for 3+ weeks" in red.
      Purpose: pick who to invite together and spot bridges/isolated people.
      Open question first (owner): what actually brings new people in; the
      "places with a regular slot" reading was rejected. **Personal data:
      owner-only Supabase rows, never in this public repo** (no names in
      code, seeds, tests or docs). Try first as a private page generated from
      the log; build here only if it gets used.

Candidate new subprojects (brainstormed 2026-07-04; regrouped with the owner 2026-11-18 after the
audit, see "Audit 2026-11-18" D1). Dropped ideas are archived in `docs/ROADMAP_ARCHIVE.md`.

**Cheap once `ListPage<T>` (D1) exists — config only:**

- [ ] **🎁 Gift ideas** [sonnet] — per-person gift jottings year-round, mark
      bought/given. Deliberately NOT shared (the giftee must never see it):
      local-only or owner-only sync. Simplest possible table. Effort S.
      *Top pick of this batch.*
- [ ] **🗺️ Places wishlist** [sonnet] — restaurants/trips/spots to try, with
      visited flag and a "pick one at random" date-night button;
      `todos`-shaped, couple-shareable. Pairs with the reading list idea.
      Effort S.
- [ ] **🎯 Climbing wishlist** [sonnet] — "want to climb" list that links to a
      `climbs` entry when sent. Effort S–M.
- [ ] **🎒 Gear tracker** [sonnet] — climbing gear wear/retire dates,
      cross-referencing `climbSessions` counts. Effort M.

**Folded into existing projects:**

- [ ] **📚 Reading / watch list → Links** [sonnet, S]: a "pick at random" button and entries
      without a URL (a `kind` tag), instead of a new project.
- [ ] **🧳 Packing lists → shop-list areas** [sonnet, S]: "duplicate area" and "uncheck all".

**Real projects (own data model):**

- [ ] **💰 Expenses / shared budget** [opus] — couple-shared ledger with
      who-paid and running balance (mini Splitwise). Reuses the shop-list
      area-sharing + outbox pattern almost exactly. Effort L. *Top pick.*
- [ ] **🍲 Meal planner + recipe box** [sonnet CRUD, opus for shop-list
      integration] — (the diary above covers logging only) plan the week, "add ingredients to shop list" button
      writing into `db.shopItems`. Effort M–L. *Top pick.*
- [ ] **🥫 Pantry inventory** [opus for the shop-list bridge] — what's in the
      house, optional expiry dates, one-tap "running low → add to shop list"
      writing into `db.shopItems`. Third leg of the shop-list + meal-planner
      triangle. Effort M. *Top pick of this batch.*
- [ ] **🗓️ Countdowns & dates** [sonnet] — birthdays, renewals, trips; home
      grid badge shows the nearest one ("Trip in 12d"), reusing the live
      badge pattern. Effort S.
- [ ] **🧹 Chores rotation** [sonnet] — recurring household tasks that
      alternate between partners ("whose turn is the bathroom"); shared and
      assignable, unlike habits; reuses `project_members` sharing as-is.
      Effort M.
- [ ] **🔁 Subscriptions + 🚗 Vehicle log as one "recurring due" engine** [sonnet/opus] — both are
      next-due rollups (bills, revisione, bollo, insurance, service). Build one engine, two views.
      Original notes in the archive. Chores needs a shared people table (from trips companions).

- [x] **🔍 On-device data view in Settings** [sonnet] — DONE 2026-10-09 (`DataView.tsx`: rows per table, outbox per table, rejected entries read-only, per-engine Retry all / Discard all; per-entry actions would need an engine API, so the per-entry part of the dead-letter item stays open). Original: — *to evaluate
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

- [x] Export/import all local data as a backup file [sonnet] — Settings → Backup (`src/lib/backup.ts`); merges on import, skips the outbox. Done 2026-10-09.
- [x] Global sync-health strip [opus] — `SyncHealth` in Layout watches every engine (`src/lib/syncHealth.ts`; new engines go in `watchedEngines`); engine status gained `retrying` and `pullFailed`. Done 2026-10-09.
- [x] Playwright e2e of the offline, signed-out path [sonnet] — `npm run e2e` (not in `npm run check` or CI). Done 2026-10-09.
- [ ] E2E encryption for synced files [opus]
