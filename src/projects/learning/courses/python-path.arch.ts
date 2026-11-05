import { card, mod, prac, q } from './python-path.helpers'

// Group "master" (round 5, from the council review): architecture, performance workflow, deployment.

export const architecture = mod(
  'architecture',
  'Architettura e principi di design',
  'SOLID, strati, hexagonal, DDD base, monolite modulare, CQRS',
  'master',
  `<p class="lead">I pattern risolvono problemi piccoli; l'architettura decide dove mettere le cose perché il sistema resti modificabile. In Python conviene restare semplici e aggiungere struttura quando serve.</p>
<h3>SOLID in Python</h3><ul><li><b>S</b>ingle responsibility: un modulo/classe, un motivo per cambiare.</li><li><b>O</b>pen/closed: estendi con nuove funzioni/strategie invece di modificare codice che funziona.</li><li><b>L</b>iskov: una sottoclasse sostituisce la base senza sorprese.</li><li><b>I</b>nterface segregation: <code>Protocol</code> piccoli e mirati.</li><li><b>D</b>ependency inversion: il dominio dipende da astrazioni (Protocol) che l'infrastruttura implementa; le dipendenze si passano come argomenti.</li></ul>
<h3>Architettura a strati</h3><pre><code>api/           # vista, route, schemi (Pydantic): solo traduzione HTTP
servizi/       # casi d'uso: orchestrano il dominio e i repository
dominio/       # entità, regole di business: Python puro, senza framework
infra/         # database, code, client esterni (implementano i Protocol)</code></pre><p>La regola: le dipendenze vanno <b>verso il dominio</b>. Il dominio non importa FastAPI, Django né SQLAlchemy.</p>
<h3>Hexagonal (porte e adattatori)</h3><p>Il nucleo definisce <b>porte</b> (<code>class Repo(Protocol)</code>, <code>class Notificatore(Protocol)</code>); gli <b>adattatori</b> le implementano (Postgres, in-memory per i test, email). Così testi la logica senza database e cambi tecnologia senza toccarla.</p>
<h3>DDD: i mattoni utili</h3><ul><li><b>Entità</b> (identità, ciclo di vita) contro <b>value object</b> (immutabile, uguale per valore: <code>@dataclass(frozen=True)</code>).</li><li><b>Aggregato</b>: gruppo di oggetti con una radice che garantisce le invarianti; una transazione, un aggregato.</li><li><b>Linguaggio ubiquo</b>: i nomi del codice sono quelli del dominio. <b>Bounded context</b>: confini oltre cui lo stesso termine significa altro.</li></ul>
<h3>Service layer contro fat models</h3><p>Django spinge la logica nei modelli; con regole complesse conviene un <b>service layer</b> (funzioni di caso d'uso) e modelli sottili. Evita di mettere logica nei signal e nelle viste.</p>
<h3>Monolite modulare o microservizi</h3><ul><li>Parti da un <b>monolite modulare</b>: moduli con confini chiari e interfacce esplicite; un solo deploy, una sola transazione.</li><li>I microservizi risolvono problemi organizzativi e di scala, ma costano: rete, coerenza eventuale, osservabilità, deploy multipli. Estraili quando un confine è stabile e il motivo è reale.</li></ul>
<h3>Eventi e CQRS</h3><ul><li><b>Event-driven</b>: i componenti reagiscono a eventi (code, outbox); disaccoppia ma rende il flusso meno visibile.</li><li><b>CQRS</b>: separa il modello di scrittura da quello di lettura (viste ottimizzate); utile quando le letture sono molto diverse dalle scritture. Non necessario di default.</li></ul>
<h3>Quando NON fare architettura</h3><ul><li>Uno script o un CRUD semplice non hanno bisogno di strati e porte.</li><li>Introduci un'astrazione quando hai almeno due implementazioni o un bisogno di test reale, non «per il futuro».</li><li>Il costo dell'indirezione è leggibilità: scegli il livello minimo che regge i requisiti.</li></ul>
<div class="say"><b>Cosa dire.</b> «Dominio in Python puro, dipendenze verso il dominio, Protocol per le porte, monolite modulare finché non c'è un motivo concreto per dividere.»</div>`,
  [
    q(
      'q1',
      "In un'architettura a strati, verso dove vanno le dipendenze?",
      ['Verso il dominio', 'Verso il database', 'Verso il framework web', 'Non contano'],
      0,
      'Il dominio non importa framework né infrastruttura.',
    ),
    q(
      'q2',
      "Cos'è un value object?",
      [
        'Un oggetto immutabile uguale per valore',
        "Un'entità con identità",
        'Un record del database',
        'Un tipo di cache',
      ],
      0,
      'Esempio: dataclass(frozen=True).',
    ),
    q(
      'q3',
      'Quando i microservizi sono giustificati?',
      [
        'Sempre',
        "Quando c'è un confine stabile e un motivo organizzativo o di scala reale",
        'Per sembrare moderni',
        'Mai',
      ],
      1,
      'Hanno un costo alto in rete, coerenza e operatività.',
    ),
    q(
      'q4',
      "Cosa permette l'architettura hexagonal?",
      [
        'Testare la logica con adattatori finti e cambiare tecnologia senza toccarla',
        'Evitare i test',
        'Usare solo SQL',
        'Scrivere meno codice',
      ],
      0,
      'Porte (Protocol) e adattatori.',
    ),
    q(
      'q5',
      "Quando introdurre un'astrazione?",
      ['Sempre in anticipo', 'Con due implementazioni o un bisogno concreto di test', 'Mai', 'Solo in Java'],
      1,
      "Evita l'indirezione inutile.",
    ),
  ],
  [
    card('c1', 'Regola delle dipendenze', 'Verso il dominio: il dominio non conosce framework né database.'),
    card('c2', 'Porta e adattatore', 'Protocol nel nucleo; implementazioni (Postgres, in-memory) fuori.'),
    card('c3', 'Value object', '@dataclass(frozen=True): immutabile e confrontato per valore.'),
    card('c4', 'Prima di dividere in servizi', 'Monolite modulare con confini e interfacce chiari.'),
  ],
  [
    prac(
      'p1',
      "Come strutturi un'applicazione di prenotazioni con FastAPI e Postgres?",
      "Strati api/servizi/dominio/infra; Protocol RepoPrenotazioni; servizio di caso d'uso transazionale; dominio con regole (sovrapposizioni) senza import di framework; adattatori Postgres e in-memory per i test.",
    ),
    prac(
      'p2',
      'Un collega vuole spezzare il monolite in 10 microservizi: cosa chiedi?',
      "Quale problema reale risolve, quali confini sono stabili, come gestiremo coerenza, osservabilità, deploy e on-call; propongo prima un monolite modulare e l'estrazione di un solo servizio dove serve.",
    ),
  ],
  'Note del vault: computer science/patterns/*, python/class-patterns.md, python/abc-abstract-classes.md',
)

export const perf = mod(
  'perf',
  'Prestazioni: metodo e strumenti',
  'Profilare prima, flame graph, memoria, vittorie facili, load test',
  'master',
  `<p class="lead">L'ottimizzazione senza misure è superstizione. Il metodo conta più del trucco.</p>
<h3>Il metodo</h3><ol><li><b>Definisci l'obiettivo</b> (p95 sotto 200 ms, 500 richieste/s).</li><li><b>Misura</b> con dati e carico realistici.</li><li><b>Trova il collo di bottiglia</b> con un profiler.</li><li><b>Cambia una cosa</b> e rimisura.</li><li>Fermati quando l'obiettivo è raggiunto.</li></ol>
<h3>Strumenti</h3><div class="tblw"><table><tr><th>Strumento</th><th>Uso</th></tr>
<tr><td><code>timeit</code>, <code>pyperf</code></td><td>micro-benchmark affidabili</td></tr>
<tr><td><code>cProfile</code> + <code>snakeviz</code></td><td>quali funzioni consumano tempo (tempo cumulativo e proprio)</td></tr>
<tr><td><code>py-spy record</code></td><td>flame graph di un processo vivo, senza modificarlo</td></tr>
<tr><td><code>line_profiler</code></td><td>tempo riga per riga di una funzione</td></tr>
<tr><td><code>tracemalloc</code>, <code>memray</code></td><td>chi alloca memoria e dove cresce</td></tr>
<tr><td><code>locust</code>, <code>k6</code></td><td>test di carico: throughput, latenza sotto stress</td></tr></table></div>
<pre><code>python -m cProfile -o out.prof app.py
snakeviz out.prof
py-spy record -o flame.svg --pid 1234</code></pre>
<h3>Leggere un flame graph</h3><p>La larghezza di un blocco è il tempo; l'altezza è la profondità dello stack. Cerca i blocchi <b>larghi</b> in cima: lì va il lavoro. Se domina l'attesa su socket o lock, il problema è I/O o contesa, non CPU.</p>
<h3>Vittorie frequenti (in ordine)</h3><ol><li><b>Query</b>: N+1, indici mancanti, colonne inutili, paginazione.</li><li><b>I/O</b>: batching, connessioni riusate (<code>Client</code>), concorrenza con asyncio.</li><li><b>Cache</b> di risultati costosi con TTL.</li><li><b>Algoritmo e struttura dati</b>: <code>set</code>/<code>dict</code> al posto di liste, evitare O(n²).</li><li><b>Serializzazione</b>: <code>orjson</code>/<code>msgspec</code> al posto di <code>json</code>; <code>uvloop</code> per asyncio.</li><li><b>Memoria</b>: generatori, <code>__slots__</code>, <code>array</code>/NumPy.</li><li><b>Codice nativo</b> solo alla fine.</li></ol>
<h3>Test di carico</h3><ul><li>Scrivi uno scenario realistico (login, lettura, scrittura), cresci il carico a gradini e osserva latenza p95/p99, errori e saturazione (CPU, pool di connessioni).</li><li>Testa un ambiente simile alla produzione; separa riscaldamento e misura; ripeti.</li></ul>
<h3>Errori comuni</h3><ul><li>Ottimizzare ciò che non è il collo di bottiglia.</li><li>Benchmark con dati giocattolo o a freddo.</li><li>Guardare la media invece dei percentili.</li><li>Cambiare più cose insieme e non sapere cosa ha funzionato.</li></ul>
<div class="say"><b>Cosa dire.</b> «Fisso un obiettivo, profilo con dati realistici, cambio una cosa alla volta e verifico con un test di carico.»</div>`,
  [
    q(
      'q1',
      'Primo passo per ottimizzare?',
      ['Riscrivere in C', 'Misurare e profilare', 'Aggiungere cache ovunque', 'Usare più thread'],
      1,
      'Senza misura si ottimizza il punto sbagliato.',
    ),
    q(
      'q2',
      'Cosa mostra la larghezza in un flame graph?',
      ['Il tempo speso', 'La memoria', 'Il numero di chiamate', 'La profondità'],
      0,
      'I blocchi larghi sono i punti caldi.',
    ),
    q(
      'q3',
      'Quale strumento profila un processo Python vivo senza modificarlo?',
      ['py-spy', 'timeit', 'pdb', 'pip'],
      0,
      "Campiona lo stack dall'esterno.",
    ),
    q(
      'q4',
      'Quale metrica guardare nei test di carico?',
      ['La media', 'Percentili p95/p99 ed errori', 'Solo la CPU', 'Il numero di thread'],
      1,
      'La coda lenta è ciò che gli utenti sentono.',
    ),
    q(
      'q5',
      'Quale vittoria è spesso la più grande in un backend web?',
      ['Riscrivere in Rust', 'Sistemare le query (N+1, indici)', 'Cambiare il linguaggio', 'Disabilitare il GC'],
      1,
      'Il database domina molto più spesso del Python.',
    ),
  ],
  [
    card('c1', 'Metodo', 'Obiettivo → misura → collo di bottiglia → una modifica → rimisura.'),
    card('c2', 'Profilo di funzioni', 'python -m cProfile -o out.prof app.py; snakeviz out.prof.'),
    card('c3', 'Flame graph di un processo', 'py-spy record -o flame.svg --pid N.'),
    card('c4', 'Serializzazione veloce', 'orjson / msgspec al posto di json.'),
    card('c5', 'Test di carico', 'locust o k6; osserva p95/p99, errori, saturazione.'),
  ],
  [
    prac(
      'p1',
      'Un endpoint passa da 100 ms a 1,2 s sotto carico: come procedi?',
      'Riproduco con un test di carico, guardo p95 e saturazione (pool DB, CPU), traccio la richiesta lenta, ispeziono query e lock, profilo il codice con py-spy, correggo il collo e rimisuro.',
    ),
    prac(
      'p2',
      'Perché non fidarsi della media?',
      'La media nasconde le code lente; p95/p99 mostrano ciò che subisce una parte degli utenti e rivelano contesa e timeout.',
    ),
  ],
  'Note del vault: python/performance-profiling.md, python/cpython-internals.md',
)

export const deploy = mod(
  'deploy',
  'Deploy: container, server e rilasci',
  'Dockerfile multi-stage, gunicorn/uvicorn, health check, shutdown, zero-downtime',
  'master',
  `<p class="lead">Il codice che funziona sul tuo portatile deve girare in modo ripetibile, sicuro e senza downtime. Questo è il percorso dal repository alla produzione.</p>
<h3>Dockerfile multi-stage con uv</h3><pre><code>FROM python:3.12-slim AS build
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY src ./src
RUN uv sync --frozen --no-dev

FROM python:3.12-slim
RUN useradd -m app
WORKDIR /app
COPY --from=build /app /app
ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1
USER app
EXPOSE 8080
CMD ["uvicorn", "mioapp.main:app", "--host", "0.0.0.0", "--port", "8080"]</code></pre>
<ul><li>Il lockfile (<code>uv.lock</code>) rende la build ripetibile; livelli ordinati perché la cache si invalidi il meno possibile (dipendenze prima del codice).</li><li>Immagine slim, <b>utente non root</b>, nessun segreto nell'immagine, <code>.dockerignore</code>.</li><li>Un processo per container; i log vanno su stdout.</li></ul>
<h3>Server applicativi</h3><ul><li><b>ASGI</b>: <code>uvicorn</code> (anche con più worker) o <code>gunicorn</code> con worker uvicorn. <b>WSGI</b>: <code>gunicorn</code>.</li><li>Quanti worker? Per I/O leggero cresci col carico; per CPU circa pari ai core. Misura invece di indovinare.</li><li>Dietro un reverse proxy (nginx, load balancer) che gestisce TLS, compressione e limiti.</li></ul>
<h3>Health check e readiness</h3><ul><li><b>Liveness</b>: il processo è vivo? (<code>/health</code> economico). <b>Readiness</b>: è pronto a ricevere traffico? (database raggiungibile, cache calde).</li><li>Non rendere la liveness dipendente da servizi esterni: un guasto del database farebbe riavviare tutto inutilmente.</li></ul>
<h3>Shutdown pulito</h3><p>Su <code>SIGTERM</code> il server smette di accettare richieste, finisce quelle in corso e chiude connessioni e worker. Imposta un tempo massimo (<code>--timeout-graceful-shutdown</code>) e fai completare o riaccodare i task.</p>
<h3>Rilasci senza downtime</h3><ol><li><b>Migrazioni retrocompatibili</b> prima del codice nuovo (espandi → migra → contrai).</li><li><b>Rolling update</b>: istanze sostituite poco alla volta; il codice vecchio e nuovo convivono, quindi API e schema devono reggere entrambi.</li><li><b>Feature flag</b> per separare deploy e rilascio; <b>canary</b> su una piccola quota di traffico; rollback rapido.</li></ol>
<h3>Pipeline CI/CD</h3><p>Checkout → installa dal lockfile → ruff → mypy → test (con servizi) → build dell'immagine → scansione vulnerabilità → push → deploy in staging → test di fumo → produzione.</p>
<h3>Cenni di Kubernetes</h3><ul><li><b>Deployment</b> (repliche), <b>Service</b> (rete stabile), <b>Ingress</b>, <b>ConfigMap/Secret</b> (config).</li><li><b>Probes</b> di liveness e readiness, <b>resource requests/limits</b>, <b>HPA</b> per l'autoscaling, <b>PodDisruptionBudget</b> per i rilasci.</li></ul>
<h3>Trappole</h3><ul><li>Build non riproducibili (versioni non fissate); immagini enormi.</li><li>Eseguire come root; segreti in variabili nell'immagine.</li><li>Migrazioni incompatibili col codice precedente.</li><li>Nessun timeout o shutdown pulito: richieste perse a ogni deploy.</li></ul>
<div class="say"><b>Cosa dire.</b> «Immagine multi-stage dal lockfile, utente non root, health check separati, shutdown pulito e migrazioni retrocompatibili per i rilasci senza downtime.»</div>`,
  [
    q(
      'q1',
      'Perché un Dockerfile multi-stage?',
      [
        'Immagine finale più piccola e senza strumenti di build',
        'È più veloce da scrivere',
        'Serve a Kubernetes',
        'È obbligatorio',
      ],
      0,
      'Costruisci in uno stage e copi solo il risultato.',
    ),
    q(
      'q2',
      'Differenza tra liveness e readiness?',
      [
        'Nessuna',
        'Liveness: il processo è vivo; readiness: pronto a ricevere traffico',
        'Liveness è per il database',
        'Readiness è per i log',
      ],
      1,
      "Una readiness fallita toglie l'istanza dal traffico senza riavviarla.",
    ),
    q(
      'q3',
      'Cosa succede su SIGTERM in un server ben fatto?',
      [
        'Si ferma subito',
        'Smette di accettare richieste e finisce quelle in corso',
        'Ignora il segnale',
        'Riavvia i worker',
      ],
      1,
      'Shutdown pulito entro un timeout.',
    ),
    q(
      'q4',
      'Come si fa un rilascio senza downtime con una nuova colonna?',
      [
        'Migrazione retrocompatibile prima del codice, poi pulizia',
        'Fermare il servizio',
        'Cambiare nome al database',
        'Solo rollback',
      ],
      0,
      'Espandi → migra → contrai.',
    ),
    q(
      'q5',
      'Perché eseguire come utente non root nel container?',
      ["Riduce l'impatto di una compromissione", 'È più veloce', 'Serve a Python', 'È un requisito di pip'],
      0,
      'Principio del privilegio minimo.',
    ),
  ],
  [
    card('c1', 'Build ripetibile', 'Lockfile + uv sync --frozen; dipendenze prima del codice per la cache.'),
    card('c2', 'Shutdown', 'SIGTERM → stop nuove richieste → finisci le in corso → chiudi risorse.'),
    card('c3', 'Probes', 'Liveness (vivo), readiness (pronto); la liveness non dipende da servizi esterni.'),
    card('c4', 'Migrazione sicura', 'Espandi → migra dati → contrai, compatibile con codice vecchio e nuovo.'),
    card('c5', 'Rilascio graduale', 'Feature flag + canary + rollback rapido.'),
  ],
  [
    prac(
      'p1',
      'Scrivi a voce il percorso di un deploy sicuro di un servizio FastAPI con Postgres.',
      'CI con lint, tipi, test; immagine multi-stage; migrazione retrocompatibile; rolling update con readiness; canary e feature flag; shutdown pulito; monitoraggio e rollback.',
    ),
    prac(
      'p2',
      'Il servizio perde richieste a ogni deploy: perché?',
      'Probabile mancanza di shutdown pulito o readiness: il traffico arriva a istanze che chiudono; imposto SIGTERM gestito, readiness e un periodo di drenaggio.',
    ),
  ],
  'Note del vault: tooling/docker/*, tooling/kubernetes/*, databases/zero-downtime-migrations.md, tooling/github-actions.md',
)
