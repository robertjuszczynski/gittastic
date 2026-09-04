import type { StatusResult } from 'simple-git'
import { useChangesStore } from '../model/useChangesStore'
import { splitStatusFiles } from '@renderer/shared/lib'

export const useSetStagedAndUnstaged = () => {
  const setStagedAndUnstaged = useChangesStore(s => s.setStagedAndUnstaged)

  return (status: StatusResult) => {
    const { staged, unstaged } = splitStatusFiles(status)
    setStagedAndUnstaged(staged, unstaged)
  }
}
