# Francese: revisione fonetica, round 1

Ruolo: fonetista francese per italiani. Sola lettura, nessun file del corso modificato.
File letti: `francese.a.ts` (fr-pron, fr-saluti, fr-etre, fr-nomi), `francese.a.2.ts`, `francese.a.3.ts`, `francese.b.ts`, `b.2` .. `b.5`, `francese.b.pron.ts` (legenda), `francese.ts`.
Estratte e controllate circa 1.900 occorrenze tra [ ], le righe delle tabelle `vsec` (213 voci in b.4) e le 43 righe dei dialoghi (`dl(...)` in b.5). Nelle trascrizioni letteralmente spuntate ne ho controllate circa 900, più di 150.
Percorsi relativi a `src/projects/learning/courses/`. Riferimenti nel formato file:riga.

## Verdetto

Il corso è solido: la grande maggioranza delle trascrizioni è corretta e la legenda è pensata bene (maiuscolo sull'ultima sillaba, nasali con tilde, ü/ö, zh/sh). Il problema è la **coerenza fra la parte A (francese.a*) e la parte B (francese.b*)**, scritte con convenzioni diverse, e una manciata di errori puntuali. Mancano anche alcune regole importanti per un italiano (sc, x, doppie, liaison facoltativa, intonazione).

Voto: 7/10 sulla correttezza, 5.5/10 sulla coerenza, 6/10 sulla completezza "come lo dico bene".

Errori: **A = 7 (gruppi), B = 14, C = 8**.

## 1. Coerenza della convenzione

Nessun disallineamento del tipo "bõ" contro "bon-ZHUR": cercato `bon-ZHUR`/`bon-zhur` in tutti i file, non esiste. Le nasali usano ovunque õ ã ẽ (e Õ Ã Ẽ in maiuscolo). Non ci sono vocali nasali scritte con n finale, tranne le eccezioni sotto. Nessun carattere combinante (U+0303): tutte le vocali nasali sono precomposte, quindi niente rischio di rendering su iPhone.

Incoerenze trovate (B salvo diverso avviso):

1. **j'ai**: parte A `zhé` (chiusa, dichiarato nel commento di testa di a.ts), parte B `zhè` (aperta): b.ts:297-301 (`kë zhè fi-NI`, `kë nu-zè-yõ fi-NI`), b.2:2482 (`zhè bë-ZUẼ`), b.4:113 e 605 (`zhè mal`, `zhè ẽ-nã-trë-TIẼ`), b.5 (dialoghi 2, 4, 5, 6; `zhè ré-zèr-VÉ` ecc.). Stessa cosa per `je n'ai pas`: `zhë né pa` (a.2:340, a.ts:453) contro `zhë nè pa` (b.5:571). Scegliere una forma e dirlo nella legenda (la neutralizzazione é/è in -ai è comune a Parigi).
2. **i contro y davanti a vocale**. La legenda dice «y = i veloce». Parte A: `byẽ`, `RYẼ`, `LYÕ`, `TYÕ`, `kar-TYÉ`, `SYÕ`. Parte B e vocabolario: `BIẼ` (kõ-BIẼ b.5:570/192), `TIẼ` (entretien, b.4:605/721), `SIÕ` (addition b.4:114/234, station, location, réunion, réception, élection, connexion), `TIÕ` (question b.5:639), `TIÉ` (quartier, métier), `PIÉ` (casser les pieds b.3:296), `-IÕ`/`-IÉ` in tutto il subjonctif (b.ts:51-68: `par-LIÕ`, `par-LIÉ`, `a-LIÕ`, `fa-SIÕ`, `VIÈN`), `-RIÕ`/`-RIÉ` nel condizionale (b.2:241, `pu-rié-VU`), `tiõ` (b.2:17), `ziè` (dialogo 2: deuxième), `FIÈVR`, `KIÈT`, `bio-TIK`, `RIÃS`, `VIÃD`. «IÕ» letto da un italiano suona «i-ò» in due sillabe. Uniformare a Y: `par-LYÕ`, `kõ-BYẼ`, `la-di-SYÕ`.
3. **Minuscole/maiuscole fuori norma**: `viẽ` (b.2:44, b.2:188) e `viên` (b.ts:85: `ê` non è nella legenda) per «vient/vienne» al posto di `VYẼ` / `VYÈN`; `[biẽ-KË]`, `[a kõ-di-siõ-KË]` (b.ts:270, 274) senza sillaba tonica in maiuscolo davanti al KË.
4. **quatre-vingts**: `ka-trë-VẼ` (a.ts:279, 280) contro `ka-tr-VẼ` / `ka-tr-vẽ-DIS` (b.3:491-492, b.3:649, b.5:642; i numeri di riga di questa tabella sono approssimati, da verificare con grep). `ka-tr` non è leggibile (nessuna vocale).
5. **il y a**: `i-lya` (a.ts:455, a.2:367, a.3:486), `i-lya-VÈ`, ma `i-li-YA` (b.2:454: aggiunge una sillaba che non esiste) e `il ya` (b.3:545). Anche le forme fuse `i-lfë-ZÈ`, `i-lplö-VÈ` (a.2:511, 516) mescolano trattino, spazio e nessun separatore.
6. **ils ont**: `[il-ZÕ]` in fr-etre (a.ts:453, quiz a.ts:531: `il-LÕ` è sbagliato, `il-ZÕ` è la risposta) ma `[i-ZÕ]` nella legenda PRON_FULL (b.pron.ts), in b.5 (quiz 117-120, 595, 637, 1014, 1047) e in b.ts. Lo standard è `[il-ZÕ]` (la l si sente); `[i-ZÕ]` è solo parlato veloce. Vedi anche A-6.
7. **merci**: `mér-SI` (6 volte: a.ts:62, 67, 223, 265, 269, 401) contro `mèr-SI` nei dialoghi (b.5). Corretto: `mèr-SI` (è aperta, [mɛʁsi]).
8. **o chiusa/aperta**. La lezione dice «o + consonante: di solito ò aperta» (a.ts:45) e la legenda distingue o/ò, ma molte parole con o aperta sono scritte con o semplice: `pèr-SON` (a.2:193, 284), `DON` / `do-NÉ` (a.3:198, 208, 291, 339), `ko-MÃ`, `ko-NÜ`, `sor-TI`, `ok-TOBR`, `no-VÃBR`, `no-NÃT`, `so-MÈY` (a.ts:467, 570), `pro-BLÈM`, `dor-MIR`, `or-di-na-TÖR` (a.ts:34), `KORD` (b.3:294), `dok-TÖR`, `lo-pi-TAL`. Nella stessa lezione si usa `bòn`, `PÒRT`, `PÒL`, `NÒTR`. Il commento di b.ts:27 ammette «solo dove la regola è chiara», ma la regola non è mai data (vedi §4).
9. **Posizione della sillaba tonica in «de»**: `PRÈ dë`, `LUẼ dë`, `PÖ dë` (a.2:206, a.3:476) contro `prè DË`, `luẽ DË` (b.4); `bo-ku DË` ma `bo-KU` (beaucoup, a.ts:223).
10. **Confini di parola**: il trattino indica sia confine di sillaba sia liaison/enchaînement/clitico (`nu-za-VÕ`, `zhë ma-PÈL`, `kèl-za-MI`, `tut-FUA`), e lo spazio è usato a caso (`ko-mã tü ta-PÈL` ma `ko-mã ta-lé-VU`). Il lettore non può distinguere «sillaba» da «parola».
11. **ë maiuscola** (`DË`, `KË`, `Ë` dell'alfabeto): l'ë è per definizione debole, la maiuscola può far pensare a un accento. In `a-vã-KË` / `bien KË` lo schwa finale è in realtà spesso muto (`a-VÃK`).
12. **nous voyions** `vua-YÕ` (a.2:238, 2638) contro il subjonctif `vua-YIÕ` (b.ts:67): quest'ultimo è più fedele (due yod), il primo è dichiarato semplificazione nel commento di a.ts.
13. Legenda: gli esempi `bon [bõ]`, `moi [mua]` (b.pron.ts) sono in minuscolo (monosillabi), mentre ovunque sono `BÕ`, `MUA`. Cosmetico (C).
14. **vous parlez ecc. liaison dopo verbo**: `zhë vu-DRÈ zẽ ka-FÉ` (b.2:257) lega «voudrais un» mentre `zhë vu-DRÈ ẽ ka-FÉ` (a.3:339) no: la liaison dopo un verbo è facoltativa e di solito non si fa; scegliere la seconda.
15. `vyèy a-mi` (a.ts:782, «vieil ami»): trattino mancante tra `vyèy` e `a`; meglio `vyè-ya-MI`.
16. `TSHÒM` (chum, b.3:520): «tsh» non è nella legenda (C); `TS`/`DZ` sono spiegati solo in riga.

## 2. Errori di trascrizione (un italiano pronuncerebbe male)

| # | Gravità | Dove | Testo | Correzione |
|---|---|---|---|---|
| 1 | A | fr-saluti, a.ts:286 | `moins le quart [mua lë KAR]` | `[muẽ lë KAR]` (moins = [mwɛ̃]; la stessa parola è `MUẼ` in a.3:469 e `muẽ` in `a muẽ-KË`, b.ts:276; moins non compare altrove con `mua`) |
| 2 | A | b.4 (Corpo), e b.3:299 | `les yeux [lé-ZYË]`, `coûter les yeux de la tête [ku-té lé-zyë dë la TÈT]` | `[lé-ZYÖ]` / `lé-zyö`. `ë` è uno schwa debole, yeux ha la ö chiusa (già `dé-ZYÖ` in a.ts:621) |
| 3 | A | b.4 (Lavoro) | `l'emploi (m.) [lãn-PLUA]` | `[lã-PLUA]`. Non c'è alcuna n da legare |
| 4 | A | a.3:44 (fr-futur) | `Si j'avais le temps, je voyagerais. [si zhé lë TÃ, ...]` | `[si zha-VÈ lë TÃ, ...]`. Lo scritto è «j'avais» ma la trascrizione è «j'ai» |
| 5 | A | a.2:38 (fr-presente) | `nous appelons [nu-za-plë-LÕ]` | `[nu-za-p(ë)-LÕ]` (standard `nu-zap-LÕ` o `nu-za-pë-LÕ`). `plë-LÕ` aggiunge una sillaba e una l in più |
| 6 | A | a.ts:453 (fr-etre), a.ts:574 (carta c11), a.ts:647, a.ts:755 | `on est ensemble [o-nè ã-SÃBL]`; `On est [o-NÈ]`; `mon amie [mo-na-MI]` | `[õ-nè ã-SÃBL]`, `[õ-NÈ]`, `[mõ-na-MI]`. Perde la nasale; la vocale resta nasale davanti alla liaison (come in `Ẽ-na-MI`, in `õ-NA`, b.2:448, e in `a mõ-na-VI`, b.4:726) |
| 7 | A | b.5 e legenda; contraddice fr-etre | `ils ont [i-ZÕ]` | `[il-ZÕ]` (la l non cade davanti a vocale; `i-ZÕ` è solo colloquiale). Nel quiz di b.5:117-120 il distrattore `[i-LÕ]` è sbagliato per un altro motivo, ma la risposta giusta cambia |
| 8 | B | a.2:198 | `qu'est-ce que [kës-kë]` | `[kès-kë]` (come in b.5 dialogo 1 e a.3:493) |
| 9 | B | più sedi | `merci [mér-SI]` | `[mèr-SI]` |
| 10 | B | b.2:44, 188; b.ts:85 | `il vient [viẽ]`, `[viên]` | `[VYẼ]`, `[VYÈN]` |
| 11 | B | b.3, b.5 | `quatre-vingts [ka-tr-VẼ]` | `[ka-trë-VẼ]` |
| 12 | B | b.2:454 | `il y a [i-li-YA]` | `[i-lya]` o `[i-li-ya]` (ma senza sillaba in più) |
| 13 | B | a.3:577 (distrattore) | `quelle [KÈ-lë]` | accettabile come distrattore sbagliato, ma verificare che sia chiaro che `KÈL` è la risposta |
| 15 | B | a.ts:284 | `octobre [ok-TOBR]`, `novembre [no-VÃBR]` | `[ok-TÒBR]`, `[no-VÃBR]` (o aperta: [ɔktɔbʁ], [nɔvɑ̃bʁ]) |
| 16 | B | b.3 (septante/nonante) | `nonante [no-NÃT]` | `[no-NÃT]` con o aperta |
| 17 | C | fr-pron, a.ts:73 | `Noël [no-ÈL]`, `forêt [fo-RÈ]` | in realtà o aperta ([nɔɛl], [fɔʁɛ]); già segnalato come incerto in a.ts:23. Ok come semplificazione |
| 18 | C | b.5 | `UI` (oui) e `ui-FI` (wifi) | ok; solo ricordare che qui `ui` = «uì» italiano, ≠ `üi` di nuit |

Non ho trovato errori nei restanti circa 800 controlli: nasali, ü/ö, liaison z/t/n, consonanti finali dette, `ill`, `gn`, `ch`, `zh`, `h` aspirata, imperativo, futuro/condizionale, passé simple, numeri, mesi, tutte le forme del presente irregolare, gli avverbi, la maggior parte del vocabolario b.4 e dei dialoghi b.5.

Controllati in dettaglio e corretti: liaison `nous avons`, `les amis`, `grand homme [grã-TÒM]`, `neuf ans [nö-VÃ]`, `dix-huit [di-ZÜIT]`, `six heures`, `trois ans [trua-ZÃ]`, `vas-y [va-ZI]`, `parles-en [par-lë-ZÃ]`, `quels amis [kèl-za-MI]`, `les États-Unis [lé-zé-ta-zü-NI]`; e muta in `vendredi`, `mercredi`, `médecin [méd-SẼ]`, `je mangerai [mãzh-RÉ]`; h aspirata `les héros`; s/ss `poison/poisson`; `fils [FIS]`, `femme [FAM]`, `œuf/œufs [ÖF/Ö]`, `os [ÒS/O]`; `février [fév-RYÉ]`, `juin [ZHÜẼ]`, `août [UT]`.

## 3. Trappole dell'italiano: copertura

| Trappola | Coperta? | Dove / cosa manca |
|---|---|---|
| r | sì | fr-pron: tecnica «g dura sfregata». Manca: r finale/dopo consonante (`pauvre`, `quatre`) e che `rr` non si rotola |
| u / ou | sì, molto bene | coppie tu/tout, rue/roue, dessus/dessous, sous/su |
| eu / œu | sì | ö; non distingue ö chiusa (peu) / aperta (peur): dichiarato incerto. Va bene, ma aggiungere una riga |
| nasali contro vocale + n | sì | bon/bonne, fin/fine, un/une. Manca: `en` nasale dopo é/i (`européen`, `examen [èg-za-MẼ]`), `-emm-` = am (`femme`, `évidemment`); l'italiano tende ad aggiungere «ng»; ã reale è più vicino a un'«o» aperta nasale che ad «an» |
| silenziose finali | sì | CaReFuL e eccezioni (`sept`, `huit`, `août`, `fils`, `plus`, `tous`) sparse; manca una tabella delle eccezioni |
| h | sì, ma povera | un solo esempio di h aspirata (`héros`). Aggiungere `haricot`, `honte`, `haut`, `hasard`, `hibou`, `hockey` |
| gn | sì | |
| ill / il | sì | `fille`, `travail`, `ville`, `mille`, `tranquille`. Manca `-eil`, `-euil`, `-ouille` come regola (appaiono solo `soleil`, `feuille` in vocab) |
| s / z / ss | sì | poison/poisson. Manca s dopo consonante (`danse`, `transport`) e `-sion` = zyõ |
| ch / j / g | sì | tabella; manca `ch = k` (`chrétien`, `orchestre`, `chœur`) |
| qu | sì | qui, que, quatre (k+a, non kw) |
| -ent verbi | sì, molto bene | fr-pron q9, fr-presente |
| c / ç | sì | quiz garçon; `ce/ci` ≠ italiano |
| **doppie non raddoppiate** | **NO** | nessuna riga che dica «elle, pomme, appeler, personne: consonante breve, non geminata». Gli italiani dicono `bèl-le`, `pòm-me`. Solo `bonne` ha il caso nasale |
| **sc + e/i** | **NO** | `scène [SÈN]`, `science`, `descendre [dé-SÃDR]`: un italiano legge sc = sh. L'unico «sc» è nella glossa «sh = sc di scena» |
| x | **NO** | `six`, `dix` nel testo dei numeri; manca `ks/gz/s/z`: `examen [èg-za-MẼ]` (b.4 sì, nessuna regola), `exemple`, `deuxième [dö-ZYÈM]`, `soixante` |
| ti = si | NO | `patient`, `initiale`, `démocratie` |
| th, ph | NO | `thé` compare solo in b.5:210 |
| consonanti finali doppie (`PARL`, `TABL`, `KATR`, `LIVR`) | NO | non si dice come pronunciarle senza vocale finale; un italiano aggiunge «-e/-o». Aggiungere «chiudi la parola subito, niente vocale» |
| e muta | parziale | `ë = e debole` può far dire «e» piena. Descrivere: «suono breve tra e ed ö, labbra un po' tonde»; mancano le regole minime (quando cade, quando si mantiene: due consonanti prima) |

## 4. Cosa manca per «dirlo bene»

Elencato per priorità.

1. **Liaison**: fr-pron e b.5:637-638 danno solo «obbligatoria» e «vietata» (dopo et, davanti a h aspirata). Manca:
   - **facoltativa** (dopo verbi: `vous êtes ici`, dopo plurale + aggettivo, dopo molti avverbi): regola pratica per un A1-B2 «lega solo quando è obbligatoria; nel dubbio non legare»;
   - altri casi obbligatori: monosillabi `en`, `dans`, `chez`, `sans`, `très`, `plus`, `bien`; i numerali; `c'est`; `quand il`; i pronomi clitici;
   - altri casi vietati: dopo nome singolare, `onze`, `oui`, tra soggetto nome e verbo;
   - tabella dei suoni: s/x/z → z, d → t (`grand homme`), f → v (`neuf ans`), g → k, n resta nasale;
   - un'avvertenza: **il quiz in b.5** insegna la liaison ma include l'errore `i-ZÕ`.
2. **Ritmo e gruppi ritmici**: un solo paragrafo e un solo esempio (`zhë në sè PA`). Manca una definizione di «gruppo ritmico», esempi di frasi lunghe divise in gruppi, e l'effetto di `ë` che cade (`je ne sais pas` → `zhën sè PA`). Manca la regola contro il vizio italiano: non accentare la penultima.
3. **Intonazione**: assente (`intonaz` compare solo in b.3:273 per il Québec). Aggiungere: affermativa che scende, domanda sì/no che sale (`Ça va ?`), domanda con parola interrogativa che scende, elenco con salita continua e discesa finale.
4. **Coppie minime**: solo 4 in fr-pron (tu/tout, rue/roue, dessus/dessous, deux/doux) e 8 in b.5 drills. Aggiungere: `vin/vent/vain` (stesse nasali ma ẽ ≠ ã), `sans/cent/sang`, `bon/bain/banc`, `poisson/poison`, `père/peur`, `pas/pâte` (A1), `beau/bot`, `mes/mais` (neutralizzato), `le/les`, `de/des`, `su/sous/sue`, `fait/fée`, `peu/peur`. Alcune sono ad ascolto-solo e il corso non ha audio: dare almeno la descrizione articolatoria.
5. **é / è / ê**: coperto bene a livello base (tabella), ma:
   - `et` = é, `-es` = é (`les`, `des`, `mes`) non sono nella tabella;
   - la neutralizzazione `j'ai/je sais/… é/è` e `parlé/parlait` è solo accennata (b.2:254; in b.5:273 la coppia è proposta come «coppia minima» senza avviso che a Parigi molti la fondono).
6. **a / â**: `pâte/patte`, `bas/bât` sono dichiarate uguali nella tabella (a, à, â = «a»); va benissimo per Parigi, ma dirlo esplicitamente come scelta.
7. **ai/é**: tabella ok per ai = è; ma il tema dell'imperfetto/futuro (`-ais` contro `-ai`) è affrontato bene in fr-imparfait; ripeterlo in fr-pron con link.
8. **o aperta/chiusa**: manca la regola (o finale tonica o davanti a z = chiusa: `vélo`, `trop`, `rose`, `chose`; ô/au/eau = chiusa; altrimenti davanti a consonante pronunciata = aperta: `porte`, `homme`, `note`, `dormir`). Con la regola si potrebbe correggere in blocco il punto 8 di §1.
9. **ö aperta / chiusa**: una frase («davanti a r/l pronunciati è più aperta: peur, fleur, sœur, cœur»).
10. **ë (schwa)** vedi §3.
11. **Ordine di studio**: i moduli A usano le trascrizioni senza che il lettore abbia visto le regole di tilde, ü, ö prima del modulo di pronuncia (che è però il primo). Va bene.
12. **Legenda**: PRON_FULL non spiega `ç`, `gn`, `ill`, `tion`, né che un trattino non è una pausa; PRON_SHORT omette «u = italiana». Basta aggiungere due righe.
13. Nessun audio: suggerire sinteticamente (se la piattaforma lo permette) la sintesi vocale del browser per i soli esempi di fr-pron; non è un difetto del testo.

## 5. Elenco correzioni proposte (ordinato per priorità)

**A, da correggere subito**
1. a.ts:286 `moins le quart [mua lë KAR]` → `[muẽ lë KAR]`.
2. b.4 (Corpo, `l'œil / les yeux`) e b.3:299 `lé-ZYË` / `lé-zyë` → `ZYÖ` / `zyö`.
3. b.4 (Lavoro) `l'emploi [lãn-PLUA]` → `[lã-PLUA]`.
4. a.3:44 `si j'avais le temps [si zhé lë TÃ` → `si zha-VÈ lë TÃ`.
5. a.2:38 `nous appelons [nu-za-plë-LÕ]` → `[nu-za-p(ë)-LÕ]`.
6. a.ts:453, 574, 647, 755 `o-nè`, `o-NÈ`, `mo-na-MI` → `õ-nè`, `õ-NÈ`, `mõ-na-MI`.
7. Scegliere `ils ont [il-ZÕ]` e correggere PRON_FULL (b.pron.ts), b.5:117-120, 595, 637, 1014, 1047 e il commento del quiz.

**B, coerenza**
8. Sostituire in tutta la parte B `IÕ/IÉ/IÈ/IẼ/IÃ/SIÕ/TIÉ/PIÉ/ZIÈM/KIÈT` con `YÕ/YÉ/YÈ/YẼ/YÃ/SYÕ/TYÉ/PYÉ/ZYÈM/KYÈT` (b.ts 48-68, 85-87, 251, 270-279, 299; b.2:17, 241, 257; b.3:302; b.4 vocabolario; b.5 dialoghi 2, 3, 5, 8, 9 e frasi chiave).
9. Scegliere `zhé` o `zhè` per j'ai; nota in legenda; applicare a tutti i punti elencati in §1.1.
10. `mér-SI` → `mèr-SI` (6 punti in a.ts).
11. `qu'est-ce que [kës-kë]` → `[kès-kë]` (a.2:198).
12. `viẽ`, `viên` → `VYẼ`, `VYÈN` (b.2:44, 188; b.ts:85).
13. `ka-tr-VẼ` / `ka-tr-vẽ-DIS` → `ka-trë-VẼ` / `ka-trë-vẽ-DIS`.
14. `i-li-YA`, `il ya` → `i-lya`; fusioni `i-lfë-ZÈ` → `i-l fë-ZÈ` oppure `il fë-ZÈ` (con spazio).
15. o aperta: applicare `ò` alle parole di §1.8 oppure, meglio, aggiungere la regola (§4.8) e correggere in blocco.
16. Stesso criterio per la tonica in «de»: `PRÈ dë` / `LUẼ dë` ovunque (o sempre `prè DË`); scegliere.
17. Accorgersi che `voudrais un [zẽ]` (b.2:257) è l'unico caso: uniformare a `ẽ`.
18. `vyèy a-mi` → `vyè-ya-MI`.
19. Aggiungere in legenda: ë = «suono breve tra e ed ö, labbra un po' tonde»; ã = «a nasale aperta e un po' arretrata, vicina a una o»; zh = «una sh con la voce, come la g di “gente” senza la d»; il trattino non è una pausa.

**Contenuto da aggiungere in fr-pron (priorità)**
20. Doppie non raddoppiate; sc + e/i; x; ti = si; ch = k; `en`/`em` nasali dopo é/i e `-emm-`; consonanti finali senza vocale; lista di h aspirate; o aperta/chiusa; ö aperta/chiusa.
21. Sezione liaison: obbligatoria / vietata / facoltativa con tabella dei suoni (z, t, n, v, k) e la regola del dubbio.
22. Sezione intonazione (4 melodie base).
23. Più coppie minime (vin/vent, sans/cent/sang, père/peur, beau/bot, fait/fée, su/sous) con descrizione articolatoria.
24. Nota su neutralizzazioni di Parigi (é/è in -ai, parlé/parlait; a/â; in/un).

## Incerti (non conteggiati come errori)

- `j'ai [zhé]` contro `[zhè]`: entrambi attestati; è un problema di coerenza, non di correttezza.
- `-ais` contro `-ai` (condizionale/futuro): fusi da molti parlanti; il corso lo dice.
- `ö` unica per chiusa e aperta: approssimazione accettabile.
- `voyions [vua-YÕ]`: semplificazione dichiarata.
- `août [UT]` contro `[A-UT]`: la forma moderna con t è corretta.
- `Noël`, `forêt` con o chiusa: semplificazione dichiarata.
- `vingt-et-un` trascritto con tre pause: [vẽ-té-Ẽ] ok.
- `-ent` di `souvent`, `vent` (ã) contro verbi: il corso lo spiega.
