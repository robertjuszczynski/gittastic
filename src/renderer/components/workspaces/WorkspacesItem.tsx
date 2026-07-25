import { useWorkspaces } from '@renderer/contexts/WorkspacesContext';
import { Workspace } from '@shared';
import React from 'react';

const WorkspacesItem = ({ ws, isActive }: { ws: Workspace, isActive: boolean }) => {
  const { setActiveWorkspace } = useWorkspaces();

  return (
    <div className={isActive ? 'bg-accent-2-100' : ''} onClick={() => setActiveWorkspace(ws)}>
      <p className='text-neutral-100'>{ws.name}</p>
    </div>
  );
}

export default WorkspacesItem;
