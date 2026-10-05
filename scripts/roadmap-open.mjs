// Lists the open tasks of ROADMAP.md ("- [ ]") grouped by section, with line
// numbers, so a session can start from the queue instead of reading 1000 lines.
//   npm run roadmap            all sections with open tasks
//   npm run roadmap -- events  only sections whose heading contains "events"
import { readFileSync } from 'node:fs'

const filter = process.argv[2]?.toLowerCase()
const lines = readFileSync(new URL('../ROADMAP.md', import.meta.url), 'utf8').split('\n')
const sections = []
let current = null
lines.forEach((line, i) => {
  if (/^##\s/.test(line)) {
    current = { heading: line.replace(/^##\s+/, ''), line: i + 1, open: [], done: 0 }
    sections.push(current)
  } else if (current && /^- \[ \]/.test(line)) {
    const title = line.replace(/^- \[ \]\s*/, '').replace(/\*\*/g, '')
    current.open.push({ line: i + 1, title: title.length > 110 ? `${title.slice(0, 107)}…` : title })
  } else if (current && /^- \[x\]/i.test(line)) current.done++
})

const shown = sections.filter((s) => s.open.length && (!filter || s.heading.toLowerCase().includes(filter)))
for (const s of shown) {
  console.log(`\n## ${s.heading}  (ROADMAP.md:${s.line}, ${s.open.length} open, ${s.done} done)`)
  for (const t of s.open) console.log(`  :${t.line}  ${t.title}`)
}
const total = shown.reduce((n, s) => n + s.open.length, 0)
console.log(`\n${total} open task(s) in ${shown.length} section(s). Read a section with: sed -n '<line>,+60p' ROADMAP.md`)
