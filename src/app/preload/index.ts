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
      [CHANNELS.OPEN_WORKSPACE]: () => ipcRenderer.invoke(CHANNELS.OPEN_WORKSPACE),
      [CHANNELS.GET_WORKSPACES]: () => ipcRenderer.invoke(CHANNELS.GET_WORKSPACES),
      [CHANNELS.GET_ACTIVE_WORKSPACE]: () => ipcRenderer.invoke(CHANNELS.GET_ACTIVE_WORKSPACE),
      [CHANNELS.SET_ACTIVE_WORKSPACE]: args => ipcRenderer.invoke(CHANNELS.SET_ACTIVE_WORKSPACE, args),
      [CHANNELS.GET_COMMITS]: () => ipcRenderer.invoke(CHANNELS.GET_COMMITS),
      [CHANNELS.PULL]: () => ipcRenderer.invoke(CHANNELS.PULL),
      [CHANNELS.PUSH]: () => ipcRenderer.invoke(CHANNELS.PUSH),
      [CHANNELS.FETCH]: () => ipcRenderer.invoke(CHANNELS.FETCH),
  } as const
    contextBridge.exposeInMainWorld('electron', API)
  } catch (error) {
    console.error(error)
  }
}