import React from 'react'
import { FEATURE_LABELS, FEATURES, type FeatureName } from '@shared'
import { useFeaturesStore } from '@renderer/shared/lib/features'

const groups = ['Working copy', 'History', 'Branching', 'Interface'] as const

const featuresByGroup = (group: string): FeatureName[] =>
  (Object.values(FEATURES) as FeatureName[]).filter((f) => FEATURE_LABELS[f].group === group)

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className='relative inline-flex items-center cursor-pointer'
    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
  >
    <div
      className='w-8 h-4 rounded-full transition-colors duration-150'
      style={{ background: enabled ? 'var(--color-accent)' : 'var(--color-border)' }}
    />
    <div
      className='absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-150'
      style={{ transform: enabled ? 'translateX(18px)' : 'translateX(2px)' }}
    />
  </button>
)

const FeaturesSettings = () => {
  const { enabled, toggle } = useFeaturesStore()

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-sm font-semibold text-text mb-1'>Features</h2>
        <p className='text-xs text-text-muted'>Enable or disable individual features.</p>
      </div>

      {groups.map((group) => {
        const features = featuresByGroup(group)
        if (!features.length) return null
        return (
          <div key={group}>
            <div className='text-xs font-semibold text-text-muted uppercase tracking-wider mb-2'>{group}</div>
            <div className='flex flex-col gap-1'>
              {features.map((feature) => (
                <div
                  key={feature}
                  className='flex items-center justify-between py-2 px-3 rounded-md bg-surface'
                >
                  <span className='text-sm text-text'>{FEATURE_LABELS[feature].label}</span>
                  <Toggle enabled={enabled.has(feature)} onToggle={() => toggle(feature)} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FeaturesSettings
