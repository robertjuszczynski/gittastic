import { app, shell, BrowserWindow, session } from 'electron'
import { SettingsService } from '@main/features/settings/settings.service'
import { join } from 'node:path'
import { electronApp, is } from '@electron-toolkit/utils'
import os from 'node:os'
import path from 'node:path'
import registerIpcHandlers from '@main/ipc/register-ipc-handlers'
import GitService from '@main/features/git/git.service'
import { Storage } from '@main/shared/storage.service'
import { sendToRenderer } from '@main/shared/send-to-renderer'
import { MAIN_EVENTS } from '@shared'

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 18 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  win.maximize()
  win.on('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  win.webContents.openDevTools({
    mode: 'detach'
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/app/renderer/index.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

app.whenReady().then(async () => {

  const reactDevToolsPath = path.join(
    os.homedir(),
    '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/7.0.1_0'
  )

  electronApp.setAppUserModelId('com.gittastic')

  SettingsService.buildMenu()

  const repo = await Storage.get('active-repository')
  if (repo?.path) GitService.init(repo.path)
  
  await session.defaultSession.loadExtension(reactDevToolsPath)

  registerIpcHandlers()
  const win = createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('did-become-active', () => {
    sendToRenderer(win.webContents, MAIN_EVENTS.APP_DID_BECOME_ACTIVE)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
