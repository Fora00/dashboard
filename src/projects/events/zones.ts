import type { EventItem } from './types'
import { areaOf } from './model'
import { SOURCE_CITIES } from './distance'

// Zones: where an event is, at the size the owner thinks in (2026-11-02).
// Trento and Rovereto are the default view; the rest of Trentino is grouped
// by valley, and everything outside the province by region (the crawler's
// `area`). Unknown Trentino towns, "Trentino" and "Online" fall in `altro`.

export const ZONES: { id: string; label: string }[] = [
  { id: 'trento', label: 'Trento' },
  { id: 'rovereto', label: 'Rovereto' },
  { id: 'sud', label: 'Sud: Vallagarina, Garda, Ledro' },
  { id: 'trento-dintorni', label: 'Dintorni di Trento, Pergine, Piné' },
  { id: 'valsugana', label: 'Valsugana' },
  { id: 'valli-nord', label: 'Valli del nord: Non, Sole, Fiemme, Fassa' },
  { id: 'giudicarie', label: 'Giudicarie' },
  { id: 'altro', label: 'Altro Trentino / online' },
  { id: 'alto-adige', label: 'Alto Adige' },
  { id: 'verona-garda', label: 'Verona e Garda' },
  { id: 'veneto', label: 'Veneto' },
  { id: 'lombardia', label: 'Lombardia' },
  { id: 'lontano', label: 'Più lontano' },
]

/** Shown when nothing is picked. */
export const DEFAULT_ZONES: readonly string[] = ['trento', 'rovereto']

const TOWNS: Record<string, string[]> = {
  trento: ['Trento', 'Mattarello', 'Povo', 'Gardolo', 'Meano'],
  rovereto: ['Rovereto'],
  sud: [
    'Villa Lagarina',
    'Isera',
    'Pomarolo',
    'Besenello',
    'Calliano',
    'Mori',
    'Aldeno',
    'Ala',
    'Avio',
    'Brentonico',
    'Castione di Brentonico',
    'Folgaria',
    'Lavarone',
    'Volano',
    'Nomi',
    'Riva del Garda',
    'Arco',
    'Nago-Torbole',
    'Torbole',
    'Dro',
    'Tenno',
    'Ledro',
    'Drena',
    'Lago di Garda',
  ],
  'trento-dintorni': [
    'Vallelaghi',
    'Madruzzo',
    'Vezzano',
    'Cavedine',
    'Garniga Terme',
    'Garniga',
    'Zambana',
    'Terlago',
    'Lavis',
    'Mezzolombardo',
    "San Michele all'Adige",
    'Cembra Lisignago',
    'Segonzano',
    'Faedo',
    'Giovo',
    'Albiano',
    'Valfloriana',
    'Grumo',
    'Pergine Valsugana',
    'Pergine',
    'Bedollo',
    'Baselga di Pine',
    "Sant'Orsola Terme",
    'Palu del Fersina',
    'Frassilongo',
    'Altopiano della Vigolana',
    'Civezzano',
    'Fornace',
  ],
  valsugana: [
    'Levico Terme',
    'Caldonazzo',
    'Borgo Valsugana',
    'Grigno',
    'Roncegno Terme',
    'Telve',
    'Castelnuovo',
    'Castel Ivano',
    'Spera',
    'Pieve Tesino',
    'Vignola-Falesina',
    'Carzano',
  ],
  'valli-nord': [
    'Cles',
    'Revo',
    "Ville d'Anaunia",
    'Predaia',
    'Denno',
    'Campodenno',
    'Cloz',
    'Dimaro Folgarida',
    'Dimaro',
    'Male',
    'Giustino',
    'Tre Ville',
    'Tesero',
    'Predazzo',
    'Cavalese',
    'Primiero San Martino di Castrozza',
    'Canazei',
    'Moena',
  ],
  giudicarie: [
    'Tione di Trento',
    'Pinzolo',
    'Bondone',
    'Storo',
    'Borgo Chiese',
    'Sella Giudicarie',
    'Spiazzo',
    'Pieve di Bono-Prezzo',
    'Pelugo',
    'Caderzone',
    'Comano Terme',
    'Bleggio Superiore',
    'Fiave',
    'San Lorenzo Dorsino',
    'Porte',
    'Bondone-Casa Sociale di Baitoni',
  ],
}

const plain = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const TOWN_ZONE = new Map<string, string>()
for (const [zone, towns] of Object.entries(TOWNS)) for (const t of towns) TOWN_ZONE.set(plain(t), zone)

const AREA_ZONE: Record<string, string> = {
  'alto-adige': 'alto-adige',
  'verona-garda': 'verona-garda',
  veneto: 'veneto',
  lombardia: 'lombardia',
}

/** The zone an event belongs to. */
export function zoneOf(e: Pick<EventItem, 'city' | 'area'>): string {
  const known = TOWN_ZONE.get(plain(e.city))
  if (known) return known
  const area = areaOf(e as EventItem)
  if (area === 'trentino') return 'altro'
  return AREA_ZONE[area] ?? 'lontano'
}

export function zoneLabel(id: string): string {
  return ZONES.find((z) => z.id === id)?.label ?? id
}

export function inZones(e: Pick<EventItem, 'city' | 'area'>, zones: readonly string[]): boolean {
  return zones.length === 0 || zones.includes(zoneOf(e))
}

/** A town the event's source is explicitly kept to (SOURCE_CITIES): it counts as default-zone. */
export function isSourceHome(e: Pick<EventItem, 'city' | 'source'>): boolean {
  const cities = SOURCE_CITIES[e.source]
  return cities !== undefined && cities.some((c) => plain(c) === plain(e.city))
}
