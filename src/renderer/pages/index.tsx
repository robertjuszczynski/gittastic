import React from 'react';
import WorkspacesContainer from '@renderer/pages/workspaces/ui/WorkspacesContainer';

const handleClick = () => {
  window.electronAPI.test();
}

const Home = () => {
  return (
    <div className='h-screen w-screen'>
      <WorkspacesContainer />
    </div>
  );
}

export default Home;
