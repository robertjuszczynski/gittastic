import React from 'react'

const UncommittedPanel = () => {
  return (
    <div className='flex flex-1 min-h-0 h-full'>
      <div className='flex flex-col w-64 shrink-0' style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}>
        <div className='flex-1 min-h-0' style={{ background: 'rgba(229,62,62,0.08)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>Unstaged</div>
        </div>
        <div className='flex-1 min-h-0' style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>Staged</div>
        </div>
        <div className='shrink-0' style={{ height: 120, background: 'rgba(27,112,248,0.08)' }}>
          <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>Commit</div>
        </div>
      </div>
      <div className='flex-1' style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className='px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider'>Diff</div>
      </div>
    </div>
  )
}

export default UncommittedPanel
