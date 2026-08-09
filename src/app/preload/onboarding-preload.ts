import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('onboardingAPI', {
      complete: () => ipcRenderer.invoke('ONBOARDING_COMPLETE'),
    })
  } catch (error) {
    console.error(error)
  }
}
