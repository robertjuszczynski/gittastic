import { useSetActiveRepository } from '@renderer/hooks/useGit'
import { useSelectionStore } from '@renderer/store/useSelectionStore'
import { Repository } from '@shared'
import React from 'react'

const RepositoryItem = ({ repo, isActive }: { repo: Repository; isActive: boolean }) => {
  const setActiveRepository = useSetActiveRepository()
  const setSelectedItem = useSelectionStore(s => s.setSelectedItem)

  const handleClick = async () => {
    await setActiveRepository(repo)
    setSelectedItem(null)
  }

  return (
    <div
      className={`relative flex items-center px-4 py-2 cursor-default select-none transition-colors ${
        isActive ? 'bg-surface-2' : 'hover:bg-surface-2'
      }`}
      onClick={handleClick}
    >
      {isActive && (
        <div
          className='absolute left-0 top-0 bottom-0 w-0.5 bg-accent'
        />
      )}
      <span className={`text-[13px] truncate ${isActive ? 'text-accent' : 'text-neutral-300'}`}>
        {repo.name}
      </span>
    </div>
  )
}

export default RepositoryItem
