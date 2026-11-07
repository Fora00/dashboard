import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// Spanish course, extra grammar modules (completeness round 1): es-relativi (b1) and es-funciones (b2).

export const esRelativi = mod(
  'es-relativi',
  'Relativi, reggenze verbo + preposizione, dequeísmo',
  'Que, el que, quien, donde, lo que; 40 verbi con preposizione; pensar que / alegrarse de que',
  'b1',
  `<p class="lead">Le frasi relative collegano due frasi con un pronome (<i>che, il quale, dove</i>). In spagnolo la regola base è semplice: <b>que</b> per tutto. Le difficoltà sono due: la preposizione deve stare <b>prima</b> del relativo, e ogni verbo ha la sua preposizione fissa, quasi mai uguale all'italiano.</p>
${PRON_SHORT}
<h3>Que, el que, quien: i pronomi base</h3>
<table><tr><th>Forma</th><th>Uso</th><th>Esempio</th></tr>
<tr><td>que</td><td>soggetto o oggetto, persona o cosa, senza preposizione</td><td>El libro que leo. La chica que vive aquí.</td></tr>
<tr><td>prep. + el/la/los/las que</td><td>dopo preposizione, persona o cosa</td><td>La casa en la que vivo. El chico con el que hablo.</td></tr>
<tr><td>prep. + quien/quienes</td><td>solo persone, dopo preposizione</td><td>La chica con quien hablo. Los amigos a quienes escribo.</td></tr>
<tr><td>el que, la que, los que, las que</td><td>«colui che»</td><td>Los que llegaron tarde no entraron.</td></tr>
<tr><td>lo que</td><td>ciò che</td><td>Lo que dices es verdad.</td></tr>
<tr><td>lo cual</td><td>il che (riferito a tutta la frase)</td><td>Llegó tarde, lo cual no me sorprende.</td></tr>
<tr><td>donde, adonde</td><td>luogo</td><td>La ciudad donde nací. El sitio adonde voy.</td></tr>
<tr><td>cuyo, cuya, cuyos, cuyas</td><td>il cui; concorda con la cosa posseduta</td><td>El hombre cuyo hijo vive aquí.</td></tr>
<tr><td>cuanto/a/os/as</td><td>tutto quello che</td><td>Haz cuanto puedas.</td></tr>
</table>
<p>Altri esempi: <i>El día en que nací</i> [el DI-a en ke na-THI] (il giorno in cui sono nato), <i>la forma en que habla</i> (il modo in cui parla), <i>la razón por la que vine</i> (il motivo per cui sono venuto). <b>Cui</b> in italiano = <i>en que, con quien, de la que...</i>: la preposizione resta quella richiesta dal verbo.</p>
<h3>Con o senza virgola</h3>
<p>La relativa <b>restrittiva</b> (senza virgola) delimita il nome: <i>Los estudiantes que estudian aprueban.</i> (solo quelli che studiano). La <b>esplicativa</b> (tra virgole) aggiunge un'informazione: <i>Los estudiantes, que estudian, aprueban.</i> (tutti studiano e tutti passano). Dopo preposizione con la virgola preferisci <i>el cual / la cual / quien</i>: <i>Mi tío, con quien vivo, es médico.</i> Se l'antecedente è sconosciuto o inesistente si usa il congiuntivo: <i>Busco a alguien que hable español</i> (non so se esiste) contro <i>Conozco a alguien que habla español</i>.</p>
<h3>Trappole sui relativi</h3>
<ul><li>La preposizione precede sempre il relativo: <i>la persona con la que hablé</i> (non «la persona que hablé con»).</li><li>Non ripetere il pronome: <i>la casa que compré</i> (non «la casa que la compré»).</li><li>Con un complemento diretto di persona: <i>la mujer a la que vi</i> / <i>la mujer que vi</i>; la forma <i>a quien</i> è più formale.</li><li>«Quello che» = <i>lo que</i> (cosa) o <i>el que</i> (persona): <i>No entiendo lo que dices.</i> / <i>El que habla es mi jefe.</i></li></ul>
<h3>Verbo + preposizione: 40 reggenze da sapere</h3>
<table><tr><th>Spagnolo</th><th>Italiano</th></tr>
<tr><td>soñar con</td><td>sognare (di)</td></tr>
<tr><td>pensar en</td><td>pensare a</td></tr>
<tr><td>pensar de</td><td>avere un'opinione su (¿Qué piensas de...?)</td></tr>
<tr><td>depender de</td><td>dipendere da</td></tr>
<tr><td>confiar en</td><td>fidarsi di</td></tr>
<tr><td>creer en</td><td>credere in</td></tr>
<tr><td>casarse con</td><td>sposarsi con</td></tr>
<tr><td>acordarse de</td><td>ricordarsi di</td></tr>
<tr><td>olvidarse de</td><td>dimenticarsi di</td></tr>
<tr><td>preocuparse por</td><td>preoccuparsi per</td></tr>
<tr><td>quejarse de</td><td>lamentarsi di</td></tr>
<tr><td>enamorarse de</td><td>innamorarsi di</td></tr>
<tr><td>fijarse en</td><td>notare, fare caso a</td></tr>
<tr><td>darse cuenta de</td><td>rendersi conto di</td></tr>
<tr><td>jugar a</td><td>giocare a</td></tr>
<tr><td>interesarse por</td><td>interessarsi a</td></tr>
<tr><td>ocuparse de</td><td>occuparsi di</td></tr>
<tr><td>hablar con</td><td>parlare con / a</td></tr>
<tr><td>entrar en</td><td>entrare in</td></tr>
<tr><td>salir de</td><td>uscire da</td></tr>
<tr><td>llegar a</td><td>arrivare a</td></tr>
<tr><td>empezar a / comenzar a</td><td>cominciare a</td></tr>
<tr><td>terminar de / acabar de</td><td>finire di / avere appena (acabo de llegar)</td></tr>
<tr><td>dejar de</td><td>smettere di</td></tr>
<tr><td>tratar de</td><td>cercare di</td></tr>
<tr><td>tratarse de</td><td>trattarsi di</td></tr>
<tr><td>insistir en</td><td>insistere su</td></tr>
<tr><td>consistir en</td><td>consistere in</td></tr>
<tr><td>servir para</td><td>servire a</td></tr>
<tr><td>tardar en</td><td>metterci (tempo)</td></tr>
<tr><td>asistir a</td><td>assistere a, partecipare a</td></tr>
<tr><td>participar en</td><td>partecipare a</td></tr>
<tr><td>contar con</td><td>contare su</td></tr>
<tr><td>carecer de</td><td>mancare di</td></tr>
<tr><td>alegrarse de</td><td>essere contento di</td></tr>
<tr><td>acostumbrarse a</td><td>abituarsi a</td></tr>
<tr><td>parecerse a</td><td>assomigliare a</td></tr>
<tr><td>renunciar a</td><td>rinunciare a</td></tr>
<tr><td>enseñar a / aprender a</td><td>insegnare a / imparare a</td></tr>
<tr><td>ayudar a</td><td>aiutare a</td></tr>
</table>
<p>Senza preposizione (diversa dall'italiano): <b>conseguir / lograr + inf.</b> (riuscire a: <i>Logré aprobar</i>), <b>decidir + inf.</b> (decidere di), <b>esperar + inf.</b> (sperare di), <b>prometer + inf.</b> (promettere di), <b>pensar + inf.</b> (pensare di), <b>necesitar + nome</b> (avere bisogno di), <b>buscar</b> (cercare), <b>pedir</b> (chiedere). Lo spagnolo ha anche <b>pensar en</b> (pensare a) ma <b>pensar que</b> (credere che): <i>Pienso que tienes razón.</i></p>
<h3>Dequeísmo e queísmo</h3>
<p>Davanti a <b>que</b> (completiva) alcuni verbi vogliono <b>de</b> e altri no. Due errori diffusi:</p>
<ul><li><b>Dequeísmo</b>: aggiungere de dove non serve. <i>Pienso de que vendrá.</i> → <b>Pienso que vendrá.</b> Anche: <i>Creo de que..., Dijo de que..., Me parece de que...</i></li><li><b>Queísmo</b>: togliere de dove serve. <i>Me alegro que vengas.</i> → <b>Me alegro de que vengas.</b> <i>Me acuerdo que..., Estoy seguro que...</i> sono errati.</li></ul>
<p><b>Test pratico</b>: sostituisci la frase con «eso». Se serve <i>de eso</i>, serve <i>de que</i>: <i>Me alegro de eso → me alegro de que</i>. <i>Pienso eso → pienso que</i>.</p>
<table><tr><th>Senza de</th><th>Con de</th></tr>
<tr><td>pensar que, creer que, decir que, opinar que, parecer que, saber que</td><td>alegrarse de que, acordarse de que, darse cuenta de que, estar seguro de que, olvidarse de que, enterarse de que, convencer de que, quejarse de que</td></tr>
<tr><td>es necesario que, es mejor que, es posible que</td><td>es hora de que, antes de que, después de que, a pesar de que, con tal de que</td></tr>
</table>
<p>Altre reggenze con <b>en que</b>: <i>insistir en que, confiar en que, consistir en que, quedar en que</i> (restare d'accordo che). <i>Quedamos en que vendrías.</i></p>
<h3>Infinito o congiuntivo?</h3>
<p>Se soggetto principale e secondario sono <b>lo stesso</b>, si usa l'infinito; se sono <b>diversi</b>, <i>que</i> + congiuntivo: <i>Quiero venir</i> / <i>Quiero que vengas</i>; <i>Espero llegar pronto</i> / <i>Espero que llegues pronto</i>; <i>Me alegro de verte</i> / <i>Me alegro de que vengas</i>; <i>Antes de salir, llama</i> / <i>Antes de que salgas, llama</i>; <i>Lo hago para ayudar</i> / <i>Lo hago para que ayudes</i>.</p>
<div class="say"><b>Da ricordare.</b> «Mai una preposizione dopo il relativo, sempre prima; e se la frase con que sostituisce "eso" richiede de, scrivi de que.» <i>La persona de la que me hablaste es la que vive allí.</i> [la per-SSO-na de la ke me a-BLAS-te es la ke BI-be a-YI]</div>`,
  [
    q(
      'q1',
      'Quale frase è corretta: «La persona con cui ho parlato è lì»?',
      [
        'La persona con la que hablé está allí.',
        'La persona que hablé con está allí.',
        'La persona con que hablé está allí.',
        'La persona que hablé con ella está allí.',
      ],
      0,
      "La preposizione deve stare davanti al relativo, che qui prende l'articolo: con la que. Spostarla in fondo è un calco dall'inglese.",
    ),
    q(
      'q2',
      "Quale relativo concorda con la cosa posseduta in «L'uomo il cui figlio è medico»?",
      [
        'El hombre cuyo hijo es médico',
        'El hombre cuya hijo es médico',
        'El hombre que su hijo es médico',
        'El hombre quien hijo es médico',
      ],
      0,
      'Cuyo concorda con il nome che segue (hijo, maschile singolare), non con il possessore. Que su ... è colloquiale e meno corretto.',
    ),
    q(
      'q3',
      'Quale frase corregge il dequeísmo?',
      ['Pienso que vendrá.', 'Pienso de que vendrá.', 'Pienso en que vendrá.', 'Pienso a que vendrá.'],
      0,
      'Pensar che regge direttamente que: la de è superflua. Pensar en que si userebbe solo con il significato di «pensare a».',
    ),
    q(
      'q4',
      'Quale frase corregge il queísmo?',
      ['Me alegro de que vengas.', 'Me alegro que vengas.', 'Me alegro en que vengas.', 'Me alegro por que vengas.'],
      0,
      "Alegrarse regge de: eliminarla è un errore di queísmo. Por que sarebbe un'altra parola (per cui) e non è corretto qui.",
    ),
    q(
      'q5',
      'Come si dice «Sognare di viaggiare»?',
      ['Soñar con viajar', 'Soñar de viajar', 'Soñar en viajar', 'Soñar a viajar'],
      0,
      "Il verbo soñar regge con, non de. L'italiano «sognare di» porta a sbagliare.",
    ),
    q(
      'q6',
      'Che cosa significa «No entiendo lo que dices»?',
      ['Non capisco ciò che dici', 'Non capisco la persona che dici', 'Non capisco se dici', 'Non capisco quanto dici'],
      0,
      'Lo que è il relativo neutro («ciò che»). Per riferirsi a una persona (colui che) servirebbe el que o quien.',
    ),
    q(
      'q7',
      'Quale verbo non vuole la preposizione per «riuscire a»?',
      ['conseguir aprobar', 'conseguir a aprobar', 'conseguir de aprobar', 'conseguir en aprobar'],
      0,
      "Conseguir (e lograr) reggono direttamente l'infinito. L'italiano «riuscire a» spinge a inserire a, ma lo spagnolo non lo vuole.",
    ),
    q(
      'q8',
      "Quale frase usa il congiuntivo perché l'antecedente non è noto?",
      [
        'Busco a alguien que hable español.',
        'Conozco a alguien que habla español.',
        'Tengo un amigo que habla español.',
        'Esa chica habla español.',
      ],
      0,
      'Con un antecedente non specifico o possibile (non so se esiste) la relativa vuole il congiuntivo. Le altre frasi descrivono qualcosa di reale.',
    ),
    q(
      'q9',
      'Come si traduce «mi ricordo che hai ragione»?',
      [
        'Me acuerdo de que tienes razón.',
        'Me acuerdo que tienes razón.',
        'Me acuerdo en que tienes razón.',
        'Me acuerdo por que tienes razón.',
      ],
      0,
      "Acordarse regge de anche davanti a que: l'omissione è queísmo. Se non sei sicuro, sostituisci con «eso»: me acuerdo de eso.",
    ),
    q(
      'q10',
      "Quale frase usa l'infinito perché il soggetto è lo stesso?",
      ['Quiero comer ahora.', 'Quiero que comas ahora.', 'Quiero que como ahora.', 'Quiero de que comas.'],
      0,
      "Con un solo soggetto si usa l'infinito (quiero comer). Con soggetti diversi serve que + congiuntivo, come in quiero que comas.",
    ),
  ],
  [
    card('c1', 'que', 'Relativo universale senza preposizione: el libro que leo, la chica que vive aquí.'),
    card(
      'c2',
      'prep. + el/la que, quien',
      'La preposizione sta PRIMA: la casa en la que vivo; la chica con quien hablo.',
    ),
    card('c3', 'lo que / lo cual', 'lo que = ciò che; lo cual = il che (riferito a tutta la frase).'),
    card('c4', 'cuyo, cuya', 'Il cui: concorda con la cosa posseduta (el hombre cuyo hijo...).'),
    card('c5', 'donde / adonde', 'Dove: la ciudad donde nací; adonde = verso dove (el sitio adonde voy).'),
    card(
      'c6',
      'soñar con, pensar en, depender de',
      "Reggenze diverse dall'italiano: sognare di, pensare a, dipendere da.",
    ),
    card('c7', 'conseguir / lograr + inf.', 'Riuscire a: senza preposizione (Logré aprobar).'),
    card('c8', 'acabar de + inf.', 'Aver appena fatto: Acabo de llegar (sono appena arrivato).'),
    card('c9', 'dequeísmo', 'de que dove non serve: *Pienso de que → Pienso que.'),
    card('c10', 'queísmo', 'que senza de dove serve: *Me alegro que → Me alegro de que.'),
    card('c11', "test dell'eso", 'Se «de eso» va bene, scrivi de que (alegrarse, acordarse, darse cuenta).'),
    card(
      'c12',
      'infinito o que + subj.',
      'Stesso soggetto: infinito (quiero venir); soggetti diversi: que + congiuntivo.',
    ),
  ],
  [
    prac(
      'p1',
      'Unisci con un relativo: La chica vive aquí. / Hablé con la chica. / El libro es de mi hermano. Leo el libro.',
      'La chica que vive aquí. / La chica con la que (o con quien) hablé. / El libro que leo es de mi hermano. (la preposizione sta prima del relativo).',
    ),
    prac(
      'p2',
      'Traduci: «La città dove sono nato», «Il motivo per cui sono venuto», «Il giorno in cui ci siamo conosciuti».',
      'La ciudad donde nací. / La razón por la que vine. / El día en que nos conocimos.',
    ),
    prac(
      'p3',
      'Completa con la preposizione: Sueño ___ viajar. Pienso ___ ti. Depende ___ ti. Me caso ___ Marta. Insisto ___ que vengas.',
      'Sueño con viajar. Pienso en ti. Depende de ti. Me caso con Marta. Insisto en que vengas.',
    ),
    prac(
      'p4',
      'Correggi: «Creo de que tienes razón», «Me alegro que vengas», «Estoy seguro que lo hará», «Dijo de que no venía».',
      'Creo que tienes razón. / Me alegro de que vengas. / Estoy seguro de que lo hará. / Dijo que no venía.',
    ),
    prac(
      'p5',
      'Traduci: «Sono riuscito a finire», «Ho deciso di partire», «Spero di vederti presto», «Ho smesso di fumare».',
      'Conseguí (o logré) terminar. / Decidí irme (o salir). / Espero verte pronto. / Dejé de fumar.',
    ),
    prac(
      'p6',
      'Scegli infinito o congiuntivo: «Me alegro de ___ (verte / que vengas)», «Quiero ___ (que descanses / descansar)».',
      'Me alegro de verte (stesso soggetto) / Me alegro de que vengas (soggetti diversi). Quiero descansar (io) / Quiero que descanses (tu).',
    ),
  ],
)

export const esFunciones = mod(
  'es-funciones',
  'Funciones comunicativas e modi di dire',
  'Consigli, permessi, inviti, scuse, reclami, accordo, ipotesi; 29 espressioni e proverbi',
  'b2',
  `<p class="lead">All'esame e nella vita non basta la grammatica: serve sapere <b>cosa dire</b> per chiedere, consigliare, rifiutare con garbo. Ecco le formule dell'esame B1-B2, ognuna con il suo tono, e una lista di modi di dire e proverbi con l'equivalente italiano.</p>
${PRON_SHORT}
<h3>Dare un consiglio</h3>
<ul><li><b>Yo que tú</b> + condizionale: <i>Yo que tú iría al médico.</i> (Io al tuo posto andrei dal medico)</li><li><b>Deberías / Podrías</b> + infinito: <i>Deberías descansar.</i></li><li><b>Te aconsejo / Te recomiendo que</b> + congiuntivo: <i>Te recomiendo que pruebes el gazpacho.</i></li><li><b>Lo mejor sería</b> + infinito: <i>Lo mejor sería esperar.</i></li><li><b>¿Por qué no</b> + presente?: <i>¿Por qué no hablas con él?</i></li><li><b>Si yo fuera tú</b>, + condizionale: <i>Si yo fuera tú, no lo compraría.</i></li></ul>
<h3>Chiedere e dare un permesso</h3>
<table><tr><th>Domanda</th><th>Risposta</th></tr>
<tr><td>¿Puedo abrir la ventana?</td><td>Sí, claro. / Adelante. / Por supuesto.</td></tr>
<tr><td>¿Te importa si abro la ventana?</td><td>No, no me importa. / Mejor no, hace frío.</td></tr>
<tr><td>¿Le molesta que fume?</td><td>Sí, me molesta. / Lo siento, está prohibido.</td></tr>
<tr><td>¿Me permite pasar?</td><td>Pase, pase.</td></tr>
</table>
<p>Dopo <i>¿Te importa si...?</i> si usa l'indicativo presente; dopo <i>¿Te molesta que...?</i> il congiuntivo. <b>Ojo</b>: la risposta <i>No, no me importa</i> significa «puoi farlo» (non mi disturba).</p>
<h3>Invitare, accettare, rifiutare</h3>
<ul><li><b>Invitar</b>: <i>¿Te apetece ir al cine?</i> [te a-pe-TE-the ir al THI-ne] · <i>¿Quieres venir a cenar?</i> · <i>¿Qué te parece si salimos?</i> · <i>Te invito yo.</i> (offro io)</li><li><b>Accettare</b>: <i>Me encantaría.</i> · <i>Con mucho gusto.</i> · <i>Vale, de acuerdo.</i></li><li><b>Rifiutare con garbo</b>: <i>Me gustaría, pero no puedo.</i> · <i>Lo siento, ya tengo planes.</i> · <i>Otro día, quizá.</i></li></ul>
<h3>Scusarsi e rispondere</h3>
<table><tr><th>Scusa</th><th>Risposta</th></tr>
<tr><td>Perdón. / Perdona (tú) / Perdone (usted)</td><td>No pasa nada.</td></tr>
<tr><td>Lo siento mucho.</td><td>No te preocupes.</td></tr>
<tr><td>Siento llegar tarde.</td><td>No importa.</td></tr>
<tr><td>Lamento mucho que no pudieras venir.</td><td>No hay problema.</td></tr>
<tr><td>Fue sin querer.</td><td>Tranquilo, no pasa nada.</td></tr>
</table>
<h3>Lamentarsi e reclamare</h3>
<ul><li><b>Quisiera presentar una queja.</b> (Vorrei presentare un reclamo)</li><li><b>Me han cobrado de más.</b> (Mi hanno fatto pagare in più)</li><li><b>Esto es inaceptable.</b> / <b>Me parece fatal que</b> + congiuntivo.</li><li><b>Quiero hablar con el responsable.</b> / <b>¿Podría darme la hoja de reclamaciones?</b> (modulo ufficiale in Spagna)</li><li><b>Exijo una solución / un reembolso.</b></li></ul>
<h3>Accordo e disaccordo</h3>
<table><tr><th>D'accordo</th><th>Non d'accordo</th></tr>
<tr><td>Estoy de acuerdo.</td><td>No estoy de acuerdo.</td></tr>
<tr><td>Tienes razón.</td><td>No tienes razón. / No lo veo así.</td></tr>
<tr><td>Exacto. / Eso es.</td><td>Al contrario. / Ni hablar.</td></tr>
<tr><td>Sin duda. / Por supuesto.</td><td>Tengo mis dudas.</td></tr>
<tr><td>Hasta cierto punto.</td><td>Depende.</td></tr>
</table>
<p><b>Ni hablar</b> = neanche per sogno (rifiuto forte). Per opinare: <i>Creo que</i> + indicativo, <i>No creo que</i> + congiuntivo, <i>Desde mi punto de vista</i>, <i>En mi opinión</i>.</p>
<h3>Ipotesi e probabilità</h3>
<ul><li><b>A lo mejor</b> + indicativo: <i>A lo mejor llueve.</i></li><li><b>Quizá / Tal vez</b> + indicativo (più certo) o congiuntivo (più dubbio).</li><li><b>Puede que</b> + congiuntivo: <i>Puede que llegue tarde.</i></li><li><b>Futuro di probabilità</b>: <i>Serán las diez.</i> (saranno le dieci); <i>Estará en casa.</i></li><li><b>Deber de</b> + inf.: <i>Debe de estar cansado.</i> (sarà stanco)</li></ul>
<h3>Chiedere con cortesia</h3>
<p><i>¿Podría ayudarme?</i> · <i>¿Sería tan amable de abrir la puerta?</i> · <i>Quisiera reservar una mesa.</i> · <i>Le agradecería que me enviara la factura.</i> Grazie: <i>Gracias</i> → <i>De nada</i> / <i>No hay de qué</i>.</p>
<h3>29 modi di dire e proverbi</h3>
<table><tr><th>Spagnolo</th><th>Italiano</th></tr>
<tr><td>costar un ojo de la cara [kos-TAR un O-ho de la KA-ra]</td><td>costare un occhio della testa</td></tr>
<tr><td>estar en las nubes [es-TAR en las NU-bes]</td><td>avere la testa tra le nuvole</td></tr>
<tr><td>tomar el pelo [to-MAR el PE-lo]</td><td>prendere in giro</td></tr>
<tr><td>hablar por los codos [a-BLAR por los KO-dhos]</td><td>parlare a raffica</td></tr>
<tr><td>ser pan comido [ser pan ko-MI-dho]</td><td>essere una passeggiata</td></tr>
<tr><td>dar calabazas [dar ka-la-BA-thas]</td><td>dare il due di picche</td></tr>
<tr><td>meter la pata [me-TER la PA-ta]</td><td>fare una gaffe</td></tr>
<tr><td>estar hecho polvo [es-TAR E-cio POL-bo]</td><td>essere a pezzi</td></tr>
<tr><td>no tener pelos en la lengua [no te-NER PE-los en la LEN-gua]</td><td>non avere peli sulla lingua</td></tr>
<tr><td>ponerse las pilas [po-NER-se las PI-las]</td><td>darsi una mossa</td></tr>
<tr><td>echar una mano [e-CIAR u-na MA-no]</td><td>dare una mano</td></tr>
<tr><td>estar sin blanca [es-TAR sin BLAN-ka]</td><td>essere al verde</td></tr>
<tr><td>hacer la vista gorda [a-THER la BIS-ta GOR-dha]</td><td>chiudere un occhio</td></tr>
<tr><td>armar un lío [ar-MAR un LI-o]</td><td>creare un caos</td></tr>
<tr><td>tirar la casa por la ventana [ti-RAR la KA-ssa por la ben-TA-na]</td><td>spendere senza badare a spese</td></tr>
<tr><td>dormir como un lirón [dor-MIR KO-mo un li-RON]</td><td>dormire come un ghiro</td></tr>
<tr><td>estar como una cabra [es-TAR KO-mo u-na KA-bra]</td><td>essere matto</td></tr>
<tr><td>ser uña y carne [ser U-gna i KAR-ne]</td><td>essere culo e camicia</td></tr>
<tr><td>a caballo regalado no le mires el diente [a ka-BA-yo rre-ga-LA-dho no le MI-res el DIEN-te]</td><td>a caval donato non si guarda in bocca</td></tr>
<tr><td>más vale tarde que nunca [mas BA-le TAR-de ke NUN-ka]</td><td>meglio tardi che mai</td></tr>
<tr><td>ojos que no ven, corazón que no siente [O-hos ke no BEN ko-ra-THON ke no SIEN-te]</td><td>occhio non vede, cuore non duole</td></tr>
<tr><td>no hay mal que por bien no venga [no AI mal ke por BIEN no BEN-ga]</td><td>non tutto il male vien per nuocere</td></tr>
<tr><td>quien mucho abarca, poco aprieta [kien MU-cio a-BAR-ka PO-ko a-PRIE-ta]</td><td>chi troppo vuole nulla stringe</td></tr>
<tr><td>dime con quién andas y te diré quién eres [DI-me kon KIEN AN-das i te di-RE kien E-res]</td><td>dimmi con chi vai e ti dirò chi sei</td></tr>
<tr><td>del dicho al hecho hay mucho trecho [del DI-cio al E-cio ai MU-cio TRE-cio]</td><td>tra il dire e il fare c'è di mezzo il mare</td></tr>
<tr><td>camarón que se duerme se lo lleva la corriente [ka-ma-RON ke se DUER-me se lo YE-ba la ko-RRIEN-te]</td><td>chi dorme non piglia pesci</td></tr>
<tr><td>a buen entendedor, pocas palabras bastan [a buen en-ten-de-DHOR PO-kas pa-LA-bras BAS-tan]</td><td>a buon intenditor poche parole</td></tr>
<tr><td>al mal tiempo, buena cara [al mal TIEM-po BUE-na KA-ra]</td><td>fare buon viso a cattivo gioco</td></tr>
<tr><td>en casa del herrero, cuchillo de palo [en KA-ssa del e-RRE-ro ku-CI-yo de PA-lo]</td><td>il calzolaio ha le scarpe rotte</td></tr>
</table>
<p>Attenzione: sono espressioni, non vanno tradotte parola per parola. Usale con parsimonia: una per conversazione basta.</p>
<div class="say"><b>Da ricordare.</b> «Per ogni situazione scegli una formula fissa e usala bene: Yo que tú..., Me encantaría pero..., Siento que..., Estoy de acuerdo hasta cierto punto.» <i>Yo que tú, hablaría con él.</i> [YO ke TU a-bla-RI-a kon EL]</div>`,
  [
    q(
      'q1',
      'Quale formula dà un consiglio con il condizionale?',
      ['Yo que tú iría al médico.', 'Yo que tú voy al médico.', 'Yo que tú fui al médico.', 'Yo que tú ir al médico.'],
      0,
      'Yo que tú si combina con il condizionale (iría). Il presente indicativo o il passato non esprimono un consiglio ipotetico.',
    ),
    q(
      'q2',
      'Che cosa risponde chi concede il permesso a «¿Te importa si abro la ventana?»?',
      ['No, no me importa.', 'Sí, me importa mucho.', 'Mejor no, hace frío.', 'Lo siento, está prohibido.'],
      0,
      'La domanda chiede se disturba: rispondere con no significa «puoi farlo». Le altre risposte rifiutano il permesso.',
    ),
    q(
      'q3',
      'Quale modo segue «¿Te molesta que...?»',
      [
        'il congiuntivo: ¿Te molesta que fume?',
        "l'indicativo: ¿Te molesta que fumo?",
        'il condizionale: ¿Te molesta que fumaría?',
        "l'infinito: ¿Te molesta que fumar?",
      ],
      0,
      "Molestar è un verbo di reazione emotiva e regge que + congiuntivo. Se la domanda inizia con si (¿Te importa si...?), invece, si usa l'indicativo.",
    ),
    q(
      'q4',
      'Quale espressione significa «neanche per sogno»?',
      ['Ni hablar.', 'Tengo mis dudas.', 'Hasta cierto punto.', 'Depende.'],
      0,
      'Ni hablar è un rifiuto netto. Le altre formule esprimono dubbio o accordo parziale, non un rifiuto categorico.',
    ),
    q(
      'q5',
      'Come si dice «Forse piove» con a lo mejor?',
      ['A lo mejor llueve.', 'A lo mejor llueva.', 'A lo mejor lloviera.', 'A lo mejor llover.'],
      0,
      "A lo mejor regge sempre l'indicativo, mentre quizá e tal vez ammettono anche il congiuntivo. È un'eccezione tipica.",
    ),
    q(
      'q6',
      'Che cosa significa «Serán las diez»?',
      [
        'Saranno le dieci (probabilità)',
        'Saranno le dieci tra poco',
        'Alle dieci sarà pronto',
        'Sono le dieci precise',
      ],
      0,
      'Il futuro semplice esprime anche una probabilità al presente: serán las diez = devono essere le dieci. Non indica un evento futuro.',
    ),
    q(
      'q7',
      'Quale espressione corrisponde a «a caval donato non si guarda in bocca»?',
      [
        'A caballo regalado no le mires el diente.',
        'Más vale tarde que nunca.',
        'Quien mucho abarca, poco aprieta.',
        'Ojos que no ven, corazón que no siente.',
      ],
      0,
      'Il proverbio spagnolo usa la stessa immagine del cavallo e dei denti. Le altre tre frasi hanno altri equivalenti italiani.',
    ),
    q(
      'q8',
      'Che cosa vuol dire «estar hecho polvo»?',
      ['essere a pezzi', 'essere pieno di polvere', 'essere fatto di polvere', 'essere nel panico'],
      0,
      "Hecho polvo è un'espressione idiomatica per «distrutto, esausto». La traduzione letterale non ha senso.",
    ),
    q(
      'q9',
      'Quale risposta è adeguata a «Siento llegar tarde»?',
      ['No pasa nada.', 'No hay de qué.', 'Con mucho gusto.', 'Me encantaría.'],
      0,
      'No pasa nada è la risposta tipica a una scusa. No hay de qué risponde a un grazie, mentre le altre sono per inviti.',
    ),
    q(
      'q10',
      'Quale formula è la più formale per chiedere un aiuto?',
      [
        '¿Sería tan amable de ayudarme?',
        '¿Me ayudas con esto un momento?',
        '¡Ayúdame con esto, por favor!',
        'Tienes que ayudarme con esto.',
      ],
      0,
      'Sería tan amable de è la formula più formale e rispettosa. Le altre forme sono dirette o imperative e adatte solo a un registro informale.',
    ),
  ],
  [
    card(
      'c1',
      'Yo que tú + condizionale',
      'Consiglio: Yo que tú iría al médico. Alternative: Deberías + inf., Te aconsejo que + subj.',
    ),
    card(
      'c2',
      '¿Te importa si + indicativo?',
      'Permesso: ¿Te importa si abro la ventana? Risposta «No, no me importa» = sì, puoi.',
    ),
    card(
      'c3',
      '¿Te apetece + inf.?',
      'Invito: ¿Te apetece ir al cine? Accettare: Me encantaría. Rifiutare: Lo siento, ya tengo planes.',
    ),
    card('c4', 'Perdón / Lo siento / Disculpe', 'Scuse. Risposte: No pasa nada, no te preocupes, no importa.'),
    card('c5', 'Quisiera presentar una queja', 'Reclamo formale: hoja de reclamaciones, responsable, reembolso.'),
    card('c6', 'Estoy de acuerdo / Tienes razón', 'Accordo. Disaccordo: No lo veo así, Al contrario, Ni hablar.'),
    card(
      'c7',
      'A lo mejor + indicativo',
      'Forse + indicativo; quizá/tal vez + indicativo o congiuntivo; puede que + congiuntivo.',
    ),
    card('c8', 'futuro di probabilità', "Serán las diez; estará en casa. Deber de + inf. = dev'essere."),
    card('c9', 'costar un ojo de la cara', 'Costare un occhio della testa.'),
    card('c10', 'tomar el pelo', 'Prendere in giro: ¡No me tomes el pelo! (non prendermi in giro).'),
    card('c11', 'más vale tarde que nunca', 'Meglio tardi che mai.'),
    card('c12', 'del dicho al hecho hay mucho trecho', "Tra il dire e il fare c'è di mezzo il mare."),
  ],
  [
    prac(
      'p1',
      'Dai un consiglio a un amico che non dorme: usa tre formule diverse.',
      'Yo que tú me acostaría más temprano. / Deberías apagar el móvil. / Te recomiendo que hagas deporte por la tarde.',
    ),
    prac(
      'p2',
      'Chiedi il permesso in due modi (aprire la finestra) e rispondi una volta sì e una volta no.',
      '¿Puedo abrir la ventana? — Sí, claro. / ¿Te importa si abro la ventana? — Mejor no, hace frío.',
    ),
    prac(
      'p3',
      'Invita un collega a cena; rifiuta con garbo.',
      '¿Te apetece cenar conmigo el viernes? — Me encantaría, pero ya tengo planes. ¿Lo dejamos para otro día?',
    ),
    prac(
      'p4',
      'Scrivi un breve reclamo in un ristorante dove il conto è sbagliato.',
      'Perdone, creo que me han cobrado de más. Pedí dos cafés y aparecen tres. ¿Podría revisarlo y darme la hoja de reclamaciones si no se soluciona?',
    ),
    prac(
      'p5',
      "Traduci: «Forse arriva tardi», «Sarà in casa», «Sono d'accordo fino a un certo punto».",
      'A lo mejor llega tarde (o Puede que llegue tarde). / Estará en casa. / Estoy de acuerdo hasta cierto punto.',
    ),
    prac(
      'p6',
      'Abbina: tomar el pelo; hacer la vista gorda; ser uña y carne; no tener pelos en la lengua.',
      'prendere in giro; chiudere un occhio; essere culo e camicia; non avere peli sulla lingua.',
    ),
    prac(
      'p7',
      "Spiega perché non si traduce parola per parola «dormir como un lirón» e dai l'equivalente.",
      "Perché è un'espressione fissa: lirón = ghiro, l'equivalente italiano è «dormire come un ghiro» (qui l'immagine coincide, ma non è sempre così).",
    ),
  ],
)
