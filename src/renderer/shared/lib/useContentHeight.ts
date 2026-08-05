import { useTerminalStore } from '@renderer/widgets/terminal'

export const useContentHeight = () => {
  const isOpen = useTerminalStore((s) => s.isOpen)
  const terminalHeight = useTerminalStore((s) => s.height)
  return window.innerHeight - 52 - (isOpen ? terminalHeight : 0)
}
