import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'

export const REPOSITORY_GROUPS_QUERY_KEY = ['repository-groups']

export const useRepositoryGroups = () =>
  useQuery({
    queryKey: REPOSITORY_GROUPS_QUERY_KEY,
    queryFn: () => window.electron[CHANNELS.GET_REPOSITORY_GROUPS](),
  })
