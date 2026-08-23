import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { GitBranch } from '@shared'
import BranchItem from './BranchItem'
import ChevronDownIcon from '@renderer/shared/ui/icons/ChevronDownIcon'
import FolderIcon from '@renderer/shared/ui/icons/FolderIcon'

type BranchFolderProps = {
  prefix: string
  branches: GitBranch[]
}

const BranchFolder = ({ prefix, branches }: BranchFolderProps) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <div
        className='flex items-center gap-1 cursor-pointer hover:bg-surface-2 select-none h-[26px] pl-[14px]'
        onClick={() => setIsOpen(v => !v)}
      >
        <motion.span
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.12 }}
          className='text-neutral-500 flex items-center'
        >
          <ChevronDownIcon />
        </motion.span>
        <span className='text-neutral-400 flex items-center'>
          <FolderIcon open={isOpen} />
        </span>
        <span className='text-[12px] font-medium text-neutral-200 ml-0.5'>{prefix}</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='overflow-hidden'
          >
            <div className='ml-[18px] border-l border-l-white/[0.07]'>
              {branches.map(b => (
                <BranchItem key={b.name} branch={b} indent={1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BranchFolder
