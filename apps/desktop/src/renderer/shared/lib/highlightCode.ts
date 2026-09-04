import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'

export function highlightCode(code: string): string {
  return Prism.highlight(code, Prism.languages.typescript ?? Prism.languages.javascript, 'typescript')
}
