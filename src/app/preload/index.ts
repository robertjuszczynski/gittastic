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
  } as const
    contextBridge.exposeInMainWorld('electron', API)
  } catch (error) {
    console.error(error)
  }
}