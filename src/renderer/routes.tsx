import { createHashRouter } from 'react-router'
import Home from './pages'

export const router = createHashRouter([
  { path: '/', element: <Home /> },
])
