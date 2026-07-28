import React, { useEffect, useState } from 'react'
import { CHANNELS } from '@shared'
import { useWorkspaces } from '@renderer/contexts/WorkspacesContext'
import { computeGraphRows, type CommitGraphRow } from '@renderer/utils/computeGraphLanes'
import CommitItem from './CommitItem'

const CommitList = () => {
  const { activePath } = useWorkspaces()
  const [rows, setRows] = useState<CommitGraphRow[]>([])

  useEffect(() => {
    if (!activePath) return
    window.electron[CHANNELS.GET_COMMITS]().then(commits => {
      setRows(computeGraphRows(commits))
    })
  }, [activePath])

  return (
    <>
      {rows.map((row, i) => (
        <CommitItem key={row.commit.hash} row={row} index={i} />
      ))}
    </>
  )
}

export default CommitList
