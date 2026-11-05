import type { CourseModule } from '../types'

// Modules of the 'osserva' batch of the drawing course (order matters).
// Learning to look: observe first, outline before details, no eraser.

const riempire: CourseModule = {
  id: 'riempire',
  title: 'Riempire lo spazio',
  subtitle: 'Forme semplici e sovrapposizione = profondità',
  vault: '',
  lesson: `<p class="lead">Prima di disegnare cose, impara a <b>occupare il foglio</b>. Cerchi e quadrati bastano: se uno ne copre un altro, l'occhio lo legge come "davanti" e "dietro". È il primo trucco della profondità, e non costa niente.</p>
<fig id="osserva-riempire">
<h3>Il trucco: far coprire</h3>
<p>Le stesse tre forme sono piatte quando tutte le linee si vedono, e hanno profondità quando una <b>interrompe</b> il contorno dell'altra. Quando due forme si toccano, disegna per prima quella <b>davanti</b>, intera. Quella dietro si ferma contro il suo bordo.</p>
<h3>Come riempire una pagina</h3>
<ol><li>Parti dal centro con una forma grande, poi aggiungine altre attorno, anche tagliate dal bordo del foglio.</li>
<li>Alterna <b>cerchi e quadrati</b>, grandi e piccoli. Le forme uguali vicine annoiano l'occhio.</li>
<li>Sovrapponile ogni volta che puoi: ogni incrocio è una scelta davanti/dietro.</li>
<li>Non lasciare buchi grandi: se resta uno spazio, riempilo con una forma più piccola.</li></ol>
<h3>Perché lo facciamo</h3>
<p>Ti abitua a vedere un oggetto come <b>forma più forma</b>, non come "cosa". Una tazza dietro una mela è un cerchio che ne copre un altro.</p>
<div class="say">Se la linea della forma dietro attraversa quella davanti, la pagina si appiattisce. Fermala al bordo.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Il cerchio <b>piccolo</b> deve stare <b>davanti</b> a quello grande. Quale figura?',
      options: ['A', 'B', 'C'],
      optionFigs: ['osserva-ov-wire', 'osserva-ov-back', 'osserva-ov-front'],
      answer: 2,
      explanation:
        'In C il piccolo interrompe il contorno del grande: è davanti. In B succede il contrario. In A le linee si attraversano e non si capisce chi è davanti.',
    },
    {
      id: 'q2',
      q: 'Due forme si sovrappongono. Cosa fai con la linea della forma dietro?',
      options: [
        'La faccio passare attraverso quella davanti',
        'La fermo contro il bordo di quella davanti',
        'La faccio più spessa',
      ],
      answer: 1,
      explanation:
        'La forma dietro si vede solo dove non è coperta. Se la linea continua, i due oggetti sembrano trasparenti.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Come si fa sembrare un cerchio davanti a un altro?',
      back: 'Si disegna intero il cerchio davanti; il contorno di quello dietro si ferma al suo bordo.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: riempi un foglio intero con cerchi e quadrati di dimensioni diverse, sovrapposti.',
      minutes: 10,
      modelFig: 'osserva-riempire',
      checklist: [
        'Ci sono almeno 10 forme, grandi e piccole',
        "Almeno 5 forme ne coprono un'altra (la linea dietro si ferma)",
        'Nessuna linea passa attraverso una forma che sta davanti',
        'Non ci sono spazi vuoti più grandi della forma più piccola',
      ],
      answer:
        "Controlla gli incroci uno a uno: se vedi una linea attraversare una forma, quell'incrocio è piatto. Nel foglio dopo, ferma la linea al bordo.",
    },
  ],
}

const cieco: CourseModule = {
  id: 'cieco',
  title: 'Contorno cieco',
  subtitle: 'La tua mano, senza guardare il foglio',
  vault: '',
  lesson: `<p class="lead">Il disegno peggiora quando smetti di guardare l'oggetto per controllare la matita. Il <b>contorno cieco</b> (Edwards) fa il contrario: guardi solo l'oggetto, e la matita segue. Il risultato è brutto, ed è normale: l'esercizio serve a guardare.</p>
<h3>Preparazione</h3>
<ul><li>Siediti con la mano <b>non dominante</b> aperta davanti a te, appoggiata. Il foglio sta dall'altra parte, e con l'altro braccio non vedi cosa fai.</li>
<li>Se ti viene da sbirciare, metti un cartone o un altro foglio tra occhi e matita.</li>
<li>Matita HB, un foglio, un timer. Niente gomma.</li></ul>
<h3>Come si fa</h3>
<ol><li>Scegli un punto del contorno (la base del pollice, per esempio) e metti la matita sul foglio.</li>
<li>Guarda <b>solo la mano</b>. Segui il bordo con gli occhi, <b>lentamente</b>, quasi un millimetro alla volta.</li>
<li>La matita si muove alla stessa velocità dell'occhio. Se l'occhio si ferma, ferma anche la matita.</li>
<li>Includi le pieghe e le rughe principali dentro il contorno.</li>
<li>Non staccare la matita e non guardare il foglio fino alla fine.</li></ol>
<fig id="osserva-cieco">
<h3>Cosa aspettarti</h3>
<p>Le proporzioni saranno sballate e la linea non si chiude: è giusto così. Quello che si vede è una <b>linea viva</b>, con dettagli che non avresti mai disegnato guardando il foglio. Il vero risultato sta nell'attenzione che hai tenuto sul bordo.</p>
<div class="say">Se il disegno ti sembra bello, probabilmente hai sbirciato. Ripeti più lentamente.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Durante il contorno cieco, dove guardi?',
      options: [
        'Il foglio, ogni tanto, per correggere',
        "Solo l'oggetto, e la matita segue l'occhio",
        'Un punto a metà, tra oggetto e foglio',
      ],
      answer: 1,
      explanation: "Il punto è non controllare. L'occhio segue il bordo e la matita lo copia alla stessa velocità.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Contorno cieco: due regole',
      back: "Guardi solo l'oggetto, e la matita non si stacca dal foglio. Occhio e matita vanno alla stessa velocità, lenta.",
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: contorno cieco della tua mano non dominante aperta, una sola linea continua.',
      minutes: 6,
      modelFig: 'osserva-cieco',
      checklist: [
        'Non ho guardato il foglio finché non ho finito',
        'La matita non si è mai staccata dal foglio',
        'Ci sono pieghe o dettagli dentro il contorno',
        'Ho impiegato almeno 5 minuti (lento)',
      ],
      answer:
        'Le dita saranno troppo lunghe o sovrapposte: non conta. Controlla solo i criteri di velocità e attenzione. Se hai finito in 2 minuti, ripeti più piano.',
    },
    {
      id: 'p2',
      question: 'Su carta: contorno cieco di un oggetto piccolo (chiave, sasso, foglia) con la stessa regola.',
      minutes: 5,
      checklist: [
        'Non ho guardato il foglio durante il disegno',
        "Ho seguito il bordo dell'oggetto con gli occhi, lentamente",
        'Ho fatto una linea sola, senza staccare',
      ],
      answer:
        'Un oggetto semplice è più facile della mano. Se ti sembra troppo semplice, scegli una foglia con il bordo frastagliato.',
    },
  ],
}

const negativo: CourseModule = {
  id: 'negativo',
  title: 'Spazi negativi',
  subtitle: 'Una sedia disegnata dagli spazi vuoti',
  vault: '',
  lesson: `<p class="lead">Ogni oggetto ha un <b>contorno</b> e uno spazio attorno. Lo spazio tra le parti (tra le gambe di una sedia, nel manico di una tazza) è <b>lo spazio negativo</b>: ha forme chiare e semplici, e non ha un nome in testa. Per questo si disegna bene.</p>
<fig id="osserva-negativo">
<h3>Il trucco</h3>
<p>Le parti di una sedia ti fanno pensare "gamba, schienale, seduta" e disegni il simbolo. I vuoti sono solo forme: rettangoli, triangoli, un quadrato storto. Disegnale e la sedia appare da sola.</p>
<h3>Come si fa</h3>
<ol><li>Scegli una sedia semplice e traccia un <b>rettangolo</b> che la contenga tutta: altezza e larghezza.</li>
<li>Guarda solo i vuoti: quello tra le gambe, quelli tra i pioli dello schienale, quello sotto la seduta.</li>
<li>Disegna il contorno di ogni vuoto e <b>riempilo di tratteggio leggero</b>.</li>
<li>Controlla ogni vuoto con il bordo del rettangolo: quanto è alto? Quanto è largo rispetto agli altri?</li></ol>
<h3>Perché funziona</h3>
<p>Se i vuoti sono giusti, le parti attorno lo sono per forza. Non puoi sbagliare lo spessore di una gamba senza deformare lo spazio accanto.</p>
<div class="say">Quando non capisci una forma, disegna quello che c'è intorno.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Quale figura mostra gli <b>spazi negativi</b> della sedia?',
      options: ['A', 'B', 'C'],
      optionFigs: ['osserva-chair-pos', 'osserva-chair-line', 'osserva-chair-neg'],
      answer: 2,
      explanation:
        "In C sono riempiti i vuoti tra le parti. In A sono riempite le parti stesse (spazio positivo). In B c'è solo il contorno.",
    },
    {
      id: 'q2',
      q: 'Perché disegnare il vuoto aiuta?',
      options: [
        'Perché i vuoti sono forme senza nome, e non disegni il simbolo ma quello che vedi',
        'Perché è più veloce',
        'Perché si usa meno matita',
      ],
      answer: 0,
      explanation: 'Davanti a una gamba disegni "una gamba". Davanti a un vuoto vedi solo una forma, e la copi.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Non capisco una forma. Cosa faccio?',
      back: 'Guardo e disegno lo spazio vuoto attorno: ha forme semplici e senza nome.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: una sedia vera, disegnata solo dagli spazi vuoti dentro un rettangolo di riferimento.',
      minutes: 15,
      modelFig: 'osserva-negativo',
      checklist: [
        'Ho disegnato prima un rettangolo che contiene la sedia',
        'Ho disegnato i vuoti, non le gambe e i pioli',
        'I vuoti toccano il bordo del rettangolo dove la sedia lo tocca',
        'Non ho usato la gomma',
      ],
      answer:
        'Se la sedia sembra storta, guarda quale vuoto è troppo largo o alto e confrontalo con il vuoto accanto. Ridisegna su un altro foglio.',
    },
  ],
}

const capovolto: CourseModule = {
  id: 'capovolto',
  title: 'Copiare capovolto',
  subtitle: 'Perché funziona: simboli contro ciò che vedi',
  vault: '',
  lesson: `<p class="lead">Se capovolgi un disegno, lo copi meglio. Non è magia: capovolto non riconosci più "un vaso" e il cervello smette di usare il simbolo. Rimangono linee, curve e distanze, che sai copiare.</p>
<fig id="osserva-capovolto">
<h3>Simboli e cose viste</h3>
<p>Da bambino hai imparato un simbolo per ogni cosa: l'occhio a mandorla, la casa con il tetto, la mela con la foglia. Disegni il simbolo, non l'oggetto che hai davanti. Capovolto il simbolo non scatta.</p>
<h3>Come si fa</h3>
<ol><li>Prendi un disegno semplice a linee (un'illustrazione, un fumetto, un logo). Non una foto.</li>
<li>Mettilo <b>a testa in giù</b> davanti a te e metti un foglio vuoto, dritto, accanto.</li>
<li>Parti dall'alto: copia <b>una linea alla volta</b>, notando dove inizia, come curva, dove finisce rispetto a quelle vicine.</li>
<li>Non pensare cosa rappresenta. Chiediti solo: "quanto è inclinata?", "dove incontra l'altra?".</li>
<li>Alla fine gira il foglio: la sorpresa è che il disegno funziona.</li></ol>
<h3>Cosa portare via</h3>
<p>Il disegno non è una questione di mano, ma di <b>attenzione</b>. Per disegnare qualcosa di vero, a volte devi smettere di sapere cos'è.</p>
<div class="say">Quando non riesci a copiare qualcosa, girala. Se diventa facile, il problema era il simbolo nella tua testa.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Perché copiare capovolto aiuta?',
      options: [
        'Perché capovolto non lo riconosci, e disegni linee e distanze invece del simbolo',
        'Perché la mano è più sciolta',
        'Perché il disegno diventa più semplice',
      ],
      answer: 0,
      explanation: 'Il disegno è lo stesso. Cambia che il cervello non può dire "è un vaso" e deve guardare.',
    },
    {
      id: 'q2',
      q: 'Mentre copi capovolto, cosa ti chiedi?',
      options: ['Cosa rappresenta?', 'Quanto è inclinata questa linea e dove incontra la vicina?', 'Mi piace?'],
      answer: 1,
      explanation:
        "Tieni la domanda sulle linee e sulle distanze. Il nome dell'oggetto è proprio il simbolo da evitare.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Perché si copia capovolto?',
      back: "Capovolto non riconosci l'oggetto, quindi non disegni il simbolo: copi linee, curve e distanze.",
    },
  ],
  practice: [
    {
      id: 'p1',
      question: "Su carta: copia a testa in giù un disegno semplice a linee, partendo dall'alto, senza girarlo.",
      minutes: 20,
      modelFig: 'osserva-capovolto',
      checklist: [
        'Il disegno originale era capovolto per tutto il tempo',
        'Ho copiato una linea alla volta, senza pensare cosa fosse',
        'Ho confrontato inclinazioni e distanze con le linee vicine',
        'Ho girato il foglio solo alla fine',
      ],
      answer:
        'Girando il foglio vedrai che le proporzioni sono migliori di quelle che ottieni di solito. Se si somiglia poco, probabilmente hai pensato al nome mentre disegnavi: ripeti più lentamente.',
    },
  ],
}

const misurare: CourseModule = {
  id: 'misurare',
  title: 'Proporzioni e misura',
  subtitle: 'La matita a braccio teso come righello',
  vault: '',
  lesson: `<p class="lead">Quando una proporzione è sbagliata, di solito non l'hai misurata. Con la matita a <b>braccio teso</b> trasformi "mi sembra più largo" in un numero: due unità e mezza, una e mezza. Poi confronti.</p>
<fig id="osserva-braccio">
<h3>La posizione</h3>
<ul><li>Tieni la matita <b>verticale</b>, a braccio teso, <b>gomito dritto</b>. Sempre alla stessa distanza dall'occhio: se pieghi il braccio la misura cambia.</li>
<li>Chiudi un occhio. Allinea la punta con la cima dell'oggetto e sposta il pollice dove finisce la base.</li>
<li>Quella lunghezza sulla matita è la tua <b>unità</b>. Senza muovere il pollice, giri la matita e vedi quante unità sono larghe.</li></ul>
<h3>L'unità di misura</h3>
<p>Scegli una parte dell'oggetto come unità (di solito l'altezza) e misura tutto il resto con quella. Il risultato è una frazione, per esempio "una larghezza è 1 unità e mezza".</p>
<fig id="osserva-unita">
<h3>Poi confronta</h3>
<p>Riporta la proporzione sul foglio: se l'altezza è 6 cm, la larghezza è 9. Controlla anche i rapporti tra le parti, non solo il totale.</p>
<div class="say">Tieni la stessa distanza e lo stesso occhio ogni volta. Una misura presa a braccio piegato è sbagliata.</div>`,
  quiz: [
    {
      id: 'q1',
      q: "Hai misurato: la larghezza è <b>1,5 volte</b> l'altezza. Quale rettangolo?",
      options: ['A', 'B', 'C'],
      optionFigs: ['osserva-ratio-10', 'osserva-ratio-15', 'osserva-ratio-22'],
      answer: 1,
      explanation: 'B: una larghezza e mezza. A è un quadrato (1 volta), C è più di due volte.',
    },
    {
      id: 'q2',
      q: 'Perché si tiene il braccio sempre teso e dritto?',
      options: [
        "Perché la misura cambia se cambia la distanza dall'occhio",
        'Per sembrare precisi',
        'Perché la matita è più stabile',
      ],
      answer: 0,
      explanation:
        "Più avvicini la matita all'occhio, più sembra grande l'oggetto. La distanza dev'essere sempre la stessa.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Misurare con la matita',
      back: "Braccio teso, un occhio chiuso: la punta in cima, il pollice in fondo. Quella è l'unità; poi conti quante volte sta nel resto.",
    },
  ],
  practice: [
    {
      id: 'p1',
      question:
        'Su carta: scegli un oggetto rettangolare (libro, telefono, scatola) e disegnalo con la proporzione misurata.',
      minutes: 10,
      modelFig: 'osserva-unita',
      checklist: [
        "Ho misurato l'altezza con la matita a braccio teso e lo stesso occhio",
        'Ho annotato quante unità è larga',
        'Nel disegno il rapporto larghezza/altezza è lo stesso',
        'Ho controllato almeno una proporzione interna',
      ],
      answer:
        "Misura sul foglio con la stessa unità: se la larghezza è 1,5 volte l'altezza, deve essere così anche sul foglio. Se non torna, correggi il lato sbagliato (non tutti e due).",
    },
    {
      id: 'p2',
      question:
        "Su carta: la stessa misura su una finestra o una porta, poi confronta con la mano il disegno e l'originale.",
      minutes: 8,
      checklist: [
        'Ho usato la stessa unità per altezza e larghezza',
        "Ho confrontato il disegno con la matita come per l'originale",
        'Non ho tolto niente con la gomma',
      ],
      answer:
        'Il confronto con la stessa matita ti dice dove sbagli: se il disegno è più largo, riduci il lato sul foglio.',
    },
  ],
}

const angoli: CourseModule = {
  id: 'angoli',
  title: 'Angoli e linee guida',
  subtitle: 'Verticale e orizzontale come riferimenti',
  vault: '',
  lesson: `<p class="lead">Un angolo è difficile da vedere "nel vuoto". Se lo confronti con la <b>verticale</b> e l'<b>orizzontale</b> diventa facile: sai già com'è dritto, quindi vedi quanto una linea si allontana.</p>
<fig id="osserva-angoli">
<h3>Gli angoli che ti servono</h3>
<ul><li><b>45°</b>: la diagonale perfetta, a metà tra orizzontale e verticale.</li>
<li><b>30°</b>: una linea bassa, più vicina all'orizzontale che alla diagonale; <b>60°</b> è l'opposto, più vicina alla verticale.</li>
<li>Con questi tre e le due linee di riferimento stimi quasi tutto a occhio.</li></ul>
<h3>Come stimare</h3>
<ol><li>Immagina (o tieni a braccio teso la matita) una linea <b>verticale</b> e una <b>orizzontale</b> che passano dall'inizio della linea.</li>
<li>Chiediti: sta più vicina alla verticale o all'orizzontale? A metà?</li>
<li>Decidi un angolo e disegnalo. <b>Dopo</b> confronta, senza cambiare il disegno.</li></ol>
<h3>La stella</h3>
<fig id="osserva-stella">
<p>Metti un punto al centro, traccia i due assi leggeri e copia i raggi, ognuno dal punto verso l'esterno. <b>Non misurare</b>: stima l'angolo e la lunghezza. Poi sovrapponi un foglio trasparente o confronta con la matita, e guarda dove ti sei sbagliato.</p>
<div class="say">Sbagli sempre nello stesso senso? Bene: è un'informazione. Correggi il prossimo, non quello fatto.</div>`,
  quiz: [
    {
      id: 'q1',
      q: "Quale linea è circa a <b>30°</b> sopra l'orizzontale? (45° è la diagonale perfetta)",
      options: ['A', 'B', 'C'],
      optionFigs: ['osserva-ang-10', 'osserva-ang-30', 'osserva-ang-60'],
      answer: 1,
      explanation: 'B: più bassa della diagonale a 45° ma non quasi piatta. A è circa 10°, C è circa 60°.',
    },
    {
      id: 'q2',
      q: 'Per stimare un angolo, a cosa lo confronti?',
      options: ['A un angolo che ho in mente', 'Alla verticale e alla orizzontale', 'A un righello'],
      answer: 1,
      explanation: "La verticale e l'orizzontale le riconosci subito. Il resto si capisce da quanto te ne allontani.",
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Stimare un angolo',
      back: "Confrontalo con verticale e orizzontale: è a metà (45°), più vicino all'una (30° o 60°)? Disegna, poi controlla.",
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: copia la stella di cinque raggi senza misurare, poi confronta con il modello.',
      minutes: 8,
      modelFig: 'osserva-stella',
      checklist: [
        'Ho tracciato verticale e orizzontale leggere dal centro',
        'Ho disegnato tutti i raggi senza righello né matita per misurare',
        'Dopo ho confrontato ogni raggio con il modello',
        'Ho segnato quale raggio è il più sbagliato',
      ],
      answer:
        "Di solito si sbaglia di più sulla lunghezza che sull'angolo. Rifai la stella: tieni il raggio più sbagliato come obiettivo.",
    },
    {
      id: 'p2',
      question:
        'Su carta: inventa una stella di sei raggi, poi copiala a mano libera su un altro foglio senza misurare, e confronta.',
      minutes: 10,
      checklist: [
        'Ho stimato gli angoli rispetto a verticale e orizzontale',
        'Ho confrontato dopo, non durante',
        'Il terzo tentativo è più preciso del primo',
      ],
      answer: 'Controlla solo se migliori: il terzo tentativo deve avere meno errori di angolo del primo.',
    },
  ],
}

export const osserva: CourseModule[] = [riempire, cieco, negativo, capovolto, misurare, angoli]
