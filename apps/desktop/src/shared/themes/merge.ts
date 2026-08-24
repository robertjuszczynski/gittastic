import type { ThemeJSON, ThemeTokens } from '../types/theme.types'

export function mergeThemeTokens(base: ThemeTokens, override: Partial<ThemeJSON>): ThemeTokens {
  return {
    colors: { ...base.colors, ...override.colors },
    fonts: override.fonts ? { ...base.fonts, ...override.fonts } : base.fonts,
    components: override.components
      ? {
          ...base.components,
          ...Object.fromEntries(
            Object.entries(override.components).map(([k, v]) => [
              k,
              { ...(base.components as Record<string, unknown>)?.[k] as object, ...(v as object) },
            ])
          ),
        }
      : base.components,
    extras: override.extras ? { ...base.extras, ...override.extras } : base.extras,
  }
}
