import { card, mod, prac, q } from '../kit'

// Spanish course, A2: pronouns, imperative, por/para and prepositions.
// Pronunciation convention: see the header of spagnolo.a.ts ([ ] = Italian-based, STRESS in capitals, th, h, ss, gn, dh).

export const esPronomi = mod(
  'es-pronomi',
  'Pronomi complemento',
  'Diretti, indiretti, riflessivi, doppi (se lo), posizione, leísmo, a mí me gusta',
  'a2',
  `<p class="lead">I pronomi complemento sono vicini a quelli italiani (mi, ti, lo, la), ma hanno posizione e regole proprie: niente «ci» e «ne», il doppio pronome «se lo» al posto di «glielo», e il leísmo spagnolo. Pronunce con la convenzione del corso. Le forme dell'imperativo (<i>dime, cómpralo, no me lo digas</i>) compaiono qui solo come esempi di posizione dei pronomi: si studiano nel modulo seguente.</p>
<h3>Tre serie</h3>
<table><tr><th>Persona</th><th>Diretto</th><th>Indiretto</th><th>Riflessivo</th></tr>
<tr><td>yo</td><td>me</td><td>me</td><td>me</td></tr>
<tr><td>tú</td><td>te</td><td>te</td><td>te</td></tr>
<tr><td>él / ella / usted</td><td>lo, la</td><td>le</td><td>se</td></tr>
<tr><td>nosotros</td><td>nos</td><td>nos</td><td>nos</td></tr>
<tr><td>vosotros</td><td>os</td><td>os</td><td>os</td></tr>
<tr><td>ellos / ustedes</td><td>los, las</td><td>les</td><td>se</td></tr>
</table>
<p>Il <b>diretto</b> risponde a «chi? che cosa?»: <b>Lo veo</b> [lo BE-o] (lo vedo), <b>La conozco</b> [la ko-NOTH-ko]. L'<b>indiretto</b> a «a chi?»: <b>Le doy el libro</b> [le DOI el LI-bro] (gli/le do il libro). Il <b>riflessivo</b> torna sul soggetto: <b>Me lavo</b> [me LA-bo]. Per le cose femminili si usa <b>la</b>: <b>La compro</b> (la casa → la compro).</p>
<h3>Posizione</h3>
<ul><li><b>Prima del verbo coniugato</b>: <b>Lo hago</b> [lo A-go], <b>No te oigo</b>.</li><li><b>Con infinito o gerundio</b>: prima dell'ausiliare <b>oppure</b> attaccato: <b>Lo quiero ver</b> = <b>Quiero verlo</b> [KIE-ro BER-lo]; <b>Lo estoy comiendo</b> = <b>Estoy comiéndolo</b> [es-TOI ko-MIEN-do-lo]. Il gerundio con pronome vuole la tilde (comiéndolo, hablándole [a-BLAN-do-le]); l'infinito no (verlo, comprarlo [kom-PRAR-lo]).</li><li><b>Imperativo affermativo</b>: attaccato (<b>cómpralo</b> [KOM-pra-lo], <b>dime</b> [DI-me]); <b>negativo</b>: prima (<b>no lo compres</b>). Come si forma l'imperativo lo vedi nel modulo dopo; qui ti serve solo sapere dove vanno i pronomi.</li></ul>
<h3>Doppio pronome</h3>
<p>Ordine fisso: <b>indiretto + diretto</b> (<b>me lo dices</b> [me lo DI-thes]). Quando l'indiretto è di terza persona (<b>le, les</b>) e segue <b>lo, la, los, las</b>, diventa <b>se</b>: <b>Le doy el libro → Se lo doy</b> [se lo DOI] (glielo do). Mai «le lo». <b>Se</b> è ambiguo (a lui, a lei, a Lei, a loro): si chiarisce con <b>a Ana</b>: <b>Se lo doy a Ana</b>. Con l'imperativo: <b>Dámelo</b> [DA-me-lo], <b>Dáselo</b> [DA-sse-lo]; la tilde mantiene l'accento sulla stessa sillaba.</p>
<table><tr><th>Italiano</th><th>Spagnolo</th><th>Pronuncia</th></tr>
<tr><td>me lo dai</td><td>me lo das</td><td>[me lo DAS]</td></tr>
<tr><td>glielo dico</td><td>se lo digo</td><td>[se lo DI-go]</td></tr>
<tr><td>dammelo</td><td>dámelo</td><td>[DA-me-lo]</td></tr>
<tr><td>non dirmelo</td><td>no me lo digas</td><td>[no me lo DI-gas]</td></tr>
<tr><td>ce l'ho</td><td>lo tengo</td><td>[lo TEN-go]</td></tr>
</table>
<h3>Raddoppio dell'indiretto</h3>
<p>Se compare il nome dell'indiretto, si aggiunge comunque <b>le/les</b>: <b>Le di el libro a Ana</b>, <b>Les escribo a mis padres</b>. Nel diretto, se l'oggetto è prima del verbo, si ripete: <b>El libro lo compré ayer</b>.</p>
<h3>A mí me gusta, conmigo</h3>
<p>I pronomi tonici sono: <b>mí</b>, <b>ti</b>, <b>él / ella / usted</b>, <b>nosotros</b>, <b>vosotros</b>, <b>ellos</b>. <b>A mí me gusta</b>, <b>para ti</b> [PA-ra TI], <b>sin ti</b>. Con <b>con</b>: <b>conmigo</b> [kon-MI-go], <b>contigo</b> [kon-TI-go], <b>consigo</b>. Dopo <b>entre, según, excepto, incluso</b> si usano yo/tú: <b>entre tú y yo</b>.</p>
<h3>Leísmo</h3>
<p>In Spagna centrale e settentrionale per il diretto maschile di persona si usa spesso <b>le</b> invece di <b>lo</b>: <b>Le vi ayer</b> (a Juan). La RAE accetta questo <b>leísmo</b> di persona maschile singolare; non accetta <b>laísmo</b> (<b>la dije</b> per «le dije a ella») né <b>loísmo</b>. In America si dice <b>lo vi</b>. Per le cose è sempre <b>lo/la</b>: <b>El libro lo leí</b>.</p>
<h3>Trappole per un italiano</h3>
<ul><li><b>Ci</b> e <b>ne</b> non esistono: «ci vado» → <b>voy allí</b> [a-YI]; «ne voglio tre» → <b>quiero tres</b>; «ne ho» → <b>tengo</b> (o <b>de eso</b>). «Ce n'è» → <b>hay</b>.</li><li>«Lo so» → <b>Lo sé</b>; «gli ho detto» → <b>le dije</b>; «mi piace» → <b>me gusta</b>.</li><li><b>Se</b> ha altri usi: impersonale o passivo: <b>Se habla español</b> [se A-bla es-pa-GNOL], <b>Se vende casa</b>.</li><li>Con verbi riflessivi + infinito il pronome concorda: <b>Voy a lavarme</b> / <b>Me voy a lavar</b>; mai «voy a lavarse».</li></ul>
<div class="say"><b>Da dire.</b> «¿Me lo puedes traer? Te lo agradezco mucho. Si no lo tienes, dímelo y se lo pido a Ana.» [me lo PUE-dhes tra-ER. te lo a-gra-DHETH-ko MU-cio. si no lo TIE-nes, DI-me-lo i se lo PI-dho a A-na]</div>`,
  [
    q(
      'q1',
      'Come dici «lo vedo» (il libro)?',
      ['Lo veo', 'Le veo', 'Se veo', 'Lo vedo'],
      0,
      "Il diretto maschile è lo; le sarebbe l'indiretto, anche se alcuni spagnoli lo usano per persone (leísmo) e vedo non esiste.",
    ),
    q(
      'q2',
      'Come dici «glielo do» (il libro a Ana)?',
      ['Se lo doy', 'Le lo doy', 'Lo le doy', 'Se le doy'],
      0,
      "Con lo/la/los/las il pronome indiretto di terza persona diventa se: mai «le lo» nonostante l'italiano «glielo».",
    ),
    q(
      'q3',
      'Come dici «voglio vederlo»?',
      ['Quiero verlo', 'Quiero lo ver', 'Quiero vérlo', 'Lo quiero verlo'],
      0,
      "Il pronome si attacca all'infinito (verlo, senza tilde) oppure sta prima di quiero (Lo quiero ver), non in mezzo.",
    ),
    q(
      'q4',
      'Come dici «dammelo» (tú)?',
      ['Dámelo', 'Damelo', 'Dame lo', 'Dalo me'],
      0,
      "L'imperativo attacca i pronomi e per mantenere l'accento su da- aggiunge la tilde: dámelo, esdrújula.",
    ),
    q(
      'q5',
      'Come dici «con me»?',
      ['conmigo', 'con mí', 'con yo', 'con me'],
      0,
      'Con + mí/ti/sí si fonde in conmigo, contigo, consigo; «con yo» non esiste e me non si usa dopo preposizione.',
    ),
    q(
      'q6',
      "Cos'è «Le vi ayer» detto da un madrileno parlando di Juan?",
      [
        'leísmo di persona maschile, accettato dalla RAE',
        'un errore grave e mai accettato',
        'una forma femminile di cortesia',
        'un plurale con valore enfatico',
      ],
      0,
      'In Spagna le per il diretto maschile di persona è molto diffuso e la RAE lo ammette; in America si dice lo vi.',
    ),
    q(
      'q7',
      'Come dici «ne ho tre»?',
      ['Tengo tres', 'Tengo ne tres', 'Me tengo tres', 'Tengo de tres'],
      0,
      'Lo spagnolo non ha il pronome «ne»: il numero basta, il sostantivo è sottinteso dal contesto.',
    ),
    q(
      'q8',
      'Come dici «non dirmelo» (tú)?',
      ['No me lo digas', 'No dímelo', 'No dime lo', 'No me lo dices'],
      0,
      "Nell'imperativo negativo i pronomi vanno prima del verbo e il verbo è al congiuntivo: no me lo digas.",
    ),
    q(
      'q9',
      "Dove cade l'accento di «comiéndolo»?",
      [
        'sulla é: [ko-MIEN-do-lo]',
        'sulla o finale: [ko-mien-do-LO]',
        'sulla prima o: [KO-mien-do-lo]',
        'sulla d: [ko-mien-DO-lo]',
      ],
      0,
      "Il gerundio resta accentato su -ien- e il pronome si aggiunge dopo; la tilde mantiene quell'accento nello scritto.",
    ),
    q(
      'q10',
      'Come si legge «dámelo»?',
      ['[DA-me-lo]', '[da-ME-lo]', '[da-me-LO]', '[DA-ME-lo]'],
      0,
      "La tilde è sulla á: l'accento è sulla prima sillaba; senza tilde sarebbe damelo, con accento su me.",
    ),
  ],
  [
    card('c1', 'Diretti', 'me, te, lo/la, nos, os, los/las: Lo veo [lo BE-o]; La conozco.'),
    card('c2', 'Indiretti', 'me, te, le, nos, os, les: Le doy el libro [le DOI]; Les escribo.'),
    card('c3', 'Riflessivi', 'me, te, se, nos, os, se: Me lavo [me LA-bo]; Se levanta.'),
    card(
      'c4',
      'Posizione',
      "Prima del verbo coniugato; con infinito/gerundio prima dell'ausiliare o attaccato; imperativo + attaccato.",
    ),
    card('c5', 'Se lo doy', 'Le/les + lo/la/los/las → se: Se lo doy (glielo do). Mai le lo.'),
    card('c6', 'Ordine doppio', 'Indiretto + diretto: me lo das, te lo digo, nos lo dan.'),
    card(
      'c7',
      'Imperativo + pronomi',
      "Dámelo [DA-me-lo], cómpralo [KOM-pra-lo]: attaccati; la tilde mantiene l'accento.",
    ),
    card('c8', 'conmigo, contigo', '[kon-MI-go], [kon-TI-go]: con + mí/ti. Entre tú y yo.'),
    card('c9', 'Leísmo', 'Spagna: le vi ayer (a Juan) accettato per maschile di persona; laísmo e loísmo no.'),
    card('c10', 'Ci e ne', 'Non esistono: voy allí; quiero tres; tengo (de eso).'),
    card('c11', 'comiéndolo, verlo', 'Gerundio + pronome con tilde: [ko-MIEN-do-lo]; infinito senza tilde: [BER-lo].'),
    card(
      'c12',
      'se impersonale',
      'Se habla español, se vende casa: forma impersonale/passiva, non il pronome indiretto.',
    ),
  ],
  [
    prac(
      'p1',
      'Sostituisci i complementi con pronomi: «Doy el libro a Ana», «Compro las flores», «Escribo una carta a mis padres».',
      'Se lo doy (a Ana). / Las compro. / Se la escribo (a mis padres). (indiretto + diretto; se per le/les.)',
    ),
    prac(
      'p2',
      'Traduci: «Dammelo adesso, non dirlo a nessuno, voglio mostrartelo.»',
      'Dámelo ahora, no se lo digas a nadie, quiero mostrártelo (o te lo quiero mostrar). (tilde in dámelo e mostrártelo; se lo digas: negativo, si mantiene se.)',
    ),
    prac(
      'p3',
      'Correggi: «Le lo doy a Marta», «Quiero lo ver», «Voy a lavarse», «Hablando le».',
      'Se lo doy a Marta. / Quiero verlo (o Lo quiero ver). / Voy a lavarme (o Me voy a lavar). / Hablándole (con tilde).',
    ),
    prac(
      'p4',
      'Rispondi con un pronome: «¿Ves la tele?» «¿Comes pan?» «¿Vienes conmigo?» «¿Quieres café?»',
      'Sí, la veo. / Sí, lo como. / Sí, voy contigo. / Sí, lo quiero (o No, no lo quiero). (la tele femminile; con + ti → contigo.)',
    ),
    prac(
      'p5',
      "Spiega a un italiano come dire «ce l'ho» e «ne voglio due».",
      "Ce l'ho → lo tengo (o la tengo): il pronome diretto concorda con l'oggetto. Ne voglio due → quiero dos: lo spagnolo non ha il pronome «ne».",
    ),
  ],
)

export const esImperativo = mod(
  'es-imperativo',
  'Imperativo',
  'Affermativo e negativo (tú, usted, vosotros), irregolari, con pronomi, uso nelle istruzioni',
  'a2',
  `<p class="lead">L'imperativo serve per istruzioni, consigli, richieste e ordini. In spagnolo l'affermativo di tú e vosotros ha forme proprie, mentre usted, ustedes, nosotros e <b>tutto il negativo</b> usano il congiuntivo presente. Pronunce con la convenzione del corso. I pronomi (lo, me, se) li hai visti nel modulo precedente; il congiuntivo presente è qui presentato solo per formare l'imperativo (lo approfondisci in B1).</p>
<h3>Affermativo: tú e vosotros</h3>
<table><tr><th>Verbo</th><th>tú</th><th>vosotros</th></tr>
<tr><td>hablar</td><td>habla [A-bla]</td><td>hablad [a-BLADH]</td></tr>
<tr><td>comer</td><td>come [KO-me]</td><td>comed [ko-MEDH]</td></tr>
<tr><td>escribir</td><td>escribe [es-KRI-be]</td><td>escribid [es-kri-BIDH]</td></tr>
</table>
<p>Il tú affermativo coincide con la <b>3ª persona del presente</b>; vosotros è l'<b>infinito con -d</b> al posto della -r (nei riflessivi senza d: <b>sentaos</b>, <b>levantaos</b>; eccezione <b>idos</b>). Nel parlato spagnolo si sente anche l'infinito come ordine (<b>¡Callaros!</b>), ma nella scrittura formale è ritenuto scorretto.</p>
<h3>Otto irregolari di tú (affermativo)</h3>
<table><tr><th>Verbo</th><th>Imperativo</th><th>Pronuncia</th></tr>
<tr><td>decir</td><td>di</td><td>[DI]</td></tr>
<tr><td>hacer</td><td>haz</td><td>[ATH]</td></tr>
<tr><td>ir</td><td>ve</td><td>[BE]</td></tr>
<tr><td>poner</td><td>pon</td><td>[PON]</td></tr>
<tr><td>salir</td><td>sal</td><td>[SAL]</td></tr>
<tr><td>ser</td><td>sé</td><td>[SE]</td></tr>
<tr><td>tener</td><td>ten</td><td>[TEN]</td></tr>
<tr><td>venir</td><td>ven</td><td>[BEN]</td></tr>
</table>
<p>Esempi: <b>Haz la cama</b> [ATH la KA-ma], <b>Ven aquí</b> [BEN a-KI], <b>Sé amable</b> [SE a-MA-ble], <b>Ten cuidado</b> [TEN kui-DHA-dho]. Nota: <b>sé</b> (imperativo di ser e presente di saber) ha tilde.</p>
<h3>Usted, ustedes, nosotros, e tutto il negativo: congiuntivo presente</h3>
<p>Il congiuntivo presente inverte le vocali: <b>-ar → -e</b>, <b>-er/-ir → -a</b>.</p>
<table><tr><th></th><th>hablar</th><th>comer</th><th>escribir</th></tr>
<tr><td>tú (neg.)</td><td>no hables [no A-bles]</td><td>no comas [no KO-mas]</td><td>no escribas</td></tr>
<tr><td>usted</td><td>hable [A-ble]</td><td>coma [KO-ma]</td><td>escriba [es-KRI-ba]</td></tr>
<tr><td>nosotros</td><td>hablemos [a-BLE-mos]</td><td>comamos [ko-MA-mos]</td><td>escribamos</td></tr>
<tr><td>vosotros (neg.)</td><td>no habléis [no a-BLEIS]</td><td>no comáis [no ko-MAIS]</td><td>no escribáis</td></tr>
<tr><td>ustedes</td><td>hablen [A-blen]</td><td>coman [KO-man]</td><td>escriban</td></tr>
</table>
<p>Per i verbi irregolari la base è la prima persona del presente: <b>tener → tenga, salir → salga, hacer → haga [A-ga], decir → diga [DI-ga], poner → ponga, venir → venga [BEN-ga], traer → traiga, conocer → conozca</b>. Speciali: <b>ser → sea</b> [SSE-a], <b>ir → vaya</b> [BA-ya], <b>estar → esté</b>, <b>saber → sepa</b>, <b>dar → dé</b>. Cambi di spelling: <b>busque</b> [BUS-ke] (buscar), <b>pague</b> [PA-ghe] (pagar), <b>empiece</b> [em-PIE-the] (empezar, anche e→ie).</p>
<ul><li>Usted: <b>Pase</b> [PA-sse] (prego, entri), <b>Siéntese</b> [SIEN-te-sse], <b>Dígame</b> [DI-ga-me] (mi dica), <b>Oiga</b> [OI-ga] (senta, scusi), <b>Perdone</b>, <b>Disculpe</b>.</li><li>Nosotros: <b>Vamos</b> [BA-mos] (andiamo; non vayamos), <b>Hablemos</b>, <b>Comamos</b>. Con riflessivo la s cade: <b>sentémonos</b> [sen-TE-mo-nos].</li></ul>
<h3>Negativo</h3>
<p>Sempre congiuntivo, con <b>no</b>: <b>No hables</b>, <b>No comas</b>, <b>No hagas eso</b> [no A-gas E-sso], <b>No vayas</b> [no BA-yas], <b>No seas tonto</b> [no SSE-as TON-to], <b>No pongas</b>, <b>No salgas</b>, <b>No vengas</b>. <b>Trappola</b>: l'italiano usa l'infinito per il tu negativo («non parlare!»); in spagnolo si usa <b>no hables</b>, mai «no hablar». L'infinito con no compare solo in avvisi: <b>No fumar</b>, <b>Empujar</b>.</p>
<h3>Imperativo e pronomi</h3>
<ul><li>Affermativo: i pronomi si <b>attaccano</b>; la tilde mantiene l'accento: <b>cómpralo</b> [KOM-pra-lo], <b>dímelo</b> [DI-me-lo], <b>siéntate</b> [SIEN-ta-te], <b>lávate</b>, <b>dámelo</b>. Con vosotros riflessivo la d cade: <b>sentaos</b>.</li><li>Negativo: i pronomi vanno <b>prima</b>: <b>no lo compres</b>, <b>no me lo digas</b>, <b>no te sientes</b>, <b>no os vayáis</b>.</li></ul>
<h3>Voseo</h3>
<p>In Argentina, Uruguay e parti dell'America centrale si usa <b>vos</b>: <b>hablá</b> [a-BLA], <b>comé</b> [ko-ME], <b>vení</b> [be-NI], <b>decime</b> [de-SSI-me]. Il negativo è come in tú in molte zone (<b>no hables</b>) ma in altre cambia (<b>no hablés</b>).</p>
<h3>Uso e cortesia</h3>
<p>Istruzioni e ricette: <b>Corte la cebolla y fríala</b> (usted) o <b>Corta</b> (tú). Per attenuare: <b>por favor</b> [por fa-BOR], <b>¿puedes...?</b>, <b>¿Podrías...?</b>, <b>haz el favor de</b>. Interiezioni: <b>¡Mira!</b> [MI-ra], <b>¡Oye!</b> [O-ye], <b>¡Cuidado!</b> [kui-DHA-dho], <b>¡Ánimo!</b> [A-ni-mo].</p>
<div class="say"><b>Da dire.</b> «Ven aquí, siéntate y dime qué pasa. No te preocupes, todo va a salir bien.» [BEN a-KI, SIEN-ta-te i DI-me KE PA-ssa. no te pre-o-KU-pes, TO-dho BA a sa-LIR BIEN]</div>`,
  [
    q(
      'q1',
      "Qual è l'imperativo affermativo di «hablar» per tú?",
      ['habla', 'hables', 'hable', 'hablad'],
      0,
      'Il tú affermativo coincide con la 3ª persona del presente; hables è il negativo, hable è usted, hablad è vosotros.',
    ),
    q(
      'q2',
      'Come dici «fai!» (hacer, tú)?',
      ['haz', 'hace', 'hagas', 'hacé'],
      0,
      "Hacer è irregolare nell'imperativo: haz, con la z finale; hace è la 3ª persona e hagas il negativo.",
    ),
    q(
      'q3',
      'Come dici «non parlare!» (tú)?',
      ['No hables', 'No habla', 'No hablar', 'No hable'],
      0,
      "Il negativo usa il congiuntivo presente: hables. L'infinito (no hablar) compare solo in avvisi scritti.",
    ),
    q(
      'q4',
      'Come dici «venga!» a una persona che dai del Lei?',
      ['Venga', 'Ven', 'Viene', 'Vienga'],
      0,
      'Usted usa il congiuntivo presente: venga, formato dalla prima persona vengo; ven è il tú affermativo.',
    ),
    q(
      'q5',
      'Come dici «dimmelo»?',
      ['Dímelo', 'Dilome', 'Dime lo', 'Díme lo'],
      0,
      "Di + me + lo, attaccati, con la tilde per mantenere l'accento sulla prima sillaba (esdrújula): dímelo.",
    ),
    q(
      'q6',
      'Come dici «non andare via!» (tú, irse)?',
      ['No te vayas', 'No vete', 'No te vas', 'No irse'],
      0,
      'Il negativo vuole il congiuntivo (vayas) e il pronome prima del verbo: no te vayas.',
    ),
    q(
      'q7',
      "Qual è l'imperativo affermativo di «comer» per vosotros?",
      ['comed', 'comer', 'comais', 'coméis'],
      0,
      "L'imperativo di vosotros si ottiene togliendo la -r dell'infinito e mettendo -d: comed.",
    ),
    q(
      'q8',
      'Come dici «siediti!» (tú)?',
      ['Siéntate', 'Sienta te', 'Sientate', 'Siéntete'],
      0,
      "Il pronome si attacca e la tilde mantiene l'accento sulla seconda sillaba, perché sentarse dittonga (siéntate).",
    ),
    q(
      'q9',
      'Come si legge «haz»?',
      ['[ATH]', '[HATH]', '[AS]', '[AZ]'],
      0,
      'La h è muta e la z finale è th in Spagna (s in America); [AZ] con z sonora non esiste.',
    ),
    q(
      'q10',
      "Dove cade l'accento di «cómpralo»?",
      [
        'sulla prima sillaba: [KOM-pra-lo]',
        'sulla seconda: [kom-PRA-lo]',
        "sull'ultima: [kom-pra-LO]",
        'su nessuna sillaba',
      ],
      0,
      "È una esdrújula: la tilde sulla ó mantiene l'accento di compra aggiungendo il pronome lo.",
    ),
  ],
  [
    card('c1', 'tú affermativo', '= 3ª persona presente: habla [A-bla], come, escribe. Negativo: no hables, no comas.'),
    card(
      'c2',
      'vosotros affermativo',
      'Infinito con -d: hablad [a-BLADH], comed, escribid. Riflessivi: sentaos. Eccezione: idos.',
    ),
    card('c3', 'Irregolari di tú', 'di, haz [ATH], ve [BE], pon, sal, sé, ten, ven.'),
    card('c4', 'usted / ustedes', 'Congiuntivo: hable/hablen, coma/coman, escriba/escriban. Pase, siéntese, dígame.'),
    card('c5', 'nosotros', 'Hablemos, comamos, escribamos. Vamos (non vayamos). Sentémonos senza s.'),
    card('c6', 'Negativo', 'Sempre congiuntivo con no: no hables, no vayas [no BA-yas], no seas [no SSE-as].'),
    card(
      'c7',
      'Congiuntivo irregolare',
      'tenga, salga, haga, diga, ponga, venga, traiga, conozca; sea, vaya, esté, sepa, dé.',
    ),
    card('c8', 'Pronomi', 'Affermativo attaccati con tilde (dímelo, cómpralo); negativo prima (no me lo digas).'),
    card('c9', 'No + infinito', 'Solo in avvisi: no fumar, no pasar. Italiano «non parlare» = no hables.'),
    card('c10', 'Voseo', "hablá, comé, vení, decime: accento sull'ultima sillaba. Argentina e Uruguay."),
    card('c11', 'haz, ven, ten', '[ATH], [BEN], [TEN]: monosillabi senza tilde; la z finale è th (America: s).'),
    card('c12', 'sé / se', '[SE] imperativo di ser e presente di saber; [se] pronome senza tilde.'),
  ],
  [
    prac(
      'p1',
      "Scrivi l'imperativo affermativo di tú: hacer, decir, ir, venir, salir, comer, abrir.",
      'haz, di, ve, ven, sal, come, abre.',
    ),
    prac(
      'p2',
      'Trasforma in negativo: «Habla», «Come», «Ve», «Dímelo», «Siéntate».',
      'No hables / No comas / No vayas / No me lo digas / No te sientes.',
    ),
    prac(
      'p3',
      'Dai istruzioni a un cliente (usted): «entrare, sedersi, aspettare un momento, firmare qui».',
      'Pase, siéntese, espere un momento y firme aquí. (Pase [PA-sse], siéntese, espere, firme: tutti congiuntivo presente di usted.)',
    ),
    prac(
      'p4',
      'Traduci: «Non fare rumore, bambini! Andiamo a mangiare e non dimenticate le chiavi.»',
      '¡No hagáis ruido, niños! Vamos a comer y no olvidéis las llaves. (hagáis e olvidéis: negativo di vosotros.)',
    ),
    prac(
      'p5',
      "Scrivi una ricetta in 5 passi con l'imperativo (usted).",
      'Corte la cebolla. Fríala en aceite. Añada el tomate. Cocine diez minutos. Sirva caliente. (Verbi in congiuntivo + pronome attaccato in fríala.)',
    ),
  ],
)

export const esPorpara = mod(
  'es-porpara',
  'Por e para, comparativi, preposizioni, a personale',
  'por vs para, comparativi e superlativi, tanto/tan, preposizioni a/en/de/con/desde/hasta, a personal, perifrasi base',
  'a2',
  `<p class="lead">L'italiano «per» si divide in due: <b>por</b> (causa, mezzo, scambio, passaggio) e <b>para</b> (scopo, destinatario, destinazione, scadenza). Qui si completano anche comparativi, preposizioni e la <b>a personal</b>. Pronunce con la convenzione del corso.</p>
<h3>Para: dove si va, a chi, a che scopo</h3>
<ul><li><b>Scopo</b>: <b>Estudio para aprender</b> [es-TU-dhio PA-ra a-pren-DER]; <b>¿Para qué?</b> [PA-ra KE] (a che scopo?); <b>una taza para café</b>.</li><li><b>Destinatario</b>: <b>un regalo para ti</b> [un rre-GA-lo PA-ra TI]. <b>Para mí</b> = secondo me.</li><li><b>Destinazione</b>: <b>el tren para Madrid</b>; <b>salgo para Roma</b>.</li><li><b>Scadenza</b>: <b>Lo necesito para el viernes</b> [lo ne-the-SSI-to PA-ra el BIER-nes].</li><li><b>Confronto</b>: <b>Para ser niño, habla muy bien</b>. <b>Para siempre</b> [PA-ra SIEM-pre].</li></ul>
<h3>Por: perché, attraverso, in cambio</h3>
<ul><li><b>Causa</b>: <b>Llego tarde por el tráfico</b>; <b>¿Por qué?</b> [por KE]; <b>Gracias por todo</b>.</li><li><b>Mezzo</b>: <b>por teléfono</b> [por te-LE-fo-no], <b>por correo</b>, <b>por avión</b>.</li><li><b>Passaggio</b>: <b>Paso por tu casa</b>, <b>por aquí</b> [por a-KI], <b>por la calle</b>.</li><li><b>Durata/parte del giorno</b>: <b>Trabajo por la mañana</b>, <b>por tres horas</b>.</li><li><b>Prezzo e scambio</b>: <b>Pagué diez euros por el libro</b>; <b>cambié mi coche por una moto</b>.</li><li><b>A favore di, al posto di</b>: <b>Lo hago por ti</b> (per amor tuo). <b>Agente passivo</b>: <b>escrito por Cervantes</b> [ther-BAN-tes]. <b>Per</b>: <b>diez kilómetros por hora</b>, <b>por ciento</b>.</li><li>Locuzioni: <b>por fin</b>, <b>por eso</b>, <b>por ejemplo</b> [por e-HEM-plo], <b>por favor</b>, <b>por supuesto</b>, <b>por cierto</b>, <b>por lo menos</b>, <b>estar por hacer</b> (essere ancora da fare).</li></ul>
<table><tr><th>Frase</th><th>Significato</th></tr>
<tr><td>Lo hice por ti</td><td>l'ho fatto per te (a causa tua, per amore tuo)</td></tr>
<tr><td>Lo hice para ti</td><td>l'ho fatto per te (destinato a te)</td></tr>
<tr><td>Trabajo para una empresa</td><td>lavoro per una ditta (datore di lavoro)</td></tr>
<tr><td>Trabajo por dinero</td><td>lavoro per soldi (motivo)</td></tr>
</table>
<h3>Comparativi e superlativi</h3>
<ul><li><b>Superiorità/inferiorità</b>: <b>más... que</b> [MAS ke], <b>menos... que</b>: <b>Soy más alto que tú</b>. Con numeri: <b>más de diez</b>, <b>menos de cinco</b>.</li><li><b>Uguaglianza</b>: <b>tan + aggettivo/avverbio + como</b>: <b>Es tan alto como yo</b>; <b>tanto/a/os/as + nome + como</b>: <b>Tengo tantos libros como tú</b>; <b>verbo + tanto como</b>.</li><li><b>Irregolari</b>: <b>mejor</b> [me-HOR] (migliore/meglio), <b>peor</b> [pe-OR], <b>mayor</b> [ma-YOR] (più grande d'età), <b>menor</b> [me-NOR]. <b>Mi hermano es mayor que yo</b>. <b>Mayor/menor</b> valgono «più vecchio/più giovane» (nel registro formale anche «maggiore/minore»); per la grandezza fisica si usa <b>más grande / más pequeño</b> (in America <b>más grande</b> vale spesso anche «più vecchio»).</li><li><b>Superlativo relativo</b>: articolo + più + aggettivo + <b>de</b>: <b>el más alto de la clase</b>, <b>la mejor del mundo</b>.</li><li><b>Superlativo assoluto</b>: -<b>ísimo</b>: <b>buenísimo</b> [bue-NI-ssi-mo], <b>riquísimo</b> [rri-KI-ssi-mo], <b>facilísimo</b> [fa-thi-LI-ssi-mo], <b>muchísimo</b> [mu-CI-ssi-mo].</li></ul>
<h3>Preposizioni principali</h3>
<ul><li><b>A</b>: moto verso (<b>voy a Roma</b>), ora (<b>a las ocho</b>), indiretto (<b>le doy el libro a Ana</b>).</li><li><b>En</b>: luogo senza moto (<b>estoy en casa</b>), mezzo (<b>en tren</b>), mese/anno (<b>en mayo</b>), <b>pensar en</b>.</li><li><b>De</b>: origine (<b>soy de Roma</b>), possesso (<b>el libro de Ana</b>), materia, <b>de noche</b> (di notte).</li><li><b>Con</b>: compagnia o strumento (<b>con mi madre</b>, <b>con un cuchillo</b>).</li><li><b>Desde / hasta</b>: <b>desde las ocho hasta las doce</b>; <b>hasta luego</b>.</li><li>Reggenze da imparare: <b>soñar con</b>, <b>casarse con</b>, <b>depender de</b>, <b>enamorarse de</b>, <b>pensar en</b>, <b>llegar a</b>, <b>entrar en</b>. «Sono a casa» è <b>estoy en casa</b>.</li></ul>
<h3>A personal</h3>
<p>Davanti a un complemento oggetto <b>diretto</b> di <b>persona determinata</b> (o di animale amato, o personificato) si mette <b>a</b>: <b>Veo a Marta</b>, <b>Conozco a tu hermano</b>, <b>Quiero a mi perro</b> (voglio bene al mio cane), <b>Cuido a mi gato</b>, <b>¿A quién ves?</b>. L'italiano non ha questa a: è il primo errore da evitare (<i>*Veo Marta</i>).</p>
<ul><li><b>Pronomi di persona indefiniti o interrogativi</b>: <b>quién, alguien, nadie, alguno, ninguno, todos</b> (riferiti a persone) vogliono la a: <b>No conozco a nadie</b>, <b>¿A quién buscas?</b>, <b>Vi a alguien</b>, <b>Conozco a todos</b>. Nel relativo: <b>la chica a quien vi</b> (o a la que vi).</li><li><b>Persona non specifica: niente a</b>. <b>Busco un camarero</b> (uno qualsiasi), ma <b>Busco a un camarero</b> (uno preciso, già in mente). Lo stesso con <b>necesito</b>: <b>Necesito un médico</b> / <b>Necesito al médico</b> (quello che conosco).</li><li><b>Tener</b> non vuole la a: <b>Tengo dos hermanos</b>, <b>Tiene un hijo</b>. Quando c'è un predicativo di stato la a compare: <b>Tengo a mi madre enferma</b> (ho la mamma malata).</li><li><b>Hay</b> non vuole la a: <b>Hay un hombre en la puerta</b>.</li><li><b>Animali e cose</b>: di norma niente a (<b>Vi un perro en la calle</b>, <b>Veo la tele</b>), tranne l'animale-compagno (<b>Quiero a mi perro</b>) o una cosa personificata (letterario: <b>Temo a la muerte</b> è possibile, ma la forma normale è <b>Temo la muerte</b>).</li></ul>
<p>Attenzione: la a personal vale solo per l'<b>oggetto diretto</b>. Non si usa dopo <b>ser</b> né con il soggetto (<b>Vino Pedro</b>). E si ricorda che «vedo lui» è <b>Lo veo</b> (pronome diretto) e «lo dico a lui» <b>Le digo</b> (indiretto): la preposizione compare solo con il nome pieno (<b>Le doy el libro a Ana</b>).</p>
<h3>Verbo + preposizione (reggenze)</h3>
<p>Molti verbi spagnoli reggono una preposizione diversa dall'italiano. Impara <b>verbo + preposizione + esempio</b> come blocco.</p>
<table><tr><th>Verbo</th><th>Esempio</th><th>Italiano</th></tr>
<tr><td>depender de</td><td>Depende de ti.</td><td>Dipende da te.</td></tr>
<tr><td>soñar con</td><td>Sueño con viajar. Soñé contigo.</td><td>Sogno di viaggiare. Ho sognato te.</td></tr>
<tr><td>pensar en</td><td>Pienso en ti.</td><td>Penso a te.</td></tr>
<tr><td>acordarse de</td><td>Me acuerdo de tu nombre.</td><td>Mi ricordo il tuo nome.</td></tr>
<tr><td>fijarse en</td><td>Fíjate en este detalle.</td><td>Guarda (nota) questo dettaglio.</td></tr>
<tr><td>confiar en</td><td>Confío en mis amigos.</td><td>Mi fido dei miei amici.</td></tr>
<tr><td>casarse con</td><td>Se casó con Ana.</td><td>Ha sposato Ana (si è sposato con).</td></tr>
<tr><td>enamorarse de</td><td>Se enamoró de Lucía.</td><td>Si è innamorato di Lucía.</td></tr>
<tr><td>quejarse de</td><td>Se queja del ruido.</td><td>Si lamenta del rumore.</td></tr>
<tr><td>preocuparse por</td><td>Me preocupo por ti.</td><td>Mi preoccupo per te.</td></tr>
<tr><td>consistir en</td><td>Consiste en tres partes.</td><td>Consiste di (in) tre parti.</td></tr>
<tr><td>insistir en</td><td>Insiste en pagar él.</td><td>Insiste per pagare lui.</td></tr>
<tr><td>tardar en</td><td>Tardó una hora en llegar.</td><td>Ci ha messo un'ora ad arrivare.</td></tr>
<tr><td>oler a / saber a</td><td>Huele a pan. Sabe a limón.</td><td>Sa di pane. Sa di limone.</td></tr>
<tr><td>reírse de</td><td>Se ríe de todo.</td><td>Ride di tutto.</td></tr>
<tr><td>dudar de</td><td>Dudo de su honestidad.</td><td>Dubito della sua onestà.</td></tr>
<tr><td>enfadarse con</td><td>Me enfadé con él.</td><td>Mi sono arrabbiato con lui.</td></tr>
<tr><td>parecerse a</td><td>Se parece a su padre.</td><td>Somiglia a suo padre.</td></tr>
<tr><td>acostumbrarse a</td><td>Me acostumbré al frío.</td><td>Mi sono abituato al freddo.</td></tr>
<tr><td>entrar en</td><td>Entro en la sala.</td><td>Entro nella sala (in America anche entrar a).</td></tr>
<tr><td>despedirse de</td><td>Me despedí de ellos.</td><td>Li ho salutati (congedati).</td></tr>
<tr><td>participar en</td><td>Participo en el curso.</td><td>Partecipo al corso.</td></tr>
<tr><td>asistir a</td><td>Asistí a la reunión.</td><td>Ho partecipato alla riunione (in italiano si direbbe «assistere a»; <i>asistir a un enfermo</i> invece è «assistere» nel senso di curare).</td></tr>
<tr><td>ocuparse de</td><td>Me ocupo de la cena.</td><td>Mi occupo della cena.</td></tr>
<tr><td>darse cuenta de</td><td>Me di cuenta de que faltaba.</td><td>Mi sono accorto che mancava.</td></tr>
<tr><td>tratar de / tratarse de</td><td>Trato de dormir. Se trata de ti.</td><td>Cerco di dormire. Si tratta di te.</td></tr></table>
<ul><li><b>Verbi senza preposizione</b> in spagnolo, dove l'italiano spesso la sceglie: <b>esperar el autobús</b> (aspettare l'autobus), <b>buscar las llaves</b>, <b>escuchar música</b>, <b>mirar la tele</b>, <b>pagar la cuenta</b>. Con una persona entra in gioco la a personal: <b>Espero a Marta</b>, <b>Busco a mi hermano</b>.</li><li><b>Darse cuenta de que</b> e <b>acordarse de que</b> vogliono sempre <b>de</b> davanti a que (<b>Me di cuenta de que…</b>); invece <b>pensar que</b>, <b>creer que</b>, <b>decir que</b> mai (<b>Creo que…</b>, non <i>*creo de que</i>).</li><li><b>Pensar en</b> (pensare a qualcuno) ≠ <b>pensar que</b> (pensare che) ≠ <b>pensar + infinito</b> (avere intenzione di: <b>Pienso ir</b>).</li></ul>
<h3>Perifrasi di base</h3>
<table><tr><th>Perifrasi</th><th>Esempio</th><th>Significato</th></tr>
<tr><td>ir a + inf.</td><td>Voy a comer</td><td>sto per / intendo</td></tr>
<tr><td>tener que + inf.</td><td>Tengo que irme</td><td>devo</td></tr>
<tr><td>acabar de + inf.</td><td>Acabo de llegar</td><td>sono appena</td></tr>
<tr><td>volver a + inf.</td><td>Volví a llamar</td><td>ho richiamato</td></tr>
<tr><td>empezar a + inf.</td><td>Empieza a llover</td><td>comincia a</td></tr>
<tr><td>seguir + gerundio</td><td>Sigo trabajando</td><td>continuo a</td></tr>
<tr><td>llevar + gerundio</td><td>Llevo dos años viviendo aquí</td><td>da due anni</td></tr>
<tr><td>soler + inf.</td><td>Suelo desayunar a las siete</td><td>di solito</td></tr>
<tr><td>dejar de + inf.</td><td>Dejé de fumar</td><td>ho smesso di</td></tr>
</table>
<div class="say"><b>Da dire.</b> «Gracias por tu ayuda. Este regalo es para ti. Estudio para el examen, pero estoy más cansado que ayer.» [GRA-thias por tu a-YU-dha. ES-te rre-GA-lo es PA-ra TI. es-TU-dhio PA-ra el ek-SA-men, PE-ro es-TOI mas kan-SSA-dho ke a-YER]</div>`,
  [
    q(
      'q1',
      'Come dici «lo studio per imparare»?',
      ['Lo estudio para aprender', 'Lo estudio por aprender', 'Lo estudio a aprender', 'Lo estudio de aprender'],
      0,
      "Para introduce lo scopo di un'azione, davanti all'infinito; por indicherebbe una causa, che qui non c'è.",
    ),
    q(
      'q2',
      "Come dici «grazie per l'aiuto»?",
      ['Gracias por la ayuda', 'Gracias para la ayuda', 'Gracias de la ayuda', 'Gracias a la ayuda'],
      0,
      "Il motivo del ringraziamento è una causa: por. Para indicherebbe a che cosa serve l'aiuto.",
    ),
    q(
      'q3',
      'Come dici «un regalo per te» (destinatario)?',
      ['un regalo para ti', 'un regalo por ti', 'un regalo a ti', 'un regalo en ti'],
      0,
      'Il destinatario di un oggetto si introduce con para; por ti significherebbe «a causa tua» o «al posto tuo».',
    ),
    q(
      'q4',
      'Come dici «lavoro per Google» (datore di lavoro)?',
      ['Trabajo para Google', 'Trabajo por Google', 'Trabajo a Google', 'Trabajo de Google'],
      0,
      'Il datore di lavoro è il destinatario del lavoro: para. Con por indicheresti il motivo, ad esempio il denaro.',
    ),
    q(
      'q5',
      'Come dici «ho pagato dieci euro per il libro»?',
      [
        'Pagué diez euros por el libro',
        'Pagué diez euros para el libro',
        'Pagué diez euros de el libro',
        'Pagué diez euros en el libro',
      ],
      0,
      "Prezzo e scambio si esprimono con por; para indicherebbe il fine per cui hai pagato, non l'oggetto acquistato.",
    ),
    q(
      'q6',
      'Come dici «più alto di me»?',
      ['más alto que yo', 'más alto de yo', 'más alto como yo', 'más alto que mí'],
      0,
      'Il secondo termine del comparativo di superiorità è introdotto da que e dopo que si usa il pronome soggetto: yo.',
    ),
    q(
      'q7',
      'Come dici «vedo Marta»?',
      ['Veo a Marta', 'Veo Marta', 'Veo de Marta', 'Veo en Marta'],
      0,
      'Il complemento oggetto di persona determinata vuole la a personale: veo a Marta.',
    ),
    q(
      'q8',
      'Quale frase è corretta?',
      ['Tengo dos hermanos', 'Tengo a dos hermanos', 'Tengo de dos hermanos', 'Tengo en dos hermanos'],
      0,
      "Con tener (come con hay) la a personale non si usa, anche se l'oggetto è una persona.",
    ),
    q(
      'q9',
      'Come dici «il più alto della classe»?',
      ['el más alto de la clase', 'el más alto en la clase', 'el más alto que la clase', 'lo más alto de la clase'],
      0,
      'Il superlativo relativo si forma con articolo + más + aggettivo + de + gruppo; que serve solo al comparativo e lo è neutro, non concorda con una persona.',
    ),
    q(
      'q10',
      'Come si legge «mejor»?',
      ['[me-HOR]', '[me-GIOR]', '[ME-hor]', '[me-YOR]'],
      0,
      "La j è la jota (h raschiata), l'accento è sull'ultima sillaba: né la g molle italiana né una y.",
    ),
    q(
      'q11',
      'Come si legge «buenísimo»?',
      ['[bue-NI-ssi-mo]', '[bue-ni-SI-mo]', '[BUE-ni-si-mo]', '[bue-NI-zi-mo]'],
      0,
      "La tilde segnala l'accento sulla í; la s è sorda (ss) come sempre, mai sonora come nel nord Italia.",
    ),
    q(
      'q12',
      'Come si legge «¿Para qué?»',
      ['[PA-ra KE]', '[pa-RA KE]', '[PA-ra KUE]', '[PAR-a-KE]'],
      0,
      'Para ha accento sulla prima sillaba e qué si legge con k e e: la u di qu è muta.',
    ),
    q(
      'q13',
      'Come dici «non conosco nessuno qui»?',
      ['No conozco a nadie aquí', 'No conozco nadie aquí', 'No conozco de nadie aquí', 'No conozco en nadie aquí'],
      0,
      'Nadie è una persona e oggetto diretto, quindi vuole la a personal: a nadie. Senza la a la frase suona incompleta a un madrelingua.',
    ),
    q(
      'q14',
      'Come dici «dipende da te»?',
      ['Depende de ti', 'Depende a ti', 'Depende por ti', 'Depende en ti'],
      0,
      'Depender regge de, come il da italiano; a, por o en sono calchi di altre reggenze e non esistono con questo verbo.',
    ),
    q(
      'q15',
      'Come dici «ho sognato di vivere al mare»?',
      [
        'Soñé con vivir junto al mar',
        'Soñé de vivir junto al mar',
        'Soñé en vivir junto al mar',
        'Soñé vivir junto al mar',
      ],
      0,
      'Soñar regge con (soñar con algo); de è la preposizione italiana e en appartiene a pensar. Senza preposizione il verbo non regge.',
    ),
    q(
      'q16',
      'Cerchi una segretaria qualsiasi. Quale frase è giusta?',
      ['Busco una secretaria', 'Busco a una secretaria', 'Busco de una secretaria', 'Busco por una secretaria'],
      0,
      'Persona non determinata: niente a personal. Busco a una secretaria indicherebbe una persona precisa; de e por non si usano con buscar.',
    ),
    q(
      'q17',
      "Come dici «aspetto l'autobus»?",
      ['Espero el autobús', 'Espero al autobús', 'Espero del autobús', 'Espero para el autobús'],
      0,
      'Esperar è transitivo: oggetto diretto senza preposizione. La a personal serve solo con le persone, non con un autobus.',
    ),
  ],
  [
    card(
      'c1',
      'para',
      'Scopo, destinatario, destinazione, scadenza, confronto: para aprender; para ti; para Madrid; para el viernes.',
    ),
    card(
      'c2',
      'por',
      'Causa, mezzo, passaggio, prezzo/scambio, durata, agente: por el tráfico; por teléfono; por aquí; pagué por.',
    ),
    card('c3', '¿Por qué? / ¿Para qué?', 'Causa (perché?) vs scopo (a che scopo?): [por KE] / [PA-ra KE].'),
    card('c4', 'más que / más de', 'Más que + secondo termine; más de + numero: más de diez; más alto que yo.'),
    card(
      'c5',
      'tan / tanto',
      'tan + agg./avv. + como; tanto/a/os/as + nome + como: tan alto como tú; tantos libros como tú.',
    ),
    card('c6', 'Comparativi irregolari', 'mejor [me-HOR], peor [pe-OR], mayor [ma-YOR], menor [me-NOR].'),
    card('c7', 'Superlativo', 'el más alto de la clase; -ísimo: buenísimo [bue-NI-ssi-mo], muchísimo [mu-CI-ssi-mo].'),
    card('c8', 'A personal', 'Veo a Marta; no con tener ni hay: Tengo dos hermanos; Busco un camarero.'),
    card('c9', 'en / a', 'Estoy en casa, voy a casa; en tren, en mayo; pensar en; llegar a.'),
    card('c10', 'Reggenze', 'soñar con, casarse con, depender de, enamorarse de, pensar en.'),
    card(
      'c11',
      'Perifrasi',
      'ir a, tener que, acabar de, volver a, empezar a, seguir + gerundio, llevar + gerundio, soler, dejar de.',
    ),
    card('c12', 'mejor [me-HOR]', 'J = h raschiata: mejor, jamás [ha-MAS], viaje [BIA-he], trabajo [tra-BA-ho].'),
    card(
      'c13',
      'A personal: senza a',
      'Tener e hay (Tengo dos hermanos), persona indeterminata (Busco un camarero), cose e animali comuni (Vi un perro).',
    ),
    card(
      'c14',
      'A personal: sempre con a',
      'quién, alguien, nadie, alguno, ninguno, todos: No conozco a nadie. ¿A quién ves? Anche animale amato: Quiero a mi perro.',
    ),
    card(
      'c15',
      "Reggenze diverse dall'italiano",
      'soñar con (sognare), pensar en (pensare a), fijarse en, confiar en, casarse con, acordarse de, depender de, asistir a (essere presente).',
    ),
    card(
      'c16',
      'darse cuenta de que',
      'Me di cuenta de que faltaba (con de). Invece creo que, pienso que, digo que: mai de.',
    ),
  ],
  [
    prac(
      'p1',
      'Scegli por o para: «Gracias ___ venir», «Es un regalo ___ mi madre», «Salimos ___ Madrid mañana», «Lo compré ___ diez euros», «Necesito el informe ___ el lunes».',
      'Gracias por venir (causa). Es un regalo para mi madre (destinatario). Salimos para Madrid (destinazione). Lo compré por diez euros (prezzo). Necesito el informe para el lunes (scadenza).',
    ),
    prac(
      'p2',
      'Traduci: «Mia sorella è più grande di me. È la più simpatica della famiglia e ha tanti amici come me.»',
      "Mi hermana es mayor que yo. Es la más simpática de la familia y tiene tantos amigos como yo. (mayor per l'età; la más ... de; tantos ... como.)",
    ),
    prac(
      'p3',
      'Metti la a personale dove serve: «Veo ___ tu hermana», «Tengo ___ dos primos», «Busco ___ un cuchillo», «Quiero ___ mi gato».',
      'Veo a tu hermana. / Tengo dos primos (nessuna a). / Busco un cuchillo (nessuna). / Quiero a mi gato (animale amato).',
    ),
    prac(
      'p4',
      'Correggi: «Gracias para tu ayuda», «Soy más alto de ti», «Estoy a casa», «Pienso a mi familia», «Trabajo por una empresa».',
      'Gracias por tu ayuda. / Soy más alto que tú. / Estoy en casa. / Pienso en mi familia. / Trabajo para una empresa.',
    ),
    prac(
      'p5',
      'Scrivi 5 frasi sulla tua giornata con almeno una perifrasi diversa per frase.',
      'Suelo levantarme a las siete. Acabo de desayunar. Tengo que ir al trabajo. Después voy a estudiar español. Llevo dos años aprendiendo idiomas.',
    ),
    prac(
      'p6',
      'Correggi: «Sueño de viajar», «Me acuerdo a ti», «Confío a mi amigo», «Veo nadie», «Espero a el autobús».',
      'Sueño con viajar. / Me acuerdo de ti. / Confío en mi amigo. / No veo a nadie. / Espero el autobús (niente a personal con le cose).',
    ),
    prac(
      'p7',
      'Completa con la preposizione giusta (o nessuna): «Depende ___ ti», «Se casó ___ Ana», «Me fijé ___ su reloj», «Escucho ___ música», «Se parece ___ su madre».',
      'Depende de ti. / Se casó con Ana. / Me fijé en su reloj. / Escucho música (nessuna). / Se parece a su madre.',
    ),
    prac(
      'p8',
      "Traduci: «Aspetto Marta da un'ora e non vedo nessuno. Penso a lei e mi preoccupo.»",
      "Llevo una hora esperando a Marta y no veo a nadie. Pienso en ella y me preocupo (por ella). Note: a personal con Marta e nadie; pensar en; llevar + gerundio per «da un'ora».",
    ),
    prac(
      'p9',
      'Spiega la differenza: «Busco un médico» / «Busco al médico» e traducile.',
      'Busco un médico = cerco un medico (uno qualsiasi, persona indeterminata, niente a). Busco al médico = cerco il medico (quello specifico che conosco, a personal).',
    ),
  ],
)
