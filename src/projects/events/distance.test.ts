import { describe, expect, it } from 'vitest'
import { NEAR_MINUTES, driveLabel, driveMinutes, isNear } from './distance'

describe('distance from Rovereto', () => {
  it('knows towns, ignoring case, accents and parenthesised suffixes', () => {
    expect(driveMinutes('Trento')).toBe(25)
    expect(driveMinutes('Baselga di Pinè')).toBe(50)
    expect(driveMinutes('Baselga di Piné')).toBe(50)
    expect(driveMinutes('Peschiera del Garda (VR)')).toBe(75)
  })
  it('has no answer for unknown or generic places', () => {
    expect(driveMinutes('Trentino')).toBeNull()
    expect(driveMinutes('Online')).toBeNull()
    expect(isNear({ city: 'Online' })).toBe(false)
  })
  it('near means at most as far as Baselga di Pinè', () => {
    expect(NEAR_MINUTES).toBe(50)
    expect(isNear({ city: 'Rovereto' })).toBe(true)
    expect(isNear({ city: 'Baselga di Pinè' })).toBe(true)
    expect(isNear({ city: 'Bedollo' })).toBe(false)
    expect(isNear({ city: 'Verona' })).toBe(false)
  })
  it('labels the time', () => {
    expect(driveLabel('Trento')).toBe('25 min')
    expect(driveLabel('Padova')).toBe('1 h 40')
    expect(driveLabel('Rovereto')).toBe('')
    expect(driveLabel('Online')).toBe('')
  })
})

describe('category distance limit', () => {
  it('theatre is only worth about an hour', async () => {
    const { tooFarForCategory } = await import('./distance')
    expect(tooFarForCategory({ city: 'Trento', category: 'theatre' })).toBe(false)
    expect(tooFarForCategory({ city: 'Verona', category: 'theatre' })).toBe(true)
    expect(tooFarForCategory({ city: 'Padova', category: 'concerts' })).toBe(false)
    expect(tooFarForCategory({ city: 'Trentino', category: 'theatre' })).toBe(false) // unknown town: kept
  })
})
