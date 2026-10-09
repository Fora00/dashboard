// Readable forms of what `new URL()` gives back: punycode hostnames
// ("xn--r8jz45g.jp") and percent-encoded paths ("%E3%83%91"). Display only;
// the stored URL is never changed. Decoder per RFC 3492 (no browser API exists).

const BASE = 36
const T_MIN = 1
const T_MAX = 26
const SKEW = 38
const DAMP = 700

function adapt(delta: number, points: number, first: boolean): number {
  let d = first ? Math.floor(delta / DAMP) : delta >> 1
  d += Math.floor(d / points)
  let k = 0
  while (d > ((BASE - T_MIN) * T_MAX) >> 1) {
    d = Math.floor(d / (BASE - T_MIN))
    k += BASE
  }
  return k + Math.floor(((BASE - T_MIN + 1) * d) / (d + SKEW))
}

function digit(c: number): number {
  if (c >= 48 && c <= 57) return c - 22 // 0-9 -> 26-35
  if (c >= 65 && c <= 90) return c - 65
  if (c >= 97 && c <= 122) return c - 97
  return BASE
}

/** Decodes one punycode label (without the "xn--"); null if it is malformed. */
export function punycodeDecode(input: string): string | null {
  const out: number[] = []
  const basic = input.lastIndexOf('-')
  for (let j = 0; j < Math.max(basic, 0); j++) out.push(input.charCodeAt(j))
  let n = 128
  let bias = 72
  let i = 0
  for (let idx = basic > 0 ? basic + 1 : 0; idx < input.length;) {
    const oldi = i
    for (let w = 1, k = BASE; ; k += BASE) {
      if (idx >= input.length) return null
      const d = digit(input.charCodeAt(idx++))
      if (d >= BASE) return null
      i += d * w
      const t = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias
      if (d < t) break
      w *= BASE - t
    }
    bias = adapt(i - oldi, out.length + 1, oldi === 0)
    n += Math.floor(i / (out.length + 1))
    i %= out.length + 1
    if (n > 0x10ffff) return null
    out.splice(i++, 0, n)
  }
  return String.fromCodePoint(...out)
}

/** "xn--r8jz45g.jp" -> "例え.jp"; ASCII hostnames and undecodable labels are left as they are. */
export function displayHost(hostname: string): string {
  return hostname
    .split('.')
    .map((label) => (label.toLowerCase().startsWith('xn--') ? (punycodeDecode(label.slice(4)) ?? label) : label))
    .join('.')
}

/** Percent-decodes a path for display; keeps it as is if it is not valid UTF-8. */
export function displayPath(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}
