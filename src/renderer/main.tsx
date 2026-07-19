import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import Home from './pages'
import './app.css'
import { ModalProvider } from './contexts/ModalContext'
import { WorkspacesProvider } from './contexts/WorkspacesContext'

const router = createHashRouter([
  { path: '/', element: <Home /> },
])

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <WorkspacesProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </WorkspacesProvider>
  </StrictMode>
)
