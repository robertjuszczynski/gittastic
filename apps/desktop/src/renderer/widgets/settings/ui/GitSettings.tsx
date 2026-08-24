import React, { useEffect, useState } from 'react'

export const GitSettings = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.electron.GET_USER().then((user) => {
      setName(user.name)
      setEmail(user.email)
    })
  }, [])

  const save = async () => {
    await window.electron.SET_GIT_USER({ name, email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className='max-w-[400px] flex flex-col gap-4'>
      <div>
        <h2 className='text-[15px] font-semibold mb-1'>Git identity</h2>
        <p className='text-[12px] text-text-muted'>Used to attribute your commits — same as git config user.name/email.</p>
      </div>
      {[
        { label: 'Name', value: name, onChange: setName, placeholder: 'Your name', type: 'text' },
        { label: 'Email', value: email, onChange: setEmail, placeholder: 'you@example.com', type: 'email' },
      ].map(({ label, value, onChange, placeholder, type }) => (
        <div key={label}>
          <label className='block text-[11px] font-medium text-text-secondary mb-[5px] uppercase tracking-[0.07em]'>
            {label}
          </label>
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className='w-full h-[34px] px-[10px] rounded-[6px] border border-border bg-surface text-text text-[13px] outline-none box-border'
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
          />
        </div>
      ))}
      <button
        onClick={save}
        className='self-start h-8 px-4 rounded-[6px] border-none bg-accent text-white text-[13px] font-medium cursor-pointer'
      >
        {saved ? 'Saved!' : 'Save'}
      </button>
    </div>
  )
}
