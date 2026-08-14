import { app, session, ipcMain, BrowserWindow } from 'electron'
import { SettingsService } from '@main/features/settings/settings.service'
import { electronApp } from '@electron-toolkit/utils'
import os from 'node:os'
import path from 'node:path'
import registerIpcHandlers from '@main/ipc/register-ipc-handlers'
import GitService from '@main/features/git/git.service'
import { Storage } from '@main/shared/storage.service'
import { sendToRenderer } from '@main/shared/send-to-renderer'
import { MAIN_EVENTS } from '@shared'
import { createMainWindow } from './windows/main.window'
import { createOnboardingWindow } from './windows/onboarding.window'

let mainWin: BrowserWindow | null = null                                                                             
let onboardingWin: BrowserWindow | null = null

const reactDevToolsPath = path.join(
  os.homedir(),
  '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/7.0.1_0'
)

const reduxDevToolsPath = path.join(
  os.homedir(),
  '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.2.10_0'
)

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.gittastic')

  SettingsService.buildMenu()

  const [repo, theme] = await Promise.all([
    Storage.get('active-repository'),
    Storage.get('theme'),
  ])
  if (repo?.path) GitService.init(repo.path)
  if (theme) await SettingsService.applyTheme(theme)

  await session.defaultSession.loadExtension(reactDevToolsPath)
  await session.defaultSession.loadExtension(reduxDevToolsPath)

  registerIpcHandlers()

  onboardingWin = createOnboardingWindow()

  ipcMain.handle('ONBOARDING_COMPLETE', () => {
    mainWin = createMainWindow()
    onboardingWin?.close()
    onboardingWin = null

    app.on('did-become-active', () => {
      sendToRenderer(mainWin!.webContents, MAIN_EVENTS.APP_DID_BECOME_ACTIVE)
    })
  })

  app.on('activate', () => {                                                                                                     
    if (mainWin && !mainWin.isDestroyed()) {                                                                                     
      mainWin.show()                                                                                                             
    } else if (onboardingWin && !onboardingWin.isDestroyed()) {                                                                  
      onboardingWin.show()                                                                                                       
    } else {                                                                                                                     
      onboardingWin = createOnboardingWindow()                                                                                   
    }                                                                                                                            
  })     
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
