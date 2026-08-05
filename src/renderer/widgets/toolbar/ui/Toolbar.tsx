import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useTerminalStore } from '@renderer/widgets/terminal'
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Package,
  PackageOpen,
  PanelLeft,
  RefreshCcw,
  RefreshCw,
  Redo2,
  Terminal,
  Undo2,
} from 'lucide-react'
import BranchIcon from '@renderer/shared/ui/icons/BranchIcon'

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  onClick: () => void
  active?: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-[5px] px-4 h-full hover:text-neutral-200 hover:bg-surface-2 active:scale-[0.96] transition-[background-color,color,transform] duration-100 cursor-default select-none outline-none group ${active ? 'text-neutral-200' : 'text-neutral-400'}`}
  >
    <Icon size={18} strokeWidth={1.6} />
    <span className={`text-[10px] font-medium leading-none ${active ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-400'}`}>
      {label}
    </span>
  </button>
)

const Separator = () => (
  <div className='w-px h-6 bg-neutral-700 mx-0.5 shrink-0 self-center' />
)

const Toolbar = () => {
  const queryClient = useQueryClient()
  const toggleTerminal = useTerminalStore((s) => s.toggle)
  const isTerminalOpen = useTerminalStore((s) => s.isOpen)

  return (
    <div
      className='flex items-stretch px-1 shrink-0 bg-surface'
      style={{ height: 52, borderBottom: '1px solid rgba(0,0,0,0.07)' }}
    >
      <button className='flex items-center justify-center px-3 h-full text-neutral-400 hover:text-neutral-200 hover:bg-surface-2 active:scale-[0.96] transition-[background-color,color,transform] duration-100 cursor-default outline-none'>
        <PanelLeft size={18} strokeWidth={1.6} />
      </button>
      <Separator />
      <div className='flex items-stretch'>
        <ToolbarButton icon={RefreshCcw} label='Fetch' onClick={() => window.electron[CHANNELS.FETCH]()} />
        <ToolbarButton icon={ArrowDownToLine} label='Pull' onClick={() => window.electron[CHANNELS.PULL]()} />
        <ToolbarButton icon={ArrowUpToLine} label='Push' onClick={() => window.electron[CHANNELS.PUSH]()} />
        <Separator />
        <ToolbarButton
          icon={RefreshCw}
          label='Refresh'
          onClick={() => queryClient.invalidateQueries({ queryKey: ['git'] })}
        />
        <Separator />
        <ToolbarButton icon={Package} label='Stash' onClick={() => {}} />
        <ToolbarButton icon={PackageOpen} label='Pop Stash' onClick={() => {}} />
      </div>
      <div className='flex-1 flex items-center justify-center gap-3'>
        <span className='text-[11px] font-semibold text-neutral-300 select-none tracking-tight'>
          repo-name
        </span>
        <button className='flex items-center gap-1.5 px-2 py-1 text-[11px] text-neutral-500 hover:text-neutral-300 hover:bg-surface-2 transition-colors duration-100 cursor-default select-none outline-none'>
          <BranchIcon size={11} />
          <span>branch-name</span>
        </button>
      </div>
      <div className='flex items-stretch'>
        <ToolbarButton icon={Undo2} label='Undo' onClick={() => {}} />
        <ToolbarButton icon={Redo2} label='Redo' onClick={() => {}} />
        <Separator />
        <ToolbarButton
          icon={Terminal}
          label='Terminal'
          onClick={toggleTerminal}
          active={isTerminalOpen}
        />
      </div>
    </div>
  )
}

export default Toolbar
