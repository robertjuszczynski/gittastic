import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ONBOARDING_CHANNELS } from '@shared'
import { cn } from '@renderer/shared/lib'

type TRepositoryPageProps = {
  repoPath: string | null
  onChange: (path: string | null) => void
}

const CreateRepoModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: (path: string) => void }) => {
  const [name, setName] = useState('')
  const [parentPath, setParentPath] = useState('')
  const [readme, setReadme] = useState(true)
  const [loading, setLoading] = useState(false)

  const pickFolder = async () => {
    const path = await window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_PICK_FOLDER]()
    if (path) setParentPath(path)
  }

  const create = async () => {
    if (!name.trim() || !parentPath) return
    setLoading(true)
    const path = await window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_CREATE_REPOSITORY]({ name: name.trim(), parentPath, readme })
    setLoading(false)
    if (path) { onCreated(path); onClose() }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className='fixed inset-0 bg-black/45 backdrop-blur-[4px] flex items-center justify-center z-50'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className='w-[380px] bg-surface rounded-[10px] border border-border shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden'
      >
        <div className='px-4 py-3 border-b border-b-divider text-[13px] font-semibold text-text'>
          Create repository
        </div>
        <div className='px-4 py-3 flex flex-col gap-[9px]'>
          <div>
            <label className='block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-[0.07em]'>Name</label>
            <input
              type="text"
              placeholder="my-project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full h-[30px] px-[9px] rounded-[5px] border border-border bg-bg text-text text-[12px] outline-none box-border'
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)' }}
            />
          </div>

          <div>
            <label className='block text-[10px] font-semibold text-text-muted mb-1 uppercase tracking-[0.07em]'>Location</label>
            <div className='flex gap-[6px]'>
              <input
                type="text"
                placeholder="~/Projects"
                value={parentPath}
                readOnly
                className={cn(
                  'flex-1 h-[30px] px-[9px] rounded-[5px] border border-border bg-bg text-[12px] outline-none box-border',
                  parentPath ? 'text-text' : 'text-text-muted'
                )}
              />
              <button
                onClick={pickFolder}
                className='h-[30px] px-[10px] rounded-[5px] border border-border bg-surface-2 text-text-secondary text-[12px] cursor-pointer whitespace-nowrap'
              >
                Browse
              </button>
            </div>
          </div>

          <button
            onClick={() => setReadme(!readme)}
            className='flex items-center gap-2 bg-transparent border-none cursor-pointer p-0'
          >
            <div className={cn(
              'w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center shrink-0 transition-all duration-100',
              readme ? 'border-accent bg-accent' : 'border-border bg-transparent'
            )}>
              {readme && <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span className='text-[12px] text-text-secondary'>Initialize with README</span>
          </button>
        </div>
        <div className='px-4 py-[9px] border-t border-t-divider flex justify-end gap-[7px]'>
          <button onClick={onClose} className='h-[28px] px-3 rounded-[5px] border border-border bg-transparent text-text-secondary text-[12px] font-medium cursor-pointer'>Cancel</button>
          <button
            onClick={create}
            disabled={!name.trim() || !parentPath || loading}
            className={cn('h-[28px] px-[14px] rounded-[5px] border-none bg-accent text-white text-[12px] font-medium cursor-pointer', (!name.trim() || !parentPath || loading) ? 'opacity-50' : '')}
          >
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const actions = [
  {
    id: 'opened' as const,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
    label: 'Open existing',
    desc: 'Select a local repository',
  },
  {
    id: 'cloned' as const,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></svg>,
    label: 'Clone',
    desc: 'From URL or provider',
  },
  {
    id: 'created' as const,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    label: 'Create new',
    desc: 'Start from scratch',
  },
]

const RepositoryPage = ({ repoPath, onChange }: TRepositoryPageProps) => {
  const [showModal, setShowModal] = useState(false)
  const [activeAction, setActiveAction] = useState<'opened' | 'cloned' | 'created' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (id: 'opened' | 'cloned' | 'created') => {
    if (id === 'opened') {
      setError(null)
      const path = await window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_OPEN_REPOSITORY]()
      if (path) {
        setActiveAction('opened')
        onChange(path)
      } else {
        setError('The selected folder is not a Git repository.')
        onChange(null)
      }
    } else if (id === 'created') {
      setShowModal(true)
    }
  }

  return (
    <div className='flex flex-col h-full px-6 pt-[18px] pb-[14px]'>
      <div className='mb-[18px]'>
        <h1 className='text-[22px] font-bold text-text mb-2 tracking-[-0.03em]'>
          Open a repository
        </h1>
        <p className='text-[13px] text-text-muted leading-[1.6]'>
          Start working, or continue and open one later.
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        {actions.map(({ id, icon, label, desc }) => {
          const isAvailable = id !== 'cloned'
          const isSelected = activeAction === id
          return (
            <button
              key={id}
              onClick={isAvailable ? () => handleAction(id) : undefined}
              disabled={!isAvailable}
              className={cn(
                'flex items-center gap-3 px-[14px] py-[10px] rounded-[8px] border text-left w-full transition-[border-color,background] duration-[120ms] ease-linear',
                isSelected ? 'border-accent bg-accent-dim' : 'border-border bg-surface',
                isAvailable ? 'cursor-pointer' : 'cursor-default opacity-50'
              )}
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
              <span className={cn('shrink-0', isSelected ? 'text-accent' : 'text-text-secondary')}>{icon}</span>
              <div className='flex-1'>
                <div className={cn('text-[13px] font-medium mb-px', isSelected ? 'text-accent' : 'text-text')}>{label}</div>
                <div className='text-[11px] text-text-muted'>{desc}</div>
              </div>
              {!isAvailable && (
                <span className='text-[10px] font-medium text-text-muted bg-surface-2 px-[6px] py-[2px] rounded-[4px] tracking-[0.04em]'>
                  Coming soon
                </span>
              )}
            </button>
          )
        })}
      </div>

      {error && (
        <p className='text-[11px] text-[#c93a3a] mt-[10px]'>{error}</p>
      )}

      {repoPath && (
        <div className='mt-5'>
          <label className='block text-[11px] font-medium text-text-secondary mb-[5px] uppercase tracking-[0.07em]'>
            Selected path
          </label>
          <input
            type="text"
            readOnly
            value={repoPath}
            className='w-full h-[34px] px-[10px] rounded-[6px] border border-border bg-surface text-text text-[12px] outline-none box-border'
          />
        </div>
      )}

      <AnimatePresence>
        {showModal && <CreateRepoModal onClose={() => setShowModal(false)} onCreated={(path) => { setActiveAction('created'); onChange(path) }} />}
      </AnimatePresence>
    </div>
  )
}

export default RepositoryPage
