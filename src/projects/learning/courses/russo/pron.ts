import { vtable } from '../vocabTable'

// Legend of the Italian-based pronunciation notation used by ALL the russo.* modules.
// The reference is the ru-pron lesson in russo.a.ts: keep the two in sync. The mechanical check is respell.test.ts.
// Rules in short: syllables joined by "-", STRESSED syllable in CAPS (content monosyllables CAPS, function words
// lowercase); sh = ш; zh = ж; shsh = щ (long, soft sh); ts = ц; c/ci = ч as in Italian spelling (c before e/i,
// ci before a/o/u, c alone at the end or before a consonant); h = х; y = ы (also и after ж ш ц); ' = ь softness
// only after d t n l s z r b p m v f and only at the end or before a consonant (never after ч ш щ ж);
// ia/ie/iu/io after a consonant = soft consonant + vowel; ss = s between vowels; z = voiced s (rosa); g = hard,
// gh before e/i; k always for к; reduction written as heard: unstressed о/а = a, unstressed е/я = i (final: ie/ia),
// unstressed е/и after ж ш ц = y; -ться/-тся = tsa; final devoicing and voicing assimilation written as heard
// (хлеб [HLIEP], вход [FHOT]); ь/ъ + vowel = C' + iV in a new syllable (семья́ [sim'-IA], подъе́зд [pad-IEST]);
// unstressed а after ч щ and soft consonants = i; loanwords may keep a hard consonant before е ([in-ter-NET]).
// One-syllable words carry no stress mark (checked in respell.test.ts).

export const PRON_FULL = `<p><b>Come leggere le trascrizioni [ ]</b> (niente IPA, solo lettere italiane): sillabe separate da «-», <b>sillaba accentata in MAIUSCOLO</b>; le parole grammaticali atone (в, на, и, не, с...) restano minuscole. <b>sh</b> = ш, la «sc» di <i>scena</i> (dura, lingua indietro); <b>zh</b> = ж, la «j» francese di <i>jour</i>; <b>shsh</b> = щ, una «sc» lunga e morbida; <b>ts</b> = ц, come la «z» di <i>zio</i>; <b>c</b> / <b>ci</b> = ч come l'italiano (c davanti a e, i; ci davanti a a, o, u: <i>ciao</i>; anche alla fine o davanti a consonante); <b>h</b> = х, raschiata come la jota spagnola; <b>y</b> = ы (una «i» detta con la lingua indietro); <b>z</b> = з, la «s» sonora di <i>rosa</i> (<b>non</b> come in <i>zio</i>); <b>ss</b> = s sorda tra due vocali (<i>sole</i>); <b>gh</b> = г davanti a e, i; <b>k</b> = к. <b>ia, ie, iu, io</b> dopo una consonante = consonante morbida + vocale (я, е, ю, ё); <b>'</b> = ь, consonante finale o davanti a consonante resa morbida (мать [MAT']). Le vocali atone sono scritte come si sentono: о atona = <b>a</b> (молоко́ [ma-la-KO]), е/я atone = <b>i</b> (река́ [ri-KA]).</p>
<p><b>Attenzione a due lettere</b>: la <b>c</b> alla fine o davanti a consonante è sempre ч, mai k (врач [VRAC], ночь [NOC]); la <b>z</b> è la s sonora di <i>rosa</i>, mai ts.</p>
<ul><li><b>Dopo ж, ш, ц</b> una е o и atona si scrive <b>y</b> (sono consonanti sempre dure): мо́жет [MO-zhyt], цена́ [tsy-NA], ста́нция [STAN-tsy-ia]. Anche la «и» accentata dopo queste lettere suona ы: жизнь [ZHYZN'], цирк [TSYRK].</li><li><b>-ться</b> e <b>-тся</b> = <b>tsa</b>: учи́ться [u-CI-tsa], нра́вится [NRA-vi-tsa].</li><li><b>Assimilazione</b>: le consonanti finali sonore diventano sorde e in gruppo ci si adegua alla vicina, come si sente: хлеб [HLIEP], вход [FHOT], сде́лать [ZDIE-lat'], футбо́л [fud-BOL].</li><li><b>ь o ъ + vocale</b>: la consonante morbida + apostrofo, poi la vocale iotizzata in una nuova sillaba: семья́ [sim'-IA], бра́тья [BRAT'-ia], воскресе́нье [vas-kri-SIEN'-ie]; con ъ: подъе́зд [pad-IEST]. Dopo ч, ш, щ, ж il ь non cambia il suono: но́чью [NO-ciu]. Nelle forme di пить la sillaba è una sola: пью [PIU], пьёшь [PIOSH].</li><li><b>а atona</b> dopo ч, щ e dopo consonante morbida suona <b>i</b>: часа́ [ci-SA], часы́ [ci-SY]. Dopo consonante dura è una a breve.</li><li>Nei <b>prestiti</b> la consonante prima di е resta spesso dura: интерне́т [in-ter-NET], су́пер [SU-per] (la е è scritta senza «i»).</li></ul>`

export const PRON_SHORT = `<p><i>Trascrizioni [ ]: sillaba accentata in MAIUSCOLO; sh = ш («scena»); zh = ж (j francese); shsh = щ (sc lunga e morbida); ts = ц; c/ci = ч («ciao»; <b>c</b> = c di «ciao», anche a fine parola o prima di consonante: врач [VRAC], non k); h = х raschiata; y = ы (anche и/е atone dopo ж ш ц); ' = consonante morbida (ь); ia/ie/iu/io = я/е/ю/ё dopo consonante; ss = s sorda tra vocali; z = s sonora di «rosa» (non come in «zio»); -ться = tsa; vocali atone ridotte come si sentono.</i></p>`

/** Vocabulary section: a heading plus a narrow 2-column table (Russo word + [pronunciation], Italian). Rows from
 * words.ts: vsecW in ./vsecw.ts (same HTML). */
export const vsec = (heading: string, rows: [string, string, string][]): string => vtable('Russo', heading, rows)
