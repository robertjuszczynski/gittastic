import type { ONBOARDING_CHANNELS, ONBOARDING_EVENT_CHANNELS } from './channels'
import type { TOptionalArgs } from '../types/utils.types'
import type { IOnboardingEvents, IOnboardingEventEvents } from './events.onboarding'

export type TOnboardingAPI = {
  [K in keyof typeof ONBOARDING_CHANNELS]: (
    ...args: TOptionalArgs<IOnboardingEvents[typeof ONBOARDING_CHANNELS[K]]['args']>
  ) => IOnboardingEvents[typeof ONBOARDING_CHANNELS[K]]['response']
}

export type TOnboardingEventsAPI = {
  onGithubAuthResult: (cb: (data: IOnboardingEventEvents[typeof ONBOARDING_EVENT_CHANNELS.ONBOARDING_GITHUB_AUTH_RESULT]) => void) => () => void
}
