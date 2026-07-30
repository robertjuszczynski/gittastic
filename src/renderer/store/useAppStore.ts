import { create } from 'zustand'

type SelectedItem = string | 'uncommitted' | null

type AppStore = {
  selectedItem: SelectedItem
  setSelectedItem: (item: SelectedItem) => void
}

export const useAppStore = create<AppStore>(set => ({
  selectedItem: null,
  setSelectedItem: item => set({ selectedItem: item }),
}))
