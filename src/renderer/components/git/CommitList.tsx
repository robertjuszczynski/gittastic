import React, { useEffect, useState } from 'react';
import { CHANNELS } from '@shared';
import { useWorkspaces } from '@renderer/contexts/WorkspacesContext';
import type { DefaultLogFields, LogResult } from 'simple-git';

const CommitList = () => {
  const { activePath } = useWorkspaces();
  const [log, setLog] = useState<LogResult<DefaultLogFields> | null>(null);

  useEffect(() => {
    if (!activePath) return;
    window.electron[CHANNELS.GET_COMMITS]().then(setLog);
  }, [activePath]);

  return (
    <>
      {log?.all.map((commit) => (
        <div key={commit.hash} className='flex items-center gap-4 px-4 py-2 border-b border-neutral-800 hover:bg-neutral-900 cursor-pointer'>
          <span className='text-[11px] font-mono text-neutral-500 shrink-0'>{commit.hash.slice(0, 7)}</span>
          <span className='text-[13px] text-neutral-100 flex-1 truncate'>{commit.message}</span>
          <span className='text-[11px] text-neutral-500 shrink-0'>{commit.author_name}</span>
          <span className='text-[11px] text-neutral-600 shrink-0'>{new Date(commit.date).toLocaleDateString()}</span>
        </div>
      ))}
    </>
  );
};

export default CommitList;
