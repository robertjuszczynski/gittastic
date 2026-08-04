import React from 'react'
import { CommitChanges, DiffView } from '@renderer/components/changes'

type CommitDiffPanelProps = {
  hash: string
}

const CommitDiffPanel = ({ hash }: CommitDiffPanelProps) => {
  return (
    <div className='flex flex-1 min-h-0 h-full'>
      <div className='flex flex-col w-64 shrink-0 border-r border-r-black/[0.07]'>
        <CommitChanges hash={hash} />
      </div>
      <DiffView />
    </div>
  )
}

export default CommitDiffPanel
