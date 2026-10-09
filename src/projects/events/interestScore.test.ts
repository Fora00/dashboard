// The interest scoring model: feature keys, evidence (explicit + implicit, the
// 👎's own hide counted once), decay, smoothing, the fading seed, pins and
// mute, the event score with its explanation, the ordering gate and the
// in-day comparator. Every key and number here is made up.
import { describe, expect, it } from 'vitest'
import type { EventItem, InterestFeatures } from './types'
import { interestFeatures } from './interest'
import { collapseRepeats } from './groups'
import { compareInDay, groupByDay } from './model'
import {
  INTEREST_WEIGHTS,
  buildInterestModel,
  canOrderForYou,
  collectEvidence,
  compareForYou,
  decay,
  eventKeys,
  explain,
  featureKeysOf,
  featureLabel,
  hourBucket,
  makeScorer,
  scoreEvent,
  scoreKeys,
  seedStrength,
  type Evidence,
  type ProfileEntry,
} from './interestScore'

const DAY = 86_400_000
const NOW = Date.parse('2026-10-09T12:00:00Z')
const K = INTEREST_WEIGHTS.smoothing

const ev = (over: Partial<EventItem> = {}): EventItem => ({
  id: 'abcdef0123456789',
  title: 'Serata di prova',
  start: '2026-10-09T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: 'Sala',
  city: 'Trento',
  area: 'trentino',
  ring: 'home',
  url: 'https://example.org/e/1',
  source: 'srca',
  sources: ['srca'],
  category: 'concerts',
  subcategory: 'jazz-blues',
  tags: ['concerts', 'fake-tag'],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-01T04:23:00Z',
  ...over,
})

/** One piece of evidence on just `keys`. */
const evd = (keys: string[], value: number, at = NOW, kind: Evidence['kind'] = 'explicit'): Evidence => ({
  id: `x${Math.random()}`,
  kind,
  value,
  at,
  keys,
})
const many = (n: number, keys: string[], value = 1) => Array.from({ length: n }, () => evd(keys, value))
const pin = (id: string, p: ProfileEntry['pin'], seed: number | null = null): ProfileEntry => ({ id, seed, pin: p })

describe('feature keys', () => {
  it('a snapshot gives cat, sub, tags (not the category again), city, source, ring, weekday and time of day', () => {
    expect(featureKeysOf(interestFeatures(ev()))).toEqual([
      'cat:concerts',
      'sub:jazz-blues',
      'tag:fake-tag',
      'city:trento',
      'src:srca',
      'ring:home',
      'wd:5',
      'hour:evening',
    ])
  })

  it('city values are canonical (lowercase, no accents) and missing weekday/hour give no key', () => {
    const { subcategory: _drop, ...rest } = interestFeatures(ev())
    const f: InterestFeatures = { ...rest, city: "Sant'Örsola Terme", weekday: null, hour: null }
    const keys = featureKeysOf(f)
    expect(keys).toContain('city:sant-orsola terme')
    expect(keys.some((k) => k.startsWith('wd:') || k.startsWith('hour:') || k.startsWith('sub:'))).toBe(false)
  })

  it('an all-day event has a weekday but no time of day; eventKeys caches per object', () => {
    const e = ev({ start: '2026-10-10', allDay: true })
    const keys = eventKeys(e)
    expect(keys).toContain('wd:6')
    expect(keys.some((k) => k.startsWith('hour:'))).toBe(false)
    expect(eventKeys(e)).toBe(keys)
  })

  it('hour buckets', () => {
    expect([0, 4, 5, 11, 12, 17, 18, 21, 22, 23].map(hourBucket)).toEqual([
      'night',
      'night',
      'morning',
      'morning',
      'afternoon',
      'afternoon',
      'evening',
      'evening',
      'night',
      'night',
    ])
  })

  it('labels', () => {
    expect(featureLabel('sub:jazz-blues')).toBe('Jazz e blues')
    expect(featureLabel('hour:evening')).toBe('serata')
    expect(featureLabel('wd:6')).toBe('sabato')
    expect(featureLabel('city:riva del garda')).toBe('Riva Del Garda')
    expect(featureLabel('tag:fake-tag')).toBe('fake-tag')
  })
})

describe('evidence', () => {
  const base = ev()
  const features = interestFeatures(base)

  it('👍 / 👎 ±1, saved +2, hidden -0.5, hand-added +1; counts add up', () => {
    const out = collectEvidence({
      signals: [
        { id: 'a', value: 1, features, updatedAt: 1 },
        { id: 'b', value: -1, features, updatedAt: 2 },
      ],
      marks: [
        { id: 'c', state: 'saved', event: ev({ id: 'c' }), updatedAt: 3 },
        { id: 'd', state: 'hidden', event: ev({ id: 'd' }), updatedAt: 4 },
      ],
      manual: [{ event: ev({ id: 'm', source: 'manual' }), updatedAt: 5 }],
    })
    expect(out.map((e) => [e.id, e.kind, e.value, e.at])).toEqual([
      ['a', 'explicit', 1, 1],
      ['b', 'explicit', -1, 2],
      ['c', 'saved', 2, 3],
      ['d', 'hidden', -0.5, 4],
      ['m', 'manual', 1, 5],
    ])
    expect(buildInterestModel(out, [], NOW).counts).toEqual({
      up: 1,
      down: 1,
      saved: 1,
      hidden: 1,
      manual: 1,
      total: 5,
    })
  })

  it("the hide a 👎 made is the 👎 (counted once); a hide of the owner's own still counts", () => {
    const out = collectEvidence({
      signals: [
        { id: 'own', value: -1, features, updatedAt: 10 },
        { id: 'other', value: -1, features, updatedAt: 10 },
      ],
      marks: [
        { id: 'own', state: 'hidden', event: ev({ id: 'own' }), updatedAt: 10 },
        { id: 'other', state: 'hidden', event: ev({ id: 'other' }), updatedAt: 11 },
      ],
      manual: [],
    })
    expect(out.map((e) => `${e.id}:${e.kind}`)).toEqual(['own:explicit', 'other:explicit', 'other:hidden'])
  })
})

describe('model', () => {
  it('decay: half-life 90 days from updatedAt, never above 1', () => {
    expect(decay(NOW, NOW)).toBe(1)
    expect(decay(NOW - 90 * DAY, NOW)).toBeCloseTo(0.5)
    expect(decay(NOW - 180 * DAY, NOW)).toBeCloseTo(0.25)
    expect(decay(NOW + DAY, NOW)).toBe(1)
  })

  it('smoothing: one signal never dominates; many approach the full value', () => {
    const one = buildInterestModel([evd(['tag:t1'], 1)], [], NOW)
    expect(one.features.get('tag:t1')?.learned).toBeCloseTo(1 / (1 + K))
    const ten = buildInterestModel(many(10, ['tag:t1']), [], NOW)
    expect(ten.features.get('tag:t1')?.learned).toBeCloseTo(10 / (10 + K))
    // A save (+2) on its own is still under 1; scores are clamped to [-1, 1].
    const saves = buildInterestModel(many(10, ['tag:t1'], 2), [], NOW)
    expect(saves.features.get('tag:t1')?.score).toBe(1)
  })

  it('old evidence weighs less', () => {
    const old = buildInterestModel([evd(['tag:t1'], 1, NOW - 90 * DAY)], [], NOW).features.get('tag:t1')
    expect(old?.weight).toBeCloseTo(0.5)
    expect(old?.score).toBeCloseTo(0.5 / (0.5 + K))
    expect(old?.count).toBe(1)
  })

  it('seed: alone it IS the score, it fades with the number of signals, gone at 60', () => {
    const seed: ProfileEntry[] = [{ id: 'tag:seeded', seed: 0.8, pin: null }]
    expect(seedStrength(0)).toBe(1)
    expect(seedStrength(30)).toBe(0.5)
    expect(seedStrength(60)).toBe(0)
    expect(seedStrength(90)).toBe(0)
    expect(buildInterestModel([], seed, NOW).features.get('tag:seeded')?.score).toBeCloseTo(0.8)
    const half = buildInterestModel(many(30, ['tag:other']), seed, NOW)
    expect(half.seedStrength).toBe(0.5)
    expect(half.features.get('tag:seeded')?.score).toBeCloseTo(0.4)
    expect(buildInterestModel(many(60, ['tag:other']), seed, NOW).features.get('tag:seeded')?.score).toBe(0)
  })

  it('seed + evidence on the same feature: (sum + s·K·seed) / (n + K)', () => {
    const m = buildInterestModel([evd(['tag:t1'], -1)], [{ id: 'tag:t1', seed: 1, pin: null }], NOW)
    const s = seedStrength(1)
    expect(m.features.get('tag:t1')?.score).toBeCloseTo((-1 + s * K * 1) / (1 + K))
    expect(m.features.get('tag:t1')?.learned).toBeCloseTo(-1 / (1 + K))
  })

  it('pins override learning and seed; mute zeroes the feature', () => {
    const m = buildInterestModel(
      [...many(10, ['tag:a', 'tag:b', 'tag:c'], -1)],
      [pin('tag:a', 'up', -1), pin('tag:b', 'down'), pin('tag:c', 'mute'), pin('tag:only', 'up')],
      NOW,
    )
    expect(m.features.get('tag:a')?.score).toBe(1)
    expect(m.features.get('tag:b')?.score).toBe(-1)
    expect(m.features.get('tag:c')?.score).toBe(0)
    // A pin alone (no evidence) is a feature too.
    expect(m.features.get('tag:only')).toMatchObject({ score: 1, count: 0, pin: 'up' })
  })

  it('unknown kinds are ignored', () => {
    const m = buildInterestModel([evd(['zz:x', 'tag:t'], 1)], [pin('qq:y', 'up')], NOW)
    expect([...m.features.keys()]).toEqual(['tag:t'])
  })
})

describe('event score and explanation', () => {
  const pinned = buildInterestModel(
    [],
    [pin('cat:concerts', 'up'), pin('sub:jazz-blues', 'up'), pin('hour:evening', 'up'), pin('city:trento', 'down')],
    NOW,
  )

  it('weighted sum: cat and sub weigh more than city and time', () => {
    const W = INTEREST_WEIGHTS.kind
    const s = scoreEvent(ev(), pinned)
    expect(s.score).toBeCloseTo(W.cat + W.sub + W.hour - W.city)
    expect(W.cat).toBeGreaterThan(W.city)
    expect(W.sub).toBeGreaterThan(W.hour)
  })

  it('the top 3 contributions explain it, largest first; negatives after "meno"', () => {
    const s = scoreEvent(ev(), pinned)
    expect(s.reasons.map((r) => r.key)).toEqual(['cat:concerts', 'sub:jazz-blues', 'city:trento'])
    expect(explain(s.reasons)).toBe('perché: Concerts & music, Jazz e blues · meno: Trento')
    expect(explain([])).toBe('')
  })

  it('"perché: jazz e blues, serata"', () => {
    const m = buildInterestModel([], [pin('sub:jazz-blues', 'up'), pin('hour:evening', 'up')], NOW)
    expect(explain(scoreEvent(ev(), m).reasons)).toBe('perché: Jazz e blues, serata')
  })

  it('tags are averaged: many tags never outweigh the category', () => {
    const m = buildInterestModel([], [pin('tag:t1', 'up')], NOW)
    const one = scoreKeys(['tag:t1'], m).score
    const four = scoreKeys(['tag:t1', 'tag:t2', 'tag:t3', 'tag:t4'], m).score
    expect(one).toBeCloseTo(INTEREST_WEIGHTS.kind.tag)
    expect(four).toBeCloseTo(INTEREST_WEIGHTS.kind.tag / 4)
  })

  it('a muted feature never counts or explains; tiny contributions do not explain', () => {
    const m = buildInterestModel(many(40, ['sub:jazz-blues'], 1), [pin('sub:jazz-blues', 'mute')], NOW)
    const s = scoreEvent(ev(), m)
    expect(s.score).toBe(0)
    expect(s.reasons).toEqual([])
    const W = INTEREST_WEIGHTS.kind.wd
    const two = buildInterestModel(many(2, ['wd:5']), [], NOW) // W · 2/5 = 0.08
    expect(scoreKeys(['wd:5'], two).reasons).toHaveLength(1)
    const old = buildInterestModel([evd(['wd:5'], 1, NOW - 90 * DAY)], [], NOW) // W · 0.5/3.5 ≈ 0.03
    expect(scoreKeys(['wd:5'], old).score).toBeCloseTo((W * 0.5) / 3.5)
    expect(scoreKeys(['wd:5'], old).reasons).toEqual([])
  })

  it('makeScorer remembers each event object', () => {
    const score = makeScorer(pinned)
    const e = ev()
    expect(score(e)).toBe(score(e))
  })
})

describe('ordering', () => {
  it('the gate: fewer than 30 signals refuse', () => {
    expect(INTEREST_WEIGHTS.minSignalsForOrdering).toBe(30)
    expect(canOrderForYou(0)).toBe(false)
    expect(canOrderForYou(29)).toBe(false)
    expect(canOrderForYou(30)).toBe(true)
  })

  const day = '2026-10-15'
  const at = (h: string) => `${day}T${h}:00+02:00`
  const near = ev({ id: 'near1', title: 'B near', ring: 'near', category: 'cinema', start: at('18:00') })
  const homeA = ev({ id: 'home1', title: 'A home', ring: 'home', category: 'cinema', start: at('21:00') })
  const homeB = ev({ id: 'home2', title: 'C home', ring: 'home', category: 'cinema', start: at('20:00') })
  const now = Date.parse('2026-10-10T10:00:00Z')

  it('score first, above the ring; equal scores keep ring, then start, then title', () => {
    const usual = compareInDay([])
    const scores = new Map([
      ['near1', 0.9],
      ['home1', 0],
      ['home2', 0],
    ])
    const cmp = compareForYou((e) => scores.get(e.id) ?? 0, usual)
    const [g] = groupByDay([homeA, near, homeB], now, cmp)
    expect(g?.events.map((e) => e.id)).toEqual(['near1', 'home2', 'home1'])
    // Off: the usual order (ring first).
    const [u] = groupByDay([homeA, near, homeB], now, usual)
    expect(u?.events.map((e) => e.id)).toEqual(['home2', 'home1', 'near1'])
  })

  it('float noise never beats the ring', () => {
    const cmp = compareForYou((e) => (e.id === 'near1' ? 1e-9 : 0), compareInDay([]))
    const [g] = groupByDay([near, homeB], now, cmp)
    expect(g?.events.map((e) => e.id)).toEqual(['home2', 'near1'])
  })

  it('with a real model: the liked category leads its day; a repeat group keeps its lead event', () => {
    const liked = ev({
      id: 'liked',
      title: 'Z liked',
      ring: 'near',
      category: 'theatre',
      subcategory: 'prosa',
      start: at('21:30'),
    })
    const model = buildInterestModel(many(30, ['cat:theatre', 'sub:prosa']), [], NOW)
    const score = makeScorer(model)
    const cmp = compareForYou((e) => score(e).score, compareInDay([]))
    const repeat = (id: string, d: string) => {
      const { subcategory: _none, ...e } = ev({
        id,
        title: 'Weekly',
        category: 'boardgames',
        start: `${d}T18:00:00+02:00`,
      })
      return e
    }
    const reps = [repeat('r1', day), repeat('r2', '2026-10-22'), repeat('r3', '2026-10-29')]
    const days = groupByDay([homeA, liked, ...reps], now, cmp)
    expect(days[0]?.events.map((e) => e.id)).toEqual(['liked', 'r1', 'home1'])
    const { days: collapsed, repeats } = collapseRepeats(days, true)
    expect(collapsed[0]?.events.map((e) => e.id)).toEqual(['liked', 'r1', 'home1'])
    expect(repeats.get('r1')?.map((e) => e.id)).toEqual(['r1', 'r2', 'r3'])
    expect(explain(score(liked).reasons)).toBe('perché: Theatre, Prosa')
  })
})
