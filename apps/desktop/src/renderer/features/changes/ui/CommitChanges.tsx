import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository'
import FileTree from './FileTree'

const CommitChanges = ({ hash }: { hash: string }) => {
  const { activePath } = useActivePath()
  const { data: files = [] } = useQuery({
    queryKey: ['git', 'commit-files', activePath, hash],
    queryFn: () => window.electron[CHANNELS.GET_COMMIT_FILES](hash),
    enabled: !!activePath && !!hash,
  })

  return (
    <div className='flex-1 min-h-0 overflow-y-auto scrollable'>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>
        Changes — {hash.slice(0, 7)}
      </div>
      <FileTree files={files} hash={hash} />
    </div>
  )
}

export default CommitChanges
