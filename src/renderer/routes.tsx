import { createHashRouter } from 'react-router'
import Home from './pages'
import Settings from './pages/settings'

export const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '/settings', element: <Settings /> },
])
