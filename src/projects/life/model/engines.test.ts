import { describe, expect, it } from 'vitest'
import { LIFE_CAPS } from './constants.ts'
import {
  ENGINES,
  buildEnginesMarkdown,
  emptyEngine,
  engineId,
  engineTrend,
  habitsByEngine,
  hasIceberg,
  icebergCounts,
  normalizeIceberg,
  planLead,
  stepScore,
  type EngineRow,
} from './engines.ts'

const row = (month: string, engine: EngineRow['engine'], over: Partial<EngineRow> = {}): EngineRow => ({
  ...emptyEngine(month, engine, 1),
  ...over,
})

describe('engines model', () => {
  it('ids are month:engine, seven engines in order', () => {
    expect(engineId('2026-11', 'physical-health')).toBe('2026-11:physical-health')
    expect(ENGINES.map((e) => e.key)).toEqual([
      'physical-health',
      'emotions',
      'mind',
      'relationships',
      'career',
      'money',
      'environment',
    ])
    expect(emptyEngine('2026-11', 'mind', 5)).toMatchObject({ id: '2026-11:mind', score: null, lead: false, whys: [] })
  })

  it('stepper starts at 5 and clamps to 1-10', () => {
    expect(stepScore(null, 1)).toBe(5)
    expect(stepScore(null, -1)).toBe(5)
    expect(stepScore(10, 1)).toBe(10)
    expect(stepScore(1, -1)).toBe(1)
    expect(stepScore(6, -1)).toBe(5)
  })

  it('trend vs the previous month', () => {
    expect(engineTrend(7, 5)).toBe('up')
    expect(engineTrend(4, 5)).toBe('down')
    expect(engineTrend(5, 5)).toBe('same')
    expect(engineTrend(5, null)).toBeNull()
    expect(engineTrend(null, 5)).toBeNull()
  })

  it('lead: setting one clears the other lead of the same month only', () => {
    const rows = [
      row('2026-11', 'mind', { lead: true }),
      row('2026-11', 'money'),
      row('2026-10', 'career', { lead: true }),
    ]
    const out = planLead(rows, '2026-11', 'money', true, 9)
    expect(out.map((r) => [r.id, r.lead, r.updatedAt])).toEqual([
      ['2026-11:money', true, 9],
      ['2026-11:mind', false, 9],
    ])
    // A missing row is created; unsetting touches only that engine.
    expect(planLead([], '2026-11', 'career', true, 9).map((r) => r.id)).toEqual(['2026-11:career'])
    expect(planLead(rows, '2026-11', 'mind', false, 9).map((r) => [r.id, r.lead])).toEqual([['2026-11:mind', false]])
    // No-ops write nothing.
    expect(planLead(rows, '2026-11', 'mind', true, 9)).toEqual([])
    expect(planLead([], '2026-11', 'mind', false, 9)).toEqual([])
  })

  it('normalizes the iceberg to the caps, drops blank whys, keeps lever and link on one line', () => {
    const n = normalizeIceberg({
      event: '  Engine test  ',
      pattern: 'x'.repeat(LIFE_CAPS.engineLayer + 10),
      system: '',
      belief: '',
      whys: ['one', '  ', 'two', 'three', 'four'],
      lever: 'line one\nline two',
      link: 'y'.repeat(LIFE_CAPS.engineLink + 5),
    })
    expect(n.event).toBe('Engine test')
    expect(n.pattern).toHaveLength(LIFE_CAPS.engineLayer)
    expect(n.whys).toEqual(['one', 'two', 'three'])
    expect(n.lever).toBe('line one line two')
    expect(n.link).toHaveLength(LIFE_CAPS.engineLink)
    expect(icebergCounts({ ...n })).toEqual({ layers: 2, whys: 3, hasLever: true })
    expect(hasIceberg(emptyEngine('2026-11', 'mind', 1))).toBe(false)
  })

  it('export: scores, previous, trend, lead, lever and counts, never the free text', () => {
    const secret = {
      event: 'Engine test event text',
      pattern: 'Engine test pattern text',
      system: 'Engine test system text',
      belief: 'Engine test belief text',
      whys: ['Engine test why one', 'Engine test why two'],
      link: 'Engine test linked habit',
    }
    const md = buildEnginesMarkdown(
      '2026-11',
      [
        row('2026-11', 'physical-health', { score: 7, lead: true, lever: 'Engine test lever', ...secret }),
        row('2026-11', 'money', { score: 3 }),
        row('2026-10', 'mind', { score: 9 }), // another month: ignored
      ],
      [row('2026-10', 'physical-health', { score: 5 }), row('2026-10', 'money', { score: 3 })],
    )
    expect(md).toContain('## Engines')
    expect(md).toContain('- Lead engine: Physical Health')
    expect(md).toContain(
      '- Physical Health: 7 (before: 5, up); lead; iceberg: 4 of 4 layers, 2 whys; lever: Engine test lever; habits: 0',
    )
    expect(md).toContain('- Money: 3 (before: 3, same); no iceberg; habits: 0')
    expect(md).toContain('- Mind: – (before: –); no iceberg; habits: 0')
    for (const text of [secret.event, secret.pattern, secret.system, secret.belief, ...secret.whys, secret.link]) {
      expect(md).not.toContain(text)
    }
    expect(md.split('\n').filter((l) => l.startsWith('- ')).length).toBe(1 + ENGINES.length)
  })

  it('habits by engine: live tagged habits only, every engine present', () => {
    const map = habitsByEngine([
      { name: 'Test habit one', engine: 'mind', archivedAt: undefined },
      { name: 'Test habit two', engine: 'mind', archivedAt: undefined },
      { name: 'Test habit archived', engine: 'mind', archivedAt: 5 },
      { name: 'Test habit untagged', engine: undefined, archivedAt: undefined },
      { name: 'Test habit money', engine: 'money', archivedAt: undefined },
    ])
    expect([...map.keys()]).toEqual(ENGINES.map((e) => e.key))
    expect(map.get('mind')).toEqual(['Test habit one', 'Test habit two'])
    expect(map.get('money')).toEqual(['Test habit money'])
    expect(map.get('career')).toEqual([])
  })

  it('export: habits per engine as a count, never the names', () => {
    const habits = [
      { name: 'Test habit one', engine: 'mind' as const, archivedAt: undefined },
      { name: 'Test habit two', engine: 'mind' as const, archivedAt: undefined },
      { name: 'Test habit gone', engine: 'mind' as const, archivedAt: 3 },
      { name: 'Test habit cash', engine: 'money' as const, archivedAt: undefined },
    ]
    const md = buildEnginesMarkdown('2026-11', [row('2026-11', 'mind', { score: 6 })], [], habits)
    expect(md).toContain('- Mind: 6 (before: –); no iceberg; habits: 2')
    expect(md).toContain('- Money: – (before: –); no iceberg; habits: 1')
    expect(md).toContain('- Career: – (before: –); no iceberg; habits: 0')
    for (const h of habits) expect(md).not.toContain(h.name)
  })
})
