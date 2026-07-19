import path from 'node:path'
import fs from 'node:fs'
import { readFile, writeFile, appendFile } from 'node:fs/promises'
import { app } from 'electron'
import { logger } from '@main/shared/logger'

export const STORAGE_FILE_NAME = 'storage.json'
export const STORAGE_FILE_PATH = path.join(app.getPath('userData'), STORAGE_FILE_NAME)

type StorageFileContent = Partial<{
  'active-workspace': string
  'workspaces': string[]
}>

type StorageKey = keyof StorageFileContent;

export class Storage {
  public static async get(): Promise<StorageFileContent>
  public static async get<K extends StorageKey>(key: K): Promise<StorageFileContent[K]>
  public static async get(key?: StorageKey): Promise<StorageFileContent | StorageFileContent[StorageKey]> {
    if (!fs.existsSync(STORAGE_FILE_PATH)) return key ? undefined : {}

    try {
      const result: StorageFileContent = JSON.parse(await readFile(STORAGE_FILE_PATH, { encoding: 'utf8'}))
      return key ? result[key] : result
    } catch {
      logger.error(`Failed to parse ${STORAGE_FILE_NAME}`)
      return key ? undefined : {}
    }
  }
  
  public static async set(key: StorageKey, value: StorageFileContent[StorageKey]) {
    const fileAlreadyCreated = fs.existsSync(STORAGE_FILE_PATH)

    if (!fileAlreadyCreated) {
      await appendFile(STORAGE_FILE_PATH, '{}')
    }

    const oldData = await this.get()
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