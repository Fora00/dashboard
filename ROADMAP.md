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

- [x] Route + page; `db.shopItems` schema exists
- [x] Add/check/uncheck items, clear bought (local-first against `db.shopItems`)
- [x] Sync via Supabase table + realtime (`src/lib/shopSync.ts`: Dexie outbox →
      flush on reconnect/foreground, pull remote as source of truth, realtime
      channel; UI unchanged, still local-first)
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

## Ideas / later

- [ ] More projects (add to `src/lib/projects.ts`)
- [ ] Export/import all local data as a backup file
- [ ] E2E encryption for synced files
