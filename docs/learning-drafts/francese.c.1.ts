import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './francese.b.pron'

// FRENCH course part C (council round 1 additions), modules 1-2:
// fr-determinants (b1) and fr-geo-reggenze (a2).

export const fDeterminants = mod(
  'fr-determinants',
  'Indefiniti, celui/celle, avverbi in -ment, numerali',
  "plusieurs, quelques, chaque, chacun, tout, n'importe, celui/celle/ceux, avverbi in -ment, ordinali, frazioni, percentuali",
  'b1',
  `${PRON_SHORT}
<p class="lead">Quattro gruppi di parole piccole e frequentissime che l'italiano rende in modo diverso: gli <b>indefiniti</b> (qualche, ogni, tutto), i <b>pronomi dimostrativi</b> (quello di, quelli che), gli <b>avverbi in -ment</b> e i <b>numerali</b> (ordinali, frazioni, percentuali).</p>
<h3>Indefiniti: quantità e identità</h3>
<table><tr><th>Francese</th><th>Uso</th><th>Italiano</th></tr>
<tr><td>plusieurs [plü-ZYÖR]</td><td>plurale, invariabile, mai «de»</td><td>diversi, parecchi</td></tr>
<tr><td>quelques [KÈLK]</td><td>sempre plurale</td><td>alcuni, qualche</td></tr>
<tr><td>chaque [SHAK]</td><td>sempre singolare, davanti a nome</td><td>ogni</td></tr>
<tr><td>chacun / chacune [sha-KẼ]</td><td>pronome, singolare</td><td>ciascuno</td></tr>
<tr><td>certains / certaines [sèr-TẼ]</td><td>plurale</td><td>alcuni, certi</td></tr>
<tr><td>aucun / aucune [o-KẼ]</td><td>con «ne», singolare</td><td>nessuno</td></tr>
<tr><td>quelqu'un [kèl-KẼ]</td><td>persona, maschile</td><td>qualcuno</td></tr>
<tr><td>quelque chose [kèlk-SHOZ]</td><td>cosa, maschile</td><td>qualcosa</td></tr></table>
<p><b>Trappola 1.</b> «Qualche amico» è singolare in italiano, ma in francese <b>quelques amis</b> è plurale: <i>J'ai invité quelques amis.</i> Il singolare <i>quelque</i> esiste solo in <i>quelque chose</i> e <i>quelqu'un</i>.</p>
<p><b>Trappola 2.</b> <b>Plusieurs</b> non c'entra con «più» (plus). <i>Il y a plusieurs possibilités</i> = ci sono diverse possibilità. Con un pronome serve «de»: <i>plusieurs d'entre nous</i> (diversi di noi).</p>
<p><b>Chaque</b> vuole il singolare: <i>chaque jour</i>, <i>chaque étudiant</i>. Senza nome si usa <b>chacun</b>: <i>Chacun son tour</i> (a ciascuno il suo turno), <i>Chacun pour soi</i>, <i>Ils ont chacun une voiture</i>. Con <i>la plupart</i> il verbo va al plurale: <i>La plupart des gens pensent que...</i></p>
<p><b>Certains</b> (certains disent...) è anche pronome: <i>Certains pensent que c'est faux</i>. <b>Aucun</b> vuole <i>ne</i> davanti al verbo: <i>Aucun problème ne s'est présenté.</i>; da solo come risposta: <i>Aucun.</i> Con complemento di quantità: <i>Je n'en ai aucun.</i></p>
<p><b>Autre</b> e <b>même</b>: <i>un autre café</i>, <i>d'autres amis</i> (non «des autres»), <i>l'autre jour</i> (l'altro giorno), <i>le même jour</i>, <i>moi-même</i>, <i>même les enfants</i> (perfino i bambini). Con aggettivo: <i>quelque chose de bien</i>, <i>rien de nouveau</i>, <i>quelqu'un d'intéressant</i> (de + aggettivo maschile).</p>
<h3>Tout: quattro funzioni</h3>
<table><tr><th>Funzione</th><th>Forme</th><th>Esempio</th></tr>
<tr><td>aggettivo</td><td>tout, toute, tous, toutes</td><td>toute la journée, tous les jours</td></tr>
<tr><td>pronome</td><td>tout [TU], tous [TUS]</td><td>J'ai tout vu. Ils sont tous là.</td></tr>
<tr><td>avverbio</td><td>tout (invariabile)</td><td>tout petit, tout seul</td></tr>
<tr><td>nome</td><td>le tout</td><td>Le tout coûte dix euros.</td></tr></table>
<ul>
<li><b>Tout le monde</b> è singolare: <i>Tout le monde est là</i> [tu lë MÕD è LA]. «Tutti sono qui» = <i>Ils sont tous là</i> (tous pronome si pronuncia con la s).</li>
<li><b>Tous les deux</b> = tutti e due; <b>tous les jours</b> = ogni giorno; <b>toutes les semaines</b>.</li>
<li><b>Avverbio</b>: è invariabile, tranne davanti a un aggettivo femminile che comincia per consonante: <i>Elle est tout étonnée</i> (vocale: invariabile) ma <i>Elle est toute contente</i> e <i>Elles sont toutes petites</i> (consonante: si accorda). <i>Il est tout petit</i> resta invariabile.</li>
<li><b>Tout en + gérondif</b>: simultaneità, <i>Il travaille tout en écoutant de la musique.</i></li>
</ul>
<h3>N'importe: «qualsiasi, uno qualunque»</h3>
<p><b>n'importe qui</b> (chiunque), <b>n'importe quoi</b> (qualsiasi cosa; anche: «sciocchezze»), <b>n'importe où</b>, <b>n'importe quand</b>, <b>n'importe comment</b> (a casaccio), <b>n'importe quel / quelle</b> + nome: <i>Tu peux venir n'importe quand.</i> / <i>Il dit n'importe quoi!</i> «Sta dicendo sciocchezze!»</p>
<h3>Celui, celle, ceux, celles: mai da soli</h3>
<p>Sono pronomi dimostrativi e non stanno mai da soli: vogliono <b>de</b>, un <b>pronome relativo</b> (qui, que, dont, où) o <b>-ci / -là</b>.</p>
<table><tr><th>Francese</th><th>Italiano</th></tr>
<tr><td>Mon sac et celui de Paul</td><td>La mia borsa e quella di Paul</td></tr>
<tr><td>Celle que j'aime</td><td>Quella che amo</td></tr>
<tr><td>Ceux qui travaillent</td><td>Quelli che lavorano</td></tr>
<tr><td>Celui-ci / celui-là</td><td>Questo / quello</td></tr>
<tr><td>Ceci, cela, ça</td><td>Questo, ciò, ciò / questo (parlato)</td></tr></table>
<p>Pronuncia: celui [së-LÜI], celle [SÈL], ceux [SÖ], celles [SÈL]. Errore tipico: <i>Celui est bon</i>: sbagliato; si dice <i>Celui-ci est bon</i> oppure <i>Ce livre est bon.</i> <b>Ceci</b> annuncia ciò che segue («Ceci est important: ...»), <b>cela</b> è formale e <b>ça</b> il registro parlato (<i>Ça va ?</i>, <i>Ça m'est égal</i>).</p>
<h3>Avverbi in -ment</h3>
<p><b>Regola base</b>: femminile dell'aggettivo + <b>-ment</b>: <i>lent → lente → lentement</i> [lãt-MÃ], <i>doux → douce → doucement</i>, <i>heureux → heureuse → heureusement</i> [ö-rö-zë-MÃ], <i>franc → franche → franchement</i>, <i>actif → active → activement</i>.</p>
<ul>
<li>Aggettivo che finisce in vocale (-ai, -é, -i, -u): maschile + -ment: <i>vrai → vraiment</i> [vrè-MÃ], <i>poli → poliment</i>, <i>absolu → absolument</i>, <i>joli → joliment</i>.</li>
<li><b>-ant → -amment</b>, <b>-ent → -emment</b>, entrambi si dicono [a-MÃ]: <i>constant → constamment</i>, <i>évident → évidemment</i> [é-vi-da-MÃ], <i>récent → récemment</i>, <i>prudent → prudemment</i>. Eccezione: <i>lent → lentement</i>.</li>
<li>Irregolari frequenti: <i>gentil → gentiment</i> [zhã-ti-MÃ], <i>bref → brièvement</i>, <i>énorme → énormément</i>, <i>précis → précisément</i>, <i>profond → profondément</i>, <i>intense → intensément</i>.</li>
<li>Suppletivi: <i>bon → bien</i>, <i>mauvais → mal</i>, <i>meilleur → mieux</i>. Aggettivi usati come avverbi (invariabili): <i>parler fort</i>, <i>travailler dur</i>, <i>coûter cher</i>, <i>voir clair</i>.</li>
</ul>
<p><b>Posizione</b>: dopo il verbo nei tempi semplici (<i>Il parle lentement.</i>). Nel passé composé gli avverbi brevi stanno tra ausiliare e participio (<i>Il a bien dormi</i>, <i>Elle a déjà fini</i>, <i>Tu as beaucoup mangé</i>, <i>J'ai vraiment compris</i>); quelli lunghi in -ment stanno spesso dopo (<i>Il a parlé longuement</i>) ma <i>complètement, totalement</i> vanno bene prima. Gli avverbi di frase aprono la frase: <i>Heureusement, il était là.</i> (Per fortuna c'era.)</p>
<p><b>Falsi amici</b>: <i>actuellement</i> = attualmente, in questo momento (non «in realtà», che è <i>en fait</i>); <i>finalement</i> = alla fine; <i>évidemment</i> = ovviamente.</p>
<h3>Ordinali, frazioni, percentuali</h3>
<p><b>Ordinali</b>: numero cardinale + <b>-ième</b>, perdendo la -e finale: <i>quatre → quatrième</i>, <i>onze → onzième</i>. Cambiamenti: <i>cinq → cinquième</i> [sẽ-KYÈM], <i>neuf → neuvième</i>, <i>un → unième</i> (<i>vingt et unième</i>). Unici irregolari: <b>premier / première</b> e <b>second(e)</b> (si usa se i termini sono solo due). Poi: deuxième, troisième, dixième, vingtième, centième.</p>
<p>Si abbrevia <i>1er, 1re, 2e, 3e</i>. In francese le <b>date</b> usano i cardinali, tranne il primo giorno del mese: <i>le 15 mai</i>, ma <i>le 1er mai</i>. I secoli sono ordinali: <i>le XXe siècle</i> = <i>le vingtième siècle</i>; i re: <i>Louis XIV</i> = Louis quatorze, ma <i>François Ier</i> = François premier.</p>
<p><b>Frazioni</b>: ½ <i>la moitié</i> o <i>un demi</i> (<i>une demi-heure</i>, ma <i>deux heures et demie</i>), ⅓ <i>un tiers</i>, ¼ <i>un quart</i>, ¾ <i>trois quarts</i>, ⅕ <i>un cinquième</i>, ⅔ <i>deux tiers</i>, 7/10 <i>sept dixièmes</i>.</p>
<p><b>Percentuali</b>: <i>vingt pour cent</i> (20 %), con la virgola decimale: <i>12,5 %</i> = douze virgule cinq pour cent. <i>Le chômage a augmenté de 2 %</i>; <i>plus de la moitié des Français</i>; <i>un tiers des élèves</i>.</p>
<p><b>Mille, million, cent, vingt</b>: <i>mille</i> non prende mai la s (<i>deux mille</i>); <i>million</i> e <i>milliard</i> sono nomi e vogliono il plurale e «de»: <i>deux millions d'habitants</i>, <i>trois milliards d'euros</i>. <i>Cent</i> e <i>vingt</i> prendono la s solo se moltiplicati e non seguiti da altro numero: <i>deux cents</i>, <i>quatre-vingts</i>, ma <i>deux cent trois</i>, <i>quatre-vingt-trois</i>. Separatore delle migliaia: spazio (<i>1 000</i>); decimali con la virgola.</p>
<div class="say"><b>Da ricordare.</b> «Heureusement, tout le monde est arrivé; chacun a pris sa place, et celle de Paul est la meilleure.» (Per fortuna sono arrivati tutti; ciascuno ha preso il suo posto, e quello di Paul è il migliore.)</div>`,
  [
    q(
      'q1',
      'Come si dice «Ho invitato qualche amico»?',
      [
        "J'ai invité quelques amis.",
        "J'ai invité quelque ami.",
        "J'ai invité quelques-un ami.",
        "J'ai invité plusieurs de amis.",
      ],
      0,
      'Quelques è sempre plurale in francese, anche se «qualche» in italiano è singolare. Quelque ami non esiste e plusieurs non vuole de davanti a un nome.',
    ),
    q(
      'q2',
      'Quale frase è corretta?',
      [
        'Chaque étudiant a son livre.',
        'Chaque étudiants ont leurs livres.',
        'Chaques étudiants ont un livre.',
        'Chacun étudiant a son livre.',
      ],
      0,
      'Chaque è invariabile e vuole il singolare, anche se il senso è plurale. Chacun è un pronome e non può precedere un nome.',
    ),
    q(
      'q3',
      'Come si dice «Tutti sono qui» con tous come pronome?',
      ['Ils sont tous là.', 'Ils tous sont là.', 'Tout le monde sont là.', 'Ils sont toutes là.'],
      0,
      'Il pronome tous va dopo il verbo (e si pronuncia con la s). Tout le monde vuole il verbo singolare, quindi la variante con sont è sbagliata.',
    ),
    q(
      'q4',
      "Quale è l'accordo giusto di tout avverbio?",
      ['Elle est toute contente.', 'Elle est tout contente.', 'Elle est tous contente.', 'Elle est toutes contente.'],
      0,
      'Davanti a un aggettivo femminile che comincia per consonante, tout avverbio si accorda. Davanti a vocale (tout étonnée) resta invariabile.',
    ),
    q(
      'q5',
      'Completa: «Mon sac et ___ de Paul sont sur la table.»',
      ['celui', 'ceux', 'ce', 'cela'],
      0,
      'Il sostantivo sac è maschile singolare, quindi celui. Ceux sarebbe plurale; ce e cela non possono sostituire un nome seguito da de.',
    ),
    q(
      'q6',
      'Quale avverbio si forma da «évident»?',
      ['évidemment', 'évidentement', 'évidement', 'évidentment'],
      0,
      'Gli aggettivi in -ent fanno -emment, e si pronuncia [é-vi-da-MÃ]. La forma regolare -entement è errata, e solo lent fa eccezione con lentement.',
    ),
    q(
      'q7',
      "Qual è l'avverbio di «gentil»?",
      ['gentiment', 'gentillement', 'gentilement', 'gentilment'],
      0,
      'Gentil è irregolare: gentiment, senza le due l. Gli altri tre sono tentativi di applicare la regola femminile + ment, che qui non vale.',
    ),
    q(
      'q8',
      'Come si scrive «il 1° maggio» e «il 15 maggio»?',
      [
        'le 1er mai, le 15 mai',
        'le premier mai, le quinzième mai',
        'le 1er mai, le quinzième mai',
        'le un mai, le 15 mai',
      ],
      0,
      "In francese le date usano i cardinali, con l'unica eccezione del primo giorno del mese (1er). Quinzième mai non si dice mai.",
    ),
    q(
      'q9',
      'Come si dice «tre milioni di abitanti»?',
      [
        "trois millions d'habitants",
        "trois million d'habitants",
        'trois millions habitants',
        "trois milles d'habitants",
      ],
      0,
      'Million è un nome e prende il plurale e la preposizione de, come in italiano. Mille invece è invariabile ma non si usa per i milioni.',
    ),
    q(
      'q10',
      "Che cosa significa «Il dit n'importe quoi» ?",
      ['Dice sciocchezze', 'Dice qualcosa di importante', 'Non dice niente', 'Dice tutto quello che sa'],
      0,
      "N'importe quoi significa qualsiasi cosa, e nel parlato indica sciocchezze. Non ha niente a che fare con importante, perché importer qui è un verbo impersonale.",
    ),
  ],
  [
    card('c1', 'quelques', 'Sempre plurale: quelques amis (qualche amico, alcuni amici).'),
    card('c2', 'plusieurs', 'Diversi, parecchi. Invariabile, nessun «de» davanti a un nome.'),
    card('c3', 'chaque / chacun', 'chaque + nome singolare (chaque jour); chacun, pronome (chacun son tour).'),
    card(
      'c4',
      'tout: 4 funzioni',
      "aggettivo (tous les jours), pronome (j'ai tout vu), avverbio (tout petit), nome (le tout).",
    ),
    card('c5', 'tout avverbio', 'Invariabile, tranne davanti a un femminile con consonante: toute contente.'),
    card('c6', "n'importe", "qui, quoi, où, quand, comment, quel: n'importe quoi = sciocchezze."),
    card('c7', 'celui / celle / ceux', 'Mai soli: + de, qui, que, dont, -ci, -là. Celui de Paul, ceux qui partent.'),
    card('c8', 'adverbi in -ment', 'Femminile + ment (lente → lentement); -ant → -amment, -ent → -emment.'),
    card('c9', 'adverbi irregolari', 'gentil → gentiment, bref → brièvement, énorme → énormément, bon → bien.'),
    card('c10', 'ordinali', 'cardinale + ième (quatrième, onzième); cinquième, neuvième, unième; premier, second.'),
    card('c11', 'frazioni', 'la moitié, un tiers, un quart, trois quarts, un cinquième.'),
    card('c12', 'mille / million', "mille invariabile; million, milliard + s e de: deux millions d'euros."),
  ],
  [
    prac(
      'p1',
      'Traduci: «Qualche amico è già arrivato, ma gli altri arrivano più tardi.»',
      'Quelques amis sont déjà arrivés, mais les autres arrivent plus tard. Nota: quelques è plurale, amis plurale, verbo al plurale.',
    ),
    prac(
      'p2',
      'Correggi: «Chaque étudiants ont un livre. Tout le monde sont contents.»',
      "Chaque étudiant a un livre. Tout le monde est content. Nota: chaque + singolare; tout le monde vuole il verbo (e l'aggettivo) al singolare.",
    ),
    prac(
      'p3',
      'Completa con il pronome giusto: «Quelle voiture ? ___ de mon frère.» / «Quels livres ? ___ que tu as lus.»',
      'Celle de mon frère. Ceux que tu as lus. Nota: celle (voiture è femminile), ceux (livres è maschile plurale); mai da soli, vogliono de o un relativo.',
    ),
    prac(
      'p4',
      "Scrivi l'avverbio in -ment: lent, doux, vrai, évident, constant, gentil, énorme, poli.",
      'lentement, doucement, vraiment, évidemment, constamment, gentiment, énormément, poliment. Nota: -ent → -emment, -ant → -amment, vocale + ment, gentil → gentiment.',
    ),
    prac(
      'p5',
      'Traduci: «Elle est tutta contenta, e le sue sorelline sono tutte piccole.»',
      'Elle est toute contente, et ses petites sœurs sont toutes petites. Nota: tout avverbio si accorda davanti a femminile con consonante.',
    ),
    prac(
      'p6',
      'Scrivi in lettere: il XXI secolo; il 3 giugno; Francesco I; la sua quinta lezione.',
      'le vingt et unième siècle (le XXIe siècle); le trois juin; François Ier (François premier); sa cinquième leçon. Nota: date con cardinali, secoli e sovrani come detto.',
    ),
    prac(
      'p7',
      'Traduci: «Il 20 % degli studenti, cioè un quinto, abita a più di due ore di strada.»',
      'Vingt pour cent des étudiants, soit un cinquième, habitent à plus de deux heures de route. Nota: frazione un cinquième; con la percentuale il verbo si mette di solito al plurale.',
    ),
    prac(
      'p8',
      'Traduci: «Puoi telefonare quando vuoi, a chiunque. Ha detto una sciocchezza.»',
      "Tu peux téléphoner n'importe quand, à n'importe qui. Il a dit n'importe quoi. Nota: n'importe + qui/quand/quoi, senza altre preposizioni obbligatorie.",
    ),
    prac(
      'p9',
      "Sistema la posizione dell'avverbio: «Il a compris vraiment» / «Elle a mangé beaucoup».",
      "Il a vraiment compris. Elle a beaucoup mangé. Nota: gli avverbi brevi e di intensità stanno tra l'ausiliare e il participio passato.",
    ),
  ],
)

export const fGeoReggenze = mod(
  'fr-geo-reggenze',
  'Geografia, preposizioni e verbi con preposizione',
  'Paesi, città, regioni, isole, stati USA con à / en / au / aux / de / du; circa 50 verbi con à, de, sur, avec, en e senza preposizione',
  'a2',
  `${PRON_SHORT}
<p class="lead">Due compiti da ripassare insieme perché riguardano le stesse piccole parole: dove vado e da dove vengo (<b>à, en, au, aux, de, du, d', des</b>), e quale preposizione vuole un verbo. In italiano si dice quasi sempre «in» e «a»: il francese sceglie in base al <b>genere</b> del luogo.</p>
<h3>Paesi: en, au, aux</h3>
<table><tr><th>Tipo di paese</th><th>Dove (a / in)</th><th>Da dove</th></tr>
<tr><td>femminile (-e)</td><td>en France, en Italie</td><td>de France</td></tr>
<tr><td>maschile + vocale</td><td>en Iran, en Israël</td><td>d'Iran, d'Israël</td></tr>
<tr><td>maschile + consonante</td><td>au Japon, au Portugal</td><td>du Japon</td></tr>
<tr><td>plurale</td><td>aux États-Unis, aux Pays-Bas</td><td>des États-Unis</td></tr></table>
<ul>
<li>Femminili: <i>la France, l'Italie, l'Espagne, l'Allemagne, la Suisse, la Belgique, l'Angleterre, la Grèce, la Pologne, la Chine, l'Inde, la Russie, la Turquie</i> (tutti con <b>en</b>).</li>
<li>Maschili: <i>le Portugal, le Japon, le Canada, le Brésil, le Maroc, le Liban, le Danemark, le Luxembourg, le Sénégal</i> (con <b>au</b>).</li>
<li><b>Eccezioni</b>: alcuni paesi in -e sono maschili: <i>le Mexique, le Cambodge, le Mozambique, le Zimbabwe</i> → <b>au Mexique</b>, <b>au Cambodge</b>.</li>
<li>Plurali: <i>aux Philippines, aux Émirats arabes unis, aux États-Unis</i> [o-zé-ta-zü-NI].</li>
<li><b>Continenti</b> sempre con en: <i>en Europe, en Asie, en Afrique, en Amérique, en Océanie</i>.</li>
</ul>
<p>Esempi: <i>Je vis en Italie mais je travaille au Luxembourg.</i> / <i>Elle vient du Maroc, il vient d'Algérie.</i> / <i>Nous allons aux États-Unis.</i></p>
<p><b>Trappola</b>: «negli Stati Uniti» = <i>aux États-Unis</i> (o <i>dans</i> con un'indicazione precisa), non «en États-Unis». «In Giappone» = <i>au Japon</i> (<i>en Japon</i> è l'errore più comune di chi pensa all'italiano «in»).</p>
<h3>Città: à e de</h3>
<p>Le città senza articolo vogliono <b>à</b> (dove) e <b>de</b> (da dove): <i>à Paris, à Rome, à Milan, à Lyon</i> [a li-YÕ]; <i>de Paris, de Rome, de Milan</i>. Davanti a vocale <i>d'</i>: <i>d'Amsterdam, d'Édimbourg</i>. Quando l'articolo fa parte del nome, resta: <i>Le Havre → au Havre, du Havre</i>; <i>Le Caire → au Caire, du Caire</i>; <i>La Rochelle → à La Rochelle, de La Rochelle</i>; <i>La Nouvelle-Orléans → à La Nouvelle-Orléans</i>. Città in un paese con articolo non cambiano: <i>à Tokyo, à Montréal</i>.</p>
<h3>Regioni, montagne, isole, stati americani</h3>
<ul>
<li><b>Regioni francesi e italiane</b> femminili con <b>en</b>: <i>en Bretagne, en Normandie, en Provence, en Alsace, en Occitanie, en Toscane, en Lombardie, en Campanie, en Sicile, en Sardaigne, en Ligurie, en Calabre, en Émilie-Romagne</i>. Maschili con <b>dans le / au</b>: <i>au Piémont, dans le Latium, dans le Frioul</i>. Con una zona: <i>dans le Midi, dans le Nord, dans l'Est</i>.</li>
<li><b>Montagne</b>: <i>dans les Alpes, dans les Pyrénées, dans le Jura</i>; ma <i>à la montagne, en montagne</i> (ambiente generale).</li>
<li><b>Isole</b>: le grandi, femminili o che sono paesi, con <b>en</b>: <i>en Corse, en Sicile, en Sardaigne, en Crète, en Islande, en Irlande, en Nouvelle-Zélande</i>. Le isole piccole o senza articolo con <b>à</b>: <i>à Malte, à Chypre, à Cuba, à Madagascar, à Ibiza, à Majorque, à Capri, à Tahiti, à Hawaï</i>. Plurali con <b>aux</b>: <i>aux Baléares, aux Canaries, aux Antilles, aux Maldives, aux Seychelles</i>. Con articolo: <i>à la Martinique, à la Guadeloupe, à la Réunion</i>.</li>
<li><b>Stati USA</b>: femminili con <b>en</b> (<i>en Californie, en Floride, en Louisiane, en Virginie, en Pennsylvanie</i>), maschili con <b>au</b> (<i>au Texas, au Nevada, au Colorado, au Nouveau-Mexique</i>); altrimenti <i>dans l'État de New York</i>. La città si dice <i>à New York</i>.</li>
<li><b>Svizzera, Belgio, Canada</b>: <i>en Suisse, au Tessin, en Valais, dans le canton de Vaud, à Genève</i>; <i>en Belgique, en Wallonie, en Flandre, à Bruxelles</i>; <i>au Québec, en Ontario, à Montréal</i>.</li>
<li><b>Luoghi qualificati</b> prendono <b>dans</b> + articolo o <b>au / à l'</b>: <i>dans le sud de la France</i>, <i>dans l'est de l'Italie</i>, <i>au nord de Rome</i>, <i>dans toute la France</i>, <i>dans la Toscane des années 60</i>. In nome proprio di zona, anche <i>en Italie du Sud</i>.</li>
</ul>
<h3>Verbi con preposizione: tabella pratica</h3>
<p>Il francese non ricalca l'italiano: ci sono verbi con un complemento diretto dove l'italiano ha una preposizione, e viceversa.</p>
<p><b>Verbo + complemento diretto, senza preposizione</b>: <i>chercher</i> (cercare), <i>attendre</i> (aspettare), <i>écouter</i> (ascoltare), <i>regarder</i> (guardare), <i>demander</i> (chiedere qc), <i>payer</i> (pagare qc), <i>habiter</i> (<i>habiter Paris</i> o <i>à Paris</i>), <i>rencontrer</i>, <i>visiter</i>, <i>approuver</i>, <i>espérer</i>. Quindi: <i>J'attends le bus</i> (non «j'attends pour»), <i>Je cherche mes clés</i>, <i>Écoute-moi.</i></p>
<table><tr><th>Verbo</th><th>Con</th><th>Italiano</th></tr>
<tr><td>penser, réfléchir, songer</td><td>à</td><td>pensare, riflettere a</td></tr>
<tr><td>répondre, téléphoner, plaire</td><td>à</td><td>rispondere, telefonare, piacere</td></tr>
<tr><td>ressembler, obéir, sourire</td><td>à</td><td>somigliare, obbedire, sorridere</td></tr>
<tr><td>jouer (sport, gioco)</td><td>à</td><td>giocare a (jouer au foot)</td></tr>
<tr><td>s'intéresser, participer, assister</td><td>à</td><td>interessarsi, partecipare, assistere a</td></tr>
<tr><td>renoncer, tenir, goûter</td><td>à</td><td>rinunciare, tenerci, assaggiare</td></tr>
<tr><td>commencer, continuer, apprendre</td><td>à + inf.</td><td>cominciare a, continuare a, imparare a</td></tr>
<tr><td>réussir, arriver, hésiter</td><td>à + inf.</td><td>riuscire a, arrivare a, esitare a</td></tr>
<tr><td>aider qn, inviter qn, s'habituer</td><td>à + inf.</td><td>aiutare a, invitare a, abituarsi a</td></tr></table>
<table><tr><th>Verbo</th><th>Con</th><th>Italiano</th></tr>
<tr><td>parler, rêver, discuter</td><td>de</td><td>parlare, sognare, discutere di</td></tr>
<tr><td>dépendre, se souvenir, s'occuper</td><td>de</td><td>dipendere, ricordarsi, occuparsi di</td></tr>
<tr><td>avoir besoin / envie / peur</td><td>de</td><td>avere bisogno / voglia / paura di</td></tr>
<tr><td>jouer (strumento)</td><td>de</td><td>suonare (jouer du piano)</td></tr>
<tr><td>se servir, profiter, se méfier</td><td>de</td><td>usare, approfittare, diffidare di</td></tr>
<tr><td>il s'agit, douter, se moquer</td><td>de</td><td>si tratta di, dubitare, prendersi gioco di</td></tr>
<tr><td>décider, essayer, oublier</td><td>de + inf.</td><td>decidere, provare, dimenticare di</td></tr>
<tr><td>finir, arrêter, refuser</td><td>de + inf.</td><td>finire, smettere, rifiutare di</td></tr>
<tr><td>conseiller, permettre, promettre</td><td>à qn de + inf.</td><td>consigliare, permettere, promettere</td></tr></table>
<table><tr><th>Preposizione</th><th>Verbi</th><th>Italiano</th></tr>
<tr><td>sur</td><td>compter, miser, insister, tomber sur</td><td>contare su, puntare, insistere, imbattersi</td></tr>
<tr><td>avec</td><td>se marier, rompre, s'entendre, être d'accord</td><td>sposarsi con, rompere, andare d'accordo</td></tr>
<tr><td>en</td><td>croire, avoir confiance, se transformer, traduire</td><td>credere in, fidarsi, trasformarsi, tradurre in</td></tr>
<tr><td>contre</td><td>voter, lutter, protester</td><td>votare, lottare, protestare contro</td></tr>
<tr><td>pour</td><td>voter, partir, passer pour</td><td>votare per, partire per, passare per</td></tr></table>
<h3>Conseguenze sui pronomi</h3>
<ul>
<li><b>penser à / songer à / faire attention à / renoncer à + persona</b>: non si usa lui ma <i>à + pronome tonico</i>: <i>Je pense à elle.</i> Con una cosa: <i>J'y pense.</i></li>
<li><b>parler de, rêver de, se souvenir de</b> + cosa → <i>en</i>: <i>J'en parle.</i> Con persona: <i>Je parle de lui.</i></li>
<li><b>Verbi con complemento diretto</b>: <i>Je l'attends, je la cherche, je les écoute.</i> (L'italiano dice «aspetto lui», «lo aspetto»; ma «cerco di aiutarlo» è <i>j'essaie de l'aider</i>.)</li>
<li><b>Manquer à</b> rovescia i ruoli: <i>Tu me manques</i> = mi manchi; <i>Je te manque ?</i> = ti manco?</li>
<li><b>Croire à</b> (credere a qualcosa, all'esistenza: <i>croire au Père Noël</i>) vs <b>croire en</b> (aver fiducia, fede: <i>croire en Dieu</i>, <i>croire en toi</i>); <b>penser de</b> solo per l'opinione: <i>Que penses-tu de ce film ?</i></li>
</ul>
<div class="say"><b>Da ricordare.</b> «Je vis en Italie, je viens d'aller aux États-Unis, et j'ai envie de retourner au Japon. J'y pense tous les jours.»</div>`,
  [
    q(
      'q1',
      'Come si dice «Vado in Giappone»?',
      ['Je vais au Japon.', 'Je vais en Japon.', 'Je vais à Japon.', 'Je vais dans Japon.'],
      0,
      'Il Giappone è maschile e comincia per consonante, quindi au. La forma con en vale solo per i paesi femminili o maschili con vocale.',
    ),
    q(
      'q2',
      'Come si dice «Vengo dagli Stati Uniti»?',
      ['Je viens des États-Unis.', 'Je viens du États-Unis.', 'Je viens de États-Unis.', 'Je viens aux États-Unis.'],
      0,
      'Con un nome plurale la preposizione si fonde in des. Du è per i maschili singolari e aux indica il luogo, non la provenienza.',
    ),
    q(
      'q3',
      'Qual è la preposizione giusta per «al Cairo»?',
      ['au Caire', 'à Caire', 'en Caire', 'à le Caire'],
      0,
      "L'articolo fa parte del nome di Le Caire, quindi à + le diventa au. À le non esiste mai in francese, perché la contrazione è obbligatoria.",
    ),
    q(
      'q4',
      'Quale paese in -e è maschile e vuole au?',
      ['le Mexique', 'la Belgique', 'la Suisse', 'la Pologne'],
      0,
      'Le Mexique (come le Cambodge) è maschile nonostante la -e finale e si dice au Mexique. Gli altri tre sono femminili e vogliono en.',
    ),
    q(
      'q5',
      "Come si dice «Aspetto l'autobus»?",
      ["J'attends le bus.", "J'attends pour le bus.", "J'attends après le bus.", "J'attends à le bus."],
      0,
      'Attendre è transitivo e regge il complemento diretto. Attendre après qn esiste solo come forma colloquiale e non è lo standard.',
    ),
    q(
      'q6',
      'Quale frase è corretta?',
      [
        'Je joue au tennis et du piano.',
        'Je joue du tennis et au piano.',
        'Je joue au tennis et au piano.',
        'Je joue le tennis et le piano.',
      ],
      0,
      'Jouer à vale per sport e giochi, jouer de per gli strumenti musicali. Le altre combinazioni invertono o omettono la preposizione.',
    ),
    q(
      'q7',
      'Come si dice «Penso a lei»?',
      ['Je pense à elle.', 'Je lui pense.', "J'y pense à elle.", 'Je pense elle.'],
      0,
      'Penser à con una persona richiede à + pronome tonico; lui e leur non si usano con questo verbo. Y sostituisce solo cose.',
    ),
    q(
      'q8',
      'Che cosa significa «Tu me manques» ?',
      ['Mi manchi', 'Ti manco', 'Mi sbagli', 'Ti manca qualcosa'],
      0,
      'Manquer à ribalta i ruoli: il soggetto è la persona che manca, e me è colui che la sente mancare. Ti manco sarebbe je te manque.',
    ),
    q(
      'q9',
      'Completa: «Elle habite ___ Lyon et travaille ___ Suisse.»',
      ['à / en', 'en / à', 'à / au', 'au / en'],
      0,
      'Le città senza articolo vogliono à, la Suisse è femminile e vuole en. Au sarebbe corretto solo per un paese maschile.',
    ),
    q(
      'q10',
      'Quale combinazione per le isole è giusta?',
      ['en Sicile, à Malte', 'à Sicile, en Malte', 'en Sicile, en Malte', 'à Sicile, à Malte'],
      0,
      'Le isole grandi o regioni femminili vogliono en (Sicile, Corse), le piccole o senza articolo à (Malte, Chypre). Le altre combinazioni mescolano la regola.',
    ),
  ],
  [
    card('c1', 'paese femminile', "en France, en Italie; da: de France, d'Italie."),
    card('c2', 'paese maschile', 'au Japon, au Portugal; da: du Japon, du Portugal.'),
    card('c3', 'paese plurale', 'aux États-Unis, aux Pays-Bas; da: des États-Unis.'),
    card('c4', 'eccezioni maschili in -e', 'au Mexique, au Cambodge, au Mozambique, au Zimbabwe.'),
    card('c5', 'città', 'à Paris, de Paris; con articolo: au Havre, du Caire, à La Rochelle.'),
    card('c6', 'isole', 'grandi: en Corse, en Sicile; piccole: à Malte, à Cuba; plurali: aux Baléares.'),
    card('c7', 'stati USA', "en Californie, en Floride; au Texas, au Nevada; dans l'État de New York."),
    card(
      'c8',
      'verbi senza preposizione',
      'chercher, attendre, écouter, regarder, demander, payer + complemento diretto.',
    ),
    card('c9', 'jouer à / jouer de', 'jouer au foot (gioco), jouer du piano (strumento).'),
    card('c10', 'penser à + persona', "à + tonico: je pense à elle; con una cosa: j'y pense."),
    card('c11', 'parler de + cosa', "pronome en: j'en parle; con persona: je parle de lui."),
    card('c12', 'manquer à', 'Tu me manques = mi manchi (ruoli rovesciati).'),
  ],
  [
    prac(
      'p1',
      'Completa con la preposizione: «Il vit ___ Pays-Bas, elle est ___ Portugal, nous allons ___ Allemagne.»',
      'Il vit aux Pays-Bas, elle est au Portugal, nous allons en Allemagne. Nota: plurale = aux, maschile consonante = au, femminile = en.',
    ),
    prac(
      'p2',
      "Traduci: «Viene dal Marocco, lei dall'Iran, loro dagli Stati Uniti.»",
      "Il vient du Maroc, elle vient d'Iran, ils viennent des États-Unis. Nota: du (maschile consonante), d' (vocale), des (plurale).",
    ),
    prac(
      'p3',
      'Traduci: «Passo le vacanze in Sicilia, a Malta e in Provenza.»',
      'Je passe mes vacances en Sicile, à Malte et en Provence. Nota: isola grande e regione femminile con en, isola piccola con à.',
    ),
    prac(
      'p4',
      'Correggi: «Je vais en Japon et aux Italie. Elle habite à États-Unis.»',
      'Je vais au Japon et en Italie. Elle habite aux États-Unis. Nota: Japon è maschile (au), Italie femminile (en), États-Unis plurale (aux).',
    ),
    prac(
      'p5',
      'Traduci: «Aspetto i miei amici e cerco il mio telefono.»',
      "J'attends mes amis et je cherche mon téléphone. Nota: attendre e chercher reggono il complemento diretto, senza preposizione.",
    ),
    prac(
      'p6',
      'Rispondi con un pronome: «Tu penses à ton frère ? / Tu penses à tes examens ? / Tu parles de ton voyage ?»',
      "Oui, je pense à lui. Oui, j'y pense. Oui, j'en parle. Nota: à + persona = à lui; à + cosa = y; de + cosa = en.",
    ),
    prac(
      'p7',
      'Completa: «Je joue ___ football et ___ guitare ; je rêve ___ voyager ___ Cuba.»',
      'Je joue au football et de la guitare; je rêve de voyager à Cuba. Nota: jouer à (sport), jouer de (strumento), rêver de + inf., à Cuba (isola).',
    ),
    prac(
      'p8',
      'Traduci: «Smetto di fumare. Ho deciso di non rinunciare a questo viaggio.»',
      "J'arrête de fumer. J'ai décidé de ne pas renoncer à ce voyage. Nota: arrêter de + inf., décider de, renoncer à; la negazione dell'infinito si mette prima: ne pas renoncer.",
    ),
    prac(
      'p9',
      'Scrivi 3 frasi sul tuo viaggio ideale con a, en, au, aux e dans.',
      "Esempio: Je voudrais aller au Canada, en Islande et aux Antilles. J'irais dans les Alpes en hiver et à New York au printemps. Nota: controlla genere e numero di ogni luogo.",
    ),
  ],
)
