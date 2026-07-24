import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHANNELS, Workspaces } from '@shared';

type WorkspacesContextType = {
  activePath: string | null;
  workspaces: Workspaces;
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
  const [workspaces, setWorkspaces] = useState<Workspaces>([]);

  useEffect(() => {
    window.electron[CHANNELS.GET_WORKSPACES]().then(setWorkspaces);
  }, []);

  const openWorkspace = async () => {
    const ws = await window.electron[CHANNELS.OPEN_WORKSPACE]();
    if (ws?.path) {
      setActivePath(ws.path);
      setWorkspaces((prev) => prev.includes(ws) ? prev : [...prev, ws]);
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
