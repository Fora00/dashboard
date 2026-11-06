import type { CourseModule } from '../types'
import { card, mod, prac, q } from './python-path.helpers'
import { PRON_FULL, PRON_SHORT, vsec } from './tedesco.pron'

export const deVocVita: CourseModule = mod(
  'de-voc-vita',
  'Vocabolario: vita quotidiana',
  'Casa, famiglia, corpo e salute, cibo e ristorante, vestiti, tempo, shopping (100 termini con articolo, plurale e pronuncia)',
  'voc',
  `<p class="lead">Parole per la vita di tutti i giorni, con <b>articolo</b> (der / die / das), <b>plurale</b> tra parentesi e <b>pronuncia</b> (singolare, poi plurale). Impara sempre il nome con il suo articolo: il genere non si indovina dall'italiano.</p>
${PRON_SHORT}
${PRON_FULL}
<h3>Indizi per il genere e il plurale</h3>
<ul>
<li><b>die</b>: -ung, -heit, -keit, -schaft, -ion, -tät, -ur, -ie (<i>die Wohnung, die Universität</i>).</li>
<li><b>der</b>: -er (persone e strumenti), -ling, -ismus, stagioni, giorni e mesi.</li>
<li><b>das</b>: -chen, -lein, -um, -ment e molti nomi presi dai verbi (<i>das Mädchen, das Essen</i>).</li>
<li><b>Plurale</b>: -e (<i>Tisch → Tische</i>), -¨e (<i>Stuhl → Stühle</i>), -er/-¨er (<i>Kind → Kinder</i>), -n/-en (<i>Küche → Küchen</i>), -s (<i>Sofa → Sofas</i>), invariato (<i>Zimmer</i>).</li>
</ul>
${vsec('Casa', [
  ['das Haus (die Häuser)', 'HAUS (HOI-za)', 'la casa'],
  ['die Wohnung (die Wohnungen)', 'VO:-nung (VO:-nun-gën)', "l'appartamento"],
  ['das Zimmer (die Zimmer)', 'TSI-ma (TSI-ma)', 'la stanza'],
  ['das Schlafzimmer (die Schlafzimmer)', 'SHLA:F-tsi-ma', 'la camera da letto'],
  ['das Wohnzimmer (die Wohnzimmer)', 'VO:N-tsi-ma', 'il soggiorno'],
  ['das Badezimmer (die Badezimmer)', 'BA:-dë-tsi-ma', 'il bagno'],
  ['die Küche (die Küchen)', 'KÜ-çë (KÜ-çën)', 'la cucina'],
  ['die Tür (die Türen)', 'TÜ:r (TÜ:-rën)', 'la porta'],
  ['das Fenster (die Fenster)', 'FEN-sta (FEN-sta)', 'la finestra'],
  ['die Treppe (die Treppen)', 'TRE-pë (TRE-pën)', 'la scala'],
  ['der Schlüssel (die Schlüssel)', 'SHLÜ-ssël', 'la chiave'],
  ['das Bett (die Betten)', 'BET (BE-tën)', 'il letto'],
  ['der Tisch (die Tische)', 'TISH (TI-shë)', 'il tavolo'],
  ['der Stuhl (die Stühle)', 'SHTU:L (SHTÜ:-lë)', 'la sedia'],
  ['der Schrank (die Schränke)', 'SHRANK (SHREN-kë)', "l'armadio"],
  ['das Sofa (die Sofas)', 'ZO:-fa (ZO:-fas)', 'il divano'],
  ['die Lampe (die Lampen)', 'LAM-pë (LAM-pën)', 'la lampada'],
])}
${vsec('Famiglia', [
  ['die Familie (die Familien)', 'fa-MI:-li-ë (fa-MI:-li-ën)', 'la famiglia'],
  ['die Eltern (nur Plural)', 'EL-tërn', 'i genitori'],
  ['die Mutter (die Mütter)', 'MU-ta (MÜ-ta)', 'la madre'],
  ['der Vater (die Väter)', 'FA:-ta (FE:-ta)', 'il padre'],
  ['der Bruder (die Brüder)', 'BRU:-da (BRÜ:-da)', 'il fratello'],
  ['die Schwester (die Schwestern)', 'SHVE-sta (SHVE-stërn)', 'la sorella'],
  ['der Sohn (die Söhne)', 'ZO:N (ZÖ:-në)', 'il figlio'],
  ['die Tochter (die Töchter)', 'TOCH-ta (TÖÇ-ta)', 'la figlia'],
  ['die Großmutter (die Großmütter)', 'GRO:S-mu-ta', 'la nonna'],
  ['der Großvater (die Großväter)', 'GRO:S-fa:-ta', 'il nonno'],
  ['der Onkel (die Onkel)', 'ON-kël', 'lo zio'],
  ['die Tante (die Tanten)', 'TAN-të (TAN-tën)', 'la zia'],
  ['das Kind (die Kinder)', 'KINT (KIN-da)', 'il bambino'],
  ['der Freund (die Freunde)', 'FROINT (FROIN-dë)', "l'amico, il fidanzato"],
])}
${vsec('Corpo e salute', [
  ['der Kopf (die Köpfe)', 'KOPF (KÖ-pfë)', 'la testa'],
  ['das Auge (die Augen)', 'AU-gë (AU-gën)', "l'occhio"],
  ['die Nase (die Nasen)', 'NA:-zë (NA:-zën)', 'il naso'],
  ['der Mund (die Münder)', 'MUNT (MÜN-da)', 'la bocca'],
  ['das Ohr (die Ohren)', 'O:r (O:-rën)', "l'orecchio"],
  ['der Hals (die Hälse)', 'HALS (HEL-zë)', 'il collo, la gola'],
  ['der Arm (die Arme)', 'ARM (AR-më)', 'il braccio'],
  ['die Hand (die Hände)', 'HANT (HEN-dë)', 'la mano'],
  ['der Finger (die Finger)', 'FI-nga', 'il dito'],
  ['das Bein (die Beine)', 'BAIN (BAI-në)', 'la gamba'],
  ['der Fuß (die Füße)', 'FU:SS (FÜ:-ssë)', 'il piede'],
  ['der Rücken (die Rücken)', 'RÜ-kën', 'la schiena'],
  ['der Bauch (die Bäuche)', 'BAUCH (BOI-çë)', 'la pancia'],
  ['das Herz (die Herzen)', 'HERTS (HER-tsën)', 'il cuore'],
  ['der Arzt (die Ärzte)', 'ARTST (ERTS-të)', 'il medico'],
  ['die Apotheke (die Apotheken)', 'a-po-TE:-kë (a-po-TE:-kën)', 'la farmacia'],
  ['die Schmerzen (nur Plural)', 'SHMER-tsën', 'il dolore, i dolori'],
  ['das Fieber (kein Plural)', 'FI:-ba', 'la febbre'],
  ['die Erkältung (die Erkältungen)', 'er-KEL-tung', 'il raffreddore'],
  ['das Medikament (die Medikamente)', 'me-di-ka-MENT (me-di-ka-MEN-të)', 'il farmaco'],
])}
${vsec('Cibo e ristorante', [
  ['das Brot (die Brote)', 'BRO:T (BRO:-të)', 'il pane'],
  ['die Butter (kein Plural)', 'BU-ta', 'il burro'],
  ['der Käse (die Käse)', 'KE:-zë', 'il formaggio'],
  ['das Fleisch (kein Plural)', 'FLAISH', 'la carne'],
  ['der Fisch (die Fische)', 'FISH (FI-shë)', 'il pesce'],
  ['das Gemüse (kein Plural)', 'gë-MÜ:-zë', 'la verdura'],
  ['das Obst (kein Plural)', 'O:PST', 'la frutta'],
  ['der Apfel (die Äpfel)', 'A-pfël (E-pfël)', 'la mela'],
  ['die Kartoffel (die Kartoffeln)', 'kar-TO-fël (kar-TO-fëln)', 'la patata'],
  ['der Reis (kein Plural)', 'RAIS', 'il riso'],
  ['die Nudeln (nur Plural)', 'NU:-dëln', 'la pasta'],
  ['das Ei (die Eier)', 'AI (AI-a)', "l'uovo"],
  ['die Milch (kein Plural)', 'MILÇ', 'il latte'],
  ['das Wasser (die Wasser)', 'VA-ssa', "l'acqua"],
  ['der Wein (die Weine)', 'VAIN (VAI-në)', 'il vino'],
  ['das Bier (die Biere)', 'BI:R (BI:-rë)', 'la birra'],
  ['die Speisekarte (die Speisekarten)', 'SHPAI-zë-kar-të', 'il menu'],
  ['die Rechnung (die Rechnungen)', 'REÇ-nung (REÇ-nun-gën)', 'il conto'],
  ['das Trinkgeld (kein Plural)', 'TRINK-gelt', 'la mancia'],
  ['die Gabel (die Gabeln)', 'GA:-bël (GA:-bëln)', 'la forchetta'],
  ['das Messer (die Messer)', 'ME-ssa', 'il coltello'],
  ['der Löffel (die Löffel)', 'LÖ-fël', 'il cucchiaio'],
  ['der Teller (die Teller)', 'TE-la', 'il piatto'],
  ['die Tasse (die Tassen)', 'TA-ssë (TA-ssën)', 'la tazza'],
])}
${vsec('Vestiti', [
  ['die Hose (die Hosen)', 'HO:-zë (HO:-zën)', 'i pantaloni'],
  ['das Hemd (die Hemden)', 'HEMT (HEM-dën)', 'la camicia'],
  ['der Pullover (die Pullover)', 'pu-LO:-va', 'il maglione'],
  ['die Jacke (die Jacken)', 'JA-kë (JA-kën)', 'la giacca'],
  ['der Mantel (die Mäntel)', 'MAN-tël (MEN-tël)', 'il cappotto'],
  ['das Kleid (die Kleider)', 'KLAIT (KLAI-da)', 'il vestito'],
  ['der Schuh (die Schuhe)', 'SHU: (SHU:-ë)', 'la scarpa'],
  ['die Socke (die Socken)', 'ZO-kë (ZO-kën)', 'il calzino'],
  ['die Mütze (die Mützen)', 'MÜ-tsë (MÜ-tsën)', 'il berretto'],
])}
${vsec('Tempo atmosferico', [
  ['das Wetter (kein Plural)', 'VE-ta', 'il tempo'],
  ['die Sonne (die Sonnen)', 'ZO-në', 'il sole'],
  ['der Regen (kein Plural)', 'RE:-gën', 'la pioggia'],
  ['der Schnee (kein Plural)', 'SHNE:', 'la neve'],
  ['der Wind (die Winde)', 'VINT (VIN-dë)', 'il vento'],
  ['die Wolke (die Wolken)', 'VOL-kë (VOL-kën)', 'la nuvola'],
  ['das Gewitter (die Gewitter)', 'gë-VI-ta', 'il temporale'],
  ['der Nebel (kein Plural)', 'NE:-bël', 'la nebbia'],
  ['die Temperatur (die Temperaturen)', 'tem-pe-ra-TU:R', 'la temperatura'],
  ['Es regnet. / Es schneit.', 'es RE:G-nët / es SHNAIT', 'Piove. / Nevica.'],
  ['heiß / kalt / windig', 'HAIS / KALT / VIN-diç', 'caldo / freddo / ventoso'],
])}
${vsec('Shopping', [
  ['das Geschäft (die Geschäfte)', 'gë-SHEFT (gë-SHEF-të)', 'il negozio'],
  ['der Supermarkt (die Supermärkte)', 'ZU:-pa-markt (ZU:-pa-merk-të)', 'il supermercato'],
  ['die Kasse (die Kassen)', 'KA-ssë (KA-ssën)', 'la cassa'],
  ['der Preis (die Preise)', 'PRAIS (PRAI-zë)', 'il prezzo'],
  ['das Angebot (die Angebote)', 'AN-gë-bo:t (AN-gë-bo:-të)', "l'offerta"],
  ['die Tüte (die Tüten)', 'TÜ:-të (TÜ:-tën)', 'il sacchetto'],
  ['das Geld (kein Plural)', 'GELT', 'il denaro'],
  ['die Kreditkarte (die Kreditkarten)', 'kre-DI:T-kar-të', 'la carta di credito'],
  ['die Größe (die Größen)', 'GRÖ:-ssë (GRÖ:-ssën)', 'la taglia, la misura'],
  ['billig / teuer', 'BI-liç / TOI-a', 'economico / caro'],
])}
<h3>Frasi utili</h3>
${vsec('Per usare le parole', [
  [
    'Wir wohnen in einer kleinen Wohnung.',
    'vi:r VO:-nën in AI-na KLAI-nën VO:-nung',
    'Abitiamo in un piccolo appartamento.',
  ],
  ['Ich habe Kopfschmerzen.', 'iç HA:-bë KOPF-shmer-tsën', 'Ho mal di testa.'],
  ['Was kostet das?', 'vas KO-stët das', 'Quanto costa?'],
  ['Die Speisekarte, bitte.', 'di: SHPAI-zë-kar-të, BI-të', 'Il menu, per favore.'],
  ['Können wir bitte zahlen?', 'KÖ-nën vi:r BI-të TSA:-lën', 'Possiamo pagare, per favore?'],
])}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Genere diverso</b>: <i>der Mond</i> (la luna), <i>die Sonne</i> (il sole), <i>die Milch</i> (il latte), <i>die Butter</i> (il burro), <i>das Mädchen</i> (la ragazza).</li>
<li><b>Tasche ≠ Tasse</b>: <i>die Tasche</i> [TA-shë] è la borsa, <i>die Tasse</i> [TA-ssë] la tazza.</li>
<li><b>Haus / Wohnung</b>: <i>das Haus</i> è l'edificio, <i>die Wohnung</i> l'appartamento.</li>
<li><b>Hose</b> è singolare («un paio di pantaloni»): <i>die Hose ist neu</i>.</li>
<li><b>Bad / Badezimmer / Toilette</b>: in casa il bagno è <i>das Bad(ezimmer)</i>, il WC <i>die Toilette</i>.</li>
</ul>
<div class="say"><b>Da ricordare.</b> Impara sempre <i>articolo + nome + plurale</i>: <i>das Kind, die Kinder</i>; <i>der Vater, die Väter</i>; <i>die Küche, die Küchen</i>.</div>`,
  [
    q(
      'q1',
      "Qual è l'articolo di «Mädchen» (ragazza)?",
      ['das', 'die', 'der', 'den'],
      0,
      "I nomi in -chen sono sempre neutri, anche se indicano una ragazza. Die sarebbe l'articolo italiano «la», un errore frequente.",
    ),
    q(
      'q2',
      'Qual è il plurale di «der Vater»?',
      ['die Väter', 'die Vater', 'die Vates', 'die Vätern'],
      0,
      "Vater forma il plurale con l'Umlaut e nessuna desinenza: Väter. Vätern sarebbe il dativo plurale.",
    ),
    q(
      'q3',
      'Qual è il plurale di «das Kind»?',
      ['die Kinder', 'die Kinde', 'die Kinds', 'die Kindern'],
      0,
      'I neutri monosillabici spesso prendono -er: Kinder. Kindern esiste solo come dativo plurale (mit den Kindern).',
    ),
    q(
      'q4',
      'Come si dice «il burro»?',
      ['die Butter', 'der Butter', 'das Butter', 'der Burro'],
      0,
      "Butter è femminile in tedesco standard, diversamente dall'italiano «il burro». Der Butter si sente solo in alcuni dialetti.",
    ),
    q(
      'q5',
      'Come si dice «Ho mal di testa»?',
      ['Ich habe Kopfschmerzen.', 'Ich bin Kopfschmerzen.', 'Mir habe Kopfschmerzen.', 'Ich habe Kopf Schmerz.'],
      0,
      'Kopfschmerzen è un composto plurale che vuole haben alla prima persona. Gli altri usano sein, il dativo sbagliato o separano il composto.',
    ),
    q(
      'q6',
      'Che cosa significa «die Rechnung»?',
      ['il conto', 'la ricevuta di ritorno', 'il calcolo', 'la ragione'],
      0,
      'Al ristorante die Rechnung è il conto da pagare; in altri contesti è anche il calcolo. Ricevuta si dice Quittung.',
    ),
    q(
      'q7',
      'Come si pronuncia «Küche»?',
      ['[KÜ-çë]', '[KU-chë]', '[KI-shë]', '[KÜ-kë]'],
      0,
      'Ü è una i detta con le labbra a «u» e ch dopo ü è il suono debole [ç]. Il suono di «Bach» non va usato dopo vocali anteriori.',
    ),
    q(
      'q8',
      'Come si pronuncia «Käse»?',
      ['[KE:-zë]', '[KA:-zë]', '[KE-së]', '[KE:S]'],
      0,
      "Ä lunga vale una e aperta e la s tra due vocali è sonora [z]. Con la a o la s sorda sarebbe un'altra parola.",
    ),
    q(
      'q9',
      'Come si dice «la tazza»?',
      ['die Tasse', 'die Tasche', 'die Tafel', 'der Teller'],
      0,
      'Tasse è la tazza, Tasche la borsa o tasca, Tafel la lavagna o tavoletta e Teller il piatto. La somiglianza con Tasche inganna.',
    ),
    q(
      'q10',
      'Qual è il plurale di «der Apfel»?',
      ['die Äpfel', 'die Apfeln', 'die Apfele', 'die Apfels'],
      0,
      "Apfel prende solo l'Umlaut: Äpfel (maschile in -el, nessuna desinenza). Apfeln è il dativo plurale con -n.",
    ),
  ],
  [
    card('c1', 'das Mädchen [ME:T-çën]', 'la ragazza. Neutro (-chen), plurale invariato: <i>die Mädchen</i>.'),
    card('c2', 'die Küche [KÜ-çë]', 'la cucina. Plurale: <i>die Küchen</i>.'),
    card('c3', 'der Vater [FA:-ta] / die Mutter [MU-ta]', 'padre / madre. Plurali con Umlaut: <i>Väter, Mütter</i>.'),
    card('c4', 'das Kind [KINT]', 'bambino. Plurale: <i>die Kinder</i> [KIN-da].'),
    card('c5', 'die Rechnung [REÇ-nung]', 'il conto (al ristorante). <i>Zahlen, bitte!</i>'),
    card('c6', 'die Tasche / die Tasse', 'borsa / tazza [TA-shë / TA-ssë].'),
    card('c7', 'der Arzt [ARTST]', 'il medico. Plurale <i>die Ärzte</i>; femminile <i>die Ärztin</i>.'),
    card('c8', 'Es regnet. [es RE:G-nët]', 'Piove. Nevica = <i>Es schneit</i>.'),
    card('c9', 'Kopfschmerzen [KOPF-shmer-tsën]', 'mal di testa: <i>Ich habe Kopfschmerzen.</i>'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Abito in un appartamento con due camere da letto.»',
      '<i>Ich wohne in einer Wohnung mit zwei Schlafzimmern.</i> Nota: mit + dativo plurale (Schlafzimmern).',
    ),
    prac(
      'p2',
      'Scrivi al plurale: das Kind, der Vater, die Küche, der Apfel.',
      '<i>die Kinder, die Väter, die Küchen, die Äpfel.</i> Nota: diversi tipi di plurale.',
    ),
    prac(
      'p3',
      'Ordina al ristorante: un menu, una birra e il conto.',
      '<i>Die Speisekarte, bitte. Ein Bier, bitte. Zahlen, bitte!</i> Nota: nei ristoranti tedeschi si chiede il conto al tavolo.',
    ),
    prac(
      'p4',
      'Traduci: «Fa freddo e piove.»',
      '<i>Es ist kalt und es regnet.</i> Nota: es come soggetto impersonale; kalt senza desinenza.',
    ),
    prac(
      'p5',
      'Dì al medico: «Ho la febbre e mal di gola.»',
      '<i>Ich habe Fieber und Halsschmerzen.</i> Nota: Fieber senza articolo, Halsschmerzen sempre plurale.',
    ),
  ],
)

export const deVocViaggi: CourseModule = mod(
  'de-voc-viaggi',
  'Vocabolario: viaggi e città',
  'Viaggi, trasporti (Deutsche Bahn), albergo, città, indicazioni, emergenze, banca e posta, divertimento (90 termini)',
  'voc',
  `<p class="lead">Il vocabolario del viaggiatore, con <b>articolo</b>, <b>plurale</b> e <b>pronuncia</b>. Per i treni la parola magica è <i>Verspätung</i> (ritardo): la Deutsche Bahn te la farà imparare in fretta.</p>
${PRON_SHORT}
${vsec('Viaggio e trasporti', [
  ['die Reise (die Reisen)', 'RAI-zë (RAI-zën)', 'il viaggio'],
  ['der Koffer (die Koffer)', 'KO-fa', 'la valigia'],
  ['der Reisepass (die Reisepässe)', 'RAI-zë-pas (RAI-zë-pe-ssë)', 'il passaporto'],
  ['die Fahrkarte (die Fahrkarten)', 'FA:R-kar-të (FA:R-kar-tën)', 'il biglietto'],
  ['der Bahnhof (die Bahnhöfe)', 'BA:N-ho:f (BA:N-hö:-fë)', 'la stazione'],
  ['der Zug (die Züge)', 'TSU:K (TSÜ:-gë)', 'il treno'],
  ['der Bus (die Busse)', 'BUS (BU-ssë)', "l'autobus"],
  ['die Straßenbahn (die Straßenbahnen)', 'SHTRA:-ssën-ba:n', 'il tram'],
  ['die U-Bahn (die U-Bahnen)', 'U:-ba:n', 'la metropolitana'],
  ['das Gleis (die Gleise)', 'GLAIS (GLAI-zë)', 'il binario'],
  ['die Verspätung (die Verspätungen)', 'fer-SHPE:-tung (fer-SHPE:-tun-gën)', 'il ritardo'],
  ['die Abfahrt (die Abfahrten)', 'AP-fa:rt (AP-fa:r-tën)', 'la partenza'],
  ['die Ankunft (die Ankünfte)', 'AN-kunft (AN-künf-të)', "l'arrivo"],
  ['umsteigen', 'UM-shtai-gën', 'cambiare (treno)'],
  ['der Flughafen (die Flughäfen)', 'FLU:K-ha:-fën (FLU:K-he:-fën)', "l'aeroporto"],
  ['das Flugzeug (die Flugzeuge)', 'FLU:K-tsoik (FLU:K-tsoi-gë)', "l'aereo"],
  ['der Stau (die Staus)', 'SHTAU (SHTAUS)', "l'ingorgo"],
  ['die Tankstelle (die Tankstellen)', 'TANK-shte-lë', 'il distributore'],
  ['die Regionalbahn (die Regionalbahnen)', 're-gio-NA:L-ba:n', 'il treno regionale'],
  ['der ICE (die ICE)', 'i-tse-E', 'treno ad alta velocità'],
])}
${vsec('Albergo', [
  ['das Hotel (die Hotels)', 'ho-TEL (ho-TELS)', "l'albergo"],
  ['das Einzelzimmer (die Einzelzimmer)', 'AIN-tsël-tsi-ma', 'la camera singola'],
  ['das Doppelzimmer (die Doppelzimmer)', 'DO-pël-tsi-ma', 'la camera doppia'],
  ['die Reservierung (die Reservierungen)', 're-zer-VI:-rung', 'la prenotazione'],
  ['die Rezeption (die Rezeptionen)', 're-tsep-TSIO:N', 'la reception'],
  ['die Übernachtung (die Übernachtungen)', 'Ü:-ba-NACH-tung', 'il pernottamento'],
  ['das Frühstück (kein Plural)', 'FRÜ:-shtük', 'la colazione'],
  ['das WLAN (kein Plural)', 'VE:-lan', 'il wifi'],
  ['der Aufzug (die Aufzüge)', 'AUF-tsu:k (AUF-tsü:-gë)', "l'ascensore"],
  ['der Ausgang (die Ausgänge)', 'AUS-gang (AUS-gen-gë)', "l'uscita"],
])}
${vsec('Città', [
  ['die Stadt (die Städte)', 'SHTAT (SHTE:-të)', 'la città'],
  ['die Straße (die Straßen)', 'SHTRA:-ssë (SHTRA:-ssën)', 'la strada'],
  ['der Platz (die Plätze)', 'PLATS (PLE-tsë)', 'la piazza'],
  ['die Kirche (die Kirchen)', 'KIR-çë (KIR-çën)', 'la chiesa'],
  ['das Museum (die Museen)', 'mu-ZE:-um (mu-ZE:-ën)', 'il museo'],
  ['die Brücke (die Brücken)', 'BRÜ-kë (BRÜ-kën)', 'il ponte'],
  ['der Park (die Parks)', 'PARK (PARKS)', 'il parco'],
  ['die Post (kein Plural)', 'POST', 'la posta'],
  ['das Rathaus (die Rathäuser)', 'RA:T-haus (RA:T-hoi-za)', 'il municipio'],
  ['die Polizei (kein Plural)', 'po-li-TSAI', 'la polizia'],
  ['die Haltestelle (die Haltestellen)', 'HAL-të-shte-lë', 'la fermata'],
  ['die Ampel (die Ampeln)', 'AM-pël (AM-pëln)', 'il semaforo'],
  ['die Ecke (die Ecken)', 'E-kë (E-kën)', "l'angolo"],
  ['die Kreuzung (die Kreuzungen)', 'KROI-tsung', "l'incrocio"],
])}
${vsec('Indicazioni', [
  ['Wo ist der Bahnhof?', 'vo: ist de:r BA:N-ho:f', "Dov'è la stazione?"],
  ['Wie komme ich zum Museum?', 'vi: KO-më iç tsum mu-ZE:-um', 'Come arrivo al museo?'],
  ['geradeaus', 'gë-RA:-dë-aus', 'sempre dritto'],
  ['links / rechts', 'LINKS / REÇTS', 'a sinistra / a destra'],
  ['an der Ampel', 'an de:r AM-pël', 'al semaforo'],
  ['über die Brücke', 'Ü:-ba di: BRÜ-kë', 'sopra il ponte'],
  ['bis zur Kreuzung', 'bis tsur KROI-tsung', "fino all'incrocio"],
  ['weit / nah', 'VAIT / NA:', 'lontano / vicino'],
])}
${vsec('Emergenze', [
  ['der Notfall (die Notfälle)', 'NO:T-fal (NO:T-fe-lë)', "l'emergenza"],
  ['Hilfe!', 'HIL-fë', 'Aiuto!'],
  ['der Krankenwagen (die Krankenwagen)', 'KRAN-kën-va:-gën', "l'ambulanza"],
  ['die Feuerwehr (kein Plural)', 'FOI-a-ve:r', 'i vigili del fuoco'],
  ['der Unfall (die Unfälle)', 'UN-fal (UN-fe-lë)', "l'incidente"],
  ['Ich brauche einen Arzt.', 'iç BRAU-chë AI-nën ARTST', 'Ho bisogno di un medico.'],
  ['gestohlen / verloren', 'gë-SHTO:-lën / fer-LO:-rën', 'rubato / perso'],
  ['der Notruf (die Notrufe)', 'NO:T-ru:f', 'la chiamata di emergenza'],
])}
${vsec('Banca e posta', [
  ['die Bank (die Banken)', 'BANK (BAN-kën)', 'la banca'],
  ['das Konto (die Konten)', 'KON-to (KON-tën)', 'il conto corrente'],
  ['der Geldautomat (die Geldautomaten)', 'GELT-au-to-ma:t', 'il bancomat'],
  ['das Bargeld (kein Plural)', 'BA:R-gelt', 'i contanti'],
  ['überweisen', 'Ü:-ba-VAI-zën', 'fare un bonifico'],
  ['abheben', 'AP-he:-bën', 'prelevare'],
  ['das Paket (die Pakete)', 'pa-KE:T (pa-KE:-të)', 'il pacco'],
  ['die Briefmarke (die Briefmarken)', 'BRI:F-mar-kë', 'il francobollo'],
  ['der Brief (die Briefe)', 'BRI:F (BRI:-fë)', 'la lettera'],
])}
${vsec('Divertimento', [
  ['das Kino (die Kinos)', 'KI:-no (KI:-nos)', 'il cinema'],
  ['das Konzert (die Konzerte)', 'kon-TSERT (kon-TSER-të)', 'il concerto'],
  ['das Theater (die Theater)', 'te-A:-ta', 'il teatro'],
  ['die Ausstellung (die Ausstellungen)', 'AUS-shte-lung', 'la mostra'],
  ['das Fest (die Feste)', 'FEST (FE-stë)', 'la festa'],
  ['der Strand (die Strände)', 'SHTRANT (SHTREN-dë)', 'la spiaggia'],
  ['der Berg (die Berge)', 'BERK (BER-gë)', 'la montagna'],
  ['das Schwimmbad (die Schwimmbäder)', 'SHVIM-ba:t (SHVIM-be:-da)', 'la piscina'],
  ['wandern', 'VAN-dërn', 'fare escursioni a piedi'],
])}
<h3>Deutsche Bahn: parole del viaggio</h3>
<p>Sul tabellone cerca <b>Gleis</b> (binario), <b>Abfahrt</b> (partenza) e <b>Verspätung</b> (ritardo). Gli annunci: «Der Zug nach München hat zehn Minuten Verspätung.» [de:r TSU:K na:ch MÜN-çën hat TSE:N mi-NU:-tën fer-SHPE:-tung]. Se cambi treno: <i>Ich muss in Köln umsteigen.</i> [iç MUS in KÖLN UM-shtai-gën]. Per prenotare: <i>Ich möchte eine Fahrkarte nach Berlin, einfach / hin und zurück.</i></p>
<h3>Numeri di emergenza</h3>
<p>In tutta l'Unione europea vale il <b>112</b>. In Germania la polizia ha il <b>110</b>; in Austria polizia 133, ambulanza 144; in Svizzera polizia 117, ambulanza 144, pompieri 118.</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Bahnhof</b> è la stazione ferroviaria; <b>Station</b> è una fermata o un reparto; <b>Haltestelle</b> la fermata dell'autobus.</li>
<li><b>Gleis</b> (non «binario» preso alla lettera): al tabellone il numero è quello del binario.</li>
<li><b>Karte</b> significa biglietto, carta, cartolina; <b>Fahrkarte</b> è il biglietto di trasporto.</li>
<li><b>Gift ≠ regalo</b>; <b>Stadt</b> ≠ stato (<i>Staat</i>).</li>
<li>Un <b>Billett</b> in Svizzera è un biglietto; un <b>Velo</b> una bicicletta.</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Wo ist der Bahnhof? Wie komme ich zum Museum? Auf welchem Gleis? Der Zug hat Verspätung. Ich brauche einen Arzt!</i></div>`,
  [
    q(
      'q1',
      'Che cosa significa «das Gleis»?',
      ['il binario', 'il ghiaccio', 'la luce', 'il biglietto'],
      0,
      'Das Gleis è il binario del treno. Il ghiaccio si dice Eis, e il biglietto Fahrkarte.',
    ),
    q(
      'q2',
      'Che cosa significa «die Verspätung»?',
      ['il ritardo', 'la sorpresa', 'la partenza', 'la tariffa'],
      0,
      'Verspätung è il ritardo, tipico degli annunci della Deutsche Bahn. La partenza è Abfahrt.',
    ),
    q(
      'q3',
      'Qual è il plurale di «der Zug»?',
      ['die Züge', 'die Zugs', 'die Zuge', 'die Zügen'],
      0,
      'Zug forma il plurale con Umlaut e -e: Züge. Zügen sarebbe il dativo plurale (mit den Zügen).',
    ),
    q(
      'q4',
      "Come si chiede «Dov'è la stazione?»",
      ['Wo ist der Bahnhof?', 'Wo ist die Bahnhof?', 'Wohin ist der Bahnhof?', 'Wer ist der Bahnhof?'],
      0,
      'Wo si usa per il luogo statico e Bahnhof è maschile: der. Wohin chiede la direzione, wer una persona.',
    ),
    q(
      'q5',
      'Come si dice «sempre dritto»?',
      ['geradeaus', 'gerade hinaus', 'immer rechts', 'direkt links'],
      0,
      "Geradeaus è l'avverbio di direzione tutto attaccato. Le altre opzioni indicano direzioni diverse o parole inesistenti.",
    ),
    q(
      'q6',
      'Come si dice «Ho bisogno di un medico»?',
      ['Ich brauche einen Arzt.', 'Ich muss einen Arzt.', 'Ich habe einen Arzt.', 'Ich bin ein Arzt.'],
      0,
      "Brauchen significa aver bisogno e regge l'accusativo (einen Arzt). Le altre frasi dicono altro: dovere, avere, essere.",
    ),
    q(
      'q7',
      'Come si pronuncia «Flughafen»?',
      ['[FLU:K-ha:-fën]', '[FLO-ha-fen]', '[FLUG-ha-fen]', '[FLU:-ga-fën]'],
      0,
      'La g finale di Flug si indurisce in k, la u è lunga e a in Hafen è lunga (h iniziale aspirata). Non si legge una g separata.',
    ),
    q(
      'q8',
      'Come si pronuncia «Verspätung»?',
      ['[fer-SHPE:-tung]', '[ver-SPE-tung]', '[VER-spa-tung]', '[fer-SPE:-tong]'],
      0,
      "Il prefisso ver- vale fer-, sp dopo il prefisso vale shp e ä è lunga. L'accento cade su -spä-.",
    ),
    q(
      'q9',
      "Come si dice «la fermata dell'autobus»?",
      ['die Haltestelle', 'der Bahnhof', 'die Station', 'der Halt'],
      0,
      'Haltestelle indica la fermata di bus o tram. Bahnhof è la stazione, Station un reparto o una fermata della metro in senso più ristretto.',
    ),
    q(
      'q10',
      "Che numero si chiama in tutta l'Unione europea per le emergenze?",
      ['112', '110', '133', '117'],
      0,
      'Il 112 vale in tutti i Paesi UE. 110 è la polizia tedesca, 133 quella austriaca e 117 quella svizzera.',
    ),
  ],
  [
    card('c1', 'das Gleis [GLAIS]', 'il binario. <i>Auf Gleis 5.</i>'),
    card('c2', 'die Verspätung [fer-SHPE:-tung]', 'il ritardo. <i>Der Zug hat Verspätung.</i>'),
    card('c3', 'umsteigen [UM-shtai-gën]', 'cambiare treno. <i>Ich muss in Köln umsteigen.</i>'),
    card('c4', 'einfach / hin und zurück', 'solo andata / andata e ritorno (biglietto).'),
    card('c5', 'Wie komme ich zum …?', 'Come arrivo a …? (zum = zu dem). <i>Wie komme ich zum Bahnhof?</i>'),
    card('c6', 'geradeaus, links, rechts', '[gë-RA:-dë-aus, LINKS, REÇTS] dritto, a sinistra, a destra.'),
    card('c7', 'der Notfall [NO:T-fal]', "l'emergenza. <i>Hilfe! Ich brauche einen Arzt.</i>"),
    card('c8', 'der Flughafen [FLU:K-ha:-fën]', "l'aeroporto. Plurale <i>die Flughäfen</i>."),
    card('c9', 'die Fahrkarte [FA:R-kar-të]', "il biglietto del treno o dell'autobus."),
  ],
  [
    prac(
      'p1',
      "Traduci: «Scusi, dov'è l'uscita?»",
      '<i>Entschuldigung, wo ist der Ausgang?</i> Nota: Entschuldigung [ent-SHUL-di-gung]; Ausgang è maschile.',
    ),
    prac(
      'p2',
      "Chiedi all'impiegato: «Il treno per Monaco ha ritardo?»",
      '<i>Hat der Zug nach München Verspätung?</i> Nota: nach + città senza articolo.',
    ),
    prac(
      'p3',
      'Prenota in albergo: «Vorrei una camera doppia per due notti.»',
      '<i>Ich möchte ein Doppelzimmer für zwei Nächte.</i> Nota: Doppelzimmer neutro, Nächte plurale di Nacht.',
    ),
    prac(
      'p4',
      'Dai indicazioni: «Vada sempre dritto, poi a destra al semaforo.»',
      '<i>Gehen Sie geradeaus, dann an der Ampel rechts.</i> Nota: imperativo di cortesia con Sie.',
    ),
    prac(
      'p5',
      'Traduci: «Mi hanno rubato la valigia.»',
      '<i>Mir wurde der Koffer gestohlen.</i> Nota: passivo con dativo (mir), vedi il modulo sul passivo.',
    ),
  ],
)

export const deVocLavoro: CourseModule = mod(
  'de-voc-lavoro',
  'Vocabolario: lavoro, studio e conversazione',
  'Lavoro, studio, tecnologia e informatica, opinioni e sentimenti, politica ed economia di base, espressioni utili (100 termini)',
  'voc',
  `<p class="lead">Il vocabolario per lavorare, studiare e conversare, con <b>articolo</b>, <b>plurale</b> e <b>pronuncia</b>. Le ultime due sezioni sono le più utili agli esami orali: opinioni e formule per prendere la parola.</p>
${PRON_SHORT}
${vsec('Lavoro', [
  ['die Arbeit (die Arbeiten)', 'AR-bait (AR-bai-tën)', 'il lavoro'],
  ['der Beruf (die Berufe)', 'bë-RU:F (bë-RU:-fë)', 'la professione'],
  ['die Stelle (die Stellen)', 'SHTE-lë (SHTE-lën)', 'il posto di lavoro'],
  ['der Chef / die Chefin', 'SHEF / SHE-fin', 'il capo / la capa'],
  ['der Kollege (die Kollegen)', 'ko-LE:-gë (ko-LE:-gën)', 'il collega'],
  ['das Büro (die Büros)', 'bü-RO: (bü-ROS)', "l'ufficio"],
  ['die Besprechung (die Besprechungen)', 'bë-SHPRE-çung', 'la riunione'],
  ['das Gehalt (die Gehälter)', 'gë-HALT (gë-HEL-ta)', 'lo stipendio'],
  ['der Vertrag (die Verträge)', 'fer-TRA:K (fer-TRE:-gë)', 'il contratto'],
  ['die Bewerbung (die Bewerbungen)', 'bë-VER-bung', 'la candidatura'],
  ['das Vorstellungsgespräch', 'FO:R-shte-lungs-gë-shpre:ç', 'il colloquio'],
  ['die Erfahrung (die Erfahrungen)', 'er-FA:-rung', "l'esperienza"],
  ['die Firma (die Firmen)', 'FIR-ma (FIR-mën)', "l'azienda"],
  ['der Urlaub (kein Plural)', 'U:R-laup', 'le ferie'],
  ['die Kündigung (die Kündigungen)', 'KÜN-di-gung', 'il licenziamento, le dimissioni'],
  ['die Überstunden (nur Plural)', 'Ü:-ba-shtun-dën', 'gli straordinari'],
  ['die Pause (die Pausen)', 'PAU-zë (PAU-zën)', 'la pausa'],
  ['der Kunde (die Kunden)', 'KUN-dë (KUN-dën)', 'il cliente'],
  ['das Projekt (die Projekte)', 'pro-JEKT (pro-JEK-të)', 'il progetto'],
])}
${vsec('Studio', [
  ['die Universität (die Universitäten)', 'u-ni-ver-zi-TE:T', "l'università"],
  ['das Studium (die Studien)', 'SHTU:-di-um (SHTU:-di-ën)', 'gli studi universitari'],
  ['der Student / die Studentin', 'shtu-DENT / shtu-DEN-tin', 'lo studente / la studentessa'],
  ['die Vorlesung (die Vorlesungen)', 'FO:R-le:-zung', 'la lezione universitaria'],
  ['die Prüfung (die Prüfungen)', 'PRÜ:-fung (PRÜ:-fun-gën)', "l'esame"],
  ['die Note (die Noten)', 'NO:-të (NO:-tën)', 'il voto'],
  ['das Fach (die Fächer)', 'FACH (FE-ça)', 'la materia'],
  ['die Hausaufgabe (die Hausaufgaben)', 'HAUS-auf-ga:-bë', 'il compito a casa'],
  ['der Kurs (die Kurse)', 'KURS (KUR-zë)', 'il corso'],
  ['das Semester (die Semester)', 'ze-MES-ta', 'il semestre'],
  ['die Bibliothek (die Bibliotheken)', 'bi-bli-o-TE:K (bi-bli-o-TE:-kën)', 'la biblioteca'],
  ['lernen', 'LER-nën', 'imparare, studiare'],
])}
${vsec('Tecnologia e informatica', [
  ['der Computer (die Computer)', 'kom-PJU:-ta', 'il computer'],
  ['der Bildschirm (die Bildschirme)', 'BILT-shirm (BILT-shir-më)', 'lo schermo'],
  ['die Tastatur (die Tastaturen)', 'ta-sta-TU:R (ta-sta-TU:-rën)', 'la tastiera'],
  ['das Internet (kein Plural)', 'IN-ta-net', 'internet'],
  ['die E-Mail (die E-Mails)', 'I:-me:l (I:-me:ls)', "l'email"],
  ['das Passwort (die Passwörter)', 'PAS-vort (PAS-vör-ta)', 'la password'],
  ['die Datei (die Dateien)', 'da-TAI (da-TAI-ën)', 'il file'],
  ['das Programm (die Programme)', 'pro-GRAM (pro-GRA-më)', 'il programma'],
  ['die Daten (nur Plural)', 'DA:-tën', 'i dati'],
  ['herunterladen', 'he-RUN-ta-la:-dën', 'scaricare'],
  ['speichern', 'SHPAI-çërn', 'salvare'],
  ['der Drucker (die Drucker)', 'DRU-ka', 'la stampante'],
  ['die Software (kein Plural)', 'ZOFT-ve:r', 'il software'],
])}
${vsec('Opinioni e sentimenti', [
  ['die Meinung (die Meinungen)', 'MAI-nung (MAI-nun-gën)', "l'opinione"],
  ['Ich finde, dass …', 'iç FIN-dë, das', 'Trovo che …'],
  ['meiner Meinung nach', 'MAI-na MAI-nung NA:CH', 'secondo me'],
  ['dafür / dagegen', 'da-FÜ:R / da-GE:-gën', 'a favore / contro'],
  ['froh', 'FRO:', 'contento'],
  ['traurig', 'TRAU-riç', 'triste'],
  ['wütend', 'VÜ:-tënt', 'furioso'],
  ['überrascht', 'Ü:-ba-RASHT', 'sorpreso'],
  ['stolz', 'SHTOLTS', 'orgoglioso'],
  ['enttäuscht', 'ent-TOISHT', 'deluso'],
  ['zufrieden', 'tsu-FRI:-dën', 'soddisfatto'],
  ['neugierig', 'NOI-gi:-riç', 'curioso'],
  ['die Angst (die Ängste)', 'ANGST (ENG-stë)', 'la paura'],
  ['die Hoffnung (die Hoffnungen)', 'HOF-nung', 'la speranza'],
])}
${vsec('Politica ed economia di base', [
  ['die Regierung (die Regierungen)', 're-GI:-rung', 'il governo'],
  ['der Staat (die Staaten)', 'SHTA:T (SHTA:-tën)', 'lo Stato'],
  ['die Wahl (die Wahlen)', 'VA:L (VA:-lën)', 'le elezioni'],
  ['die Partei (die Parteien)', 'par-TAI (par-TAI-ën)', 'il partito'],
  ['das Gesetz (die Gesetze)', 'gë-ZETS (gë-ZE-tsë)', 'la legge'],
  ['die Wirtschaft (kein Plural)', 'VIRT-shaft', "l'economia"],
  ['die Steuer (die Steuern)', 'SHTOI-a (SHTOI-ërn)', 'la tassa'],
  ['die Inflation (kein Plural)', 'in-fla-TSIO:N', "l'inflazione"],
  ['die Arbeitslosigkeit (kein Plural)', 'AR-baits-lo:-ziç-kait', 'la disoccupazione'],
  ['das Einkommen (die Einkommen)', 'AIN-ko-mën', 'il reddito'],
  ['die Gesellschaft (die Gesellschaften)', 'gë-ZEL-shaft', 'la società'],
  ['die Umwelt (kein Plural)', 'UM-velt', "l'ambiente"],
])}
${vsec('Per conversare', [
  ['Das stimmt.', 'das SHTIMT', 'È vero.'],
  ['Da bin ich anderer Meinung.', 'da bin iç AN-dë-ra MAI-nung', "Su questo non sono d'accordo."],
  ['Ich bin einverstanden.', 'iç bin AIN-fer-shtan-dën', "Sono d'accordo."],
  ['Wie bitte?', 'vi: BI-të', 'Come, prego?'],
  ['Könnten Sie das wiederholen?', 'KÖN-tën zi: das vi-da-HO:-lën', 'Potrebbe ripeterlo?'],
  ['Was bedeutet das?', 'vas bë-DOI-tët das', 'Che cosa significa?'],
  ['Das kommt darauf an.', 'das KOMT da-RAUF an', 'Dipende.'],
  ['übrigens', 'Ü:-bri-gëns', 'a proposito'],
  ['auf jeden Fall', 'auf JE:-dën FAL', 'in ogni caso'],
  ['natürlich', 'na-TÜR-liç', 'naturalmente'],
  ['leider', 'LAI-da', 'purtroppo'],
  ['Gern geschehen.', 'GERN gë-SHE:-ën', 'Prego.'],
  ['Genau!', 'gë-NAU', 'Esatto!'],
])}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Vorlesung</b> è la lezione universitaria (non la «lettura»); la lettura è <i>die Lesung</i>.</li>
<li><b>Chef</b> = capo (<i>Koch</i> = cuoco); <b>Kollege</b> = collega, anche al femminile <i>die Kollegin</i>.</li>
<li><b>Stelle</b> = posto di lavoro; <b>Arbeit</b> = lavoro in generale; <b>Job</b> = lavoretto.</li>
<li><b>Studium</b>: gli studi (<i>Ich mache mein Studium</i>); <b>studieren</b> si usa per l'università, <b>lernen</b> per imparare in generale.</li>
<li><b>Gehalt</b> (stipendio mensile), <b>Lohn</b> (paga oraria o salario), <b>Honorar</b> (compenso del libero professionista).</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Meiner Meinung nach … Ich bin dafür/dagegen. Da bin ich anderer Meinung. Wie bitte? Könnten Sie das wiederholen?</i></div>`,
  [
    q(
      'q1',
      'Che cosa significa «das Gehalt»?',
      ['lo stipendio', 'il contenuto', 'la fatica', 'il gelato'],
      0,
      'Das Gehalt è lo stipendio mensile. Il contenuto si dice Inhalt, ed è un termine che non va confuso.',
    ),
    q(
      'q2',
      'Che cosa significa «die Vorlesung»?',
      ['la lezione universitaria', 'la lettura di un libro', 'il compito a casa', 'la prenotazione'],
      0,
      "Vorlesung è la lezione frontale all'università. Il compito a casa è Hausaufgabe e una lettura pubblica è Lesung.",
    ),
    q(
      'q3',
      'Qual è il plurale di «der Vertrag»?',
      ['die Verträge', 'die Vertrags', 'die Vertragen', 'die Vertrage'],
      0,
      'Vertrag fa Umlaut e -e: Verträge. Le altre sono forme inesistenti.',
    ),
    q(
      'q4',
      'Come si dice «secondo me»?',
      ['meiner Meinung nach', 'mein Meinung nach', 'nach meine Meinung', 'in meiner Meinung'],
      0,
      'La formula fissa è meiner Meinung nach, con Meinung al dativo (meiner) e nach dopo il nome. Le altre sono forme sbagliate.',
    ),
    q(
      'q5',
      'Come si dice «Potrebbe ripeterlo?»',
      [
        'Könnten Sie das wiederholen?',
        'Können Sie das wiederholt?',
        'Könnten Sie das zu wiederholen?',
        'Würden Sie das wiederholt?',
      ],
      0,
      "Dopo un modale l'infinito va senza zu e senza participio. La forma Könnten è il Konjunktiv II di cortesia.",
    ),
    q(
      'q6',
      'Qual è il plurale di «die Prüfung»?',
      ['die Prüfungen', 'die Prüfunge', 'die Prüfungs', 'die Prüfungern'],
      0,
      'I nomi in -ung (femminili) formano il plurale in -en: Prüfungen. Le altre forme non esistono.',
    ),
    q(
      'q7',
      'Come si pronuncia «Universität»?',
      ['[u-ni-ver-zi-TE:T]', '[U-ni-ver-si-tet]', '[u-ni-VER-zi-tat]', '[u-ni-ver-sì-TÄT]'],
      0,
      "L'accento cade sull'ultima sillaba (-tät), ä è lunga come e aperta, s tra vocali è sonora. L'accento italiano è sulla penultima.",
    ),
    q(
      'q8',
      'Come si pronuncia «Computer»?',
      ['[kom-PJU:-ta]', '[KOM-pu-ter]', '[kom-PIU-tër]', '[kom-pu-TER]'],
      0,
      "L'accento cade sulla seconda sillaba, pu si legge «piu» con u lunga e -er finale suona «a».",
    ),
    q(
      'q9',
      'Come si dice «Dipende.»?',
      ['Das kommt darauf an.', 'Das hängt es ab.', 'Das kommt auf.', 'Das ist darauf an.'],
      0,
      "Ankommen auf + accusativo (darauf) forma l'espressione fissa. Abhängen von sarebbe Das hängt davon ab.",
    ),
    q(
      'q10',
      'Che cosa significa «leider»?',
      ['purtroppo', 'finalmente', 'volentieri', 'comunque'],
      0,
      'Leider esprime dispiacere: purtroppo. Finalmente è endlich, volentieri gern.',
    ),
  ],
  [
    card('c1', 'das Gehalt [gë-HALT]', 'lo stipendio. Plurale <i>Gehälter</i>.'),
    card('c2', 'die Bewerbung [bë-VER-bung]', 'la candidatura. Verbo: <i>sich bewerben um</i>.'),
    card('c3', 'die Vorlesung [FO:R-le:-zung]', 'lezione universitaria.'),
    card('c4', 'die Prüfung [PRÜ:-fung]', "l'esame. <i>Eine Prüfung bestehen</i> = superare un esame."),
    card('c5', 'meiner Meinung nach', 'secondo me [MAI-na MAI-nung NA:CH].'),
    card('c6', 'dafür / dagegen', 'a favore / contro [da-FÜ:R / da-GE:-gën].'),
    card('c7', 'Wie bitte?', 'Come, prego? [vi: BI-të]. Per far ripetere.'),
    card('c8', 'Das kommt darauf an.', 'Dipende. [das KOMT da-RAUF an]'),
    card('c9', 'leider / natürlich', 'purtroppo / naturalmente [LAI-da / na-TÜR-liç].'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Mi sono candidato per un posto in questa azienda.»',
      '<i>Ich habe mich um eine Stelle in dieser Firma beworben.</i> Nota: sich bewerben um + Akk; in + Dativ (dieser Firma).',
    ),
    prac(
      'p2',
      'Traduci: «Secondo me il lavoro è troppo stressante.»',
      '<i>Meiner Meinung nach ist die Arbeit zu stressig.</i> Nota: stressig = stressante; meiner Meinung nach in prima posizione, verbo seconda.',
    ),
    prac(
      'p3',
      'Chiedi a qualcuno di ripetere in modo cortese.',
      '<i>Entschuldigung, könnten Sie das bitte wiederholen?</i> Nota: Konjunktiv II di cortesia.',
    ),
    prac(
      'p4',
      "Traduci: «Sono d'accordo, ma su questo punto la penso diversamente.»",
      '<i>Ich bin einverstanden, aber in diesem Punkt bin ich anderer Meinung.</i> Nota: anderer Meinung sein = pensarla diversamente.',
    ),
    prac(
      'p5',
      'Scrivi tre frasi sul tuo lavoro o sui tuoi studi.',
      'Esempio: <i>Ich arbeite in einer Firma in Mailand. Mein Chef ist sehr nett. Ich habe viele Besprechungen.</i> Nota: controlla gli articoli e il verbo in seconda posizione.',
    ),
  ],
)
