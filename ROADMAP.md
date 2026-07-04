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

## Project 1 — Dashboard shell (entry point)

- [x] Scaffold Vite + React + TS + Tailwind v4
- [x] Hash routing with shared `Layout` (header, online/offline badge)
- [x] Home page rendering the project registry with live cross-project stats
- [x] Shared components: `Button`, `Card`, `PageHeader`, `EmptyState`, `OnlineBadge`
- [x] PWA: manifest, icons, offline precache (`vite-plugin-pwa`, autoUpdate)
- [x] Placeholder app icons (solid rounded square)
- [ ] Nicer app icons / branding
- [ ] Settings page (storage usage, clear data, sync status)

## Project 2 — local-transfer (offline file stash)

- [x] Add files via tap or drag&drop, stored as Blobs in IndexedDB (`db.files`)
- [x] List with size/date, download, delete
- [x] Native share sheet (`navigator.share`) — AirDrop/apps on iOS/macOS
- [x] Persistent-storage request so iOS doesn't evict data
- [x] Online/offline awareness (badge + copy)
- [ ] Upload to Supabase Storage when online (`synced` flag + `remoteUrl` are already in the schema)
- [ ] Shareable download links for uploaded files
- [ ] Auto-sync queue on reconnect (`online` event)

## Project 3 — shop-list (sharable groceries)

- [x] Route + placeholder page; `db.shopItems` schema exists
- [ ] Add/check/uncheck/delete items (local-first against `db.shopItems`)
- [ ] Sync via Supabase table + realtime
- [ ] Guest sharing: whitelist a guest email (girlfriend) with read/write on this project only

## Infrastructure

- [x] GitHub Actions workflow to deploy `dist/` to GitHub Pages on push to `main`
- [x] Local git repository with initial commit
- [ ] Create GitHub repo named `dashboard` and push (needs owner: `gh` CLI not installed)
- [ ] Enable Pages (Settings → Pages → Source: GitHub Actions)
- [ ] **Supabase project** (owner must create it, free tier):
  - [ ] Auth: magic-link login; `allowed_emails` whitelist table + RLS
  - [ ] `project_members(project_id, email)` for per-project guest access
  - [ ] Storage bucket `transfer` for local-transfer files
  - [ ] `shop_items` table with realtime + RLS by membership
  - [ ] Put `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local` and in repo Actions secrets
  - [ ] Implement client in `src/lib/sync.ts` (`npm i @supabase/supabase-js`); login screen gating sync only (local mode always works)

## Ideas / later

- [ ] More projects (add to `src/lib/projects.ts`)
- [ ] Export/import all local data as a backup file
- [ ] E2E encryption for synced files
