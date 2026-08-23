import { useEffect } from 'react'
import { Palette } from 'lucide-react'
import React from 'react'
import { useThemeStore } from '../model/useThemeStore'
import { useCommandPaletteStore } from '@renderer/widgets/command-palette'

export function useThemeCommands() {
  const availableThemes = useThemeStore(s => s.availableThemes)
  const switchTheme = useThemeStore(s => s.switchTheme)
  const { registerCommands } = useCommandPaletteStore()

  useEffect(() => {
    const themeCommands = availableThemes.map(theme => ({
      id: `theme.switch.${theme.id}`,
      label: `Theme: ${theme.name}`,
      section: 'Appearance',
      icon: React.createElement(Palette, { size: 14 }),
      execute: () => switchTheme(theme.id),
    }))

    const utilCommands = [
      {
        id: 'theme.open-settings',
        label: 'Open Theme Settings',
        section: 'Appearance',
        icon: React.createElement(Palette, { size: 14 }),
        execute: () => window.electron.OPEN_THEMES_FOLDER(),
        keywords: ['appearance', 'theme', 'settings'],
      },
      {
        id: 'theme.open-folder',
        label: 'Open Themes Folder',
        section: 'Appearance',
        execute: () => window.electron.OPEN_THEMES_FOLDER(),
        keywords: ['themes', 'folder', 'custom'],
      },
      {
        id: 'theme.import',
        label: 'Import Theme…',
        section: 'Appearance',
        execute: async () => {
          const { setAvailableThemes, updateCustomThemes } = useThemeStore.getState()
          const imported = await window.electron.IMPORT_THEME()
          if (imported) {
            const themes = await window.electron.GET_THEMES()
            setAvailableThemes(themes)
          }
        },
        keywords: ['import', 'theme', 'custom', 'json'],
      },
    ]

    return registerCommands([...themeCommands, ...utilCommands])
  }, [availableThemes, switchTheme, registerCommands])
}
