import { card, mod, prac, q } from '../kit'

// Groups "oop" and "pythonic".

export const classes = mod(
  'classes',
  'Classi, dataclass e metodi speciali',
  'class, self, __init__, dunder, property, dataclass',
  'oop',
  `<p class="lead">Una classe raggruppa dati e comportamento. In Python è leggera, e le <b>dataclass</b> tolgono quasi tutto il boilerplate.</p>
<pre><code>class Conto:
    def __init__(self, titolare, saldo=0):
        self.titolare = titolare
        self.saldo = saldo

    def deposita(self, importo):
        self.saldo += importo

    def __repr__(self):
        return f"Conto({self.titolare!r}, {self.saldo})"

c = Conto("Ada")
c.deposita(50)
print(c)          # usa __repr__</code></pre>
<ul><li><code>self</code> è il primo argomento di ogni metodo, scritto in modo esplicito (come un <code>this</code> visibile).</li><li>Gli attributi si creano assegnandoli in <code>__init__</code>.</li><li>Convenzione: <code>_nome</code> = "interno", <code>__nome</code> = name mangling. Non esiste vero private.</li></ul>
<h3>Metodi speciali (dunder)</h3><div class="tblw"><table><tr><th>Metodo</th><th>Quando</th></tr>
<tr><td><code>__repr__</code> / <code>__str__</code></td><td>rappresentazione per debug / per l'utente</td></tr>
<tr><td><code>__eq__</code></td><td><code>a == b</code></td></tr>
<tr><td><code>__len__</code>, <code>__iter__</code></td><td><code>len(x)</code>, <code>for in x</code></td></tr>
<tr><td><code>__enter__</code> / <code>__exit__</code></td><td><code>with</code></td></tr></table></div>
<h3>Property e dataclass</h3><pre><code>class Cerchio:
    def __init__(self, r):
        self._r = r

    @property
    def area(self):
        return 3.14159 * self._r ** 2

from dataclasses import dataclass, field

@dataclass
class Utente:
    nome: str
    email: str
    ruoli: list[str] = field(default_factory=list)

u = Utente("Ada", "ada@x.it")   # __init__, __repr__, __eq__ gratis</code></pre>
<p>Con <code>@dataclass(frozen=True)</code> l'oggetto è immutabile. <code>@classmethod</code> e <code>@staticmethod</code> servono per costruttori alternativi e funzioni di utilità.</p>
<div class="say"><b>Cosa dire.</b> «Per dati semplici uso una dataclass; per esporre un valore calcolato, una property.»</div>`,
  [
    q(
      'q1',
      'Cosa genera <code>@dataclass</code>?',
      ['__init__, __repr__ e __eq__', 'Solo __init__', 'Un database', 'Un file JSON'],
      0,
      'Dai campi annotati ricava costruttore, repr e confronto.',
    ),
    q(
      'q2',
      'Perché in una dataclass si usa <code>field(default_factory=list)</code>?',
      ['È più veloce', 'Per evitare un default mutabile condiviso', 'Per ordinare', 'È obbligatorio per i numeri'],
      1,
      'Stessa trappola dei default mutabili nelle funzioni.',
    ),
    q(
      'q3',
      'A cosa serve <code>@property</code>?',
      [
        'A rendere un metodo accessibile come attributo',
        'A creare una classe astratta',
        'A rendere privato un campo',
        'A importare moduli',
      ],
      0,
      'Permette di leggere un valore calcolato come c.area, senza parentesi.',
    ),
    q(
      'q4',
      'Quale dunder serve per <code>len(obj)</code>?',
      ['__size__', '__len__', '__count__', '__length__'],
      1,
      'len chiama __len__.',
    ),
  ],
  [
    card('c1', 'Costruttore', 'def __init__(self, ...): imposta gli attributi su self.'),
    card('c2', '__repr__ vs __str__', 'repr per sviluppatori (non ambiguo), str per utenti.'),
    card('c3', 'Dataclass immutabile', '@dataclass(frozen=True).'),
    card('c4', 'Costruttore alternativo', '@classmethod def da_dict(cls, d): return cls(**d).'),
  ],
  [
    prac(
      'p1',
      'Modella un Prodotto con nome, prezzo e un metodo che applica uno sconto.',
      '@dataclass class Prodotto: nome: str; prezzo: float; def scontato(self, pct): return self.prezzo * (1 - pct / 100).',
    ),
    prac(
      'p2',
      'Quando una dataclass e quando una classe normale?',
      "Dataclass per contenitori di dati; classe normale quando c'è logica di stato complessa o un costruttore non banale.",
    ),
  ],
)

export const inherit = mod(
  'inherit',
  'Ereditarietà, duck typing e Protocol',
  'super, ABC, enum, duck typing, composizione',
  'oop',
  `<p class="lead">In Python conta più <b>cosa sa fare</b> un oggetto che <b>cosa è</b>: il duck typing. L'ereditarietà c'è, ma si preferisce la composizione.</p>
<pre><code>class Animale:
    def __init__(self, nome):
        self.nome = nome
    def verso(self):
        raise NotImplementedError

class Cane(Animale):
    def verso(self):
        return "bau"

class Gatto(Animale):
    def __init__(self, nome, indoor=True):
        super().__init__(nome)
        self.indoor = indoor
    def verso(self):
        return "miao"

for a in [Cane("Rex"), Gatto("Tom")]:
    print(a.nome, a.verso())</code></pre>
<h3>Classi astratte</h3><pre><code>from abc import ABC, abstractmethod

class Repo(ABC):
    @abstractmethod
    def salva(self, obj): ...</code></pre><p>Non puoi istanziare <code>Repo</code>: devi ereditare e implementare <code>salva</code>.</p>
<h3>Duck typing e Protocol</h3><pre><code>from typing import Protocol

class HaClose(Protocol):
    def close(self) -&gt; None: ...

def chiudi(x: HaClose):
    x.close()           # qualunque oggetto con close() va bene</code></pre>
<h3>Enum</h3><pre><code>from enum import Enum

class Stato(Enum):
    APERTO = "aperto"
    CHIUSO = "chiuso"

Stato("aperto") is Stato.APERTO   # True</code></pre>
<p>Ereditarietà multipla esiste (<code>class C(A, B)</code>) e l'ordine di ricerca è l'<b>MRO</b>: si vede con <code>C.__mro__</code>. Meglio evitarla senza motivo.</p>
<div class="say"><b>Cosa dire.</b> «Preferisco composizione e Protocol all'ereditarietà profonda; uso ABC solo quando voglio forzare un contratto.»</div>`,
  [
    q(
      'q1',
      'Cosa è il duck typing?',
      [
        'Un oggetto va bene se ha i metodi richiesti, indipendentemente dalla classe',
        'Un tipo di ereditarietà',
        'Un controllo a compile time',
        'Un modulo standard',
      ],
      0,
      "«Se cammina come un'anatra…»: conta il comportamento.",
    ),
    q(
      'q2',
      'A cosa serve <code>super().__init__()</code>?',
      [
        'A chiamare il costruttore della classe padre',
        'A creare un singleton',
        "A clonare l'oggetto",
        'A importare la classe',
      ],
      0,
      'Inizializza la parte ereditata.',
    ),
    q(
      'q3',
      'Cosa succede istanziando una ABC con metodi astratti non implementati?',
      ['TypeError', 'Funziona', 'None', 'Warning'],
      0,
      'Non si può istanziare finché non sono implementati tutti.',
    ),
    q(
      'q4',
      "Cosa è l'MRO?",
      [
        "L'ordine di ricerca dei metodi nell'ereditarietà",
        'Un modulo di test',
        'Una libreria async',
        'Il garbage collector',
      ],
      0,
      'Method Resolution Order: <code>Classe.__mro__</code>.',
    ),
  ],
  [
    card(
      'c1',
      'Composizione vs ereditarietà',
      'Preferisci avere un oggetto (has-a) che ereditare (is-a), se non serve davvero.',
    ),
    card('c2', 'Protocol', 'Interfaccia strutturale: basta avere i metodi giusti, senza ereditare.'),
    card('c3', 'Metodo astratto', '@abstractmethod dentro una classe che eredita da ABC.'),
    card('c4', 'Enum', 'Insieme di costanti con nome: class Stato(Enum): A = 1.'),
  ],
  [
    prac(
      'p1',
      "Disegna una piccola gerarchia di notifiche (email, sms) con un'interfaccia comune.",
      'Una ABC Notifica con invia(msg) astratto; EmailNotifica e SmsNotifica lo implementano; il chiamante usa solo invia.',
    ),
    prac(
      'p2',
      'Spiega a voce quando il duck typing è un rischio.',
      'Gli errori compaiono a runtime; si mitigano con type hint, Protocol e test.',
    ),
  ],
)

export const iterators = mod(
  'iterators',
  'Iteratori, generatori e lazy evaluation',
  'iter, next, yield, generator expression',
  'pythonic',
  `<p class="lead">Un generatore produce valori uno alla volta invece di costruire tutta la lista: poca memoria, perfetto per file e stream grandi.</p>
<pre><code>def conta(fino):
    n = 0
    while n &lt; fino:
        yield n
        n += 1

for x in conta(3):
    print(x)               # 0 1 2

somma = sum(n * n for n in range(1_000_000))   # generator expression: nessuna lista</code></pre>
<h3>Come funziona</h3><ul><li><code>yield</code> sospende la funzione e restituisce un valore; alla richiesta successiva riparte da lì.</li><li>Un <b>iterabile</b> ha <code>__iter__</code>; un <b>iteratore</b> ha anche <code>__next__</code> e solleva <code>StopIteration</code> alla fine.</li><li>Un generatore si consuma <b>una sola volta</b>.</li></ul>
<pre><code>def leggi_righe(path):
    with open(path, encoding="utf-8") as f:
        for riga in f:
            yield riga.strip()

prime_dieci = list(itertools.islice(leggi_righe("big.txt"), 10))</code></pre>
<h3>Utili</h3><pre><code>zip(a, b)            # coppie
enumerate(x, start=1)
any(...), all(...)
sorted(x), reversed(x)
next(it, None)       # primo elemento o default</code></pre>
<div class="say"><b>Cosa dire.</b> «Per file grandi uso generatori, così la memoria resta costante.»</div>`,
  [
    q(
      'q1',
      'Cosa fa <code>yield</code>?',
      ['Termina la funzione', 'Restituisce un valore e sospende la funzione', 'Solleva un errore', 'Crea un thread'],
      1,
      'La funzione riprende dallo stesso punto alla chiamata successiva.',
    ),
    q(
      'q2',
      'Si può iterare due volte lo stesso generatore?',
      ['Sì, sempre', 'No, si consuma', 'Solo con list()', 'Solo in async'],
      1,
      "Dopo l'esaurimento restituisce niente: va ricreato.",
    ),
    q(
      'q3',
      'Qual è il vantaggio di <code>sum(x for x in big)</code> rispetto a <code>sum([x for x in big])</code>?',
      ['Nessuno', 'Non crea la lista intera in memoria', 'È più leggibile', 'Usa più core'],
      1,
      'La generator expression è lazy.',
    ),
    q(
      'q4',
      'Cosa solleva un iteratore esaurito?',
      ['KeyError', 'StopIteration', 'EOFError', 'IndexError'],
      1,
      'Il ciclo for lo gestisce da solo.',
    ),
  ],
  [
    card('c1', 'Generator expression', '(espr for x in iter): come una comprehension ma lazy, tra tonde.'),
    card('c2', 'Primo elemento con default', 'next(iteratore, None).'),
    card('c3', 'Iterabile vs iteratore', 'Iterabile: ha __iter__. Iteratore: ha anche __next__ e si consuma.'),
    card('c4', 'Prendere i primi N', 'itertools.islice(it, N).'),
  ],
  [
    prac(
      'p1',
      'Scrivi un generatore che legge un file di log e produce solo le righe con ERROR.',
      'def errori(p): with open(p) as f: for r in f: if "ERROR" in r: yield r',
    ),
    prac(
      'p2',
      'Perché un generatore risolve il problema della memoria?',
      "Produce un elemento per volta senza tenerli tutti: l'uso di memoria non cresce con la dimensione dei dati.",
    ),
  ],
)

export const decorators = mod(
  'decorators',
  'Decorator e context manager',
  'funzioni che avvolgono funzioni, @, with personalizzato',
  'pythonic',
  `<p class="lead">Un <b>decorator</b> è una funzione che prende una funzione e ne restituisce una nuova. È la base di Flask, FastAPI, pytest e functools.</p>
<pre><code>import functools, time

def cronometra(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        t = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__}: {time.perf_counter() - t:.3f}s")
    return wrapper

@cronometra
def lavora():
    ...</code></pre>
<p><code>@cronometra</code> equivale a <code>lavora = cronometra(lavora)</code>. <code>functools.wraps</code> conserva nome e docstring.</p>
<h3>Decorator con parametri</h3><pre><code>def ripeti(n):
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **k):
            for _ in range(n):
                fn(*a, **k)
        return wrapper
    return deco

@ripeti(3)
def ciao(): print("ciao")</code></pre>
<h3>Già pronti</h3><ul><li><code>@functools.lru_cache</code>: memoizzazione.</li><li><code>@staticmethod</code>, <code>@classmethod</code>, <code>@property</code>.</li></ul>
<h3>Context manager</h3><pre><code>from contextlib import contextmanager

@contextmanager
def trasferimento(db):
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise

with trasferimento(db) as d:
    d.execute(...)</code></pre>
<div class="say"><b>Cosa dire.</b> «Un decorator avvolge una funzione per aggiungere comportamento trasversale (log, cache, auth); un context manager garantisce setup e cleanup.»</div>`,
  [
    q(
      'q1',
      'Cosa equivale a <code>@deco</code> sopra <code>def f</code>?',
      ['f = deco(f)', 'deco = f(deco)', 'deco(f())', 'f.deco()'],
      0,
      'Il decorator sostituisce f con il risultato di deco(f).',
    ),
    q(
      'q2',
      'Perché usare <code>functools.wraps</code>?',
      ['Per velocità', 'Per conservare nome e docstring originali', 'Per i thread', 'Per i test'],
      1,
      'Senza, la funzione decorata si chiamerebbe "wrapper".',
    ),
    q(
      'q3',
      'A cosa serve <code>lru_cache</code>?',
      ['A memoizzare i risultati di una funzione', 'A leggere file', 'A ordinare liste', 'A gestire eccezioni'],
      0,
      'Salva i risultati per argomenti già visti.',
    ),
    q(
      'q4',
      'Cosa garantisce un context manager?',
      ['Parallelismo', 'Cleanup anche in caso di eccezione', 'Tipi statici', 'Più velocità'],
      1,
      '__exit__ gira sempre.',
    ),
  ],
  [
    card('c1', 'Decorator in una riga', 'Funzione che riceve una funzione e restituisce una funzione.'),
    card('c2', 'Memoizzare', '@functools.lru_cache(maxsize=None) oppure @cache.'),
    card('c3', 'Context manager con generatore', '@contextmanager, yield nel mezzo, cleanup dopo (in finally).'),
    card('c4', 'Decorator con parametri', 'Tre livelli: ripeti(n) → deco(fn) → wrapper(*a, **k).'),
  ],
  [
    prac(
      'p1',
      "Scrivi un decorator che riprova una funzione fino a 3 volte se solleva un'eccezione.",
      'wrapper con for tentativo in range(3): try: return fn(...) except Exception: se ultimo tentativo, raise.',
    ),
    prac(
      'p2',
      'Dove incontri i decorator in un backend Python?',
      'Route in Flask/FastAPI (@app.get), fixture pytest, @property, @dataclass, caching e controlli di permessi.',
    ),
  ],
)

export const typing = mod(
  'typing',
  'Type hint e tipi moderni',
  'annotazioni, Optional, union, generics, mypy/pyright',
  'pythonic',
  `<p class="lead">Python è dinamico, ma i type hint documentano il codice e permettono ai tool (mypy, pyright, l'editor) di trovare bug. Non cambiano il comportamento a runtime.</p>
<pre><code>def saluta(nome: str, volte: int = 1) -&gt; str:
    return (f"ciao {nome} " * volte).strip()

utenti: list[str] = []
voti: dict[str, int] = {}
punto: tuple[int, int] = (1, 2)
id_utente: int | None = None       # Python 3.10+: unione con |</code></pre>
<h3>Tipi utili</h3><pre><code>from typing import Any, Callable, Literal, TypedDict, Protocol

Ruolo = Literal["admin", "user"]

class UtenteDict(TypedDict):
    nome: str
    eta: int

def applica(f: Callable[[int], int], x: int) -&gt; int:
    return f(x)</code></pre>
<h3>Generics</h3><pre><code>from typing import TypeVar
T = TypeVar("T")

def primo(xs: list[T]) -&gt; T | None:
    return xs[0] if xs else None</code></pre>
<h3>Controllo statico</h3><pre><code>pip install mypy
mypy src/            # trova i mismatch senza eseguire il codice</code></pre>
<ul><li>Gli hint non sono obbligatori e <b>non</b> sono verificati da Python quando gira.</li><li>Librerie come Pydantic e FastAPI li usano a runtime per validare i dati.</li></ul>
<div class="say"><b>Cosa dire.</b> «Annoto le interfacce pubbliche e uso mypy in CI; con Pydantic gli hint diventano anche validazione.»</div>`,
  [
    q(
      'q1',
      "Python verifica i type hint durante l'esecuzione?",
      ['Sì, sempre', 'No, li usano i tool esterni (mypy, editor)', 'Solo per int', 'Solo in debug'],
      1,
      "Sono annotazioni: ignorate dall'interprete salvo librerie che le leggono.",
    ),
    q(
      'q2',
      'Come si scrive "int oppure None" (3.10+)?',
      ['int | None', 'int or None', 'Maybe[int]', 'int?'],
      0,
      "L'unione usa il simbolo |.",
    ),
    q(
      'q3',
      'Cosa fa <code>Literal["a", "b"]</code>?',
      ['Limita ai valori esatti indicati', 'Crea una stringa', 'Converte in enum', 'Niente'],
      0,
      'Restringe il tipo a quei valori.',
    ),
    q(
      'q4',
      'Quale tool controlla i tipi senza eseguire il codice?',
      ['pytest', 'mypy', 'pip', 'venv'],
      1,
      'mypy e pyright sono type checker statici.',
    ),
  ],
  [
    card('c1', 'Annotare una funzione', 'def f(x: int, y: str = "a") -> bool:'),
    card('c2', 'Lista di stringhe', 'list[str] (3.9+); dict[str, int].'),
    card('c3', 'Opzionale', 'T | None (o Optional[T]).'),
    card('c4', 'Type checker', 'mypy src/ oppure pyright.'),
  ],
  [
    prac(
      'p1',
      'Annota una funzione che riceve una lista di utenti (dict) e restituisce i nomi.',
      'def nomi(utenti: list[dict[str, str]]) -> list[str]: ...',
    ),
    prac(
      'p2',
      'Perché annotare se Python non li controlla?',
      "Documentazione, autocompletamento, bug trovati prima dell'esecuzione, validazione con Pydantic/FastAPI.",
    ),
  ],
)

export const stdlib = mod(
  'stdlib',
  'Libreria standard essenziale',
  'collections, itertools, functools, datetime, re, logging, argparse',
  'pythonic',
  `<p class="lead">La libreria standard è enorme: batterie incluse. Questi sono i pezzi che userai di continuo.</p>
<h3>collections</h3><pre><code>from collections import Counter, defaultdict, deque

Counter("banana").most_common(2)     # [('a', 3), ('n', 2)]
gruppi = defaultdict(list)
gruppi["x"].append(1)                # niente KeyError
coda = deque([1, 2, 3]); coda.popleft()</code></pre>
<h3>datetime</h3><pre><code>from datetime import datetime, timedelta, timezone

ora = datetime.now(timezone.utc)
domani = ora + timedelta(days=1)
ora.isoformat()
datetime.fromisoformat("2026-11-09T09:00:00")
ora.strftime("%d/%m/%Y")</code></pre>
<p>Usa sempre date <b>timezone-aware</b> per evitare errori. </p>
<h3>re, logging, argparse</h3><pre><code>import re, logging, argparse

re.findall(r"\\d+", "a1b22")          # ['1', '22']
m = re.search(r"(?P&lt;anno&gt;\\d{4})", "nel 2026")
m.group("anno")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)
log.info("avviato")

p = argparse.ArgumentParser()
p.add_argument("--n", type=int, default=3)
args = p.parse_args()</code></pre>
<h3>Altri</h3><ul><li><code>itertools</code>: chain, groupby, product, islice.</li><li><code>functools</code>: partial, reduce, lru_cache.</li><li><code>os</code>, <code>sys</code>, <code>pathlib</code>, <code>subprocess</code>, <code>random</code>, <code>uuid</code>, <code>hashlib</code>.</li></ul>
<div class="say"><b>Cosa dire.</b> «Prima di installare qualcosa controllo se la libreria standard lo fa già: Counter, datetime, logging.»</div>`,
  [
    q(
      'q1',
      'Quale struttura crea da sola una lista vuota alla prima lettura di una chiave mancante?',
      ['Counter', 'defaultdict(list)', 'deque', 'OrderedDict'],
      1,
      'defaultdict crea il valore di default alla prima lettura.',
    ),
    q(
      'q2',
      'Perché usare datetime con timezone?',
      ['Per estetica', 'Per evitare errori tra fusi e ora legale', 'È obbligatorio', 'Per velocità'],
      1,
      'Le date naive sono ambigue.',
    ),
    q(
      'q3',
      'Cosa fa <code>Counter("aab").most_common(1)</code>?',
      ["[('a', 2)]", "['a']", '2', "{'a': 2}"],
      0,
      'Restituisce una lista di coppie (elemento, conteggio).',
    ),
    q(
      'q4',
      'Meglio <code>print</code> o <code>logging</code> in un servizio?',
      ['print', 'logging, con livelli e formato', 'Nessuno', 'Solo stderr'],
      1,
      'logging dà livelli, formato e destinazioni configurabili.',
    ),
  ],
  [
    card('c1', 'Contare occorrenze', 'collections.Counter(iterabile).'),
    card('c2', 'Coda efficiente', 'collections.deque (append/popleft in O(1)).'),
    card('c3', 'Data UTC adesso', 'datetime.now(timezone.utc).'),
    card('c4', 'Argomenti da riga di comando', 'argparse.ArgumentParser().'),
  ],
  [
    prac(
      'p1',
      'Scrivi uno script con --path che conta le parole più frequenti di un file.',
      'argparse per --path, Path.read_text, re.findall(r"\\w+"), Counter(...).most_common(10).',
    ),
    prac('p2', 'Estrai tutti gli anni a 4 cifre da un testo.', 're.findall(r"\\b\\d{4}\\b", testo)'),
  ],
)
