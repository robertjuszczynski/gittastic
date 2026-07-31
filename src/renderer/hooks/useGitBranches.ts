import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/contexts/WorkspacesContext'

export const useGitBranches = () => {
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
    await window.electron[CHANNELS.CHECKOUT_BRANCH](name)
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
  }
}

export const useCreateBranch = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (name: string) => {
    await window.electron[CHANNELS.CREATE_BRANCH](name)
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
  }
}
