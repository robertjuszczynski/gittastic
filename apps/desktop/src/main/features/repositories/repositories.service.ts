import { dialog } from 'electron'
import GitService from '../git/git.service'
import { Storage } from '@main/shared/storage.service'
import { NotGitRepositoryError, type Repositories, type Repository, type RepositoryGroups } from '@shared'

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

  public static async removeRepository(path: string): Promise<void> {
    const repositories = await Storage.get('repositories') ?? []
    await Storage.set('repositories', repositories.filter(r => r.path !== path))
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

    if (canceled) return

    const selectedPath = filePaths[0]

    if (!await GitService.hasGit(selectedPath)) {
      throw new NotGitRepositoryError('Selected folder is not a git repository')
    }

    const repositories = await Storage.get('repositories') ?? []
    const newRepository: Repository = { path: selectedPath, name: selectedPath.split('/').at(-1)! }

    if (!repositories.some(r => r.path === selectedPath)) {
      await Storage.set('repositories', [...repositories, newRepository])
    }

    await Storage.set('active-repository', newRepository)
    GitService.init(selectedPath)
    return newRepository
  }

}
