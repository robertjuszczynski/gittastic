import registerRepositoriesIpcHandlers from '@main/features/repositories/ipc/register-repositories-ipc-handlers'
import registerGitIpcHandlers from '@main/features/git/ipc/register-git-ipc-handlers'
import registerTerminalIpcHandlers from '@main/features/terminal/ipc/register-terminal-ipc-handlers'
import registerFileIpcHandlers from '@main/entities/file/ipc/register-file-ipc-handlers'
import registerThemeIpcHandlers from '@main/features/theme/ipc/register-theme-ipc-handlers'
import registerOnboardingIpcHandlers, { type OnboardingIpcContext } from '@main/features/onboarding/ipc/register-onboarding-ipc-handlers'

export default function registerIpcHandlers(onboardingCtx: OnboardingIpcContext) {
  registerRepositoriesIpcHandlers()
  registerGitIpcHandlers()
  registerTerminalIpcHandlers()
  registerFileIpcHandlers()
  registerThemeIpcHandlers()
  registerOnboardingIpcHandlers(onboardingCtx)
}
