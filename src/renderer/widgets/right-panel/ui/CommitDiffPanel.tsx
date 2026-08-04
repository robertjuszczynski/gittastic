import React from 'react'
import { ResizableBox } from 'react-resizable'
import { CommitChanges, DiffView } from '@renderer/features/changes'

type CommitDiffPanelProps = {
  hash: string
}

const CommitDiffPanel = ({ hash }: CommitDiffPanelProps) => {
  return (
    <div className='flex flex-1 min-h-0 h-full'>
      <ResizableBox
        width={256}
        height={window.innerHeight - 52}
        resizeHandles={['e']}
        handleSize={[4, 4]}
        className='flex flex-col shrink-0 border-r border-r-black/[0.07]'
      >
        <div className='flex flex-col h-full'>
          <CommitChanges hash={hash} />
        </div>
      </ResizableBox>
      <DiffView />
    </div>
  )
}

export default CommitDiffPanel
