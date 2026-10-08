// Deterministic, name-based UUIDs (RFC 9562 version 5: SHA-1 of namespace +
// name). Synchronous and dependency-free on purpose: crypto.subtle is async
// and missing outside secure contexts (e.g. the dev server opened over the
// LAN on a phone), and this runs inside UI mutations.
//
// Same inputs → same id on every device, so two devices that create "the same"
// logical row offline (one habit check per habit and day) write ONE server row
// instead of colliding on a unique constraint.

function sha1(bytes: Uint8Array): Uint8Array {
  const ml = bytes.length * 8
  // Pad: 0x80, zeros, then the 64-bit big-endian bit length (fits in 53 bits).
  const total = Math.ceil((bytes.length + 9) / 64) * 64
  const msg = new Uint8Array(total)
  msg.set(bytes)
  msg[bytes.length] = 0x80
  const view = new DataView(msg.buffer)
  view.setUint32(total - 8, Math.floor(ml / 2 ** 32))
  view.setUint32(total - 4, ml >>> 0)

  let h0 = 0x67452301
  let h1 = 0xefcdab89
  let h2 = 0x98badcfe
  let h3 = 0x10325476
  let h4 = 0xc3d2e1f0
  const w = new Uint32Array(80)
  const rotl = (x: number, n: number) => (x << n) | (x >>> (32 - n))
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4)
    for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3]! ^ w[i - 8]! ^ w[i - 14]! ^ w[i - 16]!, 1)
    let a = h0
    let b = h1
    let c = h2
    let d = h3
    let e = h4
    for (let i = 0; i < 80; i++) {
      let f: number
      let k: number
      if (i < 20) {
        f = (b & c) | (~b & d)
        k = 0x5a827999
      } else if (i < 40) {
        f = b ^ c ^ d
        k = 0x6ed9eba1
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d)
        k = 0x8f1bbcdc
      } else {
        f = b ^ c ^ d
        k = 0xca62c1d6
      }
      const t = (rotl(a, 5) + f + e + k + w[i]!) >>> 0
      e = d
      d = c
      c = rotl(b, 30) >>> 0
      b = a
      a = t
    }
    h0 = (h0 + a) >>> 0
    h1 = (h1 + b) >>> 0
    h2 = (h2 + c) >>> 0
    h3 = (h3 + d) >>> 0
    h4 = (h4 + e) >>> 0
  }
  const out = new Uint8Array(20)
  const ov = new DataView(out.buffer)
  ;[h0, h1, h2, h3, h4].forEach((h, i) => ov.setUint32(i * 4, h))
  return out
}

function parseUuid(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error(`uuidV5: bad namespace ${uuid}`)
  const out = new Uint8Array(16)
  for (let i = 0; i < 16; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return out
}

/** UUID v5 of `name` (UTF-8) in `namespace` (a UUID string). Lowercase. */
export function uuidV5(name: string, namespace: string): string {
  const ns = parseUuid(namespace)
  const nameBytes = new TextEncoder().encode(name)
  const input = new Uint8Array(ns.length + nameBytes.length)
  input.set(ns)
  input.set(nameBytes, ns.length)
  const hash = sha1(input).slice(0, 16)
  hash[6] = (hash[6]! & 0x0f) | 0x50 // version 5
  hash[8] = (hash[8]! & 0x3f) | 0x80 // RFC variant
  const hex = Array.from(hash, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
