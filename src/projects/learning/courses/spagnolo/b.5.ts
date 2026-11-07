import { card, mod, prac, q } from '../kit'
import { PRON_FULL, PRON_SHORT } from './pron'

// Spanish drill modules: model dialogues and practical exercises.
// Pronunciation: the single convention of spagnolo.pron.ts (same as es-pron in spagnolo.a.ts).

export const esDialoghi = mod(
  'es-dialoghi',
  'Dialoghi modello',
  'Bar, albergo, telefono, medico, colloquio, amici, problema, viaggio, con pronuncia',
  'drill',
  `<p class="lead">Otto dialoghi per situazioni reali. Leggi ad alta voce con la trascrizione [ ], poi copri la traduzione italiana (la riga in corsivo sotto ogni battuta) e prova a tradurre. Le battute si dicono di seguito, senza pause tra le parole.</p>
${PRON_FULL}
<h3>1. Al bar</h3>
<p><b>Camarero:</b> ¿Qué desea tomar?<br><i>[ke de-SSE-a to-MAR] — Cosa desidera prendere?</i></p>
<p><b>Cliente:</b> Un café con leche, por favor.<br><i>[un ka-FE kon LE-ce por fa-BOR] — Un caffè con latte, per favore.</i></p>
<p><b>Camarero:</b> ¿Algo para comer?<br><i>[AL-go PA-ra ko-MER] — Qualcosa da mangiare?</i></p>
<p><b>Cliente:</b> Una tostada con tomate. ¿Cuánto es?<br><i>[U-na tos-TA-dha kon to-MA-te KUAN-to es] — Una fetta di pane tostato con pomodoro. Quanto costa?</i></p>
<h3>2. In albergo</h3>
<p><b>Cliente:</b> Buenas tardes. Tengo una reserva.<br><i>[BUE-nas TAR-dhes TEN-go U-na rre-SSER-ba] — Buonasera. Ho una prenotazione.</i></p>
<p><b>Recepcionista:</b> ¿A nombre de quién?<br><i>[a NOM-bre de kien] — A nome di chi?</i></p>
<p><b>Cliente:</b> Rossi. Una habitación doble, dos noches.<br><i>[RRO-ssi U-na a-bi-ta-THION DO-ble dos NO-ces] — Rossi. Una camera doppia, due notti.</i></p>
<p><b>Recepcionista:</b> Aquí tiene la llave.<br><i>[a-KI TIE-ne la YA-be] — Ecco la chiave.</i></p>
<h3>3. Al telefono</h3>
<p><b>A:</b> ¿Dígame?<br><i>[DI-ga-me] — Pronto?</i></p>
<p><b>B:</b> Hola, ¿puedo hablar con la señora García?<br><i>[O-la PUE-dho a-BLAR kon la se-GNO-ra gar-THI-a] — Salve, posso parlare con la signora García?</i></p>
<p><b>A:</b> No está. ¿Quiere dejar un recado?<br><i>[no es-TA KIE-re de-HAR un rre-KA-dho] — Non c'è. Vuole lasciare un messaggio?</i></p>
<p><b>B:</b> Sí, que me llame al móvil.<br><i>[si ke me YA-me al MO-bil] — Sì, che mi chiami sul cellulare.</i></p>
<h3>4. Dal medico</h3>
<p><b>Médico:</b> ¿Qué le pasa?<br><i>[ke le PA-ssa] — Cosa ha?</i></p>
<p><b>Paciente:</b> Me duele la garganta y tengo fiebre.<br><i>[me DUE-le la gar-GAN-ta i TEN-go FIE-bre] — Mi fa male la gola e ho la febbre.</i></p>
<p><b>Médico:</b> ¿Desde cuándo?<br><i>[DES-dhe KUAN-do] — Da quando?</i></p>
<p><b>Paciente:</b> Desde ayer.<br><i>[DES-dhe a-YER] — Da ieri.</i></p>
<h3>5. Colloquio di lavoro</h3>
<p><b>Entrevistador:</b> Hábleme de su experiencia.<br><i>[A-ble-me de su eks-pe-RIEN-thia] — Mi parli della sua esperienza.</i></p>
<p><b>Candidato:</b> Trabajé cinco años como ingeniero.<br><i>[tra-ba-HE THIN-ko A-gnos KO-mo in-he-NIE-ro] — Ho lavorato cinque anni come ingegnere.</i></p>
<p><b>Entrevistador:</b> ¿Por qué quiere este puesto?<br><i>[por KE KIE-re ES-te PUES-to] — Perché vuole questo posto?</i></p>
<p><b>Candidato:</b> Porque busco nuevos retos.<br><i>[POR-ke BUS-ko NUE-bos RRE-tos] — Perché cerco nuove sfide.</i></p>
<h3>6. Tra amici</h3>
<p><b>Ana:</b> ¡Hola! ¿Qué tal?<br><i>[O-la ke tal] — Ciao! Come va?</i></p>
<p><b>Luis:</b> Bien, ¿y tú? ¿Quedamos mañana?<br><i>[bien i tu ke-DHA-mos ma-GNA-na] — Bene, e tu? Ci vediamo domani?</i></p>
<p><b>Ana:</b> Vale, ¿a las ocho?<br><i>[BA-le a las O-cio] — Va bene, alle otto?</i></p>
<h3>7. Un problema</h3>
<p><b>Cliente:</b> Disculpe, el aire acondicionado no funciona.<br><i>[dis-KUL-pe el AI-re a-kon-di-thio-NA-dho no fun-THIO-na] — Mi scusi, l'aria condizionata non funziona.</i></p>
<p><b>Recepcionista:</b> Lo siento mucho. Mando a alguien enseguida.<br><i>[lo SIEN-to MU-cio MAN-do a AL-ghien en-se-GHI-dha] — Mi dispiace molto. Mando subito qualcuno.</i></p>
<p><b>Cliente:</b> ¿Puede cambiarme de habitación?<br><i>[PUE-dhe kam-BIAR-me de a-bi-ta-THION] — Può cambiarmi camera?</i></p>
<h3>8. In viaggio</h3>
<p><b>Viajero:</b> Un billete a Sevilla, por favor.<br><i>[un bi-YE-te a se-BI-ya por fa-BOR] — Un biglietto per Siviglia, per favore.</i></p>
<p><b>Taquillera:</b> ¿De ida o de ida y vuelta?<br><i>[de I-dha o de I-dha i BUEL-ta] — Solo andata o andata e ritorno?</i></p>
<p><b>Viajero:</b> De ida y vuelta, para el viernes.<br><i>[de I-dha i BUEL-ta PA-ra el BIER-nes] — Andata e ritorno, per venerdì.</i></p>
<div class="say"><b>Cosa dire.</b> «Perdone, ¿puede repetir más despacio?» [per-DHO-ne PUE-dhe rre-pe-TIR mas des-PA-thio] — Mi scusi, può ripetere più lentamente?</div>`,
  [
    q(
      'q1',
      `Come rispondi a «¿Qué desea tomar?»`,
      [`Un café con leche, por favor`, `Sí, deseo un café`, `Me gusta el café con leche`, `Tengo un café con leche`],
      0,
      `La domanda chiede cosa vuoi ordinare, quindi rispondi con un'ordinazione. Sí, deseo un café non risponde a una domanda aperta, me gusta esprime una preferenza e tengo vuol dire possiedo.`,
    ),
    q(
      'q2',
      `Come si risponde al telefono in Spagna?`,
      [`¿Dígame?`, `¿Pronto?`, `¿Hola, quién?`, `¿Quiere hablar?`],
      0,
      `Dígame (o diga) è la risposta tipica. Pronto in spagnolo vuol dire presto o rapido, non è usato al telefono.`,
    ),
    q(
      'q3',
      `Come si chiede «Cosa ha?» a un paziente?`,
      [`¿Qué le pasa?`, `¿Qué tiene de?`, `¿Cómo se pasa?`, `¿Qué le pasó de?`],
      0,
      `Pasarle algo a alguien è la costruzione normale per chiedere cosa succede. Le altre forme sono calchi errati.`,
    ),
    q(
      'q4',
      `Come si dice «Ho una prenotazione»?`,
      [`Tengo una reserva`, `Soy una reserva`, `Hago una reserva`, `Estoy una reserva`],
      0,
      `Si usa tener per "avere". Hacer una reserva significa "fare" una prenotazione, non averla già.`,
    ),
    q(
      'q5',
      `Come si pronuncia <i>mañana</i>?`,
      [`[ma-GNA-na]`, `[ma-NIA-na]`, `[ma-NA-na]`, `[ma-NYA-na]`],
      0,
      `La ñ ha il suono gn di "sogno". Si scrive come ma-GNA-na, con tonica sulla seconda sillaba.`,
    ),
    q(
      'q6',
      `Come si legge <i>habitación</i>?`,
      [`[a-bi-ta-THION]`, `[ha-bi-ta-THION]`, `[a-bi-ta-KION]`, `[a-bi-TA-thion]`],
      0,
      `La h iniziale è muta e il suono dell'accento cade sull'ultima sillaba (-ción). La c prima di i è th in Spagna.`,
    ),
    q(
      'q7',
      `Come si dice «Mando subito qualcuno»?`,
      [
        `Mando a alguien enseguida`,
        `Mando alguien subito`,
        `Mando a nadie enseguida`,
        `Mando a alguien al instante de`,
      ],
      0,
      `Davanti a un complemento di persona serve la a personal. Enseguida significa subito.`,
    ),
    q(
      'q8',
      `Cosa significa <i>quedamos mañana</i>?`,
      [`Ci vediamo domani (accordo)`, `Restiamo qui domani`, `Domani siamo stanchi`, `Siamo rimasti ieri`],
      0,
      `Quedar significa darsi appuntamento. Restare si dice quedarse e richiede il riflessivo.`,
    ),
  ],
  [
    card(`c1`, `¿Qué desea tomar?`, `Cosa desidera prendere? [ke de-SSE-a to-MAR]`),
    card(`c2`, `Un café con leche, por favor.`, `Un caffè con latte, per favore. [un ka-FE kon LE-ce por fa-BOR]`),
    card(`c3`, `Tengo una reserva a nombre de…`, `Ho una prenotazione a nome di…`),
    card(`c4`, `¿Dígame?`, `Pronto? (risposta al telefono) [DI-ga-me]`),
    card(`c5`, `No cuelgue.`, `Non riattacchi. [no KUEL-ghe]`),
    card(`c6`, `Me duele la garganta.`, `Mi fa male la gola. [me DUE-le la gar-GAN-ta]`),
    card(`c7`, `¿Qué le pasa?`, `Cosa ha? / Cosa succede? [ke le PA-ssa]`),
    card(`c8`, `¿Quedamos mañana?`, `Ci vediamo domani? [ke-DHA-mos ma-GNA-na]`),
    card(`c9`, `El aire acondicionado no funciona.`, `L'aria condizionata non funziona.`),
    card(`c10`, `¿Puede cambiarme de habitación?`, `Può cambiarmi camera?`),
    card(`c11`, `Un billete de ida y vuelta, por favor.`, `Un biglietto di andata e ritorno, per favore.`),
    card(`c12`, `¿Puede repetir más despacio?`, `Può ripetere più lentamente? [PUE-dhe rre-pe-TIR mas des-PA-thio]`),
  ],
  [
    prac(
      `p1`,
      `Scrivi un dialogo di 4 battute in un bar: ordina un tè e una fetta di torta, poi chiedi il conto.`,
      `Camarero: ¿Qué desea? · Yo: Un té y una tarta de manzana, por favor. · Camarero: Aquí tiene. · Yo: La cuenta, por favor. (Variante in America: pastel / torta.)`,
    ),
    prac(
      `p2`,
      `Scrivi cosa dici in albergo se la camera ha un problema (rumore) e chiedi una soluzione.`,
      `Disculpe, hay mucho ruido en mi habitación. ¿Puede cambiarme de habitación, por favor?`,
    ),
    prac(
      `p3`,
      `Telefono: chiedi di parlare con il signor López, che non c'è. Lascia un messaggio.`,
      `Buenos días, ¿puedo hablar con el señor López? — No está. — ¿Puede decirle que me llame? Mi número es… Gracias.`,
    ),
    prac(
      `p4`,
      `Dal medico: spiega che hai mal di stomaco da due giorni e non riesci a dormire.`,
      `Me duele el estómago desde hace dos días y no puedo dormir.`,
    ),
    prac(
      `p5`,
      `Colloquio: presentati in tre frasi (nome, studi, esperienza).`,
      `Me llamo Marco Rossi. Soy ingeniero informático y trabajo en Milán desde hace tres años. Busco nuevas oportunidades en el extranjero.`,
    ),
    prac(
      `p6`,
      `Trascrivi la pronuncia di: ¿Qué tal?, mañana, gracias, habitación.`,
      `¿Qué tal? [ke tal] · mañana [ma-GNA-na] · gracias [GRA-thias] · habitación [a-bi-ta-THION].`,
    ),
  ],
)

export const esDrills = mod(
  'es-drills',
  'Esercizi pratici di traduzione e trasformazione',
  'Oltre 30 esercizi su ser/estar, tempi, subjuntivo, pronomi, errori tipici',
  'drill',
  `<p class="lead">La grammatica si impara facendo, non leggendo. Questo modulo è una palestra: 49 esercizi brevi con risposta modello nel campo «risposta». Scrivi sempre prima, poi confronta.</p>
${PRON_SHORT}
<h3>Come usare gli esercizi</h3>
<ol><li><b>Copri la risposta</b> e scrivi la tua versione sul quaderno (non solo a mente: la mano memorizza).</li><li><b>Confronta</b> lettera per lettera, accenti compresi: <i>está</i> e <i>esta</i> sono parole diverse.</li><li><b>Segna l'errore</b> in un quaderno degli errori con la regola in una riga. Gli italiani ripetono gli stessi tre o quattro errori.</li><li><b>Ripeti</b> dopo 1, 3 e 7 giorni solo quelli sbagliati.</li></ol>
<h3>Le 10 aree da allenare</h3>
<ul><li><b>Ser / estar</b>: <i>Es médico, está cansado.</i></li><li><b>Por / para</b>: <i>Es para ti. Lo compré por diez euros.</i></li><li><b>Indefinido e imperfecto</b>: <i>Ayer fui al cine. Cuando era niño, vivía en Turín.</i></li><li><b>Pronomi</b>: <i>Se lo doy. Dímelo. No me lo digas.</i></li><li><b>Subjuntivo</b>: <i>Quiero que vengas. Cuando llegues, llámame.</i></li><li><b>Periodo ipotetico</b>: <i>Si tuviera tiempo, iría.</i></li><li><b>Gustar</b>: <i>Me gustan las manzanas.</i></li><li><b>A personal e preposizioni</b>: <i>Veo a Ana. Estoy de acuerdo contigo.</i></li><li><b>Falsi amici</b>: <i>vaso, mantequilla, embarazada, éxito.</i></li><li><b>Pronuncia</b>: <i>ñ = gn, j = h, ch = c di «cena», z/c = th, s tra vocali = ss.</i></li></ul>
<h3>Tre trucchi per gli italiani</h3>
<ul><li>Quando una frase italiana ti sembra «uguale», <b>sospetta</b>: è lì che nascono i calchi (<i>*soy 20 años</i>, <i>*cuando llegarás</i>, <i>*si tendría</i>).</li><li>Impara le frasi intere, non le parole: <i>tengo hambre</i>, <i>hace calor</i>, <i>me duele la cabeza</i>.</li><li>Leggi ad alta voce con le trascrizioni [ ] fino a quando il ritmo ti suona naturale: l'accento tonico decide il significato (<i>hablo / habló</i> [A-blo / a-BLO]).</li></ul>
<h3>Esempio svolto</h3>
<p>Traduci: «Se fossi in te, non uscirei con questo tempo.»</p>
<ol><li>Struttura: <i>yo que tú</i> + condizionale.</li><li>Tempo: <i>con este tiempo</i> (per il meteo si usa <i>tiempo</i>; <i>clima</i> è il clima di una zona).</li><li>Risultato: <b>Yo que tú, no saldría con este tiempo.</b> [yo ke tu no sal-DRI-a kon ES-te TIEM-po]</li></ol>
<p>Nota: <i>saldría</i> è il condizionale irregolare di <i>salir</i> (radice <i>saldr-</i>), come <i>tendría, haría, diría, podría, querría, sabría, pondría, vendría, habría</i>.</p>
<div class="say"><b>Cosa dire.</b> «Cuando tenga tiempo, haré los ejercicios.» [KUAN-do TEN-ga TIEM-po a-RE los e-her-THI-thios] — Quando avrò tempo, farò gli esercizi.</div>`,
  [
    q(
      'q1',
      `Completa: <i>Mi madre ___ de Sevilla y ahora ___ en Madrid.</i>`,
      [`es / está`, `está / es`, `es / es`, `está / está`],
      0,
      `Ser per l'origine (es de Sevilla), estar per dove si trova ora (está en Madrid). Est/es invertiti direbbero che è temporaneamente di Siviglia, e es en Madrid tratta la posizione come un'identità.`,
    ),
    q(
      'q2',
      `Completa: <i>Trabajo ___ una empresa pequeña y viajo ___ el norte.</i>`,
      [`para / por`, `por / para`, `para / para`, `por / por`],
      0,
      `Trabajar para indica il datore di lavoro, viajar por un luogo attraversato indica il percorso. Con por / para si direbbe che si lavora a causa dell'azienda e si viaggia verso il nord come meta.`,
    ),
    q(
      'q3',
      `Come si dice «Te lo dico»?`,
      [`Te lo digo`, `Lo te digo`, `Te digo lo`, `Digo te lo`],
      0,
      `I pronomi atoni vanno prima del verbo coniugato, prima l'indiretto (te) e poi il diretto (lo): te lo digo. Lo te inverte l'ordine, e digo te lo copia la posizione italiana «dico te lo».`,
    ),
    q(
      'q4',
      `Correggi: <i>A Ana le gusta los gatos.</i>`,
      [`A Ana le gustan los gatos`, `A Ana les gustan los gatos`, `A Ana gusta los gatos`, `Ana le gusta a los gatos`],
      0,
      `Gustar concorda con ciò che piace (los gatos, plurale): gustan. Les sarebbe plurale riferito a più persone, mentre Ana è una sola; senza le manca il pronome indiretto.`,
    ),
    q(
      'q5',
      `Come si dice «Dormivo quando hai chiamato»?`,
      [
        `Estaba durmiendo cuando llamaste`,
        `Estaba dormiendo cuando llamaste`,
        `Dormí cuando llamabas`,
        `Estuve durmiendo cuando llamabas`,
      ],
      0,
      `Azione in corso interrotta: estaba (imperfecto) + gerundio, e il gerundio di dormir è irregolare (durmiendo, non dormiendo). Dormí cuando llamabas inverte indefinido e imperfecto.`,
    ),
    q(
      'q6',
      `Come si dice «Appena lo saprò, ti avviso»?`,
      [
        `En cuanto lo sepa, te aviso`,
        `En cuanto lo sabré, te aviso`,
        `En cuanto lo sé, te aviso`,
        `En cuanto lo supe, te aviso`,
      ],
      0,
      `Dopo en cuanto con senso futuro serve il subjuntivo presente (sepa). Sabré è il futuro italiano, sé è un presente che dice «appena lo so» e supe un passato.`,
    ),
    q(
      'q7',
      `Come si legge <i>hablo</i> e come <i>habló</i>?`,
      [`[A-blo] e [a-BLO]`, `[a-BLO] e [A-blo]`, `[A-blo] e [A-blo]`, `[a-BLO] e [a-BLO]`],
      0,
      `Hablo (io parlo) ha la tonica sulla prima sillaba; habló (lui parlò) sull'ultima, e l'accento scritto lo indica.`,
    ),
    q(
      'q8',
      `Quale frase usa correttamente la a personal?`,
      [`Veo a mi hermano`, `Veo mi hermano`, `Veo de mi hermano`, `Veo al mi hermano`],
      0,
      `Il complemento è una persona determinata, quindi serve a. Senza a è un errore tipico degli italiani.`,
    ),
  ],
  [
    card(`c1`, `Ser / estar`, `Ser: identità, professione, origine. Estar: posizione, stato.`),
    card(`c2`, `Por / para`, `Por: causa, prezzo, durata. Para: destinatario, scopo, scadenza.`),
    card(`c3`, `Se lo doy`, `Le + lo/la/los/las → se: se lo doy.`),
    card(`c4`, `Gustar`, `Concorda con ciò che piace: me gustan las manzanas.`),
    card(`c5`, `Cuando + subjuntivo`, `Per il futuro: cuando llegues, llámame.`),
    card(`c6`, `Si + imperfecto de subjuntivo`, `Si tuviera dinero, viajaría.`),
    card(
      `c7`,
      `Condizionali irregolari`,
      `saldría, tendría, haría, diría, podría, querría, sabría, pondría, vendría, habría`,
    ),
    card(`c8`, `A personal`, `Veo a Ana, ma Veo un coche (cosa = senza a).`),
    card(
      `c9`,
      `Trucco di studio`,
      `Registra gli errori con la regola in una riga e riesercitati dopo 1, 3 e 7 giorni.`,
    ),
    card(`c10`, `Imperativo negativo`, `Sempre subjuntivo, pronomi prima: dímelo → no me lo digas.`),
    card(
      `c11`,
      `Gerundio irregolare`,
      `dormir → durmiendo, decir → diciendo, pedir → pidiendo, leer → leyendo, ir → yendo.`,
    ),
  ],
  [
    prac(
      `p1`,
      `Traduci: «Mi piacciono i film italiani.»`,
      `Me gustan las películas italianas. Gustar concorda con ciò che piace (películas, plurale).`,
    ),
    prac(`p2`, `Traduci: «Ho 25 anni.»`, `Tengo 25 años. Tener per l'età, non ser.`),
    prac(`p3`, `Traduci: «Siamo stanchi.»`, `Estamos cansados. Estar per lo stato temporaneo.`),
    prac(`p4`, `Traduci: «Lei è di Roma.»`, `Ella es de Roma. Ser de per l'origine.`),
    prac(
      `p5`,
      `Completa: «Mi hermano ___ (ser) médico y ___ (estar) en el hospital.»`,
      `es / está. Ser per la professione, estar per la posizione.`,
    ),
    prac(
      `p6`,
      `Completa: «Este regalo es ___ ti; lo compré ___ diez euros.»`,
      `para / por. Para = destinatario; por = prezzo.`,
    ),
    prac(
      `p7`,
      `Metti al passato (indefinido): «Ayer (yo, comer) ___ paella.»`,
      `Ayer comí paella. Indefinido di comer: comí, comiste, comió…`,
    ),
    prac(
      `p8`,
      `Completa con l'imperfecto: «Cuando era niño, (yo, vivir) ___ en Turín.»`,
      `vivía. L'imperfecto indica un'abitudine o uno stato nel passato.`,
    ),
    prac(
      `p9`,
      `Metti al plurale: «el lápiz rojo»`,
      `los lápices rojos. La z diventa c davanti alla e (lápiz → lápices).`,
    ),
    prac(
      `p10`,
      `Sostituisci con i pronomi: «Doy el libro a Ana.»`,
      `Se lo doy. Il pronome indiretto le diventa se davanti a lo.`,
    ),
    prac(`p11`, `Forma il negativo di «Dímelo»:`, `No me lo digas. Negativo = subjuntivo, pronomi prima del verbo.`),
    prac(
      `p12`,
      `Completa: «Quiero que (tú, venir) ___ mañana.»`,
      `vengas. Subjuntivo dopo querer que con soggetti diversi.`,
    ),
    prac(`p13`, `Completa: «No creo que (él, tener) ___ razón.»`, `tenga. No creer que + subjuntivo.`),
    prac(
      `p14`,
      `Completa: «Cuando (tú, llegar) ___, llámame.»`,
      `llegues. Cuando con senso futuro vuole il subjuntivo.`,
    ),
    prac(
      `p15`,
      `Completa: «Si (yo, tener) ___ tiempo, iría al cine.»`,
      `tuviera. Si + imperfecto de subjuntivo + condizionale.`,
    ),
    prac(`p16`, `Completa: «Si hubiera estudiado, ___ (aprobar).»`, `habría aprobado. Tipo 3: condicional perfecto.`),
    prac(`p17`, `Correggi: «Soy 20 años.»`, `Tengo 20 años.`),
    prac(`p18`, `Correggi: «Veo María.»`, `Veo a María. A personal davanti a una persona.`),
    prac(`p19`, `Correggi: «Hay muchas gente.»`, `Hay mucha gente. Gente è singolare femminile.`),
    prac(`p20`, `Correggi: «Estoy de acuerdo con ti.»`, `Estoy de acuerdo contigo. Con + ti diventa contigo.`),
    prac(
      `p21`,
      `Trasforma in pasiva refleja: «Aquí venden zapatos.»`,
      `Aquí se venden zapatos. Il verbo concorda con zapatos.`,
    ),
    prac(`p22`, `Traduci: «Sto leggendo un libro.»`, `Estoy leyendo un libro. Gerundio di leer: leyendo.`),
    prac(
      `p23`,
      `Discorso indiretto: Pedro dijo: «Tengo hambre.»`,
      `Pedro dijo que tenía hambre. Il presente passa all'imperfecto.`,
    ),
    prac(`p24`, `Completa: «Juan es más alto ___ yo.»`, `que. Più… di (comparativo) = más… que.`),
    prac(`p25`, `Traduci: «Oggi fa molto caldo.»`, `Hoy hace mucho calor. Hacer per il tempo.`),
    prac(`p26`, `Traduci: «Ho appena finito.»`, `Acabo de terminar. Acabar de + infinito = appena.`),
    prac(`p27`, `Traduci: «Sto per uscire.»`, `Estoy a punto de salir.`),
    prac(
      `p28`,
      `Traduci: «Il bicchiere è sul tavolo.»`,
      `El vaso está sobre la mesa. Vaso è bicchiere; mesa è tavolo.`,
    ),
    prac(
      `p29`,
      `Chiedi l'ora a uno sconosciuto (formale).`,
      `Perdone, ¿me puede decir qué hora es? (o ¿tiene hora?) Pronuncia: [per-DHO-ne me PUE-dhe de-THIR ke O-ra es].`,
    ),
    prac(
      `p30`,
      `Traduci: «Se fossi in te, andrei dal medico.»`,
      `Yo que tú, iría al médico. In alternativa: Si yo fuera tú, iría al médico.`,
    ),
    prac(
      `p31`,
      `Traduci: «Non parlare così forte!» (a un amico)`,
      `¡No hables tan alto! Imperativo negativo = subjuntivo.`,
    ),
    prac(
      `p32`,
      `Trascrivi la pronuncia di: gracias, jamón, niño, chico, llave.`,
      `gracias [GRA-thias] · jamón [ha-MON] · niño [NI-gno] · chico [CI-ko] · llave [YA-be].`,
    ),
    prac(
      `p33`,
      `Metti gli accenti: «el esta aqui».`,
      `Él está aquí. Él (pronome) e está (verbo) vogliono l'accento; aquí è sull'ultima sillaba.`,
    ),
    prac(
      `p34`,
      `Traduci: «Mi hanno regalato un libro.»`,
      `Me han regalado un libro. (O Me regalaron un libro in America.)`,
    ),
    prac(
      `p35`,
      `Traduci: «Ieri sono andato al cinema e ho visto un bel film.»`,
      `Ayer fui al cine y vi una buena película. Indefinido irregolare di ir (fui) e ver (vi).`,
    ),
    prac(
      `p36`,
      `Traduci: «Quando avrò tempo, farò gli esercizi.»`,
      `Cuando tenga tiempo, haré los ejercicios. Cuando + subjuntivo per il futuro; hacer ha futuro irregolare (haré).`,
    ),
    prac(
      `p37`,
      `Traduci in italiano: «Hace tres años que vivo en Madrid.»`,
      `Vivo a Madrid da tre anni. Hace + tempo + que + presente = da + durata (non si usa il passato).`,
    ),
    prac(
      `p38`,
      `Traduci in italiano: «Acabo de llegar y todavía no he desayunado.»`,
      `Sono appena arrivato e non ho ancora fatto colazione. Acabar de + infinito = appena; todavía no + perfecto.`,
    ),
    prac(
      `p39`,
      `Traduci in italiano: «Si hubiera sabido la verdad, no habría venido.»`,
      `Se avessi saputo la verità, non sarei venuto. Periodo ipotetico del terzo tipo: hubiera + participio / habría + participio.`,
    ),
    prac(
      `p40`,
      `Traduci in italiano: «Me gustaría que me ayudaras con esto.»`,
      `Mi piacerebbe che mi aiutassi con questo. Condicional + que + imperfecto de subjuntivo.`,
    ),
    prac(
      `p41`,
      `Traduci in italiano: «Se me ha olvidado el paraguas en casa.»`,
      `Ho dimenticato l'ombrello a casa (mi è sfuggito di mente). La costruzione con se me indica un fatto involontario.`,
    ),
    prac(
      `p42`,
      `Traduci in italiano: «Cuando llegues, llámame.»`,
      `Quando arrivi (arriverai), chiamami. Dopo cuando con senso futuro lo spagnolo usa il subjuntivo presente.`,
    ),
    prac(
      `p43`,
      `Traduci in italiano: «Llevo dos horas esperándote.»`,
      `Ti aspetto da due ore. Llevar + tempo + gerundio = da quanto tempo un'azione dura.`,
    ),
    prac(
      `p44`,
      `Traduci in italiano: «No creo que Ana lo sepa.»`,
      `Non credo che Ana lo sappia. Negazione di creer + que + presente de subjuntivo.`,
    ),
    prac(
      `p45`,
      `Traduci in italiano: «Ayer me encontré con tu hermano en el supermercado.»`,
      `Ieri ho incontrato (per caso) tuo fratello al supermercato. Encontrarse con = incontrarsi/imbattersi; indefinido per un fatto concluso.`,
    ),
    prac(
      `p46`,
      `Traduci in italiano: «Ya habrá llegado, porque salió hace una hora.»`,
      `Sarà già arrivato, perché è uscito un'ora fa. Futuro perfecto per la congettura; hace + tempo = fa.`,
    ),
    prac(
      `p47`,
      `Traduci in italiano: «A mi hermana le encanta cocinar, pero a mí no me apetece nada.»`,
      `A mia sorella piace moltissimo cucinare, ma a me non va per niente (non ne ho voglia). Gustar-type: il soggetto è la cosa, la persona è complemento indiretto.`,
    ),
    prac(
      `p48`,
      `Traduci in italiano: «Dejé de fumar hace cinco años y no he vuelto a hacerlo.»`,
      `Ho smesso di fumare cinque anni fa e non ho più ripreso. Dejar de + infinito; volver a + infinito = rifare.`,
    ),
    prac(
      `p49`,
      `Traduci in italiano: «Tengo que irme, que se me hace tarde.»`,
      `Devo andare, che si sta facendo tardi. Tener que + infinito = dovere; se me hace tarde = mi si fa tardi.`,
    ),
  ],
)
