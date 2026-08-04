import React from 'react'
import { useCommitSelectionStore } from '@renderer/entities/commit/model/useCommitSelectionStore'
import UncommittedPanel from './UncommittedPanel'
import CommitDiffPanel from './CommitDiffPanel'

const RightPanel = () => {
  const selectedCommit = useCommitSelectionStore(s => s.selectedCommit)

  if (!selectedCommit) return null

  return (
    <div className='flex flex-1 min-h-0 flex-col'>
      {selectedCommit === 'uncommitted'
        ? <UncommittedPanel />
        : <CommitDiffPanel hash={selectedCommit} />
      }
    </div>
  )
}

export default RightPanel
