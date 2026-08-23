import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ONBOARDING_CHANNELS } from '@shared'

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
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: 380, background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 12px 40px rgba(0,0,0,0.18)', overflow: 'hidden' }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-divider)', fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
          Create repository
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Name</label>
            <input
              type="text"
              placeholder="my-project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', height: 30, padding: '0 9px', borderRadius: 5, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Location</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="~/Projects"
                value={parentPath}
                readOnly
                style={{ flex: 1, height: 30, padding: '0 9px', borderRadius: 5, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: parentPath ? 'var(--color-text)' : 'var(--color-text-muted)', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                onClick={pickFolder}
                style={{ height: 30, padding: '0 10px', borderRadius: 5, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Browse
              </button>
            </div>
          </div>

          <button
            onClick={() => setReadme(!readme)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 3, border: readme ? '1px solid var(--color-accent)' : '1px solid var(--color-border)', background: readme ? 'var(--color-accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.1s ease' }}>
              {readme && <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Initialize with README</span>
          </button>
        </div>
        <div style={{ padding: '9px 16px', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
          <button onClick={onClose} style={{ height: 28, padding: '0 12px', borderRadius: 5, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={create}
            disabled={!name.trim() || !parentPath || loading}
            style={{ height: 28, padding: '0 14px', borderRadius: 5, border: 'none', background: 'var(--color-accent)', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', opacity: (!name.trim() || !parentPath || loading) ? 0.5 : 1 }}
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '18px 24px 14px' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.03em' }}>
          Open a repository
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Start working, or continue and open one later.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actions.map(({ id, icon, label, desc }) => {
          const isAvailable = id !== 'cloned'
          const isSelected = activeAction === id
          return (
            <button
              key={id}
              onClick={isAvailable ? () => handleAction(id) : undefined}
              disabled={!isAvailable}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: isSelected ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                cursor: isAvailable ? 'pointer' : 'default',
                opacity: isAvailable ? 1 : 0.5,
                transition: 'border-color 0.12s ease, background 0.12s ease',
                WebkitAppRegion: 'no-drag' as any,
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)', flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? 'var(--color-accent)' : 'var(--color-text)', marginBottom: 1 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{desc}</div>
              </div>
              {!isAvailable && (
                <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>
                  Coming soon
                </span>
              )}
            </button>
          )
        })}
      </div>

      {error && (
        <p style={{ fontSize: 11, color: '#c93a3a', marginTop: 10 }}>{error}</p>
      )}

      {repoPath && (
        <div style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Selected path
          </label>
          <input
            type="text"
            readOnly
            value={repoPath}
            style={{
              width: '100%',
              height: 34,
              padding: '0 10px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: 12,
              outline: 'none',
              boxSizing: 'border-box',
            }}
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
