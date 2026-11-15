import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_FULL, PRON_SHORT } from './pron'
import { ruNomi, ruAggettivi, ruPresente, ruCasi1 } from './a.2'
import { ruDomande, ruPassato, ruMoto } from './a.3'

// Russian course, group A1 (11 modules), for an Italian speaker. Text only, offline.
//
// PRONUNCIATION CONVENTION (the same in every module; ru-pron explains it, the course intro recalls it): see pron.ts.
//   Every Russian word of 2+ syllables carries an acute stress mark (combining U+0301) in this course, although
//   normal Russian texts do not print it. The respelling [ ] is checked mechanically by respell.test.ts.
//
// CLAIMS THE AUTHOR IS NOT FULLY SURE ABOUT (reviewers: please check):
//   1. Handwritten (cursive) shapes: и like u, т like m, д like g, ш like w with a base line.
//   2. TORFL/TEU A1 format and pass threshold (66% per subtest) are indicative: check the official site.
//   3. The respelling of unstressed vowels (ikanie, final -е/-я = ie/ia) is a simplification of real [ɪ]/[ə].
//   4. Words where the stress was double-checked: ме́дленно, ма́ленький, пятьдеся́т, шестьдеся́т, се́мьдесят, во́семьдесят.

export const ruAlfabeto = mod(
  'ru-alfabeto',
  'L’alfabeto cirillico',
  'Le 33 lettere: quelle uguali al latino, i falsi amici (В Н Р С У Х), le lettere nuove, scrittura a mano',
  'a1',
  `<p class="lead">L'alfabeto russo ha 33 lettere e si impara in un paio di giorni: molte le conosci già. Il lavoro vero è <b>dimenticare</b> il suono latino di sei lettere che sembrano italiane ma non lo sono (<b>В Н Р С У Х</b>). Dopo il primo giorno leggerai già parole come <b>банк</b>, <b>парк</b>, <b>такси́</b>, <b>метро́</b>.</p>
<h3>Come leggere le trascrizioni (in tutto il corso)</h3>
<p>Ogni parola russa è scritta in cirillico <b>con l'accento tonico</b> (un accento acuto sulla vocale accentata, che nei testi normali non si stampa), poi la pronuncia tra parentesi quadre con lettere italiane, sillabe separate da «-» e <b>sillaba accentata in MAIUSCOLO</b>: <b>молоко́</b> [ma-la-KO]. La legenda completa è nel modulo successivo; qui i segni che servono subito: <b>sh</b> = ш (come «sc» di <i>scena</i>), <b>zh</b> = ж (j francese), <b>ts</b> = ц, <b>c</b> = ч (come in <i>ciao</i>), <b>h</b> = х (raschiata), <b>y</b> = ы.</p>
<h3>1. Lettere uguali al latino, suono uguale</h3>
<p><b>А а, К к, М м, О о, Т т</b> hanno la stessa forma e (quasi) lo stesso suono dell'italiano: <b>ма́ма</b> [MA-ma], <b>кот</b> [KOT] (gatto maschio), <b>там</b> [TAM] (là), <b>кто</b> [KTO] (chi), <b>мо́ре</b> [MO-rie].</p>
<h3>2. Lettere «ingannevoli»: sembrano latine, suonano diverse</h3>
<table><tr><th>Lettera</th><th>Si legge</th><th>Esempi</th></tr>
<tr><td>В в</td><td><b>v</b> (non «b»)</td><td>вода́ [va-DA] (acqua), ва́за [VA-za]</td></tr>
<tr><td>Н н</td><td><b>n</b> (non «h»)</td><td>нос [NOS] (naso), но [NO] (ma)</td></tr>
<tr><td>Р р</td><td><b>r</b> vibrata (non «p»)</td><td>рот [ROT] (bocca), ро́за [RO-za]</td></tr>
<tr><td>С с</td><td><b>s</b> (non «c»)</td><td>суп [SUP], сон [SON] (sonno, sogno)</td></tr>
<tr><td>У у</td><td><b>u</b> (non «y»)</td><td>у́хо [U-ha] (orecchio), стул [STUL] (sedia)</td></tr>
<tr><td>Х х</td><td><b>h</b> raschiata come la jota spagnola (non «x»)</td><td>хлеб [HLIEP] (pane), хорошо́ [ha-ra-SHO]</td></tr>
</table>
<p><b>Trappola italiana</b>: se leggi «нос» come «hoc» o «рот» come «pot» hai applicato l'alfabeto latino. Ripeti: <b>Н = n, Р = r, С = s, В = v, У = u, Х = h</b>. La parola <b>Росси́я</b> [ra-SSI-ia] si scrive quindi con la «P» che sembra una p e si legge r.</p>
<h3>3. Lettere nuove con suoni che già conosci</h3>
<table><tr><th>Lettera</th><th>Suono</th><th>Esempio</th></tr>
<tr><td>Б б</td><td>b</td><td>брат [BRAT] (fratello)</td></tr>
<tr><td>Г г</td><td>g (gatto; «gh» davanti a e, i)</td><td>го́род [GO-rat] (città)</td></tr>
<tr><td>Д д</td><td>d</td><td>дом [DOM] (casa), да [DA] (sì)</td></tr>
<tr><td>Ж ж</td><td>zh, la «j» francese di <i>jour</i></td><td>жена́ [zhy-NA] (moglie)</td></tr>
<tr><td>З з</td><td>z, la «s» sonora di <i>rosa</i></td><td>зима́ [zi-MA] (inverno)</td></tr>
<tr><td>И и</td><td>i</td><td>и́мя [I-mia] (nome)</td></tr>
<tr><td>Й й</td><td>i breve (semivocale, come in <i>mai</i>)</td><td>чай [CIAI], май [MAI]</td></tr>
<tr><td>Л л</td><td>l</td><td>лимо́н [li-MON]</td></tr>
<tr><td>П п</td><td>p</td><td>па́па [PA-pa]</td></tr>
<tr><td>Ф ф</td><td>f</td><td>футбо́л [fud-BOL]</td></tr>
<tr><td>Ц ц</td><td>ts, come la «z» di <i>zio</i></td><td>цирк [TSYRK] (circo)</td></tr>
<tr><td>Ч ч</td><td>c di <i>ciao</i>, sempre morbida</td><td>чай [CIAI] (tè), час [CIAS] (ora)</td></tr>
<tr><td>Ш ш</td><td>sh, come «sc» di <i>scena</i>, sempre dura</td><td>шко́ла [SHKO-la] (scuola)</td></tr>
<tr><td>Щ щ</td><td>shsh, una «sc» lunga e morbida</td><td>борщ [BORSHSH] (zuppa di barbabietola)</td></tr>
<tr><td>Э э</td><td>e aperta (come in <i>era</i>)</td><td>э́то [E-ta] (questo è)</td></tr>
<tr><td>Ы ы</td><td>y: una «i» detta con la lingua indietro (vedi modulo successivo)</td><td>сын [SYN] (figlio), мы [MY] (noi)</td></tr>
<tr><td>Ь ь, Ъ ъ</td><td>segni, senza suono: ь ammorbidisce la consonante prima, ъ separa</td><td>мать [MAT'] (madre), подъе́зд [pad-IEST] (ingresso)</td></tr>
</table>
<h3>4. Le cinque vocali «dure» e le cinque «morbide»</h3>
<p>Le vocali russe vengono in coppie: la seconda lettera di ogni coppia fa capire che la consonante prima è <b>morbida</b> e, a inizio parola o dopo un'altra vocale, aggiunge un suono «i» davanti.</p>
<table><tr><th>Dura</th><th>Morbida</th><th>Esempio</th></tr>
<tr><td>а [a]</td><td>я [ia]</td><td>я́блоко [IA-bla-ka] (mela), мя́со [MIA-ssa] (carne)</td></tr>
<tr><td>э [e]</td><td>е [ie]</td><td>нет [NIET] (no), ме́сто [MIES-ta] (posto)</td></tr>
<tr><td>о [o]</td><td>ё [io]</td><td>ёлка [IOL-ka] (abete), лёд [LIOT] (ghiaccio)</td></tr>
<tr><td>у [u]</td><td>ю [iu]</td><td>ю́бка [IUP-ka] (gonna), лю́ди [LIU-di]</td></tr>
<tr><td>ы [y]</td><td>и [i]</td><td>мы [MY], мир [MIR]</td></tr>
</table>
<p>Nei testi normali la <b>ё</b> si scrive spesso come «е», senza i due puntini; in questo corso la vedi sempre, ed è <b>sempre accentata</b>: per questo non porta il segno d'accento.</p>
<h3>Scrittura a mano (corsivo)</h3>
<p>Il russo scritto a mano ha forme diverse dallo stampatello. Le tre più insidiose: <b>и</b> scritta come una «u», <b>т</b> scritta come una «m» (spesso con una lineetta sopra), <b>д</b> scritta come una «g» corsiva. Spesso la <b>ш</b> riceve una riga alla base (e la <b>т</b> una riga sopra), per distinguerle da «w» e «m»: è una convenzione scolastica diffusa, non obbligatoria. Se vedi parole «strane» in una foto di un menù o di un biglietto scritto a mano, controlla prima queste forme.</p>
<h3>Parole che sai già leggere</h3>
<ul><li><b>банк</b> [BANK], <b>парк</b> [PARK], <b>такси́</b> [tak-SI], <b>метро́</b> [mit-RO], <b>рестора́н</b> [ris-ta-RAN].</li><li><b>футбо́л</b> [fud-BOL], <b>му́зыка</b> [MU-zy-ka], <b>интерне́т</b> [in-ter-NET], <b>су́пер</b> [SU-per].</li></ul>
<p>Nei prestiti come интерне́т e су́пер la consonante prima della <b>е</b> resta dura: si legge «ter», «per», senza la «i» di [ie].</p>
<h3>In sintesi</h3>
<p>Impara per gruppi: 5 lettere uguali, 6 «false amiche» (В Н Р С У Х), le lettere nuove, le vocali in coppie dure/morbide. Leggi ad alta voce ogni parola sillaba per sillaba: nei primi giorni basta questo per fissare l'alfabeto. L'accento tonico non è scritto nei testi russi: in questo corso lo trovi sempre, perché la vocale accentata cambia il suono di tutta la parola.</p>
<div class="say"><b>Da leggere.</b> «Ма́ма, па́па, дом, кот, нос, рот.» [MA-ma PA-pa DOM KOT NOS ROT]</div>`,
  [
    q(
      'q1',
      'Come si legge la parola «нос» (naso)?',
      ['[NOS]', '[HOS]', '[POS]', '[NOC]'],
      0,
      'La lettera Н russa vale n, non h: la parola si legge come «nos» e significa naso, ciò che si vede nel cirillico.',
    ),
    q(
      'q2',
      'Quale lettera cirillica suona come la «v» italiana?',
      ['В', 'Б', 'Р', 'Н'],
      0,
      'La В cirillica sembra una b latina ma si legge v: вода́ [va-DA] è acqua, mentre la b è la lettera Б.',
    ),
    q(
      'q3',
      'Che suono ha la lettera Р?',
      ['una r vibrata', 'una p', 'una b', 'una h aspirata'],
      0,
      'La Р sembra una p latina ma è la r: рот [ROT] significa bocca, non «pot» come verrebbe da leggere.',
    ),
    q(
      'q4',
      'Quale lettera rappresenta una «i» detta con la lingua tirata indietro?',
      ['ы', 'и', 'й', 'ь'],
      0,
      'La ы è una vocale propria del russo, diversa da и: si trova in мы, ты, сын e non esiste in italiano.',
    ),
    q(
      'q5',
      'Che cosa fa il segno ь (segno molle)?',
      [
        'ammorbidisce la consonante prima',
        'si legge come una i breve',
        'raddoppia la consonante prima',
        'cambia la vocale seguente in ы',
      ],
      0,
      `Il ь non ha suono proprio: rende morbida la consonante che lo precede, come in мать [MAT'] (madre) contro мат.`,
    ),
    q(
      'q6',
      'Come si legge «хлеб» (pane)?',
      ['[HLIEP]', '[KLEB]', '[XLEB]', '[SLEB]'],
      0,
      'La х è una h raschiata, la е dopo l è «ie», e la b finale diventa p per assordimento: хлеб [HLIEP].',
    ),
    q(
      'q7',
      'Quale lettera ha lo stesso aspetto e lo stesso suono della lettera latina?',
      ['К', 'Н', 'Р', 'С'],
      0,
      'Solo la К ha lo stesso suono k della latina; Н, Р e С sono false amiche che leggono n, r e s.',
    ),
    q(
      'q8',
      'In corsivo a mano, quale lettera cirillica viene scritta come una «m»?',
      ['т', 'п', 'ш', 'д'],
      0,
      'Nello scritto a mano la т somiglia a una m minuscola, per questo conviene saperlo prima di leggere un biglietto.',
    ),
  ],
  [
    card(
      'c1',
      'False amiche',
      'В = v, Н = n, Р = r, С = s, У = u, Х = h (raschiata). Sembrano latine ma suonano diverse: нос [NOS], рот [ROT], вода́ [va-DA].',
    ),
    card(
      'c2',
      'Lettere uguali',
      'А, К, М, О, Т = stessa forma e suono dell’italiano: ма́ма [MA-ma], кот [KOT], там [TAM].',
    ),
    card(
      'c3',
      'Ж ш щ ц ч',
      'ж = zh (jour), ш = sh (scena), щ = shsh (sc lunga morbida), ц = ts (zio), ч = c (ciao). Ж, ш, ц sono sempre dure; ч, щ sempre morbide.',
    ),
    card('c4', 'Ы ы', 'Una i detta con la lingua indietro: мы [MY], сын [SYN], ры́ба [RY-ba]. Non è и.'),
    card(
      'c5',
      'Coppie di vocali',
      'а-я, э-е, о-ё, у-ю, ы-и: la seconda è morbida e dopo vocale o a inizio parola aggiunge «i»: я [ia], е [ie], ё [io], ю [iu].',
    ),
    card(
      'c6',
      'Ь e Ъ',
      `ь = segno molle (consonante morbida): мать [MAT']; ъ = segno duro (separa): подъе́зд [pad-IEST]. Nessun suono proprio.`,
    ),
    card(
      'c7',
      'Ё',
      'Si legge «io» dopo consonante e porta sempre l’accento, per questo non ha accento scritto: ёлка [IOL-ka].',
    ),
    card(
      'c8',
      'Corsivo',
      'Scritto a mano: и come «u», т come «m», д come «g»; spesso ш con una riga alla base e т con una riga sopra (convenzione scolastica, non obbligatoria). Occhio a queste forme nei biglietti scritti a mano.',
    ),
    card(
      'c9',
      'Accento tonico',
      'Non è scritto nei testi russi normali. In questo corso ogni parola di 2+ sillabe ha l’accento acuto sulla vocale tonica: молоко́.',
    ),
  ],
  [
    prac(
      'p1',
      'Leggi ad alta voce e scrivi la pronuncia: нос, рот, суп, хлеб, вода́, дом.',
      'нос [NOS], рот [ROT], суп [SUP], хлеб [HLIEP], вода́ [va-DA], дом [DOM]. Н = n, Р = r, С = s, В = v, Х = h; la b di хлеб a fine parola suona p.',
    ),
    prac(
      'p2',
      'Quali lettere russe sono «false amiche» di quelle latine? Scrivile con il loro suono.',
      'В = v, Н = n, Р = r, С = s, У = u, Х = h (raschiata). Le lettere А К М О Т sono uguali al latino anche nel suono.',
    ),
    prac(
      'p3',
      'Leggi queste parole internazionali e di’ il significato: банк, парк, такси́, метро́, футбо́л, интерне́т.',
      'banca [BANK], parco [PARK], taxi [tak-SI], metropolitana [mit-RO], calcio [fud-BOL], internet [in-ter-NET].',
    ),
    prac(
      'p4',
      'Spiega la differenza tra я [ia], е [ie], ё [io], ю [iu] e le vocali а, э, о, у.',
      'я, е, ё, ю sono le vocali «morbide» di а, э, о, у: dopo una consonante la ammorbidiscono, a inizio parola aggiungono un suono «i» davanti. Esempi: мя́со [MIA-ssa], нет [NIET], лёд [LIOT], ю́бка [IUP-ka].',
    ),
    prac(
      'p5',
      'Scrivi con le lettere italiane la pronuncia di: шко́ла, цирк, чай, жена́.',
      'шко́ла [SHKO-la] (sh = sc di scena); цирк [TSYRK] (ts, ы dopo ц); чай [CIAI]; жена́ [zhy-NA] (zh = j francese, e atona dopo ж diventa y).',
    ),
  ],
)

export const ruPron = mod(
  'ru-pron',
  `Pronuncia: accento, riduzione delle vocali, consonanti dure e morbide`,
  `Accento libero, о→а, ь e ъ, ы, assordimento finale, ж ш щ ц ч, intonazione di frase e domanda`,
  'a1',
  `<p class="lead">Il russo si scrive in modo abbastanza regolare, ma la <b>vocale accentata</b> decide come suonano tutte le altre. Le tre cose da imparare subito: <b>l'accento cade dove vuole</b> (e va memorizzato con la parola), le <b>vocali atone si indeboliscono</b> (о diventa «a») e ogni consonante è <b>dura o morbida</b>.</p>
<h3>Legenda delle trascrizioni (valida per tutto il corso)</h3>
${PRON_FULL}
<table><tr><th>Segno</th><th>Si legge</th><th>Esempio</th></tr>
<tr><td>sh</td><td>ш, «sc» di <i>scena</i></td><td>шко́ла [SHKO-la]</td></tr>
<tr><td>zh</td><td>ж, «j» francese di <i>jour</i></td><td>жена́ [zhy-NA]</td></tr>
<tr><td>shsh</td><td>щ, «sc» lunga e morbida</td><td>ещё [i-SHSHO]</td></tr>
<tr><td>ts</td><td>ц, come «z» di <i>zio</i></td><td>цена́ [tsy-NA]</td></tr>
<tr><td>c / ci</td><td>ч come l'italiano: «c» davanti a e, i; «ci» davanti a a, o, u</td><td>чем [CEM], чай [CIAI], чёрный [CIOR-nyi]</td></tr>
<tr><td>h</td><td>х, «h» raschiata</td><td>хлеб [HLIEP]</td></tr>
<tr><td>y</td><td>ы</td><td>мы [MY]</td></tr>
<tr><td>'</td><td>ь: consonante morbida</td><td>мать [MAT']</td></tr>
<tr><td>ia ie iu io</td><td>я е ю ё dopo consonante: morbida + vocale</td><td>мя́со [MIA-ssa], нет [NIET]</td></tr>
<tr><td>'-ia, '-ie</td><td>ь + vocale: consonante morbida e nuova sillaba</td><td>семья́ [sim'-IA], бра́тья [BRAT'-ia]</td></tr>
<tr><td>y dopo ж ш ц</td><td>е/и atone dopo ж, ш, ц = ы</td><td>мо́жет [MO-zhyt], цена́ [tsy-NA]</td></tr>
<tr><td>tsa</td><td>-ться e -тся</td><td>учи́ться [u-CI-tsa]</td></tr>
<tr><td>ss, z</td><td>s sorda tra vocali; s sonora (rosa)</td><td>спаси́бо [spa-SSI-ba], зима́ [zi-MA]</td></tr>
</table>
<h3>1. L'accento russo è libero e mobile</h3>
<p>In italiano l'accento cade quasi sempre sulle ultime sillabe e si sente. In russo può cadere su <b>qualsiasi sillaba</b> e può spostarsi tra forme della stessa parola: <b>вода́</b> [va-DA], ma <b>во́ду</b> [VO-du] (acqua, complemento). Nessuna regola: si impara <b>parola e accento insieme</b>, come in spagnolo si impara el género. Alcune coppie cambiano significato solo con l'accento: <b>за́мок</b> [ZA-mak] (castello) e <b>замо́к</b> [za-MOK] (serratura); <b>мука́</b> [mu-KA] (farina) e <b>му́ка</b> [MU-ka] (tormento). Nei testi russi l'accento non è scritto: in questo corso c'è sempre, ma abituati a ripetere la parola intera ad alta voce.</p>
<h3>2. Riduzione delle vocali: l'akanie e l'ikanie</h3>
<p>Solo la vocale accentata è piena; le altre si indeboliscono, e più sono lontane dall'accento più sono deboli.</p>
<ul><li><b>о atona diventa «a»</b> (akanie): <b>молоко́</b> [ma-la-KO], <b>хорошо́</b> [ha-ra-SHO], <b>Москва́</b> [mas-KVA], <b>окно́</b> [ak-NO] (finestra). Si scrive о, si dice «a».</li><li><b>е e я atone diventano «i»</b> (ikanie): <b>река́</b> [ri-KA] (fiume), <b>язы́к</b> [i-ZYK] (lingua), <b>пять</b> [PIAT'] (cinque; accentata, quindi senza riduzione: serve da contrasto), <b>де́сять</b> [DIE-sit'] (dieci). In fine di parola e/я atone diventano deboli «ie/ia»: <b>мо́ре</b> [MO-rie], <b>неде́ля</b> [ni-DIE-lia] (settimana).</li><li>Dopo <b>ж, ш, ц</b> una е atona suona come ы: <b>жена́</b> [zhy-NA], <b>цена́</b> [tsy-NA] (prezzo), <b>шесто́й</b> [shys-TOI] (sesto).</li><li><b>а</b> atona dopo consonante dura è una a breve (<b>кварти́ра</b> [kvar-TI-ra]); dopo <b>ч, щ</b> e dopo consonante morbida suona <b>i</b>: <b>часа́</b> [ci-SA] (genitivo di «ora»), <b>часы́</b> [ci-SY] (orologio). Le altre vocali atone (у, ы, и, э) cambiano poco, ma tutte durano meno della vocale accentata.</li></ul>
<p><b>Trappola italiana</b>: in italiano pronunci ogni vocale piena. Se dici [mo-lo-KO] ti capiscono, ma suoni da straniero; il ritmo giusto è [ma-la-KO], con la sillaba accentata più lunga e più alta.</p>
<h3>3. Consonanti dure e morbide</h3>
<p>Quasi tutte le consonanti russe hanno una versione <b>dura</b> e una <b>morbida</b> (palatalizzata: la lingua si alza verso il palato, come in italiano «gn» o «gli»). La morbidezza si legge dalla lettera dopo: <b>я, е, ё, ю, и, ь</b> ammorbidiscono, <b>а, э, о, у, ы</b> no. Coppie che cambiano significato: <b>брат</b> [BRAT] (fratello) e <b>брать</b> [BRAT'] (prendere); <b>у́гол</b> [U-gal] (angolo) e <b>у́голь</b> [U-gal'] (carbone); <b>лук</b> [LUK] (cipolla) e <b>люк</b> [LIUK] (botola); <b>был</b> [BYL] (era) e <b>бил</b> [BIL] (batteva).</p>
<ul><li><b>ь</b> (segno molle) non ha suono: rende morbida la consonante prima: <b>мать</b> [MAT'] (madre), <b>день</b> [DIEN'] (giorno), <b>дверь</b> [DVIER'] (porta). Dopo <b>ж, ш, ч, щ</b> non cambia la pronuncia ed è solo grammaticale: <b>ночь</b> [NOC] (notte), <b>мышь</b> [MYSH].</li><li><b>ъ</b> (segno duro) è raro: separa la consonante dalla vocale morbida seguente, come in <b>подъе́зд</b> [pad-IEST] (portone d'ingresso).</li><li><b>ж, ш, ц</b> sono sempre <b>dure</b>; <b>ч, щ, й</b> sono sempre <b>morbide</b>. Per questo dopo ж, ш, ц la lettera <b>и</b> si legge come <b>ы</b>: <b>жизнь</b> [ZHYZN'] (vita), <b>ши́на</b> [SHY-na] (pneumatico), <b>цирк</b> [TSYRK].</li><li>Nei prestiti la consonante prima di <b>е</b> resta spesso dura: <b>интерне́т</b> [in-ter-NET], <b>су́пер</b> [SU-per], <b>кафе́</b> [ka-FE]. Dopo ь o ъ la vocale iotizzata apre una nuova sillaba, come in <b>семья́</b> [sim'-IA] e <b>подъе́зд</b> [pad-IEST].</li></ul>
<h3>4. La lettera ы</h3>
<p>Fai la «i» e, tenendo la bocca così, tira la lingua indietro: è <b>ы</b>. Non è in italiano. Compare in <b>мы</b> [MY] (noi), <b>ты</b> [TY] (tu), <b>сын</b> [SYN] (figlio), <b>ры́ба</b> [RY-ba] (pesce), <b>быть</b> [BYT'] (essere). Errore tipico: dire «mi» al posto di мы o «bit» per быть. Non scambiare ы con и: <b>был</b> [BYL] ≠ <b>бил</b> [BIL].</p>
<h3>5. Consonanti sorde a fine parola e assimilazione</h3>
<p>In fine di parola le consonanti sonore diventano sorde, e in gruppo la consonante si adegua alla vicina: si scrive una cosa, si dice un'altra. <b>хлеб</b> [HLIEP] (pane), <b>друг</b> [DRUK] (amico), <b>глаз</b> [GLAS] (occhio), <b>год</b> [GOT] (anno), <b>го́род</b> [GO-rat] (città), <b>вход</b> [FHOT] (ingresso), <b>ло́жка</b> [LOSH-ka] (cucchiaio), <b>сде́лать</b> [ZDIE-lat'] (fare). Per scrivere bene, cambia la parola e guarda la forma con una vocale dopo la consonante: la lettera giusta compare lì (<b>друг</b> [DRUK], ma <b>дру́га</b> [DRU-ga]).</p>
<h3>6. Lettere ingannevoli: г = в, silenziose, что</h3>
<ul><li><b>-ого, -его</b> si leggono con «v»: <b>его́</b> [i-VO] (lui, suo), <b>ничего́</b> [ni-ci-VO] (niente), <b>сего́дня</b> [si-VOD-nia] (oggi).</li><li><b>что</b> si legge [SHTO] e <b>коне́чно</b> [ka-NIESH-na] (certo) ha sh invece di ch.</li><li>Consonanti non pronunciate: il primo в di <b>здра́вствуйте</b> [ZDRA-stvui-tie] (buongiorno formale), л in <b>со́лнце</b> [SON-tsy] (sole), д in <b>се́рдце</b> [SIER-tsy] (cuore).</li></ul>
<h3>7. Intonazione: affermazione e domanda sì/no</h3>
<p>Il russo non usa un verbo ausiliare né cambia l'ordine delle parole per fare una domanda sì/no: cambia solo l'<b>intonazione</b>. In un'<b>affermazione</b> (IK-1) la voce scende sulla parola importante: <b>Э́то дом.</b> [E-ta DOM] ↓. In una <b>domanda sì/no</b> (IK-3) la voce sale bruscamente sulla sillaba accentata della parola su cui chiedi e poi cade: <b>Э́то дом?</b> [E-ta DOM] ↑↓. La salita cade sulla parola su cui poni la domanda: <b>Э́то дом?</b> chiede «è una casa?» (salita su дом). Le domande con una parola interrogativa (кто, что, где) scendono sulla parola interrogativa: <b>Где дом?</b> [GDIE DOM] ↓.</p>
<h3>In sintesi</h3>
<p>Accento libero (impara parola + accento); о atona → a, е/я atone → i; consonanti dure e morbide; ы non è и; sonore finali assordite; г in -ого = v; la domanda sì/no si fa solo con l'intonazione. Prima di passare oltre, leggi ad alta voce cinque volte <b>молоко́</b>, <b>хорошо́</b>, <b>спаси́бо</b>, <b>здра́вствуйте</b>, <b>до свида́ния</b>.</p>
<div class="say"><b>Da dire.</b> «Хорошо́. Спаси́бо. До свида́ния!» [ha-ra-SHO. spa-SSI-ba. da svi-DA-ni-ia]</div>`,
  [
    q(
      'q1',
      `Come si pronuncia «молоко́» (latte)?`,
      ['[ma-la-KO]', '[mo-lo-KO]', '[MO-lo-ko]', '[mo-la-KA]'],
      0,
      `Le о atone suonano a (akanie) e l'accento cade sull'ultima sillaba: la pronuncia è [ma-la-KO].`,
    ),
    q(
      'q2',
      `Quale coppia cambia significato solo spostando l'accento?`,
      ['за́мок / замо́к', 'брат / брать', 'мать / мат', 'был / бил'],
      0,
      `За́мок (castello) e замо́к (serratura) si scrivono uguali e differiscono solo per l'accento tonico.`,
    ),
    q(
      'q3',
      `Cosa succede alla «о» quando non è accentata?`,
      [`suona come a`, `suona come u`, `si raddoppia`, `resta una o piena`],
      0,
      `Nel russo standard la о atona è ridotta a «a» (akanie): хорошо́ si dice [ha-ra-SHO] e non [ho-ro-SHO].`,
    ),
    q(
      'q4',
      `Come si legge «хлеб» alla fine?`,
      [`con p finale`, `con b finale`, `con v finale`, `con una e finale`],
      0,
      `Le consonanti sonore a fine parola diventano sorde: b finale si pronuncia p, e la parola suona [HLIEP].`,
    ),
    q(
      'q5',
      `Quale parola contiene la lettera ы?`,
      [`сын`, `си́ний`, `стол`, `ско́лько`],
      0,
      `La ы compare in сын [SYN] (figlio) e rappresenta una i detta con la lingua indietro; le altre parole hanno и, о o ь.`,
    ),
    q(
      'q6',
      `Come si pronuncia «ничего́» (niente)?`,
      ['[ni-ci-VO]', '[ni-ce-GO]', '[ni-ci-GO]', '[nic-ce-VO]'],
      0,
      `Nella terminazione -ого/-его la г si legge v, e la е atona dopo ч diventa i: [ni-ci-VO].`,
    ),
    q(
      'q7',
      `Come si distingue la domanda «Э́то дом?» dall'affermazione «Э́то дом.»?`,
      [`solo con l'intonazione`, `invertendo le parole`, `aggiungendo il verbo essere`, `cambiando la lettera finale`],
      0,
      `Il russo non cambia l'ordine né aggiunge ausiliari: la domanda sì/no si fa alzando la voce sulla sillaba accentata della parola chiave.`,
    ),
    q(
      'q8',
      `Quale lettera è sempre morbida?`,
      ['ч', 'ш', 'ж', 'ц'],
      0,
      `ч, щ e й sono sempre morbide, mentre ж, ш e ц sono sempre dure: per questo dopo ж ш ц la и suona come ы.`,
    ),
  ],
  [
    card(
      'c1',
      `Accento libero`,
      `Cade su qualsiasi sillaba e va imparato con la parola: за́мок [ZA-mak] castello, замо́к [za-MOK] serratura.`,
    ),
    card(
      'c2',
      `Akanie`,
      `о atona = a: молоко́ [ma-la-KO], хорошо́ [ha-ra-SHO], Москва́ [mas-KVA]. Vale per tutte le о non accentate.`,
    ),
    card('c3', `Ikanie`, `е/я atone = i: река́ [ri-KA], язы́к [i-ZYK]. A fine parola ie/ia deboli: мо́ре [MO-rie].`),
    card(
      'c4',
      `Dopo ж, ш, ц`,
      `Sempre dure: и si legge ы (жизнь [ZHYZN'], цирк [TSYRK]) e la е atona suona ы (жена́ [zhy-NA]).`,
    ),
    card(
      'c5',
      `Ь e consonante morbida`,
      `ь rende morbida la consonante prima: мать [MAT'], брать [BRAT'], день [DIEN']. Dopo ж ш ч щ non cambia nulla.`,
    ),
    card('c6', `Ы`, `Una i con la lingua indietro: мы [MY], ты [TY], сын [SYN], ры́ба [RY-ba]. Non confondere con и.`),
    card(
      'c7',
      `Assordimento`,
      `Consonante sonora finale = sorda: хлеб [HLIEP], друг [DRUK], глаз [GLAS], год [GOT]. Anche nei gruppi: вход [FHOT].`,
    ),
    card('c8', `Г = в in -ого`, `его́ [i-VO], ничего́ [ni-ci-VO], сего́дня [si-VOD-nia]. E что si legge [SHTO].`),
    card(
      'c9',
      `Domanda sì/no`,
      `Stessa frase dell'affermazione, intonazione diversa: sale sull'accento della parola chiave e poi cade. Nessun ausiliare.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Scrivi la pronuncia di: молоко́, хорошо́, окно́, река́, язы́к.`,
      `молоко́ [ma-la-KO]; хорошо́ [ha-ra-SHO]; окно́ [ak-NO]; река́ [ri-KA]; язы́к [i-ZYK]. о atona = a, е/я atone = i; l'accento cade sull'ultima sillaba.`,
    ),
    prac(
      `p2`,
      `Perché «друг» si legge [DRUK] e «хлеб» [HLIEP]? Dì che regola vale.`,
      `Le consonanti sonore a fine parola diventano sorde: г → k, б → p. Nella forma con vocale (дру́га [DRU-ga]) la consonante resta sonora.`,
    ),
    prac(
      `p3`,
      `Leggi e distingui: брат / брать, лук / люк, был / бил. Che cosa cambia?`,
      `брат [BRAT] dura, брать [BRAT'] morbida; лук [LUK] u dura, люк [LIUK] iu morbida; был [BYL] ы, бил [BIL] и. Il segno ь e le vocali я е ё ю и ammorbidiscono.`,
    ),
    prac(
      `p4`,
      `Dì ad alta voce e trascrivi: ничего́, сего́дня, коне́чно, здра́вствуйте.`,
      `ничего́ [ni-ci-VO]; сего́дня [si-VOD-nia]; коне́чно [ka-NIESH-na]; здра́вствуйте [ZDRA-stvui-tie]. Г in -ого = v; il primo в di здра́вствуйте è muto; ч → sh in коне́чно.`,
    ),
    prac(
      `p5`,
      `Come cambia l'intonazione tra «Э́то дом.» e «Э́то дом?»? Descrivi con frecce.`,
      `Э́то дом. ↓ (la voce scende sulla parola chiave). Э́то дом? ↑↓ (sale bruscamente sulla vocale accentata, poi cade). Nessun verbo ausiliare e nessun cambio dell'ordine.`,
    ),
  ],
)

export const ruSaluti = mod(
  'ru-saluti',
  `Saluti, presentazioni, numeri, ora e calendario`,
  `ты e вы, formule di cortesia, presentarsi, numeri fino a 1000, che ore sono, giorni, mesi, ordinali e date`,
  'a1',
  `<p class="lead">Con queste formule sopravvivi alla prima conversazione: saluti, ringraziamenti, presentazioni e i numeri. Il russo distingue due livelli di cortesia, <b>ты</b> (tu) e <b>вы</b> (voi/Lei), e un errore di registro pesa più di un errore di grammatica.</p>
${PRON_SHORT}
<h3>Saluti e cortesia</h3>
<table><tr><th>Russo</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>Приве́т!</td><td>[pri-VIET]</td><td>ciao (informale, solo con ты)</td></tr>
<tr><td>Здра́вствуйте!</td><td>[ZDRA-stvui-tie]</td><td>buongiorno / salve (formale, con вы)</td></tr>
<tr><td>До́брое у́тро!</td><td>[DO-bra-ia U-tra]</td><td>buongiorno (mattino)</td></tr>
<tr><td>До́брый день!</td><td>[DO-bryi DIEN']</td><td>buon pomeriggio</td></tr>
<tr><td>До́брый ве́чер!</td><td>[DO-bryi VIE-cir]</td><td>buonasera</td></tr>
<tr><td>Споко́йной но́чи!</td><td>[spa-KOI-nai NO-ci]</td><td>buonanotte</td></tr>
<tr><td>До свида́ния!</td><td>[da svi-DA-ni-ia]</td><td>arrivederci</td></tr>
<tr><td>Пока́!</td><td>[pa-KA]</td><td>ciao (saluto informale)</td></tr>
<tr><td>Спаси́бо!</td><td>[spa-SSI-ba]</td><td>grazie</td></tr>
<tr><td>Пожа́луйста!</td><td>[pa-ZHA-lus-ta]</td><td>prego / per favore</td></tr>
<tr><td>Извини́те!</td><td>[iz-vi-NI-tie]</td><td>mi scusi (per attirare l'attenzione o scusarsi)</td></tr>
<tr><td>Прости́те!</td><td>[pras-TI-tie]</td><td>mi perdoni</td></tr>
<tr><td>Как дела́?</td><td>[kak di-LA]</td><td>come va?</td></tr>
<tr><td>Хорошо́, спаси́бо.</td><td>[ha-ra-SHO spa-SSI-ba]</td><td>bene, grazie</td></tr>
<tr><td>О́чень прия́тно!</td><td>[O-cin' pri-IAT-na]</td><td>molto piacere</td></tr>
</table>
<p><b>Пожа́луйста</b> significa sia «prego» (risposta a спаси́бо) sia «per favore». È una delle parole più utili e si dice anche mentre si porge qualcosa. Si scrive con la й, ma nel parlato la й quasi non si sente: [pa-ZHA-lus-ta] (a volte [pa-ZHA-la-sta]).</p>
<h3>ты o вы?</h3>
<ul><li><b>ты</b> [TY]: amici, famiglia, coetanei, bambini, animali, qualcuno con cui hai già il «tu».</li><li><b>вы</b> [VY]: sconosciuti, persone più anziane, superiori, negozio, ufficio; <b>è anche il plurale</b>: «voi» a più persone, anche amiche. In una lettera formale si scrive con la maiuscola (<b>Вы</b>).</li></ul>
<p>Come l'italiano «tu» e «Lei», ma <b>il verbo va alla seconda persona plurale</b> (il «Lei» italiano usa la terza singolare). La domanda <b>Как вас зову́т?</b> è formale, <b>Как тебя́ зову́т?</b> informale.</p>
<h3>Presentarsi</h3>
<table><tr><th>Russo</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>Меня́ зову́т Ма́рко.</td><td>[mi-NIA za-VUT MAR-ka]</td><td>mi chiamo Marco</td></tr>
<tr><td>Как вас зову́т?</td><td>[kak VAS za-VUT]</td><td>come si chiama? (formale)</td></tr>
<tr><td>Как тебя́ зову́т?</td><td>[kak ti-BIA za-VUT]</td><td>come ti chiami?</td></tr>
<tr><td>Я из Ита́лии.</td><td>[ia iz i-TA-li-i]</td><td>vengo dall'Italia</td></tr>
<tr><td>Я италья́нец.</td><td>[ia i-tal'-IA-nits]</td><td>sono italiano (uomo)</td></tr>
<tr><td>Я италья́нка.</td><td>[ia i-tal'-IAN-ka]</td><td>sono italiana (donna)</td></tr>
<tr><td>Я живу́ в Ри́ме.</td><td>[ia zhy-VU v RI-mie]</td><td>vivo a Roma</td></tr>
<tr><td>Вы говори́те по-ру́сски?</td><td>[vy ga-va-RI-tie pa-RUS-ski]</td><td>parla russo?</td></tr>
<tr><td>Я немно́го говорю́ по-ру́сски.</td><td>[ia nim-NO-ga ga-va-RIU pa-RUS-ski]</td><td>parlo un po' di russo</td></tr>
<tr><td>Я не понима́ю.</td><td>[ia ni pa-ni-MA-iu]</td><td>non capisco</td></tr>
<tr><td>Повтори́те, пожа́луйста.</td><td>[paf-ta-RI-tie pa-ZHA-lus-ta]</td><td>ripeta, per favore</td></tr>
</table>
<p><b>Trappola italiana</b>: in russo la nazionalità maschile e femminile sono due parole diverse (<b>италья́нец</b> / <b>италья́нка</b>) e non esistono articoli. Il verbo «essere» manca al presente: <b>Я италья́нец</b> = «io italiano» (vedi modulo ru-essere). In <b>Я из Ита́лии</b> la preposizione <b>из</b> + genitivo indica la provenienza.</p>
<h3>Numeri da 0 a 1000</h3>
<table><tr><th>N.</th><th>Russo e pronuncia</th><th>N.</th><th>Russo e pronuncia</th></tr>
<tr><td>0</td><td>ноль [NOL']</td><td>11</td><td>оди́ннадцать [a-DIN-na-tsat']</td></tr>
<tr><td>1</td><td>оди́н [a-DIN]</td><td>12</td><td>двена́дцать [dvi-NA-tsat']</td></tr>
<tr><td>2</td><td>два [DVA]</td><td>13</td><td>трина́дцать [tri-NA-tsat']</td></tr>
<tr><td>3</td><td>три [TRI]</td><td>14</td><td>четы́рнадцать [ci-TYR-na-tsat']</td></tr>
<tr><td>4</td><td>четы́ре [ci-TY-rie]</td><td>15</td><td>пятна́дцать [pit-NA-tsat']</td></tr>
<tr><td>5</td><td>пять [PIAT']</td><td>16</td><td>шестна́дцать [shys-NA-tsat']</td></tr>
<tr><td>6</td><td>шесть [SHEST']</td><td>17</td><td>семна́дцать [sim-NA-tsat']</td></tr>
<tr><td>7</td><td>семь [SIEM']</td><td>18</td><td>восемна́дцать [va-sim-NA-tsat']</td></tr>
<tr><td>8</td><td>во́семь [VO-sim']</td><td>19</td><td>девятна́дцать [di-vit-NA-tsat']</td></tr>
<tr><td>9</td><td>де́вять [DIE-vit']</td><td>20</td><td>два́дцать [DVA-tsat']</td></tr>
<tr><td>10</td><td>де́сять [DIE-sit']</td><td>30</td><td>три́дцать [TRI-tsat']</td></tr>
<tr><td>40</td><td>со́рок [SO-rak]</td><td>70</td><td>се́мьдесят [SIEM'-di-sit]</td></tr>
<tr><td>50</td><td>пятьдеся́т [pid-di-SIAT]</td><td>80</td><td>во́семьдесят [VO-sim'-di-sit]</td></tr>
<tr><td>60</td><td>шестьдеся́т [shyz-di-SIAT]</td><td>90</td><td>девяно́сто [di-vi-NO-sta]</td></tr>
<tr><td>100</td><td>сто [STO]</td><td>1000</td><td>ты́сяча [TY-si-cia]</td></tr>
</table>
<p>Da 13 a 19 il pattern è «numero + <b>-на́дцать</b>» (-teen); le decine sono due (два́дцать, три́дцать) e poi «numero + -десят» (пятьдеся́т, шестьдеся́т...). Composti: <b>два́дцать оди́н</b> [DVA-tsat' a-DIN] (21), <b>со́рок пять</b> [SO-rak PIAT'] (45). I numeri da 5 a 20 e 30 terminano con la <b>ь</b> morbida (40, 50-90 e 100 no): <b>пять</b> [PIAT'], <b>де́вять</b> [DIE-vit'], <b>три́дцать</b> [TRI-tsat'].</p>
<p>Le <b>centinaia</b>: <b>сто</b> [STO] 100, <b>две́сти</b> [DVIE-sti] 200, <b>три́ста</b> [TRI-sta] 300, <b>четы́реста</b> [ci-TY-ri-sta] 400, <b>пятьсо́т</b> [pit-SOT] 500, <b>шестьсо́т</b> [shys-SOT] 600, <b>семьсо́т</b> [sim'-SOT] 700, <b>восемьсо́т</b> [va-sim'-SOT] 800, <b>девятьсо́т</b> [di-vit-SOT] 900. Si leggono da sinistra a destra: <b>сто два́дцать пять</b> [STO DVA-tsat' PIAT'] (125), <b>две́сти пятьдеся́т</b> [DVIE-sti pid-di-SIAT] (250), <b>две ты́сячи</b> [dvie TY-si-ci] (2000), <b>пять ты́сяч</b> [piat' TY-siac] (5000). Prezzi: <b>Три́ста рубле́й.</b> [TRI-sta rub-LIEI].</p>
<p><b>1 e 2 hanno il genere</b>: <b>оди́н</b> [a-DIN] (m), <b>одна́</b> [ad-NA] (f), <b>одно́</b> [ad-NO] (n); <b>два</b> [DVA] (m/n), <b>две</b> [DVIE] (f). Dopo 2-4 il sostantivo è al genitivo singolare, dopo 5+ al genitivo plurale (capitolo avanzato): per ora impara <b>оди́н час</b>, <b>два часа́</b>, <b>пять часо́в</b> come blocchi.</p>
<h3>Che ore sono?</h3>
<ul><li><b>Кото́рый час?</b> [ka-TO-ryi CIAS] o <b>Ско́лько вре́мени?</b> [SKOL'-ka VRIE-mi-ni].</li><li><b>Сейча́с час.</b> [si-CIAS CIAS] (è l'una); <b>Сейча́с три часа́.</b> [si-CIAS tri ci-SA]; <b>Сейча́с пять часо́в.</b> [si-CIAS piat' ci-SOF].</li><li><b>Во ско́лько?</b> [va SKOL'-ka] = a che ora? Risposta: <b>в + accusativo</b>: <b>в пять часо́в</b> [f piat' ci-SOF], <b>в семь три́дцать</b> [f siem' TRI-tsat'] (alle 7:30).</li><li>A voce si usano le <b>12 ore</b> con la parte del giorno al genitivo: <b>в семь часо́в ве́чера</b> [f SIEM' ci-SOF VIE-ci-ra] (alle 19), <b>в де́сять часо́в утра́</b> [v DIE-sit' ci-SOF ut-RA] (alle 10 del mattino), <b>в два часа́ дня</b> [v DVA ci-SA DNIA] (alle 14), <b>в три часа́ но́чи</b> [f tri ci-SA NO-ci] (alle 3 di notte). Le 24 ore (<b>восемна́дцать часо́в</b> [va-sim-NA-tsat' ci-SOF]) sono per gli orari ufficiali di treni, aerei e programmi.</li><li><b>Minuti</b>: <b>в семь два́дцать</b> [f SIEM' DVA-tsat'] (7:20), <b>в семь пятна́дцать</b> [f SIEM' pit-NA-tsat'] (7:15). <b>Полови́на восьмо́го</b> [pa-la-VI-na vas'-MO-va] (alla lettera «la metà dell'ottava ora») è 7:30: da capire, non da produrre; tu di' <b>семь три́дцать</b>.</li><li>Parti del giorno: <b>у́тром</b> [U-tram] (di mattina), <b>днём</b> [DNIOM] (di giorno), <b>ве́чером</b> [VIE-ci-ram] (di sera), <b>но́чью</b> [NO-ciu] (di notte).</li></ul>
<h3>Giorni e mesi</h3>
<table><tr><th>Giorno</th><th>Pronuncia</th><th>Mese</th><th>Pronuncia</th></tr>
<tr><td>понеде́льник</td><td>[pa-ni-DIEL'-nik]</td><td>янва́рь</td><td>[in-VAR']</td></tr>
<tr><td>вто́рник</td><td>[FTOR-nik]</td><td>февра́ль</td><td>[fiv-RAL']</td></tr>
<tr><td>среда́</td><td>[sri-DA]</td><td>март</td><td>[MART]</td></tr>
<tr><td>четве́рг</td><td>[cit-VIERK]</td><td>апре́ль</td><td>[ap-RIEL']</td></tr>
<tr><td>пя́тница</td><td>[PIAT-ni-tsa]</td><td>май</td><td>[MAI]</td></tr>
<tr><td>суббо́та</td><td>[su-BO-ta]</td><td>ию́нь</td><td>[i-IUN']</td></tr>
<tr><td>воскресе́нье</td><td>[vas-kri-SIEN'-ie]</td><td>ию́ль</td><td>[i-IUL']</td></tr>
</table>
<p>I giorni e i mesi si scrivono con la <b>minuscola</b>. Gli altri mesi: <b>а́вгуст</b> [AV-gust], <b>сентя́брь</b> [sin-TIABR'], <b>октя́брь</b> [ak-TIABR'], <b>ноя́брь</b> [na-IABR'], <b>дека́брь</b> [di-KABR']. Per «di lunedì» si usa <b>в + accusativo</b>: <b>в понеде́льник</b> [f pa-ni-DIEL'-nik], <b>в пя́тницу</b> [f PIAT-ni-tsu], <b>в суббо́ту</b> [f su-BO-tu]; attenzione, <b>среда́</b> sposta l'accento: <b>в сре́ду</b> [f SRIE-du] (di mercoledì). «Che giorno è?» è <b>Како́й сего́дня день?</b> [ka-KOI si-VOD-nia DIEN'], «che data è?» è <b>Како́е сего́дня число́?</b> [ka-KO-ia si-VOD-nia cis-LO].</p>
<h3>Ordinali e date</h3>
<p>Per le date servono gli ordinali al <b>neutro</b> (sottinteso <b>число́</b>, il «giorno del mese») e il <b>mese al genitivo</b>: <b>Сего́дня пя́тое ма́я.</b> [si-VOD-nia PIA-ta-ia MA-ia] (oggi è il 5 maggio).</p>
<table><tr><th>N.</th><th>Neutro</th><th>N.</th><th>Neutro</th></tr>
<tr><td>1</td><td>пе́рвое [PIER-va-ia]</td><td>6</td><td>шесто́е [shys-TO-ia]</td></tr>
<tr><td>2</td><td>второ́е [fta-RO-ia]</td><td>7</td><td>седьмо́е [sid'-MO-ia]</td></tr>
<tr><td>3</td><td>тре́тье [TRIET'-ie]</td><td>8</td><td>восьмо́е [vas'-MO-ia]</td></tr>
<tr><td>4</td><td>четвёртое [cit-VIOR-ta-ia]</td><td>9</td><td>девя́тое [di-VIA-ta-ia]</td></tr>
<tr><td>5</td><td>пя́тое [PIA-ta-ia]</td><td>10</td><td>деся́тое [di-SIA-ta-ia]</td></tr>
</table>
<p>Da 11 in poi l'ordinale si forma dal numero con <b>-ое</b>: <b>оди́ннадцатое</b> [a-DIN-na-tsa-ta-ia], <b>двена́дцатое</b> [dvi-NA-tsa-ta-ia], <b>двадца́тое</b> [dva-TSA-ta-ia], <b>тридца́тое</b> [tri-TSA-ta-ia]; nei composti solo l'ultima parte è ordinale (<b>два́дцать пе́рвое</b>, il 21).</p>
<table><tr><th>Mese</th><th>Genitivo (nella data)</th><th>Mese</th><th>Genitivo (nella data)</th></tr>
<tr><td>янва́рь</td><td>января́ [in-va-RIA]</td><td>ию́ль</td><td>ию́ля [i-IU-lia]</td></tr>
<tr><td>февра́ль</td><td>февраля́ [fiv-ra-LIA]</td><td>а́вгуст</td><td>а́вгуста [AV-gus-ta]</td></tr>
<tr><td>март</td><td>ма́рта [MAR-ta]</td><td>сентя́брь</td><td>сентября́ [sin-tib-RIA]</td></tr>
<tr><td>апре́ль</td><td>апре́ля [ap-RIE-lia]</td><td>октя́брь</td><td>октября́ [ak-tib-RIA]</td></tr>
<tr><td>май</td><td>ма́я [MA-ia]</td><td>ноя́брь</td><td>ноября́ [na-ib-RIA]</td></tr>
<tr><td>ию́нь</td><td>ию́ня [i-IU-nia]</td><td>дека́брь</td><td>декабря́ [di-kab-RIA]</td></tr>
</table>
<p>La data si chiede con <b>Како́е сего́дня число́?</b> [ka-KO-ia si-VOD-nia cis-LO] e si risponde <b>Сего́дня деся́тое ию́ня.</b> [si-VOD-nia di-SIA-ta-ia i-IU-nia]. «Il compleanno» è <b>день рожде́ния</b> [DIEN' razh-DIE-ni-ia]: <b>Мой день рожде́ния — пе́рвое ма́я.</b> [MOI DIEN' razh-DIE-ni-ia PIER-va-ia MA-ia]. «Nel mese di» si dice con il prepositivo: <b>в ма́е</b> [v MA-ie], <b>в январе́</b> [v in-va-RIE]. «In che anno?» è <b>в како́м году́?</b> [f ka-KOM ga-DU]: la risposta (ordinale + <b>году́</b>) si studia più avanti.</p>
<h3>In sintesi</h3>
<p>Usa <b>вы</b> con gli sconosciuti e al plurale, <b>ты</b> con amici e famiglia. Impara il blocco: Здра́вствуйте / Спаси́бо / Пожа́луйста / Извини́те / До свида́ния. Numeri: 1-4 con genere (оди́н, одна́, одно́, два, две), 13-19 con -на́дцать, 50-80 con -десят, centinaia (две́сти, три́ста, четы́реста, пятьсо́т...). Date: ordinale neutro + mese al genitivo (пя́тое ма́я). Per l'ora: <b>час</b>, <b>часа́</b> (2-4), <b>часо́в</b> (5+).</p>
<div class="say"><b>Da dire.</b> «Здра́вствуйте! Меня́ зову́т Ма́рко. Я из Ита́лии. О́чень прия́тно!» [ZDRA-stvui-tie. mi-NIA za-VUT MAR-ka. ia iz i-TA-li-i. O-cin' pri-IAT-na]</div>`,
  [
    q(
      'q1',
      `Quando si usa «вы» invece di «ты»?`,
      [
        `con sconosciuti e con più persone`,
        `solo con gli amici stretti`,
        `solo per parlare di sé`,
        `solo per iscritto`,
      ],
      0,
      `Вы è sia il «Lei» formale sia il plurale «voi»: si usa con sconosciuti, persone più anziane e con più interlocutori.`,
    ),
    q(
      'q2',
      `Come si dice «Mi chiamo Marco» in russo?`,
      [`Меня́ зову́т Ма́рко.`, `Я зову́т Ма́рко.`, `Мой зову́т Ма́рко.`, `Вас зову́т Ма́рко.`],
      0,
      `La formula fissa è Меня́ зову́т, letteralmente «mi chiamano»; non si dice «io chiamo» come in italiano.`,
    ),
    q(
      'q3',
      `Che numero è «пятна́дцать»?`,
      ['15', '50', '5', '45'],
      0,
      `Пять è 5 e -на́дцать forma i numeri da 11 a 19: пятна́дцать è quindi 15, mentre 50 è пятьдеся́т.`,
    ),
    q(
      'q4',
      `Come dice una donna «Sono italiana»?`,
      [`Я италья́нка.`, `Я италья́нец.`, `Я италья́нов.`, `Я италья́нская.`],
      0,
      `Il russo ha due sostantivi diversi per la nazionalità: италья́нец per l'uomo e италья́нка per la donna.`,
    ),
    q(
      'q5',
      `Quale forma è corretta per «le cinque» in «a che ora»?`,
      [`в пять часо́в`, `в пять часа́`, `в пять час`, `в пяти́ часо́в`],
      0,
      `Con i numeri da 5 in su «ora» ha la forma часо́в; часа́ si usa solo con 2, 3 e 4, e час con 1.`,
    ),
    q(
      'q6',
      `Che cosa significa «суббо́та»?`,
      [`sabato`, `domenica`, `venerdì`, `giovedì`],
      0,
      `Суббо́та è il sabato; la domenica è воскресе́нье e il venerdì è пя́тница, dalla parola «cinque».`,
    ),
    q(
      'q7',
      `Come si dice «Non capisco»?`,
      [`Я не понима́ю.`, `Я нет понима́ю.`, `Не я понима́ю.`, `Я не понима́ть.`],
      0,
      `La negazione не si mette prima del verbo coniugato: Я не понима́ю. La parola нет si usa per il «no» come risposta.`,
    ),
    q(
      'q8',
      `Qual è il significato di «Пожа́луйста»?`,
      [`prego / per favore`, `arrivederci`, `scusi`, `buonasera`],
      0,
      `Пожа́луйста copre sia il «per favore» sia la risposta «prego» a спаси́бо, ed è molto frequente nel parlato.`,
    ),
    q(
      'q9',
      `Come si dice «500»?`,
      [`пятьсо́т`, `пятьдеся́т`, `пятна́дцать`, `пять ты́сяч`],
      0,
      `Le centinaia da 500 in poi uniscono il numero e сот: пятьсо́т è 500, mentre пятьдеся́т è 50.`,
    ),
    q(
      'q10',
      `Come si dice «Oggi è il 5 maggio»?`,
      [`Сего́дня пя́тое ма́я.`, `Сего́дня пять май.`, `Сего́дня пя́тый ма́я.`, `Сего́дня пя́тое май.`],
      0,
      `La data vuole l'ordinale neutro (пя́тое, sottinteso число́) e il mese al genitivo (ма́я).`,
    ),
    q(
      'q11',
      `Come si dice «alle sette di sera» nel parlato?`,
      [`в семь часо́в ве́чера`, `в семь часа́ ве́чера`, `в семь час ве́чер`, `на семь часо́в ве́чера`],
      0,
      `Si usano le 12 ore: в + numero + часо́в (da 5 in su), poi ве́чера al genitivo per precisare la sera.`,
    ),
  ],
  [
    card(
      'c1',
      `ты / вы`,
      `ты = tu (amici, famiglia); вы = Lei (formale) e voi (plurale). Il verbo con вы è alla 2ª plurale.`,
    ),
    card(
      'c2',
      `Saluti`,
      `Приве́т [pri-VIET] (informale), Здра́вствуйте [ZDRA-stvui-tie] (formale), До свида́ния [da svi-DA-ni-ia], Пока́ [pa-KA].`,
    ),
    card(
      'c3',
      `Спаси́бо / Пожа́луйста`,
      `Спаси́бо [spa-SSI-ba] = grazie; пожа́луйста [pa-ZHA-lus-ta] = prego e per favore.`,
    ),
    card(
      'c4',
      `Presentarsi`,
      `Меня́ зову́т... [mi-NIA za-VUT]; Как вас зову́т? [kak VAS za-VUT]; О́чень прия́тно [O-cin' pri-IAT-na].`,
    ),
    card(
      'c5',
      `Nazionalità`,
      `италья́нец (m) [i-tal'-IA-nits], италья́нка (f) [i-tal'-IAN-ka]; Я из Ита́лии [ia iz i-TA-li-i].`,
    ),
    card('c6', `Numeri 11-19`, `-на́дцать [NA-tsat']: оди́ннадцать 11, двена́дцать 12, пятна́дцать 15, девятна́дцать 19.`),
    card('c7', `Ora`, `час (1), часа́ (2-4), часо́в (5+): Сейча́с три часа́. A che ora = в + accusativo: в пять часо́в.`),
    card(
      'c8',
      `Giorni`,
      `понеде́льник, вто́рник, среда́, четве́рг, пя́тница, суббо́та, воскресе́нье. Minuscola e в + accusativo (в пя́тницу).`,
    ),
    card(
      'c9',
      `Mesi`,
      `янва́рь, февра́ль, март, апре́ль, май, ию́нь, ию́ль, а́вгуст, сентя́брь, октя́брь, ноя́брь, дека́брь. Minuscola.`,
    ),
    card(
      'c10',
      `Centinaia`,
      `сто 100, две́сти 200, три́ста 300, четы́реста 400, пятьсо́т 500 ... девятьсо́т 900, ты́сяча 1000. Prezzo: Три́ста рубле́й.`,
    ),
    card(
      'c11',
      `Ordinali e date`,
      `пе́рвое, второ́е, тре́тье, четвёртое, пя́тое... + mese al genitivo: Сего́дня пя́тое ма́я. Како́е сего́дня число́?`,
    ),
    card(
      'c12',
      `Ora di tutti i giorni`,
      `12 ore + parte del giorno al genitivo: в семь часо́в ве́чера, в де́сять часо́в утра́, в два часа́ дня, в три часа́ но́чи.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Presentati in russo in tre frasi: nome, provenienza, lingua.`,
      `Меня́ зову́т Ма́рко. [mi-NIA za-VUT MAR-ka] Я из Ита́лии. [ia iz i-TA-li-i] Я немно́го говорю́ по-ру́сски. [ia nim-NO-ga ga-va-RIU pa-RUS-ski]. Sostituisci Ма́рко con il tuo nome.`,
    ),
    prac(
      `p2`,
      `Scegli ты o вы e riscrivi la domanda «Come si chiama?» a un amico e a un professore.`,
      `Amico: Как тебя́ зову́т? [kak ti-BIA za-VUT]. Professore: Как вас зову́т? [kak VAS za-VUT]. Con вы il pronome diventa вас.`,
    ),
    prac(
      `p3`,
      `Scrivi in cifre e in lettere: 14, 21, 45, 100.`,
      `14 = четы́рнадцать [ci-TYR-na-tsat'], 21 = два́дцать оди́н [DVA-tsat' a-DIN], 45 = со́рок пять [SO-rak PIAT'], 100 = сто [STO].`,
    ),
    prac(
      `p4`,
      `Dì che ore sono: 1:00, 3:00, 5:00, 8:00.`,
      `Сейча́с час. [si-CIAS CIAS]; Сейча́с три часа́. [si-CIAS tri ci-SA]; Сейча́с пять часо́в. [si-CIAS piat' ci-SOF]; Сейча́с во́семь часо́в. [si-CIAS VO-sim' ci-SOF]. 1: час, 2-4: часа́, 5+: часо́в.`,
    ),
    prac(
      `p5`,
      `Traduci: «Parlo un po' di russo» e «Ripeta, per favore».`,
      `Я немно́го говорю́ по-ру́сски. [ia nim-NO-ga ga-va-RIU pa-RUS-ski] — Повтори́те, пожа́луйста. [paf-ta-RI-tie pa-ZHA-lus-ta]. Per ты: Повтори́, пожа́луйста.`,
    ),
    prac(
      `p6`,
      `Scrivi in russo: 200, 350, 500 e 1000.`,
      `две́сти [DVIE-sti]; три́ста пятьдеся́т [TRI-sta pid-di-SIAT]; пятьсо́т [pit-SOT]; ты́сяча [TY-si-cia]. Le centinaia si leggono da sinistra a destra.`,
    ),
    prac(
      `p7`,
      `Di' la data «5 maggio» e l'ora «alle sette di sera».`,
      `Сего́дня пя́тое ма́я. [si-VOD-nia PIA-ta-ia MA-ia] — В семь часо́в ве́чера. [f SIEM' ci-SOF VIE-ci-ra]. Data: ordinale neutro + mese al genitivo; ora: 12 ore + ве́чера.`,
    ),
  ],
)

export const ruEssere = mod(
  'ru-essere',
  `«Essere» che non c'è, это, avere con у меня́ есть`,
  `Nessun verbo essere al presente, э́то, pronomi, есть e нет con il genitivo, быть al passato e al futuro`,
  'a1',
  `<p class="lead">In russo il verbo «essere» <b>non si usa al presente</b>: si dice «io studente», «Mosca capitale». Anche il verbo «avere» non esiste come in italiano: si dice «presso di me c'è». Sono due differenze radicali, ma semplificano la frase: impara tre schemi e puoi già dire moltissimo.</p>
${PRON_SHORT}
<h3>1. Nessun «è / sono» al presente</h3>
<table><tr><th>Russo</th><th>Pronuncia</th><th>Italiano</th></tr>
<tr><td>Я студе́нт.</td><td>[ia stu-DIENT]</td><td>io sono studente</td></tr>
<tr><td>Она́ врач.</td><td>[a-NA VRAC]</td><td>lei è medico</td></tr>
<tr><td>Мы италья́нцы.</td><td>[my i-tal'-IAN-tsy]</td><td>siamo italiani</td></tr>
<tr><td>Они́ учителя́.</td><td>[a-NI u-ci-ti-LIA]</td><td>sono insegnanti</td></tr>
<tr><td>Москва́ — столи́ца.</td><td>[mas-KVA sta-LI-tsa]</td><td>Mosca è la capitale</td></tr>
</table>
<p>Il trattino <b>—</b> tra due sostantivi è l'unico segno che sostituisce il verbo, e si usa soprattutto nella lingua scritta. Dopo i pronomi non si scrive. <b>Non esistono articoli</b>: «un libro» e «il libro» sono entrambi <b>кни́га</b>.</p>
<h3>2. Pronomi personali</h3>
<table><tr><th>Singolare</th><th>Plurale</th></tr>
<tr><td>я [ia] io<br>ты [TY] tu<br>он [ON] lui<br>она́ [a-NA] lei<br>оно́ [a-NO] esso (neutro)</td><td>мы [MY] noi<br>вы [VY] voi / Lei<br>они́ [a-NI] loro</td></tr>
</table>
<h3>3. Э́то: «questo è»</h3>
<p><b>Э́то</b> [E-ta] è invariabile: introduce una cosa o una persona con qualunque genere e numero. <b>Что э́то?</b> [SHTO E-ta] (che cos'è?) — <b>Э́то кни́га.</b> [E-ta KNI-ga]. <b>Кто э́то?</b> [KTO E-ta] (chi è?) — <b>Э́то Ма́рко.</b> [E-ta MAR-ka]. Per dire «questo/questa» + sostantivo, serve <b>э́тот / э́та / э́то</b> (modulo successivo): <b>Э́то моя́ сестра́.</b> [E-ta ma-IA sis-TRA] = «questa è mia sorella».</p>
<h3>4. Avere: у меня́ есть</h3>
<p>Il russo dice <b>у + genitivo + есть + cosa</b>: «presso di me c'è...». <b>У меня́ есть брат.</b> [u mi-NIA IEST' BRAT] (ho un fratello). <b>есть</b> [IEST'] si omette spesso quando segue un aggettivo o un'informazione: <b>У меня́ но́вая маши́на</b> (ho una macchina nuova). Con i pronomi la forma dopo preposizione è:</p>
<table><tr><th>Pronome</th><th>У + pronome</th><th>Significato</th></tr>
<tr><td>я</td><td>у меня́ [u mi-NIA]</td><td>io ho</td></tr>
<tr><td>ты</td><td>у тебя́ [u ti-BIA]</td><td>tu hai</td></tr>
<tr><td>он</td><td>у него́ [u ni-VO]</td><td>lui ha</td></tr>
<tr><td>она́</td><td>у неё [u ni-IO]</td><td>lei ha</td></tr>
<tr><td>мы</td><td>у нас [u NAS]</td><td>noi abbiamo</td></tr>
<tr><td>вы</td><td>у вас [u VAS]</td><td>voi/Lei avete</td></tr>
<tr><td>они́</td><td>у них [u NIH]</td><td>loro hanno</td></tr>
</table>
<p>Dopo una preposizione i pronomi di 3ª persona prendono una <b>н-</b>: <b>у него́</b>, <b>у неё</b>, <b>у них</b> (non «у его́»).</p>
<h3>5. Нет: «non c'è», «non ho» + genitivo</h3>
<p>La negazione di есть è <b>нет</b> e il sostantivo passa al <b>genitivo</b>: <b>У меня́ есть брат</b> → <b>У меня́ нет бра́та.</b> [u mi-NIA NIET BRA-ta]. Impara per ora il genitivo singolare come blocco: maschile -а/-я (<b>брат → бра́та</b>, <b>дом → до́ма</b> [DO-ma]), femminile -ы/-и (<b>сестра́ → сестры́</b> [sis-TRY], <b>маши́на → маши́ны</b> [ma-SHY-ny]), neutro -о → -а e -е → -я (<b>окно́ → окна́</b> [ak-NA], <b>мо́ре → мо́ря</b> [MO-ria]); <b>вре́мя</b> è irregolare e fa <b>вре́мени</b> [VRIE-mi-ni], da imparare come blocco. Chunk utili: <b>У меня́ нет вре́мени.</b> [u mi-NIA NIET VRIE-mi-ni] (non ho tempo); <b>Здесь есть магази́н?</b> [ZDIES' IEST' ma-ga-ZIN] (c'è un negozio qui?) — <b>Нет, магази́на нет.</b> [NIET ma-ga-ZI-na NIET].</p>
<h3>6. Быть: passato e futuro</h3>
<p>Il verbo <b>быть</b> [BYT'] riappare nel passato e nel futuro. Passato: <b>был</b> [BYL] (m), <b>была́</b> [by-LA] (f), <b>бы́ло</b> [BY-la] (n), <b>бы́ли</b> [BY-li] (pl): <b>Вчера́ я был до́ма.</b> [fci-RA ia BYL DO-ma] (ieri ero a casa, detto da un uomo), <b>Она́ была́ в Ри́ме.</b> [a-NA by-LA v RI-mie]. Futuro: <b>бу́ду</b> [BU-du], <b>бу́дешь</b> [BU-dish], <b>бу́дет</b> [BU-dit], <b>бу́дем</b> [BU-dim], <b>бу́дете</b> [BU-di-tie], <b>бу́дут</b> [BU-dut]: <b>За́втра я бу́ду до́ма.</b> [ZAF-tra ia BU-du DO-ma] (domani sarò a casa).</p>
<h3>7. Il dativo dei pronomi: età, piacere, bisogno</h3>
<p>Molte frasi russe mettono la persona al <b>dativo</b> («a me, a te»). Per ora impara i pronomi e i blocchi che li usano.</p>
<table><tr><th>я</th><th>ты</th><th>он</th><th>она́</th><th>мы</th><th>вы</th><th>они́</th></tr>
<tr><td>мне [MNIE]</td><td>тебе́ [ti-BIE]</td><td>ему́ [i-MU]</td><td>ей [IEI]</td><td>нам [NAM]</td><td>вам [VAM]</td><td>им [IM]</td></tr></table>
<ul><li><b>Età</b>: <b>Мне два́дцать пять лет.</b> [mnie DVA-tsat' PIAT' LIET] (ho 25 anni, alla lettera «a me 25 anni»); <b>Ско́лько тебе́ лет?</b> [SKOL'-ka ti-BIE LIET] (quanti anni hai?); <b>Ско́лько вам лет?</b> [SKOL'-ka VAM LIET]. «Anno» è <b>год</b> [GOT] con 1 (<b>оди́н год</b>), <b>го́да</b> [GO-da] con 2-4 (<b>два го́да</b>) e <b>лет</b> [LIET] da 5 in su: <b>Ему́ оди́ннадцать лет.</b> [i-MU a-DIN-na-tsat' LIET].</li><li><b>Piacere</b>: <b>Мне нра́вится</b> + cosa piaciuta, <b>нра́вятся</b> se è plurale; la cosa che piace è il soggetto. <b>Мне нра́вится Москва́.</b> [mnie NRA-vi-tsa mas-KVA] (mi piace Mosca); <b>Ей нра́вятся кни́ги.</b> [IEI NRA-vi-tsa KNI-gi] (le piacciono i libri); <b>Мне нра́вится чита́ть.</b> [mnie NRA-vi-tsa ci-TAT'].</li><li><b>Bisogno e dovere</b>: <b>Мне на́до</b> [mnie NA-da] o <b>Мне ну́жно</b> [mnie NUZH-na] + infinito: <b>Мне на́до идти́.</b> [mnie NA-da it-TI] (devo andare). Con il soggetto al nominativo: <b>Я до́лжен рабо́тать.</b> [ia DOL-zhyn ra-BO-tat'] (devo lavorare; donna: <b>должна́</b> [dalzh-NA]).</li><li><b>Divieto e permesso</b>: <b>Нельзя́</b> [nil'-ZIA] = non si può, è vietato: <b>Здесь нельзя́ кури́ть.</b> [ZDIES' nil'-ZIA ku-RIT'] (qui non si può fumare); <b>Мо́жно</b> [MOZH-na] = si può.</li><li><b>Dativo dei nomi (solo blocchi)</b>: <b>Я иду́ к врачу́.</b> [ia i-DU k vra-CU] (vado dal medico, к + dativo); <b>Я звоню́ ма́ме.</b> [ia zva-NIU MA-mie] (telefono alla mamma, dativo -е); <b>Помоги́те мне, пожа́луйста.</b> [pa-ma-GI-tie MNIE pa-ZHA-lus-ta] (aiutatemi, per favore). Il dativo risponde a <b>кому́?</b> [ka-MU] (a chi?); maschile in -у/-ю (<b>врач → врачу́</b>), femminile in -е (<b>ма́ма → ма́ме</b>).</li><li><b>Sensazioni</b>: <b>Мне хо́лодно</b> [mnie HO-lad-na] (ho freddo), <b>Мне жа́рко</b> [mnie ZHAR-ka] (ho caldo), <b>Мне пло́хо</b> [mnie PLO-ha] (sto male), <b>Мне хорошо́</b> [mnie ha-ra-SHO] (sto bene).</li></ul>
<h3>Professioni da usare con «Я»</h3>
<p><b>студе́нт</b> [stu-DIENT] / <b>студе́нтка</b> [stu-DIENT-ka]; <b>врач</b> [VRAC]; <b>учи́тель</b> [u-CI-til'] (insegnante); <b>инжене́р</b> [in-zhy-NIER]; <b>журнали́ст</b> [zhur-na-LIST]; <b>по́вар</b> [PO-var] (cuoco); <b>официа́нт</b> [a-fi-tsy-ANT]. Alcune hanno una forma femminile (<b>студе́нтка</b>, <b>учи́тельница</b> [u-CI-til'-ni-tsa]), altre no: <b>врач</b>, <b>инжене́р</b>, <b>по́вар</b> restano maschili anche per una donna: <b>Она́ врач.</b></p>
<h3>Trappole italiane</h3>
<ul><li>Non tradurre «sono» con есть: <b>Я есть студе́нт</b> è un errore; il verbo manca.</li><li>«Ho» non si dice con un verbo: si dice <b>У меня́ есть</b> + la cosa posseduta.</li><li><b>нет</b> è sia «no» sia «non c'è»: <b>— Ты студе́нт? — Нет.</b> / <b>Здесь нет магази́на.</b></li><li>Il passato di быть cambia con il genere del soggetto: <b>он был, она́ была́</b>, ma «io» dipende dal sesso di chi parla.</li></ul>
<h3>In sintesi</h3>
<p>Presente senza «essere»: <b>Я студе́нт.</b> Presentare: <b>Э́то + nome</b>. Avere: <b>У меня́ есть + nominativo</b>. Non avere: <b>У меня́ нет + genitivo</b>. Età, piacere, bisogno: <b>Мне два́дцать лет</b>, <b>Мне нра́вится</b>, <b>Мне на́до</b>. Быть compare solo al passato (был, была́, бы́ло, бы́ли) e al futuro (бу́ду...).</p>
<div class="say"><b>Da dire.</b> «У меня́ есть сестра́. Она́ врач. У неё нет вре́мени.» [u mi-NIA IEST' sis-TRA. a-NA VRAC. u ni-IO NIET VRIE-mi-ni]</div>`,
  [
    q(
      'q1',
      `Come si dice «Io sono studente» in russo?`,
      [`Я студе́нт.`, `Я есть студе́нт.`, `Я быть студе́нт.`, `Я студе́нтом.`],
      0,
      `Al presente il verbo essere non si usa: si accostano soggetto e nome, quindi Я студе́нт è la frase corretta.`,
    ),
    q(
      'q2',
      `Che cosa significa «У меня́ есть брат»?`,
      [`Ho un fratello.`, `Mio fratello è qui.`, `Non ho un fratello.`, `Sono un fratello.`],
      0,
      `La costruzione у + genitivo + есть esprime il possesso: letteralmente «presso di me c'è un fratello».`,
    ),
    q(
      'q3',
      `Come si dice «Non ho tempo»?`,
      [`У меня́ нет вре́мени.`, `Я не есть вре́мя.`, `У меня́ не вре́мя.`, `У меня́ нет вре́мя.`],
      0,
      `Нет richiede il genitivo: вре́мя diventa вре́мени, e il soggetto resta nella costruzione у меня́.`,
    ),
    q(
      'q4',
      `Come si dice «Lei era a Roma»?`,
      [`Она́ была́ в Ри́ме.`, `Она́ был в Ри́ме.`, `Она́ есть в Ри́ме.`, `Она́ бу́дет в Ри́ме.`],
      0,
      `Il passato di быть concorda con il genere del soggetto: она́ richiede была́, mentre был è maschile.`,
    ),
    q(
      'q5',
      `In che caso va il nome dopo «нет» (non c'è)?`,
      [`genitivo`, `nominativo`, `accusativo`, `prepositivo`],
      0,
      `La negazione нет regge il genitivo: У меня́ есть брат diventa У меня́ нет бра́та, con la desinenza -а.`,
    ),
    q(
      'q6',
      `Quale frase significa «Questa è mia sorella»?`,
      [`Э́то моя́ сестра́.`, `Э́та моя́ сестра́ есть.`, `Я сестра́ моя́.`, `Э́то мой сестра́.`],
      0,
      `Э́то è invariabile e introduce la persona; моя́ concorda con сестра́, che è femminile.`,
    ),
    q(
      'q7',
      `Come si legge «у него́» nella frase «У него́ есть маши́на»?`,
      [`u ni-VO`, `u ye-GO`, `u ne-GO`, `u i-VO`],
      0,
      `Dopo una preposizione il pronome prende una н- (у него́) e la г di -ого/-его si legge v: [u ni-VO].`,
    ),
    q(
      'q8',
      `Qual è il futuro di «быть» alla prima persona?`,
      [`бу́ду`, `был`, `есть`, `бы́ло`],
      0,
      `Il futuro di быть si coniuga бу́ду, бу́дешь, бу́дет; был è il passato e есть è il presente.`,
    ),
    q(
      'q9',
      `Come si dice «Ho venti anni»?`,
      [`Мне два́дцать лет.`, `Мне два́дцать го́да.`, `У меня́ два́дцать лет.`, `Я два́дцать лет.`],
      0,
      `L'età si dice con il dativo мне e la parola лет dopo i numeri da 5 in su: Мне два́дцать лет.`,
    ),
    q(
      'q10',
      `Che cosa significa «Здесь нельзя́ кури́ть»?`,
      [`Qui non si può fumare.`, `Qui si può fumare.`, `Qui non c'è fumo.`, `Qui nessuno fuma.`],
      0,
      `Нельзя́ esprime un divieto («non si può»), mentre мо́жно esprime il permesso: qui è vietato fumare.`,
    ),
    q(
      'q11',
      `Come si dice «Mi piacciono i libri»?`,
      [`Мне нра́вятся кни́ги.`, `Мне нра́вится кни́ги.`, `Я нра́вятся кни́ги.`, `Мне нра́вятся книг.`],
      0,
      `La cosa che piace è il soggetto e va al plurale: нра́вятся e кни́ги, mentre la persona è al dativo мне.`,
    ),
  ],
  [
    card('c1', `Presente senza «essere»`, `Я студе́нт. Она́ врач. Мы италья́нцы. Nessun verbo, nessun articolo.`),
    card('c2', `Э́то`, `Invariabile: Э́то кни́га. Э́то Ма́рко. Что э́то? Кто э́то? Э́то моя́ сестра́.`),
    card('c3', `У меня́ есть`, `Avere: у + genitivo + есть + cosa. У меня́ есть брат [u mi-NIA IEST' BRAT].`),
    card(
      'c4',
      `Pronomi dopo у`,
      `у меня́, у тебя́, у него́, у неё, у нас, у вас, у них. Dopo preposizione lui/lei/loro (его́, её, их) prendono н-.`,
    ),
    card('c5', `Нет + genitivo`, `У меня́ нет вре́мени. Здесь нет магази́на. Maschile -а/-я, femminile -ы/-и.`),
    card(
      'c6',
      `Был, была́, бы́ло, бы́ли`,
      `Passato di быть concorda con il soggetto: он был, она́ была́, оно́ бы́ло, они́ бы́ли.`,
    ),
    card('c7', `Futuro di быть`, `бу́ду, бу́дешь, бу́дет, бу́дем, бу́дете, бу́дут. За́втра я бу́ду до́ма.`),
    card(
      'c8',
      `Professioni`,
      `студе́нт, врач, учи́тель, инжене́р, журнали́ст, по́вар, официа́нт. Врач resta maschile anche per una donna.`,
    ),
    card(
      'c9',
      `Dativo dei pronomi`,
      `мне, тебе́, ему́, ей, нам, вам, им. Età: Мне два́дцать пять лет. Ско́лько тебе́ лет? (год, го́да, лет).`,
    ),
    card(
      'c10',
      `Мне нра́вится / на́до`,
      `Мне нра́вится (+ sing.) / нра́вятся (+ pl.): piace. Мне на́до / ну́жно + infinito: devo. Нельзя́: non si può. Мне хо́лодно.`,
    ),
    card(
      'c11',
      `Dativo dei nomi (blocchi)`,
      `к врачу́ (dal medico), Я звоню́ ма́ме (telefono alla mamma), Помоги́те мне (aiutatemi). Il dativo risponde a кому́? (a chi?): -у/-ю maschile, -е femminile.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Io sono medico», «Lui è insegnante», «Noi siamo italiani».`,
      `Я врач. [ia VRAC] — Он учи́тель. [ON u-CI-til'] — Мы италья́нцы. [my i-tal'-IAN-tsy]. Nessun verbo essere al presente.`,
    ),
    prac(
      `p2`,
      `Come dici «Ho una sorella» e «Non ho una sorella»?`,
      `У меня́ есть сестра́. [u mi-NIA IEST' sis-TRA] — У меня́ нет сестры́. [u mi-NIA NIET sis-TRY]. Nella negazione сестра́ diventa сестры́ (genitivo).`,
    ),
    prac(
      `p3`,
      `Completa con был / была́ / бы́ло / бы́ли: Вчера́ мой брат ___ до́ма. Вчера́ мы ___ в Ри́ме.`,
      `был (брат è maschile); бы́ли (noi = plurale). Il passato di быть concorda con il genere e il numero del soggetto.`,
    ),
    prac(
      `p4`,
      `Rispondi in russo: Кто э́то? (una persona che conosci) / Что э́то? (un libro).`,
      `Э́то Ма́рко. [E-ta MAR-ka] — Э́то кни́га. [E-ta KNI-ga]. Э́то rimane invariato.`,
    ),
    prac(
      `p5`,
      `Dì: «Domani sarò a casa» e «Non c'è un negozio qui».`,
      `За́втра я бу́ду до́ма. [ZAF-tra ia BU-du DO-ma] — Здесь нет магази́на. [ZDIES' NIET ma-ga-ZI-na].`,
    ),
    prac(
      `p6`,
      `Traduci: «Ho 30 anni», «Mi piace la musica», «Devo lavorare», «Qui non si può fumare».`,
      `Мне три́дцать лет. [mnie TRI-tsat' LIET] — Мне нра́вится му́зыка. [mnie NRA-vi-tsa MU-zy-ka] — Мне на́до рабо́тать. [mnie NA-da ra-BO-tat'] — Здесь нельзя́ кури́ть. [ZDIES' nil'-ZIA ku-RIT'].`,
    ),
  ],
)

export const russoA: CourseModule[] = [
  ruAlfabeto,
  ruPron,
  ruSaluti,
  ruEssere,
  ruNomi,
  ruAggettivi,
  ruPresente,
  ruCasi1,
  ruDomande,
  ruPassato,
  ruMoto,
]
