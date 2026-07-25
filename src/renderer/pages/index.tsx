import React from 'react';
import WorkspacesContainer from '@renderer/components/workspaces/WorkspacesContainer';
import Toolbar from '@renderer/layout/Toolbar';

const Home = () => {
  return (
    <div className='h-screen w-screen flex flex-col'>
      <Toolbar />
      <div className='flex flex-1 min-h-0'>
        <WorkspacesContainer />
      </div>
    </div>
  );
}

export default Home;
