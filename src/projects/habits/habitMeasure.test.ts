import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState, LifeEntry, LifePlan, LifeWeek } from '../../lib/db'
import {
  appsByWeek,
  evidenceLine,
  extensionsFor,
  latestEvidence,
  limitedApps,
  measuredHit,
  weekEvidence,
  weekSlips,
  weeklyAllowance,
} from './habitMeasure'
import { buildRecap, recapPeriod } from './habitRecapData'

const LIMITS = [
  { app: 'App A', minutes: 40 },
  { app: 'App B', minutes: 10 },
]

describe('extensionsFor (15 min per extension)', () => {
  it('exactly 7 x limit is 0, 1 minute over is 1, 16 over is 2, under is 0', () => {
    expect(extensionsFor(280, 40)).toBe(0)
    expect(extensionsFor(281, 40)).toBe(1)
    expect(extensionsFor(295, 40)).toBe(1)
    expect(extensionsFor(296, 40)).toBe(2)
    expect(extensionsFor(100, 40)).toBe(0)
  })
})

describe('weekEvidence', () => {
  it('matches app names case-insensitively and sums the extensions', () => {
    const e = weekEvidence(LIMITS, [
      { app: 'app a', minutes: 325 }, // 45 over: 3
      { app: 'APP B', minutes: 71 }, // 1 over: 1
      { app: 'Other', minutes: 999 },
    ])!
    expect(e.verified).toBe(4)
    expect(e.missing).toEqual([])
    expect(e.apps[0]).toMatchObject({ app: 'App A', weekly: 325, allowed: 280, extensions: 3 })
  })

  it('an app missing from the answer is no evidence, not a slip', () => {
    const e = weekEvidence(LIMITS, [{ app: 'App A', minutes: 0 }])!
    expect(e.verified).toBe(0)
    expect(e.missing).toEqual(['App B'])
    expect(e.apps[1]).toMatchObject({ weekly: null, extensions: 0 })
  })

  it('no answer (or an empty one) = unverified', () => {
    expect(weekEvidence(LIMITS, undefined)).toBeNull()
    expect(weekEvidence(LIMITS, [])).toBeNull()
  })

  it('evidenceLine names the apps over their limit', () => {
    const e = weekEvidence(LIMITS, [{ app: 'App A', minutes: 325 }])!
    expect(evidenceLine(e)).toBe('verificate ≥3 estensioni (App A +45 min)')
    expect(evidenceLine(weekEvidence(LIMITS, [{ app: 'App A', minutes: 10 }])!)).toBe('verificato: nessuna estensione')
  })
})

describe('verdict', () => {
  const ev = (verified: number) => ({ verified, apps: [], missing: [] })
  it('counts max(manual, verified)', () => {
    expect(weekSlips(1, 3)).toBe(3)
    expect(weekSlips(4, 3)).toBe(4)
  })
  it('the data only makes a week worse, never better', () => {
    expect(measuredHit(true, 0, ev(0), 0)).toBe(true)
    expect(measuredHit(true, 0, ev(1), 0)).toBe(false)
    expect(measuredHit(true, 2, ev(2), 0)).toBe(true) // proven = ticked: the ticks' verdict stands
    expect(measuredHit(true, 0, ev(2), 2)).toBe(true) // within the weekly grace
    expect(measuredHit(false, 0, ev(0), 0)).toBe(false)
    expect(measuredHit(true, 0, null, 0)).toBeNull()
    expect(measuredHit(null, 0, ev(0), 0)).toBeNull()
  })
  it('a daily grace allows 7 x grace a week', () => {
    expect(weeklyAllowance({ grace: 2, graceScope: 'day' })).toBe(14)
    expect(weeklyAllowance({ grace: 2, graceScope: 'week' })).toBe(2)
    expect(weeklyAllowance({})).toBe(0)
  })
})

const plan = (week: string): LifePlan => ({
  version: 1,
  week,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [],
  sundayCheck: [],
  checkins: [],
})
const lifeWeek = (week: string): LifeWeek => ({ id: week, week, plan: plan(week), importedAt: 1, updatedAt: 1 })
const appsEntry = (week: string, rows: unknown, createdAt = 1): LifeEntry => ({
  id: `${week}:sunday:screen-apps`,
  kind: 'sunday',
  week,
  ref: 'screen-apps',
  day: week,
  createdAt,
  updatedAt: createdAt,
  value: { answer: JSON.stringify(rows) },
})

describe('appsByWeek', () => {
  it("reads each week's apps answer; weeks without one are absent", () => {
    const map = appsByWeek(
      [lifeWeek('2026-11-09'), lifeWeek('2026-11-16')],
      [appsEntry('2026-11-16', [{ app: 'App A', minutes: 300 }])],
    )
    expect([...map.keys()]).toEqual(['2026-11-16'])
    expect(map.get('2026-11-16')).toEqual([{ app: 'App A', minutes: 300 }])
  })
})

const measured = (over: Partial<Habit> = {}): Habit => ({
  id: 'm',
  name: 'Habit M',
  emoji: '📱',
  createdAt: new Date('2026-10-01T12:00:00').getTime(),
  direction: 'avoid',
  measure: 'app-limits',
  measureLimits: LIMITS,
  ...over,
})

describe('limitedApps / latestEvidence', () => {
  it('lists each limited app once, live habits only', () => {
    const other = measured({
      id: 'n',
      measureLimits: [
        { app: 'app a', minutes: 5 },
        { app: 'App C', minutes: 5 },
      ],
    })
    const archived = measured({ id: 'o', archivedAt: 1, measureLimits: [{ app: 'App D', minutes: 5 }] })
    expect(limitedApps([measured(), other, archived])).toEqual(['App A', 'App B', 'App C'])
  })
  it('prefers this week, then last week, else null', () => {
    const apps = new Map([['2026-11-09', [{ app: 'App A', minutes: 300 }]]])
    expect(latestEvidence(measured(), apps, '2026-11-16', '2026-11-09')?.week).toBe('2026-11-09')
    expect(latestEvidence(measured(), new Map(), '2026-11-16', '2026-11-09')).toBeNull()
  })
})

describe('buildRecap with a measured habit', () => {
  const week = recapPeriod('week', '2026-11-16') // 16..22 Nov
  const today = '2026-11-22'
  const states = (o: Record<string, HabitDayState> = {}) => new Map([['m', new Map(Object.entries(o))]])
  const apps = (minutes: number) => new Map([['2026-11-16', [{ app: 'App A', minutes }]]])

  it('no apps answer: unverified (hit null), never kept', () => {
    const [row] = buildRecap([measured()], states(), new Map(), week, today, undefined, undefined, new Map())
    expect(row!.hit).toBeNull()
    expect(row!.measured).toMatchObject({ verifiedWeeks: 0, unverifiedWeeks: 1 })
  })

  it('nothing ticked but the data proves extensions: missed', () => {
    const [row] = buildRecap([measured()], states(), new Map(), week, today, undefined, undefined, apps(325))
    expect(row!.hit).toBe(false)
    expect(row!.measured!.weeks[0]).toMatchObject({ manual: 0, slips: 3, manualHit: true })
  })

  it('within the limit: hit; the ticks still count (max of the two)', () => {
    const [ok] = buildRecap([measured()], states(), new Map(), week, today, undefined, undefined, apps(280))
    expect(ok!.hit).toBe(true)
    const slips = new Map([['m', new Map([['2026-11-18', 2]])]])
    const [ticked] = buildRecap(
      [measured({ grace: 1 })],
      states({ '2026-11-18': 'fail' }),
      new Map(),
      week,
      today,
      undefined,
      slips,
      apps(281),
    )
    expect(ticked!.measured!.weeks[0]).toMatchObject({ manual: 2, slips: 2 })
    expect(ticked!.hit).toBe(true) // 1 fail day within a weekly grace of 1; proven 1 <= ticked 2
  })

  it('month: weeks hit / weeks verified, unverified counted apart', () => {
    const month = recapPeriod('month', '2026-11-01')
    const a = new Map([
      ['2026-11-02', [{ app: 'App A', minutes: 100 }]],
      ['2026-11-09', [{ app: 'App A', minutes: 400 }]],
    ])
    const [row] = buildRecap([measured()], states(), new Map(), month, today, undefined, undefined, a)
    // 400 - 280 = 120 over: 8 extensions. The week of the 23rd hasn't started yet.
    expect(row!.measured).toMatchObject({ verifiedWeeks: 2, hitWeeks: 1, unverifiedWeeks: 1, verified: 8 })
    expect(row!.measured!.weeks.map((w) => w.week)).toEqual(['2026-11-02', '2026-11-09', '2026-11-16'])
    expect(row!.hit).toBe(false)
  })
})
