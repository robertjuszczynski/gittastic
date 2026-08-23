import type { ThemeDefinition } from '../types/theme.types'

export const MAIN_EVENTS = {
  GIT_STATUS_CHANGED: 'git-status-changed',
  APP_DID_BECOME_ACTIVE: 'app-did-become-active',
  THEME_UPDATED: 'theme-updated',
  CUSTOM_THEMES_CHANGED: 'custom-themes-changed',
} as const

export type TMainEvents = {
    [MAIN_EVENTS.GIT_STATUS_CHANGED]: void
    [MAIN_EVENTS.APP_DID_BECOME_ACTIVE]: void
    [MAIN_EVENTS.THEME_UPDATED]: ThemeDefinition
    [MAIN_EVENTS.CUSTOM_THEMES_CHANGED]: ThemeDefinition[]
}