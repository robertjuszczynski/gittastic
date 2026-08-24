import { type FeatureName, type GitUser, type TGitProvider } from '@shared'

export type OnboardingData = {
  features: Record<FeatureName, boolean>
  provider: TGitProvider | null
  gitUser: GitUser
  repoPath: string | null
}

export type TCompletePayload = {
  features: Record<FeatureName, boolean>
  provider: TGitProvider | null
  gitUser: GitUser
  repoPath: string | null
}
