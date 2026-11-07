import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT, vsec } from './pron'

export const deVarianti: CourseModule = mod(
  'de-varianti',
  'Varianti: Austria, Svizzera e dialetti',
  'Vocabolario AT / DE / CH (35 parole), Schweizerdeutsch e Schriftdeutsch, Helvetismen, dialetti principali, pronuncia austriaca e svizzera',
  'b2',
  `<p class="lead">Il tedesco è una lingua <b>pluricentrica</b>: Germania, Austria e Svizzera hanno ciascuna le proprie varianti standard (lessico, ortografia, pronuncia), e sotto lo standard vivono i <b>dialetti</b>. Per i test (Goethe, ÖSD) basta lo standard, ma in viaggio e al lavoro incontrerai tutte queste forme.</p>
${PRON_SHORT}
<h3>Tre standard, un solo sistema</h3>
<ul>
<li><b>Germania</b>: standard di riferimento (Bundesdeutsch). Euro.</li>
<li><b>Austria</b>: Österreichisches Deutsch, con termini propri soprattutto per cibo e amministrazione. Euro.</li>
<li><b>Svizzera</b>: nella scrittura si usa lo <b>Schriftdeutsch</b> (tedesco standard con Helvetismen); nella vita di tutti i giorni si parla il <b>Schweizerdeutsch</b>, un insieme di dialetti alemanni. Moneta: <i>Franken</i> e <i>Rappen</i> [RA-pën]. <b>Non si scrive la ß</b>: <i>Strasse</i>, <i>Gruss</i>. Anche il Liechtenstein non usa la ß.</li>
</ul>
<h3>Vocabolario a confronto (Germania – Austria – Svizzera)</h3>
<p>Dove non c'è differenza, la forma è ripetuta. Le pronunce sono nello stesso ordine.</p>
${vsec('Cibo e cucina', [
  ['Brötchen – Semmel – Weggli', 'BRÖT-çën – ZE-mël – VE-gli', 'panino'],
  ['Kartoffel – Erdapfel – Härdöpfel', 'kar-TO-fël – ERT-a-pfël – HER-döp-fël', 'patata'],
  ['Tomate – Paradeiser – Tomate', 'to-MA:-të – pa-ra-DAI-za – to-MA:-të', 'pomodoro'],
  ['Quark – Topfen – Quark', 'KVARK – TO-pfën – KVARK', 'quark (formaggio fresco)'],
  ['Sahne – Obers – Rahm', 'ZA:-në – O:-bas – RA:M', 'panna'],
  ['Aprikose – Marille – Aprikose', 'a-pri-KO:-zë – ma-RI-lë – a-pri-KO:-zë', 'albicocca'],
  ['Hähnchen – Hendl – Poulet', 'HEN-çën – HEN-dal – pu-LE', 'pollo'],
  ['Möhre – Karotte – Rüebli', 'MÖ:-rë – ka-RO-të – RÜ-ë-bli', 'carota'],
  ['Blumenkohl – Karfiol – Blumenkohl', 'BLU:-mën-ko:l – kar-fi-O:L – BLU:-mën-ko:l', 'cavolfiore'],
  ['Pfannkuchen – Palatschinken – Crêpe', 'PFAN-ku:-chën – pa-la-TSHIN-kën – KREP', 'frittata dolce, crêpe'],
  ['Hackfleisch – Faschiertes – Hackfleisch', 'HAK-flaish – fa-SHI:R-tës – HAK-flaish', 'carne macinata'],
  ['Meerrettich – Kren – Meerrettich', 'ME:R-re-tiç – KREN – ME:R-re-tiç', 'rafano'],
  ['Eis – Eis – Glace', 'AIS – AIS – GLA-ssë', 'gelato'],
  ['Frühstück – Frühstück – Morgenessen', 'FRÜ:-shtük – FRÜ:-shtük – MOR-gën-e-ssën', 'colazione'],
])}
${vsec('Vita quotidiana', [
  ['Fahrrad – Rad – Velo', 'FA:R-ra:t – RA:T – VE:-lo', 'bicicletta'],
  ['Bürgersteig – Gehsteig – Trottoir', 'BÜR-ga-shtaik – GE:-shtaik – tro-TUAR', 'marciapiede'],
  ['Fahrkarte – Fahrkarte – Billett', 'FA:R-kar-të – FA:R-kar-të – bil-JET', 'biglietto'],
  ['Tüte – Sackerl – Säckli', 'TÜ:-të – ZA-kal – ZEK-li', 'sacchetto'],
  ['Handy – Handy – Natel', 'HEN-di – HEN-di – NA:-tel', 'cellulare'],
  ['Januar – Jänner – Januar', 'JA-nu-ar – JE-na – JA-nu-ar', 'gennaio'],
  ['parken – parken – parkieren', 'PAR-kën – PAR-kën – par-KI:-rën', 'parcheggiare'],
  ['Treppe – Stiege – Treppe', 'TRE-pë – SHTI:-gë – TRE-pë', 'scala'],
  ['Stuhl – Sessel – Stuhl', 'SHTU:L – ZE-ssël – SHTU:L', 'sedia'],
  ['Krankenhaus – Spital – Spital', 'KRAN-kën-haus – shpi-TA:L – shpi-TA:L', 'ospedale'],
  ['Arztpraxis – Ordination – Praxis', 'ARTST-pra-ksis – or-di-na-TSIO:N – PRA-ksis', 'studio medico'],
  ['Metzger – Fleischhauer – Metzger', 'MET-tsga – FLAISH-hau-a – MET-tsga', 'macellaio'],
  ['Abitur – Matura – Matura', 'a-bi-TU:R – ma-TU:-ra – ma-TU:-ra', 'maturità'],
  ['Bahnsteig – Bahnsteig – Perron', 'BA:N-shtaik – BA:N-shtaik – pe-RON', 'binario (banchina)'],
  ['Hausmeister – Hausmeister – Abwart', 'HAUS-mai-sta – HAUS-mai-sta – AP-vart', 'portinaio, custode'],
  [
    'Schornsteinfeger – Rauchfangkehrer – Kaminfeger',
    'SHORN-shtain-fe:-ga – RAUCH-fang-ke:-ra – ka-MI:N-fe:-ga',
    'spazzacamino',
  ],
])}
${vsec('Saluti', [
  ['Hallo – Servus / Grüß Gott – Grüezi', 'HA-lo – ZER-vus / GRÜ:S GOT – GRÜ-ë-tsi', 'salve, buongiorno'],
  ['Tschüss – Servus – Tschau', 'TSHÜS – ZER-vus – TSHAU', 'ciao (congedo)'],
  ['Danke – Danke – Merci', 'DAN-kë – DAN-kë – mer-SI', 'grazie'],
])}
<p>Altre differenze: <b>das E-Mail</b> in Austria e Svizzera (<i>die E-Mail</i> in Germania). Nel Sud, in Austria e in Svizzera il Perfekt di <i>sitzen, stehen, liegen</i> usa <b>sein</b>: <i>Ich bin gestanden / gesessen</i> (standard: <i>habe gestanden</i>). A Vienna si ordina un <i>Melange</i> [me-LANSH] (caffè con latte schiumato) al caffè.</p>
<h3>Schweizerdeutsch o Hochdeutsch?</h3>
<p>In Svizzera c'è <b>diglossia</b>: dialetto nel parlato di ogni giorno, standard per scuola, giornali, telegiornale e lettere. Un esempio famoso, per la pronuncia: <i>Chuchichäschtli</i> [CHU-chi-CHESHT-li] (armadietto della cucina). Il diminutivo svizzero è <b>-li</b> (<i>Müsli</i>), quello austriaco e bavarese <b>-erl</b> (<i>Sackerl</i>), mentre quello standard è <b>-chen</b> (<i>Mädchen</i>). Con uno straniero molti svizzeri passano allo standard se glielo chiedi gentilmente.</p>
<h3>Dialetti principali</h3>
<ul>
<li><b>Bairisch</b> (Baviera, Austria): <i>Servus, Grüß Gott</i>; <b>Wienerisch</b> a Vienna.</li>
<li><b>Alemannisch</b> (Svizzera, Baden, Alsazia, Vorarlberg) e <b>Schwäbisch</b> (diminutivo -le: <i>Mädle</i>).</li>
<li><b>Sächsisch</b> (Sassonia), <b>Berlinerisch</b> (<i>ick, det, wat</i> invece di <i>ich, das, was</i>), <b>Kölsch / Rheinisch</b> (Colonia e Renania), <b>Hessisch</b>, <b>Fränkisch</b>.</li>
<li><b>Plattdeutsch</b> (Nord): <i>Moin</i> [MOIN] è il saluto del Nord a ogni ora del giorno.</li>
</ul>
<h3>Pronuncia: Austria e Svizzera</h3>
${vsec('Differenze di suono', [
  ['Sonne (DE) – Sonne (AT / CH)', 'ZO-në – SO-në', 'in Austria e Svizzera la s iniziale è sorda (come «sole»)'],
  ['König (DE) – König (AT)', 'KÖ:-niç – KÖ:-nik', '-ig finale: [iç] al Nord, [ik] al Sud e in Austria'],
  ['Chemie (DE) – Chemie (AT / Sud)', 'çe-MI: – ke-MI:', 'ch + e/i iniziale: [ç] al Nord, [k] al Sud'],
  ['China (DE) – China (AT / Sud)', 'ÇI:-na – KI:-na', 'come sopra'],
  ['Kaffee (DE) – Kaffee (AT)', 'KA-fe – ka-FE:', "accento sull'ultima sillaba in Austria"],
  ['ich (DE) – ich (CH)', 'iç – ich', 'in Svizzera il ch è sempre il suono raschiato di «Bach»'],
])}
<p>Austriaci e svizzeri pronunciano la <b>r</b> con la punta della lingua: la tua r italiana arrotata va benissimo là (e in Baviera); nel resto della Germania prevale la r gutturale.</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Velo</b> in Svizzera è la <b>bicicletta</b>, non il velo.</li>
<li><b>Ordination</b> in Austria è lo <b>studio medico</b> (non un'ordinazione).</li>
<li><b>Jänner</b> è gennaio, <b>Marille</b> un'albicocca, <b>Topfen</b> il quark: nei menu austriaci li vedrai spesso.</li>
<li>Se in Svizzera leggi <i>Grüezi</i>, <i>Merci</i>, <i>Billett</i>, <i>Perron</i>: sono saluti e parole francesizzate, non errori.</li>
<li>Agli esami (Goethe, ÖSD, telc) l'ascolto usa spesso accenti austriaci e svizzeri: allena l'orecchio con radio e TV (ORF, SRF).</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Grüezi / Grüß Gott / Moin</i>; <i>Velo = bicicletta</i> (CH), <i>Paradeiser = pomodoro</i> (AT), <i>Strasse</i> senza ß (CH), <i>Jänner</i> (AT). Standard in testa, dialetto nell'orecchio.</div>`,
  [
    q(
      'q1',
      'Come si dice «carota» in Svizzera?',
      ['Rüebli', 'Paradeiser', 'Marille', 'Erdapfel'],
      0,
      'Rüebli è la carota svizzera. Paradeiser (pomodoro), Marille (albicocca) e Erdapfel (patata) sono invece termini austriaci.',
    ),
    q(
      'q2',
      'Come si dice «pomodoro» in Austria?',
      ['Paradeiser', 'Rüebli', 'Topfen', 'Karfiol'],
      0,
      'In Austria si dice Paradeiser. Topfen è il quark, Karfiol il cavolfiore e Rüebli la carota svizzera.',
    ),
    q(
      'q3',
      'In Austria, «Jänner» è il mese di:',
      ['gennaio', 'giugno', 'luglio', 'ottobre'],
      0,
      'Jänner è la forma austriaca ufficiale per Januar. Nel tedesco di Germania e in Svizzera si usa Januar.',
    ),
    q(
      'q4',
      'In Svizzera «Velo» significa:',
      ['bicicletta', 'velo da sposa', 'vela di barca', 'marciapiede'],
      0,
      'Velo è la bicicletta (da vélocipède, via il francese). Il marciapiede svizzero è Trottoir, la vela si dice Segel.',
    ),
    q(
      'q5',
      'Quale lettera non si usa nella scrittura svizzera?',
      ['ß', 'ä', 'ü', 'ö'],
      0,
      'In Svizzera la ß è sostituita da ss: Strasse, Gruss. Le lettere con dieresi esistono invece normalmente.',
    ),
    q(
      'q6',
      '«Ich bin gestanden» (con sein) si sente soprattutto:',
      ['nel Sud, in Austria e in Svizzera', 'solo nel Nord', 'solo nei testi legali', 'solo tra i bambini'],
      0,
      'Con i verbi di posizione (stehen, sitzen, liegen) il Sud germanofono usa sein. Lo standard e il Nord dicono habe gestanden.',
    ),
    q(
      'q7',
      'Come pronuncia «Sonne» un austriaco?',
      ['[SO-në]', '[ZO-në]', '[SHO-në]', '[TSO-në]'],
      0,
      'In Austria e Svizzera la s iniziale davanti a vocale è sorda. In Germania si usa la s sonora [ZO-në].',
    ),
    q(
      'q8',
      "Quale pronuncia di «Chemie» è tipica del Sud e dell'Austria?",
      ['[ke-MI:]', '[çe-MI:]', '[she-MI:]', '[che-MI:]'],
      0,
      'Al Sud il ch iniziale di parole greche è un k. Il suono [ç] è tipico del Nord, sh è francese e ch (Bach) non si usa davanti a e.',
    ),
    q(
      'q9',
      'Che cosa significa «Grüezi»?',
      ['Salve (Svizzera)', 'Grazie (Austria)', 'Arrivederci', 'Buon appetito'],
      0,
      'Grüezi è il saluto svizzero di tutte le ore del giorno, contrazione di «Gott grüss Euch». Il ringraziamento svizzero è Merci.',
    ),
    q(
      'q10',
      'Quale parola austriaca indica il «quark»?',
      ['Topfen', 'Obers', 'Kren', 'Semmel'],
      0,
      'Topfen è il formaggio fresco austriaco. Obers è la panna, Kren il rafano e Semmel il panino.',
    ),
  ],
  [
    card(
      'c1',
      'Schriftdeutsch / Schweizerdeutsch',
      'Svizzera: standard per lo scritto, dialetti alemanni per il parlato.',
    ),
    card('c2', 'Strasse, Gruss', 'Svizzera e Liechtenstein: niente ß, sempre ss.'),
    card('c3', 'Velo [VE:-lo]', 'Bicicletta in Svizzera. Austria e Germania: Fahrrad.'),
    card(
      'c4',
      'Paradeiser [pa-ra-DAI-za]',
      'Pomodoro in Austria. Anche Erdapfel (patata), Marille (albicocca), Topfen (quark).',
    ),
    card('c5', 'Jänner [JE-na]', 'Gennaio in Austria.'),
    card('c6', 'Grüezi [GRÜ-ë-tsi]', 'Saluto svizzero. Austria: Servus / Grüß Gott. Nord: Moin.'),
    card('c7', 'Sonne [ZO-në] / [SO-në]', 'Germania: s sonora. Austria e Svizzera: s sorda.'),
    card('c8', 'Perfekt con sein', '<i>Ich bin gestanden / gesessen / gelegen</i> nel Sud, in Austria e in Svizzera.'),
    card('c9', 'Diminutivi', '-chen (standard), -li (CH), -erl (AT, Baviera), -le (Svevia).'),
  ],
  [
    prac(
      'p1',
      "Come ordini un pomodoro, una patata e un'albicocca in Austria?",
      '<i>Ein Paradeiser, ein Erdapfel und eine Marille.</i> Nota: nomi tipici austriaci per Tomate, Kartoffel, Aprikose.',
    ),
    prac(
      'p2',
      'Scrivi «Strada» come lo scriverebbe uno svizzero e spiega la differenza.',
      '<i>Strasse.</i> Nota: in Svizzera e Liechtenstein non si usa la ß, ma sempre ss.',
    ),
    prac(
      'p3',
      'Traduci in tedesco standard: «Mi sono seduto al caffè.» e nella forma meridionale.',
      'Standard: <i>Ich habe im Café gesessen.</i> Sud/AT/CH: <i>Ich bin im Café gesessen.</i> Nota: Perfekt con sein per i verbi di posizione.',
    ),
    prac(
      'p4',
      'Spiega la differenza tra Schriftdeutsch e Schweizerdeutsch.',
      "Schriftdeutsch è lo standard scritto, Schweizerdeutsch l'insieme dei dialetti alemanni parlati ogni giorno. Nota: diglossia, non due lingue ufficiali diverse.",
    ),
    prac(
      'p5',
      'Quale delle tre varianti dici a una cena a Zurigo per ringraziare? E a Vienna?',
      'Zurigo: <i>Merci!</i> (o Danke). Vienna: <i>Danke / Vielen Dank</i>. Nota: Merci è una parola svizzera di uso comune.',
    ),
  ],
)

export const deFalsiamici: CourseModule = mod(
  'de-falsiamici',
  'Falsi amici, interferenze e parole composte',
  '60+ parole e espressioni: Gift, Chef, bekommen, fast, bald…; errori tipici degli italiani; composti; cheat sheet',
  'b2',
  `<p class="lead">Molte parole tedesche <b>sembrano italiane</b> ma significano altro, e molte strutture italiane portano a errori. Qui trovi più di 60 voci tra falsi amici e interferenze, i composti spiegati e un cheat sheet degli errori più frequenti degli italiani.</p>
${PRON_SHORT}
${vsec('Falsi amici: nomi (1)', [
  ['das Gift', 'GIFT', 'veleno (regalo = Geschenk)'],
  ['der Mist', 'MIST', 'letame; sciocchezze (nebbia = Nebel)'],
  ['der Rat', 'RA:T', 'consiglio (topo = Ratte)'],
  ['der Chef', 'SHEF', 'capo (cuoco = Koch [KOCH])'],
  ['das Gymnasium', 'gim-NA:-zi-um', 'liceo (palestra = Turnhalle)'],
  ['der Brief', 'BRI:F', 'lettera (breve = kurz)'],
  ['der Rock', 'ROK', 'gonna (musica rock = Rockmusik)'],
  ['das Bad', 'BA:T', 'bagno (la stanza = Badezimmer)'],
  ['die Mode', 'MO:-dë', 'moda (modo = Art, Weise)'],
  ['die Art', 'A:RT', 'tipo, modo (arte = Kunst)'],
  ['das Handy', 'HEN-di', 'cellulare'],
  ['der Termin', 'ter-MI:N', 'appuntamento (termine = Frist, Ende)'],
  ['die Lust', 'LUST', 'voglia (lusso = Luxus)'],
  ['die Mappe', 'MA-pë', 'cartellina (mappa = Karte, Stadtplan)'],
  ['die Note', 'NO:-të', 'voto; nota musicale'],
])}
${vsec('Falsi amici: nomi (2)', [
  ['der Prospekt', 'pro-SPEKT', 'volantino (prospetto = Übersicht)'],
  ['die Sorte', 'ZOR-të', 'tipo, varietà (sorte = Schicksal, Glück)'],
  ['die Kost', 'KOST', 'vitto (costo = Kosten)'],
  ['die Pension', 'pen-ZIO:N', 'piccolo albergo (pensione INPS = Rente [REN-të])'],
  ['die Gemeinde', 'gë-MAIN-dë', 'comune'],
  ['das Regal', 're-GA:L', 'scaffale (regalo = Geschenk)'],
  ['der Konkurs', 'kon-KURS', 'fallimento (concorso = Wettbewerb)'],
  ['das Magazin', 'ma-ga-TSI:N', 'rivista (magazzino = Lager)'],
  ['der Salat', 'za-LA:T', 'insalata (salato = salzig)'],
  ['die Tasche', 'TA-shë', 'borsa, tasca (tazza = Tasse [TA-ssë])'],
  ['die Tablette', 'ta-BLE-të', 'compressa (tavoletta = Tafel)'],
  ['die Kommode', 'ko-MO:-dë', 'cassettiera (comodo = bequem)'],
  ['der Sekt', 'ZEKT', 'spumante (setta = Sekte)'],
  ['der See', 'ZE:', 'lago (mare = das Meer)'],
  ['die Lage', 'LA:-gë', 'situazione, posizione (lago = See)'],
])}
${vsec('Falsi amici: nomi (3)', [
  ['der Gang', 'GANG', 'corridoio, andatura, portata (gang = Bande)'],
  ['der Mut', 'MU:T', 'coraggio (muto = stumm)'],
  ['die Dose', 'DO:-zë', 'scatola, lattina (dose = Dosis)'],
  ['das Bein', 'BAIN', 'gamba (bene = gut)'],
  ['die Seite', 'ZAI-të', 'pagina, lato (sete = Durst)'],
  ['die Tinte', 'TIN-të', 'inchiostro (tinta = Farbe)'],
  ['die Station', 'shta-TSIO:N', 'fermata, reparto (stazione = Bahnhof)'],
  ['die Eltern', 'EL-tërn', 'genitori (parenti = Verwandte)'],
  ['die Praxis', 'PRA-ksis', 'studio medico; pratica'],
  ['die Kur', 'KU:R', 'cura termale'],
  ['das Mal', 'MA:L', 'volta (male = schlecht, Übel)'],
  ['das Mehl', 'ME:L', 'farina (miele = Honig)'],
  ['die Lehre', 'LE:-rë', 'apprendistato; dottrina (lezione = Unterricht)'],
  ['der Fall', 'FAL', 'caso; caduta (fallo = Fehler)'],
  ['das Zelt', 'TSELT', 'tenda (zelo = Eifer)'],
  ['der Zoll', 'TSOL', 'dogana; pollice (zolla = Scholle)'],
])}
${vsec('Falsi amici: verbi e aggettivi', [
  ['bekommen', 'bë-KO-mën', 'ricevere (diventare = werden)'],
  ['werden', 'VER-dën', 'diventare (volere = wollen)'],
  ['kosten', 'KO-stën', 'costare; assaggiare'],
  ['fast', 'FAST', 'quasi (veloce = schnell)'],
  ['bald', 'BALT', 'presto, tra poco (calvo = kahl)'],
  ['also', 'AL-zo', 'dunque (anche = auch)'],
  ['brav', 'BRA:F', 'bravo (educato) (abile = tüchtig)'],
  ['hell', 'HEL', 'chiaro (inferno = Hölle)'],
  ['aktuell', 'ak-tu-EL', 'attuale (attualmente = zurzeit)'],
  ['arm', 'ARM', 'povero (arma = Waffe)'],
  ['bar', 'BA:R', 'in contanti'],
  ['mögen', 'MÖ:-gën', 'amare, gradire (potere = können)'],
  ['passen', 'PA-ssën', 'andar bene (passare = vorbeigehen)'],
  ['sich bewerben um', 'ziç bë-VER-bën um', 'candidarsi per'],
  ['konsequent', 'kon-ze-KVENT', 'coerente, deciso'],
])}
<h3>Genere diverso dall'italiano</h3>
${vsec('Stessa cosa, genere diverso', [
  ['der Mond', 'MO:NT', 'la luna'],
  ['die Sonne', 'ZO-në', 'il sole'],
  ['die Milch', 'MILÇ', 'il latte'],
  ['die Butter', 'BU-ta', 'il burro'],
  ['die Blume', 'BLU:-më', 'il fiore'],
  ['die Brücke', 'BRÜ-kë', 'il ponte'],
  ['das Auto', 'AU-to', "l'auto (f.)"],
  ['das Fenster', 'FEN-sta', 'la finestra'],
  ['das Jahr', 'JA:R', "l'anno (m.)"],
  ['der Apfel', 'A-pfël', 'la mela'],
  ['das Mädchen', 'ME:T-çën', 'la ragazza'],
])}
<h3>Interferenze: strutture da evitare</h3>
${vsec("Dall'italiano al tedesco", [
  ['Ich bin 20 Jahre alt.', 'iç bin TSVAN-tsiç JA:-rë ALT', 'Ho 20 anni. (sein, non haben)'],
  [
    'Ich habe Hunger / Durst / Angst / Recht.',
    'iç HA:-bë HU-nga / DURST / ANGST / REÇT',
    'Ho fame / sete / paura / ragione. (qui haben)',
  ],
  ['Mir ist warm / kalt.', 'mi:r ist VARM / KALT', 'Ho caldo / freddo. (dativo)'],
  ['Es gibt drei Bücher.', 'es GIPT drai BÜ:-ça', 'Ci sono tre libri.'],
  ['Das gefällt mir. / Ich mag das.', 'das gë-FELT mi:r / iç MA:K das', 'Mi piace.'],
  ['Du fehlst mir.', 'du FE:LST mi:r', 'Mi manchi. (il soggetto è «tu»)'],
  ['Ich bin einverstanden.', 'iç bin AIN-fer-shtan-dën', "Sono d'accordo."],
  ['Man braucht zwei Stunden.', 'man BRAUCHT tsvai SHTUN-dën', 'Ci vogliono due ore.'],
  ['Was machst du beruflich?', 'vas MACHST du bë-RU:F-liç', 'Che lavoro fai?'],
  ['eine Frage stellen', 'AI-në FRA:-gë SHTE-lën', 'fare una domanda'],
  ['ein Foto machen', 'ain FO:-to MA-chën', 'fare una foto'],
  ['einen Kaffee trinken', 'AI-nën KA-fe TRIN-kën', 'prendere un caffè'],
  ['Ich habe mich geirrt.', 'iç HA:-bë miç gë-IRT', 'Mi sono sbagliato.'],
  ['Ich habe gewonnen / verloren.', 'iç HA:-bë gë-VO-nën / fer-LO:-rën', 'Ho vinto / perso.'],
])}
<h3>Parole composte</h3>
<p>Si leggono <b>da destra a sinistra</b>: l'ultima parte dà il significato e il <b>genere</b> (<i>der Schreibtisch</i> = <i>der Tisch</i>). Spesso c'è una lettera di unione (<b>Fugen-s</b>): <i>Arbeitszeit</i>, <i>Geburtstag</i>.</p>
${vsec('Composti frequenti', [
  ['der Handschuh', 'HANT-shu:', 'guanto («scarpa della mano»)'],
  ['der Flughafen', 'FLU:K-ha:-fën', 'aeroporto'],
  ['der Kühlschrank', 'KÜ:L-shrank', 'frigorifero'],
  ['der Staubsauger', 'SHTAUP-zau-ga', 'aspirapolvere'],
  ['das Wohnzimmer', 'VO:N-tsi-ma', 'soggiorno'],
  ['der Zahnarzt', 'TSA:N-artst', 'dentista'],
  ['der Fernseher', 'FERN-ze:-a', 'televisore'],
  ['der Schreibtisch', 'SHRAIP-tish', 'scrivania'],
  ['der Regenschirm', 'RE:-gën-shirm', 'ombrello'],
  ['der Geburtstag', 'gë-BURTS-ta:k', 'compleanno'],
  ['die Krankenversicherung', 'KRAN-kën-fer-ZI-çë-rung', 'assicurazione sanitaria'],
])}
<h3>Coppie minime di pronuncia e ortografia</h3>
${vsec('Attenzione a una lettera', [
  ['Wein – Wien', 'VAIN – VI:N', 'vino – Vienna'],
  ['Miete – Mitte', 'MI:-të – MI-të', 'affitto – centro'],
  ['Stadt – Staat', 'SHTAT – SHTA:T', 'città – stato'],
  ['Höhle – Hölle', 'HÖ:-lë – HÖ-lë', 'grotta – inferno'],
  ['schon – schön', 'SHO:N – SHÖ:N', 'già – bello'],
  ['bieten – bitten', 'BI:-tën – BI-tën', 'offrire – chiedere'],
])}
<h3>Cheat sheet: gli errori tipici degli italiani</h3>
<ul>
<li><b>Verbo:</b> seconda posizione nelle principali, in fondo nelle subordinate; separabile: <i>Ich stehe um 7 Uhr auf.</i></li>
<li><b>Maiuscola</b> a tutti i nomi: <i>die Stadt, das Wasser</i>.</li>
<li><b>ie / ei:</b> leggi <i>ei</i> = «ai» e <i>ie</i> = «i» lunga: <i>Wein</i> ≠ <i>Wien</i>.</li>
<li><b>z</b> = ts, <b>w</b> = v, <b>v</b> = f, <b>s</b> iniziale = z sonora: <i>Zeit, Wasser, Vater, Sonne</i>.</li>
<li><b>Articoli e genere</b>: impara sempre der / die / das con il nome.</li>
<li><b>Casi:</b> dopo <i>mit, von, bei, zu, aus, nach, seit</i> sempre dativo.</li>
<li><b>Preposizioni di luogo</b>: moto → accusativo (<i>in die Schule</i>), stato → dativo (<i>in der Schule</i>).</li>
<li><b>sein / haben:</b> <i>ich bin gegangen</i>, <i>ich bin 20</i>.</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Gift</i> = veleno, <i>Chef</i> = capo, <i>bekommen</i> = ricevere, <i>fast</i> = quasi, <i>bald</i> = presto, <i>also</i> = dunque, <i>Rat</i> = consiglio, <i>Eltern</i> = genitori.</div>`,
  [
    q(
      'q1',
      'Che cosa significa «das Gift»?',
      ['veleno', 'regalo', 'colla', 'guanto'],
      0,
      "Gift è il veleno in tedesco: il regalo si dice Geschenk. È uno dei falsi amici più pericolosi con l'inglese gift.",
    ),
    q(
      'q2',
      'Che cosa significa «Ich bekomme ein Buch»?',
      ['Ricevo un libro', 'Divento un libro', 'Compro un libro', 'Leggo un libro'],
      0,
      'Bekommen vuol dire ricevere. Diventare si dice werden, e comprare è kaufen: chi li confonde fa errori frequenti.',
    ),
    q(
      'q3',
      'Come si dice «cuoco» in tedesco?',
      ['Koch', 'Chef', 'Küche', 'Kuchen'],
      0,
      'Il cuoco è der Koch. Der Chef è il capo, die Küche la cucina e der Kuchen la torta.',
    ),
    q(
      'q4',
      'Come si dice «Ho 30 anni»?',
      ['Ich bin 30 Jahre alt.', 'Ich habe 30 Jahre.', 'Ich werde 30 Jahre.', 'Mir ist 30 Jahre.'],
      0,
      "In tedesco l'età si dice con sein: ich bin … Jahre alt. Il verbo haben, come in italiano, è un errore tipico.",
    ),
    q(
      'q5',
      'Come si dice «Ci sono tre libri sul tavolo»?',
      [
        'Auf dem Tisch liegen drei Bücher.',
        'Es ist drei Bücher auf dem Tisch.',
        'Da hat drei Bücher auf dem Tisch.',
        'Ich bin drei Bücher auf dem Tisch.',
      ],
      0,
      'Per le cose in posizione si usa il verbo di posizione liegen. Es gibt indica esistenza in generale, mentre es ist con un plurale è un errore di accordo.',
    ),
    q(
      'q6',
      'Che cosa significa «fast»?',
      ['quasi', 'veloce', 'digiuno', 'forte'],
      0,
      "Fast significa quasi: fast fertig = quasi finito. Veloce si dice schnell, un altro errore classico con l'inglese fast.",
    ),
    q(
      'q7',
      'Come si pronuncia «Wien» (la città)?',
      ['[VI:N]', '[VAIN]', '[WI:N]', '[VI-ën]'],
      0,
      'Ie si legge come i lunga e la w come la v. [VAIN] è la pronuncia di Wein, il vino.',
    ),
    q(
      'q8',
      'Come si pronuncia «schön» (bello)?',
      ['[SHÖ:N]', '[SHO:N]', '[SKÖN]', '[SHÖ-në]'],
      0,
      'Sch vale sh, ö è lunga (una e con le labbra a «o»). [SHO:N] è schon (già), senza dieresi.',
    ),
    q(
      'q9',
      'Che cosa significa «bald»?',
      ['presto, tra poco', 'calvo', 'tardi', 'spesso'],
      0,
      "Bald significa presto, tra poco. Calvo si dice kahl o glatzköpfig, ed è il tipico falso amico con l'inglese bald.",
    ),
    q(
      'q10',
      'Che cosa significa «die Eltern»?',
      ['i genitori', 'i parenti', 'gli anziani', 'i nonni'],
      0,
      'Eltern sono i genitori. I parenti in generale si dicono Verwandte, gli anziani ältere Menschen e i nonni Großeltern.',
    ),
  ],
  [
    card('c1', 'das Gift [GIFT]', 'veleno. Regalo = <i>das Geschenk</i>.'),
    card('c2', 'der Chef [SHEF]', 'capo. Cuoco = <i>der Koch</i>.'),
    card('c3', 'bekommen [bë-KO-mën]', 'ricevere. Diventare = <i>werden</i>.'),
    card('c4', 'fast [FAST] / bald [BALT]', 'quasi / presto. Veloce = <i>schnell</i>; calvo = <i>kahl</i>.'),
    card('c5', 'der Rat [RA:T]', 'consiglio. Topo = <i>die Ratte</i>.'),
    card('c6', 'die Eltern [EL-tërn]', 'genitori. Parenti = <i>die Verwandten</i>.'),
    card('c7', 'also [AL-zo]', 'dunque, quindi. Anche = <i>auch</i>.'),
    card('c8', 'Ich bin 20 Jahre alt', 'sein, non haben. Ma: <i>Ich habe Hunger / Durst / Angst</i>.'),
    card('c9', 'Wein – Wien [VAIN – VI:N]', 'vino – Vienna. Ei = «ai», ie = «i» lunga.'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Ho ricevuto un regalo da mia madre.»',
      '<i>Ich habe ein Geschenk von meiner Mutter bekommen.</i> Nota: bekommen = ricevere, Geschenk = regalo (non Gift).',
    ),
    prac(
      'p2',
      'Traduci: «Mi servono due ore.» (ci vogliono)',
      "<i>Ich brauche zwei Stunden. / Das dauert zwei Stunden.</i> Nota: non c'è un equivalente di «ci vuole».",
    ),
    prac('p3', 'Correggi: «Ich habe 25 Jahre.»', '<i>Ich bin 25 Jahre alt.</i> Nota: età con sein + alt.'),
    prac(
      'p4',
      'Traduci: «Il mio capo è un cuoco.»',
      '<i>Mein Chef ist Koch.</i> Nota: Chef = capo, Koch = cuoco; senza articolo davanti alla professione.',
    ),
    prac(
      'p5',
      'Spiega la differenza tra «Wein» e «Wien» e come si pronunciano.',
      '<i>Wein</i> [VAIN] = vino; <i>Wien</i> [VI:N] = Vienna. Nota: ei si legge «ai», ie «i» lunga.',
    ),
    prac(
      'p6',
      'Scomponi e traduci: «Handschuh», «Regenschirm».',
      "<i>Hand + Schuh</i> = guanto; <i>Regen + Schirm</i> = ombrello. Nota: il genere è quello dell'ultimo elemento (der Schuh, der Schirm).",
    ),
  ],
)
