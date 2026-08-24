import { DiffMethod } from 'react-diff-viewer-continued'
import { diffArrays } from 'diff'
import { getFileExtensionFromPath } from '@renderer/shared/lib'

export const DiffType = { DEFAULT: 0, ADDED: 1, REMOVED: 2, CHANGED: 3 } as const

const COMPARE_METHOD_MAP: Record<string, DiffMethod> = {
  '.json': DiffMethod.JSON,
  '.yaml': DiffMethod.YAML,
  '.yml': DiffMethod.YAML,
}

export const getCompareMethod = (path: string): DiffMethod => {
  const ext = getFileExtensionFromPath(path)
  if (!ext) return DiffMethod.LINES
  return COMPARE_METHOD_MAP[ext] ?? DiffMethod.LINES
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

export const diffStyles = {
  variables: {
    light: {
      diffViewerBackground: 'transparent',
      gutterBackground: 'transparent',
      gutterBackgroundDark: 'transparent',
      codeFoldBackground: 'transparent',
      codeFoldGutterBackground: 'transparent',
      emptyLineBackground: 'transparent',
      addedBackground: '#d1fae5',
      addedGutterBackground: '#a7f3d0',
      removedBackground: '#fee2e2',
      removedGutterBackground: '#fecaca',
      wordAddedBackground: '#6ee7b7',
      wordRemovedBackground: '#fca5a5',
    },
  },
  contentText: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    fontSize: '12px',
    lineHeight: '20px',
  },
  gutter: {
    minWidth: '40px',
    padding: '0 8px',
  },
  line: {
    '&:hover': {
      background: 'rgba(0,0,0,0.02)',
    },
  },
  codeFoldContent: {
    'white-space': 'nowrap',
  },
  codeFoldContentContainer: {
    overflow: 'visible',
  },
}
