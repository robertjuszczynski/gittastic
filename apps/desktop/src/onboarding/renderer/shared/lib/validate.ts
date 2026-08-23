type TValidateFields = { name: string; email: string }

export function validate(step: number, form: TValidateFields): Record<string, string> {
  if (step !== 3) return {}
  const errs: Record<string, string> = {}
  if (!form.name.trim()) errs.name = 'Name is required'
  if (!form.email.trim()) errs.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
  return errs
}
