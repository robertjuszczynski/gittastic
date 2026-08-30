import React, { useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDownIcon, FolderIcon } from '@renderer/shared/ui/icons'
import type { Repository, RepositoryGroup } from '@shared'
import { SortableRepoItem } from './RepoItem'

export type RenamingState = { groupId: string; name: string; originalName: string } | null

type GroupItemProps = {
  group: RepositoryGroup
  repos: Repository[]
  activePath: string | null
  isCollapsed: boolean
  renamingState: RenamingState
  onToggleCollapse: (id: string) => void
  onContextMenu: (e: React.MouseEvent, groupId: string) => void
  onRepoContextMenu: (e: React.MouseEvent, repoPath: string) => void
  onRepoClick: (repo: Repository) => void
  onRemoveRepo: (path: string) => void
  onRenameChange: (name: string) => void
  onRenameCommit: () => void
  onRenameCancel: () => void
}

export const GroupItem = ({
  group,
  repos,
  activePath,
  isCollapsed,
  renamingState,
  onToggleCollapse,
  onContextMenu,
  onRepoContextMenu,
  onRepoClick,
  onRemoveRepo,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
}: GroupItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id })
  const inputRef = useRef<HTMLInputElement>(null)
  const isRenaming = renamingState?.groupId === group.id

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isRenaming])

  const repoItems = group.repositoryPaths
    .map(path => repos.find(r => r.path === path))
    .filter((r): r is Repository => r !== undefined)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className='select-none'
    >
      <div
        className='flex items-center gap-1 cursor-pointer hover:bg-surface-2 group h-[26px] pl-[14px] pr-1'
        onClick={() => onToggleCollapse(group.id)}
        onContextMenu={e => onContextMenu(e, group.id)}
      >
        <motion.span
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.12 }}
          className='text-neutral-500 flex items-center'
        >
          <ChevronDownIcon size={13} />
        </motion.span>
        <span className='text-neutral-400 flex items-center'>
          <FolderIcon open={!isCollapsed} />
        </span>
        {isRenaming ? (
          <input
            ref={inputRef}
            className='text-[12px] font-medium text-neutral-200 bg-transparent border-none outline-none flex-1 min-w-0 ml-0.5'
            value={renamingState.name}
            onChange={e => onRenameChange(e.target.value)}
            onBlur={onRenameCommit}
            onKeyDown={e => {
              if (e.key === 'Enter') onRenameCommit()
              if (e.key === 'Escape') { e.preventDefault(); onRenameCancel() }
            }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className='text-[12px] font-medium text-neutral-200 flex-1 truncate ml-0.5'>
            {group.name}
          </span>
        )}
        <span
          {...listeners}
          {...attributes}
          className='text-neutral-700 hover:text-neutral-500 cursor-grab active:cursor-grabbing text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0'
          onClick={e => e.stopPropagation()}
        >
          ⠿
        </span>
      </div>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='overflow-hidden'
          >
            <div className='ml-[18px] border-l border-l-white/[0.07]'>
              <SortableContext items={repoItems.map(r => r.path)} strategy={verticalListSortingStrategy}>
                {repoItems.map(repo => (
                  <SortableRepoItem
                    key={repo.path}
                    repo={repo}
                    isActive={activePath === repo.path}
                    onContextMenu={onRepoContextMenu}
                    onClick={onRepoClick}
                    onRemove={onRemoveRepo}
                    indent
                  />
                ))}
              </SortableContext>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
