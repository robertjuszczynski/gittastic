import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDownIcon } from '@renderer/shared/ui/icons'

type SidebarSectionProps = {
  id: string
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  onRemove?: () => void
  onAdd?: () => void
  onAddFolder?: () => void
  dragHandle?: React.ReactNode
}

const SidebarSection = ({ title, children, defaultOpen = true, onRemove, onAdd, onAddFolder, dragHandle }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className='select-none border-t border-t-white/5'>
      <div
        className='flex items-center gap-1 py-1 cursor-pointer hover:bg-surface-2 group h-7'
        onClick={() => setIsOpen(v => !v)}
      >
        {dragHandle}
        <motion.span
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className='text-neutral-400 flex items-center'
        >
          <ChevronDownIcon size={13} />
        </motion.span>
        <span className='text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex-1'>{title}</span>
        {onAddFolder && (
          <span
            className='text-neutral-600 hover:text-neutral-300 opacity-50 group-hover:opacity-100 transition-opacity px-1 flex items-center'
            onClick={e => { e.stopPropagation(); onAddFolder() }}
            title='New folder'
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 2.5C1 2.22 1.22 2 1.5 2H3.88C4.06 2 4.24 2.07 4.37 2.2L5.13 3H8.5C8.78 3 9 3.22 9 3.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 4.5C1 4.22 1.22 4 1.5 4H10.5C10.78 4 11 4.22 11 4.5V9.5C11 9.78 10.78 10 10.5 10H1.5C1.22 10 1 9.78 1 9.5V4.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M6 6.5V8.5M5 7.5H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
        )}
        {onAdd && (
          <span
            className='text-neutral-600 hover:text-neutral-300 text-[13px] opacity-50 group-hover:opacity-100 transition-opacity px-1'
            onClick={e => { e.stopPropagation(); onAdd() }}
          >
            +
          </span>
        )}
        {onRemove && (
          <span
            className='text-neutral-600 hover:text-neutral-300 text-[13px] opacity-50 group-hover:opacity-100 transition-opacity px-1'
            onClick={e => { e.stopPropagation(); onRemove() }}
          >
            ×
          </span>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SidebarSection
