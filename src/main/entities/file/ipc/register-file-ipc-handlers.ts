import { ipcMain, Menu, shell, clipboard, BrowserWindow } from 'electron'
import { join } from 'path'
import GitService from '@main/features/git/git.service'
import { sendToRenderer } from '@main/shared/send-to-renderer'
import { MAIN_EVENTS } from '@shared'

export default function registerFileIpcHandlers() {
  ipcMain.handle('file-context-menu', async (event, { path }: { path: string }) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    const absolutePath = GitService.basePath ? join(GitService.basePath, path) : path

    const menu = Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => shell.openPath(absolutePath),
      },
      {
        label: 'Reveal in Finder',
        click: () => shell.showItemInFolder(absolutePath),
      },
      { type: 'separator' },
      {
        label: 'Copy Path',
        click: () => clipboard.writeText(path),
      },
      { type: 'separator' },
      {
        label: 'Discard Changes',
        click: async () => {
          await GitService.discardFile(path)
          sendToRenderer(event.sender, MAIN_EVENTS.GIT_STATUS_CHANGED)
        },
      },
    ])

    menu.popup({ window: win })
  })
}
