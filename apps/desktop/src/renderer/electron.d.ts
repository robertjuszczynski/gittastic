import type { TElectronAPI } from '../app/preload'
import type { ThemeDefinition } from '@shared'
import type { TAbortableChannel } from '@shared/ipc/abortable-channels'

interface TerminalAPI {
  create: () => Promise<void>
  destroy: () => Promise<void>
  sendInput: (data: string) => void
  resize: (cols: number, rows: number) => void
  onOutput: (callback: (data: string) => void) => () => void
}

interface AbortAPI {
  cancel: (channel: TAbortableChannel, requestId: string) => Promise<void>
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
    abortAPI: AbortAPI
    gitEventsAPI: GitEventsAPI
    appEventsAPI: AppEventsAPI
  }
}
