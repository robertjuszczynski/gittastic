import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages'
import './app.css'
import { ModalProvider } from './contexts/ModalContext'
import { RepositoriesProvider } from './contexts/RepositoriesContext'

const queryClient = new QueryClient()

const router = createHashRouter([
  { path: '/', element: <Home /> },
])

createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={queryClient}>
    <RepositoriesProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </RepositoriesProvider>
  </QueryClientProvider>
)
