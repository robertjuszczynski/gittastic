import { useState, useEffect } from 'react'
import type { FeatureLevel } from '@shared'
import type { TGitProvider } from '@shared'
import { useOnboardingNavigation } from './lib/useOnboardingNavigation'
import StepShell from '@onboarding/widgets/StepShell'
import WelcomePage from '@onboarding/pages/WelcomePage'
import ComplexityPage from '@onboarding/pages/ComplexityPage'
import ConnectProviderPage from '@onboarding/pages/ConnectProviderPage'
import WhoAreYouPage from '@onboarding/pages/WhoAreYouPage'
import RepositoryPage from '@onboarding/pages/RepositoryPage'

export type TFormState = {
  provider: TGitProvider | null
  complexity: FeatureLevel
  name: string
  email: string
  repoPath: string | null
}

const STEP_OPTIONAL = [false, false, false, false, false]
const TOTAL_STEPS = 5

const App = () => {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<TFormState>({
    provider: null,
    complexity: 'normal',
    name: '',
    email: '',
    repoPath: null,
  })

  useEffect(() => {
    const apply = (dark: boolean) => document.documentElement.classList.toggle('dark', dark)
    apply(window.matchMedia('(prefers-color-scheme: dark)').matches)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const h = (e: MediaQueryListEvent) => apply(e.matches)
    mql.addEventListener('change', h)
    return () => mql.removeEventListener('change', h)
  }, [])

  const { goNext, goBack, goSkip } = useOnboardingNavigation({ step, form, setStep, setDirection, setErrors })

  const nextLabel = step === 2 && !form.provider ? 'Continue without connecting' : undefined
  const nextDisabled = step === 4 && !form.repoPath

  const renderPage = () => {
    switch (step) {
      case 0: return <WelcomePage />
      case 1: return <ComplexityPage complexity={form.complexity} onChange={(level) => setForm((f) => ({ ...f, complexity: level }))} />
      case 2: return <ConnectProviderPage provider={form.provider} onChange={(p) => setForm((f) => ({ ...f, provider: p }))} />
      case 3: return <WhoAreYouPage name={form.name} email={form.email} errors={errors} onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))} />
      case 4: return <RepositoryPage repoPath={form.repoPath} onChange={(path) => setForm((f) => ({ ...f, repoPath: path }))} />
      default: return null
    }
  }

  return (
    <StepShell
      step={step}
      direction={direction}
      total={TOTAL_STEPS}
      isFirst={step === 0}
      isLast={step === TOTAL_STEPS - 1}
      isOptional={STEP_OPTIONAL[step]}
      nextLabel={nextLabel}
      nextDisabled={nextDisabled}
      onBack={goBack}
      onSkip={goSkip}
      onNext={goNext}
    >
      {renderPage()}
    </StepShell>
  )
}

export default App
