declare interface Window {
  onboardingAPI: {
    complete: () => Promise<void>
  }
}
