// Small HTML helpers shared by the tedesco.b.* modules (narrow tables, dialogue lines).

/** Narrow table with any number of columns (keep it to 2-4 for iPhone width). */
export const tbl = (head: string[], rows: string[][]): string =>
  `<div class="tblw"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</table></div>`

/** One dialogue line: speaker, German, pronunciation (without brackets), Italian. */
export const dl = (who: string, de: string, pr: string, it: string): string =>
  `<p><b>${who}</b>: ${de}<br><i>[${pr}]</i><br>${it}</p>`
