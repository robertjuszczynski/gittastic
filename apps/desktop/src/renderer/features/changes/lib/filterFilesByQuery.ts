import type { FileChange } from '@shared'

/** Case-insensitive substring match against the full file path. Empty/blank query matches everything. */
export function filterFilesByQuery(files: FileChange[], query: string): FileChange[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return files
  return files.filter(f => f.path.toLowerCase().includes(trimmed))
}
