import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RepositoriesProvider } from '@renderer/entities/repository/model/RepositoriesContext'
import { ModalProvider } from '@renderer/shared/ui/ModalContext'
import { CommandPalette } from '@renderer/widgets/command-palette'
import { useThemeStore } from '@renderer/features/theme'
import { useThemeCommands } from '@renderer/features/theme/lib/useThemeCommands'
import { router } from './router'
import './styles.css'

async function initTheme() {
  const { setActiveTheme, setAvailableThemes, updateCustomThemes } = useThemeStore.getState()

  const [themes, activeTheme] = await Promise.all([
    window.electron.GET_THEMES(),
    window.electron.GET_ACTIVE_THEME(),
  ])

  setAvailableThemes(themes)
  setActiveTheme(activeTheme)

  window.appEventsAPI.onThemeUpdated((theme) => {
    setActiveTheme(theme)
  })

  window.appEventsAPI.onCustomThemesChanged((customThemes) => {
    updateCustomThemes(customThemes)
  })
}

initTheme()

const queryClient = new QueryClient()

function AppShell() {
  useThemeCommands()
  return (
    <>
      <RouterProvider router={router} />
      <CommandPalette />
    </>
  )
}

createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={queryClient}>
    <RepositoriesProvider>
      <ModalProvider>
        <AppShell />
      </ModalProvider>
    </RepositoriesProvider>
  </QueryClientProvider>
)
