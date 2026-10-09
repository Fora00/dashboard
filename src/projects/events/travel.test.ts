import { describe, expect, it } from 'vitest'
import { travelFrom, travelLabel } from './travel'

describe('travel hint', () => {
  it('looks a town up, ignoring case, accents and suffixes', () => {
    expect(travelFrom('Bolzano')).toEqual({ origin: 'Trento', minutes: 45 })
    expect(travelFrom('verona (VR)')).toEqual({ origin: 'Rovereto', minutes: 65 })
    expect(travelFrom('Nago-Torbole')?.minutes).toBe(25)
  })
  it('picks the nearer origin', () => {
    expect(travelFrom('Ala')?.origin).toBe('Rovereto')
    expect(travelFrom('Pergine Valsugana')?.origin).toBe('Trento')
    expect(travelFrom('Cles')).toEqual({ origin: 'Trento', minutes: 45 })
  })
  it('has no hint for Trento, Rovereto, online or unknown towns', () => {
    for (const city of ['Trento', 'Rovereto', 'Online', 'Trentino', 'Atlantide', '']) {
      expect(travelFrom(city)).toBeNull()
      expect(travelLabel({ city })).toBe('')
    }
  })
  it('words the label in Italian', () => {
    expect(travelLabel({ city: 'Arco' })).toBe('≈ 30 min da Rovereto')
    expect(travelLabel({ city: 'Brescia' })).toBe('≈ 1 h 35 da Rovereto')
    expect(travelLabel({ city: 'Merano' })).toBe('≈ 1 h 15 da Trento')
  })
})
