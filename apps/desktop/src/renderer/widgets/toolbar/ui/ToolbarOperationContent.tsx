import { useEffect, useState } from 'react'
import { animate } from 'motion'
import type { Operation } from '@renderer/shared/lib'
import { useLoadingStore } from '@renderer/shared/lib'

const BAR_COUNT = 8

function Spinner() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % BAR_COUNT), 80)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width: 14, height: 14, flexShrink: 0 }}>
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const age = (tick - i + BAR_COUNT) % BAR_COUNT
        const opacity = Math.max(0.12, 1 - (age / BAR_COUNT) * 0.88)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 2,
              height: 5,
              marginLeft: -1,
              marginTop: -2.5,
              borderRadius: 1,
              backgroundColor: 'rgb(180, 180, 180)',
              opacity,
              transformOrigin: '1px 2.5px',
              transform: `rotate(${(i / BAR_COUNT) * 360}deg) translateY(-4px)`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function ToolbarOperationContent({ op, opId }: { op: Operation; opId: string }) {
  const remove = useLoadingStore((s) => s.remove)
  const [displayProgress, setDisplayProgress] = useState(0)
  const isOperationDone = op.done

  useEffect(() => {
    if (isOperationDone) {
      animate(0, 100, {
        ease: "easeOut",
        onUpdate: (value) => setDisplayProgress(Math.round(value)),
        onComplete: () => {
          remove(opId)
        },
      });
    }
  }, [isOperationDone])

  return (
    <div className='flex items-center gap-3 px-4 py-1.5'>
      <Spinner />
      <div className='flex items-center'>
        <span className='text-[12px] text-neutral-300'>{op.label}</span>
      </div>
      <div className='w-24 h-1 bg-black/20 rounded-full overflow-hidden'>
        <div
          className='h-full bg-accent rounded-full'
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      <span className='text-[11px] text-neutral-500 tabular-nums w-7 text-right'>
        {displayProgress}%
      </span>
    </div>
  )
}
