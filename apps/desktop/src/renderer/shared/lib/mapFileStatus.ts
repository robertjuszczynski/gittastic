import type { FileChangeStatus } from '@shared'

const STATUS_MAP: Record<string, FileChangeStatus> = {
  M: 'modified',
  A: 'added',
  D: 'deleted',
  R: 'renamed',
  '?': 'untracked',
  U: 'conflicted',
}

export function mapFileStatus(code: string): FileChangeStatus {
  return STATUS_MAP[code] ?? 'modified'
}
