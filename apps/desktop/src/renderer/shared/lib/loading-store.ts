import { create } from 'zustand'

export type Operation = {
  label: string
  done: boolean
  targetProgress: number
  totalSteps: number
  completedSteps: number
}

type LoadingStore = {
  operations: Map<string, Operation>
  start: (id: string, label: string, totalSteps?: number) => void
  advance: (id: string) => void
  finish: (id: string) => void
  remove: (id: string) => void
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  operations: new Map(),
  start: (id, label, totalSteps = 1) =>
    set((state) => {
      const next = new Map(state.operations)
      next.set(id, { label, done: false, targetProgress: 0, totalSteps, completedSteps: 0 })
      return { operations: next }
    }),
  advance: (id) =>
    set((state) => {
      const next = new Map(state.operations)
      const op = next.get(id)
      if (!op) return state
      const completedSteps = op.completedSteps + 1
      const targetProgress = Math.round((completedSteps / op.totalSteps) * 100)
      next.set(id, { ...op, completedSteps, targetProgress })
      return { operations: next }
    }),
  finish: (id) =>
    set((state) => {
      const next = new Map(state.operations)
      const op = next.get(id)
      if (!op) return state
      next.set(id, { ...op, done: true, targetProgress: 100 })
      return { operations: next }
    }),
  remove: (id) =>
    set((state) => {
      const next = new Map(state.operations)
      next.delete(id)
      return { operations: next }
    }),
}))
