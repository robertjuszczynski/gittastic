import React from 'react'
import type { GitBranch } from '@shared'
import { useCheckoutBranch } from '@renderer/hooks/useGitBranches'
import BranchIcon from '@renderer/components/icons/BranchIcon'

type BranchItemProps = {
  branch: GitBranch
  indent?: number
}

const BranchItem = ({ branch, indent = 0 }: BranchItemProps) => {
  const checkout = useCheckoutBranch()

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer hover:bg-surface-2 h-[26px] ${indent > 0 ? 'pl-3' : 'pl-[15px]'}`}
      onDoubleClick={() => checkout(branch.name)}
    >
      {branch.current ? (
        <span className='text-neutral-200 text-[11px] w-3 flex items-center justify-center'>✓</span>
      ) : (
        <span className='text-neutral-500 w-3 flex items-center justify-center'>
          <BranchIcon />
        </span>
      )}
      <span
        className='text-[12px] font-medium truncate'
      >
        {branch.name.includes('/') ? branch.name.split('/').slice(1).join('/') : branch.name}
      </span>
    </div>
  )
}

export default BranchItem
