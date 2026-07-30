import { useWorkspaces } from '@renderer/contexts/WorkspacesContext'
import { Workspace } from '@shared'
import React from 'react'

const WorkspacesItem = ({ ws, isActive }: { ws: Workspace; isActive: boolean }) => {
  const { setActiveWorkspace } = useWorkspaces()

  return (
    <div
      className={`relative flex items-center px-4 py-2 cursor-default select-none transition-colors ${
        isActive ? 'bg-surface-2' : 'hover:bg-surface-2'
      }`}
      onClick={() => setActiveWorkspace(ws)}
    >
      {isActive && (
        <div
          className='absolute left-0 top-0 bottom-0 bg-accent'
          style={{ width: 2 }}
        />
      )}
      <span className={`text-[13px] truncate ${isActive ? 'text-accent' : 'text-neutral-300'}`}>
        {ws.name}
      </span>
    </div>
  )
}

export default WorkspacesItem
