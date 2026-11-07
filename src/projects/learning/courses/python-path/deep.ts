// Extra theory appended to the lessons of the first modules ("Approfondimento").
// Keyed by module id; applied in python-path.ts.
export const deepDive: Record<string, string> = {
  basics: `<h3>Approfondimento: numeri, stringhe e controllo di flusso</h3>
<h4>Numeri</h4><ul><li><code>int</code> ha precisione arbitraria: <code>2 ** 200</code> funziona. <code>float</code> è un double IEEE 754: <code>0.1 + 0.2 != 0.3</code>. Per il denaro usa <code>decimal.Decimal</code> o interi in centesimi.</li><li><code>round(2.5)</code> dà 2 (arrotondamento «bancario»): usa <code>Decimal.quantize</code> se serve l'arrotondamento commerciale.</li><li>Confronto tra float: <code>math.isclose(a, b)</code>. Underscore leggibili: <code>1_000_000</code>.</li><li><code>divmod(7, 2)</code> restituisce <code>(3, 1)</code>; <code>abs</code>, <code>pow</code>, <code>min</code>, <code>max</code>, <code>sum</code> sono funzioni built-in.</li></ul>
<h4>Stringhe e testo</h4><ul><li>Le stringhe sono sequenze di <b>caratteri Unicode</b>; i <code>bytes</code> sono sequenze di byte. Si passa da uno all'altro con <code>.encode("utf-8")</code> e <code>.decode("utf-8")</code>. Specifica sempre la codifica quando leggi o scrivi file.</li><li><code>f"{x:.2f}"</code> due decimali, <code>f"{n:,}"</code> separatore delle migliaia, <code>f"{x!r}"</code> usa <code>repr</code>, <code>f"{x=}"</code> stampa nome e valore (utile per il debug).</li><li><code>str.strip/split/partition/startswith/removeprefix/casefold</code>: <code>casefold</code> è il confronto case-insensitive corretto per Unicode.</li><li>Raw string <code>r"\\d+"</code> per regex e percorsi; stringhe multi-riga con <code>"""</code>.</li></ul>
<h4>Controllo di flusso</h4><ul><li><code>for ... else</code>: il ramo <code>else</code> gira se il ciclo termina senza <code>break</code>. Utile nelle ricerche.</li><li>Espressione condizionale: <code>x = a if cond else b</code>. Confronti concatenati: <code>0 &lt; x &lt; 10</code>.</li><li><code>pass</code> come segnaposto, <code>continue</code> salta all'iterazione successiva.</li><li>Gli errori di indentazione sono errori di sintassi: configura l'editor per 4 spazi.</li></ul>
<h4>Trappole</h4><ul><li>Modificare una lista mentre la scorri salta elementi: itera su una copia o costruisci una nuova lista.</li><li><code>input()</code> restituisce sempre una stringa: converti.</li><li><code>bool("False")</code> è <code>True</code> (stringa non vuota).</li></ul>`,

  collections: `<h3>Approfondimento: strutture dati nel dettaglio</h3>
<h4>Liste</h4><ul><li>Una lista è un array dinamico di puntatori: accesso per indice O(1), <code>append</code> O(1) ammortizzato, <code>insert(0, x)</code> e <code>pop(0)</code> O(n). Per una coda usa <code>collections.deque</code>.</li><li><code>sort()</code> ordina sul posto e restituisce <code>None</code>; <code>sorted()</code> restituisce una nuova lista. L'ordinamento (Timsort) è <b>stabile</b>: elementi uguali mantengono l'ordine originale, quindi puoi ordinare in più passaggi.</li><li><code>key=</code> prende una funzione: <code>sorted(utenti, key=lambda u: u["eta"], reverse=True)</code>.</li></ul>
<h4>Dict</h4><ul><li>Dall'ordine di inserimento garantito (3.7). Lettura e scrittura O(1) medio. Le chiavi devono essere <b>hashable</b> (immutabili): str, int, tuple di immutabili.</li><li><code>setdefault</code>, <code>defaultdict</code>, <code>Counter</code>, <code>d | altro</code> (3.9), <code>d.pop(k, None)</code>, <code>dict.fromkeys(chiavi, valore)</code>.</li><li>Non modificare le chiavi di un dict mentre lo scorri (RuntimeError): itera su <code>list(d)</code>.</li></ul>
<h4>Set</h4><ul><li><code>a | b</code> unione, <code>a &amp; b</code> intersezione, <code>a - b</code> differenza, <code>a ^ b</code> differenza simmetrica, <code>a &lt;= b</code> sottoinsieme.</li><li>L'ordine non è garantito. Elementi hashable. <code>frozenset</code> è la versione immutabile e hashable.</li></ul>
<h4>Tuple e namedtuple</h4><ul><li>Le tuple sono record leggeri e immutabili. <code>typing.NamedTuple</code> dà nomi ai campi: <code>p.x</code> al posto di <code>p[0]</code>.</li><li>Una tupla con un solo elemento si scrive <code>(1,)</code>.</li></ul>
<h4>Slicing</h4><ul><li><code>l[a:b:passo]</code> include <code>a</code>, esclude <code>b</code>. Funziona fuori dai limiti senza errori. <code>l[:]</code> copia superficialmente.</li><li>Assegnazione a slice: <code>l[1:3] = [9, 9, 9]</code> può cambiare la lunghezza.</li></ul>
<h4>Comprehension avanzate</h4><pre><code>[(x, y) for x in range(3) for y in range(3) if x != y]      # cicli annidati
{k: v for k, v in d.items() if v}                            # filtra un dict
[x if x &gt; 0 else 0 for x in xs]                              # espressione condizionale
matrice_trasposta = [list(r) for r in zip(*matrice)]</code></pre>
<p>Se una comprehension richiede più di due livelli, scrivi un ciclo: la leggibilità conta.</p>`,

  functions: `<h3>Approfondimento: funzioni e scope</h3>
<h4>La regola LEGB</h4><p>I nomi si cercano in ordine: <b>L</b>ocal, <b>E</b>nclosing (funzioni esterne), <b>G</b>lobal (modulo), <b>B</b>uilt-in. Assegnare a un nome dentro una funzione lo rende locale per tutta la funzione: leggerlo prima dell'assegnazione dà <code>UnboundLocalError</code>.</p>
<h4>Parametri</h4><pre><code>def f(a, b=2, /, c=3, *args, d, e=5, **kwargs): ...
# a,b: solo posizionali   c: normale   *args: extra posizionali
# d,e: solo per nome      **kwargs: extra per nome</code></pre>
<ul><li>Usa argomenti <b>solo per nome</b> (dopo <code>*</code>) per le opzioni: il chiamante deve scrivere <code>timeout=10</code>, quindi il codice si legge da solo.</li><li>Non usare più di 3-4 parametri posizionali: passa una dataclass.</li></ul>
<h4>Funzioni come oggetti</h4><ul><li>Si possono passare, restituire, salvare in dict. Hanno attributi (<code>__name__</code>, <code>__doc__</code>, <code>__annotations__</code>).</li><li><code>functools.partial(f, x=1)</code> fissa alcuni argomenti; <code>functools.reduce</code>; <code>operator.itemgetter("k")</code> come <code>key</code> veloce.</li><li>La <code>lambda</code> è solo un'espressione: se serve altro, usa <code>def</code> con un nome.</li></ul>
<h4>Closure e late binding</h4><pre><code>funzioni = [lambda: i for i in range(3)]
[f() for f in funzioni]          # [2, 2, 2]: i viene letta alla chiamata

funzioni = [lambda i=i: i for i in range(3)]
[f() for f in funzioni]          # [0, 1, 2]</code></pre>
<h4>Ricorsione</h4><ul><li>Il limite è circa 1000 chiamate (<code>sys.getrecursionlimit()</code>). Python non ottimizza la ricorsione di coda.</li><li>Per algoritmi profondi usa un ciclo con uno stack esplicito, oppure <code>@functools.cache</code> per memoizzare.</li></ul>
<h4>Docstring e type hint</h4><p>Descrivi cosa fa la funzione, i parametri e le eccezioni nella docstring (<code>"""..."""</code>); annota i tipi dell'interfaccia. Gli strumenti (editor, mypy, Sphinx) li leggono.</p>
<h4>Funzioni pure e effetti collaterali</h4><p>Preferisci funzioni che dipendono solo dagli argomenti e restituiscono un valore: si testano e si riusano facilmente. Isola gli effetti (I/O, rete, database) in pochi punti.</p>`,

  errors: `<h3>Approfondimento: errori, file e dati</h3>
<h4>Gerarchia delle eccezioni</h4><ul><li><code>BaseException</code> → <code>Exception</code> → <code>ValueError</code>, <code>TypeError</code>, <code>KeyError</code>, <code>OSError</code> (<code>FileNotFoundError</code>, <code>PermissionError</code>), ...</li><li><code>KeyboardInterrupt</code> e <code>SystemExit</code> derivano da <code>BaseException</code>: <code>except Exception</code> non li cattura, ed è corretto così.</li></ul>
<h4>Concatenare le cause</h4><pre><code>try:
    cfg = json.loads(testo)
except json.JSONDecodeError as e:
    raise ErroreConfig("config non valida") from e     # mantiene la causa
# raise ... from None  nasconde la causa originale</code></pre>
<h4>Buone pratiche</h4><ul><li>Cattura il <b>meno</b> possibile e il più <b>specifico</b> possibile; metti dentro il <code>try</code> solo la riga che può fallire.</li><li>Non usare le eccezioni per il flusso normale se il caso è frequente.</li><li><code>assert</code> è per le invarianti interne: viene rimosso con <code>python -O</code>, quindi non per validare input.</li><li><code>finally</code> per la pulizia; meglio ancora un context manager.</li><li>Ogni libreria/servizio ha la sua eccezione base (<code>class ErroreApp(Exception)</code>) e sottoclassi per i casi.</li></ul>
<h4>File e percorsi</h4><ul><li><code>pathlib.Path</code>: <code>Path("a") / "b.txt"</code>, <code>.exists()</code>, <code>.glob("*.py")</code>, <code>.mkdir(parents=True, exist_ok=True)</code>, <code>.stem</code>, <code>.suffix</code>.</li><li>File grandi: iterali riga per riga, non <code>read()</code> tutto in memoria. Binario: modalità <code>"rb"</code>/<code>"wb"</code>.</li><li>Scritture sicure: scrivi su un file temporaneo e poi <code>os.replace</code> (atomico).</li></ul>
<h4>JSON, CSV, altri formati</h4><ul><li>JSON: <code>None</code>↔<code>null</code>, tuple diventano liste, chiavi sempre stringhe, <code>datetime</code> e <code>Decimal</code> non sono serializzabili (serve <code>default=</code> o una conversione).</li><li><code>csv.DictReader/DictWriter</code> gestiscono virgolette e separatori; apri con <code>newline=""</code>.</li><li><code>tomllib</code> (lettura TOML, 3.11), <code>pickle</code> <b>mai</b> su dati non fidati, <code>sqlite3</code> per dati strutturati locali.</li></ul>
<h4>Gestire più risorse</h4><pre><code>with open("in.txt") as src, open("out.txt", "w") as dst:
    for riga in src:
        dst.write(riga.upper())

from contextlib import suppress
with suppress(FileNotFoundError):
    Path("tmp.txt").unlink()</code></pre>`,

  classes: `<h3>Approfondimento: classi e oggetti</h3>
<h4>Attributi di classe e di istanza</h4><pre><code>class Contatore:
    totale = 0                  # attributo di CLASSE, condiviso
    def __init__(self):
        self.valore = 0         # attributo di ISTANZA
        Contatore.totale += 1</code></pre>
<p>Assegnare <code>istanza.totale = 5</code> crea un attributo di istanza che <b>oscura</b> quello di classe: non modifica il valore condiviso. Un attributo di classe mutabile (lista, dict) è condiviso da tutte le istanze: trappola frequente.</p>
<h4>Tre tipi di metodo</h4><ul><li><b>Istanza</b>: riceve <code>self</code>.</li><li><b>@classmethod</b>: riceve <code>cls</code>; costruttori alternativi (<code>Utente.da_dict(d)</code>) che funzionano anche con le sottoclassi.</li><li><b>@staticmethod</b>: nessun argomento implicito; una funzione raggruppata nella classe per ordine. Spesso una funzione di modulo è meglio.</li></ul>
<h4>Property e incapsulamento</h4><pre><code>class Termometro:
    def __init__(self, c): self._c = c
    @property
    def fahrenheit(self): return self._c * 9 / 5 + 32
    @property
    def celsius(self): return self._c
    @celsius.setter
    def celsius(self, v):
        if v &lt; -273.15: raise ValueError("sotto lo zero assoluto")
        self._c = v</code></pre>
<p>In Python si parte con attributi pubblici semplici e si introduce una <code>@property</code> solo quando serve logica: l'interfaccia (<code>t.celsius</code>) non cambia. Niente getter/setter «per sicurezza».</p>
<h4>Dataclass: opzioni utili</h4><ul><li><code>@dataclass(frozen=True)</code>: immutabile e hashable. <code>order=True</code>: confronti. <code>slots=True</code>: meno memoria. <code>kw_only=True</code>: costruttore solo per nome.</li><li><code>__post_init__</code> per validare o derivare campi; <code>field(default_factory=list)</code> per i default mutabili; <code>dataclasses.replace(obj, campo=nuovo)</code> per copie modificate.</li></ul>
<h4>Composizione e responsabilità</h4><p>Una classe dovrebbe avere <b>una</b> responsabilità. Se una classe ha solo <code>__init__</code> e un metodo, probabilmente è una funzione. Se ha solo dati, è una dataclass. Se tiene troppo stato, dividila.</p>
<h4>__repr__ e debug</h4><p><code>repr(obj)</code> deve aiutare a debuggare: includi i campi chiave. Le dataclass lo generano da sole.</p>`,

  inherit: `<h3>Approfondimento: ereditarietà e MRO</h3>
<h4>Come funziona la ricerca dei metodi</h4><p>Python cerca un attributo nella classe e poi nelle basi seguendo l'<b>MRO</b> (Method Resolution Order, algoritmo C3). Si ispeziona con <code>Classe.__mro__</code> o <code>Classe.mro()</code>.</p>
<pre><code>class A:
    def ciao(self): return "A"
class B(A):
    def ciao(self): return "B+" + super().ciao()
class C(A):
    def ciao(self): return "C+" + super().ciao()
class D(B, C): ...

D().ciao()          # 'B+C+A'
D.__mro__           # D, B, C, A, object</code></pre>
<p><code>super()</code> non significa «il genitore»: significa «il prossimo nell'MRO». Per questo tutte le classi di una gerarchia cooperativa devono chiamare <code>super().__init__(**kwargs)</code>.</p>
<h4>Mixin</h4><p>Una mixin è una classe piccola che aggiunge un comportamento e non è pensata per essere usata da sola (<code>class LogMixin: def log(self, m): ...</code>). Mettila a sinistra: <code>class Servizio(LogMixin, Base)</code>. Evita mixin che dipendono dallo stato interno della classe che le usa.</p>
<h4>Quando ereditare</h4><ul><li>Ereditare per <b>specializzare</b> (un Cane è un Animale) quando vale il principio di sostituzione di Liskov: una sottoclasse deve poter sostituire la base senza sorprese.</li><li>Altrimenti preferisci la <b>composizione</b>: la classe ha un oggetto che fa il lavoro, e lo puoi sostituire (anche nei test).</li><li>Gerarchie profonde (più di 2-3 livelli) sono un cattivo segno.</li></ul>
<h4>ABC, Protocol, duck typing</h4><ul><li><code>ABC</code>: contratto nominale; impedisce di istanziare classi incomplete.</li><li><code>Protocol</code>: contratto strutturale per i type checker.</li><li>Duck typing: nessun contratto formale; si fida e si testa.</li></ul>
<h4>Enum avanzati</h4><pre><code>from enum import Enum, IntEnum, StrEnum, auto, Flag

class Stato(StrEnum):
    APERTO = auto()        # 'aperto'
    CHIUSO = auto()

class Permessi(Flag):
    LEGGI = auto()
    SCRIVI = auto()
Permessi.LEGGI | Permessi.SCRIVI</code></pre>
<p>Gli enum sono confrontabili con <code>is</code>, hanno <code>.name</code> e <code>.value</code>, e si iterano. Preferiscili alle «stringhe magiche».</p>
<h4>Trappole</h4><ul><li>Dimenticare <code>super().__init__()</code>: la parte ereditata non viene inizializzata.</li><li>Sovrascrivere un metodo cambiandone la firma: rompe il polimorfismo.</li><li>Ereditare da <code>dict</code>/<code>list</code>: usa <code>UserDict</code>/<code>UserList</code> o la composizione.</li></ul>`,

  iterators: `<h3>Approfondimento: iterazione e generatori</h3>
<h4>Il protocollo di iterazione</h4><pre><code>class Conto:
    def __init__(self, n): self.n = n
    def __iter__(self): return self           # un iteratore restituisce sé stesso
    def __next__(self):
        if self.n &lt;= 0:
            raise StopIteration
        self.n -= 1
        return self.n

list(Conto(3))     # [2, 1, 0]</code></pre>
<p>Il ciclo <code>for</code> chiama <code>iter(x)</code> e poi <code>next()</code> finché non sale <code>StopIteration</code>. Un <b>iterabile</b> restituisce un nuovo iteratore a ogni <code>iter()</code> (una lista si può scorrere più volte); un <b>iteratore</b> si consuma.</p>
<h4>Generatori: più di yield</h4><ul><li><code>yield from altro</code> delega a un altro iterabile (e ne propaga i valori di ritorno).</li><li><code>send(valore)</code> invia un valore dentro il generatore (coroutine "vecchio stile"); <code>close()</code> e <code>throw()</code> lo terminano o vi iniettano un'eccezione.</li><li><code>return valore</code> in un generatore diventa il valore di <code>StopIteration</code>.</li></ul>
<h4>Pipeline lazy</h4><pre><code>def leggi(path):
    with open(path, encoding="utf-8") as f:
        yield from f

def righe_errore(righe):
    return (r for r in righe if "ERROR" in r)

def estrai_codice(righe):
    for r in righe:
        yield r.split()[1]

for codice in estrai_codice(righe_errore(leggi("app.log"))):
    ...        # elabora un elemento alla volta, memoria costante</code></pre>
<h4>itertools: i pezzi da conoscere</h4><div class="tblw"><table><tr><th>Funzione</th><th>Cosa fa</th></tr>
<tr><td><code>chain(a, b)</code></td><td>concatena iterabili</td></tr>
<tr><td><code>islice(it, n)</code></td><td>slicing lazy</td></tr>
<tr><td><code>groupby(it, key)</code></td><td>raggruppa consecutivi</td></tr>
<tr><td><code>product, permutations, combinations</code></td><td>combinatoria</td></tr>
<tr><td><code>accumulate</code></td><td>somme cumulative</td></tr>
<tr><td><code>batched(it, n)</code></td><td>blocchi di n (3.12)</td></tr>
<tr><td><code>tee</code></td><td>copia un iteratore</td></tr></table></div>
<h4>Trappole</h4><ul><li>Un generatore è monouso: salvalo in lista se serve due volte, o ricrealo.</li><li><code>len()</code> e l'indicizzazione non funzionano sui generatori.</li><li>Le generator expression dentro <code>sum()</code> sono ottime; dentro funzioni che le iterano più volte, no.</li></ul>`,

  decorators: `<h3>Approfondimento: decorator e context manager</h3>
<h4>Decorator di classe e con stato</h4><pre><code>def registra(cls):
    REGISTRO[cls.__name__] = cls
    return cls                  # restituisce la classe

@registra
class Plugin: ...

class Conta:                    # decorator come classe con stato
    def __init__(self, fn):
        functools.update_wrapper(self, fn)
        self.fn, self.chiamate = fn, 0
    def __call__(self, *a, **k):
        self.chiamate += 1
        return self.fn(*a, **k)</code></pre>
<h4>Decorator impilati</h4><pre><code>@a
@b
def f(): ...          # equivale a f = a(b(f)): b si applica per primo</code></pre>
<p>L'ordine conta (per esempio: prima il controllo dei permessi, poi la cache).</p>
<h4>Decorator utili già pronti</h4><ul><li><code>functools.cache</code>, <code>lru_cache(maxsize=128)</code>, <code>cached_property</code> (calcolata una volta per istanza).</li><li><code>functools.singledispatch</code>: overload per tipo del primo argomento.</li><li><code>contextlib.contextmanager</code>, <code>dataclasses.dataclass</code>, <code>abc.abstractmethod</code>, <code>typing.final</code>/<code>override</code>.</li></ul>
<h4>Esempio: retry con backoff</h4><pre><code>def retry(tentativi=3, attesa=0.5, eccezioni=(Exception,)):
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **k):
            for n in range(1, tentativi + 1):
                try:
                    return fn(*a, **k)
                except eccezioni:
                    if n == tentativi:
                        raise
                    time.sleep(attesa * 2 ** (n - 1))
        return wrapper
    return deco</code></pre>
<h4>Context manager nel dettaglio</h4><ul><li><code>__exit__(exc_type, exc, tb)</code> riceve l'eccezione; restituire <code>True</code> la sopprime.</li><li><code>contextlib.ExitStack</code> gestisce un numero variabile di risorse; <code>suppress</code>, <code>redirect_stdout</code>, <code>closing</code>, <code>nullcontext</code>.</li><li><code>async with</code> con <code>__aenter__</code>/<code>__aexit__</code> per le risorse asincrone (connessioni, sessioni).</li></ul>
<h4>Trappole</h4><ul><li>Dimenticare <code>functools.wraps</code>: si perdono nome, docstring e firma.</li><li><code>lru_cache</code> su metodi trattiene <code>self</code> in memoria; con argomenti non hashable dà errore.</li><li>Decorator che catturano tutte le eccezioni nascondono i bug.</li></ul>`,

  stdlib: `<h3>Approfondimento: la libreria standard in pratica</h3>
<h4>pathlib, shutil, tempfile</h4><pre><code>from pathlib import Path
import shutil, tempfile

for p in Path("src").rglob("*.py"):
    print(p.name, p.stat().st_size)

with tempfile.TemporaryDirectory() as d:
    lavora(Path(d))                 # cancellata all'uscita
shutil.copytree("a", "b"); shutil.rmtree("tmp", ignore_errors=True)</code></pre>
<h4>datetime e fusi orari</h4><ul><li>Usa sempre oggetti <b>aware</b>: <code>datetime.now(ZoneInfo("Europe/Rome"))</code>. Salva in UTC, converti solo in visualizzazione.</li><li><code>fromisoformat</code>/<code>isoformat</code> per scambiare date; <code>strftime</code> solo per mostrarle.</li><li>La differenza tra due datetime è un <code>timedelta</code>: <code>.total_seconds()</code>. Attenzione all'ora legale: sommare 24 ore non è sommare un giorno di calendario.</li></ul>
<h4>collections in profondità</h4><ul><li><code>Counter</code>: <code>+</code>, <code>-</code>, <code>most_common</code>, <code>update</code>, <code>total()</code>.</li><li><code>defaultdict(lambda: defaultdict(int))</code> per strutture annidate.</li><li><code>deque(maxlen=N)</code>: finestra scorrevole degli ultimi N.</li><li><code>ChainMap</code> per livelli di configurazione; <code>OrderedDict.move_to_end</code> per una LRU.</li></ul>
<h4>Espressioni regolari</h4><pre><code>import re
RE = re.compile(r"(?P&lt;anno&gt;\\d{4})-(?P&lt;mese&gt;\\d{2})")
m = RE.search("data: 2026-11-09")
m["anno"], m["mese"]
RE.sub(r"\\g&lt;mese&gt;/\\g&lt;anno&gt;", "2026-11")</code></pre>
<ul><li>Compila (<code>re.compile</code>) le regex usate spesso; <code>fullmatch</code> per validare l'intera stringa.</li><li>Quantificatori «lazy» (<code>.*?</code>), lookahead <code>(?=...)</code>, flag <code>re.I</code>, <code>re.M</code>, <code>re.X</code> (verbose).</li><li>Per HTML o JSON non usare le regex: usa un parser.</li></ul>
<h4>subprocess e argparse</h4><pre><code>import subprocess
r = subprocess.run(["git", "status", "--short"], capture_output=True, text=True, check=True)
print(r.stdout)</code></pre>
<ul><li>Passa i comandi come <b>lista</b>; <code>check=True</code> solleva se il codice di uscita non è 0; imposta un <code>timeout</code>.</li><li><code>argparse</code>: sottocomandi con <code>add_subparsers</code>; per CLI più ricche <code>click</code> o <code>typer</code>.</li></ul>
<h4>Altri moduli utili</h4><ul><li><code>functools.partial</code>, <code>operator</code>, <code>itertools</code>, <code>statistics</code>, <code>random</code> (non per la sicurezza), <code>secrets</code>, <code>uuid</code>, <code>hashlib</code>, <code>base64</code>, <code>textwrap</code>, <code>string.Template</code>, <code>graphlib</code>, <code>heapq</code>, <code>bisect</code>, <code>decimal</code>, <code>fractions</code>, <code>sqlite3</code>, <code>zipfile</code>, <code>concurrent.futures</code>.</li></ul>`,

  testing: `<h3>Approfondimento: testare bene</h3>
<h4>Hypothesis: property-based testing</h4><pre><code>from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_ordinamento_idempotente(xs):
    assert sorted(sorted(xs)) == sorted(xs)

@given(st.text())
def test_roundtrip(s):
    assert decodifica(codifica(s)) == s</code></pre><p>Invece di scegliere gli input a mano descrivi una <b>proprietà</b> che deve valere sempre; Hypothesis genera centinaia di casi e riduce il fallimento al caso minimo. Ottimo per parser, serializzazione, ordinamenti e funzioni pure.</p>
<h4>Test asincroni e di database</h4><ul><li><code>pytest-asyncio</code> (o <code>anyio</code>): <code>@pytest.mark.asyncio async def test_x(): ...</code>.</li><li>Database di test con <b>rollback per test</b>: una fixture apre una transazione, il test lavora, la fixture fa rollback: veloce e isolato. Per Postgres reale usa <code>testcontainers</code> o un servizio in CI.</li><li><code>factory_boy</code> o <code>polyfactory</code> per costruire dati di test senza ripetere i campi.</li><li>Celery: esegui i task in modalità eager o testali come funzioni; un test di integrazione con un broker reale per i flussi critici.</li></ul>
<h4>Copertura e mutation testing</h4><ul><li>Copertura a <b>rami</b> (<code>--cov-branch</code>): più informativa di quella a righe. Il 100% non è l'obiettivo: guarda le zone non coperte che contano.</li><li><b>Mutation testing</b> (<code>mutmut</code>): modifica il codice e verifica che i test falliscano; mostra test che non controllano davvero nulla.</li></ul>
<h4>Test instabili (flaky)</h4><p>Cause tipiche: tempo, ordine di esecuzione, stato condiviso, rete, thread. Rimedi: inietta il tempo, isola lo stato, nessuna rete nei test unitari, sblocca con attese esplicite su condizioni (non <code>sleep</code>). Un test flaky va corretto o rimosso: erode la fiducia nella suite.</p>
<h4>Cosa NON mockare</h4><p>Non mockare la tua logica né il database quando puoi usarne uno vero e veloce; non mockare ciò che non possiedi con aspettative rigide. Mocka i confini lenti o non deterministici, e verifica gli effetti osservabili, non le chiamate interne.</p>

<h4>La piramide dei test</h4><ul><li><b>Unitari</b>: veloci, isolati, tanti. Funzioni pure e logica di dominio.</li><li><b>Integrazione</b>: più componenti reali (database di test, API vera ma locale).</li><li><b>End-to-end</b>: pochi, sui flussi critici.</li></ul>
<h4>Struttura di un buon test</h4><p><b>Arrange, Act, Assert</b>: prepara i dati, esegui una sola azione, verifica il risultato. Un test, un comportamento, un nome che lo dica (<code>test_sconto_negativo_solleva_errore</code>).</p>
<h4>Fixture avanzate</h4><pre><code>@pytest.fixture(scope="session")
def engine(): ...                      # una volta per sessione

@pytest.fixture
def client(app):
    with TestClient(app) as c:
        yield c

# conftest.py: le fixture condivise vivono qui</code></pre>
<ul><li>Scope: <code>function</code> (default), <code>class</code>, <code>module</code>, <code>session</code>.</li><li><code>monkeypatch</code> per variabili d'ambiente e attributi; <code>tmp_path</code>, <code>capsys</code>, <code>caplog</code> integrate.</li><li><code>@pytest.mark.parametrize</code> con <code>ids=</code> per nomi leggibili.</li><li>Marker (<code>@pytest.mark.slow</code>) e <code>-m "not slow"</code> per selezionare.</li></ul>
<h4>Mock con giudizio</h4><ul><li>Sostituisci i <b>confini</b> (rete, tempo, file system, servizi esterni), non la tua logica.</li><li><code>patch</code> si applica dove l'oggetto è <b>usato</b>. <code>autospec=True</code> evita mock che accettano qualunque firma.</li><li>Per il tempo: inietta una funzione <code>clock</code> o usa <code>freezegun</code>.</li><li>Troppi mock = test che verificano l'implementazione, non il comportamento.</li></ul>
<h4>Copertura e qualità</h4><ul><li><code>pytest --cov=mioapp --cov-report=term-missing</code>: la copertura trova le zone non testate, non prova che il codice sia corretto.</li><li><b>Property-based testing</b> con <code>hypothesis</code>: genera input per trovare casi limite.</li><li>I test devono essere <b>deterministici</b>: niente dipendenza dall'ora, dall'ordine o dalla rete.</li></ul>
<h4>TDD in breve</h4><p>Scrivi un test che fallisce, scrivi il codice minimo che lo fa passare, rifattorizza. Utile soprattutto per logica di dominio ben definita.</p>`,

  web: `<h3>Approfondimento: costruire API solide</h3>
<h4>HTTP in pochi punti</h4><ul><li>Metodi: GET (sicuro, idempotente), POST (crea), PUT (sostituisce, idempotente), PATCH (modifica parziale), DELETE (idempotente).</li><li>Codici: 200 OK, 201 Created, 204 No Content, 400 richiesta non valida, 401 non autenticato, 403 vietato, 404 non trovato, 409 conflitto, 422 validazione fallita, 429 troppe richieste, 500 errore del server.</li><li>Idempotenza: ripetere la richiesta ha lo stesso effetto. Per i POST critici usa una <b>Idempotency-Key</b>.</li></ul>
<h4>Progettare l'API</h4><ul><li>Risorse al plurale (<code>/utenti/{id}/ordini</code>), verbi nei metodi HTTP, versioni (<code>/v1/</code>).</li><li>Paginazione (cursor o offset+limit), filtri e ordinamento via query string.</li><li>Errori coerenti: un formato JSON unico con codice, messaggio e dettagli.</li></ul>
<h4>Pydantic in profondità</h4><pre><code>from pydantic import BaseModel, field_validator, ConfigDict

class Ordine(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    email: str
    importo: float

    @field_validator("importo")
    @classmethod
    def positivo(cls, v):
        if v &lt;= 0:
            raise ValueError("deve essere positivo")
        return v</code></pre>
<ul><li>Modelli <b>separati</b> per input, output e persistenza (<code>OrdineIn</code>, <code>OrdineOut</code>, la tabella): non esporre campi interni.</li><li><code>model_validate</code> e <code>model_dump</code>; <code>from_attributes=True</code> per leggere da ORM.</li></ul>
<h4>FastAPI: oltre l'esempio base</h4><ul><li>Dipendenze per autenticazione, sessione DB, paginazione; <code>APIRouter</code> per organizzare le rotte; <code>BackgroundTasks</code> per lavori dopo la risposta.</li><li>Middleware per CORS, log, tempi; gestori di eccezioni centralizzati con <code>@app.exception_handler</code>.</li><li>Autenticazione: JWT o sessioni; password sempre con hash (<code>argon2</code>/<code>bcrypt</code>); HTTPS ovunque.</li><li>Test con <code>TestClient</code> e <code>dependency_overrides</code> per sostituire il database.</li></ul>
<h4>WSGI contro ASGI</h4><p>WSGI (Flask, Django classico): sincrono, un thread per richiesta. ASGI (FastAPI, Starlette, Django async): asincrono, adatto a molte connessioni e WebSocket. Si serve con <code>uvicorn</code> o <code>gunicorn -k uvicorn_worker.UvicornWorker</code> (pacchetto <code>uvicorn-worker</code>; il vecchio <code>uvicorn.workers</code> è deprecato).</p>
<h4>Resilienza lato client</h4><ul><li>Timeout sempre; retry con backoff esponenziale e jitter solo su errori transitori (5xx, timeout) e operazioni idempotenti.</li><li>Riusa le connessioni (<code>httpx.Client</code>/<code>AsyncClient</code>), non crearne una per richiesta.</li></ul>`,

  database: `<h3>Approfondimento: database con Python</h3>
<h4>Transazioni e ACID</h4><ul><li><b>Atomicità</b> (o tutto o niente), <b>Coerenza</b>, <b>Isolamento</b>, <b>Durabilità</b>.</li><li>Raggruppa le operazioni correlate in una transazione; se una fallisce, rollback. In SQLAlchemy: <code>with Session(engine) as s, s.begin(): ...</code>.</li><li>Livelli di isolamento e <code>SELECT ... FOR UPDATE</code> per evitare race condition su saldi e scorte.</li></ul>
<h4>Indici e prestazioni</h4><ul><li>Un indice accelera le ricerche (<code>WHERE</code>, <code>JOIN</code>, <code>ORDER BY</code>) ma rallenta le scritture e occupa spazio.</li><li><code>EXPLAIN ANALYZE</code> mostra il piano reale: cerca <i>Seq Scan</i> su tabelle grandi.</li><li>Indici composti: l'ordine delle colonne conta.</li></ul>
<h4>ORM: pro e contro</h4><ul><li>Pro: meno SQL ripetitivo, mappatura a oggetti, migrazioni, sicurezza contro l'injection.</li><li>Contro: query nascoste (N+1), astrazione che perde, query complesse più chiare in SQL. Mescola: ORM per il CRUD, SQL esplicito per i report.</li></ul>
<h4>N+1 in dettaglio</h4><pre><code># N+1: una query per ogni ordine
for u in session.scalars(select(Utente)):
    print(len(u.ordini))

# una query con eager loading
from sqlalchemy.orm import selectinload
stmt = select(Utente).options(selectinload(Utente.ordini))</code></pre>
<h4>Pool di connessioni</h4><ul><li>Aprire una connessione costa: il pool le riusa. Dimensiona <code>pool_size</code> e <code>max_overflow</code> in base a worker e limiti del database.</li><li>Una sessione per richiesta (o per unità di lavoro) e chiusa sempre.</li></ul>
<h4>Migrazioni sicure</h4><ul><li>Aggiungere una colonna nullable è facile; renderla <code>NOT NULL</code> o rinominarla richiede più passaggi (espandi, migra i dati, contrai).</li><li>Prima la migrazione retrocompatibile, poi il codice nuovo; solo dopo la pulizia.</li></ul>
<h4>Quando non usare un database relazionale</h4><ul><li>Cache e code: Redis. Ricerca full-text: Elasticsearch/Postgres FTS. Documenti flessibili: MongoDB. Analisi su grandi volumi: colonnari (DuckDB, ClickHouse).</li><li>Per la maggior parte dei servizi, Postgres basta e avanza.</li></ul>
<h4>Asincrono</h4><p>Con FastAPI async usa driver async (<code>asyncpg</code>, <code>SQLAlchemy.ext.asyncio</code>): un driver sincrono bloccherebbe l'event loop.</p>`,
  advasync: `<h3>Approfondimento: scegliere il modello di concorrenza</h3>
<div class="tblw"><table><tr><th>Lavoro</th><th>Scelta</th><th>Perché</th></tr>
<tr><td>Molte connessioni I/O (HTTP, DB async)</td><td><code>asyncio</code></td><td>un thread, migliaia di attese in parallelo</td></tr>
<tr><td>I/O con librerie bloccanti</td><td>thread (<code>ThreadPoolExecutor</code>, <code>to_thread</code>)</td><td>il GIL si rilascia in attesa</td></tr>
<tr><td>Calcolo CPU in Python puro</td><td><code>multiprocessing</code> / <code>ProcessPoolExecutor</code></td><td>un interprete (e GIL) per processo</td></tr>
<tr><td>Calcolo numerico</td><td>NumPy / librerie native</td><td>rilasciano il GIL e vettorizzano</td></tr>
<tr><td>Misto (CPU + I/O)</td><td>asyncio + pool di processi</td><td>separa le due nature</td></tr></table></div>
<h4>Multiprocessing: cose da sapere</h4><ul><li>Avvio dei processi: <code>fork</code> (veloce, ma insidioso con thread e librerie) contro <code>spawn</code> (default su macOS e Windows, più sicuro; richiede il guard <code>if __name__ == "__main__":</code>).</li><li>I dati passano per <b>serializzazione</b> (pickle): argomenti e risultati devono essere piccoli e serializzabili. Per grandi blocchi: <code>multiprocessing.shared_memory</code> o file memory-mapped.</li><li>Il numero di worker di solito è pari ai core (<code>os.cpu_count()</code>) per il lavoro CPU.</li></ul>
<h4>Thread safety</h4><ul><li><code>list.append</code> e <code>dict[k] = v</code> sono atomici in CPython, ma sequenze come "controlla e poi scrivi" non lo sono: usa <code>threading.Lock</code> o <code>queue.Queue</code>.</li><li>Preferisci passare messaggi (code) alla memoria condivisa.</li></ul>
<h4>Ponti tra sync e async</h4><ul><li>Dal codice async al sync bloccante: <code>asyncio.to_thread</code>. Dal sync all'async: <code>asyncio.run</code> una volta; dentro framework già async, <code>await</code>.</li><li><b>anyio</b> e <b>trio</b>: concorrenza strutturata portabile, con scope di cancellazione più sicuri.</li><li>Con un ORM sincrono dentro FastAPI usa <code>def</code> (gira in un pool di thread) invece di <code>async def</code>.</li></ul>`,
}
