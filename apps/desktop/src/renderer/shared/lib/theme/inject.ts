import type { ThemeTokens } from '@shared'
import { resolveTokensToCSSVars } from './mapper'

const STYLE_TAG_ID = 'gitastic-theme'

export function injectTheme(tokens: ThemeTokens): void {
  const vars = resolveTokensToCSSVars(tokens)
  const css = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`

  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = STYLE_TAG_ID
    document.head.appendChild(tag)
  }
  tag.textContent = css
}
