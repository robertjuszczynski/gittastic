import { useThemeStore } from '../model/useThemeStore'

export function useTheme() {
  const activeTheme = useThemeStore(s => s.activeTheme)
  const availableThemes = useThemeStore(s => s.availableThemes)
  const switchTheme = useThemeStore(s => s.switchTheme)
  return { activeTheme, availableThemes, switchTheme }
}
