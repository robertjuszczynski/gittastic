import React from 'react'
import { Toolbar } from '@renderer/widgets/toolbar'
import { CommitList } from '@renderer/widgets/commit-list'
import { RightPanel } from '@renderer/widgets/right-panel'
import { Sidebar } from '@renderer/widgets/sidebar'

const HomePage = () => {
  return (
    <div className='h-screen w-screen flex flex-col bg-bg'>
      <Toolbar />
      <div className='flex flex-1 min-h-0'>
        <Sidebar />
        <CommitList />
        <RightPanel />
      </div>
    </div>
  )
}

export default HomePage
