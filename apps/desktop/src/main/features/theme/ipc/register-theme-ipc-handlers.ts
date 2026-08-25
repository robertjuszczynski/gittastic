import { ipcMain } from 'electron'
import type { THEME_CHANNELS } from '@shared'
import { CHANNELS, type IEvents } from '@shared'
import { ThemeService } from '../theme.service'

type ThemeIpcHandlers = {
  [K in keyof typeof THEME_CHANNELS]: (
    event: Electron.IpcMainInvokeEvent,
    args: IEvents[typeof CHANNELS[K]]['args']
  ) => IEvents[typeof CHANNELS[K]]['response']
}

export default function registerThemeIpcHandlers() {
  const handlers: ThemeIpcHandlers = {
    [CHANNELS.GET_THEMES]: () => Promise.resolve(ThemeService.getThemes()),
    [CHANNELS.GET_ACTIVE_THEME]: () => Promise.resolve(ThemeService.getActiveTheme()),
    [CHANNELS.SET_THEME]: (_, args) => ThemeService.setTheme(args),
    [CHANNELS.IMPORT_THEME]: () => ThemeService.importTheme(),
    [CHANNELS.OPEN_THEMES_FOLDER]: () => ThemeService.openThemesFolder(),
    [CHANNELS.DELETE_CUSTOM_THEME]: (_, args) => ThemeService.deleteCustomTheme(args),
    [CHANNELS.SAVE_THEME]: (_, args) => ThemeService.saveTheme(args.slug, args.json),
    [CHANNELS.EXPORT_THEME]: (_, args) => ThemeService.exportTheme(args),
    [CHANNELS.GET_THEME_JSON]: (_, args) => ThemeService.getThemeJson(args),
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
