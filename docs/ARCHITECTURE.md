# Architecture map (for humans and agents)

Where things live. Rules and non-negotiables: `CLAUDE.md`. Status and task
queue: `ROADMAP.md` (`npm run roadmap` lists the open tasks).

## Layout

| Path | What |
|---|---|
| `src/lib/projects.ts` | Registry (home grid); `isInvitable()` decides what `/sharing` can grant |
| `src/App.tsx` | One route per project (HashRouter, `base: '/dashboard/'`) |
| `src/projects/<id>/` | One folder per project (UI, model, tests) |
| `src/lib/db.ts` | The ONE shared Dexie database (local-first, every page works offline/signed out) |
| `src/lib/cloudSync.ts` | Generic sync engine: Dexie outbox, flush on reconnect/foreground, pull remote as truth, realtime |
| `src/lib/*Sync.ts` | Per-project glue on top of the engine (below) |
| `supabase/migrations/` | SQL only; the owner applies it (never `db push`) |
| `scripts/events/` | Events crawler (adapters, pipeline, `spot.json`); output `public/events.json`, see `docs/EVENTS.md` |
| `scripts/new-project.mjs` | Scaffolder behind `docs/NEW_PROJECT.md` |
| `.github/workflows/` | `deploy.yml` (push, reuses published events.json), `crawl.yml` (daily crawl), `_site.yml` (shared build/deploy); see `docs/CI.md` |

## Sync files and their tables

| File | Remote table(s) |
|---|---|
| `shopSync.ts` | `shop_areas`, `shop_items` (original reference implementation) |
| `todoSync.ts` | `todos` |
| `habitSync.ts` | `habits` |
| `climbSync.ts` | `climb_sessions`, `climbs` |
| `bookIdeasSync.ts` / `boardgameIdeasSync.ts` | `book_ideas` / `boardgame_ideas` |
| `linksSync.ts` | `links` |
| `tripsSync.ts` | `trips` |
| `customEventsSync.ts` / `eventMarksSync.ts` | `custom_events` / `event_marks` (+ `event_prefs`) |
| `lifeSync.ts` | `life_entries`, `life_weeks` (owner-only) |
| `transferSync.ts` | transfer files (signed links) |

## Who can see a table (two systems, know which)

- **`project_members`**: per project, managed on `/sharing`, plus per-project
  invite links (`#/join/p/<token>`). Applies to almost every synced project.
  A new synced project needs a row in `public.shareable_projects`.
- **`shop_area_members`**: per shop area (shop-list only), its own invite links.
- **Owner-only**: Life (`ownerOnly` in the registry), settings is device-only.

## Auth

Supabase email OTP code (not magic link: iOS PWA), email whitelist enforced by
a trigger. Owner plus per-project/per-area guests.

## Which doc for which job

| If you are... | Read |
|---|---|
| Starting any session | `CLAUDE.md`, then `npm run roadmap` |
| Adding a project | `docs/NEW_PROJECT.md` (or `npm run new-project`) |
| Touching events (adapters, tags, spot) | `docs/EVENTS.md`; coverage notes in `docs/EVENTS_CENSUS.md` |
| Touching CI / deploy | `docs/CI.md` |
| Touching Life | `docs/HANDOFF-life.md` |
| Delegating work | `WORKFLOW.md` |
| Looking for how something old was decided | `docs/ROADMAP_ARCHIVE.md` |
