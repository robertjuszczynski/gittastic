import { GIT_CHANNELS } from '@shared'

declare module '@renderer/shared/lib/undo-store' {
  interface UndoPayloadRegistry {
    [GIT_CHANNELS.STASH]: Record<string, never>
    [GIT_CHANNELS.POP_STASH]: Record<string, never>
  }
}
