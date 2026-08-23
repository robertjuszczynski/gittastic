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
    [CHANNELS.GET_THEMES]: () => Promise.resolve(SettingsService.getThemes()),
    [CHANNELS.GET_ACTIVE_THEME]: () => Promise.resolve(SettingsService.getActiveTheme()),
    [CHANNELS.SET_THEME]: (_, args) => SettingsService.setTheme(args),
    [CHANNELS.IMPORT_THEME]: () => SettingsService.importTheme(),
    [CHANNELS.OPEN_THEMES_FOLDER]: () => SettingsService.openThemesFolder(),
    [CHANNELS.DELETE_CUSTOM_THEME]: (_, args) => SettingsService.deleteCustomTheme(args),
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
