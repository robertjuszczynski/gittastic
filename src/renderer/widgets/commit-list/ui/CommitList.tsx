import React, { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCommits } from '@renderer/entities/commit/api/useCommits'
import { useStatus } from '@renderer/entities/git-file/api/useStatus'
import { useCommitSelectionStore } from '@renderer/entities/commit/model/useCommitSelectionStore'
import CommitItem from './CommitItem'
import UncommittedItem from './UncommittedItem'
import { ResizableBox } from 'react-resizable';

const ROW_HEIGHT = 25

const CommitList = () => {
  const height = window.innerHeight - 52;
  const { data: rows = [] } = useCommits()
  const { data: status, isLoading } = useStatus()
  const selectedCommit = useCommitSelectionStore(s => s.selectedCommit)
  const parentRef = useRef<HTMLDivElement>(null)

  const selectedMap = useMemo(
    () => Object.fromEntries(rows.map(r => [r.commit.hash, r.commit.hash === selectedCommit])),
    [rows, selectedCommit]
  )
  const isUncommitedSelected = selectedCommit === 'uncommitted'

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  })

  const fileCount = status?.files.length ?? 0

  if (isLoading) return null

  return (
    <ResizableBox
      width={450} 
      height={height} 
      resizeHandles={['e']}
      handleSize={[4, 4]}
      className='shrink-0 flex flex-col border-r border-r-black/[0.07]'
    >
      <div ref={parentRef} className='h-full overflow-y-auto scrollable'>
        {fileCount !== 0 && <UncommittedItem isSelected={isUncommitedSelected} fileCount={fileCount} />}
        <div className='relative' style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map(virtualRow => (
            <div
              key={virtualRow.key}
              className='absolute w-full'
              style={{ top: virtualRow.start }}
            >
              <CommitItem row={rows[virtualRow.index]} index={virtualRow.index} isSelected={selectedMap[rows[virtualRow.index].commit.hash]} />
            </div>
          ))}
        </div>
      </div>
    </ResizableBox>
  )
}

export default CommitList
