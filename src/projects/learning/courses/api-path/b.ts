import { card, mod, prac, q } from '../kit'

// Course "API". Groups "auth", "contratti", "qualita", "pratica".

export const authModule = mod(
  'auth',
  'Autenticazione e autorizzazione delle API',
  'API key, Basic, Bearer/JWT, OAuth2/OIDC, cookie, CORS',
  'auth',
  `<p class="lead">Quasi ogni API richiede di dimostrare <b>chi sei</b> (autenticazione) e di verificare <b>cosa puoi fare</b> (autorizzazione). Per usare un'API devi sapere come ottenere e inviare le credenziali.</p>
<h3>Metodi più comuni</h3><div class="tblw"><table><tr><th>Metodo</th><th>Come si invia</th><th>Note</th></tr>
<tr><td>API key</td><td>header <code>X-API-Key</code> o query</td><td>semplice, per servizi; trattala come una password</td></tr>
<tr><td>Basic</td><td><code>Authorization: Basic base64(user:pw)</code></td><td>solo su HTTPS; base64 non è cifratura</td></tr>
<tr><td>Bearer token</td><td><code>Authorization: Bearer &lt;token&gt;</code></td><td>token opaco o JWT</td></tr>
<tr><td>OAuth2 / OIDC</td><td>token ottenuto da un provider</td><td>accesso delegato, scadenze, refresh</td></tr>
<tr><td>Cookie di sessione</td><td><code>Cookie: sid=...</code></td><td>tipico dei browser</td></tr>
<tr><td>mTLS</td><td>certificato client</td><td>servizio-a-servizio ad alta sicurezza</td></tr></table></div>
<h3>JWT in breve</h3><p>Un JSON Web Token ha tre parti separate da punti: <code>header.payload.firma</code> (base64url). Il payload contiene <i>claim</i> (<code>sub</code>, <code>exp</code>, <code>scope</code>); la firma permette al server di verificare che non sia stato alterato. <b>Non è cifrato</b>: chiunque può leggerlo (prova su jwt.io, ma non incollare token di produzione in siti esterni).</p>
<ul><li>Scadenza breve (<code>exp</code>) + <i>refresh token</i> per ottenerne altri.</li><li>Il server verifica firma, <code>exp</code>, <code>aud</code>, <code>iss</code> e l'algoritmo atteso.</li><li>Difficili da revocare prima della scadenza: tieni durate brevi.</li></ul>
<h3>OAuth2: i flussi</h3><div class="tblw"><table><tr><th>Flusso</th><th>Quando</th></tr>
<tr><td>Authorization Code + PKCE</td><td>app web/mobile con utente: il default sicuro</td></tr>
<tr><td>Client Credentials</td><td>servizio-a-servizio, senza utente</td></tr>
<tr><td>Device Code</td><td>dispositivi senza browser (TV, CLI)</td></tr>
<tr><td>Refresh Token</td><td>rinnovare un access token</td></tr></table></div>
<p>Evita "Implicit" e "Password" (deprecati). <b>OIDC</b> aggiunge un livello di identità (<code>id_token</code>, <code>/userinfo</code>) sopra OAuth2.</p>
<h3>Ottenere un token con curl</h3><pre><code>curl -s -X POST https://auth.esempio.it/oauth/token \\
  -d grant_type=client_credentials \\
  -d client_id="$CLIENT_ID" -d client_secret="$CLIENT_SECRET" \\
  -d audience=https://api.esempio.it | jq -r .access_token</code></pre>
<h3>Nei client (Bruno, Postman, Insomnia)</h3><ul><li>Imposta l'autenticazione a livello di collezione: Bearer con <code>{{token}}</code>, oppure il tipo <b>OAuth2</b> con URL, client id e secret, scope: il client ottiene e rinnova il token per te.</li><li>Se il token scade spesso: una richiesta di login/refresh che lo salva in una variabile (script post-response).</li></ul>
<h3>Autorizzazione</h3><ul><li><b>Scope/ruoli</b> sul token (<code>orders:read</code>, <code>admin</code>) per le capacità generali.</li><li><b>Controllo per oggetto</b>: l'utente può accedere a <b>quell'</b>ordine? Senza questo c'è l'IDOR (cambi l'id nell'URL e leggi i dati di un altro).</li></ul>
<h3>CORS (solo browser)</h3><p>Il browser blocca le chiamate cross-origin a meno che il server risponda con <code>Access-Control-Allow-Origin</code> (e gli altri header CORS; per richieste "non semplici" c'è una pre-flight <code>OPTIONS</code>). Gli strumenti da riga di comando e i client come Bruno/Postman <b>non</b> applicano il CORS: un errore CORS non si riproduce con curl.</p>
<h3>Buone pratiche</h3><ul><li>Sempre HTTPS; token in header, mai nell'URL (finiscono nei log).</li><li>Privilegio minimo (scope stretti), scadenze brevi, rotazione dei segreti.</li><li>Mai committare token o client secret; usa variabili d'ambiente o un secret manager.</li></ul>
<div class="say"><b>Cosa dire.</b> «Per i servizi uso Client Credentials, per gli utenti Authorization Code con PKCE; token in header, scadenze brevi, e controllo di autorizzazione sull'oggetto, non solo sul ruolo.»</div>`,
  [
    q(
      'q1',
      'Il payload di un JWT è cifrato?',
      ['No, è solo firmato: chiunque può leggerlo', 'Sì', "Solo l'header", 'Dipende dal browser'],
      0,
      'Non metterci dati sensibili.',
    ),
    q(
      'q2',
      'Quale flusso OAuth2 per un servizio che chiama un altro senza utente?',
      ['Client Credentials', 'Implicit', 'Password', 'Device Code'],
      0,
      'Client id e secret per ottenere il token.',
    ),
    q(
      'q3',
      'Perché un errore CORS non si riproduce con curl?',
      ['CORS è applicato solo dai browser', 'curl lo ignora per bug', 'Perché è HTTP/2', 'Non esiste'],
      0,
      'Lo impone il browser.',
    ),
    q(
      'q4',
      "Cos'è un IDOR?",
      [
        'Accedere agli oggetti di altri cambiando un ID perché manca il controllo per oggetto',
        'Un tipo di token',
        'Un flusso OAuth',
        'Un header',
      ],
      0,
      "Controlla la proprietà dell'oggetto.",
    ),
    q(
      'q5',
      'Dove mettere il token?',
      ["Nell'header Authorization", "Nell'URL", 'Nel nome del file', 'Nel cookie sempre'],
      0,
      "Nell'URL finirebbe nei log.",
    ),
  ],
  [
    card('c1', 'Bearer', 'Authorization: Bearer &lt;token&gt;.'),
    card('c2', 'JWT', 'header.payload.firma; firmato, non cifrato; verifica firma, exp, aud, iss.'),
    card('c3', 'App con utente', 'Authorization Code + PKCE.'),
    card('c4', 'Servizio-a-servizio', 'Client Credentials.'),
    card('c5', 'CORS', 'Solo browser: Access-Control-Allow-Origin e pre-flight OPTIONS.'),
  ],
  [
    prac(
      'p1',
      "Come configuri Bruno/Postman per un'API protetta da OAuth2 Client Credentials?",
      'Tipo di autenticazione OAuth2 a livello di collezione con token URL, client id/secret da variabili segrete, scope e audience; il client ottiene e rinnova il token; verifica con una richiesta di prova.',
    ),
    prac(
      'p2',
      'Il browser dà errore CORS ma curl funziona: cosa succede?',
      "Il server non invia gli header CORS per quell'origine (o manca la risposta alla pre-flight OPTIONS): il browser blocca la risposta. Si configura il server (origin consentiti, metodi, header), non il client.",
    ),
  ],
  'Note del vault: computer science/security/web-security.md, backend/rest-api-design.md',
)

export const openapi = mod(
  'openapi',
  "OpenAPI: il contratto dell'API",
  'Specifica, Swagger UI, generare client e test, importare nei client',
  'contratti',
  `<p class="lead">OpenAPI (ex Swagger) descrive un'API REST in un file YAML/JSON: endpoint, parametri, schemi, risposte, autenticazione. È il <b>contratto</b> da cui nascono documentazione, client, mock e test.</p>
<h3>Un esempio minimo</h3><pre><code>openapi: 3.1.0
info:
  title: API Ordini
  version: 1.0.0
servers:
  - url: https://api.esempio.it/v1
paths:
  /ordini/{id}:
    get:
      summary: Dettaglio ordine
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Ordine" }
        "404":
          description: Non trovato
components:
  schemas:
    Ordine:
      type: object
      required: [id, stato]
      properties:
        id: { type: integer }
        stato: { type: string, enum: [nuovo, pagato, spedito] }
        totale: { type: number }
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
security:
  - bearerAuth: []</code></pre>
<h3>Che cosa descrive</h3><ul><li><b>paths</b>: endpoint e metodi; <b>parameters</b> (path, query, header, cookie); <b>requestBody</b>.</li><li><b>responses</b> per status code, con schemi.</li><li><b>components</b>: schemi riusabili (<code>$ref</code>), sicurezza, esempi.</li><li><b>servers</b> e <b>tags</b> per organizzare.</li></ul>
<h3>Come usarla</h3><ul><li><b>Swagger UI / Redoc</b>: documentazione interattiva con "Try it out" (FastAPI espone <code>/docs</code> e <code>/openapi.json</code> automaticamente).</li><li><b>Importare nel client</b>: Bruno, Postman e Insomnia creano una collezione da una specifica: parti da lì e aggiungi asserzioni.</li><li><b>Generare client e tipi</b>: <code>openapi-generator</code>, <code>openapi-typescript</code>, <code>orval</code>: i frontend ottengono tipi sempre allineati.</li><li><b>Test del contratto</b>: strumenti come Schemathesis o Dredd generano richieste dalla specifica e verificano le risposte; <code>spectral</code> fa il lint della specifica.</li><li><b>Mock</b>: Prism simula il server dalla specifica.</li></ul>
<h3>Code-first o contract-first</h3><ul><li><b>Code-first</b>: la specifica viene generata dal codice (FastAPI, NestJS, DRF con drf-spectacular): sempre aggiornata, ma il contratto segue l'implementazione.</li><li><b>Contract-first</b>: scrivi prima la specifica e la condividi con i consumatori: più lavoro, ma il design è discusso prima del codice.</li><li>In entrambi i casi: <b>la specifica fa parte della CI</b> (lint, rilevamento di cambi incompatibili con <code>oasdiff</code>).</li></ul>
<h3>Cambi incompatibili</h3><p>Rimuovere un campo, cambiare un tipo, rendere obbligatorio un campo, restringere un enum: rompono i client. Aggiungere campi opzionali o endpoint non rompe. Automatizza il controllo con un diff della specifica tra branch.</p>
<h3>Trappole</h3><ul><li>Specifica che non corrisponde alla realtà (drift): genera o verifica in CI.</li><li>Schemi troppo generici (<code>type: object</code> senza proprietà): non aiutano nessuno.</li><li>Esempi mancanti: aggiungi <code>example</code> realistici.</li></ul>
<div class="say"><b>Cosa dire.</b> «La specifica OpenAPI è il contratto: la genero o la verifico in CI, la importo nei client per partire con una collezione, e rilevo i cambi incompatibili prima del merge.»</div>`,
  [
    q(
      'q1',
      "Cos'è OpenAPI?",
      ['Una specifica per descrivere API REST in YAML/JSON', 'Un database', 'Un client HTTP', 'Un linguaggio'],
      0,
      'Documentazione, client, mock e test.',
    ),
    q(
      'q2',
      'Cosa ottieni importando la specifica in Bruno o Postman?',
      ['Una collezione con gli endpoint pronti', 'Un server', 'Un database', 'Niente'],
      0,
      'Poi aggiungi asserzioni.',
    ),
    q(
      'q3',
      'Quale cambio rompe i client?',
      [
        'Aggiungere un campo opzionale',
        'Rimuovere o rinominare un campo',
        'Aggiungere un endpoint',
        'Aggiungere un esempio',
      ],
      1,
      'Cambi non retrocompatibili.',
    ),
    q(
      'q4',
      'Dove FastAPI espone la documentazione interattiva?',
      ['/docs', '/api', '/swagger-ui-no', '/help'],
      0,
      'E la specifica in /openapi.json.',
    ),
    q(
      'q5',
      'Cosa significa contract-first?',
      ['Scrivi prima la specifica e poi il codice', 'Genera la specifica dal codice', 'Niente specifica', 'Solo test'],
      0,
      'Il design si discute con i consumatori.',
    ),
  ],
  [
    card('c1', 'Specifica da FastAPI', '/openapi.json e documentazione su /docs.'),
    card('c2', 'Importare', 'Bruno/Postman/Insomnia: import OpenAPI → collezione.'),
    card('c3', 'Cambi compatibili', 'Aggiungere campi opzionali ed endpoint; non rimuovere né cambiare tipi.'),
    card('c4', 'Test del contratto', 'Schemathesis o Dredd; lint con spectral; diff con oasdiff.'),
    card('c5', 'Mock', 'Prism simula il server dalla specifica.'),
  ],
  [
    prac(
      'p1',
      'Come tieni la specifica allineata con il codice?',
      'Generazione dal codice (FastAPI, drf-spectacular) o test di contratto in CI con Schemathesis; lint con spectral; diff dei cambi incompatibili con oasdiff a ogni PR.',
    ),
    prac(
      'p2',
      'Un frontend aspetta il backend: come lo sblocchi?',
      'Scrivo la specifica OpenAPI, avvio un mock con Prism e genero tipi/client con openapi-typescript; il frontend lavora subito e poi si passa al backend reale.',
    ),
  ],
  'Note del vault: backend/openapi-fundamentals.md, openapi-generated-schema-sync.md, openapi-reverse-doc-sync.md',
)

export const graphql = mod(
  'graphql',
  'GraphQL: interrogare con query e variabili',
  'Query, mutation, variabili, introspezione, client, errori',
  'contratti',
  `<p class="lead">GraphQL è un linguaggio di query per API: un solo endpoint, il client <b>chiede esattamente i campi che servono</b>. È tipizzato e auto-descrittivo.</p>
<h3>Query</h3><pre><code>query ClienteConOrdini($id: ID!, $primi: Int = 5) {
  cliente(id: $id) {
    nome
    email
    ordini(first: $primi) {
      id
      totale
      stato
    }
  }
}</code></pre>
<p>La risposta ha la stessa forma della query: niente campi inutili (no over-fetching) e un solo viaggio per dati correlati (no N richieste).</p>
<h3>Mutation e subscription</h3><pre><code>mutation CreaOrdine($input: NuovoOrdine!) {
  creaOrdine(input: $input) {
    id
    stato
  }
}</code></pre><ul><li><b>Query</b>: letture. <b>Mutation</b>: scritture. <b>Subscription</b>: eventi in tempo reale (WebSocket).</li></ul>
<h3>Inviare una richiesta</h3><pre><code>curl -s https://api.esempio.it/graphql \\
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \\
  -d '{"query":"query($id: ID!){ cliente(id:$id){ nome } }","variables":{"id":"7"}}' | jq</code></pre>
<ul><li>Di norma <b>POST</b> (le query possono usare anche GET) con <code>query</code>, <code>variables</code> e (opzionale) <code>operationName</code>.</li><li><b>Variabili</b> al posto di stringhe concatenate: sicurezza e cache.</li></ul>
<h3>Introspezione e client</h3><ul><li>Lo schema è interrogabile (<code>__schema</code>): i client (Bruno, Postman, Insomnia, Altair, GraphiQL) lo scaricano e offrono <b>autocompletamento</b> e documentazione.</li><li>Fragment per riusare gruppi di campi; alias per rinominare; direttive (<code>@include</code>, <code>@skip</code>).</li></ul>
<h3>Errori</h3><p>Una richiesta GraphQL con errori di <i>esecuzione</i> risponde in genere <b>200</b> (gli errori di sintassi o validazione possono essere 4xx): guarda il campo <code>errors</code> della risposta, e <code>data</code> parziale.</p><pre><code>{ "data": { "cliente": null },
  "errors": [{ "message": "Cliente non trovato", "path": ["cliente"], "extensions": { "code": "NOT_FOUND" } }] }</code></pre><p>I test devono controllare <code>errors</code>, non solo lo status HTTP.</p>
<h3>Quando REST, quando GraphQL</h3><div class="tblw"><table><tr><th></th><th>REST</th><th>GraphQL</th></tr>
<tr><td>Forma dei dati</td><td>fissata dal server</td><td>scelta dal client</td></tr>
<tr><td>Cache HTTP</td><td>semplice (GET, ETag)</td><td>più complessa</td></tr>
<tr><td>Endpoint</td><td>molti</td><td>uno</td></tr>
<tr><td>Ideale per</td><td>risorse, semplicità, cache</td><td>client diversi con esigenze diverse, dati molto collegati</td></tr></table></div>
<h3>Attenzione lato server</h3><ul><li>Query troppo profonde o costose: limiti di profondità/complessità, paginazione.</li><li>Il problema N+1 nei resolver: <b>DataLoader</b> raggruppa le letture.</li><li>Autorizzazione per campo e per oggetto.</li></ul>
<div class="say"><b>Cosa dire.</b> «Con GraphQL chiedo solo i campi necessari con variabili tipizzate, controllo sempre il campo errors e uso l'introspezione per l'autocompletamento nel client.»</div>`,
  [
    q(
      'q1',
      'Quale metodo HTTP usa tipicamente GraphQL?',
      ['POST su un solo endpoint', 'GET per tutto', 'PUT', 'Dipende dal campo'],
      0,
      'Corpo con query e variables.',
    ),
    q(
      'q2',
      'Dove guardi gli errori di una risposta GraphQL?',
      ['Nel campo errors (spesso con status 200)', 'Solo nello status HTTP', 'Negli header', 'Non ci sono errori'],
      0,
      'I test devono controllarlo.',
    ),
    q(
      'q3',
      'Perché usare le variabili?',
      [
        'Sicurezza e riuso della query, niente concatenazioni',
        'Per velocità sola',
        'Per i cookie',
        'Sono obbligatorie',
      ],
      0,
      'Evita injection e migliora la cache.',
    ),
    q(
      'q4',
      "A cosa serve l'introspezione?",
      ['Scoprire lo schema: autocompletamento e documentazione nei client', 'Cifrare', 'Fare backup', 'Misurare'],
      0,
      'Query su __schema.',
    ),
    q(
      'q5',
      'Cosa risolve DataLoader?',
      ["L'N+1 nei resolver, raggruppando le letture", "L'autenticazione", 'Il CORS', 'La compressione'],
      0,
      'Batching e cache per richiesta.',
    ),
  ],
  [
    card('c1', 'Richiesta', 'POST /graphql {"query": "...", "variables": {...}}.'),
    card('c2', 'Errori', 'Campo errors nella risposta (spesso HTTP 200).'),
    card('c3', 'Tre operazioni', 'query (lettura), mutation (scrittura), subscription (eventi).'),
    card('c4', 'Riuso di campi', 'Fragment.'),
    card('c5', 'Costi', 'Limiti di profondità/complessità e DataLoader per N+1.'),
  ],
  [
    prac(
      'p1',
      'Scrivi la query per ottenere nome del cliente e i suoi ultimi 3 ordini con importo.',
      '<pre><code>query($id: ID!) {\n  cliente(id: $id) {\n    nome\n    ordini(last: 3) { id totale }\n  }\n}</code></pre>',
    ),
    prac(
      'p2',
      'Perché un test che controlla solo status 200 su GraphQL non basta?',
      'GraphQL può rispondere 200 con errors e dati parziali: il test deve verificare che errors sia assente (o i codici attesi) e la forma di data.',
    ),
  ],
  'Note del vault: backend/graphql/graphql_index.md, graphql-client.md, graphql-schema.md',
)

export const realtime = mod(
  'realtime',
  'gRPC, webhook, WebSocket e SSE',
  'Altri stili di comunicazione e come provarli',
  'contratti',
  `<p class="lead">Non tutte le API sono richiesta-risposta su REST. Conoscere gli altri stili e come provarli a mano ti serve nel lavoro vero.</p>
<h3>gRPC</h3><ul><li>Contratto in <b>Protocol Buffers</b> (<code>.proto</code>), trasporto HTTP/2, messaggi binari: compatto e veloce; supporta streaming bidirezionale; client generati in molti linguaggi.</li><li>Ideale per comunicazione interna tra servizi.</li></ul>
<pre><code>service Ordini {
  rpc Crea (NuovoOrdine) returns (Ordine);
  rpc Segui (OrdineId) returns (stream Evento);
}</code></pre>
<pre><code>grpcurl -plaintext localhost:50051 list                       # servizi (con reflection)
grpcurl -plaintext localhost:50051 describe Ordini
grpcurl -plaintext -d '{"cliente_id": 7}' localhost:50051 Ordini/Crea</code></pre>
<p>Postman, Insomnia e Bruno hanno un client gRPC; senza reflection servono i file <code>.proto</code>.</p>
<h3>Webhook</h3><p>È il <b>server che chiama te</b> quando succede qualcosa (pagamento riuscito, push su git). Esponi un endpoint HTTPS; il provider invia un <code>POST</code> con l'evento.</p><ul><li><b>Verifica la firma</b> (HMAC nell'header): senza, chiunque può fingersi il provider.</li><li>Rispondi <b>2xx in fretta</b> e accoda il lavoro; il provider ritenta se non rispondi.</li><li>Sii <b>idempotente</b>: lo stesso evento può arrivare più volte; usa l'id evento.</li><li>Test locale: un tunnel (<code>ngrok</code>, <code>cloudflared</code>), oppure rigioca payload registrati con curl o con la dashboard del provider.</li></ul>
<h3>WebSocket</h3><p>Connessione persistente bidirezionale (<code>ws://</code>/<code>wss://</code>) dopo un upgrade HTTP: chat, notifiche, dati live.</p><pre><code>websocat wss://api.esempio.it/stream
# invia {"subscribe": "ordini"} e leggi gli eventi</code></pre><ul><li>Gestisci riconnessione, heartbeat (ping/pong) e autenticazione all'apertura.</li><li>Postman e Insomnia hanno un client WebSocket.</li></ul>
<h3>Server-Sent Events (SSE)</h3><p>Flusso <b>monodirezionale</b> server → client su HTTP (<code>Content-Type: text/event-stream</code>): più semplice di WebSocket quando il client deve solo ricevere (progresso, notifiche, risposte di LLM in streaming).</p><pre><code>curl -N -H "Accept: text/event-stream" https://api.esempio.it/eventi</code></pre><p><code>-N</code> disabilita il buffering per vedere gli eventi appena arrivano. Il browser ha <code>EventSource</code> con riconnessione automatica.</p>
<h3>Quando usare cosa</h3><div class="tblw"><table><tr><th>Bisogno</th><th>Scelta</th></tr>
<tr><td>API pubblica semplice</td><td>REST/JSON</td></tr>
<tr><td>Client con esigenze di dati diverse</td><td>GraphQL</td></tr>
<tr><td>Servizi interni, bassa latenza, streaming</td><td>gRPC</td></tr>
<tr><td>Notifica di eventi a sistemi esterni</td><td>Webhook</td></tr>
<tr><td>Aggiornamenti live bidirezionali</td><td>WebSocket</td></tr>
<tr><td>Flusso live solo dal server</td><td>SSE</td></tr></table></div>
<div class="say"><b>Cosa dire.</b> «REST per le API esposte, gRPC tra servizi interni, webhook firmati e idempotenti per gli eventi, SSE quando basta un flusso dal server e WebSocket solo se serve davvero la bidirezionalità.»</div>`,
  [
    q(
      'q1',
      'Cosa è un webhook?',
      [
        'Il server che chiama il tuo endpoint quando accade un evento',
        'Un client HTTP',
        'Un database',
        'Un tipo di token',
      ],
      0,
      'Spesso con firma HMAC.',
    ),
    q(
      'q2',
      'Cosa devi fare alla ricezione di un webhook?',
      [
        'Verificare la firma, rispondere 2xx subito, essere idempotente',
        'Ignorare la firma',
        'Rispondere dopo ore',
        'Rifiutare i duplicati sempre',
      ],
      0,
      'Il provider ritenta in caso di errore o timeout.',
    ),
    q(
      'q3',
      'Quale tra SSE e WebSocket è monodirezionale?',
      ['SSE', 'WebSocket', 'Entrambi', 'Nessuno'],
      0,
      'SSE: server → client su HTTP.',
    ),
    q(
      'q4',
      'Quale tool prova gRPC da terminale?',
      ['grpcurl', 'curl semplice', 'jq', 'ab'],
      0,
      'Con reflection o file .proto.',
    ),
    q(
      'q5',
      'A cosa serve <code>curl -N</code>?',
      ['Disabilita il buffering per vedere eventi in streaming', 'Segue i redirect', 'Salva su file', 'Cifra'],
      0,
      'Utile con SSE.',
    ),
  ],
  [
    card('c1', 'gRPC', 'Protocol Buffers su HTTP/2; provalo con grpcurl o i client grafici.'),
    card('c2', 'Webhook', 'Verifica firma HMAC, 2xx subito, idempotenza per id evento.'),
    card('c3', 'Streaming dal server', 'SSE: Content-Type text/event-stream; curl -N.'),
    card('c4', 'Bidirezionale', 'WebSocket (wss://), con heartbeat e riconnessione.'),
    card('c5', 'Testare i webhook in locale', 'Tunnel (ngrok/cloudflared) o replay del payload con curl.'),
  ],
  [
    prac(
      'p1',
      'Implementa in sicurezza un endpoint per i webhook di pagamento.',
      'HTTPS, verifica della firma HMAC con segreto condiviso e tolleranza di timestamp, risposta 2xx immediata, evento accodato, idempotenza con id evento univoco, log e riconciliazione periodica.',
    ),
    prac(
      'p2',
      "Un'app mostra l'avanzamento di un'elaborazione in tempo reale: SSE o WebSocket?",
      'SSE se il flusso è solo dal server (più semplice, riconnessione automatica, funziona su HTTP); WebSocket se il client deve anche inviare messaggi frequenti.',
    ),
  ],
  'Note del vault: backend/grpc-patterns.md, graphql/*, tooling/networking-http.md',
)

export const apiTesting = mod(
  'testing',
  'Testare le API: smoke, contratto, integrazione',
  'Cosa verificare, strumenti, CI, dati di test, errori',
  'qualita',
  `<p class="lead">Provare un'API a mano non basta: servono controlli ripetibili. La domanda è <b>cosa</b> verificare a ogni livello.</p>
<h3>I livelli</h3><div class="tblw"><table><tr><th>Livello</th><th>Cosa verifica</th><th>Strumenti</th></tr>
<tr><td>Unitari</td><td>logica del servizio senza rete</td><td>pytest, jest</td></tr>
<tr><td>Integrazione</td><td>API + database reali in locale/CI</td><td>pytest con TestClient, supertest, Testcontainers</td></tr>
<tr><td>Contratto</td><td>la risposta rispetta lo schema</td><td>Schemathesis, Dredd, Pact</td></tr>
<tr><td>Smoke</td><td>dopo il deploy: l'essenziale funziona</td><td>Bruno CLI, Newman, curl</td></tr>
<tr><td>Carico</td><td>latenza e throughput sotto stress</td><td>k6, locust</td></tr></table></div>
<h3>Cosa asserire</h3><ul><li><b>Status code</b> corretto (anche per gli errori).</li><li><b>Forma</b> della risposta: campi obbligatori, tipi (schema JSON).</li><li><b>Valori chiave</b>, non l'intero body (timestamp e id cambiano).</li><li><b>Header</b> importanti: <code>Location</code>, <code>Content-Type</code>, cache.</li><li><b>Tempo di risposta</b> entro una soglia ragionevole per gli smoke test.</li></ul>
<h3>I casi che si dimenticano</h3><ul><li>401 senza token, 403 con un utente senza permessi, 404 su id inesistente.</li><li>422 con input non valido (campi mancanti, tipi sbagliati, limiti).</li><li>Idempotenza: ripetere un POST con la stessa chiave.</li><li>Paginazione: ultima pagina, pagina vuota, cursore non valido.</li><li>Concorrenza: due richieste insieme sulla stessa risorsa.</li></ul>
<h3>Smoke test dopo il deploy</h3><ol><li><code>GET /health</code> risponde 200.</li><li>Login con un utente di test.</li><li>Una lettura reale.</li><li>Una scrittura e relativa pulizia.</li></ol><pre><code>bru run -r --env staging --reporter-junit smoke.xml
newman run smoke.json -e staging.json</code></pre><p>Se fallisce, la pipeline blocca il rilascio o fa rollback.</p>
<h3>Dati di test</h3><ul><li>Ambiente dedicato (staging) con utenti e dati di prova; mai test distruttivi su produzione.</li><li>Ogni test crea i dati che usa e li ripulisce (o usa un database ricreato).</li><li>Test indipendenti dall'ordine di esecuzione.</li></ul>
<h3>Test del contratto con Schemathesis</h3><pre><code>schemathesis run https://staging.esempio.it/openapi.json --checks all</code></pre><p>Genera richieste (anche strane) dalla specifica e controlla che l'API non risponda con 500 e rispetti lo schema.</p>
<h3>Test di carico</h3><ul><li>Scenari realistici, rampa graduale, guarda p95/p99, errori e saturazione (CPU, connessioni database).</li><li>k6 usa script JavaScript; locust Python.</li></ul>
<h3>Trappole</h3><ul><li>Suite che verificano solo il caso felice.</li><li>Test che dipendono da dati condivisi o dall'ordine.</li><li>Asserzioni sul body intero (fragili).</li><li>Ambienti di test non rappresentativi della produzione.</li></ul>
<div class="say"><b>Cosa dire.</b> «Test di integrazione nel codice, test di contratto dalla specifica, smoke test con Bruno/Newman dopo ogni deploy e un test di carico sui flussi critici, sempre includendo i casi di errore.»</div>`,
  [
    q(
      'q1',
      'Cosa ti dice uno smoke test dopo il deploy?',
      [
        "Che l'essenziale funziona (health, login, una lettura e una scrittura)",
        'Che non ci sono bug',
        'Le prestazioni sotto carico',
        'La copertura',
      ],
      0,
      'È un controllo veloce, non esaustivo.',
    ),
    q(
      'q2',
      "Perché non asserire l'intero body?",
      ['Id e timestamp cambiano: test fragili', 'È vietato', 'È più lento', 'Non funziona in JSON'],
      0,
      'Verifica campi e valori chiave.',
    ),
    q(
      'q3',
      'Cosa fa Schemathesis?',
      ['Genera richieste dalla specifica e controlla le risposte', 'Fa il deploy', 'Crea indici', 'Mocka il database'],
      0,
      'Trova 500 e violazioni di schema.',
    ),
    q(
      'q4',
      'Quale caso viene spesso dimenticato?',
      ['401/403/404/422', 'Solo il 200', 'Solo GET', 'Il nome'],
      0,
      'Gli errori vanno testati.',
    ),
    q(
      'q5',
      'Dove eseguire i test distruttivi?',
      ['In un ambiente dedicato, mai in produzione', 'In produzione', 'Ovunque', 'Sul portatile del cliente'],
      0,
      'Dati di prova isolati.',
    ),
  ],
  [
    card('c1', 'Smoke test', 'health → login → una lettura → una scrittura con pulizia.'),
    card('c2', 'Cosa asserire', 'Status, forma (schema), valori chiave, header, tempo.'),
    card('c3', 'Contratto', 'Schemathesis/Dredd/Pact dalla specifica.'),
    card('c4', 'Carico', 'k6 o locust; osserva p95/p99, errori e saturazione.'),
    card('c5', 'Indipendenza', 'Ogni test crea e ripulisce i propri dati.'),
  ],
  [
    prac(
      'p1',
      'Quali test scrivi per un endpoint POST /ordini?',
      'Caso felice (201 + Location + campi), validazione 422 (campi mancanti/limiti), 401 senza token, 403 senza permessi, idempotenza con la stessa chiave, conflitto 409, effetti sul database, concorrenza.',
    ),
    prac(
      'p2',
      'Come integri gli smoke test nella pipeline di deploy?',
      "Dopo il deploy in staging eseguo bru run/newman con l'ambiente di staging; se fallisce blocco la promozione; dopo la produzione lancio un sottoinsieme di sola lettura con un utente di test; allarme e rollback in caso di errore.",
    ),
  ],
  'Note del vault: tooling/testing/bruno-api-smoke-tests.md, testcontainers-contract-testing.md, regression-testing.md',
)

export const debug = mod(
  'debug',
  'Debug delle API: cosa guardare quando non funziona',
  'DevTools, proxy, log, errori comuni e metodo',
  'qualita',
  `<p class="lead">Una chiamata fallisce: dove cerchi? Un metodo ordinato batte il tentativo casuale.</p>
<h3>Il metodo</h3><ol><li><b>Riproduci</b> con lo strumento più semplice (curl) per escludere il client applicativo.</li><li><b>Leggi la risposta intera</b>: status, header, body dell'errore, <code>request id</code>.</li><li><b>Confronta</b> con una chiamata che funziona (stesso endpoint, altro utente/ambiente).</li><li><b>Restringi</b>: rete, auth, formato, dati, server.</li><li>Cerca nei log del server con il request id.</li></ol>
<h3>Errori comuni per codice</h3><div class="tblw"><table><tr><th>Codice</th><th>Cause tipiche</th><th>Cosa controllare</th></tr>
<tr><td>400</td><td>JSON non valido, parametro mancante</td><td>body, Content-Type, parsing</td></tr>
<tr><td>401</td><td>token mancante/scaduto/sbagliato</td><td>header Authorization, scadenza, ambiente</td></tr>
<tr><td>403</td><td>permessi insufficienti, IP/WAF (il CORS non dà 403: è un blocco del browser)</td><td>scope, ruolo, policy</td></tr>
<tr><td>404</td><td>percorso o id sbagliato, versione</td><td>URL, base path, trailing slash</td></tr>
<tr><td>405</td><td>metodo non ammesso</td><td>header <code>Allow</code></td></tr>
<tr><td>409 / 422</td><td>conflitto / validazione</td><td>corpo con i dettagli</td></tr>
<tr><td>429</td><td>rate limit</td><td><code>Retry-After</code>, quote</td></tr>
<tr><td>500</td><td>bug del server</td><td>log con request id, traceback</td></tr>
<tr><td>502/503/504</td><td>servizio a monte giù o lento</td><td>proxy, health, timeout</td></tr></table></div>
<h3>Strumenti</h3><ul><li><b>curl -v</b>: richiesta e risposta complete, handshake TLS.</li><li><b>DevTools → Network</b> del browser: vedi richieste reali, header, tempi, "Copy as cURL", pre-flight CORS.</li><li><b>Proxy di ispezione</b>: mitmproxy, Charles, Proxyman, Fiddler per vedere (e modificare) il traffico di un'app; per HTTPS serve installare il certificato del proxy.</li><li><b>Log del server</b> e <b>tracing</b> (request id, OpenTelemetry).</li><li><b>Wireshark/tcpdump</b> per problemi di rete di basso livello.</li></ul>
<h3>Problemi tipici</h3><ul><li><b>Ambiente sbagliato</b>: stai chiamando staging con un token di produzione.</li><li><b>Token scaduto</b> o con scope insufficienti.</li><li><b>Ora del sistema</b> sballata (JWT "non ancora valido").</li><li><b>Certificato</b> non fidato, nome host non corrispondente.</li><li><b>Redirect</b> che trasforma un POST in GET (301/302): usa 307/308 o l'URL finale.</li><li><b>Proxy aziendale</b>/VPN, DNS, IPv6.</li><li><b>Trailing slash</b> o maiuscole nel percorso.</li><li><b>Timeout</b> troppo bassi o chiamate che bloccano il server.</li></ul>
<h3>Correlazione</h3><p>Includi un <code>X-Request-Id</code> nelle chiamate e nei log: puoi seguire una richiesta tra client, gateway, servizi e database. Quando segnali un bug, allega request id, ora (UTC), endpoint e un esempio curl riproducibile (senza segreti).</p>
<h3>Segnalare un problema in modo utile</h3><ul><li>Cosa ti aspettavi e cosa è successo.</li><li>La richiesta minima che lo riproduce (curl).</li><li>Risposta completa con header e request id.</li><li>Ambiente e ora.</li></ul>
<div class="say"><b>Cosa dire.</b> «Riproduco con curl, leggo status, header e corpo dell'errore con il request id, confronto con una chiamata funzionante e restringo il campo prima di toccare il codice.»</div>`,
  [
    q(
      'q1',
      'Primo passo quando una chiamata fallisce?',
      ['Riprodurla con uno strumento semplice come curl', 'Riscrivere il client', 'Riavviare il server', 'Ignorarla'],
      0,
      'Esclude il codice applicativo.',
    ),
    q(
      'q2',
      'Quale codice indica un metodo non ammesso?',
      ['405', '404', '409', '500'],
      0,
      "L'header Allow elenca i metodi consentiti.",
    ),
    q(
      'q3',
      'Perché un POST può diventare GET dopo un redirect 301/302?',
      ['Molti client cambiano il metodo; con 307/308 resta uguale', 'Per sicurezza', 'Per velocità', 'Non succede mai'],
      0,
      "Usa l'URL finale o 307/308.",
    ),
    q(
      'q4',
      'A cosa serve il request id?',
      ['Seguire una richiesta tra client, servizi e log', 'Autenticare', 'Comprimere', 'Cache'],
      0,
      'Indispensabile per la correlazione.',
    ),
    q(
      'q5',
      "Quale strumento permette di ispezionare il traffico HTTPS di un'app?",
      ['Un proxy come mitmproxy/Proxyman con certificato installato', 'ping', 'ls', 'git'],
      0,
      'Vedi e modifichi richieste e risposte.',
    ),
  ],
  [
    card(
      'c1',
      'Metodo',
      'Riproduci con curl → leggi risposta e request id → confronta con una chiamata funzionante → restringi.',
    ),
    card('c2', '401 vs 403', '401 credenziali assenti o invalide; 403 permessi insufficienti.'),
    card('c3', '5xx a monte', '502/503/504: proxy, salute e timeout del servizio dietro.'),
    card('c4', 'Browser', 'DevTools → Network → Copy as cURL; pre-flight CORS visibile.'),
    card('c5', 'Segnalazione', 'Attesa vs realtà, curl minimo, risposta con request id, ambiente e ora.'),
  ],
  [
    prac(
      'p1',
      "Un'app mobile riceve 401 solo su alcuni telefoni: come indaghi?",
      "Controllo scadenza e refresh del token, ora del dispositivo, ambiente/URL usato, header inviati (proxy di ispezione), differenze di versione dell'app, log con request id lato server.",
    ),
    prac(
      'p2',
      'Una chiamata funziona in curl ma non dal frontend: cosa sospetti?',
      'CORS (origin, pre-flight), header mancanti nel browser, cookie/credenziali, mixed content, differenze di Content-Type o redirect; guardo la scheda Network e la console.',
    ),
  ],
  'Note del vault: tooling/networking-http.md, python/http-clients.md, tooling/opentelemetry/*',
)

export const resilient = mod(
  'resilient',
  'Usare le API in modo robusto: paginazione, limiti, retry',
  'Client affidabili: timeout, backoff, rate limit, idempotenza, cache',
  'qualita',
  `<p class="lead">Un client ingenuo funziona nel demo e si rompe in produzione. Questi accorgimenti rendono robusta qualsiasi integrazione con API esterne.</p>
<h3>Timeout sempre</h3><pre><code>import httpx
client = httpx.Client(timeout=httpx.Timeout(10.0, connect=3.0))
r = client.get(url)
r.raise_for_status()</code></pre><p>Mai chiamate senza timeout: un servizio lento bloccherebbe l'intera applicazione. Riusa il client (connessioni persistenti).</p>
<h3>Retry con backoff</h3><ul><li>Ritenta solo gli errori <b>transitori</b>: timeout, 429, 502, 503, 504 (e connessioni cadute).</li><li><b>Non</b> ritentare 400/401/403/404/422: non cambieranno.</li><li><b>Backoff esponenziale con jitter</b>: attese 1s, 2s, 4s… con una parte casuale per non sincronizzare i client; massimo di tentativi.</li><li>Rispetta <code>Retry-After</code> quando presente.</li><li>Ritenta solo operazioni <b>idempotenti</b>, oppure usa un <code>Idempotency-Key</code> per i POST.</li></ul>
<pre><code>for tentativo in range(5):
    r = client.get(url)
    if r.status_code in (429, 503):
        attesa = int(r.headers.get("Retry-After", 2 ** tentativo)) + random.random()   # Retry-After può essere anche una data HTTP: gestiscila
        time.sleep(attesa)
        continue
    r.raise_for_status()
    break</code></pre>
<h3>Rate limit</h3><ul><li>Leggi gli header di quota (<code>RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>) e rallenta prima del 429.</li><li>Limita la concorrenza lato client (semaforo, pool) e raggruppa le richieste (batch) quando l'API lo permette.</li></ul>
<h3>Paginazione</h3><pre><code>def tutti(client, url):
    cursore = None
    while True:
        r = client.get(url, params={"limit": 100, "after": cursore})
        r.raise_for_status()
        dati = r.json()
        yield from dati["items"]
        cursore = dati.get("next_cursor")
        if not cursore:
            break</code></pre><ul><li>Segui sempre <code>next</code>/<code>next_cursor</code>/<code>Link</code>: non assumere che i risultati stiano in una pagina.</li><li>Un generatore evita di tenere tutto in memoria.</li></ul>
<h3>Idempotenza e duplicati</h3><p>Se un POST va in timeout non sai se il server l'ha eseguito. Usa una <b>chiave di idempotenza</b> per riprovare senza creare doppioni, oppure verifica con una GET prima di ripetere.</p>
<h3>Cache e richieste condizionali</h3><ul><li>Rispetta <code>Cache-Control</code>; usa <code>ETag</code> + <code>If-None-Match</code> per ricevere <code>304</code> invece di riscaricare.</li><li>Cache locale con TTL per dati che cambiano poco.</li></ul>
<h3>Circuit breaker e fallback</h3><ul><li>Se un servizio fallisce a ripetizione, smetti di chiamarlo per un po' (circuit breaker) invece di peggiorare la situazione.</li><li>Prevedi un comportamento degradato (cache, valore di default, messaggio all'utente).</li></ul>
<h3>Tolleranza ai cambi</h3><ul><li>Ignora i campi sconosciuti; non assumere l'ordine dei campi.</li><li>Controlla il corpo dell'errore e gestisci i formati inattesi senza crash.</li><li>Valida le risposte esterne (Pydantic/zod) ai confini del tuo sistema.</li></ul>
<h3>Sicurezza dell'integrazione</h3><ul><li>Segreti da variabili d'ambiente, non nel codice o nei log.</li><li>Verifica i certificati (non disattivare <code>verify</code>).</li><li>Non registrare token né dati personali nei log.</li></ul>
<div class="say"><b>Cosa dire.</b> «Ogni client ha timeout, retry con backoff e jitter solo su errori transitori e operazioni idempotenti, rispetta rate limit e paginazione e degrada in modo controllato.»</div>`,
  [
    q(
      'q1',
      'Quali errori si ritentano?',
      ['Transitori: timeout, 429, 502/503/504', 'Tutti', '400 e 404', 'Solo 500'],
      0,
      'Gli errori del client non cambiano con un retry.',
    ),
    q(
      'q2',
      'Perché il jitter nel backoff?',
      [
        'Evita che molti client riprovino nello stesso istante',
        'Rende i tentativi più rapidi',
        'Riduce i log',
        'È uno standard HTTP',
      ],
      0,
      'Evita l\'effetto "thundering herd".',
    ),
    q(
      'q3',
      'Come riprovi un POST senza creare doppioni?',
      ['Con una chiave di idempotenza', 'Non si può', 'Cambiando metodo', 'Aumentando il timeout'],
      0,
      'Il server restituisce lo stesso risultato per la stessa chiave.',
    ),
    q(
      'q4',
      'Cosa fai con <code>Retry-After</code>?',
      ['Lo rispetti prima di riprovare', 'Lo ignori', 'Lo cancelli', 'Lo cifri'],
      0,
      'Indica quando riprovare.',
    ),
    q(
      'q5',
      'A cosa serve un circuit breaker?',
      ['Smettere di chiamare un servizio che fallisce ripetutamente', 'Fare cache', 'Autenticare', 'Comprimere'],
      0,
      'Evita di peggiorare il guasto.',
    ),
  ],
  [
    card(
      'c1',
      'Retry',
      'Solo errori transitori, backoff esponenziale con jitter, massimo di tentativi, operazioni idempotenti.',
    ),
    card('c2', 'Paginazione', 'Segui next_cursor/Link in un ciclo o generatore.'),
    card('c3', 'POST ripetibile', 'Idempotency-Key.'),
    card('c4', 'Riscaricare meno', 'ETag + If-None-Match → 304.'),
    card('c5', 'Servizio instabile', 'Circuit breaker e comportamento degradato.'),
  ],
  [
    prac(
      'p1',
      "Scrivi a voce come integri un'API di pagamento esterna in modo affidabile.",
      "Timeout e client riusato, idempotency key sui pagamenti, retry con backoff solo su errori transitori, webhook firmati e idempotenti per l'esito, riconciliazione periodica, circuit breaker, log senza dati sensibili.",
    ),
    prac(
      'p2',
      "Importi 2 milioni di record da un'API a pagine: come procedi?",
      'Paginazione a cursore con generatore, concorrenza limitata, rispetto dei rate limit e Retry-After, checkpoint del cursore per riprendere, scrittura in batch idempotente, metriche e allarmi.',
    ),
  ],
  'Note del vault: python/http-clients.md, backend/rest-api-design.md',
)

export const apiDrills = mod(
  'drills',
  'Esercizi pratici con API pubbliche',
  '12 esercizi da fare con curl, Bruno o Postman su API gratuite',
  'pratica',
  `<p class="lead">Si impara chiamando API vere. Questi esercizi usano API pubbliche gratuite (<code>httpbin.org</code>, <code>jsonplaceholder.typicode.com</code>, <code>pokeapi.co</code>). Servono connessione: fai gli esercizi quando sei online, poi rileggi le soluzioni offline.</p>
<h3>Come procedere</h3><ul><li>Prova prima con <b>curl</b>, poi ricrea la richiesta in <b>Bruno</b> o <b>Postman</b>, salvandola in una collezione con ambiente.</li><li>Aggiungi sempre <code>assert</code>/test su status e campi chiave.</li><li>Prova anche i casi di errore (risorsa inesistente, JSON non valido).</li></ul>
<h3>API di riferimento</h3><ul><li><code>httpbin.org</code>: rimanda ciò che invii (<code>/get</code>, <code>/post</code>, <code>/headers</code>, <code>/status/418</code>, <code>/delay/3</code>, <code>/basic-auth/user/pass</code>, <code>/bearer</code>).</li><li><code>jsonplaceholder.typicode.com</code>: <code>/posts</code>, <code>/users</code>, <code>/comments</code> (CRUD finto).</li><li><code>pokeapi.co/api/v2</code>: dati reali con paginazione (<code>?limit=20&amp;offset=0</code>).</li></ul>`,
  [],
  [
    card('c1', 'Vedere ciò che invii', 'httpbin.org/anything restituisce metodo, header, body.'),
    card('c2', 'Provare un errore', 'httpbin.org/status/404 (o 500, 429).'),
    card('c3', 'Provare timeout', 'httpbin.org/delay/5 con --max-time 2.'),
    card('c4', 'Basic auth', 'curl -u user:pass httpbin.org/basic-auth/user/pass.'),
  ],
  [
    prac(
      'a1',
      'Scarica i primi 5 post e stampa solo i titoli.',
      '<pre><code>curl -s "https://jsonplaceholder.typicode.com/posts?_limit=5" | jq -r \'.[].title\'</code></pre>',
    ),
    prac(
      'a2',
      "Crea un post e leggi l'id restituito.",
      '<pre><code>curl -s -X POST https://jsonplaceholder.typicode.com/posts \\\n  --json \'{"title":"ciao","body":"prova","userId":1}\' | jq .id</code></pre>Nota: l\'API finge la creazione (risponde 201 ma non salva).',
    ),
    prac(
      'a3',
      'Verifica gli header che invia il tuo client.',
      '<pre><code>curl -s https://httpbin.org/headers -H "X-Prova: 1" | jq</code></pre>',
    ),
    prac(
      'a4',
      "Prova l'autenticazione Basic corretta e sbagliata.",
      '<pre><code>curl -i -u user:pass https://httpbin.org/basic-auth/user/pass   # 200\ncurl -i -u user:no   https://httpbin.org/basic-auth/user/pass   # 401</code></pre>',
    ),
    prac(
      'a5',
      'Misura il tempo di una chiamata lenta con timeout.',
      '<pre><code>curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" --max-time 2 https://httpbin.org/delay/5   # 000 dopo ~2s</code></pre>',
    ),
    prac(
      'a6',
      'Scorri tutte le pagine di PokeAPI per contare i Pokémon.',
      '<pre><code>url="https://pokeapi.co/api/v2/pokemon?limit=100"\ntot=0\nwhile [ "$url" != "null" ]; do\n  r=$(curl -s "$url")\n  tot=$((tot + $(echo "$r" | jq ".results | length")))\n  url=$(echo "$r" | jq -r .next)\ndone\necho $tot</code></pre>',
    ),
    prac(
      'a7',
      'Crea in Bruno una richiesta con asserzione sullo status e un test sul corpo.',
      'Richiesta GET {{baseUrl}}/posts/1; assert { res.status: eq 200 }; tests: expect(res.body).to.have.property("title"); salva la collezione in git con ambiente "jsonplaceholder".',
    ),
    prac(
      'a8',
      "In Postman concatena due richieste: crea e poi leggi con l'id salvato.",
      'Nei Tests della prima: pm.environment.set("id", pm.response.json().id); nella seconda usa {{id}} nell\'URL e aggiungi un pm.test sullo status.',
    ),
    prac(
      'a9',
      'Simula un errore 429 e gestiscilo in uno script.',
      'Chiama httpbin.org/status/429 e, se lo status è 429, leggi Retry-After (o usa un backoff esponenziale con jitter) prima di riprovare, con un massimo di tentativi.',
    ),
    prac(
      'a10',
      'Importa in Bruno/Postman una specifica OpenAPI pubblica (es. petstore).',
      'Importa https://petstore3.swagger.io/api/v3/openapi.json, imposta la variabile baseUrl, prova GET /pet/findByStatus, aggiungi asserzioni e un ambiente.',
    ),
    prac(
      'a11',
      'Ricostruisci in curl una chiamata copiata dai DevTools del browser.',
      'Network → clic destro sulla richiesta → Copy as cURL; rimuovi header superflui e cookie sensibili, parametrizza il token con una variabile e riprova.',
    ),
    prac(
      'a12',
      "Documenta un'API in un file .http eseguibile.",
      'Un file con variabili @baseUrl, richieste separate da ### per login, lista, creazione e cancellazione, con commenti sui risultati attesi.',
    ),
  ],
)

export const apiInterview = mod(
  'interview',
  'Domande da colloquio su API',
  '20 domande con risposta breve da dire a voce',
  'pratica',
  `<p class="lead">Rispondi a voce in 30-60 secondi, poi confronta con la traccia.</p>`,
  [],
  [
    card('c1', 'Idempotente', 'Ripetere la richiesta ha lo stesso effetto di una volta (GET, PUT, DELETE).'),
    card('c2', '401 vs 403', 'Non autenticato / autenticato ma non autorizzato.'),
    card('c3', 'Paginazione', "Cursore preferito all'offset su dati che cambiano."),
    card('c4', 'Retry', 'Solo errori transitori, backoff con jitter, operazioni idempotenti.'),
  ],
  [
    prac(
      'i1',
      'Differenza tra PUT e PATCH?',
      "PUT sostituisce l'intera risorsa ed è idempotente; PATCH modifica parzialmente ed è di solito idempotente se espressa come stato finale.",
    ),
    prac(
      'i2',
      'Cosa significa idempotente e perché conta?',
      'Ripetere la richiesta ha lo stesso effetto di una; rende sicuri i retry dopo timeout.',
    ),
    prac(
      'i3',
      '401 contro 403?',
      '401 non autenticato (credenziali mancanti o invalide), 403 autenticato ma senza permessi.',
    ),
    prac(
      'i4',
      'Come si progetta la paginazione di una lista che cambia?',
      'Cursore/keyset con ordinamento stabile (es. creato + id), next_cursor nella risposta, limite massimo.',
    ),
    prac(
      'i5',
      "Come versioni un'API?",
      'Nel percorso o header; cambi compatibili senza nuova versione; deprecazioni con Deprecation/Sunset e finestra di migrazione.',
    ),
    prac(
      'i6',
      'Come garantisci che un POST non crei duplicati?',
      "Idempotency-Key con salvataggio dell'esito per chiave e vincolo di unicità.",
    ),
    prac(
      'i7',
      "Che cos'è un JWT e quali sono i rischi?",
      'Token firmato con claim; non cifrato; difficile da revocare; verifica firma, exp, aud, iss e algoritmo; scadenza breve e refresh.',
    ),
    prac(
      'i8',
      "Quale flusso OAuth2 per un'app e per un servizio?",
      'App con utente: Authorization Code + PKCE; servizio-a-servizio: Client Credentials.',
    ),
    prac(
      'i9',
      "Cos'è il CORS?",
      'Meccanismo del browser che blocca richieste cross-origin senza gli header consentiti dal server; non riguarda curl né i client server-side.',
    ),
    prac(
      'i10',
      "Cos'è un IDOR e come lo previeni?",
      "Accesso agli oggetti altrui cambiando un id: controlla l'autorizzazione per oggetto lato server, non solo il ruolo.",
    ),
    prac(
      'i11',
      'REST contro GraphQL contro gRPC?',
      'REST: risorse e cache semplici; GraphQL: il client sceglie i campi, un endpoint; gRPC: contratto binario HTTP/2 per servizi interni e streaming.',
    ),
    prac(
      'i12',
      'Come gestisci i webhook?',
      'Verifica firma, 2xx subito, accodare il lavoro, idempotenza per id evento, retry del provider, riconciliazione.',
    ),
    prac(
      'i13',
      "Come testi un'API?",
      'Unitari e integrazione nel codice, contratto dalla specifica, smoke test con Bruno/Newman dopo il deploy, test di carico; includo i casi di errore.',
    ),
    prac(
      'i14',
      'Bruno o Postman?',
      'Bruno per collezioni in git senza cloud; Postman per esplorazione e collaborazione; per CI uso la CLI o test nel codice.',
    ),
    prac(
      'i15',
      'Come debug una chiamata che fallisce?',
      'Riproduco con curl, leggo status/header/corpo e request id, confronto con una chiamata funzionante, restringo (rete, auth, formato, dati) e consulto i log.',
    ),
    prac(
      'i16',
      'Come rendi robusto un client HTTP?',
      'Timeout, retry con backoff e jitter solo transitori, rispetto di rate limit e Retry-After, paginazione, idempotenza, circuit breaker, validazione delle risposte.',
    ),
    prac(
      'i17',
      "Che cos'è OpenAPI e come lo usi?",
      'Contratto in YAML/JSON: documentazione, import nei client, generazione di tipi e client, mock, test di contratto, rilevamento di cambi incompatibili.',
    ),
    prac(
      'i18',
      "Come proteggi un'API pubblica?",
      'HTTPS, autenticazione e autorizzazione per oggetto, validazione input, rate limit, limiti di dimensione, CORS, logging senza dati sensibili.',
    ),
    prac(
      'i19',
      'Cosa metti in una risposta di errore?',
      'Status corretto, tipo/titolo/dettaglio (problem+json), dettagli per campo, request id; mai stack trace.',
    ),
    prac(
      'i20',
      'Come scegli tra polling, webhook, SSE e WebSocket?',
      'Polling per semplicità e bassa frequenza; webhook per eventi tra sistemi; SSE per flussi dal server; WebSocket per comunicazione bidirezionale a bassa latenza.',
    ),
  ],
)
