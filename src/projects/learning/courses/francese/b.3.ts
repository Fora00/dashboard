import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './b.pron'

export const fraConnecteurs: CourseModule = mod(
  'fr-connecteurs',
  'Connettori, discorso indiretto, enfasi e scrittura',
  "Connettori logici, concordanza nel discorso indiretto, nominalizzazione, c'est... qui / que, dislocazione",
  'b2',
  `<p class="lead">Al livello B2 non basta "dire cose giuste": bisogna <b>collegare le idee</b>, riportare le parole altrui, mettere in rilievo e scrivere in modo più elaborato. Sono le competenze che il DELF B2 valuta nello scritto e nell'orale.</p>
${PRON_SHORT}
<h3>Connettori logici</h3>
<div class="tblw"><table><tr><th>Connettore</th><th>Pronuncia</th><th>Valore</th></tr>
<tr><td>de plus</td><td>[dë PLÜS]</td><td>inoltre</td></tr>
<tr><td>pourtant</td><td>[pur-TÃ]</td><td>eppure</td></tr>
<tr><td>cependant</td><td>[së-pã-DÃ]</td><td>tuttavia</td></tr>
<tr><td>toutefois</td><td>[tut-FUA]</td><td>tuttavia (scritto)</td></tr>
<tr><td>en revanche</td><td>[ã rë-VÃSH]</td><td>invece, per contro</td></tr>
<tr><td>néanmoins</td><td>[né-ã-MUẼ]</td><td>nondimeno</td></tr>
<tr><td>d'ailleurs</td><td>[da-YÖR]</td><td>del resto</td></tr>
<tr><td>en effet</td><td>[ã-nè-FÈ]</td><td>infatti</td></tr>
<tr><td>car</td><td>[KAR]</td><td>poiché (scritto)</td></tr>
<tr><td>donc</td><td>[DÕK]</td><td>dunque</td></tr>
<tr><td>par conséquent</td><td>[par kõ-sé-KÃ]</td><td>di conseguenza</td></tr>
<tr><td>ainsi</td><td>[ẽ-SI]</td><td>così, quindi</td></tr>
<tr><td>certes... mais</td><td>[SÈRT]</td><td>certo... ma</td></tr>
<tr><td>bref</td><td>[BRÈF]</td><td>insomma</td></tr>
</table></div>
<ul>
<li><b>Ordine</b>: d'abord, ensuite, puis, enfin / en premier lieu, en second lieu, pour conclure.</li>
<li><b>Esempio</b>: par exemple, notamment. <b>Riformulazione</b>: c'est-à-dire, autrement dit.</li>
<li><b>Causa</b>: parce que, puisque, étant donné que, grâce à (effetto positivo), à cause de (negativo), en raison de.</li>
<li><b>Concessione</b>: bien que + subjonctif, malgré + nome, même si, certes... mais.</li>
</ul>
<h3>Discorso indiretto</h3>
<p>Con il verbo introduttivo al passato (<i>il a dit que, elle a demandé si</i>), i tempi scalano:</p>
<div class="tblw"><table><tr><th>Diretto</th><th>Indiretto</th></tr>
<tr><td>présent</td><td>imparfait</td></tr>
<tr><td>passé composé</td><td>plus-que-parfait</td></tr>
<tr><td>futur</td><td>conditionnel présent</td></tr>
<tr><td>imparfait, plus-que-parfait, conditionnel</td><td>invariati</td></tr>
<tr><td>impératif</td><td>de + infinito</td></tr>
</table></div>
<ul>
<li>«Je suis fatigué.» → Il a dit qu'il <b>était</b> fatigué.</li>
<li>«Je viendrai demain.» → Il a dit qu'il <b>viendrait le lendemain</b>.</li>
<li>«Viens !» → Il m'a dit <b>de venir</b>.</li>
<li>«Où vas-tu ?» → Elle m'a demandé <b>où j'allais</b> (senza inversione).</li>
<li>«Tu viens ?» → Elle m'a demandé <b>si</b> je venais. «Qu'est-ce que tu veux ?» → <b>ce que</b> je voulais; «Qu'est-ce qui se passe ?» → <b>ce qui</b> se passait.</li>
<li>«J'étais malade.» → Il a dit qu'il <b>était</b> malade (l'imparfait resta tale); «J'avais fini.» → qu'il <b>avait fini</b>; «Je viendrais.» → qu'il <b>viendrait</b>.</li>
</ul>
<p>Cambiano anche gli indicatori di tempo: aujourd'hui → <i>ce jour-là</i>; demain → <i>le lendemain</i>; hier → <i>la veille</i>; maintenant → <i>alors</i>; ici → <i>là</i>; la semaine prochaine → <i>la semaine suivante</i>. Questi cambi servono quando il momento di riferimento è ormai passato; se riporti lo stesso giorno (o il «domani» è ancora futuro per chi parla), <i>demain</i> resta: «Il a dit ce matin qu'il viendrait demain.» Se il verbo introduttivo è al présent nulla cambia: «Il dit qu'il est fatigué.»</p>
<h3>Nominalizzazione (stile scritto e giornalistico)</h3>
<p>Il francese formale preferisce il sostantivo al verbo: «Les prix ont augmenté» → <b>l'augmentation des prix</b>. Coppie utili: décider → <i>la décision</i>; échouer → <i>l'échec</i>; arriver → <i>l'arrivée</i>; partir → <i>le départ</i>; refuser → <i>le refus</i>; choisir → <i>le choix</i>; réussir → <i>la réussite</i>; perdre → <i>la perte</i>; baisser → <i>la baisse</i>; changer → <i>le changement</i>.</p>
<h3>Mettere in rilievo</h3>
<ul>
<li><b>c'est... qui</b> (soggetto) / <b>c'est... que</b> (altro): «C'est Marie qui a téléphoné.» [sè ma-RI ki a té-lé-fo-NÉ]; «C'est à Paris que je suis né.»</li>
<li><b>ce qui / ce que / ce dont... c'est</b>: «Ce que j'aime, c'est la mer.» «Ce dont j'ai besoin, c'est de calme.»</li>
<li><b>Dislocazione</b> (parlato): ripresa con pronome: «Moi, je pense que...» [MUA zhë pãs kë]; «Ce film, je l'ai vu.» (Questo film, l'ho visto.) «Il est sympa, ton frère.» (È simpatico, tuo fratello.)</li>
<li><b>Quant à</b>: «Quant à moi, je reste.»</li>
</ul>
<h3>Strutture scritte</h3>
<ul>
<li>Inversione dopo avverbi: «Peut-être viendra-t-il.» (o «Peut-être qu'il viendra»), «Sans doute est-il fatigué.»</li>
<li>Participiale: «Le travail terminé, nous sommes partis.» «Ayant compris, il s'est tu.»</li>
<li>Coppie: <i>non seulement... mais encore, d'une part... d'autre part, soit... soit, ni... ni</i>.</li>
<li>Negazioni elevate: <i>ne... guère, ne... que</i> (soltanto), <i>ne... point</i> (letterario).</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>infatti = en effet</b>, mentre <b>en fait</b> = in realtà (falso amico!). «A proposito» = <i>au fait</i>.</li>
<li><b>però</b> = <i>mais</i> o <i>pourtant</i>; <b>quindi</b> = <i>donc</i>; <b>cioè</b> = <i>c'est-à-dire</i>; <b>insomma</b> = <i>bref, en somme</i>; <b>comunque</b> = <i>de toute façon, quoi qu'il en soit</i>.</li>
<li><b>mentre</b> = <i>pendant que</i> (simultaneità) o <i>alors que</i> (opposizione).</li>
<li>Una sola subordinata con <i>que</i> non basta: ripeti <i>que</i> nelle coordinate («Il dit qu'il vient et qu'il reste»).</li>
</ul>
<div class="say"><b>Da ricordare.</b> «D'une part..., d'autre part...»; «Certes..., mais...»; «Ce que je veux dire, c'est que...»; «Il a dit qu'il viendrait le lendemain».</div>`,
  [
    q(
      'q1',
      "«Elle est riche; ___, elle n'est pas heureuse.»",
      ['pourtant', 'car', 'donc', 'ainsi'],
      0,
      'Pourtant introduce una contraddizione (eppure). Donc e ainsi esprimono una conseguenza, car una causa: nessuno dei tre è coerente.',
    ),
    q(
      'q2',
      '«Il pleuvait, ___ nous sommes restés à la maison.»',
      ['donc', 'pourtant', 'cependant', 'en revanche'],
      0,
      "Qui c'è un rapporto di causa-effetto, quindi donc (dunque). Gli altri tre esprimono opposizione, non conseguenza.",
    ),
    q(
      'q3',
      'Riporta: «Il a dit : "Je suis fatigué."»',
      [
        "Il a dit qu'il était fatigué.",
        "Il a dit qu'il est fatigué.",
        "Il a dit qu'il serait fatigué.",
        "Il a dit qu'il avait été fatigué.",
      ],
      0,
      'Con la principale al passato il présent diventa imparfait. Est sarebbe corretto solo se il verbo introduttivo fosse al presente.',
    ),
    q(
      'q4',
      'Riporta: «Elle m\'a demandé : "Où vas-tu ?"»',
      [
        "Elle m'a demandé où j'allais.",
        "Elle m'a demandé où je vais.",
        "Elle m'a demandé où allais-je.",
        "Elle m'a demandé où j'irai.",
      ],
      0,
      "Nel discorso indiretto non c'è inversione e il presente scala all'imparfait: où j'allais. Où vas-tu resterebbe diretto.",
    ),
    q(
      'q5',
      'Riporta in un racconto al passato, quando il «domani» è già trascorso: «Je viendrai demain.»',
      [
        "Il a dit qu'il viendrait le lendemain.",
        "Il a dit qu'il viendra demain.",
        "Il a dit qu'il viendrait demain matin.",
        "Il a dit qu'il viendra le lendemain.",
      ],
      0,
      'Il futuro diventa conditionnel présent e, se il domani è già passato, demain diventa le lendemain. Con demain resterebbe corretto solo se il giorno fosse ancora futuro.',
    ),
    q(
      'q6',
      'Come si mette in rilievo «È Marie che ha telefonato»?',
      [
        "C'est Marie qui a téléphoné.",
        "C'est Marie que a téléphoné.",
        'Ce Marie qui a téléphoné.',
        "C'est Marie qu'elle a téléphoné.",
      ],
      0,
      "Se l'elemento messo in rilievo è il soggetto, si usa qui, non que. Que si userebbe per un complemento.",
    ),
    q(
      'q7',
      "Come si dice «Questo film, l'ho visto»?",
      ["Ce film, je l'ai vu.", "Ce film, j'ai vu.", 'Ce film, je ai vu.', 'Ce film, je le ai vu.'],
      0,
      "La dislocazione richiede il pronome di ripresa (l' = le) davanti all'ausiliare, con elisione. Senza la ripresa la frase è incompleta.",
    ),
    q(
      'q8',
      'Come si traduce «infatti» (= in effetti)?',
      ['en effet', 'en fait', 'au fait', 'en plus'],
      0,
      'En effet conferma quanto detto. En fait significa invece in realtà, ed è il falso amico che inganna chi pensa a «in fatti».',
    ),
    q(
      'q9',
      'Qual è la nominalizzazione di «décider»?',
      ['la décision', 'la décidation', 'le décide', 'la décidement'],
      0,
      'Il sostantivo corrispondente a décider è la décision (con -sion). Le altre forme non esistono come sostantivi.',
    ),
    q(
      'q10',
      'Come si pronuncia «toutefois»?',
      ['[tut-FUA]', '[tu-të-FOIS]', '[tut-FUAS]', '[tu-TÈ-fua]'],
      0,
      "Toute si legge [tut] e fois [FUA], con la s finale muta. Pronunciare ogni lettera, alla italiana, tradisce subito l'origine.",
    ),
  ],
  [
    card('c1', 'pourtant / cependant', 'Eppure / tuttavia: opposizione. Toutefois e néanmoins sono più formali.'),
    card('c2', 'en effet / en fait', 'En effet = infatti; en fait = in realtà; au fait = a proposito.'),
    card('c3', 'Discorso indiretto: présent', 'Diventa imparfait con verbo introduttivo al passato.'),
    card('c4', 'Discorso indiretto: futur', "Diventa conditionnel présent: Il a dit qu'il viendrait."),
    card(
      'c5',
      'Indicatori di tempo',
      "demain → le lendemain; hier → la veille; aujourd'hui → ce jour-là (se il momento è già passato; se è ancora futuro, demain resta).",
    ),
    card('c6', 'Domanda indiretta', "Niente inversione: Il m'a demandé où j'allais; si + frase."),
    card('c7', "c'est... qui / que", "C'est Marie qui a téléphoné (soggetto); c'est à Paris que je suis né."),
    card('c8', 'Dislocazione', "Ce film, je l'ai vu. Moi, je pense que..."),
    card('c9', 'Nominalizzazione', "Les prix ont augmenté → l'augmentation des prix."),
    card('c10', "d'une part... d'autre part", "Da una parte... dall'altra; struttura per organizzare un testo."),
  ],
  [
    prac(
      'p1',
      'Riporta al passato: «Paul m\'a dit : "Je partirai demain et je t\'appellerai."»',
      "Paul m'a dit qu'il partirait le lendemain et qu'il m'appellerait. Nota: futuro → conditionnel présent e demain → le lendemain; que si ripete.",
    ),
    prac(
      'p2',
      'Riporta: «Elle m\'a dit : "Ferme la porte !"»',
      "Elle m'a dit de fermer la porte. Nota: l'imperativo diventa de + infinito.",
    ),
    prac(
      'p3',
      'Metti in rilievo il soggetto: «Mon frère a gagné le concours.»',
      "C'est mon frère qui a gagné le concours. Nota: soggetto → c'est... qui.",
    ),
    prac(
      'p4',
      "Nominalizza: «Le gouvernement a décidé d'augmenter les taxes.»",
      "La décision du gouvernement d'augmenter les taxes... / L'augmentation des taxes décidée par le gouvernement... Nota: stile giornalistico.",
    ),
    prac(
      'p5',
      'Scrivi tre frasi con certes... mais, pourtant, en revanche.',
      'Esempio: Certes, ce film est long, mais il est passionnant. / Il est jeune, pourtant il est très expérimenté. / Paris est chère; en revanche, les transports sont excellents.',
    ),
  ],
)

export const fraRegistres: CourseModule = mod(
  'fr-registres',
  'Registri, lettere formali, argot e SMS',
  'Formale, informale, familier; email, CV, reclami, espressioni idiomatiche, verlan, abbreviazioni',
  'b2',
  `<p class="lead">Il francese è molto sensibile al <b>registro</b>: la stessa idea si dice in modo diverso a un cliente, a un amico, in un messaggio. Capire il registro evita gaffe e rende comprensibile la lingua vera, quella di film e strada.</p>
${PRON_SHORT}
<h3>Tre livelli di una stessa idea</h3>
<div class="tblw"><table><tr><th>Formale / neutro</th><th>Familier</th><th>Pronuncia</th></tr>
<tr><td>la voiture</td><td>la bagnole</td><td>[ba-GNÒL]</td></tr>
<tr><td>l'argent</td><td>le fric</td><td>[FRIK]</td></tr>
<tr><td>le travail</td><td>le boulot</td><td>[bu-LO]</td></tr>
<tr><td>manger</td><td>bouffer</td><td>[bu-FÉ]</td></tr>
<tr><td>un ami</td><td>un pote</td><td>[PÒT]</td></tr>
<tr><td>un enfant</td><td>un gamin, un gosse</td><td>[ga-MẼ], [GÒS]</td></tr>
<tr><td>très</td><td>super, vachement</td><td>[sü-PÈR], [va-shë-MÃ]</td></tr>
<tr><td>fatigué</td><td>crevé</td><td>[krë-VÉ]</td></tr>
<tr><td>un livre</td><td>un bouquin</td><td>[bu-KẼ]</td></tr>
<tr><td>un policier</td><td>un flic</td><td>[FLIK]</td></tr>
</table></div>
<h3>Tu o vous? Come costruire la domanda</h3>
<ul>
<li><b>Vous</b> = «Lei» e plurale: con sconosciuti, clienti, superiori, anziani. Il verbo è alla 2a persona plurale: «Vous voulez un café ?»</li>
<li><b>Tu</b> con amici, famiglia, giovani, colleghi dopo che si è proposto: «On peut se tutoyer ?»</li>
<li>Tre forme di una domanda: formale <i>Voulez-vous partir ?</i>; neutra <i>Est-ce que vous voulez partir ?</i>; familiare <i>Tu veux partir ?</i> (solo intonazione).</li>
<li>Nel parlato familier cade il <i>ne</i> della negazione: «Je ne sais pas» [zhë në sè PA] → «Je sais pas» [zhë sè PA] → «J'sais pas» [shè PA]; «Il y a» → «Y a» [ya].</li>
</ul>
<h3>Email e lettere formali</h3>
<ul>
<li><b>Apertura</b>: «Madame, Monsieur,» (destinatario sconosciuto); «Madame la Directrice,».</li>
<li><b>Motivo</b>: «Je me permets de vous contacter au sujet de...»; «Suite à notre conversation téléphonique...»</li>
<li><b>Richiesta</b>: «Je vous serais reconnaissant de bien vouloir...»; «Je vous prie de bien vouloir m'envoyer...»</li>
<li><b>Allegati</b>: «Veuillez trouver ci-joint mon CV.»</li>
<li><b>Chiusura</b>: «Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.» Più corta: «Cordialement». Con un conoscente: «Bien à vous», «À bientôt». Con un amico: «Bises», «Bien à toi».</li>
</ul>
<h3>CV, lettera di motivazione, reclamo</h3>
<ul>
<li><b>CV</b>: Expérience professionnelle, Formation, Compétences, Langues, Centres d'intérêt. I verbi di azione sono nominali o al participio: «Gestion d'une équipe de 5 personnes».</li>
<li><b>Lettre de motivation</b>: «Actuellement étudiant en informatique, je suis vivement intéressé par le poste de...»; «Je me tiens à votre disposition pour un entretien.»</li>
<li><b>Reclamo</b>: «Je vous écris pour vous faire part de mon mécontentement concernant...»; «Je vous demande de bien vouloir me rembourser»; «À défaut de réponse sous huit jours, je me verrai contraint de...»</li>
</ul>
<h3>Espressioni idiomatiche</h3>
<div class="tblw"><table><tr><th>Espressione</th><th>Pronuncia</th><th>Senso</th></tr>
<tr><td>avoir le cafard</td><td>[a-vuar lë ka-FAR]</td><td>essere giù di morale</td></tr>
<tr><td>poser un lapin</td><td>[po-zé ẽ la-PẼ]</td><td>dare buca</td></tr>
<tr><td>il pleut des cordes</td><td>[il plö dé KÒRD]</td><td>piove a dirotto</td></tr>
<tr><td>tomber dans les pommes</td><td>[tõ-bé dã lé PÒM]</td><td>svenire</td></tr>
<tr><td>casser les pieds</td><td>[ka-sé lé PYÉ]</td><td>scocciare</td></tr>
<tr><td>avoir la flemme</td><td>[a-vuar la FLÈM]</td><td>non avere voglia</td></tr>
<tr><td>faire la grasse matinée</td><td>[fèr la gras ma-ti-NÉ]</td><td>dormire fino a tardi</td></tr>
<tr><td>coûter les yeux de la tête</td><td>[ku-té lé-zyö dë la TÈT]</td><td>costare un occhio</td></tr>
</table></div>
<h3>Verlan e argot comune</h3>
<p>Il <b>verlan</b> inverte le sillabe (<i>l'envers → verlan</i>). Parole che senti ovunque: <b>meuf</b> (femme) [MÖF], <b>keuf</b> (flic) [KÖF], <b>ouf</b> (fou) [UF], <b>relou</b> (lourd, pesante) [rë-LU], <b>chelou</b> (louche, strano) [shë-LU], <b>zarbi</b> (bizarre) [zar-BI], <b>teuf</b> (fête) [TÖF], <b>cimer</b> (merci) [si-MÈR]. Altro argot: <b>mec</b> [MÈK] (tizio), <b>taf</b> [TAF] (lavoro), <b>thune</b> [TÜN] (soldi), <b>kiffer</b> [ki-FÉ] (adorare), <b>galère</b> [ga-LÈR] (situazione dura), <b>ça craint</b> [sa KRẼ] (è pessimo), <b>t'inquiète</b> [tẽ-KYÈT] (non preoccuparti), <b>ça roule</b> [sa RUL] (tutto bene).</p>
<h3>Abbreviazioni da SMS</h3>
<ul>
<li>slt (salut), bjr (bonjour), stp (s'il te plaît), svp (s'il vous plaît), bcp (beaucoup), tjrs (toujours), mtn (maintenant), qqn (quelqu'un), qqch (quelque chose).</li>
<li>tkt (t'inquiète), jsp (je ne sais pas), pk (pourquoi), pcq (parce que), dsl (désolé), a+ (à plus tard), a2m1 (à demain), cc (coucou).</li>
<li>mdr (mort de rire) si legge lettera per lettera: [èm-dé-ÈR]; ptdr (pété de rire) è più forte.</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Ciao</b> non esiste: <i>salut</i> (informale), <i>bonjour</i> (neutro), <i>bonsoir</i> (dalla sera). <i>Salut</i> serve anche per salutarsi.</li>
<li><b>Prego</b>: <i>je vous en prie</i> (formale), <i>de rien, pas de quoi</i> (informale); <i>Piacere</i>: <i>enchanté(e)</i>.</li>
<li><b>Lei</b> si traduce con <i>vous</i> (2a plurale), mai con la 3a persona.</li>
<li>Nel parlato il <i>ne</i> cade spesso, ma nello scritto (esame, mail) è obbligatorio.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Je vous prie d'agréer l'expression de mes salutations distinguées.» (formale) · «Tu viens ?» (familiare) · «J'sais pas» (parlato) · «Madame, Monsieur,».</div>`,
  [
    q(
      'q1',
      'Con quale formula si apre una mail formale a un destinatario sconosciuto?',
      ['Madame, Monsieur,', 'Salut,', 'Cher ami,', 'Bonjour toi,'],
      0,
      'Madame, Monsieur è la formula neutra e rispettosa. Salut e Cher ami sono troppo informali per un contatto professionale sconosciuto.',
    ),
    q(
      'q2',
      "Che cosa significa «J'ai la flemme» ?",
      [
        'Non ho voglia di far nulla',
        'Ho un brutto raffreddore',
        'Sono molto arrabbiato con te',
        'Sono sempre in ritardo',
      ],
      0,
      'Avoir la flemme indica pigrizia, mancanza di voglia. Il senso è diverso dalla flemma italiana (calma imperturbabile), anche se la parola ha la stessa origine.',
    ),
    q(
      'q3',
      'Che cosa significa «meuf» in verlan?',
      ['donna, ragazza', 'poliziotto', 'pazzo', 'amico'],
      0,
      "Meuf è l'inversione di femme. Keuf è flic (poliziotto), ouf è fou, pote è amico: sono tutte parole diverse.",
    ),
    q(
      'q4',
      'Quale chiusura è corretta in una lettera di reclamo?',
      [
        "Je vous prie d'agréer mes salutations distinguées.",
        'À plus tard, et grosses bises à toute la famille.',
        'Salut, à demain, passe une bonne soirée avec eux.',
        'Je te prie de croire en ma plus sincère amitié.',
      ],
      0,
      'Una lettera formale si chiude con la formula di cortesia standard. A plus, bises e salut sono informali e tu è inadatto.',
    ),
    q(
      'q5',
      'Come si dice, nel parlato familiare, «Non lo so»?',
      ["J'sais pas.", 'Je ne sais point.', 'Ne sais-je pas.', 'Je sais ne pas.'],
      0,
      "Nel parlato cade il ne e je si riduce a j'. Je ne sais point è letterario, ne sais-je pas non è una frase normale.",
    ),
    q(
      'q6',
      'Che cosa vuol dire «tkt» in un SMS?',
      [
        "t'inquiète (non preoccuparti)",
        'tout de suite, subito, adesso',
        'trop kiffant, troppo bello',
        'tu es là ? sei lì, ci sei?',
      ],
      0,
      "Tkt è la scrittura fonetica di t'inquiète. Il significato è «non ti preoccupare», usato spesso per rassicurare.",
    ),
    q(
      'q7',
      'Come si risponde in modo educato a «Merci beaucoup» ?',
      ['Je vous en prie.', 'Prego!', 'De rien, mon vieux.', 'Pas de souci du tout, mec.'],
      0,
      'Je vous en prie è la risposta formale; le altre due sono troppo familiari. «Prego» non è francese.',
    ),
    q(
      'q8',
      'Come si pronuncia «relou» ?',
      ['[rë-LU]', '[re-LO]', '[rë-LUÜ]', '[ré-lu]'],
      0,
      'Relou è verlan di lourd: la «ou» francese si legge come la u italiana, e la prima e è debole [rë].',
    ),
    q(
      'q9',
      'Quale forma si usa con un superiore sul lavoro?',
      ['Voulez-vous une réunion ?', 'Tu veux une réunion ?', 'Tu veux pas une réunion ?', 'Veux-tu une réunion ?'],
      0,
      'Con un superiore si usa vous, con la forma interrogativa invertita. Tu è per amici e familiari.',
    ),
  ],
  [
    card('c1', 'Tu / vous', 'Vous = Lei e plurale; tu = amici, famiglia. On peut se tutoyer ?'),
    card('c2', 'Madame, Monsieur,', 'Apertura formale con destinatario sconosciuto.'),
    card(
      'c3',
      'Chiusura formale',
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    ),
    card('c4', 'Cordialement', 'Chiusura neutra per una mail di lavoro.'),
    card('c5', 'Veuillez trouver ci-joint', 'Allegato: Veuillez trouver ci-joint mon CV.'),
    card('c6', 'Je me permets de...', 'Formula cortese: Je me permets de vous contacter.'),
    card('c7', 'avoir le cafard', 'Essere giù di morale [a-vuar lë ka-FAR].'),
    card('c8', 'poser un lapin', 'Dare buca [po-zé ẽ la-PẼ].'),
    card('c9', 'Verlan', 'meuf = femme, keuf = flic, ouf = fou, relou = lourd, chelou = louche.'),
    card('c10', 'SMS', "tkt = t'inquiète; jsp = je ne sais pas; pk = pourquoi; mdr = mort de rire."),
  ],
  [
    prac(
      'p1',
      "Scrivi l'apertura e la chiusura di una mail formale per chiedere informazioni su un corso.",
      "Madame, Monsieur, / Je me permets de vous contacter au sujet de votre cours de... / Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées. Nota: ordine: appello, motivo, richiesta, chiusura.",
    ),
    prac(
      'p2',
      'Trasforma in registro familiare: «Je ne sais pas où est mon travail.»',
      "J'sais pas où est mon boulot. Oppure: Je sais pas où il est, mon boulot. Nota: caduta di ne, travail → boulot.",
    ),
    prac(
      'p3',
      'Trasforma in registro formale: «Tu veux me filer du fric ?»',
      "Pourriez-vous me prêter un peu d'argent ? Nota: vous, condizionale di cortesia, parole neutre.",
    ),
    prac(
      'p4',
      'Scrivi tre frasi di reclamo per un oggetto arrivato rotto.',
      "Je vous écris pour vous faire part de mon mécontentement. / L'article reçu le 5 mars est endommagé. / Je vous demande de bien vouloir me le rembourser ou me le remplacer.",
    ),
    prac(
      'p5',
      'Traduci in SMS in francese: «Non preoccuparti, ci vediamo domani.»',
      "Tkt, a2m1 ! Oppure: T'inquiète, à demain. Nota: forma abbreviata per messaggi tra amici.",
    ),
  ],
)

export const fraVariantes: CourseModule = mod(
  'fr-variantes',
  'La francofonia: Belgio, Svizzera, Québec, Africa',
  'Numeri, pasti, vocabolario locale, accenti, ortografia riformata',
  'b2',
  `<p class="lead">Il francese non è solo quello di Parigi: lo parlano circa 300 milioni di persone, in gran parte fuori dalla Francia. La grammatica è la stessa, ma lessico, numeri e accenti cambiano. Qui trovi le differenze che incontrerai davvero.</p>
${PRON_SHORT}
<h3>Numeri: septante, huitante, nonante</h3>
<div class="tblw"><table><tr><th>Numero</th><th>Francia</th><th>Belgio / Svizzera</th></tr>
<tr><td>70</td><td>soixante-dix [sua-sãt-DIS]</td><td>septante [sèp-TÃT]</td></tr>
<tr><td>80</td><td>quatre-vingts [ka-trë-VẼ]</td><td>quatre-vingts, in alcuni cantoni svizzeri huitante [üi-TÃT]</td></tr>
<tr><td>90</td><td>quatre-vingt-dix [ka-trë-vẽ-DIS]</td><td>nonante [no-NÃT]</td></tr>
</table></div>
<ul>
<li>In <b>Belgio</b> si dice <i>septante</i> e <i>nonante</i>, ma <i>quatre-vingts</i> per 80.</li>
<li>In <b>Svizzera romanda</b> si dice <i>septante</i> e <i>nonante</i>; per 80 si usa <i>huitante</i> in Vaud, Vallese e Friburgo, ma <i>quatre-vingts</i> a Ginevra e nel Giura (nessuna delle due forme è sbagliata).</li>
<li>Nota: la «t» finale in septante, huitante, nonante si pronuncia ([-TÃT]); la nasale è ã, non «ant» all'italiana.</li>
<li>Anche in <b>RD Congo, Ruanda, Burundi</b> si usa <i>septante</i> e <i>nonante</i> (influsso belga).</li>
</ul>
<h3>I pasti</h3>
<div class="tblw"><table><tr><th>Italiano</th><th>Francia</th><th>Belgio, Québec</th></tr>
<tr><td>colazione</td><td>le petit-déjeuner [lë pë-ti-dé-zhë-NÉ]</td><td>le déjeuner [lë dé-zhë-NÉ]</td></tr>
<tr><td>pranzo</td><td>le déjeuner</td><td>le dîner [lë di-NÉ]</td></tr>
<tr><td>cena</td><td>le dîner</td><td>le souper [lë su-PÉ]</td></tr>
</table></div>
<p>Trappola per gli italiani: <b>pranzo = déjeuner</b> in Francia, <b>cena = dîner</b>. Se in Québec ti invitano a «dîner», è mezzogiorno. In <b>Svizzera romanda</b> dîner è il pranzo e souper la cena, mentre per la colazione si dice più spesso petit-déjeuner: il sistema belga-québécois (déjeuner = colazione) non vale ovunque.</p>
<h3>Belgio</h3>
<ul>
<li><b>drache</b> [DRASH]: pioggia forte. <b>GSM</b>: cellulare. <b>chicon</b> [shi-KÕ]: indivia belga. <b>Septante / nonante</b>.</li>
<li>Uso di <b>savoir</b> per <i>pouvoir</i>: «Je ne sais pas venir» (non posso venire), tipico ma non standard.</li>
<li>«Une fois» come rinforzo: «Viens une fois ici !» (Vieni un attimo qui.)</li>
</ul>
<h3>Svizzera romanda</h3>
<ul>
<li><b>natel</b> [na-TÈL]: cellulare. <b>cornet</b> [kòr-NÈ]: sacchetto. <b>poutzer</b> [pu-TSÉ]: pulire (dal tedesco). <b>panosse</b> [pa-NÒS]: straccio per il pavimento.</li>
<li><b>Dîner / souper</b> per pranzo e cena, come in Belgio e in Québec; per la colazione è comune anche petit-déjeuner.</li>
</ul>
<h3>Québec</h3>
<ul>
<li><b>char</b> [SHAR]: auto. <b>magasiner</b> [ma-ga-zi-NÉ]: fare shopping. <b>fin de semaine</b>: weekend. <b>courriel</b>: email (usato anche in Francia). <b>dépanneur</b> [dé-pa-NÖR]: piccolo negozio aperto a lungo. <b>tuque</b> [TÜK]: berretto di lana. <b>chandail</b> [shã-DAY]: maglione. <b>stationnement</b>: parcheggio. <b>chum</b> [TSHÖM] (tsh = «ci» di cena): fidanzato o amico, <b>blonde</b>: fidanzata.</li>
<li>«<b>Bienvenue</b>» è la risposta a «merci» (come «de rien» in Francia, ma anche «you're welcome»).</li>
<li><b>Accento</b>: la t e la d davanti a i e ü si affricano: <i>tu</i> [TSÜ], <i>dire</i> [DZIR]; <i>moi, toi</i> si dicono [muè], [tuè].</li>
</ul>
<h3>Africa francofona</h3>
<p>In oltre 20 paesi dell'Africa subsahariana il francese è lingua ufficiale (Senegal, Costa d'Avorio, Camerun, RD Congo, Gabon...); in Marocco, Algeria e Tunisia non è ufficiale, ma è molto diffuso nell'istruzione, nei media e nel commercio. Ogni paese ha le sue parole: in Costa d'Avorio il <b>nouchi</b> [nu-SHI] è lo slang dei giovani e il <b>maquis</b> [ma-KI] è un ristorante all'aperto semplice. Gli accenti variano molto da paese a paese e il vocabolario pure: qui solo esempi.</p>
<h3>Accenti in Francia</h3>
<ul>
<li><b>Sud</b>: le «e» finali si sentono ([ü-në-TA-blë] per <i>une table</i>) e le nasali hanno una «n» in coda: <i>pain</i> [pẽn], <i>vin</i> [vẽn].</li>
<li><b>Parigi</b>: le e deboli cadono, il ritmo è piatto, la «r» è di gola.</li>
</ul>
<h3>Ortografia riformata (1990)</h3>
<p>Nel 1990 sono state proposte delle <b>rettifiche</b>; a scuola e agli esami entrambe le grafie sono accettate:</p>
<ul>
<li>circonflesso facoltativo su i e u (<i>maitre / maître</i>, <i>cout / coût</i>), tranne quando distingue (<i>sûr / sur</i>, <i>mûr / mur</i>, <i>dû / du</i>).</li>
<li><i>oignon → ognon</i>, <i>nénuphar → nénufar</i>.</li>
<li>trattino in tutti i numeri composti: <i>vingt-et-un</i>, <i>deux-cent-trois</i>.</li>
<li><i>événement → évènement</i>, <i>porte-monnaie → portemonnaie</i>.</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>Non dire mai «septante» a Parigi: lì si dice <i>soixante-dix</i>. Capirai entrambi, ma devi usare quello giusto per il contesto.</li>
<li>Non tradurre «cena» con <i>souper</i> in Francia: suona antico.</li>
<li>Gli accenti non cambiano le regole dell'esame DELF: si usa il francese standard.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Il y a septante personnes.» [i-lya sèp-TÃT pèr-SÒN] (Belgio, Svizzera). «On soupe à sept heures.» · «Mon char est en panne.» (Québec).</div>`,
  [
    q(
      'q1',
      'Come si dice «70» in Belgio?',
      ['septante', 'soixante-dix', 'huitante', 'nonante'],
      0,
      'In Belgio e in Svizzera si usa septante. Huitante vale 80 e nonante 90; soixante-dix è la forma francese di Francia.',
    ),
    q(
      'q2',
      'Dove si usa «huitante» per 80?',
      [
        'In alcuni cantoni svizzeri',
        'In tutto il Belgio francofono',
        'Solo a Parigi e dintorni',
        'Nelle province del Québec',
      ],
      0,
      'Huitante è tipico di alcuni cantoni della Svizzera romanda come Vaud, Vallese, Friburgo. Il Belgio usa quatre-vingts.',
    ),
    q(
      'q3',
      'Che cosa significa «souper» in Québec?',
      ['cena', 'colazione', 'pranzo', 'spuntino'],
      0,
      'In Québec (e in Belgio) il souper è la cena, il dîner è il pranzo e il déjeuner la colazione. In Francia è tutto spostato; in Svizzera dîner e souper valgono pranzo e cena.',
    ),
    q(
      'q4',
      'Che cosa significa «char» in Québec?',
      ['auto', 'carro armato', 'carne', 'chiave'],
      0,
      '«Mon char» è la mia auto. In Francia char significa invece carro (il carro armato o il carro di Carnevale).',
    ),
    q(
      'q5',
      'Che cosa significa «magasiner» in Québec?',
      ['fare shopping', 'immagazzinare', 'magazzinare prodotti', 'guadagnare'],
      0,
      'Magasiner viene da magasin (negozio) e vuol dire fare acquisti. Non ha il senso di magazzino-immagazzinare.',
    ),
    q(
      'q6',
      'Come si pronuncia «septante» ?',
      ['[sèp-TÃT]', '[sep-TANT]', '[sèt-TÃ]', '[sèp-TÃ]'],
      0,
      'La p si pronuncia (a differenza di sept [SÈT]) e la t finale è sonora: [TÃT], con la nasale ã senza n.',
    ),
    q(
      'q7',
      'Come si scrive nella grafia riformata «oignon» ?',
      ['ognon', 'ogniono', 'oinon', 'onion'],
      0,
      'La riforma del 1990 ha semplificato oignon in ognon, che si pronuncia sempre [o-GNÕ]. Entrambe le grafie sono accettate.',
    ),
    q(
      'q8',
      "Quale pronuncia caratterizza l'accento del Québec?",
      [
        't e d davanti a i/ü si affricano: tu [TSÜ]',
        'le vocali nasali diventano tutte orali',
        "la r si pronuncia all'italiana, arrotata",
        'tutte le e finali sono mute come in italiano',
      ],
      0,
      "L'affricazione di t e d prima di i, ü è la caratteristica più riconoscibile. Le nasali si mantengono.",
    ),
    q(
      'q9',
      'Se un amico in Québec dice «On soupe à sept heures», quando mangiate?',
      ['la sera', 'a mezzogiorno', 'a colazione', 'a mezzanotte'],
      0,
      'Souper è la cena; quindi alle sette di sera. Non è un pranzo.',
    ),
    q(
      'q10',
      "Che cos'è un «maquis» in Costa d'Avorio?",
      [
        "un ristorante all'aperto semplice",
        'una macchia di vegetazione fitta e bassa',
        'un tipo di taxi collettivo urbano',
        'un mercato di stoffe e tessuti',
      ],
      0,
      "In Costa d'Avorio il maquis è un ristorante semplice, spesso all'aperto. Il senso di macchia mediterranea resta quello del francese di Francia.",
    ),
    q(
      'q11',
      'Quale affermazione sul francese in Africa è corretta?',
      [
        'Ufficiale in molti paesi subsahariani, non in Maghreb',
        'È ufficiale in tutti i paesi africani senza eccezioni',
        'È ufficiale in Marocco, Algeria e Tunisia ma non altrove',
        'Non è lingua ufficiale in nessun paese africano oggi',
      ],
      0,
      "Il francese è ufficiale in oltre 20 stati subsahariani. Nel Maghreb ha un forte ruolo nell'istruzione e nei media, ma non è lingua ufficiale.",
    ),
  ],
  [
    card('c1', 'septante / nonante', '70 / 90 in Belgio, Svizzera, RD Congo, Ruanda, Burundi.'),
    card('c2', 'huitante', '80 in Vaud, Vallese, Friburgo (Svizzera); altrove quatre-vingts.'),
    card(
      'c3',
      'Pasti',
      'Belgio, Québec: déjeuner (colazione), dîner (pranzo), souper (cena). Svizzera romanda: dîner (pranzo), souper (cena).',
    ),
    card('c4', 'drache', 'Belgio: pioggia forte.'),
    card('c5', 'natel', 'Svizzera: cellulare.'),
    card('c6', 'poutzer', 'Svizzera: pulire (dal tedesco putzen).'),
    card('c7', 'char', 'Québec: auto.'),
    card('c8', 'magasiner', 'Québec: fare shopping.'),
    card('c9', 'dépanneur', 'Québec: piccolo negozio aperto a lungo.'),
    card('c10', 'bienvenue', 'Québec: risposta a merci (prego).'),
    card('c11', 'Riforma 1990', 'ognon, nénufar, circonflesso facoltativo, trattino nei numeri.'),
    card(
      'c12',
      'nouchi / maquis',
      "Costa d'Avorio: nouchi = slang dei giovani; maquis = ristorante semplice all'aperto.",
    ),
    card(
      'c13',
      'Francese in Africa',
      'Ufficiale in oltre 20 stati subsahariani; nel Maghreb non è ufficiale ma è diffuso (scuola, media).',
    ),
  ],
  [
    prac(
      'p1',
      'Scrivi in lettere e con pronuncia 70, 80 e 90 nella forma belga.',
      '70 septante [sèp-TÃT]; 80 quatre-vingts [ka-trë-VẼ]; 90 nonante [no-NÃT]. Nota: huitante è solo in alcuni cantoni svizzeri.',
    ),
    prac(
      'p2',
      'Spiega a un amico italiano perché «déjeuner» è ambiguo.',
      'In Francia déjeuner è il pranzo; in Belgio e in Québec è la colazione (in Svizzera romanda si dice di solito petit-déjeuner). Nota: la cena è dîner (Francia) o souper (altrove).',
    ),
    prac(
      'p3',
      'Traduci in francese del Québec: «Vado a fare shopping con la mia auto.»',
      'Je vais magasiner avec mon char. Nota: magasiner, char.',
    ),
    prac(
      'p4',
      'Riscrivi con ortografia riformata: «Le maître a mangé un oignon.»',
      'Le maitre a mangé un ognon. Nota: entrambe le grafie sono ammesse.',
    ),
    prac(
      'p5',
      'Descrivi due differenze tra francese di Parigi e del Québec.',
      'Vocabolario (voiture / char, week-end / fin de semaine) e pronuncia (tu [TÜ] / [TSÜ]). Nota: la grammatica è la stessa.',
    ),
  ],
)

export const fraFalsiamici: CourseModule = mod(
  'fr-falsiamici',
  'Falsi amici I: nomi, oggetti e luoghi',
  "50 nomi ingannevoli, genere diverso dall'italiano, parole che sembrano italiane",
  'b2',
  `<p class="lead">Francese e italiano condividono migliaia di parole, ma una parte ha cambiato senso. Questa prima lista raccoglie i <b>falsi amici nominali</b> più insidiosi; verbi, aggettivi, avverbi ed errori tipici sono nel modulo successivo (<i>fr-falsiamici2</i>). Ogni riga: la parola francese e che cosa significa davvero.</p>
<h3>Nomi: oggetti e luoghi</h3>
<div class="tblw"><table><tr><th>Francese</th><th>Significa (non...)</th></tr>
<tr><td>la bague</td><td>anello (non bagaglio: les bagages)</td></tr>
<tr><td>la caméra</td><td>telecamera (camera = la chambre)</td></tr>
<tr><td>la cave</td><td>cantina (non cava: la carrière)</td></tr>
<tr><td>le car</td><td>pullman (auto = la voiture)</td></tr>
<tr><td>le magasin</td><td>negozio (magazzino = l'entrepôt)</td></tr>
<tr><td>la librairie</td><td>negozio di libri (biblioteca = la bibliothèque)</td></tr>
<tr><td>la veste</td><td>giacca (veste = la robe, le vêtement)</td></tr>
<tr><td>la robe</td><td>abito da donna (roba = les affaires)</td></tr>
<tr><td>la panne</td><td>guasto (panna = la crème)</td></tr>
<tr><td>le rhume</td><td>raffreddore (rum = le rhum)</td></tr>
<tr><td>le salon</td><td>salotto (salone = la grande salle)</td></tr>
<tr><td>sale (adj.)</td><td>sporco (sale = le sel)</td></tr>
<tr><td>le linge</td><td>biancheria (lingua = la langue)</td></tr>
<tr><td>la pelle</td><td>pala (pelle = la peau)</td></tr>
<tr><td>le poison</td><td>veleno (pesce = le poisson)</td></tr>
<tr><td>la grève</td><td>sciopero (greve = lourd)</td></tr>
<tr><td>les lunettes</td><td>occhiali (plurale)</td></tr>
<tr><td>le ménage</td><td>le pulizie di casa: faire le ménage</td></tr>
<tr><td>la gare</td><td>stazione (gara = la compétition)</td></tr>
<tr><td>l'essence</td><td>benzina (anche essenza)</td></tr>
<tr><td>la tasse</td><td>tazza (tassa = la taxe)</td></tr>
<tr><td>le morceau</td><td>pezzo (morso = la morsure)</td></tr>
<tr><td>le cabinet</td><td>studio medico (gabinetto = les toilettes)</td></tr>
<tr><td>la poche</td><td>tasca (poco = peu)</td></tr>
<tr><td>le pull</td><td>maglione</td></tr>
<tr><td>la chance</td><td>fortuna (chance = l'occasion)</td></tr>
<tr><td>d'occasion</td><td>di seconda mano</td></tr>
<tr><td>les parents</td><td>genitori (parenti = la famille)</td></tr>
<tr><td>les gens</td><td>la gente (plurale!)</td></tr>
<tr><td>un pantalon</td><td>i pantaloni (singolare)</td></tr>
<tr><td>le dessin / le dessein</td><td>disegno / proposito</td></tr>
<tr><td>la fatigue</td><td>stanchezza (fatica = l'effort, la peine)</td></tr>
<tr><td>le prénom / le nom</td><td>nome / cognome (nom de famille)</td></tr>
<tr><td>la course</td><td>corsa; faire les courses = fare la spesa</td></tr>
<tr><td>les affaires</td><td>le cose, gli affari</td></tr>
<tr><td>la bourse</td><td>borsa di studio, Borsa (borsa = le sac)</td></tr>
<tr><td>le banc</td><td>panchina (banca = la banque)</td></tr>
<tr><td>la chambre</td><td>camera da letto (camera = la pièce, la salle)</td></tr>
<tr><td>le vol</td><td>volo e furto</td></tr>
<tr><td>la veille</td><td>il giorno prima (la veille de Noël)</td></tr>
<tr><td>la pièce</td><td>stanza, moneta, pezzo di teatro</td></tr>
<tr><td>le tour / la tour</td><td>giro / torre</td></tr>
<tr><td>la monnaie</td><td>spiccioli, resto</td></tr>
<tr><td>le coin</td><td>angolo (non conio)</td></tr>
<tr><td>la salle</td><td>sala (salle de bains = bagno; salle à manger)</td></tr>
<tr><td>la cuisinière</td><td>cuoca; anche cucina a gas</td></tr>
<tr><td>le cadre</td><td>cornice; dirigente (quadro = le tableau)</td></tr>
<tr><td>le gilet</td><td>panciotto; anche cardigan (gilet de laine)</td></tr>
<tr><td>la rentrée</td><td>ripresa di scuola o lavoro a settembre</td></tr>
<tr><td>les ciseaux</td><td>le forbici (plurale)</td></tr>
</table></div>
<h3>Parole che non sono quello che sembrano: i gruppi più pericolosi</h3>
<ul>
<li><b>Luoghi</b>: la <i>librairie</i> vende libri (la biblioteca è la <i>bibliothèque</i>); la <i>cave</i> è la cantina; il <i>magasin</i> è un negozio qualunque; la <i>gare</i> è la stazione.</li>
<li><b>Vestiti</b>: la <i>robe</i> è un abito femminile, la <i>veste</i> una giacca, il <i>pull</i> un maglione: la «roba» italiana sono les <i>affaires</i>.</li>
<li><b>Tempo e denaro</b>: la <i>bourse</i> è la borsa di studio o la Borsa (la borsa che si porta è le <i>sac</i>); la <i>monnaie</i> è il resto; la <i>chance</i> è la fortuna.</li>
<li><b>Persone</b>: les <i>parents</i> sono i genitori (i parenti sono la <i>famille</i>); les <i>gens</i> è plurale.</li>
</ul>
<h3>Genere diverso dall'italiano</h3>
<p><b>la dent</b> (il dente), <b>la fleur</b> (il fiore), <b>la mer</b> (il mare), <b>la couleur</b> (il colore), <b>la chaleur</b> (il calore); al contrario <b>le lait</b> (il latte, uguale), <b>le sang</b> (il sangue), <b>le pont</b> (il ponte). Controlla il genere di ogni sostantivo quando lo impari: l'italiano non basta per indovinarlo.</p>
<h3>Come studiarli</h3>
<p>Impara la coppia «parola francese = significato vero» insieme alla parola francese che si usa per il significato italiano apparente: <i>la bague = l'anello</i>, ma «bagaglio» = <i>le bagage</i>. Ripeti ad alta voce le due frasi di contrasto: «J'ai perdu ma bague» (ho perso l'anello), «J'ai perdu mes bagages» (ho perso i bagagli).</p>
<div class="say"><b>Da ricordare.</b> «J'ai acheté un livre à la librairie.» · «La bague est dans le tiroir.» · «Les gens sont gentils.» · «Il y a une cave sous la maison.»</div>`,
  [
    q(
      'q1',
      'Che cosa significa «une bague» ?',
      ['un anello', 'un bagaglio', 'un tubo', 'una borsa'],
      0,
      "La bague è l'anello. Il bagaglio si dice le bagage: è l'assonanza con bagaglio a ingannare.",
    ),
    q(
      'q3',
      'Che cosa significa «sale» (aggettivo)?',
      ['sporco', 'salato', 'sale (da cucina)', 'sala'],
      0,
      "L'aggettivo sale vuol dire sporco. Il sale da cucina è le sel, e salato è salé: attenzione alla differenza.",
    ),
    q(
      'q8',
      'Quale frase è corretta?',
      ['Les gens sont sympas.', 'Les gens est sympa.', 'La gens est sympa.', 'Les gens sont sympa.'],
      0,
      "Gens è plurale in francese, e l'aggettivo si accorda: sympas. In italiano gente è singolare, è la trappola.",
    ),
    q(
      'q9',
      'Che cosa significa «cave» ?',
      ['cantina', 'cava', 'caverna', 'cavallo'],
      0,
      'La cave è la cantina (dove si conserva il vino). La cava di pietra si dice la carrière.',
    ),
    q(
      'q11',
      'Dove compri un romanzo?',
      ['À la librairie.', 'À la bibliothèque.', 'À la bourse.', 'À la gare.'],
      0,
      'La librairie è il negozio di libri. La bibliothèque è dove si prendono in prestito (la biblioteca): è il falso amico classico di libreria.',
    ),
    q(
      'q12',
      "Che cosa significa «J'ai une robe rouge» ?",
      ['Ho un vestito rosso (da donna)', 'Ho della roba rossa', 'Ho una veste rossa da cerimonia', 'Ho un rubino'],
      0,
      "La robe è l'abito femminile. La roba italiana in generale si traduce con les affaires o les choses, mai con robe.",
    ),
    q(
      'q13',
      'Quale parola vuol dire «genitori» ?',
      ['les parents', 'les gens', 'les parentés', 'les pères'],
      0,
      'Les parents sono i genitori. I parenti in senso largo sono la famille o les proches; les gens è la gente.',
    ),
    q(
      'q14',
      "Che cos'è «la panne» ?",
      ['un guasto', 'la panna', 'un tipo di pane', 'una padella'],
      0,
      "La panne è il guasto, tipicamente dell'auto (tomber en panne). La panna si dice la crème, come nella crème fraîche.",
    ),
  ],
  [
    card('c1', 'bague', 'Anello (non bagaglio = bagage).'),
    card('c3', 'sale / sel', 'Sale = sporco; sel = sale da cucina.'),
    card('c9', 'les gens', 'La gente: plurale.'),
    card('c11', 'librairie / bibliothèque', 'Librairie = negozio di libri; bibliothèque = biblioteca.'),
    card('c12', 'robe / veste', 'Robe = abito da donna; veste = giacca.'),
    card('c13', 'parents', 'Genitori; i parenti = la famille, les proches.'),
    card('c14', 'panne / crème', 'Panne = guasto; panna = crème.'),
    card('c15', 'cave', 'Cantina (non cava = carrière).'),
    card('c16', 'Come si dice «anello»?', 'La bague (non «bagaglio»: le bagage).'),
    card('c17', 'Come si dice «cantina»?', 'La cave (la cava di pietra = la carrière).'),
    card('c18', 'Come si dice «tazza»?', "La tasse (la tassa = la taxe, l'impôt)."),
    card('c19', 'Come si dice «stazione»?', 'La gare (la gara = la compétition).'),
  ],
  [
    prac(
      'p2',
      'Correggi: «Je suis allé au magasin pour acheter des livres.»',
      'Je suis allé à la librairie pour acheter des livres. Nota: magasin è un negozio generico; libri = librairie.',
    ),
    prac(
      'p3',
      'Traduci: «Sono sceso in cantina a prendere il vino.»',
      'Je suis descendu à la cave chercher du vin. Nota: cave = cantina (non cava); descendre prende être.',
    ),
    prac(
      'p6',
      'Traduci: «Mi sono comprata una tazza e un maglione.»',
      'Je me suis acheté une tasse et un pull. Nota: tasse = tazza (non tassa), pull = maglione; acheté invariabile con me COI.',
    ),
    prac(
      'p7',
      'Traduci: «I miei genitori hanno una macchina in panne.»',
      'Mes parents ont une voiture en panne. Nota: parents = genitori; en panne = guasta. Attenzione: non «mes parenti».',
    ),
  ],
)

export const fraFalsiamici2: CourseModule = mod(
  'fr-falsiamici2',
  'Falsi amici II: verbi, aggettivi ed errori tipici',
  'Verbi e aggettivi ingannevoli, interferenze di grammatica, cheat sheet',
  'b2',
  `<p class="lead">Dopo i nomi (<i>fr-falsiamici</i>), qui trovi i <b>verbi</b>, gli <b>aggettivi</b> e gli <b>avverbi</b> che ingannano, più le <b>interferenze</b> di grammatica italiane più frequenti. Molti sono falsi amici <b>parziali</b>: il senso italiano esiste anche in francese, ma non è il principale.</p>
<h3>Verbi</h3>
<div class="tblw"><table><tr><th>Francese</th><th>Significa (non...)</th></tr>
<tr><td>assister à</td><td>essere presente (assistere = aider)</td></tr>
<tr><td>fermer</td><td>chiudere (fermare = arrêter)</td></tr>
<tr><td>marcher</td><td>camminare, funzionare (marciare)</td></tr>
<tr><td>décevoir</td><td>deludere (ricevere = recevoir)</td></tr>
<tr><td>prétendre</td><td>sostenere (pretendere = exiger)</td></tr>
<tr><td>supporter</td><td>sopportare (sostenere = soutenir)</td></tr>
<tr><td>ignorer</td><td>non sapere (ignorare = ne pas tenir compte)</td></tr>
<tr><td>user</td><td>consumare (usare = utiliser)</td></tr>
<tr><td>visiter</td><td>luoghi; persone: rendre visite à</td></tr>
<tr><td>passer un examen</td><td>sostenere un esame (superare = réussir)</td></tr>
<tr><td>voler</td><td>rubare e volare</td></tr>
<tr><td>embrasser</td><td>baciare (abbracciare = serrer dans ses bras); baiser è volgare</td></tr>
<tr><td>assumer</td><td>accettare, assumersi (assumere = embaucher)</td></tr>
<tr><td>prévenir</td><td>avvisare; ma anche prevenire (prévenir une maladie)</td></tr>
<tr><td>défendre</td><td>vietare e difendere</td></tr>
<tr><td>garder</td><td>tenere, custodire (guardare = regarder)</td></tr>
<tr><td>causer</td><td>causare (causer un accident) e, familiare, chiacchierare (causer avec qqn)</td></tr>
<tr><td>manquer</td><td>mancare: tu me manques = mi manchi</td></tr>
<tr><td>arriver à</td><td>riuscire a (arriver à faire)</td></tr>
<tr><td>rentrer</td><td>tornare a casa</td></tr>
</table></div>
<h3>Aggettivi e avverbi</h3>
<div class="tblw"><table><tr><th>Francese</th><th>Significa (non...)</th></tr>
<tr><td>propre</td><td>pulito; prima del nome = proprio (mon propre avis)</td></tr>
<tr><td>ancien</td><td>ex, vecchio (ancien professeur)</td></tr>
<tr><td>bête</td><td>stupido (bestia = l'animal)</td></tr>
<tr><td>assez</td><td>abbastanza (assai = très, beaucoup)</td></tr>
<tr><td>justement</td><td>proprio (giustamente = à juste titre)</td></tr>
<tr><td>finalement</td><td>alla fine; finalmente = enfin</td></tr>
<tr><td>quand même</td><td>comunque, lo stesso</td></tr>
<tr><td>toujours</td><td>sempre, ancora</td></tr>
<tr><td>personne</td><td>persona; ne... personne = nessuno</td></tr>
<tr><td>déjeuner / dîner</td><td>pranzo / cena (colazione = petit-déjeuner)</td></tr>
<tr><td>tout à l'heure</td><td>fra poco o poco fa</td></tr>
<tr><td>depuis</td><td>da (durata): je travaille depuis 2 ans</td></tr>
<tr><td>il y a</td><td>fa: il y a deux ans = due anni fa</td></tr>
<tr><td>aussi</td><td>anche; aussi... que = tanto... quanto</td></tr>
</table></div>
<h3>Errori tipici degli italiani</h3>
<ul>
<li><b>Articoli partitivi</b>: «Mangio pane» → <i>Je mange du pain</i> (non «je mange pain»).</li>
<li><b>Avoir</b> per sensazioni: <i>avoir chaud, froid, faim, soif, peur, raison, tort, sommeil, besoin</i>; ma <i>j'ai vingt ans</i>.</li>
<li><b>Il y a</b> per «c'è/ci sono» (non «c'est»). <b>C'est</b> + nome.</li>
<li><b>Y e en</b>: pronomi che l'italiano rende con «ci» e «ne»: <i>J'y vais. J'en ai deux.</i></li>
<li><b>Pronuncia</b>: h muta, consonanti finali spesso mute, nasali, «u» e «eu».</li>
<li><b>Negazione</b> a due parti: ne... pas.</li>
<li><b>Accordo del participio</b> con avoir e COD che precede: <i>Les lettres que j'ai écrites</i>.</li>
</ul>
<h3>Cheat sheet</h3>
<p>1. <b>en fait ≠ infatti</b> (en effet). 2. <b>pranzo = déjeuner</b>. 3. <b>sale = sporco</b>. 4. <b>assez ≠ assai</b>. 5. <b>personne = nessuno</b> con ne. 6. <b>passer un examen = sostenerlo</b>. 7. <b>fermer ≠ fermare</b>. 8. <b>j'ai été</b>, mai «je suis été». 9. <b>causer</b> = causare e, familiare, chiacchierare. 10. <b>prévenir</b> = avvisare e anche prevenire.</p>
<div class="say"><b>Da ricordare.</b> «Je suis assez fatigué.» (abbastanza) · «J'ai passé l'examen hier.» (l'ho sostenuto) · «Je ne vois personne.»</div>`,
  [
    q(
      'q1',
      'Che cosa significa «fermer» ?',
      ['chiudere', 'fermare', 'firmare', 'affermare'],
      0,
      'Fermer = chiudere (une porte). Fermare si traduce arrêter. È uno dei falsi amici più frequenti.',
    ),
    q(
      'q2',
      "Che cosa significa «J'ai assez mangé» ?",
      ['Ho mangiato abbastanza', 'Ho mangiato molto', 'Ho mangiato troppo', 'Non ho mangiato abbastanza'],
      0,
      'Assez significa abbastanza, non assai. Per «molto» si dice beaucoup o très.',
    ),
    q(
      'q3',
      'Come si dice «Non vedo nessuno»?',
      ['Je ne vois personne.', 'Je ne vois nessun.', 'Je vois personne ne.', 'Je ne vois pas personne.'],
      0,
      'Personne è una parola negativa e va con ne. Pas personne è un doppio negativo non ammesso.',
    ),
    q(
      'q4',
      "Come si dice «Ho sostenuto l'esame»?",
      ["J'ai passé l'examen.", "J'ai réussi l'examen.", "J'ai échoué l'examen.", "J'ai soutenu l'examen."],
      0,
      'Passer un examen = sostenerlo, senza dire se è andato bene. Réussir è invece superarlo, échouer fallirlo.',
    ),
    q(
      'q5',
      'Come si dice «Ho 25 anni»?',
      ["J'ai 25 ans.", 'Je suis 25 ans.', 'Je suis 25 années.', "J'ai 25 années."],
      0,
      "In francese l'età si esprime con avoir + ans, come in italiano, non con être. Année indica la durata, non l'età.",
    ),
    q(
      'q6',
      'Che cosa significa «voler» ?',
      ['rubare e volare', 'solo volare', 'solo rubare', 'volere'],
      0,
      'Voler ha due sensi: volare e rubare. Volere si dice vouloir. Il contesto chiarisce il significato.',
    ),
    q(
      'q7',
      "Che cosa può significare «Le mauvais temps a causé l'accident» ?",
      [
        "Il maltempo ha provocato l'incidente",
        "Il maltempo ha chiacchierato dell'incidente",
        "Il maltempo ha evitato l'incidente",
        "Il maltempo ha denunciato l'incidente",
      ],
      0,
      'Causer vuol dire prima di tutto causare, come in italiano. Il senso di chiacchierare (causer avec un ami) è colloquiale e secondario.',
    ),
    q(
      'q8',
      'Quale frase usa «prévenir» nel senso di avvisare?',
      [
        'Préviens-moi si tu es en retard.',
        'Mieux vaut prévenir que guérir.',
        'Il a prévenu mon vélo hier.',
        "Il m'a prévenir hier soir.",
      ],
      0,
      'Prévenir qqn = avvisare qualcuno. Mieux vaut prévenir que guérir usa invece il senso di prevenire, che esiste ma non è quello chiesto qui.',
    ),
  ],
  [
    card('c2', 'fermer / arrêter', 'Fermer = chiudere; arrêter = fermare.'),
    card('c4', 'assez', 'Abbastanza (non assai).'),
    card('c5', 'passer un examen', 'Sostenere un esame; réussir = superarlo.'),
    card('c6', 'personne', 'Persona; con ne = nessuno.'),
    card('c7', 'déjeuner / dîner', 'Pranzo / cena (Francia); petit-déjeuner = colazione.'),
    card('c8', 'en fait / en effet', 'In realtà / infatti.'),
    card('c10', 'avoir + sensazione', 'avoir chaud, froid, faim, soif, peur, raison, tort, sommeil.'),
    card('c11', 'causer', 'Causare; familiare: chiacchierare.'),
    card('c12', 'prévenir', 'Avvisare (prévenir qqn) e anche prevenire (prévenir une maladie).'),
    card('c13', 'Come si dice «assai»?', 'Très, beaucoup (assez = abbastanza).'),
    card('c14', 'Come si dice «sostenere un esame»?', 'Passer un examen (réussir = superarlo).'),
    card('c15', 'Come si dice «chiudere»?', 'Fermer (arrêter = fermare).'),
  ],
  [
    prac(
      'p1',
      "Traduci: «Ho passato l'esame con 18.»",
      "J'ai réussi l'examen avec 18. Nota: «ho passato» = réussi, non passé (passer = sostenere).",
    ),
    prac(
      'p2',
      'Spiega la differenza tra «je suis assez content» e «je suis très content».',
      'Assez = abbastanza; très = molto. Nota: assai si traduce con très, beaucoup.',
    ),
    prac(
      'p3',
      'Traduci: «Fa caldo, ho sete.»',
      "Il fait chaud, j'ai soif. Nota: il fait chaud (tempo), j'ai chaud (sensazione).",
    ),
    prac(
      'p4',
      'Traduci: «Avvisami quando arrivi, così chiudo la porta.»',
      'Préviens-moi quand tu arrives, comme ça je ferme la porte. Nota: prévenir = avvisare; fermer = chiudere.',
    ),
    prac(
      'p5',
      "Traduci: «Mi sono bloccato: non ci sono riuscito, ma ho sostenuto l'esame.»",
      "Je suis resté bloqué : je n'y suis pas arrivé, mais j'ai passé l'examen. Nota: arriver à = riuscire a; passer un examen = sostenerlo.",
    ),
  ],
)
