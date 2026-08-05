import { BrowserWindow, Menu, app } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'

export class SettingsService {
  private static window: BrowserWindow | null = null

  static open(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.focus()
      return
    }

    this.window = new BrowserWindow({
      width: 750,
      height: 520,
      resizable: false,
      title: 'Settings',
      webPreferences: {
        preload: join(__dirname, '../../preload/index.js'),
        sandbox: false,
      },
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/app/renderer/index.html#/settings`)
    } else {
      this.window.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/settings' })
    }

    this.window.on('closed', () => {
      this.window = null
    })
  }

  static buildMenu(): void {
    const menu = Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          {
            label: 'Preferences...',
            accelerator: 'CmdOrCtrl+,',
            click: () => SettingsService.open(),
          },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' },
        ],
      },
    ])
    Menu.setApplicationMenu(menu)
  }
}
