import { ipcMain, type BrowserWindow } from 'electron'
import { ONBOARDING_CHANNELS } from '@shared'
import { type IOnboardingEvents } from '@shared/ipc/events.onboarding'
import { OnboardingService } from '../onboarding.service'

type OnboardingIpcHandlers = {
  [K in keyof typeof ONBOARDING_CHANNELS]: (
    event: Electron.IpcMainInvokeEvent,
    args: IOnboardingEvents[typeof ONBOARDING_CHANNELS[K]]['args']
  ) => IOnboardingEvents[typeof ONBOARDING_CHANNELS[K]]['response']
}

export type OnboardingIpcContext = {
  getOnboardingWin: () => BrowserWindow | null
  setOnboardingDone: () => void
  switchToMainWindow: () => void
}

export default function registerOnboardingIpcHandlers(ctx: OnboardingIpcContext) {
  const handlers: OnboardingIpcHandlers = {
    [ONBOARDING_CHANNELS.ONBOARDING_COMPLETE]: async (_, args) => {
      await OnboardingService.complete(args)
      ctx.setOnboardingDone()
      ctx.switchToMainWindow()
    },
    [ONBOARDING_CHANNELS.ONBOARDING_RESIZE]: async (_, args) => {
      const win = ctx.getOnboardingWin()
      if (win && !win.isDestroyed()) OnboardingService.animateResize(win, args.width, args.height)
    },
    [ONBOARDING_CHANNELS.ONBOARDING_OPEN_REPOSITORY]: () => OnboardingService.openRepository(),
    [ONBOARDING_CHANNELS.ONBOARDING_PICK_FOLDER]: () => OnboardingService.pickFolder(),
    [ONBOARDING_CHANNELS.ONBOARDING_CREATE_REPOSITORY]: (_, args) => OnboardingService.createRepository(args.name, args.parentPath, args.readme),
    [ONBOARDING_CHANNELS.ONBOARDING_GITHUB_AUTH_START]: async () => OnboardingService.startGithubAuth(),
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
