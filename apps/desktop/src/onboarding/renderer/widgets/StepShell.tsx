import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StepDots from './StepDots'
import { cn } from '@renderer/shared/lib'

interface StepShellProps {
  step: number
  direction: number
  total: number
  isFirst: boolean
  isLast: boolean
  isOptional: boolean
  nextLabel?: string
  nextDisabled?: boolean
  onBack: () => void
  onSkip: () => void
  onNext: () => void
  children: React.ReactNode
}

const StepShell = ({ step, direction, total, isFirst, isLast, isOptional, nextLabel, nextDisabled, onBack, onSkip, onNext, children }: StepShellProps) => (
  <div
    className='h-screen flex flex-col bg-bg text-text font-sans select-none overflow-hidden'
  >
    {/* Header — drag region, dots at traffic-light height, back button below */}
    <div
      className='h-[58px] shrink-0 relative'
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Step dots — same vertical position as macOS traffic lights */}
      <div className='absolute left-1/2 top-5 -translate-x-1/2'>
        <StepDots current={step} total={total} />
      </div>

      {/* Back button — below traffic lights */}
      <AnimatePresence>
        {!isFirst && (
          <motion.button
            key="back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onBack}
            className='absolute left-[10px] top-11 flex items-center justify-center w-[30px] h-[26px] bg-transparent border-none cursor-pointer text-text-muted rounded-[4px]'
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="16" y1="10" x2="4" y2="10" />
              <polyline points="9 5 4 10 9 15" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>

    {/* Content */}
    <div className='flex-1 min-h-0 relative overflow-hidden'>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ x: direction * 28, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -28, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className='absolute inset-0'
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Footer */}
    <div
      className={cn(
        'h-[60px] flex items-center gap-2 shrink-0 px-5 pb-5',
        isFirst ? 'justify-stretch' : 'justify-end'
      )}
    >
      {!isFirst && isOptional && (
        <button
          onClick={onSkip}
          className='h-[28px] px-[10px] border-none bg-transparent text-text-muted text-[12px] font-medium cursor-pointer'
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          Skip
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(
          'h-9 rounded-[8px] border-none bg-accent text-white text-[13px] font-medium flex items-center justify-center gap-[5px] transition-[opacity,transform]',
          isFirst ? 'flex-1 px-0' : 'px-[18px]',
          nextDisabled ? 'opacity-40 cursor-default' : 'cursor-pointer'
        )}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
        onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
      >
        {isLast ? 'Get Started' : (nextLabel ?? 'Continue')}
        {!isFirst && !isLast && (
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 4 10 8 6 12" />
          </svg>
        )}
      </button>
    </div>
  </div>
)

export default StepShell
