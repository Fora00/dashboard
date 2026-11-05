import type { ReactNode } from 'react'
import { DASH, f, S, Svg, T } from './figureKit'

/* oxlint-disable react/only-export-components -- figure data file */

// Figures for the 'osserva' batch of the drawing course. Helpers live in ./figureKit.
// Everything geometric (positions, angles, ratios) is computed here from a few numbers.

const GREY = { back: '#9ca3af', mid: '#cbd5e1', front: '#f1f5f9', neg: '#94a3b8', pos: '#6b7280' } as const
const INK = '#222'

// ---- riempire: overlap = depth --------------------------------------------
type Shape = { k: 'sq'; x: number; y: number; s: number } | { k: 'c'; cx: number; cy: number; r: number }
const LAYERS: Shape[] = [
  { k: 'sq', x: 55, y: 25, s: 80 },
  { k: 'c', cx: 125, cy: 100, r: 42 },
  { k: 'c', cx: 92, cy: 128, r: 36 },
]
const LAYER_FILLS = [GREY.back, GREY.mid, GREY.front]

function Layers({ dx, filled }: { dx: number; filled: boolean }) {
  return (
    <g transform={`translate(${dx} 0)`}>
      {LAYERS.map((s, i) => {
        const p = filled ? { fill: LAYER_FILLS[i], stroke: INK, strokeWidth: 2.5 } : { ...S }
        return s.k === 'sq' ? (
          <rect key={i} x={s.x} y={s.y} width={s.s} height={s.s} {...p} strokeLinejoin="round" />
        ) : (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...p} />
        )
      })}
    </g>
  )
}

const riempire = (
  <Svg
    w={420}
    h={235}
    label="Stesse tre forme: a sinistra solo contorni che si attraversano, a destra una copre l'altra e si vede la profondità"
  >
    <Layers dx={0} filled={false} />
    <Layers dx={210} filled />
    <text x={110} y={198} {...T}>
      tutte le linee
    </text>
    <text x={110} y={217} {...T}>
      visibili: piatto
    </text>
    <text x={320} y={198} {...T}>
      una copre l'altra:
    </text>
    <text x={320} y={217} {...T}>
      profondità
    </text>
  </Svg>
)

function Overlap({ mode }: { mode: 'front' | 'back' | 'wire' }) {
  const big = { cx: 80, cy: 70, r: 50 }
  const small = { cx: 128, cy: 82, r: 30 }
  const sty = (fill: string) => ({ fill, stroke: INK, strokeWidth: 2.5 })
  return (
    <Svg w={200} h={140} label={`Un cerchio grande e uno piccolo sovrapposti (${mode})`}>
      {mode === 'wire' && (
        <>
          <circle {...big} {...S} />
          <circle {...small} {...S} />
        </>
      )}
      {mode === 'front' && (
        <>
          <circle {...big} {...sty(GREY.mid)} />
          <circle {...small} {...sty(GREY.front)} />
        </>
      )}
      {mode === 'back' && (
        <>
          <circle {...small} {...sty(GREY.front)} />
          <circle {...big} {...sty(GREY.mid)} />
        </>
      )}
    </Svg>
  )
}

// ---- cieco: blind contour --------------------------------------------------
const blobR = (t: number) => 52 + 10 * Math.cos(3 * t + 0.5) + 6 * Math.sin(2 * t)
function blobPath(cx: number, cy: number, wobble: boolean, steps = 90): string {
  const pts: string[] = []
  const last = wobble ? 1.02 : 1
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * last
    // The blind copy keeps the shape roughly but drifts: wrong proportions, ends do not meet.
    const k = wobble ? 1 + 0.16 * Math.sin(5 * t + 1) + 0.06 * (i / steps) : 1
    const x = cx + blobR(t) * k * Math.cos(t) * (wobble ? 1.15 : 1)
    const y = cy + blobR(t) * k * Math.sin(t) * (wobble ? 0.9 : 1)
    pts.push(`${i === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`)
  }
  return pts.join(' ')
}
function blobPoint(cx: number, cy: number, t: number) {
  return { x: cx + blobR(t) * Math.cos(t), y: cy + blobR(t) * Math.sin(t) }
}
const cieco = (() => {
  const t0 = -0.9
  const p = blobPoint(105, 105, t0)
  return (
    <Svg
      w={420}
      h={225}
      label="A sinistra il bordo che guardi con un punto che lo segue, a destra il disegno cieco: linea continua ma proporzioni sbagliate"
    >
      <path d={blobPath(105, 105, false)} {...S} />
      <circle cx={f(p.x)} cy={f(p.y)} r={7} fill="#2563eb" stroke={INK} strokeWidth={1.5} />
      <path d={blobPath(315, 105, true)} {...S} />
      <text x={105} y={192} {...T}>
        l'occhio segue
      </text>
      <text x={105} y={211} {...T}>
        il bordo, piano
      </text>
      <text x={315} y={192} {...T}>
        la matita lo copia:
      </text>
      <text x={315} y={211} {...T}>
        storto, ed è giusto
      </text>
    </Svg>
  )
})()

// ---- negativo: chair as spaces --------------------------------------------
// Front view of a chair as disjoint rectangles inside a W x H box (relative coords).
const CW = 120
const CH = 150
const CHAIR: [number, number, number, number][] = [
  [0, 0, 14, CH], // left post
  [CW - 14, 0, 14, CH], // right post
  [14, 8, CW - 28, 16], // top rail
  [14, 48, CW - 28, 14], // mid rail
  [14, 92, CW - 28, 22], // seat
  [14, 132, CW - 28, 12], // stretcher
]

function boxMinusChair(x0: number, y0: number): string {
  const r = (x: number, y: number, w: number, h: number) => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`
  return r(x0, y0, CW, CH) + CHAIR.map(([x, y, w, h]) => r(x0 + x, y0 + y, w, h)).join('')
}
function ChairShapes({ x0, y0, mode }: { x0: number; y0: number; mode: 'line' | 'neg' | 'pos' }) {
  return (
    <g>
      {mode === 'neg' && <path d={boxMinusChair(x0, y0)} fillRule="evenodd" fill={GREY.neg} stroke="none" />}
      {mode === 'pos' &&
        CHAIR.map(([x, y, w, h], i) => (
          <rect key={i} x={x0 + x} y={y0 + y} width={w} height={h} fill={GREY.pos} stroke="none" />
        ))}
      {mode === 'line' &&
        CHAIR.map(([x, y, w, h], i) => (
          <rect key={i} x={x0 + x} y={y0 + y} width={w} height={h} {...S} strokeWidth={2} />
        ))}
      <rect x={x0} y={y0} width={CW} height={CH} {...(mode === 'line' ? DASH : { ...S, strokeWidth: 2 })} />
    </g>
  )
}
const negativo = (
  <Svg
    w={420}
    h={225}
    label="Una sedia vista di fronte: a sinistra il contorno, a destra solo gli spazi vuoti tra le parti riempiti di grigio"
  >
    <ChairShapes x0={45} y0={15} mode="line" />
    <ChairShapes x0={255} y0={15} mode="neg" />
    <text x={105} y={196} {...T}>
      il contorno
    </text>
    <text x={105} y={215} {...T}>
      (le parti)
    </text>
    <text x={315} y={196} {...T}>
      gli spazi vuoti
    </text>
    <text x={315} y={215} {...T}>
      (disegna questi)
    </text>
  </Svg>
)
function ChairQuiz({ mode }: { mode: 'line' | 'neg' | 'pos' }) {
  return (
    <Svg w={200} h={180} label={`Sedia di fronte (${mode})`}>
      <ChairShapes x0={40} y0={15} mode={mode} />
    </Svg>
  )
}

// ---- capovolto: upside-down copy ------------------------------------------
const vaseW = (t: number) => 14 + 32 * Math.sin(Math.PI * Math.pow(t, 0.8)) + 10 * Math.pow(t, 4)
function Vase({ cx, top, h }: { cx: number; top: number; h: number }) {
  const N = 40
  const L: string[] = []
  const R: string[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const y = top + t * h
    L.push(`${i === 0 ? 'M' : 'L'}${f(cx - vaseW(t))} ${f(y)}`)
    R.unshift(`L${f(cx + vaseW(t))} ${f(y)}`)
  }
  const band = (t: number) => {
    const w = vaseW(t)
    const y = top + t * h
    return `M${f(cx - w)} ${f(y)} Q${cx} ${f(y + 12)} ${f(cx + w)} ${f(y)}`
  }
  return (
    <g>
      <path d={L.join(' ') + ' ' + R.join(' ') + ' Z'} {...S} />
      <path d={band(0.45)} {...S} strokeWidth={1.8} />
      <path d={band(0.7)} {...S} strokeWidth={1.8} />
    </g>
  )
}
const capovolto = (
  <Svg w={420} h={235} label="Lo stesso vaso dritto e capovolto: capovolto lo guardi come linee e curve, senza il nome">
    <Vase cx={105} top={25} h={140} />
    <g transform="rotate(180 315 95)">
      <Vase cx={315} top={25} h={140} />
    </g>
    <text x={105} y={198} {...T}>
      dritto: "è un vaso"
    </text>
    <text x={105} y={217} {...T}>
      il cervello dà un nome
    </text>
    <text x={315} y={198} {...T}>
      capovolto: solo
    </text>
    <text x={315} y={217} {...T}>
      linee e curve
    </text>
  </Svg>
)

// ---- misurare --------------------------------------------------------------
const braccio = (() => {
  const eye = { x: 42, y: 110 }
  const obj = { x: 360, top: 40, bot: 180 }
  const pencilX = 160
  const at = (y: number) => f(eye.y + ((y - eye.y) * (pencilX - eye.x)) / (obj.x - eye.x))
  const yTop = at(obj.top)
  const yBot = at(obj.bot)
  return (
    <Svg
      w={420}
      h={225}
      label="Schema: occhio, braccio teso, matita verticale e oggetto lontano; le linee di vista mostrano quanto della matita copre l'oggetto"
    >
      <circle cx={eye.x} cy={eye.y} r={14} {...S} strokeWidth={2} />
      <circle cx={eye.x + 4} cy={eye.y} r={5} fill="currentColor" />
      <path d={`M16 175 L${pencilX} ${yBot}`} {...S} strokeWidth={5} opacity={0.35} />
      <rect
        x={pencilX - 4}
        y={yTop - 22}
        width={8}
        height={yBot - yTop + 38}
        fill="#e5b84a"
        stroke={INK}
        strokeWidth={1.5}
      />
      <circle cx={pencilX} cy={yBot} r={6} fill="#fb923c" stroke={INK} strokeWidth={1.5} />
      <path d={`M${eye.x + 14} ${eye.y - 2} L${obj.x} ${obj.top}`} {...DASH} />
      <path d={`M${eye.x + 14} ${eye.y + 2} L${obj.x} ${obj.bot}`} {...DASH} />
      <rect x={obj.x - 22} y={obj.top} width={44} height={obj.bot - obj.top} {...S} strokeWidth={2} />
      <text x={eye.x + 10} y={78} {...T}>
        occhio
      </text>
      <text x={pencilX + 10} y={yTop - 32} {...T}>
        matita
      </text>
      <text x={obj.x} y={obj.top - 12} {...T}>
        oggetto
      </text>
      <text x={110} y={212} {...T}>
        braccio teso, gomito dritto
      </text>
    </Svg>
  )
})()

const unita = (() => {
  const H = 140
  const W = 210
  const x0 = 30
  const y0 = 25
  return (
    <Svg
      w={420}
      h={235}
      label="Un rettangolo largo una volta e mezza la sua altezza: l'altezza è l'unità e la larghezza è 1 unità e mezza"
    >
      <rect x={x0} y={y0} width={W} height={H} {...S} />
      <path d={`M${x0 + H} ${y0} V${y0 + H}`} {...DASH} />
      <path
        d={`M${x0 + W + 18} ${y0} V${y0 + H} M${x0 + W + 12} ${y0} h12 M${x0 + W + 12} ${y0 + H} h12`}
        {...S}
        strokeWidth={2}
      />
      <text x={x0 + W + 82} y={y0 + H / 2 - 4} {...T}>
        altezza
      </text>
      <text x={x0 + W + 82} y={y0 + H / 2 + 15} {...T}>
        = 1 unità
      </text>
      <path
        d={`M${x0} ${y0 + H + 22} H${x0 + W} M${x0} ${y0 + H + 16} v12 M${x0 + H} ${y0 + H + 16} v12 M${x0 + W} ${y0 + H + 16} v12`}
        {...S}
        strokeWidth={2}
      />
      <text x={x0 + H / 2} y={y0 + H + 50} {...T}>
        1
      </text>
      <text x={x0 + H + (W - H) / 2} y={y0 + H + 50} {...T}>
        ½
      </text>
    </Svg>
  )
})()

function Ratio({ r }: { r: number }) {
  const H = 70
  const w = r * H
  return (
    <Svg w={200} h={120} label={`Un rettangolo di proporzione ${r}`}>
      <rect x={f((200 - w) / 2)} y={25} width={f(w)} height={H} {...S} />
    </Svg>
  )
}

// ---- angoli ----------------------------------------------------------------
const angoli = (() => {
  const cx = 210
  const cy = 210
  const R = 140
  const degs = [0, 30, 45, 60, 90, 120, 135, 150, 180]
  const pt = (d: number, r: number) => ({
    x: cx + r * Math.cos((d * Math.PI) / 180),
    y: cy - r * Math.sin((d * Math.PI) / 180),
  })
  return (
    <Svg w={420} h={235} label="Un ventaglio di linee a 30, 45, 60, 90, 120, 135 e 150 gradi rispetto all'orizzontale">
      {degs.map((d) => {
        const e = pt(d, R)
        const l = pt(d, R + 26)
        const axis = d === 0 || d === 90 || d === 180
        return (
          <g key={d}>
            <path d={`M${cx} ${cy} L${f(e.x)} ${f(e.y)}`} {...S} strokeWidth={axis ? 2.5 : 2} />
            <text x={f(l.x)} y={f(l.y + 5)} {...T}>
              {d}°
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={4} fill="currentColor" />
    </Svg>
  )
})()

function AngleLine({ deg }: { deg: number }) {
  const x0 = 30
  const y0 = 110
  const len = 110
  const e = { x: x0 + len * Math.cos((deg * Math.PI) / 180), y: y0 - len * Math.sin((deg * Math.PI) / 180) }
  return (
    <Svg w={200} h={130} label={`Una linea che sale da una base orizzontale`}>
      <path d={`M${x0} ${y0} H170`} {...DASH} />
      <path d={`M${x0} ${y0} L${f(e.x)} ${f(e.y)}`} {...S} />
      <circle cx={x0} cy={y0} r={4} fill="currentColor" />
    </Svg>
  )
}

const stella = (() => {
  const rays: [number, number][] = [
    [20, 74],
    [75, 50],
    [130, 80],
    [205, 58],
    [300, 72],
  ]
  const draw = (cx: number, cy: number, withRays: boolean) => (
    <g>
      <path d={`M${cx - 85} ${cy} H${cx + 85} M${cx} ${cy - 85} V${cy + 85}`} {...DASH} />
      {withRays &&
        rays.map(([d, l]) => {
          const a = (d * Math.PI) / 180
          return <path key={d} d={`M${cx} ${cy} L${f(cx + l * Math.cos(a))} ${f(cy - l * Math.sin(a))}`} {...S} />
        })}
      <circle cx={cx} cy={cy} r={4} fill="currentColor" />
    </g>
  )
  return (
    <Svg
      w={420}
      h={235}
      label="A sinistra una stella di cinque linee con l'orizzontale e la verticale tratteggiate, a destra solo gli assi da riempire copiando"
    >
      {draw(105, 105, true)}
      {draw(315, 105, false)}
      <text x={105} y={217} {...T}>
        modello
      </text>
      <text x={315} y={217} {...T}>
        il tuo foglio: copia
      </text>
    </Svg>
  )
})()

export const figuresOsserva: Record<string, ReactNode> = {
  'osserva-riempire': riempire,
  'osserva-ov-wire': <Overlap mode="wire" />,
  'osserva-ov-back': <Overlap mode="back" />,
  'osserva-ov-front': <Overlap mode="front" />,
  'osserva-cieco': cieco,
  'osserva-negativo': negativo,
  'osserva-chair-line': <ChairQuiz mode="line" />,
  'osserva-chair-pos': <ChairQuiz mode="pos" />,
  'osserva-chair-neg': <ChairQuiz mode="neg" />,
  'osserva-capovolto': capovolto,
  'osserva-braccio': braccio,
  'osserva-unita': unita,
  'osserva-ratio-10': <Ratio r={1} />,
  'osserva-ratio-15': <Ratio r={1.5} />,
  'osserva-ratio-22': <Ratio r={2.2} />,
  'osserva-angoli': angoli,
  'osserva-ang-10': <AngleLine deg={10} />,
  'osserva-ang-30': <AngleLine deg={30} />,
  'osserva-ang-60': <AngleLine deg={60} />,
  'osserva-stella': stella,
}
