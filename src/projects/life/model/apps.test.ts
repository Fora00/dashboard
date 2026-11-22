import { describe, expect, it } from 'vitest'
import {
  MAX_APP_ROWS,
  MAX_APPS,
  MAX_LIMITED_APPS,
  missingApps,
  parseApps,
  serializeApps,
  validateApps,
} from './apps.ts'

const rows = (n: number, prefix = 'App') => Array.from({ length: n }, (_, i) => ({ app: `${prefix} ${i}`, minutes: i }))

describe('apps answer (top list + limited apps)', () => {
  it('holds the top list plus every limited app, and no more', () => {
    expect(MAX_APP_ROWS).toBe(MAX_APPS + MAX_LIMITED_APPS)
    const stored = serializeApps(rows(MAX_APP_ROWS + 3))!
    expect(parseApps(stored)).toHaveLength(MAX_APP_ROWS)
    expect(validateApps(stored)).toBeNull()
  })

  it('parse, serialize and validate agree on a full answer', () => {
    const stored = serializeApps(rows(MAX_APP_ROWS))!
    expect(serializeApps(parseApps(stored))).toBe(stored)
    expect(validateApps(stored)).toBeNull()
  })

  it('keeps 0 minutes (a limited app not used) and drops the same app typed twice', () => {
    const stored = serializeApps([
      { app: 'App A', minutes: 0 },
      { app: 'app a', minutes: 30 },
      { app: ' ', minutes: 5 },
    ])
    expect(parseApps(stored)).toEqual([{ app: 'App A', minutes: 0 }])
  })

  it('missingApps lists the required apps with no row, case-insensitively', () => {
    const stored = serializeApps([{ app: 'app a', minutes: 0 }])
    expect(missingApps(stored, ['App A', 'App B'])).toEqual(['App B'])
    expect(missingApps(null, ['App A'])).toEqual(['App A'])
    expect(missingApps(stored, [])).toEqual([])
  })
})
