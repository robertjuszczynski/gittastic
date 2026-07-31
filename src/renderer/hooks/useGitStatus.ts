import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/contexts/WorkspacesContext'

export const useGitStatus = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'status', activePath],
    queryFn: async () => {
      return await window.electron[CHANNELS.GET_STATUS]()
    },
    enabled: !!activePath,
  })
}
