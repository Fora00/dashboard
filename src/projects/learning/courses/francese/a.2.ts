import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './b.pron'

// FRENCH course part A, modules 5-8 (presente, quotidiano, passé composé, imparfait).

export const fpresente = mod(
  'fr-presente',
  'Il presente indicativo',
  'Gruppi -er/-ir/-re, verbi irregolari (prendre, venir, pouvoir, vouloir...), cambi ortografici',
  'a1',
  `${PRON_SHORT}
<p class="lead">Il presente francese serve per ciò che accade ora, per le abitudini e spesso anche per il futuro vicino. Il punto chiave per un italiano: sulla carta molte forme sono diverse, a voce sono uguali.</p>
<h3>I tre gruppi regolari</h3>
<table><tr><th>Persona</th><th>parler</th><th>finir</th><th>vendre</th></tr>
<tr><td>je</td><td>parle [PARL]</td><td>finis [fi-NI]</td><td>vends [VÃ]</td></tr>
<tr><td>tu</td><td>parles [PARL]</td><td>finis [fi-NI]</td><td>vends [VÃ]</td></tr>
<tr><td>il / elle</td><td>parle [PARL]</td><td>finit [fi-NI]</td><td>vend [VÃ]</td></tr>
<tr><td>nous</td><td>parlons [par-LÕ]</td><td>finissons [fi-ni-SÕ]</td><td>vendons [vã-DÕ]</td></tr>
<tr><td>vous</td><td>parlez [par-LÉ]</td><td>finissez [fi-ni-SÉ]</td><td>vendez [vã-DÉ]</td></tr>
<tr><td>ils / elles</td><td>parlent [PARL]</td><td>finissent [fi-NIS]</td><td>vendent [VÃD]</td></tr></table>
<p>Trappola di pronuncia: nei verbi in <b>-er</b> <i>parle, parles, parlent</i> suonano identici [PARL]. La desinenza -ent è solo scrittura (non è nasale come in <i>vent</i>). Nei verbi in -ir (secondo gruppo) il plurale aggiunge <b>-iss-</b>: <i>nous finissons</i>, <i>ils finissent</i> [il fi-NIS]. Qui il plurale si sente: <i>il finit</i> [fi-NI] ≠ <i>ils finissent</i> [fi-NIS]. Altri verbi come <i>finir</i>: <i>choisir</i> [shua-ZIR], <i>réussir</i>, <i>grandir</i>, <i>réfléchir</i>.</p>
<p>Anche <i>partir, sortir, dormir, sentir, servir</i> finiscono in -ir ma sono irregolari (senza -iss-): <i>je pars</i> [zhë PAR], <i>nous partons</i> [nu par-TÕ]. <i>Ouvrir, offrir, couvrir, souffrir</i> si coniugano come i verbi in -er: <i>j'ouvre</i>, <i>j'offre</i>.</p>
<h3>Irregolari essenziali</h3>
<table><tr><th>Verbo</th><th>je / tu</th><th>nous</th><th>ils / elles</th></tr>
<tr><td>prendre</td><td>prends [PRÃ]</td><td>prenons [prë-NÕ]</td><td>prennent [PRÈN]</td></tr>
<tr><td>venir</td><td>viens [VYẼ]</td><td>venons [vë-NÕ]</td><td>viennent [VYÈN]</td></tr>
<tr><td>pouvoir</td><td>peux [PÖ]</td><td>pouvons [pu-VÕ]</td><td>peuvent [PÖV]</td></tr>
<tr><td>vouloir</td><td>veux [VÖ]</td><td>voulons [vu-LÕ]</td><td>veulent [VÖL]</td></tr>
<tr><td>devoir</td><td>dois [DUA]</td><td>devons [dë-VÕ]</td><td>doivent [DUAV]</td></tr>
<tr><td>savoir</td><td>sais [SÈ]</td><td>savons [sa-VÕ]</td><td>savent [SAV]</td></tr>
<tr><td>voir</td><td>vois [VUA]</td><td>voyons [vua-YÕ]</td><td>voient [VUA]</td></tr>
<tr><td>dire</td><td>dis [DI]</td><td>disons [di-ZÕ]</td><td>disent [DIZ]</td></tr>
<tr><td>mettre</td><td>mets [MÈ]</td><td>mettons [mè-TÕ]</td><td>mettent [MÈT]</td></tr>
<tr><td>lire</td><td>lis [LI]</td><td>lisons [li-ZÕ]</td><td>lisent [LIZ]</td></tr>
<tr><td>boire</td><td>bois [BUA]</td><td>buvons [bü-VÕ]</td><td>boivent [BUAV]</td></tr></table>
<p>La forma <b>il / elle</b> è di solito quella di je con una <b>-t</b>: <i>il prend</i> (d), <i>il vient, il peut, il veut, il doit, il sait, il voit, il dit, il met, il boit</i>. Eccezioni al plurale: <i>vous dites</i> [vu DIT], <i>vous faites</i> [vu FÈT], <i>vous êtes</i> [vu-ZÈT] (non -ez). Attenzione: <i>je peux</i> e <i>je veux</i> hanno la x anche alla prima persona; <i>je sais</i> [zhë SÈ].</p>
<h3>Cambi ortografici</h3>
<ul><li><b>-ger</b>: <i>nous mangeons</i> [nu mã-ZHÕ] (e davanti a o per tenere la g dolce); <i>voyager</i>, <i>ranger</i>.</li><li><b>-cer</b>: <i>nous commençons</i> [nu kò-mã-SÕ] (ç davanti a o).</li><li><b>appeler, jeter</b> raddoppiano la consonante: <i>j'appelle</i> [zha-PÈL], <i>nous appelons</i> [nu-zap-LÕ]; <i>je jette</i> [zhë ZHÈT].</li><li><b>acheter, lever, mener</b> mettono l'accento grave: <i>j'achète</i> [zha-SHÈT], <i>nous achetons</i> [nu-zash-TÕ].</li><li><b>préférer, espérer</b>: <i>je préfère</i> [zhë pré-FÈR], <i>nous préférons</i> [nu pré-fé-RÕ].</li><li><b>-yer</b>: la y diventa i davanti a e muta: <i>j'envoie</i> [zhã-VUA], <i>nous envoyons</i> [nu-zã-vua-YÕ], <i>je paie</i> o <i>je paye</i> [zhë PÈ].</li></ul>
<h3>Pouvoir, vouloir, devoir; savoir e connaître</h3>
<p><i>Je peux</i> [zhë PÖ] possibilità e permesso; <i>je veux</i> [zhë VÖ] volontà (brusco), <i>je voudrais</i> [zhë vu-DRÈ] cortese; <i>je dois</i> [zhë DUA] dovere o probabilità. <b>Savoir</b> = sapere un fatto o saper fare (<i>je sais nager</i> [zhë sè na-ZHÉ]); <b>connaître</b> = conoscere persone e luoghi (<i>je connais Paul</i> [zhë kò-NÈ PÒL]).</p>
<h3>Come si usa</h3>
<p>Il presente copre sia «mangio» sia «sto mangiando»: <i>il mange</i> [il MÃZH]. Per l'azione in corso si può anche dire <i>il est en train de manger</i> [i-lè ã trẽ dë mã-ZHÉ]; il gerundio progressivo italiano non ha equivalente, quindi non si dice «je suis mangeant». Il presente indica anche il futuro vicino: <i>Je pars demain</i> [zhë par dë-MẼ]. Per un'azione cominciata nel passato che dura ancora si usa il presente con <i>depuis</i> [dë-PÜI]: <i>J'habite ici depuis 2020</i> «abito qui dal 2020». Mai «j'ai habité ... depuis».</p>
<p>Altre trappole dall'italiano: i pronomi soggetto sono obbligatori (<i>je mange</i>, mai «mange»); <i>on</i> + terza singolare per «noi» nel parlato; <i>vous êtes</i> / <i>vous avez</i> con liaison.</p>
<div class="say"><b>Cosa dire.</b> «Nous prenons le train [nu prë-nõ lë TRẼ]. Je veux un café, tu veux quoi ? Ils viennent demain.»</div>`,
  [
    q(
      'q1',
      'Qual è la forma di «finir» per «noi»?',
      ['nous finissons', 'nous finons', 'nous finirons', 'nous finissions'],
      0,
      'I verbi come finir inseriscono -iss- al plurale (finissons). «Nous finons» ricalca il gruppo -er; finirons è il futuro e finissions è un altro tempo.',
    ),
    q(
      'q2',
      'Quale coppia ha la stessa pronuncia?',
      ['il mange / ils mangent [MÃZH]', 'il finit / ils finissent', 'il vend / ils vendent', 'il prend / ils prennent'],
      0,
      'Nei verbi in -er la forma plurale -ent è muta, quindi le due forme coincidono. In finit/finissent, vend/vendent e prend/prennent il plurale si sente (-iss-, -d, -nn-).',
    ),
    q(
      'q3',
      'Come si dice «voi dite»?',
      ['vous dites', 'vous disez', 'vous disent', 'vous dîtes'],
      0,
      "Dire fa vous dites (come faire fa vous faites e être vous êtes). «Vous disez» segue il modello generale -ez ma qui è un'eccezione.",
    ),
    q(
      'q4',
      'Perché si scrive «nous mangeons»?',
      [
        'La e tiene la g dolce davanti a o',
        'La e segnala il plurale del verbo',
        'La e è la desinenza della persona',
        'La e serve a rendere nasale la o',
      ],
      0,
      'Senza la e, g davanti a o si leggerebbe dura (mangons). La e non si pronuncia: è solo un segno ortografico, non la desinenza del plurale.',
    ),
    q(
      'q5',
      'Come si scrive «io compro» da acheter?',
      ["j'achète", "j'achette", "j'acheté", "j'achete"],
      0,
      "Acheter prende l'accento grave davanti a una sillaba muta (achète, achètes). Appeler e jeter raddoppiano la consonante: non confondere i due modelli.",
    ),
    q(
      'q6',
      'Come si traduce «Sto leggendo»?',
      [
        'Je suis en train de lire.',
        'Je suis lisant maintenant.',
        'Je suis à lire maintenant.',
        'Je suis en lire maintenant.',
      ],
      0,
      "L'azione in corso si esprime con être en train de + infinito o con il semplice presente (je lis). «Je suis lisant» calca il gerundio e non esiste in questo uso.",
    ),
    q(
      'q7',
      'Quale frase usa correttamente «depuis»?',
      [
        "J'habite ici depuis 2020.",
        "J'ai habité ici depuis 2020.",
        "J'habiterai ici depuis 2020.",
        "J'habitais ici depuis 2020 (ancora oggi).",
      ],
      0,
      "Per un'azione ancora in corso depuis vuole il presente. Il passé composé con depuis è l'errore tipico di chi traduce «ho abitato qui dal 2020».",
    ),
    q(
      'q8',
      'Come si legge «ils finissent»?',
      ['il fi-NIS', 'il FI-ni', 'ilz fi-ni-SÃ', 'il fi-NIST'],
      0,
      'La -ent finale è muta, ma la s di -ss- è doppia e resta: si sente la s finale. Ils finissent si distingue così da il finit [fi-NI] solo per la s finale.',
    ),
  ],
  [
    card(
      'c1',
      '-er presente',
      'parle, parles, parle, parlons, parlez, parlent: quattro forme su sei suonano [PARL] (je, tu, il, ils).',
    ),
    card('c2', '-ir secondo gruppo', 'finis, finis, finit, finissons, finissez, finissent: -iss- al plurale.'),
    card('c3', '-re presente', 'vends, vends, vend, vendons, vendez, vendent: la d si sente solo al plurale.'),
    card('c4', 'prendre', 'prends, prends, prend, prenons, prenez, prennent [PRÈN].'),
    card('c5', 'venir', 'viens [VYẼ], viens, vient, venons [vë-NÕ], venez, viennent [VYÈN].'),
    card(
      'c6',
      'pouvoir / vouloir',
      'peux/peut [PÖ], pouvons; veux/veut [VÖ], voulons. Ils peuvent [PÖV], ils veulent [VÖL].',
    ),
    card('c7', 'devoir / savoir', 'dois/doit [DUA], devons; sais/sait [SÈ], savons.'),
    card(
      'c8',
      'vous dites / faites / êtes',
      'Le tre eccezioni a -ez: vous dites [DIT], vous faites [FÈT], vous êtes [ÈT].',
    ),
    card(
      'c9',
      'manger / commencer',
      'nous mangeons [mã-ZHÕ], nous commençons [kò-mã-SÕ]: e e ç tengono il suono dolce davanti a o.',
    ),
    card('c10', 'acheter / appeler', "j'achète (accento) [zha-SHÈT]; j'appelle (doppia l) [zha-PÈL]."),
    card('c11', 'depuis', "Presente + depuis: j'habite ici depuis 2020. Mai passé composé."),
    card('c12', 'être en train de', 'Azione in corso: je suis en train de manger [zhë süi ã trẽ dë mã-ZHÉ].'),
  ],
  [
    prac(
      'p1',
      'Coniuga al presente «prendre» e «finir» per tutte le persone.',
      'prendre: je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent. finir: je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent. Nota: la d di prend è muta, quella di prennent no (doppia n).',
    ),
    prac(
      'p2',
      'Traduci: «Abito a Torino da cinque anni e lavoro con mio fratello.»',
      "J'habite à Turin depuis cinq ans et je travaille avec mon frère. Nota: depuis + presente; il pronome je è obbligatorio.",
    ),
    prac(
      'p3',
      'Correggi: «Nous mangons une pizza et vous disez que je suis fatiguée.»',
      'Nous mangeons une pizza et vous dites que je suis fatigué(e). Nota: mangeons con la e; vous dites; il participio fatigué(e) è un aggettivo che si accorda con chi parla.',
    ),
    prac(
      'p4',
      'Scrivi 4 frasi con pouvoir, vouloir, devoir e savoir.',
      "Esempio: Je peux venir demain. Tu veux un thé ? Nous devons partir. Ils savent nager. Nota: dopo pouvoir, vouloir, devoir e savoir il verbo seguente resta all'infinito.",
    ),
    prac(
      'p5',
      'Leggi ad alta voce con la nostra trascrizione: «Ils parlent, elles finissent, vous dites».',
      'Ils parlent [il PARL], elles finissent [èl fi-NIS], vous dites [vu DIT]. Nota: parlent finisce muto, finissent no.',
    ),
  ],
)

export const fquotidiano = mod(
  'fr-quotidiano',
  'Vita quotidiana: pronominali, negazione, domande e luoghi',
  'Verbi pronominali, ne...pas/jamais/plus/rien, est-ce que e inversione, à/en/dans/chez, città',
  'a1',
  `${PRON_SHORT}
<p class="lead">Quattro strumenti per raccontare una giornata e muoversi in città: verbi pronominali, negazioni, domande e preposizioni di luogo.</p>
<h3>Verbi pronominali</h3>
<table><tr><th>Persona</th><th>se lever (alzarsi)</th><th>Pronuncia</th></tr>
<tr><td>je</td><td>me lève</td><td>[zhë më LÈV]</td></tr>
<tr><td>tu</td><td>te lèves</td><td>[tü të LÈV]</td></tr>
<tr><td>il / elle</td><td>se lève</td><td>[il së LÈV]</td></tr>
<tr><td>nous</td><td>nous levons</td><td>[nu nu lë-VÕ]</td></tr>
<tr><td>vous</td><td>vous levez</td><td>[vu vu lë-VÉ]</td></tr>
<tr><td>ils / elles</td><td>se lèvent</td><td>[il së LÈV]</td></tr></table>
<p>Il pronome (me, te, se, nous, vous) sta davanti al verbo: <i>je me réveille</i> [zhë më ré-VÈY], <i>je me lave</i>, <i>je m'habille</i> [zhë ma-BIY], <i>je me couche</i> [zhë më KUSH], <i>je me promène</i>, <i>je me dépêche</i>, <i>je m'appelle</i>. Con le parti del corpo l'articolo, non il possessivo: <i>je me lave les mains</i> [zhë më lav lé MẼ]. Negazione: <i>je ne me lève pas</i>; domanda: <i>Tu te lèves à quelle heure ?</i></p>
<h3>Negazione</h3>
<table><tr><th>Forma</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>ne ... pas</td><td>[në ... PA]</td><td>non</td></tr>
<tr><td>ne ... jamais</td><td>[në ... zha-MÈ]</td><td>mai</td></tr>
<tr><td>ne ... plus</td><td>[në ... PLÜ]</td><td>non più</td></tr>
<tr><td>ne ... rien</td><td>[në ... RYẼ]</td><td>niente</td></tr>
<tr><td>ne ... personne</td><td>[në ... pèr-SÒN]</td><td>nessuno</td></tr>
<tr><td>ne ... que</td><td>[në ... kë]</td><td>soltanto</td></tr></table>
<p>La negazione è in due pezzi: <b>ne</b> prima del verbo (<i>n'</i> davanti a vocale), il secondo pezzo dopo: <i>Je ne parle pas</i> [zhë në parl PA], <i>Il n'a rien dit</i>. Nel parlato <i>ne</i> cade: <i>je sais pas</i> [zhë sè PA]. Dopo la negazione il partitivo diventa <i>de</i>: <i>Je n'ai plus de pain</i>. <i>Personne</i> e <i>rien</i> possono essere soggetto: <i>Personne ne vient</i>, <i>Rien ne change</i>. <i>Ne ... que</i> ha senso positivo: <i>Je n'ai qu'un euro</i> «ho solo un euro». Con due verbi la negazione avvolge il primo: <i>Je ne veux pas partir</i>.</p>
<h3>Domande</h3>
<ul><li><b>Intonazione</b> (parlato): <i>Tu viens ?</i> [tü VYẼ]</li><li><b>Est-ce que</b>: <i>Est-ce que tu viens ?</i> [è-skë tü VYẼ]</li><li><b>Inversione</b> (scritto, formale): <i>Viens-tu ?</i> [vyẽ-TÜ]; con la terza persona in vocale si inserisce -t-: <i>Parle-t-il ?</i> [par-lë-TIL], <i>A-t-elle ?</i> [a-TÈL].</li></ul>
<p>Parole interrogative: <i>qui</i> [KI], <i>que / qu'est-ce que</i> [kès-kë], <i>où</i> [U], <i>quand</i> [KÃ], <i>comment</i> [kò-MÃ], <i>pourquoi</i> [pur-KUA], <i>combien</i> [kõ-BYẼ]. <i>Pourquoi ... ? Parce que ...</i> [par-skë]. Risposta a una domanda negativa: <i>Tu ne viens pas ? — Si, je viens.</i> Il <b>si</b> contraddice la negazione; <i>oui</i> sarebbe sbagliato.</p>
<h3>Luoghi e preposizioni</h3>
<table><tr><th>Prep.</th><th>Uso</th><th>Esempio</th></tr>
<tr><td>à [A]</td><td>città, luogo preciso, ora</td><td>à Paris, à la maison [a la mè-ZÕ], à huit heures</td></tr>
<tr><td>en [Ã]</td><td>paese f., mezzo, mese, stagione</td><td>en France, en train, en juin, en été (ma au printemps)</td></tr>
<tr><td>dans [DÃ]</td><td>dentro; fra (futuro)</td><td>dans la boîte; dans deux jours</td></tr>
<tr><td>chez [SHÉ]</td><td>a casa di, dal</td><td>chez moi, chez le médecin, chez Paul</td></tr>
<tr><td>sur / sous</td><td>sopra / sotto</td><td>sur la table [SÜR], sous le lit [SU]</td></tr></table>
<p>Altre: <i>devant</i> [dë-VÃ], <i>derrière</i> [dè-RYÈR], <i>à côté de</i> [a ko-TÉ dë], <i>près de</i> [PRÈ dë], <i>loin de</i> [LUẼ dë], <i>entre</i> [ÃTR], <i>en face de</i>. Trappole: «da Marco» = <i>chez Marco</i>; «tra due giorni» = <i>dans deux jours</i> (mentre <i>en deux jours</i> = «in due giorni», durata). In città: <i>la gare</i> [la GAR], <i>la poste</i> [la PÒST], <i>la mairie</i> [la mè-RI], <i>la boulangerie</i> [la bu-lã-zhë-RI], <i>la pharmacie</i> [la far-ma-SI], <i>le supermarché</i> [lë sü-pèr-mar-SHÉ], <i>le quartier</i> [lë kar-TYÉ], <i>le carrefour</i> [lë kar-FUR], <i>tout droit</i> [tu DRUA], <i>à gauche</i> [a GOSH], <i>à droite</i> [a DRUAT].</p>
<div class="say"><b>Cosa dire.</b> «Pardon, où est la gare, s'il vous plaît [par-DÕ, u è la GAR, sil vu PLÈ] ? — Tout droit, puis à gauche.»</div>`,
  [
    q(
      'q1',
      'Come si dice «Non ho più pane»?',
      ["Je n'ai plus de pain.", "Je n'ai pas plus du pain.", "Je n'ai plus du pain.", 'Je ne plus ai de pain.'],
      0,
      "La negazione avvolge il verbo e il partitivo diventa de. «Du pain» dopo plus è la trappola tipica: dopo qualunque negazione si usa de/d'.",
    ),
    q(
      'q2',
      'Qual è la risposta giusta a «Tu ne viens pas ?» se vuoi venire?',
      ['Si, je viens.', 'Oui, je viens.', 'Non, je viens.', 'Si, je ne viens.'],
      0,
      'Alla domanda negativa si risponde si per contraddire. «Oui» è la risposta a una domanda positiva; «non, je viens» è contraddittorio.',
    ),
    q(
      'q3',
      'Come si dice «Mi lavo le mani»?',
      ['Je me lave les mains.', 'Je me lave mes mains.', 'Je lave les mains.', 'Je lave me mains.'],
      0,
      "Con le parti del corpo il francese usa l'articolo, non il possessivo: il pronome riflessivo basta a indicare di chi sono. «Mes mains» è un errore comune.",
    ),
    q(
      'q4',
      'Che cosa significa «dans deux jours»?',
      ['tra due giorni', 'in due giorni (durata)', 'due giorni fa', 'per due giorni'],
      0,
      'Dans + durata indica il futuro («fra»). La durata impiegata è en deux jours; «due giorni fa» è il y a deux jours; «per due giorni» è pendant.',
    ),
    q(
      'q5',
      'Come si dice «Vado dal medico»?',
      ['Je vais chez le médecin.', 'Je vais au médecin.', 'Je vais dans le médecin.', 'Je vais de le médecin.'],
      0,
      "Per «da / a casa di» una persona o una professione si usa chez. «Au médecin» si sente nel parlato familiare (molto in Québec e Belgio) ma va evitato all'esame; «dans» indica un luogo chiuso, non una persona.",
    ),
    q(
      'q6',
      'Come si legge «chez moi»?',
      ['shé MUA', 'tché MUA', 'chèz MUA', 'sé MÒI'],
      0,
      'Ch = sh, ez finale = é chiusa, oi = ua. Chez si legge sempre con la z muta, mai come una s o con la ch dura italiana.',
    ),
    q(
      'q7',
      'Quale frase usa correttamente «savoir» / «connaître»?',
      [
        'Je sais nager et je connais Paul.',
        'Je connais nager et je sais Paul.',
        'Je sais nager et je sais Paul.',
        'Je connais nager et je connais Paul.',
      ],
      0,
      "Savoir regge un fatto o un infinito (saper fare), connaître una persona o un luogo. Invertirli è l'errore classico di chi ha in mente un solo verbo per «sapere».",
    ),
    q(
      'q8',
      'Come si fa una domanda formale con inversione di «Il parle» ?',
      ['Parle-t-il ?', 'Parle-il ?', 'Il parle-t ?', 'Est-il parle ?'],
      0,
      'Quando il verbo finisce per vocale e il pronome inizia per vocale si inserisce -t- per facilitare la pronuncia. Senza -t- le due vocali si incontrano ([par-lil]).',
    ),
  ],
  [
    card(
      'c1',
      'verbi pronominali',
      "me, te, se, nous, vous davanti al verbo: je me lève [zhë më LÈV], elle s'appelle.",
    ),
    card('c2', 'parte del corpo', 'Articolo, non possessivo: je me lave les mains [lé MẼ].'),
    card('c3', 'ne ... pas', "Ne davanti al verbo (n' + vocale), pas dopo; nel parlato ne cade: je sais pas."),
    card(
      'c4',
      'ne ... jamais / plus / rien',
      'jamais [zha-MÈ] mai; plus [PLÜ] non più; rien [RYẼ] niente; personne [pèr-SÒN] nessuno.',
    ),
    card('c5', 'ne ... que', "Soltanto: je n'ai qu'un euro."),
    card('c6', 'si', 'Risposta positiva a una domanda negativa: Tu ne viens pas ? — Si, je viens.'),
    card('c7', 'est-ce que', 'Est-ce que tu viens ? [è-skë tü VYẼ]: aggiungi est-ce que, ordine invariato.'),
    card('c8', 'inversione', 'Viens-tu ? [vyẽ-TÜ]; con vocale -t-: parle-t-il ? [par-lë-TIL].'),
    card(
      'c9',
      'à vs en',
      'à + città e ora (à Paris, à huit heures); en + paese f., mese, mezzo (en France, en juin, en train).',
    ),
    card('c10', 'dans vs en', 'dans deux jours = fra due giorni (futuro); en deux jours = in due giorni (durata).'),
    card('c11', 'chez', 'A casa di / dal: chez moi [shé MUA], chez le dentiste.'),
    card('c12', 'savoir vs connaître', 'savoir = fatto/saper fare; connaître = persone e luoghi.'),
  ],
  [
    prac(
      'p1',
      'Descrivi la tua mattina con 5 verbi pronominali.',
      "Esempio: Je me réveille à sept heures. Je me lève, je me lave, je m'habille et je me dépêche. Nota: il pronome è sempre davanti al verbo coniugato.",
    ),
    prac(
      'p2',
      'Traduci: «Non ho mai visto nessuno e non so niente.»',
      "Je n'ai jamais vu personne et je ne sais rien. Nota: è un passé composé (lo studi nel modulo 7): personne segue il participio, rien e jamais stanno prima.",
    ),
    prac(
      'p3',
      'Trasforma in tre modi: «Tu parles français».',
      "Tu parles français ? / Est-ce que tu parles français ? / Parles-tu français ? Nota: l'ultima forma è la più formale; le prime due sono parlate.",
    ),
    prac(
      'p4',
      'Correggi: «Je vais à le dentiste, mais il y a personne dans la salle.»',
      "Je vais chez le dentiste, mais il n'y a personne dans la salle. Nota: chez per le persone; personne vuole ne.",
    ),
    prac(
      'p5',
      'Chiedi e spiega la strada per andare dalla stazione alla farmacia.',
      "Pardon, où est la pharmacie ? — Prenez la première rue à gauche, puis tout droit. Elle est à côté de la poste, en face de la gare. Nota: imperativo di cortesia con vous (lo studi nel modulo sull'imperativo).",
    ),
  ],
)

export const fpassecompose = mod(
  'fr-passecompose',
  'Il passé composé',
  'Avoir e être, verbi di movimento, accordo del participio, participi irregolari, negazione',
  'a2',
  `${PRON_SHORT}
<p class="lead">Il passé composé è il tempo del racconto parlato: come l'italiano «ho mangiato» e, nel parlato, anche «mangiai». Si forma con un ausiliare al presente più un participio passato.</p>
<h3>Formazione e participi regolari</h3>
<table><tr><th>Infinito</th><th>Participio</th><th>Esempio</th></tr>
<tr><td>-er</td><td>-é</td><td>parlé [par-LÉ]: j'ai parlé [zhé par-LÉ]</td></tr>
<tr><td>-ir</td><td>-i</td><td>fini [fi-NI]: il a fini</td></tr>
<tr><td>-re</td><td>-u</td><td>vendu [vã-DÜ]: nous avons vendu</td></tr></table>
<p>Quasi tutti i verbi usano <b>avoir</b>: <i>j'ai mangé</i> [zhé mã-ZHÉ], <i>nous avons fini</i>. Negazione: <i>je n'ai pas mangé</i> [zhë né pa mã-ZHÉ]; <i>je n'ai rien vu</i>; <i>je n'ai vu personne</i> (personne dopo il participio). Domanda: <i>As-tu mangé ?</i> [a-TÜ mã-ZHÉ].</p>
<h3>Participi irregolari</h3>
<table><tr><th>Verbo</th><th>Participio</th><th>Verbo</th><th>Participio</th></tr>
<tr><td>avoir</td><td>eu [Ü]</td><td>faire</td><td>fait [FÈ]</td></tr>
<tr><td>être</td><td>été [é-TÉ]</td><td>dire</td><td>dit [DI]</td></tr>
<tr><td>prendre</td><td>pris [PRI]</td><td>écrire</td><td>écrit [é-KRI]</td></tr>
<tr><td>mettre</td><td>mis [MI]</td><td>lire</td><td>lu [LÜ]</td></tr>
<tr><td>voir</td><td>vu [VÜ]</td><td>boire</td><td>bu [BÜ]</td></tr>
<tr><td>pouvoir</td><td>pu [PÜ]</td><td>connaître</td><td>connu [kò-NÜ]</td></tr>
<tr><td>vouloir</td><td>voulu [vu-LÜ]</td><td>ouvrir</td><td>ouvert [u-VÈR]</td></tr>
<tr><td>devoir</td><td>dû [DÜ]</td><td>apprendre</td><td>appris [a-PRI]</td></tr>
<tr><td>savoir</td><td>su [SÜ]</td><td>comprendre</td><td>compris [kõ-PRI]</td></tr>
<tr><td>vivre</td><td>vécu [vé-KÜ]</td><td>recevoir</td><td>reçu [rë-SÜ]</td></tr></table>
<p>Il suono <b>ü</b> compare in tanti participi: <i>vu, lu, bu, pu, su, eu</i>. Non leggerli con u italiana. Trappola: <i>j'ai eu</i> [zhé Ü] «ho avuto», <i>j'ai été</i> [zhé é-TÉ] «sono stato».</p>
<h3>I verbi con être</h3>
<p>Alcuni verbi di movimento e di cambiamento, più tutti i pronominali, usano <b>être</b>: <i>aller, venir, arriver, partir, entrer, sortir, monter, descendre, rester, tomber, naître, mourir, rentrer, retourner, devenir, revenir</i>. Mnemonico «DR &amp; MRS VAN DER TRAMP».</p>
<table><tr><th>Verbo</th><th>Participio</th><th>Verbo</th><th>Participio</th></tr>
<tr><td>aller</td><td>allé [a-LÉ]</td><td>venir</td><td>venu [vë-NÜ]</td></tr>
<tr><td>arriver</td><td>arrivé [a-ri-VÉ]</td><td>partir</td><td>parti [par-TI]</td></tr>
<tr><td>entrer</td><td>entré [ã-TRÉ]</td><td>sortir</td><td>sorti [sòr-TI]</td></tr>
<tr><td>rester</td><td>resté [rès-TÉ]</td><td>tomber</td><td>tombé [tõ-BÉ]</td></tr>
<tr><td>naître</td><td>né [NÉ]</td><td>mourir</td><td>mort [MÒR]</td></tr></table>
<p>Con un complemento oggetto cambia l'ausiliare: <i>Elle est montée</i> (è salita) / <i>Elle a monté les valises</i> (ha portato su le valigie); <i>je suis sorti</i> / <i>j'ai sorti la voiture</i>; stesso per <i>descendre, rentrer, retourner, passer</i>. Ausiliare diverso dall'italiano: <i>j'ai été</i> (sono stato), <i>j'ai couru</i> (sono corso), <i>j'ai vécu</i> (sono vissuto), <i>ça a coûté</i> (è costato), <i>il a plu</i> (è piovuto).</p>
<h3>L'accordo del participio</h3>
<ul><li><b>Con être</b>: si accorda con il soggetto: <i>elle est allée</i> [è-lè-ta-LÉ], <i>ils sont partis</i> [il sõ par-TI], <i>elles sont arrivées</i> [èl sõ-ta-ri-VÉ]. Nota: <i>allé, allée, allés, allées</i> suonano tutti [a-LÉ]: l'accordo si vede solo scrivendo.</li><li><b>Con avoir</b>: mai con il soggetto, solo con il COD <b>messo prima</b> del verbo: <i>la lettre que j'ai écrite</i> [é-KRIT] (<i>que</i> = «che», pronome relativo oggetto: i relativi qui, que, où sono nel modulo sui pronomi), <i>Je les ai vus</i> [zhë lé-zé VÜ], <i>elle les a vues</i>. Ma <i>elle a mangé</i> (nessun accordo).</li><li><b>Pronominali</b>: <i>elle s'est levée</i> (il se è COD: accordo), <i>elle s'est lavé les mains</i> (COD dopo: nessun accordo), <i>elles se sont parlé</i> (se è COI: nessun accordo).</li></ul>
<p>Si sente l'accordo solo quando la consonante finale cambia: <i>écrit [é-KRI] / écrite [é-KRIT]</i>, <i>pris [PRI] / prise [PRIZ]</i>, <i>ouvert [u-VÈR] / ouverte [u-VÈRT]</i>.</p>
<h3>Uso</h3>
<p>Azioni concluse e fatti puntuali: <i>Hier, j'ai travaillé</i>. In francese il <i>passé simple</i> («mangiai») esiste solo nello scritto letterario: nel parlato si usa sempre il passé composé. Per «fa» si dice <i>il y a</i>: <i>Je suis arrivé il y a deux jours</i> [zhë süi-za-ri-vé i-lya dö ZHUR].</p>
<div class="say"><b>Cosa dire.</b> «Hier, je suis allé au cinéma avec Marie [zhë süi-za-lé o si-né-MA]. Nous avons vu un film et nous sommes rentrés tard.»</div>`,
  [
    q(
      'q1',
      'Quale ausiliare serve per «Sono andato»?',
      ['être: je suis allé', "avoir: j'ai allé", 'faire: je fais allé', 'aller: je vais allé'],
      0,
      "Aller si coniuga con être nei tempi composti. «J'ai allé» è l'errore di chi usa avoir per tutto, come per la maggior parte dei verbi.",
    ),
    q(
      'q2',
      'Qual è la forma giusta di «lei è arrivata»?',
      ['Elle est arrivée.', 'Elle est arrivé.', 'Elle a arrivé.', 'Elle est arrivés.'],
      0,
      "Con être il participio si accorda con il soggetto: femminile singolare = -e. Senza e (arrivé) manca l'accordo; a voce però le forme suonano uguali [a-ri-VÉ].",
    ),
    q(
      'q3',
      "Quale frase ha l'accordo corretto?",
      [
        "Les lettres que j'ai écrites.",
        "Les lettres que j'ai écrit.",
        "Les lettres que j'ai écrits.",
        "Les lettres que j'ai écrite.",
      ],
      0,
      'Con avoir il participio si accorda col COD che precede il verbo: les lettres (f. pl.) → écrites. «Écrit» sarebbe giusto solo se il COD fosse dopo.',
    ),
    q(
      'q4',
      'Come si dice «Ho visto Marie» se Marie è già nota (la)?',
      ["Je l'ai vue.", "Je l'ai vu.", "Je l'ai vues.", "Je l'ai vus."],
      0,
      "Il pronome l' (= Marie, femminile) precede il verbo: il participio si accorda: vue. Senza e (vu) sarebbe corretto solo per un maschile.",
    ),
    q(
      'q5',
      'Quale participio passato ha «prendre»?',
      ['pris [PRI]', 'prendu [prã-DÜ]', 'prenu [prë-NÜ]', 'pri [PRI]'],
      0,
      "Prendre è irregolare: pris (come comprendre → compris). La forma regolare in -u (prendu) è un'analogia sbagliata con vendre.",
    ),
    q(
      'q6',
      'Quale frase è corretta con «sortir»?',
      [
        "J'ai sorti la voiture du garage.",
        'Je suis sorti la voiture du garage.',
        "J'ai sortie la voiture du garage.",
        'Je suis sortie la voiture du garage.',
      ],
      0,
      'Con un COD (la voiture) sortir prende avoir: ha tirato fuori. Senza COD (je suis sorti = sono uscito) si usa être.',
    ),
    q(
      'q7',
      'Come si legge «nous avons vu» ?',
      ['nu-za-võ VÜ', 'nu-za-vo VU', 'nu a-võn VÜ', 'nu-za-vö VUI'],
      0,
      'Il participio vu ha ü, non u. La liaison nous avons fa suonare la z; avons è nasale (õ), senza n pronunciata.',
    ),
    q(
      'q8',
      'Cosa significa «Elles se sont parlé» e perché senza -es?',
      [
        "Si sono parlate; se è COI, non c'è accordo",
        'Si sono parlate; se è COD, accordo obbligatorio',
        'Hanno parlato con sé stesse; accordo sempre',
        'Si sono parlate; il participio resta fisso',
      ],
      0,
      "Parler à qqn regge il complemento di termine (a lei): se è COI il participio non si accorda. Se fosse un COD (si sono lavate) l'accordo sarebbe obbligatorio.",
    ),
  ],
  [
    card('c1', 'participi regolari', '-er → -é (parlé), -ir → -i (fini), -re → -u (vendu).'),
    card('c2', 'avoir, être, faire', 'eu [Ü], été [é-TÉ], fait [FÈ].'),
    card('c3', 'prendre, mettre', 'pris [PRI], mis [MI]; apprendre/comprendre: appris, compris.'),
    card('c4', 'voir, lire, boire, pouvoir', 'vu [VÜ], lu [LÜ], bu [BÜ], pu [PÜ]: tutti con ü.'),
    card('c5', 'dire, écrire, ouvrir', 'dit [DI], écrit [é-KRI], ouvert [u-VÈR].'),
    card(
      'c6',
      'verbi con être',
      'aller, venir, arriver, partir, entrer, sortir, monter, descendre, rester, tomber, naître, mourir, rentrer, retourner, devenir, revenir + pronominali.',
    ),
    card('c7', 'accordo con être', 'Col soggetto: elle est allée, ils sont partis, elles sont arrivées.'),
    card('c8', 'accordo con avoir', "Solo con il COD che precede: la lettre que j'ai écrite; je les ai vus."),
    card('c9', 'accordo muto', 'allé/allée/allés/allées suonano uguali [a-LÉ]; écrit/écrite no [é-KRI]/[é-KRIT].'),
    card(
      'c10',
      'monter / sortir con avoir',
      "Con un COD si usa avoir: j'ai monté les valises; senza COD être: je suis monté.",
    ),
    card('c11', 'negazione composta', "Ne + ausiliare + pas + participio: je n'ai pas vu; je n'ai vu personne."),
    card('c12', 'Fa = il y a', 'Je suis arrivé il y a deux jours [i-lya dö ZHUR].'),
  ],
  [
    prac(
      'p1',
      'Metti al passé composé: «Elle part à huit heures et prend le train».',
      'Elle est partie à huit heures et elle a pris le train. Nota: partir con être (accordo -e), prendre con avoir (pris).',
    ),
    prac(
      'p2',
      'Traduci: «Ieri sono stata a casa, non ho visto nessuno e ho letto un libro.»',
      "Hier, je suis restée à la maison, je n'ai vu personne et j'ai lu un livre. Nota: rester con être; personne dopo il participio; lu [LÜ].",
    ),
    prac(
      'p3',
      'Correggi: «Nous avons allé au cinéma et elles ont arrivé tard».',
      'Nous sommes allés au cinéma et elles sont arrivées tard. Nota: aller e arriver prendono être e il participio si accorda.',
    ),
    prac(
      'p4',
      "Scrivi con l'accordo giusto: «Les photos que j'ai (prendre) ... sont belles; elle s'est (laver) ... les mains».",
      "Les photos que j'ai prises sont belles; elle s'est lavé les mains. Nota: COD prima = accordo (prises); les mains viene dopo = nessun accordo.",
    ),
    prac(
      'p5',
      'Racconta in 4 frasi cosa hai fatto ieri sera.',
      "Esempio: Hier soir, j'ai fait la cuisine, j'ai mangé avec ma sœur et nous avons regardé un film. Nous sommes allés au lit tard. Nota: verbi di moto con être, gli altri con avoir.",
    ),
  ],
)

export const fimparfait = mod(
  'fr-imparfait',
  "L'imparfait e il trapassato prossimo",
  'Formazione, uso, contrasto passé composé / imparfait, marcatori, plus-que-parfait',
  'a2',
  `${PRON_SHORT}
<p class="lead">L'imparfait descrive come erano le cose, le abitudini del passato e lo sfondo di una storia. Il passé composé racconta cosa è successo. La logica è la stessa dell'italiano, cambiano le forme.</p>
<h3>Formazione</h3>
<p>Si parte dalla forma <b>nous</b> del presente, si toglie <i>-ons</i> e si aggiungono le desinenze: <i>nous parlons → parl-</i>, <i>nous finissons → finiss-</i>, <i>nous prenons → pren-</i>, <i>nous faisons → fais-</i>. Unica eccezione: <i>être</i> (radice <i>ét-</i>).</p>
<table><tr><th>Persona</th><th>parler</th><th>être</th><th>avoir</th></tr>
<tr><td>je</td><td>parlais [par-LÈ]</td><td>étais [é-TÈ]</td><td>avais [a-VÈ]</td></tr>
<tr><td>tu</td><td>parlais [par-LÈ]</td><td>étais [é-TÈ]</td><td>avais [a-VÈ]</td></tr>
<tr><td>il / elle</td><td>parlait [par-LÈ]</td><td>était [é-TÈ]</td><td>avait [a-VÈ]</td></tr>
<tr><td>nous</td><td>parlions [par-LYÕ]</td><td>étions [é-TYÕ]</td><td>avions [a-VYÕ]</td></tr>
<tr><td>vous</td><td>parliez [par-LYÉ]</td><td>étiez [é-TYÉ]</td><td>aviez [a-VYÉ]</td></tr>
<tr><td>ils / elles</td><td>parlaient [par-LÈ]</td><td>étaient [é-TÈ]</td><td>avaient [a-VÈ]</td></tr></table>
<p>Pronuncia: <b>-ais, -ait, -aient suonano tutti [È]</b>; la differenza tra <i>je parlais</i> e <i>je parlerai</i> (futuro) è [È] contro [É] (molti parigini però fondono le due vocali: il contesto e il tempo del verbo bastano a capire). Con la liaison: <i>il y avait</i> [i-lya-VÈ] «c'era / c'erano»; <i>j'étais</i> [zhé-TÈ]; <i>nous étions</i> [nu-zé-TYÕ]. Ortografia: <i>nous mangions</i> [nu mã-ZHYÕ] ma <i>je mangeais</i> [zhë mã-ZHÈ] (la e tiene la g dolce davanti ad a); <i>je commençais</i> [zhë kò-mã-SÈ]; <i>nous étudiions</i> (due i, come <i>vous étudiiez</i>).</p>
<h3>Quando si usa</h3>
<ul><li><b>Descrizione e stato</b>: <i>Il faisait beau</i> [il fë-ZÈ BO]; <i>Elle était fatiguée</i>; <i>J'avais peur</i>.</li><li><b>Abitudini</b>: <i>Tous les étés, nous allions à la mer.</i></li><li><b>Azione in corso nel passato</b>: <i>Je lisais quand tu as appelé.</i> / <i>J'étais en train de manger.</i></li><li><b>Ora, età, tempo</b>: <i>Il était huit heures.</i> <i>J'avais dix ans.</i></li><li><b>Dopo si ipotetico</b>: <i>Si j'avais le temps...</i> (lo studi più avanti, nel modulo sul futuro e il condizionale).</li><li><b>Dopo venir de al passato</b>: <i>Je venais d'arriver.</i></li></ul>
<h3>Imparfait o passé composé</h3>
<table><tr><th></th><th>Imparfait</th><th>Passé composé</th></tr>
<tr><td>Funzione</td><td>sfondo, abitudine, durata aperta</td><td>fatto concluso, azione puntuale</td></tr>
<tr><td>Segnali</td><td>d'habitude, souvent, toujours, chaque été, autrefois, pendant que</td><td>soudain, un jour, hier, une fois, tout à coup, ce jour-là</td></tr></table>
<p>Esempio dei due piani: <i>Il pleuvait quand je suis sorti.</i> [il plö-VÈ kã zhë süi sòr-TI]; <i>Quand j'étais petit, j'habitais à Lyon.</i> Si possono combinare: <i>Je dormais quand le téléphone a sonné.</i> Alcuni verbi cambiano senso: <i>je savais</i> (sapevo) / <i>j'ai su</i> (ho scoperto); <i>je voulais</i> (volevo) / <i>j'ai voulu</i> (ho voluto, ho deciso; con la negazione <i>je n'ai pas voulu</i> = mi sono rifiutato).</p>
<p>Trappola dall'italiano: «stavo mangiando» = <i>j'étais en train de manger</i>, mai «j'étais mangeant». Il passé simple («mangiai») non si usa parlando: diventa passé composé o, se descrittivo, imparfait.</p>
<h3>Plus-que-parfait</h3>
<p>Ausiliare all'imparfait + participio: <i>j'avais mangé</i> [zha-vè mã-ZHÉ], <i>il était parti</i> [i-lé-tè par-TI], <i>nous avions fini</i>. Indica un fatto <b>prima</b> di un altro passato: <i>Quand je suis arrivé, le train était déjà parti.</i> [lë trẽ é-tè-dé-zha par-TI]. Valgono le stesse regole di ausiliare e accordo: <i>elle était allée</i>, <i>je les avais vus</i>.</p>
<div class="say"><b>Cosa dire.</b> «Quand j'étais enfant, nous passions l'été à la mer [nu pa-syõ lé-té a la MÈR]. Un jour, j'ai perdu mon chapeau.»</div>`,
  [
    q(
      'q1',
      "Come si forma l'imparfait di «finir» (nous)?",
      ['nous finissions', 'nous finions', 'nous finirions', 'nous finissons'],
      0,
      'Si parte da nous finissons e si toglie -ons: finiss- + -ions. «Finions» ignora il -iss-; finirions è il condizionale.',
    ),
    q(
      'q2',
      'Quale frase significa «pioveva quando sono uscito»?',
      [
        'Il pleuvait quand je suis sorti.',
        'Il a plu quand je sortais.',
        'Il pleuvait quand je sortirai.',
        'Il pleuvra quand je suis sorti.',
      ],
      0,
      "Lo sfondo (pioveva) va all'imparfait, l'evento puntuale (sono uscito) al passé composé. Invertirli è grammaticale ma cambia il senso: «il a plu quand je sortais» significa «ha piovuto mentre uscivo».",
    ),
    q(
      'q3',
      'Come si traduce «Stavo mangiando»?',
      [
        "J'étais en train de manger.",
        "J'étais mangeant à ce moment.",
        "J'étais à manger en ce moment.",
        "J'étais en manger à ce moment.",
      ],
      0,
      "L'azione in corso nel passato si dice con être en train de all'imparfait o con il semplice imparfait. Il gerundio progressivo italiano non ha equivalente diretto.",
    ),
    q(
      'q4',
      "Che differenza di pronuncia c'è tra «je parlais» e «je parlerai»?",
      [
        'parlais [par-LÈ] aperta; parlerai [par-lë-RÉ] chiusa',
        'parlais [par-LÈ] e parlerai [par-lë-RÈ]: uguali',
        'parlais [par-LÉ] chiusa; parlerai [par-lë-RÈ] aperta',
        'parlais [par-LÈS] con s; parlerai [par-lë-RÈ] senza s',
      ],
      0,
      "L'imparfait finisce in è aperta, il futuro in é chiusa. È la differenza udibile tra passato e futuro, anche se a Parigi molti parlanti la fondono: in scrittura va sempre distinta.",
    ),
    q(
      'q5',
      'Quale frase usa correttamente il plus-que-parfait?',
      [
        'Il était déjà parti quand je suis arrivé.',
        "Il est déjà parti quand j'arrivais.",
        'Il avait déjà parti quand je suis arrivé.',
        'Il était déjà partir quand je suis arrivé.',
      ],
      0,
      "Il trapassato combina imparfait di être e participio di partir: il verbo di moto vuole être. «Avait parti» sbaglia l'ausiliare; «partir» non è un participio.",
    ),
    q(
      'q6',
      'Quale marcatore segnala di solito il passé composé?',
      ['soudain', 'autrefois', 'chaque été', "d'habitude"],
      0,
      "Soudain indica un evento puntuale improvviso. Autrefois, chaque été e d'habitude descrivono abitudini o sfondi e chiedono l'imparfait.",
    ),
    q(
      'q7',
      'Come si legge «nous étions» ?',
      ['nu-zé-TYÕ', 'nu é-TÉ-õ', 'nuz-é-TÕN', 'nu-zé-TIÕN'],
      0,
      'La liaison fa suonare la z di nous davanti alla vocale; -ions è [YÕ] con y veloce e nasale. Il suono finale non è una sillaba separata -i-o-n.',
    ),
    q(
      'q8',
      "Che cosa cambia tra «je savais» e «j'ai su»?",
      [
        'savais = sapevo; ai su = ho scoperto',
        'savais = ho scoperto; ai su = sapevo',
        'Nulla: sono sinonimi in ogni caso',
        'savais = so ora; ai su = saprò poi',
      ],
      0,
      "Con alcuni verbi di stato il passé composé indica il momento in cui lo stato comincia. L'imparfait descrive lo stato in sé.",
    ),
  ],
  [
    card('c1', 'imparfait: radice', 'nous del presente senza -ons: parlons → parl-, finissons → finiss-.'),
    card(
      'c2',
      'imparfait: desinenze',
      '-ais, -ais, -ait, -ions, -iez, -aient. Quattro forme suonano [È]: -ais, -ais, -ait, -aient.',
    ),
    card(
      'c3',
      "être all'imparfait",
      "j'étais [zhé-TÈ], tu étais, il était, nous étions [nu-zé-TYÕ], vous étiez, ils étaient.",
    ),
    card('c4', 'il y avait', "C'era / c'erano: i-lya-VÈ."),
    card(
      'c5',
      'mangeais / mangions',
      'je mangeais [mã-ZHÈ] (e davanti ad a), nous mangions [mã-ZHYÕ] (niente e davanti a i).',
    ),
    card('c6', 'imparfait: usi', 'Descrizione, abitudine, azione in corso, ora, età, tempo atmosferico.'),
    card('c7', 'passé composé: usi', 'Fatto concluso e puntuale: soudain, un jour, hier, ce jour-là.'),
    card(
      'c8',
      'marcatori imparfait',
      "d'habitude, souvent, toujours, autrefois, chaque été, tous les jours, pendant que.",
    ),
    card(
      'c9',
      'sapevo / ho scoperto',
      "je savais (stato) / j'ai su (ho scoperto); je connaissais / j'ai connu (ho conosciuto).",
    ),
    card('c10', 'plus-que-parfait', "Ausiliare all'imparfait + participio: j'avais mangé, il était parti."),
    card('c11', 'stavo ...-ndo', "être en train de all'imparfait: j'étais en train de lire."),
    card('c12', '-ais e -ai', 'Imparfait -ais/-ait [È] aperta; futuro -ai [É] chiusa: je parlais / je parlerai.'),
  ],
  [
    prac(
      'p1',
      "Coniuga all'imparfait: «faire», «finir», «voir» per nous e ils.",
      'faire: nous faisions [fë-ZYÕ], ils faisaient [fë-ZÈ]; finir: nous finissions, ils finissaient; voir: nous voyions [vua-YÕ], ils voyaient [vua-YÈ]. Nota: la radice è nous faisons, finissons, voyons.',
    ),
    prac(
      'p2',
      'Traduci: «Quando ero piccolo giocavo sempre a calcio, ma un giorno mi sono rotto una gamba.»',
      "Quand j'étais petit, je jouais toujours au foot, mais un jour, je me suis cassé la jambe. Nota: abitudine all'imparfait, evento al passé composé.",
    ),
    prac(
      'p3',
      "Correggi: «Hier, il faisait chaud et je suis resté à la maison; quand j'étais enfant, nous avons passé tous les étés à la mer».",
      "Hier, il faisait chaud et je suis resté à la maison; quand j'étais enfant, nous passions tous les étés à la mer. Nota: l'abitudine ripetuta nel passato vuole l'imparfait (passions); il passé composé avrebbe senso solo per un'estate precisa. Anche «j'ai habité à Lyon» è corretto per un periodo concluso.",
    ),
    prac(
      'p4',
      'Racconta con imparfait e passé composé: «piove, sono in treno, arriva un controllore».',
      "Il pleuvait, j'étais dans le train quand le contrôleur est arrivé. Nota: pleuvait (sfondo), étais (sfondo), est arrivé (evento).",
    ),
    prac(
      'p5',
      'Scrivi una frase con plus-que-parfait: «Quando sono arrivata, il film era già cominciato».',
      'Quand je suis arrivée, le film avait déjà commencé [lë film a-vè dé-zha kò-mã-SÉ]. Nota: il film (cominciare con avoir) → avait commencé.',
    ),
  ],
)

export const franceseA2 = [fpresente, fquotidiano, fpassecompose, fimparfait]
