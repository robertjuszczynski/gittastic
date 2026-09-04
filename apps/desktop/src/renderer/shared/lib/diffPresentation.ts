import { DiffMethod } from 'react-diff-viewer-continued'
import { getFileExtensionFromPath } from './file-status'

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
