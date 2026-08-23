import type { ThemeDefinition } from '@shared'
import { resolveTokensToCSSVars } from './mapper'

const STYLE_TAG_ID = 'gitastic-theme'

export function injectTheme(theme: ThemeDefinition): void
export function injectTheme(theme: ThemeDefinition['tokens']): void
export function injectTheme(themeOrTokens: ThemeDefinition | ThemeDefinition['tokens']): void {
  const isDefinition = 'tokens' in themeOrTokens
  const tokens = isDefinition ? (themeOrTokens as ThemeDefinition).tokens : themeOrTokens
  const isDark = isDefinition ? !!(themeOrTokens as ThemeDefinition).isDark : false

  const vars = resolveTokensToCSSVars(tokens)
  const css = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`

  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = STYLE_TAG_ID
    document.head.appendChild(tag)
  }
  tag.textContent = css

  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
}
