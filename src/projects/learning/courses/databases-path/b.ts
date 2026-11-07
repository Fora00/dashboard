import { card, mod, prac, q } from '../kit'

// Course "Database". Groups "tx" (transactions), "ops" (Postgres in production), "beyond" (NoSQL, ORM), "pratica".

export const transactions = mod(
  'transactions',
  'Transazioni, ACID e isolamento',
  'BEGIN/COMMIT, anomalie, livelli di isolamento, MVCC',
  'tx',
  `<p class="lead">Una transazione raggruppa operazioni in un'unità "tutto o niente". È ciò che rende un database affidabile sotto concorrenza.</p>
<h3>ACID</h3><ul><li><b>Atomicità</b>: o tutte le operazioni o nessuna.</li><li><b>Coerenza</b>: si passa da uno stato valido a un altro (i vincoli sono rispettati).</li><li><b>Isolamento</b>: transazioni concorrenti non si vedono a metà.</li><li><b>Durabilità</b>: un commit sopravvive a un crash (log WAL su disco).</li></ul>
<pre><code>BEGIN;
UPDATE conti SET saldo = saldo - 100 WHERE id = 1;
UPDATE conti SET saldo = saldo + 100 WHERE id = 2;
COMMIT;      -- oppure ROLLBACK per annullare tutto</code></pre>
<h3>Anomalie di concorrenza</h3><div class="tblw"><table><tr><th>Anomalia</th><th>Che cos'è</th></tr>
<tr><td>Dirty read</td><td>leggi dati non ancora committati</td></tr>
<tr><td>Non-repeatable read</td><td>rileggi una riga e il valore è cambiato</td></tr>
<tr><td>Phantom read</td><td>rileggi un insieme e compaiono righe nuove</td></tr>
<tr><td>Lost update</td><td>due transazioni leggono e sovrascrivono: una scrittura si perde</td></tr>
<tr><td>Write skew</td><td>due transazioni leggono lo stesso insieme e scrivono righe diverse violando una regola comune</td></tr></table></div>
<h3>Livelli di isolamento (SQL standard)</h3><div class="tblw"><table><tr><th>Livello</th><th>In Postgres</th></tr>
<tr><td>Read Uncommitted</td><td>si comporta come Read Committed</td></tr>
<tr><td>Read Committed (default)</td><td>ogni statement vede i dati committati fino a quel momento</td></tr>
<tr><td>Repeatable Read</td><td>snapshot per tutta la transazione; può fallire con errore di serializzazione</td></tr>
<tr><td>Serializable</td><td>come se fossero eseguite una dopo l'altra; ritenta in caso di errore 40001</td></tr></table></div>
<h3>MVCC</h3><p>Postgres tiene più <b>versioni</b> di una riga: i lettori vedono uno snapshot e <b>non bloccano</b> gli scrittori (e viceversa). Le versioni vecchie vengono ripulite da <code>VACUUM</code>.</p>
<h3>Evitare i lost update</h3><pre><code>-- 1. aggiornamento atomico
UPDATE prodotti SET scorta = scorta - 1 WHERE id = 7 AND scorta &gt; 0;

-- 2. lock pessimistico
SELECT scorta FROM prodotti WHERE id = 7 FOR UPDATE;

-- 3. concorrenza ottimistica con versione
UPDATE prodotti SET scorta = 4, versione = versione + 1 WHERE id = 7 AND versione = 12;
-- 0 righe modificate = qualcun altro ha cambiato: rileggi e ritenta</code></pre>
<h3>Buone pratiche</h3><ul><li>Transazioni <b>brevi</b>: niente chiamate di rete o attese dell'utente dentro.</li><li>Accedi alle risorse sempre nello stesso ordine (deadlock).</li><li>Gestisci gli errori di serializzazione e deadlock con un <b>ritento</b>.</li><li>Scegli il livello più basso che garantisce la correttezza.</li></ul>
<div class="say"><b>Cosa dire.</b> «Per i saldi uso aggiornamenti atomici o lock di riga in transazioni brevi, ritento sugli errori di serializzazione e scelgo l'isolamento minimo che garantisce la regola.»</div>`,
  [
    q(
      'q1',
      'Qual è il livello di isolamento di default in Postgres?',
      ['Read Committed', 'Serializable', 'Repeatable Read', 'Read Uncommitted'],
      0,
      'Ogni statement vede i dati committati.',
    ),
    q(
      'q2',
      'Come evitare un lost update su una scorta?',
      [
        'Aggiornamento atomico (scorta = scorta - 1 con WHERE) o lock di riga',
        'Leggere e poi scrivere senza lock',
        'Aumentare i thread',
        'Usare un cache',
      ],
      0,
      'La lettura-modifica-scrittura separata è il bug.',
    ),
    q(
      'q3',
      'Cosa consente MVCC?',
      ['Lettori che non bloccano gli scrittori', 'Niente indici', 'Transazioni senza commit', 'Backup senza WAL'],
      0,
      'Più versioni della riga.',
    ),
    q(
      'q4',
      'Cosa fare su un errore di serializzazione (40001)?',
      ['Ignorarlo', 'Ritentare la transazione', 'Riavviare il DB', 'Disabilitare i vincoli'],
      1,
      'È un esito previsto ai livelli alti.',
    ),
    q(
      'q5',
      'Perché le transazioni devono essere brevi?',
      [
        'Tengono lock e versioni vecchie, bloccando altri e il vacuum',
        'Per risparmiare disco',
        'Per sicurezza',
        'Per il log',
      ],
      0,
      'Evita contesa e bloat.',
    ),
  ],
  [
    card('c1', 'ACID', 'Atomicità, Coerenza, Isolamento, Durabilità.'),
    card('c2', 'Default Postgres', 'Read Committed; Repeatable Read = snapshot; Serializable = ritenta su 40001.'),
    card('c3', 'Lost update', 'Aggiornamento atomico, SELECT FOR UPDATE o controllo di versione.'),
    card('c4', 'MVCC', 'Più versioni di riga: lettori e scrittori non si bloccano; VACUUM ripulisce.'),
    card('c5', 'Deadlock', 'Stesso ordine di accesso alle risorse e transazioni brevi.'),
  ],
  [
    prac(
      'p1',
      "Un biglietteria vende l'ultimo posto a due persone: perché e come lo eviti?",
      'Due transazioni leggono "libero" e scrivono: lost update (due transazioni leggono lo stesso posto libero e lo scrivono). Soluzione: UPDATE ... WHERE stato = \'libero\' con controllo delle righe modificate, vincolo UNIQUE su (evento, posto), oppure SELECT FOR UPDATE.',
    ),
    prac(
      'p2',
      'Spiega la differenza tra Read Committed e Repeatable Read.',
      'Read Committed: ogni statement vede lo stato committato in quel momento (rileggere può dare risultati diversi). Repeatable Read: tutta la transazione vede un unico snapshot, a costo di possibili conflitti da ritentare.',
    ),
  ],
  'Note del vault: backend/databases/postgresql/transactions-and-isolation.md, postgresql/locking.md',
)

export const locks = mod(
  'locks',
  'Lock, deadlock e concorrenza pratica',
  'Lock di riga, advisory lock, SKIP LOCKED, deadlock, timeout',
  'tx',
  `<p class="lead">La concorrenza è dove i database "veri" mostrano le differenze: lock, attese e deadlock.</p>
<h3>Lock di riga</h3><pre><code>SELECT * FROM ordini WHERE id = 5 FOR UPDATE;          -- blocca scrittori e altri FOR UPDATE
SELECT * FROM ordini WHERE id = 5 FOR SHARE;           -- blocca scritture ma consente altre letture con lock
SELECT * FROM ordini WHERE id = 5 FOR UPDATE NOWAIT;   -- errore subito se bloccata
SELECT * FROM lavori WHERE stato = 'nuovo' ORDER BY id LIMIT 1
FOR UPDATE SKIP LOCKED;                                -- salta le righe bloccate: code di lavori</code></pre>
<h3>Coda di lavori con Postgres</h3><pre><code>WITH prossimo AS (
  SELECT id FROM lavori WHERE stato = 'nuovo' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED
)
UPDATE lavori SET stato = 'in_corso' FROM prossimo WHERE lavori.id = prossimo.id RETURNING lavori.*;</code></pre><p>Più worker prendono lavori diversi senza aspettarsi: una coda semplice e affidabile per carichi moderati.</p>
<h3>Lock di tabella e DDL</h3><ul><li><code>ALTER TABLE</code> prende un lock forte: una transazione lunga che tiene la tabella aperta può bloccare la migrazione, e tutta la coda di query dietro di essa.</li><li>Usa <code>SET lock_timeout = '2s'</code> nelle migrazioni, e ritenta.</li></ul>
<h3>Deadlock</h3><p>A tiene la riga 1 e vuole la 2; B tiene la 2 e vuole la 1. Postgres ne rileva uno dopo <code>deadlock_timeout</code> e annulla una transazione con errore <code>40P01</code>.</p><ul><li>Prevenzione: accedi alle righe sempre nello stesso ordine (<code>ORDER BY id</code> prima di <code>FOR UPDATE</code>), transazioni brevi.</li><li>Gestione: ritenta la transazione abortita.</li></ul>
<h3>Advisory lock</h3><pre><code>SELECT pg_advisory_xact_lock(hashtext('report-giornaliero'));   -- lock applicativo, rilasciato al commit</code></pre><p>Utile per garantire che un job giri su un solo processo, senza una tabella dedicata.</p>
<h3>Diagnosticare le attese</h3><pre><code>SELECT pid, wait_event_type, wait_event, state, query
FROM pg_stat_activity WHERE state &lt;&gt; 'idle';

SELECT pg_blocking_pids(pid) FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) &gt; 0;</code></pre>
<ul><li>Occhio a <code>idle in transaction</code>: una sessione che ha aperto una transazione e non fa nulla tiene lock e blocca il vacuum. Imposta <code>idle_in_transaction_session_timeout</code>.</li></ul>
<h3>Timeout utili</h3><ul><li><code>statement_timeout</code>, <code>lock_timeout</code>, <code>idle_in_transaction_session_timeout</code>: proteggono il database da query e client fuori controllo.</li></ul>
<div class="say"><b>Cosa dire.</b> «Per le code uso SKIP LOCKED, per i job unici gli advisory lock, imposto lock_timeout nelle migrazioni e accedo alle righe sempre nello stesso ordine per evitare deadlock.»</div>`,
  [
    q(
      'q1',
      'A cosa serve <code>SKIP LOCKED</code>?',
      [
        'A saltare le righe già bloccate: code di lavori senza attese',
        'A ignorare gli errori',
        'A fare rollback',
        'A ordinare',
      ],
      0,
      'I worker prendono lavori diversi.',
    ),
    q(
      'q2',
      'Come si previene un deadlock?',
      [
        'Accedendo alle risorse sempre nello stesso ordine e con transazioni brevi',
        'Aumentando il pool',
        'Usando più indici',
        'Con SELECT *',
      ],
      0,
      'È la regola fondamentale.',
    ),
    q(
      'q3',
      'Perché <code>idle in transaction</code> è pericoloso?',
      ['Tiene lock e blocca il vacuum', 'Consuma CPU', 'È un errore di sintassi', 'Cancella i dati'],
      0,
      'Imposta idle_in_transaction_session_timeout.',
    ),
    q(
      'q4',
      'Perché <code>lock_timeout</code> nelle migrazioni?',
      ['Per non restare in coda dietro un lock e bloccare tutto', 'Per velocità', 'Per i backup', 'Per i log'],
      0,
      'Meglio fallire e ritentare.',
    ),
    q(
      'q5',
      'Cosa fa un advisory lock?',
      ['Lock applicativo su una chiave arbitraria', 'Blocca la tabella', 'Fa un backup', 'Chiude le connessioni'],
      0,
      'Per esempio un job unico.',
    ),
  ],
  [
    card('c1', 'Coda di lavori', 'SELECT ... FOR UPDATE SKIP LOCKED LIMIT 1.'),
    card('c2', 'Diagnosi attese', 'pg_stat_activity e pg_blocking_pids(pid).'),
    card('c3', 'Migrazione sicura', "SET lock_timeout = '2s' e ritenta."),
    card('c4', 'Job unico', 'pg_advisory_xact_lock(chiave).'),
    card('c5', 'Protezioni', 'statement_timeout, lock_timeout, idle_in_transaction_session_timeout.'),
  ],
  [
    prac(
      'p1',
      "Una migrazione si blocca e l'app va in timeout: cosa è successo?",
      'Un ALTER TABLE attende un lock dietro una transazione lunga e tutte le query successive si accodano dietro di lui. Fix: lock_timeout nella migrazione, individuare e terminare la transazione lunga, ritentare in un momento calmo.',
    ),
    prac(
      'p2',
      'Scrivi la query per prelevare il prossimo lavoro da una tabella usata come coda.',
      "<pre><code>WITH p AS (\n  SELECT id FROM lavori WHERE stato = 'nuovo' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED\n)\nUPDATE lavori SET stato = 'in_corso' FROM p WHERE lavori.id = p.id RETURNING lavori.*;</code></pre>",
    ),
  ],
  'Note del vault: backend/databases/postgresql/locking.md',
)

export const pgops = mod(
  'pgops',
  'PostgreSQL in pratica: psql, vacuum, configurazione',
  'psql, tipi utili, estensioni, VACUUM, autovacuum, monitoraggio',
  'ops',
  `<p class="lead">Sapere usare Postgres da terminale e capire cosa fa in background (vacuum, WAL, statistiche) è ciò che fa la differenza in produzione.</p>
<h3>psql: i comandi che servono</h3><pre><code>psql "postgresql://utente:pw@host:5432/db"
\\l              -- database           \\dt            -- tabelle
\\d ordini       -- struttura         \\di            -- indici
\\dn             -- schemi            \\du            -- ruoli
\\x              -- vista espansa     \\timing        -- tempi delle query
\\copy ordini TO 'ordini.csv' CSV HEADER
\\i script.sql   -- esegue un file     \\q             -- esci</code></pre>
<h3>Funzioni e tipi utili</h3><ul><li>Date: <code>now()</code>, <code>date_trunc('day', t)</code>, <code>interval '7 days'</code>, <code>AT TIME ZONE 'Europe/Rome'</code>.</li><li>Stringhe e regex: <code>ILIKE</code>, <code>~</code>, <code>regexp_replace</code>, <code>string_agg</code>.</li><li>Array e JSONB: <code>ANY(array)</code>, <code>jsonb_array_elements</code>, <code>jsonb_build_object</code>.</li><li>Intervalli, <code>uuid</code> (<code>gen_random_uuid()</code>), enum, <code>tsvector</code> per il full-text.</li></ul>
<h3>Estensioni comuni</h3><ul><li><code>pg_stat_statements</code> (statistiche query), <code>pg_trgm</code> (ricerca fuzzy e LIKE '%x%'), <code>pgcrypto</code>, <code>uuid-ossp</code>, <code>postgis</code> (geografia), <code>pgvector</code> (embedding), <code>timescaledb</code>.</li></ul>
<h3>VACUUM e autovacuum</h3><p>Per MVCC, <code>UPDATE</code> e <code>DELETE</code> lasciano <b>versioni morte</b>. <code>VACUUM</code> le ripulisce e aggiorna la mappa di visibilità; <code>ANALYZE</code> aggiorna le statistiche; <b>autovacuum</b> lo fa da solo.</p><ul><li>Segnali di problemi: tabelle "gonfie" (<i>bloat</i>), query che rallentano nel tempo, <code>n_dead_tup</code> alto in <code>pg_stat_user_tables</code>.</li><li>Per tabelle molto aggiornate: abbassa <code>autovacuum_vacuum_scale_factor</code> a livello di tabella.</li><li><code>VACUUM FULL</code> riscrive la tabella e la blocca: da evitare in produzione (usa <code>pg_repack</code>).</li><li>Transazioni lunghe impediscono il vacuum di pulire.</li></ul>
<h3>WAL e checkpoint</h3><p>Ogni modifica va prima nel <b>WAL</b> (write-ahead log), poi nelle pagine dati: così il commit è durevole e il recupero dopo crash è possibile. Il WAL alimenta anche replica e backup continuo (PITR).</p>
<h3>Configurazione di base</h3><ul><li><code>shared_buffers</code> (circa 25% della RAM), <code>effective_cache_size</code> (50-75%), <code>work_mem</code> (per sort/hash, per operazione: attenzione moltiplicato per connessioni), <code>maintenance_work_mem</code>, <code>max_connections</code> (usa un pooler).</li><li>Strumenti: PGTune per un punto di partenza; poi misura.</li></ul>
<h3>Monitoraggio essenziale</h3><ul><li>Connessioni attive, cache hit ratio, query lente (<code>pg_stat_statements</code>), lag di replica, spazio su disco, età delle transazioni, bloat, dimensione del WAL.</li><li>Viste: <code>pg_stat_activity</code>, <code>pg_stat_user_tables</code>, <code>pg_stat_user_indexes</code>, <code>pg_locks</code>.</li></ul>
<div class="say"><b>Cosa dire.</b> «Monitoro pg_stat_statements, bloat e lag di replica, lascio lavorare autovacuum e lo regolo per le tabelle calde, e uso un pooler invece di aumentare max_connections.»</div>`,
  [
    q(
      'q1',
      'A cosa serve <code>VACUUM</code>?',
      [
        'Ripulisce le versioni morte delle righe e aiuta gli index-only scan',
        'Fa il backup',
        'Crea indici',
        'Cifra i dati',
      ],
      0,
      'Conseguenza di MVCC.',
    ),
    q(
      'q2',
      'Perché evitare <code>VACUUM FULL</code> in produzione?',
      ['Riscrive la tabella bloccandola', 'È deprecato', 'Cancella dati', 'Non funziona'],
      0,
      'Usa pg_repack.',
    ),
    q(
      'q3',
      'Cosa è il WAL?',
      ['Il log in cui ogni modifica è scritta prima delle pagine dati', 'Un tipo di indice', 'Un pooler', 'Una vista'],
      0,
      'Dà durabilità, replica e PITR.',
    ),
    q(
      'q4',
      "Quale estensione aiuta con <code>LIKE '%abc%'</code>?",
      ['pg_trgm', 'pgcrypto', 'postgis', 'uuid-ossp'],
      0,
      'Indici GIN/GiST trigram.',
    ),
    q(
      'q5',
      'Perché una transazione lunga è un problema per il vacuum?',
      [
        'Impedisce di eliminare le versioni ancora visibili',
        'Consuma RAM soltanto',
        'Blocca la rete',
        'Nessun problema',
      ],
      0,
      'Produce bloat.',
    ),
  ],
  [
    card('c1', 'Struttura di una tabella', 'psql: \\d nome_tabella.'),
    card('c2', 'Query lente', 'Estensione pg_stat_statements.'),
    card('c3', 'Bloat', 'Controlla n_dead_tup, autovacuum per tabella, pg_repack al posto di VACUUM FULL.'),
    card('c4', 'Cache di Postgres', 'shared_buffers ≈ 25% RAM; effective_cache_size 50-75%.'),
    card('c5', 'Troppe connessioni', 'Un pooler (PgBouncer), non max_connections alto.'),
  ],
  [
    prac(
      'p1',
      'Una tabella molto aggiornata rallenta nel tempo: indagine.',
      'Controllo n_dead_tup e last_autovacuum in pg_stat_user_tables, transazioni lunghe che bloccano il vacuum, regolo autovacuum_vacuum_scale_factor per quella tabella, e se serve pg_repack.',
    ),
    prac(
      'p2',
      'Elenca cosa monitori su un Postgres di produzione.',
      'Connessioni, latenza e query lente, cache hit ratio, lock/attese, lag di replica, bloat, spazio disco e WAL, età transazioni, errori.',
    ),
  ],
  'Note del vault: backend/databases/postgresql/postgresql_index.md, psql-cli.md',
)

export const scaling = mod(
  'scaling',
  'Scalare: pooling, repliche, partizioni, backup',
  'PgBouncer, replica, partizionamento, sharding, backup e PITR',
  'ops',
  `<p class="lead">Si scala un database per gradi: prima query e indici, poi connessioni, repliche, partizioni, e solo alla fine sharding.</p>
<h3>Connection pooling</h3><ul><li>Ogni connessione Postgres è un processo: centinaia di connessioni uccidono il server.</li><li><b>PgBouncer</b> condivide poche connessioni reali tra molti client. Modalità: <i>session</i>, <i>transaction</i> (la più usata), <i>statement</i>. Con <i>transaction</i> pooling niente stato di sessione (<code>SET</code>, advisory lock di sessione, tabelle temporanee); i prepared statement funzionano solo da PgBouncer 1.21 con <code>max_prepared_statements</code>.</li><li>Dimensione del pool dell'app piccola; il pooler esterno fa il resto.</li></ul>
<h3>Replica</h3><ul><li><b>Replica fisica in streaming</b>: copia del WAL a uno o più <i>standby</i>, in sola lettura. Serve per alta disponibilità (failover) e per scalare le letture.</li><li><b>Sincrona</b> (nessuna perdita, latenza maggiore) contro <b>asincrona</b> (veloce, possibile perdita di pochi ultimi commit).</li><li><b>Lag di replica</b>: una lettura sulla replica può mostrare dati vecchi. Problema "read your writes": dopo una scrittura leggi dal primario per un po', oppure usa token di coerenza.</li><li><b>Replica logica</b>: per tabelle selezionate, upgrade senza downtime, integrazioni.</li></ul>
<h3>Partizionamento</h3><pre><code>CREATE TABLE eventi (
  id bigint, creato timestamptz NOT NULL, dati jsonb
) PARTITION BY RANGE (creato);

CREATE TABLE eventi_2026_11 PARTITION OF eventi
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');</code></pre>
<ul><li>Per tabelle enormi con un criterio naturale (tempo): query che filtrano per partizione ne leggono poche (<i>partition pruning</i>) e puoi eliminare i vecchi dati con <code>DROP</code> invece di milioni di <code>DELETE</code>.</li><li>Tipi: range, list, hash. Gestisci la creazione automatica delle partizioni.</li></ul>
<h3>Sharding</h3><p>Dividere i dati su più server per chiave (utente, tenant). Aumenta la scala di scrittura ma complica join, transazioni e rebalancing: <b>ultima risorsa</b>. Prima: cache, repliche, partizioni, hardware più grande. Soluzioni: Citus, sharding applicativo, database distribuiti (CockroachDB, Spanner).</p>
<h3>Backup e recupero</h3><ul><li><b>Logico</b>: <code>pg_dump</code> (portabile, lento per grandi dati). <b>Fisico</b>: <code>pg_basebackup</code> + archiviazione del WAL.</li><li><b>PITR</b> (point-in-time recovery): torni a un istante preciso (prima di un <code>DELETE</code> sbagliato). Strumenti: pgBackRest, WAL-G, servizi gestiti.</li><li><b>Un backup non testato non esiste</b>: ripristina regolarmente in un ambiente di prova e misura <b>RPO</b> (quanti dati puoi perdere) e <b>RTO</b> (in quanto tempo riparti).</li></ul>
<h3>Alta disponibilità</h3><p>Primario + standby con failover automatico (Patroni, servizi gestiti come RDS/Cloud SQL). Testa il failover: l'app deve riconnettersi e ritentare.</p>
<h3>Ordine di intervento</h3><ol><li>Query e indici. 2. Pooling. 3. Cache. 4. Repliche per le letture. 5. Partizioni. 6. Hardware. 7. Sharding.</li></ol>
<div class="say"><b>Cosa dire.</b> «Prima query e indici, poi pooling e cache, repliche per le letture con attenzione al lag, partizioni per i dati temporali; sharding solo se necessario; i backup li ripristino davvero.»</div>`,
  [
    q(
      'q1',
      'Perché un pooler come PgBouncer?',
      [
        'Ogni connessione è un processo: troppe connessioni degradano Postgres',
        'Per cifrare',
        'Per replicare',
        'Per fare backup',
      ],
      0,
      'Condivide poche connessioni reali.',
    ),
    q(
      'q2',
      'Qual è il rischio delle letture su una replica asincrona?',
      ['Dati leggermente vecchi (lag)', 'Nessuno', 'Più sicurezza', 'Scritture perse'],
      0,
      'Read-your-writes non garantito.',
    ),
    q(
      'q3',
      'Cosa significa PITR?',
      [
        'Tornare a un istante preciso con base backup + WAL',
        'Un tipo di indice',
        'Un pooler',
        'Un livello di isolamento',
      ],
      0,
      'Utile dopo un DELETE sbagliato.',
    ),
    q(
      'q4',
      'Perché partizionare per tempo?',
      [
        'Il pruning legge poche partizioni e le vecchie si eliminano con DROP',
        'Per risparmiare CPU sempre',
        'Per le transazioni',
        'Per cifrare',
      ],
      0,
      'Evita milioni di DELETE.',
    ),
    q(
      'q5',
      'Quando si ricorre allo sharding?',
      ['Per primo', 'Come ultima risorsa, dopo cache, repliche e partizioni', 'Mai', 'Solo in test'],
      1,
      'Complica join e transazioni.',
    ),
  ],
  [
    card('c1', 'Pooling', 'PgBouncer in transaction mode: pochi collegamenti reali, niente stato di sessione.'),
    card('c2', 'Alta disponibilità', 'Primario + standby con failover automatico (Patroni o servizio gestito).'),
    card('c3', 'RPO e RTO', 'RPO: dati che puoi perdere. RTO: tempo per ripartire.'),
    card('c4', 'Dati temporali enormi', 'Partizioni per intervallo e DROP delle vecchie.'),
    card('c5', 'Backup', 'Logico: pg_dump. Fisico + PITR: pg_basebackup/pgBackRest/WAL-G. Testa il ripristino.'),
  ],
  [
    prac(
      'p1',
      "Il database rallenta con 800 connessioni dell'app: cosa fai?",
      'Introduco PgBouncer in transaction mode, riduco i pool delle app, controllo le query lente e le transazioni lunghe; non alzo max_connections.',
    ),
    prac(
      'p2',
      'Progetta backup e recupero per un servizio che non può perdere più di 5 minuti di dati.',
      'Archiviazione continua del WAL con pgBackRest/WAL-G (RPO di pochi minuti), base backup periodici, replica, test mensili di PITR con misura del RTO, allarmi sul lag di archiviazione.',
    ),
  ],
  'Note del vault: backend/databases/connection-pooling.md, postgresql/partitioning-and-replication.md, cap-theorem-distributed.md',
)

export const migrations = mod(
  'migrations',
  'Migrazioni di schema senza downtime',
  'Espandi-migra-contrai, backfill, lock, strumenti',
  'ops',
  `<p class="lead">Cambiare uno schema mentre l'app è in produzione richiede passaggi piccoli, retrocompatibili e reversibili.</p>
<h3>Il principio</h3><p>Durante un rilascio girano insieme il codice vecchio e quello nuovo. Ogni passaggio di schema deve funzionare con <b>entrambi</b>. Schema: <b>espandi → migra → contrai</b>.</p>
<h3>Esempio: rinominare una colonna</h3><ol><li><b>Espandi</b>: aggiungi la colonna nuova (nullable).</li><li>Codice: scrive in <b>entrambe</b>, legge dalla vecchia.</li><li><b>Backfill</b> a lotti della colonna nuova.</li><li>Codice: legge dalla nuova (e continua a scrivere in entrambe).</li><li>Codice: smette di scrivere la vecchia.</li><li><b>Contrai</b>: elimina la colonna vecchia.</li></ol>
<h3>Operazioni pericolose e alternative</h3><div class="tblw"><table><tr><th>Operazione</th><th>Rischio</th><th>Alternativa</th></tr>
<tr><td><code>ADD COLUMN NOT NULL DEFAULT x</code></td><td>riscrittura/lock (versioni vecchie)</td><td>nullable, backfill, poi NOT NULL (<code>CHECK ... NOT VALID</code> + <code>VALIDATE</code>)</td></tr>
<tr><td><code>CREATE INDEX</code></td><td>blocca le scritture</td><td><code>CREATE INDEX CONCURRENTLY</code></td></tr>
<tr><td>Aggiungere una FK</td><td>scansione e lock</td><td><code>ADD CONSTRAINT ... NOT VALID</code>, poi <code>VALIDATE CONSTRAINT</code></td></tr>
<tr><td>Cambiare il tipo di una colonna</td><td>riscrittura della tabella</td><td>colonna nuova + backfill + switch</td></tr>
<tr><td>Rinominare/eliminare colonne usate</td><td>rompe il codice vecchio</td><td>espandi-migra-contrai</td></tr></table></div>
<h3>Backfill sicuro</h3><pre><code>-- a lotti, con pause, fuori dall'orario di punta
UPDATE ordini SET totale_cent = (totale * 100)::bigint
WHERE id BETWEEN :da AND :a AND totale_cent IS NULL;</code></pre><ul><li>Lotti piccoli (es. 1.000-10.000 righe), transazioni brevi, controlla replica e carico, rendi lo script ripartibile e idempotente.</li></ul>
<h3>Lock e timeout</h3><pre><code>SET lock_timeout = '3s';
SET statement_timeout = '60s';
ALTER TABLE ordini ADD COLUMN note text;   -- se non ottiene il lock in 3s, fallisce e si ritenta</code></pre>
<h3>Strumenti</h3><ul><li>Alembic (SQLAlchemy), Django migrations, Prisma Migrate, Flyway, Liquibase, sqitch. Versionano lo schema nel repository.</li><li>Regola: la migrazione è <b>codice</b>: si rivede, si prova su una copia dei dati, ha un piano di rollback.</li><li><code>pg_repack</code>, <code>gh-ost</code>/<code>pt-online-schema-change</code> (MySQL) per riscritture online.</li></ul>
<h3>Rollback</h3><p>I dati non si "annullano": preferisci migrazioni additive e un rollback del <b>codice</b>; elimina solo quando sei sicuro. Tieni backup prima di operazioni distruttive.</p>
<h3>Trappole</h3><ul><li>Migrazione e deploy del codice incompatibili nello stesso passo.</li><li>Dimenticare che una transazione lunga in lettura può bloccare un <code>ALTER</code> e fermare tutto.</li><li>Backfill in una sola transazione enorme.</li></ul>
<div class="say"><b>Cosa dire.</b> «Cambi additivi e retrocompatibili, backfill a lotti, indici con CONCURRENTLY, vincoli NOT VALID poi validati, lock_timeout e un piano di rollback del codice.»</div>`,
  [
    q(
      'q1',
      'Qual è lo schema per un cambio sicuro?',
      ['Espandi, migra, contrai', 'Elimina e ricrea', "Fermare l'app", 'ALTER diretto'],
      0,
      'Codice vecchio e nuovo convivono.',
    ),
    q(
      'q2',
      'Come aggiungi un indice a una tabella molto usata?',
      ['CREATE INDEX CONCURRENTLY', 'CREATE INDEX normale in orario di punta', 'DROP e ricrea', 'Non si può'],
      0,
      'Non blocca le scritture.',
    ),
    q(
      'q3',
      'Come aggiungi una FK senza lock lunghi?',
      ['ADD CONSTRAINT NOT VALID poi VALIDATE', 'Aggiungila e basta', 'Elimina i dati', 'Riavvia'],
      0,
      'La validazione non blocca le scritture.',
    ),
    q(
      'q4',
      'Perché il backfill a lotti?',
      ['Evita transazioni enormi, lock lunghi e lag di replica', 'È più elegante', 'Obbligatorio', 'Per i log'],
      0,
      'Lotti piccoli e ripartibili.',
    ),
    q(
      'q5',
      'Perché <code>lock_timeout</code> in una migrazione?',
      ["Per non accodare tutta l'app dietro un lock", 'Per velocità', 'Per il vacuum', 'Per la replica'],
      0,
      'Fallisce e si ritenta.',
    ),
  ],
  [
    card(
      'c1',
      'Rinominare una colonna',
      'Aggiungi nuova → scrivi in entrambe → backfill → leggi la nuova → togli la vecchia.',
    ),
    card('c2', 'Indice online', 'CREATE INDEX CONCURRENTLY.'),
    card('c3', 'Vincolo online', 'NOT VALID poi VALIDATE CONSTRAINT.'),
    card('c4', 'Backfill', 'Lotti piccoli, ripartibile, idempotente, con pause.'),
    card('c5', 'Rollback', 'Preferisci rollback del codice; migrazioni additive.'),
  ],
  [
    prac(
      'p1',
      'Devi cambiare <code>totale numeric</code> in <code>totale_cent bigint</code> su 300M di righe senza downtime.',
      'Aggiungi totale_cent nullable; il codice scrive in entrambe; backfill a lotti; verifica uguaglianza; il codice legge totale_cent; poi rimuovi totale. Vincolo NOT NULL con NOT VALID + VALIDATE.',
    ),
    prac(
      'p2',
      "Una migrazione fa andare in timeout l'app: cause e prevenzione?",
      'Lock forte dietro una transazione lunga e coda di query; prevenzione: lock_timeout, migrazioni in orari tranquilli, nessuna transazione lunga, operazioni online (CONCURRENTLY, NOT VALID).',
    ),
  ],
  'Note del vault: backend/databases/zero-downtime-migrations.md, prisma/prisma-migrations.md',
)

export const nosql = mod(
  'nosql',
  'Oltre il relazionale: documenti, chiave-valore e altro',
  'MongoDB, Redis, colonnari, grafo, ricerca, vettoriali, modelli di coerenza',
  'beyond',
  `<p class="lead">I database NoSQL non sono «meglio» né «peggio»: ottimizzano altri compromessi. Capire quali ti permette di scegliere l'attrezzo giusto.</p>
<h3>Modello a documenti (MongoDB)</h3><pre><code>{
  "_id": "ordine-42",
  "cliente": { "id": 7, "nome": "Ada" },
  "righe": [ { "sku": "A1", "qta": 2 }, { "sku": "B3", "qta": 1 } ],
  "stato": "pagato"
}</code></pre><ul><li>Un documento contiene dati correlati <b>annidati</b>: una lettura sola, niente join. Schema flessibile.</li><li>Si <b>incorpora</b> ciò che si legge insieme e cambia insieme; si <b>riferisce</b> ciò che è condiviso o cresce senza limite.</li><li>Query: <code>db.ordini.find({ stato: "pagato" })</code>, aggregation pipeline, indici (anche composti e parziali).</li><li>Attenzione: join e transazioni multi-documento sono possibili ma meno naturali; la flessibilità dello schema sposta la validazione nell'app (usa JSON Schema validation).</li></ul>
<h3>Chiave-valore (Redis, DynamoDB)</h3><ul><li>Accesso per chiave in O(1); modello di accesso <b>deciso in anticipo</b> (DynamoDB: chiave di partizione e di ordinamento; query diverse dal previsto = nuova tabella o indice).</li><li>Cache, sessioni, contatori, code, classifiche.</li></ul>
<h3>Colonnare e analitico</h3><ul><li>I dati sono memorizzati per colonna: leggere poche colonne su miliardi di righe è molto efficiente (ClickHouse, BigQuery, Parquet con DuckDB).</li><li>Scritture a blocchi, non per riga: pensati per analisi, non per transazioni.</li></ul>
<h3>Grafo</h3><p>Nodi e archi con proprietà (Neo4j): ottimo per percorsi e relazioni profonde ("amici di amici", raccomandazioni, frodi). In SQL le stesse query richiedono molti join o CTE ricorsive.</p>
<h3>Ricerca e vettoriali</h3><ul><li><b>Elasticsearch/OpenSearch</b>: indice invertito, ranking, analisi del testo, faccette. Non è la fonte di verità: si alimenta dal database principale.</li><li><b>Vettoriali</b> (pgvector, Pinecone, Qdrant): similarità tra embedding per ricerca semantica e RAG; indici approssimati (HNSW, IVF).</li></ul>
<h3>Coerenza distribuita: CAP e BASE</h3><ul><li><b>CAP</b>: in caso di partizione di rete scegli tra coerenza e disponibilità.</li><li><b>Coerenza eventuale</b>: le repliche convergono col tempo; l'app deve tollerare letture vecchie.</li><li>Molti sistemi permettono di scegliere per operazione (livelli di consistenza, quorum).</li></ul>
<h3>Postgres fa quasi tutto</h3><ul><li><code>jsonb</code> per documenti, <code>pgvector</code> per vettori, full-text integrato, <code>LISTEN/NOTIFY</code>, code con <code>SKIP LOCKED</code>, <code>timescaledb</code> per serie temporali.</li><li>Prima di aggiungere un altro sistema, verifica se Postgres basta.</li></ul>
<h3>Scegliere</h3><div class="tblw"><table><tr><th>Bisogno</th><th>Strumento</th></tr>
<tr><td>Ordini, utenti, pagamenti</td><td>Postgres</td></tr>
<tr><td>Cache, sessioni, rate limit</td><td>Redis</td></tr>
<tr><td>Ricerca testuale con ranking</td><td>Elasticsearch/OpenSearch</td></tr>
<tr><td>Analisi su grandi volumi</td><td>colonnare/warehouse</td></tr>
<tr><td>Similarità semantica</td><td>pgvector / DB vettoriale</td></tr>
<tr><td>Relazioni profonde</td><td>grafo</td></tr></table></div>
<div class="say"><b>Cosa dire.</b> «Parto da Postgres, uso jsonb per i dati flessibili e aggiungo Redis, ricerca o un warehouse solo per bisogni misurati, tenendoli sincronizzati dalla fonte di verità.»</div>`,
  [
    q(
      'q1',
      'Quando incorpori un sotto-oggetto in un documento?',
      ['Quando lo leggi e lo modifichi insieme al padre', 'Sempre', 'Mai', 'Solo se è enorme'],
      0,
      'Altrimenti riferiscilo.',
    ),
    q(
      'q2',
      'Perché Elasticsearch non è la fonte di verità?',
      [
        'È un indice derivato, si alimenta dal database principale',
        'Perché è lento',
        'Perché è a pagamento',
        'Perché non ha dati',
      ],
      0,
      'Eventuale coerenza e ricostruibilità.',
    ),
    q(
      'q3',
      'A cosa serve un database colonnare?',
      ['Analisi su molte righe leggendo poche colonne', 'Transazioni bancarie', 'Cache', 'Grafi'],
      0,
      'ClickHouse, BigQuery, DuckDB.',
    ),
    q(
      'q4',
      'Cosa è la coerenza eventuale?',
      [
        'Le repliche convergono nel tempo: possibili letture vecchie',
        'Coerenza immediata',
        'Niente repliche',
        'Errori',
      ],
      0,
      "L'app deve tollerarla.",
    ),
    q(
      'q5',
      'Prima di aggiungere un nuovo tipo di database cosa verifichi?',
      ['Se Postgres (jsonb, pgvector, full-text) basta già', 'Il logo', 'Il prezzo solo', 'Niente'],
      0,
      'Ogni sistema in più è un costo operativo.',
    ),
  ],
  [
    card('c1', 'Documenti', 'Incorpora ciò che leggi e cambia insieme; riferisci il resto.'),
    card('c2', 'Ricerca', 'Elasticsearch/OpenSearch come indice derivato, non fonte di verità.'),
    card('c3', 'Analisi', 'Colonnare: ClickHouse, BigQuery, DuckDB/Parquet.'),
    card('c4', 'CAP', 'In partizione: coerenza oppure disponibilità.'),
    card('c5', 'Prima di aggiungere un DB', 'Valuta jsonb, pgvector, full-text, SKIP LOCKED in Postgres.'),
  ],
  [
    prac(
      'p1',
      'Progetta lo storage per un e-commerce con ricerca prodotti e raccomandazioni.',
      "Postgres per ordini/utenti/prodotti; indice Elasticsearch alimentato da eventi/outbox per la ricerca; Redis per cache e carrello; pgvector o un servizio vettoriale per le raccomandazioni; warehouse per l'analisi.",
    ),
    prac(
      'p2',
      'Quando MongoDB e quando Postgres con jsonb?',
      'Mongo se il dato è per natura documento, con accessi per documento intero e scala di scrittura orizzontale; Postgres+jsonb se ti servono anche relazioni, transazioni e query ad hoc, che è il caso più comune.',
    ),
  ],
  'Note del vault: backend/databases/mongodb.md, nosql-databases.md, vector-databases.md, redis/*',
)

export const orm = mod(
  'orm',
  "ORM e accesso ai dati dall'applicazione",
  'Query builder, ORM, N+1, transazioni, pool, quando scrivere SQL',
  'beyond',
  `<p class="lead">Dall'applicazione i dati si raggiungono con driver, query builder o ORM. Ognuno ha un punto di equilibrio tra comodità e controllo.</p>
<h3>Livelli di astrazione</h3><div class="tblw"><table><tr><th>Livello</th><th>Esempi</th><th>Pro e contro</th></tr>
<tr><td>Driver + SQL</td><td>psycopg, asyncpg, pg (Node)</td><td>controllo totale, più codice</td></tr>
<tr><td>Query builder</td><td>SQLAlchemy Core, Knex, Kysely, jOOQ</td><td>SQL composabile e tipizzato</td></tr>
<tr><td>ORM</td><td>SQLAlchemy ORM, Django ORM, Prisma, TypeORM</td><td>mappa tabelle a oggetti, produttività, rischio di query nascoste</td></tr></table></div>
<h3>Cosa dà un ORM</h3><ul><li>Mappatura tabelle ↔ classi, relazioni, migrazioni, protezione dalla SQL injection, portabilità.</li><li><b>Unit of Work</b>/sessione: raccoglie i cambiamenti e li scrive al commit.</li></ul>
<h3>I problemi tipici</h3><ul><li><b>N+1</b>: una query per ogni elemento di una lista. Soluzione: eager loading (<code>select_related</code>/<code>prefetch_related</code>, <code>selectinload</code>, <code>include</code> di Prisma) o una query con JOIN/<code>IN</code>.</li><li><b>Caricare troppo</b>: colonne e relazioni inutili (<code>only</code>, <code>defer</code>, proiezioni).</li><li><b>Query nascoste</b> dietro attributi "pigri" (lazy loading) dentro i cicli o i template.</li><li><b>Sessioni lunghe</b> e oggetti obsoleti; confusione sui confini della transazione.</li><li>Operazioni di massa fatte oggetto per oggetto: usa <code>bulk_create</code>, <code>UPDATE</code> a livello di query.</li></ul>
<h3>Esempio N+1</h3><pre><code># N+1
for ordine in session.scalars(select(Ordine)):
    print(ordine.cliente.nome)              # una query per ordine

# corretto
stmt = select(Ordine).options(selectinload(Ordine.cliente))
for ordine in session.scalars(stmt):
    print(ordine.cliente.nome)</code></pre>
<h3>Transazioni e pool</h3><ul><li>Una sessione/transazione per richiesta o per caso d'uso; commit esplicito; rollback sugli errori.</li><li>Il pool di connessioni limita le connessioni aperte: dimensionalo rispetto a worker e pooler.</li><li>Side effect (email, code) <b>dopo</b> il commit.</li></ul>
<h3>Quando scrivere SQL a mano</h3><ul><li>Report, analisi, CTE e window function complesse; operazioni di massa; ottimizzazioni misurate.</li><li>Tienile in funzioni testate, parametrizzate, o in viste del database.</li></ul>
<h3>Test dell'accesso ai dati</h3><ul><li>Testa con un database vero (container) invece di mock del repository per le query importanti.</li><li>Test che asseriscono il <b>numero di query</b> (<code>assertNumQueries</code>) intercettano gli N+1 prima della produzione.</li></ul>
<div class="say"><b>Cosa dire.</b> «ORM per il CRUD quotidiano, eager loading contro gli N+1, SQL esplicito per report e operazioni di massa, e test con un database vero che contano le query.»</div>`,
  [
    q(
      'q1',
      "Che cos'è l'N+1?",
      ['Una query per ogni elemento invece di una per tutti', 'Un errore di sintassi', 'Un tipo di indice', 'Un lock'],
      0,
      'Eager loading o JOIN.',
    ),
    q(
      'q2',
      'Quando scrivere SQL a mano?',
      ['Per report complessi e operazioni di massa', 'Mai', 'Sempre', 'Solo in test'],
      0,
      "Dove l'ORM non è espressivo o efficiente.",
    ),
    q(
      'q3',
      "Dove vanno gli effetti collaterali come l'invio di email?",
      ['Dopo il commit', 'Prima del commit', 'Dentro la query', 'Non servono'],
      0,
      'Altrimenti partono anche se la transazione fallisce.',
    ),
    q(
      'q4',
      'Come intercetti gli N+1 nei test?',
      ['Asserendo il numero di query', 'Ignorandoli', 'Con mock', 'Con più thread'],
      0,
      'assertNumQueries o equivalente.',
    ),
    q(
      'q5',
      'Cosa è la sessione/unit of work?',
      ['Raccoglie i cambiamenti e li scrive al commit', 'Un pool', 'Un indice', 'Un backup'],
      0,
      'Confini di transazione chiari.',
    ),
  ],
  [
    card('c1', 'N+1', 'Eager loading (select_related/prefetch_related/selectinload) o JOIN.'),
    card('c2', 'Operazioni di massa', 'bulk_create / UPDATE a livello di query, non oggetto per oggetto.'),
    card('c3', 'Effetti collaterali', 'Dopo il commit (on_commit / outbox).'),
    card('c4', 'Test sui dati', 'Database vero in container; asserzione sul numero di query.'),
    card('c5', 'Colonne inutili', 'only/defer/proiezioni invece di SELECT *.'),
  ],
  [
    prac(
      'p1',
      'Una pagina elenco ordini con cliente e righe fa 300 query: come lo risolvi?',
      'Eager loading: join/selectinload per cliente e righe, proiezione delle colonne necessarie, paginazione; test che asserisce il numero di query.',
    ),
    prac(
      'p2',
      'Quando un ORM diventa un ostacolo?',
      'Con report analitici, operazioni di massa, query con window function e CTE, o quando le query nascoste dietro attributi lazy superano il controllo: passa a SQL esplicito o a un query builder per quei casi.',
    ),
  ],
  'Note del vault: backend/databases/prisma/*, django/models-orm.md, python/db-api-parameterized-queries.md',
)

export const dbDrills = mod(
  'drills',
  'Esercizi SQL con soluzioni',
  '15 problemi da colloquio su join, aggregazioni, window function e schema',
  'pratica',
  `<p class="lead">Scrivi la query prima di aprire la soluzione. Per ognuno chiediti anche: quale indice la renderebbe veloce? Cosa succede con NULL, duplicati e tabelle vuote?</p>
<h3>Le tabelle</h3><pre><code>clienti(id, nome, citta, creato)
ordini(id, cliente_id, totale, stato, creato)
righe(ordine_id, prodotto_id, qta, prezzo)
prodotti(id, nome, categoria)</code></pre>
<h3>Metodo</h3><ul><li>Scrivi il risultato desiderato a parole.</li><li>Identifica le tabelle e le chiavi di join, poi la granularità del risultato (una riga per cosa?).</li><li>Verifica con pochi dati inventati.</li></ul>`,
  [],
  [
    card('c1', 'Clienti senza ordini', 'NOT EXISTS o LEFT JOIN ... WHERE o.id IS NULL.'),
    card('c2', 'Top N per gruppo', 'ROW_NUMBER() OVER (PARTITION BY g ORDER BY x DESC) e filtro in sottoquery.'),
    card('c3', 'Variazione periodo su periodo', 'LAG() su un aggregato mensile.'),
    card('c4', 'Duplicati', 'GROUP BY colonne HAVING COUNT(*) > 1.'),
  ],
  [
    prac(
      's1',
      'Il secondo ordine più alto di ogni cliente.',
      '<pre><code>SELECT * FROM (\n  SELECT o.*, DENSE_RANK() OVER (PARTITION BY cliente_id ORDER BY totale DESC) AS r\n  FROM ordini o\n) t WHERE r = 2;</code></pre>',
    ),
    prac(
      's2',
      'Clienti che hanno ordinato in gennaio ma non in febbraio.',
      "<pre><code>SELECT DISTINCT c.id FROM clienti c\nJOIN ordini o ON o.cliente_id = c.id AND o.creato &gt;= '2026-01-01' AND o.creato &lt; '2026-02-01'\nWHERE NOT EXISTS (\n  SELECT 1 FROM ordini x WHERE x.cliente_id = c.id\n  AND x.creato &gt;= '2026-02-01' AND x.creato &lt; '2026-03-01'\n);</code></pre>",
    ),
    prac(
      's3',
      'Trova le email duplicate nella tabella clienti (se ci fosse la colonna).',
      '<pre><code>SELECT lower(email), COUNT(*) FROM clienti GROUP BY lower(email) HAVING COUNT(*) &gt; 1;</code></pre>',
    ),
    prac(
      's4',
      'Fatturato per categoria, con la percentuale sul totale.',
      '<pre><code>SELECT p.categoria,\n  SUM(r.qta * r.prezzo) AS fatturato,\n  round(100.0 * SUM(r.qta * r.prezzo) / SUM(SUM(r.qta * r.prezzo)) OVER (), 1) AS pct\nFROM righe r JOIN prodotti p ON p.id = r.prodotto_id\nGROUP BY p.categoria ORDER BY fatturato DESC;</code></pre>',
    ),
    prac(
      's5',
      'Clienti il cui ultimo ordine ha più di 90 giorni.',
      "<pre><code>SELECT c.id, MAX(o.creato) AS ultimo\nFROM clienti c JOIN ordini o ON o.cliente_id = c.id\nGROUP BY c.id\nHAVING MAX(o.creato) &lt; now() - interval '90 days';</code></pre>",
    ),
    prac(
      's6',
      'Media mobile a 7 giorni del fatturato giornaliero.',
      '<pre><code>WITH g AS (\n  SELECT creato::date AS giorno, SUM(totale) AS tot FROM ordini GROUP BY 1\n)\nSELECT giorno, AVG(tot) OVER (ORDER BY giorno ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS media7\nFROM g ORDER BY giorno;</code></pre>',
    ),
    prac(
      's7',
      'Il prodotto più venduto di ogni categoria.',
      '<pre><code>SELECT DISTINCT ON (categoria) categoria, prodotto, venduto FROM (\n  SELECT p.categoria, p.nome AS prodotto, SUM(r.qta) AS venduto\n  FROM righe r JOIN prodotti p ON p.id = r.prodotto_id GROUP BY 1, 2\n) t ORDER BY categoria, venduto DESC;</code></pre>',
    ),
    prac(
      's8',
      'Elimina i duplicati tenendo la riga con id minimo.',
      '<pre><code>DELETE FROM clienti a USING clienti b\nWHERE a.id &gt; b.id AND lower(a.email) = lower(b.email);</code></pre>',
    ),
    prac(
      's9',
      'Per ogni cliente, giorni tra un ordine e il precedente.',
      '<pre><code>SELECT cliente_id, id, creato,\n  creato - LAG(creato) OVER (PARTITION BY cliente_id ORDER BY creato) AS dal_precedente\nFROM ordini;</code></pre>',
    ),
    prac(
      's10',
      'Clienti con almeno 3 ordini pagati consecutivi senza annullamenti.',
      'Gaps and islands: ROW_NUMBER() globale meno ROW_NUMBER() per stato identifica i gruppi di righe consecutive con lo stesso stato; poi si raggruppa e si filtra COUNT(*) >= 3.',
    ),
    prac(
      's11',
      'Quanti clienti hanno fatto 1, 2, 3+ ordini?',
      "<pre><code>SELECT CASE WHEN n &gt;= 3 THEN '3+' ELSE n::text END AS ordini, COUNT(*) AS clienti\nFROM (SELECT cliente_id, COUNT(*) AS n FROM ordini GROUP BY 1) t GROUP BY 1 ORDER BY 1;</code></pre>",
    ),
    prac(
      's12',
      'Ordini con totale diverso dalla somma delle righe.',
      '<pre><code>SELECT o.id, o.totale, SUM(r.qta * r.prezzo) AS somma\nFROM ordini o JOIN righe r ON r.ordine_id = o.id\nGROUP BY o.id HAVING o.totale &lt;&gt; SUM(r.qta * r.prezzo);</code></pre>',
    ),
    prac(
      's13',
      'Pivot: fatturato per mese in colonne (gen, feb, mar).',
      '<pre><code>SELECT categoria,\n  SUM(tot) FILTER (WHERE mese = 1) AS gen,\n  SUM(tot) FILTER (WHERE mese = 2) AS feb,\n  SUM(tot) FILTER (WHERE mese = 3) AS mar\nFROM v_fatturato GROUP BY categoria;</code></pre>',
    ),
    prac(
      's14',
      'Trasferisci 100 da un conto a un altro in modo sicuro.',
      '<pre><code>BEGIN;\nUPDATE conti SET saldo = saldo - 100 WHERE id = 1 AND saldo &gt;= 100;\n-- verifica: 1 riga aggiornata, altrimenti ROLLBACK\nUPDATE conti SET saldo = saldo + 100 WHERE id = 2;\nCOMMIT;</code></pre>',
    ),
    prac(
      's15',
      "Spiega a voce perché una query con LIKE '%rossi%' è lenta e come la acceleri.",
      "Il prefisso jolly impedisce l'uso del B-tree: scansione completa. Soluzione: estensione pg_trgm con indice GIN/GiST trigram, oppure full-text search con tsvector, oppure un motore di ricerca.",
    ),
  ],
)

export const dbInterview = mod(
  'interview',
  'Domande da colloquio su database',
  '25 domande con risposta breve da dire a voce',
  'pratica',
  `<p class="lead">Rispondi a voce in 30-60 secondi: definizione, perché, esempio, trappola. Poi confronta con la traccia.</p>`,
  [],
  [
    card('c1', 'ACID', 'Atomicità, Coerenza, Isolamento, Durabilità.'),
    card('c2', 'Indice', 'Struttura ordinata che evita la scansione completa: costa in scrittura e spazio.'),
    card('c3', 'MVCC', 'Più versioni delle righe: i lettori non bloccano gli scrittori.'),
    card('c4', 'N+1', 'Una query per elemento invece di una per tutti.'),
  ],
  [
    prac(
      'i1',
      'Differenza tra INNER e LEFT JOIN?',
      'INNER tiene solo le righe con corrispondenza; LEFT tiene tutte quelle di sinistra con NULL dove manca la corrispondenza.',
    ),
    prac(
      'i2',
      'WHERE contro HAVING?',
      'WHERE filtra le righe prima del raggruppamento; HAVING filtra i gruppi dopo (può usare aggregati).',
    ),
    prac(
      'i3',
      "Che cos'è un indice e quando non aiuta?",
      "Struttura ordinata (B-tree) per trovare righe in fretta; non aiuta con funzioni sulla colonna, LIKE '%x', bassa selettività, o prefisso sbagliato in un indice composto.",
    ),
    prac(
      'i4',
      'Cosa significa ACID?',
      'Atomicità (tutto o niente), Coerenza (vincoli rispettati), Isolamento (transazioni non si vedono a metà), Durabilità (commit sopravvive ai crash).',
    ),
    prac(
      'i5',
      'Livelli di isolamento e anomalie?',
      'Read Uncommitted/Committed/Repeatable Read/Serializable; anomalie: dirty read, non-repeatable read, phantom, write skew. Postgres: default Read Committed, MVCC.',
    ),
    prac(
      'i6',
      'Come eviti un lost update?',
      'Aggiornamento atomico nel database, SELECT FOR UPDATE, controllo di versione ottimistico o livello Serializable con ritento.',
    ),
    prac(
      'i7',
      "Che cos'è un deadlock e come lo gestisci?",
      "Due transazioni si aspettano a vicenda su lock; prevenzione con ordine uniforme e transazioni brevi; il DB ne annulla una e l'app ritenta.",
    ),
    prac(
      'i8',
      'Normalizzazione: perché e quando denormalizzare?',
      'Per evitare duplicazioni e anomalie; denormalizzi per storico o prestazioni di lettura misurate, mantenendo la coerenza.',
    ),
    prac('i9', 'Chiave primaria naturale o surrogata?', 'Surrogata come PK (stabile), naturale con vincolo UNIQUE.'),
    prac(
      'i10',
      'Come leggi un EXPLAIN?',
      'Confronto righe stimate e reali, tipo di scansione e join, sort su disco, loops; cerco Seq Scan su tabelle grandi e stime sbagliate.',
    ),
    prac(
      'i11',
      'Come scopri le query lente?',
      'pg_stat_statements ordinato per tempo totale, log delle query lente, auto_explain, APM.',
    ),
    prac(
      'i12',
      'OFFSET o keyset pagination?',
      "OFFSET scarta righe (lento in profondità e instabile); keyset usa l'ultimo valore visto con l'indice.",
    ),
    prac(
      'i13',
      "Cos'è il connection pooling e perché serve?",
      'Ogni connessione è un processo costoso; il pooler condivide poche connessioni reali tra molti client.',
    ),
    prac(
      'i14',
      'Replica sincrona o asincrona?',
      'Sincrona: nessuna perdita ma più latenza; asincrona: veloce, possibile perdita degli ultimi commit e letture vecchie dalla replica.',
    ),
    prac(
      'i15',
      'Quando partizionare una tabella?',
      'Quando è enorme con un criterio naturale (tempo): pruning e rimozione dei vecchi dati con DROP.',
    ),
    prac(
      'i16',
      'Come fai una migrazione senza downtime?',
      'Espandi-migra-contrai, backfill a lotti, indici CONCURRENTLY, vincoli NOT VALID poi VALIDATE, lock_timeout.',
    ),
    prac(
      'i17',
      'SQL o NoSQL?',
      'Parto da Postgres (anche jsonb); NoSQL per bisogni specifici: cache, ricerca, analisi, grafi, scala di scrittura orizzontale.',
    ),
    prac('i18', 'CAP theorem?', 'In caso di partizione di rete scegli tra coerenza e disponibilità.'),
    prac('i19', "Cos'è l'N+1 e come lo risolvi?", 'Una query per elemento; eager loading, JOIN o query con IN.'),
    prac(
      'i20',
      "Che cos'è VACUUM?",
      'Ripulisce le versioni morte dovute a MVCC e aggiorna la mappa di visibilità; autovacuum lo automatizza.',
    ),
    prac(
      'i21',
      'Come proteggi dalla SQL injection?',
      "Query parametrizzate sempre, ORM, privilegi minimi dell'utente del database.",
    ),
    prac(
      'i22',
      'Come gestisci i backup?',
      'WAL archiviato + base backup (PITR), test di ripristino, RPO e RTO definiti.',
    ),
    prac(
      'i23',
      'Come progetti uno schema multi-tenant?',
      'tenant_id in ogni tabella, vincoli e indici che lo includono, row-level security; oppure schema o database per tenant se serve isolamento forte.',
    ),
    prac(
      'i24',
      'Come usi una tabella come coda di lavori?',
      'SELECT ... FOR UPDATE SKIP LOCKED con stato; worker multipli; attenzione a retry e idempotenza.',
    ),
    prac(
      'i25',
      'Cosa fai se una query è lenta in produzione?',
      'Isolo la query, leggo EXPLAIN ANALYZE, controllo indici e statistiche, riscrivo o aggiungo indice con CONCURRENTLY, rimisuro e metto un allarme.',
    ),
  ],
)
