import { describe, expect, it } from 'vitest'
import { displayHost, displayPath, punycodeDecode } from './idn'

describe('idn display helpers', () => {
  it('decodes punycode hostnames (RFC 3492 and real domains)', () => {
    expect(displayHost('xn--r8jz45g.jp')).toBe('例え.jp')
    expect(displayHost('xn--bcher-kva.example')).toBe('bücher.example')
    expect(displayHost('www.xn--mnchen-3ya.de')).toBe('www.münchen.de')
    expect(punycodeDecode('egbpdaj6bu4bxfgehfvwxn')).toBe('ليهمابتكلموشعربي؟')
  })
  it('leaves plain and broken hostnames alone', () => {
    expect(displayHost('example.com')).toBe('example.com')
    expect(displayHost('xn--!!.com')).toBe('xn--!!.com')
  })
  it('percent-decodes paths, keeping invalid ones', () => {
    expect(displayPath('/%E3%83%91%E3%82%B9')).toBe('/パス')
    expect(displayPath('/%E3%83')).toBe('/%E3%83')
  })
})
