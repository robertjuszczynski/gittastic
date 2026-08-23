import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StepDots from './StepDots'

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
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-sans)',
    userSelect: 'none',
    overflow: 'hidden',
  }}>
    {/* Header — drag region, dots at traffic-light height, back button below */}
    <div style={{
      height: 58,
      flexShrink: 0,
      position: 'relative',
      WebkitAppRegion: 'drag' as any,
    }}>
      {/* Step dots — same vertical position as macOS traffic lights */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 20,
        transform: 'translateX(-50%)',
      }}>
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
            style={{
              position: 'absolute',
              left: 10,
              top: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 26,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              borderRadius: 4,
              WebkitAppRegion: 'no-drag' as any,
            }}
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
    <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ x: direction * 28, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -28, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Footer */}
    <div style={{
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: isFirst ? 'stretch' : 'flex-end',
      padding: '0 20px 20px 20px',
      gap: 8,
      flexShrink: 0,
    }}>
      {!isFirst && isOptional && (
        <button
          onClick={onSkip}
          style={{
            height: 28,
            padding: '0 10px',
            border: 'none',
            background: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            WebkitAppRegion: 'no-drag' as any,
          }}
        >
          Skip
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        style={{
          height: 36,
          borderRadius: 8,
          border: 'none',
          background: 'var(--color-accent)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          cursor: nextDisabled ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: isFirst ? undefined : '0 18px',
          flex: isFirst ? 1 : undefined,
          opacity: nextDisabled ? 0.4 : 1,
          WebkitAppRegion: 'no-drag' as any,
        }}
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
