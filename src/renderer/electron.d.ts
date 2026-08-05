import type { TElectronAPI } from '../app/preload'

interface TerminalAPI {
  create: () => Promise<void>
  destroy: () => Promise<void>
  sendInput: (data: string) => void
  resize: (cols: number, rows: number) => void
  onOutput: (callback: (data: string) => void) => () => void
}

declare global {
  interface Window {
    electron: TElectronAPI
    terminalAPI: TerminalAPI
  }
}