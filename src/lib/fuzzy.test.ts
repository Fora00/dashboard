import { describe, expect, it } from 'vitest'
import { fuzzyScore, normalize, rankItems, scoreItem } from './fuzzy'

describe('normalize', () => {
  it('drops accents and case', () => {
    expect(normalize('Caffè Già')).toBe('caffe gia')
  })
})

describe('fuzzyScore', () => {
  it('matches everything on an empty query', () => {
    expect(fuzzyScore('  ', 'Todo')).toBe(0)
  })

  it('ranks prefix > word start > substring > subsequence', () => {
    const prefix = fuzzyScore('shop', 'Shop List')!
    const word = fuzzyScore('list', 'Shop List')!
    const sub = fuzzyScore('hop', 'Shop List')!
    const seq = fuzzyScore('spl', 'Shop List')!
    expect(prefix).toBeGreaterThan(word)
    expect(word).toBeGreaterThan(sub)
    expect(sub).toBeGreaterThan(seq)
    expect(seq).toBeGreaterThan(0)
  })

  it('returns null when letters are missing or out of order', () => {
    expect(fuzzyScore('xyz', 'Todo')).toBeNull()
    expect(fuzzyScore('odt', 'Todo')).toBeNull()
  })

  it('ignores accents on both sides', () => {
    expect(fuzzyScore('caffe', 'Caffè')).not.toBeNull()
    expect(fuzzyScore('caffè', 'Caffe')).not.toBeNull()
  })

  it('needs every token to match, in any order', () => {
    expect(fuzzyScore('list shop', 'Shop List')).not.toBeNull()
    expect(fuzzyScore('shop zzz', 'Shop List')).toBeNull()
  })
})

describe('scoreItem', () => {
  it('falls back to keywords at half weight', () => {
    expect(scoreItem('sport', 'Climbing', ['Sport, viaggi e uscite'])).not.toBeNull()
    expect(scoreItem('sport', 'Sport', [])!).toBeGreaterThan(scoreItem('sport', 'Climbing', ['Sport'])!)
  })
})

describe('rankItems', () => {
  const items = [
    { n: 'Life', k: ['Organizzazione'] },
    { n: 'Meal Diary', k: ['Casa e cibo'] },
    { n: 'Links', k: [] },
  ]
  const get = (x: { n: string; k: string[] }) => ({
    label: x.n,
    keywords: x.k,
  })

  it('keeps order for an empty query', () => {
    expect(rankItems('', items, get)).toEqual(items)
  })

  it('filters and sorts best first', () => {
    expect(rankItems('li', items, get).map((x) => x.n)).toEqual(['Life', 'Links', 'Meal Diary'])
    expect(rankItems('cibo', items, get).map((x) => x.n)).toEqual(['Meal Diary'])
  })
})
