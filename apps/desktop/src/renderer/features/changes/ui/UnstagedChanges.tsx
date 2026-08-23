import React from 'react'
import { useChangesStore } from '@renderer/entities/git-file/model/useChangesStore'
import FileTree from './FileTree'

const UnstagedChanges = () => {
  const unstaged = useChangesStore(s => s.unstaged)

  return (
    <div className='flex-1 min-h-0 overflow-y-auto scrollable min-h-[80px]'>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>
        Unstaged
      </div>
      <FileTree files={unstaged} isStaged={false} />
    </div>
  )
}

export default UnstagedChanges
