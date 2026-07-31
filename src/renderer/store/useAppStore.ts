import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SelectedItem = string | 'uncommitted' | null

export type SectionId = 'repos' | 'branches' | 'stashes'

const DEFAULT_SECTIONS: SectionId[] = ['repos', 'branches', 'stashes']

type AppStore = {
  selectedItem: SelectedItem
  setSelectedItem: (item: SelectedItem) => void
  sections: SectionId[]
  setSections: (sections: SectionId[]) => void
  removeSection: (id: SectionId) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      selectedItem: null,
      setSelectedItem: item => set({ selectedItem: item }),
      sections: DEFAULT_SECTIONS,
      setSections: sections => set({ sections }),
      removeSection: id => set(s => ({ sections: s.sections.filter(s => s !== id) })),
    }),
    { name: 'gittastic-app' }
  )
)
