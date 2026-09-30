import { describe, expect, it } from 'vitest'
import { isAllowed, parseRobots } from './http.ts'

const allowed = (robots: string, path: string) => isAllowed(parseRobots(robots).rules, path)

describe('parseRobots', () => {
  it('uses our group over *', () => {
    const r = parseRobots(
      ['User-agent: *', 'Disallow: /', '', 'User-agent: dashboard-events-crawler', 'Disallow: /private'].join('\n'),
    )
    expect(isAllowed(r.rules, '/events')).toBe(true)
    expect(isAllowed(r.rules, '/private/x')).toBe(false)
  })

  it('falls back to * when no group names us', () => {
    expect(allowed('User-agent: googlebot\nDisallow: /\n\nUser-agent: *\nDisallow: /api/', '/api/x')).toBe(false)
    expect(allowed('User-agent: googlebot\nDisallow: /\n\nUser-agent: *\nDisallow: /api/', '/events')).toBe(true)
  })

  it('applies no rules when nothing matches us', () => {
    expect(parseRobots('User-agent: googlebot\nDisallow: /').rules).toEqual([])
  })

  it('merges consecutive User-agent lines into one group', () => {
    const txt = 'User-agent: bingbot\nUser-agent: *\nDisallow: /x'
    expect(allowed(txt, '/x')).toBe(false)
  })

  it('an empty Disallow allows everything', () => {
    expect(parseRobots('User-agent: *\nDisallow:').rules).toEqual([])
    expect(allowed('User-agent: *\nDisallow:', '/anything')).toBe(true)
  })

  it('ignores comments, CRLF, case of keys and blank lines', () => {
    const txt = 'USER-AGENT: *  # everyone\r\n\r\ndisallow: /opendata # no\r\n'
    expect(allowed(txt, '/opendata/api')).toBe(false)
    expect(allowed(txt, '/other')).toBe(true)
  })

  it('ignores rules before any User-agent line', () => {
    expect(parseRobots('Disallow: /\nUser-agent: *\nDisallow: /a').rules).toHaveLength(1)
  })

  describe('Crawl-delay', () => {
    it('reads it from the chosen group', () => {
      expect(parseRobots('User-agent: *\nCrawl-delay: 10').crawlDelay).toBe(10)
    })
    it('supports fractions', () => {
      expect(parseRobots('User-agent: *\nCrawl-delay: 2.5').crawlDelay).toBe(2.5)
    })
    it('takes our group, not *', () => {
      const txt = 'User-agent: *\nCrawl-delay: 20\n\nUser-agent: dashboard-events-crawler\nCrawl-delay: 3'
      expect(parseRobots(txt).crawlDelay).toBe(3)
    })
    it('caps absurd values at 30 s', () => {
      expect(parseRobots('User-agent: *\nCrawl-delay: 86400').crawlDelay).toBe(30)
    })
    it('ignores junk, zero and negative values', () => {
      expect(parseRobots('User-agent: *\nCrawl-delay: soon').crawlDelay).toBe(0)
      expect(parseRobots('User-agent: *\nCrawl-delay: 0').crawlDelay).toBe(0)
      expect(parseRobots('User-agent: *\nCrawl-delay: -5').crawlDelay).toBe(0)
    })
    it('is 0 when absent or when the group is not ours', () => {
      expect(parseRobots('User-agent: *\nDisallow: /a').crawlDelay).toBe(0)
      expect(parseRobots('User-agent: googlebot\nCrawl-delay: 9').crawlDelay).toBe(0)
    })
    it('does not break the group: rules after it still apply', () => {
      expect(allowed('User-agent: *\nCrawl-delay: 10\nDisallow: /x', '/x')).toBe(false)
    })
  })
})

describe('isAllowed', () => {
  it('no rules = allowed', () => {
    expect(isAllowed([], '/anything?x=1')).toBe(true)
  })

  it('prefix match, including the query string', () => {
    const txt = 'User-agent: *\nDisallow: /search'
    expect(allowed(txt, '/search')).toBe(false)
    expect(allowed(txt, '/search?q=1')).toBe(false)
    expect(allowed(txt, '/searching')).toBe(false)
    expect(allowed(txt, '/other')).toBe(true)
  })

  it('the longest match wins: Allow can carve a hole in a Disallow', () => {
    // trentogiovani: /opendata is disallowed but the calendar path is allowed.
    const txt = 'User-agent: *\nDisallow: /opendata\nAllow: /opendata/api/calendar'
    expect(allowed(txt, '/opendata/api/calendar?x=1')).toBe(true)
    expect(allowed(txt, '/opendata/api/content/search')).toBe(false)
  })

  it('the longer Disallow beats a shorter Allow', () => {
    const txt = 'User-agent: *\nAllow: /a\nDisallow: /a/b'
    expect(allowed(txt, '/a/b/c')).toBe(false)
    expect(allowed(txt, '/a/x')).toBe(true)
  })

  it('Allow wins a tie, whichever comes first', () => {
    expect(allowed('User-agent: *\nDisallow: /a\nAllow: /a', '/a')).toBe(true)
    expect(allowed('User-agent: *\nAllow: /a\nDisallow: /a', '/a')).toBe(true)
  })

  it('* matches any run of characters', () => {
    const txt = 'User-agent: *\nDisallow: /*/print\nDisallow: /*?ical='
    expect(allowed(txt, '/events/42/print')).toBe(false)
    expect(allowed(txt, '/events/?ical=1')).toBe(false)
    expect(allowed(txt, '/events/42')).toBe(true)
  })

  it('$ anchors the end of the path', () => {
    const txt = 'User-agent: *\nDisallow: /*.pdf$'
    expect(allowed(txt, '/docs/a.pdf')).toBe(false)
    expect(allowed(txt, '/docs/a.pdf?download=1')).toBe(true)
    expect(allowed(txt, '/docs/a.pdfx')).toBe(true)
  })

  it('regex metacharacters in a pattern are literal', () => {
    const txt = 'User-agent: *\nDisallow: /a.b+c(d)'
    expect(allowed(txt, '/a.b+c(d)')).toBe(false)
    expect(allowed(txt, '/aXb+c(d)')).toBe(true)
    expect(allowed(txt, '/a.bbc(d)')).toBe(true)
  })

  it('Disallow: / blocks the whole site', () => {
    expect(allowed('User-agent: *\nDisallow: /', '/')).toBe(false)
    expect(allowed('User-agent: *\nDisallow: /', '/x')).toBe(false)
  })
})
