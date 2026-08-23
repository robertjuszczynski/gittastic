import React from 'react'
import { SimpleSkeleton, MediumSkeleton, AdvancedSkeleton } from '@onboarding/shared/ui/ComplexitySkeletons'
import type { FeatureLevel } from '@shared'
import { cn } from '@renderer/shared/lib'

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
  <div className='flex flex-col h-full px-6 pt-[18px] pb-[14px]'>
    <div className='mb-[14px] text-center'>
      <h1 className='text-[22px] font-bold text-text mb-2 tracking-[-0.03em]'>
        How advanced should I be?
      </h1>
      <p className='text-[13px] text-text-muted leading-[1.6]'>
        Git GUIs can feel overly complex when they include features you rarely use. Choose the level of complexity that works best for you.
      </p>
    </div>

    <div className='grid grid-cols-3 gap-2 flex-1'>
      {options.map(({ id, label, desc, skeleton }) => {
        const selected = complexity === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'flex flex-col rounded-[8px] border cursor-pointer overflow-hidden transition-[border-color,background] duration-[120ms] ease-linear p-0',
              selected ? 'border-accent bg-accent-glow' : 'border-border bg-surface'
            )}
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <div className='bg-bg border-b border-b-divider'>
              {skeleton}
            </div>
            <div className='px-[10px] pt-2 pb-[9px] text-left'>
              <div className={cn('text-[12px] font-semibold mb-0.5', selected ? 'text-accent' : 'text-text')}>
                {label}
              </div>
              <div className='text-[11px] text-text-muted'>{desc}</div>
            </div>
          </button>
        )
      })}
    </div>

    <p className='text-[13px] text-text-muted my-6 text-center'>
      If you're missing a feature later, you can always enable it through Settings.
    </p>
  </div>
)

export default ComplexityPage
