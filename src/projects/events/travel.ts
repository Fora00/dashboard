import { minutesLabel } from './distance'
import type { EventItem } from './types'

// Travel hint for the event card/detail: "≈ 1 h da Trento". Pure, no React.
//
// The table below is hand-maintained and APPROXIMATE: driving time by car in
// normal traffic, rounded to 5 minutes, [from Trento, from Rovereto]. There is
// no routing and no network. Sources of the figures:
// - from Rovereto: the owner's hand estimates in distance.ts (rounded to 5);
// - from Trento: estimates added on top of those (A22 / SS47 / SS12 distances
//   known by hand), NOT checked against a routing service. docs/EVENTS_CENSUS.md
//   lists towns and rings but carries no travel times, so it is not a source.
// A town with no reliable figure is left OUT on purpose: no hint beats a wrong
// one. Trento and Rovereto themselves, "Trentino" and "Online" have no entry.

const TABLE: Record<string, readonly [trento: number, rovereto: number]> = {
  // Around Trento / Vallagarina
  Mattarello: [10, 20],
  Lavis: [15, 40],
  Mezzolombardo: [25, 40],
  Mori: [35, 10],
  Ala: [45, 20],
  Avio: [50, 25],
  Brentonico: [50, 25],
  'Castione di Brentonico': [50, 25],
  // Valsugana
  'Pergine Valsugana': [20, 40],
  Caldonazzo: [25, 45],
  'Levico Terme': [30, 45],
  // Garda trentino
  Arco: [40, 30],
  'Riva del Garda': [40, 30],
  'Nago-Torbole': [45, 25],
  Torbole: [45, 25],
  Tenno: [45, 40],
  Ledro: [55, 45],
  // Val di Non
  Cles: [45, 60],
  // Alto Adige
  Egna: [30, 50],
  Neumarkt: [30, 50],
  Laives: [40, 65],
  Bolzano: [45, 70],
  Bozen: [45, 70],
  Merano: [75, 100],
  Meran: [75, 100],
  Bressanone: [85, 105],
  Brixen: [85, 105],
  // Verona and Lake Garda (east shore)
  'Limone sul Garda': [60, 45],
  Malcesine: [75, 50],
  Bardolino: [95, 65],
  Lazise: [95, 65],
  Verona: [90, 65],
  // Veneto, Lombardia, further
  Schio: [70, 50],
  Vicenza: [90, 80],
  Desenzano: [85, 60],
  'Desenzano del Garda': [85, 60],
  Sirmione: [90, 65],
  Mantova: [105, 80],
  Brescia: [120, 95],
  Milano: [170, 150],
}

/** Lowercase, accent-free, no "(VR)"-style suffix (local copy: imports nothing from filters.ts). */
function key(city: string): string {
  return city
    .replace(/\([^)]*\)/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim()
}

const LOOKUP = new Map(Object.entries(TABLE).map(([city, v]) => [key(city), v]))

export interface Travel {
  origin: 'Trento' | 'Rovereto'
  minutes: number
}

/** The nearer origin and its minutes (a tie goes to Trento); null for unknown towns, Trento, Rovereto. */
export function travelFrom(city: string): Travel | null {
  const v = LOOKUP.get(key(city))
  if (!v) return null
  const [trento, rovereto] = v
  return trento <= rovereto ? { origin: 'Trento', minutes: trento } : { origin: 'Rovereto', minutes: rovereto }
}

/** "≈ 1 h da Trento", "≈ 30 min da Rovereto"; empty when there is no hint. */
export function travelLabel(e: Pick<EventItem, 'city'>): string {
  const t = travelFrom(e.city)
  return t ? `≈ ${minutesLabel(t.minutes)} da ${t.origin}` : ''
}
