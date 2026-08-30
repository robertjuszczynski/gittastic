import React, { useRef, useEffect } from 'react'

type ContextMenuItemBase = {
  label: string
  className?: string
}

type ContextMenuAction = ContextMenuItemBase & {
  type: 'action'
  onClick: () => void
}

type ContextMenuDivider = {
  type: 'divider'
  label: string
}

export type ContextMenuItem = ContextMenuAction | ContextMenuDivider

type ContextMenuProps = {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

const ContextMenu = ({ x, y, items, onClose }: ContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose])

  return (
    <div
      ref={ref}
      className='fixed z-50 min-w-[140px] bg-surface border border-white/10 rounded shadow-lg py-0.5 text-[12px] text-neutral-200'
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => {
        if (item.type === 'divider') {
          return (
            <div key={i} className='px-3 py-1 text-neutral-500 text-[11px]'>
              {item.label}
            </div>
          )
        }
        return (
          <button
            key={i}
            className={`w-full text-left px-3 py-1 hover:bg-surface-2 ${item.className ?? ''}`}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default ContextMenu
