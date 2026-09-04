import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository'
import { withGlobalIndicator, useUndoStore } from '@renderer/shared/lib'
import '../model/branch-undo'

export const useBranches = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'branches', activePath],
    queryFn: () => window.electron[CHANNELS.GET_BRANCHES](),
    enabled: !!activePath,
  })
}

export const useCheckoutBranch = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (name: string) => {
    const status = queryClient.getQueryData<{ current: string }>(['git', 'status', activePath])
    const previousBranch = status?.current

    await withGlobalIndicator(CHANNELS.CHECKOUT_BRANCH, () => window.electron[CHANNELS.CHECKOUT_BRANCH](name))()
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })

    if (!previousBranch) return

    useUndoStore.getState().push({
      action: CHANNELS.CHECKOUT_BRANCH,
      label: `Checkout "${name}"`,
      payload: { branchName: name, previousBranch },
      revert: async () => {
        await window.electron[CHANNELS.CHECKOUT_BRANCH](previousBranch)
        queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
        queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
      },
      forward: async () => {
        await window.electron[CHANNELS.CHECKOUT_BRANCH](name)
        queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
        queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
      },
    })
  }
}

export const useMergeBranch = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (branchName: string) => {
    const result = await withGlobalIndicator(CHANNELS.MERGE_BRANCH, window.electron[CHANNELS.MERGE_BRANCH])(branchName)
    queryClient.invalidateQueries({ queryKey: ['git', 'status', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'merge-status', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    return result
  }
}

export const useCreateBranch = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (name: string) => {
    const status = queryClient.getQueryData<{ current: string }>(['git', 'status', activePath])
    const previousBranch = status?.current

    await withGlobalIndicator(CHANNELS.CREATE_BRANCH, () => window.electron[CHANNELS.CREATE_BRANCH](name))()
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })

    if (!previousBranch) return

    useUndoStore.getState().push({
      action: CHANNELS.CREATE_BRANCH,
      label: `Create branch "${name}"`,
      payload: { branchName: name, previousBranch },
      revert: async () => {
        await window.electron[CHANNELS.CHECKOUT_BRANCH](previousBranch)
        await window.electron[CHANNELS.DELETE_BRANCH](name)
        queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
        queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
      },
      forward: async () => {
        await window.electron[CHANNELS.CREATE_BRANCH](name)
        queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
        queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
      },
    })
  }
}
