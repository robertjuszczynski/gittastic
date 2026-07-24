import type { SimpleGit } from 'simple-git'
import simpleGit from 'simple-git'

export default class GitClient {
  private static instance: SimpleGit | null = null

  public static init(path: string): void {
    this.instance = simpleGit(path)
  }

  public static getInstance(): SimpleGit {
    if (!this.instance) {
      throw new Error('GitClient not initialized. Call GitClient.init(path) first.')
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
}
