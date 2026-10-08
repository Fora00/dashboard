import { describe, expect, it } from 'vitest'
import { isBigDrop, loadPrevious, unprotectedSources } from './previous.ts'
import type { SourceStatus } from './types.ts'

const URL_ = 'https://example.org/events.json'
const GOOD = JSON.stringify({ schemaVersion: 1, generatedAt: 'x', sources: [], events: [{ id: 'a' }, { id: 'b' }] })

/** fetch stub answering each call with the next [status, body]; a string entry is thrown as a network error. */
function fetchSeq(answers: ([number, string] | string)[]) {
  let calls = 0
  const f = (async () => {
    const a = answers[Math.min(calls++, answers.length - 1)] ?? 'no answer'
    if (typeof a === 'string') throw new Error(a)
    return new Response(a[1], { status: a[0] })
  }) as unknown as typeof fetch
  return { f, calls: () => calls }
}

const quiet = { sleep: async () => {}, log: () => {}, backoffMs: [0, 0] }

describe('loadPrevious', () => {
  it('returns the file on the first good answer', async () => {
    const s = fetchSeq([[200, GOOD]])
    const r = await loadPrevious(URL_, { ...quiet, fetch: s.f })
    expect(r.kind).toBe('ok')
    expect(r.kind === 'ok' && r.data.events.length).toBe(2)
    expect(s.calls()).toBe(1)
  })

  it('retries network errors and 5xx, then succeeds', async () => {
    const s = fetchSeq(['ECONNRESET', [503, 'busy'], [200, GOOD]])
    const waits: number[] = []
    const r = await loadPrevious(URL_, {
      ...quiet,
      backoffMs: [5, 7],
      sleep: async (ms) => void waits.push(ms),
      fetch: s.f,
    })
    expect(r.kind).toBe('ok')
    expect(s.calls()).toBe(3)
    expect(waits).toEqual([5, 7])
  })

  it('gives up as failed after 3 attempts', async () => {
    const s = fetchSeq([[500, 'x']])
    const r = await loadPrevious(URL_, { ...quiet, fetch: s.f })
    expect(r).toEqual({ kind: 'failed', reason: 'HTTP 500' })
    expect(s.calls()).toBe(3)
  })

  it('treats garbage as failed, not as a first run', async () => {
    const s = fetchSeq([[200, '{"schemaVersion":2}']])
    const r = await loadPrevious(URL_, { ...quiet, fetch: s.f })
    expect(r.kind).toBe('failed')
  })

  it('treats 404 as missing (first run) without retrying', async () => {
    const s = fetchSeq([[404, 'nope']])
    const r = await loadPrevious(URL_, { ...quiet, fetch: s.f })
    expect(r).toEqual({ kind: 'missing', reason: 'HTTP 404' })
    expect(s.calls()).toBe(1)
  })

  it('reads local paths; a missing local file is missing, other errors fail', async () => {
    const ok = await loadPrevious('/tmp/prev.json', { ...quiet, readText: async () => GOOD })
    expect(ok.kind).toBe('ok')
    const enoent = Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
    const gone = await loadPrevious('/tmp/prev.json', {
      ...quiet,
      readText: async () => {
        throw enoent
      },
    })
    expect(gone.kind).toBe('missing')
    const eacces = Object.assign(new Error('EACCES'), { code: 'EACCES' })
    const denied = await loadPrevious('/tmp/prev.json', {
      ...quiet,
      readText: async () => {
        throw eacces
      },
    })
    expect(denied.kind).toBe('failed')
  })
})

const st = (id: string, ok: boolean, count: number): SourceStatus => ({ id, name: id, ok, count, lastSuccess: null })

describe('unprotectedSources', () => {
  const adapters = [{ id: 'a' }, { id: 'b' }, { id: 'c', mayBeEmpty: true }, { id: 'd' }, { id: 'e' }]
  it('lists sources that ran, are not mayBeEmpty, and failed or returned 0', () => {
    const statuses = [st('a', true, 12), st('b', false, 0), st('c', true, 0), st('d', true, 0), st('e', false, 0)]
    // e did not run (EVENTS_ONLY): not judged.
    expect(unprotectedSources(statuses, adapters, new Set(['a', 'b', 'c', 'd']))).toEqual(['b', 'd'])
  })
  it('is empty when every source that ran delivered', () => {
    expect(unprotectedSources([st('a', true, 3), st('c', true, 0)], adapters, new Set(['a', 'c']))).toEqual([])
  })
})

describe('isBigDrop', () => {
  it('flags totals below half of the previous one', () => {
    expect(isBigDrop(400, 199)).toBe(true)
    expect(isBigDrop(400, 200)).toBe(false)
    expect(isBigDrop(400, 380)).toBe(false)
    expect(isBigDrop(400, 0)).toBe(true)
  })
  it('never flags without a previous total', () => {
    expect(isBigDrop(0, 0)).toBe(false)
  })
})
