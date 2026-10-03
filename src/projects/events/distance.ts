import type { EventItem } from './types'

// Rough driving time from Rovereto, in minutes, for the towns the events come
// from. Hand-estimated (not routed): good enough to say "close" or "a trip".
// Unknown towns, "Trentino", "Online" have no entry and are never "near".

/** "Near" = at most about as far as Baselga di Pinè (the owner's yardstick). */
export const NEAR_MINUTES = 50

const MINUTES: Record<string, number> = {
  // Vallagarina
  Rovereto: 0,
  'Villa Lagarina': 8,
  Isera: 8,
  Pomarolo: 12,
  Besenello: 12,
  Calliano: 12,
  Mori: 12,
  Aldeno: 20,
  Mattarello: 20,
  Ala: 20,
  Avio: 25,
  Brentonico: 25,
  'Castione di Brentonico': 25,
  Folgaria: 35,
  Lavarone: 45,
  // Garda trentino
  'Nago-Torbole': 25,
  Torbole: 25,
  Arco: 30,
  'Riva del Garda': 30,
  Dro: 32,
  Tenno: 40,
  Ledro: 45,
  Cavedine: 40,
  // Trento and surroundings
  Trento: 25,
  Garniga: 35,
  'Garniga Terme': 35,
  Vezzano: 35,
  Vallelaghi: 35,
  Madruzzo: 35,
  Zambana: 35,
  Lavis: 40,
  "San Michele all'Adige": 40,
  Mezzolombardo: 40,
  Civezzano: 40,
  Fornace: 40,
  'Altopiano della Vigolana': 40,
  // Valsugana and Pinè
  'Pergine Valsugana': 40,
  Pergine: 40,
  Caldonazzo: 45,
  'Levico Terme': 45,
  'Baselga di Pine': 50,
  Frassilongo: 55,
  Bedollo: 55,
  "Sant'Orsola Terme": 55,
  'Roncegno Terme': 55,
  'Cembra Lisignago': 55,
  'Palu del Fersina': 60,
  'Borgo Valsugana': 60,
  Carzano: 60,
  Telve: 65,
  Castelnuovo: 65,
  'Castel Ivano': 65,
  Valfloriana: 65,
  'Pieve Tesino': 75,
  // Val di Non, Giudicarie, Fiemme, Primiero
  Denno: 50,
  Campodenno: 55,
  Predaia: 55,
  "Ville d'Anaunia": 55,
  Cles: 60,
  Revo: 75,
  'Bleggio Superiore': 50,
  Fiave: 55,
  'San Lorenzo Dorsino': 55,
  Dare: 60,
  Ronzone: 60,
  Bondone: 65,
  'Tione di Trento': 65,
  Spera: 70,
  'Sella Giudicarie': 70,
  Spiazzo: 70,
  Pinzolo: 85,
  Tesero: 65,
  Predazzo: 80,
  'Primiero San Martino di Castrozza': 80, 'Viote del Monte Bondone': 50,
  // Verona and Lake Garda (east shore)
  'Limone sul Garda': 45,
  Malcesine: 50,
  'Ferrara di Monte Baldo': 50,
  Brenzone: 55,
  'Brenzone sul Garda': 55,
  Affi: 55,
  'Torri del Benaco': 60,
  Garda: 60,
  Costermano: 60,
  'Costermano sul Garda': 60,
  'San Zeno di Montagna': 60,
  Bardolino: 65,
  Lazise: 65,
  Verona: 65,
  Bussolengo: 65,
  Pastrengo: 65,
  'Castelnuovo del Garda': 70,
  Sommacampagna: 70,
  Sona: 70,
  'Peschiera del Garda': 75,
  'Valeggio sul Mincio': 75,
  // Alto Adige
  Egna: 50,
  Neumarkt: 50,
  Laives: 65,
  Bolzano: 70,
  Bozen: 70,
  Appiano: 75,
  Caldaro: 70,
  Merano: 100,
  Meran: 100,
  Bressanone: 105,
  Brixen: 105,
  Vipiteno: 125,
  Brunico: 140,
  // Veneto, Lombardia, further
  Schio: 50,
  Thiene: 60,
  Valdagno: 70,
  Asiago: 75,
  Vicenza: 80,
  Bassano: 85,
  'Bassano del Grappa': 85,
  Cassola: 85,
  Rosa: 85,
  Padova: 100,
  Desenzano: 60,
  'Desenzano del Garda': 60,
  Sirmione: 65,
  Salo: 70,
  Gardone: 70,
  Montichiari: 80,
  Mantova: 80,
  Brescia: 95,
  Bergamo: 130,
  Milano: 150,
}

/** Lowercase, accent-free (kept local so this file imports nothing from filters.ts). */
const normalizeText = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const TABLE = new Map(Object.entries(MINUTES).map(([k, v]) => [normalizeText(k), v]))

/** Approximate driving minutes from Rovereto, or null when the town is not known. */
export function driveMinutes(city: string): number | null {
  const key = normalizeText(city.replace(/\([^)]*\)/g, ' ')).replace(/\s+/g, ' ')
  return TABLE.get(key) ?? null
}

/** Distance filter steps (max driving minutes). NEAR_MINUTES is the quick "Vicino" chip. */
export const DISTANCE_STEPS = [30, NEAR_MINUTES, 75, 120] as const

/** Is the event's town known and within `max` minutes? (Unknown towns never match a limit.) */
export function withinMinutes(e: Pick<EventItem, 'city'>, max: number): boolean {
  const m = driveMinutes(e.city)
  return m !== null && m <= max
}

export function isNear(e: Pick<EventItem, 'city'>): boolean {
  return withinMinutes(e, NEAR_MINUTES)
}

/** "30 min", "1 h 15": a limit as text. */
export function minutesLabel(m: number): string {
  return m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60}` : `${m / 60} h`
}

/** "35 min", "1 h 20"; empty when unknown. */
export function driveLabel(city: string): string {
  const m = driveMinutes(city)
  if (m === null) return ''
  return m === 0 ? '' : minutesLabel(m)
}

/**
 * Categories only worth a shorter trip than NEAR_MINUTES allows elsewhere:
 * a play is worth about an hour of driving. Towns with no known time are kept.
 */
export const CATEGORY_MAX_MINUTES: Record<string, number> = { theatre: 60 }

export function tooFarForCategory(e: Pick<EventItem, 'city' | 'category'>): boolean {
  const max = CATEGORY_MAX_MINUTES[e.category]
  const m = driveMinutes(e.city)
  return max !== undefined && m !== null && m > max
}
