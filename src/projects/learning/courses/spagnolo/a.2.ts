import { card, mod, prac, q } from '../kit'

// Spanish course, A1: nouns and adjectives, present tense, daily life.
// Pronunciation convention: see the header of spagnolo.a.ts ([ ] = Italian-based, STRESS in capitals, th, h, ss, gn, dh).

export const esNomi = mod(
  'es-nomi',
  'Nomi, articoli, aggettivi, possessivi',
  'Genere e plurale, articoli (lo neutro, al/del), aggettivi, possessivi, dimostrativi, muy/mucho',
  'a1',
  `<p class="lead">Il sistema è molto vicino all'italiano, ma ci sono trappole precise: il genere di alcune parole è diverso, il possessivo non vuole l'articolo e «molto» si traduce in due modi. Le pronunce sono scritte alla maniera italiana ([th] = think, [h] = jota).</p>
<h3>Genere</h3>
<ul><li>Di norma <b>-o</b> maschile, <b>-a</b> femminile: <b>el libro</b> [el LI-bro], <b>la casa</b> [la KA-ssa].</li><li>Femminili: <b>-ción, -sión</b> (<b>la canción</b> [la kan-THION]), <b>-dad, -tud</b> (<b>la ciudad</b> [la thiu-DADH]), <b>-umbre</b>.</li><li>Maschili: <b>-aje</b> (<b>el viaje</b> [el BIA-he]), <b>-or</b> (<b>el color</b> [el ko-LOR]), e le parole greche in <b>-ma</b>: <b>el problema</b> [el pro-BLE-ma], <b>el idioma</b> [el i-DHIO-ma], <b>el tema</b>, <b>el sistema</b>, <b>el programa</b>, <b>el clima</b>. Altri maschili in -a, eccezioni isolate (non sono parole greche in -ma): <b>el mapa</b> [el MA-pa], <b>el día</b> [el DI-a], <b>el planeta</b>.</li><li>Eccezioni in -o femminili: <b>la mano</b> [la MA-no], <b>la foto</b>, <b>la moto</b>.</li></ul>
<table><tr><th>Italiano</th><th>Spagnolo</th><th>Genere diverso</th></tr>
<tr><td>il latte</td><td>la leche [la LE-ce]</td><td>femminile</td></tr>
<tr><td>il sangue</td><td>la sangre [la SAN-gre]</td><td>femminile</td></tr>
<tr><td>il sale</td><td>la sal [la SAL]</td><td>femminile</td></tr>
<tr><td>il miele</td><td>la miel [la MIEL]</td><td>femminile</td></tr>
<tr><td>il naso</td><td>la nariz [la na-RITH]</td><td>femminile</td></tr>
<tr><td>il fiore</td><td>la flor [la FLOR]</td><td>femminile</td></tr>
<tr><td>il segnale</td><td>la señal [la se-GNAL]</td><td>femminile</td></tr>
</table>
<p><b>La gente</b> [la HEN-te] è singolare: <b>La gente es simpática</b>. Il nome <b>agua</b> femminile prende <b>el</b> davanti per l'accento: <b>el agua fría</b> [el A-gua FRI-a] (aggettivo al femminile), plurale <b>las aguas</b>; così <b>el hambre</b> (<b>mucha hambre</b>) e <b>el águila</b>.</p>
<h3>Plurale</h3>
<table><tr><th>Finale</th><th>Regola</th><th>Esempio</th></tr>
<tr><td>vocale</td><td>+ -s</td><td>casa → casas [KA-ssas]</td></tr>
<tr><td>consonante</td><td>+ -es</td><td>ciudad → ciudades [thiu-DA-dhes]</td></tr>
<tr><td>-z</td><td>-ces</td><td>lápiz → lápices [LA-pi-thes]</td></tr>
<tr><td>-s non accentata</td><td>invariabile</td><td>el lunes → los lunes</td></tr>
<tr><td>-ón, -ión...</td><td>-ones, tilde cade</td><td>canción → canciones [kan-THIO-nes]</td></tr>
</table>
<p>L'accento resta sulla stessa sillaba: <b>joven</b> [HO-ben] → <b>jóvenes</b> [HO-be-nes], <b>examen</b> → <b>exámenes</b>. Con nomi misti il plurale è maschile: <b>los padres</b> [los PA-dres] (genitori e padri).</p>
<h3>Articoli</h3>
<table><tr><th></th><th>determinativo</th><th>indeterminativo</th></tr>
<tr><td>m. sing.</td><td>el [el]</td><td>un [un]</td></tr>
<tr><td>f. sing.</td><td>la [la]</td><td>una [U-na]</td></tr>
<tr><td>m. plur.</td><td>los [los]</td><td>unos [U-nos]</td></tr>
<tr><td>f. plur.</td><td>las [las]</td><td>unas [U-nas]</td></tr>
</table>
<ul><li>Contrazioni solo con <b>el</b>: <b>a + el = al</b> (<b>voy al cine</b> [BOI al THI-ne]), <b>de + el = del</b> (<b>el coche del abuelo</b>). Non c'è «sul/nel/dal»: <b>en el, desde el, sobre el</b>.</li><li><b>Lo neutro</b> davanti a un aggettivo: <b>lo bueno</b> [lo BUE-no] (la cosa buona), <b>lo importante</b>, <b>lo que</b> (ciò che). Non esiste maschile/femminile qui.</li><li>Senza articolo: professione dopo ser (<b>soy profesor</b>), lingue dopo hablar (<b>hablo español</b>). Con i giorni si usa invece <b>el</b>: <b>el lunes tengo clase</b>.</li></ul>
<h3>Aggettivi</h3>
<p>Concordano in genere e numero e di solito stanno dopo il nome: <b>un coche rojo</b> [un KO-ce RRO-ho], <b>casas grandes</b>. In <b>-o</b> cambiano (alto/alta), in <b>-e</b> o consonante sono uguali (<b>grande, inteligente, fácil, azul</b>); le nazionalità e quelli in -or fanno il femminile con -a (<b>trabajador/trabajadora</b>). Davanti al nome maschile singolare perdono la fine: <b>buen, mal, primer, tercer, algún, ningún, gran</b> (e <b>un</b>, <b>cualquier</b>, <b>san</b>): <b>un buen amigo</b> [un buen a-MI-go], <b>un mal día</b>, <b>el primer día</b>. <b>Gran</b> (importante/grande) vale per maschile e femminile: <b>una gran mujer</b>. Il senso cambia con la posizione: <b>un viejo amigo</b> (vecchia conoscenza) ≠ <b>un amigo viejo</b> (anziano).</p>
<h3>Avverbi in -mente</h3>
<p>Si formano dal <b>femminile</b> dell'aggettivo + <b>-mente</b>: <b>rápida → rápidamente</b> [rra-pi-dha-MEN-te], <b>lenta → lentamente</b>, <b>clara → claramente</b>. Se l'aggettivo ha una forma sola si aggiunge direttamente: <b>fácil → fácilmente</b> [FA-thil-MEN-te], <b>feliz → felizmente</b>. La tilde dell'aggettivo resta. Con due avverbi in serie, -mente solo sull'ultimo: <b>lenta y cuidadosamente</b>. Molti avverbi hanno forma propria: <b>bien, mal, muy, mucho, poco</b>; nel parlato si sente anche l'aggettivo come avverbio (<b>habla rápido</b>).</p>
<h3>Possessivi</h3>
<table><tr><th>Possessore</th><th>Prima del nome</th><th>Dopo / da solo</th></tr>
<tr><td>mio</td><td>mi [MI], mis</td><td>mío [MI-o]</td></tr>
<tr><td>tuo</td><td>tu [TU], tus</td><td>tuyo [TU-yo]</td></tr>
<tr><td>suo, Suo, loro</td><td>su [SU], sus</td><td>suyo [SU-yo]</td></tr>
<tr><td>nostro</td><td>nuestro/a [NUES-tro]</td><td>nuestro</td></tr>
<tr><td>vostro</td><td>vuestro/a [BUES-tro]</td><td>vuestro</td></tr>
</table>
<p><b>Trappola</b>: l'italiano «il mio libro» è <b>mi libro</b> (senza articolo), «i miei amici» <b>mis amigos</b>. Le forme lunghe seguono il nome o stanno da sole: <b>un amigo mío</b>, <b>¿Es tuyo?</b> [ES TU-yo]. <b>Su</b> è ambiguo (di lui, di lei, di Lei, di loro): se serve chiarezza <b>la casa de ella</b>.</p>
<h3>Dimostrativi e luoghi</h3>
<p>Tre gradi, non due: <b>este</b> [ES-te] / <b>esta</b> [ES-ta] (vicino a me), <b>ese</b> [E-sse] / <b>esa</b> [E-ssa] (vicino a te), <b>aquel/aquella</b> [a-KEL] (lontano da entrambi); plurali <b>estos, esos, aquellos</b>; neutri <b>esto</b> [ES-to], <b>eso</b> [E-sso], <b>aquello</b> [a-KE-yo] per oggetti non identificati: <b>¿Qué es esto?</b>. Luoghi: <b>aquí</b> [a-KI], <b>ahí</b> [a-I], <b>allí</b> [a-YI].</p>
<h3>Muy e mucho</h3>
<ul><li><b>Muy</b> [MUI] davanti ad aggettivi e avverbi: <b>muy bueno</b>, <b>muy bien</b>, <b>muy tarde</b>. Mai davanti a nomi: <b>«muy gente»</b> è errore.</li><li><b>Mucho</b> [MU-cio] davanti ai nomi, concorda: <b>mucho trabajo</b>, <b>mucha gente</b> [MU-cia HEN-te], <b>muchos amigos</b>, e dopo i verbi: <b>trabajo mucho</b>. <b>Tengo mucha hambre</b> [TEN-go MU-cia AM-bre].</li><li><b>Demasiado</b> (troppo) e <b>bastante</b> (abbastanza) seguono la stessa logica: davanti ai nomi concordano (<b>demasiada gente</b> [de-ma-SSIA-dha HEN-te], <b>bastantes amigos</b>); davanti ad aggettivi e dopo i verbi restano invariabili (<b>demasiado caro</b>, <b>bastante bien</b>, <b>trabajo demasiado</b>). Mai «muy mucho».</li></ul>
<div class="say"><b>Da dire.</b> «Mi madre tiene mucha paciencia y mis amigos son muy simpáticos.» [mi MA-dre TIE-ne MU-cia pa-THIEN-thia i mis a-MI-gos SON MUI sim-PA-ti-kos]</div>`,
  [
    q(
      'q1',
      'Come dici «il mio libro»?',
      ['mi libro', 'el mi libro', 'el mío libro', 'mío libro'],
      0,
      "Il possessivo davanti al nome sostituisce l'articolo: non si dice «el mi libro» come in italiano «il mio libro».",
    ),
    q(
      'q2',
      "Qual è l'articolo corretto per «problema»?",
      ['el problema', 'la problema', 'los problema', 'una problema'],
      0,
      'Le parole greche in -ma (problema, tema, sistema, idioma) sono maschili anche se finiscono in a: el problema.',
    ),
    q(
      'q3',
      'Qual è il plurale di «lápiz» (matita)?',
      ['lápices', 'lápizes', 'lápiz', 'lapices senza tilde'],
      0,
      "Le parole in -z cambiano la z in c davanti a -es, e l'accento resta sulla stessa sillaba, quindi la tilde si mantiene: lápices.",
    ),
    q(
      'q4',
      'Come dici «ho molta fame»?',
      ['Tengo mucha hambre', 'Tengo muy hambre', 'Tengo mucho hambre', 'Estoy mucha hambre'],
      0,
      'Hambre è femminile (anche se prende el) e muy non va davanti ai nomi: serve mucho concordato, quindi mucha hambre.',
    ),
    q(
      'q5',
      'Come dici «una grande donna» (nel senso di importante)?',
      ['una gran mujer', 'una grande mujer', 'una mujer gran', 'un gran mujer'],
      0,
      'Gran si apocopa davanti al nome (anche femminile) e prima del nome vale importante; dopo il nome significherebbe solo grande di taglia.',
    ),
    q(
      'q6',
      "Come dici «l'acqua fredda»?",
      ['el agua fría', 'la agua fría', 'el agua frío', 'la agua frío'],
      0,
      "Agua è femminile ma prende el per l'accento sulla a iniziale; l'aggettivo concorda al femminile: fría.",
    ),
    q(
      'q7',
      'Qual è il plurale di «canción» e come si legge?',
      ['canciones [kan-THIO-nes]', 'cancións [kan-THIONS]', 'canciónes [kan-thio-NES]', 'cancions [kan-THIONS]'],
      0,
      "Canción è aguda e ha la tilde; con -es l'accento resta su -ció- ma diventa penultimo, e una llana in -s non richiede la tilde.",
    ),
    q(
      'q8',
      "Dove cade l'accento di «aquel»?",
      [
        "sull'ultima sillaba: [a-KEL]",
        'sulla prima sillaba: [A-kel]',
        'su due sillabe: [A-KEL]',
        'sulla a finale: [a-ke-LA]',
      ],
      0,
      "È una parola che finisce in consonante diversa da n/s: l'accento è sull'ultima sillaba senza tilde.",
    ),
    q(
      'q9',
      'Come si legge il plurale di «ciudad»?',
      ['[thiu-DA-dhes]', '[thiu-DA-des]', '[kiu-DA-des]', '[thiu-dha-DES]'],
      0,
      "La c davanti a i è th, il dittongo iu è una sillaba e la d tra vocali è morbida (dh); l'accento passa su -da-.",
    ),
  ],
  [
    card(
      'c1',
      'mi libro / mis amigos',
      'Possessivo senza articolo: mi libro [mi LI-bro], mis amigos. Mai «el mi libro».',
    ),
    card(
      'c2',
      'el problema, el día, el mapa',
      'Maschili in -a: parole greche in -ma (problema [pro-BLE-ma], idioma, tema, sistema) ed eccezioni come día [DI-a], mapa, planeta.',
    ),
    card(
      'c3',
      'la leche, la sangre, la sal',
      "Femminili anche se l'italiano è maschile: latte, sangue, sale, miele (la miel), naso (la nariz).",
    ),
    card('c4', 'el agua fría', "Agua è femminile ma prende el per l'accento: el agua [el A-gua], plurale las aguas."),
    card('c5', 'Plurale', 'Vocale +s; consonante +es; -z → -ces (lápices [LA-pi-thes]); -s non accentata invariabile.'),
    card(
      'c6',
      'a + el = al; de + el = del',
      'Solo con el: voy al cine, el coche del abuelo. Le altre preposizioni non si contraggono.',
    ),
    card('c7', 'lo + aggettivo', 'lo bueno, lo importante, lo que: neutro, mai plurale.'),
    card(
      'c8',
      'buen, mal, gran, primer',
      'Si accorciano davanti al nome maschile singolare; gran vale anche al femminile.',
    ),
    card(
      'c9',
      'este / ese / aquel',
      'Tre gradi: vicino a me [ES-te], vicino a te [E-sse], lontano [a-KEL]. Neutri: esto, eso, aquello.',
    ),
    card(
      'c10',
      'muy / mucho',
      'muy + aggettivo/avverbio [MUI bien]; mucho + nome o verbo, con concordanza [MU-cia HEN-te].',
    ),
    card('c11', 'canción → canciones', '[kan-THION] → [kan-THIO-nes]: perde la tilde. joven → jóvenes: la guadagna.'),
    card('c12', 'aquí / ahí / allí', '[a-KI] qui, [a-I] lì (vicino a te), [a-YI] laggiù: la h di ahí è muta.'),
  ],
  [
    prac(
      'p1',
      "Metti l'articolo giusto (el/la/los/las): ___ problema, ___ ciudad, ___ leche, ___ día, ___ mano, ___ agua, ___ viaje.",
      'el problema, la ciudad, la leche, el día, la mano, el agua, el viaje (-aje maschile; -dad femminile; leche femminile contro il latte italiano).',
    ),
    prac(
      'p2',
      'Traduci: «I miei amici sono molto simpatici e hanno molto tempo libero.»',
      "Mis amigos son muy simpáticos y tienen mucho tiempo libre. (mis senza articolo; muy davanti all'aggettivo; mucho davanti al nome.)",
    ),
    prac(
      'p3',
      'Scrivi i plurali: lápiz, canción, joven, lunes, ciudad, autobús (stesso accento).',
      'lápices, canciones, jóvenes, los lunes (invariabile), ciudades, autobuses (la tilde cade).',
    ),
    prac(
      'p4',
      'Correggi: «Es una buena problema», «La gente son simpáticos», «Vamos a el cine», «Tengo muy hambre».',
      'Es un buen problema (problema maschile, buen apocopato). / La gente es simpática (singolare). / Vamos al cine. / Tengo mucha hambre.',
    ),
    prac(
      'p5',
      'Descrivi con 4 frasi la tua casa usando un possessivo, un dimostrativo, un aggettivo che segue il nome e uno che precede.',
      'Mi casa es pequeña. Esta habitación es mi favorita. Tengo un sofá cómodo. Es un buen lugar para leer. (mi senza articolo, esta/este per il vicino, aggettivi dopo il nome, buen davanti.)',
    ),
  ],
)

export const esPresente = mod(
  'es-presente',
  'Presente indicativo',
  'Regolari, dittongazione e>ie o>ue e>i, irregolari yo-go, ir / saber / conocer, verbi in -uir, -iar, -uar',
  'a1',
  `<p class="lead">Il presente è il tempo più usato. I regolari si imparano in un'ora; il lavoro è nei verbi irregolari, ma sono pochi schemi ricorrenti. Ogni forma è accompagnata dalla pronuncia italiana ([h] = jota, [dh] = d morbida).</p>
<h3>Verbi regolari: -ar, -er, -ir</h3>
<table><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr>
<tr><td>yo</td><td>hablo [A-blo]</td><td>como [KO-mo]</td><td>vivo [BI-bo]</td></tr>
<tr><td>tú</td><td>hablas [A-blas]</td><td>comes [KO-mes]</td><td>vives [BI-bes]</td></tr>
<tr><td>él/usted</td><td>habla [A-bla]</td><td>come [KO-me]</td><td>vive [BI-be]</td></tr>
<tr><td>nosotros</td><td>hablamos [a-BLA-mos]</td><td>comemos [ko-ME-mos]</td><td>vivimos [bi-BI-mos]</td></tr>
<tr><td>vosotros</td><td>habláis [a-BLAIS]</td><td>coméis [ko-MEIS]</td><td>vivís [bi-BIS]</td></tr>
<tr><td>ellos/ustedes</td><td>hablan [A-blan]</td><td>comen [KO-men]</td><td>viven [BI-ben]</td></tr>
</table>
<p>L'accento sta sulla radice (<b>A-blo</b>) tranne in nosotros e vosotros. Il soggetto si omette, il verbo basta.</p>
<h3>Dittongazione: e→ie, o→ue, e→i</h3>
<p>Nelle forme con la radice accentata (yo, tú, él, ellos) la vocale della radice cambia; <b>nosotros</b> e <b>vosotros</b> non cambiano mai.</p>
<table><tr><th></th><th>querer (e→ie)</th><th>poder (o→ue)</th><th>pedir (e→i)</th></tr>
<tr><td>yo</td><td>quiero [KIE-ro]</td><td>puedo [PUE-dho]</td><td>pido [PI-dho]</td></tr>
<tr><td>tú</td><td>quieres [KIE-res]</td><td>puedes [PUE-dhes]</td><td>pides [PI-dhes]</td></tr>
<tr><td>él/usted</td><td>quiere [KIE-re]</td><td>puede [PUE-dhe]</td><td>pide [PI-dhe]</td></tr>
<tr><td>nosotros</td><td>queremos [ke-RE-mos]</td><td>podemos [po-DHE-mos]</td><td>pedimos [pe-DHI-mos]</td></tr>
<tr><td>vosotros</td><td>queréis [ke-REIS]</td><td>podéis [po-DHEIS]</td><td>pedís [pe-DHIS]</td></tr>
<tr><td>ellos</td><td>quieren [KIE-ren]</td><td>pueden [PUE-dhen]</td><td>piden [PI-dhen]</td></tr>
</table>
<ul><li><b>e→ie</b>: pensar [pen-SSAR] → pienso [PIEN-sso], empezar → empiezo [em-PIE-tho], entender → entiendo, preferir → prefiero [pre-FIE-ro], cerrar, sentir.</li><li><b>o→ue</b>: volver → vuelvo [BUEL-bo], dormir → duermo [DUER-mo], contar → cuento, encontrar, costar, oler → huelo [UE-lo]; <b>u→ue</b>: jugar → juego [HUE-go].</li><li><b>e→i</b> (verbi in -ir): repetir → repito, servir → sirvo, seguir → sigo [SI-go], elegir → elijo.</li></ul>
<h3>Yo con -go e altre irregolarità</h3>
<table><tr><th>Infinito</th><th>yo</th><th>altre forme</th></tr>
<tr><td>tener</td><td>tengo [TEN-go]</td><td>tienes, tiene, tenemos</td></tr>
<tr><td>venir</td><td>vengo [BEN-go]</td><td>vienes, viene, venimos</td></tr>
<tr><td>poner</td><td>pongo [PON-go]</td><td>pones, pone...</td></tr>
<tr><td>salir</td><td>salgo [SAL-go]</td><td>sales, sale...</td></tr>
<tr><td>hacer</td><td>hago [A-go]</td><td>haces [A-thes], hace</td></tr>
<tr><td>decir</td><td>digo [DI-go]</td><td>dices, dice, decimos</td></tr>
<tr><td>traer, oír</td><td>traigo [TRAI-go], oigo [OI-go]</td><td>traes, oyes...</td></tr>
</table>
<h3>Ir, ser, estar, saber, conocer, dar, ver</h3>
<table><tr><th></th><th>ir</th><th>saber</th><th>conocer</th></tr>
<tr><td>yo</td><td>voy [BOI]</td><td>sé [SE]</td><td>conozco [ko-NOTH-ko]</td></tr>
<tr><td>tú</td><td>vas [BAS]</td><td>sabes [SA-bes]</td><td>conoces [ko-NO-thes]</td></tr>
<tr><td>él</td><td>va [BA]</td><td>sabe [SA-be]</td><td>conoce [ko-NO-the]</td></tr>
<tr><td>nosotros</td><td>vamos [BA-mos]</td><td>sabemos</td><td>conocemos</td></tr>
<tr><td>vosotros</td><td>vais [BAIS]</td><td>sabéis [sa-BEIS]</td><td>conocéis [ko-no-THEIS]</td></tr>
<tr><td>ellos</td><td>van [BAN]</td><td>saben</td><td>conocen</td></tr>
</table>
<p><b>Dar</b>: doy [DOI], das, da, damos...; <b>ver</b>: veo [BE-o], ves, ve. <b>Saber</b> = sapere (fatti, saper fare: <b>sé nadar</b> [SE na-DHAR]); <b>conocer</b> = conoscere persone e luoghi: <b>conozco a Ana</b>, <b>conozco Madrid</b>. I verbi in -cer/-cir dopo vocale hanno -zco: <b>parecer → parezco</b>, <b>traducir → traduzco</b> [tra-DHUTH-ko].</p>
<h3>Cambi ortografici</h3>
<ul><li><b>-uir</b>: y davanti a e/o/a: <b>construir</b> [kons-TRUIR] → construyo [kons-TRU-yo], construyes, construye, construimos, construís, construyen.</li><li><b>-iar</b> (alcuni): la i prende accento: <b>enviar</b> → envío [en-BI-o], envías; <b>esquiar, guiar, confiar</b>. Altri no: <b>estudiar</b> → estudio [es-TU-dhio], <b>cambiar → cambio</b>.</li><li><b>-uar</b>: <b>continuar</b> → continúo [kon-ti-NU-o], <b>actuar</b>; ma <b>averiguar</b> → averiguo.</li><li><b>-ger/-gir</b>: g→j davanti a o: <b>escoger → escojo</b> [es-KO-ho], <b>dirigir → dirijo</b> [di-RI-ho]. Attenzione: in Messico, Argentina e altrove <b>coger</b> è volgare (significa «fare sesso»): in America usa <b>tomar</b> o <b>agarrar</b>. In Spagna è normale.</li></ul>
<h3>Gerundio: estoy hablando</h3>
<p>Il gerundio dice che l'azione è <b>in corso</b>: <b>Estoy trabajando</b> [es-TOI tra-ba-HAN-do] (sto lavorando). Si forma con <b>-ar → -ando</b> e <b>-er/-ir → -iendo</b>; è invariabile.</p>
<table><tr><th>Infinito</th><th>Gerundio</th><th>Pronuncia</th></tr>
<tr><td>hablar</td><td>hablando</td><td>[a-BLAN-do]</td></tr>
<tr><td>comer</td><td>comiendo</td><td>[ko-MIEN-do]</td></tr>
<tr><td>vivir</td><td>viviendo</td><td>[bi-BIEN-do]</td></tr>
</table>
<ul><li><b>Verbi in -ir con cambio e→i / o→u</b>: pedir → <b>pidiendo</b>, decir → <b>diciendo</b>, seguir → <b>siguiendo</b>, sentir → <b>sintiendo</b>, dormir → <b>durmiendo</b> [dur-MIEN-do], morir → <b>muriendo</b>; anche poder → <b>pudiendo</b>.</li><li><b>Vocale + -iendo diventa -yendo</b>: leer → <b>leyendo</b> [le-YEN-do], oír → <b>oyendo</b>, caer → <b>cayendo</b>, traer → <b>trayendo</b>, construir → <b>construyendo</b>; ir → <b>yendo</b> [YEN-do].</li><li>Altri usi: <b>seguir</b> (<b>sigo trabajando</b>, continuo a lavorare), <b>llevar</b> (<b>llevo dos años viviendo aquí</b>). I pronomi si attaccano con tilde (<b>lavándome</b>) o precedono estar (<b>me estoy lavando</b>).</li><li>Non descrive il futuro: «domani sto partendo» si rende con <b>Mañana salgo</b> o <b>Mañana voy a salir</b>, non con <b>estoy saliendo</b>.</li></ul>
<h3>Usi e trappole</h3>
<ul><li>Il presente vale anche futuro prossimo: <b>Mañana voy al médico</b> [ma-GNA-na BOI al ME-dhi-ko].</li><li>Azione iniziata nel passato: <b>Estudio español desde hace dos años</b> [es-TU-dhio es-pa-GNOL DES-dhe A-the dos A-gnos] (non «de dos años»). Anche <b>Llevo dos años estudiando español</b>.</li><li>«So parlare spagnolo»: <b>Sé hablar español</b>; «posso» = <b>puedo</b>.</li><li>«Ci vogliono due ore» (tempo) si rende con <b>tardar</b>: <b>Tardo dos horas en llegar</b> [TAR-dho dos O-ras en ye-GAR], <b>Se tarda dos horas</b>. Per i soldi, <b>costar</b>: <b>cuesta diez euros</b>.</li></ul>
<div class="say"><b>Da dire.</b> «Vivo en Roma, trabajo mucho y salgo con mis amigos los viernes. Quiero aprender español porque pienso viajar.» [BI-bo en RRO-ma, tra-BA-ho MU-cio i SAL-go kon mis a-MI-gos los BIER-nes. KIE-ro a-pren-DER es-pa-GNOL POR-ke PIEN-sso bia-HAR]</div>`,
  [
    q(
      'q1',
      'Come si dice «voglio» (io, querer)?',
      ['quiero', 'quero', 'quiro', 'queiro'],
      0,
      'Querer ha il cambio e→ie nelle forme con radice accentata: la prima persona è quiero, e nosotros resta queremos.',
    ),
    q(
      'q2',
      'Come si dice «noi possiamo»?',
      ['podemos', 'puedemos', 'pudemos', 'podimos'],
      0,
      'Nosotros e vosotros non dittongano: la radice non è accentata, quindi poder diventa podemos e non puedemos.',
    ),
    q(
      'q3',
      'Come si dice «io esco» (salir)?',
      ['salgo', 'salo', 'salio', 'soy'],
      0,
      'Salir è tra i verbi con yo in -go (tengo, pongo, salgo): è una irregolarità della sola prima persona.',
    ),
    q(
      'q4',
      'Come dici «conosco Madrid»?',
      ['Conozco Madrid', 'Sé Madrid', 'Conozo Madrid', 'Conoscí Madrid'],
      0,
      'Conocer per luoghi e persone e i verbi in -cer dopo vocale prendono -zco alla prima persona: conozco, non conozo.',
    ),
    q(
      'q5',
      'Come si coniuga «construir» alla 3ª persona singolare?',
      ['construye', 'construe', 'construiye', 'construie'],
      0,
      'I verbi in -uir inseriscono y tra la u e le vocali e/o/a della desinenza: construyo, construye, construyen.',
    ),
    q(
      'q6',
      'Come dici «studio spagnolo da due anni»?',
      [
        'Estudio español desde hace dos años',
        'Estudio español de dos años',
        'Estudio español por dos años',
        'Estudio español hace dos años',
      ],
      0,
      'Si usa il presente con desde hace + durata; «hace dos años» da solo vuol dire «due anni fa», con altro significato.',
    ),
    q(
      'q7',
      'Come si scrive «io invio» (enviar)?',
      ['envío', 'envio senza tilde', 'enviió', 'envyo'],
      0,
      "Enviar è tra i verbi in -iar che accentano la i: [en-BI-o]; la tilde marca l'iato, altrimenti si leggerebbe come dittongo.",
    ),
    q(
      'q8',
      'Come si legge «puedo» (posso)?',
      ['[PUE-dho]', '[PU-edo]', '[PUE-do] con d dura', '[PUE-tho]'],
      0,
      'Il dittongo ue è una sola sillaba accentata e la d tra vocali è morbida (dh), non la d italiana né la z.',
    ),
    q(
      'q9',
      'Come si legge «hago» (io faccio)?',
      ['[A-go]', '[HA-go]', '[A-ho]', '[A-tho]'],
      0,
      'La h iniziale è muta e la g davanti ad o è dura; solo davanti a e/i la g diventa jota (haces [A-thes]).',
    ),
    q(
      'q10',
      'Come si coniuga «dormir» con nosotros?',
      ['dormimos', 'duermemos', 'duermimos', 'dormemos'],
      0,
      'Nosotros non dittonga e la vocale della radice non è accentata; la desinenza -ir dà -imos: dormimos.',
    ),
    q(
      'q11',
      'Qual è il gerundio di «dormir» (stare dormendo)?',
      ['durmiendo', 'dormiendo', 'dormindo', 'duermiendo'],
      0,
      'I verbi in -ir con radice che cambia hanno o→u nel gerundio: durmiendo, come pidiendo da pedir; il gerundio non dittonga mai.',
    ),
    q(
      'q12',
      'Come dici «sto leggendo un libro»?',
      ['Estoy leyendo un libro', 'Estoy leiendo un libro', 'Estoy leendo un libro', 'Estoy lectura un libro'],
      0,
      'Dopo una vocale la i di -iendo diventa y: leyendo; il gerundio si usa con estar, e non con un sostantivo come lectura.',
    ),
  ],
  [
    card(
      'c1',
      'hablar / comer / vivir',
      'hablo, hablas, habla, hablamos, habláis, hablan; como/comes...; vivo/vives...: -ar, -er, -ir.',
    ),
    card(
      'c2',
      'querer (e→ie)',
      'quiero [KIE-ro], quieres, quiere, queremos [ke-RE-mos], queréis, quieren. Nosotros non cambia.',
    ),
    card('c3', 'poder (o→ue)', 'puedo [PUE-dho], puedes, puede, podemos [po-DHE-mos], podéis, pueden.'),
    card('c4', 'pedir (e→i)', 'pido [PI-dho], pides, pide, pedimos, pedís, piden. Anche repetir, servir, seguir.'),
    card('c5', 'yo -go', 'tengo, vengo, pongo, salgo, hago [A-go], digo [DI-go], traigo, oigo.'),
    card('c6', 'ir', 'voy [BOI], vas, va, vamos, vais, van. Voy a España; voy al cine.'),
    card(
      'c7',
      'saber / conocer',
      'sé [SE] (fatti, saper fare); conozco [ko-NOTH-ko] (persone, luoghi). Conozco a Ana.',
    ),
    card(
      'c8',
      '-uir, -iar, -uar',
      'construyo; envío [en-BI-o] ma estudio [es-TU-dhio]; continúo. Cambi che segnano il suono.',
    ),
    card('c9', 'desde hace + tempo', 'Estudio desde hace dos años: azione che continua. Italiano: studio da due anni.'),
    card(
      'c10',
      'coger',
      'Spagna: prendere (normale). Messico, Argentina e altre zone: volgare. In America: tomar, agarrar.',
    ),
    card(
      'c11',
      'puedo, duermo',
      '[PUE-dho], [DUER-mo]: accento sul dittongo. Nosotros: podemos [po-DHE-mos], dormimos [dor-MI-mos].',
    ),
    card('c12', 'conozco / traduzco', '[ko-NOTH-ko], [tra-DHUTH-ko]: zc = [th-k] in Spagna, [s-k] in America.'),
    card(
      'c13',
      'Gerundio',
      '-ar → -ando (hablando), -er/-ir → -iendo (comiendo). Irregolari: durmiendo, pidiendo, leyendo, yendo.',
    ),
    card(
      'c14',
      'estar + gerundio',
      'Estoy trabajando = sto lavorando. Non per il futuro: «domani sto partendo» = Mañana salgo.',
    ),
    card('c15', 'tardar', 'Ci vogliono due ore = Tardo dos horas / Se tarda dos horas. Costar per i soldi.'),
  ],
  [
    prac(
      'p1',
      'Coniuga al presente tutte le persone di «poder» e «dormir».',
      'poder: puedo, puedes, puede, podemos, podéis, pueden. dormir: duermo, duermes, duerme, dormimos, dormís, duermen. (Nosotros/vosotros non dittongano.)',
    ),
    prac(
      'p2',
      'Traduci: «Esco alle otto, faccio colazione fuori e non so cosa mangiare.»',
      'Salgo a las ocho, desayuno fuera y no sé qué comer. (salgo: yo -go; sé: saber; qué con tilde.)',
    ),
    prac(
      'p3',
      'Completa: «Yo ___ (conocer) a Marta pero no ___ (saber) dónde vive. ___ (nosotros, querer) llamarla.»',
      'conozco, sé, queremos. (a personale davanti a Marta; nosotros non dittonga.)',
    ),
    prac(
      'p4',
      'Correggi: «Yo quero un café», «Nosotros puedemos ir», «Él construie una casa», «Estudio de dos años».',
      'Yo quiero un café. / Nosotros podemos ir. / Él construye una casa. / Estudio desde hace dos años.',
    ),
    prac(
      'p5',
      'Scrivi 5 frasi sulla tua giornata con verbi di schemi diversi (regolare, e→ie, o→ue, yo -go, ir).',
      'Ejemplo: Trabajo en una oficina. Empiezo a las nueve. Vuelvo a casa a las seis. Salgo con amigos. Voy al gimnasio. (regolare, e→ie, o→ue, -go, ir.)',
    ),
    prac(
      'p6',
      'Scrivi il gerundio di: hablar, beber, escribir, dormir, leer, pedir, ir. Poi traduci: «Sto studiando e mia sorella sta dormendo.»',
      'hablando, bebiendo, escribiendo, durmiendo, leyendo, pidiendo, yendo. Estoy estudiando y mi hermana está durmiendo.',
    ),
  ],
)

export const esQuotidiano = mod(
  'es-quotidiano',
  'Vita quotidiana: riflessivi, gustar, negazione, domande',
  'Verbi riflessivi, gustar e simili, routine, negazione, domande, preposizioni, hay que / tener que / poder / querer',
  'a1',
  `<p class="lead">Con questi strumenti puoi raccontare la tua giornata, dire cosa ti piace, fare domande e organizzare un piano. Le pronunce usano la solita convenzione.</p>
<h3>Verbi riflessivi</h3>
<table><tr><th></th><th>levantarse</th><th>Pronuncia</th></tr>
<tr><td>yo</td><td>me levanto</td><td>[me le-BAN-to]</td></tr>
<tr><td>tú</td><td>te levantas</td><td>[te le-BAN-tas]</td></tr>
<tr><td>él/usted</td><td>se levanta</td><td>[se le-BAN-ta]</td></tr>
<tr><td>nosotros</td><td>nos levantamos</td><td>[nos le-ban-TA-mos]</td></tr>
<tr><td>vosotros</td><td>os levantáis</td><td>[os le-ban-TAIS]</td></tr>
<tr><td>ellos</td><td>se levantan</td><td>[se le-BAN-tan]</td></tr>
</table>
<ul><li>Il pronome sta <b>prima</b> del verbo coniugato, e <b>dopo e attaccato</b> all'infinito o gerundio: <b>me quiero levantar</b> = <b>quiero levantarme</b> [KIE-ro le-ban-TAR-me].</li><li>Verbi comuni: <b>despertarse</b> (e→ie: <b>me despierto</b> [me des-PIER-to]), <b>ducharse</b> [du-CIAR-se], <b>vestirse</b> (<b>me visto</b>), <b>acostarse</b> (<b>me acuesto</b> [me a-KUES-to]), <b>llamarse</b> (<b>me llamo</b> [me YA-mo]), <b>sentarse</b>, <b>ponerse</b>, <b>quedarse</b>, <b>irse</b> (<b>me voy</b> = vado via).</li><li>Con parti del corpo e vestiti si usa l'articolo, non il possessivo: <b>Me lavo las manos</b> [me LA-bo las MA-nos], <b>Se pone el abrigo</b>.</li></ul>
<h3>La routine</h3>
<p><b>Me despierto a las siete</b>, <b>me ducho</b> [me DU-cio], <b>desayuno</b> [de-ssa-YU-no] (colazione), <b>voy al trabajo en metro</b>, <b>como a las dos</b> [KO-mo a las DOS], <b>ceno a las nueve</b> [THE-no], <b>me acuesto a las once</b>. In Spagna si pranza tardi (14-15) e si cena verso le 21-22: <b>la comida</b> è il pasto principale; <b>el almuerzo</b> in America è il pranzo, in Spagna varia secondo la zona (pranzo oppure spuntino di metà mattina); <b>la merienda</b> è la merenda.</p>
<h3>Gustar e verbi simili</h3>
<p>Funziona come «piacere»: la cosa che piace è il <b>soggetto</b>, la persona è il complemento indiretto.</p>
<table><tr><th>Persona</th><th>Pronome</th><th>Esempio</th></tr>
<tr><td>a mí</td><td>me [me]</td><td>(A mí) me gusta el café</td></tr>
<tr><td>a ti</td><td>te [te]</td><td>(A ti) te gustan los gatos</td></tr>
<tr><td>a él/ella/usted</td><td>le [le]</td><td>A Ana le gusta leer</td></tr>
<tr><td>a nosotros</td><td>nos [nos]</td><td>Nos gusta viajar</td></tr>
<tr><td>a vosotros</td><td>os [os]</td><td>Os gusta la playa</td></tr>
<tr><td>a ellos/ustedes</td><td>les [les]</td><td>Les gustan las pelis</td></tr>
</table>
<p><b>Me gusta</b> [me GUS-ta] con singolare o infinito (<b>me gusta leer</b>), <b>me gustan</b> [me GUS-tan] con plurale. Simili: <b>encantar</b> [en-kan-TAR], <b>interesar</b>, <b>importar</b>, <b>molestar</b>, <b>faltar</b>, <b>apetecer</b> (Spagna: <b>¿Te apetece un café?</b> [te a-pe-TE-the un ka-FE]), <b>doler</b> (<b>me duele la cabeza</b> [me DUE-le la ka-BE-tha], <b>me duelen los pies</b>), <b>parecer</b> (<b>me parece bien</b>). <b>A mí me gusta</b>, <b>a ti te gusta</b> si usano per enfasi o contrasto: <b>A mí no, a ella sí</b>.</p>
<p><b>Trappola</b>: con le persone «mi piace Luca» spesso non si dice «me gusta Luca», che può suonare come attrazione: per la simpatia usa <b>Luca me cae bien</b> [KA-e]. <b>Te quiero</b> è affetto (anche per amici e famiglia); <b>te amo</b> è amore romantico.</p>
<h3>Negazione</h3>
<p><b>No</b> davanti al verbo: <b>No hablo francés</b> [no A-blo fran-THES]. La doppia negazione è obbligatoria dopo il verbo: <b>No tengo nada</b> [no TEN-go NA-dha], <b>No conozco a nadie</b>, <b>No fumo nunca</b>, <b>No quiero ningún café</b>. Se la parola negativa viene prima del verbo, il <b>no</b> sparisce: <b>Nadie lo sabe</b>, <b>Nunca como carne</b>. <b>Tampoco</b> = neanche. Mai «tengo nada».</p>
<h3>Domande</h3>
<p>Basta l'intonazione (vedi il modulo Pronuncia) e ¿ ?: <b>¿Hablas español?</b> [A-blas es-pa-GNOL]. Parole: <b>qué</b> [KE], <b>quién</b> [KIEN], <b>dónde</b> [DON-de], <b>cuándo</b> [KUAN-do], <b>cómo</b> [KO-mo], <b>cuánto/a/os/as</b> [KUAN-to], <b>cuál</b> [KUAL], <b>por qué</b> [por KE] (perché, separato) contro <b>porque</b> [POR-ke] (perché, risposta). Il soggetto va dopo il verbo: <b>¿Dónde vive Ana?</b> Per le scelte tra cose conosciute usa <b>cuál</b> (<b>¿Cuál es tu número?</b>), per le definizioni <b>qué</b>.</p>
<h3>Preposizioni di luogo e tempo</h3>
<ul><li>Luogo: <b>en</b> [en] (in/su), <b>a</b> (verso), <b>de</b> (da/di), <b>desde, hasta</b> [AS-ta], <b>entre, sobre, debajo de, encima de, delante de, detrás de, al lado de, cerca de</b> [THER-ka], <b>lejos de</b> [LE-hos]. <b>Voy a España</b> [BOI a es-PA-gna], <b>vivo en Italia</b>, <b>vengo de Roma</b>. Mezzi: <b>en tren, en coche, a pie</b>.</li><li>Tempo: <b>a las ocho</b> (alle otto), <b>por la mañana</b> [por la ma-GNA-na], <b>en enero / en verano / en 2025</b>, <b>el lunes</b>, <b>desde... hasta</b>, <b>antes de, después de</b>, <b>durante</b>; «fa»: <b>hace tres años</b> [A-the tres A-gnos].</li></ul>
<h3>Obbligo e desiderio</h3>
<ul><li><b>Hay que + infinito</b> [AI ke]: impersonale, «bisogna»: <b>Hay que estudiar</b>.</li><li><b>Tener que + infinito</b>: obbligo personale, «devo»: <b>Tengo que irme</b> [TEN-go ke IR-me].</li><li><b>Deber + infinito</b>: dovere morale o consiglio: <b>Debes descansar</b> [DE-bes des-kan-SSAR].</li><li><b>Poder + inf</b> (posso), <b>querer + inf</b> (voglio): <b>Puedo ayudarte</b> [PUE-dho a-yu-DHAR-te], <b>Quiero comer</b>.</li></ul>
<p><b>Vocabolario</b>: per cibo, casa, famiglia, vestiti e tempo atmosferico trovi le liste per temi nei moduli del gruppo «Vocabolario per temi»: aprili quando ti servono parole nuove per la tua giornata.</p>
<div class="say"><b>Da dire.</b> «Me levanto a las siete, trabajo hasta las tres y por la tarde me gusta caminar. No tengo nada que hacer los domingos.» [me le-BAN-to a las SIE-te, tra-BA-ho AS-ta las TRES i por la TAR-dhe me GUS-ta ka-mi-NAR. no TEN-go NA-dha ke a-THER los do-MIN-gos]</div>`,
  [
    q(
      'q1',
      'Come dici «mi piace il caffè»?',
      ['Me gusta el café', 'Me gusto el café', 'Yo gusta el café', 'Me gustan el café'],
      0,
      'Gustar concorda con la cosa piaciuta (el café, singolare) e il pronome indiretto me indica chi lo prova.',
    ),
    q(
      'q2',
      'Come dici «mi piacciono i gatti»?',
      ['Me gustan los gatos', 'Me gusta los gatos', 'Me gustan el gato', 'Me gusto los gatos'],
      0,
      'La cosa piaciuta è plurale (los gatos): il verbo va al plurale, gustan, come «piacciono» in italiano.',
    ),
    q(
      'q3',
      'Come dici «non ho niente»?',
      ['No tengo nada', 'Tengo nada', 'No tengo ningún', 'Nada no tengo'],
      0,
      'Dopo il verbo la negazione si raddoppia: no ... nada; senza il primo no la frase è scorretta.',
    ),
    q(
      'q4',
      'Come dici «bisogna studiare» (impersonale)?',
      ['Hay que estudiar', 'Tengo que estudiar', 'Hay estudiar', 'Es que estudiar'],
      0,
      "Hay que è impersonale; tener que è un obbligo personale (devo), e hay da solo non regge l'infinito.",
    ),
    q(
      'q5',
      'Come dici «mi lavo le mani»?',
      ['Me lavo las manos', 'Lavo mis manos', 'Me lavo mis manos', 'Me lavo manos'],
      0,
      "Con le parti del corpo si usa il riflessivo e l'articolo, non il possessivo: las manos.",
    ),
    q(
      'q6',
      'Come dici «tre anni fa»?',
      ['hace tres años', 'tres años hace', 'por tres años', 'desde tres años'],
      0,
      "Per dire «fa» si usa hace davanti alla durata; desde hace descrive invece un'azione che dura ancora.",
    ),
    q(
      'q7',
      'Come dici «vado in Spagna»?',
      ['Voy a España', 'Voy en España', 'Voy de España', 'Voy por España'],
      0,
      'Il moto verso un luogo si esprime con ir a; en indica la posizione e por España vorrebbe dire «per tutta la Spagna».',
    ),
    q(
      'q8',
      'Come si scrive «perché?» in una domanda?',
      ['¿Por qué?', '¿Porque?', '¿Porqué?', '¿Por que?'],
      0,
      'Nelle domande si scrive in due parole e con la tilde su qué; porque unito è la risposta, porqué è il sostantivo.',
    ),
    q(
      'q9',
      'Come si legge «me despierto» (mi sveglio)?',
      ['[me des-PIER-to]', '[me DES-pier-to]', '[me des-pi-ER-to]', '[me des-PIE-rro-to]'],
      0,
      "Il dittongo ie è una sillaba e porta l'accento, perché despertarse dittonga nelle forme con radice accentata.",
    ),
    q(
      'q10',
      'Come si legge «¿Te apetece un café?»',
      [
        '[te a-pe-TE-the un ka-FE]',
        '[te a-pe-TE-ce un ka-FE]',
        '[te A-pe-te-ce un KA-fe]',
        '[te a-pe-TE-the un KA-fe]',
      ],
      0,
      "Apetecer ha accento su -te- e la c davanti a e è th; café è una aguda con tilde, accento sull'ultima sillaba.",
    ),
  ],
  [
    card(
      'c1',
      'levantarse',
      'me levanto [me le-BAN-to], te levantas, se levanta, nos levantamos, os levantáis, se levantan.',
    ),
    card('c2', 'gustar', 'Me gusta + singolare/infinito; me gustan + plurale. A mí me gusta... per enfasi.'),
    card(
      'c3',
      'Doble negación',
      'No tengo nada / No veo a nadie / No fumo nunca. Con parola negativa prima del verbo: Nunca como carne.',
    ),
    card('c4', 'hay que / tener que', 'Hay que estudiar (bisogna, impersonale); tengo que estudiar (devo).'),
    card('c5', '¿Por qué? / porque', 'Domanda in due parole con tilde [por KE]; risposta unita [POR-ke].'),
    card('c6', 'hace + tempo', 'hace tres años = tre anni fa. Desde hace tres años = da tre anni.'),
    card(
      'c7',
      'a las ocho, en enero',
      'Ora: a las. Mesi, stagioni, anni: en. Parti del giorno: por la mañana/tarde/noche.',
    ),
    card('c8', 'Me lavo las manos', 'Articolo, non possessivo, con parti del corpo e vestiti: se pone el abrigo.'),
    card(
      'c9',
      'caer bien',
      'Per simpatia verso persone: Luca me cae bien. Me gusta Luca può voler dire che mi attrae.',
    ),
    card('c10', 'me duele / me duelen', '[me DUE-le] [me DUE-len]: doler segue gustar. Me duele la cabeza.'),
    card(
      'c11',
      'desayuno [de-ssa-YU-no]',
      'Colazione. Comida = pasto principale in Spagna; cena [THE-na] = cena; merienda = merenda.',
    ),
    card(
      'c12',
      'qué / cuál',
      'Qué + nome o definizione; cuál tra più elementi noti: ¿Cuál es tu nombre? ¿Qué hora es?',
    ),
  ],
  [
    prac(
      'p1',
      'Racconta la tua mattina con 5 verbi riflessivi.',
      'Me despierto a las siete, me levanto, me ducho, me visto y me voy al trabajo. (me despierto: e→ie; me visto: e→i; me voy da irse.)',
    ),
    prac(
      'p2',
      'Traduci: «A Marco piacciono i film, a noi piace viaggiare e a me fa male la testa.»',
      'A Marco le gustan las películas, a nosotros nos gusta viajar y a mí me duele la cabeza. (le/nos/me; gustan plurale, gusta con infinito.)',
    ),
    prac(
      'p3',
      'Rendi negativa: «Siempre como carne. Alguien vive aquí. Tengo algo para ti.»',
      'Nunca como carne. No vive nadie aquí (o Nadie vive aquí). No tengo nada para ti. (siempre→nunca, alguien→nadie, algo→nada.)',
    ),
    prac(
      'p4',
      'Dì in spagnolo: «Devo studiare, ma voglio uscire. Bisogna fare tutto presto.»',
      'Tengo que estudiar, pero quiero salir. Hay que hacerlo todo pronto. (tener que = obbligo personale; hay que = impersonale.)',
    ),
    prac(
      'p5',
      'Fai 5 domande a un nuovo vicino (dove vive, da quanto, che lavoro fa, se gli piace la zona).',
      '¿Dónde vives? ¿Desde cuándo vives aquí? ¿Qué trabajo haces? ¿Te gusta el barrio? ¿Cuántos años tienes? (formale: dónde vive, le gusta...)',
    ),
  ],
)
