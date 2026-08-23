import React from 'react'

const sk = {
  sidebar: 'var(--color-surface-2)',
  panel: 'var(--color-surface)',
  bg: 'var(--color-bg)',
  line: 'var(--color-neutral-700)',
  dim: 'var(--color-neutral-600)',
  accent: 'var(--color-accent)',
  border: 'var(--color-border)',
}

export const SimpleSkeleton = () => (
  <svg viewBox="0 0 148 84" className='block w-full h-auto'>
    <rect width="148" height="84" fill={sk.bg} />
    <rect width="30" height="84" fill={sk.sidebar} />
    <rect x="6" y="10" width="18" height="2.5" rx="1" fill={sk.dim} />
    <rect x="6" y="17" width="14" height="2" rx="1" fill={sk.line} />
    <rect x="6" y="23" width="16" height="2" rx="1" fill={sk.line} />
    <rect x="6" y="34" width="10" height="1.5" rx="1" fill={sk.dim} opacity="0.6" />
    <rect x="6" y="40" width="14" height="2" rx="1" fill={sk.line} />
    <rect x="6" y="46" width="12" height="2" rx="1" fill={sk.line} />
    <line x1="30" y1="0" x2="30" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="31" width="48" height="84" fill={sk.panel} />
    <rect x="34" y="7" width="22" height="2.5" rx="1" fill={sk.dim} />
    {[18, 27, 36, 45, 54, 63, 72].map((y, i) => (
      <g key={i}>
        <circle cx="37" cy={y} r="2" fill={i === 0 ? sk.accent : sk.dim} />
        <rect x="43" y={y - 1.5} width={i % 3 === 0 ? 20 : 26} height="2" rx="1" fill={sk.dim} />
        <rect x="43" y={y + 2.5} width="12" height="1.5" rx="0.5" fill={sk.line} />
      </g>
    ))}
    <line x1="79" y1="0" x2="79" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="80" width="68" height="84" fill={sk.bg} />
    <rect x="84" y="9" width="46" height="2" rx="1" fill={sk.dim} />
    {[18, 24, 30, 36, 42, 48, 54, 60, 66, 72].map((y, i) => (
      <rect key={i} x="84" y={y} width={i % 5 === 0 ? 48 : i % 3 === 0 ? 34 : 42} height="1.5" rx="0.5" fill={sk.line} />
    ))}
  </svg>
)

export const MediumSkeleton = () => (
  <svg viewBox="0 0 148 84" className='block w-full h-auto'>
    <rect width="148" height="84" fill={sk.bg} />
    <rect width="20" height="84" fill={sk.sidebar} />
    {[7, 18, 29, 40, 51, 62].map((y) => (
      <rect key={y} x="5" y={y} width="10" height="8" rx="2" fill={sk.line} />
    ))}
    <line x1="20" y1="0" x2="20" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="21" width="38" height="84" fill={sk.panel} />
    <rect x="25" y="6" width="24" height="2.5" rx="1" fill={sk.dim} />
    {[14, 21, 28, 36, 43, 50, 58, 65, 72].map((y, i) => (
      <rect key={i} x={25 + (i === 2 || i === 3 ? 5 : 0)} y={y} width={i === 2 || i === 3 ? 18 : 24} height="2" rx="0.5" fill={i === 0 ? sk.accent : sk.dim} />
    ))}
    <line x1="59" y1="0" x2="59" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="60" width="88" height="84" fill={sk.bg} />
    <rect x="63" y="5" width="18" height="3" rx="1" fill={sk.accent} />
    <rect x="85" y="5" width="16" height="3" rx="1" fill={sk.line} />
    <rect x="105" y="5" width="14" height="3" rx="1" fill={sk.line} />
    <line x1="60" y1="11" x2="148" y2="11" stroke={sk.border} strokeWidth="0.8" />
    <rect x="63" y="16" width="22" height="2" rx="1" fill={sk.dim} opacity="0.8" />
    {[22, 28, 34].map((y, i) => (
      <g key={i}>
        <rect x="66" y={y} width="4" height="4" rx="1" fill={sk.dim} />
        <rect x="73" y={y + 0.5} width={i === 1 ? 38 : 30} height="1.5" rx="0.5" fill={sk.dim} />
        <rect x="73" y={y + 3} width="16" height="1.5" rx="0.5" fill={sk.line} />
      </g>
    ))}
    <line x1="60" y1="43" x2="148" y2="43" stroke={sk.border} strokeWidth="0.8" />
    <rect x="63" y="47" width="26" height="2" rx="1" fill={sk.dim} opacity="0.8" />
    {[53, 59, 65, 71].map((y, i) => (
      <g key={i}>
        <rect x="66" y={y} width="4" height="4" rx="1" fill={sk.line} />
        <rect x="73" y={y + 0.5} width={i % 2 === 0 ? 36 : 26} height="1.5" rx="0.5" fill={sk.dim} />
      </g>
    ))}
    <rect x="63" y="77" width="70" height="5" rx="1.5" fill={sk.panel} />
  </svg>
)

export const AdvancedSkeleton = () => (
  <svg viewBox="0 0 148 84" className='block w-full h-auto'>
    <rect width="148" height="84" fill={sk.bg} />
    <rect width="16" height="84" fill={sk.sidebar} />
    {[5, 14, 23, 32, 41, 50, 59, 68, 77].map((y) => (
      <rect key={y} x="3" y={y} width="10" height="7" rx="1.5" fill={sk.line} />
    ))}
    <line x1="16" y1="0" x2="16" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="17" width="30" height="84" fill={sk.panel} />
    <rect x="20" y="6" width="20" height="2" rx="1" fill={sk.dim} />
    {[13, 20, 27, 34, 41, 48, 55, 62, 69, 76].map((y, i) => (
      <rect key={i} x={20 + (i === 2 || i === 3 ? 4 : 0)} y={y} width={i === 2 || i === 3 ? 16 : 20} height="2" rx="0.5" fill={i === 0 ? sk.accent : sk.dim} />
    ))}
    <line x1="47" y1="0" x2="47" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="48" width="36" height="84" fill={sk.bg} />
    <rect x="51" y="6" width="26" height="2" rx="1" fill={sk.dim} />
    <line x1="56" y1="13" x2="56" y2="75" stroke={sk.line} strokeWidth="1" />
    <line x1="62" y1="27" x2="62" y2="48" stroke={sk.line} strokeWidth="1" />
    <line x1="56" y1="27" x2="62" y2="27" stroke={sk.line} strokeWidth="1" />
    <line x1="56" y1="48" x2="62" y2="48" stroke={sk.line} strokeWidth="1" />
    {[13, 20, 27, 34, 41, 48, 55, 62, 69, 75].map((y, i) => (
      <g key={i}>
        <circle cx={i === 3 || i === 4 ? 62 : 56} cy={y} r="2" fill={i === 0 ? sk.accent : sk.dim} />
        <rect x="68" y={y - 1} width={i % 2 === 0 ? 12 : 8} height="2" rx="0.5" fill={sk.dim} />
      </g>
    ))}
    <line x1="84" y1="0" x2="84" y2="84" stroke={sk.border} strokeWidth="0.8" />
    <rect x="85" width="63" height="42" fill={sk.panel} />
    <rect x="88" y="6" width="18" height="2" rx="1" fill={sk.dim} />
    <rect x="110" y="6" width="10" height="2" rx="1" fill={sk.line} />
    {[13, 19, 25, 31, 37].map((y, i) => (
      <g key={i}>
        <rect x="88" y={y} width="4" height="4" rx="0.5" fill={sk.dim} />
        <rect x="95" y={y + 1} width={i % 3 === 0 ? 30 : 22} height="1.5" rx="0.5" fill={sk.dim} />
        <rect x="135" y={y + 1} width="8" height="1.5" rx="0.5" fill={i === 0 ? sk.accent : sk.line} />
      </g>
    ))}
    <line x1="85" y1="42" x2="148" y2="42" stroke={sk.border} strokeWidth="0.8" />
    <rect x="85" y="42" width="63" height="42" fill={sk.sidebar} />
    <rect x="88" y="48" width="14" height="1.5" rx="1" fill={sk.dim} opacity="0.7" />
    {[53, 59, 65, 71, 77].map((y, i) => (
      <rect key={i} x="88" y={y} width={i % 2 === 0 ? 38 : 28} height="1.5" rx="0.5" fill={sk.line} />
    ))}
  </svg>
)
