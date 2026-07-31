import React from 'react'
import { useStashes } from '@renderer/hooks/useGit'

const StashesSection = () => {
  const { data: stashes = [] } = useStashes()

  if (stashes.length === 0) {
    return <div className='px-3 py-1 text-[11px] text-neutral-600'>No stashes</div>
  }

  return (
    <div>
      {stashes.map(stash => (
        <div
          key={stash.index}
          className='flex items-center gap-2 cursor-pointer hover:bg-surface-2 h-[26px] pl-5'
        >
          <span className='text-neutral-500 text-[11px] shrink-0'>#{stash.index}</span>
          <span className='text-[12px] font-medium text-neutral-200 truncate'>{stash.message}</span>
        </div>
      ))}
    </div>
  )
}

export default StashesSection
