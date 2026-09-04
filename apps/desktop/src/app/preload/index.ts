import type { IEvents, TMainEvents, ThemeDefinition } from '@shared'
import { CHANNELS, TERMINAL_CHANNELS, MAIN_EVENTS } from '@shared'
import { contextBridge, ipcRenderer } from 'electron'
import { type TOptionalArgs } from '@shared'

export type TElectronAPI = {
    [K in keyof typeof CHANNELS]: (...args: TOptionalArgs<IEvents[typeof CHANNELS[K]]['args']>) => IEvents[typeof CHANNELS[K]]['response'];
};

function listenTo<K extends keyof TMainEvents>(
  event: K,
  callback: TMainEvents[K] extends void ? () => void : (data: TMainEvents[K]) => void
) {
  const listener = (_: Electron.IpcRendererEvent, data: TMainEvents[K]) => (callback as any)(data)
  ipcRenderer.on(event, listener)
  return () => ipcRenderer.removeListener(event, listener)
}

if (process.contextIsolated) {
  try {
    const API: TElectronAPI = {
      [CHANNELS.OPEN_REPOSITORY]: () => ipcRenderer.invoke(CHANNELS.OPEN_REPOSITORY),
      [CHANNELS.GET_REPOSITORIES]: () => ipcRenderer.invoke(CHANNELS.GET_REPOSITORIES),
      [CHANNELS.GET_ACTIVE_REPOSITORY]: () => ipcRenderer.invoke(CHANNELS.GET_ACTIVE_REPOSITORY),
      [CHANNELS.SET_ACTIVE_REPOSITORY]: args => ipcRenderer.invoke(CHANNELS.SET_ACTIVE_REPOSITORY, args),
      [CHANNELS.REMOVE_REPOSITORY]: args => ipcRenderer.invoke(CHANNELS.REMOVE_REPOSITORY, args),
      [CHANNELS.GET_REPOSITORY_GROUPS]: () => ipcRenderer.invoke(CHANNELS.GET_REPOSITORY_GROUPS),
      [CHANNELS.SET_REPOSITORY_GROUPS]: args => ipcRenderer.invoke(CHANNELS.SET_REPOSITORY_GROUPS, args),
      [CHANNELS.GET_COMMITS]: (args) => ipcRenderer.invoke(CHANNELS.GET_COMMITS, args),
      [CHANNELS.GET_BRANCHES]: () => ipcRenderer.invoke(CHANNELS.GET_BRANCHES),
      [CHANNELS.GET_STASHES]: () => ipcRenderer.invoke(CHANNELS.GET_STASHES),
      [CHANNELS.STAGE_FILE]: (args) => ipcRenderer.invoke(CHANNELS.STAGE_FILE, args),
      [CHANNELS.UNSTAGE_FILE]: (args) => ipcRenderer.invoke(CHANNELS.UNSTAGE_FILE, args),
      [CHANNELS.STAGE_ALL]: () => ipcRenderer.invoke(CHANNELS.STAGE_ALL),
      [CHANNELS.UNSTAGE_ALL]: () => ipcRenderer.invoke(CHANNELS.UNSTAGE_ALL),
      [CHANNELS.GET_FILE_DIFF]: (args) => ipcRenderer.invoke(CHANNELS.GET_FILE_DIFF, args),
      [CHANNELS.STAGE_LINE]: (args) => ipcRenderer.invoke(CHANNELS.STAGE_LINE, args),
      [CHANNELS.UNSTAGE_LINE]: (args) => ipcRenderer.invoke(CHANNELS.UNSTAGE_LINE, args),
      [CHANNELS.COMMIT]: (args) => ipcRenderer.invoke(CHANNELS.COMMIT, args),
      [CHANNELS.GET_USER]: () => ipcRenderer.invoke(CHANNELS.GET_USER),
      [CHANNELS.SET_GIT_USER]: (args) => ipcRenderer.invoke(CHANNELS.SET_GIT_USER, args),
      [CHANNELS.GET_COMMIT_FILES]: (args) => ipcRenderer.invoke(CHANNELS.GET_COMMIT_FILES, args),
      [CHANNELS.CHECKOUT_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.CHECKOUT_BRANCH, args),
      [CHANNELS.CREATE_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.CREATE_BRANCH, args),
      [CHANNELS.DELETE_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.DELETE_BRANCH, args),
      [CHANNELS.PULL]: () => ipcRenderer.invoke(CHANNELS.PULL),
      [CHANNELS.PUSH]: () => ipcRenderer.invoke(CHANNELS.PUSH),
      [CHANNELS.FETCH]: () => ipcRenderer.invoke(CHANNELS.FETCH),
      [CHANNELS.GET_STATUS]: () => ipcRenderer.invoke(CHANNELS.GET_STATUS),
      [CHANNELS.STAGE_FOLDER]: (args) => ipcRenderer.invoke(CHANNELS.STAGE_FOLDER, args),
      [CHANNELS.UNSTAGE_FOLDER]: (args) => ipcRenderer.invoke(CHANNELS.UNSTAGE_FOLDER, args),
      [CHANNELS.STASH]: () => ipcRenderer.invoke(CHANNELS.STASH),
      [CHANNELS.POP_STASH]: () => ipcRenderer.invoke(CHANNELS.POP_STASH),
      [CHANNELS.UNDO]: (args) => ipcRenderer.invoke(CHANNELS.UNDO, args),
      [CHANNELS.REDO]: args => ipcRenderer.invoke(CHANNELS.REDO, args),
      [CHANNELS.MERGE_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.MERGE_BRANCH, args),
      [CHANNELS.ABORT_MERGE]: () => ipcRenderer.invoke(CHANNELS.ABORT_MERGE),
      [CHANNELS.GET_MERGE_STATUS]: () => ipcRenderer.invoke(CHANNELS.GET_MERGE_STATUS),
      [CHANNELS.GET_CONFLICT_FILE]: (args) => ipcRenderer.invoke(CHANNELS.GET_CONFLICT_FILE, args),
      [CHANNELS.RESOLVE_CONFLICT]: (args) => ipcRenderer.invoke(CHANNELS.RESOLVE_CONFLICT, args),
      [CHANNELS.RESOLVE_CONFLICT_SIDE]: (args) => ipcRenderer.invoke(CHANNELS.RESOLVE_CONFLICT_SIDE, args),
      [CHANNELS.REMOVE_CONFLICT_FILE]: (args) => ipcRenderer.invoke(CHANNELS.REMOVE_CONFLICT_FILE, args),
      [CHANNELS.OPEN_FILE_CONTEXT_MENU]: (args) => ipcRenderer.invoke(CHANNELS.OPEN_FILE_CONTEXT_MENU, args),
      [CHANNELS.GET_THEMES]: () => ipcRenderer.invoke(CHANNELS.GET_THEMES),
      [CHANNELS.GET_ACTIVE_THEME]: () => ipcRenderer.invoke(CHANNELS.GET_ACTIVE_THEME),
      [CHANNELS.SET_THEME]: (args) => ipcRenderer.invoke(CHANNELS.SET_THEME, args),
      [CHANNELS.IMPORT_THEME]: () => ipcRenderer.invoke(CHANNELS.IMPORT_THEME),
      [CHANNELS.OPEN_THEMES_FOLDER]: () => ipcRenderer.invoke(CHANNELS.OPEN_THEMES_FOLDER),
      [CHANNELS.DELETE_CUSTOM_THEME]: (args) => ipcRenderer.invoke(CHANNELS.DELETE_CUSTOM_THEME, args),
      [CHANNELS.SAVE_THEME]: (args) => ipcRenderer.invoke(CHANNELS.SAVE_THEME, args),
      [CHANNELS.EXPORT_THEME]: (args) => ipcRenderer.invoke(CHANNELS.EXPORT_THEME, args),
      [CHANNELS.GET_THEME_JSON]: (args) => ipcRenderer.invoke(CHANNELS.GET_THEME_JSON, args),
  } as const
    contextBridge.exposeInMainWorld('electron', API)

    contextBridge.exposeInMainWorld('gitEventsAPI', {
      onStatusChanged: (callback: () => void) => listenTo(MAIN_EVENTS.GIT_STATUS_CHANGED, callback)
    })

    contextBridge.exposeInMainWorld('appEventsAPI', {
      onAppDidBecomeActive: (callback: () => void) => listenTo(MAIN_EVENTS.APP_DID_BECOME_ACTIVE, callback),
      onThemeUpdated: (callback: (theme: ThemeDefinition) => void) => listenTo(MAIN_EVENTS.THEME_UPDATED, callback),
      onCustomThemesChanged: (callback: (themes: ThemeDefinition[]) => void) => listenTo(MAIN_EVENTS.CUSTOM_THEMES_CHANGED, callback),
      onFullscreenChanged: (callback: (isFullscreen: boolean) => void) => listenTo(MAIN_EVENTS.FULLSCREEN_CHANGED, callback),
    })

    contextBridge.exposeInMainWorld('terminalAPI', {
      create: () => ipcRenderer.invoke(TERMINAL_CHANNELS.TERMINAL_CREATE),
      destroy: () => ipcRenderer.invoke(TERMINAL_CHANNELS.TERMINAL_DESTROY),
      sendInput: (data: string) => ipcRenderer.send(TERMINAL_CHANNELS.TERMINAL_INPUT, data),
      resize: (cols: number, rows: number) => ipcRenderer.send(TERMINAL_CHANNELS.TERMINAL_RESIZE, { cols, rows }),
      onOutput: (callback: (data: string) => void) => {
        const listener = (_: Electron.IpcRendererEvent, data: string) => callback(data)
        ipcRenderer.on(TERMINAL_CHANNELS.TERMINAL_OUTPUT, listener)
        return () => ipcRenderer.removeListener(TERMINAL_CHANNELS.TERMINAL_OUTPUT, listener)
      },
    })
  } catch (error) {
    console.error(error)
  }
}
