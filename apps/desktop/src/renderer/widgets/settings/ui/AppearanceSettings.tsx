import React from 'react'
import { Trash2, FolderOpen, Upload } from 'lucide-react'
import { cn } from '@renderer/shared/lib'
import { useTheme, useThemeStore } from '@renderer/features/theme'
import type { ThemeDefinition } from '@shared'

function ThemeSwatches({ tokens }: { tokens: ThemeDefinition['tokens'] }) {
  return (
    <div className='flex gap-[3px] mt-2'>
      {[tokens.colors.bg, tokens.colors.surface, tokens.colors.accent, tokens.colors.text].map((color, i) => (
        <span
          key={i}
          className='w-4 h-4 rounded-full border border-border'
          style={{ background: color }}
        />
      ))}
    </div>
  )
}

type ThemeCardProps = {
  theme: ThemeDefinition
  isActive: boolean
  onSelect: () => void
  onDelete?: () => void
}

function ThemeCard({ theme, isActive, onSelect, onDelete }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-150',
        isActive
          ? 'border-accent bg-accent-glow ring-1 ring-accent'
          : 'border-border bg-surface hover:border-accent/40 hover:bg-surface-2'
      )}
    >
      <div
        className='w-full h-14 rounded-md border border-border mb-2 overflow-hidden'
        style={{ background: theme.tokens.colors.bg }}
      >
        <div className='flex h-full'>
          <div className='w-1/3 h-full border-r border-[var(--preview-border)]' style={{
            background: theme.tokens.components?.sidebar?.bg ?? theme.tokens.colors.surface,
            borderColor: theme.tokens.colors.border,
          }} />
          <div className='flex-1 flex flex-col'>
            <div className='h-4 border-b flex items-center px-2 gap-1' style={{
              background: theme.tokens.components?.toolbar?.bg ?? theme.tokens.colors.surface,
              borderColor: theme.tokens.colors.border,
            }}>
              <span className='w-8 h-1.5 rounded-full' style={{ background: theme.tokens.colors.accent }} />
            </div>
            <div className='flex-1 flex items-center justify-center'>
              <span className='w-10 h-1 rounded-full' style={{ background: theme.tokens.colors.textMuted }} />
            </div>
          </div>
        </div>
      </div>

      <span className={cn('text-xs font-medium', isActive ? 'text-accent' : 'text-text')}>
        {theme.name}
      </span>
      <ThemeSwatches tokens={theme.tokens} />

      {isActive && (
        <span className='absolute top-2 right-2 w-2 h-2 rounded-full bg-accent' />
      )}

      {onDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-remove-bg text-text-muted hover:text-remove'
        >
          <Trash2 size={12} />
        </button>
      )}
    </button>
  )
}

const AppearanceSettings = () => {
  const { activeTheme, availableThemes, switchTheme } = useTheme()
  const { setAvailableThemes } = useThemeStore()

  const builtInThemes = availableThemes.filter(t => !t.isCustom && t.id !== 'system')
  const systemTheme = availableThemes.find(t => t.id === 'system')
  const customThemes = availableThemes.filter(t => t.isCustom)

  const handleImport = async () => {
    const imported = await window.electron.IMPORT_THEME()
    if (imported) {
      const themes = await window.electron.GET_THEMES()
      setAvailableThemes(themes)
    }
  }

  const handleDelete = async (id: string) => {
    await window.electron.DELETE_CUSTOM_THEME(id)
    const themes = await window.electron.GET_THEMES()
    setAvailableThemes(themes)
  }

  const handleOpenFolder = () => window.electron.OPEN_THEMES_FOLDER()

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h3 className='text-sm font-medium text-text mb-3'>Built-in themes</h3>
        <div className='grid grid-cols-3 gap-2'>
          {systemTheme && (
            <ThemeCard
              theme={{ ...systemTheme, name: 'Follow System' }}
              isActive={activeTheme?.id === 'system'}
              onSelect={() => switchTheme('system')}
            />
          )}
          {builtInThemes.map(theme => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={activeTheme?.id === theme.id}
              onSelect={() => switchTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {customThemes.length > 0 && (
        <div>
          <h3 className='text-sm font-medium text-text mb-3'>Custom themes</h3>
          <div className='grid grid-cols-3 gap-2'>
            {customThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={activeTheme?.id === theme.id}
                onSelect={() => switchTheme(theme.id)}
                onDelete={() => handleDelete(theme.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className='flex gap-2 pt-2 border-t border-border'>
        <button
          onClick={handleImport}
          className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text hover:bg-surface-2 transition-colors'
        >
          <Upload size={12} />
          Import theme
        </button>
        <button
          onClick={handleOpenFolder}
          className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-text hover:bg-surface-2 transition-colors'
        >
          <FolderOpen size={12} />
          Open themes folder
        </button>
      </div>
    </div>
  )
}

export default AppearanceSettings
