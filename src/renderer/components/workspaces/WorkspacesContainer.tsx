import React from 'react'
import WorkspacesItem from './WorkspacesItem'
import { useActivePath, useWorkspaces } from '@renderer/contexts/WorkspacesContext'

const WorkspacesContainer = () => {
  const { openWorkspace, workspaces } = useWorkspaces()
  const { activePath } = useActivePath()

  return (
    <div
      className='w-52 h-full flex flex-col shrink-0 bg-surface border-r border-r-black/[0.07]'
    >
      <div className='flex-1 flex flex-col overflow-y-auto pt-2'>
        {workspaces.map((workspace, index) => (
          <WorkspacesItem key={index} ws={workspace} isActive={activePath === workspace.path} />
        ))}
      </div>

      <div className='border-t border-t-black/[0.07]'>
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
