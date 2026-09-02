import { create } from 'zustand'

/**
 * Registry of per-action undo payload shapes. shared/lib is beneath entities/features in the
 * FSD layering, so it must not hardcode their domain types here — each owning module augments
 * this interface instead, e.g.:
 *
 *   declare module '@renderer/shared/lib/undo-store' {
 *     interface UndoPayloadRegistry {
 *       [GIT_CHANNELS.COMMIT]: { message: string; description?: string; branch: string }
 *     }
 *   }
 *
 * TypeScript merges every augmentation into one discriminated union wherever `UndoEntry` is used,
 * so call sites still get full per-action payload typing.
 */

export interface UndoPayloadRegistry {}

export type UndoableAction = keyof UndoPayloadRegistry

type UndoEntryFor<K extends UndoableAction> = {
  action: K
  label: string
  timestamp: number
  payload: UndoPayloadRegistry[K]
  revert: () => Promise<void>
  forward: () => Promise<void>
}

export type UndoEntry = { [K in UndoableAction]: UndoEntryFor<K> }[UndoableAction]

type PushPayload = { [K in UndoableAction]: Omit<UndoEntryFor<K>, 'timestamp'> }[UndoableAction]

const MAX_STACK = 10

type RepoStacks = {
  undoStack: UndoEntry[]
  redoStack: UndoEntry[]
}

const emptyStacks = (): RepoStacks => ({ undoStack: [], redoStack: [] })

type UndoStore = {
  activePath: string | null
  repoStacks: Map<string, RepoStacks>
  undoStack: UndoEntry[]
  redoStack: UndoEntry[]
  isUndoing: boolean
  isRedoing: boolean
  setActivePath: (path: string | null) => void
  clearRepo: (path: string) => void
  push: (entry: PushPayload) => void
  undo: (onError: (msg: string) => void) => Promise<void>
  redo: (onError: (msg: string) => void) => Promise<void>
  /** Removes entries matching `predicate` from both stacks of the active repo - e.g. dropping undo/redo entries for commits a push just made unsafe to reset. Domain-specific predicates belong to the owning entity/feature, not here. */
  removeWhere: (predicate: (entry: UndoEntry) => boolean) => void
}

export const useUndoStore = create<UndoStore>((set, get) => ({
  activePath: null,
  repoStacks: new Map(),
  undoStack: [],
  redoStack: [],
  isUndoing: false,
  isRedoing: false,

  setActivePath: (path) => {
    const stacks = path ? (get().repoStacks.get(path) ?? emptyStacks()) : emptyStacks()
    set({ activePath: path, undoStack: stacks.undoStack, redoStack: stacks.redoStack })
  },

  clearRepo: (path) => {
    const repoStacks = new Map(get().repoStacks)
    repoStacks.delete(path)
    const isActive = get().activePath === path
    set(isActive ? { repoStacks, undoStack: [], redoStack: [] } : { repoStacks })
  },

  push: (entry) => {
    const { activePath, repoStacks } = get()
    if (!activePath) return
    const current = repoStacks.get(activePath) ?? emptyStacks()
    const undoStack = [...current.undoStack, { ...entry, timestamp: Date.now() } as UndoEntry].slice(-MAX_STACK)
    const newRepoStacks = new Map(repoStacks)
    newRepoStacks.set(activePath, { undoStack, redoStack: [] })
    set({ repoStacks: newRepoStacks, undoStack, redoStack: [] })
  },

  undo: async (onError) => {
    const { undoStack, redoStack, activePath, repoStacks, isUndoing } = get()
    if (isUndoing) return
    const entry = undoStack[undoStack.length - 1]
    if (!entry || !activePath) return
    set({ isUndoing: true })
    try {
      await entry.revert()
      const newUndoStack = undoStack.slice(0, -1)
      const newRedoStack = [...redoStack, entry]
      const newRepoStacks = new Map(repoStacks)
      newRepoStacks.set(activePath, { undoStack: newUndoStack, redoStack: newRedoStack })
      set({ repoStacks: newRepoStacks, undoStack: newUndoStack, redoStack: newRedoStack })
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to undo')
    } finally {
      set({ isUndoing: false })
    }
  },

  redo: async (onError) => {
    const { redoStack, undoStack, activePath, repoStacks, isRedoing } = get()
    if (isRedoing) return
    const entry = redoStack[redoStack.length - 1]
    if (!entry || !activePath) return
    set({ isRedoing: true })
    try {
      await entry.forward()
      const newRedoStack = redoStack.slice(0, -1)
      const newUndoStack = [...undoStack, { ...entry, timestamp: Date.now() }]
      const newRepoStacks = new Map(repoStacks)
      newRepoStacks.set(activePath, { undoStack: newUndoStack, redoStack: newRedoStack })
      set({ repoStacks: newRepoStacks, undoStack: newUndoStack, redoStack: newRedoStack })
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to redo')
    } finally {
      set({ isRedoing: false })
    }
  },

  removeWhere: (predicate) => {
    const { activePath, repoStacks, undoStack, redoStack } = get()
    if (!activePath) return
    const newUndoStack = undoStack.filter((entry) => !predicate(entry))
    const newRedoStack = redoStack.filter((entry) => !predicate(entry))
    if (newUndoStack.length === undoStack.length && newRedoStack.length === redoStack.length) return
    const current = repoStacks.get(activePath) ?? emptyStacks()
    const newRepoStacks = new Map(repoStacks)
    newRepoStacks.set(activePath, { ...current, undoStack: newUndoStack, redoStack: newRedoStack })
    set({ repoStacks: newRepoStacks, undoStack: newUndoStack, redoStack: newRedoStack })
  },
}))
