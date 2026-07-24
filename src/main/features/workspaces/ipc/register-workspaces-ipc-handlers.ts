import { ipcMain } from 'electron'
import WorkspacesService from '../workspaces.service'
import { CHANNELS, type IEvents } from '@shared'

type WorkspacesIpcHandlers = {
  [K in keyof typeof CHANNELS]: (
    event: Electron.IpcMainInvokeEvent,
    args: IEvents[typeof CHANNELS[K]]['args']
  ) => IEvents[typeof CHANNELS[K]]['response']
}

export default function registerWorkspacesIpcHandlers() {
  const handlers: WorkspacesIpcHandlers = {
    [CHANNELS.OPEN_WORKSPACE]: () => WorkspacesService.openWorkspace(),
    [CHANNELS.GET_WORKSPACES]: () => WorkspacesService.getWorkspaces(),
    [CHANNELS.GET_ACTIVE_WORKSPACE]: () => WorkspacesService.getActiveWorkspace(),
    [CHANNELS.SET_ACTIVE_WORKSPACE]: (_, args) => WorkspacesService.setActiveWorkspace(args),
  }

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
