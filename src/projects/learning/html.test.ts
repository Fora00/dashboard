import { describe, expect, it } from 'vitest'
import { decodeEntities, htmlToText, parseHtml } from './html'

describe('parseHtml', () => {
  it('keeps allowlisted tags and the three known classes', () => {
    expect(parseHtml('<div class="say foo"><b>x</b></div>')).toEqual([
      { tag: 'div', cls: 'say', children: [{ tag: 'b', cls: undefined, children: ['x'] }] },
    ])
  })

  it('drops scripts, handlers and unknown attributes, keeping only safe text', () => {
    const nodes = parseHtml(
      '<p onclick="x()" style="a:b">hi<script>alert(1)</script><img src=x onerror=y><a href="javascript:z">l</a></p>',
    )
    expect(JSON.stringify(nodes)).not.toMatch(/onclick|style|onerror|href|<script|<img/)
    expect(htmlToText('<p>hi<script>alert(1)</script></p>')).toBe('hialert(1)')
  })

  it('never produces markup from escaped text', () => {
    expect(parseHtml('&lt;script&gt;x&lt;/script&gt;')).toEqual(['<script>x</script>'])
  })

  it('handles <br>, stray closers and a lone <', () => {
    expect(htmlToText('a<br>b</i>c')).toBe('abc')
    expect(htmlToText('1 < 2')).toBe('1 < 2')
  })
})

describe('decodeEntities', () => {
  it('decodes named and numeric entities, leaves unknown ones', () => {
    expect(decodeEntities('a &amp; b &lt;c&gt; &#39;d&#39; &#x41; &bogus;')).toBe("a & b <c> 'd' A &bogus;")
  })
})
