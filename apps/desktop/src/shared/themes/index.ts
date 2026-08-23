import type { ThemeDefinition, ThemeId } from '../types/theme.types'
import { gitasticLight } from './gitastic-light'
import { gitasticDark } from './gitastic-dark'
import { gitasticGlassmorphism } from './gitastic-glassmorphism'

export { gitasticLight, gitasticDark, gitasticGlassmorphism }

export const systemTheme: ThemeDefinition = {
  id: 'system',
  name: 'Follow System',
  tokens: gitasticLight.tokens,
}

export const BUILT_IN_THEMES: ThemeDefinition[] = [
  systemTheme,
  gitasticLight,
  gitasticDark,
  gitasticGlassmorphism,
]

export const BUILT_IN_THEME_MAP = new Map<ThemeId, ThemeDefinition>(
  BUILT_IN_THEMES.map(t => [t.id, t])
)
