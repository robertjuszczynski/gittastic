import React, { memo } from 'react'
import { useStatus } from '@renderer/hooks/useGit'
import { useSelectionStore } from '@renderer/store/useSelectionStore'

const UncommittedItem = memo(({ isSelected }: { isSelected: boolean }) => {
  const { data: status } = useStatus()
  const setSelectedItem = useSelectionStore(s => s.setSelectedItem)

  const fileCount = status?.files.length ?? 0
  if (fileCount === 0) return null

  return (
    <div
      className='flex items-center gap-2 px-3 cursor-pointer'
      style={{
        height: 25,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        background: isSelected ? 'rgba(27,112,248,0.12)' : undefined,
        borderLeft: isSelected ? '2px solid #1b70f8' : '2px solid transparent',
      }}
      onClick={() => setSelectedItem('uncommitted')}
    >
      <span className='text-[12px] text-neutral-300 flex-1'>Uncommitted changes</span>
      <span className='text-[11px] text-neutral-500 font-mono'>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
    </div>
  )
})

export default UncommittedItem
