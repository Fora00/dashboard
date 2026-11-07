import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT, vsec } from './pron'
import { tbl } from './b.util'

export const deKonj1: CourseModule = mod(
  'de-konj1',
  'Konjunktiv I e discorso indiretto',
  'Formazione, discorso indiretto, giornalismo e testi formali, concordanza dei tempi, soll/will',
  'b2',
  `<p class="lead">Il <b>Konjunktiv I</b> serve a <b>riportare le parole di altri</b> senza prendersene la responsabilità: è la lingua dei giornali, dei comunicati e dei testi formali. Nel parlato si usa quasi sempre l'indicativo o il Konjunktiv II; agli esami B2 devi però saperlo riconoscere e produrre.</p>
${PRON_SHORT}
<h3>Formazione</h3>
<p>Radice dell'infinito + <b>-e, -est, -e, -en, -et, -en</b>. Le forme davvero usate sono quasi solo la <b>terza persona singolare</b>.</p>
${tbl(
  ['Persona', 'kommen', 'haben', 'sein'],
  [
    ['er / sie / es', 'komme', 'habe', 'sei'],
    ['sie (plur.)', 'kämen (K II)', 'hätten (K II)', 'seien'],
  ],
)}
<p>Pronuncia: <i>komme</i> [KO-më], <i>habe</i> [HA:-bë], <i>sei</i> [ZAI], <i>seien</i> [ZAI-ën], <i>könne</i> [KÖ-në], <i>müsse</i> [MÜ-ssë], <i>wisse</i> [VI-ssë], <i>werde</i> [VER-dë].</p>
<p><b>Regola d'oro:</b> se la forma del Konjunktiv I è <b>uguale all'indicativo</b> (<i>sie haben, wir kommen, ich habe</i>), si sostituisce con il <b>Konjunktiv II</b> o con <i>würde</i> + infinito: «Sie sagten, sie <b>hätten</b> keine Zeit.» (non «sie haben»). <i>Sein</i> ha forme proprie in tutte le persone (<i>sei, seien</i>).</p>
<h3>I tempi del discorso indiretto</h3>
<p>Il tempo del verbo che introduce (<i>sagt, sagte</i>) <b>non cambia</b> il Konjunktiv I. Conta solo il rapporto temporale con il fatto riportato.</p>
${tbl(
  ['Discorso diretto', 'Indiretto'],
  [
    ['«Ich bin krank.»', 'Er sagte, er <b>sei</b> krank.'],
    ['«Ich war krank.» / «Ich bin krank gewesen.»', 'Er sagte, er <b>sei</b> krank <b>gewesen</b>.'],
    ['«Ich werde kommen.»', 'Er sagte, er <b>werde</b> kommen.'],
    ['«Wartet!»', 'Er sagte, wir <b>sollten</b> warten.'],
  ],
)}
${vsec('Esempi', [
  ['Er sagt, er sei krank.', 'e:r ZA:KT, e:r ZAI KRANK', 'Dice di essere malato.'],
  ['Sie sagte, sie habe keine Zeit.', 'zi: ZA:K-të, zi: HA:-bë KAI-në TSAIT', 'Disse di non avere tempo.'],
  [
    'Er berichtete, der Minister sei gestern zurückgetreten.',
    'e:r bë-RIÇ-të-të, de:r mi-NIS-ta zai GES-tërn tsu-RÜK-gë-tre:-tën',
    'Riferì che il ministro si era dimesso ieri.',
  ],
  ['Sie fragte, ob er komme.', 'zi: FRA:K-të, op e:r KO-më', 'Chiese se venisse.'],
  ['Er sagte, ich solle warten.', 'e:r ZA:K-të, iç ZO-lë VAR-tën', 'Disse che io aspettassi.'],
  [
    'Sie sagten, sie hätten keine Zeit.',
    'zi: ZA:K-tën, zi: HE-tën KAI-në TSAIT',
    'Dissero che non avevano tempo. (K II perché «haben» = indicativo)',
  ],
  [
    'Er sagte, sie würden morgen kommen.',
    'e:r ZA:K-të, zi: VÜR-dën MOR-gën KO-mën',
    'Disse che sarebbero venuti domani.',
  ],
])}
<h3>Deittici e pronomi</h3>
<p>Come in italiano, pronomi e indicatori di tempo e luogo si adattano al punto di vista di chi riporta: «<i>Ich</i> komme <i>morgen</i>.» → «Er sagte, <i>er</i> komme <i>am nächsten Tag</i>.»</p>
${tbl(
  ['Diretto', 'Indiretto'],
  [
    ['heute', 'an diesem Tag / am selben Tag'],
    ['morgen', 'am nächsten / folgenden Tag'],
    ['gestern', 'am Vortag / am Tag zuvor'],
    ['jetzt', 'zu diesem Zeitpunkt / damals'],
    ['hier', 'dort'],
  ],
)}
<h3>Domande e imperativi</h3>
<p>Domande con parola interrogativa: la parola resta, verbo in fondo: «Sie fragte, <b>wann</b> er komme.» Domande sì/no: <b>ob</b>. Ordini e inviti: <b>sollen</b> o <b>mögen</b> al Konjunktiv I: «Er sagte, ich <b>solle</b> warten.»</p>
<h3>Giornalismo e alternative</h3>
<ul>
<li><b>Verbi di riporto:</b> <i>sagen, behaupten, berichten, erklären, mitteilen, betonen, meinen, vermuten, bestätigen, bestreiten, zugeben</i>. Es.: <i>behaupten</i> [bë-HAUP-tën] (sostenere), <i>bestreiten</i> [bë-SHTRAI-tën] (negare).</li>
<li>«Laut Polizei <b>sei</b> der Täter geflüchtet.» [laut po-li-TSAI zai de:r TE:-ta gë-FLÜÇ-tët]: la stampa omette il verbo di riporto e usa solo il Konjunktiv I.</li>
<li><b>soll / will + infinito:</b> «Er <b>soll</b> reich sein.» (si dice che sia ricco); «Er <b>will</b> nichts gesehen haben.» (sostiene di non aver visto nulla).</li>
<li>Con <i>dass</i> o senza: «Er sagt, dass er krank sei» oppure «Er sagt, er sei krank.» (seconda posizione del verbo).</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>L'italiano <b>sposta i tempi</b> dopo un verbo al passato («disse che era malato», «che avrebbe chiamato»). Il tedesco con il Konjunktiv I <b>non li sposta</b>: <i>er sagte, er sei krank / er werde anrufen</i>.</li>
<li>Il congiuntivo italiano è ovunque («penso che sia»); il Konjunktiv I tedesco è <b>solo riportato</b>: dopo <i>ich glaube</i> si usa l'indicativo: «Ich glaube, er ist krank.»</li>
<li>Nel parlato quotidiano: «Er hat gesagt, er ist krank» o «er wäre krank». Il Konjunktiv I è formale, e il Konjunktiv II segnala spesso scetticismo.</li>
<li>Non confondere <i>sei</i> (Konjunktiv I) con <i>sein</i> (infinito e «suo») e con <i>sie</i> [zi:].</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Er sagte, er sei krank / er habe gearbeitet / er werde kommen.</i> Se K I = indicativo, passa a K II: <i>sie hätten, sie kämen</i>. Il tempo del verbo di riporto non conta.</div>`,
  [
    q(
      'q1',
      'Nella stampa, come si riporta «Ich bin krank», detto da lui?',
      ['Er sagte, er sei krank.', 'Er sagte, er ist krank.', 'Er sagte, er war krank.', 'Er sagte, er sein krank.'],
      0,
      'Il discorso indiretto formale usa il Konjunktiv I di sein, cioè sei. Ist e war sono indicativi, sein è un infinito che non si coniuga così.',
    ),
    q(
      'q2',
      'Completa: «Sie sagten, sie ___ keine Zeit.»',
      ['hätten', 'haben', 'hatten', 'hatte'],
      0,
      "La forma haben del Konjunktiv I coincide con l'indicativo, quindi si ricorre al Konjunktiv II: hätten. Hatten è un Präteritum indicativo.",
    ),
    q(
      'q3',
      'Completa: «Er fragte, ob sie schon ___.»',
      ['gegessen habe', 'gegessen hat', 'gegessen hatte', 'gegessen habt'],
      0,
      'Un fatto anteriore si esprime con il Perfekt del Konjunktiv I: gegessen habe. Hat è indicativo, habt è seconda persona plurale.',
    ),
    q(
      'q4',
      'Completa: «Er sagte: «Ich komme morgen.»» → «Er sagte, er ___ am nächsten Tag.»',
      ['komme', 'kommt', 'kam', 'kommst'],
      0,
      'La forma riportata al presente del Konjunktiv I è komme (terza persona). Kommt e kam sono indicativi, kommst è seconda persona.',
    ),
    q(
      'q5',
      'Completa: «Die Chefin sagte: «Warten Sie!»» → «Sie sagte, ich ___ warten.»',
      ['solle', 'soll', 'sollte', 'sollen'],
      0,
      "L'imperativo diventa sollen al Konjunktiv I: solle. Soll è indicativo, mentre sollte appartiene al Konjunktiv II o al Präteritum.",
    ),
    q(
      'q6',
      'Che cosa significa «Er soll reich sein»?',
      ['Si dice che sia ricco.', 'Dovrebbe diventare ricco.', 'Vuole essere ricco.', 'Deve essere ricco.'],
      0,
      'Soll + infinito riporta una voce non verificata, come «si dice che». Per il desiderio o la pretesa personale si usa invece will.',
    ),
    q(
      'q7',
      'Come si pronuncia «sei» (Konjunktiv I di sein)?',
      ['[ZAI]', '[SAI]', '[ZE:I]', '[SEI]'],
      0,
      "La s davanti a vocale è sonora (z di «rosa») e ei si legge come «ai» italiano. Una s sorda sarebbe tipica di chi legge all'italiana.",
    ),
    q(
      'q8',
      'Come si pronuncia «berichtete»?',
      ['[bë-RIÇ-të-të]', '[be-RIK-te-te]', '[bë-RICH-të-të]', '[BE-riçt-të]'],
      0,
      "Il prefisso be- è debole, l'accento cade su -richt e ch dopo i è l'ich-Laut [ç]. Il suono raschiato di «Bach» non va usato dopo i.",
    ),
    q(
      'q9',
      'Come si riporta «Ich war krank» detto da lui?',
      [
        'Er sagte, er sei krank gewesen.',
        'Er sagte, er war krank.',
        'Er sagte, er sei krank.',
        'Er sagte, er werde krank sein.',
      ],
      0,
      'Un fatto anteriore usa il Konjunktiv I del Perfekt: sei gewesen. Il presente sei indicherebbe che è malato adesso, werde sein un futuro.',
    ),
  ],
  [
    card(
      'c1',
      'Konjunktiv I',
      'Radice + -e, -est, -e, -en, -et, -en: <i>er komme, er habe, er sei</i>. Solo per il discorso riportato.',
    ),
    card('c2', 'Se K I = indicativo', 'Si passa al Konjunktiv II: <i>sie hätten, sie kämen, sie würden kommen</i>.'),
    card(
      'c3',
      'Tempi',
      'Contemporaneo: <i>er sei</i>. Anteriore: <i>er sei gewesen / habe gearbeitet</i>. Posteriore: <i>er werde kommen</i>.',
    ),
    card('c4', 'Imperativo riportato', '<i>Er sagte, ich solle warten.</i> (sollen / mögen al K I).'),
    card('c5', 'Domande', '<i>ob</i> per sì/no; parola interrogativa mantenuta: <i>Sie fragte, wann er komme.</i>'),
    card('c6', 'Deittici', '<i>heute → an diesem Tag; morgen → am nächsten Tag; gestern → am Vortag; hier → dort</i>.'),
    card(
      'c7',
      'soll / will',
      '<i>Er soll reich sein</i> = si dice. <i>Er will nichts gesehen haben</i> = sostiene di non aver visto.',
    ),
    card(
      'c8',
      'Verbi di riporto',
      'sagen, behaupten [bë-HAUP-tën], berichten, erklären, mitteilen, betonen, bestreiten [bë-SHTRAI-tën].',
    ),
    card(
      'c9',
      'Nessun spostamento dei tempi',
      'Non come in italiano («disse che era»): <i>er sagte, er sei krank</i>, anche con sagte al passato.',
    ),
  ],
  [
    prac(
      'p1',
      'Riporta: Anna sagte: «Ich habe keine Zeit.»',
      "<i>Anna sagte, sie habe keine Zeit.</i> Nota: il pronome passa da ich a sie e habe è il Konjunktiv I (diverso dall'indicativo hat).",
    ),
    prac(
      'p2',
      'Riporta: Der Politiker erklärte: «Wir werden die Steuern senken.»',
      "<i>Der Politiker erklärte, sie würden die Steuern senken.</i> Nota: «werden» al plurale coincide con l'indicativo, quindi würden (K II).",
    ),
    prac(
      'p3',
      'Riporta: Er fragte: «Kommst du morgen?»',
      '<i>Er fragte, ob ich am nächsten Tag komme.</i> Nota: ob, pronome e deittico cambiano.',
    ),
    prac(
      'p4',
      'Riporta: Sie sagte zu mir: «Warte hier!»',
      '<i>Sie sagte, ich solle dort warten.</i> Nota: imperativo = solle, hier diventa dort.',
    ),
    prac(
      'p5',
      'Traduci in stile giornalistico: «Secondo la polizia, il ladro sarebbe fuggito.»',
      '<i>Laut Polizei sei der Dieb geflüchtet.</i> Nota: nello stile della stampa il Konjunktiv I del Perfekt (sei geflüchtet) rende il «sarebbe» del condizionale giornalistico.',
    ),
  ],
)

export const deKonnektoren: CourseModule = mod(
  'de-konnektoren',
  'Connettori logici, Partizipialattribute e Nominalstil',
  'zwar … aber, nicht nur … sondern auch, je … desto, entweder … oder, weder … noch; Partizipialattribute; Funktionsverbgefüge',
  'b2',
  `<p class="lead">Al B2 si lega il testo con <b>connettori</b> e si compatta con lo <b>stile nominale</b>. Tre famiglie: coppie di connettori (<i>zwar … aber</i>), avverbi che <b>invertono</b> soggetto e verbo (<i>deshalb, trotzdem</i>) e congiunzioni che mandano il verbo in fondo.</p>
${PRON_SHORT}
<h3>Coppie di connettori</h3>
${vsec('Doppelkonnektoren', [
  ['zwar … aber', 'TSVAR … A:-ba', 'sì … ma'],
  ['nicht nur … sondern auch', 'niçt NU:R … ZON-dërn AUCH', 'non solo … ma anche'],
  ['entweder … oder', 'ENT-ve:-da … O:-da', 'o … o'],
  ['weder … noch', 'VE:-da … NOCH', 'né … né'],
  ['sowohl … als auch', 'zo-VO:L … als AUCH', 'sia … sia'],
  ['je … desto / umso', 'JE: … DES-to / UM-zo', 'più … più'],
  ['einerseits … andererseits', 'AI-na-zaits … AN-dë-ra-zaits', "da un lato … dall'altro"],
])}
${vsec('Esempi', [
  [
    'Das Hotel ist zwar teuer, aber sehr gut.',
    'das ho-TEL ist tsvar TOI-a, A:-ba ze:r GU:T',
    "L'hotel è caro, ma molto buono.",
  ],
  [
    'Sie spricht nicht nur Deutsch, sondern auch Französisch.',
    'zi: SHPRIÇT niçt nu:r DOITSH, ZON-dërn auch fran-TSÖ:-zish',
    'Parla non solo tedesco, ma anche francese.',
  ],
  ['Er hat weder Zeit noch Lust.', 'e:r hat VE:-da TSAIT noch LUST', 'Non ha né tempo né voglia.'],
  [
    'Je mehr ich lerne, desto besser verstehe ich.',
    'je: ME:R iç LER-në, DES-to BE-ssa fer-SHTE:-ë iç',
    'Più studio, meglio capisco.',
  ],
  [
    'Entweder wir fahren heute, oder wir bleiben bis morgen.',
    'ENT-ve:-da vi:r FA:-rën HOI-të, O:-da vi:r BLAI-bën bis MOR-gën',
    'O partiamo oggi o restiamo fino a domani.',
  ],
])}
<p>Nella frase con <b>je … desto</b> la prima parte ha il verbo in fondo, la seconda ha il verbo in seconda posizione preceduto dal comparativo (<i>desto besser verstehe ich</i>). Dopo <i>oder, aber, denn, und, sondern</i> non c'è inversione (posizione 0).</p>
<h3>Avverbi che invertono</h3>
<p>Dopo questi connettori il <b>verbo viene subito dopo</b>: «Er ist krank. <b>Deshalb bleibt er</b> zu Hause.» Mai «Deshalb er bleibt».</p>
${vsec('Connettori a inversione', [
  ['deshalb, deswegen, darum, daher', 'DES-halp, DES-ve:-gën, da-RUM, DA:-he:r', 'perciò'],
  ['trotzdem, dennoch', 'TROTS-de:m, DE-noch', 'tuttavia, nonostante ciò'],
  ['außerdem', 'AU-ssa-de:m', 'inoltre'],
  ['allerdings, jedoch', 'A-la-dings, je-DOCH', 'però, tuttavia'],
  ['folglich, somit', 'FOLK-liç, zo-MIT', 'di conseguenza'],
  ['sonst, andernfalls', 'ZONST, AN-dërn-fals', 'altrimenti'],
  ['stattdessen, hingegen', 'SHTAT-de-ssën, hin-GE:-gën', 'invece, al contrario'],
  ['inzwischen, anschließend', 'in-TSVI-shën, AN-shli:-ssënt', 'nel frattempo, in seguito'],
])}
<p>«Es regnet. Trotzdem gehen wir spazieren.» [es RE:G-nët. TROTS-de:m GE:-ën vi:r shpa-TSI:-rën]; «Du musst lernen, sonst fällst du durch.» [du MUST LER-nën, ZONST felst du DURÇ].</p>
<h3>Subordinate utili al B2</h3>
<ul>
<li><b>indem</b> (facendo, mediante): «Er lernt Deutsch, indem er viel liest.» [in-DE:M].</li>
<li><b>ohne dass / (an)statt dass</b>: senza che / invece di (con soggetti diversi).</li>
<li><b>sofern, soweit</b> (a condizione che / per quanto) [zo-FERN], <b>zumal</b> (tanto più che) [tsu-MA:L], <b>wobei</b> (mentre, nel fare) [vo-BAI], <b>wohingegen</b> (mentre invece), <b>da</b> (poiché) [DA:].</li>
</ul>
<h3>Partizipialattribute</h3>
<p>Il participio, declinato come un aggettivo, può portare con sé un <b>intero gruppo</b> davanti al nome: tipico dei testi scritti. Si scioglie in una relativa.</p>
${vsec('Dal gruppo alla relativa', [
  [
    'die von der Regierung beschlossenen Maßnahmen',
    'di: fon de:r re-GI:-rung bë-SHLO-ssë-nën MA:S-na:-mën',
    'le misure decise dal governo (= die Maßnahmen, die ... beschlossen wurden)',
  ],
  ['der seit Jahren steigende Verbrauch', 'de:r zait JA:-rën SHTAI-gën-dë fer-BRAUCH', 'il consumo che cresce da anni'],
])}
<h3>Nominalstil e Funktionsverbgefüge</h3>
<p>Lo stile nominale sostituisce verbi e subordinate con nomi: «<i>Wegen der Verspätung des Zuges</i>» invece di «<i>Weil der Zug Verspätung hatte</i>»; «<i>Nach bestandener Prüfung</i>» invece di «<i>Nachdem er die Prüfung bestanden hatte</i>». I <b>Funktionsverbgefüge</b> sono combinazioni fisse nome + verbo:</p>
${vsec('Funktionsverbgefüge', [
  ['in Anspruch nehmen', 'in AN-shpruch NE:-mën', 'avvalersi di, usare'],
  ['zur Verfügung stellen', 'tsur fer-FÜ:-gung SHTE-lën', 'mettere a disposizione'],
  ['in Betracht ziehen', 'in bë-TRACHT TSI:-ën', 'prendere in considerazione'],
  ['eine Entscheidung treffen', 'AI-në ent-SHAI-dung TRE-fën', 'prendere una decisione'],
  ['Verantwortung übernehmen', 'fer-ANT-vor-tung Ü:-ba-ne:-mën', 'assumersi la responsabilità'],
  ['in Frage stellen', 'in FRA:-gë SHTE-lën', 'mettere in dubbio'],
  ['zum Ausdruck bringen', 'tsum AUS-druk BRI-ngën', 'esprimere'],
  ['in Kraft treten', 'in KRAFT TRE:-tën', 'entrare in vigore'],
  ['Rücksicht nehmen auf', 'RÜK-ziçt NE:-mën auf', 'tener conto di'],
  ['unter Beweis stellen', 'UN-ta bë-VAIS SHTE-lën', 'dimostrare'],
  ['eine Rolle spielen', 'AI-në RO-lë SHPI:-lën', 'avere un ruolo'],
  ['Kritik üben an', 'kri-TI:K Ü:-bën an', 'criticare'],
])}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>«Ma» = aber</b>, ma dopo una negazione che esclude è <b>sondern</b>: «Er ist nicht dumm, <i>sondern</i> faul.»</li>
<li><b>«Perciò, quindi»</b> = <i>deshalb</i> con inversione, non come l'italiano «perciò io resto».</li>
<li><b>«Però»</b> = <i>aber</i> (posizione 0) o <i>allerdings</i> (inversione).</li>
<li><b>«Quindi»</b> può essere <i>also</i> (quindi) o <i>deshalb</i> (per questo motivo).</li>
<li><b>«Mentre»</b> = <i>während</i> (tempo) o <i>wohingegen</i> (contrasto).</li>
<li>Se usi <i>deshalb</i>, <i>trotzdem</i> ecc. la frase è <b>principale</b>, il verbo va in seconda posizione. Se usi <i>weil, obwohl</i> (subordinate) il verbo va in fondo.</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Er ist krank. Deshalb bleibt er zu Hause.</i> / <i>Er bleibt zu Hause, weil er krank ist.</i> <i>Je mehr, desto besser.</i> <i>Weder … noch.</i> <i>in Anspruch nehmen, in Betracht ziehen.</i></div>`,
  [
    q(
      'q1',
      'Completa: «Es regnet. ___ gehen wir spazieren.»',
      ['Trotzdem', 'Obwohl', 'Weil', 'Damit'],
      0,
      'Trotzdem è un avverbio di concessione e inverte soggetto e verbo. Obwohl, weil e damit sono congiunzioni che mandano il verbo in fondo.',
    ),
    q(
      'q2',
      'Quale frase è corretta?',
      [
        'Er ist krank. Deshalb bleibt er zu Hause.',
        'Er ist krank. Deshalb er bleibt zu Hause.',
        'Er ist krank. Deshalb er zu Hause bleibt.',
        'Er ist krank. Deshalb zu Hause er bleibt.',
      ],
      0,
      'Dopo un avverbio connettore in prima posizione il verbo coniugato è subito il secondo elemento: bleibt er. Le altre frasi lo spostano.',
    ),
    q(
      'q3',
      'Completa: «Sie spricht nicht nur Deutsch, ___ auch Französisch.»',
      ['sondern', 'aber', 'doch', 'und'],
      0,
      'La coppia fissa è nicht nur … sondern auch. Aber si usa con zwar, non per aggiungere un elemento a nicht nur.',
    ),
    q(
      'q4',
      'Completa: «___ mehr ich lerne, desto besser verstehe ich.»',
      ['Je', 'Wie', 'Als', 'So'],
      0,
      'La struttura comparativa proporzionale è je + comparativo, desto + comparativo. Wie, als e so non formano questa coppia.',
    ),
    q(
      'q5',
      'Completa: «Er hat ___ Zeit ___ Geld.»',
      ['weder … noch', 'entweder … oder', 'zwar … aber', 'sowohl … als auch'],
      0,
      'Per negare due elementi insieme si usa weder … noch, senza altra negazione. Entweder … oder indica una scelta tra due possibilità.',
    ),
    q(
      'q6',
      'Completa: «Ich bleibe, ___ ich bin müde.»',
      ['denn', 'weil', 'dass', 'obwohl'],
      0,
      'Dopo la virgola il verbo resta in seconda posizione (ich bin), quindi serve denn. Weil richiederebbe il verbo finale: weil ich müde bin.',
    ),
    q(
      'q7',
      'Come si pronuncia «sondern»?',
      ['[ZON-dërn]', '[SON-dern]', '[ZON-da:rn]', '[SHON-dërn]'],
      0,
      'S iniziale davanti a vocale è sonora (z) e la sillaba finale -ern si legge debole. Sh vale per sp e st iniziali, non qui.',
    ),
    q(
      'q8',
      'Come si pronuncia «Anspruch» (pretesa, diritto)?',
      ['[AN-shpruch]', '[AN-spruk]', '[an-SHPRUCH]', '[AN-shpruç]'],
      0,
      "L'accento è sul prefisso an-, sp dopo il prefisso vale shp e ch dopo u è il suono di «Bach». L'ich-Laut [ç] qui sarebbe sbagliato.",
    ),
    q(
      'q9',
      'Che cosa significa «in Anspruch nehmen»?',
      ['Avvalersi di, usare', 'Rifiutare con decisione', 'Ricevere in regalo', 'Prendere per sbaglio'],
      0,
      "Il Funktionsverbgefüge indica che si usa un servizio, un diritto o l'aiuto di qualcuno: «Ich nehme Ihre Hilfe in Anspruch».",
    ),
    q(
      'q10',
      'Che cosa significa «die von der Regierung beschlossenen Maßnahmen»?',
      [
        'Le misure decise dal governo',
        'Le misure che il governo decide',
        'Il governo che decide le misure',
        'Le decisioni sulle misure',
      ],
      0,
      'È un Partizipialattribut: il participio passato con il suo complemento davanti al nome equivale a una relativa passiva «che sono state decise dal governo».',
    ),
  ],
  [
    card('c1', 'zwar … aber [tsvar … A:-ba]', 'sì … ma: <i>Er ist zwar jung, aber erfahren.</i>'),
    card(
      'c2',
      'nicht nur … sondern auch',
      'non solo … ma anche. <i>sondern</i> [ZON-dërn] dopo negazione che esclude.',
    ),
    card('c3', 'je … desto', 'più … più: <i>Je mehr, desto besser.</i> Prima parte: verbo in fondo.'),
    card('c4', 'entweder … oder / weder … noch', 'o … o / né … né. <i>Er hat weder Zeit noch Lust.</i>'),
    card(
      'c5',
      'deshalb, trotzdem, außerdem',
      'Avverbi a inversione: il verbo segue subito (<i>Deshalb bleibt er</i>).',
    ),
    card('c6', 'Posizione 0', "<i>und, oder, aber, denn, sondern</i>: non influenzano l'ordine delle parole."),
    card('c7', 'indem [in-DE:M]', 'facendo, mediante: <i>Er lernt, indem er viel liest.</i>'),
    card(
      'c8',
      'Partizipialattribut',
      '<i>die beschlossenen Maßnahmen</i>: participio declinato davanti al nome = relativa.',
    ),
    card(
      'c9',
      'Funktionsverbgefüge',
      '<i>in Anspruch nehmen, in Betracht ziehen, in Frage stellen, zum Ausdruck bringen, in Kraft treten.</i>',
    ),
  ],
  [
    prac(
      'p1',
      'Traduci: «Non solo parla bene il tedesco, ma lo scrive anche bene.»',
      '<i>Er spricht nicht nur gut Deutsch, sondern schreibt es auch gut.</i> Nota: nicht nur … sondern auch; la seconda parte può avere un verbo proprio.',
    ),
    prac(
      'p2',
      'Unisci con trotzdem: «Das Wetter ist schlecht. Wir machen einen Ausflug.»',
      '<i>Das Wetter ist schlecht. Trotzdem machen wir einen Ausflug.</i> Nota: dopo trotzdem il verbo precede il soggetto.',
    ),
    prac(
      'p3',
      'Traduci: «Più leggo, più imparo.»',
      '<i>Je mehr ich lese, desto mehr lerne ich.</i> Nota: verbo in fondo nella prima parte, verbo seconda posizione nella seconda.',
    ),
    prac(
      'p4',
      'Trasforma in stile nominale: «Weil der Zug Verspätung hatte, kamen wir zu spät.»',
      '<i>Wegen der Verspätung des Zuges kamen wir zu spät.</i> Nota: wegen + genitivo.',
    ),
    prac(
      'p5',
      'Correggi: «Ich bin müde, deshalb ich gehe ins Bett.»',
      '<i>Ich bin müde, deshalb gehe ich ins Bett.</i> Nota: dopo deshalb il verbo viene subito, prima del soggetto.',
    ),
  ],
)

export const deRegistri: CourseModule = mod(
  'de-registri',
  'Registri, email e lettere, Partikeln e modi di dire',
  'Du / Sie, lettera formale e informale, Lebenslauf, reclami, doch, mal, eben, halt, ja, wohl, schon, abbreviazioni',
  'b2',
  `<p class="lead">Un tedesco corretto ma nel registro sbagliato suona strano. Qui impari a scegliere tra <b>Du e Sie</b>, a scrivere una <b>email formale</b>, un <b>Lebenslauf</b> e un <b>reclamo</b>, e a capire le piccole parole (<b>Partikeln</b>) che colorano il parlato: non si traducono, si sentono.</p>
${PRON_SHORT}
<h3>Du o Sie?</h3>
<p><b>Du</b> con amici, famiglia, bambini, colleghi giovani e nell'ambiente informale; <b>Sie</b> (maiuscolo, verbo alla terza plurale) con sconosciuti, clienti, superiori, uffici. Si passa al Du solo quando lo propone chi è più anziano o in posizione superiore («Wir können uns duzen.»).</p>
<h3>Lettera formale</h3>
<p>Struttura: mittente, luogo e data (<i>Mailand, den 6. November 2026</i>), <b>Betreff</b> (oggetto), <b>Anrede</b>, testo, formula di chiusura e firma. Dopo la virgola dell'apertura il testo inizia con la <b>minuscola</b> (se non è un nome o Sie / Ihr).</p>
${vsec('Aperture e chiusure', [
  ['Sehr geehrte Damen und Herren,', 'ZE:R gë-E:R-të DA-mën unt HE-rën', 'Gentili signore e signori,'],
  ['Sehr geehrte Frau Meier,', 'ZE:R gë-E:R-të FRAU MAI-a', 'Gentile signora Meier,'],
  ['Sehr geehrter Herr Dr. Schmidt,', 'ZE:R gë-E:R-ta HER DOK-tor SHMIT', 'Egregio dottor Schmidt,'],
  ['Mit freundlichen Grüßen', 'mit FROINT-li-çën GRÜ:-ssën', 'Cordiali saluti'],
  ['Liebe Anna, / Hallo Tom,', 'LI:-bë A-na / HA-lo TOM', 'Cara Anna, / Ciao Tom, (informale)'],
  [
    'Viele Grüße / Liebe Grüße / Bis bald',
    'FI:-lë GRÜ:-ssë / LI:-bë GRÜ:-ssë / bis BALT',
    'Un saluto / Un caro saluto / A presto',
  ],
])}
${vsec('Formule utili', [
  ['Ich beziehe mich auf Ihre Anzeige.', 'iç bë-TSI:-ë miç auf I:-rë AN-tsai-gë', 'Mi riferisco al Suo annuncio.'],
  [
    'Hiermit bewerbe ich mich um die Stelle.',
    'HI:R-mit bë-VER-bë iç miç um di: SHTE-lë',
    'Con la presente mi candido al posto.',
  ],
  [
    'Anbei sende ich Ihnen meinen Lebenslauf.',
    'AN-bai ZEN-dë iç I:-nën MAI-nën LE:-bëns-lauf',
    'In allegato Le invio il mio CV.',
  ],
  [
    'Für Rückfragen stehe ich Ihnen gern zur Verfügung.',
    'fü:r RÜK-fra:-gën SHTE:-ë iç I:-nën GERN tsur fer-FÜ:-gung',
    'Per domande sono a Sua disposizione.',
  ],
  ['Vielen Dank im Voraus.', 'FI:-lën DANK im fo-RAUS', 'Grazie in anticipo.'],
  [
    'Leider muss ich Ihnen mitteilen, dass …',
    'LAI-da MUS iç I:-nën MIT-tai-lën, das',
    'Purtroppo devo comunicarLe che …',
  ],
  ['Ich möchte mich über … beschweren.', 'iç MÖÇ-të miç Ü:-ba … bë-SHVE:-rën', 'Vorrei lamentarmi di …'],
  ['Ich bitte um eine schnelle Antwort.', 'iç BI-të um AI-në SHNE-lë ANT-vort', 'Chiedo una risposta rapida.'],
])}
<h3>Lebenslauf (CV) e reclamo</h3>
<p>Il <b>tabellarischer Lebenslauf</b> [ta-be-LA:-ri-sha LE:-bëns-lauf] è un elenco in ordine cronologico inverso: <i>Persönliche Daten</i> (dati personali), <i>Berufserfahrung</i> (esperienza), <i>Ausbildung</i> (formazione), <i>Kenntnisse</i> e <i>Sprachen</i> (es. <i>Muttersprache: Italienisch; Deutsch: B2</i>), <i>Interessen</i>. Lo accompagna il <i>Anschreiben</i> (lettera di presentazione). Il <b>reclamo</b>: oggetto chiaro, fatti con data, richiesta precisa, scadenza («Ich bitte um Erstattung bis zum 20. November.»).</p>
<h3>Partikeln: le piccole parole del parlato</h3>
<p>Di norma sono <b>atone</b>; non hanno una traduzione unica, esprimono l'atteggiamento di chi parla.</p>
${vsec('Partikeln', [
  ['Komm doch mit!', 'KOM doch MIT', 'Dai, vieni con noi!'],
  ['Doch, das stimmt!', 'DOCH, das SHTIMT', 'Sì invece, è vero! (contraddice una negazione)'],
  ['Schau mal!', 'SHAU MA:L', "Guarda un po'!"],
  ['Das ist halt so.', 'das ist HALT zo:', 'È così e basta.'],
  ['Dann bleiben wir eben zu Hause.', 'dan BLAI-bën vi:r E:-bën tsu HAU-zë', 'Allora restiamo a casa, pazienza.'],
  ['Das ist ja toll!', 'das ist JA: TOL', 'Ma è fantastico!'],
  ['Er ist wohl krank.', 'e:r ist VO:L KRANK', 'Sarà malato.'],
  ['Das wird schon klappen.', 'das virt SHO:N KLA-pën', 'Andrà bene, vedrai.'],
  ['Wie heißt du denn?', 'vi: HAIST du DEN', 'E come ti chiami, allora?'],
  ['Das ist aber nett!', 'das ist A:-ba NET', 'Che gentile!'],
  ['Das ist vielleicht ein Chaos!', 'das ist fi-LAIÇT ain KA:-os', 'Che caos!'],
])}
<h3>Modi di dire e abbreviazioni</h3>
${vsec('Modi di dire', [
  ['Ich verstehe nur Bahnhof.', 'iç fer-SHTE:-ë nu:r BA:N-ho:f', 'Non capisco niente.'],
  ['Das ist mir Wurst.', 'das ist mi:r VURST', 'Non mi importa.'],
  ['Hals- und Beinbruch!', 'HALS unt BAIN-bruch', 'In bocca al lupo!'],
  ['Daumen drücken', 'DAU-mën DRÜ-kën', 'incrociare le dita'],
  ['Schwein haben', 'SHVAIN HA:-bën', 'avere fortuna'],
  ['ins Fettnäpfchen treten', 'ins FET-nepf-çën TRE:-tën', 'fare una gaffe'],
  ['die Nase voll haben', 'di: NA:-zë FOL HA:-bën', 'averne piene le tasche'],
])}
${vsec('Abbreviazioni', [
  ['z. B. (zum Beispiel)', 'tsum BAI-shpi:l', 'per esempio'],
  ['usw. (und so weiter)', 'unt zo VAI-ta', 'eccetera'],
  ['d. h. (das heißt)', 'das HAIST', 'cioè'],
  ['u. a. (unter anderem)', 'UN-ta AN-dë-rëm', "tra l'altro"],
  ['bzw. (beziehungsweise)', 'bë-TSI:-ungs-vai-zë', 'ovvero'],
  ['ggf. (gegebenenfalls)', 'gë-GE:-bë-nën-fals', 'se del caso'],
  ['MwSt. (Mehrwertsteuer)', 'ME:R-vert-shtoi-a', 'IVA'],
  ['PLZ (Postleitzahl)', 'POST-lait-tsa:l', 'CAP'],
])}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>«Egregio / Gentile»</b> = <i>Sehr geehrter / Sehr geehrte</i>, non «Lieber» (troppo amichevole). «Cordiali saluti» = <i>Mit freundlichen Grüßen</i> (nelle email formali non si abbrevia in «MfG»).</li>
<li>Il <b>Lei</b> italiano è <b>Sie</b> con la maiuscola e il verbo alla terza plurale: <i>Können Sie mir helfen?</i>, non «Kann er?».</li>
<li><b>«Ciao»</b> in tedesco è <i>Hallo</i> (inizio), <i>Tschüss</i> [TSHÜS] (fine); «ciao» italiano si sente al Sud e in Svizzera.</li>
<li>Le Partikeln non vanno tradotte parola per parola: <i>Komm doch!</i> non è «ma vieni».</li>
<li>La data è giorno punto mese: <i>6. November 2026</i> o <i>06.11.2026</i>.</li>
</ul>
<div class="say"><b>Da ricordare.</b> <i>Sehr geehrte Frau Meier, … Mit freundlichen Grüßen.</i> Informale: <i>Liebe Anna, … Liebe Grüße.</i> Particelle: <i>doch</i> (dai), <i>mal</i> (un po'), <i>eben/halt</i> (pazienza), <i>ja</i> (ma guarda), <i>wohl</i> (sarà), <i>schon</i> (vedrai).</div>`,
  [
    q(
      'q1',
      'Come si apre una lettera a un destinatario sconosciuto?',
      ['Sehr geehrte Damen und Herren,', 'Liebe Damen und Herren,', 'Hallo allerseits,', 'Lieber Herr oder Frau,'],
      0,
      "La formula standard formale è Sehr geehrte Damen und Herren. Liebe e hallo sono troppo familiari per un'autorità o un'azienda.",
    ),
    q(
      'q2',
      'Quale chiusura è adatta a una lettera formale?',
      ['Mit freundlichen Grüßen', 'Bis später, tschüss!', 'Liebe Grüße an alle', 'Hdl und bis bald'],
      0,
      'Mit freundlichen Grüßen è la chiusura formale. Le altre sono informali o abbreviazioni da messaggio tra amici.',
    ),
    q(
      'q3',
      'Che cosa significa «Komm doch mit!»?',
      ['Dai, vieni con noi!', 'Ma non venire con noi!', 'Vieni solo con noi.', 'Sei venuto con noi?'],
      0,
      "La particella doch in un imperativo lo rende un invito amichevole e insistente. Non nega nulla, rafforza l'invito.",
    ),
    q(
      'q4',
      'Che cosa significa «Das ist halt so»?',
      ['È così e basta.', 'Questo è vero solo a metà.', 'Questo è molto salato.', 'Fermati, è così.'],
      0,
      "Halt (come eben) esprime rassegnazione di fronte a un fatto che non si può cambiare. Non ha relazione con l'imperativo «fermati».",
    ),
    q(
      'q5',
      'Che cosa significa «Er ist wohl krank»?',
      ['Sarà malato.', 'Sta bene, è malato.', 'È malato, ma sta meglio.', 'È sicuramente sano.'],
      0,
      'Wohl indica una supposizione, cioè «probabilmente». Non esprime sicurezza e non significa «bene», che in italiano è un altro uso.',
    ),
    q(
      'q6',
      'Che cosa significa «Ich verstehe nur Bahnhof»?',
      [
        'Non capisco niente.',
        'Capisco solo la parola stazione.',
        'Capisco tutto alla stazione.',
        'Capisco solo un poco.',
      ],
      0,
      'È un modo di dire: Bahnhof qui sta per «niente», non per la stazione. Tradurlo parola per parola cambia il senso.',
    ),
    q(
      'q7',
      'Che cosa significa «z. B.»?',
      ['per esempio', 'cioè', 'eccetera', 'ovvero'],
      0,
      'z. B. sta per zum Beispiel, cioè «per esempio». Cioè è d. h., eccetera è usw. e ovvero è bzw.',
    ),
    q(
      'q8',
      'Come si pronuncia «Lebenslauf» (CV)?',
      ['[LE:-bëns-lauf]', '[LE-ben-slaf]', '[LE:-bëns-lof]', '[le-BENS-lauf]'],
      0,
      "La e di Leben è lunga, l'accento è sulla prima sillaba e au vale «au» italiano. Le sillabe -en e -s sono deboli.",
    ),
    q(
      'q9',
      'Come si pronuncia «Verfügung»?',
      ['[fer-FÜ:-gung]', '[ver-FU-gung]', '[fer-FÜ-ging]', '[VER-fü-gung]'],
      0,
      "La v tedesca vale f, ü è lunga e l'accento cade su -fü-. Il prefisso ver- è sempre atono.",
    ),
    q(
      'q10',
      'Che cosa significa «Das wird schon klappen»?',
      ['Andrà bene, vedrai.', 'Questo si romperà presto.', 'Questo è già chiuso.', 'È già bello.'],
      0,
      'Schon qui non indica il tempo ma un rassicurante «vedrai». Klappen significa riuscire, funzionare, e non chiudere o rompersi.',
    ),
  ],
  [
    card(
      'c1',
      'Du / Sie',
      'Du: amici, famiglia, bambini. Sie: sconosciuti, clienti, superiori (maiuscolo, verbo alla 3a plur.).',
    ),
    card(
      'c2',
      'Sehr geehrte Frau Meier, … Mit freundlichen Grüßen',
      'Apertura e chiusura formali. Dopo la virgola: minuscola.',
    ),
    card('c3', 'Liebe Anna, … Liebe Grüße', 'Apertura e chiusura informali.'),
    card(
      'c4',
      'Lebenslauf [LE:-bëns-lauf]',
      'CV: dati personali, esperienza, formazione, conoscenze, lingue, interessi.',
    ),
    card(
      'c5',
      'doch / mal',
      "<i>Komm doch mit!</i> = dai, vieni. <i>Schau mal!</i> = guarda un po'. <i>Doch!</i> = sì invece.",
    ),
    card('c6', 'eben / halt', 'Rassegnazione: <i>Das ist halt so. Dann bleiben wir eben hier.</i>'),
    card(
      'c7',
      'ja / wohl / schon',
      '<i>Das ist ja toll!</i> (ma guarda) / <i>Er ist wohl krank</i> (sarà) / <i>Das wird schon</i> (vedrai).',
    ),
    card(
      'c8',
      'Das ist mir Wurst [VURST]',
      'Non mi importa. Altri: <i>Ich verstehe nur Bahnhof; Schwein haben; Daumen drücken.</i>',
    ),
    card(
      'c9',
      'Abbreviazioni',
      '<i>z. B.</i> per esempio; <i>usw.</i> eccetera; <i>d. h.</i> cioè; <i>bzw.</i> ovvero; <i>ggf.</i> se del caso.',
    ),
  ],
  [
    prac(
      'p1',
      "Scrivi l'apertura e la chiusura per una email alla signora Rossi (formale).",
      '<i>Sehr geehrte Frau Rossi, … Mit freundlichen Grüßen, [Nome]</i> Nota: nome dopo il titolo, virgola, testo con minuscola.',
    ),
    prac(
      'p2',
      'Traduci in formale: «Vorrei lamentarmi del servizio.»',
      '<i>Ich möchte mich über den Service beschweren.</i> Nota: sich beschweren über + Akk.',
    ),
    prac('p3', 'Traduci con una Partikel: «Dai, vieni!»', "<i>Komm doch!</i> Nota: doch rende l'invito più caldo."),
    prac(
      'p4',
      'Che significa «Das ist mir Wurst»?',
      'Non mi importa. Nota: modo di dire, non si traduce parola per parola.',
    ),
    prac(
      'p5',
      'Scrivi tre righe di reclamo per un pacco non arrivato.',
      'Esempio: <i>Sehr geehrte Damen und Herren, ich habe am 2. November ein Paket bestellt, es ist aber noch nicht angekommen. Ich bitte Sie, die Lieferung bis zum 15. November zu prüfen. Mit freundlichen Grüßen</i>',
    ),
  ],
)
