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

const handleToolbarButtonClick = (label: ToolbarNullChannelLabel) => {                                                                    
  switch (label) {
    case 'Refresh':
      // Refresh
      break;
  
    default:
      break;
  }
}   

const Toolbar = () => {
  return (
    <div className='flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-surface shrink-0'>
      {toolbarButtons.map(({ label, channel }) => (
        <button
          key={channel}
          className='px-3 py-1 text-sm text-text bg-neutral-900 border border-neutral-800 rounded-sm hover:bg-neutral-800 transition-colors'
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
