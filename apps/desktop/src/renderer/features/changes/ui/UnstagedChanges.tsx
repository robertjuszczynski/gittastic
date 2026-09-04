import React from 'react'
import { useChangesStore } from '@renderer/entities/git-file'
import FilteredFileTree from './FilteredFileTree'

type UnstagedChangesProps = {
  query: string
}

const UnstagedChanges = ({ query }: UnstagedChangesProps) => {
  const unstaged = useChangesStore(s => s.unstaged)

  return (
    <div className='flex-1 min-h-0 overflow-y-auto scrollable min-h-[80px]'>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>
        Unstaged
      </div>
      <FilteredFileTree files={unstaged} query={query} isStaged={false} />
    </div>
  )
}

export default UnstagedChanges
