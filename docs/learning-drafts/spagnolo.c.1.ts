import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './spagnolo.pron'

// Spanish course, extra grammar modules (completeness round 1): es-fonetica2 and es-indefiniti (both group a2).
// Pronunciation: same notation as es-pron (see spagnolo.pron.ts). Hyphen-less clusters in [ ] show sinalefa/enlace.

export const esFonetica2 = mod(
  'es-fonetica2',
  'Fonetica 2: parole legate, intonazione, ortografia',
  'Sinalefa ed enlace, intonazione, b/d/g morbide, s finale, regole di ortografia, coppie minime',
  'a2',
  `<p class="lead">Dopo i singoli suoni, la fluidità: in spagnolo le parole <b>si legano</b> tra loro e il ritmo è fatto di sillabe quasi uguali. Un italiano tende a staccare ogni parola e a dare una melodia «cantata»: qui impari a correggerlo e a scrivere senza sbagliare le lettere che suonano uguali.</p>
${PRON_SHORT}
<h3>Sinalefa: due vocali, una sillaba</h3>
<p>Quando una parola finisce in vocale e la successiva comincia con vocale (anche con h muta), le due vocali si fondono nella <b>stessa sillaba</b>, senza pausa né colpo di glottide. Succede anche con tre vocali: <i>Voy a ir</i>.</p>
<table><tr><th>Scritto</th><th>Si dice</th><th>Italiano</th></tr>
<tr><td>mi amigo</td><td>[mia-MI-go]</td><td>il mio amico</td></tr>
<tr><td>de agosto</td><td>[dea-GOS-to]</td><td>di agosto</td></tr>
<tr><td>una idea</td><td>[u-nai-DE-a]</td><td>un'idea</td></tr>
<tr><td>ya he comido</td><td>[yae-ko-MI-dho]</td><td>ho già mangiato</td></tr>
<tr><td>la hora</td><td>[laO-ra]</td><td>l'ora</td></tr>
</table>
<p>Se le due vocali sono uguali, si sente una vocale un po' più lunga: <i>la abuela</i> [la-BUE-la]. L'effetto è diverso dall'italiano, dove «la amica» tende a perdere l'apostrofo ma a restare in due tempi.</p>
<h3>Enlace: la consonante finale passa alla parola dopo</h3>
<p>Se una parola finisce in consonante e la successiva comincia con vocale, la consonante va a formare sillaba con la vocale successiva, come se fosse una sola parola. Gli spagnoli non sentono i confini di parola.</p>
<table><tr><th>Scritto</th><th>Si dice</th><th>Italiano</th></tr>
<tr><td>los amigos</td><td>[lo-ssa-MI-gos]</td><td>gli amici</td></tr>
<tr><td>un hombre</td><td>[u-NOM-bre]</td><td>un uomo</td></tr>
<tr><td>es una casa</td><td>[e-ssu-na-KA-ssa]</td><td>è una casa</td></tr>
<tr><td>el otro</td><td>[e-LO-tro]</td><td>l'altro</td></tr>
<tr><td>hablar español</td><td>[a-bla-res-pa-GNOL]</td><td>parlare spagnolo</td></tr>
</table>
<p>Per questo, ascoltando, non cercare i confini tra le parole: ascolta il <b>gruppo ritmico</b> (di solito 4-7 sillabe con un solo accento forte), non la parola isolata.</p>
<h3>Ritmo: sillabe e vocali piene</h3>
<p>Lo spagnolo è a <b>tempo sillabico</b> come l'italiano: ogni sillaba dura più o meno uguale. Differenza decisiva rispetto all'inglese: le vocali atone <b>non si indeboliscono</b> mai in «e muta». In più, le parole grammaticali atone (<i>el, de, que, mi, tu, con</i>) si appoggiano alla parola dopo: <i>de la casa</i> suona [de-la-KA-ssa].</p>
<h3>Intonazione</h3>
<ul><li><b>Frase affermativa</b>: scende alla fine (↘). <i>Vivo en Madrid.</i></li><li><b>Domanda sì/no</b>: sale sull'ultima sillaba accentata (↗). <i>¿Vienes mañana?</i> Non serve invertire l'ordine: cambia solo la melodia.</li><li><b>Domanda con interrogativo</b> (qué, dónde, cuándo): parte alta e scende (↘). <i>¿Dónde vives?</i> Sale se è una richiesta di ripetizione o di cortesia.</li><li><b>Elenco</b>: ogni elemento sale (↗), l'ultimo scende (↘). <i>Compro pan, leche y huevos.</i></li><li><b>Alternativa</b>: <i>¿Café ↗ o té ↘?</i></li><li><b>Esclamazione</b>: tono alto sull'interiezione, poi scende: <i>¡Qué bien!</i> <i>¡Qué lástima!</i></li><li><b>Tag</b> (<i>¿verdad? ¿no?</i>): salgono, come «vero?» in italiano.</li></ul>
<p>I segni <b>¿ ¡</b> servono proprio a dirti dall'inizio con che tono leggere la frase.</p>
<h3>b, d, g: stop o fricativa</h3>
<p>Le tre consonanti hanno due pronunciazioni. Dopo una <b>pausa</b>, dopo <b>m/n</b> (e dopo <b>l</b> per la d) sono occlusive come in italiano; <b>altrove</b> (tra vocali, dopo r, s, alla fine) si ammorbidiscono: le labbra, la lingua non si chiudono del tutto.</p>
<table><tr><th>Occlusiva</th><th>Morbida</th></tr>
<tr><td>un beso [um-BE-sso]</td><td>la boca [la-BO-ka] (b tra vocali)</td></tr>
<tr><td>dame [DA-me]</td><td>nada [NA-dha], la dama [la-DHA-ma]</td></tr>
<tr><td>un gato [un-GA-to]</td><td>lago [LA-go] (g appena sfiorata)</td></tr>
</table>
<p>Il caso più evidente è la <b>d</b>: tra vocali e alla fine di parola è un suono tipo «th» inglese di <i>this</i>: <i>cansado</i> [kan-SA-dho], <i>verdad</i> [ber-DADH]. Non va mai pronunciata come la «d» italiana piena.</p>
<h3>S e gruppi di consonanti</h3>
<ul><li>La s resta <b>sorda</b> anche davanti a consonante sonora: <i>mismo</i> [MIS-mo], <i>desde</i> [DES-dhe], <i>los dos</i> [los-DOS]. Un italiano del nord direbbe «mizmo»: sbagliato.</li><li>In molte zone (Caraibi, Andalusia, Cile) la s finale si aspira o cade: <i>los amigos</i> [loh a-MI-goh].</li><li><b>S + consonante all'inizio</b> non esiste in spagnolo: si aggiunge sempre una <b>e</b>. «Scuola» = <i>escuela</i> [es-KUE-la], «Spagna» = <i>España</i>, «stazione» = <i>estación</i>, «studiare» = <i>estudiar</i>, «scena» = <i>escena</i>. È l'errore più comune degli italiani.</li><li>Gruppi come <i>ps-</i> (<i>psicología</i> [si-ko-lo-HI-a]) e <i>gn-</i> (<i>gnomo</i>) sono rari: la p iniziale si pronuncia poco o non si pronuncia.</li></ul>
<h3>Regole di ortografia</h3>
<ul><li><b>b/v</b> suonano uguale, non c'è regola fonetica. Utili: i verbi in <b>-bir</b> (<i>escribir, recibir, subir</i>; eccezioni <i>hervir, servir, vivir</i>), l'imperfetto in <b>-aba</b> (<i>cantaba</i>), prima di <b>m/p</b> si scrive <b>m</b> (<i>también, campo</i>), dopo <b>n</b> si scrive <b>v</b> (<i>invitar, envolver</i>).</li><li><b>g/j</b>: davanti a e, i la jota si scrive g o j. I verbi in <b>-ger, -gir</b> hanno g (<i>coger, elegir</i>) ma cambiano in j davanti a o/a (<i>cojo, elija</i>); <i>viajar, trabajo, tejer</i> sempre j.</li><li><b>c/z/qu</b>: <b>qu</b> solo davanti a e, i (<i>queso, aquí</i>); <b>c</b> davanti a a, o, u; <b>z</b> davanti a a, o, u e a fine sillaba. Davanti a e, i si scrive <b>c</b>: <i>cinco, cena</i>. Plurali: <i>luz → luces, lápiz → lápices</i>; verbi: <i>empezar → empiece</i>.</li><li><b>h</b> è muta ma si scrive: <i>hacer, hay, hombre, huevo, ahora, helado</i>. Attenzione ai gemelli: <i>a / ha</i>, <i>e / he</i>, <i>ay / hay</i>, <i>echo / hecho</i>.</li><li><b>Sillabazione</b>: <b>ch, ll, rr</b> non si dividono (<i>ca-lle, pe-rro, mu-cho</i>); i gruppi <b>pr, pl, br, bl, cr, cl, dr, fr, fl, gr, gl, tr</b> restano uniti (<i>a-bri-go, ha-blar</i>); <i>ins-tru-men-to, ex-tra-ño</i>.</li><li><b>Abbreviazioni</b>: <i>Sr.</i> (señor), <i>Sra.</i>, <i>Dr.</i>, <i>Ud./Uds.</i>, <i>pág.</i>, <i>p. ej.</i> (por ejemplo), <i>etc.</i>, <i>EE. UU.</i></li></ul>
<h3>Coppie minime da allenare</h3>
<table><tr><th>A</th><th>B</th></tr>
<tr><td>pero [PE-ro] ma</td><td>perro [PE-rro] cane</td></tr>
<tr><td>caro [KA-ro] caro</td><td>carro [KA-rro] carro</td></tr>
<tr><td>cana [KA-na] capello bianco</td><td>caña [KA-gna] canna</td></tr>
<tr><td>pena [PE-na] pena</td><td>peña [PE-gna] roccia</td></tr>
<tr><td>uno [U-no] uno</td><td>uña [U-gna] unghia</td></tr>
<tr><td>mono [MO-no] scimmia</td><td>moño [MO-gno] chignon</td></tr>
<tr><td>casa [KA-ssa] casa</td><td>caza [KA-tha] caccia (Spagna)</td></tr>
<tr><td>poco [PO-ko] poco</td><td>pozo [PO-tho] pozzo (Spagna)</td></tr>
<tr><td>papa [PA-pa] patata, papa</td><td>papá [pa-PA] papà</td></tr>
<tr><td>canto [KAN-to] io canto</td><td>cantó [kan-TO] lui cantò</td></tr>
<tr><td>sabana [sa-BA-na] savana</td><td>sábana [SA-ba-na] lenzuolo</td></tr>
<tr><td>termino [ter-MI-no] io finisco</td><td>terminó [ter-mi-NO] finì</td></tr>
</table>
<p>Casa/caza e poco/pozo si distinguono solo in Spagna: in America (seseo) sono omofone.</p>
<div class="say"><b>Da ricordare.</b> «Parla a gruppi ritmici, lega le parole, non dire mai scuola ma <i>escuela</i>, e alza la voce solo dove la domanda lo chiede.» <i>¿Vienes ↗ o te quedas ↘?</i> [BIE-nes o te-ke-DHAS]</div>`,
  [
    q(
      'q1',
      'Come si legge «mi amigo» in una frase normale?',
      [
        '[mia-MI-go], senza pausa tra le parole',
        '[mi-a-MI-go], con una pausa',
        '[mi-ma-MI-go], con una m in più',
        '[mi-ha-MI-go], con h raschiata',
      ],
      0,
      "Con la sinalefa le due vocali a contatto formano una sola sillaba, quindi non c'è pausa. La h di «hola» è muta e non va aspirata.",
    ),
    q(
      'q2',
      "Quale trascrizione mostra l'enlace corretto di «los amigos»?",
      ['[lo-ssa-MI-gos]', '[los-a-MI-gos]', '[los-ha-MI-gos]', '[lo-za-MI-gos]'],
      0,
      "La s finale passa alla sillaba seguente e resta sorda (ssa). La s sonora (za) è l'errore tipico degli italiani settentrionali.",
    ),
    q(
      'q3',
      "Qual è l'intonazione di «¿Vienes mañana?» (domanda sì/no)?",
      ['sale alla fine', 'scende alla fine', 'resta piatta', "sale all'inizio e scende"],
      0,
      "Le domande sì/no non invertono l'ordine delle parole: a distinguerle dall'affermazione è solo la melodia ascendente finale.",
    ),
    q(
      'q4',
      'Come si dice «scuola» in spagnolo?',
      ['escuela', 'scuela', 'scuola', 'eschuela'],
      0,
      "Lo spagnolo non ammette s + consonante all'inizio di parola: si aggiunge sempre una e (escuela, España, estación). Questa è una trappola frequente.",
    ),
    q(
      'q5',
      'Come si pronuncia la d di «nada»?',
      [
        'morbida, come th di «this»: [NA-dha]',
        'dura, come la d italiana: [NA-da]',
        'sorda, come t: [NA-ta]',
        'quasi una r: [NA-ra]',
      ],
      0,
      'Tra vocali la d spagnola diventa fricativa: la lingua tocca appena i denti. La d italiana piena suona subito «straniera» a un ascoltatore madrelingua.',
    ),
    q(
      'q6',
      'Quale parola è scritta correttamente?',
      ['recibir', 'recivir', 'rezibir', 'resivir'],
      0,
      'I verbi in -bir si scrivono con b (escribir, subir); le eccezioni sono hervir, servir e vivir. Z non entra: davanti a i si scrive c.',
    ),
    q(
      'q7',
      'Quale coppia differisce soltanto per la vibrante?',
      ['pero / perro', 'cana / caña', 'papa / papá', 'canto / cantó'],
      0,
      "Pero ha una r semplice (ma), perro una vibrante multipla (cane). Cana/caña differiscono per la ñ e le altre due coppie per l'accento.",
    ),
    q(
      'q8',
      'Come si legge «mismo» in spagnolo?',
      ['[MIS-mo], s sorda', '[MIZ-mo], s sonora', '[MI-mo], senza s', '[MISH-mo], come sc'],
      0,
      "La s spagnola non si sonorizza mai davanti a consonante sonora. La pronuncia con z è un'interferenza dell'italiano settentrionale.",
    ),
    q(
      'q9',
      'Quale parola si scrive con g (e non con j)?',
      ['coger', 'tejer', 'viajar', 'trabajo'],
      0,
      'I verbi in -ger e -gir mantengono g davanti a e/i (coger, elegir). Tejer, viajar e trabajo sono scritti con j e non seguono questa regola.',
    ),
    q(
      'q10',
      "Cosa indica «¿Café ↗ o té ↘?» sull'intonazione?",
      [
        'il primo elemento sale, il secondo scende',
        'entrambi salgono',
        'entrambi scendono',
        'il primo scende, il secondo sale',
      ],
      0,
      "Nelle domande alternative il primo termine ha tono ascendente (la scelta resta aperta) e l'ultimo discendente, che chiude la domanda.",
    ),
  ],
  [
    card(
      'c1',
      'sinalefa',
      'Vocale finale + vocale iniziale = una sola sillaba: mi amigo [mia-MI-go], de agosto [dea-GOS-to].',
    ),
    card(
      'c2',
      'enlace',
      'La consonante finale passa alla vocale seguente: los amigos [lo-ssa-MI-gos], un hombre [u-NOM-bre].',
    ),
    card('c3', 'intonazione domanda sì/no', "Sale alla fine. Stesso ordine delle parole dell'affermazione: ¿Vienes? ↗"),
    card('c4', 'intonazione elenco', "Ogni elemento sale, l'ultimo scende: pan ↗, leche ↗ y huevos ↘."),
    card('c5', 'b, d, g tra vocali', 'Fricative morbide (lingua e labbra non chiudono): la boca, nada [NA-dha], lago.'),
    card(
      'c6',
      'escuela, España, estación',
      "Mai s + consonante all'inizio: si aggiunge e. Trappola dell'italiano «scuola, Spagna, stazione».",
    ),
    card(
      'c7',
      'mismo, desde, los dos',
      'La s resta sorda anche davanti a consonante sonora: [MIS-mo], [DES-dhe], mai z.',
    ),
    card(
      'c8',
      'coger, elegir, viajar',
      'g davanti a e/i nei verbi in -ger/-gir (cojo, elija); j in viajar, trabajo, tejer.',
    ),
    card('c9', 'recibir, escribir, vivir', '-bir con b (eccezioni hervir, servir, vivir). Imperfetto in -aba.'),
    card('c10', 'luz → luces, empezar → empiece', 'Davanti a e, i la z diventa c: luces, lápices, empiece.'),
    card(
      'c11',
      'casa / caza, poco / pozo',
      'Differenza solo in Spagna (casa [KA-ssa], caza [KA-tha]); in America omofone per il seseo.',
    ),
    card(
      'c12',
      'sábana / sabana',
      "sábana [SA-ba-na] lenzuolo; sabana [sa-BA-na] savana. L'accento cambia il significato.",
    ),
  ],
  [
    prac(
      'p1',
      'Scrivi come si legge ad alta voce, con enlace e sinalefa: «los ojos», «mi hijo», «un error», «la escuela».',
      'los ojos [lo-SSO-hos]; mi hijo [mi-I-ho] (h muta: sinalefa tra due i); un error [u-ne-RROR]; la escuela [laes-KUE-la]. Lo scopo è sentire un unico gruppo ritmico.',
    ),
    prac(
      'p2',
      'Traduci in spagnolo scrivendo bene la e iniziale: scuola, Spagna, studente, stazione, spettacolo, scena.',
      "escuela, España, estudiante, estación, espectáculo, escena. Regola: s + consonante all'inizio → es + consonante.",
    ),
    prac(
      'p3',
      "Metti l'intonazione (↗ o ↘) in «¿Dónde vives?», «¿Vives en Madrid?», «Vivo en Madrid.», «¡Qué bien!».",
      '¿Dónde vives? ↘ (parola interrogativa: parte alta e scende); ¿Vives en Madrid? ↗ (sì/no); Vivo en Madrid. ↘ (affermazione); ¡Qué bien! alto su Qué e scende.',
    ),
    prac(
      'p4',
      'Scegli b o v: ...iajar, ...ivir, recí...ir, escri...ir, ...ocal. Poi g o j: co...er, tra...ajo, ...ente, ele...ir.',
      'viajar (v), vivir (v), recibir (b: -bir), escribir (b), vocal (v); coger (g: -ger), trabajo (j), gente (g davanti a e), elegir (g: -gir). Ricorda: b/v non hanno regola fonetica, g/j davanti a e/i vanno imparate con il verbo.',
    ),
    prac(
      'p5',
      'Spiega la differenza tra: canto/cantó, papa/papá, término/termino/terminó (con traduzione).',
      "canto [KAN-to] = io canto; cantó [kan-TO] = lui cantò. papa [PA-pa] = patata/papa; papá [pa-PA] = papà. término [TER-mi-no] = termine; termino [ter-MI-no] = io finisco; terminó [ter-mi-NO] = finì. La posizione dell'accento (e la tilde) cambia categoria e significato.",
    ),
    prac(
      'p6',
      'Dividi in sillabe: abrigo, hablar, extraño, calle, perro, instrumento, también.',
      'a-bri-go, ha-blar, ex-tra-ño, ca-lle, pe-rro, ins-tru-men-to, tam-bién. ch, ll, rr e i gruppi consonante+l/r restano uniti; con -ns- e -xt- si taglia dopo la prima consonante.',
    ),
  ],
)

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
<p><b>alguien</b> [AL-guien] = qualcuno, <b>nadie</b> [NA-dhie] = nessuno, <b>algo</b> [AL-go] = qualcosa, <b>nada</b> [NA-dha] = niente. Sono invariabili. <i>¿Hay alguien?</i> <i>No veo a nadie.</i> (a personal!) <i>¿Quieres algo?</i> <i>No quiero nada.</i></p>
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
<ul><li>«Qualche» = <b>algún/alguna</b> + singolare, ma l'italiano usa il singolare e lo spagnolo anche il plurale: <i>algunos amigos</i> (alcuni amici).</li><li>«Ogni» = <b>cada</b> (invariabile) o <b>todos los</b> (tutti i): <i>cada día</i> / <i>todos los días</i>.</li><li>«Troppo» = <b>demasiado</b>, non «mucho»: <i>Hace demasiado calor.</i></li><li>«Qualunque» = <b>cualquier(a)</b>, non «cualquiera» davanti al nome.</li><li>«Un altro» = <b>otro</b>.</li></ul>
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
<p>Con «che» + aggettivo l'italiano mette l'aggettivo dopo il nome, lo spagnolo dopo <i>más</i> o <i>tan</i>: <i>¡Che bella casa!</i> = <i>¡Qué casa más bonita!</i>. Tilde sempre su qué, cuánto, cómo, quién.</p>
<h3>Lo neutro</h3>
<ul><li><b>lo + aggettivo</b> = ciò che è...: <i>lo bueno</i> (il bello), <i>lo mejor</i>, <i>lo importante</i>.</li><li><b>lo + aggettivo + que</b> = quanto: <i>No sabes lo difícil que es.</i> (quanto sia difficile); <i>Mira lo rápido que corre.</i></li><li><b>lo que</b> = ciò che: <i>Lo que dices es verdad.</i> <i>Todo lo que quieras.</i></li><li><b>lo de</b> = la questione di, la storia di: <i>lo de ayer</i> (quella cosa di ieri), <i>lo de tu hermano</i>.</li><li>Locuzioni fisse: <i>a lo mejor</i> (forse, con l'indicativo!), <i>por lo menos</i>, <i>lo antes posible</i>, <i>por lo tanto</i>, <i>lo cual</i> (il che).</li></ul>
<h3>Correlativi</h3>
<table><tr><th>Struttura</th><th>Esempio</th></tr>
<tr><td>ni... ni</td><td>No bebo ni vino ni cerveza. / Ni vino ni cerveza.</td></tr>
<tr><td>o... o</td><td>O vienes o te quedas.</td></tr>
<tr><td>tanto... como</td><td>Tanto Ana como Luis vienen.</td></tr>
<tr><td>cuanto más... más</td><td>Cuanto más estudio, más aprendo.</td></tr>
<tr><td>cuanto antes, mejor</td><td>Llámame cuanto antes.</td></tr>
<tr><td>no solo... sino también</td><td>No solo canta, sino también baila.</td></tr>
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
      "In spagnolo tra il nome e l'aggettivo si interpone tan o más: ¡qué casa tan/más grande! Si può dire «¡qué grande casa!» ma suona letterario.",
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
      '¡Qué casa tan/más grande! / ¡Cuánto trabajas! / ¡Cuánta gente hay! Nota: con più nomi, cuánto concorda (cuánta gente).',
    ),
    prac(
      'p4',
      'Traduci con «lo»: «Ciò che dici è vero», «Il bello è che costa poco», «Non immagini quanto sia stanco».',
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
