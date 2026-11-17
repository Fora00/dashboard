import type { ReactNode } from 'react'
import { arc, Dot, DASH, f, S, Svg, T } from './figureKit'
import { figuresOsserva } from './figures.osserva'
import { figuresSpazio } from './figures.spazio'
import { figuresFinale } from './figures.finale'

/* oxlint-disable react/only-export-components -- figure data file */

// ---- lines ----------------------------------------------------------------
const lines = (
  <Svg w={420} h={230} label="Sei segni base: linea dritta, curva, a S, tratteggio, incrocio e spirale">
    <path d="M25 40 L105 40" {...S} />
    <path d="M165 55 Q205 15 245 55" {...S} />
    <path d="M305 50 C325 20 355 62 385 32" {...S} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${25 + i * 18} 135 L${55 + i * 18} 95`} {...S} strokeWidth={2} />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={`a${i}`} d={`M${165 + i * 18} 135 L${195 + i * 18} 95`} {...S} strokeWidth={2} />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={`b${i}`} d={`M${165 + i * 18} 95 L${195 + i * 18} 135`} {...S} strokeWidth={2} opacity={0.7} />
    ))}
    <path d="M345 115 m0 0 c25 0 25 -22 0 -22 c-30 0 -30 44 4 44 c40 0 40 -64 -6 -64" {...S} />
    <text x={65} y={75} {...T}>
      dritta
    </text>
    <text x={205} y={75} {...T}>
      curva
    </text>
    <text x={345} y={80} {...T}>
      a S
    </text>
    <text x={65} y={170} {...T}>
      tratteggio
    </text>
    <text x={205} y={170} {...T}>
      incrocio
    </text>
    <text x={345} y={170} {...T}>
      spirale
    </text>
    <text x={210} y={215} {...T} opacity={0.75}>
      il tratteggio dà ombra: linee parallele, vicine
    </text>
  </Svg>
)

// ---- forms ----------------------------------------------------------------
function Sphere({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const ry = r * 0.28
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} {...S} />
      <path d={arc(cx, cy, r, ry, 0, 180)} {...S} strokeWidth={1.8} />
      <path d={arc(cx, cy, r, ry, 180, 360)} {...DASH} />
    </g>
  )
}

function Cube({ x, y, s }: { x: number; y: number; s: number }) {
  const dx = s * 0.4
  const dy = -s * 0.32
  return (
    <g>
      <path d={`M${x} ${y} h${s} v${s} h${-s} Z`} {...S} />
      <path d={`M${x} ${y} l${dx} ${dy} h${s} l${-dx} ${-dy}`} {...S} />
      <path d={`M${x + s} ${y} l${dx} ${dy} v${s} l${-dx} ${-dy}`} {...S} />
      <path d={`M${x} ${y + s} l${dx} ${dy} v${-s} M${x + dx} ${y + s + dy} h${s}`} {...DASH} />
    </g>
  )
}

function Cone({ cx, by, rx, h }: { cx: number; by: number; rx: number; h: number }) {
  const ry = rx * 0.28
  // Tangent from the apex to the ellipse touches it slightly behind the horizontal axis.
  const sin = -ry / h
  const cos = Math.sqrt(1 - sin * sin)
  const ty = by + ry * sin
  const tx = rx * cos
  const ang = (Math.asin(sin) * 180) / Math.PI // negative
  return (
    <g>
      <path d={`M${f(cx - tx)} ${f(ty)} L${cx} ${by - h} L${f(cx + tx)} ${f(ty)}`} {...S} />
      <path d={arc(cx, by, rx, ry, ang, 180 - ang)} {...S} />
      <path d={arc(cx, by, rx, ry, 180 - ang, 360 + ang)} {...DASH} />
    </g>
  )
}

function Cylinder({ cx, ty, rx, h }: { cx: number; ty: number; rx: number; h: number }) {
  const ry = rx * 0.28
  return (
    <g>
      <ellipse cx={cx} cy={ty} rx={rx} ry={ry} {...S} />
      <path d={`M${cx - rx} ${ty} v${h} M${cx + rx} ${ty} v${h}`} {...S} />
      <path d={arc(cx, ty + h, rx, ry, 0, 180)} {...S} />
      <path d={arc(cx, ty + h, rx, ry, 180, 360)} {...DASH} />
    </g>
  )
}

const forms = (
  <Svg
    w={420}
    h={250}
    label="Dalle forme piatte ai solidi: cerchio e sfera, quadrato e cubo, triangolo e cono, rettangolo e cilindro"
  >
    <circle cx={55} cy={45} r={30} {...S} />
    <rect x={130} y={15} width={60} height={60} {...S} />
    <path d="M235 75 L265 15 L295 75 Z" {...S} />
    <rect x={345} y={15} width={50} height={60} {...S} />
    <path
      d="M55 88 v14 m-5 -5 l5 5 l5 -5 M160 88 v14 m-5 -5 l5 5 l5 -5 M265 88 v14 m-5 -5 l5 5 l5 -5 M370 88 v14 m-5 -5 l5 5 l5 -5"
      {...S}
      strokeWidth={1.5}
      opacity={0.6}
    />
    <Sphere cx={55} cy={155} r={30} />
    <Cube x={128} y={145} s={46} />
    <Cone cx={265} by={190} rx={30} h={72} />
    <Cylinder cx={370} ty={125} rx={26} h={62} />
    <text x={55} y={232} {...T}>
      sfera
    </text>
    <text x={160} y={232} {...T}>
      cubo
    </text>
    <text x={265} y={232} {...T}>
      cono
    </text>
    <text x={370} y={232} {...T}>
      cilindro
    </text>
  </Svg>
)

// ---- light ----------------------------------------------------------------
const light = (
  <Svg
    w={420}
    h={215}
    label="Una sfera illuminata da sinistra in alto, appoggiata su un piano: 1 luce, 2 mezzatinta, 3 ombra propria, 4 luce riflessa, 5 ombra portata"
  >
    <defs>
      <radialGradient id="fig-sph" cx="0.34" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#f6f6f6" />
        <stop offset="0.35" stopColor="#d2d2d2" />
        <stop offset="0.68" stopColor="#8c8c8c" />
        <stop offset="0.9" stopColor="#4a4a4a" />
        <stop offset="1" stopColor="#585858" />
      </radialGradient>
      <clipPath id="fig-sph-clip">
        <circle cx={130} cy={100} r={66} />
      </clipPath>
    </defs>
    <path d="M10 166 H290" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
    <path
      d="M132 166 L285 172 L240 190 L118 170 Z"
      fill="#2c2c2c"
      fillOpacity={0.6}
      stroke="currentColor"
      strokeOpacity={0.5}
      strokeWidth={1}
    />
    <ellipse cx={150} cy={168} rx={30} ry={5} fill="#111" opacity={0.55} />
    <circle cx={130} cy={100} r={66} fill="url(#fig-sph)" stroke="currentColor" strokeWidth={2} />
    <g clipPath="url(#fig-sph-clip)">
      <ellipse
        cx={130}
        cy={100}
        rx={61}
        ry={61}
        fill="none"
        stroke="#9a9a9a"
        strokeWidth={5}
        opacity={0.55}
        strokeDasharray="60 400"
        strokeDashoffset={-80}
      />
    </g>
    <path d="M16 28 L56 52 M16 46 L56 70 M16 64 L56 88" {...S} strokeWidth={2} />
    <Dot x={102} y={70} n={1} />
    <Dot x={128} y={102} n={2} />
    <Dot x={168} y={118} n={3} />
    <Dot x={150} y={152} n={4} />
    <Dot x={228} y={176} n={5} />
    <g {...T} textAnchor="start" fontSize={14}>
      <text x={308} y={34}>
        1 luce
      </text>
      <text x={308} y={64}>
        2 mezzatinta
      </text>
      <text x={308} y={94}>
        3 ombra propria
      </text>
      <text x={308} y={124}>
        4 luce riflessa
      </text>
      <text x={308} y={154}>
        5 ombra portata
      </text>
    </g>
    <text x={308} y={188} {...T} textAnchor="start" fontSize={12} opacity={0.7}>
      luce da sinistra
    </text>
  </Svg>
)

// ---- values ---------------------------------------------------------------
const GRAYS = ['#f4f4f4', '#d6d6d6', '#b4b4b4', '#8e8e8e', '#686868', '#444', '#1e1e1e']
const values = (
  <Svg w={420} h={110} label="Scala dei valori da 1 (chiaro, la carta) a 7 (scuro)">
    {GRAYS.map((g, i) => (
      <g key={i}>
        <rect
          x={21 + i * 54}
          y={10}
          width={54}
          height={56}
          fill={g}
          stroke="currentColor"
          strokeWidth={1}
          opacity={1}
        />
        <text x={48 + i * 54} y={86} {...T}>
          {i + 1}
        </text>
      </g>
    ))}
    <text x={21} y={106} {...T} textAnchor="start" fontSize={12} opacity={0.75}>
      chiaro (carta)
    </text>
    <text x={399} y={106} {...T} textAnchor="end" fontSize={12} opacity={0.75}>
      scuro
    </text>
  </Svg>
)

// ---- grip -----------------------------------------------------------------
// Deterministic pseudo-random so the "shaky" line never changes between renders.
function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const shaky = (() => {
  const r = rng(7)
  let d = 'M25 125'
  for (let x = 25; x < 275; x += 9) d += ` L${x + 9} ${f(125 + (r() - 0.5) * 18)}`
  return d
})()

const grip = (
  <Svg
    w={420}
    h={190}
    label="Un tratto lungo e sicuro, fatto con un solo gesto, contro un tratto tremolante fatto a pezzetti"
  >
    <path d="M25 50 C100 40 190 62 275 48" {...S} />
    <path d="M262 40 L277 48 L263 58" {...S} strokeWidth={2} />
    <path d={shaky} {...S} strokeWidth={2} />
    <text x={290} y={55} {...T} textAnchor="start">
      sicuro
    </text>
    <text x={290} y={130} {...T} textAnchor="start">
      tremolante
    </text>
    <text x={25} y={92} {...T} textAnchor="start" fontSize={12} opacity={0.75}>
      un gesto, veloce, dalla spalla
    </text>
    <text x={25} y={165} {...T} textAnchor="start" fontSize={12} opacity={0.75}>
      a pezzetti, lento, dal polso
    </text>
  </Svg>
)

// ---- visual-quiz spheres: light from the left, three shadows (one right, two wrong) ----
function ShadeSphere({ id, shadow }: { id: string; shadow: 'right' | 'left' | 'float' }) {
  const cx = 80
  const cy = 62
  const r = 40
  return (
    <Svg w={160} h={140} label="Sfera illuminata da sinistra">
      <defs>
        <radialGradient id={id} cx="0.34" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f6f6f6" />
          <stop offset="0.4" stopColor="#d0d0d0" />
          <stop offset="0.75" stopColor="#8a8a8a" />
          <stop offset="1" stopColor="#4a4a4a" />
        </radialGradient>
      </defs>
      <path d="M8 102 H152" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      {shadow === 'right' && (
        <path
          d="M82 102 L150 106 L128 118 L70 104 Z"
          fill="#2c2c2c"
          fillOpacity={0.6}
          stroke="currentColor"
          strokeOpacity={0.5}
        />
      )}
      {shadow === 'left' && (
        <path
          d="M78 102 L10 106 L32 118 L90 104 Z"
          fill="#2c2c2c"
          fillOpacity={0.6}
          stroke="currentColor"
          strokeOpacity={0.5}
        />
      )}
      {shadow === 'float' && (
        <path
          d="M82 120 L150 124 L128 134 L70 122 Z"
          fill="#2c2c2c"
          fillOpacity={0.6}
          stroke="currentColor"
          strokeOpacity={0.5}
        />
      )}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke="currentColor" strokeWidth={2} />
    </Svg>
  )
}
const shadeRight = <ShadeSphere id="fig-sh-a" shadow="right" />
const shadeLeft = <ShadeSphere id="fig-sh-b" shadow="left" />
const shadeFloat = <ShadeSphere id="fig-sh-c" shadow="float" />

export const figures: Record<string, ReactNode> = {
  ...figuresOsserva,
  ...figuresSpazio,
  ...figuresFinale,
  lines,
  forms,
  light,
  values,
  grip,
  'shade-right': shadeRight,
  'shade-left': shadeLeft,
  'shade-float': shadeFloat,
}
