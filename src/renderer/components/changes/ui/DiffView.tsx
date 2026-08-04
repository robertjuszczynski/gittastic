import React, { useCallback, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'
import { diffArrays } from 'diff'

const DiffType = { DEFAULT: 0, ADDED: 1, REMOVED: 2, CHANGED: 3 } as const
import { CHANNELS } from '@shared'
import { useChangesStore } from '@renderer/store/useChangesStore'
import { useActivePath } from '@renderer/contexts/RepositoriesContext'
import { getFileExtensionFromPath } from '@renderer/utils'
import StageCheckbox from './StageCheckbox'

const COMPARE_METHOD_MAP: Record<string, DiffMethod> = {
  '.json': DiffMethod.JSON,
  '.yaml': DiffMethod.YAML,
  '.yml': DiffMethod.YAML,
}

const getCompareMethod = (path: string): DiffMethod => {
  const ext = getFileExtensionFromPath(path)
  if (!ext) return DiffMethod.LINES
  return COMPARE_METHOD_MAP[ext] ?? DiffMethod.LINES
}

function splitLines(s: string): string[] {
  if (!s) return []
  const lines = s.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}

function computeStagedLines(
  head: string,
  indexed: string,
  workingTree: string,
): { additions: Set<number>; removals: Set<number> } {
  const additions = new Set<number>()
  const removals = new Set<number>()
  const headLines = splitLines(head)
  const indexLines = splitLines(indexed)
  const wtLines = splitLines(workingTree)

  // Positional matching: diff(index, wt) — unchanged lines are staged WT positions
  const stagedWtPositions = new Set<number>()
  let wtPos = 0
  for (const part of diffArrays(indexLines, wtLines)) {
    if (part.added) {
      wtPos += part.count!
    } else if (!part.removed) {
      for (let i = 0; i < part.count!; i++) stagedWtPositions.add(++wtPos)
    }
  }

  // diff(head, index) — removed HEAD lines are staged removals
  const stagedHeadRemovals = new Set<number>()
  let headPos = 0
  for (const part of diffArrays(headLines, indexLines)) {
    if (part.removed) {
      for (let i = 0; i < part.count!; i++) stagedHeadRemovals.add(++headPos)
    } else if (!part.added) {
      headPos += part.count!
    }
  }

  // Map HEAD→WT diff to additions/removals
  headPos = 0
  wtPos = 0
  for (const part of diffArrays(headLines, wtLines)) {
    if (part.removed) {
      for (let i = 0; i < part.count!; i++) {
        headPos++
        if (stagedHeadRemovals.has(headPos)) removals.add(headPos)
      }
    } else if (part.added) {
      for (let i = 0; i < part.count!; i++) {
        wtPos++
        if (stagedWtPositions.has(wtPos)) additions.add(wtPos)
      }
    } else {
      headPos += part.count!
      wtPos += part.count!
    }
  }

  return { additions, removals }
}


const DiffView = () => {
  const selectedFile = useChangesStore(s => s.selectedFile)
  const selectedHash = useChangesStore(s => s.selectedHash)
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

  const handleStageLine = useCallback(async (lineNumber: number, isAddition: boolean) => {
    if (!selectedFile) return
    const isCurrentlyStaged = isAddition
      ? stagedLines.additions.has(lineNumber)
      : stagedLines.removals.has(lineNumber)

    if (isCurrentlyStaged) {
      await window.electron[CHANNELS.UNSTAGE_LINE]({ path: selectedFile, lineNumber, isAddition })
    } else {
      await window.electron[CHANNELS.STAGE_LINE]({ path: selectedFile, lineNumber, isAddition })
    }
    queryClient.invalidateQueries({ queryKey: ['git', 'file-diff'] })
    queryClient.invalidateQueries({ queryKey: ['git', 'status'] })
  }, [selectedFile, queryClient, stagedLines])

  const renderGutter = useCallback(({ lineNumber, type, additionalLineNumber }: {
    lineNumber: number
    type: number
    additionalLineNumber?: number
  }) => {
    if (type !== DiffType.ADDED && type !== DiffType.REMOVED) return <></>

    const isAddition = type === DiffType.ADDED
    const targetLine = isAddition ? (additionalLineNumber ?? lineNumber) : lineNumber
    const isStaged = isAddition
      ? stagedLines.additions.has(targetLine)
      : stagedLines.removals.has(targetLine)

    return (
      <StageCheckbox isStaged={isStaged} onClick={() => handleStageLine(targetLine, isAddition)} className='relative top-0.75' />
    )
  }, [handleStageLine, stagedLines])

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
        <ReactDiffViewer
          oldValue={diff?.original ?? ''}
          newValue={diff?.modified ?? ''}
          splitView={false}
          compareMethod={getCompareMethod(selectedFile)}
          styles={diffStyles}
          renderLineGutter={isUncommitted ? renderGutter : undefined}
        />
      </div>
    </div>
  )
}

const diffStyles = {
  variables: {
    light: {
      diffViewerBackground: 'transparent',
      gutterBackground: 'transparent',
      gutterBackgroundDark: 'transparent',
      codeFoldBackground: 'transparent',
      codeFoldGutterBackground: 'transparent',
      emptyLineBackground: 'transparent',
      addedBackground: '#d1fae5',
      addedGutterBackground: '#a7f3d0',
      removedBackground: '#fee2e2',
      removedGutterBackground: '#fecaca',
      wordAddedBackground: '#6ee7b7',
      wordRemovedBackground: '#fca5a5',
    },
  },
  contentText: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    fontSize: '12px',
    lineHeight: '20px',
  },
  gutter: {
    minWidth: '40px',
    padding: '0 8px',
  },
  line: {
    '&:hover': {
      background: 'rgba(0,0,0,0.02)',
    },
  },
  codeFoldContent: {
    'white-space': 'nowrap',
  },
  codeFoldContentContainer: {
    overflow: 'visible',
  },
}

export default DiffView
