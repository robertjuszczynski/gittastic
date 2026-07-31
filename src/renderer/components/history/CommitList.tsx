import React, { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCommits, useStatus } from '@renderer/hooks/useGit'
import { useSelectionStore } from '@renderer/store/useSelectionStore'
import CommitItem from './CommitItem'
import UncommittedItem from './UncommittedItem'

const ROW_HEIGHT = 25

const CommitList = () => {
  const { data: rows = [] } = useCommits()
  const { data: status, isLoading } = useStatus()
  const selectedItem = useSelectionStore(s => s.selectedItem)
  const parentRef = useRef<HTMLDivElement>(null)

  const selectedMap = useMemo(
    () => Object.fromEntries(rows.map(r => [r.commit.hash, r.commit.hash === selectedItem])),
    [rows, selectedItem]
  )
  const isUncommitedSelected = selectedItem === 'uncommitted'

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  })

  const fileCount = status?.files.length ?? 0

  if (isLoading) return null

  return (
    <div className='w-112.5 shrink-0 flex flex-col border-r border-r-black/[0.07]'>
      <div ref={parentRef} className='h-full overflow-y-auto'>
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
    </div>
  )
}

export default CommitList
