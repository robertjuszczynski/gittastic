import React from 'react'
import { useContentHeight } from '@renderer/shared/lib/useContentHeight'
import { ResizableBox } from 'react-resizable'
import { UnstagedChanges, StagedChanges, CommitSection, DiffView } from '@renderer/features/changes'

const Divider = () => <div className='border-t border-black/[0.07]' />

const UncommittedPanel = () => {
  const height = useContentHeight()
  return (
    <div className='flex flex-1 min-h-0 h-full'>
      <ResizableBox
        width={256}
        height={height}
        resizeHandles={['e']}
        handleSize={[4, 4]}
        className='height-transition flex flex-col shrink-0 border-r border-r-black/[0.07]'
      >
        <div className='flex flex-col h-full'>
          <UnstagedChanges />
          <Divider />
          <StagedChanges />
          <Divider />
          <CommitSection />
        </div>
      </ResizableBox>
      <DiffView />
    </div>
  )
}

export default UncommittedPanel
