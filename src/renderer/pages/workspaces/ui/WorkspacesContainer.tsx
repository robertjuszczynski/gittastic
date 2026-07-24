import React from 'react';
import WorkspacesItem from './WorkspacesItem';
import { useWorkspaces } from '@renderer/contexts/WorkspacesContext';

const WorkspacesContainer = () => {
  const { openWorkspace, workspaces } = useWorkspaces();

  return (
    <>
      <div className='w-44 border-r-2 border-gray-200 h-screen flex flex-col items-center justify-start py-4'>
        {workspaces.map((workspace, index) => (
          <WorkspacesItem key={index} name={workspace.name} />
        ))}
        <button onClick={openWorkspace}>Select workspace</button>
      </div>
    </>
  );
}

export default WorkspacesContainer;
