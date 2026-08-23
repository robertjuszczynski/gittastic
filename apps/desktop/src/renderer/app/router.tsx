import React from 'react'
import { createHashRouter } from 'react-router'
import HomePage from '@renderer/pages/home/ui/HomePage'
import SettingsPage from '@renderer/pages/settings/ui/SettingsPage'

export const router = createHashRouter([
  { path: '/', element: <HomePage /> },
  { path: '/settings', element: <SettingsPage /> },
])
