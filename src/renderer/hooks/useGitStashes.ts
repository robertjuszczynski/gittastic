import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/contexts/WorkspacesContext'

export const useGitStashes = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'stashes', activePath],
    queryFn: () => window.electron[CHANNELS.GET_STASHES](),
    enabled: !!activePath,
  })
}
