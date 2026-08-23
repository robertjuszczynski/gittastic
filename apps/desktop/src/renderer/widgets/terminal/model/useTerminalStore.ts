import { create } from 'zustand'

interface TerminalStore {
  isOpen: boolean
  height: number
  toggle: () => void
  setHeight: (height: number) => void
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  isOpen: false,
  height: 260,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setHeight: (height) => set({ height }),
}))
