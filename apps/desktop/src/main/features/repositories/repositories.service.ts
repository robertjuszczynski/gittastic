import { dialog } from 'electron'
import GitService from '../git/git.service'
import { Storage } from '@main/shared/storage.service'
import type { Repositories, Repository } from '@shared'

export default class RepositoriesService {
  public static async getActiveRepository(): Promise<Repository | undefined> {
    return await Storage.get('active-repository')
  }

  public static async getRepositories(): Promise<Repositories> {
    return await Storage.get('repositories') ?? []
  }

  public static async setActiveRepository(repo: Repository) {
    await Storage.set('active-repository', repo)
    GitService.init(repo.path)
    return repo
  }

  public static async getGroups(): Promise<RepositoryGroups> {
    return await Storage.get('repository-groups') ?? []
  }

  public static async setGroups(groups: RepositoryGroups): Promise<RepositoryGroups> {
    await Storage.set('repository-groups', groups)
    return groups
  }
  public static async openRepository(): Promise<Repository | void> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    const selectedPath = filePaths[0]

    if (!canceled && await GitService.hasGit(selectedPath)) {
      const repositories = await Storage.get('repositories') ?? []
      let existing = false
      repositories.forEach(repo => {
        if (repo.path === selectedPath) {
          existing = true
        }
      })

      const repoName = selectedPath.split('/').at(-1)

      const newRepository = {
        path: selectedPath,
        name: repoName!
      }

      if (!existing) {
        await Storage.set('repositories', [...repositories, newRepository])
      }

      await Storage.set('active-repository', newRepository)
      GitService.init(selectedPath)
      return newRepository
    }
  }

}
