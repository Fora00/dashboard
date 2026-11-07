import { card, mod, prac, q } from '../kit'

// Group "master" (round 4, from the council review): the senior-interview areas.
// Vault notes already exist for all of these (see each module's `vault` line).

export const sqldeep = mod(
  'sqldeep',
  'SQL e Postgres a fondo',
  'Isolamento, MVCC, lock, indici, EXPLAIN, window function, paginazione',
  'backend',
  `<p class="lead">È l'argomento più interrogato nei colloqui backend. Sapere cosa fa il database sotto l'ORM distingue chi usa gli strumenti da chi li capisce.</p>
<h3>Transazioni e isolamento</h3><div class="tblw"><table><tr><th>Livello</th><th>Anomalie possibili</th></tr>
<tr><td>Read Committed (default Postgres)</td><td>non-repeatable read, phantom</td></tr>
<tr><td>Repeatable Read</td><td>(in Postgres: snapshot) write skew</td></tr>
<tr><td>Serializable</td><td>nessuna, ma possibili errori di serializzazione da ritentare</td></tr></table></div>
<ul><li><b>Dirty read</b>: leggere dati non committati. <b>Non-repeatable read</b>: due letture della stessa riga danno valori diversi. <b>Phantom</b>: righe nuove compaiono tra due query. <b>Lost update</b>: due transazioni sovrascrivono lo stesso valore.</li><li>Postgres usa <b>MVCC</b>: i lettori non bloccano gli scrittori, ogni transazione vede uno snapshot; le righe vecchie vengono ripulite da <code>VACUUM</code>.</li></ul>
<h3>Lock e concorrenza</h3><pre><code>BEGIN;
SELECT * FROM conti WHERE id = 1 FOR UPDATE;      -- blocca la riga
UPDATE conti SET saldo = saldo - 100 WHERE id = 1;
COMMIT;

-- coda di lavori senza contesa tra worker
SELECT * FROM lavori WHERE stato = 'nuovo'
ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;</code></pre>
<ul><li>Per evitare i <b>deadlock</b>: acquisisci i lock sempre nello stesso ordine e tieni le transazioni brevi.</li><li>Alternativa ottimistica: colonna <code>versione</code> e <code>UPDATE ... WHERE versione = :v</code>; se nessuna riga cambia, ritenta.</li></ul>
<h3>Indici</h3><ul><li>B-tree (default): uguaglianza, range, ordinamento. GIN: JSONB, array, full-text. Hash e BRIN per casi mirati.</li><li><b>Indice composto</b>: l'ordine delle colonne conta; <code>(a, b)</code> serve per <code>WHERE a</code> e <code>WHERE a AND b</code>, non per <code>WHERE b</code>.</li><li><b>Indice parziale</b> (<code>WHERE attivo</code>) e <b>covering</b> (<code>INCLUDE</code>) riducono dimensione e accessi alla tabella.</li><li>Ogni indice rallenta le scritture e occupa spazio: non indicizzare tutto.</li></ul>
<h3>Leggere EXPLAIN</h3><pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM ordini WHERE cliente_id = 42 ORDER BY creato DESC LIMIT 20;</code></pre>
<p>Cerca <i>Seq Scan</i> su tabelle grandi, stime di righe molto diverse da quelle reali (statistiche vecchie: <code>ANALYZE</code>), <i>Sort</i> su disco, <i>Nested Loop</i> con molte iterazioni.</p>
<h3>SQL che si chiede ai colloqui</h3><pre><code>-- window function: top 3 ordini per cliente
SELECT * FROM (
  SELECT o.*, ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY totale DESC) AS r
  FROM ordini o
) t WHERE r &lt;= 3;

-- CTE e aggregazione
WITH mensili AS (
  SELECT date_trunc('month', creato) AS mese, SUM(totale) AS tot
  FROM ordini GROUP BY 1
)
SELECT mese, tot, tot - LAG(tot) OVER (ORDER BY mese) AS delta FROM mensili;</code></pre>
<ul><li>Join: INNER, LEFT (righe senza corrispondenza), anti-join con <code>NOT EXISTS</code>.</li><li><code>NOT IN</code> con NULL dà risultati sorprendenti: preferisci <code>NOT EXISTS</code>.</li></ul>
<h3>Paginazione</h3><p><code>OFFSET</code> grandi sono lenti (scarta righe). Preferisci la <b>keyset pagination</b>: <code>WHERE (creato, id) &lt; (:c, :i) ORDER BY creato DESC, id DESC LIMIT 20</code>.</p>
<h3>Altro che serve</h3><ul><li>Connection pooling (PgBouncer): troppe connessioni uccidono Postgres.</li><li>Migrazioni sicure: colonne nullable prima, backfill a lotti, indici con <code>CREATE INDEX CONCURRENTLY</code>.</li><li>JSONB per dati semi-strutturati, ma con indici GIN e senza abusarne.</li><li>Repliche in lettura: attenzione al ritardo di replica (read-your-writes).</li></ul>
<div class="say"><b>Cosa dire.</b> «Per i saldi uso transazioni con lock o controllo di versione, leggo EXPLAIN ANALYZE prima di aggiungere indici e pagino con keyset.»</div>`,
  [
    q(
      'q1',
      'Quale livello di isolamento usa di default Postgres?',
      ['Read Committed', 'Serializable', 'Read Uncommitted', 'Repeatable Read'],
      0,
      'Ogni statement vede i dati committati fino a quel momento.',
    ),
    q(
      'q2',
      'A cosa serve <code>FOR UPDATE SKIP LOCKED</code>?',
      [
        'A bloccare tutta la tabella',
        'A prendere righe non bloccate: code di lavori senza contesa',
        'A fare rollback',
        'A ordinare',
      ],
      1,
      'I worker prendono lavori diversi senza aspettarsi.',
    ),
    q(
      'q3',
      'Un indice composto <code>(a, b)</code> serve per <code>WHERE b = 1</code>?',
      ['Sì sempre', 'In genere no: serve il prefisso a', 'Solo con ORDER BY', 'Solo in MySQL'],
      1,
      "L'ordine delle colonne conta (regola del prefisso).",
    ),
    q(
      'q4',
      'Perché evitare <code>OFFSET</code> grandi?',
      ['Scartano righe: costo crescente', 'Non sono standard', 'Rompono gli indici', 'Sono deprecati'],
      0,
      "La keyset pagination sfrutta l'indice.",
    ),
    q(
      'q5',
      'Cosa permette MVCC?',
      ['I lettori non bloccano gli scrittori', 'Niente lock', 'Transazioni senza commit', 'Query più corte'],
      0,
      'Ogni transazione lavora su uno snapshot.',
    ),
  ],
  [
    card('c1', 'Lock su riga', 'SELECT ... FOR UPDATE dentro una transazione.'),
    card('c2', 'Coda di lavori', 'FOR UPDATE SKIP LOCKED.'),
    card('c3', 'Indice senza bloccare', 'CREATE INDEX CONCURRENTLY.'),
    card('c4', 'Top-N per gruppo', 'ROW_NUMBER() OVER (PARTITION BY g ORDER BY x DESC).'),
    card('c5', 'Piano di esecuzione', 'EXPLAIN (ANALYZE, BUFFERS): cerca Seq Scan e stime sbagliate.'),
  ],
  [
    prac(
      'p1',
      'Due richieste prelevano soldi dallo stesso conto contemporaneamente: come eviti il lost update?',
      'Transazione con SELECT ... FOR UPDATE sulla riga, oppure aggiornamento atomico (saldo = saldo - x con vincolo CHECK), oppure controllo di versione con ritento.',
    ),
    prac(
      'p2',
      'Una query con ORDER BY e LIMIT su 50 milioni di righe è lenta: cosa fai?',
      'EXPLAIN ANALYZE; indice composto sulle colonne di filtro e ordinamento; keyset pagination invece di OFFSET; ANALYZE se le statistiche sono vecchie.',
    ),
    prac(
      'p3',
      'Come aggiungi una colonna NOT NULL a una tabella grande senza downtime?',
      'Aggiungi nullable, backfill a lotti, aggiungi il vincolo (NOT VALID poi VALIDATE), imposta NOT NULL; codice compatibile in ogni passaggio.',
    ),
  ],
  'Note del vault: backend/databases/sql-advanced.md, postgresql/transactions-and-isolation.md, zero-downtime-migrations.md, connection-pooling.md',
)

export const redis = mod(
  'redis',
  'Cache e Redis',
  'Cache-aside, invalidazione, stampede, strutture, lock, rate limit',
  'backend',
  `<p class="lead">Una cache è un compromesso tra velocità e freschezza dei dati. Il difficile non è scriverla, ma decidere quando i dati sono "troppo vecchi".</p>
<h3>Strategie</h3><ul><li><b>Cache-aside</b> (la più comune): leggi dalla cache; se manca leggi dal database e riempi la cache.</li><li><b>Write-through</b>: scrivi cache e database insieme. <b>Write-behind</b>: scrivi in cache e persisti dopo (rischio di perdita).</li><li><b>TTL</b>: scadenza automatica; aggiungi <b>jitter</b> casuale per non far scadere tutto insieme.</li></ul>
<pre><code>def utente(uid):
    chiave = f"utente:{uid}"
    if (v := r.get(chiave)) is not None:
        return json.loads(v)
    u = db.carica_utente(uid)
    r.set(chiave, json.dumps(u), ex=300 + random.randint(0, 60))
    return u

def aggiorna(uid, dati):
    db.salva(uid, dati)
    r.delete(f"utente:{uid}")       # invalida alla scrittura</code></pre>
<h3>Problemi classici</h3><ul><li><b>Cache stampede</b> (dogpile): una chiave molto richiesta scade e mille richieste colpiscono il database insieme. Rimedi: lock di ricostruzione, TTL con jitter, ricalcolo anticipato, <i>stale-while-revalidate</i>.</li><li><b>Penetrazione</b>: richieste per chiavi inesistenti saltano sempre la cache; memorizza anche il "non trovato" con TTL breve o usa un Bloom filter.</li><li><b>Invalidazione</b>: la parte più difficile; preferisci TTL brevi e invalidazione mirata alla scrittura.</li></ul>
<h3>Strutture di Redis</h3><div class="tblw"><table><tr><th>Struttura</th><th>Uso tipico</th></tr>
<tr><td>String</td><td>valori cache, contatori (<code>INCR</code>)</td></tr>
<tr><td>Hash</td><td>oggetti con campi</td></tr>
<tr><td>List</td><td>code semplici</td></tr>
<tr><td>Set / Sorted Set</td><td>unicità; classifiche, rate limit a finestra</td></tr>
<tr><td>Stream</td><td>log di eventi con consumer group</td></tr>
<tr><td>Pub/Sub</td><td>notifiche in tempo reale (senza persistenza)</td></tr></table></div>
<h3>Lock distribuito e rate limiter</h3><pre><code># lock semplice (un solo nodo Redis)
ok = r.set("lock:report", token, nx=True, ex=30)
if ok:
    try:
        genera_report()
    finally:
        if r.get("lock:report") == token:      # in produzione: script Lua per atomicità
            r.delete("lock:report")

# rate limiter a finestra fissa
n = r.incr(f"rl:{utente}:{int(time.time()) // 60}")
if n == 1:
    r.expire(f"rl:{utente}:{int(time.time()) // 60}", 60)
if n &gt; 100:
    raise TroppeRichieste()</code></pre>
<p>I lock distribuiti sono insidiosi (scadenza, clock, failover): per correttezza forte usa vincoli del database.</p>
<h3>Operare Redis</h3><ul><li>Memoria: <code>maxmemory</code> e una policy di eviction (<code>allkeys-lru</code> per le cache).</li><li>Persistenza: RDB (snapshot) e AOF; una cache pura può farne a meno.</li><li>Non usare <code>KEYS *</code> in produzione: usa <code>SCAN</code>. Pipeline per ridurre i round trip.</li><li>Un solo thread per comandi: un comando lento blocca tutti.</li></ul>
<div class="say"><b>Cosa dire.</b> «Cache-aside con TTL e jitter, invalidazione alla scrittura, protezione dallo stampede con lock di ricostruzione; per i lock forti uso il database.»</div>`,
  [
    q(
      'q1',
      "Cos'è il cache stampede?",
      [
        'Molte richieste ricostruiscono insieme una chiave scaduta',
        'Troppa memoria',
        'Un errore di rete',
        'Un tipo di struttura',
      ],
      0,
      'Si risolve con lock di ricostruzione, TTL con jitter o stale-while-revalidate.',
    ),
    q(
      'q2',
      'Perché il jitter sul TTL?',
      ['Per risparmiare memoria', 'Per evitare che molte chiavi scadano insieme', 'Per la sicurezza', 'Per ordinarle'],
      1,
      'Distribuisce nel tempo le ricostruzioni.',
    ),
    q(
      'q3',
      'Quale comando evitare in produzione per elencare chiavi?',
      ['SCAN', 'KEYS *', 'GET', 'TTL'],
      1,
      'KEYS blocca il server su dataset grandi.',
    ),
    q(
      'q4',
      'Quale struttura per una classifica?',
      ['List', 'Sorted Set', 'Hash', 'Stream'],
      1,
      'Ordinata per punteggio con operazioni O(log n).',
    ),
    q(
      'q5',
      'Cache-aside significa…',
      [
        "L'applicazione gestisce lettura e riempimento della cache",
        'La cache scrive da sola sul database',
        'Cache solo in scrittura',
        'Cache nel client',
      ],
      0,
      'È la strategia più comune.',
    ),
  ],
  [
    card('c1', 'Cache-aside', 'Leggi cache → se manca leggi DB e riempi; invalida alla scrittura.'),
    card('c2', 'Contatore atomico', 'INCR chiave (con EXPIRE per la finestra).'),
    card('c3', 'Lock semplice', 'SET chiave token NX EX 30.'),
    card('c4', 'Eviction per cache', 'maxmemory-policy allkeys-lru.'),
    card('c5', 'Elencare chiavi', 'SCAN, mai KEYS in produzione.'),
  ],
  [
    prac(
      'p1',
      'Un endpoint molto richiesto ha una chiave che scade ogni 5 minuti e il database soffre allo scadere: cosa fai?',
      'Lock di ricostruzione (un solo processo ricalcola), TTL con jitter, stale-while-revalidate o ricalcolo anticipato in background.',
    ),
    prac(
      'p2',
      'Progetta un rate limiter per API con Redis.',
      'Sorted set con timestamp per finestra scorrevole, oppure INCR con scadenza per finestra fissa; risposta 429 con Retry-After; chiave per utente o IP.',
    ),
  ],
  'Note del vault: backend/redis/caching-patterns.md, data-structures.md, lua-scripting-atomic-ops.md, pub-sub-and-streams.md',
)

export const security = mod(
  'security',
  'Sicurezza per backend Python (OWASP)',
  'Top 10 applicato a Python: injection, authn/authz, CSRF, SSRF, supply chain',
  'master',
  `<p class="lead">La sicurezza si chiede a ogni colloquio senior. L'elenco OWASP Top 10 è la mappa; qui la applichiamo a Python, Django e FastAPI.</p>
<h3>Injection</h3><pre><code># SQL: sempre parametrizzata
cur.execute("SELECT * FROM utenti WHERE email = %s", (email,))      # corretto
cur.execute(f"SELECT * FROM utenti WHERE email = '{email}'")         # VULNERABILE

# comandi: lista di argomenti, mai shell=True con input utente
subprocess.run(["convert", nome_file, "out.png"], check=True)</code></pre>
<ul><li>Anche NoSQL e template (SSTI) sono bersagli. Mai <code>eval</code>/<code>exec</code> su input esterno.</li><li>Deserializzazione: <code>pickle.loads</code> e <code>yaml.load</code> su dati non fidati eseguono codice: usa JSON e <code>yaml.safe_load</code>.</li></ul>
<h3>Autenticazione</h3><ul><li>Password: hash lento con salt (<code>argon2</code>, <code>bcrypt</code>), mai SHA/MD5 semplici, mai in chiaro. Confronti con <code>hmac.compare_digest</code>.</li><li>Sessioni (cookie <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>) contro token (JWT): i JWT non si revocano facilmente, tieni scadenze brevi, verifica sempre firma e <code>alg</code>, non mettere dati sensibili nel payload.</li><li>OAuth2/OIDC: usa il flusso Authorization Code con PKCE; non scrivere il tuo protocollo.</li><li>Rate limit e blocco temporaneo contro il brute force; MFA dove possibile.</li></ul>
<h3>Autorizzazione</h3><ul><li><b>IDOR / Broken Access Control</b>: controlla sempre che l'utente possa accedere a <b>quell'</b>oggetto, non solo che sia loggato (<code>get_object_or_404(Ordine, pk=pk, utente=request.user)</code>).</li><li>Principio del privilegio minimo; controlli lato server, mai solo nel client.</li></ul>
<h3>Attacchi web</h3><ul><li><b>CSRF</b>: cookie di sessione + richieste che cambiano stato richiedono un token (Django lo fa di default) o <code>SameSite</code>.</li><li><b>XSS</b>: escape dell'output (i template Django lo fanno); attenzione a <code>|safe</code> e <code>mark_safe</code>; Content Security Policy.</li><li><b>SSRF</b>: se il server scarica un URL fornito dall'utente, blocca indirizzi interni (127.0.0.1, metadata cloud, reti private) e usa una allowlist.</li><li><b>Path traversal</b>: risolvi il percorso e verifica che resti nella cartella consentita (<code>Path.resolve().is_relative_to(base)</code>).</li><li><b>Upload</b>: limita dimensione e tipo, rinomina i file, non eseguirli, salvali fuori dalla web root.</li></ul>
<h3>Configurazione e dati</h3><ul><li>HTTPS ovunque; header di sicurezza (HSTS, CSP, X-Content-Type-Options); <code>DEBUG=False</code> in produzione.</li><li>Segreti in un secret manager, rotazione, mai nei log né nel repo.</li><li>Dati personali: minimizza, cifra a riposo e in transito, definisci la conservazione.</li></ul>
<h3>Supply chain</h3><ul><li>Lockfile con hash, <code>pip-audit</code>/Dependabot, attenzione al typosquatting (nomi simili) e ai pacchetti abbandonati.</li><li>Immagini Docker minime, utente non root, scansione delle vulnerabilità.</li></ul>
<h3>Come ragionare a un colloquio</h3><p>Usa un <b>threat model</b> breve: asset, chi attacca, dove entra l'input, cosa succede se fallisce ogni controllo. Difesa a strati, fallimento sicuro (negare per default), log degli eventi di sicurezza.</p>
<div class="say"><b>Cosa dire.</b> «Parametrizzo le query, controllo l'autorizzazione su ogni oggetto, valido l'input con Pydantic, tengo i segreti fuori dal codice e controllo le dipendenze.»</div>`,
  [
    q(
      'q1',
      'Cosa è un IDOR?',
      [
        "Accedere all'oggetto di un altro cambiando un ID perché manca il controllo di autorizzazione",
        'Un tipo di SQL injection',
        'Un attacco DDoS',
        'Un errore di cache',
      ],
      0,
      "Broken Access Control: verifica che l'utente possa accedere a quell'oggetto.",
    ),
    q(
      'q2',
      'Come si salvano le password?',
      [
        'SHA-256 con salt',
        'Hash lento (argon2/bcrypt) con salt',
        'Cifrate con AES e chiave nel codice',
        'In chiaro con accesso ristretto',
      ],
      1,
      'Serve un hash lento pensato per le password.',
    ),
    q(
      'q3',
      'Cosa è SSRF?',
      [
        'Far fare al server richieste verso risorse interne',
        'Iniettare script nel browser',
        'Falsificare un cookie',
        'Un attacco al DNS',
      ],
      0,
      'Blocca gli indirizzi interni e usa una allowlist.',
    ),
    q(
      'q4',
      'Quale funzione evitare su dati non fidati?',
      ['json.loads', 'yaml.safe_load', 'pickle.loads', 'int()'],
      2,
      'pickle può eseguire codice arbitrario.',
    ),
    q(
      'q5',
      'Cosa protegge dal CSRF con sessioni a cookie?',
      ['Token CSRF e/o SameSite', 'HTTPS soltanto', 'Compressione', 'Cache'],
      0,
      'Django invia il token CSRF di default.',
    ),
  ],
  [
    card('c1', 'SQL sicuro', 'Query parametrizzate: execute("... %s", (valore,)).'),
    card('c2', 'Deserializzazione sicura', 'JSON e yaml.safe_load; mai pickle su input esterno.'),
    card('c3', 'IDOR', 'Filtra sempre per proprietario: get_object_or_404(M, pk=pk, utente=request.user).'),
    card('c4', 'Confronto sicuro', 'hmac.compare_digest per token e firme.'),
    card('c5', 'Path traversal', 'Path(p).resolve().is_relative_to(base).'),
  ],
  [
    prac(
      'p1',
      "Un endpoint scarica un'immagine da un URL fornito dall'utente: quali rischi e difese?",
      'SSRF verso reti interne e metadata cloud: allowlist di host, blocco IP privati dopo la risoluzione DNS, timeout e limite di dimensione, niente redirect liberi.',
    ),
    prac(
      'p2',
      'Come proteggi una API con JWT?',
      'Scadenza breve + refresh token ruotati, verifica di firma e alg, claim minimi, revoca tramite lista o versione, HTTPS, nessun dato sensibile nel payload.',
    ),
    prac(
      'p3',
      'Fai il threat model di un endpoint di upload.',
      'Asset: storage e utenti; rischi: file malevoli, dimensioni enormi, path traversal, esecuzione; difese: limiti, validazione tipo e contenuto, rinomina, storage isolato, scansione antivirus, URL firmati.',
    ),
  ],
  'Note del vault: computer science/security/web-security.md, python/security-patterns.md, python/serialization.md',
)

export const observability = mod(
  'observability',
  'Osservabilità e debug in produzione',
  'Log, metriche, tracce, SLO, pdb, py-spy, diagnosi di incidenti',
  'master',
  `<p class="lead">In produzione non puoi fermare il programma con un debugger. Devi poter capire cosa succede da fuori: log, metriche e tracce.</p>
<h3>I tre pilastri</h3><ul><li><b>Log</b>: eventi discreti con contesto (JSON, id richiesta, livello).</li><li><b>Metriche</b>: numeri aggregati nel tempo (richieste, latenza, errori, code).</li><li><b>Tracce</b>: il percorso di una richiesta attraverso servizi e task (span con durata).</li></ul>
<h3>Metriche che contano: RED e USE</h3><ul><li><b>RED</b> per i servizi: <i>Rate</i> (richieste/s), <i>Errors</i> (tasso di errori), <i>Duration</i> (latenza, con percentili p50/p95/p99, non la media).</li><li><b>USE</b> per le risorse: <i>Utilization</i>, <i>Saturation</i>, <i>Errors</i> (CPU, memoria, pool di connessioni, code).</li></ul>
<pre><code>from prometheus_client import Counter, Histogram

RICHIESTE = Counter("http_richieste_totali", "Richieste", ["metodo", "stato"])
LATENZA = Histogram("http_latenza_secondi", "Latenza", ["rotta"])

with LATENZA.labels("/ordini").time():
    ...
RICHIESTE.labels("GET", "200").inc()</code></pre>
<p>Attenzione alla <b>cardinalità</b>: etichette come l'id utente fanno esplodere le serie temporali.</p>
<h3>Tracing con OpenTelemetry</h3><ul><li>Strumenta FastAPI/Django, <code>httpx</code>, SQLAlchemy e Celery con le librerie di auto-instrumentation.</li><li>Propaga il contesto (<code>traceparent</code>) tra servizi e dentro i messaggi dei task; usa lo stesso <b>correlation id</b> nei log.</li><li>Span personalizzati attorno alle operazioni importanti.</li></ul>
<h3>SLO e allarmi</h3><ul><li><b>SLI</b>: cosa misuri (es. % richieste sotto 300 ms). <b>SLO</b>: l'obiettivo (99,5% in 30 giorni). <b>Error budget</b>: quanto puoi sbagliare.</li><li>Allarmi sui <b>sintomi</b> (utenti colpiti, burn rate) più che sulle cause (CPU alta); ogni allarme deve avere un'azione.</li></ul>
<h3>Debug in Python</h3><pre><code>import pdb; pdb.set_trace()      # oppure breakpoint()
python -m pdb script.py            # post-mortem sul crash
pytest --pdb                       # apre pdb al primo fallimento</code></pre>
<ul><li>In pdb: <code>n</code> (next), <code>s</code> (step), <code>c</code> (continue), <code>p expr</code>, <code>l</code>, <code>bt</code>, <code>up</code>.</li><li><b>Su un processo vivo</b>: <code>py-spy dump --pid N</code> mostra dove sta ogni thread; <code>py-spy record</code> produce un flame graph; <code>faulthandler</code> stampa lo stack in caso di blocco.</li><li>Memoria: <code>tracemalloc</code>, <code>memray</code>; cerca crescita continua tra due snapshot.</li></ul>
<h3>Diagnosticare un incidente: metodo</h3><ol><li><b>Stabilizza</b>: rollback, feature flag, scala; comunica.</li><li><b>Osserva</b>: dashboard RED, cosa è cambiato (deploy, config, traffico, dipendenza).</li><li><b>Restringi</b>: tracce e log per la richiesta lenta, trova lo span o la query colpevole.</li><li><b>Ipotizza e verifica</b> una causa alla volta.</li><li><b>Dopo</b>: post-mortem senza colpe, azioni correttive, nuovi allarmi o test.</li></ol>
<div class="say"><b>Cosa dire.</b> «Misuro RED, uso tracce e correlation id per restringere il problema, stabilizzo prima di cercare la causa e chiudo con un post-mortem.»</div>`,
  [
    q(
      'q1',
      'Cosa misura il modello RED?',
      ['Rate, Errors, Duration', 'Read, Execute, Delete', 'Retry, Error, Delay', 'Request, Entry, Data'],
      0,
      'È per i servizi; USE è per le risorse.',
    ),
    q(
      'q2',
      'Perché usare percentili invece della media per la latenza?',
      ['La media nasconde le code lente', 'Sono più facili', 'Sono obbligatori', 'Occupano meno spazio'],
      0,
      "p95 e p99 mostrano l'esperienza peggiore.",
    ),
    q(
      'q3',
      'Quale strumento mostra dove sta un processo Python vivo senza fermarlo?',
      ['py-spy dump', 'pdb', 'timeit', 'pip'],
      0,
      "py-spy campiona lo stack dall'esterno.",
    ),
    q(
      'q4',
      'Qual è il rischio di una metrica con etichetta id_utente?',
      ['Esplosione di cardinalità', 'Perdita di dati', 'Errori di rete', 'Nessuno'],
      0,
      'Troppe serie temporali.',
    ),
    q(
      'q5',
      'Primo passo in un incidente?',
      [
        'Cercare la causa radice',
        'Stabilizzare (rollback, flag, scala) e comunicare',
        'Scrivere il post-mortem',
        'Riavviare tutto',
      ],
      1,
      "Riduci l'impatto prima di indagare.",
    ),
  ],
  [
    card('c1', 'RED', 'Rate, Errors, Duration (per servizi).'),
    card('c2', 'USE', 'Utilization, Saturation, Errors (per risorse).'),
    card('c3', 'Debugger', 'breakpoint(); pytest --pdb; python -m pdb.'),
    card('c4', 'Processo vivo', 'py-spy dump --pid / py-spy record; faulthandler.'),
    card('c5', 'Correlation id', 'Lo stesso id nei log, nelle tracce e nei messaggi dei task.'),
  ],
  [
    prac(
      'p1',
      'Un endpoint ha p99 di 4 secondi ma p50 di 80 ms: come indaghi?',
      'Guardo le tracce delle richieste lente: query specifiche, lock, chiamate esterne, code di worker, garbage collection; confronto per parametro/utente; poi correggo il punto individuato.',
    ),
    prac(
      'p2',
      'La memoria di un servizio cresce senza fermarsi: come procedi?',
      'Metriche per confermare; tracemalloc o memray con snapshot a intervalli; cerco cache senza limite, riferimenti in strutture globali, cicli con __del__; correggo e verifico.',
    ),
  ],
  'Note del vault: tooling/opentelemetry/*, prometheus-grafana.md, logs-vs-traces.md, python/logging-structured.md',
)

export const sysdesign = mod(
  'sysdesign',
  'System design per backend Python',
  'Metodo, stime, scalabilità, coerenza, 5 progetti svolti',
  'master',
  `<p class="lead">Il colloquio di system design valuta come ragioni, non il diagramma finale. Serve un metodo ripetibile e la capacità di motivare i compromessi.</p>
<h3>Il metodo in 6 passi</h3><ol><li><b>Requisiti funzionali</b>: cosa fa il sistema (e cosa non fa).</li><li><b>Requisiti non funzionali</b>: utenti, latenza, disponibilità, coerenza, durabilità, costi.</li><li><b>Stime</b>: richieste/s, dati al giorno, banda, storage.</li><li><b>Design di alto livello</b>: client, API, servizi, database, cache, code.</li><li><b>Approfondimento</b> sui punti critici (dati, scalabilità, errori).</li><li><b>Compromessi e evoluzione</b>: cosa cambia a 10x, cosa può rompersi.</li></ol>
<h3>Stime a mente</h3><ul><li>1 milione di richieste al giorno ≈ 12 richieste/s in media; il picco è 3-10x.</li><li>1 KB × 1 milione = 1 GB. Un nodo Postgres ben tenuto regge migliaia di scritture/s.</li><li>Latenze: memoria ~100 ns, SSD ~100 µs, rete nello stesso data center ~0,5 ms, tra continenti ~100 ms.</li></ul>
<h3>Blocchi di costruzione</h3><ul><li><b>Scalare</b>: orizzontale (più istanze dietro un load balancer, servizi senza stato) contro verticale.</li><li><b>Dati</b>: repliche in lettura, partizionamento/sharding (per chiave, attenzione agli hot spot), indici, denormalizzazione dove serve.</li><li><b>Cache</b> (Redis, CDN), <b>code</b> per il lavoro asincrono, <b>object storage</b> per i file.</li><li><b>Coerenza</b>: forte contro eventuale; il teorema CAP dice che in caso di partizione scegli tra coerenza e disponibilità.</li><li><b>Resilienza</b>: timeout, retry con backoff, circuit breaker, idempotenza, degradazione controllata.</li></ul>
<h3>Progetto 1: accorciatore di URL</h3><ul><li>Scrittura: genera un id corto (base62 di un contatore, o hash) e salva <code>codice → url</code>; lettura molto più frequente della scrittura.</li><li>Redirect via cache; database chiave-valore o Postgres con indice; scadenza opzionale; analitiche asincrone via coda.</li></ul>
<h3>Progetto 2: rate limiter</h3><ul><li>Algoritmi: finestra fissa, finestra scorrevole, <i>token bucket</i>. Stato in Redis (atomicità con Lua o <code>INCR</code>).</li><li>Risposta 429 con <code>Retry-After</code>; chiave per utente/IP; comportamento in caso di Redis giù (fail open o fail closed).</li></ul>
<h3>Progetto 3: servizio di notifiche</h3><ul><li>API accetta l'evento e lo scrive nel database con una <b>outbox</b>; un relay lo mette in coda; worker per canale (email, push, SMS) con retry e DLQ.</li><li>Idempotenza per evitare duplicati, preferenze utente, limiti per canale, tracciamento dello stato di consegna.</li></ul>
<h3>Progetto 4: feed di attività</h3><ul><li>Fan-out in scrittura (precalcola il feed di ogni follower: lettura veloce, scrittura costosa per account molto seguiti) contro fan-out in lettura (calcola al volo). Ibrido per i grandi account.</li><li>Cache dei feed in Redis (sorted set), paginazione a cursore.</li></ul>
<h3>Progetto 5: caricamento file e pipeline</h3><ul><li>URL pre-firmati per caricare direttamente su object storage; evento di completamento che accoda l'elaborazione (scansione, miniature).</li><li>Stato dell'elaborazione, riprendibilità, limiti di dimensione.</li></ul>
<h3>Domande da farti sempre</h3><ul><li>Qual è il collo di bottiglia a 10x? Cosa succede se questo componente cade?</li><li>Come gestisco i duplicati e l'ordine dei messaggi? Dove serve la coerenza forte?</li><li>Come lo osservo e lo rilascio senza downtime?</li></ul>
<div class="say"><b>Cosa dire.</b> «Parto dai requisiti e dalle stime, disegno la versione semplice, poi scalo il punto critico motivando ogni compromesso.»</div>`,
  [
    q(
      'q1',
      'Cosa dice il teorema CAP?',
      [
        'In caso di partizione di rete scegli tra coerenza e disponibilità',
        'Non si possono avere cache e database insieme',
        'Serve sempre il sharding',
        'Ogni sistema è consistente',
      ],
      0,
      'Le partizioni di rete accadono: la scelta è inevitabile.',
    ),
    q(
      'q2',
      'Quante richieste/s sono circa 1 milione al giorno?',
      ['~1', '~12', '~1000', '~100000'],
      1,
      '1.000.000 / 86.400 ≈ 11,6 in media; il picco è molto più alto.',
    ),
    q(
      'q3',
      'Cosa è un token bucket?',
      [
        'Un algoritmo di rate limiting che permette raffiche limitate',
        'Una cache',
        'Un tipo di coda',
        'Un formato di token',
      ],
      0,
      'Un secchio che si riempie a velocità costante.',
    ),
    q(
      'q4',
      'Perché la outbox nel servizio di notifiche?',
      [
        "Garantisce che l'evento sia coerente con il dato scritto nella stessa transazione",
        'Velocizza le email',
        'Evita i retry',
        'Riduce la memoria',
      ],
      0,
      'Un relay pubblica poi gli eventi.',
    ),
    q(
      'q5',
      'Quando scegli il fan-out in lettura per un feed?',
      ['Per account con moltissimi follower', 'Per account piccoli sempre', 'Mai', 'Solo con cache'],
      0,
      'Il fan-out in scrittura sarebbe troppo costoso per i grandi account.',
    ),
  ],
  [
    card('c1', 'Metodo', 'Requisiti → non funzionali → stime → alto livello → approfondimento → compromessi.'),
    card('c2', '1M richieste/giorno', '≈ 12 richieste/s medie; picco 3-10x.'),
    card('c3', 'Resilienza', 'Timeout, retry con backoff, circuit breaker, idempotenza.'),
    card('c4', 'Coerenza', 'Forte vs eventuale; CAP in caso di partizione.'),
    card('c5', 'File grandi', 'URL pre-firmati verso object storage + evento di completamento.'),
  ],
  [
    prac(
      'p1',
      'Progetta un accorciatore di URL per 100 milioni di redirect al giorno.',
      'Stima ~1200 lettura/s medie, picchi 10x; id base62 da contatore distribuito; chiave-valore con cache davanti (letture >> scritture); CDN opzionale; analitiche asincrone via coda; scadenze e abuso controllati.',
    ),
    prac(
      'p2',
      'Come garantisci che una notifica non parta due volte?',
      'Chiave di idempotenza per notifica, vincolo di unicità nel database, stato "inviata" aggiornato atomicamente, task idempotenti e verifica prima dell\'invio.',
    ),
    prac(
      'p3',
      "Un servizio dipende da un'API esterna lenta: cosa metti in atto?",
      'Timeout, retry con backoff solo su errori transitori, circuit breaker, cache dove possibile, coda per decoupling, degradazione controllata e allarmi.',
    ),
  ],
  'Note del vault: computer science/system-design.md, distributed-systems-patterns.md, databases/cap-theorem-distributed.md',
)

export const review = mod(
  'review',
  'Leggere codice altrui e fare code review',
  'Entrare in un codebase, debug, checklist di review, ADR',
  'master',
  `<p class="lead">Un senior passa più tempo a leggere codice che a scriverlo. Saper entrare in un progetto sconosciuto e fare review utili è una competenza da colloquio e da lavoro.</p>
<h3>Entrare in un codebase: procedura</h3><ol><li><b>README e struttura</b>: cosa fa, come si avvia, come si testa.</li><li><b>Punti d'ingresso</b>: <code>main</code>, route, comandi CLI, task Celery, signal.</li><li><b>Segui un caso d'uso</b> dall'ingresso al database (una richiesta vera).</li><li><b>Leggi i test</b>: sono la documentazione eseguibile.</li><li><b>Dipendenze e configurazione</b>: <code>pyproject.toml</code>, variabili d'ambiente, <code>docker-compose</code>.</li><li><b>Fai girare tutto</b> in locale e prova a rompere qualcosa.</li></ol>
<h3>Archeologia con git</h3><pre><code>git log --oneline -- percorso/file.py        # storia di un file
git blame -L 40,60 file.py                   # chi e quando ha scritto le righe
git log -S "nome_funzione" --oneline         # quando è comparsa/scomparsa una stringa
git log -p --follow file.py                  # modifiche, anche dopo rinomine
git bisect start / good / bad                # trova il commit che ha rotto qualcosa</code></pre>
<h3>Strumenti per leggere in Python</h3><ul><li>Vai alla definizione nell'editor; <code>grep -rn</code>/<code>ripgrep</code> per usi e chiamanti.</li><li>REPL: <code>help(obj)</code>, <code>dir(obj)</code>, <code>inspect.getsource(f)</code>, <code>type(x).__mro__</code>.</li><li>Debugger con <code>breakpoint()</code> per vedere i dati reali; <code>pytest -x --pdb</code> sul primo fallimento.</li></ul>
<h3>Checklist di review per Python</h3><ul><li><b>Correttezza</b>: casi limite (vuoto, None, duplicati), argomenti di default mutabili, confronto con <code>is</code>, eccezioni troppo larghe.</li><li><b>Dati</b>: N+1, transazioni, race condition, migrazioni compatibili, indici.</li><li><b>Concorrenza</b>: codice bloccante in async, stato condiviso, idempotenza dei task.</li><li><b>Sicurezza</b>: input non validato, query non parametrizzate, segreti nel codice, autorizzazione.</li><li><b>Test</b>: copre il comportamento, non l'implementazione; casi di errore.</li><li><b>Leggibilità</b>: nomi, funzioni corte, tipi, commenti che spiegano il <i>perché</i>.</li><li><b>Compatibilità</b>: API pubblica, log, metriche, rollback possibile.</li></ul>
<h3>Commenti che insegnano</h3><ul><li>Spiega il <b>perché</b> e proponi un'alternativa; distingui bloccante da suggerimento (<i>nit:</i>).</li><li>Fai domande invece di dare ordini («cosa succede se la lista è vuota?»).</li><li>Riconosci ciò che è fatto bene. Mantieni le PR piccole e focalizzate.</li></ul>
<h3>Documentare le decisioni</h3><p>Un <b>ADR</b> (Architecture Decision Record) è una pagina breve: contesto, decisione, alternative, conseguenze. Ti permette di spiegare il <i>perché</i> a chi arriva dopo (e a te stesso fra sei mesi).</p>
<h3>Spiegare i compromessi</h3><p>«Ho scelto X perché… il costo è… lo rivedrei se…». Dichiarare i limiti del proprio design è un segnale di seniority.</p>
<div class="say"><b>Cosa dire.</b> «Entro in un codice seguendo un caso d'uso dall'ingresso al database, leggo i test e uso git per capire perché le cose sono fatte così; nelle review spiego il perché e distinguo i nit dai blocchi.»</div>`,
  [
    q(
      'q1',
      'Quale comando git trova quando è comparsa una stringa nel codice?',
      ['git log -S "stringa"', 'git status', 'git stash', 'git tag'],
      0,
      'git log -S cerca i commit che cambiano il numero di occorrenze.',
    ),
    q(
      'q2',
      'Qual è il modo migliore per capire un codebase nuovo?',
      [
        'Leggere ogni file in ordine',
        "Seguire un caso d'uso dall'ingresso al database e leggere i test",
        'Riscriverlo',
        'Chiedere solo ai colleghi',
      ],
      1,
      'Un percorso concreto batte la lettura lineare.',
    ),
    q(
      'q3',
      'Cosa è un ADR?',
      [
        'Un record breve di una decisione architetturale con contesto e alternative',
        'Un tipo di test',
        'Un formato di log',
        'Un database',
      ],
      0,
      'Spiega il perché delle scelte.',
    ),
    q(
      'q4',
      'Come si formula un buon commento di review?',
      [
        'Con un ordine secco',
        "Spiegando il perché e proponendo un'alternativa",
        'Solo con un "no"',
        'Ignorando i test',
      ],
      1,
      'Distingui bloccanti e nit.',
    ),
    q(
      'q5',
      'Quale comando trova il commit che ha introdotto un bug?',
      ['git bisect', 'git blame', 'git clean', 'git remote'],
      0,
      'bisect fa una ricerca binaria sulla storia.',
    ),
  ],
  [
    card('c1', 'Chi ha scritto queste righe', 'git blame -L 40,60 file.py'),
    card('c2', 'Quando è comparsa una funzione', 'git log -S "nome" --oneline'),
    card('c3', 'Trovare il commit del bug', 'git bisect start; good; bad.'),
    card('c4', 'Ispezionare un oggetto', 'help(x), dir(x), inspect.getsource(f).'),
    card('c5', 'ADR', 'Contesto, decisione, alternative, conseguenze.'),
  ],
  [
    prac(
      'p1',
      'Ti assegnano un servizio Python che non conosci: i tuoi primi due giorni.',
      'Lo avvio in locale, leggo README e test, seguo una richiesta end-to-end con il debugger, mappo dipendenze e config, uso git log/blame sulle parti critiche, scrivo una nota di architettura e una piccola correzione.',
    ),
    prac(
      'p2',
      'Fai la review di una PR che aggiunge un endpoint: cosa guardi?',
      'Autorizzazione per oggetto, validazione input, transazioni e N+1, errori e log, test, retrocompatibilità, migrazioni, metriche; commenti con il perché.',
    ),
  ],
  'Note del vault: tooling/code-review.md, tooling/code-review-fundamentals.md, tooling/git/*',
)
