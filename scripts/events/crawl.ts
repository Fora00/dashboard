// Events crawler — writes public/events.json. Run: `npm run events:crawl`.
//
// Env:
//   EVENTS_ONLY=id,id          run only these sources (others keep their previous events)
//   EVENTS_FAIL=id,id          simulate a failure of these sources (resilience testing)
//   EVENTS_PREVIOUS_URL=…      previous events.json: http(s) URL, file:// URL or local path
//                              (default: the deployed https://fora00.github.io/dashboard/events.json)
//   EVENTS_OUT=path            output file (default public/events.json)
//
// Sources run one after another (politeness), each in its own try/catch. A
// failing source — it throws, or returns 0 events when the previous run had
// some and it isn't flagged mayBeEmpty — keeps its previous events (re-
// filtered by the window) and is reported ok:false. The script exits 0 unless
// it cannot write the output file.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Event, EventsFile, SourceStatus } from './types.ts'
import { ADAPTERS } from './adapters/index.ts'
import { PoliteHttp } from './http.ts'
import { HORIZON_DAYS, dedup, inWindow, isOngoing, sortEvents, toEvents } from './pipeline.ts'

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
    const data = JSON.parse(text) as Partial<EventsFile>
    if (data.schemaVersion !== 1 || !Array.isArray(data.events) || !Array.isArray(data.sources)) {
      throw new Error('not a schemaVersion 1 events.json')
    }
    console.log(`previous: ${data.events.length} events from ${where} (generated ${data.generatedAt ?? '?'})`)
    return data as EventsFile
  } catch (e) {
    console.log(`previous: none usable at ${where} (${(e as Error).message})`)
    return null
  }
}

function carryOver(previous: EventsFile | null, sourceId: string, now: number): Event[] {
  if (!previous) return []
  return previous.events
    .filter((e) => e && e.source === sourceId && typeof e.start === 'string' && inWindow(e, now))
    .map((e) => ({ ...e, ongoing: isOngoing(e, now) }))
}

function table(rows: SourceStatus[], ms: Map<string, number>): string {
  const lines = rows.map((s) => [
    s.ok ? 'ok ' : 'ERR',
    s.id.padEnd(15),
    String(s.count).padStart(5),
    `${((ms.get(s.id) ?? 0) / 1000).toFixed(1)}s`.padStart(7),
    s.error ?? '',
  ].join('  '))
  return ['     source           count     time  error', ...lines].join('\n')
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

  for (const adapter of ADAPTERS) {
    const t0 = Date.now()
    const prev = prevStatus.get(adapter.id)
    const previousEvents = carryOver(previous, adapter.id, now)
    const keepPrevious = (error: string) => {
      all.push(...previousEvents)
      statuses.push({ id: adapter.id, name: adapter.name, ok: false, count: previousEvents.length, error, lastSuccess: prev?.lastSuccess ?? null })
    }

    if (only && !only.has(adapter.id)) {
      // Not run this time (development): keep the previous state as it was.
      all.push(...previousEvents)
      statuses.push(prev
        ? { ...prev, name: adapter.name, count: previousEvents.length }
        : { id: adapter.id, name: adapter.name, ok: false, count: 0, error: 'not run (EVENTS_ONLY)', lastSuccess: null })
      continue
    }

    try {
      if (failing.has(adapter.id)) throw new Error('simulated failure (EVENTS_FAIL)')
      const ctx = http.context(adapter.id, adapter.maxRequests ?? DEFAULT_MAX_REQUESTS, now, HORIZON_DAYS)
      const raws = await adapter.run(ctx)
      const events = toEvents(adapter, raws, now, generatedAt)
      const prevCount = prev?.count ?? previousEvents.length
      if (events.length === 0 && prevCount > 0 && !adapter.mayBeEmpty) {
        keepPrevious(`0 events (previous run had ${prevCount}); keeping previous`)
      } else {
        all.push(...events)
        statuses.push({ id: adapter.id, name: adapter.name, ok: true, count: events.length, lastSuccess: generatedAt })
      }
    } catch (e) {
      keepPrevious((e as Error).message)
    }
    timings.set(adapter.id, Date.now() - t0)
  }

  const events = sortEvents(dedup(all))
  const file: EventsFile = { schemaVersion: 1, generatedAt, sources: statuses, events }
  const out = resolve(ROOT, process.env.EVENTS_OUT?.trim() || 'public/events.json')
  try {
    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, `${JSON.stringify(file, null, 1)}\n`)
  } catch (e) {
    console.error(`cannot write ${out}: ${(e as Error).message}`)
    process.exit(1)
  }

  console.log(table(statuses, timings))
  const byCat = new Map<string, number>()
  for (const e of events) byCat.set(e.category, (byCat.get(e.category) ?? 0) + 1)
  console.log(`\n${events.length} events after dedup (${all.length} before) · ${[...byCat].map(([k, v]) => `${k} ${v}`).join(', ')}`)
  console.log(`${http.requests} HTTP requests · ${((Date.now() - started) / 1000).toFixed(0)}s · wrote ${out}`)
}

main().catch((e: unknown) => {
  // Only reachable on a bug outside the per-source try/catch; the deploy step
  // is continue-on-error anyway.
  console.error(e)
  process.exit(1)
})
