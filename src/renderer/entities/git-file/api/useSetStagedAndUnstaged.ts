import type { StatusResult } from 'simple-git'
import type { FileChange } from '@shared'
import { useChangesStore } from '../model/useChangesStore'
import { mapFileStatus } from '@renderer/shared/lib'

export const useSetStagedAndUnstaged = () => {
  const setStagedAndUnstaged = useChangesStore(s => s.setStagedAndUnstaged)

  return (status: StatusResult) => {
    const staged: FileChange[] = []
    const unstaged: FileChange[] = []

    for (const file of status.files) {
      if (file.index && file.index !== ' ' && file.index !== '?') {
        staged.push({ path: file.path, status: mapFileStatus(file.index), oldPath: file.from })
      }
      if (file.working_dir && file.working_dir !== ' ') {
        unstaged.push({ path: file.path, status: mapFileStatus(file.working_dir), oldPath: file.from })
      }
    }

    setStagedAndUnstaged(staged, unstaged)
  }
}
