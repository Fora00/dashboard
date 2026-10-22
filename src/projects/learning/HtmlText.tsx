import { createElement, type ReactNode } from 'react'
import { parseHtml, type HtmlNode } from './html'

function render(nodes: HtmlNode[]): ReactNode[] {
  return nodes.map((n, i) =>
    typeof n === 'string'
      ? n
      : createElement(n.tag, { key: i, className: n.cls }, ...(n.tag === 'br' ? [] : render(n.children))),
  )
}

/** Course HTML as React elements (allowlisted, never innerHTML). `block` wraps it with lesson typography. */
export function HtmlText({ html, block = false }: { html: string; block?: boolean }) {
  const content = render(parseHtml(html))
  return block ? <div className="learning-html">{content}</div> : <>{content}</>
}
