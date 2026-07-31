import React from 'react'
import { useAppStore } from '@renderer/store/useAppStore'
import UncommittedPanel from './UncommittedPanel'
import CommitDiffPanel from './CommitDiffPanel'

const RightPanel = () => {
  const selectedItem = useAppStore(state => state.selectedItem)

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
