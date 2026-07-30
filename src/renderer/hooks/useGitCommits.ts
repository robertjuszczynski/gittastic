import { useQuery } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import { computeGraphRows } from '@renderer/utils/computeGraphLanes'
import { useWorkspaces } from '@renderer/contexts/WorkspacesContext'

export const useCommits = () => {
  const { activePath } = useWorkspaces()

  return useQuery({
    queryKey: ['git', 'commits', activePath],
    queryFn: async () => {
      const commits = await window.electron[CHANNELS.GET_COMMITS]()
      return computeGraphRows(commits)
    },
    enabled: !!activePath,
  })
}
