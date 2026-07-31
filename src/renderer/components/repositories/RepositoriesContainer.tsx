import React from 'react'
import RepositoryItem from './RepositoryItem'
import { useActivePath, useRepositories } from '@renderer/contexts/RepositoriesContext'

const RepositoriesContainer = () => {
  const { openRepository, repositories } = useRepositories()
  const { activePath } = useActivePath()

  return (
    <div
      className='w-52 h-full flex flex-col shrink-0 bg-surface border-r border-r-black/[0.07]'
    >
      <div className='flex-1 flex flex-col overflow-y-auto pt-2'>
        {repositories.map((repo, index) => (
          <RepositoryItem key={index} repo={repo} isActive={activePath === repo.path} />
        ))}
      </div>

      <div className='border-t border-t-black/[0.07]'>
        <button
          onClick={openRepository}
          className='w-full text-left text-[12px] text-neutral-500 hover:text-neutral-200 hover:bg-surface-2 px-4 py-3 cursor-default select-none transition-colors'
        >
          + Add repository
        </button>
      </div>
    </div>
  )
}

export default RepositoriesContainer
