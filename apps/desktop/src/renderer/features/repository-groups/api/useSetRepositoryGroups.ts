import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CHANNELS, type RepositoryGroups } from '@shared'
import { REPOSITORY_GROUPS_QUERY_KEY } from './useRepositoryGroups'

export const useSetRepositoryGroups = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groups: RepositoryGroups) =>
      window.electron[CHANNELS.SET_REPOSITORY_GROUPS](groups),
    onSuccess: (saved) => {
      queryClient.setQueryData(REPOSITORY_GROUPS_QUERY_KEY, saved)
    },
  })
}
