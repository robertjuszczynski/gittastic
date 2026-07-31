import { create } from 'zustand'

type SelectedCommit = string | 'uncommitted' | null

type CommitSelectionStore = {
  selectedCommit: SelectedCommit
  setSelectedCommit: (commit: SelectedCommit) => void
}

export const useCommitSelectionStore = create<CommitSelectionStore>()(set => ({
  selectedCommit: null,
  setSelectedCommit: commit => set({ selectedCommit: commit }),
}))
