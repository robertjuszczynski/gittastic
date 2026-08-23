import { app, type BrowserWindow } from 'electron'
import { SettingsService } from '@main/features/settings/settings.service'
import { electronApp } from '@electron-toolkit/utils'
import registerIpcHandlers from '@main/ipc/register-ipc-handlers'
import GitService from '@main/features/git/git.service'
import { Storage } from '@main/shared/storage.service'
import { sendToRenderer } from '@main/shared/send-to-renderer'
import { MAIN_EVENTS, ONBOARDING_EVENT_CHANNELS } from '@shared'
import { createMainWindow } from './windows/main.window'
import { createOnboardingWindow } from './windows/onboarding.window'

const RESET_ONBOARDING = false // set to true during dev to always show onboarding

let mainWin: BrowserWindow | null = null
let onboardingWin: BrowserWindow | null = null
let onboardingDone = false

function switchToMainWindow() {
  mainWin = createMainWindow()
  onboardingWin?.close()
  onboardingWin = null
  app.on('did-become-active', () => {
    sendToRenderer(mainWin!.webContents, MAIN_EVENTS.APP_DID_BECOME_ACTIVE)
  })
}

app.setAsDefaultProtocolClient('gitastic')
app.setPath('userData', app.getPath('userData').replace(/Gittastic$/, 'Gitastic'))

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.gitastic')

  SettingsService.buildMenu()

  const [repo, theme, onboardingCompleted] = await Promise.all([
    Storage.get('active-repository'),
    Storage.get('theme'),
    Storage.get('onboarding-completed'),
  ])
  if (repo?.path) GitService.init(repo.path)
  if (theme) await SettingsService.applyTheme(theme)

  registerIpcHandlers({
    getOnboardingWin: () => onboardingWin,
    setOnboardingDone: () => { onboardingDone = true },
    switchToMainWindow,
  })

  if (onboardingCompleted && !RESET_ONBOARDING) {
    onboardingDone = true
    mainWin = createMainWindow()
    app.on('did-become-active', () => {
      sendToRenderer(mainWin!.webContents, MAIN_EVENTS.APP_DID_BECOME_ACTIVE)
    })
  } else {
    onboardingWin = createOnboardingWindow()
  }

  app.on('activate', () => {
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.show()
    } else if (onboardingWin && !onboardingWin.isDestroyed()) {
      onboardingWin.show()
    } else if (onboardingDone) {
      mainWin = createMainWindow()
    } else {
      onboardingWin = createOnboardingWindow()
    }
  })
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  try {
    const parsed = new URL(url)
    if (parsed.pathname === '/oauth/callback') {
      const code = parsed.searchParams.get('code')
      if (code && onboardingWin && !onboardingWin.isDestroyed()) {
        onboardingWin.webContents.send(ONBOARDING_EVENT_CHANNELS.ONBOARDING_GITHUB_AUTH_RESULT, { code })
      }
    }
  } catch {}
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
