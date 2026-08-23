import React from 'react'
import type { FileChangeStatus } from '@shared'

const STATUS_CONFIG: Record<FileChangeStatus, { label: string; color: string }> = {
  modified:   { label: 'M', color: '#f59e0b' },
  added:      { label: '+', color: '#10b981' },
  deleted:    { label: '−', color: '#ef4444' },
  renamed:    { label: 'R', color: '#3b82f6' },
  untracked:  { label: '?', color: '#737373' },
  conflicted: { label: '!', color: '#f97316' },
}

const StatusBadge = ({ status }: { status: FileChangeStatus }) => {
  const { label, color } = STATUS_CONFIG[status]

  return (
    <svg width="16" height="16" className='shrink-0'>
      <rect width="16" height="16" rx="2" fill={color} />
      <text
        x="8"
        y="8"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>
  )
}

export default StatusBadge
