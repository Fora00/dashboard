import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './spagnolo.pron'

// Spanish B1 modules, part 1: subjuntivo (present, conjunctions), compound tenses.

export const esSubj1 = mod(
  'es-subj1',
  'Presente de subjuntivo',
  'Formazione regolare e irregolare; desiderio, dubbio, emozione, opinione, giudizio',
  'b1',
  `<p class="lead">Il <b>subjuntivo</b> è il modo della soggettività: desiderio, dubbio, emozione, giudizio. In spagnolo è molto più vivo del congiuntivo italiano e lo senti ogni giorno, anche nel parlato. Qui il <b>presente</b>.</p>
${PRON_SHORT}
<h3>Formazione regolare</h3>
<p>Parti dalla 1ª persona del presente indicativo (<i>yo</i>), togli la <code>-o</code> e aggiungi la vocale "contraria": i verbi in <b>-ar</b> prendono la <b>-e</b>, quelli in <b>-er/-ir</b> la <b>-a</b>.</p>
<table><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td>hable</td><td>coma</td><td>viva</td></tr>
<tr><td>tú</td><td>hables</td><td>comas</td><td>vivas</td></tr>
<tr><td>él/ella/usted</td><td>hable</td><td>coma</td><td>viva</td></tr>
<tr><td>nosotros</td><td>hablemos</td><td>comamos</td><td>vivamos</td></tr>
<tr><td>vosotros</td><td>habléis</td><td>comáis</td><td>viváis</td></tr>
<tr><td>ellos/ustedes</td><td>hablen</td><td>coman</td><td>vivan</td></tr></table>
<p>La 1ª e la 3ª persona singolare sono uguali: se serve, usa il pronome (<i>que yo hable / que él hable</i>).</p>
<h3>Accento e pronuncia</h3>
<p>L'accento tonico fa la differenza tra tempi diversi: <i>hable</i> [A-ble] (subjuntivo) contro <i>hablé</i> [a-BLE] (passato, "parlai"); <i>hable</i> [A-ble] contro <i>hablo</i> [A-blo]. Nel subjuntivo l'accento sta sulla stessa sillaba dell'indicativo presente: <i>cante</i> [KAN-te], <i>coma</i> [KO-ma], <i>habléis</i> [a-BLEIS]. Forme da leggere ad alta voce: <i>tenga</i> [TEN-ga], <i>venga</i> [BEN-ga], <i>haga</i> [A-ga], <i>salga</i> [SAL-ga], <i>vaya</i> [BA-ya], <i>sepa</i> [SE-pa], <i>sea</i> [SE-a], <i>llueva</i> [YUE-ba], <i>llegue</i> [YE-ghe], <i>busque</i> [BUS-ke], <i>empiece</i> [em-PIE-the], <i>coja</i> [KO-ha], <i>conozca</i> [ko-NOTH-ka], <i>pidamos</i> [pi-DHA-mos]. Attenzione a <i>dé</i> [DE] (verbo <i>dar</i>) contro <i>de</i> [de] (preposizione): l'accento scritto li distingue.</p>
<h3>Irregolari derivati dalla 1ª persona</h3>
<p>La radice irregolare di <i>yo</i> resta in tutte le persone: <i>tener</i> → <b>tenga</b>, <i>hacer</i> → <b>haga</b>, <i>decir</i> → <b>diga</b>, <i>poner</i> → <b>ponga</b>, <i>salir</i> → <b>salga</b>, <i>venir</i> → <b>venga</b>, <i>oír</i> → <b>oiga</b>, <i>traer</i> → <b>traiga</b>, <i>caer</i> → <b>caiga</b>, <i>ver</i> → <b>vea</b>, <i>conocer</i> → <b>conozca</b>, <i>conducir</i> → <b>conduzca</b>, <i>construir</i> → <b>construya</b>.</p>
<h3>I sei davvero irregolari</h3>
<table><tr><th>ser</th><td>sea, seas, sea, seamos, seáis, sean</td></tr>
<tr><th>estar</th><td>esté, estés, esté, estemos, estéis, estén</td></tr>
<tr><th>ir</th><td>vaya, vayas, vaya, vayamos, vayáis, vayan</td></tr>
<tr><th>saber</th><td>sepa, sepas, sepa, sepamos, sepáis, sepan</td></tr>
<tr><th>haber</th><td>haya, hayas, haya, hayamos, hayáis, hayan</td></tr>
<tr><th>dar</th><td>dé, des, dé, demos, deis, den</td></tr></table>
<h3>Cambi vocalici e ortografici</h3>
<ul><li><b>e→ie, o→ue</b> come nell'indicativo, ma non in nosotros/vosotros: <i>pensar</i> → piense, pienses, piense, <b>pensemos</b>, <b>penséis</b>, piensen; <i>poder</i> → pueda… <b>podamos</b>.</li><li><b>Verbi in -ir</b>: cambiano anche nosotros/vosotros (e→i, o→u): <i>sentir</i> → sintamos; <i>dormir</i> → durmamos; <i>pedir</i> → pidamos.</li><li><b>Ortografia</b>: <i>buscar</i> → busque; <i>llegar</i> → llegue; <i>empezar</i> → empiece; <i>coger</i> → coja; <i>seguir</i> → siga.</li></ul>
<h3>Quando si usa</h3>
<p>Il subjuntivo compare in una frase subordinata introdotta da <b>que</b> quando il <b>soggetto cambia</b>. Con lo stesso soggetto si usa l'infinito: <i>Quiero ir</i> (voglio andare), ma <i>Quiero que vayas</i> (voglio che tu vada).</p>
<ul><li><b>Volontà, richiesta, consiglio</b>: querer, preferir, pedir, necesitar, permitir, prohibir, aconsejar, recomendar + que. <i>Te aconsejo que descanses.</i> (Ti consiglio di riposare.)</li><li><b>Emozione</b>: me alegro de que, me gusta que, me molesta que, siento que, temo que. <i>Me alegro de que estés aquí.</i> (Sono contento che tu sia qui.)</li><li><b>Dubbio e negazione</b>: dudo que, no creo que, no pienso que, no es cierto que. <i>No creo que tenga tiempo.</i> (Non credo che abbia tempo.)</li><li><b>Giudizio e impersonali</b>: es importante/necesario/mejor/posible/probable que, hace falta que, conviene que, es una lástima que. <i>Es necesario que lo sepas.</i> (È necessario che tu lo sappia.)</li><li><b>Ojalá</b> (magari, speriamo): <i>Ojalá llueva.</i> (Speriamo che piova.) Regge sempre il subjuntivo; <i>que</i> è facoltativo: <i>Ojalá que llueva</i> è ugualmente corretto.</li></ul>
<h3>Trappole per italiani</h3>
<ul><li><b>Credo che sia vero</b> → <i>Creo que es verdad</i>: <i>creer</i>, <i>pensar</i>, <i>parecer</i> affermativi vogliono l'<b>indicativo</b>. Il subjuntivo arriva solo con la negazione: <i>no creo que sea verdad</i>. Anche <i>es verdad/cierto/evidente que</i> + indicativo.</li><li><b>Spero di venire</b> → <i>Espero venir</i> (stesso soggetto = infinito, senza <i>de</i>).</li><li><b>Aspetto che arrivi</b> → <i>Espero a que llegue</i> (esperar a que = aspettare), mentre <i>espero que llegue</i> = spero che arrivi.</li><li><b>Forse</b>: <i>quizás/tal vez</i> + subjuntivo (o indicativo se più sicuro); <i>a lo mejor</i> vuole sempre l'indicativo.</li><li><b>Ordine o informazione</b>: <i>Dile que venga</i> (digli di venire) contro <i>Dile que viene</i> (digli che viene).</li></ul>
<div class="say"><b>Cosa dire.</b> «Quiero que vengas, no creo que llueva, ojalá tengas razón.» (Voglio che tu venga, non credo che piova, speriamo che tu abbia ragione.)</div>`,
  [
    q(
      'q1',
      'Presente di subjuntivo di <i>hablar</i> per <i>tú</i>:',
      [`hables`, `hablas`, `hablaras`, `hablarás`],
      0,
      `I verbi in -ar prendono la vocale -e nel subjuntivo: tú hables. La forma hablas è l'indicativo, la scelta più tentante.`,
    ),
    q(
      'q2',
      'Completa: <i>Es verdad que (él) ___ razón.</i>',
      [`tiene`, `tenga`, `tuviera`, `tendría`],
      0,
      `Dopo es verdad que affermativo si usa l'indicativo: tiene. Tenga sarebbe corretto solo con la negazione (no es verdad que tenga).`,
    ),
    q(
      'q3',
      'Completa: <i>No creo que ___ fácil.</i>',
      [`sea`, `es`, `será`, `fue`],
      0,
      `No creo que esprime dubbio e vuole il subjuntivo: sea. Es è la forma che useresti con creo que affermativo.`,
    ),
    q(
      'q4',
      'Come si dice «Voglio che tu venga con me»?',
      [
        `Quiero que vengas conmigo`,
        `Quiero que vienes conmigo`,
        `Quiero que vendrás conmigo`,
        `Quiero que vengo conmigo`,
      ],
      0,
      `Il soggetto cambia, quindi serve que + subjuntivo (vengas). Vienes è indicativo, vendrás è il calco di «voglio che verrai» e vengo è la forma di yo, che non cambia soggetto.`,
    ),
    q(
      'q5',
      'Come si dice «Spero di arrivare in tempo»?',
      [`Espero llegar a tiempo`, `Espero de llegar a tiempo`, `Espero que llegar a tiempo`, `Espero a llegar a tiempo`],
      0,
      `Con lo stesso soggetto si usa l'infinito senza preposizione. Espero de è un'interferenza dall'italiano spero di.`,
    ),
    q(
      'q6',
      'Quale forma è il subjuntivo di <i>dar</i> con <i>yo</i>?',
      [`dé`, `doy`, `de`, `dea`],
      0,
      `Il verbo dar fa dé con l'accento scritto. De senza accento è la preposizione, mentre dea non esiste come forma verbale.`,
    ),
    q(
      'q7',
      'Qual è il presente di subjuntivo di <i>pensar</i> per <i>nosotros</i>?',
      [`pensemos`, `pensamos`, `piensemos`, `pienséis`],
      0,
      `Nei verbi in -ar ed -er la vocale della radice non cambia in nosotros e vosotros. Piensemos è un errore molto diffuso.`,
    ),
    q(
      'q8',
      `Come dici «Aspetto che arrivi il treno»?`,
      [
        `Espero a que llegue el tren`,
        `Espero que llega el tren`,
        `Espero de que llegue el tren`,
        `Espero a que llega el tren`,
      ],
      0,
      `Esperar a que + subjuntivo significa aspettare che. Espero que senza a vuol dire spero che, un altro significato.`,
    ),
    q(
      'q9',
      `Quale frase significa «Digli di venire»?`,
      [`Dile que venga`, `Dile que viene`, `Dile venir`, `Dile que vino`],
      0,
      `Un ordine indiretto vuole il subjuntivo: venga. Dile que viene riferisce un'informazione (digli che viene).`,
    ),
    q(
      'q10',
      `Quale parola si pronuncia con l'accento sull'ultima sillaba?`,
      [`hablé [a-BLE]`, `hable [A-ble]`, `hablo [A-blo]`, `hablen [A-blen]`],
      0,
      `Hablé (passato) ha l'accento scritto e tonico sulla fine; hable e hablen sono piane. Senza accento scritto la tonica cade sulla radice.`,
    ),
  ],
  [
    card(
      `c1`,
      `Formazione del presente di subjuntivo`,
      `1ª persona dell'indicativo, via -o, vocale contraria: -ar → -e; -er/-ir → -a. Hablo → hable; como → coma.`,
    ),
    card(`c2`, `Sei irregolari del subjuntivo`, `ser sea · estar esté · ir vaya · saber sepa · haber haya · dar dé`),
    card(
      `c3`,
      `tener, hacer, decir, venir, salir al subjuntivo`,
      `tenga, haga, diga, venga, salga (radice di yo in tutte le persone).`,
    ),
    card(
      `c4`,
      `Soggetto uguale o diverso?`,
      `Diverso: que + subjuntivo (quiero que vengas). Uguale: infinito (quiero venir).`,
    ),
    card(`c5`, `Creo que… / No creo que…`, `Creo que es verdad (indicativo). No creo que sea verdad (subjuntivo).`),
    card(
      `c6`,
      `Ojalá + subjuntivo`,
      `Ojalá llueva = speriamo che piova. Regge il subjuntivo; que è facoltativo (ojalá que llueva).`,
    ),
    card(
      `c7`,
      `esperar que / esperar a que`,
      `Espero que vengas = spero che tu venga. Espero a que vengas = aspetto che tu venga.`,
    ),
    card(`c8`, `dé / de`, `dé [DE] = dar (subjuntivo, con accento). de [de] = preposizione (di, da).`),
    card(
      `c9`,
      `Cambio vocalico in nosotros`,
      `Pensar: pensemos. Poder: podamos. Ma nei verbi in -ir cambia: dormir → durmamos, pedir → pidamos.`,
    ),
    card(`c10`, `A lo mejor / quizás`, `A lo mejor + indicativo sempre. Quizás/tal vez + subjuntivo (o indicativo).`),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Voglio che tu mi dica la verità.»`,
      `Quiero que me digas la verdad. Nota: soggetti diversi (io/tu), quindi que + subjuntivo; il pronome me va prima del verbo.`,
    ),
    prac(
      `p2`,
      `Correggi l'errore: «Creo que sea una buena idea.»`,
      `Creo que es una buena idea. Con creer affermativo si usa l'indicativo; il subjuntivo sarebbe corretto solo con no creo que.`,
    ),
    prac(
      `p3`,
      `Completa con la forma giusta: «Es importante que (tú, venir) ___ puntual y que (nosotros, salir) ___ temprano.»`,
      `Es importante que vengas puntual y que salgamos temprano. Note: venir → venga, salir → salga (radice di yo).`,
    ),
    prac(
      `p4`,
      `Scrivi due frasi: una con ojalá e una con me alegro de que.`,
      `Esempio: Ojalá haga buen tiempo mañana. / Me alegro de que estés aquí. Verifica: ojalá regge il subjuntivo (que è facoltativo), e nella seconda il soggetto è diverso (io / tu), per questo serve que + subjuntivo.`,
    ),
    prac(
      `p5`,
      `Traduci: «Aspetto che tu mi chiami.»`,
      `Espero a que me llames. Nota: esperar a que = aspettare che; espero que me llames sarebbe "spero che mi chiami".`,
    ),
  ],
)

export const esSubj2 = mod(
  'es-subj2',
  'Subjuntivo: congiunzioni, relative, imperativo negativo',
  'Cuando, aunque, para que, antes de que; relative; imperativo; indicativo contro subjuntivo',
  'b1',
  `<p class="lead">Dopo molte <b>congiunzioni</b> il subjuntivo è obbligatorio. Per le congiunzioni di tempo e per <i>aunque</i> conta se parli di un fatto reale o di qualcosa che deve ancora accadere o è solo ipotizzato.</p>
${PRON_SHORT}
<h3>Sempre subjuntivo</h3>
<ul><li><b>para que</b> (affinché), <b>a fin de que</b>, <b>antes de que</b> (prima che), <b>sin que</b> (senza che), <b>con tal de que</b>, <b>a condición de que</b>, <b>a menos que / a no ser que</b> (a meno che), <b>en caso de que</b> (nel caso che).</li><li><i>Te lo explico para que lo entiendas.</i> (Te lo spiego perché tu lo capisca.)</li><li><i>Llámame antes de que salgas.</i> (Chiamami prima che tu esca.)</li><li>Con lo <b>stesso soggetto</b> si usa l'infinito: <i>Estudio para aprobar</i>, <i>Antes de salir, llama</i>, <i>Salió sin despedirse</i>.</li></ul>
<h3>Congiunzioni di tempo</h3>
<p>Con <b>cuando, en cuanto, tan pronto como, hasta que, después de que, mientras</b>: indicativo per abitudine e passato, <b>subjuntivo per il futuro</b> (<i>cuando llegues</i> [KUAN-do YE-ghes], <i>en cuanto termine</i> [en KUAN-to ter-MI-ne], <i>hasta que vuelvas</i> [AS-ta ke BUEL-bas]). Attenzione: <i>mientras que</i> (mentre, invece) vuole l'indicativo: <i>Yo trabajo mientras que tú descansas.</i></p>
<table><tr><td>Abitudine</td><td>Cuando llego, te llamo.</td></tr>
<tr><td>Passato</td><td>Cuando llegué, te llamé.</td></tr>
<tr><td>Futuro</td><td>Cuando llegues, llámame.</td></tr></table>
<p><b>Trappola</b>: l'italiano dice «quando arriverai» (futuro), lo spagnolo vuole il subjuntivo presente: <i>cuando llegues</i>, mai <i>*cuando llegarás</i>. Così <i>En cuanto lo sepa, te aviso</i> (Appena lo saprò, ti avviso) e <i>No me voy hasta que termines</i> (Non me ne vado finché non finisci; la negazione italiana non si traduce).</p>
<h3>Aunque</h3>
<ul><li><b>Indicativo</b>: fatto reale e noto. <i>Aunque llueve, salgo.</i> (Anche se piove — e piove — esco.)</li><li><b>Subjuntivo</b>: ipotesi o fatto irrilevante. <i>Aunque llueva, saldré.</i> (Anche se dovesse piovere, uscirò.)</li><li>Simili: <i>por mucho que</i>, <i>por más que</i> (per quanto): <i>Por mucho que insistas, no cambiaré de idea.</i></li></ul>
<h3>Frasi relative</h3>
<p>Antecedente <b>noto ed esistente</b> → indicativo. Antecedente <b>ignoto, inesistente o indefinito</b> → subjuntivo.</p>
<ul><li><i>Tengo un piso que tiene terraza.</i> (esiste, lo conosco)</li><li><i>Busco un piso que tenga terraza.</i> (uno qualsiasi che l'abbia)</li><li><i>No hay nadie que lo sepa. / ¿Hay alguien que hable chino?</i></li><li><i>Haz lo que quieras. Quien quiera venir, que venga.</i></li></ul>
<h3>Imperativo e imperativo negativo</h3>
<table><tr><th></th><th>affermativo</th><th>negativo</th></tr>
<tr><td>tú</td><td>habla</td><td>no hables</td></tr>
<tr><td>usted</td><td>hable</td><td>no hable</td></tr>
<tr><td>nosotros</td><td>hablemos</td><td>no hablemos</td></tr>
<tr><td>vosotros</td><td>hablad</td><td>no habléis</td></tr>
<tr><td>ustedes</td><td>hablen</td><td>no hablen</td></tr></table>
<ul><li>Il <b>negativo è sempre subjuntivo</b>. L'italiano usa l'infinito («non parlare»): in spagnolo <i>no hables</i>, mai <i>*no hablar</i>.</li><li>Affermativo di <i>tú</i> = 3ª persona dell'indicativo: <i>come</i>, <i>escribe</i>. Irregolari: <b>ven, di, haz, ten, pon, sal, sé, ve</b>.</li><li><i>Vosotros</i> affermativo: infinito senza -r più <b>-d</b> (<i>comed</i>, <i>vivid</i>); con il riflessivo <i>levantaos</i>.</li><li><b>Pronomi</b>: dopo l'affermativo (<i>dímelo</i>, <i>siéntate</i>), prima del negativo (<i>no me lo digas</i>, <i>no te sientes</i>).</li></ul>
<h3>Indicativo o subjuntivo?</h3>
<ul><li>Certezza, fatto, informazione → <b>indicativo</b>: <i>Sé que viene</i>, <i>Dicen que es caro</i>.</li><li>Desiderio, dubbio, emozione, giudizio → <b>subjuntivo</b>: <i>Dudo que venga</i>.</li><li><i>Como</i> + subjuntivo = se non: <i>Como no estudies, suspenderás.</i></li><li><i>Por si</i> + indicativo: <i>Llévate el paraguas por si llueve.</i></li></ul>
<div class="say"><b>Cosa dire.</b> «Cuando llegues, llámame. Aunque llueva, saldremos. No te preocupes.» (Quando arrivi, chiamami. Anche se piove, usciremo. Non ti preoccupare.)</div>`,
  [
    q(
      'q1',
      `Come si dice «Quando arriverai, chiamami»?`,
      [`Cuando llegues, llámame`, `Cuando llegarás, llámame`, `Cuando llegas, llámame`, `Cuando llegaste, llámame`],
      0,
      `Per il futuro dopo cuando serve il subjuntivo presente. Cuando llegarás è un calco dell'italiano e non esiste in spagnolo.`,
    ),
    q(
      'q2',
      `Quale frase è corretta per «Non parlare ad alta voce»?`,
      [`No hables en voz alta`, `No hablar en voz alta`, `No habla en voz alta`, `No hablas en voz alta`],
      0,
      `L'imperativo negativo usa il subjuntivo: no hables. Il calco italiano con l'infinito (no hablar) non è un imperativo corretto.`,
    ),
    q(
      'q3',
      `Completa: <i>Te lo explico para que lo ___.</i>`,
      [`entiendas`, `entiendes`, `entender`, `entenderás`],
      0,
      `Para que regge sempre il subjuntivo e il soggetto cambia (io spiego, tu capisci). Entender sarebbe giusto solo con para e stesso soggetto.`,
    ),
    q(
      'q4',
      `Quale frase esprime che la pioggia è solo ipotetica?`,
      [`Aunque llueva, saldré`, `Aunque llueve, saldré`, `Aunque lloverá, saldré`, `Aunque llovió, saldré`],
      0,
      `Aunque + subjuntivo presenta un fatto ipotetico o irrilevante. Con l'indicativo (llueve) la pioggia è un fatto già reale e noto.`,
    ),
    q(
      'q5',
      `Completa: <i>Busco un empleado que ___ inglés.</i>`,
      [`hable`, `habla`, `hablará`, `hablaba`],
      0,
      `Il dipendente è ignoto (uno qualsiasi che parli inglese), quindi subjuntivo. Con un dipendente preciso e noto useresti habla.`,
    ),
    q(
      'q6',
      `Quale è l'imperativo affermativo corretto di <i>tú</i> per <i>hacer</i>?`,
      [`haz`, `hace`, `hagas`, `haga`],
      0,
      `Haz è una forma irregolare dell'imperativo di tú. Hagas è il negativo (no hagas), e haga è la forma di usted.`,
    ),
    q(
      'q7',
      `Come dici «Dimmelo» e «Non me lo dire»?`,
      [`Dímelo / No me lo digas`, `Dímelo / No me lo dices`, `Dime lo / No me lo digas`, `Dímelo / No dímelo`],
      0,
      `Nell'affermativo i pronomi seguono il verbo (dímelo, con accento scritto); nel negativo lo precedono e il verbo è al subjuntivo. No me lo dices è indicativo, e No dímelo mette i pronomi dopo il verbo, cosa ammessa solo nell'affermativo.`,
    ),
    q(
      'q8',
      `Quando si usa l'indicativo dopo <i>cuando</i>?`,
      [`Per un'abitudine o un fatto passato`, `Per un'azione futura`, `Per un ordine`, `Per un desiderio`],
      0,
      `Per le azioni abituali o passate il fatto è reale e l'indicativo basta. Per il futuro invece serve il subjuntivo presente.`,
    ),
  ],
  [
    card(`c1`, `Cuando + futuro`, `Subjuntivo presente: cuando llegues, cuando termine. Mai cuando llegarás.`),
    card(
      `c2`,
      `Congiunzioni sempre con il subjuntivo`,
      `para que, antes de que, sin que, a menos que, con tal de que, en caso de que.`,
    ),
    card(`c3`, `Stesso soggetto`, `Infinito: para aprobar, antes de salir, sin decir nada.`),
    card(
      `c4`,
      `Aunque + indicativo / subjuntivo`,
      `Indicativo: fatto reale (aunque llueve). Subjuntivo: ipotesi o irrilevanza (aunque llueva).`,
    ),
    card(`c5`, `Imperativo negativo`, `Sempre subjuntivo: no hables, no hable, no hablemos, no habléis, no hablen.`),
    card(`c6`, `Imperativi irregolari di tú`, `ven, di, haz, ten, pon, sal, sé, ve`),
    card(`c7`, `Imperativo di vosotros`, `Infinito − r + d: hablad, comed, vivid. Riflessivo: levantaos.`),
    card(`c8`, `Posizione dei pronomi`, `Affermativo: dopo e attaccati (dímelo). Negativo: prima (no me lo digas).`),
    card(
      `c9`,
      `Relativa con antecedente ignoto`,
      `Subjuntivo: busco un piso que tenga terraza. Noto: tengo un piso que tiene terraza.`,
    ),
    card(`c10`, `Como + subjuntivo`, `Significa "se non": como no estudies, suspenderás.`),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Appena avrò finito, ti chiamo.»`,
      `En cuanto termine, te llamo. Nota: dopo en cuanto con senso futuro serve il subjuntivo, non il futuro (en cuanto terminaré è errato).`,
    ),
    prac(
      `p2`,
      `Traduci: «Non dimenticare le chiavi!» (a un amico) e (a un cliente).`,
      `¡No olvides las llaves! / ¡No olvide las llaves! Nota: l'imperativo negativo è sempre subjuntivo (tú olvides, usted olvide).`,
    ),
    prac(
      `p3`,
      `Correggi: «Cuando tendrás tiempo, llámame.»`,
      `Cuando tengas tiempo, llámame. Spiegazione: il futuro dell'italiano diventa subjuntivo presente dopo cuando.`,
    ),
    prac(
      `p4`,
      `Scrivi una frase con una relativa che richiede il subjuntivo («Cerco un ristorante dove si mangi bene»).`,
      `Busco un restaurante donde se coma bien. Nota: il ristorante è ignoto, quindi subjuntivo; se lo conosci diresti donde se come bien.`,
    ),
    prac(
      `p5`,
      `Dì a un amico «Dammelo» e «Non darmelo» (parli del libro).`,
      `Dámelo / No me lo des. Nota: nell'affermativo i pronomi si attaccano al verbo (con accento scritto), nel negativo vanno prima e il verbo è al subjuntivo (des).`,
    ),
  ],
)

export const esTrapas = mod(
  'es-trapas',
  'Tempi composti e concordanza dei tempi',
  'Pluscuamperfecto, perfecto de subjuntivo, futuro perfecto, condicional perfecto',
  'b1',
  `<p class="lead">I tempi composti si formano con il verbo <b>haber</b> + participio passato. In spagnolo il participio resta <b>invariabile</b> e nulla si inserisce tra i due: <i>Ya he comido</i> (non <i>*He ya comido</i>).</p>
${PRON_SHORT}
<h3>Haber nei tempi composti</h3>
<table><tr><th></th><th>había</th><th>habré</th><th>habría</th></tr>
<tr><td>yo</td><td>había</td><td>habré</td><td>habría</td></tr>
<tr><td>tú</td><td>habías</td><td>habrás</td><td>habrías</td></tr>
<tr><td>él/ella</td><td>había</td><td>habrá</td><td>habría</td></tr>
<tr><td>nosotros</td><td>habíamos</td><td>habremos</td><td>habríamos</td></tr>
<tr><td>vosotros</td><td>habíais</td><td>habréis</td><td>habríais</td></tr>
<tr><td>ellos</td><td>habían</td><td>habrán</td><td>habrían</td></tr></table>
<p>Altre forme: perfecto de subjuntivo <b>haya, hayas, haya, hayamos, hayáis, hayan</b>; pretérito anterior <b>hube, hubiste, hubo, hubimos, hubisteis, hubieron</b>.</p>
<h3>Participi irregolari</h3>
<p><b>abierto, cubierto, dicho, escrito, hecho, puesto, roto, visto, vuelto, muerto, resuelto, descubierto, devuelto, satisfecho, impreso</b>. I composti: <i>deshecho</i>, <i>compuesto</i>, <i>supuesto</i>. Regolari: -ado, -ido (<i>comprado</i>, <i>vivido</i>).</p>
<h3>Gli usi</h3>
<ul><li><b>Pluscuamperfecto</b> (<i>había + participio</i>): azione anteriore a un momento del passato. <i>Cuando llegué, ya habían salido.</i> (Quando arrivai, erano già usciti.)</li><li><b>Pretérito anterior</b> (<i>hube + participio</i>): solo letterario, dopo <i>apenas, en cuanto, cuando</i>. <i>Apenas hubo llegado, empezó a llover.</i> Nel parlato: pluscuamperfecto o pretérito.</li><li><b>Perfecto de subjuntivo</b> (<i>haya + participio</i>): <i>Espero que hayas dormido bien.</i> · <i>No creo que haya terminado.</i> · Futuro anteriore italiano → <b>cuando hayas terminado, avísame</b> (quando avrai finito).</li><li><b>Futuro perfecto</b> (<i>habré + participio</i>): <i>Mañana a esta hora ya habré llegado.</i> Anche congettura sul passato recente: <i>Ya habrán llegado.</i> (Saranno già arrivati.)</li><li><b>Condicional perfecto</b> (<i>habría + participio</i>): <i>Habría ido, pero no pude.</i> (Sarei andato, ma non ho potuto.)</li></ul>
<h3>Concordanza dei tempi</h3>
<table><tr><th>Verbo principale</th><th>Subordinata</th></tr>
<tr><td>presente, futuro, imperativo</td><td>presente de subjuntivo (contemporanea o futura) o perfecto de subjuntivo (già compiuta)</td></tr>
<tr><td>pretérito perfecto (he pedido)</td><td>presente o perfecto; ma se l'azione subordinata è passata anche l'imperfecto: <i>Me ha pedido que viniera</i></td></tr>
<tr><td>indefinido, imperfecto, pluscuamperfecto, condicional</td><td>imperfecto de subjuntivo (contemporanea o posteriore) o pluscuamperfecto de subjuntivo (anteriore)</td></tr></table>
<p>L'<b>imperfecto de subjuntivo</b> si forma dalla 3ª plurale dell'indefinido (<i>vinieron</i> → <b>viniera</b>, <i>pidieron</i> → <b>pidiera</b>): lo studi per intero nel modulo successivo sul periodo ipotetico. Il <b>pluscuamperfecto de subjuntivo</b> è <b>hubiera + participio</b>: <i>hubiera, hubieras, hubiera, hubiéramos, hubierais, hubieran</i> + <i>venido</i>. Esempio: <i>Esperaba que hubieras llegado</i> (speravo che fossi arrivato).</p>
<ul><li><i>Quiero que vengas</i> → <i>Quería que vinieras</i> → <i>Me gustaría que vinieras.</i></li><li><i>Espero que hayas llegado</i> → <i>Esperaba que hubieras llegado.</i></li><li><i>Me pidió que me quedara.</i> (Mi chiese di restare.)</li></ul>
<h3>Trappole per italiani</h3>
<ul><li><b>Ho già mangiato</b> → <i>Ya he comido</i>; <b>ho appena finito</b> → <i>Acabo de terminar</i>.</li><li>Il participio con <i>haber</i> non concorda: <i>Las he visto</i> (non <i>*las he vistas</i>).</li><li><b>Ho scritto</b> = <i>He escrito</i> (non <i>*escribido</i>). Uso: in Spagna il perfecto per il passato che tocca il presente (hoy, esta semana, nunca, ya); in gran parte dell'America si usa spesso il pretérito (<i>Hoy comí</i>).</li><li><b>Habría</b> [a-BRI-a] (condizionale) contro <b>habrá</b> [a-BRA] (futuro): l'accento fa la differenza. Altre forme da leggere: <i>había</i> [a-BI-a], <i>habré</i> [a-BRE], <i>hubiera</i> [u-BIE-ra], <i>hayas</i> [A-yas], <i>hecho</i> [E-cio], <i>dicho</i> [DI-cio], <i>puesto</i> [PUES-to].</li></ul>
<div class="say"><b>Cosa dire.</b> «Cuando llegué, ya habían cerrado. Espero que hayas dormido bien. Habría ido contigo.» (Quando arrivai, avevano già chiuso. Spero che tu abbia dormito bene. Sarei venuto con te.)</div>`,
  [
    q(
      'q1',
      `Come si dice «Quando arrivai, erano già usciti»?`,
      [
        `Cuando llegué, ya habían salido`,
        `Cuando llegué, ya salían`,
        `Cuando llegué, ya han salido`,
        `Cuando llegué, ya habrán salido`,
      ],
      0,
      `Per un'azione anteriore a un momento del passato serve il pluscuamperfecto (habían salido). Han salido è un presente composto, non un passato.`,
    ),
    q(
      'q2',
      `Quale frase traduce «Quando avrai finito, avvisami»?`,
      [
        `Cuando hayas terminado, avísame`,
        `Cuando habrás terminado, avísame`,
        `Cuando terminarás, avísame`,
        `Cuando has terminado, avísame`,
      ],
      0,
      `Dopo cuando con senso futuro si usa il subjuntivo; il futuro anteriore italiano diventa perfecto de subjuntivo. Habrás sarebbe un calco errato.`,
    ),
    q(
      'q3',
      `Qual è il participio di <i>escribir</i>?`,
      [`escrito`, `escribido`, `escriba`, `escribiendo`],
      0,
      `Escrito è irregolare, come dicho, hecho, puesto, visto. Escribido è una regolarizzazione che non esiste in spagnolo.`,
    ),
    q(
      'q4',
      `Qual è la forma corretta?`,
      [`Ya he comido`, `He ya comido`, `Ya comido he`, `Ya tengo comer`],
      0,
      `Tra haber e il participio non si inserisce nulla: l'avverbio ya va prima di he. He ya comido è un calco dell'italiano ho già mangiato.`,
    ),
    q(
      'q5',
      `Come si dice «Mi chiese di restare»?`,
      [`Me pidió que me quedara`, `Me pidió que me quedo`, `Me pidió que me quede`, `Me pidió quedarme que`],
      0,
      `Il verbo principale è al passato, quindi il subjuntivo è imperfetto (quedara). Quede sarebbe corretto con un verbo principale al presente.`,
    ),
    q(
      'q6',
      `Cosa esprime <i>Ya habrán llegado</i>?`,
      [`Una congettura: saranno già arrivati`, `Un'azione futura certa`, `Un ordine`, `Un fatto passato certo`],
      0,
      `Il futuro perfecto serve anche a fare ipotesi sul passato recente. Non indica un'azione futura vera e propria.`,
    ),
    q(
      'q7',
      `Quale frase è corretta con <i>ver</i>? «Le ho viste»`,
      [`Las he visto`, `Las he vistas`, `Las han visto`, `Las había vistas`],
      0,
      `Il participio con haber è invariabile (visto), a differenza dell'italiano che concorda (viste). L'oggetto va solo prima del verbo.`,
    ),
    q(
      'q8',
      `Quale forma è il condizionale perfetto di <i>ir</i> con <i>yo</i>?`,
      [`habría ido`, `habré ido`, `había ido`, `haya ido`],
      0,
      `Il condicional perfecto usa habría + participio. Habré ido è futuro, había ido è pluscuamperfecto.`,
    ),
  ],
  [
    card(`c1`, `Pluscuamperfecto`, `había + participio: Cuando llegué, ya habían salido.`),
    card(`c2`, `Perfecto de subjuntivo`, `haya + participio: Espero que hayas dormido bien.`),
    card(`c3`, `Futuro perfecto`, `habré + participio: Mañana ya habré llegado. Anche congettura: Ya habrán llegado.`),
    card(`c4`, `Condicional perfecto`, `habría + participio: Habría ido, pero no pude.`),
    card(
      `c5`,
      `Pretérito anterior`,
      `hube + participio, letterario: Apenas hubo llegado… Nel parlato: pluscuamperfecto.`,
    ),
    card(
      `c6`,
      `Participi irregolari`,
      `abierto, cubierto, dicho, escrito, hecho, puesto, roto, visto, vuelto, muerto, resuelto`,
    ),
    card(`c7`, `Cuando hayas terminado…`, `Equivale al futuro anteriore italiano (quando avrai finito).`),
    card(
      `c8`,
      `Concordanza con verbo al passato`,
      `Subjuntivo imperfecto: Quería que vinieras. Me pidió que me quedara.`,
    ),
    card(
      `c9`,
      `Concordanza con verbo al presente`,
      `Subjuntivo presente o perfecto: Quiero que vengas. Espero que hayas venido.`,
    ),
    card(`c10`, `habría / habrá`, `habría [a-BRI-a] = condizionale. habrá [a-BRA] = futuro.`),
    card(
      `c11`,
      `Dopo he pedido / ha dicho…`,
      `Dopo il pretérito perfecto: presente de subjuntivo o, se l'azione è passata, imperfecto: Me ha pedido que viniera.`,
    ),
    card(
      `c12`,
      `Pluscuamperfecto de subjuntivo`,
      `hubiera + participio: Esperaba que hubieras llegado. Anche nel tipo 3: Si hubiera estudiado, habría aprobado.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Quando sono arrivato, il film era già cominciato.»`,
      `Cuando llegué, la película ya había empezado. Note: llegué = pretérito indefinido, había empezado = pluscuamperfecto (azione anteriore).`,
    ),
    prac(
      `p2`,
      `Traduci: «Spero che tu abbia capito.»`,
      `Espero que hayas entendido. Perfecto de subjuntivo dopo un verbo principale al presente.`,
    ),
    prac(
      `p3`,
      `Correggi: «He ya hecho los deberes.»`,
      `Ya he hecho los deberes. Spiegazione: nulla si inserisce tra haber e il participio; hecho è già corretto.`,
    ),
    prac(
      `p4`,
      `Traduci: «Sarei andato in vacanza, ma non avevo soldi.»`,
      `Habría ido de vacaciones, pero no tenía dinero. Nota: habría ido (condicional perfecto) + imperfecto per lo stato (tenía).`,
    ),
    prac(
      `p5`,
      `Trasforma al passato: «Quiero que vengas.» → «Quería que ___.»`,
      `Quería que vinieras (o viniese). Il verbo principale è al passato, quindi il subjuntivo è imperfetto.`,
    ),
    prac(
      `p6`,
      `Traduci: «Mi ha chiesto di aspettarlo» (ha chiesto = he pedido, azione passata) e «Speravo che fossi arrivato».`,
      `Me ha pedido que lo esperara. / Esperaba que hubieras llegado. Dopo il perfecto l'imperfecto de subjuntivo è normale se l'azione è passata; con esperaba (passato) e un'azione anteriore serve il pluscuamperfecto de subjuntivo (hubieras llegado).`,
    ),
  ],
)
