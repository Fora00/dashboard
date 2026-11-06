import type { CourseModule } from '../types'
import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT } from './francese.b.pron'

// One dialogue line: speaker, French, pronunciation (without brackets), Italian.
const dl = (who: string, fr: string, pr: string, it: string): string =>
  `<p><b>${who}</b> : ${fr}<br><i>[${pr}]</i><br>${it}</p>`

export const fraDialoghi: CourseModule = mod(
  'fr-dialoghi',
  'Dialoghi modello FR / IT (1): bar, albergo, telefono, medico, farmacia, colloquio',
  'Sei dialoghi per le situazioni quotidiane, con pronuncia riga per riga',
  'drill',
  `<p class="lead">Sei dialoghi completi per situazioni reali. Sotto ogni frase francese trovi la <b>pronuncia</b> (con liaison ed élisions già applicate) e la traduzione italiana. Leggili ad alta voce, poi coprili e ricostruisci la risposta. Altri sei dialoghi (amici, valigia, stazione, strada, negozio, ristorante) sono in <i>fr-dialoghi2</i>.</p>
${PRON_SHORT}
<h3>1. Al bar</h3>
${dl('Serveur', "Bonjour, qu'est-ce que je vous sers ?", 'bõ-ZHUR, kès-kë zhë vu SÈR', 'Buongiorno, cosa Le servo?')}
${dl('Client', "Un café et un croissant, s'il vous plaît.", 'ẽ ka-FÉ é ẽ krua-SÃ, sil vu PLÈ', 'Un caffè e un cornetto, per favore.')}
${dl('Serveur', 'Voilà. Ce sera tout ?', 'vua-LA. së së-ra TU', 'Ecco. È tutto?')}
${dl('Client', "Oui, merci. C'est combien ?", 'UI, mèr-SI. sè kõ-BYẼ', 'Sì, grazie. Quanto costa?')}
${dl('Serveur', 'Quatre euros cinquante.', 'katr ö-RO sẽ-KÃT', 'Quattro euro e cinquanta.')}
<h3>2. In albergo</h3>
${dl('Client', "Bonsoir, j'ai réservé une chambre au nom de Rossi.", 'bõ-SUAR, zhé ré-zèr-VÉ ün shãbr o nõ dë ro-SI', 'Buonasera, ho prenotato una camera a nome Rossi.')}
${dl('Réceptionniste', "Oui, une chambre double pour deux nuits. Votre passeport, s'il vous plaît ?", 'UI, ün shãbr DUBL pur dö NÜI. vòtr pas-PÒR, sil vu PLÈ', 'Sì, una doppia per due notti. Il passaporto, per favore?')}
${dl('Client', 'Voici. Le petit-déjeuner est compris ?', 'vua-SI. lë pë-ti-dé-zhë-NÉ è kõ-PRI', 'Ecco. La colazione è inclusa?')}
${dl('Réceptionniste', 'Oui, de sept heures à dix heures.', 'UI, dë sè-TÖR a di-ZÖR', 'Sì, dalle sette alle dieci.')}
${dl('Client', 'Et le wifi ?', 'é lë ui-FI', 'E il wifi?')}
${dl('Réceptionniste', 'Le code est sur votre clé. Chambre douze, au deuxième étage.', 'lë KÒD è sür vòtr KLÉ. shãbr DUZ, o dö-zyè-mé-TAZH', 'Il codice è sulla chiave. Camera dodici, al secondo piano.')}
<h3>3. Al telefono (appuntamento)</h3>
${dl('Moi', 'Allô, bonjour, je voudrais prendre rendez-vous avec le docteur Martin.', 'a-LO, bõ-ZHUR, zhë vu-DRÈ prãdr rã-dé-VU a-vèk lë dòk-TÖR mar-TẼ', 'Pronto, buongiorno, vorrei fissare un appuntamento con il dottor Martin.')}
${dl('Secrétaire', 'Quel est votre nom ?', 'kèl è vòtr NÕ', 'Qual è il suo nome?')}
${dl('Moi', 'Rossi : R, O, S, S, I.', 'ro-SI : ÈR, O, ÈS, ÈS, I', 'Rossi: R, O, S, S, I.')}
${dl('Secrétaire', 'Jeudi à quinze heures, ça vous va ?', 'zhö-DI a kẽ-ZÖR, sa vu VA', 'Giovedì alle quindici, va bene?')}
${dl('Moi', "Oui, c'est parfait. Merci, au revoir !", 'UI, sè par-FÈ. mèr-SI, o rë-VUAR', 'Sì, perfetto. Grazie, arrivederci!')}
<h3>4. Dal medico</h3>
${dl('Médecin', "Bonjour, qu'est-ce qui ne va pas ?", 'bõ-ZHUR, kès-ki në va PA', 'Buongiorno, cosa non va?')}
${dl('Patient', "J'ai mal à la gorge et j'ai de la fièvre depuis hier.", 'zhé mal a la GÒRZH, é zhé dë la FYÈVR dë-püi YÈR', 'Ho mal di gola e ho la febbre da ieri.')}
${dl('Médecin', 'Ouvrez la bouche. Vous avez une angine.', 'u-vré la BUSH. vu-za-vé ü-nã-ZHIN', "Apra la bocca. Ha un'angina.")}
${dl('Médecin', 'Je vous prescris des antibiotiques.', 'zhë vu près-KRI dé-zã-ti-byo-TIK', 'Le prescrivo degli antibiotici.')}
${dl('Patient', 'Je dois les prendre combien de temps ?', 'zhë dua lé prãdr kõ-byẽ dë TÃ', 'Per quanto tempo devo prenderli?')}
${dl('Médecin', 'Sept jours. Revenez si ça ne passe pas.', 'sèt ZHUR. rë-vë-NÉ si sa në pas PA', 'Sette giorni. Torni se non passa.')}
<h3>5. In farmacia</h3>
${dl('Client', "Bonjour, j'ai mal à la tête depuis ce matin. Qu'est-ce que vous me conseillez ?", 'bõ-ZHUR, zhé mal a la TÈT dë-püi së ma-TẼ. kès-kë vu më kõ-sè-YÉ', 'Buongiorno, ho mal di testa da stamattina. Che cosa mi consiglia?')}
${dl('Pharmacien', 'Prenez ce médicament deux fois par jour, après les repas.', 'prë-NÉ së mé-di-ka-MÃ dö FUA par ZHUR, a-prè lé rë-PA', 'Prenda questo medicinale due volte al giorno, dopo i pasti.')}
${dl('Client', 'Je dois avoir une ordonnance ?', 'zhë dua a-VUAR ü-nòr-do-NÃS', 'Ci vuole la ricetta?')}
${dl('Pharmacien', 'Non, pas pour celui-ci. Voilà, ça fait huit euros.', 'NÕ, pa pur së-lüi-SI. vua-LA, sa fè üi-tö-RO', 'No, non per questo. Ecco, fanno otto euro.')}
<h3>6. Colloquio di lavoro</h3>
${dl('Recruteur', 'Parlez-moi de votre expérience.', 'par-lé-MUA dë vòtr èks-pé-RYÃS', 'Mi parli della Sua esperienza.')}
${dl('Candidat', "J'ai travaillé trois ans dans une agence de communication.", 'zhé tra-va-YÉ trua-zã, dã-zü-na-ZHÃS dë ko-mü-ni-ka-SYÕ', "Ho lavorato tre anni in un'agenzia di comunicazione.")}
${dl('Recruteur', 'Pourquoi voulez-vous changer de poste ?', 'pur-kua vu-lé-vu shã-ZHÉ dë PÒST', 'Perché vuole cambiare lavoro?')}
${dl('Candidat', 'Je cherche plus de responsabilités.', 'zhë shèrsh plü dë rès-põ-sa-bi-li-TÉ', 'Cerco più responsabilità.')}
<h3>Frasi chiave da imparare</h3>
<ul>
<li>«Je voudrais...» [zhë vu-DRÈ] · «Vous avez... ?» [vu-za-VÉ] · «C'est combien ?» [sè kõ-BYẼ]</li>
<li>«Pardon, je n'ai pas compris.» [par-DÕ, zhë né pa kõ-PRI] · «Pouvez-vous répéter ?» [pu-vé-vu ré-pé-TÉ]</li>
<li>«Où est... ?» [u È] · «À quelle heure... ?» [a kèl ÖR] · «Je cherche...» [zhë SHÈRSH]</li>
<li>«Ça marche.» [sa MARSH] (va bene, informale) · «Pas de problème.» [pa dë pro-BLÈM]</li>
<li>«L'addition, s'il vous plaît.» [la-di-SYÕ, sil vu PLÈ]</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Depuis + présent</b>: «J'ai mal depuis hier» (non «j'ai eu mal»).</li>
<li><b>Liaison</b>: «trois ans» [trua-ZÃ], «vous avez» [vu-za-VÉ], ma niente liaison dopo et: «et un» [é ẽ].</li>
<li><b>Prendre rendez-vous</b> senza articolo: l'italiano «fissare un appuntamento» non si traduce parola per parola.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Je voudrais prendre rendez-vous.» · «Vous avez réservé ?» · «Ça vous va ?»</div>`,
  [
    q(
      'q2',
      'Come si ordina in modo educato un caffè?',
      [
        "Je voudrais un café, s'il vous plaît.",
        'Je veux un café, et dépêchez-vous !',
        'Donnez-moi un café tout de suite, vite !',
        'Un café, et vite, je suis pressé.',
      ],
      0,
      "Il condizionale di cortesia con s'il vous plaît è la forma più naturale. Je veux e donnez-moi sono troppo diretti.",
    ),
    q(
      'q3',
      'Come si pronuncia «trois ans»?',
      ['[trua-ZÃ]', '[trua ÃS]', '[troi AN]', '[trua-ZÃN]'],
      0,
      'La s di trois si pronuncia come z davanti a vocale (liaison obbligatoria con ans), e ans è nasale [ZÃ] senza n.',
    ),
    q(
      'q4',
      'Come si pronuncia «ils ont» ?',
      ['[il-ZÕ]', '[il ÕT]', '[il SÕ]', '[i-LÕ]'],
      0,
      'La liaison porta la s di ils verso la vocale e la l resta: [il-ZÕ]. Ils sont [il SÕ] non ha liaison perché sont inizia con consonante.',
    ),
    q(
      'q5',
      'Come si dice «Ho mal di gola da ieri»?',
      [
        "J'ai mal à la gorge depuis hier.",
        "J'ai eu mal à la gorge depuis hier.",
        "J'ai mal à la gorge il y a hier.",
        "J'avais mal à la gorge depuis hier.",
      ],
      0,
      'Depuis + durata con azione ancora in corso richiede il présent. Il y a sarebbe «fa» e non si combina con hier.',
    ),
    q(
      'q7',
      'Come si dice «Vorrei fissare un appuntamento» dal medico?',
      [
        'Je voudrais prendre rendez-vous.',
        'Je voudrais faire un rendez-vous.',
        'Je veux faire un appuntamento.',
        'Je voudrais prendre un rendez.',
      ],
      0,
      "L'espressione fissa è prendre rendez-vous, senza articolo. Faire un rendez-vous è un calco dell'italiano «fare un appuntamento».",
    ),
    q(
      'q9',
      'Come si dice «Ho prenotato a nome Rossi»?',
      [
        "J'ai réservé au nom de Rossi.",
        "J'ai réservé en nom Rossi.",
        "J'ai prénoté au nom de Rossi hier.",
        'Je réserve nom de Rossi.',
      ],
      0,
      "Réserver, au nom de + cognome. Prénoté non esiste e en nom è un calco dall'italiano.",
    ),
    q(
      'q11',
      'In farmacia, come chiedi se serve la ricetta?',
      [
        'Il faut une ordonnance ?',
        'Il faut une recette ?',
        "J'ai besoin d'un ordonnateur ?",
        'Il y a une prescription pour moi ?',
      ],
      0,
      "La ricetta medica è l'ordonnance. La recette è la ricetta di cucina: è il falso amico classico, e prescription è un termine giuridico o tecnico.",
    ),
    q(
      'q12',
      'Come si dice «da tre anni» in «Lavoro qui da tre anni»?',
      [
        'Je travaille ici depuis trois ans.',
        'Je travaille ici il y a trois ans.',
        'Je travaillais ici depuis trois ans.',
        'Je travaille ici pendant trois ans.',
      ],
      0,
      'Una situazione iniziata nel passato e ancora in corso si esprime con depuis + présent. Pendant indica una durata già conclusa.',
    ),
  ],
  [
    card('c1', 'Je voudrais...', 'Vorrei... [zhë vu-DRÈ]'),
    card('c3', "J'ai réservé...", 'Ho prenotato... [zhé ré-zèr-VÉ]'),
    card('c4', 'prendre rendez-vous', 'Fissare un appuntamento.'),
    card('c5', 'Ça vous va ?', 'Va bene per Lei? [sa vu VA]'),
    card('c6', "J'ai mal à...", 'Ho male a... (depuis + présent)'),
    card('c9', 'trois ans', 'Liaison: [trua-ZÃ]'),
    card('c10', 'Pouvez-vous répéter ?', 'Può ripetere? [pu-vé-VU ré-pé-TÉ]'),
    card('c11', "l'ordonnance", 'La ricetta medica (la recette = ricetta di cucina).'),
    card('c12', 'Come si dice «Quanto costa?»', "C'est combien ? [sè kõ-BYẼ]"),
  ],
  [
    prac(
      'p1',
      "Recita il dialogo 1 (al bar) cambiando l'ordinazione: un tè e una baguette.",
      "Un thé et une baguette, s'il vous plaît. [ẽ TÉ é ün ba-GÈT, sil vu PLÈ] Nota: thé si pronuncia [TÉ].",
    ),
    prac(
      'p2',
      'Prenota una camera singola per tre notti.',
      'Bonjour, je voudrais réserver une chambre simple pour trois nuits. Nota: pour + durata; chambre simple.',
    ),
    prac(
      'p3',
      'Al telefono, sposta un appuntamento da martedì a mercoledì.',
      "Bonjour, je voudrais décaler mon rendez-vous de mardi à mercredi, s'il vous plaît. Nota: décaler o reporter = spostare (déplacer si usa per gli oggetti).",
    ),
    prac(
      'p4',
      'Spiega al medico che ti fa male la schiena da tre giorni.',
      "J'ai mal au dos depuis trois jours. Nota: mal au dos (à + le), depuis + présent.",
    ),
    prac(
      'p5',
      'Rispondi a «Pourquoi voulez-vous ce poste ?»',
      'Parce que je suis motivé et que ce poste correspond à mon parcours. Nota: parce que + indicatif.',
    ),
  ],
)

export const fraDialoghi2: CourseModule = mod(
  'fr-dialoghi2',
  'Dialoghi modello FR / IT (2): amici, valigia, stazione, strada, negozio, ristorante',
  'Sei dialoghi per spostarsi, comprare e mangiare, con pronuncia riga per riga',
  'drill',
  `<p class="lead">Seconda serie di dialoghi: con gli amici, un problema in aeroporto, in stazione, per strada, in negozio e al ristorante. Come nel modulo precedente (<i>fr-dialoghi</i>), sotto ogni frase trovi la pronuncia e la traduzione. Leggi ad alta voce, poi copri e ricostruisci.</p>
${PRON_SHORT}
<h3>1. Con amici</h3>
${dl('Marc', 'Salut Léa ! Ça va ?', 'sa-LÜ lé-A. sa VA', 'Ciao Léa! Come va?')}
${dl('Léa', "Ça va, et toi ? T'as passé un bon week-end ?", 'sa va, é TUA. ta pa-sé ẽ bõ ui-KÈND', 'Bene, e tu? Hai passato un buon weekend?')}
${dl('Marc', 'Super ! On est allés à la mer avec des potes.', 'sü-PÈR. õ-nè-ta-lé-za la MÈR a-vèk dé PÒT', 'Benissimo! Siamo andati al mare con degli amici.')}
${dl('Léa', "Moi, j'ai bossé tout le week-end. On se fait une bouffe ce soir ?", 'MUA, zhé bò-SÉ tu lë ui-KÈND. õ së fè ün buf së SUAR', 'Io ho lavorato tutto il weekend. Ceniamo insieme stasera?')}
${dl('Marc', 'Ça marche !', 'sa MARSH', 'Va bene!')}
<h3>2. Un problema (valigia persa)</h3>
${dl('Passager', "Excusez-moi, ma valise n'est pas arrivée.", 'èk-skü-zé-MUA, ma va-liz nè pa-za-ri-VÉ', 'Mi scusi, la mia valigia non è arrivata.')}
${dl('Employé', 'Quel était votre vol ?', 'kèl é-tè vòtr VÒL', 'Qual era il suo volo?')}
${dl('Passager', 'Le vol de Rome. Elle est noire, avec un ruban rouge.', 'lë vòl dë RÒM. èl è NUAR, a-vèk ẽ rü-bã RUZH', 'Il volo da Roma. È nera, con un nastro rosso.')}
${dl('Employé', "Nous vous appellerons dès qu'elle sera retrouvée.", 'nu vu-za-pèl-RÕ, dè kèl së-ra rë-tru-VÉ', 'La chiameremo appena sarà ritrovata.')}
<h3>3. In stazione</h3>
${dl('Voyageur', "Un billet pour Lyon, s'il vous plaît.", 'ẽ bi-yè pur li-YÕ, sil vu PLÈ', 'Un biglietto per Lione, per favore.')}
${dl('Guichetier', 'Aller simple ou aller-retour ?', 'a-lé SẼPL u a-lé-rë-TUR', 'Andata o andata e ritorno?')}
${dl('Voyageur', 'Aller-retour, en deuxième classe.', 'a-lé-rë-TUR, ã dö-ZYÈM klas', 'Andata e ritorno, in seconda classe.')}
${dl('Guichetier', 'Ça fait quarante-deux euros. Le train part à neuf heures, voie quatre.', 'sa fè ka-rãt-dö ö-RO. lë trẽ par a nö-VÖR, vua KATR', 'Fanno quarantadue euro. Il treno parte alle nove, binario quattro.')}
<h3>4. Per strada (indicazioni)</h3>
${dl('Touriste', "Excusez-moi, pour aller à la gare, s'il vous plaît ?", 'èk-skü-zé-MUA, pur a-lé a la GAR, sil vu PLÈ', 'Mi scusi, per andare alla stazione, per favore?')}
${dl('Passant', 'Allez tout droit, puis tournez à gauche au feu rouge.', 'a-lé tu DRUA, püi tur-né a GOSH o fö RUZH', 'Vada dritto, poi giri a sinistra al semaforo rosso.')}
${dl('Touriste', "C'est loin d'ici ?", 'sè luẽ di-SI', 'È lontano da qui?')}
${dl('Passant', "Non, c'est à dix minutes à pied.", 'NÕ, sè-ta di mi-nüt a PYÉ', 'No, è a dieci minuti a piedi.')}
${dl('Touriste', 'Merci beaucoup, bonne journée !', 'mèr-SI bo-KU, bòn zhur-NÉ', 'Grazie mille, buona giornata!')}
<h3>5. In negozio</h3>
${dl('Vendeuse', 'Je peux vous aider ?', 'zhë pö vu-zè-DÉ', 'Posso aiutarLa?')}
${dl('Client', "Je cherche un pull en taille M. Je peux l'essayer ?", 'zhë shèrsh ẽ PÜL ã tay ÈM. zhë pö lè-sè-YÉ', 'Cerco un maglione taglia M. Posso provarlo?')}
${dl('Vendeuse', 'Bien sûr, la cabine est au fond.', 'byẽ SÜR, la ka-BIN è-to FÕ', 'Certo, il camerino è in fondo.')}
${dl('Client', 'Il est un peu cher. Vous avez une réduction ?', 'il è ẽ pö SHÈR. vu-za-vé ü-na ré-dük-SYÕ', "È un po' caro. Avete uno sconto?")}
${dl('Vendeuse', 'Oui, moins vingt pour cent pendant les soldes.', 'UI, muẽ vẽ pur SÃ pã-dã lé SÒLD', 'Sì, venti per cento in meno durante i saldi.')}
<h3>6. Al ristorante</h3>
${dl('Serveur', 'Vous avez réservé ?', 'vu-za-vé ré-zèr-VÉ', 'Avete prenotato?')}
${dl('Client', 'Oui, une table pour deux au nom de Rossi.', 'UI, ün tabl pur DÖ o nõ dë ro-SI', 'Sì, un tavolo per due a nome Rossi.')}
${dl('Serveur', 'Voici la carte. Vous avez choisi ?', 'vua-SI la KART. vu-za-vé shua-ZI', 'Ecco il menu (la lista dei piatti). Avete scelto?')}
${dl('Client', "Je prends le menu à vingt euros, et une carafe d'eau.", 'zhë prã lë më-nü a vẽ-tö-RO, é ün ka-raf DO', "Prendo il menu a venti euro e una caraffa d'acqua.")}
${dl('Serveur', 'Très bien. Bon appétit !', 'trè BYẼ. bõ-na-pé-TI', 'Benissimo. Buon appetito!')}
${dl('Client', 'Merci, à vous aussi !', 'mèr-SI, a vu-zo-SI', 'Grazie, altrettanto!')}
<h3>Trappole per chi parla italiano</h3>
<ul>
<li><b>Aller-retour</b> = andata e ritorno; <b>aller simple</b> = solo andata. Sul tabellone, <b>voie</b> = binario.</li>
<li><b>La carte</b> è l'elenco dei piatti; <b>le menu à vingt euros</b> è la formula a prezzo fisso.</li>
<li><b>Moins vingt pour cent</b> = venti per cento in meno; <b>les soldes</b> = i saldi, sempre plurale.</li>
<li><b>À pied</b> = a piedi; <b>tout droit</b> = dritto; <b>au feu rouge</b> = al semaforo.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «Pour aller à la gare ?» · «Je peux l'essayer ?» · «Vous avez choisi ?» · «Bon appétit !»</div>`,
  [
    q(
      'q1',
      'Come si chiede il conto al ristorante?',
      [
        "L'addition, s'il vous plaît.",
        'Le compte en banque, merci.',
        'La note de frais, je prends.',
        "Je veux payer tout l'argent.",
      ],
      0,
      "In Francia il conto al ristorante si chiede con l'addition. La note si usa soprattutto per l'albergo, e le compte indica un conto in banca.",
    ),
    q(
      'q6',
      'Che cosa significa «Ça marche» ?',
      ["Va bene, d'accordo", 'Funziona il motore', 'Cammina', 'Bisogna camminare'],
      0,
      'Ça marche è usato nel parlato come risposta affermativa: va bene. Il senso letterale (camminare) è secondario.',
    ),
    q(
      'q8',
      'Come si pronuncia «week-end» ?',
      ['[ui-KÈND]', '[uik-END]', '[vi-KÈ]', '[ui-KEN]'],
      0,
      "Il francese ha adottato l'inglese con pronuncia francese: ui-kènd, con la d finale pronunciata.",
    ),
    q(
      'q10',
      'Che cosa significa «aller simple» ?',
      ['solo andata', 'andata e ritorno', 'biglietto semplice', 'viaggio comodo'],
      0,
      'Aller simple è il biglietto di sola andata. Aller-retour è andata e ritorno: la differenza è spesso chiesta alla biglietteria.',
    ),
    q(
      'q11',
      'Come si dice «Posso provarlo?» in un negozio di vestiti?',
      ["Je peux l'essayer ?", 'Je peux le prouver ?', 'Je peux le tester ?', "Je peux l'essai ?"],
      0,
      'Essayer è provare un capo di abbigliamento. Prouver significa dimostrare: è il falso amico di provare, e tester vale per prodotti o software.',
    ),
    q(
      'q12',
      'Come si dice «È a dieci minuti a piedi»?',
      [
        "C'est à dix minutes à pied.",
        "C'est à dix minutes avec pied.",
        "C'est dix minutes en pied.",
        "C'est à dix minutes de piedi.",
      ],
      0,
      'Per il mezzo di spostamento a piedi si dice à pied. La distanza in tempo è introdotta da à: à dix minutes.',
    ),
    q(
      'q13',
      'Che cosa significa «moins vingt pour cent» in un negozio?',
      ['venti per cento di sconto', 'venti euro in più', 'venti per cento di aumento', 'solo venti articoli'],
      0,
      'Moins vingt pour cent = meno il venti per cento, cioè uno sconto. Il segno meno davanti alla cifra indica sempre una riduzione.',
    ),
  ],
  [
    card('c2', "C'est combien ?", 'Quanto costa? [sè kõ-BYẼ]'),
    card('c7', 'aller simple / aller-retour', 'Solo andata / andata e ritorno.'),
    card('c8', 'Ça marche.', 'Va bene (informale) [sa MARSH]'),
    card('c11', 'essayer', 'Provare un vestito [è-sè-YÉ]; prouver = dimostrare.'),
    card('c12', 'la voie', 'Il binario: voie quatre [vua KATR].'),
    card('c13', 'à pied', 'A piedi: à dix minutes à pied.'),
    card('c14', 'Come si dice «il conto» (ristorante)?', "L'addition [la-di-SYÕ]"),
    card('c15', 'Come si dice «dritto»?', 'Tout droit [tu DRUA]'),
  ],
  [
    prac(
      'p6',
      'Invita un amico a cena in modo informale.',
      'On se fait un resto ce soir ? Ça te dit ? Nota: registro familier.',
    ),
    prac(
      'p7',
      'Chiedi a un passante dove si trova la farmacia.',
      "Excusez-moi, où est la pharmacie, s'il vous plaît ? Nota: Où est... ? con vous e s'il vous plaît.",
    ),
    prac(
      'p8',
      "Nel negozio, chiedi la taglia più grande e se c'è lo sconto.",
      "Vous avez la taille au-dessus, s'il vous plaît ? Et il y a une réduction ? Nota: la taille au-dessus = la taglia più grande.",
    ),
    prac(
      'p9',
      'Al ristorante, ordina un primo, un secondo e chiedi il conto.',
      "Pour commencer, je prendrai une entrée, puis un plat de viande. L'addition, s'il vous plaît. Nota: in Francia il primo piatto non esiste: entrée (antipasto) e plat (portata principale).",
    ),
  ],
)

export const fraDrills: CourseModule = mod(
  'fr-drills',
  'Esercizi pratici di traduzione e trasformazione',
  '45 esercizi brevi: traduzioni IT-FR e FR-IT, trasformazioni, correzioni e coppie minime di pronuncia',
  'drill',
  `<p class="lead">Qui si lavora. Ogni esercizio nella scheda "Esercizi" ha una risposta modello. Regola: <b>scrivi la risposta prima di guardarla</b>, poi confronta e annota gli errori nel tuo quaderno.</p>
<h3>Come usare gli esercizi</h3>
<ol>
<li>Fai 10 esercizi al giorno, non di più: la qualità conta più della velocità.</li>
<li>Scrivi la risposta completa, accenti compresi (é è ê à ù ç ï).</li>
<li>Confronta: se sbagli, riscrivi la frase giusta tre volte e leggila ad alta voce.</li>
<li>Rifai gli esercizi sbagliati dopo due giorni.</li>
</ol>
<h3>Prontuario rapido</h3>
<div class="tblw"><table><tr><th>Tema</th><th>Regola</th></tr>
<tr><td>negazione</td><td>ne + verbo + pas; dopo pas: de (Il n'a pas de pain)</td></tr>
<tr><td>partitivi</td><td>du (m.), de la (f.), de l' (vocale), des (pl.)</td></tr>
<tr><td>pronomi oggetto</td><td>le / la / les davanti al verbo; lui / leur per a qualcuno</td></tr>
<tr><td>y / en</td><td>y = a/in un luogo; en = di una quantità: J'en ai deux</td></tr>
<tr><td>ausiliare</td><td>être: verbi di moto e riflessivi; avoir: gli altri</td></tr>
<tr><td>accordo participio</td><td>con être: soggetto; con avoir: COD che precede</td></tr>
<tr><td>preposizioni di luogo</td><td>à + città; en + femminile; au / aux + maschile</td></tr>
<tr><td>comparativo</td><td>plus / moins / aussi + aggettivo + que</td></tr>
</table></div>
<h3>Errori da cercare quando ti correggi</h3>
<ul>
<li>Articolo mancante o sbagliato (<i>la</i> problème → <i>le</i> problème).</li>
<li>Partitivo dimenticato («je mange pain» → <i>du pain</i>).</li>
<li>Ausiliare sbagliato («j'ai allé» → <i>je suis allé</i>).</li>
<li>Participio non accordato (<i>les lettres que j'ai écrit</i> → <i>écrites</i>).</li>
<li>Futuro dopo si («si tu viendras» → <i>si tu viens</i>).</li>
<li>Apostrofo e accenti: <i>c'est</i>, <i>où</i>, <i>à</i>, <i>là</i>, <i>ça</i>.</li>
</ul>
<h3>Coppie minime di pronuncia (leggi a voce alta)</h3>
<div class="tblw"><table><tr><th>Coppia</th><th>Pronuncia</th></tr>
<tr><td>tu / tout</td><td>[TÜ] / [TU]</td></tr>
<tr><td>rue / roue</td><td>[RÜ] / [RU]</td></tr>
<tr><td>dessus / dessous</td><td>[dë-SÜ] / [dë-SU]</td></tr>
<tr><td>pain / peine</td><td>[PẼ] / [PÈN]</td></tr>
<tr><td>bon / bonne</td><td>[BÕ] / [BÒN]</td></tr>
<tr><td>parlé / parlait</td><td>[par-LÉ] / [par-LÈ]</td></tr>
<tr><td>sous / su</td><td>[SU] / [SÜ]</td></tr>
<tr><td>peu / peur</td><td>[PÖ] / [PÖR]</td></tr>
</table></div>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>Imparare i verbi con <b>l'ausiliare</b>: <i>je suis allé, j'ai été, j'ai eu</i>.</li>
<li>Tradurre «ci» con <b>y</b> e «ne» con <b>en</b>, non con il pronome tonico.</li>
<li>Distinguere <b>ce / se</b> e <b>ces / ses / c'est / s'est</b>: sono omofoni ma si scrivono in modo diverso.</li>
</ul>
<div class="say"><b>Da ricordare.</b> Una frase corretta e semplice vale più di una frase ambiziosa con tre errori.</div>`,
  [
    q(
      'q1',
      'Completa: «Je veux ___ pain.»',
      ['du', 'de la', 'des', 'un de'],
      0,
      'Pain è maschile singolare, quindi il partitivo è du. De la sarebbe per un sostantivo femminile come la viande.',
    ),
    q(
      'q2',
      "Completa: «Il n'a pas ___ argent.»",
      ["d'", "de l'", 'du', 'un'],
      0,
      "Dopo una negazione con pas il partitivo diventa de (d' davanti a vocale): il n'a pas d'argent. Du e un non si usano.",
    ),
    q(
      'q3',
      'Sostituisci con il pronome: «Je donne le livre à Paul.»',
      ['Je le lui donne.', 'Je lui le donne.', 'Je le donne lui.', 'Je donne le lui.'],
      0,
      "L'ordine dei pronomi è COD + COI: le lui. Si colloca prima del verbo, non dopo.",
    ),
    q(
      'q4',
      'Come si dice «Ne ho due»?',
      ["J'en ai deux.", "J'y ai deux.", 'Je les ai deux.', "J'ai deux d'en."],
      0,
      "En sostituisce una quantità introdotta da de/partitivo e il numero resta alla fine: j'en ai deux. Y si riferisce a luoghi.",
    ),
    q(
      'q5',
      'Quale frase è corretta?',
      ['Je suis allé à Paris.', "J'ai allé à Paris.", 'Je suis aller à Paris.', "J'ai alle à Paris."],
      0,
      "Aller prende être, e il participio è allé. Aller è l'infinito, non può stare dopo l'ausiliare.",
    ),
    q(
      'q6',
      'Come si pronuncia «peu» ?',
      ['[PÖ]', '[PEU]', '[PÈ]', '[PUÈ]'],
      0,
      'Eu è il suono ö: una e con le labbra a o. Peu significa poco e si distingue da peur [PÖR] solo per la r finale.',
    ),
    q(
      'q7',
      'Quale coppia ha pronuncia diversa?',
      ['tu / tout', 'sont / son', 'ces / ses', "c'est / s'est"],
      0,
      'Tu [TÜ] e tout [TU] hanno vocali diverse; le altre coppie sono omofone, ma si scrivono in modo diverso.',
    ),
    q(
      'q8',
      "Correggi: «Les fleurs que j'ai acheté sont belles.»",
      ['acheté → achetées', 'acheté → acheter', 'acheté → achetés', 'nessuna correzione'],
      0,
      'Il participio con avoir si accorda con il COD che precede (que = les fleurs, femminile plurale): achetées.',
    ),
    q(
      'q9',
      "Completa: «Je veux que tu ___ à l'heure.»",
      ['sois', 'es', 'seras', 'serais'],
      0,
      'Vouloir que con soggetti diversi regge il subjonctif: sois. Es e seras sono indicatif; serais è un conditionnel.',
    ),
    q(
      'q10',
      'Completa: «La ville ___ je suis né est petite.»',
      ['où', 'que', 'dont', 'qui'],
      0,
      'Per un luogo si usa où. Que richiederebbe un oggetto diretto, dont una costruzione con de, qui un soggetto.',
    ),
  ],
  [
    card('c1', 'Partitivi', "du (m.), de la (f.), de l' (vocale), des (pl.); dopo pas: de / d'."),
    card('c2', 'Pronomi: ordine', 'me/te/se/nous/vous → le/la/les → lui/leur → y → en: Je le lui donne.'),
    card('c3', 'y / en', "y = luogo; en = di + quantità: J'en ai deux; J'y vais."),
    card('c4', 'Ausiliare être', 'Verbi di moto (aller, venir, partir...) e riflessivi.'),
    card('c5', 'Accordo del participio', 'Con avoir: COD che precede. Con être: soggetto.'),
    card('c6', 'ne... pas / de', "Il n'a pas de pain."),
    card('c7', 'tu / tout', '[TÜ] / [TU]'),
    card('c8', 'pain / peine', '[PẼ] / [PÈN]'),
    card('c9', 'bon / bonne', '[BÕ] / [BÒN]'),
    card('c10', 'sont / son', 'Omofoni [SÕ]: sont (essere) vs son (suo).'),
  ],
  [
    prac(
      'p1',
      'Traduci: «Mi chiamo Luca e abito a Milano.»',
      "Je m'appelle Luca et j'habite à Milan. Nota: s'appeler, à + città.",
    ),
    prac(
      'p2',
      'Traduci: «Ho ventitré anni.»',
      "J'ai vingt-trois ans. Nota: avoir per l'età; vingt-trois con trattino.",
    ),
    prac(
      'p3',
      "Traduci: «Vorrei un bicchiere d'acqua.»",
      "Je voudrais un verre d'eau. Nota: condizionale di cortesia, de l'eau → d'eau dopo un contenitore.",
    ),
    prac(
      'p4',
      'Traduci: «Che ore sono?»',
      "Quelle heure est-il ? (formale) / Quelle heure il est ? o Tu as l'heure ? (familiare). Nota: heure è femminile; «Il est quelle heure ?» è possibile ma marcato.",
    ),
    prac(
      'p5',
      'Traduci: «Sono le tre e mezza.»',
      'Il est trois heures et demie. Nota: demie con e al femminile dopo heures.',
    ),
    prac(
      'p6',
      'Traduci: «Vengo da Roma e vado in Francia.»',
      'Je viens de Rome et je vais en France. Nota: de + città, en + paese femminile.',
    ),
    prac(
      'p7',
      'Traduci: «Non ho tempo.»',
      "Je n'ai pas le temps. Nota: avoir le temps è una locuzione con l'articolo determinativo, che resta anche nella negazione. Je n'ai pas de temps è ammesso ma meno naturale.",
    ),
    prac('p8', 'Passé composé: «Je mange une pomme.»', "J'ai mangé une pomme. Nota: participio in -é."),
    prac('p9', 'Passé composé: «Elle va au cinéma.»', 'Elle est allée au cinéma. Nota: être e accordo femminile.'),
    prac(
      'p10',
      'Passé composé: «Nous nous levons à sept heures.»',
      'Nous nous sommes levés à sept heures. (levées se tutte donne.) Nota: verbo riflessivo con être.',
    ),
    prac(
      'p11',
      'Futuro: «Demain, je (partir) à huit heures.»',
      'Demain, je partirai à huit heures. Nota: futur simple di partir.',
    ),
    prac('p12', "Negativo: «Il a de l'argent.»", "Il n'a pas d'argent. Nota: de/d' dopo la negazione."),
    prac('p13', 'Pronome: «Je mange le gâteau.»', 'Je le mange. Nota: le davanti al verbo.'),
    prac('p14', 'Pronome: «Tu vas à Paris ?»', 'Tu y vas ? Nota: y sostituisce à Paris.'),
    prac('p15', 'Pronome: «Il a deux frères.»', 'Il en a deux. Nota: en + numero.'),
    prac(
      'p16',
      'Partitivi: «Je veux (pain) et (eau).»',
      "Je veux du pain et de l'eau. Nota: du (m.), de l' (davanti a vocale).",
    ),
    prac(
      'p17',
      'Possessivi: «Marie et (suo) amie.»',
      'Marie et son amie. Nota: davanti a vocale si usa son anche con nome femminile.',
    ),
    prac('p18', 'Correggi: «Je suis allé à le marché.»', 'Je suis allé au marché. Nota: à + le → au.'),
    prac(
      'p19',
      "Correggi: «Les fleurs que j'ai acheté.»",
      "Les fleurs que j'ai achetées. Nota: accordo con il COD che precede.",
    ),
    prac('p20', 'Imperativo: «Tu me donnes le sel.»', "Donne-moi le sel. Nota: me → moi dopo l'imperativo."),
    prac(
      'p21',
      'Riscrivi in modo più esplicito: «Ne pas fumer.»',
      'Il est interdit de fumer. / Défense de fumer. Nota: forme impersonale.',
    ),
    prac(
      'p22',
      'Comparativo: «Marie è alta come Paul.»',
      "Marie est aussi grande que Paul. Nota: aussi... que per l'uguaglianza.",
    ),
    prac(
      'p23',
      'Superlativo: «È il più bel film che abbia visto.»',
      "C'est le plus beau film que j'aie vu. Nota: dopo un superlativo il subjonctif passé esprime un giudizio personale; l'indicatif (j'ai vu) è possibile se constati un fatto.",
    ),
    prac('p24', 'Domanda con est-ce que: «Tu parles anglais ?»', 'Est-ce que tu parles anglais ? Nota: forma neutra.'),
    prac('p25', 'Inversione: «Vous avez faim ?»', 'Avez-vous faim ? Nota: inversione formale.'),
    prac(
      'p26',
      'Discorso indiretto: «Il dit : « Je suis malade »»',
      "Il dit qu'il est malade. Nota: verbo introduttivo al presente, nessun cambio di tempo.",
    ),
    prac('p27', 'Subjonctif: «Il faut que tu (venir).»', 'Il faut que tu viennes. Nota: subjonctif présent di venir.'),
    prac(
      'p28',
      "Condizionale: «Si j'avais le temps, je (voyager) plus.»",
      "Si j'avais le temps, je voyagerais plus. Nota: si + imparfait → conditionnel présent.",
    ),
    prac('p29', 'Gérondif: «Il lit et il mange.»', 'Il lit en mangeant. Nota: stesso soggetto, azioni simultanee.'),
    prac(
      'p30',
      "Relativo: «J'ai lu un livre. Ce livre est excellent.»",
      "Le livre que j'ai lu est excellent. Nota: que = COD.",
    ),
    prac(
      'p31',
      "Dont: «J'ai besoin d'un stylo. Où est ce stylo ?»",
      "Où est le stylo dont j'ai besoin ? Nota: avoir besoin de → dont.",
    ),
    prac(
      'p32',
      'Passiva → attiva: «Le voleur a été arrêté par la police.»',
      "La police a arrêté le voleur. Nota: l'agente diventa il soggetto.",
    ),
    prac(
      'p33',
      'Connettore: «Il est fatigué. Il continue.» (bien que)',
      "Bien qu'il soit fatigué, il continue. Nota: bien que + subjonctif.",
    ),
    prac(
      'p34',
      'Traduci: «Se avessi saputo, sarei venuto.»',
      "Si j'avais su, je serais venu. Nota: plus-que-parfait + conditionnel passé.",
    ),
    prac('p35', 'Traduci: «Mi manchi.»', 'Tu me manques. Nota: il soggetto francese è la persona che manca.'),
    prac('p36', 'Traduci: «Ho caldo.»', "J'ai chaud. Nota: avoir chaud; il fait chaud è il tempo."),
    prac(
      'p37',
      'Traduci: «Da quanto tempo studi francese?»',
      'Depuis combien de temps étudies-tu le français ? Nota: depuis + présent.',
    ),
    prac(
      'p38',
      'Traduci: «Due anni fa sono andato a Parigi.»',
      'Il y a deux ans, je suis allé à Paris. Nota: il y a + durata = fa.',
    ),
    prac(
      'p39',
      'Leggi ad alta voce e trascrivi la pronuncia: «un café».',
      'ẽ ka-FÉ. Nota: la n di un è assorbita dalla nasale ẽ.',
    ),
    prac(
      'p40',
      'Leggi ad alta voce e trascrivi la pronuncia: «ils ont».',
      'il-ZÕ. Nota: liaison obbligatoria s → z, e la l di ils resta.',
    ),
    prac(
      'p41',
      'Traduci in italiano: «Je ne sais pas où il habite.»',
      "Non so dove abiti. Nota: ne... pas circonda il verbo; l'italiano usa il congiuntivo solo nelle interrogative indirette formali.",
    ),
    prac(
      'p42',
      "Traduci in italiano: «Il y a trois ans que j'habite ici.»",
      'Abito qui da tre anni. Nota: il y a... que + durata ha il senso di «da» e vuole il présent.',
    ),
    prac(
      'p43',
      'Traduci in italiano: «Elle a fini par comprendre ce dont il parlait.»',
      'Alla fine ha capito di che cosa stava parlando. Nota: finir par + infinito = alla fine; ce dont = ciò di cui.',
    ),
    prac(
      'p44',
      'Traduci in italiano: «Quoi que tu dises, je reste.»',
      'Qualunque cosa tu dica, resto. Nota: quoi que (due parole) + subjonctif = qualunque cosa.',
    ),
    prac(
      'p45',
      "Traduci in italiano: «On m'a volé mon sac dans le métro.»",
      'Mi hanno rubato la borsa in metropolitana. Nota: on = costruzione impersonale, equivalente italiano della terza persona plurale.',
    ),
  ],
)

export const fraEsame: CourseModule = mod(
  'fr-esame',
  'Preparazione al DELF A2, B1, B2',
  'Formato, strategie, modelli di scrittura, orale, 40 domande miste',
  'drill',
  `<p class="lead">Il <b>DELF</b> (Diplôme d'études en langue française) è la certificazione ufficiale del Ministero dell'Istruzione francese, valida a vita. Ogni livello (A1, A2, B1, B2) è un esame separato. Qui ci concentriamo su <b>A2, B1 e B2</b>.</p>
<h3>Struttura comune</h3>
<ul>
<li><b>Quattro prove</b>, ciascuna su 25 punti: <b>CO</b> compréhension de l'oral, <b>CE</b> compréhension des écrits, <b>PE</b> production écrite, <b>PO</b> production orale.</li>
<li>Totale 100 punti. Per ottenere il diploma servono <b>50/100</b> e un minimo di <b>5/25 in ogni prova</b>.</li>
<li>Le prove collettive (CO, CE, PE) si svolgono insieme; la PO è individuale con un esaminatore.</li>
</ul>
<h3>Durate e compiti (da verificare sul sito ufficiale)</h3>
<div class="tblw"><table><tr><th>Livello</th><th>CO</th><th>CE</th><th>PE</th><th>PO</th></tr>
<tr><td>A2</td><td>25 min</td><td>30 min</td><td>45 min</td><td>6-8 min</td></tr>
<tr><td>B1</td><td>25 min</td><td>45 min</td><td>45 min</td><td>15 min</td></tr>
<tr><td>B2</td><td>30 min</td><td>60 min</td><td>60 min</td><td>20 min</td></tr>
</table></div>
<ul>
<li><b>A2 PE</b>: due brevi testi (circa 60 parole): raccontare un evento personale; scrivere un messaggio per invitare, ringraziare, scusarsi.</li>
<li><b>B1 PE</b>: un testo di almeno 160 parole che esprime un punto di vista su un tema generale (articolo, lettera, saggio breve).</li>
<li><b>B2 PE</b>: un testo argomentativo di almeno 250 parole (lettera formale, articolo, saggio).</li>
<li><b>PO B1</b>: colloquio guidato, esercizio di interazione, esposizione di un punto di vista. <b>PO B2</b>: presentazione di un'opinione da un testo e dibattito con l'esaminatore, con preparazione di circa 30 minuti.</li>
</ul>
<h3>Strategie generali</h3>
<ul>
<li><b>CO</b>: leggi le domande prima dell'ascolto; la maggior parte dei documenti è ascoltata due volte, ma a B1 e B2 alcuni solo una volta: leggi le istruzioni; annota parole chiave, non frasi.</li>
<li><b>CE</b>: leggi le domande per prime; cerca le parole chiave nel testo; non tradurre tutto.</li>
<li><b>PE</b>: rispetta il numero di parole, usa un piano chiaro e connettori; riserva 5 minuti per rileggere accenti e accordi.</li>
<li><b>PO</b>: parla anche se non conosci la parola esatta: riformula (<i>c'est-à-dire, autrement dit</i>).</li>
</ul>
<h3>Modelli di scrittura</h3>
<p><b>A2 · messaggio</b>: «Salut Marie, / Je t'écris pour t'inviter à mon anniversaire samedi à 20 heures. On dînera chez moi. Peux-tu venir ? / Bises, Luca». <b>B1 · opinione</b>: introduzione (tema + tuo parere), due argomenti con esempio, conclusione. <b>B2 · testo argomentativo</b>: introduzione (<i>De nos jours...</i>, problema), tesi, antitesi (<i>Certes..., mais...</i>), sintesi personale e conclusione. Formule: <i>Il est indéniable que..., En effet..., D'une part..., d'autre part..., Pour conclure...</i></p>
<h3>Criteri di valutazione della scrittura e dell'orale</h3>
<p>La produzione scritta e orale è valutata su griglie di criteri: <b>adeguatezza alla consegna</b> (rispetto del tema, del tipo di testo e della lunghezza), <b>coerenza e coesione</b> (piano, connettori, paragrafi), <b>lessico</b> (varietà e correttezza), <b>morfosintassi</b> (accordi, tempi, costruzioni) e <b>ortografia</b>. All'orale conta anche la <b>fonologia</b> (pronuncia e intonazione). Un testo semplice ma corretto e ben organizzato vale più di uno ambizioso pieno di errori.</p>
<h3>Pronuncia e orale</h3>
${PRON_SHORT}
<ul>
<li><b>Accento</b>: cade sull'ultima sillaba del gruppo. Mantieni un ritmo regolare, senza sillabare all'italiana.</li>
<li><b>Liaison obbligatoria</b>: articolo + nome (<i>les amis</i> [lé-za-MI]), pronome + verbo (<i>ils ont</i> [il-ZÕ], <i>vous avez</i> [vu-za-VÉ]), aggettivo + nome (<i>un petit ami</i> [ẽ pë-ti-ta-MI]).</li>
<li><b>Liaison vietata</b>: dopo <i>et</i> (<i>et un</i> [é ẽ]); davanti a h aspirata (<i>les héros</i> [lé é-RO]).</li>
<li><b>Riformulare</b>: «Pourriez-vous reformuler la question ?» [pu-RYÉ vu ré-for-mü-LÉ la kès-TYÕ].</li>
<li><b>Riempitivi utili</b>: <i>alors, en fait, eh bien, disons que</i> invece di «euh».</li>
<li><b>Presentazione</b>: «Bonjour Madame, je m'appelle... et je vais vous présenter...» [bõ-ZHUR ma-DAM, zhë ma-PÈL].</li>
<li><b>Numeri</b>: <i>vingt</i> [VẼ] ma <i>vingt-deux</i> [vẽt-DÖ]; <i>quatre-vingts</i> [ka-trë-VẼ].</li>
</ul>
<h3>Trappole per chi parla italiano</h3>
<ul>
<li>Non lasciare frasi in italiano: se non sai una parola, descrivila.</li>
<li>Controlla <b>gli accenti</b> (é, è, ê, à, ù, ç) e <b>gli articoli</b> in ogni frase.</li>
<li>Non confondere <b>sont / son</b>, <b>ces / ses</b>, <b>c'est / s'est</b>, <b>ou / où</b>: sono errori di ortografia frequenti nello scritto.</li>
</ul>
<div class="say"><b>Da ricordare.</b> «D'une part..., d'autre part...» · «Il est indéniable que...» · «Pour conclure,...»</div>`,
  [
    q(
      'q1',
      'Completa: «Je ___ à Paris depuis deux ans.»',
      ['habite', 'habitais', 'ai habité', 'habiterai'],
      0,
      'Depuis con una situazione ancora in corso vuole il présent: habite. Il passé composé indicherebbe che hai smesso di abitarci.',
    ),
    q(
      'q2',
      'Completa: «Elle ___ ses clés hier.»',
      ['a perdu', 'est perdue', 'perdu', 'avait perdue'],
      0,
      "Perdre prende avoir e il participio è perdu. Il COD ses clés segue, quindi non c'è accordo.",
    ),
    q(
      'q3',
      'Completa: «Je voudrais ___ eau.»',
      ["de l'", 'du', 'de la', 'des'],
      0,
      "Eau è femminile ma inizia per vocale: il partitivo diventa de l'. De la si usa davanti a consonante.",
    ),
    q(
      'q4',
      "Completa: «Il n'y a pas ___ lait.»",
      ['de', 'du', 'le', 'un'],
      0,
      'Dopo la negazione con pas il partitivo si riduce a de. Du lait sarebbe corretto solo in una frase affermativa.',
    ),
    q(
      'q5',
      'Completa: «Tu as vu Marie ? — Oui, je ___ ai vue.»',
      ["l'", 'la', 'lui', 'elle'],
      0,
      "Il pronome oggetto diretto la si elide davanti ad ai: l'ai vue. Il participio è accordato perché il COD precede.",
    ),
    q(
      'q6',
      'Completa: «Pour aller à Lyon, ___ deux heures.»',
      ['il faut', 'il fait', 'il est', "c'est"],
      0,
      "Il faut + durata esprime il tempo necessario. Il fait descrive il tempo atmosferico, il est l'ora.",
    ),
    q(
      'q7',
      'Completa: «Je vais ___ États-Unis.»',
      ['aux', 'en', 'à', 'dans les'],
      0,
      'Les États-Unis è plurale maschile: aux. En si usa con paesi femminili singolari (en France).',
    ),
    q(
      'q8',
      'Completa: «Marie et ___ amie.»',
      ['son', 'sa', 'ses', 'leur'],
      0,
      'Davanti a un sostantivo femminile che inizia per vocale si usa son, non sa: son amie. Ses sarebbe il plurale.',
    ),
    q(
      'q9',
      'Quale sostantivo è maschile?',
      ['le problème', 'la dent', 'la fleur', 'la mer'],
      0,
      'Problème è maschile, come tutti i nomi in -ème di origine greca. Dent, fleur e mer sono femminili.',
    ),
    q(
      'q10',
      'Completa: «Hier, il pleuvait quand je ___ sorti.»',
      ['suis', 'étais', 'serai', 'serais'],
      0,
      "Sortir è un verbo di moto e prende être. L'azione puntuale (suis sorti) interrompe il fondo descrittivo (pleuvait).",
    ),
    q(
      'q11',
      "Completa: «Si j'avais de l'argent, je ___ une voiture.»",
      ['achèterais', 'achète', 'achèterai', 'ai acheté'],
      0,
      'Si + imparfait chiede il condizionale presente nella principale. Achèterai sarebbe il periodo reale con si + présent.',
    ),
    q(
      'q12',
      'Completa: «Il faut que tu ___ plus de légumes.»',
      ['manges', 'manger', 'mangeras', 'mangerais'],
      0,
      "Il faut que richiede il subjonctif: tu manges. Con l'infinito si direbbe invece «il faut manger».",
    ),
    q(
      'q13',
      "Completa: «C'est le film ___ je t'ai parlé.»",
      ['dont', 'que', 'qui', 'où'],
      0,
      'Parler de qualcosa: il pronome relativo include de e diventa dont. Que sarebbe un COD, qui un soggetto.',
    ),
    q(
      'q14',
      "Completa: «Je cherche la maison ___ j'ai grandi.»",
      ['où', 'que', 'dont', 'qui'],
      0,
      'Dove si usa où per i luoghi. Que richiederebbe un verbo con oggetto diretto, ma grandir non ne ha.',
    ),
    q(
      'q15',
      "Completa: «Les lettres que j'ai ___ sont arrivées.»",
      ['envoyées', 'envoyé', 'envoyés', 'envoyer'],
      0,
      'Il participio con avoir si accorda con il COD che precede: les lettres, femminile plurale, quindi envoyées.',
    ),
    q(
      'q16',
      "Completa: «Elle m'a dit qu'elle ___ fatiguée.»",
      ['était', 'est', 'sera', 'serait'],
      0,
      'Con la principale al passato il présent diventa imparfait: était. Est sarebbe corretto solo dopo un verbo al presente.',
    ),
    q(
      'q17',
      'Completa: «Il parle ___ pensant à autre chose.»',
      ['en', 'de', 'à', 'par'],
      0,
      'Il gérondif si forma con en + participe présent. De, à e par non introducono un participio presente in questo senso.',
    ),
    q(
      'q18',
      'Quale frase è corretta?',
      [
        "Je pense qu'il a raison.",
        "Je pense qu'il ait raison.",
        "Je pense qu'il avoir raison.",
        "Je pense qu'il aie raison.",
      ],
      0,
      "Penser que affermativo regge l'indicativo: a raison. Ait (subjonctif) vale solo nella forma negativa o dubitativa.",
    ),
    q(
      'q19',
      'Come si dice «Spero che tu venga»?',
      [
        "J'espère que tu viendras.",
        "J'espère que tu viennes.",
        "J'espère que tu viendrais.",
        'Je souhaite que tu venir.',
      ],
      0,
      "Dopo espérer si usa l'indicativo, spesso il futuro. Je souhaite che sarebbe corretto con il subjonctif (que tu viennes).",
    ),
    q(
      'q20',
      'Completa: «Il est parti sans que personne le ___.»',
      ['voie', 'voit', 'verra', 'verrait'],
      0,
      'Sans que richiede il subjonctif. La forma di voir al subjonctif è voie, identica per je, tu, il (voie, voies, voie).',
    ),
    q(
      'q21',
      'Quale connettore esprime opposizione?',
      ['en revanche', 'par exemple', 'en effet', 'de plus'],
      0,
      "En revanche significa invece, per contro. Par exemple introduce un esempio, en effet una conferma e de plus un'aggiunta.",
    ),
    q(
      'q22',
      'Quale formula chiude una lettera formale?',
      [
        'Veuillez agréer mes salutations distinguées.',
        'À plus tard, grosses bises à tous.',
        'Salut à tous, à bientôt et bonne soirée à vous !',
        'Bien à toi, ciao et à bientôt !',
      ],
      0,
      'Il registro formale richiede la formula standard con vous. Le altre sono informali o mescolano francese e italiano.',
    ),
    q(
      'q23',
      'Dopo «après que» la norma vuole:',
      ["l'indicatif", 'le subjonctif', 'le conditionnel', "l'impératif"],
      0,
      "Après que esprime un fatto reale, quindi regge l'indicativo. Il subjonctif si sente nel parlato ma è considerato un errore.",
    ),
    q(
      'q24',
      'Qual è la nominalizzazione di «augmenter»?',
      ["l'augmentation", "l'augmentage", "l'augmentement", "l'augment"],
      0,
      "Il sostantivo è l'augmentation. Le altre forme non esistono; la regola vuole il suffisso -ation per molti verbi in -er.",
    ),
    q(
      'q25',
      'Come si dice «Se solo avessi studiato!»?',
      [
        "Si seulement j'avais étudié !",
        "Si seulement j'aurais étudié !",
        "Si seulement j'étudiais !",
        "Seulement si j'ai étudié !",
      ],
      0,
      "Si seulement + plus-que-parfait esprime un rimpianto nel passato. Si j'aurais è l'errore tipico del condizionale dopo si.",
    ),
    q(
      'q26',
      'Che cosa significa «assez» ?',
      ['abbastanza', 'molto, moltissimo', 'troppo, in eccesso', 'assai, parecchio'],
      0,
      'Assez vuol dire abbastanza. Assai non ha un equivalente diretto e si traduce con très o beaucoup.',
    ),
    q(
      'q27',
      'Che registro è «une bagnole» ?',
      ['familier', 'formale', 'letterario', 'neutro'],
      0,
      'Bagnole è una parola familiare per voiture, usata tra amici. Non va usata in un esame scritto o con un superiore.',
    ),
    q(
      'q28',
      'Come si dice «70» in Belgio e Svizzera?',
      ['septante', 'soixante-dix', 'huitante', 'nonante'],
      0,
      'Septante è la forma belga e svizzera. Nonante è 90 e huitante 80 in alcuni cantoni svizzeri.',
    ),
    q(
      'q29',
      'Qual è la soglia minima per ottenere il DELF?',
      ['50 punti su 100', '60 punti su 100', '40 punti su 100', '25 punti su 100'],
      0,
      'Occorrono 50/100, con almeno 5/25 per ogni prova. Il punteggio per ogni prova è su 25, non è la soglia complessiva.',
    ),
    q(
      'q30',
      'Che cosa indica la sigla «PO» ?',
      ['production orale', 'production officielle', "prise d'objet", 'prononciation orale'],
      0,
      'PO = production orale, la prova di parlato. PE è la production écrite, CO e CE le prove di comprensione.',
    ),
    q(
      'q31',
      'Quante parole richiede la PE del DELF B1 (minimo)?',
      ['160', '60', '250', '100'],
      0,
      "La PE del B1 chiede un testo di almeno 160 parole, mentre il B2 ne richiede almeno 250 e l'A2 circa 60 per compito.",
    ),
    q(
      'q32',
      'Come si pronuncia «les amis» ?',
      ['[lé-za-MI]', '[lé a-MI]', '[lès a-MIS]', '[lé-zè-MIS]'],
      0,
      'La s di les si pronuncia come z davanti a vocale (liaison). Anche la s finale di amis è muta: il suono finale è [MI].',
    ),
    q(
      'q33',
      'Come si pronuncia «les héros» ?',
      ['[lé é-RO]', '[lé-zé-RO]', '[lès-é-ROS]', '[lé-é-RUS]'],
      0,
      'Héros ha la h aspirata: impedisce la liaison. Con h muta si farebbe la liaison: les hommes [lé-ZÒM].',
    ),
    q(
      'q34',
      'Come si pronuncia «vingt-deux» ?',
      ['[vẽt-DÖ]', '[vẽ-DÖ]', '[vẽg-DÖ]', '[vẽt-DUZ]'],
      0,
      'Da 21 a 29 la t di vingt si pronuncia. Da solo, 20 è [VẼ]. Deux ha il suono ö, non u.',
    ),
    q(
      'q35',
      'Quale grafia è corretta?',
      ["J'ai mangé la pomme.", "J'ai manger la pomme.", "J'ai mangez la pomme.", "J'ai mangée la pomme."],
      0,
      "Il participio passato dei verbi in -er termina in -é. Si controlla sostituendo con vendu: «j'ai vendu la pomme».",
    ),
    q(
      'q36',
      'Completa: «Ils ___ partis hier.»',
      ['sont', 'son', 'ont', 'sons'],
      0,
      'Partir è un verbo di moto e prende être: ils sont partis. Son è un possessivo, ont è avoir.',
    ),
    q(
      'q37',
      'Quale frase è corretta?',
      ['Où est mon livre ?', 'Ou est mon livre ?', 'Où est ma livre ?', 'Ou es mon livre ?'],
      0,
      "Dove si scrive où con l'accento grave, mentre ou (senza accento) è la congiunzione «o». Livre è maschile: mon livre.",
    ),
    q(
      'q38',
      'Come si dice «Mi manchi»?',
      ['Tu me manques.', 'Je te manque.', 'Je manque à toi.', 'Tu manques à moi.'],
      0,
      'In francese il soggetto è la persona che manca: Tu me manques. Je te manque significa «io ti manco».',
    ),
    q(
      'q39',
      'Come si dice «Due anni fa»?',
      ['Il y a deux ans', 'Depuis deux ans', 'Deux ans avant', 'Pendant deux ans'],
      0,
      'Il y a + durata = fa. Depuis indica una durata ancora in corso, pendant una durata chiusa.',
    ),
    q(
      'q40',
      'Che cosa significa «fermer la porte» ?',
      ['chiudere la porta', 'fermare la porta', 'firmare la porta', 'affermare la porta'],
      0,
      'Fermer = chiudere. Fermare si traduce con arrêter: è uno dei falsi amici più comuni.',
    ),
  ],
  [
    card('c1', 'DELF: punteggio', '4 prove da 25 punti; diploma con 50/100 e almeno 5/25 per prova.'),
    card('c2', 'CO / CE / PE / PO', 'Compréhension orale / écrite; production écrite / orale.'),
    card('c3', 'PE B1', 'Testo di almeno 160 parole con punto di vista.'),
    card('c4', 'PE B2', 'Testo argomentativo di almeno 250 parole.'),
    card('c5', 'Piano B2', 'Introduzione, tesi, antitesi, sintesi, conclusione.'),
    card('c6', 'Connettori utili', "D'une part... d'autre part; certes... mais; pour conclure."),
    card('c7', 'Liaison obbligatoria', 'les amis [lé-za-MI]; ils ont [il-ZÕ]; vous avez [vu-za-VÉ].'),
    card('c8', 'Liaison vietata', 'Dopo et; davanti a h aspirata: les héros [lé é-RO].'),
    card('c9', 'Riformulare', "c'est-à-dire, autrement dit, en d'autres termes."),
    card('c10', 'vingt-deux', '[vẽt-DÖ]: la t si pronuncia da 21 a 29.'),
  ],
  [
    prac(
      'p1',
      'Scrivi un messaggio A2 (60 parole) per invitare un amico a una cena.',
      "Salut Paul, / Je t'écris pour t'inviter à dîner chez moi samedi à 20 heures. Je prépare un plat italien. Peux-tu venir ? Dis-moi si tu as des allergies. / À samedi, Luca. Nota: invito, data, ora, richiesta, saluti.",
    ),
    prac(
      'p2',
      'Apri e chiudi un testo B2 sul lavoro da remoto.',
      "De nos jours, le télétravail est devenu courant. Est-il vraiment bénéfique ? D'une part, il permet de gagner du temps et d'organiser sa journée. D'autre part, il peut isoler les salariés. Certes, la flexibilité est un atout, mais elle suppose des règles claires. Pour conclure, le télétravail est avantageux à condition d'être encadré. Nota: accroche, problématique, due argomenti con connettori, conclusione.",
    ),
    prac(
      'p3',
      "Prepara 3 frasi per riformulare una domanda all'orale.",
      "Pourriez-vous reformuler la question, s'il vous plaît ? / Si je comprends bien, vous me demandez si... / Autrement dit, vous voulez savoir... Nota: pronuncia [pu-RYÉ vu ré-for-mü-LÉ].",
    ),
    prac(
      'p4',
      'Trascrivi la pronuncia: «les amis», «ils ont», «vingt-deux».',
      'les amis [lé-za-MI]; ils ont [il-ZÕ]; vingt-deux [vẽt-DÖ]. Nota: liaison s → z; t di vingt pronunciata.',
    ),
    prac(
      'p5',
      'Scrivi tre connettori per aprire, opporre e concludere.',
      "D'abord / En premier lieu...; En revanche / Cependant...; Pour conclure / En somme... Nota: combinali per costruire il testo.",
    ),
  ],
)
