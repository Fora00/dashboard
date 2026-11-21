import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan } from '../../../lib/db'
import { addMonths, buildMonthMarkdown, buildMonthReport, monthRange, readShare } from './month'

const plan = (week: string, target: number | null): LifePlan => ({
  version: 1,
  week,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [{ id: 't1', emoji: '🧗', label: 'Climb', target, max: null, energy: false }],
  sundayCheck: [],
  checkins: [],
})

const tick = (week: string, day: string): LifeEntry => ({
  id: `${week}-${day}`,
  week,
  kind: 'tracker',
  ref: 't1',
  day,
  value: {},
  createdAt: 0,
  updatedAt: 0,
})

describe('month helpers', () => {
  it('knows the range and shifts months', () => {
    expect(monthRange('2026-02')).toEqual({ first: '2026-02-01', last: '2026-02-28' })
    expect(addMonths('2026-12', 1)).toBe('2027-01')
    expect(addMonths('2026-01', -1)).toBe('2025-12')
  })

  it('reads a share in words', () => {
    expect([0.9, 0.6, 0.2].map(readShare)).toEqual(['kept', 'half', 'few'])
  })
})

describe('buildMonthReport', () => {
  it('sums a tracker over the weeks that start in the month and checks its target', () => {
    const entries = [
      tick('2026-10-05', '2026-10-06'),
      tick('2026-10-05', '2026-10-07'),
      tick('2026-10-12', '2026-10-13'),
    ]
    const r = buildMonthReport(
      '2026-10',
      [plan('2026-10-05', 2), plan('2026-10-12', 2), plan('2026-09-28', 2)],
      entries,
      '2026-10-29',
    )
    const t = r.trackers[0]!
    expect(t.total).toBe(3)
    expect(t.weeks.map((w) => w.week)).toEqual(['2026-10-05', '2026-10-12'])
    expect([t.hit, t.withTarget]).toEqual([1, 2])
    expect(t.reading).toBe('half')
    expect(r.counts.half).toBe(1)
  })
})

describe('buildMonthMarkdown', () => {
  it('writes the lines, habits, weeks and the reasons', () => {
    const report = buildMonthReport('2026-10', [plan('2026-10-05', 2)], [], '2026-10-29')
    const md = buildMonthMarkdown(report, [{ label: 'Focus', now: 60, before: null }])
    expect(md).toContain('# Life month 2026-10')
    expect(md).toContain('- Focus: 60% (before: n/a)')
    expect(md).toContain('- 🧗 Climb: 0 in all, target hit 0 of 1 weeks (few)')
  })

  it('writes the live Habits section', () => {
    const report = buildMonthReport('2026-10', [plan('2026-10-05', 2)], [], '2026-10-29')
    const md = buildMonthMarkdown(
      report,
      [],
      [
        {
          emoji: '📖',
          name: 'Read',
          avoid: false,
          done: 20,
          floor: 3,
          skip: 2,
          fail: 1,
          empty: 4,
          expected: 24,
          hit: false,
          graceUsed: 0,
          extra: 2,
          reasons: { Tired: 2 },
        },
      ],
    )
    expect(md).toContain('## Habits (live, from the Habits page)')
    expect(md).toContain(
      '- 📖 Read [no engine]: 20 done (3 floor) of 24 expected, 2 rest, 1 missed, 4 unmarked, 2 extra beyond the goal; target missed; reasons: Tired x2',
    )
  })
})
