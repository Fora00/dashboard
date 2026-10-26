import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { CuratedFileSchema } from '../schemas.ts'
import { toRaw } from './curated.ts'

const file = CuratedFileSchema.parse(JSON.parse(readFileSync(new URL('../curated.json', import.meta.url), 'utf8')))

describe('curated.json', () => {
  it('is valid and has unique ids', () => {
    expect(file.events.length).toBeGreaterThan(0)
  })
  it('maps to a timed event with Rome offset and no end when unknown', () => {
    const e = file.events.find((x) => x.date === '2026-11-05')!
    expect(toRaw(e)).toMatchObject({ start: '2026-11-05T18:00:00+01:00', end: null, allDay: false, city: 'Rovereto' })
  })
  it('rejects an unknown category and a duplicate id', () => {
    const e = file.events[0]!
    expect(CuratedFileSchema.safeParse({ events: [{ ...e, category: 'nope' }] }).success).toBe(false)
    expect(CuratedFileSchema.safeParse({ events: [e, e] }).success).toBe(false)
  })
})
