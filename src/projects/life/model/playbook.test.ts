import { describe, expect, it } from 'vitest'
import type { LifeEntry } from '../../../lib/db'
import { LIFE_CAPS, buildExportMarkdown, diffPlans, parseWeekJson, summarizeWeek, validatePlan } from './index'

const base = { version: 1, week: '2026-01-05' }
const playbook = {
  section: 'Mind',
  practice: 'example practice',
  plan: 'Every morning, once',
}
const parse = (pb: unknown) => parseWeekJson(JSON.stringify({ ...base, playbook: pb }))

const use = (day: string, note?: string, n = 0): LifeEntry => ({
  id: `p${day}${n}`,
  week: '2026-01-05',
  kind: 'playbook',
  ref: 'playbook',
  day,
  value: note ? { note } : {},
  createdAt: Date.parse(`${day}T08:00:00Z`) + n,
  updatedAt: 0,
})

describe('playbook of the week: validation', () => {
  it('is absent from plans without one (old plans still validate)', () => {
    const r = parseWeekJson(JSON.stringify(base))
    expect(r.ok && 'playbook' in r.plan).toBe(false)
    expect(r.ok && r.plan.version).toBe(1)
  })

  it('accepts section + practice, with or without plan', () => {
    const r = parse(playbook)
    expect(r.ok && r.plan.playbook).toEqual(playbook)
    const r2 = parse({ section: 'Mind', practice: 'example practice' })
    expect(r2.ok && r2.plan.playbook).toEqual({
      section: 'Mind',
      practice: 'example practice',
    })
  })

  it('treats null as absent', () => {
    const r = parse(null)
    expect(r.ok && 'playbook' in r.plan).toBe(false)
  })

  it('rejects missing fields, wrong types, unknown keys and long text', () => {
    expect(parse({ practice: 'x' }).ok).toBe(false)
    expect(parse({ section: 'Mind' }).ok).toBe(false)
    expect(parse({ section: 'Mind', practice: 3 }).ok).toBe(false)
    expect(parse('text').ok).toBe(false)
    expect(parse({ ...playbook, extra: 1 }).ok).toBe(false)
    expect(parse({ ...playbook, practice: 'x'.repeat(LIFE_CAPS.playbookPractice + 1) }).ok).toBe(false)
    expect(parse({ ...playbook, plan: 'x'.repeat(LIFE_CAPS.playbookPlan + 1) }).ok).toBe(false)
    expect(parse({ ...playbook, section: 'a\nb' }).ok).toBe(false)
  })
})

describe('playbook of the week: summary, export, diff', () => {
  const plan = () => {
    const r = validatePlan({ ...base, playbook })
    if (!r.ok) throw new Error(r.errors.join(';'))
    return r.plan
  }

  it('summary is null without a playbook and counts uses and days with one', () => {
    const old = validatePlan(base)
    expect(old.ok && summarizeWeek(old.plan, []).playbook).toBeNull()
    const s = summarizeWeek(plan(), [use('2026-01-06'), use('2026-01-06', 'second', 1), use('2026-01-08')])
    expect(s.playbook?.total).toBe(3)
    expect(s.playbook?.days).toEqual(['2026-01-06', '2026-01-08'])
    expect(s.removed).toHaveLength(0)
  })

  it('export has a ## Playbook section and the entries in the JSON', () => {
    const md = buildExportMarkdown(plan(), [use('2026-01-06', 'went fine'), use('2026-01-08')])
    expect(md).toContain('## Playbook')
    expect(md).toContain('- Section: Mind')
    expect(md).toContain('- Practice: example practice')
    expect(md).toContain('- Plan: Every morning, once')
    expect(md).toContain('- Uses: 2 (Tue 2026-01-06, Thu 2026-01-08)')
    expect(md).toContain('  - 2026-01-06: went fine')
    expect(md).toContain('"kind": "playbook"')
    expect(md).toContain('"playbook": {')
  })

  it('export shows zero uses, and has no section for old plans', () => {
    expect(buildExportMarkdown(plan(), [])).toContain('- Uses: 0\n')
    const old = validatePlan(base)
    expect(old.ok && buildExportMarkdown(old.plan, [])).not.toContain('## Playbook')
  })

  it('uses whose plan lost the playbook are listed as removed', () => {
    const old = validatePlan(base)
    if (!old.ok) throw new Error('bad')
    const md = buildExportMarkdown(old.plan, [use('2026-01-06', 'note')])
    expect(md).toContain('playbook: used on 2026-01-06 — note (removed from plan)')
  })

  it('the import diff mentions added / changed / removed', () => {
    const withPb = plan()
    const { playbook: _pb, ...without } = withPb
    expect(diffPlans(without, withPb).playbook).toBe('added')
    expect(diffPlans(withPb, without).playbook).toBe('removed')
    expect(
      diffPlans(withPb, {
        ...withPb,
        playbook: { ...playbook, practice: 'other' },
      }).playbook,
    ).toBe('changed')
    expect(diffPlans(withPb, withPb).unchanged).toBe(true)
    expect(diffPlans(withPb, withPb).playbook).toBeNull()
  })
})
