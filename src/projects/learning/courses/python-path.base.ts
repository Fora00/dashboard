import { card, mod, prac, q } from './python-path.helpers'

// Group "base": from zero to comfortable scripts, for someone who already writes JS/TS.

export const jsmap = mod(
  'jsmap',
  'Python per chi viene da JS/TS',
  'La mappa mentale: cosa è uguale, cosa cambia, le trappole',
  'base',
  `<p class="lead">Se scrivi già JS/TS hai il 70% dei concetti. Cambiano la sintassi (indentazione al posto delle graffe), i tipi (dinamici ma forti) e alcune abitudini.</p>
<h3>Tabella di traduzione</h3><div class="tblw"><table><tr><th>JS/TS</th><th>Python</th></tr>
<tr><td><code>const x = 1</code></td><td><code>x = 1</code> (nessuna keyword)</td></tr>
<tr><td><code>null</code>, <code>undefined</code></td><td><code>None</code></td></tr>
<tr><td><code>true / false</code></td><td><code>True / False</code></td></tr>
<tr><td><code>&amp;&amp; || !</code></td><td><code>and or not</code></td></tr>
<tr><td><code>${'${a}'}</code> nei template</td><td>f-string: <code>f"{a}"</code></td></tr>
<tr><td>array / object</td><td><code>list</code> / <code>dict</code></td></tr>
<tr><td><code>arr.map(f)</code></td><td><code>[f(x) for x in arr]</code></td></tr>
<tr><td><code>===</code></td><td><code>==</code> (valori) e <code>is</code> (identità)</td></tr>
<tr><td><code>console.log</code></td><td><code>print</code></td></tr>
<tr><td><code>npm</code> / <code>package.json</code></td><td><code>pip</code> / <code>pyproject.toml</code></td></tr></table></div>
<h3>Le differenze che mordono</h3><ul>
<li><b>Indentazione = blocco.</b> Quattro spazi, mai mischiare con i tab. Dopo <code>:</code> si va a capo e si indenta.</li>
<li><b>Tipi forti:</b> <code>"1" + 1</code> è un errore (in JS dà <code>"11"</code>). Si converte a mano: <code>int("1") + 1</code>.</li>
<li><b>Falsy:</b> sono falsi <code>0</code>, <code>""</code>, <code>[]</code>, <code>{}</code>, <code>None</code>. Attenzione: <code>[]</code> e <code>{}</code> sono falsy in Python (in JS sono truthy).</li>
<li><b>Tutto è un oggetto</b>, ma non ci sono <code>this</code> impliciti: i metodi ricevono <code>self</code> in modo esplicito.</li>
<li><b>Nessun hoisting né <code>let/const</code>:</b> lo scope è di funzione, non di blocco.</li>
<li><b>Argomenti di default mutabili</b> sono una trappola classica (vedi modulo funzioni).</li></ul>
<pre><code>nome = "Ada"
eta = 36
if eta &gt;= 18 and nome:
    print(f"{nome} è maggiorenne")
else:
    print("no")</code></pre>
<div class="say"><b>Cosa dire.</b> «Vengo da JS/TS: in Python tengo d'occhio indentazione, tipi forti, <code>None</code> e le liste mutabili.»</div>`,
  [
    q(
      'q1',
      'Cosa stampa <code>print("1" + 1)</code> in Python?',
      ['11', '2', 'Un TypeError', 'None'],
      2,
      'Python ha tipi forti: non converte da solo una stringa in numero. Serve int("1") o str(1).',
    ),
    q(
      'q2',
      "Qual è l'equivalente di <code>null</code>?",
      ['null', 'nil', 'None', 'void'],
      2,
      'None è il valore "nessun valore" e si confronta con is None.',
    ),
    q(
      'q3',
      'Una lista vuota <code>[]</code> in un if è…',
      ['truthy', 'falsy', 'un errore', 'dipende dal browser'],
      1,
      'Liste, stringhe, dict vuoti, 0 e None sono falsy.',
    ),
    q(
      'q4',
      'Come si scrive una stringa con valori interpolati?',
      ['"Ciao ${nome}"', 'f"Ciao {nome}"', '"Ciao " . nome', '`Ciao ${nome}`'],
      1,
      'Le f-string usano il prefisso f e le graffe.',
    ),
  ],
  [
    card(
      'c1',
      'Equivalente di <code>===</code>',
      "<code>==</code> confronta i valori, <code>is</code> l'identità dell'oggetto (si usa per None).",
    ),
    card('c2', 'Cosa delimita un blocco?', "L'indentazione (4 spazi) dopo i due punti, non le graffe."),
    card('c3', 'Valori falsy', '0, "", [], {}, set(), None, False.'),
    card('c4', 'Interpolazione di stringhe', 'f"Ciao {nome}"; espressioni anche dentro: f"{a + b}".'),
  ],
  [
    prac(
      'p1',
      'Traduci a voce: <code>const evens = nums.filter(n =&gt; n % 2 === 0)</code>.',
      '<code>evens = [n for n in nums if n % 2 == 0]</code>: una list comprehension.',
    ),
    prac(
      'p2',
      'Spiega a un collega JS perché <code>"3" * 2</code> in Python non è un errore.',
      'Per le stringhe <code>*</code> ripete: dà "33". Il tipo forte blocca solo le somme tra tipi incompatibili.',
    ),
  ],
)

export const setup = mod(
  'setup',
  'Installazione, venv e primo script',
  'Interprete, ambiente virtuale, pip, REPL, struttura di un progetto',
  'base',
  `<p class="lead">Prima di scrivere codice servono tre cose: l'interprete, un ambiente virtuale per progetto e un modo di installare librerie.</p>
<h3>Interprete e REPL</h3><ul><li><code>python3 --version</code> per controllare (usa 3.11 o più recente).</li><li><code>python3</code> da solo apre il <b>REPL</b>: scrivi un'espressione e vedi il risultato. Esci con <code>exit()</code>.</li><li><code>python3 script.py</code> esegue un file.</li></ul>
<h3>Ambiente virtuale</h3><p>Ogni progetto ha le sue dipendenze, isolate in una cartella <code>.venv</code>: è come <code>node_modules</code>, ma va attivato.</p>
<pre><code>python3 -m venv .venv
source .venv/bin/activate      # su Windows: .venv\\Scripts\\activate
pip install requests
pip freeze &gt; requirements.txt
deactivate</code></pre>
<h3>Struttura minima</h3><pre><code>progetto/
  .venv/
  src/
    app.py
  tests/
    test_app.py
  pyproject.toml</code></pre>
<h3>Il punto d'ingresso</h3><pre><code>def main():
    print("ciao")

if __name__ == "__main__":
    main()</code></pre><p>Il blocco finale gira solo se esegui il file direttamente, non se lo importi da un altro modulo.</p>
<div class="say"><b>Cosa dire.</b> «Un venv per progetto, dipendenze fissate e un main protetto da <code>__name__</code>.»</div>`,
  [
    q(
      'q1',
      'A cosa serve <code>python3 -m venv .venv</code>?',
      ['Installa Python', 'Crea un ambiente isolato per le dipendenze', 'Compila lo script', 'Aggiorna pip'],
      1,
      'Crea una cartella con un interprete e un site-packages propri del progetto.',
    ),
    q(
      'q2',
      'Cosa fa <code>if __name__ == "__main__":</code>?',
      [
        'Esegue il blocco solo se il file è lanciato direttamente',
        'Importa main',
        'Rende il file un pacchetto',
        'Niente',
      ],
      0,
      'Quando il file è importato, __name__ è il nome del modulo e il blocco non gira.',
    ),
    q(
      'q3',
      'Come si salvano le dipendenze installate?',
      ['pip save', 'pip freeze > requirements.txt', 'npm save', 'python lock'],
      1,
      'freeze elenca i pacchetti con le versioni; oggi si usa spesso anche pyproject.toml.',
    ),
    q(
      'q4',
      'Cosa apre il comando <code>python3</code> senza argomenti?',
      ['Un editor', 'Il REPL interattivo', 'Un server', 'La documentazione'],
      1,
      'Il REPL valuta ogni riga che scrivi.',
    ),
  ],
  [
    card('c1', 'Creare e attivare un venv', 'python3 -m venv .venv, poi source .venv/bin/activate.'),
    card('c2', 'Installare una libreria', 'pip install nome (dentro il venv attivo).'),
    card('c3', 'Il main di uno script', 'def main(): ... e if __name__ == "__main__": main().'),
    card('c4', 'Equivalente di node_modules', 'La cartella .venv/lib/.../site-packages.'),
  ],
  [
    prac(
      'p1',
      'Parti da una cartella vuota e arriva a "ciao" stampato da uno script con dipendenza requests. Elenca i comandi.',
      'mkdir, python3 -m venv .venv, source .venv/bin/activate, pip install requests, creare app.py con main, python3 app.py.',
    ),
    prac(
      'p2',
      'Perché non installare i pacchetti globalmente?',
      'Versioni in conflitto tra progetti e sistema sporco; il venv li isola e rende il progetto riproducibile.',
    ),
  ],
)

export const basics = mod(
  'basics',
  'Tipi, stringhe e controllo di flusso',
  'int, float, str, bool, if, for, while, range',
  'base',
  `<p class="lead">I mattoni: numeri, testo, condizioni e cicli. Qui la sintassi è più corta di JS.</p>
<h3>Tipi base</h3><pre><code>n = 42          # int (grande a piacere)
x = 3.14        # float
ok = True       # bool
testo = "ciao"  # str (immutabile)
niente = None
print(type(n), 7 // 2, 7 % 2, 2 ** 10)  # 3 1 1024</code></pre>
<ul><li><code>/</code> divide sempre in float, <code>//</code> è la divisione intera, <code>**</code> è la potenza.</li><li>Le stringhe usano <code>'</code> o <code>"</code>, e <code>"""</code> per più righe.</li></ul>
<h3>Stringhe</h3><pre><code>s = "Milano"
s.upper(); s.lower(); s.replace("M", "m")
"a,b,c".split(",")        # ['a', 'b', 'c']
"-".join(["a", "b"])      # 'a-b'
s[0]; s[-1]; s[1:4]       # 'M', 'o', 'ila'
f"{s:&gt;10}"                # allineata a destra</code></pre>
<h3>Condizioni e cicli</h3><pre><code>if x &gt; 10:
    ...
elif x == 10:
    ...
else:
    ...

for i in range(3):        # 0, 1, 2
    print(i)
for i, v in enumerate(["a", "b"]):
    print(i, v)
while n &gt; 0:
    n -= 1
    if n == 5:
        break</code></pre>
<p>Non esiste <code>i++</code>: si scrive <code>i += 1</code>. I cicli hanno anche un <code>else</code> che gira se non c'è stato <code>break</code>.</p>
<div class="say"><b>Cosa dire.</b> «Uso enumerate invece degli indici e le f-string per formattare.»</div>`,
  [
    q('q1', 'Quanto vale <code>7 // 2</code>?', ['3.5', '3', '4', '1'], 1, '// è la divisione intera.'),
    q(
      'q2',
      'Cosa produce <code>range(3)</code>?',
      ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3'],
      1,
      'Parte da 0 e si ferma prima del valore indicato.',
    ),
    q(
      'q3',
      "Come si prende l'ultimo carattere di s?",
      ['s[len]', 's[-1]', 's.last()', 's[end]'],
      1,
      'Gli indici negativi contano dalla fine.',
    ),
    q(
      'q4',
      'Le stringhe in Python sono…',
      ['mutabili', 'immutabili', 'array di byte', 'oggetti con proprietà length'],
      1,
      'Ogni modifica crea una nuova stringa.',
    ),
  ],
  [
    card('c1', 'Potenza e divisione intera', '2 ** 3 = 8; 7 // 2 = 3.'),
    card('c2', 'Indice e valore insieme', 'for i, v in enumerate(lista):'),
    card('c3', 'Incrementare', 'i += 1 (non esiste i++).'),
    card('c4', 'Unire e dividere stringhe', '"-".join(lista) e testo.split(",").'),
  ],
  [
    prac(
      'p1',
      'Stampa i numeri pari da 0 a 20 senza if.',
      'for n in range(0, 21, 2): print(n)  (il terzo argomento è il passo).',
    ),
    prac('p2', 'Dato "ciao mondo", ottieni "Ciao Mondo".', '"ciao mondo".title()'),
  ],
)

export const collections = mod(
  'collections',
  'Liste, tuple, dict e set',
  'Le strutture dati native, slicing e comprehension',
  'base',
  `<p class="lead">Quattro strutture coprono quasi tutto. Sapere quale scegliere è metà del lavoro.</p>
<div class="tblw"><table><tr><th>Tipo</th><th>Ordinato</th><th>Mutabile</th><th>Uso</th></tr>
<tr><td><code>list</code></td><td>sì</td><td>sì</td><td>sequenza di elementi</td></tr>
<tr><td><code>tuple</code></td><td>sì</td><td>no</td><td>record fisso, chiavi di dict</td></tr>
<tr><td><code>dict</code></td><td>per inserimento</td><td>sì</td><td>chiave → valore</td></tr>
<tr><td><code>set</code></td><td>no</td><td>sì</td><td>unicità, appartenenza veloce</td></tr></table></div>
<h3>Liste e slicing</h3><pre><code>nums = [5, 3, 8]
nums.append(1); nums.sort()
nums[0]; nums[-1]; nums[1:3]; nums[::-1]
len(nums); 8 in nums</code></pre>
<h3>Dict</h3><pre><code>utente = {"nome": "Ada", "eta": 36}
utente["citta"] = "Milano"
utente.get("x", "n/d")        # nessun KeyError
for k, v in utente.items():
    print(k, v)</code></pre>
<h3>Set e tuple</h3><pre><code>tag = {"a", "b", "a"}          # {'a', 'b'}
tag | {"c"}; tag &amp; {"a"}        # unione, intersezione
punto = (3, 4)
x, y = punto                   # unpacking</code></pre>
<h3>Comprehension</h3><pre><code>quadrati = [n * n for n in range(5) if n % 2 == 0]
per_nome = {u["nome"]: u for u in utenti}
unici = {t.lower() for t in tag}</code></pre>
<p>Attenzione: <code>b = a</code> non copia la lista, la condivide. Per copiarla: <code>a.copy()</code> o <code>list(a)</code>.</p>
<div class="say"><b>Cosa dire.</b> «Uso dict.get per i default, set per l'unicità e le comprehension al posto di map/filter.»</div>`,
  [
    q(
      'q1',
      'Cosa succede con <code>d["x"]</code> se la chiave manca?',
      ['None', 'KeyError', '0', 'Crea la chiave'],
      1,
      'Per evitarlo si usa d.get("x") o d.get("x", default).',
    ),
    q(
      'q2',
      'Quale struttura elimina i duplicati?',
      ['list', 'tuple', 'set', 'range'],
      2,
      'Un set tiene ogni elemento una sola volta.',
    ),
    q(
      'q3',
      'Cosa è <code>nums[::-1]</code>?',
      ['Errore', 'La lista invertita', "L'ultimo elemento", 'Una copia ordinata'],
      1,
      'Lo step -1 percorre la lista al contrario.',
    ),
    q(
      'q4',
      'Dopo <code>b = a</code> (liste), <code>b.append(1)</code> modifica anche a?',
      ['Sì, sono lo stesso oggetto', 'No, b è una copia', 'Solo se sono tuple', 'Dà errore'],
      0,
      "L'assegnazione copia il riferimento, non l'oggetto.",
    ),
  ],
  [
    card('c1', 'Dict con default', 'd.get(chiave, default).'),
    card('c2', 'Copiare una lista', 'a.copy() oppure list(a) oppure a[:].'),
    card('c3', 'List comprehension', '[espr for x in iter if cond].'),
    card('c4', 'Tuple vs lista', 'La tuple è immutabile e può essere chiave di un dict.'),
  ],
  [
    prac(
      'p1',
      'Conta quante volte compare ogni parola in una lista.',
      'Con un dict: conta[p] = conta.get(p, 0) + 1; oppure collections.Counter(lista).',
    ),
    prac(
      'p2',
      "Rimuovi i duplicati da una lista mantenendo l'ordine.",
      "list(dict.fromkeys(lista)): i dict mantengono l'ordine di inserimento.",
    ),
  ],
)

export const functions = mod(
  'functions',
  'Funzioni, argomenti e scope',
  'def, *args, **kwargs, default, lambda, closure',
  'base',
  `<p class="lead">Le funzioni sono oggetti: le passi, le restituisci, le metti in un dict.</p>
<pre><code>def saluta(nome, saluto="Ciao"):
    """Docstring: cosa fa la funzione."""
    return f"{saluto}, {nome}!"

saluta("Ada")
saluta("Ada", saluto="Buongiorno")   # argomento con nome</code></pre>
<h3>*args e **kwargs</h3><pre><code>def somma(*numeri):          # tuple di posizionali
    return sum(numeri)

def opzioni(**kw):           # dict di argomenti con nome
    return kw

somma(1, 2, 3)               # 6
valori = [1, 2, 3]
somma(*valori)               # spacchetta la lista</code></pre>
<h3>La trappola del default mutabile</h3><pre><code>def aggiungi(x, lista=[]):       # SBAGLIATO: la lista è creata una volta sola
    lista.append(x)
    return lista

def aggiungi(x, lista=None):     # giusto
    if lista is None:
        lista = []
    lista.append(x)
    return lista</code></pre>
<h3>Lambda e closure</h3><pre><code>ordinati = sorted(utenti, key=lambda u: u["eta"])

def contatore():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc</code></pre>
<p>Python ha scope a livello di funzione: <code>global</code> e <code>nonlocal</code> servono a riassegnare variabili esterne. Le funzioni restituiscono <code>None</code> se non c'è <code>return</code>.</p>
<div class="say"><b>Cosa dire.</b> «Evito i default mutabili usando None, e passo funzioni come key a sorted.»</div>`,
  [
    q(
      'q1',
      'Perché <code>def f(x, l=[])</code> è pericoloso?',
      ['La lista è creata una sola volta e condivisa tra le chiamate', 'Non compila', 'È lento', 'Python lo vieta'],
      0,
      'Il default è valutato alla definizione, non a ogni chiamata.',
    ),
    q(
      'q2',
      'Cosa contiene <code>args</code> in <code>def f(*args)</code>?',
      ['Una lista', 'Una tuple di posizionali', 'Un dict', 'Un set'],
      1,
      'I posizionali in eccesso finiscono in una tuple.',
    ),
    q(
      'q3',
      'A cosa serve <code>nonlocal</code>?',
      [
        'A rendere globale una variabile',
        'A riassegnare una variabile della funzione esterna',
        'A importare',
        'A creare costanti',
      ],
      1,
      'Permette a una funzione interna di modificare la variabile della esterna.',
    ),
    q(
      'q4',
      'Cosa restituisce una funzione senza return?',
      ['0', 'Stringa vuota', 'None', 'Errore'],
      2,
      'Restituisce None.',
    ),
  ],
  [
    card('c1', 'Argomenti con nome', 'f(a=1, b=2); in definizione **kwargs raccoglie i nome=valore.'),
    card('c2', 'Spacchettare una lista', 'f(*lista) e f(**dizionario).'),
    card('c3', 'Default sicuro', 'x=None e poi if x is None: x = [].'),
    card('c4', 'Ordinare per campo', 'sorted(lista, key=lambda u: u["campo"]).'),
  ],
  [
    prac(
      'p1',
      'Scrivi una funzione che accetta un numero qualsiasi di valori e ne restituisce massimo e minimo.',
      'def estremi(*v): return max(v), min(v)  (restituisce una tuple).',
    ),
    prac(
      'p2',
      'Spiega a voce il bug di <code>def add(x, acc=[])</code>.',
      'La lista di default è unica per tutte le chiamate: i risultati si accumulano. Si usa None e si crea la lista dentro.',
    ),
  ],
)

export const errors = mod(
  'errors',
  'File, errori e JSON',
  'with, open, pathlib, try/except, json, csv',
  'base',
  `<p class="lead">Leggere file, gestire gli errori e parlare JSON sono il pane quotidiano di uno script.</p>
<h3>File con with</h3><pre><code>from pathlib import Path

with open("dati.txt", encoding="utf-8") as f:
    for riga in f:
        print(riga.strip())

Path("out.txt").write_text("ciao", encoding="utf-8")
testo = Path("out.txt").read_text(encoding="utf-8")</code></pre>
<p><code>with</code> chiude il file anche se c'è un errore. Specifica sempre <code>encoding</code>.</p>
<h3>Eccezioni</h3><pre><code>try:
    n = int(input_utente)
except ValueError as e:
    print(f"non è un numero: {e}")
except (KeyError, IndexError):
    ...
else:
    print("nessun errore")
finally:
    print("sempre")

raise ValueError("valore non valido")</code></pre>
<ul><li>Cattura eccezioni <b>specifiche</b>, non <code>except:</code> nudo.</li><li>Puoi definire le tue: <code>class ErroreApp(Exception): pass</code>.</li><li>Filosofia EAFP: prova e gestisci l'errore, invece di controllare prima.</li></ul>
<h3>JSON e CSV</h3><pre><code>import json, csv

dati = json.loads('{"a": 1}')      # str -&gt; dict
testo = json.dumps(dati, indent=2)
with open("x.json", encoding="utf-8") as f:
    dati = json.load(f)

with open("x.csv", newline="", encoding="utf-8") as f:
    for riga in csv.DictReader(f):
        print(riga["nome"])</code></pre>
<div class="say"><b>Cosa dire.</b> «Uso with per le risorse, eccezioni specifiche e pathlib per i percorsi.»</div>`,
  [
    q(
      'q1',
      'Perché usare <code>with open(...)</code>?',
      ['È più veloce', 'Chiude il file anche in caso di errore', 'Legge in binario', 'È obbligatorio'],
      1,
      'Il context manager garantisce la chiusura.',
    ),
    q(
      'q2',
      'Cosa fa <code>json.loads</code>?',
      ['Scrive un file', 'Trasforma una stringa JSON in oggetti Python', 'Valida lo schema', 'Legge un file'],
      1,
      'loads lavora su stringhe; load su file.',
    ),
    q(
      'q3',
      'Quale è preferibile?',
      ['except:', 'except Exception: pass', 'except ValueError:', 'ignorare tutto'],
      2,
      'Cattura solo ciò che sai gestire.',
    ),
    q(
      'q4',
      'Cosa significa EAFP?',
      ['Easier to Ask Forgiveness than Permission', 'Execute And Finish Properly', 'Error And Fix Plan', 'Nulla'],
      0,
      "Provi l'operazione e gestisci l'eccezione.",
    ),
  ],
  [
    card('c1', 'Leggere un file di testo', 'Path(p).read_text(encoding="utf-8") o with open(...).'),
    card('c2', 'Sollevare un errore', 'raise ValueError("messaggio").'),
    card('c3', 'dumps vs dump', 'dumps → stringa; dump → file. Stessa cosa per loads/load.'),
    card('c4', 'Blocchi try', 'try / except / else (nessun errore) / finally (sempre).'),
  ],
  [
    prac(
      'p1',
      'Leggi un file JSON con una lista di utenti e stampa i nomi, gestendo il file mancante.',
      'try: with open(...) as f: dati = json.load(f) except FileNotFoundError: print("manca"); poi for u in dati: print(u["nome"]).',
    ),
    prac(
      'p2',
      "Crea un'eccezione personalizzata e spiega quando.",
      'class ErroreConfig(Exception): pass; si usa quando il dominio ha errori propri, per catturarli senza confondersi con quelli di sistema.',
    ),
  ],
)
