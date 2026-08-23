import React, { useEffect, useRef } from 'react'
import LogoBranchIcon from '@onboarding/shared/ui/LogoBranchIcon'

function ParticlesBackground() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.2 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(27, 112, 248, 0.18)'
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

const WelcomePage = () => (
  <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ParticlesBackground />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: 'var(--color-surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-accent)',
      }}>
        <LogoBranchIcon size={20} />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 18, color: 'var(--color-text)' }}>
        You're Gittastic!
      </h1>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 300, lineHeight: 1.6, marginTop: 10 }}>
        Thanks for using Gittastic. I hope it makes working with Git a little easier. I won't take up any more of your time, so let's get started. It'll be quick.
      </p>
    </div>
  </div>
)

export default WelcomePage
