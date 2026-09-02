import { useEffect } from 'react'
import { useToast } from '@renderer/shared/ui/ToastContext'
import { useUndoStore } from './undo-store'

export function useUndoShortcut() {
  const { showToast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      if (!isCtrlOrCmd || e.code !== 'KeyZ') return

      e.preventDefault()

      if (e.shiftKey) {
        useUndoStore.getState().redo((msg) => showToast(msg, 'error'))
      } else {
        useUndoStore.getState().undo((msg) => showToast(msg, 'error'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showToast])
}
