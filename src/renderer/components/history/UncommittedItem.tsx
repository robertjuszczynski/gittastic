import React, { memo } from 'react'
import { useCommitSelectionStore } from '@renderer/store/useCommitSelectionStore'

type UncommittedItemProps = {
  isSelected: boolean
  fileCount: number
}

const UncommittedItem = memo(({ isSelected, fileCount }: UncommittedItemProps) => {
  const setSelectedCommit = useCommitSelectionStore(s => s.setSelectedCommit)

  return (
    <div
      className='flex items-center gap-2 px-3 cursor-pointer h-12'
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        background: isSelected ? 'rgba(27,112,248,0.12)' : undefined,
        borderLeft: isSelected ? '2px solid #1b70f8' : '2px solid transparent',
      }}
      onClick={() => setSelectedCommit('uncommitted')}
    >
      <span className='text-[12px] text-neutral-300 flex-1'>Uncommitted changes</span>
      <span className='text-[11px] text-neutral-500 font-mono'>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
    </div>
  )
})

export default UncommittedItem
