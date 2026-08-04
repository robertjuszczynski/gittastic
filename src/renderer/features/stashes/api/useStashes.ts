import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'

export const useStashes = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'stashes', activePath],
    queryFn: () => window.electron[CHANNELS.GET_STASHES](),
    enabled: !!activePath,
  })
}
