// Categories and keyword rules — the ONE place that decides what an event is
// about. Adding a category = adding one entry to CATEGORIES (and to the
// CategoryId union). Order is priority: the first category matching the
// TITLE becomes the primary `category` (else the first matching the whole
// text), unless the source already decided one.
//
// `weak` keywords count only when one of the category's `context` keywords
// is also in the text ("pittura" + "laboratorio" is creative; "pittura" in an
// exhibition blurb is not).
//
// The `kids` tag (children's and family events) is not a category: see KIDS
// below. A kids event never gets `creative`.
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
  | 'creative'
  | 'theatre'
  | 'exhibitions'
  | 'concerts'
  | 'cinema'
  | 'talks'
  | 'festivals'
  | 'other'

/**
 * A tag that is not a category: `kids` marks children's and family events
 * (see KIDS below). Consumers that don't know it ignore it.
 */
export type TagId = CategoryId | 'kids'

export interface Category {
  id: CategoryId
  label: string
  keywords: string[]
  /** Match only together with one of `context`. */
  weak?: string[]
  context?: string[]
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
      'fumett*', 'comic', 'comics', 'cosplay*', 'videogioc*', 'videogame*', 'gdr', 'manga',
      'fantascienza', 'fantasy', 'sci fi', 'retrogaming', 'esport*', 'e sport*', 'nerd*',
      'geek*', 'lan party', 'larp',
    ],
  },
  {
    // Hands-on making for adults. Kept precise: a bare "laboratorio" is not
    // enough (science and children's labs are everywhere), it needs a craft.
    id: 'creative',
    label: 'Creative',
    keywords: [
      'workshop creativ*', 'workshop fotografic*', 'tornio', 'raku',
      'cucito', 'sartoria', 'lavoro a maglia', 'lavori a maglia', 'uncinetto', 'ricamo',
      'tessitura', 'scrittura creativa', 'calligrafi*', 'legatoria', 'origami',
      'riciclo creativo', 'fai da te', 'fatto da te', 'fablab', 'fab lab', 'maker faire',
      'laboratorio creativo', 'laboratori creativi', 'laboratorio artistico', 'laboratori artistici',
      'aperitivo su tela', 'laboratorio d arte', 'laboratori d arte', 'disegno dal vero', 'passeggiata fotografica', 'passeggiate fotografiche',
      'malkurs*', 'zeichenkurs*', 'topferkurs*', 'keramikkurs*', 'kreativwerkstatt*',
      // "<activity> di <craft>": the specific pairs, not every "corso di…".
      ...['corso', 'corsi', 'laboratorio', 'laboratori', 'workshop'].flatMap((a) =>
        ['ceramica', 'disegno', 'pittura', 'acquerello', 'fotografia', 'scrittura', 'illustrazione',
          'incisione', 'serigrafia', 'cucito', 'maglia', 'ricamo', 'scultura', 'modellazione',
          'falegnameria', 'stampa', 'collage', 'calligrafia', 'legatoria', 'tessitura', 'argilla',
          'recitazione', 'fumetto', 'arte'].map((c) => `${a} di ${c}`)),
    ],
    weak: [
      'ceramic*', 'argilla', 'pittura', 'acquerell*', 'disegno', 'illustrazion*',
      'incision*', 'serigrafi*', 'stampa d arte', 'xilografi*', 'linoleum', 'fotografi*',
      'collage', 'modellazione', 'scultura', 'falegnameria', 'maglia', 'keramik*', 'topfer*',
      'handwerk*', 'malen', 'zeichnen',
    ],
    context: [
      'laborator*', 'corso', 'corsi', 'lezione', 'lezioni', 'workshop*', 'impara*',
      'iscrizion*', 'partecipanti', 'materiali forniti', 'materiale fornito', 'hands on',
      'kurs*', 'werkstatt*', 'mitmach*',
    ],
  },
  {
    // Staged performance. Opera is here, not under concerts: it is staged and
    // sits in the theatre seasons. A bare "teatro" is usually just the venue
    // of a concert or talk, so it needs a stage word next to it.
    id: 'theatre',
    label: 'Theatre',
    keywords: [
      'teatral*', 'prosa', 'commedia', 'commedie', 'tragedia', 'monologo', 'drammaturgi*',
      'danza', 'balletto', 'opera lirica', 'cabaret', 'stand up', 'standup', 'reading',
      'filodrammatic*', 'in scena', 'teatro ragazzi', 'teatro dialettale', 'teatro di prosa',
      'teatro danza', 'teatro comico', 'schauspiel*', 'kabarett*', 'theaterstuck*', 'tanztheater*',
    ],
    weak: ['teatro', 'teatri', 'theater*', 'tanz*'],
    context: [
      'spettacol*', 'regia', 'attor*', 'attric*', 'compagnia', 'sipario', 'palcoscenico',
      'stagione', 'auffuhrung*', 'buhne*', 'inszenierung*',
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
      'recital', 'konzert*', 'musik*', 'pianistic*', 'pianoforte', 'quartetto', 'violin*',
      'violoncell*', 'sinfoni*', 'cantautor*', 'band',
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

const RULES = CATEGORIES.map((c) => ({
  id: c.id,
  patterns: c.keywords.map(compile),
  weak: (c.weak ?? []).map(compile),
  context: (c.context ?? []).map(compile),
}))

function hayOf(texts: (string | null | undefined)[]): string {
  return normalize(texts.filter(Boolean).join(' \n '))
}

/**
 * Strong keywords count anywhere; weak + context only in `short` (title,
 * summary, typologies): a long description mentions photos, drawings and
 * "iscrizione" far too often.
 */
function matchHay(short: string, long: string, context = short): CategoryId[] {
  return RULES.filter(
    (r) =>
      r.patterns.some((p) => p.test(long)) ||
      (r.weak.some((p) => p.test(short)) && r.context.some((p) => p.test(context))),
  ).map((r) => r.id)
}

/** All categories whose keywords appear in the text, in priority order. */
export function matchCategories(...texts: (string | null | undefined)[]): CategoryId[] {
  const hay = hayOf(texts)
  return matchHay(hay, hay)
}

// --- Kids -------------------------------------------------------------------------
//
// Conservative on purpose: the dashboard HIDES kids events, so an adult event
// wrongly tagged disappears. Signals, in order:
// - KIDS_TITLE words or a child age range in the title / the source's own
//   typology (tagText);
// - KIDS_TEXT phrases in the FIRST sentence of the summary ("Letture per
//   bambine e bambini…"), or a child age range anywhere in the summary;
// - the long description never makes an event kids (seasons and festivals
//   mention their one children's show there), it can only veto.
// Any ADULTS phrase ("adulti e bambini", "per adulti") vetoes.

// Deliberately absent (adult false positives seen or likely): "infanzia"
// ("Ricordi d'infanzia"), "favola" ("La favola mia"), "minori" (Frati
// minori), "colonia" (Köln), "baby", "junior", bare "piccoli", "halloween",
// bare "scuole" ("Scuole d'italiano per stranieri"), bare "family" /
// "Familie" (Bolzano's German/English titles: "the oldest winemaking family").
const KIDS_TITLE = [
  'bambin*', 'bimb*', 'per ragazzi', 'teatro ragazzi', 'teatro per ragazzi', 'famiglie', 'per famiglie',
  'in famiglia', 'family day', 'family friendly', 'for families', 'agrifamily', 'kids',
  'per i piccoli', 'piccoli lettori', 'piccole mani',
  'genitori e figli', 'mamma e papa', 'letture animate', 'lettura animata', 'nati per leggere',
  'nati per la musica', 'fiaba', 'fiabe', 'burattin*', 'marionett*', 'scuola dell infanzia',
  'scuole dell infanzia', 'scuola primaria', 'scuole primarie', 'per le scuole', 'per la scuola',
  'la scuola va a teatro', 'scuole famiglie',
  'neonat*', 'kinder*', 'familienfuhrung*', 'familientag*', 'familiennachmittag*', 'fur familien',
  'centro estivo', 'centri estivi', 'doposcuola',
]
const KIDS_TEXT = [
  'per bambini', 'per i bambini', 'per le bambine', 'dedicato ai bambini', 'dedicata ai bambini',
  'dedicati ai bambini', 'rivolto ai bambini', 'rivolta ai bambini', 'rivolto a bambini',
  'rivolta a bambini', 'rivolti ai bambini', 'bambini e bambine', 'bambine e bambini',
  'bambini dai', 'bambini dagli', 'bambini tra', 'bambini di eta', 'bambini accompagnati',
  'per famiglie con bambini', 'famiglie con bambini', 'letture animate', 'lettura animata',
  'nati per leggere', 'teatro ragazzi', 'scuola dell infanzia', 'scuola primaria',
  'la scuola va a teatro', 'per le scuole',
  'fur kinder', 'kinder von', 'kinder ab', 'fur familien',
]
/** "Adults too" markers: a field with one of these never counts as kids. */
// Phrases, not a bare "adulti": "biglietto adulti 8 €, bambini 5 €" is a
// children's show. In the title a bare "adulti" does count ("Riciclo creativo
// adulti"). "Per tutti" / "grandi e piccini" are family events: no veto.
const ADULTS = [
  'per adulti', 'agli adulti', 'adulti e bambini', 'adulti e ragazzi', 'bambini e adulti',
  'ragazzi e adulti', 'pubblico adulto', 'anche adulti', 'over 18', 'maggiorenni', 'erwachsene*',
]
// "… | Replica serale aperta al pubblico" of a school matinée is for everyone.
const ADULTS_HEAD = [...ADULTS, 'adulti', 'adulto', 'aperta al pubblico', 'aperto al pubblico']
const KIDS_TITLE_RE = KIDS_TITLE.map(compile)
const KIDS_TEXT_RE = KIDS_TEXT.map(compile)
const ADULTS_RE = ADULTS.map(compile)
const ADULTS_HEAD_RE = ADULTS_HEAD.map(compile)
// "6-10 anni", "dai 3 ai 6 anni", "tra i 4 e gli 8 anni", "eta 0 6" (normalised: no punctuation).
// Not "da 10 anni" (= "for 10 years") nor "5-10 anni fa" (= "years ago").
const AGE_RANGE = /(?:^| )(\d{1,2}) (?:a |ai |agli |e |e gli |e i )?(\d{1,2}) ann[io](?! fa(?: |$))(?= |$)/g
const AGE_FROM = /(?:^| )(?:dai|dagli) (\d{1,2}) ann[io](?! di )(?= |$)/g
const UNDER = /(?:^| )(?:under (\d{1,2})|(?:fino a|fino ai|sotto i) (\d{1,2}) ann[io])(?= |$)/g

function childAges(hay: string): boolean {
  for (const m of hay.matchAll(AGE_RANGE)) {
    const lo = Number(m[1])
    const hi = Number(m[2])
    if (lo < hi && hi <= 14) return true
  }
  for (const m of hay.matchAll(AGE_FROM)) if (Number(m[1]) <= 10) return true
  for (const m of hay.matchAll(UNDER)) if (Number(m[1] ?? m[2]) <= 14) return true
  return false
}

/**
 * Is this a children's / family event? Title + typologies, then the summary.
 * The long description is only used to veto ("… anche per adulti"): seasons
 * and festivals describe their one children's show there, which must not hide
 * the whole season.
 */
export function isKids(
  title: string,
  tagText: string | null | undefined,
  summary: string | null | undefined,
  description?: string | null,
): boolean {
  const head = hayOf([title, tagText])
  const headAdults = ADULTS_HEAD_RE.some((p) => p.test(head))
  if (!headAdults && (KIDS_TITLE_RE.some((p) => p.test(head)) || childAges(head))) return true
  const short = hayOf([summary])
  if (headAdults || ADULTS_RE.some((p) => p.test(short)) || ADULTS_RE.some((p) => p.test(hayOf([description])))) return false
  // Phrases only in the first sentence ("Letture per bambine e bambini…"); a
  // later "…e intrattenimento per bambini" is a village fair, not a kids event.
  const lead = hayOf([summary?.split(/[.!?](?:\s|$)/)[0]])
  return KIDS_TEXT_RE.some((p) => p.test(lead)) || childAges(short)
}

/**
 * Primary category: the source's own hint, else the adapter default (unless
 * 'other'), else the first category matching the title, else the first
 * matching the whole text, else 'other'. Tags = every match plus the primary,
 * plus `kids`. A kids event never has `creative`.
 */
export function classify(
  hint: CategoryId | undefined,
  sourceDefault: CategoryId,
  text: { title: string; summary?: string | null; description?: string | null; tagText?: string | null },
): { category: CategoryId; tags: TagId[] } {
  const kids = isKids(text.title, text.tagText, text.summary, text.description)
  const allowed = (c: CategoryId) => !(kids && c === 'creative')
  const title = hayOf([text.title])
  const typed = hayOf([text.title, text.tagText])
  const short = hayOf([text.title, text.summary, text.tagText])
  const long = hayOf([text.title, text.summary, text.description, text.tagText])
  // Tiers: the title alone, then title + the source's typologies/topics (broad
  // topics like "Arte, creatività e musica" must not beat the title), then
  // title + summary, then everything — a long description name-drops ballets,
  // readings and theatres in passing. A weak keyword's context may come from
  // the summary in every tier ("Storie di ceramica" + "un workshop…").
  const tiers = [matchHay(title, title, short), matchHay(typed, typed, short), matchHay(short, short), matchHay(short, long)]
  const matches = (tiers[3] ?? []).filter(allowed)
  const own = hint ?? (sourceDefault !== 'other' ? sourceDefault : undefined)
  const category = (own && allowed(own) ? own : undefined) ?? tiers.map((t) => t.filter(allowed)[0]).find(Boolean) ?? 'other'
  return { category, tags: finishTags(category, matches, kids) }
}

/** Primary + matches (+ kids) in priority order; `other` only when it is the primary. */
export function finishTags(category: CategoryId, tags: TagId[], kids: boolean): TagId[] {
  const all = sortTags([category, ...tags, ...(kids ? (['kids'] as TagId[]) : [])])
  return all.filter((t) => (t !== 'other' || category === 'other') && !(kids && t === 'creative'))
}

const ORDER = new Map<TagId, number>(CATEGORIES.map((c, i) => [c.id, i]))

export function sortTags(tags: TagId[]): TagId[] {
  return [...new Set(tags)].sort((a, b) => (ORDER.get(a) ?? 99) - (ORDER.get(b) ?? 99))
}
