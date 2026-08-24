import { type Dispatch, type SetStateAction } from 'react'
import { ONBOARDING_CHANNELS } from '@shared'
import { validate } from '@onboarding/shared/lib/validate'
import { getFeaturesMap } from '@onboarding/shared/lib/getFeaturesMap'
import { type TFormState } from '../App'

const STEP_SIZES = [
  { w: 400, h: 500 },
  { w: 640, h: 460 },
  { w: 480, h: 500 },
  { w: 700, h: 460 },
  { w: 560, h: 540 },
] as const

const TOTAL_STEPS = 5

type TUseOnboardingNavigation = {
  step: number
  form: TFormState
  setStep: Dispatch<SetStateAction<number>>
  setDirection: Dispatch<SetStateAction<number>>
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
}

export function useOnboardingNavigation({ step, form, setStep, setDirection, setErrors }: TUseOnboardingNavigation) {
  const goNext = () => {
    const errs = validate(step, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    if (step === TOTAL_STEPS - 1) {
      window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_COMPLETE]({
        features: getFeaturesMap(form.complexity),
        provider: form.provider,
        gitUser: { name: form.name, email: form.email },
        repoPath: form.repoPath,
      })
      return
    }
    const nextStep = step + 1
    window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_RESIZE]({ width: STEP_SIZES[nextStep].w, height: STEP_SIZES[nextStep].h })
    setDirection(1)
    setStep(nextStep)
  }

  const goBack = () => {
    setErrors({})
    const prevStep = step - 1
    window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_RESIZE]({ width: STEP_SIZES[prevStep].w, height: STEP_SIZES[prevStep].h })
    setDirection(-1)
    setStep(prevStep)
  }

  const goSkip = () => {
    setErrors({})
    const nextStep = step + 1
    window.onboardingAPI[ONBOARDING_CHANNELS.ONBOARDING_RESIZE]({ width: STEP_SIZES[nextStep].w, height: STEP_SIZES[nextStep].h })
    setDirection(1)
    setStep(nextStep)
  }

  return { goNext, goBack, goSkip }
}
