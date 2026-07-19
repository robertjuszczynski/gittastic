import { dialog } from 'electron'
import GitService from '../git/git.service'
import { Storage } from '@main/shared/storage.service'

export default class WorkspacesService {
  public static async getWorkspaces(): Promise<string[]> {
    return await Storage.get('workspaces') ?? []
  }

  public static async openWorkspace (): Promise<string | void> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    const selectedPath = filePaths[0]

    if (!canceled && await GitService.hasGit(selectedPath)) {
      const existing = await Storage.get('workspaces') ?? []
      if (!existing.includes(selectedPath)) {
        await Storage.set('workspaces', [...existing, selectedPath])
      }
      await Storage.set('active-workspace', selectedPath)
      return selectedPath
    }
  }
}