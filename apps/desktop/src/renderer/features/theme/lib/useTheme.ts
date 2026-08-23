import { useThemeStore } from '../model/useThemeStore'

export function useTheme() {
  return useThemeStore(s => ({
    activeTheme: s.activeTheme,
    availableThemes: s.availableThemes,
    switchTheme: s.switchTheme,
  }))
}
