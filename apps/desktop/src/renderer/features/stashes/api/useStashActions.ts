import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { withGlobalIndicator, useUndoStore } from '@renderer/shared/lib'
import '../model/stash-undo'

export const useStashActions = () => {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['git'] })

  const stash = async () => {
    const hasStashedChanges = await withGlobalIndicator(CHANNELS.STASH, () => window.electron[CHANNELS.STASH]())()
    if (!hasStashedChanges) return
    await invalidate()
    useUndoStore.getState().push({
      action: CHANNELS.STASH,
      label: 'Stash changes',
      payload: {},
      revert: async () => {
        await window.electron[CHANNELS.POP_STASH]()
        await invalidate()
      },
      forward: async () => {
        await window.electron[CHANNELS.STASH]()
        await invalidate()
      },
    })
  }

  const popStash = async () => {
    await withGlobalIndicator(CHANNELS.POP_STASH, () => window.electron[CHANNELS.POP_STASH]())()
    await invalidate()
    useUndoStore.getState().push({
      action: CHANNELS.POP_STASH,
      label: 'Pop stash',
      payload: {},
      revert: async () => {
        await window.electron[CHANNELS.STASH]()
        await invalidate()
      },
      forward: async () => {
        await window.electron[CHANNELS.POP_STASH]()
        await invalidate()
      },
    })
  }

  return { stash, popStash }
}
