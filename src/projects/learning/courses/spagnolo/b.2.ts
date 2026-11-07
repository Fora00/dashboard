import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// Spanish B1 modules, part 2: imperfecto de subjuntivo and conditionals, passive and periphrases, connectors.

export const esCond = mod(
  'es-cond',
  'Imperfecto de subjuntivo e periodo ipotetico',
  'Forme -ra/-se, si + tipi di ipotesi, ojalá, como si, desideri irrealizzabili',
  'b1',
  `<p class="lead">L'<b>imperfecto de subjuntivo</b> serve per l'ipotesi, per il desiderio irreale e come tempo di concordanza dopo un verbo al passato. È il «se io avessi» italiano, ma con più usi.</p>
${PRON_SHORT}
<h3>Formazione</h3>
<p>Prendi la 3ª persona plurale del <b>pretérito indefinido</b> (<i>ellos hablaron</i>), togli <code>-ron</code> e aggiungi le desinenze <b>-ra</b> (o <b>-se</b>). Questo vale anche per gli irregolari.</p>
<table><tr><th></th><th>hablar</th><th>comer</th><th>ser/ir</th></tr>
<tr><td>yo</td><td>hablara</td><td>comiera</td><td>fuera</td></tr>
<tr><td>tú</td><td>hablaras</td><td>comieras</td><td>fueras</td></tr>
<tr><td>él/usted</td><td>hablara</td><td>comiera</td><td>fuera</td></tr>
<tr><td>nosotros</td><td>habláramos</td><td>comiéramos</td><td>fuéramos</td></tr>
<tr><td>vosotros</td><td>hablarais</td><td>comierais</td><td>fuerais</td></tr>
<tr><td>ellos</td><td>hablaran</td><td>comieran</td><td>fueran</td></tr></table>
<p>Anche <i>haber</i> ha l'imperfecto de subjuntivo, e con il participio forma il <b>pluscuamperfecto de subjuntivo</b> (tipo 3): <b>hubiera, hubieras, hubiera, hubiéramos, hubierais, hubieran</b> + participio (<i>hubiera venido</i>); in <b>-se</b>: <i>hubiese, hubieses…</i>.</p>
<p>Forma in <b>-se</b> (uguale per significato, più rara e letteraria): <i>hablase, hablases, hablase, hablásemos, hablaseis, hablasen</i>. In America si usa quasi solo <i>-ra</i>.</p>
<p>Irregolari (dalla forma ellos): <i>tuvieron</i> → <b>tuviera</b>, <i>estuvieron</i> → <b>estuviera</b>, <i>hicieron</i> → <b>hiciera</b>, <i>dijeron</i> → <b>dijera</b>, <i>pudieron</i> → <b>pudiera</b>, <i>quisieron</i> → <b>quisiera</b>, <i>supieron</i> → <b>supiera</b>, <i>pusieron</i> → <b>pusiera</b>, <i>vinieron</i> → <b>viniera</b>, <i>dieron</i> → <b>diera</b>, <i>trajeron</i> → <b>trajera</b>, <i>leyeron</i> → <b>leyera</b>, <i>durmieron</i> → <b>durmiera</b>, <i>pidieron</i> → <b>pidiera</b>.</p>
<h3>Accento: hablara o hablará?</h3>
<p><i>hablara</i> [a-BLA-ra] (subjuntivo imperfetto) contro <i>hablará</i> [a-bla-RA] (futuro: «parlerà»); <i>habláramos</i> [a-BLA-ra-mos] contro <i>hablaremos</i> [a-bla-RE-mos]. Nel subjuntivo la tonica resta sulla radice; nel futuro cade sull'ultima o penultima sillaba. Altre forme: <i>tuviera</i> [tu-BIE-ra], <i>fuera</i> [FUE-ra], <i>hiciera</i> [i-THIE-ra], <i>dijera</i> [di-HE-ra], <i>pudiera</i> [pu-DHIE-ra], <i>quisiera</i> [ki-SSIE-ra], <i>viniera</i> [bi-NIE-ra], <i>hubiera</i> [u-BIE-ra].</p>
<h3>Periodo ipotetico: i tre tipi</h3>
<table><tr><th>Tipo</th><th>Si…</th><th>Principale</th></tr>
<tr><td>1 possibile</td><td>presente indicativo</td><td>presente, futuro, imperativo</td></tr>
<tr><td>2 improbabile</td><td>imperfecto de subjuntivo</td><td>condicional</td></tr>
<tr><td>3 impossibile (passato)</td><td>pluscuamperfecto de subjuntivo</td><td>condicional perfecto</td></tr></table>
<ul><li><b>1</b> · <i>Si llueve, me quedo en casa / me quedaré / quédate.</i> (Se piove, resto a casa.)</li><li><b>2</b> · <i>Si tuviera dinero, viajaría por todo el mundo.</i> (Se avessi soldi, viaggerei.)</li><li><b>3</b> · <i>Si hubiera estudiado, habría aprobado.</i> (Se avessi studiato, sarei stato promosso.) Anche <i>hubiera aprobado</i> nella principale.</li><li><b>Misto</b> · <i>Si hubiera estudiado, ahora tendría un buen trabajo.</i></li></ul>
<p><b>Regola d'oro</b>: dopo <i>si</i> condizionale mai il condizionale né il futuro: <i>*si tendría</i>, <i>*si tendrá</i> sono errori. Il <i>si</i> interrogativo indiretto è un'altra cosa: <i>No sé si vendrá</i> (Non so se verrà) è corretto.</p>
<h3>Altre costruzioni</h3>
<ul><li><b>Como si</b> + imperfecto o pluscuamperfecto: <i>Habla como si fuera el jefe.</i> · <i>Me miró como si no me hubiera visto nunca.</i></li><li><b>Ojalá</b>: + presente (possibile) <i>Ojalá llueva</i>; + imperfecto (improbabile) <i>Ojalá tuviera más tiempo</i>; + pluscuamperfecto (rimpianto) <i>Ojalá hubiera venido</i>.</li><li><b>Consigli</b>: <i>Yo que tú, aceptaría.</i> · <i>Yo en tu lugar, no iría.</i> · <i>Si yo fuera tú…</i> (Se fossi in te).</li><li><b>De + infinito composto</b> = si + pluscuamperfecto: <i>De haberlo sabido, te habría avisado.</i></li><li><b>Cortesia</b>: <i>Quisiera un café</i> (Vorrei), <i>¿Podrías ayudarme?</i>, <i>Me gustaría que vinieras</i>, <i>Deberías descansar</i>.</li></ul>
<h3>Trappole per italiani</h3>
<ul><li>Anche se in alcune zone si sente <i>si tendría</i> nel parlato, è da evitare: usa sempre il subjuntivo.</li><li>L'italiano «se fosse» non è mai <i>*si sería</i>: <i>si fuera</i>.</li><li>«Vorrei» si dice di solito <i>quisiera</i> o <i>me gustaría</i> (anche <i>querría</i> è corretto, ma più raro nel parlato).</li></ul>
<div class="say"><b>Cosa dire.</b> «Si tuviera tiempo, viajaría más. Ojalá hubiera venido. Habla como si lo supiera todo.» (Se avessi tempo viaggerei di più. Magari fosse venuto. Parla come se sapesse tutto.)</div>`,
  [
    q(
      'q1',
      `Come si dice «Se avessi soldi, viaggerei»?`,
      [
        `Si tuviera dinero, viajaría`,
        `Si tendría dinero, viajaría`,
        `Si tengo dinero, viajaría`,
        `Si tendré dinero, viajaría`,
      ],
      0,
      `Il tipo 2 vuole si + imperfecto de subjuntivo. Si tendría è l'errore più comune per chi parla italiano, perché ricalca il condizionale.`,
    ),
    q(
      'q2',
      `Completa il tipo 3: <i>Si (nosotros, saber) ___ la verdad, te lo habríamos dicho.</i>`,
      [`hubiéramos sabido`, `supiéramos`, `sabíamos`, `habríamos sabido`],
      0,
      `Per un'ipotesi impossibile nel passato serve il pluscuamperfecto de subjuntivo. Supiéramos è l'imperfecto de subjuntivo (tipo 2, ipotesi presente) e non rimanda al passato; habríamos sabido è un condizionale, che dopo si non si usa.`,
    ),
    q(
      'q3',
      `Quale forma è l'imperfecto de subjuntivo di <i>tener</i> con <i>yo</i>?`,
      [`tuviera`, `tendría`, `tenga`, `tuvo`],
      0,
      `Si parte da ellos tuvieron e si ottiene tuviera. Tendría è il condizionale, tenga il presente di subjuntivo.`,
    ),
    q(
      'q4',
      `Quale frase significa «Parla come se fosse il capo»?`,
      [
        `Habla como si fuera el jefe`,
        `Habla como si es el jefe`,
        `Habla como si sería el jefe`,
        `Habla como si será el jefe`,
      ],
      0,
      `Come si regge sempre imperfecto o pluscuamperfecto de subjuntivo. Con l'indicativo cambia il senso e non si usa.`,
    ),
    q(
      'q5',
      `Quale frase esprime un rimpianto sul passato?`,
      [`Ojalá hubiera venido`, `Ojalá venga`, `Ojalá viniera mañana`, `Ojalá vendrá`],
      0,
      `Ojalá + pluscuamperfecto de subjuntivo indica un desiderio irrealizzabile sul passato. Ojalá venga riguarda il futuro possibile.`,
    ),
    q(
      'q6',
      `Quale parola è un futuro, non un subjuntivo?`,
      [`hablará [a-bla-RA]`, `hablara [a-BLA-ra]`, `hablase [a-BLA-sse]`, `habláramos [a-BLA-ra-mos]`],
      0,
      `Il futuro ha l'accento scritto sull'ultima sillaba e la tonica finale. Le altre tre forme sono piane o sdrucciole del subjuntivo.`,
    ),
    q(
      'q7',
      `Come dici «Se fossi in te, accetterei»?`,
      [`Yo que tú, aceptaría`, `Si yo sería tú, aceptaría`, `Yo que tú, aceptara`, `Si fuera tú, aceptaré`],
      0,
      `Yo que tú + condicional è la formula più naturale. Si yo sería ripete il condizionale dopo si (errore tipico), aceptara mette un subjuntivo nella principale, e aceptaré è un futuro dopo si fuera.`,
    ),
    q(
      'q8',
      `Quale frase è corretta?`,
      [`No sé si vendrá`, `Si tendrá tiempo, te llamo`, `Si tendría tiempo, te llamo`, `Si tendrá tiempo, él viene`],
      0,
      `Il si interrogativo indiretto (non so se) ammette il futuro: vendrá. Il si condizionale invece non lo ammette mai, quindi «se avrà tempo» diventa si tiene tiempo, e il condizionale (tendría) dopo si è l'altro calco tentante.`,
    ),
  ],
  [
    card(
      `c1`,
      `Formazione imperfecto de subjuntivo`,
      `ellos del indefinido − ron + ra: hablaron → hablara; tuvieron → tuviera; fueron → fuera.`,
    ),
    card(
      `c2`,
      `Terminazioni -ra / -se`,
      `-ra, -ras, -ra, -ramos, -rais, -ran (o -se, -ses, -se, -semos, -seis, -sen). Nosotros con accento: habláramos.`,
    ),
    card(`c3`, `Tipo 1 (possibile)`, `Si + presente → presente/futuro/imperativo: Si llueve, me quedo.`),
    card(`c4`, `Tipo 2 (improbabile)`, `Si + imperfecto de subjuntivo → condicional: Si tuviera dinero, viajaría.`),
    card(
      `c5`,
      `Tipo 3 (impossibile)`,
      `Si + pluscuamperfecto de subjuntivo → condicional perfecto: Si hubiera estudiado, habría aprobado.`,
    ),
    card(`c6`, `Mai dopo si`, `Condizionale e futuro (nel senso condizionale): *si tendría, *si tendrá.`),
    card(`c7`, `Como si`, `Imperfecto o pluscuamperfecto de subjuntivo: como si fuera, como si hubiera sabido.`),
    card(
      `c8`,
      `Ojalá: tre gradi`,
      `Ojalá llueva (possibile) · Ojalá tuviera (improbabile) · Ojalá hubiera venido (rimpianto).`,
    ),
    card(`c9`, `Fossi in te`, `Yo que tú + condicional; yo en tu lugar + condicional; si yo fuera tú + condicional.`),
    card(`c10`, `hablara / hablará`, `hablara [a-BLA-ra] = subjuntivo. hablará [a-bla-RA] = futuro.`),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Se avessi più tempo, imparerei il tedesco.»`,
      `Si tuviera más tiempo, aprendería alemán. Tipo 2: si + imperfecto de subjuntivo + condicional.`,
    ),
    prac(
      `p2`,
      `Traduci: «Se avessi saputo la verità, non sarei venuto.»`,
      `Si hubiera sabido la verdad, no habría venido. Tipo 3: pluscuamperfecto de subjuntivo + condicional perfecto.`,
    ),
    prac(
      `p3`,
      `Correggi: «Si tendría un coche, iría a la playa.»`,
      `Si tuviera un coche, iría a la playa. Dopo si condizionale mai il condizionale.`,
    ),
    prac(
      `p4`,
      `Traduci: «Magari fossi più alto!»`,
      `¡Ojalá fuera más alto! Nota: ojalá + imperfecto de subjuntivo per un desiderio irrealizzabile; que è facoltativo (ojalá que fuera).`,
    ),
    prac(
      `p5`,
      `Completa: «Hablas como si no lo ___ (saber) nadie.»`,
      `Hablas como si no lo supiera nadie. Come si vuole l'imperfecto de subjuntivo; non esiste come si sabe.`,
    ),
  ],
)

export const esPassiva = mod(
  'es-passiva',
  'Passiva, se impersonale, gerundio e perifrasi',
  'Ser + participio, pasiva refleja, gerundio; seguir, llevar, empezar a, dejar de, volver a, ir/estar + gerundio',
  'b1',
  `<p class="lead">Lo spagnolo preferisce la forma attiva e la <b>pasiva refleja</b> con <i>se</i>. La passiva con <i>ser</i> è tipica dello scritto (giornali, testi formali).</p>
${PRON_SHORT}
<h3>Pasiva con ser</h3>
<p><b>ser + participio</b> (concorda in genere e numero con il soggetto) + <i>por</i> + agente: <i>El libro fue escrito por Cervantes.</i> · <i>Las casas fueron construidas en 1990.</i> · <i>La ley será aprobada mañana.</i> Evita di usarla nel parlato quotidiano.</p>
<h3>Pasiva refleja (se + 3ª persona)</h3>
<p>Il verbo concorda con la cosa e non c'è agente: <i>Se venden pisos.</i> · <i>Se habla español.</i> · <i>Se vende casa.</i> · <i>Se cierran las puertas a las diez.</i> (Le porte si chiudono alle dieci.)</p>
<h3>Se impersonale</h3>
<p>Soggetto generico («si»): verbo sempre al singolare. <i>Aquí se vive bien.</i> (Qui si vive bene.) · <i>No se puede fumar.</i> · <i>Se come tarde en España.</i> Con una persona oggetto introdotta da <i>a</i>: <i>Se detuvo a los sospechosos.</i> (verbo singolare). Differenza con l'italiano: <i>Se necesitan camareros</i> (plurale per concordanza), mentre con una persona determinata si dice <i>Se busca a un camarero</i>.</p>
<h3>Gerundio</h3>
<p>Regolare: <b>-ando</b> (<i>hablando</i>), <b>-iendo</b> (<i>comiendo, viviendo</i>). Irregolari: <i>leyendo, oyendo, cayendo, trayendo, construyendo, yendo, durmiendo, pidiendo, diciendo, viniendo, pudiendo, sintiendo, muriendo</i>. I pronomi si attaccano: <i>Estoy leyéndolo</i> o <i>Lo estoy leyendo</i>. Da leggere: <i>leyendo</i> [le-YEN-do], <i>durmiendo</i> [dur-MIEN-do], <i>pidiendo</i> [pi-DHIEN-do], <i>diciendo</i> [di-THIEN-do], <i>yendo</i> [YEN-do], <i>construyendo</i> [kons-tru-YEN-do], <i>construida</i> [kons-tru-I-dha], <i>llevar</i> [ye-BAR], <i>seguir</i> [se-GHIR].</p>
<ul><li><b>Trappola</b>: dopo <i>después de</i>, <i>antes de</i>, <i>al</i> si usa l'infinito, non il gerundio: <i>Después de comer</i> (Dopo mangiato), <i>Al salir</i> (Uscendo / Quando uscii).</li><li>Il gerundio non funziona come aggettivo: <i>una caja que contiene…</i>, non <i>*una caja conteniendo</i>. Eccezione: <i>agua hirviendo</i>.</li></ul>
<h3>Perifrasi verbali</h3>
<table><tr><td><b>estar + gerundio</b></td><td>Estoy estudiando. (Sto studiando.)</td></tr>
<tr><td><b>seguir + gerundio</b></td><td>Sigue lloviendo. (Continua a piovere.)</td></tr>
<tr><td><b>llevar + gerundio</b></td><td>Llevo dos años viviendo aquí. (Vivo qui da due anni.)</td></tr>
<tr><td><b>ir + gerundio</b></td><td>Voy mejorando. (Sto migliorando piano piano.)</td></tr>
<tr><td><b>empezar a + inf.</b></td><td>Empieza a llover. (Comincia a piovere.)</td></tr>
<tr><td><b>ponerse a + inf.</b></td><td>Se puso a llorar. (Si mise a piangere.)</td></tr>
<tr><td><b>dejar de + inf.</b></td><td>Dejé de fumar. (Ho smesso di fumare.)</td></tr>
<tr><td><b>volver a + inf.</b></td><td>Vuelvo a llamarte. (Ti richiamo.)</td></tr>
<tr><td><b>acabar de + inf.</b></td><td>Acabo de llegar. (Sono appena arrivato.)</td></tr>
<tr><td><b>estar a punto de</b></td><td>Estoy a punto de salir. (Sto per uscire.)</td></tr>
<tr><td><b>ir a + inf.</b></td><td>Voy a viajar. (Sto per/Andrò a viaggiare.)</td></tr>
<tr><td><b>tener que / hay que</b></td><td>Tengo que irme. · Hay que esperar.</td></tr></table>
<h3>Trappole per italiani</h3>
<ul><li>«Sto per partire» → <i>Estoy a punto de salir</i>: è la forma sicura e universale. <i>Estar por + infinito</i> in America (Argentina, Cile, Messico…) può valere «sto per» (<i>estoy por irme</i>), ma in Spagna significa «ho voglia di» o «è ancora da fare» (<i>la cama está por hacer</i>): non usarlo come equivalente sicuro.</li><li>«Torno a chiamare» → <i>volver a llamar</i> (preposizione <b>a</b>, non <i>*de</i>).</li><li>«Smetto di» → <i>dejar de</i>, ma «finire di» → <i>terminar de / acabar de</i> (acabar de = appena).</li><li>«Da due anni» con il presente italiano → <i>Llevo dos años</i> + gerundio, oppure <i>Hace dos años que</i> + presente.</li></ul>
<div class="say"><b>Cosa dire.</b> «Se habla español. Llevo un año estudiando. Acabo de llegar y voy a descansar.» (Si parla spagnolo. Studio da un anno. Sono appena arrivato e sto per riposare.)</div>`,
  [
    q(
      'q1',
      `Come si dice «Si vendono appartamenti»?`,
      [`Se venden pisos`, `Se vende pisos`, `Se es vendido pisos`, `Se vendiendo pisos`],
      0,
      `Nella pasiva refleja il verbo concorda con la cosa venduta, che è plurale. Se vende pisos è un errore molto frequente.`,
    ),
    q(
      'q2',
      `Quale frase è una passiva con <i>ser</i> corretta?`,
      [
        `La casa fue construida por mi abuelo`,
        `La casa fue construido por mi abuelo`,
        `La casa está construir por mi abuelo`,
        `La casa se fue construida por mi abuelo`,
      ],
      0,
      `Il participio concorda con il soggetto femminile (construida). Con ser la passiva esprime l'azione, con estar il risultato.`,
    ),
    q(
      'q3',
      `Come dici «Dopo aver mangiato»?`,
      [`Después de comer`, `Después de comiendo`, `Después comiendo`, `Después de haber comiendo`],
      0,
      `Dopo una preposizione come después de lo spagnolo vuole l'infinito: después de comer. Il gerundio non segue mai una preposizione, quindi después de comiendo è sbagliato; después de haber comiendo mescola infinito e gerundio.`,
    ),
    q(
      'q4',
      `Come si dice «Vivo qui da due anni»?`,
      [
        `Llevo dos años viviendo aquí`,
        `Llevo dos años vivir aquí`,
        `Estoy dos años viviendo aquí`,
        `Soy dos años viviendo aquí`,
      ],
      0,
      `Llevar + tempo + gerundio indica da quanto tempo si fa qualcosa. Estoy dos años non esprime durata in spagnolo.`,
    ),
    q(
      'q5',
      `Come si dice «Sto per uscire»?`,
      [`Estoy a punto de salir`, `Estoy a punto salir`, `Estoy en punto de salir`, `Estoy de salir`],
      0,
      `Estar a punto de + infinito indica un'azione imminente ed è valido ovunque. Le altre opzioni sbagliano la preposizione (a punto salir senza de, en punto de, estoy de), mentre estoy por salir in Spagna ha un altro senso.`,
    ),
    q(
      'q6',
      `Quale gerundio è corretto per <i>leer</i>?`,
      [`leyendo`, `leiendo`, `leyando`, `leendo`],
      0,
      `Tra due vocali la i diventa y: leyendo, oyendo, cayendo, trayendo. Leiendo non è la grafia corretta.`,
    ),
    q(
      'q7',
      `Come si dice «Ti richiamo»?`,
      [`Vuelvo a llamarte`, `Vuelvo de llamarte`, `Vuelvo llamarte`, `Regreso a llamarte`],
      0,
      `Volver a + infinito indica ripetere un'azione, e la preposizione è sempre a. Vuelvo de e vuelvo senza preposizione sono errori; regresar indica tornare in un luogo, non ripetere un'azione.`,
    ),
    q(
      'q8',
      `Cosa significa <i>Acabo de llegar</i>?`,
      [`Sono appena arrivato`, `Sto per arrivare`, `Arrivo di nuovo`, `Ho smesso di arrivare`],
      0,
      `Acabar de + infinito significa appena. Non va confuso con estar a punto de (sto per), con volver a (di nuovo) né con dejar de (smettere).`,
    ),
  ],
  [
    card(`c1`, `Pasiva con ser`, `ser + participio concordato + por: El libro fue escrito por Cervantes.`),
    card(`c2`, `Pasiva refleja`, `se + 3ª persona concordata con la cosa: Se venden pisos. Se habla español.`),
    card(`c3`, `Se impersonale`, `Verbo al singolare: Aquí se vive bien. Con persona: Se detuvo a los sospechosos.`),
    card(
      `c4`,
      `Gerundio: formazione`,
      `-ando / -iendo. Irregolari: leyendo, oyendo, durmiendo, pidiendo, diciendo, yendo.`,
    ),
    card(`c5`, `Dopo preposizione`, `Infinito, non gerundio: después de comer, antes de salir, al llegar.`),
    card(`c6`, `llevar + tempo + gerundio`, `Llevo dos años viviendo aquí = vivo qui da due anni.`),
    card(`c7`, `seguir + gerundio`, `Continuare a: Sigo trabajando.`),
    card(`c8`, `volver a + infinito`, `Ripetere: Vuelvo a llamarte.`),
    card(`c9`, `acabar de + infinito`, `Appena: Acabo de llegar.`),
    card(`c10`, `estar a punto de + infinito`, `Stare per: Estoy a punto de salir.`),
    card(`c11`, `dejar de + infinito`, `Smettere di: Dejé de fumar.`),
  ],
  [
    prac(
      `p1`,
      `Traduci: «In Spagna si cena tardi.»`,
      `En España se cena tarde. Se impersonale con verbo al singolare.`,
    ),
    prac(
      `p2`,
      `Trasforma in pasiva refleja: «Venden coches de segunda mano.»`,
      `Se venden coches de segunda mano. Il verbo concorda con coches (plurale).`,
    ),
    prac(
      `p3`,
      `Traduci: «Studio spagnolo da sei mesi.»`,
      `Llevo seis meses estudiando español. In alternativa: Hace seis meses que estudio español.`,
    ),
    prac(
      `p4`,
      `Correggi: «Después de comiendo, salí a pasear.»`,
      `Después de comer, salí a pasear. Dopo la preposizione si usa l'infinito.`,
    ),
    prac(
      `p5`,
      `Traduci: «Ha smesso di piovere e ricomincia a fare caldo.»`,
      `Ha dejado de llover y vuelve a hacer calor. Note: dejar de + infinito, volver a + infinito.`,
    ),
  ],
)

export const esConnettori = mod(
  'es-connettori',
  'Connettori, discorso indiretto, relative e enfasi',
  'Connettori, concordanza nel discorso indiretto, el cual e cuyo, ser/estar avanzato, frasi scisse',
  'b2',
  `<p class="lead">Al livello B2 il testo deve scorrere: i <b>connettori</b> legano le idee, il <b>discorso indiretto</b> riporta le parole altrui, le relative e le frasi scisse danno precisione ed enfasi.</p>
${PRON_SHORT}
<h3>Connettori</h3>
<table><tr><td><b>Aggiunta</b></td><td>además, incluso, asimismo, por otra parte</td></tr>
<tr><td><b>Contrasto</b></td><td>sin embargo, no obstante, en cambio, pero, aun así</td></tr>
<tr><td><b>Concessione</b></td><td>aunque, a pesar de (que), por mucho que</td></tr>
<tr><td><b>Causa</b></td><td>porque, ya que, puesto que, dado que, debido a, gracias a</td></tr>
<tr><td><b>Conseguenza</b></td><td>por eso, por lo tanto, así que, de modo que</td></tr>
<tr><td><b>Ordine</b></td><td>en primer lugar, después, por último, finalmente</td></tr>
<tr><td><b>Conclusione</b></td><td>en resumen, en definitiva, en conclusión</td></tr>
<tr><td><b>Riformulazione</b></td><td>es decir, o sea, mejor dicho</td></tr></table>
<ul><li><b>A pesar de</b> + infinito/nome: <i>A pesar del frío, salimos.</i> · <i>A pesar de que</i> + indicativo/subjuntivo: <i>a pesar de que llovía</i>.</li><li><b>Causa</b> e accento: <i>¿Por qué?</i> [por KE] (domanda), <i>porque</i> [POR-ke] (perché, risposta), <i>el porqué</i> [por-KE] (il motivo, un nome), <i>por que</i> [por ke] (per cui, raro).</li><li><b>Sino</b> (ma, dopo negazione) contro <b>si no</b> (se no): <i>No es rojo, sino azul.</i> · <i>Si no vienes, me enfado.</i></li></ul>
<h3>Discorso indiretto</h3>
<p>Con un verbo introduttivo al passato (<i>dijo que</i>) i tempi arretrano:</p>
<table><tr><td>presente</td><td>imperfecto</td></tr>
<tr><td>pretérito / perfecto</td><td>pluscuamperfecto</td></tr>
<tr><td>futuro</td><td>condicional</td></tr>
<tr><td>imperativo</td><td>imperfecto de subjuntivo</td></tr></table>
<ul><li>«Estoy cansado» → <i>Dijo que estaba cansado.</i></li><li>«Llegaré tarde» → <i>Dijo que llegaría tarde.</i></li><li>«Ven aquí» → <i>Me dijo que viniera.</i></li><li>Domande: «¿Dónde vives?» → <i>Preguntó dónde vivía.</i> · «¿Tienes hambre?» → <i>Preguntó si tenía hambre.</i></li><li>Il <b>pretérito indefinido</b> può restare invariato quando il riferimento temporale è chiaro (<i>Dijo que llegó ayer</i>); si usa il pluscuamperfecto quando serve l'anteriorità (<i>Dijo que ya había llegado</i>).</li><li>Se il verbo introduttivo è al presente non c'è scorrimento: <i>Dice que está cansado.</i> Cambiano anche gli indicatori: <i>hoy → aquel día, ayer → el día anterior, mañana → al día siguiente</i>.</li></ul>
<h3>Relative con preposizione: el cual, cuyo</h3>
<ul><li><i>La casa en la que vivo</i> = <i>la casa en la cual vivo</i>. <i>El cual, la cual, los cuales, las cuales</i> concordano; <i>lo cual</i> riprende un'intera frase: <i>No vino, lo cual me molestó.</i></li><li><b>Cuyo, cuya, cuyos, cuyas</b> (il cui) concorda con ciò che è <b>posseduto</b>, non col possessore: <i>El autor cuyos libros leí.</i> · <i>La chica cuya madre es médica.</i> Mai con l'articolo.</li><li><i>Quien/quienes</i> solo per persone: <i>La chica con quien hablé.</i></li></ul>
<h3>Ser e estar: casi avanzati</h3>
<table><tr><td>ser listo / estar listo</td><td>furbo / pronto</td></tr>
<tr><td>ser aburrido / estar aburrido</td><td>noioso / annoiato</td></tr>
<tr><td>ser malo / estar malo</td><td>cattivo / malato</td></tr>
<tr><td>ser rico / estar rico</td><td>ricco / buonissimo</td></tr>
<tr><td>ser verde / estar verde</td><td>di colore verde / acerbo</td></tr>
<tr><td>ser seguro / estar seguro</td><td>sicuro (luogo) / certo</td></tr></table>
<p>Anche: <i>La boda es en Madrid</i> (evento: ser); <i>El libro está en la mesa</i> (posizione: estar).</p>
<h3>Enfasi e frasi scisse</h3>
<ul><li><i>Fue Juan quien/el que rompió el vaso.</i> (È stato Giovanni a rompere il bicchiere.)</li><li><i>Es en Madrid donde vivo.</i> · <i>Fue ayer cuando lo vi.</i> · <i>Lo que quiero es descansar.</i></li><li><i>¡Qué bien!</i> · <i>Es que…</i> (è che… per giustificarsi) · <i>ni siquiera</i> (nemmeno).</li></ul>
<div class="say"><b>Cosa dire.</b> «Sin embargo, no estoy de acuerdo. Dijo que vendría, lo cual me sorprendió.» (Tuttavia non sono d'accordo. Disse che sarebbe venuto, il che mi ha sorpreso.)</div>`,
  [
    q(
      'q1',
      `Come si riporta «Estoy cansado» con <i>dijo que</i>?`,
      [`Dijo que estaba cansado`, `Dijo que está cansado`, `Dijo que estuvo cansado`, `Dijo que estará cansado`],
      0,
      `Con un verbo introduttivo al passato il presente diventa imperfecto. La forma está sarebbe corretta solo se il momento della frase non è passato.`,
    ),
    q(
      'q2',
      `Come si riporta «Llegaré tarde»?`,
      [`Dijo que llegaría tarde`, `Dijo que llegará tarde`, `Dijo que llegó tarde`, `Dijo que llegue tarde`],
      0,
      `Il futuro arretra al condizionale nel discorso indiretto passato. Llegó tarde cambierebbe il senso, perché sarebbe passato.`,
    ),
    q(
      'q3',
      `Completa: <i>La mujer ___ hijo es médico vive aquí.</i>`,
      [`cuyo`, `cuya`, `cuyos`, `cuyas`],
      0,
      `Cuyo concorda con hijo (maschile singolare), non con mujer. Cuya è la scelta più tentante per l'errore di concordanza.`,
    ),
    q(
      'q4',
      `Quale frase usa correttamente <i>sino</i>?`,
      [`No es rojo, sino azul`, `No es rojo, si no azul`, `No es rojo sino que azul`, `No es rojo, pero azul`],
      0,
      `Sino significa ma dopo una negazione. Si no (separato) vuol dire se non, ed è l'errore di grafia più tentante; sino que richiede un verbo dopo, e pero non corregge una negazione.`,
    ),
    q(
      'q5',
      `Cosa significa <i>Ana es lista</i>?`,
      [`Ana è furba`, `Ana è pronta`, `Ana è in lista`, `Ana è stanca`],
      0,
      `Con ser, listo vuol dire intelligente o furbo. Con estar (Ana está lista) significherebbe pronta.`,
    ),
    q(
      'q6',
      `Quale frase è una frase scissa corretta?`,
      [`Fue ayer cuando lo vi`, `Es ayer cuando lo vi`, `Fue ayer quien lo vi`, `Fue cuando ayer lo vi`],
      0,
      `La frase scissa è ser + elemento focalizzato + cuando/donde/quien. Il verbo ser va al tempo giusto (fue, non es); quien è solo per le persone e l'avverbio focalizzato precede cuando.`,
    ),
    q(
      'q7',
      `Quale parola va usata nella domanda «___ no vienes?»`,
      [`¿Por qué`, `¿Porque`, `¿Porqué`, `¿Por que`],
      0,
      `La domanda diretta vuole por qué, in due parole e con accento sulla é. Porque senza accento è la risposta (perché).`,
    ),
    q(
      'q8',
      `«Mi ha chiesto dove abitavo» si traduce:`,
      [
        `Me preguntó dónde vivía`,
        `Me preguntó dónde vivo`,
        `Me preguntó si dónde vivía`,
        `Me preguntó que dónde vivía`,
      ],
      0,
      `La domanda indiretta mantiene dónde e arretra il tempo (vivía). Si dónde non esiste (si introduce domande sì/no); que dónde è un uso colloquiale di ripetizione, da evitare nello scritto e all'esame.`,
    ),
  ],
  [
    card(`c1`, `Contrasto`, `sin embargo, no obstante, en cambio, aun así`),
    card(`c2`, `Conseguenza`, `por eso, por lo tanto, así que, de modo que`),
    card(`c3`, `Causa formale`, `puesto que, dado que, ya que, debido a, gracias a`),
    card(
      `c4`,
      `Discorso indiretto: arretramento`,
      `presente → imperfecto · pasado → pluscuamperfecto · futuro → condicional · imperativo → subjuntivo imperfecto.`,
    ),
    card(`c5`, `el cual / lo cual`, `La casa en la cual vivo. Lo cual riprende tutta una frase.`),
    card(`c6`, `cuyo`, `Concorda col posseduto: el autor cuyos libros leí. Mai con articolo.`),
    card(
      `c7`,
      `ser / estar aggettivi`,
      `ser listo = furbo; estar listo = pronto; ser malo = cattivo; estar malo = malato.`,
    ),
    card(`c8`, `sino / si no`, `sino = ma (dopo negazione); si no = se non.`),
    card(`c9`, `por qué / porque`, `¿Por qué? [por KE] domanda; porque [POR-ke] risposta.`),
    card(`c10`, `Frase scissa`, `Fue Juan quien lo hizo. Es en Madrid donde vivo. Lo que quiero es descansar.`),
  ],
  [
    prac(
      `p1`,
      `Riporta: Marta dice «Mañana iré al médico». Usa il passato (Marta dijo…).`,
      `Marta dijo que al día siguiente iría al médico. Note: mañana → al día siguiente, futuro → condicional.`,
    ),
    prac(
      `p2`,
      `Collega con un connettore: «Estudié mucho. Suspendí.»`,
      `Estudié mucho; sin embargo, suspendí. (oppure: aunque estudié mucho, suspendí.)`,
    ),
    prac(
      `p3`,
      `Traduci: «Il libro di cui ti ho parlato è di un autore le cui opere sono famose.»`,
      `El libro del que te hablé es de un autor cuyas obras son famosas. Note: cuyas concorda con obras.`,
    ),
    prac(`p4`, `Metti in enfasi: «Vivo a Madrid.»`, `Es en Madrid donde vivo. In alternativa: Madrid es donde vivo.`),
    prac(
      `p5`,
      `Traduci: «Non è stanco, ma annoiato.»`,
      `No está cansado, sino aburrido. Note: sino dopo negazione; estar aburrido = annoiato (stato).`,
    ),
  ],
)
