export type TGitProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure'

export const FEATURES = {
  STASHES: 'stashes',
  TAGS: 'tags',
  COMMIT_GRAPH: 'commit-graph',
  FILE_HISTORY: 'file-history',
  BLAME: 'blame',
  REBASE: 'rebase',
  CHERRY_PICK: 'cherry-pick',
  REFLOG: 'reflog',
  TERMINAL: 'terminal',
} as const

export type FeatureName = typeof FEATURES[keyof typeof FEATURES]
export type FeatureLevel = 'simple' | 'normal' | 'advanced'

export const FEATURE_LEVEL_PRESETS: Record<FeatureLevel, FeatureName[]> = {
  simple: [FEATURES.COMMIT_GRAPH],
  normal: [FEATURES.STASHES, FEATURES.TAGS, FEATURES.COMMIT_GRAPH, FEATURES.FILE_HISTORY, FEATURES.TERMINAL],
  advanced: Object.values(FEATURES) as FeatureName[],
}

export const FEATURE_LABELS: Record<FeatureName, { label: string; group: string }> = {
  [FEATURES.STASHES]: { label: 'Stashes', group: 'Working copy' },
  [FEATURES.TAGS]: { label: 'Tags', group: 'History' },
  [FEATURES.COMMIT_GRAPH]: { label: 'Commit graph', group: 'History' },
  [FEATURES.FILE_HISTORY]: { label: 'File history', group: 'History' },
  [FEATURES.BLAME]: { label: 'Blame', group: 'History' },
  [FEATURES.REBASE]: { label: 'Rebase', group: 'Branching' },
  [FEATURES.CHERRY_PICK]: { label: 'Cherry-pick', group: 'Branching' },
  [FEATURES.REFLOG]: { label: 'Reflog', group: 'Branching' },
  [FEATURES.TERMINAL]: { label: 'Integrated terminal', group: 'Interface' },
}
