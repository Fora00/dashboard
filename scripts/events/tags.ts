// Categories and keyword rules — the ONE place that decides what an event is
// about (and, in DROP RULES below, which events are not published at all). Adding a category = adding one entry to CATEGORIES (and to the
// CategoryId union). Order is priority: the first category matching the
// TITLE becomes the primary `category` (else the first matching the whole
// text), unless the source already decided one.
//
// `weak` keywords count only when one of the category's `context` keywords
// is also in the text ("pittura" + "laboratorio" is creative; "pittura" in an
// exhibition blurb is not).
//
// The `kids` tag (children's and family events) is not a category: see KIDS
// below. A kids event never gets `creative`. Neither are the format tags
// `social-friend`, `social-girl` and `solo-ok`: see FORMAT TAGS below.
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
  | 'food'
  | 'tours'
  | 'outdoor'
  | 'festivals'
  | 'other'

/**
 * Tags that are not categories: `kids` marks children's and family events
 * (see KIDS below); `social-friend`, `social-girl` and `solo-ok` describe an
 * event's format (see FORMAT TAGS below). Consumers that don't know them ignore them.
 */
export type FormatTagId = 'social-friend' | 'social-girl' | 'solo-ok'
/** Not a category: events about topics next to the owner's core interests (see ADJACENT). */
export type TagId = CategoryId | 'kids' | FormatTagId | 'adjacent'

export interface Category {
  id: CategoryId
  label: string
  keywords: string[]
  /** Match only together with one of `context`. */
  weak?: string[]
  context?: string[]
  /**
   * Keywords count only in the title, summary and typologies, never in the
   * long description (which name-drops "fantasy" pieces and "fumetti").
   */
  shortOnly?: boolean
  /** Patterns tested on the raw title (punctuation intact); a hit counts like a keyword. */
  titlePatterns?: RegExp[]
  /**
   * Source typology labels (a whole item of `tagText`, normalised) that count
   * like a keyword from the typology tier on, although the same word is only
   * weak in running text.
   */
  typologies?: string[]
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
      // Game nights that are not board games proper but share the crowd.
      'scacchi', 'burraco', 'pubquiz', 'pub quiz', 'quiz night', 'escape room',
    ],
  },
  {
    id: 'nerd',
    label: 'Comics & games',
    // Not 'esport*' / 'e sport*': "esportazione", "cultura e sport".
    keywords: [
      'fumett*', 'comic', 'comics', 'cosplay*', 'videogioc*', 'videogame*', 'gdr', 'manga',
      'fantascienza', 'fantasy', 'sci fi', 'retrogaming', 'esport', 'esports', 'e sports', 'nerd*',
      'geek*', 'lan party', 'larp',
    ],
    shortOnly: true,
  },
  {
    // Hands-on making for adults. Kept precise: a bare "laboratorio" is not
    // enough (science and children's labs are everywhere), it needs a craft.
    id: 'creative',
    label: 'Creative',
    keywords: [
      'workshop creativ*', 'workshop fotografic*', 'tornio', 'raku',
      'cucito', 'lavoro a maglia', 'lavori a maglia', 'uncinetto', 'ricamo',
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
      // A playbill credits "Costumi — La Sartoria": only with an activity word.
      'sartoria',
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
      // Opera: its own words, so "Opera in tre atti / Musica di Verdi" is not a concert.
      'lirica', 'melodramma', 'operetta', 'libretto', 'opera buffa', 'opera seria', 'stagione lirica',
      'stagione d opera', 'progetto opera', 'opera in un atto',
      ...['due', 'tre', 'quattro', 'cinque', '2', '3', '4', '5'].map((n) => `opera in ${n} atti`),
      'filodrammatic*', 'in scena', 'teatro ragazzi', 'teatro dialettale', 'teatro di prosa',
      'teatro danza', 'teatro comico', 'schauspiel*', 'kabarett*', 'theaterstuck*', 'tanztheater*',
      'improtheater*', 'improvvisazione teatrale', 'personaggi e interpreti', 'carambolage',
      // Magic and circus shows (not a bare "magia": "La magia del Natale").
      'gala della magia', 'spettacolo di magia', 'spettacoli di magia', 'illusionist*', 'prestigiator*',
      'circo', 'circense', 'circensi', 'zirkus*',
    ],
    // "Teatro: La Tempesta", "Teatro - Lungs / Polmoni" (the raw title).
    titlePatterns: [/^\s*(?:teatro|theater)\s*(?::|\s[-–—]\s)/i],
    // A source typology that is exactly "Teatro" (Trentino Cultura) is a play.
    typologies: ['teatro', 'teatri', 'theater', 'teatro e danza', 'prosa'],
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
      'jazz*', 'blues', 'symphon*', 'orchester*', 'candlelight', 'trio', 'quartet', 'quartett*',
      'quintet', 'quintett*', 'sestetto', 'klezmer*', 'meranoklezmer', 'brass*', 'bigband*', 'big band',
      'songs', 'canzoni', 'dj', 'music', 'organo',
      // Tour announcements and festival names whose title carries no music word.
      'tour 2026', 'tour 2027', 'tour d addio', 'saxfest', 'alpen classica',
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
    // Food and wine as the point of the event: tastings, cooking classes,
    // wine and Speck walks, Törggelen, and the seasonal food festivals
    // (sagre, chestnuts, pumpkins, apples…). Before `festivals`, so "Festa
    // del marrone" is food with a `festivals` tag; a village "Festa di San
    // Rocco" stays `festivals`. Before `tours`: "SpeckSafari – visita
    // guidata per buongustai" is food.
    id: 'food',
    label: 'Cibo e vino',
    keywords: [
      'degustazion*', 'enogastronom*', 'wine tasting*', 'tasting', 'verkostung*', 'weinverkostung*',
      'weinprobe*', 'sommelier*', 'abc del vino', 'abbici del vino', 'vino', 'vini', 'wine',
      'wein*', 'winefestival', 'kellerei*', 'kellerfuhrung*', 'tenuta', 'vinothek', 'enoteca',
      'cantine aperte', 'vigneto', 'vigneti', 'vendemmia', 'rebe', 'grappa',
      'birra', 'birre', 'bier*', 'craft beer',
      'scuola di cucina', 'corso di cucina', 'corsi di cucina', 'cooking*', 'showcooking',
      'kochkurs*', 'kochen', 'gourmet', 'gastronomi*', 'culinari*', 'kulinari*', 'food', 'slow food',
      'brunch', 'speck*', 'torggelen', 'sagra', 'sagre', 'castagnat*', 'caldarroste', 'keschtn*',
      'kesten*',
      // Apples only as the feast: "e-MTB sull'Altopiano delle mele" is a ride.
      'festa della mela', 'festa delle mele', 'sagra della mela', 'giornata della mela', 'apfelfest*',
      'apfeltag*', 'olio extravergine', 'olio evo',
    ],
    // Products, dishes and meals only with a food-event word: "Festa del
    // marrone" is food, "Il Poliziotto del Formaggio" and "Una cena d'addio"
    // are plays, "in questa cucina…" is a play's summary.
    weak: [
      'castagn*', 'marrone', 'marroni', 'zucca', 'zucche', 'polenta', 'funghi', 'formaggi*', 'formaggio',
      'miele', 'tartufo', 'tartufi', 'asparag*', 'radicchio', 'cioccolat*', 'knodel*', 'canederli',
      'cucina', 'sapori', 'cena', 'cene', 'cenone', 'apericena',
    ],
    context: [
      'festa', 'feste', 'sagra', 'sagre', 'fest', 'festival*', 'fiera', 'fiere', 'mercat*', 'degustazion*',
      'assaggi*', 'gusto', 'prodotti', 'prodotto', 'tipic*', 'menu', 'piatti', 'piatto', 'dop', 'igp',
      'enogastronom*', 'gastronom*', 'chef', 'ricett*', 'cuoco', 'cuochi', 'kochen', 'genuss*',
      'caldarroste', 'bancarelle', 'stand', 'vino', 'vini', 'wine', 'wein*', 'cucina', 'sapori',
    ],
    shortOnly: true,
  },
  {
    // Guided tours, city walks, underground and heritage openings (FAI).
    // A castle, church or tower counts only with a visit word next to it.
    id: 'tours',
    label: 'Visite',
    keywords: [
      'visita guidata', 'visite guidate', 'visita classica', 'visite classiche', 'visita serale',
      'visite serali', 'visita notturna', 'visite notturne', 'visita al', 'visita alla', 'visita ai',
      'visite al', 'visite alla', 'tour guidato', 'tour guidati', 'guided tour*', 'walking tour*',
      'city tour', 'tour della citta', 'tour classico', 'tour serale', 'tour delle mura',
      'percorso guidato', 'percorsi guidati', 'fuhrung', 'fuhrungen', 'stadtfuhrung*', 'burgfuhrung*',
      'schlossfuhrung*', 'domfuhrung*', 'nachtfuhrung*', 'abendfuhrung*', 'themenfuhrung*',
      'sonderfuhrung*', 'erlebnisfuhrung*', 'museumsfuhrung*', 'kirchenfuhrung*', 'besichtigung*',
      'stadtrundgang*', 'apertura straordinaria', 'aperture straordinarie', 'giornate fai',
      'giornata fai', 'fai autunno', 'fai d autunno', 'giornata del patrimonio',
      'giornate del patrimonio', 'giornate europee del patrimonio', 'sotterranea', 'sotterranei',
      'sotterraneo', 'underground tour*', 'trekking urbano', 'centro storico', 'passeggiat*', 'alla scoperta del',
      'alla scoperta della', 'alla scoperta dei', 'alla scoperta delle', 'alla scoperta di',
    ],
    weak: [
      'castello', 'castelli', 'castel', 'rocca', 'forte', 'forti', 'chiesa', 'chiese', 'abbazia',
      'chiostro', 'monastero', 'convento', 'santuario', 'eremo', 'duomo', 'cattedrale', 'basilica',
      'torre', 'mura', 'villa', 'palazzo', 'hofburg', 'schloss', 'burg', 'area archeologica',
      'sito archeologico', 'scavi',
    ],
    context: [
      'visit*', 'tour', 'apertura', 'aperture', 'scopri*', 'scoperta', 'raccont*', 'percorso',
      'ingresso', 'guida', 'besichtigung*',
    ],
    shortOnly: true,
  },
  {
    // Outdoor activities you take part in: hikes, e-MTB tours, via ferrata,
    // walking groups, social runs, joinable sailing. Spectator sport (matches,
    // championships, races) is dropped at crawl time, see DROP RULES.
    id: 'outdoor',
    label: 'Outdoor',
    keywords: [
      'escursion*', 'trekking', 'hike', 'hiking', 'hike fly', 'wanderung*', 'wandern', 'wandert',
      'wandertag*', 'camminata', 'camminate', 'cammina', 'gruppo di cammino', 'gruppi di cammino',
      'nordic walking', 'ciaspolat*', 'schneeschuh*', 'e mtb', 'emtb', 'mtb', 'mountain bike*',
      'mountainbike*', 'e bike', 'ebike*', 'bike', 'bike tour*', 'biciclettat*', 'pedalat*',
      'cicloturis*', 'gravel', 'city ride', 'via ferrata', 'vie ferrate', 'ferrata', 'klettersteig*',
      'arrampicata', 'climbing', 'boulder*', 'kletter*', 'trail', 'trail run*', 'trailrunning',
      'social run', 'corsa di gruppo', 'run club', 'running', 'corsa non competitiva', 'parapendio',
      'paragliding', 'kayak', 'canoa', 'rafting', 'canyoning', 'veleggiata', 'regata aperta',
      // Not a bare "ride" (Italian "ride e spaventa tutti") nor "sentieri" ("I sentieri della pioggia", an exhibition).
      'bike ride', 'urban ride', 'urban life ride', 'taste ride', 'gravel ride', 'social park', 'muoviti',
    ],
    shortOnly: true,
  },
  {
    id: 'festivals',
    label: 'Festivals & food',
    keywords: [
      'sagra', 'sagre', 'festa', 'feste', 'festival*', 'mercato', 'mercati', 'mercatin*',
      'fiera', 'fiere', 'enogastronom*', 'street food', 'fest', 'markt*', 'market', 'lunapark',
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
  shortOnly: c.shortOnly ?? false,
  titlePatterns: c.titlePatterns ?? [],
  typologies: new Set((c.typologies ?? []).map(normalize)),
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
function matchHay(short: string, long: string, context = short, rawTitle = '', typos: string[] = []): CategoryId[] {
  return RULES.filter(
    (r) =>
      r.titlePatterns.some((p) => p.test(rawTitle)) ||
      typos.some((t) => r.typologies.has(t)) ||
      r.patterns.some((p) => p.test(r.shortOnly ? short : long)) ||
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
  'per i piccoli', 'piccoli lettori', 'piccole mani', 'festival dei piccoli',
  'genitori e figli', 'mamma e papa', 'letture animate', 'lettura animata', 'nati per leggere',
  'nati per la musica', 'fiaba', 'fiabe', 'burattin*', 'marionett*', 'scuola dell infanzia',
  'scuole dell infanzia', 'scuola primaria', 'scuole primarie', 'per le scuole', 'per la scuola',
  'la scuola va a teatro', 'scuole famiglie',
  'neonat*', 'kinder*', 'familienfuhrung*', 'familientag*', 'familiennachmittag*', 'fur familien',
  'centro estivo', 'centri estivi', 'doposcuola',
  // Specific titles seen as children's programmes (2026-09-30).
  'halloween al castello', 'vento delle favole',
]
const KIDS_TEXT = [
  'per bambini', 'per i bambini', 'per le bambine', 'dedicato ai bambini', 'dedicata ai bambini',
  'dedicati ai bambini', 'rivolto ai bambini', 'rivolta ai bambini', 'rivolto a bambini',
  'rivolta a bambini', 'rivolti ai bambini', 'bambini e bambine', 'bambine e bambini',
  'bambini dai', 'bambini dagli', 'bambini tra', 'bambini di eta', 'bambini accompagnati',
  'per famiglie con bambini', 'famiglie con bambini', 'letture animate', 'lettura animata',
  'nati per leggere', 'teatro ragazzi', 'scuola dell infanzia', 'scuola primaria',
  'la scuola va a teatro', 'per le scuole', 'invita i bambini', 'invita bambine e bambini',
  'invita bambini e bambine', 'invita le bambine e i bambini',
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

// --- Format tags --------------------------------------------------------------------
//
// What you DO at an event, as a proxy for how easy it is to meet people or to
// go alone. Format only: nothing here knows or claims who attends. Never on a
// kids event. Same tiering as the categories, stricter: keywords match the
// title + typologies (`head`) or the summary; the long description can only
// veto (it lists the dinner after the talk, the family version of the tour…).
//
// - `social-friend` ("Nuovi amici"): formats where regulars form groups and
//   talk — open-table game nights, tournaments, quizzes, group hikes and
//   rides, climbing and running meetups, jam sessions and open mics,
//   volunteering and repair cafés, workshops and courses.
// - `social-girl`: conversation-friendly formats (the owner's second social
//   chip; a format proxy like the others), from the most precise: speed
//   dating / singles evenings, social dance, yoga and body-mind practice,
//   art and creative workshops, book clubs, language cafés, wine tastings
//   and aperitivi.
// - `solo-ok` ("Da solo va bene"): formats where coming alone is normal —
//   talks, exhibitions, cinema, concerts, workshops, open game nights, guided
//   tours, readings, the social formats above — minus dinners, table bookings,
//   couples/family formats and group-only or private events. Theatre and
//   festivals/fairs are not in the base set (people mostly go in company),
//   except readings, stand-up and open mics.

const SOCIAL_FRIEND = [
  // Games and quizzes (the boardgames category counts as a whole).
  'torneo', 'tornei', 'turnier*', 'tournament*', 'quiz', 'pubquiz', 'pub quiz', 'quiz night',
  'serata giochi', 'serate giochi', 'tavoli aperti', 'spieleabend*',
  // Group outings and sport meetups.
  'escursion*', 'trekking', 'hike', 'hiking', 'wanderung*', 'camminata', 'camminate',
  'gruppo di cammino', 'gruppi di cammino', 'nordic walking', 'ciaspolat*', 'biciclettat*',
  'pedalat*', 'gita', 'gite', 'uscita di gruppo', 'uscite di gruppo', 'social run', 'corsa di gruppo',
  'run club', 'running club', 'arrampicata', 'boulder*', 'climbing', 'kletter*',
  // Playing together.
  'jam session*', 'jam', 'open mic', 'microfono aperto', 'palco aperto', 'open stage',
  'coro aperto', 'canto corale aperto',
  // Volunteering: phrases, not a bare "volontariato" (who runs the market, a talk about it).
  'diventa volontario', 'diventa volontaria', 'cerchiamo volontari', 'clean up', 'cleanup', 'plogging',
  'repair cafe', 'flicktreff*', 'giornata del volontariato', 'giornata di volontariato',
  'gruppo di lettura', 'gruppi di lettura',
]
// Workshops and courses: title/typology only (an exhibition blurb mentions
// its side labs). Every "corso di …", not a bare "corso" ("mostra in corso").
const SOCIAL_FRIEND_HEAD = [
  'workshop*', 'laborator*', 'corso di', 'corsi di', 'corso base', 'corso pratico', 'corso intensivo',
  'lezione aperta', 'lezioni aperte', 'lezione di prova', 'kurs', 'kurse', 'werkstatt*',
]

// Grouped from the most precise format down (speed dating first).
const SOCIAL_GIRL = [
  // Speed dating / singles.
  'speed dat*', 'speeddating', 'per single', 'per singles', 'serata single', 'serate single',
  'single party', 'singles party', 'single night', 'aperitivo single', 'singleparty', 'singleborse*',
  // Social dance.
  'swing', 'lindy hop', 'lindy', 'balboa', 'salsa', 'bachata', 'kizomba', 'merengue', 'tango argentino',
  'milonga', 'balfolk', 'bal folk', 'balli popolari', 'balli di gruppo', 'ballo liscio', 'balli latino*',
  'ballo latino*', 'serata danzante', 'serate danzanti', 'social dance', 'contact jam',
  'contact improvisation', 'tanzabend*', 'tanzfest*', 'tanzkurs*', 'tanzcafe',
  // Book clubs.
  'gruppo di lettura', 'gruppi di lettura', 'club del libro', 'book club', 'circolo di lettura',
  'circolo dei lettori', 'lettura condivisa', 'letture condivise', 'leggiamo insieme', 'lesekreis*',
  'literaturkreis*',
  // Language cafés.
  'language cafe', 'language exchange', 'tandem linguistico', 'caffe linguistico', 'aperitivo linguistico',
  'conversazione in inglese', 'conversazione in tedesco', 'conversazione in francese',
  'conversazione in spagnolo', 'conversazione in lingua', 'english conversation', 'sprachcafe',
  'sprachtreff*', 'sprachstammtisch', 'bla bla',
]
// Title/typology only: a blurb says "Ero a fare l'aperitivo…" or "la strada
// verso la meditazione" in passing.
const SOCIAL_GIRL_HEAD = [
  // Yoga and body-mind practice.
  'yoga', 'pilates', 'meditazione', 'meditazioni', 'meditation', 'mindfulness', 'tai chi', 'qi gong',
  'qigong', 'taijiquan', 'biodanza', 'rio abierto', 'cinque ritmi', 'feldenkrais', 'sound bath',
  'bagno sonoro', 'bagno di gong', 'campane tibetane', 'forest bathing', 'bagno di foresta',
  // Wine tastings and aperitivi.
  'degustazion*', 'wine tasting', 'tasting', 'wine', 'verkostung*', 'weinverkostung*', 'weinprobe*',
  'aperitivo', 'aperitivi', 'aperitif', 'happy hour', 'calici',
  // Wine courses ("ABC del vino", "L'abbicì del vino").
  'abc del vino', 'abbici del vino', 'corso di degustazione', 'corsi di degustazione',
  'corso sommelier', 'corso per sommelier', 'weinseminar*', 'weinkurs*',
  // Breath / art-perception practices ("Respirare l'arte").
  'respirare*', 'respirazione', 'pratica di respiro', 'atemkurs*',
]
/** A social format that is really a job or a lecture series is not social. */
const SOCIAL_VETO = [
  'sicurezza sul lavoro', 'aggiornamento professionale', 'corso di aggiornamento', 'per professionisti',
  'per operatori', 'per docenti', 'per insegnanti', 'formazione obbligatoria', 'ecm', 'convegno',
  'per le scuole', 'per la scuola',
]

const SHOWS: CategoryId[] = ['theatre', 'cinema', 'concerts', 'exhibitions']
const SOLO_CATEGORIES: CategoryId[] = ['talks', 'exhibitions', 'cinema', 'concerts', 'creative', 'boardgames']
const SOLO_FORMATS = [
  'visita guidata', 'visite guidate', 'guided tour*', 'fuhrung', 'fuhrungen', 'stadtfuhrung*',
  'tour guidato', 'lettura', 'letture', 'reading', 'stand up', 'standup', 'open mic', 'monologo',
]
/** Not a solo format: dinners, table bookings, couples, families, group-only, private. */
const SOLO_VETO = [
  'cena', 'cene', 'cenone', 'apericena', 'pranzo', 'pranzi', 'brunch', 'dinner', 'abendessen',
  'mittagessen', 'menu', 'prenotazione del tavolo', 'prenota il tavolo', 'prenotazione tavolo',
  'prenotazione tavoli', 'tavolo riservato', 'tavoli riservati', 'tischreservierung*',
  'per coppie', 'in coppia', 'coppie di', 'per due persone', 'per 2 persone', 'san valentino',
  'valentinstag', 'romantic*', 'famiglie', 'in famiglia', 'per la famiglia', 'tutta la famiglia',
  'family day', 'for families', 'fur familien', 'familienfuhrung*',
  'solo su invito', 'su invito', 'evento privato', 'festa privata', 'riservato ai soci',
  'riservata ai soci', 'solo soci', 'soli soci', 'solo per gruppi', 'solo gruppi',
  'riservato ai gruppi', 'per gruppi organizzati', 'nur fur gruppen', 'team building', 'a squadre',
  'addio al nubilato', 'addio al celibato',
]
/** The long description vetoes solo-ok only with unambiguous phrases. */
const SOLO_VETO_LONG = [
  'cena di gala', 'cenone', 'menu degustazione', 'evento privato', 'solo su invito',
  'riservato ai soci', 'riservata ai soci', 'per coppie', 'prenotazione del tavolo',
  'prenotazione tavolo', 'tavolo riservato', 'san valentino', 'famiglie con bambini',
]

const SOCIAL_FRIEND_RE = SOCIAL_FRIEND.map(compile)
const SOCIAL_FRIEND_HEAD_RE = SOCIAL_FRIEND_HEAD.map(compile)
const SOCIAL_GIRL_RE = SOCIAL_GIRL.map(compile)
const SOCIAL_GIRL_HEAD_RE = SOCIAL_GIRL_HEAD.map(compile)
const SOCIAL_VETO_RE = SOCIAL_VETO.map(compile)
const SOLO_FORMATS_RE = SOLO_FORMATS.map(compile)
const SOLO_VETO_RE = SOLO_VETO.map(compile)
const SOLO_VETO_LONG_RE = SOLO_VETO_LONG.map(compile)
const any = (res: RegExp[], hay: string) => res.some((p) => p.test(hay))

/**
 * Format tags of a non-kids event (none for kids). `category` is the primary
 * category, `tags` its category matches. See FORMAT TAGS above.
 */
export function formatTags(
  text: { title: string; summary?: string | null; description?: string | null; tagText?: string | null },
  category: CategoryId,
  tags: readonly TagId[],
): FormatTagId[] {
  const head = hayOf([text.title, text.tagText])
  const short = hayOf([text.title, text.summary, text.tagText])
  // "L'ultima cena" is a painting, not a dinner. The typologies don't veto:
  // an audience list "Adulti · Famiglie" is not a family-only format.
  const lastSupper = / ultima cena(?= |$)/g
  const vetoHay = ` ${hayOf([text.title, text.summary])}`.replace(lastSupper, ' ')
  const long = ` ${hayOf([text.description])}`.replace(lastSupper, ' ')
  const out: FormatTagId[] = []
  const socialOk = !any(SOCIAL_VETO_RE, short)
  // The primary category only: a `creative` tag from the full text is often
  // an exhibition of paintings.
  const games = category === 'boardgames'
  const making = category === 'creative'
  // A show's summary describes its content, not its format: title only.
  const text2 = SHOWS.includes(category) ? head : short
  if (socialOk && (games || making || any(SOCIAL_FRIEND_RE, text2) || any(SOCIAL_FRIEND_HEAD_RE, head))) out.push('social-friend')
  if (socialOk && (making || any(SOCIAL_GIRL_RE, text2) || any(SOCIAL_GIRL_HEAD_RE, head))) out.push('social-girl')
  const soloBase = SOLO_CATEGORIES.includes(category) || tags.includes('boardgames') || out.length > 0 || any(SOLO_FORMATS_RE, short)
  if (soloBase && !any(SOLO_VETO_RE, vetoHay) && !any(SOLO_VETO_LONG_RE, long)) out.push('solo-ok')
  return out
}

// --- Drop rules ---------------------------------------------------------------------
//
// Events nobody browses for, removed at crawl time (owner's decision,
// 2026-09-30). Every drop is counted per rule in the crawl summary, so
// nothing disappears silently. `head` phrases match the title + typologies;
// `short` phrases also the summary (only unambiguous ones there). The long
// description never drops an event.

export type DropRule = 'no-title' | 'professional-training' | 'civic-notice' | 'spectator-sport' | 'course-wellness'

interface Drop {
  id: DropRule
  head: string[]
  short?: string[]
  /** Never drop when one of these is in the title/typologies/summary. */
  unless?: string[]
  /** Only for these primary categories (default: any). */
  onlyIn?: CategoryId[]
}

const DROPS: Drop[] = [
  {
    // Work safety, refresher and trade courses, teacher previews: jobs, not outings.
    id: 'professional-training',
    head: [
      'sicurezza sul lavoro', 'arbeitssicherheit', 'corso di aggiornamento', 'corsi di aggiornamento',
      'seminario di aggiornamento', 'seminari di aggiornamento', 'aggiornamento professionale',
      'formazione professionale', 'formazione obbligatoria', 'formazione continua', 'crediti formativi',
      'ecm', 'haccp', 'per professionisti', 'cucine professionali', 'per i docenti', 'per docenti',
      'per insegnanti', 'per gli insegnanti', 'riservata ai docenti', 'riservato ai docenti',
      'diplom', 'diplomlehrgang*', 'lehrgang', 'fortbildung*', 'weiterbildung*', 'fuhrungskraft*',
      'coordina efficacemente', 'gruppen effektiv',
    ],
    short: ['riservata ai docenti', 'riservato ai docenti', 'crediti ecm', 'corso di aggiornamento per'],
  },
  {
    // Council sessions, traffic notices, monuments lit up for a cause. Parades stay.
    id: 'civic-notice',
    head: [
      'convocazione', 'consiglio circoscrizione', 'consiglio di circoscrizione', 'consiglio circoscrizionale',
      'consiglio comunale', 'seduta del consiglio', 'commissione consiliare', 'ordinanza',
      'chiusura al traffico', 'modifiche alla viabilita', 'modifica alla viabilita', 'avviso pubblico',
      'gemeinderat*',
    ],
    short: [
      'convocazione consiglio', 'in seduta pubblica', 'illuminata di', 'illuminato di', 'illuminando di',
      'illuminera', 'si illumina di', 'si tingera di', 'aderisce alla campagna', 'aderisce alla giornata',
      'aderisce all iniziativa',
    ],
    unless: ['parade', 'parata', 'sfilata', 'corteo', 'umzug', 'pride'],
  },
  {
    // Matches, championships, races and regattas to watch. Sport you take part
    // in (hikes, rides, social runs, open regattas) stays, as `outdoor`.
    id: 'spectator-sport',
    head: [
      'partite casalinghe', 'partita casalinga', 'calendario partite', 'heimspiel*', 'campionato',
      'campionati', 'meisterschaft*', 'regata', 'regate', 'canottaggio', 'gran premio', 'grand prix',
      'serie a', 'serie b', 'serie c', 'hockey', 'fc sudtirol', 'cup', 'coppa', 'trofeo', 'derby',
      'gara', 'gare', 'rennen', 'radrennen', 'motocross', 'rally',
    ],
    unless: [
      'non competitiv*', 'aperta a tutti', 'aperto a tutti', 'social run', 'volkslauf*', 'veleggiata',
      'regata aperta', 'camminata',
    ],
    onlyIn: ['other', 'outdoor', 'festivals'],
  },
]

// Appended here (not in the middle) so earlier rules keep their order.
DROPS.push({
  // Courses, wellness, therapy, language and senior groups that no category
  // claimed (Open Data Hub and the OpenPA town sites are full of them; owner's
  // decision 2026-10-03). A craft or music course is already `creative` /
  // `concerts` and never gets here: only the 'other' leftovers drop.
  id: 'course-wellness',
  head: [
    'corso', 'corsi', 'kurs', 'kurse', 'yoga', 'ginnastica', 'pilates', 'tai chi', 'sauna', 'meditazione',
    'terapia', 'respirazione', 'campane tibetane', 'mandala', 'human design', 'doula', 'spiritualita',
    'focalizzazione', 'benessere', 'wohlfuhl*', 'genussbotschafter*', 'coaching', 'conversazione',
    'english club', 'sprachen cafe', 'parliamo in italiano', 'scuole d italiano', 'sportello',
    'controlli parametri', 'invecchiare', 'comportamento problematico', 'campagna nastro',
    'comitato di partecipazione',
  ],
  onlyIn: ['other'],
})

const DROP_RULES = DROPS.map((d) => ({
  ...d,
  head: d.head.map(compile),
  short: (d.short ?? []).map(compile),
  unless: (d.unless ?? []).map(compile),
}))

/**
 * Why this event is dropped at crawl time, or null to keep it. `category` is
 * the primary category from `classify`. See DROP RULES above.
 */
export function dropRule(
  text: { title: string; summary?: string | null; tagText?: string | null },
  category: CategoryId,
): DropRule | null {
  // "..." (seen on Open Data Hub) normalises to nothing.
  if (!hayOf([text.title])) return 'no-title'
  const head = hayOf([text.title, text.tagText])
  const short = hayOf([text.title, text.summary, text.tagText])
  for (const d of DROP_RULES) {
    if (d.onlyIn && !d.onlyIn.includes(category)) continue
    if (!any(d.head, head) && !any(d.short, short)) continue
    if (any(d.unless, short)) continue
    return d.id
  }
  return null
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
  const raw = text.title
  // Typology items: "Teatro", "Visita guidata · adulti", "Evento · Mostra".
  const typos = (text.tagText ?? '').split(/\s*[·|;,/]\s*/).map(normalize).filter(Boolean)
  const tiers = [
    matchHay(title, title, short, raw),
    matchHay(typed, typed, short, raw, typos),
    matchHay(short, short, short, raw, typos),
    matchHay(short, long, short, raw, typos),
  ]
  const matches = (tiers[3] ?? []).filter(allowed)
  const own = hint ?? (sourceDefault !== 'other' ? sourceDefault : undefined)
  const category = (own && allowed(own) ? own : undefined) ?? tiers.map((t) => t.filter(allowed)[0]).find(Boolean) ?? 'other'
  const formats = kids ? [] : formatTags(text, category, matches)
  const adjacent: TagId[] = !kids && isAdjacent(category, text) ? ['adjacent'] : []
  return { category, tags: finishTags(category, [...matches, ...formats, ...adjacent], kids) }
}

const FORMAT_TAGS: readonly TagId[] = ['social-friend', 'social-girl', 'solo-ok']

/**
 * Primary + matches (+ kids) in priority order, then any format tags;
 * `other` only when it is the primary. A kids event has neither `creative`
 * nor format tags.
 */
// --- ADJACENT -----------------------------------------------------------------
//
// Topics next to the owner's core interests (comics & games, board games,
// making): illustration and animation, sci-fi/fantasy/tech, photography,
// design and architecture, nerd culture (owner's picks, 2026-10-03). Matched in
// the title, summary and typologies only (a long description name-drops
// everything), and only for events that are not already a core category. The
// page shows the tag by default, so a photography exhibition or an AI talk
// surfaces while the other exhibitions and talks stay hidden.
const ADJACENT_WORDS = [
  'illustrazion*', 'illustrator*', 'illustratric*', 'fumett*', 'graphic novel', 'animazione', 'cartoon*', 'disegnator*',
  'manga', 'anime', 'pixar', 'ghibli',
  'fantascienza', 'fantasy', 'tolkien', 'sci fi', 'science fiction', 'distopi*', 'supereroi', 'cyberpunk',
  'steampunk', 'intelligenza artificiale', 'robot', 'robotica', 'videogioc*', 'videogame*', 'realta virtuale',
  'realta aumentata', 'programmazione', 'coding', 'informatica', 'cybersicurezza', 'startup',
  'fotografi*', 'fotograf*', 'design', 'designer*', 'architettur*', 'architett*',
  'retrogaming', 'retro gaming', 'arcade', 'lego', 'minifigure*', 'dungeons', 'warhammer', 'star wars', 'star trek',
  'harry potter', 'marvel', 'pokemon', 'trading card*', 'magic the gathering', 'modellismo', 'planetario',
  'telescop*', 'osservatorio astronomico', 'astronomia',
  // Books as objects: fairs and exhibitions of books (not every book presentation).
  'fiera del libro', 'fiere del libro', 'salone del libro', 'festival del libro', 'mostra del libro', 'mostra di libri',
  'mostre di libri', 'mostra mercato del libro', 'libri antichi', 'libro d artista', 'libri d artista', 'book fair',
  'buchmesse', 'bookcity', 'editoria', 'bibliofil*', 'mostra libraria',
].map(compile)

const CORE: CategoryId[] = ['boardgames', 'nerd', 'creative']

/** Does the event touch a topic adjacent to the core interests (and is not already one)? */
export function isAdjacent(
  category: CategoryId,
  text: { title: string; summary?: string | null; tagText?: string | null },
): boolean {
  if (CORE.includes(category)) return false
  const hay = hayOf([text.title, text.summary, text.tagText])
  return any(ADJACENT_WORDS, hay)
}

export function finishTags(category: CategoryId, tags: TagId[], kids: boolean): TagId[] {
  const all = sortTags([category, ...tags, ...(kids ? (['kids'] as TagId[]) : [])])
  return all.filter((t) => (t !== 'other' || category === 'other') && !(kids && (t === 'creative' || FORMAT_TAGS.includes(t))))
}

const ORDER = new Map<TagId, number>([
  ...CATEGORIES.map((c, i): [TagId, number] => [c.id, i]),
  ...(['kids', ...FORMAT_TAGS, 'adjacent'] as TagId[]).map((t, i): [TagId, number] => [t, 100 + i]),
])

export function sortTags(tags: TagId[]): TagId[] {
  return [...new Set(tags)].sort((a, b) => (ORDER.get(a) ?? 99) - (ORDER.get(b) ?? 99))
}
