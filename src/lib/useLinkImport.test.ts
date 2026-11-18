import { describe, expect, it } from 'vitest'
import { decodeLinkParam } from './useLinkImport'

const decode = (p: string) => ({ ok: true as const, text: `decoded:${p}` })

describe('decodeLinkParam', () => {
  it('decodes up to the cap', () => {
    expect(decodeLinkParam('abc', 3, decode, 'big')).toEqual({ ok: true, text: 'decoded:abc' })
  })
  it('refuses over the cap without calling the decoder', () => {
    let called = false
    const r = decodeLinkParam(
      'abcd',
      3,
      (p) => {
        called = true
        return decode(p)
      },
      'big',
    )
    expect(r).toEqual({ ok: false, errors: ['big'] })
    expect(called).toBe(false)
  })
})
