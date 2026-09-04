import { create } from 'zustand'
import type { MergeMessage } from '@shared'
import { useCommitDraftStore } from '@renderer/entities/commit'

type MergeConflictsStore = {
  /** True once the commit draft has been auto-filled from `.git/MERGE_MSG` for the current merge attempt. */
  draftAutofilledFromMerge: boolean
  /** The message that was autofilled, so an abort can tell whether the draft still matches it untouched. */
  autofilledMessage: MergeMessage | null
  markDraftAutofilledFromMerge: (message: MergeMessage) => void
  clearAutofilledDraftOnAbort: () => void
}

export const useMergeConflictsStore = create<MergeConflictsStore>()((set, get) => ({
  draftAutofilledFromMerge: false,
  autofilledMessage: null,
  markDraftAutofilledFromMerge: message => set({ draftAutofilledFromMerge: true, autofilledMessage: message }),
  clearAutofilledDraftOnAbort: () => {
    const { draftAutofilledFromMerge, autofilledMessage } = get()
    if (draftAutofilledFromMerge && autofilledMessage) {
      const draft = useCommitDraftStore.getState()
      const untouched = draft.title === autofilledMessage.title && draft.description === autofilledMessage.description
      if (untouched) draft.clear()
    }
    set({ draftAutofilledFromMerge: false, autofilledMessage: null })
  },
}))
