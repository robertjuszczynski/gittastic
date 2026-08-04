import React, { useState } from 'react'
import { useGitUser, useCommit } from '@renderer/entities/commit/api/useCommitActions'
import { useChangesStore } from '@renderer/entities/git-file/model/useChangesStore'

const CommitSection = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { data: user } = useGitUser()
  const commit = useCommit()
  const staged = useChangesStore(s => s.staged)
  const stageAll = useChangesStore(s => s.stageAll)
  const unstageAll = useChangesStore(s => s.unstageAll)

  const initials = user?.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? ''

  const handleCommit = async () => {
    if (!title.trim() || staged.length === 0) return
    await commit(title.trim(), description.trim() || undefined)
    setTitle('')
    setDescription('')
  }

  return (
    <div className='shrink-0 flex flex-col gap-2 p-3'>
      <input
        className='w-full bg-transparent border border-black/[0.07] rounded px-2 py-1 text-[12px] text-neutral-200 placeholder-neutral-600 outline-none focus:border-accent/50 select-text'
        style={{ WebkitUserSelect: 'text' }}
        placeholder='Commit title'
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className='w-full bg-transparent border border-black/[0.07] rounded px-2 py-1 text-[12px] text-neutral-200 placeholder-neutral-600 outline-none focus:border-accent/50 resize-none select-text'
        style={{ WebkitUserSelect: 'text' }}
        placeholder='Description (optional)'
        rows={3}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className='flex items-center gap-2'>
        {user && (
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className='w-7 h-7 rounded-[4px] bg-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-300 shrink-0'>
              {initials}
            </div>
            <div className='min-w-0'>
              <div className='text-[11px] text-neutral-300 truncate'>{user.name}</div>
              <div className='text-[10px] text-neutral-500 truncate'>{user.email}</div>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <button
          className='text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-1 border border-white/[0.08] rounded transition-colors'
          onClick={() => unstageAll()}
        >
          Unstage All
        </button>
        <button
          className='text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-1 border border-white/[0.08] rounded transition-colors'
          onClick={() => stageAll()}
        >
          Stage All
        </button>
        <div className='flex-1' />
        <button
          className='text-[11px] font-medium px-3 py-1 rounded transition-colors disabled:opacity-30 bg-accent text-white hover:bg-accent/80 disabled:hover:bg-accent'
          disabled={!title.trim() || staged.length === 0}
          onClick={handleCommit}
        >
          Commit
        </button>
      </div>
    </div>
  )
}

export default CommitSection
