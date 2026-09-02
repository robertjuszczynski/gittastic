import React, { useContext, useState } from 'react'
import { ResizableBox } from 'react-resizable'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSidebarStore, type SectionId } from '../model/useSidebarStore'
import SidebarSection from './SidebarSection'
import { BranchesSection, CreateBranchModal } from '@renderer/features/branches'
import { StashesSection } from '@renderer/features/stashes'
import { RepositoryGroupsList, useRepositoryGroups, useSetRepositoryGroups } from '@renderer/features/repository-groups'
import { useRepositories } from '@renderer/entities/repository'
import { useSetActiveRepository } from '@renderer/features/repositories'
import { useCommitSelectionStore } from '@renderer/entities/commit'
import ModalContext from '@renderer/shared/ui/ModalContext'
import type { Repository, RepositoryGroup } from '@shared'

const SECTION_LABELS: Record<SectionId, string> = {
  repos: 'Repos',
  branches: 'Branches',
  stashes: 'Stashes',
}

const DragHandle = ({ listeners, attributes }: { listeners: DraggableSyntheticListeners; attributes: DraggableAttributes }) => (
  <span
    {...listeners}
    {...attributes}
    className='text-neutral-700 hover:text-neutral-500 cursor-grab active:cursor-grabbing text-[10px] mr-0.5'
    onClick={e => e.stopPropagation()}
  >
    ⠿
  </span>
)

type SortableSectionProps = {
  id: SectionId
  onRemove: () => void
  onAdd?: () => void
  onAddFolder?: () => void
  children: React.ReactNode
}

const SortableSection = ({ id, onRemove, onAdd, onAddFolder, children }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <SidebarSection
        id={id}
        title={SECTION_LABELS[id]}
        defaultOpen={id !== 'stashes'}
        onRemove={onRemove}
        onAdd={onAdd}
        onAddFolder={onAddFolder}
        dragHandle={<DragHandle listeners={listeners} attributes={attributes} />}
      >
        {children}
      </SidebarSection>
    </div>
  )
}

const Sidebar = () => {
  const sections = useSidebarStore(s => s.sections)
  const setSections = useSidebarStore(s => s.setSections)
  const removeSection = useSidebarStore(s => s.removeSection)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const { openRepository } = useRepositories()
  const { toggleModal } = useContext(ModalContext)
  const setActiveRepository = useSetActiveRepository()
  const setSelectedCommit = useCommitSelectionStore(s => s.setSelectedCommit)
  const { data: groups = [] } = useRepositoryGroups()
  const { mutate: saveGroups } = useSetRepositoryGroups()
  const [pendingRenameId, setPendingRenameId] = useState<string | null>(null)

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIdx = sections.indexOf(active.id as SectionId)
      const newIdx = sections.indexOf(over.id as SectionId)
      setSections(arrayMove(sections, oldIdx, newIdx))
    }
  }

  const handleRepoClick = async (repo: Repository) => {
    await setActiveRepository(repo)
    setSelectedCommit('uncommitted')
  }

  const handleAddFolder = () => {
    const id = crypto.randomUUID()
    const newGroup: RepositoryGroup = { id, name: 'New folder', repositoryPaths: [] }
    saveGroups([...groups, newGroup])
    setPendingRenameId(id)
  }

  return (
    <ResizableBox
      width={224}
      height={window.innerHeight - 52}
      minConstraints={[160, window.innerHeight - 52]}
      resizeHandles={['e']}
      handleSize={[4, 4]}
      className='shrink-0 flex flex-col bg-surface overflow-y-auto border-r border-r-white/[0.08]'
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map(id => {
            if (id === 'repos') {
              return (
                <SortableSection
                  key={id}
                  id={id}
                  onRemove={() => removeSection(id)}
                  onAdd={openRepository}
                  onAddFolder={handleAddFolder}
                >
                  <RepositoryGroupsList
                    pendingRenameId={pendingRenameId}
                    onRepoClick={handleRepoClick}
                  />
                </SortableSection>
              )
            }
            if (id === 'branches') {
              return (
                <SortableSection
                  key={id}
                  id={id}
                  onRemove={() => removeSection(id)}
                  onAdd={() => toggleModal(<CreateBranchModal />)}
                >
                  <BranchesSection />
                </SortableSection>
              )
            }
            return (
              <SortableSection key={id} id={id} onRemove={() => removeSection(id)}>
                <StashesSection />
              </SortableSection>
            )
          })}
        </SortableContext>
      </DndContext>
    </ResizableBox>
  )
}

export default Sidebar
