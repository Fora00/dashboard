import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LifeEntry, LifePlan, LifeTask } from '../../lib/db'
import {
  LIFE_CAPS,
  addDays,
  buildThingsUrl,
  canReturnFromThings,
  daysBetween,
  decodeImportParam,
  derivedCheckinId,
  diffPlans,
  encodeImportLink,
  entryId,
  isDateKey,
  isEnergy,
  isIosLike,
  isMondayKey,
  lifeReturnUrl,
  nextCheckin,
  parseWeekJson,
  summarizeWeek,
  thingsItems,
  validateAnswer,
  validatePlan,
  weekDays,
  weekKey,
  withCheckinIds,
} from './model'

const WEEK = '2026-09-28' // a Monday

function basePlan(over: Partial<LifePlan> = {}): LifePlan {
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

const task = (over: Partial<LifeTask> = {}): LifeTask => ({
  id: 't1',
  title: 'Call dentist',
  when: null,
  deadline: null,
  area: null,
  project: null,
  tags: [],
  notes: '',
  ...over,
})

function ok(value: unknown): LifePlan {
  const r = validatePlan(value)
  if (!r.ok) throw new Error(`expected valid, got: ${r.errors.join('; ')}`)
  return r.plan
}

function errors(value: unknown): string[] {
  const r = validatePlan(value)
  if (r.ok) throw new Error('expected invalid')
  return r.errors
}

describe('date keys', () => {
  it('isDateKey accepts real dates only', () => {
    expect(isDateKey('2026-09-28')).toBe(true)
    expect(isDateKey('2028-02-29')).toBe(true)
    expect(isDateKey('2026-02-29')).toBe(false)
    expect(isDateKey('2026-02-30')).toBe(false)
    expect(isDateKey('2026-13-01')).toBe(false)
    expect(isDateKey('2026-9-28')).toBe(false)
    expect(isDateKey(20260928)).toBe(false)
    expect(isDateKey(null)).toBe(false)
  })

  it('isMondayKey', () => {
    expect(isMondayKey('2026-09-28')).toBe(true)
    expect(isMondayKey('2026-09-27')).toBe(false)
    expect(isMondayKey('nonsense')).toBe(false)
  })

  it('addDays / weekDays cross month and year ends', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(weekDays('2026-12-28')).toEqual([
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
    ])
  })

  it('weekKey is the Monday; Sunday belongs to the week that started six days earlier', () => {
    expect(weekKey(new Date(2026, 8, 28))).toBe('2026-09-28') // Monday
    expect(weekKey(new Date(2026, 9, 4, 23, 59))).toBe('2026-09-28') // Sunday night
    expect(weekKey(new Date(2026, 9, 5, 0, 1))).toBe('2026-10-05')
    expect(weekKey(new Date(2027, 0, 1))).toBe('2026-12-28')
  })

  it('daysBetween is whole days, signed', () => {
    expect(daysBetween('2026-09-28', '2026-10-04')).toBe(6)
    expect(daysBetween('2026-10-04', '2026-09-28')).toBe(-6)
    expect(daysBetween('2026-09-28', '2026-09-28')).toBe(0)
  })

  describe('across a DST change (the local calendar must not drift)', () => {
    afterEach(() => vi.unstubAllEnvs())

    it.each([
      ['Europe/Rome', -120],
      ['America/Los_Angeles', 420],
      ['Pacific/Auckland', -720],
    ])('%s', (tz, julyOffset) => {
      vi.stubEnv('TZ', tz) // Node re-reads TZ on assignment
      expect(new Date(2026, 6, 1, 12).getTimezoneOffset()).toBe(julyOffset) // the zone really changed
      // Rome: 25 Oct 2026 (25 h day); LA: 1 Nov 2026; Auckland: 27 Sep 2026.
      for (const start of ['2026-03-28', '2026-09-26', '2026-10-24', '2026-10-31']) {
        expect(daysBetween(start, addDays(start, 3))).toBe(3)
        expect(weekDays(weekKey(new Date(`${start}T12:00:00`)))).toHaveLength(7)
      }
      expect(addDays('2026-10-24', 2)).toBe('2026-10-26')
      expect(weekKey(new Date(2026, 9, 25, 12))).toBe('2026-10-19')
    })
  })
})

describe('parseWeekJson', () => {
  it('reports invalid JSON', () => {
    const r = parseWeekJson('{nope')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors[0]).toMatch(/^Not valid JSON/)
  })

  it('rejects non-objects', () => {
    expect(errors([])).toEqual(['The week must be a JSON object'])
    expect(errors(null)).toEqual(['The week must be a JSON object'])
    expect(errors('x')).toEqual(['The week must be a JSON object'])
  })

  it('accepts the minimal week and fills every array', () => {
    const r = parseWeekJson(JSON.stringify({ version: 1, week: WEEK }))
    expect(r).toEqual({ ok: true, plan: basePlan() })
  })

  it('requires version 1', () => {
    expect(errors({ week: WEEK })[0]).toMatch(/version must be 1/)
    expect(errors({ version: 2, week: WEEK })[0]).toMatch(/version must be 1/)
  })

  it('week must be a real Monday date', () => {
    expect(errors({ version: 1 })).toContain('week must be a date written YYYY-MM-DD')
    expect(errors({ version: 1, week: '2026-02-30' })).toContain('week must be a date written YYYY-MM-DD')
    expect(errors({ version: 1, week: '2026-09-29' })).toContain('week 2026-09-29 is not a Monday')
  })

  it('rejects unknown top-level and item fields', () => {
    expect(errors({ version: 1, week: WEEK, extra: 1 })).toContain('extra is not a known field')
    expect(errors({ version: 1, week: WEEK, focus: [{ id: 'f', title: 'x', colour: 'red' }] })).toContain(
      'focus[0].colour is not a known field',
    )
  })

  it('collects every error, not just the first', () => {
    const e = errors({ version: 3, week: 'x', focus: 'nope', rules: [1] })
    expect(e.length).toBeGreaterThanOrEqual(4)
  })

  describe('focus and rules', () => {
    it('trims and validates', () => {
      const p = ok({ version: 1, week: WEEK, focus: [{ id: 'f1', title: '  Ship it  ' }], rules: ['  No phone  '] })
      expect(p.focus).toEqual([{ id: 'f1', title: 'Ship it' }])
      expect(p.rules).toEqual(['No phone'])
    })
    it(`at most ${LIFE_CAPS.focus} focus items`, () => {
      const focus = Array.from({ length: 4 }, (_, i) => ({ id: `f${i}`, title: 't' }))
      expect(errors({ version: 1, week: WEEK, focus })[0]).toMatch(/focus has 4 items \(max 3\)/)
    })
    it('ids: pattern and uniqueness', () => {
      expect(errors({ version: 1, week: WEEK, focus: [{ id: 'has space', title: 't' }] })[0]).toMatch(/focus\[0\]\.id/)
      expect(errors({ version: 1, week: WEEK, focus: [{ title: 't' }] })[0]).toMatch(/focus\[0\]\.id/)
      expect(
        errors({
          version: 1,
          week: WEEK,
          focus: [
            { id: 'a', title: 'x' },
            { id: 'a', title: 'y' },
          ],
        }),
      ).toContain('focus: id "a" is used more than once')
    })
    it('titles are required, bounded strings', () => {
      expect(errors({ version: 1, week: WEEK, focus: [{ id: 'a', title: '   ' }] })[0]).toMatch(/must not be empty/)
      expect(errors({ version: 1, week: WEEK, focus: [{ id: 'a', title: 'x'.repeat(201) }] })[0]).toMatch(
        /longer than 200/,
      )
      expect(errors({ version: 1, week: WEEK, rules: [''] })[0]).toMatch(/rules\[0\] must not be empty/)
      expect(errors({ version: 1, week: WEEK, rules: [5] })[0]).toMatch(/must be a string/)
    })
  })

  describe('tasks', () => {
    const t = (over: Record<string, unknown>) => ({
      version: 1,
      week: WEEK,
      tasks: [{ id: 't1', title: 'x', ...over }],
    })

    it('absent optional fields become null / [] / ""', () => {
      expect(ok(t({})).tasks[0]).toEqual(task({ id: 't1', title: 'x' }))
    })

    it('when: date, Things keyword or null only', () => {
      expect(ok(t({ when: '2026-10-01' })).tasks[0]?.when).toBe('2026-10-01')
      expect(ok(t({ when: 'evening' })).tasks[0]?.when).toBe('evening')
      expect(ok(t({ when: null })).tasks[0]?.when).toBeNull()
      expect(errors(t({ when: 'tomorrow' }))[0]).toMatch(/tasks\[0\]\.when/)
      expect(errors(t({ when: '2026-02-30' }))[0]).toMatch(/tasks\[0\]\.when/)
    })

    it('deadline must be a date', () => {
      expect(ok(t({ deadline: '2026-10-05' })).tasks[0]?.deadline).toBe('2026-10-05')
      expect(errors(t({ deadline: 'friday' }))[0]).toMatch(/deadline must be YYYY-MM-DD/)
    })

    it('tags: trimmed, non-empty strings, capped', () => {
      expect(ok(t({ tags: [' a ', 'b'] })).tasks[0]?.tags).toEqual(['a', 'b'])
      expect(errors(t({ tags: ['a', ''] }))[0]).toMatch(/tags\[1\] must be a non-empty string/)
      expect(errors(t({ tags: 'a' }))[0]).toMatch(/tags must be an array/)
      expect(errors(t({ tags: Array.from({ length: 11 }, () => 'x') }))[0]).toMatch(/more than 10 tags/)
    })

    it('listId must look like a Things id and is kept only when set', () => {
      expect(ok(t({ listId: 'AbC-123' })).tasks[0]?.listId).toBe('AbC-123')
      expect('listId' in (ok(t({ listId: '' })).tasks[0] ?? {})).toBe(false)
      expect(errors(t({ listId: 'has space!' }))[0]).toMatch(/listId must be a Things id/)
    })

    it('empty area/project strings become null', () => {
      const p = ok(t({ area: '  ', project: 'Home' })).tasks[0]
      expect(p?.area).toBeNull()
      expect(p?.project).toBe('Home')
    })
  })

  describe('trackers', () => {
    const tr = (over: Record<string, unknown>) => ({
      version: 1,
      week: WEEK,
      trackers: [{ id: 'gym', label: 'Gym', ...over }],
    })

    it('defaults: no emoji, no target/max, energy off', () => {
      expect(ok(tr({})).trackers[0]).toEqual({
        id: 'gym',
        emoji: '',
        label: 'Gym',
        target: null,
        max: null,
        energy: false,
      })
    })
    it('target and max are integers in 1..1000', () => {
      expect(ok(tr({ target: 3, max: 5 })).trackers[0]).toMatchObject({ target: 3, max: 5 })
      for (const bad of [0, -1, 1.5, 1001, '3'])
        expect(errors(tr({ target: bad }))[0]).toMatch(/target must be a positive integer/)
    })
    it('energy must be boolean', () => {
      expect(ok(tr({ energy: true })).trackers[0]?.energy).toBe(true)
      expect(errors(tr({ energy: 'yes' }))[0]).toMatch(/energy must be true or false/)
    })
  })

  describe('sundayCheck', () => {
    const q = (over: Record<string, unknown>, trackers: unknown[] = []) => ({
      version: 1,
      week: WEEK,
      trackers,
      sundayCheck: [{ id: 'q1', label: 'How?', type: 'text', ...over }],
    })
    it('type must be one of the four', () => {
      expect(ok(q({ type: 'scale5' })).sundayCheck[0]?.type).toBe('scale5')
      expect(errors(q({ type: 'date' }))[0]).toMatch(/type must be one of/)
    })
    it('a linked tracker must exist and the question must be number/boolean', () => {
      const trackers = [{ id: 'gym', label: 'Gym' }]
      expect(ok(q({ type: 'number', tracker: 'gym' }, trackers)).sundayCheck[0]?.tracker).toBe('gym')
      expect(errors(q({ type: 'number', tracker: 'nope' }, trackers))[0]).toMatch(/id of one of this week's trackers/)
      expect(errors(q({ type: 'text', tracker: 'gym' }, trackers))[0]).toMatch(/only works with a number or boolean/)
    })
  })

  describe('check-ins', () => {
    it('ids are optional and derived from date + label', () => {
      const p = ok({ version: 1, week: WEEK, checkins: [{ date: '2026-10-01', label: 'Café review!' }] })
      expect(p.checkins).toEqual([{ id: 'c-2026-10-01-cafe-review', date: '2026-10-01', label: 'Café review!' }])
    })
    it('identical date + label get -2, -3; explicit ids are kept and never collided with', () => {
      const p = ok({
        version: 1,
        week: WEEK,
        checkins: [
          { date: '2026-10-01', label: 'Call' },
          { date: '2026-10-01', label: 'Call' },
          { id: 'c-2026-10-01-call-3', date: '2026-10-01', label: 'Call' },
          { date: '2026-10-01', label: 'Call' },
        ],
      })
      expect(p.checkins.map((c) => c.id)).toEqual([
        'c-2026-10-01-call',
        'c-2026-10-01-call-2',
        'c-2026-10-01-call-3',
        'c-2026-10-01-call-4',
      ])
    })
    it('date is required and real', () => {
      expect(errors({ version: 1, week: WEEK, checkins: [{ label: 'x' }] })[0]).toMatch(/checkins\[0\]\.date/)
    })
  })

  it('rejects a plan over the byte cap', () => {
    const tasks = Array.from({ length: 40 }, (_, i) => ({ id: `t${i}`, title: 'x', notes: 'é'.repeat(1900) }))
    const e = errors({ version: 1, week: WEEK, tasks })
    expect(e[0]).toMatch(/too large/)
  })

  it('normalizing is idempotent: a valid plan re-validates to itself', () => {
    const plan = ok({
      version: 1,
      week: WEEK,
      focus: [{ id: 'f', title: ' a ' }],
      tasks: [{ id: 't', title: 'b', when: 'today', tags: ['x'], listId: 'L-1' }],
      trackers: [{ id: 'gym', label: 'Gym', target: 3 }],
      sundayCheck: [{ id: 'q', label: 'Gym?', type: 'number', tracker: 'gym' }],
      checkins: [{ date: '2026-10-01', label: 'Hi' }],
    })
    expect(ok(JSON.parse(JSON.stringify(plan)))).toEqual(plan)
  })
})

describe('check-in ids', () => {
  it('derivedCheckinId stays within 40 chars and keeps the suffix', () => {
    const id = derivedCheckinId('2026-10-01', 'A very long label that keeps going and going forever', 2)
    expect(id.length).toBeLessThanOrEqual(40)
    expect(id.endsWith('-2')).toBe(true)
    expect(id.startsWith('c-2026-10-01-')).toBe(true)
  })
  it('an unsluggable label gives just date', () => {
    expect(derivedCheckinId('2026-10-01', '🙂🙂')).toBe('c-2026-10-01')
  })
  it('withCheckinIds returns the same object when nothing is missing and repairs legacy plans', () => {
    const full = basePlan({ checkins: [{ id: 'a', date: '2026-10-01', label: 'x' }] })
    expect(withCheckinIds(full)).toBe(full)
    const legacy = { ...basePlan(), checkins: [{ date: '2026-10-01', label: 'x' }] } as unknown as LifePlan
    expect(withCheckinIds(legacy).checkins[0]?.id).toBe('c-2026-10-01-x')
  })
})

describe('entry helpers', () => {
  it('entryId is deterministic', () => {
    expect(entryId(WEEK, 'focus', 'f1')).toBe('2026-09-28:focus:f1')
  })
  it('isEnergy: integer 1-5', () => {
    expect([1, 3, 5].every(isEnergy)).toBe(true)
    expect([0, 6, 2.5, '3', null].some(isEnergy)).toBe(false)
  })
  it('validateAnswer per type', () => {
    expect(validateAnswer('boolean', true)).toBeNull()
    expect(validateAnswer('boolean', 1)).not.toBeNull()
    expect(validateAnswer('scale5', 5)).toBeNull()
    expect(validateAnswer('scale5', 6)).not.toBeNull()
    expect(validateAnswer('number', 12.5)).toBeNull()
    expect(validateAnswer('number', Number.NaN)).not.toBeNull()
    expect(validateAnswer('number', Infinity)).not.toBeNull()
    expect(validateAnswer('number', 2_000_000_000)).not.toBeNull()
    expect(validateAnswer('text', 'hi')).toBeNull()
    expect(validateAnswer('text', 'x'.repeat(2001))).not.toBeNull()
    expect(validateAnswer('text', 5)).not.toBeNull()
    for (const type of ['boolean', 'scale5', 'number', 'text'] as const) expect(validateAnswer(type, null)).toBeNull()
  })
})

describe('import link', () => {
  const plan = ok({
    version: 1,
    week: WEEK,
    focus: [{ id: 'f1', title: 'Finire la tesi — è importante 🎯' }],
    rules: ['Niente telefono dopo le 22'],
    tasks: [{ id: 't1', title: 'Chiamare il dentista', when: 'today', notes: 'perché sì' }],
  })

  it('round-trips through the link, including accents, dashes and emoji', () => {
    const link = encodeImportLink(plan)
    expect(link.startsWith('https://fora00.github.io/dashboard/#/life/import?d=')).toBe(true)
    const d = link.split('?d=')[1] ?? ''
    const decoded = decodeImportParam(d)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(parseWeekJson(decoded.text)).toEqual({ ok: true, plan })
  })

  it('the payload is URL-safe base64 (no + / = or padding)', () => {
    const d = encodeImportLink(plan).split('?d=')[1] ?? ''
    expect(d).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('honours a custom base', () => {
    expect(encodeImportLink(plan, 'http://localhost:5173/dashboard/')).toMatch(
      /^http:\/\/localhost:5173\/dashboard\/#\/life\/import\?d=/,
    )
  })

  it('tolerates surrounding whitespace', () => {
    const d = encodeImportLink(plan).split('?d=')[1] ?? ''
    expect(decodeImportParam(`  ${d}\n`).ok).toBe(true)
  })

  it('damaged links are errors, never throws', () => {
    expect(decodeImportParam('not base64!!')).toEqual({
      ok: false,
      errors: ['The import link is damaged (not base64url)'],
    })
    expect(decodeImportParam('A')).toMatchObject({ ok: false }) // length % 4 === 1
    // valid base64url of invalid UTF-8 (0xFF 0xFE)
    expect(decodeImportParam('__4')).toEqual({ ok: false, errors: ['The import link is damaged (not UTF-8 text)'] })
  })

  it('an empty param decodes to empty text (parseWeekJson then reports it)', () => {
    const r = decodeImportParam('')
    expect(r).toEqual({ ok: true, text: '' })
    expect(parseWeekJson('').ok).toBe(false)
  })
})

describe('Things bridge', () => {
  it('thingsItems maps only the set fields', () => {
    expect(thingsItems([task()])).toEqual([{ type: 'to-do', attributes: { title: 'Call dentist' } }])
  })

  it('project beats area for `list`, and both are appended to the notes', () => {
    const [item] = thingsItems([task({ area: 'Casa', project: 'Trasloco', notes: 'Scatole' })])
    expect(item?.attributes).toMatchObject({ list: 'Trasloco', notes: 'Scatole\n\nCasa › Trasloco' })
    const [onlyArea] = thingsItems([task({ area: 'Casa' })])
    expect(onlyArea?.attributes).toMatchObject({ list: 'Casa', notes: 'Casa' })
  })

  it('listId is sent as list-id and replaces the name', () => {
    const [item] = thingsItems([task({ area: 'Casa', listId: 'ABC-1' })])
    expect(item?.attributes['list-id']).toBe('ABC-1')
    expect(item?.attributes.list).toBeUndefined()
  })

  it('when, deadline and tags pass through', () => {
    const [item] = thingsItems([task({ when: '2026-10-01', deadline: '2026-10-05', tags: ['a', 'b'] })])
    expect(item?.attributes).toMatchObject({ when: '2026-10-01', deadline: '2026-10-05', tags: ['a', 'b'] })
  })

  it('buildThingsUrl encodes the JSON and reveals', () => {
    const url = buildThingsUrl([task({ title: 'Caffè & latte 100%' })])
    expect(url.startsWith('things:///json?data=')).toBe(true)
    expect(url.endsWith('&reveal=true')).toBe(true)
    const data = decodeURIComponent(url.slice('things:///json?data='.length, -'&reveal=true'.length))
    expect(JSON.parse(data)).toEqual([{ type: 'to-do', attributes: { title: 'Caffè & latte 100%' } }])
  })

  it('x-success is appended encoded, only when given', () => {
    const back = 'https://x.test/dashboard/#/life'
    const url = buildThingsUrl([task()], { xSuccess: back })
    expect(url.endsWith(`&x-success=${encodeURIComponent(back)}`)).toBe(true)
    expect(buildThingsUrl([task()])).not.toContain('x-success')
  })

  it('no tasks still produces a valid (empty) URL', () => {
    expect(buildThingsUrl([])).toBe(`things:///json?data=${encodeURIComponent('[]')}&reveal=true`)
  })

  it('isIosLike / canReturnFromThings', () => {
    const iphone = {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }
    const ipadOs = {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    }
    const mac = {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    }
    expect(isIosLike(iphone)).toBe(true)
    expect(isIosLike(ipadOs)).toBe(true)
    expect(isIosLike(mac)).toBe(false)
    expect(isIosLike({})).toBe(false)
    expect(canReturnFromThings(mac)).toBe(true)
    expect(canReturnFromThings(iphone)).toBe(false)
    expect(canReturnFromThings({})).toBe(true) // unknown device: not iOS
  })

  it('lifeReturnUrl builds the hash route of this deployment', () => {
    expect(lifeReturnUrl({ origin: 'https://x.github.io', pathname: '/dashboard/' })).toBe(
      'https://x.github.io/dashboard/#/life',
    )
    expect(lifeReturnUrl({ origin: 'https://x.github.io', pathname: '/dashboard/' }, '/life/edit')).toBe(
      'https://x.github.io/dashboard/#/life/edit',
    )
  })
})

describe('summarizeWeek', () => {
  let n = 0
  const base = { week: WEEK, day: WEEK, createdAt: 0, updatedAt: 0 }
  const entry = (e: Partial<LifeEntry> & Pick<LifeEntry, 'kind' | 'ref'> & { value: unknown }): LifeEntry =>
    ({ ...base, id: `e${n++}`, createdAt: n, ...e }) as LifeEntry

  const plan = basePlan({
    focus: [
      { id: 'f1', title: 'Focus' },
      { id: 'f2', title: 'Other' },
    ],
    tasks: [task({ id: 't1' }), task({ id: 't2' })],
    trackers: [
      { id: 'gym', emoji: '🏋', label: 'Gym', target: 3, max: 4, energy: false },
      { id: 'read', emoji: '', label: 'Read', target: null, max: null, energy: false },
    ],
    sundayCheck: [
      { id: 'q-text', label: 'Notes', type: 'text' },
      { id: 'q-gym', label: 'Gym count', type: 'number', tracker: 'gym' },
      { id: 'q-read', label: 'Read?', type: 'boolean', tracker: 'read' },
      { id: 'q-gym-bool', label: 'Gym target?', type: 'boolean', tracker: 'gym' },
    ],
    checkins: [
      { id: 'c2', date: '2026-10-02', label: 'Later' },
      { id: 'c1', date: '2026-09-29', label: 'Earlier' },
    ],
  })

  it('an empty log gives an empty summary', () => {
    const s = summarizeWeek(plan, [], '2026-09-30')
    expect(s.focusDone.size).toBe(0)
    expect(s.sentTaskIds.size).toBe(0)
    expect(s.removed).toEqual([])
    expect(s.trackers.map((t) => t.total)).toEqual([0, 0])
    expect(s.trackers[0]).toMatchObject({ reachedTarget: false, atMax: false })
    expect(s.trackers[1]).toMatchObject({ reachedTarget: null, atMax: false })
  })

  it('folds focus, sent and answers; ignores other weeks', () => {
    const s = summarizeWeek(
      plan,
      [
        entry({ kind: 'focus', ref: 'f1', value: { done: true } }),
        entry({ kind: 'focus', ref: 'f2', value: { done: false } }),
        entry({ kind: 'sent', ref: 't1', value: { sent: true } }),
        entry({ kind: 'sunday', ref: 'q-text', value: { answer: 'fine' } }),
        entry({ kind: 'focus', ref: 'f2', week: '2026-09-21', value: { done: true } }),
      ],
      '2026-09-30',
    )
    expect([...s.focusDone]).toEqual(['f1'])
    expect([...s.sentTaskIds]).toEqual(['t1'])
    expect(s.answers.get('q-text')).toBe('fine')
    expect(s.removed).toEqual([])
  })

  it('counts tracker entries per day (Mon..Sun), target and max', () => {
    const at = (day: string) => entry({ kind: 'tracker', ref: 'gym', day, value: {} })
    const s = summarizeWeek(
      plan,
      [at('2026-09-28'), at('2026-09-28'), at('2026-10-04'), at('2026-09-30')],
      '2026-10-04',
    )
    const gym = s.trackers[0]!
    expect(gym.total).toBe(4)
    expect(gym.perDay).toEqual([2, 0, 1, 0, 0, 0, 1])
    expect(gym.reachedTarget).toBe(true)
    expect(gym.atMax).toBe(true)
  })

  it('keeps two weeks apart when all entries are passed in (History recap and chart)', () => {
    const NEXT = '2026-10-05'
    const nextPlan = { ...plan, week: NEXT }
    const entries = [
      // last week: one focus done, a task sent, gym x3, a check-in done
      entry({ kind: 'focus', ref: 'f1', value: { done: true } }),
      entry({ kind: 'sent', ref: 't1', value: { sent: true } }),
      entry({ kind: 'checkin', ref: 'c1', value: { done: true } }),
      ...[0, 1, 2].map(() => entry({ kind: 'tracker', ref: 'gym', day: '2026-09-30', value: {} })),
      // this week: only a focus done on the other item, one gym session
      entry({ kind: 'focus', ref: 'f2', week: NEXT, day: NEXT, value: { done: true } }),
      entry({ kind: 'tracker', ref: 'gym', week: NEXT, day: NEXT, value: {} }),
    ]
    const last = summarizeWeek(plan, entries, '2026-10-04')
    const cur = summarizeWeek(nextPlan, entries, '2026-10-06')
    expect([...last.focusDone]).toEqual(['f1'])
    expect([...cur.focusDone]).toEqual(['f2'])
    expect(last.sentTaskIds.size).toBe(1)
    expect(cur.sentTaskIds.size).toBe(0)
    expect(last.checkins.filter((c) => c.done)).toHaveLength(1)
    expect(cur.checkins.filter((c) => c.done)).toHaveLength(0)
    expect(last.trackers[0]!.total).toBe(3)
    expect(last.trackers[0]!.reachedTarget).toBe(true)
    expect(cur.trackers[0]!.total).toBe(1)
    expect(cur.trackers[0]!.reachedTarget).toBe(false)
  })

  it('questions linked to a tracker are answered from the log and override stored answers', () => {
    const at = (ref: string) => entry({ kind: 'tracker', ref, day: '2026-09-29', value: {} })
    const s = summarizeWeek(
      plan,
      [at('gym'), at('gym'), at('read'), entry({ kind: 'sunday', ref: 'q-gym', value: { answer: 99 } })],
      '2026-10-04',
    )
    expect(s.answers.get('q-gym')).toBe(2) // number = count, stored 99 ignored
    expect(s.answers.get('q-read')).toBe(true) // no target: done at least once
    expect(s.answers.get('q-gym-bool')).toBe(false) // target 3 not reached
    expect([...s.autoAnswered].sort()).toEqual(['q-gym', 'q-gym-bool', 'q-read'])
  })

  it('check-ins: sorted by date, overdue only when past and not done, notes kept apart from done', () => {
    const s = summarizeWeek(
      plan,
      [entry({ kind: 'checkin', ref: 'c1', value: { done: false, note: '  met him ' } })],
      '2026-10-01',
    )
    expect(s.checkins.map((c) => c.checkin.id)).toEqual(['c1', 'c2'])
    expect(s.checkins[0]).toMatchObject({ done: false, note: '  met him ', overdue: true, daysLeft: -2 })
    expect(s.checkins[1]).toMatchObject({ done: false, note: null, overdue: false, daysLeft: 1 })
    const done = summarizeWeek(plan, [entry({ kind: 'checkin', ref: 'c1', value: { done: true } })], '2026-10-01')
    expect(done.checkins[0]).toMatchObject({ done: true, overdue: false })
  })

  it('check-ins without stored ids get derived ones', () => {
    const legacy = { ...plan, checkins: [{ date: '2026-09-29', label: 'Earlier' }] } as unknown as LifePlan
    const s = summarizeWeek(
      legacy,
      [entry({ kind: 'checkin', ref: 'c-2026-09-29-earlier', value: { done: true } })],
      '2026-09-30',
    )
    expect(s.checkins[0]?.done).toBe(true)
  })

  it('entries whose plan item was removed are kept aside, only when meaningful', () => {
    const s = summarizeWeek(
      plan,
      [
        entry({ kind: 'focus', ref: 'gone', value: { done: true } }),
        entry({ kind: 'focus', ref: 'gone2', value: { done: false } }), // toggled back off: not meaningful
        entry({ kind: 'tracker', ref: 'gone3', value: {} }),
        entry({ kind: 'sunday', ref: 'gone4', value: { answer: null } }),
        entry({ kind: 'sent', ref: 'gone5', value: { sent: true } }),
        entry({ kind: 'checkin', ref: 'gone6', value: { done: false, note: '  ' } }),
        entry({ kind: 'checkin', ref: 'gone7', value: { done: false, note: 'x' } }),
      ],
      '2026-09-30',
    )
    expect(s.removed.map((e) => e.ref).sort()).toEqual(['gone', 'gone3', 'gone5', 'gone7'])
  })

  it('nextCheckin: nearest on or after today, else null', () => {
    expect(nextCheckin(plan, '2026-09-30')).toMatchObject({ id: 'c2', daysLeft: 2 })
    expect(nextCheckin(plan, '2026-09-29')).toMatchObject({ id: 'c1', daysLeft: 0 })
    expect(nextCheckin(plan, '2026-10-03')).toBeNull()
  })
})

describe('diffPlans', () => {
  it('first import against nothing', () => {
    const d = diffPlans(null, basePlan({ focus: [{ id: 'f', title: 'x' }], rules: ['r'] }))
    expect(d.firstImport).toBe(true)
    expect(d.unchanged).toBe(false)
    expect(d.summary).toEqual(['1 focus item added', '1 rule added'])
  })

  it('re-importing the same plan is unchanged, even for legacy check-ins without ids', () => {
    const next = ok({ version: 1, week: WEEK, checkins: [{ date: '2026-10-01', label: 'x' }] })
    const legacy = { ...next, checkins: [{ date: '2026-10-01', label: 'x' }] } as unknown as LifePlan
    const d = diffPlans(legacy, next)
    expect(d.unchanged).toBe(true)
    expect(d.summary).toEqual([])
  })

  it('reports added, removed and changed by id', () => {
    const prev = basePlan({ tasks: [task({ id: 'a', title: 'A' }), task({ id: 'b', title: 'B' })], rules: ['x', 'y'] })
    const next = basePlan({ tasks: [task({ id: 'a', title: 'A2' }), task({ id: 'c', title: 'C' })], rules: ['y', 'z'] })
    const d = diffPlans(prev, next)
    expect(d.tasks.added.map((t) => t.id)).toEqual(['c'])
    expect(d.tasks.removed.map((t) => t.id)).toEqual(['b'])
    expect(d.tasks.changed.map(([o, n]) => [o.title, n.title])).toEqual([['A', 'A2']])
    expect(d.rules).toEqual({ added: ['z'], removed: ['x'] })
    expect(d.summary).toEqual(['1 task added', '1 task removed', '1 task changed', '1 rule added', '1 rule removed'])
  })

  it('a pure reorder is reported as "order changed"', () => {
    const a = task({ id: 'a' })
    const b = task({ id: 'b' })
    const d = diffPlans(basePlan({ tasks: [a, b] }), basePlan({ tasks: [b, a] }))
    expect(d.unchanged).toBe(false)
    expect(d.summary).toEqual(['order changed'])
  })
})
