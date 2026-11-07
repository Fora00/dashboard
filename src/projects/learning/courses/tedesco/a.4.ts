import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// German course part A, modules 10-13 (futuro, imperativo, riflessivi, nebensaetze1). Notation: see tedesco.a.ts.

export const deFuturo = mod(
  'de-futuro',
  'Il futuro e il Konjunktiv II di cortesia',
  'Futur I, presente per il futuro, werden per la probabilità, würde, hätte, wäre, könnte',
  'a2',
  `${PRON_SHORT}
<p class="lead">In tedesco il futuro si dice spesso <b>senza futuro</b>: presente più un avverbio di tempo. Il Futur I con <i>werden</i> si usa per promesse, previsioni e supposizioni. Per essere cortesi (<i>vorrei, potrebbe</i>) serve il Konjunktiv II.</p>
<h3>Presente per il futuro</h3>
<p>Se il contesto indica il futuro (<b>morgen, nächste Woche, bald, gleich, nächstes Jahr, übermorgen</b>), il presente basta: <i>Morgen fahre ich nach Berlin. Nächstes Jahr ziehen wir um. Der Film beginnt gleich.</i> Pronuncia: nächste [NÈ:ÇS-të], Woche [VO-chë], übermorgen [Ü:-ba-mor-gën], gleich [GLAIÇ], bald [BALT]. Trappola: l'italiano usa il futuro semplice («domani andrò»); in tedesco suona innaturale quasi sempre.</p>
<h3>Futur I: werden + infinito</h3>
<p>Struttura: <b>werden</b> coniugato in seconda posizione, <b>infinito</b> in fondo: <i>Ich werde dich anrufen. Es wird morgen regnen. Wir werden sehen.</i></p>
<table><tr><th>Persona</th><th>werden</th><th>Esempio</th></tr>
<tr><td>ich</td><td>werde [VER-dë]</td><td>Ich werde lernen.</td></tr>
<tr><td>du</td><td>wirst [VIRST]</td><td>Du wirst sehen.</td></tr>
<tr><td>er / sie / es</td><td>wird [VIRT]</td><td>Es wird regnen.</td></tr>
<tr><td>wir / sie</td><td>werden</td><td>Wir werden kommen.</td></tr>
<tr><td>ihr</td><td>werdet [VER-dët]</td><td>Ihr werdet gewinnen.</td></tr></table>
<p>Quando si usa: <b>promessa</b> (<i>Ich werde pünktlich sein</i>), <b>previsione</b> (<i>Das Wetter wird besser</i>), <b>intenzione ferma</b>, <b>avvertimento</b> (<i>Du wirst es bereuen</i>). Nelle subordinate werden va dopo l'infinito: <i>Ich glaube, dass er kommen wird.</i> Un piano concreto resta al presente: <i>Ich fahre im Sommer nach Italien.</i></p>
<h3>Werden per la probabilità</h3>
<p>Il futuro italiano di supposizione («sarà a casa», «avrà vent'anni») diventa in tedesco <b>presente + wohl / wahrscheinlich / vermutlich</b>, oppure <b>werden + wohl</b>: <i>Er ist wohl zu Hause. Er wird wohl zu Hause sein. Sie wird etwa zwanzig sein.</i> Per il passato: <i>Er ist wohl schon gegangen.</i> Pronuncia: wohl [VO:L], wahrscheinlich [va:r-SHAIN-liç], vermutlich [fer-MU:T-liç].</p>
<h3>Konjunktiv II di cortesia</h3>
<p>Il Konjunktiv II serve per richieste e desideri cortesi, consigli, ipotesi. Le forme più usate sono quattro:</p>
<table><tr><th>Persona</th><th>würde</th><th>hätte</th><th>wäre</th></tr>
<tr><td>ich / er</td><td>würde [VÜR-dë]</td><td>hätte [HE-të]</td><td>wäre [VÈ:-rë]</td></tr>
<tr><td>du</td><td>würdest</td><td>hättest</td><td>wärst [VÈ:RST]</td></tr>
<tr><td>wir / sie</td><td>würden</td><td>hätten</td><td>wären [VÈ:-rën]</td></tr>
<tr><td>ihr</td><td>würdet</td><td>hättet</td><td>wärt [VÈ:RT]</td></tr></table>
<p>Altre forme utili: <b>könnte</b> [KÖN-të] (potrei), <b>müsste</b> [MÜS-të], <b>sollte</b> [ZOL-të] (dovresti), <b>dürfte</b>. Usi: <i>Ich hätte gern einen Kaffee.</i> (vorrei un caffè), <i>Könnten Sie mir helfen?</i> (potrebbe aiutarmi?), <i>Würden Sie bitte das Fenster schließen?</i> (chiuderebbe?), <i>Das wäre schön.</i> (sarebbe bello), <i>Du solltest mehr schlafen.</i> (dovresti dormire di più), <i>Ich würde gern nach Italien fahren.</i> (mi piacerebbe andare). Ipotesi: <i>Wenn ich Zeit hätte, würde ich kommen.</i></p>
<p>Attenzione: con <b>haben, sein e i modali</b> si usa la forma propria (<i>ich hätte, ich wäre, ich könnte</i>), non <i>würde</i> + infinito: «ich würde haben» è sbagliato. Con gli altri verbi: <i>würde</i> + infinito (<i>Ich würde kommen</i>, non «ich käme»). <b>Pronuncia</b>: le forme con umlaut si distinguono da quelle del Präteritum: <i>hatte</i> [HA-të] / <i>hätte</i> [HE-të]; <i>war</i> [VA:R] / <i>wäre</i> [VÈ:-rë]; <i>konnte</i> [KON-të] / <i>könnte</i> [KÖN-të]; <i>wurde</i> [VUR-dë] / <i>würde</i> [VÜR-dë].</p>
<div class="say"><b>Cosa dire.</b> «Guten Tag, ich hätte gern einen Tisch für zwei. Könnten Sie mir bitte die Speisekarte bringen? Ich werde morgen wieder kommen.»</div>`,
  [
    q(
      'q1',
      `Completa: «Ich ___ morgen nach Rom fahren.» (Futur I)`,
      [`werde`, `wird`, `wirst`, `würde`],
      0,
      `Con ich la forma di werden è werde. Wird è per er, wirst per du, e würde è il congiuntivo di cortesia.`,
    ),
    q(
      'q2',
      `Come dici in modo naturale «Domani vado a Berlino»?`,
      [
        `Morgen fahre ich nach Berlin.`,
        `Morgen fuhr ich nach Berlin.`,
        `Morgen fuhre ich nach Berlin.`,
        `Morgen bin ich nach Berlin gefahren.`,
      ],
      0,
      `Il presente con morgen è la forma normale per il futuro vicino. Fuhr è un Präteritum, e il Perfekt indica il passato.`,
    ),
    q(
      'q3',
      `Come dici «Sarà a casa» (supposizione)?`,
      [`Er ist wohl zu Hause.`, `Er wurde zu Hause sein.`, `Er hätte zu Hause.`, `Er wird zu Hause gewesen.`],
      0,
      `Per la supposizione si usa il presente con wohl, o werden + wohl + infinito. Le altre forme mescolano tempi in modo sbagliato.`,
    ),
    q(
      'q4',
      `Come ordini cortesemente «Vorrei un caffè»?`,
      [
        `Ich hätte gern einen Kaffee.`,
        `Ich hatte gern einen Kaffee.`,
        `Ich würde haben einen Kaffee.`,
        `Ich habe gern einen Kaffee.`,
      ],
      0,
      `Hätte è il congiuntivo II di haben. Hatte è il passato e würde haben è un errore classico: con haben non si usa würde.`,
    ),
    q(
      'q5',
      `Che cosa significa «Könnten Sie mir helfen?»`,
      [`Potrebbe aiutarmi?`, `Poteva aiutarmi?`, `Può aiutarmi (ordine)?`, `Ha potuto aiutarmi?`],
      0,
      `Könnten è il congiuntivo II di cortesia, quindi un condizionale. Konnten sarebbe il passato.`,
    ),
    q(
      'q6',
      `Completa: «Ich ___ gern mehr Zeit.» (vorrei avere)`,
      [`hätte`, `würde haben`, `habe würde`, `hatte`],
      0,
      `Con haben si usa hätte, non würde + infinito. Hatte indicherebbe un passato.`,
    ),
    q(
      'q7',
      `Come si legge «hätte» (avrei)?`,
      [`HE-të: ä breve come e`, `HA-të: come hatte`, `HÈ:-të: ä lunga`, `HE-ttë: t rafforzata`],
      0,
      `L'umlaut ä breve è una e. Leggerla come a ricade su hatte (passato) e cancella la differenza tra i due tempi.`,
    ),
    q(
      'q8',
      `Come si legge «würde» (farei)?`,
      [`VÜR-dë: ü breve`, `VUR-dë: u normale`, `VÜ:R-dë: ü lunga`, `VIR-dë: i breve`],
      0,
      `La ü ha le labbra tonde e davanti a due consonanti è breve. Vurde (wurde) è il Präteritum di werden e si legge con u.`,
    ),
    q(
      'q9',
      `Come si legge «wäre» (sarei)?`,
      [`VÈ:-rë: ä lunga, e aperta`, `VA:-rë: come war`, `VÉ:-rë: e chiusa`, `VER-rë: breve con r`],
      0,
      `La ä è lunga in wäre e si legge come una e aperta. Leggerla come a (war) elimina la differenza con il Präteritum.`,
    ),
  ],
  [
    card(
      'c1',
      `Presente per il futuro`,
      `Morgen fahre ich nach Berlin. Presente + avverbio (morgen, bald, nächste Woche): la forma più comune.`,
    ),
    card(
      'c2',
      `Futur I: werden + infinito`,
      `Ich werde dich anrufen. werden in seconda posizione, infinito in fondo. Per promesse e previsioni.`,
    ),
    card(
      'c3',
      `Probabilità`,
      `Presente o werden + wohl: Er ist wohl zu Hause. Sie wird etwa zwanzig sein. Equivale al futuro italiano di supposizione.`,
    ),
    card(
      'c4',
      `Ich hätte gern ...`,
      `Vorrei ... (cortese, al ristorante, in negozio). hätte = congiuntivo II di haben.`,
    ),
    card('c5', `Könnten Sie ...?`, `Potrebbe ...? Richiesta cortese. könnte = congiuntivo II di können.`),
    card(
      'c6',
      `Würden Sie bitte ...?`,
      `Potrebbe/Vorrebbe ...? würde + infinito: richiesta cortese con i verbi diversi da haben/sein/modali.`,
    ),
    card('c7', `wäre`, `sarei / sarebbe: Das wäre schön. Ich wäre gern reich. ä lunga [VÈ:-rë].`),
    card(
      'c8',
      `Du solltest ...`,
      `Dovresti ...: consiglio. sollte = congiuntivo II di sollen (stessa forma del Präteritum).`,
    ),
    card(
      'c9',
      `Mai «würde haben»`,
      `Con haben, sein e i modali: hätte, wäre, könnte, müsste. Würde + infinito per gli altri verbi.`,
    ),
    card(
      'c10',
      `hatte / hätte`,
      `[HA-të] passato / [HE-të] cortese. Stessa coppia: war / wäre, konnte / könnte, wurde / würde.`,
    ),
    card('c11', `wohl, wahrscheinlich`, `Forse, probabilmente. wohl [VO:L]; wahrscheinlich [va:r-SHAIN-liç].`),
    card('c12', `dass er kommen wird`, `Nelle subordinate werden va in fondo, dopo l'infinito.`),
  ],
  [
    prac(
      'p1',
      `Traduci con il presente: «Domani vado al cinema, poi cenerò con Anna.»`,
      `Morgen gehe ich ins Kino und esse dann mit Anna zu Abend. Nota: presente con morgen; essen... zu Abend (zu Abend essen) oppure «Abendessen».`,
    ),
    prac(
      'p2',
      `Traduci: «Sarà a casa, forse dorme.»`,
      `Er ist wohl zu Hause, vielleicht schläft er. Nota: supposizione con wohl; vielleicht = forse.`,
    ),
    prac(
      'p3',
      `Traduci cortesemente: «Vorrei un tavolo per due. Potrebbe portarmi il menù?»`,
      `Ich hätte gern einen Tisch für zwei. Könnten Sie mir bitte die Speisekarte bringen? Nota: hätte e könnte; Tisch maschile accusativo einen.`,
    ),
    prac(
      'p4',
      `Correggi: «Ich würde haben gern ein Kaffee. Er würde sein müde. Ich werde nach Berlin gefahren.»`,
      `Ich hätte gern einen Kaffee. Er wäre müde. Ich werde nach Berlin fahren. Nota: hätte e wäre; Futur con werden + infinito.`,
    ),
    prac(
      'p5',
      `Dai 3 consigli a un amico stanco usando «du solltest».`,
      `Du solltest früher schlafen gehen. Du solltest weniger Kaffee trinken. Du solltest mehr Sport machen. Nota: sollte + infinito in fondo; gehen come infinito.`,
    ),
  ],
)

export const deImperativo = mod(
  'de-imperativo',
  'L’imperativo',
  'Du, ihr, Sie, verbi irregolari, separabili, riflessivi, richieste e istruzioni',
  'a2',
  `${PRON_SHORT}
<p class="lead">L'imperativo tedesco ha tre forme principali: <b>du</b>, <b>ihr</b> e <b>Sie</b>. Si usa per ordini, istruzioni e richieste, ma tra adulti si aggiungono <i>bitte</i> e <i>mal</i> per attenuarlo. Differenza con l'italiano: la forma di cortesia usa l'infinito + <i>Sie</i>, non il congiuntivo.</p>
<h3>Le forme</h3>
<table><tr><th>Verbo</th><th>du</th><th>ihr</th><th>Sie</th></tr>
<tr><td>machen</td><td>Mach!</td><td>Macht!</td><td>Machen Sie!</td></tr>
<tr><td>kommen</td><td>Komm!</td><td>Kommt!</td><td>Kommen Sie!</td></tr>
<tr><td>warten</td><td>Warte!</td><td>Wartet!</td><td>Warten Sie!</td></tr>
<tr><td>sprechen</td><td>Sprich! [SHPRIÇ]</td><td>Sprecht!</td><td>Sprechen Sie!</td></tr>
<tr><td>nehmen</td><td>Nimm! [NIM]</td><td>Nehmt!</td><td>Nehmen Sie!</td></tr>
<tr><td>fahren</td><td>Fahr!</td><td>Fahrt!</td><td>Fahren Sie!</td></tr>
<tr><td>sein</td><td>Sei! [ZAI]</td><td>Seid!</td><td>Seien Sie!</td></tr></table>
<ul><li><b>du</b>: radice senza -st e senza pronome: <i>Komm! Geh! Mach!</i> Con radice in -t, -d, -chn, -ffn si aggiunge la <b>-e</b>: <i>Warte! Arbeite! Öffne!</i> Nel parlato la -e cade spesso nei verbi ordinari (<i>Komm</i>, non «Komme»).</li><li><b>Verbi con e > i / ie</b> mantengono il cambio: <i>Sprich! Nimm! Gib! Lies! Iss! Sieh! Hilf!</i> Verbi con a > ä <b>non</b> hanno l'umlaut: <i>Fahr! Schlaf! Lauf! Trag!</i></li><li><b>ihr</b>: stessa forma del presente senza ihr: <i>Kommt! Macht! Seid ruhig!</i></li><li><b>Sie</b>: infinito + Sie (il verbo viene prima): <i>Kommen Sie! Seien Sie so freundlich!</i></li><li><b>wir</b> (usiamo): <i>Gehen wir! Fangen wir an!</i> o <i>Lass uns gehen!</i></li></ul>
<h3>Separabili e riflessivi</h3>
<p>Il prefisso separabile va in fondo: <i>Steh auf! Steht auf! Stehen Sie auf!</i>; <i>Ruf mich an! Mach die Tür zu! Komm mit! Schau mal!</i> I riflessivi mantengono il pronome: <i>Setz dich! Beeil dich! Setzt euch! Setzen Sie sich!</i> Pronuncia: Setz [ZETS], dich [DIÇ], euch [OIÇ], beeil [bë-AIL].</p>
<h3>Come chiedere e istruire</h3>
<ul><li><b>Richiesta gentile</b>: <i>Kannst du mir bitte helfen?</i> / <i>Könnten Sie ...?</i> è più cortese dell'imperativo. <i>Gib mir das Buch</i> è diretto: meglio <i>Gib mir bitte das Buch</i>.</li><li><b>Particelle</b>: <i>mal</i> [MA:L] rende più colloquiale (<i>Schau mal!</i>), <i>doch</i> [DOCH] insiste con cortesia (<i>Komm doch herein!</i>).</li><li><b>Istruzioni scritte</b>: spesso infinito: <i>Zutaten mischen. Nicht rauchen. Bitte anschnallen.</i></li><li><b>Indicazioni stradali</b>: <i>Gehen Sie geradeaus [gë-RA:-dë-aus], dann links und an der Ampel rechts.</i></li><li><b>Negazione</b>: <i>Komm nicht! Mach das nicht! Gehen Sie nicht weg.</i></li></ul>
<p>Con i pronomi: <i>Gib es mir! Sag es ihm! Hilf mir!</i> (accusativo prima del dativo con due pronomi). Trappola: l'italiano nega l'imperativo di tu con l'infinito («non venire»): in tedesco <i>Komm nicht!</i>. «Non ti preoccupare» = <i>Mach dir keine Sorgen.</i></p>
<div class="say"><b>Cosa dire.</b> «Entschuldigung, gehen Sie bitte geradeaus und biegen Sie rechts ab. Komm doch herein! Setz dich und nimm Kaffee.»</div>`,
  [
    q(
      'q1',
      `Qual è l'imperativo di «kommen» (du)?`,
      [`Komm!`, `Kommst!`, `Kommt du!`, `Kommen!`],
      0,
      `Per du si toglie la desinenza -st e il pronome. Kommst è la forma del presente e Kommen è l'infinito.`,
    ),
    q(
      'q2',
      `Qual è l'imperativo di «sprechen» (du)?`,
      [`Sprich!`, `Sprech!`, `Sprechst!`, `Sprecht du!`],
      0,
      `Sprechen cambia e > i anche all'imperativo. Sprech sarebbe la forma regolare, che non esiste in questo verbo.`,
    ),
    q(
      'q3',
      `Qual è l'imperativo di «fahren» (du)?`,
      [`Fahr!`, `Fähr!`, `Fährt!`, `Fahrst!`],
      0,
      `I verbi con a > ä non hanno l'umlaut all'imperativo. Fähr è la tentazione di copiare il presente (du fährst).`,
    ),
    q(
      'q4',
      `Come dici «Entri, per favore!» con Sie?`,
      [`Kommen Sie bitte herein!`, `Kommt Sie bitte herein!`, `Komm Sie bitte herein!`, `Kommen bitte Sie herein!`],
      0,
      `La forma di cortesia è infinito + Sie, con il prefisso herein alla fine. Kommt è la forma di ihr.`,
    ),
    q(
      'q5',
      `Come dici «Alzati!» (du)?`,
      [`Steh auf!`, `Aufsteh!`, `Stehe auf du!`, `Auf steh!`],
      0,
      `Il prefisso separabile va in fondo alla frase. Aufsteh è la forma dell'infinito, come in italiano «alzati».`,
    ),
    q(
      'q6',
      `Come dici «Sii tranquillo!» (du)?`,
      [`Sei ruhig!`, `Bist ruhig!`, `Sein ruhig!`, `Seid ruhig!`],
      0,
      `L'imperativo di sein per du è sei. Seid è la forma di ihr, bist è il presente e sein è l'infinito.`,
    ),
    q(
      'q7',
      `Qual è l'imperativo di «nehmen» (du)?`,
      [`Nimm!`, `Nehm!`, `Nehmst!`, `Nehme!`],
      0,
      `Nehmen cambia e > i e la consonante diventa mm. Nehm! è la forma che si sente nel parlato ma non è standard.`,
    ),
    q(
      'q8',
      `Come si legge «Sprich» (parla)?`,
      [
        `SHPRIÇ: sp = shp, ich debole`,
        `SPRICH: come in italiano`,
        `SHPRIK: ch come k`,
        `SHPRI:CH: i lunga e ch raschiata`,
      ],
      0,
      `A inizio parola sp è shp e dopo i la ch è debole (ç). La i è breve perché c'è una consonante doppia dopo.`,
    ),
    q(
      'q9',
      `Come si legge «Setz» (siediti, radice)?`,
      [`ZETS: z sonora e tz = ts`, `SETS: s sorda iniziale`, `ZE:TS: e lunga`, `TSETS: z come ts`],
      0,
      `La s iniziale prima di vocale è sonora e tz è ts. La e è breve perché dopo ci sono due consonanti.`,
    ),
  ],
  [
    card('c1', `Imperativo du`, `Radice senza -st e pronome: Komm! Geh! Mach! Con radice in -t/-d: Warte! Arbeite!`),
    card('c2', `Imperativo ihr`, `Come il presente di ihr senza pronome: Kommt! Macht! Seid ruhig!`),
    card('c3', `Imperativo Sie`, `Infinito + Sie: Kommen Sie! Seien Sie so freundlich! Il verbo viene prima.`),
    card('c4', `e > i / ie`, `Sprich! Nimm! Gib! Lies! Iss! Hilf! Mantengono il cambio di radice.`),
    card('c5', `a > ä non c'è`, `Fahr! Schlaf! Lauf! Trag! senza umlaut all'imperativo.`),
    card('c6', `Sei! Seid! Seien Sie!`, `Imperativo di sein: du sei, ihr seid, Sie seien.`),
    card('c7', `Separabili`, `Steh auf! Ruf mich an! Mach die Tür zu! Prefisso in fondo.`),
    card('c8', `Riflessivi`, `Setz dich! Beeil dich! Setzt euch! Setzen Sie sich!`),
    card(
      'c9',
      `bitte, mal, doch`,
      `bitte: per favore; mal: attenua (Schau mal!); doch: insiste con gentilezza (Komm doch!).`,
    ),
    card('c10', `Wir: Gehen wir!`, `Esortazione: Gehen wir! / Lass uns gehen! = andiamo!`),
    card('c11', `Istruzioni con l'infinito`, `Nicht rauchen. Bitte anschnallen. Zutaten mischen. Cartelli e ricette.`),
    card('c12', `Sprich [SHPRIÇ], Setz [ZETS]`, `sp = shp; ich debole (ç); tz = ts; s iniziale sonora.`),
  ],
  [
    prac(
      'p1',
      `Traduci: «Vieni qui! Aspetta un momento! Parla più piano!» (du)`,
      `Komm her! Warte einen Moment! Sprich leiser! Nota: Warte con -e per radice in t; Sprich con e > i; leiser = più piano.`,
    ),
    prac(
      'p2',
      `Rendi cortese (Sie): «Chiuda la porta e si sieda, per favore.»`,
      `Schließen Sie bitte die Tür und setzen Sie sich. Nota: infinito + Sie, riflessivo setzen Sie sich.`,
    ),
    prac(
      'p3',
      `Traduci (ihr): «Alzatevi, prendete i libri e aprite il libro a pagina 10.»`,
      `Steht auf, nehmt die Bücher und öffnet das Buch auf Seite 10. Nota: aufstehen separabile; nehmt senza cambio di radice; öffnet con e di appoggio.`,
    ),
    prac(
      'p4',
      `Correggi: «Fähr nicht so schnell! Kommt Sie bitte! Aufsteh jetzt!»`,
      `Fahr nicht so schnell! Kommen Sie bitte! Steh jetzt auf! Nota: niente umlaut; Sie con infinito; separabile.`,
    ),
    prac(
      'p5',
      `Scrivi una ricetta in 4 istruzioni (du o infinito): spaghetti.`,
      `Koch das Wasser. Gib Salz ins Wasser. Koch die Spaghetti zehn Minuten. Gieß das Wasser ab und gib die Soße dazu. Nota: gießen ... ab (separabile); infinito alternativo: Wasser kochen.`,
    ),
  ],
)

export const deRiflessivi = mod(
  'de-riflessivi',
  'Riflessivi, comparativi e preposizioni di tempo',
  'Sich, accusativo e dativo riflessivo, comparativo e superlativo, avverbi, seit, vor, in, nach',
  'a2',
  `${PRON_SHORT}
<p class="lead">Tre temi del livello A2: i <b>verbi riflessivi</b> (con il pronome <i>sich</i>), i <b>gradi</b> dell'aggettivo e le <b>preposizioni di tempo</b> (da quanto, quanto fa, tra quanto).</p>
<h3>Verbi riflessivi</h3>
<table><tr><th>Persona</th><th>Akk.</th><th>Dat.</th></tr>
<tr><td>ich</td><td>mich</td><td>mir</td></tr>
<tr><td>du</td><td>dich</td><td>dir</td></tr>
<tr><td>er / sie / es</td><td>sich [ZIÇ]</td><td>sich</td></tr>
<tr><td>wir</td><td>uns</td><td>uns</td></tr>
<tr><td>ihr</td><td>euch</td><td>euch</td></tr>
<tr><td>sie / Sie</td><td>sich</td><td>sich</td></tr></table>
<p>Verbi frequenti: <i>sich waschen, sich anziehen, sich setzen, sich treffen, sich freuen, sich beeilen, sich interessieren, sich erinnern, sich ärgern, sich fühlen, sich entscheiden, sich verabreden</i>. Esempi: <i>Ich freue mich. Er wäscht sich. Wir treffen uns um acht. Beeilen Sie sich!</i> Il pronome sta dopo il verbo coniugato: <i>Heute freue ich mich.</i> Molti verbi sono riflessivi in tedesco anche se non lo sono in italiano e viceversa: <i>sich beeilen</i> (affrettarsi), <i>sich ausruhen</i> (riposarsi), ma <i>aufstehen</i> senza sich.</p>
<p>Con preposizione fissa: <i>sich freuen auf + Akk.</i> (attendere con gioia), <i>über + Akk.</i> (per qualcosa avvenuto), <i>sich interessieren für</i>, <i>sich erinnern an</i>, <i>sich ärgern über</i>, <i>sich kümmern um</i>. Perfekt sempre con <b>haben</b> (<i>Ich habe mich gewaschen</i>), anche quando l'italiano ha «essere».</p>
<p><b>Dativo riflessivo</b>: se c'è già un altro accusativo (soprattutto parti del corpo), il pronome è dativo: <i>Ich wasche mich</i> / <i>Ich wasche mir die Hände. Ich putze mir die Zähne. Ich kaufe mir ein Auto. Ich sehe mir den Film an. Ich merke mir das.</i> Con le parti del corpo si usa il dativo, non il possessivo: «mi lavo le mani» = <i>mir die Hände</i>. Reciproco: <i>Wir sehen uns morgen.</i> Pronuncia: Zähne [TSÈ:-në], putzen [PU-tsën].</p>
<h3>Comparativo e superlativo</h3>
<table><tr><th>Base</th><th>Comparativo</th><th>Superlativo</th></tr>
<tr><td>schnell [SHNEL]</td><td>schneller</td><td>am schnellsten</td></tr>
<tr><td>groß [GRO:SS]</td><td>größer [GRÖ:-ssa]</td><td>am größten</td></tr>
<tr><td>alt [ALT]</td><td>älter [EL-ta]</td><td>am ältesten</td></tr>
<tr><td>jung [IUN]</td><td>jünger [IÜN-ga]</td><td>am jüngsten</td></tr>
<tr><td>gut [GU:T]</td><td>besser [BE-ssa]</td><td>am besten</td></tr>
<tr><td>viel [FI:L]</td><td>mehr [MÉ:R]</td><td>am meisten</td></tr>
<tr><td>gern [GERN]</td><td>lieber [LI:-ba]</td><td>am liebsten</td></tr>
<tr><td>hoch / nah</td><td>höher / näher</td><td>am höchsten / am nächsten</td></tr></table>
<p>Comparativo: <b>-er</b> (spesso con umlaut nei monosillabi: alt → älter, jung → jünger, kalt → kälter, lang → länger). Superlativo: <b>am + -(e)sten</b> (con -esten dopo d, t, s, ß, z, sch: am ältesten, am kürzesten, am größten). Prima del nome: <i>der größte Berg, die beste Lösung</i>. Confronti: <b>als</b> (più... di) e <b>so ... wie</b> (come): <i>Er ist größer als ich. Ich bin so groß wie du.</i> Mai «größer wie» nello standard. Altre forme: <i>immer besser</i> (sempre meglio), <i>je früher, desto besser</i>. Avverbi: l'aggettivo si usa senza cambiamento: <i>Er singt schön</i> (non esiste -mente); frequenza: immer, oft, manchmal, selten, nie; gradi con <i>gern</i>: <i>Ich esse gern Pizza. Ich esse lieber Pasta. Am liebsten esse ich Eis.</i></p>
<h3>Preposizioni di tempo</h3>
<table><tr><th>Italiano</th><th>Tedesco</th><th>Esempio</th></tr>
<tr><td>da (durata)</td><td>seit + Dat.</td><td>Ich lerne seit einem Jahr Deutsch.</td></tr>
<tr><td>fa</td><td>vor + Dat.</td><td>vor zwei Tagen</td></tr>
<tr><td>tra (fra)</td><td>in + Dat.</td><td>in einer Woche</td></tr>
<tr><td>dopo / prima di</td><td>nach / vor + Dat.</td><td>nach dem Essen / vor dem Essen</td></tr>
<tr><td>fino a / da ... a</td><td>bis / von ... bis</td><td>von Montag bis Freitag</td></tr>
<tr><td>a partire da</td><td>ab + Dat.</td><td>ab nächster Woche</td></tr></table>
<p>Con <b>seit</b> il tedesco usa il <b>presente</b> per un'azione che dura ancora: <i>Ich wohne seit zwei Jahren hier</i> (abito qui da due anni), non il Perfekt. Preposizioni fisse: <b>am</b> + giorno, parte del giorno (<i>am Montag, am Abend</i>), <b>im</b> + mese/stagione (<i>im Mai, im Sommer</i>), <b>um</b> + ora (<i>um acht Uhr</i>), <b>in der Nacht</b>, <b>gegen</b> Abend (verso sera), <b>für</b> + durata prevista (<i>für zwei Wochen</i>). Pronuncia: seit [ZAIT], vor [FO:R], nach [NA:CH].</p>
<div class="say"><b>Cosa dire.</b> «Ich lerne seit einem Jahr Deutsch. Ich interessiere mich für Geschichte und freue mich auf den Urlaub in zwei Wochen. Er ist größer als ich.»</div>`,
  [
    q(
      'q1',
      `Completa: «Ich freue ___.»`,
      [`mich`, `mir`, `sich`, `dich`],
      0,
      `Con ich il pronome riflessivo accusativo è mich. Mir sarebbe dativo, che si usa solo con un altro accusativo.`,
    ),
    q(
      'q2',
      `Completa: «Ich wasche ___ die Hände.»`,
      [`mir`, `mich`, `sich`, `dir`],
      0,
      `La frase ha già un accusativo (die Hände), quindi il riflessivo è dativo: mir. Mich vale se non c'è altro oggetto: Ich wasche mich.`,
    ),
    q(
      'q3',
      `Come dici «Mi sono lavato»?`,
      [`Ich habe mich gewaschen.`, `Ich bin mich gewaschen.`, `Ich habe mir gewaschen.`, `Ich bin gewaschen.`],
      0,
      `Il Perfekt dei riflessivi usa sempre haben. Bin è la scelta di chi traduce «mi sono» dall'italiano.`,
    ),
    q(
      'q4',
      `Come dici «Lui è più alto di me»?`,
      [`Er ist größer als ich.`, `Er ist größer wie ich.`, `Er ist mehr groß als ich.`, `Er ist größer von mir.`],
      0,
      `Nel confronto di disuguaglianza si usa als (e il caso del termine è nominativo). Wie è per l'uguaglianza.`,
    ),
    q(
      'q5',
      `Completa: «Er läuft ___.» (il più veloce)`,
      [`am schnellsten`, `der schnellste`, `schnellster`, `am schnellesten`],
      0,
      `Il superlativo avverbiale è am + -sten. Der schnellste è la forma che precede un nome.`,
    ),
    q(
      'q6',
      `Completa: «Ich lerne ___ einem Jahr Deutsch.» (da un anno)`,
      [`seit`, `vor`, `in`, `für`],
      0,
      `Seit esprime una durata che arriva fino ad ora, con presente. Vor significa «fa», in significa «tra».`,
    ),
    q(
      'q7',
      `Come dici «due giorni fa»?`,
      [`vor zwei Tagen`, `seit zwei Tagen`, `in zwei Tagen`, `nach zwei Tagen`],
      0,
      `Vor + dativo indica «fa». Seit è «da due giorni», in è «tra due giorni», nach è «dopo due giorni».`,
    ),
    q(
      'q8',
      `Come dici «Preferisco il tè»?`,
      [`Ich trinke lieber Tee.`, `Ich trinke besser Tee.`, `Ich trinke mehr gern Tee.`, `Ich trinke gern lieber Tee.`],
      0,
      `Il comparativo di gern è lieber. Besser è il comparativo di gut e non indica preferenza.`,
    ),
    q(
      'q9',
      `Come si legge «größer» (più grande)?`,
      [`GRÖ:-ssa: ö lunga, ß sorda, -er = a`, `GRÖS-ser: ö breve, doppia s`, `GRÖ:-za: s sonora`, `GRE-ssa: ö come e`],
      0,
      `La ß segue una vocale lunga ed è sorda; -er finale è una a. La s sonora è solo prima di vocale a inizio sillaba (ma qui c'è ß).`,
    ),
    q(
      'q10',
      `Come si legge «sich» (si)?`,
      [`ZIÇ: s sonora e ich debole`, `SISH: come sc`, `ZIK: ch come k`, `SIÇ: s sorda iniziale`],
      0,
      `La s iniziale prima di vocale è sonora e dopo i la ch è debole (ç). Sich e sish si distinguono per il suono finale.`,
    ),
  ],
  [
    card(
      'c1',
      `Pronomi riflessivi`,
      `mich, dich, sich, uns, euch, sich (Akk.); mir, dir, sich, uns, euch, sich (Dat.). Differiscono da ihn/ihm solo in sich.`,
    ),
    card(
      'c2',
      `Dativo riflessivo`,
      `Con un altro accusativo: Ich wasche mir die Hände. Ich kaufe mir ein Auto. Ich sehe mir den Film an.`,
    ),
    card('c3', `Riflessivi nel Perfekt`, `Sempre haben: Ich habe mich gewaschen. Non «bin».`),
    card('c4', `sich freuen auf / über`, `auf + Akk. per il futuro, über + Akk. per il presente o il passato.`),
    card('c5', `sich interessieren für, erinnern an, ärgern über`, `Preposizioni fisse con riflessivi.`),
    card('c6', `Comparativo -er (± umlaut)`, `schneller, größer, älter, jünger, kälter, länger.`),
    card(
      'c7',
      `Superlativo am ...-sten`,
      `am schnellsten; am ältesten, am größten, am kürzesten (con e dopo d, t, s, ß, z, sch).`,
    ),
    card(
      'c8',
      `gut – besser – am besten`,
      `viel – mehr – am meisten; gern – lieber – am liebsten; hoch – höher – am höchsten; nah – näher – am nächsten.`,
    ),
    card('c9', `als / so ... wie`, `Er ist größer als ich. Ich bin so groß wie du. Mai «größer wie».`),
    card('c10', `seit + Dativ + presente`, `Ich wohne seit zwei Jahren hier. Durata che dura ancora: presente.`),
    card('c11', `vor / in / nach`, `vor zwei Tagen (fa), in zwei Tagen (tra), nach dem Essen (dopo).`),
    card('c12', `sich [ZIÇ], größer [GRÖ:-ssa]`, `s iniziale sonora; ich debole; ß sorda; -er finale = a.`),
  ],
  [
    prac(
      'p1',
      `Traduci: «Mi sveglio presto, mi lavo i denti e mi vesto.»`,
      `Ich wache früh auf, putze mir die Zähne und ziehe mich an. Nota: putze mir (dativo, c'è già die Zähne); ziehe mich an (accusativo, separabile).`,
    ),
    prac(
      'p2',
      `Traduci: «Mio fratello è più grande di me, ma io sono più veloce.»`,
      `Mein Bruder ist größer als ich, aber ich bin schneller. Nota: als per il confronto; größer con umlaut.`,
    ),
    prac(
      'p3',
      `Traduci: «Lavoro qui da tre anni e tra due settimane ho le ferie.»`,
      `Ich arbeite seit drei Jahren hier und habe in zwei Wochen Urlaub. Nota: seit + presente; in + dativo per «tra».`,
    ),
    prac(
      'p4',
      `Correggi: «Ich bin mich gewaschen. Er ist größer wie ich. Ich wohne hier seit zwei Jahre.»`,
      `Ich habe mich gewaschen. Er ist größer als ich. Ich wohne seit zwei Jahren hier. Nota: haben con i riflessivi; als; seit + dativo plurale con -n.`,
    ),
    prac(
      'p5',
      `Scrivi tre frasi sulle tue preferenze con gern, lieber, am liebsten.`,
      `Ich esse gern Pizza. Ich esse lieber Pasta. Am liebsten esse ich Eis. Nota: gern segue il verbo; nell'ultima frase l'inversione per am liebsten in prima posizione.`,
    ),
  ],
)

export const deNebensaetze1 = mod(
  'de-nebensaetze1',
  'Coordinate e prime subordinate',
  'Und, aber, oder, denn, sondern e weil, dass, wenn, ob: il verbo in fondo',
  'a2',
  `${PRON_SHORT}
<p class="lead">La regola più importante della sintassi tedesca: nelle <b>subordinate</b> il verbo coniugato va <b>in fondo</b>. Nelle coordinate l'ordine resta normale. Il tutto è separato da una <b>virgola</b>, a differenza dell'italiano.</p>
<h3>Le coordinate: ordine invariato</h3>
<p><b>und</b> [UNT] (e), <b>aber</b> [A:-ba] (ma), <b>oder</b> [O:-da] (o), <b>denn</b> [DEN] (perché), <b>sondern</b> [ZON-dern] (ma, bensì) non cambiano l'ordine: stanno «in posizione zero» e il verbo resta in seconda posizione dopo il soggetto.</p>
<ul><li><i>Ich bleibe zu Hause, denn ich bin krank.</i></li><li><i>Ich möchte kommen, aber ich habe keine Zeit.</i></li><li><i>Willst du Tee oder trinkst du lieber Kaffee?</i></li><li><i>Ich trinke keinen Kaffee, sondern Tee.</i></li></ul>
<p>Trappola: l'italiano «ma» copre due casi. <b>sondern</b> corregge una frase negativa («non X, ma Y»); <b>aber</b> contrappone senza negazione: <i>Er ist nicht dumm, sondern faul. Er ist klug, aber faul.</i> Mnemonico: <b>ADUSO</b> (aber, denn, und, sondern, oder). Anche gli avverbi <b>deshalb, darum, deswegen, trotzdem</b> (perciò, tuttavia) non sono congiunzioni: occupano la prima posizione e il verbo segue: <i>Ich bin krank, deshalb bleibe ich zu Hause.</i></p>
<h3>Le subordinate: verbo in fondo</h3>
<table><tr><th>Congiunzione</th><th>Significato</th><th>Esempio</th></tr>
<tr><td>weil [VAIL]</td><td>perché (causa)</td><td>Ich bleibe zu Hause, weil ich krank bin.</td></tr>
<tr><td>dass [DAS]</td><td>che</td><td>Ich weiß, dass er morgen kommt.</td></tr>
<tr><td>wenn [VEN]</td><td>se, quando (ogni volta)</td><td>Wenn es regnet, bleibe ich zu Hause.</td></tr>
<tr><td>ob [OP]</td><td>se (indiretta sì/no)</td><td>Ich frage, ob er kommt.</td></tr></table>
<p>Il <b>verbo coniugato</b> è l'ultimo elemento della subordinata. Con due verbi, il coniugato va per ultimo: <i>weil ich arbeiten muss</i> (modale), <i>weil er gegessen hat</i> (Perfekt), <i>dass er kommen wird</i> (Futur). Con un verbo separabile il prefisso si riunisce: <i>weil ich früh aufstehe</i>. La subordinata ha sempre una <b>virgola</b> prima: <i>Ich glaube, dass er krank ist.</i> (l'italiano non la mette). Se la subordinata sta all'inizio, è la prima posizione, e il verbo principale la segue subito: <i>Wenn es regnet, bleibe ich zu Hause. Weil ich krank bin, bleibe ich zu Hause.</i></p>
<h3>Dass, wenn, ob</h3>
<ul><li><b>dass</b> (con due s) è la congiunzione «che»; <b>das</b> è articolo o pronome. Si pronunciano uguali [DAS]. Prova: se si può sostituire con «questo/quello/il quale» è das. <i>Ich weiß, dass das Wetter schön ist.</i> Se si omette dass, la frase diventa V2: <i>Ich glaube, er ist krank.</i> (senza dass).</li><li><b>wenn</b> = se / ogni volta che / quando (ripetuto, presente o passato abituale): <i>Wenn ich müde bin, trinke ich Kaffee.</i> Per un evento singolo nel passato si usa <i>als</i>: <i>Als ich klein war, ...</i> (wann è solo interrogativo: <i>Wann kommst du?</i> / <i>Ich weiß nicht, wann er kommt.</i>)</li><li><b>ob</b> = se in una domanda indiretta sì/no: <i>Ich weiß nicht, ob er kommt.</i> Con una parola interrogativa: <i>Ich weiß nicht, wo er wohnt.</i></li></ul>
<h3>Weil o denn? E il parlato</h3>
<p><b>denn</b> è più formale e lascia l'ordine normale; <b>weil</b> è l'uso comune e manda il verbo in fondo. Nel parlato si sente spesso «weil» con ordine normale (<i>Ich komme nicht, weil ich bin krank</i>), ma nello scritto è considerato scorretto. Le stesse regole valgono per tutte le altre congiunzioni subordinanti: <i>obwohl</i> (sebbene), <i>bevor</i>, <i>nachdem</i>, <i>während</i>, <i>damit</i>.</p>
<div class="say"><b>Cosa dire.</b> «Ich lerne Deutsch, weil ich in Wien arbeiten möchte. Ich weiß, dass das schwierig ist, aber wenn ich jeden Tag übe, schaffe ich es.»</div>`,
  [
    q(
      'q1',
      `Quale frase è corretta?`,
      [
        `Ich bleibe zu Hause, weil ich krank bin.`,
        `Ich bleibe zu Hause, weil ich bin krank.`,
        `Ich bleibe zu Hause, weil bin ich krank.`,
        `Ich bleibe zu Hause weil ich krank bin.`,
      ],
      0,
      `Nelle subordinate con weil il verbo va in fondo e c'è la virgola prima di weil. Weil ich bin krank è l'ordine delle principali.`,
    ),
    q(
      'q2',
      `Completa: «Ich trinke keinen Kaffee, ___ Tee.»`,
      [`sondern`, `aber`, `oder`, `denn`],
      0,
      `Dopo una negazione che corregge si usa sondern. Aber è «ma» senza correzione e l'italiano usa «ma» per entrambi.`,
    ),
    q(
      'q3',
      `Quale frase è corretta?`,
      [
        `Ich weiß, dass er morgen kommt.`,
        `Ich weiß, dass er kommt morgen.`,
        `Ich weiß, dass kommt er morgen.`,
        `Ich weiß, das er morgen kommt.`,
      ],
      0,
      `Dass chiude con il verbo coniugato in fondo, e si scrive con due s. Das con una s è l'articolo o pronome.`,
    ),
    q(
      'q4',
      `Quale frase ha l'ordine corretto?`,
      [
        `Wenn es regnet, bleibe ich zu Hause.`,
        `Wenn es regnet, ich bleibe zu Hause.`,
        `Wenn es regnet bleibt ich zu Hause.`,
        `Wenn regnet es, bleibe ich zu Hause.`,
      ],
      0,
      `La subordinata iniziale occupa la prima posizione, quindi il verbo principale (bleibe) viene subito dopo la virgola.`,
    ),
    q(
      'q5',
      `Come dici «Non so se viene»?`,
      [
        `Ich weiß nicht, ob er kommt.`,
        `Ich weiß nicht, wenn er kommt.`,
        `Ich weiß nicht, ob kommt er.`,
        `Ich weiß nicht, dass er kommt.`,
      ],
      0,
      `Ob introduce una domanda indiretta sì/no. Wenn significa «se/quando» condizionale e dass significa «che».`,
    ),
    q(
      'q6',
      `Completa: «..., weil ich früh ___.» (aufstehen)`,
      [`aufstehe`, `stehe auf`, `auf stehe`, `aufstehen`],
      0,
      `Nella subordinata il prefisso si riunisce al verbo e va in fondo. Stehe auf è l'ordine della principale.`,
    ),
    q(
      'q7',
      `Quale frase con modale è corretta?`,
      [
        `..., weil ich arbeiten muss.`,
        `..., weil ich muss arbeiten.`,
        `..., weil muss ich arbeiten.`,
        `..., weil ich arbeite muss.`,
      ],
      0,
      `Nella subordinata il modale coniugato è l'ultimo, dopo l'infinito. Muss arbeiten è l'ordine della frase principale.`,
    ),
    q(
      'q8',
      `Quale congiunzione NON manda il verbo in fondo?`,
      [`denn`, `weil`, `dass`, `wenn`],
      0,
      `Denn è una coordinata e lascia l'ordine invariato. Weil, dass e wenn sono subordinanti e vogliono il verbo in fondo.`,
    ),
    q(
      'q9',
      `Quale frase al Perfekt è corretta?`,
      [
        `..., weil er gegessen hat.`,
        `..., weil er hat gegessen.`,
        `..., weil hat er gegessen.`,
        `..., weil er hat gegessene.`,
      ],
      0,
      `Nel Perfekt subordinato l'ausiliare va dopo il participio, in fondo. Hat gegessen è l'ordine della principale.`,
    ),
    q(
      'q10',
      `Come si legge «weil» (perché)?`,
      [`VAIL: w = v, ei = ai`, `VEIL: ei come in «lei»`, `WAIL: w inglese`, `VI:L: ie`],
      0,
      `La w tedesca è v e ei è il dittongo ai. Weil [VAIL] e viel [FI:L] sono completamente diverse.`,
    ),
    q(
      'q11',
      `«dass» e «das» si pronunciano:`,
      [`allo stesso modo, [DAS]`, `in modo diverso: DAS e DA:S`, `dass [DAS], das [DA:S]`, `dass con s sonora [DAZ]`],
      0,
      `Le due parole sono omofone: solo la grafia le distingue. La s di dass è sorda perché doppia.`,
    ),
  ],
  [
    card(
      'c1',
      `ADUSO: aber, denn, und, sondern, oder`,
      `Congiunzioni coordinanti: ordine invariato (soggetto + verbo in 2a posizione).`,
    ),
    card('c2', `sondern vs aber`, `sondern corregge una negazione (nicht X, sondern Y); aber contrappone (X, aber Y).`),
    card(
      'c3',
      `deshalb, darum, trotzdem`,
      `Avverbi: prima posizione e verbo subito dopo: Ich bin krank, deshalb bleibe ich zu Hause.`,
    ),
    card(
      'c4',
      `weil / dass / wenn / ob`,
      `Subordinanti: perché / che / se, quando / se (indiretta). Verbo coniugato in fondo.`,
    ),
    card(
      'c5',
      `Verbo in fondo`,
      `weil ich arbeiten muss; weil er gegessen hat; dass er kommen wird; weil ich früh aufstehe.`,
    ),
    card('c6', `Virgola obbligatoria`, `Sempre prima di una subordinata: Ich glaube, dass er krank ist.`),
    card(
      'c7',
      `Subordinata prima`,
      `Wenn es regnet, bleibe ich zu Hause. Il verbo principale segue subito la virgola.`,
    ),
    card('c8', `dass vs das`, `dass = «che» (conj.); das = articolo/pronome. Si pronunciano uguali [DAS].`),
    card(
      'c9',
      `wenn vs als`,
      `wenn = ogni volta/se; als = quando (evento singolo passato); wann = quando? (interrogativo).`,
    ),
    card('c10', `ob`, `se (domanda indiretta sì/no): Ich weiß nicht, ob er kommt.`),
    card('c11', `Senza dass`, `Ich glaube, er ist krank. Senza dass l'ordine è V2.`),
    card('c12', `weil [VAIL], dass [DAS], ob [OP]`, `w = v; ei = ai; b finale = p; ss = s sorda.`),
  ],
  [
    prac(
      'p1',
      `Traduci: «Resto a casa perché sono malato e non posso lavorare.»`,
      `Ich bleibe zu Hause, weil ich krank bin und nicht arbeiten kann. Nota: due verbi in fondo, il coniugato per ultimo; und non cambia l'ordine.`,
    ),
    prac(
      'p2',
      `Traduci: «So che lui viene domani, ma non so se Anna viene.»`,
      `Ich weiß, dass er morgen kommt, aber ich weiß nicht, ob Anna kommt. Nota: dass e ob mandano il verbo in fondo; aber coordinante.`,
    ),
    prac(
      'p3',
      `Traduci: «Non bevo caffè, ma tè.»`,
      `Ich trinke keinen Kaffee, sondern Tee. Nota: sondern dopo la negazione.`,
    ),
    prac(
      'p4',
      `Correggi: «Ich lerne Deutsch weil ich möchte in Wien arbeiten. Ich weiß das er kommt.»`,
      `Ich lerne Deutsch, weil ich in Wien arbeiten möchte. Ich weiß, dass er kommt. Nota: virgola, verbo in fondo, dass con due s.`,
    ),
    prac(
      'p5',
      `Unisci con weil e con denn: «Ich bin müde. Ich habe schlecht geschlafen.»`,
      `Ich bin müde, weil ich schlecht geschlafen habe. Ich bin müde, denn ich habe schlecht geschlafen. Nota: weil manda hat in fondo; denn lascia l'ordine normale.`,
    ),
  ],
)
