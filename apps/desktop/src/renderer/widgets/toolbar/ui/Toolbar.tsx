import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useTerminalStore } from '@renderer/shared/lib'
import { useStatus } from '@renderer/entities/git-file'
import { useActivePath, useRepositories } from '@renderer/entities/repository'
import { useStashes } from '@renderer/features/stashes'
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
  const [isFullscreen, setIsFullscreen] = useState(false)

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
    window.appEventsAPI.onFullscreenChanged(setIsFullscreen)
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
    <div className='shrink-0 bg-surface border-b border-b-black/[0.07]' style={drag}>
      {isMac && isFullscreen && (
        <div className='h-[8px] w-full' style={drag} />
      )}
      <div className='flex items-stretch px-1 h-[52px]'>
      <div className={`flex items-stretch ${isMac && !isFullscreen ? 'pl-[76px]' : ''}`} style={noDrag}>
        <ToolbarButton icon={RefreshCcw} label='Fetch' onClick={() => { window.electron[CHANNELS.FETCH](); invalidateGit() }} />
        <ToolbarButton icon={ArrowDownToLine} label='Pull' onClick={() => { window.electron[CHANNELS.PULL](); invalidateGit() }} />
        <ToolbarButton icon={ArrowUpToLine} label='Push' badge={ahead || undefined} onClick={handlePush} />
        <Separator />
        <ToolbarButton icon={Package} label='Stash' onClick={handleStash} />
        <ToolbarButton icon={PackageOpen} label='Pop Stash' disabled={!hasStashes} onClick={handlePopStash} />
      </div>

      <div className='flex-1 flex items-center justify-center' style={drag}>
        <div className='flex items-center gap-2.5 px-3 py-[7px] bg-surface-2 rounded-lg border border-white/[0.05] select-none' style={noDrag}>
          <span className='text-[12px] font-semibold text-neutral-200 tracking-tight'>{repoName}</span>
          <div className='w-px h-3.5 bg-neutral-700' />
          <div className='flex items-center gap-1.5 text-[12px] text-neutral-400'>
            <BranchIcon size={11} />
            <span>{branchName}</span>
          </div>
        </div>
      </div>

      <div className='flex items-stretch' style={noDrag}>
        <ToolbarButton icon={Undo2} label='Undo' disabled={!canUndo} onClick={handleUndo} />
        <ToolbarButton icon={Redo2} label='Redo' disabled={!canRedo} onClick={handleRedo} />
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
