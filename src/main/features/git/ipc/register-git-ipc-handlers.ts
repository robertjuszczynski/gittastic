import { ipcMain } from 'electron'
import { GIT_CHANNELS, type CHANNELS, type IEvents } from '@shared'
import GitService, { git } from '../git.service'

type GitIpcHandlers = {
  [K in keyof typeof GIT_CHANNELS]: (
    event: Electron.IpcMainInvokeEvent,
    args: IEvents[typeof CHANNELS[K]]['args']
  ) => IEvents[typeof CHANNELS[K]]['response']
}

export default function registerGitIpcHandlers() {
  const handlers: GitIpcHandlers = {
    [GIT_CHANNELS.GET_COMMITS]: async () => {
      if (!GitService.isInitialized()) return { all: [], latest: null, total: 0 }
      return await git.log()
    },
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
