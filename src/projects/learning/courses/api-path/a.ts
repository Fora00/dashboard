import { card, mod, prac, q } from '../kit'

// Course "API: capirle, interrogarle, testarle". Groups "base", "tools".

export const http = mod(
  'http',
  'HTTP a fondo: richieste, risposte, header',
  'Metodi, status code, header, body, cookie, caching, HTTP/2',
  'base',
  `<p class="lead">Un'API web è una conversazione HTTP: il client invia una <b>richiesta</b>, il server restituisce una <b>risposta</b>. Capire HTTP vale più di qualunque strumento.</p>
<h3>Anatomia di una richiesta</h3><pre><code>POST /v1/ordini HTTP/1.1
Host: api.esempio.it
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Accept: application/json
Idempotency-Key: 7d1c...

{"cliente_id": 7, "righe": [{"sku": "A1", "qta": 2}]}</code></pre>
<ul><li><b>Riga di richiesta</b>: metodo, percorso (con query string <code>?a=1&amp;b=2</code>), versione.</li><li><b>Header</b>: metadati (autenticazione, formati, cache).</li><li><b>Body</b>: i dati (JSON, form, file) per POST/PUT/PATCH.</li></ul>
<h3>Anatomia di una risposta</h3><pre><code>HTTP/1.1 201 Created
Content-Type: application/json
Location: /v1/ordini/981
X-Request-Id: 9f2c...

{"id": 981, "stato": "nuovo"}</code></pre>
<h3>Metodi</h3><div class="tblw"><table><tr><th>Metodo</th><th>Uso</th><th>Sicuro</th><th>Idempotente</th></tr>
<tr><td>GET</td><td>leggere</td><td>sì</td><td>sì</td></tr>
<tr><td>POST</td><td>creare / azione</td><td>no</td><td>no</td></tr>
<tr><td>PUT</td><td>sostituire</td><td>no</td><td>sì</td></tr>
<tr><td>PATCH</td><td>modifica parziale</td><td>no</td><td>di solito</td></tr>
<tr><td>DELETE</td><td>eliminare</td><td>no</td><td>sì</td></tr>
<tr><td>HEAD / OPTIONS</td><td>solo header / capacità (CORS)</td><td>sì</td><td>sì</td></tr></table></div>
<p><b>Sicuro</b> = nessun effetto collaterale. <b>Idempotente</b> = ripeterlo ha lo stesso effetto di una volta: rende sicuri i retry.</p>
<h3>Status code</h3><ul><li><b>2xx</b> successo: 200 OK, 201 Created, 202 Accepted, 204 No Content.</li><li><b>3xx</b> redirect/cache: 301/302/307/308, 304 Not Modified.</li><li><b>4xx</b> errore del client: 400, 401 (non autenticato), 403 (vietato), 404, 405, 409 (conflitto), 415, 422 (validazione), 429 (troppe richieste).</li><li><b>5xx</b> errore del server: 500, 502, 503, 504.</li></ul>
<h3>Header importanti</h3><div class="tblw"><table><tr><th>Header</th><th>A cosa serve</th></tr>
<tr><td><code>Content-Type</code></td><td>formato del body inviato</td></tr>
<tr><td><code>Accept</code></td><td>formati che il client accetta</td></tr>
<tr><td><code>Authorization</code></td><td>credenziali</td></tr>
<tr><td><code>Cache-Control</code>, <code>ETag</code>, <code>If-None-Match</code></td><td>caching e richieste condizionali</td></tr>
<tr><td><code>Location</code></td><td>URL della risorsa creata o del redirect</td></tr>
<tr><td><code>Retry-After</code></td><td>quando riprovare (429/503)</td></tr>
<tr><td><code>User-Agent</code>, <code>Origin</code></td><td>chi chiama</td></tr></table></div>
<h3>Cookie e sessioni</h3><p>Il server imposta <code>Set-Cookie</code>, il client lo rimanda con <code>Cookie</code>. Attributi: <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>, <code>Max-Age</code>. Le API per client non-browser usano di norma token negli header.</p>
<h3>HTTP/1.1, 2 e 3 e TLS</h3><ul><li>HTTP/1.1: una richiesta per connessione alla volta (più connessioni).</li><li>HTTP/2: multiplexing di molte richieste su una connessione, header compressi.</li><li>HTTP/3: su QUIC (UDP), meno latenza in reti instabili.</li><li>HTTPS = HTTP dentro TLS: cifratura e autenticazione del server. Sempre HTTPS.</li></ul>
<h3>Timeout e connessioni</h3><p>Ogni chiamata deve avere un <b>timeout</b> (connessione e lettura). Riusa le connessioni (keep-alive) invece di aprirne una per richiesta.</p>
<div class="say"><b>Cosa dire.</b> «Scelgo il metodo per semantica, rispondo con lo status code giusto, uso header per formato, cache e autenticazione, e metto sempre timeout e HTTPS.»</div>`,
  [
    q('q1', 'Quale metodo è sicuro e idempotente?', ['GET', 'POST', 'PATCH', 'DELETE'], 0, 'GET non cambia lo stato.'),
    q(
      'q2',
      'Differenza tra 401 e 403?',
      [
        '401: non autenticato; 403: autenticato ma non autorizzato',
        'Nessuna',
        '401: errore del server',
        '403: non trovato',
      ],
      0,
      'Identità contro permessi.',
    ),
    q(
      'q3',
      'Cosa indica 429?',
      ['Troppe richieste (rate limit)', 'Non trovato', 'Errore del server', 'Conflitto'],
      0,
      'Spesso con Retry-After.',
    ),
    q(
      'q4',
      "A cosa serve l'header <code>Location</code> in un 201?",
      ['URL della risorsa creata', 'Il fuso orario', 'Il formato', 'La versione'],
      0,
      'Il client sa dove trovarla.',
    ),
    q(
      'q5',
      'Perché sempre un timeout sulle chiamate?',
      ['Altrimenti un server lento blocca il client indefinitamente', 'Per velocità', 'Per i log', 'Per la cache'],
      0,
      'Connessione e lettura.',
    ),
  ],
  [
    card('c1', 'Sicuro e idempotente', 'GET (sicuro e idempotente); PUT/DELETE idempotenti; POST no.'),
    card('c2', '401 vs 403', '401 non autenticato; 403 vietato.'),
    card('c3', 'Creazione', '201 Created + header Location.'),
    card('c4', 'Condizionale', 'ETag + If-None-Match → 304 Not Modified.'),
    card('c5', 'Rate limit', '429 + Retry-After.'),
  ],
  [
    prac(
      'p1',
      'Cosa succede tra il browser e il server quando apri un URL HTTPS?',
      'DNS risolve il nome, connessione TCP/QUIC, handshake TLS (certificato), richiesta HTTP con header, risposta con status e body, eventuale cache/redirect; connessioni riusate.',
    ),
    prac(
      'p2',
      'Un client riceve 504: dove indaghi?',
      'Un gateway/proxy non ha avuto risposta in tempo dal servizio a monte: controllo timeout del proxy, latenza e salute del servizio, code e dipendenze lente; log con request id.',
    ),
  ],
  'Note del vault: tooling/networking-http.md, computer science/patterns/http-errors.md, tooling/https-tls.md',
)

export const rest = mod(
  'rest',
  "Progettare e leggere un'API REST",
  'Risorse, URL, errori, paginazione, versioni, idempotenza',
  'base',
  `<p class="lead">Per usare bene un'API devi riconoscerne le convenzioni. Per progettarne una devi seguirle.</p>
<h3>Risorse e URL</h3><ul><li>Nomi al plurale, gerarchia: <code>/utenti</code>, <code>/utenti/42</code>, <code>/utenti/42/ordini</code>.</li><li>I verbi stanno nel metodo HTTP, non nell'URL (<code>POST /ordini</code>, non <code>/creaOrdine</code>).</li><li>Filtri e ordinamento nella query string: <code>/ordini?stato=aperto&amp;sort=-creato</code>.</li><li>Azioni fuori dal CRUD come sottorisorse: <code>POST /ordini/42/annullamento</code>.</li></ul>
<h3>Una tabella operazioni</h3><div class="tblw"><table><tr><th>Operazione</th><th>Richiesta</th><th>Risposta</th></tr>
<tr><td>Elenco</td><td><code>GET /ordini</code></td><td>200 + lista paginata</td></tr>
<tr><td>Dettaglio</td><td><code>GET /ordini/42</code></td><td>200 o 404</td></tr>
<tr><td>Crea</td><td><code>POST /ordini</code></td><td>201 + Location</td></tr>
<tr><td>Sostituisci</td><td><code>PUT /ordini/42</code></td><td>200/204</td></tr>
<tr><td>Modifica</td><td><code>PATCH /ordini/42</code></td><td>200</td></tr>
<tr><td>Elimina</td><td><code>DELETE /ordini/42</code></td><td>204</td></tr></table></div>
<h3>Errori coerenti</h3><pre><code>{
  "type": "https://api.esempio.it/errori/validazione",
  "title": "Validazione fallita",
  "status": 422,
  "detail": "email non valida",
  "errors": [{"campo": "email", "messaggio": "formato non valido"}],
  "request_id": "9f2c..."
}</code></pre>
<p>Formato standard: RFC 9457 <code>application/problem+json</code>. Lo status HTTP deve riflettere l'esito: mai <code>200</code> con un errore nel corpo.</p>
<h3>Paginazione</h3><ul><li><b>Offset/limit</b>: <code>?limit=20&amp;offset=40</code>; semplice ma lento in profondità e instabile se i dati cambiano.</li><li><b>Cursore</b>: <code>?limit=20&amp;after=abc</code>; la risposta include <code>next_cursor</code> (stabile e veloce).</li><li>Leggi sempre la paginazione: non assumere che la prima pagina sia tutto.</li></ul>
<h3>Versioni</h3><p>Nel percorso (<code>/v1/</code>) o in un header. Modifiche compatibili (campi opzionali nuovi) non cambiano versione; rotture sì, con avviso (<code>Deprecation</code>, <code>Sunset</code>). Un client "tollerante" ignora i campi sconosciuti.</p>
<h3>Idempotenza e concorrenza</h3><ul><li><code>Idempotency-Key</code> sui POST che creano effetti unici (pagamenti): lo stesso key restituisce lo stesso risultato.</li><li><code>ETag</code> + <code>If-Match</code> per modifiche ottimistiche: 412 se qualcun altro ha cambiato.</li></ul>
<h3>Limiti e quote</h3><p>Rate limit per chiave/utente con header tipo <code>RateLimit-Remaining</code> o <code>X-RateLimit-*</code>; risposta <code>429</code> con <code>Retry-After</code>. Il client deve rispettarli con backoff.</p>
<h3>Leggere la documentazione di un'API</h3><ol><li>Autenticazione: come ottengo le credenziali?</li><li>Base URL e versione.</li><li>Un esempio <code>curl</code> funzionante per l'endpoint che mi serve.</li><li>Paginazione, limiti, errori, idempotenza.</li><li>Specifica OpenAPI (se c'è): importala nel client.</li></ol>
<div class="say"><b>Cosa dire.</b> «Risorse al plurale, metodi per semantica, errori coerenti con lo status giusto, paginazione a cursore e idempotency key per le operazioni critiche.»</div>`,
  [
    q(
      'q1',
      'Quale URL è coerente con REST?',
      ['POST /creaOrdine', 'POST /ordini', 'GET /eliminaOrdine/42', 'PUT /getOrdini'],
      1,
      'I verbi stanno nel metodo.',
    ),
    q(
      'q2',
      'Cosa risponde bene una creazione riuscita?',
      ['200 con testo', '201 con header Location', '404', '302'],
      1,
      'Indica dove trovare la risorsa.',
    ),
    q(
      'q3',
      'Perché la paginazione a cursore è preferita?',
      ['Stabile e veloce su dati che cambiano', 'È più semplice', 'È standard HTTP', 'Non serve indice'],
      0,
      "L'offset scarta righe e può saltare elementi.",
    ),
    q(
      'q4',
      'A cosa serve <code>Idempotency-Key</code>?',
      ['Evita effetti doppi se il client ripete la richiesta', 'Autentica', 'Comprime', 'Fa cache'],
      0,
      'Tipico per i pagamenti.',
    ),
    q(
      'q5',
      'Che cosa è sbagliato?',
      ['422 per validazione', '200 con {"errore": ...}', '204 su DELETE', '429 con Retry-After'],
      1,
      "Lo status deve riflettere l'esito.",
    ),
  ],
  [
    card('c1', 'Creazione', 'POST /risorse → 201 + Location.'),
    card('c2', 'Errori', 'application/problem+json (RFC 9457), status coerente.'),
    card('c3', 'Pagina grande', 'Cursore (next_cursor) invece di offset profondo.'),
    card('c4', 'Concorrenza ottimistica', 'ETag + If-Match → 412 in caso di conflitto.'),
    card('c5', 'Cambio non compatibile', 'Nuova versione + Deprecation/Sunset.'),
  ],
  [
    prac(
      'p1',
      'Progetta le rotte per una libreria: libri, autori, prestiti.',
      'GET/POST /libri, GET/PATCH/DELETE /libri/{id}, GET /libri/{id}/autori, POST /prestiti (201), POST /prestiti/{id}/restituzione, filtri ?disponibile=true, paginazione a cursore, errori problem+json.',
    ),
    prac(
      'p2',
      'Come gestisci un POST di pagamento ripetuto dal client per un timeout?',
      'Il client invia Idempotency-Key; il server salva risultato per chiave e restituisce la stessa risposta al secondo tentativo; vincolo di unicità sulla chiave.',
    ),
  ],
  'Note del vault: backend/rest-api-design.md, openapi-fundamentals.md',
)

export const formats = mod(
  'formats',
  'Formati: JSON, form, multipart, content negotiation',
  'JSON, query string, form-urlencoded, multipart, file, compressione',
  'base',
  `<p class="lead">Il formato dei dati che invii e ricevi si dichiara negli header. Un body corretto con l'header sbagliato viene ignorato.</p>
<h3>JSON</h3><pre><code>{
  "id": 42,
  "nome": "Ada",
  "attivo": true,
  "tags": ["a", "b"],
  "indirizzo": {"citta": "Milano"},
  "note": null
}</code></pre>
<ul><li>Chiavi tra doppi apici; stringhe tra doppi apici (mai singoli); niente virgole finali né commenti.</li><li>Tipi: stringa, numero, booleano, null, array, oggetto. Le date non esistono: si usano stringhe ISO 8601 UTC (<code>2026-11-09T09:00:00Z</code>).</li><li>I numeri grandi (id a 64 bit) possono perdere precisione in JavaScript: usa stringhe se serve.</li></ul>
<h3>Content-Type più comuni</h3><div class="tblw"><table><tr><th>Content-Type</th><th>Quando</th></tr>
<tr><td><code>application/json</code></td><td>API JSON</td></tr>
<tr><td><code>application/x-www-form-urlencoded</code></td><td>form semplici: <code>a=1&amp;b=due</code></td></tr>
<tr><td><code>multipart/form-data</code></td><td>upload di file con campi</td></tr>
<tr><td><code>text/plain</code>, <code>text/csv</code>, <code>application/xml</code></td><td>testo, CSV, XML</td></tr>
<tr><td><code>application/octet-stream</code></td><td>binario generico</td></tr></table></div>
<h3>Esempi con curl</h3><pre><code>curl -X POST "$BASE/utenti" -H "Content-Type: application/json" -d '{"nome":"Ada"}'
curl -X POST "$BASE/login" -d "utente=ada" -d "password=segreta"            # form-urlencoded
curl -F "file=@fattura.pdf" -F "tipo=fattura" "$BASE/documenti"              # multipart
curl "$BASE/ordini?stato=aperto&amp;limit=5" -H "Accept: application/json"</code></pre>
<h3>Query string e percent-encoding</h3><p>Caratteri speciali nei parametri vanno codificati: spazio → <code>%20</code>, <code>&amp;</code> → <code>%26</code>. Gli strumenti (curl <code>--data-urlencode</code>, Bruno, Postman) lo fanno per te; nelle shell metti l'URL tra apici.</p>
<h3>Content negotiation</h3><ul><li><code>Accept</code>: cosa vuole il client (<code>application/json</code>, <code>text/csv</code>).</li><li><code>Accept-Language</code>, <code>Accept-Encoding: gzip, br</code>.</li><li>Se il server non supporta il formato: <code>406</code> o <code>415</code> (tipo del body non supportato).</li></ul>
<h3>Compressione e streaming</h3><ul><li><code>Content-Encoding: gzip</code> riduce il traffico; curl: <code>--compressed</code>.</li><li>Risposte grandi in streaming: <code>Transfer-Encoding: chunked</code>, NDJSON (una riga JSON per evento), SSE.</li></ul>
<h3>Codifica dei caratteri</h3><p>Usa UTF-8 ovunque (<code>Content-Type: application/json; charset=utf-8</code> è implicito per JSON). Problemi di accenti = codifica sbagliata.</p>
<h3>Trappole</h3><ul><li>Dimenticare <code>Content-Type: application/json</code>: il server vede un body vuoto o un form.</li><li>JSON con apici singoli o virgola finale: 400.</li><li>Caratteri non codificati in query string.</li><li>Inviare date senza fuso orario.</li></ul>
<div class="say"><b>Cosa dire.</b> «Imposto Content-Type e Accept, uso ISO 8601 in UTC per le date e UTF-8; per i file multipart, per le credenziali dei form form-urlencoded.»</div>`,
  [
    q(
      'q1',
      'Quale Content-Type per un upload di file con campi?',
      ['application/json', 'multipart/form-data', 'text/plain', 'application/xml'],
      1,
      'Ogni parte ha il suo nome e contenuto.',
    ),
    q(
      'q2',
      'Cosa succede se dimentichi <code>Content-Type: application/json</code> con un body JSON?',
      ['Spesso il server non lo interpreta (body vuoto o errore)', 'Funziona sempre', 'Viene compresso', 'Va in cache'],
      0,
      "Il parser dipende dall'header.",
    ),
    q(
      'q3',
      'Come si rappresentano le date in JSON?',
      ['Con un tipo date', 'Stringhe ISO 8601 in UTC', 'Numeri casuali', 'Con apici singoli'],
      1,
      'JSON non ha un tipo data.',
    ),
    q(
      'q4',
      'Cosa indica 415?',
      ['Tipo del body non supportato', 'Non trovato', 'Troppe richieste', 'Conflitto'],
      0,
      'Unsupported Media Type.',
    ),
    q(
      'q5',
      "Perché mettere l'URL tra apici nella shell?",
      ['La & separerebbe il comando', 'Per velocità', 'Per HTTPS', 'Non serve'],
      0,
      'La & manda in background il comando.',
    ),
  ],
  [
    card('c1', 'Upload', 'curl -F "file=@x.pdf" (multipart/form-data).'),
    card('c2', 'JSON valido', 'Doppi apici, niente virgole finali né commenti.'),
    card('c3', 'Date', 'ISO 8601 UTC: 2026-11-09T09:00:00Z.'),
    card('c4', 'Formato desiderato', 'Header Accept.'),
    card('c5', 'Compressione', 'Accept-Encoding / Content-Encoding: gzip; curl --compressed.'),
  ],
  [
    prac(
      'p1',
      'Il server risponde 400 al tuo POST JSON in curl: cosa controlli?',
      "Header Content-Type, JSON valido (apici, virgole), codifica, campi obbligatori e tipi; guardo il corpo dell'errore e il request id; provo con -v per vedere cosa invio.",
    ),
    prac(
      'p2',
      "Come invii un file e due campi di testo a un'API?",
      'curl -F "file=@doc.pdf" -F "tipo=fattura" -F "nota=ok" $BASE/documenti (multipart/form-data).',
    ),
  ],
  'Note del vault: tooling/networking-http.md, python/serialization.md',
)

export const curl = mod(
  'curl',
  'curl e HTTPie dalla riga di comando',
  'Opzioni essenziali, jq, script, debug',
  'tools',
  `<p class="lead"><code>curl</code> è presente ovunque: sul server, in CI, nei README. Saperlo usare bene è la base per tutti gli altri strumenti.</p>
<h3>Le opzioni che servono</h3><div class="tblw"><table><tr><th>Opzione</th><th>Effetto</th></tr>
<tr><td><code>-i</code></td><td>mostra gli header di risposta</td></tr>
<tr><td><code>-v</code></td><td>verbose: richiesta, header, TLS</td></tr>
<tr><td><code>-s</code> / <code>-S</code></td><td>silenzioso / mostra comunque gli errori</td></tr>
<tr><td><code>-X METODO</code></td><td>metodo HTTP</td></tr>
<tr><td><code>-H "Nome: valore"</code></td><td>aggiunge un header</td></tr>
<tr><td><code>-d</code>, <code>--json</code></td><td>body (<code>--json</code> imposta anche Content-Type e Accept)</td></tr>
<tr><td><code>-F</code></td><td>multipart/form-data</td></tr>
<tr><td><code>-u utente:pw</code></td><td>autenticazione Basic</td></tr>
<tr><td><code>-L</code></td><td>segue i redirect</td></tr>
<tr><td><code>-o file</code> / <code>-O</code></td><td>salva l'output</td></tr>
<tr><td><code>--fail-with-body</code></td><td>esce con errore sui 4xx/5xx (utile negli script)</td></tr>
<tr><td><code>--max-time 10</code></td><td>timeout totale</td></tr>
<tr><td><code>-w "%{http_code}"</code></td><td>stampa metriche (status, tempo)</td></tr></table></div>
<h3>Ricette</h3><pre><code>export BASE=https://api.esempio.it/v1
export TOKEN=...

curl -s "$BASE/utenti?limit=3" -H "Authorization: Bearer $TOKEN" | jq '.items[] | {id, email}'

curl -s --fail-with-body -X POST "$BASE/utenti" \\
  -H "Authorization: Bearer $TOKEN" \\
  --json '{"nome":"Ada","email":"ada@esempio.it"}'

curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" "$BASE/health"

curl -sI "$BASE/risorsa"                       # solo header (HEAD)
curl -b cookies.txt -c cookies.txt "$BASE/me"   # cookie in entrata e uscita</code></pre>
<h3>jq per leggere JSON</h3><pre><code>jq '.'                       # formatta
jq -r '.token'               # valore senza virgolette
jq '.items | length'
jq '.items[] | select(.attivo)'
jq 'map({id, nome})'
jq -r '.items[] | [.id, .nome] | @csv'</code></pre>
<h3>HTTPie</h3><pre><code>http GET :8000/utenti/42 Authorization:"Bearer $TOKEN"
http POST :8000/utenti nome=Ada eta:=36 attivo:=true      # = stringa, := JSON grezzo
http --form POST :8000/login utente=ada password=x
http --download $BASE/report.pdf</code></pre><p>Più leggibile di curl per l'uso interattivo: colora, formatta JSON, e inferisce Content-Type.</p>
<h3>Debug</h3><ul><li><code>curl -v</code> mostra l'handshake TLS, gli header inviati e ricevuti.</li><li>Problemi di certificato: <code>-k</code> solo per prove locali (mai in produzione).</li><li>"Copia come cURL" dai DevTools del browser riproduce una chiamata reale (attenzione ai token negli header).</li><li>Risoluzione DNS forzata: <code>--resolve host:443:127.0.0.1</code>.</li></ul>
<h3>Negli script</h3><ul><li><code>set -euo pipefail</code>, <code>--fail-with-body</code>, <code>--retry 3 --retry-all-errors</code>, timeout sempre.</li><li>Segreti da variabili d'ambiente, non nella riga di comando (finiscono nella cronologia).</li></ul>
<div class="say"><b>Cosa dire.</b> «Per provare un endpoint uso curl con --fail-with-body e jq; per esplorare HTTPie; negli script timeout, retry e segreti da variabili d'ambiente.»</div>`,
  [
    q(
      'q1',
      'Quale opzione di curl mostra gli header della risposta?',
      ['-i', '-s', '-d', '-L'],
      0,
      '-I invece fa una richiesta HEAD.',
    ),
    q(
      'q2',
      'Perché usare <code>--fail-with-body</code> negli script?',
      ['Per uscire con errore sui 4xx/5xx mostrando il corpo', 'Per velocità', 'Per cifrare', 'Per i cookie'],
      0,
      'Altrimenti curl restituisce 0 anche su 404 o 500.',
    ),
    q(
      'q3',
      'Come invii un numero in JSON con HTTPie?',
      ['eta=36', 'eta:=36', 'eta==36', 'eta@36'],
      1,
      '= invia una stringa, := JSON grezzo.',
    ),
    q(
      'q4',
      'A cosa serve <code>jq -r</code>?',
      ['Stampa stringhe senza virgolette', 'Ordina', 'Invia richieste', 'Cifra'],
      0,
      'Utile per estrarre un token.',
    ),
    q(
      'q5',
      'Dove non mettere i segreti?',
      [
        "In una variabile d'ambiente",
        'Nella riga di comando (cronologia)',
        'In un secret manager',
        'In un file con permessi stretti',
      ],
      1,
      'Finiscono nella history della shell e nei processi.',
    ),
  ],
  [
    card('c1', 'Debug richiesta', 'curl -v URL (o -i per gli header di risposta).'),
    card('c2', 'POST JSON', 'curl --json \'{"a":1}\' URL (imposta Content-Type e Accept).'),
    card('c3', 'Solo status e tempo', 'curl -s -o /dev/null -w "%{http_code} %{time_total}\\n" URL'),
    card('c4', 'Estrarre un campo', "curl -s URL | jq -r '.token'"),
    card('c5', 'Script robusto', '--fail-with-body --max-time 10 --retry 3 e set -euo pipefail.'),
  ],
  [
    prac(
      'p1',
      'Scrivi uno script che fa login, salva il token e legge i primi 5 ordini.',
      '<pre><code>TOKEN=$(curl -s --fail-with-body --json \'{"email":"a@x.it","password":"..."}\' "$BASE/auth/login" | jq -r .access_token)\ncurl -s --fail-with-body -H "Authorization: Bearer $TOKEN" "$BASE/ordini?limit=5" | jq \'.items[] | {id, totale}\'</code></pre>',
    ),
    prac(
      'p2',
      'Un endpoint risponde lento: come lo misuri da terminale?',
      'curl -w con %{time_namelookup} %{time_connect} %{time_starttransfer} %{time_total} per capire dove va il tempo (DNS, connessione, TLS, server, trasferimento); ripeti più volte.',
    ),
  ],
  'Note del vault: tooling/testing/api-clients-bruno-postman-curl.md, tooling/networking-http.md',
)

export const bruno = mod(
  'bruno',
  'Bruno: collezioni di API versionate in git',
  'Collezioni, ambienti, variabili, script, test, CLI e CI',
  'tools',
  `<p class="lead"><b>Bruno</b> è un client API open source che salva le richieste come <b>file di testo</b> nel tuo repository: niente account, niente cloud, ottimo per versionare e rivedere le collezioni come il codice.</p>
<h3>Perché Bruno</h3><ul><li>Le collezioni sono cartelle con file <code>.bru</code> leggibili: diff e review in git.</li><li>Funziona offline; i segreti restano locali.</li><li>Test e script in JavaScript; CLI per la CI.</li></ul>
<h3>Struttura</h3><pre><code>api-collezione/
  bruno.json
  environments/
    locale.bru
    staging.bru
  auth/
    login.bru
  ordini/
    elenco.bru
    crea.bru</code></pre>
<h3>Un file di richiesta</h3><pre><code>meta {
  name: Crea ordine
  type: http
  seq: 2
}

post {
  url: {{baseUrl}}/ordini
  body: json
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

body:json {
  {
    "cliente_id": 7,
    "righe": [{"sku": "A1", "qta": 2}]
  }
}

assert {
  res.status: eq 201
}

script:post-response {
  bru.setVar("ordineId", res.body.id);
}

tests {
  test("restituisce un id", function () {
    expect(res.body).to.have.property("id");
  });
}</code></pre>
<h3>Ambienti e variabili</h3><ul><li><b>Environment</b> (<code>locale</code>, <code>staging</code>): <code>baseUrl</code>, credenziali. Le variabili <b>segrete</b> vanno marcate come tali e non finiscono nel file committato (o in un <code>.env</code> ignorato da git).</li><li>Uso: <code>{{baseUrl}}/utenti/{{userId}}</code>.</li><li>Variabili di <b>collezione</b>, di <b>richiesta</b> e di <b>runtime</b> (<code>bru.setVar</code>, <code>bru.setEnvVar</code>).</li></ul>
<h3>Concatenare le richieste</h3><ol><li><code>login</code> salva il token: <code>bru.setEnvVar("token", res.body.access_token)</code>.</li><li><code>crea ordine</code> salva l'id: <code>bru.setVar("ordineId", res.body.id)</code>.</li><li><code>leggi ordine</code> usa <code>{{ordineId}}</code> e verifica i campi.</li><li><code>elimina ordine</code> ripulisce.</li></ol>
<h3>Assert e test</h3><ul><li><b>assert</b> dichiarativi: <code>res.status: eq 200</code>, <code>res.body.nome: eq Ada</code>, <code>res.responseTime: lt 500</code>.</li><li><b>tests</b> con Chai (<code>expect</code>) per controlli più ricchi (forma del JSON, array non vuoti).</li></ul>
<h3>CLI e CI</h3><pre><code>npm install -g @usebruno/cli
bru run -r --env staging                    # -r: esegue anche le sottocartelle
bru run ordini -r --env staging --reporter-junit risultati.xml   # report JUnit (--output/--format sono deprecati)
bru run --env staging --env-var token=$TOKEN</code></pre><p>In CI: smoke test dopo ogni deploy (health, login, una lettura, una scrittura e pulizia); passa i segreti con <code>--env-var</code> da variabili del sistema CI.</p>
<h3>Importare</h3><p>Bruno importa collezioni Postman, Insomnia e specifiche OpenAPI: parti da un contratto esistente e aggiungi asserzioni.</p>
<h3>Buone pratiche</h3><ul><li>Una collezione per servizio, nella stessa repo del codice o in una repo dedicata.</li><li>Nomi per intento ("Crea ordine: caso felice", "Crea ordine: totale negativo → 422").</li><li>Includi i casi di errore (401, 403, 404, 422), non solo il caso felice.</li><li>Mai puntare di default alla produzione con richieste distruttive.</li></ul>
<div class="say"><b>Cosa dire.</b> «Tengo le collezioni Bruno in git, con ambienti per stage e segreti fuori dal repo; le eseguo in CI con bru run come smoke test dopo il deploy.»</div>`,
  [
    q(
      'q1',
      'Qual è il vantaggio principale di Bruno?',
      [
        'Collezioni come file di testo versionabili in git, anche offline',
        'È a pagamento',
        'Richiede un account cloud',
        'Genera codice',
      ],
      0,
      'Revisione e diff come per il codice.',
    ),
    q(
      'q2',
      'Come passi un token da una richiesta alla successiva?',
      [
        'bru.setEnvVar / bru.setVar in uno script post-response',
        'Copiando a mano',
        'Con un cookie sempre',
        'Non si può',
      ],
      0,
      'Poi lo usi con {{token}}.',
    ),
    q(
      'q3',
      'Come esegui in CI tutta la collezione, sottocartelle comprese?',
      ['bru run -r --env staging', 'npm start', 'curl', 'Non si può'],
      0,
      'Con --output e --format per i report.',
    ),
    q(
      'q4',
      'Dove vanno i segreti?',
      [
        'Variabili segrete/locali o --env-var da CI, non committati',
        'Nel file .bru committato',
        'Nel README',
        'Nel nome della richiesta',
      ],
      0,
      'Evita di mettere token nel repository.',
    ),
    q(
      'q5',
      'Cosa verifica <code>assert { res.status: eq 201 }</code>?',
      ['Che lo status sia 201', 'Che il body sia vuoto', 'Che ci sia un cookie', 'Niente'],
      0,
      'Asserzione dichiarativa.',
    ),
  ],
  [
    card('c1', 'Eseguire in CI', 'bru run -r --env staging --reporter-junit risultati.xml (-r per le sottocartelle)'),
    card('c2', 'Salvare il token', 'script:post-response { bru.setEnvVar("token", res.body.access_token) }'),
    card('c3', 'Usare una variabile', '{{baseUrl}}/utenti/{{userId}}'),
    card('c4', 'Assert veloce', 'assert { res.status: eq 200 }'),
    card('c5', 'Segreti', 'Variabili segrete o --env-var da CI; mai nel repo.'),
  ],
  [
    prac(
      'p1',
      'Progetta una collezione Bruno di smoke test per un servizio ordini.',
      'Cartelle: auth/login (salva token), health, ordini/crea (salva id, assert 201), ordini/leggi (assert campi), ordini/elimina (pulizia); casi di errore 401/404/422; ambiente staging; bru run in CI dopo ogni deploy.',
    ),
    prac(
      'p2',
      'Come gestisci le credenziali nelle collezioni condivise?',
      "Variabili d'ambiente segrete non committate (o .env ignorato), --env-var in CI, utenti di test dedicati con permessi minimi, rotazione periodica.",
    ),
  ],
  'Note del vault: tooling/testing/bruno-api-smoke-tests.md, tooling/testing/api-clients-bruno-postman-curl.md',
)

export const postman = mod(
  'postman',
  'Postman, Insomnia e client grafici',
  'Collezioni, variabili, script, runner, Newman, mock, confronto con Bruno',
  'tools',
  `<p class="lead"><b>Postman</b> è il client API più diffuso: interfaccia ricca, collaborazione, mock e monitor. I concetti si ritrovano identici in Insomnia, Thunder Client, Hoppscotch e simili.</p>
<h3>Concetti chiave</h3><ul><li><b>Collection</b>: gruppo di richieste (con cartelle).</li><li><b>Environment</b>: insieme di variabili per ambiente (<code>locale</code>, <code>staging</code>).</li><li><b>Variabili</b> con scope: globali, di collezione, di ambiente, locali. Uso: <code>{{baseUrl}}</code>.</li><li><b>Auth</b> a livello di collezione/cartella: ereditata dalle richieste.</li></ul>
<h3>Script</h3><pre><code>// Pre-request Script: prepara dati
pm.variables.set("timestamp", new Date().toISOString());

// Tests: verifica e salva
pm.test("status 201", () =&gt; pm.response.to.have.status(201));
pm.test("ha un id", () =&gt; pm.expect(pm.response.json()).to.have.property("id"));
pm.environment.set("ordineId", pm.response.json().id);

// Schema
const schema = { type: "object", required: ["id", "stato"] };
pm.test("rispetta lo schema", () =&gt; pm.response.to.have.jsonSchema(schema));</code></pre>
<h3>Eseguire in serie</h3><ul><li><b>Collection Runner</b>: esegue tutte le richieste in ordine, anche con file di dati (CSV/JSON) per più iterazioni.</li><li><b>Newman</b> (CLI) per la CI: <code>newman run collezione.json -e staging.json --reporters cli,junit</code>.</li><li><b>Monitor</b> (cloud): esecuzioni programmate con allarmi.</li></ul>
<h3>Altre funzioni</h3><ul><li><b>Mock server</b> da esempi della collezione: il frontend lavora prima che il backend esista.</li><li><b>Documentazione</b> generata dalla collezione; import/export di OpenAPI.</li><li>Client per <b>GraphQL</b>, <b>gRPC</b>, <b>WebSocket</b>.</li></ul>
<h3>Confronto</h3><div class="tblw"><table><tr><th></th><th>Postman</th><th>Bruno</th><th>Insomnia</th><th>curl/.http</th></tr>
<tr><td>Formato</td><td>JSON, cloud</td><td>file .bru in git</td><td>JSON/cloud</td><td>testo</td></tr>
<tr><td>Account</td><td>consigliato</td><td>no</td><td>opzionale</td><td>no</td></tr>
<tr><td>Collaborazione</td><td>workspace cloud</td><td>git</td><td>cloud/git</td><td>git</td></tr>
<tr><td>CI</td><td>Newman</td><td>bru CLI</td><td>inso CLI</td><td>nativo</td></tr>
<tr><td>Mock/monitor</td><td>sì</td><td>no</td><td>limitato</td><td>no</td></tr></table></div>
<h3>Attenzione ai segreti</h3><ul><li>Le collezioni sincronizzate nel cloud possono contenere token: usa variabili <b>secret</b> e valori "current" locali, non "initial" condivisi.</li><li>Non esportare ambienti con credenziali nei repository.</li><li>Valuta una policy aziendale su cosa può stare in un workspace condiviso.</li></ul>
<h3>Quale scegliere</h3><ul><li>Esplorazione veloce e documentazione condivisa tra team: Postman o Insomnia.</li><li>Collezioni come codice, revisione in PR, niente cloud: Bruno o file <code>.http</code>.</li><li>Automazione e script: curl/httpie e un test runner nel linguaggio del progetto.</li></ul>
<div class="say"><b>Cosa dire.</b> «Uso un client grafico per esplorare, ma i test ripetibili stanno in git (Bruno, Newman o test nel codice) e i segreti restano fuori dai workspace condivisi.»</div>`,
  [
    q(
      'q1',
      'Cosa fa Newman?',
      ['Esegue collezioni Postman da riga di comando (CI)', 'Genera mock', 'Crea indici', 'Documenta'],
      0,
      'newman run collezione.json -e ambiente.json.',
    ),
    q(
      'q2',
      'Qual è il rischio di una collezione sincronizzata nel cloud?',
      ['Token e segreti condivisi involontariamente', 'Nessuno', 'Più lentezza', 'Meno test'],
      0,
      'Usa variabili secret e valori locali.',
    ),
    q(
      'q3',
      'A cosa serve un mock server?',
      ["Simulare l'API finché il backend non esiste", 'Fare backup', 'Misurare il carico', 'Cifrare'],
      0,
      'Il frontend può procedere.',
    ),
    q(
      'q4',
      'Quale strumento tiene le collezioni come file in git?',
      ['Bruno', 'Postman cloud', 'Insomnia cloud', 'Nessuno'],
      0,
      'Formato .bru.',
    ),
    q(
      'q5',
      'Cosa è lo scope "ambiente" in Postman?',
      ['Variabili per stage (locale, staging)', 'Un tipo di test', 'Una cartella', 'Un monitor'],
      0,
      'Cambi stage cambiando ambiente.',
    ),
  ],
  [
    card('c1', 'Test Postman', 'pm.test("...", () => pm.response.to.have.status(200)).'),
    card('c2', 'Salvare una variabile', 'pm.environment.set("id", pm.response.json().id).'),
    card('c3', 'Eseguire in CI', 'newman run collezione.json -e staging.json.'),
    card('c4', 'Quando Bruno', 'Collezioni come codice in git, offline, senza account.'),
    card('c5', 'Segreti', 'Variabili secret, mai valori iniziali condivisi.'),
  ],
  [
    prac(
      'p1',
      'Il team usa Postman cloud: come riduci il rischio di fuga di credenziali?',
      'Variabili secret con valori locali, token di test con permessi minimi e scadenza, niente ambienti di produzione condivisi, revisione periodica del workspace, scansione di segreti sugli export.',
    ),
    prac(
      'p2',
      'Quando passeresti da Postman a test automatici nel codice?',
      "Quando le verifiche devono essere ripetibili e parte della CI: test di integrazione (pytest/supertest) o una collezione versionata e eseguita da CLI; Postman resta per l'esplorazione.",
    ),
  ],
  'Note del vault: tooling/testing/api-clients-bruno-postman-curl.md',
)

export const httpfiles = mod(
  'httpfiles',
  "File .http e client nell'editor",
  'VS Code REST Client, JetBrains HTTP Client, variabili e catene',
  'tools',
  `<p class="lead">Le richieste possono vivere <b>accanto al codice</b> in file <code>.http</code>: leggibili, versionati, eseguibili con un clic dall'editor.</p>
<h3>Perché</h3><ul><li>Zero installazioni oltre un'estensione (VS Code <i>REST Client</i>/<i>httpYac</i>) o il client integrato di JetBrains.</li><li>Il file è documentazione eseguibile nel repository.</li></ul>
<h3>Sintassi base</h3><pre><code>@baseUrl = http://localhost:8000
@token = {{login.response.body.$.access_token}}

### login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{ "email": "ada@esempio.it", "password": "segreta" }

### elenco utenti
GET {{baseUrl}}/utenti?limit=5
Authorization: Bearer {{token}}

### crea utente
POST {{baseUrl}}/utenti
Authorization: Bearer {{token}}
Content-Type: application/json

{ "nome": "Ada" }</code></pre>
<ul><li><code>###</code> separa le richieste; <code># @name</code> dà un nome per riusarne la risposta.</li><li>Variabili del file (<code>@baseUrl</code>) e di ambiente (impostazioni dell'estensione o <code>{{$dotenv VAR}}</code> dal file <code>.env</code> o <code>http-client.env.json</code> in JetBrains).</li><li>Risposte concatenate: <code>{{login.response.body.$.access_token}}</code>.</li></ul>
<h3>Ambienti (JetBrains)</h3><pre><code>// http-client.env.json
{ "locale": { "baseUrl": "http://localhost:8000" },
  "staging": { "baseUrl": "https://staging.esempio.it" } }

// http-client.private.env.json (ignorato da git): i segreti
{ "staging": { "token": "..." } }</code></pre>
<h3>Altre funzioni</h3><ul><li>File e dati da disco: <code>&lt; ./corpo.json</code>; upload multipart.</li><li>Test negli stessi file (JetBrains): <code>client.test("ok", () =&gt; client.assert(response.status === 200))</code>.</li><li>CLI: <code>httpyac</code> o l'<i>HTTP Client CLI</i> di JetBrains per CI.</li></ul>
<h3>Quando usarli</h3><ul><li>Prove rapide mentre sviluppi, accanto al codice.</li><li>Documentare gli endpoint con esempi eseguibili in un README.</li><li>Per suite di test strutturate, scambi e asserzioni complesse è meglio Bruno o test nel codice.</li></ul>
<h3>Trappole</h3><ul><li>Segreti nei file committati: usa l'env privato non versionato.</li><li>Dipendenze nascoste tra richieste (ordine di esecuzione) non documentate.</li></ul>
<div class="say"><b>Cosa dire.</b> «Per le prove quotidiane tengo file .http nel repository con ambienti e segreti separati; per le suite ripetibili uso Bruno o test di integrazione.»</div>`,
  [
    q('q1', 'Cosa separa le richieste in un file .http?', ['###', '---', '//', '&&'], 0, 'Tre cancelletti.'),
    q(
      'q2',
      'Come riusi il token del login?',
      ['{{login.response.body.$.access_token}} con # @name login', 'Copi a mano', 'Non si può', 'Con un cookie'],
      0,
      'Concatenazione tramite nome.',
    ),
    q(
      'q3',
      'Dove vanno i segreti nei client JetBrains?',
      ['http-client.private.env.json (non versionato)', 'Nel file .http committato', 'Nel README', "Nell'URL"],
      0,
      'Separato dal file pubblico.',
    ),
    q(
      'q4',
      'Quando preferire Bruno ai file .http?',
      ['Per suite strutturate con test e ambienti condivisi', 'Per una prova veloce', 'Mai', 'Solo per GraphQL'],
      0,
      'Più asserzioni e CLI mature.',
    ),
    q(
      'q5',
      'Qual è il vantaggio dei file .http?',
      ['Vivono accanto al codice e sono eseguibili', 'Sono cifrati', 'Sono più veloci di curl', 'Sostituiscono i test'],
      0,
      'Documentazione eseguibile.',
    ),
  ],
  [
    card('c1', 'Separatore', '### tra le richieste.'),
    card('c2', 'Nome per riuso', '# @name login → {{login.response.body.campo}}.'),
    card('c3', 'Segreti', 'File env privato non versionato.'),
    card('c4', 'CLI per CI', 'httpyac o HTTP Client CLI di JetBrains.'),
    card('c5', 'Quando', 'Prove rapide e documentazione eseguibile; per suite usa Bruno o test nel codice.'),
  ],
  [
    prac(
      'p1',
      "Scrivi un file .http per login, lista e creazione di un'entità.",
      'Variabili @baseUrl, richiesta login con # @name, richieste successive con Authorization: Bearer {{login.response.body.$.access_token}} e body JSON; separate da ###.',
    ),
    prac(
      'p2',
      'Come eviti che il file .http committato contenga credenziali?',
      'Variabili in un env privato ignorato da git, template di esempio senza segreti, scansione dei segreti in CI.',
    ),
  ],
  'Nota del vault: tooling/testing/api-clients-bruno-postman-curl.md',
)
