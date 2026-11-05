import { describe, expect, it } from 'vitest'
import { figures } from '../figures'
import { disegno } from './disegno'

describe('disegno course', () => {
  const figIds = (html: string) => [...html.matchAll(/<fig id="([a-z0-9-]+)"/g)].map((m) => m[1]!)

  it('only references figures that exist', () => {
    for (const m of disegno.modules) {
      const ids = [
        ...figIds(m.lesson),
        ...m.quiz.flatMap((q) => [q.fig, ...(q.optionFigs ?? [])]),
        ...m.practice.map((p) => p.modelFig),
      ].filter((x): x is string => !!x)
      for (const id of ids) expect(figures[id], `${m.id} -> ${id}`).toBeDefined()
    }
  })

  it('has an option figure for every option when optionFigs is used', () => {
    for (const m of disegno.modules)
      for (const q of m.quiz) if (q.optionFigs) expect(q.optionFigs.length, `${m.id}/${q.id}`).toBe(q.options.length)
  })

  it('gives every drawing exercise a time box and a checklist', () => {
    for (const m of disegno.modules)
      for (const p of m.practice) {
        expect(p.minutes, `${m.id}/${p.id} minutes`).toBeGreaterThan(0)
        expect(p.checklist?.length, `${m.id}/${p.id} checklist`).toBeGreaterThanOrEqual(2)
      }
  })
})
