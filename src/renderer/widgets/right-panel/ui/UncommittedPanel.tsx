import React from 'react'
import { UnstagedChanges, StagedChanges, CommitSection, DiffView } from '@renderer/features/changes'

const Divider = () => <div className='border-t border-black/[0.07]' />

const UncommittedPanel = () => {
  return (
    <div className='flex flex-1 min-h-0 h-full'>
      <div className='flex flex-col w-64 shrink-0 border-r border-r-black/[0.07]'>
        <UnstagedChanges />
        <Divider />
        <StagedChanges />
        <Divider />
        <CommitSection />
      </div>
      <DiffView />
    </div>
  )
}

export default UncommittedPanel
