import registerRepositoriesIpcHandlers from '@main/features/repositories/ipc/register-repositories-ipc-handlers'
import registerGitIpcHandlers from '@main/features/git/ipc/register-git-ipc-handlers'
import registerTerminalIpcHandlers from '@main/features/terminal/ipc/register-terminal-ipc-handlers'
import registerFileIpcHandlers from '@main/entities/file/ipc/register-file-ipc-handlers'
import registerSettingsIpcHandlers from '@main/features/settings/ipc/register-settings-ipc-handlers'

export default function registerIpcHandlers() {
  registerRepositoriesIpcHandlers()
  registerGitIpcHandlers()
  registerTerminalIpcHandlers()
  registerFileIpcHandlers()
  registerSettingsIpcHandlers()
}
