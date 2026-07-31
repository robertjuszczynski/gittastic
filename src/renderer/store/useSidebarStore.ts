import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SectionId = 'repos' | 'branches' | 'stashes'

const DEFAULT_SECTIONS: SectionId[] = ['repos', 'branches', 'stashes']

type SidebarStore = {
  sections: SectionId[]
  setSections: (sections: SectionId[]) => void
  removeSection: (id: SectionId) => void
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    set => ({
      sections: DEFAULT_SECTIONS,
      setSections: sections => set({ sections }),
      removeSection: id => set(s => ({ sections: s.sections.filter(sec => sec !== id) })),
    }),
    { name: 'gittastic-sidebar' }
  )
)
