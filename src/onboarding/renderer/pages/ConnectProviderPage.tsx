import React, { useEffect, useState } from 'react'
import { ONBOARDING_CHANNELS, type TGitProvider } from '@shared'
import GitHubIcon from '@onboarding/shared/ui/icons/GitHubIcon'
import GitLabIcon from '@onboarding/shared/ui/icons/GitLabIcon'
import BitbucketIcon from '@onboarding/shared/ui/icons/BitbucketIcon'
import AzureIcon from '@onboarding/shared/ui/icons/AzureIcon'
import ChevronRightIcon from '@onboarding/shared/ui/icons/ChevronRightIcon'
import CheckIcon from '@onboarding/shared/ui/icons/CheckIcon'

type TProviderConfig = {
  id: TGitProvider
  label: string
  color: string
  icon: React.ReactNode
  available: boolean
}

const providers: TProviderConfig[] = [
  { id: 'github', label: 'GitHub', color: '#24292e', icon: <GitHubIcon size={16} />, available: true },
  { id: 'gitlab', label: 'GitLab', color: '#e24329', icon: <GitLabIcon size={16} />, available: false },
  { id: 'bitbucket', label: 'Bitbucket', color: '#0052cc', icon: <BitbucketIcon size={16} />, available: false },
  { id: 'azure', label: 'Azure DevOps', color: '#0078d4', icon: <AzureIcon size={16} />, available: false },
]

type TConnectProviderPageProps = {
  provider: TGitProvider | null
  onChange: (p: TGitProvider | null) => void
}

const ConnectProviderPage = ({ provider, onChange }: TConnectProviderPageProps) => {
  const [connected, setConnected] = useState<TGitProvider | null>(provider)

  useEffect(() => {
    return window.onboardingEventsAPI.onGithubAuthResult((data) => {
      if (data.code) {
        setConnected('github')
        onChange('github')
      }
    })
  }, [])

  const handleGitHub = () => {
    if (connected === 'github') {
      setConnected(null)
      onChange(null)
    } else {
      window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_GITHUB_AUTH_START]()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.03em' }}>
          Connect your git provider
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Link an account so Gittastic can see your repos, or skip and add them locally.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {providers.map(({ id, label, color, icon, available }) => {
          const isConnected = connected === id
          return (
            <button
              key={id}
              onClick={available ? (id === 'github' ? handleGitHub : undefined) : undefined}
              disabled={!available}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                border: isConnected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: isConnected ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                cursor: available ? 'pointer' : 'default',
                opacity: available ? 1 : 0.5,
                transition: 'border-color 0.12s ease, background 0.12s ease',
                WebkitAppRegion: 'no-drag' as any,
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
              }}>
                {icon}
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: isConnected ? 'var(--color-accent)' : 'var(--color-text)' }}>
                {label}
              </span>
              {!available && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-surface-2)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  letterSpacing: '0.04em',
                }}>
                  Coming soon
                </span>
              )}
              {available && isConnected && (
                <span style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center' }}>
                  <CheckIcon />
                </span>
              )}
              {available && !isConnected && (
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                  <ChevronRightIcon />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ConnectProviderPage
