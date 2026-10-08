// Events crawler — writes public/events.json. Run: `npm run events:crawl`.
//
// Env:
//   EVENTS_ONLY=id,id          run only these sources (others keep their previous events); skips the og:image pass unless EVENTS_OG=1
//   EVENTS_FAIL=id,id          simulate a failure of these sources (resilience testing)
//   EVENTS_PREVIOUS_URL=…      previous events.json: http(s) URL, file:// URL or local path
//                              (default: the deployed https://fora00.github.io/dashboard/events.json)
//   EVENTS_OUT=path            output file (default public/events.json)
//   EVENTS_FORCE=1             publish even when a guard below refuses (owner override)
//   GITHUB_STEP_SUMMARY=path   set by GitHub Actions: the per-source table is appended to it
//   GITHUB_OUTPUT=path         set by GitHub Actions: `health=` gets the degraded reasons
//                              (one line, empty when healthy) for the issue job in crawl.yml
//
// Sources run one after another (politeness), each in its own try/catch. A
// failing source — it throws, or returns 0 events when the previous run had
// some and it isn't flagged mayBeEmpty — keeps its previous events (re-
// filtered by the window) and is reported ok:false.
//
// Publish guards (exit 1, nothing written, so CI deploys nothing and the live
// file stays the "previous" of the next run); EVENTS_FORCE=1 overrides both:
//   - the previous file exists but could not be loaded (after retries) and a
//     non-mayBeEmpty source failed or yielded 0: its events would be lost;
//   - the new total is below half of the previous total.
// Otherwise the script exits 0 unless it cannot write the output file.
import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Adapter, Event, EventsFile, SourceStatus } from './types.ts'
import { ADAPTERS } from './adapters/index.ts'
import { PoliteHttp } from './http.ts'
import { OG_MAX_REQUESTS, enrichImages } from './ogimage.ts'
import type { DropCounts } from './pipeline.ts'
import { isBigDrop, loadPrevious, unprotectedSources } from './previous.ts'
import {
  countDelta,
  degradedReasons,
  staleSources,
  suspiciousZeros,
  upcomingTentative,
  zeroTracking,
} from './health.ts'
import { validPreviousEvents } from './schemas.ts'
import { HORIZON_DAYS, dedup, inWindow, isOngoing, sortEvents, toEvents, withPlace } from './pipeline.ts'

const DEFAULT_PREVIOUS = 'https://fora00.github.io/dashboard/events.json'
const DEFAULT_MAX_REQUESTS = 60
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function envList(name: string): Set<string> | null {
  const v = process.env[name]?.trim()
  return v
    ? new Set(
        v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null
}

/** `previousEvents`: the previous file's records that passed validPreviousEvents. */
function carryOver(previousEvents: readonly Event[], adapter: Adapter, now: number, drops: DropCounts): Event[] {
  return withPlace(
    adapter,
    previousEvents
      .filter((e) => e.source === adapter.id && inWindow(e, now, adapter.horizonDays))
      .map((e) => ({ ...e, ongoing: isOngoing(e, now) })),
    drops,
  )
}

function table(rows: SourceStatus[], ms: Map<string, number>, previous: ReadonlyMap<string, SourceStatus>): string {
  const lines = rows.map((s) =>
    [
      s.ok ? 'ok ' : 'ERR',
      s.id.padEnd(20),
      String(s.count).padStart(5),
      countDelta(previous.get(s.id)?.count, s.count).padStart(5),
      `${((ms.get(s.id) ?? 0) / 1000).toFixed(1)}s`.padStart(7),
      s.error ?? '',
    ].join('  '),
  )
  return ['     source                count    Δ     time  error', ...lines].join('\n')
}

/** CI visibility: step summary table, ::warning:: per failed source, ::error:: (job still passes) if > 1/3 fail. */
async function report(
  rows: SourceStatus[],
  ms: Map<string, number>,
  total: number,
  ran: number,
  events: readonly Event[],
  now: number,
): Promise<void> {
  // Sources skipped via EVENTS_ONLY keep their old status; only judge the ones that ran.
  const bad = rows.filter((s) => !s.ok && ms.has(s.id))
  const esc = (t: string) => t.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
  for (const s of bad)
    console.log(
      `::warning title=Events source failed::${esc(`${s.id}: ${s.error ?? 'failed'} (kept ${s.count} previous events)`)}`,
    )
  for (const z of suspiciousZeros(rows)) {
    console.log(
      `::warning title=Events source returns 0::${esc(`${z.id} has returned 0 events since ${z.since.slice(0, 10)} (it had ${z.had}): check that the adapter still parses the page`)}`,
    )
  }
  for (const st of staleSources(rows, now)) {
    console.log(
      `::warning title=Events source stale::${esc(`${st.id} has not succeeded for ${st.days === null ? 'ever (no lastSuccess)' : `${st.days} days`}: its events are aging`)}`,
    )
  }
  for (const t of upcomingTentative(events, now)) {
    console.log(
      `::warning title=Unconfirmed event soon::${esc(`"${t.title}" (${t.start.slice(0, 10)}) still has datesTentative: verify it on the official site and drop "verified": false in spot.json`)}`,
    )
  }
  if (bad.length * 3 > ran) {
    console.log(`::error title=Events crawl degraded::${bad.length} of ${ran} sources failed`)
  }
  // For crawl.yml's issue job: >1/3 failed or a source stale over a week.
  const output = process.env.GITHUB_OUTPUT?.trim()
  if (output) {
    const reasons = degradedReasons(rows, new Set(ms.keys()), now)
    try {
      await appendFile(output, `health=${reasons.join('; ').replace(/[\r\n]+/g, ' ')}\n`)
    } catch (e) {
      console.log(`cannot write step output: ${(e as Error).message}`)
    }
  }
  const file = process.env.GITHUB_STEP_SUMMARY?.trim()
  if (!file) return
  const cell = (t: string) => t.replace(/\|/g, '\\|').replace(/\s+/g, ' ')
  const md = [
    '## Events crawl',
    '',
    `${total} events published · ${bad.length} of ${ran} sources that ran failed`,
    '',
    '| | source | events | time | error |',
    '|---|---|---:|---:|---|',
    ...rows.map(
      (s) =>
        `| ${s.ok ? 'ok' : 'ERR'} | ${s.id} | ${s.count} | ${((ms.get(s.id) ?? 0) / 1000).toFixed(1)}s | ${cell(s.error ?? '')} |`,
    ),
    '',
  ].join('\n')
  try {
    await appendFile(file, `${md}\n`)
  } catch (e) {
    console.log(`cannot write step summary: ${(e as Error).message}`)
  }
}

async function main(): Promise<void> {
  const started = Date.now()
  const now = started
  const generatedAt = new Date(now).toISOString()
  const only = envList('EVENTS_ONLY')
  const failing = envList('EVENTS_FAIL') ?? new Set<string>()
  const force = process.env.EVENTS_FORCE === '1'
  const loaded = await loadPrevious(process.env.EVENTS_PREVIOUS_URL?.trim() || DEFAULT_PREVIOUS)
  const previous = loaded.kind === 'ok' ? loaded.data : null
  const prevStatus = new Map((previous?.sources ?? []).map((s) => [s.id, s]))
  // One malformed carried-over record must not crash dedup for everyone: drop it.
  const checked = validPreviousEvents(previous?.events ?? [])
  if (checked.dropped > 0)
    console.log(
      `::warning title=Previous events dropped::${checked.dropped} malformed record(s) in the previous events.json were not carried over (${checked.firstBad.replace(/[\r\n]+/g, ' ')})`,
    )
  const previousRecords = checked.events as unknown as Event[]
  const http = new PoliteHttp()

  const statuses: SourceStatus[] = []
  const timings = new Map<string, number>()
  const all: Event[] = []
  /** DROP RULES hits: rule → source → count. */
  const drops = new Map<string, Map<string, number>>()

  for (const adapter of ADAPTERS) {
    const t0 = Date.now()
    const prev = prevStatus.get(adapter.id)
    // Drops among carried-over events count only when they are published instead of fresh ones.
    const carriedDrops: DropCounts = new Map()
    const previousEvents = carryOver(previousRecords, adapter, now, carriedDrops)
    const addDrops = (from: DropCounts) => {
      for (const [rule, n] of from) {
        const bySource = drops.get(rule) ?? new Map<string, number>()
        bySource.set(adapter.id, (bySource.get(adapter.id) ?? 0) + n)
        drops.set(rule, bySource)
      }
    }
    const keepPrevious = (error: string) => {
      all.push(...previousEvents)
      addDrops(carriedDrops)
      statuses.push({
        id: adapter.id,
        name: adapter.name,
        ok: false,
        count: previousEvents.length,
        error,
        lastSuccess: prev?.lastSuccess ?? null,
        ...zeroTracking(prev, fresh, generatedAt),
      })
    }
    /** Events the adapter returned this run; null when it threw. */
    let fresh: number | null = null

    if (only && !only.has(adapter.id)) {
      // Not run this time (development): keep the previous state as it was.
      all.push(...previousEvents)
      addDrops(carriedDrops)
      statuses.push(
        prev
          ? { ...prev, name: adapter.name, count: previousEvents.length }
          : {
              id: adapter.id,
              name: adapter.name,
              ok: false,
              count: 0,
              error: 'not run (EVENTS_ONLY)',
              lastSuccess: null,
            },
      )
      continue
    }

    try {
      if (failing.has(adapter.id)) throw new Error('simulated failure (EVENTS_FAIL)')
      const ctx = http.context(
        adapter.id,
        adapter.maxRequests ?? DEFAULT_MAX_REQUESTS,
        now,
        adapter.horizonDays ?? HORIZON_DAYS,
      )
      const raws = await adapter.run(ctx)
      const freshDrops: DropCounts = new Map()
      const events = toEvents(adapter, raws, now, generatedAt, freshDrops)
      fresh = events.length
      const prevCount = prev?.count ?? previousEvents.length
      if (events.length === 0 && prevCount > 0 && !adapter.mayBeEmpty) {
        keepPrevious(`0 events (previous run had ${prevCount}); keeping previous`)
      } else {
        all.push(...events)
        addDrops(freshDrops)
        statuses.push({
          id: adapter.id,
          name: adapter.name,
          ok: true,
          count: events.length,
          lastSuccess: generatedAt,
          ...zeroTracking(prev, fresh, generatedAt),
        })
      }
    } catch (e) {
      keepPrevious((e as Error).message)
    }
    timings.set(adapter.id, Date.now() - t0)
  }

  const events = sortEvents(dedup(all))

  const refuse = (reason: string) => {
    const why = reason.replace(/\s+/g, ' ') // one annotation line
    if (force) {
      console.log(`::warning title=Events guard overridden::${why} (EVENTS_FORCE=1: publishing anyway)`)
      return
    }
    console.log(table(statuses, timings, prevStatus))
    console.log(`::error title=Events not published::${why}. Nothing written; set EVENTS_FORCE=1 to publish anyway.`)
    process.exit(1)
  }
  if (loaded.kind === 'failed') {
    const bad = unprotectedSources(statuses, ADAPTERS, new Set(timings.keys()))
    if (bad.length)
      refuse(
        `previous events.json could not be loaded (${loaded.reason}) and ${bad.length} source(s) failed or returned 0 with nothing to fall back on: ${bad.join(', ')}`,
      )
  }
  if (previous && isBigDrop(previous.events.length, events.length))
    refuse(`only ${events.length} events against ${previous.events.length} in the previous file (below 50%)`)
  // A partial run (EVENTS_ONLY) skips the slow og:image pass (up to 8 minutes) and keeps
  // what was found before; set EVENTS_OG=1 to run it anyway.
  const skipOg = only !== null && process.env.EVENTS_OG !== '1'
  const og = skipOg
    ? { filled: 0, fetched: 0, misses: previous?.ogMisses ?? {} }
    : await enrichImages(events, previous, http.context('og-image', OG_MAX_REQUESTS, now, HORIZON_DAYS), now)
  console.log(
    skipOg
      ? 'og:image: skipped (EVENTS_ONLY; EVENTS_OG=1 to run it)'
      : `og:image: ${og.filled} filled (${og.fetched} pages fetched), ${Object.keys(og.misses).length} without a usable image`,
  )
  const file: EventsFile = { schemaVersion: 1, generatedAt, sources: statuses, events, ogMisses: og.misses }
  const out = resolve(ROOT, process.env.EVENTS_OUT?.trim() || 'public/events.json')
  try {
    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, `${JSON.stringify(file, null, 1)}\n`)
  } catch (e) {
    console.error(`cannot write ${out}: ${(e as Error).message}`)
    process.exit(1)
  }

  console.log(table(statuses, timings, prevStatus))
  await report(statuses, timings, events.length, timings.size, events, now)
  const byCat = new Map<string, number>()
  for (const e of events) byCat.set(e.category, (byCat.get(e.category) ?? 0) + 1)
  console.log(
    `\n${events.length} events after dedup (${all.length} before) · ${[...byCat].map(([k, v]) => `${k} ${v}`).join(', ')}`,
  )
  const tally = (k: 'area' | 'ring') => {
    const m = new Map<string, number>()
    for (const e of events) m.set(e[k], (m.get(e[k]) ?? 0) + 1)
    return [...m]
      .sort((a, b) => b[1] - a[1])
      .map(([id, n]) => `${id} ${n}`)
      .join(', ')
  }
  console.log(`areas: ${tally('area')} · rings: ${tally('ring')}`)
  const dropLines = [...drops].map(([rule, bySource]) => {
    const total = [...bySource.values()].reduce((a, b) => a + b, 0)
    return `  ${rule.padEnd(22)} ${String(total).padStart(4)}  (${[...bySource].map(([id, n]) => `${id} ${n}`).join(', ')})`
  })
  console.log(
    `dropped by rule (tags.ts DROP RULES, invalid-url):${dropLines.length ? `\n${dropLines.join('\n')}` : ' none'}`,
  )
  console.log(`${http.requests} HTTP requests · ${((Date.now() - started) / 1000).toFixed(0)}s · wrote ${out}`)
}

main().catch((e: unknown) => {
  // Only reachable on a bug outside the per-source try/catch. In CI this fails
  // the crawl-deploy job (nothing is deployed; the live site keeps its events).
  console.error(e)
  process.exit(1)
})
