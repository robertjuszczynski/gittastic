import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'

const toolbarButtons = [
  { label: 'Pull', channel: CHANNELS.PULL },
  { label: 'Push', channel: CHANNELS.PUSH },
  { label: 'Fetch', channel: CHANNELS.FETCH },
  { label: 'Refresh', channel: null },
] as const

type ToolbarChannel = Exclude<typeof toolbarButtons[number]['channel'], null>
type ToolbarNullChannelLabel = Extract<typeof toolbarButtons[number], { channel: null }>['label']

const handleToolbarChannelButtonClick = (channel: ToolbarChannel) => {
  window.electron[channel]()
}

const Toolbar = () => {
  const queryClient = useQueryClient()

  const handleToolbarButtonClick = (label: ToolbarNullChannelLabel) => {
    switch (label) {
      case 'Refresh':
        queryClient.invalidateQueries({ queryKey: ['git'] })
        break
      default:
        break
    }
  }

  return (
    <div
      className='flex items-center gap-1 px-3 shrink-0 bg-surface'
      style={{ height: 40, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {toolbarButtons.map(({ label, channel }) => (
        <button
          key={label}
          className='px-3 py-1 text-[12px] font-medium text-neutral-400 hover:text-neutral-100 hover:bg-surface-2 active:scale-95 transition-all cursor-default select-none'
          onClick={() => {
            if (channel) {
              handleToolbarChannelButtonClick(channel)
            } else {
              handleToolbarButtonClick(label)
            }
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default Toolbar
