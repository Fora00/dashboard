import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './spagnolo.pron'

// Spanish course, extra grammar module es-indefiniti (completeness round 1, group a2).
// Pronunciation: same notation as es-pron (see spagnolo.pron.ts).

export const esIndefiniti = mod(
  'es-indefiniti',
  'Indefiniti, esclamativi e il «lo» neutro',
  'Algún, cualquier, todo, cada, demasiado, bastante, ¡qué!, lo bueno, ni...ni, sino que',
  'a2',
  `<p class="lead">Sono le piccole parole che fanno parlare davvero: «qualche, ogni, abbastanza, troppo, tutto». L'italiano ha forme simili ma i confini sono diversi: <i>abbastanza</i> non è <i>bastante</i> in ogni contesto, <i>ogni</i> si divide in due parole e <i>altro</i> non vuole mai l'articolo indeterminativo.</p>
${PRON_SHORT}
<h3>Alguno e ninguno</h3>
<table><tr><th>Forma</th><th>Esempio</th><th>Italiano</th></tr>
<tr><td>algún [al-GUN] + m. sing.</td><td>algún día [al-gun-DI-a]</td><td>un giorno o l'altro</td></tr>
<tr><td>alguna, algunos, algunas</td><td>alguna vez, algunos amigos</td><td>qualche volta, alcuni amici</td></tr>
<tr><td>ningún [nin-GUN]</td><td>No tengo ningún problema.</td><td>Non ho nessun problema.</td></tr>
<tr><td>ninguna</td><td>No hay ninguna duda.</td><td>Non c'è alcun dubbio.</td></tr>
</table>
<p>Il plurale <i>ningunos</i> è rarissimo: si usa il singolare (<i>No tengo ningún amigo</i>) o si omette (<i>No tengo amigos</i>). Con <i>de</i> la forma è piena: <i>alguno de ellos</i>, <i>ninguno de nosotros</i>. Dopo il verbo la doppia negazione è obbligatoria: <b>No</b> viene <b>nadie</b>; Nadie viene.</p>
<h3>Persone e cose: alguien, nadie, algo, nada</h3>
<p><b>alguien</b> [AL-ghien] = qualcuno, <b>nadie</b> [NA-dhie] = nessuno, <b>algo</b> [AL-go] = qualcosa, <b>nada</b> [NA-dha] = niente. Sono invariabili. <i>¿Hay alguien?</i> <i>No veo a nadie.</i> (a personal!) <i>¿Quieres algo?</i> <i>No quiero nada.</i></p>
<h3>Cualquier, todo, cada, otro, mismo</h3>
<ul><li><b>cualquier</b> [kual-KIER] davanti a un nome (qualunque): <i>cualquier día</i>, <i>cualquier persona</i>. <b>cualquiera</b> da solo o dopo il nome: <i>Cualquiera puede.</i> <i>Un chico cualquiera.</i> (uno qualunque).</li><li><b>todo el día</b> (tutto il giorno) ≠ <b>todos los días</b> (ogni giorno, tutti i giorni). <i>todo el mundo</i> = tutti, verbo al singolare: <i>Todo el mundo lo sabe.</i></li><li><b>cada</b> [KA-dha] è invariabile e vale «ogni»: <i>cada semana</i>, <i>cada uno</i>, <i>cada dos días</i> (ogni due giorni).</li><li><b>otro</b> [O-tro] non vuole l'articolo indeterminativo: <i>otro café</i>, <i>otra vez</i> (non: «un otro café»).</li><li><b>mismo</b> [MIS-mo]: <i>el mismo problema</i>, <i>yo mismo</i>, <i>lo mismo</i>, <i>ahora mismo</i> (proprio ora), <i>aquí mismo</i>.</li></ul>
<h3>Quantità: poco, bastante, demasiado, suficiente</h3>
<table><tr><th>Parola</th><th>Davanti a nome</th><th>Davanti ad aggettivo/verbo</th></tr>
<tr><td>mucho</td><td>mucha gente (concorda)</td><td>muy rápido; trabaja mucho</td></tr>
<tr><td>poco</td><td>poca agua</td><td>poco rápido; come poco</td></tr>
<tr><td>bastante</td><td>bastantes amigos</td><td>bastante bien (abbastanza)</td></tr>
<tr><td>demasiado</td><td>demasiada gente</td><td>demasiado caro (troppo)</td></tr>
<tr><td>suficiente</td><td>suficiente tiempo</td><td>no es suficiente</td></tr>
</table>
<p>Prima di un aggettivo o avverbio sono <b>invariabili</b>: <i>Son demasiado caros.</i> <i>Estamos bastante cansados.</i> Davanti a un nome concordano: <i>demasiados coches</i>. <b>Bastante</b> vale anche «abbastanza, piuttosto»; per «sufficiente» c'è <b>suficiente</b>. Altre: <b>varios</b> (diversi), <b>cierto</b> (un certo), <b>ambos / los dos</b> (entrambi), <b>tanto</b> (tanto), <b>tan</b> (così, davanti ad aggettivo).</p>
<h3>Trappole italiane</h3>
<ul><li>«Qualche amico» (singolare in italiano) = <b>algún amigo</b> o, più spesso, il plurale <b>algunos amigos</b> (alcuni amici); «qualche volta» = <i>alguna vez</i> o <i>a veces</i>.</li><li>«Ogni» = <b>cada</b> (invariabile) o <b>todos los</b> (tutti i): <i>cada día</i> / <i>todos los días</i>.</li><li>«Troppo» = <b>demasiado</b>, non «mucho»: <i>Hace demasiado calor.</i></li><li>«Qualunque» = <b>cualquier(a)</b>, non «cualquiera» davanti al nome.</li><li>«Un altro» = <b>otro</b>.</li></ul>
<h3>Esclamativi</h3>
<table><tr><th>Struttura</th><th>Esempio</th></tr>
<tr><td>¡Qué + aggettivo/avverbio!</td><td>¡Qué bonito! ¡Qué rápido!</td></tr>
<tr><td>¡Qué + nome!</td><td>¡Qué día! ¡Qué suerte!</td></tr>
<tr><td>¡Qué + nome + más/tan + aggettivo!</td><td>¡Qué casa más grande! ¡Qué casa tan grande!</td></tr>
<tr><td>¡Cuánto + verbo!</td><td>¡Cuánto trabajas!</td></tr>
<tr><td>¡Cuánto/a/os/as + nome!</td><td>¡Cuánta gente! ¡Cuántos años!</td></tr>
<tr><td>¡Cómo + verbo!</td><td>¡Cómo llueve!</td></tr>
<tr><td>¡Quién + imperfetto del congiuntivo!</td><td>¡Quién pudiera viajar! (potessi viaggiare...)</td></tr>
</table>
<p>Con «che» l'italiano mette l'aggettivo prima del nome (<i>che bella casa</i>), lo spagnolo dopo il nome, introdotto da <i>más</i> o <i>tan</i>: <i>¡Che bella casa!</i> = <i>¡Qué casa más bonita!</i>. Tilde sempre su qué, cuánto, cómo, quién.</p>
<h3>Lo neutro</h3>
<ul><li><b>lo + aggettivo</b> = ciò che è...: <i>lo bueno</i> (il bello), <i>lo mejor</i>, <i>lo importante</i>.</li><li><b>lo + aggettivo + que</b> = quanto: <i>No sabes lo difícil que es.</i> (quanto sia difficile); <i>Mira lo rápido que corre.</i></li><li><b>lo que</b> = ciò che: <i>Lo que dices es verdad.</i> <i>Todo lo que quieras.</i></li><li><b>lo de</b> = la questione di, la storia di: <i>lo de ayer</i> (quella cosa di ieri), <i>lo de tu hermano</i>.</li><li>Locuzioni fisse: <i>a lo mejor</i> (forse, con l'indicativo!), <i>por lo menos</i>, <i>lo antes posible</i>, <i>por lo tanto</i>, <i>lo cual</i> (il che).</li></ul>
<h3>Correlativi</h3>
<table><tr><th>Struttura</th><th>Esempio</th></tr>
<tr><td>ni... ni</td><td>No bebo ni vino ni cerveza. / Ni vino ni cerveza.</td></tr>
<tr><td>o... o</td><td>O vienes o te quedas.</td></tr>
<tr><td>tanto... como</td><td>Tanto Ana como Luis vienen.</td></tr>
<tr><td>cuanto más... más</td><td>Cuanto más estudio, más aprendo.</td></tr>
<tr><td>cuanto antes, mejor</td><td>Llámame cuanto antes.</td></tr>
<tr><td>no solo... sino (que) también</td><td>No solo canta, sino que también baila.</td></tr>
<tr><td>no... sino (che)</td><td>No es rojo, sino azul. / No me quejo, sino que pregunto.</td></tr>
</table>
<p><b>Sino</b> si usa dopo una negazione e contrappone due elementi (non è rosso <i>ma</i> blu); davanti a un verbo coniugato serve <b>sino que</b>. <b>Pero</b> introduce solo una restrizione: <i>No es caro, pero no me gusta.</i> Con <b>ni siquiera</b> (neanche): <i>Ni siquiera me llamó.</i></p>
<div class="say"><b>Da ricordare.</b> «Non dire un otro, ogni = cada, troppo = demasiado, e per il tono ¡qué + nome + más + aggettivo!» <i>¡Qué día más largo!</i> [ke DI-a mas LAR-go]</div>`,
  [
    q(
      'q1',
      "Come si dice «un giorno o l'altro» in modo naturale?",
      ['algún día', 'alguno día', 'algún días', 'un algún día'],
      0,
      "Alguno cade la -o davanti a un nome maschile singolare e diventa algún. Il plurale non si accorcia e l'articolo davanti non serve.",
    ),
    q(
      'q2',
      'Quale frase è corretta?',
      [
        'No tengo ningún problema.',
        'No tengo ninguno problema.',
        'Tengo ningún problema.',
        'No tengo ningunos problemas.',
      ],
      0,
      'Ninguno si accorcia in ningún davanti a un maschile singolare, e dopo il verbo la negazione richiede no. Il plurale ningunos è raro.',
    ),
    q(
      'q3',
      'Quale espressione significa «tutti i giorni»?',
      ['todos los días', 'todo el día', 'todo día', 'cada de día'],
      0,
      "Todos los días indica una ripetizione quotidiana; todo el día significa «per l'intera giornata». La differenza è di senso, non di grammatica.",
    ),
    q(
      'q4',
      'Come si dice «un altro caffè»?',
      ['otro café', 'un otro café', 'uno otro café', 'otro un café'],
      0,
      "Otro contiene già l'idea di «un altro» e non ammette l'articolo indeterminativo: un otro è un calco dall'italiano.",
    ),
    q(
      'q5',
      '«Sono troppo cari» si traduce:',
      ['Son demasiado caros.', 'Son demasiados caros.', 'Son muchos caros.', 'Son bastante caros.'],
      0,
      'Davanti a un aggettivo demasiado è un avverbio e non concorda. Bastante significa piuttosto, non troppo, e mucho non esiste davanti ad aggettivi.',
    ),
    q(
      'q6',
      'Quale esclamazione corrisponde a «Che casa grande!»?',
      ['¡Qué casa tan grande!', '¡Qué grande casa!', '¡Qué tan grande casa!', '¡Cuánto casa grande!'],
      0,
      "In spagnolo tra il nome e l'aggettivo si interpone tan o más: ¡qué casa tan/más grande!",
    ),
    q(
      'q7',
      'Cosa significa «No sabes lo difícil que es»?',
      [
        'Non sai quanto sia difficile',
        'Non sai che cosa sia difficile',
        'Non sai se è difficile',
        'Non sai il difficile',
      ],
      0,
      "La struttura lo + aggettivo + que esprime l'intensità («quanto»). Non introduce una domanda indiretta con se, né un nome.",
    ),
    q(
      'q8',
      'Quale connettivo completa: «No es rojo, ... azul»?',
      ['sino', 'pero', 'sino que', 'aunque'],
      0,
      'Dopo una negazione e davanti a un elemento senza verbo coniugato serve sino. Sino que lo richiederebbe solo con un verbo coniugato.',
    ),
    q(
      'q9',
      'A lo mejor + verbo: quale modo si usa?',
      [
        'indicativo: a lo mejor vienes',
        'congiuntivo: a lo mejor vengas',
        'condizionale: a lo mejor vendrías',
        'infinito: a lo mejor venir',
      ],
      0,
      "A lo mejor (forse) regge l'indicativo, a differenza di quizás e tal vez che ammettono entrambi i modi. È una trappola per chi conosce il congiuntivo.",
    ),
    q(
      'q10',
      'Quale frase usa correttamente cualquier / cualquiera?',
      [
        'Cualquier día puedes venir.',
        'Cualquiera día puedes venir.',
        'Cualquier puede venir.',
        'Un cualquier día puedes venir.',
      ],
      0,
      'Cualquier si usa davanti a un nome; cualquiera sta da solo o dopo il nome (Cualquiera puede). Un cualquier non esiste.',
    ),
  ],
  [
    card(
      'c1',
      'algún / ningún',
      'Davanti a un maschile singolare: algún día, ningún problema. Dopo il verbo: no + ningún.',
    ),
    card(
      'c2',
      'alguien / nadie / algo / nada',
      'qualcuno / nessuno / qualcosa / niente. Invariabili. Con persona: a personal (no veo a nadie).',
    ),
    card(
      'c3',
      'cualquier / cualquiera',
      'cualquier + nome (cualquier día); cualquiera da solo o dopo (cualquiera puede).',
    ),
    card(
      'c4',
      'todo el día / todos los días',
      'tutto il giorno / ogni giorno. Todo el mundo = tutti (verbo singolare).',
    ),
    card('c5', 'cada', 'Ogni, invariabile: cada día, cada uno, cada dos semanas (ogni due settimane).'),
    card('c6', 'otro', 'Mai con un/una: otro café, otra vez, los otros. Un altro = otro.'),
    card(
      'c7',
      'demasiado / bastante / poco',
      'Davanti ad agg.: invariabili (demasiado caro). Davanti a nome: concordano (demasiada gente).',
    ),
    card('c8', '¡Qué + nome + más/tan + agg!', '¡Qué casa más bonita! ¡Qué día tan largo! (che bella casa!)'),
    card('c9', 'lo + agg. + que', 'Quanto: No sabes lo difícil que es. Lo mejor, lo bueno = la cosa migliore.'),
    card('c10', 'lo que / lo de', 'lo que = ciò che; lo de ayer = la storia di ieri.'),
    card(
      'c11',
      'sino / sino que / pero',
      'Sino dopo negazione per contrapporre; sino que + verbo coniugato; pero = restrizione.',
    ),
    card('c12', 'cuanto más... más', 'Più... più: Cuanto más estudio, más aprendo. Cuanto antes, mejor.'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Ho troppo lavoro», «Ci sono abbastanza sedie», «Non ho nessun amico a Madrid», «Ogni mattina corro».',
      'Tengo demasiado trabajo. / Hay bastantes sillas (o suficientes sillas). / No tengo ningún amigo en Madrid. / Cada mañana corro (o Todas las mañanas corro).',
    ),
    prac(
      'p2',
      "Completa: Quiero ___ café (un altro). ¿Hay ___ en casa? (qualcuno). No veo a ___. (nessuno). ___ día vengo (un giorno o l'altro).",
      'otro café; alguien; nadie; Algún día. Non usare un otro; con persona complemento diretto richiede a.',
    ),
    prac(
      'p3',
      'Trasforma in esclamazione: La casa es muy grande. / Trabajas mucho. / Hay mucha gente.',
      '¡Qué casa tan/más grande! / ¡Cuánto trabajas! / ¡Cuánta gente hay! Nota: davanti a un nome, cuánto concorda (cuánta gente).',
    ),
    prac(
      'p4',
      'Traduci con «lo»: «Ciò che dici è vero», «Il bello è che costa poco», «Non immagini quanto sono stanco».',
      'Lo que dices es verdad. / Lo bueno es que cuesta poco. / No imaginas lo cansado que estoy.',
    ),
    prac(
      'p5',
      'Scegli sino, sino que, pero: «No vino ayer, ___ hoy». / «No es caro, ___ no me gusta». / «No estudia, ___ trabaja».',
      'No vino ayer, sino hoy. / No es caro, pero no me gusta. / No estudia, sino que trabaja. Sino segue una negazione e contrappone; sino que con verbo coniugato.',
    ),
    prac(
      'p6',
      'Traduci i correlativi: «Né tu né io lo sappiamo», «Sia Ana sia Luis vengono», «Più mangio, più ho fame».',
      'Ni tú ni yo lo sabemos. / Tanto Ana como Luis vienen. / Cuanto más como, más hambre tengo. Con ni... ni davanti al verbo non si mette no: Ni tú ni yo...',
    ),
  ],
)
