import { card, mod, prac, q } from './python-path.helpers'

// Groups "backend" and "finale".

export const testing = mod(
  'testing',
  'Test con pytest',
  'assert, fixture, parametrize, mock, struttura dei test',
  'backend',
  `<p class="lead">pytest è lo standard: funzioni semplici, <code>assert</code> normali e messaggi di errore chiari.</p>
<pre><code># tests/test_prezzi.py
import pytest
from app.prezzi import scontato

def test_sconto_base():
    assert scontato(100, 10) == 90

def test_sconto_negativo_solleva():
    with pytest.raises(ValueError):
        scontato(100, -5)

@pytest.mark.parametrize("prezzo,pct,atteso", [(100, 0, 100), (100, 50, 50), (80, 25, 60)])
def test_tabella(prezzo, pct, atteso):
    assert scontato(prezzo, pct) == atteso</code></pre>
<h3>Fixture</h3><pre><code>@pytest.fixture
def db(tmp_path):
    conn = sqlite3.connect(tmp_path / "t.db")
    conn.execute("create table u (id integer, nome text)")
    yield conn            # il test gira qui
    conn.close()          # cleanup

def test_inserimento(db):
    db.execute("insert into u values (1, 'Ada')")
    assert db.execute("select count(*) from u").fetchone()[0] == 1</code></pre>
<h3>Mock</h3><pre><code>from unittest.mock import patch

def test_chiamata_esterna():
    with patch("app.client.requests.get") as get:
        get.return_value.json.return_value = {"ok": True}
        assert verifica() is True</code></pre>
<ul><li>Lancia con <code>pytest -q</code>, un solo test con <code>pytest -k nome</code>, il primo fallimento con <code>-x</code>.</li><li>I file si chiamano <code>test_*.py</code> e le funzioni <code>test_*</code>.</li><li>Il mock sostituisce dove una cosa è <b>usata</b>, non dove è definita.</li></ul>
<div class="say"><b>Cosa dire.</b> «Test piccoli con pytest, fixture per le risorse e mock solo ai confini (rete, tempo).»</div>`,
  [
    q(
      'q1',
      "Come si verifica che venga sollevata un'eccezione?",
      ['assert raises', 'with pytest.raises(Errore):', 'try senza except', 'expect(Errore)'],
      1,
      'pytest.raises è il context manager dedicato.',
    ),
    q(
      'q2',
      'A cosa serve <code>parametrize</code>?',
      ['A lanciare lo stesso test con più input', 'A mockare', 'A saltare test', 'A misurare il tempo'],
      0,
      'Genera un caso per ogni riga della tabella.',
    ),
    q(
      'q3',
      'Cosa fa <code>yield</code> in una fixture?',
      ['Fa girare il test e poi il cleanup', 'Interrompe pytest', 'Ripete il test', 'Niente'],
      0,
      'Il codice dopo yield è il teardown.',
    ),
    q(
      'q4',
      'Dove si applica <code>patch</code>?',
      ["Dove l'oggetto è definito", "Dove l'oggetto è usato", 'Ovunque uguale', 'Solo nei test'],
      1,
      'Si patcha il nome nel modulo che lo importa.',
    ),
  ],
  [
    card('c1', 'Eseguire i test', 'pytest -q; -k parola per filtrare; -x per fermarsi al primo errore.'),
    card('c2', 'Test con tabella', '@pytest.mark.parametrize("a,b", [(1, 2), (3, 4)]).'),
    card('c3', 'Fixture con cleanup', '@pytest.fixture e yield: dopo lo yield si pulisce.'),
    card('c4', 'File temporanei', 'Fixture integrata tmp_path.'),
  ],
  [
    prac(
      'p1',
      "Scrivi i test per una funzione che valida un'email.",
      'parametrize con casi validi e non validi, più un test con pytest.raises se solleva ValueError.',
    ),
    prac(
      'p2',
      "Come testi codice che chiama un'API esterna?",
      'Mock del client (o servizio finto) ai confini; nessuna rete reale nei test unitari.',
    ),
  ],
)

export const concurrency = mod(
  'concurrency',
  'Concorrenza: GIL, thread, processi e asyncio',
  "quando usare cosa; async/await per l'I/O",
  'backend',
  `<p class="lead">Python offre tre modelli. La scelta dipende dal tipo di lavoro: <b>I/O-bound</b> (rete, disco) o <b>CPU-bound</b> (calcolo).</p>
<div class="tblw"><table><tr><th>Modello</th><th>Va bene per</th><th>Nota</th></tr>
<tr><td><code>asyncio</code></td><td>molte connessioni I/O</td><td>un solo thread, event loop come Node</td></tr>
<tr><td><code>threading</code></td><td>I/O con librerie bloccanti</td><td>il GIL limita il calcolo</td></tr>
<tr><td><code>multiprocessing</code></td><td>CPU-bound</td><td>processi separati, nessun GIL condiviso</td></tr></table></div>
<h3>Il GIL</h3><p>Il <b>Global Interpreter Lock</b> di CPython lascia eseguire un solo thread di bytecode alla volta. Per il calcolo i thread non danno parallelismo; per l'I/O sì, perché il lock è rilasciato in attesa.</p>
<h3>asyncio</h3><pre><code>import asyncio, httpx

async def scarica(client, url):
    r = await client.get(url)
    return r.status_code

async def main():
    urls = ["https://a.it", "https://b.it", "https://c.it"]
    async with httpx.AsyncClient() as client:
        risultati = await asyncio.gather(*(scarica(client, u) for u in urls))
    print(risultati)

asyncio.run(main())</code></pre>
<ul><li><code>await</code> cede il controllo mentre aspetta; non bloccare mai l'event loop con codice sincrono lungo (<code>time.sleep</code>, richieste con <code>requests</code>).</li><li>Se devi chiamare codice bloccante: <code>await asyncio.to_thread(fn)</code>.</li></ul>
<h3>Pool</h3><pre><code>from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

with ThreadPoolExecutor(8) as pool:
    esiti = list(pool.map(scarica_sync, urls))      # I/O

with ProcessPoolExecutor() as pool:
    esiti = list(pool.map(calcolo_pesante, dati))   # CPU</code></pre>
<div class="say"><b>Cosa dire.</b> «Async per tante connessioni I/O, processi per il calcolo; il GIL è il motivo per cui i thread non accelerano la CPU.»</div>`,
  [
    q(
      'q1',
      'Cosa limita il GIL?',
      ['Un solo thread esegue bytecode alla volta', 'La memoria', 'Le connessioni di rete', 'I processi'],
      0,
      'Per il lavoro CPU-bound servono più processi.',
    ),
    q(
      'q2',
      'Per 1000 richieste HTTP in parallelo scegli…',
      ['multiprocessing', 'asyncio con un client async', 'un ciclo for', 'thread per ogni richiesta e basta'],
      1,
      'È lavoro I/O-bound: asyncio scala bene.',
    ),
    q(
      'q3',
      'Cosa succede chiamando <code>time.sleep(5)</code> dentro una coroutine?',
      ['Cede il controllo', "Blocca l'intero event loop", 'Niente', 'Errore'],
      1,
      'Serve await asyncio.sleep(5).',
    ),
    q(
      'q4',
      'Come fai girare codice sincrono bloccante senza fermare il loop?',
      ['asyncio.to_thread', 'while True', 'gather', 'Non si può'],
      0,
      'Lo sposta su un thread di un pool.',
    ),
  ],
  [
    card('c1', 'Lanciare più coroutine', 'await asyncio.gather(a(), b()).'),
    card('c2', 'CPU-bound', 'multiprocessing / ProcessPoolExecutor.'),
    card('c3', 'I/O-bound', 'asyncio o ThreadPoolExecutor.'),
    card('c4', "Avviare l'event loop", 'asyncio.run(main()).'),
  ],
  [
    prac(
      'p1',
      'Un endpoint deve chiamare 5 servizi e aggregare le risposte: come lo scrivi?',
      'async def con httpx.AsyncClient e asyncio.gather sulle 5 chiamate, con timeout; gestisci gli errori per chiamata.',
    ),
    prac(
      'p2',
      'Spiega a voce asyncio vs thread a un collega Node.',
      "asyncio è l'event loop di Node: un thread, cooperativo con await. I thread sono preemptive ma il GIL limita il calcolo.",
    ),
  ],
)

export const web = mod(
  'web',
  'API web: HTTP, Pydantic e FastAPI',
  'requests/httpx, validazione, endpoint, dependency injection',
  'backend',
  `<p class="lead">Per un backend moderno: <b>FastAPI</b> + <b>Pydantic</b>. Gli hint di tipo diventano validazione, serializzazione e documentazione OpenAPI automatica.</p>
<h3>Client HTTP</h3><pre><code>import httpx

r = httpx.get("https://api.esempio.it/utenti", params={"q": "ada"}, timeout=10)
r.raise_for_status()
dati = r.json()</code></pre>
<h3>Modelli Pydantic</h3><pre><code>from pydantic import BaseModel, Field

class UtenteIn(BaseModel):
    nome: str = Field(min_length=2)
    eta: int = Field(ge=0, le=120)

class UtenteOut(UtenteIn):
    id: int</code></pre><p>Dati non validi sollevano <code>ValidationError</code> con il dettaglio dei campi.</p>
<h3>FastAPI</h3><pre><code>from fastapi import FastAPI, HTTPException, Depends

app = FastAPI()
UTENTI: dict[int, UtenteOut] = {}

@app.post("/utenti", response_model=UtenteOut, status_code=201)
def crea(u: UtenteIn):
    nuovo = UtenteOut(id=len(UTENTI) + 1, **u.model_dump())
    UTENTI[nuovo.id] = nuovo
    return nuovo

@app.get("/utenti/{uid}", response_model=UtenteOut)
def leggi(uid: int):
    if uid not in UTENTI:
        raise HTTPException(404, "non trovato")
    return UTENTI[uid]</code></pre>
<pre><code>pip install fastapi uvicorn
uvicorn app.main:app --reload     # docs su /docs</code></pre>
<h3>Dependency injection</h3><pre><code>def get_db():
    db = connetti()
    try:
        yield db
    finally:
        db.close()

@app.get("/n")
def conta(db = Depends(get_db)):
    return db.count()</code></pre>
<ul><li>Funzioni <code>def</code> girano in un pool di thread; <code>async def</code> sull'event loop (usa librerie async dentro).</li><li>Alternative: <b>Flask</b> (minimale, sincrono) e <b>Django</b> (completo: ORM, admin, auth).</li></ul>
<div class="say"><b>Cosa dire.</b> «FastAPI e Pydantic: il tipo è lo schema, quindi validazione e documentazione senza codice in più.»</div>`,
  [
    q(
      'q1',
      'Cosa fa Pydantic?',
      [
        'Valida e converte i dati secondo i tipi dichiarati',
        'Fa il routing HTTP',
        'Gestisce il database',
        'Compila Python',
      ],
      0,
      'Un BaseModel valida i campi e solleva ValidationError.',
    ),
    q(
      'q2',
      'Dove trovi la documentazione automatica in FastAPI?',
      ['/docs', '/api', '/help', "Non c'è"],
      0,
      'Swagger UI su /docs e ReDoc su /redoc.',
    ),
    q(
      'q3',
      'Come restituisci un 404?',
      ['return 404', 'raise HTTPException(404, ...)', 'sys.exit(404)', 'print'],
      1,
      'HTTPException viene tradotta in risposta HTTP.',
    ),
    q(
      'q4',
      'A cosa serve <code>Depends</code>?',
      [
        'A iniettare dipendenze (es. la connessione al db) negli endpoint',
        'A installare pacchetti',
        'A validare i modelli',
        'A fare test',
      ],
      0,
      'È la dependency injection di FastAPI.',
    ),
  ],
  [
    card('c1', 'Avviare FastAPI', 'uvicorn modulo:app --reload.'),
    card('c2', 'Vincoli di campo', 'Field(min_length=2, ge=0, le=120).'),
    card('c3', 'Schema di risposta', '@app.get(..., response_model=Modello).'),
    card('c4', 'Modello a dict', 'modello.model_dump().'),
  ],
  [
    prac(
      'p1',
      'Progetta un CRUD per "task" con FastAPI: rotte e modelli.',
      'TaskIn/TaskOut; POST /tasks (201), GET /tasks, GET/PUT/DELETE /tasks/{id} con 404; storage dietro una dipendenza.',
    ),
    prac(
      'p2',
      'Quando Django invece di FastAPI?',
      'Quando servono ORM, admin, auth e form pronti (app tradizionali); FastAPI per API leggere e tipizzate.',
    ),
  ],
)

export const database = mod(
  'database',
  'Database: sqlite3, SQLAlchemy e migrazioni',
  'query parametrizzate, transazioni, ORM, Alembic',
  'backend',
  `<p class="lead">Parti da <code>sqlite3</code> (incluso) per capire i concetti, poi passa a SQLAlchemy con Postgres.</p>
<h3>sqlite3</h3><pre><code>import sqlite3

conn = sqlite3.connect("app.db")
conn.row_factory = sqlite3.Row
with conn:                                   # transazione: commit o rollback
    conn.execute("create table if not exists u (id integer primary key, nome text)")
    conn.execute("insert into u (nome) values (?)", ("Ada",))
for r in conn.execute("select * from u where nome = ?", ("Ada",)):
    print(r["id"], r["nome"])</code></pre>
<p><b>Mai</b> costruire la query con f-string: usa i parametri (<code>?</code> o <code>%s</code>) contro la SQL injection.</p>
<h3>SQLAlchemy 2.x</h3><pre><code>from sqlalchemy import create_engine, select, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

class Base(DeclarativeBase): pass

class Utente(Base):
    __tablename__ = "utenti"
    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(50))

engine = create_engine("postgresql+psycopg://u:p@localhost/db")
Base.metadata.create_all(engine)

with Session(engine) as s:
    s.add(Utente(nome="Ada"))
    s.commit()
    ada = s.scalars(select(Utente).where(Utente.nome == "Ada")).first()</code></pre>
<h3>Migrazioni</h3><ul><li><b>Alembic</b> versiona lo schema: <code>alembic revision --autogenerate</code> poi <code>alembic upgrade head</code>.</li><li>Non usare <code>create_all</code> in produzione al posto delle migrazioni.</li></ul>
<h3>Problemi tipici</h3><ul><li><b>N+1 query</b>: caricare le relazioni in un ciclo. Si risolve con <code>selectinload</code>/<code>joinedload</code>.</li><li>Pool di connessioni: una sessione per richiesta, chiusa sempre.</li></ul>
<div class="say"><b>Cosa dire.</b> «Query parametrizzate, una sessione per richiesta e migrazioni con Alembic; occhio all'N+1.»</div>`,
  [
    q(
      'q1',
      'Come eviti la SQL injection?',
      ['Query parametrizzate', 'f-string con escape manuale', "Lowercase dell'input", 'Solo ORM'],
      0,
      'I parametri separano codice SQL e dati.',
    ),
    q(
      'q2',
      'A cosa serve Alembic?',
      ['A versionare lo schema con migrazioni', 'A fare test', 'A validare dati', 'A scrivere API'],
      0,
      'Genera e applica migrazioni incrementali.',
    ),
    q(
      'q3',
      'Cosa è il problema N+1?',
      [
        'Una query per ogni elemento invece di una sola per tutti',
        'Troppe connessioni',
        'Un indice mancante',
        'Un deadlock',
      ],
      0,
      'Si risolve con eager loading o join.',
    ),
    q(
      'q4',
      'Cosa fa <code>with conn:</code> in sqlite3?',
      ['Gestisce la transazione (commit o rollback)', 'Chiude la connessione', 'Crea il file', 'Niente'],
      0,
      "Commit in uscita normale, rollback se c'è un'eccezione. Non chiude la connessione.",
    ),
  ],
  [
    card('c1', 'Query sicura', 'execute("... where id = ?", (id,)): parametri separati.'),
    card('c2', 'Sessione SQLAlchemy', 'with Session(engine) as s: ... s.commit().'),
    card('c3', 'Migrazione', 'alembic revision --autogenerate; alembic upgrade head.'),
    card('c4', 'Evitare N+1', 'selectinload / joinedload sulle relazioni.'),
  ],
  [
    prac(
      'p1',
      'Modella utenti e ordini (uno a molti) con SQLAlchemy.',
      'Utente con relationship("Ordine"), Ordine con ForeignKey("utenti.id"); caricamento con selectinload.',
    ),
    prac(
      'p2',
      'Come gestisci una modifica di schema in produzione?',
      'Migrazione Alembic reversibile, applicata prima del deploy, retrocompatibile col codice precedente.',
    ),
  ],
)

export const tooling = mod(
  'tooling',
  'Pacchetti, qualità del codice e deploy',
  'pyproject.toml, uv/pip, ruff, mypy, pre-commit, Docker',
  'backend',
  `<p class="lead">Un progetto Python ben tenuto ha dipendenze fissate, formattazione automatica e test in CI.</p>
<h3>pyproject.toml</h3><pre><code>[project]
name = "mioapp"
version = "0.1.0"
requires-python = "&gt;=3.11"
dependencies = ["fastapi", "httpx", "sqlalchemy&gt;=2"]

[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy"]</code></pre>
<ul><li><code>pip install -e ".[dev]"</code> installa il progetto in modalità sviluppo.</li><li><b>uv</b> (veloce) e <b>poetry</b> gestiscono venv, dipendenze e lockfile: <code>uv add httpx</code>, <code>uv run pytest</code>.</li><li>Il <b>lockfile</b> garantisce le stesse versioni ovunque.</li></ul>
<h3>Qualità</h3><pre><code>ruff check .          # lint
ruff format .         # formattazione
mypy src/             # tipi
pytest -q             # test</code></pre>
<h3>Docker</h3><pre><code>FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .
COPY src ./src
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8080"]</code></pre>
<ul><li>Configurazione da variabili d'ambiente (<code>os.environ</code> o <code>pydantic-settings</code>), mai segreti nel codice.</li><li>In CI: installa, lint, tipi, test, build dell'immagine.</li></ul>
<div class="say"><b>Cosa dire.</b> «pyproject con lockfile, ruff e mypy in CI, immagine Docker slim e configurazione da env.»</div>`,
  [
    q(
      'q1',
      'Quale file dichiara dipendenze e metadati moderni di un progetto?',
      ['setup.cfg soltanto', 'pyproject.toml', 'package.json', 'Makefile'],
      1,
      'pyproject.toml è lo standard (PEP 621).',
    ),
    q(
      'q2',
      'A cosa serve un lockfile?',
      ['A bloccare file', 'A fissare le versioni esatte delle dipendenze', 'A criptare', 'A velocizzare Python'],
      1,
      'Build riproducibili.',
    ),
    q(
      'q3',
      'Cosa fa <code>ruff</code>?',
      ['Lint e formattazione veloci', 'Test', 'Deploy', 'Profiling'],
      0,
      'Sostituisce flake8, isort e black per molti casi.',
    ),
    q(
      'q4',
      'Dove vanno i segreti?',
      ['Nel codice', "In variabili d'ambiente o secret manager", 'Nel README', 'Nei test'],
      1,
      'Mai nel repository.',
    ),
  ],
  [
    card('c1', 'Installare in dev', 'pip install -e ".[dev]".'),
    card('c2', 'Lint e formato', 'ruff check . e ruff format .'),
    card('c3', 'Immagine leggera', 'python:3.12-slim e pip install --no-cache-dir.'),
    card('c4', 'Configurazione', "Variabili d'ambiente (os.environ, pydantic-settings)."),
  ],
  [
    prac(
      'p1',
      'Elenca i passi di una pipeline CI per un servizio Python.',
      'Checkout, setup Python, installa dipendenze dal lockfile, ruff, mypy, pytest, build immagine Docker, push.',
    ),
    prac(
      'p2',
      'Perché un venv per progetto?',
      'Isola le versioni delle librerie, evita conflitti e rende la build riproducibile.',
    ),
  ],
)

export const drills = mod(
  'drills',
  'Esercizi a mano: 15 piccoli problemi',
  'Allenamento da fare offline, con soluzioni da confrontare',
  'finale',
  `<p class="lead">Scrivi la soluzione su carta o nell'editor <b>prima</b> di aprire la risposta. Se dopo 10 minuti sei bloccato, apri la traccia, richiudila e riprova da solo.</p>
<h3>Come usarli</h3><ul><li>Sezione <b>Pratica</b>: ogni esercizio ha una soluzione modello da rivelare.</li><li>Ripetili dopo 1 giorno e dopo 1 settimana.</li><li>Poi riscrivili con un approccio diverso (comprehension, generatore, libreria standard).</li></ul>
<h3>Temi coperti</h3><ul><li>Stringhe, liste, dict, set.</li><li>Funzioni, ricorsione, generatori.</li><li>Classi e dataclass.</li><li>File, JSON, regex.</li><li>Complessità e strutture dati.</li></ul>
<div class="say"><b>Obiettivo.</b> Arrivare a risolvere questi problemi senza guardare, con codice Python idiomatico.</div>`,
  [],
  [
    card(
      'c1',
      'FizzBuzz idiomatico',
      '["FizzBuzz" if n % 15 == 0 else "Fizz" if n % 3 == 0 else "Buzz" if n % 5 == 0 else n for n in range(1, 101)]',
    ),
    card('c2', 'Inversione di stringa', 's[::-1]'),
    card('c3', 'Appiattire una lista di liste', '[x for sub in lista for x in sub]'),
    card('c4', 'Frequenze', 'Counter(parole).most_common(n)'),
    card('c5', 'Unione di dict', '{**a, **b} oppure a | b (3.9+)'),
  ],
  [
    prac(
      'd1',
      'Palindromo: <code>"Anna"</code> è palindroma ignorando maiuscole e spazi?',
      '<pre><code>def pal(s):\n    t = "".join(c.lower() for c in s if c.isalnum())\n    return t == t[::-1]</code></pre>',
    ),
    prac(
      'd2',
      'Two sum: indici di due numeri che sommano a target.',
      '<pre><code>def two_sum(nums, target):\n    visti = {}\n    for i, n in enumerate(nums):\n        if target - n in visti:\n            return visti[target - n], i\n        visti[n] = i          # O(n)</code></pre>',
    ),
    prac(
      'd3',
      'Anagrammi: due stringhe sono anagrammi?',
      '<pre><code>from collections import Counter\n\ndef anagrammi(a, b):\n    return Counter(a) == Counter(b)</code></pre>',
    ),
    prac(
      'd4',
      'Raggruppa parole per lunghezza.',
      '<pre><code>from collections import defaultdict\n\ndef per_lunghezza(parole):\n    g = defaultdict(list)\n    for p in parole:\n        g[len(p)].append(p)\n    return g</code></pre>',
    ),
    prac(
      'd5',
      'Fibonacci con generatore.',
      '<pre><code>def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b</code></pre>',
    ),
    prac(
      'd6',
      'Primo carattere non ripetuto di una stringa.',
      '<pre><code>from collections import Counter\n\ndef primo_unico(s):\n    c = Counter(s)\n    return next((ch for ch in s if c[ch] == 1), None)</code></pre>',
    ),
    prac(
      'd7',
      'Parentesi bilanciate "([{}])".',
      '<pre><code>def bilanciate(s):\n    coppie = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in coppie:\n            if not stack or stack.pop() != coppie[ch]:\n                return False\n    return not stack</code></pre>',
    ),
    prac(
      'd8',
      'Merge di due liste ordinate.',
      '<pre><code>def merge(a, b):\n    i = j = 0\n    out = []\n    while i &lt; len(a) and j &lt; len(b):\n        if a[i] &lt;= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    return out + a[i:] + b[j:]      # oppure heapq.merge(a, b)</code></pre>',
    ),
    prac(
      'd9',
      'Elementi comuni di due liste senza duplicati.',
      '<pre><code>comuni = list(set(a) &amp; set(b))</code></pre>',
    ),
    prac(
      'd10',
      'Ruota una lista di k posizioni.',
      '<pre><code>def ruota(l, k):\n    if not l:\n        return l\n    k %= len(l)\n    return l[-k:] + l[:-k] if k else l[:]</code></pre>',
    ),
    prac(
      'd11',
      'LRU cache semplice con classe.',
      '<pre><code>from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap, self.d = cap, OrderedDict()\n    def get(self, k):\n        if k not in self.d:\n            return None\n        self.d.move_to_end(k)\n        return self.d[k]\n    def put(self, k, v):\n        self.d[k] = v\n        self.d.move_to_end(k)\n        if len(self.d) &gt; self.cap:\n            self.d.popitem(last=False)</code></pre>',
    ),
    prac(
      'd12',
      'Leggi un CSV e somma una colonna.',
      '<pre><code>import csv\n\nwith open(p, newline="", encoding="utf-8") as f:\n    totale = sum(float(r["importo"]) for r in csv.DictReader(f))</code></pre>',
    ),
    prac(
      'd13',
      'Valida una email con regex semplice.',
      '<pre><code>import re\n\nEMAIL = re.compile(r"[^@\\s]+@[^@\\s]+\\.[^@\\s]+")\n\ndef valida(s):\n    return EMAIL.fullmatch(s) is not None</code></pre>',
    ),
    prac(
      'd14',
      'Memoizza fibonacci ricorsivo.',
      '<pre><code>from functools import cache\n\n@cache\ndef fib(n):\n    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)</code></pre>',
    ),
    prac(
      'd15',
      'Decorator che misura il tempo di una funzione.',
      'Vedi modulo decorator: wrapper con time.perf_counter e functools.wraps.',
    ),
  ],
)
