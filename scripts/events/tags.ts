// Categories and keyword rules — the ONE place that decides what an event is
// about. Adding a category = adding one entry to CATEGORIES (and to the
// CategoryId union). Order is priority: the first matching category becomes
// the primary `category` unless the source already decided one.
//
// Keyword syntax (matched against title + description + source typologies,
// all lowercased with accents stripped, so write keywords accent-free):
//   'mostra'        whole word(s) only
//   'concert*'      prefix: concerto, concerti, concertistico…
//   'board game*'   multi-word phrases are fine; spacing/punctuation is loose
import { normalize } from './text.ts'

export type CategoryId =
  | 'boardgames'
  | 'nerd'
  | 'exhibitions'
  | 'concerts'
  | 'cinema'
  | 'talks'
  | 'festivals'
  | 'other'

export interface Category {
  id: CategoryId
  label: string
  keywords: string[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'boardgames',
    label: 'Board games',
    keywords: [
      'gioco da tavolo', 'giochi da tavolo', 'gioco in scatola', 'giochi in scatola',
      'giochi di societa', 'boardgame*', 'board game*', 'tabletop', 'ludoteca', 'ludoteche',
      'gioco di ruolo', 'giochi di ruolo', 'serata giochi', 'serate giochi',
      'pomeriggio di giochi', 'wargame*', 'larp', 'brettspiel*', 'gesellschaftsspiel*',
    ],
  },
  {
    id: 'nerd',
    label: 'Comics & games',
    keywords: [
      'fumett*', 'comic*', 'cosplay*', 'videogioc*', 'videogame*', 'gdr', 'manga',
      'fantascienza', 'fantasy', 'sci fi', 'retrogaming', 'esport*', 'e sport*', 'nerd*',
      'geek*', 'lan party', 'larp',
    ],
  },
  {
    id: 'exhibitions',
    label: 'Exhibitions',
    keywords: [
      'mostra', 'mostre', 'esposizion*', 'museo', 'musei', 'exhibition*', 'vernissage',
      'ausstellung*', 'museum', 'galleria civica', 'installazione',
    ],
  },
  {
    id: 'concerts',
    label: 'Concerts & music',
    keywords: [
      'concert*', 'live', 'musica', 'musical*', 'dj set', 'jazz', 'orchestra', 'coro',
      'recital', 'opera lirica', 'konzert*', 'musik*',
    ],
  },
  {
    id: 'cinema',
    label: 'Cinema',
    keywords: [
      'cinema', 'film', 'proiezion*', 'cineforum', 'documentario', 'screening', 'kino*',
      'filmvorfuhrung*',
    ],
  },
  {
    id: 'talks',
    label: 'Talks',
    keywords: [
      'conferenz*', 'incontro', 'incontri', 'presentazione', 'presentazioni', 'talk',
      'dibattito', 'seminari*', 'convegno', 'lectio', 'tavola rotonda', 'vortrag*', 'lesung*',
    ],
  },
  {
    id: 'festivals',
    label: 'Festivals & food',
    keywords: [
      'sagra', 'sagre', 'festa', 'feste', 'festival*', 'mercato', 'mercati', 'mercatin*',
      'fiera', 'fiere', 'degustazion*', 'enogastronom*', 'street food', 'fest', 'markt*',
    ],
  },
  { id: 'other', label: 'Other', keywords: [] },
]

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function compile(keyword: string): RegExp {
  const prefix = keyword.endsWith('*')
  const words = normalize(prefix ? keyword.slice(0, -1) : keyword).split(' ').map(escape)
  // Input is normalised (single spaces between words), so ' ' is the boundary.
  return new RegExp(`(?:^| )${words.join(' ')}${prefix ? '' : '(?= |$)'}`)
}

const RULES = CATEGORIES.map((c) => ({ id: c.id, patterns: c.keywords.map(compile) }))

/** All categories whose keywords appear in the text, in priority order. */
export function matchCategories(...texts: (string | null | undefined)[]): CategoryId[] {
  const hay = normalize(texts.filter(Boolean).join(' \n '))
  return RULES.filter((r) => r.patterns.some((p) => p.test(hay))).map((r) => r.id)
}

/**
 * Primary category: the source's own hint, else the adapter default (unless
 * 'other'), else the first keyword match, else 'other'. Tags = every match
 * plus the primary.
 */
export function classify(
  hint: CategoryId | undefined,
  sourceDefault: CategoryId,
  texts: (string | null | undefined)[],
): { category: CategoryId; tags: CategoryId[] } {
  const matches = matchCategories(...texts)
  const category = hint ?? (sourceDefault !== 'other' ? sourceDefault : matches[0] ?? 'other')
  return { category, tags: sortTags([...new Set([category, ...matches])].filter((t) => t !== 'other' || category === 'other')) }
}

const ORDER = new Map(CATEGORIES.map((c, i) => [c.id, i]))

export function sortTags(tags: CategoryId[]): CategoryId[] {
  return [...new Set(tags)].sort((a, b) => (ORDER.get(a) ?? 99) - (ORDER.get(b) ?? 99))
}
