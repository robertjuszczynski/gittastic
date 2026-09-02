import React, { useContext, useState } from 'react'
import ModalContext from '@renderer/shared/ui/ModalContext'
import { useCreateBranch } from '../api/useBranches'

const CreateBranchModal = () => {
  const [name, setName] = useState('')
  const createBranch = useCreateBranch()
  const { toggleModal } = useContext(ModalContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await createBranch(name.trim())
    toggleModal(null)
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <span className='text-[13px] font-semibold text-text'>New branch</span>
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='branch-name'
        className='bg-surface-2 border border-border rounded-lg px-3 py-2 text-[12px] text-text placeholder-text-muted outline-none focus:border-accent'
      />
      <div className='flex justify-end gap-2'>
        <button
          type='button'
          onClick={() => toggleModal(null)}
          className='px-3 py-1.5 text-[12px] text-text-muted hover:text-text transition-colors'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={!name.trim()}
          className='px-3 py-1.5 text-[12px] bg-accent text-white rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity'
        >
          Create
        </button>
      </div>
    </form>
  )
}

export default CreateBranchModal
