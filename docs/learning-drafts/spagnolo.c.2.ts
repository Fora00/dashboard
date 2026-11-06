import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './spagnolo.pron'

// Spanish course, extra grammar modules (completeness round 1): es-numeri2 (a2) and es-cambi (b1).

export const esNumeri2 = mod(
  'es-numeri2',
  'Ordinali, frazioni, percentuali, -mente e apocope',
  'Primero, la mitad, el 20 por ciento, rápidamente, buen / gran / primer / cien',
  'a2',
  `<p class="lead">Dopo i cardinali (già visti in <i>es-saluti</i>) servono quattro strumenti: ordinali, frazioni e percentuali, gli avverbi in <b>-mente</b> e le <b>forme accorciate</b> (apocope) che cambiano davanti al nome. Sono piccoli e molto frequenti; un italiano li sbaglia quasi sempre nello stesso modo.</p>
${PRON_SHORT}
<h3>Ordinali da 1.º a 10.º</h3>
<table><tr><th>N.</th><th>Ordinale</th><th>Pronuncia</th></tr>
<tr><td>1.º</td><td>primero (primer)</td><td>[pri-ME-ro]</td></tr>
<tr><td>2.º</td><td>segundo</td><td>[se-GUN-do]</td></tr>
<tr><td>3.º</td><td>tercero (tercer)</td><td>[ter-THE-ro]</td></tr>
<tr><td>4.º</td><td>cuarto</td><td>[KUAR-to]</td></tr>
<tr><td>5.º</td><td>quinto</td><td>[KIN-to]</td></tr>
<tr><td>6.º</td><td>sexto</td><td>[SEKS-to]</td></tr>
<tr><td>7.º</td><td>séptimo</td><td>[SEP-ti-mo]</td></tr>
<tr><td>8.º</td><td>octavo</td><td>[ok-TA-bo]</td></tr>
<tr><td>9.º</td><td>noveno</td><td>[no-BE-no]</td></tr>
<tr><td>10.º</td><td>décimo</td><td>[DE-thi-mo]</td></tr>
</table>
<p>Concordano in genere e numero (<i>la segunda planta</i>, <i>los primeros días</i>). <b>Primero</b> e <b>tercero</b> perdono la -o davanti a un maschile singolare: <i>el primer piso</i>, <i>el tercer día</i>, ma <i>la primera vez</i>, <i>la tercera fila</i>. Si abbreviano 1.º, 1.ª, 1.er, 3.er.</p>
<p>Oltre il decimo gli spagnoli usano quasi sempre i <b>cardinali</b>: <i>el piso once</i>, <i>el siglo veintiuno</i>, <i>Alfonso trece</i>, <i>el capítulo quince</i>. Con i re invece si usano gli ordinali fino al decimo: <i>Felipe sexto</i> (VI), <i>Carlos tercero</i>. Per le date il giorno è un cardinale: <i>el cinco de mayo</i>; solo il primo del mese ha anche l'ordinale: <i>el primero de mayo</i> (in Spagna anche <i>el uno de mayo</i>).</p>
<h3>Frazioni</h3>
<table><tr><th>Frazione</th><th>Spagnolo</th></tr>
<tr><td>1/2</td><td>la mitad; medio, media (adj.)</td></tr>
<tr><td>1/3</td><td>un tercio</td></tr>
<tr><td>1/4</td><td>un cuarto</td></tr>
<tr><td>3/4</td><td>tres cuartos</td></tr>
<tr><td>1/5</td><td>un quinto</td></tr>
<tr><td>1/10</td><td>un décimo</td></tr>
<tr><td>da 1/11</td><td>cardinale + -avo: un onceavo, dos doceavos</td></tr>
</table>
<p><b>Medio</b> è un aggettivo (<i>medio kilo</i>, <i>media hora</i>, <i>las tres y media</i>); <b>la mitad</b> è un nome (<i>la mitad de la clase</i>). Altri: <b>el doble</b>, <b>el triple</b>. <i>Gasto la mitad que tú.</i> (spendo la metà di te) Decimali: <i>3,5</i> = <i>tres coma cinco</i> (America spesso <i>tres punto cinco</i>).</p>
<h3>Percentuali</h3>
<p><b>por ciento</b> [por-THIEN-to]: <i>el cincuenta por ciento</i> (50 %). Si usa l'articolo (<i>el 20 %</i>) oppure <i>un 20 %</i> quando è un'indicazione approssimata o un cambiamento: <i>Hay un 20 % de descuento.</i> <i>Los precios subieron un 5 %.</i> Dopo percentuale + <i>de</i> + plurale, il verbo può restare singolare o andare al plurale: <i>El 30 % de los alumnos aprobó / aprobaron.</i> Altre formule: <i>la mayoría de</i> (la maggior parte), <i>uno de cada tres</i> (1 su 3), <i>una de cada diez personas</i>.</p>
<h3>Avverbi in -mente</h3>
<p>Si formano con l'<b>aggettivo al femminile singolare</b> + <b>-mente</b> (come l'italiano «-mente»): <i>lento → lentamente</i>, <i>rápido → rápidamente</i> [RRA-pi-dha-MEN-te], <i>fácil → fácilmente</i> [FA-thil-MEN-te], <i>claro → claramente</i> [kla-ra-MEN-te], <i>feliz → felizmente</i>.</p>
<ul><li>L'<b>accento</b> dell'aggettivo resta: <i>rápido → rápidamente</i>, <i>fácil → fácilmente</i>. In italiano la tilde non esiste, quindi è una dimenticanza frequente.</li><li><b>Doppio avverbio</b>: solo l'ultimo prende -mente e il primo resta al femminile: <i>Habla lenta y claramente.</i> (parla lentamente e chiaramente)</li><li>Spesso si può evitare con <i>con + nome</i> o <i>de forma + aggettivo</i>: <i>con cuidado</i> = <i>cuidadosamente</i>.</li><li>Molti aggettivi fanno da avverbio senza -mente: <i>hablar alto / bajo / claro</i>, <i>trabajar duro</i>, <i>ir recto / derecho</i>.</li><li>Non esistono: <i>bien</i> (non «buenamente»), <i>mal</i>, <i>pronto</i>, <i>ya</i>, <i>ahora</i>, <i>aquí</i>.</li><li>Frequenti: <i>realmente</i> [rre-al-MEN-te], <i>finalmente</i>, <i>solamente</i>, <i>últimamente</i> [UL-ti-ma-MEN-te] (negli ultimi tempi), <i>actualmente</i> (attualmente, non «actually»), <i>evidentemente</i>.</li></ul>
<h3>Apocope: forme accorciate davanti al nome</h3>
<table><tr><th>Forma piena</th><th>Accorciata (davanti a)</th><th>Esempio</th></tr>
<tr><td>uno</td><td>un (m. sing.)</td><td>un libro</td></tr>
<tr><td>alguno / ninguno</td><td>algún / ningún (m. sing.)</td><td>algún día</td></tr>
<tr><td>bueno / malo</td><td>buen / mal (m. sing.)</td><td>un buen amigo, un mal día</td></tr>
<tr><td>primero / tercero</td><td>primer / tercer (m. sing.)</td><td>el primer piso</td></tr>
<tr><td>grande</td><td>gran (m. e f. sing., davanti al nome)</td><td>un gran hombre, una gran mujer</td></tr>
<tr><td>ciento</td><td>cien (davanti a nome o a mil, millones)</td><td>cien euros, cien mil</td></tr>
<tr><td>Santo</td><td>San (davanti a nome proprio, tranne Tomás, Tomé, Domingo, Toribio)</td><td>San Pedro, Santo Domingo</td></tr>
<tr><td>cualquiera</td><td>cualquier (davanti a nome, m./f.)</td><td>cualquier persona</td></tr>
</table>
<p>Attenzione ai due significati di <b>grande</b>: <i>un gran hombre</i> (grande, eccezionale) e <i>un hombre grande</i> (alto, corpulento). Con i numeri: <i>cien</i> da solo, <i>ciento</i> prima di un numero più piccolo (<i>ciento veinte</i>). Davanti a un femminile che comincia con a- tonica si usa <i>el / un</i> (<i>el agua, un águila</i>) ma l'aggettivo resta femminile: <i>el agua fría</i>.</p>
<div class="say"><b>Da ricordare.</b> «Accorcia buen, mal, primer, tercer, gran, algún solo davanti al nome maschile singolare (gran anche femminile), ricorda la tilde in rápidamente e usa i cardinali oltre il decimo.» <i>Es un buen amigo y vive en el tercer piso.</i> [es un buen a-MI-go i BI-be en el ter-THER PI-sso]</div>`,
  [
    q(
      'q1',
      'Come si dice «il terzo piano»?',
      ['el tercer piso', 'el tercero piso', 'el tercera piso', 'el piso tercer'],
      0,
      'Tercero perde la -o davanti a un nome maschile singolare. La forma tercera sarebbe femminile e non concorda con piso.',
    ),
    q(
      'q2',
      'Come si dice di solito «il capitolo 15»?',
      ['el capítulo quince', 'el capítulo quinceavo', 'el capítulo décimo cinco', 'el capítulo quinceno'],
      0,
      "Oltre il decimo si usano normalmente i cardinali dopo il nome. Quinceavo indica la frazione 1/15, non l'ordine.",
    ),
    q(
      'q3',
      'Come si dice «le tre e mezza»?',
      ['las tres y media', 'las tres y medio', 'las tres y mitad', 'las tres y la mitad'],
      0,
      "Medio è un aggettivo e concorda con hora (sottinteso, femminile): media. Mitad è un nome e non si usa con l'ora.",
    ),
    q(
      'q4',
      'Come si dice «Il prezzo è salito del 5 %»?',
      [
        'El precio subió un 5 por ciento.',
        'El precio subió el 5 por cento.',
        'El precio subió 5 al cien.',
        'El precio subió un 5 de ciento.',
      ],
      0,
      "Per cento si dice por ciento, e per un cambiamento si usa di solito l'articolo un. «Por cento» è un calco italiano.",
    ),
    q(
      'q5',
      "Qual è l'avverbio di «rápido»?",
      ['rápidamente', 'rapidamente', 'rápidomente', 'rápidamientos'],
      0,
      "Si aggiunge -mente alla forma femminile e si mantiene la tilde dell'aggettivo: rápida + mente. La grafia italiana senza tilde è un errore.",
    ),
    q(
      'q6',
      'Quale frase è corretta per «Parla lentamente e chiaramente»?',
      [
        'Habla lenta y claramente.',
        'Habla lentamente y claro.',
        'Habla lento y claramente.',
        'Habla lentamente y clara.',
      ],
      0,
      "Con due avverbi in -mente coordinati, la norma vuole il suffisso solo sull'ultimo e il primo resta al femminile. Le altre forme mescolano aggettivi e avverbi.",
    ),
    q(
      'q7',
      'Quale frase usa correttamente «gran»?',
      ['Es una gran mujer.', 'Es una grande mujer.', 'Es un gran mujer.', 'Es una mujer gran.'],
      0,
      'Gran vale per maschile e femminile ed è usato solo prima del nome singolare. La forma piena grande va dopo il nome (una mujer grande = corpulenta).',
    ),
    q(
      'q8',
      'Come si dice «cento euro»?',
      ['cien euros', 'ciento euros', 'cientos euros', 'un cien euros'],
      0,
      'Cien si usa davanti a un nome e da solo; ciento solo davanti a un numero più piccolo (ciento diez). Cientos è plurale e indica «centinaia».',
    ),
    q(
      'q9',
      'Quale parola significa «la metà di»?',
      ['la mitad de', 'el medio de', 'una media de', 'un medio de'],
      0,
      "La mitad è un nome femminile («la metà»). Medio è l'aggettivo (medio kilo) e media è «la media statistica».",
    ),
    q(
      'q10',
      'Che significa «últimamente»?',
      ['negli ultimi tempi', 'alla fine', 'in modo definitivo', "per l'ultima volta"],
      0,
      "Últimamente è usato soprattutto con il perfecto: «últimamente he dormido poco». Finalmente significa «alla fine» e por última vez è «per l'ultima volta».",
    ),
  ],
  [
    card(
      'c1',
      'primero, segundo, tercero',
      'Fino a décimo (10.º). Primer/tercer davanti a un maschile singolare. Oltre il 10: cardinali.',
    ),
    card(
      'c2',
      'la mitad / medio',
      'Mitad = nome (la mitad de); medio = aggettivo (medio kilo, media hora, las tres y media).',
    ),
    card('c3', 'un tercio, un cuarto, tres cuartos', 'Frazioni fino al 10; da 1/11 cardinale + -avo (un onceavo).'),
    card('c4', 'el doble, el triple', 'Il doppio, il triplo: Gana el doble que yo.'),
    card('c5', 'el 20 por ciento', 'El 20 % / un 20 %. Verbo singolare o plurale con «de los...».'),
    card('c6', 'uno de cada tres', '1 persona su 3. La mayoría de = la maggior parte di.'),
    card(
      'c7',
      '-mente',
      'Aggettivo femminile + -mente: lenta → lentamente. Tilde conservata: rápidamente, fácilmente.',
    ),
    card('c8', 'doppio -mente', "Solo l'ultimo: lenta y claramente. Alternativa: con cuidado."),
    card(
      'c9',
      'buen, mal, primer, tercer, algún, ningún',
      'Solo davanti a un maschile singolare (un buen día; una buena idea).',
    ),
    card(
      'c10',
      'gran vs grande',
      'Gran + nome = grande/eccezionale (una gran idea); nome + grande = di dimensioni (una casa grande).',
    ),
    card('c11', 'cien / ciento', 'cien euros, cien mil; ciento uno, ciento veinte.'),
    card('c12', 'San / Santo', 'San Pedro, San José, ma Santo Tomás, Santo Domingo, Santo Tomé.'),
  ],
  [
    prac(
      'p1',
      'Scrivi in lettere: 2.º, 4.º, 7.º, 9.º, 10.º e poi 12 (piso), 21 (siglo).',
      'segundo, cuarto, séptimo, noveno, décimo; el piso doce; el siglo veintiuno. Oltre il 10 si usano i cardinali dopo il nome.',
    ),
    prac(
      'p2',
      "Traduci: «Il primo giorno», «la terza volta», «il quarto piano», «metà del tempo», «un quarto d'ora».",
      'el primer día; la tercera vez; el cuarto piso; la mitad del tiempo; un cuarto de hora.',
    ),
    prac(
      'p3',
      'Trasforma in avverbi in -mente: lento, claro, fácil, feliz, último, actual, fácil y rápido (doppio).',
      "lentamente, claramente, fácilmente, felizmente, últimamente, actualmente; fácil y rápidamente (solo l'ultimo con -mente).",
    ),
    prac(
      'p4',
      'Correggi: «Es un grande amico.», «Tengo un buena idea.», «El tercero día vamos.», «Cuesta ciento euros.»',
      'Es un gran amigo. / Tengo una buena idea. / El tercer día vamos. / Cuesta cien euros. (gran, buen, tercer solo davanti a maschile singolare; cien davanti a un nome).',
    ),
    prac(
      'p5',
      'Traduci: «Il 40 % degli studenti è italiano», «La benzina è aumentata del 3 %», «Uno su quattro non lo sa».',
      'El 40 % de los estudiantes es italiano (o son italianos). / La gasolina ha subido un 3 %. / Uno de cada cuatro no lo sabe.',
    ),
    prac(
      'p6',
      'Spiega la differenza tra «un gran hombre» e «un hombre grande».',
      'Gran hombre = persona eccezionale, di grande valore; hombre grande = persona di grandi dimensioni (alta, corpulenta) o adulta. Il significato cambia con la posizione.',
    ),
  ],
)

export const esCambi = mod(
  'es-cambi',
  'Se involontario, verbi di cambio e participio',
  'Se me cayó, ponerse / volverse / hacerse / quedarse, estar + participio, comparativi e -ísimo',
  'b1',
  `<p class="lead">Quattro costruzioni che fanno suonare naturale uno spagnolo B1: la forma «mi è successo, non l'ho fatto apposta», i verbi che esprimono «diventare» (in spagnolo ce ne sono almeno cinque), il participio usato come aggettivo e i comparativi completi con l'assoluto in <b>-ísimo</b>.</p>
${PRON_SHORT}
<h3>Se involontario</h3>
<p>Per dire che un evento «è capitato a me» e non ne sono responsabile si usa: <b>se + me / te / le / nos / os / les + verbo alla 3ª persona</b>. Il verbo concorda con la <b>cosa</b>, non con la persona.</p>
<table><tr><th>Spagnolo</th><th>Italiano</th></tr>
<tr><td>Se me cayó el vaso.</td><td>Mi è caduto il bicchiere.</td></tr>
<tr><td>Se me olvidaron las llaves.</td><td>Mi sono dimenticato le chiavi.</td></tr>
<tr><td>Se nos acabó el tiempo.</td><td>Ci è finito il tempo.</td></tr>
<tr><td>A Juan se le perdió el móvil.</td><td>A Juan si è perso il cellulare.</td></tr>
<tr><td>Se me ha roto el ordenador.</td><td>Mi si è rotto il computer.</td></tr>
<tr><td>Se me ocurrió una idea.</td><td>Mi è venuta un'idea.</td></tr>
</table>
<p>Confronta: <i>Rompí el vaso</i> [rrom-PI el BA-sso] = l'ho rotto io (colpa mia); <i>Se me rompió el vaso</i> = mi si è rotto (è successo). Verbi tipici: <b>caer, olvidar, perder, romper, acabar, ocurrir, quedar</b> (<i>se me quedó en casa</i>, l'ho lasciato a casa), <i>escapar</i>. Espressioni: <i>se me hace tarde</i> (si fa tardi), <i>se me ha ido el santo al cielo</i> (ho perso il filo). Per rafforzare: <i>a mí se me olvidó</i>.</p>
<h3>Verbi di cambio: «diventare»</h3>
<table><tr><th>Verbo</th><th>Uso</th><th>Esempio</th></tr>
<tr><td>ponerse + agg.</td><td>cambio temporaneo (stato fisico, emozione, colore)</td><td>Me puse nervioso.</td></tr>
<tr><td>volverse + agg./nome</td><td>cambio improvviso o profondo</td><td>Se volvió loco.</td></tr>
<tr><td>hacerse + nome/agg.</td><td>cambio voluntario o graduale (professione, religione)</td><td>Se hizo médico.</td></tr>
<tr><td>llegar a ser + nome/agg.</td><td>risultato dopo uno sforzo</td><td>Llegó a ser presidente.</td></tr>
<tr><td>convertirse en + nome</td><td>trasformazione</td><td>Se convirtió en una estrella.</td></tr>
<tr><td>quedarse + agg.</td><td>risultato di una perdita o situazione</td><td>Se quedó sordo.</td></tr>
</table>
<p>Altri esempi: <i>ponerse rojo</i> [po-NER-se RRO-ho] (arrossire), <i>ponerse enfermo</i>, <i>hacerse mayor</i> (crescere), <i>hacerse rico</i>, <i>quedarse solo</i>, <i>quedarse sin dinero</i>, <i>quedarse dormido</i> (addormentarsi), <i>volverse desconfiado</i>. Il verbo «diventare» ha anche <i>pasar a ser</i>, <i>acabar siendo</i>. Con attività: <i>ponerse a + inf.</i> = mettersi a (<i>Se puso a llorar</i>), <i>volver a + inf.</i> = rifare (<i>Volvió a llamar</i>).</p>
<h3>Ser o estar + participio</h3>
<ul><li><b>estar + participio</b> = stato risultante: <i>La puerta está cerrada.</i> <i>Estamos cansados.</i> <i>Está prohibido fumar.</i> Il participio concorda.</li><li><b>ser + participio</b> = passiva, azione con agente: <i>La puerta fue cerrada por el portero.</i> (In pratica preferisci <i>El portero cerró la puerta</i> o la passiva con <i>se</i>.)</li><li>Aggettivi che cambiano senso: <i>estar aburrido</i> (annoiato) / <i>ser aburrido</i> (noioso); <i>estar listo</i> (pronto) / <i>ser listo</i> (furbo); <i>estar interesado</i> / <i>ser interesado</i> (interessato).</li><li>Il participio si usa anche come nome: <i>los heridos</i> (i feriti), <i>lo dicho</i> (quanto detto), e in costruzione assoluta: <i>Terminada la reunión, salimos.</i> <i>Una vez terminado el trabajo, descansé.</i></li><li>Con <b>tener, llevar, dejar</b> + participio che concorda con l'oggetto: <i>Tengo escritas tres cartas.</i> <i>Llevo hechas dos páginas.</i> <i>Dejó la puerta abierta.</i> Con <i>haber</i> invece resta invariabile.</li></ul>
<h3>Comparativi in dettaglio</h3>
<table><tr><th>Struttura</th><th>Esempio</th></tr>
<tr><td>más / menos + agg. + que</td><td>Es más alto que yo.</td></tr>
<tr><td>más de / menos de + numero</td><td>Hay más de tres personas.</td></tr>
<tr><td>tan + agg./avv. + como</td><td>Es tan alta como tú.</td></tr>
<tr><td>tanto/a/os/as + nome + como</td><td>Tengo tantos libros como tú.</td></tr>
<tr><td>verbo + tanto como</td><td>Trabaja tanto como yo.</td></tr>
<tr><td>igual de + agg. + que</td><td>Es igual de caro que aquél.</td></tr>
<tr><td>más + agg. + de lo que + verbo</td><td>Es más difícil de lo que pensaba.</td></tr>
<tr><td>tan + agg. + que + verbo</td><td>Es tan alto que no cabe.</td></tr>
</table>
<p>Irregolari: <b>mejor, peor, mayor, menor</b> (<i>mayor</i>/<i>menor</i> per l'età o l'importanza: <i>mi hermano mayor</i>). Superlativo relativo: <b>el / la / lo más + agg. + de</b>: <i>la más alta de la clase</i>, <i>el mejor de todos</i>. Neutro: <i>lo mejor</i>, <i>lo más importante</i>.</p>
<h3>Superlativo assoluto in -ísimo</h3>
<p>Si forma con la fine dell'aggettivo (senza vocale finale) + <b>-ísimo</b>: <i>carísimo</i> [ka-RI-ssi-mo], <i>riquísimo</i>, <i>facilísimo</i>, <i>buenísimo</i>, <i>muchísimo</i>, <i>poquísimo</i>, <i>grandísimo</i>. Cambi ortografici: <b>-co → -quísimo</b> (<i>riquísimo</i>, da rico), <b>-go → -guísimo</b> (<i>larguísimo</i>), <b>-z → -císimo</b> (<i>felicísimo</i>), <b>-ble → -bilísimo</b> (<i>amabilísimo</i>). Come l'italiano <i>-issimo</i>, ma la tilde cade sempre sulla i. Colloquiali: <i>súper</i> + agg., <i>requete-</i>.</p>
<h3>Trappole italiane</h3>
<ul><li>«Più di tre» = <b>más de tres</b> (non «más que tres», che vale «solo»: <i>No tengo más que tres</i> = ne ho solo tre).</li><li>«Il più alto della classe» = <b>el más alto de la clase</b> (preposizione <i>de</i>, non <i>en</i>).</li><li>«Sono diventato rosso» = <b>me puse rojo</b>, non «me devine».</li><li>«Mi sono dimenticato di...» si dice di solito <b>se me olvidó</b> + cosa; <b>me olvidé de</b> + infinito/nome è corretto ma meno scorrevole.</li></ul>
<div class="say"><b>Da ricordare.</b> «Per le disgrazie usa se me; per "diventare" scegli ponerse (temporaneo), hacerse (volontario), volverse (profondo), quedarse (esito).» <i>Se me cayó el café y me puse rojo.</i> [se me ka-YO el ka-FE i me PU-sse RRO-ho]</div>`,
  [
    q(
      'q1',
      'Quale frase esprime che il bicchiere è caduto «per sbaglio, a me»?',
      ['Se me cayó el vaso.', 'Yo cayó el vaso.', 'Me caí el vaso.', 'Se cayó yo el vaso.'],
      0,
      'Nel se involontario il verbo concorda con la cosa (el vaso) e il me indica la persona coinvolta. Me caí significherebbe «sono caduto io».',
    ),
    q(
      'q2',
      'Quale forma è corretta per «mi sono dimenticato le chiavi»?',
      [
        'Se me olvidaron las llaves.',
        'Se me olvidó las llaves.',
        'Me se olvidaron las llaves.',
        'Se me olvidé las llaves.',
      ],
      0,
      'Il verbo concorda con le llaves (plurale), quindi olvidaron. La successione corretta è se prima di me, mai «me se».',
    ),
    q(
      'q3',
      'Quale verbo si usa per «arrossire»?',
      ['ponerse rojo', 'hacerse rojo', 'volverse rojo', 'llegar a ser rojo'],
      0,
      'Ponerse indica un cambio temporaneo di stato fisico o emotivo, come un colore. Hacerse e volverse implicano un cambio più duraturo.',
    ),
    q(
      'q4',
      'Quale verbo scegli per «è diventato medico» (scelta professionale)?',
      ['se hizo médico', 'se puso médico', 'se quedó médico', 'se volvió médico'],
      0,
      'Hacerse + professione indica un cambio voluntario e graduale. Ponerse e quedarse esprimono stati, non professioni.',
    ),
    q(
      'q5',
      'Che cosa significa «Se quedó sordo»?',
      [
        'È diventato sordo (risultato)',
        'Ha finto di essere sordo',
        'È sempre stato sordo',
        'Ha deciso di non ascoltare',
      ],
      0,
      'Quedarse + aggettivo descrive il risultato di una perdita o di una situazione. Non indica una scelta ma uno stato che si è creato.',
    ),
    q(
      'q6',
      'Quale frase è una passiva con ser?',
      [
        'La puerta fue cerrada por el portero.',
        'La puerta está cerrada.',
        'La puerta se cerró sola.',
        'La puerta tiene cerrada.',
      ],
      0,
      "Con ser + participio + por + agente si esprime un'azione. Estar cerrada descrive solo lo stato finale della porta.",
    ),
    q(
      'q7',
      'Quale frase è corretta con «tener + participio»?',
      [
        'Tengo escritas tres cartas.',
        'Tengo escrito tres cartas.',
        'Tengo escribido tres cartas.',
        'Tengo escritos tres cartas.',
      ],
      0,
      "Con tener il participio concorda con l'oggetto (cartas, femminile plurale), mentre con haber resta invariabile.",
    ),
    q(
      'q8',
      'Quale superlativo assoluto è corretto per «rico»?',
      ['riquísimo', 'ricísimo', 'ricoísimo', 'riquimo'],
      0,
      'Davanti a -ísimo la c finale diventa qu per mantenere il suono duro: rico → riquísimo, come largo → larguísimo.',
    ),
    q(
      'q9',
      'Come si dice «È più difficile di quanto pensassi»?',
      [
        'Es más difícil de lo que pensaba.',
        'Es más difícil que pensaba.',
        'Es más difícil como pensaba.',
        'Es más difícil de que pensaba.',
      ],
      0,
      'Quando il secondo termine è una frase si usa de lo que (o de la que, de los que...). Que da solo introduce un nome o un pronome.',
    ),
    q(
      'q10',
      'Quale frase significa «Ho solo tre euro»?',
      [
        'No tengo más que tres euros.',
        'Tengo más de tres euros.',
        'Tengo menos que tres euros.',
        'Tengo tres euros más.',
      ],
      0,
      'No... más que significa «solo», mentre más de + numero significa «più di». La differenza è di senso, non di grammatica.',
    ),
  ],
  [
    card(
      'c1',
      'se + me/te/le + verbo',
      'Se involontario: Se me cayó el vaso. Il verbo concorda con la cosa, non con la persona.',
    ),
    card('c2', 'ponerse', 'Cambio temporaneo: ponerse nervioso, rojo, triste, enfermo.'),
    card('c3', 'volverse', 'Cambio profondo o improvviso: volverse loco, volverse desconfiado.'),
    card('c4', 'hacerse', 'Cambio voluntario o graduale: hacerse médico, rico, mayor, vegetariano.'),
    card('c5', 'quedarse', 'Risultato: quedarse solo, ciego, sordo, dormido, sin dinero.'),
    card('c6', 'convertirse en', 'Trasformazione: el agua se convierte en hielo; se convirtió en una estrella.'),
    card('c7', 'llegar a ser', 'Dopo uno sforzo: Llegó a ser presidente.'),
    card(
      'c8',
      'estar + participio',
      'Risultato/stato (concorda): La puerta está cerrada. Con ser = passiva con agente.',
    ),
    card('c9', 'tener/llevar/dejar + participio', "Il participio concorda con l'oggetto: Tengo escritas tres cartas."),
    card('c10', 'más de lo que', 'Seconda parte con verbo: Es más difícil de lo que pensaba.'),
    card(
      'c11',
      'tan... como / tanto... como',
      'tan + agg./avv.; tanto/a/os/as + nome: tan alto como tú, tantos libros como tú.',
    ),
    card('c12', '-ísimo', 'Superlativo assoluto: carísimo; -co → -quísimo (riquísimo); -z → -císimo (felicísimo).'),
  ],
  [
    prac(
      'p1',
      'Traduci con se involontario: «Mi è finito il caffè», «A Marta è caduto il telefono», «Ci si sono dimenticati i biglietti».',
      'Se me acabó el café. / A Marta se le cayó el teléfono. / Se nos olvidaron los billetes. (il verbo concorda con la cosa).',
    ),
    prac(
      'p2',
      'Scegli il verbo di cambio: «___ rojo» (arrossire), «___ ciego» (perdere la vista), «___ médico» (scelta), «___ en una estrella».',
      'Me puse rojo; Se quedó ciego; Se hizo médico; Se convirtió en una estrella.',
    ),
    prac(
      'p3',
      'Differenza di senso: «Es aburrido / Está aburrido» e «Es listo / Está listo».',
      'Es aburrido = è noioso; está aburrido = si annoia. Es listo = è furbo; está listo = è pronto.',
    ),
    prac(
      'p4',
      'Traduci: «Ha tre quaderni scritti», «Lasciò la finestra aperta», «Una volta finito il lavoro, uscì».',
      'Tiene escritos tres cuadernos (o Tiene tres cuadernos escritos). / Dejó la ventana abierta. / Una vez terminado el trabajo, salió.',
    ),
    prac(
      'p5',
      'Traduci: «È alto come me», «Ha più di venti libri», «È più grande di quanto sembrava», «È la più simpatica della classe».',
      'Es tan alto como yo (o igual de alto que yo). / Tiene más de veinte libros. / Es más grande de lo que parecía. / Es la más simpática de la clase.',
    ),
    prac(
      'p6',
      'Forma il superlativo assoluto: caro, rico, largo, feliz, amable, fácil.',
      'carísimo, riquísimo, larguísimo, felicísimo, amabilísimo, facilísimo.',
    ),
  ],
)
