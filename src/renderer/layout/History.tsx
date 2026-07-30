import React from 'react'

type HistoryProps = {
  children?: React.ReactNode
}

const History = ({ children }: HistoryProps) => {
  return (
    <div
      className='w-112.5 shrink-0 overflow-y-auto flex flex-col'
      style={{
        borderRight: '1px solid rgba(0,0,0,0.07)',
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {children}
    </div>
  )
}

export default History
