import React, { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export type ToastType = 'error' | 'warning' | 'info' | 'success'

type Toast = { id: number; message: string; type: ToastType }
type ToastContextType = { showToast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

const STYLES: Record<ToastType, { bg: string; border: string; color: string }> = {
  error:   { bg: 'var(--color-remove-bg)',  border: 'rgba(201,58,58,0.3)',   color: 'var(--color-remove)' },
  success: { bg: 'var(--color-add-bg)',     border: 'rgba(26,127,75,0.3)',   color: 'var(--color-add)' },
  info:    { bg: 'var(--color-accent-dim)', border: 'rgba(27,112,248,0.3)',  color: 'var(--color-accent)' },
  warning: { bg: 'rgba(217,119,6,0.08)',    border: 'rgba(217,119,6,0.3)',   color: '#d97706' },
}

const Icons: Record<ToastType, React.ReactNode> = {
  error: (
    <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
      <circle cx='8' cy='8' r='8' opacity='0.18' />
      <path d='M8 4.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4.5zM8 10.5a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z' />
    </svg>
  ),
  warning: (
    <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
      <path d='M7.12 2.3a1 1 0 0 1 1.76 0l5.5 10A1 1 0 0 1 13.5 14h-11a1 1 0 0 1-.88-1.7l5.5-10z' opacity='0.18' />
      <path d='M8 5.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5.5zM8 10.5a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z' />
    </svg>
  ),
  info: (
    <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
      <circle cx='8' cy='8' r='8' opacity='0.18' />
      <path d='M8 4.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75zM7.25 7.5A.75.75 0 0 1 8 6.75h.25a.75.75 0 0 1 .75.75V11a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 1-.25-.75z' />
    </svg>
  ),
  success: (
    <svg width='15' height='15' viewBox='0 0 16 16' fill='currentColor'>
      <circle cx='8' cy='8' r='8' opacity='0.18' />
      <path d='M11.28 5.72a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L4.72 8.78a.75.75 0 1 1 1.06-1.06L7 8.94l3.22-3.22a.75.75 0 0 1 1.06 0z' />
    </svg>
  ),
}

const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
  const s = STYLES[toast.type]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className='flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-lg border min-w-[260px] max-w-[340px] pointer-events-auto'
      style={{ backgroundColor: s.bg, borderColor: s.border, color: s.color }}
    >
      <span className='shrink-0'>{Icons[toast.type]}</span>
      <span className='text-[12px] flex-1 leading-snug'>{toast.message}</span>
      <button
        onClick={onDismiss}
        className='shrink-0 opacity-50 hover:opacity-100 transition-opacity'
      >
        <svg width='11' height='11' viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round'>
          <line x1='2' y1='2' x2='10' y2='10' />
          <line x1='10' y1='2' x2='2' y2='10' />
        </svg>
      </button>
    </motion.div>
  )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className='fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none'>
        <AnimatePresence mode='popLayout'>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
export default ToastContext
