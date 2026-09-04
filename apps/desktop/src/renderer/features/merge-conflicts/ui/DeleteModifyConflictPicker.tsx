import React from 'react'
import { Trash2 } from 'lucide-react'
import type { ConflictFileContent } from '@shared'

type DeleteModifyConflictPickerProps = {
  path: string
  content: ConflictFileContent
  onKeep: (side: 'ours' | 'theirs') => void
  onDelete: () => void
}

/** One side deleted the file, the other modified it — there's nothing to diff, just keep or delete. */
const DeleteModifyConflictPicker = ({ path, content, onKeep, onDelete }: DeleteModifyConflictPickerProps) => {
  const fileName = path.split('/').pop() ?? path
  const deletedSide = content.oursDeleted ? 'ours' : 'theirs'
  const modifiedSide = content.oursDeleted ? 'theirs' : 'ours'

  return (
    <div className='flex-1 flex flex-col items-center justify-center gap-5 text-center px-6'>
      <div className='flex flex-col gap-1'>
        <span className='text-[12px] text-neutral-300'>{fileName}</span>
        <span className='text-[11px] text-neutral-500'>
          deleted in <span className={deletedSide === 'ours' ? 'text-accent' : 'text-neutral-400'}>{deletedSide}</span>,
          {' '}modified in <span className={modifiedSide === 'ours' ? 'text-accent' : 'text-neutral-400'}>{modifiedSide}</span>
        </span>
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onKeep(modifiedSide)}
          className='text-[11px] font-medium px-3 py-1.5 rounded transition-colors bg-accent text-white hover:bg-accent/80 cursor-default'
        >
          Keep {modifiedSide}&rsquo;s version
        </button>
        <button
          onClick={onDelete}
          className='flex items-center gap-1.5 text-[11px] text-remove px-3 py-1.5 border border-border rounded hover:bg-remove-bg transition-colors cursor-default'
        >
          <Trash2 size={12} strokeWidth={1.8} />
          Delete file
        </button>
      </div>
    </div>
  )
}

export default DeleteModifyConflictPicker
