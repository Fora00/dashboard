import type { Course, CourseModule } from '../types'
import { finale } from './disegno.finale'
import { osserva } from './disegno.osserva'
import { spazio } from './disegno.spazio'

// Drawing from zero. Figures live in ../figures.tsx and are placed with <fig id="...">.
const segno: CourseModule = {
  id: 'segno',
  title: 'Il segno',
  subtitle: 'Strumenti, presa e linee sicure',
  vault: '',
  lesson: `<p class="lead">Disegnare è prima di tutto <b>guardare</b>, e poi fare segni controllati. La mano si allena come un muscolo: 10 minuti al giorno valgono più di 2 ore una volta a settimana.</p>
<h3>Cosa ti serve</h3>
<ul><li>Fogli di carta normale (anche da stampante), tanti: sono da buttare.</li>
<li>Una matita <b>HB</b> per cominciare, poi una <b>2B</b> e una <b>4B</b> per le ombre.</li>
<li>Una gomma pane. Il <b>bianco è la carta</b>: non si disegna, si lascia.</li></ul>
<h3>La presa</h3>
<ul><li>Per schizzi e gesti ampi tieni la matita <b>lunga</b>, quasi a metà, e muovi <b>spalla e gomito</b>.</li>
<li>Per i dettagli accorciala, come per scrivere.</li></ul>
<fig id="grip">
<h3>Ghosting: prima a vuoto, poi sul foglio</h3>
<p>Per una linea sicura: scegli due punti, fai il gesto <b>due o tre volte sopra il foglio senza toccarlo</b>, poi abbassa la matita e tira la linea in un solo gesto. La velocità conta più della precisione: una linea veloce viene dritta, una lenta trema.</p>
<h3>Le linee base</h3>
<fig id="lines">
<p>Dritte, curve, a S, il <b>tratteggio</b> (linee parallele e vicine, per fare ombra) e l'incrocio (due tratteggi che si incrociano, per un'ombra più scura).</p>
<div class="say">Un tratto deciso, anche se sbagliato, vale più di dieci timidi. Non cancellare: lascia la linea e tira quella giusta accanto, più leggera. La gomma si usa alla fine.</div>
<h3>Esercizi di riscaldamento (5 minuti)</h3>
<ol><li>Una pagina di linee dritte da un punto a un altro, col ghosting.</li>
<li>Una pagina di <b>ellissi</b> in fila. Non devono essere perfette: l'importante è farle in un gesto solo, senza punte agli estremi.</li>
<li>Una pagina di tratteggio con linee parallele a distanza uguale.</li></ol>`,
  quiz: [
    {
      id: 'q1',
      q: 'Cosa fai prima di tirare una linea lunga e sicura?',
      options: [
        'Vado piano per non sbagliare',
        'Faccio il gesto un paio di volte sopra il foglio, poi tiro la linea in un gesto',
        'Faccio tanti pezzetti e li unisco',
      ],
      answer: 1,
      explanation: 'Si chiama ghosting. La linea veloce e decisa viene più dritta di quella lenta, che trema.',
    },
    {
      id: 'q2',
      q: 'Hai fatto una linea storta. Cosa fai?',
      options: ['La cancello subito', 'La lascio e ne tiro una giusta accanto, più leggera', 'Ricomincio il foglio'],
      answer: 1,
      explanation: 'Le linee in più fanno parte dello schizzo. La gomma serve alla fine, non durante.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Prima di una linea lunga',
      back: 'Ghosting: gesto a vuoto 2-3 volte, poi un solo tratto veloce dalla spalla.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: 30 linee dritte, ognuna da un punto a un altro, col ghosting.',
      minutes: 8,
      checklist: [
        'Ogni linea è fatta in un gesto solo',
        'Le linee arrivano vicino al punto di arrivo',
        'Non ho cancellato niente',
        'Ho mosso la spalla, non solo il polso',
      ],
      answer:
        "All'inizio quasi tutte tremano o curvano. Con la velocità e la spalla, le ultime saranno meglio delle prime: confrontale.",
    },
    {
      id: 'p2',
      question: 'Su carta: una pagina di ellissi in fila, poi una di ellissi dentro altre ellissi.',
      minutes: 6,
      checklist: [
        'Ogni ellisse è fatta in un gesto solo (al massimo 2 giri)',
        'Gli estremi sono tondi, non a punta (come un limone)',
        'Le ellissi in fila hanno più o meno la stessa inclinazione',
      ],
      answer:
        "Le ellissi vengono meglio girando 2 volte a vuoto e poi 1 sul foglio. Gli estremi a punta sono l'errore più comune.",
    },
  ],
}

const forme: CourseModule = {
  id: 'forme',
  title: 'Dalle forme piatte ai solidi',
  subtitle: 'Sfera, cubo, cono e cilindro (e la scatola)',
  vault: '',
  lesson: `<p class="lead">Quasi ogni oggetto si scompone in pochi solidi: sfera, cubo, cono, cilindro. La <b>scatola</b> (il cubo allungato) è la forma più utile: serve per tutto ciò che è costruito, dal telefono alla casa.</p>
<fig id="forms">
<h3>Da piatto a solido</h3>
<ul><li><b>Cerchio → sfera</b>: aggiungi l'equatore, un'ellisse. La metà dietro è tratteggiata.</li>
<li><b>Quadrato → cubo</b>: ripeti il quadrato spostato in alto a destra e unisci gli angoli. Questa è una proiezione obliqua: semplice, ma non è la prospettiva vera (arriva più avanti nel corso).</li>
<li><b>Triangolo → cono</b>: la base diventa un'ellisse e i lati le sono tangenti, non la tagliano.</li>
<li><b>Rettangolo → cilindro</b>: un'ellisse sopra e una sotto, di cui si vede solo la metà davanti.</li></ul>
<h3>Disegna "attraverso"</h3>
<p>Disegna anche le linee che non si vedono, il retro del cubo e la metà nascosta delle ellissi, leggere o tratteggiate. Così la forma sta in piedi e le proporzioni tornano.</p>
<h3>Quanto è aperta un'ellisse?</h3>
<p>Dipende da quanto guardi il cerchio dall'alto: se lo vedi quasi di taglio l'ellisse è stretta, se lo vedi dall'alto è quasi un cerchio. Più avanti la lega a un'idea sola, la linea dell'orizzonte (l'altezza dei tuoi occhi).</p>
<div class="say">Davanti a un oggetto chiediti: "è una sfera, una scatola, un cilindro o un cono?" Una tazza è un cilindro, una mela quasi una sfera, un libro una scatola.</div>`,
  quiz: [
    {
      id: 'q1',
      q: "Perché disegni anche le linee nascoste (retro del cubo, metà dietro dell'ellisse)?",
      options: [
        'Per fare più ombre',
        'Perché la forma sta in piedi e le proporzioni tornano',
        'Per finire il disegno prima',
      ],
      answer: 1,
      explanation:
        'Vedere anche il retro ti fa capire il volume. Poi le linee nascoste si cancellano o restano leggere.',
    },
    {
      id: 'q2',
      q: "Una base ellittica di un cono: i lati del cono rispetto all'ellisse sono...",
      options: ['Tangenti, la sfiorano ai lati', "Tagliano l'ellisse", "Parte dell'ellisse"],
      answer: 0,
      explanation: "I lati toccano l'ellisse ai due fianchi, senza entrarci. Se la tagliano, il cono sembra storto.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Una tazza, una mela, un libro',
      back: 'Cilindro, sfera, scatola. Davanti a ogni oggetto trova prima il solido.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question:
        'Su carta: guarda 3 oggetti dal vivo (mela, tazza, scatola) e disegna il solido di ciascuno, con le linee nascoste leggere.',
      minutes: 15,
      checklist: [
        'Ho disegnato oggetti veri davanti a me, non foto',
        'Le ellissi delle tazze hanno gli estremi tondi',
        'Ho disegnato anche le linee nascoste',
        'I solidi sono grandi, occupano quasi tutto il foglio',
      ],
      answer:
        'Mela: sfera. Tazza: cilindro. Scatola: scatola. Se ti viene storto, ridisegnalo più grande e più veloce.',
    },
  ],
}

const luce: CourseModule = {
  id: 'luce',
  title: 'Luce e valori',
  subtitle: 'Far sembrare tonda una sfera',
  vault: '',
  lesson: `<p class="lead">Un solido sembra solido grazie alla luce. Con la sola matita dai volume con i <b>valori</b>: quanto è chiaro o scuro un punto. Scegli <b>da dove arriva la luce</b> e non cambiarla a metà disegno.</p>
<fig id="light">
<h3>Le zone dell'ombra</h3>
<ul><li><b>1 Luce</b>: la zona più chiara, vicino alla fonte. Spesso è la carta bianca.</li>
<li><b>2 Mezzatinta</b>: il passaggio graduale verso l'ombra.</li>
<li><b>3 Ombra propria</b>: la parte scura sull'oggetto. Il punto più scuro è un po' <b>dentro il bordo</b>, non sul bordo: lì arriva un po' di luce riflessa.</li>
<li><b>4 Luce riflessa</b>: un bordo appena più chiaro dentro l'ombra, rimandato dal piano.</li>
<li><b>5 Ombra portata</b>: l'ombra sul tavolo, più scura vicino all'oggetto, e si allunga <b>dal lato opposto alla luce</b>.</li></ul>
<p>Il confine tra luce e ombra propria si chiama <b>terminatore</b>. L'oggetto deve poggiare sull'ombra, non fluttuare sopra.</p>
<h3>La scala dei valori</h3>
<p>Prova a fare 5-7 gradini dal chiaro allo scuro. Con una sola HB ottieni i primi 3-4: per i più scuri usa la 2B e la 4B, premendo di più, mai sfregando con le dita.</p>
<fig id="values">
<h3>Quale ombra è giusta?</h3>
<p>Questo è il vero allenamento: giudicare con gli occhi. Prova il quiz.</p>`,
  quiz: [
    {
      id: 'q1',
      q: "La luce arriva da <b>sinistra</b>. Quale sfera ha l'ombra portata corretta?",
      options: ['A', 'B', 'C'],
      optionFigs: ['shade-right', 'shade-left', 'shade-float'],
      answer: 0,
      explanation:
        "A: l'ombra va a destra, dal lato opposto alla luce, e parte da dove la sfera tocca il piano. B ha l'ombra dal lato della luce; in C la sfera fluttua.",
    },
    {
      id: 'q2',
      q: "Dove è il punto più scuro dell'ombra propria?",
      options: [
        'Sul bordo esterno della sfera',
        "Un po' dentro il bordo, prima della luce riflessa",
        'Al centro della sfera',
      ],
      answer: 1,
      explanation: "Sul bordo arriva un po' di luce riflessa dal piano: la zona più scura è appena dentro.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Prima di ombreggiare',
      back: 'Decidi da dove arriva la luce, segna il terminatore, poi scurisci dal lato opposto. Non cambiare la luce.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: disegna una sfera poggiata sul tavolo, luce da sinistra, con tutte e 5 le zone.',
      minutes: 15,
      modelFig: 'light',
      checklist: [
        "L'ombra portata va a destra e tocca la sfera",
        "C'è una luce chiara, una mezzatinta e una zona scura",
        "L'ombra più scura è appena dentro il bordo, con un po' di luce riflessa",
        'Ho usato solo tratteggio, senza sfregare con le dita',
      ],
      answer: "Confronta con la figura: stessa luce, ombra portata a destra, la sfera poggia sull'ombra.",
    },
    {
      id: 'p2',
      question: 'Su carta: la scala dei valori in 5 gradini, dal bianco della carta al più scuro che ottieni.',
      minutes: 6,
      modelFig: 'values',
      checklist: [
        'I gradini sono distinti tra loro',
        'Il primo è la carta, senza matita',
        'Non si salta da chiaro a molto scuro tra due gradini',
      ],
      answer: 'Con la sola HB avrai 3-4 gradini. Con 2B e 4B arrivi a 5-7.',
    },
  ],
}

export const disegno: Course = {
  id: 'disegno',
  title: 'Disegno da zero',
  emoji: '✏️',
  summary: 'Dal segno ai solidi e alla luce, con figure disegnate. Esercizi su carta.',
  intro:
    'Corso per partire da zero, con carta e matita. Ogni modulo ha una lezione con figure, pochi quiz (anche con le immagini) ed esercizi su carta con un tempo e dei criteri da controllare sul tuo foglio. Pratica 10-15 minuti al giorno, un modulo ogni 1-2 settimane. Ripeti i primi moduli se serve: conta fare, non finire.',
  groups: [
    { id: 'base', label: '1. Il segno' },
    { id: 'osserva', label: '2. Imparare a guardare' },
    { id: 'spazio', label: '3. Spazio e forme' },
    { id: 'luce', label: '4. Luce' },
    { id: 'finale', label: '5. Dal vero' },
  ],
  modules: [
    { ...segno, group: 'base' },
    ...osserva.map((m) => ({ ...m, group: 'osserva' })),
    ...spazio.map((m) => ({ ...m, group: 'spazio' })),
    { ...forme, group: 'spazio' },
    { ...luce, group: 'luce' },
    ...finale.map((m) => ({ ...m, group: 'finale' })),
  ],
  references: [
    {
      label: 'Libro',
      path: 'Drawing on the Right Side of the Brain (B. Edwards)',
      note: 'Esercizi per imparare a guardare.',
    },
    { label: 'Corso gratuito online', path: 'Drawabox', note: 'Linee, ellissi e scatole: i primi moduli.' },
    { label: 'Video', path: 'Proko (canale YouTube)', note: 'Luce, forme e figura, in seguito.' },
  ],
}
