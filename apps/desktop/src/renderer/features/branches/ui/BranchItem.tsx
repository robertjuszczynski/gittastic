import React, { useState } from 'react'
import type { GitBranch } from '@shared'
import { useCheckoutBranch, useMergeBranch } from '../api/useBranches'
import { BranchIcon } from '@renderer/shared/ui/icons'
import ContextMenu from '@renderer/shared/ui/ContextMenu'
import { useToast } from '@renderer/shared/ui/ToastContext'

type BranchItemProps = {
  branch: GitBranch
  indent?: number
}

const BranchItem = ({ branch, indent = 0 }: BranchItemProps) => {
  const checkout = useCheckoutBranch()
  const mergeBranch = useMergeBranch()
  const { showToast } = useToast()
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)

  const handleMerge = async () => {
    setMenuPos(null)
    try {
      const { hasConflicts } = await mergeBranch(branch.name)
      showToast(hasConflicts ? `Merged with conflicts — resolve them to finish` : `Merged "${branch.name}"`, hasConflicts ? 'error' : 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Merge failed', 'error')
    }
  }

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer hover:bg-surface-2 h-[26px] ${indent > 0 ? 'pl-3' : 'pl-[15px]'}`}
      onDoubleClick={() => checkout(branch.name)}
      onContextMenu={e => {
        if (branch.current) return
        e.preventDefault()
        setMenuPos({ x: e.clientX, y: e.clientY })
      }}
    >
      {branch.current ? (
        <span className='text-neutral-200 text-[11px] w-3 flex items-center justify-center'>✓</span>
      ) : (
        <span className='text-neutral-500 w-3 flex items-center justify-center'>
          <BranchIcon />
        </span>
      )}
      <span className='text-[12px] font-medium truncate'>
        {branch.name.includes('/') ? branch.name.split('/').slice(1).join('/') : branch.name}
      </span>

      {menuPos && (
        <ContextMenu
          x={menuPos.x}
          y={menuPos.y}
          onClose={() => setMenuPos(null)}
          items={[
            { type: 'action', label: `Merge "${branch.name}" into current branch`, onClick: handleMerge },
          ]}
        />
      )}
    </div>
  )
}

export default BranchItem
