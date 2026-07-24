import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHANNELS, Workspace, Workspaces } from '@shared';

type WorkspacesContextType = {
  activePath: string | null;
  workspaces: Workspaces;
  openWorkspace: () => Promise<void>;
  setActiveWorkspace: (ws: Workspace) => Promise<Workspace>;
};

type WorkspacesProviderProps = {
  children: React.ReactNode;
};

const WorkspacesContext = createContext<WorkspacesContextType>({
  activePath: null,
  workspaces: [],
  openWorkspace: async () => {},
  setActiveWorkspace: async (ws: Workspace) => ws,
});

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
    <WorkspacesContext.Provider value={{ activePath, workspaces, openWorkspace, setActiveWorkspace }}>
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspaces = () => useContext(WorkspacesContext);

export default WorkspacesContext;
