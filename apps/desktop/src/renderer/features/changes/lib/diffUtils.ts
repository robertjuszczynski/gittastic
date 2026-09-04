import { diffArrays } from 'diff'

export const IMAGE_EXTENSIONS_MAP = new Map<string, string>([
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['png', 'image/png'],
  ['gif', 'image/gif'],
  ['webp', 'image/webp'],
  ['bmp', 'image/bmp'],
  ['svg', 'image/svg+xml'],
  ['ico', 'image/x-icon'],
  ['avif', 'image/avif'],
  ['tif', ''],
  ['tiff', ''],
  ['eps', ''],
  ['heic', ''],
  ['heif', ''],
  ['psd', ''],
  ['psb', ''],
  ['wmf', ''],
  ['xcf', ''],
  ['dng', ''],
])

export const isImageFile = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? IMAGE_EXTENSIONS_MAP.has(ext) : false
}

export function splitLines(s: string): string[] {
  if (!s) return []
  const lines = s.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}

export function computeStagedLines(
  head: string,
  indexed: string,
  workingTree: string,
): { additions: Set<number>; removals: Set<number> } {
  const additions = new Set<number>()
  const removals = new Set<number>()
  const headLines = splitLines(head)
  const indexLines = splitLines(indexed)
  const wtLines = splitLines(workingTree)

  const stagedWtPositions = new Set<number>()
  let wtPos = 0
  for (const part of diffArrays(indexLines, wtLines)) {
    if (part.added) {
      wtPos += part.count!
    } else if (!part.removed) {
      for (let i = 0; i < part.count!; i++) stagedWtPositions.add(++wtPos)
    }
  }

  const stagedHeadRemovals = new Set<number>()
  let headPos = 0
  for (const part of diffArrays(headLines, indexLines)) {
    if (part.removed) {
      for (let i = 0; i < part.count!; i++) stagedHeadRemovals.add(++headPos)
    } else if (!part.added) {
      headPos += part.count!
    }
  }

  headPos = 0
  wtPos = 0
  for (const part of diffArrays(headLines, wtLines)) {
    if (part.removed) {
      for (let i = 0; i < part.count!; i++) {
        headPos++
        if (stagedHeadRemovals.has(headPos)) removals.add(headPos)
      }
    } else if (part.added) {
      for (let i = 0; i < part.count!; i++) {
        wtPos++
        if (stagedWtPositions.has(wtPos)) additions.add(wtPos)
      }
    } else {
      headPos += part.count!
      wtPos += part.count!
    }
  }

  return { additions, removals }
}
