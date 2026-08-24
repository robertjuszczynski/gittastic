import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, Trash2 } from 'lucide-react'
import type { ThemeId } from '@shared'
import { BUILT_IN_THEME_MAP, BUILT_IN_THEMES } from '@shared'
import { useThemeEditor, type EditorMode } from '@renderer/features/theme'
import { useThemeStore } from '@renderer/features/theme'
import { TokenEditor } from './TokenEditor'

type Props = {
  mode: EditorMode
  onClose: () => void
}

function BaseSelector({
  value,
  onChange,
}: {
  value: ThemeId
  onChange: (id: ThemeId) => void
}) {
  const builtIns = BUILT_IN_THEMES.filter(t => t.id !== 'system')
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as ThemeId)}
      className='text-xs px-2 py-1 rounded border border-border bg-surface text-text focus:outline-none focus:border-accent'
    >
      {builtIns.map(t => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  )
}

export function ThemeCreatorModal({ mode, onClose }: Props) {
  const editor = useThemeEditor(mode)
  const switchTheme = useThemeStore(s => s.switchTheme)
  const updateCustomThemes = useThemeStore(s => s.updateCustomThemes)
  const scrollRef = useRef<HTMLDivElement>(null)

  const title =
    mode.mode === 'create'
      ? 'New Theme'
      : mode.mode === 'duplicate'
        ? 'Duplicate Theme'
        : 'Edit Theme'

  const isEditMode = mode.mode === 'edit'
  const isCustom = isEditMode && !BUILT_IN_THEME_MAP.has(mode.themeId)

  const handleSave = async () => {
    const saved = await editor.save()
    updateCustomThemes(await window.electron.GET_THEMES().then(ts => ts.filter(t => t.isCustom)))
    await switchTheme(saved.id)
    onClose()
  }

  const handleCancel = () => {
    editor.cancel()
    onClose()
  }

  const handleDelete = async () => {
    await editor.deleteTheme()
    const themes = await window.electron.GET_THEMES()
    updateCustomThemes(themes.filter(t => t.isCustom))
    await switchTheme('gitastic-light')
    onClose()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const modal = (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/50' onClick={handleCancel} />
      <div
        className='relative z-10 flex flex-col bg-surface border border-border rounded-xl shadow-2xl'
        style={{ width: 600, maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0'>
          <h2 className='text-sm font-semibold text-text'>{title}</h2>
          <button
            type='button'
            onClick={handleCancel}
            className='text-text-muted hover:text-text transition-colors'
          >
            <X size={16} />
          </button>
        </div>

        {/* Name + Base row */}
        <div className='flex items-center gap-4 px-5 py-3 border-b border-border flex-shrink-0'>
          <div className='flex-1'>
            <label className='text-[11px] text-text-muted uppercase tracking-wider block mb-1'>
              Name
            </label>
            <input
              type='text'
              value={editor.name}
              onChange={e => editor.setName(e.target.value)}
              placeholder='My Theme'
              autoFocus
              className='w-full text-sm px-2.5 py-1.5 rounded border border-border bg-bg text-text focus:outline-none focus:border-accent'
            />
          </div>
          <div>
            <label className='text-[11px] text-text-muted uppercase tracking-wider block mb-1'>
              Base
            </label>
            <BaseSelector value={editor.base} onChange={editor.changeBase} />
          </div>
          <div>
            <label className='text-[11px] text-text-muted uppercase tracking-wider block mb-1'>
              Slug
            </label>
            <span className='text-xs font-mono text-text-muted'>{editor.slug}</span>
          </div>
        </div>

        {/* Token editor scrollable body */}
        <div ref={scrollRef} className='flex-1 overflow-y-auto px-5 py-4'>
          {editor.isLoading ? (
            <div className='flex items-center justify-center h-32 text-text-muted text-sm'>
              Loading…
            </div>
          ) : (
            <TokenEditor
              effectiveTokens={editor.effectiveTokens}
              colorOverrides={editor.colorOverrides}
              componentOverrides={editor.componentOverrides}
              fontOverrides={editor.fontOverrides}
              extras={editor.extras}
              setColor={editor.setColor}
              resetColor={editor.resetColor}
              setFont={editor.setFont}
              setComponentToken={editor.setComponentToken}
              setExtra={editor.setExtra}
              removeExtra={editor.removeExtra}
            />
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-5 py-3 border-t border-border flex-shrink-0'>
          <div>
            {isCustom && (
              <button
                type='button'
                onClick={handleDelete}
                className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border text-remove hover:bg-remove-bg transition-colors'
              >
                <Trash2 size={12} />
                Delete
              </button>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => editor.exportJson()}
              className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text hover:bg-surface-2 transition-colors'
            >
              <Download size={12} />
              Export JSON
            </button>
            <button
              type='button'
              onClick={handleCancel}
              className='text-xs px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text hover:bg-surface-2 transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSave}
              disabled={!editor.name.trim()}
              className='text-xs px-4 py-1.5 rounded-md bg-accent text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
