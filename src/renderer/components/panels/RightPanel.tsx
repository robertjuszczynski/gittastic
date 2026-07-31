import React from 'react'
import { useSelectionStore } from '@renderer/store/useSelectionStore'
import UncommittedPanel from './UncommittedPanel'
import CommitDiffPanel from './CommitDiffPanel'

const RightPanel = () => {
  const selectedItem = useSelectionStore(s => s.selectedItem)

  if (!selectedItem) return null

  return (
    <div className='flex flex-1 min-h-0 flex-col'>
      {selectedItem === 'uncommitted'
        ? <UncommittedPanel />
        : <CommitDiffPanel hash={selectedItem} />
      }
    </div>
  )
}

export default RightPanel
