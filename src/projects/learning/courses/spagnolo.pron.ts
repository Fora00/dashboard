// Legend of the Italian-based pronunciation notation used by ALL the spagnolo.* modules (A and B halves).
// The reference is the es-pron lesson in spagnolo.a.ts: keep the two in sync.
// Full version (vocabulary, dialogues, variants) and a one-line version (grammar modules).
// Rules in short: ss = voiceless s (also between vowels, and in seseo: GRA-ssias); dh = soft d (between vowels,
// after r/s, final; NOT after n/l; in the dr cluster madre/Madrid the d is written plain); y = consonant i for ll/y; h = jota (NEVER silent); th = English "think" (Spain);
// gn = n tilde; gh/ghi = hard g before e/i; c before i/e/o/a/u as in "cena" = Spanish ch; rr = rolled r;
// Rioplatense ll/y = sc (calle [KA-sce]); aspirated s = h (los amigos [loh a-MI-goh]).
// Function words (articles, short prepositions, possessives, unstressed pronouns, que, y) are lowercase;
// content monosyllables (hay, soy, doy) are capitalised.

export const PRON_FULL = `<p><b>Come leggere le trascrizioni [ ]</b> (niente IPA, solo lettere italiane): le sillabe sono separate da «-» e la <b>sillaba accentata è in MAIUSCOLO</b>. Le parole grammaticali atone (articoli, preposizioni brevi, que, y) restano minuscole. <b>th</b> = «th» inglese di <i>think</i> (Spagna; in America leggi <b>s</b>); <b>h</b> = jota, h raschiata (come la «ch» tedesca di <i>Bach</i>), <b>mai muta come in italiano</b> (la h muta dello spagnolo non si scrive); <b>ss</b> = s sempre sorda («sole», mai «z»), breve, non è una doppia; <b>dh</b> = d morbida, come «th» di <i>this</i>; <b>gn</b> = ñ, come «gnocchi» ma breve; <b>gh</b> = g dura davanti a e, i; <b>c</b> (ci, ce, cia, cio) = la <i>ch</i> spagnola, come la «c» di «cena»; <b>y</b> = i consonantica («ieri»), è il suono di ll e y; <b>rr</b> = r vibrata multipla; <b>ks</b> = x. Rioplatense: <b>sce</b> per ll/y (calle [KA-sce]). <b>-s aspirata</b>: la «h» finale indica un soffio (los amigos [loh a-MI-goh]). La b rappresenta sia b sia v.</p>`

export const PRON_SHORT = `<p><i>Trascrizioni [ ]: sillaba accentata in MAIUSCOLO; th = «think» (America: s); h = jota raschiata (mai muta); ss = s sorda (anche tra vocali); dh = d morbida («this»); gn = ñ; gh = g dura; c = ch spagnola («cena»); y = ll/y come «ieri»; rr = r vibrata.</i></p>`

/** Vocabulary section: a heading plus a narrow 2-column table (Spanish word + [pronunciation], Italian). */
export const vsec = (heading: string, rows: [string, string, string][]): string =>
  `<h3>${heading}</h3><div class="tblw"><table><tr><th>Spagnolo</th><th>Italiano</th></tr>${rows
    .map(([es, pr, it]) => `<tr><td>${es} [${pr}]</td><td>${it}</td></tr>`)
    .join('')}</table></div>`
