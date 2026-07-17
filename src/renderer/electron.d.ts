import type { TElectronAPI } from '../app/preload'
declare global {
  interface Window {
    electron: TElectronAPI
  }
}