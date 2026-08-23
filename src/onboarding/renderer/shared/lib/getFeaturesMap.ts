import { FEATURE_LEVEL_PRESETS, type FeatureLevel, type FeatureName } from '@shared'

export function getFeaturesMap(level: FeatureLevel): Record<FeatureName, boolean> {
  const enabled = new Set(FEATURE_LEVEL_PRESETS[level])
  const all = Object.values(FEATURE_LEVEL_PRESETS.advanced) as FeatureName[]
  const result = {} as Record<FeatureName, boolean>
  for (const f of all) {
    result[f] = enabled.has(f)
  }
  return result
}
