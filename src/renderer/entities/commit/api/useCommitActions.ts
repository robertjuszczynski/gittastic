import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { useActivePath } from '@renderer/entities/repository/model/RepositoriesContext'
import { useChangesStore } from '@renderer/entities/git-file/model/useChangesStore'

export const useGitUser = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'user', activePath],
    queryFn: () => window.electron[CHANNELS.GET_USER](),
    enabled: !!activePath,
  })
}

export const useCommit = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()
  const setStagedAndUnstaged = useChangesStore(s => s.setStagedAndUnstaged)

  return async (message: string, description?: string) => {
    await window.electron[CHANNELS.COMMIT]({ message, description })
    const unstaged = useChangesStore.getState().unstaged
    setStagedAndUnstaged([], unstaged)
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'status', activePath] })
  }
}
