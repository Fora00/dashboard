import { describe, expect, it } from 'vitest'
// db.ts constructs a Dexie instance on import: give it IndexedDB.
import '../test/fakeDb'
import { defaultTitle, normalizeTag, normalizeUrl } from './linksSync'

describe('normalizeUrl', () => {
  it('adds https:// when there is no scheme', () => {
    expect(normalizeUrl('example.org')).toBe('https://example.org/')
    expect(normalizeUrl('example.org/a/b?x=1#h')).toBe('https://example.org/a/b?x=1#h')
    expect(normalizeUrl('localhost:3000/x')).toBe('https://localhost:3000/x')
  })

  it('trims and keeps http and https as given', () => {
    expect(normalizeUrl('  https://example.org/a  ')).toBe('https://example.org/a')
    expect(normalizeUrl('http://example.org')).toBe('http://example.org/')
    expect(normalizeUrl('HTTPS://EXAMPLE.ORG/Path')).toBe('https://example.org/Path')
  })

  describe('rejects every non-http(s) protocol (the URL lands in an <a href>)', () => {
    it.each([
      'javascript:alert(1)',
      'JAVASCRIPT:alert(1)',
      'JaVaScRiPt:alert(1)',
      'javascript://%0aalert(1)',
      'javascript://example.org/%0aalert(1)',
      '  javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'data://text/html,hi',
      'file:///etc/passwd',
      'file://localhost/etc/passwd',
      'ftp://example.org/file',
      'mailto://someone@example.org',
      'things:///add?title=x',
      'blob://example.org/uuid',
    ])('%s', (bad) => {
      expect(normalizeUrl(bad)).toBeNull()
    })
  })

  it('a bare "javascript:alert(1)" without // is not mistaken for a host:port', () => {
    // No "//" after the scheme, so withScheme prefixes https:// and the result
    // is a (harmless) https URL on host "javascript", never a script URL.
    const out = normalizeUrl('javascript:alert(1)')
    expect(out === null || out.startsWith('https://')).toBe(true)
  })

  it('empty and garbage input is null', () => {
    expect(normalizeUrl('')).toBeNull()
    expect(normalizeUrl('   ')).toBeNull()
    expect(normalizeUrl('http://')).toBeNull()
    expect(normalizeUrl('https://exa mple.org')).toBeNull()
  })
})

describe('normalizeTag', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeTag('  Work ')).toBe('work')
    expect(normalizeTag('WORK')).toBe('work')
    expect(normalizeTag('To   Read\tLater')).toBe('to read later')
  })

  it('empty or whitespace-only is null', () => {
    expect(normalizeTag('')).toBeNull()
    expect(normalizeTag('   ')).toBeNull()
  })

  it('the cap is 30 characters after normalising', () => {
    expect(normalizeTag('x'.repeat(30))).toBe('x'.repeat(30))
    expect(normalizeTag('x'.repeat(31))).toBeNull()
    // 30 chars once the extra spaces are collapsed
    expect(normalizeTag(`${'x'.repeat(14)}      ${'y'.repeat(15)}`)).toBe(`${'x'.repeat(14)} ${'y'.repeat(15)}`)
  })

  it('is idempotent', () => {
    const once = normalizeTag('  Hello   World ')
    expect(normalizeTag(once ?? '')).toBe(once)
  })
})

describe('defaultTitle', () => {
  it('shows IDN hosts and percent-encoded paths readably', () => {
    expect(defaultTitle('https://xn--r8jz45g.jp/%E3%83%91%E3%82%B9')).toBe('例え.jp/パス')
    expect(defaultTitle('https://www.example.com/')).toBe('example.com')
  })
})
