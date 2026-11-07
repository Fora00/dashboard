import type { CourseModule } from '../../types'

// Modules of the 'finale' batch of the drawing course (order matters).
const naturaMorta: CourseModule = {
  id: 'natura-morta',
  title: 'Natura morta',
  subtitle: 'Tre oggetti dal vero in 20 minuti',
  vault: '',
  lesson: `<p class="lead">Finora hai disegnato forme e luce separate. Ora le metti insieme su un soggetto vero: <b>tre oggetti</b> sul tavolo. Niente di nuovo da imparare: devi solo usare nell'ordine giusto quello che sai già.</p>
<h3>Prepara la scena</h3>
<ul><li>Scegli <b>tre oggetti semplici</b> di dimensioni diverse: una tazza (cilindro), una mela o un'arancia (sfera), una scatola o un libro (scatola).</li>
<li>Mettili vicini, <b>sovrapposti un po'</b>: uno davanti all'altro, non in fila come soldatini.</li>
<li><b>Una sola luce</b>: una lampada o una finestra da un lato. Se la luce viene da due parti, le ombre si confondono. Sotto ogni oggetto c'è un'ombra portata dalla parte opposta alla luce.</li></ul>
<fig id="finale-natura">
<h3>L'ordine dei 20 minuti</h3>
<ol><li><b>Minuti 0-3, proporzioni.</b> Con linee leggere segna l'ingombro di tutto il gruppo, poi l'altezza e la larghezza di ogni oggetto. Confronta: la tazza è alta quanto una mela e mezza?</li>
<li><b>Minuti 3-10, forme.</b> Sostituisci ogni oggetto con la sua forma semplice: cilindro, sfera, scatola, con le ellissi viste attraverso. Controlla che le basi poggino sullo stesso piano.</li>
<li><b>Minuti 10-18, valori.</b> Ora, e solo ora, l'ombra. Prima le ombre portate e la parte scura di ogni oggetto, con un tratteggio unico; poi la mezzatinta.</li>
<li><b>Minuti 18-20, ritocchi.</b> Rinforza il contorno dove un oggetto sta davanti all'altro. Lascia il bianco della carta dove c'è la luce più forte.</li></ol>
<div class="say">Se ti accorgi alla fine che le proporzioni sono sbagliate, non è tempo perso: è il disegno che ti ha insegnato cosa guardare la prossima volta. Annota la data e il tempo sul foglio.</div>
<h3>Errori comuni</h3>
<ul><li>Iniziare dai dettagli (il manico della tazza) prima di avere le forme.</li>
<li>Ombre in direzioni diverse: scegli la luce prima e non cambiarla.</li>
<li>Sfumare tutto con lo stesso grigio: serve una zona chiara, una media e una scura.</li></ul>`,
  quiz: [
    {
      id: 'q1',
      q: 'Hai 20 minuti per una natura morta. Da dove cominci?',
      options: [
        'Dai dettagli del primo oggetto, poi passo al successivo',
        "Dall'ombra più scura, così si capisce subito",
        "Dall'ingombro e dalle proporzioni, poi le forme, poi i valori",
      ],
      answer: 2,
      explanation:
        'Prima il grande (proporzioni), poi le forme semplici, poi i valori. I dettagli, se resta tempo, per ultimi.',
      fig: 'finale-natura',
    },
    {
      id: 'q2',
      q: 'Perché usare una luce sola?',
      options: [
        'Perché così le ombre vanno tutte dalla stessa parte e i volumi si leggono',
        'Perché con due luci servono più matite',
        'Perché è obbligatorio in una natura morta',
      ],
      answer: 0,
      explanation:
        'Con più luci hai ombre in più direzioni e non sai più quale seguire. Una luce sola semplifica tutto.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Ordine di una natura morta',
      back: 'Proporzioni e ingombro, poi forme semplici, poi valori (luce unica), poi ritocchi.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question:
        'Su carta: natura morta con 3 oggetti veri, una luce, 20 minuti con il timer. Scrivi il tempo sul foglio.',
      minutes: 20,
      checklist: [
        'Si riconoscono 3 oggetti e le loro forme (cilindro, sfera, scatola)',
        'Le ombre portate vanno tutte dalla stessa parte',
        'Ci sono almeno tre valori: carta bianca, grigio medio, scuro',
        'Gli oggetti poggiano sullo stesso piano, non fluttuano',
      ],
      answer:
        'Confronta con lo schema: forme semplici, ombre a destra se la luce è a sinistra. Se i valori sono piatti, la prossima volta fai prima le ombre portate.',
      modelFig: 'finale-natura',
    },
    {
      id: 'p2',
      question: 'Su carta: stessa scena, stessa luce, ma solo 8 minuti. Salta i ritocchi.',
      minutes: 8,
      checklist: [
        'Ho cominciato con proporzioni e forme, non con i dettagli',
        "L'ombra è tratteggio unico, non sfumato con le dita",
        'Ho finito entro il tempo anche se non è perfetto',
      ],
      answer: 'Il tempo corto ti obbliga a guardare il grande. Spesso viene meglio del disegno lungo: confronta i due.',
    },
  ],
}

const gesti: CourseModule = {
  id: 'gesti',
  title: 'Disegno di gesto',
  subtitle: "Linea d'azione, manichino a blocchi, la mano",
  vault: '',
  lesson: `<p class="lead">Il disegno di gesto cattura <b>il movimento</b>, non i dettagli: lo fai veloce, con tutto il braccio, e quasi senza guardare il foglio. Serve a sciogliere la mano e a vedere la posa prima della forma.</p>
<h3>Tre tempi</h3>
<ul><li><b>30 secondi</b>: una linea sola, la linea d'azione, e poco altro.</li>
<li><b>1 minuto</b>: la linea più le masse (testa, torace, bacino).</li>
<li><b>2 minuti</b>: aggiungi braccia e gambe semplificate. Niente volti, niente dita.</li></ul>
<p>Fai 5-10 disegni per volta, da una foto, da un video in pausa o da una persona vera che si muove. Usa la matita lunga e muovi la spalla.</p>
<h3>La linea d'azione</h3>
<p>È la <b>curva lunga</b> che attraversa la posa dalla testa verso il piede d'appoggio. Si fa per prima, in un tratto solo. Se la posa è tesa la linea è quasi dritta, se è rilassata è una curva dolce, a C o a S. Tutto il resto si appende a quella linea.</p>
<h3>La figura come manichino a blocchi</h3>
<fig id="finale-manichino">
<p>Non devi sapere l'anatomia. Pensa a <b>tre blocchi</b>: una testa ovale, un torace a scatola, un bacino a scatola. Il torace e il bacino sono inclinati in modo diverso: è lì che nasce la posa. Braccia e gambe sono linee con una giuntura al gomito e al ginocchio.</p>
<h3>La mano in tre passi</h3>
<fig id="finale-mano">
<ol><li><b>Una scatola</b> per il palmo: un po' più larga che alta, leggermente inclinata.</li>
<li><b>Cinque cilindri</b>: quattro dita dal bordo alto, aperte a ventaglio, e il pollice di lato, che parte più in basso.</li>
<li><b>Le giunture</b>: spezza ogni dito in due pezzi, con una piega piccola. Le dita non sono mai tutte dritte e parallele.</li></ol>
<div class="say">Non disegnare le unghie e le rughe. Se la scatola e i cilindri sono giusti, la mano si legge già.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Cosa disegni per prima in un gesto da 30 secondi?',
      options: ['La testa con gli occhi e il naso', "La linea d'azione, in un tratto solo", 'Le dita della mano'],
      answer: 1,
      explanation:
        "La linea d'azione dà la posa. Il resto si appende a lei, ma nei 30 secondi spesso non c'è tempo per altro.",
    },
    {
      id: 'q2',
      q: 'Come parti per disegnare una mano?',
      options: [
        'Dalle unghie, poi le dita',
        'Da una scatola per il palmo, poi i cilindri per le dita',
        "Da un cerchio e poi l'ombra",
      ],
      answer: 1,
      explanation:
        'Scatola per il palmo, cilindri per le dita, e poi le giunture. Il pollice parte di lato, più in basso.',
      fig: 'finale-mano',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Gesto: i tre tempi',
      back: "30 s linea d'azione; 1 min più le masse; 2 min più arti semplici. Matita lunga, spalla, niente dettagli.",
    },
  ],
  practice: [
    {
      id: 'p1',
      question:
        'Su carta: 10 gesti da 30 secondi di una persona (foto o dal vero), poi 4 da 2 minuti con il manichino a blocchi.',
      minutes: 12,
      checklist: [
        "Ogni gesto parte da una linea d'azione fatta in un tratto",
        'Torace e bacino sono due blocchi con inclinazioni diverse',
        'Ho rispettato i tempi, senza finire i dettagli',
        'Non ho disegnato volti né dita',
      ],
      answer:
        'Confronta con il manichino: blocchi inclinati, linea lungo la schiena. I primi gesti sono rigidi: va bene, la fluidità viene con la quantità.',
      modelFig: 'finale-manichino',
    },
    {
      id: 'p2',
      question: 'Su carta: la tua mano in 3 passi (scatola, cilindri, giunture), 3 pose diverse, guardandola dal vero.',
      minutes: 15,
      checklist: [
        'Il palmo è una scatola con una faccia sopra e una di lato',
        'Ci sono 5 cilindri, con il pollice che parte di lato',
        'Le dita non sono tutte parallele',
        'Ogni dito ha una giuntura nel passo 3',
      ],
      answer:
        'Guarda lo schema nei tre passi. Se la mano sembra un guanto, hai disegnato i contorni: torna alla scatola.',
      modelFig: 'finale-mano',
    },
  ],
}

const composizione: CourseModule = {
  id: 'composizione',
  title: 'Composizione',
  subtitle: 'Terzi, tre piani, bozzetti in 3 valori',
  vault: '',
  lesson: `<p class="lead">La composizione è decidere <b>dove mettere le cose</b> nel foglio. Un disegno discreto ben composto vale più di uno bravo messo male. Si decide prima di disegnare, con bozzetti di un minuto.</p>
<h3>Regola dei terzi</h3>
<fig id="finale-terzi">
<p>Dividi il rettangolo in tre parti uguali, in altezza e in larghezza: ottieni quattro <b>punti forti</b>. Metti il soggetto su uno di questi, non al centro. L'orizzonte sta su una linea dei terzi, non a metà foglio: o c'è più cielo, o più terra, ma scegli.</p>
<h3>Tre piani</h3>
<fig id="finale-piani">
<p>Un foglio con profondità ha <b>primo piano, piano medio e sfondo</b>. Più è lontano, più è chiaro, piccolo e con meno dettagli. Il primo piano è scuro, grande e con contrasto. Il soggetto di solito sta nel piano medio.</p>
<h3>Bozzetto in 3 valori</h3>
<fig id="finale-thumb">
<p>Prima di disegnare, fai 3-4 <b>bozzetti da un minuto</b>, grandi come un francobollo. Usa solo tre valori: <b>chiaro</b> (carta), <b>medio</b>, <b>scuro</b>. Stessa scena, valori distribuiti in modi diversi: scegli il bozzetto che si legge meglio da lontano, strizzando gli occhi.</p>
<h3>Equilibrio e percorso dell'occhio</h3>
<ul><li>Un soggetto grande e scuro da un lato si bilancia con un'area piccola o chiara dall'altro.</li>
<li>L'occhio va al punto di <b>maggior contrasto</b> (più scuro accanto a più chiaro): mettilo sul soggetto.</li>
<li>Non lasciare che una linea o un bordo porti l'occhio fuori dal foglio. Non attaccare il soggetto al bordo.</li></ul>
<div class="say">Il bozzetto è gratis: ne fai quattro, ne scegli uno. Non cambiare idea a metà del disegno finale.</div>`,
  quiz: [
    {
      id: 'q1',
      q: 'Quale schizzo ha il soggetto meglio posizionato?',
      options: [
        'Orizzonte a metà e albero al centro',
        'Orizzonte e albero sui terzi',
        'Albero schiacciato contro il bordo',
      ],
      answer: 1,
      explanation:
        "L'albero sul punto forte e l'orizzonte su una linea dei terzi danno equilibrio. A metà tutto è fermo, sul bordo l'occhio esce.",
      optionFigs: ['finale-comp-a', 'finale-comp-b', 'finale-comp-c'],
    },
    {
      id: 'q2',
      q: 'Cosa fai prima del disegno finale?',
      options: [
        'Parto subito, correggo strada facendo',
        '3-4 bozzetti da un minuto in tre valori, poi scelgo',
        'Disegno i dettagli dello sfondo',
      ],
      answer: 1,
      explanation:
        'I bozzetti costano un minuto ciascuno e ti fanno vedere i problemi prima di perdere 30 minuti sul foglio vero.',
    },
  ],
  cards: [],
  practice: [
    {
      id: 'p1',
      question:
        'Su carta: 4 bozzetti da un minuto della stessa scena (anche una foto), ognuno in 3 valori. Poi disegna quello scelto.',
      minutes: 15,
      checklist: [
        'Ogni bozzetto è un rettangolo piccolo con solo chiaro, medio e scuro',
        'Il soggetto non è mai al centro esatto',
        "L'orizzonte è su un terzo, non a metà",
        'Ho scelto un bozzetto guardandoli a occhi socchiusi',
      ],
      answer:
        'Confronta con i tre bozzetti dello schema: stessa scena, valori diversi. Il migliore ha il contrasto più forte sul soggetto.',
      modelFig: 'finale-thumb',
    },
  ],
}

const revisione: CourseModule = {
  id: 'revisione',
  title: 'Revisione e piano',
  subtitle: 'Ridisegna il primo disegno e guarda i progressi',
  vault: '',
  lesson: `<p class="lead">Ora <b>ridisegna il primo disegno</b> del corso, quello fatto nel primo modulo, e mettilo accanto al nuovo. Non è un esame: è l'unico modo per vedere cosa è cambiato davvero.</p>
<h3>Guardare i progressi senza giudizio</h3>
<ul><li>Metti i due fogli affiancati, stessa soggetto, stesse condizioni.</li>
<li>Scrivi <b>tre fatti</b> osservabili: "le linee sono più decise", "le proporzioni sono più vicine". Non "è brutto" o "sono bravo".</li>
<li>Poi una cosa che <b>ancora non funziona</b>, descritta in modo preciso, senza insulti. Quella sarà il tuo esercizio della settimana.</li></ul>
<h3>Calibrare l'autovalutazione</h3>
<p>Subito dopo aver finito, un disegno sembra o bellissimo o orribile. <b>Dopo una settimana</b> lo vedi con occhi nuovi. Rivedi i disegni vecchi e chiediti: quello che mi sembrava un errore grosso lo era? E quello che avevo dato per buono? Con il tempo il tuo giudizio si avvicina alla realtà. Segna sempre la data sul foglio.</p>
<h3>Il piano settimanale</h3>
<ul><li><b>Lun, mar, gio, ven</b>: 5 minuti di riscaldamento (linee, ellissi, gesti) e 10 minuti di esercizio.</li>
<li><b>Mer</b>: riposo oppure schizzi veloci dove capita.</li>
<li><b>Sab</b>: un disegno lungo, con il <b>tempo scritto sul foglio</b>.</li>
<li><b>Dom</b>: 5 minuti di revisione: scrivi <b>una cosa migliorata</b> e <b>una da correggere</b>.</li></ul>
<h3>Cosa studiare dopo</h3>
<ul><li><b>Drawabox</b>: gratuito, molto esercizio su linee, forme e scatole. Ottimo per la costruzione.</li>
<li><b>Proko</b>: video su figura, proporzioni e luce. Segui un tema alla volta.</li>
<li><b>Betty Edwards</b>, <i>Drawing on the Right Side of the Brain</i>: esercizi per imparare a guardare.</li></ul>
<p>Scegline <b>uno</b> e portalo avanti per un mese, invece di assaggiarli tutti.</p>`,
  quiz: [
    {
      id: 'q1',
      q: 'Come descrivi i progressi guardando due disegni?',
      options: [
        'Con un voto da 1 a 10 al nuovo disegno',
        'Con fatti osservabili, più una cosa precisa da correggere',
        'Rifacendo il vecchio finché non è perfetto',
      ],
      answer: 1,
      explanation:
        'I fatti ("linee più decise") sono utili, il giudizio no. Una sola cosa da correggere dà un obiettivo chiaro.',
    },
    {
      id: 'q2',
      q: 'Perché rivedere i disegni dopo una settimana?',
      options: [
        'Per correggerli con la gomma',
        'Perché il giudizio a caldo è sballato: la distanza lo calibra',
        'Per buttarli via',
      ],
      answer: 1,
      explanation: 'A caldo un disegno sembra o troppo bello o troppo brutto. Dopo qualche giorno lo vedi più giusto.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Settimana tipo',
      back: 'Lun/mar/gio/ven 5 min riscaldamento + 10 min esercizio; mer riposo o schizzi; sab disegno lungo con il tempo scritto; dom 5 min revisione (1 migliorata, 1 da correggere).',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Su carta: ridisegna il primo disegno del corso (stesso soggetto), con lo stesso tempo. Affiancali.',
      minutes: 20,
      checklist: [
        'Ho ritrovato il primo disegno e il soggetto è lo stesso',
        'Ho scritto tre differenze osservabili tra i due fogli',
        'Ho scritto una cosa precisa che ancora non funziona',
        'Ho segnato la data su entrambi',
      ],
      answer:
        'Non cercare il bel disegno: cerca le differenze. Se non ne trovi, rifallo con più calma e confronta le proporzioni.',
    },
    {
      id: 'p2',
      question: 'Su carta: scrivi il tuo piano settimanale (giorni, durata, cosa) e appendilo dove disegni.',
      minutes: 5,
      checklist: [
        'Ogni giorno ha una durata scritta',
        'Il sabato ha un disegno lungo con il tempo sul foglio',
        'La domenica ha 5 minuti di revisione',
        'Ho scelto un solo corso o libro da seguire dopo',
      ],
      answer:
        "Un piano da 15 minuti al giorno che rispetti vale più di uno da un'ora che salti. Parti piccolo e alza dopo un mese.",
    },
  ],
}

export const finale: CourseModule[] = [naturaMorta, gesti, composizione, revisione]
