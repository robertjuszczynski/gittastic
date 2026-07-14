import { createHashRouter } from 'react-router'
import Home from './pages/home'

export const router = createHashRouter([
  { path: '/', element: <Home /> },
])
