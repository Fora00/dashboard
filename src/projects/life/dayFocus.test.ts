import { describe, expect, it } from 'vitest'
import { LIFE_CAPS, dayFocusId, freeSlots, freeUrgentSlots, isUrgentSlot, parseFocusLines, splitUrgent } from './model'

describe('parseFocusLines', () => {
  it('one title per non-empty line; bullets, numbering, checkboxes and the target tag are stripped', () => {
    const text = '🎯 Esempio A\r\n- Esempio B\n\n  • Esempio C  \n1) Esempio D\n[ ] Esempio E\n   \n'
    expect(parseFocusLines(text)).toEqual(['Esempio A', 'Esempio B', 'Esempio C', 'Esempio D', 'Esempio E'])
  })

  it('caps each title and returns [] for blank input', () => {
    expect(parseFocusLines('x'.repeat(LIFE_CAPS.dayFocusTitle + 50))[0]).toHaveLength(LIFE_CAPS.dayFocusTitle)
    expect(parseFocusLines(' \n\t\n')).toEqual([])
  })
})

describe('day focus slots', () => {
  it('ids are day:slot and free slots are the lowest unused of 0-2', () => {
    expect(dayFocusId('2026-10-21', 1)).toBe('2026-10-21:1')
    expect(freeSlots([])).toEqual([0, 1, 2])
    expect(freeSlots([0, 2])).toEqual([1])
    expect(freeSlots([0, 1, 2])).toEqual([])
  })
})

describe('urgent lines', () => {
  it('uses slots 3-8, separate from the 3-line focus', () => {
    expect(freeUrgentSlots([])).toEqual([3, 4, 5, 6, 7, 8])
    expect(freeUrgentSlots([3, 5])).toEqual([4, 6, 7, 8])
    expect(isUrgentSlot(2)).toBe(false)
    expect(isUrgentSlot(3)).toBe(true)
  })
  it('reads the "!" mark', () => {
    expect(splitUrgent('! Visita casa')).toEqual({ urgent: true, title: 'Visita casa' })
    expect(splitUrgent('Scrivania')).toEqual({ urgent: false, title: 'Scrivania' })
  })
})
