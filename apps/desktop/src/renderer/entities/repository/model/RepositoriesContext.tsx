import React, { createContext, useContext, useEffect, useState } from 'react'
import { CHANNELS, Repositories } from '@shared'
import { useToast } from '@renderer/shared/ui/ToastContext'
import { withGlobalIndicator, useUndoStore } from '@renderer/shared/lib'

type ActivePathContextType = {
  activePath: string | null
  setActivePath: (path: string | null) => void
}

type RepositoriesListContextType = {
  repositories: Repositories
  isLoaded: boolean
  openRepository: () => Promise<void>
  removeRepository: (path: string) => Promise<void>
}

const ActivePathContext = createContext<ActivePathContextType>({
  activePath: null,
  setActivePath: () => {},
})

const RepositoriesListContext = createContext<RepositoriesListContextType>({
  repositories: [],
  isLoaded: false,
  openRepository: async () => {},
  removeRepository: async () => {},
})

type RepositoriesProviderProps = {
  children: React.ReactNode
}

export const RepositoriesProvider = ({ children }: RepositoriesProviderProps) => {
  const [activePath, setActivePath] = useState<string | null>(null)
  const [repositories, setRepositories] = useState<Repositories>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    useUndoStore.getState().setActivePath(activePath)
  }, [activePath])

  useEffect(() => {
    window.electron[CHANNELS.GET_REPOSITORIES]().then(repos => {
      setRepositories(repos)
      setIsLoaded(true)
    })
    window.electron[CHANNELS.GET_ACTIVE_REPOSITORY]().then(async (result) => {
      if (result?.path) {
        setActivePath(result.path)
      }
    }).catch(() => {})
  }, [])

  const openRepository = async () => {
    try {
      const repo = await withGlobalIndicator(CHANNELS.OPEN_REPOSITORY, () => window.electron[CHANNELS.OPEN_REPOSITORY]())()
      if (repo?.path) {
        setActivePath(repo.path)
        setRepositories((prev) => prev.some(r => r.path === repo.path) ? prev : [...prev, repo])
      }
    } catch (e) {
      const isNotGit = e instanceof Error && e.message.includes('NotGitRepositoryError')
      showToast(
        isNotGit ? 'The selected folder is not a git repository.' : 'Failed to open repository.',
        'error'
      )
    }
  }

  const removeRepository = async (path: string) => {
    await window.electron[CHANNELS.REMOVE_REPOSITORY](path)
    useUndoStore.getState().clearRepo(path)
    const idx = repositories.findIndex(r => r.path === path)
    const newRepos = repositories.filter(r => r.path !== path)
    setRepositories(newRepos)
    if (activePath === path) {
      const next = newRepos[idx] ?? newRepos[idx - 1] ?? null
      if (next) {
        await window.electron[CHANNELS.SET_ACTIVE_REPOSITORY](next)
        setActivePath(next.path)
      } else {
        setActivePath(null)
      }
    }
  }

  return (
    <ActivePathContext.Provider value={{ activePath, setActivePath }}>
      <RepositoriesListContext.Provider value={{ repositories, isLoaded, openRepository, removeRepository }}>
        {children}
      </RepositoriesListContext.Provider>
    </ActivePathContext.Provider>
  )
}

export const useActivePath = () => useContext(ActivePathContext)
export const useRepositories = () => useContext(RepositoriesListContext)
