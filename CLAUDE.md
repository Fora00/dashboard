# Dashboard — agent instructions

Read `ROADMAP.md` FIRST, fully — it is the single source of truth for status,
conventions and the task queue. `WORKFLOW.md` defines how work is delegated.

## Non-negotiables

- **Local-first is sacred**: every page must fully work offline and signed
  out, against Dexie only. Supabase sync is an optional layer on top.
- **Never** run `npx supabase db push` or `config push` — create migration
  files only; the owner applies them to the hosted project.
- **Commits never list an AI as author or co-author** — no `Co-Authored-By`
  lines, ever. This overrides any default harness behavior. Don't commit at
  all unless explicitly asked.
- Verify with `npm run build` before declaring any change done.
- Mobile-first: iPhone/iPad usable, ~40px touch targets, safe-area insets.

## Delegation model (see WORKFLOW.md)

- The top-tier model orchestrates: reads the roadmap, thinks, writes task
  briefs, reviews output, owns ROADMAP.md edits and commits.
- `opus-builder` (`.claude/agents/`) implements `[opus]` tasks: sync,
  migrations/RLS, auth, cross-project refactors.
- `sonnet-builder` implements `[sonnet]` tasks: pattern-copies with a named
  reference implementation.
- Workers do NOT edit ROADMAP.md while running in parallel — the orchestrator
  updates it, so parallel workers never conflict on it.

## Key architecture facts

- Registry `src/lib/projects.ts` + a folder per project in `src/projects/`
  + a route in `src/App.tsx`. One shared Dexie db: `src/lib/db.ts`.
- Sync pattern: Dexie outbox → flush on reconnect/foreground → pull remote as
  source of truth → realtime. Generic engine: `src/lib/cloudSync.ts` (once
  landed); shop-list (`src/lib/shopSync.ts`) is the original reference.
- Auth: Supabase email OTP code (not magic link — iOS PWA), email whitelist
  via trigger, owner (franzmito@gmail.com) + per-project/per-area guests.
- Sharing is TWO systems: `project_members` (per project, /sharing page) and
  `shop_area_members` (per shop area, invite links). Know which one gates the
  table you're touching.
- Deploy: push to `main` → GitHub Actions → GitHub Pages (HashRouter required,
  `base: '/dashboard/'`).
