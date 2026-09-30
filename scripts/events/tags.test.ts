import { describe, expect, it } from 'vitest'
import { classify, dropRule, finishTags, formatTags, isKids, matchCategories, sortTags } from './tags.ts'

describe('matchCategories (keyword compilation: stems, accents, word boundaries)', () => {
  it('a trailing * matches word continuations', () => {
    expect(matchCategories('Laboratorio di fumetti')).toContain('nerd')
    expect(matchCategories('Mostra di fumetto')).toContain('nerd')
  })

  it("'comicità' must NOT match the comic keyword (regression 2026-09-29)", () => {
    expect(matchCategories('Serata di comicità con Zelig')).not.toContain('nerd')
    expect(matchCategories('Comic con artisti internazionali')).toContain('nerd')
  })

  it('keywords are whole words: no substring hits', () => {
    // "esport" is a keyword, "esportazione" must not match it.
    expect(matchCategories('Corso sull esportazione di vino')).not.toContain('nerd')
    expect(matchCategories('Torneo di esport')).toContain('nerd')
  })

  it('accents and punctuation are ignored', () => {
    expect(matchCategories('GIOCHI DI SOCIETÀ!')).toContain('boardgames')
    expect(matchCategories('Serata-giochi')).toContain('boardgames')
  })

  it('no text, no match', () => {
    expect(matchCategories(null, undefined, '')).toEqual([])
  })
})

describe('isKids', () => {
  it('kids words in the title', () => {
    expect(isKids('Letture animate per bambini', null, null)).toBe(true)
    expect(isKids('Teatro ragazzi: Pinocchio', null, null)).toBe(true)
    expect(isKids('Burattini in piazza', null, null)).toBe(true)
  })

  it('a child age range, but not "years ago" or an adult-sounding age', () => {
    expect(isKids('Laboratorio 6-10 anni', null, null)).toBe(true)
    expect(isKids('Laboratorio dai 3 ai 6 anni', null, null)).toBe(true)
    expect(isKids('La città di 5-10 anni fa', null, null)).toBe(false)
    expect(isKids('Corso da 10 anni di esperienza', null, null)).toBe(false)
  })

  it('an adults marker vetoes', () => {
    expect(isKids('Yoga per adulti e bambini', null, null)).toBe(false)
    expect(isKids('Laboratorio creativo', null, 'Per bambini dai 5 anni. Anche per adulti.')).toBe(false)
  })

  it('the source typology counts', () => {
    expect(isKids('Sonoma', 'Teatro ragazzi', null)).toBe(true)
  })

  it('kids phrases count in the first sentence of the summary only', () => {
    expect(isKids('Sagra di paese', null, 'Letture per bambini e bambine. Poi musica e vino.')).toBe(true)
    expect(isKids('Sagra di paese', null, 'Musica, vino e stand. Intrattenimento per bambini.')).toBe(false)
  })

  it('the long description never makes an event kids', () => {
    expect(isKids('Stagione teatrale', null, 'Il cartellone.', 'Domenica spettacolo per bambini e bambine.')).toBe(false)
  })

  it('words deliberately absent from the rules stay adult (false positives seen)', () => {
    expect(isKids("Ricordi d'infanzia", null, null)).toBe(false)
    expect(isKids('Frati minori in concerto', null, null)).toBe(false)
  })
})

describe('classify', () => {
  it('a source hint wins', () => {
    expect(classify('exhibitions', 'other', { title: 'Serata giochi da tavolo' }).category).toBe('exhibitions')
  })

  it('a non-other adapter default wins over keywords', () => {
    expect(classify(undefined, 'boardgames', { title: 'Concerto' }).category).toBe('boardgames')
  })

  it('keywords decide when the adapter default is other', () => {
    const r = classify(undefined, 'other', { title: 'Serata giochi da tavolo' })
    expect(r.category).toBe('boardgames')
    expect(r.tags).toContain('boardgames')
  })

  it('falls back to other with the other tag', () => {
    const r = classify(undefined, 'other', { title: 'Assemblea condominiale' })
    expect(r.category).toBe('other')
    expect(r.tags).toContain('other')
  })

  it('a kids event is tagged kids and never creative', () => {
    const r = classify(undefined, 'other', { title: 'Laboratorio creativo per bambini', summary: 'Per bambini dai 5 anni' })
    expect(r.tags).toContain('kids')
    expect(r.tags).not.toContain('creative')
    expect(r.category).not.toBe('creative')
  })

  it('title keywords beat a broad typology', () => {
    const r = classify(undefined, 'other', { title: 'Serata giochi da tavolo', tagText: 'Teatro' })
    expect(r.category).toBe('boardgames')
  })
})

describe('formatTags', () => {
  it('none for a kids event via classify', () => {
    const r = classify(undefined, 'other', { title: 'Serata giochi da tavolo per bambini' })
    expect(r.tags).toContain('kids')
    expect(r.tags.filter((t) => t === 'social-friend' || t === 'solo-ok')).toEqual([])
  })

  it('board games are social and fine to attend alone', () => {
    const tags = formatTags({ title: 'Serata giochi da tavolo' }, 'boardgames', ['boardgames'])
    expect(tags).toContain('social-friend')
    expect(tags).toContain('solo-ok')
  })

  it('an exhibition is solo-ok without being social', () => {
    const tags = formatTags({ title: 'Mostra di pittura' }, 'exhibitions', ['exhibitions'])
    expect(tags).toContain('solo-ok')
    expect(tags).not.toContain('social-friend')
  })
})

describe('dropRule', () => {
  it('no title (Open Data Hub "...")', () => {
    expect(dropRule({ title: '...' }, 'other')).toBe('no-title')
    expect(dropRule({ title: '   ' }, 'other')).toBe('no-title')
  })

  it('professional training', () => {
    expect(dropRule({ title: 'Corso di aggiornamento per docenti' }, 'talks')).toBe('professional-training')
    expect(dropRule({ title: 'Sicurezza sul lavoro: corso base' }, 'other')).toBe('professional-training')
  })

  it('civic notices, but parades stay', () => {
    expect(dropRule({ title: 'Convocazione consiglio circoscrizione' }, 'other')).toBe('civic-notice')
    expect(dropRule({ title: 'Consiglio comunale: sfilata dei costumi' }, 'other')).toBeNull()
  })

  it('spectator sport is dropped only in other/outdoor/festivals', () => {
    expect(dropRule({ title: 'Campionato italiano di canottaggio' }, 'outdoor')).toBe('spectator-sport')
    expect(dropRule({ title: 'Campionato di scacchi' }, 'boardgames')).toBeNull()
  })

  it('sport you take part in stays', () => {
    expect(dropRule({ title: 'Gara di corsa non competitiva' }, 'outdoor')).toBeNull()
    expect(dropRule({ title: 'Camminata della gara', summary: 'camminata aperta a tutti' }, 'outdoor')).toBeNull()
  })

  it('an ordinary event is kept', () => {
    expect(dropRule({ title: 'Concerto di Natale' }, 'concerts')).toBeNull()
  })
})

describe('finishTags / sortTags', () => {
  it('puts the primary first and follows category priority', () => {
    expect(finishTags('theatre', ['concerts', 'boardgames'], false)).toEqual(['boardgames', 'theatre', 'concerts'])
  })

  it('other only survives as the primary category', () => {
    expect(finishTags('theatre', ['other'], false)).toEqual(['theatre'])
    expect(finishTags('other', [], false)).toEqual(['other'])
  })

  it('kids removes creative and format tags and is appended last', () => {
    expect(finishTags('theatre', ['creative', 'social-friend', 'solo-ok'], true)).toEqual(['theatre', 'kids'])
  })

  it('sortTags dedups and puts kids/format tags after categories', () => {
    expect(sortTags(['solo-ok', 'kids', 'theatre', 'theatre', 'boardgames'])).toEqual(['boardgames', 'theatre', 'kids', 'solo-ok'])
  })
})
