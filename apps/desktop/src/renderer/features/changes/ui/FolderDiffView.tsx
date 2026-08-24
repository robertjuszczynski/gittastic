import React, { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import type { FileChange } from '@shared'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'
import { computeStagedLines } from '../lib/diffUtils'
import FileDiffView from './FileDiffView'

type FolderDiffViewProps = {
  selectedFolder: string
  staged: FileChange[]
  unstaged: FileChange[]
  isUncommitted: boolean
  hash?: string | null
  onStageLine: (path: string, lineNumber: number, isAddition: boolean, isCurrentlyStaged: boolean) => void
}

const FolderDiffView = ({ selectedFolder, staged, unstaged, isUncommitted, hash, onStageLine }: FolderDiffViewProps) => {
  const { activePath } = useActivePath()

  const folderFiles = useMemo(() => {
    const seen = new Set<string>()
    return [...staged, ...unstaged].filter(f => {
      if (!f.path.startsWith(selectedFolder + '/')) return false
      if (seen.has(f.path)) return false
      seen.add(f.path)
      return true
    })
  }, [selectedFolder, staged, unstaged])

  const folderDiffResults = useQueries({
    queries: folderFiles.map(f => ({
      queryKey: ['git', 'file-diff', activePath, f.path, hash ?? null, staged, unstaged],
      queryFn: () => window.electron[CHANNELS.GET_FILE_DIFF]({ path: f.path, hash: hash ?? undefined }),
      enabled: !!activePath,
    }))
  })

  const folderStagedLinesMap = useMemo(() => {
    const map = new Map<string, { additions: Set<number>; removals: Set<number> }>()
    folderFiles.forEach((f, i) => {
      const d = folderDiffResults[i]?.data
      if (d?.indexed != null && d.indexed !== '') {
        map.set(f.path, computeStagedLines(d.original, d.indexed, d.modified))
      } else {
        map.set(f.path, { additions: new Set(), removals: new Set() })
      }
    })
    return map
  }, [folderFiles, folderDiffResults])

  if (folderFiles.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center text-neutral-600 text-[12px]'>
        No changed files in this folder
      </div>
    )
  }

  return (
    <div className='flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden'>
      <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0'>
        {selectedFolder}/
      </div>
      <div className='flex-1 overflow-auto min-h-0'>
        {folderFiles.map((file, i) => {
          const result = folderDiffResults[i]
          const fileStagedLines = folderStagedLinesMap.get(file.path) ?? { additions: new Set<number>(), removals: new Set<number>() }
          return (
            <div key={file.path}>
              <div className='px-3 py-1.5 text-[11px] text-neutral-400 bg-surface border-t border-black/[0.07] sticky top-0'>
                {file.path}
              </div>
              {result?.isLoading ? (
                <div className='px-3 py-2 text-[11px] text-neutral-600'>Loading...</div>
              ) : result?.data ? (
                <FileDiffView
                  filePath={file.path}
                  diff={result.data}
                  isUncommitted={isUncommitted}
                  onStageLine={onStageLine}
                  stagedLines={fileStagedLines}
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FolderDiffView
