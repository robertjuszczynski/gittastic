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
