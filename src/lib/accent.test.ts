import { describe, expect, it } from 'vitest'
import {
  accentVars,
  contrastRatio,
  ensureContrast,
  mixHex,
  projectForPath,
  readableForeground,
  SLATE_900,
  WHITE,
} from './accent'
import { areaIds, areas } from './areas'
import { projects } from './projects'

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
    // Order does not matter.
    expect(contrastRatio('#e11d48', WHITE)).toBeCloseTo(contrastRatio(WHITE, '#e11d48'), 10)
  })
})

describe('readableForeground', () => {
  // Expected choice per area colour, and both choices must be exercised.
  const expected: Record<string, string> = {
    '#e11d48': WHITE, // red
    '#64748b': WHITE, // slate
    '#22c55e': SLATE_900, // green
    '#0ea5e9': SLATE_900, // sky
    '#f59e0b': SLATE_900, // amber
  }

  it('covers every area colour', () => {
    expect(new Set(areaIds.map((id) => areas[id].color))).toEqual(new Set(Object.keys(expected)))
  })

  for (const [bg, fg] of Object.entries(expected)) {
    it(`${bg} gets ${fg === WHITE ? 'white' : 'slate-900'} text at AA (4.5:1)`, () => {
      expect(readableForeground(bg)).toBe(fg)
      expect(contrastRatio(bg, fg)).toBeGreaterThanOrEqual(4.5)
    })
  }

  it('picks white on dark and slate-900 on light extremes', () => {
    expect(readableForeground('#000000')).toBe(WHITE)
    expect(readableForeground('#ffffff')).toBe(SLATE_900)
  })
})

describe('accentVars', () => {
  for (const id of areaIds) {
    const project = projects.find((p) => p.area === id)
    if (!project) continue
    it(`${id}: filled states stay AA, rings reach 3:1 on both page backgrounds`, () => {
      const v = accentVars(project)
      expect(v['--accent']).toBe(areas[id].color)
      expect(v['--accent-2']).toBe(project.color)
      for (const bg of [v['--accent'], v['--accent-hover'], v['--accent-active']]) {
        expect(contrastRatio(bg, v['--accent-fg'])).toBeGreaterThanOrEqual(4.5)
      }
      expect(contrastRatio(v['--accent-ring-light'], WHITE)).toBeGreaterThanOrEqual(3)
      expect(contrastRatio(v['--accent-ring-dark'], SLATE_900)).toBeGreaterThanOrEqual(3)
    })
  }
})

describe('ensureContrast / mixHex', () => {
  it('returns the colour unchanged when it already passes', () => {
    expect(ensureContrast('#000000', WHITE, 3)).toBe('#000000')
  })
  it('darkens on a light page and lightens on a dark page', () => {
    const light = ensureContrast('#f59e0b', WHITE, 3)
    const dark = ensureContrast('#64748b', SLATE_900, 3)
    expect(contrastRatio(light, WHITE)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(dark, SLATE_900)).toBeGreaterThanOrEqual(3)
  })
  it('mixes endpoints exactly', () => {
    expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff')
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })
})

describe('projectForPath', () => {
  it('matches a project page and its sub-pages', () => {
    expect(projectForPath('/todo')?.id).toBe('todo')
    expect(projectForPath('/life/edit')?.id).toBe('life')
  })
  it('does not match Home, join pages or a mere prefix', () => {
    expect(projectForPath('/')).toBeUndefined()
    expect(projectForPath('/join/p/abc')).toBeUndefined()
    expect(projectForPath('/todos')).toBeUndefined()
  })
})
