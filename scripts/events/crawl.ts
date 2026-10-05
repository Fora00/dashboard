// Events crawler — writes public/events.json. Run: `npm run events:crawl`.
//
// Env:
//   EVENTS_ONLY=id,id          run only these sources (others keep their previous events)
//   EVENTS_FAIL=id,id          simulate a failure of these sources (resilience testing)
//   EVENTS_PREVIOUS_URL=…      previous events.json: http(s) URL, file:// URL or local path
//                              (default: the deployed https://fora00.github.io/dashboard/events.json)
//   EVENTS_OUT=path            output file (default public/events.json)
//   GITHUB_STEP_SUMMARY=path   set by GitHub Actions: the per-source table is appended to it
//
// Sources run one after another (politeness), each in its own try/catch. A
// failing source — it throws, or returns 0 events when the previous run had
// some and it isn't flagged mayBeEmpty — keeps its previous events (re-
// filtered by the window) and is reported ok:false. The script exits 0 unless
// it cannot write the output file.
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Adapter, Event, EventsFile, SourceStatus } from './types.ts'
import { ADAPTERS } from './adapters/index.ts'
import { PoliteHttp } from './http.ts'
import { OG_MAX_REQUESTS, enrichImages } from './ogimage.ts'
import type { DropCounts } from './pipeline.ts'
import { PreviousFileSchema, describeIssues } from './schemas.ts'
import { HORIZON_DAYS, dedup, inWindow, isOngoing, sortEvents, toEvents, withPlace } from './pipeline.ts'

const DEFAULT_PREVIOUS = 'https://fora00.github.io/dashboard/events.json'
const DEFAULT_MAX_REQUESTS = 60
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function envList(name: string): Set<string> | null {
  const v = process.env[name]?.trim()
  return v ? new Set(v.split(',').map((s) => s.trim()).filter(Boolean)) : null
}

async function loadPrevious(): Promise<EventsFile | null> {
  const where = process.env.EVENTS_PREVIOUS_URL?.trim() || DEFAULT_PREVIOUS
  try {
    let text: string
    if (/^https?:\/\//.test(where)) {
      const res = await fetch(where, { signal: AbortSignal.timeout(20_000), headers: { 'Cache-Control': 'no-cache' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      text = await res.text()
    } else {
      text = await readFile(where.startsWith('file:') ? fileURLToPath(where) : resolve(where), 'utf8')
    }
    const parsed = PreviousFileSchema.safeParse(JSON.parse(text))
    if (!parsed.success) throw new Error(`not a schemaVersion 1 events.json (${describeIssues(parsed.error, 2)})`)
    const data = parsed.data
    console.log(`previous: ${data.events.length} events from ${where} (generated ${data.generatedAt ?? '?'})`)
    return data as unknown as EventsFile
  } catch (e) {
    console.log(`previous: none usable at ${where} (${(e as Error).message})`)
    return null
  }
}

function carryOver(previous: EventsFile | null, adapter: Adapter, now: number, drops: DropCounts): Event[] {
  if (!previous) return []
  return withPlace(adapter, previous.events
    .filter((e) => e && e.source === adapter.id && typeof e.start === 'string' && inWindow(e, now, adapter.horizonDays))
    .map((e) => ({ ...e, ongoing: isOngoing(e, now) })), drops)
}

function table(rows: SourceStatus[], ms: Map<string, number>): string {
  const lines = rows.map((s) => [
    s.ok ? 'ok ' : 'ERR',
    s.id.padEnd(20),
    String(s.count).padStart(5),
    `${((ms.get(s.id) ?? 0) / 1000).toFixed(1)}s`.padStart(7),
    s.error ?? '',
  ].join('  '))
  return ['     source                count     time  error', ...lines].join('\n')
}

/** CI visibility: step summary table, ::warning:: per failed source, ::error:: (job still passes) if > 1/3 fail. */
async function report(rows: SourceStatus[], ms: Map<string, number>, total: number, ran: number): Promise<void> {
  // Sources skipped via EVENTS_ONLY keep their old status; only judge the ones that ran.
  const bad = rows.filter((s) => !s.ok && ms.has(s.id))
  const esc = (t: string) => t.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
  for (const s of bad) console.log(`::warning title=Events source failed::${esc(`${s.id}: ${s.error ?? 'failed'} (kept ${s.count} previous events)`)}`)
  if (bad.length * 3 > ran) {
    console.log(`::error title=Events crawl degraded::${bad.length} of ${ran} sources failed`)
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
    ...rows.map((s) => `| ${s.ok ? 'ok' : 'ERR'} | ${s.id} | ${s.count} | ${((ms.get(s.id) ?? 0) / 1000).toFixed(1)}s | ${cell(s.error ?? '')} |`),
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
  const previous = await loadPrevious()
  const prevStatus = new Map((previous?.sources ?? []).map((s) => [s.id, s]))
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
    const previousEvents = carryOver(previous, adapter, now, carriedDrops)
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
      statuses.push({ id: adapter.id, name: adapter.name, ok: false, count: previousEvents.length, error, lastSuccess: prev?.lastSuccess ?? null })
    }

    if (only && !only.has(adapter.id)) {
      // Not run this time (development): keep the previous state as it was.
      all.push(...previousEvents)
      addDrops(carriedDrops)
      statuses.push(prev
        ? { ...prev, name: adapter.name, count: previousEvents.length }
        : { id: adapter.id, name: adapter.name, ok: false, count: 0, error: 'not run (EVENTS_ONLY)', lastSuccess: null })
      continue
    }

    try {
      if (failing.has(adapter.id)) throw new Error('simulated failure (EVENTS_FAIL)')
      const ctx = http.context(adapter.id, adapter.maxRequests ?? DEFAULT_MAX_REQUESTS, now, adapter.horizonDays ?? HORIZON_DAYS)
      const raws = await adapter.run(ctx)
      const freshDrops: DropCounts = new Map()
      const events = toEvents(adapter, raws, now, generatedAt, freshDrops)
      const prevCount = prev?.count ?? previousEvents.length
      if (events.length === 0 && prevCount > 0 && !adapter.mayBeEmpty) {
        keepPrevious(`0 events (previous run had ${prevCount}); keeping previous`)
      } else {
        all.push(...events)
        addDrops(freshDrops)
        statuses.push({ id: adapter.id, name: adapter.name, ok: true, count: events.length, lastSuccess: generatedAt })
      }
    } catch (e) {
      keepPrevious((e as Error).message)
    }
    timings.set(adapter.id, Date.now() - t0)
  }

  const events = sortEvents(dedup(all))
  const og = await enrichImages(events, previous, http.context('og-image', OG_MAX_REQUESTS, now, HORIZON_DAYS), now)
  console.log(`og:image: ${og.filled} filled (${og.fetched} pages fetched), ${Object.keys(og.misses).length} without a usable image`)
  const file: EventsFile = { schemaVersion: 1, generatedAt, sources: statuses, events, ogMisses: og.misses }
  const out = resolve(ROOT, process.env.EVENTS_OUT?.trim() || 'public/events.json')
  try {
    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, `${JSON.stringify(file, null, 1)}\n`)
  } catch (e) {
    console.error(`cannot write ${out}: ${(e as Error).message}`)
    process.exit(1)
  }

  console.log(table(statuses, timings))
  await report(statuses, timings, events.length, timings.size)
  const byCat = new Map<string, number>()
  for (const e of events) byCat.set(e.category, (byCat.get(e.category) ?? 0) + 1)
  console.log(`\n${events.length} events after dedup (${all.length} before) · ${[...byCat].map(([k, v]) => `${k} ${v}`).join(', ')}`)
  const tally = (k: 'area' | 'ring') => {
    const m = new Map<string, number>()
    for (const e of events) m.set(e[k], (m.get(e[k]) ?? 0) + 1)
    return [...m].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id} ${n}`).join(', ')
  }
  console.log(`areas: ${tally('area')} · rings: ${tally('ring')}`)
  const dropLines = [...drops].map(([rule, bySource]) => {
    const total = [...bySource.values()].reduce((a, b) => a + b, 0)
    return `  ${rule.padEnd(22)} ${String(total).padStart(4)}  (${[...bySource].map(([id, n]) => `${id} ${n}`).join(', ')})`
  })
  console.log(`dropped by rule (tags.ts DROP RULES):${dropLines.length ? `\n${dropLines.join('\n')}` : ' none'}`)
  console.log(`${http.requests} HTTP requests · ${((Date.now() - started) / 1000).toFixed(0)}s · wrote ${out}`)
}

main().catch((e: unknown) => {
  // Only reachable on a bug outside the per-source try/catch. In CI this fails
  // the crawl-deploy job (nothing is deployed; the live site keeps its events).
  console.error(e)
  process.exit(1)
})
