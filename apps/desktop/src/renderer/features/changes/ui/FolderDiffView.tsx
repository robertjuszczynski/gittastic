import React, { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { CHANNELS } from '@shared'
import type { FileChange } from '@shared'
import { useActivePath } from '@renderer/entities/repository'
import { useChangesStore, type FolderScope } from '@renderer/entities/git-file'
import { computeStagedLines } from '../lib/diffUtils'
import FileDiffView from './FileDiffView'

type FolderDiffViewProps = {
  selectedFolder: string
  scope: FolderScope
  staged: FileChange[]
  unstaged: FileChange[]
  isUncommitted: boolean
  hash?: string | null
  onStageLine: (path: string, lineNumber: number, isAddition: boolean, isCurrentlyStaged: boolean) => void
}

const ConflictRow = ({ path, onResolve }: { path: string; onResolve: () => void }) => (
  <button
    onClick={onResolve}
    className='w-full flex items-center gap-2 px-3 py-1.5 text-left border-t border-divider bg-surface sticky top-0 cursor-default hover:bg-surface-2 transition-colors'
  >
    <AlertTriangle size={12} className='text-[#f97316] shrink-0' />
    <span className='flex-1 text-[11px] text-neutral-300 truncate'>{path}</span>
    <span className='text-[11px] font-medium text-accent shrink-0'>Resolve conflict →</span>
  </button>
)

const FolderDiffView = ({ selectedFolder, scope, staged, unstaged, isUncommitted, hash, onStageLine }: FolderDiffViewProps) => {
  const { activePath } = useActivePath()
  const setSelectedFile = useChangesStore(s => s.setSelectedFile)

  const folderFiles = useMemo(() => {
    const source = scope === 'staged' ? staged : scope === 'unstaged' ? unstaged : [...staged, ...unstaged]
    const seen = new Set<string>()
    return source.filter(f => {
      if (!f.path.startsWith(selectedFolder + '/')) return false
      if (seen.has(f.path)) return false
      seen.add(f.path)
      return true
    })
  }, [selectedFolder, scope, staged, unstaged])

  const diffableFiles = useMemo(() => folderFiles.filter(f => f.status !== 'conflicted'), [folderFiles])

  const folderDiffResults = useQueries({
    queries: diffableFiles.map(f => ({
      queryKey: ['git', 'file-diff', activePath, f.path, hash ?? null, staged, unstaged],
      queryFn: () => window.electron[CHANNELS.GET_FILE_DIFF]({ path: f.path, hash: hash ?? undefined }),
      enabled: !!activePath,
    }))
  })

  const folderStagedLinesMap = useMemo(() => {
    const map = new Map<string, { additions: Set<number>; removals: Set<number> }>()
    diffableFiles.forEach((f, i) => {
      const d = folderDiffResults[i]?.data
      if (d?.indexed != null && d.indexed !== '') {
        map.set(f.path, computeStagedLines(d.original, d.indexed, d.modified))
      } else {
        map.set(f.path, { additions: new Set(), removals: new Set() })
      }
    })
    return map
  }, [diffableFiles, folderDiffResults])

  if (folderFiles.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center text-neutral-600 text-[12px]'>
        No changed files in this folder
      </div>
    )
  }

  return (
    <div className='flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden'>
      <div className='flex items-center gap-2 px-3 py-2 shrink-0'>
        <span className='text-[11px] font-bold text-neutral-500 uppercase tracking-wider truncate'>{selectedFolder}/</span>
        {scope && (
          <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
            scope === 'staged' ? 'text-accent bg-accent/10' : 'text-neutral-500 bg-white/[0.04]'
          }`}>
            {scope}
          </span>
        )}
      </div>
      <div className='flex-1 overflow-auto min-h-0 scrollable'>
        {folderFiles.map(file => {
          if (file.status === 'conflicted') {
            return <ConflictRow key={file.path} path={file.path} onResolve={() => setSelectedFile(file.path)} />
          }

          const i = diffableFiles.findIndex(f => f.path === file.path)
          const result = folderDiffResults[i]
          const fileStagedLines = folderStagedLinesMap.get(file.path) ?? { additions: new Set<number>(), removals: new Set<number>() }
          return (
            <div key={file.path}>
              <div className='px-3 py-1.5 text-[11px] text-neutral-400 bg-surface border-t border-divider sticky top-0'>
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
