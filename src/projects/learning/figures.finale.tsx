import type { ReactNode } from 'react'
import { arc, Dot, DASH, f, S, Svg, T } from './figureKit'

/* oxlint-disable react/only-export-components -- figure data file */

// Figures for the 'finale' batch of the drawing course. Helpers live in ./figureKit.
// Everything geometric (thirds, rotations, bezier points) is computed here.

const L = '#e5e5e5'
const M = '#9a9a9a'
const D = '#3a3a3a'

/** Simple schematic tree: round crown on a trunk standing on (x, base). */
function Tree({
  x,
  base,
  crown = 17,
  crownFill = M,
  trunk = 26,
}: {
  x: number
  base: number
  crown?: number
  crownFill?: string
  trunk?: number
}) {
  const cy = base - trunk - crown * 0.6
  return (
    <g>
      <path d={`M${f(x)} ${f(base)} L${f(x)} ${f(cy)}`} {...S} strokeWidth={4} />
      <circle cx={f(x)} cy={f(cy)} r={crown} fill={crownFill} stroke="currentColor" strokeWidth={2.5} />
    </g>
  )
}

// ---- rule of thirds ---------------------------------------------------------
const terzi = (() => {
  const x0 = 30
  const y0 = 18
  const w = 360
  const h = 240
  const gx = [1, 2].map((i) => x0 + (w * i) / 3)
  const gy = [1, 2].map((i) => y0 + (h * i) / 3)
  const horizon = gy[1]!
  const pts = gx.flatMap((x) => gy.map((y) => ({ x, y })))
  return (
    <Svg
      w={420}
      h={300}
      label="Un rettangolo diviso in terzi con i quattro punti forti; il sole su un punto e un albero sul punto in basso a destra"
    >
      <rect x={x0} y={f(horizon)} width={w} height={f(y0 + h - horizon)} fill={M} fillOpacity={0.5} />
      <rect x={x0} y={y0} width={w} height={h} {...S} />
      {gx.map((x) => (
        <path key={`v${x}`} d={`M${f(x)} ${y0} L${f(x)} ${y0 + h}`} {...DASH} />
      ))}
      {gy.map((y) => (
        <path key={`h${y}`} d={`M${x0} ${f(y)} L${x0 + w} ${f(y)}`} {...DASH} />
      ))}
      <circle cx={f(gx[0]!)} cy={f(gy[0]!)} r={16} fill={L} stroke="currentColor" strokeWidth={2.5} />
      <Tree x={gx[1]!} base={horizon} />
      {pts.map((p, i) => (
        <circle key={i} cx={f(p.x)} cy={f(p.y)} r={6} fill="none" stroke="currentColor" strokeWidth={2} opacity={0.9} />
      ))}
      <text x={210} y={284} {...T}>
        4 punti forti: il soggetto va qui, non al centro
      </text>
    </Svg>
  )
})()

// ---- three planes -----------------------------------------------------------
const piani = (() => {
  const x0 = 30
  const w = 360
  const bh = 60
  const bands = [
    { y: 18, fill: L, label: 'sfondo: chiaro', tree: 22, text: '#111' },
    { y: 18 + bh, fill: M, label: 'medio: medio', tree: 36, text: '#111' },
    { y: 18 + bh * 2, fill: D, label: 'primo piano: scuro', tree: 54, text: '#fff' },
  ]
  return (
    <Svg
      w={420}
      h={235}
      label="Tre bande: sfondo chiaro con un albero piccolo, piano medio grigio con albero medio, primo piano scuro con albero grande"
    >
      {bands.map((b) => (
        <g key={b.label}>
          <rect x={x0} y={b.y} width={w} height={bh} fill={b.fill} />
          <text x={x0 + 12} y={b.y + bh / 2 + 5} {...T} fill={b.text} textAnchor="start">
            {b.label}
          </text>
          <path
            d={`M${x0 + 300} ${b.y + bh} L${x0 + 300 - b.tree * 0.45} ${b.y + bh} L${x0 + 300} ${f(b.y + bh - b.tree)} L${f(x0 + 300 + b.tree * 0.45)} ${b.y + bh} Z`}
            fill="none"
            stroke={b.text}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </g>
      ))}
      <rect x={x0} y={18} width={w} height={bh * 3} {...S} />
      <text x={210} y={225} {...T}>
        più vicino = più scuro, più grande, più dettaglio
      </text>
    </Svg>
  )
})()

// ---- thumbnails in 3 values -------------------------------------------------
const thumbs = (() => {
  const fw = 118
  const fh = 100
  const y = 14
  const sets = [
    { sky: L, ground: M, tree: D, name: 'A' },
    { sky: M, ground: D, tree: L, name: 'B' },
    { sky: D, ground: L, tree: M, name: 'C' },
  ]
  const legend = [
    { fill: L, t: 'chiaro' },
    { fill: M, t: 'medio' },
    { fill: D, t: 'scuro' },
  ]
  return (
    <Svg
      w={420}
      h={190}
      label="Tre bozzetti piccoli della stessa scena, un albero su un prato, con i tre valori chiaro, medio e scuro distribuiti in modo diverso"
    >
      {sets.map((s, i) => {
        const x = 14 + i * (fw + 19)
        const horizon = y + (fh * 2) / 3
        return (
          <g key={s.name}>
            <rect x={x} y={y} width={fw} height={fh} fill={s.sky} />
            <rect x={x} y={f(horizon)} width={fw} height={f(y + fh - horizon)} fill={s.ground} />
            <Tree x={x + (fw * 2) / 3} base={horizon} crown={15} crownFill={s.tree} trunk={20} />
            <rect x={x} y={y} width={fw} height={fh} {...S} />
            <text x={x + fw / 2} y={y + fh + 24} {...T}>
              {s.name}
            </text>
          </g>
        )
      })}
      {legend.map((l, i) => (
        <g key={l.t}>
          <rect x={64 + i * 110} y={158} width={18} height={18} fill={l.fill} stroke="currentColor" strokeWidth={1.5} />
          <text x={64 + i * 110 + 26} y={172} {...T} textAnchor="start">
            {l.t}
          </text>
        </g>
      ))}
    </Svg>
  )
})()

// ---- block mannequin with line of action --------------------------------------
const manichino = (() => {
  const P0 = { x: 250, y: 60 }
  const C = { x: 160, y: 190 }
  const P1 = { x: 240, y: 330 }
  const B = (t: number) => ({
    x: (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * C.x + t * t * P1.x,
    y: (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * C.y + t * t * P1.y,
  })
  const dB = (t: number) => {
    const dx = 2 * (1 - t) * (C.x - P0.x) + 2 * t * (P1.x - C.x)
    const dy = 2 * (1 - t) * (C.y - P0.y) + 2 * t * (P1.y - C.y)
    const l = Math.hypot(dx, dy)
    return { x: dx / l, y: dy / l }
  }
  const head = B(0.03)
  const uH = dB(0.03)
  const chest = B(0.28)
  const uC = dB(0.28)
  const pelvis = B(0.55)
  const uP = dB(0.55)
  const deg = (u: { x: number; y: number }) => (Math.atan2(u.y, u.x) * 180) / Math.PI - 90
  const nrm = (u: { x: number; y: number }) => ({ x: -u.y, y: u.x })
  const nC = nrm(uC)
  const nP = nrm(uP)
  const add = (p: { x: number; y: number }, u: { x: number; y: number }, k: number) => ({
    x: p.x + u.x * k,
    y: p.y + u.y * k,
  })
  const pl = (...p: { x: number; y: number }[]) => p.map((q) => `${f(q.x)} ${f(q.y)}`).join(' L')
  const shoulderA = add(add(chest, uC, -28), nC, 31)
  const shoulderB = add(add(chest, uC, -28), nC, -31)
  const hipA = add(add(pelvis, uP, 10), nP, 14)
  const hipB = add(add(pelvis, uP, 10), nP, -14)
  const footA = { x: P1.x - 24, y: 332 }
  const footB = { x: P1.x + 24, y: 326 }
  const kneeA = { x: (hipA.x + footA.x) / 2 - 14, y: (hipA.y + footA.y) / 2 }
  const kneeB = { x: (hipB.x + footB.x) / 2 + 16, y: (hipB.y + footB.y) / 2 }
  const elbowA = { x: shoulderA.x - 22, y: shoulderA.y + 38 }
  const handA = { x: shoulderA.x - 36, y: shoulderA.y + 80 }
  const elbowB = { x: shoulderB.x + 26, y: shoulderB.y + 36 }
  const handB = { x: shoulderB.x + 40, y: shoulderB.y + 74 }
  const joints = [shoulderA, shoulderB, elbowA, elbowB, kneeA, kneeB, hipA, hipB]
  return (
    <Svg
      w={420}
      h={385}
      label="Manichino a blocchi: testa ovale, torace e bacino come blocchi inclinati, braccia e gambe come linee con giunture, e una linea d'azione curva lungo la schiena"
    >
      <path d={`M${pl(shoulderA, elbowA, handA)}`} {...S} />
      <path d={`M${pl(hipA, kneeA, footA)}`} {...S} />
      <ellipse
        cx={f(head.x)}
        cy={f(head.y)}
        rx={20}
        ry={25}
        transform={`rotate(${f(deg(uH))} ${f(head.x)} ${f(head.y)})`}
        fill={L}
        stroke="currentColor"
        strokeWidth={2.5}
      />
      <path d={`M${pl(add(head, uH, 24), add(chest, uC, -38))}`} {...S} />
      <rect
        x={f(chest.x - 31)}
        y={f(chest.y - 39)}
        width={62}
        height={78}
        rx={10}
        transform={`rotate(${f(deg(uC))} ${f(chest.x)} ${f(chest.y)})`}
        fill={M}
        fillOpacity={0.55}
        stroke="currentColor"
        strokeWidth={2.5}
      />
      <rect
        x={f(pelvis.x - 28)}
        y={f(pelvis.y - 20)}
        width={56}
        height={40}
        rx={8}
        transform={`rotate(${f(deg(uP))} ${f(pelvis.x)} ${f(pelvis.y)})`}
        fill={D}
        fillOpacity={0.55}
        stroke="currentColor"
        strokeWidth={2.5}
      />
      <path d={`M${pl(chest, pelvis)}`} {...DASH} opacity={0} />
      <path d={`M${pl(shoulderB, elbowB, handB)}`} {...S} />
      <path d={`M${pl(hipB, kneeB, footB)}`} {...S} />
      {joints.map((p, i) => (
        <circle key={i} cx={f(p.x)} cy={f(p.y)} r={5} fill="#fff" stroke="#222" strokeWidth={1.5} />
      ))}
      <path
        d={`M${P0.x} ${P0.y - 36} Q${C.x - 4} ${C.y} ${P1.x} ${P1.y + 8}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeDasharray="9 6"
        strokeLinecap="round"
      />
      <Dot x={f(head.x)} y={f(head.y)} n={1} />
      <Dot x={f(chest.x)} y={f(chest.y)} n={2} />
      <Dot x={f(pelvis.x)} y={f(pelvis.y)} n={3} />
      <text x={210} y={360} {...T}>
        1 testa · 2 torace · 3 bacino
      </text>
      <text x={210} y={380} {...T}>
        tratteggio = linea d'azione
      </text>
    </Svg>
  )
})()

// ---- hand: box + cylinders in 3 steps -----------------------------------------
function Cyl({ x, y, len, wid, ang }: { x: number; y: number; len: number; wid: number; ang: number }) {
  return (
    <rect
      x={f(-wid / 2)}
      y={f(-len)}
      width={wid}
      height={len}
      rx={wid / 2}
      transform={`translate(${f(x)} ${f(y)}) rotate(${ang})`}
      fill="#9a9a9a"
      fillOpacity={0.4}
      stroke="currentColor"
      strokeWidth={2}
    />
  )
}

const mano = (() => {
  const pw = 126
  const fingers = [
    { dx: 7, len: 52, ang: -12 },
    { dx: 19, len: 60, ang: -4 },
    { dx: 31, len: 56, ang: 4 },
    { dx: 43, len: 44, ang: 12 },
  ]
  const steps = ['1 scatola', '2 cilindri', '3 giunture']
  return (
    <Svg
      w={420}
      h={215}
      label="La mano in tre passi: prima una scatola per il palmo, poi cinque cilindri per le dita, poi le dita spezzate nelle giunture"
    >
      {steps.map((name, s) => {
        const x0 = 12 + s * (pw + 9)
        const bx = x0 + 40
        const by = 120
        const bw = 56
        const bh = 46
        const ox = 14
        const oy = -12
        return (
          <g key={name}>
            <path
              d={`M${bx} ${by} L${bx + ox} ${by + oy} L${bx + bw + ox} ${by + oy} L${bx + bw} ${by} Z`}
              {...S}
              strokeWidth={2}
            />
            <path
              d={`M${bx + bw} ${by} L${bx + bw + ox} ${by + oy} L${bx + bw + ox} ${by + bh + oy} L${bx + bw} ${by + bh} Z`}
              {...S}
              strokeWidth={2}
            />
            <rect x={bx} y={by} width={bw} height={bh} {...S} strokeWidth={2} />
            {s >= 1 &&
              fingers.map((g, i) => {
                const px = bx + g.dx
                if (s === 1) return <Cyl key={i} x={px} y={by} len={g.len} wid={10} ang={g.ang} />
                const l1 = g.len * 0.55
                const l2 = g.len * 0.45
                const a2 = g.ang + 16
                const tx = px + Math.sin((g.ang * Math.PI) / 180) * l1
                const ty = by - Math.cos((g.ang * Math.PI) / 180) * l1
                return (
                  <g key={i}>
                    <Cyl x={px} y={by} len={l1} wid={10} ang={g.ang} />
                    <Cyl x={tx} y={ty} len={l2} wid={9} ang={a2} />
                    <circle cx={f(tx)} cy={f(ty)} r={3} fill="#222" />
                  </g>
                )
              })}
            {s >= 1 && <Cyl x={bx + 3} y={by + 32} len={34} wid={12} ang={-65} />}
            <text x={x0 + pw / 2} y={by + bh + 30} {...T}>
              {name}
            </text>
          </g>
        )
      })}
    </Svg>
  )
})()

// ---- still life: three objects as forms -----------------------------------------
const natura = (() => {
  const ground = 170
  const sx = 95
  const sr = 32
  const cx = 205
  const crx = 36
  const cry = 10
  const ch = 80
  const bx = 285
  const bw = 66
  const bh = 52
  const ox = 22
  const oy = -16
  return (
    <Svg
      w={420}
      h={235}
      label="Natura morta schematica: una sfera, un cilindro e una scatola su un piano, con la luce da sinistra e le ombre a destra"
    >
      <path d={`M20 ${ground} L400 ${ground}`} {...DASH} />
      <ellipse cx={sx + sr + 18} cy={ground + 4} rx={sr * 0.9} ry={8} fill="#2c2c2c" fillOpacity={0.35} />
      <ellipse cx={cx + crx + 34} cy={ground + 4} rx={44} ry={9} fill="#2c2c2c" fillOpacity={0.35} />
      <path
        d={`M${bx + bw} ${ground} L${bx + bw + ox + 30} ${ground - 6} L${bx + bw + ox} ${ground + oy} Z`}
        fill="#2c2c2c"
        fillOpacity={0.35}
      />
      <circle
        cx={sx}
        cy={ground - sr}
        r={sr}
        fill="#e5e5e5"
        fillOpacity={0.5}
        stroke="currentColor"
        strokeWidth={2.5}
      />
      <path d={arc(sx, ground - sr, sr, sr * 0.28, 0, 180)} {...S} strokeWidth={1.5} opacity={0.6} />
      <path
        d={`M${cx - crx} ${ground - ch} L${cx - crx} ${ground} ${arc(cx, ground, crx, cry, 180, 0).replace('M', 'M')} L${cx + crx} ${ground - ch}`}
        {...S}
      />
      <ellipse cx={cx} cy={ground - ch} rx={crx} ry={cry} {...S} />
      <path
        d={`M${bx} ${ground} L${bx} ${ground - bh} L${bx + ox} ${ground - bh + oy} L${bx + bw + ox} ${ground - bh + oy} L${bx + bw + ox} ${ground + oy} L${bx + bw} ${ground} Z`}
        {...S}
        strokeWidth={2}
      />
      <path
        d={`M${bx} ${ground - bh} L${bx + bw} ${ground - bh} L${bx + bw + ox} ${ground - bh + oy} M${bx + bw} ${ground - bh} L${bx + bw} ${ground}`}
        {...S}
        strokeWidth={2}
      />
      <path d="M34 32 L84 62" {...S} strokeWidth={3} />
      <path d="M72 62 L86 63 L80 50" {...S} strokeWidth={3} />
      <text x={52} y={26} {...T}>
        luce
      </text>
      <text x={210} y={218} {...T}>
        3 oggetti = sfera, cilindro, scatola
      </text>
    </Svg>
  )
})()

// ---- quiz options: where is the subject? -------------------------------------------
function Comp({ horizonY, treeX, base, label }: { horizonY: number; treeX: number; base: number; label: string }) {
  const x0 = 20
  const y0 = 15
  const w = 160
  const h = 120
  return (
    <Svg w={200} h={150} label={label}>
      <rect x={x0} y={horizonY} width={w} height={y0 + h - horizonY} fill={M} fillOpacity={0.5} />
      <Tree x={treeX} base={base} crown={14} trunk={20} />
      <rect x={x0} y={y0} width={w} height={h} {...S} />
    </Svg>
  )
}
const x0q = 20
const wq = 160
const compA = (
  <Comp horizonY={75} treeX={x0q + wq / 2} base={75} label="Orizzonte a metà altezza e albero al centro esatto" />
)
const compB = (
  <Comp
    horizonY={95}
    treeX={f(x0q + (wq * 2) / 3)}
    base={95}
    label="Orizzonte sul terzo basso e albero sul terzo destro"
  />
)
const compC = (
  <Comp
    horizonY={38}
    treeX={30}
    base={130}
    label="Orizzonte molto in alto e albero schiacciato contro il bordo sinistro in basso"
  />
)

export const figuresFinale: Record<string, ReactNode> = {
  'finale-terzi': terzi,
  'finale-piani': piani,
  'finale-thumb': thumbs,
  'finale-manichino': manichino,
  'finale-mano': mano,
  'finale-natura': natura,
  'finale-comp-a': compA,
  'finale-comp-b': compB,
  'finale-comp-c': compC,
}
