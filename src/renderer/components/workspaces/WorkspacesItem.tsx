import { useActivePath } from '@renderer/contexts/WorkspacesContext'
import { useAppStore } from '@renderer/store/useAppStore';
import { Workspace } from '@shared'
import React from 'react'

const WorkspacesItem = ({ ws, isActive }: { ws: Workspace; isActive: boolean }) => {
  const { setActiveWorkspace } = useActivePath()
  const setSelectedItem = useAppStore(s => s.setSelectedItem)

  const handleWorkspaceClick = async () => {
    await setActiveWorkspace(ws)
    setSelectedItem(null)
  }
 
  return (
    <div
      className={`relative flex items-center px-4 py-2 cursor-default select-none transition-colors ${
        isActive ? 'bg-surface-2' : 'hover:bg-surface-2'
      }`}
      onClick={handleWorkspaceClick}
    >
      {isActive && (
        <div
          className='absolute left-0 top-0 bottom-0 w-0.5 bg-accent'
        />
      )}
      <span className={`text-[13px] truncate ${isActive ? 'text-accent' : 'text-neutral-300'}`}>
        {ws.name}
      </span>
    </div>
  )
}

export default WorkspacesItem
