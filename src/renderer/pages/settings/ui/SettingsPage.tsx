import React, { useState } from 'react'
import AiSettingsPage from './AiSettingsPage'

const tabs = [{ id: 'ai', label: 'AI', component: <AiSettingsPage /> }] as const

type TabId = (typeof tabs)[number]['id']

const SettingsPage = () => {
  const [active, setActive] = useState<TabId>('ai')

  const content = tabs.find((t) => t.id === active)?.component

  return (
    <div className='h-screen w-screen flex bg-bg text-text'>
      <nav className='w-44 border-r border-border flex flex-col pt-4'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`text-left px-4 py-2 text-sm rounded-md mx-2 ${
              active === tab.id ? 'bg-surface text-text' : 'text-text-muted hover:bg-surface/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className='flex-1 p-6'>{content}</main>
    </div>
  )
}

export default SettingsPage
