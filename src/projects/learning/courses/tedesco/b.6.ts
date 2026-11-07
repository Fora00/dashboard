import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_FULL, PRON_SHORT, vsec } from './pron'
import { dl, tbl } from './b.util'

export const deDialoghi: CourseModule = mod(
  'de-dialoghi',
  'Dialoghi modello DE / IT',
  'Caffè, albergo, telefono, medico, colloquio, amici, problema, viaggio, ristorante, con pronuncia riga per riga',
  'drill',
  `<p class="lead">Nove dialoghi completi per situazioni reali. Sotto ogni frase tedesca trovi la <b>pronuncia</b> tra parentesi (accento in maiuscolo) e la traduzione italiana. Leggili ad alta voce, poi coprili e ricostruisci la risposta.</p>
${PRON_SHORT}
${PRON_FULL}
<h3>1. Al caffè</h3>
${dl('Kellner', 'Guten Tag, was darf es sein?', 'GU:-tën TA:K, vas DARF es ZAIN', 'Buongiorno, cosa desidera?')}
${dl('Gast', 'Einen Kaffee und ein Stück Apfelkuchen, bitte.', 'AI-nën KA-fe unt ain SHTÜK A-pfël-ku:-chën, BI-të', 'Un caffè e un pezzo di torta di mele, per favore.')}
${dl('Kellner', 'Gern. Sonst noch etwas?', 'GERN. ZONST noch ET-vas', 'Volentieri. Altro?')}
${dl('Gast', 'Nein, danke. Was macht das?', 'NAIN, DAN-kë. vas MACHT das', 'No, grazie. Quanto fa?')}
${dl('Kellner', 'Sechs Euro fünfzig.', 'ZEKS OI-ro FÜNF-tsiç', 'Sei euro e cinquanta.')}
${dl('Gast', 'Stimmt so.', 'SHTIMT zo', 'Tenga il resto.')}
<h3>2. In albergo</h3>
${dl('Gast', 'Guten Abend, ich habe ein Zimmer auf den Namen Rossi reserviert.', 'GU:-tën A:-bënt, iç HA:-bë ain TSI-ma auf de:n NA:-mën RO-ssi re-zer-VI:rt', 'Buonasera, ho prenotato una camera a nome Rossi.')}
${dl('Rezeption', 'Ja, ein Doppelzimmer für zwei Nächte. Ihren Pass, bitte.', 'JA:, ain DO-pël-tsi-ma fü:r tsvai NEÇ-të. I:-rën PAS, BI-të', 'Sì, una doppia per due notti. Il passaporto, per favore.')}
${dl('Gast', 'Bitte sehr. Ist das Frühstück inklusive?', 'BI-të ZE:R. ist das FRÜ:-shtük in-klu-ZI:-vë', 'Prego. La colazione è inclusa?')}
${dl('Rezeption', 'Ja, von sieben bis zehn Uhr.', 'JA:, fon ZI:-bën bis TSE:N U:R', 'Sì, dalle sette alle dieci.')}
${dl('Gast', 'Und gibt es WLAN?', 'unt GIPT es VE:-lan', "E c'è il wifi?")}
${dl('Rezeption', 'Ja, das Passwort steht auf der Karte. Zimmer zwölf, zweiter Stock.', 'JA:, das PAS-vort SHTE:T auf de:r KAR-të. TSI-ma TSVÖLF, TSVAI-ta SHTOK', 'Sì, la password è sulla scheda. Camera dodici, secondo piano.')}
<h3>3. Al telefono (appuntamento)</h3>
${dl('Ich', 'Guten Tag, ich möchte einen Termin bei Dr. Müller vereinbaren.', 'GU:-tën TA:K, iç MÖÇ-të AI-nën ter-MI:N bai DOK-tor MÜ-la fer-AIN-ba:-rën', 'Buongiorno, vorrei fissare un appuntamento dal dottor Müller.')}
${dl('Praxis', 'Wie ist Ihr Name, bitte?', 'vi: ist i:r NA:-më, BI-të', 'Come si chiama, per favore?')}
${dl('Ich', 'Rossi: R, O, S, S, I.', 'RO-ssi: ER, O:, ES, ES, I:', 'Rossi: R, O, S, S, I.')}
${dl('Praxis', 'Donnerstag um fünfzehn Uhr, passt das?', 'DO-nërs-ta:k um FÜNF-tse:n U:R, PAST das', 'Giovedì alle quindici, va bene?')}
${dl('Ich', 'Ja, das passt gut. Vielen Dank, auf Wiederhören!', 'JA:, das PAST GU:T. FI:-lën DANK, auf VI:-da-hö:-rën', 'Sì, va bene. Grazie mille, arrivederci! (al telefono)')}
<h3>4. Dal medico</h3>
${dl('Arzt', 'Guten Tag, was fehlt Ihnen?', 'GU:-tën TA:K, vas FE:LT I:-nën', 'Buongiorno, che cosa Le succede?')}
${dl('Patient', 'Ich habe seit gestern Halsschmerzen und Fieber.', 'iç HA:-bë zait GES-tërn HALS-shmer-tsën unt FI:-ba', 'Ho mal di gola e febbre da ieri.')}
${dl('Arzt', 'Machen Sie bitte den Mund auf. Ihr Hals ist rot.', 'MA-chën zi: BI-të de:n MUNT auf. i:r HALS ist RO:T', 'Apra la bocca, per favore. La gola è rossa.')}
${dl('Arzt', 'Sie haben eine Erkältung. Ich gebe Ihnen ein Rezept.', 'zi: HA:-bën AI-në er-KEL-tung. iç GE:-bë I:-nën ain re-TSEPT', 'Ha un raffreddore. Le do una ricetta.')}
${dl('Patient', 'Wie oft muss ich die Tabletten nehmen?', 'vi: OFT MUS iç di: ta-BLE-tën NE:-mën', 'Quante volte devo prendere le compresse?')}
${dl('Arzt', 'Dreimal täglich, nach dem Essen.', 'DRAI-ma:l TE:G-liç, na:ch de:m E-ssën', 'Tre volte al giorno, dopo i pasti.')}
<h3>5. Colloquio di lavoro</h3>
${dl('Chefin', 'Erzählen Sie mir von Ihrer Berufserfahrung.', 'er-TSE:-lën zi: mi:r fon I:-ra bë-RU:FS-er-fa:-rung', 'Mi parli della Sua esperienza professionale.')}
${dl('Bewerber', 'Ich habe drei Jahre in einer Werbeagentur gearbeitet.', 'iç HA:-bë drai JA:-rë in AI-na VER-bë-a-gen-tu:r gë-AR-bai-tët', "Ho lavorato tre anni in un'agenzia pubblicitaria.")}
${dl('Chefin', 'Warum möchten Sie die Stelle wechseln?', 'va-RUM MÖÇ-tën zi: di: SHTE-lë VEK-sëln', 'Perché vuole cambiare lavoro?')}
${dl('Bewerber', 'Ich suche mehr Verantwortung und neue Herausforderungen.', 'iç ZU:-chë ME:R fer-ANT-vor-tung unt NOI-ë he-RAUS-for-dë-run-gën', 'Cerco più responsabilità e nuove sfide.')}
${dl('Chefin', 'Wann könnten Sie anfangen?', 'van KÖN-tën zi: AN-fa-ngën', 'Quando potrebbe cominciare?')}
<h3>6. Con amici</h3>
${dl('Lisa', "Hallo Tom! Wie geht's?", 'HA-lo TOM. vi: GE:TS', 'Ciao Tom! Come va?')}
${dl('Tom', 'Gut, und dir? Wie war dein Wochenende?', 'GU:T, unt di:r. vi: va:r dain VO-chën-en-dë', "Bene, e a te? Com'è stato il tuo weekend?")}
${dl('Lisa', 'Super! Wir sind am Samstag an den See gefahren.', 'ZU:-pa. vi:r zint am ZAMS-ta:k an de:n ZE: gë-FA:-rën', 'Benissimo! Sabato siamo andati al lago.')}
${dl('Tom', 'Cool! Hast du Lust, morgen Abend ins Kino zu gehen?', 'KUL. hast du LUST, MOR-gën A:-bënt ins KI:-no tsu GE:-ën', 'Forte! Hai voglia di andare al cinema domani sera?')}
${dl('Lisa', 'Gern! Um wie viel Uhr?', 'GERN. um vi: FI:L U:R', 'Volentieri! A che ora?')}
<h3>7. Un problema (in negozio)</h3>
${dl('Kunde', 'Entschuldigung, ich möchte diese Jacke umtauschen. Sie ist zu klein.', 'ent-SHUL-di-gung, iç MÖÇ-të DI:-zë JA-kë UM-tau-shën. zi: ist tsu KLAIN', 'Scusi, vorrei cambiare questa giacca. È troppo piccola.')}
${dl('Verkäuferin', 'Haben Sie den Kassenbon?', 'HA:-bën zi: de:n KA-ssën-bon', 'Ha lo scontrino?')}
${dl('Kunde', 'Ja, hier. Ich habe sie gestern gekauft.', 'JA:, HI:R. iç HA:-bë zi: GES-tërn gë-KAUFT', "Sì, ecco. L'ho comprata ieri.")}
${dl('Verkäuferin', 'Kein Problem. Welche Größe brauchen Sie?', 'KAIN pro-BLE:M. VEL-çë GRÖ:-ssë BRAU-chën zi:', 'Nessun problema. Che taglia Le serve?')}
<h3>8. Viaggio (in stazione)</h3>
${dl('Reisender', 'Eine Fahrkarte nach Berlin, bitte.', 'AI-në FA:R-kar-të na:ch ber-LI:N, BI-të', 'Un biglietto per Berlino, per favore.')}
${dl('Schalter', 'Einfach oder hin und zurück?', 'AIN-fach O:-da HIN unt tsu-RÜK', 'Solo andata o andata e ritorno?')}
${dl('Reisender', 'Hin und zurück. Wann fährt der nächste Zug?', 'HIN unt tsu-RÜK. van FE:RT de:r NE:ç-stë TSU:K', 'Andata e ritorno. Quando parte il prossimo treno?')}
${dl('Schalter', 'Um zehn Uhr fünfzehn von Gleis vier.', 'um TSE:N U:R FÜNF-tse:n fon GLAIS FI:R', 'Alle dieci e quindici dal binario quattro.')}
${dl('Reisender', 'Hat der Zug Verspätung?', 'HAT de:r TSU:K fer-SHPE:-tung', 'Il treno ha ritardo?')}
${dl('Schalter', 'Nein, er ist pünktlich.', 'NAIN, e:r ist PÜNKT-liç', 'No, è puntuale.')}
<h3>9. Al ristorante</h3>
${dl('Kellner', 'Haben Sie schon gewählt?', 'HA:-bën zi: SHO:N gë-VE:LT', 'Ha già scelto?')}
${dl('Gast', 'Ja, ich nehme das Schnitzel mit Kartoffelsalat.', 'JA:, iç NE:-më das SHNI-tsël mit kar-TO-fël-za-la:t', 'Sì, prendo la cotoletta con insalata di patate.')}
${dl('Kellner', 'Und zu trinken?', 'unt tsu TRIN-kën', 'E da bere?')}
${dl('Gast', 'Ein Glas Weißwein und ein Wasser, bitte.', 'ain GLA:S VAIS-vain unt ain VA-ssa, BI-të', "Un bicchiere di vino bianco e un'acqua, per favore.")}
${dl('Gast', 'Die Rechnung, bitte.', 'di: REÇ-nung, BI-të', 'Il conto, per favore.')}
${dl('Kellner', 'Zusammen oder getrennt?', 'tsu-ZA-mën O:-da gë-TRENT', 'Insieme o separati?')}
${vsec('Frasi chiave da portare con te', [
  ['Entschuldigung, können Sie mir helfen?', 'ent-SHUL-di-gung, KÖ-nën zi: mi:r HEL-fën', 'Scusi, può aiutarmi?'],
  [
    'Ich verstehe das nicht. Können Sie das wiederholen?',
    'iç fer-SHTE:-ë das niçt. KÖ-nën zi: das vi-da-HO:-lën',
    'Non lo capisco. Può ripeterlo?',
  ],
  ['Sprechen Sie bitte langsamer.', 'SHPRE-çën zi: BI-të LANG-za-ma', 'Parli più lentamente, per favore.'],
  ['Wie viel kostet das?', 'vi: FI:L KO-stët das', 'Quanto costa?'],
  ['Ich hätte gern …', 'iç HE-të GERN', 'Vorrei …'],
  ['Wo ist die Toilette?', 'vo: ist di: to-a-LE-të', "Dov'è il bagno?"],
  ['Ich spreche nur ein bisschen Deutsch.', 'iç SHPRE-çë nu:r ain BIS-çën DOITSH', "Parlo solo un po' di tedesco."],
])}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Zusammen oder getrennt?</b> In Germania si paga spesso separatamente: dì subito «Getrennt, bitte».</li>
<li><b>Stimmt so</b> = tenga il resto. La mancia si arrotonda dicendo l'importo finale.</li>
<li><b>zweiter Stock</b> = secondo piano sopra il pianterreno (<i>Erdgeschoss</i>).</li>
<li>Al telefono: <i>auf Wiederhören</i>, non «auf Wiedersehen» (che significa «a rivederci»).</li>
<li>Dopo <b>Bitte</b> serve un tono di richiesta: la cortesia è nel Konjunktiv II (<i>könnten Sie</i>, <i>ich hätte gern</i>).</li>
</ul>
${tbl(
  ['Situazione', 'Frase tipo'],
  [
    ['Salutare', 'Guten Tag / Hallo / Servus'],
    ['Ordinare', 'Ich hätte gern …'],
    ['Pagare', 'Zahlen, bitte!'],
    ['Non capire', 'Wie bitte?'],
  ],
)}
<div class="say"><b>Da ricordare.</b> <i>Ich hätte gern …, Können Sie mir helfen?, Wie bitte?, Zusammen oder getrennt?, Stimmt so.</i></div>`,
  [
    q(
      'q1',
      'Che cosa significa «Stimmt so»?',
      ['Tenga il resto.', 'È così difficile.', 'Questo è sbagliato.', 'Così va bene, grazie.'],
      0,
      "Dicendo Stimmt so si lascia al cameriere la differenza come mancia. Non è un commento sul conto né sull'errore.",
    ),
    q(
      'q2',
      'Che cosa significa «Zusammen oder getrennt?»',
      ['Insieme o separati?', 'Insieme o in contanti?', 'Con me o senza?', 'Presto o tardi?'],
      0,
      'È la domanda del cameriere per il conto: un conto unico o ognuno paga il suo. Bar significa contanti, non getrennt.',
    ),
    q(
      'q3',
      'Come si dice «Quanto costa?»',
      ['Wie viel kostet das?', 'Wie viele kostet das?', 'Was viel kostet das?', 'Wie kostet das viel?'],
      0,
      'Viel resta singolare e senza desinenza con kosten: wie viel. Wie viele è per i plurali contabili.',
    ),
    q(
      'q4',
      'Come si dice «Che cosa Le succede?» dal medico?',
      ['Was fehlt Ihnen?', 'Was ist fehlt Ihnen?', 'Was fehlen Sie?', 'Wer fehlt Ihnen?'],
      0,
      'Fehlen regge il dativo: Was fehlt Ihnen? letteralmente «che cosa Le manca». Le altre frasi sono grammaticalmente sbagliate.',
    ),
    q(
      'q5',
      'Come si pronuncia «Entschuldigung»?',
      ['[ent-SHUL-di-gung]', '[ENT-skul-di-gung]', '[ent-SHUL-dig-ung]', '[ent-SKUL-di-gung]'],
      0,
      "Tsch non c'è: ent- + sch (sh) + uld. L'accento cade su -schul- e -ung finale ha la u breve. L'accento sul prefisso è un errore.",
    ),
    q(
      'q6',
      'Come si pronuncia «Guten Abend»?',
      ['[GU:-tën A:-bënt]', '[GU-ten A-bend]', '[GU:-tën A:-bent]', '[GU:-ten A-BEND]'],
      0,
      "Le sillabe -en sono deboli (ën), la d finale si indurisce in t, e le vocali accentate u e a sono lunghe. L'accento è sulla prima sillaba di entrambe le parole.",
    ),
    q(
      'q7',
      'Come si dice «Ho prenotato una camera»?',
      [
        'Ich habe ein Zimmer reserviert.',
        'Ich bin ein Zimmer reserviert.',
        'Ich habe ein Zimmer reservieren.',
        'Ich habe ein Zimmer zu reservieren.',
      ],
      0,
      'Il Perfekt si forma con haben + participio: reserviert. I verbi in -ieren non prendono ge- nel participio.',
    ),
    q(
      'q8',
      'Che cosa significa «der Kassenbon»?',
      ['lo scontrino', 'il buono sconto', 'il cassiere', 'la cassa automatica'],
      0,
      'Der Kassenbon è lo scontrino del negozio, necessario per cambiare un articolo. Il buono sconto si dice Gutschein.',
    ),
  ],
  [
    card('c1', 'Ich hätte gern … [iç HE-të GERN]', 'Vorrei … (al bar, al ristorante, in negozio).'),
    card('c2', 'Stimmt so. [SHTIMT zo]', 'Tenga il resto.'),
    card('c3', 'Zusammen oder getrennt?', 'Insieme o separati? [tsu-ZA-mën O:-da gë-TRENT]'),
    card('c4', 'Was fehlt Ihnen? [vas FE:LT I:-nën]', 'Che cosa Le succede? (dal medico)'),
    card('c5', 'Wie bitte? [vi: BI-të]', 'Come, prego? Per far ripetere.'),
    card('c6', 'Einfach oder hin und zurück?', 'Solo andata o andata e ritorno? (biglietto)'),
    card('c7', 'Hat der Zug Verspätung?', 'Il treno è in ritardo? [HAT de:r TSU:K fer-SHPE:-tung]'),
    card('c8', 'auf Wiederhören! [auf VI:-da-hö:-rën]', 'Arrivederci (al telefono).'),
    card('c9', 'Können Sie mir helfen?', 'Può aiutarmi? [KÖ-nën zi: mi:r HEL-fën]'),
  ],
  [
    prac(
      'p1',
      'Recita il dialogo 1 al posto del cliente, senza guardare.',
      "Modello: <i>Einen Kaffee und ein Stück Apfelkuchen, bitte. Nein, danke. Was macht das? Stimmt so.</i> Nota: controlla l'accusativo (einen Kaffee, ein Stück).",
    ),
    prac(
      'p2',
      'Traduci: «Ho prenotato una camera per tre notti.»',
      '<i>Ich habe ein Zimmer für drei Nächte reserviert.</i> Nota: Nächte è il plurale di Nacht; reserviert senza ge-.',
    ),
    prac(
      'p3',
      'Traduci: «Vorrei fissare un appuntamento per martedì.»',
      "<i>Ich möchte einen Termin für Dienstag vereinbaren.</i> Nota: vereinbaren è un verbo inseparabile (prefisso ver-), l'oggetto è all'accusativo.",
    ),
    prac(
      'p4',
      'Traduci: «Ho mal di stomaco da due giorni.»',
      '<i>Ich habe seit zwei Tagen Bauchschmerzen.</i> Nota: seit + dativo (zwei Tagen); presente per un fatto ancora in corso.',
    ),
    prac(
      'p5',
      'Scrivi un breve dialogo (4 righe) in cui cambi un acquisto in negozio.',
      'Esempio: <i>Ich möchte diesen Pullover umtauschen. – Haben Sie den Kassenbon? – Ja, hier. – Welche Größe brauchen Sie?</i>',
    ),
  ],
)

export const deDrills: CourseModule = mod(
  'de-drills',
  'Esercizi di traduzione e trasformazione',
  '35 esercizi: traduzione IT→DE, trasformazione di frasi, correzione di errori, produzione e pronuncia',
  'drill',
  `<p class="lead">Questo modulo è fatto per <b>scrivere</b>. Gli esercizi sono nel riquadro «Esercizi»: ognuno ha una risposta modello con una nota che spiega il punto di grammatica. Scrivi la tua risposta su carta <i>prima</i> di aprire quella modello, poi confronta.</p>
${PRON_SHORT}
<h3>Come usarli</h3>
<ol>
<li>Leggi la consegna e scrivi la risposta completa (non solo la parola mancante).</li>
<li>Ad alta voce: pronuncia la frase con l'accento sulla sillaba giusta.</li>
<li>Confronta con il modello. Se è diverso, leggi la nota: spesso il tuo tedesco è corretto in un'altra forma.</li>
<li>Rifai gli errori il giorno dopo.</li>
</ol>
<h3>Cinque schemi da controllare sempre</h3>
${tbl(
  ['Controllo', 'Domanda'],
  [
    ['1. Verbo', 'Seconda posizione (principale) o in fondo (subordinata)?'],
    ['2. Caso', 'Soggetto, oggetto diretto, oggetto indiretto, genitivo?'],
    ['3. Genere', 'der, die o das: lo so?'],
    ['4. Desinenza', 'Aggettivo: quale tabella?'],
    ['5. Tempo', 'Perfekt o Präteritum? sein o haben?'],
  ],
)}
<h3>Schemi frequenti con esempio</h3>
${vsec('Pattern da trasformare', [
  [
    'Wenn ich Zeit habe, gehe ich ins Kino.',
    'ven iç TSAIT HA:-bë, GE:-ë iç ins KI:-no',
    'Se ho tempo, vado al cinema.',
  ],
  [
    'Ich bleibe zu Hause, weil ich krank bin.',
    'iç BLAI-bë tsu HAU-zë, vail iç KRANK bin',
    'Resto a casa perché sono malato.',
  ],
  [
    'Ich bin krank. Deshalb bleibe ich zu Hause.',
    'iç bin KRANK. DES-halp BLAI-bë iç tsu HAU-zë',
    'Sono malato. Perciò resto a casa.',
  ],
  [
    'Das ist die Frau, der ich geholfen habe.',
    'das ist di: FRAU, de:r iç gë-HOL-fën HA:-bë',
    'È la donna che ho aiutato.',
  ],
  ['Das Haus wird gebaut.', 'das HAUS virt gë-BAUT', 'La casa viene costruita.'],
  ['Wenn ich reich wäre, würde ich reisen.', 'ven iç RAIÇ VE:-rë, VÜR-dë iç RAI-zën', 'Se fossi ricco, viaggerei.'],
  ['Er sagte, er sei krank.', 'e:r ZA:K-të, e:r ZAI KRANK', 'Disse di essere malato.'],
])}
<h3>Errori più comuni degli italiani</h3>
<ul>
<li>Verbo in terza posizione dopo un avverbio: «Heute ich gehe» → <i>Heute gehe ich</i>.</li>
<li>Mancata maiuscola dei nomi e articolo sbagliato.</li>
<li>Haben invece di sein per l'età e per il movimento.</li>
<li>Congiuntivo italiano trasferito: «Penso che sia» → <i>Ich glaube, er ist</i> (indicativo).</li>
<li>Pronuncia: h iniziale sparita, doppie consonanti allungate (<i>Mitte</i> [MI-të], non [MIT-te]), -e finale letta come e piena.</li>
</ul>
<div class="say"><b>Da ricordare.</b> Verbo, caso, genere, desinenza, tempo: cinque controlli prima di rispondere. Scrivi, leggi ad alta voce, confronta, rifai.</div>`,
  [
    q(
      'q1',
      'Quale frase ha il verbo nella posizione corretta?',
      [
        'Heute gehe ich ins Kino.',
        'Heute ich gehe ins Kino.',
        'Heute ich ins Kino gehe.',
        'Heute ins Kino gehe ich nicht.',
      ],
      0,
      'In una principale il verbo coniugato è sempre il secondo elemento: Heute (1), gehe (2). Le altre frasi lo spostano o cambiano il senso.',
    ),
    q(
      'q2',
      'Quale frase è corretta?',
      [
        'Ich glaube, er ist krank.',
        'Ich glaube, er sei krank.',
        'Ich glaube, dass er wäre krank.',
        'Ich glaube, er ist wäre krank.',
      ],
      0,
      "Dopo glauben in frase affermativa si usa l'indicativo. Il congiuntivo italiano non si traduce con il Konjunktiv I.",
    ),
    q(
      'q3',
      'Come si dice «Ho fame» ?',
      ['Ich habe Hunger.', 'Ich bin Hunger.', 'Mir ist Hunger.', 'Ich habe hungrig.'],
      0,
      "Hunger è un nome: si usa haben + Hunger, come in italiano «avere fame». Hungrig sarebbe l'aggettivo con sein.",
    ),
    q(
      'q4',
      'Come si pronuncia «Mitte» (centro)?',
      ['[MI-të]', '[MIT-te]', '[MI:-të]', '[MI-tte]'],
      0,
      'La doppia t segnala solo che la i è breve, non si allunga la consonante come in italiano. La -e finale è debole (ë).',
    ),
    q(
      'q5',
      'Quale pronuncia è giusta per «Tag» (giorno)?',
      ['[TA:K]', '[TAG]', '[TAK]', '[TA:G]'],
      0,
      "La g finale si indurisce in k (devoicing) e la a è lunga. Una g sonora a fine parola è tipica di chi legge all'italiana.",
    ),
    q(
      'q6',
      'Come si traduce «Se avessi tempo, verrei»?',
      [
        'Wenn ich Zeit hätte, käme ich.',
        'Wenn ich Zeit habe, käme ich.',
        'Wenn ich Zeit hatte, kam ich.',
        'Wenn ich Zeit hätte, kommen ich.',
      ],
      0,
      'La condizione irreale vuole il Konjunktiv II in entrambe le frasi (hätte, käme). Gli altri mescolano presente o passato con il condizionale.',
    ),
  ],
  [
    card('c1', 'Verbo seconda posizione', '<i>Heute gehe ich ins Kino.</i> Mai «Heute ich gehe».'),
    card('c2', 'Verbo in fondo', 'Nella subordinata: <i>weil ich krank bin</i>.'),
    card('c3', 'Maiuscola', 'Tutti i nomi: <i>die Stadt, das Wasser, der Mann</i>.'),
    card('c4', 'sein o haben', 'Movimento e cambiamento: sein. Età: sein. Fame, sete, paura, ragione: haben.'),
    card('c5', 'Devoicing', 'b, d, g a fine sillaba suonano p, t, k: <i>Tag</i> [TA:K], <i>Hund</i> [HUNT].'),
    card('c6', 'Consonante doppia', 'Segnala vocale breve, non si allunga: <i>Mitte</i> [MI-të].'),
    card('c7', 'Dopo glauben', 'Indicativo: <i>Ich glaube, er kommt.</i>'),
    card('c8', 'Cinque controlli', 'Verbo, caso, genere, desinenza, tempo.'),
  ],
  [
    prac(
      'd1',
      'Traduci: «Se piove, resto a casa.»',
      '<i>Wenn es regnet, bleibe ich zu Hause.</i> Nota: dopo la subordinata il verbo della principale viene subito.',
    ),
    prac(
      'd2',
      'Traduci: «Studio tedesco per lavorare a Vienna.»',
      '<i>Ich lerne Deutsch, um in Wien zu arbeiten.</i> Nota: um … zu con lo stesso soggetto.',
    ),
    prac(
      'd3',
      'Traduci: «Benché sia stanco, lavora ancora.»',
      '<i>Obwohl er müde ist, arbeitet er noch.</i> Nota: indicativo, non congiuntivo.',
    ),
    prac(
      'd4',
      'Unisci con weil: «Ich bleibe zu Hause. Ich bin krank.»',
      '<i>Ich bleibe zu Hause, weil ich krank bin.</i> Nota: verbo in fondo.',
    ),
    prac(
      'd5',
      'Unisci con deshalb: «Ich bin krank. Ich bleibe zu Hause.»',
      '<i>Ich bin krank. Deshalb bleibe ich zu Hause.</i> Nota: dopo deshalb il verbo viene subito.',
    ),
    prac(
      'd6',
      'Unisci con un relativo: «Das ist die Frau. Ich habe ihr geholfen.»',
      '<i>Das ist die Frau, der ich geholfen habe.</i> Nota: dativo femminile = der.',
    ),
    prac(
      'd7',
      'Unisci con dessen: «Der Mann wohnt hier. Sein Hund ist groß.»',
      '<i>Der Mann, dessen Hund groß ist, wohnt hier.</i> Nota: dessen senza articolo.',
    ),
    prac(
      'd8',
      'Traduci: «A causa del tempo restiamo a casa.»',
      '<i>Wegen des Wetters bleiben wir zu Hause.</i> Nota: wegen + genitivo.',
    ),
    prac(
      'd9',
      'Traduci: «Conosco lo studente.»',
      "<i>Ich kenne den Studenten.</i> Nota: declinazione n all'accusativo.",
    ),
    prac(
      'd10',
      'Completa: «Ich sehe einen ___ Hund.» (groß)',
      '<i>Ich sehe einen großen Hund.</i> Nota: einen + accusativo maschile → -en.',
    ),
    prac('d11', 'Traduci: «Con la nuova collega.»', '<i>Mit der neuen Kollegin.</i> Nota: dativo femminile, -en.'),
    prac('d12', 'Scrivi «latte freddo» al nominativo.', '<i>kalte Milch</i> Nota: nessun articolo, femminile → -e.'),
    prac('d13', 'Traduci: «Lui è più alto di me.»', '<i>Er ist größer als ich.</i> Nota: comparativo + als.'),
    prac(
      'd14',
      'Traduci: «Questo libro è il più interessante.»',
      '<i>Dieses Buch ist am interessantesten.</i> Nota: superlativo predicativo con am … -sten.',
    ),
    prac(
      'd15',
      'Traduci: «Dopo che ebbe mangiato, uscì.»',
      '<i>Nachdem er gegessen hatte, ging er aus.</i> Nota: Plusquamperfekt + Präteritum.',
    ),
    prac(
      'd16',
      'Traduci: «Sono andato a Berlino in treno.»',
      '<i>Ich bin mit dem Zug nach Berlin gefahren.</i> Nota: fahren con sein; mit + dativo.',
    ),
    prac(
      'd17',
      'Traduci: «Se avessi tempo, verrei.»',
      '<i>Wenn ich Zeit hätte, käme ich. / würde ich kommen.</i> Nota: Konjunktiv II in entrambe le frasi.',
    ),
    prac(
      'd18',
      'Traduci: «Se avessi saputo, non sarei venuto.»',
      '<i>Wenn ich das gewusst hätte, wäre ich nicht gekommen.</i> Nota: hätte … gewusst, wäre … gekommen.',
    ),
    prac('d19', 'Traduci: «Vorrei un tè.»', '<i>Ich hätte gern einen Tee.</i> Nota: hätte gern per la cortesia.'),
    prac(
      'd20',
      'Traduci: «Il pacco viene consegnato domani.»',
      '<i>Das Paket wird morgen geliefert.</i> Nota: werden + participio.',
    ),
    prac(
      'd21',
      'Traduci: «Il ponte è stato costruito nel 1950.»',
      '<i>Die Brücke wurde 1950 gebaut.</i> Nota: Präteritum passivo; oppure <i>ist gebaut worden</i>.',
    ),
    prac('d22', 'Traduci: «La porta è chiusa.»', '<i>Die Tür ist geschlossen.</i> Nota: Zustandspassiv con sein.'),
    prac('d23', 'Traduci: «Aspetto la risposta.»', '<i>Ich warte auf die Antwort.</i> Nota: warten auf + accusativo.'),
    prac(
      'd24',
      'Traduci: «Mi interesso di musica.»',
      '<i>Ich interessiere mich für Musik.</i> Nota: sich interessieren für + accusativo.',
    ),
    prac(
      'd25',
      'Riporta: Er sagte: «Ich habe keine Zeit.»',
      '<i>Er sagte, er habe keine Zeit.</i> Nota: Konjunktiv I.',
    ),
    prac(
      'd26',
      'Riporta: Sie sagten: «Wir kommen morgen.»',
      "<i>Sie sagten, sie würden am nächsten Tag kommen.</i> Nota: «kommen» coincide con l'indicativo, quindi würden + infinito.",
    ),
    prac(
      'd27',
      'Traduci: «Non è solo intelligente, ma anche gentile.»',
      '<i>Er ist nicht nur intelligent, sondern auch nett.</i> Nota: nicht nur … sondern auch.',
    ),
    prac(
      'd28',
      'Traduci: «Più lavoro, più sono stanco.»',
      '<i>Je mehr ich arbeite, desto müder bin ich.</i> Nota: je … desto con comparativi.',
    ),
    prac(
      'd29',
      'Trasforma in stile nominale: «Weil das Wetter schlecht war, blieben wir zu Hause.»',
      '<i>Wegen des schlechten Wetters blieben wir zu Hause.</i> Nota: wegen + genitivo + aggettivo declinato.',
    ),
    prac(
      'd30',
      "Scrivi l'apertura di una lettera al signor Müller.",
      '<i>Sehr geehrter Herr Müller,</i> Nota: virgola, poi testo con la minuscola.',
    ),
    prac(
      'd31',
      'Traduci: «Ho ricevuto un regalo.»',
      '<i>Ich habe ein Geschenk bekommen.</i> Nota: bekommen = ricevere, non Gift.',
    ),
    prac('d32', 'Traduci: «Ho 25 anni e ho fame.»', '<i>Ich bin 25 Jahre alt und habe Hunger.</i> Nota: età con sein.'),
    prac(
      'd33',
      'Scrivi la pronuncia di «Entschuldigung» con la nostra notazione.',
      '[ent-SHUL-di-gung]. Nota: ent- + sh + accento su -schul-.',
    ),
    prac(
      'd34',
      'Distingui «Miete» e «Mitte» scrivendo la pronuncia.',
      '<i>Miete</i> [MI:-të] (affitto), <i>Mitte</i> [MI-të] (centro). Nota: ie = i lunga, tt dopo vocale breve.',
    ),
    prac(
      'd35',
      'Come si dice «pomodoro» in Austria e «carota» in Svizzera?',
      '<i>Paradeiser</i> (AT), <i>Rüebli</i> (CH). Nota: varianti regionali.',
    ),
  ],
)

export const deEsame: CourseModule = mod(
  'de-esame',
  'Esami Goethe / ÖSD, scrittura e prova orale',
  'Formato A2 / B1 / B2, strategie, modelli di scrittura, sezione Pronuncia e prova orale, 40 domande miste',
  'drill',
  `<p class="lead">I due esami più diffusi per il tedesco sono il <b>Goethe-Zertifikat</b> (Goethe-Institut) e l'<b>ÖSD-Zertifikat</b> (Österreichisches Sprachdiplom); esiste anche il <b>telc</b>. Livelli utili qui: <b>A2</b>, <b>B1</b> e <b>B2</b>. Le durate sono indicative: controlla sempre il sito dell'ente prima di prenotare.</p>
${PRON_SHORT}
${PRON_FULL}
<h3>Formato (Goethe-Zertifikat)</h3>
${tbl(
  ['Livello', 'Lesen', 'Hören', 'Schreiben'],
  [
    ['A2', '30 min', 'circa 30 min', '30 min'],
    ['B1', '65 min', 'circa 40 min', '60 min'],
    ['B2', '65 min', 'circa 40 min', '75 min'],
  ],
)}
<p>Il modulo orale (<i>Sprechen</i>) dura circa 15 minuti a ogni livello, spesso in coppia. Quattro moduli (<i>Lesen</i> = lettura, <i>Hören</i> = ascolto, <i>Schreiben</i> = scrittura, <i>Sprechen</i> = orale), che si possono anche dare separatamente. Per superare un modulo servono circa il <b>60%</b> dei punti. L'ÖSD ha struttura molto simile, con le stesse quattro competenze.</p>
<h3>Cosa si chiede nello scritto</h3>
<ul>
<li><b>A2</b>: due testi brevi (SMS o email, circa 30 parole ciascuno).</li>
<li><b>B1</b>: email informale (circa 80 parole), contributo a un forum (circa 80 parole), email formale (circa 40 parole).</li>
<li><b>B2</b>: contributo a un forum (circa 150 parole) e una lettera o email formale (circa 100 parole).</li>
</ul>
<h3>Strategie</h3>
<ol>
<li><b>Hören</b>: prima di ascoltare leggi le domande e sottolinea le parole chiave; cerca sinonimi nel testo.</li>
<li><b>Lesen</b>: leggi il testo una prima volta per l'idea generale, poi cerca la risposta; non fermarti a una parola sconosciuta.</li>
<li><b>Schreiben</b>: tocca tutti i punti della consegna (di solito 3 o 4), usa connettori (<i>deshalb, außerdem, obwohl</i>) e controlla Anrede e Grußformel.</li>
<li><b>Sprechen</b>: rispondi con frasi complete, non fermarti sugli errori, usa formule per prendere tempo.</li>
</ol>
<h3>Modelli di scrittura</h3>
<p><b>Email informale (B1)</b>: <i>Liebe Anna, vielen Dank für deine Einladung. Ich komme gern zu deinem Geburtstag, aber leider kann ich erst um 20 Uhr kommen, weil ich bis 19 Uhr arbeite. Soll ich etwas mitbringen? Viele Grüße, Marco</i></p>
<p><b>Email formale (B1/B2)</b>: <i>Sehr geehrte Damen und Herren, ich habe am 2. November bei Ihnen ein Paket bestellt, es ist aber noch nicht angekommen. Ich bitte Sie, die Lieferung zu prüfen und mir bis zum 15. November zu antworten. Mit freundlichen Grüßen, Marco Rossi</i></p>
<p><b>Forum (B2)</b>: struttura in quattro parti: apertura (<i>Zu diesem Thema möchte ich Folgendes sagen</i>), argomento a favore, argomento contro, conclusione personale (<i>Meiner Meinung nach …</i>).</p>
<h3>Pronuncia e prova orale</h3>
<p>All'orale la pronuncia non deve essere «da nativo», ma <b>comprensibile</b>: gli esaminatori valutano <i>Aussprache</i> (suoni e accento), <i>Wortakzent</i> (accento di parola) e <i>Satzmelodie</i> (intonazione). L'accento regionale (italiano, austriaco, svizzero) è accettato se non ostacola la comprensione.</p>
${vsec('Gli errori di suono più frequenti', [
  ['ich / ach', 'iç / ach', 'ç dopo i ed e, ch dopo a, o, u, au'],
  ['Küche / Kuchen', 'KÜ-çë / KU:-chën', 'ü ≠ u'],
  ['schön / schon', 'SHÖ:N / SHO:N', 'ö ≠ o'],
  ['Wein / Wien', 'VAIN / VI:N', 'ei ≠ ie'],
  ['Stadt / Staat', 'SHTAT / SHTA:T', 'vocale breve / lunga'],
  ['Tag / Tage', 'TA:K / TA:-gë', 'g finale = k'],
  ['Sprache', 'SHPRA:-chë', 'sp iniziale = shp'],
  ['Zeit', 'TSAIT', 'z = ts'],
])}
<h3>Accento che cambia il significato</h3>
<p>Nei verbi con prefisso <b>separabile</b> l'accento cade sul prefisso; in quelli <b>inseparabili</b> sul verbo. Alcune parole hanno entrambe le forme con significati diversi:</p>
${vsec('Coppie da sapere', [
  ['ÜBERsetzen (separabile)', 'Ü:-ba-ze-tsën', 'traghettare (con un barca)'],
  ['überSETZEN (inseparabile)', 'ü:-ba-ZE-tsën', 'tradurre'],
  ['UMfahren (separabile)', 'UM-fa:-rën', 'investire (mettere sotto)'],
  ['umFAHren (inseparabile)', 'um-FA:-rën', 'aggirare (con un veicolo)'],
  ['WIEderholen (separabile)', 'VI:-da-ho:-lën', 'riportare indietro'],
  ['wiederHOlen (inseparabile)', 'vi-da-HO:-lën', 'ripetere'],
  ['MOdern', 'MO:-dërn', 'marcire, decomporsi (verbo)'],
  ['moDERN', 'mo-DERN', 'moderno'],
  ['der AUgust', 'AU-gust', 'il nome proprio August'],
  ['der auGUST', 'au-GUST', 'il mese di agosto'],
])}
<p>Nota: nell'ortografia la differenza non si vede (<i>übersetzen</i>); si capisce dal senso e dalla sintassi. Un verbo separabile si divide: <i>Er setzt uns über.</i> (traghetta); inseparabile no: <i>Er übersetzt den Text.</i></p>
<h3>Intonazione (Satzmelodie)</h3>
<ul>
<li><b>Affermazioni</b>: la voce scende alla fine. <i>Ich komme aus Italien.</i> [iç KO-më aus i-TA:-liën]</li>
<li><b>Domande sì/no</b>: la voce sale. <i>Kommst du morgen?</i> [KOMST du MOR-gën]</li>
<li><b>Domande con parola interrogativa</b>: scendono. <i>Wo wohnen Sie?</i> [vo: VO:-nën zi:]</li>
<li>Tra una frase e l'altra fai una breve pausa; non allungare le consonanti doppie come in italiano.</li>
</ul>
<h3>Formule per l'orale</h3>
${vsec('Per prendere tempo, chiedere, concludere', [
  ['Das ist eine gute Frage.', 'das ist AI-në GU:-të FRA:-gë', 'È una buona domanda.'],
  ['Ich würde sagen, dass …', 'iç VÜR-dë ZA:-gën, das', 'Direi che …'],
  ['Wie meinen Sie das?', 'vi: MAI-nën zi: das', 'Cosa intende?'],
  ['Könnten Sie das bitte wiederholen?', 'KÖN-tën zi: das BI-të vi-da-HO:-lën', 'Potrebbe ripeterlo?'],
  ['Zum Schluss möchte ich sagen, dass …', 'tsum SHLUS MÖÇ-të iç ZA:-gën, das', 'In conclusione vorrei dire che …'],
  ['Ich bin ganz Ihrer Meinung.', 'iç bin GANTS I:-rër MAI-nung', "Sono pienamente d'accordo con Lei."],
])}
<h3>Errori di pronuncia tipici degli italiani</h3>
<ul>
<li><b>h</b> iniziale: va aspirata (<i>Haus</i> [HAUS]), non muta come in italiano.</li>
<li><b>Consonanti doppie</b>: non si allungano (<i>Mitte</i> [MI-të], <i>kommen</i> [KO-mën]).</li>
<li><b>-e finale</b>: debole (ë), non una e piena; <b>-er</b> suona «a».</li>
<li><b>s</b> iniziale davanti a vocale: sonora (<i>Sonne</i> [ZO-në]) in Germania.</li>
<li><b>z</b> = ts e <b>w</b> = v: <i>Zeit</i> [TSAIT], <i>Wasser</i> [VA-ssa].</li>
<li><b>ü ö</b>: labbra tonde, mai u o.</li>
<li><b>ch</b>: due suoni (ç e ch); <b>ng</b>: un solo suono nasale, senza g.</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>Nello scritto non usare abbreviazioni da SMS (<i>hdl, mfg</i>) in un'email formale.</li>
<li>Rispondi alla consegna, non solo alla domanda che ti sembra più interessante.</li>
<li>Non cercare la parola perfetta: parafrasa («das Ding, mit dem man schreibt» per <i>Stift</i>).</li>
<li>Le date si dicono in ordinali: <i>der sechste November</i> [de:r ZEK-stë no-VEM-ba].</li>
</ul>
<div class="say"><b>Da ricordare.</b> Quattro moduli: Lesen, Hören, Schreiben, Sprechen. Scritto: tutti i punti, connettori, Anrede e Grußformel. Orale: frasi complete, intonazione giusta, comprensibile.</div>`,
  [
    q(
      'q1',
      'Completa: «Ich gehe zur Arbeit, ___ ich krank bin.»',
      ['obwohl', 'damit', 'bevor', 'sodass'],
      0,
      "Il senso è concessivo: sono malato ma lavoro lo stesso. Damit esprime uno scopo, bevor un'anteriorità e sodass una conseguenza.",
    ),
    q(
      'q2',
      'Completa: «Er arbeitet viel, ___ seine Kinder studieren können.»',
      ['damit', 'um', 'ohne', 'trotz'],
      0,
      'I soggetti sono diversi (lui, i bambini), quindi serve damit. Um … zu vuole lo stesso soggetto e trotz è una preposizione.',
    ),
    q(
      'q3',
      'Completa: «Ich spare Geld, ___ ein Auto zu kaufen.»',
      ['um', 'damit', 'weil', 'während'],
      0,
      'Stesso soggetto e infinito con zu: um … zu. Damit e weil richiederebbero un verbo coniugato.',
    ),
    q(
      'q4',
      'Completa: «Das ist der Mann, ___ ich gestern gesehen habe.»',
      ['den', 'der', 'dem', 'dessen'],
      0,
      "Sehen regge l'accusativo e Mann è maschile: den. Der sarebbe nominativo, dem dativo e dessen genitivo.",
    ),
    q(
      'q5',
      'Completa: «Die Frau, ___ Sohn Arzt ist, wohnt hier.»',
      ['deren', 'dessen', 'der', 'die'],
      0,
      "È un genitivo femminile (il cui figlio): deren. Dessen si usa per maschile e neutro e dopo non c'è articolo.",
    ),
    q(
      'q6',
      'Completa: «Trotz ___ Regens gehen wir spazieren.»',
      ['des', 'dem', 'der', 'den'],
      0,
      'Trotz regge il genitivo e Regen è maschile: des Regens. Il dativo dem è un uso colloquiale.',
    ),
    q(
      'q7',
      'Completa: «Sie trägt eine ___ Jacke.» (neu)',
      ['neue', 'neuen', 'neuer', 'neues'],
      0,
      "Dopo eine (accusativo femminile) l'aggettivo prende -e. Neuen è per dativo o maschile accusativo.",
    ),
    q(
      'q8',
      'Completa: «Ich spreche mit dem ___ Chef.» (neu)',
      ['neuen', 'neue', 'neuer', 'neues'],
      0,
      'Dopo dem (dativo maschile) tutti gli aggettivi finiscono in -en. Neue sarebbe nominativo femminile.',
    ),
    q(
      'q9',
      'Completa: «Mein Bruder ist ___ als ich.» (groß)',
      ['größer', 'am größten', 'so groß', 'große'],
      0,
      'Il confronto di maggioranza usa il comparativo + als. Am größten è il superlativo e so groß vuole wie.',
    ),
    q(
      'q10',
      'Completa: «Als wir ankamen, ___ der Film schon begonnen.»',
      ['hatte', 'hat', 'wurde', 'war'],
      0,
      'Il film era già iniziato prima: Plusquamperfekt con hatte + begonnen. Hat è Perfekt, war non va con beginnen.',
    ),
    q(
      'q11',
      'Completa: «Ich ___ nach Hause gegangen.»',
      ['bin', 'habe', 'werde', 'hatte'],
      0,
      'Gehen è un verbo di movimento e prende sein: ich bin gegangen. Habe e hatte sarebbero scorretti.',
    ),
    q(
      'q12',
      'Completa: «Wenn ich reich ___, würde ich reisen.»',
      ['wäre', 'bin', 'war', 'sei'],
      0,
      "Nell'ipotesi irreale si usa il Konjunktiv II di sein: wäre. Bin e war sono indicativi, sei è Konjunktiv I.",
    ),
    q(
      'q13',
      'Completa: «Wenn ich Zeit gehabt hätte, ___ ich gekommen.»',
      ['wäre', 'hätte', 'würde', 'war'],
      0,
      'Kommen prende sein, quindi nella conseguenza passata irreale: wäre gekommen. Hätte vuole un verbo con haben.',
    ),
    q(
      'q14',
      'Completa: «___ Sie mir bitte helfen?» (cortese)',
      ['Könnten', 'Konnten', 'Kannst', 'Können Sie'],
      0,
      'Il Konjunktiv II könnten rende la richiesta più cortese. Konnten è un passato e kannst è seconda persona del tu.',
    ),
    q(
      'q15',
      'Completa: «Das Haus ___ 1990 gebaut.»',
      ['wurde', 'wird', 'ist', 'hat'],
      0,
      'Il passivo al passato si forma con wurde + participio. Wird è presente, ist darebbe uno stato.',
    ),
    q(
      'q16',
      'Completa: «Das Auto ist repariert ___.»',
      ['worden', 'geworden', 'werden', 'wurde'],
      0,
      'Nel Perfekt passivo il participio di werden è worden. Geworden significa diventato quando werden è verbo pieno.',
    ),
    q(
      'q17',
      'Completa: «Ich freue mich ___ das Wochenende.» (futuro)',
      ['auf', 'über', 'an', 'für'],
      0,
      'Per la gioia che riguarda il futuro si usa sich freuen auf. Über si riferisce a qualcosa di presente o passato.',
    ),
    q(
      'q18',
      'Completa: «Er wartet ___ den Bus.»',
      ['auf', 'an', 'für', 'bei'],
      0,
      'Warten regge auf + accusativo. In italiano «aspettare» non ha preposizione: è un errore tipico.',
    ),
    q(
      'q19',
      'Completa: «Er sagt, er ___ krank.» (stile giornalistico)',
      ['sei', 'ist', 'wäre', 'sein'],
      0,
      "Nel discorso indiretto formale si usa il Konjunktiv I: sei. Ist è l'indicativo colloquiale.",
    ),
    q(
      'q20',
      'Completa: «Sie sagte, sie ___ gestern gearbeitet.»',
      ['habe', 'hat', 'hatte', 'habt'],
      0,
      'Un fatto anteriore al discorso riportato prende habe + participio. Hat è indicativo, habt seconda persona plurale.',
    ),
    q(
      'q21',
      'Completa: «Es regnet. ___ gehen wir spazieren.»',
      ['Trotzdem', 'Obwohl', 'Weil', 'Dass'],
      0,
      'Trotzdem è un avverbio concessivo con inversione del verbo. Obwohl, weil e dass vogliono il verbo in fondo.',
    ),
    q(
      'q22',
      'Completa: «Sie spricht nicht nur Deutsch, ___ auch Französisch.»',
      ['sondern', 'aber', 'doch', 'oder'],
      0,
      "La coppia fissa è nicht nur … sondern auch. Aber introduce un'opposizione diversa.",
    ),
    q(
      'q23',
      'Completa: «___ mehr ich lerne, desto besser verstehe ich.»',
      ['Je', 'Wie', 'Als', 'Mehr'],
      0,
      'La struttura è je + comparativo, desto + comparativo. Le altre forme non sono usate in questo costrutto.',
    ),
    q(
      'q24',
      'Che cosa significa «Komm doch mit!»?',
      ['Dai, vieni con noi!', 'Vieni solo con noi.', 'Non venire con noi.', 'Sei venuto con noi?'],
      0,
      'La particella doch in un imperativo è un invito insistente e amichevole. Non nega, non chiede informazioni.',
    ),
    q(
      'q25',
      'Qual è la chiusura corretta di una email formale?',
      ['Mit freundlichen Grüßen', 'Bis später, tschüss', 'Liebe Grüße', 'Viel Spaß noch'],
      0,
      'Mit freundlichen Grüßen è la formula standard formale. Le altre sono informali e non vanno usate con un ufficio.',
    ),
    q(
      'q26',
      'Come si dice «pomodoro» in Austria?',
      ['Paradeiser', 'Topfen', 'Marille', 'Rüebli'],
      0,
      "In Austria il pomodoro è Paradeiser. Topfen è il quark, Marille l'albicocca e Rüebli la carota svizzera.",
    ),
    q(
      'q27',
      'Che cosa significa «das Gift»?',
      ['veleno', 'regalo', 'gift card', 'colla'],
      0,
      'Das Gift è il veleno: il regalo si dice Geschenk. È uno dei falsi amici più noti.',
    ),
    q(
      'q28',
      'Che cosa significa «bekommen»?',
      ['ricevere', 'diventare', 'comprare', 'prendere in prestito'],
      0,
      'Bekommen è ricevere. Diventare è werden, comprare è kaufen.',
    ),
    q(
      'q29',
      'Come si dice «Ho 30 anni»?',
      ['Ich bin 30 Jahre alt.', 'Ich habe 30 Jahre.', 'Mir ist 30 Jahre.', 'Ich werde 30 Jahre.'],
      0,
      "In tedesco l'età si esprime con sein. Habe + Jahre è calco dall'italiano e werde indica compiere gli anni.",
    ),
    q(
      'q30',
      'Che cosa significa «das Gleis»?',
      ['il binario', 'il ghiaccio', 'la lama', 'la rotaia del tram'],
      0,
      "Das Gleis è il binario. Il ghiaccio è das Eis, e la parola è un falso amico con l'inglese.",
    ),
    q(
      'q31',
      'Qual è il plurale di «das Kind»?',
      ['die Kinder', 'die Kinde', 'die Kinds', 'die Kindern'],
      0,
      'Kind forma il plurale in -er. Kindern è solo il dativo plurale.',
    ),
    q(
      'q32',
      'Come si dice «il burro»?',
      ['die Butter', 'der Butter', 'das Butter', 'der Burro'],
      0,
      'Butter è femminile in tedesco standard. Der Butter è dialettale.',
    ),
    q(
      'q33',
      'Quanti moduli prevede il Goethe-Zertifikat B1?',
      ['quattro', 'due', 'tre', 'cinque'],
      0,
      'I moduli sono quattro: Lesen, Hören, Schreiben e Sprechen. Ognuno si può sostenere anche separatamente.',
    ),
    q(
      'q34',
      'Che cosa è utile fare prima di una prova di Hören?',
      [
        'leggere le domande e sottolineare le parole chiave',
        'chiudere gli occhi e rilassarsi',
        'tradurre mentalmente ogni parola',
        'scrivere subito la risposta finale',
      ],
      0,
      "Leggere le domande prima orienta l'ascolto sulle informazioni da cercare. Tradurre parola per parola fa perdere il filo.",
    ),
    q(
      'q35',
      'Come si pronuncia «Wein» (vino)?',
      ['[VAIN]', '[VI:N]', '[WAIN]', '[VEIN]'],
      0,
      'Ei si legge «ai» e la w tedesca vale v. [VI:N] è invece Wien, la capitale austriaca.',
    ),
    q(
      'q36',
      'ÜBERsetzen (accento su über-) significa:',
      ['traghettare', 'tradurre', 'sostituire', 'riposare'],
      0,
      "Con l'accento sul prefisso il verbo è separabile e indica passare dall'altra sponda. Tradurre è überSETZEN.",
    ),
    q(
      'q37',
      'Come si pronuncia «Mitte» (centro)?',
      ['[MI-të]', '[MIT-te]', '[MI:-të]', '[MI-tte]'],
      0,
      'La doppia t segnala solo la i breve e non si allunga come in italiano. Con la i lunga sarebbe Miete (affitto).',
    ),
    q(
      'q38',
      'Come si pronuncia «ich»?',
      ['[iç]', '[ik]', '[ish]', '[ich]'],
      0,
      'Dopo i il ch è il suono debole [ç], come una i sussurrata. Il suono [ch] raschiato si usa solo dopo a, o, u.',
    ),
    q(
      'q39',
      'Come si pronuncia «Straße»?',
      ['[SHTRA:-ssë]', '[STRA:-zë]', '[SHTRA-së]', '[STRAS-së]'],
      0,
      'St iniziale si legge sht, a è lunga, ß vale ss sorda e la -e finale è debole. La s sonora non va qui.',
    ),
    q(
      'q40',
      'Come si pronuncia «Tag»?',
      ['[TA:K]', '[TAG]', '[TA:G]', '[TAK]'],
      0,
      "La g a fine parola si indurisce in k e la a è lunga. [TAG] sarebbe una lettura all'italiana.",
    ),
  ],
  [
    card(
      'c1',
      'Goethe-Zertifikat / ÖSD / telc',
      'Esami riconosciuti di tedesco a livelli A1-C2. Quattro competenze: Lesen, Hören, Schreiben, Sprechen.',
    ),
    card(
      'c2',
      'Lesen / Hören / Schreiben / Sprechen',
      'lettura / ascolto / scrittura / orale [LE:-zën / HÖ:-rën / SHRAI-bën / SHPRE-çën].',
    ),
    card('c3', 'Sehr geehrte Damen und Herren, … Mit freundlichen Grüßen', "Apertura e chiusura di un'email formale."),
    card('c4', 'Soglia di superamento', "Circa il 60% per modulo (Goethe). Verifica sul sito dell'ente."),
    card('c5', 'Pausa e intonazione', 'Affermazione: voce giù. Domanda sì/no: voce su. Domanda aperta: voce giù.'),
    card('c6', 'ÜBERsetzen / überSETZEN', 'traghettare / tradurre [Ü:-ba-ze-tsën / ü:-ba-ZE-tsën].'),
    card('c7', 'der AUgust / der auGUST', 'il nome proprio / il mese [AU-gust / au-GUST].'),
    card('c8', 'Formule orali', '<i>Das ist eine gute Frage. Ich würde sagen, dass … Wie meinen Sie das?</i>'),
  ],
  [
    prac(
      'p1',
      'Scrivi una breve email informale (80 parole) per rifiutare un invito.',
      'Esempio: <i>Liebe Anna, vielen Dank für die Einladung. Leider kann ich nicht kommen, weil ich am Samstag arbeiten muss. Ich wünsche dir einen schönen Abend! Wollen wir uns nächste Woche treffen? Liebe Grüße, Marco</i> Nota: Anrede, motivo con weil, proposta, chiusura.',
    ),
    prac(
      'p2',
      "Scrivi un'email formale (40 parole) per chiedere informazioni su un corso.",
      'Esempio: <i>Sehr geehrte Damen und Herren, ich interessiere mich für Ihren Deutschkurs. Könnten Sie mir bitte Informationen zu Preisen und Terminen schicken? Vielen Dank im Voraus. Mit freundlichen Grüßen, Marco Rossi</i>',
    ),
    prac(
      'p3',
      "Presenta te stesso all'orale (4 frasi).",
      'Esempio: <i>Ich heiße Marco und komme aus Mailand. Ich arbeite als Informatiker in einer Firma. In meiner Freizeit lese ich gern und gehe wandern. Ich lerne Deutsch, weil ich in Wien arbeiten möchte.</i>',
    ),
    prac(
      'p4',
      'Scrivi la pronuncia di «übersetzen» nei due significati.',
      '<i>ÜBERsetzen</i> [Ü:-ba-ze-tsën] (traghettare); <i>überSETZEN</i> [ü:-ba-ZE-tsën] (tradurre). Nota: il secondo è inseparabile, <i>Ich übersetze den Text.</i>',
    ),
    prac(
      'p5',
      'Elenca tre errori di pronuncia tipici degli italiani e come correggerli.',
      '<i>1. h iniziale muta → aspirala (Haus). 2. doppie allungate → breve (Mitte [MI-të]). 3. ü pronunciata u → labbra tonde, i detta (Küche [KÜ-çë]).</i>',
    ),
  ],
)
