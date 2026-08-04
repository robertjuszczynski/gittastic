import React from 'react'
import { useActivePath, useRepositories } from '@renderer/entities/repository/model/RepositoriesContext'
import { useSetActiveRepository } from '../api/useSetActiveRepository'
import { useCommitSelectionStore } from '@renderer/entities/commit/model/useCommitSelectionStore'
import { Repository } from '@shared'

const RepositoriesSection = () => {
  const { repositories } = useRepositories()
  const { activePath } = useActivePath()
  const setActiveRepository = useSetActiveRepository()
  const setSelectedCommit = useCommitSelectionStore(s => s.setSelectedCommit)

  const handleRepositoryClick = async (repository: Repository) => {
    await setActiveRepository(repository)
    setSelectedCommit('uncommitted')
  }

  return (
    <div>
      {repositories.map((repo) => {
        const isActive = activePath === repo.path
        return (
          <div
            key={repo.path}
            className='flex items-center cursor-pointer hover:bg-surface-2 relative h-6.5 pl-7.5'
            onClick={() => handleRepositoryClick(repo)}
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
