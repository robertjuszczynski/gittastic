import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHANNELS } from '@shared';

type WorkspacesContextType = {
  activePath: string | null;
  workspaces: string[];
  openWorkspace: () => Promise<void>;
};

type WorkspacesProviderProps = {
  children: React.ReactNode;
};

const WorkspacesContext = createContext<WorkspacesContextType>({
  activePath: null,
  workspaces: [],
  openWorkspace: async () => {},
});

export const WorkspacesProvider = ({ children }: WorkspacesProviderProps) => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<string[]>([]);

  useEffect(() => {
    window.electron[CHANNELS.GET_WORKSPACES]().then(setWorkspaces);
  }, []);

  const openWorkspace = async () => {
    const path = await window.electron[CHANNELS.OPEN_WORKSPACE]();
    if (path) {
      setActivePath(path);
      setWorkspaces((prev) => prev.includes(path) ? prev : [...prev, path]);
    }
  };

  return (
    <WorkspacesContext.Provider value={{ activePath, workspaces, openWorkspace }}>
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspaces = () => useContext(WorkspacesContext);

export default WorkspacesContext;
