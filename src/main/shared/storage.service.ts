import path from 'node:path'
import fs from 'node:fs'
import { readFile, writeFile, appendFile } from 'node:fs/promises'
import { app } from 'electron'
import { logger } from '@main/shared/logger'
import type { Repository, Repositories, Theme, TGitProvider, GitUser, FeatureName } from '@shared'

export const STORAGE_FILE_NAME = 'storage.json'
export const STORAGE_FILE_PATH = path.join(app.getPath('userData'), STORAGE_FILE_NAME)

type StorageFileContent = Partial<{
  'active-repository': Repository
  'repositories': Repositories
  'theme': Theme
  'onboarding-completed': boolean
  'features': Record<FeatureName, boolean>
  'git-provider': TGitProvider | null
  'git-provider-token': string
  'git-user': GitUser
}>

type StorageKey = keyof StorageFileContent;

export class Storage {
  public static async getAll(): Promise<StorageFileContent | undefined> {
      try {
        const result: StorageFileContent = JSON.parse(await readFile(STORAGE_FILE_PATH, { encoding: 'utf8'}))
        return result
      } catch {
        logger.error(`Failed to parse ${STORAGE_FILE_NAME}`)
        return undefined
      }
  }

  public static async get<K extends StorageKey>(key: K): Promise<StorageFileContent[K] | undefined> {
      try {
        const result: StorageFileContent = JSON.parse(await readFile(STORAGE_FILE_PATH, { encoding: 'utf8'}))
        return result[key]
      } catch {
        logger.error(`Failed to parse ${STORAGE_FILE_NAME}`)
        return undefined
      }
  }

  public static async set(key: StorageKey, value: StorageFileContent[StorageKey]) {
    const fileAlreadyCreated = fs.existsSync(STORAGE_FILE_PATH)

    if (!fileAlreadyCreated) {
      await appendFile(STORAGE_FILE_PATH, '{}')
    }

    const oldData = await this.getAll()
    const newData = JSON.stringify({
      ...oldData,
      [key]: value
    })

    try {
      await writeFile(STORAGE_FILE_PATH, newData)
    } catch (err) {
      logger.error(err)
    }
  }
}
