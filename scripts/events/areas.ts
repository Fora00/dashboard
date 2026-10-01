// Areas and coverage rings — the ONE place that says where an event is and
// how far from the owner it is (ROADMAP "Coverage plan: rings around the
// owner"). Every event gets:
//
// - `area`: a region-sized bucket for the page's Area filter. The city map
//   below wins when it knows the town; otherwise the adapter's own `area`
//   (default `trentino`) applies.
// - `ring`: `home` (ring 1, every category), `near` (ring 2, interests only,
//   filtered at crawl time by NEAR_INTERESTS) or `spot` (hand-curated big
//   events in far cities, spot.json). Set per adapter (default `home`).
//
// Adding an area = one entry in AREAS (+ the AreaId union) and its towns in
// CITY_AREA. Mirror the labels in src/projects/events/model.ts (AREAS).
import type { TagId } from './tags.ts'
import { normalize } from './text.ts'

export type AreaId =
  | 'trentino'
  | 'alto-adige'
  | 'verona-garda'
  | 'veneto'
  | 'lombardia'
  | 'emilia-romagna'
  | 'piemonte'
  | 'toscana'
  | 'abroad'

export type Ring = 'home' | 'near' | 'spot'

/** In display order (nearest first). */
export const AREAS: { id: AreaId; label: string }[] = [
  { id: 'trentino', label: 'Trentino' },
  { id: 'alto-adige', label: 'Alto Adige' },
  { id: 'verona-garda', label: 'Verona & Garda' },
  { id: 'veneto', label: 'Veneto' },
  { id: 'lombardia', label: 'Lombardia' },
  { id: 'emilia-romagna', label: 'Emilia-Romagna' },
  { id: 'piemonte', label: 'Piemonte' },
  { id: 'toscana', label: 'Toscana' },
  { id: 'abroad', label: 'Estero' },
]

/**
 * Ring 2 (`near`) sources keep only events whose category or tags include
 * one of these; `kids` events are dropped there as well.
 */
// `food` split off "Festivals & food" on 2026-09-30, so it stays an interest.
export const NEAR_INTERESTS: readonly TagId[] = [
  'creative', 'theatre', 'boardgames', 'festivals', 'food', 'nerd', 'exhibitions', 'concerts',
]

const TOWNS: Record<AreaId, string[]> = {
  // Trentino towns are the default for most sources; only the ones another
  // area's source may also mention need to be here.
  trentino: [
    'Trento', 'Rovereto', 'Mattarello', 'Riva del Garda', 'Arco', 'Nago-Torbole', 'Torbole', 'Ala', 'Avio',
    'Pergine Valsugana', 'Levico Terme', 'Ledro', 'Tenno', 'Mori', 'Brentonico', 'Castione di Brentonico', 'Trentino',
  ],
  'alto-adige': [
    'Bolzano', 'Bozen', 'Merano', 'Meran', 'Bressanone', 'Brixen', 'Brunico', 'Bruneck',
    'Laives', 'Leifers', 'Appiano sulla Strada del Vino', 'Eppan an der Weinstraße', 'Caldaro sulla Strada del Vino',
    'Kaltern an der Weinstraße', 'Lana', 'Vipiteno', 'Sterzing', 'Chiusa', 'Klausen', 'Egna', 'Neumarkt',
    'Silandro', 'Schlanders', 'Naturno', 'Naturns', 'Renon', 'Ritten', 'Dobbiaco', 'Toblach',
    'San Candido', 'Innichen', 'Varna', 'Vahrn', 'Scena', 'Schenna', 'Tirolo', 'Dorf Tirol',
    'Marlengo', 'Marling', 'Lagundo', 'Algund', 'Postal', 'Burgstall', 'Cermes', 'Tscherms',
  ],
  'verona-garda': [
    'Verona', 'Malcesine', 'Bardolino', 'Lazise', 'Garda', 'Peschiera del Garda', 'Torri del Benaco',
    'Brenzone sul Garda', 'Castelnuovo del Garda', 'Cavaion Veronese', 'Costermano sul Garda',
    'Affi', 'Sona', 'Pastrengo', 'Villafranca di Verona', 'San Giovanni Lupatoto',
    'Negrar di Valpolicella', 'San Pietro in Cariano', 'Sant\'Ambrogio di Valpolicella',
    'Bussolengo', 'Pescantina', 'Soave', 'Legnago', 'Caprino Veronese', 'San Zeno di Montagna',
  ],
  veneto: [
    'Vicenza', 'Padova', 'Bassano del Grappa', 'Venezia', 'Treviso', 'Belluno', 'Rovigo',
    'Schio', 'Thiene', 'Marostica', 'Asiago', 'Castelfranco Veneto',
    // Arteven's Vicenza-province theatres
    'Cassola', 'Rosà', 'Valdagno', 'Noventa Vicentina', 'Fontaniva',
  ],
  lombardia: [
    'Brescia', 'Mantova', 'Milano', 'Bergamo', 'Cremona', 'Sirmione', 'Desenzano del Garda',
    'Salò', 'Limone sul Garda', 'Gardone Riviera', 'Rho', 'Monza',
  ],
  'emilia-romagna': ['Bologna', 'Modena', 'Parma', 'Reggio Emilia', 'Ferrara', 'Rimini', 'Ravenna'],
  piemonte: ['Torino'],
  toscana: ['Lucca', 'Firenze', 'Pisa'],
  abroad: ['Essen', 'Essen (DE)', 'Innsbruck', 'München', 'Munich', 'Wien', 'Vienna'],
}

/** Normalised town name → area. Parenthesised suffixes ("Essen (DE)") are ignored. */
const CITY_AREA = new Map<string, AreaId>()
for (const [area, towns] of Object.entries(TOWNS) as [AreaId, string[]][]) {
  for (const t of towns) CITY_AREA.set(cityKey(t), area)
}

function cityKey(city: string): string {
  return normalize(city.replace(/\([^)]*\)/g, ' '))
}

/** The area of a town, when the map knows it. */
export function areaOfCity(city: string): AreaId | undefined {
  return CITY_AREA.get(cityKey(city))
}

/** City map first, then the adapter's area. */
export function areaFor(city: string, adapterArea: AreaId): AreaId {
  return areaOfCity(city) ?? adapterArea
}

/** A ring-2 event is kept only when it matches an interest and is not for kids. */
export function keepForRing(ring: Ring, tags: readonly TagId[]): boolean {
  if (ring !== 'near') return true
  if (tags.includes('kids')) return false
  return tags.some((t) => NEAR_INTERESTS.includes(t))
}

const RING_ORDER: Record<Ring, number> = { home: 0, near: 1, spot: 2 }

/** The closer of two rings (dedup of the same event from two sources). */
export function closerRing(a: Ring, b: Ring): Ring {
  return RING_ORDER[a] <= RING_ORDER[b] ? a : b
}
