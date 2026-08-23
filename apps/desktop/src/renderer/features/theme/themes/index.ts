import type { ThemeDefinition, ThemeId } from '@shared'
import { gitasticLight } from './gitastic-light'
import { gitasticDark } from './gitastic-dark'
import { gitasticGlassmorphism } from './gitastic-glassmorphism'

export { gitasticLight, gitasticDark, gitasticGlassmorphism }

export const BUILT_IN_THEMES: ThemeDefinition[] = [
  gitasticLight,
  gitasticDark,
  gitasticGlassmorphism,
]

export const BUILT_IN_THEME_MAP = new Map<ThemeId, ThemeDefinition>(
  BUILT_IN_THEMES.map(t => [t.id, t])
)
