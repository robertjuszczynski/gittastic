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
  return <canvas ref={ref} className='absolute inset-0 w-full h-full pointer-events-none' />
}

const WelcomePage = () => (
  <div className='relative h-full flex items-center justify-center'>
    <ParticlesBackground />
    <div className='relative z-[1] flex flex-col items-center text-center'>
      <div className='w-[52px] h-[52px] rounded-[12px] bg-surface-2 flex items-center justify-center text-accent'>
        <LogoBranchIcon size={20} />
      </div>
      <h1 className='text-[22px] font-bold tracking-[-0.03em] mt-[18px] text-text'>
        You're Gittastic!
      </h1>
      <p className='text-[13px] text-text-muted max-w-[300px] leading-[1.6] mt-[10px]'>
        Thanks for using Gittastic. I hope it makes working with Git a little easier. I won't take up any more of your time, so let's get started. It'll be quick.
      </p>
    </div>
  </div>
)

export default WelcomePage
