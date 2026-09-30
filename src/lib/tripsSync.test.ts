import { describe, expect, it } from 'vitest'
import '../test/fakeDb'
import { MAX_NAME_LENGTH, ideaKind, normalizeName } from './tripsSync'

describe('normalizeName', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeName('  Anna   Maria ')).toBe('Anna Maria')
    expect(normalizeName('Anna\tMaria\n')).toBe('Anna Maria')
  })

  it('keeps case (unlike tags)', () => {
    expect(normalizeName('aNNa')).toBe('aNNa')
  })

  it('empty is null', () => {
    expect(normalizeName('')).toBeNull()
    expect(normalizeName('  \n ')).toBeNull()
  })

  it(`the cap is ${MAX_NAME_LENGTH} characters after normalising`, () => {
    expect(normalizeName('x'.repeat(MAX_NAME_LENGTH))).toBe('x'.repeat(MAX_NAME_LENGTH))
    expect(normalizeName('x'.repeat(MAX_NAME_LENGTH + 1))).toBeNull()
    expect(normalizeName(`  ${'x'.repeat(MAX_NAME_LENGTH)}  `)).toBe('x'.repeat(MAX_NAME_LENGTH))
  })
})

describe('ideaKind', () => {
  it('no companions is solo', () => {
    expect(ideaKind({ companionIds: [] })).toBe('solo')
  })
  it('any companion makes it a group trip', () => {
    expect(ideaKind({ companionIds: ['c1'] })).toBe('group')
    expect(ideaKind({ companionIds: ['c1', 'c2'] })).toBe('group')
  })
  it('rows from before the column existed (missing array) are solo', () => {
    expect(ideaKind({} as { companionIds: string[] })).toBe('solo')
  })
})
