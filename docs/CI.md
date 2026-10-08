# CI, deploy and PWA updates

## Workflows (`.github/workflows/`)

| file | trigger | events.json | time |
|---|---|---|---|
| `deploy.yml` | push to `main` | reused from the published site | seconds |
| `crawl.yml` | daily cron 04:23 UTC, manual dispatch | freshly crawled | minutes |
| `_site.yml` | `workflow_call` only | `events: crawl` or `reuse` | shared steps |

Shared steps (`_site.yml`), split in two jobs (2026-10-08, audit E5):

| job | permissions | steps |
|---|---|---|
| `build` | `contents: read` | checkout, setup-node, `npm ci`, `npm run lint`, `npm test --if-present`, events step (crawl or reuse), "Require events.json", `npm run build`, `upload-pages-artifact` (`dist`, artifact `github-pages`) |
| `deploy` (`needs: build`, environment `github-pages`) | `pages: write`, `id-token: write` | `configure-pages`, `deploy-pages` |

So nothing from npm, the repo or the crawled sites ever runs with a token
that can publish the site. `deploy` has no checkout. The callers still grant
`pages: write` + `id-token: write` (top level in `deploy.yml`, on the `site`
job in `crawl.yml`): a called workflow can only narrow what its caller grants.
The `crawl_health` output of `_site.yml` comes from `jobs.build`. A failing
`build` skips `deploy` (nothing deployed, live site unchanged).

- **Action pinning**: every action is pinned by full commit SHA with the
  tag in a trailing comment (`uses: actions/checkout@<sha> # v7.0.1`).
  Dependabot (`github-actions` ecosystem, weekly) understands this form and
  bumps the SHA and the comment together. To bump by hand:
  `git ls-remote --tags https://github.com/actions/<name>.git`.

- **Concurrency**: both callers use group `pages` with `cancel-in-progress:
  false`. One Pages deploy at a time; a running crawl-deploy is never killed by
  a push. A newer *pending* run replaces an older pending one (latest commit
  wins). Residual risk: a cron run queued behind a running deploy could be
  replaced by a push that queues after it; re-run `crawl.yml` by hand then.
- **Reuse path**: `curl` of `https://fora00.github.io/dashboard/events.json`
  (3 retries), validated as schemaVersion 1 with a non-empty `events`. If that
  fails it falls back to a full crawl (never ships a site without events.json,
  never ships an empty one). **Stale warning**: the reused file's
  `generatedAt` and age go to the job summary; over 3 days old (the daily
  crawl has not published since) emits a `::warning::` "Reused events.json is
  stale". Warning only: the deploy goes on and the file is shipped as is
  (the Events page and the crawl health issue are unchanged). Missing or
  unreadable `generatedAt` also warns, never fails.
- **Crawl visibility**: per-source table in the job summary, `::warning::` per
  failed source, `::error::` (job still passes) if more than a third failed. A
  crawler crash fails the job and deploys nothing; the live site keeps its
  events. So do the crawler's publish guards (total below 50% of the previous
  file, or previous file unreadable while a source failed; docs/EVENTS.md
  "Resilience"): override with the **force** input of a manual `crawl.yml`
  run (`EVENTS_FORCE=1`).
- **Crawl health issue** (`crawl.yml` job `health`, added 2026-10-08): runs
  after the crawl-deploy job (`needs: site`, `if: always()`), so it never
  blocks or delays a deploy. It keeps **one** open issue titled "Events crawl
  needs attention": opened (or commented on, if already open) when the
  crawl-deploy job did not succeed, more than a third of the sources that ran
  failed, or a source has not succeeded for over 7 days (`degradedReasons` in
  `scripts/events/health.ts`; the crawler hands them over as the `health` step
  output, surfaced as the `crawl_health` output of `_site.yml`). The first
  healthy run closes it. Only this job has `issues: write`; inside `_site.yml` only the
  `deploy` job has Pages rights (permissions are per job). If Issues are disabled on the repo, the job fails red after
  the deploy; nothing else is affected. `deploy.yml` (reuse path) has no such
  job.
- **Timeouts**: `_site.yml` `build` has `timeout-minutes: 30` (a normal crawl
  takes minutes), `deploy` 10, the health job 5.
- **Output gate**: "Require events.json" checks with node that the file is
  schemaVersion 1 with at least one event; a missing, invalid or
  `"events": []` file never deploys.

## PWA update flow

`registerType: 'prompt'` (vite.config.ts). A new service worker waits;
`UpdateToast` shows "New version available / Tap to update" (dismissible).
Only the tap sends skipWaiting; the page then reloads and shows "App updated"
once. events.json is not precached (`globPatterns` has no json).
