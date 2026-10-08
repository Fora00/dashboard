// Renders the app icon + per-project icons to PNG. Run manually (see README.md).
// Needs `sharp` (NOT a repo dependency: install it outside the repo and set NODE_PATH)
// and the Lucide SVG sources (LUCIDE_DIR = .../lucide-static/icons).
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const lucideDir = process.env.LUCIDE_DIR
if (!lucideDir) throw new Error('Set LUCIDE_DIR to the folder holding the Lucide <name>.svg files')
const nodePath = (process.env.NODE_PATH ?? '').split(':').filter(Boolean)
let sharp
for (const p of nodePath) {
  try {
    sharp = createRequire(pathToFileURL(join(p, 'x.js')))('sharp')
    break
  } catch {
    /* try next */
  }
}
if (!sharp) throw new Error('sharp not found: install it outside the repo and set NODE_PATH')

const choice = JSON.parse(readFileSync(join(here, 'choice.json'), 'utf8'))
const out = join(root, 'public/icons')
mkdirSync(join(out, 'projects'), { recursive: true })

// Hub artwork (512 viewBox). `bg` draws the background rect; rx 0 = full bleed.
const art = (rx) =>
  `<defs><radialGradient id="gb" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#0f172a"/></radialGradient></defs><rect width="512" height="512" rx="${rx}" fill="url(#gb)"/>`
const nodes = `<g stroke="#a5b4fc" stroke-width="10" stroke-linecap="round" opacity=".55"><line x1="256" y1="256" x2="256" y2="112"/><line x1="256" y1="256" x2="393" y2="211"/><line x1="256" y1="256" x2="341" y2="372"/><line x1="256" y1="256" x2="171" y2="372"/><line x1="256" y1="256" x2="119" y2="211"/></g><circle cx="256" cy="256" r="52" fill="#fff"/><circle cx="256" cy="112" r="28" fill="#38bdf8"/><circle cx="393" cy="211" r="28" fill="#34d399"/><circle cx="341" cy="372" r="28" fill="#fbbf24"/><circle cx="171" cy="372" r="28" fill="#f472b6"/><circle cx="119" cy="211" r="28" fill="#a78bfa"/>`
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${inner}</svg>`

const iconSvg = svg(art(112) + nodes)
writeFileSync(join(out, 'icon.svg'), iconSvg + '\n')
const png = (s, size, file) => sharp(Buffer.from(s), { density: 384 }).resize(size, size).png().toFile(join(out, file))

await png(iconSvg, 192, 'icon-192.png')
await png(iconSvg, 512, 'icon-512.png')
// Maskable: full-bleed background, artwork scaled into the central 80% safe zone.
await png(svg(art(0) + `<g transform="translate(51.2 51.2) scale(.8)">${nodes}</g>`), 512, 'icon-maskable-512.png')
// iOS masks apple-touch-icon itself: opaque full-bleed square.
await png(svg(art(0) + nodes), 180, 'apple-touch-icon.png')

// Per-project tiles.
const mix = (hex, to, t) => {
  const c = (i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
  return (
    '#' +
    [0, 1, 2]
      .map((i) =>
        Math.round(c(i) + (to - c(i)) * t)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}
for (const [id, p] of Object.entries(choice.projects)) {
  const area = choice.areas[p.area].color
  const lucide = readFileSync(join(lucideDir, `${p.icon}.svg`), 'utf8')
  const body = lucide.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  const s = 180 * 0.58 // icon size
  const k = s / 24
  const o = (180 - s) / 2
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(area, 255, 0.18)}"/><stop offset="1" stop-color="${mix(area, 0, 0.22)}"/></linearGradient></defs><rect width="180" height="180" fill="url(#g)"/><g transform="translate(${o} ${o}) scale(${k})" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g><circle cx="148" cy="148" r="15" fill="${p.color}" stroke="#fff" stroke-width="4"/></svg>`
  await sharp(Buffer.from(tile), { density: 288 })
    .resize(180, 180)
    .png()
    .toFile(join(out, 'projects', `${id}.png`))
}
console.log('done')
