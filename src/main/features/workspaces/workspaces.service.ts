import { dialog } from 'electron'
import GitService from '../git/git.service'
import { Storage } from '@main/shared/storage.service'
import type { Workspaces, Workspace } from '@shared'

export default class WorkspacesService {
  public static async getWorkspaces(): Promise<Workspaces> {
    return await Storage.get('workspaces') ?? []
  }

  public static async openWorkspace (): Promise<Workspace | void> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    const selectedPath = filePaths[0]

    if (!canceled && await GitService.hasGit(selectedPath)) {
      const workspaces = await Storage.get('workspaces') ?? []
      let existing = false
      workspaces.forEach(ws => {
        if (ws.path === selectedPath) {
          existing = true
        }
      })

      const workspaceName = selectedPath.split('/').at(-1)

      const newWorkspace = {
        path: selectedPath,
        name: workspaceName!
      }

      if (!existing) {
        await Storage.set('workspaces', [...workspaces, newWorkspace])
      }

      await Storage.set('active-workspace', selectedPath)
      return newWorkspace
    }
  }
}