import React from 'react'
import WorkspacesItem from './WorkspacesItem'
import { useWorkspaces } from '@renderer/contexts/WorkspacesContext'

const WorkspacesContainer = () => {
  const { openWorkspace, workspaces, activePath } = useWorkspaces()

  return (
    <div
      className='w-52 h-full flex flex-col shrink-0 bg-surface'
      style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className='flex-1 flex flex-col overflow-y-auto pt-2'>
        {workspaces.map((workspace, index) => (
          <WorkspacesItem key={index} ws={workspace} isActive={activePath === workspace.path} />
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={openWorkspace}
          className='w-full text-left text-[12px] text-neutral-500 hover:text-neutral-200 hover:bg-surface-2 px-4 py-3 cursor-default select-none transition-colors'
        >
          + Add workspace
        </button>
      </div>
    </div>
  )
}

export default WorkspacesContainer
