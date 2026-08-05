import React, { useCallback } from 'react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import type { FileDiff } from '@shared'
import { DiffType, getCompareMethod, diffStyles } from './lib/diffUtils'
import StageCheckbox from './StageCheckbox'

type FileDiffViewProps = {
  filePath: string
  diff: FileDiff
  isUncommitted: boolean
  onStageLine: (path: string, lineNumber: number, isAddition: boolean, isCurrentlyStaged: boolean) => void
  stagedLines: { additions: Set<number>; removals: Set<number> }
}

const FileDiffView = ({ filePath, diff, isUncommitted, onStageLine, stagedLines }: FileDiffViewProps) => {
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
      <StageCheckbox isStaged={isStaged} onClick={() => onStageLine(filePath, targetLine, isAddition, isStaged)} className='relative top-0.75' />
    )
  }, [filePath, onStageLine, stagedLines])

  return (
    <ReactDiffViewer
      oldValue={diff.original ?? ''}
      newValue={diff.modified ?? ''}
      splitView={false}
      compareMethod={getCompareMethod(filePath)}
      styles={diffStyles}
      renderLineGutter={isUncommitted ? renderGutter : undefined}
    />
  )
}

export default FileDiffView
