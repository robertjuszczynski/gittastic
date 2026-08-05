import type { IEvents } from '@shared'
import { CHANNELS, TERMINAL_CHANNELS } from '@shared'
import { contextBridge, ipcRenderer, clipboard } from 'electron'

type TOptionalArgs<T> = T extends void ? [] : [args: T];

export type TElectronAPI = {
    [K in keyof typeof CHANNELS]: (...args: TOptionalArgs<IEvents[typeof CHANNELS[K]]['args']>) => IEvents[typeof CHANNELS[K]]['response'];
};

if (process.contextIsolated) {
  try {
    const API: TElectronAPI = {
      [CHANNELS.OPEN_REPOSITORY]: () => ipcRenderer.invoke(CHANNELS.OPEN_REPOSITORY),
      [CHANNELS.GET_REPOSITORIES]: () => ipcRenderer.invoke(CHANNELS.GET_REPOSITORIES),
      [CHANNELS.GET_ACTIVE_REPOSITORY]: () => ipcRenderer.invoke(CHANNELS.GET_ACTIVE_REPOSITORY),
      [CHANNELS.SET_ACTIVE_REPOSITORY]: args => ipcRenderer.invoke(CHANNELS.SET_ACTIVE_REPOSITORY, args),
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
      [CHANNELS.GET_COMMIT_FILES]: (args) => ipcRenderer.invoke(CHANNELS.GET_COMMIT_FILES, args),
      [CHANNELS.CHECKOUT_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.CHECKOUT_BRANCH, args),
      [CHANNELS.CREATE_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.CREATE_BRANCH, args),
      [CHANNELS.PULL]: () => ipcRenderer.invoke(CHANNELS.PULL),
      [CHANNELS.PUSH]: () => ipcRenderer.invoke(CHANNELS.PUSH),
      [CHANNELS.FETCH]: () => ipcRenderer.invoke(CHANNELS.FETCH),
      [CHANNELS.GET_STATUS]: () => ipcRenderer.invoke(CHANNELS.GET_STATUS),
      [CHANNELS.STAGE_FOLDER]: (args) => ipcRenderer.invoke(CHANNELS.STAGE_FOLDER, args),
      [CHANNELS.UNSTAGE_FOLDER]: (args) => ipcRenderer.invoke(CHANNELS.UNSTAGE_FOLDER, args),
      [CHANNELS.STASH]: () => ipcRenderer.invoke(CHANNELS.STASH),
      [CHANNELS.POP_STASH]: () => ipcRenderer.invoke(CHANNELS.POP_STASH),
      [CHANNELS.UNDO]: () => ipcRenderer.invoke(CHANNELS.UNDO),
      [CHANNELS.REDO]: () => ipcRenderer.invoke(CHANNELS.REDO),
  } as const
    contextBridge.exposeInMainWorld('electron', API)

    contextBridge.exposeInMainWorld('clipboardAPI', {
      readText: () => clipboard.readText(),
      writeText: (text: string) => clipboard.writeText(text),
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
