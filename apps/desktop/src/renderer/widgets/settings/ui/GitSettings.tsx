import React, { useEffect, useState } from 'react'

const GitSettings = () => {
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
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Git identity</h2>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Used to attribute your commits — same as git config user.name/email.</p>
      </div>
      {[
        { label: 'Name', value: name, onChange: setName, placeholder: 'Your name', type: 'text' },
        { label: 'Email', value: email, onChange: setEmail, placeholder: 'you@example.com', type: 'email' },
      ].map(({ label, value, onChange, placeholder, type }) => (
        <div key={label}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {label}
          </label>
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
          />
        </div>
      ))}
      <button
        onClick={save}
        style={{ alignSelf: 'flex-start', height: 32, padding: '0 16px', borderRadius: 6, border: 'none', background: 'var(--color-accent)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
      >
        {saved ? 'Saved!' : 'Save'}
      </button>
    </div>
  )
}

export default GitSettings
