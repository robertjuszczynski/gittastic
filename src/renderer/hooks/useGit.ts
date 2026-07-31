import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { CHANNELS } from '@shared'
import type { GitRawCommit, Repository } from '@shared'
import { useActivePath } from '@renderer/contexts/RepositoriesContext'
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

export const useBranches = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'branches', activePath],
    queryFn: () => window.electron[CHANNELS.GET_BRANCHES](),
    enabled: !!activePath,
  })
}

export const useCommits = () => {
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

export const useStashes = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'stashes', activePath],
    queryFn: () => window.electron[CHANNELS.GET_STASHES](),
    enabled: !!activePath,
  })
}

export const useStatus = () => {
  const { activePath } = useActivePath()

  return useQuery({
    queryKey: ['git', 'status', activePath],
    queryFn: async () => {
      return await window.electron[CHANNELS.GET_STATUS]()
    },
    enabled: !!activePath,
  })
}

export const useSetActiveRepository = () => {
  const { setActivePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (repo: Repository) => {
    const result = await window.electron[CHANNELS.SET_ACTIVE_REPOSITORY](repo)
    await queryClient.prefetchQuery({
      queryKey: ['git', 'status', result.path],
      queryFn: () => window.electron[CHANNELS.GET_STATUS](),
    })
    setActivePath(result.path)
    return result
  }
}

export const useCheckoutBranch = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (name: string) => {
    await window.electron[CHANNELS.CHECKOUT_BRANCH](name)
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
  }
}

export const useCreateBranch = () => {
  const { activePath } = useActivePath()
  const queryClient = useQueryClient()

  return async (name: string) => {
    await window.electron[CHANNELS.CREATE_BRANCH](name)
    queryClient.invalidateQueries({ queryKey: ['git', 'branches', activePath] })
    queryClient.invalidateQueries({ queryKey: ['git', 'commits', activePath] })
  }
}
