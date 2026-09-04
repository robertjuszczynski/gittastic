import React from 'react'
import type { FileChange } from '@shared'
import { filterFilesByQuery } from '../lib/filterFilesByQuery'
import FileTree from './FileTree'

type FilteredFileTreeProps = {
  files: FileChange[]
  query: string
  isStaged: boolean
}

/** Shared by StagedChanges/UnstagedChanges — filters by the search query and swaps in an empty state instead of an empty tree. */
const FilteredFileTree = ({ files, query, isStaged }: FilteredFileTreeProps) => {
  const filtered = filterFilesByQuery(files, query)

  if (query && filtered.length === 0) {
    return <p className='px-3 py-2 text-[12px] text-neutral-600'>No matching files</p>
  }

  return <FileTree files={filtered} isStaged={isStaged} />
}

export default FilteredFileTree
