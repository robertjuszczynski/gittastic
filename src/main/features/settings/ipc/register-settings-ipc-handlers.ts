import { ipcMain } from 'electron'
import type { SETTINGS_CHANNELS } from '@shared'
import { CHANNELS, type IEvents } from '@shared'
import { SettingsService } from '../settings.service'

type SettingsIpcHandlers = {
  [K in keyof typeof SETTINGS_CHANNELS]: (
    event: Electron.IpcMainInvokeEvent,
    args: IEvents[typeof CHANNELS[K]]['args']
  ) => IEvents[typeof CHANNELS[K]]['response']
}

export default function registerSettingsIpcHandlers() {
  const handlers: SettingsIpcHandlers = {
    [CHANNELS.SELECT_THEME]: (_, args) => SettingsService.setTheme(args),
    [CHANNELS.GET_THEME]: () => SettingsService.getTheme(),
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
