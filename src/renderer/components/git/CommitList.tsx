import React from 'react'
import { useCommits } from '@renderer/hooks/useCommits'
import CommitItem from './CommitItem'

const CommitList = () => {
  const { data: rows = [] } = useCommits()

  return (
    <>
      {rows.map((row, i) => (
        <CommitItem key={row.commit.hash} row={row} index={i} />
      ))}
    </>
  )
}

export default CommitList
