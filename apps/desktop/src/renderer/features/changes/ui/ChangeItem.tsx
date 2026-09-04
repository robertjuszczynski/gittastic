import React from 'react'
import { CHANNELS, type FileChange } from '@shared'
import { useChangesStore } from '@renderer/entities/git-file'
import StatusBadge from './StatusBadge'
import { StageCheckbox } from '@renderer/shared/ui'

type ChangeItemProps = {
  change: FileChange
  isStaged?: boolean
  depth?: number
  hash?: string
}

const ChangeItem = ({ change, isStaged, depth = 0, hash }: ChangeItemProps) => {
  const selectedFile = useChangesStore(s => s.selectedFile)
  const setSelectedFile = useChangesStore(s => s.setSelectedFile)
  const stageFile = useChangesStore(s => s.stageFile)
  const unstageFile = useChangesStore(s => s.unstageFile)
  const unstaged = useChangesStore(s => s.unstaged)
  const isSelected = selectedFile === change.path
  const isPartial = isStaged && unstaged.some(f => f.path === change.path)
  const fileName = change.path.split('/').pop() ?? change.path

  return (
    <div
      className={`flex items-center gap-1.5 h-5.5 cursor-pointer text-[12px] pr-3 ${
        isSelected ? 'bg-accent/6 text-accent' : 'text-neutral-300 hover:bg-surface-2'
      }`}
      style={{ paddingLeft: depth === 0 ? 12 :depth * 20 + 26 }}
      onClick={() => setSelectedFile(change.path, hash)}
      onContextMenu={e => {
        e.preventDefault()
        window.electron[CHANNELS.OPEN_FILE_CONTEXT_MENU]({ path: change.path, status: change.status })
      }}
    >
      {isStaged !== undefined && (
        <StageCheckbox
          isStaged={isStaged}
          isPartial={isPartial}
          onClick={() => isStaged ? unstageFile(change.path) : stageFile(change.path)}
        />
      )}
      <span className='truncate flex-1'>{fileName}</span>
      <StatusBadge status={change.status} />
    </div>
  )
}

export default ChangeItem
