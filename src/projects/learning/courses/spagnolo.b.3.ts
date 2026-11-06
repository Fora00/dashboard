import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './spagnolo.pron'

// Spanish B2 modules, part 1: registers, Latin American varieties, false friends.

export const esRegistri = mod(
  'es-registri',
  'Registri, email, curriculum, modi di dire e diminutivi',
  'Formale e informale, lettere, reclami, tono, espressioni idiomatiche, diminutivi',
  'b2',
  `<p class="lead">Lo stesso contenuto cambia forma secondo la situazione. Scegliere il <b>registro</b> giusto (formale o informale) è parte della competenza B2 e dell'esame.</p>
${PRON_SHORT}
<h3>Tú o usted?</h3>
<ul><li><b>Tú</b> [tu] con amici, famiglia, coetanei, colleghi; in Spagna anche con quasi tutti i giovani e nei negozi informali.</li><li><b>Usted</b> con persone anziane, clienti, autorità, sconosciuti in contesti formali. Il verbo va alla 3ª persona: <i>¿Cómo está usted?</i></li><li>In America l'<i>usted</i> è più esteso (in alcuni paesi anche in famiglia o tra partner, come in Colombia o Costa Rica). Nel dubbio, parti con <i>usted</i>: se l'altro vuole, ti dice <i>trátame de tú</i>.</li></ul>
<h3>Parole che cambiano il tono</h3>
<table><tr><th>Neutro</th><th>Formale</th></tr>
<tr><td>Quiero un café</td><td>Quisiera un café</td></tr>
<tr><td>¿Puedes ayudarme?</td><td>¿Podría ayudarme?</td></tr>
<tr><td>Dime…</td><td>Dígame…</td></tr>
<tr><td>Si quieres</td><td>Si es tan amable</td></tr>
<tr><td>Perdona</td><td>Disculpe / Perdone</td></tr></table>
<p>Informale (Spagna): <i>vale</i> (ok), <i>tío/tía</i> (tipo), <i>guay</i> (fantastico), <i>mola</i> (mi piace), <i>currar</i> (lavorare), <i>pasta</i> (soldi), <i>mogollón</i> (un sacco). Sono marcati: evitali negli scritti formali.</p>
<h3>Email e lettere formali</h3>
<ul><li><b>Saluto</b>: <i>Estimado señor López:</i> · <i>Estimada señora García:</i> · <i>Estimados señores:</i> · <i>A quien corresponda:</i> (dopo i due punti si va a capo e il testo comincia con la maiuscola: <i>Estimado señor López:</i> poi, sulla riga dopo, <i>Le escribo…</i>).</li><li><b>Apertura</b>: <i>Me dirijo a usted para…</i> · <i>Le escribo en relación con…</i> · <i>Con referencia a su anuncio…</i></li><li><b>Corpo</b>: <i>Quisiera solicitar información sobre…</i> · <i>Le agradecería que me enviara…</i> · <i>Adjunto le envío…</i></li><li><b>Chiusura</b>: <i>Quedo a su disposición para cualquier aclaración.</i> · <i>A la espera de su respuesta,</i> · <i>Agradeciéndole de antemano su atención,</i></li><li><b>Congedo</b>: <i>Atentamente,</i> · <i>Un cordial saludo,</i> · <i>Cordialmente,</i></li></ul>
<h3>Lettera informale</h3>
<p><i>Hola, Laura:</i> · <i>Querida Laura:</i> … <i>Un abrazo,</i> · <i>Besos,</i> · <i>Hasta pronto,</i> · <i>Cuídate.</i> L'italiano «Ciao» non si traduce con <i>*ciao</i> ma con <i>hola</i> o <i>adiós/chao</i> (chao è diffuso soprattutto in America).</p>
<h3>Reclamo e curriculum</h3>
<ul><li><b>Reclamación</b>: <i>Asunto: Reclamación por el pedido nº 1234.</i> Racconta i fatti, indica cosa chiedi (<i>Solicito el reembolso / la sustitución</i>), fissa un termine (<i>en un plazo de diez días</i>), chiudi con tono fermo ma educato. In Spagna esiste la <i>hoja de reclamaciones</i>.</li><li><b>Currículum</b>: <i>Datos personales · Formación académica · Experiencia profesional · Idiomas · Informática · Otros datos de interés.</i> Verbi di azione al pretérito: <i>gestioné, coordiné, desarrollé</i>. La lettera di accompagnamento si chiama <i>carta de presentación</i> o <i>carta de motivación</i>.</li></ul>
<h3>Espressioni idiomatiche</h3>
<table><tr><td>estar en las nubes</td><td>avere la testa tra le nuvole</td></tr>
<tr><td>costar un ojo de la cara</td><td>costare un occhio della testa</td></tr>
<tr><td>meter la pata</td><td>fare una gaffe</td></tr>
<tr><td>ser pan comido</td><td>essere facilissimo</td></tr>
<tr><td>tomar el pelo</td><td>prendere in giro</td></tr>
<tr><td>estar hecho polvo</td><td>essere distrutto</td></tr>
<tr><td>hablar por los codos</td><td>parlare a raffica</td></tr>
<tr><td>llover a cántaros</td><td>piovere a dirotto</td></tr>
<tr><td>no pegar ojo</td><td>non chiudere occhio</td></tr>
<tr><td>estar sin blanca</td><td>essere al verde</td></tr>
<tr><td>dar calabazas</td><td>dare il due di picche</td></tr>
<tr><td>ponerse las pilas</td><td>darsi una mossa</td></tr></table>
<p>Proverbi: <i>Más vale tarde que nunca.</i> · <i>No hay mal que por bien no venga.</i> · <i>Del dicho al hecho hay mucho trecho.</i></p>
<h3>Diminutivi</h3>
<ul><li><b>-ito/-ita</b> dopo -o/-a: <i>casa → casita, gato → gatito</i>. <b>-cito/-ecito</b> dopo -e, consonante o monosillabi: <i>madre → madrecita, café → cafecito, pan → panecito, flor → florecita, luz → lucecita</i>.</li><li>Cambi ortografici: <i>poco → poquito, amigo → amiguito, lápiz → lapicito</i>.</li><li>Varianti regionali: <b>-illo/-illa</b> (andaluso: <i>chiquillo</i>), <b>-ico</b> (Aragona, Colombia, Costa Rica: <i>momentico</i>), <b>-ín</b> (Asturie).</li><li>Valori: affetto (<i>abuelita</i>), piccolezza, cortesia (<i>un momentito</i>, <i>un cafecito</i> [ka-fe-THI-to]), ironia. Alcuni sono lessicalizzati: <i>bocadillo</i> (panino), <i>ventanilla</i> (sportello).</li></ul>
<div class="say"><b>Cosa dire.</b> «Estimado señor López: Le escribo en relación con mi pedido. Quedo a su disposición. Atentamente,» (Gentile signor López: Le scrivo in merito al mio ordine. Resto a disposizione. Cordiali saluti,)</div>`,
  [
    q(
      'q1',
      `Quale saluto è adatto a una email formale a un uomo?`,
      [`Estimado señor Pérez:`, `Hola, señor Pérez, ¿qué tal?`, `¡Eh, señor Pérez!`, `Querido Pérez, ¿cómo va?`],
      0,
      `Estimado + titolo + cognome è la formula standard, con i due punti. Le altre aperture sono colloquiali o troppo familiari.`,
    ),
    q(
      'q2',
      `Quale congedo è formale?`,
      [`Atentamente,`, `Besos,`, `Un abrazo,`, `Chao, hasta luego,`],
      0,
      `Atentamente (o un cordial saludo) è la chiusura standard delle lettere formali. Besos e un abrazo sono per amici e familiari.`,
    ),
    q(
      'q3',
      `Qual è il diminutivo di <i>madre</i>?`,
      [`madrecita`, `madreta`, `madreito`, `madrate`],
      0,
      `Dopo -e si usa -cita (-ecita): madrecita. Madreta e madrate non sono diminutivi spagnoli, e madreito applica -ito senza la c che le parole in -e richiedono.`,
    ),
    q(
      'q4',
      `Cosa vuol dire <i>meter la pata</i>?`,
      [`Fare una gaffe`, `Correre veloce`, `Camminare lentamente`, `Essere testardo`],
      0,
      `È un modo di dire per un errore di tatto o una figuraccia. Non ha nulla a che fare con la velocità o con la testardaggine.`,
    ),
    q(
      'q5',
      `Qual è la frase più cortese?`,
      [`¿Podría ayudarme, por favor?`, `Ayúdame ya.`, `¿Puedes ayudarme ahora?`, `Necesito que me ayudes.`],
      0,
      `Il condizionale podría con usted è la forma più cortese. Gli altri esempi sono diretti o troppo imperativi.`,
    ),
    q(
      'q6',
      `Qual è il diminutivo di <i>poco</i>?`,
      [`poquito`, `pocito`, `pocquito`, `poquitito`],
      0,
      `Davanti a -ito la c diventa qu per mantenere il suono duro: poquito. Pocito sarebbe pronunciato con il suono dolce.`,
    ),
    q(
      'q7',
      `Cosa significa <i>costar un ojo de la cara</i>?`,
      [`Costare moltissimo`, `Essere cieco`, `Essere bello`, `Costare poco`],
      0,
      `È l'equivalente dell'italiano costare un occhio della testa. Si usa solo in senso figurato per qualcosa di molto caro.`,
    ),
    q(
      'q8',
      `Quale formula è adatta al reclamo scritto?`,
      [
        `Solicito el reembolso en un plazo de diez días`,
        `Quiero mi dinero ya`,
        `Devuélvame la pasta, por favor`,
        `Dame el dinero hoy`,
      ],
      0,
      `Il verbo solicitar e un termine preciso sono tipici del registro formale. Le altre frasi sono troppo dirette o colloquiali.`,
    ),
  ],
  [
    card(`c1`, `Estimado/a señor/a…:`, `Saluto formale all'inizio dell'email. Dopo i due punti si va a capo.`),
    card(`c2`, `Quedo a su disposición`, `Chiusura formale: resto a disposizione.`),
    card(`c3`, `Atentamente / Un cordial saludo`, `Congedi formali (cordiali saluti).`),
    card(`c4`, `Un abrazo / Besos`, `Congedi informali tra amici e famiglia.`),
    card(`c5`, `estar en las nubes`, `Avere la testa tra le nuvole.`),
    card(`c6`, `meter la pata`, `Fare una gaffe.`),
    card(`c7`, `ser pan comido`, `Essere facilissimo.`),
    card(`c8`, `tomar el pelo`, `Prendere in giro.`),
    card(
      `c9`,
      `Diminutivi: regole`,
      `-ito/-ita dopo -o/-a; -cito/-ecito dopo -e, consonante, monosillabi (madrecita, panecito, florecita).`,
    ),
    card(
      `c10`,
      `Diminutivi: cambi ortografici`,
      `c → qu (poco → poquito); g → gu (amigo → amiguito); z → c (lápiz → lapicito).`,
    ),
    card(
      `c11`,
      `Datos personales / Formación / Experiencia`,
      `Sezioni del currículum: dati personali, formazione, esperienza lavorativa.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Scrivi l'apertura di una email formale per chiedere informazioni su un corso.`,
      `Estimados señores: Me dirijo a ustedes para solicitar información sobre el curso de… Quedo a su disposición. Atentamente, [nome].`,
    ),
    prac(
      `p2`,
      `Trasforma in registro formale: «Dime a qué hora abren.»`,
      `¿Podría decirme a qué hora abren? (o ¿Sería tan amable de decirme…?) Note: condizionale e usted.`,
    ),
    prac(
      `p3`,
      `Traduci: «Non ho chiuso occhio e sono distrutto.»`,
      `No he pegado ojo y estoy hecho polvo. Per la notte appena passata la Spagna usa il perfecto (no he pegado ojo); in gran parte dell'America si dice no pegué ojo.`,
    ),
    prac(
      `p4`,
      `Forma i diminutivi: café, pan, luz, amigo.`,
      `cafecito, panecito, lucecita, amiguito. Note: -cito dopo vocale/consonante diversa da -o/-a; g → gu per mantenere il suono duro.`,
    ),
    prac(
      `p5`,
      `Scrivi una frase di reclamo (due righe) per un pacco non arrivato.`,
      `Le escribo porque el pedido nº 5678 no ha llegado todavía. Solicito su envío inmediato o el reembolso en un plazo de diez días. Atentamente,`,
    ),
  ],
)

export const esLatam = mod(
  'es-latam',
  'Varianti: voseo, ustedes, lessico e pronuncia',
  'Voseo, ustedes, pretérito contro perfecto, lessico ES/MX/AR/CO, seseo, yeísmo, aspirazione',
  'b2',
  `<p class="lead">Lo spagnolo è parlato da oltre 450 milioni di persone: non esiste una sola «pronuncia giusta». Qui il quadro minimo per capire e farti capire in Spagna e in America.</p>
${PRON_SHORT}
<h3>Voseo</h3>
<p>In Argentina, Uruguay, Paraguay e gran parte dell'America centrale (e in aree della Colombia, del Cile informale e di altri paesi) si usa <b>vos</b> al posto di <i>tú</i>. Il verbo cambia:</p>
<table><tr><th></th><th>tú (standard)</th><th>vos</th></tr>
<tr><td>hablar</td><td>hablas</td><td>hablás [a-BLAS]</td></tr>
<tr><td>comer</td><td>comes</td><td>comés [ko-MES]</td></tr>
<tr><td>vivir</td><td>vives</td><td>vivís [bi-BIS]</td></tr>
<tr><td>ser</td><td>eres</td><td>sos [sos]</td></tr>
<tr><td>tener</td><td>tienes</td><td>tenés [te-NES]</td></tr></table>
<ul><li>Esempio: <i>Vos tenés razón</i> [bos te-NES ra-SSON]. Imperativo: <i>hablá, comé, viví, decí, vení</i> [a-BLA, ko-ME, bi-BI, de-SI, be-NI].</li><li>Con preposizione: <i>con vos</i> (non <i>contigo</i>), <i>para vos</i>. I pronomi restano <i>te</i> e <i>tu</i>: <i>Vos te levantás temprano.</i></li><li>In Spagna il voseo non esiste: usa sempre <i>tú</i>.</li></ul>
<h3>Ustedes al posto di vosotros</h3>
<p>In tutta l'America (e alle Canarie) <b>vosotros</b> non si usa: si dice sempre <i>ustedes</i> + 3ª persona plurale, anche tra amici: <i>Ustedes son amables</i>, <i>¿Ustedes quieren café?</i>. In Spagna: <i>vosotros sois, queréis</i>.</p>
<h3>Pretérito o perfecto?</h3>
<p>In Spagna il <i>pretérito perfecto</i> (<i>he comido</i>) si usa per passati vicini al presente: <i>Hoy he comido pasta</i>. In gran parte dell'America si preferisce il <i>pretérito indefinido</i>: <i>Hoy comí pasta</i>; <i>¿Ya comiste?</i> invece di <i>¿Ya has comido?</i>. Ci sono zone con più perfecto (per esempio in alcune aree andine e in Messico per situazioni ancora aperte), quindi non assoluto.</p>
<h3>Lessico: Spagna, Messico, Argentina, Colombia</h3>
<table><tr><th>It.</th><th>ES</th><th>MX</th><th>AR / CO</th></tr>
<tr><td>auto</td><td>coche</td><td>carro / coche</td><td>auto / carro</td></tr>
<tr><td>computer</td><td>ordenador</td><td>computadora</td><td>computadora / computador</td></tr>
<tr><td>cellulare</td><td>móvil</td><td>celular</td><td>celular</td></tr>
<tr><td>succo</td><td>zumo</td><td>jugo</td><td>jugo</td></tr>
<tr><td>patata</td><td>patata</td><td>papa</td><td>papa</td></tr>
<tr><td>pesca</td><td>melocotón</td><td>durazno</td><td>durazno</td></tr>
<tr><td>fragola</td><td>fresa</td><td>fresa</td><td>frutilla / fresa</td></tr>
<tr><td>avocado</td><td>aguacate</td><td>aguacate</td><td>palta / aguacate</td></tr>
<tr><td>fagiolini</td><td>judías verdes</td><td>ejotes</td><td>chauchas / habichuelas</td></tr>
<tr><td>mais</td><td>maíz</td><td>elote</td><td>choclo / mazorca</td></tr>
<tr><td>arachidi</td><td>cacahuetes</td><td>cacahuates</td><td>maní</td></tr>
<tr><td>occhiali</td><td>gafas</td><td>lentes</td><td>anteojos / gafas</td></tr>
<tr><td>guidare</td><td>conducir</td><td>manejar</td><td>manejar</td></tr>
<tr><td>parcheggiare</td><td>aparcar</td><td>estacionar</td><td>estacionar / parquear</td></tr>
<tr><td>autobus</td><td>autobús</td><td>camión</td><td>colectivo / bus</td></tr>
<tr><td>giacca</td><td>chaqueta</td><td>chamarra</td><td>campera / chaqueta</td></tr>
<tr><td>maglione</td><td>jersey</td><td>suéter</td><td>pulóver / suéter</td></tr>
<tr><td>coperta</td><td>manta</td><td>cobija</td><td>frazada / cobija</td></tr>
<tr><td>appartamento</td><td>piso</td><td>departamento</td><td>departamento / apartamento</td></tr>
<tr><td>cameriere</td><td>camarero</td><td>mesero</td><td>mozo / mesero</td></tr>
<tr><td>frigorifero</td><td>nevera</td><td>refrigerador</td><td>heladera / nevera</td></tr>
<tr><td>biglietto</td><td>billete</td><td>boleto</td><td>pasaje / tiquete</td></tr>
<tr><td>marciapiede</td><td>acera</td><td>banqueta</td><td>vereda / andén</td></tr>
<tr><td>penna</td><td>bolígrafo</td><td>pluma</td><td>lapicera / esfero</td></tr>
<tr><td>benzina</td><td>gasolina</td><td>gasolina</td><td>nafta / gasolina</td></tr>
<tr><td>rubinetto</td><td>grifo</td><td>llave</td><td>canilla / llave</td></tr>
<tr><td>ok</td><td>vale</td><td>va / órale</td><td>dale / listo</td></tr>
<tr><td>fantastico</td><td>guay</td><td>padre / chido</td><td>copado / chévere</td></tr>
<tr><td>ragazzo</td><td>chaval</td><td>chavo</td><td>pibe / pelado</td></tr></table>
<p>Nell'ultima colonna la barra separa Argentina / Colombia, in quest'ordine (<i>pibe</i> è argentino, <i>pelado</i> colombiano).</p>
<p><b>Attenzione a coger</b>: in Spagna è «prendere» (<i>coger el autobús</i>), ma in Messico, Argentina e altri paesi ha un senso volgare: usa <i>tomar</i> o <i>agarrar</i>. E <i>ahorita</i> in Messico significa «tra poco» o «proprio ora».</p>
<h3>Pronuncia: seseo, yeísmo, aspirazione</h3>
<ul><li><b>Distinción</b> (Spagna centro-nord): <i>z</i> e <i>c</i> prima di e/i sono «th» inglese: <i>cerveza</i> [ther-BE-tha], <i>gracias</i> [GRA-thias]. <b>Seseo</b> (America, Canarie, gran parte dell'Andalusia): sono una «s»: [ser-BE-ssa], [GRA-ssias]. Nessuna delle due è «sbagliata».</li><li><b>Yeísmo</b>: <i>ll</i> e <i>y</i> suonano uguali, come la «i» consonantica di «ieri»: <i>calle</i> [KA-ye], <i>llave</i> [YA-be]. In Argentina e Uruguay diventano «sc» di «scena» (per alcuni parlanti sonora): <i>calle</i> [KA-sce], <i>yo</i> [SCIO].</li><li><b>Aspirazione della -s</b> (Caraibi, Cile, Andalusia, Canarie): <i>los amigos</i> → [loh a-MI-goh]; <i>estás</i> [eh-TA]. Qui la «h» finale indica solo un soffio, non è la jota.</li><li><b>Jota</b>: in Spagna è forte, gutturale (come «ch» tedesco); in molti paesi americani è più dolce, quasi una «h» aspirata: <i>jamón</i> [ha-MON].</li></ul>
<div class="say"><b>Cosa dire.</b> «Vos tenés razón. ¿Ustedes ya comieron? Acá le decimos “carro”.» (Hai ragione. Voi avete già mangiato? Qui lo chiamiamo “carro”.)</div>`,
  [
    q(
      'q1',
      `Qual è la forma di <i>vos</i> per <i>tener</i> (voseo)?`,
      [`tenés`, `tienes`, `tenéis`, `tenemos`],
      0,
      `Nel voseo l'accento cade sulla desinenza (tenés), senza dittongo. Tienes è tú, tenéis è vosotros (Spagna).`,
    ),
    q(
      'q2',
      `Come si dice «voi parlate» in Messico o Colombia?`,
      [`ustedes hablan`, `vosotros habláis`, `ustedes habláis`, `vos hablás`],
      0,
      `In America vosotros non si usa: ustedes vuole la 3ª persona plurale. Ustedes habláis mescola due sistemi ed è un errore.`,
    ),
    q(
      'q3',
      `Quale frase è più tipica in America?`,
      [`¿Ya comiste?`, `¿Ya has comido?`, `¿Ya habéis comido?`, `¿Ya habrás comido?`],
      0,
      `In gran parte dell'America si usa il pretérito per azioni appena concluse. Ya has comido è più tipico della Spagna.`,
    ),
    q(
      'q4',
      `Come si dice «cellulare» in Argentina?`,
      [`celular`, `móvil`, `ordenador`, `mando`],
      0,
      `Celular è la parola americana; móvil è usata in Spagna. Le altre due parole indicano altri oggetti.`,
    ),
    q(
      'q5',
      `Come si pronuncia <i>gracias</i> con seseo?`,
      [`[GRA-ssias]`, `[GRA-thias]`, `[GRA-cias]`, `[GRA-chias]`],
      0,
      `Con seseo la c prima di i suona come una s sorda italiana (trascritta ss). Con th si ha la distinción tipica della Spagna centrale e settentrionale.`,
    ),
    q(
      'q6',
      `Cosa significa <i>coger</i> in Argentina e Messico?`,
      [`Ha un senso volgare: da evitare`, `Prendere l'autobus`, `Raccogliere i fiori`, `Afferrare un libro`],
      0,
      `In Spagna è un verbo normale, in questi paesi è una parola volgare: meglio usare tomar o agarrar.`,
    ),
    q(
      'q7',
      `Come si dice «frigorifero» in Argentina?`,
      [`heladera`, `nevera`, `refrigerador`, `frigorífico`],
      0,
      `Heladera è la parola argentina (e uruguaiana). Nevera è di Spagna e Caraibi, refrigerador del Messico e frigorífico della Spagna: tutte esistono, ma non sono la forma argentina.`,
    ),
    q(
      'q8',
      `Quale caratteristica è tipica di Caraibi e Andalusia?`,
      [`Aspirazione della -s finale`, `Voseo`, `Distinción th`, `Pronuncia sc di ll`],
      0,
      `La s finale diventa una h debole (los amigos → loh amigoh). Il voseo è diffuso anche in America centrale e in parte della Colombia; la sc di ll è tipica del Río de la Plata.`,
    ),
  ],
  [
    card(`c1`, `Voseo: forme`, `-ar → -ás (hablás); -er → -és (comés); -ir → -ís (vivís). ser: sos.`),
    card(`c2`, `Imperativo con vos`, `hablá, comé, viví, decí, vení`),
    card(`c3`, `ustedes in America`, `Sostituisce vosotros: ustedes hablan, ustedes quieren.`),
    card(`c4`, `Hoy comí / Hoy he comido`, `America: pretérito (hoy comí). Spagna: perfecto (hoy he comido).`),
    card(`c5`, `Seseo / distinción`, `Seseo: z, ce, ci = s. Distinción: z, ce, ci = th inglese (Spagna).`),
    card(
      `c6`,
      `Yeísmo / sheísmo`,
      `ll = y = i consonantica («ieri»): calle [KA-ye]. In Argentina e Uruguay: sc di scena, calle [KA-sce].`,
    ),
    card(
      `c7`,
      `Aspirazione della -s`,
      `Caraibi, Cile, Andalusia: los amigos [loh a-MI-goh] (la h finale è un soffio, non la jota).`,
    ),
    card(`c8`, `coche / carro / auto`, `coche (ES, anche MX) · carro (MX, CO) · auto (AR)`),
    card(`c9`, `ordenador / computadora / computador`, `ordenador (ES) · computadora (MX, AR) · computador (CO, CL)`),
    card(`c10`, `patata / papa`, `patata (ES) · papa (America e Canarie)`),
    card(`c11`, `conducir / manejar`, `conducir (ES) · manejar (America)`),
    card(`c12`, `coger`, `Spagna: prendere. Messico, Argentina: volgare; usa tomar o agarrar.`),
  ],
  [
    prac(
      `p1`,
      `Riscrivi con vos: «Tú tienes razón y tú hablas muy bien.»`,
      `Vos tenés razón y vos hablás muy bien. Note: le forme di voseo sono accentate sulla desinenza.`,
    ),
    prac(
      `p2`,
      `Traduci come in America: «Voi avete già mangiato?»`,
      `¿Ustedes ya comieron? Note: ustedes + 3ª plurale; pretérito invece di perfecto.`,
    ),
    prac(
      `p3`,
      `Traduci per un cliente messicano: «Parcheggia l'auto qui.»`,
      `Estaciona el carro aquí. (o estacione el carro, con usted). Note: estacionar e carro invece di aparcar e coche.`,
    ),
    prac(
      `p4`,
      `Trascrivi la pronuncia di «cerveza» con distinción e con seseo.`,
      `Distinción [ther-BE-tha]; seseo [ser-BE-ssa]. Nota: il suono th è l'inglese di "think".`,
    ),
    prac(
      `p5`,
      `Elenca 5 coppie di parole ES/America (cibo e oggetti).`,
      `Esempio: zumo/jugo, patata/papa, melocotón/durazno, gafas/lentes, nevera/heladera o refrigerador.`,
    ),
  ],
)

export const esFalsiamici = mod(
  'es-falsiamici',
  'Falsi amici e interferenze italo-spagnolo',
  'Più di 60 parole traditrici, errori tipici degli italiani, cheat sheet',
  'b2',
  `<p class="lead">Italiano e spagnolo si somigliano troppo: è il motivo degli errori più fossilizzati. Ecco la lista da conoscere, poi un riepilogo delle interferenze grammaticali. Le flashcard ripetono le coppie più importanti.</p>
${PRON_SHORT}
<h3>Parole spagnole che ingannano</h3>
<table><tr><th>Spagnolo</th><th>Significa (non)</th></tr>
<tr><td>burro</td><td>asino (burro it. = mantequilla)</td></tr>
<tr><td>salir</td><td>uscire (salire = subir)</td></tr>
<tr><td>ancho</td><td>largo (largo es. = lungo)</td></tr>
<tr><td>vaso</td><td>bicchiere (vaso it. = jarrón)</td></tr>
<tr><td>caldo</td><td>brodo (caldo it. = caliente)</td></tr>
<tr><td>embarazada</td><td>incinta (imbarazzata = avergonzada)</td></tr>
<tr><td>éxito</td><td>successo (uscita = salida)</td></tr>
<tr><td>fecha</td><td>data (la data = la fecha)</td></tr>
<tr><td>oficina</td><td>ufficio (officina = taller)</td></tr>
<tr><td>ropa</td><td>vestiti (roba = cosas)</td></tr>
<tr><td>misa / mesa</td><td>messa / tavolo (messa = misa)</td></tr>
<tr><td>carta</td><td>lettera, menu (carta = papel)</td></tr>
<tr><td>aceite</td><td>olio (aceto = vinagre)</td></tr>
<tr><td>cuarto</td><td>stanza o quarto (camera = habitación)</td></tr>
<tr><td>cámara</td><td>fotocamera (camera = habitación)</td></tr>
<tr><td>estación</td><td>stazione e stagione</td></tr>
<tr><td>tienda</td><td>negozio (tenda = cortina; da campeggio = tienda de campaña)</td></tr>
<tr><td>colegio</td><td>scuola (collegio = internado)</td></tr>
<tr><td>carrera</td><td>corsa e laurea</td></tr>
<tr><td>suspender</td><td>bocciare (esame)</td></tr>
<tr><td>aprobar</td><td>promuovere / passare l'esame</td></tr>
<tr><td>contestar</td><td>rispondere (contestare = protestar)</td></tr>
<tr><td>pretender</td><td>aspirare a (pretendere = exigir)</td></tr>
<tr><td>probar</td><td>assaggiare, provare (indossare)</td></tr>
<tr><td>sentir</td><td>sentire (emozione); udire = oír</td></tr>
<tr><td>mirar</td><td>guardare (mirare = apuntar)</td></tr>
<tr><td>guardar</td><td>conservare (guardare = mirar)</td></tr>
<tr><td>esperar</td><td>sperare e aspettare</td></tr>
<tr><td>tirar</td><td>buttare (tirare = tirar de, jalar)</td></tr>
<tr><td>buscar</td><td>cercare (cerca = vicino)</td></tr>
<tr><td>tardar</td><td>impiegare (tardare = llegar tarde)</td></tr>
<tr><td>pedir</td><td>chiedere (cosa); preguntar = domanda</td></tr>
<tr><td>quedar</td><td>restare, darsi appuntamento</td></tr>
<tr><td>restar</td><td>sottrarre (restare = quedarse)</td></tr>
<tr><td>encontrar</td><td>trovare (incontrare = encontrarse con / ver; darsi appuntamento = quedar)</td></tr>
<tr><td>asistir</td><td>essere presente (assistere = ayudar)</td></tr>
<tr><td>caro</td><td>costoso (caro, affetto = querido)</td></tr>
<tr><td>lástima</td><td>peccato (pecado = peccato religioso)</td></tr>
<tr><td>vacaciones</td><td>vacanze (sempre plurale)</td></tr>
<tr><td>pescado</td><td>pesce (cibo); pez = pesce vivo</td></tr>
<tr><td>bolso / bolsa</td><td>borsa da donna / sacchetto</td></tr>
<tr><td>propina</td><td>mancia</td></tr>
<tr><td>cola</td><td>coda (fila): hacer cola</td></tr>
<tr><td>dirección</td><td>indirizzo e direzione</td></tr>
<tr><td>vecino</td><td>vicino di casa (vicino = cerca)</td></tr>
<tr><td>pelar</td><td>sbucciare (pelare = desplumar)</td></tr>
<tr><td>curar / cuidar</td><td>guarire / curare, prendersi cura</td></tr>
<tr><td>pavo</td><td>tacchino (pavone = pavo real)</td></tr>
<tr><td>constipado</td><td>raffreddato (stitico = estreñido)</td></tr>
<tr><td>nudo</td><td>nodo (nudo it. = desnudo)</td></tr>
<tr><td>camino</td><td>strada, cammino (camino it. = chimenea)</td></tr>
<tr><td>molestar</td><td>disturbare (molestare = acosar)</td></tr>
<tr><td>pegar</td><td>picchiare, incollare (pagare = pagar)</td></tr>
<tr><td>sembrar</td><td>seminare (sembrare = parecer)</td></tr>
<tr><td>sentarse</td><td>sedersi (sentirsi = sentirse)</td></tr>
<tr><td>lindo</td><td>carino (lindo it. = limpio)</td></tr>
<tr><td>guapo</td><td>bello, di bell'aspetto (guappo = fanfarrón)</td></tr>
<tr><td>atender</td><td>servire, assistere un cliente (attendere = esperar)</td></tr>
<tr><td>gracioso</td><td>divertente, spiritoso (grazioso = bonito)</td></tr>
<tr><td>novela</td><td>romanzo (novella = cuento)</td></tr>
<tr><td>cartera</td><td>portafoglio (cartella = carpeta)</td></tr>
<tr><td>demandar</td><td>fare causa a (domandare = preguntar)</td></tr></table>
<h3>Avverbi e parole piccole</h3>
<ul><li><b>Ancora</b>: <i>todavía/aún</i> (ancora = finora), <i>otra vez, de nuevo</i> (di nuovo), <i>más</i> (ancora un po'). <b>Mai</b>: <i>nunca</i>; nelle domande <i>alguna vez</i> («Sei mai stato…» = <i>¿Has estado alguna vez…?</i>).</li><li><b>Subito</b> = <i>enseguida</i>. <b>Prima/dopo</b> = <i>antes/después</i>. <b>Anche</b> = <i>también</i>; <b>nemmeno</b> = <i>ni siquiera</i>.</li><li><b>Pronto?</b> al telefono = <i>¿Diga?</i> / <i>¿Dígame?</i> (Messico: <i>¿Bueno?</i>). <i>Pronto</i> = presto (ora/presto).</li></ul>
<h3>Cheat sheet: errori tipici</h3>
<ul><li><b>Articolo e possessivo</b>: <i>mi casa</i> (non <i>*la mi casa</i>).</li><li><b>A personal</b>: <i>Veo a María</i>, non <i>*veo María</i>; <i>Busco un libro</i> (senza a).</li><li><b>Età e stati</b>: <i>Tengo 30 años</i>, <i>tengo hambre/sed/frío/miedo</i>, <i>hace calor/frío</i> (non <i>*soy 30</i>, <i>*es caldo</i>).</li><li><b>Gustar</b>: <i>Me gustan los libros</i> (concorda con la cosa).</li><li><b>Muy/mucho</b>: <i>muy + aggettivo/avverbio</i>, <i>mucho</i> con verbo o nome: <i>muy grande</i>, <i>mucho dinero</i>.</li><li><b>Doppia negazione</b>: <i>No veo a nadie.</i></li><li><b>Hay</b> = c'è/ci sono (invariabile), <b>estar</b> per la posizione.</li><li><b>Generi</b>: <i>la mano, el día, el problema, el idioma, el mapa, el sistema, la leche, la sal, el mar, la flor, el color</i>.</li><li><b>Accenti</b>: <i>sí/si, tú/tu, él/el, más/mas, té/te, mí/mi, dé/de</i>.</li><li><b>Punteggiatura</b>: <i>¿?</i> e <i>¡!</i> aperti e chiusi.</li></ul>
<div class="say"><b>Cosa dire.</b> «Estoy embarazada de tres meses. Tengo mucha vergüenza. ¿Dónde está la estación?» (Sono incinta di tre mesi. Mi vergogno molto. Dov'è la stazione?)</div>`,
  [
    q(
      'q1',
      `Cosa significa <i>embarazada</i>?`,
      [`Incinta`, `Imbarazzata`, `Arrabbiata`, `Stanca`],
      0,
      `Embarazada vuol dire incinta. L'italiano imbarazzata si dice avergonzada o cohibida: è il falso amico più noto.`,
    ),
    q(
      'q2',
      `Come si dice «salire sull'autobus»?`,
      [`subir al autobús`, `salir al autobús`, `entrar al autobús`, `pujar el autobús`],
      0,
      `Subir è salire, salir è uscire. Chi traduce letteralmente dice salir e dice invece "uscire dall'autobus".`,
    ),
    q(
      'q3',
      `Cosa significa <i>vaso</i> in spagnolo?`,
      [`Bicchiere`, `Pentola`, `Barattolo`, `Piatto`],
      0,
      `Vaso è il bicchiere per bere (un vaso de agua). La pentola si dice olla, il barattolo bote o tarro, il piatto plato; il vaso da fiori è jarrón o florero.`,
    ),
    q(
      'q4',
      `«Il burro» in spagnolo è…`,
      [`la mantequilla`, `el burro`, `la manteca de vaca`, `el aceite`],
      0,
      `Il burro alimentare è la mantequilla. El burro è l'asino, e l'olio è aceite: tre errori possibili.`,
    ),
    q(
      'q5',
      `Come si dice «Sei mai stato in Spagna?»`,
      [
        `¿Has estado alguna vez en España?`,
        `¿Has estado nunca en España?`,
        `¿Estuviste mai en España?`,
        `¿Eres jamás en España?`,
      ],
      0,
      `Nelle domande "mai" si traduce con alguna vez. ¿Has estado nunca…? esiste ma suona poco naturale e ricalca l'italiano: preferisci alguna vez.`,
    ),
    q(
      'q6',
      `Cosa significa <i>suspender un examen</i>?`,
      [`Essere bocciati`, `Sospendere l'esame`, `Rimandare l'esame`, `Passare l'esame`],
      0,
      `Suspender nel contesto scolastico indica un voto insufficiente. Passare l'esame si dice aprobar.`,
    ),
    q(
      'q7',
      `Come si dice «Ho venti anni»?`,
      [`Tengo veinte años`, `Soy de veinte años`, `Tengo de veinte años`, `Estoy con veinte años`],
      0,
      `In spagnolo l'età si esprime con tener, come in italiano con avere. Soy de e estoy con sono calchi da altre lingue, e tengo de mescola il verbo giusto con una preposizione inutile.`,
    ),
    q(
      'q8',
      `Quale frase è corretta?`,
      [`Veo a María`, `Veo María`, `Veo de María`, `Veo la María`],
      0,
      `Davanti a un complemento oggetto di persona determinata serve la a personal. Senza è un errore frequente tra gli italiani.`,
    ),
    q(
      'q9',
      `Come si legge <i>ancho</i>?`,
      [`[AN-cio]`, `[AN-ko]`, `[AN-ho]`, `[AN-sho]`],
      0,
      `La ch spagnola suona come la c italiana di cena e di ciao. Non è un suono duro come la ch italiana di chiesa.`,
    ),
  ],
  [
    card(`c1`, `burro · salir · ancho · vaso · caldo`, `asino · uscire · largo · bicchiere · brodo`),
    card(`c2`, `embarazada · éxito · fecha · oficina · ropa`, `incinta · successo · data · ufficio · vestiti`),
    card(`c3`, `mesa · misa · carta · aceite · cuarto`, `tavolo · messa · lettera/menu · olio · stanza/quarto`),
    card(
      `c4`,
      `tienda · colegio · carrera · estación · cámara`,
      `negozio · scuola · corsa/laurea · stazione/stagione · fotocamera`,
    ),
    card(
      `c5`,
      `suspender · aprobar · contestar · pretender · probar`,
      `bocciare · promuovere · rispondere · aspirare a · assaggiare/provare`,
    ),
    card(
      `c6`,
      `sentir · oír · mirar · guardar · esperar`,
      `sentire (emozione) · udire · guardare · conservare · sperare/aspettare`,
    ),
    card(
      `c7`,
      `tirar · buscar · tardar · pedir · preguntar`,
      `buttare · cercare · impiegare · chiedere (cosa) · chiedere (domanda)`,
    ),
    card(
      `c8`,
      `quedar · restar · encontrar · asistir · caro`,
      `restare/darsi appuntamento · sottrarre · trovare · essere presente · costoso`,
    ),
    card(
      `c9`,
      `lástima · pecado · vacaciones · pescado · pez`,
      `peccato (dispiacere) · peccato (religioso) · vacanze · pesce (cibo) · pesce (vivo)`,
    ),
    card(
      `c10`,
      `bolso · bolsa · propina · cola · dirección`,
      `borsa da donna · sacchetto · mancia · coda/fila · indirizzo/direzione`,
    ),
    card(
      `c11`,
      `vecino · pelar · curar · cuidar · pavo`,
      `vicino di casa · sbucciare · guarire · prendersi cura · tacchino`,
    ),
    card(`c12`, `¿Has estado alguna vez…?`, `Sei mai stato…? (nelle domande "mai" = alguna vez)`),
    card(`c13`, `Tengo 30 años · tengo hambre`, `Ho 30 anni · ho fame (tener, mai ser/estar)`),
    card(`c14`, `a personal`, `Veo a María. Si usa davanti a un complemento di persona determinata.`),
    card(`c15`, `todavía · otra vez · más`, `ancora (finora) · ancora (di nuovo) · ancora (un po' di più)`),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Sono arrivato tardi alla stazione e ho perso il treno.»`,
      `Llegué tarde a la estación y perdí el tren. Note: estación = stazione; llegar tarde, non tardar.`,
    ),
    prac(
      `p2`,
      `Correggi: «Mi piace la burro con pane.»`,
      `Me gusta la mantequilla con pan. Il burro è mantequilla; el burro è l'asino.`,
    ),
    prac(
      `p3`,
      `Traduci: «Ho venti anni e ho molta fame.»`,
      `Tengo veinte años y tengo mucha hambre. Note: tener per età e fame; mucha concorda con hambre (femminile, si dice "mucha hambre").`,
    ),
    prac(
      `p4`,
      `Traduci: «Ho sentito un rumore ma non vedo nessuno.»`,
      `He oído un ruido, pero no veo a nadie. Note: oír per udire; a personal con nadie; doppia negazione.`,
    ),
    prac(
      `p5`,
      `Scegli la parola giusta: «Ho ___ (chiesto) un favore a mio fratello e lui mi ha ___ (chiesto) dove ero.»`,
      `Le he pedido un favor a mi hermano y él me ha preguntado dónde estaba. Pedir per una richiesta, preguntar per una domanda.`,
    ),
  ],
)
