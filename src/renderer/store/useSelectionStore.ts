import { create } from 'zustand'

type SelectedItem = string | 'uncommitted' | null

type SelectionStore = {
  selectedItem: SelectedItem
  setSelectedItem: (item: SelectedItem) => void
}

export const useSelectionStore = create<SelectionStore>()(set => ({
  selectedItem: null,
  setSelectedItem: item => set({ selectedItem: item }),
}))
