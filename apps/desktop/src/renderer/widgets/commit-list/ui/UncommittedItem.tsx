import React, { memo } from 'react'
import { useCommitSelectionStore } from '@renderer/entities/commit/model/useCommitSelectionStore'
import { cn } from '@renderer/shared/lib'

type UncommittedItemProps = {
  isSelected: boolean
  fileCount: number
}

const UncommittedItem = memo(({ isSelected, fileCount }: UncommittedItemProps) => {
  const setSelectedCommit = useCommitSelectionStore(s => s.setSelectedCommit)

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 cursor-pointer h-12 border-b border-b-black/5 border-l-2',
        isSelected ? 'bg-[rgba(27,112,248,0.12)] border-l-accent' : 'border-l-transparent'
      )}
      onClick={() => setSelectedCommit('uncommitted')}
    >
      <span className='text-[12px] text-neutral-300 flex-1'>Uncommitted changes</span>
      <span className='text-[11px] text-neutral-500 font-mono'>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
    </div>
  )
})

export default UncommittedItem
