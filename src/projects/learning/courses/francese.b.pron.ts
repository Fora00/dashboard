// Legend of the Italian-based pronunciation notation used by the francese.b.* modules.
// Full version (vocabulary, dialogues, variants) and a one-line version (grammar modules).

export const PRON_FULL = `<p><b>Come leggere le trascrizioni [ ]</b> (niente IPA, solo lettere italiane). Regole fisse per tutto il corso:</p>
<ul>
<li><b>Sillabe</b> separate da «-» (il trattino non è una pausa) e <b>ultima sillaba del gruppo in MAIUSCOLO</b>: in francese l'appoggio cade lì, non sulla penultima come in italiano. Gli spazi separano le parole.</li>
<li><b>é</b> chiusa (sete), <b>è</b> aperta (bello). <b>j'ai</b> = [zhé] (chiusa) sempre; <b>-ais/-ait/-aient</b> e <b>merci</b> = è aperta ([mèr-SI]). Molti parigini fondono é/è: non è un errore.</li>
<li><b>ë</b> = e debole, brevissima, labbra un po' tonde, spesso muta. <b>Mai in MAIUSCOLO</b>: se il gruppo finisce con de, que, ne, l'appoggio resta sulla sillaba prima (près de [PRÈ dë], beaucoup de [bo-KU dë], parce que [par-skë]).</li>
<li><b>o</b> chiusa (rosa), <b>ò</b> aperta (porta): ò davanti a consonante pronunciata (PÒRT, SÒR), o chiusa in sillaba finale o scritta ô, au, eau (BO, ROZ, sho-ZE).</li>
<li><b>u</b> = u italiana (si scrive «ou»); <b>ü</b> = «i» con le labbra a «u»; <b>ö</b> = «e» con le labbra a «o» (eu, œu); <b>ua</b> = oi (MUA).</li>
<li><b>Nasali</b>: vocale con tilde (<b>õ ã ẽ</b>), la n/m non si pronuncia (BÕ). La vocale resta nasale anche davanti a una liaison: on est [õ-nè], mon ami [mõ-na-MI].</li>
<li><b>zh</b> = j dolce (come la «g» di «gente» senza la «d»); <b>sh</b> = ch (sc di «scena»); <b>y</b> = i veloce, SEMPRE y e mai i per la semivocale: bien [BYẼ], nous parlions [par-LYÕ], addition [a-di-SYÕ]; <b>r</b> = r di gola, mai arrotata.</li>
<li><b>Liaison</b>: la consonante che si lega si scrive attaccata alla sillaba seguente: ils ont [il-ZÕ], nous avons [nu-za-VÕ], un ami [ẽ-na-MI]. <b>Consonanti finali senza vocale</b>: table [TABL], quatre [KATR] (non «tabele»).</li>
</ul>`

export const PRON_SHORT = `<p><i>Trascrizioni [ ]: ultima sillaba del gruppo in MAIUSCOLO; é/è come in italiano (j'ai = zhé, -ais = è); ë = e muta; ü = i a labbra tonde; ö = e a labbra tonde; õ ã ẽ = nasali (n non pronunciata); zh = j dolce; sh = ch; y = i veloce (BYẼ, LYÕ); ua = oi; consonanti finali senza vocale (TABL); liaison attaccata alla sillaba dopo (il-ZÕ).</i></p>`

/** Vocabulary section: a heading plus a narrow 2-column table (French word + [pronunciation], Italian). */
export const vsec = (heading: string, rows: [string, string, string][]): string =>
  `<h3>${heading}</h3><div class="tblw"><table><tr><th>Francese</th><th>Italiano</th></tr>${rows
    .map(([fr, pr, it]) => `<tr><td>${fr} [${pr}]</td><td>${it}</td></tr>`)
    .join('')}</table></div>`
