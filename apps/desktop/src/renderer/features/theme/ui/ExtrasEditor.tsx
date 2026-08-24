import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { ThemeExtras } from '@shared'

type Props = {
  extras: ThemeExtras
  onSet: (key: string, value: string) => void
  onRemove: (key: string) => void
}

export function ExtrasEditor({ extras, onSet, onRemove }: Props) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAdd = () => {
    const key = newKey.trim()
    const value = newValue.trim()
    if (!key || !value) return
    onSet(key, value)
    setNewKey('')
    setNewValue('')
  }

  return (
    <div className='flex flex-col gap-1'>
      {Object.entries(extras).map(([key, value]) => (
        <div key={key} className='flex items-center gap-2 group'>
          <input
            type='text'
            value={key}
            readOnly
            className='flex-1 text-xs px-2 py-1 rounded border border-border bg-surface text-text-secondary font-mono focus:outline-none'
          />
          <span className='text-text-muted text-xs'>→</span>
          <input
            type='text'
            value={value}
            onChange={e => onSet(key, e.target.value)}
            className='flex-1 text-xs px-2 py-1 rounded border border-border bg-surface text-text font-mono focus:outline-none focus:border-accent'
            spellCheck={false}
          />
          <button
            type='button'
            onClick={() => onRemove(key)}
            className='opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-remove'
          >
            <X size={13} />
          </button>
        </div>
      ))}

      <div className='flex items-center gap-2 mt-1'>
        <input
          type='text'
          placeholder='--css-var-name'
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          className='flex-1 text-xs px-2 py-1 rounded border border-border bg-surface text-text font-mono placeholder:text-text-muted focus:outline-none focus:border-accent'
          spellCheck={false}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <span className='text-text-muted text-xs'>→</span>
        <input
          type='text'
          placeholder='value'
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          className='flex-1 text-xs px-2 py-1 rounded border border-border bg-surface text-text font-mono placeholder:text-text-muted focus:outline-none focus:border-accent'
          spellCheck={false}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button
          type='button'
          onClick={handleAdd}
          className='text-text-muted hover:text-accent transition-colors'
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}
