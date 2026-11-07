import { card, mod, prac, q } from '../kit'
import { PRON_FULL, vsec } from './pron'

// Spanish vocabulary modules es-tempolibero and es-cultura (voc group).
// Pronunciation: the single convention of spagnolo.pron.ts (Spain, distinción th).

export const esTempoLibero = mod(
  'es-tempolibero',
  'Vocabolario: sport, hobby e tempo libero',
  'Sport e regole di jugar/hacer/practicar, attrezzatura, arrampicata e montagna, hobby, cinema, musica, uscite e giochi',
  'voc',
  `<p class="lead">Più di 100 parole per parlare di ciò che fai nel tempo libero: è uno degli argomenti più frequenti all'orale del DELE (¿Qué haces en tu tiempo libre?). Il punto delicato non è il nome dello sport ma il <b>verbo</b>: in spagnolo si <i>gioca</i> (jugar), si <i>fa</i> (hacer), si <i>pratica</i> (practicar) e si <i>suona</i> (tocar) in modo diverso dall'italiano. Impara i nomi <b>con l'articolo</b>.</p>
${PRON_FULL}
<h3>Quale verbo con quale sport</h3>
<ul><li><b>jugar a + articolo</b> per sport di squadra, con palla e giochi: <i>jugar al fútbol</i>, <i>jugar al tenis</i>, <i>jugar a las cartas</i>, <i>jugar al ajedrez</i>. Si dice <i>a + el = al</i>. In America si sente anche <i>jugar fútbol</i> senza a.</li><li><b>hacer</b> per attività individuali, fitness, discipline all'aperto: <i>hacer yoga</i>, <i>hacer natación</i>, <i>hacer senderismo</i>, <i>hacer escalada</i>, <i>hacer ciclismo</i>. Senza articolo.</li><li><b>practicar</b> è più formale e generico: <i>practicar deporte</i>, <i>practicar la natación</i>. Si usa anche per «praticare» una disciplina in modo regolare.</li><li><b>ir de + sostantivo</b> per uscite e attività ricreative: <i>ir de excursión</i>, <i>ir de camping</i>, <i>ir de compras</i>, <i>ir de tapas</i>. Per «andare a fare» un'attività si usa anche <i>ir a + infinito</i>: <i>ir a nadar</i>, <i>ir a escalar</i>.</li><li><b>tocar</b> per gli strumenti: <i>tocar la guitarra</i>, <i>tocar el piano</i>. Mai «jugar la guitarra». <i>Sonar</i> è «suonare» di un telefono o di un allarme.</li></ul>
<p><b>Jugar</b> è irregolare: u diventa ue in quasi tutte le persone. Tabella al presente:</p>
<div class="tblw"><table><tr><th>Persona</th><th>jugar</th></tr><tr><td>yo</td><td>juego</td></tr><tr><td>tú</td><td>juegas</td></tr><tr><td>él / ella</td><td>juega</td></tr><tr><td>nosotros</td><td>jugamos (no cambia)</td></tr><tr><td>vosotros</td><td>jugáis (no cambia)</td></tr><tr><td>ellos</td><td>juegan</td></tr></table></div>
<p>Al passato remoto della prima persona la g diventa gu: <i>jugué</i> (ho giocato) [hu-GHE].</p>
${vsec('Sport', [
  ['el deporte', 'de-POR-te', 'lo sport'],
  ['el fútbol', 'FUT-bol', 'il calcio'],
  ['el baloncesto', 'ba-lon-THES-to', 'la pallacanestro'],
  ['el voleibol', 'bo-lei-BOL', 'la pallavolo'],
  ['el tenis', 'TE-nis', 'il tennis'],
  ['el pádel', 'PA-dhel', 'il padel'],
  ['el ciclismo', 'thi-KLIS-mo', 'il ciclismo'],
  ['la natación', 'na-ta-THION', 'il nuoto'],
  ['el atletismo', 'at-le-TIS-mo', "l'atletica"],
  ['el esquí', 'es-KI', 'lo sci'],
  ['la gimnasia', 'him-NA-ssia', 'la ginnastica'],
  ['el yoga', 'YO-ga', 'lo yoga'],
  ['el campeonato', 'kam-pe-o-NA-to', 'il campionato'],
])}
${vsec('Squadra, partita e campo', [
  ['el equipo', 'e-KI-po', 'la squadra'],
  ['el partido', 'par-TI-dho', 'la partita (sport)'],
  ['el árbitro', 'AR-bi-tro', "l'arbitro"],
  ['el entrenador', 'en-tre-na-DHOR', "l'allenatore"],
  ['el estadio', 'es-TA-dhio', 'lo stadio'],
  ['el campo de fútbol', 'KAM-po de FUT-bol', 'il campo da calcio'],
  ['la pista de tenis', 'PIS-ta de TE-nis', 'il campo da tennis'],
  ['la piscina', 'pis-THI-na', 'la piscina'],
  ['el gimnasio', 'him-NA-ssio', 'la palestra'],
  ['el gol', 'GOL', 'il gol'],
  ['ganar / perder', 'ga-NAR / per-DHER', 'vincere / perdere'],
  ['empatar', 'em-pa-TAR', 'pareggiare'],
])}
${vsec('Attrezzatura', [
  ['el balón', 'ba-LON', 'il pallone'],
  ['la pelota', 'pe-LO-ta', 'la palla (tennis, generico)'],
  ['la raqueta', 'rra-KE-ta', 'la racchetta'],
  ['la red', 'RREDH', 'la rete'],
  ['la portería', 'por-te-RI-a', 'la porta (calcio)'],
  ['la canasta', 'ka-NAS-ta', 'il canestro'],
  ['el casco', 'KAS-ko', 'il casco'],
  ['las zapatillas', 'tha-pa-TI-yas', 'le scarpe da ginnastica'],
  ['la bicicleta', 'bi-thi-KLE-ta', 'la bicicletta'],
])}
${vsec('Arrampicata e montagna', [
  ['la escalada', 'es-ka-LA-dha', "l'arrampicata"],
  ['escalar', 'es-ka-LAR', 'arrampicare, scalare'],
  ['el rocódromo', 'rro-KO-dro-mo', 'la palestra di arrampicata'],
  ['la vía', 'BI-a', 'la via (di arrampicata)'],
  ['la presa', 'PRE-ssa', 'la presa, appiglio'],
  ['la cuerda', 'KUER-dha', 'la corda'],
  ['el arnés', 'ar-NES', "l'imbragatura"],
  ['el mosquetón', 'mos-ke-TON', 'il moschettone'],
  ['la magnesia / el magnesio', 'mag-NE-ssia / mag-NE-ssio', 'la magnesite (si dice anche «tiza»)'],
  ['los pies de gato', 'los PIES de GA-to', "le scarpette d'arrampicata"],
  ['asegurar', 'a-sse-gu-RAR', 'assicurare (fare sicura)'],
  ['la cordada', 'kor-DA-dha', 'la cordata'],
  ['el rápel', 'RRA-pel', 'la doppia (discesa in corda)'],
  ['el senderismo', 'sen-de-RIS-mo', "l'escursionismo"],
  ['el sendero', 'sen-DE-ro', 'il sentiero'],
  ['la ruta', 'RRU-ta', "l'itinerario"],
  ['el refugio', 'rre-FU-hio', 'il rifugio'],
  ['las botas de montaña', 'las BO-tas de mon-TA-gna', 'gli scarponi'],
  ['la mochila', 'mo-CI-la', 'lo zaino'],
  ['la tienda de campaña', 'la TIEN-da de kam-PA-gna', 'la tenda da campeggio'],
  ['el saco de dormir', 'el SA-ko de dor-MIR', 'il sacco a pelo'],
])}
${vsec('Hobby e attività creative', [
  ['el pasatiempo', 'pa-ssa-TIEM-po', 'il passatempo'],
  ['la afición', 'a-fi-THION', 'la passione, il hobby'],
  ['leer', 'le-ER', 'leggere'],
  ['dibujar', 'di-bu-HAR', 'disegnare'],
  ['pintar', 'pin-TAR', 'dipingere'],
  ['cocinar', 'ko-thi-NAR', 'cucinare'],
  ['bailar', 'bai-LAR', 'ballare'],
  ['cantar', 'kan-TAR', 'cantare'],
  ['tocar la guitarra', 'to-KAR la ghi-TA-rra', 'suonare la chitarra'],
  ['la fotografía', 'fo-to-gra-FI-a', 'la fotografia'],
  ['la jardinería', 'har-dhi-ne-RI-a', 'il giardinaggio'],
  ['coleccionar', 'ko-lek-thio-NAR', 'collezionare'],
  ['pescar', 'pes-KAR', 'pescare'],
  ['viajar', 'bia-HAR', 'viaggiare'],
  ['los videojuegos', 'los bi-dhe-o-HUE-gos', 'i videogiochi'],
])}
${vsec('Cinema, musica e teatro', [
  ['el cine', 'THI-ne', 'il cinema'],
  ['la película', 'pe-LI-ku-la', 'il film'],
  ['la cartelera', 'kar-te-LE-ra', 'la programmazione'],
  ['el estreno', 'es-TRE-no', 'la prima, uscita'],
  ['el actor / la actriz', 'ak-TOR / ak-TRITH', "l'attore / l'attrice"],
  ['el concierto', 'kon-THIER-to', 'il concerto'],
  ['la entrada', 'en-TRA-dha', 'il biglietto (concerto, cinema)'],
  ['la taquilla', 'ta-KI-ya', 'la biglietteria'],
  ['la canción', 'kan-THION', 'la canzone'],
  ['el cantante', 'kan-TAN-te', 'il cantante'],
  ['el grupo', 'GRU-po', 'il gruppo musicale'],
  ['el festival', 'fes-ti-BAL', 'il festival'],
  ['la obra de teatro', 'la O-bra de te-A-tro', 'la commedia, lo spettacolo teatrale'],
  ['el escenario', 'es-the-NA-rio', 'il palcoscenico'],
])}
${vsec('Uscire e stare con gli amici', [
  ['salir', 'sa-LIR', 'uscire'],
  ['quedar con amigos', 'ke-DHAR kon a-MI-gos', 'darsi appuntamento con gli amici'],
  ['ir de tapas', 'ir de TA-pas', 'andare a mangiare tapas'],
  ['tomar algo', 'to-MAR AL-go', 'bere qualcosa (aperitivo)'],
  ['la terraza', 'te-RRA-tha', 'il dehors, la terrazza'],
  ['la discoteca', 'dis-ko-TE-ka', 'la discoteca'],
  ['la fiesta', 'FIES-ta', 'la festa'],
  ['dar un paseo', 'dar un pa-SSE-o', 'fare una passeggiata'],
  ['la sobremesa', 'so-bre-ME-ssa', 'il tempo a tavola dopo mangiato'],
  ['pasarlo bien', 'pa-SSAR-lo BIEN', 'divertirsi'],
])}
${vsec('Giochi da tavolo e di carte', [
  ['el juego de mesa', 'el HUE-go de ME-ssa', 'il gioco da tavolo'],
  ['el ajedrez', 'el a-he-DRETH', 'gli scacchi'],
  ['las damas', 'las DA-mas', 'la dama'],
  ['las cartas', 'las KAR-tas', 'le carte'],
  ['la baraja', 'la ba-RA-ha', 'il mazzo di carte'],
  ['el dado', 'el DA-dho', 'il dado'],
  ['el tablero', 'el ta-BLE-ro', 'la scacchiera, il tabellone'],
  ['la ficha', 'la FI-cia', 'la pedina, la fiche'],
  ['el rompecabezas', 'el rrom-pe-ka-BE-thas', 'il puzzle, il rompicapo'],
  ['la partida', 'la par-TI-dha', 'la partita (a scacchi, a carte)'],
  ['barajar / repartir', 'ba-ra-HAR / rre-par-TIR', 'mescolare / dare le carte'],
])}
<h3>Parlare dei propri gusti</h3>
<ul><li><i>Me encanta / me gusta + infinito</i>: <i>Me encanta escalar.</i> [me en-KAN-ta es-ka-LAR]</li><li><i>Soy aficionado/a a la fotografía</i>: sono appassionato di fotografia.</li><li><i>Se me da bien / mal</i>: sono bravo / non sono bravo (<i>Se me da bien nadar, pero se me da mal bailar</i>).</li><li><i>En mi tiempo libre suelo + infinito</i>: nel tempo libero di solito... (<i>suelo salir con amigos</i>).</li><li><i>Me lo pasé genial</i>: mi sono divertito molto.</li></ul>
<h3>Esempi</h3>
<div class="say"><b>Esempi.</b> «Los sábados juego al pádel y los domingos hago senderismo.» [los SA-ba-dhos HUE-go al PA-dhel i los do-MIN-gos A-go sen-de-RIS-mo] · «Voy al rocódromo dos veces por semana.» [BOI al rro-KO-dro-mo dos BE-thes por se-MA-na] · «Toco la guitarra, pero no se me da muy bien.» [TO-ko la ghi-TA-rra PE-ro no se me da mui BIEN]</div>
<h3>Trappole per italiani</h3>
<ul><li><b>Partido</b> è la partita di uno sport (<i>un partido de fútbol</i>); <b>partida</b> è una singola mano o partita a scacchi, carte, videogiochi (<i>una partida de ajedrez</i>).</li><li><b>Gimnasia</b> è la ginnastica (disciplina), <b>gimnasio</b> è il luogo, la palestra: <i>voy al gimnasio</i>.</li><li><b>Entrada</b> è il biglietto per concerti, cinema, musei; il <b>billete</b> è il biglietto di treno, aereo o autobus (in America si dice anche <i>boleto</i>).</li><li><b>Tienda de campaña</b> è la tenda da campeggio; <b>campaña</b> è anche la campagna elettorale o pubblicitaria. Non confondere con <b>campo</b> (campagna, campo sportivo). Per il campo da tennis e da padel in Spagna si dice <i>pista</i> (in America spesso <i>cancha</i>).</li><li><b>Dibujar</b> è disegnare; <b>diseñar</b> è progettare (design). <b>Película</b> è il film, <b>cine</b> è il cinema.</li><li><b>Aficionado</b> non è «affezionato»: vuol dire appassionato. «Affezionato a qualcuno» si dice <i>encariñado con</i> o <i>tener cariño a</i>. <b>La afición</b> sono anche i tifosi di una squadra.</li><li><b>Presa</b> in arrampicata è l'appiglio; <i>la presa</i> significa anche «diga» e «preda» in altri contesti.</li><li><b>Pelota</b> e <b>balón</b>: il balón è il pallone grande (calcio, basket, pallavolo), la pelota è più piccola (tennis, pallamano) o generica.</li></ul>
<h3>Mini dialogo</h3>
<p><i>—¿Qué haces los fines de semana? —Los sábados juego al pádel y los domingos hago senderismo. A veces voy al rocódromo. —¿Y tocas algún instrumento? —Toco la guitarra, pero no se me da muy bien. —¿Quedamos el sábado para jugar una partida de ajedrez? —Vale, pero primero vamos de tapas.</i> (Cosa fai nei weekend? Il sabato gioco a padel e la domenica faccio escursionismo. A volte vado in palestra di arrampicata. E suoni qualche strumento? Suono la chitarra ma non mi riesce molto bene. Ci vediamo sabato per una partita a scacchi? Va bene, ma prima andiamo a mangiare tapas.)</p>
<div class="say"><b>Da ricordare:</b> jugar <b>a</b> (al fútbol, a las cartas), hacer (yoga, senderismo, escalada), tocar (un instrumento), ir de (excursión, tapas, compras).</div>`,
  [
    q(
      'q1',
      'Quale frase è corretta per «gioco a tennis»?',
      ['Juego al tenis.', 'Juego tenis.', 'Juego a tenis.', 'Juego en el tenis.'],
      0,
      'Con jugar serve la preposizione a più articolo, e a + el si contrae in al. Juego tenis senza preposizione si sente in America ma non è la forma standard della Spagna.',
    ),
    q(
      'q2',
      'Come si dice «suono la chitarra»?',
      ['Toco la guitarra.', 'Juego la guitarra.', 'Suena la guitarra.', 'Practico la guitarra.'],
      0,
      'Gli strumenti si suonano con tocar. Sonar vuol dire emettere un suono (suena el teléfono), mentre jugar si usa solo per giochi e sport.',
    ),
    q(
      'q3',
      'Completa: «Los domingos ___ senderismo con mis amigos».',
      ['hacemos', 'jugamos', 'tocamos', 'salimos'],
      0,
      "Le attività all'aperto individuali si costruiscono con hacer: hacer senderismo. Jugar è per giochi e sport di palla, tocar per gli strumenti.",
    ),
    q(
      'q4',
      'Qual è la forma giusta di «noi giochiamo a basket»?',
      ['Jugamos al baloncesto.', 'Juegamos al baloncesto.', 'Juguamos al baloncesto.', 'Jugomos al baloncesto.'],
      0,
      'Nel presente di jugar la u diventa ue solo nelle persone con accento sul tema (juego, juegas, juega, juegan). Nosotros e vosotros restano regolari: jugamos.',
    ),
    q(
      'q5',
      'Completa: «Ayer jugamos una ___ de ajedrez».',
      ['partida', 'partido', 'parte', 'partición'],
      0,
      'Per una singola partita a scacchi, carte o videogiochi si usa partida. Partido è la partita di sport come calcio o tennis, quindi non va qui.',
    ),
    q(
      'q6',
      'Come si dice «il biglietto del concerto»?',
      ['la entrada', 'la salida', 'la tarjeta', 'la taquilla'],
      0,
      'Il biglietto per concerti, teatro e cinema è la entrada. La taquilla è la biglietteria, cioè lo sportello dove si comprano le entradas.',
    ),
    q(
      'q7',
      "Che cos'è una «tienda de campaña»?",
      ['una tenda da campeggio', 'un negozio di campagna', 'una campagna elettorale', 'un negozio sportivo'],
      0,
      'Tienda ha due sensi, negozio e tenda; con de campaña indica la tenda da campeggio. La campagna elettorale è campaña, ma non si dice tienda.',
    ),
    q(
      'q8',
      'Completa: «Voy al ___ tres veces por semana para entrenar».',
      ['gimnasio', 'gimnasia', 'gimnástico', 'gimnasta'],
      0,
      'Gimnasio è il luogo, la palestra. Gimnasia è la disciplina ginnastica e gimnasta è la persona che la pratica, quindi dopo al non vanno bene.',
    ),
    q(
      'q9',
      "Che cosa significa «la presa» nel linguaggio dell'arrampicata?",
      ["l'appiglio", 'il moschettone', 'la magnesite', "l'imbragatura"],
      0,
      "La presa è il punto dove si mettono mani e piedi sulla parete. Il moschettone si dice mosquetón, la magnesite magnesia e l'imbragatura arnés.",
    ),
    q(
      'q10',
      'Quale parola significa «disegnare»?',
      ['dibujar', 'diseñar', 'desear', 'dibujo'],
      0,
      'Dibujar è disegnare con la matita. Diseñar è progettare un oggetto o un abito (design), quindi tradurlo con disegnare è un falso amico.',
    ),
    q(
      'q11',
      'Completa: «Jugamos ___ cartas después de comer».',
      ['a las', 'las', 'con las', 'en las'],
      0,
      "Jugar vuole sempre la preposizione a prima del gioco, qui con l'articolo plurale: a las cartas. Con las indica lo strumento e non il gioco.",
    ),
    q(
      'q12',
      'Che cosa significa «Me lo pasé genial»?',
      ['Mi sono divertito moltissimo.', 'Ho passato la palla bene.', 'Mi è passato il tempo.', 'Ho passato un esame.'],
      0,
      'Pasarlo bien o genial vuol dire divertirsi. Il verbo pasar qui non indica passare un oggetto né lo scorrere del tempo.',
    ),
    q(
      'q13',
      'Che cosa significa «Se me da bien nadar»?',
      ['Sono bravo a nuotare.', 'Mi piace nuotare.', 'Mi hanno dato da nuotare.', 'Nuoto ogni giorno.'],
      0,
      'La costruzione se me da bien indica una capacità naturale, essere portato per qualcosa. Non dice che ti piace né quanto spesso lo fai.',
    ),
  ],
  [
    card(
      'c1',
      'jugar al / hacer / practicar',
      'Jugar al fútbol (sport di palla, giochi); hacer yoga, senderismo (attività individuali); practicar deporte (generico).',
    ),
    card(
      'c2',
      'tocar la guitarra',
      'Suonare uno strumento si dice tocar, mai jugar. Sonar = emettere un suono (suena el móvil).',
    ),
    card('c3', 'jugar: juego, jugamos', 'u diventa ue tranne in nosotros e vosotros. Passato: jugué (g diventa gu).'),
    card('c4', 'el partido / la partida', 'Partita di sport / singola partita di scacchi, carte, videogiochi.'),
    card('c5', 'el gimnasio / la gimnasia', 'La palestra (luogo) / la ginnastica (disciplina).'),
    card('c6', 'la entrada / el billete', 'Biglietto di concerto, cinema / biglietto di treno, aereo, autobus.'),
    card('c7', 'la tienda de campaña', 'La tenda da campeggio. La campaña è la campagna elettorale o pubblicitaria.'),
    card('c8', 'dibujar / diseñar', 'Disegnare a mano / progettare (design).'),
    card(
      'c9',
      'el rocódromo, la vía, la presa',
      'Palestra di arrampicata, via, appiglio: il lessico base di chi scala.',
    ),
    card('c10', 'asegurar / la cordada', 'Fare sicura / la cordata. Il compagno di corda: el compañero de cordada.'),
    card('c11', 'ir de tapas / tomar algo', 'Andare a mangiare tapas / bere qualcosa: due rituali sociali tipici.'),
    card('c12', 'se me da bien', 'Sono bravo, sono portato per. Contrario: se me da mal.'),
    card('c13', 'aficionado a', 'Appassionato di (non «affezionato»). La afición = passione, o anche i tifosi.'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Gioco a calcio il martedì», «Faccio yoga la mattina», «Suono il piano da cinque anni».',
      'Juego al fútbol los martes. / Hago yoga por la mañana. / Toco el piano desde hace cinco años.',
    ),
    prac(
      'p2',
      'Correggi: «Juego la guitarra», «Hacemos al baloncesto», «Voy a la gimnasia tres veces por semana».',
      'Toco la guitarra. / Jugamos al baloncesto. / Voy al gimnasio tres veces por semana (gimnasia è la disciplina, gimnasio la palestra).',
    ),
    prac(
      'p3',
      'Completa con jugar (presente): «Yo ___ al tenis, tú ___ al pádel, nosotros ___ al fútbol, ellos ___ a las cartas».',
      'juego, juegas, jugamos, juegan. Nosotros non cambia la u.',
    ),
    prac(
      'p4',
      'Traduci: «Ci vediamo sabato per una partita a scacchi», «Hai già comprato i biglietti del concerto?»',
      'Quedamos el sábado para una partida de ajedrez. / ¿Ya has comprado las entradas del concierto?',
    ),
    prac(
      'p5',
      'Descrivi in tre frasi che cosa fai nel tempo libero, usando almeno un verbo con jugar, uno con hacer e uno con tocar o ir de.',
      'Ejemplo: En mi tiempo libre juego al pádel con mis amigos. Los domingos hago senderismo en la montaña. A veces voy de tapas con mi familia.',
    ),
    prac(
      'p6',
      'Traduci: «Vado in palestra di arrampicata due volte alla settimana», «Mi sono divertito molto, ma non sono bravo a ballare».',
      'Voy al rocódromo dos veces por semana. / Lo pasé muy bien, pero no se me da bien bailar.',
    ),
    prac(
      'p7',
      'Scrivi quattro righe: invita un amico a fare una gita in montagna sabato, indicando ora, luogo e che cosa portare.',
      'Ejemplo: ¿Vamos de excursión el sábado? Salimos a las ocho de la mañana desde la estación. Hay que llevar botas de montaña, una mochila con agua y algo de comer.',
    ),
  ],
)

export const esCultura = mod(
  'es-cultura',
  'Civiltà e feste del mondo ispanico',
  'Feste e tradizioni di Spagna e America Latina, pasti e orari, regioni e lingue, personaggi e luoghi, come parlarne al DELE',
  'voc',
  `<p class="lead">All'esame DELE (soprattutto B1 e B2) non basta la grammatica: si chiede di <b>parlare di una festa o di una tradizione</b> e di confrontarla con quella del tuo paese. Qui trovi fatti sicuri, vocabolario con pronuncia, i connettori per organizzare il discorso e un monologo modello. I fatti di calendario sono ridotti a quelli noti e verificabili.</p>
${PRON_FULL}
<h3>Tradizioni di Spagna in un colpo d'occhio</h3>
<ul><li><b>Semana Santa</b>: la settimana prima di Pasqua, con processioni in cui le cofradías portano i <i>pasos</i> (statue religiose) per strada. I <i>nazarenos</i> portano un cappuccio a cono. È molto celebre quella di Siviglia. Dolce tipico: la <i>torrija</i>.</li><li><b>Navidad</b>: il 24 dicembre è la <i>Nochebuena</i> (cena in famiglia), il 25 è Navidad. Il 22 dicembre c'è l'estrazione della lotteria di Natale, detta <i>el Gordo</i>. Il 28 dicembre si fanno scherzi, le <i>inocentadas</i>, nel Día de los Santos Inocentes.</li><li><b>Reyes Magos</b>: i regali dei bambini arrivano la notte tra il 5 e il 6 gennaio, portati da Melchor, Gaspar e Baltasar. La sera del 5 c'è la <i>cabalgata</i> (sfilata). Si mangia il <i>roscón de Reyes</i>. È l'equivalente spagnolo della Befana: tradizionalmente i regali arrivano qui, anche se oggi in molte famiglie ci sono regali anche a Natale.</li><li><b>Nochevieja</b>: il 31 dicembre si mangiano <i>doce uvas</i>, una a ogni rintocco (<i>campanada</i>) di mezzanotte; in tv si segue l'orologio della Puerta del Sol di Madrid.</li><li><b>San Fermín</b>: Pamplona, dal 6 al 14 luglio. Si apre con il <i>chupinazo</i> (razzo) il 6 a mezzogiorno; ogni mattina alle 8 c'è l'<i>encierro</i>, la corsa dei tori per le vie. Si veste di bianco con fazzoletto rosso.</li><li><b>Las Fallas</b>: Valencia, a marzo. Statue di cartapesta (<i>fallas</i>, <i>ninots</i>) bruciate nella <i>cremà</i> la notte di San José (19 marzo). Ogni giorno c'è la <i>mascletà</i>, fuochi rumorosi nel pomeriggio.</li><li><b>La Tomatina</b>: a Buñol, vicino a Valencia, l'ultimo mercoledì di agosto: battaglia di pomodori.</li><li><b>Feria de Abril</b>: Siviglia, in primavera dopo la Semana Santa. Casetas, abito da flamenca, sevillanas, bevande come il <i>rebujito</i>.</li><li><b>12 de octubre</b>: Fiesta Nacional de España, detta anche Día de la Hispanidad. Ricorda l'arrivo di Colombo in America nel 1492. Il 6 dicembre è il Día de la Constitución (Costituzione del 1978). Il 1 novembre (Todos los Santos) e il 15 agosto (Asunción) sono festivi.</li></ul>
${vsec('Feste e tradizioni', [
  ['la tradición', 'tra-dhi-THION', 'la tradizione'],
  ['la costumbre', 'kos-TUM-bre', "l'usanza, l'abitudine"],
  ['el día festivo', 'el DI-a fes-TI-bo', 'il giorno festivo'],
  ['el puente', 'el PUEN-te', 'il ponte (giorni liberi tra festivi)'],
  ['la procesión', 'la pro-the-SION', 'la processione'],
  ['la cofradía', 'la ko-fra-DHI-a', 'la confraternita'],
  ['el paso', 'el PA-sso', 'la statua portata in processione'],
  ['el nazareno', 'el na-tha-RE-no', 'il penitente incappucciato'],
  ['la Semana Santa', 'la se-MA-na SAN-ta', 'la Settimana Santa'],
  ['la torrija', 'la to-RRI-ha', 'dolce pasquale (pane fritto)'],
  ['la Nochebuena', 'la no-ce-BUE-na', 'la vigilia di Natale'],
  ['el villancico', 'el bi-yan-THI-ko', 'il canto di Natale'],
  ['el belén', 'el be-LEN', 'il presepe'],
  ['el turrón', 'el tu-RRON', 'il torrone'],
  ['los Reyes Magos', 'los RRE-yes MA-gos', 'i Re Magi'],
  ['la cabalgata', 'la ka-bal-GA-ta', 'la sfilata'],
  ['el roscón de Reyes', 'el rros-KON de RRE-yes', "il dolce a ciambella dell'Epifania"],
  ['las campanadas', 'las kam-pa-NA-dhas', 'i rintocchi'],
  ['las uvas', 'las U-bas', "l'uva, gli acini"],
  ['la Nochevieja', 'la no-ce-BIE-ha', "l'ultima notte dell'anno"],
  ['los fuegos artificiales', 'los FUE-gos ar-ti-fi-THIA-les', "i fuochi d'artificio"],
  ['el desfile', 'el des-FI-le', 'la sfilata, la parata'],
  ['el encierro', 'el en-THIE-rro', 'la corsa dei tori'],
  ['la verbena', 'la ber-BE-na', 'la festa popolare serale'],
  ['la romería', 'la rro-me-RI-a', 'la festa con pellegrinaggio'],
  ['la feria', 'la FE-ria', 'la fiera, la festa popolare'],
  ['la caseta', 'la ka-SSE-ta', 'il padiglione della feria'],
  ['las sevillanas', 'las se-bi-YA-nas', 'danza tipica di Siviglia'],
  ['el himno', 'el IM-no', "l'inno"],
  ['la bandera', 'la ban-DE-ra', 'la bandiera'],
])}
${vsec('America Latina e Carnevale', [
  ['el Día de Muertos', 'el DI-a de MUER-tos', 'il Giorno dei Morti (Messico)'],
  ['la ofrenda', 'la o-FREN-da', "l'altare con le offerte"],
  ['la calavera', 'la ka-la-BE-ra', 'il teschio'],
  ['el pan de muerto', 'el pan de MUER-to', 'pane dolce per i defunti'],
  ['el cempasúchil', 'el them-pa-SSU-cil', 'il fiore tagete (Messico; lì si dice «sem-»)'],
  ['la Catrina', 'la ka-TRI-na', 'lo scheletro elegante simbolo dei Muertos'],
  ['el Carnaval', 'el kar-na-BAL', 'il Carnevale'],
  ['la chirigota', 'la ci-ri-GO-ta', 'gruppo satirico del Carnevale di Cadice'],
  ['el disfraz', 'el dis-FRATH', 'il costume di Carnevale'],
  ['la máscara', 'la MAS-ka-ra', 'la maschera'],
  ['la Cuaresma', 'la kua-RES-ma', 'la Quaresima'],
  ['el Miércoles de Ceniza', 'el MIER-ko-les de the-NI-tha', 'il Mercoledì delle Ceneri'],
  ['la independencia', 'la in-de-pen-DEN-thia', "l'indipendenza"],
])}
${vsec('Pasti, orari, vita quotidiana', [
  ['el desayuno', 'el de-sa-YU-no', 'la colazione'],
  ['el almuerzo', 'el al-MUER-tho', 'spuntino di metà mattina o pranzo (Spagna, varia); pranzo (America)'],
  ['la comida', 'la ko-MI-dha', 'il pranzo (Spagna); anche il cibo'],
  ['la merienda', 'la me-RIEN-da', 'la merenda'],
  ['la cena', 'la THE-na', 'la cena'],
  ['la sobremesa', 'la so-bre-ME-ssa', 'il tempo a tavola dopo mangiato'],
  ['la siesta', 'la SIES-ta', 'il pisolino pomeridiano'],
  ['el horario', 'el o-RA-rio', "l'orario"],
  ['el menú del día', 'el me-NU del DI-a', 'il menù fisso a pranzo'],
  ['la tapa', 'la TA-pa', "lo stuzzichino, l'assaggio al bar"],
])}
${vsec('Regioni, lingue, patrimonio', [
  ['la comunidad autónoma', 'la ko-mu-ni-DADH au-TO-no-ma', 'la comunità autonoma (regione)'],
  ['la lengua cooficial', 'la LEN-gua ko-o-fi-THIAL', 'la lingua co-ufficiale'],
  ['el castellano', 'el kas-te-YA-no', 'lo spagnolo (castigliano)'],
  ['el catalán', 'el ka-ta-LAN', 'il catalano'],
  ['el gallego', 'el ga-YE-go', 'il galiziano'],
  ['el euskera', 'el eus-KE-ra', 'il basco'],
  ['el valenciano', 'el ba-len-THIA-no', 'il valenciano'],
  ['el pueblo', 'el PUE-blo', 'il paese; il popolo'],
  ['la ciudad', 'la thiu-DADH', 'la città'],
  ['el patrimonio de la humanidad', 'el pa-tri-MO-nio de la u-ma-ni-DADH', "il patrimonio dell'umanità"],
  ['el premio Nobel', 'el PRE-mio NO-bel', 'il premio Nobel'],
  ['la catedral', 'la ka-te-DRAL', 'la cattedrale'],
  ['el castillo', 'el kas-TI-yo', 'il castello'],
  ['el museo', 'el mu-SSE-o', 'il museo'],
])}
<h3>Feste in America Latina</h3>
<ul><li><b>Día de Muertos</b>: Messico, 1 e 2 novembre (il 1 si ricordano i bambini, il 2 gli adulti). Si costruiscono <i>ofrendas</i> con foto, cibo, candele e fiori di <i>cempasúchil</i> (<i>flor de cempasúchil</i>); si mangia <i>pan de muerto</i>. Non è un Halloween messicano: è un momento di memoria festoso. La <i>Catrina</i> è l'immagine dello scheletro elegante. Confronto: in Italia 1 novembre Ognissanti e 2 novembre Commemorazione dei defunti, con visita ai cimiteri.</li><li><b>Carnaval</b>: in Spagna è molto famoso quello di Cadice (con le <i>chirigotas</i>) e di Santa Cruz de Tenerife; in America quelli di Barranquilla (Colombia) e di Oruro (Bolivia). Inizia prima della Cuaresma e finisce il Martes de Carnaval; poi viene il Miércoles de Ceniza.</li><li><b>Inti Raymi</b>: festa inca del Sole, a Cusco (Perù), il 24 giugno. Oggi è una rievocazione teatrale.</li><li><b>Independencia de México</b>: 16 settembre (il <i>Grito de Dolores</i>). Non confonderlo con il <i>Cinco de Mayo</i> (5 maggio), che ricorda la battaglia di Puebla del 1862 ed è più celebrato negli Stati Uniti.</li></ul>
<h3>Pasti e orari</h3>
<p>In Spagna si mangia più tardi che in Italia: <i>desayuno</i> leggero al mattino (caffè e tostada), a volte un <i>almuerzo</i> o <i>tentempié</i> verso le 11, <i>comida</i> tra le 14 e le 15:30, <i>merienda</i> verso le 17-18, <i>cena</i> tra le 21 e le 22. Il <i>menú del día</i> è un pranzo a prezzo fisso nei giorni feriali. La <i>sobremesa</i>, chiacchierare a tavola dopo mangiato, è molto importante. La <b>siesta</b> non è universale: molti negozi nelle grandi città restano aperti tutto il giorno, mentre nei paesi più piccoli alcuni chiudono nelle ore centrali. Attenzione: <i>almuerzo</i> in America Latina è il pranzo; in Cile la <i>once</i> è il tè del pomeriggio.</p>
<h3>Regioni e lingue</h3>
<p>La Spagna ha <b>17 comunidades autónomas</b> più le due città autonome di Ceuta e Melilla. Il <b>castellano</b> è lingua ufficiale in tutto lo Stato. In alcune comunità sono <b>cooficiales</b> altre lingue: il <i>catalán</i> (Cataluña, Islas Baleares, e il <i>valenciano</i> nella Comunidad Valenciana), il <i>gallego</i> (Galicia), l'<i>euskera</i> (País Vasco e parte della Navarra), l'<i>aranés</i> (Valle de Arán, in Cataluña). Lo spagnolo è lingua ufficiale in 18 paesi dell'America (venti nel mondo, con Spagna e Guinea Equatoriale), e accanto a lui sono ufficiali alcune lingue indigene (per esempio il guaraní in Paraguay, il quechua e l'aimara in vari paesi andini).</p>
<h3>Personaggi e luoghi</h3>
<ul><li><b>Miguel de Cervantes</b>: <i>Don Quijote de la Mancha</i> (prima parte 1605, seconda parte 1615).</li><li><b>Gabriel García Márquez</b> (Colombia): <i>Cien años de soledad</i>, Nobel 1982. <b>Pablo Neruda</b> (Cile): Nobel 1971.</li><li><b>Arte</b>: Velázquez (<i>Las meninas</i>), Goya, Picasso (<i>Guernica</i>), Dalí, Frida Kahlo (Messico), Gaudí (la Sagrada Família a Barcellona).</li><li><b>Luoghi</b>: l'Alhambra (Granada), il Camino de Santiago verso Santiago de Compostela (Galicia), Machu Picchu (Perù), Chichén Itzá (Messico), le isole Galápagos (Ecuador), le cascate dell'Iguazú (Argentina e Brasile).</li></ul>
<h3>Come parlare di una tradizione all'orale</h3>
<p>Struttura utile: 1) presenta la festa (che cos'è, dove, quando); 2) racconta che cosa si fa; 3) dì che cosa ti piace o no; 4) confrontala con una festa del tuo paese. Connettori e formule:</p>
<ul><li>Presentare: <i>Una fiesta muy conocida es...</i>; <i>Se celebra en...</i>; <i>Tiene lugar el...</i></li><li>Abitudini: <i>La gente suele...</i>; <i>Se suele comer...</i>; <i>Es típico + infinito</i>.</li><li>Ordine: <i>En primer lugar</i>, <i>después</i>, <i>por último</i>.</li><li>Opinione: <i>Lo que más me gusta es...</i>; <i>Personalmente, creo que...</i></li><li>Confronto: <i>igual que en Italia</i>, <i>al igual que</i>, <i>a diferencia de</i>, <i>mientras que</i>, <i>en cambio</i>, <i>sin embargo</i>.</li></ul>
<div class="say"><b>Monologo modello (B1).</b> «Una fiesta muy conocida en España es la Nochevieja. Se celebra el 31 de diciembre y la gente suele cenar en familia. A medianoche, mientras suenan las campanadas, se comen doce uvas, una por cada campanada. Lo que más me gusta es la ilusión de empezar el año con amigos. A diferencia de Italia, donde se suelen comer lentejas, en España la tradición son las uvas. Sin embargo, en los dos países hay fuegos artificiales y brindis a medianoche.»<br>(Una festa molto nota in Spagna è Capodanno. Si celebra il 31 dicembre e la gente cena in famiglia. A mezzanotte, mentre suonano i rintocchi, si mangiano dodici acini d'uva, uno per rintocco. Quello che mi piace di più è l'entusiasmo di iniziare l'anno con gli amici. A differenza dell'Italia, dove si mangiano le lenticchie, in Spagna la tradizione sono le uvas. Però in entrambi i paesi ci sono fuochi d'artificio e brindisi a mezzanotte.)</div>
<h3>Confronti con l'Italia</h3>
<ul><li><b>Pasquetta</b>: il lunedì dopo Pasqua è festivo in Italia con gita fuori porta. In Spagna il <i>Lunes de Pascua</i> è festivo solo in alcune comunità.</li><li><b>Befana</b>: in Italia porta dolcetti e carbone la notte tra il 5 e il 6 gennaio. In Spagna i regali vengono dai <i>Reyes Magos</i> la stessa notte. Il dolce tipico è il roscón.</li><li><b>Capodanno</b>: in Italia lenticchie e botti. In Spagna uvas, campanadas e il brindisi con cava.</li><li><b>Ferragosto</b>: il 15 agosto in Spagna è la <i>Asunción</i>, giorno festivo in tutto il paese.</li></ul>
<h3>Trappole per italiani</h3>
<ul><li><b>Fiesta</b> è la festa (anche la festa di compleanno); <b>día festivo</b> è un giorno di vacanza. <b>Vacaciones</b> è sempre plurale.</li><li><b>Costumbre</b> è l'usanza, non il «costume». Il costume di Carnevale è <b>disfraz</b>, il costume tradizionale è <b>traje típico</b>.</li><li><b>Pascua</b> è Pasqua, ma <i>Felices Pascuas</i> si dice anche a Natale. Per il Natale si usa <b>Navidad</b> (singolare) e <i>Navidades</i> per il periodo.</li><li><b>Comida</b> in Spagna è anche il pranzo, non solo il cibo; <b>almuerzo</b> cambia significato tra Spagna e America.</li><li><b>Soler + infinito</b> esprime l'abitudine: <i>se suele comer turrón</i> (di solito si mangia), non «deve».</li><li><b>Los Reyes</b> sono i Re Magi, non «i re»: <i>los Reyes Magos de Oriente</i>.</li></ul>`,
  [
    q(
      'q1',
      "Quanti acini d'uva si mangiano a Capodanno in Spagna?",
      [
        'dodici, uno a ogni rintocco',
        'dodici, uno a ogni brindisi',
        'dieci, uno a ogni rintocco',
        'sette, uno a persona',
      ],
      0,
      'La tradizione richiede dodici uvas mangiate una per ogni campanada di mezzanotte. Non si legano al brindisi, e il numero non cambia da dodici.',
    ),
    q(
      'q2',
      'Quando i bambini spagnoli ricevono i regali dei Reyes Magos?',
      [
        'la notte tra il 5 e il 6 gennaio',
        'il 24 dicembre a mezzanotte',
        'il 25 dicembre al mattino',
        'il 1 gennaio al mattino',
      ],
      0,
      "I Reyes Magos portano i regali dall'Oriente la notte tra il 5 e il 6 gennaio, e i bambini li trovano il 6. Il 24 è la Nochebuena, cena di famiglia.",
    ),
    q(
      'q3',
      "Che cos'è l'«encierro» di San Fermín?",
      [
        'la corsa dei tori per le strade',
        'una processione religiosa',
        'una battaglia di pomodori',
        'un falò di statue',
      ],
      0,
      "L'encierro è la corsa dei tori per le vie di Pamplona. La battaglia di pomodori è la Tomatina e i falò di statue sono le Fallas.",
    ),
    q(
      'q4',
      'Dove si tiene la Tomatina?',
      ['a Buñol', 'a Pamplona', 'a Siviglia', 'a Cadice'],
      0,
      "La Tomatina si tiene a Buñol, vicino a Valencia, l'ultimo mercoledì di agosto. Pamplona è la città di San Fermín, Siviglia della Feria de Abril.",
    ),
    q(
      'q5',
      'Quale festa brucia grandi statue di cartapesta a marzo?',
      ['Las Fallas di Valencia', 'La Semana Santa di Siviglia', 'La Feria de Abril', 'San Fermín'],
      0,
      'Le Fallas culminano nella cremà, il rogo delle statue, la notte del 19 marzo. La Semana Santa è religiosa e a San Fermín ci sono i tori.',
    ),
    q(
      'q6',
      'Quale pasto si fa in Spagna di solito tra le 14 e le 15:30?',
      ['la comida', 'la cena', 'la merienda', 'el desayuno'],
      0,
      'La comida è il pasto principale, il nostro pranzo, e si fa nel primo pomeriggio. La cena è molto più tardi e la merienda è la merenda del pomeriggio.',
    ),
    q(
      'q7',
      'Quale NON è lingua cooficial in una comunità spagnola?',
      ['il portoghese', 'il galiziano', 'il basco', 'il catalano'],
      0,
      'Galiziano, basco e catalano sono cooficiales nelle rispettive comunità. Il portoghese è lingua di uno stato vicino e non è co-ufficiale in Spagna.',
    ),
    q(
      'q8',
      'Che cosa si festeggia il 12 ottobre in Spagna?',
      ['la Fiesta Nacional (Hispanidad)', 'la Costituzione', 'la Festa dei Re Magi', 'il Giorno dei Morti'],
      0,
      'Il 12 ottobre è la Fiesta Nacional de España, detta anche Día de la Hispanidad. La Costituzione si celebra il 6 dicembre, i Re Magi il 6 gennaio.',
    ),
    q(
      'q9',
      'In quale paese il Día de Muertos è celebre con ofrendas e calaveras?',
      ['Messico', 'Spagna', 'Argentina', 'Cile'],
      0,
      'Il Día de Muertos è la grande festa messicana del 1 e 2 novembre. Altri paesi ricordano i defunti in modo diverso, ma ofrendas con calaveras e la Catrina sono il simbolo del Messico.',
    ),
    q(
      'q10',
      "Quale data ricorda l'inizio dell'indipendenza del Messico?",
      ['16 settembre', '5 maggio', '12 ottobre', '1 novembre'],
      0,
      'Il 16 settembre ricorda il Grito de Dolores. Il 5 maggio è il Cinco de Mayo, la battaglia di Puebla del 1862, spesso scambiato per festa di indipendenza.',
    ),
    q(
      'q11',
      'Che cosa significa «costumbre»?',
      ['usanza, abitudine', 'costume da bagno', 'costume di Carnevale', 'abito tradizionale'],
      0,
      "Costumbre è l'abitudine o l'usanza di un popolo. Il costume di Carnevale si dice disfraz e l'abito tradizionale traje típico: è un falso amico.",
    ),
    q(
      'q12',
      'Che cosa significa «Se suele comer turrón en Navidad»?',
      [
        'Di solito si mangia torrone a Natale.',
        'Si deve mangiare torrone a Natale.',
        'Si può mangiare torrone a Natale.',
        'Si è mangiato torrone a Natale.',
      ],
      0,
      "Soler più infinito indica un'abitudine, di solito. Non esprime obbligo né possibilità, che si direbbero con hay que e se puede.",
    ),
    q(
      'q13',
      "Quale connettore usi per confrontare e dire «a differenza dell'Italia»?",
      ['a diferencia de Italia', 'al igual que Italia', 'por ejemplo Italia', 'además de Italia'],
      0,
      'A diferencia de introduce un contrasto con un altro paese. Al igual que esprime somiglianza, quindi significherebbe il contrario.',
    ),
    q(
      'q14',
      'Chi ha scritto «Cien años de soledad»?',
      ['Gabriel García Márquez', 'Jorge Luis Borges', 'Pablo Neruda', 'Miguel de Cervantes'],
      0,
      'Cien años de soledad è del colombiano García Márquez, Nobel 1982. Neruda è un poeta cileno e Cervantes ha scritto il Don Quijote.',
    ),
  ],
  [
    card(
      'c1',
      'las doce uvas',
      "Nochevieja: dodici acini d'uva, uno a ogni campanada di mezzanotte (Puerta del Sol in tv).",
    ),
    card(
      'c2',
      'los Reyes Magos',
      'Re Magi: regali la notte tra il 5 e il 6 gennaio, cabalgata la sera del 5, roscón de Reyes.',
    ),
    card('c3', 'San Fermín / el encierro', 'Pamplona, dal 6 al 14 luglio; ogni mattina alle 8 la corsa dei tori.'),
    card('c4', 'Las Fallas', 'Valencia, marzo: statue di cartapesta bruciate nella cremà (19 marzo).'),
    card('c5', 'La Tomatina', 'Buñol (Valencia), ultimo mercoledì di agosto: battaglia di pomodori.'),
    card('c6', 'la Semana Santa', 'Processioni con pasos e nazarenos; famosa a Siviglia; dolce: torrija.'),
    card('c7', 'el Día de Muertos', 'Messico, 1-2 novembre: ofrendas, calaveras, pan de muerto, cempasúchil.'),
    card('c8', 'el 12 de octubre', 'Fiesta Nacional de España / Día de la Hispanidad (arrivo di Colombo, 1492).'),
    card(
      'c9',
      'comida / cena / merienda',
      'Pranzo (14-15:30) / cena (21-22) / merenda (17-18). Sobremesa = chiacchiere a tavola.',
    ),
    card(
      'c10',
      'la lengua cooficial',
      'Catalán, gallego, euskera (e valenciano, aranés) sono co-ufficiali nelle loro comunità.',
    ),
    card(
      'c11',
      'costumbre / disfraz',
      'Usanza, abitudine / costume di Carnevale. Costume tradizionale = traje típico.',
    ),
    card('c12', 'soler + infinito', 'Di solito: se suele comer turrón; la gente suele cenar en familia.'),
    card('c13', 'a diferencia de / al igual que', 'Contrasto / somiglianza: connettori per confrontare due paesi.'),
    card(
      'c14',
      'Cervantes, García Márquez, Neruda',
      'Don Quijote (1605/1615); Cien años de soledad (Nobel 1982); Nobel 1971.',
    ),
  ],
  [
    prac(
      'p1',
      "Traduci: «A Capodanno in Spagna si mangiano dodici acini d'uva», «I regali arrivano la notte tra il 5 e il 6 gennaio».",
      'En Nochevieja en España se comen doce uvas. / Los regalos llegan la noche del 5 al 6 de enero.',
    ),
    prac(
      'p2',
      'Correggi: «Lo costumbre de España es cenar tarde», «Me puse un costume de Carnaval», «Nochebuena es el 25 de diciembre».',
      'La costumbre en España es cenar tarde (costumbre è femminile). / Me puse un disfraz de Carnaval. / Nochebuena es el 24 de diciembre; el 25 es Navidad.',
    ),
    prac(
      'p3',
      'Completa con un connettore: «En Italia comemos lentejas; ___ , en España se comen uvas».',
      'En cambio / sin embargo. (A diferencia de Italia va a inizio frase: «A diferencia de Italia, en España...».)',
    ),
    prac(
      'p4',
      'Rispondi in tre frasi: «Háblame de una fiesta de tu país y compárala con una de España».',
      'Ejemplo: En Italia el 6 de enero celebramos la Befana, que trae dulces a los niños. En España los niños reciben regalos de los Reyes Magos la misma noche. A diferencia de Italia, en España hay una cabalgata y se come el roscón de Reyes.',
    ),
    prac(
      'p5',
      "Descrivi in italiano un pasto tipico spagnolo nell'arco della giornata (orari e nomi).",
      'Desayuno ligero por la mañana; comida entre las 14:00 y las 15:30; merienda hacia las 17:00-18:00; cena entre las 21:00 y las 22:00.',
    ),
    prac(
      'p6',
      "Traduci: «Quest'anno la Tomatina è stata molto divertente», «In Messico il 2 novembre le famiglie portano fiori alle tombe».",
      'Este año la Tomatina ha sido muy divertida. / En México el 2 de noviembre las familias llevan flores a las tumbas.',
    ),
    prac(
      'p7',
      'Prepara un breve monologo (6 frasi) sul Natale o sul Capodanno nel tuo paese, usando soler, connettori di ordine e almeno un confronto con la Spagna.',
      'Ejemplo: En Italia la Navidad es una fiesta muy familiar. Solemos cenar el 24 y comer el 25 con toda la familia. En primer lugar hacemos el belén y el árbol. Después abrimos los regalos. Lo que más me gusta es la comida. A diferencia de España, donde los regalos llegan en Reyes, aquí se abren en Navidad.',
    ),
  ],
)
