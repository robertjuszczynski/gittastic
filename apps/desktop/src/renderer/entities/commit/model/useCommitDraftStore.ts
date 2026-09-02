import { create } from 'zustand'

type CommitDraftStore = {
  title: string
  description: string
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  clear: () => void
  /** Repopulates the draft from an undone commit, but only when the user hasn't typed anything — never clobbers in-progress input. Returns whether it actually restored. */
  restoreIfEmpty: (title: string, description?: string) => boolean
}

export const useCommitDraftStore = create<CommitDraftStore>()((set, get) => ({
  title: '',
  description: '',
  setTitle: title => set({ title }),
  setDescription: description => set({ description }),
  clear: () => set({ title: '', description: '' }),
  restoreIfEmpty: (title, description = '') => {
    const { title: currentTitle, description: currentDescription } = get()
    if (currentTitle.trim() || currentDescription.trim()) return false
    set({ title, description })
    return true
  },
}))
