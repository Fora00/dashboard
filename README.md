# Personal Dashboard

Personal hub for small subprojects (file transfer, shop list, to-dos, habits,
climbing, Life, meal diary, events, …), built as an offline-first PWA and
published on GitHub Pages.

Every page works offline and signed out, against a local IndexedDB (Dexie).
Supabase sync is an optional layer on top: sign in with an email code and
data syncs across devices.

**Status and next steps live in [ROADMAP.md](ROADMAP.md). Read it first.**

## Run

```sh
npm install        # also installs the git pre-commit hook (npm run prepare)
npm run dev        # local dev server (Vite)
npm run build      # type-check + production build
npm run check      # lint + format check + typecheck + tests (pre-commit runs this)
npm run test       # unit tests (Vitest)
npm run preview    # serve the production build locally
```

Run `npm run build` before declaring a change done.

## Supabase setup

Sync needs a hosted Supabase project. The browser reads two Vite variables,
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, from a git-ignored
`.env.local`. Without them the app runs local-only.

- Architecture, sync files and who can see which table: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Schema lives in `supabase/migrations/` (SQL only). The owner applies new
  migrations with `npx supabase db push`, then regenerates the typed client
  with `npm run db:types`.
- Never commit secrets: no keys, tokens or `.env*` files with real values.
  Only the anon key ships to the browser; row-level security does the rest.

## Events crawler

`npm run events:crawl` fetches public event sources (Trentino, Bolzano,
Verona) and writes `public/events.json`. A daily GitHub Actions job runs it
and deploys the result. Adapters, tags and the hand-curated `spot.json` are
documented in [docs/EVENTS.md](docs/EVENTS.md).

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml` (Pages source must be set to "GitHub Actions").
Workflows are described in [docs/CI.md](docs/CI.md).

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build the production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |
| `npm run format` | Format the code with oxfmt (writes files) |
| `npm run format:check` | Check formatting with oxfmt, without writing |
| `npm run test` | Run the unit tests once (Vitest) |
| `npm run check` | Lint, format check, typecheck and tests; the pre-commit gate |
| `npm run prepare` | Point git at `.githooks/` (runs on `npm install`) |
| `npm run roadmap` | List open ROADMAP.md tasks (`-- <word>` filters by section) |
| `npm run new-project -- <id>` | Scaffold a new project (`--synced`, `--name`, `--emoji`); see [docs/NEW_PROJECT.md](docs/NEW_PROJECT.md) |
| `npm run events:crawl` | Crawl event sources and write `public/events.json` |
| `npm run life:link -- <week.json>` | Validate a Life week and print its import link |
| `npm run life:things-lists -- <week.json>` | Resolve Life tasks to Things list ids (read-only, macOS) |
| `npm run life:things-status` | Report what happened in Things to the tasks a Life week sent (read-only, macOS; reads an export on stdin) |
| `npm run db:types` | Regenerate `src/lib/database.types.ts` from the hosted Supabase schema (owner, after a push) |
