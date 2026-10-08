import { describe, expect, it } from 'vitest'
import { resolveOwner } from './ownerCache'

function store() {
  const m = new Map<string, boolean>()
  return {
    m,
    read: (id: string) => m.get(id),
    write: (id: string, o: boolean) => void m.set(id, o),
  }
}

describe('resolveOwner', () => {
  it('caches a successful answer', () => {
    const s = store()
    expect(resolveOwner('u1', { data: true, error: null }, s.read, s.write)).toBe(true)
    expect(s.m.get('u1')).toBe(true)
  })

  it('falls back to the cached value on error and does not overwrite it', () => {
    const s = store()
    s.m.set('u1', true)
    expect(resolveOwner('u1', { data: null, error: new Error('offline') }, s.read, s.write)).toBe(true)
    expect(resolveOwner('u1', null, s.read, s.write)).toBe(true)
    expect(s.m.get('u1')).toBe(true)
  })

  it('is false on error with nothing cached, and caches nothing', () => {
    const s = store()
    expect(resolveOwner('u1', { data: null, error: new Error('x') }, s.read, s.write)).toBe(false)
    expect(s.m.size).toBe(0)
  })

  it('does not leak between users', () => {
    const s = store()
    s.m.set('owner', true)
    expect(resolveOwner('guest', null, s.read, s.write)).toBe(false)
  })

  it('a successful false replaces a cached true', () => {
    const s = store()
    s.m.set('u1', true)
    expect(resolveOwner('u1', { data: false, error: null }, s.read, s.write)).toBe(false)
    expect(s.m.get('u1')).toBe(false)
  })
})
