import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useTerminalStore } from '@renderer/widgets/terminal'
import { useStatus } from '@renderer/entities/git-file/api/useStatus'
import { useActivePath, useRepositories } from '@renderer/entities/repository'
import { useStashes } from '@renderer/features/stashes/api/useStashes'
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
import BranchIcon from '@renderer/shared/ui/icons/BranchIcon'
import { useCommandPaletteStore } from '@renderer/widgets/command-palette'

const isMac = navigator.userAgent.includes('Mac')

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  badge,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  onClick: () => unknown
  active?: boolean
  disabled?: boolean
  badge?: number
}) => (
  <button
    onClick={disabled ? undefined : () => onClick()}
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

  const [canRedo, setCanRedo] = useState(false)

  const ahead = status?.ahead ?? 0
  const repoName = repositories.find(r => r.path === activePath)?.name ?? '—'
  const branchName = status?.current ?? '—'
  const hasStashes = (stashes?.length ?? 0) > 0

  const commitsData = queryClient.getQueryData<{ hash: string }[]>(['git', 'commits', activePath])
  const canUndo = (commitsData?.length ?? 0) > 0

  const invalidateGit = () => queryClient.invalidateQueries({ queryKey: ['git'] })

  useEffect(() => {
    window.appEventsAPI.onAppDidBecomeActive(() => {
      console.log('App did become active, invalidating git queries')
      invalidateGit()
    })
  }, [queryClient])

  const handlePush = async () => {
    await window.electron[CHANNELS.PUSH]()
    invalidateGit()
  }

  const handleStash = async () => {
    await window.electron[CHANNELS.STASH]()
    invalidateGit()
  }

  const handlePopStash = async () => {
    await window.electron[CHANNELS.POP_STASH]()
    invalidateGit()
  }

  const handleUndo = async () => {
    await window.electron[CHANNELS.UNDO]()
    invalidateGit()
    setCanRedo(true)
  }

  const handleRedo = async () => {
    await window.electron[CHANNELS.REDO]()
    invalidateGit()
    setCanRedo(false)
  }

  return (
    <div
      className='flex items-stretch px-1 shrink-0 bg-surface'
      style={{ height: 52, borderBottom: '1px solid rgba(0,0,0,0.07)', ...drag }}
    >
      <div className='flex items-stretch' style={{ paddingLeft: isMac ? 76 : 0, ...noDrag }}>
        <ToolbarButton icon={RefreshCcw} label='Fetch' onClick={() => { window.electron[CHANNELS.FETCH](); invalidateGit() }} />
        <ToolbarButton icon={ArrowDownToLine} label='Pull' onClick={() => { window.electron[CHANNELS.PULL](); invalidateGit() }} />
        <ToolbarButton icon={ArrowUpToLine} label='Push' badge={ahead || undefined} onClick={handlePush} />
        <Separator />
        <ToolbarButton icon={Package} label='Stash' onClick={handleStash} />
        <ToolbarButton icon={PackageOpen} label='Pop Stash' disabled={!hasStashes} onClick={handlePopStash} />
      </div>

      <div className='flex-1 flex items-center justify-center gap-2' style={drag}>
        <div className='flex items-center gap-2.5 px-3 py-[7px] bg-surface-2 rounded-lg border border-white/[0.05] select-none' style={noDrag}>
          <span className='text-[12px] font-semibold text-neutral-200 tracking-tight'>{repoName}</span>
          <div className='w-px h-3.5 bg-neutral-700' />
          <div className='flex items-center gap-1.5 text-[12px] text-neutral-400'>
            <BranchIcon size={11} />
            <span>{branchName}</span>
          </div>
        </div>
        <button
          onClick={openPalette}
          title='Quick Actions (⌘⇧P)'
          className='flex items-center gap-1.5 px-2.5 py-[7px] bg-surface-2 rounded-lg border border-white/[0.05] text-neutral-500 hover:text-neutral-300 hover:bg-surface-3 transition-colors cursor-default select-none'
          style={noDrag}
        >
          <Command size={13} strokeWidth={1.6} />
          <span className='text-[11px] font-medium'>Actions</span>
        </button>
      </div>

      <div className='flex items-stretch' style={noDrag}>
        <ToolbarButton icon={Undo2} label='Undo' disabled={!canUndo} onClick={handleUndo} />
        <ToolbarButton icon={Redo2} label='Redo' disabled={!canRedo} onClick={handleRedo} />
        <Separator />
        <ToolbarButton icon={RefreshCw} label='Refresh' onClick={invalidateGit} />
        <Separator />
        <ToolbarButton icon={Terminal} label='Terminal' onClick={toggleTerminal} active={isTerminalOpen} />
      </div>
    </div>
  )
}

export default Toolbar
