import { card, mod, prac, q } from './python-path.helpers'
import { PRON_SHORT, vsec } from './tedesco.pron'

// German course part A, modules 4-6 (nomi, presente, quotidiano). Notation: see tedesco.a.ts.

export const deNomi = mod(
  'de-nomi',
  'Nomi, genere, plurale e articoli',
  'Der/die/das, plurale (5 tipi), articoli, nominativo e accusativo, kein, possessivi, composti',
  'a1',
  `${PRON_SHORT}
<p class="lead">Ogni sostantivo tedesco ha un genere (<b>der</b>, <b>die</b>, <b>das</b>) che spesso non coincide con l'italiano. Regola d'oro: <b>impara sempre il nome con l'articolo e il plurale</b>: «der Tisch, -e».</p>
<h3>Il genere: indizi e trappole</h3>
<table><tr><th>Genere</th><th>Indizi (tendenze)</th></tr>
<tr><td>der (m)</td><td>-er (Lehrer), -ling, -ismus; giorni, mesi, stagioni (der Montag, der Mai, der Sommer); fenomeni meteo (der Regen)</td></tr>
<tr><td>die (f)</td><td>-ung, -heit, -keit, -schaft, -tion, -tät, -ie, -ei, -in; quasi tutte in -e (die Lampe)</td></tr>
<tr><td>das (n)</td><td>-chen, -lein; -um (das Datum); Ge- (das Gebäude); verbi sostantivati (das Essen); colori (das Blau)</td></tr></table>
<p>Eccezioni frequenti: <i>die Mutter, die Tochter, die Schwester</i> (in -er ma femminili); <i>der Name, der Käse</i> [KÈ:-zë], <i>der Junge</i> [IUN-gë], <i>das Ende</i> (in -e ma non femminili). Per gli esseri umani vale quasi sempre il sesso, ma <i>das Mädchen</i> [MÈ:T-çën] (la ragazza) e <i>das Kind</i> [KINT] sono neutri. Disaccordi con l'italiano: <i>die Sonne</i> (il sole), <i>der Mond</i> [MO:NT] (la luna), <i>der Apfel</i> [AP-fël] (la mela), <i>die Milch</i> [MILÇ] (il latte), <i>die Butter</i> [BU-ta] (il burro), <i>das Brot</i> [BRO:T] (il pane), <i>das Salz</i> [ZALTS] (il sale), <i>der Bahnhof</i> [BA:N-ho:f] (la stazione).</p>
<h3>Il plurale: 5 tipi</h3>
<table><tr><th>Tipo</th><th>Esempi</th></tr>
<tr><td>-e (± umlaut)</td><td>der Tag → die Tage; die Stadt → die Städte [SHTÈ-të]; der Sohn → die Söhne [ZÖ:-në]</td></tr>
<tr><td>-er (± umlaut)</td><td>das Kind → die Kinder; das Haus → die Häuser [HOI-za]; das Buch → die Bücher [BÜ:-ça]; der Mann → die Männer</td></tr>
<tr><td>-(e)n</td><td>die Frau → die Frauen; die Blume → die Blumen; die Zeitung → die Zeitungen; der Student → die Studenten</td></tr>
<tr><td>nessuna desinenza (± umlaut)</td><td>der Lehrer → die Lehrer; der Vater → die Väter [FÈ:-ta]; der Bruder → die Brüder; der Apfel → die Äpfel; das Mädchen → die Mädchen</td></tr>
<tr><td>-s (parole straniere)</td><td>das Auto → die Autos; das Handy → die Handys; das Hotel → die Hotels</td></tr></table>
<p>Regole pratiche: i <b>femminili</b> fanno quasi sempre -(e)n (-in → -innen: die Lehrerin → die Lehrerinnen [LÉ:-re-ri-nën]); i maschili e neutri in <b>-er, -el, -en, -chen, -lein</b> non cambiano; i maschili brevi prendono -e; i neutri brevi prendono -e o -er; le parole straniere recenti -s. Il plurale ha sempre l'articolo <b>die</b>. Non indovinare: cerca nel dizionario «der Tag, -e».</p>
<h3>Articoli, nominativo e accusativo</h3>
<table><tr><th></th><th>Nom.</th><th>Akk.</th><th>indet. N / A</th></tr>
<tr><td>maschile</td><td>der</td><td>den</td><td>ein / einen</td></tr>
<tr><td>femminile</td><td>die</td><td>die</td><td>eine / eine</td></tr>
<tr><td>neutro</td><td>das</td><td>das</td><td>ein / ein</td></tr>
<tr><td>plurale</td><td>die</td><td>die</td><td>– / –</td></tr></table>
<p>Il nominativo è il soggetto (Wer? Was?): <i>Der Mann kommt.</i> L'accusativo è il complemento oggetto (Wen? Was?): <i>Ich sehe den Mann.</i> Cambia solo il maschile: <i>Ich habe einen Hund, eine Katze, ein Kind.</i> Il nome non cambia, tranne alcuni maschili deboli in -en: <i>den Studenten, den Jungen, den Herrn, den Kollegen, den Franzosen</i>. Al plurale indeterminato non c'è articolo: <i>Ich habe Bücher.</i> Trappola per un italiano: nessun partitivo (del, dei): <i>Ich trinke Wasser</i>, <i>Hier sind Bücher</i>. Professioni e nazionalità senza articolo: <i>Ich bin Lehrer.</i></p>
<h3>Kein: la negazione del nome</h3>
<p><b>kein-</b> [KAIN] si declina come ein-, con il plurale: <i>Ich habe keinen Hund / keine Katze / kein Auto / keine Kinder</i>. Si usa quando c'è ein- o nessun articolo (Ich habe Zeit → Ich habe <b>keine</b> Zeit). Negazione di nome con articolo determinativo o di verbi: <i>nicht</i> (vedi de-quotidiano).</p>
<h3>Aggettivi: predicativi e prima del nome</h3>
<p>Dopo sein/werden l'aggettivo <b>non ha desinenza</b>: <i>Das Haus ist groß</i> [GRO:SS]. Parole utili: klein [KLAIN], gut [GU:T], schlecht [SHLEÇT], neu [NOI], alt [ALT], schön [SHÖ:N], teuer [TOI-a], billig [BI-liç], schnell [SHNEL], langsam [LANG-za:m], müde [MÜ:-dë], hungrig [HUN-griç]. Davanti al nome prende la desinenza: con ein-: <i>ein großer Tisch</i> (m), <i>eine große Lampe</i> (f), <i>ein großes Haus</i> (n); accusativo m: <i>einen großen Tisch</i>; con der-: <i>der große Tisch, den großen Tisch, die große Lampe, das große Haus, die großen Häuser</i>.</p>
<h3>I possessivi</h3>
<table><tr><th>Persona</th><th>Possessivo</th></tr>
<tr><td>ich / du</td><td>mein [MAIN] / dein [DAIN]</td></tr>
<tr><td>er, es / sie</td><td>sein [ZAIN] / ihr [I:R]</td></tr>
<tr><td>wir / ihr</td><td>unser [UN-za] / euer [OI-a]</td></tr>
<tr><td>sie (loro) / Sie</td><td>ihr / Ihr [I:R]</td></tr></table>
<p>Si declinano come ein-: <i>mein Bruder, meine Schwester, mein Kind, meine Eltern</i>; accusativo: <i>Ich besuche meinen Bruder</i>; euer perde la e: <i>eure Kinder</i>. Il possessivo concorda con il <b>possessore</b>: <i>sein Vater</i> (suo, di lui) ≠ <i>ihr Vater</i> (suo, di lei). Niente articolo: <i>mein Haus</i>, non «il mio casa».</p>
<h3>Sostantivi composti</h3>
<p>Il genere e il plurale vengono dall'<b>ultimo elemento</b>, l'accento cade sul primo: <i>die Haustür</i> [HAUS-tü:r], <i>der Schulhof</i>, <i>das Wörterbuch</i> [VÖR-ta-bu:ch]. Spesso c'è un -s- o -(e)n- di unione: <i>der Geburtstag</i>, <i>das Krankenhaus</i> [KRAN-kën-haus]. Esempi curiosi: <i>der Handschuh</i> (guanto = scarpa della mano), <i>der Staubsauger</i> [SHTAUP-zau-ga] (aspirapolvere), <i>der Kühlschrank</i> [KÜ:L-shrank] (frigorifero), <i>der Flughafen</i> [FLU:K-ha:-fën] (aeroporto).</p>
<div class="say"><b>Cosa dire.</b> «Ich habe einen Bruder und eine Schwester. Mein Bruder ist Lehrer, meine Schwester ist Studentin. Wir haben keinen Hund.»</div>`,
  [
    q(
      'q1',
      `Quale articolo ha «Zeitung» (giornale)?`,
      [
        `die Zeitung: -ung è sempre femminile`,
        `der Zeitung: finisce con una consonante`,
        `das Zeitung: è un oggetto`,
        `die Zeitung: il genere è casuale`,
      ],
      0,
      `I nomi in -ung sono femminili senza eccezioni. L'idea che il genere sia casuale non aiuta: i suffissi danno regole molto affidabili.`,
    ),
    q(
      'q2',
      `Qual è l'articolo di «Mädchen» (ragazza)?`,
      [
        `das Mädchen, perché -chen rende neutro`,
        `die Mädchen, perché indica una ragazza`,
        `der Mädchen, perché finisce in -en`,
        `die Mädchen, perché finisce in -e`,
      ],
      0,
      `Il diminutivo -chen forma sempre neutri, anche per persone di sesso femminile. L'italiano suggerisce il femminile, ma il suffisso prevale.`,
    ),
    q(
      'q3',
      `Qual è il plurale di «Buch» (libro)?`,
      [`die Bücher`, `die Buchs`, `die Büchen`, `die Buche`],
      0,
      `I neutri monosillabici spesso fanno -er con umlaut. Buchs sembra un plurale in -s straniero e Buche (faggio) è un'altra parola.`,
    ),
    q(
      'q4',
      `Completa: «Ich sehe ___ Mann.»`,
      [`den`, `der`, `dem`, `das`],
      0,
      `Mann è maschile e oggetto diretto, quindi accusativo den. Der è il nominativo, la scelta istintiva quando si pensa all'articolo base.`,
    ),
    q(
      'q5',
      `Completa: «Ich habe ___ Auto.»  (negativo)`,
      [`kein`, `nicht`, `keinen`, `keine`],
      0,
      `Auto è neutro, quindi kein. Keinen sarebbe maschile, e nicht non si usa per negare un nome con ein- o senza articolo.`,
    ),
    q(
      'q6',
      `Completa: «Er besucht ___ Mutter.» (la sua)`,
      [`seine`, `ihre`, `sein`, `seiner`],
      0,
      `Il possessore è maschile (sein-) e Mutter, femminile accusativo, vuole la desinenza -e. Ihre indicherebbe una possessora, sein non ha la -e.`,
    ),
    q(
      'q7',
      `Quale genere ha «Haustür» (porta di casa)?`,
      [
        `die Haustür, come Tür (ultimo elemento)`,
        `das Haustür, come Haus (primo elemento)`,
        `der Haustür, come tutti i composti`,
        `die Haustür, ma solo perché è una porta`,
      ],
      0,
      `Il genere del composto viene dall'ultimo elemento. Il primo (Haus) dà l'accento e il significato, ma non il genere.`,
    ),
    q(
      'q8',
      `Completa: «Das Haus ist ___.»`,
      [`groß`, `großes`, `große`, `großer`],
      0,
      `Dopo sein l'aggettivo non prende desinenza. Le forme con -es, -e, -er esistono solo davanti al nome (ein großes Haus).`,
    ),
    q(
      'q9',
      `Come si legge «Apfel» (mela)?`,
      [`AP-fël: p e f insieme`, `A-fël: senza la p`, `AF-pël: f prima di p`, `A-pël: senza la f`],
      0,
      `Pf si dice come p seguita da f nella stessa emissione. L'errore frequente è perdere la p e dire A-fël.`,
    ),
    q(
      'q10',
      `Come si legge «Mädchen» (ragazza)?`,
      [
        `MÈ:T-çën: d finale suona t, -chen è ç`,
        `MÈ:D-chën: d sonora e ch raschiata`,
        `MA-dken: come in italiano`,
        `MÈ:T-kën: -chen come k`,
      ],
      0,
      `La d prima di -chen è in fine sillaba e suona t, mentre -chen è sempre ç. La lettura italiana ch = k è la trappola più comune.`,
    ),
  ],
  [
    card('c1', `der / die / das`, `Maschile / femminile / neutro. Plurale sempre die. Impara il nome con l'articolo.`),
    card(
      'c2',
      `-ung, -heit, -keit, -schaft, -tion`,
      `Suffissi sempre femminili: die Zeitung, die Gesundheit, die Freundschaft, die Nation.`,
    ),
    card('c3', `-chen, -lein; -um; Ge-`, `Suffissi neutri: das Mädchen, das Fräulein, das Datum, das Gebäude.`),
    card(
      'c4',
      `Nominativo → accusativo`,
      `Cambia solo il maschile: der → den, ein → einen, mein → meinen, kein → keinen.`,
    ),
    card(
      'c5',
      `5 plurali`,
      `-e (Tage), -er (Kinder), -(e)n (Frauen), nessuna desinenza (Lehrer), -s (Autos); spesso con umlaut.`,
    ),
    card('c6', `die Sonne / der Mond`, `Il sole è femminile, la luna è maschile: l'opposto dell'italiano.`),
    card(
      'c7',
      `kein-`,
      `Nega un nome senza articolo o con ein-: Ich habe keine Zeit. Si declina come ein- (keinen Hund).`,
    ),
    card('c8', `sein / ihr`, `Concordano con il possessore: sein Vater = suo (di lui); ihr Vater = suo (di lei).`),
    card(
      'c9',
      `Composti: genere dall'ultimo elemento`,
      `die Haus|tür, der Schul|hof, das Wörter|buch. Accento sul primo elemento.`,
    ),
    card('c10', `Pf in Apfel [AP-fël]`, `p e f insieme; non perdere la p. Anche Pferd [PFÉ:RT], Kopf [KOPF].`),
    card('c11', `Mädchen [MÈ:T-çën]`, `d finale di sillaba = t; -chen = ç. Neutro: das Mädchen.`),
    card(
      'c12',
      `ß in groß [GRO:SS]`,
      `ß = s sorda dopo vocale lunga. Groß, grüßen, Fuß, Straße. Con vocale breve: ss (Fluss).`,
    ),
  ],
  [
    prac(
      'p1',
      `Traduci: «Ho un fratello, una sorella e un cane.»`,
      `Ich habe einen Bruder, eine Schwester und einen Hund. Nota: Bruder e Hund maschili, quindi einen all'accusativo; Schwester femminile, eine.`,
    ),
    prac(
      'p2',
      `Metti al plurale: der Tag, das Kind, die Frau, der Lehrer, das Auto, die Stadt.`,
      `die Tage; die Kinder; die Frauen; die Lehrer; die Autos; die Städte. Nota: Stadt riceve -e con umlaut.`,
    ),
    prac(
      'p3',
      `Correggi: «Ich habe nicht Zeit. Ich sehe der Mann. Das ist mein Mutter.»`,
      `Ich habe keine Zeit. Ich sehe den Mann. Das ist meine Mutter. Nota: kein per nomi senza articolo; accusativo maschile den; Mutter femminile, quindi meine.`,
    ),
    prac(
      'p4',
      `Traduci: «Il suo (di lui) libro è nuovo; la sua (di lei) borsa è vecchia.»`,
      `Sein Buch ist neu; ihre Tasche ist alt. Nota: possessivo con il possessore, desinenza -e per il femminile Tasche.`,
    ),
    prac(
      'p5',
      `Forma il composto con articolo: l'orologio da polso (braccio + orologio), la porta della cucina (cucina + porta).`,
      `die Armbanduhr (Arm + Band + Uhr); die Küchentür (Küche + Tür). Nota: genere dall'ultimo elemento, quindi die.`,
    ),
  ],
)

export const dePresente = mod(
  'de-presente',
  'Il presente: verbi regolari e irregolari',
  'Desinenze, a>ä, e>i/ie, -est/-et, wissen e kennen, ordine V2, niente forma progressiva',
  'a1',
  `${PRON_SHORT}
<p class="lead">Il presente tedesco serve per ciò che accade ora, le abitudini e (spesso) il futuro. È più semplice dell'italiano: solo tre desinenze diverse. Il punto chiave è l'<b>ordine</b>: il verbo coniugato sta sempre al secondo posto.</p>
<h3>Verbi regolari</h3>
<p>Si toglie <b>-en</b> dall'infinito e si aggiunge: <b>-e, -st, -t, -en, -t, -en</b>.</p>
<table><tr><th>Persona</th><th>machen</th><th>arbeiten</th><th>heißen</th></tr>
<tr><td>ich</td><td>mache [MA-chë]</td><td>arbeite [AR-bai-të]</td><td>heiße [HAI-ssë]</td></tr>
<tr><td>du</td><td>machst [MACHST]</td><td>arbeitest [AR-bai-tëst]</td><td>heißt [HAIST]</td></tr>
<tr><td>er / sie / es</td><td>macht [MACHT]</td><td>arbeitet [AR-bai-tët]</td><td>heißt [HAIST]</td></tr>
<tr><td>wir</td><td>machen</td><td>arbeiten</td><td>heißen</td></tr>
<tr><td>ihr</td><td>macht</td><td>arbeitet</td><td>heißt</td></tr>
<tr><td>sie / Sie</td><td>machen</td><td>arbeiten</td><td>heißen</td></tr></table>
<p><b>-est / -et</b>: se la radice finisce in <b>-t, -d, -chn, -ffn, -tm, -dn</b> si inserisce una e per poter pronunciare: arbeitest, findest [FIN-dëst], wartet [VAR-tët], öffnet [ÖF-nët], regnet [RE:G-nët], atmet. Se la radice finisce in <b>-s, -ß, -z, -x</b> la forma di du è <b>-t</b> (non -st): du heißt [HAIST], du tanzt [TANTST], du reist [RAIST]. Verbi in -eln, -ern: ich wandere, wir wandern.</p>
<h3>Verbi irregolari: a > ä, e > i, e > ie</h3>
<p>Alcuni verbi cambiano la vocale della radice solo per <b>du</b> e <b>er / sie / es</b> (le altre persone sono regolari):</p>
<table><tr><th>Persona</th><th>fahren</th><th>sprechen</th><th>lesen</th></tr>
<tr><td>ich</td><td>fahre [FA:-rë]</td><td>spreche [SHPRE-çë]</td><td>lese [LÉ:-zë]</td></tr>
<tr><td>du</td><td>fährst [FÈ:RST]</td><td>sprichst [SHPRIÇST]</td><td>liest [LI:ST]</td></tr>
<tr><td>er / sie / es</td><td>fährt [FÈ:RT]</td><td>spricht [SHPRIÇT]</td><td>liest [LI:ST]</td></tr>
<tr><td>wir / sie</td><td>fahren</td><td>sprechen</td><td>lesen</td></tr></table>
<ul><li><b>a > ä</b>: fahren, schlafen [SHLA:-fën] (schläft), laufen [LAU-fën] (läuft [LOIFT]), tragen (trägt), waschen (wäscht), halten (hält), fallen (fällt), lassen (lässt).</li><li><b>e > i</b>: sprechen, essen (du isst [IST], er isst), geben (gibt), helfen (hilft), nehmen (du nimmst, er nimmt, la consonante cambia), treffen (trifft), vergessen (vergisst).</li><li><b>e > ie</b>: lesen (liest), sehen (siehst [ZI:ST]), empfehlen (empfiehlt).</li></ul>
<p>Attenzione: <b>gehen, kommen, wohnen, stehen</b> sono regolari. Il presente dei verbi sein/haben/werden è in de-sein, i modali in de-quotidiano. Altra forma speciale: <b>wissen</b>: ich weiß [VAIS], du weißt [VAIST], er weiß, wir wissen [VI-ssën], ihr wisst [VIST], sie wissen.</p>
<h3>Wissen o kennen?</h3>
<p>L'italiano usa «sapere / conoscere»; il tedesco distingue tre verbi.</p>
<ul><li><b>wissen</b> = sapere un fatto, un'informazione: <i>Ich weiß, dass er kommt.</i> <i>Ich weiß die Antwort nicht.</i></li><li><b>kennen</b> [KE-nën] = essere in familiarità con una persona, un luogo, una cosa: <i>Ich kenne Berlin.</i> <i>Kennst du Maria?</i></li><li><b>können</b> = saper fare (capacità): <i>Ich kann schwimmen.</i> <i>Ich kann Deutsch</i> (so il tedesco).</li></ul>
<p>Errori tipici: «Ich kenne, dass...» e «Ich weiß Maria». Combinazione: <i>Ich weiß, wo er wohnt</i> (so dove abita) ma <i>Ich kenne seine Adresse</i>.</p>
<h3>L'ordine delle parole: il verbo al secondo posto</h3>
<p>Nella frase principale il verbo coniugato è sempre in <b>seconda posizione</b> (non seconda parola: la prima posizione può essere un gruppo). Prima posizione: soggetto, o un altro elemento che il parlante vuole mettere in evidenza; in quest'ultimo caso il soggetto passa <b>dopo</b> il verbo (inversione).</p>
<ul><li><i>Ich fahre morgen nach Berlin.</i></li><li><i>Morgen fahre ich nach Berlin.</i> (non «Morgen ich fahre»)</li><li><i>Nach Berlin fahre ich morgen.</i></li><li><i>Am Montag um acht Uhr beginnt der Kurs.</i> (un gruppo sta in prima posizione)</li></ul>
<p>Ordine dei complementi: tempo – causa – modo – luogo (<i>Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin</i>). Il soggetto è sempre espresso: <i>Ich wohne in Wien</i>, non «Wohne in Wien». Niente forma progressiva: «sto mangiando» = <i>Ich esse gerade</i> [GË-RA:-dë]. Il presente è anche futuro con un avverbio: <i>Morgen komme ich</i>. «Da due anni» vedi de-riflessivi.</p>
<div class="say"><b>Cosa dire.</b> «Ich spreche ein bisschen Deutsch. Ich lese gern und fahre oft mit dem Zug nach München [MÜN-çën].»</div>`,
  [
    q(
      'q1',
      `Qual è la forma di du di «fahren»?`,
      [`du fährst`, `du fahrst`, `du fährt`, `du fahrest`],
      0,
      `Fahren passa da a ad ä solo per du e er. Fahrst è la coniugazione regolare, che sarebbe giusta per un verbo senza cambio di vocale.`,
    ),
    q(
      'q2',
      `Qual è la forma di du di «sprechen»?`,
      [`du sprichst`, `du sprechst`, `du sprichts`, `du sprecht`],
      0,
      `Sprechen cambia e > i per du e er. Sprechst sarebbe la forma regolare; sprecht è la forma di ihr.`,
    ),
    q(
      'q3',
      `Qual è la forma di du di «arbeiten»?`,
      [`du arbeitest`, `du arbeitst`, `du arbeitt`, `du arbeiten`],
      0,
      `La radice finisce in t, quindi serve la e di appoggio. Arbeitst sarebbe impronunciabile e arbeiten è la forma di wir e sie.`,
    ),
    q(
      'q4',
      `Completa: «___ du Maria? Ich ___ sie gut.»`,
      [`Kennst / kenne`, `Weißt / weiß`, `Kannst / kann`, `Weißt / kenne`],
      0,
      `Per una persona si usa kennen. Wissen indica un'informazione e können una capacità: sapere una persona non è un fatto da apprendere.`,
    ),
    q(
      'q5',
      `Quale frase ha l'ordine corretto?`,
      [
        `Morgen fahre ich nach Berlin.`,
        `Morgen ich fahre nach Berlin.`,
        `Ich morgen fahre nach Berlin.`,
        `Morgen nach Berlin ich fahre.`,
      ],
      0,
      `Il verbo va in seconda posizione: dopo Morgen viene fahre e poi il soggetto. Morgen ich fahre è la tentazione di chi ripete l'ordine italiano.`,
    ),
    q(
      'q6',
      `Come dici «Sto mangiando adesso»?`,
      [`Ich esse gerade.`, `Ich bin gerade essen.`, `Ich bin essend.`, `Ich esse am essen.`],
      0,
      `Il tedesco non ha la forma progressiva; si usa il presente con gerade. Essend esiste come participio ma non forma il progressivo.`,
    ),
    q(
      'q7',
      `Come si legge «isst» (mangia)?`,
      [`IST: una sola s sorda e poi st`, `ISST: con doppia s lunga`, `I:ST: con i lunga`, `IS-sët: in due sillabe`],
      0,
      `Du isst e er isst sono forme brevi, con i breve e una s sorda. La doppia ss scompare perché la desinenza -st si fonde con la s della radice.`,
    ),
    q(
      'q8',
      `Come si legge «fährst» (guidi)?`,
      [`FÈ:RST: ä lunga, come e aperta`, `FA:RST: come a lunga`, `FÉ:RST: come e chiusa lunga`, `FERST: ä breve`],
      0,
      `L'umlaut ä è una e aperta, qui lunga. Leggerla come a cambia la parola e si perde la differenza con fahren.`,
    ),
    q(
      'q9',
      `Qual è la forma di du di «lesen»?`,
      [`du liest`, `du lest`, `du list`, `du lieset`],
      0,
      `Lesen ha e > ie per du e er; in du liest la radice finisce in s, quindi il -st si fonde con essa. Lest e list non sono forme del verbo.`,
    ),
  ],
  [
    card('c1', `Desinenze regolari`, `-e, -st, -t, -en, -t, -en. machen: mache, machst, macht, machen, macht, machen.`),
    card(
      'c2',
      `-est / -et (e epentetica)`,
      `Se la radice finisce in -t, -d, -chn, -ffn, -tm, -dn: du arbeitest, er findet, es regnet.`,
    ),
    card('c3', `du heißt, du tanzt, du reist`, `Radice in -s, -ß, -z, -x: la forma di du prende solo -t.`),
    card('c4', `a > ä`, `fahren: du fährst, er fährt. Così schlafen, laufen, tragen, waschen, halten, fallen, lassen.`),
    card(
      'c5',
      `e > i`,
      `sprechen: du sprichst; essen: du isst; geben: du gibst; helfen: du hilfst; nehmen: du nimmst.`,
    ),
    card('c6', `e > ie`, `lesen: du liest; sehen: du siehst; empfehlen: du empfiehlst.`),
    card(
      'c7',
      `wissen: weiß, weißt, weiß`,
      `ich weiß, du weißt, er weiß, wir wissen, ihr wisst, sie wissen. Fatto/informazione.`,
    ),
    card('c8', `kennen`, `Conoscere persone, luoghi, cose: Ich kenne Berlin. Kennst du Maria?`),
    card('c9', `können (capacità)`, `Saper fare: Ich kann schwimmen. Ich kann Deutsch = so il tedesco.`),
    card('c10', `Ordine V2`, `Il verbo coniugato è in seconda posizione. Morgen fahre ich (non: Morgen ich fahre).`),
    card('c11', `Ich esse gerade.`, `Sto mangiando adesso. Nessuna forma progressiva; si usa il presente con gerade.`),
    card(
      'c12',
      `fährst [FÈ:RST], isst [IST], liest [LI:ST]`,
      `ä lunga e aperta; isst breve con una sola s; liest con ie = i lunga.`,
    ),
  ],
  [
    prac(
      'p1',
      `Coniuga al presente (ich, du, er): schlafen, nehmen, arbeiten, tanzen.`,
      `ich schlafe, du schläfst, er schläft; ich nehme, du nimmst, er nimmt; ich arbeite, du arbeitest, er arbeitet; ich tanze, du tanzt, er tanzt. Nota: nehmen cambia anche la consonante (nimmst); tanzen ha du -t.`,
    ),
    prac(
      'p2',
      `Traduci: «Domani vado a Berlino e parlo con un amico.»`,
      `Morgen fahre ich nach Berlin und spreche mit einem Freund. Nota: Morgen in prima posizione, inversione del soggetto; mit + dativo einem Freund.`,
    ),
    prac(
      'p3',
      `Correggi: «Heute ich lese ein Buch. Ich kenne, dass er kommt. Ich bin essend.»`,
      `Heute lese ich ein Buch. Ich weiß, dass er kommt. Ich esse gerade. Nota: V2 dopo Heute; wissen per un fatto; presente con gerade.`,
    ),
    prac(
      'p4',
      `Scegli wissen / kennen / können: «___ du, wo Anna wohnt? Ich ___ sie nicht. Sie ___ gut Deutsch.»`,
      `Weißt du, wo Anna wohnt? Ich kenne sie nicht. Sie kann gut Deutsch. Nota: informazione = wissen; persona = kennen; capacità = können.`,
    ),
    prac(
      'p5',
      `Scrivi 4 frasi sulla tua giornata iniziando ogni frase con un elemento diverso (Heute, Am Morgen, Dann, Abends).`,
      `Heute stehe ich um sieben auf. Am Morgen trinke ich Kaffee. Dann fahre ich zur Arbeit. Abends lese ich ein Buch. Nota: verbo sempre in seconda posizione, soggetto dopo il verbo.`,
    ),
  ],
)

export const deQuotidiano = mod(
  'de-quotidiano',
  'Verbi separabili, negazione, domande e modali',
  'Aufstehen vs verstehen, nicht e kein, W-Fragen, können müssen wollen dürfen sollen mögen möchten, la routine',
  'a1',
  `${PRON_SHORT}
<p class="lead">Quattro strumenti per la vita quotidiana: i verbi con prefisso (separabili e no), la negazione, le domande e i verbi modali. Con questi parli di abitudini, permessi e obblighi.</p>
<h3>Verbi separabili e inseparabili</h3>
<p>Il prefisso dei verbi <b>separabili</b> è accentato e, al presente, va alla <b>fine</b> della frase: <i>aufstehen</i> [AUF-shté:-ën] → <i>Ich stehe um sieben Uhr auf</i>. Con un modale resta unito all'infinito: <i>Ich muss früh aufstehen</i>. Nelle subordinate si ricongiunge: <i>weil ich früh aufstehe</i>.</p>
<table><tr><th>Verbo</th><th>Esempio</th></tr>
<tr><td>aufstehen [AUF-shté:-ën]</td><td>Ich stehe um sieben auf.</td></tr>
<tr><td>ankommen [AN-ko-mën]</td><td>Der Zug kommt um acht an.</td></tr>
<tr><td>einkaufen [AIN-kau-fën]</td><td>Wir kaufen am Samstag ein.</td></tr>
<tr><td>anrufen [AN-ru:-fën]</td><td>Ich rufe dich morgen an.</td></tr>
<tr><td>mitkommen [MIT-ko-mën]</td><td>Kommst du mit?</td></tr>
<tr><td>fernsehen [FERN-zé:-ën]</td><td>Er sieht abends fern.</td></tr></table>
<p>I prefissi <b>inseparabili</b> non sono accentati e non si staccano: <b>be-, emp-, ent-, er-, ge-, miss-, ver-, zer-</b>: <i>bekommen</i> [bë-KO-mën] (ricevere!), <i>verstehen</i> [fer-SHTÉ:-ën], <i>besuchen</i> [bë-ZU:-chën], <i>erklären</i> [er-KLÈ:-rën], <i>vergessen</i>, <i>gefallen</i>. <i>Ich verstehe dich</i>, non «Ich stehe dich ver». Trappola: <b>bekommen</b> significa ricevere, non «diventare» (si dice <i>werden</i>). I prefissi <i>durch-, über-, um-, unter-, wieder-</i> possono essere separabili o inseparabili a seconda del significato (umFAHren / UMfahren).</p>
<h3>Negazione: nicht e kein</h3>
<ul><li><b>kein</b> nega un nome con ein- o senza articolo: <i>Ich habe kein Auto. Ich trinke keinen Kaffee. Wir haben keine Zeit.</i></li><li><b>nicht</b> nega verbi, aggettivi, avverbi, e nomi con l'articolo determinativo o un possessivo: <i>Ich komme nicht. Das Auto ist nicht neu. Ich kenne den Mann nicht.</i></li></ul>
<p>Posizione di <b>nicht</b>: alla fine se nega tutta la frase (<i>Ich kaufe das Buch nicht</i>), prima dell'elemento negato (<i>Ich bin nicht müde</i>), prima del prefisso separabile e dell'infinito (<i>Ich stehe nicht auf. Ich kann nicht kommen.</i>). Altre negazioni: <b>nie</b> [NI:] (mai), <b>nichts</b> [NIÇTS], <b>niemand</b> [NI:-mant], <b>nicht mehr</b> (non più), <b>noch nicht</b> (non ancora). <b>Il tedesco non raddoppia la negazione</b>: «non ho visto niente» = <i>Ich habe nichts gesehen</i> (mai «nicht nichts»). Per rispondere a una domanda negativa: <i>Hast du keinen Hunger? – Doch!</i> (sì, ce l'ho). Risposte: <b>ja</b> [IA:], <b>nein</b> [NAIN], <b>doch</b> [DOCH].</p>
<h3>Domande</h3>
<p><b>Sì/no</b>: il verbo va al primo posto: <i>Wohnst du in Berlin?</i> <i>Kommst du mit?</i> <b>Parole interrogative</b> (W-Fragen) in prima posizione, poi il verbo: <i>Wo wohnst du?</i></p>
${vsec('Parole interrogative', [
  ['wer, was', 'VÉ:R, VAS', 'chi, che cosa'],
  ['wo, wohin, woher', 'VO:, vo-HIN, vo-HÉ:R', 'dove, verso dove, da dove'],
  ['wann, warum, wie', 'VAN, va-RUM, VI:', 'quando, perché, come'],
  ['wie viel, wie viele', 'VI: FI:L, VI: FI:-lë', 'quanto, quanti'],
])}
<p>Esempi: <i>Wo wohnst du? Woher kommst du? Wann stehst du auf? Was machst du heute? Warum lernst du Deutsch?</i> Non confondere <b>wo</b> (dove) con <b>wer</b> (chi). Frasi utili in classe: <i>Wie bitte?</i> (prego?), <i>Wie heißt das auf Deutsch?</i>, <i>Was bedeutet ...?</i>, <i>Können Sie das wiederholen?</i></p>
<h3>I verbi modali</h3>
<table><tr><th>Persona</th><th>können</th><th>müssen</th><th>wollen</th></tr>
<tr><td>ich / er</td><td>kann [KAN]</td><td>muss [MUS]</td><td>will [VIL]</td></tr>
<tr><td>du</td><td>kannst</td><td>musst</td><td>willst</td></tr>
<tr><td>wir / sie</td><td>können [KÖ-nën]</td><td>müssen [MÜ-ssën]</td><td>wollen [VO-lën]</td></tr>
<tr><td>ihr</td><td>könnt</td><td>müsst</td><td>wollt</td></tr></table>
<table><tr><th>Persona</th><th>dürfen</th><th>sollen</th><th>mögen</th><th>möchten</th></tr>
<tr><td>ich / er</td><td>darf [DARF]</td><td>soll [ZOL]</td><td>mag [MA:K]</td><td>möchte [MÖÇ-të]</td></tr>
<tr><td>du</td><td>darfst</td><td>sollst</td><td>magst</td><td>möchtest</td></tr>
<tr><td>wir / sie</td><td>dürfen</td><td>sollen</td><td>mögen [MÖ:-gën]</td><td>möchten</td></tr></table>
<p>Ich ed er/sie/es sono uguali e senza desinenza. Uso: <b>können</b> = capacità, possibilità; <b>müssen</b> = necessità; <b>wollen</b> = intenzione (diretto, quasi brusco); <b>dürfen</b> = permesso; <b>sollen</b> = dovere imposto da altri o morale; <b>mögen</b> = piacere (<i>Ich mag Kaffee</i>); <b>möchten</b> = desiderio cortese (<i>Ich möchte einen Kaffee</i>). Trappola: <b>nicht müssen</b> = non essere obbligato (<i>Du musst nicht kommen</i>); il divieto è <b>nicht dürfen</b> (<i>Du darfst nicht kommen</i>). Struttura: modale in seconda posizione, infinito in fondo: <i>Ich kann gut kochen. Er muss heute arbeiten. Wir wollen nach Italien fahren.</i> Il verbo di movimento può cadere: <i>Ich muss nach Hause.</i></p>
<h3>La routine</h3>
<p><i>Ich stehe um sieben Uhr auf, dusche [DU-shë] und frühstücke [FRÜ:-shtü-kë]. Um acht fahre ich zur Arbeit. Mittags esse ich in der Kantine. Abends sehe ich fern und gehe um elf Uhr schlafen.</i></p>
<div class="say"><b>Cosa dire.</b> «Ich muss früh aufstehen, aber ich möchte lieber schlafen. Kannst du mich um sieben anrufen?»</div>`,
  [
    q(
      'q1',
      `Quale frase è corretta?`,
      [
        `Ich stehe um sieben Uhr auf.`,
        `Ich aufstehe um sieben Uhr.`,
        `Ich stehe auf um sieben Uhr.`,
        `Ich stehe um sieben Uhr an.`,
      ],
      0,
      `Il prefisso separabile va alla fine della frase principale. Ich aufstehe lascia il verbo intero, come in italiano; an cambia il significato.`,
    ),
    q(
      'q2',
      `Completa: «Ich trinke ___ Kaffee.» (negativo)`,
      [`keinen`, `nicht`, `kein`, `nichts`],
      0,
      `Kaffee è maschile e senza articolo, quindi keinen all'accusativo. Kein è la forma del nominativo o del neutro, e nicht non nega un nome senza articolo.`,
    ),
    q(
      'q3',
      `Che cosa significa «Du musst nicht kommen»?`,
      [`Non sei obbligato a venire`, `Non ti è permesso di venire`, `Non puoi venire`, `Non vuoi venire`],
      0,
      `Nicht müssen nega l'obbligo, non il permesso. Il divieto si esprime con nicht dürfen: Du darfst nicht kommen.`,
    ),
    q(
      'q4',
      `Qual è l'ordine corretto per «Dove abiti?»`,
      [`Wo wohnst du?`, `Wo du wohnst?`, `Wohnst wo du?`, `Du wohnst wo?`],
      0,
      `Dopo la parola interrogativa viene il verbo e poi il soggetto. Wo du wohnst è il verbo finale di una subordinata.`,
    ),
    q(
      'q5',
      `Rispondi a «Hast du keinen Hunger?» se hai fame:`,
      [`Doch, ich habe Hunger.`, `Nein, ich habe Hunger.`, `Ja, ich habe keinen.`, `Nicht, ich habe Hunger.`],
      0,
      `Doch contraddice una domanda negativa. Nein, ich habe Hunger si capisce male, e ja confermerebbe la negazione.`,
    ),
    q(
      'q6',
      `Come dici «Non ho visto niente»?`,
      [
        `Ich habe nichts gesehen.`,
        `Ich habe nicht nichts gesehen.`,
        `Ich nicht habe nichts gesehen.`,
        `Ich habe nicht gesehen nichts.`,
      ],
      0,
      `Il tedesco non raddoppia la negazione, a differenza dell'italiano. Nicht nichts, se esistesse, direbbe il contrario.`,
    ),
    q(
      'q7',
      `Quale frase con modale è corretta?`,
      [`Ich kann gut kochen.`, `Ich kann kochen gut.`, `Ich kochen kann gut.`, `Ich kann gut kocht.`],
      0,
      `Il modale è in seconda posizione e l'infinito alla fine. Ich kochen kann è l'ordine delle subordinate, e kocht è una forma coniugata.`,
    ),
    q(
      'q8',
      `Quale verbo NON è separabile?`,
      [`bekommen`, `aufstehen`, `einkaufen`, `mitkommen`],
      0,
      `Il prefisso be- è inseparabile e non è accentato. Auf-, ein- e mit- sono prefissi separabili e accentati.`,
    ),
    q(
      'q9',
      `Come si legge «möchte» (vorrei)?`,
      [`MÖÇ-të: ö breve, ch debole`, `MÖCH-të: ch raschiata`, `MÖ:-kë-të: come in italiano`, `MEK-të: ö come e`],
      0,
      `Dopo ö si dice ç, il suono debole. La ch raschiata è per a, o, u e au.`,
    ),
    q(
      'q10',
      `Come si legge «können» (potere)?`,
      [`KÖ-nën: ö breve e n semplice`, `KÖN-nën: con n doppia`, `KÖ:-nën: con ö lunga`, `KE-nën: con e normale`],
      0,
      `La doppia n rende breve la ö, ma non raddoppia il suono. Kennen è un altro verbo (conoscere).`,
    ),
  ],
  [
    card(
      'c1',
      `aufstehen → ich stehe ... auf`,
      `Verbo separabile: prefisso accentato alla fine. Con modale resta unito: Ich muss aufstehen.`,
    ),
    card(
      'c2',
      `be-, emp-, ent-, er-, ge-, miss-, ver-, zer-`,
      `Prefissi inseparabili, non accentati. verstehen, bekommen, besuchen.`,
    ),
    card('c3', `bekommen`, `Ricevere, non diventare. Diventare = werden.`),
    card(
      'c4',
      `kein vs nicht`,
      `kein nega un nome con ein- o senza articolo. nicht nega verbi, aggettivi, nomi con articolo determinativo.`,
    ),
    card('c5', `Doppia negazione`, `Il tedesco non raddoppia: Ich habe nichts gesehen. Non: nicht nichts.`),
    card('c6', `ja / nein / doch`, `Doch contraddice una domanda o frase negativa: Hast du keinen Hunger? – Doch!`),
    card('c7', `W-Fragen`, `wer, was, wo, wohin, woher, wann, warum, wie. Verbo in seconda posizione: Wo wohnst du?`),
    card('c8', `Domanda sì/no`, `Verbo al primo posto: Wohnst du in Berlin? Kommst du mit?`),
    card(
      'c9',
      `können / müssen / wollen`,
      `ich kann / muss / will. Capacità / necessità / intenzione. Ich e er senza desinenza.`,
    ),
    card(
      'c10',
      `dürfen / sollen / mögen / möchten`,
      `Permesso / dovere altrui / piacere / desiderio cortese: ich darf, soll, mag, möchte.`,
    ),
    card(
      'c11',
      `nicht müssen ≠ nicht dürfen`,
      `Du musst nicht kommen: non sei obbligato. Du darfst nicht kommen: non puoi (divieto).`,
    ),
    card(
      'c12',
      `möchte [MÖÇ-të], können [KÖ-nën]`,
      `Dopo ö: ç debole (möchte); doppia n = ö breve ma non n doppia (können).`,
    ),
  ],
  [
    prac(
      'p1',
      `Traduci: «Mi alzo alle sette, faccio colazione e poi vado al lavoro.»`,
      `Ich stehe um sieben Uhr auf, frühstücke und fahre dann zur Arbeit (oppure: gehe zur Arbeit). Nota: aufstehen separabile; frühstücken regolare.`,
    ),
    prac(
      'p2',
      `Rendi negative: «Ich habe ein Auto. Ich bin müde. Ich kenne den Lehrer.»`,
      `Ich habe kein Auto. Ich bin nicht müde. Ich kenne den Lehrer nicht. Nota: kein con ein-; nicht con aggettivo e con articolo determinativo.`,
    ),
    prac(
      'p3',
      `Traduci: «Non devo lavorare domani, ma non posso uscire.»`,
      `Ich muss morgen nicht arbeiten, aber ich darf nicht ausgehen (oppure: ich kann nicht ausgehen). Nota: nicht müssen = non obbligato; il divieto con nicht dürfen.`,
    ),
    prac(
      'p4',
      `Fai 5 domande a un compagno di corso usando 5 parole interrogative diverse.`,
      `Woher kommst du? Wo wohnst du? Wann stehst du auf? Was machst du am Wochenende? Warum lernst du Deutsch? Nota: verbo sempre in seconda posizione.`,
    ),
    prac(
      'p5',
      `Correggi: «Ich aufstehe um sieben. Ich nicht habe Zeit. Möchtest du ein Kaffee?»`,
      `Ich stehe um sieben auf. Ich habe keine Zeit. Möchtest du einen Kaffee? Nota: separabile; kein per Zeit; Kaffee maschile all'accusativo.`,
    ),
  ],
)
