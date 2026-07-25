import registerWorkspacesIpcHandlers from '@main/features/workspaces/ipc/register-workspaces-ipc-handlers'
import registerGitIpcHandlers from '@main/features/git/ipc/register-git-ipc-handlers'

export default function registerIpcHandlers() {
  registerWorkspacesIpcHandlers()
  registerGitIpcHandlers()
}