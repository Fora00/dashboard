// Loading the previous events.json and the publish guards that protect it
// (pure or injectable, tested). The previous file is the only copy of the
// events of a source that is failing today: losing it while a source is down
// would publish that source as empty, and the next run would accept the empty
// state for good. See docs/EVENTS.md "Resilience".
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Adapter, EventsFile, SourceStatus } from './types.ts'
import { PreviousFileSchema, describeIssues } from './schemas.ts'

/**
 * `ok`: loaded and valid. `missing`: there is no previous file at all (HTTP
 * 404/410, or a local path that does not exist): a first run, nothing to lose.
 * `failed`: it may exist but could not be read or is not a valid file.
 */
export type PreviousResult =
  | { kind: 'ok'; data: EventsFile }
  | { kind: 'missing'; reason: string }
  | { kind: 'failed'; reason: string }

export interface LoadPreviousDeps {
  fetch?: typeof fetch
  readText?: (path: string) => Promise<string>
  sleep?: (ms: number) => Promise<void>
  /** Wait before attempt 2, 3, … (length + 1 = attempts; http(s) only, local paths are read once). */
  backoffMs?: readonly number[]
  timeoutMs?: number
  log?: (line: string) => void
}

class Missing extends Error {}

const realSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function readOnce(where: string, deps: Required<Omit<LoadPreviousDeps, 'backoffMs' | 'log'>>): Promise<string> {
  if (/^https?:\/\//.test(where)) {
    const res = await deps.fetch(where, {
      signal: AbortSignal.timeout(deps.timeoutMs),
      headers: { 'Cache-Control': 'no-cache' },
    })
    if (res.status === 404 || res.status === 410) throw new Missing(`HTTP ${res.status}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text()
  }
  const path = where.startsWith('file:') ? fileURLToPath(where) : resolve(where)
  try {
    return await deps.readText(path)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') throw new Missing('no such file')
    throw e
  }
}

/** Fetch/read and validate the previous file, retrying (http only) anything but "does not exist". */
export async function loadPrevious(where: string, deps: LoadPreviousDeps = {}): Promise<PreviousResult> {
  const io = {
    fetch: deps.fetch ?? fetch,
    readText: deps.readText ?? ((p: string) => readFile(p, 'utf8')),
    sleep: deps.sleep ?? realSleep,
    timeoutMs: deps.timeoutMs ?? 20_000,
  }
  const backoff = deps.backoffMs ?? [3_000, 10_000]
  const log = deps.log ?? ((l: string) => console.log(l))
  // Only the network is worth retrying; a local file reads the same every time.
  const attempts = /^https?:\/\//.test(where) ? backoff.length + 1 : 1
  let reason = ''
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await io.sleep(backoff[i - 1] ?? 0)
    try {
      const text = await readOnce(where, io)
      const parsed = PreviousFileSchema.safeParse(JSON.parse(text))
      if (!parsed.success) throw new Error(`not a schemaVersion 1 events.json (${describeIssues(parsed.error, 2)})`)
      const data = parsed.data as unknown as EventsFile
      log(`previous: ${data.events.length} events from ${where} (generated ${data.generatedAt ?? '?'})`)
      return { kind: 'ok', data }
    } catch (e) {
      if (e instanceof Missing) {
        log(`previous: none at ${where} (${e.message}); treating this as a first run`)
        return { kind: 'missing', reason: e.message }
      }
      reason = (e as Error).message
      log(`previous: attempt ${i + 1}/${attempts} at ${where} failed (${reason})`)
    }
  }
  log(`previous: could not load ${where} after ${attempts} attempt${attempts === 1 ? '' : 's'} (${reason})`)
  return { kind: 'failed', reason }
}

/**
 * When the previous file could not be loaded, a failing source has nothing to
 * fall back on and would publish 0 events. Returns the sources that ran, are
 * not `mayBeEmpty`, and failed or yielded 0: any of them blocks the publish.
 */
export function unprotectedSources(
  statuses: readonly SourceStatus[],
  adapters: readonly Pick<Adapter, 'id' | 'mayBeEmpty'>[],
  ran: ReadonlySet<string>,
): string[] {
  const mayBeEmpty = new Set(adapters.filter((a) => a.mayBeEmpty).map((a) => a.id))
  return statuses.filter((s) => ran.has(s.id) && !mayBeEmpty.has(s.id) && (!s.ok || s.count === 0)).map((s) => s.id)
}

/** The new total is suspiciously low: below `ratio` of the previous total. */
export function isBigDrop(previousTotal: number, total: number, ratio = 0.5): boolean {
  return previousTotal > 0 && total < previousTotal * ratio
}
