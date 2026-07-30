import React from 'react'

type CommitDiffPanelProps = {
  hash: string
}

const CommitDiffPanel = ({ hash }: CommitDiffPanelProps) => {
  return (
    <div className='flex flex-1 min-h-0 h-full' style={{ background: 'rgba(107,72,255,0.06)' }}>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>
        Diff — {hash.slice(0, 7)}
      </div>
    </div>
  )
}

export default CommitDiffPanel
