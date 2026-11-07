import { card, mod, prac, q } from '../kit'

// API course, round 2 (from the council review): API security, runners and CI, async APIs, observability.

export const apisec = mod(
  'apisec',
  'Sicurezza delle API (OWASP API Top 10)',
  'BOLA, mass assignment, SSRF, esposizione di dati, limiti, errori di configurazione',
  'auth',
  `<p class="lead">Le API espongono direttamente dati e logica: sono il bersaglio principale. L'elenco <b>OWASP API Security Top 10</b> è la mappa degli errori più comuni.</p>
<h3>Autorizzazione rotta (la causa numero uno)</h3><ul><li><b>BOLA</b> (Broken Object Level Authorization, l'IDOR delle API): <code>GET /ordini/123</code> restituisce l'ordine di un altro utente perché il server controlla solo che tu sia autenticato. Difesa: ogni accesso a un oggetto verifica che quell'utente possa vederlo (<code>WHERE id = :id AND utente_id = :me</code>).</li><li><b>BFLA</b> (livello di funzione): un utente normale chiama <code>DELETE /admin/utenti/5</code>. Difesa: controlli di ruolo/scope su ogni endpoint, negazione di default.</li><li><b>Prova da tester</b>: ripeti le richieste con il token di un altro utente e con id altrui; se funziona, è una vulnerabilità.</li></ul>
<h3>Esposizione eccessiva dei dati</h3><ul><li>Restituire l'intero oggetto del database (con <code>password_hash</code>, <code>is_admin</code>, note interne). Difesa: schemi di risposta espliciti (Pydantic <code>response_model</code>), mai serializzare direttamente il modello.</li><li><b>Mass assignment</b>: il client invia <code>{"nome":"Ada","is_admin":true}</code> e il server lo scrive tutto. Difesa: schemi di input con lista di campi permessi, ignora/rifiuta il resto (<code>extra="forbid"</code>).</li></ul>
<h3>Autenticazione debole</h3><ul><li>Nessun limite sui tentativi di login, token che non scadono, JWT con algoritmo <code>none</code> accettato, segreti deboli.</li><li>Difesa: rate limit sul login, MFA, scadenze brevi, verifica di firma e algoritmo, rotazione dei segreti, risposte uniformi (non rivelare se l'utente esiste).</li></ul>
<h3>Consumo di risorse senza limiti</h3><ul><li>Pagine enormi (<code>?limit=1000000</code>), upload illimitati, query GraphQL profonde, operazioni costose senza quota.</li><li>Difesa: massimi su <code>limit</code>, dimensione del body, timeout, rate limit per chiave, limiti di complessità.</li></ul>
<h3>SSRF e consumo non sicuro di API</h3><ul><li><b>SSRF</b>: il server scarica un URL fornito dall'utente (<code>immagine_url</code>, webhook): può essere puntato a <code>http://169.254.169.254/</code> (metadata del cloud) o a reti interne. Difesa: allowlist di host, blocco IP privati dopo la risoluzione DNS, niente redirect liberi, timeout.</li><li>Fidarsi ciecamente di API esterne: valida le risposte e gestisci gli errori.</li></ul>
<h3>Configurazione e inventario</h3><ul><li>CORS permissivo (<code>*</code> con credenziali), debug acceso, stack trace nelle risposte, header di sicurezza mancanti, HTTP senza TLS.</li><li>Versioni vecchie dimenticate (<code>/v1</code> senza patch) e endpoint di test in produzione: tieni un <b>inventario</b> e spegni ciò che non serve.</li></ul>
<h3>Iniezione</h3><ul><li>SQL/NoSQL injection anche tramite filtri e ordinamenti (<code>?sort=nome; DROP...</code>): query parametrizzate e allowlist per i nomi di colonna.</li><li>Command injection e path traversal sui parametri di file.</li></ul>
<h3>Strumenti</h3><ul><li><b>Schemathesis</b>, <b>OWASP ZAP</b>, <b>Burp Suite</b> per test automatici e manuali; Bruno/Postman per riprovare le richieste con altri token.</li><li>Test automatici di autorizzazione: per ogni endpoint un test con utente senza permessi e uno con un altro utente.</li></ul>
<h3>Checklist rapida per ogni endpoint</h3><ol><li>Chi può chiamarlo? (autenticazione e ruolo)</li><li>Su quali oggetti? (controllo per oggetto)</li><li>Quali campi può scrivere e leggere? (schemi espliciti)</li><li>Quanto può costare? (limiti)</li><li>Cosa succede se l'input è ostile? (validazione)</li><li>Cosa finisce nei log? (niente segreti)</li></ol>
<div class="say"><b>Cosa dire.</b> «Controllo l'autorizzazione per oggetto su ogni endpoint, uso schemi espliciti contro mass assignment ed eccesso di dati, limito risorse e prevengo SSRF con allowlist.»</div>`,
  [
    q(
      'q1',
      'Cosa è BOLA?',
      [
        'Accedere a oggetti di altri utenti perché manca il controllo per oggetto',
        'Un tipo di token',
        'Un attacco DNS',
        'Un flusso OAuth',
      ],
      0,
      "È l'IDOR delle API: la vulnerabilità più comune.",
    ),
    q(
      'q2',
      'Come si previene il mass assignment?',
      ['Schemi di input con campi permessi e rifiuto del resto', 'Cifrando il body', 'Usando PUT', 'Con più thread'],
      0,
      'Il client non deve poter scrivere is_admin o campi interni.',
    ),
    q(
      'q3',
      "Qual è il bersaglio tipico dell'SSRF nel cloud?",
      ["L'endpoint dei metadata (169.254.169.254)", 'Il DNS pubblico', 'Il browser', 'Il database di test'],
      0,
      "Può esporre credenziali dell'istanza.",
    ),
    q(
      'q4',
      'Come provi a mano un BOLA?',
      [
        'Ripeti la richiesta con il token di un altro utente o con id altrui',
        'Cambi il Content-Type',
        'Usi HTTP/2',
        'Aumenti il timeout',
      ],
      0,
      'Se funziona, manca il controllo per oggetto.',
    ),
    q(
      'q5',
      'Cosa fai per evitare risposte con campi interni?',
      [
        'Schemi di risposta espliciti (response_model)',
        'Restituire il modello intero',
        'Comprimere',
        'Nascondere nel client',
      ],
      0,
      'Il filtro va lato server.',
    ),
  ],
  [
    card('c1', 'BOLA', "Ogni accesso a un oggetto verifica che quell'utente possa vederlo (filtra per proprietario)."),
    card(
      'c2',
      'Mass assignment',
      'Schemi di input espliciti (extra="forbid"); mai scrivere il body intero sul modello.',
    ),
    card('c3', 'SSRF', 'Allowlist di host, blocco IP privati dopo il DNS, niente redirect liberi.'),
    card('c4', 'Risorse', 'Massimi su limit e body, timeout, rate limit per chiave.'),
    card('c5', 'Test di autorizzazione', 'Per ogni endpoint: utente senza permessi e utente diverso proprietario.'),
  ],
  [
    prac(
      'p1',
      'Fai la review di sicurezza di un endpoint PATCH /utenti/{id}.',
      'Chi può chiamarlo (solo se stesso o admin), controllo per oggetto, campi modificabili in una allowlist (no ruolo/is_admin), validazione, rate limit, audit log, risposta senza campi interni, test con altro utente e senza token.',
    ),
    prac(
      'p2',
      'Un endpoint accetta un URL di immagine da scaricare: come lo metti in sicurezza?',
      'Solo http/https, allowlist di domini, risolvi il DNS e blocca IP privati/link-local/loopback, no redirect o ricontrolla a ogni salto, timeout e limite di dimensione, scarica da un servizio isolato.',
    ),
  ],
  'Note del vault: computer science/security/web-security.md, backend/rest-api-design.md',
)

export const runner = mod(
  'runner',
  'Bruno e Postman avanzati: dati, runner e CI',
  'Esecuzioni guidate da file, script riusabili, report, GitHub Actions',
  'tools',
  `<p class="lead">Il vero valore di Bruno e Postman sta nell'automazione: la stessa collezione eseguita con tanti dati, in CI, con report.</p>
<h3>Esecuzioni guidate dai dati</h3><p>Una collezione eseguita più volte con valori diversi (utenti, casi limite) da un file CSV o JSON.</p>
<pre><code># dati.csv
email,password,stato_atteso
ada@esempio.it,corretta,200
ada@esempio.it,sbagliata,401
,corretta,422</code></pre>
<ul><li><b>Postman</b>: Collection Runner, scegli il file di dati; nelle richieste usa <code>{{email}}</code> e nei test <code>pm.iterationData.get("stato_atteso")</code>. Da CLI: <code>newman run collezione.json -d dati.csv -e staging.json</code>.</li><li><b>Bruno</b>: il runner e la CLI supportano file di dati CSV/JSON (controlla <code>bru run --help</code> per i flag della tua versione, es. <code>--csv-file-path</code>); le colonne diventano variabili.</li></ul>
<h3>Ordine e condizioni di esecuzione</h3><ul><li>Bruno: <code>seq</code> nel file decide l'ordine; in uno script puoi saltare o ripetere: <code>bru.setNextRequest("nome richiesta")</code> / <code>bru.runner.skipRequest()</code>.</li><li>Postman: <code>pm.execution.setNextRequest("nome")</code> per ramificare.</li><li>Tieni le richieste indipendenti o dichiara bene le dipendenze (login → crea → leggi → pulisci).</li></ul>
<h3>Codice riusabile</h3><pre><code>// Bruno: libreria in un file JS della collezione
const { firma } = require("./lib/firma.js");
req.setHeader("X-Signature", firma(req.getBody()));

// Postman: script a livello di collezione per l'autenticazione
pm.sendRequest({ url: pm.environment.get("authUrl"), method: "POST", body: {...} }, (err, res) =&gt; {
  pm.environment.set("token", res.json().access_token);
});</code></pre><p>Metti nel <b>pre-request di collezione</b> la logica comune (token, firme, timestamp), non in ogni richiesta.</p>
<h3>Report</h3><pre><code>bru run -r --env staging --reporter-junit risultati.xml --reporter-html report.html
newman run collezione.json -e staging.json --reporters cli,junit,htmlextra</code></pre><p>Il JUnit si legge in GitHub Actions, GitLab CI e Jenkins; l'HTML è comodo da allegare.</p>
<h3>GitHub Actions</h3><pre><code>name: smoke-api
on:
  deployment_status:
  workflow_dispatch:
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install -g @usebruno/cli
      - run: bru run -r --env staging --env-var token=$API_TOKEN --reporter-junit smoke.xml
        working-directory: api-collezione
        env:
          API_TOKEN: \${{ secrets.STAGING_API_TOKEN }}
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: smoke, path: api-collezione/smoke.xml }</code></pre>
<ul><li>I segreti arrivano dai <i>secrets</i> della CI, mai dal repository; passali con <code>--env-var</code> o variabili d'ambiente.</li><li>Fai fallire la pipeline se lo smoke test fallisce; carica il report anche in caso di errore (<code>if: always()</code>).</li></ul>
<h3>Buone pratiche</h3><ul><li>Un ambiente di test dedicato con utenti di prova e dati ripristinabili.</li><li>Tempi massimi nelle asserzioni (<code>res.responseTime: lt 800</code>) per accorgersi di regressioni evidenti.</li><li>Dividi le collezioni: <b>smoke</b> (veloce, dopo ogni deploy), <b>regressione</b> (completa, notturna), <b>carico</b> (k6/locust).</li></ul>
<div class="say"><b>Cosa dire.</b> «Collezioni guidate da CSV per i casi limite, logica comune nel pre-request di collezione, e in CI una CLI con report JUnit e segreti dai secrets della pipeline.»</div>`,
  [
    q(
      'q1',
      'Come esegui una collezione Postman con un file di dati da CLI?',
      ['newman run collezione.json -d dati.csv -e ambiente.json', 'postman start', 'curl -d', 'npm test'],
      0,
      "Ogni riga del CSV è un'iterazione.",
    ),
    q(
      'q2',
      'Dove metti la logica comune come il rinnovo del token?',
      ['Nel pre-request script di collezione', 'In ogni richiesta', 'Nel README', 'Nel body'],
      0,
      'Evita duplicazioni.',
    ),
    q(
      'q3',
      "Perché <code>if: always()</code> nell'upload del report in CI?",
      ['Per avere il report anche quando i test falliscono', 'Per velocità', 'Per i segreti', 'Non serve'],
      0,
      "Il report serve proprio quando c'è un errore.",
    ),
    q(
      'q4',
      'Come passi un segreto alla CLI di Bruno in CI?',
      ['--env-var da un secret della CI', 'Nel file .bru committato', 'Nel nome della collezione', 'Via URL'],
      0,
      'Mai nel repository.',
    ),
    q(
      'q5',
      'Perché dividere smoke e regressione?',
      [
        'Lo smoke è veloce dopo ogni deploy, la regressione è completa e più lenta',
        'Per usare più strumenti',
        'Per i report',
        'Non si divide',
      ],
      0,
      'Tempi e scopi diversi.',
    ),
  ],
  [
    card('c1', 'Dati da file in Postman', 'newman run c.json -d dati.csv -e env.json; pm.iterationData.get("campo").'),
    card('c2', 'Report in Bruno', 'bru run -r --env staging --reporter-junit risultati.xml (anche --reporter-html).'),
    card('c3', 'Logica comune', 'Pre-request di collezione (token, firme, timestamp).'),
    card('c4', 'Segreti in CI', "Secrets della pipeline → --env-var o variabili d'ambiente."),
    card('c5', 'Tre suite', 'Smoke (dopo ogni deploy), regressione (notturna), carico (k6/locust).'),
  ],
  [
    prac(
      'p1',
      'Testa un endpoint di login con 10 combinazioni di input senza duplicare richieste.',
      'Una sola richiesta parametrizzata con {{email}}/{{password}}, un CSV con le combinazioni e lo stato atteso, e un test che confronta lo status con la colonna; eseguita dal runner o da newman/bru in CI.',
    ),
    prac(
      'p2',
      'Descrivi la pipeline per far girare lo smoke test dopo ogni deploy.',
      "Job che parte alla fine del deploy, installa la CLI, esegue la collezione con l'ambiente di staging e il token dai secrets, produce JUnit, carica l'artefatto sempre e blocca la promozione se fallisce; notifica e rollback.",
    ),
  ],
  'Note del vault: tooling/testing/bruno-api-smoke-tests.md, tooling/testing/api-clients-bruno-postman-curl.md, tooling/github-actions.md',
)

export const asyncapi = mod(
  'asyncapi',
  'API asincrone e lavori lunghi',
  '202 Accepted, risorsa di stato, polling, webhook di ritorno, idempotenza',
  'contratti',
  `<p class="lead">Non tutto si fa in 200 ms: report, import, elaborazioni di immagini, pagamenti. Tenere aperta la richiesta è fragile: si usa un <b>pattern asincrono</b>.</p>
<h3>Il pattern: 202 + risorsa di stato</h3><pre><code>POST /report
Idempotency-Key: 7d1c...
{ "tipo": "vendite", "mese": "2026-10" }

HTTP/1.1 202 Accepted
Location: /report/jobs/981
Retry-After: 5
{ "id": 981, "stato": "in_coda" }</code></pre>
<pre><code>GET /report/jobs/981
{ "id": 981, "stato": "in_corso", "avanzamento": 40 }

GET /report/jobs/981
HTTP/1.1 303 See Other
Location: /report/risultati/981        # oppure il risultato incluso con stato "completato"</code></pre>
<ul><li>Il server <b>accetta</b> subito (202), crea un job e dice dove guardare (<code>Location</code>).</li><li>Il client controlla la risorsa di stato finché lo <code>stato</code> è <code>completato</code> o <code>fallito</code>.</li><li>Stati tipici: <code>in_coda</code>, <code>in_corso</code>, <code>completato</code>, <code>fallito</code> (con <code>errore</code>), <code>annullato</code>.</li></ul>
<h3>Come il client scopre l'esito</h3><div class="tblw"><table><tr><th>Metodo</th><th>Pro</th><th>Contro</th></tr>
<tr><td>Polling</td><td>semplice, funziona ovunque</td><td>traffico inutile, latenza</td></tr>
<tr><td>Webhook di ritorno (callback)</td><td>immediato, efficiente</td><td>il client deve esporre un endpoint pubblico e verificare la firma</td></tr>
<tr><td>SSE / WebSocket</td><td>aggiornamenti live</td><td>connessione aperta, più complesso</td></tr></table></div>
<p>Per il polling rispetta <code>Retry-After</code> e usa backoff (non una richiesta al secondo per sempre).</p>
<h3>Idempotenza end to end</h3><ul><li>Un <code>Idempotency-Key</code> sul POST: se il client riprova dopo un timeout, il server restituisce lo <b>stesso job</b> invece di crearne uno nuovo.</li><li>Il worker che elabora il job è idempotente (ripetibile senza effetti doppi) e salva i progressi (checkpoint).</li></ul>
<h3>Lato server (con Celery o simili)</h3><ol><li>L'endpoint valida, salva il job nel database (stato <code>in_coda</code>) e <b>dopo il commit</b> accoda il task.</li><li>Il worker aggiorna lo stato e l'avanzamento; salva il risultato (storage a oggetti, link firmato).</li><li>Errori: retry con backoff, poi stato <code>fallito</code> con motivo; coda dei messaggi morti.</li><li>Pulizia: scadenza dei risultati e dei job vecchi.</li></ol>
<h3>Cancellazione e timeout</h3><ul><li><code>DELETE /report/jobs/981</code> o <code>POST .../annullamento</code>; il worker controlla il flag tra un passo e l'altro.</li><li>Un job può restare "in corso" per un worker morto: usa <i>heartbeat</i> e un tempo massimo.</li></ul>
<h3>Risultati grandi</h3><p>Non restituire file enormi nel JSON: link firmato a un object storage (<code>GET</code> con URL temporaneo) e paginazione per le liste.</p>
<h3>Documentare e provare</h3><ul><li>Nella specifica OpenAPI descrivi il <code>202</code>, la risorsa di stato e gli stati possibili; gli <i>callbacks</i> di OpenAPI per i webhook.</li><li>In Bruno/Postman: una richiesta crea, una seconda (con script di polling o <code>setNextRequest</code>) attende il completamento con un tetto di tentativi, una terza verifica il risultato.</li></ul>
<div class="say"><b>Cosa dire.</b> «Rispondo 202 con Location e una risorsa di stato, il client fa polling con backoff o riceve un webhook firmato; il POST è idempotente e il task parte dopo il commit.»</div>`,
  [
    q(
      'q1',
      "Che cosa risponde un'API a un'operazione lunga?",
      [
        '202 Accepted con Location della risorsa di stato',
        '200 dopo molti secondi',
        '500',
        '204 senza dire dove guardare',
      ],
      0,
      'Il client controlla poi lo stato.',
    ),
    q(
      'q2',
      'Perché un Idempotency-Key sul POST di un job?',
      ['Un retry non crea un secondo job', 'Per cifrare', 'Per la cache', 'Per ordinare i job'],
      0,
      'Restituisce lo stesso job.',
    ),
    q(
      'q3',
      'Quando accodare il task rispetto al commit?',
      ['Dopo il commit', 'Prima del commit', 'Durante', 'Non importa'],
      0,
      'Altrimenti il worker può non trovare il job.',
    ),
    q(
      'q4',
      'Qual è il vantaggio del webhook rispetto al polling?',
      [
        'Notifica immediata senza traffico inutile',
        'Più semplice da implementare',
        'Non richiede sicurezza',
        'Funziona senza server',
      ],
      0,
      'Ma richiede un endpoint pubblico e la verifica della firma.',
    ),
    q(
      'q5',
      'Dove metti un risultato molto grande?',
      ['In un object storage con link firmato', 'Nel JSON della risposta', 'Nei cookie', 'In un header'],
      0,
      'Evita risposte enormi e timeout.',
    ),
  ],
  [
    card('c1', 'Avvio', '202 Accepted + Location: /job/id (+ Retry-After).'),
    card('c2', 'Stati del job', 'in_coda, in_corso, completato, fallito, annullato.'),
    card('c3', 'Polling educato', 'Rispetta Retry-After e usa backoff con un massimo di tentativi.'),
    card('c4', "Scoprire l'esito", 'Polling, webhook firmato, SSE/WebSocket.'),
    card('c5', 'Risultato grande', 'Link firmato a object storage, non nel JSON.'),
  ],
  [
    prac(
      'p1',
      "Progetta l'API per generare un report PDF che richiede 2 minuti.",
      'POST /report (Idempotency-Key) → 202 + Location /report/jobs/{id}; GET stato con avanzamento; a completamento stato "completato" con link firmato al PDF (scadenza); webhook opzionale firmato; cancellazione; task accodato dopo il commit, idempotente, con retry e DLQ.',
    ),
    prac(
      'p2',
      'Scrivi in Bruno il test di un flusso asincrono.',
      'Richiesta 1 crea il job e salva jobId; richiesta 2 fa GET dello stato e, se non completato, bru.setNextRequest sulla stessa richiesta con un contatore (max N, attesa tra i tentativi); richiesta 3 verifica il risultato e lo status 200.',
    ),
  ],
  'Note del vault: backend/rest-api-design.md, python/python-task-queue-patterns.md',
)

export const apiobs = mod(
  'apiobs',
  'Osservabilità delle API: log, metriche, tracce',
  'Request id, RED, traceparent, OpenTelemetry, SLO e allarmi',
  'qualita',
  `<p class="lead">Per sapere come va un'API in produzione devi poterla osservare da fuori. Tre segnali: <b>log</b>, <b>metriche</b>, <b>tracce</b>.</p>
<h3>Log utili</h3><pre><code>{"ts":"2026-11-05T10:00:01Z","livello":"info","evento":"richiesta",
 "metodo":"POST","percorso":"/ordini","stato":201,"durata_ms":84,
 "request_id":"9f2c...","utente":"u_42"}</code></pre>
<ul><li>Strutturati (JSON), un evento per richiesta, con <b>request id</b> e durata.</li><li>Niente segreti, token, dati personali o corpi interi; maschera i campi sensibili.</li><li>Livelli coerenti: errori del client (4xx) come <i>warning</i>/<i>info</i>, errori del server (5xx) come <i>error</i>.</li></ul>
<h3>Request id e correlazione</h3><ul><li>Il gateway (o il primo servizio) genera <code>X-Request-Id</code> (o usa quello in ingresso) e lo restituisce nella risposta e lo propaga alle chiamate a valle.</li><li>Con tracing, lo standard W3C è l'header <code>traceparent</code>: <code>00-&lt;trace-id&gt;-&lt;span-id&gt;-01</code>.</li><li>Quando segnali un problema allega il request id: chi indaga trova subito i log giusti.</li></ul>
<h3>Metriche RED</h3><ul><li><b>Rate</b>: richieste al secondo per rotta/metodo.</li><li><b>Errors</b>: percentuale di 5xx (e di 4xx anomali).</li><li><b>Duration</b>: latenza con percentili p50/p95/p99 (non la media).</li></ul>
<p>Etichette sulla <b>rotta modello</b> (<code>/ordini/{id}</code>), non sull'URL reale: gli id come etichetta fanno esplodere la cardinalità. Aggiungi metriche di saturazione (pool di connessioni, coda dei job).</p>
<h3>Tracce con OpenTelemetry</h3><ul><li>Una <b>traccia</b> è il percorso di una richiesta: ogni operazione (handler, query, chiamata HTTP) è uno <b>span</b> con durata.</li><li>Librerie di auto-instrumentation per FastAPI, Django, httpx, SQLAlchemy, Celery: poche righe di configurazione.</li><li>Propaga il contesto nei messaggi dei task per vedere l'intera catena (richiesta → coda → worker).</li></ul>
<h3>SLI, SLO, allarmi</h3><ul><li><b>SLI</b>: es. «percentuale di richieste riuscite sotto 300 ms». <b>SLO</b>: obiettivo (99,5% in 30 giorni). <b>Error budget</b>: ciò che puoi sbagliare.</li><li>Allarmi sui <b>sintomi</b> (tasso di errori, latenza p95, burn rate), non su ogni causa possibile; ogni allarme deve avere un'azione.</li></ul>
<h3>Dal lato del consumatore</h3><ul><li>Leggi gli header di quota (<code>RateLimit-*</code>), <code>Retry-After</code> e i codici di errore del provider.</li><li>Registra, per ogni chiamata esterna, durata, esito e request id del provider: sarà la prima cosa che ti chiederà il supporto.</li></ul>
<h3>Controlli di salute</h3><ul><li><code>/health</code> (liveness: il processo è vivo) e <code>/ready</code> (readiness: dipendenze pronte).</li><li>Un <b>synthetic check</b> esterno (smoke test periodico con Bruno/k6) segnala i problemi prima degli utenti.</li></ul>
<div class="say"><b>Cosa dire.</b> «Log strutturati con request id, metriche RED sulle rotte modello, tracce con OpenTelemetry attraverso code e servizi, e allarmi sui sintomi con uno SLO esplicito.»</div>`,
  [
    q(
      'q1',
      'Cosa significa RED?',
      ['Rate, Errors, Duration', 'Read, Execute, Delete', 'Retry, Error, Delay', 'Request, Entry, Data'],
      0,
      'Metriche per i servizi.',
    ),
    q(
      'q2',
      'Perché etichettare le metriche con la rotta modello?',
      ['Gli id reali fanno esplodere la cardinalità', 'È più leggibile solo', 'Lo impone HTTP', 'Per la cache'],
      0,
      'Troppe serie temporali.',
    ),
    q(
      'q3',
      "Qual è l'header standard W3C per la propagazione delle tracce?",
      ['traceparent', 'X-Trace', 'Trace-Id', 'Correlation'],
      0,
      'OpenTelemetry lo usa di default.',
    ),
    q(
      'q4',
      'Perché i percentili e non la media?',
      ['La media nasconde le code lente', 'Sono più semplici', 'Sono obbligatori', 'Occupano meno spazio'],
      0,
      'p95 e p99 mostrano il caso peggiore degli utenti.',
    ),
    q(
      'q5',
      'Cosa non va nei log?',
      ['Segreti e dati personali', 'Request id', 'Durata', 'Metodo'],
      0,
      'Maschera i campi sensibili.',
    ),
  ],
  [
    card('c1', 'RED', 'Rate, Errors, Duration (p50/p95/p99).'),
    card('c2', 'Correlazione', 'X-Request-Id restituito nella risposta; traceparent per il tracing.'),
    card('c3', 'Etichette', "Rotta modello (/ordini/{id}), mai l'URL reale."),
    card('c4', 'Allarmi', "Sui sintomi (errori, latenza, burn rate) con un'azione chiara."),
    card('c5', 'Salute', '/health (liveness) e /ready (readiness) + synthetic check.'),
  ],
  [
    prac(
      'p1',
      "Come strumenti un'API FastAPI per capire perché alcune richieste sono lente?",
      'Log strutturati con request id e durata, metriche RED con istogramma di latenza per rotta modello, tracce OpenTelemetry (handler, query, chiamate esterne), dashboard con p95/p99 e allarme su SLO; poi guardo la traccia di una richiesta lenta.',
    ),
    prac(
      'p2',
      'Un cliente segnala errori sporadici: cosa ti serve da lui e cosa guardi?',
      'Request id, ora (UTC), endpoint e un esempio curl senza segreti; con il request id trovo log e traccia, controllo errori a valle, limiti e deploy recenti.',
    ),
  ],
  'Note del vault: tooling/opentelemetry/*, tooling/prometheus-grafana.md, python/logging-structured.md',
)
