import { ONBOARDING_CHANNELS, ONBOARDING_EVENT_CHANNELS } from '@shared'
import { contextBridge, ipcRenderer } from 'electron'
import type { TOnboardingAPI, TOnboardingEventsAPI } from '@shared/ipc/api.onboarding'
import type { IOnboardingEventEvents } from '../../shared/ipc/events.onboarding'
import type { TAbortableChannel } from '../../shared/ipc/abortable-channels'

type TGithubAuthResultData = IOnboardingEventEvents[typeof ONBOARDING_EVENT_CHANNELS.ONBOARDING_GITHUB_AUTH_RESULT]

function listenTo(channel: string, callback: (data: TGithubAuthResultData) => void) {
  const listener = (_: Electron.IpcRendererEvent, data: TGithubAuthResultData) => callback(data)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

if (process.contextIsolated) {
  try {
    const api: TOnboardingAPI = {
      [ONBOARDING_CHANNELS.ONBOARDING_COMPLETE]: (args) => ipcRenderer.invoke(ONBOARDING_CHANNELS.ONBOARDING_COMPLETE, args),
      [ONBOARDING_CHANNELS.ONBOARDING_RESIZE]: (args) => ipcRenderer.invoke(ONBOARDING_CHANNELS.ONBOARDING_RESIZE, args),
      [ONBOARDING_CHANNELS.ONBOARDING_GITHUB_AUTH_START]: () => ipcRenderer.invoke(ONBOARDING_CHANNELS.ONBOARDING_GITHUB_AUTH_START),
      [ONBOARDING_CHANNELS.ONBOARDING_OPEN_REPOSITORY]: () => ipcRenderer.invoke(ONBOARDING_CHANNELS.ONBOARDING_OPEN_REPOSITORY),
      [ONBOARDING_CHANNELS.ONBOARDING_PICK_FOLDER]: () => ipcRenderer.invoke(ONBOARDING_CHANNELS.ONBOARDING_PICK_FOLDER),
      [ONBOARDING_CHANNELS.ONBOARDING_CREATE_REPOSITORY]: (args) => ipcRenderer.invoke(ONBOARDING_CHANNELS.ONBOARDING_CREATE_REPOSITORY, args),
    }
    const eventsApi: TOnboardingEventsAPI = {
      onGithubAuthResult: (cb) => listenTo(ONBOARDING_EVENT_CHANNELS.ONBOARDING_GITHUB_AUTH_RESULT, cb),
    }
    contextBridge.exposeInMainWorld('onboardingAPI', api)
    contextBridge.exposeInMainWorld('onboardingEventsAPI', eventsApi)
    contextBridge.exposeInMainWorld('abortAPI', {
      cancel: (channel: TAbortableChannel, requestId: string) => ipcRenderer.invoke(`CANCEL_${channel}`, { requestId }),
    })
  } catch (error) {
    console.error(error)
  }
}
