import React from 'react'
import { useChangesStore } from '@renderer/entities/git-file'
import FilteredFileTree from './FilteredFileTree'

type StagedChangesProps = {
  query: string
}

const StagedChanges = ({ query }: StagedChangesProps) => {
  const staged = useChangesStore(s => s.staged)

  return (
    <div className='flex-1 min-h-0 overflow-y-auto scrollable min-h-[80px]'>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>
        Staged
      </div>
      <FilteredFileTree files={staged} query={query} isStaged={true} />
    </div>
  )
}

export default StagedChanges
