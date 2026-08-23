import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ChevronDownIcon from '@renderer/shared/ui/icons/ChevronDownIcon'

type SidebarSectionProps = {
  id: string
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  onRemove?: () => void
  dragHandle?: React.ReactNode
}

const SidebarSection = ({ title, children, defaultOpen = true, onRemove, dragHandle }: SidebarSectionProps) => {
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
        {onRemove && (
          <span
            className='text-neutral-600 hover:text-neutral-300 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity px-1'
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
