import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useChangesStore } from '@renderer/entities/git-file/model/useChangesStore'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'
import { computeStagedLines } from './lib/diffUtils'
import FileDiffView from './FileDiffView'
import FolderDiffView from './FolderDiffView'

const DiffView = () => {
  const [forceShow, setForceShow] = useState(false)
  const selectedFile = useChangesStore(s => s.selectedFile)
  const selectedHash = useChangesStore(s => s.selectedHash)
  const selectedFolder = useChangesStore(s => s.selectedFolder)
  const selectedFolderHash = useChangesStore(s => s.selectedFolderHash)
  const staged = useChangesStore(s => s.staged)
  const unstaged = useChangesStore(s => s.unstaged)
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()
  const isUncommitted = !selectedHash

  const { data: diff, isLoading } = useQuery({
    queryKey: ['git', 'file-diff', activePath, selectedFile, selectedHash, staged, unstaged],
    queryFn: () => window.electron[CHANNELS.GET_FILE_DIFF]({ path: selectedFile!, hash: selectedHash ?? undefined }),
    enabled: !!activePath && !!selectedFile,
  })

  const prevStagedLines = useRef({ additions: new Set<number>(), removals: new Set<number>() })
  const stagedLines = useMemo(() => {
    if (diff?.indexed == null) return prevStagedLines.current
    if (diff.indexed === '') {
      prevStagedLines.current = { additions: new Set<number>(), removals: new Set<number>() }
      return prevStagedLines.current
    }
    const result = computeStagedLines(diff.original, diff.indexed, diff.modified)
    prevStagedLines.current = result
    return result
  }, [diff])

  const isTooLarge = !!diff && (diff.original.length > 100000 || (diff.modified?.length ?? 0) > 100000)

  useEffect(() => { setForceShow(false) }, [selectedFile])

  const handleStageLine = useCallback(async (path: string, lineNumber: number, isAddition: boolean, isCurrentlyStaged: boolean) => {
    if (isCurrentlyStaged) {
      await window.electron[CHANNELS.UNSTAGE_LINE]({ path, lineNumber, isAddition })
    } else {
      await window.electron[CHANNELS.STAGE_LINE]({ path, lineNumber, isAddition })
    }
    queryClient.invalidateQueries({ queryKey: ['git', 'file-diff'] })
    queryClient.invalidateQueries({ queryKey: ['git', 'status'] })
  }, [queryClient])

  const { data: commitFolderFiles = [] } = useQuery({
    queryKey: ['git', 'commit-files', activePath, selectedFolderHash],
    queryFn: () => window.electron[CHANNELS.GET_COMMIT_FILES](selectedFolderHash!),
    enabled: !!activePath && !!selectedFolderHash,
  })

  if (selectedFolder && !selectedFile) {
    return (
      <FolderDiffView
        selectedFolder={selectedFolder}
        staged={selectedFolderHash ? commitFolderFiles : staged}
        unstaged={selectedFolderHash ? [] : unstaged}
        isUncommitted={!selectedFolderHash}
        hash={selectedFolderHash}
        onStageLine={handleStageLine}
      />
    )
  }

  if (!selectedFile) {
    return (
      <div className='flex-1 flex items-center justify-center text-neutral-600 text-[12px]'>
        Select a file to view diff
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center text-neutral-600 text-[12px]'>
        Loading diff...
      </div>
    )
  }

  return (
    <div className='flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden'>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0'>
        {selectedFile}
      </div>
      <div className='flex-1 overflow-auto' style={{ minHeight: 0 }}>
        {isTooLarge && !forceShow ? (
          <div className='h-full flex flex-col items-center justify-center gap-4'>
            <div className='flex flex-col items-center gap-1'>
              <span className='text-[13px] text-neutral-400'>File too large to diff</span>
            </div>
            <button
              onClick={() => setForceShow(true)}
              className='px-4 py-1.5 rounded-[4px] text-[11px] border border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors'
            >
              Show anyway
            </button>
          </div>
        ) : diff && (
          <FileDiffView
            filePath={selectedFile}
            diff={diff}
            isUncommitted={isUncommitted}
            onStageLine={handleStageLine}
            stagedLines={stagedLines}
          />
        )}
      </div>
    </div>
  )
}

export default DiffView
