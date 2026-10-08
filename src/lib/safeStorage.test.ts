import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readJSON, readString, removeKey, writeJSON, writeString } from './safeStorage'

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  }
}

beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()))
afterEach(() => vi.unstubAllGlobals())

describe('safeStorage', () => {
  it('round-trips strings and removes keys', () => {
    expect(readString('k')).toBeNull()
    writeString('k', 'v')
    expect(readString('k')).toBe('v')
    removeKey('k')
    expect(readString('k')).toBeNull()
  })

  it('round-trips JSON through the sanitizer', () => {
    writeJSON('j', { a: 1 })
    expect(readJSON('j', (r) => r as { a: number }, { a: 0 })).toEqual({
      a: 1,
    })
    expect(readJSON('j', () => ({ a: 9 }), { a: 0 })).toEqual({ a: 9 })
  })

  it('missing key, bad JSON and a throwing sanitizer give the fallback', () => {
    expect(readJSON('none', (r) => r, 'fb')).toBe('fb')
    localStorage.setItem('bad', '{oops')
    expect(readJSON('bad', (r) => r, 'fb')).toBe('fb')
    writeJSON('x', 1)
    expect(
      readJSON(
        'x',
        () => {
          throw new Error('no')
        },
        'fb',
      ),
    ).toBe('fb')
  })

  it('blocked storage (every access throws) never throws out of the helpers', () => {
    const boom = () => {
      throw new Error('blocked')
    }
    vi.stubGlobal('localStorage', {
      getItem: boom,
      setItem: boom,
      removeItem: boom,
    })
    expect(readString('k')).toBeNull()
    expect(readJSON('k', (r) => r, 'fb')).toBe('fb')
    expect(() => writeString('k', 'v')).not.toThrow()
    expect(() => writeJSON('k', 1)).not.toThrow()
    expect(() => removeKey('k')).not.toThrow()
  })
})
