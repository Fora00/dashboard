import { afterEach, describe, expect, it, vi } from 'vitest'
import { SAME_VISIT_MS, nextVisit, recordVisit } from './visit'

describe('nextVisit', () => {
  it('first ever visit: nothing is new, this open is stored', () => {
    expect(nextVisit(null, 1000)).toEqual({
      since: null,
      next: { since: 1000, at: 1000 },
    })
  })
  it('a reload inside the same visit keeps the baseline', () => {
    const r = nextVisit({ since: 100, at: 5000 }, 5000 + SAME_VISIT_MS - 1)
    expect(r.since).toBe(100)
    expect(r.next.since).toBe(100)
  })
  it('a later visit uses the previous open as baseline', () => {
    const r = nextVisit({ since: 100, at: 5000 }, 5000 + SAME_VISIT_MS)
    expect(r.since).toBe(5000)
    expect(r.next).toEqual({ since: 5000, at: 5000 + SAME_VISIT_MS })
  })
})

describe('recordVisit', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('survives blocked storage', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    expect(recordVisit(1)).toBeNull()
  })
  it('remembers across calls and ignores garbage', () => {
    const store = new Map<string, string>([['dashboard:events-last-visit', '{"since":"x"}']])
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    })
    expect(recordVisit(1000)).toBeNull()
    expect(recordVisit(1000 + SAME_VISIT_MS)).toBe(1000)
  })
})
