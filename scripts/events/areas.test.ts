import { describe, expect, it } from 'vitest'
import { areaFor, areaOfCity, closerRing, keepForRing, NEAR_INTERESTS } from './areas.ts'

describe('areaOfCity', () => {
  it('maps known towns, ignoring case, accents and a (XX) suffix', () => {
    expect(areaOfCity('Bolzano')).toBe('alto-adige')
    expect(areaOfCity('bozen')).toBe('alto-adige')
    expect(areaOfCity('Essen (DE)')).toBe('abroad')
    expect(areaOfCity('München')).toBe('abroad')
    expect(areaOfCity('Munchen')).toBe('abroad')
    expect(areaOfCity("Sant'Ambrogio di Valpolicella")).toBe('verona-garda')
  })
  it('undefined for unknown towns', () => {
    expect(areaOfCity('Atlantide')).toBeUndefined()
    expect(areaOfCity('')).toBeUndefined()
  })
})

describe('areaFor', () => {
  it('the city map wins over the adapter area', () => {
    expect(areaFor('Verona', 'trentino')).toBe('verona-garda')
  })
  it('unknown towns use the adapter area', () => {
    expect(areaFor('Villaggio Sconosciuto', 'veneto')).toBe('veneto')
  })
})

describe('keepForRing', () => {
  it('home and spot keep everything', () => {
    expect(keepForRing('home', ['other'])).toBe(true)
    expect(keepForRing('spot', [])).toBe(true)
  })
  it('near keeps only interests', () => {
    expect(keepForRing('near', ['boardgames'])).toBe(true)
    expect(keepForRing('near', ['theatre'])).toBe(false) // a play is only worth ~1 h of driving
    expect(keepForRing('near', ['talks'])).toBe(false)
    expect(keepForRing('near', ['other'])).toBe(false)
    expect(keepForRing('near', [])).toBe(false)
  })
  it('near drops kids events even when they match an interest', () => {
    expect(keepForRing('near', ['festivals', 'kids'])).toBe(false)
  })
  it('food stays an interest after the festivals split', () => {
    expect(NEAR_INTERESTS).toContain('food')
    expect(keepForRing('near', ['food'])).toBe(true)
  })
})

describe('closerRing', () => {
  it('home < near < spot', () => {
    expect(closerRing('near', 'home')).toBe('home')
    expect(closerRing('home', 'spot')).toBe('home')
    expect(closerRing('spot', 'near')).toBe('near')
    expect(closerRing('spot', 'spot')).toBe('spot')
  })
})
