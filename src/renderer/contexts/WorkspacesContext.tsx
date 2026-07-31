import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHANNELS, Workspace, Workspaces } from '@shared';

type ActivePathContextType = {
  activePath: string | null;
  setActiveWorkspace: (ws: Workspace) => Promise<Workspace>;
};

type WorkspacesListContextType = {
  workspaces: Workspaces;
  openWorkspace: () => Promise<void>;
};

const ActivePathContext = createContext<ActivePathContextType>({
  activePath: null,
  setActiveWorkspace: async (ws) => ws,
});

const WorkspacesListContext = createContext<WorkspacesListContextType>({
  workspaces: [],
  openWorkspace: async () => {},
});

type WorkspacesProviderProps = {
  children: React.ReactNode;
};

export const WorkspacesProvider = ({ children }: WorkspacesProviderProps) => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspaces>([]);

  useEffect(() => {
    window.electron[CHANNELS.GET_WORKSPACES]().then(setWorkspaces);
    window.electron[CHANNELS.GET_ACTIVE_WORKSPACE]().then((result) => {
      if (result?.path) setActivePath(result.path)
    }).catch(() => {})
  }, []);

  const openWorkspace = async () => {
    const ws = await window.electron[CHANNELS.OPEN_WORKSPACE]();
    if (ws?.path) {
      setActivePath(ws.path);
      setWorkspaces((prev) => prev.some(w => w.path === ws.path) ? prev : [...prev, ws]);
    }
  };

  const setActiveWorkspace = async (ws: Workspace): Promise<Workspace> => {
    const result = await window.electron[CHANNELS.SET_ACTIVE_WORKSPACE](ws)
    setActivePath(result.path)
    return result
  }

  return (
    <ActivePathContext.Provider value={{ activePath, setActiveWorkspace }}>
      <WorkspacesListContext.Provider value={{ workspaces, openWorkspace }}>
        {children}
      </WorkspacesListContext.Provider>
    </ActivePathContext.Provider>
  );
};

export const useActivePath = () => useContext(ActivePathContext);
export const useWorkspaces = () => useContext(WorkspacesListContext);
