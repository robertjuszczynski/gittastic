import React, { useEffect, useRef } from 'react'
import { cn } from '@renderer/shared/lib'

function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = canvas.offsetWidth * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    const cols = 9, rows = 8, gapX = W / (cols + 1), gapY = H / (rows + 1)
    let t = 0, raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave = Math.sin(t + (c + r) * 0.5) * 0.5 + 0.5
          const edgeFade = (1 - c / cols) * (1 - r / rows * 0.5)
          const alpha = wave * edgeFade * 0.7 + 0.08
          ctx.beginPath()
          ctx.arc((c + 1) * gapX, (r + 1) * gapY, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(27, 112, 248, ${alpha})`
          ctx.fill()
        }
      }
      t += 0.025
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className='w-full h-full block' />
}

type TWhoAreYouPageProps = {
  name: string
  email: string
  errors: Record<string, string>
  onChange: (field: 'name' | 'email', value: string) => void
}

const WhoAreYouPage = ({ name, email, errors, onChange }: TWhoAreYouPageProps) => (
  <div className='flex h-full'>
    <div className='flex-1 flex flex-col justify-center px-8 pr-7'>
      <h1 className='text-[22px] font-bold tracking-[-0.03em] text-text mb-2'>
        Who are you?
      </h1>
      <p className='text-[13px] text-text-muted leading-[1.6] mb-[22px]'>
        This is used to attribute your commits, same as git config user.name/email.
      </p>

      <div className='flex flex-col gap-[14px]'>
        {([
          { key: 'name' as const, label: 'Name', placeholder: 'Your name', type: 'text', value: name },
          { key: 'email' as const, label: 'Email', placeholder: 'you@example.com', type: 'email', value: email },
        ]).map(({ key, label, placeholder, type, value }) => (
          <div key={key}>
            <label className='block text-[11px] font-medium text-text-secondary mb-[5px] uppercase tracking-[0.07em]'>
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              className={cn(
                'w-full h-[34px] px-[10px] rounded-[6px] border bg-surface text-text text-[13px] outline-none box-border',
                errors[key] ? 'border-[#c93a3a]' : 'border-border'
              )}
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.target.style.borderColor = errors[key] ? '#c93a3a' : 'var(--color-border)' }}
            />
            {errors[key] && (
              <p className='text-[11px] text-[#c93a3a] mt-1'>{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className='flex-1 overflow-hidden'>
      <DotGrid />
    </div>
  </div>
)

export default WhoAreYouPage
