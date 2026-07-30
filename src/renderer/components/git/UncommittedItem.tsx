import React from 'react'
import { useGitStatus } from '@renderer/hooks/useGitStatus'
import { useAppStore } from '@renderer/store/useAppStore'

const UncommittedItem = () => {
  const { data: status } = useGitStatus()
  const { selectedItem, setSelectedItem } = useAppStore()

  const fileCount = status?.files.length ?? 0
  if (fileCount === 0) return null

  const isSelected = selectedItem === 'uncommitted'

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
      <span className='text-[11px] font-bold text-[#1b70f8] font-mono'>uncommitted</span>
      <span className='text-[12px] text-neutral-300 flex-1'>Uncommitted changes</span>
      <span className='text-[11px] text-neutral-500 font-mono'>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
    </div>
  )
}

export default UncommittedItem
