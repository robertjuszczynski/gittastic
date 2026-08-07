import { ipcMain, Menu, shell, clipboard, BrowserWindow } from 'electron'
import { join } from 'path'
import GitService from '@main/features/git/git.service'
import { sendToRenderer } from '@main/shared/send-to-renderer'
import { buildMenuTemplate } from '@main/shared/menu-builder'
import { CHANNELS, type FileChangeStatus, MAIN_EVENTS } from '@shared'

export default function registerFileIpcHandlers() {
  ipcMain.handle(CHANNELS.OPEN_FILE_CONTEXT_MENU, async (event, { path, status }: { path: string; status: FileChangeStatus }) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    const absolutePath = GitService.basePath ? join(GitService.basePath, path) : path
    const canDiscard = status !== 'added' && status !== 'untracked'
    const isUntrackedFile = status === 'untracked'

    const menu = Menu.buildFromTemplate(buildMenuTemplate([
      { label: 'Open', click: () => shell.openPath(absolutePath) },
      { label: 'Reveal in Finder', click: () => shell.showItemInFolder(absolutePath) },
      { type: 'separator' },
      { label: 'Copy Path', click: () => clipboard.writeText(absolutePath) },
      { type: 'separator', visible: canDiscard },
      {
        label: 'Discard Changes',
        visible: canDiscard,
        click: async () => {
          await GitService.discardFile(path)
          sendToRenderer(event.sender, MAIN_EVENTS.GIT_STATUS_CHANGED)
        },
      },
      {
        label: 'Remove untracked file',
        visible: isUntrackedFile,
        click: async () => {
          await GitService.removeUntrackedFile(path)
          sendToRenderer(event.sender, MAIN_EVENTS.GIT_STATUS_CHANGED)
        }
      }
    ]))

    menu.popup({ window: win })
  })
}
