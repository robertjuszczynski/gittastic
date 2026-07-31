import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHANNELS, Repository, Repositories } from '@shared';

type ActivePathContextType = {
  activePath: string | null;
  setActiveRepository: (repo: Repository) => Promise<Repository>;
};

type RepositoriesListContextType = {
  repositories: Repositories;
  openRepository: () => Promise<void>;
};

const ActivePathContext = createContext<ActivePathContextType>({
  activePath: null,
  setActiveRepository: async (repo) => repo,
});

const RepositoriesListContext = createContext<RepositoriesListContextType>({
  repositories: [],
  openRepository: async () => {},
});

type RepositoriesProviderProps = {
  children: React.ReactNode;
};

export const RepositoriesProvider = ({ children }: RepositoriesProviderProps) => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repositories>([]);

  useEffect(() => {
    window.electron[CHANNELS.GET_REPOSITORIES]().then(setRepositories);
    window.electron[CHANNELS.GET_ACTIVE_REPOSITORY]().then((result) => {
      if (result?.path) setActivePath(result.path)
    }).catch(() => {})
  }, []);

  const openRepository = async () => {
    const repo = await window.electron[CHANNELS.OPEN_REPOSITORY]();
    if (repo?.path) {
      setActivePath(repo.path);
      setRepositories((prev) => prev.some(r => r.path === repo.path) ? prev : [...prev, repo]);
    }
  };

  const setActiveRepository = async (repo: Repository): Promise<Repository> => {
    const result = await window.electron[CHANNELS.SET_ACTIVE_REPOSITORY](repo)
    setActivePath(result.path)
    return result
  }

  return (
    <ActivePathContext.Provider value={{ activePath, setActiveRepository }}>
      <RepositoriesListContext.Provider value={{ repositories, openRepository }}>
        {children}
      </RepositoriesListContext.Provider>
    </ActivePathContext.Provider>
  );
};

export const useActivePath = () => useContext(ActivePathContext);
export const useRepositories = () => useContext(RepositoriesListContext);
