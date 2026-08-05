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
    [GIT_CHANNELS.GET_COMMIT_FILES]: async (_, hash) => {
      return await GitService.getCommitFiles(hash)
    },
    [GIT_CHANNELS.STAGE_ALL]: async () => {
      await GitService.stageAll()
    },
    [GIT_CHANNELS.UNSTAGE_ALL]: async () => {
      await GitService.unstageAll()
    },
    [GIT_CHANNELS.STAGE_FOLDER]: async (_, path) => {
      await GitService.stageFolder(path)
    },
    [GIT_CHANNELS.UNSTAGE_FOLDER]: async (_, path) => {
      await GitService.unstageFolder(path)
    },
    [GIT_CHANNELS.STAGE_LINE]: async (_, args) => {
      await GitService.setLineStagedState(args.path, args.lineNumber, args.isAddition, true)
    },
    [GIT_CHANNELS.UNSTAGE_LINE]: async (_, args) => {
      await GitService.setLineStagedState(args.path, args.lineNumber, args.isAddition, false)
    },
    [GIT_CHANNELS.GET_FILE_DIFF]: async (_, args) => {
      return await GitService.getFileDiff(args.path, args.hash)
    },
    [GIT_CHANNELS.COMMIT]: async (_, args) => {
      await GitService.commit(args.message, args.description)
    },
    [GIT_CHANNELS.GET_USER]: async () => {
      return await GitService.getUser()
    },
    [GIT_CHANNELS.STAGE_FILE]: async (_, path) => {
      await GitService.stageFile(path)
    },
    [GIT_CHANNELS.UNSTAGE_FILE]: async (_, path) => {
      await GitService.unstageFile(path)
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
    [GIT_CHANNELS.STASH]: async () => {
      await GitService.stash()
    },
    [GIT_CHANNELS.POP_STASH]: async () => {
      await GitService.popStash()
    },
    [GIT_CHANNELS.UNDO]: async () => {
      await GitService.undo()
    },
    [GIT_CHANNELS.REDO]: async () => {
      await GitService.redo()
    },
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
