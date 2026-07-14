import { contextBridge } from 'electron/renderer'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', {
      test: () => console.log('test!')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electronAPI = { test: () => console.log('test!') }
}