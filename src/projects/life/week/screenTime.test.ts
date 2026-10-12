import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan, LifeWeek } from '../../../lib/db'
import { buildScreenTime } from './screenTime'

const plan = (week: string): LifePlan => ({
  version: 1,
  week,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [],
  checkins: [],
  sundayCheck: [],
})
const wk = (week: string): LifeWeek => ({ id: week, week, plan: plan(week), importedAt: 0, updatedAt: 0 })
const ans = (week: string, ref: string, answer: unknown): LifeEntry =>
  ({
    id: `${week}:sunday:${ref}`,
    week,
    ref,
    day: week,
    kind: 'sunday',
    value: { answer },
    createdAt: 0,
    updatedAt: 0,
  }) as LifeEntry

describe('buildScreenTime', () => {
  it('reads the fixed screen-time answers and picks the latest apps with deltas', () => {
    const weeks = [wk('2026-10-12'), wk('2026-10-05')]
    const entries = [
      ans('2026-10-05', 'screen-social', 90),
      ans('2026-10-12', 'screen-social', 120),
      ans('2026-10-05', 'screen-apps', JSON.stringify([{ app: 'Instagram', minutes: 60 }])),
      ans(
        '2026-10-12',
        'screen-apps',
        JSON.stringify([
          { app: 'Instagram', minutes: 80 },
          { app: 'Safari', minutes: 100 },
        ]),
      ),
    ]
    const d = buildScreenTime(weeks, entries, '2026-10-12', 12)
    expect(d.weeks).toEqual(['2026-10-05', '2026-10-12'])
    expect(d.series).toEqual([{ label: 'Social', values: [90, 120] }])
    expect(d.apps?.week).toBe('2026-10-12')
    expect(d.apps?.rows[0]?.app).toBe('Safari')
    expect(d.apps?.previous.get('instagram')).toBe(60)
  })

  it('is empty without answers', () => {
    const d = buildScreenTime([wk('2026-10-12')], [], '2026-10-12', 12)
    expect(d.series).toEqual([])
    expect(d.apps).toBeNull()
  })
})

describe('screen time in the export', () => {
  it('prints a Screen time section and keeps the entries out of "removed"', async () => {
    const { buildExportMarkdown } = await import('../model')
    const entries = [
      ans('2026-10-12', 'screen-social', 135),
      ans('2026-10-12', 'screen-apps', JSON.stringify([{ app: 'Instagram', minutes: 80 }])),
    ]
    const md = buildExportMarkdown(plan('2026-10-12'), entries, '2026-10-12')
    expect(md).toContain('## Screen time')
    expect(md).toContain('- Social: 2h 15m')
    expect(md).toContain('- App più usate: Instagram 80m')
    expect(md).not.toContain('Removed from plan')
  })
})
