import { describe, expect, it } from 'vitest'
import { SUBCATEGORIES, categoryOfSubcategory, subcategoryLabel } from './subcategories'

describe('subcategories mirror', () => {
  // Pinned copy of scripts/events/subcategories.ts (the app cannot import it).
  it('matches the crawler ids and labels', () => {
    expect(SUBCATEGORIES).toEqual({
      theatre: [
        { id: 'prosa', label: 'Prosa' },
        { id: 'stand-up', label: 'Stand-up e cabaret' },
        { id: 'danza', label: 'Danza' },
        { id: 'musical-opera', label: 'Musical e opera' },
        { id: 'ragazzi', label: 'Teatro ragazzi' },
      ],
      concerts: [
        { id: 'classica', label: 'Classica' },
        { id: 'jazz-blues', label: 'Jazz e blues' },
        { id: 'rock-pop', label: 'Rock e pop' },
        { id: 'folk-cori', label: 'Folk e cori' },
        { id: 'elettronica', label: 'Elettronica' },
      ],
      exhibitions: [
        { id: 'arte', label: 'Arte' },
        { id: 'fotografia', label: 'Fotografia' },
        { id: 'storia', label: 'Storia' },
        { id: 'scienza', label: 'Scienza' },
      ],
      talks: [
        { id: 'conferenze', label: 'Conferenze' },
        { id: 'libri', label: 'Libri' },
        { id: 'dibattiti', label: 'Dibattiti' },
      ],
    })
  })

  it('ids are unique across categories and valid slugs', () => {
    const ids = Object.values(SUBCATEGORIES).flatMap((l) => l.map((s) => s.id))
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => /^[a-z][a-z0-9-]{0,39}$/.test(id))).toBe(true)
  })

  it('labels and reverse lookup', () => {
    expect(subcategoryLabel('theatre', 'danza')).toBe('Danza')
    expect(subcategoryLabel('concerts', 'danza')).toBeNull()
    expect(subcategoryLabel('theatre', undefined)).toBeNull()
    expect(subcategoryLabel('music', 'x')).toBeNull()
    expect(categoryOfSubcategory('libri')).toBe('talks')
    expect(categoryOfSubcategory('nope')).toBeNull()
  })
})
