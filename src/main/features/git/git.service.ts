import fs from 'node:fs/promises'
import { GIT_FILE } from './constants'

export default class GitService {
  public static async hasGit(path: string) {
    const files = await fs.readdir(path)

    for (const file of files)
      if (file === GIT_FILE) {
        return true
      }

      return false
    }
}