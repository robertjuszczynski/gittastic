import React from 'react'

const BranchIcon = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round'>
    <circle cx='3' cy='2.5' r='1.2' fill='currentColor' stroke='none' />
    <circle cx='3' cy='9.5' r='1.2' fill='currentColor' stroke='none' />
    <circle cx='9' cy='2.5' r='1.2' fill='currentColor' stroke='none' />
    <line x1='3' y1='3.7' x2='3' y2='8.3' />
    <path d='M3 4.5 C3 6.5 9 6.5 9 3.7' />
  </svg>
)

export default BranchIcon
