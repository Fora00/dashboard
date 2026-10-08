import { describe, expect, it } from 'vitest'
import { isTypingTarget, listKeyAction, moveSelection, rangeBetween, visibleOrder } from './selection'
import type { WeekGroup } from './model'
import type { EventItem } from './types'

const ev = (id: string) => ({ id }) as EventItem

const weeks: WeekGroup[] = [
  {
    key: 'open-now',
    label: 'Open now',
    count: 2,
    days: [{ key: 'open-now', label: 'Open now', events: [ev('a'), ev('b')] }],
  },
  {
    key: '2026-10-05',
    label: 'This week',
    count: 3,
    days: [
      { key: '2026-10-08', label: 'Oggi', events: [ev('c'), ev('a')] },
      { key: '2026-10-09', label: 'Domani', events: [ev('d')] },
    ],
  },
  {
    key: '2026-10-12',
    label: 'Next week',
    count: 1,
    days: [{ key: '2026-10-13', label: 'mar 13 ott', events: [ev('e')] }],
  },
]

const none = new Set<string>()
const keys = { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }

describe('visibleOrder', () => {
  it('lists ids in display order, each once', () => {
    expect(visibleOrder(weeks, none)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('skips folded weeks but never the open-now group', () => {
    expect(visibleOrder(weeks, new Set(['2026-10-05', 'open-now']))).toEqual(['a', 'b', 'e'])
  })

  it('is empty for no weeks', () => {
    expect(visibleOrder([], none)).toEqual([])
  })
})

describe('moveSelection', () => {
  const order = ['a', 'b', 'c']

  it('starts at the top going down and at the bottom going up', () => {
    expect(moveSelection(order, null, 'next')).toBe('a')
    expect(moveSelection(order, null, 'prev')).toBe('c')
  })

  it('steps and clamps at both ends', () => {
    expect(moveSelection(order, 'a', 'next')).toBe('b')
    expect(moveSelection(order, 'b', 'prev')).toBe('a')
    expect(moveSelection(order, 'c', 'next')).toBe('c')
    expect(moveSelection(order, 'a', 'prev')).toBe('a')
  })

  it('jumps to first and last', () => {
    expect(moveSelection(order, 'b', 'first')).toBe('a')
    expect(moveSelection(order, 'b', 'last')).toBe('c')
  })

  it('treats a selection that left the list as none', () => {
    expect(moveSelection(order, 'gone', 'next')).toBe('a')
    expect(moveSelection(order, 'gone', 'prev')).toBe('c')
  })

  it('returns null for an empty list', () => {
    expect(moveSelection([], 'a', 'next')).toBeNull()
    expect(moveSelection([], null, 'first')).toBeNull()
  })
})

describe('listKeyAction', () => {
  it('maps arrows, Home/End and Esc', () => {
    expect(listKeyAction({ ...keys, key: 'ArrowDown' })).toEqual({ kind: 'move', move: 'next' })
    expect(listKeyAction({ ...keys, key: 'ArrowUp' })).toEqual({ kind: 'move', move: 'prev' })
    expect(listKeyAction({ ...keys, key: 'Home' })).toEqual({ kind: 'move', move: 'first' })
    expect(listKeyAction({ ...keys, key: 'End' })).toEqual({ kind: 'move', move: 'last' })
    expect(listKeyAction({ ...keys, key: 'Escape' })).toEqual({ kind: 'clear' })
  })

  it('maps j and k to next and previous', () => {
    expect(listKeyAction({ ...keys, key: 'j' })).toEqual({ kind: 'move', move: 'next' })
    expect(listKeyAction({ ...keys, key: 'k' })).toEqual({ kind: 'move', move: 'prev' })
  })

  it('ignores other keys and any modifier', () => {
    expect(listKeyAction({ ...keys, key: 'Enter' })).toBeNull()
    expect(listKeyAction({ ...keys, key: 'x' })).toBeNull()
    expect(listKeyAction({ ...keys, key: 'j', metaKey: true })).toBeNull()
    expect(listKeyAction({ ...keys, key: 'k', ctrlKey: true })).toBeNull()
    expect(listKeyAction({ ...keys, key: 'ArrowDown', metaKey: true })).toBeNull()
    expect(listKeyAction({ ...keys, key: 'ArrowUp', shiftKey: true })).toBeNull()
    expect(listKeyAction({ ...keys, key: 'Escape', altKey: true })).toBeNull()
  })
})

describe('isTypingTarget', () => {
  it('is true for fields and editable content', () => {
    expect(isTypingTarget({ tagName: 'INPUT' })).toBe(true)
    expect(isTypingTarget({ tagName: 'textarea' })).toBe(true)
    expect(isTypingTarget({ tagName: 'SELECT' })).toBe(true)
    expect(isTypingTarget({ tagName: 'DIV', isContentEditable: true })).toBe(true)
  })

  it('is false for buttons, links and nothing', () => {
    expect(isTypingTarget({ tagName: 'BUTTON' })).toBe(false)
    expect(isTypingTarget({ tagName: 'A' })).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})

describe('rangeBetween', () => {
  const order = ['a', 'b', 'c', 'd', 'e']

  it('is inclusive and follows list order in both directions', () => {
    expect(rangeBetween(order, 'b', 'd')).toEqual(['b', 'c', 'd'])
    expect(rangeBetween(order, 'd', 'b')).toEqual(['b', 'c', 'd'])
  })

  it('is just the clicked one when anchor equals target, is null or is gone', () => {
    expect(rangeBetween(order, 'c', 'c')).toEqual(['c'])
    expect(rangeBetween(order, null, 'c')).toEqual(['c'])
    expect(rangeBetween(order, 'zzz', 'c')).toEqual(['c'])
  })

  it('is empty when the clicked one is not in the list', () => {
    expect(rangeBetween(order, 'a', 'zzz')).toEqual([])
    expect(rangeBetween([], null, 'a')).toEqual([])
  })
})
