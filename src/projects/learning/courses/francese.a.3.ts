import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './francese.b.pron'

// FRENCH course part A, modules 9-12 (futur, pronomi, impératif, confronti).

export const ffutur = mod(
  'fr-futur',
  'Futuro, condizionale e ipotesi con si',
  'Futur simple, futur proche, passé récent, conditionnel présent, cortesia, si + presente / imparfait',
  'a2',
  `${PRON_SHORT}
<p class="lead">Il francese ha tre modi per parlare del futuro (semplice, prossimo, presente) e un condizionale che serve a essere gentili e a fare ipotesi. Attenzione: l'ipotesi con «se» non usa il congiuntivo.</p>
<h3>Futur simple</h3>
<p>Infinito intero (senza la -e finale per i verbi in -re) + <b>-ai, -as, -a, -ons, -ez, -ont</b> (sono le forme di avoir).</p>
<table><tr><th>Persona</th><th>parler</th><th>finir</th><th>prendre</th></tr>
<tr><td>je</td><td>parlerai [par-lë-RÉ]</td><td>finirai [fi-ni-RÉ]</td><td>prendrai [prã-DRÉ]</td></tr>
<tr><td>tu</td><td>parleras [par-lë-RA]</td><td>finiras [fi-ni-RA]</td><td>prendras [prã-DRA]</td></tr>
<tr><td>il / elle</td><td>parlera [par-lë-RA]</td><td>finira [fi-ni-RA]</td><td>prendra [prã-DRA]</td></tr>
<tr><td>nous</td><td>parlerons [par-lë-RÕ]</td><td>finirons [fi-ni-RÕ]</td><td>prendrons [prã-DRÕ]</td></tr>
<tr><td>vous</td><td>parlerez [par-lë-RÉ]</td><td>finirez [fi-ni-RÉ]</td><td>prendrez [prã-DRÉ]</td></tr>
<tr><td>ils / elles</td><td>parleront [par-lë-RÕ]</td><td>finiront [fi-ni-RÕ]</td><td>prendront [prã-DRÕ]</td></tr></table>
<p>Radici irregolari (le desinenze restano):</p>
<table><tr><th>Verbo</th><th>Radice</th><th>je ...</th></tr>
<tr><td>être</td><td>ser-</td><td>serai [zhë së-RÉ]</td></tr>
<tr><td>avoir</td><td>aur-</td><td>aurai [zho-RÉ]</td></tr>
<tr><td>aller</td><td>ir-</td><td>irai [zhi-RÉ]</td></tr>
<tr><td>faire</td><td>fer-</td><td>ferai [zhë fë-RÉ]</td></tr>
<tr><td>venir</td><td>viendr-</td><td>viendrai [zhë vyẽ-DRÉ]</td></tr>
<tr><td>pouvoir</td><td>pourr-</td><td>pourrai [zhë pu-RÉ]</td></tr>
<tr><td>vouloir</td><td>voudr-</td><td>voudrai [zhë vu-DRÉ]</td></tr>
<tr><td>devoir</td><td>devr-</td><td>devrai [zhë dë-VRÉ]</td></tr>
<tr><td>savoir</td><td>saur-</td><td>saurai [zhë so-RÉ]</td></tr>
<tr><td>voir</td><td>verr-</td><td>verrai [zhë vè-RÉ]</td></tr></table>
<p>Cambi ortografici: <i>j'achèterai</i> [zha-shèt-RÉ], <i>j'appellerai</i>, <i>je paierai</i>, <i>je mangerai</i> [zhë mãzh-RÉ]. Impersonali: <i>il faudra</i> [il fo-DRA], <i>il pleuvra</i>. Dopo <i>quand, dès que, lorsque</i> con senso futuro il francese usa il futuro (come l'italiano): <i>Quand j'arriverai, je t'appellerai.</i></p>
<h3>Futur proche e passé récent</h3>
<ul><li><b>Futur proche</b>: aller (presente) + infinito: <i>Je vais partir</i> [zhë vè par-TIR]; <i>Il va pleuvoir</i> [il va plö-VUAR]. Molto frequente nel parlato; indica intenzione o evento imminente.</li><li><b>Passé récent</b>: venir (presente) + <b>de</b> + infinito: <i>Je viens d'arriver</i> [zhë vyẽ da-ri-VÉ] «sono appena arrivato». Trappola: non «je suis juste arrivé».</li></ul>
<h3>Condizionale presente</h3>
<p>Radice del futuro + desinenze dell'imparfait: <b>-ais, -ais, -ait, -ions, -iez, -aient</b>. <i>je parlerais</i> [par-lë-RÈ], <i>tu finirais</i>, <i>il prendrait</i>, <i>nous voudrions</i> [vu-dri-YÕ], <i>vous pourriez</i> [pu-RYÉ], <i>ils feraient</i> [fë-RÈ]. La differenza di suono con il futuro è tutta nell'ultima vocale: <i>je parlerai</i> [É] / <i>je parlerais</i> [È] (molti parigini fondono le due vocali: in scrittura la -s resta decisiva).</p>
<p>Usi: <b>cortesia</b> (<i>Je voudrais un café</i> [zhë vu-DRÈ ẽ ka-FÉ], <i>Pourriez-vous m'aider ?</i> [pu-RYÉ vu mè-DÉ]), <b>desiderio</b> (<i>J'aimerais voyager</i>), <b>consiglio</b> (<i>Tu devrais dormir</i> [tü dë-VRÈ dòr-MIR]), <b>notizia non confermata</b> (<i>Il y aurait deux blessés</i> «ci sarebbero due feriti»).</p>
<h3>Ipotesi con «si»</h3>
<table><tr><th>Tipo</th><th>Dopo si</th><th>Principale</th></tr>
<tr><td>possibile</td><td>presente</td><td>futuro o imperativo</td></tr>
<tr><td>irreale / improbabile</td><td>imparfait</td><td>condizionale presente</td></tr></table>
<p><i>S'il pleut, je resterai à la maison.</i> [sil plö, zhë rès-të-RÉ] / <i>Si j'avais le temps, je voyagerais.</i> [si zha-VÈ lë TÃ, zhë vua-yazh-RÈ]. Differenza dall'italiano: nella condizione dopo <b>si</b> mai futuro né condizionale, e <b>mai congiuntivo</b> (l'unica eccezione è la domanda indiretta: <i>je me demande si tu viendras</i> «mi chiedo se verrai»): «se avessi tempo» = <i>si j'avais le temps</i>. Davanti a il/ils: <i>s'il</i>, <i>s'ils</i>, ma <i>si elle</i>, <i>si on</i> (nessuna élision davanti a elle).</p>
<div class="say"><b>Cosa dire.</b> «Je voudrais réserver une table pour demain [zhë vu-drè ré-zèr-vé ün TABL]. S'il y a de la place, nous viendrons à huit heures.»</div>`,
  [
    q(
      'q1',
      'Qual è il futuro di «aller» alla 1ª persona?',
      ["j'irai", "j'allerai", "j'aillerai", 'je vais'],
      0,
      "Aller ha radice irregolare ir-. «J'allerai» è l'errore classico dell'analogia sull'infinito; «je vais» è il presente, non un futur simple.",
    ),
    q(
      'q2',
      'Quale frase esprime una richiesta cortese?',
      ['Je voudrais un café.', 'Je veux un café.', 'Je voulais un café.', 'Je voudrai un café.'],
      0,
      'Il condizionale ammorbidisce la richiesta. «Je veux» è diretto e quasi brusco; «je voulais» è imparfait; «je voudrai» è futuro.',
    ),
    q(
      'q3',
      'Quale frase è corretta?',
      [
        "Si j'avais le temps, je voyagerais.",
        "Si j'aurais le temps, je voyagerais.",
        "Si j'avais le temps, je voyagerai.",
        "Si j'ai le temps, je voyagerais.",
      ],
      0,
      "Dopo si con ipotesi irreale si usa l'imparfait; il condizionale va solo nella principale. «Si j'aurais» ricalca il congiuntivo italiano; «je voyagerai» dopo un imparfait mescola i due schemi.",
    ),
    q(
      'q4',
      'Come si dice «Sono appena arrivato»?',
      ["Je viens d'arriver.", 'Je suis juste arrivé.', 'Je vais arriver.', 'Je suis venu arriver.'],
      0,
      'Venir de + infinito esprime il passato recente. «Aller + infinito» indica il futuro prossimo: stessi ausiliari, direzione opposta.',
    ),
    q(
      'q5',
      "Che differenza di suono c'è tra «je parlerai» e «je parlerais»?",
      [
        '[par-lë-RÉ] chiusa / [par-lë-RÈ] aperta',
        '[par-lë-RÈ] aperta / [par-lë-RÉ] chiusa',
        'Nessuna: si distinguono solo scrivendo',
        '[par-lë-RAI] / [par-lë-RAIS] con -s detta',
      ],
      0,
      'Futuro in -ai = é chiusa, condizionale in -ais = è aperta. La s finale è muta in entrambi i casi, quindi la qualità della vocale è il solo segnale.',
    ),
    q(
      'q6',
      'Quale radice ha «pouvoir» al futuro?',
      ['pourr-: je pourrai', 'pouvr-: je pouvrai', 'puiss-: je puisserai', 'pouv-: je pouverai'],
      0,
      "Pouvoir ha radice irregolare pourr- (stesso suono del condizionale: pourrais). La forma regolare pouvrai è l'errore tipico per analogia sull'infinito.",
    ),
    q(
      'q7',
      "Come si dice «Tra un'ora partirò»?",
      [
        'Dans une heure, je partirai.',
        'En une heure, je partirai.',
        'Pendant une heure, je partirai.',
        'Il y a une heure, je partirai.',
      ],
      0,
      'Dans + durata = fra (momento futuro). En indicherebbe la durata, pendant «per»; il y a significa «fa» e guarda al passato.',
    ),
    q(
      'q8',
      'Cosa vuol dire «Il y aurait deux blessés»?',
      [
        'ci sarebbero due feriti, non confermato',
        'ci saranno due feriti nei prossimi giorni',
        "c'erano due feriti nella stessa zona",
        'ci sono due feriti, notizia sicura',
      ],
      0,
      'Il condizionale giornalistico segnala una notizia non verificata. Non è né futuro (sarebbero «auront») né imparfait.',
    ),
    q(
      'q9',
      'Come si legge «ils seront» e come si distingue da «ils seraient»?',
      [
        'il së-RÕ / il së-RÈ: nasale e poi è aperta',
        'il së-RÕ / il së-RÕ: suonano proprio uguali',
        'il sé-RAN / il sé-RÈ: con an finale detta',
        'il së-RÈ / il së-RÕ: ma le due sono scambiate',
      ],
      0,
      'Seront (futuro) finisce con la nasale õ, seraient (condizionale) con è aperta; -aient è muto in scrittura e vale solo [È]. Scambiarli cambia il tempo.',
    ),
  ],
  [
    card('c1', 'futur simple', 'Infinito + ai, as, a, ons, ez, ont: je parlerai [par-lë-RÉ].'),
    card('c2', 'radici irregolari 1', 'être ser-, avoir aur-, aller ir-, faire fer-, savoir saur-.'),
    card('c3', 'radici irregolari 2', 'venir viendr-, pouvoir pourr-, vouloir voudr-, devoir devr-, voir verr-.'),
    card('c4', 'futur proche', 'aller + infinito: je vais partir [zhë vè par-TIR].'),
    card('c5', 'passé récent', "venir de + infinito: je viens d'arriver [zhë vyẽ da-ri-VÉ]."),
    card('c6', 'conditionnel', 'Radice del futuro + -ais, -ais, -ait, -ions, -iez, -aient: je voudrais [vu-DRÈ].'),
    card('c7', '-ai vs -ais', 'Futuro -ai [É], condizionale -ais [È]: parlerai / parlerais.'),
    card('c8', 'cortesia', 'Je voudrais..., Pourriez-vous..., Auriez-vous...: mai "je veux" in un negozio.'),
    card('c9', 'si + presente', "Si + presente → futuro: s'il pleut, je resterai."),
    card('c10', 'si + imparfait', "Si + imparfait → condizionale: si j'avais le temps, je voyagerais."),
    card('c11', 'mai dopo si', 'Mai futuro, mai condizionale, mai congiuntivo dopo si ipotetico.'),
    card('c12', 'dans vs en', "dans une heure = fra un'ora; en une heure = in un'ora (durata)."),
  ],
  [
    prac(
      'p1',
      'Coniuga al futuro: «faire» e «venir» (je, nous), «être» (ils).',
      'faire: je ferai [fë-RÉ], nous ferons; venir: je viendrai, nous viendrons; être: ils seront [së-RÕ]. Nota: radici fer-, viendr-, ser-.',
    ),
    prac(
      'p2',
      'Traduci: «Se domani piove resterò a casa; se avessi più tempo, partirei.»',
      "S'il pleut demain, je resterai à la maison; si j'avais plus de temps, je partirais. Nota: si + presente → futuro; si + imparfait → condizionale.",
    ),
    prac(
      'p3',
      "Rendi cortese: «Je veux un billet pour Paris et tu me donnes l'horaire».",
      "Je voudrais un billet pour Paris. Pourriez-vous me donner l'horaire, s'il vous plaît ? Nota: condizionale + vous.",
    ),
    prac(
      'p4',
      "Correggi: «Si j'aurais de l'argent, j'achèterai une maison».",
      "Si j'avais de l'argent, j'achèterais une maison. Nota: dopo si, imparfait; nella principale condizionale (achèterais, non achèterai).",
    ),
    prac(
      'p5',
      'Scrivi 3 frasi con futur proche e passé récent.',
      "Esempio: Je vais cuisiner ce soir. Elle vient de finir son travail. Nous allons partir demain, ils viennent d'arriver. Nota: aller/venir al presente + infinito.",
    ),
  ],
)

export const fpronomi = mod(
  'fr-pronomi',
  'Pronomi complemento e pronomi tonici',
  "COD e COI, y, en, ordine e posizione, moi/toi, c'est moi",
  'a2',
  `${PRON_SHORT}
<p class="lead">I pronomi complemento stanno <b>prima</b> del verbo coniugato (non dopo l'infinito, come in italiano «vederlo»). Imparare l'ordine permette di costruire frasi lunghe senza esitare.</p>
<h3>COD, COI, y, en</h3>
<table><tr><th>Persona</th><th>COD (lo, la)</th><th>COI (a lui, a lei)</th></tr>
<tr><td>1ª sing.</td><td>me [më] / m'</td><td>me [më] / m'</td></tr>
<tr><td>2ª sing.</td><td>te [të] / t'</td><td>te [të] / t'</td></tr>
<tr><td>3ª m. / f.</td><td>le [lë], la [la], l'</td><td>lui [LÜI]</td></tr>
<tr><td>1ª plur.</td><td>nous [nu]</td><td>nous [nu]</td></tr>
<tr><td>2ª plur.</td><td>vous [vu]</td><td>vous [vu]</td></tr>
<tr><td>3ª plur.</td><td>les [lé]</td><td>leur [LÖR]</td></tr></table>
<p><i>Je le vois</i> [zhë lë VUA], <i>Je lui parle</i> [zhë lüi PARL] (anche a una donna: <i>lui</i> non ha genere), <i>Je leur écris</i> [zhë lör é-KRI]. <b>Y</b> (ci) sostituisce à/dans/sur + cosa o luogo: <i>J'y vais</i> [zhi VÈ], <i>Nous y pensons</i> [nu-zi pã-SÕ]. <b>En</b> (ne) sostituisce de + cosa, il partitivo e le quantità: <i>J'en veux</i> [zhã VÖ], <i>J'en ai trois</i> [zhã-né TRUA], <i>Il y en a</i> [i-lyã-NA]. La quantità si ripete: «ne ho tre» = <i>j'en ai trois</i>.</p>
<h3>Dove si mettono</h3>
<ul><li>Prima del verbo coniugato: <i>Je le vois</i>. Negazione avvolge tutto: <i>Je ne le vois pas</i> [zhë në lë vua PA].</li><li>Con modale + infinito: davanti all'<b>infinito</b>: <i>Je veux le voir</i> [zhë vö lë VUAR]; <i>Je vais lui parler</i>. (L'italiano dice «vederlo», «parlargli».)</li><li>Passé composé: davanti all'ausiliare: <i>Je l'ai vu</i> [zhë lé VÜ]; accordo con il COD: <i>Je l'ai vue</i>, <i>Je les ai vus</i> [zhë lé-zé VÜ].</li></ul>
<h3>Ordine dei pronomi</h3>
<p>Ordine fisso: <b>me/te/se/nous/vous</b> → <b>le/la/les</b> → <b>lui/leur</b> → <b>y</b> → <b>en</b>. <i>Il me le donne</i> [il më lë DÒN], <i>Je te la présente</i>, <i>Je le lui donne</i> [zhë lë lüi DÒN], <i>Il m'en parle</i> [il mã PARL], <i>Je lui en donne</i> [zhë lüi ã DÒN], <i>Il y en a</i>. Con due pronomi di terza persona il COD viene prima: <i>je le lui donne</i>, mai «je lui le donne».</p>
<h3>Trappole di reggenza</h3>
<ul><li>Italiano <i>gli / le / loro</i> → francese <i>lui</i> (maschile e femminile) e <i>leur</i>: «le telefono» = <i>je lui téléphone</i>. Reggono à + persona (quindi COI): <i>téléphoner, répondre, obéir, demander, plaire, ressembler</i>.</li><li>«Mi manchi» = <i>tu me manques</i> [tü më MÃK] (soggetto e complemento invertiti): la persona che manca è il soggetto.</li><li>Con <i>penser à</i>, <i>songer à</i>, <i>faire attention à</i>, <i>s'intéresser à</i> + persona si usa il pronome tonico: <i>Je pense à lui</i> [zhë pãs a LÜI], non «je lui pense» (per «sognare qualcuno»: <i>rêver de lui</i>).</li><li><i>Attendre, écouter, regarder, chercher</i> reggono COD: <i>Je l'attends</i> [zhë la-TÃ], <i>Je l'écoute</i>.</li></ul>
<h3>Pronomi tonici</h3>
<table><tr><th>Persona</th><th>Tonico</th><th>Pronuncia</th></tr>
<tr><td>io / tu</td><td>moi / toi</td><td>[MUA] / [TUA]</td></tr>
<tr><td>lui / lei</td><td>lui / elle</td><td>[LÜI] / [ÈL]</td></tr>
<tr><td>noi / voi</td><td>nous / vous</td><td>[NU] / [VU]</td></tr>
<tr><td>loro</td><td>eux / elles</td><td>[Ö] / [ÈL]</td></tr></table>
<p>Si usano dopo una preposizione (<i>avec moi</i> [a-vèk MUA], <i>chez lui</i>, <i>pour elles</i>), per enfasi (<i>Moi, je préfère le thé</i>), da soli (<i>Qui veut du café ? — Moi !</i>), dopo <i>c'est</i> (<i>C'est moi</i> [sè MUA]), nei confronti (<i>plus grand que toi</i>), con <i>aussi/non plus</i> (<i>Moi aussi</i>, <i>Moi non plus</i>). Dopo <i>c'est moi qui</i> il verbo si accorda con la persona: <i>C'est moi qui ai fait</i> [sè mua ki é FÈ]. <i>Eux</i> è solo maschile plurale; <i>c'est à moi</i> = «è mio».</p>
<h3>Relativi semplici: qui, que, où</h3>
<p>Servono già da ora (<i>la lettre que j'ai écrite</i>, <i>c'est moi qui</i>). Si traducono «che» o «in cui»: la scelta dipende dalla funzione nella frase, non dal genere.</p>
<table><tr><th>Relativo</th><th>Funzione</th><th>Esempio</th></tr>
<tr><td>qui [KI]</td><td>soggetto (che)</td><td>L'homme qui parle est mon père.</td></tr>
<tr><td>que [kë], qu'</td><td>oggetto (che)</td><td>Le livre que je lis est bon.</td></tr>
<tr><td>où [U]</td><td>luogo o tempo (in cui)</td><td>La ville où j'habite. Le jour où il est venu.</td></tr></table>
<p>Dopo <b>qui</b> viene il verbo (<i>qui parle</i>); dopo <b>que</b> viene un soggetto (<i>que je lis</i>, <i>qu'il lit</i>). Qui non si elide mai, que sì. Trappole dall'italiano: «il libro che leggo» è sempre <i>que</i>, mai «qui»; e il relativo non si può omettere (<i>le livre que je lis</i>, mai «le livre je lis»). Con <i>que</i> oggetto davanti al verbo il participio si accorda: <i>la lettre que j'ai écrite</i>. <i>Dont</i>, <i>lequel</i>, <i>ce qui</i> e <i>ce que</i> arrivano nei moduli del livello B1.</p>
<div class="say"><b>Cosa dire.</b> «Tu l'as vu ? — Oui, je l'ai vu hier. Je lui ai parlé et je lui en ai donné [zhë lüi ã né dò-NÉ].»</div>`,
  [
    q(
      'q1',
      'Come si dice «Voglio vederlo»?',
      ['Je veux le voir.', 'Je veux voir-le.', 'Je le veux voir.', 'Je veux voirlo.'],
      0,
      "Il pronome si mette davanti all'infinito, non dopo come in italiano (vederlo). «Je le veux voir» è un'errata costruzione dall'ordine antico; «voir-le» non esiste.",
    ),
    q(
      'q2',
      "Come si dice «Gliel'ho dato» (a lui)?",
      ['Je le lui ai donné.', "Je lui l'ai donné.", 'Je lui le ai donné.', "Je l'ai lui donné."],
      0,
      "Con COD e COI di 3ª persona l'ordine è le/la/les prima di lui/leur. Gli altri ordini invertono i pronomi o li separano dal verbo.",
    ),
    q(
      'q3',
      'Quale frase è corretta?',
      ['Je pense à lui.', 'Je lui pense.', 'Je pense lui.', 'Je le pense à.'],
      0,
      'Con penser à + persona si usa à + pronome tonico, non il COI. «Je lui pense» sembra naturale perché lui esiste, ma con questi verbi il francese vuole la preposizione.',
    ),
    q(
      'q4',
      'Come si traduce «Ne ho tre»?',
      ["J'en ai trois.", "J'ai trois.", "J'y ai trois.", 'Je les ai trois.'],
      0,
      "En riprende la cosa e la quantità si deve ripetere. Dire solo «j'ai trois» non ha oggetto, e y sostituisce un luogo, non un partitivo.",
    ),
    q(
      'q5',
      'Quale forma è giusta per «Mi manchi»?',
      ['Tu me manques.', 'Je te manque.', 'Je manque à toi.', 'Tu manques à moi.'],
      0,
      'In francese la persona che manca è il soggetto: tu me manques. «Je te manque» significherebbe «io manco a te», cioè tu senti la mia mancanza.',
    ),
    q(
      'q6',
      "Come si dice «Sono io che l'ho fatto»?",
      ["C'est moi qui l'ai fait.", "C'est moi qui l'a fait.", "C'est je qui l'ai fait.", "C'est moi que je l'ai fait."],
      0,
      "Dopo c'est moi qui il verbo si accorda con la prima persona (ai). «A fait» accorda con c'est, «je» come tonico non esiste.",
    ),
    q(
      'q7',
      'Come si legge «je les ai vus» ?',
      ['zhë lé-zé VÜ', 'zhë lés ai VU', 'zhë lé ai VUS', 'zhë lé-zè VUS'],
      0,
      "Les + ai: liaison della s con z e ai = é chiusa. Il participio vu ha ü e la s dell'accordo è muta.",
    ),
    q(
      'q8',
      'Quale ordine di pronomi è corretto?',
      ["Il m'en donne.", "Il en m'donne.", 'Il me en donne.', "Il m'donne en."],
      0,
      "L'ordine è me/te/nous/vous prima di en; me si elide in m' davanti a en. «Me en» non esiste e en non segue il verbo.",
    ),
    q(
      'q9',
      "Che differenza di suono c'è tra «le» e «les» davanti a un verbo?",
      [
        'le [lë] con e muta; les [lé] con é chiusa',
        'le [lë] e les [lë]: sono perfettamente uguali',
        'le [LÈ] con è aperta; les [LÈS] con la s detta',
        'le [lé] con é chiusa; les [lë] con e muta',
      ],
      0,
      'Il pronome singolare ha la e muta, il plurale una é chiusa: è la sola differenza udibile tra je le vois e je les vois, perché la s è muta.',
    ),
    q(
      'q10',
      'Come si dice «Il libro che leggo»?',
      ['Le livre que je lis.', 'Le livre qui je lis.', 'Le livre je lis.', 'Le livre que lis.'],
      0,
      'Il libro è il complemento oggetto di leggo, quindi si usa que, seguito dal soggetto je. «Qui» è riservato al soggetto, e il relativo non si può omettere come in inglese.',
    ),
    q(
      'q11',
      'Quale frase è corretta?',
      [
        'La femme qui parle est ma sœur.',
        'La femme que parle est ma sœur.',
        'La femme où parle est ma sœur.',
        "La femme qu'elle parle est ma sœur.",
      ],
      0,
      'Qui è il soggetto della relativa: dopo di lui viene subito il verbo. «Que parle» mancherebbe del soggetto, e où indica solo un luogo o un tempo.',
    ),
  ],
  [
    card('c1', 'COD', "me, te, le/la/l', nous, vous, les: davanti al verbo."),
    card('c2', 'COI', 'me, te, lui, nous, vous, leur: lui vale per lui e per lei.'),
    card('c3', 'y', "Ci: à/dans/sur + luogo o cosa: j'y vais [zhi VÈ]."),
    card('c4', 'en', "Ne: de + cosa, partitivo, quantità: j'en veux [zhã VÖ], j'en ai trois."),
    card('c5', 'ordine', 'me te se nous vous → le la les → lui leur → y → en.'),
    card('c6', 'con infinito', "Il pronome sta davanti all'infinito: je veux le voir, je vais lui parler."),
    card('c7', 'passé composé', "Davanti all'ausiliare, accordo col COD: je l'ai vue; je les ai vus [lé-zé VÜ]."),
    card('c8', 'penser à', 'Con una persona si usa à + tonico: je pense à lui [a LÜI].'),
    card('c9', 'manquer', 'Tu me manques [tü më MÃK]: la persona che manca è il soggetto.'),
    card('c10', 'tonici', 'moi [MUA], toi [TUA], lui [LÜI], elle [ÈL], nous, vous, eux [Ö], elles [ÈL].'),
    card('c11', "c'est moi qui", "Il verbo si accorda con la persona: c'est moi qui ai fait [sè mua ki é FÈ]."),
    card('c12', 'pronome + negazione', 'ne davanti ai pronomi: je ne le lui donne pas [zhë në lë lüi dòn PA].'),
    card(
      'c13',
      'qui / que / où',
      "qui = soggetto (l'homme qui parle); que = oggetto (le livre que je lis); où = luogo o tempo (la ville où j'habite).",
    ),
  ],
  [
    prac(
      'p1',
      'Sostituisci con i pronomi: «Je donne le livre à Marie».',
      'Je le lui donne. Nota: livre (COD) → le; Marie (COI) → lui; ordine le + lui.',
    ),
    prac(
      'p2',
      'Traduci: «Ne vuoi ancora? — Sì, ne voglio due.»',
      "Tu en veux encore ? — Oui, j'en veux deux. Nota: en riprende il partitivo, ma la quantità si ripete.",
    ),
    prac(
      'p3',
      'Correggi: «Je veux lui le dire et je pense lui tout le temps».',
      "Je veux le lui dire et je pense à lui tout le temps. Nota: pronomi prima dell'infinito, ordine le + lui; penser à + tonico.",
    ),
    prac(
      'p4',
      'Rispondi con pronomi: «Tu es allé à Paris ? Tu as parlé à ta mère ? Tu as acheté du pain ?»',
      "Oui, j'y suis allé. Oui, je lui ai parlé. Oui, j'en ai acheté. Nota: y per il luogo, lui per la madre, en per il partitivo (en non provoca accordo del participio: j'en ai acheté).",
    ),
    prac(
      'p6',
      "Completa con qui, que o où: «La ville ... j'habite est belle; l'ami ... m'appelle est italien; le film ... j'ai vu hier est long».",
      "La ville où j'habite; l'ami qui m'appelle; le film que j'ai vu. Nota: où per il luogo, qui per il soggetto (segue il verbo), que per l'oggetto (segue un soggetto).",
    ),
    prac(
      'p5',
      'Completa con un pronome tonico: «... et ..., nous allons au cinéma» (io e lui).',
      'Lui et moi, nous allons au cinéma. Nota: il soggetto doppio è ripreso da nous; moi in ultima posizione.',
    ),
  ],
)

export const fimperatif = mod(
  'fr-imperatif',
  "L'imperativo, istruzioni e ricette",
  'Forme e irregolari, imperativo con i pronomi, negativo, infinito nelle istruzioni',
  'a2',
  `${PRON_SHORT}
<p class="lead">L'imperativo ha tre persone (tu, nous, vous), senza pronome soggetto. Si usa per ordini, consigli, inviti e ricette.</p>
<h3>Formazione</h3>
<table><tr><th></th><th>parler</th><th>finir</th><th>prendre</th></tr>
<tr><td>tu</td><td>parle [PARL]</td><td>finis [fi-NI]</td><td>prends [PRÃ]</td></tr>
<tr><td>nous</td><td>parlons [par-LÕ]</td><td>finissons [fi-ni-SÕ]</td><td>prenons [prë-NÕ]</td></tr>
<tr><td>vous</td><td>parlez [par-LÉ]</td><td>finissez [fi-ni-SÉ]</td><td>prenez [prë-NÉ]</td></tr></table>
<p>Come il presente, ma la <b>-s della forma tu cade per i verbi in -er</b> (e per aller, ouvrir, offrir): <i>Parle !</i>, <i>Va !</i>, <i>Ouvre !</i>. Irregolari: <b>être</b> <i>sois</i> [SUA], <i>soyons</i> [sua-YÕ], <i>soyez</i> [sua-YÉ]; <b>avoir</b> <i>aie</i> [È], <i>ayons</i> [è-YÕ], <i>ayez</i> [è-YÉ]; <b>savoir</b> <i>sache</i> [SASH], <i>sachons</i>, <i>sachez</i>; <b>faire</b> <i>fais</i> [FÈ], <i>faisons</i> [fë-ZÕ], <i>faites</i> [FÈT]; <b>dire</b> <i>dis</i> [DI], <i>disons</i>, <i>dites</i> [DIT]; <b>aller</b> <i>va</i> [VA], <i>allons</i> [a-LÕ], <i>allez</i> [a-LÉ]; <b>vouloir</b> <i>veuillez</i> [vö-YÉ] (formale, «voglia»).</p>
<p>La forma <i>nous</i> è l'invito: <i>Allons-y !</i> [a-lõ-ZI] «andiamo!». Cortesia: <i>Entrez</i> [ã-TRÉ], <i>asseyez-vous</i> [a-sè-yé-VU] «si accomodi»: il «Lei» italiano diventa vous.</p>
<h3>Imperativo negativo</h3>
<p>Negazione intorno al verbo, pronomi (se ci sono) davanti al verbo: <i>Ne parle pas !</i> [në PARL pa], <i>Ne le fais pas !</i> [në lë fè PA], <i>Ne vous inquiétez pas.</i> [në vu-zẽ-kyé-té PA], <i>N'y va pas.</i> L'italiano dice «non parlare!» (infinito): in francese si usa l'imperativo, mai <i>ne pas parler</i> (quella è la forma delle scritte: <i>Ne pas fumer</i>).</p>
<h3>Pronomi con l'imperativo affermativo</h3>
<p>Dopo il verbo, con il <b>trattino</b>, sempre <b>COD prima di COI</b> (nel presente invece <i>il me le donne</i>): <i>Donne-le-moi</i> [dòn-lë-MUA], <i>Dis-le-lui</i> [di-lë-LÜI], <i>Donnez-m'en</i> [dò-né-MÃ], <i>Dépêche-toi</i> [dé-pèsh-TUA], <i>Lève-toi</i> [lèv-TUA], <i>Assieds-toi</i> [a-syè-TUA], <i>Attends-moi</i> [a-tã-MUA]. Me → <b>moi</b>, te → <b>toi</b> a fine frase; <i>m'</i>, <i>t'</i> davanti a <i>en</i>. Davanti a <i>y</i> e <i>en</i> i verbi in -er recuperano la -s: <i>Vas-y</i> [va-ZI], <i>Parles-en</i> [par-lë-ZÃ], <i>Penses-y</i>. Il pronome <i>ne</i> negativo riporta tutto davanti: <i>Ne me le donne pas</i> [në më lë dòn PA], <i>Ne t'en fais pas</i> [në tã FÈ pa] «non preoccuparti».</p>
<h3>Istruzioni e ricette</h3>
<p>Le ricette e i cartelli usano l'<b>infinito</b> (<i>Mélanger la farine et les œufs</i>) o l'imperativo vous (<i>Mélangez...</i>).</p>
<table><tr><th>Verbo</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>éplucher</td><td>[é-plü-SHÉ]</td><td>sbucciare</td></tr>
<tr><td>couper</td><td>[ku-PÉ]</td><td>tagliare</td></tr>
<tr><td>mélanger</td><td>[mé-lã-ZHÉ]</td><td>mescolare</td></tr>
<tr><td>ajouter</td><td>[a-zhu-TÉ]</td><td>aggiungere</td></tr>
<tr><td>verser</td><td>[vèr-SÉ]</td><td>versare</td></tr>
<tr><td>faire cuire</td><td>[fèr KÜIR]</td><td>cuocere</td></tr>
<tr><td>laisser reposer</td><td>[lè-sé rë-po-ZÉ]</td><td>lasciar riposare</td></tr>
<tr><td>saler, poivrer</td><td>[sa-LÉ, pua-VRÉ]</td><td>salare, pepare</td></tr></table>
<p>Misure: <i>200 g de farine</i> [dë fa-RIN], <i>une cuillère à soupe</i> [ün küi-yèr a SUP], <i>une pincée de sel</i> [ün pẽ-sé dë SÈL], <i>un peu de beurre</i> [BÖR]. Crêpes: <i>250 g de farine, 4 œufs, 50 cl de lait, une pincée de sel. Mélangez la farine et les œufs, ajoutez le lait petit à petit, laissez reposer une heure, faites cuire dans une poêle chaude.</i></p>
<div class="say"><b>Cosa dire.</b> «Excusez-moi, pouvez-vous me dire où est la gare ? — Allez tout droit, tournez à gauche. Ne vous inquiétez pas, c'est près d'ici.»</div>`,
  [
    q(
      'q1',
      'Come si dice «Parla!» (a un amico)?',
      ['Parle !', 'Parles !', 'Tu parle !', 'Parlez-tu !'],
      0,
      "Nei verbi in -er la forma tu perde la -s all'imperativo. «Parles» è la forma del presente; il pronome tu non si scrive.",
    ),
    q(
      'q2',
      'Come si dice «Non parlarmi!»?',
      ['Ne me parle pas !', 'Ne parle pas me !', 'Ne parle-moi pas !', 'Pas me parle !'],
      0,
      "Nell'imperativo negativo i pronomi tornano davanti al verbo (ne me parle pas). La forma con trattino è solo dell'affermativo.",
    ),
    q(
      'q3',
      'Come si dice «Dammelo!»?',
      ['Donne-le-moi !', 'Donne-moi-le !', 'Donne-me-le !', 'Me le donne !'],
      0,
      "All'affermativo: verbo, COD (le), COI (moi), con i trattini. «Moi-le» inverte l'ordine, e me non resta alla fine: diventa moi.",
    ),
    q(
      'q4',
      'Quale forma è corretta per «Preoccupati!» (tu)?',
      ["Ne t'en fais pas !", "Ne t'en fait pas !", "Fais-t'en pas !", 'Ne te fais-en pas !'],
      0,
      "Negativo con pronomi davanti al verbo: ne t'en fais pas. Il verbo faire all'imperativo tu fa fais (con s).",
    ),
    q(
      'q5',
      'Come si legge «sois», imperativo di «être» (tu)?',
      [
        'SUA: oi suona ua e la s è muta',
        'SUÈ: oi suona uè e la s è muta',
        'SUAS: oi suona ua e la s si dice',
        'SÖ: eu come in «deux»',
      ],
      0,
      'Sois viene dal congiuntivo (sois, soyons, soyez): oi si legge ua come in moi e la s finale è muta. Es è invece il presente, e la pronuncia uè non esiste in francese.',
    ),
    q(
      'q6',
      'Quale frase si usa su un cartello «vietato fumare»?',
      ['Ne pas fumer', 'Ne fume pas', 'Fumez pas', 'Pas de fumer'],
      0,
      "I cartelli usano l'infinito negativo (ne pas + infinito). «Ne fume pas» è un imperativo rivolto a una persona sola, adatto a parlare, non a un cartello.",
    ),
    q(
      'q7',
      'Come si legge «vas-y» e perché la -s?',
      [
        'va-ZI: la s torna e suona z davanti a y',
        'vas-I: la s resta muta davanti a y',
        'va-SI: la s torna ma suona come s sorda',
        'vaz-I: tutte le lettere dette una a una',
      ],
      0,
      "Va non ha -s, ma davanti a y/en la -s torna per evitare l'iato e si lega con suono z. Per questo vas-y suona va-ZI, non va-SI.",
    ),
    q(
      'q8',
      'Come si dice «Si accomodi» (formale)?',
      ['Asseyez-vous', 'Assieds-toi', 'Asseyons-nous', 'Vous asseyez'],
      0,
      'Il «Lei» italiano corrisponde a vous: assieds-toi è tu, asseyons-nous è «sediamoci». Vous asseyez è un presente, non un invito.',
    ),
  ],
  [
    card('c1', 'imperativo: forme', 'tu / nous / vous senza soggetto: parle, parlons, parlez.'),
    card('c2', '-er senza s', 'Parle ! Ouvre ! Va ! La s di tu cade (ma torna davanti a y/en: vas-y, parles-en).'),
    card('c3', 'être', 'sois [SUA], soyons [sua-YÕ], soyez [sua-YÉ].'),
    card('c4', 'avoir', 'aie [È], ayons [è-YÕ], ayez [è-YÉ].'),
    card('c5', 'faire / dire', 'fais, faisons [fë-ZÕ], faites [FÈT]; dis, disons, dites [DIT].'),
    card('c6', 'aller / savoir', 'va, allons, allez; sache, sachons, sachez.'),
    card('c7', 'negativo', 'Ne parle pas ! I pronomi stanno prima del verbo: ne me le donne pas.'),
    card('c8', 'pronomi affermativi', 'Dopo il verbo, col trattino, COD prima del COI: donne-le-moi [dòn-lë-MUA].'),
    card('c9', 'moi / toi', "Alla fine me → moi, te → toi: dépêche-toi [dé-pèsh-TUA]; ma m'en, t'en."),
    card('c10', 'ricette', 'Infinito o imperativo vous: mélanger / mélangez.'),
    card('c11', 'vas-y [va-ZI]', 'La s torna e suona z davanti a y/en: vas-y, parles-en [par-lë-ZÃ].'),
    card('c12', 'misure', 'une cuillère à soupe, une pincée de sel [pẽ-sé dë SÈL], 200 g de farine.'),
  ],
  [
    prac(
      'p1',
      "Trasforma all'imperativo (tu): «tu parles plus fort; tu es patient; tu fais attention».",
      'Parle plus fort ! Sois patient ! Fais attention ! Nota: parle senza s; sois irregolare.',
    ),
    prac(
      'p2',
      'Traduci: «Dammi il sale! Non darmelo!»',
      'Donne-moi le sel ! Ne me le donne pas ! Nota: affermativo con trattino e moi; negativo con pronomi prima del verbo.',
    ),
    prac(
      'p3',
      'Correggi: «Lèvez-te, dépêche-te et ne pas parler!»',
      'Lève-toi, dépêche-toi et ne parle pas ! Nota: te → toi dopo il verbo; negativo con ne...pas intorno al verbo.',
    ),
    prac(
      'p4',
      'Scrivi 5 istruzioni per fare una pasta al pomodoro (infinito).',
      "Esempio: Faire bouillir l'eau. Saler. Ajouter les pâtes. Égoutter. Verser la sauce tomate. Nota: la ricetta usa l'infinito o vous; vocabolario: faire bouillir [fèr bu-YIR], égoutter [é-gu-TÉ].",
    ),
    prac(
      'p5',
      "Rivolgiti con cortesia a uno sconosciuto: «mi scusi, mi dica l'ora».",
      "Excusez-moi, dites-moi l'heure, s'il vous plaît. Nota: dites è l'unica forma in -tes di dire; excusez-moi con trattino.",
    ),
  ],
)

export const fconfronti = mod(
  'fr-confronti',
  'Confronti, quantità, preposizioni e interrogativi',
  'Comparativi e superlativi, beaucoup/assez/trop, depuis/pendant/il y a/dans/en, quel e lequel',
  'a2',
  `${PRON_SHORT}
<p class="lead">Confrontare, quantificare e collocare nel tempo: serve a ogni conversazione. Le trappole sono tutte nelle piccole parole.</p>
<h3>Comparativi e superlativi</h3>
<table><tr><th>Tipo</th><th>Costruzione</th><th>Esempio</th></tr>
<tr><td>più</td><td>plus [PLÜ] ... que [kë]</td><td>plus grand que moi</td></tr>
<tr><td>meno</td><td>moins [MUẼ] ... que</td><td>moins cher que toi</td></tr>
<tr><td>uguale</td><td>aussi [o-SI] ... que</td><td>aussi vite que lui</td></tr>
<tr><td>superlativo</td><td>le / la / les plus ...</td><td>le plus grand [lë plü GRÃ]</td></tr></table>
<p>Irregolari: <b>bon → meilleur</b> [mè-YÖR] (mai «plus bon»), <b>bien → mieux</b> [MYÖ], <b>mauvais → plus mauvais</b> o <b>pire</b> [PIR] (cose astratte). <i>Ce gâteau est meilleur</i>, <i>Elle chante mieux que moi</i>, <i>C'est le meilleur film</i>. Superlativo con aggettivo che segue il nome: ripete l'articolo, <i>la ville la plus grande</i> [la vil la plü GRÃD] / <i>la plus grande ville</i>. «Di» dopo il superlativo è <b>de</b>: <i>le plus grand de la classe</i>, <i>du monde</i> (mai «dans»).</p>
<h3>Quantità</h3>
<table><tr><th>Francese</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>beaucoup de</td><td>[bo-KU dë]</td><td>molto</td></tr>
<tr><td>peu de / un peu de</td><td>[PÖ dë] / [ẽ PÖ dë]</td><td>poco / un po' di</td></tr>
<tr><td>assez de</td><td>[a-SÉ dë]</td><td>abbastanza</td></tr>
<tr><td>trop de</td><td>[TRO dë]</td><td>troppo</td></tr>
<tr><td>autant de</td><td>[o-TÃ dë]</td><td>altrettanto</td></tr>
<tr><td>plus de / moins de</td><td>[PLÜ dë] / [MUẼ dë]</td><td>più / meno di</td></tr></table>
<p>Dopo una quantità si usa <b>de</b> (non l'articolo): <i>beaucoup de gens</i>, <i>trop de travail</i>. Eccezioni: <i>la plupart des gens</i>, <i>bien des fois</i>. <i>Très</i> + aggettivo o avverbio (<i>très bien</i>), <i>beaucoup</i> con verbi (<i>j'aime beaucoup</i>): mai «très beaucoup». <i>Trop</i> = troppo (negativo), <i>assez</i> = abbastanza (anche «sufficientemente»).</p>
<h3>Preposizioni di tempo</h3>
<table><tr><th>Prep.</th><th>Uso</th><th>Esempio</th></tr>
<tr><td>depuis [dë-PÜI]</td><td>da (azione ancora in corso)</td><td>J'habite ici depuis 3 ans.</td></tr>
<tr><td>pendant [pã-DÃ]</td><td>per (durata)</td><td>J'ai travaillé pendant 2 heures.</td></tr>
<tr><td>il y a [i-lya]</td><td>fa</td><td>Je suis arrivé il y a deux jours.</td></tr>
<tr><td>dans [DÃ]</td><td>fra / tra (futuro)</td><td>Je pars dans deux jours.</td></tr>
<tr><td>en [Ã]</td><td>in (tempo impiegato)</td><td>Je l'ai fait en une heure.</td></tr>
<tr><td>pour [PUR]</td><td>per (durata prevista)</td><td>Je pars pour trois jours.</td></tr></table>
<p>Altre preposizioni: <b>à</b> (<i>à pied</i> [a PYÉ], <i>à vélo</i>), <b>en</b> (<i>en voiture</i> [ã vua-TÜR], <i>en train</i>, <i>en bois</i>), <b>de</b> (<i>le livre de Marie</i>, <i>du matin au soir</i>), <b>par</b> (<i>par jour</i>, <i>par la fenêtre</i>, agente del passivo), <b>pour</b> (destinatario, scopo: <i>pour toi</i>, <i>pour apprendre</i>), <b>dans</b> (dentro). Mezzi di trasporto: <i>à pied, à vélo, à cheval</i> ma <i>en voiture, en train, en avion, en bus</i>.</p>
<h3>Interrogativi: quel e lequel</h3>
<p><b>Quel</b> si accorda con il nome: <i>quel</i>, <i>quelle</i>, <i>quels</i>, <i>quelles</i> (tutti [KÈL]). <i>Quel âge as-tu ?</i> [kè-LAZH a-TÜ], <i>Quelle heure est-il ?</i>, <i>Quels livres ?</i>. Con un nome plurale e liaison: <i>quels amis</i> [kèl-za-MI]. <b>Lequel</b> «quale» sostituisce il nome: <i>lequel</i> [lë-KÈL], <i>laquelle</i>, <i>lesquels</i>, <i>lesquelles</i>; con le preposizioni si contrae: <i>auquel</i> [o-KÈL], <i>auxquels</i>, <i>duquel</i> [dü-KÈL], <i>desquels</i>.</p>
<p>Altre domande: <i>Qu'est-ce que c'est ?</i> [kès-kë-SÈ], <i>Qui est-ce ?</i>, <i>À quoi tu penses ?</i> [a KUA tü PÃS], <i>De quoi parles-tu ?</i> [dë KUA par-lë-TÜ], <i>Avec qui ?</i>. Trappole: «che ore sono» = <i>quelle heure est-il</i>; «quanto costa» = <i>combien ça coûte</i>; <i>quoi</i> non si usa davanti a un nome (<i>quel jour</i>, mai «quoi jour»).</p>
<div class="say"><b>Cosa dire.</b> «J'apprends le français depuis un an [zha-prã lë frã-sè dë-püi ẽ-NÃ]. Il y a beaucoup de choses plus difficiles, mais j'en fais un peu chaque jour.»</div>`,
  [
    q(
      'q1',
      'Come si dice «Questo dolce è migliore»?',
      ['Ce gâteau est meilleur.', 'Ce gâteau est plus bon.', 'Ce gâteau est mieux.', 'Ce gâteau est plus meilleur.'],
      0,
      "L'aggettivo bon ha un comparativo suo: meilleur. «Plus bon» ricalca l'italiano «più buono»; «mieux» è il comparativo dell'avverbio bien.",
    ),
    q(
      'q2',
      'Come si dice «Abito qui da tre anni»?',
      [
        "J'habite ici depuis trois ans.",
        "J'habite ici pendant trois ans.",
        "J'ai habité ici depuis trois ans.",
        "J'habite ici il y a trois ans.",
      ],
      0,
      "Depuis + presente per un'azione ancora in corso. Pendant indica una durata finita, il y a vuol dire «fa» (momento nel passato).",
    ),
    q(
      'q3',
      'Quale frase è corretta?',
      [
        'Il y a beaucoup de gens.',
        'Il y a beaucoup des gens.',
        'Il y a beaucoup gens.',
        'Il y a très beaucoup de gens.',
      ],
      0,
      "Dopo beaucoup si usa de senza articolo. «Beaucoup des gens» è l'errore dell'italiano «molte delle persone»; «très beaucoup» non esiste.",
    ),
    q(
      'q4',
      'Come si traduce «Il più grande della classe»?',
      [
        'Le plus grand de la classe',
        'Le plus grand dans la classe',
        'Le plus grand en la classe',
        'Le grand plus de la classe',
      ],
      0,
      "Dopo il superlativo il gruppo si introduce con de. «Dans la classe» è il calco dell'inglese «in the class» ed è sbagliato in francese.",
    ),
    q(
      'q5',
      'Quale tra queste forme di «quel» NON esiste?',
      ['quelle-s', 'quel', 'quels', 'quelles'],
      0,
      'Quel ha quattro forme (quel, quelle, quels, quelles) tutte con suono [KÈL]. «Quelle-s» non è una forma: la -s va su quelles.',
    ),
    q(
      'q6',
      'Come si dice «Partirò fra tre giorni»?',
      [
        'Je partirai dans trois jours.',
        'Je partirai en trois jours.',
        'Je partirai pendant trois jours.',
        'Je partirai il y a trois jours.',
      ],
      0,
      'Dans + durata indica il momento futuro (fra). En indicherebbe il tempo impiegato per partire e pendant la durata del viaggio.',
    ),
    q(
      'q7',
      'Come si legge «quels amis» ?',
      ['kèl-za-MI', 'kéls a-MI', 'kèl a-MIS', 'kèl-ça-MI'],
      0,
      'Quels + vocale: liaison obbligatoria con z (articolo/aggettivo + nome). La s finale non si pronuncia da sola come s.',
    ),
    q(
      'q8',
      'Quale preposizione si usa con «treno» e con «piedi»?',
      ['en train / à pied', 'à train / en pied', 'en train / en pied', 'à train / à pied'],
      0,
      'Regola pratica: en per i mezzi chiusi (en train, en voiture) e à per i mezzi sui quali si sale o a piedi (à pied, à vélo, à cheval). Ha eccezioni (en bateau, à moto o en moto): imparale a coppie.',
    ),
    q(
      'q9',
      'Quali forme di «quel» si pronunciano allo stesso modo?',
      [
        'quel, quelle, quels, quelles: tutte [KÈL]',
        'quel [KÈL] ma quelle [KÈ-lë]',
        'quel [KÈL] e quels [KÈLS] con la s',
        'quel e quelles uguali, quelle e quels diverse',
      ],
      0,
      "Le quattro forme suonano [KÈL] (la -e e la -s sono mute): il genere e il numero si capiscono solo dal nome o dall'articolo che le accompagna.",
    ),
  ],
  [
    card('c1', 'comparativi', 'plus ... que, moins ... que, aussi ... que.'),
    card('c2', 'meilleur', 'bon → meilleur [mè-YÖR]; bien → mieux [MYÖ]. Mai plus bon.'),
    card('c3', 'superlativo', 'le plus grand de la classe; la ville la plus grande (articolo ripetuto).'),
    card('c4', 'de dopo quantità', 'beaucoup de, trop de, assez de, un peu de: mai con articolo.'),
    card('c5', 'très vs beaucoup', "très + aggettivo/avverbio; beaucoup con i verbi: j'aime beaucoup."),
    card('c6', 'depuis', 'depuis + presente = da (azione ancora in corso) [dë-PÜI].'),
    card('c7', 'pendant', 'pendant + durata = per (azione conclusa) [pã-DÃ].'),
    card('c8', 'il y a', 'Fa: il y a deux ans.'),
    card('c9', 'dans vs en', 'dans = fra (futuro); en = in (tempo impiegato).'),
    card('c10', 'mezzi', 'à pied, à vélo, à cheval; en voiture, en train, en avion, en bus.'),
    card('c11', 'quel', 'quel, quelle, quels, quelles: tutti [KÈL]; quels amis [kèl-za-MI].'),
    card('c12', 'lequel', 'lequel, laquelle, lesquels, lesquelles; auquel, duquel...'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Lei parla meglio di me, ma io ho più tempo di lei.»',
      "Elle parle mieux que moi, mais j'ai plus de temps qu'elle. Nota: mieux (avverbio), plus de + nome, que + tonico.",
    ),
    prac(
      'p2',
      "Completa con depuis, pendant, il y a, dans, en: «J'habite ici ... 5 ans; j'ai étudié ... 3 ans; je suis arrivé ... 5 ans; je pars ... 2 jours; je l'ai fait ... 1 heure».",
      'depuis 5 ans; pendant 3 ans; il y a 5 ans; dans 2 jours; en 1 heure. Nota: depuis (in corso), pendant (durata finita), il y a (fa), dans (futuro), en (tempo impiegato).',
    ),
    prac(
      'p3',
      'Correggi: «Il y a beaucoup des étudiants et très beaucoup de bruit».',
      "Il y a beaucoup d'étudiants et beaucoup de bruit. Nota: dopo beaucoup sempre de/d'; très non va con beaucoup.",
    ),
    prac(
      'p4',
      'Fai 3 domande con quel / lequel: età, ora, quale libro.',
      'Quel âge as-tu ? Quelle heure est-il ? Lequel de ces livres préfères-tu ? Nota: quel si accorda con il nome; lequel sostituisce il nome.',
    ),
    prac(
      'p5',
      'Descrivi in 3 frasi come vai al lavoro e quanto tempo ci metti.',
      "Esempio: Je vais au travail en train. J'y vais depuis deux ans et je mets une heure. Le matin, il y a beaucoup de monde. Nota: en train; depuis per l'abitudine in corso.",
    ),
  ],
)

export const franceseA3 = [ffutur, fpronomi, fimperatif, fconfronti]
