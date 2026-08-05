import { ipcMain } from 'electron'
import { TERMINAL_CHANNELS } from '@shared'
import terminalManager from '../terminal-manager'
import RepositoriesService from '@main/features/repositories/repositories.service'
import os from 'os'

export default function registerTerminalIpcHandlers() {
  ipcMain.handle(TERMINAL_CHANNELS.TERMINAL_CREATE, async (event) => {
    const repo = await RepositoriesService.getActiveRepository()
    const cwd = repo?.path ?? os.homedir()
    terminalManager.spawn(cwd, (data) => {
      if (!event.sender.isDestroyed()) {
        event.sender.send(TERMINAL_CHANNELS.TERMINAL_OUTPUT, data)
      }
    })
  })

  ipcMain.handle(TERMINAL_CHANNELS.TERMINAL_DESTROY, () => {
    terminalManager.kill()
  })

  ipcMain.on(TERMINAL_CHANNELS.TERMINAL_INPUT, (_, data: string) => {
    terminalManager.write(data)
  })

  ipcMain.on(TERMINAL_CHANNELS.TERMINAL_RESIZE, (_, { cols, rows }: { cols: number; rows: number }) => {
    terminalManager.resize(cols, rows)
  })
}
