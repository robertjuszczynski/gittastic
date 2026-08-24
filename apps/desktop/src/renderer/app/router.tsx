import React from 'react'
import { createHashRouter } from 'react-router'
import { HomePage } from '@renderer/pages/home'
import { SettingsPage } from '@renderer/pages/settings'

export const router = createHashRouter([
  { path: '/', element: <HomePage /> },
  { path: '/settings', element: <SettingsPage /> },
])
