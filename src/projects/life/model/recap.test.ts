import { describe, expect, it } from 'vitest'
import { buildExportMarkdown, diffPlans, parseWeekJson } from './index'

const base = { version: 1, week: '2026-01-05' }
const recap = [
  {
    id: 'r1',
    kind: 'minimum',
    label: 'Habit A',
    weeks: [
      { week: '2025-12-22', done: 5, of: 7 },
      { week: '2025-12-29', done: 4, of: 7 },
    ],
    returns: 2,
    criterion: { text: '5 of 7 for 4 weeks', met: 2, of: 4 },
  },
  {
    id: 'r2',
    kind: 'progress',
    label: 'Metric B',
    unit: 'rep',
    points: [
      { date: '2026-01-05', value: 8 },
      { date: '2026-01-12', value: 9 },
    ],
  },
]
const parse = (r: unknown) => parseWeekJson(JSON.stringify({ ...base, recap: r }))

describe('recap', () => {
  it('is absent from plans without one', () => {
    const r = parseWeekJson(JSON.stringify(base))
    expect(r.ok && 'recap' in r.plan).toBe(false)
  })

  it('accepts the proposed shape', () => {
    const r = parse(recap)
    expect(r.ok && r.plan.recap).toHaveLength(2)
  })

  it('rejects bad shapes without saving anything', () => {
    const bad = (mut: (c: any) => void) => {
      const c = structuredClone(recap)
      mut(c)
      return parse(c)
    }
    expect(bad((c) => (c[0].weeks[0].done = 9)).ok).toBe(false)
    expect(bad((c) => (c[0].weeks[0].week = '2025-12-23')).ok).toBe(false)
    expect(bad((c) => (c[0].weeks[1].week = '2025-12-22')).ok).toBe(false)
    expect(bad((c) => (c[1].points[1].date = '2026-01-05')).ok).toBe(false)
    expect(bad((c) => (c[0].points = [])).ok).toBe(false)
    expect(bad((c) => (c[0].criterion.met = 5)).ok).toBe(false)
    expect(bad((c) => (c[1].id = 'r1')).ok).toBe(false)
    expect(bad((c) => (c[0].kind = 'x')).ok).toBe(false)
  })

  it('shows in the diff and the export', () => {
    const a = parseWeekJson(JSON.stringify(base))
    const b = parse(recap)
    if (!a.ok || !b.ok) throw new Error('parse')
    expect(diffPlans(a.plan, b.plan).summary).toContain('2 recap lines added')
    const md = buildExportMarkdown(b.plan, [])
    expect(md).toContain('## Recap')
    expect(md).toContain('Habit A: 5/7, 4/7')
    expect(md).toContain('8 → 9 rep')
  })
})

describe('export says when it was done', () => {
  it('adds the day to done focus and the time to entries', () => {
    const p = parseWeekJson(JSON.stringify({ ...base, focus: [{ id: 'f1', title: 'Focus A' }] }))
    if (!p.ok) throw new Error('parse')
    const entry = {
      id: '2026-01-05:focus:f1',
      week: '2026-01-05',
      ref: 'f1',
      day: '2026-01-07',
      kind: 'focus' as const,
      value: { done: true },
      createdAt: Date.UTC(2026, 0, 7, 9, 30),
      updatedAt: 0,
    }
    const md = buildExportMarkdown(p.plan, [entry])
    expect(md).toContain('- [x] Focus A (Wed 2026-01-07)')
    expect(md).toContain('"at": "2026-01-07T09:30:00.000Z"')
  })
})
