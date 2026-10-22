// Hand-written modules added after the prototype extraction, from what Farina
// said in chat on 2026-10-22 (the generated .modules.ts file stays untouched).
import type { CourseModule } from '../types'

export const langs: CourseModule = {
  id: 'langs',
  title: 'Altri linguaggi: Go, Rust, Python, Java',
  subtitle: 'Non devi scriverli: devi sapere a cosa servono e cosa cambia rispetto a Node',
  group: 'stack',
  vault:
    'Nessuna nota collegata: modulo scritto da quello che ha detto Farina (qualche componente in Go, Rust, Python o Java).',
  lesson:
    '<p class="lead">Lo stack è soprattutto JS, ma qua e là ci sono componenti in altri linguaggi. Al colloquio non ti chiederanno di scriverli: vogliono capire se sai ragionare sulle differenze.</p>' +
    '<h3>La mappa in una tabella</h3><div class="tblw"><table><tr><th></th><th>Go</th><th>Rust</th><th>Python</th><th>Java</th></tr>' +
    '<tr><td>Tipi</td><td>statici</td><td>statici, molto stretti</td><td>dinamici (type hint opzionali)</td><td>statici</td></tr>' +
    '<tr><td>Esecuzione</td><td>compilato, binario unico</td><td>compilato, senza GC</td><td>interpretato (CPython)</td><td>bytecode sulla JVM, con GC</td></tr>' +
    '<tr><td>Concorrenza</td><td>goroutine e canali</td><td>thread, async, ownership</td><td>asyncio; il GIL limita i thread sulla CPU</td><td>thread, pool, virtual thread</td></tr>' +
    '<tr><td>Dove si vede</td><td>servizi di rete, CLI, infrastruttura</td><td>parti critiche per prestazioni, parser, tool</td><td>script, dati, ML, worker</td><td>sistemi enterprise, grandi basi di codice</td></tr></table></div>' +
    '<h3>Go</h3><ul><li>Linguaggio piccolo e volutamente semplice. Un binario statico, facile da mettere in un container.</li><li>Gli errori sono <b>valori</b> restituiti (<code>if err != nil</code>), non eccezioni.</li><li>Concorrenza leggera: una <b>goroutine</b> costa pochi KB e i canali passano i dati tra loro.</li></ul>' +
    '<pre><code>ch := make(chan int)\ngo func() { ch &lt;- 42 }()\nfmt.Println(&lt;-ch) // 42</code></pre>' +
    '<h3>Rust</h3><ul><li>Niente garbage collector: la memoria è gestita da <b>ownership</b> e <b>borrowing</b>, controllati dal compilatore.</li><li>Il compilatore rifiuta data race e uso di memoria già liberata. Il prezzo è una curva di apprendimento ripida.</li><li>Si sceglie dove contano prestazioni e prevedibilità.</li></ul>' +
    '<h3>Python</h3><ul><li>Leggibile e veloce da scrivere; ottimo per script, dati e worker.</li><li>Il <b>GIL</b> di CPython fa eseguire un solo thread di bytecode alla volta: per lavoro CPU-bound servono processi, non thread. Per l’I/O va bene <code>asyncio</code>, come l’event loop di Node.</li></ul>' +
    '<h3>Java</h3><ul><li>Gira sulla <b>JVM</b>, con un garbage collector maturo e un ecosistema enorme (Spring è il framework più diffuso).</li><li>Più verboso, ma tipi forti e strumenti solidi lo rendono comune nei sistemi grandi e longevi.</li></ul>' +
    '<div class="say"><b>Cosa dire.</b> «Io vengo da JS/TS e quei linguaggi non li ho usati in produzione, ma so perché un team li sceglie: Go per servizi semplici e concorrenti, Rust dove serve controllo sulla memoria, Python per script e dati, Java per sistemi grandi. Mi adatto leggendo il codice.»</div>',
  quiz: [
    {
      id: 'q1',
      q: 'Quale di questi linguaggi usa goroutine e canali per la concorrenza?',
      options: ['Rust', 'Go', 'Python', 'Java'],
      answer: 1,
      explanation: 'Sono il modello di concorrenza di Go: goroutine leggere che comunicano attraverso canali.',
    },
    {
      id: 'q2',
      q: 'Che cosa garantisce il compilatore di Rust grazie a ownership e borrowing?',
      options: [
        'Niente data race e niente uso di memoria già liberata, già in compilazione',
        'Un garbage collector più veloce di quello di Java',
        'Esecuzione su una macchina virtuale',
        'Tipi dinamici come in Python',
      ],
      answer: 0,
      explanation:
        'Rust non ha garbage collector: è il compilatore a rifiutare i programmi che violerebbero la sicurezza della memoria.',
    },
    {
      id: 'q3',
      q: 'Perché in CPython i thread non accelerano un lavoro CPU-bound?',
      options: [
        'Python non supporta i thread',
        'I thread esistono solo su Windows',
        'Il GIL lascia eseguire un solo thread di bytecode alla volta',
        'Serve per forza async/await',
      ],
      answer: 2,
      explanation:
        'Per il calcolo si usano più processi (multiprocessing). Per l’I/O i thread e asyncio funzionano bene, perché il GIL viene rilasciato in attesa.',
    },
    {
      id: 'q4',
      q: 'Quale linguaggio gira sulla JVM e ha Spring come framework più diffuso?',
      options: ['Go', 'Rust', 'Python', 'Java'],
      answer: 3,
      explanation:
        'Java (e altri linguaggi JVM come Kotlin). Il bytecode è eseguito dalla JVM, con garbage collection.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Go in una frase',
      back: 'Linguaggio compilato e semplice, con goroutine e canali per la concorrenza e un binario unico: ottimo per servizi di rete.',
    },
    {
      id: 'c2',
      front: 'Cosa sono ownership e borrowing in Rust?',
      back: 'Ogni valore ha un solo proprietario; si può prestare (borrow) in lettura a molti o in scrittura a uno. Il compilatore lo verifica, così non servono GC né si hanno data race.',
    },
    {
      id: 'c3',
      front: 'Cos’è il GIL di Python?',
      back: 'Il lock di CPython che permette a un solo thread di eseguire bytecode alla volta. Per CPU-bound si usano processi; per I/O thread o asyncio.',
    },
    {
      id: 'c4',
      front: 'Differenza tra un runtime con GC (JVM, Go) e Rust?',
      back: 'Con il GC un processo recupera la memoria a runtime, con possibili pause. Rust la libera a compile time con l’ownership: niente pause, ma più lavoro per chi scrive.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Nel team ci sono componenti in Go o Rust e tu vieni da JS/TS. Cosa dici?',
      answer:
        'Che non li hai usati in produzione, ma sai cosa sono e perché si scelgono (Go per servizi semplici e concorrenti, Rust per prestazioni e controllo sulla memoria). Porta un ponte: i concetti (HTTP, code, transazioni) sono gli stessi, cambia la sintassi. Aggiungi che sei abituato a leggere codice altrui e a imparare in fretta.',
    },
    {
      id: 'p2',
      question: 'Quando sceglieresti Go o Rust al posto di Node per un servizio?',
      answer:
        'Node va bene per I/O e per condividere tipi con il frontend. Un lavoro CPU-bound o con requisiti di latenza stretti, o un tool distribuito come singolo binario, spinge verso Go; se serve il massimo controllo su memoria e prestazioni, Rust. Con Node si può comunque isolare il lavoro pesante in worker_threads o in un servizio separato.',
    },
  ],
}

export const gaps: CourseModule = {
  id: 'gaps',
  title: 'Cosa dire su ciò che non conosci',
  subtitle: 'Mongo, Fastify, RabbitMQ, Helm: quanto basta e come ammetterlo bene',
  group: 'finale',
  vault: 'Nessuna nota collegata: modulo scritto dalle indicazioni di Farina (chat del 22/10/2026).',
  lesson:
    '<p class="lead">Farina ha detto che di Fastify, Mongo e Helm serve poco, e che RabbitMQ non lo usa quasi nessuno. Il punto non è fingere: è dire cosa sai, collegarlo a quello che usi già e mostrare come imparerai il resto.</p>' +
    '<h3>Una frase per tecnologia</h3><div class="tblw"><table><tr><th>Tecnologia</th><th>Cosa dire</th><th>Ponte con quello che sai</th></tr>' +
    '<tr><td>Fastify</td><td>Framework HTTP per Node, simile a Express, con plugin e validazione via JSON Schema.</td><td>Route e middleware li usi già; cambiano l’API e il sistema di plugin.</td></tr>' +
    '<tr><td>MongoDB</td><td>Database a documenti: oggetti JSON-like in collezioni, senza schema rigido.</td><td>Ragioni già in JSON; chiediti quando uno schema flessibile aiuta e quando serve Postgres.</td></tr>' +
    '<tr><td>RabbitMQ</td><td>Broker di messaggi: i produttori pubblicano su un exchange, che instrada alle code; i consumer confermano con ack.</td><td>Come una coda di job (BullMQ nel vault) ma con broker esterno.</td></tr>' +
    '<tr><td>Helm</td><td>Gestore di pacchetti per Kubernetes: un chart è un insieme di template di manifest parametrizzati da values.</td><td>Hai sentito il termine e sai che c’entra con Kubernetes; i deploy non li hai gestiti.</td></tr></table></div>' +
    '<h3>Come rispondere onestamente</h3><ol><li>Dì chiaramente che non l’hai usato in produzione.</li><li>Spiega cosa fa in una frase, per mostrare che non è un nome sconosciuto.</li><li>Collegalo a qualcosa che conosci davvero.</li><li>Dì come lo impareresti: documentazione, un piccolo progetto, chiedere al team.</li></ol>' +
    '<div class="say"><b>Esempio.</b> «Helm l’ho sentito: so che impacchetta i manifest di Kubernetes con dei values per ogni ambiente. Finora non mi sono occupato dei deploy, ma è una parte che mi interessa imparare.»</div>',
  quiz: [
    {
      id: 'q1',
      q: 'Ti chiedono di una tecnologia che non hai mai usato. Qual è la risposta migliore?',
      options: [
        'Dire che la conosci per non sembrare impreparato',
        'Dire che non l’hai usata, spiegare cosa fa, collegarla a ciò che sai e come la impareresti',
        'Cambiare discorso',
        'Dire che non ti interessa',
      ],
      answer: 1,
      explanation:
        'L’onestà più un ponte con ciò che conosci e un piano per imparare è molto più credibile di un bluff, che si smaschera alla seconda domanda.',
    },
    {
      id: 'q2',
      q: 'Che cos’è un chart di Helm?',
      options: [
        'Un database per Kubernetes',
        'Un sistema di monitoraggio dei pod',
        'Un pacchetto di template di manifest Kubernetes parametrizzati con i values',
        'Un registro di immagini Docker',
      ],
      answer: 2,
      explanation:
        'Helm è il gestore di pacchetti di Kubernetes: lo stesso chart si installa in ambienti diversi cambiando i values.',
    },
    {
      id: 'q3',
      q: 'Come descrivi Fastify a chi conosce Express?',
      options: [
        'Stesso modello di route e middleware/plugin, con validazione tramite JSON Schema e prestazioni migliori',
        'Un framework per il frontend',
        'Un ORM per Postgres',
        'Un broker di messaggi',
      ],
      answer: 0,
      explanation:
        'È un framework HTTP per Node come Express: cambiano il sistema di plugin e il fatto che schemi di validazione e serializzazione siano di prima classe.',
    },
    {
      id: 'q4',
      q: 'Che cos’è un documento in MongoDB?',
      options: [
        'Una riga di una tabella con colonne fisse',
        'Un file PDF salvato nel database',
        'Una coppia chiave-valore senza struttura',
        'Un oggetto JSON-like (BSON) dentro una collezione, senza schema rigido',
      ],
      answer: 3,
      explanation:
        'I documenti stanno in collezioni e possono avere campi diversi tra loro. Si interrogano per campo e si velocizzano con gli indici.',
    },
  ],
  cards: [
    {
      id: 'c1',
      front: 'Mongo in una frase (da dire al colloquio)',
      back: 'Database a documenti JSON-like in collezioni, senza schema rigido. Comodo per dati annidati e che cambiano forma; per relazioni e transazioni complesse Postgres è più adatto.',
    },
    {
      id: 'c2',
      front: 'Fastify rispetto a Express',
      back: 'Stesso ruolo (framework HTTP per Node). Plugin con incapsulamento, validazione e serializzazione con JSON Schema, più veloce.',
    },
    {
      id: 'c3',
      front: 'RabbitMQ: il percorso di un messaggio',
      back: 'Il produttore pubblica su un exchange, che lo instrada a una o più code in base a binding e routing key; il consumer lo legge e conferma con ack (altrimenti viene riconsegnato).',
    },
    {
      id: 'c4',
      front: 'Cosa dici su Helm se non hai mai fatto deploy?',
      back: 'Che l’hai sentito, che sai che è il package manager di Kubernetes (chart + values per ambiente) e che i deploy finora non erano una tua responsabilità, ma vuoi impararli.',
    },
  ],
  practice: [
    {
      id: 'p1',
      question: 'Ti chiedono: «Hai mai usato RabbitMQ?» Rispondi come in colloquio.',
      answer:
        'No, mai in produzione. Spiega che è un broker di messaggi con exchange, code e ack, e collegalo a quello che hai usato (code di job come BullMQ). Aggiungi quando una coda serve: lavoro asincrono, retry, disaccoppiare servizi.',
    },
    {
      id: 'p2',
      question: 'Sei un frontender: come presenti la tua esperienza con Mongo e con i deploy?',
      answer:
        'Mongo: lo hai usato in passato, ma da tempo; conosci l’idea dei documenti JSON e sai che per relazioni forti preferisci Postgres. Deploy: non te ne sei occupato, ma conosci i concetti (container, Kubernetes, Helm come pacchetto di manifest) e ti interessa imparare. Mostra curiosità, non scuse.',
    },
  ],
}
