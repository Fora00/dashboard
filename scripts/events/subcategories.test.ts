import { describe, expect, it } from 'vitest'
import type { Event } from './types.ts'
import type { CategoryId, TagId } from './tags.ts'
import { CATEGORIES } from './tags.ts'
import { SUBCATEGORIES, subcategoryOf, withSubcategory } from './subcategories.ts'
import { dedup } from './pipeline.ts'
import { PreviousEventSchema } from './schemas.ts'

const sub = (category: CategoryId, title: string, summary = '', over: { tags?: TagId[]; source?: string } = {}) =>
  subcategoryOf({ category, title, summary, tags: over.tags ?? [category], source: over.source ?? 'x' })

const full = (over: Partial<Event> = {}): Event => ({
  id: 'a',
  title: 'Concerto',
  start: '2026-10-20T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: null,
  city: 'Trento',
  area: 'trentino',
  ring: 'home',
  url: 'https://example.org/a',
  source: 'x',
  sources: ['x'],
  category: 'concerts',
  tags: ['concerts'],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-10T10:00:00Z',
  ...over,
})

type Row = [id: string, title: string, summary: string, over?: { source?: string }]

describe('SUBCATEGORIES', () => {
  it('only the four big categories, lowercase-kebab ids, unique per category', () => {
    expect(Object.keys(SUBCATEGORIES).sort()).toEqual(['concerts', 'exhibitions', 'talks', 'theatre'])
    for (const list of Object.values(SUBCATEGORIES)) {
      expect(new Set(list.map((s) => s.id)).size).toBe(list.length)
      for (const s of list) expect(s.id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })
  it('every rule outcome is a declared id (spot check over all fixtures below)', () => {
    const ids = new Set(Object.values(SUBCATEGORIES).flatMap((l) => l.map((s) => s.id)))
    for (const v of ['prosa', 'danza', 'classica', 'arte', 'libri']) expect(ids.has(v)).toBe(true)
  })
})

describe('theatre', () => {
  it.each([
    ['prosa', 'Niente panico!', 'Compagnia Filodrammatica Civezzano APS'],
    ['prosa', 'Stagione di prosa Teatro ai Colli 2026/2027', ''],
    ['prosa', 'Il Berretto a Sonagli', 'Pirandello non è autore per tempi di pace'],
    ['stand-up', 'Andrea Fratellini & Zio Tore', 'one-man show di comicità, musica e ventriloquia'],
    ['danza', 'C:SC Circuito Danza 2026/2027', ''],
    ['danza', 'Lo Schiaccianoci', 'Balletto di Siena SPECIALE NATALE'],
    ['danza', 'MBIRA (DANZA)', ''],
    ['musical-opera', 'Pagliacci', 'Ispirato da una storia vera, un omicidio. Libretto di Leoncavallo'],
    ['musical-opera', 'Opera lirica e balletto al cinema 2026', ''],
    ['musical-opera', 'Betly, o la capanna svizzera', 'Gaetano Donizetti, una commedia'],
  ])('%s: %s', (id, title, summary) => {
    expect(sub('theatre', title, summary)).toBe(id)
  })

  it('a kids theatre event is ragazzi, and keeps its kids tag out of this function', () => {
    expect(sub('theatre', 'Cappuccetti matti', '', { tags: ['theatre', 'kids'] })).toBe('ragazzi')
    expect(sub('theatre', 'Teatro Ragazzi 2026-2027')).toBe('ragazzi')
    // kids wins over a dance keyword
    expect(sub('theatre', 'Pierino e il lupo', 'Balletto di Siena', { tags: ['theatre', 'kids'] })).toBe('ragazzi')
  })

  it.each([
    ['Accabadora', 'Tratto dall omonimo romanzo di Michela Murgia'],
    ['Gaza vive', 'uno spettacolo di e con Beppe Casales'],
    ['Le tre Marie', 'Il lavoro, di genere comico, ci porta indietro nel tempo'],
    ['Teatro di Meano', 'Stagione 2026-2027'],
    ['Dance Night', 'Una serata dance con Dj Joao'],
  ])('stays unclassified: %s', (title, summary) => {
    expect(sub('theatre', title, summary)).toBeUndefined()
  })

  it('a season programme is classified by its title only', () => {
    expect(sub('theatre', 'Teatro di Rovereto | Stagione 2026/2027', 'tra danza, prosa e musical')).toBeUndefined()
    expect(sub('theatre', 'Stagione di prosa 2026/2027', 'tra danza e musical')).toBe('prosa')
  })
})

describe('concerts', () => {
  it.each([
    ['classica', 'Danish String Quartet', 'Stagione concerti 2026 Quartetto d archi'],
    ['classica', 'Mozart, Requiem', ''],
    ['classica', 'Candlelight: Tributo a Ludovico Einaudi', ''],
    ['classica', '61ª Stagione concertistica 2026/2027 dell Orchestra di Padova e del Veneto', ''],
    ['jazz-blues', 'Padova jazz festival 2026', ''],
    ['jazz-blues', 'LAURA WILLEIT & HUBERT DORIGATTI (BZ): "DOWN HOME BLUES"', ''],
    ['rock-pop', 'Big One', 'The voice and the sound of Pink Floyd, la miglior Tribute Band Europea'],
    ['folk-cori', 'Harlem Gospel Choir', ''],
    ['folk-cori', 'Concerto corale di Natale', ''],
    ['folk-cori', 'Banda musicale Neuler (D)', ''],
    ['elettronica', "DJ'n'Drinks", ''],
  ])('%s: %s', (id, title, summary) => {
    expect(sub('concerts', title, summary)).toBe(id)
  })

  it.each([
    ['Paulo Morello Trio "Moving" (D)', ''],
    ['Josef Špaček in concerto', ''],
    ['Max Gazzé: tre live a Trento al Teatro Sociale', 'nuovo tour'],
    ['English through songs', 'Migliora il tuo inglese con la musica'],
    ['Pop art in piazza', ''],
  ])('stays unclassified: %s', (title, summary) => {
    expect(sub('concerts', title, summary)).toBeUndefined()
  })
})

describe('exhibitions', () => {
  it.each<Row>([
    ['fotografia', 'Life support', 'Mostra fotografica'],
    ['fotografia', 'Trentino, dove passano e nascono i campioni', '60 anni di ciclismo nell obiettivo di Remo Mosna'],
    ['arte', 'Giacomo Balla. Lo stile dell avanguardia', 'Opere dalla Fondazione'],
    ['arte', 'Mostra di pittura di Natalia Forese', ''],
    ['storia', 'Mostra Collettiva: La Grande Guerra', ''],
    ['storia', 'I colori di Tridentum', 'Allestita nei due principali siti della Trento romana'],
    ['scienza', 'Segnale dalla Terra. Mostra a Castel Belasi', '', { source: 'muse' }],
    ['arte', 'Domenica gratuita | Gennaio 2027', 'Tornano le domeniche gratuite', { source: 'mart' }],
  ])('%s: %s', (id, title, summary, over) => {
    expect(sub('exhibitions', title, summary, over)).toBe(id)
  })

  it('photography beats art, science beats history, art is the catch-all', () => {
    expect(sub('exhibitions', 'Mostra di pittura e fotografia')).toBe('fotografia')
    expect(sub('exhibitions', 'Water Flow. Acqua, arte, scienza, umanità')).toBe('scienza')
  })

  it.each([
    ['Le Giornate della Mostra del Cinema di Venezia', ''],
    ['Inventare la natura. Leonardo, Arcimboldo, Caravaggio', 'Mostra di Palazzo Te'],
    ['Un lavoro a regola d Arte', 'Dignità, Salute e Sicurezza'],
    ['Esibizione di schioccatrici di frusta', ''],
  ])('stays unclassified: %s', (title, summary) => {
    expect(sub('exhibitions', title, summary)).toBeUndefined()
  })
})

describe('talks', () => {
  it.each<Row>([
    ['libri', 'L orso di Shakespeare', 'presentazione del libro di Steve Penner'],
    ['libri', 'Gruppo di lettura Libripensieri', ''],
    ['libri', 'Emanuela Canepa presenta “Amalia, l obliqua”', '', { source: 'arcadia' }],
    ['conferenze', 'Ciclo di conferenze "Urbs Ipsa Moenia"', ''],
    ['conferenze', 'Convegno Nazionale: Vie Ferrate tra paesaggio, economia e loisir', ''],
    ['conferenze', 'Rilassati nella routine scolastica – Seminario per genitori', ''],
    ['dibattiti', 'Tavola rotonda sulla mobilità', ''],
    ['dibattiti', 'Dibattito con i candidati', ''],
  ])('%s: %s', (id, title, summary, over) => {
    expect(sub('talks', title, summary, over)).toBe(id)
  })

  it('a book presentation inside a conference series is a book event', () => {
    expect(sub('talks', 'FUTURO : CONOSCENZA', 'Conversazione pubblica e presentazione libro')).toBe('libri')
  })

  it.each([
    ['Gruppo di conversazione in tedesco', 'incontro alle 16.00'],
    ['Impariamo l italiano!', 'A partire da mercoledì 14 ottobre'],
    ['Momenti decisivi: le storie nascoste della fotografia', 'Serate sulla fotografia d autore'],
    ['Sportello digitale', 'Ogni giovedì'],
  ])('stays unclassified: %s', (title, summary) => {
    expect(sub('talks', title, summary)).toBeUndefined()
  })
})

describe('other categories never get a subcategory', () => {
  const others = CATEGORIES.map((c) => c.id).filter((c) => !(c in SUBCATEGORIES))
  it.each(others)('%s', (category) => {
    for (const title of [
      'Concerto jazz',
      'Mostra fotografica',
      'Presentazione del libro',
      'Spettacolo di danza',
      'Commedia',
    ])
      expect(sub(category, title)).toBeUndefined()
  })
})

describe('withSubcategory and the pipeline', () => {
  it('sets, replaces and removes the field', () => {
    expect(withSubcategory(full({ title: 'Padova jazz festival' })).subcategory).toBe('jazz-blues')
    expect(withSubcategory(full({ title: 'Padova jazz festival', subcategory: 'classica' })).subcategory).toBe(
      'jazz-blues',
    )
    expect('subcategory' in withSubcategory(full({ title: 'Boh', subcategory: 'classica' }))).toBe(false)
    expect(
      'subcategory' in withSubcategory(full({ category: 'food', title: 'Cena jazz', subcategory: 'jazz-blues' })),
    ).toBe(false)
  })

  it('dedup (also run on events carried over from an older file) fills it in', () => {
    const [e] = dedup([full({ id: 'old', title: 'Padova jazz festival' })])
    expect(e?.subcategory).toBe('jazz-blues')
  })

  it('survives the carry-over validation of the previous file (looseObject)', () => {
    const parsed = PreviousEventSchema.parse(full({ title: 'Padova jazz festival', subcategory: 'jazz-blues' }))
    expect((parsed as { subcategory?: string }).subcategory).toBe('jazz-blues')
  })
})
