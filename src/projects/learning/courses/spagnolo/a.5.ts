import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'

// Spanish course, A1: connected speech (syllables, linking, rhythm, intonation, minimal pairs).
// Pronunciation convention: see the header of spagnolo.a.ts and spagnolo.pron.ts.

export const esFonetica2 = mod(
  'es-fonetica2',
  'Fonetica 2: sillabe, legami, ritmo e intonazione',
  "Come dividere le sillabe, la sinalefa tra parole, il ritmo a sillabe, l'intonazione, coppie minime e scioglilingua",
  'a1',
  `<p class="lead">Dopo i suoni singoli del modulo precedente, qui impari a <b>mettere insieme</b> le parole: come si dividono le sillabe, come si legano le parole nel parlato, quale ritmo e quale intonazione ha lo spagnolo. Sono le cose che fanno suonare «da spagnolo» anche se ogni lettera è già giusta. Le trascrizioni usano la stessa convenzione del corso ([th], h = jota, ss, dh, gn, y).</p>
<h3>Sillabe: come si dividono</h3>
<ul><li>Una consonante tra due vocali va con la vocale che segue: <b>ca-sa</b>, <b>pe-ro</b>, <b>a-mi-go</b>. Le lettere doppie <b>ch, ll, rr</b> sono un suono solo e non si dividono mai: <b>mu-cho</b>, <b>ca-lle</b>, <b>pe-rro</b>.</li><li>Due consonanti si separano: <b>ac-ción</b> [ak-THION], <b>es-pa-ñol</b>, <b>per-so-na</b>. Restano unite le coppie con <b>l</b> o <b>r</b> (<b>pr, br, tr, dr, cr, gr, fr, pl, bl, cl, gl, fl</b>): <b>a-brir</b> [a-BRIR], <b>ha-blar</b> [a-BLAR], <b>ma-dre</b>, <b>i-gle-sia</b>.</li><li>Con tre consonanti si separa dopo la seconda se l'ultima forma un gruppo: <b>ins-tru-men-to</b> [ins-tru-MEN-to], <b>obs-tá-cu-lo</b>.</li><li>I trattini delle trascrizioni seguono queste regole: per questo <b>acción</b> è [ak-THION], con k e th separate.</li></ul>
<h3>Legami tra parole (sinalefa)</h3>
<p>Nel parlato non si dice parola per parola: una consonante finale si appoggia alla vocale iniziale della parola dopo e due vocali a contatto, anche tra parole diverse, formano una sola sillaba (<b>sinalefa</b>). Esempi: <b>mi amigo</b> si dice [mia-MI-go]; <b>los amigos</b> [lo-ssa-MI-gos]; <b>en el hotel</b> [e-ne-lo-TEL]; <b>¿Cómo estás?</b> [KO-moes-TAS]. Le trascrizioni del corso separano le parole per leggibilità, ma tu dille <b>senza pause</b>, come una sola catena di sillabe.</p>
<h3>Ritmo: sillabe quasi uguali</h3>
<p>Lo spagnolo ha un ritmo «a sillabe»: ognuna dura più o meno uguale. Le vocali atone non si riducono e la sillaba accentata <b>non si allunga</b> (in italiano «PEro» ha la prima vocale lunga; in spagnolo <b>pero</b> [PE-ro] ha due sillabe brevi, appena più forte la prima). Esercizio: batti la mano a tempo regolare, una volta per sillaba: <b>tres-tris-tes-ti-gres</b>.</p>
<h3>Intonazione</h3>
<ul><li><b>Affermazione</b>: la voce scende alla fine. <b>Tengo hambre</b> ↓ [TEN-go AM-bre].</li><li><b>Domanda sì/no</b>: stessa frase dell'affermazione, ma la voce sale verso la fine. <b>¿Tienes hambre?</b> ↑ [TIE-nes AM-bre].</li><li><b>Domanda con qué, dónde, cuándo...</b>: parte alta e scende. <b>¿Dónde vives?</b> ↓ [DON-de BI-bes].</li><li><b>Esclamazione</b>: voce forte e discendente. <b>¡Qué bien!</b> ↓ [ke BIEN].</li></ul>
<p>Il segno <b>¿</b> è utile proprio per questo: avvisa già all'inizio che la frase è una domanda, così sai da subito su quale tono partire.</p>
<h3>Coppie minime: allena l'orecchio</h3>
<table><tr><th>Coppia</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>caro / carro</td><td>[KA-ro] / [KA-rro]</td><td>caro / carro</td></tr>
<tr><td>pena / peña</td><td>[PE-na] / [PE-gna]</td><td>pena / roccia, gruppo di amici</td></tr>
<tr><td>ano / año</td><td>[A-no] / [A-gno]</td><td>ano / anno</td></tr>
<tr><td>cana / caña</td><td>[KA-na] / [KA-gna]</td><td>capello bianco / canna</td></tr>
<tr><td>casa / caza</td><td>[KA-ssa] / [KA-tha]</td><td>casa / caccia (America: uguali)</td></tr>
<tr><td>cesta / siesta</td><td>[THES-ta] / [SIES-ta]</td><td>cesto / pisolino (America: uguali)</td></tr>
<tr><td>jueves / huevos</td><td>[HUE-bes] / [UE-bos]</td><td>giovedì / uova</td></tr>
<tr><td>busca / busqué</td><td>[BUS-ka] / [bus-KE]</td><td>cerca / ho cercato</td></tr>
</table>
<h3>Scioglilingua per allenarti</h3>
<ul><li><b>Tres tristes tigres tragaban trigo en un trigal.</b> [tres TRIS-tes TI-gres tra-GA-ban TRI-go en un tri-GAL] (gruppo tr, una r sola)</li><li><b>Pablito clavó un clavito. ¿Qué clavito clavó Pablito?</b> [pa-BLI-to kla-BO un kla-BI-to. ke kla-BI-to kla-BO pa-BLI-to] (gruppi bl, cl)</li><li><b>Erre con erre cigarro, erre con erre barril; rápido ruedan los carros cargados de azúcar al ferrocarril.</b> [E-rre kon E-rre thi-GA-rro, E-rre kon E-rre ba-RRIL; RRA-pi-dho RRUE-dhan los KA-rros kar-GA-dhos de a-THU-kar al fe-rro-ka-RRIL] (rr e r iniziale)</li></ul>
<h3>Leggi e controlla</h3>
<p>Prova a leggere ad alta voce e poi confronta: <b>Mi madre vive en Madrid y hace queso en casa.</b> [mi MA-dre BI-be en ma-DRIDH i A-the KE-sso en KA-ssa]. Cosa controllare: la h di <b>hace</b> è muta ma la trascrizione la omette; <b>queso</b> e <b>casa</b> hanno la s sorda (ss); <b>Madrid</b> finisce con una d morbida (dh); <b>vive</b> si legge con la b.</p>
<p><b>Trappola italiana</b>: l'italiano allunga la vocale accentata e riduce quelle atone nel parlato veloce; in spagnolo ogni sillaba conserva la sua vocale piena. Se ti accorgi di dire «PEEro» o di inghiottire le vocali atone, rallenta e batti il tempo sulle sillabe.</p>
<div class="say"><b>Da dire.</b> «Mi amigo y yo tenemos hambre. ¿Dónde está el hotel? ¡Qué bien!» [mia-MI-go i YO te-NE-mos AM-bre. DON-de es-TA el o-TEL. ke BIEN]</div>`,
  [
    q(
      'q1',
      'Come si dividono in sillabe «hablar» e «ocho»?',
      ['ha-blar, o-cho', 'hab-lar, o-cho', 'ha-blar, oc-ho', 'hab-lar, oc-ho'],
      0,
      'Il gruppo bl resta unito alla vocale che segue, e ch è un solo suono che non si divide mai: ha-blar, o-cho.',
    ),
    q(
      'q2',
      'Come cambia la voce in «¿Dónde vives?», una domanda con parola interrogativa?',
      [
        'parte alta e scende verso la fine',
        "sale soltanto sull'ultima sillaba",
        "resta piatta come in un'affermazione",
        "scende all'inizio e risale alla fine",
      ],
      0,
      "Le domande con qué, dónde, cuándo partono dall'alto e scendono; la salita finale è tipica delle domande sì/no.",
    ),
    q(
      'q3',
      'Quale coppia si distingue solo per r semplice contro rr vibrata?',
      ['caro / carro', 'casa / caza', 'cana / caña', 'pena / peña'],
      0,
      'Caro [KA-ro] e carro [KA-rro] cambiano solo la r; casa/caza differiscono per s e th, cana/caña e pena/peña per la ñ.',
    ),
    q(
      'q4',
      'Come si dice «mi amigo» nel parlato normale?',
      [
        'legato in una sillaba: [mia-MI-go]',
        'con pausa: [mi, a-MI-go]',
        'con una t: [mi-ta-MI-go]',
        'con una h: [mi-ha-MI-go]',
      ],
      0,
      'La vocale finale e quella iniziale formano una sola sillaba (sinalefa): le parole si dicono legate, senza pause né consonanti aggiunte.',
    ),
    q(
      'q5',
      'Come si legge «ferrocarril»?',
      ['[fe-rro-ka-RRIL]', '[fe-ro-ka-RIL]', '[FE-rro-ka-rril]', '[fe-rro-KA-ril]'],
      0,
      "È una aguda in l, quindi accento sull'ultima sillaba; la rr è vibrata multipla sia in ferro- sia in -rril, e non va semplificata.",
    ),
    q(
      'q6',
      'Come si dividono in sillabe «instrumento»?',
      ['ins-tru-men-to', 'in-stru-men-to', 'ins-trum-en-to', 'in-s-tru-men-to'],
      0,
      'Con tre consonanti si separa dopo la seconda, perché tr è un gruppo che resta unito alla vocale seguente: ins-tru-men-to.',
    ),
    q(
      'q7',
      "Che ritmo ha lo spagnolo rispetto all'italiano?",
      [
        'sillabe di durata quasi uguale, senza allungare la accentata',
        'accentata molto lunga e atone ridotte e deboli',
        'atone ridotte a una vocale neutra come in inglese',
        'tutte le sillabe accentate con la stessa forza',
      ],
      0,
      "Lo spagnolo è a sillabe: le vocali atone restano piene e l'accentata è appena più forte, non più lunga come in «PEro» italiano.",
    ),
    q(
      'q8',
      'Come si legge «peña» (roccia)?',
      ['[PE-gna]', '[PE-na]', '[PE-nia]', '[PE-glia]'],
      0,
      'La ñ vale la gn di gnocchi, ma breve; pena senza tilde si legge [PE-na] e significa «pena», parola diversa.',
    ),
  ],
  [
    card(
      'c1',
      'Sillabazione',
      'Una consonante va con la vocale dopo; ch, ll, rr non si dividono; pr, br, tr, dr, cr, gr, fr, pl, bl, cl, gl, fl restano uniti: a-brir, ac-ción.',
    ),
    card(
      'c2',
      'Sinalefa',
      'Le parole si legano: mi amigo [mia-MI-go], los amigos [lo-ssa-MI-gos], en el hotel [e-ne-lo-TEL].',
    ),
    card(
      'c3',
      'Intonazione',
      "Affermazione: scende. Domanda sì/no: sale alla fine. Domanda con qué/dónde: alta e scende. ¿ avvisa dall'inizio.",
    ),
    card(
      'c4',
      'Coppie minime',
      'caro/carro, pena/peña, ano/año, cana/caña, casa/caza (Spagna), cesta/siesta, jueves/huevos, busca/busqué.',
    ),
    card(
      'c5',
      'Ritmo a sillabe',
      'Ogni sillaba dura quasi uguale; vocali atone piene; la accentata appena più forte, non più lunga: pero [PE-ro].',
    ),
    card(
      'c6',
      'Tres tristes tigres',
      '[tres TRIS-tes TI-gres tra-GA-ban TRI-go en un tri-GAL]: gruppo tr con una r sola.',
    ),
    card(
      'c7',
      'Domanda: ¿...?',
      "Il ¿ avvisa dall'inizio. Sì/no: la voce sale alla fine. Qué/dónde/cuándo: parte alta e scende.",
    ),
    card(
      'c8',
      'Gruppi uniti',
      'pr, br, tr, dr, cr, gr, fr, pl, bl, cl, gl, fl non si dividono: a-brir, ha-blar, ma-dre, i-gle-sia.',
    ),
  ],
  [
    prac(
      'p1',
      'Dividi in sillabe: abrir, instrumento, acción, ahora, mucho, perro, estudiáis.',
      'a-brir; ins-tru-men-to; ac-ción; a-ho-ra; mu-cho (ch unito); pe-rro (rr unite); es-tu-diáis (trittongo, una sola sillaba finale).',
    ),
    prac(
      'p2',
      'Scrivi la pronuncia legata di: mi amigo, los amigos, en el hotel, ¿cómo estás?',
      'mi amigo [mia-MI-go]; los amigos [lo-ssa-MI-gos]; en el hotel [e-ne-lo-TEL]; ¿cómo estás? [KO-moes-TAS]. Consonante finale + vocale iniziale = una sillaba; vocali a contatto si fondono.',
    ),
    prac(
      'p3',
      "Indica con ↑ o ↓ l'intonazione finale: ¿Tienes hambre? / ¿Qué quieres? / Tengo sed. / ¡Qué bien!",
      "¿Tienes hambre? ↑ (domanda sì/no). ¿Qué quieres? ↓ (parte alta, scende). Tengo sed. ↓ (affermazione). ¡Qué bien! ↓ (esclamazione). Il ¿ avvisa già dall'inizio che la frase è una domanda.",
    ),
    prac(
      'p4',
      'Leggi lentamente tre volte «Tres tristes tigres tragaban trigo en un trigal» e dì dove si nascondono i gruppi consonantici.',
      '[tres TRIS-tes TI-gres tra-GA-ban TRI-go en un tri-GAL]. Gruppi tr in tres, tristes, tragaban, trigo, trigal e gr in tigres: la r è un solo colpo di lingua (non vibrare), le vocali non si riducono, ritmo a sillabe uguali.',
    ),
    prac(
      'p5',
      'Leggi ad alta voce legando le parole e trascrivi: «Los amigos están en el hotel. ¿Dónde está mi amiga?»',
      '[lo-ssa-MI-go-sses-TAN e-ne-lo-TEL. DON-de es-TA mia-MI-ga]. Le consonanti finali si appoggiano alla vocale seguente, le vocali a contatto si fondono, nessuna pausa tra le parole; domanda con qué/dónde: voce alta che scende.',
    ),
  ],
)

export const spagnoloA5: CourseModule[] = [esFonetica2]
