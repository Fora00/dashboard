import { describe, expect, it } from 'vitest'
import { gestures, scopeTitles, shortcutFor, shortcuts } from './shortcuts'

describe('shortcuts', () => {
  it('has unique ids and no two shortcuts on the same combo within a scope', () => {
    expect(new Set(shortcuts.map((s) => s.id)).size).toBe(shortcuts.length)
    const seen = new Set<string>()
    for (const s of shortcuts) {
      const k = `${s.scope}:${s.combo}`
      expect(seen.has(k)).toBe(false)
      seen.add(k)
    }
  })

  it('every scope has a title and shortcutFor throws on an unknown id', () => {
    for (const s of shortcuts) expect(scopeTitles[s.scope]).toBeTruthy()
    expect(shortcutFor('palette').combo).toBe('mod+k')
    expect(() => shortcutFor('nope')).toThrow()
  })

  it('every shortcut and gesture has a description', () => {
    for (const s of shortcuts) expect(s.description.trim()).not.toBe('')
    for (const g of gestures) expect(g.description.trim()).not.toBe('')
  })

  it('does not bind a plain key that collides with a global one on a page', () => {
    const globalPlain = shortcuts.filter((s) => s.scope === 'global' && !s.combo.includes('+')).map((s) => s.combo)
    for (const s of shortcuts.filter((x) => x.scope !== 'global')) expect(globalPlain).not.toContain(s.combo)
  })
})
