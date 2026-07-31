import React from 'react'
import { useActivePath, useRepositories } from '@renderer/contexts/RepositoriesContext'
import { useSelectionStore } from '@renderer/store/useSelectionStore'

const ReposSection = () => {
  const { repositories } = useRepositories()
  const { activePath, setActiveRepository } = useActivePath()
  const setSelectedItem = useSelectionStore(s => s.setSelectedItem)

  return (
    <div>
      {repositories.map((repo, i) => {
        const isActive = activePath === repo.path
        return (
          <div
            key={i}
            className='flex items-center cursor-pointer hover:bg-surface-2 relative h-[26px] pl-[30px]'
            onClick={async () => { await setActiveRepository(repo); setSelectedItem(null) }}
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

export default ReposSection
