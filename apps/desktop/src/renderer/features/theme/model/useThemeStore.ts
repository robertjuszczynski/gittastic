import { create } from 'zustand'
import type { ThemeDefinition, ThemeId } from '@shared'
import { injectTheme } from '@renderer/shared/lib/theme'

type ThemeStore = {
  activeTheme: ThemeDefinition | null
  availableThemes: ThemeDefinition[]
  setActiveTheme: (theme: ThemeDefinition) => void
  setAvailableThemes: (themes: ThemeDefinition[]) => void
  updateCustomThemes: (customThemes: ThemeDefinition[]) => void
  switchTheme: (id: ThemeId) => Promise<void>
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  activeTheme: null,
  availableThemes: [],

  setActiveTheme: (theme) => {
    injectTheme(theme.tokens)
    set({ activeTheme: theme })
  },

  setAvailableThemes: (themes) => set({ availableThemes: themes }),

  updateCustomThemes: (customThemes) => {
    set(state => ({
      availableThemes: [
        ...state.availableThemes.filter(t => !t.isCustom),
        ...customThemes,
      ],
    }))
  },

  switchTheme: async (id) => {
    const theme = await window.electron.SET_THEME(id)
    get().setActiveTheme(theme)
  },
}))
