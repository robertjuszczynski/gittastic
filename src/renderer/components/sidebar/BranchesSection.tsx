import React from 'react'
import { useBranches } from '@renderer/hooks/useGit'
import BranchItem from './BranchItem'
import BranchFolder from './BranchFolder'

const BranchesSection = () => {
  const { data: branches = [], isLoading, isError, error } = useBranches()
  if (isLoading) return <div className='px-3 py-1 text-[11px] text-neutral-600'>Loading...</div>
  if (isError) return <div className='px-3 py-1 text-[11px] text-red-500'>{String(error)}</div>

  const flat: typeof branches = []
  const folders: Record<string, typeof branches> = {}

  for (const branch of branches) {
    const slashIdx = branch.name.indexOf('/')
    if (slashIdx !== -1) {
      const prefix = branch.name.slice(0, slashIdx)
      ;(folders[prefix] ??= []).push(branch)
    } else {
      flat.push(branch)
    }
  }

  return (
    <div>
      {Object.entries(folders).map(([prefix, items]) => (
        <BranchFolder key={prefix} prefix={prefix} branches={items} />
      ))}
      {flat.map(b => <BranchItem key={b.name} branch={b} />)}
    </div>
  )
}

export default BranchesSection
