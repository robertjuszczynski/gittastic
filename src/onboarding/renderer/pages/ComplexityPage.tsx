import React from 'react'
import { SimpleSkeleton, MediumSkeleton, AdvancedSkeleton } from '@onboarding/shared/ui/ComplexitySkeletons'
import type { FeatureLevel } from '@shared'

type TComplexityPageProps = {
  complexity: FeatureLevel
  onChange: (level: FeatureLevel) => void
}

const options: { id: FeatureLevel; label: string; desc: string; skeleton: React.ReactNode }[] = [
  { id: 'simple', label: 'Simple', desc: 'Essential workflow', skeleton: <SimpleSkeleton /> },
  { id: 'normal', label: 'Normal', desc: 'More Git control', skeleton: <MediumSkeleton /> },
  { id: 'advanced', label: 'Advanced', desc: 'Full Git power', skeleton: <AdvancedSkeleton /> },
]

const ComplexityPage = ({ complexity, onChange }: TComplexityPageProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '18px 24px 14px' }}>
    <div style={{ marginBottom: 14, textAlign: 'center' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.03em' }}>
        How advanced should I be?
      </h1>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        Git GUIs can feel overly complex when they include features you rarely use. Choose the level of complexity that works best for you.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
      {options.map(({ id, label, desc, skeleton }) => {
        const selected = complexity === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 8,
              border: selected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: selected ? 'var(--color-accent-glow)' : 'var(--color-surface)',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'border-color 0.12s ease, background 0.12s ease',
              padding: 0,
              WebkitAppRegion: 'no-drag' as any,
            }}
          >
            <div style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
              {skeleton}
            </div>
            <div style={{ padding: '8px 10px 9px', textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: selected ? 'var(--color-accent)' : 'var(--color-text)', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{desc}</div>
            </div>
          </button>
        )
      })}
    </div>

    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '24px 0', textAlign: 'center' }}>
      If you're missing a feature later, you can always enable it through Settings.
    </p>
  </div>
)

export default ComplexityPage
