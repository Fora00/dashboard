// The seed file schema (shared with scripts/events-seed-link.ts), the feature
// key rules and the prefill link. Keys and values here are obviously fake.
import { describe, expect, it } from 'vitest'
import { FEATURE_KEY_RE, featureKey, featureKeyProblem, keyPart } from './featureKeys'
import { MAX_SEED_KEYS, decodeSeedParam, encodeSeedLink, parseSeedJson, seedDiff } from './interestSeed'

const json = (v: unknown) => JSON.stringify(v)

describe('feature keys', () => {
  it('keyPart: lowercase, accents dropped, other characters become a dash, capped at 80', () => {
    expect(keyPart('Riva del Garda')).toBe('riva del garda')
    expect(keyPart("Sant'Örsola  Terme ")).toBe('sant-orsola terme')
    expect(keyPart('a/b//c')).toBe('a-b-c')
    expect(keyPart('***')).toBe('')
    expect(keyPart('x'.repeat(200))).toHaveLength(80)
    expect(featureKey('city', '***')).toBeNull()
  })

  it('every canonical key passes the server regex', () => {
    for (const raw of ['Malè', 'Bolzano/Bozen', 'São Paulo!', 'a_b.c-d', '  x  ']) {
      const k = featureKey('city', raw)
      expect(k && FEATURE_KEY_RE.test(k)).toBe(true)
    }
  })

  it('problems: unknown kind, non-canonical value, bad weekday or time bucket', () => {
    expect(featureKeyProblem('tag:fake-one')).toBeNull()
    expect(featureKeyProblem('wd:7')).toBeNull()
    expect(featureKeyProblem('hour:night')).toBeNull()
    expect(featureKeyProblem('nope')).toMatch(/kind/)
    expect(featureKeyProblem('zz:fake')).toMatch(/unknown kind/)
    expect(featureKeyProblem('city:Fake Town')).toMatch(/city:fake town/)
    expect(featureKeyProblem('wd:8')).toMatch(/weekday/)
    expect(featureKeyProblem('hour:noon')).toMatch(/morning/)
  })
})

describe('seed file', () => {
  it('accepts { seed: { key: -1..1 } }', () => {
    expect(parseSeedJson(json({ seed: { 'tag:fake-a': 0.5, 'wd:1': -1, 'cat:fake': 1 } }))).toEqual({
      ok: true,
      seed: { 'tag:fake-a': 0.5, 'wd:1': -1, 'cat:fake': 1 },
    })
    expect(parseSeedJson(json({ seed: {} }))).toEqual({ ok: true, seed: {} })
  })

  it.each([
    ['not JSON', '{'],
    ['no seed', json({})],
    ['extra top-level key', json({ seed: {}, other: 1 })],
    ['value above 1', json({ seed: { 'tag:fake': 1.5 } })],
    ['value below -1', json({ seed: { 'tag:fake': -2 } })],
    ['not a number', json({ seed: { 'tag:fake': '0.5' } })],
    ['key not kind:value', json({ seed: { 'no colon': 0.1 } })],
    ['unknown kind', json({ seed: { 'zz:fake': 0.1 } })],
    ['non-canonical key', json({ seed: { 'city:Fake Town': 0.1 } })],
    ['too long', json({ seed: { [`tag:${'x'.repeat(81)}`]: 0.1 } })],
  ])('rejects %s', (_name, text) => {
    const r = parseSeedJson(text)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(0)
  })

  it(`at most ${MAX_SEED_KEYS} keys`, () => {
    const seed = (n: number) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`tag:fake-${i}`, 0]))
    expect(parseSeedJson(json({ seed: seed(MAX_SEED_KEYS) })).ok).toBe(true)
    expect(parseSeedJson(json({ seed: seed(MAX_SEED_KEYS + 1) })).ok).toBe(false)
  })

  it('rejects oversized input before parsing', () => {
    const r = parseSeedJson(' '.repeat(60_000))
    expect(r).toEqual({ ok: false, errors: [expect.stringMatching(/too large/)] })
  })
})

describe('seed link', () => {
  it('round-trips through the link, accents included; only prefills (decode never parses)', () => {
    const seed = { 'tag:fake-a': 0.25, 'city:fake e': -0.5 }
    const link = encodeSeedLink(seed, 'https://example.org/app/')
    expect(link.startsWith('https://example.org/app/#/events/interests?seed=')).toBe(true)
    const param = new URL(link.replace('#/events/interests', '')).searchParams.get('seed') ?? ''
    const decoded = decodeSeedParam(param)
    expect(decoded.ok).toBe(true)
    if (decoded.ok) expect(parseSeedJson(decoded.text)).toEqual({ ok: true, seed })
  })

  it('a damaged link is reported, not thrown', () => {
    expect(decodeSeedParam('***').ok).toBe(false)
    expect(decodeSeedParam('_w').ok).toBe(false) // not UTF-8
  })
})

describe('seed diff (the import preview)', () => {
  it('new, changed, unchanged and removed (pins are not seeds)', () => {
    const current = [
      { id: 'tag:same', seed: 0.5 },
      { id: 'tag:moved', seed: 0.1 },
      { id: 'tag:gone', seed: -0.3 },
      { id: 'tag:pinned-only', seed: null },
    ]
    expect(seedDiff(current, { 'tag:same': 0.5, 'tag:moved': 0.2, 'tag:new': 1 })).toEqual({
      added: ['tag:new'],
      changed: ['tag:moved'],
      removed: ['tag:gone'],
      unchanged: ['tag:same'],
    })
  })
})
