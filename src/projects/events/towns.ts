import { normalizeText } from './filters'

/**
 * Towns -> area for hand-added events. A small client mirror of the town map
 * in scripts/events/areas.ts (only the towns the owner is likely to type);
 * unknown towns fall back to Trentino, like areaOf() in model.ts.
 */
const TOWN_AREA: Record<string, string> = {}
const TOWNS: Record<string, string[]> = {
  'alto-adige': [
    'Bolzano',
    'Bozen',
    'Merano',
    'Meran',
    'Bressanone',
    'Brixen',
    'Brunico',
    'Bruneck',
    'Laives',
    'Lana',
    'Vipiteno',
    'Chiusa',
    'Egna',
    'Appiano',
    'Caldaro',
  ],
  'verona-garda': [
    'Verona',
    'Malcesine',
    'Bardolino',
    'Lazise',
    'Garda',
    'Peschiera del Garda',
    'Torri del Benaco',
    'Bussolengo',
    'Villafranca di Verona',
  ],
  veneto: [
    'Vicenza',
    'Padova',
    'Bassano del Grappa',
    'Venezia',
    'Treviso',
    'Belluno',
    'Rovigo',
    'Schio',
    'Thiene',
    'Asiago',
  ],
  lombardia: [
    'Brescia',
    'Mantova',
    'Milano',
    'Bergamo',
    'Cremona',
    'Sirmione',
    'Desenzano del Garda',
    'Salò',
    'Limone sul Garda',
    'Monza',
  ],
  'emilia-romagna': ['Bologna', 'Modena', 'Parma', 'Reggio Emilia', 'Ferrara', 'Rimini', 'Ravenna'],
  piemonte: ['Torino'],
  toscana: ['Lucca', 'Firenze', 'Pisa'],
  abroad: ['Essen', 'Innsbruck', 'München', 'Munich', 'Wien', 'Vienna'],
}
for (const [area, towns] of Object.entries(TOWNS)) {
  for (const t of towns) TOWN_AREA[normalizeText(t)] = area
}

export function cityArea(city: string): string {
  return TOWN_AREA[normalizeText(city)] ?? 'trentino'
}
