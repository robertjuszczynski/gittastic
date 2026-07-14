import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import Home from './pages/home'
import './app.css'

const router = createHashRouter([
  { path: '/', element: <Home /> },
])

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
