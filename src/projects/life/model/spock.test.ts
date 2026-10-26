import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan } from '../../../lib/db'
import { buildExportMarkdown, summarizeWeek } from './index'

const WEEK = '2026-10-19'
const plan: LifePlan = {
  version: 1,
  week: WEEK,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [
    { id: 'water', emoji: '💧', label: 'Water', target: 3, max: null, energy: false },
    { id: 'read', emoji: '📖', label: 'Read', target: null, max: null, energy: false },
  ],
  sundayCheck: [],
  checkins: [],
}
const e = (kind: 'why' | 'idea', ref: string, value: object, week = WEEK): LifeEntry =>
  ({ id: `${kind}${ref}${week}`, week, kind, ref, day: week, value, createdAt: 1, updatedAt: 1 }) as LifeEntry

describe('spock test in the week summary and export', () => {
  it('collects reasons by habit, ignores empty ones, never lists ideas as removed', () => {
    const s = summarizeWeek(plan, [
      e('why', 'water', { reason: ' no time ' }),
      e('why', 'read', { reason: '' }),
      e('idea', 'water', { text: 'bottle', status: 'open' }),
      e('why', 'gone', { reason: 'removed habit' }),
    ])
    expect([...s.whys]).toEqual([['water', 'no time']])
    expect(s.removed.map((r) => r.ref)).toEqual(['gone'])
  })

  it('exports the reason and the live ideas (any week) under the habit, without dropped ones', () => {
    const md = buildExportMarkdown(plan, [
      e('why', 'water', { reason: 'bottle far away' }),
      e('idea', 'water', { text: 'bottle on the desk', status: 'trying' }, '2026-10-12'),
      e('idea', 'water', { text: 'old idea', status: 'dropped' }, '2026-10-12'),
    ])
    expect(md).toContain('  - why not: bottle far away')
    expect(md).toContain('  - ideas: bottle on the desk [trying]')
    expect(md).not.toContain('old idea')
  })
})
