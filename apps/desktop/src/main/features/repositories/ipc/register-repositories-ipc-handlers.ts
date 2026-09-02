import { ipcMain } from 'electron'
import RepositoriesService from '../repositories.service'
import { type REPOSITORY_CHANNELS, CHANNELS, type IEvents } from '@shared'

type RepositoriesIpcHandlers = {
  [K in keyof typeof REPOSITORY_CHANNELS]: (
    event: Electron.IpcMainInvokeEvent,
    args: IEvents[typeof CHANNELS[K]]['args']
  ) => IEvents[typeof CHANNELS[K]]['response']
}

export default function registerRepositoriesIpcHandlers() {
  const handlers: RepositoriesIpcHandlers = {
    [CHANNELS.OPEN_REPOSITORY]: () => RepositoriesService.openRepository(),
    [CHANNELS.GET_REPOSITORIES]: () => RepositoriesService.getRepositories(),
    [CHANNELS.GET_ACTIVE_REPOSITORY]: () => RepositoriesService.getActiveRepository(),
    [CHANNELS.SET_ACTIVE_REPOSITORY]: (_, args) => RepositoriesService.setActiveRepository(args),
    [CHANNELS.REMOVE_REPOSITORY]: (_, args) => RepositoriesService.removeRepository(args),
    [CHANNELS.GET_REPOSITORY_GROUPS]: () => RepositoriesService.getGroups(),
    [CHANNELS.SET_REPOSITORY_GROUPS]: (_, args) => RepositoriesService.setGroups(args),
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
