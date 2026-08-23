import type { TOnboardingAPI, TOnboardingEventsAPI } from '../../shared/ipc/api.onboarding'

declare global {
  interface Window {
    onboardingAPI: TOnboardingAPI
    onboardingEventsAPI: TOnboardingEventsAPI
  }
}
