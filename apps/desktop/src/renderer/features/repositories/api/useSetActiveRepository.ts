import { useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import type { Repository } from '@shared'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'
import { useSetStagedAndUnstaged } from '@renderer/entities/git-file/api/useSetStagedAndUnstaged'

export const useSetActiveRepository = () => {
  const { setActivePath } = useActivePath()
  const queryClient = useQueryClient()
  const setStagedAndUnstaged = useSetStagedAndUnstaged()

  return async (repo: Repository) => {
    const result = await window.electron[CHANNELS.SET_ACTIVE_REPOSITORY](repo)
    const status = await queryClient.fetchQuery({
      queryKey: ['git', 'status', result.path],
      queryFn: () => window.electron[CHANNELS.GET_STATUS](),
    })

    setStagedAndUnstaged(status)
    setActivePath(result.path)
    return result
  }
}
