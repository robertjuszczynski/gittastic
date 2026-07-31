import { createHash } from 'crypto'
import type { SimpleGit } from 'simple-git'
import simpleGit from 'simple-git'
import type { GitBranch, GitRawCommits, GitStash } from 'src/shared/types/git.types'

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

  public static async getRawCommits(options?: { limit?: number; skip?: number }): Promise<GitRawCommits> {
    const args = ['log', '--all', '--pretty=format:%H|%P|%an|%ae|%aI|%s']
    if (options?.limit) args.push(`--max-count=${options.limit}`)
    if (options?.skip) args.push(`--skip=${options.skip}`)
    const raw = await git.raw(args)
    return raw.trim().split('\n').filter(Boolean).map(line => {
      const [hash, parents, author_name, author_email, date, ...messageParts] = line.split('|')
      const emailHash = createHash('md5').update(author_email.trim().toLowerCase()).digest('hex')
      return {
        hash,
        parents: parents ? parents.split(' ') : [],
        author_name,
        date,
        message: messageParts.join('|'),
        avatar_url: `https://www.gravatar.com/avatar/${emailHash}?s=32&d=404`,
      }
    })
  }

  public static async getBranches(): Promise<GitBranch[]> {
    const summary = await this.getInstance().branch()
    return summary.all
      .filter(name => !name.startsWith('remotes/'))
      .map(name => ({ name, current: name === summary.current }))
  }

  public static async getStashes(): Promise<GitStash[]> {
    const list = await this.getInstance().stashList()
    return list.all.map((entry, i) => ({
      index: i,
      message: entry.message,
    }))
  }

  public static async checkoutBranch(name: string): Promise<void> {
    await this.getInstance().checkout(name)
  }

  public static async createBranch(name: string): Promise<void> {
    await this.getInstance().checkoutLocalBranch(name)
  }
}

export const git = new Proxy({} as SimpleGit, {
    get: (_, prop) => GitService.getInstance()[prop as keyof SimpleGit]
  })
