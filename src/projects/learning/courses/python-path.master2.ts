import { card, mod, prac, q } from './python-path.helpers'

// Group "master" (round 2). Vault notes live in knowledge/programming/backend/python.

export const imports = mod(
  'imports',
  'Import, moduli e pacchetti',
  'sys.path, __init__, import relativi, cicli, layout src/',
  'master',
  `<p class="lead">Un <b>modulo</b> è un file <code>.py</code>; un <b>pacchetto</b> è una cartella di moduli (con o senza <code>__init__.py</code>). Capire come funziona l'import evita metà degli errori «ModuleNotFoundError» e degli import circolari.</p>
<h3>Come funziona</h3><ol><li>Python cerca il nome in <code>sys.modules</code> (cache).</li><li>Se manca, scorre i percorsi di <code>sys.path</code> (cartella dello script, <code>PYTHONPATH</code>, site-packages).</li><li>Esegue il file <b>una volta</b> e salva il modulo in <code>sys.modules</code>.</li></ol>
<pre><code>import os.path
from collections import Counter
from . import utils            # relativo: stesso pacchetto
from ..core import config      # relativo: pacchetto padre
import numpy as np</code></pre>
<h3>Layout consigliato</h3><pre><code>progetto/
  pyproject.toml
  src/
    mioapp/
      __init__.py
      api.py
      core/
        __init__.py
        config.py
  tests/
    test_api.py</code></pre>
<p>Il layout <code>src/</code> impedisce di importare il codice per sbaglio dalla cartella corrente: i test usano il pacchetto installato (<code>pip install -e .</code>), come in produzione.</p>
<h3>__init__.py e API pubblica</h3><pre><code># mioapp/__init__.py
from .api import crea_app
__all__ = ["crea_app"]        # cosa esporta "from mioapp import *"</code></pre>
<ul><li>Importa dal pacchetto in cima, non da percorsi interni profondi.</li><li><code>__all__</code> documenta l'API pubblica.</li><li>I <b>namespace package</b> (cartelle senza <code>__init__.py</code>) permettono di distribuire un pacchetto in più parti.</li></ul>
<h3>Import circolari</h3><p>A importa B e B importa A: uno dei due vede un modulo <b>a metà</b>. Rimedi, dal migliore:</p><ol><li>Ridisegna: sposta il codice condiviso in un terzo modulo.</li><li>Importa il modulo (<code>import a</code>), non i nomi (<code>from a import x</code>), e usa <code>a.x</code> a runtime.</li><li>Import locale dentro la funzione.</li><li>Per i tipi: <code>if TYPE_CHECKING:</code>.</li></ol>
<pre><code>from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .modelli import Utente

def carica(uid: int) -&gt; "Utente": ...</code></pre>
<h3>Eseguire moduli</h3><p><code>python -m mioapp.cli</code> esegue un modulo del pacchetto con gli import corretti; <code>python src/mioapp/cli.py</code> rompe gli import relativi. Il blocco <code>if __name__ == "__main__":</code> gira solo se lanci il file direttamente.</p>
<h3>Import lenti e opzionali</h3><ul><li>Gli import costano all'avvio: importa pesante dentro la funzione se serve di rado (<code>python -X importtime</code> per misurare).</li><li>Dipendenze opzionali: <code>try: import ujson except ImportError: ujson = None</code>.</li></ul>
<div class="say"><b>Cosa dire.</b> «Layout src/, API pubblica nell'__init__, import relativi nel pacchetto e niente cicli: se ci sono, il codice condiviso va in un terzo modulo.»</div>`,
  [
    q(
      'q1',
      'Dove cerca Python un modulo non ancora importato?',
      ['Solo nella cartella corrente', 'In sys.path', 'Su internet', 'In /usr'],
      1,
      'sys.path include cartella dello script, PYTHONPATH e site-packages.',
    ),
    q(
      'q2',
      'Cosa succede alla seconda import dello stesso modulo?',
      ['Si riesegue', 'Viene preso da sys.modules', 'Errore', 'Si ricompila'],
      1,
      'Il codice del modulo gira una sola volta.',
    ),
    q(
      'q3',
      'Qual è il rimedio migliore a un import circolare?',
      [
        'try/except',
        'Spostare il codice comune in un terzo modulo',
        'Import dentro ogni funzione',
        'Rinominare i file',
      ],
      1,
      'Gli altri sono pezzi di compromesso.',
    ),
    q(
      'q4',
      'A cosa serve <code>TYPE_CHECKING</code>?',
      [
        'A importare solo per i type checker, non a runtime',
        'A controllare la versione',
        'A velocizzare gli import',
        'Niente',
      ],
      0,
      'Evita cicli causati da soli import di tipi.',
    ),
    q(
      'q5',
      'Perché il layout <code>src/</code>?',
      [
        'È più bello',
        'Evita di importare il codice dalla cartella corrente per errore',
        'Serve a pip',
        'È obbligatorio',
      ],
      1,
      'I test girano contro il pacchetto installato.',
    ),
  ],
  [
    card('c1', 'Ordine di ricerca', 'sys.modules (cache) → sys.path (cartelle) → esegue e salva.'),
    card('c2', 'Eseguire un modulo', 'python -m pacchetto.modulo (import relativi corretti).'),
    card('c3', 'Import relativi', 'from . import x (stesso pacchetto); from ..y import z (padre).'),
    card('c4', 'Solo per i tipi', 'if TYPE_CHECKING: from .m import T.'),
    card('c5', 'Misurare gli import', 'python -X importtime script.py'),
  ],
  [
    prac(
      'p1',
      'Hai un ImportError circolare tra models.py e services.py: cosa fai?',
      'Sposto le parti condivise in un terzo modulo; in alternativa import locale nella funzione o TYPE_CHECKING per i soli tipi.',
    ),
    prac(
      'p2',
      'Perché <code>python src/app/cli.py</code> rompe gli import relativi?',
      'Lo esegue come script (nome __main__, senza pacchetto): gli import relativi non hanno un pacchetto di riferimento. Si usa python -m.',
    ),
  ],
  'Note del vault: python/package-structure.md',
)

export const algos = mod(
  'algos',
  'Algoritmi e strutture dati in Python',
  'Complessità reale, heapq, bisect, deque, pattern da colloquio',
  'master',
  `<p class="lead">Python ha le strutture giuste nella libreria standard. Saper scegliere quella con la complessità giusta è ciò che fa passare un colloquio e rende i servizi veloci.</p>
<h3>Complessità delle operazioni native</h3><div class="tblw"><table><tr><th>Struttura</th><th>Operazione</th><th>Costo</th></tr>
<tr><td>list</td><td>append / pop() / indice</td><td>O(1)</td></tr>
<tr><td>list</td><td><code>insert(0)</code>, <code>pop(0)</code>, <code>x in l</code></td><td>O(n)</td></tr>
<tr><td>dict / set</td><td>lettura, inserimento, <code>in</code></td><td>O(1) medio</td></tr>
<tr><td>deque</td><td>append/popleft</td><td>O(1)</td></tr>
<tr><td>sorted / list.sort</td><td>ordinamento (Timsort)</td><td>O(n log n)</td></tr>
<tr><td>heapq</td><td>push / pop del minimo</td><td>O(log n)</td></tr>
<tr><td>bisect</td><td>ricerca in lista ordinata</td><td>O(log n)</td></tr></table></div>
<h3>Le strutture utili</h3><pre><code>from collections import deque, Counter, defaultdict
import heapq, bisect

coda = deque([1, 2, 3]); coda.appendleft(0); coda.popleft()

h = []
heapq.heappush(h, (priorita, nome))
minimo = heapq.heappop(h)
heapq.nlargest(3, dati, key=lambda x: x.score)

ordinata = [1, 3, 5, 9]
i = bisect.bisect_left(ordinata, 5)       # 2
bisect.insort(ordinata, 4)</code></pre>
<p><code>heapq</code> è un min-heap: per un max-heap si inseriscono i valori negati.</p>
<h3>Pattern ricorrenti</h3><ul>
<li><b>Hash map per cercare</b>: two-sum, duplicati, anagrammi, frequenze. Da O(n²) a O(n).</li>
<li><b>Due puntatori / finestra scorrevole</b> su liste ordinate o sottostringhe.</li>
<li><b>Stack</b> (una lista): parentesi bilanciate, espressioni, "next greater".</li>
<li><b>Coda (deque)</b> per la BFS: <code>while coda: nodo = coda.popleft()</code>.</li>
<li><b>Heap</b> per i top-K e per la coda di priorità (Dijkstra).</li>
<li><b>Ricerca binaria</b> con <code>bisect</code>, anche "sul risultato".</li>
<li><b>Programmazione dinamica</b> con <code>@cache</code> per la memoizzazione.</li></ul>
<pre><code>from functools import cache

@cache
def fib(n):
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)

def bfs(grafo, start):
    visti, coda = {start}, deque([start])
    while coda:
        n = coda.popleft()
        for v in grafo[n]:
            if v not in visti:
                visti.add(v); coda.append(v)
    return visti</code></pre>
<h3>Ordinare e raggruppare</h3><pre><code>sorted(utenti, key=lambda u: (u.cognome, -u.eta))   # chiave composta, ordine stabile
from itertools import groupby
for k, g in groupby(sorted(dati, key=f), key=f): ...</code></pre>
<p><code>groupby</code> raggruppa solo elementi <b>consecutivi</b>: ordina prima.</p>
<h3>Errori tipici</h3><ul><li><code>x in lista</code> dentro un ciclo: O(n²). Converti in <code>set</code>.</li><li>Ricorsione profonda: il limite è circa 1000 (<code>sys.getrecursionlimit</code>); preferisci un ciclo con stack esplicito.</li><li>Slicing ripetuto in un ciclo: copia a ogni passo.</li></ul>
<div class="say"><b>Cosa dire.</b> «Prima dichiaro la complessità, poi scelgo la struttura: dict per cercare, deque per le code, heap per i top-K, bisect per l'ordinato.»</div>`,
  [
    q(
      'q1',
      'Qual è il costo di <code>x in lista</code>?',
      ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      2,
      'Scorre la lista; con un set sarebbe O(1) medio.',
    ),
    q(
      'q2',
      'Quale struttura per una BFS?',
      ['list con pop(0)', 'deque con popleft', 'set', 'tuple'],
      1,
      'popleft è O(1); pop(0) su list è O(n).',
    ),
    q(
      'q3',
      'Come ottieni un max-heap con heapq?',
      ['heapq.maxheap', 'Inserendo i valori negati', 'Ordinando prima', 'Non si può'],
      1,
      'heapq implementa solo il min-heap.',
    ),
    q(
      'q4',
      'Cosa fa <code>groupby</code> con dati non ordinati?',
      ['Raggruppa tutto correttamente', 'Raggruppa solo elementi consecutivi uguali', 'Errore', 'Ordina da solo'],
      1,
      'Serve sorted prima.',
    ),
    q(
      'q5',
      'Costo di <code>sorted(lista)</code>?',
      ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      1,
      'Timsort, stabile.',
    ),
  ],
  [
    card('c1', 'Top K', 'heapq.nlargest(k, dati, key=...) o heap di dimensione k.'),
    card('c2', 'Ricerca in lista ordinata', 'bisect.bisect_left(l, x); bisect.insort(l, x).'),
    card('c3', 'Coda O(1) ai due capi', 'collections.deque.'),
    card('c4', 'Memoizzare', '@functools.cache sulla funzione ricorsiva.'),
    card('c5', 'Ordinamento stabile con chiave composta', 'sorted(xs, key=lambda x: (x.a, -x.b)).'),
  ],
  [
    prac(
      'p1',
      'Trova i K elementi più frequenti in una lista.',
      'Counter(lista).most_common(k) (O(n log k) internamente con heap).',
    ),
    prac(
      'p2',
      'Un ciclo con <code>if x in lista</code> è lento: come lo sistemi?',
      'Converti la lista in set prima del ciclo: da O(n·m) a O(n+m).',
    ),
    prac(
      'p3',
      'Implementa una BFS per la distanza minima in un grafo non pesato.',
      'deque con (nodo, distanza); set di visitati; al primo arrivo al target ritorna la distanza.',
    ),
  ],
  'Note del vault: knowledge/programming/computer science/data-structures-algorithms.md, python/sets-and-maps.md',
)

export const patterns = mod(
  'patterns',
  'Design pattern in chiave Pythonic',
  'Strategy, Factory, Observer, Singleton, DI: con funzioni e moduli',
  'master',
  `<p class="lead">In Python molti pattern GoF diventano banali o inutili perché le funzioni sono oggetti e i moduli sono singleton. Il trucco è riconoscere quando basta una funzione.</p>
<h3>Strategy: una funzione</h3><pre><code>def sconto_nessuno(p): return p
def sconto_10(p): return p * 0.9

def totale(prezzi, sconto=sconto_nessuno):
    return sum(sconto(p) for p in prezzi)

totale([10, 20], sconto=sconto_10)</code></pre>
<h3>Factory: un dict o una funzione</h3><pre><code>ESPORTATORI = {"csv": EsportaCsv, "json": EsportaJson}

def crea_esportatore(formato):
    try:
        return ESPORTATORI[formato]()
    except KeyError:
        raise ValueError(f"formato non supportato: {formato}") from None</code></pre>
<h3>Singleton: il modulo</h3><p>Un modulo viene eseguito una sola volta: una variabile a livello di modulo <b>è</b> il singleton. Evita le classi singleton con <code>__new__</code> se non strettamente necessario.</p>
<pre><code># config.py
settings = carica_impostazioni()

# altrove
from config import settings</code></pre>
<h3>Observer: callback</h3><pre><code>class Evento:
    def __init__(self): self._h = []
    def sottoscrivi(self, f): self._h.append(f)
    def emetti(self, *a, **k):
        for f in self._h: f(*a, **k)</code></pre>
<h3>Decorator: sintassi nativa</h3><p>Il pattern Decorator del GoF è in Python <code>@decorator</code>: aggiungi log, cache, retry o controlli senza toccare la funzione.</p>
<h3>Dependency injection: argomenti</h3><pre><code>class Servizio:
    def __init__(self, repo, clock=datetime.now):
        self.repo, self.clock = repo, clock

# test: Servizio(RepoFinto(), clock=lambda: datetime(2026, 1, 1))</code></pre>
<p>Passa le dipendenze come parametri (costruttore o funzione): niente framework di DI per iniziare. FastAPI offre <code>Depends</code>.</p>
<h3>Protocol e ABC al posto delle interfacce</h3><pre><code>class Repo(Protocol):
    def trova(self, id: int) -&gt; Utente | None: ...
    def salva(self, u: Utente) -&gt; None: ...</code></pre>
<h3>Repository e Unit of Work</h3><ul><li><b>Repository</b>: incapsula l'accesso ai dati dietro metodi del dominio (<code>trova</code>, <code>salva</code>), così il dominio non conosce SQL.</li><li><b>Unit of Work</b>: una transazione che raccoglie i cambiamenti e fa commit o rollback in un punto solo (<code>with uow:</code>).</li></ul>
<h3>Quando NON usare un pattern</h3><ul><li>Se una funzione risolve, non scrivere una classe.</li><li>Se c'è una sola implementazione e non cambierà, niente interfaccia.</li><li>Pattern per "flessibilità futura" sono spesso debito tecnico.</li></ul>
<div class="say"><b>Cosa dire.</b> «In Python uso funzioni, dict e moduli prima di classi e gerarchie; introduco un Protocol solo quando ho davvero più implementazioni.»</div>`,
  [
    q(
      'q1',
      'Come si implementa tipicamente il pattern Strategy?',
      ['Con una gerarchia di classi obbligatoria', 'Passando una funzione', 'Con una metaclasse', 'Con un singleton'],
      1,
      'Le funzioni sono oggetti di prima classe.',
    ),
    q(
      'q2',
      'Qual è il singleton più semplice in Python?',
      ['Una classe con __new__', 'Una variabile a livello di modulo', 'Una metaclasse', 'Un decorator'],
      1,
      'Il modulo viene eseguito una volta sola.',
    ),
    q(
      'q3',
      'A cosa serve il Repository?',
      ["A nascondere l'accesso ai dati dietro metodi del dominio", 'A fare cache', 'A validare input', 'A loggare'],
      0,
      'Il dominio non dipende da SQL.',
    ),
    q(
      'q4',
      'Cosa è la dependency injection più semplice?',
      ['Un framework', 'Passare le dipendenze come argomenti', 'Un file di config', 'Una variabile globale'],
      1,
      'Facilita i test con finti collaboratori.',
    ),
    q(
      'q5',
      'Quale equivale al Decorator GoF?',
      ['@decorator sintattico', 'metaclass', 'singleton', '__call__ obbligatorio'],
      0,
      'Aggiunge comportamento a una funzione senza modificarla.',
    ),
  ],
  [
    card('c1', 'Strategy', 'Passa una funzione come parametro.'),
    card('c2', 'Factory', 'Dict nome→classe/funzione e una funzione che lo consulta.'),
    card('c3', 'Singleton', 'Variabile a livello di modulo.'),
    card('c4', 'DI', 'Dipendenze come argomenti di costruttore o funzione.'),
    card('c5', 'Interfaccia', 'typing.Protocol (strutturale) o ABC (nominale).'),
  ],
  [
    prac(
      'p1',
      "Progetta l'invio di notifiche (email, sms, push) in modo estendibile.",
      'Un Protocol Notificatore.invia(msg); un dict di implementazioni; il servizio riceve il notificatore come argomento.',
    ),
    prac(
      'p2',
      'Perché in Python molti pattern GoF sono "invisibili"?',
      'Funzioni di prima classe, decorator, moduli singleton e duck typing sostituiscono classi e interfacce.',
    ),
  ],
  'Note del vault: knowledge/programming/computer science (patterns), python/class-patterns.md',
)

export const advasync = mod(
  'advasync',
  'asyncio avanzato',
  'Task, timeout, cancellazione, code, semaforo, errori comuni',
  'backend',
  `<p class="lead">Scrivere <code>async def</code> è facile; scrivere codice asincrono corretto richiede di capire task, cancellazione e backpressure.</p>
<h3>Coroutine contro Task</h3><ul><li>Una <b>coroutine</b> (<code>async def</code> chiamata) non fa nulla finché non la <code>await</code>i o non ne fai un task.</li><li>Un <b>Task</b> (<code>asyncio.create_task</code>) la schedula: parte al primo punto in cui il codice chiamante cede il controllo con un <code>await</code>, poi gira in concorrenza.</li></ul>
<pre><code>async def main():
    t = asyncio.create_task(lavora())     # schedulato: parte al prossimo await
    await altro()
    risultato = await t</code></pre>
<p>Conserva un riferimento ai task: se non lo fai, possono essere raccolti dal GC prima di finire.</p>
<h3>TaskGroup e gather</h3><pre><code>async with asyncio.TaskGroup() as tg:
    a = tg.create_task(chiama("a"))
    b = tg.create_task(chiama("b"))
print(a.result(), b.result())

# gather con errori raccolti
esiti = await asyncio.gather(*coros, return_exceptions=True)</code></pre>
<h3>Timeout e cancellazione</h3><pre><code>try:
    async with asyncio.timeout(5):
        await chiamata_lenta()
except TimeoutError:
    ...

task.cancel()                   # solleva CancelledError nel task
try:
    await task
except asyncio.CancelledError:
    pass</code></pre>
<p><b>Non inghiottire</b> <code>CancelledError</code>: se lo catturi, rilancialo dopo la pulizia (<code>try/finally</code>).</p>
<h3>Limitare la concorrenza</h3><pre><code>sem = asyncio.Semaphore(10)

async def limitata(url):
    async with sem:
        return await scarica(url)

await asyncio.gather(*(limitata(u) for u in urls))</code></pre>
<h3>Code produttore/consumatore</h3><pre><code>q = asyncio.Queue(maxsize=100)         # maxsize = backpressure

async def produttore():
    for i in range(1000):
        await q.put(i)                 # aspetta se la coda è piena

async def consumatore():
    while True:
        x = await q.get()
        try:
            await elabora(x)
        finally:
            q.task_done()</code></pre>
<h3>Mescolare sync e async</h3><ul><li>Codice bloccante: <code>await asyncio.to_thread(fn, ...)</code>.</li><li>Dal sync all'async: <code>asyncio.run(main())</code> una sola volta al livello più alto.</li><li><b>Mai</b> <code>time.sleep</code> o <code>requests</code> dentro una coroutine: bloccano l'intero loop.</li></ul>
<h3>Altri strumenti</h3><ul><li><code>async with</code> / <code>async for</code> e i generatori asincroni.</li><li><code>contextvars</code> per portare l'ID richiesta tra task.</li><li><code>asyncio.Lock</code>, <code>Event</code> per sincronizzare task.</li></ul>
<h3>Errori frequenti</h3><ul><li>Dimenticare <code>await</code>: ottieni una coroutine mai eseguita (warning «never awaited»).</li><li>Lanciare 10.000 task insieme senza semaforo.</li><li>Eccezioni dei task non osservati che spariscono.</li><li>Usare una libreria sincrona nel loop.</li></ul>
<div class="say"><b>Cosa dire.</b> «Task con TaskGroup, timeout espliciti, concorrenza limitata da un semaforo, e il codice bloccante spostato su un thread.»</div>`,
  [
    q(
      'q1',
      'Cosa succede se chiami <code>coro()</code> senza <code>await</code>?',
      [
        'Parte in background',
        'Ottieni un oggetto coroutine che non è mai eseguito',
        'Errore immediato',
        'Blocca il loop',
      ],
      1,
      'Serve await o create_task.',
    ),
    q(
      'q2',
      'A cosa serve <code>Semaphore(10)</code>?',
      ['A limitare la concorrenza a 10 operazioni', 'A creare 10 thread', 'A ordinare i task', 'A fare timeout'],
      0,
      'Evita di sommergere un servizio con migliaia di richieste.',
    ),
    q(
      'q3',
      'Cosa devi fare se catturi <code>CancelledError</code>?',
      ['Ignorarlo', 'Rilanciarlo dopo la pulizia', 'Convertirlo in ValueError', 'Riavviare il task'],
      1,
      'Inghiottirlo rompe la cancellazione.',
    ),
    q(
      'q4',
      'A cosa serve <code>maxsize</code> in <code>asyncio.Queue</code>?',
      ['Backpressure: il produttore aspetta se è piena', 'Velocità', 'Ordine', 'Niente'],
      0,
      'Impedisce che la coda cresca senza limite.',
    ),
    q(
      'q5',
      'Come esegui codice bloccante senza fermare il loop?',
      ['asyncio.to_thread', 'time.sleep', 'while True', 'gather'],
      0,
      'Lo sposta su un thread del pool.',
    ),
  ],
  [
    card('c1', 'Timeout', 'async with asyncio.timeout(5): ... (3.11+).'),
    card('c2', 'Limitare la concorrenza', 'asyncio.Semaphore(n) con async with.'),
    card('c3', 'Cancellare un task', 'task.cancel(); poi await e gestisci CancelledError (rilancia).'),
    card('c4', 'Codice bloccante', 'await asyncio.to_thread(fn, *args).'),
    card('c5', 'Concorrenza strutturata', 'asyncio.TaskGroup (3.11+).'),
  ],
  [
    prac(
      'p1',
      'Devi scaricare 5000 URL senza sovraccaricare il server: come?',
      'TaskGroup o gather con un Semaphore(20); timeout per richiesta; retry con backoff; client condiviso.',
    ),
    prac(
      'p2',
      'Un task fallisce in silenzio: perché e come lo eviti?',
      "Nessuno ne ha letto l'eccezione. Usa TaskGroup, oppure await/gather(return_exceptions=True) e logga gli errori.",
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/async-await.md',
)

export const advtyping = mod(
  'advtyping',
  'Typing avanzato',
  'Protocol, Generic, ParamSpec, TypeGuard, overload, TypedDict',
  'pythonic',
  `<p class="lead">I type hint avanzati ti permettono di descrivere API flessibili e sicure: funzioni generiche, decorator che mantengono la firma, interfacce strutturali.</p>
<h3>Protocol: interfacce strutturali</h3><pre><code>from typing import Protocol

class Chiudibile(Protocol):
    def close(self) -&gt; None: ...

def chiudi_tutto(xs: list[Chiudibile]) -&gt; None:
    for x in xs: x.close()      # qualunque oggetto con close() va bene</code></pre>
<p>Niente ereditarietà: basta avere i metodi. Con <code>@runtime_checkable</code> funziona anche con <code>isinstance</code>.</p>
<h3>Generics</h3><pre><code>from typing import TypeVar, Generic
T = TypeVar("T")

class Pila(Generic[T]):
    def __init__(self) -&gt; None: self._v: list[T] = []
    def push(self, x: T) -&gt; None: self._v.append(x)
    def pop(self) -&gt; T: return self._v.pop()

def primo[T](xs: list[T]) -&gt; T | None: ...      # 3.12</code></pre>
<p>Con i vincoli: <code>TypeVar("N", int, float)</code> oppure <code>bound=Base</code>.</p>
<h3>ParamSpec: decorator che conservano la firma</h3><pre><code>from typing import Callable, ParamSpec, TypeVar
import functools
P = ParamSpec("P"); R = TypeVar("R")

def log(f: Callable[P, R]) -&gt; Callable[P, R]:
    @functools.wraps(f)
    def wrapper(*a: P.args, **k: P.kwargs) -&gt; R:
        print(f.__name__)
        return f(*a, **k)
    return wrapper</code></pre>
<h3>overload e Literal</h3><pre><code>from typing import overload, Literal

@overload
def leggi(path: str, binario: Literal[True]) -&gt; bytes: ...
@overload
def leggi(path: str, binario: Literal[False] = ...) -&gt; str: ...
def leggi(path, binario=False): ...</code></pre>
<h3>TypedDict, NamedTuple, Final</h3><pre><code>class Utente(TypedDict):
    nome: str
    eta: int

class Punto(NamedTuple):
    x: float
    y: float

MAX: Final = 10</code></pre>
<h3>Narrowing</h3><pre><code>from typing import TypeGuard

def sono_stringhe(xs: list[object]) -&gt; TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in xs)

def f(x: int | str):
    if isinstance(x, int):
        ...                  # qui x è int
    else:
        ...                  # qui x è str</code></pre>
<h3>Altri strumenti</h3><ul><li><code>Never</code> e <code>assert_never</code> per controlli di esaustività.</li><li><code>Annotated[T, metadata]</code>: usata da Pydantic e FastAPI.</li><li><code>Self</code> per metodi fluenti; <code>@override</code> (3.12).</li></ul>
<h3>Come usarli bene</h3><ul><li>Annota prima le interfacce pubbliche; usa <code>Any</code> con parsimonia.</li><li>mypy/pyright in CI con <code>strict</code> sui moduli nuovi.</li><li>Un <code># type: ignore[codice]</code> deve avere un motivo.</li></ul>
<div class="say"><b>Cosa dire.</b> «Uso Protocol per le interfacce, ParamSpec per i decorator tipizzati e pyright strict in CI sul codice nuovo.»</div>`,
  [
    q(
      'q1',
      'Qual è la differenza tra Protocol e ABC?',
      [
        'Nessuna',
        'Protocol è strutturale (basta avere i metodi), ABC è nominale',
        'Protocol è più lento',
        'ABC non esiste più',
      ],
      1,
      'Protocol non richiede di ereditare.',
    ),
    q(
      'q2',
      'A cosa serve <code>ParamSpec</code>?',
      ['A tipizzare decorator conservando la firma originale', 'A fare parsing', 'A validare dati', 'A fare test'],
      0,
      'Cattura parametri della funzione decorata.',
    ),
    q(
      'q3',
      'Cosa fa <code>@overload</code>?',
      [
        'Esegue la funzione due volte',
        'Dichiara firme diverse per i type checker',
        'Rende la funzione veloce',
        'Sovrascrive metodi',
      ],
      1,
      "L'implementazione reale è una sola.",
    ),
    q(
      'q4',
      'A cosa serve <code>assert_never</code>?',
      ["A controllare l'esaustività di un match/if", 'A bloccare il programma', 'A importare', 'A loggare'],
      0,
      'Il type checker segnala i casi dimenticati.',
    ),
    q(
      'q5',
      'Cosa è <code>Annotated[int, ...]</code> usato per?',
      ['Metadati aggiuntivi sul tipo (Pydantic/FastAPI)', 'Commenti', 'Alias', 'Test'],
      0,
      'I framework leggono i metadati a runtime.',
    ),
  ],
  [
    card('c1', 'Interfaccia strutturale', 'class X(Protocol): def metodo(self) -> T: ...'),
    card('c2', 'Funzione generica 3.12', 'def primo[T](xs: list[T]) -> T | None.'),
    card('c3', 'Decorator tipizzato', 'Callable[P, R] con ParamSpec e P.args / P.kwargs.'),
    card('c4', 'Esaustività', 'case _: assert_never(x).'),
    card('c5', 'Dizionario tipizzato', 'class U(TypedDict): nome: str.'),
  ],
  [
    prac(
      'p1',
      'Tipizza un decorator <code>retry</code> che conserva la firma.',
      'Usa ParamSpec P e TypeVar R: Callable[P, R] → Callable[P, R] con wrapper(*a: P.args, **k: P.kwargs) -> R.',
    ),
    prac(
      'p2',
      'Quando Protocol e quando ABC?',
      'Protocol per interfacce leggere con più implementazioni esterne (duck typing tipizzato); ABC quando vuoi comportamento condiviso o istanze controllate.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/annotations.md',
)

export const metaprog = mod(
  'metaprog',
  'Metaprogrammazione: descriptor e metaclassi',
  '__getattr__, descriptor, __init_subclass__, metaclassi',
  'master',
  `<p class="lead">La metaprogrammazione è codice che scrive o modifica codice. È il motore di Django (modelli e campi), SQLAlchemy, Pydantic e dei decorator: capirla fa leggere quelle librerie senza magia.</p>
<h3>Prima di tutto: classi sono oggetti</h3><pre><code>Utente = type("Utente", (), {"nome": "Ada"})     # crea una classe a runtime
type(Utente)                                     # &lt;class 'type'&gt;</code></pre>
<p>Una classe è un'istanza di una <b>metaclasse</b> (di default <code>type</code>).</p>
<h3>Descriptor</h3><p>Un oggetto con <code>__get__</code>, <code>__set__</code> o <code>__delete__</code> messo come attributo di classe controlla l'accesso. Così funzionano <code>property</code>, i metodi e i campi dei modelli.</p>
<pre><code>class Positivo:
    def __set_name__(self, owner, name):
        self.nome = "_" + name
    def __get__(self, obj, tipo=None):
        if obj is None:
            return self
        return getattr(obj, self.nome)
    def __set__(self, obj, valore):
        if valore &lt; 0:
            raise ValueError("deve essere positivo")
        setattr(obj, self.nome, valore)

class Prodotto:
    prezzo = Positivo()

p = Prodotto(); p.prezzo = 10      # passa dal descriptor</code></pre>
<ul><li><b>Data descriptor</b> (ha <code>__set__</code>): ha la precedenza sul <code>__dict__</code> dell'istanza.</li><li><b>Non-data descriptor</b> (solo <code>__get__</code>): l'istanza lo può oscurare.</li><li><code>__set_name__</code> riceve il nome dell'attributo.</li></ul>
<h3>__init_subclass__: l'alternativa semplice</h3><pre><code>class Plugin:
    registro = {}
    def __init_subclass__(cls, nome=None, **kw):
        super().__init_subclass__(**kw)
        Plugin.registro[nome or cls.__name__] = cls

class Csv(Plugin, nome="csv"): ...
Plugin.registro      # {'csv': Csv}</code></pre>
<p>Per registrare sottoclassi o validare una gerarchia basta quasi sempre questo, senza metaclassi.</p>
<h3>Metaclassi</h3><pre><code>class Meta(type):
    def __new__(mcs, nome, basi, attrs):
        campi = {k: v for k, v in attrs.items() if isinstance(v, Campo)}
        cls = super().__new__(mcs, nome, basi, attrs)
        cls._campi = campi
        return cls

class Modello(metaclass=Meta): ...</code></pre>
<p>La metaclasse gira alla <b>creazione della classe</b>. Django la usa per raccogliere i campi di un modello.</p>
<h3>Altri strumenti</h3><ul><li><code>__getattr__</code>/<code>__setattr__</code> per proxy e oggetti dinamici.</li><li><code>__class_getitem__</code>: <code>Classe[T]</code>.</li><li><code>inspect</code>: firme, sorgente, membri; <code>getattr</code>/<code>setattr</code>/<code>hasattr</code>.</li><li>Decorator di classe: funzione che riceve e restituisce la classe (es. <code>@dataclass</code>).</li></ul>
<h3>Regola pratica</h3><p>Scala di complessità: funzione → decorator → <code>__init_subclass__</code> → descriptor → metaclasse. Usa il livello più basso che risolve il problema. Le metaclassi sono quasi sempre di troppo.</p>
<div class="say"><b>Cosa dire.</b> «Conosco descriptor e metaclassi perché li usano Django e SQLAlchemy, ma nel mio codice preferisco decorator e __init_subclass__.»</div>`,
  [
    q(
      'q1',
      'Cosa è una metaclasse?',
      ['La classe delle classi', 'Una classe astratta', 'Un decorator', 'Un modulo'],
      0,
      'Di default la metaclasse è type.',
    ),
    q(
      'q2',
      'Cosa distingue un data descriptor?',
      [
        "Ha __set__ (o __delete__) e ha precedenza sul __dict__ dell'istanza",
        'Ha solo __get__',
        'È immutabile',
        'È una dataclass',
      ],
      0,
      "I non-data descriptor possono essere oscurati dall'istanza.",
    ),
    q(
      'q3',
      'Per registrare tutte le sottoclassi di una base conviene…',
      ['una metaclasse', '__init_subclass__', 'un singleton', 'eval'],
      1,
      'È più semplice e sufficiente nella maggior parte dei casi.',
    ),
    q(
      'q4',
      'Quando viene eseguito <code>__set_name__</code>?',
      ['Alla creazione della classe che contiene il descriptor', 'A ogni accesso', "All'import del modulo solo", 'Mai'],
      0,
      "Riceve il nome dell'attributo.",
    ),
    q(
      'q5',
      'Chi usa le metaclassi in modo evidente?',
      ['I modelli Django', 'Il modulo math', 'print', 'sorted'],
      0,
      'Raccolgono i campi dichiarati nella classe.',
    ),
  ],
  [
    card('c1', 'Creare una classe a runtime', 'type("Nome", (Basi,), {attributi}).'),
    card('c2', 'Descriptor', '__get__, __set__, __delete__ su un attributo di classe.'),
    card('c3', 'Registro di sottoclassi', '__init_subclass__ nella base.'),
    card('c4', 'Scala di complessità', 'funzione → decorator → __init_subclass__ → descriptor → metaclasse.'),
    card('c5', "Nome dell'attributo", '__set_name__(self, owner, name) del descriptor.'),
  ],
  [
    prac(
      'p1',
      'Implementa un descriptor che valida un intervallo (min, max).',
      'Classe con __init__(min, max), __set_name__, __get__, __set__ che controlla il valore e salva su un attributo privato.',
    ),
    prac(
      'p2',
      'Spiega come Django raccoglie i campi di un modello.',
      'La metaclasse ModelBase scorre gli attributi della classe, registra i Field e li usa per costruire _meta e le colonne.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/metaclasses-descriptors.md',
)

export const prod = mod(
  'prod',
  'Python in produzione: log, config, sicurezza',
  'logging strutturato, configurazione 12-factor, errori, sicurezza',
  'master',
  `<p class="lead">Un servizio in produzione è molto più del codice che funziona: deve essere osservabile, configurabile e sicuro.</p>
<h3>Logging</h3><pre><code>import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
log = logging.getLogger(__name__)

log.info("ordine creato", extra={"order_id": 42})
try:
    ...
except Exception:
    log.exception("errore nel pagamento")      # include il traceback</code></pre>
<ul><li>Un logger per modulo con <code>getLogger(__name__)</code>; la configurazione si fa una volta, all'avvio.</li><li>Livelli: DEBUG, INFO, WARNING, ERROR, CRITICAL.</li><li>In produzione usa log <b>strutturati</b> (JSON, <code>structlog</code>) con un ID richiesta portato da <code>contextvars</code>.</li><li>Non loggare segreti, token o dati personali.</li><li>Logga <b>oppure</b> rilancia: loggare e rilanciare produce righe duplicate.</li></ul>
<h3>Configurazione (12-factor)</h3><pre><code>from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    debug: bool = False
    model_config = {"env_file": ".env"}

settings = Settings()      # legge variabili d'ambiente e valida i tipi</code></pre>
<ul><li>La configurazione vive nell'<b>ambiente</b>, non nel codice.</li><li>Valida all'avvio: fallire subito è meglio che fallire a metà richiesta.</li><li><code>.env</code> fuori da git; segreti in un secret manager.</li></ul>
<h3>Gestione degli errori</h3><ul><li>Eccezioni di dominio specifiche (<code>class ErroreOrdine(Exception)</code>) tradotte ai confini (HTTP 4xx/5xx).</li><li><code>raise ... from e</code> per mantenere la causa.</li><li>Retry con backoff solo su errori transitori e operazioni idempotenti.</li><li>Timeout su ogni chiamata di rete.</li></ul>
<h3>Sicurezza essenziale</h3><ul>
<li><b>SQL injection</b>: query parametrizzate sempre.</li>
<li><b>Input non fidato</b>: validare con Pydantic; mai <code>eval</code>/<code>exec</code>/<code>pickle.loads</code> su dati esterni.</li>
<li><b>Segreti</b>: <code>secrets</code> per i token, <code>hashlib</code>/<code>bcrypt</code>/<code>argon2</code> per le password, mai in chiaro.</li>
<li><b>Path traversal</b>: risolvi i percorsi e controlla che restino nella cartella consentita.</li>
<li><b>Dipendenze</b>: lockfile, <code>pip-audit</code>, aggiornamenti regolari.</li>
<li><b>subprocess</b>: lista di argomenti, mai <code>shell=True</code> con input utente.</li></ul>
<h3>Osservabilità</h3><ul><li>Metriche (richieste, latenza, errori), tracing (OpenTelemetry), health check (<code>/health</code>).</li><li>Sentry o simili per le eccezioni non gestite.</li></ul>
<h3>Deploy</h3><ul><li>Immagine slim, utente non root, un processo per container.</li><li>Gunicorn/uvicorn con più worker; graceful shutdown su SIGTERM.</li><li>Migrazioni di schema prima del rilascio del codice.</li></ul>
<div class="say"><b>Cosa dire.</b> «Log strutturati con ID richiesta, configurazione dall'ambiente validata all'avvio, query parametrizzate e nessun segreto nel codice.»</div>`,
  [
    q(
      'q1',
      'Dove va la configurazione secondo 12-factor?',
      ['Nel codice', "Nell'ambiente", 'Nel README', 'In una variabile globale'],
      1,
      'Così lo stesso artefatto gira in ambienti diversi.',
    ),
    q(
      'q2',
      'Perché evitare di loggare <b>e</b> rilanciare?',
      ['È più lento', 'Produce righe di log duplicate', 'Non è permesso', 'Perde il traceback'],
      1,
      "Logga al confine, dove l'errore viene gestito.",
    ),
    q(
      'q3',
      'Cosa non fare con dati non fidati?',
      ['json.loads', 'pickle.loads / eval', 'Validare con Pydantic', 'Query parametrizzate'],
      1,
      'Possono eseguire codice arbitrario.',
    ),
    q(
      'q4',
      'Come si porta un ID richiesta nei log tra funzioni e task?',
      ['Variabile globale', 'contextvars', 'print', 'Parametri ovunque'],
      1,
      'contextvars funziona anche con asyncio.',
    ),
    q(
      'q5',
      "Perché validare la configurazione all'avvio?",
      ['Per eleganza', 'Per fallire subito invece che a metà richiesta', 'Per sicurezza di rete', 'Non serve'],
      1,
      'Errori di config rilevati prima del traffico.',
    ),
  ],
  [
    card('c1', 'Logger per modulo', 'log = logging.getLogger(__name__).'),
    card('c2', 'Traceback nel log', 'log.exception("messaggio") dentro un except.'),
    card('c3', 'Config tipata', "pydantic_settings.BaseSettings dall'ambiente."),
    card('c4', 'Token sicuri', 'secrets.token_urlsafe().'),
    card('c5', 'subprocess sicuro', 'subprocess.run([lista, di, argomenti]) senza shell=True.'),
  ],
  [
    prac(
      'p1',
      'Prepara un servizio per la produzione: checklist.',
      'Config da env validata, log JSON con request id, timeout e retry, health check, metriche/tracing, Sentry, immagine non root, migrazioni, segreti nel secret manager.',
    ),
    prac(
      'p2',
      'Come gestisci un errore del pagamento tra servizio e API?',
      'Eccezione di dominio con causa (raise from), log una volta al confine, traduzione in risposta HTTP adeguata, nessun dato sensibile nel messaggio.',
    ),
  ],
  'Note del vault: python/logging-structured.md, python/config-env.md, python/security-patterns.md',
)

export const datasci = mod(
  'datasci',
  'Extra: dati con NumPy e pandas',
  'vettorizzazione, DataFrame, pulizia, aggregazioni, quando usarli',
  'master',
  `<p class="lead">Per i dati tabellari e numerici Python vince grazie a NumPy e pandas: il calcolo gira in C, tu scrivi operazioni su colonne intere.</p>
<h3>NumPy: array e vettorizzazione</h3><pre><code>import numpy as np

a = np.array([1, 2, 3, 4])
a * 2                   # [2 4 6 8]: nessun ciclo
a[a % 2 == 0]           # maschera booleana: [2 4]
m = np.arange(12).reshape(3, 4)
m.sum(axis=0)           # somma per colonna
m.mean(), m.std()</code></pre>
<ul><li>Un array ha un solo tipo (<code>dtype</code>) e memoria contigua: molto più compatto di una lista.</li><li><b>Broadcasting</b>: operazioni tra forme diverse (uno scalare, una riga) senza copie.</li><li>Evita i cicli Python sugli elementi: sono 10-100 volte più lenti.</li></ul>
<h3>pandas: DataFrame</h3><pre><code>import pandas as pd

df = pd.read_csv("vendite.csv", parse_dates=["data"])
df.head(); df.info(); df.describe()

df["totale"] = df["prezzo"] * df["quantita"]
grandi = df[df["totale"] &gt; 100]
per_citta = df.groupby("citta")["totale"].agg(["sum", "mean", "count"])
df.sort_values("totale", ascending=False).head(10)</code></pre>
<h3>Pulizia dei dati</h3><pre><code>df.isna().sum()                          # valori mancanti per colonna
df["eta"] = df["eta"].fillna(df["eta"].median())
df = df.drop_duplicates(subset=["id"])
df["citta"] = df["citta"].str.strip().str.title()
df["data"] = pd.to_datetime(df["data"], errors="coerce")</code></pre>
<h3>Unire e rimodellare</h3><pre><code>ordini.merge(clienti, on="cliente_id", how="left")      # come un JOIN SQL
pd.concat([a, b], ignore_index=True)
df.pivot_table(index="citta", columns="mese", values="totale", aggfunc="sum")</code></pre>
<h3>Buone pratiche</h3><ul><li>Operazioni <b>vettoriali</b> e <code>groupby</code>, non <code>iterrows</code>.</li><li>Evita il «chained assignment» (<code>df[a][b] = x</code>): usa <code>.loc[a, b] = x</code>.</li><li>Tipi giusti: <code>category</code> per colonne ripetitive, <code>int32</code>/<code>float32</code> per risparmiare memoria.</li><li>File grandi: <code>chunksize</code>, formato Parquet, oppure Polars/DuckDB per dati molto grandi.</li></ul>
<h3>Quando usarli</h3><ul><li>Sì: analisi, ETL, report, esplorazione, prototipi.</li><li>No: servizi web a bassa latenza con piccoli record (overhead), o dati che stanno in un database (fai la query in SQL).</li></ul>
<h3>Notebook</h3><p>Jupyter è ottimo per esplorare; per il codice di produzione sposta la logica in moduli testati e importala.</p>
<div class="say"><b>Cosa dire.</b> «Vettorizzo con NumPy e pandas, uso groupby e merge al posto dei cicli, e porto il codice stabile fuori dal notebook in moduli testati.»</div>`,
  [
    q(
      'q1',
      'Perché NumPy è più veloce dei cicli Python?',
      ['Usa codice in C su memoria contigua', 'Usa più thread sempre', 'È compilato JIT', 'Non lo è'],
      0,
      "Le operazioni vettoriali evitano l'interprete elemento per elemento.",
    ),
    q(
      'q2',
      'A cosa corrisponde <code>df.merge(...)</code>?',
      ['Un JOIN SQL', 'Un GROUP BY', 'Un ORDER BY', 'Una UNION'],
      0,
      'how= sceglie il tipo di join.',
    ),
    q(
      'q3',
      'Cosa è meglio di <code>iterrows</code>?',
      ['Operazioni vettoriali e groupby', 'Un ciclo for', 'apply sempre', 'recursion'],
      0,
      'iterrows è molto lento.',
    ),
    q(
      'q4',
      "Cos'è il broadcasting?",
      [
        'Operare tra array di forme diverse senza copie esplicite',
        'Inviare dati in rete',
        'Un tipo di join',
        'Un formato file',
      ],
      0,
      'Esempio: sommare una riga a ogni riga di una matrice.',
    ),
    q(
      'q5',
      'Quando NON usare pandas?',
      ['Per analisi di CSV', 'Per servizi a bassa latenza con piccoli record', 'Per ETL', 'Per report'],
      1,
      "L'overhead supera il beneficio; per dati in DB usa SQL.",
    ),
  ],
  [
    card('c1', 'Filtro', 'df[df["col"] > x] oppure df.query("col > @x").'),
    card('c2', 'Aggregare', 'df.groupby("k")["v"].agg(["sum", "mean"]).'),
    card('c3', 'Valori mancanti', 'df.isna().sum(); fillna, dropna.'),
    card('c4', 'Join', 'a.merge(b, on="id", how="left").'),
    card('c5', 'Assegnazione sicura', 'df.loc[mask, "col"] = valore (evita il chained assignment).'),
  ],
  [
    prac(
      'p1',
      'Dato un CSV di vendite, trova le 5 città con il totale maggiore.',
      'read_csv, calcola totale = prezzo*quantita, groupby("citta")["totale"].sum().nlargest(5).',
    ),
    prac(
      'p2',
      'Un notebook è diventato codice di produzione: cosa fai?',
      'Sposti la logica in moduli, aggiungi test (pytest), fissi le dipendenze, e il notebook importa i moduli.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/data-analysis-pandas.md',
)
