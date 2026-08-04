import { create } from 'zustand'
import { CHANNELS } from '@shared'
import type { FileChange } from '@shared'
import { mapFileStatus } from '@renderer/shared/lib'

async function fetchStagedAndUnstaged() {
  const status = await window.electron[CHANNELS.GET_STATUS]()
  const staged: FileChange[] = []
  const unstaged: FileChange[] = []

  for (const file of status.files) {
    if (file.index && file.index !== ' ' && file.index !== '?') {
      staged.push({ path: file.path, status: mapFileStatus(file.index), oldPath: file.from })
    }
    if (file.working_dir && file.working_dir !== ' ') {
      unstaged.push({ path: file.path, status: mapFileStatus(file.working_dir), oldPath: file.from })
    }
  }

  return { staged, unstaged }
}

type ChangesStore = {
  staged: FileChange[]
  unstaged: FileChange[]
  selectedFile: string | null
  selectedHash: string | null
  setStagedAndUnstaged: (staged: FileChange[], unstaged: FileChange[]) => void
  setSelectedFile: (path: string | null, hash?: string | null) => void
  stageFile: (path: string) => Promise<void>
  unstageFile: (path: string) => Promise<void>
  stageAll: () => Promise<void>
  unstageAll: () => Promise<void>
}

export const useChangesStore = create<ChangesStore>()((set) => ({
  staged: [],
  unstaged: [],
  selectedFile: null,
  selectedHash: null,
  setStagedAndUnstaged: (staged, unstaged) => set({ staged, unstaged }),
  setSelectedFile: (path, hash) => set({ selectedFile: path, selectedHash: hash ?? null }),
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
}))
