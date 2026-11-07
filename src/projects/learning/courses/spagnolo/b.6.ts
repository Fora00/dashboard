import { card, mod, prac, q } from '../kit'
import { PRON_FULL } from './pron'

// Spanish exam preparation (DELE A2/B1/B2): format, strategies, writing templates, oral section, 40 mixed questions.
// Pronunciation: the single convention of spagnolo.pron.ts (same as es-pron in spagnolo.a.ts). DELE figures are indicative.

export const esEsame = mod(
  'es-esame',
  'Preparazione al DELE A2, B1 e B2',
  'Formato delle prove, strategie, modelli di scrittura, pronuncia e prova orale, 40 domande miste',
  'drill',
  `<p class="lead">Il <b>DELE</b> (Diplomas de Español como Lengua Extranjera) è il titolo ufficiale dell'<b>Instituto Cervantes</b>: il diploma non scade. Esistono i livelli A1, A2, B1, B2, C1, C2 e si sostiene nei centri accreditati (anche in Italia). L'alternativa online è il SIELE.</p>
<h3>Formato (ordine di grandezza)</h3>
<p>Le quattro abilità sono sempre le stesse. Durate e numero di compiti sono indicativi: controlla sempre il bando e il formato aggiornato sul sito del Cervantes.</p>
<table><tr><th>Prova</th><th>A2</th><th>B1</th><th>B2</th></tr>
<tr><td>Lectura</td><td>4 compiti</td><td>5 compiti</td><td>5 compiti</td></tr>
<tr><td>Auditiva</td><td>4 compiti</td><td>5 compiti</td><td>5 compiti</td></tr>
<tr><td>Escrita</td><td>2 compiti</td><td>2 compiti</td><td>2 compiti</td></tr>
<tr><td>Oral</td><td>4 compiti</td><td>4 compiti</td><td>4 compiti</td></tr></table>
<p><i>Dati indicativi, non ufficiali: il numero di compiti, le durate e i punteggi cambiano con le riforme del Cervantes. Prima di iscriverti verifica tutto sul bando e sulle guide dell'edizione corrente.</i></p>
<ul><li>Le prove si raggruppano in <b>Grupo 1</b> (lectura + escrita) e <b>Grupo 2</b> (auditiva + oral). Per ogni gruppo serve un punteggio minimo (di solito il 60%): il risultato è <b>APTO</b> / <b>NO APTO</b>.</li><li>Testi tipici: A2 = messaggi, annunci, brevi dialoghi; B1 = email, articoli semplici, opinioni; B2 = articoli, reportage, testi argomentativi.</li></ul>
<h3>Punteggio e come si supera il DELE</h3>
<p>Struttura generale (valida per i livelli dal A2 al C2; <b>dato indicativo</b>): quattro prove, ciascuna con lo stesso peso, per un totale di <b>100 punti</b>. Si sommano a coppie in due gruppi da 50 punti.</p>
<table><tr><th>Gruppo</th><th>Prove</th><th>Punti</th></tr>
<tr><td>Grupo 1</td><td>Comprensión de lectura + Expresión e interacción escritas</td><td>50</td></tr>
<tr><td>Grupo 2</td><td>Comprensión auditiva + Expresión e interacción orales</td><td>50</td></tr></table>
<ul><li><b>APTO</b> in un gruppo = almeno <b>30 punti su 50</b> in quel gruppo (il 60%). Per ottenere il diploma serve l'apto in <b>entrambi</b> i gruppi: i punti in eccesso di un gruppo non compensano l'altro.</li><li>Esempio: 28 in Grupo 1 e 41 in Grupo 2 = <b>no apto</b> nel Grupo 1, anche se la somma (69) sembra buona.</li><li>Le prove scritte e orali sono valutate con criteri (adeguatezza, coerenza, correzione, ricchezza lessicale), non solo contando gli errori: un testo completo e comprensibile vale più di uno cortissimo e perfetto.</li></ul>
<p><i>Attenzione: queste cifre sono indicative. Durate, numero di compiti, punteggi per compito e regole di ripetizione variano per livello e per versione dell'esame: controlla sempre il bando e le guide ufficiali sul sito dell'Instituto Cervantes (examenes.cervantes.es) prima di iscriverti.</i></p>
<h3>Strategie</h3>
<ul><li><b>Lettura</b>: leggi prima le domande, cerca le parole chiave, non tradurre parola per parola. Se una parola è ignota, deduci dal contesto e vai avanti.</li><li><b>Ascolto</b>: leggi le opzioni mentre aspetti l'audio; al primo ascolto segna, al secondo controlla.</li><li><b>Scrittura</b>: 5 minuti di schema, rispetta il numero di parole e tutti i punti della consegna, usa connettori, rileggi accenti e concordanze.</li><li><b>Orale</b>: parla sempre, anche con frasi semplici; meglio una frase sbagliata ma completa che il silenzio.</li></ul>
<h3>Modelli di scrittura</h3>
<p><b>Email informale (B1)</b>: <i>Hola, Marta: ¿Qué tal? Te escribo para contarte que… Me gustaría que vinieras… Dime algo pronto. Un abrazo, Marco.</i></p>
<p><b>Testo di opinione (B2)</b>: introduzione (<i>En la actualidad se debate si…</i>), argomento 1 (<i>En primer lugar…</i>), argomento 2 (<i>Además…</i>), controargomento (<i>Sin embargo, algunos opinan que…</i>), conclusione (<i>En definitiva, creo que…</i>).</p>
<p><b>Lettera formale (B2)</b>: <i>Estimados señores: Me dirijo a ustedes para… Solicito… A la espera de su respuesta, les saluda atentamente,</i></p>
<p>Connettori utili: <i>además, sin embargo, por eso, aunque, por un lado… por otro, en definitiva</i>.</p>
<h3>Pronuncia e prova orale</h3>
<p>Nell'orale conta la comprensibilità, non l'accento perfetto. Cinque punti che aiutano gli italiani:</p>
${PRON_FULL}
<ul><li><b>Vocali pure e nitide</b> (a-e-i-o-u), mai ridotte: <i>casa</i> [KA-ssa], <i>mesa</i> [ME-ssa].</li><li><b>Niente doppie italiane</b>: <i>año</i> [A-gno], <i>cama</i> [KA-ma] (non «camma»). La <i>rr</i> è una lettera a sé (vibrante), non una doppia; <i>cc</i> e <i>nn</i> sono rare (<i>acción</i> [ak-THION], <i>innato</i> [in-NA-to]).</li><li><b>Suoni da curare</b>: j e g davanti a e/i = jota (trascritta h), ll/y = y («ieri»), ñ = gn, ch = c di «cena», z/ce/ci = th (o s in America), s tra vocali sempre sorda (ss), d tra vocali morbida (dh), h scritta muta. Es. <i>mucho</i> [MU-cio], <i>mujer</i> [mu-HER], <i>caballo</i> [ka-BA-yo].</li><li><b>Accento tonico</b>: parole che finiscono in vocale, -n, -s sono piane (<i>hablan</i> [A-blan]); le altre sono tronche (<i>ciudad</i> [thiu-DADH]); eccezioni segnate dall'accento scritto (<i>café</i>, <i>canción</i> [kan-THION], <i>lápiz</i> [LA-pith]). L'accento cambia il significato: <i>hablo / habló</i> [A-blo / a-BLO].</li><li><b>Ritmo</b>: ogni sillaba dura quasi uguale; non allungare le vocali come in inglese e non far salire e scendere la voce a ogni sillaba: l'intonazione resta piatta e scende alla fine dell'affermazione.</li></ul>
<p>Frasi per guadagnare tempo: <i>Pues… / A ver… / Bueno, la verdad es que…</i> [PUES / a BER / BUE-no la ber-DADH es ke]. Per farti ripetere: <i>¿Podría repetir, por favor?</i> [po-DRI-a rre-pe-TIR por fa-BOR]. Per correggerti: <i>mejor dicho…</i> [me-HOR DI-cio].</p>
<p>Descrivere una foto: <i>En la foto se ve… Al fondo hay… A la izquierda… Parece que… Me da la impresión de que…</i></p>
<div class="say"><b>Cosa dire.</b> «En mi opinión, aunque tiene ventajas, también tiene inconvenientes.» [en mi o-pi-NION aun-ke TIE-ne ben-TA-has tam-BIEN TIE-ne in-kon-BE-nien-tes]</div>`,
  [
    q(
      'q1',
      `Cosa rilascia il DELE?`,
      [
        `Un diploma a vita dell'Instituto Cervantes`,
        `Un certificato valido due anni`,
        `Una laurea in filologia spagnola`,
        `Un attestato di frequenza`,
      ],
      0,
      `Il DELE è un diploma ufficiale e non scade. Non è una laurea né un semplice attestato di partecipazione.`,
    ),
    q(
      'q2',
      `Quale NON è una prova del DELE?`,
      [`Traduzione dall'italiano`, `Comprensión de lectura`, `Comprensión auditiva`, `Expresión e interacción orales`],
      0,
      `Le quattro prove sono lettura, ascolto, scrittura e orale. Non è prevista una traduzione dall'italiano.`,
    ),
    q(
      'q3',
      `Completa: <i>La fiesta ___ en mi casa.</i>`,
      [`es`, `está`, `hay`, `tiene`],
      0,
      `Per la localizzazione di un evento si usa ser. Estar si usa per la posizione di oggetti e persone.`,
    ),
    q(
      'q4',
      `Completa: <i>Trabajo ___ una empresa grande.</i>`,
      [`para`, `por`, `en de`, `a`],
      0,
      `Trabajar para indica il datore di lavoro. Por si userebbe per causa, prezzo o durata.`,
    ),
    q(
      'q5',
      `Completa: <i>Ayer (yo) ___ al cine.</i>`,
      [`fui`, `iba`, `he ido`, `iré`],
      0,
      `Ayer è un tempo finito, quindi pretérito indefinido (fui). Iba descriverebbe un'abitudine nel passato.`,
    ),
    q(
      'q6',
      `Completa: <i>Cuando ___ niño, jugaba al fútbol.</i>`,
      [`era`, `fui`, `fue`, `sería`],
      0,
      `Il contesto descrive uno stato e un'abitudine nel passato, quindi imperfecto. Fui indicherebbe un fatto puntuale.`,
    ),
    q(
      'q7',
      `Completa: <i>Quiero que tú ___ conmigo.</i>`,
      [`vengas`, `vienes`, `venir`, `vendrás`],
      0,
      `Querer que con soggetto diverso vuole il subjuntivo presente. Vienes è indicativo e venir un infinito.`,
    ),
    q(
      'q8',
      `Completa: <i>Es posible que mañana ___.</i>`,
      [`llueva`, `llueve`, `lloverá`, `llovió`],
      0,
      `Es posible que regge il subjuntivo (llueva). Lloverá sarebbe un futuro indicativo e non va dopo que.`,
    ),
    q(
      'q9',
      `Completa: <i>Cuando (yo) ___ a Madrid, te llamaré.</i>`,
      [`llegue`, `llegaré`, `llego`, `llegaba`],
      0,
      `Dopo cuando con senso futuro serve il subjuntivo presente. Llegaré è il calco dell'italiano e non va usato.`,
    ),
    q(
      'q10',
      `Completa: <i>Si ___ rico, compraría una casa.</i>`,
      [`fuera`, `sería`, `seré`, `soy`],
      0,
      `Il periodo ipotetico di tipo 2 vuole si + imperfecto de subjuntivo. Sería (condizionale) dopo si è un errore tipico.`,
    ),
    q(
      'q11',
      `Completa: <i>Yo que tú, ___ más.</i>`,
      [`estudiaría`, `estudio`, `estudié`, `estudiara`],
      0,
      `Yo que tú regge il condizionale. Estudiara sarebbe un subjuntivo e non ha senso nella principale.`,
    ),
    q(
      'q12',
      `In Spagna: «Stamattina ho fatto colazione.»`,
      [`Esta mañana he desayunado`, `Esta mañana desayuné`, `Esta mañana desayunaba`, `Esta mañana desayunaré`],
      0,
      `In Spagna con indicatori di tempo non ancora concluso (esta mañana) si usa il perfecto. In America è comune anche l'indefinido.`,
    ),
    q(
      'q13',
      `Completa: <i>Cuando llegué, la película ya ___.</i>`,
      [`había empezado`, `ha empezado`, `empezaba`, `empezó`],
      0,
      `Azione anteriore a un momento del passato = pluscuamperfecto. Empezó indicherebbe lo stesso momento.`,
    ),
    q(
      'q14',
      `Completa: <i>No ___ tan rápido</i> (tú, hablar).`,
      [`hables`, `hablas`, `habla`, `hablar`],
      0,
      `L'imperativo negativo usa il subjuntivo. Habla è l'imperativo affermativo, hablas l'indicativo.`,
    ),
    q(
      'q15',
      `Come si dice «Glielo do» (il libro a Ana)?`,
      [`Se lo doy`, `Le lo doy`, `Lo le doy`, `Se le doy`],
      0,
      `Le + lo diventa se lo. Si evita la sequenza le lo, che non esiste in spagnolo.`,
    ),
    q(
      'q16',
      `Completa: <i>A mí ___ los libros.</i>`,
      [`me gustan`, `me gusta`, `gusto`, `me gusto`],
      0,
      `Gustar concorda con ciò che piace (los libros, plurale). Me gusta sarebbe corretto con un singolare.`,
    ),
    q(
      'q17',
      `Completa: <i>Se ___ pisos.</i>`,
      [`venden`, `vende`, `vendido`, `vendiendo`],
      0,
      `Nella pasiva refleja il verbo concorda con la cosa (pisos, plurale). Vende sarebbe giusto con un singolare.`,
    ),
    q(
      'q18',
      `Completa: <i>Llevo tres años ___ aquí.</i>`,
      [`viviendo`, `vivir`, `vivido`, `vivo`],
      0,
      `Llevar + tempo + gerundio indica una durata che continua. Con l'infinito o il participio perde il significato.`,
    ),
    q(
      'q19',
      `Cosa significa <i>ropa</i>?`,
      [`Vestiti`, `Roba, oggetti`, `Corda`, `Stoffe`],
      0,
      `Ropa vuol dire vestiti: è il falso amico dell'italiano «roba». Gli oggetti in generale sono cosas, la corda si dice cuerda e le stoffe telas.`,
    ),
    q(
      'q20',
      `Cosa significa <i>éxito</i>?`,
      [`Successo`, `Uscita`, `Esito`, `Esperienza`],
      0,
      `Éxito vuol dire successo. L'uscita è salida (il falso amico più tentante, perché éxito ricorda «uscita»), l'esito neutro è resultado e l'esperienza experiencia.`,
    ),
    q(
      'q21',
      `Cosa significa <i>salir</i>?`,
      [`Uscire`, `Salire`, `Salare`, `Salvare`],
      0,
      `Salir è uscire (salgo de casa), salire si dice subir. Il suono simile inganna l'orecchio italiano.`,
    ),
    q(
      'q22',
      `Cosa significa <i>largo</i>?`,
      [`Lungo`, `Largo`, `Stretto`, `Alto`],
      0,
      `Largo = lungo; la larghezza si dice ancho. È una coppia di falsi amici molto frequente.`,
    ),
    q(
      'q23',
      `Come si legge <i>año</i>?`,
      [`[A-gno]`, `[A-no]`, `[A-nio]`, `[A-nho]`],
      0,
      `La ñ è il suono gn di "sogno". È una consonante unica, non una n seguita da i.`,
    ),
    q(
      'q24',
      `Come si pronuncia <i>zapato</i> nella Spagna centro-settentrionale?`,
      [`[tha-PA-to]`, `[sa-PA-to]`, `[tsa-PA-to]`, `[ka-PA-to]`],
      0,
      `Nella distinción la z è un suono interdentale come l'inglese "think". Sa-PA-to è il seseo, tipico dell'America.`,
    ),
    q(
      'q25',
      `Come si legge <i>jirafa</i>?`,
      [`[hi-RA-fa]`, `[gi-RA-fa]`, `[yi-RA-fa]`, `[ghi-RA-fa]`],
      0,
      `La g davanti a i è la jota, una h raschiata: [hi-RA-fa]. Non è la g molle dell'italiano «giraffa», né una i consonantica né la g dura di «ghiro».`,
    ),
    q(
      'q26',
      `Come si legge <i>calle</i>?`,
      [`[KA-ye]`, `[KAL-le]`, `[KA-le]`, `[KAL-ge]`],
      0,
      `Ll e y si pronunciano come una i consonantica, come in «ieri» (yeísmo). Non è una l doppia come in italiano né una gi.`,
    ),
    q(
      'q27',
      `Come si legge <i>mucho</i>?`,
      [`[MU-cio]`, `[MU-ko]`, `[MU-ho]`, `[MU-tsio]`],
      0,
      `La ch spagnola suona come la c italiana di cena e ciao. Non è dura come la ch italiana di chiesa.`,
    ),
    q(
      'q28',
      `Come si legge <i>hotel</i>?`,
      [`[o-TEL]`, `[ho-TEL]`, `[ko-TEL]`, `[o-TE-le]`],
      0,
      `La h iniziale è muta e la tonica cade sull'ultima sillaba (-tel). Non si pronuncia nessuna aspirazione, come in italiano.`,
    ),
    q(
      'q29',
      `Dove cade l'accento di <i>canción</i>?`,
      [`Sull'ultima sillaba`, `Sulla prima`, `Sulla penultima`, `Non ha accento`],
      0,
      `L'accento scritto indica la sillaba tonica: can-CIÓN [kan-THION]. Le parole terminanti in -n senza accento sarebbero piane.`,
    ),
    q(
      'q30',
      `Quale frase usa la forma giusta della domanda?`,
      [`¿Por qué no vienes?`, `¿Porque no vienes?`, `¿Por que no vienes?`, `¿Porqué no vienes?`],
      0,
      `La domanda diretta vuole por qué in due parole con l'accento. Porque (una parola) è la risposta.`,
    ),
    q(
      'q31',
      `Completa: <i>No es rojo, ___ azul.</i>`,
      [`sino`, `si no`, `pero no`, `aunque`],
      0,
      `Dopo una negazione per contrapporre si usa sino. Si no (separati) significa se non.`,
    ),
    q(
      'q32',
      `Completa: <i>El autor ___ libros leí es famoso.</i>`,
      [`cuyos`, `cuyo`, `cuya`, `cuyas`],
      0,
      `Cuyo concorda con il posseduto (libros, maschile plurale). Cuyo sarebbe singolare e non concorda.`,
    ),
    q(
      'q33',
      `Come si riporta «Vendré mañana» con <i>dijo que</i>?`,
      [
        `Dijo que vendría al día siguiente`,
        `Dijo que vendrá mañana`,
        `Dijo que viene mañana`,
        `Dijo que vino al día siguiente`,
      ],
      0,
      `Il futuro diventa condizionale e mañana diventa al día siguiente nel discorso indiretto passato.`,
    ),
    q(
      'q34',
      `Quale saluto è adatto a una lettera formale?`,
      [`Estimado señor Pérez:`, `Hola, Pérez, ¿qué tal?`, `¡Eh, señor Pérez!`, `Querido amigo Pérez:`],
      0,
      `Estimado + titolo e cognome con i due punti è la formula standard. Le altre sono troppo informali.`,
    ),
    q(
      'q35',
      `Come si dice «Hai ragione» con il voseo?`,
      [`Vos tenés razón`, `Vos tienes razón`, `Vos tenéis razón`, `Vos tengas razón`],
      0,
      `Il voseo ha l'accento sulla desinenza (tenés). Tienes è tú e tenéis è vosotros, forme di altri sistemi.`,
    ),
    q(
      'q36',
      `Come si dice «computer» in Spagna?`,
      [`ordenador`, `computadora`, `computador`, `calculador`],
      0,
      `In Spagna si dice ordenador. Computadora è la parola di Messico e Argentina, computador di Colombia e Cile, mentre calculador non è usato per il computer.`,
    ),
    q(
      'q37',
      `Cosa significa <i>Esta manzana está verde</i>?`,
      [`La mela è acerba`, `La mela è di colore verde`, `La mela è marcia`, `La mela è fresca`],
      0,
      `Con estar, verde descrive lo stato: acerbo. Il colore verde sarebbe es verde, e marcia o fresca non c'entrano con il verbo estar.`,
    ),
    q(
      'q38',
      `Come si dice «Ho fame»?`,
      [`Tengo hambre`, `Soy hambre`, `Estoy hambre`, `Hago hambre`],
      0,
      `Con fame, sete, freddo, paura si usa tener. Le altre forme sono calchi dall'inglese o dall'italiano.`,
    ),
    q(
      'q39',
      `Quale frase è corretta?`,
      [`Conozco a tu hermano`, `Conozco tu hermano`, `Conozco de tu hermano`, `Conozco al tu hermano`],
      0,
      `Davanti a un complemento di persona determinata si usa la a personal. Senza è un errore tipico degli italiani.`,
    ),
    q(
      'q40',
      `Come si leggono <i>término</i>, <i>termino</i>, <i>terminó</i>?`,
      [
        `[TER-mi-no], [ter-MI-no], [ter-mi-NO]`,
        `[ter-MI-no], [TER-mi-no], [ter-mi-NO]`,
        `[TER-mi-no], [ter-mi-NO], [ter-MI-no]`,
        `[ter-mi-NO], [ter-MI-no], [TER-mi-no]`,
      ],
      0,
      `Término (nome) è sdrucciola, termino (io finisco) è piana, terminó (lui finì) è tronca con l'accento scritto. Le altre combinazioni spostano la tonica sulla sillaba sbagliata.`,
    ),
  ],
  [
    card(
      `c1`,
      `DELE: struttura`,
      `Quattro abilità: lectura, auditiva, escrita, oral. Grupo 1 = lectura + escrita; Grupo 2 = auditiva + oral. APTO / NO APTO.`,
    ),
    card(
      `c2`,
      `Strategia di lettura`,
      `Leggi prima le domande, cerca le parole chiave, non tradurre parola per parola.`,
    ),
    card(
      `c3`,
      `Strategia di scrittura`,
      `5 minuti di schema, numero di parole, tutti i punti della consegna, connettori, rilettura.`,
    ),
    card(`c4`, `Connettori da conoscere`, `además, sin embargo, por eso, aunque, por un lado… por otro, en definitiva`),
    card(`c5`, `Frasi per guadagnare tempo`, `Pues… · A ver… · Bueno, la verdad es que…`),
    card(`c6`, `Chiedere di ripetere`, `¿Podría repetir, por favor? [po-DRI-a rre-pe-TIR por fa-BOR]`),
    card(`c7`, `Descrivere una foto`, `En la foto se ve… · Al fondo hay… · Parece que… · Me da la impresión de que…`),
    card(
      `c8`,
      `Regole dell'accento`,
      `Vocale, -n, -s: piane (hablan). Altre consonanti: tronche (ciudad). Eccezioni: accento scritto.`,
    ),
    card(
      `c9`,
      `Suoni da curare`,
      `j, g(e,i) = h (jota) · ll/y = y («ieri») · ñ = gn · ch = c di «cena» · z/c(e,i) = th (Spagna) · s tra vocali = ss · d tra vocali = dh · h scritta muta`,
    ),
    card(`c10`, `hablo / habló`, `[A-blo] presente · [a-BLO] passato. L'accento cambia il tempo.`),
    card(`c11`, `Registro formale`, `Estimado señor López: … A la espera de su respuesta, atentamente,`),
  ],
  [
    prac(
      `p1`,
      `Scrivi un'email informale (circa 80 parole) a un amico: lo inviti al tuo compleanno e gli chiedi di portare una bibita.`,
      `Hola, Marta: ¿Qué tal? Te escribo para invitarte a mi cumpleaños, que celebraré el sábado 14 a las ocho de la tarde en mi casa. Va a venir un grupo pequeño de amigos y vamos a cenar pizza, así que no hace falta que traigas comida. Me gustaría que vinieras y, si puedes, que trajeras algo de beber, por ejemplo refrescos o un par de botellas de agua. Si no te viene bien esa hora, dímelo y lo cambiamos. ¡Espero que puedas venir! Un abrazo, Marco. (Circa 85 parole. Controlla: invito, richiesta, ora, saluto.)`,
    ),
    prac(
      `p2`,
      `Scrivi un testo di opinione (circa 120 parole): «Lavorare da casa: pro e contro».`,
      `En la actualidad muchas personas trabajan desde casa, y se debate si este modelo es realmente mejor que la oficina. En primer lugar, quienes teletrabajan ahorran tiempo y dinero porque no tienen que desplazarse todos los días. Además, pueden organizar mejor su jornada y concentrarse más, sobre todo si necesitan hacer tareas que requieren silencio. Por otro lado, el aislamiento y la falta de límites entre trabajo y vida personal son problemas importantes: muchas personas acaban trabajando más horas que antes. Sin embargo, algunos opinan que se puede resolver con un horario claro y reuniones presenciales de vez en cuando. En definitiva, creo que el sistema híbrido, con dos o tres días en la oficina, es la mejor solución. (Circa 125 parole. Schema: introduzione, 2 argomenti, controargomento, conclusione.)`,
    ),
    prac(
      `p3`,
      `Descrivi a voce una foto di una spiaggia con tre frasi e una ipotesi.`,
      `En la foto se ve una playa con mucha gente. Al fondo hay unas montañas y a la izquierda un chiringuito. Parece que es verano porque todos llevan bañador.`,
    ),
    prac(
      `p4`,
      `Scrivi una lettera formale di reclamo per un prodotto difettoso (circa 80 parole).`,
      `Estimados señores: Me dirijo a ustedes para informarles de que el producto que compré el 5 de mayo llegó defectuoso. Además, al abrirlo comprobé que faltaban dos piezas y que la caja estaba dañada. Solicito la sustitución del producto o el reembolso completo en un plazo de diez días. Si no recibo respuesta, presentaré una reclamación formal. Quedo a su disposición para cualquier aclaración. Atentamente, Marco Rossi. (Circa 80 parole.)`,
    ),
    prac(
      `p5`,
      `Trascrivi la pronuncia di: ciudad, mujer, niño, caballo, canción.`,
      `ciudad [thiu-DADH] · mujer [mu-HER] · niño [NI-gno] · caballo [ka-BA-yo] · canción [kan-THION].`,
    ),
    prac(
      `p6`,
      `Presentati all'orale (dati personali, studi, hobby) in 5 frasi.`,
      `Me llamo Marco. Tengo 28 años y vivo en Milán. Soy ingeniero y trabajo en una empresa de software. En mi tiempo libre me gusta leer y viajar. Estoy estudiando español porque quiero vivir un tiempo en España.`,
    ),
    prac(
      `p7`,
      `Hai 27 punti su 50 nel Grupo 1 e 44 su 50 nel Grupo 2. Sei apto? Cosa fai?`,
      `No: serve almeno 30/50 in ciascun gruppo (dato indicativo, da verificare sul sito del Cervantes). I 44 punti del Grupo 2 non compensano il Grupo 1: allena lectura e escrita (soprattutto la scrittura, che si migliora più in fretta).`,
    ),
  ],
)
