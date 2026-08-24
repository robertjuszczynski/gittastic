import { create } from 'zustand'
import type { ReactNode } from 'react'

export type Command = {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  keywords?: string[]
  shortcut?: string[]
  section?: string
  disabled?: boolean | (() => boolean)
  execute: () => void | Promise<void>
}

type CommandPaletteStore = {
  isOpen: boolean
  commands: Command[]
  open: () => void
  close: () => void
  toggle: () => void
  registerCommands: (commands: Command[]) => () => void
}

export const useCommandPaletteStore = create<CommandPaletteStore>((set) => ({
  isOpen: false,
  commands: [],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  registerCommands: (incoming) => {
    set((s) => ({ commands: [...s.commands, ...incoming] }))
    return () =>
      set((s) => ({
        commands: s.commands.filter((c) => !incoming.some((cmd) => cmd.id === c.id)),
      }))
  },
}))

export const registerCommands = (commands: Command[]) =>
  useCommandPaletteStore.getState().registerCommands(commands)
