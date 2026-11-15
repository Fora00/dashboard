import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// Russian course, A1: questions and negation, the past tense and aspect, verbs of motion.
// Pronunciation convention: see pron.ts.

export const ruDomande = mod(
  'ru-domande',
  `Domande, negazione e ordine delle parole`,
  `кто, что, где, куда́, когда́, почему́, ско́лько, нет e не, doppia negazione, и / а / но, что e поэ́тому, avverbi di frequenza, imperativo`,
  'a1',
  `<p class="lead">Fare domande in russo è facile: <b>nessuna inversione, nessun ausiliare</b>. La domanda sì/no cambia solo l'intonazione; le domande con parola interrogativa la mettono all'inizio. Le due trappole da conoscere sono la <b>doppia negazione obbligatoria</b> e l'ordine delle parole, più libero dell'italiano.</p>
${PRON_SHORT}
<h3>1. Parole interrogative</h3>
<table><tr><th>Russo</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>кто</td><td>[KTO]</td><td>chi</td></tr>
<tr><td>что</td><td>[SHTO]</td><td>che cosa</td></tr>
<tr><td>где</td><td>[GDIE]</td><td>dove (stato in luogo)</td></tr>
<tr><td>куда́</td><td>[ku-DA]</td><td>verso dove</td></tr>
<tr><td>отку́да</td><td>[at-KU-da]</td><td>da dove</td></tr>
<tr><td>когда́</td><td>[kag-DA]</td><td>quando</td></tr>
<tr><td>как</td><td>[KAK]</td><td>come</td></tr>
<tr><td>почему́</td><td>[pa-ci-MU]</td><td>perché (causa)</td></tr>
<tr><td>заче́м</td><td>[za-CEM]</td><td>perché (a che scopo)</td></tr>
<tr><td>ско́лько</td><td>[SKOL'-ka]</td><td>quanto/quanti</td></tr>
<tr><td>како́й</td><td>[ka-KOI]</td><td>quale, che tipo di</td></tr>
<tr><td>чей</td><td>[CEI]</td><td>di chi</td></tr>
</table>
<p>Esempi: <b>Где ты живёшь?</b> [GDIE ty zhy-VIOSH] (dove abiti?); <b>Куда́ ты идёшь?</b> [ku-DA ty i-DIOSH] (dove vai?); <b>Отку́да вы?</b> [at-KU-da VY] (di dove è?); <b>Как тебя́ зову́т?</b> [kak ti-BIA za-VUT]; <b>Ско́лько э́то сто́ит?</b> [SKOL'-ka E-ta STO-it] (quanto costa?); <b>Како́й э́то го́род?</b> [ka-KOI E-ta GO-rat].</p>
<h3>2. Domanda sì/no: solo intonazione</h3>
<p>La frase non cambia: <b>Ты студе́нт.</b> ↓ (affermazione) e <b>Ты студе́нт?</b> ↑ (domanda). La voce sale sulla parola che stai chiedendo e poi cade. Risposte: <b>Да.</b> [DA] / <b>Нет.</b> [NIET]; spesso si ripete il verbo: <b>— Ты чита́ешь? — Чита́ю.</b> [ty ci-TA-ish ci-TA-iu]. Per cercare conferma: <b>Пра́вда?</b> [PRAV-da] (vero?).</p>
<p><b>Мо́жно</b> [MOZH-na] (è possibile / posso) apre richieste cortesi: <b>Мо́жно меню́?</b> [MOZH-na mi-NIU] (posso avere il menu?), <b>Мо́жно воды́?</b> [MOZH-na va-DY] (posso avere dell'acqua?).</p>
<h3>3. La particella ли: solo da riconoscere</h3>
<p>Nei testi scritti, formali o nelle domande indirette trovi <b>ли</b> (se, forse): <b>Чита́ешь ли ты?</b> [ci-TA-ish li ty] = «leggi (davvero)?» e <b>Я не зна́ю, до́ма ли он.</b> [ia ni ZNA-iu DO-ma li ON] (non so se sia a casa). Nel parlato quotidiano non serve produrla, basta capirla.</p>
<h3>4. Negazione: не e нет</h3>
<ul><li><b>не</b> [ni] va <b>davanti alla parola negata</b> (di solito il verbo): <b>Я не понима́ю.</b> [ia ni pa-ni-MA-iu], <b>Э́то не дом.</b> [E-ta ni DOM] (questo non è una casa).</li><li><b>нет</b> è il «no» autonomo e «non c'è» + genitivo: <b>Нет.</b> / <b>У меня́ нет вре́мени.</b></li><li><b>Doppia negazione obbligatoria</b>: se c'è un <b>ни-</b> (никто́, ничего́, никогда́, нигде́, никуда́) <b>serve anche не</b> prima del verbo: <b>Я ничего́ не зна́ю.</b> [ia ni-ci-VO ni ZNA-iu] (non so niente); <b>Никто́ не зна́ет.</b> [nik-TO ni ZNA-it] (nessuno lo sa); <b>Я никогда́ не чита́ю.</b> [ia ni-kag-DA ni ci-TA-iu] (non leggo mai).</li><li><b>Никого́</b> [ni-ka-VO] (nessuno) è già al genitivo, come richiede нет: <b>Здесь никого́ нет.</b> [ZDIES' ni-ka-VO NIET] (qui non c'è nessuno).</li></ul>
<h3>5. Ordine delle parole</h3>
<p>L'ordine di base è soggetto-verbo-oggetto: <b>Ма́рко чита́ет кни́гу.</b> [MAR-ka ci-TA-it KNI-gu]. Poiché i casi indicano i ruoli, si può spostare: la parola importante (nuova) va <b>in fondo</b>. <b>Кни́гу чита́ет Ма́рко.</b> risponde a «chi legge il libro?» (è Marco). <b>Ма́рко чита́ет кни́гу.</b> risponde a «cosa legge Marco?» (un libro). A differenza dell'italiano, l'ordine trasmette il fuoco della frase, non solo lo stile.</p>
<h3>6. Rispondere e motivare</h3>
<p><b>Почему́?</b> [pa-ci-MU] → <b>Потому́ что...</b> [pa-ta-MU shta] (perché...): <b>Почему́ ты не рабо́таешь? — Потому́ что сего́дня суббо́та.</b> [pa-ci-MU ty ni ra-BO-ta-ish pa-ta-MU shta si-VOD-nia su-BO-ta] (perché non lavori? perché oggi è sabato). <b>Я не зна́ю.</b> [ia ni ZNA-iu] (non lo so); <b>Не зна́ю.</b> (non so) è la risposta più breve.</p>
<h3>7. И, а, но: tre parole per «e» e «ma»</h3>
<p>L'italiano ha «e» e «ma»; il russo ha tre parole. <b>и</b> = «e» (somma): <b>Я чита́ю и пишу́.</b> [ia ci-TA-iu i pi-SHU]. <b>а</b> = «invece, mentre» (contrasto, cambio di soggetto o di tema, anche per rilanciare una domanda): <b>Я студе́нт, а он врач.</b> [ia stu-DIENT a ON VRAC]; <b>Меня́ зову́т Ма́рко, а вас?</b> [mi-NIA za-VUT MAR-ka a VAS]; <b>Э́то не дом, а шко́ла.</b> [E-ta ni DOM a SHKO-la] (non è una casa, ma una scuola). <b>но</b> = «ma» (contro l'aspettativa): <b>Я чита́ю, но не понима́ю.</b> [ia ci-TA-iu no ni pa-ni-MA-iu]. Errore tipico: tradurre ogni «ma» con но; dopo una negazione («non X, ma Y») serve <b>а</b>.</p>
<h3>8. Che, dove e perciò dopo un verbo</h3>
<p>Dopo <b>знать</b> o <b>ду́мать</b> la frase dipendente comincia con <b>что</b> («che»), sempre preceduta da una <b>virgola</b>: <b>Я зна́ю, что ты студе́нт.</b> [ia ZNA-iu SHTO ty stu-DIENT]; <b>Я ду́маю, что он до́ма.</b> [ia DU-ma-iu SHTO ON DO-ma]. Le parole interrogative restano le stesse: <b>Я не зна́ю, где он.</b> [ia ni ZNA-iu GDIE ON] (non so dove sia). <b>Поэ́тому</b> [pa-E-ta-mu] significa «perciò»: <b>Сего́дня воскресе́нье, поэ́тому я до́ма.</b> [si-VOD-nia vas-kri-SIEN'-ie pa-E-ta-mu ia DO-ma].</p>
<h3>9. Con che frequenza?</h3>
<table><tr><th>Russo</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>всегда́</td><td>[fsig-DA]</td><td>sempre</td></tr>
<tr><td>ча́сто</td><td>[CIA-sta]</td><td>spesso</td></tr>
<tr><td>обы́чно</td><td>[a-BYC-na]</td><td>di solito</td></tr>
<tr><td>иногда́</td><td>[i-nag-DA]</td><td>a volte</td></tr>
<tr><td>ре́дко</td><td>[RIET-ka]</td><td>raramente</td></tr>
<tr><td>никогда́</td><td>[ni-kag-DA]</td><td>mai (con не)</td></tr>
</table>
<p>L'avverbio sta di solito prima del verbo: <b>Я всегда́ пью чай.</b> [ia fsig-DA PIU CIAI] (bevo sempre tè); <b>Мы ча́сто хо́дим в кино́.</b> [my CIA-sta HO-dim f ki-NO]; <b>Он иногда́ е́здит на метро́.</b> [ON i-nag-DA IEZ-dit na mit-RO].</p>
<h3>10. Imperativo: chiedere di fare</h3>
<p>Si parte dalla terza persona plurale (они́) senza la desinenza. Se il tema finisce in vocale si aggiunge <b>-й</b>; se finisce in consonante e nella prima persona l'accento cade sulla desinenza (говорю́, смотрю́, пишу́, иду́, скажу́) si aggiunge <b>-и́</b>. Se l'accento resta sul tema, si aggiunge <b>-ь</b> (<b>будь</b> [BUT'], <b>отве́ть</b> [at-VIET'], <b>встань</b> [FSTAN']): da riconoscere, non da produrre. Con <b>вы</b> (e con più persone) si aggiunge <b>-те</b>.</p>
<table><tr><th>Verbo</th><th>ты</th><th>вы</th></tr>
<tr><td>чита́ть</td><td>чита́й [ci-TAI]</td><td>чита́йте [ci-TAI-tie]</td></tr>
<tr><td>де́лать</td><td>де́лай [DIE-lai]</td><td>де́лайте [DIE-lai-tie]</td></tr>
<tr><td>говори́ть</td><td>говори́ [ga-va-RI]</td><td>говори́те [ga-va-RI-tie]</td></tr>
<tr><td>смотре́ть</td><td>смотри́ [smat-RI]</td><td>смотри́те [smat-RI-tie]</td></tr>
<tr><td>писа́ть</td><td>пиши́ [pi-SHY]</td><td>пиши́те [pi-SHY-tie]</td></tr>
<tr><td>идти́</td><td>иди́ [i-DI]</td><td>иди́те [i-DI-tie]</td></tr>
<tr><td>сказа́ть</td><td>скажи́ [ska-ZHY]</td><td>скажи́те [ska-ZHY-tie]</td></tr>
</table>
<p>I verbi in <b>-ся</b> diventano <b>-сь</b> (<b>-тесь</b> con вы): <b>сади́сь</b> [sa-DIS'] / <b>сади́тесь</b> [sa-DI-tis'] (siediti, si segga). Il divieto si fa con <b>не</b> + imperfettivo: <b>Не кури́те!</b> [ni ku-RI-tie] (non fumate). <b>Пожа́луйста</b> addolcisce la richiesta: <b>Повтори́те, пожа́луйста.</b> [paf-ta-RI-tie pa-ZHA-lus-ta].</p>
<h3>Trappole italiane</h3>
<ul><li>Dopo <b>никто́, ничего́, никогда́</b> serve <b>не</b> col verbo: <b>Я ничего́ зна́ю</b> è sbagliato.</li><li><b>нет</b> non sostituisce <b>не</b> davanti a un verbo: <b>Я нет понима́ю</b> è un errore.</li><li>Non esistono «do/does»: la domanda <b>Ты говори́шь по-ру́сски?</b> ha lo stesso ordine dell'affermazione.</li><li>Dopo «non X» il «ma» è <b>а</b>, non но: <b>Э́то не дом, а шко́ла.</b></li></ul>
<h3>In sintesi</h3>
<p>Parola interrogativa + frase normale; domanda sì/no con la voce che sale; <b>не</b> davanti al verbo, <b>нет</b> da solo o per «non c'è»; doppia negazione con <b>ни-</b> + <b>не</b>; la parola nuova va in fondo alla frase. Tre «e/ma»: и (somma), а (contrasto), но (contro l'aspettativa). Frequenza: всегда́, ча́сто, иногда́, никогда́ prima del verbo. Imperativo: чита́й(те), говори́(те).</p>
<div class="say"><b>Da dire.</b> «Где ты живёшь? Ты говори́шь по-ру́сски? Я ничего́ не понима́ю.» [GDIE ty zhy-VIOSH. ty ga-va-RISH pa-RUS-ski. ia ni-ci-VO ni pa-ni-MA-iu]</div>`,
  [
    q(
      'q1',
      `Come si fa una domanda sì/no in russo?`,
      [
        `con l'intonazione, senza cambiare le parole`,
        `invertendo soggetto e verbo`,
        `aggiungendo do/does`,
        `usando sempre ли`,
      ],
      0,
      `Il russo non cambia l'ordine né usa ausiliari: la voce sale sulla parola chiave e poi scende.`,
    ),
    q(
      'q2',
      `Come si dice «Non so niente»?`,
      [`Я ничего́ не зна́ю.`, `Я ничего́ зна́ю.`, `Я не ничего́ зна́ю.`, `Я нет зна́ю ничего́.`],
      0,
      `Con una parola in ни- il verbo deve essere negato anche con не: la doppia negazione è obbligatoria.`,
    ),
    q(
      'q3',
      `Quale parola significa «verso dove»?`,
      [`куда́`, `где`, `отку́да`, `когда́`],
      0,
      `Куда́ chiede la direzione del moto, mentre где chiede lo stato in luogo e отку́да la provenienza.`,
    ),
    q(
      'q4',
      `Che cosa significa «Ско́лько э́то сто́ит?»`,
      [`Quanto costa?`, `Quando arriva?`, `Che ore sono?`, `Come ti chiami?`],
      0,
      `Ско́лько è «quanto» e сто́ит è «costa», quindi la domanda è «quanto costa questo?».`,
    ),
    q(
      'q5',
      `Come si risponde a «Почему́?»`,
      [`Потому́ что...`, `Заче́м...`, `Когда́...`, `Как...`],
      0,
      `La risposta a почему́ è потому́ что, «perché», seguito dalla causa.`,
    ),
    q(
      'q6',
      `Quale frase significa «Questo non è una casa»?`,
      [`Э́то не дом.`, `Э́то нет дом.`, `Не э́то дом.`, `Э́то дом нет.`],
      0,
      `Не si mette davanti alla parola negata, qui дом; нет non si usa davanti a un nome predicativo.`,
    ),
    q(
      'q7',
      `Che cosa chiede «Мо́жно меню́?»`,
      [`di avere il menu (è possibile?)`, `dove è il menu`, `chi ha il menu`, `quanto costa il menu`],
      0,
      `Мо́жно significa «è possibile» e serve a chiedere gentilmente qualcosa: posso avere il menu?`,
    ),
    q(
      'q8',
      `Quale frase risponde a «Что чита́ет Ма́рко?» (cosa legge Marco?)`,
      [`Ма́рко чита́ет кни́гу.`, `Кни́гу чита́ет Ма́рко.`, `Кни́гу Ма́рко чита́ет.`, `Ма́рко кни́гу не чита́ет.`],
      0,
      `La parola nuova va in fondo: se si chiede cosa legge Marco, кни́гу è la risposta e non può aprire la frase come tema; l'ordine neutro è Ма́рко чита́ет кни́гу.`,
    ),
    q(
      'q9',
      `Come si dice «ma» in «Non è una casa, ma una scuola»?`,
      [`а`, `но`, `и`, `да`],
      0,
      `Dopo una negazione («non X, ma Y») si usa а; но esprime invece un «ma» contro l'aspettativa.`,
    ),
    q(
      'q10',
      `Come si dice «sempre»?`,
      [`всегда́`, `никогда́`, `иногда́`, `ре́дко`],
      0,
      `Всегда́ significa sempre; иногда́ è a volte, ре́дко è raramente e никогда́ è mai, con не davanti al verbo.`,
    ),
    q(
      'q11',
      `Come dici a un amico «Leggi!»?`,
      [`Чита́й!`, `Чита́йте!`, `Чита́ть!`, `Чита́ю!`],
      0,
      `L'imperativo di ты si forma dal tema in vocale più -й: чита́й; чита́йте è la forma con вы.`,
    ),
  ],
  [
    card('c1', `Parole interrogative`, `кто, что, где, куда́, отку́да, когда́, как, почему́, заче́м, ско́лько, како́й, чей.`),
    card('c2', `Sì/no`, `Stessa frase, voce che sale: Ты студе́нт? Risposte: Да / Нет. Conferma: Пра́вда?`),
    card('c3', `Мо́жно`, `È possibile / posso: Мо́жно меню́? Мо́жно воды́?`),
    card('c4', `Negazione не`, `не davanti alla parola negata: Я не понима́ю. Э́то не дом.`),
    card('c5', `нет`, `«No» autonomo e «non c'è» + genitivo: Нет. У меня́ нет вре́мени.`),
    card('c6', `Doppia negazione`, `ни- + не: Я ничего́ не зна́ю. Никто́ не зна́ет. Я никогда́ не чита́ю.`),
    card(
      'c7',
      `Ordine delle parole`,
      `SVO di base; la parola nuova va in fondo: Ма́рко чита́ет кни́гу / Кни́гу чита́ет Ма́рко.`,
    ),
    card('c8', `Потому́ что`, `Perché (risposta): Почему́? — Потому́ что... Pronuncia [pa-ta-MU shta].`),
    card(
      'c9',
      `И / а / но`,
      `и = e (Я чита́ю и пишу́). а = invece / non X ma Y (Э́то не дом, а шко́ла). но = ma (Я чита́ю, но не понима́ю).`,
    ),
    card('c10', `Frequenza`, `всегда́, ча́сто, обы́чно, иногда́, ре́дко, никогда́ (не). Prima del verbo: Я всегда́ пью чай.`),
    card(
      'c11',
      `Imperativo`,
      `они́ senza desinenza + -й / -и́; con вы + -те: чита́й(те), говори́(те), иди́(те), скажи́(те). Не кури́те!`,
    ),
  ],
  [
    prac(
      `p1`,
      `Trasforma in domanda e in negazione: «Ты чита́ешь кни́гу.»`,
      `Domanda: Ты чита́ешь кни́гу? (voce che sale su кни́гу). Negazione: Ты не чита́ешь кни́гу. [ty ni ci-TA-ish KNI-gu].`,
    ),
    prac(
      `p2`,
      `Traduci: «Non vado mai a scuola», «Qui non c'è nessuno».`,
      `Я никогда́ не хожу́ в шко́лу. [ia ni-kag-DA ni ha-ZHU f SHKO-lu] — Здесь никого́ нет. [ZDIES' ni-ka-VO NIET].`,
    ),
    prac(
      `p3`,
      `Fai la domanda giusta: ___ ты живёшь? (dove) / ___ ты идёшь? (verso dove) / ___ вас зову́т? (come).`,
      `Где [GDIE] ты живёшь? Куда́ [ku-DA] ты идёшь? Как [KAK] вас зову́т?`,
    ),
    prac(
      `p4`,
      `Rispondi con потому́ что: «Почему́ ты не рабо́таешь?» (perché oggi è domenica).`,
      `Потому́ что сего́дня воскресе́нье. [pa-ta-MU shta si-VOD-nia vas-kri-SIEN'-ie].`,
    ),
    prac(
      `p5`,
      `Cambia l'ordine per dire che è Marco che legge il libro (e non un altro).`,
      `Кни́гу чита́ет Ма́рко. [KNI-gu ci-TA-it MAR-ka]. La parola in fondo (Ма́рко) porta l'informazione nuova.`,
    ),
    prac(
      `p6`,
      `Completa con и, а o но: «Я студе́нт, ___ он врач» / «Э́то не дом, ___ шко́ла» / «Я чита́ю, ___ не понима́ю».`,
      `а (contrasto) [a]; а (dopo la negazione non X, ma Y); но (contro l'aspettativa) [no]. Usa и solo per sommare: Я чита́ю и пишу́.`,
    ),
    prac(
      `p7`,
      `Dì a un amico e a un professore: «Parla!», «Scrivi!», «Vai!».`,
      `Amico: Говори́! [ga-va-RI] Пиши́! [pi-SHY] Иди́! [i-DI]. Professore (вы): Говори́те! [ga-va-RI-tie] Пиши́те! [pi-SHY-tie] Иди́те! [i-DI-tie].`,
    ),
  ],
)

export const ruPassato = mod(
  'ru-passato',
  `Passato e primo contatto con l'aspetto`,
  `Passato in -л/-ла/-ло/-ли, passati irregolari, aspetto imperfettivo e perfettivo in coppie, futuro con бу́ду`,
  'a1',
  `<p class="lead">Il passato russo è molto più semplice di quello italiano: <b>una sola forma</b>, che concorda con il genere di chi compie l'azione, senza ausiliare. La difficoltà è l'<b>aspetto</b>: quasi ogni verbo ha due forme, una per l'azione in corso o ripetuta, una per l'azione compiuta. In A1 bastano le coppie principali, imparate come blocchi.</p>
${PRON_SHORT}
<h3>1. Formazione</h3>
<p>Togli <b>-ть</b> dall'infinito e aggiungi: <b>-л</b> (m), <b>-ла</b> (f), <b>-ло</b> (n), <b>-ли</b> (plurale). Modello: <b>чита́ть</b>.</p>
<table><tr><th>Soggetto</th><th>Forma</th><th>Pronuncia</th></tr>
<tr><td>он, я (uomo)</td><td>чита́л</td><td>[ci-TAL]</td></tr>
<tr><td>она́, я (donna)</td><td>чита́ла</td><td>[ci-TA-la]</td></tr>
<tr><td>оно́</td><td>чита́ло</td><td>[ci-TA-la]</td></tr>
<tr><td>мы, вы, они́</td><td>чита́ли</td><td>[ci-TA-li]</td></tr>
</table>
<p>Esempi: <b>Вчера́ я чита́л кни́гу.</b> [fci-RA ia ci-TAL KNI-gu] (detto da un uomo), <b>Вчера́ я чита́ла кни́гу.</b> [fci-RA ia ci-TA-la KNI-gu] (donna), <b>Что ты де́лал вчера́?</b> [SHTO ty DIE-lal fci-RA]. Il verbo concorda con il <b>sesso</b> di chi parla: una donna dice sempre <b>-ла</b>.</p>
<h3>2. Passati irregolari</h3>
<table><tr><th>Verbo</th><th>m</th><th>f</th><th>n</th><th>pl</th></tr>
<tr><td>идти́</td><td>шёл [SHOL]</td><td>шла [SHLA]</td><td>шло [SHLO]</td><td>шли [SHLI]</td></tr>
<tr><td>мочь</td><td>мог [MOK]</td><td>могла́ [mag-LA]</td><td>могло́ [mag-LO]</td><td>могли́ [mag-LI]</td></tr>
<tr><td>есть (mangiare)</td><td>ел [IEL]</td><td>е́ла [IE-la]</td><td>е́ло [IE-la]</td><td>е́ли [IE-li]</td></tr>
<tr><td>быть</td><td>был [BYL]</td><td>была́ [by-LA]</td><td>бы́ло [BY-la]</td><td>бы́ли [BY-li]</td></tr>
<tr><td>жить</td><td>жил [ZHYL]</td><td>жила́ [zhy-LA]</td><td>жи́ло [ZHY-la]</td><td>жи́ли [ZHY-li]</td></tr>
</table>
<p>Un piccolo gruppo chiuso di verbi (<b>жить, быть, пить, дать, взять, нача́ть</b>) sposta l'accento al femminile: <b>жил, жила́, жи́ло</b>; i verbi regolari come чита́ть lo lasciano dov'è (<b>чита́л, чита́ла</b>).</p>
<h3>3. Aspetto: imperfettivo e perfettivo</h3>
<p>Quasi ogni verbo ha una coppia: <b>imperfettivo</b> (несоверше́нный вид) e <b>perfettivo</b> (соверше́нный вид). La forma perfettiva di solito aggiunge un prefisso (<b>де́лать → сде́лать</b>) e indica un'azione <b>finita, con risultato</b>, vista nel suo insieme.</p>
<table><tr><th>Imperfettivo</th><th>Perfettivo</th><th>Significato</th></tr>
<tr><td>де́лать [DIE-lat']</td><td>сде́лать [ZDIE-lat']</td><td>fare</td></tr>
<tr><td>чита́ть [ci-TAT']</td><td>прочита́ть [pra-ci-TAT']</td><td>leggere</td></tr>
<tr><td>писа́ть [pi-SAT']</td><td>написа́ть [na-pi-SAT']</td><td>scrivere</td></tr>
<tr><td>покупа́ть [pa-ku-PAT']</td><td>купи́ть [ku-PIT']</td><td>comprare</td></tr>
<tr><td>говори́ть [ga-va-RIT']</td><td>сказа́ть [ska-ZAT']</td><td>dire</td></tr>
<tr><td>смотре́ть [smat-RIET']</td><td>посмотре́ть [pas-mat-RIET']</td><td>guardare</td></tr>
<tr><td>звони́ть [zva-NIT']</td><td>позвони́ть [paz-va-NIT']</td><td>telefonare</td></tr>
<tr><td>ви́деть [VI-dit']</td><td>уви́деть [u-VI-dit']</td><td>vedere</td></tr>
</table>
<p>I perfettivi con il prefisso <b>вы-</b> portano sempre l'accento sul prefisso: <b>вы́пить</b> [VY-pit'] (bere tutto), <b>Вы́зовите</b> [VY-za-vi-tie] (chiami!, perfettivo di вы́звать).</p>
<p><b>Imperfettivo</b> = processo, durata, abitudine o semplice fatto: <b>Я чита́л кни́гу два часа́.</b> [ia ci-TAL KNI-gu dva ci-SA] (ho letto per due ore). <b>Perfettivo</b> = azione compiuta, risultato: <b>Я прочита́л кни́гу.</b> [ia pra-ci-TAL KNI-gu] (ho letto tutto il libro, l'ho finito). Domanda tipica: <b>Ты уже́ прочита́л?</b> [ty u-ZHE pra-ci-TAL] (hai già finito?).</p>
<h3>4. Futuro</h3>
<p>Imperfettivo: <b>бу́ду</b> + infinito: <b>Я бу́ду чита́ть.</b> [ia BU-du ci-TAT'] (leggerò, sarò occupato a leggere). Perfettivo: il presente del verbo perfettivo ha valore di futuro: <b>Я прочита́ю кни́гу.</b> [ia pra-ci-TA-iu KNI-gu] (leggerò il libro e lo finirò). I perfettivi non hanno presente: dire <b>я прочита́ю</b> significa «leggerò».</p>
<h3>Trappole italiane</h3>
<ul><li>Il passato russo non distingue «ho letto» e «lessi» come l'italiano passato prossimo/remoto: c'è <b>una sola</b> forma; l'aspetto indica se l'azione è finita.</li><li>L'italiano imperfetto («leggevo») corrisponde spesso all'imperfettivo; il passato prossimo di un'azione finita («ho letto il libro») al perfettivo.</li><li>Con <b>вчера́</b> («ieri») si possono usare entrambi gli aspetti: dipende dal significato, non dal tempo.</li><li>Il genere del verbo al passato è quello del soggetto: <b>Я была́ до́ма</b> detto da una donna.</li></ul>
<h3>In sintesi</h3>
<p>Passato = -л / -ла / -ло / -ли. Aspetto: imperfettivo = azione in corso o abituale, perfettivo = azione finita. Futuro: бу́ду + infinito (imperfettivo) o presente di un perfettivo (я прочита́ю). Impara i verbi in coppia: де́лать/сде́лать, чита́ть/прочита́ть, покупа́ть/купи́ть.</p>
<div class="say"><b>Da dire.</b> «Вчера́ я купи́л хлеб и написа́л письмо́.» [fci-RA ia ku-PIL HLIEP i na-pi-SAL pis'-MO]</div>`,
  [
    q(
      'q1',
      `Come dice una donna «Ieri ho letto»?`,
      [`Вчера́ я чита́ла.`, `Вчера́ я чита́л.`, `Вчера́ я чита́ю.`, `Вчера́ я чита́ли.`],
      0,
      `Il passato concorda con il sesso di chi parla: una donna usa -ла, quindi чита́ла.`,
    ),
    q(
      'q2',
      `Qual è il passato maschile di «идти́»?`,
      [`шёл`, `идёл`, `иди́л`, `ходи́л`],
      0,
      `Идти́ ha un passato irregolare: шёл (m), шла (f), шло (n), шли (pl).`,
    ),
    q(
      'q3',
      `Quale verbo è perfettivo?`,
      [`прочита́ть`, `чита́ть`, `де́лать`, `писа́ть`],
      0,
      `Прочита́ть è la forma perfettiva con prefisso про-: indica la lettura finita; gli altri sono imperfettivi.`,
    ),
    q(
      'q4',
      `Che cosa significa «Я прочита́ю кни́гу»?`,
      [`Leggerò il libro (e lo finirò).`, `Ho letto il libro.`, `Sto leggendo il libro.`, `Leggo spesso il libro.`],
      0,
      `Il presente di un verbo perfettivo ha valore di futuro: прочита́ю indica una lettura che verrà completata.`,
    ),
    q(
      'q5',
      `Come si forma il passato femminile di «рабо́тать»?`,
      [`рабо́тала`, `рабо́тал`, `рабо́тало`, `рабо́тали`],
      0,
      `Si toglie -ть e si aggiunge -ла per il femminile: рабо́тать diventa рабо́тала.`,
    ),
    q(
      'q6',
      `Quale forma del passato si usa con «мы» (noi)?`,
      [`-ли`, `-л`, `-ла`, `-ло`],
      0,
      `Per i plurali (мы, вы, они́) il passato termina sempre in -ли, indipendentemente dal genere.`,
    ),
    q(
      'q7',
      `Come si dice «Leggerò» in modo imperfettivo?`,
      [`Я бу́ду чита́ть.`, `Я чита́л бу́ду.`, `Я прочита́л.`, `Я бу́ду чита́ю.`],
      0,
      `Il futuro imperfettivo si forma con бу́ду + infinito, qui Я бу́ду чита́ть.`,
    ),
    q(
      'q8',
      `Quale frase dice che hai finito di leggere un libro?`,
      [`Я прочита́л кни́гу.`, `Я чита́л кни́гу.`, `Я чита́ю кни́гу.`, `Я бу́ду чита́ть кни́гу.`],
      0,
      `Il perfettivo прочита́л sottolinea il risultato: il libro è stato letto fino alla fine.`,
    ),
  ],
  [
    card(
      'c1',
      `Passato regolare`,
      `Infinito senza -ть + -л (m), -ла (f), -ло (n), -ли (pl): чита́л, чита́ла, чита́ло, чита́ли.`,
    ),
    card(
      'c2',
      `Genere di chi parla`,
      `Я чита́л (uomo) / Я чита́ла (donna). Il passato non ha forme per la persona, solo per il genere.`,
    ),
    card('c3', `Passati irregolari`, `шёл, шла, шло, шли (идти́); мог, могла́ (мочь); ел, е́ла (есть); был, была́ (быть).`),
    card('c4', `Imperfettivo`, `Azione in corso, ripetuta o semplice fatto: Я чита́л кни́гу два часа́.`),
    card(
      'c5',
      `Perfettivo`,
      `Azione compiuta con risultato: Я прочита́л кни́гу. Spesso con prefisso (про-, на-, с-, по-).`,
    ),
    card('c6', `Coppie base`, `де́лать/сде́лать, чита́ть/прочита́ть, писа́ть/написа́ть, покупа́ть/купи́ть, говори́ть/сказа́ть.`),
    card('c7', `Futuro imperfettivo`, `бу́ду + infinito: Я бу́ду чита́ть. Il perfettivo non ha presente.`),
    card('c8', `Perfettivo = futuro`, `Il presente di un perfettivo vale come futuro: Я прочита́ю = leggerò e finirò.`),
  ],
  [
    prac(
      `p1`,
      `Metti al passato maschile e femminile: «Я рабо́таю», «Я де́лаю».`,
      `Я рабо́тал / Я рабо́тала [ia ra-BO-tal / ia ra-BO-ta-la]; Я де́лал / Я де́лала [ia DIE-lal / ia DIE-la-la].`,
    ),
    prac(
      `p2`,
      `Traduci: «Ieri sono andato al cinema» (a piedi, e sono tornato), «Siamo stati a Roma».`,
      `Вчера́ я ходи́л в кино́. [fci-RA ia ha-DIL f ki-NO] (andata e ritorno: ходи́л, non шёл, che significherebbe «stavo andando») — Мы бы́ли в Ри́ме. [my BY-li v RI-mie]. Быть + в + prepositivo per lo stato.`,
    ),
    prac(
      `p3`,
      `Scegli l'aspetto: «Ho comprato il pane» (una volta, finito) e «Ho letto per due ore».`,
      `Я купи́л хлеб. [ia ku-PIL HLIEP] (perfettivo) — Я чита́л два часа́. [ia ci-TAL dva ci-SA] (imperfettivo, durata).`,
    ),
    prac(
      `p4`,
      `Traduci «Domani leggerò» in imperfettivo e in perfettivo.`,
      `За́втра я бу́ду чита́ть. [ZAF-tra ia BU-du ci-TAT'] — За́втра я прочита́ю. [ZAF-tra ia pra-ci-TA-iu]. Il secondo implica un risultato finito.`,
    ),
    prac(
      `p5`,
      `Completa: «Он ___ (писа́ть) письмо́» e «Мы ___ (смотре́ть) фильм» al passato.`,
      `Он писа́л письмо́. [ON pi-SAL pis'-MO] — Мы смотре́ли фильм. [my smat-RIE-li FIL'M]. Plurale: -ли.`,
    ),
  ],
)

export const ruMoto = mod(
  'ru-moto',
  `Verbi di moto: идти́/ходи́ть, е́хать/е́здить e i mezzi`,
  `Andare a piedi o con un mezzo, moto in corso e abituale, на + prepositivo per il mezzo, пешко́м, домо́й`,
  'a1',
  `<p class="lead">L'italiano dice «vado» in tutti i casi. Il russo sceglie tra <b>quattro verbi di base</b> in base a due domande: <b>a piedi o con un mezzo?</b> e <b>moto in corso in una direzione o abituale, andata e ritorno?</b> Sono tra i verbi più frequenti: valgono il tempo che ci dedichi.</p>
${PRON_SHORT}
<h3>1. Lo schema</h3>
<table><tr><th></th><th>Moto in corso, una direzione</th><th>Moto abituale o andata e ritorno</th></tr>
<tr><td>a piedi</td><td><b>идти́</b> [it-TI]</td><td><b>ходи́ть</b> [ha-DIT']</td></tr>
<tr><td>con un mezzo</td><td><b>е́хать</b> [IE-hat']</td><td><b>е́здить</b> [IEZ-dit']</td></tr>
</table>
<p>Quindi: <b>Я иду́ в шко́лу.</b> [ia i-DU f SHKO-lu] (ora sto andando a scuola, a piedi) e <b>Я хожу́ в шко́лу ка́ждый день.</b> [ia ha-ZHU f SHKO-lu KAZH-dyi DIEN'] (ogni giorno vado a scuola). <b>Я е́ду на рабо́ту.</b> [ia IE-du na ra-BO-tu] (sto andando al lavoro in auto o in autobus) e <b>Я е́зжу на рабо́ту на метро́.</b> [ia IEZH-zhu na ra-BO-tu na mit-RO] (di solito vado al lavoro in metropolitana).</p>
<h3>2. Presente dei quattro verbi</h3>
<table><tr><th>Persona</th><th>идти́</th><th>ходи́ть</th><th>е́хать</th><th>е́здить</th></tr>
<tr><td>я</td><td>иду́ [i-DU]</td><td>хожу́ [ha-ZHU]</td><td>е́ду [IE-du]</td><td>е́зжу [IEZH-zhu]</td></tr>
<tr><td>ты</td><td>идёшь [i-DIOSH]</td><td>хо́дишь [HO-dish]</td><td>е́дешь [IE-dish]</td><td>е́здишь [IEZ-dish]</td></tr>
<tr><td>он / она́</td><td>идёт [i-DIOT]</td><td>хо́дит [HO-dit]</td><td>е́дет [IE-dit]</td><td>е́здит [IEZ-dit]</td></tr>
<tr><td>мы</td><td>идём [i-DIOM]</td><td>хо́дим [HO-dim]</td><td>е́дем [IE-dim]</td><td>е́здим [IEZ-dim]</td></tr>
<tr><td>вы</td><td>идёте [i-DIO-tie]</td><td>хо́дите [HO-di-tie]</td><td>е́дете [IE-di-tie]</td><td>е́здите [IEZ-di-tie]</td></tr>
<tr><td>они́</td><td>иду́т [i-DUT]</td><td>хо́дят [HO-diat]</td><td>е́дут [IE-dut]</td><td>е́здят [IEZ-diat]</td></tr>
</table>
<p>Passato: <b>шёл, шла</b> [SHOL, SHLA] (идти́), <b>ходи́л, ходи́ла</b> [ha-DIL, ha-DI-la], <b>е́хал, е́хала</b> [IE-hal, IE-ha-la], <b>е́здил, е́здила</b> [IEZ-dil, IEZ-di-la]. Attenzione: <b>Вчера́ я ходи́л в кино́.</b> [fci-RA ia ha-DIL f ki-NO] significa «sono andato e tornato», cioè «ieri ero al cinema»; <b>шёл</b> sarebbe «stavo andando».</p>
<h3>3. Il mezzo: на + prepositivo</h3>
<table><tr><th>Mezzo</th><th>Russo</th><th>Pronuncia</th></tr>
<tr><td>autobus</td><td>на авто́бусе</td><td>[na af-TO-bu-sie]</td></tr>
<tr><td>metropolitana</td><td>на метро́</td><td>[na mit-RO]</td></tr>
<tr><td>treno</td><td>на по́езде</td><td>[na PO-iz-die]</td></tr>
<tr><td>tram</td><td>на трамва́е</td><td>[na tram-VA-ie]</td></tr>
<tr><td>taxi</td><td>на такси́</td><td>[na tak-SI]</td></tr>
<tr><td>automobile</td><td>на маши́не</td><td>[na ma-SHY-nie]</td></tr>
<tr><td>bicicletta</td><td>на велосипе́де</td><td>[na vi-la-si-PIE-die]</td></tr>
<tr><td>aereo</td><td>на самолёте</td><td>[na sa-ma-LIO-tie]</td></tr>
<tr><td>a piedi</td><td>пешко́м</td><td>[pish-KOM]</td></tr>
</table>
<p>Il mezzo si indica con <b>на + prepositivo</b> (sull'autobus), ma «a piedi» è l'avverbio <b>пешко́м</b>. Esempi: <b>Я е́ду на авто́бусе.</b> [ia IE-du na af-TO-bu-sie], <b>Мы идём пешко́м.</b> [my i-DIOM pish-KOM] (andiamo a piedi), <b>Он е́дет домо́й на такси́.</b> [ON IE-dit da-MOI na tak-SI] (torna a casa in taxi).</p>
<h3>4. La destinazione</h3>
<p>Dopo questi verbi si usa <b>в/на + accusativo</b> (куда́?): <b>в шко́лу</b>, <b>на рабо́ту</b>, <b>в магази́н</b>, <b>на вокза́л</b>. «A casa» è <b>домо́й</b>: <b>Я иду́ домо́й.</b> [ia i-DU da-MOI]. Domande utili: <b>Куда́ ты идёшь?</b> [ku-DA ty i-DIOSH], <b>Как ты е́здишь на рабо́ту?</b> [kak ty IEZ-dish na ra-BO-tu] (come vai al lavoro di solito?).</p>
<h3>5. Пойти́ e пое́хать: mettersi in cammino</h3>
<p>Con il prefisso <b>по-</b> nascono i perfettivi <b>пойти́</b> [pai-TI] e <b>пое́хать</b> [pa-IE-hat'] («mettersi in cammino, andare»). Il loro presente vale come futuro: <b>За́втра я пойду́ в кино́.</b> [ZAF-tra ia pai-DU f ki-NO] (domani andrò al cinema); <b>Мы пое́дем в Москву́.</b> [my pa-IE-dim v mas-KVU] (andremo a Mosca).</p>
<table><tr><th>Persona</th><th>пойти́</th><th>пое́хать</th></tr>
<tr><td>я</td><td>пойду́ [pai-DU]</td><td>пое́ду [pa-IE-du]</td></tr>
<tr><td>ты</td><td>пойдёшь [pai-DIOSH]</td><td>пое́дешь [pa-IE-dish]</td></tr>
<tr><td>он / она́</td><td>пойдёт [pai-DIOT]</td><td>пое́дет [pa-IE-dit]</td></tr>
<tr><td>мы</td><td>пойдём [pai-DIOM]</td><td>пое́дем [pa-IE-dim]</td></tr>
<tr><td>вы</td><td>пойдёте [pai-DIO-tie]</td><td>пое́дете [pa-IE-di-tie]</td></tr>
<tr><td>они́</td><td>пойду́т [pai-DUT]</td><td>пое́дут [pa-IE-dut]</td></tr>
</table>
<p>Passato: <b>пошёл</b> [pa-SHOL], <b>пошла́</b> [pash-LA], <b>пошли́</b> [pash-LI]; <b>пое́хал</b> [pa-IE-hal], <b>пое́хала</b> [pa-IE-ha-la]. <b>Он пошёл в магази́н</b> = è uscito per andare al negozio (non è ancora tornato); <b>Он ходи́л в магази́н</b> = è andato ed è tornato.</p>
<p><b>Invitare</b>: <b>Пойдём!</b> [pai-DIOM] (andiamo!), <b>Пойдём в кино́!</b> [pai-DIOM f ki-NO], <b>Дава́й пойдём в кино́!</b> [da-VAI pai-DIOM f ki-NO] (con вы: <b>Дава́йте</b> [da-VAI-tie]); con un mezzo: <b>Пое́хали!</b> [pa-IE-ha-li] (partiamo!). Per accettare: <b>Хорошо́, пойдём!</b> [ha-ra-SHO pai-DIOM].</p>
<h3>Trappole italiane</h3>
<ul><li>«Vado a Roma» da Milano in treno si dice <b>Я е́ду в Рим</b>, non <b>Я иду́</b>: идти́ è solo a piedi.</li><li>«Ogni giorno vado al lavoro» richiede il verbo abituale: <b>хожу́ / е́зжу</b>, non <b>иду́ / е́ду</b>.</li><li>Il passato di ходи́ть / е́здить dice «sono stato e sono tornato»: <b>Я е́здил в Москву́</b> = «sono stato a Mosca» (e sono rientrato).</li><li>Con un mezzo si dice <b>на</b> + prepositivo: l'italiano dice «in treno», il russo dice «sul treno» (<b>на по́езде</b>). Anche <b>в авто́бусе</b> esiste, ma descrive dove sei (dentro), non il mezzo con cui vai.</li></ul>
<h3>In sintesi</h3>
<p>A piedi + in corso = <b>идти́</b>; a piedi + abituale = <b>ходи́ть</b>; mezzo + in corso = <b>е́хать</b>; mezzo + abituale = <b>е́здить</b>. Mezzo: <b>на + prepositivo</b>; destinazione: <b>в/на + accusativo</b>. Mettersi in cammino: <b>пойти́</b>, <b>пое́хать</b>; invito: <b>Пойдём!</b></p>
<div class="say"><b>Da dire.</b> «Я иду́ в магази́н пешко́м. Ка́ждый день я е́зжу на рабо́ту на метро́.» [ia i-DU v ma-ga-ZIN pish-KOM. KAZH-dyi DIEN' ia IEZH-zhu na ra-BO-tu na mit-RO]</div>`,
  [
    q(
      'q1',
      `Come dici «Sto andando a scuola a piedi» (ora)?`,
      [`Я иду́ в шко́лу.`, `Я хожу́ в шко́лу.`, `Я е́ду в шко́лу.`, `Я е́зжу в шко́лу.`],
      0,
      `Идти́ indica il moto in corso, a piedi e in una direzione: Я иду́ в шко́лу.`,
    ),
    q(
      'q2',
      `Quale frase dice che ogni giorno vai a piedi a scuola?`,
      [
        `Я хожу́ в шко́лу ка́ждый день.`,
        `Я иду́ в шко́лу ка́ждый день.`,
        `Я е́ду в шко́лу ка́ждый день.`,
        `Я шёл в шко́лу ка́ждый день.`,
      ],
      0,
      `L'abitudine richiede ходи́ть; идти́ si usa per l'azione in corso e in una sola direzione.`,
    ),
    q(
      'q3',
      `Quale verbo scegli per «di solito vado al lavoro in autobus»?`,
      [`е́здить`, `е́хать`, `идти́`, `ходи́ть`],
      0,
      `Serve il verbo di mezzo e abituale: е́здить. Е́хать è per un viaggio in corso e идти́/ходи́ть sono a piedi.`,
    ),
    q(
      'q4',
      `Quale costruzione indica il mezzo in «Vado al lavoro in autobus»?`,
      [`на авто́бусе`, `по авто́бусу`, `с авто́бусом`, `из авто́буса`],
      0,
      `Per il mezzo di trasporto si usa на con il prepositivo: на авто́бусе, на метро́, на такси́. В авто́бусе dice solo dove sei.`,
    ),
    q(
      'q5',
      `Qual è il passato femminile di «ходи́ть»?`,
      [`ходи́ла`, `шла`, `ходи́л`, `ходи́ло`],
      0,
      `Il passato si forma con -ла per il femminile: ходи́ть diventa ходи́ла; шла appartiene a идти́.`,
    ),
    q(
      'q6',
      `Come si dice «a casa» con un verbo di moto («torno a casa»)?`,
      [`домо́й`, `до́ма`, `в дом`, `у дома́`],
      0,
      `Домо́й indica la direzione verso casa (con идти́, е́хать); до́ма indica lo stato in luogo.`,
    ),
    q(
      'q7',
      `Come si dice «a piedi»?`,
      [`пешко́м`, `на ноге́`, `на ходу́`, `вперёд`],
      0,
      `Пешко́м è l'avverbio che significa «a piedi»; non si usa на con questa parola.`,
    ),
    q(
      'q8',
      `Che cosa significa «Вчера́ я ходи́л в кино́»?`,
      [
        `Ieri sono andato al cinema (e sono tornato).`,
        `Ieri stavo andando al cinema.`,
        `Domani vado al cinema.`,
        `Ogni giorno vado al cinema.`,
      ],
      0,
      `Il passato di ходи́ть indica un'andata con ritorno: ieri sei stato al cinema.`,
    ),
    q(
      'q9',
      `Come inviti un amico: «Andiamo al cinema!»?`,
      [`Пойдём в кино́!`, `Пошёл в кино́!`, `Ходи́л в кино́!`, `Е́здим в кино́!`],
      0,
      `Пойдём è la prima persona plurale di пойти́ e funziona come invito: «andiamo!». Дава́й пойдём è un invito ancora più esplicito.`,
    ),
    q(
      'q10',
      `Che cosa significa «Он пошёл в магази́н»?`,
      [
        `È uscito per andare al negozio (non è ancora tornato).`,
        `È andato al negozio ed è tornato.`,
        `Va sempre al negozio.`,
        `Andrà al negozio fra un anno.`,
      ],
      0,
      `Пошёл indica l'inizio del moto verso la meta: la persona è partita e non è ancora rientrata, a differenza di ходи́л.`,
    ),
  ],
  [
    card(
      'c1',
      `Schema 2×2`,
      `идти́ (piedi, in corso) / ходи́ть (piedi, abituale); е́хать (mezzo, in corso) / е́здить (mezzo, abituale).`,
    ),
    card('c2', `Presente идти́`, `иду́, идёшь, идёт, идём, идёте, иду́т.`),
    card('c3', `Presente ходи́ть`, `хожу́, хо́дишь, хо́дит, хо́дим, хо́дите, хо́дят.`),
    card('c4', `Presente е́хать / е́здить`, `е́ду, е́дешь... / е́зжу, е́здишь, е́здит, е́здим, е́здите, е́здят.`),
    card('c5', `Il mezzo`, `на + prepositivo: на авто́бусе, на метро́, на такси́, на по́езде. A piedi: пешко́м.`),
    card('c6', `Destinazione`, `в/на + accusativo: в шко́лу, на рабо́ту, в магази́н, на вокза́л. A casa: домо́й.`),
    card('c7', `Passato abituale`, `ходи́л / е́здил = sono andato e tornato: Вчера́ я ходи́л в кино́.`),
    card('c8', `Куда́ ты идёшь?`, `Dove vai? (ora, a piedi). Come vai di solito? Как ты е́здишь на рабо́ту?`),
    card(
      'c9',
      `Пойти́ / пое́хать`,
      `пойду́, пойдёшь... / пое́ду, пое́дешь...: mettersi in cammino (presente = futuro). Passato: пошёл, пошла́ / пое́хал.`,
    ),
    card('c10', `Пойдём!`, `Andiamo! Пойдём в кино́! Дава́й пойдём... (ты) / Дава́йте (вы). Con un mezzo: Пое́хали!`),
  ],
  [
    prac(
      `p1`,
      `Scegli il verbo: «Ora vado al lavoro in autobus» e «Ogni giorno vado al lavoro a piedi».`,
      `Я е́ду на рабо́ту на авто́бусе. [ia IE-du na ra-BO-tu na af-TO-bu-sie] — Я хожу́ на рабо́ту ка́ждый день. [ia ha-ZHU na ra-BO-tu KAZH-dyi DIEN'].`,
    ),
    prac(
      `p2`,
      `Traduci: «Andiamo a casa in taxi», «Vado a Roma in treno».`,
      `Мы е́дем домо́й на такси́. [my IE-dim da-MOI na tak-SI] — Я е́ду в Рим на по́езде. [ia IE-du v RIM na PO-iz-die].`,
    ),
    prac(
      `p3`,
      `Rispondi: «Куда́ ты идёшь?» (al negozio, a piedi).`,
      `Я иду́ в магази́н. [ia i-DU v ma-ga-ZIN]. Moto in corso a piedi = идти́; destinazione в + accusativo.`,
    ),
    prac(
      `p4`,
      `Spiega la differenza tra «Я шёл в кино́» e «Я ходи́л в кино́».`,
      `Я шёл в кино́ = stavo andando al cinema (in corso). Я ходи́л в кино́ = sono andato e sono tornato (ero al cinema). Il verbo abituale dice anche «sono stato».`,
    ),
    prac(
      `p5`,
      `Scrivi i mezzi: autobus, metropolitana, treno, bicicletta, aereo.`,
      `на авто́бусе; на метро́; на по́езде; на велосипе́де; на самолёте. Mezzo = на + prepositivo; a piedi = пешко́м.`,
    ),
    prac(
      `p6`,
      `Invita un amico al cinema e di' che domani andrai in Russia in aereo.`,
      `Пойдём в кино́! [pai-DIOM f ki-NO] — За́втра я пое́ду в Росси́ю на самолёте. [ZAF-tra ia pa-IE-du v ra-SSI-iu na sa-ma-LIO-tie].`,
    ),
  ],
)

export const russoA3: CourseModule[] = [ruDomande, ruPassato, ruMoto]
