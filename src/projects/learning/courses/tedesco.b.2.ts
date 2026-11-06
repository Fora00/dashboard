import type { CourseModule } from '../types'
import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT, vsec } from './tedesco.pron'
import { tbl } from './tedesco.b.util'

export const dePlusquam: CourseModule = mod(
  'de-plusquam',
  'Plusquamperfekt, Futur II e tempi del racconto',
  'hatte/war + participio, werden + participio + haben/sein, nachdem, als/wenn, Präteritum dei verbi forti',
  'b1',
  `<p class="lead">Per raccontare in tedesco servono tre tempi del passato: il <b>Perfekt</b> (parlato), il <b>Präteritum</b> (scritto e racconti) e il <b>Plusquamperfekt</b> (un fatto prima di un altro fatto passato). Qui impari il Plusquamperfekt, il Futur II, la concordanza con <i>nachdem</i> e a leggere i verbi forti dei testi.</p>
${PRON_SHORT}
<p><i>Nota: «ng» è un solo suono nasale (come in «sing» inglese), la g non si sente: ging [GING], Zeitung [TSAI-tung].</i></p>
<h3>Plusquamperfekt: hatte / war + participio</h3>
<p>L'ausiliare va al <b>Präteritum</b> (hatte o war) e il participio in fondo. L'ausiliare è lo stesso del Perfekt: <b>haben</b> per la maggior parte dei verbi, <b>sein</b> per movimento, cambiamento di stato, <i>sein, bleiben, werden</i>.</p>
${tbl(
  ['Persona', 'haben', 'sein'],
  [
    ['ich', 'hatte gemacht', 'war gegangen'],
    ['du', 'hattest', 'warst'],
    ['er / sie / es', 'hatte', 'war'],
    ['wir / sie / Sie', 'hatten', 'waren'],
    ['ihr', 'hattet', 'wart'],
  ],
)}
<p>Pronuncia: <i>hatte</i> [HA-të], <i>hattest</i> [HA-tëst], <i>war</i> [VA:r], <i>warst</i> [VA:rst], <i>waren</i> [VA:-rën], <i>wart</i> [VA:rt].</p>
${vsec('Esempi', [
  [
    'Als ich ankam, war der Zug schon abgefahren.',
    'als iç AN-ka:m, va:r de:r TSU:K shon AP-gë-fa:-rën',
    'Quando arrivai, il treno era già partito.',
  ],
  [
    'Sie war müde, weil sie nicht geschlafen hatte.',
    'zi: va:r MÜ:-dë, vail zi: niçt gë-SHLA:-fën HA-të',
    'Era stanca perché non aveva dormito.',
  ],
  [
    'Nachdem er gegessen hatte, trank er einen Kaffee.',
    'nach-DE:m e:r gë-GE-ssën HA-të, TRANK e:r AI-nën KA-fe',
    'Dopo aver mangiato, bevve un caffè.',
  ],
])}
<h3>nachdem e concordanza dei tempi</h3>
<p>Dopo <b>nachdem</b> l'azione è <b>anteriore</b>: Plusquamperfekt + Präteritum (racconto) oppure <b>Perfekt + Präsens</b> (parlato). Non si mescolano: «Nachdem ich gegessen <b>habe</b>, <b>gehe</b> ich spazieren.»</p>
${tbl(
  ['Principale', 'dopo nachdem'],
  [
    ['Präteritum (ging)', 'Plusquamperfekt (hatte gegessen)'],
    ['Präsens (gehe)', 'Perfekt (habe gegessen)'],
    ['Futur / Präsens (gehe)', 'Perfekt (habe gegessen)'],
  ],
)}
<p><b>als / wenn / wann:</b> <i>als</i> = «quando» per un fatto singolo nel passato; <i>wenn</i> = «quando/ogni volta che/se» per presente, futuro e abitudini; <i>wann</i> = «quando?» nelle domande. «Als ich Kind war, wohnte ich in Mailand.» [als iç KINT va:r, VO:N-të iç in mai-LANT]; «Wenn es regnet, bleibe ich zu Hause.»</p>
<h3>Futur II: werden + participio + haben/sein</h3>
<p>Raro ma utile: indica un'azione <b>conclusa nel futuro</b> o una <b>supposizione sul passato</b>. Nel parlato si preferisce il Perfekt con un avverbio (<i>schon, bis</i>).</p>
${vsec('Futur II', [
  [
    'Bis Freitag werde ich den Bericht geschrieben haben.',
    'bis FRAI-ta:k VER-dë iç de:n bë-RIÇT gë-SHRI:-bën HA:-bën',
    'Entro venerdì avrò scritto il rapporto.',
  ],
  ['Er wird den Bus verpasst haben.', 'e:r virt de:n BUS fer-PAST HA:-bën', "Avrà perso l'autobus."],
])}
<h3>Verbi forti nei testi: Präteritum e participio</h3>
<p>Nei testi scritti (giornali, romanzi, fiabe) incontri il Präteritum. I verbi forti cambiano la vocale della radice; i deboli aggiungono <b>-te</b> (<i>machte</i> [MACH-të], <i>arbeitete</i> [AR-bai-të-të]). Il Partizip II dei forti finisce in <b>-en</b>.</p>
${vsec('Forme da riconoscere', [
  ['gehen – ging – gegangen', 'GE:-ën – GING – gë-GA-ngën', 'andare'],
  ['kommen – kam – gekommen', 'KO-mën – KA:M – gë-KO-mën', 'venire'],
  ['sehen – sah – gesehen', 'ZE:-ën – ZA: – gë-ZE:-ën', 'vedere'],
  ['nehmen – nahm – genommen', 'NE:-mën – NA:M – gë-NO-mën', 'prendere'],
  ['geben – gab – gegeben', 'GE:-bën – GA:P – gë-GE:-bën', 'dare'],
  ['finden – fand – gefunden', 'FIN-dën – FANT – gë-FUN-dën', 'trovare'],
  ['bleiben – blieb – geblieben', 'BLAI-bën – BLI:P – gë-BLI:-bën', 'restare'],
  ['schreiben – schrieb – geschrieben', 'SHRAI-bën – SHRI:P – gë-SHRI:-bën', 'scrivere'],
  ['sprechen – sprach – gesprochen', 'SHPRE-çën – SHPRA:CH – gë-SHPRO-chën', 'parlare'],
  ['fahren – fuhr – gefahren', 'FA:-rën – FU:R – gë-FA:-rën', 'andare (con mezzo)'],
  ['essen – aß – gegessen', 'E-ssën – A:SS – gë-GE-ssën', 'mangiare'],
  ['trinken – trank – getrunken', 'TRIN-kën – TRANK – gë-TRUN-kën', 'bere'],
  ['schlafen – schlief – geschlafen', 'SHLA:-fën – SHLI:F – gë-SHLA:-fën', 'dormire'],
  ['helfen – half – geholfen', 'HEL-fën – HALF – gë-HOL-fën', 'aiutare'],
  ['stehen – stand – gestanden', 'SHTE:-ën – SHTANT – gë-SHTAN-dën', 'stare in piedi'],
  ['lesen – las – gelesen', 'LE:-zën – LA:S – gë-LE:-zën', 'leggere'],
  ['treffen – traf – getroffen', 'TRE-fën – TRA:F – gë-TRO-fën', 'incontrare'],
  ['denken – dachte – gedacht', 'DEN-kën – DACH-të – gë-DACHT', 'pensare (misto)'],
  ['bringen – brachte – gebracht', 'BRI-ngën – BRACH-të – gë-BRACHT', 'portare (misto)'],
  ['wissen – wusste – gewusst', 'VI-ssën – VUS-të – gë-VUST', 'sapere (misto)'],
])}
<h3>Leggere un racconto</h3>
<p>«Gestern Abend kam Anna spät nach Hause. Sie hatte den ganzen Tag gearbeitet und war sehr müde. Sie aß nur ein Brot, trank ein Glas Wasser und ging sofort ins Bett.»</p>
<p><i>[GES-tërn A:-bënt KA:M A-na SHPE:T na:ch HAU-zë. zi: HA-të de:n GAN-tsën TA:K gë-AR-bai-tët unt VA:R ze:r MÜ:-dë. zi: A:SS nu:r ain BRO:T, TRANK ain GLA:S VA-ssa unt GING zo-FORT ins BET.]</i></p>
<p>Anna tornò tardi a casa. Aveva lavorato tutto il giorno ed era molto stanca. Mangiò solo un pezzo di pane, bevve un bicchiere d'acqua e andò subito a letto. Il Plusquamperfekt (<i>hatte gearbeitet</i>) dà lo sfondo <b>prima</b> dei fatti narrati al Präteritum.</p>
<p>Nell'inizio delle fiabe: «Es war einmal ein König, der hatte drei Töchter.» [es va:r AIN-ma:l ain KÖ:-niç, de:r HA-të drai TÖÇ-ta].</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>L'italiano ha <b>passato prossimo / remoto / imperfetto</b>, il tedesco quasi solo Perfekt e Präteritum: <i>ich ging</i> può essere «andai» o «andavo». Nel parlato usa il <b>Perfekt</b>, tranne per <i>war, hatte, konnte, wollte, musste</i>.</li>
<li><b>Ausiliare:</b> «Sono andato» = <i>ich bin gegangen</i>, mai «ich habe gegangen». Movimento e cambiamento di stato prendono <i>sein</i>.</li>
<li>«Era già partito» = <i>war schon abgefahren</i> (sein), non «hatte abgefahren».</li>
<li>Il futuro anteriore di supposizione «sarà arrivato» si dice meglio <i>er ist wohl schon angekommen</i> che con il Futur II.</li>
<li>Nel sud (Baviera, Austria, Svizzera) il Präteritum quasi non si parla: solo Perfekt.</li>
</ul>
<div class="say"><b>Da ricordare.</b> Prima di un fatto passato: <i>hatte/war + Partizip II</i>. <i>Nachdem ich gegessen hatte, ging ich...</i> / <i>Nachdem ich gegessen habe, gehe ich...</i> Un fatto singolo nel passato: <i>als</i>.</div>`,
  [
    q(
      'q1',
      'Completa: «Als ich ankam, ___ der Film schon begonnen.»',
      ['hatte', 'war', 'wurde', 'hat'],
      0,
      'Il film era iniziato prima del mio arrivo, serve il Plusquamperfekt. Beginnen prende haben, quindi hatte; war sarebbe giusto con un verbo di movimento.',
    ),
    q(
      'q2',
      'Completa: «Nachdem sie gegessen ___, ging sie spazieren.»',
      ['hatte', 'hat', 'war', 'hatten'],
      0,
      'Con la principale al Präteritum (ging), dopo nachdem va il Plusquamperfekt: hatte gegessen. Hat sarebbe Perfekt e starebbe con un Präsens.',
    ),
    q(
      'q3',
      'Qual è la frase corretta?',
      [
        'Er ist gestern nach Hause gegangen.',
        'Er hat gestern nach Hause gegangen.',
        'Er ist gestern nach Hause gegehen.',
        'Er hat gestern nach Hause gegehen.',
      ],
      0,
      "Gehen è un verbo di movimento e prende sein; il participio è gegangen. Le altre combinazioni sbagliano l'ausiliare o la forma del participio.",
    ),
    q(
      'q4',
      'Completa: «Bis morgen ___ ich den Text gelesen haben.»',
      ['werde', 'würde', 'wurde', 'habe'],
      0,
      'Il Futur II si forma con werden al presente: werde + participio + haben. Würde è condizionale e wurde è il passato di werden, non adatti qui.',
    ),
    q(
      'q5',
      'Completa: «___ ich gestern nach Hause kam, regnete es.»',
      ['Als', 'Wenn', 'Wann', 'Ob'],
      0,
      'Un evento singolo nel passato si introduce con als. Wenn è per presente, futuro e abitudini; wann è una domanda e ob significa se.',
    ),
    q(
      'q6',
      'Qual è il Präteritum di «fahren» (andare con un mezzo)?',
      ['fuhr', 'fahrte', 'fuhrte', 'fahr'],
      0,
      'Fahren è un verbo forte: cambia vocale (a diventa u) e non aggiunge -te. Fahrte è una forma debole che non esiste.',
    ),
    q(
      'q7',
      'Come si pronuncia «Töchter» (figlie)?',
      ['[TÖÇ-ta]', '[TO:CH-ter]', '[TÖ:K-ter]', '[TOCH-tër]'],
      0,
      "Ö è breve, ch dopo ö è l'ich-Laut [ç] e la -er finale suona «a». Il suono di «Bach» si usa solo dopo a, o, u, au.",
    ),
    q(
      'q8',
      'Come si pronuncia «gewesen» (stato)?',
      ['[gë-VE:-zën]', '[gë-VE:-sën]', '[ge-VE-zen]', '[gë-WE:-zën]'],
      0,
      'Il prefisso ge- è debole (ë), la w vale v, la e è lunga e la s tra vocali è sonora [z]. Con la s sorda sarebbe un errore.',
    ),
    q(
      'q9',
      'Come si pronuncia «ging» (andò, andava)?',
      ['[GING]', '[GIN-gë]', '[GI:NG]', '[JING]'],
      0,
      'Ng è un solo suono nasale e la g non si pronuncia separatamente. La i è breve, la g iniziale è dura come in «gatto».',
    ),
  ],
  [
    card(
      'c1',
      'Plusquamperfekt',
      '<i>hatte / war</i> + Partizip II: <i>Ich hatte gegessen. Er war gegangen.</i> Un fatto prima di un altro passato.',
    ),
    card(
      'c2',
      'Futur II',
      '<i>werde + Partizip II + haben/sein</i>: <i>Bis Freitag werde ich fertig gewesen sein.</i> Anche supposizione sul passato.',
    ),
    card('c3', 'nachdem [nach-DE:m]', 'dopo che. Plusquamperfekt + Präteritum, oppure Perfekt + Präsens.'),
    card(
      'c4',
      'als / wenn / wann',
      'als = quando, fatto singolo nel passato; wenn = quando/se (abitudine, futuro); wann = quando? (domanda).',
    ),
    card('c5', 'gehen – ging – gegangen [GE:-ën – GING – gë-GA-ngën]', 'andare. Ausiliare sein.'),
    card('c6', 'sehen – sah – gesehen [ZE:-ën – ZA: – gë-ZE:-ën]', 'vedere. Ausiliare haben.'),
    card('c7', 'wissen – wusste – gewusst [VI-ssën – VUS-të – gë-VUST]', 'sapere (verbo misto).'),
    card(
      'c8',
      'sein o haben?',
      'sein: movimento, cambio di stato, sein, bleiben, werden. haben: tutto il resto. <i>Ich bin gegangen</i>, mai <i>habe gegangen</i>.',
    ),
    card(
      'c9',
      'Parlato o scritto?',
      'Parlato: Perfekt, ma Präteritum di sein, haben, modali. Scritto e racconti: Präteritum.',
    ),
  ],
  [
    prac(
      'p1',
      'Traduci: «Quando sono arrivato, il treno era già partito.»',
      '<i>Als ich ankam, war der Zug schon abgefahren.</i> Nota: als + Präteritum, poi war + Partizip II di un verbo di movimento.',
    ),
    prac(
      'p2',
      'Traduci: «Dopo che aveva mangiato, è andato a letto.» (racconto)',
      '<i>Nachdem er gegessen hatte, ging er ins Bett.</i> Nota: Plusquamperfekt nella subordinata, Präteritum nella principale.',
    ),
    prac(
      'p3',
      'Correggi: «Ich habe nach Hause gegangen.»',
      '<i>Ich bin nach Hause gegangen.</i> Nota: gehen = movimento, ausiliare sein.',
    ),
    prac(
      'p4',
      'Scrivi il Präteritum e il Partizip II di: sprechen, nehmen, finden.',
      '<i>sprechen – sprach – gesprochen; nehmen – nahm – genommen; finden – fand – gefunden.</i> Nota: tutti forti, il participio finisce in -en.',
    ),
    prac(
      'p5',
      'Produzione: racconta in tre frasi cosa avevi fatto prima di uscire stamattina (usa il Plusquamperfekt almeno una volta).',
      'Esempio: <i>Bevor ich das Haus verließ, hatte ich gefrühstückt. Ich hatte auch meine E-Mails gelesen. Dann ging ich zur Arbeit.</i>',
    ),
  ],
)

export const deKonj2: CourseModule = mod(
  'de-konj2',
  'Konjunktiv II e periodo ipotetico',
  'Formazione, würde-Form, wenn … würde, desideri irreali, als ob, cortesia e consiglio',
  'b1',
  `<p class="lead">Il <b>Konjunktiv II</b> esprime ciò che è <b>irreale, ipotetico o cortese</b>: «se avessi tempo...», «vorrei...», «dovresti...». È il condizionale e il congiuntivo imperfetto italiani insieme. Nel parlato si usa soprattutto per <i>sein, haben</i>, i modali e con <b>würde + infinito</b>.</p>
${PRON_SHORT}
<h3>Formazione</h3>
<p>Si parte dal <b>Präteritum</b>, si aggiunge l'<b>Umlaut</b> (a, o, u diventano ä, ö, ü) e la desinenza <b>-e</b> (-e, -est, -e, -en, -et, -en).</p>
${tbl(
  ['Persona', 'sein', 'haben', 'werden'],
  [
    ['ich', 'wäre', 'hätte', 'würde'],
    ['du', 'wärst', 'hättest', 'würdest'],
    ['er / sie / es', 'wäre', 'hätte', 'würde'],
    ['wir / sie', 'wären', 'hätten', 'würden'],
    ['ihr', 'wärt', 'hättet', 'würdet'],
  ],
)}
<p>Pronuncia: <i>wäre</i> [VE:-rë], <i>wärst</i> [VE:rst], <i>hätte</i> [HE-të], <i>hättest</i> [HE-tëst], <i>würde</i> [VÜR-dë], <i>würdest</i> [VÜR-dëst].</p>
${vsec('Altre forme frequenti', [
  ['ich könnte', 'iç KÖN-të', 'potrei'],
  ['ich müsste', 'iç MÜS-të', 'dovrei (obbligo)'],
  ['ich dürfte', 'iç DÜRF-të', 'potrei (permesso)'],
  ['ich sollte', 'iç ZOL-të', 'dovrei (consiglio)'],
  ['ich möchte', 'iç MÖÇ-të', 'vorrei'],
  ['ich ginge', 'iç GI-ngë', 'andrei'],
  ['ich käme', 'iç KE:-më', 'verrei'],
  ['es gäbe', 'es GE:-bë', 'ci sarebbe'],
  ['ich wüsste', 'iç VÜS-të', 'saprei'],
])}
<p><b>sollte</b> e <b>wollte</b> non hanno Umlaut e coincidono con il Präteritum: il contesto decide. Con i verbi deboli (<i>machen, arbeiten</i>) la forma del Konjunktiv II è uguale al Präteritum, quindi si usa <b>würde + infinito</b>: «Ich würde das machen.» [iç VÜR-dë das MA-chën].</p>
<h3>Periodo ipotetico</h3>
<p>Irreale al presente: <b>wenn + Konj. II, Konj. II / würde</b>. Irreale al passato: <b>wenn + hätte/wäre + participio, hätte/wäre + participio</b>. Si può togliere <i>wenn</i> e iniziare con il verbo: «Hätte ich Zeit, käme ich mit.»</p>
${vsec('Esempi', [
  [
    'Wenn ich Zeit hätte, würde ich dich besuchen.',
    'ven iç TSAIT HE-të, VÜR-dë iç diç bë-ZU:-chën',
    'Se avessi tempo, ti verrei a trovare.',
  ],
  ['Hätte ich Zeit, käme ich mit.', 'HE-të iç TSAIT, KE:-më iç MIT', 'Avessi tempo, verrei con te.'],
  [
    'Wenn ich Zeit gehabt hätte, wäre ich gekommen.',
    'ven iç TSAIT gë-HAPT HE-të, VE:-rë iç gë-KO-mën',
    'Se avessi avuto tempo, sarei venuto.',
  ],
  ['Du hättest anrufen sollen.', 'du HE-tëst AN-ru:-fën ZO-lën', 'Avresti dovuto telefonare.'],
  ['Wenn ich doch mehr Zeit hätte!', 'ven iç DOCH ME:R TSAIT HE-të', 'Se solo avessi più tempo!'],
  ['Wäre ich doch reich!', 'VE:-rë iç DOCH RAIÇ', 'Fossi ricco!'],
  ['Er tut so, als ob er alles wüsste.', 'e:r TU:T zo, als op e:r A-lës VÜS-të', 'Fa come se sapesse tutto.'],
])}
<h3>Cortesia e consiglio</h3>
${vsec('Formule', [
  ['Könnten Sie mir bitte helfen?', 'KÖN-tën zi: mi:r BI-të HEL-fën', 'Potrebbe aiutarmi, per favore?'],
  ['Ich hätte gern einen Kaffee.', 'iç HE-të GERN AI-nën KA-fe', 'Vorrei un caffè.'],
  ['An deiner Stelle würde ich warten.', 'an DAI-na SHTE-lë VÜR-dë iç VAR-tën', 'Al posto tuo aspetterei.'],
  ['Das wäre schön.', 'das VE:-rë SHÖ:N', 'Sarebbe bello.'],
  ['Du solltest mehr schlafen.', 'du ZOL-tëst ME:R SHLA:-fën', 'Dovresti dormire di più.'],
])}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Non tradurre il condizionale con würde in entrambe le metà</b>: «Se avessi tempo, verrei» = <i>Wenn ich Zeit hätte, würde ich kommen</i>, non «wenn ich Zeit haben würde». Con <i>sein, haben</i> e i modali non si usa mai würde nella subordinata.</li>
<li><b>«Vorrei»</b> = <i>ich möchte</i> o <i>ich hätte gern</i>, non «ich würde wollen».</li>
<li><b>«Dovrei / potrei / dovresti»</b> = <i>ich sollte / ich könnte / du solltest</i> (forme già di Konjunktiv II).</li>
<li><b>«Come se» + congiuntivo</b> = <i>als ob</i> + Konj. II: «Er tut so, als ob er krank wäre.»</li>
<li>Attenzione alla vocale: <i>hatte</i> [HA-të] (era) ≠ <i>hätte</i> [HE-të] (avrebbe); <i>wurde</i> [VUR-dë] (divenne) ≠ <i>würde</i> [VÜR-dë]; <i>konnte</i> [KON-të] ≠ <i>könnte</i> [KÖN-të].</li>
</ul>
<div class="say"><b>Da ricordare.</b> Irreale = Konj. II: <i>wäre, hätte, würde, könnte</i>. <i>Wenn ich Zeit hätte, würde ich kommen.</i> Passato: <i>hätte/wäre + participio</i>. Cortesia: <i>Ich hätte gern..., Könnten Sie...?</i></div>`,
  [
    q(
      'q1',
      'Completa: «Wenn ich mehr Geld ___, würde ich ein Haus kaufen.»',
      ['hätte', 'habe', 'hatte', 'hätten'],
      0,
      'Nella condizione irreale si usa il Konjunktiv II di haben: hätte. Habe è presente indicativo e hatte è Präteritum, che non esprime ipotesi.',
    ),
    q(
      'q2',
      'Completa: «Wenn ich Zeit gehabt hätte, ___ ich gekommen.»',
      ['wäre', 'hätte', 'würde', 'war'],
      0,
      'Kommen prende sein, quindi nella conseguenza irreale del passato serve wäre + participio. Hätte sarebbe giusto con un verbo che prende haben.',
    ),
    q(
      'q3',
      'Come si chiede cortesemente «Vorrei un caffè»?',
      [
        'Ich hätte gern einen Kaffee.',
        'Ich habe gern einen Kaffee.',
        'Ich würde haben einen Kaffee.',
        'Ich hatte gern einen Kaffee.',
      ],
      0,
      "La formula cortese usa il Konjunktiv II di haben: hätte gern. Le altre forme sono presente, passato o calchi dall'italiano.",
    ),
    q(
      'q4',
      'Completa: «Er tut so, als ob er alles ___.»',
      ['wüsste', 'weiß', 'wusste', 'wissen'],
      0,
      "Dopo als ob si usa il Konjunktiv II: wüsste. Wusste è un Präteritum e non ha la dieresi che segnala l'irreale.",
    ),
    q(
      'q5',
      'Completa: «Du ___ mehr schlafen.» (consiglio: dovresti)',
      ['solltest', 'sollst', 'sollen', 'solltet'],
      0,
      'Per il consiglio si usa il Konjunktiv II di sollen alla seconda persona singolare: solltest. Sollst è un ordine, indicativo presente.',
    ),
    q(
      'q6',
      'Come si pronuncia «hätte» (Konjunktiv II di haben)?',
      ['[HE-të]', '[HA-të]', '[HE:-të]', '[HAT-te]'],
      0,
      'La ä breve vale una e aperta come in «bello», mentre hatte (passato) ha la a. La doppia t si legge come una consonante sola.',
    ),
    q(
      'q7',
      'Come si pronuncia «würde»?',
      ['[VÜR-dë]', '[VUR-dë]', '[WIR-dë]', '[VÖR-dë]'],
      0,
      'Ü si dice come una i con le labbra a «u». La w vale v. Con u normale sarebbe wurde, il Präteritum di werden.',
    ),
    q(
      'q8',
      'Completa: «Wenn ich das gewusst ___, wäre ich geblieben.»',
      ['hätte', 'habe', 'hatte', 'wäre'],
      0,
      'Wissen prende haben, quindi nella condizione irreale del passato serve hätte + participio. Wäre non va con gewusst.',
    ),
    q(
      'q9',
      'Quale frase è preferibile?',
      [
        'Wenn ich mehr Zeit hätte, würde ich reisen.',
        'Wenn ich mehr Zeit haben würde, würde ich reisen.',
        'Wenn ich mehr Zeit hatte, würde ich reisen.',
        'Wenn ich mehr Zeit habe, würde ich reisen.',
      ],
      0,
      'Con haben nella subordinata si usa il Konjunktiv II hätte, non würde haben. Le altre due mescolano un presente o un Präteritum con il condizionale.',
    ),
  ],
  [
    card(
      'c1',
      'wäre / hätte / würde [VE:-rë / HE-të / VÜR-dë]',
      'Konjunktiv II di sein / haben / werden. Gli ausiliari più frequenti.',
    ),
    card('c2', 'Formazione', 'Präteritum + Umlaut + -e: <i>kam → käme, ging → ginge, wusste → wüsste</i>.'),
    card(
      'c3',
      'würde + infinito',
      'Per i verbi deboli: <i>Ich würde das machen</i>. Mai nella subordinata con haben/sein/modali.',
    ),
    card(
      'c4',
      'Irreale presente',
      '<i>Wenn ich Zeit hätte, würde ich kommen.</i> (wenn + Konj. II, Konj. II / würde).',
    ),
    card(
      'c5',
      'Irreale passato',
      '<i>Wenn ich Zeit gehabt hätte, wäre ich gekommen.</i> (hätte / wäre + Partizip II).',
    ),
    card('c6', 'Desiderio irreale', '<i>Wenn ich doch / nur ...!</i>, <i>Wäre ich doch reich!</i>'),
    card(
      'c7',
      'als ob + Konj. II',
      '<i>Er tut so, als ob er krank wäre.</i> Anche: <i>als wäre er krank</i> (verbo in seconda posizione).',
    ),
    card('c8', 'Cortesia', '<i>Könnten Sie ...? Ich hätte gern ... Dürfte ich ...?</i>'),
    card('c9', 'Consigli', '<i>Du solltest ..., An deiner Stelle würde ich ...</i>'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Se avessi più tempo, studierei di più.»',
      '<i>Wenn ich mehr Zeit hätte, würde ich mehr lernen.</i> Nota: hätte nella subordinata, würde + infinito nella principale.',
    ),
    prac(
      'p2',
      'Traduci: «Se lo avessi saputo, non sarei venuto.»',
      '<i>Wenn ich das gewusst hätte, wäre ich nicht gekommen.</i> Nota: gewusst hätte (haben) e wäre gekommen (sein).',
    ),
    prac(
      'p3',
      'Trasforma togliendo wenn: «Wenn ich du wäre, würde ich ihn anrufen.»',
      '<i>Wäre ich du, würde ich ihn anrufen.</i> Nota: il verbo passa in prima posizione e wenn sparisce.',
    ),
    prac(
      'p4',
      'Correggi: «Wenn ich mehr Geld haben würde, kaufe ich ein Auto.»',
      "<i>Wenn ich mehr Geld hätte, würde ich ein Auto kaufen.</i> Nota: non würde nella subordinata con haben; la principale va anch'essa all'irreale.",
    ),
    prac(
      'p5',
      'Produzione: scrivi tre desideri irreali con Wenn ich doch / nur ...',
      'Esempio: <i>Wenn ich doch mehr Urlaub hätte! Wenn ich nur besser Deutsch sprechen könnte! Wäre ich doch schon in Wien!</i>',
    ),
  ],
)

export const dePassiv: CourseModule = mod(
  'de-passiv',
  'Passivo e verbi con preposizione fissa',
  'Vorgangspassiv e Zustandspassiv, passivo con modali, man, sich lassen, Passiversatzformen, warten auf, sich freuen über',
  'b1',
  `<p class="lead">Il passivo tedesco usa <b>werden + participio</b> per l'azione che si svolge e <b>sein + participio</b> per il risultato. In più ci sono alternative molto frequenti (<i>man, sich lassen, sein … zu</i>) e i verbi con preposizione fissa, che vanno imparati a coppie.</p>
${PRON_SHORT}
<h3>Vorgangspassiv: werden + Partizip II</h3>
${vsec('I tempi del passivo', [
  ['Das Haus wird gebaut.', 'das HAUS virt gë-BAUT', 'La casa viene costruita. (presente)'],
  ['Das Haus wurde gebaut.', 'das HAUS VUR-dë gë-BAUT', 'La casa fu costruita. (Präteritum)'],
  ['Das Haus ist gebaut worden.', 'das HAUS ist gë-BAUT VOR-dën', 'La casa è stata costruita. (Perfekt)'],
  ['Das Haus war gebaut worden.', 'das HAUS va:r gë-BAUT VOR-dën', 'La casa era stata costruita.'],
  ['Das Haus wird gebaut werden.', 'das HAUS virt gë-BAUT VER-dën', 'La casa sarà costruita.'],
])}
<p>Nel Perfekt passivo il participio di <i>werden</i> è <b>worden</b>, non <i>geworden</i>. <b>Chi agisce:</b> <b>von + dativo</b> per le persone («Das Buch wurde von einem Autor aus Wien geschrieben.»), <b>durch + accusativo</b> per cause e mezzi («Das Haus wurde durch einen Sturm zerstört.» [… DURÇ AI-nën SHTURM tser-SHTÖRT]).</p>
<h3>Zustandspassiv: sein + Partizip II</h3>
<p>Descrive il <b>risultato</b>: «Die Tür ist geschlossen.» [di: TÜ:r ist gë-SHLO-ssën] (è chiusa) ≠ «Die Tür wird geschlossen.» (la stanno chiudendo). «Das Geschäft ist geöffnet.» (il negozio è aperto). Passato: <i>war geschlossen</i>.</p>
<h3>Passivo impersonale e con modali</h3>
<ul>
<li>Senza soggetto: «Hier wird nicht geraucht.» [hi:r virt niçt gë-RAUCHT]; «Es wird viel getanzt.» [es virt fi:l gë-TANTST].</li>
<li>Verbi con il dativo: «<b>Mir</b> wurde geholfen.» [mi:r VUR-dë gë-HOL-fën] (mi hanno aiutato). Non «Ich wurde geholfen».</li>
<li>Con i modali: «Das muss sofort gemacht <b>werden</b>.» [das MUS zo-FORT gë-MACHT VER-dën]; «Das kann nicht erklärt werden.»</li>
</ul>
<h3>Alternative al passivo</h3>
${vsec('Passiversatzformen', [
  ['Hier spricht man Deutsch.', 'hi:r SHPRIÇT man DOITSH', 'Qui si parla tedesco. (man)'],
  ['Das lässt sich leicht erklären.', 'das LEST ziç LAIÇT er-KLE:-rën', 'Si spiega facilmente. (sich lassen)'],
  [
    'Das Problem ist leicht zu lösen.',
    'das pro-BLE:M ist LAIÇT tsu LÖ:-zën',
    'Il problema è facile da risolvere. (sein + zu)',
  ],
  ['Das Wasser ist trinkbar.', 'das VA-ssa ist TRINK-ba:r', "L'acqua è potabile. (-bar)"],
  [
    'Ich habe das Auto geschenkt bekommen.',
    'iç HA:-bë das AU-to gë-SHENKT bë-KO-mën',
    "Mi hanno regalato l'auto. (bekommen-Passiv)",
  ],
])}
<h3>Verbi con preposizione fissa</h3>
<p>Il caso dipende dalla preposizione e dal verbo: va imparato insieme. <b>Akk</b> = accusativo, <b>Dat</b> = dativo.</p>
${vsec('Verbo + preposizione', [
  ['warten auf + Akk', 'VAR-tën auf', 'aspettare'],
  ['sich freuen auf + Akk', 'ziç FROI-ën auf', 'essere contento di (futuro)'],
  ['sich freuen über + Akk', 'ziç FROI-ën Ü:-ba', 'essere contento di (presente/passato)'],
  ['sich interessieren für + Akk', 'ziç in-të-re-SI:-rën FÜ:r', 'interessarsi di'],
  ['sich ärgern über + Akk', 'ziç ER-gërn Ü:-ba', 'arrabbiarsi per'],
  ['denken an + Akk', 'DEN-kën an', 'pensare a'],
  ['sich erinnern an + Akk', 'ziç er-I-nërn an', 'ricordarsi di'],
  ['träumen von + Dat', 'TROI-mën fon', 'sognare di'],
  ['abhängen von + Dat', 'AP-hen-gën fon', 'dipendere da'],
  ['bitten um + Akk', 'BI-tën um', 'chiedere (qualcosa)'],
  ['fragen nach + Dat', 'FRA:-gën na:ch', 'chiedere di/su'],
  ['teilnehmen an + Dat', 'TAIL-ne:-mën an', 'partecipare a'],
  ['sich entscheiden für + Akk', 'ziç ent-SHAI-dën FÜ:r', 'decidersi per'],
  ['sich verlieben in + Akk', 'ziç fer-LI:-bën in', 'innamorarsi di'],
  ['Angst haben vor + Dat', 'ANGST HA:-bën fo:r', 'avere paura di'],
  ['sich konzentrieren auf + Akk', 'ziç kon-tsen-TRI:-rën auf', 'concentrarsi su'],
  ['sich beschäftigen mit + Dat', 'ziç bë-SHEF-ti-gën mit', 'occuparsi di'],
  ['bestehen aus + Dat', 'bë-SHTE:-ën aus', 'consistere di'],
])}
<p>Con le cose si usa <b>da(r)- / wo(r)-</b>: «<b>Worauf</b> wartest du?» [vo-RAUF VAR-tëst du] – «Ich warte <b>darauf</b>, dass er anruft.» [iç VAR-të da-RAUF, das e:r AN-ru:ft]. Con le persone: «<b>Auf wen</b> wartest du?» – «Auf ihn.»</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>Molte preposizioni <b>non corrispondono all'italiano</b>: «aspettare» (senza preposizione) = <i>warten auf</i>; «pensare a» = <i>denken an</i>; «sognare di» = <i>träumen von</i>; «ridere di» = <i>lachen über</i>.</li>
<li>«<b>Si</b> parla tedesco» (si passivante) = <i>Hier wird Deutsch gesprochen</i> oppure <i>man spricht Deutsch</i>.</li>
<li>L'italiano usa <b>venire</b> («viene costruita») e <b>essere</b>: in tedesco il passivo è <i>werden</i>; <i>sein</i> descrive solo lo stato.</li>
<li>«Va fatto» = <i>muss gemacht werden</i> oppure <i>ist zu machen</i>.</li>
<li>Ricordati <b>worden</b> (non <i>geworden</i>) nel Perfekt passivo.</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Das Haus wird gebaut</i> (processo) ≠ <i>ist gebaut</i> (stato). <i>Das Haus ist gebaut worden.</i> <i>Mir wurde geholfen.</i> <i>Ich warte auf den Bus; ich freue mich auf den Urlaub.</i></div>`,
  [
    q(
      'q1',
      'Completa: «Das Haus ___ 1990 gebaut.»',
      ['wurde', 'wird', 'ist', 'hat'],
      0,
      'Un fatto passato si esprime con werden al Präteritum: wurde gebaut. Wird sarebbe presente e ist darebbe un Zustandspassiv senza senso storico.',
    ),
    q(
      'q2',
      'Completa: «Das Auto ist gestern repariert ___.»',
      ['worden', 'geworden', 'werden', 'wurde'],
      0,
      'Nel Perfekt passivo il participio di werden è worden. Geworden vale solo quando werden significa diventare, come verbo pieno.',
    ),
    q(
      'q3',
      'Come si dice «Il negozio è chiuso» (stato)?',
      [
        'Das Geschäft ist geschlossen.',
        'Das Geschäft wird geschlossen.',
        'Das Geschäft ist schließen.',
        'Das Geschäft hat geschlossen.',
      ],
      0,
      'Lo stato si esprime con sein + participio (Zustandspassiv). Wird geschlossen significa che lo stanno chiudendo in questo momento.',
    ),
    q(
      'q4',
      'Completa: «Ich warte ___ den Bus.»',
      ['auf', 'für', 'an', 'zu'],
      0,
      "Warten regge sempre auf + accusativo. In italiano «aspettare» non ha preposizione, ma in tedesco serve: l'errore tipico è omettere auf.",
    ),
    q(
      'q5',
      'Completa: «Er freut sich ___ den Urlaub im nächsten Monat.»',
      ['auf', 'über', 'für', 'an'],
      0,
      "Per una gioia che riguarda il futuro si usa sich freuen auf. Über si usa per ciò che c'è già o è accaduto.",
    ),
    q(
      'q6',
      'Come si dice «Mi hanno aiutato» al passivo?',
      ['Mir wurde geholfen.', 'Ich wurde geholfen.', 'Ich wurde gehelft.', 'Mich wurde geholfen.'],
      0,
      'Helfen regge il dativo, che nel passivo resta dativo: mir. Il passivo è impersonale, quindi non esiste un soggetto ich.',
    ),
    q(
      'q7',
      'Completa: «Das Problem lässt sich leicht ___.»',
      ['lösen', 'gelöst', 'zu lösen', 'lösend'],
      0,
      "Sich lassen vuole l'infinito semplice, senza zu né participio. Zu lösen si usa invece con sein: ist zu lösen.",
    ),
    q(
      'q8',
      'Completa: «Hier ___ nicht geraucht.»',
      ['wird', 'ist', 'hat', 'wurde gestern'],
      0,
      'Il passivo impersonale generale si fa con werden al presente: wird geraucht. Ist darebbe un participio come aggettivo, che non funziona qui.',
    ),
    q(
      'q9',
      'Come si pronuncia «interessieren»?',
      ['[in-të-re-SI:-rën]', '[in-TE-re-si-rën]', '[IN-te-re-sie-ren]', '[in-ter-ES-i-ren]'],
      0,
      "I verbi in -ieren hanno l'accento sulla sillaba -ie- (lunga: [SI:]) e la desinenza -en è debole. L'accento sul prefisso è tipico dell'italiano.",
    ),
    q(
      'q10',
      'Completa: «Sie denkt oft ___ ihre Familie.»',
      ['an', 'auf', 'von', 'über'],
      0,
      'Denken regge an + accusativo. Denken über significa riflettere su e denken von dire cosa si pensa di qualcuno, non pensare a qualcuno.',
    ),
  ],
  [
    card(
      'c1',
      'Vorgangspassiv',
      '<i>werden + Partizip II</i>: <i>wird, wurde, ist ... worden</i>. Esprime il processo.',
    ),
    card('c2', 'Zustandspassiv', '<i>sein + Partizip II</i>: <i>Die Tür ist geschlossen.</i> Esprime il risultato.'),
    card(
      'c3',
      'von o durch?',
      '<i>von</i> + Dativ per chi agisce (persone); <i>durch</i> + Akkusativ per mezzi e cause.',
    ),
    card('c4', 'Passivo impersonale', '<i>Hier wird nicht geraucht. Mir wurde geholfen.</i>'),
    card('c5', 'Modale + passivo', '<i>Das muss gemacht werden.</i> Infinito passivo: <i>Partizip II + werden</i>.'),
    card('c6', 'Passiversatzformen', '<i>man; sich lassen + inf.; sein + zu + inf.; -bar; bekommen-Passiv.</i>'),
    card(
      'c7',
      'warten auf + Akk [VAR-tën auf]',
      'aspettare. <i>Ich warte auf den Bus.</i> Domanda: <i>Worauf</i> (cosa) / <i>Auf wen</i> (chi).',
    ),
    card(
      'c8',
      'sich freuen auf / über',
      '<i>auf</i> = futuro, <i>über</i> = presente o passato. Entrambi + accusativo.',
    ),
    card('c9', 'Angst haben vor + Dat [ANGST HA:-bën fo:r]', 'avere paura di. <i>Ich habe Angst vor dem Hund.</i>'),
  ],
  [
    prac(
      'p1',
      'Passivo: «Man repariert das Auto heute.» (Präsens)',
      "<i>Das Auto wird heute repariert.</i> Nota: l'oggetto diventa soggetto, werden + Partizip II.",
    ),
    prac(
      'p2',
      'Perfekt passivo: «Man hat die Tür geschlossen.»',
      '<i>Die Tür ist geschlossen worden.</i> Nota: worden, non geworden.',
    ),
    prac(
      'p3',
      'Traduci: «Qui si parla italiano.» in due modi.',
      '<i>Hier wird Italienisch gesprochen. / Hier spricht man Italienisch.</i>',
    ),
    prac(
      'p4',
      "Completa con la preposizione e l'articolo: «Ich interessiere mich ___ ___ Musik. Sie träumt ___ ___ Reise.»",
      '<i>Ich interessiere mich für Musik. Sie träumt von einer Reise.</i> Nota: für + Akk, von + Dat.',
    ),
    prac(
      'p5',
      'Rispondi: «Worauf wartest du?» («Aspetto la risposta.»)',
      '<i>Ich warte auf die Antwort. / Darauf warte ich auch schon lange.</i> Nota: wo(r)- per le cose, auf + Akk.',
    ),
  ],
)
