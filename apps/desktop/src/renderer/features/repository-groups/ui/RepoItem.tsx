import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Repository } from '@shared'

type RepoItemProps = {
  repo: Repository
  isActive: boolean
  indent?: boolean
  onContextMenu: (e: React.MouseEvent, repoPath: string) => void
  onClick: (repo: Repository) => void
  onRemove?: (path: string) => void
}

export const RepoItemRow = ({ repo, isActive, onContextMenu, onClick, onRemove, indent = false }: RepoItemProps) => (
  <div
    className={`flex items-center cursor-pointer hover:bg-surface-2 relative h-[26px] ${indent ? 'pl-8' : 'pl-8'} pr-1 group/repo`}
    onClick={() => onClick(repo)}
    onContextMenu={e => onContextMenu(e, repo.path)}
  >
    {isActive && <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-accent' />}
    <span className={`text-[12px] font-medium truncate flex-1 ${isActive ? 'text-accent' : 'text-neutral-200'}`}>
      {repo.name}
    </span>
    {onRemove && (
      <span
        className='text-neutral-600 hover:text-neutral-300 text-[13px] opacity-50 group-hover/repo:opacity-100 transition-opacity px-1 shrink-0'
        onClick={e => { e.stopPropagation(); onRemove(repo.path) }}
      >
        ×
      </span>
    )}
  </div>
)

type SortableRepoItemProps = RepoItemProps & { onRemove: (path: string) => void }

export const SortableRepoItem = ({ repo, isActive, onContextMenu, onClick, onRemove, indent = false }: SortableRepoItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: repo.path })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
    >
      <RepoItemRow
        repo={repo}
        isActive={isActive}
        onContextMenu={onContextMenu}
        onClick={onClick}
        onRemove={onRemove}
        indent={indent}
      />
    </div>
  )
}
