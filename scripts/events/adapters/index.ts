// Every source the crawler runs, in run order. Adding a source = one adapter
// file (or one openpa({...}) entry) + one line here. See docs/EVENTS.md.
import type { Adapter } from '../types.ts'
import { openpa } from './openpa.ts'
import { ludimus } from './ludimus.ts'
import { volkan } from './volkan.ts'
import { mart } from './mart.ts'
import { bolzano } from './bolzano.ts'
import { ical } from './ical.ts'
import { trentinospettacoli } from './trentinospettacoli.ts'
import { tebe } from './tebe.ts'

export const ADAPTERS: Adapter[] = [
  // Batch A — board games
  ludimus,
  openpa({
    id: 'bibcom-trento', name: 'Biblioteca comunale di Trento', host: 'bibcom.trento.it', mode: 'search', classes: '[event]',
    // Branches are all in the Trento municipality; titles carry the branch
    // ("A Povo - …", "In Sala degli affreschi - …") which www.comune.trento.it drops.
    city: 'Trento', fixedCity: true,
    titlePrefix: /^(?:(?:A|Ad|Al|Alla|In|Nella|Nel|Presso)\s+|All['’]\s*)[^-–]{2,40}?\s+[-–]\s+/,
  }),
  openpa({ id: 'trentogiovani', name: 'Trentogiovani', host: 'trentogiovani.it', mode: 'calendar', classes: '[event]', city: 'Trento', mayBeEmpty: true }),
  volkan,
  // Batch B — city and culture
  openpa({ id: 'rovereto', name: 'Comune di Rovereto — eventi', host: 'eventi.comune.rovereto.tn.it', mode: 'search', classes: '[event]', city: 'Rovereto' }),
  openpa({ id: 'comune-trento', name: 'Comune di Trento', host: 'www.comune.trento.it', mode: 'calendar', classes: '[event_link]', city: 'Trento' }),
  mart,
  bolzano,
  openpa({ id: 'verona', name: 'Comune di Verona', host: 'www.comune.verona.it', mode: 'calendar', classes: '[event]', city: 'Verona' }),
  // Batch C — culture, theatre and creative (added 2026-09-29)
  // Provincial culture portal: every town in Trentino. robots.txt asks for
  // Crawl-delay 10 (honoured by http.ts), so its ~5 pages take ~50 s.
  openpa({ id: 'cultura-trentino', name: 'Trentino Cultura', host: 'www.cultura.trentino.it', mode: 'search', classes: '[event]', city: 'Trentino' }),
  // ViviRovereto: the municipal agenda (RAM film festival, theatre season
  // preludes…). robots.txt only allows /opendata/api/calendar here.
  openpa({ id: 'rovereto-comune', name: 'Comune di Rovereto — ViviRovereto', host: 'www.comune.rovereto.tn.it', mode: 'calendar', classes: '[event]', city: 'Rovereto' }),
  // Teatro Zandonai (Rovereto): same OpenPA install, `spettacolo` class with a
  // single main_datetime. Often empty between seasons.
  openpa({
    id: 'zandonai', name: 'Teatro Zandonai', host: 'www.teatro-zandonai.it', mode: 'search', classes: '[spettacolo]',
    city: 'Rovereto', fixedCity: true, timeFields: { from: 'main_datetime' }, mayBeEmpty: true,
  }),
  ical({
    id: 'buonconsiglio', name: 'Castello del Buonconsiglio', feed: 'https://www.buonconsiglio.it/events.ics',
    home: 'https://www.buonconsiglio.it/agenda/', city: 'Trento',
  }),
  trentinospettacoli,
  tebe,
]
