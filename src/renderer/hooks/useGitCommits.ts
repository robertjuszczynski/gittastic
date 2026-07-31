import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import type { GitRawCommit } from '@shared'
import { useActivePath } from '@renderer/contexts/WorkspacesContext'
import type { CommitGraphRow } from '@renderer/utils/computeGraphLanes'
import GraphWorker from '@renderer/utils/computeGraphLanes.worker?worker'

const INITIAL_LIMIT = 500

function runInGraphWorker(commits: GitRawCommit[]): Promise<CommitGraphRow[]> {
  return new Promise((resolve) => {
    const worker = new GraphWorker()
    worker.onmessage = (e: MessageEvent<CommitGraphRow[]>) => {
      resolve(e.data)
      worker.terminate()
    }
    worker.postMessage(commits)
  })
}

export const useGitCommits = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['git', 'commits', activePath],
    queryFn: async () => {
      const first = await window.electron[CHANNELS.GET_COMMITS]({ limit: INITIAL_LIMIT })
      const firstRows = await runInGraphWorker(first)

      if (first.length === INITIAL_LIMIT) {
        window.electron[CHANNELS.GET_COMMITS]({ skip: INITIAL_LIMIT }).then(async rest => {
          if (rest.length > 0) {
            const allRows = await runInGraphWorker([...first, ...rest])
            queryClient.setQueryData(['git', 'commits', activePath], allRows)
          }
        })
      }

      return firstRows
    },
    enabled: !!activePath,
    placeholderData: keepPreviousData,
  })
}
