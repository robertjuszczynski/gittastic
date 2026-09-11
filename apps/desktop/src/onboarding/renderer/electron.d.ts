import type { TOnboardingAPI, TOnboardingEventsAPI } from '../../shared/ipc/api.onboarding'
import type { TAbortableChannel } from '../../shared/ipc/abortable-channels'

interface AbortAPI {
  cancel: (channel: TAbortableChannel, requestId: string) => Promise<void>
}

declare global {
  interface Window {
    onboardingAPI: TOnboardingAPI
    onboardingEventsAPI: TOnboardingEventsAPI
    abortAPI: AbortAPI
  }
}
