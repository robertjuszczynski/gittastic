import React, { useEffect, useRef } from 'react'

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
  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
}

type TWhoAreYouPageProps = {
  name: string
  email: string
  errors: Record<string, string>
  onChange: (field: 'name' | 'email', value: string) => void
}

const WhoAreYouPage = ({ name, email, errors, onChange }: TWhoAreYouPageProps) => (
  <div style={{ display: 'flex', height: '100%' }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px 0 32px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-text)', marginBottom: 8 }}>
        Who are you?
      </h1>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 22 }}>
        This is used to attribute your commits, same as git config user.name/email.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {([
          { key: 'name' as const, label: 'Name', placeholder: 'Your name', type: 'text', value: name },
          { key: 'email' as const, label: 'Email', placeholder: 'you@example.com', type: 'email', value: email },
        ]).map(({ key, label, placeholder, type, value }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              style={{
                width: '100%',
                height: 34,
                padding: '0 10px',
                borderRadius: 6,
                border: errors[key] ? '1px solid #c93a3a' : '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                WebkitAppRegion: 'no-drag' as any,
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.target.style.borderColor = errors[key] ? '#c93a3a' : 'var(--color-border)' }}
            />
            {errors[key] && (
              <p style={{ fontSize: 11, color: '#c93a3a', marginTop: 4 }}>{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>

    <div style={{ flex: 1, overflow: 'hidden' }}>
      <DotGrid />
    </div>
  </div>
)

export default WhoAreYouPage
