import type { MergeMessage } from '@shared'

/**
 * Parses the contents of `.git/MERGE_MSG` intonthe title/description pair used to pre-fill the commit draft after a
 * merge attempt.
*/
export function parseMergeMessage(raw: string): MergeMessage {
  const lines = raw.split('\n').filter(line => !line.startsWith('#'))
  const title = lines[0] ?? ''
  const description = lines.slice(1).join('\n').trim()
  return { title, description }
}
