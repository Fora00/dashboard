import type { CourseModule } from '../types'

// Modules of the 'spazio' batch of the drawing course (order matters).
// Figures live in ../figures.spazio.tsx.
const orizzonte: CourseModule = {
  id: 'orizzonte',
  title: "La linea dell'orizzonte",
  subtitle: 'Altezza dei tuoi occhi: cosa vedi sopra e cosa sotto',
  vault: '',
  lesson: `<p class="lead">Prima di ogni prospettiva c'è una sola linea: l'<b>orizzonte</b>. È <b>l'altezza dei tuoi occhi</b>, sempre, anche in una stanza chiusa. Tutto il resto (scatole, ellissi, strade) si costruisce rispetto a lei.</p>
<h3>Dove sta l'orizzonte</h3>
<p>Alza la mano all'altezza degli occhi e guarda dritto: quella linea immaginaria che taglia la stanza è il tuo orizzonte. Se ti siedi, scende; se sali su una sedia, sale. Sul foglio è una linea orizzontale, leggera, che disegni <b>per prima</b>.</p>
<h3>Sopra, sotto, sull'orizzonte</h3>
<ul><li>Un oggetto <b>sopra</b> l'orizzonte lo guardi dal basso: vedi il suo fondo, non il sopra.</li>
<li>Un oggetto <b>sotto</b> l'orizzonte lo guardi dall'alto: vedi il suo sopra (un tavolo, un libro).</li>
<li>Un oggetto che <b>attraversa</b> l'orizzonte è alla tua altezza: non vedi né il sopra né il fondo.</li></ul>
<fig id="spazio-orizzonte">
<div class="say">Non è una formula da imparare: è una regola con cui costruire. Metti l'orizzonte, e sai già quali facce dell'oggetto puoi vedere.</div>
<h3>Perché le ellissi si aprono</h3>
<p>La bocca di un bicchiere è un cerchio orizzontale. Se è proprio all'altezza dei tuoi occhi lo vedi di taglio: una linea. Più sta <b>lontano dall'orizzonte</b> (sopra o sotto), più lo guardi dall'alto o dal basso, e più l'ellisse si apre. Quindi il bicchiere sul tavolo ha la bocca più aperta del fondo di un lampadario lontano.</p>
<fig id="spazio-ellissi">
<p>Pratico: quando disegni una tazza, chiediti <b>dov'è l'orizzonte</b>. Poi la bocca della tazza (vicina all'orizzonte) è più stretta, la base (più lontana) è un po' più aperta.</p>`,
  quiz: [
    {
      id: 'q1',
      q: 'Nella figura, su quale scatola vedi il lato <b>superiore</b>?',
      fig: 'spazio-orizzonte',
      options: ['Scatola 1', 'Scatola 2', 'Scatola 3'],
      answer: 2,
      explanation:
        "La 3 sta sotto l'orizzonte: la guardi dall'alto e vedi il sopra. La 1 è sopra (vedi il fondo), la 2 è sull'orizzonte (solo i lati).",
    },
    {
      id: 'q2',
      q: "Due bicchieri uguali: uno poco sotto l'orizzonte, uno molto sotto. Quale ha la bocca più aperta?",
      options: ['Quello poco sotto', 'Quello molto sotto', 'Uguale: dipende solo dalla grandezza'],
      answer: 1,
      explanation: "Più è lontano dall'orizzonte, più lo guardi dall'alto e più l'ellisse è aperta.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Orizzonte e ellissi',
      back: "L'orizzonte è l'altezza dei tuoi occhi. Più un cerchio è lontano dall'orizzonte, più la sua ellisse è aperta.",
    },
  ],
  practice: [
    {
      id: 'p1',
      question:
        "Su carta: traccia l'orizzonte e disegna 3 scatole semplici (rettangoli con profondità): una sopra, una che lo attraversa, una sotto. Poi guarda quali facce si vedono.",
      minutes: 8,
      modelFig: 'spazio-orizzonte',
      checklist: [
        "L'orizzonte è una linea orizzontale tracciata prima delle scatole",
        'Sulla scatola sopra si vede il fondo, non il sopra',
        'Sulla scatola sotto si vede il sopra',
        'La scatola che attraversa la linea mostra solo i lati',
      ],
      answer:
        "Non importa se i lati non convergono ancora bene (arriva nel prossimo modulo): conta decidere quali facce vedi in base all'orizzonte.",
    },
    {
      id: 'p2',
      question: "Su carta: disegna l'orizzonte e 5 ellissi uguali di larghezza, sempre più lontane dall'orizzonte.",
      minutes: 5,
      modelFig: 'spazio-ellissi',
      checklist: [
        "La prima è quasi una linea, vicina all'orizzonte",
        'Ogni ellisse è più aperta della precedente',
        'Hanno tutte la stessa larghezza',
        'Gli estremi sono tondi, non a punta',
      ],
      answer:
        "Segna prima la larghezza con due puntini e poi decidi quanto è alta l'ellisse: sempre più alta man mano che scendi.",
    },
  ],
}

const punto1: CourseModule = {
  id: 'punto1',
  title: 'Un punto di fuga',
  subtitle: 'Strade e scatole che si allontanano',
  vault: '',
  lesson: `<p class="lead">Le linee parallele che si allontanano da te sembrano incontrarsi in un punto sull'orizzonte: il <b>punto di fuga</b>. Pensa ai binari del treno. Con <b>un solo</b> punto di fuga disegni cose viste di fronte: un corridoio, una strada, una scatola frontale.</p>
<h3>La strada</h3>
<p>I bordi della strada sono paralleli nella realtà, ma sul foglio vanno tutti al punto di fuga. Le <b>linee frontali</b> (orizzontali e verticali, quelle parallele al foglio) restano orizzontali e verticali: <b>convergono solo le linee di profondità</b>.</p>
<fig id="spazio-fuga1">
<p>Nota anche i tratti della mezzeria: più lontani, più corti e più vicini. Le scatole a lato mostrano il sopra (sono sotto l'orizzonte) e la faccia rivolta verso il centro.</p>
<h3>Una scatola in 5 passi</h3>
<p>Questa è una regola con cui costruire, non una formula da ricordare: ogni passo è una linea che puoi tirare con la matita.</p>
<p><b>Passo 1.</b> Orizzonte, punto di fuga e un quadrato davanti.</p>
<fig id="spazio-cubo-1">
<p><b>Passo 2.</b> Linee leggere dagli angoli verso il punto di fuga.</p>
<fig id="spazio-cubo-2">
<p><b>Passo 3.</b> Scegli quanto è profonda la scatola: un lato verticale tra le due guide.</p>
<fig id="spazio-cubo-3">
<p><b>Passo 4.</b> Da lì un lato orizzontale (parallelo al davanti) fino alla guida di sinistra.</p>
<fig id="spazio-cubo-4">
<p><b>Passo 5.</b> Ripassa i lati che vedi, e disegna tratteggiati quelli nascosti.</p>
<fig id="spazio-cubo-5">
<div class="say">Più è profonda la scatola, più il lato verticale si allontana dal quadrato. Se lo scegli corto sembra una piastrella, se lo scegli lungo un tunnel.</div>`,
  quiz: [
    {
      id: 'q1',
      q: "Il punto di fuga (PF) è sull'orizzonte. Quale scatola ha la prospettiva giusta?",
      options: ['A', 'B', 'C'],
      optionFigs: ['spazio-q-parallele', 'spazio-q-ok', 'spazio-q-storta'],
      answer: 1,
      explanation:
        'B: le linee di profondità vanno verso il punto di fuga e il retro è un quadrato più piccolo. In A le linee sono parallele tra loro e non convergono; in C un angolo del retro è fuori posto.',
    },
    {
      id: 'q2',
      q: 'In una scatola frontale (un punto di fuga), quali linee convergono?',
      options: ['Tutte', 'Solo quelle di profondità', 'Solo le verticali'],
      answer: 1,
      explanation: 'Le linee orizzontali e verticali della faccia davanti restano orizzontali e verticali.',
    },
  ],
  cards: [],
  practice: [
    {
      id: 'p1',
      question:
        'Su carta: disegna una strada che si allontana con 2 scatole ai lati, partendo da orizzonte e punto di fuga.',
      minutes: 12,
      modelFig: 'spazio-fuga1',
      checklist: [
        "Ho tracciato prima l'orizzonte e un solo punto di fuga",
        'Tutti i bordi della strada vanno al punto di fuga',
        'Le facce davanti delle scatole hanno lati orizzontali e verticali',
        'Ho usato linee leggere di guida, poi ho ripassato',
      ],
      answer:
        "Se un bordo non punta al punto di fuga, ricalcolalo: appoggia una matita come righello tra il punto di fuga e l'angolo.",
    },
    {
      id: 'p2',
      question: 'Su carta: ripeti la scatola in 5 passi tre volte, con profondità diverse.',
      minutes: 10,
      modelFig: 'spazio-cubo-5',
      checklist: [
        'Le guide partono da tre angoli del quadrato',
        'Il lato verticale in fondo è davvero verticale',
        'I lati nascosti sono tratteggiati o leggeri',
      ],
      answer: 'Il lato verticale di fondo è sempre più corto del davanti, perché è più lontano.',
    },
  ],
}

const punti2: CourseModule = {
  id: 'punti2',
  title: 'Due punti di fuga',
  subtitle: 'Il cubo ad angolo e gli errori tipici',
  vault: '',
  lesson: `<p class="lead">Quando vedi una scatola <b>dall'angolo</b>, nessun lato è frontale: servono <b>due punti di fuga</b>, entrambi sull'orizzonte, uno a sinistra e uno a destra. I verticali restano verticali.</p>
<h3>Il cubo ad angolo</h3>
<ol><li>Orizzonte, e due punti di fuga lontani tra loro (anche ai bordi del foglio).</li>
<li>Uno spigolo verticale: è l'angolo più vicino a te.</li>
<li>Dalla cima e dal fondo dello spigolo tira linee verso <b>entrambi</b> i punti di fuga.</li>
<li>Due verticali chiudono le facce a sinistra e a destra.</li>
<li>Dalle cime di queste due verticali tira le linee verso il punto opposto: dove si incrociano è il retro.</li></ol>
<fig id="spazio-due-punti">
<h3>Sopra o sotto l'orizzonte</h3>
<p>Valgono le stesse regole di prima. Sopra l'orizzonte vedi il fondo, sotto vedi il sopra, e se il cubo lo attraversa non vedi né l'uno né l'altro.</p>
<fig id="spazio-sopra-sotto">
<h3>Errori tipici</h3>
<ul><li><b>Linee che non convergono</b>: tirate parallele "a occhio". Usa la matita come righello verso il punto di fuga.</li>
<li><b>Punti di fuga troppo vicini</b>: il cubo si deforma, con angoli troppo acuti. Mettili più lontani, anche fuori dal foglio.</li>
<li><b>Verticali storti</b>: devono restare verticali, controlla con il bordo del foglio.</li>
<li><b>Orizzonte dimenticato</b>: non sai più quali facce vedere.</li></ul>
<div class="say">La prospettiva è una regola con cui costruire: ogni linea ha una direzione precisa (un punto di fuga o la verticale). Se sbagli, correggi la direzione, non l'occhio.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'In un cubo ad angolo con due punti di fuga, gli spigoli verticali...',
      fig: 'spazio-due-punti',
      options: ['Convergono verso il basso', 'Restano verticali', 'Convergono ad un terzo punto'],
      answer: 1,
      explanation: 'I verticali non cambiano: convergono solo gli spigoli diretti verso i due punti di fuga.',
    },
    {
      id: 'q2',
      q: 'Il tuo cubo sembra deformato, con angoli molto acuti. Causa più probabile?',
      options: ['I punti di fuga sono troppo vicini', "L'orizzonte è troppo basso", 'Ho usato la matita HB'],
      answer: 0,
      explanation: 'Con punti di fuga vicini le linee si inclinano troppo. Mettili più lontani.',
    },
  ],
  cards: [],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: disegna un cubo ad angolo con due punti di fuga, partendo da un orizzonte.',
      minutes: 12,
      modelFig: 'spazio-due-punti',
      checklist: [
        "L'orizzonte e i due punti di fuga sono segnati prima",
        'Tutte le linee inclinate puntano a uno dei due punti',
        'Gli spigoli verticali sono verticali',
        'Gli spigoli nascosti sono tratteggiati',
      ],
      answer: 'Se il retro non torna, controlla che le linee dalle cime verticali puntino davvero al punto opposto.',
    },
    {
      id: 'p2',
      question: "Su carta: disegna 3 cubi ad angolo, uno sopra l'orizzonte, uno che lo attraversa e uno sotto.",
      minutes: 10,
      modelFig: 'spazio-sopra-sotto',
      checklist: [
        'Il cubo sopra mostra il fondo',
        'Il cubo sotto mostra il sopra',
        "Il cubo sull'orizzonte non mostra né sopra né fondo",
      ],
      answer: "Se non sai quali facce vedere, guarda dove sta il cubo rispetto alla linea dell'orizzonte.",
    },
  ],
}

const combinare: CourseModule = {
  id: 'combinare',
  title: 'Combinare le forme',
  subtitle: 'Tazza, bottiglia, libro: scatole e cilindri',
  vault: '',
  lesson: `<p class="lead">Ogni oggetto quotidiano è fatto di scatole e cilindri messi insieme. Se li trovi <b>prima</b> dei dettagli, il disegno sta in piedi; se parti dai dettagli, si storce.</p>
<h3>Scomporre</h3>
<ul><li>La <b>tazza</b> è un cilindro con un manico ad anello.</li>
<li>La <b>bottiglia</b> è un cilindro grande, una spalla che si stringe e un cilindro piccolo (il collo).</li>
<li>Il <b>libro</b> è una scatola bassa: vale tutto quello visto sulla scatola.</li></ul>
<fig id="spazio-combina">
<h3>Ordine di lavoro</h3>
<ol><li>Orizzonte (altezza dei tuoi occhi).</li>
<li>Solidi grandi, leggeri, con le linee nascoste.</li>
<li>Collegamenti: spalla, manico.</li>
<li>Solo alla fine: bordi, ombra, dettagli.</li></ol>
<h3>La tazza in tre passi</h3>
<fig id="spazio-tazza-passi">
<p>Le ellissi: la base è più aperta della bocca se l'oggetto è sotto l'orizzonte. Il bordo della tazza è un'ellisse dentro un'altra.</p>
<div class="say">Non iniziare dal manico: è il dettaglio che si sposta se il cilindro è storto.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Come parti per disegnare la bottiglia?',
      fig: 'spazio-combina',
      options: ["Dall'etichetta", 'Da due cilindri uniti da una spalla', 'Dal tappo'],
      answer: 1,
      explanation: 'Prima i solidi grandi, poi i collegamenti, poi i dettagli.',
    },
    {
      id: 'q2',
      q: 'Cosa disegni per ultimo?',
      options: ['Il manico', "L'orizzonte", 'Ombre e dettagli'],
      answer: 2,
      explanation: "L'orizzonte viene sempre prima. Dettagli e ombre sono l'ultimo passo.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Ordine per un oggetto',
      back: 'Orizzonte, solidi grandi leggeri (anche i nascosti), collegamenti, dettagli e ombre per ultimi.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: una tazza in tre passi (cilindro, bordo e manico, ombra), copiando da una tazza vera.',
      minutes: 10,
      modelFig: 'spazio-tazza-passi',
      checklist: [
        'Ho disegnato prima un cilindro, senza manico',
        "L'ellisse della base è più aperta di quella della bocca",
        'Il manico parte e arriva sul cilindro',
      ],
      answer: 'Se la tazza è storta, il problema è quasi sempre il cilindro, non il manico: correggi il cilindro.',
    },
    {
      id: 'p2',
      question: 'Su carta: metti sul tavolo bottiglia, libro e tazza, e disegnali scomposti in solidi.',
      minutes: 15,
      modelFig: 'spazio-combina',
      checklist: [
        "Ho tracciato l'orizzonte prima",
        'Ogni oggetto è prima fatto di solidi leggeri',
        "Le ellissi più lontane dall'orizzonte sono più aperte",
        'I dettagli sono solo alla fine',
      ],
      answer:
        'Disegna gli oggetti sulla stessa riga e con lo stesso orizzonte: le proporzioni tra loro contano più dei dettagli.',
    },
  ],
}

export const spazio: CourseModule[] = [orizzonte, punto1, punti2, combinare]
