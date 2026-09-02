import { GIT_CHANNELS } from '@shared'

declare module '@renderer/shared/lib/undo-store' {
  interface UndoPayloadRegistry {
    [GIT_CHANNELS.CREATE_BRANCH]: { branchName: string; previousBranch: string }
    [GIT_CHANNELS.CHECKOUT_BRANCH]: { branchName: string; previousBranch: string }
  }
}
