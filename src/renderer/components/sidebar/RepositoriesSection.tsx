import React from 'react'
import { useActivePath, useRepositories } from '@renderer/contexts/RepositoriesContext'
import { useSetActiveRepository } from '@renderer/hooks/useGit'
import { useCommitSelectionStore } from '@renderer/store/useCommitSelectionStore'

const RepositoriesSection = () => {
  const { repositories } = useRepositories()
  const { activePath } = useActivePath()
  const setActiveRepository = useSetActiveRepository()
  const setSelectedCommit = useCommitSelectionStore(s => s.setSelectedCommit)

  return (
    <div>
      {repositories.map((repo, i) => {
        const isActive = activePath === repo.path
        return (
          <div
            key={i}
            className='flex items-center cursor-pointer hover:bg-surface-2 relative h-6.5 pl-7.5'
            onClick={async () => { await setActiveRepository(repo); setSelectedCommit('uncommitted') }}
          >
            {isActive && (
              <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-accent' />
            )}
            <span
              className={`text-[12px] font-medium truncate ${isActive ? 'text-accent' : 'text-neutral-200'}`}
            >
              {repo.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default RepositoriesSection
