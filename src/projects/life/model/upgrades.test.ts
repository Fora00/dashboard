import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan, LifeUpgradeEntry } from '../../../lib/db'
import { buildExportMarkdown, extractJsonFence, summarizeUpgrades, summarizeWeek } from './index'

const WEEK = '2026-10-19'
const plan: LifePlan = {
  version: 1,
  week: WEEK,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [],
  sundayCheck: [],
  checkins: [],
}
let n = 0
const u = (
  text: string,
  value: Partial<LifeUpgradeEntry['value']> = {},
  over: Partial<LifeUpgradeEntry> = {},
): LifeUpgradeEntry => ({
  id: `u${++n}`,
  week: WEEK,
  kind: 'upgrade',
  ref: 'upgrade',
  day: WEEK,
  createdAt: n,
  updatedAt: n,
  value: { text, size: 'quick', status: 'open', ...value },
  ...over,
})
const day = (d: string) => new Date(`${d}T12:00:00`).getTime()

describe('summarizeUpgrades', () => {
  it('splits open items by size, oldest first', () => {
    const s = summarizeUpgrades([u('b'), u('big one', { size: 'big' }), u('a')], WEEK)
    expect(s.quick.map((e) => e.value.text)).toEqual(['b', 'a'])
    expect(s.big.map((e) => e.value.text)).toEqual(['big one'])
    expect(s.openCount).toBe(3)
  })

  it('reads across weeks: an item added long ago still counts, done only counts in its week', () => {
    const old = u('old', {}, { week: '2026-08-03', createdAt: 1 })
    const doneBefore = u('done before', { status: 'done', doneAt: '2026-10-14' }, { week: '2026-10-12' })
    const doneNow = u('done now', { status: 'done', doneAt: '2026-10-21' }, { week: '2026-10-12' })
    const s = summarizeUpgrades([old, doneBefore, doneNow], WEEK)
    expect(s.quick.map((e) => e.value.text)).toEqual(['old'])
    expect(s.doneThisWeek.map((e) => e.value.text)).toEqual(['done now'])
    expect(s.done.map((e) => e.value.text)).toEqual(['done now', 'done before'])
    // Seen from the next week, "done now" no longer counts as this week's.
    expect(summarizeUpgrades([doneNow], '2026-10-26').doneThisWeek).toEqual([])
  })

  it('status transitions: done and undo move the item between open and done', () => {
    const open = u('x')
    expect(summarizeUpgrades([open], WEEK).doneThisWeek).toHaveLength(0)
    const done = { ...open, value: { ...open.value, status: 'done' as const, doneAt: '2026-10-20' } }
    expect(summarizeUpgrades([done], WEEK).openCount).toBe(0)
    expect(summarizeUpgrades([done], WEEK).doneThisWeek).toHaveLength(1)
    const dropped = { ...open, value: { ...open.value, status: 'dropped' as const }, updatedAt: day('2026-10-22') }
    const s = summarizeUpgrades([dropped], WEEK)
    expect(s.openCount).toBe(0)
    expect(s.droppedThisWeek).toHaveLength(1)
    expect(summarizeUpgrades([dropped], '2026-10-26').droppedThisWeek).toHaveLength(0)
  })

  it('nudges only when a quick item is open and none was done this week', () => {
    expect(summarizeUpgrades([], WEEK).nudge).toBe(false)
    expect(summarizeUpgrades([u('big', { size: 'big' })], WEEK).nudge).toBe(false)
    expect(summarizeUpgrades([u('q')], WEEK).nudge).toBe(true)
    expect(summarizeUpgrades([u('q'), u('d', { status: 'done', doneAt: '2026-10-20' })], WEEK).nudge).toBe(false)
  })
})

describe('upgrades never touch the week summary', () => {
  it('are ignored by summarizeWeek and never listed as removed', () => {
    const s = summarizeWeek(plan, [u('x') as LifeEntry])
    expect(s.removed).toEqual([])
  })
})

describe('export', () => {
  it('has no section when the list is empty', () => {
    const md = buildExportMarkdown(plan, [])
    expect(md).not.toContain('## Upgrade list')
    expect(md).not.toContain('"upgrades"')
  })

  it('lists open items by size with their week, then done and dropped this week, plus the JSON array', () => {
    const entries: LifeEntry[] = [
      u('loose door handle', {}, { week: '2026-10-05' }),
      u('replace the old shelf', { size: 'big' }),
      u('squeaky hinge', { status: 'done', doneAt: '2026-10-21' }, { week: '2026-10-12' }),
      u('old fix', { status: 'done', doneAt: '2026-10-07' }, { week: '2026-10-05' }),
      u('not worth it', { status: 'dropped' }, { updatedAt: day('2026-10-22') }),
    ]
    const md = buildExportMarkdown(plan, entries)
    expect(md).toContain('## Upgrade list')
    expect(md).toContain('- Open, quick:\n  - loose door handle (added 2026-10-05)')
    expect(md).toContain('- Open, bigger:\n  - replace the old shelf (added 2026-10-19)')
    expect(md).toContain('- Done this week:\n  - squeaky hinge (quick, 2026-10-21)')
    expect(md).toContain('- Dropped this week:\n  - not worth it')
    expect(md).not.toContain('old fix')
    const json = JSON.parse(extractJsonFence(md)!)
    expect(json.upgrades).toEqual([
      expect.objectContaining({ text: 'loose door handle', size: 'quick', status: 'open', week: '2026-10-05' }),
      expect.objectContaining({ text: 'replace the old shelf', size: 'big', status: 'open' }),
      expect.objectContaining({ text: 'squeaky hinge', status: 'done', doneAt: '2026-10-21', week: '2026-10-12' }),
      expect.objectContaining({ text: 'not worth it', status: 'dropped' }),
    ])
    expect(json.upgrades[0]).not.toHaveProperty('doneAt')
    // They are in `upgrades`, not duplicated in `entries`.
    expect(json.entries.filter((e: { kind: string }) => e.kind === 'upgrade')).toEqual([])
  })
})
