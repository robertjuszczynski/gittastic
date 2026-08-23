import { dialog, shell, type BrowserWindow } from 'electron'
import { ENV } from '@shared/config/env'
import { type FeatureName, type GitUser, type TGitProvider } from '@shared'
import { Storage } from '@main/shared/storage.service'
import GitService from '@main/features/git/git.service'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import simpleGit from 'simple-git'

export type TCompletePayload = {
  features: Record<FeatureName, boolean>
  provider: TGitProvider | null
  gitUser: GitUser
  repoPath: string | null
}

export class OnboardingService {
  public static async complete(data: TCompletePayload): Promise<void> {
    await Storage.set('onboarding-completed', true)
    await Storage.set('features', data.features)
    await Storage.set('git-provider', data.provider)
    await Storage.set('git-user', data.gitUser)
    if (data.gitUser.name || data.gitUser.email) {
      try {
        await simpleGit().addConfig('user.name', data.gitUser.name, false, 'global')
        await simpleGit().addConfig('user.email', data.gitUser.email, false, 'global')
      } catch {}
    }
    if (data.repoPath) {
      const name = data.repoPath.split('/').at(-1)!
      const repo = { path: data.repoPath, name }
      const repositories = await Storage.get('repositories') ?? []
      if (!repositories.some(r => r.path === data.repoPath)) {
        await Storage.set('repositories', [...repositories, repo])
      }
      await Storage.set('active-repository', repo)
      GitService.init(data.repoPath)
    }
  }

  public static animateResize(win: BrowserWindow, targetW: number, targetH: number): void {
    const [startW, startH] = win.getSize()
    const frames = 15
    const duration = 220
    const step = duration / frames
    let frame = 0
    const iv = setInterval(() => {
      frame++
      const t = frame / frames
      const ease = 1 - Math.pow(1 - t, 3)
      const w = Math.round(startW + (targetW - startW) * ease)
      const h = Math.round(startH + (targetH - startH) * ease)
      win.setSize(w, h, false)
      if (frame >= frames) clearInterval(iv)
    }, step)
  }

  public static async openRepository(): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (canceled || !filePaths[0]) return null
    return (await GitService.hasGit(filePaths[0])) ? filePaths[0] : null
  }

  public static async pickFolder(): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return canceled ? null : (filePaths[0] ?? null)
  }

  public static async createRepository(name: string, parentPath: string, readme: boolean): Promise<string> {
    const repoPath = join(parentPath, name)
    await mkdir(repoPath, { recursive: true })
    await simpleGit(repoPath).init()
    if (readme) await writeFile(join(repoPath, 'README.md'), `# ${name}\n`)
    return repoPath
  }

  public static startGithubAuth(): void {
    const url = `https://github.com/login/oauth/authorize?client_id=${ENV.GITHUB_CLIENT_ID}&scope=repo,user&redirect_uri=gittastic://oauth/callback`
    shell.openExternal(url)
  }
}
