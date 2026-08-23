import type { ThemeColorTokens, ThemeComponentTokens, ThemeTokens } from '@shared'

type CSSVarMap = Record<string, string>

function colorVars(colors: ThemeColorTokens): CSSVarMap {
  return {
    '--color-bg': colors.bg,
    '--color-surface': colors.surface,
    '--color-surface-2': colors.surface2,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-border': colors.border,
    '--color-divider': colors.divider,
    '--color-neutral-100': colors.neutral100,
    '--color-neutral-200': colors.neutral200,
    '--color-neutral-300': colors.neutral300,
    '--color-neutral-400': colors.neutral400,
    '--color-neutral-500': colors.neutral500,
    '--color-neutral-600': colors.neutral600,
    '--color-neutral-700': colors.neutral700,
    '--color-neutral-800': colors.neutral800,
    '--color-neutral-900': colors.neutral900,
    '--color-accent': colors.accent,
    '--color-accent-dim': colors.accentDim,
    '--color-accent-glow': colors.accentGlow,
    '--color-add': colors.add,
    '--color-add-bg': colors.addBg,
    '--color-remove': colors.remove,
    '--color-remove-bg': colors.removeBg,
  }
}

function componentVars(components: ThemeComponentTokens, colors: ThemeColorTokens): CSSVarMap {
  const vars: CSSVarMap = {}

  const c = components

  vars['--comp-toolbar-bg'] = c.toolbar?.bg ?? colors.surface
  vars['--comp-toolbar-border'] = c.toolbar?.border ?? colors.border
  vars['--comp-toolbar-text'] = c.toolbar?.text ?? colors.text

  vars['--comp-sidebar-bg'] = c.sidebar?.bg ?? colors.surface
  vars['--comp-sidebar-border'] = c.sidebar?.border ?? colors.border
  vars['--comp-sidebar-text'] = c.sidebar?.text ?? colors.text

  vars['--comp-divider-color'] = c.divider?.color ?? colors.divider

  vars['--comp-slider-track'] = c.slider?.track ?? colors.neutral700
  vars['--comp-slider-thumb'] = c.slider?.thumb ?? colors.accent
  vars['--comp-slider-thumb-hover'] = c.slider?.thumbHover ?? colors.accentDim

  vars['--comp-scrollbar-thumb'] = c.scrollbar?.thumb ?? colors.neutral700
  vars['--comp-scrollbar-track'] = c.scrollbar?.track ?? 'transparent'

  vars['--comp-input-bg'] = c.input?.bg ?? colors.surface
  vars['--comp-input-border'] = c.input?.border ?? colors.border
  vars['--comp-input-focus-border'] = c.input?.focusBorder ?? colors.accent
  vars['--comp-input-text'] = c.input?.text ?? colors.text
  vars['--comp-input-placeholder'] = c.input?.placeholder ?? colors.textMuted

  vars['--comp-button-bg'] = c.button?.bg ?? colors.surface2
  vars['--comp-button-text'] = c.button?.text ?? colors.text
  vars['--comp-button-hover-bg'] = c.button?.hoverBg ?? colors.neutral700
  vars['--comp-button-border'] = c.button?.border ?? colors.border

  vars['--comp-modal-bg'] = c.modal?.bg ?? colors.bg
  vars['--comp-modal-overlay'] = c.modal?.overlay ?? 'rgba(0, 0, 0, 0.4)'
  vars['--comp-modal-border'] = c.modal?.border ?? colors.border

  vars['--comp-badge-bg'] = c.badge?.bg ?? colors.surface2
  vars['--comp-badge-text'] = c.badge?.text ?? colors.textSecondary

  vars['--comp-tab-active-bg'] = c.tab?.activeBg ?? colors.surface
  vars['--comp-tab-active-text'] = c.tab?.activeText ?? colors.text
  vars['--comp-tab-inactive-text'] = c.tab?.inactiveText ?? colors.textMuted
  vars['--comp-tab-border'] = c.tab?.border ?? colors.border

  vars['--comp-commit-list-bg'] = c.commitList?.bg ?? colors.bg
  vars['--comp-commit-list-hover-bg'] = c.commitList?.hoverBg ?? colors.surface
  vars['--comp-commit-list-active-bg'] = c.commitList?.activeBg ?? colors.surface2

  vars['--comp-diff-add-bg'] = c.diffAdd?.bg ?? colors.addBg
  vars['--comp-diff-add-text'] = c.diffAdd?.text ?? colors.add
  vars['--comp-diff-remove-bg'] = c.diffRemove?.bg ?? colors.removeBg
  vars['--comp-diff-remove-text'] = c.diffRemove?.text ?? colors.remove

  return vars
}

export function resolveTokensToCSSVars(tokens: ThemeTokens): CSSVarMap {
  const vars: CSSVarMap = {
    ...colorVars(tokens.colors),
    ...componentVars(tokens.components ?? {}, tokens.colors),
  }

  if (tokens.fonts) {
    if (tokens.fonts.sans) vars['--font-sans'] = tokens.fonts.sans
    if (tokens.fonts.mono) vars['--font-mono'] = tokens.fonts.mono
  }

  if (tokens.extras) {
    Object.assign(vars, tokens.extras)
  }

  return vars
}
