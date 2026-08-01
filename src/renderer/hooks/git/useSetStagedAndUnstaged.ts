import type { StatusResult } from 'simple-git'
import type { FileChange, FileChangeStatus } from '@shared'
import { useChangesStore } from '@renderer/store/useChangesStore'

const STATUS_MAP: Record<string, FileChangeStatus> = {
  M: 'modified',
  A: 'added',
  D: 'deleted',
  R: 'renamed',
  '?': 'untracked',
  U: 'conflicted',
}

function mapStatus(code: string): FileChangeStatus {
  return STATUS_MAP[code] ?? 'modified'
}

export const useSetStagedAndUnstaged = () => {
  const setStagedAndUnstaged = useChangesStore(s => s.setStagedAndUnstaged)

  return (status: StatusResult) => {
    const staged: FileChange[] = []
    const unstaged: FileChange[] = []

    for (const file of status.files) {
      if (file.index && file.index !== ' ' && file.index !== '?') {
        staged.push({ path: file.path, status: mapStatus(file.index), oldPath: file.from })
      }
      if (file.working_dir && file.working_dir !== ' ') {
        unstaged.push({ path: file.path, status: mapStatus(file.working_dir), oldPath: file.from })
      }
    }

    setStagedAndUnstaged(staged, unstaged)
  }
}
