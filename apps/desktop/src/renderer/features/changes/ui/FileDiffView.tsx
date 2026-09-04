import React, { useCallback } from 'react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import type { FileDiff } from '@shared'
import { IMAGE_EXTENSIONS_MAP, isImageFile } from '../lib/diffUtils'
import { DiffType, getCompareMethod, diffStyles, highlightCode } from '@renderer/shared/lib'
import { StageCheckbox } from '@renderer/shared/ui'
import ImageDiffView from './ImageDiffView'

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

  const highlightSyntax = (str: string) => (
    <pre className='inline' dangerouslySetInnerHTML={{ __html: highlightCode(str) }} />
  )

  const fileName = filePath.split('/').pop() || ''
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  const mime = IMAGE_EXTENSIONS_MAP.get(ext) ?? ''

  return (
    isImageFile(fileName) ? (
      <ImageDiffView
        oldValue={diff.original ?? ''}
        newValue={diff.modified ?? ''}
        mime={mime}
      />
    ) :
    <ReactDiffViewer
      oldValue={diff.original ?? ''}
      newValue={diff.modified ?? ''}
      splitView={false}
      compareMethod={getCompareMethod(filePath)}
      styles={diffStyles}
      renderLineGutter={isUncommitted ? renderGutter : undefined}
      renderContent={highlightSyntax}
    />
  )
}

export default FileDiffView
