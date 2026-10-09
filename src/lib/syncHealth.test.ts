import '../test/fakeDb'
import { describe, expect, it } from 'vitest'
import type { CloudSync, SyncStatus } from './cloudSync'
import { STUCK_AFTER_MS, collectIssues, issueFor, type WatchedEngine } from './syncHealth'

const ok: SyncStatus = {
  pending: 0,
  dead: 0,
  lastSyncedAt: 1,
  lastError: null,
  syncing: false,
  skipped: 0,
  retrying: 0,
  pullFailed: false,
}

describe('issueFor', () => {
  it('is quiet when healthy, and while pending changes are still fresh', () => {
    expect(issueFor(ok, 0).severity).toBe('ok')
    expect(issueFor({ ...ok, pending: 3 }, STUCK_AFTER_MS - 1).severity).toBe('ok')
  })
  it('warns when changes are stuck, retrying, or a pull failed', () => {
    expect(issueFor({ ...ok, pending: 3 }, STUCK_AFTER_MS).message).toMatch(/3 changes still waiting/)
    expect(issueFor({ ...ok, pending: 1, retrying: 1 }, 0).message).toMatch(/1 change failed to upload/)
    expect(issueFor({ ...ok, pullFailed: true }, 0).severity).toBe('warn')
  })
  it('errors on rejected changes, ahead of everything else', () => {
    expect(issueFor({ ...ok, dead: 2, pullFailed: true }, 0)).toMatchObject({ severity: 'error' })
  })
})

describe('collectIssues', () => {
  it('lists problems worst first and skips healthy engines', () => {
    const a = {} as CloudSync
    const b = {} as CloudSync
    const c = {} as CloudSync
    const engines: WatchedEngine[] = [
      { label: 'A', path: '/a', sync: a },
      { label: 'B', path: '/b', sync: b },
      { label: 'C', path: '/c', sync: c },
    ]
    const issues = collectIssues(engines, [{ ...ok, pullFailed: true }, ok, { ...ok, dead: 1 }], new Map(), 0)
    expect(issues.map((i) => [i.label, i.severity])).toEqual([
      ['C', 'error'],
      ['A', 'warn'],
    ])
  })
})
