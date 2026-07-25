import React from 'react';
import WorkspacesItem from './WorkspacesItem';
import { useWorkspaces } from '@renderer/contexts/WorkspacesContext';

const WorkspacesContainer = () => {
  const { openWorkspace, workspaces, activePath } = useWorkspaces();

  return (
    <>
      <div className='w-56 border-r-2 border-d h-screen flex flex-col items-center justify-start py-4 bg-bg'>
        {workspaces.map((workspace, index) => (
          <WorkspacesItem key={index} ws={workspace} isActive={activePath === workspace.path}/>
        ))}
        <button onClick={openWorkspace} className='text-neutral-100'>Select workspace</button>
      </div>
    </>
  );
}

export default WorkspacesContainer;
