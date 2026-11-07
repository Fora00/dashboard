import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// German course part A, modules 7-9 (casi, perfekt, praeteritum). Notation: see tedesco.a.ts.

export const deCasi = mod(
  'de-casi',
  'Il dativo e le preposizioni',
  'Dativo, preposizioni con acc/dat, Wechselpräpositionen, verbi con dativo, pronomi nei tre casi, ordine acc/dat',
  'a2',
  `${PRON_SHORT}
<p class="lead">Il dativo risponde a <b>Wem?</b> (a chi?) ed è il caso del complemento di termine. In italiano l'«a» è visibile; in tedesco lo segnala l'<b>articolo</b>. Qui impari anche quali preposizioni vogliono quale caso: la parte più utile per parlare.</p>
<h3>Gli articoli nei tre casi</h3>
<table><tr><th></th><th>Nom.</th><th>Akk.</th><th>Dat.</th></tr>
<tr><td>maschile</td><td>der / ein</td><td>den / einen</td><td>dem / einem</td></tr>
<tr><td>femminile</td><td>die / eine</td><td>die / eine</td><td>der / einer</td></tr>
<tr><td>neutro</td><td>das / ein</td><td>das / ein</td><td>dem / einem</td></tr>
<tr><td>plurale</td><td>die / –</td><td>die / –</td><td>den / – (+ n)</td></tr></table>
<p>Anche <i>mein, dein, kein</i> seguono ein-: <i>meinem, meiner, meinen</i>. Al dativo plurale il nome prende <b>-n</b>: <i>mit den Kindern</i> (tranne i plurali in -n o -s). Esempi: <i>Ich gebe dem Kind einen Apfel. Ich schreibe der Lehrerin eine E-Mail.</i></p>
<h3>Preposizioni fisse</h3>
<ul><li><b>Accusativo</b>: <b>durch</b> [DURÇ] attraverso, <b>für</b> [FÜ:R] per, <b>gegen</b> [GÉ:-gën] contro, <b>ohne</b> [O:-në] senza, <b>um</b> [UM] intorno a (anche l'ora: um acht). Aiuto: <i>Ich kaufe das Buch für dich. Ohne den Hund gehe ich nicht.</i></li><li><b>Dativo</b>: <b>aus</b> [AUS] da (origine), <b>bei</b> [BAI] presso, <b>mit</b> [MIT] con, <b>nach</b> [NA:CH] dopo, verso (città, paesi), <b>seit</b> [ZAIT] da, <b>von</b> [FON] da, di, <b>zu</b> [TSU:] da, a (persone, luoghi). Aiuto: «aus-bei-mit-nach-seit-von-zu».</li></ul>
<p>Contrazioni: <i>im</i> (in dem), <i>am</i> (an dem), <i>zum</i> (zu dem), <i>zur</i> (zu der), <i>vom, beim, ins</i> (in das), <i>ans</i>. Scelta tra <b>nach, zu, in</b> per «a»: <i>nach Berlin / nach Italien / nach Hause</i> (città e paesi senza articolo); <i>zum Arzt / zu Peter / zur Schule</i> (persone, istituzioni); <i>in die Schweiz / in die Stadt</i> (paesi con articolo, luoghi chiusi). Residenza: <i>zu Hause</i> (a casa), <i>bei Peter</i> (da Peter), <i>in der Stadt</i>.</p>
<h3>Wechselpräpositionen: wo o wohin?</h3>
<p><b>an, auf, hinter, in, neben, über, unter, vor, zwischen</b> reggono il <b>dativo</b> per il luogo fermo (<i>Wo?</i>) e l'<b>accusativo</b> per il movimento verso il luogo (<i>Wohin?</i>).</p>
<table><tr><th>Wo? Dativ</th><th>Wohin? Akkusativ</th></tr>
<tr><td>Ich bin in der Schule.</td><td>Ich gehe in die Schule.</td></tr>
<tr><td>Das Buch liegt auf dem Tisch.</td><td>Ich lege das Buch auf den Tisch.</td></tr>
<tr><td>Die Flasche steht im Kühlschrank.</td><td>Ich stelle die Flasche in den Kühlschrank.</td></tr>
<tr><td>Er sitzt auf dem Stuhl.</td><td>Er setzt sich auf den Stuhl.</td></tr>
<tr><td>Das Bild hängt an der Wand.</td><td>Ich hänge das Bild an die Wand.</td></tr></table>
<p>I verbi vanno in coppia: <b>stehen / stellen</b> (stare in piedi / mettere in piedi), <b>liegen / legen</b>, <b>sitzen / setzen</b>, <b>hängen / hängen</b> (intransitivo forte: hing; transitivo debole: hängte). Pronuncia: Stuhl [SHTU:L], Kühlschrank [KÜ:L-shrank], Wand [VANT].</p>
<h3>Verbi con il dativo</h3>
<p>Alcuni verbi vogliono solo il dativo: <b>helfen</b> (<i>Ich helfe dir</i>), <b>danken</b> (<i>Ich danke Ihnen</i>), <b>gehören</b> (<i>Das Buch gehört mir</i>), <b>gefallen</b> (<i>Der Film gefällt mir</i> = mi piace, come «piace a me»), <b>schmecken</b> (<i>Es schmeckt mir</i>), <b>passen</b>, <b>fehlen</b>, <b>antworten</b>, <b>zuhören</b>, <b>gratulieren</b>. Trappola: in italiano «aiutare, ringraziare, rispondere» sono transitivi; in tedesco helfen, danken, antworten → dativo. Al contrario <b>fragen, besuchen, kennen, anrufen</b> vogliono l'accusativo: <i>Ich frage dich. Ich rufe ihn an.</i> Con geben, zeigen, schenken, schicken, erklären c'è anche un accusativo: <i>Ich zeige dir die Stadt.</i></p>
<h3>I pronomi personali nei tre casi</h3>
<table><tr><th>Persona</th><th>Nom.</th><th>Akk.</th><th>Dat.</th></tr>
<tr><td>io</td><td>ich</td><td>mich [MIÇ]</td><td>mir [MI:R]</td></tr>
<tr><td>tu</td><td>du</td><td>dich [DIÇ]</td><td>dir [DI:R]</td></tr>
<tr><td>lui / lei / esso</td><td>er / sie / es</td><td>ihn [I:N] / sie / es</td><td>ihm [I:M] / ihr [I:R] / ihm</td></tr>
<tr><td>noi</td><td>wir</td><td>uns [UNS]</td><td>uns</td></tr>
<tr><td>voi</td><td>ihr</td><td>euch [OIÇ]</td><td>euch</td></tr>
<tr><td>loro / Lei</td><td>sie / Sie</td><td>sie / Sie</td><td>ihnen [I:-nën] / Ihnen</td></tr></table>
<p>Dopo le preposizioni: <i>mit mir, für dich, ohne ihn, zu ihr, bei uns</i>.</p>
<h3>L'ordine di accusativo e dativo</h3>
<ul><li>due nomi: prima il dativo (persona), poi l'accusativo (cosa): <i>Ich gebe dem Mann das Buch.</i></li><li>un pronome e un nome: il pronome viene sempre prima: <i>Ich gebe ihm das Buch. Ich gebe es dem Mann.</i></li><li>due pronomi: prima l'accusativo, poi il dativo: <i>Ich gebe es ihm.</i> (diverso dall'italiano «glielo do»)</li></ul>
<div class="say"><b>Cosa dire.</b> «Kannst du mir helfen? Ich gebe dir das Buch morgen. Es gehört meiner Schwester, sie wohnt bei mir.»</div>`,
  [
    q(
      'q1',
      `Completa: «Ich helfe ___ Mann.»`,
      [`dem`, `den`, `der`, `das`],
      0,
      `Helfen vuole il dativo e Mann è maschile, quindi dem. Den è l'accusativo, la scelta dell'italiano che pensa a «aiutare» come transitivo.`,
    ),
    q(
      'q2',
      `Completa: «Ich fahre mit ___ Zug.»`,
      [`dem`, `den`, `der`, `die`],
      0,
      `Mit regge sempre il dativo e Zug è maschile. Den sarebbe la forma dell'accusativo, usata per errore con il mezzo di trasporto.`,
    ),
    q(
      'q3',
      `Completa: «Wohin? Ich gehe in ___ Schule.»`,
      [`die`, `der`, `den`, `dem`],
      0,
      `Il movimento verso un luogo (wohin) vuole l'accusativo e Schule è femminile. Der è il dativo di wo?, cioè il luogo fermo.`,
    ),
    q(
      'q4',
      `Completa: «Wo? Ich bin in ___ Schule.»`,
      [`der`, `die`, `den`, `dem`],
      0,
      `Il luogo fermo (wo) vuole il dativo e Schule è femminile: der. Die sarebbe l'accusativo di wohin.`,
    ),
    q(
      'q5',
      `Come si dice «Questo libro è mio»? (appartiene a me)`,
      [`Das Buch gehört mir.`, `Das Buch gehört mich.`, `Das Buch gehört ich.`, `Das Buch gehört mein.`],
      0,
      `Gehören vuole il dativo e il pronome dativo di ich è mir. Mich è l'accusativo e mein è un possessivo, non un pronome.`,
    ),
    q(
      'q6',
      `Quale frase ha l'ordine corretto?`,
      [`Ich gebe es ihm.`, `Ich gebe ihm es.`, `Ich gebe ihn es.`, `Ich gebe es ihn.`],
      0,
      `Con due pronomi viene prima l'accusativo (es) e poi il dativo (ihm). Ihm es è l'ordine dell'italiano «gli lo»; ihn è un accusativo maschile.`,
    ),
    q(
      'q7',
      `Quale frase con due nomi è corretta?`,
      [
        `Ich gebe dem Mann das Buch.`,
        `Ich gebe den Mann dem Buch.`,
        `Ich gebe dem Mann des Buch.`,
        `Ich gebe den Mann das Buch.`,
      ],
      0,
      `Il dativo va alla persona (dem Mann) e l'accusativo alla cosa (das Buch). Den Mann è un accusativo maschile e des è un genitivo.`,
    ),
    q(
      'q8',
      `Quale verbo vuole il dativo?`,
      [`helfen`, `fragen`, `besuchen`, `kennen`],
      0,
      `Helfen, come danken e antworten, vuole il dativo. Fragen, besuchen e kennen vogliono l'accusativo come in italiano.`,
    ),
    q(
      'q9',
      `Come si legge «ihnen» (a loro)?`,
      [`I:-nën: i lunga e n semplice`, `IN-nën: i breve e n doppia`, `I:-ën: senza la n`, `AI-nën: come ein`],
      0,
      `La i è lunga perché la h è muta e allunga. Le due n di ihnen non sono geminate, e l'ultima sillaba è debole.`,
    ),
    q(
      'q10',
      `Come si legge «euch» (voi)?`,
      [`OIÇ: eu = oi e ch debole`, `OICH: ch raschiata`, `EUK: come in italiano`, `EUÇ: eu come in «Europa» italiana`],
      0,
      `Eu si legge oi e dopo il dittongo la ch è debole (ç). L'italiano legge eu come e-u e ch come k.`,
    ),
  ],
  [
    card(
      'c1',
      `Dativ: dem / der / dem / den(+n)`,
      `Articoli determinativi al dativo: m dem, f der, n dem, pl den (nome con -n). Indeterminativi: einem, einer, einem.`,
    ),
    card(
      'c2',
      `Accusativo: durch, für, gegen, ohne, um`,
      `Preposizioni con l'accusativo (anche bis, entlang). Ich kaufe das Buch für dich.`,
    ),
    card(
      'c3',
      `Dativo: aus, bei, mit, nach, seit, von, zu`,
      `Preposizioni con il dativo. Mnemonico: aus-bei-mit-nach-seit-von-zu.`,
    ),
    card(
      'c4',
      `Wechselpräpositionen`,
      `an, auf, hinter, in, neben, über, unter, vor, zwischen: wo? dativo, wohin? accusativo.`,
    ),
    card(
      'c5',
      `stehen/stellen, liegen/legen, sitzen/setzen`,
      `Stato (dativo) / azione di mettere (accusativo): Es liegt auf dem Tisch / Ich lege es auf den Tisch.`,
    ),
    card(
      'c6',
      `helfen, danken, gehören, gefallen`,
      `Verbi con il dativo: Ich helfe dir. Das Buch gehört mir. Der Film gefällt mir.`,
    ),
    card(
      'c7',
      `fragen, besuchen, kennen, anrufen`,
      `Verbi con l'accusativo, come in italiano: Ich frage dich. Ich rufe ihn an.`,
    ),
    card(
      'c8',
      `ich / mich / mir`,
      `Nominativo / accusativo / dativo. du/dich/dir, er/ihn/ihm, sie/sie/ihr, wir/uns/uns, ihr/euch/euch, sie/sie/ihnen.`,
    ),
    card(
      'c9',
      `nach / zu / in per «a»`,
      `nach Berlin, nach Hause (città e paesi); zum Arzt, zur Schule (persone, istituzioni); in die Schweiz (paesi con articolo).`,
    ),
    card(
      'c10',
      `Ordine acc/dat`,
      `Due nomi: dativo prima. Pronome prima del nome. Due pronomi: accusativo prima (Ich gebe es ihm).`,
    ),
    card('c11', `ihnen [I:-nën], euch [OIÇ], mir [MI:R]`, `i lunga; eu = oi con ç; mir/dir con i lunga. Mai ch = k.`),
    card(
      'c12',
      `Contrazioni`,
      `im = in dem, am = an dem, zum = zu dem, zur = zu der, beim = bei dem, vom = von dem, ins = in das.`,
    ),
  ],
  [
    prac(
      'p1',
      `Traduci: «Do il libro a mia sorella e aiuto mio fratello.»`,
      `Ich gebe meiner Schwester das Buch und helfe meinem Bruder. Nota: dativo meiner (f) e meinem (m); helfen con il dativo.`,
    ),
    prac(
      'p2',
      `Traduci: «Metto il libro sul tavolo. Il libro è sul tavolo.»`,
      `Ich lege das Buch auf den Tisch. Das Buch liegt auf dem Tisch. Nota: lege (wohin, accusativo den) e liegt (wo, dativo dem).`,
    ),
    prac(
      'p3',
      `Sostituisci con i pronomi: «Ich gebe dem Mann das Buch.»`,
      `Ich gebe es ihm. Nota: due pronomi, accusativo prima del dativo; ihm per Mann, es per Buch.`,
    ),
    prac(
      'p4',
      `Correggi: «Ich danke dich. Er geht in der Schule. Das Buch gehört ich.»`,
      `Ich danke dir. Er geht in die Schule. Das Buch gehört mir. Nota: danken dativo; wohin accusativo; gehören dativo.`,
    ),
    prac(
      'p5',
      `Completa con la preposizione e il caso: «Ich fahre ___ Bus ___ Arbeit. Wir gehen ___ Arzt.»`,
      `Ich fahre mit dem Bus zur Arbeit. Wir gehen zum Arzt. Nota: mit e zu vogliono il dativo; zur = zu der, zum = zu dem.`,
    ),
  ],
)

export const dePerfekt = mod(
  'de-perfekt',
  'Il Perfekt',
  'Haben o sein, participi regolari, irregolari e separabili, uso parlato, ordine',
  'a2',
  `${PRON_SHORT}
<p class="lead">Il Perfekt è il passato del <b>parlato</b> tedesco, il corrispettivo del passato prossimo italiano: <b>haben / sein</b> alla seconda posizione e <b>Partizip II</b> in fondo. L'unica vera difficoltà è sapere quale ausiliare e come si forma il participio.</p>
<h3>La struttura</h3>
<p><i>Ich habe gestern Pizza gegessen. Wir sind nach Rom gefahren.</i> L'ausiliare è coniugato in seconda posizione; il participio va alla fine. Domanda: <i>Hast du schon gegessen?</i> Negazione: <i>Ich habe nicht gearbeitet. Ich habe keinen Film gesehen.</i></p>
<h3>Il participio II</h3>
<ul><li><b>Verbi deboli</b>: ge- + radice + -t: <i>machen → gemacht</i> [gë-MACHT], <i>kaufen → gekauft</i>, <i>spielen → gespielt</i>, <i>wohnen → gewohnt</i>, <i>lernen → gelernt</i>; con radice in t/d: <i>arbeiten → gearbeitet</i> [gë-AR-bai-tët].</li><li><b>Verbi forti</b>: ge- + radice (spesso con cambio di vocale) + -en: <i>gehen → gegangen</i> [gë-GAN-gën], <i>sehen → gesehen</i> [gë-ZÉ:-ën], <i>trinken → getrunken</i> [gë-TRUN-kën], <i>schreiben → geschrieben</i> [gë-SHRI:-bën].</li><li><b>Misti</b>: cambio di radice ma desinenza -t: <i>bringen → gebracht</i> [gë-BRACHT], <i>denken → gedacht</i>, <i>wissen → gewusst</i>, <i>kennen → gekannt</i>.</li></ul>
<table><tr><th>Infinito</th><th>Partizip II</th><th>Ausiliare</th></tr>
<tr><td>essen / trinken</td><td>gegessen [gë-GE-ssën] / getrunken</td><td>haben</td></tr>
<tr><td>sprechen / nehmen</td><td>gesprochen [gë-SHPRO-chën] / genommen [gë-NO-mën]</td><td>haben</td></tr>
<tr><td>lesen / schlafen</td><td>gelesen [gë-LÉ:-zën] / geschlafen</td><td>haben</td></tr>
<tr><td>gehen / kommen</td><td>gegangen / gekommen [gë-KO-mën]</td><td>sein</td></tr>
<tr><td>fahren / bleiben</td><td>gefahren [gë-FA:-rën] / geblieben [gë-BLI:-bën]</td><td>sein</td></tr>
<tr><td>sein / haben</td><td>gewesen [gë-VÉ:-zën] / gehabt [gë-HA:PT]</td><td>sein / haben</td></tr></table>
<h3>Senza ge- e verbi separabili</h3>
<p><b>Nessun ge-</b> con i prefissi inseparabili (<i>be-, emp-, ent-, er-, ge-, ver-, zer-</i>) e con i verbi in <b>-ieren</b>: <i>besuchen → besucht, verstehen → verstanden, bekommen → bekommen, erklären → erklärt, vergessen → vergessen, studieren → studiert, telefonieren → telefoniert, passieren → passiert</i>. Nei <b>separabili</b> il ge- si inserisce tra prefisso e radice: <i>aufstehen → aufgestanden, einkaufen → eingekauft, anrufen → angerufen, mitkommen → mitgekommen, ankommen → angekommen, fernsehen → ferngesehen</i>. Frase: <i>Ich bin um sieben aufgestanden. Hast du ihn angerufen?</i></p>
<h3>Haben o sein?</h3>
<p>Con <b>sein</b>: verbi di <b>cambio di luogo</b> (gehen, kommen, fahren, fliegen, laufen, reisen, ankommen, abfahren, aufstehen) e di <b>cambio di stato</b> (einschlafen, aufwachen, werden, sterben), più <b>sein, bleiben, passieren</b>. Tutti gli altri con <b>haben</b>, compresi i transitivi di movimento con oggetto: <i>Ich bin nach Rom gefahren</i> ma <i>Ich habe das Auto gefahren</i>.</p>
<p>Differenze con l'italiano: «ho dormito» = <i>ich habe geschlafen</i>; «sono stato in Germania» = <i>ich bin in Deutschland gewesen</i> (o <i>war ...</i>); i riflessivi italiani con «essere» vogliono <b>haben</b> in tedesco: «mi sono lavato» = <i>ich habe mich gewaschen</i>. Nel sud (Baviera, Austria, Svizzera) stehen, sitzen, liegen vogliono <i>sein</i> (<i>ich bin gestanden</i>), nel nord <i>haben</i>.</p>
<h3>Uso e parole del tempo</h3>
<p>Il Perfekt si usa nel parlato e nei messaggi per ogni fatto passato, anche se italiano userebbe l'imperfetto. Nello scritto narrativo compare il Präteritum (modulo successivo). Segnali: <b>gestern</b> [GES-tern], <b>vorgestern</b> [FO:R-ges-tern], <b>letzte Woche</b> [LETS-të VO-chë], <b>am Wochenende</b>, <b>schon</b> [SHO:N] (già), <b>noch nicht</b> (non ancora), <b>gerade</b> (appena). <i>Ich habe schon gegessen. Er ist noch nicht gekommen.</i> L'ordine con un'altra espressione in prima posizione: <i>Gestern habe ich einen Film gesehen</i> (V2).</p>
<h3>Pronuncia</h3>
<p>Il prefisso <b>ge-</b> non è accentato e si legge debole: <i>gemacht</i> [gë-MACHT]. Dopo a, la ch di <i>gemacht</i> è raschiata. Il participio <i>gearbeitet</i> ha due vocali debole-forte. L'accento cade sulla radice.</p>
<div class="say"><b>Cosa dire.</b> «Gestern bin ich um sieben aufgestanden. Ich habe Kaffee getrunken und bin zur Arbeit gefahren. Abends habe ich einen Film gesehen.»</div>`,
  [
    q(
      'q1',
      `Qual è il participio di «machen»?`,
      [`gemacht`, `gemachen`, `gemachtet`, `gemacht-en`],
      0,
      `Machen è debole: ge- + radice + -t. Gemachen sarebbe forte, e gemachtet aggiunge una e di appoggio non necessaria.`,
    ),
    q(
      'q2',
      `Qual è il participio di «gehen»?`,
      [`gegangen`, `gegehen`, `gegeht`, `gegangt`],
      0,
      `Gehen è forte e cambia radice: gegangen. Gegeht è la tentazione di applicare la regola debole.`,
    ),
    q(
      'q3',
      `Completa: «Ich ___ nach Rom gefahren.»`,
      [`bin`, `habe`, `werde`, `hatte`],
      0,
      `Fahren indica cambio di luogo, quindi vuole sein. Habe va usato solo se fahren ha un oggetto diretto (das Auto gefahren).`,
    ),
    q(
      'q4',
      `Qual è il participio di «aufstehen»?`,
      [`aufgestanden`, `geaufstanden`, `aufstanden`, `aufgestehen`],
      0,
      `Nei verbi separabili ge- sta tra prefisso e radice, e stehen è forte. Geaufstanden mette ge- davanti al prefisso.`,
    ),
    q(
      'q5',
      `Qual è il participio di «verstehen»?`,
      [`verstanden`, `geverstanden`, `verstehen`, `verstehnt`],
      0,
      `Il prefisso inseparabile ver- elimina ge-, e stehen è forte (stand-, standen). Geverstanden è la tentazione di aggiungere ge-.`,
    ),
    q(
      'q6',
      `Quale frase ha l'ordine corretto?`,
      [
        `Gestern habe ich einen Film gesehen.`,
        `Gestern ich habe einen Film gesehen.`,
        `Gestern habe ich gesehen einen Film.`,
        `Gestern habe gesehen ich einen Film.`,
      ],
      0,
      `L'ausiliare è in seconda posizione, il soggetto lo segue dopo Gestern e il participio va in fondo. Le altre frasi violano V2 o spostano il participio.`,
    ),
    q(
      'q7',
      `Come dici «Mi sono lavato»?`,
      [`Ich habe mich gewaschen.`, `Ich bin mich gewaschen.`, `Ich habe mir gewaschen.`, `Ich bin gewaschen.`],
      0,
      `I riflessivi tedeschi vogliono haben, anche se in italiano si usa «essere». Ich bin gewaschen significa «sono stato lavato».`,
    ),
    q(
      'q8',
      `Qual è il participio di «studieren»?`,
      [`studiert`, `gestudiert`, `studieren`, `gestudierd`],
      0,
      `I verbi in -ieren non prendono ge-. Gestudiert è la forma attesa dallo studente che applica la regola debole.`,
    ),
    q(
      'q9',
      `Come si legge «gemacht» (fatto)?`,
      [`gë-MACHT: ge- debole, ch raschiata`, `gë-MAKT: ch come k`, `gë-MAÇT: ch debole`, `ge-MA-chët: tre sillabe`],
      0,
      `Dopo a la ch è raschiata. L'accento cade sulla radice, e ge- è una sillaba debole che l'italiano tende ad accentare.`,
    ),
    q(
      'q10',
      `Come si legge «getrunken» (bevuto)?`,
      [
        `gë-TRUN-kën: ge- senza accento`,
        `GË-trun-kën: accento su ge-`,
        `ge-trun-KEN: accento in fondo`,
        `gë-TRUNK-ën: due sillabe forti`,
      ],
      0,
      `Nei participi l'accento è sulla radice e ge- è debole. L'accento sul prefisso è un'abitudine italiana (come in «gettato»).`,
    ),
  ],
  [
    card(
      'c1',
      `Perfekt = haben/sein + Partizip II`,
      `Ausiliare in seconda posizione, participio in fondo: Ich habe gegessen.`,
    ),
    card('c2', `Participio debole`, `ge- + radice + -t: gemacht, gekauft, gewohnt. Con radice in t/d: gearbeitet.`),
    card(
      'c3',
      `Participio forte`,
      `ge- + radice (± cambio) + -en: gegangen, gesehen, getrunken, geschrieben, gegessen, gesprochen, genommen.`,
    ),
    card('c4', `Participi misti`, `bringen → gebracht; denken → gedacht; wissen → gewusst; kennen → gekannt.`),
    card(
      'c5',
      `Nessun ge-`,
      `Prefissi inseparabili e verbi in -ieren: besucht, verstanden, bekommen, studiert, telefoniert.`,
    ),
    card('c6', `Separabili: ge- in mezzo`, `aufgestanden, eingekauft, angerufen, mitgekommen, ferngesehen.`),
    card(
      'c7',
      `Sein nel Perfekt`,
      `Cambio di luogo (gehen, kommen, fahren, fliegen, reisen), cambio di stato (einschlafen, werden), e sein, bleiben, passieren.`,
    ),
    card(
      'c8',
      `Haben nel Perfekt`,
      `Tutti gli altri verbi, anche i riflessivi: Ich habe mich gewaschen. E: Ich habe das Auto gefahren.`,
    ),
    card('c9', `gewesen, gehabt`, `Participi di sein (con sein: ich bin gewesen) e haben (ich habe gehabt).`),
    card(
      'c10',
      `Sud: bin gestanden`,
      `In Baviera, Austria, Svizzera stehen/sitzen/liegen vogliono sein; nel nord haben.`,
    ),
    card('c11', `ge- debole`, `Mai accentato: gë-MACHT, gë-TRUN-kën. L'accento cade sulla radice.`),
    card('c12', `gestern, schon, noch nicht, gerade`, `ieri, già, non ancora, appena. Segnali tipici del Perfekt.`),
  ],
  [
    prac(
      'p1',
      `Traduci: «Ieri ho mangiato una pizza e ho bevuto una birra.»`,
      `Gestern habe ich eine Pizza gegessen und ein Bier getrunken. Nota: haben con essen e trinken; participi forti; V2 dopo Gestern.`,
    ),
    prac(
      'p2',
      `Traduci: «Siamo arrivati alle otto e abbiamo chiamato Anna.»`,
      `Wir sind um acht angekommen und haben Anna angerufen. Nota: ankommen con sein; anrufen con haben; separabili con ge- in mezzo.`,
    ),
    prac(
      'p3',
      `Scrivi il Perfekt: «Er lernt Deutsch. Sie fährt nach Wien. Ich vergesse das Buch. Wir studieren Medizin.»`,
      `Er hat Deutsch gelernt. Sie ist nach Wien gefahren. Ich habe das Buch vergessen. Wir haben Medizin studiert. Nota: vergessen (inseparabile) e studieren (-ieren) senza ge-.`,
    ),
    prac(
      'p4',
      `Correggi: «Ich habe gegangen nach Hause. Er hat gekommen. Ich bin mich gewaschen.»`,
      `Ich bin nach Hause gegangen. Er ist gekommen. Ich habe mich gewaschen. Nota: gehen e kommen con sein; i riflessivi con haben.`,
    ),
    prac(
      'p5',
      `Racconta in 4 frasi il tuo ultimo fine settimana al Perfekt.`,
      `Am Samstag habe ich lange geschlafen. Dann bin ich in die Stadt gefahren und habe eingekauft. Abends habe ich Freunde getroffen. Am Sonntag bin ich zu Hause geblieben. Nota: ricorda aufstehen/einkaufen come separabili con ge- in mezzo.`,
    ),
  ],
)

export const dePraeteritum = mod(
  'de-praeteritum',
  'Il Präteritum e i 40 verbi più comuni',
  'War, hatte e modali, verbi deboli e forti, lista dei 40 verbi più comuni, scritto e parlato',
  'a2',
  `${PRON_SHORT}
<p class="lead">Il Präteritum è il passato dello <b>scritto</b> (romanzi, articoli, relazioni). Si usa anche parlando con <b>sein, haben e i modali</b>. Non corrisponde né all'imperfetto né al passato remoto italiano: copre entrambi.</p>
<h3>War, hatte e i modali</h3>
<table><tr><th>Persona</th><th>war</th><th>hatte</th><th>konnte</th></tr>
<tr><td>ich</td><td>war [VA:R]</td><td>hatte [HA-të]</td><td>konnte [KON-të]</td></tr>
<tr><td>du</td><td>warst [VA:RST]</td><td>hattest [HA-tëst]</td><td>konntest</td></tr>
<tr><td>er / sie / es</td><td>war</td><td>hatte</td><td>konnte</td></tr>
<tr><td>wir / sie</td><td>waren [VA:-rën]</td><td>hatten [HA-tën]</td><td>konnten</td></tr>
<tr><td>ihr</td><td>wart [VA:RT]</td><td>hattet [HA-tët]</td><td>konntet</td></tr></table>
<p>Gli altri modali: <i>musste</i> [MUS-të], <i>wollte</i> [VOL-të], <i>durfte</i> [DURF-të], <i>sollte</i> [ZOL-të], <i>mochte</i> [MOCH-të]. Senza umlaut (diversamente dal presente plurale). Frasi: <i>Gestern war ich krank. Ich hatte Kopfschmerzen. Ich konnte nicht kommen. Wir mussten arbeiten.</i> Ich e er hanno la stessa forma, senza desinenza.</p>
<h3>Verbi deboli e forti</h3>
<p><b>Deboli</b>: radice + <b>-te</b> (con e di appoggio -ete): <i>machen → machte, machtest, machte, machten, machtet, machten</i>; <i>arbeiten → arbeitete</i>. <b>Forti</b>: la radice cambia vocale e ich/er non hanno desinenza: <i>gehen → ging</i>: ich ging, du gingst, er ging, wir gingen, ihr gingt, sie gingen. Dei forti, i <b>misti</b> (bringen, denken, wissen, kennen) prendono cambio di radice e -te. Un Präteritum non cambia la desinenza di ich = er.</p>
<h3>I 40 verbi più comuni</h3>
<table><tr><th>Infinito</th><th>Präteritum</th><th>Partizip II</th></tr>
<tr><td>sein / haben / werden</td><td>war [VA:R] / hatte / wurde [VUR-dë]</td><td>gewesen / gehabt / geworden (s)</td></tr>
<tr><td>gehen / kommen</td><td>ging [GING] / kam [KA:M]</td><td>gegangen (s) / gekommen (s)</td></tr>
<tr><td>sehen / geben</td><td>sah [ZA:] / gab [GA:P]</td><td>gesehen / gegeben</td></tr>
<tr><td>nehmen / essen</td><td>nahm [NA:M] / aß [A:SS]</td><td>genommen / gegessen</td></tr>
<tr><td>trinken / sprechen</td><td>trank [TRANK] / sprach [SHPRA:CH]</td><td>getrunken / gesprochen</td></tr>
<tr><td>schreiben / lesen</td><td>schrieb [SHRI:P] / las [LA:S]</td><td>geschrieben / gelesen</td></tr>
<tr><td>finden / bleiben</td><td>fand [FANT] / blieb [BLI:P]</td><td>gefunden / geblieben (s)</td></tr>
<tr><td>fahren / laufen</td><td>fuhr [FU:R] / lief [LI:F]</td><td>gefahren (s) / gelaufen (s)</td></tr>
<tr><td>schlafen / stehen</td><td>schlief [SHLI:F] / stand [SHTANT]</td><td>geschlafen / gestanden</td></tr>
<tr><td>sitzen / liegen</td><td>saß [ZA:SS] / lag [LA:K]</td><td>gesessen / gelegen</td></tr>
<tr><td>helfen / treffen</td><td>half [HALF] / traf [TRA:F]</td><td>geholfen / getroffen</td></tr>
<tr><td>bringen / denken</td><td>brachte [BRACH-të] / dachte [DACH-të]</td><td>gebracht / gedacht</td></tr>
<tr><td>wissen / kennen</td><td>wusste [VUS-të] / kannte [KAN-të]</td><td>gewusst / gekannt</td></tr>
<tr><td>heißen / rufen</td><td>hieß [HI:SS] / rief [RI:F]</td><td>geheißen / gerufen</td></tr>
<tr><td>anfangen / beginnen</td><td>fing an [FING AN] / begann [bë-GAN]</td><td>angefangen / begonnen</td></tr>
<tr><td>verstehen / vergessen</td><td>verstand / vergaß [fer-GA:SS]</td><td>verstanden / vergessen</td></tr>
<tr><td>bekommen / tun</td><td>bekam [bë-KA:M] / tat [TA:T]</td><td>bekommen / getan</td></tr>
<tr><td>schwimmen / fliegen</td><td>schwamm [SHVAM] / flog [FLO:K]</td><td>geschwommen / geflogen (s)</td></tr>
<tr><td>ziehen / gewinnen</td><td>zog [TSO:K] / gewann [gë-VAN]</td><td>gezogen / gewonnen</td></tr>
<tr><td>verlieren</td><td>verlor [fer-LO:R]</td><td>verloren</td></tr></table>
<p>(s) = ausiliare sein nel Perfekt. Pronuncia: sah, gab, nahm sono vocale lunga; saß con ß dopo vocale lunga. Dall'italiano: «ero» e «ho avuto» tradotti da war e hatte; «potevo» da konnte (non könnte, che è ipotetico).</p>
<h3>Scritto o parlato?</h3>
<p>Il Präteritum narrativo (<i>Er ging nach Hause, nahm ein Buch und las bis spät</i>) è tipico di romanzi, giornali, fiabe. Nel <b>parlato</b> si preferisce il Perfekt, ma si dice sempre <i>ich war, ich hatte, ich musste, ich konnte</i>. Nel nord Germania il Präteritum parlato è più frequente; in Svizzera e al sud è raro fuori da sein, haben e modali. Un solo tempo tedesco corrisponde sia a «andò» sia a «andava»: <i>Als ich klein war, spielte ich oft Fußball</i> (imperfetto); <i>Dann ging er</i> (passato remoto).</p>
<div class="say"><b>Cosa dire.</b> «Gestern war ich krank und konnte nicht arbeiten. Ich blieb im Bett und las ein Buch.»</div>`,
  [
    q(
      'q1',
      `Qual è il Präteritum di «sein» per ich?`,
      [`war`, `bin`, `wäre`, `wurde`],
      0,
      `War è il Präteritum di sein. Bin è il presente, wäre il congiuntivo II e wurde il Präteritum di werden.`,
    ),
    q(
      'q2',
      `Come dici «Ieri avevo mal di testa»?`,
      [
        `Gestern hatte ich Kopfschmerzen.`,
        `Gestern haben ich Kopfschmerzen.`,
        `Gestern habete ich Kopfschmerzen.`,
        `Gestern hat ich Kopfschmerzen.`,
      ],
      0,
      `Haben fa hatte al Präteritum. Le altre forme applicano le desinenze del presente senza il cambio di radice.`,
    ),
    q(
      'q3',
      `Come dici «Non potevo venire»?`,
      [`Ich konnte nicht kommen.`, `Ich könnte nicht kommen.`, `Ich kannte nicht kommen.`, `Ich kannst nicht kommen.`],
      0,
      `Il Präteritum di können è konnte, senza umlaut. Könnte è l'ipotetico (potrei) e kannte viene da kennen.`,
    ),
    q(
      'q4',
      `Qual è il Präteritum di «gehen» (er)?`,
      [`ging`, `geht`, `gehte`, `gegangen`],
      0,
      `Gehen è forte e cambia radice: ging. Gehte applica la regola debole, e gegangen è il participio.`,
    ),
    q(
      'q5',
      `Qual è il Präteritum debole di «machen» (er)?`,
      [`machte`, `macht`, `machtete`, `mach`],
      0,
      `Radice + -te, senza ulteriori desinenze per ich ed er. Macht è il presente, machtete aggiunge un'inutile e di appoggio.`,
    ),
    q(
      'q6',
      `Qual è il Präteritum di «kommen» (er)?`,
      [`kam`, `kommte`, `kom`, `kamm`],
      0,
      `Kommen è forte: kam, con a lunga e m semplice. Kamm è una parola diversa (pettine) e kommte non esiste.`,
    ),
    q(
      'q7',
      `In una chiacchierata nel sud della Germania, per un fatto di ieri si usa di solito:`,
      [
        `Il Perfekt, tranne war, hatte e i modali`,
        `Il Präteritum per ogni verbo`,
        `Solo il Futur`,
        `Solo il congiuntivo II`,
      ],
      0,
      `Nel parlato il Perfekt prevale, ma sein, haben e i modali restano al Präteritum. Il Präteritum di tutti i verbi è tipico dello scritto.`,
    ),
    q(
      'q8',
      `Qual è il Präteritum di «denken» (io)?`,
      [`dachte`, `denkte`, `gedacht`, `dankte`],
      0,
      `Denken è misto: radice cambiata (dach-) e desinenza -te. Denkte applica la regola debole e gedacht è il participio.`,
    ),
    q(
      'q9',
      `Come si legge «sprach» (parlò)?`,
      [
        `SHPRA:CH: a lunga, ch raschiata`,
        `SPRA:K: sp come in italiano`,
        `SHPRAÇ: ch debole`,
        `SHPRATSH: con tsch finale`,
      ],
      0,
      `Sp iniziale è shp e dopo a la ch è raschiata. La a è lunga perché c'è una sola consonante dopo.`,
    ),
    q(
      'q10',
      `Come si legge «blieb» (rimase)?`,
      [
        `BLI:P: ie = i lunga e b finale = p`,
        `BLIEB: letto lettera per lettera`,
        `BLAIP: come ei`,
        `BLI:B: con b sonora`,
      ],
      0,
      `Ie è una i lunga e la b finale si indurisce in p (Auslautverhärtung). La lettura BLIEB tiene la grafia italiana.`,
    ),
  ],
  [
    card('c1', `ich war / hatte / wurde`, `Präteritum di sein / haben / werden. Ich = er; wir waren, hatten, wurden.`),
    card(
      'c2',
      `konnte, musste, wollte, durfte, sollte, mochte`,
      `Präteritum dei modali: senza umlaut e con -te. Ich konnte nicht kommen.`,
    ),
    card('c3', `Präteritum debole`, `radice + -te: machte, wohnte, lernte; arbeitete con e di appoggio.`),
    card('c4', `Präteritum forte`, `cambio di vocale, ich = er senza desinenza: ging, kam, sah, gab, nahm, trank.`),
    card(
      'c5',
      `Verbi misti`,
      `bringen: brachte, gebracht; denken: dachte, gedacht; wissen: wusste, gewusst; kennen: kannte, gekannt.`,
    ),
    card('c6', `gehen – ging – gegangen`, `sein-verbo. Ich ging nach Hause. Ich bin nach Hause gegangen.`),
    card('c7', `essen – aß – gegessen`, `ß dopo vocale lunga: aß [A:SS]. Part. II gegessen.`),
    card('c8', `fahren – fuhr – gefahren`, `Con sein per il movimento: Ich bin gefahren. Fuhr [FU:R].`),
    card('c9', `sprechen – sprach – gesprochen`, `Sprach [SHPRA:CH] con ch raschiata.`),
    card(
      'c10',
      `Scritto o parlato`,
      `Narrazione scritta: Präteritum. Parlato: Perfekt, con war, hatte e i modali sempre al Präteritum.`,
    ),
    card('c11', `Präteritum = imperfetto + passato remoto`, `Un solo tempo tedesco per ging («andava» e «andò»).`),
    card(
      'c12',
      `blieb [BLI:P], traf [TRA:F], las [LA:S]`,
      `Vocale lunga prima di una consonante; b/d/g finali duri (blieb → p).`,
    ),
  ],
  [
    prac(
      'p1',
      `Metti al Präteritum: «Ich gehe nach Hause. Er sieht den Film. Wir haben Hunger. Sie kann schwimmen.»`,
      `Ich ging nach Hause. Er sah den Film. Wir hatten Hunger. Sie konnte schwimmen. Nota: tutti i verbi in forma forte o irregolare; konnte senza umlaut.`,
    ),
    prac(
      'p2',
      `Traduci: «Da piccolo giocavo spesso a calcio e abitavo a Roma.»`,
      `Als ich klein war, spielte ich oft Fußball und wohnte in Rom. Nota: l'imperfetto italiano diventa Präteritum; als per un'epoca passata.`,
    ),
    prac(
      'p3',
      `Completa il Präteritum: «Er (nehmen) ein Buch, (lesen) lange und (schlafen) dann ein.»`,
      `Er nahm ein Buch, las lange und schlief dann ein. Nota: einschlafen separabile: schlief ... ein.`,
    ),
    prac(
      'p4',
      `Correggi: «Gestern ich war krank. Ich könnte nicht arbeiten. Er gehte nach Hause.»`,
      `Gestern war ich krank. Ich konnte nicht arbeiten. Er ging nach Hause. Nota: V2 dopo Gestern; konnte senza umlaut; ging forte.`,
    ),
    prac(
      'p5',
      `Scrivi i tre tempi principali di: bringen, wissen, kommen.`,
      `bringen – brachte – gebracht; wissen – wusste – gewusst; kommen – kam – gekommen (sein). Nota: due verbi misti, un forte.`,
    ),
  ],
)
