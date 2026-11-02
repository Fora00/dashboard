import { describe, expect, it } from 'vitest'
import { DEFAULT_ZONES, inZones, isSourceHome, zoneOf } from './zones'

describe('zones', () => {
  it('Trento and Rovereto are the default', () => {
    expect(DEFAULT_ZONES).toEqual(['trento', 'rovereto'])
    expect(inZones({ city: 'Trento' }, DEFAULT_ZONES)).toBe(true)
    expect(inZones({ city: 'Pergine Valsugana' }, DEFAULT_ZONES)).toBe(false)
  })
  it('groups Trentino towns by valley, ignoring accents and spelling', () => {
    expect(zoneOf({ city: 'Baselga di Pinè' })).toBe('trento-dintorni')
    expect(zoneOf({ city: 'Baselga di Piné' })).toBe('trento-dintorni')
    expect(zoneOf({ city: 'Revò' })).toBe('valli-nord')
    expect(zoneOf({ city: 'Riva del Garda' })).toBe('sud')
    expect(zoneOf({ city: 'Ala' })).toBe('sud')
    expect(zoneOf({ city: 'Borgo Valsugana' })).toBe('valsugana')
    expect(zoneOf({ city: 'Pinzolo' })).toBe('giudicarie')
  })
  it('puts unknown Trentino places in altro and other regions by their area', () => {
    expect(zoneOf({ city: 'Trentino' })).toBe('altro')
    expect(zoneOf({ city: 'Online' })).toBe('altro')
    expect(zoneOf({ city: 'Padova', area: 'veneto' })).toBe('veneto')
    expect(zoneOf({ city: 'Bolzano', area: 'alto-adige' })).toBe('alto-adige')
    expect(zoneOf({ city: 'Bologna', area: 'emilia-romagna' })).toBe('lontano')
  })
  it('no zone picked = every zone', () => {
    expect(inZones({ city: 'Padova', area: 'veneto' }, [])).toBe(true)
  })
  it('keeps Ludimus in Piné as a default place', () => {
    expect(isSourceHome({ source: 'ludimus', city: 'Baselga di Piné' })).toBe(true)
    expect(isSourceHome({ source: 'ludimus', city: 'Arco' })).toBe(false)
  })
})
