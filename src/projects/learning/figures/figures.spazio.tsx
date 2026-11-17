import type { ReactNode } from 'react'
import { arc, DASH, Dot, f, S, Svg, T } from './figureKit'

/* oxlint-disable react/only-export-components -- figure data file */

// Figures for the 'spazio' batch of the drawing course (perspective).
// Nothing here is drawn by hand: boxes are built by interpolating towards the
// vanishing points, hidden edges are found from which faces are visible.

type P = [number, number]

const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** Intersection of line p1-p2 with line p3-p4. */
function cross(p1: P, p2: P, p3: P, p4: P): P {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0])
  const a = p1[0] * p2[1] - p1[1] * p2[0]
  const b = p3[0] * p4[1] - p3[1] * p4[0]
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d]
}

// Vertex order: 0..3 = TL, TR, BR, BL of the near face; 4..7 = same corners of the far face.
const FACES: Record<string, number[]> = {
  front: [0, 1, 2, 3],
  back: [4, 5, 6, 7],
  top: [0, 1, 5, 4],
  bottom: [3, 2, 6, 7],
  left: [0, 3, 7, 4],
  right: [1, 2, 6, 5],
}

interface Solid {
  v: P[]
  vis: string[]
}

/** Visible edges and hidden edges (the ones that belong to no visible face). */
function edges(s: Solid) {
  const seen = new Map<string, { a: P; b: P; vis: boolean }>()
  for (const [name, idx] of Object.entries(FACES)) {
    const shown = s.vis.includes(name)
    idx.forEach((i, k) => {
      const j = idx[(k + 1) % idx.length]!
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      const prev = seen.get(key)
      seen.set(key, { a: s.v[i]!, b: s.v[j]!, vis: (prev?.vis ?? false) || shown })
    })
  }
  return [...seen.values()]
}

const pts = (idx: number[], v: P[]) => idx.map((i) => `${f(v[i]![0])},${f(v[i]![1])}`).join(' ')
const seg = (a: P, b: P) => `M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`

/** Box seen with ONE vanishing point: near face parallel to the paper. */
function box1(
  front: [number, number, number, number],
  vp: P,
  t: number,
  mode: 'ok' | 'parallel' | 'skew' = 'ok',
): Solid {
  const [x0, y0, x1, y1] = front
  const H = vp[1]
  const near: P[] = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ]
  const centre: P = [(x0 + x1) / 2, (y0 + y1) / 2]
  const shift: P = [(vp[0] - centre[0]) * t, (vp[1] - centre[1]) * t]
  const far = near.map((p): P => (mode === 'parallel' ? [p[0] + shift[0], p[1] + shift[1]] : lerp(p, vp, t)))
  if (mode === 'skew') far[0] = [far[0]![0] + 10, far[0]![1] - 16]
  const vis = ['front']
  if (y0 > H) vis.push('top')
  if (y1 < H) vis.push('bottom')
  if (x0 > vp[0]) vis.push('left')
  if (x1 < vp[0]) vis.push('right')
  return { v: [...near, ...far], vis }
}

/**
 * Box seen with TWO vanishing points on the horizon. The corner edge is at x=cx
 * from yTop to yBot; wl / wr are the on-paper widths of the left / right faces.
 */
function box2(cx: number, yTop: number, yBot: number, vpL: P, vpR: P, wl: number, wr: number): Solid {
  const H = vpL[1]
  const tl = wl / (cx - vpL[0])
  const tr = wr / (vpR[0] - cx)
  const aT: P = [cx, yTop]
  const aB: P = [cx, yBot]
  const lT = lerp(aT, vpL, tl)
  const lB = lerp(aB, vpL, tl)
  const rT = lerp(aT, vpR, tr)
  const rB = lerp(aB, vpR, tr)
  const bT = cross(lT, vpR, rT, vpL)
  const bB = cross(lB, vpR, rB, vpL)
  const vis = ['front', 'right']
  if (yTop > H) vis.push('top')
  if (yBot < H) vis.push('bottom')
  return { v: [lT, aT, aB, lB, bT, rT, rB, bB], vis }
}

function Solid3({ s, hidden = true, sw = 2.5 }: { s: Solid; hidden?: boolean; sw?: number }) {
  return (
    <g>
      {s.vis.map((n) => (
        <polygon key={n} points={pts(FACES[n]!, s.v)} fill="#888" fillOpacity={0.1} stroke="none" />
      ))}
      {hidden &&
        edges(s)
          .filter((e) => !e.vis)
          .map((e, i) => <path key={`h${i}`} d={seg(e.a, e.b)} {...DASH} />)}
      {edges(s)
        .filter((e) => e.vis)
        .map((e, i) => (
          <path key={`v${i}`} d={seg(e.a, e.b)} {...S} strokeWidth={sw} />
        ))}
    </g>
  )
}

/** Faint construction line from a point to a vanishing point (optionally stopping at depth t). */
function Guide({ from, vp, t = 1 }: { from: P; vp: P; t?: number }) {
  return <path d={seg(from, lerp(from, vp, t))} {...S} strokeWidth={1.4} opacity={0.4} />
}

function Horizon({ w, y, label, lx }: { w: number; y: number; label?: string; lx?: number }) {
  return (
    <g>
      <path d={`M0 ${y} H${w}`} {...S} strokeWidth={1.5} strokeDasharray="10 5" opacity={0.7} />
      {label && (
        <text x={lx ?? w - 45} y={y - 8} {...T} opacity={0.85}>
          {label}
        </text>
      )}
    </g>
  )
}

const Vp = ({ p, r = 4 }: { p: P; r?: number }) => <circle cx={p[0]} cy={p[1]} r={r} fill="currentColor" />

// ---- horizon: boxes above / on / below -----------------------------------------
function orizzonte() {
  const H = 130
  const vp: P = [210, H]
  return (
    <Svg
      w={420}
      h={310}
      label="Tre scatole: una sopra l'orizzonte (si vede il fondo), una sull'orizzonte (solo i lati), una sotto (si vede il sopra)"
    >
      <Horizon w={420} y={H} label="orizzonte" lx={160} />
      <Vp p={vp} />
      <Solid3 s={box1([45, 40, 105, 90], vp, 0.3)} />
      <Solid3 s={box1([285, 100, 345, 160], vp, 0.3)} />
      <Solid3 s={box1([45, 170, 105, 220], vp, 0.3)} />
      <Dot x={22} y={65} n={1} />
      <Dot x={372} y={160} n={2} />
      <Dot x={22} y={195} n={3} />
      <text x={20} y={262} {...T} textAnchor="start">
        1 sopra l'orizzonte: vedi il fondo
      </text>
      <text x={20} y={282} {...T} textAnchor="start">
        2 sull'orizzonte: vedi solo i lati
      </text>
      <text x={20} y={302} {...T} textAnchor="start">
        3 sotto l'orizzonte: vedi il sopra
      </text>
    </Svg>
  )
}

// ---- ellipses open up with distance from the horizon ------------------------------
function ellissi() {
  const H = 40
  const F = 200
  const rx = 46
  const steps = [
    { dy: 0, label: ['sull’orizzonte', 'una linea'] },
    { dy: 28, label: ['poco sotto', 'stretta'] },
    { dy: 75, label: ['più sotto', 'più aperta'] },
    { dy: 150, label: ['molto sotto', 'quasi un cerchio'] },
  ]
  return (
    <Svg w={420} h={270} label="Quattro cerchi orizzontali: più sono lontani dall'orizzonte, più l'ellisse è aperta">
      <Horizon w={420} y={H} label="orizzonte" lx={370} />
      {steps.map((s, i) => {
        const cx = 55 + i * 103
        const cy = H + s.dy
        const ry = rx * Math.sin(Math.atan(s.dy / F))
        return (
          <g key={i}>
            {ry < 0.5 ? (
              <path d={`M${cx - rx} ${cy} H${cx + rx}`} {...S} />
            ) : (
              <ellipse cx={cx} cy={cy} rx={rx} ry={f(ry)} {...S} />
            )}
            <text x={cx} y={cy + ry + 26} {...T}>
              {s.label[0]}
            </text>
            <text x={cx} y={cy + ry + 44} {...T} opacity={0.75}>
              {s.label[1]}
            </text>
          </g>
        )
      })}
    </Svg>
  )
}

// ---- 1 vanishing point: road + boxes ----------------------------------------------
function fuga1() {
  const vp: P = [210, 100]
  const road = (x: number): P => [x, 260]
  const toward = (p: P, z: number): P => [vp[0] + (p[0] - vp[0]) / z, vp[1] + (p[1] - vp[1]) / z]
  const dashes = [1, 1.7, 2.6, 3.9, 5.8].map((z) => [toward(road(210), z), toward(road(210), z + 0.4)] as [P, P])
  const left = box1([30, 170, 90, 225], vp, 0.4)
  const right = box1([330, 170, 390, 225], vp, 0.4)
  return (
    <Svg
      w={420}
      h={270}
      label="Una strada e due scatole con un solo punto di fuga: tutte le linee di profondità convergono nello stesso punto sull'orizzonte"
    >
      <Horizon w={420} y={vp[1]} />
      <text x={55} y={vp[1] - 8} {...T} opacity={0.85}>
        orizzonte
      </text>
      <path d={seg(road(105), lerp(road(105), vp, 0.9))} {...S} />
      <path d={seg(road(315), lerp(road(315), vp, 0.9))} {...S} />
      {dashes.map(([a, b], i) => (
        <path key={i} d={seg(a, b)} {...S} strokeWidth={2} opacity={0.6} />
      ))}
      {[left, right].flatMap((b, k) => [0, 1, 2, 3].map((i) => <Guide key={`${k}${i}`} from={b.v[i]!} vp={vp} />))}
      <Solid3 s={left} />
      <Solid3 s={right} />
      <Vp p={vp} />
      <text x={vp[0]} y={vp[1] - 18} {...T}>
        punto di fuga
      </text>
    </Svg>
  )
}

// ---- cube in 5 steps (1 vanishing point) -------------------------------------------
const CUBE_VP: P = [285, 55]
const CUBE = box1([60, 100, 150, 190], CUBE_VP, 0.35)

const caption = (text: string) => (
  <text x={210} y={220} {...T}>
    {text}
  </text>
)
const NEW = { ...S, strokeWidth: 4 } as const

function cuboStep(n: 1 | 2 | 3 | 4 | 5): ReactNode {
  const v = CUBE.v
  const front = <path d={`M${v[0]![0]} ${v[0]![1]} H${v[1]![0]} V${v[2]![1]} H${v[0]![0]} Z`} {...S} />
  const base = (
    <>
      <Horizon w={420} y={CUBE_VP[1]} label="orizzonte" lx={370} />
      <Vp p={CUBE_VP} />
    </>
  )
  const guides = [1, 2, 0].map((i) => <Guide key={i} from={v[i]!} vp={CUBE_VP} />)
  const labels = [
    'Quadrato davanti e punto di fuga',
    'Dai 3 angoli verso il punto di fuga',
    'Scegli la profondità: lato verticale',
    'Lato orizzontale fino alla guida',
    'Ripassa: linee nascoste tratteggiate',
  ]
  return (
    <Svg w={420} h={235} label={`Passo ${n} del cubo: ${labels[n - 1]}`}>
      {base}
      {n === 1 && <path d={`M${v[0]![0]} ${v[0]![1]} H${v[1]![0]} V${v[2]![1]} H${v[0]![0]} Z`} {...NEW} />}
      {n >= 2 && n < 5 && front}
      {n >= 2 && n < 5 && guides}
      {n === 3 && <path d={seg(v[5]!, v[6]!)} {...NEW} />}
      {n === 4 && (
        <>
          <path d={seg(v[5]!, v[6]!)} {...S} />
          <path d={seg(v[5]!, v[4]!)} {...NEW} />
        </>
      )}
      {n === 5 && <Solid3 s={CUBE} />}
      <Dot x={30} y={30} n={n} />
      {caption(labels[n - 1]!)}
    </Svg>
  )
}

// ---- 2 vanishing points ---------------------------------------------------------------
function duePunti() {
  const H = 90
  const vpL: P = [18, H]
  const vpR: P = [402, H]
  const cube = box2(210, 150, 225, vpL, vpR, 85, 80)
  const v = cube.v
  return (
    <Svg
      w={420}
      h={285}
      label="Cubo ad angolo con due punti di fuga: gli spigoli inclinati convergono ai due punti sull'orizzonte, i verticali restano verticali"
    >
      <Horizon w={420} y={H} />
      <text x={210} y={H - 10} {...T} opacity={0.85}>
        orizzonte
      </text>
      {[v[1]!, v[2]!].map((p, i) => (
        <g key={i}>
          <Guide from={p} vp={vpL} />
          <Guide from={p} vp={vpR} />
        </g>
      ))}
      <Solid3 s={cube} />
      <Vp p={vpL} />
      <Vp p={vpR} />
      <text x={36} y={H - 10} {...T}>
        PF 1
      </text>
      <text x={384} y={H - 10} {...T}>
        PF 2
      </text>
      <text x={210} y={270} {...T}>
        Due punti di fuga: i verticali restano verticali
      </text>
    </Svg>
  )
}

function sopraSotto() {
  const H = 130
  const vpL: P = [15, H]
  const vpR: P = [405, H]
  return (
    <Svg
      w={420}
      h={320}
      label="Tre cubi ad angolo: sopra l'orizzonte si vede il fondo, sull'orizzonte solo i lati, sotto si vede il sopra"
    >
      <Horizon w={420} y={H} label="orizzonte" lx={372} />
      <Vp p={vpL} />
      <Vp p={vpR} />
      <Solid3 s={box2(100, 30, 85, vpL, vpR, 55, 50)} />
      <Solid3 s={box2(215, 100, 160, vpL, vpR, 55, 50)} />
      <Solid3 s={box2(330, 175, 230, vpL, vpR, 55, 50)} />
      <Dot x={22} y={57} n={1} />
      <Dot x={300} y={105} n={2} />
      <Dot x={250} y={205} n={3} />
      <text x={20} y={268} {...T} textAnchor="start">
        1 sopra: vedi il fondo
      </text>
      <text x={20} y={288} {...T} textAnchor="start">
        2 sull'orizzonte: né sopra né fondo
      </text>
      <text x={20} y={308} {...T} textAnchor="start">
        3 sotto: vedi il sopra
      </text>
    </Svg>
  )
}

// ---- quiz: which box has the right perspective ----------------------------------------------
function quizBox(mode: 'ok' | 'parallel' | 'skew', label: string) {
  const vp: P = [90, 60]
  const s = box1([200, 90, 270, 150], vp, 0.45, mode)
  return (
    <Svg w={300} h={180} label={label}>
      <Horizon w={300} y={vp[1]} />
      <text x={235} y={vp[1] - 8} {...T} opacity={0.85}>
        orizzonte
      </text>
      <Vp p={vp} />
      <text x={90} y={vp[1] - 12} {...T}>
        PF
      </text>
      <Solid3 s={s} />
    </Svg>
  )
}

// ---- combining: cup, bottle, book ---------------------------------------------------------------
const FOCAL = 200
const open = (y: number, H: number) => Math.sin(Math.atan(Math.abs(y - H) / FOCAL))

function Cyl({
  cx,
  yTop,
  yBot,
  rx,
  H,
  guide = false,
}: {
  cx: number
  yTop: number
  yBot: number
  rx: number
  H: number
  guide?: boolean
}) {
  const ryT = rx * open(yTop, H)
  const ryB = rx * open(yBot, H)
  return (
    <g>
      <path d={`M${cx - rx} ${yTop} V${yBot} M${cx + rx} ${yTop} V${yBot}`} {...S} />
      <path d={arc(cx, yBot, rx, ryB, 0, 180)} {...S} />
      <path d={arc(cx, yBot, rx, ryB, 180, 360)} {...DASH} />
      <ellipse
        cx={cx}
        cy={yTop}
        rx={rx}
        ry={f(ryT)}
        {...S}
        strokeWidth={guide ? 1.5 : 2.5}
        strokeDasharray={guide ? '4 4' : undefined}
        opacity={guide ? 0.6 : 1}
      />
    </g>
  )
}

function combina() {
  const H = 30
  const vp: P = [210, H]
  const book = box1([290, 168, 380, 192], vp, 0.3)
  return (
    <Svg
      w={420}
      h={270}
      label="Tre oggetti scomposti in solidi: la tazza è un cilindro, la bottiglia sono due cilindri, il libro è una scatola"
    >
      <Horizon w={420} y={H} />
      <text x={45} y={H - 8} {...T} opacity={0.85}>
        orizzonte
      </text>
      {/* cup */}
      <Cyl cx={70} yTop={100} yBot={190} rx={36} H={H} />
      <path d={arc(106, 145, 22, 22, -90, 90)} {...S} />
      {/* bottle: body, neck, shoulder */}
      <Cyl cx={205} yTop={115} yBot={190} rx={30} H={H} guide />
      <path d="M175 115 V190 M235 115 V190" {...S} />
      <path d={`M175 115 Q175 92 193 80 M235 115 Q235 92 217 80`} {...S} />
      <Cyl cx={205} yTop={50} yBot={80} rx={12} H={H} guide />
      <path d="M193 50 V80 M217 50 V80" {...S} />
      <ellipse cx={205} cy={50} rx={12} ry={f(12 * open(50, H))} {...S} />
      {/* book */}
      <Solid3 s={book} />
      <text x={70} y={240} {...T}>
        tazza: cilindro
      </text>
      <text x={205} y={240} {...T}>
        bottiglia: 2 cilindri
      </text>
      <text x={340} y={240} {...T}>
        libro: scatola
      </text>
    </Svg>
  )
}

function tazzaPassi() {
  const H = 20
  const rx = 34
  const yTop = 62
  const yBot = 140
  const ryT = rx * open(yTop, H)
  return (
    <Svg w={420} h={205} label="Una tazza in tre passi: cilindro con asse, bordo e manico, ombra">
      <Horizon w={420} y={H} />
      {[0, 1, 2].map((i) => {
        const cx = 70 + i * 140
        return (
          <g key={i}>
            <Cyl cx={cx} yTop={yTop} yBot={yBot} rx={rx} H={H} />
            {i === 0 && <path d={`M${cx} ${yTop - 12} V${yBot + 12}`} {...DASH} />}
            {i >= 1 && <ellipse cx={cx} cy={yTop} rx={rx - 5} ry={f(ryT * 0.8)} {...S} strokeWidth={1.8} />}
            {i >= 1 && <path d={arc(cx + rx, 100, 22, 20, -90, 90)} {...S} />}
            {i === 2 &&
              [0, 1, 2, 3, 4, 5].map((k) => (
                <path
                  key={k}
                  d={seg([cx - rx + 5 + k * 4, yTop + 22 + k * 6], [cx - rx + 14 + k * 4, yTop + 12 + k * 6])}
                  {...S}
                  strokeWidth={1.6}
                  opacity={0.7}
                />
              ))}
            <Dot x={cx - 52} y={40} n={i + 1} />
            <text x={cx} y={190} {...T}>
              {['cilindro', 'bordo e manico', 'ombra'][i]}
            </text>
          </g>
        )
      })}
    </Svg>
  )
}

export const figuresSpazio: Record<string, ReactNode> = {
  'spazio-orizzonte': orizzonte(),
  'spazio-ellissi': ellissi(),
  'spazio-fuga1': fuga1(),
  'spazio-cubo-1': cuboStep(1),
  'spazio-cubo-2': cuboStep(2),
  'spazio-cubo-3': cuboStep(3),
  'spazio-cubo-4': cuboStep(4),
  'spazio-cubo-5': cuboStep(5),
  'spazio-due-punti': duePunti(),
  'spazio-sopra-sotto': sopraSotto(),
  'spazio-q-ok': quizBox('ok', 'Scatola con le linee di profondità che convergono al punto di fuga'),
  'spazio-q-parallele': quizBox('parallel', 'Scatola con le linee di profondità parallele tra loro'),
  'spazio-q-storta': quizBox('skew', 'Scatola con un angolo storto sul retro'),
  'spazio-combina': combina(),
  'spazio-tazza-passi': tazzaPassi(),
}
