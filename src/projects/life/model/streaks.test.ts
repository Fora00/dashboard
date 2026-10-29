import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan, LifeStreakEntry, LifeStreakValue } from '../../../lib/db'
import {
  buildExportMarkdown,
  doneLast7,
  extractJsonFence,
  isStaleStreak,
  last7,
  parseWeekJson,
  planStreakImport,
  sortStreaks,
  streakRatiosByWeek,
  streakRef,
  summarizeWeek,
} from './index'

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
const DAYS = `${'-'.repeat(21)}dddmd-d`
const sv = (name: string, over: Partial<LifeStreakValue> = {}): LifeStreakValue => ({
  name,
  days: DAYS,
  streak: 2,
  asOf: '2026-10-24',
  ...over,
})
const json = (extra: Record<string, unknown>) => JSON.stringify({ ...plan, ...extra })
let n = 0
const row = (value: LifeStreakValue, over: Partial<LifeStreakEntry> = {}): LifeStreakEntry => {
  n++
  return {
    id: `streak:${streakRef(value.name)}`,
    week: '2026-10-12',
    kind: 'streak',
    ref: streakRef(value.name),
    day: '2026-10-12',
    value,
    createdAt: n,
    updatedAt: n,
    ...over,
  }
}

describe('streakRef', () => {
  it('slugs the name: lowercase ASCII, accents folded, ≤ 40 chars, stable', () => {
    expect(streakRef('Leggere 10′ è ok')).toBe('leggere-10-e-ok')
    expect(streakRef('  Stretch!! ')).toBe('stretch')
    expect(streakRef('x'.repeat(30) + ' ' + 'y'.repeat(30))).toMatch(/^[a-z0-9-]{1,40}$/)
    expect(streakRef('x'.repeat(39) + ' y')).toBe('x'.repeat(39))
  })

  it('a name with no letter or digit gets a hash ref, still a valid ref', () => {
    const r = streakRef('🧘🏻')
    expect(r).toMatch(/^h-[0-9a-f]{8}$/)
    expect(streakRef('🧘🏻')).toBe(r)
    expect(streakRef('🏃')).not.toBe(r)
  })
})

describe('parseWeekJson: streaks', () => {
  it('absent means undefined (leave the rows alone); present is normalized', () => {
    const none = parseWeekJson(json({}))
    expect(none.ok && none.streaks).toBe(undefined)
    const r = parseWeekJson(
      json({
        streaks: [{ ...sv(' Read '), emoji: '📚', best: 9 }, sv('Walk')],
      }),
    )
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.streaks).toEqual([{ ...sv('Read'), emoji: '📚', best: 9 }, sv('Walk')])
    // Never part of the plan (the plan is stored as life_weeks).
    expect('streaks' in r.plan).toBe(false)
  })

  it('an empty array is valid (every habit archived)', () => {
    const r = parseWeekJson(json({ streaks: [] }))
    expect(r.ok && r.streaks).toEqual([])
  })

  it('rejects malformed items strictly', () => {
    const bad = (item: unknown) => {
      const r = parseWeekJson(json({ streaks: [item] }))
      return r.ok ? [] : r.errors
    }
    expect(bad({ ...sv('a'), days: 'ddd' })[0]).toMatch(/days must be 28/)
    expect(bad({ ...sv('a'), days: DAYS.replace('-', 'x') })[0]).toMatch(/days must be 28/)
    expect(bad({ ...sv('a'), streak: -1 })[0]).toMatch(/streak must be/)
    expect(bad({ ...sv('a'), streak: 1.5 })[0]).toMatch(/streak must be/)
    expect(bad({ ...sv('a'), best: '3' })[0]).toMatch(/best must be/)
    expect(bad({ ...sv('a'), asOf: '2026-02-30' })[0]).toMatch(/asOf/)
    expect(bad({ ...sv('a'), name: '' })[0]).toMatch(/name/)
    expect(bad({ ...sv('a'), name: 'x'.repeat(61) })[0]).toMatch(/longer than 60/)
    expect(bad({ ...sv('a'), name: 'a\nb' })[0]).toMatch(/line breaks/)
    expect(bad({ ...sv('a'), color: 'red' })[0]).toMatch(/not a known field/)
    expect(bad('Read')[0]).toMatch(/must be an object/)
    const notArray = parseWeekJson(json({ streaks: { a: 1 } }))
    expect(notArray.ok).toBe(false)
  })

  it('rejects two names that map to the same habit, and too many habits', () => {
    const r = parseWeekJson(json({ streaks: [sv('Read'), sv('read!')] }))
    expect(r.ok ? [] : r.errors).toEqual([expect.stringMatching(/same habit/)])
    const many = parseWeekJson(json({ streaks: Array.from({ length: 41 }, (_, i) => sv(`h${i}`)) }))
    expect(many.ok).toBe(false)
  })
})

describe('planStreakImport', () => {
  const NOW = 1_000

  it('creates new habits with a deterministic id in the import week', () => {
    const p = planStreakImport([], [sv('Read')], WEEK, '2026-10-24', NOW)
    expect(p.deletes).toEqual([])
    expect(p.upserts).toEqual([
      {
        id: 'streak:read',
        week: WEEK,
        kind: 'streak',
        ref: 'read',
        day: '2026-10-24',
        value: sv('Read'),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ])
  })

  it('replaces the value of an existing habit, keeping id, week and createdAt', () => {
    const old = row(sv('Read', { streak: 1, asOf: '2026-10-20' }), {
      id: 'some-old-id',
    })
    const p = planStreakImport([old], [sv('Read', { streak: 5 })], WEEK, '2026-10-24', NOW)
    expect(p.upserts).toEqual([{ ...old, value: sv('Read', { streak: 5 }), updatedAt: NOW }])
  })

  it('an unchanged habit writes nothing', () => {
    const same = row(sv('Read', { emoji: '📚' }))
    expect(planStreakImport([same], [sv('Read', { emoji: '📚' })], WEEK, '2026-10-24', NOW)).toEqual({
      upserts: [],
      deletes: [],
    })
  })

  it('deletes habits missing from the snapshot (archived in Streaks); empty deletes all', () => {
    const read = row(sv('Read'))
    const walk = row(sv('Walk'))
    expect(planStreakImport([read, walk], [sv('Read')], WEEK, '2026-10-24', NOW).deletes).toEqual([walk.id])
    expect(planStreakImport([read, walk], [], WEEK, '2026-10-24', NOW).deletes.sort()).toEqual(
      [read.id, walk.id].sort(),
    )
  })

  it('never goes backwards: an older snapshot changes and deletes nothing', () => {
    const read = row(sv('Read', { streak: 9, asOf: '2026-10-24' }))
    const walk = row(sv('Walk', { asOf: '2026-10-24' }))
    const p = planStreakImport([read, walk], [sv('Read', { streak: 3, asOf: '2026-10-17' })], WEEK, '2026-10-24', NOW)
    expect(p).toEqual({ upserts: [], deletes: [] })
  })
})

describe('streak row helpers', () => {
  it('last7 takes the newest 7 days and pads a short strip', () => {
    expect(last7(DAYS)).toEqual(['d', 'd', 'd', 'm', 'd', '-', 'd'])
    expect(last7('dm').join('')).toBe('-----dm')
    expect(doneLast7(DAYS)).toBe(5)
  })

  it('is stale after 3 days', () => {
    expect(isStaleStreak('2026-10-24', '2026-10-27')).toBe(false)
    expect(isStaleStreak('2026-10-23', '2026-10-27')).toBe(true)
  })

  it('sorts by name and ignores other kinds', () => {
    const other = {
      ...row(sv('x')),
      kind: 'idea',
      value: { text: 'x', status: 'open' },
    } as unknown as LifeEntry
    expect(sortStreaks([row(sv('Walk')), other, row(sv('Read'))]).map((e) => e.value.name)).toEqual(['Read', 'Walk'])
  })
})

describe('export: streaks', () => {
  it('adds a ## Streaks section and the `streaks` array (import shape), not in entries or the summary', () => {
    const read = row(sv('Read', { emoji: '📚', best: 12, streak: 4 }))
    const md = buildExportMarkdown(plan, [read], WEEK)
    expect(md).toContain('## Streaks')
    expect(md).toContain('- 📚 Read: streak 4 (best 12) · 5/7 done in the last 7 days · as of 2026-10-24')
    const out = JSON.parse(extractJsonFence(md)!) as {
      entries: unknown[]
      streaks: LifeStreakValue[]
    }
    expect(out.entries).toEqual([])
    expect(out.streaks).toEqual([sv('Read', { emoji: '📚', best: 12, streak: 4 })])
    expect(summarizeWeek(plan, [read]).removed).toEqual([])
    // Round trip: the exported array is a valid import.
    const back = parseWeekJson(JSON.stringify({ ...plan, streaks: out.streaks }))
    expect(back.ok && back.streaks).toEqual(out.streaks)
  })

  it('no streaks, no section and no key', () => {
    const md = buildExportMarkdown(plan, [], WEEK)
    expect(md).not.toContain('## Streaks')
    expect(JSON.parse(extractJsonFence(md)!)).not.toHaveProperty('streaks')
  })
})

describe('streakRatiosByWeek', () => {
  it('splits the 28-day strip by week, ignoring rest days and weeks without a verdict', () => {
    // asOf Sat 2026-10-24: the last 7 chars are Sun 10-18 .. Sat 10-24 (Sunday still belongs to the week of 10-12).
    const days = `${'-'.repeat(20)}m` + 'm' + 'ddmd-d'
    const out = streakRatiosByWeek([row(sv('A', { days })), row(sv('B', { days: '-'.repeat(28) }))])
    expect(out.get('2026-10-19')).toEqual([4 / 5])
    expect(out.get('2026-10-12')).toEqual([0])
  })
})
