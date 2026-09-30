# CI, deploy and PWA updates

## Workflows (`.github/workflows/`)

| file | trigger | events.json | time |
|---|---|---|---|
| `deploy.yml` | push to `main` | reused from the published site | seconds |
| `crawl.yml` | daily cron 04:23 UTC, manual dispatch | freshly crawled | minutes |
| `_site.yml` | `workflow_call` only | `events: crawl` or `reuse` | shared steps |

Shared steps (`_site.yml`): `npm ci`, `npm run lint`, `npm test --if-present`,
events step, `npm run build`, upload + deploy Pages.

- **Concurrency**: both callers use group `pages` with `cancel-in-progress:
  false`. One Pages deploy at a time; a running crawl-deploy is never killed by
  a push. A newer *pending* run replaces an older pending one (latest commit
  wins). Residual risk: a cron run queued behind a running deploy could be
  replaced by a push that queues after it; re-run `crawl.yml` by hand then.
- **Reuse path**: `curl` of `https://fora00.github.io/dashboard/events.json`
  (3 retries), validated as schemaVersion 1 with a non-empty `events`. If that
  fails it falls back to a full crawl (never ships a site without events.json,
  never ships an empty one).
- **Crawl visibility**: per-source table in the job summary, `::warning::` per
  failed source, `::error::` (job still passes) if more than a third failed. A
  crawler crash fails the job and deploys nothing; the live site keeps its
  events.

## PWA update flow

`registerType: 'prompt'` (vite.config.ts). A new service worker waits;
`UpdateToast` shows "New version available / Tap to update" (dismissible).
Only the tap sends skipWaiting; the page then reloads and shows "App updated"
once. events.json is not precached (`globPatterns` has no json).
