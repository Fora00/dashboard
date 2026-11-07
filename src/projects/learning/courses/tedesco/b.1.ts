import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT, vsec } from './pron'
import { tbl } from './b.util'

export const deNebensaetze2: CourseModule = mod(
  'de-nebensaetze2',
  'Subordinate avanzate e infinito con zu',
  'obwohl, damit, um … zu, sodass, während, bevor, nachdem, falls; Infinitiv mit zu; doppio infinito; perfetto nella subordinata',
  'b1',
  `<p class="lead">Al B1 il tedesco si allunga con le <b>subordinate</b>. Una regola le governa tutte: il <b>verbo coniugato va in fondo</b> alla frase, e la subordinata è sempre separata da una <b>virgola</b>. Impara le congiunzioni insieme alla pronuncia: sono parole piccole che userai ogni giorno.</p>
${PRON_SHORT}
${vsec('Le congiunzioni da conoscere', [
  ['obwohl', 'op-VO:L', 'benché, nonostante (+ indicativo)'],
  ['damit', 'da-MIT', 'affinché (soggetti diversi)'],
  ['um … zu', 'UM … tsu', 'per, al fine di (stesso soggetto)'],
  ['sodass / so … dass', 'zo-DAS / zo … DAS', 'cosicché / così … che'],
  ['während', 'VE:-rënt', 'mentre'],
  ['bevor', 'bë-FO:r', 'prima che, prima di'],
  ['nachdem', 'nach-DE:m', 'dopo che'],
  ['falls', 'FALS', 'nel caso in cui'],
  ['sobald', 'zo-BALT', 'appena'],
  ['solange', 'zo-LA-ngë', 'finché, per tutto il tempo che'],
  ['bis', 'BIS', 'finché non, fino a quando'],
  ['ob', 'OP', 'se (domanda indiretta)'],
  ['dass', 'DAS', 'che (dichiarativa)'],
])}
<h3>Il verbo in fondo</h3>
<p>Schema: <b>principale</b>, <b>congiunzione + soggetto + ... + verbo coniugato</b>. Se la subordinata viene prima, la principale riparte con il <b>verbo subito dopo la virgola</b> (il verbo è in prima posizione, il soggetto dopo).</p>
${vsec('Esempi', [
  [
    'Ich gehe spazieren, obwohl es regnet.',
    'iç GE:-ë shpa-TSI:-rën, op-VO:L es RE:G-nët',
    'Vado a passeggiare, anche se piove.',
  ],
  [
    'Er lernt Deutsch, um in Wien zu arbeiten.',
    'e:r LERNT DOITSH, um in VI:N tsu AR-bai-tën',
    'Studia tedesco per lavorare a Vienna.',
  ],
  [
    'Ich erkläre es dir, damit du es verstehst.',
    'iç er-KLE:-rë es di:r, da-MIT du es fer-SHTE:ST',
    'Te lo spiego affinché tu lo capisca.',
  ],
  [
    'Es war so laut, dass ich nichts verstehen konnte.',
    'es va:r zo LAUT, das iç NIÇTS fer-SHTE:-ën KON-të',
    'Era così rumoroso che non potevo capire niente.',
  ],
  ['Ich höre Musik, während ich koche.', 'iç HÖ:-rë mu-ZI:K, VE:-rënt iç KO-chë', 'Ascolto musica mentre cucino.'],
  [
    'Bevor du gehst, ruf mich bitte an.',
    'bë-FO:r du GE:ST, RU:F miç BI-të AN',
    'Prima che tu vada, chiamami per favore.',
  ],
  [
    'Falls es regnet, bleiben wir zu Hause.',
    'FALS es RE:G-nët, BLAI-bën vi:r tsu HAU-zë',
    'Se per caso piove, restiamo a casa.',
  ],
  ['Ich weiß nicht, ob er kommt.', 'iç VAIS niçt, op e:r KOMT', 'Non so se viene.'],
])}
<p><b>Inversione:</b> «Wenn ich Zeit habe, <b>gehe ich</b> ins Kino.» [ven iç TSAIT HA:-bë, GE:-ë iç ins KI:-no]: il verbo della principale viene subito dopo la virgola. Mai «..., ich gehe ins Kino».</p>
<h3>Infinitiv mit zu</h3>
<p>Molti verbi, aggettivi e sostantivi reggono un infinito con <b>zu</b>, separato da virgola quando è esteso. Con um, ohne, (an)statt la virgola è obbligatoria. Con i <b>verbi separabili</b> zu si inserisce nel mezzo: <b>auf·zu·stehen</b>.</p>
${vsec('Esempi con zu', [
  [
    'Ich habe Lust, heute Abend ins Kino zu gehen.',
    'iç HA:-bë LUST, HOI-të A:-bënt ins KI:-no tsu GE:-ën',
    'Ho voglia di andare al cinema stasera.',
  ],
  ['Es ist wichtig, pünktlich zu sein.', 'es ist VIÇ-tiç, PÜNKT-liç tsu ZAIN', 'È importante essere puntuali.'],
  ['Ich versuche, früher aufzustehen.', 'iç fer-ZU:-chë, FRÜ:-a AUF-tsu-shte:-ën', 'Cerco di alzarmi prima.'],
  ['Er geht, ohne sich zu verabschieden.', 'e:r GE:T, O:-në ziç tsu fer-AP-shi:-dën', 'Se ne va senza salutare.'],
  ['Statt zu lernen, schaut er fern.', 'SHTAT tsu LER-nën, SHAUT e:r FERN', 'Invece di studiare, guarda la tv.'],
])}
<p><b>Senza zu</b> dopo: i verbi modali (<i>können, müssen, wollen...</i>), <i>werden, lassen</i>, i verbi di movimento (<i>gehen, fahren</i>) e di percezione (<i>sehen, hören</i>), e <i>bleiben</i>: «Ich gehe schwimmen.» [iç GE:-ë SHVI-mën].</p>
<h3>Doppio infinito</h3>
<p>Quando un modale (o <i>sehen, hören, lassen</i>) sta al perfetto con un altro infinito, il suo participio diventa un <b>infinito</b> (Ersatzinfinitiv): non <i>gekonnt</i>, ma <b>können</b>.</p>
${vsec('Doppio infinito', [
  ['Ich habe nicht kommen können.', 'iç HA:-bë niçt KO-mën KÖ-nën', 'Non sono potuto venire.'],
  ['Ich habe ihn kommen sehen.', 'iç HA:-bë i:n KO-mën ZE:-ën', "L'ho visto arrivare."],
  ['Er hat gestern arbeiten müssen.', 'e:r hat GES-tërn AR-bai-tën MÜ-ssën', 'Ieri ha dovuto lavorare.'],
  ['..., weil er nicht hat kommen können.', 'vail e:r niçt hat KO-mën KÖ-nën', '..., perché non è potuto venire.'],
])}
<p>Nella subordinata <b>haben</b> si sposta <b>davanti</b> al doppio infinito, e non in fondo. Nel parlato si evita volentieri: «..., weil er nicht kommen konnte» (Präteritum).</p>
<h3>Il perfetto nella subordinata</h3>
<p>Qui l'ausiliare va <b>dopo il participio</b>, in fondo: «Ich glaube, dass er gestern gearbeitet <b>hat</b>.» [iç GLAU-bë, das e:r GES-tërn gë-AR-bai-tët HAT]; «..., dass sie schon abgereist <b>ist</b>.» [das zi: shon AP-gë-raist IST].</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>«Per + infinito»</b> è <i>um … zu</i> solo se il soggetto è lo stesso; con soggetti diversi serve <i>damit</i> + verbo coniugato: «Ti scrivo perché tu sappia» → <i>damit du es weißt</i>.</li>
<li><b>«Benché» + congiuntivo</b> = <i>obwohl</i> + <b>indicativo</b>: «Benché sia stanco» → <i>obwohl er müde ist</i>.</li>
<li><b>«Prima di partire», «dopo aver mangiato»</b>: l'italiano usa l'infinito, il tedesco una subordinata: <i>bevor ich fahre</i>, <i>nachdem ich gegessen habe</i> (oppure un nome: <i>vor der Abreise</i>, <i>nach dem Essen</i>).</li>
<li><b>«Senza che»</b> = <i>ohne dass</i>.</li>
<li><b>dass non si omette</b> come «che» in «credo venga». Si può togliere solo cambiando ordine: «Ich glaube, er kommt.» (verbo in seconda posizione).</li>
<li><b>dass / das:</b> <i>dass</i> è la congiunzione [DAS], <i>das</i> articolo o pronome [das]: uguali nel suono, diverse nella scrittura.</li>
</ul>
<div class="say"><b>Da ricordare.</b> Subordinata = verbo in fondo, virgola obbligatoria. <i>um … zu</i> stesso soggetto, <i>damit</i> soggetti diversi. Doppio infinito: <i>Ich habe es nicht machen können</i> [iç HA:-bë es niçt MA-chën KÖ-nën].</div>`,
  [
    q(
      'q1',
      'Completa: «Ich lerne Deutsch, ___ in Wien zu arbeiten.»',
      ['um', 'damit', 'sodass', 'ohne'],
      0,
      "Stesso soggetto e scopo: um … zu con l'infinito. Damit richiederebbe un verbo coniugato in fondo, mentre sodass esprime una conseguenza.",
    ),
    q(
      'q2',
      'Completa: «Ich gebe dir das Buch, ___ du es lesen kannst.»',
      ['damit', 'um', 'obwohl', 'bevor'],
      0,
      'I soggetti sono diversi (io / tu), quindi serve damit con il verbo in fondo. Um … zu funziona solo se il soggetto resta lo stesso.',
    ),
    q(
      'q3',
      'Completa: «___ er krank war, ging er zur Arbeit.»',
      ['Obwohl', 'Weil', 'Damit', 'Falls'],
      0,
      'Il senso è concessivo: era malato, ma è andato lo stesso. Weil darebbe una causa, damit uno scopo e falls una condizione.',
    ),
    q(
      'q4',
      'Quale frase è corretta?',
      [
        'Ich glaube, dass er gestern gearbeitet hat.',
        'Ich glaube, dass er hat gestern gearbeitet.',
        'Ich glaube, dass er gestern hat gearbeitet.',
        'Ich glaube, dass gestern er gearbeitet hat.',
      ],
      0,
      'Nella subordinata il verbo coniugato (hat) va in fondo, dopo il participio. Le altre varianti lo lasciano troppo presto, come in una principale.',
    ),
    q(
      'q5',
      'Completa: «Ich habe keine Lust, heute ___.» (aufräumen)',
      ['aufzuräumen', 'zu aufräumen', 'auf zu räumen', 'aufräumenzu'],
      0,
      'Con i verbi separabili zu si inserisce tra prefisso e radice e tutto si scrive unito: aufzuräumen. Le altre forme non esistono in tedesco.',
    ),
    q(
      'q6',
      'Completa: «Ich habe gestern lange arbeiten ___.»',
      ['müssen', 'gemusst', 'zu müssen', 'musste'],
      0,
      'Con un altro infinito il participio del modale diventa infinito (Ersatzinfinitiv): arbeiten müssen. Gemusst si usa solo senza infinito dipendente.',
    ),
    q(
      'q7',
      'Come si pronuncia «obwohl»?',
      ['[op-VO:L]', '[ob-VOL]', '[op-WO:L]', '[OP-vol]'],
      0,
      "La b davanti a w si ammorbidisce in p, la w tedesca vale v e la o di «wohl» è lunga (h che allunga). L'accento cade su «wohl».",
    ),
    q(
      'q8',
      'Come si pronuncia «bevor»?',
      ['[bë-FO:r]', '[BE-vor]', '[bë-VO:R]', '[be-FOR]'],
      0,
      "Il prefisso be- è debole (ë), l'accento cade su -vor e la v tedesca vale f. La o di «vor» è lunga: [FO:r].",
    ),
    q(
      'q9',
      'Completa: «Er ist gegangen, ___ ein Wort zu sagen.»',
      ['ohne', 'damit', 'bevor', 'obwohl'],
      0,
      "Dopo la virgola c'è un infinito con zu, che accetta solo ohne, um o statt. Damit, bevor e obwohl vogliono invece un verbo coniugato.",
    ),
  ],
  [
    card(
      'c1',
      'obwohl [op-VO:L]',
      "benché, nonostante. Regge l'indicativo, il verbo va in fondo: <i>obwohl es regnet</i>.",
    ),
    card('c2', 'damit [da-MIT]', 'affinché. Soggetti diversi. <i>Ich erkläre es dir, damit du es verstehst.</i>'),
    card('c3', 'um … zu [um … tsu]', 'per + infinito, stesso soggetto: <i>um in Wien zu arbeiten</i>.'),
    card('c4', 'sodass / so … dass', 'cosicché / così … che (conseguenza): <i>so laut, dass ich nichts verstand</i>.'),
    card(
      'c5',
      'während [VE:-rënt] / bevor [bë-FO:r] / nachdem [nach-DE:m]',
      'mentre / prima che / dopo che. Verbo in fondo.',
    ),
    card(
      'c6',
      'Verbo separabile + zu',
      '<i>aufstehen → aufzustehen</i> [AUF-tsu-shte:-ën]; <i>einkaufen → einzukaufen</i>.',
    ),
    card(
      'c7',
      'Doppio infinito',
      '<i>Ich habe nicht kommen können.</i> Nella subordinata: <i>..., weil er hat kommen müssen.</i>',
    ),
    card('c8', 'Senza zu dopo...', 'modali, werden, lassen, gehen, fahren, bleiben, sehen, hören.'),
    card(
      'c9',
      'dass [DAS] o das [das]?',
      '<i>dass</i> = congiunzione (che); <i>das</i> = articolo/pronome. Si pronunciano uguale.',
    ),
  ],
  [
    prac(
      'p1',
      'Traduci: «Studio tedesco per poter lavorare a Berlino.»',
      "<i>Ich lerne Deutsch, um in Berlin arbeiten zu können.</i> Nota: um … zu perché il soggetto è lo stesso; il modale va alla fine dell'infinito.",
    ),
    prac(
      'p2',
      'Traduci: «Te lo spiego affinché tu lo capisca.»',
      '<i>Ich erkläre es dir, damit du es verstehst.</i> Nota: soggetti diversi (io, tu) e indicativo, non congiuntivo.',
    ),
    prac(
      'p3',
      'Correggi: «Ich glaube, dass er hat gestern gearbeitet.»',
      "<i>Ich glaube, dass er gestern gearbeitet hat.</i> Nota: nella subordinata l'ausiliare va in fondo.",
    ),
    prac(
      'p4',
      'Correggi: «Er ist gegangen ohne zu sagen ein Wort.»',
      '<i>Er ist gegangen, ohne ein Wort zu sagen.</i> Nota: virgola obbligatoria, zu davanti al verbo finale.',
    ),
    prac(
      'p5',
      'Completa con il tempo giusto: «Nachdem ich ___ (essen), ging ich spazieren.»',
      '<i>Nachdem ich gegessen hatte, ging ich spazieren.</i> Nota: azione anteriore a un Präteritum = Plusquamperfekt (hatte + participio).',
    ),
    prac(
      'p6',
      'Produzione: scrivi due frasi, una con obwohl e una con weil, sul tuo weekend.',
      'Esempio: <i>Ich bin zu Hause geblieben, obwohl die Sonne schien.</i> / <i>Ich bin müde, weil ich spät ins Bett gegangen bin.</i> Controlla che il verbo coniugato sia in fondo.',
    ),
  ],
)

export const deRelativ: CourseModule = mod(
  'de-relativ',
  'Frasi relative, Genitiv e declinazione n',
  'der/die/das, dessen/deren, denen, was, wo, preposizione + relativo; wegen, trotz, während; Menschen, Studenten',
  'b1',
  `<p class="lead">La frase relativa è una subordinata introdotta da un <b>pronome relativo</b>. Il pronome prende <b>genere e numero</b> dal nome a cui si riferisce, ma il <b>caso</b> dalla sua funzione nella relativa. Il verbo va in fondo, e la relativa è chiusa da virgole.</p>
${PRON_SHORT}
<h3>Il pronome relativo</h3>
${tbl(
  ['Caso', 'masch.', 'femm.', 'neutro / plur.'],
  [
    ['Nominativo', 'der', 'die', 'das / die'],
    ['Accusativo', 'den', 'die', 'das / die'],
    ['Dativo', 'dem', 'der', 'dem / denen'],
    ['Genitivo', 'dessen', 'deren', 'dessen / deren'],
  ],
)}
<p>Quasi uguale all'articolo determinativo. Solo il <b>dativo plurale (denen)</b> e il <b>genitivo (dessen, deren)</b> sono diversi. Pronuncia: <i>dessen</i> [DE-ssën] (e breve), <i>deren</i> [DE:-rën] (e lunga), <i>denen</i> [DE:-nën].</p>
${vsec('Esempi', [
  [
    'Der Mann, der dort wohnt, ist Arzt.',
    'de:r MAN, de:r dort vo:nt, ist ARTST',
    "L'uomo che abita lì è medico. (nominativo)",
  ],
  [
    'Der Film, den ich gesehen habe, war gut.',
    'de:r FILM, de:n iç gë-ZE:-ën HA:-bë, va:r GU:T',
    'Il film che ho visto era bello. (accusativo)',
  ],
  [
    'Die Frau, der ich geholfen habe, ist nett.',
    'di: FRAU, de:r iç gë-HOL-fën HA:-bë, ist NET',
    'La donna che ho aiutato è gentile. (dativo)',
  ],
  [
    'Das Kind, dessen Mutter Ärztin ist, ist sechs.',
    'das KINT, DE-ssën MU-ta E:RTS-tin ist, ist ZEKS',
    'Il bambino la cui madre è medico ha sei anni. (genitivo)',
  ],
  [
    'Die Leute, mit denen ich arbeite, sind nett.',
    'di: LOI-të, mit DE:-nën iç AR-bai-të, zint NET',
    'Le persone con cui lavoro sono gentili.',
  ],
  [
    'Die Stadt, in der ich wohne, ist klein.',
    'di: SHTAT, in de:r iç VO:-në, ist KLAIN',
    'La città in cui abito è piccola.',
  ],
])}
<p><b>Preposizione + relativo:</b> la preposizione sta <b>prima</b> del pronome e ne decide il caso: <i>mit dem</i>, <i>in der</i>, <i>für die</i>. Per i luoghi si può anche usare <b>wo</b> (parlato): «Die Stadt, wo ich wohne.»</p>
<h3>was, wer, wo(r)-</h3>
<ul>
<li><b>was</b> dopo <i>alles, nichts, etwas, viel, das Beste</i> o riferito a un'intera frase: «Alles, was du sagst, stimmt.» [A-lës, vas du ZA:KST, SHTIMT]; «Er hat bestanden, was mich freut.» [e:r hat bë-SHTAN-dën, vas miç FROIT].</li>
<li><b>wer</b> = chi (in generale): «Wer das glaubt, ist naiv.» [ve:r das GLAUPT, ist na-IF].</li>
<li><b>wo(r) + preposizione</b> dopo <i>etwas, nichts, alles</i>: «Das ist etwas, worüber ich nachdenke.» [vo-RÜ:-ba].</li>
</ul>
<h3>Genitivo e preposizioni con il genitivo</h3>
<p>Il genitivo maschile e neutro prende <b>-(e)s</b> sul nome (<i>des Mannes, des Kindes</i>); femminile e plurale usano <b>der</b>. Preposizioni: <b>wegen</b> (a causa di), <b>trotz</b> (nonostante), <b>während</b> (durante), <b>statt/anstatt</b> (invece di), <b>innerhalb, außerhalb, aufgrund</b>.</p>
${vsec('Genitivo in uso', [
  ['wegen des Wetters', 'VE:-gën dës VE-ta', 'a causa del tempo'],
  ['trotz des Regens', 'TROTS dës RE:-gëns', 'nonostante la pioggia'],
  ['während des Films', 'VE:-rënt dës FILMS', 'durante il film'],
  ['statt eines Briefes', 'SHTAT AI-nës BRI:-fës', 'invece di una lettera'],
  ['innerhalb der Stadt', 'I-na-halp de:r SHTAT', "all'interno della città"],
])}
<p>Nel parlato si sente «wegen dem Wetter» (dativo); nello scritto e agli esami usa il genitivo. <b>während</b> è anche congiunzione (<i>während ich koche</i>): preposizione = nome al genitivo, congiunzione = verbo in fondo.</p>
<h3>La declinazione n</h3>
<p>Alcuni maschili animati prendono <b>-(e)n</b> in tutti i casi tranne il nominativo singolare: <i>der Junge</i> [JU-ngë], <i>der Kollege</i> [ko-LE:-gë], <i>der Student</i> [shtu-DENT], <i>der Mensch</i> [MENSH], <i>der Kunde</i> [KUN-dë], <i>der Nachbar</i> [NACH-bar], <i>der Herr</i> [HER] (<i>den Herrn</i>). Eccezione: <i>der Name</i> fa <i>des Namens</i> [NA:-mëns].</p>
<p>«Ich kenne den Studenten.» [iç KE-në de:n shtu-DEN-tën]. «Das ist das Auto des Nachbarn.» [das ist das AU-to dës NACH-barn].</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>«Il cui»</b> = <i>dessen / deren</i> e <b>dopo non c'è l'articolo</b>: «der Mann, dessen Auto» (non «dessen das Auto»).</li>
<li><b>«Quello che / ciò che»</b> = <i>das, was</i> o <i>was</i>: mai «das das».</li>
<li><b>«Di cui parlo»</b> = <i>von dem ich spreche</i> o <i>über das ich spreche</i>: il verbo tedesco decide la preposizione.</li>
<li>In italiano «che» non cambia; in tedesco guarda <b>genere del nome</b> e <b>caso nella relativa</b> (due domande separate).</li>
</ul>
<div class="say"><b>Da ricordare.</b> Genere e numero dall'antecedente, caso dalla funzione: <i>Die Frau, der ich helfe</i> (dativo di helfen). <i>Alles, was</i>; <i>dessen/deren</i> senza articolo dopo.</div>`,
  [
    q(
      'q1',
      'Completa: «Das ist die Frau, ___ ich geholfen habe.»',
      ['der', 'die', 'den', 'deren'],
      0,
      'Helfen regge il dativo e la donna è femminile: dativo femminile = der. Die sarebbe nominativo o accusativo, deren un genitivo.',
    ),
    q(
      'q2',
      'Completa: «Der Mann, ___ Auto dort steht, ist mein Chef.»',
      ['dessen', 'deren', 'dem', 'der'],
      0,
      "Esprime possesso (il cui) e Mann è maschile: dessen. Deren si usa per femminile e plurale, e dopo non compare l'articolo.",
    ),
    q(
      'q3',
      'Completa: «Die Kollegen, mit ___ ich arbeite, sind nett.»',
      ['denen', 'den', 'die', 'dessen'],
      0,
      "Mit regge il dativo e il nome è plurale: dativo plurale = denen. Den è l'articolo, non il pronome relativo plurale.",
    ),
    q(
      'q4',
      'Completa: «Alles, ___ du sagst, ist richtig.»',
      ['was', 'das', 'dass', 'wer'],
      0,
      'Dopo alles il relativo è was. Das è il pronome dimostrativo e dass la congiunzione: si pronunciano come was ma qui non vanno.',
    ),
    q(
      'q5',
      'Completa: «Wir bleiben wegen ___ Wetters zu Hause.»',
      ['des', 'dem', 'das', 'der'],
      0,
      'Wegen vuole il genitivo: das Wetter è neutro, quindi des Wetters. Il dativo dem è parlato ma sconsigliato nello scritto.',
    ),
    q(
      'q6',
      'Completa: «Ich kenne den ___ gut.» (Student)',
      ['Studenten', 'Student', 'Studentes', 'Studenter'],
      0,
      "Student segue la declinazione n: all'accusativo prende -en. Le altre forme non appartengono a questa declinazione.",
    ),
    q(
      'q7',
      'Come si pronuncia «dessen»?',
      ['[DE-ssën]', '[DE:-sën]', '[DE-zën]', '[DE:-ssën]'],
      0,
      "Dessen ha la e breve (la doppia s la segnala) e la s sorda [ss]. Con la e lunga e la s sonora sarebbe un'altra parola.",
    ),
    q(
      'q8',
      'Come si pronuncia «Studenten»?',
      ['[shtu-DEN-tën]', '[STU-den-ten]', '[shtu-den-TEN]', '[SHTU-dën-tën]'],
      0,
      "St iniziale si legge sht, l'accento è sulla sillaba -dent, le sillabe finali -en sono deboli (ën). L'accento sul prefisso è un errore comune.",
    ),
    q(
      'q9',
      'Completa: «Die Stadt, ___ ich wohne, ist klein.»',
      ['in der', 'in die', 'in dem', 'in den'],
      0,
      'Wohnen indica luogo e vuole il dativo: Stadt è femminile, dativo femminile = der. In die sarebbe moto a luogo con accusativo.',
    ),
  ],
  [
    card(
      'c1',
      'der, die, das (relativo)',
      "Come l'articolo; diversi solo <i>denen</i> (dat. plur.), <i>dessen</i> (m./n.), <i>deren</i> (f./plur.).",
    ),
    card(
      'c2',
      'dessen [DE-ssën] / deren [DE:-rën]',
      "il cui / la cui. Dopo non c'è articolo: <i>das Kind, dessen Mutter...</i>",
    ),
    card('c3', 'denen [DE:-nën]', 'dativo plurale del relativo: <i>die Leute, mit denen ich arbeite</i>.'),
    card('c4', 'was (relativo)', 'dopo alles, nichts, etwas, viel, das Beste o riferito a tutta la frase.'),
    card('c5', 'wegen [VE:-gën] / trotz [TROTS] / während [VE:-rënt]', 'a causa di / nonostante / durante + genitivo.'),
    card(
      'c6',
      'Genitivo maschile e neutro',
      'nome + -(e)s: <i>des Mannes, des Kindes, des Hauses</i>; femminile e plurale: <i>der</i>.',
    ),
    card(
      'c7',
      'Declinazione n',
      '<i>der Student → den/dem/des Studenten</i>; anche Junge, Kollege, Mensch, Kunde, Nachbar, Herr (Herrn).',
    ),
    card('c8', 'der Name [NA:-më]', 'Genitivo: <i>des Namens</i> [NA:-mëns]; dativo e accusativo: <i>Namen</i>.'),
    card(
      'c9',
      'Preposizione + relativo',
      '<i>mit dem, in der, für die</i>: la preposizione sta prima e decide il caso.',
    ),
  ],
  [
    prac(
      'p1',
      'Unisci con un relativo: «Das ist der Mann. Ich habe ihn gestern gesehen.»',
      '<i>Das ist der Mann, den ich gestern gesehen habe.</i> Nota: accusativo maschile = den, verbo in fondo.',
    ),
    prac(
      'p2',
      'Unisci: «Die Frau wohnt neben uns. Ihr Sohn ist Arzt.»',
      '<i>Die Frau, deren Sohn Arzt ist, wohnt neben uns.</i> Nota: genitivo femminile = deren, senza articolo dopo.',
    ),
    prac(
      'p3',
      'Traduci: «Tutto ciò che hai detto è vero.»',
      '<i>Alles, was du gesagt hast, ist wahr.</i> Nota: dopo alles si usa was.',
    ),
    prac(
      'p4',
      'Correggi: «Wegen dem Regen bleiben wir zu Hause.» (stile formale)',
      '<i>Wegen des Regens bleiben wir zu Hause.</i> Nota: nello scritto wegen vuole il genitivo (des Regens).',
    ),
    prac(
      'p5',
      'Completa: «Ich habe mit dem ___ (Kollege) gesprochen.»',
      '<i>Ich habe mit dem Kollegen gesprochen.</i> Nota: declinazione n, dativo in -en.',
    ),
  ],
)

export const deAggettivi: CourseModule = mod(
  'de-aggettivi',
  'Declinazione degli aggettivi, comparativi e Mittelfeld',
  'Tre tabelle (det., indet., zero); participi come aggettivi; comparativi; nominalizzazione; ordine TeKaMoLo',
  'b1',
  `<p class="lead">In tedesco l'aggettivo <b>prima del nome</b> prende una desinenza, e quale desinenza dipende da tre cose: <b>articolo</b> (che tipo e se c'è), <b>caso</b> e <b>genere</b>. Dopo il verbo («Das Haus ist <i>groß</i>») resta invariato. Le tre tabelle qui sotto coprono tutto: impara quale usare.</p>
${PRON_SHORT}
<p><i>Desinenze: -e [ë], -en [ën], -er [a], -es [ës], -em [ëm]. Es. guter [GU:-ta], gutes [GU:-tës], guten [GU:-tën].</i></p>
<h3>Tabella 1: dopo der / die / das (articolo determinativo, dieser, jeder)</h3>
${tbl(
  ['Caso', 'masch.', 'femm.', 'neutro'],
  [
    ['Nom.', 'der gute Mann', 'die gute Frau', 'das gute Kind'],
    ['Akk.', 'den guten Mann', 'die gute Frau', 'das gute Kind'],
    ['Dat.', 'dem guten Mann', 'der guten Frau', 'dem guten Kind'],
    ['Gen.', 'des guten Mannes', 'der guten Frau', 'des guten Kindes'],
  ],
)}
<p>Plurale: <i>die guten Kinder</i> (tutti i casi -en; dat. <i>den guten Kindern</i>). Regola: <b>-e</b> al nominativo singolare e all'accusativo di femminile e neutro, <b>-en</b> ovunque.</p>
<h3>Tabella 2: dopo ein / kein / mein (articolo indeterminativo)</h3>
${tbl(
  ['Caso', 'masch.', 'femm.', 'neutro'],
  [
    ['Nom.', 'ein guter Mann', 'eine gute Frau', 'ein gutes Kind'],
    ['Akk.', 'einen guten Mann', 'eine gute Frau', 'ein gutes Kind'],
    ['Dat.', 'einem guten Mann', 'einer guten Frau', 'einem guten Kind'],
    ['Gen.', 'eines guten Mannes', 'einer guten Frau', 'eines guten Kindes'],
  ],
)}
<p>Dove <b>ein</b> non ha desinenza (maschile nominativo, neutro nominativo e accusativo) la porta l'aggettivo: <b>-er, -es, -es</b>. Plurale con <i>keine, meine</i>: <i>keine guten Kinder</i>.</p>
<h3>Tabella 3: senza articolo</h3>
${tbl(
  ['Caso', 'masch.', 'femm.', 'neutro'],
  [
    ['Nom.', 'guter Wein', 'gute Milch', 'gutes Brot'],
    ['Akk.', 'guten Wein', 'gute Milch', 'gutes Brot'],
    ['Dat.', 'gutem Wein', 'guter Milch', 'gutem Brot'],
    ['Gen.', 'guten Weines', 'guter Milch', 'guten Brotes'],
  ],
)}
<p>Senza articolo l'aggettivo porta <b>le desinenze dell'articolo</b> (der, die, das...). Plurale: <i>gute Leute</i> [GU:-të LOI-të], dat. <i>guten Leuten</i>, gen. <i>guter Leute</i>. Vale anche dopo <i>viele, einige, mehrere, wenige</i> e i numeri.</p>
<h3>Participi come aggettivi</h3>
<p>Il participio presente (<b>-end</b>) è attivo, il passato (<b>Partizip II</b>) è passivo o risultativo; entrambi si declinano come aggettivi.</p>
${vsec('Participi in funzione di aggettivo', [
  ['die schlafenden Kinder', 'di: SHLA:-fën-dën KIN-da', 'i bambini che dormono'],
  ['das geöffnete Fenster', 'das gë-Ö-fnë-të FEN-sta', 'la finestra aperta'],
  ['ein gut ausgebildeter Mitarbeiter', 'ain GU:T AUS-gë-bil-dë-ta MIT-ar-bai-ta', 'un collaboratore ben formato'],
])}
<h3>Comparativo e superlativo</h3>
<p>Comparativo: <b>-er</b>; superlativo: <b>am -sten</b> (predicativo) o <b>der/die/das -ste</b> (attributivo). Molti monosillabi prendono l'<b>Umlaut</b>. Confronto: <b>so … wie</b> (uguaglianza), <b>… als</b> (maggioranza): «Er ist älter als ich.» [e:r ist EL-ta als iç].</p>
${vsec('Forme da sapere', [
  ['alt – älter – am ältesten', 'ALT – EL-ta – am EL-të-stën', 'vecchio'],
  ['groß – größer – am größten', 'GRO:SS – GRÖ:-ssa – am GRÖ:S-tën', 'grande'],
  ['gut – besser – am besten', 'GU:T – BE-ssa – am BE-stën', 'buono'],
  ['viel – mehr – am meisten', 'FI:L – ME:R – am MAI-stën', 'molto'],
  ['gern – lieber – am liebsten', 'GERN – LI:-ba – am LI:P-stën', 'volentieri'],
  ['hoch – höher – am höchsten', 'HO:CH – HÖ:-a – am HÖ:ç-stën', 'alto (altezza)'],
  ['nah – näher – am nächsten', 'NA: – NE:-a – am NE:ç-stën', 'vicino'],
])}
<p>Declinato: «der bessere Plan» [de:r BE-ssë-rë PLA:N], «ein besserer Plan». Attenzione: <b>hoch</b> perde la c davanti a una desinenza: <i>ein hoher Berg</i> [ain HO:-ha BERK].</p>
<h3>Aggettivi come nomi</h3>
<p>Gli aggettivi si possono nominalizzare con la <b>maiuscola</b> e la declinazione dell'aggettivo: <i>der Deutsche / ein Deutscher</i> [de:r DOI-tshë], <i>die Angestellte</i> [AN-gë-shtel-të], <i>das Gute</i>, <i>alles Gute</i>, <i>nichts Neues</i> [niçts NOI-ës], <i>etwas Schönes</i> [ET-vas SHÖ:-nës]. Dopo <b>etwas, nichts, viel, wenig</b> l'aggettivo prende <b>-es</b> (neutro) e la maiuscola; dopo <b>alles</b> prende <b>-e</b>: <i>alles Gute</i>.</p>
<h3>Ordine nel Mittelfeld: TeKaMoLo</h3>
<p>Dopo il verbo, i complementi seguono questo ordine: <b>Te</b>mporale, <b>Ka</b>usale, <b>Mo</b>dale, <b>Lo</b>kale. «Ich fahre <b>morgen</b> <b>wegen der Arbeit</b> <b>mit dem Zug</b> <b>nach Berlin</b>.» [iç FA:-rë MOR-gën VE:-gën de:r AR-bait mit dem TSU:K na:ch ber-LI:N]. I pronomi vanno prima dei nomi: «Ich gebe <b>es ihm</b>» (due pronomi: accusativo prima del dativo), ma «Ich gebe <b>dem Mann das Buch</b>» (due nomi: dativo prima dell'accusativo).</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>L'italiano non declina l'aggettivo: in tedesco una desinenza sbagliata si nota subito. Controlla sempre <b>articolo → caso → genere</b>.</li>
<li><b>«Più … di»</b> = <i>… als</i>, mai «wie» né «von»: «größer als ich».</li>
<li><b>«Il più bello»</b> = <i>der schönste</i> (articolo + -ste), non «am schönsten» davanti a un nome.</li>
<li>L'aggettivo nominalizzato è maiuscolo, quello usato come avverbio no: <i>Ich wünsche dir alles Gute</i>, ma <i>Das Essen ist gut</i>.</li>
</ul>
<div class="say"><b>Da ricordare.</b> Tre tabelle: det. (-e / -en), indet. (-er, -es dove manca la desinenza), zero (desinenze dell'articolo). Comparativo <i>-er … als</i>, superlativo <i>am -sten</i>. TeKaMoLo.</div>`,
  [
    q(
      'q1',
      'Completa: «Ich habe einen ___ Hund.» (groß)',
      ['großen', 'großer', 'große', 'großes'],
      0,
      "Dopo einen (accusativo maschile) l'aggettivo prende -en. Großer sarebbe nominativo maschile, großes nominativo o accusativo neutro.",
    ),
    q(
      'q2',
      'Completa: «Das ist ein ___ Kind.» (klein)',
      ['kleines', 'kleine', 'kleiner', 'kleinen'],
      0,
      "Ein non ha desinenza per il neutro nominativo, quindi la porta l'aggettivo: -es. Kleine sarebbe femminile o plurale.",
    ),
    q(
      'q3',
      'Completa: «Mit dem ___ Auto fahre ich nach Wien.» (neu)',
      ['neuen', 'neue', 'neues', 'neuer'],
      0,
      "Dopo dem (dativo neutro) tutti gli aggettivi finiscono in -en. Neue è tipico del nominativo o dell'accusativo femminile.",
    ),
    q(
      'q4',
      'Completa: «___ Kaffee schmeckt mir am besten.» (stark)',
      ['Starker', 'Starken', 'Starke', 'Starkes'],
      0,
      "Senza articolo l'aggettivo porta la desinenza dell'articolo: der Kaffee = nominativo maschile, quindi -er. Starken sarebbe dativo o accusativo.",
    ),
    q(
      'q5',
      'Completa: «Er ist ___ als sein Bruder.» (alt)',
      ['älter', 'am ältesten', 'so alt', 'ältere'],
      0,
      "Il confronto di maggioranza usa il comparativo con -er e l'Umlaut, seguito da als. Am ältesten è il superlativo, so alt vuole wie.",
    ),
    q(
      'q6',
      'Completa: «Ich wünsche dir alles ___.» (gut)',
      ['Gute', 'gute', 'Guten', 'Gutes'],
      0,
      "Dopo alles l'aggettivo nominalizzato prende -e (maiuscola): alles Gute. La forma Gutes si usa invece dopo etwas, nichts e viel.",
    ),
    q(
      'q7',
      'Quale ordine è corretto?',
      [
        'Ich fahre morgen mit dem Zug nach Berlin.',
        'Ich fahre nach Berlin mit dem Zug morgen.',
        'Ich fahre mit dem Zug morgen nach Berlin.',
        'Ich fahre nach Berlin morgen mit dem Zug.',
      ],
      0,
      "L'ordine standard è tempo, modo, luogo: morgen, mit dem Zug, nach Berlin. Le altre varianti scambiano questi blocchi senza motivo di enfasi.",
    ),
    q(
      'q8',
      'Come si pronuncia «größer»?',
      ['[GRÖ:-ssa]', '[GRÖ-sër]', '[GRO:-ssër]', '[GRÖ:-za]'],
      0,
      'La ö è lunga, ß vale s sorda e la -er finale suona «a». La forma [GRÖ-sër] ha invece ö breve e -er letto per esteso.',
    ),
    q(
      'q9',
      'Come si pronuncia «ein höherer Berg» (la parola «höher»)?',
      ['[HÖ:-a]', '[HOCH-ër]', '[HO:-er]', '[HÖ:CH-ër]'],
      0,
      "Höher ha ö lunga, h iniziale, e la -er finale suona «a»; il ch di hoch qui sparisce davanti alla desinenza. L'ultimo uso è errato.",
    ),
  ],
  [
    card(
      'c1',
      'Tabella 1 (dopo der/die/das)',
      'Nom. sing. e Akk. f./n.: <b>-e</b>. Tutto il resto: <b>-en</b>. <i>der gute Mann, den guten Mann</i>.',
    ),
    card(
      'c2',
      'Tabella 2 (dopo ein/kein/mein)',
      'Come la 1, ma <b>-er</b> (m. nom.), <b>-es</b> (n. nom./acc.): <i>ein guter Mann, ein gutes Kind</i>.',
    ),
    card(
      'c3',
      'Tabella 3 (senza articolo)',
      "Desinenze dell'articolo: <i>guter Wein, gute Milch, gutes Brot, guten Leuten</i>.",
    ),
    card(
      'c4',
      'Comparativo / superlativo',
      '<i>-er … als</i> / <i>am -sten</i>; Umlaut: <i>alt – älter – am ältesten</i>.',
    ),
    card('c5', 'Irregolari', '<i>gut – besser – am besten; viel – mehr – am meisten; gern – lieber – am liebsten</i>.'),
    card('c6', 'hoch → hoher', '<i>ein hoher Berg</i> [HO:-ha]: la c cade davanti alla desinenza.'),
    card(
      'c7',
      'Aggettivo nominalizzato',
      "<i>der Deutsche, ein Deutscher, die Angestellte, nichts Neues, alles Gute</i>: maiuscola e desinenza dell'aggettivo.",
    ),
    card(
      'c8',
      'TeKaMoLo',
      'Temporale, Kausale, Modale, Lokale: <i>morgen, wegen der Arbeit, mit dem Zug, nach Berlin</i>.',
    ),
    card(
      'c9',
      'Due pronomi / due nomi',
      'Pronomi: accusativo prima (<i>es ihm</i>); nomi: dativo prima (<i>dem Mann das Buch</i>).',
    ),
  ],
  [
    prac(
      'p1',
      'Completa: «Sie trägt ein ___ Kleid und ___ Schuhe.» (rot / schwarz)',
      '<i>Sie trägt ein rotes Kleid und schwarze Schuhe.</i> Nota: ein + neutro = -es; plurale senza articolo = -e.',
    ),
    prac(
      'p2',
      'Traduci: «Il mio migliore amico abita in una grande città.»',
      '<i>Mein bester Freund wohnt in einer großen Stadt.</i> Nota: dopo mein, nominativo maschile -er, ma il superlativo attributivo è <i>bester</i>; dopo einer (dativo f.) -en.',
    ),
    prac(
      'p3',
      'Metti in ordine TeKaMoLo: «ich / nach München / fahre / morgen / mit dem Zug»',
      '<i>Ich fahre morgen mit dem Zug nach München.</i> Nota: tempo, modo, luogo.',
    ),
    prac(
      'p4',
      'Correggi: «Er ist größer wie ich.»',
      '<i>Er ist größer als ich.</i> Nota: con il comparativo si usa als; wie solo con so … wie.',
    ),
    prac(
      'p5',
      'Produzione: descrivi in due frasi la tua casa con almeno tre aggettivi declinati.',
      'Esempio: <i>Ich wohne in einer kleinen Wohnung. Sie hat ein helles Wohnzimmer und eine moderne Küche.</i> Controlla la desinenza di ogni aggettivo.',
    ),
  ],
)
