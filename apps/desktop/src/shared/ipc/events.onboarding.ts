import type { ONBOARDING_CHANNELS, ONBOARDING_EVENT_CHANNELS } from './channels'
import type { TCompletePayload } from '../types/onboarding.types'

export interface IOnboardingEvents {
  [ONBOARDING_CHANNELS.ONBOARDING_COMPLETE]: {
    args: TCompletePayload
    response: Promise<void>
  }
  [ONBOARDING_CHANNELS.ONBOARDING_RESIZE]: {
    args: { width: number; height: number }
    response: Promise<void>
  }
  [ONBOARDING_CHANNELS.ONBOARDING_GITHUB_AUTH_START]: {
    args: void
    response: Promise<void>
  }
  [ONBOARDING_CHANNELS.ONBOARDING_OPEN_REPOSITORY]: {
    args: void
    response: Promise<string | null>
  }
  [ONBOARDING_CHANNELS.ONBOARDING_PICK_FOLDER]: {
    args: void
    response: Promise<string | null>
  }
  [ONBOARDING_CHANNELS.ONBOARDING_CREATE_REPOSITORY]: {
    args: { name: string; parentPath: string; readme: boolean }
    response: Promise<string | null>
  }
}

export interface IOnboardingEventEvents {
  [ONBOARDING_EVENT_CHANNELS.ONBOARDING_GITHUB_AUTH_RESULT]: { code: string }
}
