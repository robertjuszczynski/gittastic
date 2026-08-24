import React, { useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@renderer/shared/lib'

type Props = {
  label: string
  value: string
  isOverridden: boolean
  onChange: (value: string) => void
  onReset?: () => void
}

function toPickerHex(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color
  return '#000000'
}

export function ColorTokenRow({ label, value, isOverridden, onChange, onReset }: Props) {
  const pickerRef = useRef<HTMLInputElement>(null)

  return (
    <div className='flex items-center gap-2 py-1.5 px-2 rounded hover:bg-surface-2 group'>
      <button
        type='button'
        onClick={() => pickerRef.current?.click()}
        className='w-5 h-5 rounded-full border border-border flex-shrink-0 cursor-pointer'
        style={{ background: value }}
        title='Pick color'
      />
      <input
        ref={pickerRef}
        type='color'
        value={toPickerHex(value)}
        onChange={e => onChange(e.target.value)}
        className='sr-only'
        tabIndex={-1}
      />
      <span className={cn('flex-1 text-xs', isOverridden ? 'text-text font-medium' : 'text-text-secondary')}>
        {label}
      </span>
      <input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        className='w-28 text-xs px-2 py-0.5 rounded border border-border bg-surface text-text font-mono text-right focus:outline-none focus:border-accent'
        spellCheck={false}
      />
      <div className='w-5 flex-shrink-0'>
        {isOverridden && onReset && (
          <button
            type='button'
            onClick={onReset}
            className='opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text'
            title='Reset to base'
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>
    </div>
  )
}
