import { card, mod, prac, q } from '../kit'

// Group "master" (round 3): Django internals, native extensions, packaging, task queues.

export const djangoInternals = mod(
  'django',
  'Django: gli interni che contano',
  'Ciclo di richiesta, QuerySet lazy, transazioni, signal, async',
  'master',
  `<p class="lead">Django è una pipeline richiesta/risposta attorno a un ORM, un router di URL e un sistema di convenzioni. Capire il ciclo di vita e la pigrizia dei QuerySet spiega quasi tutti i problemi di prestazioni e correttezza.</p>
<h3>Ciclo di vita di una richiesta</h3><ol><li>Il server (gunicorn/uvicorn) chiama l'applicazione WSGI/ASGI, che costruisce una <code>HttpRequest</code>.</li><li>I <b>middleware</b> girano dall'alto verso il basso, il <b>resolver</b> trova la vista in <code>ROOT_URLCONF</code>, la <b>vista</b> restituisce una <code>HttpResponse</code>, poi i middleware risalgono.</li><li>Le eccezioni diventano risposte (404, 403, 500).</li><li>I segnali <code>request_started</code> e <code>request_finished</code> circondano il tutto; le connessioni al database si chiudono alla fine.</li></ol>
<h3>QuerySet: lazy e con cache</h3><pre><code>qs = Ordine.objects.filter(stato="aperto")      # nessuna query
qs = qs.exclude(totale=0).order_by("-creato")   # ancora nessuna query
list(qs)                                        # esegue UNA query, risultato in cache</code></pre>
<ul><li>La query parte su iterazione, <code>list()</code>, <code>len()</code>, <code>bool()</code>, slicing con passo.</li><li><code>exists()</code> e <code>count()</code> costano meno che caricare le righe; <code>iterator()</code> per risultati grandi; <code>only()</code>, <code>defer()</code>, <code>values()</code> limitano le colonne.</li><li><b>N+1</b>: <code>select_related</code> (JOIN, FK e OneToOne) e <code>prefetch_related</code> (seconda query, M2M e FK inversa).</li><li>Aggiornamenti senza race: <code>update()</code> con <code>F("n") + 1</code>; <code>bulk_create</code>/<code>bulk_update</code> per scritture in blocco (non chiamano <code>save()</code> né i signal).</li></ul>
<h3>Transazioni</h3><ul><li><code>ATOMIC_REQUESTS=True</code> avvolge ogni richiesta; <code>with transaction.atomic():</code> per un blocco (annidati = savepoint).</li><li><code>transaction.on_commit(fn)</code> esegue codice solo dopo un commit riuscito: il posto giusto per accodare task Celery o inviare email.</li><li><code>select_for_update()</code> blocca le righe per aggiornamenti concorrenti.</li></ul>
<h3>Signal</h3><pre><code>@receiver(post_save, sender=Ordine)
def notifica(sender, instance, created, **kw):
    if created:
        transaction.on_commit(lambda: invia_ricevuta.delay(instance.pk))</code></pre>
<p>Disaccoppiano le app ma nascondono il flusso. Preferisci funzioni di servizio esplicite; usa i signal per reazioni tra app che non controlli. Non partono con <code>bulk_*</code> e <code>update()</code>.</p>
<h3>Cache e async</h3><ul><li>Cache per vista, per frammento o a basso livello (<code>cache.get_or_set</code>) con Redis; l'invalidazione resta un tuo problema.</li><li>Viste <code>async def</code> sotto ASGI; l'ORM ha metodi async (<code>aget</code>, <code>async for</code>), ma molte operazioni girano ancora su thread via <code>sync_to_async</code>.</li></ul>
<h3>Dietro le quinte</h3><p>Il registro delle app parte da <code>INSTALLED_APPS</code>; la metaclasse dei modelli raccoglie i campi in <code>_meta</code>; le migrazioni sono un grafo di operazioni confrontate con lo stato dei modelli.</p>
<h3>Trappole</h3><ul><li>Query dentro un ciclo (N+1).</li><li>Accodare un task prima del commit: il worker non trova i dati.</li><li><code>len(qs)</code> invece di <code>qs.count()</code>; <code>if qs:</code> carica tutto.</li><li>Logica di business nei signal o nelle viste.</li></ul>
<div class="say"><b>Cosa dire.</b> «Controllo le query con assertNumQueries, uso select_related/prefetch_related e accodo i task con on_commit.»</div>`,
  [
    q(
      'q1',
      'Quando viene eseguita davvero una query su un QuerySet?',
      ['Alla creazione', 'Alla valutazione (iterazione, list, len, bool)', 'Al filter()', 'Al commit'],
      1,
      'I QuerySet sono lazy e il risultato resta in cache.',
    ),
    q(
      'q2',
      'Perché usare <code>transaction.on_commit</code> per accodare un task?',
      ['È più veloce', 'Il task parte solo se la transazione è andata a buon fine', 'Evita i retry', 'Non serve'],
      1,
      'Altrimenti il worker può leggere dati non ancora committati.',
    ),
    q(
      'q3',
      'Come risolvi un N+1 su una ForeignKey?',
      ['exists()', 'select_related (un JOIN)', 'iterator()', 'only() soltanto'],
      1,
      'select_related è la scelta naturale per una FK (un solo JOIN); prefetch_related serve per M2M e FK inverse e funziona anche su FK, con due query.',
    ),
    q(
      'q4',
      'I signal <code>post_save</code> partono con <code>bulk_create</code>?',
      ['Sì', 'No', 'Solo con update()', 'Solo in test'],
      1,
      'bulk_* e update() non chiamano save() né i signal.',
    ),
    q(
      'q5',
      'Ordine dei middleware?',
      ['Solo in entrata', "In entrata dall'alto, in uscita dal basso", 'Casuale', 'Solo in uscita'],
      1,
      'Come una cipolla attorno alla vista.',
    ),
  ],
  [
    card('c1', 'N+1', 'select_related (JOIN) per FK/OneToOne; prefetch_related (query separata) per M2M e FK inverse.'),
    card('c2', 'Evitare race su un contatore', 'Model.objects.filter(pk=x).update(n=F("n") + 1).'),
    card('c3', 'Side effect dopo il commit', 'transaction.on_commit(lambda: ...).'),
    card('c4', 'Contare le query nei test', 'self.assertNumQueries(n) o django-debug-toolbar.'),
    card('c5', 'Controllo esistenza', 'qs.exists() invece di len(qs) o if qs.'),
  ],
  [
    prac(
      'p1',
      'Un endpoint che elenca ordini con cliente e righe è lento: come procedi?',
      'Conto le query (debug toolbar), aggiungo select_related("cliente") e prefetch_related("righe"), pagino, limito le colonne con only(), indicizzo i filtri, rimisuro.',
    ),
    prac(
      'p2',
      "Dopo il salvataggio un'email non parte o parte due volte: perché?",
      'Probabile accodamento prima del commit o signal ripetuto; uso on_commit, rendo il task idempotente e tolgo logica dai signal.',
    ),
  ],
  'Note del vault: django/django-internals.md, django/models-orm.md, django/middleware.md',
)

export const native = mod(
  'native',
  'Extra: estensioni native (C, Cython, Rust)',
  'ctypes, cffi, Cython, PyO3 e maturin, il GIL e i dati',
  'master',
  `<p class="lead">Quando il profilo mostra che il collo di bottiglia è Python puro, sposti il ciclo caldo in codice compilato. Scegli lo strumento più leggero che funziona.</p>
<h3>La scala delle opzioni</h3><ol><li>Algoritmo migliore.</li><li>Vettorizzare con NumPy.</li><li>Una libreria già scritta in C.</li><li><code>ctypes</code>/<code>cffi</code> per una libreria C esistente.</li><li>Cython.</li><li>Rust con PyO3 (o C/C++ con pybind11).</li><li>Riscrivere il pezzo di servizio in Go o Rust.</li></ol>
<h3>ctypes</h3><pre><code>import ctypes, ctypes.util
lib = ctypes.CDLL(ctypes.util.find_library("m"))      # portabile (libm.so.6 esiste solo su Linux)
lib.cos.argtypes = [ctypes.c_double]
lib.cos.restype = ctypes.c_double
lib.cos(0.0)       # 1.0</code></pre>
<p>Non serve un compilatore. Dichiara sempre <code>argtypes</code> e <code>restype</code>: un errore può far crashare l'interprete.</p>
<h3>Cython</h3><pre><code># fast.pyx
def somma(int n):
    cdef long totale = 0
    cdef int i
    for i in range(n):
        totale += i
    return totale</code></pre>
<p>Codice simile a Python con tipi C sulle variabili calde, compilato con <code>cythonize</code> e importato come modulo normale.</p>
<h3>Rust con PyO3 e maturin</h3><pre><code>use pyo3::prelude::*;

#[pyfunction]
fn somma(n: u64) -&gt; u64 { (0..n).sum() }

#[pymodule]
fn fast(m: &amp;Bound&lt;'_, PyModule&gt;) -&gt; PyResult&lt;()&gt; {
    m.add_function(wrap_pyfunction!(somma, m)?)
}</code></pre>
<p><code>maturin develop</code> compila e installa nel venv; <code>maturin build</code> produce le wheel. Sicurezza della memoria e parallelismo semplice. Lo usano Pydantic v2 (pydantic-core), Polars e cryptography; ruff è un binario Rust distribuito come wheel con maturin.</p>
<h3>GIL e codice nativo</h3><p>Il codice nativo può rilasciare il GIL (NumPy, hash, I/O). Una funzione Rust o C che deve girare in parallelo deve rilasciarlo esplicitamente, altrimenti gli altri thread Python aspettano.</p>
<h3>Passare i dati</h3><ul><li>Copiare liste di oggetti Python costa molto: usa buffer (<code>bytes</code>, <code>memoryview</code>, array NumPy, Arrow).</li><li>Raggruppa le chiamate: una per blocco, non una per elemento.</li></ul>
<h3>Buone pratiche</h3><ul><li>Misura prima e dopo con dati realistici: l'overhead della chiamata può annullare il guadagno.</li><li>Tieni stabile l'API Python e nascondi la parte nativa dietro un modulo, con eventuale fallback in Python puro.</li><li>Distribuisci wheel precompilate (<code>cibuildwheel</code>, <code>maturin</code>), non solo sorgenti.</li></ul>
<div class="say"><b>Cosa dire.</b> «Prima algoritmo e NumPy; se serve codice nativo uso Rust con PyO3 per la sicurezza della memoria e distribuisco wheel.»</div>`,
  [
    q(
      'q1',
      'Quale strumento chiama una libreria C esistente senza compilare?',
      ['Cython', 'ctypes', 'PyO3', 'maturin'],
      1,
      'ctypes carica la libreria condivisa a runtime.',
    ),
    q(
      'q2',
      'A cosa serve maturin?',
      ['Compilare e pubblicare estensioni Rust per Python', 'Profilare', 'Testare', 'Gestire venv'],
      0,
      'maturin develop e maturin build.',
    ),
    q(
      'q3',
      'Perché una funzione nativa chiamata dentro un ciclo può non convenire?',
      ['Costo di chiamata e conversione per ogni elemento', 'Non funziona', 'Blocca il GC', 'Usa troppi thread'],
      0,
      'Meglio passare un buffer intero in una chiamata.',
    ),
    q(
      'q4',
      'Cosa succede se dichiari male le firme in ctypes?',
      ['Errore chiaro', "Possibile crash dell'interprete", 'Niente', 'Più velocità'],
      1,
      'Nessun controllo di tipo lato C.',
    ),
    q(
      'q5',
      'Quale è il primo passo prima di scrivere codice nativo?',
      ['Scrivere in Rust', 'Misurare e provare algoritmo/NumPy', 'Disabilitare il GIL', 'Cambiare linguaggio'],
      1,
      'Spesso basta molto meno.',
    ),
  ],
  [
    card('c1', 'Scala', 'Algoritmo → NumPy → libreria C → ctypes/cffi → Cython → PyO3 → servizio in Go/Rust.'),
    card('c2', 'ctypes', 'CDLL + argtypes + restype.'),
    card('c3', 'Rust in Python', 'PyO3 + maturin (develop / build).'),
    card('c4', 'Dati ai confini', 'Buffer (bytes, memoryview, NumPy, Arrow), chiamate a blocchi.'),
  ],
  [
    prac(
      'p1',
      'Un parser in Python puro è il collo di bottiglia: che strada scegli?',
      'Misuro e provo prima algoritmo e librerie esistenti; se serve, estensione in Rust con PyO3 che lavora su bytes interi, con test e benchmark; distribuisco wheel.',
    ),
    prac(
      'p2',
      "Perché spesso conviene NumPy a un'estensione custom?",
      'Fa già il lavoro in C su memoria contigua, è testato e non devi mantenere codice nativo.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/python-native-extensions.md',
)

export const publish = mod(
  'publish',
  'Extra: pubblicare una libreria su PyPI',
  'pyproject, build, wheel, versioni, trusted publishing',
  'master',
  `<p class="lead">Trasformare codice in un pacchetto installabile, versionato e pubblicato. I pacchetti si distribuiscono come <b>sdist</b> (sorgenti) e <b>wheel</b> (precompilate, <code>.whl</code>).</p>
<h3>pyproject.toml</h3><pre><code>[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "mia-lib"
version = "0.3.0"
description = "Descrizione breve"
readme = "README.md"
requires-python = "&gt;=3.10"
dependencies = ["httpx&gt;=0.27"]

[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy"]

[project.scripts]
mia = "mia_lib.cli:main"      # installa il comando "mia"</code></pre>
<p>Layout <code>src/</code> perché i test girino sul pacchetto installato.</p>
<h3>Costruire e controllare</h3><pre><code>uv build               # oppure: python -m build  →  dist/*.tar.gz e *.whl
twine check dist/*     # valida i metadati e il README</code></pre>
<h3>Versioni</h3><ul><li>Semantic Versioning: <code>MAJOR.MINOR.PATCH</code> (rottura, funzione nuova, correzione). Pre-release: <code>1.0.0rc1</code>.</li><li>Tieni un CHANGELOG; versione da una sola fonte (tag git con <code>hatch-vcs</code>, oppure <code>importlib.metadata.version</code>).</li><li>Dichiara le versioni di Python supportate e testale in una matrice di CI.</li></ul>
<h3>Pubblicare in sicurezza</h3><ol><li>Prova su <b>TestPyPI</b>.</li><li>Usa il <b>trusted publishing</b> (OIDC da GitHub Actions) invece di token a lunga durata.</li><li>Pubblica da una release con tag, in CI, con ambiente protetto.</li></ol>
<h3>Qualità del pacchetto</h3><ul><li>File <code>py.typed</code> per segnalare che il pacchetto è tipizzato.</li><li>Intervalli di versione larghi per le dipendenze di una libreria (nelle applicazioni si fissano).</li><li>Import leggeri in <code>__init__</code>; <code>__all__</code> per l'API pubblica.</li><li>Estensioni native: wheel per Linux, macOS e Windows.</li></ul>
<h3>Distribuzione privata</h3><p>Indice privato (Artifactory, GitLab/GitHub Packages, devpi) o <code>pip install git+https://...@tag</code>. Fissa le versioni e non usare branch non fissati in produzione.</p>
<h3>Trappole</h3><ul><li>PyPI non permette di ricaricare la stessa versione: un tag, un rilascio.</li><li>Segreti nel repo o nei log della CI.</li><li>Dimenticare i file di dati o <code>py.typed</code>.</li><li>Pubblicare da un albero di lavoro sporco.</li></ul>
<div class="say"><b>Cosa dire.</b> «pyproject con backend hatchling, versioni semantiche, build in CI e rilascio su PyPI con trusted publishing.»</div>`,
  [
    q(
      'q1',
      'Cosa è una wheel?',
      ['Un pacchetto precompilato (.whl)', 'Un venv', 'Un formato di test', 'Un lockfile'],
      0,
      'Si installa senza compilare.',
    ),
    q(
      'q2',
      'Perché il trusted publishing?',
      ['È più veloce', 'Evita token a lunga durata usando OIDC', 'Serve per TestPyPI', 'È obbligatorio per i test'],
      1,
      'Meno segreti da custodire.',
    ),
    q(
      'q3',
      'Cosa succede ricaricando la stessa versione su PyPI?',
      ['Sovrascrive', 'È vietato', 'Crea una patch', 'Niente'],
      1,
      'Ogni file di versione è immutabile.',
    ),
    q(
      'q4',
      'Cosa segnala <code>py.typed</code>?',
      ['Che il pacchetto fornisce type hint', 'Che è testato', 'Che è privato', 'Che è async'],
      0,
      'I type checker lo usano per leggere i tipi.',
    ),
    q(
      'q5',
      'Dipendenze in una libreria: fisse o a intervallo?',
      ['Sempre fisse', 'A intervallo', 'Mai dichiarate', 'Solo dev'],
      1,
      'Gli intervalli evitano conflitti per chi installa.',
    ),
  ],
  [
    card('c1', 'Costruire', 'uv build oppure python -m build → dist/.'),
    card('c2', 'Controllare i metadati', 'twine check dist/*.'),
    card('c3', 'Versione', 'SemVer MAJOR.MINOR.PATCH, una fonte (tag git).'),
    card('c4', 'Pubblicare', 'TestPyPI → trusted publishing da GitHub Actions su release.'),
  ],
  [
    prac(
      'p1',
      'Elenca i passi per pubblicare la tua prima libreria.',
      'Layout src, pyproject, test e CI, versione 0.1.0, build e twine check, TestPyPI, tag e release con trusted publishing, README e CHANGELOG.',
    ),
    prac(
      'p2',
      'Perché non fissare le dipendenze in una libreria?',
      "Si bloccherebbe i progetti che la usano su versioni specifiche e creerebbe conflitti; si fissa nell'applicazione con un lockfile.",
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/python-packaging-publishing.md',
)

export const queues = mod(
  'queues',
  'Code di task e lavori in background',
  'Celery, idempotenza, retry, outbox, backpressure',
  'master',
  `<p class="lead">Il lavoro in background (email, report, import, webhook) esce dal percorso della richiesta. Un messaggio può essere consegnato più volte, in ordine sparso: progetta per questo.</p>
<h3>Scegliere lo strumento</h3><div class="tblw"><table><tr><th>Strumento</th><th>Broker</th><th>Adatto a</th></tr>
<tr><td>Celery</td><td>RabbitMQ/Redis</td><td>funzioni ricche, scheduling, routing; standard in Django</td></tr>
<tr><td>RQ</td><td>Redis</td><td>job semplici</td></tr>
<tr><td>arq / Dramatiq</td><td>Redis/RabbitMQ</td><td>leggeri; arq è async</td></tr>
<tr><td>Kafka / Streams</td><td>Kafka/Redis</td><td>log di eventi, replay, alto throughput</td></tr>
<tr><td>Code cloud</td><td>SQS, Pub/Sub</td><td>gestite, nessun broker da operare</td></tr></table></div>
<h3>At-least-once e idempotenza</h3><p>Un worker può crashare dopo aver fatto il lavoro e prima dell'ack: il messaggio torna. Rendi i task <b>idempotenti</b>: eseguirli due volte equivale a una.</p>
<pre><code>@app.task(bind=True, acks_late=True, max_retries=5)
def addebita(self, ordine_id):
    ordine = Ordine.objects.get(pk=ordine_id)
    if ordine.pagato:                       # guardia di idempotenza
        return
    try:
        gateway.addebita(ordine, idempotency_key=f"ordine-{ordine_id}")
    except ErroreTransitorio as e:
        raise self.retry(exc=e, countdown=2 ** self.request.retries)
    ordine.segna_pagato()</code></pre>
<ul><li>Passa <b>ID</b>, non oggetti; ricarica lo stato nel task.</li><li>Chiavi di idempotenza verso le API esterne; vincoli di unicità nel database.</li></ul>
<h3>Retry, backoff, dead letter</h3><ul><li>Ritenta solo gli errori transitori, con backoff esponenziale e jitter, con un massimo di tentativi.</li><li>I messaggi esauriti vanno in una <b>dead-letter queue</b> con allarme.</li><li>Time limit soft e hard: un task bloccato non deve occupare un worker per sempre.</li></ul>
<h3>Accodare dopo il commit; outbox</h3><p>Accodare dentro una transazione che poi fa rollback (o prima del commit) crea task fantasma o mancanti.</p><ul><li>Django: <code>transaction.on_commit(lambda: task.delay(pk))</code>.</li><li>Garanzia più forte: scrivi l'evento in una tabella <b>outbox</b> nella stessa transazione; un relay lo pubblica e lo segna inviato.</li></ul>
<h3>Backpressure e concorrenza</h3><ul><li>Prefetch basso (<code>worker_prefetch_multiplier=1</code>) per task lunghi.</li><li>Code separate per priorità e durata; scala i worker per coda.</li><li>Rate limit verso servizi esterni e limiti sul pool del database.</li></ul>
<h3>Scheduling e osservabilità</h3><ul><li>Celery beat, APScheduler, cron: un solo scheduler attivo; task schedulati idempotenti e tolleranti ai salti.</li><li>Log con task id e correlation id; metriche su profondità, età del messaggio più vecchio, tasso di errori, durata; allarme sull'<b>età</b> della coda.</li></ul>
<div class="say"><b>Cosa dire.</b> «Task piccoli e idempotenti, retry con backoff, accodamento dopo il commit e allarmi sull'età della coda: non assumo mai la consegna esattamente una volta.»</div>`,
  [
    q(
      'q1',
      'Perché i task devono essere idempotenti?',
      ['Per la velocità', 'Perché un messaggio può essere consegnato più volte', 'Per i test', 'Per il logging'],
      1,
      'At-least-once: eseguire due volte deve essere innocuo.',
    ),
    q(
      'q2',
      'Cosa passi come argomento di un task?',
      ["L'oggetto ORM", "L'ID", 'Un blob grande', 'Un file aperto'],
      1,
      'Piccoli argomenti serializzabili; ricarica lo stato nel task.',
    ),
    q(
      'q3',
      "A cosa serve l'outbox?",
      [
        'A garantire la pubblicazione di eventi coerente con la transazione',
        'A velocizzare il broker',
        'A fare cache',
        'A loggare',
      ],
      0,
      "L'evento è scritto nella stessa transazione del dato.",
    ),
    q(
      'q4',
      'Cosa si fa dei messaggi che falliscono sempre?',
      ['Retry infinito', 'Dead-letter queue con allarme', 'Si ignorano', 'Si cancellano subito'],
      1,
      'Si isolano per ispezione.',
    ),
    q(
      'q5',
      'Quale metrica allarmare per prima su una coda?',
      ['Numero di worker', 'Età del messaggio più vecchio', 'CPU del broker', 'Nome della coda'],
      1,
      'Mostra che il lavoro non scorre.',
    ),
  ],
  [
    card('c1', 'Consegna', 'At-least-once: task idempotenti e idempotency key.'),
    card('c2', 'Dopo il commit', 'transaction.on_commit(lambda: task.delay(pk)) o outbox.'),
    card('c3', 'Retry', 'Solo errori transitori, backoff esponenziale con jitter, massimo di tentativi, DLQ.'),
    card('c4', 'Task lunghi', 'worker_prefetch_multiplier=1 e time limit.'),
    card('c5', 'Argomenti', 'ID piccoli e serializzabili, mai oggetti ORM.'),
  ],
  [
    prac(
      'p1',
      "Progetta l'invio di una ricevuta dopo un pagamento in modo affidabile.",
      "Dentro la transazione salvo il pagamento e un evento in outbox (o on_commit); un task idempotente invia l'email con chiave di idempotenza; retry con backoff; DLQ e allarme.",
    ),
    prac(
      'p2',
      'La coda cresce: come indaghi?',
      'Controllo età e profondità, throughput dei worker, task lenti o bloccati, limiti di prefetch, dipendenze esterne lente; scalo i worker o separo le code per durata.',
    ),
  ],
  'Note del vault: python/python-task-queue-patterns.md, celery/tasks.md, rabbitmq/rabbitmq-reliability-and-retry.md',
)
