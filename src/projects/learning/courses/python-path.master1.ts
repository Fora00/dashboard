import { card, mod, prac, q } from './python-path.helpers'

// Group "master" (round 1): the data model, memory, idioms, modern syntax, CPython internals.
// Each module has a matching note in the owner's vault (knowledge/programming/backend/python).

export const datamodel = mod(
  'datamodel',
  'Il data model: i metodi speciali',
  'Come la sintassi di Python diventa chiamate a metodi dunder',
  'master',
  `<p class="lead">Il data model è il contratto tra i tuoi oggetti e l'interprete. <code>a + b</code>, <code>len(x)</code>, <code>for i in x</code>, <code>x[k]</code>, <code>with x:</code> e <code>x()</code> sono zucchero sintattico per chiamate a metodi speciali. Capito questo, Django, pandas e SQLAlchemy smettono di sembrare magia.</p>
<h3>Regola d'oro</h3><p>Python cerca il metodo speciale sul <b>tipo</b>, non sull'istanza. Quindi <code>obj.__len__ = ...</code> su un'istanza non cambia <code>len(obj)</code>. E non si chiamano i dunder a mano: si implementano.</p>
<h3>Rappresentazione</h3><pre><code>class Money:
    def __init__(self, amount, cur):
        self.amount, self.cur = amount, cur
    def __repr__(self):        # per sviluppatori: non ambiguo
        return f"Money({self.amount!r}, {self.cur!r})"
    def __str__(self):         # per utenti; se manca si usa __repr__
        return f"{self.amount:.2f} {self.cur}"</code></pre>
<p>Definisci sempre <code>__repr__</code>: è quello che vedi nel debugger, nel REPL e nei log.</p>
<h3>Uguaglianza, ordinamento, hash</h3><pre><code>from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, *parts): self.parts = parts
    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts == other.parts
    def __lt__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts &lt; other.parts
    def __hash__(self):
        return hash(self.parts)</code></pre>
<ul><li>Per tipi non supportati ritorna <code>NotImplemented</code>: Python prova l'operazione riflessa dell'altro operando.</li><li>Se definisci <code>__eq__</code> senza <code>__hash__</code>, la classe diventa <b>non hashable</b>.</li><li>Oggetti uguali devono avere hash uguale, e l'hash non deve cambiare finché l'oggetto è in un set o è chiave di dict.</li></ul>
<h3>Contenitori e iterazione</h3><div class="tblw"><table><tr><th>Protocollo</th><th>Metodi</th><th>Ottieni</th></tr>
<tr><td>Sized</td><td><code>__len__</code></td><td><code>len(x)</code>, truthiness</td></tr>
<tr><td>Container</td><td><code>__contains__</code></td><td><code>in</code></td></tr>
<tr><td>Iterable</td><td><code>__iter__</code></td><td>for, unpacking, list(), sum()</td></tr>
<tr><td>Sequence</td><td><code>__getitem__</code> + <code>__len__</code></td><td>indici, slicing, reversed</td></tr>
<tr><td>Mapping</td><td><code>__getitem__</code>, <code>__iter__</code>, <code>__len__</code></td><td>comportamento da dict</td></tr></table></div>
<p>Eredita da <code>collections.abc</code> (<code>Sequence</code>, <code>Mapping</code>) per avere tutta l'API da pochi metodi. Per modificare il comportamento di un dict usa <code>UserDict</code>: la classe <code>dict</code> built-in ignora spesso i tuoi override.</p>
<h3>Operatori</h3><pre><code>class Vec:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, o):  return Vec(self.x + o.x, self.y + o.y)
    def __rmul__(self, k): return Vec(self.x * k, self.y * k)   # 3 * v
    def __iadd__(self, o): self.x += o.x; self.y += o.y; return self
    def __bool__(self):    return bool(self.x or self.y)</code></pre>
<p>Gli operatori binari restituiscono un <b>nuovo</b> oggetto. <code>a + b</code> prova <code>a.__add__(b)</code>, poi <code>b.__radd__(a)</code>.</p>
<h3>Chiamabili, context manager, attributi</h3><ul><li><code>__call__</code>: l'istanza si usa come funzione (decorator con stato).</li><li><code>__enter__</code>/<code>__exit__</code>: <code>with</code>; se <code>__exit__</code> restituisce True, l'eccezione viene soppressa.</li><li><code>__getattr__</code>: chiamato solo se la ricerca normale <b>fallisce</b>; <code>__getattribute__</code>: ogni accesso (facile cadere in ricorsione).</li><li><code>__new__</code> crea l'oggetto, <code>__init__</code> lo inizializza.</li></ul>
<div class="say"><b>Cosa dire.</b> «Implemento il protocollo più piccolo che mi serve e lascio il resto alle ABC di collections.abc; eq e hash vanno sempre insieme.»</div>`,
  [
    q(
      'q1',
      "Perché <code>len(obj)</code> ignora un <code>obj.__len__</code> assegnato sull'istanza?",
      [
        "Python cerca il metodo speciale sul tipo, non sull'istanza",
        'È un bug',
        'len è una keyword',
        'Solo con le slot',
      ],
      0,
      'I metodi speciali sono risolti sulla classe.',
    ),
    q(
      'q2',
      'Cosa succede se definisci <code>__eq__</code> e non <code>__hash__</code>?',
      ['Le istanze diventano non hashable', 'Python lo genera', 'Errore alla definizione', 'Niente'],
      0,
      'Python imposta __hash__ a None per evitare incoerenze.',
    ),
    q(
      'q3',
      'Cosa deve ritornare <code>__eq__</code> per un tipo non supportato?',
      ['False', 'NotImplemented', 'None', "Un'eccezione"],
      1,
      "Permette a Python di provare l'operazione riflessa.",
    ),
    q(
      'q4',
      'Quando viene chiamato <code>__getattr__</code>?',
      ["Solo se la ricerca normale dell'attributo fallisce", 'A ogni accesso', 'Solo in scrittura', 'Alla creazione'],
      0,
      '__getattribute__ è invece chiamato sempre.',
    ),
    q(
      'q5',
      'Quale base conviene estendere per modificare il comportamento di un dict?',
      ['dict', 'UserDict', 'object', 'list'],
      1,
      'I metodi C di dict non chiamano i tuoi override.',
    ),
  ],
  [
    card(
      'c1',
      '__repr__ vs __str__',
      'repr: non ambiguo, per sviluppatori. str: leggibile, per utenti; ricade su repr.',
    ),
    card('c2', 'Hash e uguaglianza', "Oggetti uguali → stesso hash; hash stabile finché l'oggetto è in un set/dict."),
    card('c3', 'Operatore riflesso', 'a + b prova a.__add__(b), poi b.__radd__(a).'),
    card('c4', 'Sequence minimo', '__getitem__ + __len__ (ereditando da collections.abc.Sequence).'),
    card('c5', '__new__ vs __init__', "__new__ crea l'istanza; __init__ la inizializza."),
  ],
  [
    prac(
      'p1',
      'Implementa una classe Playlist che si comporta come una sequenza.',
      '__len__, __getitem__ (int e slice), __contains__ e magari __iter__; oppure eredita da collections.abc.Sequence.',
    ),
    prac(
      'p2',
      'Spiega perché un tipo mutabile non dovrebbe essere hashable.',
      'Se cambia lo stato, cambia l\'hash e l\'oggetto "sparisce" da set e dict dove era stato inserito.',
    ),
    prac(
      'p3',
      'Scrivi un oggetto Timer usabile con with.',
      '__enter__ salva perf_counter e ritorna self; __exit__ calcola elapsed e ritorna False per non nascondere errori.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/python-data-model.md',
)

export const memory = mod(
  'memory',
  'Modello di memoria e garbage collector',
  'Nomi e oggetti, mutabilità, refcount, GC ciclico, weakref, slots',
  'master',
  `<p class="lead">In Python le variabili sono <b>nomi legati a oggetti</b>, non scatole che contengono valori. Capire identità, mutabilità e come CPython libera la memoria spiega la maggior parte dei bug "strani".</p>
<h3>Nomi, identità, mutabilità</h3><pre><code>a = [1, 2]
b = a              # stesso oggetto, due nomi
b.append(3)
a                  # [1, 2, 3]
a is b             # True (identità)
a == [1, 2, 3]     # True (valore): domanda diversa

x = (1, [2])       # tupla immutabile con dentro una lista mutabile
x[1].append(3)     # permesso: i riferimenti della tupla non cambiano</code></pre>
<ul><li><b>Immutabili</b>: int, float, str, bytes, tuple, frozenset. «Modificare» crea un nuovo oggetto.</li><li><b>Mutabili</b>: list, dict, set, la maggior parte delle classi tue.</li><li>Usa <code>is</code> solo per singleton (<code>None</code>, <code>True</code>, sentinelle). Confrontare numeri o stringhe con <code>is</code> è un errore: piccoli interi e alcune stringhe sono in cache (interning) come dettaglio dell'implementazione.</li></ul>
<h3>Passaggio degli argomenti</h3><p>Python passa <b>riferimenti agli oggetti per valore</b> ("call by sharing"). La funzione riceve un nuovo nome per lo stesso oggetto: se lo muta, il chiamante lo vede; se lo riassegna, no.</p>
<pre><code>def f(lst):
    lst.append(1)    # visibile al chiamante
    lst = [0]        # riassegnazione: invisibile</code></pre>
<h3>Copie</h3><pre><code>import copy
a = [[1], [2]]
a.copy(); list(a); a[:]      # superficiale: stessa lista interna
copy.deepcopy(a)             # ricorsiva, gestisce i cicli, può essere lenta</code></pre>
<p>Trappola classica: <code>[[0]*3]*3</code> crea <b>tre riferimenti alla stessa</b> lista interna. Si scrive <code>[[0]*3 for _ in range(3)]</code>.</p>
<h3>Reference counting</h3><p>CPython conta i riferimenti a ogni oggetto. Quando il contatore arriva a zero l'oggetto viene liberato subito e gira <code>__del__</code>. È deterministico in CPython ma <b>non garantito dal linguaggio</b> (PyPy è diverso): per le risorse usa <code>with</code>, non <code>__del__</code>.</p>
<h3>Garbage collector ciclico</h3><p>Il refcount non libera i cicli (<code>a.other = b; b.other = a</code>). Un GC a generazioni (0, 1, 2) cerca periodicamente cicli irraggiungibili.</p>
<pre><code>import gc
gc.collect()
gc.get_threshold()      # es. (700, 10, 10) fino a 3.12; cambia tra versioni
gc.disable()            # a volte nei job batch sensibili alla latenza</code></pre>
<h3>Riferimenti deboli</h3><pre><code>import weakref
ref = weakref.ref(oggetto)
ref()                                     # l'oggetto, o None se morto
cache = weakref.WeakValueDictionary()     # le voci spariscono quando i valori muoiono</code></pre>
<p>Servono per cache, osservatori e puntatori al padre senza creare cicli.</p>
<h3>Ingombro in memoria</h3><ul><li>Ogni istanza ha un <code>__dict__</code>. Con <code>__slots__ = ("x", "y")</code> (o <code>@dataclass(slots=True)</code>) si risparmia circa il 40-60% e l'accesso è più rapido, ma non puoi aggiungere attributi dinamici.</li><li>Generatori al posto di liste per pipeline grandi.</li><li><code>array</code>, NumPy e <code>memoryview</code> evitano l'overhead per elemento.</li><li><code>tracemalloc</code> per trovare chi alloca.</li></ul>
<div class="say"><b>Cosa dire.</b> «Prima di mutare dati condivisi mi chiedo quali nomi puntano a quell'oggetto; le risorse le chiudo con with, non con __del__.»</div>`,
  [
    q(
      'q1',
      'Cosa produce <code>[[0]*3]*3</code> modificando una riga?',
      ['Cambia solo quella riga', 'Cambia tutte le righe: sono lo stesso oggetto', 'Errore', 'Copia profonda'],
      1,
      'La moltiplicazione ripete il riferimento, non copia la lista interna.',
    ),
    q(
      'q2',
      'Python passa gli argomenti…',
      [
        'per valore copiando gli oggetti',
        'per riferimento puro',
        'riferimenti per valore (call by sharing)',
        'sempre per copia profonda',
      ],
      2,
      'La funzione ha un nuovo nome per lo stesso oggetto.',
    ),
    q(
      'q3',
      'Cosa libera un ciclo di riferimenti tra due oggetti?',
      ['Il refcount', 'Il garbage collector ciclico', 'Niente', 'Il compilatore'],
      1,
      'Il refcount non arriva mai a zero nei cicli.',
    ),
    q(
      'q4',
      'A cosa serve <code>weakref</code>?',
      ['A riferire un oggetto senza tenerlo in vita', 'A copiare oggetti', 'A bloccare il GC', 'A compilare'],
      0,
      'Utile per cache e puntatori al padre.',
    ),
    q(
      'q5',
      'Perché non usare <code>is</code> per confrontare numeri?',
      ['È più lento', "L'interning è un dettaglio dell'implementazione", 'Dà sempre False', 'Non è permesso'],
      1,
      "is confronta l'identità, non il valore.",
    ),
  ],
  [
    card('c1', 'is vs ==', 'is: stesso oggetto (identità). ==: stesso valore. is solo per None e sentinelle.'),
    card('c2', 'Copia superficiale', 'list(a), a.copy(), a[:]: stesse liste interne. deepcopy copia ricorsivamente.'),
    card('c3', 'Refcount a zero', "L'oggetto è liberato subito (CPython); non affidarti a __del__."),
    card('c4', '__slots__', 'Niente __dict__ per istanza: meno memoria, niente attributi dinamici.'),
    card('c5', 'Matrice di zeri', '[[0]*3 for _ in range(3)] (mai [[0]*3]*3).'),
  ],
  [
    prac(
      'p1',
      'Spiega a voce perché <code>def f(x, l=[])</code> è un bug usando il modello di memoria.',
      'Il default è un unico oggetto creato alla definizione: tutte le chiamate ricevono lo stesso riferimento e lo mutano.',
    ),
    prac(
      'p2',
      'Hai una cache che cresce senza fine. Cosa proponi?',
      'WeakValueDictionary se le voci dipendono dalla vita di altri oggetti, oppure lru_cache(maxsize=N)/TTL; misura con tracemalloc.',
    ),
    prac(
      'p3',
      'Quando usare deepcopy e quando evitarlo?',
      'Per strutture annidate mutabili che devi isolare; evitalo su grafi grandi (lento): meglio costruire nuovi oggetti.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/memory-model-and-gc.md',
)

export const idioms = mod(
  'idioms',
  'Scrivere Pythonic: gli idiomi',
  'EAFP, prima/dopo, unpacking, duck typing, libreria standard prima',
  'master',
  `<p class="lead">«Pythonic» significa usare gli strumenti del linguaggio (protocolli di iterazione, unpacking, comprehension, context manager, duck typing) invece di tradurre abitudini da C, Java o JS. Il codice idiomatico è più corto, più veloce e più leggibile per gli altri.</p>
<h3>EAFP contro LBYL</h3><p><b>EAFP</b>: «meglio chiedere perdono che permesso»: provi e gestisci l'eccezione. <b>LBYL</b>: «guarda prima di saltare»: controlli prima.</p>
<pre><code># LBYL: due ricerche e una race condition
if "k" in d:
    v = d["k"]
else:
    v = default

# Idiomatico
v = d.get("k", default)

try:
    n = int(testo)
except ValueError:
    n = None</code></pre>
<p>EAFP vince con file, dict, attributi e dovunque ci siano race. LBYL va bene se il controllo è economico e il fallimento è frequente.</p>
<h3>Prima e dopo</h3><div class="tblw"><table><tr><th>Invece di</th><th>Scrivi</th></tr>
<tr><td><code>for i in range(len(xs))</code></td><td><code>for i, x in enumerate(xs)</code></td></tr>
<tr><td><code>tmp = a; a = b; b = tmp</code></td><td><code>a, b = b, a</code></td></tr>
<tr><td><code>if len(xs) == 0</code></td><td><code>if not xs</code></td></tr>
<tr><td><code>if x == None</code></td><td><code>if x is None</code></td></tr>
<tr><td><code>out = []; for ...: out.append(f(x))</code></td><td><code>[f(x) for x in xs]</code></td></tr>
<tr><td><code>s += p</code> in un ciclo</td><td><code>"".join(parti)</code></td></tr>
<tr><td><code>f = open(); ...; f.close()</code></td><td><code>with open() as f</code></td></tr>
<tr><td><code>if k not in d: d[k] = []</code></td><td><code>d.setdefault(k, [])</code> o <code>defaultdict(list)</code></td></tr>
<tr><td><code>type(x) == int</code></td><td><code>isinstance(x, int)</code></td></tr></table></div>
<h3>Unpacking e stelle</h3><pre><code>primo, *resto = items
testa, *mezzo, coda = items
unito = {**default, **override}      # il secondo vince
tutti = [*xs, *ys]
f(*args, **kwargs)</code></pre>
<h3>Truthiness e short-circuit</h3><pre><code>nome = input_utente or "anonimo"          # primo valore truthy
ok = all(controlla(x) for x in xs)       # si ferma al primo False
trovato = next((x for x in xs if pred(x)), None)</code></pre>
<p>Attenzione: <code>0</code>, <code>""</code>, <code>[]</code> sono falsy. Se zero o vuoto sono valori validi usa <code>is None</code>.</p>
<h3>Duck typing e libreria standard</h3><ul><li>Chiedi comportamenti, non tipi: «qualcosa di iterabile», «qualcosa con .read()». Documentalo con <code>Protocol</code>.</li><li>Controlla la libreria standard prima di una dipendenza: <code>pathlib</code>, <code>collections</code>, <code>itertools</code>, <code>functools.cache</code>, <code>dataclasses</code>, <code>enum</code>, <code>zoneinfo</code>, <code>tempfile</code>, <code>secrets</code>.</li></ul>
<h3>Funzioni piccole, argomenti chiari</h3><pre><code>def scarica(url, *, timeout=10, retries=3): ...     # keyword-only dopo l'asterisco
sorted(utenti, key=lambda u: (u.cognome, u.nome))</code></pre>
<p>Evita argomenti booleani "flag": dividi in due funzioni o usa keyword-only.</p>
<h3>Pattern frequenti</h3><ul><li><b>Sentinella</b> quando <code>None</code> è un valore valido: <code>_MISSING = object()</code>.</li><li><b>Dispatch dict</b> al posto di lunghi if/elif: <code>handlers[kind](x)</code>.</li><li><b>Guard clause</b>: ritorno anticipato per appiattire l'annidamento.</li></ul>
<div class="say"><b>Cosa dire.</b> «Prima uso gli idiomi del linguaggio e la libreria standard; scelgo chiarezza prima della furbizia.»</div>`,
  [
    q(
      'q1',
      'Cosa significa EAFP?',
      ["Provo e gestisco l'eccezione", 'Controllo sempre prima', 'Evito le eccezioni', 'Uso solo if'],
      0,
      'È lo stile preferito in Python per file, dict e attributi.',
    ),
    q(
      'q2',
      'Qual è lo scambio idiomatico di due variabili?',
      ['tmp = a; a = b; b = tmp', 'a, b = b, a', 'swap(a, b)', 'a = b = a'],
      1,
      'Usa packing e unpacking di tuple.',
    ),
    q(
      'q3',
      'Come si controlla una lista vuota in modo idiomatico?',
      ['len(xs) == 0', 'xs == []', 'not xs', 'xs is None'],
      2,
      'Le sequenze vuote sono falsy.',
    ),
    q(
      'q4',
      'Come si concatenano molte stringhe in modo efficiente?',
      ['+= in un ciclo', '"".join(parti)', 'sum(parti)', 'format'],
      1,
      'join è lineare; += ripetuto può diventare quadratico.',
    ),
    q(
      'q5',
      'Quando usare <code>is None</code> invece di <code>if x</code>?',
      ['Mai', 'Quando 0 o vuoto sono valori validi', 'Solo con le liste', 'Solo nei test'],
      1,
      'if x tratta 0 e "" come assenti.',
    ),
  ],
  [
    card('c1', 'Indice e valore', 'for i, x in enumerate(xs):'),
    card('c2', 'Unire dict', '{**a, **b} oppure a | b (3.9+).'),
    card('c3', 'Primo che soddisfa', 'next((x for x in xs if pred(x)), None).'),
    card('c4', 'Argomento solo per nome', 'def f(a, *, timeout=10).'),
    card('c5', 'Dispatch', 'dict di funzioni al posto di if/elif lunghi.'),
  ],
  [
    prac(
      'p1',
      'Riscrivi in modo idiomatico: <code>out = []; for i in range(len(xs)): if xs[i] % 2 == 0: out.append(xs[i] * 2)</code>.',
      '[x * 2 for x in xs if x % 2 == 0]',
    ),
    prac(
      'p2',
      'Spiega EAFP con un esempio di race condition su un file.',
      'Controllare os.path.exists e poi aprire lascia una finestra in cui il file può sparire; try/open/except FileNotFoundError è atomico nel senso giusto.',
    ),
    prac(
      'p3',
      'Quando una classe è di troppo?',
      'Se hai solo dati: dataclass o dict; se hai solo una funzione con stato leggero: closure o functools.partial.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/python-idioms.md',
)

export const modern = mod(
  'modern',
  'Python moderno: 3.10 – 3.13',
  'match/case, nuovi tipi, TaskGroup, walrus, free-threading',
  'master',
  `<p class="lead">Le versioni recenti cambiano l'aspetto del codice idiomatico: pattern matching, unioni con <code>|</code>, nuova sintassi per i generici, errori più chiari, runtime più veloce. Per i servizi nuovi punta a 3.11 o più.</p>
<div class="tblw"><table><tr><th>Versione</th><th>Novità principali</th></tr>
<tr><td>3.9</td><td><code>list[int]</code>, <code>dict | dict</code>, <code>zoneinfo</code></td></tr>
<tr><td>3.10</td><td><code>match</code>/<code>case</code>, <code>X | Y</code>, <code>zip(strict=True)</code></td></tr>
<tr><td>3.11</td><td>molto più veloce, <code>TaskGroup</code>, <code>except*</code>, <code>tomllib</code>, <code>Self</code></td></tr>
<tr><td>3.12</td><td><code>type X = ...</code>, <code>class A[T]</code>, <code>itertools.batched</code></td></tr>
<tr><td>3.13</td><td>build free-threaded sperimentale (senza GIL), JIT sperimentale</td></tr>
<tr><td>3.14</td><td>build free-threaded supportata ma opzionale (PEP 779), annotazioni rinviate (PEP 649), t-string</td></tr></table></div>
<h3>Pattern matching</h3><p><code>match</code> destruttura i dati per <b>forma</b>: non è lo switch del C.</p>
<pre><code>def gestisci(ev):
    match ev:
        case {"type": "click", "pos": (x, y)}:
            return f"click in {x},{y}"
        case {"type": "key", "key": "q" | "Q"}:
            return "esci"
        case {"type": "key", "key": str(k)} if k.isdigit():
            return f"cifra {k}"
        case [primo, *resto]:
            return f"lista che inizia con {primo}"
        case Punto(x=0, y=0):
            return "origine"
        case _:
            return "sconosciuto"</code></pre>
<ul><li>Pattern: letterali, nomi (catturano), <code>_</code>, sequenze, mapping (chiavi extra ammesse), classi, OR con <code>|</code>, guardie con <code>if</code>.</li><li>Un nome nudo <b>cattura sempre</b>: per confrontare con una costante usa un nome puntato (<code>Colore.ROSSO</code>).</li><li>Ottimo per comandi, eventi e payload JSON; per confronti semplici bastano if o un dict.</li></ul>
<h3>Tipi moderni</h3><pre><code>def trova(id: int) -&gt; Utente | None: ...

type Json = dict[str, "Json"] | list["Json"] | str | int | None   # 3.12

class Pila[T]:                      # 3.12
    def push(self, x: T) -&gt; None: ...

from typing import Self
class Builder:
    def aggiungi(self, x) -&gt; Self:
        return self</code></pre>
<h3>Walrus e parametri</h3><pre><code>if (n := len(items)) &gt; 10:
    print(n)
while chunk := f.read(8192):
    elabora(chunk)

def f(a, b, /, c, *, d): ...     # a,b solo posizionali; d solo per nome</code></pre>
<h3>Concorrenza strutturata (3.11)</h3><pre><code>async with asyncio.TaskGroup() as tg:
    t1 = tg.create_task(scarica("a"))
    t2 = tg.create_task(scarica("b"))
# se una fallisce, le altre vengono cancellate e sale un ExceptionGroup

try:
    ...
except* ValueError as eg:
    for e in eg.exceptions: ...</code></pre>
<h3>Libreria standard da conoscere</h3><ul><li><code>tomllib</code>, <code>zoneinfo</code>, <code>graphlib.TopologicalSorter</code>.</li><li><code>itertools.batched</code> e <code>pairwise</code>.</li><li><code>StrEnum</code>, <code>dataclass(slots=True, kw_only=True)</code>.</li><li><code>str.removeprefix</code>, <code>Path.walk()</code>.</li></ul>
<h3>Prestazioni e GIL</h3><p>3.11 specializza le istruzioni a runtime; 3.12 ha un GIL per interprete; 3.13 ha introdotto una build <b>senza GIL</b> sperimentale (PEP 703); da 3.14 è supportata ma resta opzionale (PEP 779). Non contare sul parallelismo dei thread in produzione finché le estensioni C che usi non sono pronte.</p>
<div class="say"><b>Cosa dire.</b> «Uso match per dati strutturati, X | None per gli opzionali e TaskGroup per la concorrenza; fisso requires-python e lo testo in CI.»</div>`,
  [
    q(
      'q1',
      'Cosa fa <code>case RED:</code> (nome nudo) in un match?',
      ['Confronta con la costante RED', 'Cattura il valore in RED e matcha sempre', 'Errore', 'Niente'],
      1,
      'Per confrontare con una costante usa un nome puntato o un letterale.',
    ),
    q(
      'q2',
      'Cosa succede in un <code>TaskGroup</code> se un task fallisce?',
      [
        'Gli altri continuano',
        'Gli altri sono cancellati e sale un ExceptionGroup',
        'Il programma termina senza errore',
        'Niente',
      ],
      1,
      'È concorrenza strutturata.',
    ),
    q(
      'q3',
      'Come si scrive "int oppure None"?',
      ['Optional[int] soltanto', 'int | None', 'int or None', 'Maybe[int]'],
      1,
      "L'unione con | è disponibile da 3.10.",
    ),
    q(
      'q4',
      'Cosa è la build free-threaded di 3.13?',
      ['Una build senza GIL, sperimentale', 'Un nuovo garbage collector', 'Un compilatore AOT', 'Una libreria'],
      0,
      'Molte estensioni C non sono ancora pronte.',
    ),
    q(
      'q5',
      'A cosa serve <code>/</code> nella firma <code>def f(a, b, /, c)</code>?',
      ['Divisione', 'Rende a e b solo posizionali', 'Commento', 'Rende c opzionale'],
      1,
      'I parametri prima di / non accettano il nome.',
    ),
  ],
  [
    card('c1', 'Unione di tipi', 'X | Y (3.10+), X | None per gli opzionali.'),
    card('c2', 'Walrus', 'if (n := f()) > 3: assegna e usa nella stessa espressione.'),
    card('c3', 'Generico 3.12', 'class Pila[T]: e def f[T](x: T) -> T:'),
    card('c4', 'Gruppo di eccezioni', 'except* ValueError as eg: gestisce quelle del gruppo.'),
    card('c5', 'Prendere a blocchi', 'itertools.batched(iter, n) (3.12).'),
  ],
  [
    prac(
      'p1',
      'Scrivi con match un parser di comandi tipo ["move", x, y] e ["say", testo].',
      'case ["move", int(x), int(y)]: ...; case ["say", str(t)]: ...; case _: ...',
    ),
    prac(
      'p2',
      'Perché TaskGroup è meglio di gather?',
      'Cancella i task fratelli in caso di errore e propaga un ExceptionGroup: niente task orfani.',
    ),
    prac(
      'p3',
      'Come scegli la versione minima di Python di un servizio?',
      'La più recente supportata dalla piattaforma e dalle dipendenze (3.11+), fissata in requires-python e testata in CI.',
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/modern-python-syntax.md',
)

export const internals = mod(
  'internals',
  'Interni di CPython: bytecode, GIL e prestazioni',
  'Cosa succede davvero quando lanci python app.py',
  'master',
  `<p class="lead">CPython è un interprete di <b>bytecode</b>: sorgente → AST → bytecode (<code>.pyc</code> in <code>__pycache__</code>) → eseguito da un loop in C. Capirlo serve a debuggare prestazioni e concorrenza.</p>
<h3>Bytecode con dis</h3><pre><code>import dis

def f(a, b):
    return a + b * 2

dis.dis(f)
# LOAD_FAST a / LOAD_FAST b / LOAD_CONST 2 / BINARY_OP * / BINARY_OP + / RETURN_VALUE</code></pre>
<p>Le variabili locali (<code>LOAD_FAST</code>, accesso per indice) sono più veloci delle globali (<code>LOAD_GLOBAL</code>, ricerca in dict) e degli attributi. Da 3.11 le istruzioni "calde" vengono <b>specializzate</b> a runtime.</p>
<h3>Tutto è un PyObject</h3><p>Ogni oggetto ha refcount e puntatore al tipo. Un <code>int</code> pesa circa 28 byte e una lista contiene puntatori: un milione di interi in lista occupa molto più di un <code>array('i')</code>. Per questo il calcolo numerico va su NumPy o su codice C.</p>
<h3>Ricerca dei nomi</h3><ul><li><b>LEGB</b>: Local, Enclosing (closure), Global, Builtin.</li><li>Per gli attributi: <code>__dict__</code> dell'istanza e MRO del tipo, con i <b>data descriptor</b> che hanno la precedenza (<code>property</code>, campi Django); le funzioni sono non-data descriptor (solo <code>__get__</code>): così nascono i metodi legati e un attributo d'istanza può oscurarli.</li></ul>
<h3>Il GIL</h3><p>Il <b>Global Interpreter Lock</b> fa eseguire il bytecode a un solo thread alla volta per interprete: semplifica refcount e interni.</p>
<ul><li>Si rilascia durante I/O bloccante, <code>time.sleep</code> e in molte estensioni C (NumPy, hashing, compressione).</li><li><b>I/O-bound</b>: thread e asyncio aiutano. <b>CPU-bound</b> in Python puro: servono processi o codice nativo.</li><li>3.12: GIL per interprete. 3.13: build senza GIL sperimentale; 3.14: supportata, opzionale.</li></ul>
<h3>Import e .pyc</h3><p><code>import x</code> cerca il modulo in <code>sys.path</code>, lo esegue <b>una volta</b>, lo mette in <code>sys.modules</code> e scrive il bytecode. La seconda volta è una ricerca in un dict. Per questo gli import circolari vedono moduli a metà.</p>
<h3>Dove Python è lento, e i rimedi</h3><div class="tblw"><table><tr><th>Causa</th><th>Rimedio</th></tr>
<tr><td>Cicli stretti su numeri in Python puro</td><td>NumPy, <code>sum</code>/<code>map</code>, Cython, Rust</td></tr>
<tr><td>Ricerche ripetute di globali/attributi</td><td>assegnali a variabili locali</td></tr>
<tr><td><code>+=</code> su stringhe</td><td><code>"".join</code></td></tr>
<tr><td>Test di appartenenza su liste</td><td><code>set</code> o <code>dict</code> (O(1) medio)</td></tr>
<tr><td>Accidentali O(n²) (<code>insert(0)</code>, slicing ripetuto)</td><td><code>deque</code>, indici</td></tr>
<tr><td>I/O fatto uno alla volta</td><td>asyncio, thread, batching</td></tr></table></div>
<p><b>Misura sempre prima</b>: <code>timeit</code>, <code>cProfile</code>, <code>py-spy</code>, <code>tracemalloc</code>. Un algoritmo migliore batte quasi ogni micro-ottimizzazione.</p>
<h3>Altre implementazioni</h3><p>PyPy (JIT, ottimo per Python puro di lunga durata), MicroPython. Comportamenti come il refcount immediato o il valore di <code>id()</code> possono cambiare: non farci affidamento.</p>
<div class="say"><b>Cosa dire.</b> «Profilo, trovo il 5% caldo e ottimizzo solo quello; spingo i cicli pesanti su librerie in C e uso i processi per la CPU.»</div>`,
  [
    q(
      'q1',
      'Cosa fa il modulo <code>dis</code>?',
      ['Mostra il bytecode di una funzione', 'Disassembla file binari', 'Misura il tempo', 'Controlla i tipi'],
      0,
      'Utile per capire il costo delle operazioni.',
    ),
    q(
      'q2',
      'Quando il GIL viene rilasciato?',
      ['Mai', 'Durante I/O bloccante e in molte estensioni C', 'Solo con asyncio', 'Solo con multiprocessing'],
      1,
      "Per questo i thread aiutano sull'I/O.",
    ),
    q(
      'q3',
      'Perché una variabile locale è più veloce di una globale?',
      ['È un indice in un array, non una ricerca in un dict', 'È in cache CPU', 'È più piccola', 'Non lo è'],
      0,
      'LOAD_FAST contro LOAD_GLOBAL.',
    ),
    q(
      'q4',
      'Cosa succede alla seconda <code>import x</code> dello stesso modulo?',
      ['Lo riesegue', 'Lo prende da sys.modules', 'Errore', 'Lo ricompila'],
      1,
      'Il codice a livello di modulo gira una sola volta.',
    ),
    q(
      'q5',
      'Primo passo prima di ottimizzare?',
      ['Riscrivere in C', 'Misurare con un profiler', 'Aggiungere thread', 'Disabilitare il GC'],
      1,
      'Ottimizza solo ciò che il profilo mostra essere caldo.',
    ),
  ],
  [
    card('c1', 'LEGB', 'Local, Enclosing, Global, Builtin: ordine di ricerca dei nomi.'),
    card('c2', 'CPU-bound', 'Processi (multiprocessing) o codice nativo, non thread.'),
    card('c3', 'Bytecode', 'Il file .pyc in __pycache__; si ispeziona con dis.dis(f).'),
    card('c4', 'Appartenenza veloce', 'set/dict: O(1) medio; list: O(n).'),
    card('c5', 'Profilare', 'timeit (micro), cProfile (funzioni), py-spy (processo vivo), tracemalloc (memoria).'),
  ],
  [
    prac(
      'p1',
      'Un endpoint è lento: come procedi?',
      'Riproduci con dati realistici, profila (cProfile/py-spy), identifica I/O contro CPU, ottimizza il punto caldo (query, algoritmo, batching, cache), rimisura.',
    ),
    prac(
      'p2',
      'Spiega a voce il GIL a un collega Node.',
      "Un solo thread esegue bytecode alla volta; i thread aiutano sull'I/O, non sulla CPU; per il calcolo servono processi.",
    ),
    prac(
      'p3',
      'Perché 1 milione di interi in una lista pesano tanto?',
      "Una lista contiene puntatori a oggetti int separati (~28 byte l'uno); array o NumPy memorizzano i valori contigui.",
    ),
  ],
  'Nota del vault: knowledge/programming/backend/python/cpython-internals.md',
)
