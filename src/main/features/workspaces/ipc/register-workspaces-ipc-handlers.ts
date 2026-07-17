import { ipcMain } from 'electron'
import WorkspacesService from '../workspaces.service'
import { CHANNELS } from '@shared'

export default function registerWorkspacesIpcHandlers() {
  ipcMain.handle(CHANNELS.OPEN_WORKSPACE, WorkspacesService.openWorkspace)
}