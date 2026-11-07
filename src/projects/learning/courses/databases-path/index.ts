import type { Course } from '../../types'
import { dbIntro, design, explain, indexes, sqlAdv, sqlBase, sqlWrite } from './a'
import { cachecdc, dbsecurity, dbtest, workloads } from './extra'
import { dbDrills, dbInterview, locks, migrations, nosql, orm, pgops, scaling, transactions } from './b'

// Hand-written database course (2026-11-05), for reading offline.
export const databasesPath: Course = {
  id: 'databases-path',
  title: 'Database: dal SQL a Postgres in produzione',
  emoji: '🗄️',
  summary:
    'SQL, schema, indici, transazioni, Postgres operativo, NoSQL e ORM, con esercizi e domande da colloquio. Offline.',
  intro:
    'Percorso sui database per chi sviluppa backend: dalle basi di SQL e dalla progettazione dello schema agli indici, alle transazioni e ai lock, fino a Postgres in produzione (vacuum, repliche, backup, migrazioni senza downtime), e poi NoSQL e ORM. Ogni modulo ha lezione, quiz, flashcard ed esercizi con soluzione. I moduli sono pensati per essere letti in ordine, uno o due al giorno.',
  groups: [
    { id: 'fond', label: '1. Fondamenti e schema' },
    { id: 'sql', label: '2. SQL e prestazioni' },
    { id: 'tx', label: '3. Transazioni e concorrenza' },
    { id: 'ops', label: '4. Postgres in produzione' },
    { id: 'beyond', label: '5. Oltre il relazionale e ORM' },
    { id: 'pratica', label: 'Allenamento' },
  ],
  modules: [
    dbIntro,
    sqlBase,
    sqlWrite,
    design,
    sqlAdv,
    indexes,
    explain,
    transactions,
    locks,
    pgops,
    dbsecurity,
    scaling,
    migrations,
    cachecdc,
    nosql,
    workloads,
    orm,
    dbtest,
    dbDrills,
    dbInterview,
  ],
  notes: [
    'Gli esempi sono per PostgreSQL (la sintassi di altri database può differire). Provali in un database di prova con psql o un client grafico.',
    'Le impostazioni (memoria, autovacuum, pooling) vanno sempre misurate sul tuo carico: i numeri nel corso sono punti di partenza.',
  ],
}
