import { card, mod, prac } from '../kit'

// Group "finale": capstone projects, interview questions, quick reference, extra drills.

export const capstone = mod(
  'capstone',
  'Tre mini-progetti per consolidare',
  'CLI, API con database, scraper asincrono: specifica e traccia',
  'finale',
  `<p class="lead">Si impara a programmare programmando. Questi tre progetti usano quasi tutto il percorso. Falli dal foglio bianco, senza copiare; poi confronta con la traccia nella sezione Practice.</p>
<h3>Progetto 1: CLI per tracciare le spese (basi, file, errori, test)</h3><ul><li><code>spese add 12.50 "caffè" --cat cibo</code>, <code>spese list --mese 2026-11</code>, <code>spese totale --cat cibo</code>.</li><li>Dati in un file JSON o in SQLite; <code>argparse</code> con sottocomandi; <code>Decimal</code> per gli importi.</li><li>Errori chiari (importo non valido, file corrotto) e codici di uscita.</li><li>Test con pytest, <code>tmp_path</code> e parametrizzazione. Pacchetto con <code>pyproject.toml</code>.</li></ul>
<h3>Progetto 2: API di task con FastAPI e SQLAlchemy (backend)</h3><ul><li>CRUD di <code>/tasks</code>, filtri per stato, paginazione, ordinamento.</li><li>Modelli Pydantic separati (in/out), sessione per richiesta con <code>Depends</code>, migrazioni Alembic.</li><li>Autenticazione con token, hash delle password, test con <code>TestClient</code> e database di test.</li><li>Log strutturati, configurazione da ambiente, <code>Dockerfile</code> e CI con ruff, mypy, pytest.</li></ul>
<h3>Progetto 3: scraper asincrono con coda e limiti (async, patterns)</h3><ul><li>Scarica N pagine con <code>httpx.AsyncClient</code>, <code>Semaphore</code>, timeout e retry con backoff.</li><li>Produttori e consumatori con <code>asyncio.Queue(maxsize)</code>; salva i risultati in SQLite o JSON lines.</li><li>Rispetta <code>robots.txt</code> e metti un ritardo educato; gestisci la cancellazione (<code>Ctrl+C</code>) chiudendo bene le risorse.</li><li>Misura con e senza concorrenza e racconta la differenza.</li></ul>
<h3>Come lavorare</h3><ol><li>Scrivi prima le <b>specifiche</b> e 3-5 test che le descrivono.</li><li>Fai la versione più semplice che funziona, poi migliora.</li><li>Fai girare <code>ruff</code> e <code>mypy</code> a ogni passo.</li><li>Scrivi un README: cosa fa, come si installa, come si testa.</li><li>Rileggi dopo un giorno e semplifica.</li></ol>
<div class="say"><b>Obiettivo.</b> Avere tre repository piccoli ma curati da mostrare e da raccontare a voce.</div>`,
  [],
  [
    card('c1', 'Ordine di lavoro', 'Specifiche → test → versione semplice → refactor → README.'),
    card('c2', 'Controlli minimi', 'ruff check, ruff format, mypy, pytest.'),
    card('c3', 'Struttura', 'src/ layout, pyproject.toml, tests/ accanto, README.'),
    card('c4', 'Scraper educato', 'Semaphore, timeout, retry con backoff, ritardo, robots.txt.'),
  ],
  [
    prac(
      'p1',
      'Schema della CLI spese: come organizzi il codice?',
      'Pacchetto con cli.py (argparse e dispatch), repo.py (lettura/scrittura), modelli.py (dataclass Spesa), servizio.py (logica); test su servizio e repo con tmp_path.',
    ),
    prac(
      'p2',
      "Schema dell'API task: tabelle, rotte e modelli.",
      'Tabella tasks (id, titolo, stato, creato_il, utente_id); TaskIn/TaskOut; GET /tasks?stato=&limit=&cursor=, POST, GET/PATCH/DELETE /tasks/{id}; dipendenza get_session; Alembic per le migrazioni.',
    ),
    prac(
      'p3',
      'Come strutturi lo scraper con una coda?',
      'N consumatori (task) leggono da Queue(maxsize), un produttore inserisce gli URL; Semaphore per le richieste; TaskGroup per la vita dei task; sentinella o join() per terminare.',
    ),
  ],
)

export const interview = mod(
  'interview',
  'Domande da colloquio su Python',
  '30 domande con risposta breve da dire a voce',
  'finale',
  `<p class="lead">Domande tipiche per ruoli backend/full stack con Python. Rispondi a voce in 30-60 secondi, poi confronta con la traccia. Se la risposta contiene un esempio concreto, vale il doppio.</p>
<h3>Come rispondere</h3><ul><li>Una frase di definizione, un perché, un esempio, una trappola.</li><li>Se non sai, ragiona a voce: mostra il metodo.</li><li>Collega sempre al lavoro vero («l'ho visto in…», «lo userei per…»).</li></ul>
<h3>Aree</h3><ul><li>Linguaggio: mutabilità, scope, generatori, decorator, GIL.</li><li>Oggetti: dunder, ereditarietà, dataclass.</li><li>Concorrenza: asyncio, thread, processi.</li><li>Pratica: test, tipi, packaging, prestazioni, sicurezza.</li></ul>`,
  [],
  [
    card(
      'c1',
      'Differenza tra lista e tupla',
      'Lista mutabile, tupla immutabile e hashable (se i contenuti lo sono): usabile come chiave di dict.',
    ),
    card(
      'c2',
      "Cos'è il GIL",
      "Lock che fa eseguire bytecode a un thread alla volta; limita il calcolo parallelo con i thread, non l'I/O.",
    ),
    card('c3', 'is vs ==', 'is: stessa identità; ==: stesso valore.'),
    card('c4', "Cos'è un generatore", 'Funzione con yield che produce valori uno alla volta, lazy e monouso.'),
    card(
      'c5',
      "Cos'è un decorator",
      'Funzione che riceve una funzione e ne restituisce una nuova; @ è zucchero sintattico.',
    ),
  ],
  [
    prac(
      'i1',
      "Che differenza c'è tra lista e tupla?",
      'La lista è mutabile, la tupla no. La tupla è hashable se contiene solo hashable (chiave di dict) e comunica "record fisso". Entrambe sono sequenze ordinate.',
    ),
    prac(
      'i2',
      "Cos'è il GIL e che impatto ha?",
      "Il Global Interpreter Lock: un solo thread esegue bytecode alla volta. I thread non accelerano il calcolo; vanno bene per l'I/O. Per la CPU: multiprocessing o estensioni in C.",
    ),
    prac(
      'i3',
      'Come funziona la gestione della memoria?',
      "Reference counting più GC ciclico a generazioni; gli oggetti sono sull'heap; weakref per riferimenti che non li tengono in vita.",
    ),
    prac(
      'i4',
      'Differenza tra <code>is</code> e <code>==</code>?',
      "is controlla l'identità dell'oggetto, == il valore tramite __eq__. is solo per None e singleton.",
    ),
    prac(
      'i5',
      'Perché i default mutabili sono pericolosi?',
      'Il default è creato una sola volta alla definizione: tutte le chiamate condividono lo stesso oggetto. Si usa None e si crea dentro.',
    ),
    prac(
      'i6',
      'Cosa sono *args e **kwargs?',
      'Raccolgono argomenti posizionali extra (tupla) e per nome (dict); si usano anche per spacchettare chiamate.',
    ),
    prac(
      'i7',
      "Cos'è un decorator? Scrivine uno.",
      'Funzione che avvolge una funzione. Esempio: timer con functools.wraps che misura perf_counter prima e dopo la chiamata.',
    ),
    prac(
      'i8',
      'Generatore contro lista?',
      'Il generatore produce un elemento per volta (memoria costante, lazy, monouso); la lista li tiene tutti (accesso casuale, riutilizzabile).',
    ),
    prac(
      'i9',
      "Cos'è un context manager?",
      'Oggetto con __enter__/__exit__ usato con with, che garantisce setup e cleanup anche con eccezioni; si scrive anche con @contextmanager.',
    ),
    prac(
      'i10',
      "Come funziona l'ereditarietà multipla?",
      "Con l'MRO (C3): ordine lineare di ricerca; super() va al prossimo nell'MRO. Si usa per le mixin; evita gerarchie complicate.",
    ),
    prac(
      'i11',
      'Cosa sono i metodi dunder?',
      "Hook del data model: __init__, __repr__, __eq__, __len__, __iter__, __enter__... L'interprete li chiama per sintassi e funzioni built-in.",
    ),
    prac(
      'i12',
      'dataclass o classe normale?',
      'Dataclass per dati con poca logica (init, repr, eq gratis; frozen/slots); classe normale per comportamento e stato complesso.',
    ),
    prac(
      'i13',
      'Differenza tra @staticmethod e @classmethod?',
      'classmethod riceve cls (costruttori alternativi, funziona con le sottoclassi); staticmethod non riceve nulla ed è una funzione raggruppata.',
    ),
    prac(
      'i14',
      'Come gestisci le eccezioni?',
      'Specifiche, nel punto in cui so cosa fare; raise from per la causa; finally/with per la pulizia; log una sola volta al confine.',
    ),
    prac(
      'i15',
      'asyncio contro thread?',
      'asyncio: un thread, concorrenza cooperativa con await, scala su molte connessioni. Thread: preemptive ma con il GIL; utile con librerie bloccanti.',
    ),
    prac(
      'i16',
      "Come eviti di bloccare l'event loop?",
      'Niente time.sleep o librerie sincrone dentro le coroutine; asyncio.to_thread per il codice bloccante; client async.',
    ),
    prac(
      'i17',
      'Come testi codice con rete o database?',
      'Mock ai confini o servizi finti; fixture per un database di test; test di integrazione separati e pochi; niente rete nei test unitari.',
    ),
    prac(
      'i18',
      'Cosa sono i type hint e a cosa servono?',
      'Annotazioni non verificate a runtime; usate da editor, mypy/pyright e da librerie come Pydantic/FastAPI per documentazione e validazione.',
    ),
    prac(
      'i19',
      'Come gestisci le dipendenze di un progetto?',
      'venv per progetto, pyproject.toml, lockfile (uv/poetry/pip-tools), versioni fissate in CI, aggiornamenti regolari con audit.',
    ),
    prac(
      'i20',
      'Come scegli tra Django, Flask e FastAPI?',
      'Django per applicazioni complete (ORM, admin, auth); Flask minimale e flessibile; FastAPI per API tipizzate e asincrone con documentazione automatica.',
    ),
    prac(
      'i21',
      "Che cos'è l'N+1 e come lo risolvi?",
      'Una query per ogni elemento invece di una sola. Eager loading (selectinload/joinedload), join o query in batch.',
    ),
    prac(
      'i22',
      'Come ottimizzi un codice lento?',
      "Misuro con un profiler, trovo il punto caldo, miglioro l'algoritmo o la struttura dati, poi cache/vettorizzazione/concorrenza; rimisuro.",
    ),
    prac(
      'i23',
      "Come proteggi un'API?",
      "Autenticazione e autorizzazione, validazione dell'input, query parametrizzate, rate limit, HTTPS, segreti fuori dal codice, log senza dati sensibili.",
    ),
    prac(
      'i24',
      'Come gestisci la configurazione?',
      "Variabili d'ambiente, validate all'avvio con pydantic-settings; segreti in un secret manager; niente configurazione nel codice.",
    ),
    prac(
      'i25',
      'Cosa sono le comprehension e quando evitarle?',
      'Sintassi compatta per liste, dict, set; evitale se annidate su più livelli o con effetti collaterali: meglio un ciclo.',
    ),
    prac(
      'i26',
      'Differenza tra copia superficiale e profonda?',
      'La superficiale copia il contenitore ma condivide gli oggetti interni; deepcopy copia ricorsivamente.',
    ),
    prac(
      'i27',
      "Come funziona l'import?",
      'Cerca in sys.modules, poi sys.path; esegue il modulo una volta e lo mette in cache; i cicli vedono moduli a metà.',
    ),
    prac(
      'i28',
      'Cosa sono Protocol e ABC?',
      'ABC: contratto nominale che richiede ereditarietà. Protocol: contratto strutturale per i type checker (duck typing tipizzato).',
    ),
    prac(
      'i29',
      'Come strutturi un progetto Python?',
      'Layout src/, pyproject.toml, tests/, pacchetti con __init__, moduli piccoli con una responsabilità, strumenti (ruff, mypy, pytest) in CI.',
    ),
    prac(
      'i30',
      'Cosa è cambiato di recente in Python?',
      'match/case, unioni con |, TaskGroup, except*, nuova sintassi dei generici, interprete più veloce, build free-threaded sperimentale in 3.13 e supportata (opzionale) da 3.14.',
    ),
  ],
)

export const drills2 = mod(
  'drills2',
  'Altri 15 esercizi: dati, stringhe, oggetti',
  'Secondo giro di allenamento, più vicino ai colloqui',
  'finale',
  `<p class="lead">Secondo set di esercizi. Stessa regola: scrivi prima, poi controlla. Per ognuno dichiara la <b>complessità</b> e almeno un caso limite.</p>
<ul><li>Pensa ai casi limite: input vuoto, un elemento, duplicati, valori negativi, Unicode.</li><li>Poi riscrivi con una libreria standard (<code>Counter</code>, <code>heapq</code>, <code>itertools</code>).</li><li>Aggiungi i test in pytest per 3 casi.</li></ul>`,
  [],
  [
    card('c1', 'Top-K frequenti', 'Counter(xs).most_common(k).'),
    card(
      'c2',
      'Appiattire annidamenti',
      'ricorsione con yield from, oppure itertools.chain.from_iterable per un solo livello.',
    ),
    card('c3', 'Finestra scorrevole', 'deque(maxlen=n) o due indici.'),
    card('c4', 'Ordinamento personalizzato', 'sorted(xs, key=lambda x: (x.a, -x.b)).'),
  ],
  [
    prac(
      'e1',
      'Comprimi una stringa: "aaabbc" → "a3b2c1".',
      '<pre><code>from itertools import groupby\n\ndef comprimi(s):\n    return "".join(f"{k}{len(list(g))}" for k, g in groupby(s))</code></pre>',
    ),
    prac(
      'e2',
      'Il sottostringa più lunga senza ripetizioni.',
      "Finestra scorrevole con dict carattere→ultimo indice: se c è nella finestra, sposta l'inizio. O(n).",
    ),
    prac(
      'e3',
      'Verifica che un albero binario sia un BST.',
      'Ricorsione con limiti (min, max) per ogni nodo; o attraversamento in-order crescente.',
    ),
    prac(
      'e4',
      'Unisci intervalli sovrapposti.',
      "Ordina per inizio; scorri e unisci se inizio ≤ fine dell'ultimo. O(n log n).",
    ),
    prac(
      'e5',
      'K elementi più vicini a un valore in una lista.',
      '<pre><code>import heapq\n\nvicini = heapq.nsmallest(k, xs, key=lambda x: abs(x - v))</code></pre>',
    ),
    prac(
      'e6',
      'Rimuovi duplicati da una lista di dict per una chiave.',
      'visti = set(); [d for d in lista if (k := d["id"]) not in visti and not visti.add(k)] oppure {d["id"]: d for d in lista}.values() (attenzione: quest\'ultimo tiene l\'ULTIMO elemento per id, non il primo).',
    ),
    prac(
      'e7',
      'Implementa una pila con min() in O(1).',
      '<pre><code>class PilaMin:\n    def __init__(self):\n        self.v, self.m = [], []\n    def push(self, x):\n        self.v.append(x)\n        self.m.append(min(x, self.m[-1]) if self.m else x)\n    def pop(self):\n        self.m.pop()\n        return self.v.pop()\n    def min(self):\n        return self.m[-1]</code></pre>',
    ),
    prac(
      'e8',
      'Cache LRU con decorator.',
      'functools.lru_cache(maxsize=N) oppure OrderedDict con move_to_end e popitem(last=False).',
    ),
    prac(
      'e9',
      'Scrivi un iteratore che produce numeri primi.',
      '<pre><code>def primi():\n    trovati = []\n    n = 2\n    while True:\n        if all(n % p for p in trovati if p * p &lt;= n):\n            trovati.append(n)\n            yield n\n        n += 1</code></pre>',
    ),
    prac(
      'e10',
      'Converti un numero romano in intero.',
      '<pre><code>def romano(s):\n    v = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    tot = 0\n    for a, b in zip(s, s[1:] + " "):\n        tot += -v[a] if b != " " and v[a] &lt; v[b] else v[a]\n    return tot</code></pre>',
    ),
    prac(
      'e11',
      'Rate limiter a finestra: max N richieste in T secondi.',
      '<pre><code>from collections import deque\nimport time\n\nclass RateLimiter:\n    def __init__(self, n, t):\n        self.n, self.t, self.q = n, t, deque()\n    def ok(self):\n        ora = time.monotonic()\n        while self.q and ora - self.q[0] &gt; self.t:\n            self.q.popleft()\n        if len(self.q) &lt; self.n:\n            self.q.append(ora)\n            return True\n        return False</code></pre>',
    ),
    prac(
      'e12',
      'Parser di query string "a=1&b=2" in dict.',
      '<pre><code>from urllib.parse import parse_qs\n\ndati = {k: v[0] for k, v in parse_qs("a=1&amp;b=2").items()}</code></pre>',
    ),
    prac(
      'e13',
      'Dataclass immutabile per un Punto con distanza.',
      '<pre><code>import math\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Punto:\n    x: float\n    y: float\n    def dist(self, o):\n        return math.hypot(self.x - o.x, self.y - o.y)</code></pre>',
    ),
    prac(
      'e14',
      'Context manager che cambia directory e ripristina.',
      '<pre><code>import os\nfrom contextlib import contextmanager\n\n@contextmanager\ndef cd(p):\n    vecchio = os.getcwd()\n    os.chdir(p)\n    try:\n        yield\n    finally:\n        os.chdir(vecchio)</code></pre>',
    ),
    prac(
      'e15',
      'Scarica 100 URL con concorrenza massima 10.',
      '<pre><code>import asyncio, httpx\n\nasync def scarica_tutti(urls):\n    sem = asyncio.Semaphore(10)\n    async with httpx.AsyncClient(timeout=10) as client:\n        async def uno(u):\n            async with sem:\n                return await client.get(u)\n        return await asyncio.gather(*(uno(u) for u in urls), return_exceptions=True)</code></pre>',
    ),
  ],
)
