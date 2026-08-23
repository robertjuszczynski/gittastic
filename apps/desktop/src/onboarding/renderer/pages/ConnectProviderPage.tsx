import React, { useEffect, useState } from 'react'
import { ONBOARDING_CHANNELS, type TGitProvider } from '@shared'
import GitHubIcon from '@onboarding/shared/ui/icons/GitHubIcon'
import GitLabIcon from '@onboarding/shared/ui/icons/GitLabIcon'
import BitbucketIcon from '@onboarding/shared/ui/icons/BitbucketIcon'
import AzureIcon from '@onboarding/shared/ui/icons/AzureIcon'
import ChevronRightIcon from '@onboarding/shared/ui/icons/ChevronRightIcon'
import CheckIcon from '@onboarding/shared/ui/icons/CheckIcon'
import { cn } from '@renderer/shared/lib'

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
    <div className='flex flex-col justify-center h-full px-8'>
      <div className='mb-5'>
        <h1 className='text-[22px] font-bold text-text mb-2 tracking-[-0.03em]'>
          Connect your git provider
        </h1>
        <p className='text-[13px] text-text-muted leading-[1.6]'>
          Link an account so Gittastic can see your repos, or skip and add them locally.
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        {providers.map(({ id, label, color, icon, available }) => {
          const isConnected = connected === id
          return (
            <button
              key={id}
              onClick={available ? (id === 'github' ? handleGitHub : undefined) : undefined}
              disabled={!available}
              className={cn(
                'flex items-center gap-3 px-[14px] py-[10px] rounded-[8px] border text-left w-full transition-[border-color,background] duration-[120ms] ease-linear',
                isConnected ? 'border-accent bg-accent-dim' : 'border-border bg-surface',
                available ? 'cursor-pointer' : 'cursor-default opacity-50'
              )}
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
              <div
                className='w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-white shrink-0'
                style={{ background: color }}
              >
                {icon}
              </div>
              <span className={cn('flex-1 text-[13px] font-medium', isConnected ? 'text-accent' : 'text-text')}>
                {label}
              </span>
              {!available && (
                <span className='text-[10px] font-medium text-text-muted bg-surface-2 px-[6px] py-[2px] rounded-[4px] tracking-[0.04em]'>
                  Coming soon
                </span>
              )}
              {available && isConnected && (
                <span className='text-accent flex items-center'>
                  <CheckIcon />
                </span>
              )}
              {available && !isConnected && (
                <span className='text-text-muted flex items-center'>
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
