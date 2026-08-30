import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RepositoryGroupsStore = {
  collapsedIds: string[]
  toggleCollapsed: (id: string) => void
  isCollapsed: (id: string) => boolean
}

export const useRepositoryGroupsStore = create<RepositoryGroupsStore>()(
  persist(
    (set, get) => ({
      collapsedIds: [],
      toggleCollapsed: (id) =>
        set(s => ({
          collapsedIds: s.collapsedIds.includes(id)
            ? s.collapsedIds.filter(collapsedId => collapsedId !== id)
            : [...s.collapsedIds, id],
        })),
      isCollapsed: (id) => get().collapsedIds.includes(id),
    }),
    { name: 'gitastic-repository-groups' }
  )
)
