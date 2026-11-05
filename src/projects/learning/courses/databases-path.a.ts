import { card, mod, prac, q } from './python-path.helpers'

// Course "Database: dal SQL al Postgres in produzione". Group "fond" and "sql".

export const dbIntro = mod(
  'intro',
  "Cos'è un database e quale scegliere",
  'Relazionale, documento, chiave-valore, colonnare, grafo, ricerca, vettoriale',
  'fond',
  `<p class="lead">Un database è un sistema che conserva dati in modo durevole, li rende interrogabili e garantisce regole di coerenza anche con più utenti insieme. Il primo passo è sapere che esistono famiglie diverse e quando sceglierle.</p>
<h3>Le famiglie</h3><div class="tblw"><table><tr><th>Famiglia</th><th>Esempi</th><th>Quando</th></tr>
<tr><td>Relazionale (SQL)</td><td>PostgreSQL, MySQL, SQLite</td><td>dati strutturati con relazioni, transazioni, query flessibili: il default</td></tr>
<tr><td>Documento</td><td>MongoDB, Firestore</td><td>documenti annidati con schema variabile, letture per documento intero</td></tr>
<tr><td>Chiave-valore</td><td>Redis, DynamoDB</td><td>cache, sessioni, accessi per chiave a bassissima latenza</td></tr>
<tr><td>Colonnare / analitico</td><td>ClickHouse, BigQuery, DuckDB</td><td>aggregazioni su miliardi di righe</td></tr>
<tr><td>Grafo</td><td>Neo4j</td><td>relazioni profonde (social, raccomandazioni)</td></tr>
<tr><td>Ricerca</td><td>Elasticsearch, OpenSearch</td><td>full-text, ranking, filtri a faccette</td></tr>
<tr><td>Serie temporali</td><td>TimescaleDB, InfluxDB</td><td>metriche e sensori</td></tr>
<tr><td>Vettoriale</td><td>pgvector, Pinecone</td><td>ricerca per similarità (embedding, RAG)</td></tr></table></div>
<h3>OLTP contro OLAP</h3><ul><li><b>OLTP</b>: tante piccole transazioni (ordini, utenti): Postgres, MySQL.</li><li><b>OLAP</b>: poche query enormi di analisi: data warehouse, colonnari.</li></ul>
<h3>Come scegliere</h3><ol><li>Hai relazioni e vincoli? Parti da <b>PostgreSQL</b>.</li><li>Il tuo carico è davvero diverso (cache, analisi, ricerca)? Aggiungi lo strumento giusto <b>accanto</b>, non al posto.</li><li>Scegli ciò che la squadra sa operare: backup, monitoraggio e migrazioni contano più delle prestazioni teoriche.</li></ol>
<h3>Concetti comuni</h3><ul><li><b>Schema</b>: struttura dei dati (rigido nel relazionale, flessibile nei documenti).</li><li><b>Indice</b>: struttura ausiliaria per trovare in fretta.</li><li><b>Transazione</b>: gruppo di operazioni "tutto o niente".</li><li><b>Replica</b> e <b>backup</b>: disponibilità e recupero.</li></ul>
<h3>Poliglotta, ma con giudizio</h3><p>Molti sistemi usano Postgres come fonte di verità, Redis per cache e code, Elasticsearch per la ricerca. Ogni database in più è un sistema da sincronizzare, monitorare e far ripartire: aggiungilo solo con un motivo misurabile.</p>
<div class="say"><b>Cosa dire.</b> «Parto da Postgres e aggiungo uno store specializzato solo quando il carico lo richiede e so come tenerlo sincronizzato e operarlo.»</div>`,
  [
    q(
      'q1',
      'Quale database scegli di default per dati con relazioni e transazioni?',
      ['Un relazionale come PostgreSQL', 'Redis', 'Elasticsearch', 'Un grafo'],
      0,
      'È la scelta più sicura e versatile.',
    ),
    q(
      'q2',
      "Che cos'è OLAP?",
      ['Molte piccole transazioni', 'Poche query pesanti di analisi', 'Un tipo di indice', 'Un protocollo'],
      1,
      'Data warehouse e database colonnari.',
    ),
    q(
      'q3',
      'Per cosa è tipico Redis?',
      ['Cache e sessioni per chiave', 'Analisi su miliardi di righe', 'Grafi', 'Full-text'],
      0,
      'Accesso per chiave a bassa latenza.',
    ),
    q(
      'q4',
      'Cosa fa pgvector?',
      ['Ricerca per similarità su embedding dentro Postgres', 'Crittografia', 'Replica', 'Backup'],
      0,
      'Utile per RAG e raccomandazioni.',
    ),
    q(
      'q5',
      'Quando aggiungere un secondo database?',
      ['Sempre', 'Quando il carico lo richiede e puoi operarlo', 'Mai', 'Per moda'],
      1,
      'Ogni sistema in più va sincronizzato e monitorato.',
    ),
  ],
  [
    card('c1', 'Default', 'PostgreSQL per dati strutturati con relazioni e transazioni.'),
    card('c2', 'OLTP vs OLAP', 'OLTP: molte piccole transazioni. OLAP: poche query grandi di analisi.'),
    card('c3', 'Chiave-valore', 'Redis, DynamoDB: cache, sessioni, accesso per chiave.'),
    card('c4', 'Ricerca testuale', 'Elasticsearch/OpenSearch (o full-text di Postgres per casi semplici).'),
    card('c5', 'Similarità', 'Database vettoriali / pgvector per embedding.'),
  ],
  [
    prac(
      'p1',
      "Un'app di e-commerce: quali database usi e perché?",
      "Postgres come fonte di verità per ordini e utenti; Redis per carrello/sessioni e cache; Elasticsearch per la ricerca prodotti (alimentato da eventi); data warehouse per l'analisi.",
    ),
    prac(
      'p2',
      'Un collega vuole MongoDB «perché è più veloce»: come rispondi?',
      'Chiedo il carico e il modello dei dati: relazioni e transazioni favoriscono Postgres (JSONB per la parte flessibile); misuro con dati reali prima di cambiare.',
    ),
  ],
  'Note del vault: backend/databases/databases_index.md, nosql-databases.md, vector-databases.md',
)

export const sqlBase = mod(
  'sqlbase',
  'SQL di base: leggere i dati',
  'SELECT, WHERE, ORDER BY, LIMIT, JOIN, GROUP BY, HAVING',
  'fond',
  `<p class="lead">SQL è un linguaggio <b>dichiarativo</b>: descrivi il risultato che vuoi, non come ottenerlo. Il motore sceglie il piano.</p>
<h3>Le tabelle degli esempi</h3><pre><code>clienti(id, nome, citta, creato)
ordini(id, cliente_id, totale, stato, creato)</code></pre>
<h3>SELECT, WHERE, ORDER BY, LIMIT</h3><pre><code>SELECT nome, citta
FROM clienti
WHERE citta = 'Milano' AND creato &gt;= '2026-01-01'
ORDER BY nome ASC
LIMIT 10;</code></pre>
<ul><li>Operatori: <code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>BETWEEN</code>, <code>IN (...)</code>, <code>LIKE 'Mi%'</code>, <code>IS NULL</code>.</li><li><code>NULL</code> è "sconosciuto": <code>NULL = NULL</code> non è vero. Si usa <code>IS NULL</code> / <code>IS NOT NULL</code>.</li><li>Ordine logico di esecuzione: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.</li></ul>
<h3>JOIN</h3><pre><code>SELECT c.nome, o.totale
FROM ordini o
JOIN clienti c ON c.id = o.cliente_id          -- INNER JOIN: solo corrispondenze
WHERE o.stato = 'pagato';

SELECT c.nome, COUNT(o.id) AS n_ordini
FROM clienti c
LEFT JOIN ordini o ON o.cliente_id = c.id      -- tiene anche i clienti senza ordini
GROUP BY c.id, c.nome;</code></pre>
<div class="tblw"><table><tr><th>Join</th><th>Risultato</th></tr>
<tr><td>INNER</td><td>solo righe con corrispondenza in entrambe</td></tr>
<tr><td>LEFT</td><td>tutte a sinistra, NULL dove manca a destra</td></tr>
<tr><td>RIGHT</td><td>speculare al LEFT</td></tr>
<tr><td>FULL</td><td>tutte da entrambe</td></tr>
<tr><td>CROSS</td><td>prodotto cartesiano</td></tr></table></div>
<h3>Aggregazioni</h3><pre><code>SELECT citta, COUNT(*) AS n, AVG(totale) AS medio
FROM clienti c JOIN ordini o ON o.cliente_id = c.id
WHERE o.stato = 'pagato'
GROUP BY citta
HAVING COUNT(*) &gt; 10
ORDER BY n DESC;</code></pre>
<ul><li><code>WHERE</code> filtra le righe <b>prima</b> di raggruppare; <code>HAVING</code> filtra i gruppi <b>dopo</b>.</li><li>Ogni colonna nel SELECT non aggregata deve stare nel <code>GROUP BY</code>.</li><li><code>COUNT(*)</code> conta le righe; <code>COUNT(col)</code> ignora i NULL; <code>COUNT(DISTINCT col)</code>.</li></ul>
<h3>Sottoquery e DISTINCT</h3><pre><code>SELECT DISTINCT citta FROM clienti;
SELECT * FROM clienti WHERE id IN (SELECT cliente_id FROM ordini WHERE totale &gt; 1000);
SELECT * FROM clienti c WHERE EXISTS (SELECT 1 FROM ordini o WHERE o.cliente_id = c.id);</code></pre>
<h3>Trappole</h3><ul><li><code>SELECT *</code> in produzione: colonne inutili e fragilità. Elenca le colonne.</li><li><code>NOT IN</code> con sottoquery che contiene NULL non restituisce nulla: usa <code>NOT EXISTS</code>.</li><li>Un JOIN sbagliato moltiplica le righe (e le somme): controlla la cardinalità.</li><li>Senza <code>ORDER BY</code> l'ordine dei risultati non è garantito.</li></ul>
<div class="say"><b>Cosa dire.</b> «Scrivo il risultato che voglio con JOIN e GROUP BY, elenco le colonne e uso EXISTS invece di NOT IN quando ci sono NULL.»</div>`,
  [
    q(
      'q1',
      "Che differenza c'è tra WHERE e HAVING?",
      [
        'WHERE filtra righe prima del raggruppamento, HAVING filtra i gruppi dopo',
        'Nessuna',
        'HAVING è più veloce',
        'WHERE vale solo con JOIN',
      ],
      0,
      'HAVING può usare aggregati.',
    ),
    q(
      'q2',
      'Quale JOIN mantiene i clienti senza ordini?',
      ['INNER', 'LEFT (da clienti)', 'CROSS', 'Nessuno'],
      1,
      "Mette NULL dove non c'è corrispondenza.",
    ),
    q(
      'q3',
      'Cosa vale <code>NULL = NULL</code>?',
      ['Vero', 'Falso', 'Sconosciuto (non vero)', 'Errore'],
      2,
      'Per i NULL si usa IS NULL.',
    ),
    q(
      'q4',
      'Perché evitare <code>NOT IN</code> con sottoquery che può contenere NULL?',
      ['Non restituisce righe', 'È più lento sempre', 'È deprecato', 'Non esiste'],
      0,
      'NOT EXISTS è sicuro.',
    ),
    q(
      'q5',
      "Cosa garantisce l'ordine dei risultati?",
      ['Niente', 'ORDER BY', "L'indice", 'LIMIT'],
      1,
      "Senza ORDER BY l'ordine è indefinito.",
    ),
  ],
  [
    card('c1', 'Ordine logico', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.'),
    card('c2', 'Clienti senza ordini', 'LEFT JOIN ... WHERE o.id IS NULL (o NOT EXISTS).'),
    card('c3', 'Contare', 'COUNT(*) righe; COUNT(col) non NULL; COUNT(DISTINCT col).'),
    card('c4', 'Cercare NULL', 'IS NULL / IS NOT NULL (mai = NULL).'),
    card('c5', 'Filtrare i gruppi', 'HAVING COUNT(*) > 10.'),
  ],
  [
    prac(
      'p1',
      'Scrivi: fatturato per città, solo città con più di 10 ordini pagati, dal più alto.',
      "<pre><code>SELECT c.citta, SUM(o.totale) AS fatturato\nFROM clienti c JOIN ordini o ON o.cliente_id = c.id\nWHERE o.stato = 'pagato'\nGROUP BY c.citta\nHAVING COUNT(*) &gt; 10\nORDER BY fatturato DESC;</code></pre>",
    ),
    prac(
      'p2',
      'Trova i clienti che non hanno mai ordinato.',
      '<pre><code>SELECT c.*\nFROM clienti c\nWHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.cliente_id = c.id);</code></pre>',
    ),
    prac(
      'p3',
      "Perché la somma dei totali è gonfiata dopo un JOIN con le righe d'ordine?",
      "Ogni ordine compare una volta per riga: la somma si ripete. Aggrega prima (sottoquery/CTE) o somma sulle righe, non sul totale d'ordine.",
    ),
  ],
  'Note del vault: backend/databases/sql-basics.md',
)

export const sqlWrite = mod(
  'sqlwrite',
  'Scrivere dati, tipi e vincoli',
  'INSERT, UPDATE, DELETE, upsert, tipi, constraint, DDL',
  'fond',
  `<p class="lead">Leggere è facile; scrivere bene richiede tipi giusti e <b>vincoli</b> che rendano impossibili i dati sbagliati.</p>
<h3>DML</h3><pre><code>INSERT INTO clienti (nome, citta) VALUES ('Ada', 'Milano'), ('Linus', 'Trento')
RETURNING id;                                   -- Postgres: restituisce le righe create

UPDATE ordini SET stato = 'spedito' WHERE id = 42;     -- SEMPRE con WHERE
DELETE FROM ordini WHERE stato = 'annullato' AND creato &lt; now() - interval '90 days';

-- upsert: inserisci o aggiorna
INSERT INTO conteggi (chiave, n) VALUES ('visite', 1)
ON CONFLICT (chiave) DO UPDATE SET n = conteggi.n + 1;</code></pre>
<p>Prima di un <code>UPDATE</code> o <code>DELETE</code> in produzione, scrivi la <code>SELECT</code> con lo stesso <code>WHERE</code> e dentro una transazione controlla il numero di righe.</p>
<h3>Tipi principali (Postgres)</h3><div class="tblw"><table><tr><th>Dato</th><th>Tipo</th><th>Nota</th></tr>
<tr><td>Interi</td><td><code>integer</code>, <code>bigint</code></td><td><code>bigint</code> per gli id che crescono tanto</td></tr>
<tr><td>Denaro</td><td><code>numeric(12,2)</code></td><td>mai <code>float</code></td></tr>
<tr><td>Testo</td><td><code>text</code>, <code>varchar(n)</code></td><td><code>text</code> va bene quasi sempre</td></tr>
<tr><td>Data e ora</td><td><code>timestamptz</code>, <code>date</code></td><td>sempre con fuso orario (UTC)</td></tr>
<tr><td>Booleano</td><td><code>boolean</code></td><td></td></tr>
<tr><td>Identificatori</td><td><code>uuid</code></td><td>generati dall'app o dal DB</td></tr>
<tr><td>Semi-strutturati</td><td><code>jsonb</code></td><td>indicizzabile con GIN</td></tr></table></div>
<h3>DDL e vincoli</h3><pre><code>CREATE TABLE ordini (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id  bigint NOT NULL REFERENCES clienti(id) ON DELETE RESTRICT,
  totale      numeric(12,2) NOT NULL CHECK (totale &gt;= 0),
  stato       text NOT NULL DEFAULT 'nuovo' CHECK (stato IN ('nuovo','pagato','spedito','annullato')),
  creato      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cliente_id, creato)
);

ALTER TABLE ordini ADD COLUMN note text;
CREATE INDEX ON ordini (cliente_id);</code></pre>
<ul><li><b>PRIMARY KEY</b>: identifica la riga (unica, non nulla). <b>FOREIGN KEY</b>: integrità referenziale; <code>ON DELETE</code> decide cosa fare (<code>RESTRICT</code>, <code>CASCADE</code>, <code>SET NULL</code>).</li><li><b>NOT NULL</b>, <b>UNIQUE</b>, <b>CHECK</b>, <b>DEFAULT</b>: le regole stanno nel database, valgono per ogni client e ogni bug dell'app.</li><li>Gli indici sulle chiavi esterne non sono automatici in Postgres: aggiungili.</li></ul>
<h3>Identificatori</h3><ul><li>Sequenziali (<code>bigint</code>): compatti, ordinabili, ma prevedibili.</li><li><code>uuid</code> (v4 casuali o v7 ordinabili nel tempo): non guessabili, generabili ovunque; gli UUID casuali frammentano gli indici.</li></ul>
<h3>Trappole</h3><ul><li>Orario senza fuso orario; denaro in <code>float</code>.</li><li>Soft delete (<code>cancellato_il</code>) dimenticato nei filtri e negli indici univoci.</li><li><code>UPDATE</code> o <code>DELETE</code> senza <code>WHERE</code>.</li><li>Vincoli solo nell'applicazione: sotto concorrenza si rompono.</li></ul>
<div class="say"><b>Cosa dire.</b> «Metto le regole nel database: tipi giusti, NOT NULL, CHECK e chiavi esterne; denaro in numeric e date in timestamptz.»</div>`,
  [
    q(
      'q1',
      'Quale tipo per il denaro?',
      ['float', 'numeric(12,2)', 'text', 'real'],
      1,
      'Evita errori di arrotondamento.',
    ),
    q(
      'q2',
      'Cosa fa <code>ON CONFLICT DO UPDATE</code>?',
      ['Upsert: inserisce o aggiorna se esiste', 'Elimina il conflitto', 'Ignora sempre', 'Crea un indice'],
      0,
      'Richiede un vincolo univoco o chiave primaria.',
    ),
    q(
      'q3',
      'Dove vanno le regole di integrità dei dati?',
      ["Solo nell'app", "Nel database come vincoli (anche nell'app)", 'Nei log', 'Nel frontend'],
      1,
      'Valgono per ogni client e sotto concorrenza.',
    ),
    q(
      'q4',
      'Cosa succede con <code>UPDATE</code> senza <code>WHERE</code>?',
      ['Aggiorna tutte le righe', 'Errore', 'Niente', 'Solo la prima'],
      0,
      'Controlla sempre con una SELECT e una transazione.',
    ),
    q(
      'q5',
      'Quale tipo per un istante nel tempo?',
      ['timestamp senza fuso', 'timestamptz', 'varchar', 'date'],
      1,
      'Salva in UTC con fuso orario.',
    ),
  ],
  [
    card('c1', 'Upsert', 'INSERT ... ON CONFLICT (chiave) DO UPDATE SET ...'),
    card('c2', 'Restituire id creato', 'INSERT ... RETURNING id.'),
    card('c3', 'Integrità referenziale', 'FOREIGN KEY ... REFERENCES t(id) ON DELETE RESTRICT/CASCADE.'),
    card('c4', 'Regola di dominio', 'CHECK (totale >= 0), NOT NULL, UNIQUE.'),
    card('c5', 'Indice su FK', 'Non automatico in Postgres: CREATE INDEX ON t (fk).'),
  ],
  [
    prac(
      'p1',
      'Disegna la tabella "pagamenti" collegata agli ordini, con vincoli sensati.',
      "<pre><code>CREATE TABLE pagamenti (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  ordine_id bigint NOT NULL REFERENCES ordini(id),\n  importo numeric(12,2) NOT NULL CHECK (importo &gt; 0),\n  metodo text NOT NULL CHECK (metodo IN ('carta','bonifico')),\n  pagato_il timestamptz NOT NULL DEFAULT now(),\n  chiave_idempotenza text UNIQUE\n);\nCREATE INDEX ON pagamenti (ordine_id);</code></pre>",
    ),
    prac(
      'p2',
      'Devi cancellare 1 milione di righe vecchie: come procedi in sicurezza?',
      'SELECT con lo stesso WHERE per contare; cancello a lotti in transazioni brevi (LIMIT con CTE) per non tenere lock lunghi; verifico e poi VACUUM/ANALYZE; oppure partizioni da eliminare.',
    ),
  ],
  'Note del vault: backend/databases/sql-basics.md, database-design-normalization.md',
)

export const design = mod(
  'design',
  'Progettare lo schema: chiavi, relazioni, normalizzazione',
  'ER, 1-N, N-N, forme normali, denormalizzazione ragionata',
  'fond',
  `<p class="lead">Uno schema ben progettato evita duplicazioni e anomalie. Si parte dalle <b>entità</b> del dominio e dalle <b>relazioni</b> tra loro.</p>
<h3>Relazioni</h3><ul><li><b>1-N</b>: un cliente ha molti ordini → chiave esterna sul lato "molti" (<code>ordini.cliente_id</code>).</li><li><b>N-N</b>: studenti e corsi → <b>tabella ponte</b> <code>iscrizioni(studente_id, corso_id, ...)</code> con chiave primaria composta.</li><li><b>1-1</b>: raro; spesso si fonde o si separa per sicurezza/dimensione (<code>utenti</code> e <code>profili</code>).</li></ul>
<h3>Chiavi</h3><ul><li><b>Chiave naturale</b> (codice fiscale, ISBN): ha significato ma può cambiare o avere eccezioni.</li><li><b>Chiave surrogata</b> (id numerico o uuid): stabile e senza significato; di solito la scelta migliore come chiave primaria, con un vincolo <code>UNIQUE</code> sulla naturale.</li></ul>
<h3>Normalizzazione</h3><div class="tblw"><table><tr><th>Forma</th><th>Regola</th><th>Violazione tipica</th></tr>
<tr><td>1NF</td><td>valori atomici, niente liste in una colonna</td><td>"telefoni = '333,334'"</td></tr>
<tr><td>2NF</td><td>ogni attributo dipende dall'<b>intera</b> chiave</td><td>nome prodotto in una tabella con chiave (ordine, prodotto)</td></tr>
<tr><td>3NF</td><td>niente dipendenze tra attributi non chiave</td><td>CAP e città insieme al cliente</td></tr></table></div>
<p>Obiettivo pratico: <b>ogni fatto in un posto solo</b>. Così un aggiornamento non lascia copie incoerenti (anomalie di aggiornamento, inserimento, cancellazione).</p>
<h3>Esempio</h3><pre><code>-- male: cliente e prodotto ripetuti in ogni riga
ordini_righe(ordine_id, cliente_nome, cliente_citta, prodotto_nome, prezzo, qta)

-- bene
clienti(id, nome, citta)
prodotti(id, nome, prezzo)
ordini(id, cliente_id, creato)
righe_ordine(ordine_id, prodotto_id, qta, prezzo_unitario)   -- prezzo copiato a ragione: storico</code></pre>
<p>Il prezzo in <code>righe_ordine</code> è una <b>denormalizzazione voluta</b>: il prezzo del prodotto cambierà, ma l'ordine deve ricordare quello pagato.</p>
<h3>Denormalizzare con giudizio</h3><ul><li>Per prestazioni di lettura (contatori, totali precalcolati, tabelle di report): accetti duplicazione e la mantieni coerente con trigger, job o eventi.</li><li>Prima misura il problema; molte "ottimizzazioni" sono premature.</li></ul>
<h3>Altri schemi utili</h3><ul><li><b>Storico/temporale</b>: righe con <code>valido_da</code>, <code>valido_a</code>; tabelle di audit.</li><li><b>Gerarchie</b>: <code>parent_id</code> + CTE ricorsive; <code>ltree</code> in Postgres.</li><li><b>Multi-tenant</b>: <code>tenant_id</code> in ogni tabella con vincoli e RLS (row-level security).</li><li><b>Dati flessibili</b>: <code>jsonb</code> per la parte variabile, colonne vere per ciò che filtri e colleghi.</li></ul>
<h3>Trappole</h3><ul><li>Una tabella "universale" con colonne <code>chiave</code>/<code>valore</code> (EAV): niente tipi, niente vincoli, query terribili.</li><li>Liste separate da virgola o array dove servono relazioni.</li><li>Enum codificati come interi senza tabella o vincolo.</li></ul>
<div class="say"><b>Cosa dire.</b> «Ogni fatto in un posto solo; denormalizzo solo dopo aver misurato e solo dove serve lo storico o la velocità di lettura.»</div>`,
  [
    q(
      'q1',
      'Come si modella una relazione N-N?',
      ['Con una lista in una colonna', 'Con una tabella ponte', 'Con due database', 'Con un JSON'],
      1,
      'La tabella ponte ha due chiavi esterne.',
    ),
    q(
      'q2',
      'Cosa chiede la prima forma normale?',
      ['Valori atomici nelle colonne', 'Niente chiavi', 'Un solo indice', 'Solo testo'],
      0,
      'Niente liste dentro una cella.',
    ),
    q(
      'q3',
      'Perché copiare il prezzo in <code>righe_ordine</code>?',
      ['È un errore', 'Per ricordare il prezzo pagato: storico', 'Per velocità sempre', 'È obbligatorio'],
      1,
      'Denormalizzazione voluta.',
    ),
    q(
      'q4',
      'Chiave surrogata contro naturale?',
      ['Surrogata come chiave primaria, naturale con UNIQUE', 'Sempre naturale', 'Nessuna chiave', 'Solo uuid'],
      0,
      'La surrogata è stabile e senza significato.',
    ),
    q(
      'q5',
      'Quale è un antipattern?',
      ['Tabella ponte', 'EAV (chiave/valore universale)', 'Chiavi esterne', 'Vincoli CHECK'],
      1,
      'Perde tipi, vincoli e prestazioni.',
    ),
  ],
  [
    card('c1', 'N-N', 'Tabella ponte con chiave primaria composta e due FK.'),
    card('c2', 'Obiettivo della normalizzazione', 'Ogni fatto in un posto solo.'),
    card('c3', 'Quando denormalizzare', 'Storico o prestazioni misurate, mantenendo la coerenza.'),
    card('c4', 'Dati flessibili', 'jsonb per la parte variabile, colonne vere per ciò che si filtra.'),
    card('c5', 'Multi-tenant', 'tenant_id ovunque + vincoli o row-level security.'),
  ],
  [
    prac(
      'p1',
      'Disegna lo schema di una biblioteca (libri, autori, prestiti, utenti).',
      'libri(id, titolo, isbn UNIQUE), autori(id, nome), libri_autori(libro_id, autore_id) N-N, utenti(id,...), prestiti(id, libro_id, utente_id, dal, al) con vincolo che un libro non sia prestato due volte insieme (EXCLUDE o indice parziale).',
    ),
    prac(
      'p2',
      "Hai una colonna <code>tags = 'a,b,c'</code>: come la correggi?",
      'Tabella tags e tabella ponte (N-N), oppure un array/jsonb con indice GIN se non servono relazioni; così puoi filtrare e indicizzare.',
    ),
  ],
  'Note del vault: backend/databases/database-design-normalization.md',
)

export const sqlAdv = mod(
  'sqladv',
  'SQL avanzato: CTE, window function, set',
  'Sottoquery, CTE, ricorsione, window function, UNION, JSON',
  'sql',
  `<p class="lead">Con CTE e window function risolvi in SQL ciò che altrimenti richiederebbe cicli nell'applicazione.</p>
<h3>CTE (WITH)</h3><pre><code>WITH mensili AS (
  SELECT date_trunc('month', creato) AS mese, SUM(totale) AS tot
  FROM ordini WHERE stato = 'pagato' GROUP BY 1
)
SELECT mese, tot, tot - LAG(tot) OVER (ORDER BY mese) AS delta
FROM mensili ORDER BY mese;</code></pre>
<p>Una CTE dà un nome a un passaggio e rende la query leggibile. Dalla versione 12 Postgres la inlinea di solito: non è una barriera di ottimizzazione (si può forzare con <code>MATERIALIZED</code>).</p>
<h3>CTE ricorsive</h3><pre><code>WITH RECURSIVE sotto AS (
  SELECT id, parent_id, nome, 1 AS livello FROM categorie WHERE id = 1
  UNION ALL
  SELECT c.id, c.parent_id, c.nome, s.livello + 1
  FROM categorie c JOIN sotto s ON c.parent_id = s.id
)
SELECT * FROM sotto;</code></pre>
<p>Per alberi, organigrammi, grafi. Attenzione ai cicli: aggiungi un limite di profondità o tieni traccia dei nodi visti.</p>
<h3>Window function</h3><pre><code>SELECT cliente_id, id, totale,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY totale DESC) AS pos,
  SUM(totale)  OVER (PARTITION BY cliente_id)                      AS tot_cliente,
  SUM(totale)  OVER (ORDER BY creato ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ultimi7,
  LAG(totale)  OVER (PARTITION BY cliente_id ORDER BY creato)      AS precedente
FROM ordini;</code></pre>
<ul><li>A differenza di <code>GROUP BY</code> <b>non</b> riducono le righe: aggiungono una colonna calcolata su una "finestra".</li><li><code>ROW_NUMBER</code>, <code>RANK</code>, <code>DENSE_RANK</code>, <code>NTILE</code>; <code>LAG</code>/<code>LEAD</code>; <code>FIRST_VALUE</code>; aggregati su finestra.</li><li>Top-N per gruppo: calcola <code>ROW_NUMBER()</code> in una sottoquery e filtra <code>pos &lt;= 3</code>.</li></ul>
<h3>Insiemi e altro</h3><pre><code>SELECT email FROM clienti UNION     SELECT email FROM newsletter;   -- senza duplicati
SELECT email FROM clienti INTERSECT SELECT email FROM newsletter;
SELECT email FROM clienti EXCEPT    SELECT email FROM disiscritti;

SELECT id, COALESCE(telefono, 'n/d') FROM clienti;
SELECT CASE WHEN totale &gt;= 1000 THEN 'alto' WHEN totale &gt;= 100 THEN 'medio' ELSE 'basso' END FROM ordini;
SELECT * FROM generate_series('2026-01-01'::date, '2026-01-07', '1 day');   -- serie di date</code></pre>
<h3>JSONB</h3><pre><code>SELECT dati-&gt;&gt;'nome' AS nome, dati-&gt;'indirizzo'-&gt;&gt;'citta' AS citta
FROM profili WHERE dati @&gt; '{"attivo": true}';
CREATE INDEX ON profili USING gin (dati);</code></pre>
<h3>LATERAL e DISTINCT ON</h3><pre><code>-- ultimo ordine per cliente (Postgres)
SELECT DISTINCT ON (cliente_id) cliente_id, id, creato
FROM ordini ORDER BY cliente_id, creato DESC;</code></pre>
<h3>Trappole</h3><ul><li><code>UNION</code> deduplica (costa); se sai che non ci sono duplicati usa <code>UNION ALL</code>.</li><li>Le window function si valutano dopo WHERE/GROUP BY: per filtrarle serve una sottoquery o CTE.</li><li>Cercare "le date mancanti" richiede <code>generate_series</code> e LEFT JOIN.</li></ul>
<div class="say"><b>Cosa dire.</b> «Per top-N per gruppo e confronti con il periodo precedente uso window function; per gerarchie CTE ricorsive; UNION ALL quando non servono i duplicati rimossi.»</div>`,
  [
    q(
      'q1',
      'Cosa distingue una window function da un GROUP BY?',
      [
        'Non riduce le righe: aggiunge una colonna calcolata',
        'È più lenta sempre',
        'Funziona solo su numeri',
        'Richiede un indice',
      ],
      0,
      'Ogni riga di input resta nel risultato.',
    ),
    q(
      'q2',
      'Come si ottiene il top 3 per gruppo?',
      ['LIMIT 3', 'ROW_NUMBER() OVER (PARTITION BY ...) e filtro pos &lt;= 3 in una sottoquery', 'HAVING', 'UNION'],
      1,
      'Le window function non si filtrano nello stesso SELECT.',
    ),
    q(
      'q3',
      'Differenza tra UNION e UNION ALL?',
      ['UNION deduplica (costa), UNION ALL no', 'Nessuna', 'UNION ALL ordina', 'UNION è più veloce'],
      0,
      'UNION ALL quando i duplicati non servono rimossi.',
    ),
    q(
      'q4',
      'A cosa serve <code>generate_series</code>?',
      [
        'A creare serie di valori/date, per esempio per trovare i giorni mancanti',
        'A generare id',
        'A fare backup',
        'A fare join',
      ],
      0,
      'Spesso con LEFT JOIN.',
    ),
    q(
      'q5',
      'Quale indice per cercare dentro un jsonb?',
      ['B-tree', 'GIN', 'Hash', 'Nessuno'],
      1,
      'GIN supporta contenimento (@>) e chiavi.',
    ),
  ],
  [
    card('c1', 'Differenza dal periodo precedente', 'LAG(valore) OVER (ORDER BY periodo).'),
    card('c2', 'Ultimo per gruppo', 'DISTINCT ON (g) ... ORDER BY g, data DESC oppure ROW_NUMBER.'),
    card('c3', 'Gerarchie', 'WITH RECURSIVE: caso base UNION ALL passo ricorsivo.'),
    card('c4', 'Giorni mancanti', 'generate_series + LEFT JOIN.'),
    card('c5', 'Ranking', 'ROW_NUMBER (unico), RANK (con salti), DENSE_RANK (senza salti).'),
  ],
  [
    prac(
      'p1',
      'I 3 ordini più alti per ogni cliente.',
      '<pre><code>SELECT * FROM (\n  SELECT o.*, ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY totale DESC) AS pos\n  FROM ordini o\n) t WHERE pos &lt;= 3;</code></pre>',
    ),
    prac(
      'p2',
      'Totale mensile e variazione percentuale sul mese precedente.',
      "<pre><code>WITH m AS (\n  SELECT date_trunc('month', creato) AS mese, SUM(totale) AS tot FROM ordini GROUP BY 1\n)\nSELECT mese, tot,\n  round(100.0 * (tot - LAG(tot) OVER (ORDER BY mese)) / NULLIF(LAG(tot) OVER (ORDER BY mese), 0), 1) AS var_pct\nFROM m ORDER BY mese;</code></pre>",
    ),
    prac(
      'p3',
      'Trova i giorni di gennaio senza ordini.',
      "<pre><code>SELECT d::date FROM generate_series('2026-01-01'::date, '2026-01-31', '1 day') d\nLEFT JOIN ordini o ON o.creato::date = d::date\nWHERE o.id IS NULL;</code></pre>",
    ),
  ],
  'Note del vault: backend/databases/sql-advanced.md',
)

export const indexes = mod(
  'indexes',
  'Indici: come funzionano e come sceglierli',
  'B-tree, composti, parziali, covering, GIN, costi',
  'sql',
  `<p class="lead">Un indice è una struttura ordinata che permette di trovare le righe senza leggere tutta la tabella. È il modo più efficace per accelerare le query, ma ha un costo.</p>
<h3>Come funziona un B-tree</h3><p>Un albero bilanciato di pagine ordinate: la ricerca costa O(log n) (pochi accessi anche con miliardi di righe), supporta uguaglianza, intervalli (<code>&lt;</code>, <code>BETWEEN</code>), prefissi (<code>LIKE 'Mi%'</code>, ma solo con collation <code>C</code> o un indice con <code>text_pattern_ops</code>) e ordinamento (<code>ORDER BY</code>).</p>
<h3>Tipi di indice in Postgres</h3><div class="tblw"><table><tr><th>Tipo</th><th>Per</th></tr>
<tr><td>B-tree</td><td>il default: uguaglianza, range, ordinamento</td></tr>
<tr><td>Hash</td><td>solo uguaglianza (raro)</td></tr>
<tr><td>GIN</td><td>jsonb, array, full-text: "contiene"</td></tr>
<tr><td>GiST / SP-GiST</td><td>geometrie, intervalli, ricerca per prossimità</td></tr>
<tr><td>BRIN</td><td>tabelle enormi con dati correlati all'ordine fisico (log, serie temporali)</td></tr></table></div>
<h3>Indici composti</h3><pre><code>CREATE INDEX ON ordini (cliente_id, creato DESC);</code></pre>
<ul><li>Vale la <b>regola del prefisso</b>: serve per <code>WHERE cliente_id = ?</code> e per <code>cliente_id = ? ORDER BY creato DESC</code>, <b>in genere non</b> per <code>WHERE creato = ?</code> da solo (da PostgreSQL 18 uno <i>skip scan</i> può usarlo se la prima colonna ha pochi valori distinti, ma non contarci).</li><li>Ordine delle colonne: prima quelle con uguaglianza, poi quelle con intervallo/ordinamento.</li></ul>
<h3>Parziali, covering, su espressioni</h3><pre><code>CREATE INDEX ON ordini (creato) WHERE stato = 'nuovo';          -- parziale: piccolo e mirato
CREATE INDEX ON ordini (cliente_id) INCLUDE (totale);            -- covering: index-only scan
CREATE INDEX ON clienti (lower(email));                          -- su espressione
CREATE UNIQUE INDEX ON utenti (email) WHERE cancellato_il IS NULL;   -- unicità con soft delete</code></pre>
<h3>Quando l'indice NON si usa</h3><ul><li>Funzione sulla colonna: <code>WHERE lower(email) = ...</code> senza indice su espressione; <code>WHERE creato::date = ...</code>.</li><li>Prefisso jolly: <code>LIKE '%abc'</code> (serve <code>pg_trgm</code>).</li><li>Tipi diversi (confronto stringa/intero) o collation diverse.</li><li>Il planner stima che leggere quasi tutta la tabella costi meno (selettività bassa).</li></ul>
<h3>Costi</h3><ul><li>Ogni indice rallenta <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> e occupa spazio e cache.</li><li>Indici inutilizzati: trovali con <code>pg_stat_user_indexes</code> (<code>idx_scan = 0</code>) e rimuovili.</li></ul>
<h3>In produzione</h3><pre><code>CREATE INDEX CONCURRENTLY idx_ordini_cliente ON ordini (cliente_id);   -- non blocca le scritture
REINDEX INDEX CONCURRENTLY idx_ordini_cliente;                          -- per il bloat</code></pre>
<h3>Metodo</h3><ol><li>Individua le query lente (<code>pg_stat_statements</code>).</li><li>Leggi <code>EXPLAIN (ANALYZE, BUFFERS)</code>.</li><li>Crea l'indice più piccolo che aiuta, verifica il piano e il miglioramento reale.</li></ol>
<div class="say"><b>Cosa dire.</b> «Parto da pg_stat_statements ed EXPLAIN, creo indici composti rispettando il prefisso, uso CONCURRENTLY in produzione e tolgo quelli inutilizzati.»</div>`,
  [
    q(
      'q1',
      'Un indice <code>(a, b)</code> aiuta <code>WHERE b = 1</code> da solo?',
      ['Sì sempre', 'In genere no: serve il prefisso a', 'Solo con ORDER BY', 'Solo con LIMIT'],
      1,
      'Regola del prefisso.',
    ),
    q(
      'q2',
      "Perché <code>WHERE lower(email) = ...</code> non usa l'indice su email?",
      [
        "La funzione sulla colonna impedisce l'uso: serve un indice su lower(email)",
        'È un bug',
        'Perché è testo',
        'Solo in MySQL',
      ],
      0,
      'Indice su espressione.',
    ),
    q(
      'q3',
      'Come creare un indice senza bloccare le scritture?',
      ['CREATE INDEX CONCURRENTLY', 'CREATE INDEX FAST', "Fermare l'app", 'ALTER TABLE'],
      0,
      'Più lento, ma non blocca.',
    ),
    q(
      'q4',
      'Quale indice per ricerche dentro un jsonb?',
      ['B-tree', 'GIN', 'BRIN', 'Nessuno'],
      1,
      'GIN per contenimento.',
    ),
    q(
      'q5',
      'Qual è il costo di un indice?',
      ['Scritture più lente e spazio', 'Nessuno', 'Letture più lente', 'Solo memoria'],
      0,
      'Ogni scrittura aggiorna anche gli indici.',
    ),
  ],
  [
    card(
      'c1',
      'Regola del prefisso',
      'Indice (a, b) serve per a, e per a+b; per b da solo in genere no (skip scan da PG 18 solo se a ha pochi valori).',
    ),
    card('c2', 'Indice piccolo e mirato', 'Indice parziale: CREATE INDEX ... WHERE condizione.'),
    card('c3', 'Index-only scan', 'Indice covering con INCLUDE (colonne lette).'),
    card('c4', 'Non bloccare', 'CREATE INDEX CONCURRENTLY.'),
    card('c5', 'Indici inutilizzati', 'pg_stat_user_indexes: idx_scan = 0.'),
  ],
  [
    prac(
      'p1',
      'Query: ordini aperti di un cliente, più recenti per primi, 20 per pagina. Quale indice?',
      "CREATE INDEX ON ordini (cliente_id, creato DESC) WHERE stato = 'aperto'; la query filtra per cliente e ordina senza un sort separato.",
    ),
    prac(
      'p2',
      'Aggiungi un indice a una tabella da 200 GB in produzione: come?',
      'CREATE INDEX CONCURRENTLY in una finestra a basso carico, controlla spazio e I/O, verifica che sia valido (indisvalid) e che il piano lo usi; elimina eventuali indici ridondanti.',
    ),
  ],
  'Note del vault: backend/databases/postgresql/indexing.md',
)

export const explain = mod(
  'explain',
  'Ottimizzare le query: leggere EXPLAIN',
  'Piano, scansioni, join, statistiche, anti-pattern, pg_stat_statements',
  'sql',
  `<p class="lead">Non si ottimizza a intuito: si legge il <b>piano di esecuzione</b> e si confronta con la realtà.</p>
<h3>EXPLAIN e ANALYZE</h3><pre><code>EXPLAIN SELECT ...;                       -- piano stimato
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;    -- ESEGUE la query e mostra tempi e righe reali</code></pre>
<p>Attenzione: <code>ANALYZE</code> esegue davvero la query (anche <code>UPDATE</code>/<code>DELETE</code>): dentro una transazione con <code>ROLLBACK</code>.</p>
<h3>Cosa guardare</h3><ul><li><b>Righe stimate contro reali</b> (<code>rows=</code> vs <code>actual ... rows=</code>): grandi differenze indicano statistiche vecchie (<code>ANALYZE tabella</code>) o correlazioni non viste.</li><li><b>Tipo di scansione</b>: <i>Seq Scan</i> (tutta la tabella), <i>Index Scan</i>, <i>Index Only Scan</i>, <i>Bitmap Heap Scan</i>.</li><li><b>Tipo di join</b>: <i>Nested Loop</i> (bene con poche righe esterne e indice), <i>Hash Join</i>, <i>Merge Join</i>.</li><li><b>Sort</b> su disco (<code>Sort Method: external merge</code>), <i>loops</i> molto alti, <b>Buffers</b> letti dal disco.</li></ul>
<h3>Esempio di ragionamento</h3><pre><code>Seq Scan on ordini (cost=0.00..183000 rows=12 width=60) (actual time=0.1..950 rows=12 loops=1)
  Filter: (cliente_id = 42)
  Rows Removed by Filter: 9999988</code></pre>
<p>Ha scansionato 10 milioni di righe per trovarne 12: manca un indice su <code>cliente_id</code>. Dopo l'indice il piano diventa <i>Index Scan</i> e il tempo scende a pochi millisecondi.</p>
<h3>Anti-pattern frequenti</h3><ul><li><b>N+1</b> dall'ORM: una query per riga invece di un JOIN/<code>IN</code>.</li><li><code>SELECT *</code> con colonne grandi; <code>OFFSET</code> molto alto (usa keyset).</li><li>Funzioni sulla colonna filtrata (impediscono l'indice).</li><li><code>OR</code> su colonne diverse, <code>LIKE '%x'</code>, <code>COUNT(*)</code> su tabelle enormi per far vedere "totali" (stima o contatore).</li><li><code>DISTINCT</code>/<code>ORDER BY</code> usati per nascondere un JOIN sbagliato.</li></ul>
<h3>Trovare le query lente</h3><ul><li><code>pg_stat_statements</code>: per query, tempo totale, medio, chiamate. Ordina per <b>tempo totale</b>: spesso la colpevole è una query media chiamata milioni di volte.</li><li><code>log_min_duration_statement</code>; <code>auto_explain</code>; strumenti come pgBadger.</li></ul>
<h3>Altri interventi</h3><ul><li>Riscrivere (sottoquery → JOIN o <code>EXISTS</code>), ridurre le colonne, precalcolare con una vista materializzata.</li><li><code>VACUUM</code>/<code>ANALYZE</code> regolari (autovacuum ben configurato); evitare il <i>bloat</i>.</li><li>Parametri: <code>work_mem</code> per sort/hash, <code>effective_cache_size</code>; cambiali con misure, non a caso.</li></ul>
<h3>Metodo</h3><ol><li>Trova la query (pg_stat_statements).</li><li>EXPLAIN (ANALYZE, BUFFERS) con parametri reali.</li><li>Ipotizza la causa (indice, statistiche, riscrittura).</li><li>Cambia una cosa, rimisura.</li></ol>
<div class="say"><b>Cosa dire.</b> «Parto da pg_stat_statements per tempo totale, leggo EXPLAIN ANALYZE confrontando righe stimate e reali, e cambio una cosa alla volta.»</div>`,
  [
    q(
      'q1',
      'Cosa fa <code>EXPLAIN ANALYZE</code>?',
      ['Esegue la query e mostra tempi e righe reali', 'Solo stima', 'Crea un indice', 'Fa il vacuum'],
      0,
      'Attenzione: esegue davvero anche i DML.',
    ),
    q(
      'q2',
      'Che cosa indica una grande differenza tra righe stimate e reali?',
      ['Statistiche vecchie o correlazioni non viste', 'Query corretta', 'Indice mancante sempre', 'Disco lento'],
      0,
      'Esegui ANALYZE.',
    ),
    q(
      'q3',
      'Come ordini le query in pg_stat_statements per trovare il vero collo?',
      ['Per tempo medio', 'Per tempo totale', 'Per nome', 'Per righe'],
      1,
      'Una query media chiamata milioni di volte pesa più di una lenta rara.',
    ),
    q(
      'q4',
      "Cos'è un Seq Scan su una tabella grande con filtro selettivo?",
      ['Probabile indice mancante', 'Sempre buono', 'Un errore di sintassi', 'Una replica'],
      0,
      'Legge tutta la tabella per poche righe.',
    ),
    q(
      'q5',
      'Perché evitare <code>OFFSET</code> grandi?',
      ['Scartano righe: costo crescente', 'Non esistono', 'Rompono gli indici', 'Sono illegali'],
      0,
      'Keyset pagination.',
    ),
  ],
  [
    card('c1', 'Piano reale', 'EXPLAIN (ANALYZE, BUFFERS) — in transazione con ROLLBACK se è un DML.'),
    card('c2', 'Query pesanti', 'pg_stat_statements ordinato per total_exec_time.'),
    card('c3', 'Statistiche vecchie', 'ANALYZE tabella; autovacuum ben configurato.'),
    card('c4', 'N+1', "Una query per riga: usa JOIN, IN o prefetch dell'ORM."),
    card('c5', 'Paginazione veloce', 'Keyset: WHERE (creato, id) &lt; (:c, :i) ORDER BY ... LIMIT.'),
  ],
  [
    prac(
      'p1',
      "Una query su 50M righe ci mette 8 secondi: il tuo piano d'azione.",
      "EXPLAIN (ANALYZE, BUFFERS): cerco Seq Scan, sort su disco, stime sbagliate; aggiungo/aggiusto l'indice (composto, parziale), ANALYZE, riscrivo (EXISTS, meno colonne), keyset pagination; rimisuro.",
    ),
    prac(
      'p2',
      "L'ORM fa 400 query per una pagina: come lo scopri e lo risolvi?",
      'Conto le query (log, debug toolbar, pg_stat_statements), riconosco il pattern N+1 e uso eager loading/JOIN o una query con IN; aggiungo un test che asserisce il numero di query.',
    ),
  ],
  ['Note del vault: backend/databases/postgresql/query-optimization.md'].join(''),
)
