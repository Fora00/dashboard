import { card, mod, prac, q } from './python-path.helpers'

// Database course, round 2 (from the council review): security and RLS, caching and CDC, testing, other workloads.

export const dbsecurity = mod(
  'dbsecurity',
  'Sicurezza del database: ruoli, GRANT, RLS, cifratura',
  'Privilegio minimo, ruoli, row-level security, TLS, segreti, audit',
  'ops',
  `<p class="lead">Il database custodisce i dati più preziosi. La sicurezza è a strati: rete, autenticazione, privilegi, regole sulle righe, cifratura, controllo.</p>
<h3>Ruoli e privilegi minimi</h3><pre><code>CREATE ROLE app_rw LOGIN PASSWORD 'da-secret-manager';
CREATE ROLE report_ro LOGIN PASSWORD '...';

REVOKE ALL ON SCHEMA public FROM PUBLIC;            -- niente accesso di default
GRANT USAGE ON SCHEMA public TO app_rw, report_ro;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_rw;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO report_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;</code></pre>
<ul><li>L'applicazione <b>non</b> usa il superuser né il proprietario dello schema: un ruolo con soli i privilegi necessari.</li><li>Ruoli separati per app, migrazioni (può fare DDL), report in sola lettura, backup.</li><li>Un servizio per ruolo: se uno viene compromesso, il danno è limitato.</li></ul>
<h3>Row-Level Security (RLS)</h3><p>Le policy decidono <b>quali righe</b> un ruolo può vedere o modificare. Perfette per il multi-tenant e per Supabase.</p>
<pre><code>ALTER TABLE ordini ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordini FORCE ROW LEVEL SECURITY;         -- vale anche per il proprietario

CREATE POLICY tenant_isola ON ordini
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- l'app imposta il tenant a ogni richiesta, dentro la transazione
SELECT set_config('app.tenant_id', '3f2c...', true);</code></pre>
<ul><li><code>USING</code>: quali righe sono visibili (SELECT/UPDATE/DELETE). <code>WITH CHECK</code>: quali righe si possono scrivere.</li><li>Senza policy, con RLS attiva, nessuna riga è visibile (negazione di default).</li><li><b>Supabase</b>: policy basate su <code>auth.uid()</code>, per esempio <code>USING (utente_id = auth.uid())</code>. Una tabella esposta senza RLS è leggibile da chiunque abbia la chiave pubblica: attivala sempre.</li><li>Il ruolo con l'attributo <code>BYPASSRLS</code> (e il superuser) aggira la RLS: non darlo all'app.</li></ul>
<h3>Connessioni e rete</h3><ul><li>TLS obbligatorio (<code>sslmode=verify-full</code>), niente database esposto su Internet; accesso da reti private/VPN.</li><li><code>pg_hba.conf</code> restringe chi si connette, da dove e con quale metodo (<code>scram-sha-256</code>).</li></ul>
<h3>Segreti</h3><ul><li>Password in un <b>secret manager</b>, con rotazione; mai nel repository o nei log.</li><li>Autenticazione IAM dove disponibile (cloud) per evitare password a lunga durata.</li></ul>
<h3>Cifratura</h3><ul><li><b>In transito</b>: TLS. <b>A riposo</b>: disco/volume cifrato (gestito dal cloud) o cifratura a livello di tablespace/servizio.</li><li><b>A livello di colonna</b> per dati molto sensibili (<code>pgcrypto</code> o cifratura nell'applicazione con chiavi in un KMS): protegge anche da chi legge il database, ma impedisce di cercare/ordinare quei campi.</li><li>Le password degli utenti dell'app: <b>hash lento</b> (argon2/bcrypt) nell'applicazione, mai cifrate in modo reversibile.</li></ul>
<h3>Audit e iniezione</h3><ul><li><b>Query parametrizzate</b> sempre (contro la SQL injection); l'utente del database non deve poter fare DDL.</li><li>Audit: log delle connessioni e dei comandi DDL, estensione <code>pgaudit</code>, tabelle di storico con trigger per i dati critici.</li><li>Mascheramento e dati sintetici negli ambienti di sviluppo: mai copie di produzione con dati personali.</li></ul>
<h3>Checklist</h3><ol><li>Ruoli minimi per servizio. 2. RLS dove i dati sono per utente/tenant. 3. TLS e rete privata. 4. Segreti ruotati. 5. Cifratura a riposo e per i campi sensibili. 6. Backup cifrati e testati. 7. Audit e allarmi.</li></ol>
<div class="say"><b>Cosa dire.</b> «L'app usa un ruolo con privilegi minimi, la RLS isola i tenant, TLS e rete privata proteggono il traffico, i segreti ruotano da un secret manager e i campi sensibili sono cifrati con chiavi in un KMS.»</div>`,
  [
    q(
      'q1',
      'Cosa fa la Row-Level Security?',
      ['Limita quali righe un ruolo può vedere o modificare', 'Cifra le colonne', 'Accelera le query', 'Fa il backup'],
      0,
      'Con policy USING e WITH CHECK.',
    ),
    q(
      'q2',
      'Che succede con RLS attiva e nessuna policy?',
      [
        'Nessuna riga è visibile al ruolo',
        'Tutte le righe sono visibili',
        'Errore alla creazione',
        'Solo le scritture',
      ],
      0,
      'Negazione di default.',
    ),
    q(
      'q3',
      "Perché l'applicazione non deve usare il superuser?",
      [
        'Una compromissione darebbe accesso totale e aggirerebbe la RLS',
        'È più lento',
        'Non è possibile',
        'Per le licenze',
      ],
      0,
      'Privilegio minimo.',
    ),
    q(
      'q4',
      "Come si salvano le password degli utenti dell'app?",
      ['Hash lento (argon2/bcrypt)', 'Cifrate in modo reversibile', 'In chiaro', 'SHA-1'],
      0,
      'Un hash non si inverte.',
    ),
    q(
      'q5',
      'Quale rischio ha una tabella Supabase senza RLS?',
      ['Leggibile da chiunque abbia la chiave pubblica', 'Più lenta', 'Non salvabile', 'Nessuno'],
      0,
      'Attiva sempre la RLS sulle tabelle esposte.',
    ),
  ],
  [
    card('c1', 'Privilegi', 'REVOKE ALL ... FROM PUBLIC; GRANT solo ciò che serve a ogni ruolo.'),
    card('c2', 'RLS', 'ENABLE ROW LEVEL SECURITY + CREATE POLICY ... USING (...) WITH CHECK (...).'),
    card('c3', 'Tenant per richiesta', "SELECT set_config('app.tenant_id', ..., true) dentro la transazione."),
    card('c4', 'Transito e riposo', 'TLS (sslmode=verify-full); disco cifrato; campi sensibili con KMS.'),
    card('c5', 'Segreti', 'Secret manager con rotazione; IAM al posto delle password quando possibile.'),
  ],
  [
    prac(
      'p1',
      "Isola i dati di due clienti in un'app multi-tenant con Postgres.",
      "tenant_id in ogni tabella con indici, RLS abilitata e FORCE, policy USING e WITH CHECK su current_setting('app.tenant_id'), l'app imposta set_config a ogni richiesta in transazione, ruolo senza BYPASSRLS, test con due tenant.",
    ),
    prac(
      'p2',
      'Un\'app Supabase espone una tabella "profili": come la proteggi?',
      'Abilito la RLS e scrivo policy basate su auth.uid() (lettura del proprio profilo, modifica solo dei propri campi), niente accesso anonimo se non serve, uso la chiave di servizio solo lato server, e testo con utenti diversi.',
    ),
  ],
  'Note del vault: computer science/security/web-security.md, backend/databases/database-design-normalization.md, backend/django/multi-tenancy.md',
)

export const cachecdc = mod(
  'cachecdc',
  'Cache, outbox e CDC: dal database agli eventi',
  'Cache-aside, invalidazione, outbox, logical replication, Debezium',
  'ops',
  `<p class="lead">Il database è la fonte di verità, ma altri sistemi (cache, ricerca, analisi) devono restare allineati. Ci sono tre problemi: cosa mettere in cache, come propagare le modifiche, come evitare incoerenze.</p>
<h3>Cache davanti al database</h3><ul><li><b>Cache-aside</b>: l'app legge dalla cache; se manca legge dal database e riempie la cache.</li><li><b>Write-through</b>: scrive cache e database insieme. <b>Write-behind</b>: scrive in cache e persiste dopo (rischio di perdita).</li><li><b>TTL</b> con jitter casuale per non far scadere tutto insieme; <b>invalidazione</b> alla scrittura quando serve freschezza.</li><li>Problemi: <b>stampede</b> (molti ricalcolano una chiave scaduta), <b>penetrazione</b> (chiavi inesistenti), dati vecchi dopo una scrittura.</li></ul>
<pre><code>def prodotto(pid):
    v = cache.get(f"prodotto:{pid}")
    if v is not None:
        return json.loads(v)
    p = db.carica_prodotto(pid)
    cache.set(f"prodotto:{pid}", json.dumps(p), ex=300 + random.randint(0, 60))
    return p

def aggiorna(pid, dati):
    db.salva(pid, dati)                       # prima il database
    cache.delete(f"prodotto:{pid}")           # poi invalida</code></pre>
<h3>Il problema del doppio scrittura</h3><p>Scrivere sul database <b>e</b> pubblicare un evento (o aggiornare ricerca/cache) sono due operazioni: una può riuscire e l'altra no. Il risultato è incoerenza.</p>
<h3>Outbox pattern</h3><ol><li>Nella <b>stessa transazione</b> scrivi il dato e una riga nella tabella <code>outbox</code> (evento, payload, stato).</li><li>Un <b>relay</b> legge le righe non inviate, le pubblica (coda, Kafka) e le segna inviate.</li><li>I consumatori sono <b>idempotenti</b> (consegna almeno una volta).</li></ol>
<pre><code>BEGIN;
INSERT INTO ordini (...) VALUES (...) RETURNING id;
INSERT INTO outbox (aggregato, id_aggregato, tipo, payload)
VALUES ('ordine', :id, 'OrdineCreato', :json);
COMMIT;

-- relay (più istanze sicure grazie a SKIP LOCKED)
SELECT * FROM outbox WHERE inviato_il IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED;</code></pre>
<h3>CDC: Change Data Capture</h3><p>Invece di scrivere eventi a mano, leggi il <b>log delle modifiche</b> del database (WAL) e le trasformi in eventi.</p><ul><li>Postgres: <code>wal_level = logical</code>, <b>publication</b> e <b>slot di replicazione logica</b>.</li><li><b>Debezium</b> (su Kafka Connect) legge il WAL e pubblica gli eventi su Kafka; usato per alimentare ricerca, cache, data warehouse, microservizi.</li><li>Attenzione: uno slot che nessuno consuma fa crescere il WAL fino a riempire il disco. Monitoralo.</li></ul>
<pre><code>CREATE PUBLICATION pub_ordini FOR TABLE ordini, righe;
SELECT * FROM pg_replication_slots;     -- controlla lo stato e il ritardo</code></pre>
<h3>Replica logica</h3><p>Replica tabelle selezionate verso un altro database (anche di versione diversa): utile per aggiornamenti senza downtime, migrazioni e integrazioni.</p>
<h3>Quale scegliere</h3><div class="tblw"><table><tr><th>Bisogno</th><th>Strumento</th></tr>
<tr><td>Velocizzare letture frequenti</td><td>cache-aside con Redis</td></tr>
<tr><td>Pubblicare eventi in modo affidabile dal tuo servizio</td><td>outbox + relay</td></tr>
<tr><td>Alimentare altri sistemi senza modificare l'app</td><td>CDC (Debezium)</td></tr>
<tr><td>Copiare dati verso un altro Postgres</td><td>replica logica</td></tr></table></div>
<h3>Coerenza e correttezza</h3><ul><li>Accetta la <b>coerenza eventuale</b> per cache e indici di ricerca e progetta per ricostruirli dalla fonte di verità.</li><li>Eventi con id e versione; consumatori idempotenti; ordinamento per aggregato.</li></ul>
<div class="say"><b>Cosa dire.</b> «Cache-aside con TTL e invalidazione alla scrittura; per gli eventi uso l'outbox nella stessa transazione, oppure CDC dal WAL, con consumatori idempotenti e monitoraggio degli slot.»</div>`,
  [
    q(
      'q1',
      "Perché l'outbox scrive l'evento nella stessa transazione del dato?",
      ['Così dato ed evento sono coerenti: o entrambi o nessuno', 'Per velocità', 'Per i backup', 'Per la cache'],
      0,
      'Evita la doppia scrittura incoerente.',
    ),
    q(
      'q2',
      'Cosa è CDC?',
      [
        'Leggere il log delle modifiche del database e trasformarlo in eventi',
        'Un tipo di indice',
        'Un pooler',
        'Un livello di isolamento',
      ],
      0,
      'Per esempio Debezium sul WAL.',
    ),
    q(
      'q3',
      'Rischio di uno slot di replicazione logica non consumato?',
      ['Il WAL cresce fino a riempire il disco', 'Nessuno', 'Perdita di dati', 'Più CPU'],
      0,
      'Monitora pg_replication_slots.',
    ),
    q(
      'q4',
      'Che cosa è lo stampede?',
      [
        'Molte richieste ricalcolano insieme una chiave scaduta',
        'Un errore di rete',
        'Un deadlock',
        'Un tipo di cache',
      ],
      0,
      'Lock di ricostruzione e TTL con jitter.',
    ),
    q(
      'q5',
      'Perché i consumatori degli eventi devono essere idempotenti?',
      ['La consegna è almeno una volta: possibili duplicati', 'Per velocità', 'Per la cache', 'Per la sicurezza'],
      0,
      "Gestisci l'id evento.",
    ),
  ],
  [
    card('c1', 'Doppia scrittura', 'Database + evento in due passi = rischio incoerenza: usa outbox o CDC.'),
    card('c2', 'Outbox', 'Riga di evento nella stessa transazione; relay con SKIP LOCKED; consumatori idempotenti.'),
    card('c3', 'CDC su Postgres', 'wal_level=logical, publication, slot; Debezium → Kafka.'),
    card('c4', 'Cache-aside', 'Leggi cache → DB → riempi; invalida alla scrittura; TTL con jitter.'),
    card('c5', 'Slot di replica', 'Monitora pg_replication_slots: slot fermo = WAL che cresce.'),
  ],
  [
    prac(
      'p1',
      'Un ordine deve aggiornare il DB e notificare altri servizi in modo affidabile: come?',
      "Transazione con ordine + riga outbox; relay che pubblica su coda/Kafka e segna inviato; consumatori idempotenti con l'id evento; monitoraggio dell'età dei messaggi; in alternativa CDC con Debezium.",
    ),
    prac(
      'p2',
      'La ricerca prodotti (Elasticsearch) è disallineata dal database: come lo eviti?',
      'Il database è la fonte di verità; propaga le modifiche con outbox o CDC; indicizzazione idempotente e rieseguibile; job di riconciliazione/reindex periodico; accetta ritardo e monitoralo.',
    ),
  ],
  'Note del vault: backend/redis/caching-patterns.md, python/python-task-queue-patterns.md, backend/databases/postgresql/partitioning-and-replication.md',
)

export const dbtest = mod(
  'dbtest',
  'Testare il codice che usa il database',
  'Database vero nei test, Testcontainers, rollback per test, fixture, test di migrazione',
  'beyond',
  `<p class="lead">I mock del database nascondono i bug veri (SQL sbagliato, vincoli, transazioni). Per il codice di accesso ai dati si testa con un database <b>vero</b>, veloce e isolato.</p>
<h3>Strategie</h3><div class="tblw"><table><tr><th>Strategia</th><th>Pro</th><th>Contro</th></tr>
<tr><td>Mock del repository</td><td>velocissimo</td><td>non prova SQL né vincoli</td></tr>
<tr><td>SQLite al posto di Postgres</td><td>veloce e semplice</td><td>dialetti diversi: bug che compaiono solo in produzione</td></tr>
<tr><td>Postgres vero in container (Testcontainers)</td><td>stessa versione e comportamento della produzione</td><td>avvio di qualche secondo</td></tr>
<tr><td>Database condiviso di staging</td><td>realistico</td><td>test lenti e dipendenti l'uno dall'altro</td></tr></table></div>
<p>Raccomandazione: <b>stesso motore e versione di produzione</b> in container, avviato una volta per sessione di test.</p>
<h3>Testcontainers con pytest</h3><pre><code>import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from testcontainers.postgres import PostgresContainer

@pytest.fixture(scope="session")
def engine():
    with PostgresContainer("postgres:16") as pg:
        eng = create_engine(pg.get_connection_url())
        Base.metadata.create_all(eng)          # oppure: alembic upgrade head
        yield eng

@pytest.fixture
def db(engine):
    conn = engine.connect()
    tx = conn.begin()                          # transazione per test
    session = Session(bind=conn, join_transaction_mode="create_savepoint")
    yield session
    session.close()
    tx.rollback()                              # rollback: il prossimo test parte pulito
    conn.close()</code></pre>
<ul><li><b>Container per sessione</b> (lento da avviare, quindi una volta), <b>rollback per test</b> (veloce da ripulire).</li><li>Se il codice sotto test fa <code>commit</code>, usa i <i>savepoint</i> come sopra oppure svuota le tabelle (<code>TRUNCATE ... RESTART IDENTITY CASCADE</code>) tra i test.</li></ul>
<h3>Dati di test</h3><ul><li><b>Factory</b> (<code>factory_boy</code>, <code>polyfactory</code>): crei oggetti validi con una riga e modifichi solo ciò che conta per il test.</li><li><b>Fixture minime</b>: ogni test crea i dati che usa; niente grandi dump condivisi.</li><li>Dati realistici per le prestazioni in un ambiente a parte, non nei test unitari.</li></ul>
<h3>Cosa testare davvero</h3><ul><li>Query complesse: risultati su dati noti, <b>casi limite</b> (vuoto, NULL, duplicati, fusi orari).</li><li><b>Vincoli</b>: violare di proposito UNIQUE/CHECK/FK e verificare l'errore atteso.</li><li><b>Transazioni e concorrenza</b>: due sessioni che aggiornano la stessa riga; il lock o il ritento funziona?</li><li><b>Numero di query</b> (<code>assertNumQueries</code>) per intercettare gli N+1.</li><li><b>Migrazioni</b>: applica dall'inizio fino all'ultima su un database vuoto; verifica che schema e modelli coincidano (<code>alembic check</code>/<code>makemigrations --check</code>); prova upgrade e downgrade su dati di esempio.</li></ul>
<h3>In CI</h3><ul><li>Un servizio Postgres nel job (<code>services: postgres:</code> in GitHub Actions) o Testcontainers dove il runner ha Docker.</li><li>Esegui le migrazioni nel job prima dei test; parallelizza con database separati per worker (<code>pytest-xdist</code>).</li></ul>
<h3>Trappole</h3><ul><li>Test che dipendono dall'ordine o da dati lasciati da altri test.</li><li>SQLite in test e Postgres in produzione: query che funzionano in uno e non nell'altro.</li><li>Orari senza fuso orario che passano in locale e falliscono in CI.</li><li>Sequenze non azzerate: id imprevisti nelle asserzioni (non asserire id fissi).</li></ul>
<div class="say"><b>Cosa dire.</b> «Per l'accesso ai dati uso lo stesso Postgres della produzione in container, con rollback per test e factory per i dati, e testo vincoli, concorrenza, numero di query e migrazioni.»</div>`,
  [
    q(
      'q1',
      'Perché non basta mockare il database?',
      ['Non prova SQL, vincoli e transazioni reali', 'Il mock è lento', 'Non esistono mock', 'Perché è vietato'],
      0,
      'I bug veri compaiono con il motore reale.',
    ),
    q(
      'q2',
      'Perché evitare SQLite al posto di Postgres nei test?',
      ['Dialetti diversi: bug che compaiono solo in produzione', 'È troppo veloce', 'Non supporta SQL', 'Costa di più'],
      0,
      'Usa lo stesso motore e versione.',
    ),
    q(
      'q3',
      'Come tieni isolati i test con un database condiviso nella sessione?',
      ['Rollback (o savepoint) per test', 'Un database per riga', 'Ordine fisso dei test', 'Niente'],
      0,
      'È veloce e pulisce da solo.',
    ),
    q(
      'q4',
      'Cosa è una factory di test?',
      ['Una funzione che crea oggetti validi, modificando solo ciò che serve', 'Un database', 'Un mock', 'Un indice'],
      0,
      'factory_boy, polyfactory.',
    ),
    q(
      'q5',
      'Come intercetti gli N+1 nei test?',
      ['Asserendo il numero di query', 'Ignorandoli', 'Con più thread', 'Con la cache'],
      0,
      'assertNumQueries o equivalente.',
    ),
  ],
  [
    card('c1', 'Database vero nei test', 'Stesso motore e versione della produzione, in container (Testcontainers).'),
    card('c2', 'Isolamento', 'Container per sessione, rollback/savepoint per test, o TRUNCATE tra i test.'),
    card('c3', 'Dati', 'Factory (factory_boy/polyfactory); ogni test crea ciò che usa.'),
    card('c4', 'Migrazioni', 'Applica tutto su DB vuoto; verifica coerenza con i modelli; prova upgrade/downgrade.'),
    card('c5', 'In CI', 'services: postgres nel job o Testcontainers; migrazioni prima dei test.'),
  ],
  [
    prac(
      'p1',
      'Imposta i test di integrazione per un servizio FastAPI + SQLAlchemy + Postgres.',
      'Postgres di test in container per sessione, schema da migrazioni, fixture db con rollback per test, override della dipendenza get_session, factory per i dati, test su vincoli, concorrenza e numero di query, esecuzione in CI con servizio Postgres.',
    ),
    prac(
      'p2',
      'Un test passa in locale con SQLite e fallisce in produzione: perché e come lo prevenisci?',
      'Dialetti diversi (tipi, funzioni, vincoli, transazioni): uso lo stesso Postgres in container nei test e in CI, così la query è provata sul motore reale.',
    ),
  ],
  'Note del vault: tooling/testing/testcontainers-contract-testing.md, python/testing.md, backend/databases/zero-downtime-migrations.md',
)

export const workloads = mod(
  'workloads',
  'Ricerca full-text, serie temporali e analisi',
  'tsvector e GIN, TimescaleDB, star schema, ETL/ELT, DuckDB',
  'beyond',
  `<p class="lead">Tre carichi comuni oltre l'OLTP: cercare nel testo, gestire misure nel tempo, analizzare grandi volumi. Postgres e pochi strumenti accanto coprono la maggior parte dei casi.</p>
<h3>Full-text search in Postgres</h3><pre><code>ALTER TABLE articoli ADD COLUMN ricerca tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('italian', coalesce(titolo, '')), 'A') ||
    setweight(to_tsvector('italian', coalesce(testo,  '')), 'B')
  ) STORED;

CREATE INDEX ON articoli USING gin (ricerca);

SELECT id, titolo, ts_rank(ricerca, q) AS rilevanza
FROM articoli, websearch_to_tsquery('italian', 'database "indici composti" -mysql') q
WHERE ricerca @@ q
ORDER BY rilevanza DESC LIMIT 20;</code></pre>
<ul><li>Il <b>tsvector</b> contiene i lessemi normalizzati (stemming, stop word); la <b>tsquery</b> la ricerca; <code>GIN</code> rende veloce <code>@@</code>.</li><li><code>pg_trgm</code> per la ricerca approssimata e <code>LIKE '%x%'</code>; <code>unaccent</code> per gli accenti.</li><li>Quando passare a Elasticsearch/OpenSearch: molti documenti e utenti, ranking avanzato, faccette, correzioni, sinonimi, cluster dedicato. Si alimenta dal database con outbox/CDC.</li></ul>
<h3>Serie temporali</h3><pre><code>-- tabella delle misure partizionata o ipertabella
SELECT create_hypertable('misure', 'ts');                      -- TimescaleDB

SELECT date_bin('5 minutes', ts, TIMESTAMPTZ '2026-01-01') AS finestra,
       avg(valore) AS media, max(valore) AS massimo
FROM misure WHERE sensore_id = 7 AND ts &gt; now() - interval '1 day'
GROUP BY 1 ORDER BY 1;</code></pre>
<ul><li>Dati <b>append-only</b> con tempo come chiave: partizioni per intervallo, indice su <code>(sensore_id, ts)</code>, BRIN per tabelle enormi.</li><li><b>Retention</b> (eliminare i dati vecchi con <code>DROP</code> di partizione), <b>downsampling</b> (aggregati precalcolati), <b>compressione</b>.</li><li>TimescaleDB aggiunge ipertabelle, aggregati continui e compressione dentro Postgres; alternative: InfluxDB, ClickHouse, Prometheus per metriche.</li></ul>
<h3>Analisi e data warehouse</h3><ul><li><b>OLTP</b> (ordini, utenti) e <b>OLAP</b> (analisi) hanno esigenze opposte: non interrogare in modo pesante il database transazionale. Usa una replica, o meglio un warehouse (BigQuery, Snowflake, ClickHouse, DuckDB).</li><li><b>Star schema</b>: una tabella dei <b>fatti</b> (eventi misurabili: vendite con importi) circondata da <b>dimensioni</b> (cliente, prodotto, data, negozio). Query semplici e veloci con join sulle dimensioni.</li></ul>
<pre><code>fatti_vendite(data_id, prodotto_id, cliente_id, negozio_id, quantita, importo)
dim_prodotto(id, nome, categoria)   dim_cliente(id, citta, segmento)   dim_data(id, data, mese, anno)</code></pre>
<ul><li><b>ETL/ELT</b>: estrai i dati, trasformali, caricali. ELT carica prima i dati grezzi nel warehouse e trasforma con SQL (<b>dbt</b> versiona queste trasformazioni come modelli testati).</li><li>Formati colonnari (<b>Parquet</b>) e motori in-process come <b>DuckDB</b>: analisi veloci di file locali o su object storage, senza cluster.</li></ul>
<pre><code>-- DuckDB: interroga direttamente un file Parquet
SELECT categoria, sum(importo) FROM 'vendite/*.parquet' GROUP BY 1 ORDER BY 2 DESC;</code></pre>
<h3>Scegliere</h3><div class="tblw"><table><tr><th>Bisogno</th><th>Primo tentativo</th><th>Poi</th></tr>
<tr><td>Ricerca nel testo</td><td>tsvector + GIN</td><td>Elasticsearch/OpenSearch</td></tr>
<tr><td>Misure nel tempo</td><td>partizioni + indici (o TimescaleDB)</td><td>ClickHouse/InfluxDB</td></tr>
<tr><td>Report e analisi</td><td>replica di lettura, viste materializzate</td><td>warehouse + dbt</td></tr></table></div>
<div class="say"><b>Cosa dire.</b> «Parto da Postgres: tsvector con GIN per la ricerca, partizioni o Timescale per le serie temporali, e per l'analisi un warehouse con modello a stella e trasformazioni versionate; aggiungo uno strumento dedicato solo quando i numeri lo richiedono.»</div>`,
  [
    q(
      'q1',
      'Quale indice rende veloce <code>tsvector @@ tsquery</code>?',
      ['GIN', 'B-tree', 'Hash', 'Nessuno'],
      0,
      'GIN per il full-text.',
    ),
    q(
      'q2',
      'Cosa è uno star schema?',
      [
        'Una tabella dei fatti circondata da tabelle di dimensione',
        'Un tipo di indice',
        'Una replica',
        'Un formato file',
      ],
      0,
      'Ottimo per analisi e report.',
    ),
    q(
      'q3',
      'Come si elimina in modo efficiente un mese di serie temporali?',
      ['DROP della partizione', 'DELETE di milioni di righe', 'VACUUM FULL', 'TRUNCATE di tutto'],
      0,
      'Operazione quasi istantanea.',
    ),
    q(
      'q4',
      'Qual è la differenza tra ETL ed ELT?',
      [
        'ELT carica i dati grezzi nel warehouse e trasforma lì con SQL',
        'Nessuna',
        'ETL è più recente',
        'ELT non trasforma',
      ],
      0,
      'Esempio: dbt.',
    ),
    q(
      'q5',
      'Perché non interrogare in modo pesante il database transazionale per le analisi?',
      [
        'Rallenta gli utenti: servono una replica o un warehouse',
        'Non è possibile',
        'Perché non ha indici',
        'Per sicurezza solo',
      ],
      0,
      'OLTP e OLAP hanno carichi opposti.',
    ),
  ],
  [
    card('c1', 'Full-text in Postgres', 'tsvector + indice GIN + websearch_to_tsquery e ts_rank.'),
    card('c2', 'Ricerca approssimata', 'pg_trgm (e unaccent per gli accenti).'),
    card('c3', 'Serie temporali', 'Partizioni per tempo + indice (sensore, ts), retention con DROP, downsampling.'),
    card('c4', 'Star schema', 'Fatti (eventi con misure) + dimensioni (cliente, prodotto, data).'),
    card('c5', 'Analisi veloce di file', 'DuckDB su Parquet.'),
  ],
  [
    prac(
      'p1',
      'Aggiungi la ricerca testuale in italiano agli articoli di un blog su Postgres.',
      'Colonna tsvector generata (titolo peso A, testo peso B), indice GIN, query con websearch_to_tsquery e ts_rank; unaccent/pg_trgm per i refusi; eventuale passaggio a Elasticsearch se servono sinonimi e faccette.',
    ),
    prac(
      'p2',
      'Un sensore invia 1.000 misure al secondo: come progetti la tabella?',
      'Tabella (o ipertabella) partizionata per tempo, indice su (sensore_id, ts) o BRIN, inserimenti in batch, retention con DROP delle partizioni, aggregati precalcolati per i grafici, e valuto TimescaleDB o ClickHouse se cresce.',
    ),
  ],
  'Note del vault: backend/databases/nosql-databases.md, vector-databases.md, postgresql/indexing.md, postgresql/partitioning-and-replication.md',
)
