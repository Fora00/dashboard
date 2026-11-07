import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './b.pron'

export const fraTrapas: CourseModule = mod(
  'fr-trapas',
  'Tempi composti, condizionale passato e passé simple',
  'Plus-que-parfait, futur antérieur, conditionnel passé, passé simple da riconoscere, concordanza dei tempi',
  'b1',
  `<p class="lead">I tempi composti seguono sempre lo stesso schema: <b>ausiliare (avoir / être) al tempo giusto + participio passato</b>. Qui vediamo i tre "trapassati" del francese, il passé simple (che si legge ma non si parla) e la concordanza con il discorso al passato.</p>
${PRON_SHORT}
<h3>Plus-que-parfait: imparfait dell'ausiliare + participio</h3>
<div class="tblw"><table><tr><th>Forma</th><th>Pronuncia</th></tr>
<tr><td>j'avais mangé</td><td>[zha-vè mã-ZHÉ]</td></tr>
<tr><td>tu avais fini</td><td>[tü a-vè fi-NI]</td></tr>
<tr><td>il était parti</td><td>[i-lé-tè par-TI]</td></tr>
<tr><td>nous étions partis</td><td>[nu-zé-TYÕ par-TI]</td></tr>
<tr><td>elle s'était levée</td><td>[èl sé-tè lë-VÉ]</td></tr>
</table></div>
<p>Esprime un fatto <b>anteriore a un altro passato</b>: «Quand je suis arrivé, le film avait déjà commencé.» (Quando sono arrivato, il film era già cominciato.) Accordo del participio come nel passé composé: con <i>être</i> si accorda col soggetto, con <i>avoir</i> col complemento oggetto che precede.</p>
<h3>Futur antérieur: futuro dell'ausiliare + participio</h3>
<p>Esempi: «J'aurai fini à midi.» [zho-ré fi-NI a mi-DI]; «Il sera parti.» [il së-ra par-TI]; «Nous serons arrivés.» [nu së-rõ za-ri-VÉ].</p>
<p>Si usa per un'azione futura <b>conclusa prima di un'altra</b> (dopo <i>quand, lorsque, dès que, aussitôt que, après que</i>): «Dès que tu auras fini, appelle-moi.» (Appena avrai finito, chiamami.) Anche per una supposizione sul passato: «Il aura oublié.» (Si sarà dimenticato.)</p>
<h3>Conditionnel passé: conditionnel dell'ausiliare + participio</h3>
<p>«J'aurais mangé» [zho-rè mã-ZHÉ], «il serait venu» [il së-rè vë-NÜ]. Usi: rimpianto o rimprovero («Tu aurais dû me prévenir.» = Avresti dovuto avvisarmi), ipotesi irreale nel passato (lo schema completo con si è in <i>fr-cond</i>), notizia non confermata («Selon la presse, le ministre aurait démissionné.») e futuro nel passato di un fatto già concluso.</p>
<h3>Passé simple: da riconoscere</h3>
<p>Nel francese scritto narrativo (romanzi, favole, storia) il passato "lontano" si fa con il <b>passé simple</b>; nel parlato e nella scrittura quotidiana si usa il passé composé. Le forme che incontri sono quasi solo la 3a persona.</p>
<div class="tblw"><table><tr><th>Infinito</th><th>il / elle</th><th>ils / elles</th></tr>
<tr><td>parler</td><td>parla [par-LA]</td><td>parlèrent [par-LÈR]</td></tr>
<tr><td>finir</td><td>finit [fi-NI]</td><td>finirent [fi-NIR]</td></tr>
<tr><td>être</td><td>fut [FÜ]</td><td>furent [FÜR]</td></tr>
<tr><td>avoir</td><td>eut [Ü]</td><td>eurent [ÜR]</td></tr>
<tr><td>faire</td><td>fit [FI]</td><td>firent [FIR]</td></tr>
<tr><td>dire</td><td>dit [DI]</td><td>dirent [DIR]</td></tr>
<tr><td>voir</td><td>vit [VI]</td><td>virent [VIR]</td></tr>
<tr><td>venir</td><td>vint [VẼ]</td><td>vinrent [VẼR]</td></tr>
<tr><td>prendre</td><td>prit [PRI]</td><td>prirent [PRIR]</td></tr>
<tr><td>pouvoir</td><td>put [PÜ]</td><td>purent [PÜR]</td></tr>
<tr><td>vouloir</td><td>voulut [vu-LÜ]</td><td>voulurent [vu-LÜR]</td></tr>
<tr><td>savoir</td><td>sut [SÜ]</td><td>surent [SÜR]</td></tr>
<tr><td>naître</td><td>naquit [na-KI]</td><td>naquirent [na-KIR]</td></tr>
<tr><td>mourir</td><td>mourut [mu-RÜ]</td><td>moururent [mu-RÜR]</td></tr>
</table></div>
<p>Esempio: «Il ouvrit la porte et vit un homme.» = nel parlato «Il a ouvert la porte et il a vu un homme.» Attenzione ai falsi omografi: <b>il vit</b> è sia <i>vivre</i> (présent: vive) sia <i>voir</i> (passé simple: vide); <b>il vint</b> [VẼ] ≠ <b>il vient</b> [VYẼ]; <b>il fit</b> [FI] ≠ <b>il fait</b> [FÈ].</p>
<h3>Concordanza dei tempi</h3>
<p>Quando il verbo principale è al passato, la subordinata cambia tempo:</p>
<div class="tblw"><table><tr><th>Rispetto alla principale</th><th>Tempo</th></tr>
<tr><td>contemporaneità</td><td>imparfait: Il a dit qu'il était fatigué.</td></tr>
<tr><td>anteriorità</td><td>plus-que-parfait: Il a dit qu'il avait mangé.</td></tr>
<tr><td>posteriorità</td><td>conditionnel présent: Il a dit qu'il partirait.</td></tr>
</table></div>
<h3>Omofoni da non confondere: é / er / ez</h3>
<p>Questi suoni sono tutti [é]: <b>parlé</b> (participio), <b>parler</b> (infinito), <b>parlez</b> (vous), <b>parlai</b> (passé simple). Trucco: se puoi sostituire con <i>vendu</i> è <b>-é</b>; se puoi sostituire con <i>vendre</i> è <b>-er</b>. «Il faut manger» (vendre) ≠ «j'ai mangé» (vendu). Invece <b>-ais, -ait, -aient</b> sono [è]: «il parlait» [il par-LÈ].</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>«Sono stato» = j'ai été</b>, mai «je suis été»: <i>être</i> prende <i>avoir</i>.</li>
<li><b>Passato remoto</b> italiano parlato (soprattutto al Sud) → in francese parlato <i>sempre passé composé</i>: «Nacque nel 1900» → «Il est né en 1900».</li>
<li><b>Passer, monter, descendre, sortir, rentrer, retourner</b> prendono <i>être</i> senza oggetto («Je suis passé chez toi») e <i>avoir</i> con un oggetto («J'ai passé deux heures»).</li>
<li>Dopo <i>quand, lorsque, dès que</i> il francese vuole il futuro dove l'italiano usa a volte il presente: «Appena arrivi, chiamami» → <i>Dès que tu arriveras, appelle-moi.</i></li>
</ul>
<div class="say"><b>Da ricordare.</b> «Tu aurais dû me prévenir.» «Il a dit qu'il viendrait.» «Dès que tu auras fini, appelle-moi.»</div>`,
  [
    q(
      'q1',
      '«Quand je suis arrivé, le film ___ déjà commencé.»',
      ['avait', 'a', 'aura', 'aurait'],
      0,
      'Il film era iniziato prima del mio arrivo: serve il plus-que-parfait, quindi avait + participio. A sarebbe passé composé.',
    ),
    q(
      'q2',
      '«Dès que tu ___ fini, appelle-moi.»',
      ['auras', 'as', 'avais', 'aurais'],
      0,
      'Dopo dès que, un’azione futura conclusa prima di un’altra vuole il futur antérieur: auras fini. Aurais sarebbe un condizionale.',
    ),
    q(
      'q3',
      '«Tu ___ dû me prévenir !» (rimprovero: avresti dovuto)',
      ['aurais', 'auras', 'avais', 'serais'],
      0,
      "Il rimprovero per un'azione non fatta si esprime con il conditionnel passé di devoir: aurais dû. Auras è un futuro anteriore, che guarda avanti.",
    ),
    q(
      'q4',
      '«Selon la presse, le ministre ___ démissionné.»',
      ['aurait', 'a', 'avait', 'aura'],
      0,
      'Il condizionale passato indica una notizia non confermata, cioè il giornalista non garantisce. A sarebbe una notizia certa.',
    ),
    q(
      'q5',
      'Come si dice nel parlato: «Elle naquit en 1900»?',
      ['Elle est née en 1900.', 'Elle naquit en 1900.', 'Elle naissait en 1900.', 'Elle naissa en 1900.'],
      0,
      'Il passé simple è solo scritto: nel parlato diventa passé composé. Naître prende être, quindi est née, con accordo al femminile.',
    ),
    q(
      'q6',
      "«Il a dit qu'il ___ le lendemain.»",
      ['viendrait', 'viendra', 'vient', 'venait'],
      0,
      'Con la principale al passato, un fatto posteriore si esprime con il conditionnel présent: viendrait. Viendra sarebbe una citazione diretta.',
    ),
    q(
      'q7',
      "«Hier, je ___ chez toi, mais tu n'étais pas là.»",
      ['suis passé', 'ai passé', 'avais passé', 'serais passé'],
      0,
      'Passer senza complemento oggetto, nel senso di fare una visita, prende être: je suis passé. Ai passé richiederebbe un oggetto (une heure).',
    ),
    q(
      'q8',
      '«Il faut ___ avant de partir.» (manger)',
      ['manger', 'mangé', 'mangez', 'mangée'],
      0,
      "Dopo il faut e dopo avant de c'è l'infinito. Si controlla sostituendo con vendre: «il faut vendre» funziona, «il faut vendu» no.",
    ),
    q(
      'q9',
      'Che cosa significa «Il vit à Paris»?',
      ['Vive a Parigi', 'Vide Parigi', 'Visse a Parigi', 'Vedeva Parigi'],
      0,
      'Vit è sia vivre (présent) sia voir (passé simple). Qui il complemento à Paris indica il luogo: è il verbo vivere al presente.',
    ),
    q(
      'q10',
      'Come si pronuncia «il parlait»?',
      ['[il par-LÈ]', '[il par-LÉ]', '[il par-LÈT]', '[il par-LAIT]'],
      0,
      "La desinenza -ait dell'imparfait è una è aperta [È], con la t muta. Parlé o parler, con la é chiusa, sono invece [LÉ].",
    ),
  ],
  [
    card('c1', 'Plus-que-parfait', "Imparfait di avoir / être + participio: j'avais mangé, il était parti."),
    card(
      'c2',
      'Futur antérieur',
      "Futuro di avoir / être + participio: j'aurai fini, il sera parti. Dopo quand / dès que.",
    ),
    card('c3', 'Conditionnel passé', "Conditionnel di avoir / être + participio: j'aurais mangé; Tu aurais dû..."),
    card('c4', 'Notizia non confermata', 'Conditionnel: «Selon la presse, le ministre aurait démissionné.»'),
    card('c5', 'Passé simple di être / avoir', 'il fut, ils furent; il eut, ils eurent. Solo scritto.'),
    card('c6', 'Passé simple: -er e -ir', 'il parla, ils parlèrent; il finit, ils finirent.'),
    card('c7', 'Concordanza: posteriorità', "Principale al passato → conditionnel présent: Il a dit qu'il partirait."),
    card('c8', 'Sono stato', "J'ai été (avoir come ausiliare), mai «je suis été»."),
    card('c9', 'é / er / ez', 'Tutti [é]: parlé, parler, parlez. Test: vendu → -é; vendre → -er.'),
    card('c10', 'vit / vint / fit', 'il vit = vive o vide; il vint [VẼ] ≠ il vient [VYẼ]; il fit [FI] ≠ il fait [FÈ].'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Quando sono arrivato, il treno era già partito.»',
      'Quand je suis arrivé, le train était déjà parti. Nota: plus-que-parfait con être (partir) e accordo col soggetto.',
    ),
    prac(
      'p2',
      'Traduci: «Avresti dovuto telefonarmi.»',
      'Tu aurais dû me téléphoner. Nota: conditionnel passé di devoir; il pronome me precede téléphoner.',
    ),
    prac(
      'p3',
      'Trasforma nel parlato: «Il prit son sac et sortit.»',
      'Il a pris son sac et il est sorti. Nota: passé simple → passé composé; sortir prende être.',
    ),
    prac(
      'p4',
      'Completa con il futur antérieur: «Quand elle (finir), nous partirons.»',
      "Quand elle aura fini, nous partirons. Nota: l'azione conclusa precede quella del futuro principale.",
    ),
    prac(
      'p5',
      'Riporta al passato: «Marie dit: Je suis fatiguée et je rentrerai tôt.»',
      "Marie a dit qu'elle était fatiguée et qu'elle rentrerait tôt. Nota: présent → imparfait, futur → conditionnel présent.",
    ),
  ],
)

export const fraCond: CourseModule = mod(
  'fr-cond',
  'Periodo ipotetico, condizionale e ipotesi',
  'Si + tempi, periodo misto, altre forme di ipotesi, si che non è condizione',
  'b1',
  `<p class="lead">Il periodo ipotetico francese è <b>più regolare</b> dell'italiano: dopo <b>si</b> non compaiono mai né il futuro né il condizionale (tranne nell'interrogativa indiretta). Il congiuntivo imperfetto italiano diventa un semplice <b>imparfait</b>. Questo modulo è il riferimento per i <b>periodi con si</b>; la formazione del conditionnel présent e i suoi usi di cortesia, consiglio e notizia non confermata sono nel modulo sul futuro (<i>fr-futur</i>), il conditionnel passé e il plus-que-parfait in <i>fr-trapas</i>.</p>
${PRON_SHORT}
<h3>I tre schemi con si</h3>
<div class="tblw"><table><tr><th>Tipo</th><th>Si +</th><th>Principale</th></tr>
<tr><td>reale / probabile</td><td>présent</td><td>futur, présent, impératif</td></tr>
<tr><td>irreale presente</td><td>imparfait</td><td>conditionnel présent</td></tr>
<tr><td>irreale passato</td><td>plus-que-parfait</td><td>conditionnel passé</td></tr>
</table></div>
<ul>
<li>«<b>Si tu viens</b>, je serai content.» (Se vieni, sarò contento.) «Si tu as faim, mange !»</li>
<li>«<b>Si j'avais</b> de l'argent, j'<b>achèterais</b> une maison.» (Se avessi soldi, comprerei una casa.)</li>
<li>«<b>Si j'avais su</b>, je ne <b>serais</b> pas <b>venu</b>.» (Se l'avessi saputo, non sarei venuto.)</li>
</ul>
<p>Si + elisione: <b>s'il, s'ils</b> ma <b>si elle, si on, si nous</b> (nessuna elisione). «S'il pleut» [sil PLÖ]. Il condizionale ha la desinenza -ais, che si pronuncia <b>è aperta</b> ([zhë vu-DRÈ]); il futuro ha -ai, [É] chiusa (per molti parigini i due suoni coincidono).</p>
<h3>Il periodo misto</h3>
<p>La condizione e la conseguenza possono stare in tempi diversi. Condizione nel passato, effetto che dura oggi: «Si j'avais étudié, je serais médecin maintenant.» (Se avessi studiato, ora farei il medico.) Condizione abituale o permanente, effetto nel passato: «Si j'étais plus courageux, je lui aurais parlé hier.» Lo schema è: <b>si + plus-que-parfait → conditionnel présent</b>, oppure <b>si + imparfait → conditionnel passé</b>. Regola pratica: guarda a quando si riferisce ciascuna parte, poi scegli il tempo di ciascuna.</p>
<h3>Altre forme di ipotesi</h3>
<ul>
<li><b>au cas où + conditionnel</b>: «Au cas où il pleuvrait, prends un parapluie.»</li>
<li><b>même si + présent / imparfait</b>: «Même si tu pars, je reste.» Stesso schema di si: mai conditionnel dopo même si.</li>
<li><b>comme si + imparfait / plus-que-parfait</b>: «Il parle comme s'il savait tout.»</li>
<li><b>si seulement + imparfait</b>: «Si seulement j'avais plus de temps !» (Se solo avessi più tempo.)</li>
<li><b>et si + imparfait</b> (proposta): «Et si on allait au cinéma ?» (E se andassimo al cinema?)</li>
<li><b>sauf si, à condition de, à supposer que, imaginons que</b> + subjonctif (le ultime due); <b>sinon, sans ça</b> (altrimenti): «Dépêche-toi, sinon on sera en retard.»</li>
</ul>
<h3>Quando si non è una condizione</h3>
<ul>
<li><b>Interrogativa indiretta</b>: «Je me demande si tu viendras / viendrais.» Qui <i>si</i> = «se» interrogativo e sono ammessi futuro e condizionale: non è una condizione.</li>
<li><b>Si avverbio</b> = così: «Il est si gentil !» (È così gentile!) Davanti a vocale, nessuna elisione tranne <i>s'il</i> e <i>s'ils</i>.</li>
<li><b>Si = invece sì</b>, risposta a una domanda negativa: «Tu n'aimes pas ça ? – Si !» (Non ti piace? – Sì, invece!)</li>
</ul>
<h3>Tabella di conversione</h3>
<div class="tblw"><table><tr><th>Italiano</th><th>Francese</th></tr>
<tr><td>Se avrò tempo, verrò</td><td>Si j'ai le temps, je viendrai</td></tr>
<tr><td>Se avessi tempo, verrei</td><td>Si j'avais le temps, je viendrais</td></tr>
<tr><td>Se avessi avuto tempo, sarei venuto</td><td>Si j'avais eu le temps, je serais venu</td></tr>
<tr><td>Se avessi studiato, ora sarei medico</td><td>Si j'avais étudié, je serais médecin</td></tr>
</table></div>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>«Se avrò tempo» = <b>si j'ai le temps</b> (présent, non futur). «Se potessi» = <b>si je pouvais</b>.</li>
<li>«Se avessi saputo» = <b>si j'avais su</b>. Non dire mai «si j'aurais su» (errore frequente).</li>
<li>«Volevo chiederti...» (cortesia) → <b>Je voulais te demander...</b>: l'imparfait di cortesia.</li>
<li>«E se...?» → <b>et si...?</b>, con imparfait: «Et si on partait ?»</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Si tu veux, on y va.» «Si j'étais riche, je voyagerais.» «Si j'avais étudié, je serais médecin.» «Je me demande si tu viendras.»</div>`,
  [
    q(
      'q1',
      "«Si tu ___ à l'heure, nous ne raterions pas le train.»",
      ['étais', 'serais', 'seras', 'sois'],
      0,
      "Dopo si l'irreale presente vuole l'imparfait; il condizionale (serais) va nella principale. Sois sarebbe il congiuntivo italiano trasposto.",
    ),
    q(
      'q2',
      "«Si j'avais plus de temps, je ___ un livre.»",
      ['lirais', 'lirai', 'lis', 'lisais'],
      0,
      'La principale di un periodo irreale presente vuole il condizionale: lirais. Lirai (futuro) si userebbe con si + présent.',
    ),
    q(
      'q3',
      "«Si elle avait pris un taxi, elle ___ à l'heure.»",
      ['serait arrivée', 'arriverait', 'est arrivée', 'était arrivée'],
      0,
      'Irreale nel passato: si + plus-que-parfait e conditionnel passé. Arriver prende être, con accordo femminile: serait arrivée.',
    ),
    q(
      'q4',
      "Completa il periodo misto: «Si j'avais étudié, je ___ médecin aujourd'hui.»",
      ['serais', 'aurais été', 'suis', 'serai'],
      0,
      "La condizione è nel passato (plus-que-parfait) ma l'effetto è oggi: serve il conditionnel présent, serais. Aurais été sposterebbe anche l'effetto nel passato.",
    ),
    q(
      'q5',
      "«Il parle comme s'il ___ tout.»",
      ['savait', 'saurait', 'sait', 'a su'],
      0,
      "Dopo comme si il francese usa l'imparfait, non il condizionale: l'equivalente italiano è il congiuntivo imperfetto (sapesse).",
    ),
    q(
      'q6',
      '«Au cas où il ___, prends un parapluie.»',
      ['pleuvrait', 'pleuvra', 'pleuve', 'pleut'],
      0,
      'Au cas où regge il conditionnel (pleuvrait). Non è come si, che vieta il condizionale: qui è la congiunzione stessa a richiederlo.',
    ),
    q(
      'q7',
      'Quale frase è SBAGLIATA?',
      [
        "Si j'aurais su, je serais venu.",
        "Si j'avais su, je serais venu.",
        'Si tu veux, on y va.',
        'Je me demande si tu viendrais.',
      ],
      0,
      "Dopo si non si usa mai il condizionale in una vera condizione. Nell'interrogativa indiretta, invece, il condizionale è ammesso.",
    ),
    q(
      'q8',
      'Come si traduce «Se avrò tempo, verrò»?',
      [
        "Si j'ai le temps, je viendrai.",
        "Si j'aurai le temps, je viendrai.",
        "Si j'aurais le temps, je viendrais.",
        "Si j'avais le temps, je viendrai.",
      ],
      0,
      "Italiano e francese differiscono: dopo si, il francese usa il présent anche se l'azione è futura. Il futuro va solo nella principale.",
    ),
    q(
      'q9',
      'Come si pronuncia «je voudrais»?',
      ['[zhë vu-DRÈ]', '[zhë vu-DRÉ]', '[zhë vud-RÈS]', '[zhë vu-DRÈZ]'],
      0,
      'La -s finale è muta, e la desinenza -ais è una è aperta. La é chiusa [DRÉ] sarebbe la forma del futuro, je voudrai.',
    ),
    q(
      'q10',
      'In quale frase si può usare un futuro dopo si?',
      [
        'Je me demande si elle viendra.',
        'Si elle viendra, je serai content.',
        'Même si tu partiras, je reste.',
        'Si nous aurons le temps, nous irons.',
      ],
      0,
      "Solo nell'interrogativa indiretta si significa «se» interrogativo e ammette il futuro. Nelle vere condizioni, anche dopo même si, serve il présent.",
    ),
  ],
  [
    card('c1', 'Si + présent', 'Principale: futur, présent o impératif. «Si tu viens, je serai content.»'),
    card('c2', 'Si + imparfait', "Principale: conditionnel présent. «Si j'avais de l'argent, j'achèterais...»"),
    card('c3', 'Si + plus-que-parfait', "Principale: conditionnel passé. «Si j'avais su, je serais venu.»"),
    card('c4', 'Mai dopo si', 'Mai futur né conditionnel nella condizione (eccezione: interrogativa indiretta).'),
    card(
      'c5',
      'Altri usi del conditionnel',
      'Cortesia, consiglio e notizia non confermata: modulo fr-futur. Conditionnel passé (rimpianto): modulo fr-trapas.',
    ),
    card(
      'c6',
      'Periodo misto',
      "Si + plus-que-parfait → conditionnel présent: «Si j'avais étudié, je serais médecin maintenant.»",
    ),
    card('c7', 'Rimpianto', "J'aurais dû...; Je n'aurais pas dû...; J'aurais aimé..."),
    card('c8', 'au cas où', '+ conditionnel: Au cas où il pleuvrait...'),
    card('c9', 'comme si', "+ imparfait o plus-que-parfait: Il parle comme s'il savait tout."),
    card('c10', 'Et si on...?', 'Proposta con imparfait: Et si on allait au cinéma ?'),
    card(
      'c11',
      'Si ≠ condizione',
      'Interrogativa indiretta (je me demande si tu viendras), avverbio «così» (si gentil), «sì» a domanda negativa (Si !).',
    ),
  ],
  [
    prac(
      'p1',
      'Traduci: «Se avessi più tempo, studierei il francese.»',
      "Si j'avais plus de temps, j'étudierais le français. Nota: si + imparfait → conditionnel présent.",
    ),
    prac(
      'p2',
      "Traduci: «Se non fossi andato alla festa, non l'avrei conosciuta.»",
      "Si je n'étais pas allé à la fête, je ne l'aurais pas rencontrée. Nota: plus-que-parfait + conditionnel passé; rencontrer è più naturale di connaître per «conoscere per la prima volta».",
    ),
    prac(
      'p3',
      'Correggi: «Si je saurai la réponse, je te la dirai.»',
      'Si je sais la réponse, je te la dirai. Nota: nessun futuro dopo si.',
    ),
    prac(
      'p4',
      'Traduci: «Se avessi studiato di più, ora avrei un lavoro migliore.»',
      "Si j'avais davantage étudié, j'aurais un meilleur travail maintenant. Nota: periodo misto, plus-que-parfait nella condizione e conditionnel présent nella conseguenza.",
    ),
    prac(
      'p5',
      "Trasforma in rimpianto: «Je n'ai pas étudié.»",
      "J'aurais dû étudier. Oppure: Si seulement j'avais étudié ! Nota: devoir al conditionnel passé + infinito.",
    ),
  ],
)

export const fraPassiva: CourseModule = mod(
  'fr-passiva',
  'Passiva, on, impersonale, gérondif, faire + infinito',
  'Strutture per evitare la passiva, forme impersonali, en + -ant, participe présent, faire e laisser + infinito',
  'b1',
  `<p class="lead">Il francese <b>evita la passiva</b> più dell'italiano: preferisce <b>on</b>, la forma attiva o la forma pronominale. In questo modulo vediamo anche le forme impersonali, il gérondif e <i>faire</i> + infinito. I pronomi relativi (<i>dont</i>, <i>lequel</i>, <i>ce dont</i>...) hanno un modulo a parte: <i>fr-relatifs</i>.</p>
${PRON_SHORT}
<h3>La passiva: être + participio</h3>
<p>«La lettre <b>est écrite</b> par Marie.» «Les fenêtres <b>ont été ouvertes</b>.» (<i>été</i> resta invariabile, il participio finale si accorda.) L'agente è introdotto da <b>par</b> (azione) o <b>de</b> (sentimenti, stati): «Il est aimé <b>de</b> tous.» Solo i verbi con complemento <i>oggetto diretto</i> hanno la passiva: non si può dire «il est téléphoné» per «gli è stato telefonato».</p>
<p>Il tempo si legge sull'ausiliare <i>être</i>: «La maison est vendue» (présent), «a été vendue» (passé composé), «était vendue» (imparfait), «sera vendue» (futur). Il participio si accorda sempre col soggetto, come con ogni altro verbo costruito con être.</p>
<h3>Come evitarla</h3>
<ul>
<li><b>on</b> [õ]: «On m'a volé mon sac.» (Mi hanno rubato la borsa.) «On parle français ici.» Nel parlato <i>on</i> = nous: «On y va ?» (Andiamo?) Liaison: <i>on a</i> [õ-NA], <i>on est</i> [õ-NÈ].</li>
<li><b>forma pronominale</b>: «Ça se dit.» «Le vin blanc se boit frais.» «Ça ne se fait pas.»</li>
<li>Trappola: «mi è stato dato» → <b>on m'a donné / j'ai reçu</b>, non «je suis donné».</li>
</ul>
<h3>Forme impersonali</h3>
<ul>
<li>il faut [il FO] (bisogna), il y a [i-lya] (c'è, ci sono), il pleut [il PLÖ], il s'agit de [il sa-zhi DË] (si tratta di), il manque, il reste, il vaut mieux que + subjonctif, il arrive que + subjonctif.</li>
<li>«Il est interdit de fumer.» «Il manque deux élèves.» «Il paraît que...» (Pare che...).</li>
<li>Trappola: <b>il s'agit de</b> non ha soggetto reale: «Dans ce livre, il s'agit d'un détective.» Mai «ce livre s'agit de».</li>
</ul>
<h3>Gérondif e participe présent</h3>
<p>Il <b>gérondif</b> = <b>en + radice di nous + -ant</b>: <i>en parlant</i> [ã par-LÃ], <i>en finissant</i> [ã fi-ni-SÃ], <i>en faisant</i> [ã fë-ZÃ]. Irregolari: en étant [ã-né-TÃ], en ayant [ã-nè-YÃ], en sachant [ã sa-SHÃ]. Esprime simultaneità, modo o mezzo, e il soggetto è <b>lo stesso</b> del verbo principale: «Il s'est blessé en courant.» «En travaillant dur, tu réussiras.» Con <b>tout en</b> = pur + gerundio: «Tout en riant, il pleurait.»</p>
<p>Il <b>participe présent</b> senza <i>en</i> è invariabile e più scritto: «Ayant fini, il est parti.» (Avendo finito...) Attenzione alla grafia: il participio e l'aggettivo verbale possono differire.</p>
<div class="tblw"><table><tr><th>Participio (verbo)</th><th>Aggettivo</th><th>Pronuncia</th></tr>
<tr><td>fatiguant</td><td>fatigant</td><td>[fa-ti-GÃ]</td></tr>
<tr><td>communiquant</td><td>communicant</td><td>[ko-mü-ni-KÃ]</td></tr>
<tr><td>différant</td><td>différent</td><td>[di-fé-RÃ]</td></tr>
<tr><td>précédant</td><td>précédent</td><td>[pré-sé-DÃ]</td></tr>
<tr><td>excellant</td><td>excellent</td><td>[èk-sè-LÃ]</td></tr>
<tr><td>négligeant</td><td>négligent</td><td>[né-gli-ZHÃ]</td></tr>
</table></div>
<p>Trappola: <b>«Sto mangiando»</b> si dice <i>je suis en train de manger</i> o semplicemente <i>je mange</i>, mai «je suis mangeant». Il gerundio italiano con soggetto diverso («Piovendo, restiamo a casa») → <i>Comme il pleut, on reste à la maison.</i></p>
<h3>Faire e laisser + infinito</h3>
<ul>
<li><b>faire + infinito</b> = far fare: «J'ai fait réparer la voiture.» «Il m'a fait rire.» «Je me suis fait couper les cheveux.» Il participio <i>fait</i> è invariabile: «Les voitures, je les ai fait réparer.»</li>
<li><b>laisser + infinito</b> = lasciare: «Laisse-moi parler.» [lès mua par-LÉ]. «Elle laisse jouer les enfants.» Idioma: «Laisse tomber !» (Lascia perdere!).</li>
<li>I pronomi vanno <b>davanti a faire / laisser</b>, non davanti all'infinito: «Je le fais venir» (lo faccio venire), «Laisse-le dormir».</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Cette maison a été vendue»; «On m'a volé mon sac»; «En rentrant, j'ai vu Paul»; «Il s'agit d'un problème»; «J'ai fait réparer la voiture».</div>`,
  [
    q(
      'q5',
      'Come si dice «Sto leggendo un libro»?',
      [
        'Je suis en train de lire un livre.',
        'Je suis lisant un livre maintenant.',
        'Je lisant un livre maintenant.',
        'Je suis à lire un livre maintenant.',
      ],
      0,
      'Il francese non ha la forma progressiva con il gerundio. Si usa être en train de + infinito oppure il semplice présent.',
    ),
    q(
      'q6',
      'Qual è il participe présent di «faire»?',
      ['faisant', 'fesant', 'faissant', 'faiçant'],
      0,
      'La radice di nous faisons dà faisant, pronunciato [fë-ZÃ], con la e debole. Fesant non è mai usata, nonostante il suono.',
    ),
    q(
      'q7',
      'Come si dice «La casa è stata venduta»?',
      ['La maison a été vendue.', 'La maison est été vendue.', 'La maison a été vendu.', 'La maison a étée vendue.'],
      0,
      'Il passé composé passivo è a été + participio accordato (vendue). Été non cambia mai; con avoir non si dice «est été».',
    ),
    q(
      'q8',
      'Come si dice «Ho fatto riparare la macchina»?',
      [
        "J'ai fait réparer la voiture.",
        "J'ai fait réparé la voiture.",
        "J'ai fait la voiture réparer.",
        "J'ai fait être réparée la voiture.",
      ],
      0,
      "Faire + infinito: l'infinito (réparer) segue direttamente faire. Il participio réparé sarebbe un errore da confusione é/er.",
    ),
    q(
      'q10',
      'Come si dice «Si tratta di un problema»?',
      ["Il s'agit d'un problème.", "Ça s'agit d'un problème.", "Il agit d'un problème.", "Ce s'agit d'un problème."],
      0,
      "S'agir de è un verbo solo impersonale: il soggetto è sempre il. Non ammette un soggetto concreto come ça o un libro.",
    ),
    q(
      'q11',
      'Quale frase ha il gérondif usato correttamente?',
      [
        'Il a eu un accident en conduisant trop vite.',
        'Il a eu un accident en conduit trop vite.',
        'Il a eu un accident en conduire trop vite.',
        'Il a eu un accident en conduisons trop vite.',
      ],
      0,
      'Il gérondif è en + radice di nous + -ant: nous conduisons dà en conduisant. Le altre forme usano un infinito, un participio o una voce coniugata.',
    ),
    q(
      'q12',
      'Come si dice «Mi hanno rubato la bicicletta»?',
      ["On m'a volé mon vélo.", 'Je suis volé mon vélo.', "Mon vélo m'a volé.", 'Ils ont été volés mon vélo.'],
      0,
      'Il francese evita la passiva con complemento di termine: on + verbo attivo, con me davanti. La costruzione italiana «sono stato rubato» non esiste.',
    ),
  ],
  [
    card('c1', 'Passiva', 'être + participio accordato, + par (azione) o de (stati): La lettre est écrite par Marie.'),
    card('c2', 'on', 'Si impersonale o nous nel parlato: On parle français ici. On y va ?'),
    card(
      'c3',
      'Gérondif',
      'en + radice di nous + -ant: en parlant, en finissant. Stesso soggetto del verbo principale.',
    ),
    card('c4', 'Sto mangiando', 'Je suis en train de manger / Je mange. Non «je suis mangeant».'),
    card(
      'c10',
      'faire + infinito',
      "J'ai fait réparer la voiture. Je me suis fait couper les cheveux (fait invariabile).",
    ),
    card('c11', "il s'agit de", 'Si tratta di: impersonale, soggetto sempre il.'),
    card('c12', 'par o de?', 'par = azione (écrit par Marie); de = sentimento o stato (aimé de tous).'),
    card(
      'c13',
      'Participio e aggettivo',
      "Il participe présent è invariabile e può avere grafia diversa dall'aggettivo: communiquant / communicant, précédant / précédent.",
    ),
    card('c14', 'tout en + -ant', 'Pur + gerundio: «Tout en riant, il pleurait.»'),
  ],
  [
    prac(
      'p3',
      'Rendi attiva con on: «Mon portefeuille a été volé.»',
      'On a volé mon portefeuille. Nota: on evita la passiva senza agente.',
    ),
    prac(
      'p4',
      'Traduci: «Tornando a casa, ho incontrato Paolo.»',
      "En rentrant à la maison, j'ai rencontré Paolo. Nota: gérondif con lo stesso soggetto.",
    ),
    prac(
      'p6',
      'Traduci: «Questa canzone è stata scritta da mia sorella.»',
      "Cette chanson a été écrite par ma sœur. Nota: passé composé passivo, participio accordato (écrite); agente d'azione con par.",
    ),
    prac(
      'p7',
      'Traduci: «Mi faccio tagliare i capelli domani.»',
      "Je me fais couper les cheveux demain. Nota: se faire + infinito per un'azione fatta da altri; il pronome precede faire.",
    ),
    prac(
      'p8',
      "Correggi: «Ce roman s'agit d'une famille italienne.»",
      "Dans ce roman, il s'agit d'une famille italienne. Nota: s'agir de è solo impersonale, il soggetto è sempre il.",
    ),
  ],
)

export const fraRelatifs: CourseModule = mod(
  'fr-relatifs',
  'Pronomi relativi: dont, lequel, ce qui / ce que',
  'Qui, que, où ripassati; dont, preposizione + qui / lequel, ce qui, ce que, ce dont, celui qui',
  'b1',
  `<p class="lead">I pronomi relativi sono il punto più difficile per un italiano: in italiano <i>che</i> e <i>cui</i> bastano quasi sempre, in francese bisogna scegliere in base alla <b>funzione</b> nella frase relativa. Qui <i>qui, que, où</i> (già visti in forma semplice) sono ripassati; il lavoro nuovo è su <b>dont</b>, sulle preposizioni e su <b>ce qui / ce que / ce dont</b>.</p>
${PRON_SHORT}
<h3>Regola d'oro: guarda la funzione</h3>
<div class="tblw"><table><tr><th>Pronome</th><th>Funzione</th><th>Esempio</th></tr>
<tr><td>qui [KI]</td><td>soggetto</td><td>L'homme qui parle</td></tr>
<tr><td>que [KË]</td><td>oggetto diretto</td><td>L'homme que je vois</td></tr>
<tr><td>où [U]</td><td>luogo, tempo</td><td>La ville où j'habite</td></tr>
<tr><td>dont [DÕ]</td><td>di cui</td><td>Le livre dont j'ai besoin</td></tr>
<tr><td>prép. + qui</td><td>persona</td><td>L'ami avec qui je sors</td></tr>
<tr><td>prép. + lequel</td><td>cosa</td><td>La table sur laquelle...</td></tr>
</table></div>
<p><b>Que</b> si elide davanti a vocale (<i>qu'il</i>), <b>qui</b> mai. Il verbo si accorda con l'antecedente: «C'est moi qui ai raison» (non «qui a»). Con <i>que</i> oggetto, il participio passato si accorda: «La lettre que j'ai écrite.»</p>
<h3>Dont: tutto ciò che in italiano è «di cui»</h3>
<ul>
<li>Sostituisce <b>de + nome</b>: «Le livre dont j'ai besoin» (avoir besoin <i>de</i>). «La femme dont je parle» (parler <i>de</i>).</li>
<li>Con un nome posseduto: «L'homme dont la fille est médecin.» (la cui figlia) L'ordine è fisso: <b>dont + articolo + nome</b>, mai «dont sa fille».</li>
<li>Dopo <i>dont</i> il soggetto viene prima del verbo: «Le film dont je t'ai parlé.»</li>
<li>Per la provenienza si usa <b>d'où</b> o <b>de + lequel</b>: «La ville d'où je viens.»</li>
</ul>
<h3>Preposizione + qui / lequel</h3>
<ul>
<li><b>Persona</b>: preposizione + <b>qui</b>: «La personne à qui je pense», «L'ami avec qui je sors», «Les gens chez qui j'habite».</li>
<li><b>Cosa</b>: preposizione + <b>lequel</b> [lë-KÈL], che si accorda: laquelle, lesquels, lesquelles. «La table sur laquelle j'ai posé le livre.» «Les raisons pour lesquelles il part.»</li>
<li>Con à e de: <i>auquel, à laquelle, auxquels, auxquelles</i>; <i>duquel, de laquelle, desquels, desquelles</i>. «Le projet auquel je travaille.»</li>
<li>Con i verbi in <i>à</i> riferiti a persone, <i>lequel</i> di solito si evita: <b>à qui</b> («l'ami à qui j'écris»).</li>
</ul>
<h3>Senza antecedente: ce qui, ce que, ce dont</h3>
<p>Quando il relativo non ha un nome davanti («quello che», «ciò che») si usa <b>ce</b> + relativo: <b>ce qui</b> (soggetto), <b>ce que</b> (oggetto), <b>ce dont</b> (de), <b>ce à quoi</b> (à). «Je sais ce qui s'est passé.» «Dis-moi ce que tu veux.» «C'est exactement ce dont j'ai besoin.» [sè èg-zak-të-mã së DÕ zhé bë-ZUẼ]. «Voilà ce à quoi je pense.» Dopo <i>tout</i>: «Tout ce que je sais.»</p>
<h3>Celui qui, celle que...</h3>
<p>I dimostrativi <b>celui, celle, ceux, celles</b> reggono un relativo o una preposizione: «Celui qui parle» (quello che parla), «Celle que j'ai vue» (quella che ho visto), «Ceux dont je t'ai parlé» (quelli di cui ti ho parlato), «celui de Paul» (quello di Paul). Da soli non stanno in piedi: «celui» ha sempre un seguito.</p>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>«Cui» non esiste in francese: «La persona di cui parlo» → <b>dont je parle</b>; «a cui penso» → <b>à qui je pense</b>; «con cui esco» → <b>avec qui je sors</b>; «il giorno in cui» → <b>le jour où</b>.</li>
<li>«Quello che ho bisogno» è sbagliato anche in italiano: <b>ce dont</b> j'ai besoin.</li>
<li>«Il quale» (lequel) è molto più frequente in francese dopo preposizione, mentre in italiano suona formale.</li>
<li>Il relativo non si può mai omettere (a differenza dell'inglese): «Le livre que j'ai lu», non «le livre j'ai lu».</li>
</ul>
<div class="say"><b>Da ricordare.</b> «La femme dont je parle»; «Ce que tu dis»; «La table sur laquelle...»; «C'est ce dont j'ai besoin»; «Celui qui rit le dernier».</div>`,
  [
    q(
      'q1',
      '«La femme ___ je parle est ma voisine.»',
      ['dont', 'que', 'qui', 'où'],
      0,
      'Parler de richiede la preposizione de, che il pronome dont incorpora. Que sarebbe un oggetto diretto, qui un soggetto.',
    ),
    q(
      'q2',
      '«Le restaurant ___ nous avons mangé était excellent.»',
      ['où', 'que', 'dont', 'qui'],
      0,
      'Dove si usa où per i luoghi; in alternativa dans lequel. Que richiederebbe un verbo con oggetto diretto, qui un soggetto.',
    ),
    q(
      'q3',
      '«Je ne comprends pas ___ tu dis.»',
      ['ce que', 'ce qui', 'ce dont', 'que'],
      0,
      'Senza antecedente si usa ce; il pronome è oggetto di dis, quindi que. Ce qui sarebbe soggetto: «ce qui se passe».',
    ),
    q(
      'q4',
      "«C'est exactement ___ j'ai besoin.»",
      ['ce dont', 'ce que', 'ce qui', 'ce à quoi'],
      0,
      "Avoir besoin de regge la preposizione de, quindi ce dont. Ce que ripeterebbe l'errore dell'italiano «quello che ho bisogno».",
    ),
    q(
      'q5',
      "«La personne ___ je pense s'appelle Marie.»",
      ['à qui', 'dont', 'que', 'lequel'],
      0,
      'Penser à + persona vuole la preposizione à, e per le persone si usa à qui. Dont è riservato a de; que non porta alcuna preposizione.',
    ),
    q(
      'q6',
      "«La table ___ j'ai posé mon livre est en bois.»",
      ['sur laquelle', 'sur qui', 'avec laquelle', 'sur lequel'],
      0,
      'Dopo preposizione, per una cosa si usa lequel accordato al femminile: sur laquelle. Qui dopo preposizione si riserva alle persone.',
    ),
    q(
      'q7',
      "Come si dice «L'uomo la cui figlia è medico abita qui»?",
      [
        "L'homme dont la fille est médecin habite ici.",
        "L'homme dont sa fille est médecin habite ici.",
        "L'homme que la fille est médecin habite ici.",
        "L'homme qui la fille est médecin habite ici.",
      ],
      0,
      'Il possesso («la cui figlia») si esprime con dont seguito da articolo e nome: dont la fille. Dont sa fille ripeterebbe il possessivo.',
    ),
    q(
      'q8',
      "«Je sais ___ s'est passé hier.»",
      ['ce qui', 'ce que', 'ce dont', 'qui'],
      0,
      "Il pronome è soggetto di s'est passé, quindi ce qui. Ce que richiede un oggetto diretto, che il verbo s'est passé non ha.",
    ),
    q(
      'q9',
      'Come si pronuncia «dont»?',
      ['[DÕ]', '[DONT]', '[DÃ]', '[DUNT]'],
      0,
      "Il gruppo «on» è una vocale nasale [õ] e la t finale è muta. L'italiano tende a leggere «dont» con n e t pronunciate.",
    ),
    q(
      'q10',
      "«C'est moi ___ ai gagné.» Quale forma è corretta?",
      ['qui', 'que', 'dont', 'où'],
      0,
      'Il relativo è soggetto, quindi qui, e il verbo si accorda con moi (ai, prima persona). Con moi il verbo resta alla prima persona: qui ai gagné, non «qui a gagné».',
    ),
  ],
  [
    card('c1', 'qui / que', "qui = soggetto; que = oggetto diretto. L'homme qui parle; l'homme que je vois."),
    card('c2', 'dont', "Di cui: Le livre dont j'ai besoin; L'homme dont la fille est médecin."),
    card('c3', 'où', "Luogo e tempo: la ville où j'habite; le jour où il est parti."),
    card('c4', 'lequel', 'Dopo preposizione, per cose: la table sur laquelle; auquel / duquel con à e de.'),
    card('c5', 'prep. + qui', "Persone: la personne à qui je pense; l'ami avec qui je sors."),
    card(
      'c6',
      'ce qui / ce que / ce dont',
      "Senza antecedente: Je sais ce qui se passe. Dis-moi ce que tu veux. C'est ce dont j'ai besoin.",
    ),
    card('c7', 'Il «cui» italiano', 'Non esiste: dont (de), à qui (à), avec qui (con), où (luogo e tempo).'),
    card(
      'c8',
      'celui qui / celle que',
      "Quello che, quella che: celui qui parle; celle que j'ai vue; ceux dont je parle.",
    ),
    card('c9', 'dont + nome', "dont + articolo + nome, mai possessivo: l'homme dont la fille est médecin."),
    card('c10', "C'est moi qui...", "Il verbo si accorda con l'antecedente: C'est moi qui ai raison."),
  ],
  [
    prac(
      'p1',
      'Traduci: «Il libro di cui ti ho parlato è sul tavolo.»',
      "Le livre dont je t'ai parlé est sur la table. Nota: parler de → dont.",
    ),
    prac(
      'p2',
      'Traduci: «La ragazza con cui esco si chiama Anna.»',
      "La fille avec qui je sors s'appelle Anna. Nota: preposizione + persona → qui (non «cui»).",
    ),
    prac(
      'p3',
      "Completa: «Je n'ai pas compris ___ il m'a dit.»",
      "Je n'ai pas compris ce qu'il m'a dit. Nota: ce que (oggetto di dire).",
    ),
    prac(
      'p4',
      'Traduci: «Il progetto a cui lavoro è difficile.»',
      'Le projet auquel je travaille est difficile. Nota: cosa dopo à → auquel (a + lequel).',
    ),
    prac(
      'p5',
      'Traduci: «Il tavolo su cui ho messo le chiavi è rotto.»',
      "La table sur laquelle j'ai mis les clés est cassée. Nota: cosa dopo preposizione → lequel accordato (laquelle); table è femminile, cassée si accorda.",
    ),
    prac(
      'p6',
      'Traduci: «Non so cosa sia successo.»',
      "Je ne sais pas ce qui s'est passé. Nota: ce qui, soggetto di s'est passé.",
    ),
    prac(
      'p7',
      'Traduci: «Il giorno in cui ci siamo conosciuti faceva freddo.»',
      'Le jour où nous nous sommes rencontrés, il faisait froid. Nota: tempo → où (non «dans lequel»).',
    ),
  ],
)
