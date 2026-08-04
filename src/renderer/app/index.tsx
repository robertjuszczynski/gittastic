import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RepositoriesProvider } from '@renderer/entities/repository/model/RepositoriesContext'
import { ModalProvider } from '@renderer/shared/ui/ModalContext'
import { router } from './router'
import './styles.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={queryClient}>
    <RepositoriesProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </RepositoriesProvider>
  </QueryClientProvider>
)
