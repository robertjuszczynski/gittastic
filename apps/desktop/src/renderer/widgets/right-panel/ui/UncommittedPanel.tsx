import React, { useEffect, useState } from 'react'
import { useContentHeight } from '@renderer/shared/lib/useContentHeight'
import { ResizableBox } from 'react-resizable'
import { UnstagedChanges, StagedChanges, SearchBar, CommitSection, DiffView } from '@renderer/features/changes'
import { ConflictEditor } from '@renderer/features/merge-conflicts'
import { useChangesStore } from '@renderer/entities/git-file'
import { useActivePath } from '@renderer/entities/repository'

const Divider = () => <div className='border-t border-black/[0.07]' />

const UncommittedPanel = () => {
  const height = useContentHeight()
  const { activePath } = useActivePath()
  const selectedFile = useChangesStore(s => s.selectedFile)
  const unstaged = useChangesStore(s => s.unstaged)
  const isConflicted = !!selectedFile && unstaged.some(f => f.path === selectedFile && f.status === 'conflicted')

  const [query, setQuery] = useState('')

  // Search is UI-only and scoped to whatever repo is open — don't let a filter from the previous repo silently hide files in a newly-opened one.
  useEffect(() => {
    setQuery('')
  }, [activePath])

  return (
    <div className='flex flex-1 min-h-0 h-full'>
      <ResizableBox
        width={256}
        height={height}
        minConstraints={[180, height]}
        resizeHandles={['e']}
        handleSize={[4, 4]}
        className='height-transition flex flex-col shrink-0 border-r border-r-black/[0.07]'
      >
        <div className='flex flex-col h-full'>
          <SearchBar value={query} onChange={setQuery} />
          <UnstagedChanges query={query} />
          <Divider />
          <StagedChanges query={query} />
          <Divider />
          <CommitSection />
        </div>
      </ResizableBox>
      {isConflicted ? <ConflictEditor path={selectedFile} /> : <DiffView />}
    </div>
  )
}

export default UncommittedPanel
