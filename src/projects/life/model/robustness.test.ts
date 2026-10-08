import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan, LifeTracker, LifeWeek } from '../../../lib/db'
import { buildChartPoints } from '../week/chartPoints'
import { msUntilNextMidnight, todayInfo } from '../useToday'
import {
  buildExportMarkdown,
  diffPlans,
  extractJsonFence,
  fenceFor,
  hiddenTrackerEntries,
  parseWeekJson,
} from './index'

const WEEK = '2026-09-28'

function plan(over: Partial<LifePlan> = {}): LifePlan {
  return {
    version: 1,
    week: WEEK,
    focus: [],
    rules: [],
    tasks: [],
    trackers: [],
    sundayCheck: [],
    checkins: [],
    ...over,
  }
}
const tracker = (id: string): LifeTracker => ({
  id,
  emoji: '',
  label: id,
  target: null,
  max: null,
  energy: false,
})
const tEntry = (ref: string, week = WEEK, id = `${ref}-${Math.random()}`): LifeEntry => ({
  id,
  week,
  ref,
  day: week,
  createdAt: 1,
  updatedAt: 1,
  kind: 'tracker',
  value: {},
})

describe('hiddenTrackerEntries (LF3)', () => {
  it('counts logged entries per removed tracker, this week only', () => {
    const prev = plan({ trackers: [tracker('a'), tracker('b'), tracker('c')] })
    const next = plan({ trackers: [tracker('c')] })
    const d = diffPlans(prev, next)
    const entries = [tEntry('a'), tEntry('a'), tEntry('b', '2026-09-21'), tEntry('c')]
    const hidden = hiddenTrackerEntries(d.trackers.removed, entries, WEEK)
    expect(hidden.map((h) => [h.tracker.id, h.count])).toEqual([['a', 2]])
  })
  it('is empty when nothing removed', () => {
    expect(hiddenTrackerEntries([], [tEntry('a')], WEEK)).toEqual([])
  })
})

describe('buildChartPoints (LF4)', () => {
  const wk = (week: string, p: Partial<LifePlan> = {}): LifeWeek => ({
    id: week,
    week,
    plan: plan({ ...p, week }),
    importedAt: 0,
    updatedAt: 0,
  })
  it('drops future weeks and positions by weeks elapsed, not index', () => {
    const weeks = [wk('2026-10-12'), wk('2026-10-05'), wk('2026-09-14'), wk('2026-09-07')] // newest first
    const pts = buildChartPoints(weeks, [], '2026-10-05', 12)
    expect(pts.map((p) => p.week)).toEqual(['2026-09-07', '2026-09-14', '2026-10-05'])
    expect(pts.map((p) => p.at)).toEqual([0, 1 / 4, 1])
    expect(pts[2]!.current).toBe(true)
  })
  it('keeps only the latest max weeks', () => {
    const weeks = [wk('2026-10-05'), wk('2026-09-28'), wk('2026-09-21')]
    expect(buildChartPoints(weeks, [], '2026-10-05', 2).map((p) => p.week)).toEqual(['2026-09-28', '2026-10-05'])
  })
  it('handles empty input, a lone point and all-null series', () => {
    expect(buildChartPoints([], [], WEEK, 12)).toEqual([])
    const one = buildChartPoints([wk(WEEK)], [], WEEK, 12)
    expect(one).toHaveLength(1)
    expect(one[0]).toMatchObject({
      at: 0,
      focus: null,
      checkins: null,
      habits: null,
      tasks: null,
    })
  })
})

describe('useToday helpers (LF2)', () => {
  it('measures the time to the next local midnight', () => {
    expect(msUntilNextMidnight(new Date(2026, 9, 8, 23, 0, 0))).toBe(3_600_000)
    expect(msUntilNextMidnight(new Date(2026, 9, 8, 23, 59, 59, 999))).toBe(1000)
  })
  it('rolls the day, week and Monday flag over midnight', () => {
    expect(todayInfo(new Date(2026, 9, 4, 23, 59))).toMatchObject({
      today: '2026-10-04',
      week: '2026-09-28',
      isMonday: false,
    })
    expect(todayInfo(new Date(2026, 9, 5, 0, 1))).toMatchObject({
      today: '2026-10-05',
      week: '2026-10-05',
      isMonday: true,
    })
  })
})

describe('export fence (LF6)', () => {
  it('uses a fence longer than any backtick run', () => {
    expect(fenceFor('no ticks')).toBe('````')
    expect(fenceFor('a ``` b')).toBe('````')
    expect(fenceFor('a ````` b')).toBe('``````')
  })
  it('extracts fenced JSON, old 3-backtick exports included', () => {
    expect(extractJsonFence('x\n```json\n{"a":1}\n```\ny')).toBe('{"a":1}')
    expect(extractJsonFence('x\n````json\n{"a":"```"}\n````\ny')).toBe('{"a":"```"}')
    expect(extractJsonFence('no fence')).toBeNull()
    expect(extractJsonFence('```json\n{"a":1}')).toBeNull()
  })
  it('round-trips a plan with triple backticks in its text', () => {
    const p = plan({
      focus: [{ id: 'f1', title: 'Use ``` fences and ```` too' }],
      rules: ['```json'],
    })
    const md = buildExportMarkdown(p, [], '2026-09-28')
    const json = extractJsonFence(md)
    expect(json).not.toBeNull()
    const back = JSON.parse(json!) as { plan: LifePlan }
    expect(back.plan.focus[0]!.title).toBe('Use ``` fences and ```` too')
    expect(back.plan.rules).toEqual(['```json'])
  })
})

describe('validation hardening (LF6)', () => {
  const base = { version: 1, week: WEEK }
  it('rejects line breaks and control characters in one-line fields', () => {
    for (const title of ['a\nb', 'a\u0000b', 'a b']) {
      const r = parseWeekJson(JSON.stringify({ ...base, focus: [{ id: 'f', title }] }))
      expect(r.ok).toBe(false)
    }
    expect(parseWeekJson(JSON.stringify({ ...base, rules: ['a\nb'] })).ok).toBe(false)
    expect(parseWeekJson(JSON.stringify({ ...base, trackers: [{ id: 't', label: 'x\ty' }] })).ok).toBe(false)
  })
  it('still allows newlines in task notes', () => {
    const task = { id: 't', title: 'x', notes: 'line1\nline2' }
    expect(parseWeekJson(JSON.stringify({ ...base, tasks: [task] })).ok).toBe(true)
    expect(parseWeekJson(JSON.stringify({ ...base, tasks: [{ ...task, notes: 'a\u0000' }] })).ok).toBe(false)
  })
  it('reports an over-cap array once without mapping its items', () => {
    const focus = Array.from({ length: 500 }, (_, i) => ({
      id: `f${i}`,
      title: 'x',
    }))
    const r = parseWeekJson(JSON.stringify({ ...base, focus }))
    expect(r).toEqual({ ok: false, errors: ['focus has 500 items (max 3)'] })
  })
  it('rejects oversized input before parsing', () => {
    const r = parseWeekJson(' '.repeat(200_001))
    expect(r.ok).toBe(false)
  })
})
