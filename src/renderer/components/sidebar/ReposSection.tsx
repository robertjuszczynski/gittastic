import React from 'react'
import { useActivePath, useWorkspaces } from '@renderer/contexts/WorkspacesContext'
import { useSelectionStore } from '@renderer/store/useSelectionStore'

const ReposSection = () => {
  const { workspaces } = useWorkspaces()
  const { activePath, setActiveWorkspace } = useActivePath()
  const setSelectedItem = useSelectionStore(s => s.setSelectedItem)

  return (
    <div>
      {workspaces.map((ws, i) => {
        const isActive = activePath === ws.path
        return (
          <div
            key={i}
            className='flex items-center cursor-pointer hover:bg-surface-2 relative h-[26px] pl-[30px]'
            onClick={async () => { await setActiveWorkspace(ws); setSelectedItem(null) }}
          >
            {isActive && (
              <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-accent' />
            )}
            <span
              className={`text-[12px] font-medium truncate ${isActive ? 'text-accent' : 'text-neutral-200'}`}
            >
              {ws.name}
            </span>
          </div>
        )
      })}
      {/* <div
        className='flex items-center px-3 cursor-pointer hover:bg-surface-2 text-neutral-600 hover:text-neutral-400'
        style={{ height: 26 }}
        onClick={openWorkspace}
      >
        <span className='text-[12px]'>+ Add workspace</span>
      </div> */}
    </div>
  )
}

export default ReposSection
