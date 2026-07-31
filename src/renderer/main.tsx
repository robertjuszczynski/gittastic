import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages'
import './app.css'
import { ModalProvider } from './contexts/ModalContext'
import { WorkspacesProvider } from './contexts/WorkspacesContext'

const queryClient = new QueryClient()

const router = createHashRouter([
  { path: '/', element: <Home /> },
])

createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={queryClient}>
    <WorkspacesProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </WorkspacesProvider>
  </QueryClientProvider>
)
