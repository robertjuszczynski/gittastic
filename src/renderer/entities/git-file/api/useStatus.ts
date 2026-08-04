import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'
import { useSetStagedAndUnstaged } from './useSetStagedAndUnstaged'

export const useStatus = () => {
  const { activePath } = useActivePath()
  const setStagedAndUnstaged = useSetStagedAndUnstaged()

  return useQuery({
    queryKey: ['git', 'status', activePath],
    queryFn: async () => {
      const status = await window.electron[CHANNELS.GET_STATUS]()
      setStagedAndUnstaged(status)
      return status
    },
    enabled: !!activePath,
  })
}
