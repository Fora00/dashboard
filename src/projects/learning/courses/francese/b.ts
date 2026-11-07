import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './b.pron'
import { fraCond, fraPassiva, fraRelatifs, fraTrapas } from './b.2'
import { fraConnecteurs, fraFalsiamici, fraFalsiamici2, fraRegistres, fraVariantes } from './b.3'
import { fraVocLavoro, fraVocViaggi, fraVocVita, fraVocVita2 } from './b.4'
import { fraDialoghi, fraDialoghi2, fraDrills, fraEsame } from './b.5'

// UNSURE CLAIMS TO REVIEW (francese B1-B2, written by the builder, not checked by a native speaker):
// - fr-subj1: "il est probable que" + indicatif (standard); "il me semble que" + indicatif vs "il semble que" + subjonctif;
//   "penser/croire" interrogativi: subjonctif o indicatif (entrambi accettati, qui presentato come scelta).
// - fr-subj2: "de sorte que" + subjonctif (scopo) / indicatif (conseguenza); "malgré que" censurato dai puristi;
//   "après que" + indicatif (norma) mentre nell'uso corrente si sente il subjonctif.
// - fr-trapas: tutte le forme di passé simple elencate (naquit, mourut, vécut, put, sut, voulut...); regola degli ausiliari di passer/monter/descendre/sortir/rentrer/retourner.
// - fr-cond: "si + conditionnel" accettato solo in interrogativa indiretta (je me demande si tu viendrais); "quand bien même + conditionnel".
// - fr-passiva: elenco dei participi presenti con grafia diversa dall'aggettivo (communicant/communiquant, précédant/précédent, excellant/excellent...); accordo dopo "faire + infinito".
// - fr-connecteurs: "plus-que-parfait / conditionnel" nel discorso indiretto (tabella di concordanza), "dont" con sostantivo.
// - fr-variantes: septante/nonante in Belgio e Svizzera, "huitante" solo in alcuni cantoni svizzeri (Vaud, Vallese, Friburgo; verificare l'elenco dei cantoni), déjeuner/dîner/souper in Belgio/Svizzera/Québec, "char", "magasiner", "dépanneur", "chum", affricazione di t/d in Québec, "nouchi"/"maquis" (Costa d'Avorio), "drache"/"natel"/"poutzer"/"panosse",
//   riforma ortografica 1990 (nénuphar/nénufar, "oignon" -> "ognon", circonflesso facoltativo su i/u, trait d'union nei numerali).
// - fr-falsiamici: significati dei falsi amici (es. "cadre", "gilet", "rentrée", "cuisinière", "assumer", "défendre", "embrasser"/"baiser"); la lista delle parole è fatta a memoria.
// - fr-esame: durate e punteggi DELF (A2: CO 25', CE 30', PE 45', PO 6-8'; B1: CO 25', CE 45', PE 45', PO 15'; B2: CO 30', CE 60', PE 60', PO 20'; 100 punti, soglia 50, minimo 5/25 per prova) - da verificare con il sito france-education-international.fr.
// - Pronuncia: tutte le trascrizioni [ ] (vocabolario, dialoghi, forme verbali) sono scritte a mano con la notazione italiana definita in francese.b.pron.ts (da allineare con il modulo fr-pron: legenda ë ü ö õ ã ẽ zh); la notazione italiana (ë, ü, ö, õ ã ẽ, zh) e' una semplificazione; le o aperte/chiuse (o / ò) sono indicate solo dove la regola e' chiara.
// - Vocabolario: genere dei sostantivi controllato a memoria (es. le/la "tour", "poêle", "vase", "page", "mode", "livre"): rileggere in particolare gli ambigui.

const fraSubj1: CourseModule = mod(
  'fr-subj1',
  'Subjonctif présent: formazione e usi',
  'Regolare e irregolare; volontà, necessità, emozione, dubbio, giudizio; subjonctif o indicatif',
  'b1',
  `<p class="lead">Il <b>subjonctif</b> (congiuntivo) in francese non si usa a caso: scatta dopo certi verbi ed espressioni, quando il parlante non afferma un fatto ma lo desidera, lo teme, lo giudica o lo mette in dubbio. La buona notizia: è molto più piccolo del congiuntivo italiano, perché il francese conosce quasi solo il <b>présent</b> (e il passé).</p>
${PRON_SHORT}
<h3>Quando si usa</h3>
<ul>
<li><b>Volontà</b>: vouloir que, souhaiter que, préférer que, exiger que, demander que. «Je veux que tu viennes.» (Voglio che tu venga.)</li>
<li><b>Necessità</b>: il faut que, il est nécessaire que, il est important que. «Il faut que je parte.» (Devo andare.)</li>
<li><b>Emozione</b>: être content / triste / surpris que, avoir peur que, regretter que, craindre que. «Je suis content que tu sois là.»</li>
<li><b>Dubbio e possibilità</b>: douter que, il est possible que, il se peut que, je ne pense pas que. «Je doute qu'il vienne.»</li>
<li><b>Giudizio</b>: il est normal / dommage / bizarre que, c'est bien que. «C'est dommage qu'il pleuve.»</li>
</ul>
<h3>Formazione regolare</h3>
<p>Si parte dalla 3a persona plurale del présent: <b>ils parlent</b> → radice <i>parl-</i>; <b>ils finissent</b> → <i>finiss-</i>; <b>ils vendent</b> → <i>vend-</i>. Poi si aggiungono <b>-e, -es, -e, -ions, -iez, -ent</b>.</p>
<div class="tblw"><table><tr><th>Forma</th><th>Pronuncia</th></tr>
<tr><td>que je parle</td><td>[kë zhë PARL]</td></tr>
<tr><td>que tu parles</td><td>[kë tü PARL]</td></tr>
<tr><td>qu'il parle</td><td>[kil PARL]</td></tr>
<tr><td>que nous parlions</td><td>[kë nu par-LYÕ]</td></tr>
<tr><td>que vous parliez</td><td>[kë vu par-LYÉ]</td></tr>
<tr><td>qu'ils parlent</td><td>[kil PARL]</td></tr>
</table></div>
<p><b>Omofoni:</b> <i>parle, parles, parlent</i> si pronunciano allo stesso modo [PARL]: -e, -es, -ent sono muti. Per distinguerle si ascolta il soggetto, non il verbo. Altri esempi: que je finisse [kë zhë fi-NIS], que nous finissions [kë nu fi-ni-SYÕ], que je vende [kë zhë VÃD].</p>
<h3>Verbi con due radici</h3>
<div class="tblw"><table><tr><th>Infinito</th><th>que je / tu / il / ils</th><th>que nous / vous</th></tr>
<tr><td>être</td><td>sois, soit, soient [SUA]</td><td>soyons [sua-YÕ]</td></tr>
<tr><td>avoir</td><td>aie, aies, ait, aient [È]</td><td>ayons [è-YÕ]</td></tr>
<tr><td>aller</td><td>aille, ailles, aillent [AY]</td><td>allions [a-LYÕ]</td></tr>
<tr><td>faire</td><td>fasse, fasses, fassent [FAS]</td><td>fassions [fa-SYÕ]</td></tr>
<tr><td>pouvoir</td><td>puisse, puissent [PÜIS]</td><td>puissions [püi-SYÕ]</td></tr>
<tr><td>savoir</td><td>sache, sachent [SASH]</td><td>sachions [sa-SHYÕ]</td></tr>
<tr><td>vouloir</td><td>veuille, veuillent [VÖY]</td><td>voulions [vu-LYÕ]</td></tr>
<tr><td>prendre</td><td>prenne, prennent [PRÈN]</td><td>prenions [prë-NYÕ]</td></tr>
<tr><td>venir</td><td>vienne, viennent [VYÈN]</td><td>venions [vë-NYÕ]</td></tr>
<tr><td>voir</td><td>voie, voient [VUA]</td><td>voyions [vua-YÕ]</td></tr>
<tr><td>boire</td><td>boive, boivent [BUAV]</td><td>buvions [bü-VYÕ]</td></tr>
</table></div>
<p>Il resto del paradigma segue la regola: <i>que j'aille, que tu viennes, qu'il boive</i>. Con <i>falloir</i> e <i>pleuvoir</i>: <b>qu'il faille</b>, <b>qu'il pleuve</b>.</p>
<h3>Stesso soggetto: infinito, non subjonctif</h3>
<p>Se il soggetto della frase principale e quello della subordinata coincidono, si usa l'infinito: <b>Je veux partir</b> (non «je veux que je parte»); <b>Je suis content d'être là</b> (non «content que je sois là»). Soggetti diversi: <b>Je veux que tu partes</b>.</p>
<h3>Subjonctif o indicatif?</h3>
<ul>
<li><b>Indicatif</b> quando il fatto è dato per certo: je sais que, je pense que, je crois que, il est certain que, il est évident que, il me semble que, j'espère que. «Je pense qu'il a raison.»</li>
<li><b>Subjonctif</b> quando c'è dubbio: je ne pense pas que, je ne crois pas que, il n'est pas sûr que, il semble que. «Je ne pense pas qu'il ait raison.»</li>
<li>Dopo <i>penser / croire</i> in interrogativa si trovano entrambi: «Tu crois qu'il viendra ?» / «Crois-tu qu'il vienne ?» (il subjonctif è più formale ed esprime più dubbio).</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>«Penso che sia» = je pense qu'il est.</b> In italiano il congiuntivo segue penso / credo anche in frase affermativa; in francese no: indicatif.</li>
<li><b>«Spero che venga» = j'espère qu'il viendra.</b> Dopo <i>espérer</i> serve l'indicativo (e il futuro, se l'azione è futura).</li>
<li><b>«Mi sembra che» = il me semble que + indicatif</b>, ma <b>«sembra che» = il semble que + subjonctif</b>.</li>
<li>Il congiuntivo imperfetto italiano («volevo che venisse») diventa il <b>subjonctif présent</b>: «Je voulais qu'il vienne.» L'imparfait du subjonctif (qu'il vînt) è solo letterario.</li>
<li>Non esiste «je veux que tu <i>viens</i>»: errore da principianti, perché la forma dell'indicativo è spesso uguale a quella del subjonctif (tu viens / tu viennes: [VYẼ] ≠ [VYÈN]).</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Il faut que tu viennes» [il fo kë tü VYÈN]; «Je veux que vous soyez à l'heure»; «Je ne pense pas qu'il ait le temps»; ma «J'espère qu'il viendra».</div>`,
  [
    q(
      'q1',
      'Completa: «Il faut que tu ___ ta chambre avant de sortir.» (ranger)',
      ['ranges', 'ranger', 'rangeras', 'rangeais'],
      0,
      'Il faut que richiede il subjonctif: la forma è tu ranges (uguale al présent). Ranger sarebbe senza que, rangeras e rangeais sono indicatif.',
    ),
    q(
      'q2',
      'Come si dice «Voglio che siate puntuali»?',
      [
        "Je veux que vous soyez à l'heure.",
        "Je veux que vous êtes à l'heure.",
        "Je veux vous être à l'heure.",
        "Je veux que vous serez à l'heure.",
      ],
      0,
      "Dopo vouloir que, con soggetti diversi, si usa il subjonctif: vous soyez. L'infinito vale solo con lo stesso soggetto.",
    ),
    q(
      'q3',
      "Completa: «J'espère qu'il ___ demain.» (venir)",
      ['viendra', 'vienne', 'viendrait', 'venait'],
      0,
      "Dopo espérer que il francese usa l'indicativo, qui il futuro. Vienne è il riflesso dell'italiano «spero che venga», ed è sbagliato.",
    ),
    q(
      'q4',
      "Completa: «Je pense qu'elle ___ raison, en ce moment.»",
      ['a', 'ait', 'aie', 'avons'],
      0,
      "Penser que in frase affermativa regge l'indicativo: elle a raison. Ait è la trappola del congiuntivo italiano «penso che abbia».",
    ),
    q(
      'q5',
      "Completa: «Je ne pense pas qu'il ___ le temps.»",
      ['ait', 'a', 'aura', 'avait'],
      0,
      "Penser alla forma negativa esprime dubbio e vuole il subjonctif: qu'il ait. Con la forma affermativa invece si userebbe a.",
    ),
    q(
      'q6',
      'Completa: «Nous sommes ravis que vous ___ avec nous.» (venir)',
      ['veniez', 'venez', 'viendrez', 'viendriez'],
      0,
      "Emozione (ravi que) vuole il subjonctif; per vous la radice è quella di nous (ven-) più -iez. Venez è l'indicatif, viendrez il futuro.",
    ),
    q(
      'q7',
      'Come si traduce «Voglio partire»?',
      ['Je veux partir.', 'Je veux que je parte.', 'Je veux que partir.', 'Je veux de partir.'],
      0,
      "Con lo stesso soggetto si usa l'infinito senza preposizione dopo vouloir. Que + subjonctif servirebbe solo con soggetti diversi.",
    ),
    q(
      'q8',
      'Quale frase NON è corretta?',
      [
        "Il me semble qu'il ait raison.",
        "Il me semble qu'il a raison.",
        "Il semble qu'il ait raison.",
        "Il n'est pas sûr qu'il ait raison.",
      ],
      0,
      "Il me semble que regge l'indicativo (a raison); il semble que, impersonale, regge il subjonctif (ait). La prima frase mescola le due regole.",
    ),
    q(
      'q9',
      'Quale di queste forme si pronuncia come «que je parle» [kë zhë PARL]?',
      ["qu'ils parlent", 'que nous parlions', 'que vous parliez', 'que je parlai'],
      0,
      'Le desinenze -e, -es, -ent sono mute, quindi parle e parlent suonano uguali. Parlions e parliez hanno una sillaba in più.',
    ),
    q(
      'q10',
      "Come si pronuncia «qu'ils aillent»?",
      ['[kil-ZAY]', '[kil-za-LÕ]', '[kil-ZAYNT]', '[kil-ZÈ]'],
      0,
      'La -ent finale è muta, il «s» di ils diventa z per la liaison davanti a vocale, e «ill» dopo a si legge come «ay» veloce.',
    ),
  ],
  [
    card(
      'c1',
      'Formazione del subjonctif présent',
      'Radice di ils (présent) + -e, -es, -e, -ions, -iez, -ent. Es.: ils finissent → que je finisse.',
    ),
    card(
      'c2',
      'être al subjonctif',
      "que je sois, que tu sois, qu'il soit, que nous soyons, que vous soyez, qu'ils soient [SUA / sua-YÕ].",
    ),
    card(
      'c3',
      'avoir al subjonctif',
      "que j'aie, que tu aies, qu'il ait, que nous ayons, que vous ayez, qu'ils aient.",
    ),
    card('c4', 'aller / faire al subjonctif', "que j'aille, que nous allions; que je fasse, que nous fassions."),
    card('c5', 'pouvoir / savoir / vouloir', 'que je puisse; que je sache; que je veuille (nous voulions).'),
    card('c6', 'Stesso soggetto', 'Infinito: Je veux partir, non «je veux que je parte».'),
    card('c7', 'Spero che venga', "J'espère qu'il viendra: indicatif dopo espérer, non subjonctif."),
    card(
      'c8',
      'Penso che abbia ragione',
      "Je pense qu'il a raison (indicatif). Je ne pense pas qu'il ait raison (subjonctif).",
    ),
    card(
      'c9',
      'Il me semble que / il semble que',
      "Il me semble qu'il a raison (indicatif); il semble qu'il ait raison (subjonctif).",
    ),
    card('c10', 'parle / parles / parlent', 'Stessa pronuncia [PARL]: -e, -es, -ent sono muti.'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Voglio che tu venga con noi.»',
      'Je veux que tu viennes avec nous. Nota: soggetti diversi, quindi que + subjonctif (viennes).',
    ),
    prac(
      'p2',
      'Traduci: «Spero che tu stia bene.»',
      "J'espère que tu vas bien. Nota: dopo espérer si usa l'indicativo (vas), non «aille».",
    ),
    prac(
      'p3',
      "Correggi: «Je pense qu'il soit malade.»",
      "Je pense qu'il est malade. Nota: penser que affermativo regge l'indicativo. (Je ne pense pas qu'il soit malade sarebbe corretta.)",
    ),
    prac(
      'p4',
      'Completa con il verbo tra parentesi: «Il faut que nous (faire) attention.»',
      'Il faut que nous fassions attention. Nota: la radice di faire al subjonctif è fass-; fassions [fa-SYÕ].',
    ),
    prac(
      'p5',
      'Produci tre frasi con emozione, dubbio e giudizio usando il subjonctif.',
      "Esempio: Je suis heureux que tu sois là. / Je doute qu'il puisse venir. / C'est dommage que nous soyons déjà en retard. Nota: controlla soggetti diversi e forme irregolari (sois, puisse).",
    ),
  ],
)

const fraSubj2: CourseModule = mod(
  'fr-subj2',
  'Subjonctif con congiunzioni, passé, relative',
  'Bien que, pour que, avant que...; subjonctif passé; relative; concordanza dei tempi',
  'b1',
  `<p class="lead">Molte congiunzioni francesi reggono il subjonctif senza che nessuna emozione sia in gioco: è una questione di <b>lessico da imparare in blocco</b>. Qui le elenchiamo, con la pronuncia, e vediamo il subjonctif passé e le relative.</p>
${PRON_SHORT}
<h3>Congiunzioni + subjonctif</h3>
<div class="tblw"><table><tr><th>Congiunzione</th><th>Pronuncia</th><th>Significato</th></tr>
<tr><td>bien que / quoique</td><td>[byẽ-KË / kua-KË]</td><td>benché, sebbene</td></tr>
<tr><td>pour que / afin que</td><td>[pur-KË / a-fẽ-KË]</td><td>affinché</td></tr>
<tr><td>avant que</td><td>[a-vã-KË]</td><td>prima che</td></tr>
<tr><td>jusqu'à ce que</td><td>[zhüs-ka-së-KË]</td><td>finché, fino a quando</td></tr>
<tr><td>à condition que</td><td>[a kõ-di-syõ-KË]</td><td>a condizione che</td></tr>
<tr><td>pourvu que</td><td>[pur-vü-KË]</td><td>purché</td></tr>
<tr><td>à moins que</td><td>[a muẽ-KË]</td><td>a meno che</td></tr>
<tr><td>sans que</td><td>[sã-KË]</td><td>senza che</td></tr>
<tr><td>de peur que</td><td>[dë pör-KË]</td><td>per paura che</td></tr>
<tr><td>en attendant que</td><td>[ã-na-tã-dã-KË]</td><td>nell'attesa che</td></tr>
</table></div>
<p>Esempi: «Bien qu'il soit fatigué, il continue.» (Benché sia stanco, continua.) «Je te le dis pour que tu comprennes.» «Reste jusqu'à ce que je revienne.» «Sors à moins qu'il (ne) pleuve.» Il <i>ne</i> dopo <i>à moins que</i>, <i>avant que</i>, <i>de peur que</i> è «esplicativo»: facoltativo e senza valore negativo.</p>
<h3>Stesso soggetto: preposizione + infinito</h3>
<ul>
<li>pour que → <b>pour</b>: «Je travaille pour gagner ma vie.»</li>
<li>afin que → <b>afin de</b>; avant que → <b>avant de</b>: «Lave-toi les mains avant de manger.»</li>
<li>sans que → <b>sans</b>: «Il est parti sans dire au revoir.»</li>
<li>à condition que → <b>à condition de</b>; de peur que → <b>de peur de</b>.</li>
<li>après que → <b>après + infinito passato</b>: «Après avoir mangé, nous sommes sortis.»</li>
</ul>
<h3>Congiunzioni + indicatif</h3>
<p><b>parce que, puisque, pendant que, alors que, tandis que, dès que, aussitôt que, depuis que, si bien que</b> e soprattutto <b>après que</b> reggono l'indicativo: «Après qu'il est parti, j'ai pleuré.» (Nell'uso parlato si sente anche «après qu'il soit parti», ma la norma è l'indicativo.) <b>De sorte que / de façon que</b>: subjonctif se esprimono lo <i>scopo</i>, indicatif se esprimono la <i>conseguenza</i>.</p>
<h3>Quoique o quoi que?</h3>
<p><b>Quoique</b> (una parola, [kua-KË]) = benché, come bien que. <b>Quoi que</b> (due parole) = qualunque cosa: «Quoi que tu dises, je reste.» Si pronunciano uguali, si distinguono solo a scritto. <b>Malgré que</b> è criticato dai puristi: meglio <i>bien que</i>.</p>
<h3>Subjonctif passé</h3>
<p>Ausiliare al subjonctif présent + participio passato; si usa per un'azione <b>anteriore</b> a quella della principale: «Je suis content que tu aies réussi.» «Bien qu'il soit arrivé en retard...» «Je doute qu'elle se soit trompée.»</p>
<div class="tblw"><table><tr><th>Forma</th><th>Pronuncia</th></tr>
<tr><td>que j'aie fini</td><td>[kë zhè fi-NI]</td></tr>
<tr><td>qu'il ait fini</td><td>[ki-LÈ fi-NI]</td></tr>
<tr><td>que nous ayons fini</td><td>[kë nu-zè-yõ fi-NI]</td></tr>
<tr><td>que je sois parti(e)</td><td>[kë zhë sua par-TI]</td></tr>
<tr><td>qu'elle se soit trompée</td><td>[kèl së sua trõ-PÉ]</td></tr>
</table></div>
<p>Attenzione ai suoni: <i>sois, soit, soi</i> [SUA] e <i>ait, aie, aies, aient</i> [È] sono omofoni, con la è aperta; <i>j'aie</i> subjonctif [zhè] si distingue da <i>j'ai</i> indicatif [zhé] solo per la vocale (e molti parigini le fondono).</p>
<h3>Relative con subjonctif</h3>
<ul>
<li>Antecedente <b>cercato o inesistente</b>: «Je cherche un livre qui soit facile.» «Il n'y a personne qui puisse m'aider.»</li>
<li>Dopo <b>superlativi</b> e <i>le seul, le premier, le dernier, l'unique</i> il subjonctif è la scelta tipica quando c'è un giudizio personale: «C'est le plus beau film que j'aie jamais vu.» Se si constata un fatto, l'indicatif è possibile: «C'est le seul voyage que j'ai fait cette année.»</li>
<li>Antecedente <b>noto e reale</b>: indicativo: «Je cherche le livre qui est sur la table.»</li>
</ul>
<h3>Concordanza dei tempi</h3>
<p>Il subjonctif présent esprime contemporaneità o futuro, il passé l'anteriorità. Anche con la principale al passato si usa il présent: «Je voulais qu'il vienne.» «Il fallait que tu partes.» L'<i>imparfait du subjonctif</i> (qu'il vînt, qu'il fût) è solo letterario: riconoscilo, non usarlo.</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>«Perché» finale = <b>pour que + subjonctif</b>; «perché» causale = <b>parce que + indicatif</b>.</li>
<li>«Nonostante» + nome = <i>malgré</i>; + verbo = <i>bien que + subjonctif</i>.</li>
<li>«A meno che non» = <i>à moins que (ne)</i>: «non» non va pensato come negazione.</li>
<li>«Prima di + infinito» = <i>avant de</i>; «prima che» = <i>avant que</i> + subjonctif.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Bien qu'il soit tard, je reste jusqu'à ce que tu finisses.» «Je t'appelle avant de partir.» «Après qu'il est parti...»</div>`,
  [
    q(
      'q1',
      '«___ il soit fatigué, il continue à travailler.»',
      ["Bien qu'", "Parce qu'", "Puisqu'", "Pendant qu'"],
      0,
      "Benché si traduce bien que + subjonctif (soit). Parce que, puisque e pendant que reggono l'indicatif e hanno un altro senso.",
    ),
    q(
      'q2',
      "Completa: «Je t'appelle avant que tu ___.» (partir)",
      ['partes', 'pars', 'partiras', 'partirais'],
      0,
      "Avant que vuole il subjonctif: tu partes. Pars è la forma dell'indicatif, ed è l'errore di chi traduce da avant di + infinito.",
    ),
    q(
      'q3',
      "Completa secondo la norma: «Après qu'il ___ arrivé, nous avons dîné.»",
      ['est', 'soit', 'sera', 'serait'],
      0,
      "Après que regge l'indicativo perché esprime un fatto reale e già avvenuto. Soit, molto diffuso nel parlato, è considerato un errore dalla norma.",
    ),
    q(
      'q4',
      'Completa: «Je travaille ___ gagner ma vie.»',
      ['pour', 'pour que', 'afin que', 'avant que'],
      0,
      'Con lo stesso soggetto si usa la preposizione + infinito: pour gagner. Pour que e afin que richiedono soggetti diversi e un subjonctif.',
    ),
    q(
      'q5',
      "Completa con il subjonctif passé: «C'est le plus beau voyage que j'___ jamais fait.»",
      ['aie', 'aies', 'avoir', 'aurais'],
      0,
      "Dopo un superlativo che esprime un giudizio personale la relativa prende il subjonctif passé: que j'aie fait. Aies è la forma di tu; avoir e aurais non si accordano con que j'.",
    ),
    q(
      'q6',
      'Completa: «Je cherche une secrétaire qui ___ parler allemand.»',
      ['sache', 'sait', 'savait', 'saura'],
      0,
      'La persona è cercata e non ancora nota: la relativa vuole il subjonctif (sache). Sait indicherebbe una persona già determinata.',
    ),
    q(
      'q7',
      'Completa: «Je suis heureux que tu ___ réussi hier.»',
      ['aies', 'as', 'avais', 'auras'],
      0,
      "Emozione (heureux que) + azione già avvenuta: subjonctif passé, qui con l'ausiliare al subjonctif: que tu aies réussi.",
    ),
    q(
      'q8',
      'Come si dice «Volevo che venisse»?',
      [
        "Je voulais qu'il vienne.",
        "Je voulais qu'il viendrait.",
        "Je voulais qu'il venait.",
        "Je voulais qu'il viendra.",
      ],
      0,
      "L'imperfetto congiuntivo italiano diventa un subjonctif présent. Imparfait, conditionnel o futuro dopo que sarebbero errori.",
    ),
    q(
      'q9',
      'Quale grafia è giusta? «___ tu dises, je te crois.» (qualunque cosa tu dica)',
      ['Quoi que', 'Quoique', "Qu'oi que", "Quoi qu'"],
      0,
      'Qualunque cosa si scrive in due parole, quoi que, e regge il subjonctif. Quoique, in una parola, significa invece benché.',
    ),
    q(
      'q10',
      'Come si pronuncia «avant que»?',
      ['[a-vã-KË]', '[a-vant-KE]', '[a-van-KUE]', '[a-vã-KI]'],
      0,
      'La -nt di avant è una nasale: ã senza n pronunciata. Que finale si legge con la e debole [kë], non con una e italiana piena.',
    ),
  ],
  [
    card('c1', 'bien que / quoique', "Benché: + subjonctif. «Bien qu'il soit tard...»"),
    card('c2', 'pour que / afin que', 'Affinché + subjonctif; stesso soggetto: pour / afin de + infinito.'),
    card('c3', 'avant que / avant de', 'Prima che + subjonctif; prima di + infinito.'),
    card('c4', "jusqu'à ce que", 'Finché (non) + subjonctif [zhüs-ka-së-KË].'),
    card('c5', 'à moins que (ne)', 'A meno che + subjonctif; il ne è esplicativo, facoltativo.'),
    card('c6', 'après que', "Dopo che + indicatif (norma): «Après qu'il est parti»."),
    card('c7', 'Subjonctif passé', "Ausiliare al subjonctif + participio: que j'aie fini, qu'il soit parti."),
    card(
      'c8',
      'Superlativo + relativa',
      "Subjonctif: le plus beau film que j'aie vu; le seul / le premier / le dernier...",
    ),
    card('c9', 'Quoique / quoi que', 'Quoique = benché (una parola); quoi que = qualunque cosa (due parole).'),
    card('c10', 'sois / soit / soi', 'Omofoni [SUA]: si distinguono solo dal contesto grammaticale.'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Nonostante sia stanco, lavora ancora.»',
      "Bien qu'il soit fatigué, il travaille encore. Nota: nonostante + verbo = bien que + subjonctif; malgré richiederebbe un nome (malgré sa fatigue).",
    ),
    prac(
      'p2',
      'Traduci: «Ti scrivo perché tu sappia la verità.»',
      "Je t'écris pour que tu saches la vérité. Nota: perché finale = pour que + subjonctif (saches).",
    ),
    prac(
      'p3',
      'Trasforma con infinito: «Je mange avant que je parte.»',
      'Je mange avant de partir. Nota: stesso soggetto, quindi avant de + infinito.',
    ),
    prac(
      'p4',
      "Correggi: «Après qu'il soit parti, j'ai fermé la porte.»",
      "Après qu'il est parti, j'ai fermé la porte. Nota: la norma vuole l'indicativo (est parti); il subjonctif è comune nel parlato ma sconsigliato nello scritto formale.",
    ),
    prac(
      'p5',
      'Traduci: «Cerco una casa che sia vicina al mare.»',
      "Je cherche une maison qui soit près de la mer. Nota: l'antecedente è cercato e non ancora noto, quindi subjonctif nella relativa.",
    ),
  ],
)

export const franceseB: CourseModule[] = [
  fraSubj1,
  fraSubj2,
  fraTrapas,
  fraCond,
  fraPassiva,
  fraRelatifs,
  fraConnecteurs,
  fraRegistres,
  fraVariantes,
  fraFalsiamici,
  fraFalsiamici2,
  fraVocVita,
  fraVocVita2,
  fraVocViaggi,
  fraVocLavoro,
  fraDialoghi,
  fraDialoghi2,
  fraDrills,
  fraEsame,
]
