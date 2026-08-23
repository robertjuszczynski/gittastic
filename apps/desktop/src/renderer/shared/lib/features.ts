import { create } from 'zustand'
import { FEATURE_LEVEL_PRESETS, type FeatureName, type FeatureLevel } from '@shared'

type FeaturesStore = {
  enabled: Set<FeatureName>
  setFromLevel: (level: FeatureLevel) => void
  toggle: (feature: FeatureName) => void
  isEnabled: (feature: FeatureName) => boolean
}

export const useFeaturesStore = create<FeaturesStore>((set, get) => ({
  enabled: new Set(FEATURE_LEVEL_PRESETS.normal),
  setFromLevel: (level) => set({ enabled: new Set(FEATURE_LEVEL_PRESETS[level]) }),
  toggle: (feature) => set((s) => {
    const next = new Set(s.enabled)
    next.has(feature) ? next.delete(feature) : next.add(feature)
    return { enabled: next }
  }),
  isEnabled: (feature) => get().enabled.has(feature),
}))

export const useFeature = (feature: FeatureName) => useFeaturesStore((s) => s.isEnabled(feature))
