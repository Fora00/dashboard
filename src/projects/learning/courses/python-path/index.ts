import type { Course } from '../../types'
import { basics, collections, errors, functions, jsmap, setup } from './base'
import { drills, concurrency, database, testing, tooling, web } from './backend'
import { datamodel, idioms, internals, memory, modern } from './master1'
import { advasync, advtyping, algos, datasci, imports, metaprog, patterns, prod } from './master2'
import { djangoInternals, native, publish, queues } from './extra'
import { observability, redis, review, security, sqldeep, sysdesign } from './senior'
import { architecture, deploy, perf } from './arch'
import { capstone, drills2, interview } from './finale'
import { deepDive } from './deep'
import { classes, decorators, inherit, iterators, stdlib, typing } from './pythonic'

// Hand-written Python path (2026-11-05), meant to be read offline on a trip.
export const pythonPath: Course = {
  id: 'python-path',
  title: 'Python: percorso completo',
  emoji: '🐍',
  summary: 'Da JS/TS a Python per il backend: base, oggetti, stile pythonic, API, test e deploy. Tutto offline.',
  intro:
    "Percorso in 4 tappe per chi viene da JS/TS: le basi del linguaggio, classi e tipi, lo stile pythonic (generatori, decorator, libreria standard) e il backend (test, asyncio, FastAPI, database, tooling). Ogni modulo ha lezione breve, quiz, flashcard ed esercizi a voce o su carta. Segui l'ordine; 1 o 2 moduli al giorno bastano.",
  groups: [
    { id: 'base', label: '1. Le basi' },
    { id: 'oop', label: '2. Oggetti e tipi' },
    { id: 'pythonic', label: '3. Python idiomatico' },
    { id: 'backend', label: '4. Backend' },
    { id: 'master', label: '5. Da esperto' },
    { id: 'finale', label: 'Allenamento' },
  ],
  modules: [
    jsmap,
    setup,
    basics,
    collections,
    functions,
    errors,
    classes,
    inherit,
    iterators,
    decorators,
    typing,
    advtyping,
    stdlib,
    testing,
    concurrency,
    advasync,
    web,
    database,
    sqldeep,
    redis,
    tooling,
    datamodel,
    memory,
    idioms,
    modern,
    internals,
    perf,
    imports,
    algos,
    patterns,
    architecture,
    metaprog,
    prod,
    security,
    observability,
    deploy,
    djangoInternals,
    queues,
    drills,
    drills2,
    native,
    publish,
    datasci,
    sysdesign,
    review,
    capstone,
    interview,
  ].map((m) => (deepDive[m.id] ? { ...m, lesson: m.lesson + deepDive[m.id] } : m)),
  notes: [
    'Scritto per Python 3.11 o più recente. Gli esempi sono brevi: riscrivili a mano invece di copiarli.',
    'Le versioni delle librerie (FastAPI, SQLAlchemy 2.x, Pydantic 2) cambiano: se un esempio non gira, controlla la documentazione ufficiale quando sei online.',
  ],
}
