import React, { useContext } from 'react';
import WorkspacesItem from './WorkspacesItem';
import ModalContext from '@renderer/contexts/ModalContext';
import WorkspacesModal from './WorkspacesModal';

const mockItems = [
  {
    name: 'Workspace 1',
  },
  {
    name: 'Workspace 2',
  }
]

async function handleSelectWorkspace() {
  const filePath = await window.electron['OPEN_WORKSPACE']();
  console.log('Selected workspace:', filePath);
}

const WorkspacesContainer = () => {
  return (
    <>
      <div className='w-44 border-r-2 border-gray-200 h-screen flex flex-col items-center justify-start py-4'>
        {mockItems.map((item, index) => (
          <WorkspacesItem key={index} name={item.name} />
        ))}
      <button onClick={handleSelectWorkspace}>Select workspace</button>
      </div>
    </>
  );
}

export default WorkspacesContainer;
