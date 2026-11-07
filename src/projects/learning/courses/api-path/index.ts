import type { Course } from '../../types'
import { apiobs, apisec, asyncapi, runner } from './extra'
import { bruno, curl, formats, http, httpfiles, postman, rest } from './a'
import { apiDrills, apiInterview, apiTesting, authModule, debug, graphql, openapi, realtime, resilient } from './b'

// Hand-written API course (2026-11-05): understand APIs, call them, test them. For reading offline.
export const apiPath: Course = {
  id: 'api-path',
  title: 'API: capirle, interrogarle e testarle',
  emoji: '🔌',
  summary:
    'HTTP, REST, curl, Bruno, Postman, autenticazione, OpenAPI, GraphQL, test e debug, con esercizi e domande da colloquio.',
  intro:
    'Percorso sulle API web: come funzionano (HTTP e REST), come si interrogano (curl, HTTPie, Bruno, Postman, file .http), come ci si autentica, come si leggono i contratti (OpenAPI, GraphQL, gRPC), come si testano e si fa il debug, e come si scrivono client robusti. Ogni modulo ha lezione, quiz, flashcard ed esercizi. Gli esercizi con API pubbliche richiedono connessione: fai quelli online e ripassa le soluzioni offline.',
  groups: [
    { id: 'base', label: '1. Capire le API' },
    { id: 'tools', label: '2. Strumenti per interrogarle' },
    { id: 'auth', label: '3. Autenticazione' },
    { id: 'contratti', label: '4. Contratti e altri stili' },
    { id: 'qualita', label: '5. Test, debug e client robusti' },
    { id: 'pratica', label: 'Allenamento' },
  ],
  modules: [
    http,
    rest,
    formats,
    curl,
    bruno,
    postman,
    httpfiles,
    runner,
    authModule,
    apisec,
    openapi,
    graphql,
    realtime,
    asyncapi,
    apiTesting,
    apiobs,
    debug,
    resilient,
    apiDrills,
    apiInterview,
  ],
  notes: [
    'Gli esempi usano un dominio fittizio (api.esempio.it): sostituiscilo con quello reale e non incollare mai token veri in chat o repository.',
    'Gli strumenti cambiano interfaccia spesso: i concetti (variabili, ambienti, script, asserzioni) restano.',
  ],
}
