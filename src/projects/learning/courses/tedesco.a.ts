import { card, mod, prac, q } from './python-path.helpers'
import { PRON_FULL, PRON_SHORT, vsec } from './tedesco.pron'
import { deNomi, dePresente, deQuotidiano } from './tedesco.a.2'
import { deCasi, dePerfekt, dePraeteritum } from './tedesco.a.3'
import { deFuturo, deImperativo, deRiflessivi, deNebensaetze1 } from './tedesco.a.4'

// German course, groups A1 and A2 (13 modules), for an Italian speaker. Standard German (Germany), AT/CH variants noted.
// Pronunciation: Italian-based respelling in [ ], legend = tedesco.pron.ts (PRON_FULL / PRON_SHORT).
// Conventions used on top of the legend (explained in de-pron): long vowel = ":" after it; stressed e: "É:" long closed,
// "E" short (open); a-umlaut: "È:" long, "E" short; final unstressed -er = "a"; "ng" is written "n" (velar n, no g);
// glottal stop and p/t/k aspiration are explained in words but not marked; "tsh" = tsch (sound of Italian "ci").
//
// CLAIMS THE AUTHOR IS NOT FULLY SURE ABOUT (reviewers: please check):
//  1. de-pron: vowel length of a-umlaut and o-umlaut/u-umlaut words in the respellings (Käse, Mädchen, später, nächste long; Städte,
//     Hände, Männer, Äpfel, Länder, Töchter, Mütter short) and stressed short "e/o" given as open (E, O) without distinction.
//  2. de-pron: -ig = [iç] in standard German; "ik" in parts of the south (AT/CH) quoted as a tendency only.
//  3. de-pron: Hamburg/Hannover pronunciation "s-tein" for Stein/spitz (s + t, s + p at word start) is a known regional trait.
//  4. de-pron: "Kaffee" stress KA-fe (DE) vs ka-FÉ: (AT/CH, also drinks in cafes); "Chemie" çe-/ke- split north/south; August stress.
//  5. de-saluti: "Sonnabend" (north-east), "Jänner" (AT, also Southern Germany regional), "Samstag" standard; "Servus" also used in AT/Bavaria.
//  6. de-saluti: "viertel vier" = 3:15 and "dreiviertel vier" = 3:45 (south DE/AT), "Viertel nach drei" elsewhere.
//  7. de-saluti: Billion = 10^12 (not miliardo), Milliarde = 10^9; "zwo" in telephone numbers.
//  8. de-sein: "recht haben / Recht haben" both accepted after the 2006 reform; "Mir ist kalt" given as the standard idiom.
//  9. de-nomi: gender tendencies (-e feminine, -er masculine, -um neuter) are tendencies, exceptions listed only partly;
//     plural of "Euro" (after numbers: zehn Euro) not discussed on purpose; "n-Deklination" list is partial.
// 10. de-presente: du-form of "tanzen" tanzt [TANTST], "reisen" reist, "heißen" heißt; "isst" from essen; "weißt" from wissen.
// 11. de-quotidiano: modal "dürfen" = permission, "nicht dürfen" = prohibition, "nicht müssen" = no obligation; "sollen" = moral duty/reported order.
// 12. de-casi: wo/wohin pairs (hängen strong/weak), "an der Wand hängen" vs "an die Wand hängen"; "nach Hause / zu Hause".
// 13. de-perfekt: southern DE/AT/CH use "sein" with sitzen/stehen/liegen in Perfekt (ich bin gesessen); standard north uses haben.
// 14. de-praeteritum: Präteritum is "almost absent in speech" in CH and in the south except war/hatte/modals (tendency, not a law).
// 15. de-futuro: "werden + wohl" for probability; würde + infinitive avoided with haben/sein/modals (standard recommendation, not an absolute).
// 16. de-imperativo: "Sei still!" vs "Hab Geduld!" (hab' without -e usual in speech; "habe" is correct but rare); "Fahr!" without umlaut.
// 17. de-riflessivi: "gesund -> gesünder / gesunder" both accepted; "am nächsten" for nah; "während" + genitive not taught here.
// 18. de-nebensaetze1: weil + V2 in colloquial speech ("weil ich bin krank") is described as non-standard in writing.

export const dePron = mod(
  'de-pron',
  'Pronuncia e ortografia',
  'Alfabeto, vocali lunghe e brevi, umlaut, ch, sch, z, s, w/v, ie/ei, r, Auslautverhärtung, accento, ß e maiuscole',
  'a1',
  `<p class="lead">Il tedesco si legge molto più regolarmente dell'inglese o del francese: imparate le regole, ogni parola si legge come è scritta. Le trappole per un italiano sono poche ma costanti: <b>h, ch, sch, z, s, w/v, ie/ei, le doppie e la r</b>.</p>
${PRON_FULL}
<p>Altre convenzioni usate in tutto il corso: <b>É:</b> = e chiusa lunga (Lehrer), <b>E</b> = e breve (aperta, come «bello»), <b>È:</b> = ä lunga (Käse), <b>ai</b> = ei, <b>oi</b> = eu/äu, <b>i:</b> = ie, <b>tsh</b> = tsch (come la «c» di «cena»). Il suono di <b>ng</b> (Zeitung) è la «n» di «banca» senza la g: lo scrivo «n».</p>
<h3>1. Vocale lunga o breve, doppia consonante</h3>
<p>Regola: vocale <b>lunga</b> davanti a una sola consonante, a <b>h</b> muta, nelle vocali doppie (aa, ee, oo) e in <b>ie</b>; <b>breve</b> davanti a due o più consonanti. In tedesco la doppia NON raddoppia il suono come in italiano: serve solo a rendere breve la vocale prima (Mitte [MI-të], non «mit-te»). Parole corte con vocale breve anche davanti a una consonante: in, an, mit, bis, was, das, es, ab, um, von.</p>
<div class="tblw"><table><tr><th>Lunga</th><th>Breve</th></tr>
<tr><td>Staat [SHTA:T] stato</td><td>Stadt [SHTAT] città</td></tr>
<tr><td>Beet [BÉ:T] aiuola</td><td>Bett [BET] letto</td></tr>
<tr><td>Miete [MI:-të] affitto</td><td>Mitte [MI-të] centro</td></tr>
<tr><td>Hüte [HÜ:-të] cappelli</td><td>Hütte [HÜ-të] capanna</td></tr>
<tr><td>Ofen [O:-fën] forno</td><td>offen [O-fën] aperto</td></tr>
<tr><td>Wiesen [VI:-zën] prati</td><td>wissen [VI-ssën] sapere</td></tr></table></div>
<h3>2. Umlaut: ä ö ü</h3>
<p><b>ü</b>: di' «i» e, senza muovere la lingua, arrotonda le labbra come per «u» (Tür [TÜ:R], fünf [FÜNF], müde [MÜ:-dë]). <b>ö</b>: di' «e» con le labbra a «o» (schön [SHÖ:N], können [KÖ-nën]). <b>ä</b> = e (lunga e aperta in Käse [KÈ:-zë], breve in Männer [ME-na]). Mai «u» e «e» semplici: cambierebbe la parola. Coppie: schon [SHO:N] già / schön [SHÖ:N] bello; vor [FO:R] davanti / für [FÜ:R] per; Höhle [HÖ:-lë] grotta / Hölle [HÖ-lë] inferno; Bruder [BRU:-da] / Brüder [BRÜ:-da]; Zug [TSU:K] / Züge [TSÜ:-gë]. Senza tastiera: ä = ae, ö = oe, ü = ue (Muenchen), ß = ss.</p>
<h3>3. Dittonghi: ei, eu, au, ie</h3>
<p><b>ei = ai</b> (Eis [AIS], mein [MAIN], Zeit [TSAIT]); <b>eu / äu = oi</b> (Euro [OI-ro], neu [NOI], Häuser [HOI-za]); <b>au = au</b> (Haus [HAUS]); <b>ie = i lunga</b> (Liebe [LI:-bë], Tier [TI:R], Bier [BI:R]). Trappola: l'italiano legge «ei» come in «lei». Coppie: Wein [VAIN] vino / Wien [VI:N] Vienna; Leid [LAIT] dolore / Lied [LI:T] canzone; Heu [HOI] fieno / Hai [HAI] squalo; Mais [MAIS] mais / Maus [MAUS] topo. In parole straniere ie si legge in due parti: Familie [fa-MI:-li-ë], Italien [i-TA:-li-ën].</p>
<h3>4. ch, sch, sp, st, z, s</h3>
<p><b>ch</b>: suono debole <b>ç</b> dopo e, i, ä, ö, ü, ei, eu e dopo l, n, r (ich [IÇ], Milch [MILÇ], durch [DURÇ], Bücher [BÜ:-ça]); raschiato <b>ch</b> dopo a, o, u, au (Bach [BACH], Buch [BU:CH], auch [AUCH]). <b>-chen</b> è sempre ç (Mädchen [MÈ:T-çën]); <b>-ig</b> finale = [iç] (König [KÖ:-niç]; nel sud anche -ik). <b>chs</b> = ks (sechs [ZEKS]). In parole straniere: Chemie [çe-MI:] (sud: ke-), China [ÇI:-na], Chor [KO:R], Chef [SHEF]. L'italiano legge «ch» come k: trappola tipica (Buch ≠ «Buk»). Coppie: ich [IÇ] / ach [ACH]; Kirche [KIR-çë] chiesa / Kirsche [KIR-shë] ciliegia; Buch [BU:CH] / Bücher [BÜ:-ça].</p>
<p><b>sch = sh</b> (Schule [SHU:-lë], Fisch [FISH]); <b>sp- e st- a inizio di parola o di radice = shp-, sht-</b> (Sport [SHPORT], Stein [SHTAIN], Straße [SHTRA:-ssë], verstehen [fer-SHTÉ:-ën]); altrove sp/st sono come in italiano (Wespe [VES-pë], Fest [FEST]). Nel nord (Amburgo, Hannover) a inizio parola si sente s-t, s-p. <b>tsch = tsh</b> (Deutsch [DOITSH], Tschüss [TSHÜS]). Coppie: Stein [SHTAIN] / Schein [SHAIN] luce, banconota; Schuh [SHU:] scarpa / Stuhl [SHTU:L] sedia.</p>
<p><b>z, tz = ts sempre</b> (Zeit [TSAIT], Zimmer [TSI-ma], Katze [KA-tsë], Platz [PLATS]; la z di «zero» sonora non esiste). <b>s</b> prima di vocale è <b>sonora z</b> (Sonne [ZO-në], lesen [LÉ:-zën], Rose [RO:-zë]); a fine parola o prima di consonante è sorda (Haus [HAUS], das [DAS], Wespe). <b>ß e ss</b> = s sorda: ß dopo vocale lunga o dittongo (Straße, Fuß [FU:SS], heiß [HAISS]), ss dopo vocale breve (Fluss [FLUSS], muss [MUS], Wasser [VA-ssa]). In Svizzera non si usa la ß (Strasse); in maiuscolo STRASSE. Coppia: reisen [RAI-zën] viaggiare / reißen [RAI-ssën] strappare; Maße [MA:-ssë] misure / Masse [MA-ssë] massa.</p>
<h3>5. w, v, j, qu, pf, ph, h</h3>
<p><b>w = v</b> italiana (Wasser, Wein); <b>v = f</b> nelle parole tedesche (Vater [FA:-ta], viel [FI:L], von [FON]) e v nelle straniere (Vase [VA:-zë], Klavier [kla-VI:R]). <b>j = i</b> consonantica (Ja [IA:], Jahr [IA:R]). <b>qu = kv</b> (Quelle [KVE-lë]). <b>pf</b>: p e f insieme, senza perdere la p (Pferd [PFÉ:RT], Apfel [AP-fël]); ph = f (Philosophie). <b>h iniziale</b> si dice, soffiata (Haus, Hund [HUNT]); l'italiano la omette: Haus [HAUS] ≠ aus [AUS]; Hund ≠ und [UNT]. Dopo vocale è muta e allunga (sehen [ZÉ:-ën], Zahl [TSA:L]). Le parole che iniziano per vocale hanno un piccolo colpo di glottide (Knacklaut): beobachten [bë-O:-bach-tën] ≠ a una voce sola.</p>
<h3>6. La r e la -er finale</h3>
<p>La <b>r</b> tedesca è gutturale (come una g sfregata in gola, simile alla «ch» di Bach ma sonora): rot [RO:T], Brot [BRO:T]. A fine sillaba si indebolisce quasi a una vocale «a»: wir [VI:R], Tür [TÜ:R]; la <b>-er</b> finale è proprio una «a» (Lehrer [LÉ:-ra], Wasser [VA-ssa], aber [A:-ba]). L'r arrotata italiana si capisce, ma suona straniera.</p>
<h3>7. Auslautverhärtung: b, d, g finali diventano p, t, k</h3>
<p>A fine parola o sillaba <b>b, d, g</b> si pronunciano p, t, k, anche se si scrivono sonore: Tag [TA:K] ma Tage [TA:-gë]; Hund [HUNT] / Hunde [HUN-dë]; Korb [KORP] / Körbe [KÖR-bë]; Land [LANT] / Länder [LEN-da]; gelb [GELP]; Berg [BERK]. Per questo <b>Rad</b> (ruota) e <b>Rat</b> (consiglio) suonano uguali [RA:T], come <b>Bund</b> e <b>bunt</b> [BUNT]. Non aggiungere vocali finali: Hund, non «Hundo».</p>
<h3>8. Accento tonico e parole composte</h3>
<p>Di norma l'accento cade sulla <b>prima sillaba della radice</b> (ARbeit, KINder, FREUNDlich). I prefissi inseparabili (be-, ge-, er-, ver-, zer-, ent-, emp-) non sono accentati: bekommen [bë-KO-mën], verstehen [fer-SHTÉ:-ën]. I prefissi separabili sono accentati: ANkommen [AN-ko-mën]. Coppia: UMfahren [UM-fa:-rën] investire / umFAHren [um-FA:-rën] aggirare. Parole straniere sull'ultima: Student [shtu-DENT], Musik [mu-ZI:K]; Kaffee in Germania [KA-fe], in Austria [ka-FÉ:]. Nelle <b>parole composte</b> l'accento va sul primo elemento, il genere dall'ultimo: Haustür [HAUS-tü:r], Bahnhof [BA:N-ho:f]; ogni parte si legge come da sola (Staubecken, Stau-becken, ≠ Staub-ecken).</p>
<h3>9. Alfabeto e maiuscole</h3>
<p>Nomi delle lettere: A [A:], B [BE:], C [TSE:], D [DE:], E [E:], F [EF], G [GE:], H [HA:], I [I:], J [IOT], K [KA:], L [EL], M [EM], N [EN], O [O:], P [PE:], Q [KU:], R [ER], S [ES], T [TE:], U [U:], V [FAU], W [VE:], X [IKS], Y [ÜP-si-lon], Z [TSET]; più Ä, Ö, Ü, ß [ES-TSET]. Spiegare un nome: «Wie schreibt man das?» [VI: SHRAIPT man DAS]. <b>Tutti i sostantivi hanno la maiuscola</b> (das Haus, die Liebe, der Montag), come i verbi e gli aggettivi sostantivati (das Essen, das Gute), Sie / Ihr / Ihnen di cortesia e la lingua (Ich lerne Deutsch). Minuscole: ich, gli aggettivi (deutsche Küche, italienisch), i verbi (essen), gli avverbi di tempo (montags, abends).</p>
<div class="say"><b>Cosa dire.</b> «Ich heiße Marco [IÇ HAI-ssë MAR-ko]. Wie schreibt man das? [VI: SHRAIPT man DAS] M-A-R-C-O.»</div>`,
  [
    q(
      'q1',
      `Come si legge «Mitte» (centro)?`,
      [
        `MI-të: i breve e t semplice`,
        `MIT-të: i breve e t doppia`,
        `MI:-të: i lunga per la doppia t`,
        `MI:T-të: i lunga e t rafforzata`,
      ],
      0,
      `La doppia consonante rende breve la vocale prima, ma non raddoppia il suono come in italiano. La tentazione di dire MIT-të viene proprio dalle doppie italiane.`,
    ),
    q(
      'q2',
      `Come si produce la ü di «Tür» (porta)?`,
      [
        `Dire i con le labbra tonde, come per u`,
        `Dire u con le labbra tirate, come per i`,
        `Dire una u italiana appena più chiusa`,
        `Dire e con le labbra tonde, come per o`,
      ],
      0,
      `La ü ha la lingua della i e le labbra della u. Leggerla come una u italiana trasforma Tür in Tour e perde la differenza con vor/für; l'ultima opzione descrive la ö.`,
    ),
    q(
      'q3',
      `In quale parola «ch» è il suono debole [ç]?`,
      [`ich [IÇ]`, `ach [ACH]`, `Buch [BU:CH]`, `auch [AUCH]`],
      0,
      `Dopo i, e, ä, ö, ü, ei, eu e dopo l/n/r si dice ç. Dopo a, o, u e au la ch è raschiata: la tentazione è usare lo stesso suono ovunque.`,
    ),
    q(
      'q4',
      `Come si legge «Stein» (pietra) a inizio parola?`,
      [
        `SHTAIN: st diventa sht`,
        `STAIN: come in «stella»`,
        `SKAIN: come «sc» di «scuola»`,
        `SHSTAIN: sh seguito da st`,
      ],
      0,
      `A inizio di parola o di radice st e sp diventano sht e shp. Leggere STAIN come in italiano è l'errore più comune e fa sembrare la parola straniera.`,
    ),
    q(
      'q5',
      `Come inizia «Zeit» (tempo)?`,
      [
        `ts: TSAIT, come la z di «pizza»`,
        `dz: DZAIT, come la z di «zero»`,
        `z sonora: ZAIT, come «rosa»`,
        `sh: SHAIT, come «scena»`,
      ],
      0,
      `La z tedesca è sempre ts, sorda. La z sonora di «zero» non esiste e la s di «rosa» si scrive s: per questo Zeit non inizia con il suono di «zero».`,
    ),
    q(
      'q6',
      `Quale coppia si distingue solo per s sonora e s sorda?`,
      [
        `reisen [RAI-zën] / reißen [RAI-ssën]`,
        `Wein [VAIN] / Wien [VI:N]`,
        `Staat [SHTA:T] / Stadt [SHTAT]`,
        `ich [IÇ] / ach [ACH]`,
      ],
      0,
      `In reisen la s tra vocali è sonora, in reißen la ß è sorda. Le altre coppie differiscono per dittongo, lunghezza della vocale o suono ch, non per la s.`,
    ),
    q(
      'q7',
      `Come si legge «Vater» (padre)?`,
      [
        `FA:-ta: v = f e -er finale = a`,
        `VA:-ter: v = v e -er come in italiano`,
        `VA:-ta: v = v e -er finale = a`,
        `FA:-ter: v = f e -er come in italiano`,
      ],
      0,
      `La v tedesca nelle parole native è f, la -er finale è una a. Il nome tradisce la lettura italiana VA:-ter, che sbaglia sia la consonante sia la finale.`,
    ),
    q(
      'q8',
      `Quale lettura distingue Wien (Vienna) da Wein (vino)?`,
      [`Wien [VI:N], Wein [VAIN]`, `Wien [VAIN], Wein [VI:N]`, `Wien [VIEN], Wein [VEIN]`, `Wien [VI:N], Wein [VEIN]`],
      0,
      `ie è una i lunga, ei è il dittongo ai. Scambiare le due letture è facile perché in italiano si legge l'ordine delle lettere, ma in tedesco vale la seconda vocale di ie.`,
    ),
    q(
      'q9',
      `Come si legge «Haus» (casa)?`,
      [
        `HAUS: con una h soffiata`,
        `AUS: la h è muta come in «ho»`,
        `CHAUS: con ch gutturale`,
        `HAUS: ma con la s sonora`,
      ],
      0,
      `La h a inizio di parola si pronuncia, piano ma si sente. Omettendola, come in italiano, Haus diventa aus (da, fuori) e Hund diventa und.`,
    ),
    q(
      'q10',
      `Come si dice «Hund» (cane)?`,
      [
        `HUNT: la d finale suona t`,
        `HUND: la d finale resta sonora`,
        `HUN-do: con una vocale finale`,
        `HUN: la d finale non si dice`,
      ],
      0,
      `Le b, d, g finali si induriscono in p, t, k (Auslautverhärtung). L'opzione sonora è la tentazione di chi legge la grafia, ma nel plurale Hunde la d torna sonora.`,
    ),
    q(
      'q11',
      `Dove cade l'accento in «verstehen» (capire)?`,
      [
        `ver-SHTÉ:-ën: ver- non è accentato`,
        `FER-shte:-ën: sempre sulla prima sillaba`,
        `fer-shte-HEN: sull'ultima sillaba`,
        `FER-SHTÉ:-ën: uguale su ogni sillaba`,
      ],
      0,
      `I prefissi inseparabili (be-, ge-, er-, ver-, zer-, ent-) non portano l'accento, che va sulla radice. Quello sulla prima sillaba vale per le parole senza prefisso.`,
    ),
    q(
      'q12',
      `Quale frase è scritta correttamente?`,
      [
        `Ich lerne Deutsch und esse gern Käse.`,
        `ich lerne deutsch und esse gern käse.`,
        `Ich lerne deutsch und esse gern Käse.`,
        `Ich lerne Deutsch und esse gern käse.`,
      ],
      0,
      `Maiuscola a inizio frase, per Deutsch (la lingua) e per ogni sostantivo come Käse. Il pronome ich resta minuscolo solo dentro la frase: all'inizio ha la maiuscola.`,
    ),
    q(
      'q13',
      `Quale grafia è corretta in Germania?`,
      [
        `Straße [SHTRA:-ssë]: ß dopo vocale lunga`,
        `Strasse [SHTRA:-ssë]: sempre con ss`,
        `Straße [SHTRAS-së]: ß dopo vocale breve`,
        `Strase [SHTRA:-zë]: con una sola s`,
      ],
      0,
      `La ß segue una vocale lunga o un dittongo, e la s singola tra vocali sarebbe sonora. Strasse è la grafia svizzera, non quella usata in Germania e Austria.`,
    ),
  ],
  [
    card(
      'c1',
      `ch dopo e, i, ä, ö, ü, ei, eu, l, n, r`,
      `Suono debole [ç]: ich [IÇ], Milch [MILÇ], durch [DURÇ]. Come una i sussurrata con la lingua alta.`,
    ),
    card(
      'c2',
      `ch dopo a, o, u, au`,
      `Suono raschiato [ch]: Bach [BACH], Buch [BU:CH], auch [AUCH]. Non è mai k come in italiano.`,
    ),
    card(
      'c3',
      `sch, sp-, st- a inizio parola`,
      `sch = sh (Schule [SHU:-lë]); sp- = shp- (Sport [SHPORT]); st- = sht- (Stein [SHTAIN]). Altrove sp/st come in italiano (Fest [FEST]).`,
    ),
    card('c4', `z e tz`, `Sempre ts sorda: Zeit [TSAIT], Katze [KA-tsë], Platz [PLATS]. Non è la z sonora di «zero».`),
    card(
      'c5',
      `s prima di vocale, s finale, ß e ss`,
      `Prima di vocale z sonora (Sonne [ZO-në]); finale o prima di consonante sorda (Haus). ß dopo vocale lunga o dittongo, ss dopo vocale breve (Fluss).`,
    ),
    card(
      'c6',
      `w e v`,
      `w = v italiana (Wasser [VA-ssa]). v = f nelle parole native (Vater [FA:-ta], viel [FI:L]); v nelle straniere (Vase [VA:-zë]).`,
    ),
    card(
      'c7',
      `ei, eu/äu, au, ie`,
      `ei = ai (Eis [AIS]); eu/äu = oi (neu [NOI]); au = au; ie = i lunga (Bier [BI:R]). Wein [VAIN] ≠ Wien [VI:N].`,
    ),
    card(
      'c8',
      `h iniziale e h dopo vocale`,
      `Iniziale si soffia: Haus [HAUS]. Dopo vocale è muta e allunga: sehen [ZÉ:-ën]. Senza h, Haus diventa aus.`,
    ),
    card(
      'c9',
      `Auslautverhärtung`,
      `b, d, g finali = p, t, k: Tag [TA:K], Hund [HUNT], gelb [GELP]. Rad e Rat suonano uguali [RA:T].`,
    ),
    card(
      'c10',
      `ü e ö`,
      `ü = i con labbra tonde (Tür [TÜ:R]); ö = e con labbra tonde (schön [SHÖ:N]). Coppia: schon [SHO:N] / schön [SHÖ:N].`,
    ),
    card(
      'c11',
      `Vocale lunga o breve`,
      `Lunga prima di una consonante, h muta, aa/ee/oo, ie; breve prima di 2+ consonanti. La doppia non raddoppia il suono: Mitte [MI-të].`,
    ),
    card(
      'c12',
      `Accento nei verbi con prefisso`,
      `Prefissi inseparabili non accentati: verSTEhen. Prefissi separabili accentati: ANkommen. UMfahren ≠ umFAHren.`,
    ),
    card(
      'c13',
      `La r e la -er finale`,
      `r gutturale (non arrotata); a fine sillaba quasi una a. -er finale = a: Lehrer [LÉ:-ra], Wasser [VA-ssa].`,
    ),
    card(
      'c14',
      `Maiuscole`,
      `Tutti i sostantivi (das Haus, die Liebe), la lingua (Deutsch), Sie/Ihr di cortesia. Minuscole: ich, aggettivi, verbi, montags.`,
    ),
    card(
      'c15',
      `Alfabeto: J, V, W, Y, Z, ß`,
      `J [IOT], V [FAU], W [VE:], Y [ÜP-si-lon], Z [TSET], ß [ES-TSET]. «Wie schreibt man das?» = come si scrive?`,
    ),
  ],
  [
    prac(
      'p1',
      `Scrivi la pronuncia (con le regole del corso) di: Schule, Zeit, Vater, Hund, Bücher.`,
      `Schule [SHU:-lë]; Zeit [TSAIT]; Vater [FA:-ta]; Hund [HUNT]; Bücher [BÜ:-ça]. Nota: sch = sh, z = ts, v = f, d finale = t, ch dopo ü = ç.`,
    ),
    prac(
      'p2',
      `Spiega la differenza di lettura tra Miete e Mitte, Wein e Wien, schon e schön.`,
      `Miete [MI:-të] ha i lunga, Mitte [MI-të] breve. Wein [VAIN] ha il dittongo ai, Wien [VI:N] la i lunga. schon [SHO:N] ha la o, schön [SHÖ:N] la ö (o labbra tonde con la lingua di e). Nota: la differenza cambia il significato.`,
    ),
    prac(
      'p3',
      `Correggi la grafia: «ich lerne deutsch und trinke kaffee mit zucker.»`,
      `Ich lerne Deutsch und trinke Kaffee mit Zucker. Nota: maiuscola a inizio frase e per i sostantivi; Deutsch come lingua ha la maiuscola.`,
    ),
    prac(
      'p4',
      `Scegli ß o ss: Fu__ (piede), Fl__ (fiume), hei__en (chiamarsi), Wa__er (acqua).`,
      `Fuß; Fluss; heißen; Wasser. Nota: ß dopo vocale lunga o dittongo (Fuß, heißen), ss dopo vocale breve (Fluss, Wasser).`,
    ),
    prac(
      'p5',
      `Perché Rad e Rat si pronunciano uguali? Come si distinguono nel plurale?`,
      `Per l'Auslautverhärtung la d finale di Rad suona t, quindi [RA:T] come Rat. Nel plurale Räder [RÈ:-da] la d resta sonora, mentre Räte [RÈ:-të] ha la t. Nota: lo stesso vale per Bund / bunt.`,
    ),
    prac(
      'p6',
      `Compitati: «Mi chiamo Giulia Fabbri, si scrive con due b.» Chiedi come si scrive il nome dell'altro.`,
      `Ich heiße Giulia Fabbri, F-A-B-B-R-I [EF A: BE: BE: ER I:]. Wie schreibt man Ihren Namen? Nota: nell'alfabeto tedesco la lettera ß si dice «Es-Zet» [ES-TSET].`,
    ),
  ],
)

export const deSaluti = mod(
  'de-saluti',
  'Saluti, numeri, date e ora',
  'Saluti, presentarsi, du e Sie, numeri 0-1.000.000, giorni, mesi, data, ora, paesi e nazionalità',
  'a1',
  `${PRON_SHORT}
<p class="lead">Questo modulo ti dà le frasi per le prime conversazioni: salutare, dire chi sei, scegliere tra du e Sie, contare, dire la data e l'ora. Attenzione a due trappole: l'ordine dei numeri (einundzwanzig = uno-e-venti) e <b>halb drei</b>, che significa le due e mezza.</p>
${vsec('Saluti e frasi di cortesia', [
  ['Hallo', 'HA-lo', 'ciao'],
  ['Guten Morgen', 'GU:-tën MOR-gën', 'buongiorno (mattina)'],
  ['Guten Tag', 'GU:-tën TA:K', 'buongiorno, buon pomeriggio'],
  ['Guten Abend', 'GU:-tën A:-bënt', 'buonasera'],
  ['Gute Nacht', 'GU:-të NACHT', 'buonanotte'],
  ['Tschüss', 'TSHÜS', 'ciao (arrivederci)'],
  ['Auf Wiedersehen', 'AUF VI:-da-ze:-ën', 'arrivederci'],
  ['Bis bald', 'BIS BALT', 'a presto'],
  ['Wie geht’s?', 'VI: GÉ:TS', 'come va?'],
  ['Danke / Bitte', 'DAN-kë / BI-të', 'grazie / prego, per favore'],
  ['Entschuldigung', 'ent-SHUL-di-gun', 'scusi, permesso'],
  ['Es tut mir leid', 'ES TU:T MI:R LAIT', 'mi dispiace'],
])}
<p>Varianti regionali: Sud Germania e Austria <b>Grüß Gott</b> [GRÜ:SS GOT] e <b>Servus</b> [ZER-vus] (ciao, sia per salutare sia per congedarsi); nord <b>Moin</b> [MOIN]; Svizzera <b>Grüezi</b> [GRÜ-e-tsi] e <b>Merci</b>. Standard: Guten Tag / Tschüss.</p>
<h3>Presentarsi: du o Sie</h3>
<ul><li><b>Ich heiße Marco.</b> [IÇ HAI-ssë MAR-ko] Mi chiamo Marco. (non «Ich bin heiße»)</li><li><b>Ich komme aus Italien.</b> [IÇ KO-më AUS i-TA:-li-ën] Vengo dall'Italia.</li><li><b>Ich wohne in Berlin.</b> [IÇ VO:-në IN ber-LIN] Abito a Berlino.</li><li><b>Ich bin 30 Jahre alt.</b> [IÇ BIN DRAI-ssiç IA:-rë ALT] Ho 30 anni (si dice «sono»).</li><li><b>Ich spreche Italienisch.</b> [IÇ SHPRE-çë i-ta-LIÉ:-nish] Parlo italiano.</li><li><b>Freut mich!</b> [FROIT MIÇ] Piacere!</li></ul>
<p><b>du</b> con amici, famiglia, bambini, colleghi giovani, coetanei; <b>Sie</b> (scritto sempre con la S maiuscola) con sconosciuti, clienti, superiori, persone anziane. Con <b>Sie</b> il verbo è alla terza persona plurale e si aggiunge Herr o Frau con il cognome: <i>Wie heißen Sie?</i> [VI: HAI-ssën ZI:], <i>Guten Tag, Frau Weber.</i> [FRAU VÉ:-ba]. Proporre il du: «Wollen wir uns duzen?» [VO-lën VI:R UNS DU:-tsën]. In Svizzera il du è più diffuso. Il «Lei» italiano corrisponde a Sie, ma Sie vuole il verbo plurale (<i>Sie sind</i>, mai «Sie ist»).</p>
${vsec('Numeri', [
  ['null, eins, zwei, drei', 'NUL, AINS, TSVAI, DRAI', '0, 1, 2, 3'],
  ['vier, fünf, sechs, sieben', 'FI:R, FÜNF, ZEKS, ZI:-bën', '4, 5, 6, 7'],
  ['acht, neun, zehn, elf, zwölf', 'ACHT, NOIN, TSÉ:N, ELF, TSVÖLF', '8, 9, 10, 11, 12'],
  ['dreizehn, vierzehn, sechzehn, siebzehn', 'DRAI-tsé:n, FIR-tsé:n, ZEÇ-tsé:n, ZI:P-tsé:n', '13, 14, 16, 17'],
  ['zwanzig, dreißig, vierzig, fünfzig', 'TSVAN-tsiç, DRAI-ssiç, FIR-tsiç, FÜNF-tsiç', '20, 30, 40, 50'],
  ['sechzig, siebzig, achtzig, neunzig', 'ZEÇ-tsiç, ZI:P-tsiç, ACH-tsiç, NOIN-tsiç', '60, 70, 80, 90'],
  ['hundert, tausend', 'HUN-dert, TAU-zënt', '100, 1.000'],
  ['eine Million', 'AI-në mi-LIO:N', 'un milione'],
])}
<p><b>Unità prima delle decine</b>: 21 <i>einundzwanzig</i> [AIN-unt-tsvan-tsiç], 54 <i>vierundfünfzig</i>, 99 <i>neunundneunzig</i>. Una sola parola, anche per 1.234 = <i>eintausendzweihundertvierunddreißig</i>. Anni: 1998 <i>neunzehnhundertachtundneunzig</i>, 2026 <i>zweitausendsechsundzwanzig</i>. Al telefono 2 si dice spesso <b>zwo</b> [TSVO:] per non confonderlo con drei. Trappole: sechzehn / siebzehn perdono lettere; <b>Billion</b> = mille miliardi (10^12), il miliardo è <b>Milliarde</b>. Punto per le migliaia (1.000), virgola per i decimali (3,5 = drei Komma fünf).</p>
<h3>Giorni, mesi, data</h3>
<p>Giorni (tutti maschili): <b>Montag</b> [MO:N-ta:k], <b>Dienstag</b> [DI:NS-ta:k], <b>Mittwoch</b> [MIT-voch], <b>Donnerstag</b> [DO-nas-ta:k], <b>Freitag</b> [FRAI-ta:k], <b>Samstag</b> [ZAMS-ta:k] (nord-est anche <i>Sonnabend</i> [ZON-a:-bënt]), <b>Sonntag</b> [ZON-ta:k]. <i>am Montag</i> = lunedì; <i>montags</i> [MO:N-ta:ks] = ogni lunedì. Mesi (maschili): Januar [IA-nu-ar] (Austria: Jänner), Februar [FÉ:-bru-ar], März [MERTS], April [a-PRIL], Mai [MAI], Juni [IU:-ni], Juli [IU:-li], August [au-GUST], September [zep-TEM-ba], Oktober [ok-TO:-ba], November [no-VEM-ba], Dezember [de-TSEM-ba]. <i>im Mai</i> = a maggio.</p>
<p>Data: <b>Der Wievielte ist heute?</b> [DÉ:R VI:-fi:l-të IST HOI-të] — <b>Heute ist der sechste November.</b> Gli ordinali si formano con <b>-te</b> fino a 19 (erste, zweite, dritte, vierte, siebte, achte), con <b>-ste</b> da 20. Si scrive <i>6. November</i> o 06.11.2026; "am 6. November" si legge <i>am sechsten November</i>. Compleanno: <i>Ich habe am dritten Mai Geburtstag.</i> [gë-BURTS-ta:k].</p>
<h3>L'ora</h3>
<p><b>Wie spät ist es?</b> [VI: SHPÈ:T IST ES] / <b>Wie viel Uhr ist es?</b> <i>Es ist drei Uhr</i> [ES IST DRAI U:R] (le tre); <i>Es ist ein Uhr</i> (l'una, non «eins»). Ufficiale (orari, treni): 15:30 = fünfzehn Uhr dreißig. Colloquiale: <i>Viertel nach drei</i> (3:15), <i>zehn nach drei</i>, <i>zwanzig nach drei</i>, <i>fünf vor halb vier</i> (3:25), <i>halb vier</i> (3:30), <i>fünf nach halb vier</i> (3:35), <i>Viertel vor vier</i> (3:45). <b>Trappola</b>: <i>halb drei</i> = le due e mezza (mezza ora <i>verso</i> le tre), non le tre e mezza. Nel sud e in Austria <i>viertel vier</i> = 3:15 e <i>dreiviertel vier</i> = 3:45. Orario preciso: <i>um drei Uhr</i> = alle tre. Parti del giorno: morgens, mittags, nachmittags, abends, nachts; <i>heute Morgen</i>, <i>gestern Abend</i>, <i>morgen früh</i>.</p>
${vsec('Paesi e nazionalità', [
  ['Deutschland, Deutscher/Deutsche', 'DOITSH-lant, DOI-tsha / DOI-tshë', 'Germania, tedesco/a'],
  ['Österreich, Österreicher/in', 'Ö:-sta-raiç, Ö:-sta-rai-ça', 'Austria, austriaco/a'],
  ['die Schweiz, Schweizer/in', 'SHVAITS, SHVAI-tsa', 'Svizzera, svizzero/a'],
  ['Italien, Italiener/in', 'i-TA:-li-ën, i-ta-LIÉ:-na', 'Italia, italiano/a'],
  ['Frankreich, Franzose/Französin', 'FRANK-raiç, fran-TSO:-zë / fran-TSÖ:-zin', 'Francia, francese'],
  ['Spanien, Spanier/in', 'SHPA:-ni-ën, SHPA:-ni-a', 'Spagna, spagnolo/a'],
  ['England, Engländer/in', 'EN-glant, EN-glen-da', 'Inghilterra, inglese'],
])}
<p>Struttura: <i>Ich komme aus Italien</i>, <i>Ich wohne in Deutschland</i>; con paesi che hanno l'articolo: <i>aus der Schweiz</i>, <i>in der Schweiz</i>, <i>aus den USA</i>. Professione e nazionalità senza articolo: <i>Ich bin Italiener</i>, <i>Sie ist Lehrerin</i>. Le lingue sono sostantivi con la maiuscola (<i>Ich spreche Deutsch</i>); gli aggettivi no (<i>die italienische Küche</i>). Il femminile si fa con <b>-in</b> (Italienerin, Französin).</p>
<div class="say"><b>Cosa dire.</b> «Guten Tag, ich heiße Marco Rossi [IÇ HAI-ssë MAR-ko RO-ssi]. Ich komme aus Italien und wohne in Berlin. Freut mich!»</div>`,
  [
    q(
      'q1',
      `Che ora è con «Es ist halb drei»?`,
      [`Le 2:30, due e mezza`, `Le 3:30, tre e mezza`, `Le 2:45, tre meno un quarto`, `Le 3:15, tre e un quarto`],
      0,
      `Halb drei indica la mezz'ora che porta alle tre, quindi le due e mezza. L'italiano pensa «tre e mezza» perché conta dall'ora precedente.`,
    ),
    q(
      'q2',
      `Come si scrive 21 in tedesco?`,
      [`einundzwanzig`, `zwanzigeins`, `zwanzigundein`, `zwanzig-eins`],
      0,
      `Le unità vengono prima delle decine e si legano con und: ein-und-zwanzig. La forma italiana ventuno, con le decine prima, è proprio la tentazione da evitare.`,
    ),
    q(
      'q3',
      `Con un cliente sconosciuto di 50 anni scegli:`,
      [`Wie heißen Sie?`, `Wie heißt du?`, `Wie heißt Sie?`, `Wie heißen du?`],
      0,
      `Sie richiede la forma plurale del verbo, come in heißen Sie. Heißt Sie sembra naturale per chi pensa al «Lei» singolare italiano, ma è sbagliato.`,
    ),
    q(
      'q4',
      `Come dici «Ho 30 anni»?`,
      [`Ich bin 30 Jahre alt.`, `Ich habe 30 Jahre.`, `Ich habe 30 Jahre alt.`, `Ich bin 30 Jahre.`],
      0,
      `In tedesco l'età si dice con sein, e di solito con alt. Ich habe 30 Jahre è il calco dell'italiano «ho» e non si usa.`,
    ),
    q(
      'q5',
      `Come si legge «Tschüss»?`,
      [`TSHÜS: ts + sh + ü breve`, `SHÜS: sh + ü lunga`, `TSÜS: ts + ü breve`, `TSHUS: tsh + u breve`],
      0,
      `Tsch è il suono della «c» di «cena» e la ü ha le labbra tonde. Perdere la t iniziale o leggere u cambia la parola in qualcosa di non tedesco.`,
    ),
    q(
      'q6',
      `Qual è il significato di «Billion» in tedesco?`,
      [
        `Mille miliardi (10 alla 12)`,
        `Un miliardo (10 alla 9)`,
        `Un milione di milioni di milioni`,
        `Un trilione (10 alla 18)`,
      ],
      0,
      `Billion è 10^12, il miliardo è Milliarde. L'inglese billion = miliardo trae in inganno, ma qui significa mille volte di più.`,
    ),
    q(
      'q7',
      `Come si dice «a maggio»?`,
      [`im Mai`, `am Mai`, `um Mai`, `in Mai`],
      0,
      `I mesi usano im (in dem). Am si usa con giorni e date (am Montag, am 6. Mai), um con l'ora: la scelta di am per il mese è la tentazione.`,
    ),
    q(
      'q8',
      `Come si legge «sechzehn» (16)?`,
      [`ZEÇ-tsé:n, con ç e senza s`, `ZECHS-tsé:n, con s finale`, `ZEKS-tsé:n, come «sechs»`, `ZEÇ-sé:n, con s sorda`],
      0,
      `Sechzehn perde la s di sechs e la ch dopo e è ç. La z di zehn resta ts: leggere ZEKS come nel numero 6 è sbagliato.`,
    ),
  ],
  [
    card(
      'c1',
      `Wie heißen Sie? / Wie heißt du?`,
      `Come si chiama? / Come ti chiami? Sie prende il verbo plurale: Sie heißen. Risposta: Ich heiße ...`,
    ),
    card('c2', `halb drei`, `Le 2:30 (mezza ora verso le tre). Le 3:30 = halb vier. Viertel nach drei = 3:15.`),
    card(
      'c3',
      `einundzwanzig [AIN-unt-tsvan-tsiç]`,
      `21. Unità prima delle decine, unite da und. Così anche vierundfünfzig, neunundneunzig.`,
    ),
    card('c4', `Ich bin 30 Jahre alt.`, `Ho 30 anni. Età con sein, non haben.`),
    card(
      'c5',
      `Guten Morgen / Guten Tag / Guten Abend / Gute Nacht`,
      `Buongiorno (mattina) / buongiorno, buon pomeriggio / buonasera / buonanotte. Nacht è femminile: gute (non guten).`,
    ),
    card(
      'c6',
      `Grüß Gott / Servus / Moin / Grüezi`,
      `Saluti regionali: Sud DE e Austria / Austria e Baviera / nord / Svizzera.`,
    ),
    card(
      'c7',
      `die Wochentage [VO-chën-ta:-gë]`,
      `Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag. Tutti maschili: der Montag, am Montag.`,
    ),
    card(
      'c8',
      `Ordinali: erste, zweite, dritte, siebte, achte`,
      `1°, 2°, 3°, 7°, 8°: forme irregolari. Da 20: -ste (zwanzigste). Il 6 novembre = der sechste November.`,
    ),
    card(
      'c9',
      `Wie spät ist es? / Wie viel Uhr ist es?`,
      `Che ora è? Risposta: Es ist ... Uhr; Es ist ein Uhr (l'una); um drei Uhr = alle tre.`,
    ),
    card('c10', `Billion / Milliarde`, `Billion = mille miliardi (10^12). Milliarde = miliardo. Million = milione.`),
    card(
      'c11',
      `Aus + paese`,
      `Ich komme aus Italien. Con articolo: aus der Schweiz, aus den USA. Residenza: Ich wohne in Berlin.`,
    ),
    card(
      'c12',
      `sechzehn, siebzehn, dreißig [ZEÇ-tsé:n, ZI:P-tsé:n, DRAI-ssiç]`,
      `16, 17, 30. Sechzehn perde la s, siebzehn la -en, dreißig usa la ß (s sorda).`,
    ),
  ],
  [
    prac(
      'p1',
      `Traduci: «Mi chiamo Anna, ho 25 anni e abito a Milano.»`,
      `Ich heiße Anna, ich bin 25 Jahre alt und wohne in Mailand. Nota: Mailand = Milano; l'età con sein.`,
    ),
    prac(
      'p2',
      `Scrivi in lettere i numeri: 34, 67, 105, 1.200.`,
      `vierunddreißig; siebenundsechzig; hundertfünf; eintausendzweihundert. Nota: le unità vengono prima, tutto in una parola.`,
    ),
    prac(
      'p3',
      `Dì l'ora in modo colloquiale: 7:15, 7:30, 7:45, 8:25.`,
      `Viertel nach sieben; halb acht; Viertel vor acht; fünf vor halb neun. Nota: 7:30 = halb acht, non halb sieben.`,
    ),
    prac(
      'p4',
      `Correggi: «Wie heißt Sie? Ich habe 30 Jahre. Ich bin aus Italien.»`,
      `Wie heißen Sie? Ich bin 30 Jahre alt. Ich komme aus Italien. Nota: Sie vuole il verbo plurale; età con sein; origine con kommen aus.`,
    ),
    prac(
      'p5',
      `Presenta te stesso in 4 frasi a uno sconosciuto (Sie) e a un amico (du).`,
      `Guten Tag, ich heiße Marco. Ich komme aus Italien und wohne in München. Und Sie? / Hallo, ich bin Marco! Wie heißt du? Woher kommst du? Nota: con Sie il verbo plurale e Und Sie? maiuscolo.`,
    ),
  ],
)

export const deSein = mod(
  'de-sein',
  'Sein, haben, werden e «es gibt»',
  'Differenze d’uso, espressioni con haben, età e sensazioni, c’è / ci sono',
  'a1',
  `${PRON_SHORT}
<p class="lead">Tre verbi irregolari reggono quasi tutte le frasi: <b>sein</b> (essere), <b>haben</b> (avere) e <b>werden</b> (diventare). La differenza con l'italiano sta nell'uso: in tedesco l'età con <i>sein</i>, la fame con <i>haben</i>, il freddo con il dativo, e «c'è» è <i>es gibt</i>.</p>
<h3>Le forme del presente</h3>
<table><tr><th>Persona</th><th>sein</th><th>haben</th><th>werden</th></tr>
<tr><td>ich</td><td>bin [BIN]</td><td>habe [HA:-bë]</td><td>werde [VER-dë]</td></tr>
<tr><td>du</td><td>bist [BIST]</td><td>hast [HAST]</td><td>wirst [VIRST]</td></tr>
<tr><td>er / sie / es</td><td>ist [IST]</td><td>hat [HAT]</td><td>wird [VIRT]</td></tr>
<tr><td>wir</td><td>sind [ZINT]</td><td>haben [HA:-bën]</td><td>werden [VER-dën]</td></tr>
<tr><td>ihr</td><td>seid [ZAIT]</td><td>habt [HA:PT]</td><td>werdet [VER-dët]</td></tr>
<tr><td>sie / Sie</td><td>sind [ZINT]</td><td>haben [HA:-bën]</td><td>werden [VER-dën]</td></tr></table>
<p>Pronuncia: <i>habe</i> ha la a lunga ma <i>hat</i>, <i>hast</i> breve. <i>sind</i> finisce in t (Auslautverhärtung); <i>wird</i> [VIRT] uguale. <i>seid</i> (voi siete) e <i>seit</i> (da) suonano uguali [ZAIT]. Il verbo è sempre espresso: <i>Ich bin müde</i>, non «bin müde».</p>
<h3>Sein: identità, stato, età</h3>
<ul><li>identità, professione, nazionalità <b>senza articolo</b>: <i>Ich bin Lehrer</i> [LÉ:-ra]; <i>Sie ist Ärztin</i> [È:RTS-tin]; <i>Wir sind Italiener</i>.</li><li>età: <i>Ich bin 30 Jahre alt</i> (non «habe»); <i>Wie alt bist du?</i> [VI: ALT BIST DU:].</li><li>stati e luoghi: <i>Ich bin müde</i> [MÜ:-dë], <i>Er ist zu Hause</i> [TSU: HAU-zë], <i>Das Wetter ist schön</i>; tempo: <i>Es ist kalt</i>, <i>Es ist spät</i>.</li><li>sensazioni fisiche: <i>Mir ist kalt</i> [MI:R IST KALT] (ho freddo), <i>Mir ist warm</i> (ho caldo), <i>Mir ist schlecht</i> (sto male).</li></ul>
<h3>Haben: possesso e molte espressioni</h3>
<p>Possesso: <i>Ich habe einen Bruder</i> (maschile accusativo, vedi de-nomi), <i>Haben Sie Kinder?</i> [HA:-bën ZI: KIN-da]. Molte espressioni italiane con «avere» o «fare» si costruiscono con haben:</p>
<table><tr><th>Espressione</th><th>Italiano</th></tr>
<tr><td>Hunger haben [HUN-ga]</td><td>aver fame</td></tr>
<tr><td>Durst haben [DURST]</td><td>aver sete</td></tr>
<tr><td>Angst haben (vor) [ANGST]</td><td>aver paura (di)</td></tr>
<tr><td>Zeit / Lust haben [TSAIT / LUST]</td><td>aver tempo / voglia</td></tr>
<tr><td>recht haben [REÇT]</td><td>aver ragione</td></tr>
<tr><td>Kopfschmerzen haben</td><td>aver mal di testa</td></tr>
<tr><td>Geburtstag haben</td><td>fare il compleanno</td></tr>
<tr><td>Glück / Pech haben [GLÜK / PEÇ]</td><td>aver fortuna / sfortuna</td></tr></table>
<p>Trappola: <b>Hunger/Durst haben</b> ma anche «hungrig sein»; <b>Angst haben</b>, non «sein ängstlich». Non dire «Ich bin Hunger» (che significa «sono la fame»). Per <i>ho ragione</i>: <i>Ich habe recht</i> (anche Recht).</p>
<h3>Werden: diventare, e non solo</h3>
<p><i>werden</i> = diventare: <i>Es wird kalt</i> (si sta facendo freddo), <i>Er wird Arzt</i> [ARTST] (diventa medico), <i>Ich werde 30</i> (compio 30 anni), <i>Mir wird kalt</i> (mi viene freddo). Differenza di stato e cambiamento: <i>Ich bin müde</i> (sono stanco) / <i>Ich werde müde</i> (mi sto stancando). Più avanti: <i>werden</i> forma anche il futuro (de-futuro) e il passivo.</p>
<h3>Es gibt: c'è, ci sono</h3>
<p><b>Es gibt</b> [ES GIPT] + accusativo, sempre singolare e uguale al plurale: <i>Es gibt einen Park in der Nähe</i> [IN DÉ:R NÈ:-ë]; <i>Es gibt viele Restaurants</i> (viele è plurale ma «gibt» resta). Esprime l'esistenza in generale. Per un oggetto preciso e visibile si usa invece <i>sein</i>: <i>Da ist mein Bus!</i> (Ecco il mio autobus). Domanda: <i>Gibt es hier ein Café?</i> [GIPT ES HI:R AIN ka-FÉ:] (nota: accusativo). Negazione: <i>Es gibt keinen Zucker mehr.</i> Il luogo non si dice con «gibt»: <i>Das Buch ist auf dem Tisch</i> (non «es gibt das Buch auf dem Tisch»).</p>
<h3>Differenze con l'italiano</h3>
<ul><li>«Mi chiamo» = <i>Ich heiße</i>; «sono d'accordo» = <i>Ich bin einverstanden</i> / <i>Das stimmt</i>.</li><li>«Ho caldo/freddo» = <i>Mir ist heiß/kalt</i> (dativo) o <i>Ich friere</i> (sento freddo).</li><li>«Ha 3 figli» = <i>Er hat drei Kinder</i>.</li><li>I verbi ausiliari: sein e haben servono per il Perfekt (de-perfekt): <i>Ich bin gegangen</i>, <i>Ich habe gegessen</i>.</li></ul>
<div class="say"><b>Cosa dire.</b> «Ich bin müde und habe Hunger. Gibt es hier ein Restaurant? Mir ist kalt.»</div>`,
  [
    q(
      'q1',
      `Come dici «Ho 25 anni»?`,
      [`Ich bin 25 Jahre alt.`, `Ich habe 25 Jahre alt.`, `Ich habe 25 Jahre.`, `Ich werde 25 Jahre alt.`],
      0,
      `L'età si esprime con sein. Habe è il calco dell'italiano «ho»; werde significa che si compiono gli anni, non che li si ha.`,
    ),
    q(
      'q2',
      `Come dici «Ho fame»?`,
      [`Ich habe Hunger.`, `Ich bin Hunger.`, `Ich werde Hunger.`, `Mir ist Hunger.`],
      0,
      `Hunger si dice con haben come Durst e Angst. Ich bin Hunger significherebbe «io sono la fame»; Mir ist Hunger è un calco di «ho freddo».`,
    ),
    q(
      'q3',
      `Quale frase è corretta per «C'è un parco»?`,
      [`Es gibt einen Park.`, `Es gibt ein Park.`, `Es gibt der Park.`, `Es gibt einen Parken.`],
      0,
      `Es gibt vuole l'accusativo e Park è maschile, quindi einen. Ein Park è la forma del nominativo, che la maggior parte degli studenti usa per errore.`,
    ),
    q(
      'q4',
      `Qual è la differenza tra «Ich bin müde» e «Ich werde müde»?`,
      [
        `Il primo indica uno stato, il secondo un cambiamento`,
        `Il primo indica un cambiamento, il secondo uno stato`,
        `Sono sinonimi e si possono scambiare sempre`,
        `Il secondo è il futuro di «sono stanco»`,
      ],
      0,
      `Werden descrive il passaggio verso uno stato («mi sto stancando»). È un presente, non un futuro, anche se in altre frasi werden forma il futuro.`,
    ),
    q(
      'q5',
      `Come si legge «habe» (ho)?`,
      [`HA:-bë: a lunga e b sonora`, `HAP-bë: a breve e doppia b`, `A-bë: senza la h`, `HA:-pë: con la b dura`],
      0,
      `La a è lunga davanti a una sola consonante e la b è sonora perché non è finale. Come in italiano, la tentazione è omettere la h, ma qui si soffia.`,
    ),
    q(
      'q6',
      `Quali due parole suonano uguali, [ZAIT]?`,
      [
        `seid (siete) e seit (da)`,
        `seid (siete) e sind (sono)`,
        `seit (da) e sieht (vede)`,
        `seid (siete) e sagt (dice)`,
      ],
      0,
      `Seid e seit sono omofone: la d finale diventa t. Sind finisce con nt e sieht è una i lunga, quindi non coincidono.`,
    ),
    q(
      'q7',
      `Quale frase è corretta con un oggetto preciso?`,
      [
        `Das Buch ist auf dem Tisch.`,
        `Es gibt das Buch auf dem Tisch.`,
        `Das Buch gibt auf dem Tisch.`,
        `Das Buch hat auf dem Tisch.`,
      ],
      0,
      `Per localizzare qualcosa di preciso si usa sein. Es gibt introduce l'esistenza in generale e di solito con un articolo indeterminativo.`,
    ),
    q(
      'q8',
      `Come dici «Ho freddo» (idiomatico)?`,
      [`Mir ist kalt.`, `Ich habe kalt.`, `Ich bin kalt.`, `Ich werde kalt.`],
      0,
      `Per le sensazioni di temperatura si usa il dativo con sein. Ich bin kalt significa che la persona è fredda di carattere o al tatto.`,
    ),
  ],
  [
    card(
      'c1',
      `ich bin / du bist / er ist`,
      `Presente di sein. Wir sind, ihr seid, sie sind. Pronuncia: bin [BIN], bist [BIST], ist [IST], sind [ZINT].`,
    ),
    card(
      'c2',
      `ich habe / du hast / er hat`,
      `Presente di haben. Wir haben, ihr habt, sie haben. habe [HA:-bë] con a lunga; hat [HAT] breve.`,
    ),
    card(
      'c3',
      `ich werde / du wirst / er wird`,
      `Presente di werden. Wir werden, ihr werdet. Significa diventare; wird si legge [VIRT].`,
    ),
    card('c4', `Hunger / Durst / Angst haben`, `Aver fame / sete / paura. Con haben, non con sein.`),
    card('c5', `Mir ist kalt / warm / schlecht`, `Ho freddo / caldo / mi sento male. Dativo mir + sein.`),
    card(
      'c6',
      `Es gibt + Akkusativ`,
      `C'è / ci sono: Es gibt einen Park, es gibt viele Restaurants. Sempre gibt al singolare.`,
    ),
    card('c7', `Ich bin Lehrer.`, `Sono insegnante. Professione senza articolo. Anche Ich bin Italiener.`),
    card('c8', `Wie alt bist du? / Ich bin ... Jahre alt.`, `Quanti anni hai? Sono ... anni. Età con sein.`),
    card('c9', `seid / seit [ZAIT]`, `Omofoni. seid = voi siete (sein); seit = da (preposizione di tempo).`),
    card('c10', `Es wird kalt. / Ich werde 30.`, `Si sta facendo freddo. / Compio 30 anni. werden = diventare.`),
    card('c11', `Da ist ... / Hier ist ...`, `Ecco ... / Ecco qui ...: oggetto preciso con sein. Non con es gibt.`),
  ],
  [
    prac(
      'p1',
      `Traduci: «Ho fame e ho sete, ma non ho tempo.»`,
      `Ich habe Hunger und Durst, aber ich habe keine Zeit. Nota: tutte e tre con haben; keine Zeit (kein), vedi de-nomi.`,
    ),
    prac(
      'p2',
      `Traduci: «Mia sorella ha 22 anni ed è medico.»`,
      `Meine Schwester ist 22 Jahre alt und (ist) Ärztin. Nota: età con sein; professione senza articolo; Ärztin è femminile (-in con umlaut).`,
    ),
    prac(
      'p3',
      `Correggi: «Ich habe kalt. Es gibt der Tisch im Zimmer. Ich bin Hunger.»`,
      `Mir ist kalt. Es gibt einen Tisch im Zimmer (oppure: Der Tisch steht im Zimmer). Ich habe Hunger. Nota: dativo per il freddo; es gibt vuole l'accusativo.`,
    ),
    prac(
      'p4',
      `Traduci: «Nel mio quartiere c'è un supermercato e ci sono molti bar.»`,
      `In meinem Viertel gibt es einen Supermarkt und viele Bars (Cafés). Nota: es gibt resta singolare anche con il plurale; Supermarkt maschile, quindi einen.`,
    ),
    prac(
      'p5',
      `Scrivi 5 frasi su di te: due con sein, due con haben, una con werden.`,
      `Esempio: Ich bin Student. Ich bin 24 Jahre alt. Ich habe einen Bruder. Ich habe Hunger. Ich werde im Mai 25. Nota: usa il dizionario per le professioni; Student senza articolo.`,
    ),
  ],
)

export const tedescoA = [
  dePron,
  deSaluti,
  deSein,
  deNomi,
  dePresente,
  deQuotidiano,
  deCasi,
  dePerfekt,
  dePraeteritum,
  deFuturo,
  deImperativo,
  deRiflessivi,
  deNebensaetze1,
]
