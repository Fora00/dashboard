import { describe, expect, it } from 'vitest'
import type { Habit } from '../../lib/db'
import { FIXTURE } from './habitsPlan.fixture'
import {
  decodeHabitsParam,
  encodeHabitsLink,
  parseHabitsPlanJson,
  planHabitsImport,
  type HabitsPlan,
} from './habitsPlan'

// Habits import link (EN4), pure part: validation, link round trip, match by
// name, merge on update. Made-up habits only (no personal text in the repo).

const existing = (over: Partial<Habit> = {}): Habit => ({
  id: 'h-existing',
  name: 'Habit test existing',
  emoji: '📓',
  createdAt: 1,
  anchor: 'test anchor old',
  why: 'test why kept',
  target: 7,
  ...over,
})
const others: Habit[] = [
  { id: 'h-other-1', name: 'Habit test other 1', emoji: '💧', createdAt: 2 },
  { id: 'h-other-2', name: 'Habit test other 2', emoji: '🚶', createdAt: 3, kind: 'forever' },
]

function plan(json: unknown = FIXTURE): HabitsPlan {
  const r = parseHabitsPlanJson(JSON.stringify(json))
  if (!r.ok) throw new Error(r.errors.join('\n'))
  return r.plan
}
function errorsOf(json: unknown): string[] {
  const r = parseHabitsPlanJson(JSON.stringify(json))
  return r.ok ? [] : r.errors
}
const withRow = (row: Record<string, unknown>) => ({ habits: [row] })

describe('parseHabitsPlanJson', () => {
  it('accepts the fixture and keeps only the fields present', () => {
    const p = plan()
    expect(p.asOf).toBe('2026-11-02')
    expect(p.habits).toHaveLength(4)
    expect(p.habits[3]).toEqual({
      name: 'habit test existing',
      engine: 'emotions',
      anchor: 'test anchor new',
      floor: 'test floor new',
    })
  })

  it('rejects an unknown engine', () => {
    expect(errorsOf(withRow({ name: 'Habit test X', emoji: '✅', engine: 'spirit' }))).toEqual([
      expect.stringMatching(/engine must be one of physical-health, emotions/),
    ])
  })

  it('rejects cycleEnd before cycleStart', () => {
    expect(
      errorsOf(withRow({ name: 'Habit test X', emoji: '✅', cycleStart: '2026-11-10', cycleEnd: '2026-11-02' })),
    ).toEqual([expect.stringMatching(/cycleEnd \(2026-11-02\) is before cycleStart \(2026-11-10\)/)])
  })

  it('rejects a name that is too long instead of clipping it', () => {
    expect(errorsOf(withRow({ name: 'x'.repeat(301), emoji: '✅' }))).toEqual([
      expect.stringMatching(/name is too long \(301 characters, max 300\)/),
    ])
    expect(errorsOf(withRow({ name: 'x'.repeat(300), emoji: '✅' }))).toEqual([])
  })

  it('reports every bad field, one error each', () => {
    const errors = errorsOf(
      withRow({
        name: 'Habit test X',
        emoji: '',
        target: 8,
        perDay: 0,
        grace: 1.5,
        kind: 'sometimes',
        floor: 'x'.repeat(301),
        cycleStart: '2026-13-01',
        colour: 'red',
      }),
    )
    expect(errors).toHaveLength(8)
    expect(errors.join('\n')).toMatch(/colour is not a habit field/)
  })

  it('rejects bad shapes: not JSON, no habits, duplicate names, a missing name', () => {
    expect(parseHabitsPlanJson('{')).toEqual({ ok: false, errors: ['Not valid JSON'] })
    expect(errorsOf({ habits: [] })).toEqual(['habits is empty'])
    expect(errorsOf([])).toEqual(['The plan must be an object with a "habits" array'])
    expect(errorsOf({ habits: [{ name: 'Habit test X' }, { name: ' habit TEST x ' }] })).toEqual([
      expect.stringMatching(/are the same habit/),
    ])
    expect(errorsOf(withRow({ emoji: '✅' }))).toEqual(['habits[0].name is required'])
  })
})

describe('link', () => {
  it('encode → decode → parse gives back the same plan (emoji and accents survive)', () => {
    const p = plan({ habits: [...FIXTURE.habits, { name: 'Habit test è ü', emoji: '🤝' }] })
    const link = encodeHabitsLink(p, 'https://example.test/')
    expect(link.startsWith('https://example.test/#/habits/import?d=')).toBe(true)
    const d = new URL(link.replace('#/habits/import', '')).searchParams.get('d')!
    const decoded = decodeHabitsParam(d)
    if (!decoded.ok) throw new Error(decoded.errors.join('\n'))
    expect(plan(JSON.parse(decoded.text))).toEqual(p)
  })

  it('a damaged parameter is reported, not thrown', () => {
    expect(decodeHabitsParam('not base64!').ok).toBe(false)
  })
})

describe('planHabitsImport', () => {
  it('fixture: three new, one change (engine, anchor, floor), others untouched', () => {
    const rows = planHabitsImport(plan(), [existing(), ...others])
    expect(rows.map((r) => r.kind)).toEqual(['create', 'create', 'create', 'update'])
    const upd = rows[3]
    if (upd?.kind !== 'update') throw new Error('expected an update')
    // The name differs only in case: it is present in the plan, so it changes.
    expect(upd.changes.map((c) => c.field)).toEqual(['name', 'engine', 'anchor', 'floor'])
    expect(upd.changes.find((c) => c.field === 'anchor')).toEqual({
      field: 'anchor',
      before: 'test anchor old',
      after: 'test anchor new',
    })
    expect(upd.changes.find((c) => c.field === 'engine')).toMatchObject({ before: '—', after: 'Emotions' })
  })

  it('merge on update: fields absent from the plan are kept, emoji kept when absent', () => {
    const rows = planHabitsImport(plan(), [existing()])
    const upd = rows[3]
    if (upd?.kind !== 'update') throw new Error('expected an update')
    expect(upd.emoji).toBe('📓')
    expect(upd.habit.id).toBe('h-existing')
    expect(upd.details).toEqual({
      engine: 'emotions',
      anchor: 'test anchor new',
      floor: 'test floor new',
      why: 'test why kept',
      target: 7,
    })
  })

  it('null or "" clears a field on update', () => {
    const rows = planHabitsImport(plan(withRow({ name: 'Habit test existing', why: null, anchor: '' })), [existing()])
    const upd = rows[0]
    if (upd?.kind !== 'update') throw new Error('expected an update')
    expect(upd.details).toEqual({ target: 7 })
  })

  it('a habit that already matches the plan is "same"', () => {
    const h = existing({ engine: 'emotions', anchor: 'test anchor new', floor: 'test floor new' })
    const rows = planHabitsImport(plan(withRow({ ...FIXTURE.habits[3], name: 'Habit test existing', emoji: '📓' })), [
      h,
    ])
    expect(rows[0]).toMatchObject({ kind: 'same' })
  })

  it('a new habit without an emoji is invalid', () => {
    const rows = planHabitsImport(plan(withRow({ name: 'Habit test no emoji', target: 3 })), [])
    expect(rows[0]).toEqual({
      kind: 'invalid',
      key: 'habit test no emoji',
      name: 'Habit test no emoji',
      errors: ['A new habit needs an emoji'],
    })
  })

  it('archived habits do not match (a new one is proposed); two live matches are invalid', () => {
    const archived = existing({ archivedAt: 5 })
    expect(planHabitsImport(plan(withRow({ name: 'Habit test existing', emoji: '✅' })), [archived])[0]?.kind).toBe(
      'create',
    )
    const twins = [existing(), existing({ id: 'h-twin' })]
    expect(planHabitsImport(plan(withRow({ name: 'Habit test existing' })), twins)[0]?.kind).toBe('invalid')
  })

  it('an update whose merged cycle would end before it starts is invalid', () => {
    const h = existing({ cycleStart: '2026-11-10', cycleEnd: '2026-12-10' })
    const rows = planHabitsImport(plan(withRow({ name: 'Habit test existing', cycleEnd: '2026-11-01' })), [h])
    expect(rows[0]?.kind).toBe('invalid')
  })
})

describe('measure + measureLimits (M1)', () => {
  const limits = [
    { app: 'App A', minutes: 10 },
    { app: 'App B', minutes: 40 },
  ]

  it('accepts app limits on a new habit and makes it a habit to avoid', () => {
    const [row] = planHabitsImport(
      plan(
        withRow({ name: 'Habit test M', emoji: '📱', engine: 'mind', measure: 'app-limits', measureLimits: limits }),
      ),
      [],
    )
    expect(row).toMatchObject({
      kind: 'create',
      details: { measure: 'app-limits', measureLimits: limits, direction: 'avoid' },
    })
    if (row?.kind !== 'create') throw new Error('expected create')
    expect(row.fields).toContainEqual({ field: 'measureLimits', before: '—', after: 'App A 10, App B 40' })
  })

  it('rejects malformed limits, never clipping them', () => {
    expect(errorsOf(withRow({ name: 'Habit test X', emoji: '✅', measure: 'app-limits', measureLimits: [] }))).toEqual([
      expect.stringMatching(/measureLimits must be a non-empty array/),
    ])
    const errs = errorsOf(
      withRow({
        name: 'Habit test X',
        emoji: '✅',
        measure: 'app-limits',
        measureLimits: [
          { app: 'App A', minutes: 0 },
          { app: 'app b', minutes: 10 },
          { app: 'APP B', minutes: 10 },
          { app: 'App C', minutes: 10, extra: 1 },
        ],
      }),
    )
    expect(errs).toEqual([
      expect.stringMatching(/\[0\]\.minutes must be an integer 1–1440/),
      expect.stringMatching(/\[2\]\.app "APP B" is listed twice/),
      expect.stringMatching(/\[3\]\.extra is not a limit field/),
    ])
    expect(errorsOf(withRow({ name: 'Habit test X', emoji: '✅', measure: 'steps' }))).toEqual([
      expect.stringMatching(/measure must be one of app-limits/),
    ])
    expect(
      errorsOf(
        withRow({ name: 'Habit test X', emoji: '✅', measure: 'app-limits', direction: 'do', measureLimits: limits }),
      ),
    ).toEqual([expect.stringMatching(/direction must be avoid/)])
  })

  it('a measure with no limits, or limits with no measure, is an invalid row', () => {
    const [a] = planHabitsImport(plan(withRow({ name: 'Habit test M', emoji: '📱', measure: 'app-limits' })), [])
    expect(a).toMatchObject({ kind: 'invalid', errors: [expect.stringMatching(/needs measureLimits/)] })
    const [b] = planHabitsImport(plan(withRow({ name: 'Habit test M', emoji: '📱', measureLimits: limits })), [])
    expect(b).toMatchObject({ kind: 'invalid', errors: [expect.stringMatching(/needs measure "app-limits"/)] })
  })

  it('edits show the limits list before → after; the same list is no change', () => {
    const h = existing({ direction: 'avoid', measure: 'app-limits', measureLimits: limits })
    const [same] = planHabitsImport(plan(withRow({ name: h.name, measureLimits: limits.map((l) => ({ ...l })) })), [h])
    expect(same?.kind).toBe('same')
    const next = [...limits, { app: 'App C', minutes: 15 }]
    const [upd] = planHabitsImport(plan(withRow({ name: h.name, measureLimits: next })), [h])
    if (upd?.kind !== 'update') throw new Error('expected update')
    expect(upd.changes).toEqual([
      { field: 'measureLimits', before: 'App A 10, App B 40', after: 'App A 10, App B 40, App C 15' },
    ])
    expect(upd.details).toMatchObject({ measure: 'app-limits', measureLimits: next, anchor: 'test anchor old' })
  })

  it('turning a "do" habit into a measured one switches it to avoid; null clears both fields', () => {
    const [on] = planHabitsImport(
      plan(withRow({ name: 'Habit test existing', measure: 'app-limits', measureLimits: limits })),
      [existing({ direction: 'do' })],
    )
    if (on?.kind !== 'update') throw new Error('expected update')
    expect(on.changes.map((c) => c.field)).toEqual(['direction', 'measure', 'measureLimits'])
    const [off] = planHabitsImport(plan(withRow({ name: 'Habit test existing', measure: null })), [
      existing({ direction: 'avoid', measure: 'app-limits', measureLimits: limits }),
    ])
    if (off?.kind !== 'update') throw new Error('expected update')
    expect(off.details.measure).toBeUndefined()
    expect(off.details.measureLimits).toBeUndefined()
  })
})
