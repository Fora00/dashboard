import { db, type Todo } from './db'
import { createCloudSync, type TableSync } from './cloudSync'

// Local-first sync for the todo project, built on the generic engine in
// cloudSync.ts. This is the REFERENCE integration for wiring a project to
// cloud sync — climbing and habits copy this file's shape:
//   1. define the remote row type + a TableSync per table (mappers, columns),
//   2. createCloudSync({ projectId, tables }),
//   3. export mutation helpers the UI calls instead of raw Dexie writes,
//   4. export start<Project>Sync = engine.start and wire it in App.tsx.

interface TodoRow {
  id: string
  text: string
  done: boolean
  created_at: number
  updated_at: number
}

const todosTable: TableSync<Todo, TodoRow> = {
  remote: 'todos',
  table: () => db.todos,
  columns: 'id, text, done, created_at, updated_at',
  realtime: true,
  updatedAt: (t) => t.updatedAt,
  toRow: (t) => ({
    id: t.id,
    text: t.text,
    done: t.done === 1,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    text: r.text,
    done: r.done ? 1 : 0,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }),
}

const engine = createCloudSync({
  projectId: 'todo',
  tables: [todosTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addTodo(text: string): Promise<void> {
  const now = Date.now()
  const todo: Todo = {
    id: crypto.randomUUID(),
    text,
    done: 0,
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('todos', todo)
}

export async function toggleTodo(todo: Todo): Promise<void> {
  const updated: Todo = {
    ...todo,
    done: todo.done === 0 ? 1 : 0,
    updatedAt: Date.now(),
  }
  await engine.upsert('todos', updated)
}

export async function deleteTodo(id: string): Promise<void> {
  await engine.remove('todos', id)
}

export async function clearDoneTodos(): Promise<void> {
  const done = await db.todos.where('done').equals(1).toArray()
  await engine.removeMany('todos', done.map((t) => t.id))
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** Start syncing (call when a session exists). Returns a stop function. */
export const startTodoSync = engine.start
