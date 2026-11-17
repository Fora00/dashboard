import { createElement, type ReactNode } from 'react'
import { parseHtml, type HtmlNode } from './html'
import { figures } from '../figures/figures'

// `anchors` numbers the <h3>s (same order as headingsOf) so the jump list can scroll to them.
function render(nodes: HtmlNode[], anchors?: { prefix: string; n: number }): ReactNode[] {
  return nodes.map((n, i) =>
    typeof n === 'string' ? (
      n
    ) : n.tag === 'fig' ? (
      figures[n.fig ?? ''] ? (
        <figure key={i} className="learning-fig">
          {figures[n.fig ?? '']}
        </figure>
      ) : null
    ) : (
      createElement(
        n.tag,
        {
          key: i,
          className: n.cls,
          ...(anchors && n.tag === 'h3' ? { id: `${anchors.prefix}${anchors.n++}`, tabIndex: -1 } : {}),
        },
        ...(n.tag === 'br' ? [] : n.tag === 'h3' ? render(n.children) : render(n.children, anchors)),
      )
    ),
  )
}

/** Course HTML as React elements (allowlisted, never innerHTML). `block` wraps it with lesson typography. */
export function HtmlText({
  html,
  block = false,
  anchorPrefix,
}: {
  html: string
  block?: boolean
  anchorPrefix?: string
}) {
  const content = render(parseHtml(html), anchorPrefix ? { prefix: anchorPrefix, n: 0 } : undefined)
  return block ? <div className="learning-html">{content}</div> : <>{content}</>
}
