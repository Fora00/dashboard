import { card, mod, prac, q } from '../kit'
import { PRON_FULL, PRON_SHORT } from './b.pron'
import { franceseA2 } from './a.2'
import { franceseA3 } from './a.3'

// FRENCH course, part A (A1 + A2), for an Italian native. Pronunciation notation = francese.b.pron.ts
// (Italian-based respelling in [ ], final syllable in CAPITALS, no IPA).
//
// CLAIMS I AM NOT 100% SURE ABOUT (reviewers: please check):
// - fr-saluti: "cent un" / "vingt et un" spelling follows the traditional rule (hyphens only up to 99); the 1990
//   reform allows hyphens everywhere (cent-un). Swiss "huitante" is not mentioned on purpose.
// - fr-nomi: list of -ou plurals in -x (bijou, caillou, chou, genou, hibou, joujou, pou) and of -al plurals in -s
//   (bal, carnaval, festival, récital, régal); gender exceptions (-age: page/plage/image/cage/nage/rage).
// - fr-nomi/fr-etre: respelling of "un" as [Ẽ] (the old [ŒẼ] distinction is merged in standard Paris French).
// - fr-pron: "ö" is used for both "eu" closed (deux) and open (peur); "o" open/closed rule is a tendency, not a law.
// - fr-presente: "je paie / je paye" both accepted; "j'appelle" (double l) vs "j'achète" (accent) both listed.
// - fr-passecompose: accord of the participle for "se + COI" (elles se sont parlé) follows the standard rule.
// - fr-imperatif: "Va" without -s except before y/en ("vas-y"); "Ne t'en va pas" is not listed because it is rare.
// - fr-confronti: "plus bon" is wrong but "plus mauvais / pire" both fine; "pis" only in set phrases (tant pis).
// - Respellings (fixed in the council fix round): j'ai = closed [zhé]; -ais/-ait/-aient and merci = open [è]; y for the glide
//   (BYẼ, LYÕ); nasal = tilde vowel; liaison consonant joined to the next syllable (il-ZÕ); o/ò by the rule in fr-pron.
// - Respellings of e muta in futur/conditionnel: parlerai [par-lë-RÉ] (e kept) but prendrai [prã-DRÉ], voudrai [vu-DRÉ],
//   devrai [dë-VRÉ] (e dropped); real speech varies. "lui en" given without liaison [lüi ã DÒN].
// - fr-pron: "o" in "nos/vos" closed [NO/VO] vs "notre/votre" open [NÒTR/VÒTR]; "hôtel" [o-TÈL]; "forêt" [fò-RÈ] (o aperta).
// - fr-presente: "vous voyions" style forms not used; "nous voyions [vua-YÕ]" simplifies the double y sound.

export const fpron = mod(
  'fr-pron',
  'Pronuncia, accenti e ortografia',
  'Alfabeto, u/eu/œ, nasali, e muta, r, liaison, lettere mute, accenti e cédille',
  'a1',
  `<p class="lead">Il francese si scrive in un modo e si dice in un altro. Tre regole: molte lettere finali sono mute, le parole si legano fra loro e non c'è accento sulla singola parola.</p>
${PRON_FULL}
<h3>Ritmo: nessun accento di parola</h3>
<p>In italiano una sillaba di ogni parola pesa di più (ORdine). In francese tutte le sillabe sono uguali e l'appoggio cade solo sull'ultima sillaba del <b>gruppo ritmico</b> (le parole che si dicono d'un fiato). Trappola: <i>ordinateur</i> [òr-di-na-TÖR], mai «ORdinatör»; <i>important</i> [ẽ-pòr-TÃ]; <i>Je ne sais pas</i> [zhë në sè PA], nel parlato [zhën sè PA].</p>
<p><b>La ë (e muta)</b>: è un suono brevissimo, a metà tra e e ö. In fondo alla parola è muta (<i>table</i> [TABL], <i>porte</i> [PÒRT]). Tra due vocali pronunciate cade (<i>samedi</i> [sam-DI]); si tiene per evitare tre consonanti di fila (<i>vendredi</i> [vã-drë-DI], <i>mercredi</i> [mèr-krë-DI]); all'inizio si dice (<i>le</i> [lë], <i>petit</i> [pë-TI]).</p>
<h3>Le vocali</h3>
<table><tr><th>Si scrive</th><th>Si dice</th><th>Esempi</th></tr>
<tr><td>a, à, â</td><td>a come in italiano</td><td>ma [MA], là [LA]</td></tr>
<tr><td>é, -er, -ez, et, -es</td><td>é chiusa (sete)</td><td>café [ka-FÉ], parler [par-LÉ], chez [SHÉ], et [É], des [DÉ]</td></tr>
<tr><td>è, ê, ai, ei</td><td>è aperta (bello)</td><td>père [PÈR], mais [MÈ], neige [NÈZH]</td></tr>
<tr><td>e senza accento</td><td>ë debole, spesso cade</td><td>je [zhë], petit [pë-TI], table [TABL]</td></tr>
<tr><td>ou, où</td><td>u (come lupo)</td><td>vous [VU], tout [TU], où [U]</td></tr>
<tr><td>u, û</td><td>ü (sotto)</td><td>tu [TÜ], rue [RÜ], sûr [SÜR]</td></tr>
<tr><td>eu, œu</td><td>ö (sotto)</td><td>deux [DÖ], sœur [SÖR], œuf [ÖF]</td></tr>
<tr><td>au, eau, ô</td><td>o chiusa</td><td>chaud [SHO], beau [BO], hôtel [o-TÈL]</td></tr>
<tr><td>o + consonante detta</td><td>ò aperta</td><td>porte [PÒRT], école [é-KÒL]</td></tr>
<tr><td>oi, ui</td><td>ua / üi</td><td>moi [MUA], nuit [NÜI]</td></tr></table>
<p><b>ü</b>: di' «i» e, senza muovere la lingua, arrotonda le labbra come per fischiare. Coppia da allenare: <i>tu</i> [TÜ] ≠ <i>tout</i> [TU]. <b>ö</b>: di' «é» chiusa e arrotonda le labbra come per «o»; è un po' più aperta davanti a r, l, f detti (<i>peur</i>, <i>fleur</i>, <i>œuf</i>), noi la scriviamo sempre ö. Eccezione: <i>eu</i> participio di avoir = ü (<i>j'ai eu</i> [zhé Ü]).</p>
<p><b>La o aperta o chiusa</b>: ò aperta davanti a consonante detta (<i>porte</i> [PÒRT], <i>homme</i> [ÒM], <i>donner</i> [dò-NÉ], <i>octobre</i> [ok-TÒBR]); o chiusa in fondo alla parola (<i>vélo</i> [vé-LO], <i>trop</i> [TRO]), davanti a z (<i>rose</i> [ROZ], <i>chose</i> [SHOZ]) e quando si scrive ô, au, eau. Sono tendenze, non leggi: una o sbagliata non impedisce di farsi capire.</p>
<h3>Le nasali: la n non si dice</h3>
<table><tr><th>Grafia</th><th>Suono</th><th>Esempi</th></tr>
<tr><td>an, am, en, em</td><td>ã</td><td>dans [DÃ], vent [VÃ], temps [TÃ]</td></tr>
<tr><td>on, om</td><td>õ</td><td>bon [BÕ], nom [NÕ], monde [MÕD]</td></tr>
<tr><td>in, im, ain, ein, un</td><td>ẽ</td><td>vin [VẼ], pain [PẼ], un [Ẽ]</td></tr>
<tr><td>ien, oin</td><td>yẽ, uẽ</td><td>bien [BYẼ], loin [LUẼ]</td></tr></table>
<p>Tecnica: tieni la bocca nella posizione della vocale e lascia uscire l'aria dal naso. Non aggiungere una «ng» (bon non è «bong»). La ã è una a arretrata, quasi una «o» aperta nasale. È nasale solo se n/m è finale o davanti a consonante; davanti a vocale o raddoppiata torna una n vera: <i>bon</i> [BÕ] / <i>bonne</i> [BÒN], <i>fin</i> [FẼ] / <i>fine</i> [FIN], <i>un</i> [Ẽ] / <i>une</i> [ÜN]. Casi particolari: <i>-emm-</i> = am (<i>femme</i> [FAM], <i>évidemment</i> [é-vi-da-MÃ]); <i>-en</i> dopo i o é = ẽ (<i>bien</i> [BYẼ], <i>examen</i> [èg-za-MẼ]).</p>
<h3>Le consonanti diverse dall'italiano</h3>
<table><tr><th>Grafia</th><th>Suono</th><th>Esempi</th></tr>
<tr><td>ch</td><td>sh (sc di scena)</td><td>chat [SHA], riche [RISH]</td></tr>
<tr><td>j, g + e/i</td><td>zh (j dolce)</td><td>jour [ZHUR], manger [mã-ZHÉ]</td></tr>
<tr><td>g + a/o/u, gu</td><td>g / gh</td><td>gare [GAR], guerre [GÈR]</td></tr>
<tr><td>gn</td><td>gn come gnocchi</td><td>montagne [mõ-TAGN]</td></tr>
<tr><td>ill, il finale</td><td>y</td><td>fille [FIY], travail [tra-VAY]; ma ville [VIL], mille [MIL]</td></tr>
<tr><td>ç, c + e/i</td><td>s</td><td>garçon [gar-SÕ], merci [mèr-SI]</td></tr>
<tr><td>s tra vocali</td><td>z (ss = s)</td><td>poison [pua-ZÕ] ≠ poisson [pua-SÕ]</td></tr>
<tr><td>h</td><td>sempre muta</td><td>homme [ÒM]; h aspirata: le héros [lë é-RO]</td></tr>
<tr><td>tion</td><td>syõ</td><td>nation [na-SYÕ]</td></tr>
<tr><td>qu</td><td>k</td><td>qui [KI], que [kë]</td></tr></table>
<p><b>r</b>: non la r arrotata: pronuncia una «g» dura sfregata in fondo alla gola, con la punta della lingua ferma dietro i denti di sotto: <i>rue</i> [RÜ], <i>merci</i> [mèr-SI]. Anche in fondo alla parola e dopo consonante: <i>quatre</i> [KATR], <i>pauvre</i> [POVR].</p>
<h3>Come dirlo bene: le trappole dell'italiano</h3>
<ul>
<li><b>Doppie non raddoppiate</b>: <i>elle</i> [ÈL], <i>pomme</i> [PÒM], <i>personne</i> [pèr-SÒN]: la consonante doppia è breve. Dire «pòm-me» o «bèl-le» è un accento italiano.</li>
<li><b>sc + e/i = s</b>, non sh: <i>scène</i> [SÈN], <i>science</i> [SYÃS], <i>descendre</i> [dé-SÃDR]. Con a/o/u resta sk: <i>escalier</i> [ès-ka-LYÉ].</li>
<li><b>x</b>: gz in ex- + vocale (<i>examen</i> [èg-za-MẼ], <i>exemple</i> [èg-ZÃPL]); ks in <i>taxi</i> [tak-SI], <i>texte</i> [TÈKST]; s in <i>six</i> [SIS], <i>soixante</i> [sua-SÃT]; z in <i>deuxième</i> [dö-ZYÈM]; muta in <i>deux</i> [DÖ], <i>prix</i> [PRI].</li>
<li><b>ti = si</b> in <i>-tion</i>, <i>patient</i> [pa-SYÃ], <i>démocratie</i> [dé-mo-kra-SI]; ma resta t dopo s e nei verbi: <i>question</i> [kès-TYÕ], <i>nous étions</i> [é-TYÕ].</li>
<li><b>ch = k</b> in parole di origine greca: <i>chœur</i> [KÖR], <i>orchestre</i> [òr-KÈSTR]. <b>th = t</b> (<i>thé</i> [TÉ]); <b>ph = f</b> (<i>photo</i> [fo-TO]).</li>
<li><b>Consonanti finali senza vocale</b>: <i>table</i> [TABL], <i>quatre</i> [KATR], <i>livre</i> [LIVR], <i>peuple</i> [PÖPL]. L'italiano tende ad aggiungere una «-e» o «-o»: chiudi la parola subito, senza vocale.</li>
</ul>
<h3>Lettere finali mute</h3>
<p>Di norma la consonante finale non si dice: <i>petit</i> [pë-TI], <i>grand</i> [GRÃ], <i>trois</i> [TRUA], <i>ils parlent</i> [il PARL]. Si dicono spesso c, r, f, l (CaReFuL): <i>sac</i> [SAK], <i>bar</i> [BAR], <i>neuf</i> [NÖF], <i>bal</i> [BAL]. L'infinito in <i>-er</i> finisce in é: <i>parler</i> [par-LÉ]. Eccezioni da sapere: <i>sept</i> [SÈT] e <i>huit</i> [ÜIT] si dicono; <i>porc</i> [PÒR], <i>tabac</i> [ta-BA], <i>clef</i> [KLÉ] sono muti; <i>fils</i> [FIS] (figlio) ma <i>fille</i> [FIY]; <i>août</i> [UT].</p>
<h3>H aspirata e h muta</h3>
<p>La h non si dice mai, ma la h <b>aspirata</b> blocca élision e liaison, come se la parola iniziasse per consonante. Da imparare: <i>héros</i>, <i>haricot</i> [a-ri-KO], <i>honte</i> [ÕT], <i>haut</i> [O], <i>hasard</i> [a-ZAR], <i>hibou</i> [i-BU], <i>hockey</i> [ò-KÈ], <i>hamster</i>, <i>handicap</i>, <i>hall</i>. Con h aspirata: <i>le haricot</i>, <i>les haricots</i> [lé a-ri-KO], <i>en haut</i> [ã O]. Con h muta si lega: <i>l'homme</i> [LÒM], <i>les hommes</i> [lé-zòm], <i>l'heure</i>, <i>l'hôtel</i>.</p>
<h3>Legare le parole</h3>
<ul><li><b>Enchaînement</b>: la consonante finale pronunciata si appoggia alla vocale dopo: <i>elle a</i> [è-LA], <i>une amie</i> [ü-na-MI].</li><li><b>Liaison</b>: la consonante muta torna davanti a vocale, nei legami stretti. Mai dopo <i>et</i> (<i>et ils</i> [é-IL]) e mai davanti a h aspirata (<i>les héros</i> [lé é-RO]).</li><li><b>Élision</b>: <i>le, la, je, ne, de, que</i> perdono la vocale davanti a vocale o h muta: <i>l'ami</i> [la-MI], <i>j'ai</i> [zhé], <i>qu'il</i> [KIL].</li></ul>
<table><tr><th>Lettera</th><th>Suona</th><th>Esempi</th></tr>
<tr><td>s, x, z</td><td>z</td><td>les amis [lé-za-MI], nous avons [nu-za-VÕ], deux ans [dö-ZÃ]</td></tr>
<tr><td>t, d</td><td>t</td><td>petit ami [pë-ti-ta-MI], grand homme [grã-TÒM]</td></tr>
<tr><td>n</td><td>n (la vocale resta nasale)</td><td>un ami [ẽ-na-MI], mon ami [mõ-na-MI], en avion [ã-na-vyÕ]</td></tr>
<tr><td>f</td><td>v</td><td>neuf ans [nö-VÃ], neuf heures [nö-VÖR]</td></tr>
<tr><td>g</td><td>k (raro)</td><td>un long hiver [ẽ lõ-ki-VÈR]</td></tr></table>
<p><b>Obbligatoria</b>: articolo o aggettivo + nome (<i>un ami</i>, <i>mes amis</i>), pronome + verbo (<i>ils ont</i> [il-ZÕ], <i>vous avez</i> [vu-za-VÉ]), parole corte come <i>en, dans, chez, sans, très, plus, bien</i> (<i>dans un mois</i> [dã-zẽ-MUA], <i>très utile</i> [trè-zü-TIL]), i numeri (<i>trois ans</i> [trua-ZÃ]), <i>c'est</i> (<i>c'est un</i> [sè-tẽ]). <b>Vietata</b>: dopo <i>et</i>; davanti a h aspirata; tra nome soggetto e verbo (<i>les enfants arrivent</i> [lé-zã-fã a-RIV]); dopo un nome singolare (<i>un étudiant américain</i>); davanti a <i>onze</i> e <i>oui</i>. <b>Facoltativa</b>: dopo la maggior parte dei verbi e degli avverbi (<i>vous êtes ici</i>, <i>pas encore</i>): nel dubbio <b>non legare</b>, resti comprensibile e naturale; leghi solo dove è obbligatoria.</p>
<h3>Intonazione</h3>
<ul><li>Frase affermativa: sale poco e <b>scende</b> alla fine: <i>Il pleut.</i> ↘</li><li>Domanda sì/no: <b>sale</b> sull'ultima sillaba: <i>Tu viens ?</i> [tü VYẼ] ↗</li><li>Domanda con parola interrogativa: scende: <i>Où vas-tu ?</i> [u va-TÜ] ↘</li><li>Elenco: ogni elemento sale, l'ultimo scende: <i>du pain, du lait, des œufs</i> ↗ ↗ ↘</li></ul>
<h3>Accenti e ortografia</h3>
<p>é (chiusa), è/ê (aperta), à/ù (distinguono <i>a</i>/<i>à</i>, <i>ou</i>/<i>où</i>), â î ô û (circonflesso: spesso una s antica, <i>forêt</i> [fò-RÈ]), ë ï (tréma: <i>Noël</i> [nò-ÈL]), ç (s davanti a a/o/u), œ (<i>cœur</i> [KÖR]).</p>
<h3>Coppie minime</h3>
<p><b>Si distinguono</b>: <i>dessus</i> [dë-SÜ] / <i>dessous</i> [dë-SU]; <i>deux</i> [DÖ] / <i>doux</i> [DU]; <i>rue</i> [RÜ] / <i>roue</i> [RU]; <i>vin</i> [VẼ] / <i>vent</i> [VÃ] / <i>vont</i> [VÕ] (tre nasali diverse); <i>bon</i> [BÕ] / <i>bain</i> [BẼ] / <i>banc</i> [BÃ]; <i>peu</i> [PÖ] / <i>peur</i> [PÖR]; <i>père</i> [PÈR] / <i>peur</i>; <i>fait</i> [FÈ] / <i>fée</i> [FÉ]; <i>le</i> [lë] / <i>les</i> [lé]; <i>poison</i> / <i>poisson</i>. <b>Suonano uguali</b> (si distinguono solo scrivendo): <i>sans</i>, <i>cent</i>, <i>sang</i> [SÃ]; <i>vin</i> e <i>vain</i> [VẼ]; <i>mer</i>, <i>mère</i>, <i>maire</i> [MÈR]. Per sentire ü, ö e le nasali non c'è audio: guarda la bocca allo specchio (labbra tonde, lingua avanti).</p>
<p><b>Parigi semplifica</b>: molti parlanti fondono é/è in fondo alla parola (<i>j'ai</i> / <i>je sais</i>, <i>parlé</i> / <i>parlais</i>), a/â (<i>patte</i> / <i>pâte</i>) e un/in (<i>brun</i> / <i>brin</i>). Il corso usa la pronuncia di Parigi e tiene le distinzioni scritte quando aiutano; se senti una fusione, non è un errore.</p>
<div class="say"><b>Cosa dire.</b> «Bonjour [bõ-ZHUR], je m'appelle Marco [zhë ma-PÈL mar-KO]. Enchanté [ã-shã-TÉ].» </div>`,
  [
    q(
      'q1',
      'Come si pronuncia «tu» (tu)?',
      [
        'tü: una i con le labbra tonde come per u',
        'tu: come la u italiana di «lupo»',
        'ti: come la i italiana di «tigre»',
        'tö: una e con le labbra tonde come per o',
      ],
      0,
      'La u francese è una i detta con le labbra tonde. La u italiana corrisponde a «ou» (tout), quindi leggere tu come lupo confonde due parole diverse.',
    ),
    q(
      'q2',
      'Qual è la differenza tra «bon» e «bonne»?',
      [
        'bon è nasale senza n [BÕ]; bonne ha una n vera [BÒN]',
        'bon e bonne suonano uguali, cambia solo la scrittura',
        'bon ha la n finale pronunciata [BÒN]; bonne è nasale',
        'bon è [BU] e bonne è [BÖN], con vocali diverse',
      ],
      0,
      'La nasale esiste solo se la n è finale o davanti a consonante. In bonne la n è raddoppiata e davanti alla e muta: si sente una n normale, quindi non è nasale.',
    ),
    q(
      'q3',
      'In quale coppia la liaison è vietata?',
      ['et ils [é-IL]', 'les amis [lé-za-MI]', 'nous avons [nu-za-VÕ]', 'un ami [Ẽ-na-MI]'],
      0,
      'Dopo «et» non si lega mai. Le altre tre coppie sono articolo+nome o pronome+verbo, dove la liaison è obbligatoria; per questo la tentazione è legarle tutte.',
    ),
    q(
      'q4',
      'Quale parola ha una z in mezzo (suono [z])?',
      ['poison [pua-ZÕ]', 'poisson [pua-SÕ]', 'passer [pa-SÉ]', 'dessert [dé-SÈR]'],
      0,
      'La s singola tra due vocali suona z (poison, maison). La doppia ss, come in poisson e passer, suona s: poisson è il pesce, poison il veleno.',
    ),
    q(
      'q5',
      'Quale di queste consonanti finali si pronuncia?',
      ['sac [SAK]', 'petit [pë-TI]', 'grand [GRÃ]', 'trois [TRUA]'],
      0,
      'Le consonanti c, r, f, l finali di solito si dicono (CaReFuL). Petit, grand e trois perdono la consonante finale: la t, la d e la s restano mute.',
    ),
    q(
      'q6',
      'Quale frase rispetta la h aspirata?',
      [
        "l'homme et le héros [lòm é lë é-RO]",
        "l'homme et l'héros [lòm é lé-RO]",
        'le homme et le héros [lë òm é lë é-RO]',
        "le homme et l'héros [lë òm é lé-RO]",
      ],
      0,
      "Homme ha h muta: l'homme con élision. Héros ha h aspirata: le héros senza élision né liaison. Scrivere l'héros sarebbe corretto solo per una h muta.",
    ),
    q(
      'q7',
      "Dove cade l'appoggio in «ordinateur» [òr-di-na-TÖR]?",
      [
        "sull'ultima sillaba del gruppo, le altre sono uguali",
        'sulla penultima sillaba, come in italiano «ordinatóre»',
        'sulla prima sillaba, come in italiano «ORdine»',
        'su una sillaba diversa a seconda del parlante',
      ],
      0,
      "In francese non c'è accento di parola: l'appoggio cade in fondo al gruppo. Accentare la penultima, come si fa in italiano, suona subito straniero.",
    ),
    q(
      'q8',
      'Come si legge «garçon»?',
      [
        'gar-SÕ: ç = s, on è nasale',
        'gar-KÕN: ç = k, n finale detta',
        'gar-CIÕ: ç = c di cena',
        'gar-ZÕ: ç = s sonora',
      ],
      0,
      'La cédille serve proprio a far dire s davanti a a, o, u. Senza cédille la c diventerebbe k; il suono c di «cena» non esiste in francese.',
    ),
    q(
      'q9',
      'Come si pronuncia «ils parlent»?',
      [
        'il PARL: la terminazione -ent è muta',
        'il par-LÃ: -ent come in «vent»',
        'ilz par-LÈNT: tutte le lettere dette',
        "il par-LÉ: -ent come l'infinito",
      ],
      0,
      'Nelle forme verbali -ent finale è solo scrittura: parle, parles e parlent suonano uguali. In «vent» è invece un nome, dove -ent è nasale.',
    ),
    q(
      'q10',
      'Quale parola NON si legge con il suono y (come «ieri») per -ill-?',
      ['ville [VIL]', 'fille [FIY]', 'famille [fa-MIY]', 'travail [tra-VAY]'],
      0,
      'Ville, mille e tranquille sono le eccezioni con -ill- letto come l. In fille, famille e travail si sente invece la i veloce: attenzione a non generalizzare.',
    ),
    q(
      'q11',
      'Come si legge «scène»?',
      ['SÈN: sc davanti a e/i vale s', 'SHÈN: sc come in «scena»', 'SKÈN: sc vale sempre sk', 'STSÈN: sc vale ts'],
      0,
      'Davanti a e e i il gruppo sc vale una s semplice, non la sc italiana di «scena». Con a, o, u resta invece sk, come in escalier e scolaire.',
    ),
    q(
      'q12',
      'Come si legge «examen»?',
      [
        'èg-za-MẼ: ex- davanti a vocale vale gz',
        'èk-sa-MÃ: x vale ks e an è nasale',
        'è-sa-MẼN: x vale s e la n si dice',
        'èg-za-MEN: x vale gz e la n si dice',
      ],
      0,
      "In ex- davanti a vocale la x suona gz e la -en dopo é o i è nasale ẽ. Dire ks come in taxi, o pronunciare la n, tradisce subito l'accento italiano.",
    ),
    q(
      'q13',
      'In quale parola la h è aspirata (blocca élision e liaison)?',
      [
        'haricot: le haricot, les haricots',
        "homme: l'homme, les hommes",
        "heure: l'heure, les heures",
        "hôtel: l'hôtel, les hôtels",
      ],
      0,
      'Haricot ha la h aspirata, per questo si dice le haricot senza élision. Homme, heure e hôtel hanno la h muta: si elide e si lega, come se non ci fosse.',
    ),
    q(
      'q14',
      'Che regola pratica vale per la liaison facoltativa?',
      [
        'Nel dubbio non legare: lega solo dove è obbligatoria',
        'Lega sempre: più leghi, più suoni francese',
        'Lega dopo i verbi, mai dopo gli articoli',
        'Lega solo davanti alle parole con la h',
      ],
      0,
      'Dopo molti verbi e avverbi la liaison è facoltativa e nel parlato corrente spesso manca. Legare dove non serve suona affettato, mentre dove è obbligatoria è un errore saltarla.',
    ),
    q(
      'q15',
      'In quale parola la o è chiusa?',
      ['rose [ROZ]', 'porte [PÒRT]', 'homme [ÒM]', 'note [NÒT]'],
      0,
      'Davanti a z la o è chiusa (rose, chose). Davanti a una consonante detta come r, m, t, come in porte, homme e note, la o è aperta.',
    ),
    q(
      'q16',
      'Come si legge «elle»?',
      [
        'ÈL: la doppia l è breve',
        'ÈL-le: due l come in italiano',
        'ÈLE: la e finale si dice',
        'ÈLL: una l lunga e tesa',
      ],
      0,
      "In francese le consonanti doppie non si raddoppiano: elle suona come una l sola. L'italiano «bèl-le» o «pòm-me» con la doppia è un accento straniero.",
    ),
  ],
  [
    card('c1', 'ü (tu, rue)', "Di' «i» e arrotonda le labbra come per fischiare. tu [TÜ] ≠ tout [TU]."),
    card('c2', 'ö (deux, sœur)', "Di' «é» chiusa e arrotonda le labbra come per «o»: deux [DÖ], sœur [SÖR], peu [PÖ]."),
    card(
      'c3',
      'ë (e muta)',
      'Vocale debole (je [zhë], petit [pë-TI]) che spesso cade; in fondo alla parola è muta: table [TABL].',
    ),
    card('c4', 'Nasali ã õ ẽ', "dans [DÃ], bon [BÕ], vin [VẼ]: l'aria esce dal naso, nessuna n detta."),
    card(
      'c5',
      'Nasale o no?',
      'Solo se n/m è finale o davanti a consonante: bon [BÕ] / bonne [BÒN], fin [FẼ] / fine [FIN].',
    ),
    card('c6', 'r francese', 'Una g dura sfregata in fondo alla gola, punta della lingua giù: rue [RÜ].'),
    card('c7', 'ch e j/g dolce', 'ch = sh (chat [SHA]); j e g davanti a e/i = zh (jour [ZHUR], manger [mã-ZHÉ]).'),
    card('c8', 'ill → y', 'fille [FIY], famille [fa-MIY]; eccezioni: ville [VIL], mille [MIL].'),
    card(
      'c9',
      'h muta e aspirata',
      "Sempre non detta. Muta: l'homme (élision, liaison). Aspirata: le héros (niente élision né liaison).",
    ),
    card(
      'c10',
      'CaReFuL',
      'Le consonanti finali c, r, f, l spesso si pronunciano: sac [SAK], bar [BAR], neuf [NÖF], bal [BAL].',
    ),
    card(
      'c11',
      'Liaison obbligatoria',
      'articolo+nome, pronome+verbo, aggettivo+nome: les amis [lé-za-MI], nous avons [nu-za-VÕ].',
    ),
    card('c12', 'Liaison vietata', 'Dopo et e davanti a h aspirata: et ils [é-IL], les héros [lé-é-RO].'),
    card('c13', 's tra vocali', 'Una s tra due vocali suona z, doppia ss suona s: poison [pua-ZÕ], poisson [pua-SÕ].'),
    card('c14', 'ç', 'S davanti a a/o/u: garçon [gar-SÕ], français [frã-SÈ].'),
    card('c15', 'oi, ui, ou', 'oi = ua (moi [MUA]); ui = üi (nuit [NÜI]); ou = u italiana (vous [VU]).'),
    card(
      'c16',
      'Alfabeto',
      'A [A] B [BÉ] C [SÉ] D [DÉ] E [ë] F [ÈF] G [ZHÉ] H [ASH] I [I] J [ZHI] K [KA] L [ÈL] M [ÈM] N [ÈN] O [O] P [PÉ] Q [KÜ] R [ÈR] S [ÈS] T [TÉ] U [Ü] V [VÉ] W [du-blë-VÉ] X [IKS] Y [i-GRÈK] Z [ZÈD].',
    ),
    card('c17', 'doppie', 'Le doppie non si raddoppiano: elle [ÈL], pomme [PÒM], personne [pèr-SÒN]. Mai «pòm-me».'),
    card('c18', 'sc + e/i', 'scène [SÈN], science [SYÃS], descendre [dé-SÃDR]: sc davanti a e/i vale s, non sh.'),
    card(
      'c19',
      'x',
      'gz in examen [èg-za-MẼ]; ks in taxi [tak-SI]; s in six, soixante; z in deuxième [dö-ZYÈM]; muta in deux, prix.',
    ),
    card('c20', 'ti = si', 'nation [na-SYÕ], patient [pa-SYÃ]; ma question [kès-TYÕ], nous étions [é-TYÕ].'),
    card(
      'c21',
      'consonanti finali',
      'table [TABL], quatre [KATR], livre [LIVR]: chiudi la parola senza aggiungere una vocale.',
    ),
    card(
      'c22',
      'h aspirata',
      'héros, haricot, honte, haut, hasard, hibou, hockey: niente élision né liaison (le haricot).',
    ),
    card(
      'c23',
      'o aperta / chiusa',
      'ò davanti a consonante detta (porte, homme); o chiusa in fondo, davanti a z e in ô, au, eau (vélo, rose, beau).',
    ),
    card('c24', 'liaison: suoni', 's/x/z → z; d → t; f → v; n resta; nel dubbio non legare quando è facoltativa.'),
    card(
      'c25',
      'intonazione',
      'Affermazione e domanda con parola interrogativa scendono; sì/no sale (Tu viens ?); elenco: sale, sale, scende.',
    ),
    card(
      'c26',
      'e muta',
      'Cade tra due vocali (samedi), resta per evitare tre consonanti (vendredi), è muta in fondo (table).',
    ),
  ],
  [
    prac(
      'p1',
      "Trascrivi con la nostra convenzione: bonjour, merci, beaucoup, s'il vous plaît, au revoir.",
      "bonjour [bõ-ZHUR], merci [mèr-SI], beaucoup [bo-KU], s'il vous plaît [sil vu PLÈ], au revoir [o rë-VUAR]. Nota: la n di bon è solo nasale, la p di beaucoup e la t di plaît sono mute.",
    ),
    prac(
      'p2',
      'Sillaba il tuo nome e cognome ad alta voce con le lettere francesi (esempio: Marco).',
      "Marco = M-A-R-C-O = [ÈM A ÈR SÉ O]. Il modello per ogni lettera sta nell'alfabeto: G si dice [ZHÉ], J [ZHI], U [Ü], H [ASH], Q [KÜ], W [du-blë-VÉ]. Nota: sono le lettere che gli italiani sbagliano di più.",
    ),
    prac(
      'p3',
      'Correggi: un amico legge «les amis» come [lé a-MI] e «Paris» come [pa-RIS].',
      'Les amis = [lé-za-MI] (liaison obbligatoria: la s si lega e suona z). Paris = [pa-RI] (la s finale è muta). Nota: legare dove serve e tacere la s dove non serve sono le due correzioni più utili.',
    ),
    prac(
      'p4',
      'Leggi e distingui le coppie: dessus / dessous, deux / doux, rue / roue, tu / tout.',
      'dessus [dë-SÜ] / dessous [dë-SU]; deux [DÖ] / doux [DU]; rue [RÜ] / roue [RU]; tu [TÜ] / tout [TU]. Nota: la ü ha le labbra tonde ma lingua avanti, la u italiana ha la lingua indietro.',
    ),
    prac(
      'p5',
      'Scrivi come si legge: «Il y a quatre étudiants à Paris».',
      'Il y a quatre étudiants à Paris = [i-lya katr é-tü-dyã a pa-RI]. Nota: nessuna liaison tra étudiants e à; la -s di étudiants è muta e la e finale di quatre non si dice.',
    ),
    prac(
      'p6',
      'Leggi con la nostra trascrizione: scène, examen, photo, théâtre, question.',
      'scène [SÈN], examen [èg-za-MẼ], photo [fo-TO], théâtre [té-ATR], question [kès-TYÕ]. Nota: sc + e = s, x = gz, ph = f, th = t, ti dopo s resta t.',
    ),
    prac(
      'p7',
      'Segna dove la liaison è obbligatoria e dove vietata: «les enfants et ils arrivent; un petit ami; les héros».',
      'les enfants [lé-zã-FÃ], et ils [é-IL] (vietata dopo et), un petit ami [ẽ pë-ti-ta-MI] (obbligatoria), les héros [lé é-RO] (vietata, h aspirata). Nota: nel dubbio non legare, ma dopo articolo e aggettivo legare è obbligatorio.',
    ),
    prac(
      'p8',
      'Dì ad alta voce con la melodia giusta: «Il pleut. Tu viens ? Où vas-tu ? Du pain, du lait, des œufs.»',
      'Il pleut ↘ [il PLÖ]; Tu viens ? ↗ [tü VYẼ]; Où vas-tu ? ↘ [u va-TÜ]; du pain ↗, du lait ↗, des œufs ↘. Nota: la domanda sì/no sale alla fine, tutte le altre frasi scendono.',
    ),
  ],
  'Nessuna nota collegata: modulo scritto per questo percorso.',
)

export const fsaluti = mod(
  'fr-saluti',
  'Saluti, numeri, data e ora',
  'Presentarsi, tu/vous, numeri fino a un milione (70, 80, 90), giorni, mesi, ora, paesi e nazionalità',
  'a1',
  `${PRON_SHORT}
<p class="lead">Si comincia da ciò che serve subito: salutare, presentarsi, contare, dire quando e di dove sei.</p>
<h3>Saluti e cortesia</h3>
<table><tr><th>Francese</th><th>Pronuncia</th><th>Italiano</th></tr>
<tr><td>Bonjour</td><td>[bõ-ZHUR]</td><td>buongiorno (fino a sera)</td></tr>
<tr><td>Bonsoir</td><td>[bõ-SUAR]</td><td>buonasera (saluto)</td></tr>
<tr><td>Salut</td><td>[sa-LÜ]</td><td>ciao (ciao e arrivederci)</td></tr>
<tr><td>Au revoir</td><td>[o rë-VUAR]</td><td>arrivederci</td></tr>
<tr><td>À bientôt</td><td>[a byẽ-TO]</td><td>a presto</td></tr>
<tr><td>À tout à l'heure</td><td>[a tu ta-LÖR]</td><td>a dopo (stesso giorno)</td></tr>
<tr><td>Bonne nuit</td><td>[bòn NÜI]</td><td>buonanotte (solo prima di dormire)</td></tr>
<tr><td>Merci / De rien</td><td>[mèr-SI / dë RYẼ]</td><td>grazie / prego</td></tr>
<tr><td>S'il vous plaît</td><td>[sil vu PLÈ]</td><td>per favore (s'il te plaît a un amico)</td></tr>
<tr><td>Excusez-moi / Pardon</td><td>[èks-kü-zé MUA / par-DÕ]</td><td>scusi / permesso</td></tr></table>
<h3>Presentarsi</h3>
<ul><li><b>Je m'appelle Marco.</b> [zhë ma-PÈL mar-KO] Mi chiamo Marco. Domanda: <i>Comment tu t'appelles ?</i> [kò-mã tü ta-PÈL]</li><li><b>Je suis italien / italienne.</b> [zhë süi-i-ta-LYẼ / i-ta-LYÈN]</li><li><b>J'habite à Milan.</b> [zha-bit a mi-LÃ]</li><li><b>J'ai trente ans.</b> [zhé trã-TÃ] L'età si dice con <i>avoir</i>, non con essere.</li><li><b>Enchanté(e).</b> [ã-shã-TÉ] Piacere.</li><li><b>Ça va ?</b> [sa VA] — <i>Ça va bien, merci. Et toi ?</i> [sa va byẽ mèr-si é TUA]</li></ul>
<h3>Tu o vous</h3>
<p><b>Tu</b> con amici, famiglia, bambini, coetanei; <b>vous</b> con sconosciuti, adulti, al lavoro, e sempre al plurale. Il «Lei» italiano è <b>vous</b> (seconda plurale, non terza): <i>Comment allez-vous ?</i> [kò-mã ta-lé-VU] «come sta?». Nel dubbio usa vous: ti diranno «on peut se tutoyer» [õ pö së tü-tua-YÉ].</p>
<h3>I numeri</h3>
<table><tr><th>Numero</th><th>Francese</th></tr>
<tr><td>0, 1, 2</td><td>zéro [zé-RO], un [Ẽ], deux [DÖ]</td></tr>
<tr><td>3, 4, 5</td><td>trois [TRUA], quatre [KATR], cinq [SẼK]</td></tr>
<tr><td>6, 7, 8</td><td>six [SIS], sept [SÈT], huit [ÜIT]</td></tr>
<tr><td>9, 10, 11</td><td>neuf [NÖF], dix [DIS], onze [ÕZ]</td></tr>
<tr><td>12, 13</td><td>douze [DUZ], treize [TRÈZ]</td></tr>
<tr><td>14, 15, 16</td><td>quatorze [ka-TÒRZ], quinze [KẼZ], seize [SÈZ]</td></tr>
<tr><td>17</td><td>dix-sept [di-SÈT]</td></tr>
<tr><td>18</td><td>dix-huit [di-ZÜIT]</td></tr>
<tr><td>19</td><td>dix-neuf [diz-NÖF]</td></tr>
<tr><td>20</td><td>vingt [VẼ]</td></tr>
<tr><td>21</td><td>vingt et un [vẽ-té-Ẽ]</td></tr>
<tr><td>22</td><td>vingt-deux [vẽt-DÖ]</td></tr>
<tr><td>30, 40</td><td>trente [TRÃT], quarante [ka-RÃT]</td></tr>
<tr><td>50, 60</td><td>cinquante [sẽ-KÃT], soixante [sua-SÃT]</td></tr>
<tr><td>70</td><td>soixante-dix [sua-sãt-DIS]</td></tr>
<tr><td>71</td><td>soixante et onze [sua-sãt-é-ÕZ]</td></tr>
<tr><td>72</td><td>soixante-douze [sua-sãt-DUZ]</td></tr>
<tr><td>80</td><td>quatre-vingts [ka-trë-VẼ]</td></tr>
<tr><td>81</td><td>quatre-vingt-un [ka-trë-vẽ-Ẽ]</td></tr>
<tr><td>90</td><td>quatre-vingt-dix [ka-trë-vẽ-DIS]</td></tr>
<tr><td>99</td><td>quatre-vingt-dix-neuf [ka-trë-vẽ-diz-NÖF]</td></tr>
<tr><td>100, 200</td><td>cent [SÃ], deux cents [dö-SÃ]</td></tr>
<tr><td>1000, 2000</td><td>mille [MIL], deux mille [dö-MIL]</td></tr>
<tr><td>1 000 000</td><td>un million (de) [ẽ mi-LYÕ]</td></tr></table>
<p>Da 70 a 99 il francese conta in base 20: 70 = 60+10, 80 = 4×20, 90 = 4×20+10. In Belgio e Svizzera: <i>septante</i> [sèp-TÃT], <i>nonante</i> [nò-NÃT]. <b>-s</b>: <i>quatre-vingts</i> e <i>deux cents</i> hanno la s solo se non seguiti da un altro numero (<i>quatre-vingt-trois</i>, <i>deux cent un</i>); <i>mille</i> è invariabile (<i>trois mille</i>). Prima di una consonante six, huit, dix perdono la consonante: <i>six jours</i> [si ZHUR]; davanti a vocale si legano: <i>six heures</i> [si-ZÖR].</p>
<h3>Giorni, mesi, data, ora</h3>
<p>Giorni (minuscolo, maschili): <i>lundi</i> [lẽ-DI], <i>mardi</i> [mar-DI], <i>mercredi</i> [mèr-krë-DI], <i>jeudi</i> [zhö-DI], <i>vendredi</i> [vã-drë-DI], <i>samedi</i> [sam-DI], <i>dimanche</i> [di-MÃSH]. <i>Lundi</i> = questo lunedì; <i>le lundi</i> = ogni lunedì. Mesi: <i>janvier</i> [zhã-VYÉ], <i>février</i> [fév-RYÉ], <i>mars</i> [MARS], <i>avril</i> [a-VRIL], <i>mai</i> [MÈ], <i>juin</i> [ZHÜẼ], <i>juillet</i> [zhüi-YÈ], <i>août</i> [UT], <i>septembre</i> [sèp-TÃBR], <i>octobre</i> [ok-TÒBR], <i>novembre</i> [nò-VÃBR], <i>décembre</i> [dé-SÃBR].</p>
<p>Data: <i>Nous sommes le six novembre.</i> [nu sòm lë si nò-VÃBR] Solo il primo è ordinale: <i>le premier mai</i> [lë prë-myé MÈ].</p>
<p>Ora: <i>Quelle heure est-il ?</i> [kè-lö-rè-TIL] — <i>Il est trois heures</i> [i-lè trua-ZÖR], <i>une heure</i> [ü-NÖR], <i>midi</i> [mi-DI], <i>minuit</i> [mi-NÜI], <i>trois heures et quart</i>, <i>et demie</i> [é dë-MI], <i>moins le quart</i> [muẽ lë KAR], <i>moins cinq</i>. Trappola: «sono le tre» = <i>il est trois heures</i>, mai «ils sont».</p>
<h3>Paesi e nazionalità</h3>
<table><tr><th>Paese</th><th>Pronuncia</th><th>Nazionalità m / f</th></tr>
<tr><td>la France</td><td>[la FRÃS]</td><td>français / française</td></tr>
<tr><td>l'Italie</td><td>[li-ta-LI]</td><td>italien / italienne</td></tr>
<tr><td>l'Espagne</td><td>[lès-PAGN]</td><td>espagnol / espagnole</td></tr>
<tr><td>l'Allemagne</td><td>[lal-MAGN]</td><td>allemand / allemande</td></tr>
<tr><td>la Suisse</td><td>[la SÜIS]</td><td>suisse / suisse</td></tr>
<tr><td>les États-Unis</td><td>[lé-zé-ta-zü-NI]</td><td>américain / américaine</td></tr></table>
<p>Preposizioni: <i>en</i> + femminile o vocale (<i>en France</i> [ã FRÃS], <i>en Italie</i>), <i>au</i> + maschile (<i>au Portugal</i>), <i>aux</i> + plurale (<i>aux États-Unis</i>); «da»: <i>je viens d'Italie</i> [zhë vyẽ di-ta-LI]. Le nazionalità come aggettivo sono minuscole.</p>
<div class="say"><b>Cosa dire.</b> «Bonjour, je m'appelle Anna [bõ-zhur zhë ma-pèl a-NA]. J'ai vingt-cinq ans [zhé vẽt-sẽ-KÃ] et j'habite à Rome.»</div>`,
  [
    q(
      'q1',
      'Come si dice 80 in francese di Francia?',
      ['quatre-vingts', 'huitante', 'octante', 'soixante-vingt'],
      0,
      "In Francia 80 è 4×20, quatre-vingts. «Huitante» e «octante» esistono in alcune zone svizzere, ma non nel francese di Francia; l'ultima forma non esiste.",
    ),
    q(
      'q2',
      'Come si dice 97?',
      ['quatre-vingt-dix-sept', 'nonante-sept (in Francia)', 'quatre-vingts-dix-sept', 'soixante-dix-sept'],
      0,
      "97 = 80+17, quatre-vingt-dix-sept. Vingt prende la s solo quando è l'ultimo elemento (quatre-vingts), qui è seguito da altri numeri; soixante-dix-sept è 77.",
    ),
    q(
      'q3',
      'Quale frase significa «sono le tre e un quarto»?',
      [
        'Il est trois heures et quart.',
        'Ils sont trois heures et quart.',
        'Il a trois heures et quart.',
        'Il fait trois heures et quart.',
      ],
      0,
      "Si usa sempre «il est» con il numero di ore, anche al plurale. «Ils sont» è la traduzione letterale dell'italiano «sono le», ma in francese è sbagliata.",
    ),
    q(
      'q4',
      "Quale forma è corretta per dire «Ho trent'anni»?",
      ["J'ai trente ans.", 'Je suis trente ans.', 'Je fais trente ans.', "J'ai trente années."],
      0,
      "L'età si dice con avoir (come in italiano «ho»). «Je suis trente ans» sembra naturale a chi pensa all'inglese «I am», ma in francese non esiste.",
    ),
    q(
      'q5',
      'Con chi usi «vous»?',
      [
        'Con uno sconosciuto o con più persone',
        'Con gli amici e i compagni di scuola',
        'Con i familiari e con i bambini piccoli',
        'Con i coetanei che incontri in palestra',
      ],
      0,
      "Vous si usa per cortesia con una persona sola e sempre per il plurale. Con amici, familiari, bambini e coetanei si dice invece tu: scambiare i due registri è l'errore tipico.",
    ),
    q(
      'q6',
      'Quale data è scritta correttamente?',
      ['le 1er mai', 'le un mai', 'le premier de mai', 'le uno mai'],
      0,
      'Solo il primo giorno del mese è ordinale e si abbrevia 1er (premier). Per gli altri giorni si usa il numero cardinale: le deux mai. «Le un mai» è un errore comune.',
    ),
    q(
      'q7',
      'Come si legge «dix-huit» nella nostra trascrizione?',
      ['di-ZÜIT', 'dis-ÜIT', 'diks-UIT', 'di-ÜIT'],
      0,
      'In dix-huit la x finale suona z per la liaison e la h è muta, quindi si ottiene di-ZÜIT. Senza la z il legame con la vocale non si sentirebbe.',
    ),
    q(
      'q8',
      'Come si pronuncia «bonne nuit» e quando si usa?',
      [
        'bòn NÜI, solo prima di andare a dormire',
        'bõ NÜI, come saluto quando si arriva',
        'bòn NUIT, per salutare chi arriva di notte',
        'bõ-NUI, come saluto serale in generale',
      ],
      0,
      "Bonne nuit è l'augurio prima di dormire. Per salutare arrivando di sera si dice bonsoir; bonne ha una n vera [bòn], non nasale.",
    ),
  ],
  [
    card(
      'c1',
      'bonjour / bonsoir',
      'bonjour [bõ-ZHUR] fino a sera; bonsoir [bõ-SUAR] come saluto serale; bonne nuit solo prima di dormire.',
    ),
    card('c2', 'Lei = ?', 'Il «Lei» italiano si traduce con vous (seconda persona plurale): comment allez-vous ?'),
    card('c3', 'età', "J'ai vingt ans [zhé vẽ-TÃ]: l'età si dice con avoir."),
    card(
      'c4',
      '70 / 80 / 90',
      'soixante-dix, quatre-vingts, quatre-vingt-dix (base 20). In Belgio e Svizzera: septante, nonante.',
    ),
    card(
      'c5',
      'vingt e cent con la s',
      'quatre-vingts, deux cents solo se non seguiti da altro numero; mille mai con la s.',
    ),
    card('c6', 'ore', 'Il est trois heures [i-lè trua-ZÖR]: sempre «il est».'),
    card('c7', 'le premier mai', 'Solo il primo del mese è ordinale; poi: le deux mai, le trois mai...'),
    card('c8', 'lundi vs le lundi', 'lundi = questo lunedì; le lundi = ogni lunedì. Giorni e mesi in minuscolo.'),
    card('c9', 'en / au / aux', 'en France, en Italie; au Portugal, au Canada; aux États-Unis.'),
    card(
      'c11',
      'pronuncia dei numeri',
      'dix-huit [di-ZÜIT], dix-neuf [diz-NÖF], vingt et un [vẽ-té-Ẽ], cent [SÃ], huit [ÜIT]: dix-huit e dix-neuf hanno la z (dalla x); vingt et un ha una t; huit non si lega.',
    ),
    card('c12', 'mesi difficili', 'février [fév-RYÉ], août [UT], juillet [zhüi-YÈ], juin [ZHÜẼ].'),
    card(
      'c13',
      'saluti: pronuncia',
      'bonjour [bõ-ZHUR], bonsoir [bõ-SUAR], merci [mèr-SI], salut [sa-LÜ], au revoir [o rë-VUAR].',
    ),
    card(
      'c10',
      'six, huit, dix',
      'Davanti a consonante perdono la consonante finale (six jours [si ZHUR]); davanti a vocale si legano (six heures [si-ZÖR]).',
    ),
  ],
  [
    prac(
      'p1',
      'Presentati in francese: nome, nazionalità, città, età, saluto.',
      "Bonjour, je m'appelle Marco [bõ-zhur zhë ma-pèl mar-KO]. Je suis italien, j'habite à Milan et j'ai trente ans [zhé trã-TÃ]. Enchanté ! Nota: età con avoir, nazionalità senza articolo e minuscola.",
    ),
    prac(
      'p2',
      'Scrivi in lettere: 71, 80, 95, 200, 2 500.',
      '71 soixante et onze; 80 quatre-vingts; 95 quatre-vingt-quinze; 200 deux cents; 2 500 deux mille cinq cents. Nota: quatre-vingts perde la s se seguito da altro numero, deux cents la conserva solo se non seguito da altro numero (deux cent cinq).',
    ),
    prac(
      'p3',
      'Traduci: «Sono le otto e mezza» e «A che ora parti?».',
      'Il est huit heures et demie [i-lè üi-TÖR é dë-MI]. À quelle heure tu pars ? [a kè-LÖR tü PAR]. Nota: demie con e finale accordato con heure (femminile), ma midi et demi senza e.',
    ),
    prac(
      'p4',
      'Correggi: «Je suis vingt ans et ils sont trois heures». ',
      "J'ai vingt ans et il est trois heures. Nota: l'età si dice con avoir; l'ora con il est (verbo impersonale).",
    ),
    prac(
      'p5',
      'Scrivi la data di oggi in francese e dì in che paese vivi.',
      "Nous sommes le six novembre deux mille vingt-six. J'habite en Italie [zha-bit ã-ni-ta-LI]. Nota: en davanti a paese femminile o vocale, minuscolo per giorno e mese.",
    ),
  ],
)

export const fetre = mod(
  'fr-etre',
  'Être, avoir, il y a e i verbi essenziali',
  "être e avoir, il y a, c'est e il est, espressioni con avoir (j'ai faim), aller e faire",
  'a1',
  `${PRON_SHORT}
<p class="lead">Quattro verbi reggono quasi ogni frase: <b>être</b>, <b>avoir</b>, <b>aller</b>, <b>faire</b>. Le forme vanno sapute a memoria, con la pronuncia (molte forme scritte sono mute).</p>
<h3>Être e avoir</h3>
<table><tr><th>Persona</th><th>être (essere)</th><th>avoir (avere)</th></tr>
<tr><td>je</td><td>suis [SÜI]</td><td>ai [É]: j'ai [zhé]</td></tr>
<tr><td>tu</td><td>es [È]</td><td>as [A]</td></tr>
<tr><td>il / elle / on</td><td>est [È]</td><td>a [A]</td></tr>
<tr><td>nous</td><td>sommes [SÒM]</td><td>avons [a-VÕ]</td></tr>
<tr><td>vous</td><td>êtes [ÈT]</td><td>avez [a-VÉ]</td></tr>
<tr><td>ils / elles</td><td>sont [SÕ]</td><td>ont [Õ]</td></tr></table>
<p>Liaison obbligatoria con avoir e être: <i>nous avons</i> [nu-za-VÕ], <i>vous avez</i> [vu-za-VÉ], <i>ils ont</i> [il-ZÕ], <i>vous êtes</i> [vu-ZÈT]. Con <i>elle est</i> [è-LÈ] non c'è liaison ma enchaînement: la l si sente già. <b>On</b> (= noi, nel parlato) vuole la terza singolare: <i>on est ensemble</i> [õ-nè ã-SÃBL] «siamo insieme». Negazione: <i>je ne suis pas</i> [zhë në süi PA], <i>je n'ai pas</i> [zhë né PA].</p>
<h3>Il y a</h3>
<p>«C'è / ci sono / fa» = <b>il y a</b> [i-lya]. È invariabile: <i>Il y a un livre</i> / <i>Il y a trois livres</i> [i-lya trua LIVR]. Negazione: <i>Il n'y a pas de</i> [il ni a pa dë] (<i>pas de</i> senza articolo). Domanda: <i>Est-ce qu'il y a... ?</i> o <i>Y a-t-il... ?</i>. Trappola: <i>il y a</i> non si mette mai al plurale, anche davanti a nomi plurali: «il y ont» non esiste.</p>
<h3>C'est o il est ?</h3>
<table><tr><th>Si usa</th><th>Quando</th><th>Esempio</th></tr>
<tr><td>c'est [sè] / ce sont [së SÕ]</td><td>+ articolo + nome, nome proprio, pronome tonico, avverbio</td><td>C'est un médecin. C'est Paul. C'est moi.</td></tr>
<tr><td>il est / elle est</td><td>+ professione o aggettivo, riferito a persona/cosa precisa</td><td>Il est médecin. Elle est grande.</td></tr>
<tr><td>c'est</td><td>+ aggettivo, giudizio generale</td><td>C'est difficile. C'est bien.</td></tr></table>
<p>Regola pratica: con un articolo davanti usi <i>c'est</i> (<i>c'est un médecin</i>); con la professione nuda usi <i>il est</i> (<i>il est médecin</i> [i-lè mèd-SẼ]). Nel parlato si sente anche <i>c'est des amis</i> invece di <i>ce sont des amis</i>.</p>
<h3>Avoir: espressioni</h3>
<p>In francese molte sensazioni si dicono con <b>avoir</b>, esattamente come in italiano («ho fame», «ho paura»): qui le due lingue coincidono. La trappola è per chi pensa all'inglese «I am hungry». Le insidie vere per un italiano sono altre: <i>avoir besoin de</i>, <i>avoir envie de</i> e <i>avoir mal à</i> vogliono una preposizione precisa, e «fa caldo» non è «ha caldo».</p>
<table><tr><th>Espressione</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>avoir faim / soif</td><td>[a-vuar FẼ / SUAF]</td><td>avere fame / sete</td></tr>
<tr><td>avoir chaud / froid</td><td>[a-vuar SHO / FRUA]</td><td>avere caldo / freddo (sentirlo)</td></tr>
<tr><td>avoir peur / sommeil</td><td>[a-vuar PÖR / sò-MÈY]</td><td>avere paura / sonno</td></tr>
<tr><td>avoir raison / tort</td><td>[a-vuar rè-ZÕ / TÒR]</td><td>avere ragione / torto</td></tr>
<tr><td>avoir besoin de</td><td>[a-vuar bë-ZUẼ dë]</td><td>aver bisogno di</td></tr>
<tr><td>avoir envie de</td><td>[a-vuar ã-VI dë]</td><td>aver voglia di</td></tr>
<tr><td>avoir mal à</td><td>[a-vuar mal A]</td><td>aver male a: j'ai mal à la tête</td></tr>
<tr><td>avoir ... ans</td><td>[a-vuar ... Ã]</td><td>avere ... anni</td></tr></table>
<p><b>Trappola</b>: «ho caldo» = <i>j'ai chaud</i> (come in italiano; <i>je suis chaud</i> è gergale e vuol dire altro). Il tempo atmosferico è <i>il fait chaud</i>, <i>il fait froid</i> [il fè FRUA]: <i>il a chaud</i> vuol dire che lui sente caldo, non che fa caldo.</p>
<h3>Aller e faire</h3>
<table><tr><th>Persona</th><th>aller (andare)</th><th>faire (fare)</th></tr>
<tr><td>je</td><td>vais [VÈ]</td><td>fais [FÈ]</td></tr>
<tr><td>tu</td><td>vas [VA]</td><td>fais [FÈ]</td></tr>
<tr><td>il / elle / on</td><td>va [VA]</td><td>fait [FÈ]</td></tr>
<tr><td>nous</td><td>allons [a-LÕ]</td><td>faisons [fë-ZÕ]</td></tr>
<tr><td>vous</td><td>allez [a-LÉ]</td><td>faites [FÈT]</td></tr>
<tr><td>ils / elles</td><td>vont [VÕ]</td><td>font [FÕ]</td></tr></table>
<p><b>Aller</b> con <i>à</i>: <i>Je vais à Paris</i> [zhë vè a pa-RI]. <i>Ça va ?</i> [sa VA]. Fa il futuro prossimo: <i>je vais manger</i> (vedi il modulo sul futuro). <b>Faire</b>: <i>faire du sport</i> [fèr dü SPÒR], <i>faire les courses</i> «fare la spesa» [fèr lé KURS], <i>faire la cuisine</i>, <i>il fait beau</i> [il fè BO]. Attenzione a <i>nous faisons</i>: la -ai- suona ë ([fë-ZÕ]), non è.</p>
<div class="say"><b>Cosa dire.</b> «J'ai faim [zhé FẼ], il y a un café ici ? Oui, c'est ouvert.»</div>`,
  [
    q(
      'q1',
      'Come si dice «Ho freddo»?',
      ["J'ai froid.", 'Je suis froid.', 'Je fais froid.', 'Il fait froid pour moi.'],
      0,
      'Per la sensazione fisica si usa avoir. «Je suis froid» significa che sei un tipo freddo (o un oggetto freddo); «il fait froid» parla del tempo, non di te.',
    ),
    q(
      'q2',
      'Quale frase è corretta?',
      ['Il est médecin.', 'Il est un médecin.', 'Il a médecin.', 'Il fait médecin.'],
      0,
      "Con una professione nuda (senza articolo) si usa il est. «Il est un médecin» è un errore comune: con l'articolo si direbbe c'est un médecin.",
    ),
    q(
      'q3',
      'Quale forma si legge [nu-za-VÕ]?',
      ['nous avons', 'nous avance', 'nous avions', 'nous avez'],
      0,
      'Nous avons suona [nu-za-VÕ]: la s di nous si lega alla a con suono z. Avions [a-VYÕ] e avance [a-VÃS] hanno suoni diversi; nous avez non esiste.',
    ),
    q(
      'q4',
      'Come si nega «Ci sono libri»?',
      ["Il n'y a pas de livres.", "Il n'y a pas des livres.", 'Il y a pas de livres.', 'Il ne y a pas de livres.'],
      0,
      "Dopo la negazione l'articolo diventa de e ne si elide in n' davanti a y. «Pas des» è l'errore tipico; «il y a pas» senza ne si sente solo nel parlato veloce.",
    ),
    q(
      'q5',
      'Come si dice «noi facciamo» e come si legge?',
      ['nous faisons [nu fë-ZÕ]', 'nous faisont [nu fë-ZÕ]', 'nous faissons [nu fa-SÕ]', 'nous faizons [nu fa-ZÕ]'],
      0,
      "Nella forma faisons la -ai- è un'eccezione: si legge ë (e muta), non è. Si scrive con una s sola tra le vocali, che suona z, e la desinenza di nous è sempre -ons.",
    ),
    q(
      'q6',
      "Quale frase usa correttamente «c'est»?",
      ["C'est difficile.", "C'est médecin.", 'Ce sont difficile.', 'Elle est un livre.'],
      0,
      "Per un giudizio generale su una situazione si usa c'est + aggettivo. «C'est médecin» richiederebbe l'articolo (c'est un médecin) o la forma il est médecin.",
    ),
    q(
      'q7',
      'Come si legge «ils ont» e perché?',
      [
        'il-ZÕ: la liaison fa suonare z',
        'il-LÕ: la liaison fa suonare l',
        'ilz-ÕN: la n finale detta',
        'i-SÕ: la s detta come s sorda',
      ],
      0,
      'Davanti a verbo che inizia per vocale la -s di ils si lega con suono z. Senza liaison ils ont e ils sont si confonderebbero; il legame obbligatorio mantiene la distinzione.',
    ),
    q(
      'q8',
      'Quale verbo si usa per «Ho 20 anni»?',
      ['avoir', 'être', 'faire', 'aller'],
      0,
      "L'età si esprime con avoir, come in italiano. Chi pensa all'inglese ('I am') sceglie être, ma «je suis vingt ans» in francese è sbagliato.",
    ),
  ],
  [
    card(
      'c1',
      'être (presente)',
      'je suis [SÜI], tu es [È], il est [È], nous sommes [SÒM], vous êtes [ÈT], ils sont [SÕ].',
    ),
    card(
      'c2',
      'avoir (presente)',
      "j'ai [zhé], tu as [A], il a [A], nous avons [a-VÕ], vous avez [a-VÉ], ils ont [Õ].",
    ),
    card('c3', 'il y a', "C'è / ci sono; invariabile. Negativo: il n'y a pas de."),
    card(
      'c4',
      "c'est vs il est",
      "c'est + articolo/nome proprio/pronome tonico; il est + professione nuda o aggettivo.",
    ),
    card('c5', 'avoir faim / soif', "j'ai faim [zhé FẼ], j'ai soif [zhé SUAF]."),
    card(
      'c6',
      'avoir chaud / froid',
      "j'ai chaud [SHO], j'ai froid [FRUA]: sensazione di una persona; il fait chaud = il tempo.",
    ),
    card('c7', 'avoir peur / sommeil', "j'ai peur [PÖR], j'ai sommeil [sò-MÈY]."),
    card('c8', 'avoir mal à', "j'ai mal à la tête [zhé mal a la TÈT]: con la parte del corpo, mai 'mon'."),
    card('c9', 'aller', 'je vais [VÈ], tu vas [VA], il va [VA], nous allons [a-LÕ], vous allez [a-LÉ], ils vont [VÕ].'),
    card('c10', 'faire', 'je fais [FÈ], il fait [FÈ], nous faisons [fë-ZÕ], vous faites [FÈT], ils font [FÕ].'),
    card('c11', 'on = noi', 'On est [õ-NÈ] ensemble: on + terza persona singolare.'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Ho sete e ho sonno. Lui ha paura.»',
      "J'ai soif et j'ai sommeil. Il a peur. Nota: sete, sonno e paura sono tutte espressioni con avoir.",
    ),
    prac(
      'p2',
      "Completa con c'est o il est: «... infirmière» / «... une infirmière» / «... difficile».",
      "Elle est infirmière / C'est une infirmière / C'est difficile. Nota: professione nuda = il/elle est; articolo = c'est.",
    ),
    prac(
      'p3',
      "Correggi: «Je suis chaud, j'ai vingt-sept ans et il y a des étudiants sont ici.»",
      "J'ai chaud, j'ai vingt-sept ans et il y a des étudiants ici. Nota: «je suis chaud» ha un altro senso; il y a è invariabile e non vuole un secondo verbo.",
    ),
    prac(
      'p4',
      "Rispondi con una frase completa: Qu'est-ce que tu fais ce soir ? (cena + film)",
      'Ce soir, je vais faire la cuisine et je vais regarder un film [zhë vè fèr la küi-ZIN]. Nota: aller + infinito per il futuro vicino.',
    ),
    prac(
      'p5',
      "Traduci: «Nel mio quartiere ci sono due panetterie ma non c'è un supermercato.»",
      "Dans mon quartier, il y a deux boulangeries mais il n'y a pas de supermarché [il ni a pa dë sü-pèr-mar-SHÉ]. Nota: il y a invariabile; pas de senza articolo.",
    ),
  ],
)

export const fnomi = mod(
  'fr-nomi',
  'Nomi, articoli, aggettivi e possessivi',
  'Genere e plurale, le, un, du, au/du, accordo e posizione degli aggettivi, mon/ton/son, ce/cet',
  'a1',
  `${PRON_SHORT}
<p class="lead">Il nome francese porta sempre un determinante: senza articolo quasi nulla si regge. Genere e plurale si sentono nell'articolo, non nel nome.</p>
<h3>Genere: non fidarti dell'italiano</h3>
<p>Molti nomi cambiano genere rispetto all'italiano: <i>la fleur</i> [la FLÖR] (il fiore), <i>la mer</i> [la MÈR] (il mare), <i>la dent</i> [la DÃ] (il dente), <i>la couleur</i> [la ku-LÖR] (il colore), <i>la chaleur</i> [la sha-LÖR] (il calore). Altri sono maschili come in italiano ma si sbagliano: <i>le lait</i> [lë LÈ], <i>le sang</i> [lë SÃ], <i>le problème</i> [lë prò-BLÈM]. Coppie con significato diverso: <i>le tour</i> (giro) / <i>la tour</i> (torre); <i>le livre</i> (libro) / <i>la livre</i> (sterlina).</p>
<p>Indizi: <b>-tion, -té, -ure, -ée, -ie</b> sono quasi sempre femminili (<i>la nation</i> [na-SYÕ], <i>la liberté</i> [li-bèr-TÉ], <i>la voiture</i> [vua-TÜR]); <b>-age, -ment, -isme</b> sono maschili (<i>le voyage</i> [vua-YAZH], <i>le gouvernement</i> [gu-vèr-në-MÃ]). Le parole in <b>-eur</b> si dividono: maschili se indicano chi o che cosa fa (<i>le moteur</i>, <i>le serveur</i>, <i>le directeur</i>), femminili se sono nomi astratti o qualità (<i>la peur</i>, <i>la douleur</i>, <i>la valeur</i>, <i>la couleur</i>, <i>la chaleur</i>). Eccezioni: <i>la page, la plage, l'image</i> (femminili), <i>le musée, le lycée</i> (maschili).</p>
<h3>Plurale: si scrive, non si sente</h3>
<table><tr><th>Regola</th><th>Singolare → plurale</th><th>Pronuncia</th></tr>
<tr><td>+s (quasi sempre)</td><td>un livre → des livres</td><td>[ẽ LIVR] → [dé LIVR]</td></tr>
<tr><td>-s, -x, -z invariati</td><td>le prix → les prix</td><td>[lë PRI] → [lé PRI]</td></tr>
<tr><td>-al → -aux</td><td>un journal → des journaux</td><td>[zhur-NAL] → [zhur-NO]</td></tr>
<tr><td>-eau, -eu → +x</td><td>un bateau → des bateaux</td><td>[ba-TO] → [ba-TO]</td></tr>
<tr><td>irregolari</td><td>un œil → des yeux; un œuf → des œufs</td><td>[ẽ-NÖY] → [dé-ZYÖ]; [ẽ-NÖF] → [dé-ZÖ]</td></tr></table>
<p>Eccezioni in -s: <i>des bals, des festivals</i>; con -eu e -eau in -s: <i>des bleus, des pneus, des landaus</i>; in -x: <i>des bijoux, des cailloux, des choux</i>. Il plurale <b>non si sente</b> nel nome: lo segnalano l'articolo (<i>le</i> [lë] / <i>les</i> [lé], <i>un</i> [Ẽ] / <i>des</i> [dé]) e la liaison.</p>
<h3>Articoli</h3>
<table><tr><th></th><th>m.</th><th>f.</th><th>plurale</th></tr>
<tr><td>determinativo</td><td>le [lë] (l' + vocale)</td><td>la [la] (l')</td><td>les [lé]</td></tr>
<tr><td>indeterminativo</td><td>un [Ẽ]</td><td>une [ÜN]</td><td>des [dé]</td></tr>
<tr><td>partitivo</td><td>du [dü]</td><td>de la [dë la]</td><td>des [dé]; de l' [dë l]</td></tr>
<tr><td>à + articolo</td><td>au [O]</td><td>à la [a la]</td><td>aux [O]</td></tr></table>
<p><b>Partitivo</b> (italiano: «del, della, un po' di», spesso omesso): in francese è obbligatorio. <i>Je mange du pain</i> [zhë mãzh dü PẼ], <i>Je bois de l'eau</i> [zhë bua dë LO], <i>Il y a des pâtes</i>. Dopo la negazione e le quantità diventa <b>de/d'</b>: <i>Je n'ai pas de pain</i> [zhë né pa dë PẼ]; <i>beaucoup de pain</i>. Ma con <i>aimer</i>, <i>adorer</i>, <i>détester</i> si usa l'articolo determinativo: <i>j'aime le café</i>. <b>Contrazioni</b>: à + le = <i>au</i>, à + les = <i>aux</i>, de + le = <i>du</i>, de + les = <i>des</i>; mai «à le», «de le». <i>Je vais au cinéma, à la gare, aux toilettes.</i></p>
<h3>Aggettivi: accordo e posizione</h3>
<table><tr><th>Maschile</th><th>Femminile</th><th>Pronuncia (m. / f.)</th></tr>
<tr><td>grand</td><td>grande</td><td>[GRÃ] / [GRÃD]</td></tr>
<tr><td>petit</td><td>petite</td><td>[pë-TI] / [pë-TIT]</td></tr>
<tr><td>blanc</td><td>blanche</td><td>[BLÃ] / [BLÃSH]</td></tr>
<tr><td>italien</td><td>italienne</td><td>[i-ta-LYẼ] / [i-ta-LYÈN]</td></tr>
<tr><td>heureux</td><td>heureuse</td><td>[ö-RÖ] / [ö-RÖZ]</td></tr>
<tr><td>beau / bel</td><td>belle</td><td>[BO / BÈL] / [BÈL]</td></tr></table>
<p>Il femminile fa <b>sentire</b> la consonante finale (grand/grande). Aggettivi in -e invariati: <i>rouge, jeune</i>. Prima del nome (BAGS: Bellezza, Age, Bontà, Size): <i>petit, grand, beau, joli, jeune, vieux, nouveau, bon, mauvais, gros, long</i>; dopo il nome: colori, nazionalità, forma. Cambiano senso: <i>un grand homme</i> (grande) / <i>un homme grand</i> (alto); <i>mon ancien professeur</i> (ex) / <i>un livre ancien</i> (antico); <i>un pauvre homme</i> (poveretto) / <i>un homme pauvre</i> (senza soldi). Davanti a vocale: <i>un bel homme</i> [ẽ bè-LÒM], <i>un nouvel ami</i>, <i>un vieil arbre</i>.</p>
<h3>Possessivi e dimostrativi</h3>
<table><tr><th>Possessore</th><th>m. / f. sing.</th><th>plurale</th></tr>
<tr><td>mio</td><td>mon [mõ] / ma [ma]</td><td>mes [mé]</td></tr>
<tr><td>tuo</td><td>ton [tõ] / ta [ta]</td><td>tes [té]</td></tr>
<tr><td>suo</td><td>son [sõ] / sa [sa]</td><td>ses [sé]</td></tr>
<tr><td>nostro</td><td>notre [NÒTR]</td><td>nos [NO]</td></tr>
<tr><td>vostro</td><td>votre [VÒTR]</td><td>vos [VO]</td></tr>
<tr><td>loro</td><td>leur [LÖR]</td><td>leurs [LÖR]</td></tr></table>
<p>Il possessivo si accorda con la <b>cosa posseduta</b>: <i>son père</i> [sõ PÈR], <i>sa mère</i> = suo padre, sua madre (di lui o di lei). Niente articolo: <i>mon livre</i>, non «le mon livre». Davanti a vocale femminile si usa mon: <i>mon amie</i> [mõ-na-MI]. Dimostrativi: <i>ce</i> [së] m., <i>cet</i> [sèt] davanti a vocale (<i>cet homme</i> [sè-TÒM]), <i>cette</i> [sèt] f., <i>ces</i> [sé] pl.; <i>-ci</i> / <i>-là</i> per vicino/lontano.</p>
<div class="say"><b>Cosa dire.</b> «J'aime la mer et les montagnes [zhèm la mèr é lé mõ-TAGN]. Mon amie italienne a une petite voiture rouge.»</div>`,
  [
    q(
      'q1',
      'Quale genere ha «fleur»?',
      ['femminile: la fleur', 'maschile: le fleur', 'neutro: ce fleur', 'dipende dal singolare'],
      0,
      "A differenza dell'italiano «il fiore», fleur è femminile. Molti nomi in -eur sono maschili (le moteur), ma fleur, couleur, chaleur e douleur sono femminili: dedurre il genere dall'italiano porta a errori.",
    ),
    q(
      'q2',
      'Come si dice «Bevo acqua» (non specifica)?',
      ["Je bois de l'eau.", 'Je bois eau.', "Je bois l'eau.", 'Je bois des eaux.'],
      0,
      "In francese il partitivo è obbligatorio: de l'eau. Omettere l'articolo, come spesso in italiano, è un errore; l'eau con l' significherebbe un'acqua precisa.",
    ),
    q(
      'q3',
      "Come si nega «J'ai du pain»?",
      ["Je n'ai pas de pain.", "Je n'ai pas du pain.", "Je n'ai pas le pain.", "Je n'ai pas un pain."],
      0,
      "Dopo la negazione il partitivo diventa de/d'. «Pas du pain» è la trappola tipica; si conserva du solo nell'identificazione (ce n'est pas du pain).",
    ),
    q(
      'q4',
      'Quale è il plurale di «un journal»?',
      ['des journaux', 'des journals', 'des journales', 'des journeaux'],
      0,
      'Le parole in -al fanno -aux (cheval/chevaux). Solo poche (bal, festival, carnaval) fanno -als; journals sembra logico, ma non è la forma corretta.',
    ),
    q(
      'q5',
      'Che cosa significa «sa voiture» se il proprietario è un uomo?',
      [
        'la sua macchina: sa si accorda con voiture (f.)',
        'la macchina di lei: sa indica un possessore donna',
        'errore: per un uomo serve son voiture',
        'errore: voiture è maschile e vuole son',
      ],
      0,
      'Il possessivo si accorda con la cosa posseduta, non con il possessore: voiture è femminile, quindi sa. Come in italiano «sua», può essere di lui o di lei.',
    ),
    q(
      'q6',
      'Quale frase è corretta?',
      ['Je vais au cinéma.', 'Je vais à le cinéma.', 'Je vais du cinéma.', 'Je vais aux cinéma.'],
      0,
      "à + le si contrae obbligatoriamente in au. «À le» non esiste mai: è l'errore di chi pensa all'italiano «a il» ormai scomparso.",
    ),
    q(
      'q7',
      "Come si legge «des œufs» e che differenza c'è da «un œuf»?",
      [
        '[dé-ZÖ] / [ẽ-NÖF]: al plurale la f cade',
        '[dé-ZÖF] / [ẽ-NÖF]: la f si dice sempre',
        '[dé-ÖFS] / [ẽ-NÖ]: la s plurale si sente',
        '[dé-ZÖ] / [ẽ-NÖ]: la f cade anche al singolare',
      ],
      0,
      "Œuf [ÖF] si dice con la f, œufs [Ö] la perde: è un'eccezione, come os [ÒS] / os [O]. Il plurale si sente nell'articolo des e nella liaison [dé-ZÖ], non nella s.",
    ),
    q(
      'q9',
      'Come si legge «un bel homme»?',
      [
        'ẽ bè-LÒM: la l si lega alla o',
        'ẽ BO-ÒM: bel diventa beau',
        'ẽ bèl-ÒM: due parole staccate',
        'ẽ bè-NÒM: la liaison suona n',
      ],
      0,
      "Bel è la forma di beau davanti a vocale ed è pronunciato con l finale: l'enchaînement la lega alla o di homme, la h è muta. Beau [BO] si usa solo davanti a consonante.",
    ),
    q(
      'q8',
      "Che differenza c'è tra «un grand homme» e «un homme grand»?",
      [
        'un grande uomo / un uomo alto',
        'un uomo alto / un grande uomo',
        'nessuna: si equivalgono',
        'un vecchio uomo / un uomo magro',
      ],
      0,
      "Prima del nome grand ha senso figurato (importante, grande), dopo ha senso fisico (alto). Lo scambio inverso è proprio l'errore di chi traduce a senso.",
    ),
  ],
  [
    card(
      'c1',
      "Genere diverso dall'italiano",
      'la fleur, la mer, la dent, la couleur, la chaleur (femminili); le lait, le sang (maschili).',
    ),
    card(
      'c2',
      'Plurale muto',
      'Il plurale si sente in articolo (le/les, un/des) e liaison, non nel nome: le livre [lë LIVR] / les livres [lé LIVR].',
    ),
    card('c3', '-al → -aux', 'journal → journaux [zhur-NO], cheval → chevaux [shë-VO]. Eccezioni: bals, festivals.'),
    card('c4', 'partitivo', "du / de la / de l' / des: obbligatorio. Je mange du pain [dü PẼ]."),
    card('c5', 'partitivo negativo', "pas de / pas d': je n'ai pas de pain [dë PẼ]."),
    card('c6', 'au, aux, du, des', 'à + le = au, à + les = aux, de + le = du, de + les = des. Mai "à le".'),
    card(
      'c7',
      'BAGS',
      'Prima del nome: Bellezza, Age (età), Bontà, Size: petit, grand, beau, jeune, vieux, nouveau, bon, mauvais...',
    ),
    card('c8', 'beau / bel / belle', 'un beau garçon, un bel homme [bè-LÒM], une belle femme [bèl FAM].'),
    card('c9', 'possessivo', 'Si accorda con la cosa posseduta: son père, sa mère; mon amie [mõ-na-MI].'),
    card(
      'c10',
      'ce / cet / cette / ces',
      'ce livre [së LIVR], cet homme [sè-TÒM], cette femme [sèt FAM], ces enfants [sé-zã-FÃ].',
    ),
    card('c11', 'femminile udibile', 'grand [GRÃ] / grande [GRÃD]: il femminile fa risuonare la consonante.'),
  ],
  [
    prac(
      'p1',
      "Traduci: «Voglio dell'acqua, ma non ho pane.»",
      "Je veux de l'eau mais je n'ai pas de pain. Nota: de l'eau (partitivo), pas de pain (senza articolo).",
    ),
    prac(
      'p2',
      'Metti al plurale: un cheval, un jeu, un bijou, le nez, un œil.',
      'des chevaux; des jeux; des bijoux; les nez; des yeux. Nota: -ou prende -x solo in sette parole (bijou, caillou, chou, genou, hibou, joujou, pou).',
    ),
    prac(
      'p3',
      "Correggi: «Je vais à le marché et j'aime beaucoup du café.»",
      "Je vais au marché et j'aime beaucoup le café. Nota: à + le = au; con aimer si usa l'articolo determinativo.",
    ),
    prac(
      'p4',
      'Traduci: «Ha una bella macchina rossa e un vecchio amico italiano.»',
      'Il/elle a une belle voiture rouge et un vieil ami italien [ẽ vyè-ya-MI i-ta-LYẼ]. Nota: belle e vieil prima del nome; rouge e italien dopo; vieil davanti a vocale.',
    ),
    prac(
      'p5',
      'Scrivi 5 frasi brevi con un dimostrativo e un possessivo.',
      'Esempio: Ce livre est à mon frère. Cet étudiant est mon ami. Cette maison est notre maison. Ces enfants sont ses cousins. Nota: cet davanti a vocale, mon davanti a vocale anche se femminile (mon amie).',
    ),
  ],
)

export const franceseA = [fpron, fsaluti, fetre, fnomi, ...franceseA2, ...franceseA3]
