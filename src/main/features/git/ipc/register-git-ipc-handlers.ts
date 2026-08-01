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
    [GIT_CHANNELS.GET_COMMITS]: async (_, args) => {
      return await GitService.getRawCommits(args)
    },
    [GIT_CHANNELS.GET_BRANCHES]: async () => {
      return await GitService.getBranches()
    },
    [GIT_CHANNELS.GET_STASHES]: async () => {
      return await GitService.getStashes()
    },
    [GIT_CHANNELS.CHECKOUT_BRANCH]: async (_, name) => {
      await GitService.checkoutBranch(name)
    },
    [GIT_CHANNELS.CREATE_BRANCH]: async (_, name) => {
      await GitService.createBranch(name)
    },
    [GIT_CHANNELS.PULL]: async () => {
      await git.pull()
    },
    [GIT_CHANNELS.PUSH]: async () => {
      await git.push()
    },
    [GIT_CHANNELS.FETCH]: async () => {
      await git.fetch()
    },
    [GIT_CHANNELS.GET_STATUS]: async () => {
      const status = await GitService.getInstance().status()
      return JSON.parse(JSON.stringify(status))
    },
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
