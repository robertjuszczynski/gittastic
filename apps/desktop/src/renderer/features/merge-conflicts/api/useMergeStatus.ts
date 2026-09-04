import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository'
import { useCommitDraftStore } from '@renderer/entities/commit'
import { useMergeConflictsStore } from '../model/useMergeConflictsStore'

export const useMergeStatus = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  useEffect(() => {
    return window.gitEventsAPI.onStatusChanged(() => {
      queryClient.invalidateQueries({ queryKey: ['git', 'merge-status'] })
    })
  }, [queryClient])

  const query = useQuery({
    queryKey: ['git', 'merge-status', activePath],
    queryFn: () => window.electron[CHANNELS.GET_MERGE_STATUS](),
    enabled: !!activePath,
  })

  const message = query.data?.message
  useEffect(() => {
    if (!message) return
    const restored = useCommitDraftStore.getState().restoreIfEmpty(message.title, message.description)
    if (restored) useMergeConflictsStore.getState().markDraftAutofilledFromMerge(message)
  }, [message])

  return query
}
