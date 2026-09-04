import type { StatusResult } from 'simple-git'
import type { FileChange } from '@shared'
import { mapFileStatus } from './mapFileStatus'

/**
 * Splits a simple-git `StatusResult` into staged/unstaged `FileChange` lists.
 *
 * Conflicted files are surfaced once, in `unstaged`, as `'conflicted'`.
 * simple-git reports an unmerged file with BOTH an `index` and a
 * `working_dir` code (e.g. index `D`, working_dir `U` for a delete/modify
 * conflict) — treating those independently, like a plain modified file,
 * puts the same path in both `staged` (as "deleted") and `unstaged` (as
 * "conflicted") at once. `status.conflicted` is the authoritative list of
 * unmerged paths, so it's checked first and short-circuits the split.
 */
export function splitStatusFiles(status: StatusResult): { staged: FileChange[]; unstaged: FileChange[] } {
  const staged: FileChange[] = []
  const unstaged: FileChange[] = []
  const conflicted = new Set(status.conflicted)

  for (const file of status.files) {
    if (conflicted.has(file.path)) {
      unstaged.push({ path: file.path, status: 'conflicted', oldPath: file.from })
      continue
    }
    if (file.index && file.index !== ' ' && file.index !== '?') {
      staged.push({ path: file.path, status: mapFileStatus(file.index), oldPath: file.from })
    }
    if (file.working_dir && file.working_dir !== ' ') {
      unstaged.push({ path: file.path, status: mapFileStatus(file.working_dir), oldPath: file.from })
    }
  }

  return { staged, unstaged }
}
