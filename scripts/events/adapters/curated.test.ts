import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { CuratedFileSchema } from '../schemas.ts'
import { toRaw } from './curated.ts'

// The real file may be empty (the adapter is mayBeEmpty); mapping is tested on a fixture.
const parseReal = () =>
  CuratedFileSchema.parse(JSON.parse(readFileSync(new URL('../curated.json', import.meta.url), 'utf8')))

const sample = CuratedFileSchema.parse({
  events: [
    {
      id: 'sample-lab-2026',
      title: 'Laboratorio di prova',
      date: '2026-11-05',
      time: '18:00',
      city: 'Rovereto',
      url: 'https://example.test/lab',
      summary: 'Una riga onesta.',
      category: 'creative',
    },
  ],
})

describe('curated.json', () => {
  it('is valid and has unique ids', () => {
    expect(() => parseReal()).not.toThrow()
  })
  it('maps to a timed event with Rome offset and no end when unknown', () => {
    expect(toRaw(sample.events[0]!)).toMatchObject({
      start: '2026-11-05T18:00:00+01:00',
      end: null,
      allDay: false,
      city: 'Rovereto',
    })
  })
  it('rejects an unknown category and a duplicate id', () => {
    const e = sample.events[0]!
    expect(CuratedFileSchema.safeParse({ events: [{ ...e, category: 'nope' }] }).success).toBe(false)
    expect(CuratedFileSchema.safeParse({ events: [e, e] }).success).toBe(false)
  })
})
