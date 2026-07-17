import { dialog } from 'electron'
import GitService from '../git/git.service'

export default class WorkspacesService {
  public static async openWorkspace (): Promise<string | void> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    const selectedPath = filePaths[0]

    if (!canceled && await GitService.hasGit(selectedPath)) {
      return selectedPath
    }
  }
}