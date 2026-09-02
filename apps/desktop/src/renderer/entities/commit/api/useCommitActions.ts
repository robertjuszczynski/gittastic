import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository/@x/commit'
import { useChangesStore } from '@renderer/entities/git-file/@x/commit'
import { withGlobalIndicator, useUndoStore } from '@renderer/shared/lib'
import { useCommitDraftStore } from '../model/useCommitDraftStore'
import '../model/commit-undo'

export const useGitUser = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'user', activePath],
    queryFn: () => window.electron[CHANNELS.GET_USER](),
    enabled: !!activePath,
  })
}

export const useCommit = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()
  const setStagedAndUnstaged = useChangesStore(s => s.setStagedAndUnstaged)

  return async (message: string, description?: string) => {
    const { hash, branch } = await withGlobalIndicator(CHANNELS.COMMIT, () => window.electron[CHANNELS.COMMIT]({ message, description }))()
    const unstaged = useChangesStore.getState().unstaged
    setStagedAndUnstaged([], unstaged)
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'status', activePath] })

    // Tracks the commit's current position on HEAD across repeated undo/redo cycles of this same entry.
    let currentHeadHash = hash
    // Whether the last undo repopulated the commit draft from this entry — guards redo from clobbering user edits made after the undo.
    let draftWasRestoredByUndo = false

    useUndoStore.getState().push({
      action: CHANNELS.COMMIT,
      label: `Commit ${message}`,
      payload: { message, description, branch },
      revert: async () => {
        const { resultingHeadHash } = await window.electron[CHANNELS.UNDO]({ expectedHeadHash: currentHeadHash })
        currentHeadHash = resultingHeadHash
        draftWasRestoredByUndo = useCommitDraftStore.getState().restoreIfEmpty(message, description)
        queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
        queryClient.invalidateQueries({ queryKey: ['git', 'status', activePath] })
      },
      forward: async () => {
        await window.electron[CHANNELS.REDO]({ expectedHeadHash: currentHeadHash, targetHash: hash })
        currentHeadHash = hash
        if (draftWasRestoredByUndo) {
          const draft = useCommitDraftStore.getState()
          if (draft.title === message && draft.description === (description ?? '')) {
            draft.clear()
          }
          draftWasRestoredByUndo = false
        }
        queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
        queryClient.invalidateQueries({ queryKey: ['git', 'status', activePath] })
      },
    })
  }
}
