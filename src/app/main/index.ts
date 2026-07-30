import { app, shell, BrowserWindow, session } from 'electron'
import { SettingsService } from '@main/features/settings/settings.service'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import os from 'node:os'
import path from 'node:path'
import registerIpcHandlers from '@main/ipc/register-ipc-handlers'
import GitService from '@main/features/git/git.service'
import { Storage } from '@main/shared/storage.service'

function createWindow(): void {
  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/app/renderer/index.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {

  const reactDevToolsPath = path.join(
    os.homedir(),
    '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/7.0.1_0'
  )

  electronApp.setAppUserModelId('com.gittastic')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  SettingsService.buildMenu()

  const ws = await Storage.get('active-workspace')
  if (ws?.path) GitService.init(ws.path)

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  await session.defaultSession.loadExtension(reactDevToolsPath)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
