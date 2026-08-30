import React, { useRef, useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useActivePath, useRepositories } from '@renderer/entities/repository'
import type { Repository, RepositoryGroups } from '@shared'
import { useRepositoryGroups } from '../api/useRepositoryGroups'
import { useSetRepositoryGroups } from '../api/useSetRepositoryGroups'
import { useRepositoryGroupsStore } from '../model/useRepositoryGroupsStore'
import ContextMenu from '@renderer/shared/ui/ContextMenu'
import type { ContextMenuItem } from '@renderer/shared/ui/ContextMenu'
import { GroupItem, type RenamingState } from './GroupItem'
import { SortableRepoItem } from './RepoItem'
import { UNCATEGORIZED_ID, getUncategorizedRepos, reorderGroupRepos, moveRepoBetweenGroups } from '../lib/group-operations'

type ContextMenuState =
  | { type: 'folder'; groupId: string; x: number; y: number }
  | { type: 'repo'; repoPath: string; x: number; y: number }
  | null

type Props = {
  pendingRenameId: string | null
  onRepoClick: (repo: Repository) => void
}

const RepositoryGroupsList = ({ pendingRenameId, onRepoClick }: Props) => {
  const { repositories, removeRepository } = useRepositories()
  const { activePath } = useActivePath()
  const { data: groups = [] } = useRepositoryGroups()
  const { mutate: saveGroups } = useSetRepositoryGroups()
  const toggleCollapsed = useRepositoryGroupsStore(s => s.toggleCollapsed)
  const collapsedIds = useRepositoryGroupsStore(s => s.collapsedIds)

  const [localGroups, setLocalGroups] = useState<RepositoryGroups>(groups)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [renaming, setRenaming] = useState<RenamingState>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => { setLocalGroups(groups) }, [groups])

  const triggeredRenameIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (!pendingRenameId || triggeredRenameIdRef.current === pendingRenameId) return
    const group = localGroups.find(g => g.id === pendingRenameId)
    if (group) {
      triggeredRenameIdRef.current = pendingRenameId
      setRenaming({ groupId: pendingRenameId, name: group.name, originalName: group.name })
    }
  }, [pendingRenameId, localGroups])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const groupIds = localGroups.map(g => g.id)
  const uncategorizedRepos = getUncategorizedRepos(repositories, localGroups)

  const isGroupId = (id: string) => groupIds.includes(id)
  const isRepoPath = (id: string) => repositories.some(r => r.path === id)
  const findRepoGroup = (repoPath: string) => localGroups.find(g => g.repositoryPaths.includes(repoPath))

  const persist = (updated: RepositoryGroups) => {
    setLocalGroups(updated)
    saveGroups(updated)
  }

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    if (!over || active.id === over.id) return

    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)

    if (isGroupId(activeIdStr) && isGroupId(overIdStr)) {
      const oldIdx = localGroups.findIndex(g => g.id === activeIdStr)
      const newIdx = localGroups.findIndex(g => g.id === overIdStr)
      if (oldIdx !== -1 && newIdx !== -1) persist(arrayMove(localGroups, oldIdx, newIdx))
      return
    }

    if (!isRepoPath(activeIdStr)) return

    const sourceGroupId = findRepoGroup(activeIdStr)?.id ?? UNCATEGORIZED_ID

    if (isGroupId(overIdStr)) {
      if (sourceGroupId !== overIdStr) persist(moveRepoBetweenGroups(localGroups, activeIdStr, overIdStr))
      return
    }

    if (isRepoPath(overIdStr)) {
      const targetGroupId = findRepoGroup(overIdStr)?.id ?? UNCATEGORIZED_ID

      if (sourceGroupId !== targetGroupId) {
        persist(moveRepoBetweenGroups(localGroups, activeIdStr, targetGroupId))
        return
      }

      if (sourceGroupId !== UNCATEGORIZED_ID) {
        const group = localGroups.find(g => g.id === sourceGroupId)!
        const oldIdx = group.repositoryPaths.indexOf(activeIdStr)
        const newIdx = group.repositoryPaths.indexOf(overIdStr)
        if (oldIdx !== -1 && newIdx !== -1) persist(reorderGroupRepos(localGroups, sourceGroupId, oldIdx, newIdx))
      }
    }
  }

  const handleRenameCommit = () => {
    if (!renaming) return
    const trimmed = renaming.name.trim() || 'New folder'
    persist(localGroups.map(g => g.id === renaming.groupId ? { ...g, name: trimmed } : g))
    setRenaming(null)
  }

  const buildContextMenuItems = (): ContextMenuItem[] => {
    if (!contextMenu) return []

    if (contextMenu.type === 'folder') {
      const { groupId } = contextMenu
      const group = localGroups.find(g => g.id === groupId)
      return [
        {
          type: 'action',
          label: 'Rename',
          onClick: () => {
            if (group) setRenaming({ groupId, name: group.name, originalName: group.name })
            setContextMenu(null)
          },
        },
        {
          type: 'action',
          label: 'Delete',
          className: 'text-red-400',
          onClick: () => {
            persist(localGroups.filter(g => g.id !== groupId))
            setContextMenu(null)
          },
        },
      ]
    }

    const { repoPath } = contextMenu
    return [
      { type: 'divider', label: 'Move to folder' },
      ...localGroups.map<ContextMenuItem>(g => ({
        type: 'action',
        label: g.name,
        className: 'pl-5',
        onClick: () => { persist(moveRepoBetweenGroups(localGroups, repoPath, g.id)); setContextMenu(null) },
      })),
      {
        type: 'action',
        label: 'No folder',
        className: 'pl-5 text-neutral-400',
        onClick: () => { persist(moveRepoBetweenGroups(localGroups, repoPath, UNCATEGORIZED_ID)); setContextMenu(null) },
      },
    ]
  }

  const activeRepo = activeId && isRepoPath(activeId) ? repositories.find(r => r.path === activeId) : null

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={groupIds} strategy={verticalListSortingStrategy}>
          {localGroups.map(group => (
            <GroupItem
              key={group.id}
              group={group}
              repos={repositories}
              activePath={activePath}
              isCollapsed={collapsedIds.includes(group.id)}
              renamingState={renaming}
              onToggleCollapse={toggleCollapsed}
              onContextMenu={(e, id) => { e.preventDefault(); setContextMenu({ type: 'folder', groupId: id, x: e.clientX, y: e.clientY }) }}
              onRepoContextMenu={(e, path) => { e.preventDefault(); setContextMenu({ type: 'repo', repoPath: path, x: e.clientX, y: e.clientY }) }}
              onRepoClick={onRepoClick}
              onRemoveRepo={removeRepository}
              onRenameChange={name => setRenaming(r => r ? { ...r, name } : r)}
              onRenameCommit={handleRenameCommit}
              onRenameCancel={() => setRenaming(null)}
            />
          ))}
        </SortableContext>

        <SortableContext items={uncategorizedRepos.map(r => r.path)} strategy={verticalListSortingStrategy}>
          {uncategorizedRepos.map(repo => (
            <SortableRepoItem
              key={repo.path}
              repo={repo}
              isActive={activePath === repo.path}
              onContextMenu={(e, path) => { e.preventDefault(); setContextMenu({ type: 'repo', repoPath: path, x: e.clientX, y: e.clientY }) }}
              onClick={onRepoClick}
              onRemove={removeRepository}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeRepo && (
            <div className='flex items-center h-[26px] pl-[15px] pr-1 bg-surface-2 opacity-90 text-[12px] font-medium text-neutral-200 shadow-lg rounded'>
              {activeRepo.name}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={buildContextMenuItems()}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  )
}

export default RepositoryGroupsList
