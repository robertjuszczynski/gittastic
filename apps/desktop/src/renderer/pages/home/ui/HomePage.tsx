import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Toolbar } from '@renderer/widgets/toolbar'
import { CommitList } from '@renderer/widgets/commit-list'
import { RightPanel } from '@renderer/widgets/right-panel'
import { Sidebar } from '@renderer/widgets/sidebar'
import { Terminal, useTerminalStore } from '@renderer/widgets/terminal'
import { useRepositories } from '@renderer/entities/repository'
import { useLoadingStore } from '@renderer/shared/lib'
import { MergeStatusBanner } from '@renderer/features/merge-conflicts'

const EmptyState = ({ onOpen }: { onOpen: () => void }) => {
  const operations = useLoadingStore(s => s.operations)
  const isLoading = operations.size > 0
  const activeOp = isLoading ? Array.from(operations.values())[operations.size - 1] : null

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center bg-bg gap-3'>
      <span className='text-neutral-500 text-[13px]'>No repositories open</span>
      <button
        onClick={isLoading ? undefined : onOpen}
        disabled={isLoading}
        className='px-4 py-1.5 text-[12px] text-neutral-300 border border-white/10 rounded-lg hover:bg-surface-2 transition-colors disabled:opacity-50 disabled:pointer-events-none'
      >
        {activeOp ? activeOp.label : 'Open repository'}
      </button>
    </div>
  )
}

const HomePage = () => {
  const isTerminalOpen = useTerminalStore((s) => s.isOpen)
  const terminalHeight = useTerminalStore((s) => s.height)
  const { repositories, isLoaded, openRepository } = useRepositories()

  if (isLoaded && repositories.length === 0) {
    return <EmptyState onOpen={openRepository} />
  }

  return (
    <div className='h-screen w-screen flex flex-col bg-bg overflow-hidden'>
      <Toolbar />
      <div className='flex flex-1 min-h-0'>
        <Sidebar />
        <div className='flex flex-col flex-1 min-w-0'>
          <MergeStatusBanner />
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
