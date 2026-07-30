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
      if (!GitService.isInitialized()) return []
      return await GitService.getRawCommits()
    },
    [GIT_CHANNELS.PULL]: async () => {
      if (!GitService.isInitialized()) return
      git.pull()
    },
    [GIT_CHANNELS.PUSH]: async () => {
      if (!GitService.isInitialized()) return
      git.push()
    },
    [GIT_CHANNELS.FETCH]: async () => {
      if (!GitService.isInitialized()) return
      git.fetch()
    },
    [GIT_CHANNELS.GET_STATUS]: async () => {
      if (!GitService.isInitialized()) return null
      const status = await GitService.getInstance().status()
      return JSON.parse(JSON.stringify(status))
    }
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
