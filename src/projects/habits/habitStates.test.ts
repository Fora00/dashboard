import { describe, expect, it } from 'vitest'
import { hasStarted } from './habitStates'

describe('hasStarted', () => {
  it('hides a habit whose cycle starts in the future', () => {
    expect(hasStarted({}, '2026-11-01')).toBe(true)
    expect(hasStarted({ cycleStart: '2026-11-01' }, '2026-11-01')).toBe(true)
    expect(hasStarted({ cycleStart: '2026-11-02' }, '2026-11-01')).toBe(false)
  })
})
