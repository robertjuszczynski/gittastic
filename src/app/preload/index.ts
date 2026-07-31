import type { IEvents } from '@shared'
import { CHANNELS } from '@shared'
import { contextBridge, ipcRenderer } from 'electron'

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
      [CHANNELS.CHECKOUT_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.CHECKOUT_BRANCH, args),
      [CHANNELS.CREATE_BRANCH]: (args) => ipcRenderer.invoke(CHANNELS.CREATE_BRANCH, args),
      [CHANNELS.PULL]: () => ipcRenderer.invoke(CHANNELS.PULL),
      [CHANNELS.PUSH]: () => ipcRenderer.invoke(CHANNELS.PUSH),
      [CHANNELS.FETCH]: () => ipcRenderer.invoke(CHANNELS.FETCH),
      [CHANNELS.GET_STATUS]: () => ipcRenderer.invoke(CHANNELS.GET_STATUS),
  } as const
    contextBridge.exposeInMainWorld('electron', API)
  } catch (error) {
    console.error(error)
  }
}
