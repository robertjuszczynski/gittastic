import { BrowserWindow, Menu, app, dialog, shell } from 'electron'
import { join, basename, extname } from 'node:path'
import { mkdir, readdir, readFile, copyFile, unlink } from 'node:fs/promises'
import { existsSync, watch, type FSWatcher } from 'node:fs'
import { is } from '@electron-toolkit/utils'
import type { ThemeDefinition, ThemeId, ThemeJSON, ThemeTokens } from '@shared'
import { MAIN_EVENTS, BUILT_IN_THEMES, BUILT_IN_THEME_MAP, gitasticLight, gitasticDark } from '@shared'
import { nativeTheme } from 'electron/main'
import { Storage } from '@main/shared/storage.service'

const THEMES_DIR = join(app.getPath('userData'), 'themes')

const LEGACY_THEME_MAP: Record<string, ThemeId> = {
  light: 'gitastic-light',
  dark: 'gitastic-dark',
  system: 'system',
}

function mergeTokens(base: ThemeTokens, override: ThemeJSON): ThemeTokens {
  return {
    colors: { ...base.colors, ...override.colors },
    fonts: override.fonts ? { ...base.fonts, ...override.fonts } : base.fonts,
    components: override.components
      ? {
          ...base.components,
          ...Object.fromEntries(
            Object.entries(override.components).map(([k, v]) => [
              k,
              { ...(base.components as any)?.[k], ...(v as any) },
            ])
          ),
        }
      : base.components,
    extras: override.extras ? { ...base.extras, ...override.extras } : base.extras,
  }
}

async function parseCustomTheme(filePath: string): Promise<ThemeDefinition | null> {
  try {
    const raw = await readFile(filePath, 'utf-8')
    const json: ThemeJSON = JSON.parse(raw)
    const id = basename(filePath, extname(filePath))
    const baseTheme = BUILT_IN_THEME_MAP.get(json.base ?? 'gitastic-light') ?? gitasticLight
    return {
      id,
      name: json.name ?? id,
      tokens: mergeTokens(baseTheme.tokens, json),
      isCustom: true,
      filePath,
    }
  } catch {
    return null
  }
}

export class SettingsService {
  private static window: BrowserWindow | null = null
  private static activeThemeId: ThemeId = 'gitastic-light'
  private static customThemes: ThemeDefinition[] = []
  private static watcher: FSWatcher | null = null

  static async initialize(): Promise<void> {
    await mkdir(THEMES_DIR, { recursive: true })
    this.customThemes = await this.loadCustomThemes()

    const stored = await Storage.get('theme')
    const migrated: ThemeId = stored ? (LEGACY_THEME_MAP[stored] ?? stored) as ThemeId : 'gitastic-light'
    if (migrated !== stored) await Storage.set('theme', migrated)

    this.activeThemeId = migrated
    this.applySystemThemeIfNeeded()
  }

  private static applySystemThemeIfNeeded(): void {
    nativeTheme.themeSource = this.activeThemeId === 'system' ? 'system' : 'light'
  }

  private static async loadCustomThemes(): Promise<ThemeDefinition[]> {
    try {
      const files = await readdir(THEMES_DIR)
      const results = await Promise.all(
        files
          .filter(f => f.endsWith('.json'))
          .map(f => parseCustomTheme(join(THEMES_DIR, f)))
      )
      return results.filter((t): t is ThemeDefinition => t !== null)
    } catch {
      return []
    }
  }

  private static resolveActiveDefinition(): ThemeDefinition {
    if (this.activeThemeId === 'system') {
      return nativeTheme.shouldUseDarkColors ? gitasticDark : gitasticLight
    }
    return (
      BUILT_IN_THEME_MAP.get(this.activeThemeId) ??
      this.customThemes.find(t => t.id === this.activeThemeId) ??
      gitasticLight
    )
  }

  private static broadcastTheme(): void {
    const definition = this.resolveActiveDefinition()
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(MAIN_EVENTS.THEME_UPDATED, definition)
    })
  }

  private static broadcastCustomThemes(): void {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(MAIN_EVENTS.CUSTOM_THEMES_CHANGED, this.customThemes)
    })
  }

  private static watchActiveTheme(): void {
    this.watcher?.close()
    this.watcher = null

    const active = this.customThemes.find(t => t.id === this.activeThemeId)
    if (!active?.filePath) return

    let debounce: ReturnType<typeof setTimeout> | null = null
    this.watcher = watch(active.filePath, () => {
      if (debounce) clearTimeout(debounce)
      debounce = setTimeout(async () => {
        const updated = await parseCustomTheme(active.filePath!)
        if (!updated) return
        this.customThemes = this.customThemes.map(t => t.id === updated.id ? updated : t)
        this.broadcastTheme()
      }, 150)
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
    this.window.on('closed', () => { this.window = null })
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

  static getThemes(): ThemeDefinition[] {
    return [...BUILT_IN_THEMES, ...this.customThemes]
  }

  static getActiveTheme(): ThemeDefinition {
    return this.resolveActiveDefinition()
  }

  static async setTheme(id: ThemeId): Promise<ThemeDefinition> {
    this.activeThemeId = id
    await Storage.set('theme', id)
    this.applySystemThemeIfNeeded()
    this.watchActiveTheme()
    this.broadcastTheme()
    return this.resolveActiveDefinition()
  }

  static async importTheme(): Promise<ThemeDefinition | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Import Theme',
      filters: [{ name: 'Gitastic Theme', extensions: ['json'] }],
      properties: ['openFile'],
    })
    if (canceled || !filePaths[0]) return null

    const src = filePaths[0]
    const dest = join(THEMES_DIR, basename(src))
    await copyFile(src, dest)

    const theme = await parseCustomTheme(dest)
    if (!theme) return null

    this.customThemes = [
      ...this.customThemes.filter(t => t.id !== theme.id),
      theme,
    ]
    this.broadcastCustomThemes()
    return theme
  }

  static async deleteCustomTheme(id: ThemeId): Promise<void> {
    const theme = this.customThemes.find(t => t.id === id)
    if (!theme?.filePath) return

    if (existsSync(theme.filePath)) await unlink(theme.filePath)
    this.customThemes = this.customThemes.filter(t => t.id !== id)

    if (this.activeThemeId === id) {
      await this.setTheme('gitastic-light')
    } else {
      this.broadcastCustomThemes()
    }
  }

  static async openThemesFolder(): Promise<void> {
    await shell.openPath(THEMES_DIR)
  }
}
