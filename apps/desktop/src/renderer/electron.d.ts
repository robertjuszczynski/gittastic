import type { TElectronAPI } from '../app/preload'
import type { ThemeDefinition } from '@shared'

interface TerminalAPI {
  create: () => Promise<void>
  destroy: () => Promise<void>
  sendInput: (data: string) => void
  resize: (cols: number, rows: number) => void
  onOutput: (callback: (data: string) => void) => () => void
}

interface GitEventsAPI {
  onStatusChanged: (callback: () => void) => () => void
}

interface AppEventsAPI {
  onAppDidBecomeActive: (callback: () => void) => () => void
  onThemeUpdated: (callback: (theme: ThemeDefinition) => void) => () => void
  onCustomThemesChanged: (callback: (themes: ThemeDefinition[]) => void) => () => void
  onFullscreenChanged: (callback: (isFullscreen: boolean) => void) => () => void
}

declare global {
  interface Window {
    electron: TElectronAPI
    terminalAPI: TerminalAPI
    gitEventsAPI: GitEventsAPI
    appEventsAPI: AppEventsAPI
  }
}
