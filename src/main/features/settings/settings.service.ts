import { BrowserWindow, Menu, app } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import type { Theme } from '@shared'
import { MAIN_EVENTS } from '@shared'
import { nativeTheme } from 'electron/main'
import { Storage } from '@main/shared/storage.service'

export class SettingsService {
  private static window: BrowserWindow | null = null

  private static broadcastTheme(): void {
    const isDark = nativeTheme.shouldUseDarkColors
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(MAIN_EVENTS.THEME_UPDATED, isDark)
    })
  }

  static open(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.focus()
      return
    }

    this.window = new BrowserWindow({
      width: 750,
      show: false,
      height: 520,
      resizable: false,
      title: 'Settings',
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#0d0e11' : '#ffffff',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    })
    
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/app/renderer/index.html#/settings`)
    } else {
      this.window.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/settings' })
    }

    this.window.on('ready-to-show', () => this.window!.show())

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
            label: 'Settings...',
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

  public static async getTheme(): Promise<{ isDark: boolean; theme: Theme }> {
    return {
      isDark: nativeTheme.shouldUseDarkColors,
      theme: nativeTheme.themeSource as Theme,
    }
  }

  public static async applyTheme(theme: Theme) {
    nativeTheme.themeSource = theme
  }

  public static async setTheme(theme: Theme) {
    nativeTheme.themeSource = theme
    await Storage.set('theme', theme)
    this.broadcastTheme()
    return nativeTheme.shouldUseDarkColors
  }
}
