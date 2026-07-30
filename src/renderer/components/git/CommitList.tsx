import React from 'react'
import { useCommits } from '@renderer/hooks/useGitCommits'
import CommitItem from './CommitItem'
import UncommittedItem from './UncommittedItem'

const CommitList = () => {
  const { data: rows = [] } = useCommits()
  return (
    <>
      <UncommittedItem />
      {rows.map((row, i) => (
        <CommitItem key={row.commit.hash} row={row} index={i} />
      ))}
    </>
  )
}

export default CommitList
