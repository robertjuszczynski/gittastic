import { useEffect } from 'react'
import { useCommandPaletteStore } from '@renderer/shared/lib/command-palette'
import type { Command } from './types'

export function useRegisterCommands(commands: Command[]) {
  useEffect(() => {
    return useCommandPaletteStore.getState().registerCommands(commands)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
