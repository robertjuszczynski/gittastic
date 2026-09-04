import React from 'react'
import type { ConflictHunk } from '../lib/conflictHunks'
import { computeHunkResolutionState } from '../lib/conflictHunks'

type ConflictNavigatorProps = {
  hunks: ConflictHunk[]
  currentContent: string
  rawContent: string
  activeHunkIndex: number | null
  onSelectHunk: (index: number) => void
}

/** Same glyph grammar as StageCheckbox (shared/ui) — resolving a hunk is, mechanically, staging it, so the indicator reuses the visual the user already reads that way elsewhere in the app. Kept as a plain SVG here rather than importing StageCheckbox: it isn't a click target, it's a status dot, and it needs the pending "unresolved" color StageCheckbox has no concept of. */
const HunkStateGlyph = ({ resolved }: { resolved: boolean }) => (
  <svg width='12' height='12' className='shrink-0'>
    <rect
      x='0.5' y='0.5' width='11' height='11' rx='2.5'
      fill={resolved ? '#1b70f8' : 'none'}
      stroke={resolved ? '#1b70f8' : '#f97316'}
      strokeWidth='1'
    />
    {resolved && (
      <path d='M3 6L5 8L9 3.5' stroke='white' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' fill='none' />
    )}
  </svg>
)

/**
 * Outline of every conflict hunk in the currently open file — jump-to-hunk
 * plus a resolved/pending indicator, so resolving a file with many hunks
 * doesn't mean scrolling and hunting for the next `<<<<<<<`.
 */
const ConflictNavigator = ({ hunks, currentContent, rawContent, activeHunkIndex, onSelectHunk }: ConflictNavigatorProps) => {
  if (hunks.length === 0) return null

  const resolvedCount = hunks.filter(h => computeHunkResolutionState(h, currentContent, rawContent) === 'resolved').length

  return (
    <div className='w-36 shrink-0 flex flex-col border-l border-l-divider'>
      <div className='px-3 h-8 flex items-center justify-between shrink-0 border-b border-b-divider'>
        <span className='text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>Hunks</span>
        <span className='text-[11px] text-neutral-600 tabular-nums'>{resolvedCount}/{hunks.length}</span>
      </div>
      <div className='flex-1 min-h-0 overflow-y-auto scrollable'>
        {hunks.map(hunk => {
          const resolved = computeHunkResolutionState(hunk, currentContent, rawContent) === 'resolved'
          const isActive = activeHunkIndex === hunk.index

          return (
            <button
              key={hunk.index}
              onClick={() => onSelectHunk(hunk.index)}
              className={`w-full flex items-center gap-2 px-3 h-[26px] text-[12px] text-left cursor-default transition-colors ${
                isActive ? 'bg-accent/6 text-accent' : 'text-neutral-300 hover:bg-surface-2'
              }`}
            >
              <HunkStateGlyph resolved={resolved} />
              <span className='tabular-nums'>Hunk {hunk.index + 1}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ConflictNavigator
