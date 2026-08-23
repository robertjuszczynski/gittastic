import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'
import { useSetStagedAndUnstaged } from './useSetStagedAndUnstaged'

export const useStatus = () => {
  const { activePath } = useActivePath()
  const setStagedAndUnstaged = useSetStagedAndUnstaged()
  const queryClient = useQueryClient()

  useEffect(() => {
    return window.gitEventsAPI.onStatusChanged(() => {
      queryClient.invalidateQueries({ queryKey: ['git', 'status'] })
    })
  }, [queryClient])

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
