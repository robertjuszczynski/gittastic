import React from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSidebarStore, type SectionId } from '@renderer/store/useSidebarStore'
import SidebarSection from './SidebarSection'
import ReposSection from './ReposSection'
import BranchesSection from './BranchesSection'
import StashesSection from './StashesSection'

const SECTION_LABELS: Record<SectionId, string> = {
  repos: 'Repos',
  branches: 'Branches',
  stashes: 'Stashes',
}

const SECTION_CONTENT: Record<SectionId, React.ReactNode> = {
  repos: <ReposSection />,
  branches: <BranchesSection />,
  stashes: <StashesSection />,
}

const DragHandle = ({ listeners, attributes }: { listeners: object | undefined; attributes: object }) => (
  <span
    {...listeners}
    {...attributes}
    className='text-neutral-700 hover:text-neutral-500 cursor-grab active:cursor-grabbing text-[10px] mr-0.5'
    onClick={e => e.stopPropagation()}
  >
    ⠿
  </span>
)

const SortableSection = ({ id, onRemove }: { id: SectionId; onRemove: () => void }) => {
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
        dragHandle={<DragHandle listeners={listeners} attributes={attributes} />}
      >
        {SECTION_CONTENT[id]}
      </SidebarSection>
    </div>
  )
}

const Sidebar = () => {
  const sections = useSidebarStore(s => s.sections)
  const setSections = useSidebarStore(s => s.setSections)
  const removeSection = useSidebarStore(s => s.removeSection)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIdx = sections.indexOf(active.id as SectionId)
      const newIdx = sections.indexOf(over.id as SectionId)
      setSections(arrayMove(sections, oldIdx, newIdx))
    }
  }

  return (
    <aside className='shrink-0 h-screen overflow-y-auto flex flex-col border-neutral-800 bg-surface'>
      <div
        className='w-56 h-full flex flex-col shrink-0 bg-surface overflow-y-auto mt-1 border-r border-r-white/[0.08]'
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map(id => (
              <SortableSection key={id} id={id} onRemove={() => removeSection(id)} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  )
}

export default Sidebar
