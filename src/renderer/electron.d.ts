export interface IElectronAPI {
  test: () => Promise<void>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}