import type { CourseModule } from '../../engine/types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT, vsec } from './pron'

// Russian vocabulary modules (voc group). Tables come from vsec(heading, [russian, pronunciation, italian][]).
// Nouns are given in the nominative singular; gender in brackets where it helps (m, f, n).

export const ruVocVita = mod(
  'ru-voc-vita',
  `Vocabolario: famiglia, casa, cibo, colori, corpo, vestiti, tempo, hobby e lavoro`,
  `Le parole di tutti i giorni con accento e pronuncia, generi dei nomi, tempo libero, lavoro e studio, e le trappole di chi parla italiano`,
  'voc',
  `<p class="lead">Questo modulo raccoglie le parole più frequenti per parlare di sé, della casa e della giornata. Impara ogni parola <b>con il suo accento</b> e, per i nomi, con il genere: sono due informazioni che non si possono dedurre dalla grafia.</p>
${PRON_SHORT}
${vsec(`Famiglia`, [
  [`ма́ма`, `MA-ma`, `mamma (f)`],
  [`па́па`, `PA-pa`, `papà (m)`],
  [`роди́тели`, `ra-DI-ti-li`, `genitori (pl)`],
  [`брат`, `BRAT`, `fratello (m)`],
  [`сестра́`, `sis-TRA`, `sorella (f)`],
  [`сын`, `SYN`, `figlio (m)`],
  [`дочь`, `DOC`, `figlia (f)`],
  [`ба́бушка`, `BA-bu-shka`, `nonna (f)`],
  [`де́душка`, `DIE-du-shka`, `nonno (m)`],
  [`муж`, `MUSH`, `marito (m)`],
  [`жена́`, `zhy-NA`, `moglie (f)`],
  [`ребёнок`, `ri-BIO-nak`, `bambino (m)`],
  [`друг`, `DRUK`, `amico (m)`],
  [`подру́га`, `pa-DRU-ga`, `amica (f)`],
  [`семья́`, `sim'-IA`, `famiglia (f)`],
])}
${vsec(`Casa`, [
  [`дом`, `DOM`, `casa, edificio (m)`],
  [`кварти́ра`, `kvar-TI-ra`, `appartamento (f)`],
  [`ко́мната`, `KOM-na-ta`, `stanza (f)`],
  [`ку́хня`, `KUH-nia`, `cucina (f)`],
  [`спа́льня`, `SPAL'-nia`, `camera da letto (f)`],
  [`ва́нная`, `VAN-na-ia`, `bagno con vasca (f)`],
  [`туале́т`, `tu-a-LIET`, `gabinetto (m)`],
  [`окно́`, `ak-NO`, `finestra (n)`],
  [`дверь`, `DVIER'`, `porta (f)`],
  [`стол`, `STOL`, `tavolo (m)`],
  [`стул`, `STUL`, `sedia (m)`],
  [`крова́ть`, `kra-VAT'`, `letto (f)`],
  [`дива́н`, `di-VAN`, `divano (m)`],
  [`шкаф`, `SHKAF`, `armadio (m)`],
  [`ключ`, `KLIUC`, `chiave (m)`],
  [`эта́ж`, `i-TASH`, `piano (m; пе́рвый эта́ж = piano terra)`],
])}
${vsec(`Cibo e bevande`, [
  [`хлеб`, `HLIEP`, `pane (m)`],
  [`молоко́`, `ma-la-KO`, `latte (n)`],
  [`вода́`, `va-DA`, `acqua (f)`],
  [`чай`, `CIAI`, `tè (m)`],
  [`ко́фе`, `KO-fie`, `caffè (m)`],
  [`сок`, `SOK`, `succo (m)`],
  [`суп`, `SUP`, `minestra, zuppa (m)`],
  [`мя́со`, `MIA-ssa`, `carne (n)`],
  [`ры́ба`, `RY-ba`, `pesce (f)`],
  [`сыр`, `SYR`, `formaggio (m)`],
  [`яйцо́`, `ii-TSO`, `uovo (n)`],
  [`ма́сло`, `MA-sla`, `burro, olio (n)`],
  [`соль`, `SOL'`, `sale (f)`],
  [`карто́фель`, `kar-TO-fil'`, `patate (m, collettivo)`],
  [`карто́шка`, `kar-TO-shka`, `patate (parlato; anche una patata)`],
  [`я́блоко`, `IA-bla-ka`, `mela (n)`],
  [`апельси́н`, `a-pil'-SIN`, `arancia (m)`],
  [`пи́во`, `PI-va`, `birra (n)`],
  [`вино́`, `vi-NO`, `vino (n)`],
  [`за́втрак`, `ZAF-trak`, `colazione (m)`],
  [`обе́д`, `a-BIET`, `pranzo (m)`],
  [`у́жин`, `U-zhyn`, `cena (m)`],
])}
<p><b>Trappola italiana</b>: <b>обе́д</b> è il pranzo, non «cena»; il cibo del mattino è <b>за́втрак</b>, quello della sera <b>у́жин</b>. <b>Ма́сло</b> indica sia il burro sia l'olio, e <b>соль</b> è femminile. <b>Карто́фель</b> indica le patate in generale; <b>карто́шка</b> è la forma parlata.</p>
${vsec(`Colori`, [
  [`бе́лый`, `BIE-lyi`, `bianco`],
  [`чёрный`, `CIOR-nyi`, `nero`],
  [`кра́сный`, `KRAS-nyi`, `rosso`],
  [`си́ний`, `SI-nii`, `blu scuro`],
  [`голубо́й`, `ga-lu-BOI`, `azzurro`],
  [`зелёный`, `zi-LIO-nyi`, `verde`],
  [`жёлтый`, `ZHOL-tyi`, `giallo`],
  [`се́рый`, `SIE-ryi`, `grigio`],
  [`ора́нжевый`, `a-RAN-zhy-vyi`, `arancione`],
  [`ро́зовый`, `RO-za-vyi`, `rosa`],
])}
<p>In russo <b>си́ний</b> (blu scuro) e <b>голубо́й</b> (azzurro) sono due colori distinti, come per noi «rosso» e «rosa». Gli aggettivi di colore concordano: <b>кра́сная маши́на</b> [KRAS-na-ia ma-SHY-na], <b>зелёное окно́</b> [zi-LIO-na-ia ak-NO].</p>
${vsec(`Corpo`, [
  [`голова́`, `ga-la-VA`, `testa (f)`],
  [`лицо́`, `li-TSO`, `viso (n)`],
  [`глаз`, `GLAS`, `occhio (m); plurale глаза́ [gla-ZA]`],
  [`нос`, `NOS`, `naso (m)`],
  [`рот`, `ROT`, `bocca (m)`],
  [`у́хо`, `U-ha`, `orecchio (n); plurale у́ши [U-shy]`],
  [`зуб`, `ZUP`, `dente (m)`],
  [`рука́`, `ru-KA`, `mano, braccio (f)`],
  [`нога́`, `na-GA`, `gamba, piede (f)`],
  [`спина́`, `spi-NA`, `schiena (f)`],
  [`живо́т`, `zhy-VOT`, `pancia (m)`],
  [`се́рдце`, `SIER-tsy`, `cuore (n)`],
  [`во́лосы`, `VO-la-sy`, `capelli (pl)`],
])}
<p><b>Рука́</b> copre mano e braccio, <b>нога́</b> gamba e piede: si distingue solo dal contesto. Per dire che qualcosa fa male: <b>У меня́ боли́т голова́.</b> [u mi-NIA ba-LIT ga-la-VA] (mi fa male la testa).</p>
${vsec(`Vestiti`, [
  [`оде́жда`, `a-DIEZH-da`, `abbigliamento (f)`],
  [`руба́шка`, `ru-BASH-ka`, `camicia (f)`],
  [`брю́ки`, `BRIU-ki`, `pantaloni (pl)`],
  [`ю́бка`, `IUP-ka`, `gonna (f)`],
  [`пла́тье`, `PLAT'-ie`, `vestito da donna (n)`],
  [`ку́ртка`, `KURT-ka`, `giacca (f)`],
  [`пальто́`, `pal'-TO`, `cappotto (n)`],
  [`ша́пка`, `SHAP-ka`, `berretto (f)`],
  [`боти́нки`, `ba-TIN-ki`, `scarpe alte (pl)`],
  [`носки́`, `nas-KI`, `calzini (pl)`],
  [`перча́тки`, `pir-CIAT-ki`, `guanti (pl)`],
  [`су́мка`, `SUM-ka`, `borsa (f)`],
])}
${vsec(`Tempo atmosferico e stagioni`, [
  [`пого́да`, `pa-GO-da`, `tempo (f)`],
  [`со́лнце`, `SON-tsy`, `sole (n)`],
  [`дождь`, `DOSHT'`, `pioggia (m)`],
  [`снег`, `SNIEK`, `neve (m)`],
  [`ве́тер`, `VIE-tir`, `vento (m)`],
  [`хо́лодно`, `HO-lad-na`, `fa freddo`],
  [`тепло́`, `tip-LO`, `fa caldo, è tiepido`],
  [`жа́рко`, `ZHAR-ka`, `fa molto caldo`],
  [`весна́`, `vis-NA`, `primavera (f)`],
  [`ле́то`, `LIE-ta`, `estate (n)`],
  [`о́сень`, `O-sin'`, `autunno (f)`],
  [`зима́`, `zi-MA`, `inverno (f)`],
])}
<p>Per descrivere il tempo si usa un avverbio senza soggetto: <b>Сего́дня хо́лодно.</b> [si-VOD-nia HO-lad-na] (oggi fa freddo), <b>Идёт дождь.</b> [i-DIOT DOSHT'] (piove), <b>Идёт снег.</b> [i-DIOT SNIEK] (nevica). Letteralmente «viene la pioggia».</p>
${vsec(`Tempo libero, sport, lavoro e studio`, [
  [`спорт`, `SPORT`, `sport (m)`],
  [`му́зыка`, `MU-zy-ka`, `musica (f)`],
  [`кино́`, `ki-NO`, `cinema (n)`],
  [`фильм`, `FIL'M`, `film (m)`],
  [`футбо́л`, `fud-BOL`, `calcio (m)`],
  [`гита́ра`, `gi-TA-ra`, `chitarra (f)`],
  [`игра́ть`, `ig-RAT'`, `giocare, suonare`],
  [`гуля́ть`, `gu-LIAT'`, `passeggiare`],
  [`пла́вать`, `PLA-vat'`, `nuotare`],
  [`бе́гать`, `BIE-gat'`, `correre (per sport)`],
  [`танцева́ть`, `tan-tsy-VAT'`, `ballare`],
  [`рисова́ть`, `ri-sa-VAT'`, `disegnare`],
  [`рабо́та`, `ra-BO-ta`, `lavoro (f)`],
  [`рабо́тать`, `ra-BO-tat'`, `lavorare`],
  [`о́фис`, `O-fis`, `ufficio (m)`],
  [`колле́га`, `ka-LIE-ga`, `collega (m/f)`],
  [`профе́ссия`, `pra-FIE-ssi-ia`, `professione (f)`],
  [`учёба`, `u-CIO-ba`, `studio (f)`],
  [`уро́к`, `u-ROK`, `lezione (m)`],
  [`экза́мен`, `ig-ZA-min`, `esame (m)`],
  [`слова́рь`, `sla-VAR'`, `dizionario (m)`],
])}
<p>Frasi modello: <b>Я люблю́ му́зыку.</b> [ia liub-LIU MU-zy-ku] (amo la musica); <b>Мне нра́вится спорт.</b> [mnie NRA-vi-tsa SPORT]; <b>Я игра́ю в футбо́л.</b> [ia ig-RA-iu f fud-BOL] (gioco a calcio: <b>в</b> + accusativo per i giochi e gli sport); <b>Я игра́ю на гита́ре.</b> [ia ig-RA-iu na gi-TA-rie] (suono la chitarra: <b>на</b> + prepositivo per gli strumenti); <b>Я занима́юсь спо́ртом.</b> [ia za-ni-MA-ius' SPOR-tam] (faccio sport); <b>Я рабо́таю в о́фисе.</b> [ia ra-BO-ta-iu v O-fi-sie] (lavoro in un ufficio); <b>Что ты лю́бишь де́лать?</b> [SHTO ty LIU-bish DIE-lat'] (che cosa ti piace fare?).</p>
<h3>In sintesi</h3>
<p>Impara le parole in gruppi (famiglia, casa, cibo...) sempre con accento e genere. Le trappole sono: обе́д = pranzo, ма́сло = burro e olio, рука́ = mano e braccio, си́ний ≠ голубо́й. Per ripassare, copri la colonna italiana e leggi ad alta voce la trascrizione.</p>
<div class="say"><b>Da dire.</b> «У меня́ есть брат и сестра́. Мы живём в кварти́ре.» [u mi-NIA IEST' BRAT i sis-TRA. my zhy-VIOM f kvar-TI-rie]</div>`,
  [
    q(
      'q1',
      `Che cosa significa «молоко́»?`,
      [`latte`, `pane`, `carne`, `formaggio`],
      0,
      `Молоко́ è il latte e ha genere neutro; хлеб è pane, мя́со è carne e сыр è formaggio.`,
    ),
    q(
      'q2',
      `Come si dice «sorella» in russo?`,
      [`сестра́`, `ба́бушка`, `дочь`, `подру́га`],
      0,
      `Сестра́ è la sorella; ба́бушка è la nonna, дочь la figlia e подру́га l'amica.`,
    ),
    q(
      'q3',
      `Che colore è «зелёный»?`,
      [`verde`, `giallo`, `grigio`, `rosa`],
      0,
      `Зелёный significa verde; жёлтый è giallo, се́рый grigio e ро́зовый rosa.`,
    ),
    q(
      'q4',
      `Quale pasto è «обе́д»?`,
      [`il pranzo`, `la colazione`, `la cena`, `lo spuntino`],
      0,
      `Обе́д è il pranzo; la colazione è за́втрак e la cena è у́жин: attenzione, non è «cena».`,
    ),
    q(
      'q5',
      `Come si dice «Fa freddo»?`,
      [`Хо́лодно.`, `Жа́рко.`, `Тепло́.`, `Снег.`],
      0,
      `Хо́лодно descrive il freddo; жа́рко è molto caldo e тепло́ indica un tepore piacevole.`,
    ),
    q(
      'q6',
      `Che cosa significa «ключ»?`,
      [`chiave`, `chiesa`, `cucchiaio`, `stanza`],
      0,
      `Ключ significa chiave; la stanza è ко́мната. Si pronuncia [KLIUC] con ч finale.`,
    ),
    q(
      'q7',
      `Qual è il genere di «окно́» e «молоко́»?`,
      [`neutro`, `maschile`, `femminile`, `plurale`],
      0,
      `Le parole che terminano in -о sono neutre, anche se in italiano finestra è femminile e latte maschile.`,
    ),
    q(
      'q8',
      `Quale parola significa «mano» e anche «braccio»?`,
      [`рука́`, `нога́`, `голова́`, `спина́`],
      0,
      `Рука́ copre sia la mano sia il braccio; нога́ indica gamba e piede, голова́ la testa e спина́ la schiena.`,
    ),
    q(
      'q9',
      `Come si dice «Gioco a calcio»?`,
      [`Я игра́ю в футбо́л.`, `Я игра́ю на футбо́л.`, `Я игра́ю в футбо́ле.`, `Я игра́ю футбо́лом.`],
      0,
      `Per i giochi e gli sport con игра́ть si usa в + accusativo: в футбо́л; на + prepositivo è per gli strumenti.`,
    ),
    q(
      'q10',
      `Come si dice «Suono la chitarra»?`,
      [`Я игра́ю на гита́ре.`, `Я игра́ю в гита́ру.`, `Я игра́ю гита́ру.`, `Я игра́ю с гита́рой.`],
      0,
      `Con gli strumenti si usa игра́ть на + prepositivo: на гита́ре, come in на пиани́но.`,
    ),
  ],
  [
    card('c1', `Famiglia`, `ма́ма, па́па, брат, сестра́, сын, дочь, ба́бушка, де́душка, муж, жена́, семья́, роди́тели.`),
    card('c2', `Casa`, `дом, кварти́ра, ко́мната, ку́хня, окно́, дверь, стол, стул, крова́ть, дива́н, шкаф, ключ.`),
    card('c3', `Pasti`, `за́втрак (colazione), обе́д (pranzo), у́жин (cena). Attenzione: обе́д ≠ cena.`),
    card('c4', `Cibo`, `хлеб, молоко́, вода́, чай, ко́фе, сок, суп, мя́со, ры́ба, сыр, яйцо́, ма́сло, соль.`),
    card('c5', `Colori`, `бе́лый, чёрный, кра́сный, си́ний (blu scuro), голубо́й (azzurro), зелёный, жёлтый, се́рый.`),
    card(
      'c6',
      `Corpo`,
      `голова́, лицо́, глаз, нос, рот, у́хо, рука́ (mano/braccio), нога́ (gamba/piede), спина́, живо́т, се́рдце.`,
    ),
    card('c7', `Vestiti`, `руба́шка, брю́ки, ю́бка, пла́тье, ку́ртка, пальто́, ша́пка, боти́нки, носки́, перча́тки.`),
    card(
      'c8',
      `Tempo`,
      `Хо́лодно (freddo), тепло́, жа́рко; Идёт дождь (piove), Идёт снег (nevica). весна́, ле́то, о́сень, зима́.`,
    ),
    card(
      'c9',
      `Tempo libero`,
      `спорт, му́зыка, кино́, фильм, футбо́л, гита́ра; игра́ть в футбо́л, игра́ть на гита́ре, гуля́ть, пла́вать, танцева́ть, рисова́ть.`,
    ),
    card(
      'c10',
      `Lavoro e studio`,
      `рабо́та, рабо́тать, о́фис, колле́га, профе́ссия, учёба, уро́к, экза́мен, слова́рь. Я рабо́таю в о́фисе.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Scrivi in russo: madre, padre, fratello, sorella, nonna, nonno.`,
      `ма́ма [MA-ma], па́па [PA-pa], брат [BRAT], сестра́ [sis-TRA], ба́бушка [BA-bu-shka], де́душка [DIE-du-shka].`,
    ),
    prac(
      `p2`,
      `Dì in russo: «La mia casa è grande», «Ho un fratello e una sorella».`,
      `Мой дом большо́й. [MOI DOM bal'-SHOI] — У меня́ есть брат и сестра́. [u mi-NIA IEST' BRAT i sis-TRA].`,
    ),
    prac(
      `p3`,
      `Abbina colore e oggetto: cielo azzurro, erba verde, sole giallo, neve bianca.`,
      `голубо́е не́бо; зелёная трава́; жёлтое со́лнце [ZHOL-ta-ia SON-tsy]; бе́лый снег [BIE-lyi SNIEK]. Il colore concorda con il nome.`,
    ),
    prac(
      `p4`,
      `Dì come ordinare: «Voglio caffè e acqua, per favore».`,
      `Мне ко́фе и во́ду, пожа́луйста. [mnie KO-fie i VO-du pa-ZHA-lus-ta] oppure Мо́жно ко́фе? [MOZH-na KO-fie]. Я хочу́... è comprensibile ma più brusco; во́ду è l'accusativo di вода́.`,
    ),
    prac(
      `p5`,
      `Descrivi il tempo di oggi in russo: freddo e nevica.`,
      `Сего́дня хо́лодно, идёт снег. [si-VOD-nia HO-lad-na i-DIOT SNIEK]. Nessun verbo essere, solo avverbio.`,
    ),
    prac(
      `p6`,
      `Dì in russo: «Mi piace la musica», «Gioco a calcio», «Lavoro in un ufficio».`,
      `Мне нра́вится му́зыка. [mnie NRA-vi-tsa MU-zy-ka] — Я игра́ю в футбо́л. [ia ig-RA-iu f fud-BOL] — Я рабо́таю в о́фисе. [ia ra-BO-ta-iu v O-fi-sie].`,
    ),
  ],
)

export const ruVocCitta = mod(
  'ru-voc-citta',
  `Vocabolario: città, trasporti, negozi, ristorante, indicazioni, emergenze`,
  `Le parole per muoversi in città, comprare, mangiare fuori, chiedere la strada e chiedere aiuto`,
  'voc',
  `<p class="lead">Parole e frasi pronte per un viaggio in Russia o in un paese russofono: orientarsi, comprare, ordinare e chiedere aiuto. Le formule con <b>Мо́жно</b>, <b>Мне ну́жно</b>, <b>Я хочу́</b> sono modelli riutilizzabili.</p>
${PRON_SHORT}
${vsec(`Città e luoghi`, [
  [`го́род`, `GO-rat`, `città (m)`],
  [`у́лица`, `U-li-tsa`, `strada (f)`],
  [`пло́щадь`, `PLO-shshit'`, `piazza (f)`],
  [`центр`, `TSENTR`, `centro (m)`],
  [`мост`, `MOST`, `ponte (m)`],
  [`парк`, `PARK`, `parco (m)`],
  [`магази́н`, `ma-ga-ZIN`, `negozio (m)`],
  [`ры́нок`, `RY-nak`, `mercato (m)`],
  [`апте́ка`, `ap-TIE-ka`, `farmacia (f)`],
  [`банк`, `BANK`, `banca (m)`],
  [`по́чта`, `POC-ta`, `posta (f)`],
  [`больни́ца`, `bal'-NI-tsa`, `ospedale (f)`],
  [`шко́ла`, `SHKO-la`, `scuola (f)`],
  [`университе́т`, `u-ni-vir-si-TIET`, `università (m)`],
  [`музе́й`, `mu-ZIEI`, `museo (m)`],
  [`теа́тр`, `ti-ATR`, `teatro (m)`],
  [`рестора́н`, `ris-ta-RAN`, `ristorante (m)`],
  [`кафе́`, `ka-FE`, `bar, caffè (n)`],
])}
<p><b>Falsi amici</b>: <b>магази́н</b> è il negozio (il magazzino è <b>склад</b> [SKLAT]); <b>кабине́т</b> è l'ufficio o lo studio, non la cabina; <b>апте́ка</b> è la farmacia.</p>
${vsec(`Trasporti`, [
  [`метро́`, `mit-RO`, `metropolitana (n)`],
  [`авто́бус`, `af-TO-bus`, `autobus (m)`],
  [`трамва́й`, `tram-VAI`, `tram (m)`],
  [`по́езд`, `PO-ist`, `treno (m)`],
  [`самолёт`, `sa-ma-LIOT`, `aereo (m)`],
  [`такси́`, `tak-SI`, `taxi (n)`],
  [`вокза́л`, `vak-ZAL`, `stazione ferroviaria (m)`],
  [`аэропо́рт`, `a-e-ra-PORT`, `aeroporto (m)`],
  [`остано́вка`, `as-ta-NOF-ka`, `fermata (f)`],
  [`ста́нция`, `STAN-tsy-ia`, `stazione (della metro) (f)`],
  [`биле́т`, `bi-LIET`, `biglietto (m)`],
])}
${vsec(`Acquisti`, [
  [`ско́лько сто́ит?`, `SKOL'-ka STO-it`, `quanto costa?`],
  [`до́рого`, `DO-ra-ga`, `caro, costoso`],
  [`дёшево`, `DIO-shy-va`, `a buon mercato`],
  [`рубль`, `RUBL'`, `rublo (m)`],
  [`ка́рта`, `KAR-ta`, `carta, tessera (f)`],
  [`чек`, `CEK`, `scontrino (m)`],
  [`Мне ну́жен...`, `mnie NU-zhyn`, `ho bisogno di (m)`],
  [`Мне нужна́...`, `mnie nuzh-NA`, `ho bisogno di (f)`],
  [`Мне нужны́...`, `mnie nuzh-NY`, `ho bisogno di (pl)`],
  [`Мне ну́жно...`, `mnie NUZH-na`, `devo / ho bisogno di + infinito`],
])}
<p>«Ho bisogno di...» concorda con la cosa necessaria: <b>Мне ну́жен биле́т.</b> [mnie NU-zhyn bi-LIET] (m), <b>Мне нужна́ ка́рта.</b> [mnie nuzh-NA KAR-ta] (f), <b>Мне нужны́ де́ньги.</b> [mnie nuzh-NY DIEN'-gi] (pl, «mi servono soldi»). Con un verbo si usa <b>Мне ну́жно</b>, che non cambia: <b>Мне ну́жно купи́ть биле́т.</b> [mnie NUZH-na ku-PIT' bi-LIET] (devo comprare un biglietto). Per i prezzi: <b>сто рубле́й</b> [STO rub-LIEI] (100 rubli), <b>два́дцать рубле́й</b>; dopo i numeri 5+ si usa il genitivo plurale <b>рубле́й</b>.</p>
${vsec(`Ristorante`, [
  [`меню́`, `mi-NIU`, `menu (n)`],
  [`официа́нт`, `a-fi-tsy-ANT`, `cameriere (m)`],
  [`счёт`, `SHSHOT`, `conto (m)`],
  [`Я хочу́...`, `ia ha-CIU`, `voglio...`],
  [`Мо́жно меню́?`, `MOZH-na mi-NIU`, `posso avere il menu?`],
  [`Счёт, пожа́луйста.`, `SHSHOT pa-ZHA-lus-ta`, `il conto, per favore`],
  [`Прия́тного аппети́та!`, `pri-IAT-na-va a-pi-TI-ta`, `buon appetito!`],
])}
${vsec(`Indicazioni`, [
  [`напра́во`, `na-PRA-va`, `a destra`],
  [`нале́во`, `na-LIE-va`, `a sinistra`],
  [`пря́мо`, `PRIA-ma`, `dritto`],
  [`далеко́`, `da-li-KO`, `lontano`],
  [`недалеко́`, `ni-da-li-KO`, `non lontano`],
  [`ря́дом`, `RIA-dam`, `vicino`],
  [`здесь`, `ZDIES'`, `qui`],
  [`там`, `TAM`, `là`],
  [`Как пройти́ в...?`, `kak prai-TI v`, `come si arriva a...?`],
  [`Где нахо́дится...?`, `GDIE na-HO-di-tsa`, `dov'è...?`],
])}
<p>Esempi: <b>Извини́те, где нахо́дится вокза́л?</b> [iz-vi-NI-tie GDIE na-HO-di-tsa vak-ZAL] — <b>Иди́те пря́мо, пото́м напра́во.</b> [i-DI-tie PRIA-ma pa-TOM na-PRA-va]. <b>Как пройти́ в музе́й?</b> [kak prai-TI v mu-ZIEI].</p>
${vsec(`Emergenze`, [
  [`Помоги́те!`, `pa-ma-GHI-tie`, `aiuto!`],
  [`по́мощь`, `PO-mashsh`, `aiuto (f)`],
  [`скора́я по́мощь`, `ska-RA-ia PO-mashsh`, `ambulanza (pronto soccorso)`],
  [`врач`, `VRAC`, `medico (m)`],
  [`поли́ция`, `pa-LI-tsy-ia`, `polizia (f)`],
  [`па́спорт`, `PA-spart`, `passaporto (m)`],
  [`Мне пло́хо.`, `mnie PLO-ha`, `sto male`],
  [`У меня́ боли́т голова́.`, `u mi-NIA ba-LIT ga-la-VA`, `mi fa male la testa`],
  [`Вы́зовите врача́!`, `VY-za-vi-tie vra-CIA`, `chiami un medico!`],
  [`Вы́зовите ско́рую!`, `VY-za-vi-tie SKO-ru-iu`, `chiami l'ambulanza!`],
  [`Я потеря́л па́спорт.`, `ia pa-ti-RIAL PA-spart`, `ho perso il passaporto (uomo)`],
])}
<p><b>Помоги́те!</b> è l'imperativo con вы di «aiutare», adatto a chiunque. Il numero di emergenza unico nella Federazione Russa è, secondo le fonti ufficiali, il <b>112</b>; restano in uso anche i vecchi <b>101</b> (vigili del fuoco), <b>102</b> (polizia) e <b>103</b> (ambulanza). Prima di partire verifica i numeri aggiornati su Viaggiare Sicuri, il sito della Farnesina. I perfettivi con <b>вы-</b> hanno l'accento sul prefisso: <b>Вы́зовите</b>, non «вызови́те». Una donna dice <b>Я потеря́ла</b> [ia pa-ti-RIA-la].</p>
<h3>In sintesi</h3>
<p>Fai domande con <b>Где...?</b> e <b>Как пройти́...?</b>; ordina con <b>Я хочу́...</b> e <b>Мо́жно...?</b>; chiedi i prezzi con <b>Ско́лько сто́ит?</b>. Attenzione ai falsi amici (магази́н, кабине́т) e al concordare «ho bisogno di» con il genere della cosa.</p>
<div class="say"><b>Da dire.</b> «Извини́те, где метро́? — Иди́те пря́мо.» [iz-vi-NI-tie GDIE mit-RO. i-DI-tie PRIA-ma]</div>`,
  [
    q(
      'q1',
      `Come si dice «a destra»?`,
      [`напра́во`, `нале́во`, `пря́мо`, `ря́дом`],
      0,
      `Напра́во significa a destra; нале́во a sinistra, пря́мо dritto e ря́дом vicino.`,
    ),
    q(
      'q2',
      `Che cosa significa «апте́ка»?`,
      [`farmacia`, `biblioteca`, `panetteria`, `ospedale`],
      0,
      `Апте́ка è la farmacia; l'ospedale si dice больни́ца e un negozio generico è магази́н.`,
    ),
    q(
      'q3',
      `Che cosa significa «биле́т»?`,
      [`biglietto`, `bilancio`, `libro`, `stazione`],
      0,
      `Биле́т è il biglietto, che si chiede con Мне ну́жен биле́т; la stazione è вокза́л.`,
    ),
    q(
      'q4',
      `Come si chiede aiuto in modo formale?`,
      [`Помоги́те!`, `Спаси́бо!`, `Приве́т!`, `Пока́!`],
      0,
      `Помоги́те è l'imperativo con вы di помо́чь, usato per chiedere aiuto a chiunque.`,
    ),
    q(
      'q5',
      `Come si chiede il conto al ristorante?`,
      [`Счёт, пожа́луйста.`, `Меню́, пожа́луйста.`, `Биле́т, пожа́луйста.`, `Ключ, пожа́луйста.`],
      0,
      `Счёт è il conto: Счёт, пожа́луйста. Меню́ è invece il menu e биле́т il biglietto.`,
    ),
    q(
      'q6',
      `Che cosa significa «ря́дом»?`,
      [`vicino`, `lontano`, `dopo`, `davanti`],
      0,
      `Ря́дом significa vicino; lontano è далеко́ e «non lontano» è недалеко́.`,
    ),
    q(
      'q7',
      `Quale parola indica la fermata dell'autobus?`,
      [`остано́вка`, `вокза́л`, `ста́нция`, `аэропо́рт`],
      0,
      `Остано́вка è la fermata di autobus e tram; ста́нция è la stazione della metropolitana.`,
    ),
    q(
      'q8',
      `Che cosa significa «дорого́й» o «до́рого»?`,
      [`caro, costoso`, `economico`, `grande`, `buono`],
      0,
      `Дорого́й e до́рого indicano un prezzo alto; l'opposto è дёшево, a buon mercato.`,
    ),
    q(
      'q9',
      `Come si dice «Mi servono dei soldi»?`,
      [`Мне нужны́ де́ньги.`, `Мне ну́жен де́ньги.`, `Мне нужна́ де́ньги.`, `Я нужны́ де́ньги.`],
      0,
      `Ну́жен si accorda con la cosa necessaria: де́ньги è plurale, quindi нужны́; la persona sta al dativo мне.`,
    ),
    q(
      'q10',
      `Quale forma ha l'accento giusto per «chiami un medico!»?`,
      [`Вы́зовите врача́!`, `Вызови́те врача́!`, `Вызовите́ врача́!`, `Вызо́вите врача́!`],
      0,
      `I perfettivi con il prefisso вы- portano l'accento sul prefisso: Вы́зовите [VY-za-vi-tie].`,
    ),
    q(
      'q11',
      `Quale numero di emergenza è unico in Russia, secondo le fonti ufficiali?`,
      [`112`, `911`, `118`, `999`],
      0,
      `Il 112 è il numero unico; 101, 102 e 103 (fuoco, polizia, ambulanza) restano in uso accanto al 112.`,
    ),
  ],
  [
    card('c1', `Luoghi`, `го́род, у́лица, пло́щадь, центр, мост, парк, магази́н, ры́нок, апте́ка, банк, по́чта, больни́ца.`),
    card('c2', `Trasporti`, `метро́, авто́бус, трамва́й, по́езд, самолёт, такси́, вокза́л, аэропо́рт, остано́вка, биле́т.`),
    card('c3', `Prezzi`, `Ско́лько сто́ит? до́рого, дёшево, рубль, ка́рта, чек. Мне ну́жен (m) / Мне нужна́ (f).`),
    card('c4', `Ristorante`, `меню́, официа́нт, счёт; Я хочу́...; Мо́жно меню́? Счёт, пожа́луйста; Прия́тного аппети́та!`),
    card('c5', `Direzioni`, `напра́во, нале́во, пря́мо, далеко́, недалеко́, ря́дом, здесь, там.`),
    card('c6', `Chiedere la strada`, `Извини́те, где...? Как пройти́ в...? Иди́те пря́мо, пото́м напра́во.`),
    card('c7', `Emergenze`, `Помоги́те! по́мощь, скора́я по́мощь, врач, поли́ция, Мне пло́хо. У меня́ боли́т...`),
    card(
      'c8',
      `Falsi amici`,
      `магази́н = negozio (magazzino = склад); кабине́т = ufficio; арти́ст = attore; фами́лия = cognome.`,
    ),
    card(
      'c9',
      `Мне ну́жно / нужны́`,
      `Мне ну́жно + infinito (devo). Мне ну́жен (m), нужна́ (f), ну́жно (n), нужны́ (pl) + cosa. Мне нужны́ де́ньги.`,
    ),
    card(
      'c10',
      `Numeri di emergenza`,
      `112 (unico), 101 (fuoco), 102 (polizia), 103 (ambulanza). Вы́зовите врача́! Вы́зовите ско́рую!`,
    ),
  ],
  [
    prac(
      `p1`,
      `Chiedi come arrivare alla stazione e rispondi «dritto, poi a destra».`,
      `Извини́те, как пройти́ на вокза́л? [iz-vi-NI-tie kak prai-TI na vak-ZAL] — Иди́те пря́мо, пото́м напра́во. [i-DI-tie PRIA-ma pa-TOM na-PRA-va].`,
    ),
    prac(
      `p2`,
      `Chiedi il prezzo e di' che è caro.`,
      `Ско́лько э́то сто́ит? [SKOL'-ka E-ta STO-it] — Э́то до́рого! [E-ta DO-ra-ga]`,
    ),
    prac(
      `p3`,
      `Ordina «un caffè e il conto» in modo educato.`,
      `Ко́фе, пожа́луйста. [KO-fie pa-ZHA-lus-ta] — Счёт, пожа́луйста. [SHSHOT pa-ZHA-lus-ta]. Con Мо́жно: Мо́жно ко́фе?`,
    ),
    prac(
      `p4`,
      `Dì che stai male e che ti fa male la testa.`,
      `Мне пло́хо. У меня́ боли́т голова́. [mnie PLO-ha. u mi-NIA ba-LIT ga-la-VA]`,
    ),
    prac(
      `p5`,
      `Traduci: «Ho bisogno di un biglietto» e «Ho bisogno di una carta».`,
      `Мне ну́жен биле́т. [mnie NU-zhyn bi-LIET] — Мне нужна́ ка́рта. [mnie nuzh-NA KAR-ta]. Ну́жен (m) / нужна́ (f) concordano con la cosa.`,
    ),
    prac(
      `p6`,
      `Dì: «Devo comprare un biglietto» e «Mi servono i documenti» (докуме́нты, pl: usa нужны́ come per де́ньги).`,
      `Мне ну́жно купи́ть биле́т. [mnie NUZH-na ku-PIT' bi-LIET] — Мне нужны́ докуме́нты. [mnie nuzh-NY da-ku-MIEN-ty]. Ну́жно + infinito non cambia; нужны́ concorda con il plurale.`,
    ),
  ],
)

export const russoB: CourseModule[] = [ruVocVita, ruVocCitta]
