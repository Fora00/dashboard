import { card, mod, prac, q } from './python-path.helpers'

// Spanish course, A2: past tenses, perfect, future and conditional.
// Pronunciation convention: see the header of spagnolo.a.ts ([ ] = Italian-based, STRESS in capitals, th, h, ss, gn, dh).

export const esPassato = mod(
  'es-passato',
  'Pretérito indefinido',
  'Verbi regolari e irregolari, cambi ortografici, verbi con radice i/u, uso e marcatori',
  'a2',
  `<p class="lead">L'<b>indefinido</b> racconta azioni concluse nel passato: <b>Ayer comí paella</b>. Per un italiano la difficoltà è che quasi tutto ciò che in italiano è «passato prossimo» o «passato remoto» qui va all'indefinido. Pronunce con la convenzione del corso ([th] = think, [h] = jota, [dh] = d morbida).</p>
<h3>Verbi regolari</h3>
<table><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td>hablé [a-BLE]</td><td>comí [ko-MI]</td><td>viví [bi-BI]</td></tr>
<tr><td>tú</td><td>hablaste [a-BLAS-te]</td><td>comiste [ko-MIS-te]</td><td>viviste [bi-BIS-te]</td></tr>
<tr><td>él/usted</td><td>habló [a-BLO]</td><td>comió [ko-MIO]</td><td>vivió [bi-BIO]</td></tr>
<tr><td>nosotros</td><td>hablamos [a-BLA-mos]</td><td>comimos [ko-MI-mos]</td><td>vivimos [bi-BI-mos]</td></tr>
<tr><td>vosotros</td><td>hablasteis [a-BLAS-teis]</td><td>comisteis [ko-MIS-teis]</td><td>vivisteis [bi-BIS-teis]</td></tr>
<tr><td>ellos</td><td>hablaron [a-BLA-ron]</td><td>comieron [ko-MIE-ron]</td><td>vivieron [bi-BIE-ron]</td></tr>
</table>
<p><b>Attenzione alla tilde</b>: <b>hablo</b> [A-blo] (presente) ≠ <b>habló</b> [a-BLO] (parlò); <b>hablé</b> [a-BLE]. In -er/-ir le desinenze sono identiche. Nosotros degli -ar e -ir coincide col presente (hablamos, vivimos): lo distingue il contesto (<b>ayer</b>).</p>
<h3>Cambi ortografici (solo yo, o i→y)</h3>
<ul><li><b>-car</b>: c→qu: <b>busqué</b> [bus-KE], <b>toqué</b> [to-KE], <b>saqué</b>, <b>practiqué</b>.</li><li><b>-gar</b>: g→gu: <b>llegué</b> [ye-GHE], <b>pagué</b> [pa-GHE], <b>jugué</b> [hu-GHE].</li><li><b>-zar</b>: z→c: <b>empecé</b> [em-pe-THE], <b>almorcé</b>, <b>crucé</b>.</li><li><b>i→y</b> tra vocali (3ª persona): <b>leyó</b> [le-YO], <b>leyeron</b> [le-YE-ron], <b>creyó</b>, <b>oyó</b>, <b>cayó</b>, <b>construyó</b>. Le altre persone hanno tilde sulla í: <b>leí</b> [le-I], <b>leíste</b>, <b>leímos</b>.</li></ul>
<h3>Ser e ir sono uguali; dar e ver senza tilde</h3>
<table><tr><th></th><th>ser / ir</th><th>dar</th><th>ver</th></tr>
<tr><td>yo</td><td>fui [FUI]</td><td>di [DI]</td><td>vi [BI]</td></tr>
<tr><td>tú</td><td>fuiste [FUIS-te]</td><td>diste [DIS-te]</td><td>viste [BIS-te]</td></tr>
<tr><td>él</td><td>fue [FUE]</td><td>dio [DIO]</td><td>vio [BIO]</td></tr>
<tr><td>nosotros</td><td>fuimos [FUI-mos]</td><td>dimos [DI-mos]</td><td>vimos [BI-mos]</td></tr>
<tr><td>vosotros</td><td>fuisteis [FUIS-teis]</td><td>disteis</td><td>visteis</td></tr>
<tr><td>ellos</td><td>fueron [FUE-ron]</td><td>dieron [DIE-ron]</td><td>vieron [BIE-ron]</td></tr>
</table>
<p><b>Fui a Madrid</b> (andai) e <b>Fui profesor</b> (fui): il contesto decide. Le forme monosillabiche (fui, fue, di, dio, vi, vio) non hanno tilde.</p>
<h3>Radici irregolari: desinenze senza accento</h3>
<p>Questi verbi cambiano radice e usano le desinenze <b>-e, -iste, -o, -imos, -isteis, -ieron</b> (senza tilde!).</p>
<table><tr><th></th><th>hacer</th><th>tener</th><th>decir</th></tr>
<tr><td>yo</td><td>hice [I-the]</td><td>tuve [TU-be]</td><td>dije [DI-he]</td></tr>
<tr><td>tú</td><td>hiciste [i-THIS-te]</td><td>tuviste [tu-BIS-te]</td><td>dijiste [di-HIS-te]</td></tr>
<tr><td>él</td><td>hizo [I-tho]</td><td>tuvo [TU-bo]</td><td>dijo [DI-ho]</td></tr>
<tr><td>nosotros</td><td>hicimos [i-THI-mos]</td><td>tuvimos [tu-BI-mos]</td><td>dijimos [di-HI-mos]</td></tr>
<tr><td>ellos</td><td>hicieron [i-THIE-ron]</td><td>tuvieron [tu-BIE-ron]</td><td>dijeron [di-HE-ron]</td></tr>
</table>
<ul><li><b>Radice in u</b>: estar → estuv-, andar → anduv-, poder → pud- (<b>pude</b> [PU-dhe]), poner → pus- (<b>puse</b>), saber → sup- (<b>supe</b>), haber → hub- (<b>hubo</b>).</li><li><b>Radice in i</b>: querer → quis- (<b>quise</b> [KI-sse]), venir → vin- (<b>vine</b> [BI-ne]), hacer → hic- (hizo con z).</li><li><b>Radice in j</b> (terza plurale in <b>-eron</b>, non -ieron): decir → dij- (<b>dijeron</b>), traer → traj- (<b>trajeron</b>), conducir → conduj-, traducir → traduj-.</li></ul>
<h3>Verbi in -ir con e→i e o→u (solo 3ª persona)</h3>
<p><b>pedir</b>: pidió [pi-DHIO], pidieron [pi-DHIE-ron]; <b>dormir</b>: durmió [dur-MIO], durmieron; <b>sentir</b> → sintió; <b>morir</b> → murió; <b>preferir</b> → prefirió; <b>seguir</b> → siguió; <b>repetir</b> → repitió. Solo i verbi in -ir; nei verbi in -ar/-er (pensar, volver) non c'è cambio all'indefinido.</p>
<h3>Quando si usa</h3>
<ul><li><b>Azioni concluse</b> in un momento o periodo chiuso: <b>El año pasado viajé a Perú</b> [el A-gno pa-SSA-dho bia-HE a pe-RU].</li><li><b>Sequenze</b>: <b>Llegué, comí y me acosté</b>.</li><li><b>Inizio o fine</b> di un'azione: <b>La película empezó a las ocho</b>.</li></ul>
<p>Marcatori: <b>ayer</b> [a-YER], <b>anteayer</b> [an-te-a-YER], <b>anoche</b> [a-NO-ce], <b>el lunes pasado</b>, <b>la semana pasada</b>, <b>el mes pasado</b>, <b>hace dos días</b>, <b>en 2019</b>, <b>de repente</b> [de rre-PEN-te], <b>entonces</b> [en-TON-thes], <b>luego</b>.</p>
<h3>Trappole per un italiano</h3>
<ul><li>«Ieri ho mangiato» è <b>Ayer comí</b>, non «he comido» (il perfecto si usa per tempi non conclusi: vedi il modulo sul perfecto, dopo l'imperfecto).</li><li>«Sono andato» e «sono nato» non vogliono essere: <b>fui, nací</b> [na-THI]; non esiste «soy ido».</li><li>«Ho avuto» → <b>tuve</b>; «ho voluto» → <b>quise</b>.</li><li>Attenzione all'accento nel passato: <b>hablé</b> [a-BLE] (io) e <b>habló</b> [a-BLO] (lui) cadono sull'ultima sillaba.</li></ul>
<div class="say"><b>Da dire.</b> «Ayer salí del trabajo, fui al cine y vi una película. Luego cené con amigos y me acosté tarde.» [a-YER sa-LI del tra-BA-ho, FUI al THI-ne i BI U-na pe-LI-ku-la. LUE-go the-NE kon a-MI-gos i me a-KOS-te TAR-dhe]</div>`,
  [
    q(
      'q1',
      'Come dici «ieri ho mangiato pasta»?',
      ['Ayer comí pasta', 'Ayer he comido pasta', 'Ayer comía pasta', 'Ayer como pasta'],
      0,
      "Ieri è un tempo concluso, quindi indefinido: comí. Il perfecto e l'imperfecto non indicano un'azione conclusa in un momento definito.",
    ),
    q(
      'q2',
      'Come dici «io sono arrivato» (llegar)?',
      ['llegué', 'llegé', 'lleguí', 'llegó'],
      0,
      'Llegar ha la g dura (llegar); davanti alla e della desinenza -é la g diventerebbe jota, quindi per conservare il suono duro si scrive gu: llegué [ye-GHE].',
    ),
    q(
      'q3',
      'Come dici «lei ha letto» (leer)?',
      ['leyó', 'leió', 'leído', 'leí'],
      0,
      'La i tra due vocali (e, o) diventa y alla terza persona: leyó e leyeron; leí è la prima persona.',
    ),
    q(
      'q4',
      'Come dici «siamo andati a Roma»?',
      ['Fuimos a Roma', 'Somos ido a Roma', 'Íbamos a Roma', 'Fueron a Roma'],
      0,
      "Ir all'indefinido ha le stesse forme di ser: fuimos; «somos ido» è un calco dall'italiano «siamo andati».",
    ),
    q(
      'q5',
      'Come dici «io ho avuto» (tener)?',
      ['tuve', 'tené', 'tuvé', 'tengué'],
      0,
      'Tener ha radice irregolare tuv- e desinenze senza tilde: tuve, tuviste, tuvo, tuvimos, tuvieron.',
    ),
    q(
      'q6',
      'Come dici «loro dissero» (decir)?',
      ['dijeron', 'dijieron', 'dijaron', 'dicieron'],
      0,
      'Dopo la radice in j si usa -eron e non -ieron: dijeron, trajeron, tradujeron.',
    ),
    q(
      'q7',
      'Come dici «lui ha chiesto» (pedir)?',
      ['pidió', 'pedió', 'pidío', 'pidiyó'],
      0,
      'Nei verbi in -ir con e→i la terza persona cambia la vocale della radice: pidió e pidieron.',
    ),
    q(
      'q8',
      "Dove cade l'accento di «habló»?",
      [
        "sull'ultima sillaba: [a-BLO]",
        'sulla prima sillaba: [A-blo]',
        'sulla seconda: [ha-BLO] con h aspirata',
        'su una sillaba centrale: [a-BLA-o]',
      ],
      0,
      "La tilde segnala l'accento sull'ultima sillaba (aguda terminata in vocale): habló è passato, hablo è presente.",
    ),
    q(
      'q9',
      'Come si legge «busqué»?',
      ['[bus-KE]', '[bus-KUE]', '[bus-CE]', '[BUS-ke]'],
      0,
      "Qu davanti a e vale k con u muta e la tilde segnala l'accento sull'ultima sillaba: [bus-KE], mai «buskué».",
    ),
    q(
      'q10',
      'Come si legge «hizo» (lui fece)?',
      ['[I-tho]', '[HI-tho]', '[I-tso]', '[I-zo]'],
      0,
      'La h è muta e la z vale th in Spagna (s in America); la z si scrive solo qui perché la c cambia davanti a o.',
    ),
  ],
  [
    card('c1', 'Regolare -ar', 'hablé [a-BLE], hablaste, habló [a-BLO], hablamos, hablasteis, hablaron [a-BLA-ron].'),
    card(
      'c2',
      'Regolare -er/-ir',
      'comí [ko-MI], comiste, comió, comimos, comisteis, comieron [ko-MIE-ron]; stesse desinenze per -ir.',
    ),
    card('c3', 'ser / ir', 'fui [FUI], fuiste, fue [FUE], fuimos, fuisteis, fueron: una sola forma per due verbi.'),
    card('c4', 'dar / ver', 'di, diste, dio, dimos, disteis, dieron; vi, viste, vio... senza tilde.'),
    card('c5', 'Cambi di spelling in yo', 'busqué (c→qu), llegué (g→gu), empecé (z→c). Servono a conservare il suono.'),
    card('c6', 'i→y', 'leyó, leyeron, creyó, oyó, cayó, construyó: tra vocali. Altre persone: leí, leíste.'),
    card(
      'c7',
      'Radici in u',
      'estuve, anduve, pude, puse, supe, hubo; desinenze -e, -iste, -o, -imos, -isteis, -ieron.',
    ),
    card('c8', 'Radici in j', 'dije, traje, conduje, traduje: terza plurale -eron (dijeron).'),
    card('c9', 'pedir, dormir (3ª)', 'pidió, pidieron; durmió, durmieron. Solo verbi in -ir.'),
    card('c10', 'Marcatori', 'ayer, anoche, anteayer, el año pasado, hace dos días, en 2019, de repente.'),
    card('c11', 'habló / hablo', "[a-BLO] passato vs [A-blo] presente; la tilde sposta l'accento."),
    card('c12', 'busqué, pagué', '[bus-KE], [pa-GHE]: qu e gu davanti a e = k e g dure; la u non si pronuncia.'),
  ],
  [
    prac(
      'p1',
      "Coniuga all'indefinido tutte le persone di «hacer» e «ir».",
      'hacer: hice, hiciste, hizo, hicimos, hicisteis, hicieron. ir: fui, fuiste, fue, fuimos, fuisteis, fueron.',
    ),
    prac(
      'p2',
      'Traduci: «Ieri sono uscito, ho incontrato Luca e abbiamo parlato due ore. Poi sono tornato a casa.»',
      'Ayer salí, encontré a Luca y hablamos dos horas. Luego volví a casa. (salí, encontré con a personale, hablamos, volví.)',
    ),
    prac(
      'p3',
      'Correggi: «Ayer he comprado pan», «Yo fuí a Roma», «Ellos dijieron la verdad», «Él pedió un café».',
      'Ayer compré pan. / Yo fui a Roma (senza tilde). / Ellos dijeron la verdad. / Él pidió un café.',
    ),
    prac(
      'p4',
      "Metti all'indefinido: yo (buscar) las llaves, tú (llegar) tarde, ella (leer) el libro.",
      'busqué las llaves; llegaste tarde; ella leyó el libro. (qu davanti a e; llegaste regolare; leyó con y.)',
    ),
    prac(
      'p5',
      'Racconta in 5 frasi cosa hai fatto lo scorso fine settimana.',
      'El sábado me levanté tarde, fui al mercado, compré fruta y comí con mis padres. Por la noche vi una película y me acosté a las doce. (indefinido per azioni concluse con marcatori di tempo.)',
    ),
  ],
)

export const esImperfecto = mod(
  'es-imperfecto',
  "Imperfecto e contrasto con l'indefinido",
  'Imperfecto (3 irregolari), uso, contrasto indefinido/imperfecto, marcatori',
  'a2',
  `<p class="lead">L'<b>imperfecto</b> dà lo sfondo del passato: abitudini, descrizioni, azioni in corso. Qui lo spagnolo è molto vicino all'italiano; la difficoltà è scegliere tra imperfecto e indefinido. Pronunce con la convenzione del corso.</p>
<h3>Forme</h3>
<table><tr><th></th><th>hablar</th><th>comer / vivir</th></tr>
<tr><td>yo</td><td>hablaba [a-BLA-ba]</td><td>comía [ko-MI-a]</td></tr>
<tr><td>tú</td><td>hablabas [a-BLA-bas]</td><td>comías [ko-MI-as]</td></tr>
<tr><td>él/usted</td><td>hablaba [a-BLA-ba]</td><td>comía [ko-MI-a]</td></tr>
<tr><td>nosotros</td><td>hablábamos [a-BLA-ba-mos]</td><td>comíamos [ko-MI-a-mos]</td></tr>
<tr><td>vosotros</td><td>hablabais [a-BLA-bais]</td><td>comíais [ko-MI-ais]</td></tr>
<tr><td>ellos</td><td>hablaban [a-BLA-ban]</td><td>comían [ko-MI-an]</td></tr>
</table>
<p>In -ar le desinenze sono <b>-aba, -abas, -aba, -ábamos, -abais, -aban</b>; in -er/-ir <b>-ía, -ías, -ía, -íamos, -íais, -ían</b>, sempre con la <b>í</b> accentata (iato). Sono regolari tutti i verbi tranne ser, ir e ver, anche quelli con dittongazione (<b>querer → quería</b> [ke-RI-a], <b>poder → podía</b>, <b>dormir → dormía</b>).</p>
<h3>I tre irregolari</h3>
<table><tr><th></th><th>ser</th><th>ir</th><th>ver</th></tr>
<tr><td>yo</td><td>era [E-ra]</td><td>iba [I-ba]</td><td>veía [be-I-a]</td></tr>
<tr><td>tú</td><td>eras [E-ras]</td><td>ibas [I-bas]</td><td>veías</td></tr>
<tr><td>él</td><td>era</td><td>iba</td><td>veía</td></tr>
<tr><td>nosotros</td><td>éramos [E-ra-mos]</td><td>íbamos [I-ba-mos]</td><td>veíamos</td></tr>
<tr><td>vosotros</td><td>erais [E-rais]</td><td>ibais [I-bais]</td><td>veíais</td></tr>
<tr><td>ellos</td><td>eran [E-ran]</td><td>iban [I-ban]</td><td>veían</td></tr>
</table>
<h3>Quando si usa</h3>
<ul><li><b>Abitudini nel passato</b>: <b>De niño jugaba al fútbol todos los días</b> [de NI-gno hu-GA-ba al fut-BOL TO-dhos los DI-as] (da bambino giocavo...).</li><li><b>Descrizioni</b> di persone e cose: <b>La casa era grande y tenía un jardín</b>.</li><li><b>Ora ed età nel passato</b>: <b>Eran las ocho</b> [E-ran las O-cio], <b>Tenía diez años</b> [te-NI-a DIETH A-gnos].</li><li><b>Azione in corso</b> (sfondo) interrotta da un'altra (indefinido): <b>Dormía cuando sonó el teléfono</b> [dor-MI-a KUAN-do so-NO el te-LE-fo-no]. Forma progressiva: <b>Estaba durmiendo</b>.</li><li><b>Intenzioni, cortesia</b>: <b>Quería pedirle un favor</b> [ke-RI-a pe-DHIR-le un fa-BOR], <b>Iba a llamarte</b>.</li></ul>
<p>Marcatori: <b>siempre</b>, <b>todos los días</b>, <b>a menudo</b>, <b>normalmente</b>, <b>cada verano</b>, <b>de niño / de pequeño</b> [de pe-KE-gno], <b>antes</b>, <b>mientras</b> [MIEN-tras], <b>en aquella época</b>, <b>entonces</b>.</p>
<h3>Indefinido o imperfecto?</h3>
<table><tr><th>Imperfecto</th><th>Indefinido</th></tr>
<tr><td>sfondo, durata non delimitata</td><td>evento concluso, delimitato</td></tr>
<tr><td>abitudine ripetuta (<i>todos los días</i>)</td><td>un'occasione precisa (<i>ayer, una vez</i>)</td></tr>
<tr><td>Hacía calor</td><td>Hizo calor ese día</td></tr>
<tr><td>Vivía en Madrid</td><td>Viví en Madrid tres años</td></tr>
</table>
<p>Regola pratica: l'<b>indefinido</b> dà la «storia» (cosa successe), l'<b>imperfecto</b> dà lo «scenario» (com'erano le cose). <b>Eran las nueve y llovía cuando llegué a casa</b> [E-ran las NUE-be i yo-BI-a KUAN-do ye-GHE a KA-ssa]: tre informazioni di sfondo, un evento.</p>
<h3>Verbi che cambiano significato</h3>
<table><tr><th>Verbo</th><th>Imperfecto</th><th>Indefinido</th></tr>
<tr><td>saber</td><td>sabía (sapevo)</td><td>supe (ho scoperto)</td></tr>
<tr><td>conocer</td><td>conocía (conoscevo)</td><td>conocí (ho incontrato)</td></tr>
<tr><td>querer</td><td>quería (volevo)</td><td>quise (ho voluto, ho tentato); no quise = mi sono rifiutato</td></tr>
<tr><td>poder</td><td>podía (potevo)</td><td>pude (sono riuscito)</td></tr>
<tr><td>tener</td><td>tenía (avevo)</td><td>tuve (ho avuto, ho ricevuto)</td></tr>
</table>
<h3>Trappole per un italiano</h3>
<ul><li>L'italiano «passato prossimo» copre due tempi: «ho mangiato» = <i>comí</i> (ieri) o <i>he comido</i> (oggi). L'imperfetto corrisponde quasi 1:1 (<i>mangiavo</i> = <i>comía</i>).</li><li>Con <b>mientras</b> due azioni parallele sono entrambe all'imperfecto: <b>Mientras yo cocinaba, tú leías</b>.</li><li>Non confondere <b>hablaba</b> [a-BLA-ba] con <b>habló</b> [a-BLO]; né <b>comía</b> con <b>como</b> [KO-mo].</li></ul>
<div class="say"><b>Da dire.</b> «Cuando era niño, vivía en un pueblo pequeño. Todos los veranos íbamos a la playa y mi abuela cocinaba para todos.» [KUAN-do E-ra NI-gno, bi-BI-a en un PUE-blo pe-KE-gno. TO-dhos los be-RA-nos I-ba-mos a la PLA-ya i mi a-BUE-la ko-thi-NA-ba PA-ra TO-dhos]</div>`,
  [
    q(
      'q1',
      'Come dici «da bambino giocavo a calcio»?',
      ['De niño jugaba al fútbol', 'De niño jugué al fútbol', 'De niño he jugado al fútbol', 'De niño jugo al fútbol'],
      0,
      "È un'abitudine ripetuta nel passato: imperfecto. L'indefinido indicherebbe una partita sola e conclusa.",
    ),
    q(
      'q2',
      "Qual è la forma di «ir» all'imperfecto per «yo»?",
      ['iba', 'ía', 'fui', 'voy'],
      0,
      "Ir è uno dei tre irregolari dell'imperfecto: iba, ibas, iba, íbamos, ibais, iban.",
    ),
    q(
      'q3',
      'In «Leía cuando llegó Ana», quale azione è lo sfondo?',
      ['leía', 'llegó', 'entrambe', 'nessuna'],
      0,
      "L'azione in corso è espressa con l'imperfecto (leía) e l'evento che la interrompe con l'indefinido (llegó).",
    ),
    q(
      'q4',
      'Come dici «erano le otto»?',
      ['Eran las ocho', 'Fueron las ocho', 'Es la ocho', 'Eran la ocho'],
      0,
      "L'ora nel passato è una descrizione: imperfecto plurale di ser con las ocho.",
    ),
    q(
      'q5',
      'Come dici «avevo dieci anni»?',
      ['Tenía diez años', 'Tuve diez años', 'Era diez años', 'Hube diez años'],
      0,
      "L'età si descrive con tener all'imperfecto: tenía; l'indefinido tuve indicherebbe «ho avuto» un evento.",
    ),
    q(
      'q6',
      'Come dici «ho conosciuto Ana nel 2019» (primo incontro)?',
      ['Conocí a Ana en 2019', 'Conocía a Ana en 2019', 'Conozco a Ana en 2019', 'He conocido Ana en 2019'],
      0,
      "Con conocer, l'indefinido indica l'incontro iniziale (conocí); l'imperfecto indicherebbe che già la conoscevi. Serve anche a personale.",
    ),
    q(
      'q7',
      'Come dici «vedevamo» (ver, nosotros)?',
      ['veíamos', 'veiamos', 'vemos', 'vimos'],
      0,
      "Ver è irregolare all'imperfecto perché conserva la e della radice e mette la tilde sulla í: veía, veíamos.",
    ),
    q(
      'q8',
      "Dove cade l'accento di «comíamos»?",
      ['sulla í: [ko-MI-a-mos]', 'sulla a: [ko-mi-A-mos]', 'sulla o: [KO-mi-a-mos]', 'sulla seconda o: [ko-mi-a-MOS]'],
      0,
      "Comíamos è una esdrújula: l'accento cade sulla terzultima sillaba (mí) e per questo serve la tilde, che separa anche la í dalla a seguente.",
    ),
    q(
      'q9',
      'Come si legge «éramos»?',
      ['[E-ra-mos]', '[e-RA-mos]', '[E-ra-MOS]', '[e-ra-MOS]'],
      0,
      "La tilde sulla é indica l'accento sulla prima sillaba: [E-ra-mos], come la í di comíamos segna l'accento su comí-.",
    ),
    q(
      'q10',
      'Come chiedi con cortesia «volevo chiederle un favore»?',
      ['Quería pedirle un favor', 'Quise pedirle un favor', 'Quiero pedirle un favor', 'Querré pedirle un favor'],
      0,
      "L'imperfecto di cortesia attenua la richiesta; l'indefinido quise significherebbe che ci hai provato un'altra volta.",
    ),
  ],
  [
    card(
      'c1',
      'Imperfecto -ar',
      '-aba, -abas, -aba, -ábamos, -abais, -aban: hablaba [a-BLA-ba], hablábamos [a-BLA-ba-mos].',
    ),
    card('c2', 'Imperfecto -er/-ir', '-ía, -ías, -ía, -íamos, -íais, -ían: comía [ko-MI-a], vivíamos [bi-BI-a-mos].'),
    card('c3', 'Irregolari', 'ser: era, eras, era, éramos, erais, eran. ir: iba... íbamos. ver: veía... veíamos.'),
    card('c4', "Usi dell'imperfecto", 'abitudini, descrizioni, ora ed età, azioni in corso, intenzioni e cortesia.'),
    card('c5', 'Marcatori', 'siempre, todos los días, a menudo, de niño, antes, mientras, normalmente.'),
    card('c6', 'Sfondo vs evento', 'Imperfecto = scenario; indefinido = storia. Llovía cuando llegué.'),
    card('c7', 'saber / conocer', 'sabía = sapevo; supe = ho scoperto. conocía = conoscevo; conocí = ho incontrato.'),
    card(
      'c8',
      'querer / poder',
      'quería = volevo; quise = ho tentato; no quise = ho rifiutato. podía = potevo; pude = sono riuscito.',
    ),
    card('c9', 'Eran las ocho', "L'ora nel passato va all'imperfecto: Eran las ocho. Es la una → Era la una."),
    card(
      'c10',
      'Estaba + gerundio',
      'Estaba durmiendo cuando llamaste: progressivo passato, equivale a «stavo dormendo».',
    ),
    card(
      'c11',
      'comíamos [ko-MI-a-mos]',
      'La í accentata separa la vocale (iato). Così comía, tenía [te-NI-a], vivía [bi-BI-a].',
    ),
    card('c12', 'hablaba / habló', '[a-BLA-ba] imperfecto; [a-BLO] indefinido: diverso accento e diverso uso.'),
  ],
  [
    prac(
      'p1',
      "Coniuga all'imperfecto: yo (vivir), tú (ser), nosotros (ir), ellos (ver).",
      'yo vivía; tú eras; nosotros íbamos; ellos veían.',
    ),
    prac(
      'p2',
      'Completa scegliendo imperfecto o indefinido: «Mientras yo (cocinar), tú (llegar) a casa.»',
      'Mientras yo cocinaba, tú llegaste a casa. (cocinaba = sfondo, llegaste = evento.)',
    ),
    prac(
      'p3',
      'Traduci: «Quando abitavo a Madrid, uscivo ogni sabato. Un giorno ho conosciuto Ana.»',
      'Cuando vivía en Madrid, salía todos los sábados. Un día conocí a Ana.',
    ),
    prac(
      'p4',
      'Spiega la differenza: «No quise ir» e «No quería ir».',
      "No quise ir: mi sono rifiutato (azione/decisione puntuale). No quería ir: non volevo andare (stato d'animo, senza dire se sono andato).",
    ),
    prac(
      'p5',
      'Descrivi la tua infanzia in 5 frasi con almeno tre marcatori diversi.',
      'De niño vivía en un pueblo. Siempre jugaba en la calle. Todos los veranos íbamos a la playa. Mientras mis padres trabajaban, mi abuela me cuidaba. Antes no había móviles. (imperfecto per abitudini e sfondo.)',
    ),
  ],
)

export const esPerfecto = mod(
  'es-perfecto',
  'Pretérito perfecto',
  'Haber + participio, participi irregolari, marcatori, differenze Spagna/America, diverso dal passato prossimo',
  'a2',
  `<p class="lead">Il <b>pretérito perfecto</b> (<b>he comido</b>) assomiglia al passato prossimo, ma non lo copre: in Spagna si usa solo per un passato <b>collegato al presente</b>. Per il resto serve l'indefinido. Pronunce con la convenzione del corso.</p>
<h3>Formazione: haber + participio</h3>
<table><tr><th></th><th>haber</th><th>+ hablado</th></tr>
<tr><td>yo</td><td>he [E]</td><td>he hablado [e a-BLA-dho]</td></tr>
<tr><td>tú</td><td>has [AS]</td><td>has comido [as ko-MI-dho]</td></tr>
<tr><td>él/usted</td><td>ha [A]</td><td>ha vivido [a bi-BI-dho]</td></tr>
<tr><td>nosotros</td><td>hemos [E-mos]</td><td>hemos hablado</td></tr>
<tr><td>vosotros</td><td>habéis [a-BEIS]</td><td>habéis comido</td></tr>
<tr><td>ellos</td><td>han [AN]</td><td>han vivido</td></tr>
</table>
<p>Participio regolare: <b>-ar → -ado</b> (hablado), <b>-er/-ir → -ido</b> (comido, vivido). Dopo una vocale la i ha tilde: <b>leído</b> [le-I-dho], <b>creído</b>, <b>oído</b>, <b>traído</b> [tra-I-dho], <b>caído</b>. Il participio nel perfecto è <b>invariabile</b>: non concorda con l'oggetto (<b>Las he visto</b>, non «las he vistas»). E <b>haber e participio non si separano</b>: <b>Ya he comido</b>, mai «he ya comido».</p>
<h3>Participi irregolari</h3>
<table><tr><th>Infinito</th><th>Participio</th><th>Pronuncia</th></tr>
<tr><td>abrir</td><td>abierto</td><td>[a-BIER-to]</td></tr>
<tr><td>cubrir</td><td>cubierto</td><td>[ku-BIER-to]</td></tr>
<tr><td>decir</td><td>dicho</td><td>[DI-cio]</td></tr>
<tr><td>escribir</td><td>escrito</td><td>[es-KRI-to]</td></tr>
<tr><td>hacer</td><td>hecho</td><td>[E-cio]</td></tr>
<tr><td>morir</td><td>muerto</td><td>[MUER-to]</td></tr>
<tr><td>poner</td><td>puesto</td><td>[PUES-to]</td></tr>
<tr><td>romper</td><td>roto</td><td>[RRO-to]</td></tr>
<tr><td>ver</td><td>visto</td><td>[BIS-to]</td></tr>
<tr><td>volver</td><td>vuelto</td><td>[BUEL-to]</td></tr>
<tr><td>resolver</td><td>resuelto</td><td>[rre-SSUEL-to]</td></tr>
</table>
<p>I composti seguono la base: <b>describir → descrito</b>, <b>devolver → devuelto</b>, <b>deshacer → deshecho</b>, <b>componer → compuesto</b>, <b>satisfacer → satisfecho</b>.</p>
<h3>Perfecto o indefinido? (Spagna)</h3>
<ul><li><b>Perfecto</b>: periodo di tempo <b>non concluso</b> (oggi, questa settimana, quest'anno) o rilevanza per il presente. Marcatori: <b>hoy</b> [OI], <b>esta mañana</b>, <b>esta semana</b>, <b>este año</b>, <b>ya</b> [YA], <b>todavía no</b> [to-dha-BI-a NO], <b>nunca</b> [NUN-ka], <b>alguna vez</b> [al-GU-na BETH], <b>últimamente</b> [UL-ti-ma-MEN-te], <b>hasta ahora</b>.</li><li><b>Indefinido</b>: tempo concluso. Marcatori: <b>ayer, anoche, el año pasado, hace dos días, en 2019</b>.</li></ul>
<p>Confronto: <b>Esta mañana he desayunado en casa</b> [ES-ta ma-GNA-na e de-ssa-yu-NA-dho] (la mattina non è finita) ma <b>Ayer desayuné en casa</b>. <b>¿Has estado en Madrid?</b> [as es-TA-dho en ma-DRIDH] (esperienza di vita) → <b>Sí, estuve allí el año pasado</b> (tempo preciso, concluso). <b>Todavía no he terminado</b> (non ho ancora finito).</p>
<h3>Spagna e America</h3>
<p>In Spagna la distinzione è netta. In gran parte dell'America (Messico, Argentina, Caraibi...) l'indefinido ha preso il posto del perfecto: <b>Hoy desayuné</b>, <b>¿Ya comiste?</b>, e il perfecto resta per le esperienze (<b>¿Has estado en Cuzco?</b>) e per la continuità. In altre zone (Perù, Bolivia, regioni andine) il perfecto è più frequente. Come studente puoi seguire la norma spagnola e capire entrambe.</p>
<h3>Rispetto al passato prossimo italiano</h3>
<ul><li>L'italiano «ho mangiato» → <i>he comido</i> oppure <i>comí</i>, secondo il tempo: oggi / ieri.</li><li>In italiano con i verbi intransitivi si usa <b>essere</b> («sono andato», «mi sono alzato»): in spagnolo <b>sempre haber</b>: <b>he ido</b> [e I-dho], <b>me he levantado</b>, <b>he nacido</b> (ma di solito <i>nací</i>).</li><li>Il participio non concorda mai: «le ho viste» → <b>las he visto</b>; «sono andate» → <b>han ido</b>.</li><li>Il pronome precede <b>haber</b>, non il participio: <b>Me lo he comido</b>, <b>Lo he hecho</b>.</li><li>L'avverbio non si inserisce tra i due: <b>Siempre he vivido aquí</b>.</li></ul>
<div class="say"><b>Da dire.</b> «Esta semana he trabajado mucho, pero todavía no he terminado el proyecto. ¿Y tú, has visto la nueva película?» [ES-ta se-MA-na e tra-ba-HA-dho MU-cio, PE-ro to-dha-bi-a NO e ter-mi-NA-dho el pro-YEK-to. i TU, as BIS-to la NUE-ba pe-LI-ku-la]</div>`,
  [
    q(
      'q1',
      'Come dici «questa mattina ho fatto colazione» (Spagna)?',
      ['Esta mañana he desayunado', 'Esta mañana desayuné', 'Esta mañana desayunaba', 'Esta mañana desayunaré'],
      0,
      "La mattina è ancora in corso (periodo non concluso): in Spagna serve il perfecto. L'indefinido sarebbe ayer o un tempo chiuso.",
    ),
    q(
      'q2',
      'Come dici «ieri ho mangiato»?',
      ['Ayer comí', 'Ayer he comido', 'Ayer comía', 'Ayer comeré'],
      0,
      'Ayer indica un tempo concluso, quindi indefinido; il perfecto si abbina a oggi, questa settimana, già, mai.',
    ),
    q(
      'q3',
      'Qual è il participio di «escribir»?',
      ['escrito', 'escribido', 'escrebido', 'escribado'],
      0,
      'Escribir ha il participio irregolare escrito, da imparare insieme a abierto, dicho, hecho, puesto, visto.',
    ),
    q(
      'q4',
      'Come dici «ho già visto il film»?',
      ['Ya he visto la película', 'He ya visto la película', 'Ya he vido la película', 'Ya he veído la película'],
      0,
      "L'avverbio va prima di haber e il participio di ver è visto, non vido: ya non si inserisce tra ausiliare e participio.",
    ),
    q(
      'q5',
      'Come dici «le ho viste» (le ragazze)?',
      ['Las he visto', 'Las he vistas', 'Las ha visto', 'Las he vido'],
      0,
      'Il participio nel perfecto è invariabile e haber resta alla prima persona: las he visto.',
    ),
    q(
      'q6',
      'Come dici «sono andato a Roma molte volte»?',
      [
        'He ido a Roma muchas veces',
        'Soy ido a Roma muchas veces',
        'He sido a Roma muchas veces',
        'Estoy ido a Roma muchas veces',
      ],
      0,
      "In spagnolo l'ausiliare è sempre haber, mai essere: he ido; he sido sarebbe «sono stato» di ser.",
    ),
    q(
      'q7',
      "In gran parte dell'America come si dice di solito «oggi ho mangiato»?",
      ['Hoy comí', 'Hoy he comido', 'Hoy comía', 'Hoy comeré'],
      0,
      "In Messico, Argentina e Caraibi l'indefinido ha sostituito molto spesso il perfecto anche con hoy; in Spagna è più netto.",
    ),
    q(
      'q8',
      'Come si legge «hecho»?',
      ['[E-cio]', '[HE-cio]', '[E-ko]', '[E-sio]'],
      0,
      'La h iniziale è muta e ch si legge come la c di «cena» italiana: [E-cio].',
    ),
    q(
      'q9',
      'Come si legge «dicho»?',
      ['[DI-cio]', '[DI-ko]', '[DI-sio]', '[DI-tho]'],
      0,
      "Ch è sempre il suono di «ci» italiano; la k non è usata per ch. L'accento è sulla prima sillaba.",
    ),
    q(
      'q10',
      'Come si legge «todavía»?',
      ['[to-dha-BI-a]', '[to-DA-bia]', '[TO-da-vi-a]', '[to-dha-bi-A]'],
      0,
      'La d tra vocali è morbida (dh), la v si legge b e la í accentata forma un iato con la a finale.',
    ),
  ],
  [
    card('c1', 'haber (presente)', 'he [E], has, ha [A], hemos [E-mos], habéis [a-BEIS], han [AN] + participio.'),
    card(
      'c2',
      'Participi regolari',
      '-ar → -ado (hablado), -er/-ir → -ido (comido, vivido). Dopo vocale: leído, oído, traído.',
    ),
    card('c3', 'Participi irregolari I', 'abierto, cubierto, dicho [DI-cio], escrito, hecho [E-cio].'),
    card('c4', 'Participi irregolari II', 'muerto, puesto, roto, visto [BIS-to], vuelto, resuelto.'),
    card(
      'c5',
      'Marcatori del perfecto',
      'hoy, esta mañana/semana/año, ya, todavía no, nunca, alguna vez, últimamente, hasta ahora.',
    ),
    card('c6', "Marcatori dell'indefinido", 'ayer, anoche, el año pasado, hace dos días, en 2019, de repente.'),
    card(
      'c7',
      'Participio invariabile',
      'Las he visto, mai «las he vistas». Haber e participio non si separano: Ya he comido.',
    ),
    card('c8', 'Sempre haber', 'he ido, me he levantado, ha nacido: nessun «essere» come ausiliare.'),
    card(
      'c9',
      'America',
      'Messico, Argentina e Caraibi: spesso indefinido anche con hoy (Hoy comí). Perfecto per esperienze.',
    ),
    card(
      'c10',
      'Spagna: hoy, esta semana',
      'Esta mañana he desayunado: periodo non concluso. Ayer desayuné: concluso.',
    ),
    card('c11', 'hecho, dicho, mucho', '[E-cio], [DI-cio], [MU-cio]: ch = ci italiana; la h è muta.'),
    card('c12', 'todavía [to-dha-BI-a]', 'Ancora. Todavía no he terminado = non ho ancora finito.'),
  ],
  [
    prac(
      'p1',
      'Scrivi i participi: decir, hacer, ver, volver, poner, abrir, escribir, romper.',
      'dicho, hecho, visto, vuelto, puesto, abierto, escrito, roto.',
    ),
    prac(
      'p2',
      'Traduci (Spagna): «Oggi ho lavorato molto. Ieri sono uscito con Luca. Non ho ancora mangiato.»',
      'Hoy he trabajado mucho. Ayer salí con Luca. Todavía no he comido. (hoy → perfecto; ayer → indefinido.)',
    ),
    prac(
      'p3',
      'Correggi: «He ya hecho los deberes», «Las he vistas», «Soy ido al cine», «Esta mañana desayuné» (in Spagna con la mattina in corso).',
      'Ya he hecho los deberes. / Las he visto. / He ido al cine. / Esta mañana he desayunado.',
    ),
    prac(
      'p4',
      'Fai 4 domande a un amico sulle sue esperienze con «¿Has...?» (viajar, probar, ver, leer).',
      '¿Has viajado a Sudamérica? ¿Has probado la paella? ¿Has visto esa serie? ¿Has leído «Don Quijote»? (participio regolare o irregolare: visto.)',
    ),
    prac(
      'p5',
      'Spiega a un italiano la differenza tra «he estado en Madrid» e «estuve en Madrid».',
      'He estado en Madrid: esperienza nella vita fino ad ora, senza momento preciso. Estuve en Madrid (el año pasado): azione conclusa in un tempo definito. Entrambi sono «sono stato» in italiano.',
    ),
  ],
)

export const esFuturo = mod(
  'es-futuro',
  'Futuro, condizionale e perifrasi',
  'Futuro semplice (irregolari), condizionale, ir a + infinito, probabilità, cortesia, acabar de, estar a punto de',
  'a2',
  `<p class="lead">Lo spagnolo parlato preferisce <b>ir a + infinito</b> per il futuro; il futuro semplice serve per previsioni, promesse e probabilità. Il condizionale è quasi identico all'italiano. Pronunce con la convenzione del corso.</p>
<h3>Futuro semplice: infinito + desinenze</h3>
<table><tr><th></th><th>hablar</th><th>comer</th></tr>
<tr><td>yo</td><td>hablaré [a-bla-RE]</td><td>comeré [ko-me-RE]</td></tr>
<tr><td>tú</td><td>hablarás [a-bla-RAS]</td><td>comerás [ko-me-RAS]</td></tr>
<tr><td>él/usted</td><td>hablará [a-bla-RA]</td><td>comerá [ko-me-RA]</td></tr>
<tr><td>nosotros</td><td>hablaremos [a-bla-RE-mos]</td><td>comeremos</td></tr>
<tr><td>vosotros</td><td>hablaréis [a-bla-REIS]</td><td>comeréis</td></tr>
<tr><td>ellos</td><td>hablarán [a-bla-RAN]</td><td>comerán</td></tr>
</table>
<p>Le desinenze (<b>-é, -ás, -á, -emos, -éis, -án</b>) sono uguali per -ar, -er, -ir, e le tilde sono sulle forme accentate sull'ultima sillaba. <b>Irregolari</b>: la radice cambia, le desinenze restano.</p>
<table><tr><th>Infinito</th><th>Radice</th><th>yo</th></tr>
<tr><td>tener</td><td>tendr-</td><td>tendré [ten-DRE]</td></tr>
<tr><td>venir</td><td>vendr-</td><td>vendré [ben-DRE]</td></tr>
<tr><td>poner</td><td>pondr-</td><td>pondré [pon-DRE]</td></tr>
<tr><td>salir</td><td>saldr-</td><td>saldré [sal-DRE]</td></tr>
<tr><td>poder</td><td>podr-</td><td>podré [po-DRE]</td></tr>
<tr><td>saber</td><td>sabr-</td><td>sabré [sa-BRE]</td></tr>
<tr><td>querer</td><td>querr-</td><td>querré [ke-RRE]</td></tr>
<tr><td>hacer</td><td>har-</td><td>haré [a-RE]</td></tr>
<tr><td>decir</td><td>dir-</td><td>diré [di-RE]</td></tr>
<tr><td>haber</td><td>habr-</td><td>habré [a-BRE]</td></tr>
</table>
<h3>Condizionale semplice</h3>
<p>Stesse radici del futuro + <b>-ía, -ías, -ía, -íamos, -íais, -ían</b>: <b>hablaría</b> [a-bla-RI-a], <b>comerías</b> [ko-me-RI-as], <b>tendría</b> [ten-DRI-a], <b>haría</b> [a-RI-a], <b>podríamos</b> [po-DRI-a-mos], <b>diría</b> [di-RI-a], <b>sabrían</b> [sa-BRI-an]. La í è sempre accentata.</p>
<ul><li><b>Cortesia</b>: <b>¿Podría ayudarme?</b> [po-DRI-a a-yu-DHAR-me], <b>Me gustaría un café</b> [me gus-ta-RI-a un ka-FE], <b>Querría pedir...</b>.</li><li><b>Consiglio</b>: <b>Deberías descansar</b> [de-be-RI-as des-kan-SSAR], <b>Yo que tú, iría al médico</b> [yo ke TU, i-RI-a al ME-dhi-ko].</li><li><b>Ipotesi</b>: <b>Viajaría más si tuviera dinero</b> (con l'imperfecto del congiuntivo: B1).</li><li><b>Futuro nel passato</b>: <b>Dijo que vendría</b>.</li></ul>
<h3>Ir a + infinito</h3>
<p><b>Voy a comer</b> [BOI a ko-MER], <b>Vamos a viajar en agosto</b>, <b>Va a llover</b> [BA a yo-BER]: piani e intenzioni, o previsione con prove visibili. Nel parlato è il futuro più frequente. Con ir a l'accento sta in <b>voy, vas, va</b>. Il presente vale anche per programmi fissi: <b>Mañana viajo a Madrid</b>.</p>
<h3>Quando usare il futuro semplice</h3>
<ul><li><b>Previsioni e promesse</b>: <b>Mañana hará calor</b>, <b>Te llamaré</b> [te ya-ma-RE].</li><li><b>Probabilità nel presente</b>: <b>¿Qué hora será?</b> [ke O-ra se-RA] (che ora sarà?), <b>Estará en casa</b> (sarà a casa, probabilmente), <b>Tendrá unos treinta años</b>.</li><li><b>Probabilità nel passato</b>: condizionale: <b>Tendría unos treinta años</b>.</li><li>Dopo <b>si</b> e <b>cuando</b> il futuro non c'è: <b>Si tengo tiempo, iré</b> (italiano: «se avrò tempo»), <b>Cuando llegues, llámame</b> (congiuntivo, B1).</li></ul>
<h3>Perifrasi di tempo</h3>
<ul><li><b>Acabar de + infinito</b>: azione appena compiuta: <b>Acabo de llegar</b> [a-KA-bo de ye-GAR] (sono appena arrivato). Passato: <b>Acababa de comer</b>. Si usa il presente (non «acabé»).</li><li><b>Estar a punto de + infinito</b>: essere sul punto di: <b>Estoy a punto de salir</b> [es-TOI a PUN-to de sa-LIR] (sto per uscire).</li><li><b>Volver a + infinito</b>: rifare: <b>Volvió a llamar</b> (ha richiamato).</li><li><b>Estar + gerundio</b>: <b>Estoy saliendo</b> (sto uscendo), diverso da «sto per uscire».</li></ul>
<div class="say"><b>Da dire.</b> «Mañana voy a visitar el museo y el sábado saldré con mis amigos. Me gustaría vivir en Madrid algún día.» [ma-GNA-na BOI a bi-ssi-TAR el mu-SSE-o i el SA-ba-dho sal-DRE kon mis a-MI-gos. me gus-ta-RI-a bi-BIR en ma-DRIDH al-GUN DI-a]</div>`,
  [
    q(
      'q1',
      'Come dici «domani parlerò con lui»?',
      ['Mañana hablaré con él', 'Mañana hablo con él', 'Mañana hablara con él', 'Mañana hablé con él'],
      0,
      "Il futuro semplice aggiunge -é all'infinito: hablaré, con tilde sull'ultima sillaba; hablé sarebbe indefinido.",
    ),
    q(
      'q2',
      'Qual è il futuro di «hacer» alla prima persona?',
      ['haré', 'haceré', 'hagaré', 'hacré'],
      0,
      'Hacer ha la radice irregolare har-; il futuro è haré con tilde; le altre forme sono errori per regolarizzazione.',
    ),
    q(
      'q3',
      'Come dici «mi piacerebbe un caffè»?',
      ['Me gustaría un café', 'Me gustará un café', 'Me gusta un café', 'Me gustó un café'],
      0,
      'Il condizionale gustaría esprime desiderio cortese; gustará sarebbe futuro, gusta presente di un fatto.',
    ),
    q(
      'q4',
      'Cosa significa «Estará en casa»?',
      ['Probabilmente è a casa', 'Sarà a casa domani', 'Era a casa', 'Sta per andare a casa'],
      0,
      "Il futuro semplice esprime una supposizione sul presente, come l'italiano «sarà a casa»: non annuncia per forza un'azione che accadrà dopo.",
    ),
    q(
      'q5',
      'Come dici «sto per uscire»?',
      ['Estoy a punto de salir', 'Estoy saliendo', 'Acabo de salir', 'Voy salir'],
      0,
      "Estar a punto de indica l'imminenza; estar + gerundio è «sto uscendo» ora; acabar de è «sono appena uscito».",
    ),
    q(
      'q6',
      'Come dici «sono appena arrivato»?',
      ['Acabo de llegar', 'Acabé de llegar', 'Estoy llegado', 'Acabo llegar'],
      0,
      "Acabar de si coniuga al presente quando l'azione è appena compiuta: acabo de llegar, non acabé.",
    ),
    q(
      'q7',
      'Come dici «se avrò tempo, verrò»?',
      ['Si tengo tiempo, vendré', 'Si tendré tiempo, vendré', 'Si tuviera tiempo, vendré', 'Si tenga tiempo, vendré'],
      0,
      'Dopo si non si usa il futuro: il presente è la forma normale, anche quando in italiano diciamo «se avrò».',
    ),
    q(
      'q8',
      "Dove cade l'accento di «tendré»?",
      ["sull'ultima: [ten-DRE]", 'sulla prima: [TEN-dre]', 'su ten: [TEN-DRE]', 'su nessuna: la parola è atona'],
      0,
      "È una aguda in vocale: l'accento cade sull'ultima sillaba e la tilde lo segnala, a differenza di tendrá in [ten-DRA].",
    ),
    q(
      'q9',
      'Come si legge «me gustaría»?',
      ['[me gus-ta-RI-a]', '[me gus-TA-ri-a]', '[me GUS-ta-ri-a]', '[me gus-ta-ri-A]'],
      0,
      "Nel condizionale la í è accentata e separata dalla a finale (iato); l'accento non cade su ta.",
    ),
    q(
      'q10',
      'Come chiedi in modo cortese «potrebbe aiutarmi?»',
      ['¿Podría ayudarme?', '¿Podrá ayudarme?', '¿Puede ayudarme?', '¿Pudo ayudarme?'],
      0,
      'Il condizionale podría è la forma di cortesia più comune; puede è corretta ma neutra, podrá indicherebbe un futuro.',
    ),
  ],
  [
    card(
      'c1',
      'Futuro: desinenze',
      "-é, -ás, -á, -emos, -éis, -án sull'infinito intero: hablaré [a-bla-RE], viviremos.",
    ),
    card('c2', 'Radici irregolari I', 'tendr-, vendr-, pondr-, saldr-, valdr- (la e/i cade, si inserisce d).'),
    card('c3', 'Radici irregolari II', 'podr-, sabr-, habr-, querr-, cabr- (la vocale cade).'),
    card('c4', 'Radici irregolari III', 'har- (hacer), dir- (decir): haré [a-RE], diré [di-RE].'),
    card('c5', 'Condizionale', 'Radice del futuro + -ía, -ías...: tendría [ten-DRI-a], me gustaría [me gus-ta-RI-a].'),
    card('c6', 'ir a + infinito', 'Voy a comer, vamos a viajar, va a llover: il futuro del parlato.'),
    card(
      'c7',
      'Futuro di probabilità',
      'Estará en casa = probabilmente è a casa; ¿Qué hora será? Condizionale: tendría = avrà avuto.',
    ),
    card('c8', 'acabar de', 'Appena: acabo de llegar. Presente, non passato: mai «acabé de».'),
    card('c9', 'estar a punto de', 'Essere sul punto di: estoy a punto de salir [es-TOI a PUN-to de sa-LIR].'),
    card('c10', 'Si + presente', 'Si tengo tiempo, iré: il futuro non si usa dopo si né dopo cuando.'),
    card(
      'c11',
      'tendré / tendrá',
      '[ten-DRE] / [ten-DRA]: tilde su ultima sillaba; la persona cambia solo per la vocale.',
    ),
    card('c12', 'podría ayudarme', '[po-DRI-a a-yu-DHAR-me]: ¿Podría ayudarme? Richiesta cortese.'),
  ],
  [
    prac(
      'p1',
      'Coniuga al futuro semplice: yo (tener), tú (venir), nosotros (hacer), ellos (poder).',
      'tendré; vendrás; haremos; podrán.',
    ),
    prac(
      'p2',
      'Traduci: «Domani andrò al mare. Sono appena tornato e sto per cenare.»',
      'Mañana iré a la playa (o voy a ir a la playa). Acabo de volver y estoy a punto de cenar.',
    ),
    prac(
      'p3',
      'Riscrivi in modo cortese: «Dammi un caffè», «Puoi aiutarmi?», «Voglio un tavolo per due».',
      'Me gustaría un café / ¿Me pondría un café? ¿Podrías ayudarme? Querría una mesa para dos, por favor.',
    ),
    prac(
      'p4',
      'Correggi: «Si tendré tiempo, iré», «Acabé de llegar», «Haceré la tarea», «Voy salir».',
      'Si tengo tiempo, iré. / Acabo de llegar. / Haré la tarea. / Voy a salir (mancava a).',
    ),
    prac(
      'p5',
      'Scrivi 5 frasi sul tuo prossimo fine settimana usando ir a, futuro semplice e un condizionale.',
      'El sábado voy a visitar a mis padres. Cenaremos juntos. El domingo haré deporte. Si tengo tiempo, leeré un libro. Me gustaría viajar más.',
    ),
  ],
)
