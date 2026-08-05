import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Toolbar } from '@renderer/widgets/toolbar'
import { CommitList } from '@renderer/widgets/commit-list'
import { RightPanel } from '@renderer/widgets/right-panel'
import { Sidebar } from '@renderer/widgets/sidebar'
import { Terminal, useTerminalStore } from '@renderer/widgets/terminal'

const HomePage = () => {
  const isTerminalOpen = useTerminalStore((s) => s.isOpen)
  const terminalHeight = useTerminalStore((s) => s.height)

  return (
    <div className='h-screen w-screen flex flex-col bg-bg'>
      <Toolbar />
      <div className='flex flex-1 min-h-0'>
        <Sidebar />
        <div className='flex flex-col flex-1 min-w-0'>
          <div className='flex flex-1 min-h-0'>
            <CommitList />
            <RightPanel />
          </div>
          <AnimatePresence>
            {isTerminalOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                className='shrink-0 overflow-hidden'
                style={{ height: terminalHeight }}
              >
                <Terminal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default HomePage
