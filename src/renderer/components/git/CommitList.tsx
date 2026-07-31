import React, { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCommits } from '@renderer/hooks/useGit'
import { useAppStore } from '@renderer/store/useAppStore'
import CommitItem from './CommitItem'
import UncommittedItem from './UncommittedItem'

const ROW_HEIGHT = 25

const CommitList = () => {
  const { data: rows = [] } = useCommits()
  const selectedItem = useAppStore(s => s.selectedItem)
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

  return (
    <div className='w-112.5 shrink-0 flex flex-col border-r border-r-black/[0.07]'>
      <div ref={parentRef} className='h-full overflow-y-auto'>
        <UncommittedItem isSelected={isUncommitedSelected} />
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
