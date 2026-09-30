import { describe, expect, it } from 'vitest'
import {
  absUrl, cityFromAddress, clip, decodeEntities, firstNonEmpty, htmlToBlocks, htmlToText, normalize, snippet,
  stableId, tidyBlocks, titleCase,
} from './text.ts'

describe('decodeEntities', () => {
  it('named, decimal and hex entities', () => {
    expect(decodeEntities('caff&egrave; &amp; t&eacute; &#8211; &#x2019;')).toBe('caffè & té – ’')
  })
  it('leaves unknown or invalid entities alone', () => {
    expect(decodeEntities('&bogus; &#0; &#x110000;')).toBe('&bogus; &#0; &#x110000;')
  })
})

describe('htmlToText', () => {
  it('strips tags, scripts and styles, and collapses whitespace', () => {
    expect(htmlToText('<p>Ciao <b>mondo</b></p><script>alert(1)</script><style>p{}</style><p>Fine</p>')).toBe('Ciao mondo Fine')
  })
  it('turns block ends and <br> into spaces', () => {
    expect(htmlToText('a<br/>b<br>c</li><li>d')).toBe('a b c d')
  })
  it('handles null', () => {
    expect(htmlToText(null)).toBe('')
  })
})

describe('htmlToBlocks', () => {
  it('keeps paragraphs as blank lines and <br> as newlines', () => {
    expect(htmlToBlocks('<p>Uno</p><p>Due<br>tre</p>')).toBe('Uno\n\nDue\ntre')
  })
  it('raw newlines in HTML source are just spaces', () => {
    expect(htmlToBlocks('<p>uno\ndue</p>')).toBe('uno due')
  })
  it('plain text keeps its own line breaks (iCal DESCRIPTION) and decodes entities', () => {
    expect(htmlToBlocks('riga uno\n\n\n\nriga &amp; due')).toBe('riga uno\n\nriga & due')
  })
  it('drops script content', () => {
    expect(htmlToBlocks('<p>ok</p><script>evil()</script>')).toBe('ok')
  })
})

describe('tidyBlocks', () => {
  it('normalises line endings, spaces and runs of blank lines', () => {
    expect(tidyBlocks('  a \t b \r\n\r\n\r\n\r\n c  ')).toBe('a b\n\nc')
  })
})

describe('clip / snippet', () => {
  it('leave short text untouched', () => {
    expect(clip('short', 100)).toBe('short')
    expect(snippet('  short   text ', 100)).toBe('short text')
  })
  it('cut on a word boundary with an ellipsis, without trailing punctuation', () => {
    const text = 'Alpha beta gamma delta epsilon, zeta eta theta'
    const out = snippet(text, 30)
    expect(out.endsWith('…')).toBe(true)
    expect(out.length).toBeLessThanOrEqual(30)
    expect(out).toBe('Alpha beta gamma delta…')
    expect(clip(text, 30).length).toBeLessThanOrEqual(30)
  })
  it('hard cuts a single long word', () => {
    expect(snippet('x'.repeat(50), 10)).toBe(`${'x'.repeat(9)}…`)
  })
})

describe('absUrl', () => {
  it('resolves relative URLs and upgrades http to https', () => {
    expect(absUrl('/img/a.jpg', 'https://example.org/events/1')).toBe('https://example.org/img/a.jpg')
    expect(absUrl('http://example.org/a.jpg', 'https://x.org')).toBe('https://example.org/a.jpg')
  })
  it('rejects empty and non-web URLs', () => {
    expect(absUrl('', 'https://x.org')).toBeNull()
    expect(absUrl('   ', 'https://x.org')).toBeNull()
    expect(absUrl(null, 'https://x.org')).toBeNull()
    expect(absUrl('javascript:alert(1)', 'https://x.org')).toBeNull()
    expect(absUrl('data:text/html,hi', 'https://x.org')).toBeNull()
    expect(absUrl('ftp://x.org/a', 'https://x.org')).toBeNull()
  })
})

describe('normalize', () => {
  it('lowercases, strips accents and punctuation', () => {
    expect(normalize('  Caffè — Concerto, "Sera"! ')).toBe('caffe concerto sera')
  })
  it('keeps digits and non-latin letters', () => {
    expect(normalize('Sala 2 / Überlingen')).toBe('sala 2 uberlingen')
  })
  it('punctuation-only input normalises to nothing', () => {
    expect(normalize('...')).toBe('')
  })
})

describe('stableId', () => {
  it('is 16 hex chars, deterministic and order-sensitive', () => {
    expect(stableId('a', 'b')).toMatch(/^[0-9a-f]{16}$/)
    expect(stableId('a', 'b')).toBe(stableId('a', 'b'))
    expect(stableId('a', 'b')).not.toBe(stableId('b', 'a'))
  })
  it('does not confuse part boundaries', () => {
    expect(stableId('ab', 'c')).not.toBe(stableId('a', 'bc'))
  })
})

describe('cityFromAddress', () => {
  it('takes the town after a 5-digit postcode', () => {
    expect(cityFromAddress('Via Roma 1, 38122 Trento, Italia')).toBe('Trento')
    expect(cityFromAddress('Piazza Walther, 39100 Bolzano BZ')).toBe('Bolzano')
    expect(cityFromAddress('Via X 3, 38068 Rovereto (TN)')).toBe('Rovereto')
  })
  it('null when there is no postcode', () => {
    expect(cityFromAddress('Via Roma 1, Trento')).toBeNull()
    expect(cityFromAddress(null)).toBeNull()
  })
})

describe('firstNonEmpty', () => {
  it('skips empty and blank values', () => {
    expect(firstNonEmpty(null, undefined, '  ', 'x', 'y')).toBe('x')
    expect(firstNonEmpty(null, '')).toBe('')
  })
})

describe('titleCase', () => {
  it('converts shouting titles (from the function docs)', () => {
    expect(titleCase('TEATRO COMUNALE (SALA MAGGIORE)')).toBe('Teatro Comunale (Sala Maggiore)')
    expect(titleCase('MADRE COURAGE E I SUOI FIGLI')).toBe('Madre Courage e i Suoi Figli')
  })
  it('elided articles are capitalised, other apostrophes are not', () => {
    expect(titleCase("L'ATTRICE DELL'ARTE")).toBe("L'Attrice Dell'Arte")
    expect(titleCase("COS'È LA VITA")).toBe("Cos'è la Vita")
  })
  it('initials and words after punctuation are capitalised', () => {
    expect(titleCase('A. VIVALDI: LE QUATTRO STAGIONI')).toBe('A. Vivaldi: Le Quattro Stagioni')
  })
})
