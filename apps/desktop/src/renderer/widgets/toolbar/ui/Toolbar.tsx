import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useTerminalStore, withGlobalIndicator, useLoadingStore, useUndoStore } from '@renderer/shared/lib'
import { useToast } from '@renderer/shared/ui/ToastContext'
import { useStatus } from '@renderer/entities/git-file'
import { useActivePath, useRepositories } from '@renderer/entities/repository'
import { useStashes, useStashActions } from '@renderer/features/stashes'
import { dropPushedCommitsOnBranch } from '@renderer/entities/commit'
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Command,
  Package,
  PackageOpen,
  RefreshCcw,
  RefreshCw,
  Redo2,
  Terminal,
  Undo2,
} from 'lucide-react'
import { BranchIcon } from '@renderer/shared/ui/icons'
import { useCommandPaletteStore } from '@renderer/shared/lib'
import ToolbarOperationContent from './ToolbarOperationContent'

const isMac = navigator.userAgent.includes('Mac')

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  badge,
  title,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  onClick: () => unknown
  active?: boolean
  disabled?: boolean
  badge?: number
  title?: string
}) => (
  <button
    onClick={disabled ? undefined : () => onClick()}
    title={title}
    className={`flex flex-col items-center justify-center gap-[5px] px-4 h-full transition-[background-color,color,transform] duration-100 cursor-default select-none outline-none group
      ${disabled
        ? 'text-neutral-600 opacity-40 pointer-events-none'
        : active
          ? 'text-neutral-200 hover:bg-surface-2 active:scale-[0.96]'
          : 'text-neutral-400 hover:text-neutral-200 hover:bg-surface-2 active:scale-[0.96]'
      }`}
  >
    <div className='relative'>
      <Icon size={18} strokeWidth={1.6} />
      {badge != null && badge > 0 && (
        <div className='absolute -top-1.5 -right-2 bg-accent text-white text-[9px] font-bold px-1 rounded-[3px] leading-[13px] min-w-[13px] text-center'>
          {badge}
        </div>
      )}
    </div>
    <span className={`text-[10px] font-medium leading-none ${active ? 'text-neutral-300' : disabled ? '' : 'text-neutral-500 group-hover:text-neutral-400'}`}>
      {label}
    </span>
  </button>
)

const Separator = () => (
  <div className='w-px h-6 bg-neutral-700 mx-0.5 shrink-0 self-center' />
)

const noDrag: React.CSSProperties = { WebkitAppRegion: 'no-drag' } as React.CSSProperties
const drag: React.CSSProperties = { WebkitAppRegion: 'drag' } as React.CSSProperties

const Toolbar = () => {
  const queryClient = useQueryClient()
  const toggleTerminal = useTerminalStore((s) => s.toggle)
  const isTerminalOpen = useTerminalStore((s) => s.isOpen)
  const openPalette = useCommandPaletteStore((s) => s.open)
  const { data: status } = useStatus()
  const { activePath } = useActivePath()
  const { repositories } = useRepositories()
  const { data: stashes } = useStashes()
  const operations = useLoadingStore((s) => s.operations)
  const { showToast } = useToast()
  const { stash, popStash } = useStashActions()

  const undoEntry = useUndoStore((s) => s.undoStack[s.undoStack.length - 1])
  const isUndoing = useUndoStore((s) => s.isUndoing)
  const isRedoing = useUndoStore((s) => s.isRedoing)
  const canUndo = !!undoEntry && !isUndoing
  const canRedo = useUndoStore((s) => s.redoStack.length > 0) && !isRedoing
  const undoLabel = undoEntry?.label ?? null
  const redoLabel = useUndoStore((s) => s.redoStack[s.redoStack.length - 1]?.label ?? null)

  const truncate = (label: string, max = 20) =>
    label.length > max ? label.slice(0, max) + '…' : label

  const [isFullscreen, setIsFullscreen] = useState(false)

  const ahead = status?.ahead ?? 0
  const repoName = repositories.find(r => r.path === activePath)?.name ?? '—'
  const branchName = status?.current ?? '—'
  const hasChangesToStash = (status?.files.length ?? 0) > 0
  const hasStashes = (stashes?.length ?? 0) > 0

  const entries = Array.from(operations.entries())
  const activeOp = entries.length > 0 ? entries[entries.length - 1] : null

  const invalidateGit = withGlobalIndicator('Refreshing', () => queryClient.invalidateQueries({ queryKey: ['git'] }))

  useEffect(() => {
    window.appEventsAPI.onAppDidBecomeActive(() => {
      invalidateGit()
    })
    window.appEventsAPI.onFullscreenChanged(setIsFullscreen)
  }, [queryClient])

  const handlePush = async () => {
    await withGlobalIndicator(CHANNELS.PUSH, window.electron[CHANNELS.PUSH])()
    if (status?.current) dropPushedCommitsOnBranch(status.current)
    await invalidateGit()
  }

  const handleUndo = () =>
    useUndoStore.getState().undo((msg) => showToast(msg, 'error'))

  const handleRedo = () =>
    useUndoStore.getState().redo((msg) => showToast(msg, 'error'))

  return (
    <div className='shrink-0 bg-surface border-b border-b-black/[0.07]' style={drag}>
      {isMac && isFullscreen && (
        <div className='h-[8px] w-full' style={drag} />
      )}
      <div className='flex items-stretch px-1 h-[58px]'>
        <div className={`flex items-stretch ${isMac && !isFullscreen ? 'pl-[76px]' : ''}`} style={noDrag}>
          <ToolbarButton icon={RefreshCcw} label='Fetch' onClick={async () => { await withGlobalIndicator(CHANNELS.FETCH, window.electron[CHANNELS.FETCH])(); invalidateGit() }} />
          <ToolbarButton icon={ArrowDownToLine} label='Pull' onClick={async () => { await withGlobalIndicator(CHANNELS.PULL, window.electron[CHANNELS.PULL])(); invalidateGit() }} />
          <ToolbarButton icon={ArrowUpToLine} label='Push' badge={ahead || undefined} onClick={handlePush} />
          <Separator />
          <ToolbarButton icon={Package} label='Stash' disabled={!hasChangesToStash} onClick={stash} />
          <ToolbarButton icon={PackageOpen} label='Pop Stash' disabled={!hasStashes} onClick={popStash} />
        </div>

        <div className='flex-1 flex items-center justify-center' style={drag}>
          <motion.div
            layout
            className='flex items-center bg-surface-2 rounded-lg border border-white/[0.05] select-none overflow-hidden'
            style={noDrag}
            transition={{ layout: { type: 'spring', stiffness: 360, damping: 28 } }}
          >
            <AnimatePresence mode='wait' initial={false}>
              {activeOp ? (
                <motion.div
                  key={activeOp[0]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ToolbarOperationContent op={activeOp[1]} opId={activeOp[0]} />
                </motion.div>
              ) : (
                <motion.div
                  key='repo-branch'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='flex items-center gap-2.5 px-3 py-[7px]'
                >
                  <span className='text-[12px] font-semibold text-neutral-200 tracking-tight'>{repoName}</span>
                  <div className='w-px h-3.5 bg-neutral-700' />
                  <div className='flex items-center gap-1.5 text-[12px] text-neutral-400'>
                    <BranchIcon size={11} />
                    <span>{branchName}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className='flex items-stretch' style={noDrag}>
          <ToolbarButton
            icon={Undo2}
            label={undoLabel ? `Undo ${truncate(undoLabel)}` : 'Undo'}
            title={undoLabel ? `Undo ${undoLabel}` : undefined}
            disabled={!canUndo}
            onClick={handleUndo}
          />
          <ToolbarButton
            icon={Redo2}
            label={redoLabel ? `Redo ${truncate(redoLabel)}` : 'Redo'}
            title={redoLabel ? `Redo ${redoLabel}` : undefined}
            disabled={!canRedo}
            onClick={handleRedo}
          />
          <Separator />
          <ToolbarButton icon={Command} label='Quick Actions' onClick={openPalette} />
          <Separator />
          <ToolbarButton icon={RefreshCw} label='Refresh' onClick={invalidateGit} />
          <Separator />
          <ToolbarButton icon={Terminal} label='Terminal' onClick={toggleTerminal} active={isTerminalOpen} />
        </div>
      </div>
    </div>
  )
}

export default Toolbar
