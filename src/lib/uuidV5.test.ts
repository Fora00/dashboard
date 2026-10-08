import { describe, expect, it } from 'vitest'
import { uuidV5 } from './uuidV5'

// RFC 9562 namespace for DNS names; Python's uuid.uuid5(NAMESPACE_DNS, ...)
// gives the reference values below.
const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

/** Reference implementation on WebCrypto's SHA-1. */
async function refV5(name: string, ns: string): Promise<string> {
  const nsHex = ns.replace(/-/g, '')
  const nsBytes = Uint8Array.from({ length: 16 }, (_, i) => parseInt(nsHex.slice(i * 2, i * 2 + 2), 16))
  const nameBytes = new TextEncoder().encode(name)
  const input = new Uint8Array(16 + nameBytes.length)
  input.set(nsBytes)
  input.set(nameBytes, 16)
  const h = new Uint8Array(await crypto.subtle.digest('SHA-1', input)).slice(0, 16)
  h[6] = (h[6]! & 0x0f) | 0x50
  h[8] = (h[8]! & 0x3f) | 0x80
  const x = Array.from(h, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`
}

describe('uuidV5', () => {
  it('matches known RFC vectors', () => {
    expect(uuidV5('python.org', DNS)).toBe('886313e1-3b8a-5372-9b90-0c9aee199e5d')
    expect(uuidV5('www.example.com', DNS)).toBe('2ed6657d-e927-568b-95e1-2665a8aea6a2')
  })

  it('matches WebCrypto SHA-1 for empty, multi-block and non-ASCII names', async () => {
    for (const name of ['', 'a'.repeat(39), 'b'.repeat(40), 'c'.repeat(200), 'caffè ☕ 2026-10-08']) {
      expect(uuidV5(name, DNS)).toBe(await refV5(name, DNS))
    }
  })

  it('is deterministic and name-sensitive', () => {
    expect(uuidV5('h1|2026-10-08', DNS)).toBe(uuidV5('h1|2026-10-08', DNS))
    expect(uuidV5('h1|2026-10-08', DNS)).not.toBe(uuidV5('h1|2026-10-09', DNS))
  })

  it('rejects a malformed namespace', () => {
    expect(() => uuidV5('x', 'nope')).toThrow()
  })
})
