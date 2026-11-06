import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './francese.b.pron'

// FRENCH course part C, modules 3-5:
// fr-irreguliers (a2), fr-genre-pronom (a2), fr-negation2 (b1).

export const fIrreguliers = mod(
  'fr-irreguliers',
  'Altri verbi irregolari al presente',
  'écrire, vivre, croire, suivre, connaître, boire, recevoir, ouvrir, courir, partir, sortir, dormir: presente, participio e trappole',
  'a2',
  `${PRON_SHORT}
<p class="lead">Dopo être, avoir, aller, faire e i verbi del primo corso restano una dozzina di irregolari che si incontrano ogni giorno. Non vanno imparati a caso: sono <b>famiglie</b> con lo stesso schema, e ogni famiglia ha una radice per il singolare e una per il plurale.</p>
<h3>Famiglia 1: écrire, vivre, croire</h3>
<table><tr><th>Persona</th><th>écrire</th><th>vivre</th><th>croire</th></tr>
<tr><td>je</td><td>écris</td><td>vis</td><td>crois</td></tr>
<tr><td>tu</td><td>écris</td><td>vis</td><td>crois</td></tr>
<tr><td>il / elle</td><td>écrit</td><td>vit</td><td>croit</td></tr>
<tr><td>nous</td><td>écrivons</td><td>vivons</td><td>croyons</td></tr>
<tr><td>vous</td><td>écrivez</td><td>vivez</td><td>croyez</td></tr>
<tr><td>ils / elles</td><td>écrivent</td><td>vivent</td><td>croient</td></tr>
<tr><td>participio</td><td>écrit</td><td>vécu</td><td>cru</td></tr></table>
<p>Pronuncia: j'écris [zhé-KRI], nous écrivons [nu-zé-kri-VÕ], ils écrivent [il-zé-KRIV] (la v si sente, la -ent finale no), il vit [il VI], vécu [vé-KÜ], je crois [zhë KRUA], nous croyons [nu krua-YÕ], ils croient [il KRUA].</p>
<p><b>Trappole</b>: «scrivere a qualcuno» = <i>écrire à quelqu'un</i> (<i>Je t'écris</i>, <i>Elle m'a écrit</i>). <b>Vivre</b> è «vivere» (<i>Il vit à Lyon</i> è corretto ma <i>habiter</i> è più naturale per «abitare»). Dopo <b>croire que</b> affermativo si usa l'indicativo: <i>Je crois qu'il vient</i>; al negativo o interrogativo spesso il congiuntivo (<i>Je ne crois pas qu'il vienne</i>). Croire à (credere all'esistenza) e croire en (avere fiducia): vedi il modulo sulle preposizioni.</p>
<h3>Famiglia 2: suivre, connaître, boire</h3>
<table><tr><th>Persona</th><th>suivre</th><th>connaître</th><th>boire</th></tr>
<tr><td>je</td><td>suis</td><td>connais</td><td>bois</td></tr>
<tr><td>tu</td><td>suis</td><td>connais</td><td>bois</td></tr>
<tr><td>il / elle</td><td>suit</td><td>connaît</td><td>boit</td></tr>
<tr><td>nous</td><td>suivons</td><td>connaissons</td><td>buvons</td></tr>
<tr><td>vous</td><td>suivez</td><td>connaissez</td><td>buvez</td></tr>
<tr><td>ils / elles</td><td>suivent</td><td>connaissent</td><td>boivent</td></tr>
<tr><td>participio</td><td>suivi</td><td>connu</td><td>bu</td></tr></table>
<ul>
<li><b>Je suis</b> vale sia «io sono» (être) sia «io seguo» (suivre): lo chiarisce il contesto. <i>Je suis un cours de français</i> = seguo un corso; <i>Je suis italien</i> = sono italiano.</li>
<li><b>Connaître</b> (conoscere persone, luoghi) vs <b>savoir</b> (sapere un fatto, saper fare): <i>Je connais Paul</i>, <i>Je sais nager</i>. Accento circonflesso solo a <i>il connaît</i> e all'infinito. Stessa famiglia: <i>reconnaître</i> (riconoscere), <i>paraître</i> (parere; paru), <i>disparaître</i>, <i>apparaître</i>.</li>
<li><b>Boire</b>: cambia radice al plurale (buvons, buvez, boivent). Pronuncia: ils boivent [il BUAV], nous buvons [nu bü-VÕ].</li>
<li><b>Suivre un cours</b> = seguire un corso; <i>suivre un régime</i> = seguire una dieta; «seguire» una persona = <i>suivre qn</i> (anche in senso di «tenere dietro»).</li>
</ul>
<h3>Famiglia 3: recevoir, ouvrir, courir</h3>
<table><tr><th>Persona</th><th>recevoir</th><th>ouvrir</th><th>courir</th></tr>
<tr><td>je</td><td>reçois</td><td>ouvre</td><td>cours</td></tr>
<tr><td>tu</td><td>reçois</td><td>ouvres</td><td>cours</td></tr>
<tr><td>il / elle</td><td>reçoit</td><td>ouvre</td><td>court</td></tr>
<tr><td>nous</td><td>recevons</td><td>ouvrons</td><td>courons</td></tr>
<tr><td>vous</td><td>recevez</td><td>ouvrez</td><td>courez</td></tr>
<tr><td>ils / elles</td><td>reçoivent</td><td>ouvrent</td><td>courent</td></tr>
<tr><td>participio</td><td>reçu</td><td>ouvert</td><td>couru</td></tr></table>
<ul>
<li><b>Recevoir</b>: la cediglia (ç) appare davanti a o e u e non davanti a e: <i>reçois, reçoit, reçoivent, reçu</i> ma <i>recevons, recevez</i>. Come lui: <i>apercevoir</i> (accorgersi; aperçu), <i>décevoir</i> (deludere; déçu), <i>concevoir</i>. <i>Recevoir</i> vale anche «ospitare, ricevere ospiti»: <i>Nous recevons des amis ce soir.</i></li>
<li><b>Ouvrir</b> si coniuga come un verbo in -er al presente (j'ouvre, tu ouvres). Stessa famiglia: <i>couvrir</i> (couvert), <i>offrir</i> (offert), <i>souffrir</i> (souffert), <i>découvrir</i> (découvert). Errore comune: «j'ouvris» (è un passato remoto) o «ouvri» al posto di <i>ouvert</i>.</li>
<li><b>Courir</b>: doppia r nel futuro (<i>je courrai</i>), non nel presente.</li>
</ul>
<h3>Famiglia 4: partir, sortir, dormir</h3>
<table><tr><th>Persona</th><th>partir</th><th>sortir</th><th>dormir</th></tr>
<tr><td>je</td><td>pars</td><td>sors</td><td>dors</td></tr>
<tr><td>tu</td><td>pars</td><td>sors</td><td>dors</td></tr>
<tr><td>il / elle</td><td>part</td><td>sort</td><td>dort</td></tr>
<tr><td>nous</td><td>partons</td><td>sortons</td><td>dormons</td></tr>
<tr><td>vous</td><td>partez</td><td>sortez</td><td>dormez</td></tr>
<tr><td>ils / elles</td><td>partent</td><td>sortent</td><td>dorment</td></tr></table>
<p>Schema: al singolare cade la consonante finale della radice (par-t-ir → <i>je pars</i>, <i>il part</i>), al plurale la radice è intera (<i>partons</i>). Stessa famiglia: <i>servir</i> (<i>je sers</i>), <i>sentir</i> (<i>je sens</i>), <i>mentir</i> (<i>je mens</i>), <i>s'endormir</i>. Pronuncia: je pars / nous partons [zhë PAR / nu par-TÕ]; il part [il PAR]; tu dors [tü DÒR]; ils dorment [il DÒRM].</p>
<p>Passé composé: <i>partir</i> con <b>être</b> (<i>Il est parti</i>); <i>sortir</i> con être se intransitivo (<i>Elle est sortie</i>), con avoir se transitivo (<i>Elle a sorti le chien</i>); <i>dormir</i> con avoir (<i>J'ai dormi</i>).</p>
<h3>Perché conviene imparare la radice del plurale</h3>
<p>La radice di <b>nous</b> dà l'imparfait: <i>nous écrivons → j'écrivais</i>, <i>nous buvons → je buvais</i>, <i>nous connaissons → je connaissais</i>, <i>nous recevons → je recevais</i>, <i>nous croyons → je croyais</i> (con -yions: <i>nous croyions</i>). Attenzione: <b>il faut qu'ils boivent</b> (congiuntivo) conserva la radice del plurale di 3ª persona.</p>
<div class="say"><b>Da ricordare.</b> «Je vis à Rome, j'écris souvent à mes amis, je connais bien Paris et je reçois des invités; le soir, je bois un thé et je dors bien.»</div>`,
  [
    q(
      'q1',
      'Qual è la forma corretta di «écrire» alla 1ª persona plurale?',
      ['nous écrivons', 'nous écrisons', 'nous écrissons', 'nous écrisez'],
      0,
      'La radice del plurale di écrire è écriv-, come in écrivez e écrivent. Il singolare ha una s sola, ma la s non passa al plurale.',
    ),
    q(
      'q2',
      'Che cosa può significare «Je suis un cours de français» ?',
      [
        'Seguo un corso di francese',
        'Sono un corso di francese',
        'Inseguo un corso di francese',
        'Ero un corso di francese',
      ],
      0,
      'Je suis è identico per être e suivre, ma un corso non si può «essere»: il contesto indica suivre. Inseguire sarebbe poursuivre.',
    ),
    q(
      'q3',
      'Qual è il participio passato di «ouvrir»?',
      ['ouvert', 'ouvri', 'ouvré', 'ouvrit'],
      0,
      'Ouvrir è irregolare: participio in -ert come offrir (offert), couvrir, souffrir. Ouvri è una forma regolare ipotetica, mai usata.',
    ),
    q(
      'q4',
      'Come si dice «Loro bevono il caffè»?',
      ['Ils boivent du café.', 'Ils buvent du café.', 'Ils boient du café.', 'Ils boivent le café.'],
      0,
      'Boire fa boivent alla 3ª plurale e buvons/buvez alla 1ª/2ª plurale. Il partitivo du si usa perché si parla di una quantità, non di un caffè specifico.',
    ),
    q(
      'q5',
      'Quale frase è corretta?',
      ['Je ne connais pas ce film.', 'Je ne sais pas ce film.', 'Je ne connais pas nager.', 'Je ne sais pas Paul.'],
      0,
      "Connaître regge persone e cose conosciute, savoir fatti e saper fare con l'infinito. Je sais nager, ma non je connais nager.",
    ),
    q(
      'q6',
      'Come si scrive «ricevo» e «riceviamo»?',
      ['je reçois, nous recevons', 'je recois, nous recevons', 'je reçois, nous reçevons', 'je recoit, nous recevons'],
      0,
      'La cediglia (ç) serve davanti a o e u per mantenere il suono /s/ e non compare davanti a e. Quindi reçois ma recevons.',
    ),
    q(
      'q7',
      'Come si coniuga «partir» alla 3ª persona singolare?',
      ['il part', 'il parte', 'il partit', 'il pars'],
      0,
      'La 3ª persona di partir perde la -ir e la t finale della radice resta scritta: il part, senza la -e dei verbi in -er. Il pars è la 1ª e 2ª persona.',
    ),
    q(
      'q8',
      "Qual è l'imparfait di «boire» alla 1ª persona singolare?",
      ['je buvais', 'je boivais', 'je boirais', 'je buvrai'],
      0,
      "L'imparfait parte dalla radice di nous: nous buvons, quindi je buvais. Je boirais è il condizionale e je buvrai non esiste.",
    ),
    q(
      'q9',
      'Quale verbo si coniuga come ouvrir al presente (je ___ )?',
      ["j'offre", "j'offris", 'je offre', "j'offrons"],
      0,
      "Offrir segue ouvrir: j'offre, tu offres, con le desinenze dei verbi in -er e con l'elisione. Je offre senza apostrofo è un errore.",
    ),
    q(
      'q10',
      'Come si dice «Ci ha scritto ieri»?',
      ['Il nous a écrit hier.', 'Il nous a écrire hier.', 'Il nous a écrit à hier.', 'Il nous écrivait hier.'],
      0,
      "Il participio passato di écrire è écrit, e nous è COI senza preposizione. L'infinito écrire dopo l'ausiliare non è mai corretto.",
    ),
  ],
  [
    card('c1', 'écrire', "j'écris, nous écrivons, ils écrivent; pp écrit [zhé-KRI]."),
    card('c2', 'vivre', 'je vis, nous vivons, ils vivent; pp vécu [vé-KÜ].'),
    card('c3', 'croire', 'je crois, nous croyons, ils croient; pp cru.'),
    card('c4', 'suivre', 'je suis (!), nous suivons; pp suivi. Suis = être o suivre.'),
    card('c5', 'connaître', 'je connais, il connaît, nous connaissons; pp connu.'),
    card('c6', 'boire', 'je bois, nous buvons, ils boivent; pp bu.'),
    card('c7', 'recevoir', 'je reçois, nous recevons, ils reçoivent; pp reçu.'),
    card('c8', 'ouvrir', "j'ouvre, tu ouvres (come un -er); pp ouvert; stessa famiglia: offrir, couvrir, souffrir."),
    card('c9', 'courir', 'je cours, nous courons; pp couru; futuro je courrai.'),
    card('c10', 'partir / sortir / dormir', 'je pars, je sors, je dors; il part, il sort, il dort.'),
    card('c11', 'imparfait irregolari', "radice di nous: nous buvons → je buvais, nous écrivons → j'écrivais."),
    card('c12', 'ç', 'ç davanti a o, u: reçois, reçu; non davanti a e: recevons.'),
  ],
  [
    prac(
      'p1',
      'Coniuga al presente: «écrire», «boire», «connaître» con je, nous e ils.',
      "écrire: j'écris, nous écrivons, ils écrivent; boire: je bois, nous buvons, ils boivent; connaître: je connais, nous connaissons, ils connaissent. Nota: radice diversa al plurale.",
    ),
    prac(
      'p2',
      'Traduci: «Seguo un corso di cucina, scrivo molto e leggo ogni sera.»',
      "Je suis un cours de cuisine, j'écris beaucoup et je lis tous les soirs. Nota: je suis = seguo (suivre); lire: je lis.",
    ),
    prac(
      'p3',
      'Traduci: «Non conosco questa città. Sai dove abita?»',
      'Je ne connais pas cette ville. Tu sais où il habite ? Nota: connaître per un luogo, savoir + domanda indiretta.',
    ),
    prac(
      'p4',
      'Correggi: «Je recois un cadeau. Il ouvri la porte. Ils boient du vin.»',
      'Je reçois un cadeau. Il ouvre la porte. Ils boivent du vin. Nota: cediglia davanti a o, ouvre al presente, boivent alla 3ª plurale.',
    ),
    prac(
      'p5',
      'Scrivi al passé composé: «je dors», «il sort (intransitivo)», «nous partons», «elle ouvre».',
      "j'ai dormi, il est sorti, nous sommes partis, elle a ouvert. Nota: partir e sortir (intransitivo) con être, dormir e ouvrir con avoir.",
    ),
    prac(
      'p6',
      'Traduci: «Credo che sia vero, ma non credo che venga.»',
      "Je crois que c'est vrai, mais je ne crois pas qu'il vienne. Nota: croire que affermativo + indicativo, negativo + congiuntivo.",
    ),
    prac(
      'p7',
      "Dai l'imparfait di «je bois», «j'écris» e «je connais» (1ª persona).",
      "je buvais, j'écrivais, je connaissais. Nota: radici buv-, écriv-, connaiss- (dal plurale nous).",
    ),
    prac(
      'p8',
      'Traduci: «Riceviamo ospiti sabato; offro io da bere.»',
      "Nous recevons des invités samedi; c'est moi qui offre à boire. Nota: recevoir des invités, offrir come ouvrir (j'offre).",
    ),
    prac(
      'p9',
      'Trova la forma sbagliata: «je pars, tu dors, il sorte, nous servons».',
      'Sbagliata: il sorte → il sort. Nota: sortir fa il sort, e non ha la -e dei verbi in -er.',
    ),
  ],
)

export const fGenrePronom = mod(
  'fr-genre-pronom',
  'Femminile, plurale e verbi pronominali',
  "Come si forma il femminile e il plurale (aggettivi e nomi), generi diversi dall'italiano, pronominali riflessivi, reciproci, idiomatici e accordo del participio",
  'a2',
  `${PRON_SHORT}
<p class="lead">Due punti dove il francese costringe a imparare le eccezioni insieme alla regola: la <b>formazione del femminile e del plurale</b> e i <b>verbi pronominali</b> (se lever, se souvenir) con l'accordo del participio passato.</p>
<h3>Il femminile degli aggettivi e dei nomi</h3>
<table><tr><th>Finale</th><th>Femminile</th><th>Esempio</th></tr>
<tr><td>(regola) + e</td><td>-e</td><td>petit → petite, grand → grande</td></tr>
<tr><td>-er</td><td>-ère</td><td>cher → chère, premier → première</td></tr>
<tr><td>-eur</td><td>-euse</td><td>menteur → menteuse, vendeur → vendeuse</td></tr>
<tr><td>-teur</td><td>-trice</td><td>acteur → actrice, directeur → directrice</td></tr>
<tr><td>-if</td><td>-ive</td><td>actif → active, sportif → sportive</td></tr>
<tr><td>-x</td><td>-se</td><td>heureux → heureuse, jaloux → jalouse</td></tr>
<tr><td>-on</td><td>-onne</td><td>bon → bonne, lion → lionne</td></tr>
<tr><td>-en</td><td>-enne</td><td>italien → italienne, ancien → ancienne</td></tr>
<tr><td>-el</td><td>-elle</td><td>actuel → actuelle, naturel → naturelle</td></tr>
<tr><td>-et</td><td>-ette (ma -ète)</td><td>muet → muette; complet → complète, secret → secrète</td></tr>
<tr><td>-c</td><td>-che / -que</td><td>blanc → blanche; public → publique, grec → grecque</td></tr>
<tr><td>-eau</td><td>-elle</td><td>beau → belle, nouveau → nouvelle</td></tr></table>
<ul>
<li><b>Irregolari da sapere a memoria</b>: <i>doux → douce</i>, <i>faux → fausse</i>, <i>roux → rousse</i>, <i>vieux → vieille</i>, <i>long → longue</i>, <i>gentil → gentille</i>, <i>gros → grosse</i>, <i>gras → grasse</i>, <i>frais → fraîche</i>, <i>sec → sèche</i>, <i>fou → folle</i>, <i>mou → molle</i>.</li>
<li><b>Nomi di persona e animali</b>: <i>ami → amie</i>, <i>cousin → cousine</i>, <i>chat → chatte</i>, <i>chien → chienne</i>, <i>roi → reine</i>, <i>héros → héroïne</i>, <i>dieu → déesse</i>. Diversi del tutto: <i>frère / sœur</i>, <i>père / mère</i>, <i>oncle / tante</i>, <i>homme / femme</i>.</li>
<li><b>Stessa forma per i due generi</b>: <i>un / une élève, artiste, journaliste, collègue, enfant, touriste, locataire, secrétaire</i> (cambia solo l'articolo). Le professioni al femminile sono oggi normali: <i>une professeure, une ingénieure, une autrice</i>, ma l'uso varia.</li>
</ul>
<p>La pronuncia cambia: la consonante finale, muta al maschile, si sente al femminile. Es.: <i>petit</i> [pë-TI] / <i>petite</i> [pë-TIT]; <i>grand</i> [GRÃ] / <i>grande</i> [GRÃD]; <i>français</i> [frã-SÈ] / <i>française</i> [frã-SÈZ]; <i>bon</i> [BÕ] / <i>bonne</i> [BÒN] (perdendo la nasale!).</p>
<h3>Il plurale</h3>
<ul>
<li>Regola: <b>+ s</b> (muta). Invariabili con -s, -x, -z: <i>un fils → des fils</i>, <i>le prix → les prix</i>, <i>le nez → les nez</i>.</li>
<li><b>-eau, -eu, -au → + x</b>: <i>bateau → bateaux</i>, <i>cheveu → cheveux</i>, <i>tuyau → tuyaux</i>. Eccezioni con s: <i>bleu → bleus</i>, <i>pneu → pneus</i>, <i>landau → landaus</i>.</li>
<li><b>-al → -aux</b>: <i>journal → journaux</i>, <i>cheval → chevaux</i>, <i>animal → animaux</i>. Eccezioni: <i>bal, festival, carnaval, récital</i> prendono -s.</li>
<li><b>-ail</b>: di solito -s (<i>détail → détails</i>), ma <i>travail → travaux</i>, <i>vitrail → vitraux</i>, <i>corail → coraux</i>.</li>
<li><b>-ou</b>: -s (<i>trou → trous</i>), tranne sette in -x: <i>bijou, caillou, chou, genou, hibou, joujou, pou</i>.</li>
<li>Irregolari: <i>œil → yeux</i>, <i>ciel → cieux</i>, <i>monsieur → messieurs</i>, <i>madame → mesdames</i>, <i>mademoiselle → mesdemoiselles</i>.</li>
</ul>
<h3>Generi diversi dall'italiano e coppie con senso diverso</h3>
<ul>
<li>Maschili in italiano, femminili in francese: <i>la fleur</i> (il fiore), <i>la dent</i> (il dente), <i>la mer</i> (il mare), <i>la couleur</i> (il colore), <i>la douleur</i> (il dolore), <i>l'odeur</i> (l'odore), <i>la chaleur</i> (il calore).</li>
<li>Femminili in italiano, maschili in francese: <i>le soir</i> (la sera), <i>le nuage</i> (la nuvola), <i>le choix</i> (la scelta), <i>le réseau</i> (la rete).</li>
<li>Cambiano senso: <i>le tour</i> (giro) / <i>la tour</i> (torre); <i>le mode</i> (modo) / <i>la mode</i> (moda); <i>le poêle</i> (stufa) / <i>la poêle</i> (padella); <i>le voile</i> (velo) / <i>la voile</i> (vela); <i>le mémoire</i> (tesi) / <i>la mémoire</i> (memoria); <i>le critique</i> (il critico) / <i>la critique</i> (la critica); <i>le livre</i> (libro) / <i>la livre</i> (sterlina).</li>
</ul>
<h3>Verbi pronominali: quattro tipi</h3>
<table><tr><th>Tipo</th><th>Esempio</th><th>Italiano</th></tr>
<tr><td>riflessivo</td><td>Je me lave</td><td>Mi lavo</td></tr>
<tr><td>reciproco</td><td>Ils se téléphonent</td><td>Si telefonano</td></tr>
<tr><td>idiomatico</td><td>Je me souviens de lui</td><td>Mi ricordo di lui</td></tr>
<tr><td>passivo-impersonale</td><td>Ça se mange froid</td><td>Si mangia freddo</td></tr></table>
<p>Presente di <b>se lever</b>: <i>je me lève</i> [zhë më LÈV], <i>tu te lèves</i>, <i>il se lève</i>, <i>nous nous levons</i> [nu nu lë-VÕ], <i>vous vous levez</i>, <i>ils se lèvent</i>. L'accento grave compare nelle forme in cui la sillaba seguente è muta (singolare e 3ª plurale). Davanti a vocale: <i>je m'habille</i>, <i>il s'appelle</i> (se doppia la l: <i>je m'appelle</i> [zhë ma-PÈL]).</p>
<p><b>Verbi idiomatici da sapere</b>: <i>se souvenir de</i> (ricordarsi di), <i>se rappeler qc</i> (<i>Je me rappelle ce jour</i>: senza de!), <i>s'asseoir</i> (<i>je m'assieds</i> o <i>je m'assois</i>, <i>ils s'asseyent</i>), <i>s'en aller</i> (andarsene), <i>se mettre à</i>, <i>s'apercevoir de</i>, <i>se rendre compte de</i>, <i>se plaindre de</i>, <i>se douter de</i>, <i>se taire</i>, <i>s'évanouir</i>, <i>se moquer de</i>, <i>s'agir de</i>.</p>
<p><b>Forme negativa, interrogativa, imperativo, infinito</b>: <i>Je ne me lève pas tôt</i>; <i>Est-ce que tu te lèves tôt ?</i> (o <i>Te lèves-tu ?</i>); <i>Lève-toi !</i> / <i>Ne te lève pas !</i> / <i>Levons-nous !</i>; all'infinito il pronome si accorda col soggetto: <i>Je vais me coucher</i>, <i>Tu vas te coucher</i>, <i>Nous allons nous coucher</i>.</p>
<h3>Passé composé e accordo del participio</h3>
<p>Tutti i pronominali usano <b>être</b>. Il participio si accorda con il pronome riflessivo se questo è <b>COD</b>; non si accorda se il pronome è <b>COI</b> o c'è un COD dopo il verbo.</p>
<ul>
<li><i>Elle s'est lavée</i> (se = COD). Ma <i>Elle s'est lavé les mains</i> (COD = les mains, dopo il verbo: nessun accordo).</li>
<li><i>Elles se sont vues</i> (voir qn: COD). Ma <i>Elles se sont téléphoné</i>, <i>Ils se sont parlé</i>, <i>Elles se sont souri</i>, <i>Ils se sont écrit</i> (verbi con à: se è COI, nessun accordo).</li>
<li><i>Elle s'est souvenue de tout</i>, <i>Ils se sont aperçus de l'erreur</i>, <i>Elles se sont tues</i>: nei verbi puramente pronominali l'accordo è col soggetto. Eccezione: <i>Elle s'est rendu compte</i> (invariabile).</li>
</ul>
<p><b>Trappola</b>: con le parti del corpo il francese usa l'articolo, non il possessivo: <i>Je me lave les mains</i> (non «mes mains»), <i>Elle s'est cassé la jambe</i>.</p>
<div class="say"><b>Da ricordare.</b> «Je me lève à sept heures, je m'habille, et je me rappelle toujours ce jour-là. Hier, elle s'est levée tôt et s'est lavé les mains.»</div>`,
  [
    q(
      'q1',
      'Qual è il femminile di «acteur»?',
      ['actrice', 'acteuse', 'acteure', 'actrise'],
      0,
      'I nomi in -teur formano il femminile in -trice (acteur, directeur, lecteur). Acteuse segue la regola di vendeur e menteur ma non è corretto.',
    ),
    q(
      'q2',
      'Qual è il femminile di «heureux»?',
      ['heureuse', 'heureuxe', 'heureuze', 'heureusse'],
      0,
      'Gli aggettivi in -x fanno -se (heureuse, jaloux/jalouse). Con -ss- si scrivono invece faux/fausse e roux/rousse, che sono eccezioni.',
    ),
    q(
      'q3',
      'Qual è il plurale di «cheval» e di «festival»?',
      ['chevaux, festivals', 'chevaux, festivaux', 'chevals, festivals', 'chevals, festivaux'],
      0,
      'Cheval fa chevaux come la maggioranza dei nomi in -al, mentre festival, bal e carnaval prendono la s. Sono eccezioni da memorizzare.',
    ),
    q(
      'q4',
      'Quale parola è femminile in francese?',
      ['la dent', 'le dent', 'le soir', 'le sang'],
      0,
      "Dent è femminile (la dent), mentre soir e sang sono maschili. In italiano «il dente» è maschile: attenzione all'interferenza.",
    ),
    q(
      'q5',
      'Come si dice «Mi ricordo di quel giorno»?',
      [
        'Je me souviens de ce jour.',
        'Je me souviens ce jour.',
        'Je me rappelle de de ce jour.',
        'Je souviens de ce jour.',
      ],
      0,
      'Se souvenir vuole de; se rappeler si costruisce senza de (je me rappelle ce jour). Il pronome me è obbligatorio in entrambi i verbi.',
    ),
    q(
      'q6',
      "Come si dice «Andiamo a letto» con il verbo all'infinito?",
      ['Nous allons nous coucher.', 'Nous allons se coucher.', 'Nous allons coucher.', 'Nous nous allons coucher.'],
      0,
      "All'infinito il pronome riflessivo si accorda con il soggetto: nous allons nous coucher. Se coucher invariato è un calco dell'infinito del dizionario.",
    ),
    q(
      'q7',
      'Quale frase è corretta?',
      ['Elles se sont téléphoné.', 'Elles se sont téléphonées.', 'Elles se sont téléphoner.', 'Elles sont téléphoné.'],
      0,
      "Téléphoner si costruisce con à, quindi se è COI e il participio resta invariato. L'accordo si fa solo col pronome COD.",
    ),
    q(
      'q8',
      'Quale frase è corretta?',
      [
        "Elle s'est lavé les mains.",
        "Elle s'est lavée les mains.",
        "Elle s'est lavés les mains.",
        'Elle est lavé les mains.',
      ],
      0,
      "Il COD è les mains, dopo il verbo: il participio non si accorda con il pronome. Elle s'est lavée senza altro complemento sarebbe invece giusto.",
    ),
    q(
      'q9',
      'Qual è il plurale di «bijou»?',
      ['bijoux', 'bijous', 'bijouxs', 'bijoues'],
      0,
      'Bijou è una delle sette eccezioni in -ou che fanno -x (bijou, caillou, chou, genou, hibou, joujou, pou). Gli altri nomi in -ou fanno -s.',
    ),
    q(
      'q10',
      "Che differenza c'è tra «le tour» e «la tour»?",
      ['il giro e la torre', 'la torre e il giro', 'la moda e il modo', 'il velo e la vela'],
      0,
      'Le tour è il giro (il tour de France), la tour è la torre (la tour Eiffel). Hanno lo stesso suono ma genere e senso diversi.',
    ),
  ],
  [
    card('c1', '-eur / -teur', 'vendeur → vendeuse; acteur → actrice.'),
    card('c2', '-er / -if / -x', 'cher → chère; actif → active; heureux → heureuse.'),
    card('c3', '-on / -en / -el', 'bon → bonne; italien → italienne; actuel → actuelle.'),
    card('c4', 'femminili irregolari', 'doux → douce, faux → fausse, vieux → vieille, long → longue, fou → folle.'),
    card('c5', '-eau → -x', 'bateau → bateaux, cheveu → cheveux; eccezioni: bleus, pneus.'),
    card('c6', '-al → -aux', 'journal → journaux; eccezioni: bals, festivals, carnavals.'),
    card('c7', '-ou: 7 in -x', 'bijou, caillou, chou, genou, hibou, joujou, pou.'),
    card('c8', 'plurale irregolare', 'œil → yeux, ciel → cieux, monsieur → messieurs.'),
    card('c9', 'genere diverso', 'la dent, la fleur, la mer, la voix, la soif; le sang, le lait, le miel.'),
    card('c10', 'coppie', 'le tour/la tour, le mode/la mode, le poêle/la poêle, le livre/la livre.'),
    card(
      'c11',
      'accordo pronominali',
      "Accordo con se se è COD (elle s'est lavée); nessun accordo con COI o COD dopo (s'est lavé les mains).",
    ),
    card('c12', 'se souvenir / se rappeler', 'se souvenir DE qn/qc; se rappeler qc (senza de).'),
  ],
  [
    prac(
      'p1',
      'Scrivi il femminile: «un acteur italien», «un vendeur très gentil», «un chien blanc», «un ami heureux».',
      'une actrice italienne, une vendeuse très gentille, une chienne blanche, une amie heureuse. Nota: -teur → -trice, -eur → -euse, -en → -enne, -c → -che.',
    ),
    prac(
      'p2',
      'Metti al plurale: «un journal national», «un cheval blanc», «un bijou», «un festival».',
      'des journaux nationaux, des chevaux blancs, des bijoux, des festivals. Nota: -al → -aux; festival prende -s; bijou fa -x.',
    ),
    prac(
      'p3',
      'Traduci: «Mi sveglio alle sette, mi lavo i denti e mi vesto.»',
      "Je me réveille à sept heures, je me lave les dents et je m'habille. Nota: articolo con parti del corpo; elisione m'.",
    ),
    prac(
      'p4',
      "Coniuga al presente: «s'asseoir» e «se lever» (nous, ils).",
      "nous nous asseyons, ils s'asseyent; nous nous levons, ils se lèvent. Nota: lèvent con accento grave, asseyent con y.",
    ),
    prac(
      'p5',
      'Traduci: «Si sono conosciuti a Parigi e si sono sposati.»',
      'Ils se sont rencontrés à Paris et ils se sont mariés. Nota: se = COD, il participio si accorda (rencontrés, mariés).',
    ),
    prac(
      'p6',
      "Correggi: «Elles se sont téléphonées. Elle s'est lavée les mains. Il va se lever.»",
      "Elles se sont téléphoné. Elle s'est lavé les mains. Il va se lever (corretta). Nota: téléphoner à (COI), COD les mains dopo il verbo; «il va se lever» è giusta.",
    ),
    prac(
      'p7',
      'Traduci: «Non ti ricordi di me? Ricordo benissimo quel giorno.»',
      'Tu ne te souviens pas de moi ? Je me rappelle très bien ce jour. Nota: se souvenir de vs se rappeler qc.',
    ),
    prac(
      'p8',
      "Scrivi all'imperativo: «alzati!», «non ti alzare!», «sediamoci!», «sbrigatevi!».",
      "Lève-toi ! Ne te lève pas ! Asseyons-nous ! Dépêchez-vous ! Nota: pronome dopo il verbo all'affermativo (toi, nous, vous), davanti al negativo (te).",
    ),
    prac(
      'p9',
      'Spiega la differenza: «le mémoire / la mémoire», «le tour / la tour».',
      'le mémoire = tesi, la mémoire = memoria; le tour = giro, la tour = torre. Nota: il genere cambia il senso; lo stesso vale per mode, poêle, voile.',
    ),
  ],
)

export const fNegation2 = mod(
  'fr-negation2',
  'Negazione completa: ni... ni, aucun, ne... que',
  "ni... ni, aucun, nul, ne... que, pas encore, pas du tout, ne senza pas, ne esplicativo, negazione con l'infinito",
  'b1',
  `${PRON_SHORT}
<p class="lead">Chi parla italiano pensa di sapere negare («non ho mai visto nessuno»), e in effetti la doppia negazione è simile. Ma il francese ha le sue regole su <b>ni... ni</b>, <b>aucun</b>, <b>ne... que</b> (che non è una negazione!), sull'<b>infinito negativo</b> e sulle risposte brevi.</p>
<h3>Ni... ni...</h3>
<p>Equivale a «né... né». <b>Ne</b> davanti al verbo, nessun <b>pas</b>: <i>Je n'aime ni le café ni le thé.</i> Quando c'è un partitivo o un articolo indefinito, lo si <b>elimina</b>: <i>Il n'a ni frère ni sœur.</i> (non «ni un frère ni une sœur»). Con articolo determinativo resta: <i>ni le café ni le thé.</i></p>
<ul>
<li>Con due soggetti il verbo è di solito plurale: <i>Ni Paul ni Marie ne sont venus.</i> / <i>Ni lui ni elle ne parlent italien.</i></li>
<li>Con verbi all'infinito: <i>Il ne veut ni manger ni boire.</i> Con tempi composti: <i>Je n'ai ni écrit ni téléphoné.</i></li>
<li>Pronomi: <i>Ni l'un ni l'autre n'est venu</i> (né l'uno né l'altro). «Né... né» = <i>ni... ni</i>: attenzione alla grafia, senza accento.</li>
<li><b>Sans</b> + nome: <i>sans argent, sans personne</i>. Dopo <i>sans</i> si usa un solo <i>ni</i>: <i>Il est parti sans argent ni papiers.</i></li>
</ul>
<h3>Aucun, nul, pas un seul</h3>
<p><b>Aucun(e)</b> [o-KẼ / o-KÜN] = nessuno, nessun. Vuole <b>ne</b> davanti al verbo e il singolare: <i>Aucun problème ne s'est présenté.</i> / <i>Je n'ai aucune idée.</i> / <i>Il n'y a aucun doute.</i> Con en: <i>Je n'en ai aucun.</i> Come risposta da solo: <i>Aucun.</i> <b>Nul(le)</b> è formale: <i>Nul n'est parfait</i> (nessuno è perfetto), <i>nulle part</i> (da nessuna parte): <i>Je ne le trouve nulle part.</i> <b>Pas un seul</b> rafforza: <i>Il n'a pas dit un seul mot.</i></p>
<p>L'italiano «nessuno è venuto» diventa <b>Personne n'est venu</b>: il <i>ne</i> è obbligatorio nello scritto, anche quando il pronome negativo è il soggetto. Stesso schema per <i>Rien ne change</i>, <i>Aucun élève n'est parti</i>, <i>Jamais personne n'a su</i>.</p>
<h3>Ne... que: non è una negazione</h3>
<p><b>Ne... que</b> significa «solo, soltanto» (sinonimo di <i>seulement</i>). <b>Que</b> va davanti all'elemento limitato: <i>Je n'ai que dix euros.</i> (Ho soltanto dieci euro.) / <i>Il ne boit que de l'eau.</i> / <i>Je ne mange du poisson que le vendredi.</i> / <i>Elle n'a invité que Paul.</i></p>
<ul>
<li>Il partitivo e l'articolo indefinito <b>restano</b> (<i>que de l'eau</i>, <i>que des amis</i>): la regola «de dopo la negazione» vale per <i>pas, plus, jamais</i>, ma non per <i>que</i>.</li>
<li><b>Ne... pas que</b> = non solo: <i>Il n'y a pas que toi.</i></li>
<li><b>Ne faire que</b> + infinito = fare soltanto / non fare altro che: <i>Il ne fait que parler.</i> (Non fa che parlare.)</li>
<li>Non confondere con <i>ne... rien que</i> (nient'altro che) e con <i>ne... guère</i> (formale: quasi non, <i>Il ne reste guère de pain</i>).</li>
</ul>
<h3>Negazioni di tempo e quantità</h3>
<table><tr><th>Francese</th><th>Italiano</th><th>Esempio</th></tr>
<tr><td>pas encore</td><td>non ancora</td><td>Je n'ai pas encore mangé.</td></tr>
<tr><td>toujours pas</td><td>ancora no, tuttora non</td><td>Il n'est toujours pas arrivé.</td></tr>
<tr><td>pas toujours</td><td>non sempre</td><td>Il n'est pas toujours à l'heure.</td></tr>
<tr><td>pas du tout</td><td>per niente, affatto</td><td>Ça ne me plaît pas du tout.</td></tr>
<tr><td>ne... plus</td><td>non più</td><td>Je ne fume plus.</td></tr>
<tr><td>ne... jamais</td><td>mai</td><td>Elle ne ment jamais.</td></tr>
<tr><td>ne... nulle part</td><td>da nessuna parte</td><td>Je ne le vois nulle part.</td></tr></table>
<h3>Posizione con tempi composti e infinito</h3>
<ul>
<li>Tempo composto: <i>ne</i> + ausiliare + <i>pas / plus / jamais / rien</i> + participio: <i>Je n'ai rien dit.</i> Ma <b>personne</b> e le preposizioni vanno dopo il participio: <i>Je n'ai vu personne.</i> / <i>Je n'ai parlé à personne.</i> / <i>Je n'ai pensé à rien.</i></li>
<li><b>Infinito negativo</b>: i due elementi stanno <b>davanti</b> all'infinito: <i>Je préfère ne pas partir.</i> / <i>Il a promis de ne jamais mentir.</i> / <i>Il a dit de ne rien faire.</i> Ma <i>ne... personne</i> è spezzato: <i>Il a décidé de ne voir personne.</i></li>
<li>Con più negazioni: <i>Je n'ai jamais rien dit à personne.</i> (Non ho mai detto niente a nessuno.)</li>
</ul>
<h3>Ne senza pas e ne esplicativo</h3>
<p>Nello scritto formale <b>ne</b> basta con <i>savoir, pouvoir, oser, cesser</i> e in alcune espressioni: <i>Je ne saurais vous dire</i>, <i>Il ne cesse de pleuvoir</i>, <i>Je n'ose le dire</i>, <i>si ce n'est</i> (se non), <i>n'importe</i>. Il <b>ne esplicativo</b> (o expletif) non nega niente: compare dopo <i>craindre que, avant que, à moins que, de peur que</i> e nei comparativi di disuguaglianza, e di norma si può omettere: <i>Je crains qu'il ne pleuve</i> (temo che piova), <i>Rentre avant qu'il ne pleuve</i>, <i>Il est plus grand que je ne pensais</i>.</p>
<h3>Risposte brevi: si, moi non plus</h3>
<ul>
<li>Domanda negativa, risposta affermativa: <b>Si</b>. <i>Tu ne viens pas ?</i> — <i>Si, je viens.</i> (Oui sarebbe ambiguo.)</li>
<li><b>Moi non plus</b> = nemmeno io: <i>Je n'aime pas ça. — Moi non plus.</i> Positivo: <i>Moi aussi.</i></li>
<li><b>Pas encore !</b>, <b>Jamais !</b>, <b>Rien.</b>, <b>Personne.</b>, <b>Pas du tout.</b> si usano senza verbo. Nel parlato informale <i>ne</i> cade (<i>j'sais pas, y a personne</i>), ma nello scritto è obbligatorio.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Je n'ai ni faim ni soif, je ne connais personne ici, et je n'ai jamais rien vu de pareil. Mais je ne suis là que pour deux jours.»</div>`,
  [
    q(
      'q1',
      'Come si dice «Non ho né fratelli né sorelle»?',
      [
        "Je n'ai ni frère ni sœur.",
        "Je n'ai pas ni frère ni sœur.",
        "Je n'ai ni un frère ni une sœur.",
        "Je n'ai ni de frère ni de sœur.",
      ],
      0,
      "Dopo ni... ni non si usa pas e si elimina l'articolo indefinito. La forma con de è una confusione con la regola della negazione semplice.",
    ),
    q(
      'q2',
      'Quale frase è corretta?',
      ["Personne n'est venu.", 'Personne est venu.', 'Personne ne a venu.', 'Personne ne venu.'],
      0,
      "Il pronome personne come soggetto vuole comunque ne davanti al verbo, e l'ausiliare di venir è être. Il ne si perde solo nel parlato rapido.",
    ),
    q(
      'q3',
      "Che cosa significa «Je n'ai que dix euros» ?",
      ['Ho solo dieci euro', 'Non ho dieci euro', 'Non ho più dieci euro', 'Ho dieci euro in meno'],
      0,
      "Ne... que è restrittivo, non negativo: significa soltanto. La frase negativa con pas sarebbe Je n'ai pas dix euros.",
    ),
    q(
      'q4',
      'Come si dice «Beve solo acqua»?',
      ["Il ne boit que de l'eau.", "Il ne boit que d'eau.", "Il ne boit pas que de l'eau.", "Il boit ne que de l'eau."],
      0,
      "Dopo ne... que il partitivo resta (de l'eau). Con pas que il senso diventa «non solo», quindi sarebbe una frase diversa.",
    ),
    q(
      'q5',
      'Come si dice «Non ho visto nessuno» al passé composé?',
      ["Je n'ai vu personne.", "Je n'ai personne vu.", 'Je ne personne ai vu.', "Je n'ai pas vu personne."],
      0,
      'Personne si mette dopo il participio passato, a differenza di rien e jamais. Pas non compare mai accanto a personne.',
    ),
    q(
      'q6',
      'Come si dice «Preferisco non partire» ?',
      [
        'Je préfère ne pas partir.',
        'Je préfère pas ne partir.',
        'Je ne préfère pas partir.',
        'Je préfère partir ne pas.',
      ],
      0,
      "All'infinito ne e pas stanno tutti e due prima del verbo. Je ne préfère pas partir cambierebbe il significato.",
    ),
    q(
      'q7',
      'Quale risposta è corretta a «Tu ne viens pas ?» se vuoi dire «Sì, vengo»?',
      ['Si, je viens.', 'Oui, je viens.', 'Non plus, je viens.', 'Aussi, je viens.'],
      0,
      "Si risponde affermativamente a una domanda negativa. Oui è accettato nel parlato, ma può essere ambiguo; non plus e aussi non c'entrano.",
    ),
    q(
      'q8',
      "Come si dice «Nemmeno io» in risposta a «Je n'aime pas ça»?",
      ['Moi non plus.', 'Moi pas plus.', 'Moi aussi non.', 'Même moi pas.'],
      0,
      "Non plus è l'equivalente di «nemmeno», l'opposto di aussi. Le altre tre sono calchi dell'italiano che il francese non conosce.",
    ),
    q(
      'q9',
      'Che cosa significa «Il ne fait que parler» ?',
      ['Non fa altro che parlare', 'Non parla mai', 'Fa solo il parlante', 'Non può parlare'],
      0,
      "Ne faire que + infinito indica un'azione che si ripete senza sosta o l'unica cosa che si fa. Non ha valore negativo.",
    ),
    q(
      'q10',
      'In quale frase il «ne» è esplicativo, cioè non nega?',
      ["Je crains qu'il ne pleuve.", 'Je ne mange pas de viande.', "Il n'a rien dit.", 'Elle ne sait pas.'],
      0,
      'Dopo craindre que il ne è facoltativo e non ha senso negativo: significa «temo che piova». Nelle altre frasi la negazione è reale.',
    ),
  ],
  [
    card('c1', 'ni... ni', 'Né... né, senza pas. Articolo indefinito/partitivo eliminato: ni frère ni sœur.'),
    card('c2', 'ni... ni: verbo', 'Ni Paul ni Marie ne sont venus (plurale).'),
    card('c3', 'aucun', "Nessun/nessuno, con ne: Je n'ai aucune idée."),
    card('c4', 'nul / nulle part', "Formale: Nul n'est parfait; nulle part = da nessuna parte."),
    card('c5', 'ne... que', "Solo, soltanto: Je n'ai que dix euros. Il partitivo resta."),
    card('c6', 'ne faire que', 'Non fare altro che: Il ne fait que parler.'),
    card('c7', 'pas encore / toujours pas', "Non ancora / ancora no: Il n'est toujours pas là."),
    card('c8', 'pas du tout', 'Per niente, affatto.'),
    card('c9', 'personne nel passé composé', "Je n'ai vu personne (dopo il participio); je n'ai rien vu (prima)."),
    card('c10', 'infinito negativo', 'ne pas partir, ne plus fumer, ne jamais mentir; ma ne voir personne.'),
    card('c11', 'si', 'Risposta affermativa a una domanda negativa: Tu ne viens pas ? Si !'),
    card('c12', 'ne esplicativo', "Je crains qu'il ne pleuve: non nega, si può omettere."),
  ],
  [
    prac(
      'p1',
      'Traduci: «Non mangio né carne né pesce. Non ha né tempo né soldi.»',
      "Je ne mange ni viande ni poisson. Il n'a ni temps ni argent. Nota: ni... ni senza pas e senza articolo partitivo.",
    ),
    prac(
      'p2',
      'Traduci: «Nessuno ha telefonato e non ho visto nessuno.»',
      "Personne n'a téléphoné et je n'ai vu personne. Nota: personne soggetto con ne; come COD dopo il participio.",
    ),
    prac(
      'p3',
      'Traduci: «Ho solo venti euro. Beve solo caffè.»',
      "Je n'ai que vingt euros. Il ne boit que du café. Nota: ne... que + partitivo che resta.",
    ),
    prac(
      'p4',
      "Correggi: «Je n'ai pas vu personne. Il ne a rien dit. Je ne pas veux partir.»",
      "Je n'ai vu personne. Il n'a rien dit. Je ne veux pas partir. Nota: niente pas con personne; elisione n'; ne pas attorno al verbo coniugato.",
    ),
    prac(
      'p5',
      'Traduci: «Non ho ancora finito. Lui non è ancora arrivato, e lei non fuma più.»',
      "Je n'ai pas encore fini. Il n'est toujours pas arrivé, et elle ne fume plus. Nota: pas encore vs toujours pas (ancora no, con un'attesa più lunga).",
    ),
    prac(
      'p6',
      'Traduci: «Promette di non dire niente a nessuno e di non tornare mai.»',
      "Il promet de ne rien dire à personne et de ne jamais revenir. Nota: ne rien, ne jamais davanti all'infinito; personne dopo.",
    ),
    prac(
      'p7',
      "Rispondi: «Tu n'es pas fatigué ? (sì, lo sono) / Je n'aime pas le fromage. (nemmeno io)»",
      'Si, je suis fatigué. Moi non plus. Nota: si per rispondere sì a una domanda negativa; non plus per «nemmeno».',
    ),
    prac(
      'p8',
      "Traduci: «Non c'è nessun problema. Non lo trovo da nessuna parte.»",
      "Il n'y a aucun problème. Je ne le trouve nulle part. Nota: aucun + sostantivo maschile, nulle part come locuzione.",
    ),
    prac(
      'p9',
      'Spiega la differenza: «Il ne fait que travailler» e «Il ne fait pas que travailler».',
      'Il ne fait que travailler = non fa altro che lavorare; Il ne fait pas que travailler = non fa solo lavorare (ha anche altro). Nota: pas que = non solo.',
    ),
  ],
)
