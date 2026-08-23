import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RepositoriesProvider } from '@renderer/entities/repository/model/RepositoriesContext'
import { ModalProvider } from '@renderer/shared/ui/ModalContext'
import { CommandPalette, registerCommands } from '@renderer/widgets/command-palette'
import { router } from './router'
import './styles.css'

window.electron.GET_THEME().then(({ isDark }) => {
  document.documentElement.classList.toggle('dark', isDark)
})

window.appEventsAPI.onThemeUpdated((isDark) => {
  document.documentElement.classList.toggle('dark', isDark)
})

registerCommands([
  {
    id: 'placeholder.example',
    label: 'Example placeholder',
    description: 'Replace this with real commands',
    section: 'General',
    execute: () => {},
  },
])

const queryClient = new QueryClient()

createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={queryClient}>
    <RepositoriesProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
      <CommandPalette />
    </RepositoriesProvider>
  </QueryClientProvider>
)
