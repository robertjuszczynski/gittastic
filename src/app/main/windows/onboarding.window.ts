import { BrowserWindow, nativeTheme } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'

export function createOnboardingWindow(): BrowserWindow {
  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    width: 600,
    height: 400,
    resizable: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0d0e11' : '#ffffff',
    webPreferences: {
      preload: join(__dirname, '../preload/onboarding.js'),
      sandbox: false,
    },
  })

  win.on('ready-to-show', () => win.show())

  win.webContents.openDevTools({ mode: 'detach' })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/onboarding/renderer/index.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/onboarding/renderer/index.html'))
  }

  return win
}
