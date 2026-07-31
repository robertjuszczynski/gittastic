import registerRepositoriesIpcHandlers from '@main/features/repositories/ipc/register-repositories-ipc-handlers'
import registerGitIpcHandlers from '@main/features/git/ipc/register-git-ipc-handlers'

export default function registerIpcHandlers() {
  registerRepositoriesIpcHandlers()
  registerGitIpcHandlers()
}
