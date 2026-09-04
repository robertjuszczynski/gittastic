import { create } from 'zustand'
import { CHANNELS } from '@shared'
import type { FileChange } from '@shared'
import { splitStatusFiles } from '@renderer/shared/lib'
import { devtools } from 'zustand/middleware'

async function fetchStagedAndUnstaged() {
  const status = await window.electron[CHANNELS.GET_STATUS]()
  return splitStatusFiles(status)
}

/** Which tree a selected folder was clicked in — a folder path can exist in both the Staged and Unstaged trees at once, so the click needs to say which one it means. `null` for a commit-history folder, where there's no staged/unstaged split. */
export type FolderScope = 'staged' | 'unstaged' | null

type ChangesStore = {
  staged: FileChange[]
  unstaged: FileChange[]
  selectedFile: string | null
  selectedHash: string | null
  selectedFolder: string | null
  selectedFolderHash: string | null
  selectedFolderScope: FolderScope
  setStagedAndUnstaged: (staged: FileChange[], unstaged: FileChange[]) => void
  setSelectedFile: (path: string | null, hash?: string | null) => void
  setSelectedFolder: (path: string | null, hash?: string | null, scope?: FolderScope) => void
  stageFile: (path: string) => Promise<void>
  unstageFile: (path: string) => Promise<void>
  stageAll: () => Promise<void>
  unstageAll: () => Promise<void>
  stageFolder: (path: string) => Promise<void>
  unstageFolder: (path: string) => Promise<void>
}

export const useChangesStore = create<ChangesStore>()(
  devtools((set) => ({
  staged: [],
  unstaged: [],
  selectedFile: null,
  selectedHash: null,
  selectedFolder: null,
  selectedFolderHash: null,
  selectedFolderScope: null,
  setStagedAndUnstaged: (staged, unstaged) => set({ staged, unstaged }),
  setSelectedFile: (path, hash) => set({ selectedFile: path, selectedHash: hash ?? null, selectedFolder: null, selectedFolderHash: null, selectedFolderScope: null }),
  setSelectedFolder: (path, hash, scope) => set({ selectedFolder: path, selectedFile: null, selectedHash: null, selectedFolderHash: hash ?? null, selectedFolderScope: scope ?? null }),
  stageFile: async path => {
    await window.electron[CHANNELS.STAGE_FILE](path)
    const { staged, unstaged } = await fetchStagedAndUnstaged()
    set({ staged, unstaged })
  },
  unstageFile: async path => {
    await window.electron[CHANNELS.UNSTAGE_FILE](path)
    const { staged, unstaged } = await fetchStagedAndUnstaged()
    set({ staged, unstaged })
  },
  stageAll: async () => {
    await window.electron[CHANNELS.STAGE_ALL]()
    const { staged, unstaged } = await fetchStagedAndUnstaged()
    set({ staged, unstaged })
  },
  unstageAll: async () => {
    await window.electron[CHANNELS.UNSTAGE_ALL]()
    const { staged, unstaged } = await fetchStagedAndUnstaged()
    set({ staged, unstaged })
  },
  stageFolder: async path => {
    await window.electron[CHANNELS.STAGE_FOLDER](path)
    const { staged, unstaged } = await fetchStagedAndUnstaged()
    set({ staged, unstaged })
  },
  unstageFolder: async path => {
    await window.electron[CHANNELS.UNSTAGE_FOLDER](path)
    const { staged, unstaged } = await fetchStagedAndUnstaged()
    set({ staged, unstaged })
  },
})))
