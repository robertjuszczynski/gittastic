export const MAIN_EVENTS = {
  GIT_STATUS_CHANGED: 'git-status-changed',
  APP_DID_BECOME_ACTIVE: 'app-did-become-active',
} as const

export type TMainEvents = {
    [MAIN_EVENTS.GIT_STATUS_CHANGED]: void
    [MAIN_EVENTS.APP_DID_BECOME_ACTIVE]: void
}