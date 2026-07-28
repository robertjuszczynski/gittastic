import type { SimpleGit } from 'simple-git'
import simpleGit from 'simple-git'
import { GitRawCommits } from 'src/shared/types/git.types'

export default class GitService {
  private static instance: SimpleGit | null = null

  public static init(path: string): void {
    this.instance = simpleGit(path)
  }

  public static getInstance(): SimpleGit {
    if (!this.instance) {
      throw new Error('GitService not initialized. Call GitService.init(path) first.')
    }
    return this.instance
  }

  public static async hasGit(path: string): Promise<boolean> {
    try {
      await simpleGit(path).status()
      return true
    } catch {
      return false
    }
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }

  public static async getRawCommits(): Promise<GitRawCommits> {
    const raw = await git.raw(['log', '--all', '--pretty=format:%H|%P|%an|%aI|%s'])
    return raw.trim().split('\n').map(line => {
      const [hash, parents, author_name, date, ...messageParts] = line.split('|')
      return {
        hash,
        parents: parents ? parents.split(' ') : [],
        author_name,
        date,
        message: messageParts.join('|'),
      }
    })
  }
}

export const git = new Proxy({} as SimpleGit, {
    get: (_, prop) => GitService.getInstance()[prop as keyof SimpleGit]
  })
