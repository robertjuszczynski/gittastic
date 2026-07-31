import React from 'react';
import Toolbar from '@renderer/layout/Toolbar';
import CommitList from '@renderer/components/git/CommitList';
import RightPanel from '@renderer/components/panels/RightPanel';
import Sidebar from '@renderer/components/sidebar/Sidebar';

const Home = () => {
  return (
    <div className='h-screen w-screen flex flex-col bg-bg'>
      <Toolbar />
      <div className='flex flex-1 min-h-0'>
        <Sidebar />
        <CommitList />
        <RightPanel />
      </div>
    </div>
  );
}

export default Home;
