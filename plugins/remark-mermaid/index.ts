import type { RemarkPlugin } from '@astrojs/markdown-remark'
import { visit } from 'unist-util-visit'

const remarkMermaid: RemarkPlugin = () => (tree, _) => {
  visit(tree, 'code', (node, index, parent) => {
    if (node.lang !== 'mermaid') return
    if (!parent || index === null) return

    // Replace the code node with an HTML node containing the mermaid div
    const htmlNode = {
      type: 'html',
      value: `<div class="mermaid">${node.value}</div>`
    }
    
    parent.children[index] = htmlNode
  })
}

export default remarkMermaid
