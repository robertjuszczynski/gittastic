import type { SimpleGit } from 'simple-git'
import simpleGit from 'simple-git'

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
}

export const git = new Proxy({} as SimpleGit, {
    get: (_, prop) => GitService.getInstance()[prop as keyof SimpleGit]
  })
