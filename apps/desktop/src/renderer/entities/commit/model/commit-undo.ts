import { GIT_CHANNELS } from '@shared'
import { useUndoStore } from '@renderer/shared/lib'

declare module '@renderer/shared/lib/undo-store' {
  interface UndoPayloadRegistry {
    [GIT_CHANNELS.COMMIT]: { message: string; description?: string; branch: string }
  }
}

/**
 * A push covers every local commit up to current HEAD on `branch`, so any undo/redo entry for a
 * COMMIT on that branch is now unsafe to soft-reset (the commit is shared history). Called after
 * a successful push.
 */
export const dropPushedCommitsOnBranch = (branch: string) => {
  useUndoStore.getState().removeWhere(
    (entry) => entry.action === GIT_CHANNELS.COMMIT && entry.payload.branch === branch
  )
}
