import { describe, expect, it } from 'vitest'
import { comboLabel, matchesCombo, shouldIgnore } from './useHotkey'

const key = (
  k: string,
  mods: Partial<{ metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }> = {},
) => ({
  key: k,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...mods,
})

describe('matchesCombo', () => {
  it('maps mod to Command on Apple and Ctrl elsewhere', () => {
    expect(matchesCombo(key('k', { metaKey: true }), 'mod+k', true)).toBe(true)
    expect(matchesCombo(key('k', { ctrlKey: true }), 'mod+k', true)).toBe(false)
    expect(matchesCombo(key('k', { ctrlKey: true }), 'mod+k', false)).toBe(true)
    expect(matchesCombo(key('k', { metaKey: true }), 'mod+k', false)).toBe(false)
  })

  it('does not fire a plain key when a modifier is held', () => {
    expect(matchesCombo(key('n'), 'n', true)).toBe(true)
    expect(matchesCombo(key('n', { metaKey: true }), 'n', true)).toBe(false)
    expect(matchesCombo(key('n', { ctrlKey: true }), 'n', false)).toBe(false)
    expect(matchesCombo(key('n', { altKey: true }), 'n', true)).toBe(false)
  })

  it('is case-insensitive and handles symbols and named keys', () => {
    expect(matchesCombo(key('N'), 'n', true)).toBe(true)
    expect(matchesCombo(key('/'), '/', true)).toBe(true)
    expect(matchesCombo(key('?', { shiftKey: true }), '?', true)).toBe(true)
    expect(matchesCombo(key('Escape'), 'escape', true)).toBe(true)
  })

  it('enforces an explicit shift', () => {
    expect(matchesCombo(key('a', { shiftKey: true }), 'shift+a', true)).toBe(true)
    expect(matchesCombo(key('a'), 'shift+a', true)).toBe(false)
  })
})

describe('shouldIgnore', () => {
  const ev = (target: { tagName: string; isContentEditable?: boolean }, extra: Partial<KeyboardEvent> = {}) =>
    ({ target, isComposing: false, defaultPrevented: false, ...extra }) as unknown as KeyboardEvent

  it('ignores plain keys typed into fields but lets command combos through', () => {
    expect(shouldIgnore(ev({ tagName: 'INPUT' }), 'n', {})).toBe(true)
    expect(shouldIgnore(ev({ tagName: 'TEXTAREA' }), '/', {})).toBe(true)
    expect(shouldIgnore(ev({ tagName: 'DIV', isContentEditable: true }), 'n', {})).toBe(true)
    expect(shouldIgnore(ev({ tagName: 'INPUT' }), 'mod+k', {})).toBe(false)
    expect(shouldIgnore(ev({ tagName: 'INPUT' }), 'escape', { allowInInput: true })).toBe(false)
    expect(shouldIgnore(ev({ tagName: 'BUTTON' }), 'n', {})).toBe(false)
  })

  it('ignores IME composition and already handled events', () => {
    expect(shouldIgnore(ev({ tagName: 'DIV' }, { isComposing: true }), 'n', {})).toBe(true)
    expect(shouldIgnore(ev({ tagName: 'DIV' }, { defaultPrevented: true }), 'n', {})).toBe(true)
  })
})

describe('comboLabel', () => {
  it('formats for Apple and other platforms', () => {
    expect(comboLabel('mod+k', true)).toBe('⌘K')
    expect(comboLabel('mod+k', false)).toBe('Ctrl K')
    expect(comboLabel('shift+/', false)).toBe('Shift /')
    expect(comboLabel('escape', true)).toBe('Esc')
  })
})
