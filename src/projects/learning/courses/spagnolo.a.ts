import type { CourseModule } from '../types'
import { card, mod, prac, q } from './python-path.helpers'
import { esNomi, esPresente, esQuotidiano } from './spagnolo.a.2'
import { esPassato, esImperfecto, esPerfecto, esFuturo } from './spagnolo.a.3'
import { esPronomi, esImperativo, esPorpara } from './spagnolo.a.4'
import { spagnoloA5 } from './spagnolo.a.5'

// Spanish course, groups A1 and A2 (13 modules), for an Italian speaker.
//
// PRONUNCIATION CONVENTION (the same in every module; es-pron explains it, the course intro must recall it):
//   [ ] after the written form; syllables joined by hyphens; the STRESSED syllable in CAPITALS; no IPA.
//   Italian spelling read as Italian, with these exceptions:
//   th = English "think" (Spain; in Latin America read s)   h = jota (raspy, like German "Bach"; soft h in America)
//   ss = voiceless s, never z (also between vowels; it is not a double)   gn = ñ   dh = soft d, like English "this"
//   gh = hard g before e/i   c (ci/ce/cio) = Spanish "ch"   y = consonant i (like in "ieri")   rr = rolled r   ks = x
//   Silent h is omitted from the transcription; b stands for both b and v.
//
// CLAIMS THE AUTHOR IS NOT FULLY SURE ABOUT (reviewers: please check):
//   1. Rioplatense ll/y described as "sc" of "scena" (it is a postalveolar fricative, sh/zh depending on the speaker).
//   2. LATAM time phrases: "un cuarto para las cinco", "faltan diez para las tres" (Mexico) vs Spain "menos cuarto".
//   3. "estar malo" = ill is mainly Spain (LATAM prefers "estar enfermo"); "estar rico" = tasty, "ser rico" in the
//      sense of tasty is widespread in LATAM (given as secondary).
//   4. "doble ve" (LATAM) vs "uve doble" (Spain, RAE) as the name of w; "ye"/"i griega" for y.
//   5. Decimal and thousands separators: Spain comma/dot, Mexico and most of Central America point/comma.
//   6. "buenas tardes" starts after lunch (about 14h) and lasts until dusk; in Spain "tarde" extends to about 20-21h.
//   7. Soft d: transcribed "dh" between vowels, after r/s and at the end of a word; in speech it is often weaker
//      (verdad -> "verdá", -ado -> "-ao" colloquially).
//   8. Noun/adjective details: "estar listo" = ready; "ser listo" = clever (in some LATAM areas "ser listo" is also OK).
//   9. Seseo in Andalusia: "western Andalusia" and Canarias have seseo (s for c/z), some areas ceceo (th for s).
//  10. "hay" past forms: había (imperfect), hubo (indefinido); "habían" with a plural noun is a common error, not RAE-standard.

export const esPron = mod(
  'es-pron',
  'Pronuncia, accento e ortografia',
  'Alfabeto, suoni nuovi per un italiano, dittonghi, accento tonico e tilde, ¿ e ¡',
  'a1',
  `<p class="lead">Lo spagnolo si legge quasi come si scrive: cinque vocali pure e poche regole senza eccezioni. Il lavoro vero per un italiano è <b>disimparare</b> alcune abitudini: la s sonora di «casa», la «ce/ci» di «cena», la «gente» con la g molle, la «gn» e la «gli».</p>
<h3>Come leggere le trascrizioni (in tutto il corso)</h3>
<p>Dopo ogni parola nuova o difficile trovi la pronuncia tra parentesi quadre, scritta con l'ortografia italiana. Regole: sillabe separate da trattini, <b>sillaba accentata in MAIUSCOLO</b>, nessun simbolo fonetico. Esempio: <b>jamón</b> [ha-MON], <b>ayer</b> [a-YER].</p>
<table><tr><th>Segno</th><th>Si legge</th><th>Esempio</th></tr>
<tr><td>th</td><td>come «th» inglese di <i>think</i> (Spagna; in America leggi <b>s</b>)</td><td>cena [THE-na]</td></tr>
<tr><td>h</td><td>jota: «h» aspirata, raschiata (come «ch» tedesca di <i>Bach</i>, più leggera)</td><td>gente [HEN-te]</td></tr>
<tr><td>ss</td><td>s <b>sorda anche tra vocali</b> («sole», mai «z»), breve: non è una doppia</td><td>casa [KA-ssa]</td></tr>
<tr><td>gn</td><td>come in «gnocchi» (la ñ), ma breve</td><td>año [A-gno]</td></tr>
<tr><td>dh</td><td>d morbida, come «th» inglese di <i>this</i></td><td>nada [NA-dha]</td></tr>
<tr><td>gh</td><td>g dura davanti a e, i</td><td>guerra [GHE-rra]</td></tr>
<tr><td>c (ci, ce, cio)</td><td>come la «c» di «cena» italiana (la <i>ch</i> spagnola)</td><td>chico [CI-ko]</td></tr>
<tr><td>y</td><td>i consonantica, come in «ieri»</td><td>calle [KA-ye]</td></tr>
<tr><td>rr</td><td>r vibrata multipla</td><td>perro [PE-rro]</td></tr>
<tr><td>sce</td><td>Rio de la Plata: ll/y come la «sc» di «scena»</td><td>calle [KA-sce], yo [SCIO]</td></tr>
<tr><td>ks</td><td>x tra vocali o davanti a consonante</td><td>examen [ek-SA-men], texto [TEKS-to]</td></tr>
</table>
<p><b>Attenzione alla h</b>: nelle trascrizioni la <b>h</b> è sempre la <b>jota</b> (gente [HEN-te], jueves [HUE-bes]) e <b>non è mai muta</b> come in italiano. La h muta dello spagnolo non si scrive proprio: hola [O-la], huevo [UE-bo]. A fine parola la h indica una s aspirata (un soffio): los amigos [loh a-MI-goh]. <b>b</b> rappresenta sia la b sia la v spagnole, che hanno lo stesso suono. <b>ss, gn, rr, ll</b> si leggono <b>brevi</b>, senza allungarle come le doppie italiane (casa [KA-ssa] non è «cassa»; año [A-gno] ha una gn più breve di «gnocchi»). Nelle frasi trascritte le parole atone (articoli, preposizioni brevi, que, y, forme di ser dentro la frase) sono in minuscolo; la sillaba accentata delle altre è in MAIUSCOLO.</p>
<h3>Vocali: cinque, pure, sempre uguali</h3>
<p>a, e, i, o, u come in italiano, ma senza la distinzione tra «e/o aperte» e «chiuse»: una sola e e una sola o. Le vocali non accentate <b>non si riducono mai</b>: <b>pero</b> [PE-ro], <b>todo</b> [TO-dho], <b>vino</b> [BI-no], <b>uno</b> [U-no].</p>
<h3>Consonanti identiche o quasi all'italiano</h3>
<p>f, l, m, n, p, t, k (c davanti a a/o/u, qu) e s sono come in italiano. Differenze piccole: p, t, k senza soffio e la t con la lingua contro i denti. Soprattutto <b>le consonanti doppie non si allungano</b>: l'italiano «cassa» e «casa» si distinguono, lo spagnolo no (<b>casa</b> [KA-ssa] ha una s sola). Le uniche «doppie» sono <b>cc</b> (acción [ak-THION]: due suoni distinti) e <b>nn</b> (innato [in-NA-to]); la <b>rr</b> invece è una lettera vera (perro).</p>
<h3>Suoni nuovi o lettere «ingannevoli»</h3>
<table><tr><th>Grafia</th><th>Suono</th><th>Esempi</th></tr>
<tr><td>b, v</td><td>identiche: sempre «b» (tra vocali più morbida)</td><td>vaca [BA-ka], vivir [bi-BIR], uva [U-ba]</td></tr>
<tr><td>c + a, o, u; qu</td><td>«k»; la u di que/qui è muta</td><td>casa [KA-ssa], queso [KE-sso], quince [KIN-the]</td></tr>
<tr><td>c + e, i; z</td><td>Spagna «th»; America «s»</td><td>cine [THI-ne], zapato [tha-PA-to], gracias [GRA-thias]</td></tr>
<tr><td>g + a, o, u</td><td>g dura</td><td>gato [GA-to], gusto [GUS-to]</td></tr>
<tr><td>gu + e, i</td><td>g dura, u muta</td><td>guerra [GHE-rra], guitarra [ghi-TA-rra]</td></tr>
<tr><td>gü + e, i</td><td>g + u pronunciata</td><td>pingüino [pin-GUI-no], vergüenza [ber-GUEN-tha]</td></tr>
<tr><td>j; g + e, i</td><td>jota: «h» raschiata</td><td>jamón [ha-MON], gente [HEN-te], jugar [hu-GAR]</td></tr>
<tr><td>h</td><td>muta</td><td>hola [O-la], hombre [OM-bre], ahora [a-O-ra]</td></tr>
<tr><td>ch</td><td>come «c» di «cena» italiana</td><td>chico [CI-ko], mucho [MU-cio]</td></tr>
<tr><td>ll, y</td><td>i consonantica (yeísmo, la norma quasi ovunque)</td><td>calle [KA-ye], llave [YA-be], yo [YO]</td></tr>
<tr><td>ñ</td><td>«gn» di «gnocchi»</td><td>España [es-PA-gna], niño [NI-gno]</td></tr>
<tr><td>r (dentro la parola)</td><td>un solo colpo di lingua, come «caro»</td><td>pero [PE-ro], para [PA-ra]</td></tr>
<tr><td>r iniziale, dopo n/l/s; rr</td><td>vibrante multipla</td><td>rosa [RRO-ssa], perro [PE-rro], Enrique [en-RRI-ke]</td></tr>
<tr><td>s</td><td>sorda, anche tra vocali; davanti a consonante sonora diventa sonora come in italiano (non serve segnarlo)</td><td>casa [KA-ssa], mismo [MIS-mo], desde [DES-dhe]</td></tr>
<tr><td>x</td><td>«ks» tra vocali; «s» a inizio parola; in México è la jota</td><td>examen [ek-SA-men], xilófono [si-LO-fo-no], México [ME-hi-ko]</td></tr>
<tr><td>d</td><td>a inizio parola e dopo n/l come l'italiana; altrove <b>morbida</b> (dh), alla fine quasi muta; nel gruppo dr (madre, Madrid) è molto leggera e la trascrizione scrive d semplice</td><td>dar [DAR], nada [NA-dha], Madrid [ma-DRIDH], verdad [ber-DADH]</td></tr>
</table>
<h3>Trappole italiane</h3>
<ul><li><b>s sonora</b>: «rosa» all'italiana [ROZA] è sbagliato; in spagnolo <b>rosa</b> [RRO-ssa], <b>casa</b> [KA-ssa], <b>mesa</b> [ME-ssa].</li><li><b>gente</b> non è «gènte»: <b>gente</b> [HEN-te]; <b>gigante</b> [hi-GAN-te]; <b>jirafa</b> [hi-RA-fa] (giraffa).</li><li><b>ce/ci</b>: <b>cena</b> [THE-na] (cena); <b>cine</b> [THI-ne] (cinema). La «c» italiana è la <b>ch</b>: <b>chao</b> [CIAO].</li><li><b>gn</b>: «ignorar» non ha la ñ, è <b>ig-no-RAR</b> [ig-no-RAR]; <b>ñ</b> è il suono di «gnocchi». <b>año</b> [A-gno] (anno) senza tilde diventa «ano», parola anatomica e imbarazzante.</li><li><b>gli</b> non esiste: <b>ella</b> [E-ya], <b>llamar</b> [ya-MAR]. E <b>sc</b> non esiste: <b>escena</b> [es-THE-na], <b>escuela</b> [es-KUE-la].</li><li><b>qu/gu</b>: <b>quiero</b> [KIE-ro] (voglio), mai «kuiero»; invece in <b>cuando</b> [KUAN-do] la u si sente (qu e cu sono diverse).</li></ul>
<h3>Altre abitudini da correggere</h3>
<ul><li><b>g tra vocali</b>: in <b>amigo</b> [a-MI-go], <b>lago</b>, <b>agua</b> [A-gua] la g è più morbida e rilassata di quella italiana, ma resta una g: non diventa mai jota davanti a a/o/u. Nessun segno speciale: basta non pronunciarla con forza.</li><li><b>r finale e nei gruppi</b>: in <b>hablar</b> [a-BLAR], <b>tres</b> [TRES], <b>libro</b> [LI-bro], <b>otro</b> [O-tro] la r è un solo colpo di lingua, debole; non va arrotata a lungo. La vibrante multipla è solo rr e la r iniziale (o dopo n, l, s).</li><li><b>Consonanti finali senza vocale</b>: le parole spagnole finiscono anche in d, l, r, z, n, s, j. Non aggiungere una «e»: <b>ciudad</b> [thiu-DADH] (non «ciudade»), <b>hotel</b> [o-TEL], <b>reloj</b> [rre-LOH], <b>luz</b> [LUTH], <b>mes</b> [MES].</li><li><b>Durata</b>: ss, gn, ll e rr sono suoni brevi. L'italiano allunga sempre «gn» («aɲɲo») e «ss»: in spagnolo <b>año</b> e <b>casa</b> sono più rapide.</li><li><b>y forte</b>: dopo n o l, o quando si enfatizza, la y/ll è più marcata, quasi «dg»: <b>un yate</b>, <b>el yeso</b>. Per noi basta la y di «ieri».</li></ul>
<h3>Dittonghi e iati</h3>
<p>Due vocali nella stessa sillaba formano un <b>dittongo</b> se una è debole (i, u): <b>bien</b> [BIEN], <b>cuando</b> [KUAN-do], <b>aire</b> [AI-re], <b>ciudad</b> [thiu-DADH], <b>seis</b> [SEIS], <b>Europa</b> [eu-RO-pa], <b>hoy</b> [OI]. Due vocali forti (a, e, o) stanno in sillabe separate (<b>iato</b>): <b>leer</b> [le-ER], <b>poeta</b> [po-E-ta], <b>teatro</b> [te-A-tro]. Una vocale debole <b>accentata</b> vicino a una forte (in qualsiasi ordine) rompe il dittongo: <b>día</b> [DI-a], <b>río</b> [RRI-o], <b>país</b> [pa-IS], <b>maíz</b> [ma-ITH]. In día, río e maíz la tilde serve proprio a segnalare lo iato; in país servirebbe già per la regola generale (aguda in -s). Due vocali deboli diverse formano un dittongo con accento sulla seconda: <b>ciudad</b> [thiu-DADH], <b>cuidado</b> [kui-DHA-dho]. Il <b>trittongo</b> (debole + forte + debole) è una sillaba sola: <b>estudiáis</b> [es-tu-DHIAIS], <b>Uruguay</b> [u-ru-GUAI], <b>buey</b> [BUEI]. La h muta non impedisce lo iato: <b>prohibir</b> [pro-i-BIR], <b>ahí</b> [a-I], <b>ahorro</b> [a-O-rro]; ma <b>hielo</b> [IE-lo] e <b>hueso</b> [UE-sso] sono dittonghi. La «y» finale vale i: <b>hay</b> [AI], <b>muy</b> [MUI], <b>rey</b> [RREI].</p>
<h3>Dove cade l'accento (e quando serve la tilde)</h3>
<table><tr><th>Parola finisce in</th><th>Accento su</th><th>Esempi</th></tr>
<tr><td>vocale, <b>n</b>, <b>s</b></td><td>penultima, senza tilde</td><td>casa [KA-ssa], hablan [A-blan], lunes [LU-nes]</td></tr>
<tr><td>altra consonante</td><td>ultima, senza tilde</td><td>hablar [a-BLAR], ciudad [thiu-DADH], reloj [rre-LOH]</td></tr>
<tr><td>eccezione: ultima in vocale/n/s</td><td>ultima, <b>con tilde</b></td><td>café [ka-FE], canción [kan-THION], estás [es-TAS]</td></tr>
<tr><td>eccezione: penultima in altra consonante</td><td>penultima, <b>con tilde</b></td><td>árbol [AR-bol], lápiz [LA-pith], fácil [FA-thil]</td></tr>
<tr><td>terzultima (esdrújula)</td><td>sempre con tilde</td><td>teléfono [te-LE-fo-no], música [MU-ssi-ka]</td></tr>
</table>
<p>Cambiando il plurale la regola si riapplica: <b>canción</b> [kan-THION] → <b>canciones</b> [kan-THIO-nes] (perde la tilde), <b>joven</b> [HO-ben] → <b>jóvenes</b> [HO-be-nes] (la acquista), <b>examen</b> [ek-SA-men] → <b>exámenes</b> [ek-SA-me-nes]. La tilde indica <b>dove</b> cade l'accento; non è mai una «pronuncia aperta».</p>
<h3>Tilde diacritica: stessa forma, parole diverse</h3>
<table><tr><th>Con tilde</th><th>Senza tilde</th></tr>
<tr><td>tú [TU] (tu), él [EL] (lui), mí [MI] (a me), sí [SI] (sì), té [TE] (tè), sé [SE] (so), más [MAS] (più)</td><td>tu [tu] (tuo), el [el] (il), mi [mi] (mio), si [si] (se), te [te] (ti), se [se] (si), mas [mas] (ma, letterario)</td></tr>
</table>
<p>Le parole interrogative/esclamative portano sempre la tilde: <b>qué</b> [KE], <b>quién</b> [KIEN], <b>cómo</b> [KO-mo], <b>dónde</b> [DON-de], <b>cuándo</b> [KUAN-do], <b>cuánto</b> [KUAN-to], <b>cuál</b> [KUAL].</p>
<h3>Altre tilde e accenti da conoscere</h3>
<ul><li><b>Monosillabi senza tilde</b>: fue, fui, dio, vio, di, vi, fe, pie, sol. La tilde nei monosillabi è solo diacritica (tú, él, sí...).</li><li><b>Plurali che spostano l'accento</b>: <b>carácter</b> [ka-RAK-ter] → <b>caracteres</b> [ka-rak-TE-res]; <b>régimen</b> → <b>regímenes</b>.</li><li><b>Avverbi in -mente</b>: tengono la tilde dell'aggettivo: <b>fácil</b> → <b>fácilmente</b> [FA-thil-MEN-te], <b>rápido</b> → <b>rápidamente</b>.</li><li><b>Solo e aun</b>: <b>solo</b> (solamente) oggi si scrive senza tilde; <b>aún</b> con tilde quando vale «todavía» (<b>aún no ha llegado</b>), senza tilde nel senso di «persino» (<b>aun así</b>).</li><li><b>Interrogativi indiretti</b>: la tilde resta anche senza ¿?: <b>no sé qué quieres</b>, <b>dime dónde vives</b>.</li><li><b>Verbo + pronome</b>: la tilde conserva l'accento: <b>cómpralo</b> [KOM-pra-lo], <b>dámelo</b> [DA-me-lo].</li><li><b>Un trio da imparare</b>: <b>término</b> [TER-mi-no] (il termine), <b>termino</b> [ter-MI-no] (io finisco), <b>terminó</b> [ter-mi-NO] (lui finì). Così anche <b>papa</b> [PA-pa] (patata, America) / <b>papá</b> [pa-PA], <b>canto</b> / <b>cantó</b>, <b>público</b> / <b>publico</b> / <b>publicó</b>.</li></ul>
<h3>Punteggiatura e maiuscole</h3>
<p>Le domande e le esclamazioni si aprono con <b>¿</b> e <b>¡</b> e si chiudono con ? e !: <b>¿Cómo te llamas?</b> [KO-mo te YA-mas], <b>¡Qué bien!</b> [ke BIEN]. Giorni, mesi, lingue e nazionalità si scrivono minuscoli (come in italiano): lunes, enero, español.</p>
<h3>Alfabeto: i nomi delle lettere</h3>
<p>a [A], be [BE], ce [THE], de [DE], e [E], efe [E-fe], ge [HE], hache [A-ce], i [I], jota [HO-ta], ka [KA], ele [E-le], eme [E-me], ene [E-ne], eñe [E-gne], o [O], pe [PE], cu [KU], erre [E-rre], ese [E-sse], te [TE], u [U], uve [U-be], uve doble [U-be DO-ble] (in America <i>doble ve</i>), equis [E-kis], i griega o ye [I GRIE-ga / YE], zeta [THE-ta]. «ch» e «ll» non sono più lettere separate dal 2010.</p>
<h3>Spagna e America</h3>
<ul><li><b>Seseo</b>: in America (e in Canarie e Andalusia occidentale) c/z si leggono come <b>s</b>: cena [SE-na], gracias [GRA-ssias]. Va benissimo imitarlo: è la pronuncia della grande maggioranza degli ispanofoni.</li><li><b>Yeísmo</b>: ll = y quasi ovunque. In alcune zone ll resta «gli» (anziani della Spagna del nord, Ande); in Argentina e Uruguay ll/y suonano come la «sc» di «scena» (per alcuni parlanti sonora): calle [KA-sce], yo [SCIO].</li><li><b>-s</b> finale aspirata o persa nei Caraibi, in Cile e in Andalusia: «los amigos» [loh a-MI-goh]. Qui la <b>h</b> indica un soffio, non una lettera muta.</li></ul>
<div class="say"><b>Da ricordare.</b> «Se non sai come si legge, leggi lettera per lettera: la s è sorda anche tra vocali, la h scritta è muta, la j e la g davanti a e/i sono una h raschiata (nella trascrizione, h). ¡Así de fácil!» [a-SSI de FA-thil]</div>`,
  [
    q(
      'q1',
      'Come si legge «gente»?',
      [
        'con una h raschiata: [HEN-te]',
        'come in italiano: [GEN-te]',
        'con la g dura: [GHEN-te]',
        'con un suono sc: [SCEN-te]',
      ],
      0,
      "Davanti a e/i la g spagnola è la jota, una h raschiata: la g molle dell'italiano «gente» non esiste in spagnolo.",
    ),
    q(
      'q2',
      'Come si pronuncia «casa»?',
      ['con s sorda: [KA-ssa]', 'con s sonora: [KA-za]', 'con z: [KA-tha]', 'con ts: [KA-tsa]'],
      0,
      "In spagnolo la s è sempre sorda, anche tra due vocali: l'abitudine settentrionale italiana di dire «caza» è l'errore più comune.",
    ),
    q(
      'q3',
      'Quale parola è scritta correttamente?',
      ['canción', 'cancion', 'cáncion', 'cancíon'],
      0,
      "È aguda e finisce in n: ha l'accento sull'ultima sillaba e per questo serve la tilde sulla o, perché le agudas in n/s/vocale sono l'eccezione.",
    ),
    q(
      'q4',
      'Qual è la differenza tra «pero» e «perro»?',
      [
        'la r di pero è un colpo solo, quella di perro è vibrata più volte',
        'sono la stessa parola con grafia diversa',
        'perro ha la e lunga, pero ha la e breve',
        'perro ha una r più debole di quella di pero',
      ],
      0,
      'La rr non è una doppia che allunga, ma una vibrante multipla: cambia il significato (pero «ma», perro «cane») e va esercitata.',
    ),
    q(
      'q5',
      'Come si legge «año» (anno)?',
      ['come «gn» di gnocchi: [A-gno]', 'come «n»: [A-no]', 'come «ni»: [A-nio]', 'come «gli»: [A-glio]'],
      0,
      "La ñ vale «gn» come in gnocchi. Senza tilde la parola diventa «ano», che è tutt'altro e imbarazzante.",
    ),
    q(
      'q6',
      'In quale parola la tilde serve a separare le due vocali in sillabe diverse?',
      ['país [pa-IS]', 'canción [kan-THION]', 'árbol [AR-bol]', 'teléfono [te-LE-fo-no]'],
      0,
      "In país la i debole è accentata: senza tilde sarebbe un dittongo «pais». Le altre tilde dipendono dalla regola generale dell'accento.",
    ),
    q(
      'q7',
      'Quale frase è corretta?',
      ['¿Cómo te llamas?', 'Cómo te llamas?', '¿Cómo te llamas¿', '¡Cómo te llamas?'],
      0,
      'In spagnolo scritto la domanda si apre con ¿ e si chiude con ?; la tilde su cómo segnala che è una parola interrogativa.',
    ),
    q(
      'q8',
      'Come si legge «gracias» in Spagna?',
      ['[GRA-thias]', '[GRA-cias]', '[GRA-tsias]', '[GRA-zias] con s sonora'],
      0,
      "In Spagna la z/c davanti a e,i è il «th» inglese; in America si legge s. La «c» all'italiana (grazie) non esiste in questa posizione.",
    ),
    q(
      'q9',
      'Quale trascrizione corrisponde a «vergüenza» (vergogna)?',
      ['[ber-GUEN-tha]', '[ber-HEN-tha]', '[ber-GHEN-tha]', '[ber-GUEN-sa] con s sonora'],
      0,
      'La dieresi su ü indica che la u si pronuncia (gue), diversamente da guerra dove la u è muta; la z è «th».',
    ),
    q(
      'q10',
      'Nella trascrizione, che suono ha la «h» in [HEN-te]?',
      [
        'la jota, una h raschiata',
        'una h dolce come in inglese',
        'nessuno: è muta come in italiano',
        'una k leggera in gola',
      ],
      0,
      'Nelle trascrizioni del corso la h rappresenta sempre la jota raschiata; la h muta dello spagnolo non si scrive nemmeno.',
    ),
    q(
      'q11',
      'Come si legge «huevo» (uovo)?',
      ['[UE-bo]', '[HUE-bo]', '[GUE-bo]', '[IUE-bo]'],
      0,
      "La h scritta in huevo è muta, quindi nella trascrizione non compare: [UE-bo]. Con [HUE-bo] leggeresti una jota che non c'è.",
    ),
    q(
      'q12',
      'Quale trascrizione rende la s sorda di «queso» (formaggio)?',
      ['[KE-sso]', '[KE-so]', '[KE-zo]', '[KUE-sso]'],
      0,
      'Tra vocali un italiano del nord legge la s come z; la trascrizione usa ss per ricordare che in spagnolo resta sorda e breve.',
    ),
    q(
      'q13',
      'Come suona la d di «nada» nella trascrizione [NA-dha]?',
      [
        'morbida, come la th inglese di this',
        'dura, come la d italiana di «dado»',
        'come una t sorda: [NA-ta]',
        'come una z sonora: [NA-za]',
      ],
      0,
      "Tra vocali la d spagnola è un'approssimante morbida (dh); la d dura italiana si usa solo a inizio parola e dopo n o l.",
    ),
    q(
      'q14',
      'Quale forma significa «lui finì» (terminar, indefinido)?',
      ['terminó', 'término', 'termino', 'termíno'],
      0,
      "Terminó è una aguda in vocale, con tilde sull'ultima sillaba; término è il sostantivo «termine» e termino significa «io finisco».",
    ),
  ],
  [
    card('c1', 'hola [O-la]', 'La h è muta. «Hola» si legge come «ola»: nessun suono iniziale.'),
    card(
      'c2',
      'jamón, gente, jugar',
      '[ha-MON], [HEN-te], [hu-GAR]: j e g+e,i = jota, h raschiata (più leggera in America).',
    ),
    card('c3', 'z, ce, ci', 'Spagna «th» inglese di think: cena [THE-na], zapato [tha-PA-to]. America: s.'),
    card('c4', 'b e v', 'Stesso suono: «b». vaca [BA-ka] e baca suonano uguale; tra vocali è più morbida.'),
    card('c5', 'ñ', '«gn» di gnocchi: España [es-PA-gna]. Non confondere con n: año (anno) ≠ ano.'),
    card(
      'c6',
      'll e y',
      'i consonantica come «ieri» (yeísmo): calle [KA-ye], yo [YO]. Rioplatense: come la sc di scena: calle [KA-sce].',
    ),
    card(
      'c7',
      'r e rr',
      'r semplice, un colpo (pero [PE-ro]); rr o r iniziale vibrata (perro [PE-rro], rosa [RRO-ssa]).',
    ),
    card('c8', 's', 'Sempre sorda, anche tra vocali: casa [KA-ssa], rosa [RRO-ssa]. Mai [KAZA].'),
    card(
      'c9',
      "Regola dell'accento",
      'Fine in vocale/n/s: penultima; altra consonante: ultima. Eccezioni = tilde; esdrújulas sempre tilde.',
    ),
    card(
      'c10',
      'tilde diacritica',
      'tú/tu, él/el, mí/mi, sí/si, té/te, sé/se, más/mas: la tilde distingue parole omografe.',
    ),
    card(
      'c11',
      'dittongo e iato',
      'bien [BIEN] (una sillaba), leer [le-ER] e país [pa-IS] (due sillabe). Debole accentata + forte = tilde.',
    ),
    card(
      'c12',
      'd tra vocali e finale',
      'Morbida come «th» di this: nada [NA-dha], verdad [ber-DADH]. A inizio parola è la d italiana.',
    ),
    card(
      'c13',
      'h nella trascrizione',
      'La h è la jota raschiata, mai muta: gente [HEN-te]. La h muta dello spagnolo non si scrive: hola [O-la], huevo [UE-bo].',
    ),
    card(
      'c14',
      'ss, gn, rr, ll brevi',
      'Non allungarli come le doppie italiane: casa [KA-ssa] non è «cassa»; año [A-gno] ha una gn breve.',
    ),
    card(
      'c15',
      'r finale e consonanti finali',
      'hablar [a-BLAR]: r debole, un colpo. Si può finire in d, l, r, z, n, s, j: ciudad, hotel, luz, mes. Non aggiungere vocali.',
    ),
    card(
      'c16',
      'término / termino / terminó',
      "[TER-mi-no] sostantivo, [ter-MI-no] io finisco, [ter-mi-NO] lui finì. La tilde sposta l'accento.",
    ),
  ],
  [
    prac(
      'p1',
      'Scrivi la trascrizione italiana (con sillaba accentata in maiuscolo) di: jugo, guerra, queso, chico, cielo, México, examen.',
      'jugo [HU-go] (succo); guerra [GHE-rra] (guerra, u muta); queso [KE-sso] (formaggio); chico [CI-ko] (ragazzo); cielo [THIE-lo] (cielo; in America SIE-lo); México [ME-hi-ko]; examen [ek-SA-men]. Nota: la s di queso è sorda.',
    ),
    prac(
      'p2',
      'Metti la tilde dove serve: cancion, arbol, telefono, cafe, lapiz, ciudad, pais, examen, leccion, jovenes.',
      "canción, árbol, teléfono, café, lápiz, ciudad (nessuna tilde), país, examen (nessuna), lección, jóvenes. Ragiona: dove cade l'accento, come finisce la parola, e se la regola lo prevede.",
    ),
    prac(
      'p3',
      'Correggi gli errori: «Como te llamas», «El se llama Pedro», «Quiero un te», «Si, me gusta», «Cuantos años tienes».',
      '¿Cómo te llamas? / Él se llama Pedro (él pronome = tilde) / Quiero un té (tè) / Sí, me gusta (sì = tilde) / ¿Cuántos años tienes? (interrogativo con tilde e ¿?).',
    ),
    prac(
      'p4',
      'Dividi in sillabe e indica dittongo (D) o iato (I): ciudad, país, teatro, leer, aire, instrumento.',
      'ciu-dad [thiu-DADH] D; pa-ís [pa-IS] I; te-a-tro [te-A-tro] I; le-er [le-ER] I; ai-re [AI-re] D; ins-tru-men-to [ins-tru-MEN-to].',
    ),
    prac(
      'p5',
      'Leggi ad alta voce e trascrivi: Zaragoza, Barcelona, Valencia, Juan, jueves, gracias.',
      'Zaragoza [tha-ra-GO-tha], Barcelona [bar-the-LO-na], Valencia [ba-LEN-thia], Juan [HUAN], jueves [HUE-bes], gracias [GRA-thias]. In America la th diventa s.',
    ),
    prac(
      'p6',
      'Spiega a un amico italiano perché «rosa» non si dice [ROZA] e come si dice «anno».',
      'La s spagnola è sorda anche tra vocali: rosa [RRO-ssa] con r iniziale vibrata. «Anno» si scrive año e si legge [A-gno]; ñ vale «gn» e la tilde non si può omettere.',
    ),
    prac(
      'p7',
      'Trascrivi con le regole del corso: huevo, queso, nada, jueves, ciudad, mismo, Madrid.',
      'huevo [UE-bo] (h muta, non compare); queso [KE-sso]; nada [NA-dha]; jueves [HUE-bes] (h = jota); ciudad [thiu-DADH]; mismo [MIS-mo]; Madrid [ma-DRIDH]. Controllo: ss tra vocali, dh per la d morbida, h solo per la jota.',
    ),
  ],
)

export const esSaluti = mod(
  'es-saluti',
  'Saluti, presentazioni, numeri, date e ora',
  'Saludos, tú/usted, numeri 0-1.000.000, giorni, mesi, data, ora, paesi e nazionalità',
  'a1',
  `<p class="lead">Questo modulo ti fa parlare subito: salutare, presentarti, dare il tuo nome, età e provenienza, dire numeri, date e ore. Le pronunce usano la convenzione spiegata in <i>Pronuncia</i>: [th] = «think», [h] = jota, [ss] = s sorda, [gn] = ñ.</p>
<h3>Saluti e commiati</h3>
<table><tr><th>Spagnolo</th><th>Pronuncia</th><th>Italiano</th></tr>
<tr><td>hola</td><td>[O-la]</td><td>ciao (arrivo)</td></tr>
<tr><td>buenos días</td><td>[BUE-nos DI-as]</td><td>buongiorno (fino a pranzo)</td></tr>
<tr><td>buenas tardes</td><td>[BUE-nas TAR-dhes]</td><td>buon pomeriggio / buonasera</td></tr>
<tr><td>buenas noches</td><td>[BUE-nas NO-ces]</td><td>buonasera (tardi) / buonanotte</td></tr>
<tr><td>adiós, chao</td><td>[a-DHIOS], [CIAO]</td><td>arrivederci, ciao (andando via)</td></tr>
<tr><td>hasta luego / mañana</td><td>[AS-ta LUE-go] / [ma-GNA-na]</td><td>a dopo / a domani</td></tr>
</table>
<p><b>Trappola</b>: «buongiorno» è al plurale, <b>buenos días</b> (non «buen día» in Spagna). «Ciao» non è un solo saluto: arrivando <b>hola</b>, andando via <b>adiós</b>, <b>chao</b> o <b>hasta luego</b>.</p>
<h3>Come stai? Mi chiamo...</h3>
<ul><li><b>¿Cómo estás?</b> [KO-mo es-TAS] (tú) / <b>¿Cómo está usted?</b> [KO-mo es-TA us-TEDH] (formale). <b>¿Qué tal?</b> [ke TAL]. Risposte: <b>bien, gracias</b> [BIEN GRA-thias], <b>muy bien</b> [MUI BIEN], <b>regular</b> [rre-gu-LAR], <b>mal</b> [MAL]. <b>¿Y tú?</b> [i TU].</li><li><b>Me llamo Marco</b> [me YA-mo MAR-ko] / <b>Soy Marco</b> [SOI MAR-ko]. <b>¿Cómo te llamas?</b> [KO-mo te YA-mas]; formale: <b>¿Cómo se llama usted?</b> [KO-mo se YA-ma us-TEDH].</li><li><b>Mucho gusto</b> [MU-cio GUS-to], <b>encantado</b> [en-kan-TA-dho] (un uomo) / <b>encantada</b> [en-kan-TA-dha] (una donna), risposta <b>igualmente</b> [i-gual-MEN-te]: corrispondono a «piacere».</li><li><b>Soy italiano</b> [SOI i-ta-LIA-no], <b>soy de Milán</b> [SOI de mi-LAN], <b>vivo en Roma</b> [BI-bo en RRO-ma]. Per l'età serve <b>tener</b>: <b>Tengo treinta años</b> [TEN-go TREIN-ta A-gnos]. Mai «soy treinta años».</li></ul>
<h3>Tú, usted, vosotros, ustedes</h3>
<table><tr><th>Pronome</th><th>Pronuncia</th><th>Uso</th></tr>
<tr><td>yo / tú</td><td>[YO] / [TU]</td><td>io / tu (informale)</td></tr>
<tr><td>él, ella</td><td>[EL], [E-ya]</td><td>lui, lei (ella)</td></tr>
<tr><td>usted</td><td>[us-TEDH]</td><td>Lei formale (verbo alla 3ª sing.)</td></tr>
<tr><td>nosotros/-as</td><td>[no-SSO-tros]</td><td>noi</td></tr>
<tr><td>vosotros/-as</td><td>[bo-SSO-tros]</td><td>voi (informale; solo Spagna)</td></tr>
<tr><td>ustedes</td><td>[us-TE-dhes]</td><td>voi formale (Spagna); voi sempre (America)</td></tr>
</table>
<p>Come l'italiano «Lei», <b>usted</b> vuole il verbo alla 3ª persona singolare: lo usi con sconosciuti, anziani, clienti (in alcuni paesi americani anche in famiglia). In Argentina, Uruguay e parti dell'America centrale al posto di <i>tú</i> si usa <b>vos</b> (voseo). I pronomi soggetto si omettono: <b>Soy italiano</b>, non «yo soy» (che dà enfasi).</p>
<h3>Numeri</h3>
<table><tr><th>N.</th><th>Spagnolo [pron.]</th><th>N.</th><th>Spagnolo [pron.]</th></tr>
<tr><td>0</td><td>cero [THE-ro]</td><td>1</td><td>uno [U-no]</td></tr>
<tr><td>2</td><td>dos [DOS]</td><td>3</td><td>tres [TRES]</td></tr>
<tr><td>4</td><td>cuatro [KUA-tro]</td><td>5</td><td>cinco [THIN-ko]</td></tr>
<tr><td>6</td><td>seis [SEIS]</td><td>7</td><td>siete [SIE-te]</td></tr>
<tr><td>8</td><td>ocho [O-cio]</td><td>9</td><td>nueve [NUE-be]</td></tr>
<tr><td>10</td><td>diez [DIETH]</td><td>11</td><td>once [ON-the]</td></tr>
<tr><td>12</td><td>doce [DO-the]</td><td>13</td><td>trece [TRE-the]</td></tr>
<tr><td>14</td><td>catorce [ka-TOR-the]</td><td>15</td><td>quince [KIN-the]</td></tr>
<tr><td>16</td><td>dieciséis [die-thi-SSEIS]</td><td>17</td><td>diecisiete [die-thi-SSIE-te]</td></tr>
<tr><td>18</td><td>dieciocho [die-thi-O-cio]</td><td>19</td><td>diecinueve [die-thi-NUE-be]</td></tr>
<tr><td>20</td><td>veinte [BEIN-te]</td><td>21</td><td>veintiuno [bein-ti-U-no]</td></tr>
<tr><td>22</td><td>veintidós [bein-ti-DHOS]</td><td>30</td><td>treinta [TREIN-ta]</td></tr>
<tr><td>40</td><td>cuarenta [kua-REN-ta]</td><td>50</td><td>cincuenta [thin-KUEN-ta]</td></tr>
<tr><td>60</td><td>sesenta [se-SSEN-ta]</td><td>70</td><td>setenta [se-TEN-ta]</td></tr>
<tr><td>80</td><td>ochenta [o-CEN-ta]</td><td>90</td><td>noventa [no-BEN-ta]</td></tr>
<tr><td>100</td><td>cien [THIEN]</td><td>101</td><td>ciento uno [THIEN-to U-no]</td></tr>
<tr><td>200</td><td>doscientos [dos-THIEN-tos]</td><td>500</td><td>quinientos [ki-NIEN-tos]</td></tr>
<tr><td>700</td><td>setecientos [se-te-THIEN-tos]</td><td>900</td><td>novecientos [no-be-THIEN-tos]</td></tr>
<tr><td>1.000</td><td>mil [MIL]</td><td>1.000.000</td><td>un millón [un mi-YON]</td></tr>
</table>
<ul><li>Dal 31 in poi con <b>y</b>: <b>treinta y uno</b> [TREIN-ta i U-no], <b>noventa y nueve</b> [no-BEN-ta i NUE-be]. Dal 16 al 29 una parola sola: dieciséis, veintiún...</li><li><b>Uno</b> perde la o davanti a un nome maschile e diventa <b>un</b> (<b>veintiún euros</b> [bein-ti-UN EU-ros], <b>treinta y un años</b>); al femminile <b>una</b> (veintiuna personas).</li><li>Le centinaia concordano: <b>doscientas personas</b>, e <b>quinientos</b> (500), <b>setecientos</b> (700) e <b>novecientos</b> (900) sono irregolari. <b>Mil</b> non prende il plurale: <b>dos mil</b> [dos MIL]; <b>millón</b> sì (<b>dos millones</b>) e vuole <b>de</b>: <b>un millón de euros</b>.</li><li><b>Cien</b> da solo; davanti ad altri numeri <b>ciento</b> (ciento diez).</li><li>Anni: <b>mil novecientos noventa y cinco</b> (1995), <b>dos mil veintiséis</b> (2026). Per le migliaia la RAE raccomanda uno spazio (1 250) e per i decimali accetta virgola e punto (3,5 e 3.5 = tres coma cinco); in Spagna si vede spesso il punto per le migliaia e la virgola per i decimali, in Messico e in gran parte dell'America il punto è decimale.</li></ul>
<h3>Ordinali, frazioni, percentuali</h3>
<table><tr><th>N.</th><th>Spagnolo [pron.]</th><th>N.</th><th>Spagnolo [pron.]</th></tr>
<tr><td>1º</td><td>primero [pri-ME-ro]</td><td>6º</td><td>sexto [SEKS-to]</td></tr>
<tr><td>2º</td><td>segundo [se-GUN-do]</td><td>7º</td><td>séptimo [SEP-ti-mo]</td></tr>
<tr><td>3º</td><td>tercero [ter-THE-ro]</td><td>8º</td><td>octavo [ok-TA-bo]</td></tr>
<tr><td>4º</td><td>cuarto [KUAR-to]</td><td>9º</td><td>noveno [no-BE-no]</td></tr>
<tr><td>5º</td><td>quinto [KIN-to]</td><td>10º</td><td>décimo [DE-thi-mo]</td></tr>
</table>
<p>Gli ordinali concordano (<b>la primera vez</b>, <b>los segundos platos</b>). <b>Primero</b> e <b>tercero</b> perdono la -o davanti a un nome maschile singolare: <b>el primer día</b> [el pri-MER DI-a], <b>el tercer piso</b>. Oltre il decimo di norma si usa il cardinale (<b>la planta quince</b>, <b>el siglo veintiuno</b>). Frazioni: <b>la mitad</b> [la mi-TADH] (1/2), <b>un tercio</b>, <b>un cuarto</b>, <b>tres cuartos</b>; percentuale: <b>el diez por ciento</b> (10%).</p>
<h3>Giorni, mesi, data</h3>
<p>Giorni: <b>lunes</b> [LU-nes], <b>martes</b> [MAR-tes], <b>miércoles</b> [MIER-ko-les], <b>jueves</b> [HUE-bes], <b>viernes</b> [BIER-nes], <b>sábado</b> [SA-ba-dho], <b>domingo</b> [do-MIN-go]. Sono maschili e minuscoli; <b>el lunes</b> = lunedì prossimo, <b>los lunes</b> = ogni lunedì (lunes–viernes non cambiano al plurale).</p>
<p>Mesi: <b>enero</b> [e-NE-ro], <b>febrero</b> [fe-BRE-ro], <b>marzo</b> [MAR-tho], <b>abril</b> [a-BRIL], <b>mayo</b> [MA-yo], <b>junio</b> [HU-nio], <b>julio</b> [HU-lio], <b>agosto</b> [a-GOS-to], <b>septiembre</b> [sep-TIEM-bre], <b>octubre</b> [ok-TU-bre], <b>noviembre</b> [no-BIEM-bre], <b>diciembre</b> [di-THIEM-bre].</p>
<p>Data: <b>Hoy es lunes, 12 de octubre de 2026</b> [OI es LU-nes, DO-the de ok-TU-bre de dos MIL bein-ti-SSEIS]. Dal 2 al 31 si usano i numeri cardinali (<b>el dos de mayo</b>, <b>el diez de noviembre</b>) e la preposizione <b>de</b> due volte. Per il giorno 1 sono corretti sia il cardinale sia l'ordinale: <b>el uno de mayo</b> e <b>el primero de mayo</b> (la festa del lavoro è <b>el Primero de Mayo</b>). <b>¿Qué día es hoy?</b> [ke DI-a es OI] oppure <b>¿A cuántos estamos?</b> (<b>Estamos a 5 de noviembre</b>).</p>
<h3>L'ora</h3>
<ul><li><b>¿Qué hora es?</b> [ke O-ra ES]. <b>Es la una</b> [es la U-na] (singolare per l'una), <b>Son las dos</b> [SON las DOS], <b>Son las tres y cuarto</b> [i KUAR-to], <b>y media</b> [i ME-dhia], <b>menos cuarto</b> [ME-nos KUAR-to]: <b>Son las cinco menos cuarto</b> = 4:45.</li><li>In America si sente anche «un cuarto para las cinco» e «faltan diez para las tres» (Messico).</li><li><b>¿A qué hora...?</b> → <b>A las ocho</b> [a las O-cio]. Per specificare: <b>de la mañana / de la tarde / de la noche</b>; l'orario a 24 ore si usa per treni e orari ufficiali.</li></ul>
<h3>Paesi e nazionalità</h3>
<table><tr><th>Paese</th><th>Maschile</th><th>Femminile</th></tr>
<tr><td>España [es-PA-gna]</td><td>español [es-pa-GNOL]</td><td>española [es-pa-GNO-la]</td></tr>
<tr><td>Italia [i-TA-lia]</td><td>italiano</td><td>italiana</td></tr>
<tr><td>Francia [FRAN-thia]</td><td>francés [fran-THES]</td><td>francesa [fran-THE-ssa]</td></tr>
<tr><td>Alemania [a-le-MA-nia]</td><td>alemán [a-le-MAN]</td><td>alemana</td></tr>
<tr><td>México [ME-hi-ko]</td><td>mexicano [me-hi-KA-no]</td><td>mexicana</td></tr>
<tr><td>Marruecos [ma-RRUE-kos]</td><td>marroquí [ma-rro-KI]</td><td>marroquí (invariabile)</td></tr>
</table>
<p>Le nazionalità sono minuscole e concordano. Quelle che finiscono in consonante fanno il femminile con <b>-a</b> (español → española, francés → francesa, senza più tilde); in <b>-e</b> o <b>-í</b> sono invariabili (<i>estadounidense</i>, <i>marroquí</i>). «Torino» si dice <b>Turín</b> [tu-RIN], «Milano» <b>Milán</b> [mi-LAN], «Roma» <b>Roma</b> [RRO-ma].</p>
<div class="say"><b>Da dire.</b> «¡Hola! Me llamo Marco, soy italiano, de Turín. Tengo treinta años. Mucho gusto.» [O-la! me YA-mo MAR-ko, SOI i-ta-LIA-no, de tu-RIN. TEN-go TREIN-ta A-gnos. MU-cio GUS-to]</div>`,
  [
    q(
      'q1',
      'Come si dice «buongiorno» a un collega alle dieci di mattina?',
      ['Buenos días', 'Buen día', 'Buena día', 'Buenas días'],
      0,
      'Si usa il plurale e il maschile: «buenos días»; «buen día» è tipico di Argentina e Uruguay ma non della Spagna.',
    ),
    q(
      'q2',
      'Come si scrive «21 euros»?',
      ['veintiún euros', 'veintiuno euros', 'veinte y uno euros', 'veinte uno euros'],
      0,
      'Uno si apocopa in un davanti a un nome maschile e il numero si scrive in una parola sola: veintiún euros.',
    ),
    q(
      'q3',
      'Come si dice «500 persone»?',
      ['quinientas personas', 'quinientos personas', 'cincocientas personas', 'cinco cientas personas'],
      0,
      'Quinientos è irregolare, non si forma con cinco, e le centinaia concordano in genere con il nome: quinientas personas.',
    ),
    q(
      'q4',
      'Come si dice «sono le due e un quarto»?',
      ['Son las dos y cuarto', 'Es las dos y cuarto', 'Son la dos y cuarto', 'Son las dos cuarto'],
      0,
      'Dalle due in poi si usa son las, con articolo plurale; «es» è riservato a la una, e la congiunzione y collega il quarto.',
    ),
    q(
      'q5',
      "Come dici «ho trent'anni»?",
      ['Tengo treinta años', 'Soy treinta años', 'Estoy treinta años', 'Tengo de treinta años'],
      0,
      "L'età si esprime con tener + anni, come «avere» in italiano; ser ed estar non si usano per dire quanti anni hai.",
    ),
    q(
      'q6',
      'Come si dice «il 10 novembre»?',
      ['el diez de noviembre', 'el diez noviembre', 'el décimo de noviembre', 'diez del noviembre'],
      0,
      "Dal 2 in poi la data usa i cardinali e de davanti al mese; l'ordinale è ammesso solo per il giorno 1, e «del noviembre» non esiste.",
    ),
    q(
      'q7',
      'Come chiedi «come sta?» a un anziano sconosciuto in Spagna?',
      ['¿Cómo está usted?', '¿Cómo estás?', '¿Cómo estáis?', '¿Cómo está tú?'],
      0,
      'Il formale richiede usted con la terza persona singolare; «estás» è la seconda singolare informale e «está tú» mescola le due forme.',
    ),
    q(
      'q8',
      'Come si legge «chao», il saluto di congedo?',
      ['[CIAO]', '[KAO]', '[SCIAO]', '[CAO]'],
      0,
      "La ch spagnola vale la c di «cena»: chao si legge come l'italiano «ciao», senza k iniziale e senza il suono sc di «scena».",
    ),
    q(
      'q9',
      'Come si legge «jueves»?',
      ['[HUE-bes]', '[YUE-bes]', '[GIUE-bes]', '[JUE-ves]'],
      0,
      'La j è la jota (h raschiata) e la v si legge b; il nome del giorno è quindi [HUE-bes], senza suoni di g o y.',
    ),
  ],
  [
    card(
      'c1',
      'buenos días [BUE-nos DI-as]',
      'Buongiorno: plurale e maschile, fino a pranzo. Dopo pranzo: buenas tardes [BUE-nas TAR-dhes].',
    ),
    card(
      'c2',
      'Mucho gusto / encantado',
      '[MU-cio GUS-to] / [en-kan-TA-dho]: piacere. Donna: encantada. Risposta: igualmente [i-gual-MEN-te].',
    ),
    card(
      'c3',
      'tú / usted',
      'Informale / formale con verbo alla 3ª singolare. Plurale: vosotros (Spagna, informale), ustedes (formale e America).',
    ),
    card(
      'c4',
      'Tengo ... años',
      'Età con tener: tengo treinta años [TEN-go TREIN-ta A-gnos]. Domanda: ¿Cuántos años tienes? [KUAN-tos A-gnos TIE-nes]',
    ),
    card(
      'c5',
      'uno → un/una',
      'veintiún euros, treinta y un años, veintiuna personas: apocope davanti al nome maschile.',
    ),
    card(
      'c6',
      '100, 500, 700, 900',
      'cien [THIEN], ciento [THIEN-to], quinientos [ki-NIEN-tos], setecientos [se-te-THIEN-tos], novecientos [no-be-THIEN-tos].',
    ),
    card(
      'c7',
      'La data',
      'el 12 de octubre: cardinali e de; «il primo maggio» = el uno / el primero de mayo (solo il giorno 1); ¿A cuántos estamos?',
    ),
    card('c8', "L'ora", 'Es la una / Son las dos y cuarto / y media / menos cuarto. A las ocho = alle otto.'),
    card(
      'c9',
      'jueves [HUE-bes]',
      'J = jota (h raschiata), v = b. I giorni sono minuscoli e maschili: el jueves, los jueves.',
    ),
    card('c10', 'diez, doce, trece', '[DIETH], [DO-the], [TRE-the]: la z e la c davanti a e/i sono «th» (America: s).'),
    card(
      'c11',
      'adiós [a-DHIOS]',
      'Congedo. La d tra vocali è morbida (dh). Alternative: chao [CIAO], hasta luego [AS-ta LUE-go].',
    ),
    card('c12', 'millón', 'un millón de euros [un mi-YON de EU-ros]: con de + nome; mil non ha plurale (dos mil).'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Buonasera, mi chiamo Giulia, sono di Napoli e ho 28 anni. Piacere.»',
      'Buenas tardes (o noches), me llamo Giulia, soy de Nápoles y tengo veintiocho años. Mucho gusto (o encantada). Nota: veintiocho in una parola; Nápoles [NA-po-les].',
    ),
    prac(
      'p2',
      'Scrivi in lettere: 16, 21 euros, 35, 101, 500 personas, 1.250.',
      'dieciséis; veintiún euros; treinta y cinco; ciento uno; quinientas personas; mil doscientos cincuenta.',
    ),
    prac(
      'p3',
      'Dì in spagnolo: «Sono le sette meno un quarto» e «Il treno parte alle otto e mezza».',
      'Son las siete menos cuarto. / El tren sale a las ocho y media. In America anche: faltan quince para las siete.',
    ),
    prac(
      'p4',
      'Scrivi la data di oggi con il giorno, in spagnolo (es. «venerdì 6 novembre 2026»).',
      'viernes, 6 de noviembre de 2026 (viernes minuscolo; cardinale; de due volte; mil → dos mil veintiséis). Pronuncia: [BIER-nes, SEIS de no-BIEM-bre de dos MIL bein-ti-SSEIS].',
    ),
    prac(
      'p5',
      'Presentati in 4 frasi: nome, nazionalità, città, età. Poi chiedi lo stesso a una persona formale.',
      'Me llamo Marco. Soy italiano. Vivo en Bolonia. Tengo treinta años. Formale: ¿Cómo se llama usted? ¿De dónde es usted? ¿Dónde vive? ¿Cuántos años tiene?',
    ),
  ],
)

export const esSer = mod(
  'es-ser',
  'Ser, estar, tener, hay',
  "ser / estar / tener / hay vs haber, differenze d'uso, aggettivi che cambiano senso",
  'a1',
  `<p class="lead">In italiano «essere» fa tutto; in spagnolo due verbi (<b>ser</b> ed <b>estar</b>) si dividono il lavoro, e «avere» si dice <b>tener</b>, non <b>haber</b>. È il punto in cui gli italiani sbagliano di più all'inizio. Le pronunce seguono la convenzione del corso ([th] = think, [h] = jota).</p>
<h3>I tre verbi al presente</h3>
<table><tr><th></th><th>ser</th><th>estar</th><th>tener</th></tr>
<tr><td>yo</td><td>soy [SOI]</td><td>estoy [es-TOI]</td><td>tengo [TEN-go]</td></tr>
<tr><td>tú</td><td>eres [E-res]</td><td>estás [es-TAS]</td><td>tienes [TIE-nes]</td></tr>
<tr><td>él/ella/usted</td><td>es [ES]</td><td>está [es-TA]</td><td>tiene [TIE-ne]</td></tr>
<tr><td>nosotros</td><td>somos [SO-mos]</td><td>estamos [es-TA-mos]</td><td>tenemos [te-NE-mos]</td></tr>
<tr><td>vosotros</td><td>sois [SOIS]</td><td>estáis [es-TAIS]</td><td>tenéis [te-NEIS]</td></tr>
<tr><td>ellos/ustedes</td><td>son [SON]</td><td>están [es-TAN]</td><td>tienen [TIE-nen]</td></tr>
</table>
<h3>Ser: ciò che una cosa è</h3>
<ul><li><b>Identità e professione</b>: <b>Soy Marco</b> [SOI MAR-ko]; <b>Es médica</b> [es ME-dhi-ka]. Senza articolo davanti alla professione.</li><li><b>Origine e nazionalità</b>: <b>Somos de Turín</b> [SO-mos de tu-RIN].</li><li><b>Caratteristiche stabili</b>: <b>Es alto</b> [es AL-to], <b>es simpático</b> [es sim-PA-ti-ko].</li><li><b>Materia e possesso</b>: <b>La mesa es de madera</b> [la ME-ssa es de ma-DHE-ra], <b>Es de Ana</b>.</li><li><b>Ora, data, prezzo</b>: <b>Son las tres</b>, <b>Hoy es martes</b>, <b>¿Cuánto es?</b> [KUAN-to ES].</li><li><b>Dove si svolge un evento</b>: <b>La fiesta es en mi casa</b> [la FIES-ta es en mi KA-ssa].</li></ul>
<h3>Estar: dove e come ci si trova</h3>
<ul><li><b>Posizione</b> (di persone e cose): <b>Estoy en Madrid</b> [es-TOI en ma-DRIDH]; <b>El libro está en la mesa</b> [el LI-bro es-TA en la ME-ssa]. In italiano «il libro è sul tavolo» ma qui è <b>estar</b>.</li><li><b>Stati temporanei</b>: <b>Estoy cansado</b> [es-TOI kan-SSA-dho], <b>está contento</b> [es-TA kon-TEN-to].</li><li><b>Progressivo</b>: <b>Estoy comiendo</b> [es-TOI ko-MIEN-do] (estar + gerundio; la formazione del gerundio è nel modulo Presente indicativo).</li><li><b>Risultato</b>: <b>La puerta está abierta</b> [la PUER-ta es-TA a-BIER-ta].</li><li><b>Come lo senti ora</b>: <b>La sopa está muy buena</b> (sa di buono), <b>¡Qué guapa estás hoy!</b> (oggi sei bella).</li></ul>
<p>Domanda tipica: <b>¿Cómo eres?</b> [KO-mo E-res] (che tipo sei?) contro <b>¿Cómo estás?</b> [KO-mo es-TAS] (come stai?); <b>¿De dónde eres?</b> (origine) contro <b>¿Dónde estás?</b> (posizione). Espressioni fisse: <b>estar de acuerdo</b> [es-TAR de a-KUER-dho] (essere d'accordo), <b>estar de vacaciones</b>.</p>
<h3>Aggettivi che cambiano senso</h3>
<table><tr><th>Aggettivo</th><th>con ser</th><th>con estar</th></tr>
<tr><td>aburrido [a-bu-RRI-dho]</td><td>noioso</td><td>annoiato</td></tr>
<tr><td>listo [LIS-to]</td><td>furbo, intelligente</td><td>pronto</td></tr>
<tr><td>cansado [kan-SSA-dho]</td><td>stancante</td><td>stanco</td></tr>
<tr><td>verde [BER-dhe]</td><td>verde (colore)</td><td>acerbo</td></tr>
<tr><td>malo [MA-lo]</td><td>cattivo, scadente</td><td>malato (Spagna); andato a male</td></tr>
<tr><td>bueno [BUE-no]</td><td>buono (di carattere)</td><td>gustoso, in forma</td></tr>
<tr><td>seguro [se-GU-ro]</td><td>sicuro (luogo)</td><td>certo</td></tr>
<tr><td>atento [a-TEN-to]</td><td>cortese</td><td>attento ora</td></tr>
</table>
<p>Esempi: <b>Mi primo es aburrido</b> (è noioso) vs <b>Mi primo está aburrido</b> (si annoia); <b>Es listo</b> [es LIS-to] (è furbo) vs <b>Estoy listo</b> [es-TOI LIS-to] (sono pronto); <b>El plátano está verde</b> [el PLA-ta-no es-TA BER-dhe] (è acerbo).</p>
<h3>Tener: non solo «avere»</h3>
<p>Per il possesso si usa <b>tener</b>: <b>Tengo un coche</b> [TEN-go un KO-ce]. <b>Haber</b> serve solo come ausiliare (<i>he comido</i>) e nell'impersonale <b>hay</b>. Tener forma molte espressioni dove l'italiano usa «avere» (e altrove essere/avere):</p>
<table><tr><th>Spagnolo</th><th>Pronuncia</th><th>Italiano</th></tr>
<tr><td>tengo hambre</td><td>[TEN-go AM-bre]</td><td>ho fame</td></tr>
<tr><td>tengo sed</td><td>[TEN-go SEDH]</td><td>ho sete</td></tr>
<tr><td>tengo sueño</td><td>[TEN-go SUE-gno]</td><td>ho sonno</td></tr>
<tr><td>tengo frío / calor</td><td>[FRI-o] / [ka-LOR]</td><td>ho freddo / caldo</td></tr>
<tr><td>tengo miedo</td><td>[MIE-dho]</td><td>ho paura</td></tr>
<tr><td>tengo prisa</td><td>[PRI-ssa]</td><td>ho fretta</td></tr>
<tr><td>tengo razón</td><td>[rra-THON]</td><td>ho ragione</td></tr>
<tr><td>tengo ganas de</td><td>[GA-nas de]</td><td>ho voglia di</td></tr>
</table>
<h3>Hay: c'è, ci sono</h3>
<p><b>Hay</b> [AI] (da haber) vale «c'è» e «ci sono», uguale per singolare e plurale: <b>Hay un libro</b>, <b>Hay tres libros</b>, <b>¿Hay leche?</b> [AI LE-ce]. Si usa con elementi <b>indefiniti</b> (un/una, numeri, senza articolo, mucho, poco). Quando l'oggetto è definito si usa <b>estar</b>: <b>El libro está en la mesa</b>, <b>Mis llaves están aquí</b>. Errori da evitare: <b>«Hay los libros»</b>, <b>«Están tres libros en la mesa»</b> (natural: <b>Hay tres libros</b>). Passato: <b>había</b> [a-BI-a] / <b>hubo</b>; mai <i>habían</i> con un plurale.</p>
<div class="say"><b>Da dire.</b> «Soy de Turín, pero ahora estoy en Madrid. Hay un bar cerca, está en la calle Mayor.» [SOI de tu-RIN, PE-ro a-O-ra es-TOI en ma-DRIDH. AI un BAR THER-ka, es-TA en la KA-ye ma-YOR]</div>`,
  [
    q(
      'q1',
      'Come dici «il libro è sul tavolo»?',
      ['El libro está en la mesa', 'El libro es en la mesa', 'El libro hay en la mesa', 'El libro tiene en la mesa'],
      0,
      'La posizione di un oggetto definito vuole estar; ser serve per identità e caratteristiche, mentre hay è per cose indefinite.',
    ),
    q(
      'q2',
      'Cosa significa «Mi primo es aburrido»?',
      ['mio cugino è noioso', 'mio cugino è annoiato', 'mio cugino è pronto', 'mio cugino è sveglio'],
      0,
      'Con ser, aburrido descrive una caratteristica stabile (noioso); con estar descrive lo stato momentaneo di annoiarsi.',
    ),
    q(
      'q3',
      'Come dici «ho fame»?',
      ['Tengo hambre', 'Estoy hambre', 'Soy hambre', 'Tengo de hambre'],
      0,
      'Fame, sete, sonno e paura si dicono con tener come in italiano «avere»; estar e ser non reggono il sostantivo hambre.',
    ),
    q(
      'q4',
      "Come dici «c'è una farmacia qui vicino?»",
      [
        '¿Hay una farmacia cerca?',
        '¿Está una farmacia cerca?',
        '¿Es una farmacia cerca?',
        '¿Tiene una farmacia cerca?',
      ],
      0,
      'Con un elemento indefinito (una farmacia) si usa hay; estar si userebbe per una farmacia precisa e già nota.',
    ),
    q(
      'q5',
      'Qual è la differenza tra «ser listo» e «estar listo»?',
      [
        'ser listo = essere furbo; estar listo = essere pronto',
        'ser listo = essere pronto; estar listo = essere furbo',
        'ser listo = essere stanco; estar listo = essere pronto',
        "non c'è nessuna differenza di significato",
      ],
      0,
      'Listo è uno degli aggettivi che cambiano senso: con ser indica una qualità permanente (intelligente), con estar uno stato (pronto).',
    ),
    q(
      'q6',
      'Come dici «sono di Torino»?',
      ['Soy de Turín', 'Estoy de Turín', 'Soy en Turín', 'Tengo de Turín'],
      0,
      "L'origine si esprime con ser de; estar de indica attività temporanee (de vacaciones) e Torino in spagnolo è Turín.",
    ),
    q(
      'q7',
      'Quale frase è corretta?',
      [
        'Hay tres libros en la mesa',
        'Hay los tres libros en la mesa',
        'Está tres libros en la mesa',
        'Hay tres libro en la mesa',
      ],
      0,
      "Hay vuole un elemento indefinito e rimane invariabile; con l'articolo determinativo si userebbe estar, e il plurale del nome serve.",
    ),
    q(
      'q8',
      'Come si legge «estoy»?',
      ['[es-TOI]', '[ES-toi]', '[es-TOY] con y consonante', '[es-TO-i] con due sillabe finali'],
      0,
      "L'accento cade su -toy e la y finale vale i: [es-TOI]. L'accentazione sulla e iniziale sarebbe un errore da italiano.",
    ),
    q(
      'q9',
      "Dove cade l'accento di «están»?",
      [
        "sull'ultima sillaba: [es-TAN]",
        'sulla prima sillaba: [ES-tan]',
        'su tutte e due le sillabe: [ES-TAN]',
        'su nessuna: la parola è atona',
      ],
      0,
      "È una parola che finisce in n con accento sull'ultima: per questo ha la tilde. Senza tilde, estan si accentuerebbe sulla prima.",
    ),
  ],
  [
    card(
      'c1',
      'ser (presente)',
      'soy [SOI], eres [E-res], es [ES], somos [SO-mos], sois [SOIS], son [SON]: identità, origine, caratteristiche.',
    ),
    card(
      'c2',
      'estar (presente)',
      'estoy [es-TOI], estás [es-TAS], está [es-TA], estamos [es-TA-mos], estáis [es-TAIS], están [es-TAN].',
    ),
    card(
      'c3',
      'tener (presente)',
      'tengo [TEN-go], tienes, tiene, tenemos, tenéis, tienen: possesso, età, fame, sete, sonno, paura.',
    ),
    card('c4', 'hay [AI]', "C'è / ci sono, invariabile, con elementi indefiniti. Con l'articolo determinativo: estar."),
    card(
      'c5',
      'Posizione',
      'Sempre estar: El libro está en la mesa; ¿Dónde estás? Eccezione: eventi (La fiesta es en mi casa).',
    ),
    card('c6', 'aburrido, listo, cansado', 'ser = noioso, furbo, stancante; estar = annoiato, pronto, stanco.'),
    card(
      'c7',
      'bueno, malo, verde',
      'ser = buono di carattere, cattivo, verde colore; estar = gustoso, malato, acerbo.',
    ),
    card('c8', '¿Cómo eres? / ¿Cómo estás?', '[KO-mo E-res] che tipo sei; [KO-mo es-TAS] come stai ora.'),
    card('c9', 'estar de acuerdo', "Essere d'accordo: [es-TAR de a-KUER-dho]. Non «ser de acuerdo»."),
    card(
      'c10',
      'está / esta',
      "está [es-TA] (verbo, con tilde) ≠ esta [ES-ta] (questa, senza tilde): la tilde sposta l'accento.",
    ),
    card('c11', 'tengo frío [TEN-go FRI-o]', 'Ho freddo. Anche tengo calor, miedo, prisa, razón, ganas de.'),
    card('c12', 'estoy / están', "[es-TOI] / [es-TAN]: accento sull'ultima sillaba; la y finale vale i."),
  ],
  [
    prac(
      'p1',
      'Completa con ser, estar, tener o hay: «Mi hermano ___ médico y ___ en Madrid. ___ treinta años. En su casa ___ tres habitaciones.»',
      'Mi hermano es médico (professione) y está en Madrid (posizione). Tiene treinta años (età). En su casa hay tres habitaciones (esistenza di elementi indefiniti).',
    ),
    prac(
      'p2',
      'Correggi: «Soy cansado», «El libro es en la mesa», «Hay los niños en el parque», «Yo ho hambre», «Estoy de acuerdo» (è corretto?).',
      'Estoy cansado (stato). / El libro está en la mesa. / Los niños están en el parque (oggetto definito). / Yo tengo hambre. / «Estoy de acuerdo» è corretto: estar de acuerdo.',
    ),
    prac(
      'p3',
      'Traduci: «La riunione è in sala 3. Il caffè è freddo. Marco è un ragazzo noioso ma oggi è annoiato.»',
      'La reunión es en la sala tres (evento: ser). El café está frío (stato). Marco es un chico aburrido, pero hoy está aburrido (ser = noioso, estar = annoiato).',
    ),
    prac(
      'p4',
      "Descrivi in 4 frasi la tua camera: dove sei, cosa c'è, come sei, quanti anni hai.",
      "Estoy en mi habitación. Hay una cama, una mesa y dos sillas. Soy una persona tranquila. Tengo veintiocho años. (Modello: hay per elementi indefiniti, estar per la posizione, ser per le qualità, tener per l'età.)",
    ),
    prac(
      'p5',
      'Spiega la differenza: «La sopa está buena» vs «El abuelo es bueno».',
      'Con estar buena = sa di buono (giudizio sul momento); con ser bueno = è una persona buona di carattere (qualità stabile). Stesso aggettivo, due verbi, due significati.',
    ),
  ],
)

export const spagnoloA: CourseModule[] = [
  esPron,
  ...spagnoloA5,
  esSaluti,
  esSer,
  esNomi,
  esPresente,
  esQuotidiano,
  esPassato,
  esImperfecto,
  esPerfecto,
  esFuturo,
  esPronomi,
  esImperativo,
  esPorpara,
]
