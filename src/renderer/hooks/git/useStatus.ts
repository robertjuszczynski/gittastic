import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/contexts/RepositoriesContext'

export const useStatus = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'status', activePath],
    queryFn: () => window.electron[CHANNELS.GET_STATUS](),
    enabled: !!activePath,
  })
}
