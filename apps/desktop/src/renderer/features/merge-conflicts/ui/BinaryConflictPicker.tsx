import React from 'react'
import type { ConflictFileContent } from '@shared'
import { getImageMimeFromPath } from '@renderer/shared/lib'

type BinaryConflictPickerProps = {
  path: string
  content: ConflictFileContent
  onResolve: (side: 'ours' | 'theirs') => void
}

/** Binary files (images etc.) can't be diffed line-by-line, just pick a whole side. */
const BinaryConflictPicker = ({ path, content, onResolve }: BinaryConflictPickerProps) => {
  const fileName = path.split('/').pop() ?? path
  const mime = getImageMimeFromPath(path)

  return (
    <div className='flex-1 flex flex-col items-center justify-center gap-5 text-center px-6'>
      <span className='text-[12px] text-neutral-500'>{fileName} is binary — pick a version to keep</span>
      <div className='flex items-stretch gap-4'>
        {!content.oursDeleted && (
          <button
            onClick={() => onResolve('ours')}
            className='flex flex-col overflow-hidden rounded-md border border-divider hover:border-accent/50 transition-colors cursor-default'
          >
            <div className='px-3 h-6 flex items-center border-b border-divider bg-surface-2'>
              <span className='text-[10px] font-bold uppercase tracking-wider text-accent'>Ours</span>
            </div>
            <img src={`data:${mime};base64,${content.oursBinary}`} className='h-32 w-40 object-contain bg-black/10 p-2' />
          </button>
        )}
        {!content.theirsDeleted && (
          <button
            onClick={() => onResolve('theirs')}
            className='flex flex-col overflow-hidden rounded-md border border-divider hover:border-accent/50 transition-colors cursor-default'
          >
            <div className='px-3 h-6 flex items-center border-b border-divider bg-surface-2'>
              <span className='text-[10px] font-bold uppercase tracking-wider text-neutral-500'>Theirs</span>
            </div>
            <img src={`data:${mime};base64,${content.theirsBinary}`} className='h-32 w-40 object-contain bg-black/10 p-2' />
          </button>
        )}
      </div>
    </div>
  )
}

export default BinaryConflictPicker
