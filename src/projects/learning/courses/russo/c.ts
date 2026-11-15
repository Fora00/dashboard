import type { CourseModule } from '../../types'
import { card, mod, prac, q } from '../kit'
import { PRON_SHORT } from './pron'

// Russian course, drill group: model dialogues and the TORFL A1 exam module. Pronunciation: see pron.ts.

const dlg = (title: string, rows: [string, string, string, string][]): string =>
  `<h3>${title}</h3><table><tr><th>Russo</th><th>Pronuncia</th><th>Italiano</th></tr>${rows
    .map(([who, ru, pr, it]) => `<tr><td><b>${who}</b> ${ru}</td><td>[${pr}]</td><td>${it}</td></tr>`)
    .join('')}</table>`

export const ruDialoghi = mod(
  'ru-dialoghi',
  `Dialoghi modello per situazione`,
  `Otto dialoghi con russo, pronuncia e traduzione: conoscersi, al bar, in libreria, indicazioni, dal medico, in stazione, con un amico, in albergo`,
  'drill',
  `<p class="lead">Otto dialoghi brevi per usare tutto ciò che hai imparato. Leggili ad alta voce con la pronuncia accanto, poi coprili e prova a ricostruirli. Con gli sconosciuti si usa <b>вы</b>: sette dialoghi su otto sono formali; il settimo è tra amici (<b>ты</b>).</p>
${PRON_SHORT}
${dlg(`1. Primo incontro`, [
  ['Marco:', 'Здра́вствуйте! Меня́ зову́т Ма́рко.', 'ZDRA-stvui-tie. mi-NIA za-VUT MAR-ka', 'Buongiorno! Mi chiamo Marco.'],
  [
    'Anna:',
    'О́чень прия́тно. Меня́ зову́т А́нна.',
    `O-cin' pri-IAT-na. mi-NIA za-VUT AN-na`,
    'Molto piacere. Mi chiamo Anna.',
  ],
  ['Marco:', 'Вы из Москвы́?', 'vy iz mas-KVY', 'Lei è di Mosca?'],
  ['Anna:', 'Да, я из Москвы́. А вы?', 'DA ia iz mas-KVY. a VY', 'Sì, sono di Mosca. E Lei?'],
  ['Marco:', 'Я из Ита́лии, из Ри́ма.', 'ia iz i-TA-li-i iz RI-ma', 'Vengo dall’Italia, da Roma.'],
  ['Anna:', 'Вы хорошо́ говори́те по-ру́сски!', 'vy ha-ra-SHO ga-va-RI-tie pa-RUS-ski', 'Parla bene russo!'],
  ['Marco:', 'Спаси́бо, но я ещё учу́сь.', `spa-SSI-ba no ia i-SHSHO u-CIUS'`, 'Grazie, ma sto ancora imparando.'],
])}
<p><b>Da notare</b>: <b>из</b> + genitivo indica la provenienza (<b>из Москвы́</b>, <b>из Ри́ма</b>); <b>вы</b> è formale; <b>ещё</b> significa «ancora».</p>
${dlg(`2. Al bar`, [
  ['Cameriere:', 'Здра́вствуйте! Что вы бу́дете?', 'ZDRA-stvui-tie. SHTO vy BU-di-tie', 'Buongiorno! Cosa prende?'],
  [
    'Marco:',
    'Мне ко́фе и во́ду, пожа́луйста.',
    'mnie KO-fie i VO-du pa-ZHA-lus-ta',
    'Per me un caffè e dell’acqua, per favore.',
  ],
  ['Cameriere:', 'Э́то всё?', 'E-ta FSIO', 'È tutto?'],
  [
    'Marco:',
    'Да, э́то всё. Счёт, пожа́луйста.',
    'DA E-ta FSIO. SHSHOT pa-ZHA-lus-ta',
    'Sì, è tutto. Il conto, per favore.',
  ],
  ['Cameriere:', 'Сто пятьдеся́т рубле́й.', 'STO pid-di-SIAT rub-LIEI', 'Centocinquanta rubli.'],
  ['Marco:', 'Вот, пожа́луйста. Спаси́бо!', 'VOT pa-ZHA-lus-ta. spa-SSI-ba', 'Ecco. Grazie!'],
])}
<p><b>Da notare</b>: <b>Мне</b> + cosa ordinata è la formula naturale al bar («per me...»; in alternativa <b>Мо́жно ко́фе?</b>), <b>Я хочу́...</b> è corretto ma più brusco; <b>во́ду</b> è l'accusativo; <b>Вот</b> significa «ecco»; i prezzi con 5 o più usano <b>рубле́й</b>.</p>
${dlg(`3. In libreria`, [
  [
    'Marco:',
    'Скажи́те, пожа́луйста, ско́лько сто́ит э́та кни́га?',
    `ska-ZHY-tie pa-ZHA-lus-ta SKOL'-ka STO-it E-ta KNI-ga`,
    'Mi dica, per favore, quanto costa questo libro?',
  ],
  ['Commesso:', 'Три́ста рубле́й.', 'TRI-sta rub-LIEI', 'Trecento rubli.'],
  [
    'Marco:',
    'Э́то до́рого! А есть подеше́вле?',
    `E-ta DO-ra-ga. a IEST' pa-di-SHEV-lie`,
    'È caro! Ne ha uno più economico?',
  ],
  [
    'Commesso:',
    'Да, вот э́та. Э́та сто́ит сто рубле́й.',
    'DA VOT E-ta. E-ta STO-it STO rub-LIEI',
    'Sì, questo. Questo costa cento rubli.',
  ],
  ['Marco:', 'Хорошо́, я возьму́ э́ту.', `ha-ra-SHO ia vaz'-MU E-tu`, 'Bene, prendo questo.'],
])}
<p><b>Da notare</b>: <b>А есть подеше́вле?</b> chiede un'alternativa più economica (<b>подеше́вле</b> = «un po' più a buon mercato», da capire); <b>э́ту</b> è l'accusativo femminile di <b>э́та</b>; <b>Я возьму́</b> = «prendo», dal perfettivo di <b>брать</b>.</p>
${dlg(`4. Chiedere la strada`, [
  [
    'Marco:',
    'Извини́те, где нахо́дится вокза́л?',
    'iz-vi-NI-tie GDIE na-HO-di-tsa vak-ZAL',
    'Mi scusi, dov’è la stazione?',
  ],
  ['Passante:', 'Иди́те пря́мо, пото́м напра́во.', 'i-DI-tie PRIA-ma pa-TOM na-PRA-va', 'Vada dritto, poi a destra.'],
  ['Marco:', 'Э́то далеко́?', 'E-ta da-li-KO', 'È lontano?'],
  [
    'Passante:',
    'Нет, ря́дом. Пять мину́т пешко́м.',
    `NIET RIA-dam. PIAT' mi-NUT pish-KOM`,
    'No, è vicino. Cinque minuti a piedi.',
  ],
  ['Marco:', 'Большо́е спаси́бо!', `bal'-SHO-ia spa-SSI-ba`, 'Grazie mille!'],
  ['Passante:', 'Пожа́луйста!', 'pa-ZHA-lus-ta', 'Prego!'],
])}
<p><b>Da notare</b>: <b>Иди́те</b> è l'imperativo con вы di идти́; <b>мину́т</b> è il genitivo plurale dopo пять; <b>пешко́м</b> = a piedi.</p>
${dlg(`5. Dal medico`, [
  [
    'Marco:',
    'Здра́вствуйте! Мне пло́хо. У меня́ боли́т голова́.',
    'ZDRA-stvui-tie. mnie PLO-ha. u mi-NIA ba-LIT ga-la-VA',
    'Buongiorno! Sto male. Mi fa male la testa.',
  ],
  ['Medico:', 'У вас температу́ра?', 'u VAS tim-pi-ra-TU-ra', 'Ha la febbre?'],
  ['Marco:', 'Да, немно́го.', 'DA nim-NO-ga', 'Sì, un po’.'],
  ['Medico:', 'Вам ну́жно лека́рство.', 'vam NUZH-na li-KAR-stva', 'Le serve una medicina.'],
  ['Marco:', 'Спаси́бо, до свида́ния.', 'spa-SSI-ba da svi-DA-ni-ia', 'Grazie, arrivederci.'],
])}
<p><b>Da notare</b>: <b>Мне пло́хо</b> (a me è male); <b>У меня́ боли́т...</b> = «mi fa male...»; <b>Вам ну́жно...</b> = «a Lei serve...».</p>
${dlg(`6. In stazione`, [
  [
    'Marco:',
    'Здра́вствуйте! Мне ну́жен биле́т до Москвы́.',
    'ZDRA-stvui-tie mnie NU-zhyn bi-LIET da mas-KVY',
    'Buongiorno! Mi serve un biglietto per Mosca.',
  ],
  ['Cassiere:', 'На како́е число́?', 'na ka-KO-ia cis-LO', 'Per che data?'],
  ['Marco:', 'На за́втра.', 'na ZAF-tra', 'Per domani.'],
  [
    'Cassiere:',
    'Вот биле́т. По́езд отхо́дит в во́семь часо́в.',
    `VOT bi-LIET PO-ist at-HO-dit v VO-sim' ci-SOF`,
    'Ecco il biglietto. Il treno parte alle otto.',
  ],
  ['Marco:', 'Спаси́бо! До свида́ния!', 'spa-SSI-ba da svi-DA-ni-ia', 'Grazie! Arrivederci!'],
])}
<p><b>Da notare</b>: <b>до</b> + genitivo = «fino a» (<b>до Москвы́</b>); <b>на</b> + accusativo per la data; <b>в во́семь часо́в</b> = alle otto.</p>
${dlg(`7. Con un amico (ты)`, [
  ['Marco:', 'Приве́т, А́нна! Как дела́?', 'pri-VIET AN-na. kak di-LA', 'Ciao, Anna! Come va?'],
  ['Anna:', 'Хорошо́, спаси́бо. А у тебя́?', 'ha-ra-SHO spa-SSI-ba. a u ti-BIA', 'Bene, grazie. E tu?'],
  [
    'Marco:',
    'То́же хорошо́. Что ты де́лаешь сего́дня?',
    'TO-zhy ha-ra-SHO. SHTO ty DIE-la-ish si-VOD-nia',
    'Bene anch’io. Che cosa fai oggi?',
  ],
  ['Anna:', 'Ничего́ осо́бенного.', 'ni-ci-VO a-SO-bin-na-va', 'Niente di speciale.'],
  [
    'Marco:',
    'Пойдём в кино́? Сего́дня идёт но́вый фильм.',
    `pai-DIOM f ki-NO. si-VOD-nia i-DIOT NO-vyi FIL'M`,
    'Andiamo al cinema? Oggi danno un film nuovo.',
  ],
  ['Anna:', 'Отли́чно! Во ско́лько?', `at-LIC-na. va SKOL'-ka`, 'Ottimo! A che ora?'],
  ['Marco:', 'В семь часо́в. Хорошо́?', `f SIEM' ci-SOF. ha-ra-SHO`, 'Alle sette. Va bene?'],
  ['Anna:', 'Хорошо́! До ве́чера!', 'ha-ra-SHO. da VIE-ci-ra', 'Va bene! A stasera!'],
])}
<p><b>Da notare</b>: tra amici si usa <b>ты</b> (<b>А у тебя́?</b>, <b>Что ты де́лаешь?</b>); <b>Пойдём в кино́?</b> è un invito; <b>идёт фильм</b> = «danno un film»; <b>До ве́чера!</b> = «a stasera».</p>
${dlg(`8. In albergo`, [
  [
    'Marco:',
    'Здра́вствуйте! У вас есть свобо́дный но́мер?',
    `ZDRA-stvui-tie. u VAS IEST' sva-BOD-nyi NO-mir`,
    'Buongiorno! Avete una camera libera?',
  ],
  ['Receptionist:', 'Да. На ско́лько дней?', `DA. na SKOL'-ka DNIEI`, 'Sì. Per quanti giorni?'],
  [
    'Marco:',
    'На три дня. Ско́лько сто́ит но́мер?',
    `na tri DNIA. SKOL'-ka STO-it NO-mir`,
    'Per tre giorni. Quanto costa la camera?',
  ],
  [
    'Receptionist:',
    'Ты́сяча пятьсо́т рубле́й за ночь.',
    `TY-si-cia pit-SOT rub-LIEI za NOC'`,
    'Millecinquecento rubli a notte.',
  ],
  ['Marco:', 'Хорошо́. Вот мой па́спорт.', 'ha-ra-SHO. VOT MOI PA-spart', 'Bene. Ecco il mio passaporto.'],
  [
    'Receptionist:',
    'Спаси́бо. Ваш но́мер три́ста пять, тре́тий эта́ж.',
    `spa-SSI-ba. VASH NO-mir TRI-sta PIAT' TRIE-tii i-TASH`,
    'Grazie. La sua camera è la 305, secondo piano (in Russia: тре́тий эта́ж).',
  ],
  ['Marco:', 'Где за́втрак?', 'GDIE ZAF-trak', 'Dov’è la colazione?'],
  ['Receptionist:', 'За́втрак на пе́рвом этаже́.', 'ZAF-trak na PIER-vam i-ta-ZHE', 'La colazione è al piano terra.'],
])}
<p><b>Da notare</b>: <b>на три дня</b> (2-4 + genitivo singolare) e <b>на ско́лько дней</b> (genitivo plurale); il numero 305 si dice <b>три́ста пять</b>; <b>на пе́рвом этаже́</b> = «al piano terra» (ordinale + prepositivo). In Russia il <b>пе́рвый эта́ж</b> è il piano terra: si conta da terra, quindi il тре́тий эта́ж è il secondo piano italiano.</p>
<h3>Come usarli</h3>
<p>Leggi ogni dialogo tre volte: prima con il testo italiano, poi solo con la pronuncia, infine a voce alta senza guardare. Cambia i dettagli (nome, città, prezzo, ora). Registra la tua voce se puoi e confrontala con la voce russa dell'iPhone (Impostazioni > Accessibilità > Contenuto letto ad alta voce).</p>`,
  [
    q(
      'q1',
      `Come si dice «Mi chiamo Marco»?`,
      [`Меня́ зову́т Ма́рко.`, `Я зову́т Ма́рко.`, `Моё зову́т Ма́рко.`, `Тебя́ зову́т Ма́рко.`],
      0,
      `La formula fissa è Меня́ зову́т + nome; меня́ è l'accusativo di я, letteralmente «mi chiamano».`,
    ),
    q(
      'q2',
      `Che cosa significa «Вот, пожа́луйста»?`,
      [`Ecco, prego.`, `Dov'è, per favore?`, `Quanto costa?`, `Arrivederci.`],
      0,
      `Вот è «ecco» e пожа́луйста è «prego»: la frase accompagna un oggetto o un pagamento.`,
    ),
    q(
      'q3',
      `Come si chiede dov'è la stazione?`,
      [`Где нахо́дится вокза́л?`, `Куда́ вокза́л?`, `Кто вокза́л?`, `Что вокза́л?`],
      0,
      `Где нахо́дится è la formula standard per «dov'è»; куда́ chiede la direzione e кто/что sono pronomi diversi.`,
    ),
    q(
      'q4',
      `Che cosa significa «Мне пло́хо»?`,
      [`Sto male.`, `Ho fame.`, `Ho freddo.`, `Sono felice.`],
      0,
      `Пло́хо è «male»: Мне пло́хо significa che non ci si sente bene, ed è la formula per dire che si sta male.`,
    ),
    q(
      'q5',
      `Con quale pronome ci si rivolge a uno sconosciuto in tutti questi dialoghi?`,
      [`вы`, `ты`, `он`, `они́`],
      0,
      `Вы è il registro formale (Lei) e il plurale: serve con persone che non si conoscono.`,
    ),
    q(
      'q6',
      `Come si dice «Il conto, per favore»?`,
      [`Счёт, пожа́луйста.`, `Меню́, пожа́луйста.`, `Вода́, пожа́луйста.`, `Биле́т, пожа́луйста.`],
      0,
      `Счёт è il conto al ristorante; меню́ è il menu e биле́т il biglietto, quindi la frase giusta è Счёт, пожа́луйста.`,
    ),
    q(
      'q7',
      `Che cosa significa «пешко́м»?`,
      [`a piedi`, `in autobus`, `in taxi`, `in bici`],
      0,
      `Пешко́м è l'avverbio «a piedi»; per i mezzi si usa invece на + prepositivo.`,
    ),
    q(
      'q8',
      `Come si dice «alle otto» (ora di partenza)?`,
      [`в во́семь часо́в`, `в во́семь часа́`, `на во́семь час`, `до во́семь часо́в`],
      0,
      `Dopo 5 e oltre «ora» ha la forma часо́в, e l'ora si indica con в + numero.`,
    ),
    q(
      'q9',
      `Come chiedi in albergo se c'è una camera libera?`,
      [
        `У вас есть свобо́дный но́мер?`,
        `Вы есть свобо́дный но́мер?`,
        `У вас нет свобо́дный но́мер?`,
        `Я есть свобо́дный но́мер?`,
      ],
      0,
      `Avere si dice у + genitivo + есть: У вас есть, letteralmente «presso di voi c'è», seguito dalla cosa cercata.`,
    ),
    q(
      'q10',
      `Come chiedi se c'è qualcosa di più economico?`,
      [`А есть подеше́вле?`, `А есть подо́льше?`, `А есть побыстре́е?`, `А есть попро́ще?`],
      0,
      `Подеше́вле indica un prezzo più basso; подо́льше, побыстре́е e попро́ще significano più a lungo, più in fretta, più semplice.`,
    ),
    q(
      'q11',
      `Che cosa significa «До ве́чера!»?`,
      [`A stasera!`, `Buonanotte!`, `Buongiorno!`, `Arrivederci a domani!`],
      0,
      `До ве́чера si dice a un amico che rivedrai la sera stessa: è un saluto informale tra persone che si danno appuntamento.`,
    ),
  ],
  [
    card('c1', `Presentarsi`, `Меня́ зову́т... Я из Ита́лии. О́чень прия́тно. Вы говори́те по-ру́сски?`),
    card('c2', `Al bar`, `Мне ко́фе и во́ду, пожа́луйста. Э́то всё? Счёт, пожа́луйста. Вот, пожа́луйста.`),
    card('c3', `Prezzi`, `Ско́лько сто́ит? Э́то до́рого! А есть подеше́вле? Я возьму́ э́ту.`),
    card('c4', `Strada`, `Где нахо́дится...? Иди́те пря́мо, пото́м напра́во. Недалеко́. Ря́дом.`),
    card('c5', `Salute`, `Мне пло́хо. У меня́ боли́т голова́. У вас температу́ра? Вам ну́жно лека́рство.`),
    card('c6', `Biglietti`, `Мне ну́жен биле́т до Москвы́. На како́е число́? На за́втра. По́езд отхо́дит в во́семь часо́в.`),
    card('c7', `Cortesia`, `Извини́те, пожа́луйста, спаси́бо, до свида́ния: sempre con вы in situazioni formali.`),
    card('c8', `Domanda sì/no`, `Stessa frase, voce che sale: Э́то всё? Э́то далеко́?`),
    card(
      'c9',
      `Con un amico (ты)`,
      `Приве́т! Как дела́? А у тебя́? Что ты де́лаешь сего́дня? Пойдём в кино́? Во ско́лько? До ве́чера!`,
    ),
    card(
      'c10',
      `In albergo`,
      `У вас есть свобо́дный но́мер? На ско́лько дней? Ско́лько сто́ит? Вот мой па́спорт. Где за́втрак?`,
    ),
  ],
  [
    prac(
      `p1`,
      `Ricostruisci dalla memoria il dialogo «Al bar» (4 battute).`,
      `Здра́вствуйте! Что вы бу́дете? — Мне ко́фе, пожа́луйста. — Э́то всё? — Да. Счёт, пожа́луйста. [ZDRA-stvui-tie SHTO vy BU-di-tie ...]`,
    ),
    prac(
      `p2`,
      `Scrivi un dialogo di 4 battute per comprare un biglietto del treno per domani.`,
      `Здра́вствуйте! Мне ну́жен биле́т до Ри́ма. — На како́е число́? — На за́втра. — Вот биле́т, пожа́луйста. Esempio: usa до + genitivo e на за́втра.`,
    ),
    prac(
      `p3`,
      `Cambia il dialogo «Primo incontro» con la tua città e il tuo nome.`,
      `Меня́ зову́т (il tuo nome). Я из (la tua città). Я живу́ в (città al prepositivo). Usa из + genitivo e в + prepositivo (Рим → в Ри́ме).`,
    ),
    prac(
      `p4`,
      `Chiedi la strada per il museo e per la farmacia.`,
      `Извини́те, где музе́й? Как пройти́ в апте́ку? [iz-vi-NI-tie GDIE mu-ZIEI kak prai-TI v ap-TIE-ku]. Risposta: Иди́те пря́мо, пото́м напра́во.`,
    ),
    prac(
      `p5`,
      `Spiega al medico che ti fa male la testa e che hai la febbre.`,
      `У меня́ боли́т голова́. У меня́ температу́ра. [u mi-NIA ba-LIT ga-la-VA. u mi-NIA tim-pi-ra-TU-ra]`,
    ),
    prac(
      `p6`,
      `Scrivi un dialogo di 4 battute con un amico (ты): lo inviti al cinema e fissate l'ora.`,
      `Приве́т! Пойдём в кино́? — Отли́чно! Во ско́лько? — В семь часо́в. — Хорошо́, до ве́чера! [pri-VIET pai-DIOM f ki-NO ... f SIEM' ci-SOF]. Con un amico si usa ты, mai вы.`,
    ),
  ],
)

export const ruEsame = mod(
  'ru-esame',
  `Preparazione all'esame TORFL A1 (TEU) e traduzioni`,
  `Formato indicativo, strategie, errori tipici di chi parla italiano, modello di scrittura A1, 40 domande e traduzioni IT→RU e RU→IT`,
  'drill',
  `<p class="lead">Il livello A1 del QCER corrisponde al livello <b>Элемента́рный</b> [e-li-min-TAR-nyi] del TORFL (ТРКИ in russo, «Test di russo come lingua straniera»), che molti chiamano TEU. Il corso copre il lessico e la grammatica di questo livello; qui trovi formato, strategie e prove di allenamento.</p>
${PRON_SHORT}
<h3>Formato (indicativo: controlla sempre il sito dell'ente)</h3>
<p>L'esame è diviso in <b>cinque sottoprove</b>: lessico e grammatica, lettura, scrittura, ascolto, parlato. Le prove scritte sono su carta, la prova orale con un esaminatore; il superamento richiede in genere circa il <b>66% in ogni sottoprova</b>, ma durata, numero di esercizi e soglie possono cambiare tra enti (università, centri accreditati). <b>Verifica sul sito ufficiale dell'ente certificatore</b> e nell'ultimo programma pubblicato prima di iscriverti: queste indicazioni sono generali, non vincolanti.</p>
<h3>Che cosa devi saper fare a A1</h3>
<ul><li>Leggere e scrivere in cirillico, anche a mano.</li><li>Presentarti, chiedere e dire nome, nazionalità, età, professione, famiglia.</li><li>Fare e capire domande semplici su casa, tempo, acquisti, orari, direzioni.</li><li>Usare presente, passato semplice e futuro con бу́ду; nominativo, accusativo e prepositivo singolare.</li><li>Capire testi molto brevi (annunci, orari, messaggi) e scrivere frasi semplici o una cartolina.</li></ul>
<h3>Strategie per le prove</h3>
<ul><li><b>Lessico e grammatica</b>: controlla genere e caso. Se hai dubbi, applica le regole: nominativo = soggetto, accusativo = oggetto o direzione, prepositivo = dove sono.</li><li><b>Lettura</b>: leggi prima le domande; cerca numeri, nomi e orari; non traduci parola per parola.</li><li><b>Scrittura</b>: frasi corte e certe. Scrivi quello che sai, controlla il genere del verbo al passato e la regola delle sette lettere.</li><li><b>Ascolto</b>: scrivi a margine cifre, nomi e giorni. Allena l'orecchio con il russo letto dalla voce di sistema dell'iPhone.</li><li><b>Parlato</b>: usa le formule dei dialoghi, parla lentamente, chiedi di ripetere: <b>Повтори́те, пожа́луйста.</b> [paf-ta-RI-tie pa-ZHA-lus-ta].</li></ul>
<h3>Errori tipici degli italiani da evitare</h3>
<table><tr><th>Errore</th><th>Corretto</th></tr>
<tr><td>Я есть студе́нт.</td><td>Я студе́нт. (nessun «essere» al presente)</td></tr>
<tr><td>Я чита́ла (uomo che parla)</td><td>Я чита́л. (il passato concorda con il sesso di chi parla)</td></tr>
<tr><td>Я ничего́ зна́ю.</td><td>Я ничего́ не зна́ю. (doppia negazione)</td></tr>
<tr><td>Я иду́ в Рим на по́езде.</td><td>Я е́ду в Рим на по́езде. (mezzo = е́хать)</td></tr>
<tr><td>Я в Москву́.</td><td>Я в Москве́. (stato in luogo = prepositivo)</td></tr>
<tr><td>«магази́н» usato per «magazzino»</td><td>магази́н = negozio, magazzino = склад</td></tr>
<tr><td>кни́гы</td><td>кни́ги (regola delle sette lettere)</td></tr>
<tr><td>Э́то не дом, но шко́ла.</td><td>Э́то не дом, а шко́ла. (dopo «non X» il «ma» è а)</td></tr>
<tr><td>Я два́дцать лет.</td><td>Мне два́дцать лет. (età con il dativo)</td></tr>
</table>
<h3>Esempio di lettura con domande</h3>
<p>Testo: <b>Меня́ зову́т А́нна. Я живу́ в Москве́. Моя́ семья́ больша́я: ма́ма, па́па и брат. Мой брат рабо́тает в ба́нке. Я студе́нтка, я учу́сь в университе́те.</b> [mi-NIA za-VUT AN-na. ia zhy-VU v mas-KVIE. ma-IA sim'-IA bal'-SHA-ia MA-ma PA-pa i BRAT. MOI BRAT ra-BO-ta-it v BAN-kie. ia stu-DIENT-ka ia u-CIUS' v u-ni-vir-si-TIE-tie]</p>
<ul><li>Dove vive Anna? (a Mosca)</li><li>Dove lavora suo fratello? (in banca)</li><li>Che cosa fa Anna? (è studentessa all'università)</li></ul>
<h3>Modello di scrittura A1: cartolina e modulo (анке́та)</h3>
<p>La prova di scrittura chiede di solito un messaggio breve o un modulo. Usa frasi corte e solo la grammatica che conosci. Struttura di una <b>cartolina</b>: saluto, dove sei, com'è il posto, che cosa fai ogni giorno, saluto finale.</p>
<ul><li><b>Приве́т, А́нна!</b> [pri-VIET AN-na]</li><li><b>Я в Ри́ме.</b> [ia v RI-mie]</li><li><b>Здесь хорошо́ и тепло́.</b> [ZDIES' ha-ra-SHO i tip-LO]</li><li><b>Мы живём в но́вой кварти́ре.</b> [my zhy-VIOM v NO-vai kvar-TI-rie]</li><li><b>Ка́ждый день я хожу́ в парк.</b> [KAZH-dyi DIEN' ia ha-ZHU f PARK]</li><li><b>Пока́!</b> [pa-KA] — <b>Ма́рко</b></li></ul>
<p>Una <b>анке́та</b> [an-KIE-ta] (il modulo con i tuoi dati) si compila con una parola o una frase per voce:</p>
<table><tr><th>Campo</th><th>Risposta</th></tr>
<tr><td>Фами́лия [fa-MI-li-ia] (cognome)</td><td>Ро́сси [RO-ssi]</td></tr>
<tr><td>И́мя [I-mia] (nome)</td><td>Ма́рко [MAR-ka]</td></tr>
<tr><td>Во́зраст [VOZ-rast] (età)</td><td>25 лет</td></tr>
<tr><td>Страна́ [stra-NA] (paese)</td><td>Ита́лия [i-TA-li-ia]</td></tr>
<tr><td>Профе́ссия [pra-FIE-ssi-ia]</td><td>студе́нт [stu-DIENT]</td></tr>
<tr><td>Родно́й язы́к [rad-NOI i-ZYK] (madrelingua)</td><td>италья́нский [i-tal'-IAN-skii]</td></tr>
</table>
<p>Prima di consegnare ricontrolla: genere del verbo al passato, <b>и</b> dopo г к х ж ч ш щ, caso dopo в/на, doppia negazione. Nei testi veri l'accento tonico non si scrive; qui c'è solo per studio.</p>
<h3>Allenamento di traduzione: schema</h3>
<p>Nelle sezioni <b>Esercizi</b> trovi traduzioni IT→RU e RU→IT. Per ogni frase: 1) trova il verbo e la persona; 2) scegli il caso; 3) metti l'accento e controlla la pronuncia tra [ ]. Se puoi, scrivi le risposte a mano su carta, per allenare anche il corsivo.</p>
<h3>In sintesi</h3>
<p>Obiettivi: cirillico sicuro, presente, passato con genere, tre casi, numeri e orario, formule di cortesia. Prima dell'esame: ripassa gli errori tipici, rifai gli otto dialoghi e le 40 domande del quiz.</p>
<div class="say"><b>Da dire.</b> «Мне ну́жно сдать экза́мен.» [mnie NUZH-na ZDAT' ig-ZA-min]</div>`,
  [
    q(
      'q1',
      `A quale livello QCER corrisponde il TORFL Элемента́рный?`,
      [`A1`, `A2`, `B1`, `C1`],
      0,
      `Il livello Элемента́рный del TORFL corrisponde all'A1 del QCER; il successivo, Ба́зовый, è A2.`,
    ),
    q(
      'q2',
      `Come si dice «Sono studente» (uomo)?`,
      [`Я студе́нт.`, `Я есть студе́нт.`, `Я студе́нтка.`, `Я студе́нтом.`],
      0,
      `Al presente non si usa il verbo essere, e per un uomo si dice студе́нт.`,
    ),
    q(
      'q3',
      `Qual è il plurale di «кни́га»?`,
      [`кни́ги`, `кни́гы`, `кни́гов`, `кни́га`],
      0,
      `Dopo г si scrive и e non ы secondo la regola delle sette lettere.`,
    ),
    q(
      'q4',
      `Come dice una donna «Ieri ho lavorato»?`,
      [`Вчера́ я рабо́тала.`, `Вчера́ я рабо́тал.`, `Вчера́ я рабо́таю.`, `Вчера́ я рабо́тали.`],
      0,
      `Il passato concorda con il sesso di chi parla: una donna usa -ла.`,
    ),
    q(
      'q5',
      `Come si dice «Non so niente»?`,
      [`Я ничего́ не зна́ю.`, `Я ничего́ зна́ю.`, `Я не зна́ю нет.`, `Я нет ничего́ зна́ю.`],
      0,
      `Con ни- serve anche не davanti al verbo: la doppia negazione è obbligatoria.`,
    ),
    q(
      'q6',
      `Come si dice «Ho una sorella»?`,
      [`У меня́ есть сестра́.`, `Я име́ю сестра́.`, `Я есть сестра́.`, `Мне сестра́ есть.`],
      0,
      `Il possesso si esprime con у + genitivo + есть: У меня́ есть сестра́.`,
    ),
    q(
      'q7',
      `Che genere ha «окно́»?`,
      [`neutro`, `maschile`, `femminile`, `plurale`],
      0,
      `Le parole in -о sono neutre: окно́ è neutro e il plurale è о́кна.`,
    ),
    q(
      'q8',
      `Quale caso si usa dopo «в» per dire «vado a scuola»?`,
      [`accusativo`, `prepositivo`, `genitivo`, `nominativo`],
      0,
      `Con la direzione (куда́) в richiede l'accusativo; per lo stato in luogo si usa il prepositivo.`,
    ),
    q(
      'q9',
      `Che cosa significa «Спаси́бо»?`,
      [`grazie`, `prego`, `scusi`, `ciao`],
      0,
      `Спаси́бо significa grazie, mentre пожа́луйста è prego o per favore.`,
    ),
    q(
      'q10',
      `Come si chiede «Come si chiama?» a una persona formale?`,
      [`Как вас зову́т?`, `Как тебя́ зову́т?`, `Кто вас зову́т?`, `Что вас зову́т?`],
      0,
      `Con il registro formale si usa вас, accusativo di вы; тебя́ è per ты.`,
    ),
    q(
      'q11',
      `Che numero è «двена́дцать»?`,
      [`12`, `20`, `2`, `22`],
      0,
      `Двена́дцать è 12 perché -на́дцать forma i numeri da 11 a 19; 20 è два́дцать.`,
    ),
    q(
      'q12',
      `Come si dice «alle cinque»?`,
      [`в пять часо́в`, `в пять часа́`, `в пять час`, `в пяти́ час`],
      0,
      `Con i numeri da 5 in su «ora» ha la forma часо́в.`,
    ),
    q(
      'q13',
      `Come si dice «Lui legge»?`,
      [`Он чита́ет.`, `Он чита́ешь.`, `Он чита́ют.`, `Он чита́ть.`],
      0,
      `La terza persona singolare della prima coniugazione termina in -ет.`,
    ),
    q(
      'q14',
      `Qual è il passato neutro di «быть»?`,
      [`бы́ло`, `был`, `была́`, `бы́ли`],
      0,
      `Il passato di быть è был, была́, бы́ло, бы́ли: il neutro è бы́ло.`,
    ),
    q(
      'q15',
      `Come si dice il mezzo in «Vado al lavoro in metropolitana»?`,
      [`на метро́`, `из метро́`, `к метро́`, `без метро́`],
      0,
      `Il mezzo di trasporto vuole на: на метро́, на авто́бусе, на такси́. В метро́ esiste, ma dice dove sei, non il mezzo.`,
    ),
    q(
      'q16',
      `Qual è l'accusativo di «сестра́»?`,
      [`сестру́`, `сестры́`, `сестре́`, `сестро́й`],
      0,
      `I femminili in -а prendono -у all'accusativo: сестру́.`,
    ),
    q(
      'q17',
      `Quale verbo usi per «ogni giorno vado a scuola a piedi»?`,
      [`ходи́ть`, `идти́`, `е́хать`, `е́здить`],
      0,
      `Per un'azione abituale a piedi serve ходи́ть: Я хожу́ в шко́лу ка́ждый день.`,
    ),
    q(
      'q18',
      `Che cosa significa «ко́мната»?`,
      [`stanza`, `comitato`, `compagnia`, `comodino`],
      0,
      `Ко́мната significa stanza; è un termine di casa, non un falso amico italiano.`,
    ),
    q(
      'q19',
      `Che cosa significa «Где нахо́дится вокза́л?»`,
      [`Dov'è la stazione?`, `Quando parte il treno?`, `Quanto costa il biglietto?`, `Chi è alla stazione?`],
      0,
      `Где нахо́дится significa «dov'è / dove si trova»; вокза́л è la stazione ferroviaria.`,
    ),
    q(
      'q20',
      `Quale lettera rappresenta una «i» con la lingua indietro?`,
      [`ы`, `и`, `й`, `ь`],
      0,
      `La ы è la vocale propria del russo: мы, ты, сын.`,
    ),
    q(
      'q21',
      `Come si distingue «за́мок» da «замо́к»?`,
      [`solo dall'accento`, `dall'ultima lettera`, `dal genere`, `dal numero`],
      0,
      `[ZA-mak] e [za-MOK] hanno le stesse lettere: l'accento tonico cambia il significato in castello o serratura.`,
    ),
    q(
      'q22',
      `Che cosa significa «фами́лия»?`,
      [`cognome`, `famiglia`, `fama`, `fiducia`],
      0,
      `Фами́лия è il cognome; la famiglia si dice семья́.`,
    ),
    q(
      'q23',
      `Come si dice «Mi serve un biglietto»?`,
      [`Мне ну́жен биле́т.`, `Мне ну́жна биле́т.`, `Я ну́жен биле́т.`, `У меня́ нет биле́т.`],
      0,
      `Мне ну́жен + nome maschile: биле́т è maschile, quindi ну́жен.`,
    ),
    q(
      'q24',
      `Come si legge «хорошо́»?`,
      [`[ha-ra-SHO]`, `[ho-ro-SHO]`, `[HO-ro-sho]`, `[ha-ra-shio]`],
      0,
      `Le о atone diventano a e la х è una h raschiata: [ha-ra-SHO].`,
    ),
    q(
      'q25',
      `Come chiedi a un amico «Quanti anni hai?»`,
      [`Ско́лько тебе́ лет?`, `Ско́лько у тебя́ лет?`, `Как тебе́ лет?`, `Кто тебе́ лет?`],
      0,
      `L'età si chiede con il dativo: Ско́лько тебе́ лет?, letteralmente «quanti a te anni?».`,
    ),
    q(
      'q26',
      `Che numero è «две́сти»?`,
      [`200`, `20`, `2000`, `12`],
      0,
      `Две́сти è 200; le centinaia sono сто, две́сти, три́ста, четы́реста, пятьсо́т e così via.`,
    ),
    q(
      'q27',
      `Come si dice «Oggi è il primo maggio»?`,
      [`Сего́дня пе́рвое ма́я.`, `Сего́дня пе́рвый ма́я.`, `Сего́дня оди́н ма́я.`, `Сего́дня пе́рвое май.`],
      0,
      `La data vuole l'ordinale neutro (пе́рвое, con число́ sottinteso) e il mese al genitivo: ма́я.`,
    ),
    q(
      'q28',
      `Come si dice «alle tre di notte»?`,
      [`в три часа́ но́чи`, `в три часо́в но́чи`, `в три час ночь`, `на три часа́ но́чи`],
      0,
      `Con 2-4 «ora» è часа́, e la parte del giorno va al genitivo: но́чи, ве́чера, утра́, дня.`,
    ),
    q(
      'q29',
      `Come si dice «di mercoledì»?`,
      [`в сре́ду`, `в среда́`, `в среду́`, `в сре́де`],
      0,
      `I giorni vogliono в + accusativo, e среда́ sposta l'accento sulla prima sillaba: в сре́ду.`,
    ),
    q(
      'q30',
      `Come si dice «Mi piace Mosca»?`,
      [`Мне нра́вится Москва́.`, `Я нра́вится Москва́.`, `Мне нра́вятся Москва́.`, `Меня́ нра́вится Москва́.`],
      0,
      `Chi prova piacere è al dativo (мне); ciò che piace è il soggetto e il verbo concorda con lui.`,
    ),
    q(
      'q31',
      `Che cosa significa «Мне на́до идти́»?`,
      [`Devo andare.`, `Voglio andare.`, `Posso andare.`, `Sono andato.`],
      0,
      `Мне на́до + infinito esprime un obbligo o un bisogno: «a me serve andare», cioè devo andare.`,
    ),
    q(
      'q32',
      `Come si dice «Faccio sport»?`,
      [`Я занима́юсь спо́ртом.`, `Я занима́юсь спорт.`, `Я занима́ю спо́ртом.`, `Я занима́юсь в спо́рте.`],
      0,
      `Занима́ться vuole lo strumentale: спо́ртом; il verbo ha -сь perché termina in vocale.`,
    ),
    q(
      'q33',
      `Come si dice «Scrivo una lettera»?`,
      [`Я пишу́ письмо́.`, `Я писа́ю письмо́.`, `Я пи́шу письмо́.`, `Я пишу́ пи́сьмо.`],
      0,
      `Писа́ть cambia la consonante (с → ш) già alla prima persona: пишу́. Anche il nome ha l'accento sul finale: письмо́.`,
    ),
    q(
      'q34',
      `Quale frase è corretta?`,
      [`Э́то не дом, а шко́ла.`, `Э́то не дом, но шко́ла.`, `Э́то нет дом, а шко́ла.`, `Э́то не дом, и шко́ла.`],
      0,
      `Dopo una negazione («non X, ma Y») il «ma» è а, e la negazione davanti a дом è не, non нет.`,
    ),
    q(
      'q35',
      `Come si dice «Ieri sono andato al cinema e sono tornato»?`,
      [`Вчера́ я ходи́л в кино́.`, `Вчера́ я шёл в кино́.`, `Вчера́ я хожу́ в кино́.`, `Вчера́ я бу́ду ходи́ть в кино́.`],
      0,
      `Il passato di ходи́ть dice che sei andato e sei tornato; шёл significherebbe «stavo andando».`,
    ),
    q(
      'q36',
      `Come si dice «Devo comprare un biglietto»?`,
      [`Мне ну́жно купи́ть биле́т.`, `Мне ну́жен купи́ть биле́т.`, `Я ну́жно купи́ть биле́т.`, `Мне нужны́ купи́ть биле́т.`],
      0,
      `Мне ну́жно + infinito non cambia; ну́жен e нужны́ concordano con un nome, non reggono un infinito.`,
    ),
    q(
      'q37',
      `Come dici a più persone «Non fumate!»?`,
      [`Не кури́те!`, `Нет кури́те!`, `Кури́те не!`, `Не кури́т!`],
      0,
      `Il divieto si fa con не + imperativo; -те indica вы o più persone: Не кури́те!`,
    ),
    q(
      'q38',
      `Quale frase significa «Bevo spesso tè»?`,
      [`Я ча́сто пью чай.`, `Я ре́дко пью чай.`, `Я никогда́ пью чай.`, `Я иногда́ не пью чай.`],
      0,
      `Ча́сто significa spesso e sta prima del verbo; ре́дко è raramente, mentre никогда́ richiede anche не.`,
    ),
    q(
      'q39',
      `Come dici a una persona formale «Mi dica, per favore!»?`,
      [`Скажи́те, пожа́луйста!`, `Скажи́, пожа́луйста!`, `Говори́ть, пожа́луйста!`, `Ска́жут, пожа́луйста!`],
      0,
      `Con вы l'imperativo termina in -те: Скажи́те; Скажи́ è la forma per ты.`,
    ),
    q(
      'q40',
      `Come si legge «вчера́» (ieri)?`,
      [`[fci-RA]`, `[vci-RA]`, `[fce-RA]`, `[vche-RA]`],
      0,
      `La в davanti a consonante sorda si pronuncia f e la е atona dopo ч suona i: [fci-RA].`,
    ),
  ],
  [
    card(
      'c1',
      `Formato TORFL A1`,
      `Cinque sottoprove: lessico/grammatica, lettura, scrittura, ascolto, parlato. Soglia indicativa 66% per prova: controlla sul sito dell'ente.`,
    ),
    card(
      'c2',
      `Strategia lettura`,
      `Leggi prima le domande, cerca nomi, numeri, orari e luoghi. Non tradurre parola per parola.`,
    ),
    card(
      'c3',
      `Strategia scrittura`,
      `Frasi semplici e sicure; controlla genere del passato, regola delle sette lettere, accento e caso.`,
    ),
    card(
      'c4',
      `Ascolto`,
      `Annota nomi, cifre, giorni. Allena con la voce russa dell'iPhone (Impostazioni > Accessibilità > Contenuto letto ad alta voce).`,
    ),
    card('c5', `Parlato`, `Usa le formule: Повтори́те, пожа́луйста; Я не понима́ю; Мо́жно...?; Ско́лько сто́ит?`),
    card(
      'c6',
      `Errori tipici`,
      `есть per essere; passato senza genere; doppia negazione dimenticata; идти́ al posto di е́хать; в + accusativo per lo stato.`,
    ),
    card(
      'c7',
      `Falsi amici`,
      `магази́н = negozio; фами́лия = cognome; кабине́т = ufficio; арти́ст = attore; конфе́та = caramella.`,
    ),
    card('c8', `Casi A1`, `Nominativo (soggetto), accusativo (oggetto, direzione), prepositivo (luogo, argomento).`),
    card(
      'c9',
      `Orario e numeri`,
      `час, часа́ (2-4), часо́в (5+). 13-19 con -на́дцать; 50-80 con -десят; centinaia две́сти...девятьсо́т. Orario: в + accusativo.`,
    ),
    card(
      'c10',
      `Scrittura A1`,
      `Cartolina: Приве́т! Я в Ри́ме. Здесь хорошо́. Ка́ждый день я хожу́ в парк. Пока́! Modulo: Фами́лия, И́мя, Во́зраст, Страна́.`,
    ),
    card(
      'c11',
      `Età e date`,
      `Мне два́дцать лет. Ско́лько тебе́ лет? Сего́дня пя́тое ма́я. Како́е сего́дня число́? в сре́ду, в семь часо́в ве́чера.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Traduci in russo: «Mi chiamo Marco e sono italiano.»`,
      `Меня́ зову́т Ма́рко, я италья́нец. [mi-NIA za-VUT MAR-ka ia i-tal'-IA-nits]`,
    ),
    prac(
      `p2`,
      `Traduci in russo: «Abito a Roma in un appartamento grande.»`,
      `Я живу́ в Ри́ме в большо́й кварти́ре. [ia zhy-VU v RI-mie v bal'-SHOI kvar-TI-rie]`,
    ),
    prac(
      `p3`,
      `Traduci in russo: «Ieri ho letto un libro interessante» (donna).`,
      `Вчера́ я чита́ла интере́сную кни́гу. [fci-RA ia ci-TA-la in-ti-RIES-nu-iu KNI-gu]`,
    ),
    prac(
      `p4`,
      `Traduci in russo: «Non ho tempo oggi.»`,
      `У меня́ нет вре́мени сего́дня. [u mi-NIA NIET VRIE-mi-ni si-VOD-nia]`,
    ),
    prac(
      `p5`,
      `Traduci in russo: «Vado al lavoro in metropolitana ogni giorno.»`,
      `Я е́зжу на рабо́ту на метро́ ка́ждый день. [ia IEZH-zhu na ra-BO-tu na mit-RO KAZH-dyi DIEN']`,
    ),
    prac(
      `p6`,
      `Traduci in russo: «Dov'è la farmacia? — A destra, non è lontano.»`,
      `Где апте́ка? — Напра́во, недалеко́. [GDIE ap-TIE-ka na-PRA-va ni-da-li-KO]`,
    ),
    prac(
      `p7`,
      `Traduci in italiano: «Я не понима́ю по-ру́сски.»`,
      `Non capisco il russo. (lett. «non capisco in russo»)`,
    ),
    prac(
      `p8`,
      `Traduci in italiano: «Моя́ ма́ма ста́рая, но она́ рабо́тает.»`,
      `Mia madre è anziana, ma lavora ancora. (lett. «ma lavora»)`,
    ),
    prac(
      `p9`,
      `Traduci in italiano: «Вчера́ мы бы́ли в магази́не и купи́ли хлеб.»`,
      `Ieri siamo stati in negozio e abbiamo comprato il pane.`,
    ),
    prac(
      `p10`,
      `Traduci in italiano: «Что ты де́лаешь? — Я пишу́ письмо́.»`,
      `Che cosa fai? — Sto scrivendo una lettera.`,
    ),
    prac(
      `p11`,
      `Traduci in russo: «Ho venticinque anni. Oggi è il 5 maggio.»`,
      `Мне два́дцать пять лет. [mnie DVA-tsat' PIAT' LIET] Сего́дня пя́тое ма́я. [si-VOD-nia PIA-ta-ia MA-ia]`,
    ),
    prac(
      `p12`,
      `Scrivi una cartolina di quattro frasi a un'amica (saluto, dove sei, com'è, saluto finale).`,
      `Приве́т, А́нна! Я в Ри́ме. Здесь хорошо́ и тепло́. Пока́! [pri-VIET AN-na. ia v RI-mie. ZDIES' ha-ra-SHO i tip-LO. pa-KA]`,
    ),
  ],
)

export const russoC: CourseModule[] = [ruDialoghi, ruEsame]
