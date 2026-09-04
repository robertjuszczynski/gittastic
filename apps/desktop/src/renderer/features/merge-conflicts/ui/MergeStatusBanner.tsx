import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GitMerge, Check, X } from 'lucide-react'
import { useMergeStatus } from '../api/useMergeStatus'
import { useMergeActions } from '../api/useMergeActions'

const MergeStatusBanner = () => {
  const { data: mergeStatus } = useMergeStatus()
  const { abortMerge } = useMergeActions()

  const remaining = mergeStatus?.conflictedFiles.length ?? 0
  const isReady = mergeStatus?.inProgress && remaining === 0

  return (
    <AnimatePresence initial={false}>
      {mergeStatus?.inProgress && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className='shrink-0 overflow-hidden bg-surface-2 border-b border-divider'
        >
          <div className='flex items-center gap-2.5 px-3 h-9'>
            <GitMerge size={13} strokeWidth={1.8} className='text-neutral-500 shrink-0' />

            {mergeStatus.participants && (
              <span className='text-[12px] text-neutral-400 truncate'>
                Merging <span className='text-neutral-200 font-medium'>{mergeStatus.participants.theirs}</span> into{' '}
                <span className='text-accent font-medium'>{mergeStatus.participants.ours}</span>
              </span>
            )}

            <div className='w-px h-3.5 bg-neutral-700 shrink-0' />

            {isReady ? (
              <span className='flex items-center gap-1 text-[12px] text-accent font-medium'>
                <Check size={13} strokeWidth={2.2} />
                Ready to commit
              </span>
            ) : (
              <span className='flex items-center gap-1.5 text-[12px] text-neutral-400'>
                <span className='min-w-[16px] h-4 px-1 rounded-[3px] bg-[#f97316] text-white text-[10px] font-bold leading-4 text-center tabular-nums'>
                  {remaining}
                </span>
                conflict{remaining === 1 ? '' : 's'} remaining
              </span>
            )}

            <div className='flex-1' />

            <button
              onClick={() => abortMerge()}
              className='flex items-center gap-1 px-2 py-1 -mr-1 rounded text-[11px] text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.06] transition-colors cursor-default'
            >
              <X size={12} strokeWidth={2} />
              Abort Merge
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MergeStatusBanner
