import type { WordEntry } from '../vocab/types'

// Course vocabulary tables. `vtable` is the HTML of every language's `vsec` (heading + narrow 2-column table:
// word [pronunciation] | Italian); `vsecWFor` builds a language's `vsecW(heading, ids)`, which renders the SAME
// HTML from that language's words.ts entries, so a course table can move its rows into words.ts byte-identically.
// Leaf module (type-only import): the pron.ts legends import it and stay free of word lists.

export type VRow = [string, string, string]

export const vtable = (label: string, heading: string, rows: readonly VRow[]): string =>
  `<h3>${heading}</h3><div class="tblw"><table><tr><th>${label}</th><th>Italiano</th></tr>${rows
    .map(([w, pr, it]) => `<tr><td>${w} [${pr}]</td><td>${it}</td></tr>`)
    .join('')}</table></div>`

/** The table row of an entry: its course-table form `t` where set, else the vocab form. */
export const tableRow = (e: WordEntry): VRow => [e.t?.w ?? e.w, e.t?.pron ?? e.pron, e.t?.it ?? e.it]

/** A group of entries shown as ONE table row: each field is the members' table forms joined with ", ". */
export const groupRow = (es: readonly WordEntry[]): VRow => {
  const rows = es.map(tableRow)
  return [0, 1, 2].map((i) => rows.map((r) => r[i]).join(', ')) as unknown as VRow
}

/** `vsecW(heading, rows)` for one language: a row is an id, or an id[] group (one table row, see groupRow); an unknown id throws (caught by the course tests at build time). */
export function vsecWFor(label: string, words: readonly WordEntry[]) {
  const byId = new Map(words.map((e) => [e.id, e]))
  const get = (id: string): WordEntry => {
    const e = byId.get(id)
    if (!e) throw new Error(`vsecW: no word "${id}" in the ${label} words`)
    return e
  }
  return (heading: string, rows: readonly (string | readonly string[])[]): string =>
    vtable(
      label,
      heading,
      rows.map((r) => (typeof r === 'string' ? tableRow(get(r)) : groupRow(r.map(get)))),
    )
}
