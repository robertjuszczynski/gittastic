import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import { useCommandPaletteStore } from '../model/useCommandPaletteStore'
import type { Command } from '../lib/types'

function resolveDisabled(cmd: Command): boolean {
  return typeof cmd.disabled === 'function' ? cmd.disabled() : (cmd.disabled ?? false)
}

function groupBySection(commands: Command[]): [string, Command[]][] {
  const map = new Map<string, Command[]>()
  for (const cmd of commands) {
    const key = cmd.section ?? 'General'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(cmd)
  }
  return Array.from(map.entries())
}

export function CommandPalette() {
  const isOpen = useCommandPaletteStore((s) => s.isOpen)
  const close = useCommandPaletteStore((s) => s.close)
  const commands = useCommandPaletteStore((s) => s.commands)

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        useCommandPaletteStore.getState().toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  const fuse = useMemo(
    () => new Fuse(commands, { keys: ['label', 'keywords'], threshold: 0.4 }),
    [commands]
  )

  const results: Command[] = query ? fuse.search(query).map((r) => r.item) : commands
  const groups = query ? null : groupBySection(results)
  const orderedResults = groups ? groups.flatMap(([, cmds]) => cmds) : results
  const indexMap = new Map(orderedResults.map((cmd, i) => [cmd.id, i]))

  useEffect(() => {
    resultsRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  function execute(cmd: Command) {
    if (resolveDisabled(cmd)) return
    close()
    cmd.execute()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, orderedResults.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (orderedResults[activeIndex]) execute(orderedResults[activeIndex])
        break
      case 'Escape':
        close()
        break
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-start justify-center pt-[15vh]'
          onKeyDown={onKeyDown}
        >
          <motion.div
            className='absolute inset-0 bg-black/50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={close}
          />

          <motion.div
            className='relative z-10 mx-4 w-full max-w-[600px] overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl'
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className='flex items-center gap-3 border-b border-neutral-700 px-4 py-3'>
              <Search size={15} className='shrink-0 text-neutral-400' />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                placeholder='Search commands...'
                className='flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 outline-none'
              />
            </div>

            <div ref={resultsRef} className='max-h-[400px] overflow-y-auto py-1'>
              {orderedResults.length === 0 ? (
                <p className='px-4 py-8 text-center text-sm text-neutral-500'>No commands found</p>
              ) : groups ? (
                groups.map(([section, cmds]) => (
                  <div key={section}>
                    <p className='px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500'>
                      {section}
                    </p>
                    {cmds.map((cmd) => (
                      <CommandItem
                        key={cmd.id}
                        cmd={cmd}
                        isActive={indexMap.get(cmd.id) === activeIndex}
                        isDisabled={resolveDisabled(cmd)}
                        onClick={() => execute(cmd)}
                        onMouseEnter={() => setActiveIndex(indexMap.get(cmd.id)!)}
                      />
                    ))}
                  </div>
                ))
              ) : (
                results.map((cmd, i) => (
                  <CommandItem
                    key={cmd.id}
                    cmd={cmd}
                    isActive={i === activeIndex}
                    isDisabled={resolveDisabled(cmd)}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setActiveIndex(i)}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

type CommandItemProps = {
  cmd: Command
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
  onMouseEnter: () => void
}

function CommandItem({ cmd, isActive, isDisabled, onClick, onMouseEnter }: CommandItemProps) {
  return (
    <button
      data-active={isActive}
      onClick={() => { if (!isDisabled) onClick() }}
      onMouseEnter={onMouseEnter}
      className={[
        'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
        isActive ? 'bg-neutral-700' : 'hover:bg-neutral-800',
        isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-default',
      ].join(' ')}
    >
      {cmd.icon && <span className='shrink-0 text-neutral-400'>{cmd.icon}</span>}
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm text-neutral-100'>{cmd.label}</p>
        {cmd.description && (
          <p className='truncate text-xs text-neutral-500'>{cmd.description}</p>
        )}
      </div>
      {cmd.shortcut && (
        <div className='flex shrink-0 items-center gap-1'>
          {cmd.shortcut.map((key, i) => (
            <kbd
              key={i}
              className='rounded border border-neutral-600 bg-neutral-800 px-1.5 py-0.5 font-mono text-[11px] text-neutral-400'
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
    </button>
  )
}
