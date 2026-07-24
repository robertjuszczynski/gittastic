import { dialog } from 'electron'
import GitClient from '../git/git.client'
import { Storage } from '@main/shared/storage.service'
import type { Workspaces, Workspace } from '@shared'

export default class WorkspacesService {
  public static async getActiveWorkspace(): Promise<Workspace | undefined> {
    return await Storage.get('active-workspace')
  }

  public static async getWorkspaces(): Promise<Workspaces> {
    return await Storage.get('workspaces') ?? []
  }

  public static async openWorkspace (): Promise<Workspace | void> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    const selectedPath = filePaths[0]

    if (!canceled && await GitClient.hasGit(selectedPath)) {
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

      await Storage.set('active-workspace', newWorkspace)
      GitClient.init(selectedPath)
      return newWorkspace
    }
  }
}