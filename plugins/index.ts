// Remark plugins
import remarkDirective from 'remark-directive'
import remarkDirectiveWidgets from './remark-directive-widgets'
import remarkMarkmap from 'remark-markmap'
import remarkMermaid from './remark-mermaid'
export const remarkPlugins = [
  remarkDirective,
  remarkDirectiveWidgets,
  remarkMarkmap,
  remarkMermaid
]

// Rehype plugins
import rehypeImageLazyLoad from './rehype-image-lazyload'
export const rehypePlugins = [
  rehypeImageLazyLoad
]