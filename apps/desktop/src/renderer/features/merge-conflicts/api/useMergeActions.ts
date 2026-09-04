import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository'
import { withGlobalIndicator } from '@renderer/shared/lib'
import { useChangesStore } from '@renderer/entities/git-file'
import { useMergeConflictsStore } from '../model/useMergeConflictsStore'

export const useMergeActions = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['git', 'status', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'merge-status', activePath] })
  }

  const mergeBranch = async (branchName: string) => {
    const result = await withGlobalIndicator(CHANNELS.MERGE_BRANCH, window.electron[CHANNELS.MERGE_BRANCH])(branchName)
    invalidate()
    return result
  }

  const abortMerge = async () => {
    await withGlobalIndicator(CHANNELS.ABORT_MERGE, window.electron[CHANNELS.ABORT_MERGE])()
    useMergeConflictsStore.getState().clearAutofilledDraftOnAbort()
    useChangesStore.getState().setSelectedFile(null)
    invalidate()
  }

  const resolveConflict = async (path: string, content: string) => {
    await window.electron[CHANNELS.RESOLVE_CONFLICT]({ path, content })
    invalidate()
  }

  const resolveConflictSide = async (path: string, side: 'ours' | 'theirs') => {
    await window.electron[CHANNELS.RESOLVE_CONFLICT_SIDE]({ path, side })
    invalidate()
  }

  const removeConflictFile = async (path: string) => {
    await window.electron[CHANNELS.REMOVE_CONFLICT_FILE](path)
    invalidate()
  }

  return { mergeBranch, abortMerge, resolveConflict, resolveConflictSide, removeConflictFile }
}
