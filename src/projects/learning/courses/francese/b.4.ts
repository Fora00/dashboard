import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT, vsec } from './b.pron'

export const fraVocVita: CourseModule = mod(
  'fr-voc-vita',
  'Vocabolario: casa, famiglia e vestiti',
  'Casa, famiglia, vestiti (circa 60 termini con articolo e pronuncia)',
  'voc',
  `<p class="lead">Parole per la vita di tutti i giorni, con <b>articolo</b> (le / la / l' / les) e <b>pronuncia</b>. Impara sempre il sostantivo con il suo articolo: il genere in francese non si indovina dall'italiano. Corpo, cibo, tempo e shopping sono nel modulo successivo (<i>fr-voc-vita2</i>).</p>
${PRON_SHORT}
${vsec('Casa', [
  ['la maison', 'la mè-ZÕ', 'la casa'],
  ["l'appartement (m.)", 'la-par-të-MÃ', "l'appartamento"],
  ['la chambre', 'la SHÃBR', 'la camera da letto'],
  ['la cuisine', 'la küi-ZIN', 'la cucina'],
  ['la salle de bains', 'la sal dë BẼ', 'il bagno'],
  ['le salon', 'lë sa-LÕ', 'il soggiorno'],
  ['la porte', 'la PÒRT', 'la porta'],
  ['la fenêtre', 'la fë-NÈTR', 'la finestra'],
  ["l'escalier (m.)", 'lès-ka-LYÉ', 'la scala'],
  ['la clé', 'la KLÉ', 'la chiave'],
  ['le lit', 'lë LI', 'il letto'],
  ['la table', 'la TABL', 'il tavolo'],
  ['la chaise', 'la SHÈZ', 'la sedia'],
  ['le canapé', 'lë ka-na-PÉ', 'il divano'],
  ['le loyer', 'lë lua-YÉ', "l'affitto"],
  ['le voisin / la voisine', 'lë vua-ZẼ / la vua-ZIN', 'il vicino / la vicina'],
  ['le jardin', 'lë zhar-DẼ', 'il giardino'],
  ['le balcon', 'lë bal-KÕ', 'il balcone'],
  ["l'étage (m.)", 'lé-TAZH', "il piano (dell'edificio)"],
  ['le mur', 'lë MÜR', 'il muro'],
  ['la douche', 'la DUSH', 'la doccia'],
  ["l'armoire (f.)", 'lar-MUAR', "l'armadio"],
  ['la lampe', 'la LÃP', 'la lampada'],
  ['le frigo', 'lë fri-GO', 'il frigo'],
  ['le toit', 'lë TUA', 'il tetto'],
])}
${vsec('Famiglia', [
  ['le père / la mère', 'lë PÈR / la MÈR', 'il padre / la madre'],
  ['le frère / la sœur', 'lë FRÈR / la SÖR', 'il fratello / la sorella'],
  ['le fils / la fille', 'lë FIS / la FIY', 'il figlio / la figlia'],
  ['le grand-père', 'lë grã-PÈR', 'il nonno'],
  ['la grand-mère', 'la grã-MÈR', 'la nonna'],
  ['les grands-parents', 'lé grã-pa-RÃ', 'i nonni'],
  ["l'oncle (m.) / la tante", 'LÕKL / la TÃT', 'lo zio / la zia'],
  ['le cousin / la cousine', 'lë ku-ZẼ / la ku-ZIN', 'il cugino / la cugina'],
  ['le neveu / la nièce', 'lë në-VÖ / la NYÈS', 'il nipote / la nipote (di zii)'],
  ['le mari / la femme', 'lë ma-RI / la FAM', 'il marito / la moglie'],
  ['le beau-père', 'lë bo-PÈR', 'il suocero (o il patrigno)'],
  ["l'enfant (m./f.)", 'lã-FÃ', 'il bambino / la bambina'],
  ['le bébé', 'lë bé-BÉ', 'il neonato'],
  ['les parents', 'lé pa-RÃ', 'i genitori'],
  ['le copain / la copine', 'lë ko-PẼ / la ko-PIN', "l'amico / l'amica; il fidanzato / la fidanzata"],
])}
${vsec('Vestiti', [
  ['la chemise', 'la shë-MIZ', 'la camicia'],
  ['le pantalon', 'lë pã-ta-LÕ', 'i pantaloni'],
  ['la robe', 'la RÒB', "l'abito da donna"],
  ['la jupe', 'la ZHÜP', 'la gonna'],
  ['le pull', 'lë PÜL', 'il maglione'],
  ['la veste', 'la VÈST', 'la giacca'],
  ['le manteau', 'lë mã-TO', 'il cappotto'],
  ['les chaussures (f. pl.)', 'lé sho-SÜR', 'le scarpe'],
  ['les chaussettes (f. pl.)', 'lé sho-SÈT', 'le calze'],
  ['la taille', 'la TAY', 'la taglia'],
  ['le chapeau', 'lë sha-PO', 'il cappello'],
  ['les lunettes (f. pl.)', 'lé lü-NÈT', 'gli occhiali'],
  ['la ceinture', 'la sẽ-TÜR', 'la cintura'],
  ["l'écharpe (f.)", 'lé-SHARP', 'la sciarpa'],
  ['le maillot de bain', 'lë ma-YO dë BẼ', 'il costume da bagno'],
  ['la poche', 'la PÒSH', 'la tasca'],
])}
<h3>Esempi sui punti difficili</h3>
<ul>
<li>«Mon frère habite à l'étage au-dessus.» (Mio fratello abita al piano di sopra.) Il piano terra è <i>le rez-de-chaussée</i>; <i>le premier étage</i> è il primo piano, come in Italia.</li>
<li>«Ma grand-mère a une belle maison avec un jardin.» «Je cherche une chemise taille M.»</li>
<li>«Je loue un appartement: le loyer est cher.» (Affitto un appartamento: l'affitto è caro.)</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>le fils</b> si pronuncia [FIS] con la s; <b>la femme</b> [FAM], con a e non con e; <b>l'oncle</b> [LÕKL].</li>
<li><b>La femme</b> = donna e moglie; <b>le mari</b> = marito. <b>Le salon</b> = soggiorno, non «salone».</li>
<li><b>La robe</b> è un abito da donna, <b>la veste</b> una giacca: la «roba» italiana sono <i>les affaires</i>.</li>
<li><b>Les parents</b> sono i genitori; i parenti in senso largo sono <i>la famille</i>. <b>Les lunettes</b> è sempre plurale.</li>
<li><b>La dent, la fleur</b> sono femminili in francese, ma maschili in italiano (il dente, il fiore).</li>
</ul>
<div class="say"><b>Da ricordare.</b> «La salle de bains est à droite, la cuisine à gauche.» «Je cherche une chemise taille M.» «Mes grands-parents habitent au deuxième étage.»</div>`,
  [
    q(
      'q1',
      'Come si dice «la finestra»?',
      ['la fenêtre', 'le fenêtre', 'la fenestre', 'les fenêtre'],
      0,
      "Fenêtre è femminile e ha l'accento circonflesso. Il circonflesso richiama una s storica, ma oggi non si scrive.",
    ),
    q(
      'q3',
      'Come si pronuncia «le fils» (il figlio)?',
      ['[lë FIS]', '[lë FI]', '[lë FIL]', '[lë FIZ]'],
      0,
      "Fils è un'eccezione alla regola delle consonanti finali mute: la s si pronuncia. Il plurale fils si scrive uguale e suona uguale.",
    ),
    q(
      'q6',
      'Il genere di «la mer» e «la dent» è:',
      [
        'Femminile in francese, maschile in italiano',
        'Maschile in entrambe le lingue, come in italiano',
        'Neutro in francese e femminile in italiano',
        'Dipende dal contesto e dalla frase',
      ],
      0,
      "Mer e dent sono femminili in francese mentre «il mare» e «il dente» sono maschili in italiano: i generi vanno imparati con l'articolo.",
    ),
    q(
      'q7',
      'Che cosa significa «le salon»?',
      ['il soggiorno', 'il salone grande', 'il salone di bellezza', 'la sala da pranzo'],
      0,
      'Le salon è il soggiorno di casa. Il salone di bellezza è le salon de coiffure; la sala da pranzo è la salle à manger.',
    ),
    q(
      'q8',
      'Come si dice «le scarpe»?',
      ['les chaussures', 'les chaussettes', 'les chapeaux', 'les chemises'],
      0,
      'Chaussures = scarpe; chaussettes = calze, ed è la confusione più comune. Chapeau è il cappello, chemise la camicia.',
    ),
    q(
      'q10',
      'Che cosa significa «le loyer»?',
      ["l'affitto", 'il lusso', 'la lealtà', 'il regalo'],
      0,
      "Le loyer è l'affitto mensile. Non ha niente a che vedere con la lealtà (loyal) né con il lusso, che si dice le luxe.",
    ),
    q(
      'q11',
      'Che cosa significa «les parents» in una frase come «Mes parents habitent à Lyon»?',
      ['i miei genitori', 'i miei parenti', 'i miei nonni', 'i miei vicini'],
      0,
      'Les parents sono i genitori. I parenti in generale si dicono la famille o les proches, e i nonni les grands-parents.',
    ),
    q(
      'q12',
      'Come si dice «Ho perso gli occhiali»?',
      ["J'ai perdu mes lunettes.", "J'ai perdu ma lunette.", "J'ai perdu mes lunets.", "J'ai perdu mon lunettes."],
      0,
      'Come in italiano gli occhiali, les lunettes si usa quasi sempre al plurale, con mes davanti. Gli altri accordi sono sbagliati nel numero o nel genere.',
    ),
  ],
  [
    card('c1', "la maison / l'appartement", "La casa / l'appartamento [la mè-ZÕ / la-par-të-MÃ]"),
    card('c2', 'la salle de bains', 'Il bagno [la sal dë BẼ]'),
    card('c3', 'le fils', 'Il figlio: la s si pronuncia [FIS]'),
    card('c4', 'la femme / le mari', 'La moglie (e donna) / il marito'),
    card('c10', 'les chaussures / les chaussettes', 'Le scarpe / le calze.'),
    card('c11', 'la robe / la veste', "L'abito da donna / la giacca."),
    card('c12', 'les parents', 'I genitori (i parenti = la famille).'),
    card('c13', 'Come si dice «il divano»?', 'Le canapé [lë ka-na-PÉ]'),
    card('c14', "Come si dice «l'affitto»?", 'Le loyer [lë lua-YÉ]'),
    card('c15', 'Come si dice «il cappotto»?', 'Le manteau [lë mã-TO]'),
    card('c16', 'Come si dice «la nonna»?', 'La grand-mère [la grã-MÈR]'),
    card('c17', 'Come si dice «la gonna»?', 'La jupe [la ZHÜP]'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Vorrei una camera con bagno.»',
      'Je voudrais une chambre avec salle de bains. Nota: chambre = camera da letto; condizionale di cortesia.',
    ),
    prac(
      'p2',
      'Traduci: «Mio fratello abita con la moglie vicino alla stazione.»',
      'Mon frère habite avec sa femme près de la gare. Nota: femme = moglie (con sa).',
    ),
    prac(
      'p6',
      'Traduci: «I miei nonni abitano al terzo piano e hanno un balcone.»',
      'Mes grands-parents habitent au troisième étage et ils ont un balcon. Nota: étage è maschile; troisième étage = piano numero tre.',
    ),
    prac(
      'p7',
      'Traduci: «Ho comprato una giacca, una gonna e due paia di calze.»',
      "J'ai acheté une veste, une jupe et deux paires de chaussettes. Nota: veste = giacca; paire de chaussettes = paio di calze.",
    ),
  ],
)

export const fraVocVita2: CourseModule = mod(
  'fr-voc-vita2',
  'Vocabolario: corpo, cibo, tempo e shopping',
  'Corpo e salute, cibo e ristorante, tempo atmosferico, shopping (circa 70 termini)',
  'voc',
  `<p class="lead">Seconda parte del lessico quotidiano: ciò che serve dal medico, al ristorante, parlando del tempo e facendo acquisti. Sempre articolo e pronuncia. Casa, famiglia e vestiti sono in <i>fr-voc-vita</i>.</p>
${PRON_SHORT}
${vsec('Corpo e salute', [
  ['la tête', 'la TÈT', 'la testa'],
  ["l'œil / les yeux", 'LÖY / lé-ZYÖ', "l'occhio / gli occhi"],
  ['le nez', 'lë NÉ', 'il naso'],
  ['la bouche', 'la BUSH', 'la bocca'],
  ['la dent', 'la DÃ', 'il dente'],
  ['la main', 'la MẼ', 'la mano'],
  ['la jambe', 'la ZHÃB', 'la gamba'],
  ['le ventre', 'lë VÃTR', 'la pancia'],
  ['le cœur', 'lë KÖR', 'il cuore'],
  ['le bras', 'lë BRA', 'il braccio'],
  ['le pied', 'lë PYÉ', 'il piede'],
  ['le dos', 'lë DO', 'la schiena'],
  ['la gorge', 'la GÒRZH', 'la gola'],
  ['les cheveux (m. pl.)', 'lé shë-VÖ', 'i capelli'],
  ["l'oreille (f.)", 'lò-RÈY', "l'orecchio"],
  ['la fièvre', 'la FYÈVR', 'la febbre'],
  ['la toux', 'la TU', 'la tosse'],
  ['le rhume', 'lë RÜM', 'il raffreddore'],
  ['le médecin', 'lë méd-SẼ', 'il medico'],
  ['la pharmacie', 'la far-ma-SI', 'la farmacia'],
  ["l'ordonnance (f.)", 'lòr-do-NÃS', 'la ricetta medica'],
  ['avoir mal à...', 'a-vuar mal A', 'avere male a...'],
])}
${vsec('Cibo e ristorante', [
  ['le pain', 'lë PẼ', 'il pane'],
  ['le fromage', 'lë frò-MAZH', 'il formaggio'],
  ['la viande', 'la VYÃD', 'la carne'],
  ['le poisson', 'lë pua-SÕ', 'il pesce'],
  ['les pâtes (f. pl.)', 'lé PAT', 'la pasta'],
  ['le riz', 'lë RI', 'il riso'],
  ['le légume', 'lë lé-GÜM', 'la verdura'],
  ['la pomme', 'la PÒM', 'la mela'],
  ["l'eau (f.)", 'LO', "l'acqua"],
  ['le vin', 'lë VẼ', 'il vino'],
  ['le lait', 'lë LÈ', 'il latte'],
  ["l'œuf (m.)", 'LÖF', "l'uovo"],
  ['le café / le thé', 'lë ka-FÉ / lë TÉ', 'il caffè / il tè'],
  ['la soupe', 'la SUP', 'la minestra, la zuppa'],
  ['la salade', 'la sa-LAD', "l'insalata"],
  ["l'entrée (f.)", 'lã-TRÉ', 'antipasto (non primo piatto!)'],
  ['le plat', 'lë PLA', 'il piatto (portata)'],
  ['le dessert', 'lë dé-SÈR', 'il dolce, il dessert'],
  ['la carte', 'la KART', 'il menu (la lista)'],
  ["l'addition (f.)", 'la-di-SYÕ', 'il conto'],
  ['le serveur / la serveuse', 'lë sèr-VÖR / la sèr-VÖZ', 'il cameriere / la cameriera'],
  ['le pourboire', 'lë pur-BUAR', 'la mancia'],
])}
${vsec('Tempo atmosferico', [
  ['le temps', 'lë TÃ', 'il tempo'],
  ['il fait beau', 'il fè BO', 'fa bel tempo'],
  ['il fait chaud', 'il fè SHO', 'fa caldo'],
  ['il fait froid', 'il fè FRUA', 'fa freddo'],
  ['il pleut', 'il PLÖ', 'piove'],
  ['il neige', 'il NÈZH', 'nevica'],
  ['le soleil', 'lë sò-LÈY', 'il sole'],
  ['le vent', 'lë VÃ', 'il vento'],
  ['le nuage', 'lë nü-AZH', 'la nuvola'],
  ["l'orage (m.)", 'lò-RAZH', 'il temporale'],
  ['le brouillard', 'lë bru-YAR', 'la nebbia'],
  ['la température', 'la tã-pé-ra-TÜR', 'la temperatura'],
  ["l'été / l'hiver", 'lé-TÉ / li-VÈR', "l'estate / l'inverno"],
  ['le printemps', 'lë prẽ-TÃ', 'la primavera'],
  ["l'automne (m.)", 'lo-TÒN', "l'autunno"],
])}
${vsec('Shopping', [
  ['acheter', 'ash-TÉ', 'comprare'],
  ['le prix', 'lë PRI', 'il prezzo'],
  ['cher / chère', 'SHÈR', 'caro / cara'],
  ['bon marché', 'bõ mar-SHÉ', 'economico'],
  ['la caisse', 'la KÈS', 'la cassa'],
  ['les soldes (f. pl.)', 'lé SÒLD', 'i saldi'],
  ['le sac', 'lë SAK', 'la borsa'],
  ['payer', 'pè-YÉ', 'pagare'],
  ['le magasin', 'lë ma-ga-ZẼ', 'il negozio'],
  ['le marché', 'lë mar-SHÉ', 'il mercato'],
  ['essayer', 'è-sè-YÉ', 'provare (un vestito)'],
  ['la réduction', 'la ré-dük-SYÕ', 'lo sconto'],
  ['gratuit / gratuite', 'gra-TÜI / gra-TÜIT', 'gratuito'],
  ['le reçu', 'lë rë-SÜ', 'lo scontrino, la ricevuta'],
])}
<h3>Esempi sui punti difficili</h3>
<ul>
<li>«J'ai mal à la tête.» [zhé mal a la TÈT] (Ho mal di testa.) «Il a de la fièvre.»</li>
<li>«L'addition, s'il vous plaît.» [la-di-SYÕ sil vu PLÈ] (Il conto, per favore.)</li>
<li>«Il fait chaud» (tempo) ≠ «J'ai chaud» (sensazione). Non si dice «il est chaud».</li>
<li>«Je voudrais une entrée et un plat.» L'<b>entrée</b> è l'antipasto; il primo piatto non esiste come categoria.</li>
<li>«Voici la carte» = ecco il menu (l'elenco dei piatti); <b>le menu</b> è invece il menu a prezzo fisso: «le menu à vingt euros».</li>
<li>Stagioni: <b>au printemps</b> ma <b>en été, en automne, en hiver</b>.</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>La dent, la fleur</b> sono femminili, <b>le lait</b> e <b>le pain</b> maschili. <b>Les pâtes</b> è sempre plurale.</li>
<li>Non confondere <b>le plat</b> (portata) con <b>le plan</b> (piano, progetto).</li>
<li><b>Le dos</b> è la schiena (non «dosso»); <b>le pied</b> è il piede. L'<b>œil</b> al plurale cambia radicalmente: <i>les yeux</i>.</li>
<li><b>Le dessert</b> è la portata finale; <b>la glace</b> è sia ghiaccio sia gelato.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «J'ai mal à la gorge.» · «Il fait froid, il pleut.» · «L'addition, s'il vous plaît.» · «C'est combien ?»</div>`,
  [
    q(
      'q2',
      'Che cosa significa «une entrée» al ristorante?',
      ['un antipasto', 'un primo piatto', "un biglietto d'ingresso", 'un dolce'],
      0,
      "L'entrée è il piatto che apre il pasto, l'antipasto. Il primo italiano non ha una categoria precisa: si dice semplicemente le plat.",
    ),
    q(
      'q4',
      'Come si dice «Ho mal di testa»?',
      ["J'ai mal à la tête.", 'Je suis mal à la tête.', "J'ai mal de tête.", 'Mon tête fait mal.'],
      0,
      'Si usa avoir mal à + articolo + parte del corpo. Il sostantivo le mal de tête (il mal di testa) esiste, ma con avoir si dice mal à la tête.',
    ),
    q(
      'q5',
      'Quale frase è corretta?',
      [
        "Il fait froid aujourd'hui.",
        "Il est froid aujourd'hui.",
        "Il a froid aujourd'hui (tempo).",
        "C'est froid aujourd'hui (tempo).",
      ],
      0,
      "Il tempo si esprime con il fait + aggettivo. Il a froid significa che qualcuno ha freddo, ed è l'errore tipico di chi traduce da «ha freddo».",
    ),
    q(
      'q9',
      "Come si pronuncia «l'œil» (occhio)?",
      ['[LÖY]', '[LEIL]', '[LOIL]', '[LUEL]'],
      0,
      'Œil si legge con il suono ö (e a labbra tonde) e una i breve finale. Al plurale cambia radicalmente: les yeux [lé-ZYÖ].',
    ),
    q(
      'q11',
      'Al ristorante il cameriere dice «Voici la carte». Che cosa ti porta?',
      ['La lista dei piatti', 'Il conto', 'Una carta di credito', 'Un menu a prezzo fisso'],
      0,
      "La carte è l'elenco dei piatti. Il menu francese è invece una formula a prezzo fisso, e il conto si chiede con l'addition.",
    ),
    q(
      'q12',
      'Come si dice «In estate fa caldo»?',
      ['En été, il fait chaud.', 'Au été, il fait chaud.', "À l'été, il est chaud.", "Dans l'été, il a chaud."],
      0,
      'Con le stagioni si usa en (en été, en hiver, en automne), tranne au printemps. Il tempo è il fait chaud, non il est chaud.',
    ),
    q(
      'q13',
      'Che cosa significa «le dos»?',
      ['la schiena', 'il dosso', 'la dose', 'il petto'],
      0,
      'Le dos è la schiena, parte posteriore del corpo. La dose si dice la dose, mentre il petto è la poitrine.',
    ),
  ],
  [
    card('c5', 'avoir mal à...', "Avere male a...: J'ai mal à la tête."),
    card('c6', "l'entrée (f.)", 'Antipasto, non primo piatto.'),
    card('c7', "l'addition", 'Il conto [la-di-SYÕ]'),
    card('c8', 'il fait chaud / froid', 'Fa caldo / freddo (tempo).'),
    card('c9', 'les pâtes', 'La pasta (sempre plurale).'),
    card('c11', 'la carte / le menu', 'Carte = elenco dei piatti; menu = formula a prezzo fisso.'),
    card('c12', 'Come si dice «il conto»?', "L'addition [la-di-SYÕ]"),
    card('c13', 'Come si dice «la gola»?', 'La gorge [la GÒRZH]'),
    card('c14', 'Come si dice «la schiena»?', 'Le dos [lë DO]'),
    card('c15', 'Come si dice «lo sconto»?', 'La réduction [la ré-dük-SYÕ]'),
    card('c16', 'Come si dice «il temporale»?', "L'orage (m.) [lò-RAZH]"),
  ],
  [
    prac(
      'p3',
      'Traduci: «Mi fa male la gola e ho la febbre.»',
      "J'ai mal à la gorge et j'ai de la fièvre. Nota: avoir de la fièvre (partitivo).",
    ),
    prac(
      'p4',
      'Ordina al ristorante: un antipasto, un piatto di pasta, il conto.',
      "Je voudrais une entrée, un plat de pâtes et l'addition, s'il vous plaît. Nota: entrée = antipasto.",
    ),
    prac(
      'p5',
      'Traduci: «Oggi fa freddo, metto il cappotto e le scarpe chiuse.»',
      "Aujourd'hui, il fait froid, je mets mon manteau et mes chaussures fermées. Nota: il fait froid (tempo).",
    ),
    prac(
      'p8',
      "Traduci: «Questo maglione costa troppo: c'è uno sconto?»",
      'Ce pull coûte trop cher : il y a une réduction ? Nota: coûter cher; réduction = sconto.',
    ),
  ],
)

export const fraVocViaggi: CourseModule = mod(
  'fr-voc-viaggi',
  'Vocabolario: viaggi e città',
  'Trasporti, albergo, città, indicazioni, emergenze, banca e posta, divertimento (90 termini con pronuncia)',
  'voc',
  `<p class="lead">Il lessico che serve davvero in viaggio: treni, albergo, indicazioni, imprevisti. Tutto con articolo e pronuncia.</p>
${PRON_SHORT}
${vsec('Trasporti', [
  ['le voyage', 'lë vua-YAZH', 'il viaggio'],
  ['le billet', 'lë bi-YÈ', 'il biglietto'],
  ['le train', 'lë TRẼ', 'il treno'],
  ['la gare', 'la GAR', 'la stazione'],
  ['le quai', 'lë KÈ', 'la banchina'],
  ['la voie', 'la VUA', 'il binario (voie quatre)'],
  ['le retard', 'lë rë-TAR', 'il ritardo'],
  ["l'avion (m.)", 'la-VYÕ', "l'aereo"],
  ["l'aéroport (m.)", 'la-é-ro-PÒR', "l'aeroporto"],
  ['le vol', 'lë VÒL', 'il volo'],
  ['la valise', 'la va-LIZ', 'la valigia'],
  ['le passeport', 'lë pas-PÒR', 'il passaporto'],
  ['le métro', 'lë mé-TRO', 'la metropolitana'],
  ['le bus', 'lë BÜS', "l'autobus"],
  ['la station', 'la sta-SYÕ', 'la fermata (metro)'],
  ['la voiture', 'la vua-TÜR', "l'auto"],
  ['la location', 'la lo-ka-SYÕ', 'il noleggio'],
  ["l'essence (f.)", 'lè-SÃS', 'la benzina'],
  ['le vélo', 'lë vé-LO', 'la bicicletta'],
])}
${vsec('Albergo', [
  ["l'hôtel (m.)", 'lo-TÈL', "l'albergo"],
  ['la réservation', 'la ré-zèr-va-SYÕ', 'la prenotazione'],
  ['la chambre double', 'la shãbr DUBL', 'la camera doppia'],
  ['la réception', 'la ré-sèp-SYÕ', 'la reception'],
  ['complet', 'kõ-PLÈ', 'al completo'],
  ["l'ascenseur (m.)", 'la-sã-SÖR', "l'ascensore"],
  ['la nuit', 'la NÜI', 'la notte'],
  ['le séjour', 'lë sé-ZHUR', 'il soggiorno'],
  ['le petit-déjeuner', 'lë pë-ti-dé-zhë-NÉ', 'la colazione'],
])}
${vsec('Città e luoghi', [
  ['la rue', 'la RÜ', 'la via'],
  ['la place', 'la PLAS', 'la piazza'],
  ['le pont', 'lë PÕ', 'il ponte'],
  ['le quartier', 'lë kar-TYÉ', 'il quartiere'],
  ['le centre-ville', 'lë sã-trë-VIL', 'il centro'],
  ['la mairie', 'la mè-RI', 'il municipio'],
  ["l'église (f.)", 'lé-GLIZ', 'la chiesa'],
  ['le musée', 'lë mü-ZÉ', 'il museo'],
  ['le parc', 'lë PARK', 'il parco'],
  ['le carrefour', 'lë kar-FUR', "l'incrocio"],
  ['le feu rouge / les feux', 'lë fö RUZH / lé FÖ', 'il semaforo (rosso) / i semafori'],
])}
${vsec('Indicazioni', [
  ['tout droit', 'tu DRUA', 'dritto'],
  ['à gauche', 'a GOSH', 'a sinistra'],
  ['à droite', 'a DRUAT', 'a destra'],
  ['au coin', 'o KUẼ', "all'angolo"],
  ['en face de', 'ã fas DË', 'di fronte a'],
  ['près de', 'prè DË', 'vicino a'],
  ['loin de', 'luẽ DË', 'lontano da'],
  ['Pour aller à...?', 'pur a-lé A', 'Per andare a...?'],
])}
${vsec('Emergenze', [
  ['Au secours !', 'o së-KUR', 'Aiuto!'],
  ['la police', 'la pò-LIS', 'la polizia'],
  ["l'ambulance (f.)", 'lã-bü-LÃS', "l'ambulanza"],
  ['les pompiers', 'lé põ-PYÉ', 'i vigili del fuoco'],
  ["l'hôpital (m.)", 'lò-pi-TAL', "l'ospedale"],
  ['un accident', 'ẽ-nak-si-DÃ', 'un incidente'],
  ['perdu / volé', 'pèr-DÜ / vò-LÉ', 'perso / rubato'],
  ["J'ai besoin d'un médecin.", 'zhé bë-ZUẼ dẽ méd-SẼ', 'Ho bisogno di un medico.'],
])}
${vsec('Banca e posta', [
  ['la banque', 'la BÃK', 'la banca'],
  ['le distributeur', 'lë dis-tri-bü-TÖR', 'il bancomat'],
  ['retirer', 'rë-ti-RÉ', 'prelevare'],
  ['le compte', 'lë KÕT', 'il conto (in banca)'],
  ['la poste', 'la PÒST', 'la posta'],
  ['le timbre', 'lë TẼBR', 'il francobollo'],
  ['le colis', 'lë kò-LI', 'il pacco'],
  ['envoyer', 'ã-vua-YÉ', 'spedire'],
])}
${vsec('Divertimento', [
  ['le cinéma', 'lë si-né-MA', 'il cinema'],
  ['le film', 'lë FILM', 'il film'],
  ['le concert', 'lë kõ-SÈR', 'il concerto'],
  ['la sortie', 'la sòr-TI', "l'uscita, la serata"],
  ['la plage', 'la PLAZH', 'la spiaggia'],
  ['la montagne', 'la mõ-TAGN', 'la montagna'],
  ['se promener', 'së pròm-NÉ', 'fare una passeggiata'],
])}
<h3>Esempi sui punti difficili</h3>
<ul>
<li>«Pour aller à la gare, s'il vous plaît ?» — «Allez tout droit, puis à gauche.»</li>
<li>«Je voudrais un billet aller-retour pour Lyon.» [zhë vu-DRÈ ẽ bi-yè a-lé-rë-TUR pur li-YÕ]</li>
<li>«L'hôtel est complet.» «Au secours ! Appelez la police !»</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>La gare</b> = stazione (gara = la compétition). <b>Le quai</b> = banchina; il binario numerato è <b>la voie</b> («voie quatre»).</li>
<li><b>La place</b> = piazza ma anche posto («Il y a une place libre»). <b>La station</b> = fermata di metro/bus.</li>
<li><b>Complet</b> = al completo. <b>La mairie</b> = municipio; <b>le maire</b> = il sindaco.</li>
<li><b>La sortie</b> = uscita e anche uscita serale. <b>La location</b> = noleggio, non «location» cinematografica.</li>
<li><b>La chambre</b> = camera da letto; per «camera d'albergo» si dice anche <i>chambre</i>.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Où est la gare, s'il vous plaît ?» · «J'ai perdu mon passeport.» · «À droite, puis tout droit.»</div>`,
  [
    q(
      'q1',
      'Che cosa significa «la gare» ?',
      ['la stazione', 'la gara', 'il garage', 'la garanzia'],
      0,
      'La gare è la stazione. Gara (competizione) si dice la compétition o la course, e garage resta le garage.',
    ),
    q(
      'q2',
      "Che cosa significa «complet» all'ingresso di un hotel?",
      ['al completo', 'completo di tutti i servizi', 'il pernottamento è incluso', 'solo per clienti'],
      0,
      "Complet vuol dire che non ci sono più posti liberi. È la stessa parola per il cinema, il parcheggio, l'autobus.",
    ),
    q(
      'q3',
      'Come si dice «a destra» ?',
      ['à droite', 'à gauche', 'tout droit', 'en face'],
      0,
      'Droite è destra; gauche è sinistra. Tout droit significa invece «dritto», ed è facile confondere le due forme.',
    ),
    q(
      'q4',
      'Come si pronuncia «à droite» ?',
      ['[a DRUAT]', '[a DROIT]', '[a DRO-ite]', '[a DRIT]'],
      0,
      "La t si pronuncia perché dopo c'è una e muta: droite [DRUAT], mentre droit (tout droit) è [DRUA]. Il gruppo oi si legge ua.",
    ),
    q(
      'q5',
      'Che cosa si dice per chiedere aiuto?',
      ['Au secours !', 'À table !', 'Aux armes !', 'Au revoir !'],
      0,
      'Au secours! è il grido di aiuto. Le altre formule hanno senso del tutto diverso: «a tavola», «alle armi», «arrivederci».',
    ),
    q(
      'q6',
      'Che cosa significa «le quai» in una stazione?',
      ['la banchina', 'il binario numerato', 'il quaderno', 'il quartiere'],
      0,
      'Le quai è la banchina dove si sale sul treno; il binario con il numero si dice la voie. Il quartiere è le quartier, il quaderno le cahier.',
    ),
    q(
      'q7',
      'Come si dice «Ho perso il passaporto»?',
      [
        "J'ai perdu mon passeport.",
        "J'ai perdé mon passeport.",
        'Je suis perdu mon passeport.',
        "J'ai perduto mon passeport.",
      ],
      0,
      "Perdre ha il participio perdu (-u, non -é). L'ausiliare è avoir. Je suis perdu significa «mi sono perso» (nel senso di smarrito).",
    ),
    q(
      'q8',
      'Che cosa significa «la sortie» ?',
      ["l'uscita, la serata fuori", "solo l'uscita di casa", 'la sorte, il destino', 'il sorteggio di una lotteria'],
      0,
      "Sortie vuol dire uscita fisica, ma anche uscita con gli amici. Sorte (destino) e sorteggio non c'entrano.",
    ),
    q(
      'q9',
      'Come si dice «Per andare alla stazione?»',
      ['Pour aller à la gare ?', 'Pour aller en la gare ?', 'Pour allé à la gare ?', 'Pour aller au la gare ?'],
      0,
      "Pour + infinito (aller) + à + luogo. L'infinito aller non cambia e à si combina con l'articolo se maschile (au).",
    ),
    q(
      'q10',
      'Come si pronuncia «la montagne» ?',
      ['[la mõ-TAGN]', '[la mon-TAN-ie]', '[la mõ-TAN]', '[la mon-TA-gne]'],
      0,
      'Il gruppo «gn» ha il suono italiano gn di «bagno», e la e finale è muta. La n di mon è assorbita dalla nasale õ.',
    ),
  ],
  [
    card('c1', 'la gare', 'La stazione [la GAR]'),
    card('c2', 'le billet aller-retour', 'Il biglietto di andata e ritorno'),
    card('c3', 'complet', 'Al completo [kõ-PLÈ]'),
    card('c4', 'à gauche / à droite', 'A sinistra / a destra [a GOSH / a DRUAT]'),
    card('c5', 'tout droit', 'Dritto'),
    card('c6', 'Pour aller à...?', 'Per andare a...?'),
    card('c7', 'la mairie', 'Il municipio'),
    card('c8', 'perdu / volé', 'Perso / rubato'),
    card('c9', 'Au secours !', 'Aiuto!'),
    card('c10', 'le distributeur', 'Il bancomat'),
    card('c11', 'le quai / la voie', 'Quai = banchina; voie = binario (voie quatre).'),
    card('c12', 'Come si dice «la stazione»?', 'La gare [la GAR]'),
    card('c13', 'Come si dice «il ritardo»?', 'Le retard [lë rë-TAR]'),
    card('c14', 'Come si dice «la valigia»?', 'La valise [la va-LIZ]'),
    card('c15', 'Come si dice «il pacco»?', 'Le colis [lë kò-LI]'),
    card('c16', 'Come si dice «a sinistra»?', 'À gauche [a GOSH]'),
  ],
  [
    prac(
      'p1',
      'Chiedi come arrivare alla stazione e rispondi con le indicazioni.',
      "Pardon, pour aller à la gare, s'il vous plaît ? — Allez tout droit, puis tournez à gauche. Nota: tournez à gauche = giri a sinistra.",
    ),
    prac(
      'p2',
      'Traduci: «Vorrei prenotare una camera doppia per due notti.»',
      'Je voudrais réserver une chambre double pour deux nuits. Nota: réserver, chambre double, pour + durata.',
    ),
    prac(
      'p3',
      "Traduci: «Ho perso la valigia all'aeroporto.»",
      "J'ai perdu ma valise à l'aéroport. Nota: perdre → perdu, avoir come ausiliare.",
    ),
    prac(
      'p4',
      "Traduci: «Il treno ha un'ora di ritardo.»",
      'Le train a une heure de retard. Nota: avoir un retard, non «être».',
    ),
    prac(
      'p5',
      'Spiega a un amico come prelevare e spedire un pacco.',
      "Va au distributeur pour retirer de l'argent, puis à la poste pour envoyer le colis. Nota: retirer, envoyer, colis.",
    ),
  ],
)

export const fraVocLavoro: CourseModule = mod(
  'fr-voc-lavoro',
  'Vocabolario: lavoro, studio, tecnologia e opinioni',
  'Lavoro, studio, informatica, opinioni e sentimenti, politica ed economia di base, frasi per conversare (80 termini)',
  'voc',
  `<p class="lead">Il lessico di livello B1-B2: serve per colloqui, studio, discussioni. Ogni parola ha articolo e pronuncia; alla fine trovi le formule per tenere in piedi una conversazione.</p>
${PRON_SHORT}
${vsec('Lavoro', [
  ['le travail', 'lë tra-VAY', 'il lavoro'],
  ["l'emploi (m.)", 'lã-PLUA', "l'impiego"],
  ['le métier', 'lë mé-TYÉ', 'il mestiere'],
  ['le poste', 'lë PÒST', 'il posto, la posizione'],
  ["l'entreprise (f.)", 'lã-trë-PRIZ', "l'azienda"],
  ['le patron / la patronne', 'lë pa-TRÕ / la pa-TRÒN', 'il capo / la capa'],
  ['le collègue', 'lë kò-LÈG', 'il collega'],
  ['le salaire', 'lë sa-LÈR', 'lo stipendio'],
  ['le contrat', 'lë kõ-TRA', 'il contratto'],
  ["l'entretien (m.)", 'lã-trë-TYẼ', 'il colloquio'],
  ['le chômage', 'lë sho-MAZH', 'la disoccupazione'],
  ['la réunion', 'la ré-ü-NYÕ', 'la riunione'],
  ['le congé', 'lë kõ-ZHÉ', 'il permesso, le ferie'],
])}
${vsec('Studio', [
  ["l'école (f.)", 'lé-KÒL', 'la scuola'],
  ["l'université (f.)", 'lü-ni-vèr-si-TÉ', "l'università"],
  ['le cours', 'lë KUR', 'il corso, la lezione'],
  ["l'examen (m.)", 'lèg-za-MẼ', "l'esame"],
  ['le diplôme', 'lë di-PLOM', 'il diploma'],
  ["l'étudiant / l'étudiante", 'lé-tü-DYÃ / lé-tü-DYÃT', 'lo studente / la studentessa'],
  ['le professeur', 'lë prò-fè-SÖR', 'il professore'],
  ['la note', 'la NÒT', 'il voto'],
  ['le stage', 'lë STAZH', 'il tirocinio'],
  ['apprendre', 'a-PRÃDR', 'imparare'],
  ['réviser', 'ré-vi-ZÉ', 'ripassare'],
])}
${vsec('Tecnologia e informatica', [
  ["l'ordinateur (m.)", 'lòr-di-na-TÖR', 'il computer'],
  ['le portable', 'lë pòr-TABL', 'il cellulare / il portatile'],
  ['le courriel', 'lë ku-RYÈL', "l'email"],
  ['le mot de passe', 'lë mo dë PAS', 'la password'],
  ['le site', 'lë SIT', 'il sito'],
  ["l'appli (f.)", 'la-PLI', "l'app"],
  ['le logiciel', 'lë lò-zhi-SYÈL', 'il software'],
  ['télécharger', 'té-lé-shar-ZHÉ', 'scaricare'],
  ['le fichier', 'lë fi-SHYÉ', 'il file'],
  ["l'écran (m.)", 'lé-KRÃ', 'lo schermo'],
  ['la connexion', 'la ko-nèk-SYÕ', 'la connessione'],
  ['sauvegarder', 'sov-gar-DÉ', 'salvare'],
  ['cliquer', 'kli-KÉ', 'cliccare'],
])}
${vsec('Opinioni e sentimenti', [
  ['à mon avis', 'a mõ-na-VI', 'secondo me'],
  ['je trouve que', 'zhë TRUV kë', 'trovo che'],
  ["d'accord", 'da-KÒR', "d'accordo"],
  ['pas du tout', 'pa dü TU', 'per niente'],
  ['heureux / heureuse', 'ö-RÖ / ö-RÖZ', 'felice'],
  ['triste', 'TRIST', 'triste'],
  ['fâché / fâchée', 'fa-SHÉ', 'arrabbiato'],
  ['inquiet / inquiète', 'ẽ-KYÈ / ẽ-KYÈT', 'preoccupato'],
  ['déçu / déçue', 'dé-SÜ', 'deluso'],
  ["J'en ai marre.", 'zhã-NÉ MAR', 'Ne ho abbastanza.'],
  ["Ça m'est égal.", 'sa mè-té-GAL', 'Mi è indifferente.'],
])}
${vsec('Politica ed economia', [
  ['le gouvernement', 'lë gu-vèr-në-MÃ', 'il governo'],
  ['le président', 'lë pré-zi-DÃ', 'il presidente'],
  ["l'élection (f.)", 'lé-lèk-SYÕ', "l'elezione"],
  ['le vote', 'lë VÒT', 'il voto'],
  ['la loi', 'la LUA', 'la legge'],
  ["l'impôt (m.)", 'lẽ-PO', "l'imposta"],
  ["l'économie (f.)", 'lé-kò-no-MI', "l'economia"],
  ['la crise', 'la KRIZ', 'la crisi'],
  ['la grève', 'la GRÈV', 'lo sciopero'],
  ['le parti', 'lë par-TI', 'il partito'],
])}
${vsec('Per conversare', [
  ['Excusez-moi.', 'èk-skü-zé MUA', 'Mi scusi.'],
  ['Pouvez-vous répéter ?', 'pu-vé-VU ré-pé-TÉ', 'Può ripetere?'],
  ['Je ne comprends pas.', 'zhë në kõ-prã PA', 'Non capisco.'],
  ['Parlez plus lentement.', 'par-lé plü lãt-MÃ', 'Parli più lentamente.'],
  ['Que veut dire... ?', 'kë vö DIR', 'Che cosa vuol dire...?'],
  ['Alors', 'a-LÒR', 'Allora'],
  ['Par contre', 'par KÕTR', 'Invece, per contro'],
  ['Avec plaisir.', 'a-vèk plè-ZIR', 'Volentieri.'],
])}
<h3>Esempi sui punti difficili</h3>
<ul>
<li>«J'ai un entretien demain.» [zhé ẽ-nã-trë-TYẼ dë-MẼ] (Ho un colloquio domani.)</li>
<li>«Je suis déçu par ce résultat.» «À mon avis, la crise va durer.»</li>
<li>«Pouvez-vous répéter, s'il vous plaît ?» · «Je n'ai pas bien compris.»</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>La note</b> = voto scolastico, e anche il conto (soprattutto d'albergo o in Svizzera; al ristorante in Francia si dice <i>l'addition</i>). Gli appunti si dicono <i>les notes</i>, al plurale.</li>
<li><b>Le stage</b> = tirocinio, <b>la formation</b> = corso di formazione, <b>le cours</b> = lezione.</li>
<li><b>Le portable</b> = cellulare; il computer portatile è <i>l'ordinateur portable</i>.</li>
<li><b>Le travail</b> = lavoro in generale; <b>l'emploi</b> = il posto di lavoro; <b>le métier</b> = la professione.</li>
<li><b>Le patron</b> = capo (non «padrone» in senso negativo). <b>Le collègue</b> = collega.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «À mon avis, ...» · «Je ne suis pas d'accord.» · «Pouvez-vous répéter ?»</div>`,
  [
    q(
      'q1',
      'Che cosa significa «un stage» ?',
      ['un tirocinio', 'una tappa del viaggio', 'un corso di lingua', 'uno stadio'],
      0,
      "Un stage è un periodo di formazione in azienda, il tirocinio. Non c'entra con «stage» come palcoscenico né con lo stadio.",
    ),
    q(
      'q2',
      'Che cosa significa «une note» a scuola?',
      ['un voto', 'un appunto', "un'annotazione sul quaderno", 'una nota musicale'],
      0,
      "À l'école, la note è il voto. Gli appunti presi a lezione si dicono les notes al plurale, ed è il contesto a decidere.",
    ),
    q(
      'q3',
      'Come si pronuncia «le travail» ?',
      ['[lë tra-VAY]', '[lë tra-VAIL]', '[lë tra-VA-ij]', '[lë tra-VALL]'],
      0,
      "Il gruppo «ail» finale si legge ay: la i diventa semiconsonante e la l non si pronuncia. Travail ha accento sull'ultima sillaba.",
    ),
    q(
      'q4',
      'Come si dice «Secondo me»?',
      ['À mon avis', 'Selon moi-même', 'Dans mon avis', 'En mon avis'],
      0,
      'À mon avis è la formula standard; selon moi è corretta ma più scritta. Dans mon avis e en mon avis sono errori da traduzione letterale.',
    ),
    q(
      'q5',
      'Quale frase esprime indifferenza?',
      ["Ça m'est égal.", "J'en ai marre.", 'Je suis ravi.', 'Pas du tout !'],
      0,
      "Ça m'est égal significa «mi è indifferente». J'en ai marre indica stanchezza o irritazione, ravi indica gioia.",
    ),
    q(
      'q6',
      'Che cosa significa «le portable» ?',
      ['il cellulare', 'solo il computer portatile', 'il portabagagli', 'il portafoglio'],
      0,
      'Nel parlato le portable è il telefono cellulare. Il computer portatile si dice un ordinateur portable.',
    ),
    q(
      'q7',
      'Come si dice «Non capisco» ?',
      ['Je ne comprends pas.', 'Je comprends ne pas.', 'Je ne comprendre pas.', 'Je pas comprends.'],
      0,
      "La negazione ne... pas circonda il verbo coniugato. Pas va dopo il verbo, non prima né dopo l'infinito in questo caso.",
    ),
    q(
      'q8',
      'Che cosa significa «la grève» ?',
      ['lo sciopero', 'la spiaggia', 'il grave problema', 'la greve'],
      0,
      'La grève è lo sciopero. Nel linguaggio antico significava anche spiaggia, ma oggi è solo lo sciopero.',
    ),
    q(
      'q9',
      'Come si dice «Mi scusi»? (formale)',
      ['Excusez-moi.', 'Excuse-moi.', 'Désolé toi.', 'Pardonne-moi.'],
      0,
      'Excusez-moi è la forma di cortesia (vous). Excuse-moi usa tu ed è informale; pardonne-moi è più personale.',
    ),
    q(
      'q10',
      'Che cosa significa «Que veut dire... ?»',
      ['Che cosa vuol dire...?', 'Che cosa vuoi dire?', 'Chi vuole dire?', 'Quando vuoi dire?'],
      0,
      'Que veut dire X? chiede il significato di X. È una formula utilissima in classe e in viaggio.',
    ),
  ],
  [
    card('c1', "le travail / l'emploi", "Il lavoro (attività) / l'impiego (posto)."),
    card('c2', "l'entretien", 'Il colloquio [lã-trë-TYẼ]'),
    card('c3', 'le salaire / le contrat', 'Lo stipendio / il contratto.'),
    card('c4', 'le stage', 'Il tirocinio.'),
    card('c5', 'la note', 'Il voto (scuola).'),
    card('c6', 'télécharger', 'Scaricare [té-lé-shar-ZHÉ]'),
    card('c7', 'à mon avis', 'Secondo me [a mõ-na-VI]'),
    card('c8', "ça m'est égal", 'Mi è indifferente.'),
    card('c9', 'la grève', 'Lo sciopero.'),
    card('c10', 'Pouvez-vous répéter ?', 'Può ripetere? [pu-vé-VU ré-pé-TÉ]'),
    card('c11', 'Come si dice «lo stipendio»?', 'Le salaire [lë sa-LÈR]'),
    card('c12', 'Come si dice «il colloquio»?', "L'entretien (m.) [lã-trë-TYẼ]"),
    card('c13', 'Come si dice «scaricare»?', 'Télécharger [té-lé-shar-ZHÉ]'),
    card('c14', 'Come si dice «lo sciopero»?', 'La grève [la GRÈV]'),
    card('c15', 'Come si dice «secondo me»?', 'À mon avis [a mõ-na-VI]'),
    card('c16', 'Come si dice «il congedo, le ferie»?', 'Le congé [lë kõ-ZHÉ]'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Domani ho un colloquio per un tirocinio.»',
      "Demain, j'ai un entretien pour un stage. Nota: entretien = colloquio, stage = tirocinio.",
    ),
    prac(
      'p2',
      'Traduci: «Secondo me, il governo dovrebbe abbassare le imposte.»',
      'À mon avis, le gouvernement devrait baisser les impôts. Nota: devrait = condizionale; impôts al plurale.',
    ),
    prac(
      'p3',
      'Traduci: «Non ho capito: può ripetere più lentamente?»',
      "Je n'ai pas compris : pouvez-vous répéter plus lentement ? Nota: passé composé di comprendre.",
    ),
    prac(
      'p4',
      "Traduci: «Ho scaricato il file e l'ho salvato sul computer.»",
      "J'ai téléchargé le fichier et je l'ai sauvegardé sur l'ordinateur. Nota: accordo non necessario (fichier masc.).",
    ),
    prac(
      'p5',
      'Esprimi tre opinioni su un tema a tua scelta con formule diverse.',
      "À mon avis, ... / Je trouve que... / Je ne suis pas d'accord avec... Nota: varia le formule e usa un connettore.",
    ),
  ],
)
