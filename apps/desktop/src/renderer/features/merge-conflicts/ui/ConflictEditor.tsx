import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Resizable } from 'react-resizable'
import { Check, Pencil } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository'
import { useMergeActions } from '../api/useMergeActions'
import {
  parseConflictMarkers,
  computeHunkResolutionState,
  resolveHunkInText,
  selectAllOurs,
  selectAllTheirs,
  selectAllBoth,
  type ConflictHunk,
  type HunkLineSelection,
  type HunkSelectionMap,
} from '../lib/conflictHunks'
import ConflictNavigator from './ConflictNavigator'
import BinaryConflictPicker from './BinaryConflictPicker'
import DeleteModifyConflictPicker from './DeleteModifyConflictPicker'
import { useToast } from '@renderer/shared/ui/ToastContext'
import { StageCheckbox } from '@renderer/shared/ui'
import { highlightCode } from '@renderer/shared/lib'

type ConflictEditorProps = {
  path: string
}

type EditorState = { mergedText: string; selection: HunkSelectionMap }

const acceptButtonClass = 'text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-0.5 border border-border rounded transition-colors cursor-default'

const HunkLine = ({ text, selected, onToggle }: { text: string; selected: boolean; onToggle: () => void }) => (
  <div className={`flex items-start gap-1.5 px-1.5 py-[1px] ${selected ? 'bg-accent/[0.08]' : ''}`}>
    <StageCheckbox isStaged={selected} onClick={onToggle} className='mt-[3px] shrink-0' />
    <span className='whitespace-pre text-neutral-300'>{text || ' '}</span>
  </div>
)

const HunkBlock = ({
  hunk,
  selection,
  resolved,
  onToggleLine,
  onAcceptBulk,
  onRevert,
}: {
  hunk: ConflictHunk
  selection: HunkLineSelection | undefined
  resolved: boolean
  onToggleLine: (side: 'ours' | 'theirs', lineIndex: number) => void
  onAcceptBulk: (resolution: 'ours' | 'theirs' | 'both') => void
  onRevert: () => void
}) => (
  <div
    data-hunk-index={hunk.index}
    className={`my-2 rounded-md border overflow-hidden transition-colors ${resolved ? 'border-divider' : 'border-[#f97316]/35'}`}
  >
    <div className='grid grid-cols-2 divide-x divide-divider text-[12px] font-mono'>
      <div className='overflow-x-auto scrollable'>
        <div className='px-2.5 h-6 flex items-center border-b border-divider'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-accent'>
            Ours{hunk.oursLabel && <span className='text-neutral-500 normal-case font-normal'> · {hunk.oursLabel}</span>}
          </span>
        </div>
        {hunk.oursLines.length === 0 ? (
          <div className='px-2.5 py-1.5 text-neutral-600 italic'>(no lines)</div>
        ) : (
          <div className='py-1'>
            {hunk.oursLines.map((line, i) => (
              <HunkLine key={i} text={line} selected={selection?.ours.has(i) ?? false} onToggle={() => onToggleLine('ours', i)} />
            ))}
          </div>
        )}
      </div>
      <div className='overflow-x-auto scrollable'>
        <div className='px-2.5 h-6 flex items-center border-b border-divider'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-neutral-500'>
            Theirs{hunk.theirsLabel && <span className='normal-case font-normal'> · {hunk.theirsLabel}</span>}
          </span>
        </div>
        {hunk.theirsLines.length === 0 ? (
          <div className='px-2.5 py-1.5 text-neutral-600 italic'>(no lines)</div>
        ) : (
          <div className='py-1'>
            {hunk.theirsLines.map((line, i) => (
              <HunkLine key={i} text={line} selected={selection?.theirs.has(i) ?? false} onToggle={() => onToggleLine('theirs', i)} />
            ))}
          </div>
        )}
      </div>
    </div>

    <div className='flex items-center gap-1.5 px-2 h-7 border-t border-divider'>
      <button onClick={() => onAcceptBulk('ours')} className={acceptButtonClass}>All Ours</button>
      <button onClick={() => onAcceptBulk('theirs')} className={acceptButtonClass}>All Theirs</button>
      <button onClick={() => onAcceptBulk('both')} className={`${acceptButtonClass} text-accent border-accent/25 hover:bg-accent/10 hover:text-accent`}>Both</button>
      <span className='text-[10px] text-neutral-600'>or check individual lines above</span>
      <div className='flex-1' />
      {resolved && (
        <div className='flex items-center gap-2'>
          <span className='flex items-center gap-1 text-[10px] font-medium text-accent'>
            <Check size={11} strokeWidth={2.4} />
            Resolved
          </span>
          {selection && (
            <button onClick={onRevert} className='text-[10px] text-neutral-500 hover:text-neutral-300 underline decoration-dotted underline-offset-2 cursor-default'>
              Revert
            </button>
          )}
        </div>
      )}
    </div>
  </div>
)

/** Textarea with a Prism-highlighted `<pre>` sitting exactly behind it — the standard trick for a highlighted editable code box without pulling in a full editor dependency. The textarea's own text is transparent; only its caret and selection paint, the `<pre>` underneath supplies the visible, colored text. */
const HighlightedTextarea = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const preRef = useRef<HTMLPreElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const syncScroll = () => {
    if (!preRef.current || !taRef.current) return
    preRef.current.scrollTop = taRef.current.scrollTop
    preRef.current.scrollLeft = taRef.current.scrollLeft
  }

  const textStyle = 'px-3 py-2 text-[12px] font-mono leading-5 whitespace-pre'

  return (
    <div className='relative flex-1 min-h-0'>
      <pre
        ref={preRef}
        aria-hidden
        className={`absolute inset-0 m-0 overflow-auto pointer-events-none ${textStyle}`}
        dangerouslySetInnerHTML={{ __html: highlightCode(value) + '\n' }}
      />
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        className={`absolute inset-0 w-full h-full bg-transparent text-transparent caret-neutral-200 outline-none resize-none overflow-auto ${textStyle}`}
      />
    </div>
  )
}

const ConflictEditor = ({ path }: ConflictEditorProps) => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()
  const { resolveConflict, resolveConflictSide, removeConflictFile } = useMergeActions()
  const { showToast } = useToast()
  const [editorState, setEditorState] = useState<EditorState>({ mergedText: '', selection: {} })
  const [activeHunkIndex, setActiveHunkIndex] = useState<number | null>(null)
  const [resultHeight, setResultHeight] = useState(260)

  const { data: content, isLoading } = useQuery({
    queryKey: ['git', 'conflict-file', activePath, path],
    queryFn: () => window.electron[CHANNELS.GET_CONFLICT_FILE](path),
    enabled: !!activePath && !!path,
  })

  // Seed the editable pane from the working-tree file whenever a different file is opened.
  useEffect(() => {
    if (content && !content.isBinary && !content.isDeleteConflict) setEditorState({ mergedText: content.raw, selection: {} })
    setActiveHunkIndex(null)
  }, [path, content?.raw])

  const segments = useMemo(() => (content && !content.isBinary && !content.isDeleteConflict ? parseConflictMarkers(content.raw) : []), [content])
  const hunks = useMemo(() => segments.filter(s => s.type === 'conflict').map(s => s.hunk), [segments])

  const invalidateConflictFile = () => queryClient.invalidateQueries({ queryKey: ['git', 'conflict-file', activePath, path] })

  const applySelection = (hunkIndex: number, nextSelection: HunkLineSelection | undefined) => {
    setEditorState(prev => {
      const result = resolveHunkInText(prev.mergedText, prev.selection, hunks, hunkIndex, nextSelection)
      if (!result) {
        showToast(`Hunk ${hunkIndex + 1} was changed by hand — resolve it manually instead`, 'warning')
        return prev
      }
      return result
    })
  }

  const handleToggleLine = (hunk: ConflictHunk, side: 'ours' | 'theirs', lineIndex: number) => {
    const current = editorState.selection[hunk.index] ?? { ours: new Set<number>(), theirs: new Set<number>() }
    const nextSideSet = new Set(current[side])
    if (nextSideSet.has(lineIndex)) nextSideSet.delete(lineIndex)
    else nextSideSet.add(lineIndex)
    applySelection(hunk.index, { ...current, [side]: nextSideSet })
  }

  const handleAcceptBulk = (hunk: ConflictHunk, resolution: 'ours' | 'theirs' | 'both') => {
    const next = resolution === 'ours' ? selectAllOurs(hunk) : resolution === 'theirs' ? selectAllTheirs(hunk) : selectAllBoth(hunk)
    applySelection(hunk.index, next)
  }

  const handleRevert = (hunk: ConflictHunk) => applySelection(hunk.index, undefined)

  const handleUseWholeFile = (resolution: 'ours' | 'theirs') => {
    setEditorState(prev => {
      let state = prev
      for (const hunk of hunks) {
        const next = resolution === 'ours' ? selectAllOurs(hunk) : selectAllTheirs(hunk)
        const result = resolveHunkInText(state.mergedText, state.selection, hunks, hunk.index, next)
        if (result) state = result
      }
      return state
    })
  }

  const handleScrollToHunk = (index: number) => {
    setActiveHunkIndex(index)
    document.querySelector(`[data-hunk-index="${index}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleResolveFile = async () => {
    await resolveConflict(path, editorState.mergedText)
    invalidateConflictFile()
  }

  if (isLoading || !content) {
    return <div className='flex-1 flex items-center justify-center text-neutral-600 text-[12px]'>Loading conflict…</div>
  }

  if (content.isBinary) {
    return (
      <div className='flex-1 min-w-0 flex flex-col overflow-hidden'>
        <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0'>{path}</div>
        <BinaryConflictPicker
          path={path}
          content={content}
          onResolve={async side => { await resolveConflictSide(path, side); invalidateConflictFile() }}
        />
      </div>
    )
  }

  if (content.isDeleteConflict) {
    return (
      <div className='flex-1 min-w-0 flex flex-col overflow-hidden'>
        <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0'>{path}</div>
        <DeleteModifyConflictPicker
          path={path}
          content={content}
          onKeep={async side => { await resolveConflictSide(path, side); invalidateConflictFile() }}
          onDelete={async () => { await removeConflictFile(path); invalidateConflictFile() }}
        />
      </div>
    )
  }

  const resolvedCount = hunks.filter(h => computeHunkResolutionState(h, editorState.mergedText, content.raw) === 'resolved').length
  const stillPending = resolvedCount < hunks.length

  return (
    <div className='flex-1 min-w-0 flex overflow-hidden'>
      <div className='flex-1 min-w-0 flex flex-col overflow-hidden'>
        <div className='flex items-center justify-between px-3 py-2 gap-3 shrink-0'>
          <span className='text-[11px] font-bold text-neutral-500 tracking-wider truncate'>{path}</span>
          <div className='flex items-center gap-1.5 shrink-0'>
            <button onClick={() => handleUseWholeFile('ours')} className={acceptButtonClass}>Use Ours (whole file)</button>
            <button onClick={() => handleUseWholeFile('theirs')} className={acceptButtonClass}>Use Theirs (whole file)</button>
            <button
              onClick={handleResolveFile}
              disabled={stillPending}
              className='text-[11px] font-medium px-3 py-1 rounded transition-colors disabled:opacity-30 bg-accent text-white hover:bg-accent/80 disabled:hover:bg-accent cursor-default'
              title={stillPending ? `Resolve ${hunks.length - resolvedCount} more hunk${hunks.length - resolvedCount === 1 ? '' : 's'} before staging this file` : undefined}
            >
              {stillPending ? `Resolve File (${resolvedCount}/${hunks.length})` : 'Resolve File'}
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto scrollable px-3'>
          {segments.map((segment, i) =>
            segment.type === 'context' ? (
              <pre key={i} className='text-[12px] font-mono whitespace-pre-wrap break-all text-neutral-600'>{segment.lines.join('\n')}</pre>
            ) : (
              <HunkBlock
                key={i}
                hunk={segment.hunk}
                selection={editorState.selection[segment.hunk.index]}
                resolved={computeHunkResolutionState(segment.hunk, editorState.mergedText, content.raw) === 'resolved'}
                onToggleLine={(side, lineIndex) => handleToggleLine(segment.hunk, side, lineIndex)}
                onAcceptBulk={resolution => handleAcceptBulk(segment.hunk, resolution)}
                onRevert={() => handleRevert(segment.hunk)}
              />
            )
          )}
        </div>

        <Resizable
          height={resultHeight}
          width={0}
          onResize={(_, { size }) => setResultHeight(Math.max(160, Math.min(520, size.height)))}
          resizeHandles={['n']}
        >
          <div className='shrink-0 flex flex-col border-t-2 border-t-accent/40 focus-within:border-t-accent bg-surface-2' style={{ height: resultHeight }}>
            <div className='flex items-center gap-1.5 px-3 h-8 shrink-0 border-b border-b-divider select-none'>
              <Pencil size={11} className='text-neutral-500' />
              <span className='text-[11px] font-medium text-neutral-400'>Merged result — editable</span>
              <span className='text-[10px] text-neutral-600'>this is what gets staged</span>
            </div>
            <HighlightedTextarea value={editorState.mergedText} onChange={mergedText => setEditorState(prev => ({ ...prev, mergedText }))} />
          </div>
        </Resizable>
      </div>

      <ConflictNavigator
        hunks={hunks}
        currentContent={editorState.mergedText}
        rawContent={content.raw}
        activeHunkIndex={activeHunkIndex}
        onSelectHunk={handleScrollToHunk}
      />
    </div>
  )
}

export default ConflictEditor
