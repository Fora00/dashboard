import type { CourseModule } from '../../engine/types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// Russian course, A1: nouns, adjectives, the present tense, first cases. Pronunciation convention: see pron.ts.

export const ruNomi = mod(
  'ru-nomi',
  `Sostantivi: genere, plurale e regola delle sette lettere`,
  `Genere dalla terminazione, plurale in -ы/-и e in -а stressato, falsi amici, ortografia dopo г к х ж ч ш щ`,
  'a1',
  `<p class="lead">Il russo non ha articoli e ha tre generi: maschile, femminile e neutro. Per fortuna il genere si legge quasi sempre dall'ultima lettera del nominativo. Attenzione però: alcuni generi non coincidono con l'italiano, e il plurale cambia a volte anche l'accento.</p>
${PRON_SHORT}
<h3>1. Il genere dalla terminazione</h3>
<table><tr><th>Genere</th><th>Terminazione</th><th>Esempi</th></tr>
<tr><td>maschile</td><td>consonante, -й, -ь (alcuni)</td><td>стол [STOL] (tavolo), дом [DOM], брат [BRAT], музе́й [mu-ZIEI] (museo), день [DIEN'] (giorno), учи́тель [u-CI-til'] (insegnante)</td></tr>
<tr><td>femminile</td><td>-а, -я, -ь (molti)</td><td>кни́га [KNI-ga], сестра́ [sis-TRA], неде́ля [ni-DIE-lia], семья́ [sim'-IA], дверь [DVIER'] (porta), ночь [NOC], мать [MAT']</td></tr>
<tr><td>neutro</td><td>-о, -е, -мя</td><td>окно́ [ak-NO] (finestra), сло́во [SLO-va] (parola), мо́ре [MO-rie], зда́ние [ZDA-ni-ie] (edificio), и́мя [I-mia] (nome), вре́мя [VRIE-mia] (tempo)</td></tr>
</table>
<p><b>Eccezioni sicure</b>: pochi nomi di uomini terminano in -а/-я e sono maschili: <b>па́па</b> [PA-pa], <b>де́душка</b> [DIE-du-shka] (nonno), <b>дя́дя</b> [DIA-dia] (zio), <b>мужчи́на</b> [mu-SHSHI-na] (uomo). Le parole in -ь vanno imparate: <b>день</b> e <b>учи́тель</b> sono maschili, <b>дверь</b>, <b>ночь</b>, <b>мать</b> sono femminili. Parole straniere che finiscono in vocale non cambiano: <b>кафе́</b> [ka-FE], <b>метро́</b> [mit-RO], <b>такси́</b> [tak-SI], <b>кино́</b> [ki-NO], <b>пальто́</b> [pal'-TO] sono neutre; <b>ко́фе</b> [KO-fie] è maschile.</p>
<h3>2. Generi che sorprendono un italiano</h3>
<ul><li><b>вино́</b> [vi-NO], <b>мо́ре</b> [MO-rie], <b>молоко́</b> [ma-la-KO], <b>мя́со</b> [MIA-ssa], <b>яйцо́</b> [ii-TSO] sono neutri (in italiano maschili o femminili).</li><li><b>ка́ша</b> [KA-sha] (porridge), <b>соль</b> [SOL'] (sale), <b>ночь</b> [NOC] sono femminili.</li><li>Il genere del nome è anche il genere dei suoi aggettivi, del suo passato e dei suoi pronomi: <b>он</b> per стол, <b>она́</b> per кни́га, <b>оно́</b> per окно́.</li></ul>
<h3>3. Plurale nominativo</h3>
<table><tr><th>Singolare</th><th>Plurale</th><th>Regola</th></tr>
<tr><td>стол [STOL]</td><td>столы́ [sta-LY]</td><td>consonante dura → -ы</td></tr>
<tr><td>сестра́ [sis-TRA]</td><td>сёстры [SIOS-try]</td><td>-а → -ы (l'accento si sposta)</td></tr>
<tr><td>кни́га [KNI-ga]</td><td>кни́ги [KNI-gi]</td><td>dopo г → и (regola delle sette lettere)</td></tr>
<tr><td>неде́ля [ni-DIE-lia]</td><td>неде́ли [ni-DIE-li]</td><td>-я → -и</td></tr>
<tr><td>музе́й [mu-ZIEI]</td><td>музе́и [mu-ZIE-i]</td><td>-й → -и</td></tr>
<tr><td>тетра́дь [ti-TRAT']</td><td>тетра́ди [ti-TRA-di]</td><td>-ь → -и</td></tr>
<tr><td>окно́ [ak-NO]</td><td>о́кна [OK-na]</td><td>-о → -а</td></tr>
<tr><td>мо́ре [MO-rie]</td><td>моря́ [ma-RIA]</td><td>-е → -я</td></tr>
<tr><td>сло́во [SLO-va]</td><td>слова́ [sla-VA]</td><td>-о → -а (accento sul finale)</td></tr>
</table>
<p>Molti nomi maschili hanno il plurale in <b>-а́</b> accentato: <b>дом → дома́</b> [da-MA], <b>го́род → города́</b> [ga-ra-DA], <b>глаз → глаза́</b> [gla-ZA], <b>но́мер → номера́</b> [na-mi-RA], <b>учи́тель → учителя́</b> [u-ci-ti-LIA]. Pochi plurali sono irregolari e vanno imparati interi: <b>челове́к → лю́ди</b> [LIU-di] (persone), <b>ребёнок</b> [ri-BIO-nak] <b>→ де́ти</b> [DIE-ti] (bambini), <b>друг → друзья́</b> [druz'-IA], <b>брат → бра́тья</b> [BRAT'-ia], <b>день → дни</b> [DNI] (giorni). Al plurale, per le cose inanimate, l'accusativo è uguale al nominativo.</p>
<h3>4. La regola delle sette lettere</h3>
<p>Dopo <b>г, к, х, ж, ч, ш, щ</b> non si scrive mai <b>ы</b> ma <b>и</b>: <b>кни́га → кни́ги</b>, <b>ру́чка</b> [RUC-ka] (penna) → <b>ру́чки</b> [RUC-ki], <b>ма́льчик</b> [MAL'-cik] (ragazzo) → <b>ма́льчики</b> [MAL'-ci-ki]. Mnemonico scolastico: «жи-ши пиши́ с и, ча-ща с а, чу-щу с у»: dopo ж, ш, ч, щ non si scrive mai я o ю ma <b>а</b> e <b>у</b> (<b>ча́шка</b> [CIASH-ka], tazza).</p>
<h3>5. Falsi amici e parole traditrici</h3>
<table><tr><th>Parola russa</th><th>Significa</th><th>Per dire l'italiano</th></tr>
<tr><td>магази́н [ma-ga-ZIN]</td><td>negozio</td><td>magazzino = склад [SKLAT]</td></tr>
<tr><td>фами́лия [fa-MI-li-ia]</td><td>cognome</td><td>famiglia = семья́ [sim'-IA]</td></tr>
<tr><td>кабине́т [ka-bi-NIET]</td><td>studio, ufficio, aula</td><td>cabina = каби́на [ka-BI-na]</td></tr>
<tr><td>арти́ст [ar-TIST]</td><td>attore, interprete</td><td>artista (pittore) = худо́жник [hu-DOZH-nik]</td></tr>
<tr><td>конфе́та [kan-FIE-ta]</td><td>caramella, cioccolatino</td><td>confetto = драже́ [dra-ZHE]</td></tr>
</table>
<h3>In sintesi</h3>
<p>Maschile = consonante (stol), femminile = -а/-я (kniga), neutro = -о/-е (okno). Plurale: -ы/-и, neutri -а/-я, molti maschili -а́ accentato, alcuni irregolari. Dopo г к х ж ч ш щ scrivi и, mai ы. Attenzione ai falsi amici: магази́н = negozio, фами́лия = cognome.</p>
<div class="say"><b>Da dire.</b> «У меня́ есть кни́ги и тетра́ди. Э́то мои́ друзья́.» [u mi-NIA IEST' KNI-gi i ti-TRA-di. E-ta ma-I druz'-IA]</div>`,
  [
    q(
      'q1',
      `Di che genere è «окно́» (finestra)?`,
      [`neutro`, `maschile`, `femminile`, `plurale`],
      0,
      `I nomi che terminano in -о o in -е sono neutri: окно́ è quindi neutro, anche se in italiano «finestra» è femminile.`,
    ),
    q(
      'q2',
      `Qual è il plurale corretto di «кни́га»?`,
      [`кни́ги`, `кни́гы`, `кни́гов`, `кни́гам`],
      0,
      `Dopo г non si può scrivere ы: la regola delle sette lettere impone кни́ги.`,
    ),
    q(
      'q3',
      `Qual è il plurale di «дом»?`,
      [`дома́`, `до́мы`, `до́ма`, `до́ми`],
      0,
      `Molti nomi maschili formano il plurale con -а accentato: дома́ [da-MA], come города́ e глаза́.`,
    ),
    q(
      'q4',
      `Che cosa significa «фами́лия»?`,
      [`cognome`, `famiglia`, `fama`, `amicizia`],
      0,
      `Фами́лия è il cognome, un falso amico: la famiglia in russo si dice семья́.`,
    ),
    q(
      'q5',
      `Qual è il plurale di «мо́ре» (mare)?`,
      [`моря́`, `мо́ри`, `мо́ря`, `мо́ры`],
      0,
      `I neutri in -е formano il plurale in -я, e qui l'accento si sposta sul finale: моря́ [ma-RIA].`,
    ),
    q(
      'q6',
      `Quale parola russa significa «negozio» (non «magazzino»)?`,
      [`магази́н`, `склад`, `ры́нок`, `кабине́т`],
      0,
      `Магази́н è il negozio; il magazzino dei depositi si dice склад, e кабине́т è l'ufficio o lo studio.`,
    ),
    q(
      'q7',
      `Quali sono le sette lettere dopo le quali si scrive «и» e non «ы»?`,
      [`г, к, х, ж, ч, ш, щ`, `б, в, д, з, л, м, н`, `а, о, у, э, ы, и, е`, `п, р, с, т, ф, ц, й`],
      0,
      `Dopo le velari г, к, х e le sibilanti ж, ч, ш, щ si scrive sempre и, mai ы: кни́ги, ру́чки.`,
    ),
    q(
      'q8',
      `Qual è il plurale irregolare di «челове́к» (persona)?`,
      [`лю́ди`, `челове́ки`, `челове́ка`, `челове́кы`],
      0,
      `Челове́к ha il plurale supplettivo лю́ди [LIU-di]; è una forma da imparare come parola a sé.`,
    ),
  ],
  [
    card(
      'c1',
      `Genere dalla terminazione`,
      `Consonante = m (стол); -а/-я = f (кни́га, неде́ля); -о/-е = n (окно́, мо́ре); -ь va imparato (день m, дверь f).`,
    ),
    card(
      'c2',
      `Plurale -ы / -и`,
      `-ы dopo consonante dura (столы́); -и dopo -я, -й, -ь (неде́ли, музе́и, тетра́ди) e dopo г к х ж ч ш щ.`,
    ),
    card('c3', `Plurale neutro`, `-о → -а: о́кна, слова́; -е → -я: моря́, зда́ния; и́мя → имена́.`),
    card('c4', `Plurale in -а́`, `дома́, города́, глаза́, номера́, учителя́: molti maschili con accento sul finale.`),
    card('c5', `Plurali irregolari`, `челове́к → лю́ди; ребёнок → де́ти; друг → друзья́; брат → бра́тья; день → дни.`),
    card('c6', `Regola delle sette lettere`, `Dopo г к х ж ч ш щ mai ы: sempre и. Dopo ж ч ш щ mai я/ю: a, u.`),
    card(
      'c7',
      `Falsi amici`,
      `магази́н = negozio; фами́лия = cognome; кабине́т = ufficio; арти́ст = attore; конфе́та = caramella.`,
    ),
    card('c8', `Generi sorprendenti`, `вино́, мо́ре, молоко́, мя́со, яйцо́ sono neutri; ка́ша, соль, ночь sono femminili.`),
  ],
  [
    prac(
      `p1`,
      `Indica il genere (m/f/n) di: стол, кни́га, окно́, неде́ля, мо́ре, учи́тель, дверь.`,
      `стол = m; кни́га = f; окно́ = n; неде́ля = f; мо́ре = n; учи́тель = m (-ь maschile); дверь = f (-ь femminile).`,
    ),
    prac(
      `p2`,
      `Scrivi il plurale di: стол, кни́га, неде́ля, окно́, мо́ре, дом.`,
      `столы́, кни́ги, неде́ли, о́кна, моря́, дома́. Occhio a кни́ги (г) e a дома́ (accento sul finale).`,
    ),
    prac(
      `p3`,
      `Perché si scrive «ру́чки» e non «ру́чы»?`,
      `Per la regola delle sette lettere: dopo ч (e г к х ж ш щ) la ы diventa и. Lo stesso vale per кни́ги, ма́льчики.`,
    ),
    prac(
      `p4`,
      `Traduci «Il mio cognome è Rossi» e «Ho una famiglia grande».`,
      `Моя́ фами́лия — Ро́сси. [ma-IA fa-MI-li-ia RO-ssi] — У меня́ больша́я семья́. [u mi-NIA bal'-SHA-ia sim'-IA]. Фами́лия = cognome, семья́ = famiglia.`,
    ),
    prac(
      `p5`,
      `Dì in russo «negozio», «magazzino», «ufficio», «caramella» e di' il falso amico che c'è dietro.`,
      `магази́н (negozio, non magazzino); склад (magazzino); кабине́т (ufficio, non cabina); конфе́та (caramella, non confetto). Quindi non usare la parola «simile» all'italiano senza controllare.`,
    ),
  ],
)

export const ruAggettivi = mod(
  'ru-aggettivi',
  `Aggettivi, possessivi e э́тот`,
  `Concordanza di genere e numero al nominativo, tipi di aggettivo, мой/твой/наш/ваш/его́/её/их, э́тот`,
  'a1',
  `<p class="lead">In russo l'aggettivo precede il sostantivo e <b>concorda</b> con esso in genere, numero e caso. Al nominativo basta imparare quattro desinenze e riconoscere due tipi: aggettivi in <b>-ый</b> (accento sul tema) e in <b>-ой</b> (accento sulla desinenza), più la serie morbida in <b>-ий</b>.</p>
${PRON_SHORT}
<h3>1. Desinenze al nominativo</h3>
<table><tr><th>Tipo</th><th>Maschile</th><th>Femminile</th><th>Neutro</th><th>Plurale</th></tr>
<tr><td>duro, tema accentato</td><td>но́вый [NO-vyi]</td><td>но́вая [NO-va-ia]</td><td>но́вое [NO-va-ia]</td><td>но́вые [NO-vy-ie]</td></tr>
<tr><td>duro, desinenza accentata</td><td>большо́й [bal'-SHOI]</td><td>больша́я [bal'-SHA-ia]</td><td>большо́е [bal'-SHO-ia]</td><td>больши́е [bal'-SHY-ie]</td></tr>
<tr><td>morbido</td><td>си́ний [SI-nii] (blu)</td><td>си́няя [SI-ni-ia]</td><td>си́нее [SI-ni-ia]</td><td>си́ние [SI-ni-ie]</td></tr>
<tr><td>dopo ш, ж, ч, щ</td><td>хоро́ший [ha-RO-shyi]</td><td>хоро́шая [ha-RO-sha-ia]</td><td>хоро́шее [ha-RO-shy-ia]</td><td>хоро́шие [ha-RO-shy-ie]</td></tr>
</table>
<p>Il neutro prende -ое (duro) o -ее (morbido, o dopo ш ж ч щ senza accento). Nel parlato le terminazioni -ая, -ое, -ее si pronunciano deboli (<b>[a-ia]</b>, <b>[y-ia]</b>), ma si scrivono sempre per intero. I tre tipi si vedono dalla desinenza del maschile: <b>-ый</b>, <b>-ий</b>, <b>-ой</b>.</p>
<h3>2. Aggettivi comuni (con l'accento)</h3>
<table><tr><th>Russo</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>большо́й</td><td>[bal'-SHOI]</td><td>grande</td></tr>
<tr><td>ма́ленький</td><td>[MA-lin'-kii]</td><td>piccolo</td></tr>
<tr><td>но́вый</td><td>[NO-vyi]</td><td>nuovo</td></tr>
<tr><td>ста́рый</td><td>[STA-ryi]</td><td>vecchio</td></tr>
<tr><td>молодо́й</td><td>[ma-la-DOI]</td><td>giovane</td></tr>
<tr><td>краси́вый</td><td>[kra-SI-vyi]</td><td>bello</td></tr>
<tr><td>хоро́ший</td><td>[ha-RO-shyi]</td><td>buono</td></tr>
<tr><td>плохо́й</td><td>[pla-HOI]</td><td>cattivo</td></tr>
<tr><td>интере́сный</td><td>[in-ti-RIES-nyi]</td><td>interessante</td></tr>
<tr><td>вку́сный</td><td>[FKUS-nyi]</td><td>buono (da mangiare)</td></tr>
<tr><td>дорого́й</td><td>[da-ra-GOI]</td><td>caro (costoso)</td></tr>
<tr><td>дешёвый</td><td>[di-SHO-vyi]</td><td>economico</td></tr>
</table>
<p>Esempi: <b>но́вый дом</b> [NO-vyi DOM], <b>но́вая кни́га</b> [NO-va-ia KNI-ga], <b>но́вое окно́</b> [NO-va-ia ak-NO], <b>но́вые дома́</b> [NO-vy-ie da-MA]. Nelle frasi senza verbo, l'aggettivo segue il sostantivo e concorda: <b>Дом большо́й.</b> [DOM bal'-SHOI] (la casa è grande), <b>Кни́га ста́рая.</b> [KNI-ga STA-ra-ia] (il libro è vecchio).</p>
<h3>3. Possessivi</h3>
<table><tr><th>Possessore</th><th>m</th><th>f</th><th>n</th><th>pl</th></tr>
<tr><td>mio</td><td>мой [MOI]</td><td>моя́ [ma-IA]</td><td>моё [ma-IO]</td><td>мои́ [ma-I]</td></tr>
<tr><td>tuo</td><td>твой [TVOI]</td><td>твоя́ [tva-IA]</td><td>твоё [tva-IO]</td><td>твои́ [tva-I]</td></tr>
<tr><td>nostro</td><td>наш [NASH]</td><td>на́ша [NA-sha]</td><td>на́ше [NA-shy]</td><td>на́ши [NA-shy]</td></tr>
<tr><td>vostro / Suo</td><td>ваш [VASH]</td><td>ва́ша [VA-sha]</td><td>ва́ше [VA-shy]</td><td>ва́ши [VA-shy]</td></tr>
<tr><td>suo (di lui)</td><td colspan="4">его́ [i-VO] (non cambia mai)</td></tr>
<tr><td>suo (di lei)</td><td colspan="4">её [i-IO] (non cambia mai)</td></tr>
<tr><td>loro</td><td colspan="4">их [IH] (non cambia mai)</td></tr>
</table>
<p>Il possessivo concorda con la <b>cosa posseduta</b>: <b>мой брат</b> [MOI BRAT], <b>моя́ сестра́</b> [ma-IA sis-TRA], <b>моё письмо́</b> [ma-IO pis'-MO], <b>мои́ друзья́</b> [ma-I druz'-IA]. Per «suo» il russo distingue il possessore: <b>его́ ма́ма</b> (la mamma di lui) e <b>её ма́ма</b> (la mamma di lei) non cambiano con il genere di «ма́ма». Esiste anche <b>свой</b> (il proprio), che per ora basta riconoscere. Domanda: <b>Чей э́то дом?</b> [CEI E-ta DOM] (di chi è questa casa?).</p>
<h3>4. Э́тот: questo</h3>
<p><b>э́тот</b> [E-tat] (m), <b>э́та</b> [E-ta] (f), <b>э́то</b> [E-ta] (n), <b>э́ти</b> [E-ti] (pl) + sostantivo: <b>э́тот дом</b> [E-tat DOM], <b>э́та маши́на</b> [E-ta ma-SHY-na], <b>э́ти дома́</b> [E-ti da-MA]. Non confondere con il neutro invariabile <b>э́то</b> usato da solo («questo è»): <b>Э́то дом.</b> contro <b>Э́тот дом большо́й.</b></p>
<h3>Trappole italiane</h3>
<ul><li>L'ordine è <b>aggettivo + nome</b> sempre: «una casa rossa» = «кра́сный дом».</li><li><b>его́, её, их</b> non concordano: «la sua macchina» = <b>его́ маши́на</b> (di lui), <b>её маши́на</b> (di lei). Non esiste «sua» ambiguo come in italiano.</li><li>Gli aggettivi in <b>-ой</b> sono accentati sulla desinenza (<b>молодо́й</b> [ma-la-DOI]), quelli in <b>-ый</b> sul tema (<b>но́вый</b>): l'accento cambia il suono, non la grammatica.</li><li>Niente articolo: «la mia casa» = <b>мой дом</b>.</li></ul>
<h3>In sintesi</h3>
<p>Quattro desinenze (-ый/-ая/-ое/-ые), due tipi con accento diverso, un tipo morbido (-ий). I possessivi mio/tuo/nostro/vostro concordano con la cosa posseduta; его́, её, их sono invariabili. <b>э́тот</b> + nome = questo + nome.</p>
<div class="say"><b>Da dire.</b> «Э́то мой но́вый дом. Он большо́й и краси́вый.» [E-ta MOI NO-vyi DOM. ON bal'-SHOI i kra-SI-vyi]</div>`,
  [
    q(
      'q1',
      `Come si dice «una casa nuova» in russo?`,
      [`но́вый дом`, `но́вая дом`, `дом но́вая`, `но́вое дом`],
      0,
      `Дом è maschile, quindi l'aggettivo ha la desinenza maschile -ый e precede il sostantivo: но́вый дом.`,
    ),
    q(
      'q2',
      `Qual è il femminile di «хоро́ший» (buono)?`,
      [`хоро́шая`, `хоро́шый`, `хоро́шое`, `хоро́шии`],
      0,
      `Gli aggettivi in -ий dopo ш hanno il femminile in -ая: хоро́шая; хоро́шее è il neutro e хоро́шие il plurale.`,
    ),
    q(
      'q3',
      `Come si dice «i miei amici»?`,
      [`мои́ друзья́`, `мой друзья́`, `моя́ друзья́`, `моё друзья́`],
      0,
      `Друзья́ è plurale, quindi il possessivo prende la forma plurale мои́; мой è maschile singolare.`,
    ),
    q(
      'q4',
      `Che cosa significa «её маши́на»?`,
      [`la sua macchina (di lei)`, `la sua macchina (di lui)`, `la nostra macchina`, `la loro macchina`],
      0,
      `Её indica una proprietaria donna e non cambia mai; per un uomo si usa его́, per più persone их.`,
    ),
    q(
      'q5',
      `Quale desinenza ha il maschile di un aggettivo con accento sulla desinenza?`,
      [`-ой`, `-ый`, `-ий`, `-ое`],
      0,
      `Gli aggettivi con accento sulla desinenza terminano in -ой: большо́й, молодо́й, плохо́й.`,
    ),
    q(
      'q6',
      `Qual è il neutro di «си́ний» (blu)?`,
      [`си́нее`, `си́ное`, `си́нея`, `си́нои`],
      0,
      `Il tema morbido richiede -ее al neutro, per questo si ha си́нее окно́ (finestra blu).`,
    ),
    q(
      'q7',
      `Come si dice «questa macchina»?`,
      [`э́тот маши́на`, `э́та маши́на`, `э́то маши́на`, `э́ти маши́на`],
      1,
      `Маши́на è femminile, quindi serve э́та: э́та маши́на. Э́тот sarebbe per un nome maschile.`,
    ),
    q(
      'q8',
      `Quale di queste frasi significa «La casa è grande»?`,
      [`Дом большо́й.`, `Дом есть большо́й.`, `Дом большо́е.`, `Дом больша́я.`],
      0,
      `Senza verbo essere, l'aggettivo concorda con дом (maschile): Дом большо́й.`,
    ),
  ],
  [
    card(
      'c1',
      `Desinenze nominativo`,
      `-ый/-ий/-ой (m), -ая/-яя (f), -ое/-ее (n), -ые/-ие (pl): но́вый, но́вая, но́вое, но́вые.`,
    ),
    card(
      'c2',
      `Tre tipi`,
      `-ый (tema accentato: но́вый), -ой (desinenza accentata: большо́й), -ий (morbido o dopo ш ж ч щ: си́ний, хоро́ший).`,
    ),
    card(
      'c3',
      `мой / твой`,
      `мой, моя́, моё, мои́; твой, твоя́, твоё, твои́. Concordano con la cosa posseduta, non con chi possiede.`,
    ),
    card(
      'c4',
      `наш / ваш`,
      `наш, на́ша, на́ше, на́ши; ваш, ва́ша, ва́ше, ва́ши. Stesse quattro forme di мой: m, f, n e plurale.`,
    ),
    card(
      'c5',
      `его́ / её / их`,
      `Invariabili: его́ ма́ма (la mamma di lui), её ма́ма (la mamma di lei), их дом (la loro casa).`,
    ),
    card('c6', `э́тот`, `э́тот (m), э́та (f), э́то (n), э́ти (pl) + nome. Da non confondere con Э́то invariabile.`),
    card('c7', `Ordine`, `Aggettivo + nome: большо́й дом. Il predicato senza verbo segue il nome: Дом большо́й.`),
    card('c8', `Чей?`, `чей дом? (di chi è la casa?); чья, чьё, чьи concordano come мой.`),
  ],
  [
    prac(
      `p1`,
      `Metti al femminile e al plurale: но́вый, большо́й, хоро́ший, си́ний.`,
      `но́вая, но́вые; больша́я, больши́е; хоро́шая, хоро́шие; си́няя, си́ние.`,
    ),
    prac(
      `p2`,
      `Traduci: «il mio nuovo amico», «la mia nuova casa» (дом), «i miei fratelli» (бра́тья).`,
      `мой но́вый друг [MOI NO-vyi DRUK]; мой но́вый дом [MOI NO-vyi DOM]; мои́ бра́тья [ma-I BRAT'-ia]. Il possessivo e l'aggettivo concordano con il sostantivo.`,
    ),
    prac(
      `p3`,
      `Come si dice «la sua macchina» se il proprietario è un uomo? E se è una donna?`,
      `его́ маши́на [i-VO ma-SHY-na] (di lui); её маши́на [i-IO ma-SHY-na] (di lei). Non cambiano mai con маши́на.`,
    ),
    prac(
      `p4`,
      `Completa con э́тот/э́та/э́то/э́ти: ___ кни́га, ___ дом, ___ окно́, ___ друзья́.`,
      `э́та кни́га, э́тот дом, э́то окно́, э́ти друзья́. Il dimostrativo concorda con il genere del sostantivo.`,
    ),
    prac(
      `p5`,
      `Traduci: «La casa è nuova e grande», «Il libro è interessante».`,
      `Дом но́вый и большо́й. [DOM NO-vyi i bal'-SHOI] — Кни́га интере́сная. [KNI-ga in-ti-RIES-na-ia]. Nessun verbo essere al presente.`,
    ),
  ],
)

export const ruPresente = mod(
  'ru-presente',
  `Il presente: due coniugazioni e i verbi irregolari`,
  `Infinito in -ть, coniugazione in -ешь e in -ишь, жить, хоте́ть, мочь, идти́, е́хать, есть, пить, писа́ть, -овать, alternanze di consonante, verbi in -ся`,
  'a1',
  `<p class="lead">Il presente russo è semplice: <b>un'unica forma</b> traduce sia «leggo» sia «sto leggendo». Non c'è ausiliare né «do/does». Ci sono due coniugazioni regolari e pochi verbi irregolari ma frequentissimi, da imparare a blocchi.</p>
${PRON_SHORT}
<h3>1. Pronomi e infinito</h3>
<p>я [ia], ты [TY], он [ON] / она́ [a-NA] / оно́ [a-NO], мы [MY], вы [VY], они́ [a-NI]. L'infinito termina quasi sempre in <b>-ть</b> (<b>чита́ть</b> [ci-TAT'], <b>говори́ть</b> [ga-va-RIT']), in <b>-ти</b> (<b>идти́</b> [it-TI]) o in <b>-чь</b> (<b>мочь</b> [MOC]). Dall'infinito si ricavano le forme del presente, ma bisogna sapere la coniugazione.</p>
<h3>2. Prima coniugazione: -ю, -ешь, -ет, -ем, -ете, -ют</h3>
<p>Verbi in <b>-ать/-ять</b>: togli <b>-ть</b> e aggiungi le desinenze. Modello: <b>чита́ть</b> [ci-TAT'] (leggere).</p>
<table><tr><th>Persona</th><th>Forma</th><th>Pronuncia</th></tr>
<tr><td>я</td><td>чита́ю</td><td>[ci-TA-iu]</td></tr>
<tr><td>ты</td><td>чита́ешь</td><td>[ci-TA-ish]</td></tr>
<tr><td>он / она́</td><td>чита́ет</td><td>[ci-TA-it]</td></tr>
<tr><td>мы</td><td>чита́ем</td><td>[ci-TA-im]</td></tr>
<tr><td>вы</td><td>чита́ете</td><td>[ci-TA-i-tie]</td></tr>
<tr><td>они́</td><td>чита́ют</td><td>[ci-TA-iut]</td></tr>
</table>
<p>Allo stesso modo: <b>де́лать</b> [DIE-lat'] (fare): <b>де́лаю</b> [DIE-la-iu], <b>де́лаешь</b> [DIE-la-ish]; <b>знать</b> [ZNAT'] (sapere): <b>зна́ю</b> [ZNA-iu], <b>зна́ешь</b> [ZNA-ish]; <b>рабо́тать</b> [ra-BO-tat'] (lavorare): <b>рабо́таю</b> [ra-BO-ta-iu]; <b>понима́ть</b> [pa-ni-MAT'] (capire): <b>понима́ю</b> [pa-ni-MA-iu]; <b>гуля́ть</b> [gu-LIAT'] (passeggiare): <b>гуля́ю</b> [gu-LIA-iu].</p>
<h3>3. Seconda coniugazione: -ю/-у, -ишь, -ит, -им, -ите, -ят/-ат</h3>
<p>Per la maggior parte dei verbi in <b>-ить</b> e per alcuni in -еть/-ать. Modello: <b>говори́ть</b> [ga-va-RIT'] (parlare).</p>
<table><tr><th>Persona</th><th>Forma</th><th>Pronuncia</th></tr>
<tr><td>я</td><td>говорю́</td><td>[ga-va-RIU]</td></tr>
<tr><td>ты</td><td>говори́шь</td><td>[ga-va-RISH]</td></tr>
<tr><td>он / она́</td><td>говори́т</td><td>[ga-va-RIT]</td></tr>
<tr><td>мы</td><td>говори́м</td><td>[ga-va-RIM]</td></tr>
<tr><td>вы</td><td>говори́те</td><td>[ga-va-RI-tie]</td></tr>
<tr><td>они́</td><td>говоря́т</td><td>[ga-va-RIAT]</td></tr>
</table>
<p>Altri modelli con accento mobile: <b>смотре́ть</b> [smat-RIET'] (guardare): <b>смотрю́</b> [smat-RIU], <b>смо́тришь</b> [SMOT-rish], <b>смо́трит</b> [SMOT-rit], <b>смо́трим</b> [SMOT-rim], <b>смо́трите</b> [SMOT-ri-tie], <b>смо́трят</b> [SMOT-riat]; <b>люби́ть</b> [liu-BIT']: <b>люблю́</b> [liub-LIU], <b>лю́бишь</b> [LIU-bish], <b>лю́бит</b> [LIU-bit], <b>лю́бим</b> [LIU-bim], <b>лю́бите</b> [LIU-bi-tie], <b>лю́бят</b> [LIU-biat]. Nota: <b>люблю́</b> inserisce una <b>л</b> alla prima persona.</p>
<h3>4. Verbi irregolari da imparare interi</h3>
<table><tr><th>Verbo</th><th>я</th><th>ты</th><th>он</th><th>мы</th><th>вы</th><th>они́</th></tr>
<tr><td>жить [ZHYT'] vivere</td><td>живу́ [zhy-VU]</td><td>живёшь [zhy-VIOSH]</td><td>живёт [zhy-VIOT]</td><td>живём [zhy-VIOM]</td><td>живёте [zhy-VIO-tie]</td><td>живу́т [zhy-VUT]</td></tr>
<tr><td>хоте́ть [ha-TIET'] volere</td><td>хочу́ [ha-CIU]</td><td>хо́чешь [HO-cish]</td><td>хо́чет [HO-cit]</td><td>хоти́м [ha-TIM]</td><td>хоти́те [ha-TI-tie]</td><td>хотя́т [ha-TIAT]</td></tr>
<tr><td>мочь [MOC] potere</td><td>могу́ [ma-GU]</td><td>мо́жешь [MO-zhysh]</td><td>мо́жет [MO-zhyt]</td><td>мо́жем [MO-zhym]</td><td>мо́жете [MO-zhy-tie]</td><td>мо́гут [MO-gut]</td></tr>
<tr><td>идти́ [it-TI] andare a piedi</td><td>иду́ [i-DU]</td><td>идёшь [i-DIOSH]</td><td>идёт [i-DIOT]</td><td>идём [i-DIOM]</td><td>идёте [i-DIO-tie]</td><td>иду́т [i-DUT]</td></tr>
<tr><td>е́хать [IE-hat'] andare con un mezzo</td><td>е́ду [IE-du]</td><td>е́дешь [IE-dish]</td><td>е́дет [IE-dit]</td><td>е́дем [IE-dim]</td><td>е́дете [IE-di-tie]</td><td>е́дут [IE-dut]</td></tr>
<tr><td>есть [IEST'] mangiare</td><td>ем [IEM]</td><td>ешь [IESH]</td><td>ест [IEST]</td><td>еди́м [i-DIM]</td><td>еди́те [i-DI-tie]</td><td>едя́т [i-DIAT]</td></tr>
<tr><td>пить [PIT'] bere</td><td>пью [PIU]</td><td>пьёшь [PIOSH]</td><td>пьёт [PIOT]</td><td>пьём [PIOM]</td><td>пьёте [PIO-tie]</td><td>пьют [PIUT]</td></tr>
</table>
<p>Attenzione: <b>есть</b> come «mangiare» (ем, ешь) non è lo stesso verbo di <b>есть</b> «c'è» (invariabile). <b>Хоте́ть</b> e <b>мочь</b> sono seguiti dall'infinito: <b>Я хочу́ пить.</b> [ia ha-CIU PIT'] (voglio bere), <b>Я могу́ рабо́тать.</b> [ia ma-GU ra-BO-tat'] (posso lavorare), <b>Я люблю́ чита́ть.</b> [ia liub-LIU ci-TAT'] (mi piace leggere).</p>
<h3>5. Alternanze di consonante e altri verbi frequenti</h3>
<p>In alcuni verbi cambia una consonante: <b>с → ш</b> (писа́ть: пишу́), <b>д → ж</b> (ви́деть: ви́жу, ходи́ть: хожу́), <b>б → бл</b> (люби́ть: люблю́), <b>п → пл</b> (спать: сплю), <b>т → ч</b> (хоте́ть: хочу́), <b>г → ж</b> (мочь: могу́, мо́жешь). Spesso cambia solo la prima persona (ви́жу, хожу́, люблю́, сплю: poi ви́дишь, хо́дишь, лю́бишь, спишь); in писа́ть la ш resta in tutto il presente (пишу́, пи́шешь, пи́шут).</p>
<table><tr><th>Verbo</th><th>я</th><th>ты</th><th>он</th><th>мы</th><th>вы</th><th>они́</th></tr>
<tr><td>писа́ть [pi-SAT'] scrivere</td><td>пишу́ [pi-SHU]</td><td>пи́шешь [PI-shysh]</td><td>пи́шет [PI-shyt]</td><td>пи́шем [PI-shym]</td><td>пи́шете [PI-shy-tie]</td><td>пи́шут [PI-shut]</td></tr>
<tr><td>ви́деть [VI-dit'] vedere</td><td>ви́жу [VI-zhu]</td><td>ви́дишь [VI-dish]</td><td>ви́дит [VI-dit]</td><td>ви́дим [VI-dim]</td><td>ви́дите [VI-di-tie]</td><td>ви́дят [VI-diat]</td></tr>
<tr><td>спать [SPAT'] dormire</td><td>сплю [SPLIU]</td><td>спишь [SPISH]</td><td>спит [SPIT]</td><td>спим [SPIM]</td><td>спи́те [SPI-tie]</td><td>спят [SPIAT]</td></tr>
<tr><td>дава́ть [da-VAT'] dare</td><td>даю́ [da-IU]</td><td>даёшь [da-IOSH]</td><td>даёт [da-IOT]</td><td>даём [da-IOM]</td><td>даёте [da-IO-tie]</td><td>даю́т [da-IUT]</td></tr>
<tr><td>брать [BRAT'] prendere</td><td>беру́ [bi-RU]</td><td>берёшь [bi-RIOSH]</td><td>берёт [bi-RIOT]</td><td>берём [bi-RIOM]</td><td>берёте [bi-RIO-tie]</td><td>беру́т [bi-RUT]</td></tr>
</table>
<p>I verbi in <b>-овать / -евать</b> cambiano il suffisso in <b>-у-</b> (accentata se l'infinito è in -ова́ть: рису́ю, танцу́ю; in чу́вствовать resta чу́вствую): <b>рисова́ть</b> [ri-sa-VAT'] (disegnare): <b>рису́ю</b> [ri-SU-iu], <b>рису́ешь</b> [ri-SU-ish], <b>рису́ет</b> [ri-SU-it], <b>рису́ем</b> [ri-SU-im], <b>рису́ете</b> [ri-SU-i-tie], <b>рису́ют</b> [ri-SU-iut]; <b>танцева́ть</b> [tan-tsy-VAT'] (ballare): <b>танцу́ю</b> [tan-TSU-iu]. Esempi: <b>Я пишу́ письмо́.</b> [ia pi-SHU pis'-MO] (scrivo una lettera); <b>Я не ви́жу его́.</b> [ia ni VI-zhu i-VO]; <b>Он спит.</b> [ON SPIT].</p>
<h3>6. Verbi in -ся</h3>
<p>Il suffisso <b>-ся</b> (dopo vocale <b>-сь</b>) si aggiunge alla fine di ogni forma: <b>учи́ться</b> [u-CI-tsa] (studiare, imparare), <b>занима́ться</b> [za-ni-MA-tsa] (occuparsi, fare sport). <b>Он у́чится.</b> [ON U-ci-tsa]; <b>Я учу́сь.</b> [ia u-CIUS']. La terminazione -ться si pronuncia come una <b>ts</b> lunga.</p>
<h3>Trappole italiane</h3>
<ul><li>Il presente russo copre anche «sto facendo»: <b>Что ты де́лаешь?</b> [SHTO ty DIE-la-ish] = «che cosa fai / stai facendo?».</li><li>Non omettere il pronome: a differenza dell'italiano, <b>я, ты, мы</b> si dicono di norma (<b>Я чита́ю</b>), anche se la desinenza è chiara.</li><li><b>вы</b> + verbo plurale anche per una persona sola: <b>Вы говори́те по-ру́сски?</b></li><li>Dopo хоте́ть, мочь, люби́ть il secondo verbo resta all'infinito.</li></ul>
<h3>In sintesi</h3>
<p>Prima coniugazione: <b>-ю, -ешь, -ет, -ем, -ете, -ют</b>. Seconda: <b>-ю, -ишь, -ит, -им, -ите, -ят</b>. Impara a memoria жить, хоте́ть, мочь, идти́, е́хать, есть, пить: sono i verbi più frequenti; poi писа́ть (пишу́), ви́деть (ви́жу), спать, дава́ть, брать e i verbi in -овать (рису́ю). Un'unica forma di presente per l'abituale e per l'azione in corso.</p>
<div class="say"><b>Da dire.</b> «Я живу́ в Ри́ме, рабо́таю и учу́ ру́сский.» [ia zhy-VU v RI-mie, ra-BO-ta-iu i u-CIU RUS-skii]</div>`,
  [
    q(
      'q1',
      `Come si dice «lui legge» (чита́ть)?`,
      [`он чита́ет`, `он чита́ит`, `он чита́ешь`, `он чита́ют`],
      0,
      `La prima coniugazione ha -ет alla terza persona singolare: он чита́ет; -ешь è per ты e -ют per они́.`,
    ),
    q(
      'q2',
      `Come si dice «io voglio» (хоте́ть)?`,
      [`я хочу́`, `я хоте́ю`, `я хочёт`, `я хо́чу`],
      0,
      `Хоте́ть ha una prima persona irregolare con consonante diversa: я хочу́, poi ты хо́чешь e они́ хотя́т.`,
    ),
    q(
      'q3',
      `Quale di questi verbi appartiene alla seconda coniugazione?`,
      [`говори́ть`, `чита́ть`, `де́лать`, `знать`],
      0,
      `I verbi in -ить come говори́ть seguono la seconda coniugazione (-ишь, -ит); чита́ть, де́лать e знать sono della prima.`,
    ),
    q(
      'q4',
      `Come si dice «loro parlano»?`,
      [`они́ говоря́т`, `они́ говори́т`, `они́ говорю́т`, `они́ говори́м`],
      0,
      `La terza plurale della seconda coniugazione termina in -ят: говоря́т; -ют sarebbe della prima.`,
    ),
    q(
      'q5',
      `Come si dice «tu vivi» (жить)?`,
      [`ты живёшь`, `ты жи́вешь`, `ты живу́шь`, `ты живёт`],
      0,
      `Жить è irregolare e ha la forma ты живёшь con ё accentata; живёт è la terza singolare.`,
    ),
    q(
      'q6',
      `Come si dice «Voglio bere» in russo?`,
      [`Я хочу́ пить.`, `Я хочу́ пью.`, `Я хоте́ть пить.`, `Я хо́чет пить.`],
      0,
      `Dopo хоте́ть il secondo verbo resta all'infinito: пить. La prima persona è я хочу́, mai хоте́ть né хо́чет.`,
    ),
    q(
      'q7',
      `Che cosa significa «Что ты де́лаешь?»`,
      [`Che cosa fai (o stai facendo)?`, `Che cosa hai fatto?`, `Che cosa farai?`, `Che cosa vuoi?`],
      0,
      `Il presente russo copre sia l'azione abituale sia quella in corso: де́лаешь = fai e stai facendo.`,
    ),
    q(
      'q8',
      `Qual è la forma «мы» di «мочь» (potere)?`,
      [`мо́жем`, `мо́гем`, `мо́чем`, `мо́жим`],
      0,
      `Мочь cambia la consonante: я могу́, ma ты мо́жешь, мы мо́жем; мо́гут è solo la terza plurale.`,
    ),
    q(
      'q9',
      `Come si dice «io scrivo» (писа́ть)?`,
      [`я пишу́`, `я писа́ю`, `я пису́`, `я пиши́т`],
      0,
      `Писа́ть cambia la consonante: с diventa ш alla prima persona, quindi я пишу́ e poi ты пи́шешь.`,
    ),
    q(
      'q10',
      `Come si dice «io disegno» (рисова́ть)?`,
      [`я рису́ю`, `я рисова́ю`, `я рисо́ю`, `я рису́шь`],
      0,
      `I verbi in -овать sostituiscono -ова- con -у- (accentata se l'infinito è in -ова́ть): рисова́ть dà я рису́ю, ты рису́ешь, они́ рису́ют.`,
    ),
  ],
  [
    card(
      'c1',
      `1ª coniugazione`,
      `-ю, -ешь, -ет, -ем, -ете, -ют: чита́ю, чита́ешь, чита́ет... (де́лать, знать, рабо́тать, понима́ть).`,
    ),
    card(
      'c2',
      `2ª coniugazione`,
      `-ю/-у, -ишь, -ит, -им, -ите, -ят/-ат: говорю́, говори́шь, говори́т, говори́м, говори́те, говоря́т.`,
    ),
    card(
      'c3',
      `Presente unico`,
      `Un solo presente per abitudine e azione in corso: Я чита́ю = leggo / sto leggendo. Nessun ausiliare.`,
    ),
    card('c4', `жить`, `живу́, живёшь, живёт, живём, живёте, живу́т.`),
    card('c5', `хоте́ть`, `хочу́, хо́чешь, хо́чет, хоти́м, хоти́те, хотя́т. + infinito: Я хочу́ пить.`),
    card('c6', `мочь`, `могу́, мо́жешь, мо́жет, мо́жем, мо́жете, мо́гут. + infinito.`),
    card('c7', `идти́ / е́хать`, `иду́, идёшь, идёт... / е́ду, е́дешь, е́дет... Andare a piedi / con un mezzo.`),
    card('c8', `есть e пить`, `ем, ешь, ест, еди́м, еди́те, едя́т; пью, пьёшь, пьёт, пьём, пьёте, пьют.`),
    card('c9', `Verbi in -ся`, `учи́ться, занима́ться: -ся / -сь alla fine di ogni forma. -ться si dice ts lunga.`),
    card(
      'c10',
      `Alternanze`,
      `писа́ть: пишу́, пи́шешь...; ви́деть: ви́жу, ви́дишь...; спать: сплю, спишь...; люби́ть: люблю́, лю́бишь...`,
    ),
    card(
      'c11',
      `-овать`,
      `рисова́ть: рису́ю, рису́ешь, рису́ет...; танцева́ть: танцу́ю. -ова- → -у- (accentata se l'infinito è in -ова́ть).`,
    ),
    card('c12', `дава́ть / брать`, `даю́, даёшь, даёт, даём, даёте, даю́т / беру́, берёшь, берёт, берём, берёте, беру́т.`),
  ],
  [
    prac(
      `p1`,
      `Coniuga «де́лать» al presente.`,
      `я де́лаю [ia DIE-la-iu], ты де́лаешь [ty DIE-la-ish], он де́лает [ON DIE-la-it], мы де́лаем [my DIE-la-im], вы де́лаете [vy DIE-la-i-tie], они́ де́лают [a-NI DIE-la-iut].`,
    ),
    prac(
      `p2`,
      `Coniuga «говори́ть» alla prima e alla terza plurale.`,
      `я говорю́ [ia ga-va-RIU]; они́ говоря́т [a-NI ga-va-RIAT]. La seconda coniugazione ha -ю e -ят.`,
    ),
    prac(
      `p3`,
      `Traduci: «Vivo a Roma», «Vuoi bere?», «Possiamo andare a casa?»`,
      `Я живу́ в Ри́ме. [ia zhy-VU v RI-mie] — Ты хо́чешь пить? [ty HO-cish PIT'] — Мы мо́жем идти́ домо́й? [my MO-zhym it-TI da-MOI] (идти́ resta all'infinito).`,
    ),
    prac(
      `p4`,
      `Metti al presente: «(люби́ть) я ___ чай», «(знать) они́ ___ ру́сский».`,
      `Я люблю́ чай. [ia liub-LIU CIAI] — Они́ зна́ют ру́сский. [a-NI ZNA-iut RUS-skii]. Люби́ть è della seconda coniugazione con л epentetica alla 1ª singolare.`,
    ),
    prac(
      `p5`,
      `Qual è la differenza tra «есть» = mangiare e «есть» = c'è?`,
      `Mangiare: ем, ешь, ест... (Я ем суп.) — C'è: есть è invariabile (У меня́ есть брат.). Il contesto li distingue.`,
    ),
    prac(
      `p6`,
      `Coniuga alla 1ª e alla 3ª persona singolare: писа́ть, ви́деть, рисова́ть.`,
      `я пишу́ [ia pi-SHU], он пи́шет [ON PI-shyt]; я ви́жу [ia VI-zhu], он ви́дит [ON VI-dit]; я рису́ю [ia ri-SU-iu], он рису́ет [ON ri-SU-it].`,
    ),
  ],
)

export const ruCasi1 = mod(
  'ru-casi1',
  `Primi casi: prepositivo e accusativo`,
  `Dove? в/на + prepositivo, verso dove? в/на + accusativo, oggetto diretto, где e куда́, pronomi меня́ тебя́ его́ её`,
  'a1',
  `<p class="lead">Il russo usa i <b>casi</b> (terminazioni del sostantivo) al posto di molte preposizioni italiane. Sono sei: nominativo, genitivo, dativo, accusativo, strumentale e prepositivo. In A1 bastano <b>tre casi completi</b>: il <b>nominativo</b> (soggetto, già visto), il <b>prepositivo</b> (dove sono) e l'<b>accusativo</b> (oggetto, direzione), più alcuni blocchi di genitivo, dativo e strumentale.</p>
${PRON_SHORT}
<h3>1. Prepositivo singolare: dove? o di che cosa?</h3>
<p>Si usa dopo <b>в</b> (dentro), <b>на</b> (sopra, in un luogo aperto o evento) e <b>о/об</b> (di, su). Risponde a <b>где?</b> [GDIE] (dove?). Desinenza: <b>-е</b> per maschili duri, femminili in -а/-я e neutri; <b>-и</b> per nomi in -ия/-ие/-ий (<b>в санато́рии</b> [f sa-na-TO-ri-i]) e per i femminili in -ь (i maschili in -ь prendono -е: <b>в словаре́</b> [f sla-va-RIE] (nel dizionario)).</p>
<table><tr><th>Nominativo</th><th>Prepositivo</th><th>Pronuncia</th></tr>
<tr><td>дом</td><td>в до́ме</td><td>[v DO-mie]</td></tr>
<tr><td>Москва́</td><td>в Москве́</td><td>[v mas-KVIE]</td></tr>
<tr><td>Рим</td><td>в Ри́ме</td><td>[v RI-mie]</td></tr>
<tr><td>шко́ла</td><td>в шко́ле</td><td>[f SHKO-lie]</td></tr>
<tr><td>кварти́ра</td><td>в кварти́ре</td><td>[f kvar-TI-rie]</td></tr>
<tr><td>Ита́лия</td><td>в Ита́лии</td><td>[v i-TA-li-i]</td></tr>
<tr><td>Росси́я</td><td>в Росси́и</td><td>[v ra-SSI-i]</td></tr>
<tr><td>тетра́дь</td><td>в тетра́ди</td><td>[f ti-TRA-di]</td></tr>
<tr><td>рабо́та</td><td>на рабо́те</td><td>[na ra-BO-tie]</td></tr>
<tr><td>вокза́л</td><td>на вокза́ле</td><td>[na vak-ZA-lie]</td></tr>
<tr><td>у́лица</td><td>на у́лице</td><td>[na U-li-tsy]</td></tr>
<tr><td>по́чта</td><td>на по́чте</td><td>[na POC-tie]</td></tr>
</table>
<p><b>В o на?</b> Non c'è una regola logica: impara le coppie. <b>В</b> con spazi chiusi e paesi/città (в шко́ле, в Росси́и, в Ри́ме, в магази́не); <b>на</b> con luoghi aperti, eventi, superfici e con parole come рабо́та, вокза́л, по́чта, у́лица, ку́хня (<b>на ку́хне</b> [na KUH-nie]). Alcuni maschili hanno il prepositivo in <b>-у́</b> accentata: <b>в аэропорту́</b> [v a-e-ra-par-TU], <b>в саду́</b> [f sa-DU], <b>в лесу́</b> [v li-SU], <b>на мосту́</b> [na mas-TU].</p>
<p><b>Con l'aggettivo</b>: masc./neutro <b>-ом/-ем</b>, femminile <b>-ой/-ей</b>: <b>в но́вом до́ме</b> [v NO-vam DO-mie], <b>в но́вой кварти́ре</b> [v NO-vai kvar-TI-rie], <b>в большо́м го́роде</b> [v bal'-SHOM GO-ra-die]. <b>О</b> (<b>об</b> davanti a vocale) introduce l'argomento: <b>Я ду́маю о рабо́те.</b> [ia DU-ma-iu a ra-BO-tie] (penso al lavoro), <b>Мы говори́м об Ита́лии.</b> [my ga-va-RIM ab i-TA-li-i] (parliamo dell'Italia).</p>
<h3>2. Accusativo singolare: l'oggetto diretto</h3>
<p>Risponde a <b>кого́? что?</b> (chi? che cosa?).</p>
<ul><li><b>femminili in -а/-я</b> → <b>-у/-ю</b>: <b>кни́га → кни́гу</b> [KNI-gu], <b>сестра́ → сестру́</b> [sis-TRU], <b>неде́ля → неде́лю</b> [ni-DIE-liu], <b>Ита́лия → Ита́лию</b> [i-TA-li-iu].</li><li><b>maschili inanimati</b> e <b>neutri</b> restano uguali al nominativo: <b>Я ви́жу дом.</b> [ia VI-zhu DOM] (vedo la casa), <b>Я ви́жу окно́.</b> [ia VI-zhu ak-NO].</li><li><b>maschili animati</b> (persone, animali) prendono la forma del genitivo (-а/-я): <b>Я ви́жу бра́та.</b> [ia VI-zhu BRA-ta], <b>Я люблю́ Ива́на.</b> [ia liub-LIU i-VA-na]. I maschili in -а/-я (<b>па́па</b>, <b>де́душка</b>) seguono le femminili: <b>Я зна́ю па́пу.</b> [ia ZNA-iu PA-pu].</li><li><b>femminili in -ь</b> restano uguali: <b>Я ви́жу дверь.</b> [ia VI-zhu DVIER']. Al plurale gli inanimati sono uguali al nominativo.</li></ul>
<p>Gli aggettivi femminili all'accusativo prendono <b>-ую / -юю</b>: <b>но́вая кни́га → но́вую кни́гу</b> [NO-vu-iu KNI-gu], <b>интере́сная → интере́сную</b> [in-ti-RIES-nu-iu]. I maschili inanimati restano uguali (<b>но́вый дом</b>).</p>
<p>Pronomi all'accusativo: <b>меня́</b> [mi-NIA] (me), <b>тебя́</b> [ti-BIA] (te), <b>его́</b> [i-VO] (lui), <b>её</b> [i-IO] (lei), <b>нас</b> [NAS], <b>вас</b> [VAS], <b>их</b> [IH]. <b>Я люблю́ тебя́.</b> [ia liub-LIU ti-BIA]; <b>Я зна́ю её.</b> [ia ZNA-iu i-IO]. L'ordine più neutro nel parlato è <b>Я тебя́ люблю́.</b> [ia ti-BIA liub-LIU]. Con una preposizione i pronomi di terza persona ricevono н-: <b>с ним</b>, <b>для неё</b>.</p>
<h3>3. Verso dove? в/на + accusativo</h3>
<p><b>Куда́?</b> [ku-DA] (verso dove?) vuole <b>в</b> o <b>на</b> + <b>accusativo</b>; <b>где?</b> vuole il <b>prepositivo</b>: <b>Где ты?</b> [GDIE ty] — <b>Я в шко́ле.</b> [ia f SHKO-lie]. <b>Куда́ ты идёшь?</b> [ku-DA ty i-DIOSH] — <b>Я иду́ в шко́лу.</b> [ia i-DU f SHKO-lu]. Altri esempi: <b>на рабо́ту</b> [na ra-BO-tu] (al lavoro), <b>в Москву́</b> [v mas-KVU], <b>в Рим</b> [v RIM]. «A casa» (direzione) è <b>домо́й</b> [da-MOI], «a casa» (stato) è <b>до́ма</b> [DO-ma].</p>
<p>Verbi tipici con accusativo: <b>чита́ть</b>, <b>люби́ть</b>, <b>ви́деть</b> [VI-dit'], <b>знать</b>, <b>пить</b>, <b>есть</b>: <b>Я пью во́ду.</b> [ia PIU VO-du] (bevo l'acqua), <b>Я чита́ю кни́гу.</b> [ia ci-TA-iu KNI-gu].</p>
<h3>4. Strumentale: con chi? (solo blocchi con «с»)</h3>
<p>Lo strumentale risponde a <b>с кем? с чем?</b> [s KIEM, s CEM] (con chi? con che cosa?). Per ora impara i blocchi con <b>с</b> («con»). Terminazioni: maschile e neutro <b>-ом</b> (<b>-ем</b> dopo consonante morbida o ж ш ч щ ц quando l'accento non cade sulla desinenza: <b>с учи́телем</b>, ma <b>с врачо́м</b>), femminile <b>-ой</b> (<b>-ей</b>).</p>
<ul><li><b>с дру́гом</b> [z DRU-gam] (con un amico), <b>с ма́мой</b> [s MA-mai] (con la mamma), <b>с сестро́й</b> [s sis-TROI] (con la sorella). La с si dice [z] davanti a consonante sonora.</li><li><b>ко́фе с молоко́м</b> [KO-fie s ma-la-KOM] (caffè con latte), <b>чай с лимо́ном</b> [CIAI s li-MO-nam] (tè al limone).</li><li><b>Я живу́ с семьёй.</b> [ia zhy-VU s sim'-IOI] (vivo con la famiglia); <b>С кем ты идёшь?</b> [s KIEM ty i-DIOSH] (con chi vai?).</li><li><b>занима́ться</b> + strumentale: <b>Я занима́юсь спо́ртом.</b> [ia za-ni-MA-ius' SPOR-tam] (faccio sport), <b>занима́ться му́зыкой</b> [za-ni-MA-tsa MU-zy-kai] (fare musica).</li><li><b>рабо́тать</b> + professione: <b>Он рабо́тает врачо́м.</b> [ON ra-BO-ta-it vra-CIOM] (fa il medico); <b>Кем вы рабо́таете?</b> [KIEM vy ra-BO-ta-i-tie] (che lavoro fa?).</li></ul>
<h3>Trappole italiane</h3>
<ul><li>«A Roma» = <b>в Ри́ме</b> (stato) e <b>в Рим</b> (moto): in italiano «a» vale per entrambi, in russo cambia il caso.</li><li>Maschile animato: <b>Я ви́жу бра́та</b>, ma <b>Я ви́жу дом</b>. L'animatezza è una regola vera, non un'eccezione.</li><li>I pronomi complemento non hanno forme atone: «mi vede» = <b>он ви́дит меня́</b> (verbo + pronome pieno).</li></ul>
<h3>In sintesi</h3>
<p>Dove? (где) → в/на + prepositivo (в до́ме, на рабо́те). Verso dove? (куда́) → в/на + accusativo (в шко́лу, на рабо́ту). Oggetto: -а → -у, -я → -ю; maschile animato come il genitivo; inanimato uguale al nominativo. Con chi? с + strumentale (с дру́гом, ко́фе с молоко́м).</p>
<div class="say"><b>Da dire.</b> «Я живу́ в Ри́ме. Сего́дня я иду́ на рабо́ту.» [ia zhy-VU v RI-mie. si-VOD-nia ia i-DU na ra-BO-tu]</div>`,
  [
    q(
      'q1',
      `Come si dice «Sono a Mosca»?`,
      [`Я в Москве́.`, `Я в Москву́.`, `Я в Москва́.`, `Я в Москвы́.`],
      0,
      `Per lo stato in luogo si usa il prepositivo: Москва́ diventa Москве́. La forma Москву́ indica il moto.`,
    ),
    q(
      'q2',
      `Come si dice «Vado a scuola»?`,
      [`Я иду́ в шко́лу.`, `Я иду́ в шко́ле.`, `Я иду́ шко́ла.`, `Я иду́ на шко́ле.`],
      0,
      `Con куда́ (verso dove) si usa в + accusativo: шко́ла diventa шко́лу.`,
    ),
    q(
      'q3',
      `Qual è l'accusativo di «кни́га»?`,
      [`кни́гу`, `кни́ге`, `кни́ги`, `кни́гой`],
      0,
      `I femminili in -а prendono -у all'accusativo: кни́га diventa кни́гу, oggetto di Я чита́ю.`,
    ),
    q(
      'q4',
      `Come si dice «alla stazione» (stato in luogo) con вокза́л?`,
      [`на вокза́ле`, `в вокза́ле`, `на вокза́л`, `в вокза́л`],
      0,
      `Вокза́л vuole на e il prepositivo: на вокза́ле. La scelta в o на va memorizzata per ogni parola.`,
    ),
    q(
      'q5',
      `Come si dice «Vedo mio fratello» (брат, animato)?`,
      [`Я ви́жу бра́та.`, `Я ви́жу брат.`, `Я ви́жу бра́ту.`, `Я ви́жу бра́те.`],
      0,
      `I maschili animati usano all'accusativo la forma del genitivo (-а): бра́та. Per cose inanimate resta uguale.`,
    ),
    q(
      'q6',
      `Quale parola interrogativa si usa con un moto (dove vai)?`,
      [`куда́`, `где`, `почему́`, `когда́`],
      0,
      `Куда́ chiede la direzione e vuole l'accusativo; где chiede lo stato in luogo e vuole il prepositivo.`,
    ),
    q(
      'q7',
      `Come si dice «nella casa nuova» (дом)?`,
      [`в но́вом до́ме`, `в но́вой до́ме`, `в но́вый дом`, `в но́вом дом`],
      0,
      `Дом è maschile: sia l'aggettivo (-ом) sia il nome (-е) hanno la desinenza del prepositivo maschile.`,
    ),
    q(
      'q8',
      `Quale frase significa «Ti amo»?`,
      [`Я люблю́ тебя́.`, `Я люблю́ ты.`, `Я лю́бит тебя́.`, `Я тебя́ люблю́ ты.`],
      0,
      `Il pronome complemento «te» è тебя́ all'accusativo; ты è solo il soggetto.`,
    ),
    q(
      'q9',
      `Come si dice «con un amico»?`,
      [`с дру́гом`, `с друг`, `с дру́га`, `с дру́гу`],
      0,
      `Dopo с («con») il nome va allo strumentale: i maschili prendono -ом, quindi с дру́гом.`,
    ),
    q(
      'q10',
      `Come si dice «con il latte» (молоко́)?`,
      [`с молоко́м`, `с молоко́й`, `с молоко́ем`, `с молоко́`],
      0,
      `I neutri allo strumentale prendono -ом come i maschili: ко́фе с молоко́м; -ой è la desinenza dei femminili.`,
    ),
  ],
  [
    card(
      'c1',
      `Prepositivo`,
      `Dopo в, на, о: -е (в до́ме, в шко́ле), -и per -ия/-ь (в Ита́лии, в тетра́ди). В аэропорту́, в саду́: -у́.`,
    ),
    card('c2', `В o на?`, `в: spazi chiusi, città, paesi. на: luoghi aperti, eventi, рабо́та, вокза́л, по́чта, у́лица.`),
    card('c3', `Accusativo f`, `-а → -у, -я → -ю: кни́гу, сестру́, неде́лю. Femminile in -ь invariato.`),
    card('c4', `Accusativo m`, `Inanimato = nominativo: ви́жу дом. Animato = genitivo: ви́жу бра́та.`),
    card('c5', `Где / куда́`, `где? + prepositivo (Я в шко́ле). куда́? + в/на + accusativo (Я иду́ в шко́лу).`),
    card('c6', `Pronomi accusativo`, `меня́, тебя́, его́, её, нас, вас, их. Я люблю́ тебя́.`),
    card('c7', `О / об`, `Argomento + prepositivo: о рабо́те, об Ита́лии (об davanti a vocale).`),
    card('c8', `Домо́й / до́ма`, `домо́й = a casa (moto); до́ма = a casa (stato).`),
    card('c9', `С + strumentale`, `с дру́гом, с ма́мой, ко́фе с молоко́м, чай с лимо́ном. Domanda: с кем? с чем?`),
    card('c10', `Strumentale con verbi`, `занима́ться спо́ртом / му́зыкой; рабо́тать врачо́м. Кем вы рабо́таете?`),
  ],
  [
    prac(
      `p1`,
      `Metti al prepositivo con в o на: шко́ла, вокза́л, Москва́, Ита́лия.`,
      `в шко́ле [f SHKO-lie]; на вокза́ле [na vak-ZA-lie]; в Москве́ [v mas-KVIE]; в Ита́лии [v i-TA-li-i].`,
    ),
    prac(
      `p2`,
      `Metti all'accusativo: кни́га, сестра́, дом, брат (animato).`,
      `кни́гу; сестру́; дом (invariato); бра́та (come il genitivo).`,
    ),
    prac(
      `p3`,
      `Scrivi due risposte: Где ты? e Куда́ ты идёшь? (scuola).`,
      `Я в шко́ле. [ia f SHKO-lie] — Я иду́ в шко́лу. [ia i-DU f SHKO-lu]. Stato = prepositivo, moto = accusativo.`,
    ),
    prac(
      `p4`,
      `Traduci: «Vedo il museo», «Conosco Marco», «Amo l'Italia».`,
      `Я ви́жу музе́й. [ia VI-zhu mu-ZIEI] — Я зна́ю Ма́рко. [ia ZNA-iu MAR-ka] — Я люблю́ Ита́лию. [ia liub-LIU i-TA-li-iu]. Музе́й inanimato resta invariato.`,
    ),
    prac(
      `p5`,
      `Traduci «Penso al lavoro» e «Parliamo dell'Italia».`,
      `Я ду́маю о рабо́те. [ia DU-ma-iu a ra-BO-tie] — Мы говори́м об Ита́лии. [my ga-va-RIM ab i-TA-li-i]. О + prepositivo; об davanti a vocale.`,
    ),
    prac(
      `p6`,
      `Traduci: «Vivo con un amico», «Caffè con latte, per favore», «Faccio sport».`,
      `Я живу́ с дру́гом. [ia zhy-VU z DRU-gam] — Ко́фе с молоко́м, пожа́луйста. [KO-fie s ma-la-KOM pa-ZHA-lus-ta] — Я занима́юсь спо́ртом. [ia za-ni-MA-ius' SPOR-tam].`,
    ),
  ],
)

export const russoA2: CourseModule[] = [ruNomi, ruAggettivi, ruPresente, ruCasi1]
