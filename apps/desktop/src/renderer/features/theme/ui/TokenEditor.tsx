import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type {
  ThemeColorTokens,
  ThemeComponentTokens,
  ThemeDefinition,
  ThemeExtras,
  ThemeFontTokens,
} from '@shared'
import { cn } from '@renderer/shared/lib'
import { ColorTokenRow } from './ColorTokenRow'
import { ExtrasEditor } from './ExtrasEditor'

type Props = {
  effectiveTokens: ThemeDefinition['tokens']
  colorOverrides: Partial<ThemeColorTokens>
  componentOverrides: ThemeComponentTokens
  fontOverrides: ThemeFontTokens
  extras: ThemeExtras
  setColor: (key: keyof ThemeColorTokens, value: string) => void
  resetColor: (key: keyof ThemeColorTokens) => void
  setFont: (key: keyof ThemeFontTokens, value: string) => void
  setComponentToken: <
    C extends keyof ThemeComponentTokens,
    K extends keyof NonNullable<ThemeComponentTokens[C]>
  >(component: C, key: K, value: string) => void
  setExtra: (key: string, value: string) => void
  removeExtra: (key: string) => void
}

const COLOR_LABELS: Record<keyof ThemeColorTokens, string> = {
  bg: 'Background',
  surface: 'Surface',
  surface2: 'Surface 2',
  text: 'Text',
  textSecondary: 'Text Secondary',
  textMuted: 'Text Muted',
  border: 'Border',
  divider: 'Divider',
  neutral100: 'Neutral 100',
  neutral200: 'Neutral 200',
  neutral300: 'Neutral 300',
  neutral400: 'Neutral 400',
  neutral500: 'Neutral 500',
  neutral600: 'Neutral 600',
  neutral700: 'Neutral 700',
  neutral800: 'Neutral 800',
  neutral900: 'Neutral 900',
  accent: 'Accent',
  accentDim: 'Accent Dim',
  accentGlow: 'Accent Glow',
  add: 'Added',
  addBg: 'Added Background',
  remove: 'Removed',
  removeBg: 'Removed Background',
}

const COMPONENT_LABELS: Record<keyof ThemeComponentTokens, string> = {
  toolbar: 'Toolbar',
  sidebar: 'Sidebar',
  divider: 'Divider',
  slider: 'Slider',
  scrollbar: 'Scrollbar',
  input: 'Input',
  button: 'Button',
  modal: 'Modal',
  badge: 'Badge',
  tab: 'Tab',
  commitList: 'Commit List',
  diffAdd: 'Diff Added',
  diffRemove: 'Diff Removed',
}

function formatSubKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
}

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className='border border-border rounded-lg overflow-hidden'>
      <button
        type='button'
        onClick={() => setOpen(o => !o)}
        className='w-full flex items-center justify-between px-3 py-2.5 bg-surface hover:bg-surface-2 transition-colors text-left'
      >
        <span className='text-xs font-medium text-text'>{title}</span>
        <ChevronRight
          size={14}
          className={cn('text-text-muted transition-transform', open && 'rotate-90')}
        />
      </button>
      {open && <div className='px-2 py-2 border-t border-border'>{children}</div>}
    </div>
  )
}

export function TokenEditor({
  effectiveTokens,
  colorOverrides,
  componentOverrides,
  fontOverrides,
  extras,
  setColor,
  resetColor,
  setFont,
  setComponentToken,
  setExtra,
  removeExtra,
}: Props) {
  const colorKeys = Object.keys(COLOR_LABELS) as (keyof ThemeColorTokens)[]
  const componentKeys = Object.keys(COMPONENT_LABELS) as (keyof ThemeComponentTokens)[]

  return (
    <div className='flex flex-col gap-2'>
      <AccordionSection title='Global Colors' defaultOpen>
        {colorKeys.map(key => (
          <ColorTokenRow
            key={key}
            label={COLOR_LABELS[key]}
            value={effectiveTokens.colors[key]}
            isOverridden={key in colorOverrides}
            onChange={val => setColor(key, val)}
            onReset={() => resetColor(key)}
          />
        ))}
      </AccordionSection>

      <AccordionSection title='Components'>
        {componentKeys.map(component => {
          const componentTokens = effectiveTokens.components?.[component]
          if (!componentTokens) return null
          return (
            <div key={component} className='mb-3 last:mb-0'>
              <p className='text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1'>
                {COMPONENT_LABELS[component]}
              </p>
              {(Object.entries(componentTokens) as [string, string][]).map(([subKey, value]) => (
                <ColorTokenRow
                  key={`${component}.${subKey}`}
                  label={formatSubKey(subKey)}
                  value={value}
                  isOverridden={
                    !!componentOverrides[component] &&
                    subKey in (componentOverrides[component] as Record<string, unknown>)
                  }
                  onChange={val =>
                    setComponentToken(
                      component as keyof ThemeComponentTokens,
                      subKey as never,
                      val
                    )
                  }
                />
              ))}
            </div>
          )
        })}
      </AccordionSection>

      <AccordionSection title='Fonts'>
        <div className='flex flex-col gap-2 px-2 py-1'>
          {(['sans', 'mono'] as const).map(key => (
            <div key={key} className='flex items-center gap-2'>
              <span className='flex-1 text-xs text-text-secondary capitalize'>{key}</span>
              <input
                type='text'
                value={fontOverrides[key] ?? effectiveTokens.fonts?.[key] ?? ''}
                onChange={e => setFont(key, e.target.value)}
                placeholder={effectiveTokens.fonts?.[key] ?? ''}
                className='w-48 text-xs px-2 py-0.5 rounded border border-border bg-surface text-text font-mono focus:outline-none focus:border-accent'
                spellCheck={false}
              />
            </div>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title='Extras'>
        <ExtrasEditor extras={extras} onSet={setExtra} onRemove={removeExtra} />
      </AccordionSection>
    </div>
  )
}
