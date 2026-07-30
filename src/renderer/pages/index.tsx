import React from 'react';
import WorkspacesContainer from '@renderer/components/workspaces/WorkspacesContainer';
import Toolbar from '@renderer/layout/Toolbar';
import History from '@renderer/layout/History';
import CommitList from '@renderer/components/git/CommitList';

const Home = () => {
  return (
    <div className='h-screen w-screen flex flex-col bg-bg'>
      <Toolbar />
      <div className='flex flex-1 min-h-0'>
        <WorkspacesContainer />
        <History>
          <CommitList />
        </History>
      </div>
    </div>
  );
}

export default Home;
