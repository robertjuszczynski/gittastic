import React from 'react'

type StageCheckboxProps = {
  isStaged: boolean
  isPartial?: boolean
  onClick: () => void
  className?: string
}

const StageCheckbox = ({ isStaged, isPartial, onClick, className = '' }: StageCheckboxProps) => (
  <svg
    width="14"
    height="14"
    className={`shrink-0 cursor-pointer ${className}`}
    onClick={e => { e.stopPropagation(); onClick() }}
  >
    <rect
      className={isStaged ? 'stroke-accent' : 'stroke-black/25'}
      x="0.5"
      y="0.5"
      width="13"
      height="13"
      rx="2"
      fill={isStaged ? '#1b70f8' : 'none'}
      strokeWidth="1"
    />
    {isStaged && !isPartial && (
      <path
        d="M4 7L6.5 9.5L10.5 4.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )}
    {isStaged && isPartial && (
      <line x1="4" y1="7" x2="10" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    )}
  </svg>
)

export default StageCheckbox
